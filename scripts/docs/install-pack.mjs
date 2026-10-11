#!/usr/bin/env node
/* scripts/docs/install-pack.mjs — REQ-PLAT-99 (REQ-FIN-43). The docs app
   consumes aura-glass only from the packed tarball, never src/ or a
   workspace link. The tarball path is derived from the root package.json
   version (.artifacts/pack/aura-glass-<version>.tgz, written by
   plat:package:pack); any other tarball in the directory is ignored.
   Installs it into apps/docs with --no-save (the lockfile never references
   a build artifact, so `npm ci` stays valid before pack runs) and verifies
   the installed package is that tarball's version and not the repo root. */
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DEFAULT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Repo-relative tarball path for the root package version. */
export function packPath(root = ROOT_DEFAULT) {
  const { name, version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  if (name !== 'aura-glass') throw new Error(`root package is '${name}', expected 'aura-glass'`);
  return `.artifacts/pack/aura-glass-${version}.tgz`;
}

/** Checks the package resolved from apps/docs is the installed tarball. */
export function verifyInstalled(root = ROOT_DEFAULT) {
  const appDir = join(root, 'apps/docs');
  const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  let pkgJson = null;
  /* Node's node_modules lookup from apps/docs upward (explicit, so a test
     runner's resolver or package self-reference cannot mask the result). */
  for (let dir = appDir; ; dir = dirname(dir)) {
    const candidate = join(dir, 'node_modules', 'aura-glass', 'package.json');
    if (existsSync(candidate)) { pkgJson = candidate; break; }
    if (dirname(dir) === dir) break;
  }
  if (!pkgJson) return [`aura-glass is not resolvable from apps/docs`];
  const errors = [];
  const pkgDir = dirname(pkgJson);
  const real = realpathSync(pkgDir);
  if (real === realpathSync(root)) errors.push('aura-glass resolves to the repository root (workspace/self link), not the tarball');
  if (!/[\\/]node_modules[\\/]aura-glass$/.test(pkgDir)) errors.push(`aura-glass resolves outside node_modules: ${pkgDir}`);
  if (lstatSync(pkgDir).isSymbolicLink()) errors.push(`node_modules/aura-glass is a symlink (${relative(root, real)}), not an installed tarball`);
  const installed = JSON.parse(readFileSync(pkgJson, 'utf8')).version;
  if (installed !== version) errors.push(`installed aura-glass ${installed} != package.json version ${version}`);
  if (existsSync(join(pkgDir, 'src'))) errors.push('installed aura-glass contains src/ — not a packed tarball');
  return errors;
}

export function main(root = ROOT_DEFAULT, { install = true } = {}) {
  const rel = packPath(root);
  if (!existsSync(join(root, rel))) {
    console.error(`install-pack: ${rel} missing — plat:package:pack must run first (plat:build:docs needs it)`);
    return 1;
  }
  if (install) {
    execFileSync('npm', ['install', '--no-save', '--no-audit', '--no-fund', '--ignore-scripts', '-w', 'apps/docs', `./${rel}`], { cwd: root, stdio: 'inherit' });
  }
  const errors = verifyInstalled(root);
  for (const e of errors) console.error(`install-pack: ${e}`);
  if (!errors.length) console.log(`install-pack: apps/docs uses ${rel}`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
