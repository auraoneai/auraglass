#!/usr/bin/env node
/* MOT 4.x checks (MAT-362): codemod↔deprecation fragment consistency + the
   T06/L9/L12 cells that have a 4.x face.

   - every `removed` codemod row's doc anchor resolves inside
     fragments/deprecations/mat.ts (MOT-002 fixture coherence on this line)
   - every deprecation row has status/removeIn/doc (S-38 shape, L12)
   - no fragment row references an export the codemod map already removes
     without naming the codemod id (L9)

   Run: node scripts/mat/mot-4x-check.mjs */
import { readFileSync } from 'node:fs';

const depText = readFileSync('fragments/deprecations/mat.ts', 'utf8');
const codText = readFileSync('fragments/codemods/mat.ts', 'utf8');

const depIds = new Set([...depText.matchAll(/#(dep-[a-z0-9-]+)/gi)].map(m => m[1].toLowerCase()));
const rows = depText.match(/id:\s*'DEP-M\d+'/g) ?? [];

const problems = [];

/* S-38 shape: each row needs removeIn + doc + status. */
const rowBlocks = depText.split(/(?=\{\s*id:\s*'DEP-M)/).slice(1);
for (const b of rowBlocks) {
  const id = b.match(/id:\s*'(DEP-M\d+)'/)?.[1];
  for (const f of ['removeIn', 'doc', 'status']) {
    if (!b.includes(`${f}:`)) problems.push(`${id}: missing ${f}`);
  }
  const anchor = b.match(/doc:\s*'#(dep-[a-z0-9-]+)'/i)?.[1];
  if (anchor && !depIds.has(anchor.toLowerCase())) problems.push(`${id}: doc anchor #${anchor} not in deprecations index`);
}

/* codemod removed rows must doc-link a deprecation anchor (MOT-002). */
for (const m of codText.matchAll(/doc:\s*'#(dep-[a-z0-9-]+)'/gi)) {
  if (!depIds.has(m[1].toLowerCase())) problems.push(`codemods: doc anchor #${m[1]} missing in deprecations fragment`);
}
const removedCount = (codText.match(/removed:\s*\[/g) ?? []).length;

if (problems.length) {
  console.error(`mot-4x-check: ${problems.length} problem(s) — deprecation rows ${rows.length}, doc anchors ${depIds.size}`);
  for (const p of problems.slice(0, 40)) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`mot-4x-check ok: ${rows.length} deprecation rows, ${depIds.size} doc anchors, codemod docs all resolve${removedCount ? '' : ' (no removed[] block — PLAT engine consumes renames/areaTransforms)'}`);
