#!/usr/bin/env node
/* PLAT-072/REQ-PLAT-41: fail when src/ gains new bare side-effect imports
   (`import "x";`) that were not in the baseline. Baseline is shrink-only:
   regenerate with --write-baseline, never by hand-editing to add entries. */
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const BASELINE = path.join(root, "scripts/ci/import-side-effects-baseline.json");

const SIDE_EFFECT = /^\s*import\s+["']([^"']+)["']\s*;/gm;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!/node_modules|__tests__|\.stories|dist/.test(p)) walk(p, out);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name) && !/\.(test|spec)\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

function scan() {
  const found = [];
  for (const file of walk(path.join(root, "src"))) {
    const rel = path.relative(root, file);
    const src = fs.readFileSync(file, "utf8");
    let m;
    while ((m = SIDE_EFFECT.exec(src))) {
      found.push(`${rel}:${m[1]}`);
    }
  }
  return found.sort();
}

function main() {
  const current = scan();
  if (process.argv.includes("--write-baseline")) {
    fs.writeFileSync(BASELINE, JSON.stringify({ sideEffectImports: current }, null, 2) + "\n");
    console.log(`wrote baseline with ${current.length} entries`);
    return;
  }
  const baseline = fs.existsSync(BASELINE)
    ? JSON.parse(fs.readFileSync(BASELINE, "utf8")).sideEffectImports
    : [];
  const baselineSet = new Set(baseline);
  const currentSet = new Set(current);
  const added = current.filter((x) => !baselineSet.has(x));
  const removed = baseline.filter((x) => !currentSet.has(x));
  if (added.length) {
    console.error("New side-effect imports (baseline is shrink-only):");
    for (const a of added) console.error(`  + ${a}`);
    process.exit(1);
  }
  if (removed.length) {
    console.log("Removed side-effect imports (shrink baseline with --write-baseline):");
    for (const r of removed) console.log(`  - ${r}`);
  }
  console.log(`import-side-effects: OK (${current.length} imports, ${added.length} new)`);
}

main();
