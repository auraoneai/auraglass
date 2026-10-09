#!/usr/bin/env node
/* PLAT-77: Base UI latest reporting leg — reports @base-ui/react@latest vs the
   contract pin (package.json deps). Report-only: never fails; the drift gate
   lives in verify-glass-quality.mjs. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const pinned = pkg.dependencies?.['@base-ui/react'] ?? pkg.devDependencies?.['@base-ui/react'];
let latest;
try {
  latest = execFileSync('npm', ['view', '@base-ui/react', 'version'], { encoding: 'utf8' }).trim();
} catch {
  console.log(`base-ui-latest: npm view failed (offline?) — pinned ${pinned}`);
  process.exit(0);
}
const match = pinned === latest;
console.log(`base-ui-latest: pinned ${pinned} vs latest ${latest} — ${match ? 'current' : 'behind (informational)'}`);
