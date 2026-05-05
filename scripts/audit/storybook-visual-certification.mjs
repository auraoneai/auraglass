#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const repoRoot = process.cwd();
const storybookUrl = process.env.STORYBOOK_URL || "http://localhost:6007";
const concurrency = Number(process.env.CERT_CONCURRENCY || "4");
const renderTimeoutMs = Number(process.env.CERT_RENDER_TIMEOUT_MS || "20000");
const rootWaitTimeoutMs = Number(process.env.CERT_ROOT_WAIT_TIMEOUT_MS || "8000");
const settleWaitMs = Number(process.env.CERT_SETTLE_WAIT_MS || "100");
const componentFilter = new Set(
  (process.env.CERT_COMPONENTS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);
const outputDir = path.join(
  repoRoot,
  "reports",
  "glassmorphism-storybook-visual-certification"
);
const screenshotDir = path.join(outputDir, "screenshots");
const jsonReportPath = path.join(
  repoRoot,
  "reports",
  "glassmorphism-storybook-visual-certification.json"
);
const markdownReportPath = path.join(
  repoRoot,
  "reports",
  "glassmorphism-storybook-visual-certification.md"
);

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const normalizeName = (value) =>
  value
    .toLowerCase()
    .replace(/\.(stories|test|spec)?\.?tsx?$/, "")
    .replace(/\.md$/, "")
    .replace(/^glass/, "")
    .replace(/[^a-z0-9]/g, "");

const candidateNames = (componentName) =>
  new Set([
    normalizeName(componentName),
    normalizeName(componentName.replace(/^Glass/, "")),
    normalizeName(`Glass${componentName}`),
  ]);

const hasDirectMatch = (set, componentName) =>
  [...candidateNames(componentName)].some((name) => set.has(name));

const storyFileNameSet = (entries) =>
  new Set(
    entries
      .map((entry) =>
        entry.importPath
          ? normalizeName(path.basename(entry.importPath))
          : normalizeName(entry.title || "")
      )
      .filter(Boolean)
  );

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const componentIdentityKey = (component) =>
  `${component.category || "uncategorized"}:${component.path}`;

const componentScreenshotSlug = (component) =>
  slug(component.path.replace(/\.[cm]?[jt]sx?$/, ""));

const generatedCertificationStoryPath =
  "src/stories/GlassMissingInventoryCertification.stories.tsx";

const isGeneratedCertificationStory = (entry) =>
  String(entry.importPath || "").endsWith(
    "GlassMissingInventoryCertification.stories.tsx"
  );

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const storyNameForMatch = (entry) => {
  const titleLeaf = String(entry.title || "").split("/").pop() || "";
  const importLeaf = entry.importPath
    ? path.basename(entry.importPath).replace(/\.stories\.[^.]+$/, "")
    : "";
  return new Set([
    normalizeName(titleLeaf),
    normalizeName(importLeaf),
    normalizeName(entry.name || ""),
    normalizeName(`${titleLeaf}${entry.name || ""}`),
  ]);
};

const isDocsEntry = (entry) =>
  entry.type === "docs" || String(entry.id || "").endsWith("--docs");

const rankStory = (entry) => {
  const name = normalizeName(entry.name || "");
  if (name === "default") return 0;
  if (name === "primary") return 1;
  if (name.includes("basic")) return 2;
  if (name.includes("variants")) return 3;
  return 10;
};

const storyRankForComponent = (entry, component) => {
  const importPath = String(entry.importPath || "");
  const expectedStoryPath = `src/${component.path.replace(
    /\.[cm]?[jt]sx?$/,
    ".stories.tsx"
  )}`;
  const componentDir = path.dirname(component.path);
  let score = rankStory(entry);

  if (importPath.endsWith(expectedStoryPath)) score -= 100;
  if (importPath.includes(componentDir)) score -= 25;
  if (isGeneratedCertificationStory(entry)) score += 100;

  return score;
};

const findStoriesForComponent = (entries, component) => {
  const candidates = candidateNames(component.name);
  const direct = entries.filter((entry) => {
    if (isDocsEntry(entry)) return false;
    const names = storyNameForMatch(entry);
    return [...candidates].some((candidate) => names.has(candidate));
  });

  return direct.sort(
    (a, b) =>
      storyRankForComponent(a, component) -
      storyRankForComponent(b, component)
  );
};

const inspectRenderedStory = async (page) =>
  page.evaluate(() => {
    const root =
      document.querySelector("#storybook-root") ||
      document.querySelector("#root") ||
      document.body;
    const rect = root.getBoundingClientRect();
    const visibleElements = [...root.querySelectorAll("*")].filter((node) => {
      const style = window.getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || "1") > 0.01 &&
        box.width > 1 &&
        box.height > 1
      );
    });
    const glassElements = [...root.querySelectorAll('[class*="glass"], [class*="Glass"], [data-glass-component]')];
    const focusableElements = [
      ...root.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ),
    ];
    const text = root.textContent?.replace(/\s+/g, " ").trim() || "";
    const certificationFallback = root.querySelector("[data-certification-fallback]");

    return {
      rootWidth: Math.round(rect.width),
      rootHeight: Math.round(rect.height),
      visibleElementCount: visibleElements.length,
      glassElementCount: glassElements.length,
      focusableElementCount: focusableElements.length,
      textLength: text.length,
      hasCanvas: Boolean(root.querySelector("canvas")),
      hasSvg: Boolean(root.querySelector("svg")),
      hasCertificationFallback: Boolean(certificationFallback),
      bodyTextSample: text.slice(0, 160),
    };
  });

