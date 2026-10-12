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
import { fileURLToPath, pathToFileURL } from 'node:url';
import { realpathSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { build as esbuildBundle } from 'esbuild';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import { buildableEntries, manifestEntries, DIST, ROOT } from '../build/lib/graph.mjs';

const CHANGELOG = join(ROOT, 'docs', 'size-budgets.changelog.md');
const GENERATED = join(ROOT, 'docs', 'size-budgets.json');
const SIZE_ARTIFACT = join(ROOT, '.artifacts', 'plat', 'size-budgets', 'size-budgets.json');
const gitHead = () => { try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
const META_DIR = join(ROOT, '.artifacts', 'plat', 'size');

const EXTERNALS = ['react', 'react-dom', 'react/*', 'clsx', '@base-ui/*', '@tanstack/*',
  'motion', 'three', '@react-three/*', 'react-aria-components', '@internationalized/*',
  'react-hook-form', 'd3-*', 'tailwindcss'];

/* PROVISIONAL_ROWS/DEFAULT_CEILINGS live in src/contracts (type module); bundle
   it with esbuild exactly like load-fragments does so the gate reads the same
   values rather than a restated copy. Loaded inside run() (no top-level await)
   so tests can import the pure ratchetProblems() helper. */
const loadContracts = async () => {
  const res = await esbuildBundle({
    entryPoints: [join(ROOT, 'src/contracts/fragments.ts')],
    bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent',
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(res.outputFiles[0].text).toString('base64');
  return import(url);
};

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

/* REQ-PLAT-76: PLAT's cn/warnDeprecated rows name 'aura-glass/internal',
   which is deliberately NOT a public manifest entry. The one explicit
   internal-row allowance maps it to src/internal (the shipped subject's
   source); every other unknown aura-glass subpath fails the row instead of
   sitting 'pending' forever. */
export const INTERNAL_SUBPATH = './internal';
export function rowTarget(row) {
  const t = specifierToEntry(row);
  if (!t) return null;
  return { ...t, internal: t.subpath === INTERNAL_SUBPATH };
}

/* REQ-PLAT-76: "each compat import <= its target + 2 KB (reported
   separately)" — one generated row per compat export whose 5.0 target
   (exact name, or the Glass-prefixed legacy name stripped) has its own js
   row. Rows carry `compatOf` so the aggregate reports them as the compat
   group, distinct from the targets' own rows. */
export function compatRows(rows, compatExports) {
  const byId = new Map(rows.filter((r) => r.kind === 'js').map((r) => [r.id, r]));
  const out = [];
  for (const name of compatExports) {
    const target = byId.get(name) ?? byId.get(name.replace(/^Glass/, '')) ?? byId.get(name.replace(/^EnhancedGlass/, ''));
    if (!target) continue;
    out.push({
      id: `plat:compat:${name}`,
      import: `export { ${name} } from 'aura-glass/compat'`,
      limitBytes: target.limitBytes + 2048,
      kind: 'js',
      compatOf: target.id,
    });
  }
  return out;
}

const cssPathFor = (row) => {
  const spec = row.import.replace(/^['"]|['"]$/g, '').replace(/#.*$/, '');
  if (spec.startsWith('aura-glass/')) return join(ROOT, 'dist', spec.slice('aura-glass/'.length));
  return join(ROOT, spec);
};

/* gzip-9 of every shipped preset block (presetCssText values, joined the way
   a page holding all of them would carry them); null until dist has them. */
const PRESETS_DIST = join(ROOT, 'dist', 'tokens', 'generated', 'presets.js');
const presetBlocksBytes = async () => {
  if (!existsSync(PRESETS_DIST)) return null;
  const { presetCssText } = await import(pathToFileURL(PRESETS_DIST).href);
  if (!presetCssText || typeof presetCssText !== 'object') return null;
  return gzipSync(Object.values(presetCssText).join('\n'), { level: 9 }).length;
};

const bundle = async (spec, opts = {}) => {
  const res = await esbuildBundle({
    stdin: { contents: spec, loader: 'ts', resolveDir: ROOT },
    bundle: true, write: false, minify: true, format: 'esm', platform: 'browser',
    external: EXTERNALS, treeShaking: true, metafile: true, logLevel: 'silent',
    /* internal rows measure the production-eliminated cost: warnDeprecated
       is dev-only by contract (its whole body, incl. the generated lookup
       table, compiles away under NODE_ENV=production in consumer bundles). */
    ...(opts.production ? { define: { 'process.env.NODE_ENV': '"production"' } } : {}),
  });
  return { bytes: gzipSync(res.outputFiles[0].contents, { level: 9 }).length, metafile: res.metafile };
};

/* "(motion share)" rows (REQ-MOT-120..123: "{ Button } <= 10 KB with <= 0.5 KB
   motion share"): the min+gz bytes of the bundle attributable to dist/motion/**,
   i.e. gz(bundle) x minified-motion-bytes / minified-bundle-bytes. */
const SHARE_RE = /\s*\((\w+) share\)\s*$/;
const shareOf = ({ bytes, metafile }, area) => {
  const out = Object.values(metafile.outputs)[0];
  const total = Object.values(out.inputs).reduce((n, i) => n + i.bytesInOutput, 0);
  const own = Object.entries(out.inputs)
    .filter(([k]) => k.split('\\').join('/').includes(`/dist/${area}/`))
    .reduce((n, [, i]) => n + i.bytesInOutput, 0);
  return total ? Math.round((bytes * own) / total) : 0;
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
const FLOORS = { 'plat:tailwind-bridge': 6144, 'plat:compat-globals': 1024, 'plat:cn': 512, 'plat:warnDeprecated': 150 };

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
  const { PROVISIONAL_ROWS, DEFAULT_CEILINGS } = await loadContracts();
  if (!PROVISIONAL_ROWS || !DEFAULT_CEILINGS) {
    console.error('verify-size-budgets: PROVISIONAL_ROWS/DEFAULT_CEILINGS missing from src/contracts/fragments.ts');
    process.exit(1);
  }
  const rows = [];
  for (const { value } of await loadFragments('size-budgets', ROOT)) for (const r of value ?? []) rows.push(r);
  /* REQ-PLAT-76: generated per-compat-export rows (target + 2 KB), reported
     separately via their `compatOf` marker in the aggregate. */
  const compatExportsPath = join(ROOT, 'etc/api/compat.exports.json');
  if (existsSync(compatExportsPath)) {
    const compatNames = JSON.parse(readFileSync(compatExportsPath, 'utf8')).exports ?? [];
    rows.push(...compatRows(rows, compatNames));
  }
  const problems = [];
  const results = [];
  mkdirSync(META_DIR, { recursive: true });
  for (const row of rows) {
    let measured = null;
    let metafile = null;
    if (row.kind === 'css') {
      /* '#preset-blocks' (MAT-342: "tokens.css <= 8 KB excluding presets, with
         preset blocks <= 2 KB") measures the preset blocks themselves — the
         generated preset cssText the package ships (dist/tokens/generated/
         presets.js, injected by the provider's preset prop) — never the whole
         tokens.css, which the separate mat:tokens-css row already covers. */
      if (/#preset-blocks$/.test(row.import)) {
        const bytes = await presetBlocksBytes();
        if (bytes === null) { results.push({ ...row, status: 'pending', measuredBytes: null }); continue; }
        measured = bytes;
      } else {
        const f = cssPathFor(row);
        if (!existsSync(f)) { results.push({ ...row, status: 'pending', measuredBytes: null }); continue; }
        measured = gzipSync(readFileSync(f), { level: 9 }).length;
      }
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
      const { subpath, entry, internal } = rowTarget(row) ?? {};
      /* REQ-PLAT-76: an aura-glass subpath that is not a public entry in
         build/exports.manifest.json (and not the explicit internal-row
         allowance) FAILS — an unknown subpath sitting 'pending' forever
         silently un-measures the row. */
      if (subpath && !entry && !internal) {
        results.push({ ...row, status: 'fail', measuredBytes: null, error: `unknown aura-glass subpath '${subpath}' (not a manifest entry)` });
        problems.push(`${row.id}: unknown aura-glass subpath '${subpath}' — point the row at a public entry`);
        continue;
      }
      /* map the aura-glass specifier to the emitted dist file */
      let spec = row.import.trim();
      const share = SHARE_RE.exec(spec)?.[1] ?? null;
      if (share) spec = spec.replace(SHARE_RE, '');
      /* bare 'aura-glass/x' (or quoted "'aura-glass/x'") specifiers become a
         whole-entry measurement */
      if (!/from\s*['"]/.test(spec) && /^['"]?aura-glass/.test(spec)) spec = `export * from '${spec.replace(/^['"]|['"]$/g, '')}'`;
      if (internal) {
        spec = spec.replace(/['"]aura-glass(\/[\w./-]+)?['"]/g, `'${join(ROOT, 'src/internal/index.ts')}'`);
      } else if (subpath) {
        const target = entry ? join(ROOT, entry.default) : null;
        const distPath = target ?? join(ROOT, 'dist', subpath === '.' ? 'index.js' : `${subpath.slice(2)}/index.js`);
        spec = spec.replace(/['"]aura-glass(\/[\w./-]+)?['"]/g, `'${distPath}'`);
      }
      /* fragments may hold bare '{ X } from ...' specifiers — wrap as a real
         statement so esbuild parses it. */
      if (!/^\s*(import|export)\b/.test(spec)) spec = `export ${spec}`;
      try {
        const b = await bundle(spec, internal ? { production: true } : {});
        ({ metafile } = b);
        measured = share ? shareOf(b, share) : b.bytes;
      }
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
    /* generated compat rows are target+2048 by the REQ-PLAT-76 rule itself —
       the provisional floor binds their target row, not the compat row. */
    if (!row.compatOf && provFloor !== undefined && row.limitBytes > provFloor) problems.push(`${row.id}: limit ${row.limitBytes} looser than PROVISIONAL_ROWS ${provFloor}`);
    results.push({ ...row, status: measured <= row.limitBytes ? 'pass' : 'fail', measuredBytes: measured });
    if (measured > row.limitBytes) problems.push(`${row.id}: ${measured} B > ${row.limitBytes} B`);
  }

  problems.push(...ratchetProblems(rows, baseBudgets, mrCommitMessages, changelog));

  /* aggregate + fixed ceilings */
  const aggregate = {
    generatedAt: new Date().toISOString(), rows: results,
    /* REQ-PLAT-76: compat rows reported separately from their targets. */
    compatRows: results.filter((r) => r.compatOf),
    ceilings: DEFAULT_CEILINGS,
    measured: {
      tarballPackedBytes: null, stylesCssGzBytes: existsSync(join(DIST, 'styles.css')) ? gzipSync(readFileSync(join(DIST, 'styles.css')), { level: 9 }).length : null,
    },
  };
  writeFileSync(GENERATED, JSON.stringify(aggregate, null, 2) + '\n');
  /* REQ-PLAT-104 sha custody: the claims pipeline (scripts/docs/gen-claims.mjs)
     reads a sha-stamped copy from the job's evidence dir, never the
     committed docs/size-budgets.json. */
  const sha = process.env.CI_COMMIT_SHA || gitHead();
  if (sha) {
    mkdirSync(dirname(SIZE_ARTIFACT), { recursive: true });
    writeFileSync(SIZE_ARTIFACT, JSON.stringify({ sha, ...aggregate }, null, 2) + '\n');
  }
  /* raise check: a row looser than its PLAT floor needs 'Perf-Budget-Raise:
     <row id>' in the changelog (lower-only ratchet after calibration). */
  const FLOORS = { 'plat:tailwind-bridge': 6144, 'plat:compat-globals': 1024, 'plat:cn': 512, 'plat:warnDeprecated': 150 };
  for (const r of results) {
    const floor = FLOORS[r.id];
    if (floor !== undefined && r.limitBytes > floor && !changelog.includes(`Perf-Budget-Raise: ${r.id}`)) {
      problems.push(`${r.id}: limit ${r.limitBytes} exceeds floor ${floor} without 'Perf-Budget-Raise: ${r.id}' changelog entry`);
    }
  }
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

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  run().catch((e) => { console.error(e); process.exit(1); });
}
