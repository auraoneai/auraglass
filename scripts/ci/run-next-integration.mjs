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

const timed = (cmd, args, cwd, env = {}) => {
  const t0 = Date.now();
  run(cmd, args, cwd, env);
  return (Date.now() - t0) / 1000;
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
    /* 2.5 regenerate the server page from the live server-safe map — the page
       imports only subpaths currently marked safe:true. */
    run('node', ['scripts/ci/gen-server-page.mjs'], ROOT);

    /* 3. next build — hard gate: exit 0, no transpilePackages. Wall-time
       delta is reported (beta): > 20 s logs a warning, does not yet fail. */
    const secs = timed('npm', ['run', 'build'], dir);
    console.log(`plat:integration:${canary} build OK in ${secs.toFixed(1)}s`);
    if (secs > 20) console.log(`warning: ${canary} build exceeded the 20s beta delta (${secs.toFixed(1)}s)`);

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
