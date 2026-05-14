#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..", "..");
const args = new Set(process.argv.slice(2));
const json = args.has("--json");

const forbidden = [
  { id: "lucide-react", prefix: false, replacement: "aura-glass/icons" },
  { id: "@radix-ui/", prefix: true, replacement: "aura-glass/primitives and AuraGlass app chrome" },
  { id: "@mui/material", prefix: false, replacement: "AuraGlass app shell and workflow components" },
  { id: "@mui/icons-material", prefix: false, replacement: "aura-glass/icons" },
  { id: "@material-ui/", prefix: true, replacement: "AuraGlass app shell and workflow components" },
  { id: "@material/", prefix: true, replacement: "AuraGlass app shell and workflow components" },
];

const dependencySections = ["dependencies", "peerDependencies", "peerDependenciesMeta"];
const sourceExtensions = new Set([".cjs", ".cts", ".js", ".jsx", ".mjs", ".mts", ".ts", ".tsx"]);
const docsExtensions = new Set([".md", ".mdx", ".txt"]);
const ignoredDirs = new Set([
  ".git",
  ".next",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
]);

const isForbidden = (value) =>
  forbidden.find((entry) => (entry.prefix ? value.startsWith(entry.id) : value === entry.id));

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const walkFiles = (root, extensions) => {
  const files = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!fs.existsSync(current)) {
      continue;
    }

    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      if (ignoredDirs.has(path.basename(current))) {
        continue;
      }

      for (const child of fs.readdirSync(current)) {
        stack.push(path.join(current, child));
      }
      continue;
    }

    if (stat.isFile() && extensions.has(path.extname(current))) {
      files.push(current);
    }
  }

  return files.sort();
};

const lineNumber = (content, index) => content.slice(0, index).split(/\r?\n/).length;

const auditPackageMetadata = () => {
  const packageJson = readJson(path.join(projectRoot, "package.json"));
  const findings = [];

  for (const section of dependencySections) {
    const entries = packageJson[section] || {};
    for (const name of Object.keys(entries)) {
      const match = isForbidden(name);
      if (!match) {
        continue;
      }

      findings.push({
        section,
        package: name,
        replacement: match.replacement,
      });
    }
  }

  return findings;
};

const auditSourceImports = () => {
  const findings = [];
  const importPattern =
    /(?:from\s*["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)|import\(\s*["']([^"']+)["']\s*\))/g;

  for (const filePath of walkFiles(path.join(projectRoot, "src"), sourceExtensions)) {
    const content = fs.readFileSync(filePath, "utf8");
    let match;
    while ((match = importPattern.exec(content))) {
      const source = match[1] || match[2] || match[3];
      const forbiddenImport = isForbidden(source);
      if (!forbiddenImport) {
        continue;
      }

      findings.push({
        file: path.relative(projectRoot, filePath),
        line: lineNumber(content, match.index),
        source,
        replacement: forbiddenImport.replacement,
      });
    }
  }

  return findings;
};

const isAllowedHistoricalDoc = (relativePath) =>
  relativePath.startsWith("docs/migration/") ||
  relativePath.startsWith("reports/3.2-release/") ||
  relativePath.startsWith("reports/3.1-release/") ||
  relativePath.startsWith("reports/3.0") ||
  relativePath === "auraglass32PRD.md";

const auditCurrentDocs = () => {
  const roots = ["README.md", "INSTALLATION.md", "docs", "reports"]
    .map((entry) => path.join(projectRoot, entry))
    .filter((entry) => fs.existsSync(entry));
  const files = roots.flatMap((root) =>
    fs.statSync(root).isDirectory() ? walkFiles(root, docsExtensions) : [root]
  );
  const findings = [];

  for (const filePath of files) {
    const relativePath = path.relative(projectRoot, filePath);
    if (isAllowedHistoricalDoc(relativePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    for (const entry of forbidden) {
      const pattern = new RegExp(entry.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      let match;
      while ((match = pattern.exec(content))) {
        findings.push({
          file: relativePath,
          line: lineNumber(content, match.index),
          package: entry.id,
          replacement: entry.replacement,
        });
      }
    }
  }

  return findings;
};

const metadataFindings = auditPackageMetadata();
const sourceFindings = auditSourceImports();
const docsFindings = auditCurrentDocs();
const report = {
  generatedAt: new Date().toISOString(),
  forbidden: forbidden.map((entry) => entry.id),
  metadataFindings,
  sourceFindings,
  docsFindings,
  passed: metadataFindings.length === 0 && sourceFindings.length === 0 && docsFindings.length === 0,
};

if (json) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  if (report.passed) {
    console.log("[verify-no-core-ui-deps] No forbidden core UI dependencies, imports, or current docs references found.");
  } else {
    console.error("[verify-no-core-ui-deps] Forbidden core UI dependency evidence found.");
    for (const finding of metadataFindings) {
      console.error(`metadata ${finding.section}: ${finding.package} -> ${finding.replacement}`);
    }
    for (const finding of sourceFindings) {
      console.error(`${finding.file}:${finding.line} imports ${finding.source} -> ${finding.replacement}`);
    }
    for (const finding of docsFindings) {
      console.error(`${finding.file}:${finding.line} references ${finding.package} -> ${finding.replacement}`);
    }
  }
}

process.exit(report.passed ? 0 : 1);
