#!/usr/bin/env node

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..", "..");
const cliPath = path.join(projectRoot, "bin", "aura-glass.cjs");

const runCli = (args, options = {}) => {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? projectRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(
      `aura-glass ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
    );
  }

  return result.stdout;
};

const recipes = JSON.parse(runCli(["list", "--json"]));
assert.ok(recipes.length >= 10, "CLI should expose the launch recipe registry");
assert.ok(
  recipes.some((recipe) => recipe.id === "saas-dashboard"),
  "saas-dashboard should be listed"
);
assert.ok(
  recipes.every((recipe) => Array.isArray(recipe.imports) && recipe.imports.length > 0),
  "each recipe should list public AuraGlass imports"
);

const info = JSON.parse(runCli(["info", "ai-command-center", "--json"]));
assert.equal(info.id, "ai-command-center");
assert.ok(
  info.files[0].content.includes("import 'aura-glass/styles';"),
  "recipe files should include the canonical CSS import"
);

const dryRun = JSON.parse(runCli(["add", "media-player-surface", "--dry-run", "--json"]));
assert.equal(dryRun[0].recipe, "media-player-surface");
assert.equal(dryRun[0].written[0].path, "src/components/auraglass/recipes/MediaPlayerSurface.tsx");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "auraglass-cli-"));
const writeResult = JSON.parse(
  runCli(["add", "settings-billing", "--cwd", tempDir, "--json"])
);
assert.equal(writeResult[0].recipe, "settings-billing");

const outputPath = path.join(
  tempDir,
  "src",
  "components",
  "auraglass",
  "recipes",
  "SettingsBillingPage.tsx"
);
const output = fs.readFileSync(outputPath, "utf8");
assert.ok(output.includes("GlassForm"), "generated recipe should contain AuraGlass imports");
assert.ok(output.includes("aura-glass/styles"), "generated recipe should include styles");

console.log("[verify-cli] AuraGlass CLI registry checks passed");
