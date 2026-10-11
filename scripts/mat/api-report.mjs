#!/usr/bin/env node
/* scripts/mat/api-report.mjs — MAT-343/345 (REQ-MAT-22). Lane wrapper that
   regenerates every MAT-owned API report (contract B22a) with the canonical
   writers, so the committed files are byte-equal to `npm run api:update`:
     material|theme|tokens|motion|root.mat|compat.mat
       -> etc/api/<entry>.{exports.json,api.md} via PLAT's
          `npm run api:update -- --entry <entry>` (scripts/build/api-report.mjs, S-52)
     material.css-api
       -> etc/api/material.css-api.json via scripts/mat/material-css-api.mjs (MAT-096/345)
   Parity of each barrel with ENTRIES / ROOT_EXPORTS.mat is enforced by
   tests/material/exports/entries.test.ts and scripts/tokens/gates/types-runtime.mjs,
   not by text appended to the reports (an appended section would make
   `api:update --check` report them stale).

   usage: node scripts/mat/api-report.mjs --all
          node scripts/mat/api-report.mjs --entry material|theme|tokens|motion|root.mat|compat.mat|material.css-api
*/
import { execFileSync } from 'node:child_process';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const entry = arg('entry');
const ALL = process.argv.includes('--all');
const REPORTS = ['material', 'theme', 'tokens', 'motion', 'root.mat', 'compat.mat'];

if (!ALL && !entry) {
  console.error(`usage: api-report.mjs --all | --entry ${[...REPORTS, 'material.css-api'].join('|')}`);
  process.exit(2);
}
const targets = ALL ? [...REPORTS, 'material.css-api'] : [entry];

for (const t of targets) {
  if (t === 'material.css-api') {
    const { write } = await import('./material-css-api.mjs');
    const { doc } = await write(process.cwd());
    console.log(`api-report: wrote etc/api/material.css-api.json (${doc.public.length} vars, ${doc.attributes.length} public attrs)`);
    continue;
  }
  if (!REPORTS.includes(t)) { console.error(`api-report: unknown entry '${t}'`); process.exit(1); }
  execFileSync('npm', ['run', '-s', 'api:update', '--', '--entry', t], { stdio: 'inherit' });
}
