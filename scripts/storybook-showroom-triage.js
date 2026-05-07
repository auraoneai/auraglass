#!/usr/bin/env node

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("@playwright/test");

const storybookUrl =
  process.env.STORYBOOK_URL || process.argv[2] || "http://localhost:6006";
const repoRoot = process.cwd();
const reportDir = path.join(repoRoot, "reports");
const jsonReportPath = path.join(reportDir, "storybook-showroom-triage.json");
const markdownReportPath = path.join(reportDir, "storybook-showroom-triage.md");

const samples = [
  ["Curated", "curated-start-here--guide", "Curated/Start Here"],
  [
    "Showcase",
    "showcase-liquidglassshowcase--app-experience",
    "Showcase/LiquidGlassShowcase",
    "previewMode:liquid",
  ],
  [
    "Showcase",
    "showcase-liquidglassstatematrix--light-dark-dense-media",
    "Showcase/LiquidGlassStateMatrix",
    "previewMode:liquid",
  ],
  [
    "Liquid Glass",
    "primitives-liquidglassmaterial--quality-comparison",
    "Primitives/LiquidGlassMaterial",
    "previewMode:liquid",
  ],
  [
    "Button",
    "button-liquidglassbuttonstyle--prominent",
    "Button/LiquidGlassButtonStyle",
    "previewMode:liquid",
  ],
  [
    "Media",
    "media-liquidglassmediacontrols--clear-over-media",
    "Media/LiquidGlassMediaControls",
    "previewMode:liquid",
  ],
  [
    "Media",
    "media-liquidglassnowplayingbar--default",
    "Media/LiquidGlassNowPlayingBar",
    "previewMode:liquid",
  ],
  [
    "Navigation",
    "navigation-liquidglassinsetsidebar--default",
    "Navigation/LiquidGlassInsetSidebar",
    "previewMode:liquid",
  ],
  [
    "Navigation",
    "navigation-liquidglasstabbar--with-search-tab",
    "Navigation/LiquidGlassTabBar",
    "previewMode:liquid",
  ],
  [
    "Navigation",
    "navigation-liquidglasstoolbar--default",
    "Navigation/LiquidGlassToolbar",
    "previewMode:liquid",
  ],
  [
    "Data Display",
    "data-display-liquidglassbadgecluster--collapsed",
    "Data Display/LiquidGlassBadgeCluster",
    "previewMode:liquid",
  ],
  [
    "Data Display",
    "data-display-liquidglasscarouselrail--default",
    "Data Display/LiquidGlassCarouselRail",
    "previewMode:liquid",
  ],
  [
    "Advanced",
    "components-advanced-liquidglassgpu--default",
    "Components/Advanced/LiquidGlassGPU",
    "previewMode:liquid",
  ],
  [
    "Advanced",
    "components-advanced-glasswebglshader--default",
    "Components/Advanced/GlassWebGLShader",
    "previewMode:liquid",
  ],
  [
    "Interactive",
    "components-interactive-glasscarousel--default",
    "Components/Interactive/GlassCarousel",
    "previewMode:liquid",
  ],
  [
    "Interactive",
    "components-interactive-glasscommandpalette--default",
    "Components/Interactive/GlassCommandPalette",
    "previewMode:liquid",
  ],
].map(([family, id, title, globals]) => ({ family, id, title, globals }));

const targetFamilies = [
  "Curated",
  "Showcase",
  "Liquid Glass",
  "Media",
  "Button",
  "Navigation",
  "Data Display",
  "Advanced",
  "Interactive",
];

const storybookErrorTextPatterns = [
  /The component failed to render/i,
  /StorybookError/i,
  /Couldn't find story/i,
  /Cannot find module/i,
  /Failed to fetch dynamically imported module/i,
  /Minified React error/i,
  /No Preview/i,
  /Cannot read properties of/i,
];

const ignoredConsoleErrorPatterns = [
  /Warning: .*a style property during rerender/i,
  /Error loading story index:/i,
  /getStoryIndexFromServer/i,
  /Failed to fetch[\s\S]*storybook_internal_preview_runtime/i,
  /ResizeObserver loop completed with undelivered notifications/i,
];

const fetchJson = (url) =>
  new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`${url} returned ${response.statusCode}`));
            return;
          }
          resolve(JSON.parse(body));
        });
      })
      .on("error", reject);
  });

