#!/usr/bin/env node
// certification/gates/coverage-ratchet.mjs — L12 built-in (REQ-QUAL-30): floors in certification/ratchets.json only
// increase. Compares against ratchets.json at the merge base with the line's base branch (next for 5x,
// release/4.x for 4x; override with AG_RATCHET_BASE). An unresolvable base is a failure, never a skip.
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const res = await build({ entryPoints: [join(root, 'packages/qa/src/evidence/coverageThreshold.ts')], bundle: true, write: false, format: 'esm', platform: 'node', packages: 'external', logLevel: 'silent' });
const mod = join(root, 'node_modules/.cache/auraglass-qa/coverage-threshold.mjs');
const { mkdirSync, writeFileSync } = await import('node:fs');
mkdirSync(dirname(mod), { recursive: true });
writeFileSync(mod, res.outputFiles[0].text);
const { compareRatchets, mergeBaseRatchets, readRatchets } = await import(mod);

const base = process.env.AG_RATCHET_BASE || (process.env.AG_LINE === '4x' ? 'origin/release/4.x' : 'origin/next');
let head;
let baseRatchets;
try {
  head = readRatchets(root);
  baseRatchets = mergeBaseRatchets(root, base);
} catch (e) {
  console.error(`coverage-ratchet: ${e.message}`);
  process.exit(1);
}
if (!baseRatchets) {
  console.log(`coverage-ratchet: certification/ratchets.json does not exist at the merge base with ${base} (introduced here); floors recorded.`);
  process.exit(0);
}
const decreases = compareRatchets(baseRatchets, head);
if (decreases.length) {
  console.error(`coverage-ratchet: floors only increase (REQ-QUAL-30):\n${decreases.map((d) => `  ${d}`).join('\n')}`);
  process.exit(1);
}
console.log(`coverage-ratchet: no floor decreased against the merge base with ${base}`);
