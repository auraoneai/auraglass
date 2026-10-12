#!/usr/bin/env node
/* plat:integration:next on the 5x line (§4.13.4, PLAT-288/289/290/294).
   Real runner: packs aura-glass to a tarball, installs each Next canary
   (next16, next15), `next build`s it, and — when a Chromium runtime is
   available — runs the Playwright rsc + first-load specs. The build leg is
   hard-gating; the browser legs report skipped when Playwright browsers are
   absent (remote-first rule relaxes on this VM). */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parsePackJson } from './lib/npm-pack.cjs';

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

/* REQ-PLAT-77: the 20 s build budget is a DELTA against an empty Next app
   built in the same job on the same runner — an absolute wall-time says
   nothing about aura-glass's cost. The baseline is a minimal App Router app
   pinned to the canary's own next/react versions (no aura-glass), scaffolded
   under .artifacts/ and built once per canary. Beta: warn over 20 s delta. */
const BUILD_DELTA_BUDGET_S = 20;
const emptyBaselineSecs = (canary, canaryDir) => {
  const dir = join(ROOT, '.artifacts', `empty-next-baseline-${canary}`);
  try {
    const pkg = JSON.parse(readFileSync(join(canaryDir, 'package.json'), 'utf8'));
    const deps = { ...(pkg.dependencies ?? {}) };
    delete deps['aura-glass'];
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(join(dir, 'app'), { recursive: true });
    writeFileSync(join(dir, 'package.json'), JSON.stringify({
      name: `ag-empty-baseline-${canary}`, private: true, version: '0.0.0',
      scripts: { build: 'next build' },
      dependencies: deps,
      devDependencies: {
        typescript: pkg.devDependencies?.typescript ?? '^5.6.0',
        '@types/node': pkg.devDependencies?.['@types/node'] ?? '^22.0.0',
        '@types/react': pkg.devDependencies?.['@types/react'] ?? '^19.0.0',
        '@types/react-dom': pkg.devDependencies?.['@types/react-dom'] ?? '^19.0.0',
      },
    }, null, 2));
    writeFileSync(join(dir, 'next.config.mjs'), 'export default {};\n');
    writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify({
      compilerOptions: {
        target: 'ES2022', lib: ['dom', 'dom.iterable', 'esnext'], jsx: 'preserve',
        module: 'esnext', moduleResolution: 'bundler', allowJs: true, skipLibCheck: true,
        strict: true, noEmit: true, esModuleInterop: true, isolatedModules: true,
        incremental: true, forceConsistentCasingInFileNames: true,
        plugins: [{ name: 'next' }], paths: { '@/*': ['./*'] },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }, null, 2));
    writeFileSync(join(dir, 'app', 'layout.tsx'),
      'export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="en"><body>{children}</body></html>;\n}\n');
    writeFileSync(join(dir, 'app', 'page.tsx'), 'export default function Page() { return <main>empty baseline</main>; }\n');
    run('npm', ['install', '--legacy-peer-deps'], dir);
    return timed('npm', ['run', 'build'], dir);
  } catch (e) {
    console.log(`warning: empty ${canary} baseline build failed (${e instanceof Error ? e.message : e}) — delta not measured this run`);
    return null;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

/* 1. pack the artifact */
const packOut = execFileSync('npm', ['pack', '--json', '--pack-destination', ROOT], { cwd: ROOT, encoding: 'utf8' }).trim();
const { filename: tarball } = parsePackJson(packOut);
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
    /* 2.5 regenerate the server page from the live server-safe map — the page
       imports only subpaths currently marked safe:true. */
    run('node', ['scripts/ci/gen-server-page.mjs'], ROOT);

    /* 3. next build — hard gate: exit 0, no transpilePackages. The build
       DELTA vs the empty-app baseline (same job, same runner) is reported
       against the 20 s beta budget (warn-only until beta). */
    const secs = timed('npm', ['run', 'build'], dir);
    console.log(`plat:integration:${canary} build OK in ${secs.toFixed(1)}s`);
    const baselineSecs = emptyBaselineSecs(canary, dir);
    if (baselineSecs !== null) {
      const delta = secs - baselineSecs;
      console.log(`plat:integration:${canary} build delta vs empty app: ${delta.toFixed(1)}s (canary ${secs.toFixed(1)}s - empty ${baselineSecs.toFixed(1)}s; beta budget ${BUILD_DELTA_BUDGET_S}s)`);
      if (delta > BUILD_DELTA_BUDGET_S) {
        console.log(`warning: ${canary} build delta ${delta.toFixed(1)}s exceeds the ${BUILD_DELTA_BUDGET_S}s beta budget (warn-only at beta)`);
      }
    }

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
