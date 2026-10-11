#!/usr/bin/env node
/* canary-prepare.mjs (REQ-PLAT-77, PLAT-291/292)
   Prepares a Vite canary for its Playwright run, consuming the PACKED tarball
   (never the source tree):
     1. pack the repo root into <root>/aura-glass.tgz from the existing dist/
        (built by plat:build:dist; this script never builds the library);
     2. install the canary's dependencies (aura-glass from that tarball);
     3. `vite build` the canary.
   Usage: node scripts/ci/canary-prepare.mjs <canary-dir>
   Called from each canary's playwright.config.ts webServer command, so a bare
   `npx playwright test` inside the canary dir is self-contained.
   Exits non-zero on any failure — a missing dist/ is a failure, not a skip. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const canary = resolve(process.argv[2] ?? '.');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (cmd, args, cwd) => {
  console.log(`canary-prepare: (${cwd}) ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { cwd, stdio: ['ignore', 'inherit', 'inherit'] });
};
const fail = (msg) => { console.error(`canary-prepare: ${msg}`); process.exit(1); };

if (!existsSync(join(canary, 'package.json'))) fail(`no package.json in ${canary}`);
for (const f of ['dist/index.js', 'dist/styles.css', 'dist/tokens.css']) {
  if (!existsSync(join(ROOT, f))) fail(`${f} missing — run \`npm run build\` (plat:build:dist) first`);
}

/* 1. pack — always from the current dist/ (a stale tarball would test old output) */
const tgz = join(ROOT, 'aura-glass.tgz');
{
  const packDir = join(ROOT, '.artifacts', 'canary-pack');
  rmSync(packDir, { recursive: true, force: true });
  mkdirSync(packDir, { recursive: true });
  run(npm, ['pack', '--ignore-scripts', '--pack-destination', packDir], ROOT);
  const packed = readdirSync(packDir).filter((f) => f.endsWith('.tgz'));
  if (packed.length !== 1) fail(`expected one tarball in ${packDir}, found ${packed.length}`);
  renameSync(join(packDir, packed[0]), tgz);
}

/* 2. install — fresh node_modules so the tarball content is what is tested.
   @playwright/test is NOT a canary dependency: the runner resolves it from the
   repo root, and a second copy in the canary would break the test loader. */
rmSync(join(canary, 'node_modules'), { recursive: true, force: true });
rmSync(join(canary, 'dist'), { recursive: true, force: true });
run(npm, ['install', '--no-package-lock', '--no-audit', '--no-fund', '--include=dev'], canary);

/* 3. build */
run(join(canary, 'node_modules', '.bin', 'vite'), ['build'], canary);
console.log(`canary-prepare: ${canary} ready`);
