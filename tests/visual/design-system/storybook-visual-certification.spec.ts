import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const reportPath = path.join(
  repoRoot,
  "reports/glassmorphism-storybook-visual-certification.json"
);
const summaryPath = path.join(
  repoRoot,
  "reports/glassmorphism-storybook-visual-certification.md"
);
const inventoryPath = path.join(repoRoot, "reports/component_inventory.json");

type CertificationEntry = {
  identityKey: string;
  name: string;
  category: string;
  sourcePath: string;
  status: "passed" | "fixed" | "blocked" | "missing-story";
  storyIds: string[];
  viewportsInspected: string[];
  screenshots: string[];
};

type CertificationReport = {
  inventoryCount: number;
  expectedScreenshotCount: number;
  screenshotCount: number;
  selectedGeneratedStoryCount: number;
  statusCounts: Record<string, number>;
  viewports: string[];
  generatedCertificationStoryCoverage: {
    covered: number;
    total: number;
    percent: number;
    storyPath: string;
  };
  entries: CertificationEntry[];
};

const componentIdentityKey = (component: { category?: string; path: string }) =>
  `${component.category || "uncategorized"}:${component.path}`;

const countByName = (names: string[]) =>
  names.reduce<Record<string, number>>((counts, name) => {
    counts[name] = (counts[name] || 0) + 1;
    return counts;
  }, {});

const walk = (
  dir: string,
  predicate: (filePath: string) => boolean,
  out: string[] = []
) => {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, predicate, out);
      continue;
    }

    if (predicate(fullPath)) out.push(fullPath);
  }

  return out;
};

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.(stories|test|spec)?\.?tsx?$/, "")
    .replace(/\.md$/, "")
    .replace(/^glass/, "")
    .replace(/[^a-z0-9]/g, "");

const candidateNames = (componentName: string) =>
  new Set([
    normalizeName(componentName),
    normalizeName(componentName.replace(/^Glass/, "")),
    normalizeName(`Glass${componentName}`),
  ]);

const toNameSet = (files: string[]) =>
  new Set(files.map((filePath) => normalizeName(path.basename(filePath))));

const hasDirectMatch = (set: Set<string>, componentName: string) =>
  [...candidateNames(componentName)].some((name) => set.has(name));

test.describe("Storybook visual certification report guardrails", () => {
  test("certification report stays aligned with component inventory", () => {
    const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8")) as {
      components: Array<{ name: string; category: string; path: string }>;
    };
    const report = JSON.parse(
      fs.readFileSync(reportPath, "utf8")
    ) as CertificationReport;

    expect(report.inventoryCount).toBe(inventory.components.length);
    expect(report.entries).toHaveLength(inventory.components.length);
    expect(report.viewports).toEqual(["desktop", "mobile"]);

    expect(countByName(report.entries.map((entry) => entry.name))).toEqual(
      countByName(inventory.components.map((component) => component.name))
    );
    expect(new Set(report.entries.map((entry) => entry.identityKey))).toEqual(
      new Set(
        inventory.components.map((component) => componentIdentityKey(component))
      )
    );
  });

  test("all entries passed with unique per-viewport screenshot evidence", () => {
    const report = JSON.parse(
      fs.readFileSync(reportPath, "utf8")
    ) as CertificationReport;
    const allScreenshots = report.entries.flatMap((entry) => entry.screenshots);
    const screenshotFilesOnDisk = fs
      .readdirSync(
        path.join(
          repoRoot,
          "reports/glassmorphism-storybook-visual-certification/screenshots"
        ),
        { recursive: true }
      )
      .filter((filePath) => String(filePath).endsWith(".png"));

    expect(report.statusCounts).toEqual({ passed: report.inventoryCount });
    expect(report.entries.every((entry) => entry.status === "passed")).toBe(
      true
    );
    expect(report.expectedScreenshotCount).toBe(report.inventoryCount * 2);
    expect(report.screenshotCount).toBe(report.expectedScreenshotCount);
    expect(allScreenshots).toHaveLength(report.expectedScreenshotCount);
    expect(new Set(allScreenshots).size).toBe(report.expectedScreenshotCount);
    expect(screenshotFilesOnDisk).toHaveLength(report.expectedScreenshotCount);

    for (const entry of report.entries) {
      expect(entry.storyIds.length).toBeGreaterThan(0);
      expect(entry.viewportsInspected).toEqual(["desktop", "mobile"]);
      expect(entry.screenshots).toHaveLength(2);

      for (const screenshot of entry.screenshots) {
        expect(fs.existsSync(path.join(repoRoot, screenshot))).toBe(true);
      }
    }
  });

  test("generated certification story coverage is explicit", () => {
    const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8")) as {
      components: Array<{ name: string; category: string; path: string }>;
    };
    const report = JSON.parse(
      fs.readFileSync(reportPath, "utf8")
    ) as CertificationReport;
    const storyNames = toNameSet(
      walk(path.join(repoRoot, "src"), (filePath) =>
        filePath.endsWith(".stories.tsx")
      )
    );
    const passedEntryIdentities = new Set(
      report.entries
        .filter((entry) => entry.status === "passed")
        .map((entry) => entry.identityKey)
    );
    const componentsMissingDirectStories = inventory.components.filter(
      (component) => !hasDirectMatch(storyNames, component.name)
    );
    const coveredMissingDirectStories = componentsMissingDirectStories.filter(
      (component) => passedEntryIdentities.has(componentIdentityKey(component))
    );
    const selectedGeneratedEntries = report.entries.filter((entry) =>
      entry.storyIds.some((storyId) =>
        storyId.startsWith("certification-missing-inventory-components--")
      )
    );

    expect(report.generatedCertificationStoryCoverage.storyPath).toBe(
      "src/stories/GlassMissingInventoryCertification.stories.tsx"
    );
    expect(report.generatedCertificationStoryCoverage.covered).toBe(
      coveredMissingDirectStories.length
    );
    expect(report.generatedCertificationStoryCoverage.total).toBe(
      componentsMissingDirectStories.length
    );
    expect(report.generatedCertificationStoryCoverage.percent).toBe(100);
    expect(report.selectedGeneratedStoryCount).toBe(
      selectedGeneratedEntries.length
    );
  });

  test("summary uses incomplete language while blockers remain", () => {
    const report = JSON.parse(
      fs.readFileSync(reportPath, "utf8")
    ) as CertificationReport;
    const summary = fs.readFileSync(summaryPath, "utf8");
    const hasOpenBlockers = report.entries.some((entry) =>
      ["blocked", "missing-story"].includes(entry.status)
    );

    if (hasOpenBlockers) {
      expect(summary).toContain(
        "Certification incomplete: not all inventory components could be visually certified."
      );
      expect(summary).not.toContain(
        "Certification complete: all inventory components were visually inspected and passed/fixed."
      );
    } else {
      expect(summary).toContain(
        "Certification complete: all inventory components were visually inspected and passed/fixed."
      );
      expect(summary).not.toContain(
        "Certification incomplete: not all inventory components could be visually certified."
      );
    }
  });
});
