#!/usr/bin/env node

/**
 * Release-focused forbidden pattern guard.
 *
 * This check intentionally targets hard publish blockers and high-signal
 * mistakes. Broader code-quality cleanup is covered by ESLint, token lint,
 * style audit, tests, and the publish-readiness checklist.
 */

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");

const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "storybook-static",
  "coverage",
  "playwright-report",
  "test-results",
]);

const scannedExtensions = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".json",
  ".yml",
  ".yaml",
  ".md",
  ".css",
]);

const forbiddenPatterns = [
  {
    name: "merge-conflict-marker",
    pattern: /^(<<<<<<<|=======|>>>>>>>)(?: .*)?$/m,
    message: "Merge conflict marker found.",
  },
  {
    name: "debugger-statement",
    pattern: /\bdebugger\s*;/,
    message: "Debugger statement found.",
  },
  {
    name: "focused-test",
    pattern: /\b(?:describe|it|test)\.only\s*\(/,
    message: "Focused test found.",
  },
  {
    name: "npm-token",
    pattern: /\/\/registry\.npmjs\.org\/:_authToken\s*=\s*[^$\s][^\s]*/,
    message: "Possible committed npm auth token found.",
  },
  {
    name: "private-key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
    message: "Private key material found.",
  },
  {
    name: "env-secret-assignment",
    pattern:
      /(?:OPENAI_API_KEY|ANTHROPIC_API_KEY|PINECONE_API_KEY|SENTRY_DSN|JWT_SECRET|NPM_TOKEN)\s*=\s*['"]?(?!your-|example|placeholder|\$\{|process\.env)[A-Za-z0-9_./+=:-]{12,}/,
    message: "Possible real secret assignment found.",
  },
];

const walk = (directory, files = []) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (entry.isFile() && scannedExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
};

const lineNumberForIndex = (content, index) =>
  content.slice(0, index).split("\n").length;

const findings = [];
const files = walk(repoRoot);

for (const filePath of files) {
  const relativePath = path.relative(repoRoot, filePath);
  const content = fs.readFileSync(filePath, "utf8");

  for (const check of forbiddenPatterns) {
    if (
      check.name === "env-secret-assignment" &&
      (relativePath.startsWith("docs/") ||
        relativePath.startsWith("reports/") ||
        relativePath === ".env.example" ||
        relativePath.endsWith("README.md"))
    ) {
      continue;
    }

    const match = content.match(check.pattern);
    if (!match) continue;

    findings.push({
      file: relativePath,
      line: lineNumberForIndex(content, match.index || 0),
      check: check.name,
      message: check.message,
    });
  }
}

console.log("🔒 Running AuraGlass forbidden pattern check...\n");
console.log(`📊 Scanned ${files.length} files\n`);

if (findings.length > 0) {
  console.log(`❌ Found ${findings.length} forbidden pattern(s):\n`);
  for (const finding of findings) {
    console.log(
      `- ${finding.file}:${finding.line} [${finding.check}] ${finding.message}`
    );
  }
  process.exit(1);
}

console.log("✅ No forbidden release-blocking patterns found.\n");
