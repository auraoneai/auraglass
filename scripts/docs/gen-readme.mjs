#!/usr/bin/env node
// gen-readme.mjs — PLAT-390. README.md is generated from README.tmpl.md:
// copy the template verbatim, then render-claims fills every
// `<!-- ag:claim <id> -->` region (pending-safe, never invented numbers).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAIMS_PATH } from './paths.mjs';
import { render } from './render-claims.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TEMPLATE = 'docs/README.tmpl.md';
const OUT = 'README.md';

export function main() {
  const tmpl = join(ROOT, TEMPLATE);
  if (!existsSync(tmpl)) { console.error(`${TEMPLATE} missing — create the template first`); process.exit(1); }
  const claimsPath = join(ROOT, CLAIMS_PATH);
  const claims = existsSync(claimsPath) ? JSON.parse(readFileSync(claimsPath, 'utf8')).claims : {};
  const out = render(readFileSync(tmpl, 'utf8'), claims);
  writeFileSync(join(ROOT, OUT), out);
  console.log(`README.md generated from ${TEMPLATE} (${(out.match(/ag:claim/g) ?? []).length ? 'regions filled' : 'no regions'})`);
}
if (process.argv[1]?.endsWith('gen-readme.mjs')) main();
