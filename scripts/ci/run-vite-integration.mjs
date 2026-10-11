#!/usr/bin/env node
/* plat:integration:vite on the 5x line (§4.13.4, PLAT-291/292/293/294).
   Real runner: packs aura-glass to a tarball, installs each vite-family
   canary (vite, vite-tailwind4, vite-compiler, types-strict, jest-cjs), and
   runs the leg's own gate script (vite build / tsc / jest). Browser legs run
   only when AG_PLAYWRIGHT=1. */
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const LEGS = [
  { dir: 'vite', gate: ['npm', ['run', 'build']], playwright: true },
  { dir: 'vite-tailwind4', gate: ['npm', ['run', 'build']], playwright: false },
  { dir: 'vite-compiler', gate: ['npm', ['run', 'build']], playwright: false },
  { dir: 'types-strict', gate: ['npm', ['run', 'check']], playwright: false },
  { dir: 'jest-cjs', gate: ['npm', ['test']], playwright: false },
];

const run = (cmd, args, cwd, env = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}  (cwd: ${cwd})`);
  execFileSync(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });
};

const packOut = execFileSync('npm', ['pack', '--pack-destination', ROOT], { cwd: ROOT, encoding: 'utf8' }).trim();
const tarball = packOut.split('\n').pop().trim();
const tarballAbs = join(ROOT, tarball);
console.log(`packed: ${tarball}`);

try {
  for (const leg of LEGS) {
    const dir = join(ROOT, 'canaries', leg.dir);
    if (!existsSync(join(dir, 'package.json'))) {
      console.log(`plat:integration:${leg.dir} pending (canaries/${leg.dir} not merged yet)`);
      continue;
    }
    run('npm', ['install', '--legacy-peer-deps', `../../${tarball}`], dir);
    run('npm', ['install', '--legacy-peer-deps'], dir);
    /* REQ-PLAT-71: singleton packages must resolve to one version each and
       no nested node_modules may appear under aura-glass. */
    run('node', ['../../scripts/ci/single-instance-check.mjs', '.'], dir);
    run(leg.gate[0], leg.gate[1], dir);
    console.log(`plat:integration:${leg.dir} gate OK`);

    if (leg.playwright) {
      if (process.env.AG_PLAYWRIGHT === '1') {
        run('npx', ['vite', 'preview', '--port', '4173'], dir); /* launched by the spec config on CI */
        run('npx', ['playwright', 'install', '--with-deps', 'chromium'], dir);
        run('npx', ['playwright', 'test'], dir);
        console.log(`plat:integration:${leg.dir} playwright OK`);
      } else {
        console.log(`plat:integration:${leg.dir} playwright legs skipped (AG_PLAYWRIGHT!=1)`);
      }
    }
  }
  console.log('plat:integration:vite OK');
} finally {
  rmSync(tarballAbs, { force: true });
}
