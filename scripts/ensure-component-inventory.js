#!/usr/bin/env node
// Ensures docs/inventory/component_inventory.json exists before a Storybook
// build. The curated-guide story statically imports that generated file;
// worker tarballs exclude it, so without this guard `storybook build` fails
// at bundle time with an unresolvable import. When the real inventory is
// missing this is fail-closed: it prints the required path and exits 1 —
// no empty { components: [] } fallback write (PLAT-109).
const fs = require("fs");
const path = require("path");

const rel = "docs/inventory/component_inventory.json";
const target = path.join(__dirname, "..", rel);
if (fs.existsSync(target)) {
  console.log(`[ensure-component-inventory] present: ${target}`);
  process.exit(0);
}

console.error(`component inventory missing: ${rel}`);
process.exit(1);
