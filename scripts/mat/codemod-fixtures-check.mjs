#!/usr/bin/env node
/* scripts/mat/codemod-fixtures-check.mjs — L12 Unit cell (MAT-362, MOT-002).
 * Validates the codemod fixture corpus: every case dir under
 * fragments/codemods/mat/fixtures/<id>/<case>/ has non-empty input.{ts,tsx} and
 * output.{ts,tsx}, input != output unless the case is marked already-fixed or
 * idempotent, and each <id> is listed in the fragment's `fixtures` field. Transform-level
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
    // cases may be .ts or .tsx — find the first that exists
    const pick = (stem) => ['tsx', 'ts'].map((e) => join(caseDir, `${stem}.${e}`)).find(existsSync) ?? null;
    const input = pick('input');
    const output = pick('output');
    if (!input) { fail(`${id}/${caseName}: missing input.{ts,tsx}`); continue; }
    if (!output) { fail(`${id}/${caseName}: missing output.{ts,tsx}`); continue; }
    const inSrc = readFileSync(input, 'utf8');
    const outSrc = readFileSync(output, 'utf8');
    if (inSrc.trim().length === 0) fail(`${id}/${caseName}: input is empty`);
    if (outSrc.trim().length === 0) fail(`${id}/${caseName}: output is empty`);
    const noRewrite = /(already-fixed|idempotent)/.test(caseName);
    if (inSrc === outSrc && !noRewrite) {
      fail(`${id}/${caseName}: input == output but case is not marked already-fixed/idempotent`);
    }
  }
  console.log(`[l12] ${id}: ${readdirSync(idDir).filter((d) => statSync(join(idDir, d)).isDirectory()).length} cases ok`);
}

pending.push('transform idempotence (PLAT codemod engine, W-3)');
for (const p of pending) console.log(`[l12] pending: ${p}`);
if (failed) process.exit(1);
console.log('[l12] done');