const storyUrl = (sample) => {
  const params = new URLSearchParams({
    id: sample.id,
    viewMode: "story",
  });

  if (sample.globals) params.set("globals", sample.globals);

  return `${storybookUrl}/iframe.html?${params.toString()}`;
};

const isIgnoredConsoleError = (message) =>
  ignoredConsoleErrorPatterns.some((pattern) => pattern.test(message));

const familiesForEntry = (entry) => {
  const title = entry.title || "";
  const id = entry.id || "";
  const families = [];

  if (title.startsWith("Curated/")) families.push("Curated");
  if (title.startsWith("Showcase/") || title.includes("/Showcase/")) {
    families.push("Showcase");
  }
  for (const family of targetFamilies) {
    if (["Curated", "Showcase", "Liquid Glass"].includes(family)) continue;
    if (title.startsWith(`${family}/`) || title.startsWith(`Components/${family}/`)) {
      families.push(family);
    }
  }
  if (/liquid[- ]?glass/i.test(`${title} ${id}`)) families.push("Liquid Glass");

  return [...new Set(families)];
};

const readCompositionMetrics = async (page) =>
  page.evaluate(() => {
    const isElementVisible = (element) => {
      const style = window.getComputedStyle(element);
      const box = element.getBoundingClientRect();

      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.01 &&
        box.width > 1 &&
        box.height > 1
      );
    };

    const hasPaintSignal = (element) => {
      const style = window.getComputedStyle(element);
      const tag = element.tagName.toLowerCase();
      const borderPainted = ["top", "right", "bottom", "left"].some(
        (side) =>
          Number.parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0
      );

      return (
        (style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
          style.backgroundColor !== "transparent") ||
        borderPainted ||
        style.boxShadow !== "none" ||
        style.backgroundImage !== "none" ||
        ["canvas", "svg", "img", "video", "button", "input"].includes(tag) ||
        (element.textContent || "").trim().length > 0
      );
    };

    const root = document.querySelector("#storybook-root") || document.body;
    const rootRect = root.getBoundingClientRect();
    const painted = Array.from(document.body.querySelectorAll("*"))
      .filter((element) => isElementVisible(element) && hasPaintSignal(element))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, rect.x);
        const y = Math.max(0, rect.y);
        const right = Math.min(window.innerWidth, rect.right);
        const bottom = Math.min(window.innerHeight, rect.bottom);

        if (right <= x || bottom <= y) return null;

        return {
          x,
          y,
          right,
          bottom,
          width: right - x,
          height: bottom - y,
          textLength: (element.textContent || "").trim().length,
        };
      })
      .filter(Boolean);

    const contentBounds = painted.reduce((bounds, box) => {
      if (!bounds) return { ...box };
      const next = {
        x: Math.min(bounds.x, box.x),
        y: Math.min(bounds.y, box.y),
        right: Math.max(bounds.right, box.right),
        bottom: Math.max(bounds.bottom, box.bottom),
      };
      next.width = next.right - next.x;
      next.height = next.bottom - next.y;
      return next;
    }, null);

    return {
      bodyText: document.body.innerText || "",
      contentBounds,
      debugElementCount: document.querySelectorAll(".liquid-glass-debug").length,
      largestPaintedArea: Math.max(0, ...painted.map((box) => box.width * box.height)),
      rootBox: {
        x: rootRect.x,
        y: rootRect.y,
        width: rootRect.width,
        height: rootRect.height,
      },
      storybookErrorElementCount: Array.from(
        document.querySelectorAll(
          ".sb-errordisplay, [data-testid='storybook-error'], #error-message"
        )
      ).filter(isElementVisible).length,
      visiblePaintedElementCount: painted.length,
      visibleTextLength: painted.reduce((total, box) => total + box.textLength, 0),
    };
  });