const renderComponent = async ({ browser, component, stories }) => {
  const componentSlug = componentScreenshotSlug(component);
  const componentDir = path.join(screenshotDir, componentSlug);
  ensureDir(componentDir);

  if (stories.length === 0) {
    return {
      identityKey: componentIdentityKey(component),
      name: component.name,
      category: component.category,
      sourcePath: `src/${component.path}`,
      storyPaths: [],
      storyIds: [],
      viewportsInspected: [],
      themesInspected: [],
      statesInspected: [],
      screenshots: [],
      consoleErrors: [],
      issuesFound: [
        "No direct Storybook story ID matched this inventory component.",
      ],
      fixesApplied: [],
      status: "missing-story",
      verifiedCommands: [],
      inspectedBy: "Codex Storybook visual certification runner",
      inspectedAt: new Date().toISOString(),
    };
  }

  const story = stories[0];
  const screenshots = [];
  const consoleErrors = [];
  const issues = [];
  const inspections = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(renderTimeoutMs);
    page.setDefaultNavigationTimeout(renderTimeoutMs);

    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleErrors.push({
          viewport: viewport.name,
          type: message.type(),
          text: message.text().slice(0, 500),
        });
      }
    });
    page.on("pageerror", (error) => {
      consoleErrors.push({
        viewport: viewport.name,
        type: "pageerror",
        text: error.message.slice(0, 500),
      });
    });

    const url = `${storybookUrl}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
    const screenshotPath = path.join(componentDir, `${viewport.name}.png`);

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: renderTimeoutMs,
      });
      await page.waitForFunction(
        () => {
          const root =
            document.querySelector("#storybook-root") ||
            document.querySelector("#root");
          if (!root) return false;
          const box = root.getBoundingClientRect();
          if (box.width <= 0 || box.height <= 0) return false;
          const text = root.textContent?.trim() || "";
          const hasVisualSurface = Boolean(root.querySelector("canvas, svg, img, video"));
          const visibleChildren = [...root.querySelectorAll("*")].some((node) => {
            const style = window.getComputedStyle(node);
            const childBox = node.getBoundingClientRect();
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              Number(style.opacity || "1") > 0.01 &&
              childBox.width > 1 &&
              childBox.height > 1
            );
          });
          const looksLikeStorybookSpinner =
            box.width <= 48 && box.height <= 48 && !text && !hasVisualSurface;
          return !looksLikeStorybookSpinner && (text.length > 0 || hasVisualSurface || visibleChildren);
        },
        { timeout: rootWaitTimeoutMs }
      );
      await page.waitForTimeout(settleWaitMs);

      const inspection = await inspectRenderedStory(page);
      inspections.push({ viewport: viewport.name, ...inspection });

      if (inspection.visibleElementCount === 0) {
        issues.push(`${viewport.name}: no visible rendered elements found.`);
      }
      if (inspection.rootWidth < 10 || inspection.rootHeight < 10) {
        issues.push(`${viewport.name}: rendered root is too small to inspect.`);
      }
      if (
        inspection.glassElementCount === 0 &&
        !inspection.hasCanvas &&
        !inspection.hasSvg
      ) {
        issues.push(
          `${viewport.name}: no glass-named, canvas, or svg surface detected.`
        );
      }
      if (inspection.hasCertificationFallback) {
        issues.push(
          `${viewport.name}: certification fallback rendered instead of the inventory component.`
        );
      }

      await page.screenshot({ path: screenshotPath, fullPage: false });
      screenshots.push(path.relative(repoRoot, screenshotPath));
    } catch (error) {
      issues.push(`${viewport.name}: render failed - ${error.message}`);
    } finally {
      await context.close();
    }
  }

  const blockingErrors = consoleErrors.filter((entry) => {
    if (entry.type === "warning") return false;
    return /failed to fetch dynamically imported module|error rendering story|uncaught|referenceerror|typeerror|syntaxerror|failed to execute/i.test(
      entry.text
    );
  });
  if (blockingErrors.length > 0) {
    issues.push(`Runtime console/page errors found: ${blockingErrors.length}.`);
  }

  return {
    identityKey: componentIdentityKey(component),
    name: component.name,
    category: component.category,
    sourcePath: `src/${component.path}`,
    storyPaths: [...new Set(stories.map((entry) => entry.importPath).filter(Boolean))],
    storyIds: [story.id],
    viewportsInspected: viewports.map((viewport) => viewport.name),
    themesInspected: ["storybook-default-dark"],
    statesInspected: ["selected-story-default", "reduced-motion"],
    screenshots,
    consoleErrors,
    issuesFound: issues,
    inspections,
    fixesApplied: [],
    status: issues.length > 0 ? "blocked" : "passed",
    verifiedCommands: [
      `STORYBOOK_URL=${storybookUrl} node scripts/audit/storybook-visual-certification.mjs`,
    ],
    inspectedBy: "Codex Storybook visual certification runner",
    inspectedAt: new Date().toISOString(),
  };
};

const runPool = async ({ items, limit, worker }) => {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(Math.max(limit, 1), items.length) },
    async () => {
      while (nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        results[index] = await worker(items[index], index);
      }
    }
  );
  await Promise.all(workers);
  return results;
};

const writeMarkdown = ({ entries, storybookEntryCount }) => {
  const counts = entries.reduce(
    (acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1;
      return acc;
    },
    { passed: 0, fixed: 0, blocked: 0, "missing-story": 0 }
  );
  const blocked = entries.filter((entry) =>
    ["blocked", "missing-story"].includes(entry.status)
  );
  const isComplete = blocked.length === 0;

  const lines = [
    "# AuraGlass Storybook Visual Certification",
    "",
    isComplete
      ? "Certification complete: all inventory components were visually inspected and passed/fixed."
      : "Certification incomplete: not all inventory components could be visually certified.",
    "",
    `- Inventory components: ${entries.length}`,
    `- Storybook entries discovered: ${storybookEntryCount}`,
    `- Passed: ${counts.passed || 0}`,
    `- Fixed: ${counts.fixed || 0}`,
    `- Blocked: ${counts.blocked || 0}`,
    `- Missing story: ${counts["missing-story"] || 0}`,
    `- Screenshot root: \`${path.relative(repoRoot, screenshotDir)}\``,
    "",
    "## Blockers",
    "",
  ];

  if (blocked.length === 0) {
    lines.push("- None.");
  } else {
    for (const entry of blocked) {
      lines.push(
        `- **${entry.name}** (${entry.status}): ${entry.issuesFound[0] || "See JSON report."}`
      );
    }
  }

  lines.push(
    "",
    "## Completion Gate",
    "",
    isComplete
      ? "This report can be used to claim full certification for the inventory snapshot it references."
      : "This report must not be used to claim full certification while any component is `blocked` or `missing-story`.",
    "",
    "## Evidence",
    "",
    `- JSON report: \`${path.relative(repoRoot, jsonReportPath)}\``,
    `- Screenshots: \`${path.relative(repoRoot, screenshotDir)}\``
  );

  fs.writeFileSync(markdownReportPath, `${lines.join("\n")}\n`);
};

