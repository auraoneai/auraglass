#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { evidenceDir } = require("../ci/lib/evidence-dir");

const repoRoot = process.cwd();
const auditRoot = evidenceDir("audit");
const progressPath = process.argv[2];
const stagingRoot = process.argv[3];
const outputPath = process.argv[4];

if (!progressPath || !stagingRoot || !outputPath) {
  throw new Error("usage: group-quarantined-visual-failures.js <progress.jsonl> <staging-root> <output.json>");
}

const rows = fs.readFileSync(progressPath, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const viewportPattern = /^(desktop|tablet|mobile):\s*/;
const mechanismFor = (reason) => {
  const value = reason.replace(viewportPattern, "");
  if (value.startsWith("highlight alpha >")) return "excessive-highlight-alpha";
  if (value.includes("local contrast")) return "insufficient-local-contrast";
  if (value.includes("effective alpha")) return "insufficient-text-alpha";
  if (value.includes("missing canonical inner-glow/sheen")) return "missing-canonical-sheen";
  if (value.includes("lacks a white-neutral frost fill")) return "invalid-frost-fill";
  if (value.includes("non-neutral gradient stop")) return "invalid-gradient-stop";
  if (value.includes("no glass surface found")) return "missing-glass-surface";
  if (value.includes("control-spacing") || value.includes("verticalGap=")) return "control-spacing";
  if (value.includes("overlap") || value.includes("collision")) return "overlap-or-collision";
  if (value.includes("overflow") || value.includes("clipping")) return "overflow-or-clipping";
  if (value.includes("console error") || value.includes("page error")) return "runtime-error";
  return value.split(" on ")[0].replace(/\d+(?:\.\d+)?/g, "#").slice(0, 120);
};

const sourceFor = (id) => {
  const computedPath = path.join(stagingRoot, id, "desktop.computed-styles.json");
  if (!fs.existsSync(computedPath)) return null;
  const computed = JSON.parse(fs.readFileSync(computedPath, "utf8"));
  return {
    sourcePath: computed.sourcePath || null,
    storyId: computed.storyId || null,
    recipeHarness: computed.recipeHarness || null,
  };
};

const groups = new Map();
for (const row of rows.filter((entry) => entry.status !== "pass")) {
  const source = sourceFor(row.id);
  for (const reason of row.reasons || ["unspecified failure"]) {
    const viewport = reason.match(viewportPattern)?.[1] || "all";
    const mechanism = mechanismFor(reason);
    const key = `${source?.sourcePath || "unknown"}\0${mechanism}`;
    if (!groups.has(key)) {
      groups.set(key, {
        mechanism,
        sourcePath: source?.sourcePath || null,
        affectedIds: new Set(),
        viewports: new Set(),
        stories: new Set(),
        reasons: new Set(),
        stagedScreenshots: new Set(),
      });
    }
    const group = groups.get(key);
    group.affectedIds.add(row.id);
    group.viewports.add(viewport);
    if (source?.storyId) group.stories.add(source.storyId);
    group.reasons.add(reason.replace(viewportPattern, ""));
    for (const name of viewport === "all" ? ["desktop", "tablet", "mobile"] : [viewport]) {
      const screenshot = path.join(stagingRoot, row.id, `${name}.png`);
      if (fs.existsSync(screenshot)) group.stagedScreenshots.add(path.relative(repoRoot, screenshot));
    }
  }
}

const serializableGroups = [...groups.values()]
  .map((group) => ({
    mechanism: group.mechanism,
    sourcePath: group.sourcePath,
    affectedCount: group.affectedIds.size,
    affectedIds: [...group.affectedIds].sort(),
    viewports: [...group.viewports].sort(),
    stories: [...group.stories].sort(),
    reasons: [...group.reasons].sort(),
    stagedScreenshots: [...group.stagedScreenshots].sort(),
  }))
  .sort((a, b) => b.affectedCount - a.affectedCount || String(a.sourcePath).localeCompare(String(b.sourcePath)));

const statusCounts = rows.reduce((counts, row) => {
  counts[row.status] = (counts[row.status] || 0) + 1;
  return counts;
}, {});

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  disposition: "quarantined-incomplete-failure-census",
  expectedTargetCount: 498,
  evaluatedTargetCount: rows.length,
  unevaluatedTargetCount: 498 - rows.length,
  statusCounts,
  progressPath,
  stagingRoot,
  note: "The run was interrupted after forward progress stopped for more than five minutes in GPU-heavy story rendering. This is diagnostic evidence only and must not be promoted or used for certification.",
  groups: serializableGroups,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, evaluated: rows.length, statusCounts, groups: serializableGroups.length }, null, 2));
