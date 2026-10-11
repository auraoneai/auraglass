#!/usr/bin/env node
/* PLAT-77: Base UI latest reporting leg — reports @base-ui/react@latest vs the
   contract pin (package.json deps). Informational: being behind latest exits 0
   (the drift gate lives in verify-glass-quality.mjs); a report that cannot be
   produced (no pin, registry unreachable) exits 1 — never a silent pass. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const pinned = pkg.dependencies?.['@base-ui/react'] ?? pkg.devDependencies?.['@base-ui/react'];
if (!pinned) { console.error('base-ui-latest: @base-ui/react is not a dependency in package.json'); process.exit(1); }
let latest;
try {
  latest = execFileSync('npm', ['view', '@base-ui/react', 'version'], { encoding: 'utf8' }).trim();
} catch (e) {
  console.error(`base-ui-latest: npm view @base-ui/react failed — pinned ${pinned}: ${String(e).slice(0, 200)}`);
  process.exit(1);
}
const match = pinned === latest;
console.log(`base-ui-latest: pinned ${pinned} vs latest ${latest} — ${match ? 'current' : 'behind (informational)'}`);
