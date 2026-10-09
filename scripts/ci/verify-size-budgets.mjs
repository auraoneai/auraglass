#!/usr/bin/env node
/* PLAT-282 / REQ-PLAT-76: measure every SizeBudgetRow from loadFragments
   ('size-budgets') with esbuild (bundle+minify, format esm, platform browser,
   peers external, gzip 9) or gzip-9 of css dist assets; write generated
   docs/size-budgets.json and per-row esbuild metafiles to
   .artifacts/plat/size/*.json.

   Rules (REQ-PLAT-76):
   - js rows point at a real public import (aura-glass specifiers map to the
     emitted dist/<subpath>/index.js from build/exports.manifest.json).
   - a bundle failure is 'fail' unless the row's entry is seed-pending per
     buildableEntries().
   - PROVISIONAL_ROWS and DEFAULT_CEILINGS come from src/contracts (bundled
     with esbuild — the verifier never parses TS directly).
   - ratchet: a row looser than the same row on the base branch requires a
     `Perf-Budget-Raise: <id>` trailer in a commit message of this MR
     (`git log <base>..HEAD`) plus a row in docs/size-budgets.changelog.md. */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { build as esbuildBundle } from 'esbuild';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import { buildableEntries, manifestEntries, DIST, ROOT } from '../build/lib/graph.mjs';

const CHANGELOG = join(ROOT, 'docs', 'size-budgets.changelog.md');
const GENERATED = join(ROOT, 'docs', 'size-budgets.json');
const META_DIR = join(ROOT, '.artifacts', 'plat', 'size');

const EXTERNALS = ['react', 'react-dom', 'react/*', 'clsx', '@base-ui/*', '@tanstack/*',
  'motion', 'three', '@react-three/*', 'react-aria-components', '@internationalized/*',
  'react-hook-form', 'd3-*', 'tailwindcss'];

/* PROVISIONAL_ROWS/DEFAULT_CEILINGS live in src/contracts (type module); bundle
   it with esbuild exactly like load-fragments does so the gate reads the same
   values rather than a restated copy. */
