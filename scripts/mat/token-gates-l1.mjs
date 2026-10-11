#!/usr/bin/env node
/* scripts/mat/token-gates-l1.mjs — L1 Static provider for DS gates (MAT-332, REQ-MAT-17).
 * Runs every scripts/tokens/gates/*.mjs gate (undefined-vars, dead-vars,
 * tier-skip, types-runtime, literals vs fragments/literals-baseline; `_`-prefixed
 * files are shared helpers, not gates) and stylelint over the src css tree.
 * Every step runs even after an earlier one fails, so one log lists every
 * failing gate; the script exits 1 if any step failed. Absent inputs are
 * `pending`, never PASS. Total wall budget 30 s. */
import { readdirSync, existsSync, globSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();
const t0 = Date.now();
const pending = [];
const failed = [];
const run = (cmd, args) => spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });

// 1. every gate script lane 2a-T has landed, in stable order
const gatesDir = join(root, 'scripts/tokens/gates');
const gates = existsSync(gatesDir)
  ? readdirSync(gatesDir).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).sort()
  : [];
if (gates.length === 0) {
  pending.push('scripts/tokens/gates/*.mjs (lane 2a-T)');
}
for (const g of gates) {
  console.log(`[l1] gate ${g}`);
  const r = run(process.execPath, [join('scripts/tokens/gates', g)]);
  if (r.status !== 0) { console.error(`[l1] gate ${g} failed (exit ${r.status ?? r.signal})`); failed.push(g); }
}

// 2. stylelint over src/**/*.css (after the remote build in the job)
const hasConfig = existsSync(join(root, 'stylelint.config.mjs')) || existsSync(join(root, 'stylelint.config.js'));
const css = globSync('src/**/*.css', { cwd: root });
const stylelintBin = join(root, 'node_modules/.bin/stylelint');
if (!hasConfig) {
  pending.push('stylelint.config.mjs (lane 2a-T)');
} else if (css.length === 0) {
  pending.push('src/**/*.css (nothing to lint yet)');
} else if (!existsSync(stylelintBin)) {
  console.error('[l1] stylelint is not installed (node_modules/.bin/stylelint) — run npm ci');
  failed.push('stylelint');
} else {
  const t1 = Date.now();
  const r = run(stylelintBin, ['src/**/*.css']);
  console.log(`[l1] stylelint ${Date.now() - t1}ms over ${css.length} files`);
  if (r.status !== 0) { console.error(`[l1] stylelint failed (exit ${r.status ?? r.signal})`); failed.push('stylelint'); }
}

const total = Date.now() - t0;
console.log(`[l1] total ${total}ms`);
if (total > 30_000) { console.error(`[l1] gate time ${total}ms > 30000ms budget`); failed.push('budget'); }
for (const p of pending) console.log(`[l1] pending: ${p}`);
if (failed.length) { console.error(`[l1] FAILED: ${failed.join(', ')}`); process.exit(1); }
console.log('[l1] done');
