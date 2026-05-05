import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { glassmorphismAuditCoverage } from "../../../src/reports/glassmorphismAuditCoverage";

const repoRoot = process.cwd();

const readJson = <T>(relativePath: string): T =>
  JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8")) as T;

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

type InventoryComponent = {
  name: string;
  path: string;
  category: string;
  hasContrastGuard: boolean;
  hasARIA: boolean;
  hasFocusManagement: boolean;
  hasReducedMotion: boolean;
};

type CertificationEntry = {
  identityKey: string;
  name: string;
  sourcePath: string;
  status: string;
  screenshots: string[];
};

const toNameSet = (files: string[]) =>
  new Set(files.map((filePath) => normalizeName(path.basename(filePath))));

const hasDirectMatch = (set: Set<string>, componentName: string) =>
  [...candidateNames(componentName)].some((name) => set.has(name));

const componentIdentityKey = (component: InventoryComponent) =>
  `${component.category || "uncategorized"}:${component.path}`;

const entryIdentityKey = (entry: CertificationEntry) =>
  entry.identityKey || entry.sourcePath.replace(/^src\//, "");

test.describe("glassmorphism audit coverage guardrails", () => {
  test("coverage snapshot stays aligned with component inventory", () => {
    const inventory = readJson<{ components: InventoryComponent[] }>(
      glassmorphismAuditCoverage.source
    );

    const storyNames = toNameSet(
      walk(path.join(repoRoot, "src"), (filePath) =>
        filePath.endsWith(".stories.tsx")
      )
    );
    const docNames = toNameSet(
      walk(path.join(repoRoot, "docs/components"), (filePath) =>
        filePath.endsWith(".md")
      )
    );
    const unitTestNames = toNameSet(
      walk(path.join(repoRoot, "src"), (filePath) =>
        /\.test\.tsx?$/.test(filePath)
      )
    );

    const coveredStories = inventory.components.filter((component) =>
      hasDirectMatch(storyNames, component.name)
    ).length;
    const coveredDocs = inventory.components.filter((component) =>
      hasDirectMatch(docNames, component.name)
    ).length;
    const coveredUnitTests = inventory.components.filter((component) =>
      hasDirectMatch(unitTestNames, component.name)
    ).length;
    const certificationReport = readJson<{
      inventoryCount: number;
      screenshotCount: number;
      generatedCertificationStoryCoverage: {
        covered: number;
        total: number;
        percent: number;
        storyPath: string;
      };
      entries: CertificationEntry[];
    }>(
      glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage
        .reportPath
    );
    const certifiedComponents = new Set(
      certificationReport.entries
        .filter((entry) => entry.status === "passed")
        .map((entry) => entryIdentityKey(entry))
    );
    const coveredCertifiedComponents = inventory.components.filter(
      (component) => certifiedComponents.has(componentIdentityKey(component))
    ).length;
    const certificationScreenshots = certificationReport.entries.reduce(
      (total, entry) => total + entry.screenshots.length,
      0
    );
    const generatedCertificationCoverage = inventory.components.filter(
      (component) =>
        !hasDirectMatch(storyNames, component.name) &&
        certifiedComponents.has(componentIdentityKey(component))
    ).length;

    expect(inventory.components).toHaveLength(
      glassmorphismAuditCoverage.summary.inventoryComponents
    );
    expect(coveredStories).toBe(
      glassmorphismAuditCoverage.summary.directStoryCoverage.covered
    );
    expect(coveredDocs).toBe(
      glassmorphismAuditCoverage.summary.directDocsCoverage.covered
    );
    expect(coveredUnitTests).toBe(
      glassmorphismAuditCoverage.summary.directUnitTestCoverage.covered
    );
    expect(certificationReport.inventoryCount).toBe(
      glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage
        .total
    );
    expect(certificationReport.entries).toHaveLength(
      glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage
        .total
    );
    expect(
      certificationReport.entries.filter((entry) => entry.status === "passed")
    ).toHaveLength(
      glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage
        .passed
    );
    expect(coveredCertifiedComponents).toBe(
      glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage
        .covered
    );
    expect(certificationReport.screenshotCount).toBe(certificationScreenshots);
    expect(certificationScreenshots).toBe(
      glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage
        .screenshots
    );
    expect(generatedCertificationCoverage).toBe(
      glassmorphismAuditCoverage.summary.generatedCertificationStoryCoverage
        .covered
    );
    expect(certificationReport.generatedCertificationStoryCoverage).toEqual(
      glassmorphismAuditCoverage.summary.generatedCertificationStoryCoverage
    );
  });

  test("audit prompt includes required reproducibility sections", () => {
    const prompt = fs.readFileSync(
      path.join(
        repoRoot,
        "docs/prompts/glassmorphism-component-audit-master-prompt.md"
      ),
      "utf8"
    );

    for (const requiredSection of [
      "Audit goals",
      "Preferred workflow",
      "Recommended verification",
      "Final response format",
      "Minimum Acceptance Criteria",
    ]) {
      expect(prompt).toContain(requiredSection);
    }

    for (const requiredPath of [
      "reports/component_inventory.json",
      "src/stories/**",
      "tests/visual/**",
      "tests/e2e/**",
    ]) {
      expect(prompt).toContain(requiredPath);
    }
  });

  test("owned audit story and visual suite expose glass coverage gaps", () => {
    const story = fs.readFileSync(
      path.join(repoRoot, "src/stories/GlassAuditCoverage.stories.tsx"),
      "utf8"
    );
    const visualSpecs = walk(path.join(repoRoot, "tests/visual"), (filePath) =>
      /\.(spec\.ts|test\.js)$/.test(filePath)
    );
    const componentVisualSpecs = visualSpecs.filter((filePath) =>
      filePath.includes(`${path.sep}components${path.sep}`)
    );

    expect(story).toContain("Glassmorphism audit coverage matrix");
    expect(story).toContain("Storybook Certified");
    expect(story).toContain("generatedCertificationStoryCoverage");
    expect(story).toContain("missingStoryExamples");
    expect(story).toContain("priorityGaps");
    expect(visualSpecs.length).toBeGreaterThanOrEqual(
      glassmorphismAuditCoverage.summary.visualSpecs + 1
    );
    expect(componentVisualSpecs.length).toBeGreaterThanOrEqual(
      glassmorphismAuditCoverage.summary.componentVisualSpecs
    );
  });

  test("audit matrix story renders in Storybook", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=audits-glassmorphism-coverage--matrix&viewMode=story"
    );
    await expect(
      page.getByRole("heading", { name: "Glassmorphism audit coverage matrix" })
    ).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("Direct Stories")).toBeVisible();
    await expect(page.getByText("Storybook Certified")).toBeVisible();
    await expect(page.getByText("712 screenshots inspected")).toBeVisible();
    await expect(page.getByText("Critical")).toBeVisible();
  });
});
