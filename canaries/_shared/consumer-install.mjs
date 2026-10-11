#!/usr/bin/env node
/* PLAT-293: install a canary the way a consumer does — from the packed
   artifact, never from the workspace. Packs the already-built repo (dist/ must
   exist; CI downloads it from plat:build:dist) to <root>/aura-glass.tgz, which
   every canary package.json references as file:../../aura-glass.tgz, then runs
   `npm install` in the canary so its own pinned toolchain (jest 29, vite +
   @vitejs/plugin-react + babel-plugin-react-compiler, typescript) is used.
   Usage: node canaries/_shared/consumer-install.mjs <canary-dir> */
import { execFileSync } from 'node:child_process';
import { existsSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TGZ = join(ROOT, 'aura-glass.tgz');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

export function packArtifact() {
  if (!existsSync(join(ROOT, 'dist'))) throw new Error('consumer-install: dist/ missing — build first (plat:build:dist)');
  const out = execFileSync(npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', ROOT], { cwd: ROOT, encoding: 'utf8' });
  const [{ filename }] = JSON.parse(out);
  rmSync(TGZ, { force: true });
  renameSync(join(ROOT, filename), TGZ);
  return TGZ;
}

export function consumerInstall(canaryDir) {
  const dir = resolve(canaryDir);
  packArtifact();
  rmSync(join(dir, 'node_modules'), { recursive: true, force: true });
  execFileSync(npm, ['install', '--no-audit', '--no-fund', '--no-package-lock', '--ignore-scripts'], { cwd: dir, stdio: 'inherit' });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  consumerInstall(process.argv[2] ?? process.cwd());
}
