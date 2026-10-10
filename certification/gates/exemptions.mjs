#!/usr/bin/env node
// certification/gates/exemptions.mjs — L1 built-in (REQ-QUAL-68): validates certification/exemptions.json
// (no OCR-contrast / console exemptions, expires ≤180 days, no expired entries).
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const res = await build({ entryPoints: [join(root, 'packages/qa/src/evidence/exemptions.ts')], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const { readExemptions, validateExemptions, EXEMPTIONS_FILE } = await import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`);

let raw;
try { raw = readExemptions(root); } catch (e) { console.error(`exemptions: cannot read ${EXEMPTIONS_FILE}: ${e.message}`); process.exit(1); }
const problems = validateExemptions(raw);
if (problems.length) {
  console.error(`exemptions: ${problems.length} problem(s) in ${EXEMPTIONS_FILE}:\n${problems.map((p) => `  ${p.code}: ${p.message}`).join('\n')}`);
  process.exit(1);
}
console.log(`exemptions: ${raw.length} valid exemption(s)`);
