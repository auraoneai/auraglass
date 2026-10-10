#!/usr/bin/env node
/* PLAT-289: Playwright webServer for the Next canaries (next16, next15).
   `plat:integration:next` runs `npx playwright test` inside each canary dir;
   without a server every spec failed with "Cannot navigate to invalid URL".
   This packs the built artifact to <root>/aura-glass.tgz (the canary's
   `file:../../aura-glass.tgz` dep), installs the canary against it, runs
   `next build` (no transpilePackages) and execs `next start`.
   Usage: node ../next-serve.mjs <port>   (cwd: canaries/<canary>) */
import { execFileSync, spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const dir = process.cwd();
const root = resolve(dir, '..', '..');
const port = process.argv[2] ?? '3000';
const run = (cmd, args, cwd) => {
  console.log(`$ ${cmd} ${args.join(' ')}  (cwd: ${cwd})`);
  execFileSync(cmd, args, { cwd, stdio: 'inherit' });
};

/* 1. pack once per checkout; dist/ comes from plat:build:dist */
const tgz = join(root, 'aura-glass.tgz');
if (!existsSync(tgz)) {
  if (!existsSync(join(root, 'dist'))) throw new Error('dist/ missing: run `npm run build` first');
  const out = mkdtempSync(join(tmpdir(), 'ag-pack-'));
  const name = execFileSync('npm', ['pack', '--ignore-scripts', '--silent', '--pack-destination', out], { cwd: root, encoding: 'utf8' })
    .trim().split('\n').pop().trim();
  copyFileSync(join(out, name), tgz); /* /tmp may be another device (EXDEV) */
  rmSync(out, { recursive: true, force: true });
}

/* 2. install + build (skipped when a build already exists, e.g. after
   scripts/ci/run-next-integration.mjs) */
if (!existsSync(join(dir, '.next', 'BUILD_ID'))) {
  run('npm', ['install', '--no-save', '--no-audit', '--no-fund', '--legacy-peer-deps'], dir);
  run(join(dir, 'node_modules', '.bin', 'next'), ['build'], dir);
}
/* the specs must resolve the runner's @playwright/test, not a second copy */
for (const p of ['@playwright', 'playwright', 'playwright-core']) {
  rmSync(join(dir, 'node_modules', p), { recursive: true, force: true });
}

/* 3. serve */
const child = spawn(join(dir, 'node_modules', '.bin', 'next'), ['start', '-p', port], { cwd: dir, stdio: 'inherit' });
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => child.kill(s));
child.on('exit', (code) => process.exit(code ?? 1));
