#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const args = new Set(process.argv.slice(2));
const outputJson = args.has("--json");
const strict = args.has("--strict");

const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "storybook-static",
  "coverage",
  "playwright-report",
  "test-results",
]);

const fileExists = (relativePath) =>
  fs.existsSync(path.join(repoRoot, relativePath));

const readFile = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const lineNumberForIndex = (content, index) =>
  content.slice(0, index).split("\n").length;

const walkFiles = (roots) => {
  const files = [];

  const visit = (relativePath) => {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) return;
    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
        if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
        visit(path.join(relativePath, entry.name));
      }
      return;
    }

    if (stat.isFile()) files.push(relativePath);
  };

  roots.forEach(visit);
  return files;
};

const collectMatches = ({ id, description, roots, patterns }) => {
  const files = walkFiles(roots).filter((relativePath) => {
    const basename = path.basename(relativePath);
    return (
      /\.(?:cjs|conf|css|js|json|mjs|md|sh|ts|tsx|ya?ml)$/.test(
        relativePath
      ) ||
      basename === "Dockerfile" ||
      basename === ".env.example"
    );
  });
  const findings = [];

  for (const file of files) {
    const content = readFile(file);
    for (const pattern of patterns) {
      const regex = new RegExp(pattern.source, pattern.flags || "g");
      for (const match of content.matchAll(regex)) {
        findings.push({
          file,
          line: lineNumberForIndex(content, match.index || 0),
          pattern: pattern.label,
          excerpt: content
            .slice(match.index || 0, (match.index || 0) + 160)
            .split(/\r?\n/)[0]
            .trim(),
        });
      }
    }
  }

  return {
    id,
    description,
    findingCount: findings.length,
    findings,
  };
};

const scans = [
  {
    id: "legacyMockServerReferences",
    description:
      "References to the legacy demo/mock API server in active runtime and docs paths.",
    roots: [
      "Dockerfile",
      "docker-compose.yml",
      "scripts/deploy.sh",
      "README.md",
      "docs",
      "server",
    ],
    patterns: [
      {
        label: "server/api-server.js",
        source: "server/api-server\\.js|api-server\\.js",
      },
    ],
  },
  {
    id: "portAndEnvContract",
    description:
      "API/WebSocket port and environment variable contract references that need to agree for 3.3.",
    roots: [
      ".env.example",
      "Dockerfile",
      "docker-compose.yml",
      "nginx.conf",
      "scripts/deploy.sh",
      "src/lib/ai-client.ts",
      "server",
      "docs",
      "README.md",
    ],
    patterns: [
      {
        label: "ports/env",
        source:
          "3001|3002|API_PORT|API_SERVER_PORT|WS_PORT|WEBSOCKET_SERVER_PORT|NEXT_PUBLIC_API_URL|NEXT_PUBLIC_WS_URL|WEBSOCKET_SERVER_URL",
      },
    ],
  },
  {
    id: "staleReleaseGuidance",
    description:
      "Known stale current-release phrases from the 3.3 PRD documentation truth sweep.",
    roots: ["README.md", "docs", "server", "CHANGELOG.md"],
    patterns: [
      { label: "3.1 release scaffold", source: "3\\.1 release scaffold" },
      { label: "10 launch recipes", source: "10 launch recipes" },
      {
        label: "old API port phrase",
        source: "API Server on http://localhost:3001",
      },
      {
        label: "old WebSocket port phrase",
        source: "WebSocket Server on http://localhost:3002",
      },
    ],
  },
  {
    id: "providerUnconfiguredContract",
    description:
      "Provider-unconfigured contract references in implementation and active docs.",
    roots: ["server", "src", "docs", "README.md"],
    patterns: [
      {
        label: "provider unconfigured",
        source:
          "AURA_PROVIDER_UNCONFIGURED|ProviderUnconfiguredError|assertProviderConfigured|provider-unconfigured|Provider not configured",
      },
    ],
  },
  {
    id: "collaborationPlaceholder",
    description:
      "Collaboration editing placeholder or unsupported-state signals.",
    roots: ["server", "src", "docs", "README.md"],
    patterns: [
      {
        label: "collaboration placeholder",
        source:
          "applyOperationalTransform|operational transformation|placeholder that just returns the operation|collaborative editing is not supported|unsupported collaboration",
      },
    ],
  },
  {
    id: "manualCertificationGaps",
    description:
      "Manual screen-reader and physical-device certification gaps that must not be auto-completed.",
    roots: ["reports/3.2-release", "reports/3.3-release", "GoLiveCheckList.md"],
    patterns: [
      {
        label: "manual/external certification",
        source:
          "manual screen-reader|screen-reader certification|physical[^\\n]*touch|Pending external|not a completed manual|manual certification",
      },
    ],
  },
];

const results = scans.map(collectMatches);

const summary = {
  generatedAt: new Date().toISOString(),
  scanner: path.relative(repoRoot, __filename),
  strict,
  scans: Object.fromEntries(
    results.map((result) => [result.id, result.findingCount])
  ),
  missingFiles: [
    "reports/3.3-release/README.md",
    "reports/3.3-release/scope-decisions.md",
    "reports/3.3-release/hosted-runtime-evidence.md",
    "reports/3.3-release/security-review.md",
    "reports/3.3-release/ai-cost-and-cache-evidence.md",
  ].filter((relativePath) => !fileExists(relativePath)),
};

const report = { summary, results };

if (outputJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("AuraGlass 3.3 stale/current-state scan");
  console.log(`Generated: ${summary.generatedAt}`);
  console.log("");

  for (const result of results) {
    console.log(`${result.id}: ${result.findingCount}`);
    console.log(`  ${result.description}`);
    for (const finding of result.findings.slice(0, 12)) {
      console.log(
        `  - ${finding.file}:${finding.line} [${finding.pattern}] ${finding.excerpt}`
      );
    }
    if (result.findings.length > 12) {
      console.log(`  - ... ${result.findings.length - 12} more`);
    }
    console.log("");
  }

  if (summary.missingFiles.length > 0) {
    console.log("Missing 3.3 evidence files:");
    summary.missingFiles.forEach((relativePath) =>
      console.log(`  - ${relativePath}`)
    );
    console.log("");
  }
}

if (
  strict &&
  (summary.missingFiles.length > 0 ||
    results.find((result) => result.id === "staleReleaseGuidance")
      .findingCount > 0)
) {
  process.exit(1);
}
