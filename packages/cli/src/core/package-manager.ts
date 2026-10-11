/** Package-manager detection: lockfile wins; packageManager field next; npm default. */
import fs from 'node:fs';
import path from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

const LOCKFILES: Array<[string, PackageManager]> = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lockb', 'bun'],
  ['bun.lock', 'bun'],
  ['package-lock.json', 'npm'],
];

export function detectPackageManager(cwd: string): PackageManager {
  for (const [file, pm] of LOCKFILES) {
    if (fs.existsSync(path.join(cwd, file))) return pm;
  }
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')) as {
      packageManager?: string;
    };
    if (typeof pkg.packageManager === 'string') {
      const name = pkg.packageManager.split('@')[0];
      if (name === 'pnpm' || name === 'yarn' || name === 'bun' || name === 'npm') return name;
    }
  } catch { /* fall through */ }
  return 'npm';
}

export function installCommand(pm: PackageManager, deps: string[], dev = false): string {
  const flag = dev ? ' -D' : '';
  if (pm === 'npm') return `npm install${dev ? ' --save-dev' : ''} ${deps.join(' ')}`;
  if (pm === 'pnpm') return `pnpm add${flag} ${deps.join(' ')}`;
  if (pm === 'yarn') return `yarn add${flag} ${deps.join(' ')}`;
  return `bun add${flag} ${deps.join(' ')}`;
}
