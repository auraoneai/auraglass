#!/usr/bin/env node
/* verify-visual-fix.mjs (REQ-PLAT-20): validate docs/release/visual-fixes/<slug>.json.
   A record proves a C-I-VF (visual fix) class: the changed cells are listed,
   the D-28 or §13.1 id is recorded, the composite artifact URL is evidence,
   and only default-mode cells may appear (non-default modes reclassify).
   Usage: node scripts/release/verify-visual-fix.mjs [dir] */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'docs/release/visual-fixes';
const ID_RE = /^(D-\d+|§?13\.1(-\d+)*)/;
const errs = [];
const fail = (f, m) => errs.push(`${f}: ${m}`);

if (!existsSync(dir)) {
  console.log(`verify-visual-fix: ${dir} absent — nothing to check`);
  process.exit(0);
}
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
for (const f of files) {
  let j;
  try {
    j = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  } catch (e) {
    fail(f, `not JSON: ${e.message}`);
    continue;
  }
  if (!ID_RE.test(String(j.id ?? ''))) {
    fail(f, `id '${j.id}' is not a D-<n> or §13.1 id`);
  }
  if (!Array.isArray(j.cells) || j.cells.length === 0 || j.cells.some((c) => typeof c !== 'string' || !c)) {
    fail(f, 'cells must be a non-empty string array naming exactly the changed cells');
  }
  if (typeof j.compositeArtifact !== 'string' || !(j.compositeArtifact.startsWith('http') || j.compositeArtifact === 'pending')) {
    fail(f, "compositeArtifact must be the composite URL (or 'pending' until the 4x pipeline uploads it)");
  }
  if (Array.isArray(j.cells) && j.cells.some((c) => !/^default[|:]/.test(c) && /dark|hc|contrast/.test(c))) {
    fail(f, `non-default-mode cell listed: ${j.cells.find((c) => /dark|hc|contrast/.test(c))} — only default-mode cells make a C-I-VF`);
  }
  if (j.defaultMode !== true) {
    fail(f, 'defaultMode must be true (the record asserts only default-mode cells changed)');
  }
}
if (errs.length) {
  console.error(`verify-visual-fix FAIL:\n${errs.join('\n')}`);
  process.exit(1);
}
console.log(`verify-visual-fix OK (${files.length} record${files.length === 1 ? '' : 's'})`);
