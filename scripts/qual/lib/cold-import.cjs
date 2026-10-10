/* scripts/qual/lib/cold-import.cjs — REQ-QUAL-47 Node cold import measurement (REQ-FIN-105, FIN-446). QUAL-owned.
   Used by tests/perf/qual/node-cold-import.test.mjs (remote L2 only) and unit-tested by
   tests/perf/qual/node-cold-import-eval.test.ts. CommonJS so Jest can load it in-process on every Node line.

   Method: the packed tarball is installed into a scratch project (with the package's non-optional peers at the
   versions this repository pins); for every JS entry of the package `exports` map and every Node binary, 11 fresh
   `node` processes each time `await import(<entry>)` with performance.now(). Before every process the OS page cache
   is dropped (`sync; echo 3 > /proc/sys/vm/drop_caches`); when that is not permitted (not root / read-only procfs in
   a container) the fallback is recorded in the report (`pageCache.method: 'none'` with the reason), never hidden.
   Thresholds: '.' median > DEFAULT_CEILINGS.nodeColdImportMs (150 ms) or p90 > 200 ms; './material', './tokens',
   './primitives' median > 30 ms; a failed import of a gated entry; a missing runner tag; a missing Node line. */
'use strict';
const { execFileSync, spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');

const ROOT = resolve(__dirname, '..', '..', '..');
/* Frozen in src/contracts/fragments.ts (DEFAULT_CEILINGS.nodeColdImportMs); restated so this CJS module never imports TS. */
const NODE_COLD_IMPORT_MS = 150;
const THRESHOLDS = {
  '.': { medianMs: NODE_COLD_IMPORT_MS, p90Ms: 200 },
  './material': { medianMs: 30 },
  './tokens': { medianMs: 30 },
  './primitives': { medianMs: 30 },
};
const RUNS = 11;
const REQUIRED_NODE_LINES = [
  { id: 'node-20.19.0', test: (v) => v === 'v20.19.0' },
  { id: 'node-22-lts', test: (v) => /^v22\.\d+\.\d+$/.test(v) },
];

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  if (!n) return null;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
/** Nearest-rank percentile (p in 0..100). */
function percentile(xs, p) {
  const s = [...xs].sort((a, b) => a - b);
  if (!s.length) return null;
  return s[Math.min(s.length, Math.max(1, Math.ceil((p / 100) * s.length))) - 1];
}

/** GitLab exports CI_RUNNER_TAGS as a JSON array string (e.g. '["saas-linux-medium-amd64"]'); a comma list is accepted too. */
function parseRunnerTags(raw) {
  if (raw == null || String(raw).trim() === '') return [];
  const s = String(raw).trim();
  if (s.startsWith('[')) {
    try { const a = JSON.parse(s); return Array.isArray(a) ? a.map(String).map((t) => t.trim()).filter(Boolean) : []; } catch { return []; }
  }
  return s.split(',').map((t) => t.trim()).filter(Boolean);
}

/** JS entries of a package exports map (CSS, JSON and package.json subpaths are not importable modules). */
function jsEntries(pkgJson) {
  const out = [];
  for (const [sub, target] of Object.entries(pkgJson.exports ?? {})) {
    const file = typeof target === 'string' ? target : target && (target.import ?? target.default ?? target.node);
    if (typeof file === 'string' && /\.(?:m|c)?js$/.test(file)) out.push(sub);
  }
  return out;
}
const specifierOf = (name, sub) => (sub === '.' ? name : `${name}/${sub.replace(/^\.\//, '')}`);

function dropPageCache() {
  try {
    execFileSync('sync');
    writeFileSync('/proc/sys/vm/drop_caches', '3\n');
    return { method: 'drop_caches', ok: true };
  } catch (e) {
    return { method: 'none', ok: false, reason: `${e.code ?? 'error'}: ${String(e.message ?? e).split('\n')[0]}` };
  }
}

const CHILD = "const t0 = performance.now(); await import(process.env.AG_COLD_IMPORT_ENTRY); process.stdout.write(String(performance.now() - t0));";
/** One fresh process; returns { ms } or { error }. */
function importOnce(nodeBin, cwd, specifier) {
  const r = spawnSync(nodeBin, ['--input-type=module', '-e', CHILD], {
    cwd, encoding: 'utf8', env: { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'production', AG_COLD_IMPORT_ENTRY: specifier },
    timeout: 60_000,
  });
  if (r.status !== 0) {
    const lines = String(r.stderr || r.error?.message || `exit ${r.status}`).split('\n').map((l) => l.trim()).filter(Boolean);
    const err = lines.find((l) => /^(?:[A-Z]\w*Error\b|Error \[)/.test(l))
      ?? lines.find((l) => /\b(?:[A-Z]\w*Error|ERR_[A-Z_]+)\b/.test(l)) ?? lines[lines.length - 1] ?? `exit ${r.status}`;
    return { error: err.slice(0, 400) };
  }
  const ms = Number(r.stdout.trim());
  return Number.isFinite(ms) ? { ms } : { error: `unparseable timing output: ${r.stdout.slice(0, 80)}` };
}

function measureEntry(nodeBin, cwd, specifier, { runs = RUNS, dropCache = dropPageCache } = {}) {
  const samples = [];
  const caches = [];
  for (let i = 0; i < runs; i++) {
    caches.push(dropCache());
    const r = importOnce(nodeBin, cwd, specifier);
    if (r.error) return { samples, error: r.error, pageCache: caches[0] };
    samples.push(Math.round(r.ms * 1000) / 1000);
  }
  return { samples, median: median(samples), p90: percentile(samples, 90), pageCache: caches.every((c) => c.ok) ? caches[0] : caches.find((c) => !c.ok) };
}

function nodeVersion(bin) {
  return execFileSync(bin, ['--version'], { encoding: 'utf8' }).trim();
}

/** Evaluates a cold-import report; returns the list of failures (empty = pass). */
function evaluate(report) {
  const failures = [];
  if (!report.runnerTags || !report.runnerTags.length) failures.push({ kind: 'missing-runner-tag', detail: 'CI_RUNNER_TAGS is unset or empty' });
  const versions = (report.nodes ?? []).map((n) => n.version);
  for (const line of REQUIRED_NODE_LINES) if (!versions.some(line.test)) failures.push({ kind: 'missing-node-line', detail: line.id });
  for (const { version } of report.nodes ?? []) {
    const byEntry = report.results?.[version] ?? {};
    for (const [entry, t] of Object.entries(THRESHOLDS)) {
      const r = byEntry[entry];
      if (!r) { failures.push({ kind: 'missing-entry', node: version, entry }); continue; }
      if (r.error) { failures.push({ kind: 'import-failed', node: version, entry, detail: r.error }); continue; }
      if (r.samples.length !== (report.runs ?? RUNS)) failures.push({ kind: 'short-sample', node: version, entry, detail: `${r.samples.length} runs` });
      if (r.median > t.medianMs) failures.push({ kind: 'median-over', node: version, entry, detail: `${r.median} ms > ${t.medianMs} ms` });
      if (t.p90Ms != null && r.p90 > t.p90Ms) failures.push({ kind: 'p90-over', node: version, entry, detail: `${r.p90} ms > ${t.p90Ms} ms` });
    }
  }
  return failures;
}

/** Newest aura-glass tarball: $AURAGLASS_TARBALL, else .artifacts/pack/aura-glass-*.tgz (EVIDENCE.tarballDir). */
function findTarball(env = process.env) {
  if (env.AURAGLASS_TARBALL) return resolve(env.AURAGLASS_TARBALL);
  const dir = join(ROOT, '.artifacts', 'pack');
  if (!existsSync(dir)) return null;
  const f = readdirSync(dir).filter((x) => /^aura-glass-.*\.tgz$/.test(x)).sort().pop();
  return f ? join(dir, f) : null;
}

/** Installs the tarball into a scratch project with its non-optional peers pinned to this repo's devDependency versions. */
function setupScratch(tarball, { npm = 'npm' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'ag-cold-import-'));
  const extract = mkdtempSync(join(tmpdir(), 'ag-cold-import-pkg-'));
  execFileSync('tar', ['-xzf', tarball, '-C', extract, 'package/package.json']);
  const pkgJson = JSON.parse(readFileSync(join(extract, 'package', 'package.json'), 'utf8'));
  const repo = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const optional = pkgJson.peerDependenciesMeta ?? {};
  const peers = Object.entries(pkgJson.peerDependencies ?? {}).filter(([n]) => !optional[n]?.optional)
    .map(([n, range]) => `${n}@${repo.devDependencies?.[n] ?? range}`);
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'ag-cold-import-scratch', private: true, type: 'module' }, null, 2));
  execFileSync(npm, ['install', '--no-audit', '--no-fund', '--ignore-scripts', '--no-package-lock', tarball, ...peers], { cwd: dir, stdio: 'inherit' });
  return { dir, pkgJson, peers };
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

module.exports = { ROOT, NODE_COLD_IMPORT_MS, THRESHOLDS, RUNS, REQUIRED_NODE_LINES, median, percentile, parseRunnerTags, jsEntries,
  specifierOf, dropPageCache, importOnce, measureEntry, nodeVersion, evaluate, findTarball, setupScratch, sha256 };
