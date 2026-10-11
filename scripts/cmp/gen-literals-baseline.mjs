#!/usr/bin/env node
/* REQ-CMP-08 / REQ-FIN-70: writes fragments/literals-baseline/cmp.json from
   the MAT literal scanner (lint/rules/mat/_literals.cjs) over every CMP
   .css/.ts/.tsx file (scripts/cmp/cmp-file-scope.cjs). Every file gets every
   scanner category, so a 0 row is an explicit claim, not an omission.

   node scripts/cmp/gen-literals-baseline.mjs           rewrite the fragment
   node scripts/cmp/gen-literals-baseline.mjs --check   exit 1 if it is stale

   The fragment is generated, never hand-edited; regenerate it after each CSS
   sweep merge (FIN-E rule 3). */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const ROOT = process.cwd();
const require = createRequire(import.meta.url);
const { scanText, CATEGORIES } = require(join(ROOT, 'lint/rules/mat/_literals.cjs'));
const { listCmpFiles } = require(join(ROOT, 'scripts/cmp/cmp-file-scope.cjs'));
const OUT = join(ROOT, 'fragments/literals-baseline/cmp.json');

const cats = [...new Set(CATEGORIES)].sort();
const files = {};
for (const f of listCmpFiles(ROOT)) {
  const row = Object.fromEntries(cats.map((c) => [c, 0]));
  for (const h of scanText(readFileSync(join(ROOT, f), 'utf8'), f)) row[h.category] += 1;
  files[f] = row;
}
const text = `${JSON.stringify({ version: 1, files }, null, 2)}\n`;

if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* missing = stale */ }
  if (current !== text) {
    console.error('literals-baseline/cmp.json is stale: run node scripts/cmp/gen-literals-baseline.mjs');
    process.exit(1);
  }
  console.log(`literals-baseline/cmp.json up to date (${Object.keys(files).length} files)`);
} else {
  writeFileSync(OUT, text);
  const nonZero = Object.entries(files).filter(([, r]) => Object.values(r).some((n) => n > 0));
  console.log(`wrote fragments/literals-baseline/cmp.json: ${Object.keys(files).length} files, ${nonZero.length} non-zero`);
  for (const [f, r] of nonZero) console.log(`  ${f} ${JSON.stringify(r)}`);
}
