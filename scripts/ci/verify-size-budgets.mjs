#!/usr/bin/env node
/* PLAT-282 / REQ-PLAT-76: measure every SizeBudgetRow from loadFragments
   ('size-budgets') with esbuild (--bundle --minify --format=esm
   --platform=browser, peers external, gzip level 9) or gzip-9 of css dist
   assets; write the generated docs/size-budgets.json and per-row esbuild
   metafiles to .artifacts/plat/size/*.json.

   Rules (REQ-PLAT-76):
   - js rows name a public import: aura-glass specifiers resolve through
     build/exports.manifest.json to the emitted dist file. A specifier that is
     not a manifest entry fails the row (broken import) — except a subpath
     listed in AWAITING_PRODUCER, which is reported 'pending' with `pendingOn`
     naming the producer until the entry ships.
   - a bundle failure is 'fail' unless the row's entry is seed-pending per
     buildableEntries().
   - a css row naming a manifest-declared dist asset that is missing fails.
   - PROVISIONAL_ROWS and DEFAULT_CEILINGS come from src/contracts (bundled
     with esbuild — never restated here).
   - ratchet: a row looser than the same row on the base branch (or than its
     PLAT floor) requires a `Perf-Budget-Raise: <id>` trailer in a commit
     message of this MR (`git log <base>..HEAD`) plus a row in
     docs/size-budgets.changelog.md.
   - compat rows (`plat:compat-*`, derived in fragments/size-budgets/plat.ts as
     target row + 2048 B) are reported separately (`compat` in the aggregate);
     their limit follows the target row, which carries the ratchet.

   Env: AG_SIZE_ROOT (fixture root for tests; default the repo root),
   AG_SIZE_BASE (base ref for the ratchet; default origin/next). */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, realpathSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { build as esbuildBundle } from 'esbuild';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import { buildableEntries, manifestEntries, ROOT as REPO_ROOT } from '../build/lib/graph.mjs';
import { AWAITING_PRODUCER, baselineProblems, isCompatRow, ratchetProblems } from './size-budget-rules.mjs';

const ROOT = process.env.AG_SIZE_ROOT ?? REPO_ROOT;
const DIST = join(ROOT, 'dist');
const CHANGELOG = join(ROOT, 'docs', 'size-budgets.changelog.md');
const GENERATED = join(ROOT, 'docs', 'size-budgets.json');
const META_DIR = join(ROOT, '.artifacts', 'plat', 'size');
/* FIN-A-owned expiring baseline (scripts/integration/baselines/**) */
const BASELINE = join(ROOT, 'scripts', 'integration', 'baselines', 'size-budgets.json');

const EXTERNALS = ['react', 'react-dom', 'react/*', 'clsx', '@base-ui/*', '@tanstack/*',
  'motion', 'three', '@react-three/*', 'react-aria-components', '@internationalized/*',
  'react-hook-form', 'd3-*', 'tailwindcss'];

/* PROVISIONAL_ROWS/DEFAULT_CEILINGS live in src/contracts (type module); bundle
   it with esbuild like load-fragments does so the gate reads the contract
   values, not a restated copy. */