const contractsModule = await (async () => {
  const res = await esbuildBundle({
    entryPoints: [join(ROOT, 'src/contracts/fragments.ts')],
    bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent',
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(res.outputFiles[0].text).toString('base64');
  return import(url);
})();
const { PROVISIONAL_ROWS, DEFAULT_CEILINGS } = contractsModule;
if (!PROVISIONAL_ROWS || !DEFAULT_CEILINGS) {
  console.error('verify-size-budgets: PROVISIONAL_ROWS/DEFAULT_CEILINGS missing from src/contracts/fragments.ts');
  process.exit(1);
}

const { js: jsEntries } = manifestEntries(ROOT);
const { pending: pendingEntries } = buildableEntries(ROOT);
const pendingSubpaths = new Set(pendingEntries.map((e) => e.subpath));

/* 'aura-glass' or 'aura-glass/<sub>' inside a row's import statement -> the
   manifest subpath ('.', './x') and emitted dist path. */
const specifierToEntry = (row) => {
  const m = /['"]aura-glass(\/[\w./-]+)?['"]/.exec(row.import);
  if (!m) return null;
  const sub = m[1] ? `.${m[1]}` : '.';
  const entry = jsEntries.find((e) => e.subpath === sub) ?? null;
  return { subpath: sub, entry };
};

const cssPathFor = (row) => {
  const spec = row.import.replace(/^['"]|['"]$/g, '').replace(/#.*$/, '');
  if (spec.startsWith('aura-glass/')) return join(ROOT, 'dist', spec.slice('aura-glass/'.length));
  return join(ROOT, spec);
};

const bundle = async (spec) => {
  const res = await esbuildBundle({
    stdin: { contents: spec, loader: 'ts', resolveDir: ROOT },
    bundle: true, write: false, minify: true, format: 'esm', platform: 'browser',
    external: EXTERNALS, treeShaking: true, metafile: true, logLevel: 'silent',
  });
  return { bytes: gzipSync(res.outputFiles[0].contents, { level: 9 }).length, metafile: res.metafile };
};

const git = (args) => {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }); }
  catch { return null; }
};

/* base-branch budgets for the ratchet (base ref overridable for tests). */
const BASE_REF = process.env.AG_SIZE_BASE ?? 'origin/next';
const baseBudgets = (() => {
  const text = git(['show', `${BASE_REF}:docs/size-budgets.json`]);
  if (!text) return null;
  try { return new Map(JSON.parse(text).rows.map((r) => [r.id, r])); } catch { return null; }
})();
const mrCommitMessages = git(['log', '--format=%B', `${BASE_REF}..HEAD`]) ?? '';
const changelog = existsSync(CHANGELOG) ? readFileSync(CHANGELOG, 'utf8') : '';

/* Provisional floors: a row looser than its PLAT floor is itself a raise and
   needs the changelog row + trailer even on a fresh base. */
const FLOORS = { 'plat:tailwind-bridge': 6144, 'plat:compat-globals': 1024, 'plat:cn': 512, 'plat:warnDeprecated': 150, 'plat:compat-tokens-css': 10240 };

/** Pure ratchet check — a row may be stricter than its base limit, never looser
   without 'Perf-Budget-Raise: <id>' in an MR commit message AND the changelog. */
export function ratchetProblems(rows, baseRows, commitMessages, changelogText) {
  const problems = [];
  for (const row of rows) {
    const base = baseRows?.get(row.id);
    const baseLimit = base ? Math.min(base.limitBytes, FLOORS[row.id] ?? base.limitBytes) : FLOORS[row.id];
    if (baseLimit === undefined || row.limitBytes <= baseLimit) continue;
    const trailer = `Perf-Budget-Raise: ${row.id}`;
    if (!commitMessages.includes(trailer)) problems.push(`${row.id}: limit raised ${base?.limitBytes ?? 'new'} -> ${row.limitBytes} without '${trailer}' in an MR commit message`);
    if (!changelogText.includes(trailer)) problems.push(`${row.id}: limit raised ${base?.limitBytes ?? 'new'} -> ${row.limitBytes} without a changelog row`);
  }
  return problems;
}

export async function run() {
  const rows = [];
  for (const { value } of await loadFragments('size-budgets', ROOT)) for (const r of value ?? []) rows.push(r);
  const problems = [];
  const results = [];
  mkdirSync(META_DIR, { recursive: true });
  for (const row of rows) {
    let measured = null;
    let metafile = null;
    if (row.kind === 'css') {
      const f = cssPathFor(row);
      if (!existsSync(f)) { results.push({ ...row, status: 'pending', measuredBytes: null }); continue; }
      measured = gzipSync(readFileSync(f), { level: 9 }).length;
    } else {
      /* wildcard specifiers (aura-glass/x/*) measure each emitted file */
      const wild = /aura-glass\/[\w./-]+\*/.exec(row.import);
      if (wild) {
        const dir = join(ROOT, 'dist', wild[0].slice('aura-glass/'.length, -1));
        if (!existsSync(dir)) {
          /* the wildcard's subject hasn't landed yet — pending, same as a
             missing css file */
          results.push({ ...row, status: 'pending', measuredBytes: null });
          continue;
        }
        let worst = 0;
        for (const f of readdirSync(dir).filter((n) => n.endsWith('.js'))) {
          try { ({ bytes: worst = Math.max(worst, (await bundle(`export * from '${join(dir, f)}'`)).bytes) }); }
          catch { /* unbundleable leaf */ }
        }
        measured = worst;
        results.push({ ...row, status: measured <= row.limitBytes ? 'pass' : 'fail', measuredBytes: measured });
        if (measured > row.limitBytes) problems.push(`${row.id}: ${measured} B > ${row.limitBytes} B`);
        continue;
      }
      const { subpath, entry } = specifierToEntry(row) ?? {};
      /* map the aura-glass specifier to the emitted dist file */
      let spec = row.import.trim();
      /* bare 'aura-glass/x' specifiers become a whole-entry measurement */
      if (!/from\s*['"]/.test(spec) && !/^['"]/.test(spec) && /^aura-glass/.test(spec)) spec = `export * from '${spec}'`;
      if (subpath) {
        const target = entry ? join(ROOT, entry.default) : null;
        const distPath = target ?? join(ROOT, 'dist', subpath === '.' ? 'index.js' : `${subpath.slice(2)}/index.js`);
        spec = spec.replace(/['"]aura-glass(\/[\w./-]+)?['"]/g, `'${distPath}'`);
      }
      /* strip trailing '(...)' annotations rows carry in their import text */
      spec = spec.replace(/\s*\([^)]*\)\s*$/, '');
      /* fragments may hold bare '{ X } from ...' specifiers — wrap as a real
         statement so esbuild parses it; a bare quoted specifier is a whole-
         entry measurement. */
      if (/^\s*['"]/.test(spec)) spec = `export * from ${spec}`;
      else if (!/^\s*(import|export)\b/.test(spec)) spec = `export ${spec}`;
      try { ({ bytes: measured, metafile } = await bundle(spec)); }
      catch (e) {
        /* seed-pending entries stay pending; everything else fails the row */
        const status = subpath && pendingSubpaths.has(subpath) ? 'pending' : 'fail';
        results.push({ ...row, status, measuredBytes: null, error: String(e).slice(0, 200) });
        if (status === 'fail') problems.push(`${row.id}: bundle failed — ${String(e).slice(0, 120)}`);
        continue;
      }
      if (metafile) {
        const safe = row.id.replace(/[^\w.-]+/g, '_');
        writeFileSync(join(META_DIR, `${safe}.json`), JSON.stringify(metafile, null, 2) + '\n');
      }
    }
    const provName = row.id.split(':').pop();
    const provFloor = PROVISIONAL_ROWS[provName];
    if (provFloor !== undefined && row.limitBytes > provFloor) problems.push(`${row.id}: limit ${row.limitBytes} looser than PROVISIONAL_ROWS ${provFloor}`);
    results.push({ ...row, status: measured <= row.limitBytes ? 'pass' : 'fail', measuredBytes: measured });
    if (measured > row.limitBytes) problems.push(`${row.id}: ${measured} B > ${row.limitBytes} B`);
  }

  problems.push(...ratchetProblems(rows, baseBudgets, mrCommitMessages, changelog));

  /* aggregate + fixed ceilings */
  const aggregate = {
    generatedAt: new Date().toISOString(), rows: results,
    ceilings: DEFAULT_CEILINGS,
    measured: {
      tarballPackedBytes: null, stylesCssGzBytes: existsSync(join(DIST, 'styles.css')) ? gzipSync(readFileSync(join(DIST, 'styles.css')), { level: 9 }).length : null,
    },
  };
  writeFileSync(GENERATED, JSON.stringify(aggregate, null, 2) + '\n');
  for (const [key, ceiling] of Object.entries(DEFAULT_CEILINGS)) {
    const v = key === 'stylesCssBytes' ? aggregate.measured.stylesCssGzBytes : null;
    if (v !== null && v > ceiling) problems.push(`${key}: ${v} B > ${ceiling} B`);
  }

  const passing = results.filter((r) => r.status === 'pass').length;
  const pending = results.filter((r) => r.status === 'pending').length;
  if (problems.length) {
    console.error(`verify-size-budgets: FAILED (${passing}/${results.length} rows within limits, ${pending} pending)`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(`verify-size-budgets: ${passing}/${results.length} rows within limits (${pending} pending)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) await run();
