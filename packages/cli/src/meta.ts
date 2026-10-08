/**
 * Package metadata for the AuraGlass CLI (PLAT-299). `PACKAGE_NAME` is the npm
 * name; `FALLBACK_PACKAGE_NAME` is the D-23 unscoped fallback set recorded in
 * `contracts/packages.json` and `docs/release/decisions/`.
 */
import fs from 'node:fs';
import path from 'node:path';

export const PACKAGE_NAME = '@auraglass/cli';
export const FALLBACK_PACKAGE_NAME = 'aura-glass-cli';

function pkgRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 12; i += 1) {
    const pj = path.join(dir, 'package.json');
    if (fs.existsSync(pj)) {
      try {
        if ((JSON.parse(fs.readFileSync(pj, 'utf8')) as { name?: string }).name === PACKAGE_NAME) return dir;
      } catch { /* keep walking */ }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

export const PACKAGE_VERSION: string = (() => {
  try {
    return (JSON.parse(fs.readFileSync(path.join(pkgRoot(), 'package.json'), 'utf8')) as { version: string }).version;
  } catch {
    return '0.0.0';
  }
})();

/** Printed by the retired 4.x bin (`bin/aura-glass.cjs`) when invoked on 5.x. */
export const MOVED_NOTICE = 'aura-glass CLI moved: use npx @auraglass/cli <command>';

/** Docs host. $CI_PAGES_URL until OD-12 (auraglass.dev) clears. */
export const DOCS_BASE_URL =
  process.env.AURAGLASS_DOCS_BASE_URL ??
  'https://chahal-foundation-group.gitlab.io/github-auraoneai/auraglass/';

export const BIN_NAME = 'auraglass';
export const REGISTRY_INDEX = 'registry/registry.json';
export const DEPRECATIONS_PATH = 'deprecations.json';