const probeSample = async (page, sample) => {
  const consoleErrors = [];
  const uncaughtErrors = [];
  const onConsole = (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  };
  const onPageError = (error) => uncaughtErrors.push(error.message);

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  try {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(storyUrl(sample), {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    });
    await page.waitForSelector("#storybook-root", { timeout: 10_000 });
    await page.waitForTimeout(750);

    const screenshot = await page.screenshot({ fullPage: true });
    const metrics = await readCompositionMetrics(page);
    const hasStorybookErrorText = storybookErrorTextPatterns.some((pattern) =>
      pattern.test(metrics.bodyText)
    );
    const severeConsoleErrors = consoleErrors.filter(
      (message) => !isIgnoredConsoleError(message)
    );
    const flags = [];

    if (screenshot.length < 40_000) flags.push("low-screenshot-bytes");
    if (!metrics.contentBounds) flags.push("missing-content-bounds");
    if (metrics.contentBounds && metrics.contentBounds.width < 320) {
      flags.push("tiny-content-width");
    }
    if (metrics.contentBounds && metrics.contentBounds.height < 180) {
      flags.push("tiny-content-height");
    }
    if (metrics.visiblePaintedElementCount < 4) flags.push("low-paint-count");
    if (metrics.debugElementCount > 0) flags.push("debug-overlay-visible");
    if (metrics.storybookErrorElementCount > 0 || hasStorybookErrorText) {
      flags.push("storybook-error-screen");
    }
    if (uncaughtErrors.length > 0) flags.push("uncaught-error");
    if (severeConsoleErrors.length > 0) flags.push("severe-console-error");
    if (consoleErrors.length > severeConsoleErrors.length) {
      flags.push("filtered-console-noise");
    }

    return {
      ...sample,
      status: flags.length === 0 ? "pass" : "risk",
      flags,
      screenshotBytes: screenshot.length,
      metrics: {
        ...metrics,
        bodyText: metrics.bodyText.slice(0, 500),
      },
      consoleErrorCount: consoleErrors.length,
      severeConsoleErrors,
      uncaughtErrors,
    };
  } catch (error) {
    return {
      ...sample,
      status: "risk",
      flags: ["probe-failed"],
      error: error.message,
      consoleErrorCount: consoleErrors.length,
      uncaughtErrors,
    };
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
};

const writeReports = (report) => {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);

  const rows = report.probes
    .map(
      (probe) =>
        `| ${probe.family} | ${probe.id} | ${probe.status} | ${
          probe.flags.length ? probe.flags.join(", ") : "-"
        } | ${probe.screenshotBytes || "-"} | ${
          probe.metrics?.contentBounds
            ? `${Math.round(probe.metrics.contentBounds.width)}x${Math.round(
                probe.metrics.contentBounds.height
              )}`
            : "-"
        } | ${probe.consoleErrorCount || 0} |`
    )
    .join("\n");

  const markdown = [
    "# Storybook Showroom Triage",
    "",
    `Generated: ${report.generatedAt}`,
    `Storybook: ${report.storybookUrl}`,
    `Index story count: ${report.storyCount}`,
    "",
    "## Target Family Inventory",
    "",
    ...targetFamilies.map(
      (family) => `- ${family}: ${report.familyCounts[family] || 0}`
    ),
    "",
    "## Probed Public Showroom Stories",
    "",
    "| Family | Story ID | Status | Flags | Screenshot bytes | Content bounds | Console errors |",
    "| --- | --- | --- | --- | ---: | ---: | ---: |",
    rows,
    "",
    "## Notes",
    "",
    "- `filtered-console-noise` means the story logged known Storybook/HMR or React warning noise that is not treated as a fatal composition failure by the focused Playwright QA.",
    "- This report intentionally probes a representative high-risk showroom matrix instead of every Storybook entry.",
    "",
  ].join("\n");

  fs.writeFileSync(markdownReportPath, markdown);
};

(async () => {
  const index = await fetchJson(`${storybookUrl}/index.json`);
  const entries = Object.values(index.entries || {}).filter(
    (entry) => entry.type === "story"
  );
  const familyCounts = Object.fromEntries(
    targetFamilies.map((family) => [family, 0])
  );

  for (const entry of entries) {
    for (const family of familiesForEntry(entry)) {
      familyCounts[family] += 1;
    }
  }

  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const missingSamples = samples.filter((sample) => !entriesById.has(sample.id));

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const probes = [];

  for (const sample of samples.filter((sample) => entriesById.has(sample.id))) {
    probes.push(await probeSample(page, sample));
  }

  await browser.close();

  const report = {
    generatedAt: new Date().toISOString(),
    storybookUrl,
    storyCount: entries.length,
    familyCounts,
    missingSamples,
    probes,
    riskCount: probes.filter((probe) => probe.status === "risk").length,
  };

  writeReports(report);

  console.log(`Wrote ${path.relative(repoRoot, jsonReportPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, markdownReportPath)}`);
  console.log(`Probed ${probes.length} stories; risk count: ${report.riskCount}`);

  if (process.argv.includes("--fail-on-risk") && report.riskCount > 0) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
