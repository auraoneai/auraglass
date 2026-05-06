#!/usr/bin/env node

/**
 * AuraGlass component coverage audit.
 *
 * This script keeps the package-level `npm run audit:components` command usable
 * by checking the canonical inventory against direct docs, story, and test
 * coverage. It intentionally reports coverage and remaining glass quality debt
 * without failing by default because remediation work is tracked in
 * src/reports/glassmorphismAuditCoverage.ts.
 */

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));

const readJsonIfExists = (relativePath) => {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
};

const walk = (dir, predicate, out = []) => {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, predicate, out);
    } else if (predicate(fullPath)) {
      out.push(fullPath);
    }
  }

  return out;
};

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

const toNameSet = (files) =>
  new Set(files.map((filePath) => normalizeName(path.basename(filePath))));

const hasDirectMatch = (set, componentName) =>
  [...candidateNames(componentName)].some((name) => set.has(name));

const componentIdentityKey = (component) =>
  `${component.category || "uncategorized"}:${component.path}`;

const entryIdentityKey = (entry) =>
  entry.identityKey ||
  (entry.sourcePath
    ? entry.sourcePath.replace(/^src\//, "")
    : `${entry.category || "uncategorized"}:${entry.name}`);

const percent = (covered, total) =>
  total === 0 ? "0.0" : ((covered / total) * 100).toFixed(1);

const summarizeCoverage = (components, set) =>
  components.filter((component) => hasDirectMatch(set, component.name)).length;

const main = () => {
  const inventory = readJson("reports/component_inventory.json");
  const components = inventory.components || [];

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

  const storyCoverage = summarizeCoverage(components, storyNames);
  const docsCoverage = summarizeCoverage(components, docNames);
  const testCoverage = summarizeCoverage(components, unitTestNames);
  const certificationReport = readJsonIfExists(
    "reports/glassmorphism-storybook-visual-certification.json"
  );
  const certifiedEntries = Array.isArray(certificationReport?.entries)
    ? certificationReport.entries
    : [];
  const certifiedIdentities = new Set(
    certifiedEntries
      .filter((entry) => entry.status === "passed")
      .map((entry) => entryIdentityKey(entry))
  );
  const storybookCertificationCoverage = components.filter((component) =>
    certifiedIdentities.has(componentIdentityKey(component))
  ).length;
  const storybookCertificationScreenshots = certifiedEntries.reduce(
    (total, entry) =>
      total + (Array.isArray(entry.screenshots) ? entry.screenshots.length : 0),
    0
  );
  const generatedCertificationStoryCoverage = components.filter(
    (component) =>
      !hasDirectMatch(storyNames, component.name) &&
      certifiedIdentities.has(componentIdentityKey(component))
  ).length;
  const contrastGuardCoverage = components.filter(
    (component) => component.hasContrastGuard
  ).length;
  const ariaCoverage = components.filter((component) => component.hasARIA).length;
  const focusCoverage = components.filter(
    (component) => component.hasFocusManagement
  ).length;
  const reducedMotionCoverage = components.filter(
    (component) => component.hasReducedMotion
  ).length;

  const missingStories = components
    .filter((component) => !hasDirectMatch(storyNames, component.name))
    .map((component) => component.name)
    .slice(0, 20);
  const missingDocs = components
    .filter((component) => !hasDirectMatch(docNames, component.name))
    .map((component) => component.name)
    .slice(0, 20);

  console.log("AuraGlass Component Glassmorphism Audit");
  console.log("======================================");
  console.log(`Inventory: ${components.length} components`);
  console.log(
    `Direct Storybook coverage: ${storyCoverage}/${components.length} (${percent(
      storyCoverage,
      components.length
    )}%)`
  );
  if (certificationReport) {
    console.log(
      `Storybook visual certification coverage: ${storybookCertificationCoverage}/${components.length} (${percent(
        storybookCertificationCoverage,
        components.length
      )}%) passed, ${storybookCertificationScreenshots} screenshots`
    );
    console.log(
      `Generated certification story coverage: ${generatedCertificationStoryCoverage}/${components.length - storyCoverage} (${percent(
        generatedCertificationStoryCoverage,
        components.length - storyCoverage
      )}%) of components without direct story matches`
    );
  }
  console.log(
    `Direct docs coverage: ${docsCoverage}/${components.length} (${percent(
      docsCoverage,
      components.length
    )}%)`
  );
  console.log(
    `Direct unit-test coverage: ${testCoverage}/${components.length} (${percent(
      testCoverage,
      components.length
    )}%)`
  );
  console.log(
    `ContrastGuard inventory coverage: ${contrastGuardCoverage}/${components.length} (${percent(
      contrastGuardCoverage,
      components.length
    )}%)`
  );
  console.log(
    `ARIA inventory coverage: ${ariaCoverage}/${components.length} (${percent(
      ariaCoverage,
      components.length
    )}%)`
  );
  console.log(
    `Focus inventory coverage: ${focusCoverage}/${components.length} (${percent(
      focusCoverage,
      components.length
    )}%)`
  );
  console.log(
    `Reduced-motion inventory coverage: ${reducedMotionCoverage}/${components.length} (${percent(
      reducedMotionCoverage,
      components.length
    )}%)`
  );

  console.log("\nPriority gaps");
  if (contrastGuardCoverage < components.length) {
    console.log(
      "- Critical: Expand ContrastGuard coverage across translucent components."
    );
  }
  if (ariaCoverage < components.length) {
    console.log("- High: Expand ARIA coverage across interactive components.");
  }
  if (focusCoverage < components.length) {
    console.log(
      "- High: Expand focus-management coverage across keyboard-interactive components."
    );
  }
  if (missingStories.length > 0) {
    console.log(
      "- High: Backfill direct component-owned stories for components currently covered by the generated certification story."
    );
  }
  if (missingDocs.length > 0) {
    console.log("- High: Add direct docs for components missing normalized matches.");
  }
  if (
    contrastGuardCoverage === components.length &&
    ariaCoverage === components.length &&
    focusCoverage === components.length &&
    reducedMotionCoverage === components.length
  ) {
    console.log(
      "- None: ContrastGuard, ARIA, focus-management, and reduced-motion inventory coverage are complete."
    );
  }
  console.log(
    "- Medium: Keep family-level visual specs aligned with the complete Storybook visual certification report."
  );

  console.log("\nMissing direct component-owned story examples");
  if (missingStories.length === 0) {
    console.log("- None");
  } else {
    missingStories.forEach((name) => console.log(`- ${name}`));
  }

  console.log("\nMissing direct docs examples");
  if (missingDocs.length === 0) {
    console.log("- None");
  } else {
    missingDocs.forEach((name) => console.log(`- ${name}`));
  }

  console.log("\nPublic audit evidence");
  console.log("- reports/component_inventory.json");
  console.log("- reports/glassmorphism-storybook-visual-certification.json");
  console.log("- docs/components/readme.md");
  console.log("- docs/components/choosing.md");
};

main();
