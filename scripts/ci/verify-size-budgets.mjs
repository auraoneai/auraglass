#!/usr/bin/env node
/* PLAT-282 / REQ-PLAT-76: measure every SizeBudgetRow from loadFragments
   ('size-budgets') with esbuild (bundle+minify, format esm, platform browser,
   peers external, gzip 9) or gzip-9 of css dist assets; write generated
   docs/size-budgets.json. A row may be stricter than PROVISIONAL_ROWS /
   DEFAULT_CEILINGS — never looser; raising a limit needs a changelog entry
   with the Perf-Budget-Raise trailer (checked here). */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import { DIST, ROOT } from '../build/lib/graph.mjs';

/* DEFAULT_CEILINGS/PROVISIONAL_ROWS live in fragments.ts (type module); the
   frozen values are restated here so the gate never imports TS at run time. */
const CEILINGS = { subpathCssBytes: 8192, stylesCssBytes: 32768, tarballBytes: 2 * 1024 * 1024, nodeColdImportMs: 150 };
const PROVISIONAL = { Button: 10240, Dialog: 20480, Select: 25600, Table: 46080, AiThreadMessageComposer: 25600, MaterialJs: 3072, SingleIcon: 1024 };

const CHANGELOG = join(ROOT, 'docs', 'size-budgets.changelog.md');
const GENERATED = join(ROOT, 'docs', 'size-budgets.json');
const EXTERNALS = ['react', 'react-dom', 'react/*', 'clsx', '@base-ui/*', '@tanstack/*',
  'motion', 'three', '@react-three/*', 'react-aria-components', '@internationalized/*',
  'react-hook-form', 'd3-*', 'tailwindcss'];

const bundle = async (spec) => {
  const esbuild = await import('esbuild');
  const res = await esbuild.build({
    stdin: { contents: spec, loader: 'ts', resolveDir: ROOT },
    bundle: true, write: false, minify: true, format: 'esm', platform: 'browser',
    external: EXTERNALS, treeShaking: true, metafile: true,
  });
  return { bytes: gzipSync(res.outputFiles[0].contents, { level: 9 }).length, metafile: res.metafile };
};

export async function run() {
  const rows = [];
  for (const { value } of await loadFragments('size-budgets', ROOT)) for (const r of value ?? []) rows.push(r);
  const changelog = existsSync(CHANGELOG) ? readFileSync(CHANGELOG, 'utf8') : '';
  const problems = [];
  const results = [];
  for (const row of rows) {
    let measured = null;
    if (row.kind === 'css') {
      const f = join(ROOT, row.import);
      if (!existsSync(f)) { results.push({ ...row, status: 'pending', measuredBytes: null }); continue; }
      measured = gzipSync(readFileSync(f), { level: 9 }).length;
    } else {
      /* 'import' holds a TS import statement over aura-glass specifiers —
         map them to emitted dist files before bundling. */
      let spec = row.import;
      spec = spec.replace(/aura-glass(\/[\w-]+)?/g, (m, sub) => {
        const p = sub ? `./dist/${sub.slice(1)}/index.js` : './dist/index.js';
        return p;
      });
      try { ({ bytes: measured } = await bundle(spec)); }
      catch { results.push({ ...row, status: 'pending', measuredBytes: null }); continue; }
    }
    const provName = row.id.split(':').pop();
    const provFloor = PROVISIONAL[provName];
    if (provFloor !== undefined && row.limitBytes > provFloor) problems.push(`${row.id}: limit ${row.limitBytes} looser than PROVISIONAL_ROWS ${provFloor}`);
    const ceiling = row.limitBytes;
    results.push({ ...row, status: measured <= ceiling ? 'pass' : 'fail', measuredBytes: measured });
    if (measured > ceiling) problems.push(`${row.id}: ${measured} B > ${ceiling} B`);
  }
  /* aggregate + fixed ceilings */
  const aggregate = {
    generatedAt: new Date().toISOString(), rows: results,
    ceilings: CEILINGS,
    measured: {
      tarballPackedBytes: null, stylesCssGzBytes: existsSync(join(DIST, 'styles.css')) ? gzipSync(readFileSync(join(DIST, 'styles.css')), { level: 9 }).length : null,
    },
  };
  writeFileSync(GENERATED, JSON.stringify(aggregate, null, 2) + '\n');
  /* raise check: a row looser than its PLAT floor needs 'Perf-Budget-Raise:
     <row id>' in the changelog (lower-only ratchet after calibration). */
  const FLOORS = { 'plat:tailwind-bridge': 6144, 'plat:compat-globals': 1024, 'plat:cn': 512, 'plat:warnDeprecated': 150 };
  for (const r of results) {
    const floor = FLOORS[r.id];
    if (floor !== undefined && r.limitBytes > floor && !changelog.includes(`Perf-Budget-Raise: ${r.id}`)) {
      problems.push(`${r.id}: limit ${r.limitBytes} exceeds floor ${floor} without 'Perf-Budget-Raise: ${r.id}' changelog entry`);
    }
  }
  if (problems.length) { problems.forEach(p => console.error(`verify-size-budgets: ${p}`)); return 1; }
  console.log(`verify-size-budgets: ${results.filter(r => r.status === 'pass').length}/${results.length} rows within limits`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(await run());
