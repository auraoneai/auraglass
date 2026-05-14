#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..", "..");
const args = new Set(process.argv.slice(2));
const json = args.has("--json");
const strict = args.has("--strict");

const requiredEntrypoints = [
  "./icons",
  "./icons/action",
  "./icons/navigation",
  "./icons/status",
  "./icons/media",
  "./icons/data",
  "./icons/commerce",
  "./icons/collaboration",
  "./icons/ai",
  "./primitives",
  "./primitives/slot",
  "./primitives/portal",
  "./primitives/focus",
  "./primitives/dismissable-layer",
  "./primitives/roving-focus",
  "./primitives/positioning",
  "./app-shell",
  "./workspace",
  "./theme",
];

const forbiddenRuntimeSignals = [
  "lucide-react",
  "@radix-ui/",
  "@mui/material",
  "@mui/icons-material",
  "@material-ui/",
  "@material/",
];

const scenarios = [
  {
    name: "GlassButton only",
    source: "import { GlassButton } from 'aura-glass'; console.log(typeof GlassButton);",
    maxBytes: 1700000,
  },
  {
    name: "GlassButton plus SearchIcon",
    source:
      "import { GlassButton } from 'aura-glass'; import { SearchIcon } from 'aura-glass/icons'; console.log(typeof GlassButton, typeof SearchIcon);",
    maxBytes: 1725000,
    requires: "./icons",
  },
  {
    name: "Primitive slot",
    source: "import { GlassSlot } from 'aura-glass/primitives/slot'; console.log(typeof GlassSlot);",
    maxBytes: 35000,
    requires: "./primitives/slot",
  },
  {
    name: "App shell plus navigation icons",
    source:
      "import { GlassAppShell } from 'aura-glass/app-shell'; import { HomeIcon, SettingsIcon } from 'aura-glass/icons/navigation'; console.log(typeof GlassAppShell, typeof HomeIcon, typeof SettingsIcon);",
    maxBytes: 180000,
    requires: "./app-shell",
  },
];

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const walkRuntimeFiles = (root) => {
  const files = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!fs.existsSync(current)) {
      continue;
    }

    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(current)) {
        stack.push(path.join(current, child));
      }
      continue;
    }

    if (stat.isFile() && /\.(?:cjs|mjs|js)$/.test(current) && !current.endsWith(".map")) {
      files.push(current);
    }
  }

  return files.sort();
};

const checkExportMap = (packageJson) => {
  const exportsField = packageJson.exports || {};
  return requiredEntrypoints
    .filter((entrypoint) => !exportsField[entrypoint])
    .map((entrypoint) => ({
      type: "missing-export",
      entrypoint,
      message: `${entrypoint} is not present in package.json exports.`,
    }));
};

const checkRuntimeArtifacts = () => {
  const distRoot = path.join(projectRoot, "dist");
  const findings = [];

  if (!fs.existsSync(distRoot)) {
    findings.push({
      type: "missing-dist",
      message: "dist is missing. Run npm run build before strict tree-shaking verification.",
    });
    return findings;
  }

  for (const filePath of walkRuntimeFiles(distRoot)) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const signal of forbiddenRuntimeSignals) {
      if (content.includes(signal)) {
        findings.push({
          type: "forbidden-runtime-signal",
          file: path.relative(projectRoot, filePath),
          signal,
          message: `${signal} appears in built runtime output.`,
        });
      }
    }
  }

  return findings;
};

const checkSideEffects = (packageJson) => {
  const sideEffects = packageJson.sideEffects;
  if (!Array.isArray(sideEffects)) {
    return [
      {
        type: "side-effects",
        message: "package.json sideEffects should stay scoped so icon and primitive entrypoints can tree-shake.",
      },
    ];
  }

  const broadEntries = sideEffects.filter((entry) => entry === true || entry === "*" || entry === "src/**/*");
  return broadEntries.map((entry) => ({
    type: "side-effects",
    entry,
    message: `Broad sideEffects entry ${JSON.stringify(entry)} can block tree-shaking.`,
  }));
};

const bundleScenario = (scenario, packageJson) => {
  if (scenario.requires && !(packageJson.exports || {})[scenario.requires]) {
    return {
      name: scenario.name,
      skipped: true,
      reason: `${scenario.requires} is not exported yet.`,
    };
  }

  const scenarioDir = fs.mkdtempSync(path.join(projectRoot, ".tmp-tree-shaking-"));
  const inputFile = path.join(scenarioDir, "scenario.tsx");
  const outputFile = path.join(scenarioDir, "scenario.mjs");
  fs.writeFileSync(inputFile, scenario.source, "utf8");

  const result = spawnSync(
    path.join(projectRoot, "node_modules", "esbuild", "bin", "esbuild"),
    [
      inputFile,
      "--bundle",
      "--format=esm",
      "--platform=browser",
      "--tree-shaking=true",
      "--minify",
      "--external:react",
      "--external:react-dom",
      "--external:react/jsx-runtime",
      "--external:react/jsx-dev-runtime",
      "--external:framer-motion",
      "--external:chart.js",
      "--external:react-chartjs-2",
      "--external:three",
      "--external:@react-three/*",
      "--external:openai",
      "--external:socket.io-client",
      `--outfile=${outputFile}`,
      "--log-level=silent",
    ],
    {
      cwd: projectRoot,
      encoding: "utf8",
    }
  );

  if (result.status !== 0) {
    fs.rmSync(scenarioDir, { recursive: true, force: true });
    return {
      name: scenario.name,
      passed: false,
      error: result.stderr || result.stdout || "esbuild failed",
    };
  }

  const bytes = fs.statSync(outputFile).size;
  const content = fs.readFileSync(outputFile, "utf8");
  fs.rmSync(scenarioDir, { recursive: true, force: true });
  const forbiddenSignal = forbiddenRuntimeSignals.find((signal) =>
    content.includes(signal)
  );

  if (forbiddenSignal) {
    return {
      name: scenario.name,
      passed: false,
      bytes,
      maxBytes: scenario.maxBytes,
      error: `${forbiddenSignal} appears in bundled scenario output.`,
    };
  }

  return {
    name: scenario.name,
    passed: bytes <= scenario.maxBytes,
    bytes,
    maxBytes: scenario.maxBytes,
  };
};

const packageJson = readJson(path.join(projectRoot, "package.json"));
const exportFindings = checkExportMap(packageJson);
const runtimeFindings = strict ? checkRuntimeArtifacts() : [];
const sideEffectFindings = checkSideEffects(packageJson);
const scenarioResults = strict
  ? scenarios.map((scenario) => bundleScenario(scenario, packageJson))
  : [];
const scenarioFindings = scenarioResults
  .filter((scenario) => scenario.passed === false)
  .map((scenario) => ({
    type: "bundle-scenario",
    scenario: scenario.name,
    message: scenario.error || `${scenario.bytes} bytes exceeds ${scenario.maxBytes} bytes.`,
  }));

const findings = [
  ...exportFindings,
  ...runtimeFindings,
  ...sideEffectFindings,
  ...scenarioFindings,
];

const report = {
  generatedAt: new Date().toISOString(),
  strict,
  requiredEntrypoints,
  findings,
  scenarioResults,
  passed: findings.length === 0,
};

if (json) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else if (report.passed) {
  console.log("[verify-tree-shaking] Export map and tree-shaking checks passed.");
} else {
  console.error("[verify-tree-shaking] Tree-shaking readiness findings:");
  for (const finding of findings) {
    console.error(`- ${finding.message}`);
  }
}

process.exit(report.passed ? 0 : 1);