const main = async () => {
  ensureDir(outputDir);
  fs.rmSync(screenshotDir, { recursive: true, force: true });
  ensureDir(screenshotDir);

  const inventory = readJson("reports/component_inventory.json");
  const response = await fetch(`${storybookUrl}/index.json`);
  if (!response.ok) {
    throw new Error(`Unable to fetch Storybook index: ${response.status}`);
  }
  const index = await response.json();
  const entries = Object.values(index.entries || index.stories || {});
  const storyEntries = entries.filter((entry) => !isDocsEntry(entry));
  const storyFileNames = storyFileNameSet(storyEntries);

  const componentStoryMap = new Map();
  for (const component of inventory.components) {
    componentStoryMap.set(
      componentIdentityKey(component),
      findStoriesForComponent(storyEntries, component)
    );
  }

  const componentsToInspect =
    componentFilter.size > 0
      ? inventory.components.filter((component) => componentFilter.has(component.name))
      : inventory.components;

  const browser = await chromium.launch();
  let inspected = 0;
  let reportEntries = [];
  try {
    reportEntries = await runPool({
      items: componentsToInspect,
      limit: concurrency,
      worker: async (component) => {
      const stories = componentStoryMap.get(componentIdentityKey(component)) || [];
        inspected += 1;
      console.log(
          `[${inspected}/${componentsToInspect.length}] ${component.name} (${stories[0]?.id || "missing-story"})`
      );
        return renderComponent({ browser, component, stories });
      },
    });
  } finally {
    await browser.close();
  }

  const statusCounts = reportEntries.reduce((acc, entry) => {
    acc[entry.status] = (acc[entry.status] || 0) + 1;
    return acc;
  }, {});
  const screenshotCount = reportEntries.reduce(
    (total, entry) =>
      total + (Array.isArray(entry.screenshots) ? entry.screenshots.length : 0),
    0
  );
  const passedOrFixedEntries = reportEntries.filter((entry) =>
    ["passed", "fixed"].includes(entry.status)
  );
  const missingDirectStoryIdentities = new Set(
    componentsToInspect
      .filter((component) => !hasDirectMatch(storyFileNames, component.name))
      .map((component) => componentIdentityKey(component))
  );
  const generatedEntries = passedOrFixedEntries.filter((entry) =>
    missingDirectStoryIdentities.has(entry.identityKey)
  );
  const selectedGeneratedStoryCount = passedOrFixedEntries.filter((entry) =>
    entry.storyIds.some((storyId) =>
      String(storyId || "").startsWith(
        "certification-missing-inventory-components--"
      )
    )
  );
  const generatedTotal = missingDirectStoryIdentities.size;

  const report = {
    objective:
      "Confirm whether all AuraGlass inventory components are visually correct in Storybook.",
    storybookUrl,
    inventoryCount: inventory.components.length,
    storybookEntryCount: entries.length,
    viewports: viewports.map((viewport) => viewport.name),
    expectedScreenshotCount: componentsToInspect.length * viewports.length,
    screenshotCount,
    statusCounts,
    selectedGeneratedStoryCount: selectedGeneratedStoryCount.length,
    generatedCertificationStoryCoverage: {
      covered: generatedEntries.length,
      total: generatedTotal,
      percent:
        generatedTotal === 0
          ? 0
          : Number(((generatedEntries.length / generatedTotal) * 100).toFixed(1)),
      storyPath: generatedCertificationStoryPath,
    },
    generatedAt: new Date().toISOString(),
    entries: reportEntries,
  };

  fs.writeFileSync(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
  writeMarkdown({ entries: reportEntries, storybookEntryCount: entries.length });

  console.log("\nCertification report written:");
  console.log(`- ${path.relative(repoRoot, jsonReportPath)}`);
  console.log(`- ${path.relative(repoRoot, markdownReportPath)}`);
  console.log("Status counts:", statusCounts);

  if ((statusCounts.blocked || 0) > 0 || (statusCounts["missing-story"] || 0) > 0) {
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
