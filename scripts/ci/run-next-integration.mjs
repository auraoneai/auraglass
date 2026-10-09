#!/usr/bin/env node
/* plat:integration:next on the 5x line (§4.13.4, PLAT-288/289/290/294).
   Real runner: packs aura-glass to a tarball, installs each Next canary
   (next16, next15), `next build`s it, and — when a Chromium runtime is
   available — runs the Playwright rsc + first-load specs. The build leg is
   hard-gating; the browser legs report skipped when Playwright browsers are
   absent (remote-first rule relaxes on this VM). */
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CANARIES = ['next16', 'next15'];

const run = (cmd, args, cwd, env = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}  (cwd: ${cwd})`);
  execFileSync(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });
};

/* 1. pack the artifact */
const packOut = execFileSync('npm', ['pack', '--pack-destination', ROOT], { cwd: ROOT, encoding: 'utf8' }).trim();
const tarball = packOut.split('\n').pop().trim();
const tarballAbs = join(ROOT, tarball);
console.log(`packed: ${tarball}`);

try {
  for (const canary of CANARIES) {
    const dir = join(ROOT, 'canaries', canary);
    if (!existsSync(join(dir, 'package.json'))) {
      console.log(`plat:integration:${canary} pending (canaries/${canary} not merged yet)`);
      continue;
    }
    /* 2. install against the packed tarball */
    run('npm', ['install', '--legacy-peer-deps', `../../${tarball}`], dir);
    run('npm', ['install', '--legacy-peer-deps'], dir);
    /* REQ-PLAT-71: singleton packages must resolve to one version each and
       no nested node_modules may appear under aura-glass. */
    run('node', ['../../scripts/ci/single-instance-check.mjs', '.'], dir);
    /* 3. next build — hard gate: exit 0, no transpilePackages */
    run('npm', ['run', 'build'], dir);
    console.log(`plat:integration:${canary} build OK`);

    /* 4. Playwright legs — only when browsers are installed */
    if (process.env.AG_PLAYWRIGHT === '1') {
      run('npx', ['playwright', 'install', '--with-deps', 'chromium'], dir);
      run('npx', ['playwright', 'test'], dir, { AG_CANARY_BASE: `http://localhost:3000` });
      console.log(`plat:integration:${canary} playwright OK`);
    } else {
      console.log(`plat:integration:${canary} playwright legs skipped (AG_PLAYWRIGHT!=1)`);
    }
  }
  console.log('plat:integration:next OK');
} finally {
  rmSync(tarballAbs, { force: true });
}