const contractsModule = await (async () => {
  const res = await esbuildBundle({
    entryPoints: [join(REPO_ROOT, 'src/contracts/fragments.ts')],
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

const git = (args) => {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }); }
  catch { return null; }
};

const bundle = async (contents) => {
  const res = await esbuildBundle({
    /* 'js', not 'ts': under the ts loader esbuild treats an unknown re-export
       as a possible type and silently drops it, so a broken import would
       measure 0 B and pass */
    stdin: { contents, loader: 'js', resolveDir: ROOT },
    bundle: true, write: false, minify: true, format: 'esm', platform: 'browser',
    external: EXTERNALS, treeShaking: true, metafile: true, logLevel: 'silent',
  });
  return { bytes: gzipSync(res.outputFiles[0].contents, { level: 9 }).length, metafile: res.metafile };
};

const short = (e) => String(e?.message ?? e).split('\n').slice(0, 3).join(' ').slice(0, 240);

export async function run() {
  if (!existsSync(DIST)) {
    console.error(`verify-size-budgets: ${DIST} is missing — run the build first (CI job plat:test runs it after the build stage).`);
    process.exit(1);
  }
  const { js: jsEntries, asset: assetEntries } = manifestEntries(ROOT);
  const pendingSubpaths = new Set(buildableEntries(ROOT).pending.map((e) => e.subpath));
  const manifestCss = new Set(assetEntries.filter((e) => e.css).map((e) => join(ROOT, e.css)));

  const rows = [];
  for (const { value } of await loadFragments('size-budgets', ROOT)) for (const r of value ?? []) rows.push(r);

  const baseBudgets = (() => {
    const text = git(['show', `${process.env.AG_SIZE_BASE ?? 'origin/next'}:docs/size-budgets.json`]);
    if (!text) return null;
    try {
      const agg = JSON.parse(text);
      return new Map([...(agg.rows ?? []), ...(agg.compat ?? [])].map((r) => [r.id, r]));
    } catch { return null; }
  })();
  const mrCommitMessages = git(['log', '--format=%B', `${process.env.AG_SIZE_BASE ?? 'origin/next'}..HEAD`]) ?? '';
  const changelog = existsSync(CHANGELOG) ? readFileSync(CHANGELOG, 'utf8') : '';

  const problems = [];
  const results = [];
  /* per-row measurement failures (over limit, broken import, missing asset):
     the only kind an expiring-baseline row may cover */
  const rowFailures = new Map();
  const rowFail = (row, why) => rowFailures.set(row.id, [...(rowFailures.get(row.id) ?? []), why]);
  const record = (row, status, measuredBytes, extra = {}) => {
    results.push({ ...row, status, measuredBytes, ...extra });
    if (status === 'fail' && measuredBytes !== null) rowFail(row, `${measuredBytes} B > ${row.limitBytes} B`);
  };
  const failRow = (row, why) => { results.push({ ...row, status: 'fail', measuredBytes: null, error: why }); rowFail(row, why); };
  const judge = (row, bytes) => record(row, bytes <= row.limitBytes ? 'pass' : 'fail', bytes);

  mkdirSync(META_DIR, { recursive: true });
  for (const row of rows) {
    if (row.kind === 'css') {
      const spec = row.import.replace(/^['"]|['"]$/g, '').replace(/#.*$/, '');
      const f = spec.startsWith('aura-glass/') ? join(DIST, spec.slice('aura-glass/'.length)) : join(ROOT, spec);
      if (!existsSync(f)) {
        if (manifestCss.has(f)) failRow(row, `manifest css asset ${spec} missing from dist`);
        else record(row, 'pending', null);
        continue;
      }
      judge(row, gzipSync(readFileSync(f), { level: 9 }).length);
      continue;
    }

    /* wildcard specifiers (aura-glass/x/*) measure the worst emitted leaf */
    const wild = /aura-glass\/[\w./-]+\*/.exec(row.import);
    if (wild) {
      const dir = join(DIST, wild[0].slice('aura-glass/'.length, -1));
      const leaves = existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith('.js')) : [];
      /* the wildcard's subject has not shipped — nothing to measure */
      if (!leaves.length) { record(row, 'pending', null); continue; }
      let worst = 0;
      let broken = null;
      for (const leaf of leaves) {
        try { worst = Math.max(worst, (await bundle(`export * from '${join(dir, leaf)}'`)).bytes); }
        catch (e) { broken = `bundle failed for ${leaf} — ${short(e)}`; break; }
      }
      if (broken) failRow(row, broken); else judge(row, worst);
      continue;
    }

    let spec = row.import.trim();
    /* a quoted bare specifier ("'aura-glass/forms'") is the same as unquoted */
    if (/^(['"])aura-glass[^'"]*\1$/.test(spec)) spec = spec.slice(1, -1);
    /* bare 'aura-glass/x' specifiers become a whole-entry measurement */
    if (/^aura-glass(\/|$)/.test(spec)) spec = `export * from '${spec}'`;
    /* fragments may hold bare '{ X } from ...' specifiers */
    if (!/^\s*(import|export)\b/.test(spec)) spec = `export ${spec}`;

    const m = /['"]aura-glass(\/[\w./-]+)?['"]/.exec(spec);
    const subpath = m ? (m[1] ? `.${m[1]}` : '.') : null;
    if (subpath) {
      const entry = jsEntries.find((e) => e.subpath === subpath);
      if (!entry) {
        const producer = AWAITING_PRODUCER[subpath];
        if (producer) record(row, 'pending', null, { pendingOn: producer });
        else failRow(row, `'aura-glass${subpath.slice(1)}' is not a public entry in build/exports.manifest.json`);
        continue;
      }
      spec = spec.replace(/['"]aura-glass(\/[\w./-]+)?['"]/g, `'${join(ROOT, entry.default)}'`);
    }

    let measured;
    try { measured = await bundle(spec); }
    catch (e) {
      if (subpath && pendingSubpaths.has(subpath)) record(row, 'pending', null, { error: short(e), pendingOn: 'seed-pending entry' });
      else failRow(row, `bundle failed — ${short(e)}`);
      continue;
    }
    writeFileSync(join(META_DIR, `${row.id.replace(/[^\w.-]+/g, '_')}.json`), JSON.stringify(measured.metafile, null, 2) + '\n');
    const provFloor = PROVISIONAL_ROWS[row.id.split(':').pop()];
    if (provFloor !== undefined && row.limitBytes > provFloor) problems.push(`${row.id}: limit ${row.limitBytes} looser than PROVISIONAL_ROWS ${provFloor}`);
    judge(row, measured.bytes);
  }

  /* expiring baseline (PRD-F §4.3 rule 3): a failing row owned by another
     stream may be listed until its owner fixes it; it is reported
     'baselined' (never 'pass'). A malformed row, a row for an unknown id, or
     a stale row (its budget now passes) fails the gate, so the list only
     shrinks. Never covers ratchet or provisional-ceiling violations. */
  const baselineRows = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : [];
  problems.push(...baselineProblems(baselineRows, results));
  const baselined = new Set(Array.isArray(baselineRows) ? baselineRows.map((b) => b?.row) : []);
  for (const r of results) if (r.status === 'fail' && baselined.has(r.id)) r.status = 'baselined';
  for (const [id, whys] of rowFailures) if (!baselined.has(id)) for (const why of whys) problems.push(`${id}: ${why}`);

  problems.push(...ratchetProblems(rows, baseBudgets, mrCommitMessages, changelog));

  const stylesCss = join(DIST, 'styles.css');
  const aggregate = {
    generatedAt: new Date().toISOString(),
    rows: results.filter((r) => !isCompatRow(r)),
    compat: results.filter(isCompatRow),
    ceilings: DEFAULT_CEILINGS,
    measured: {
      tarballPackedBytes: null,
      stylesCssGzBytes: existsSync(stylesCss) ? gzipSync(readFileSync(stylesCss), { level: 9 }).length : null,
    },
  };
  mkdirSync(join(ROOT, 'docs'), { recursive: true });
  writeFileSync(GENERATED, JSON.stringify(aggregate, null, 2) + '\n');
  if (aggregate.measured.stylesCssGzBytes !== null && aggregate.measured.stylesCssGzBytes > DEFAULT_CEILINGS.stylesCssBytes) {
    problems.push(`stylesCssBytes: ${aggregate.measured.stylesCssGzBytes} B > ${DEFAULT_CEILINGS.stylesCssBytes} B`);
  }

  const summary = (list) => `${list.filter((r) => r.status === 'pass').length}/${list.length} rows within limits (${list.filter((r) => r.status === 'pending').length} pending, ${list.filter((r) => r.status === 'baselined').length} baselined, ${list.filter((r) => r.status === 'fail').length} failing)`;
  const lines = [`verify-size-budgets: ${summary(aggregate.rows)}`, `verify-size-budgets: compat ${summary(aggregate.compat)}`];
  if (problems.length) {
    console.error([...lines, 'verify-size-budgets: FAILED', ...problems.map((p) => `  - ${p}`)].join('\n'));
    process.exit(1);
  }
  console.log(lines.join('\n'));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) await run();
