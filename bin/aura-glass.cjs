#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const usage = `AuraGlass CLI

Usage:
  aura-glass list [--json]
  aura-glass info <recipe> [--json]
  aura-glass add <recipe|all> [--cwd <dir>] [--out <dir>] [--dry-run] [--force]

Examples:
  aura-glass list
  aura-glass info saas-dashboard
  aura-glass add ai-command-center
  aura-glass add all --out src/components/auraglass/recipes
`;

const loadRegistry = () => {
  try {
    return require("../dist/registry/index.js");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Unable to load the AuraGlass recipe registry. Run \`npm run build\` before using the local CLI. ${message}`
    );
  }
};

const parseArgs = (argv) => {
  const args = [];
  const flags = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      args.push(value);
      continue;
    }

    const key = value.slice(2);
    if (["cwd", "out"].includes(key)) {
      flags[key] = argv[index + 1];
      index += 1;
    } else {
      flags[key] = true;
    }
  }

  return { args, flags };
};

const toJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

const ensureInsideCwd = (cwd, target) => {
  const relative = path.relative(cwd, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside the current project: ${target}`);
  }
};

const writeRecipe = (recipe, flags) => {
  const cwd = path.resolve(process.cwd(), flags.cwd || ".");
  const outDir = path.resolve(cwd, flags.out || "src/components/auraglass/recipes");
  ensureInsideCwd(cwd, outDir);

  const written = [];
  const skipped = [];

  for (const file of recipe.files) {
    const target = path.resolve(outDir, file.path);
    ensureInsideCwd(cwd, target);

    if (flags["dry-run"]) {
      written.push({ path: path.relative(cwd, target), bytes: Buffer.byteLength(file.content) });
      continue;
    }

    if (fs.existsSync(target) && !flags.force) {
      skipped.push(path.relative(cwd, target));
      continue;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.content, "utf8");
    written.push({ path: path.relative(cwd, target), bytes: Buffer.byteLength(file.content) });
  }

  return { recipe: recipe.id, written, skipped };
};

const main = () => {
  const { auraGlassRecipes, getAuraGlassRecipe } = loadRegistry();
  const { args, flags } = parseArgs(process.argv.slice(2));
  const command = args[0];

  if (!command || command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(usage);
    return;
  }

  if (command === "list") {
    const rows = auraGlassRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      category: recipe.category,
      files: recipe.files.map((file) => file.path),
      imports: recipe.imports,
      peerDependencies: recipe.peerDependencies,
    }));

    if (flags.json) {
      process.stdout.write(toJson(rows));
      return;
    }

    process.stdout.write("Available AuraGlass recipes:\n");
    for (const recipe of rows) {
      process.stdout.write(`  ${recipe.id.padEnd(26)} ${recipe.title}\n`);
    }
    return;
  }

  if (command === "info") {
    const id = args[1];
    const recipe = getAuraGlassRecipe(id);
    if (!recipe) {
      throw new Error(`Unknown recipe "${id}". Run \`aura-glass list\` for valid ids.`);
    }

    if (flags.json) {
      process.stdout.write(toJson(recipe));
      return;
    }

    process.stdout.write(`${recipe.title}\n`);
    process.stdout.write(`${recipe.description}\n\n`);
    process.stdout.write(`id: ${recipe.id}\n`);
    process.stdout.write(`category: ${recipe.category}\n`);
    process.stdout.write(`imports: ${recipe.imports.join(", ")}\n`);
    process.stdout.write(`peers: ${recipe.peerDependencies.join(", ")}\n`);
    process.stdout.write(`files: ${recipe.files.map((file) => file.path).join(", ")}\n`);
    return;
  }

  if (command === "add") {
    const id = args[1];
    if (!id) {
      throw new Error("Missing recipe id. Run `aura-glass list` for valid ids.");
    }

    const recipes =
      id === "all"
        ? auraGlassRecipes
        : [getAuraGlassRecipe(id)].filter(Boolean);

    if (recipes.length === 0) {
      throw new Error(`Unknown recipe "${id}". Run \`aura-glass list\` for valid ids.`);
    }

    const results = recipes.map((recipe) => writeRecipe(recipe, flags));
    if (flags.json) {
      process.stdout.write(toJson(results));
      return;
    }

    for (const result of results) {
      process.stdout.write(`${flags["dry-run"] ? "Would add" : "Added"} ${result.recipe}\n`);
      for (const file of result.written) {
        process.stdout.write(`  ${file.path}\n`);
      }
      for (const file of result.skipped) {
        process.stdout.write(`  skipped existing ${file}\n`);
      }
    }
    return;
  }

  throw new Error(`Unknown command "${command}".\n\n${usage}`);
};

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}

