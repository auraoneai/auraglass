#!/usr/bin/env node
/* verify-artifact.mjs (PLAT-250, REQ-PLAT-65/66) — hard gate on dist/ after post.mjs.
   Fails when: an emitted js has no d.ts twin, a d.ts still references tsconfig aliases
   or unresolved aura-glass/* specifiers, dist contains seed markers, or an entry the
   manifest says ships is absent. */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, DIST, buildableEntries, walk } from './lib/graph.mjs';

const failures = [];
const fail = (m) => { failures.push(m); console.error(`  FAIL ${m}`); };

const { keep, pending } = buildableEntries();
for (const e of keep) {
  const js = join(ROOT, e.default);
  const dts = js.replace(/\.js$/, '.d.ts');
  if (!existsSync(js)) fail(`missing ${e.default} for entry ${e.subpath}`);
  else if (!existsSync(dts)) fail(`missing d.ts twin for ${e.default}`);
}
for (const e of pending) console.log(`  pending entry ${e.subpath}: ${e.reason}`);

for (const f of walk(DIST, p => p.endsWith('.d.ts'))) {
  const t = readFileSync(f, 'utf8');
  for (const m of t.matchAll(/['"](@\/[^'"]+|aura-glass[^'"]*)['"]/g)) fail(`${f}: unresolved alias '${m[1]}'`);
}
for (const f of walk(DIST)) {
  const t = readFileSync(f, 'utf8');
  if (t.includes('@ag-contract-seed')) fail(`seed marker in dist: ${f}`);
  // the contract's own ATTRIBUTES table declares 'data-ag-seed' as a type key (§1.2 R5);
  // what must never reach dist is the attribute EMITTED by a module (js string/attr usage).
  if (f.endsWith('.js') && /data-ag-seed["'\s=)]/.test(t)) fail(`seed data attribute emitted in dist: ${f}`);
}
const styles = join(DIST, 'styles.css');
if (existsSync(styles) && !readFileSync(styles, 'utf8').startsWith('@layer ag.compat')) fail('dist/styles.css does not start with the layer-order statement');

if (failures.length) { console.error(`verify-artifact: ${failures.length} failure(s)`); process.exit(1); }
console.log(`verify-artifact: ${keep.length} entries verified, ${pending.length} pending`);
