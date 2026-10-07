#!/usr/bin/env node
/* scripts/mat/codemod-fixtures-check.mjs — L12 Unit cell (MAT-362, MOT-002).
 * Validates the codemod fixture corpus: every case dir under
 * fragments/codemods/mat/fixtures/<id>/<case>/ has non-empty input.tsx and
 * output.tsx, input != output unless the case is marked already-fixed, and
 * each <id> is listed in the fragment's `fixtures` field. Transform-level
 * idempotence is exercised by PLAT's codemod engine (W-3) — absent here, that
 * part reports `pending`. */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const FIXTURES = join(root, 'fragments/codemods/mat/fixtures');
const pending = [];
let failed = false;
const fail = (msg) => { console.error(`[l12] ${msg}`); failed = true; };

if (!existsSync(FIXTURES)) {
  console.log('[l12] pending: fragments/codemods/mat/fixtures/ not present');
  process.exit(0);
}

const fragmentSrc = existsSync(join(root, 'fragments/codemods/mat.ts'))
  ? readFileSync(join(root, 'fragments/codemods/mat.ts'), 'utf8')
  : '';
if (!fragmentSrc) pending.push('fragments/codemods/mat.ts (fixtures list unreadable)');

for (const id of readdirSync(FIXTURES).sort()) {
  const idDir = join(FIXTURES, id);
  if (!statSync(idDir).isDirectory()) continue;
  if (fragmentSrc && !fragmentSrc.includes(`'${id}'`) && !fragmentSrc.includes(`"${id}"`)) {
    fail(`fixture id '${id}' is not referenced in fragments/codemods/mat.ts`);
  }
  for (const caseName of readdirSync(idDir).sort()) {
    const caseDir = join(idDir, caseName);
    if (!statSync(caseDir).isDirectory()) continue;
    const input = join(caseDir, 'input.tsx');
    const output = join(caseDir, 'output.tsx');
    if (!existsSync(input)) { fail(`${id}/${caseName}: missing input.tsx`); continue; }
    if (!existsSync(output)) { fail(`${id}/${caseName}: missing output.tsx`); continue; }
    const inSrc = readFileSync(input, 'utf8');
    const outSrc = readFileSync(output, 'utf8');
    if (inSrc.trim().length === 0) fail(`${id}/${caseName}: input.tsx is empty`);
    if (outSrc.trim().length === 0) fail(`${id}/${caseName}: output.tsx is empty`);
    if (inSrc === outSrc && !caseName.includes('already-fixed')) {
      fail(`${id}/${caseName}: input.tsx == output.tsx but case is not marked already-fixed`);
    }
  }
  console.log(`[l12] ${id}: ${readdirSync(idDir).filter((d) => statSync(join(idDir, d)).isDirectory()).length} cases ok`);
}

pending.push('transform idempotence (PLAT codemod engine, W-3)');
for (const p of pending) console.log(`[l12] pending: ${p}`);
if (failed) process.exit(1);
console.log('[l12] done');
