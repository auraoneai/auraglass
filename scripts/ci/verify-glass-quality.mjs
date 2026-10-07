#!/usr/bin/env node
/* plat:gate:glass-quality on the 5x line (§4.13.4). Checks the gates that exist on
   the merged tree: no @ag-contract-seed marker may appear in a built file, the frozen
   dep set holds, and seeds are reported pending (never faked). */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const fail = [];
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const deps = pkg.dependencies ?? {};
if (deps['@base-ui/react'] !== '1.8.0') fail.push(`@base-ui/react pin drifted: ${deps['@base-ui/react']}`);
if (deps['clsx'] !== '2.1.1') fail.push(`clsx pin drifted: ${deps['clsx']}`);
if (pkg.type !== 'module') fail.push('package.json "type" must be "module"');

// Seeds are allowed in src/ pre-GA (G-02 is the gate); dist must never contain them.
if (existsSync('dist')) {
  const out = execSync('grep -rln "data-ag-seed\\|@ag-contract-seed" dist/ || true', { encoding: 'utf8' }).trim();
  if (out) fail.push(`seed marker in dist/: ${out}`);
}
if (fail.length) { console.error('plat:gate:glass-quality FAIL:\n' + fail.join('\n')); process.exit(1); }
console.log('plat:gate:glass-quality OK');
