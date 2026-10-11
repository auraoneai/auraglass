/* scripts/release/lib/deprecation-coverage.mjs — REQ-PLAT-28 (G-07) prior-
   deprecation coverage, line-neutral (release/4.1.x, release/4.x, next).

   A removal (a 4.x subpath, export, prop, prop value, CSS variable or global
   selector that the next major drops) is `covered` only when an entry matches
   it exactly AND either
     - the entry's `since` is a published 4.x version >= 4.2.0
       (`npm view aura-glass@<since> version`; a 404 or an empty answer means
       unpublished → uncovered) and the entry's id is present in that
       version's packed deprecations.json, or
     - the entry has `exception` set and its id is listed in
       docs/release/exception-allowlist.json (`allowlist`).
   Removals come from (a) every fragment entry (its own subject is the removal)
   and (b) the export-surface diff between the newest published 4.x tarball's
   snapshot and the head snapshot, so a removed export with no entry at all is
   reported too. Reporting is the caller's choice: PR pipelines report
   (non-blocking); the GA tag pipeline fails on any uncovered removal. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const PACKAGE = 'aura-glass';

const semver = (v) => { const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v ?? ''); return m ? m.slice(1).map(Number) : null; };
export function cmpVersion(a, b) {
  const x = semver(a); const y = semver(b);
  if (!x || !y) return NaN;
  for (let i = 0; i < 3; i += 1) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

const isNotFound = (err) => /\bE404\b|404 Not Found|is not in this registry|No match found for version/i
  .test(`${err?.stderr ?? ''}${err?.stdout ?? ''}${err?.message ?? ''}`);

/** Registry access through the npm CLI (`npm` on PATH, or `npmBin`). */
export function npmRegistry({ npmBin = 'npm', exec = execFileSync, pkg = PACKAGE } = {}) {
  const run = (args) => exec(npmBin, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
  const view = (spec) => {
    try {
      const out = run(['view', spec, 'version', '--json']).trim();
      if (!out) return [];
      const j = JSON.parse(out);
      return Array.isArray(j) ? j : [j];
    } catch (err) {
      if (isNotFound(err)) return [];
      throw err;
    }
  };
  return {
    /** Exact version if published, else null (404 / no match). */
    published(version) {
      return view(`${pkg}@${version}`).includes(version) ? version : null;
    },
    /** Newest published 4.x version, or null. */
    newest4x() {
      const vs = view(`${pkg}@4`).filter((v) => semver(v));
      return vs.sort(cmpVersion).at(-1) ?? null;
    },
    /** Ids in the version's packed deprecations.json ([] when the tarball has none). */
    packedIds(version) {
      const dir = mkdtempSync(join(tmpdir(), 'ag-cov-'));
      try {
        const packed = JSON.parse(run(['pack', `${pkg}@${version}`, '--json', '--pack-destination', dir]));
        const tgz = join(dir, packed[0].filename);
        try {
          exec('tar', ['-xzf', tgz, '-C', dir, 'package/deprecations.json'], { stdio: 'ignore' });
        } catch { return []; }
        const f = join(dir, 'package/deprecations.json');
        if (!existsSync(f)) return [];
        const j = JSON.parse(readFileSync(f, 'utf8'));
        return (j.entries ?? []).map((e) => (typeof e === 'string' ? e : e.id));
      } finally { rmSync(dir, { recursive: true, force: true }); }
    },
  };
}

/** Offline registry from a directory of `<version>.json` packed deprecations files. */
export function dirRegistry(dir) {
  const index = new Map();
  if (dir && existsSync(dir)) {
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
      const j = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      index.set(String(j.version ?? f.replace(/\.json$/, '')), (j.entries ?? j.ids ?? []).map((e) => (typeof e === 'string' ? e : e.id)));
    }
  }
  return {
    published: (v) => (index.has(v) ? v : null),
    newest4x: () => [...index.keys()].filter((v) => /^4\./.test(v)).sort(cmpVersion).at(-1) ?? null,
    packedIds: (v) => index.get(v) ?? [],
  };
}

/** Removed subpaths and exports between two export-snapshot.mjs snapshots. */
export function snapshotRemovals(base, head) {
  const removals = [];
  const names = (row) => new Set([...(row?.runtime ?? []), ...(row?.types ?? [])]);
  for (const entry of Object.keys(base?.entries ?? {}).sort()) {
    const h = head?.entries?.[entry];
    if (!h) { removals.push({ kind: 'subpath', entry, symbol: '*' }); continue; }
    const now = names(h);
    for (const symbol of [...names(base.entries[entry])].sort()) {
      if (!now.has(symbol)) removals.push({ kind: 'export', entry, symbol });
    }
  }
  return removals;
}

/** The entry that covers a removal: exact kind + entry + symbol (subpaths: kind + entry). */
export function matchEntry(removal, entries) {
  if (removal.kind === 'subpath') return entries.find((e) => e.kind === 'subpath' && e.entry === removal.entry) ?? null;
  return entries.find((e) => e.kind === removal.kind && e.entry === removal.entry && e.symbol === removal.symbol) ?? null;
}

export function coverage({ entries, removals = [], registry, allowlist = new Set(), removeIn = '5.0.0' }) {
  const publishedCache = new Map(); const idsCache = new Map();
  const isPublished = (v) => { if (!publishedCache.has(v)) publishedCache.set(v, registry.published(v)); return publishedCache.get(v) != null; };
  const ids = (v) => { if (!idsCache.has(v)) idsCache.set(v, new Set(registry.packedIds(v))); return idsCache.get(v); };

  const judge = (e) => {
    if (!e) return { coverage: 'uncovered', verifiedIn: null, reason: 'no deprecation entry' };
    if (e.exception && allowlist.has(e.id)) return { coverage: 'covered', verifiedIn: 'exception', reason: `exception '${e.exception}' listed in exception-allowlist.json` };
    const v = semver(e.since);
    if (!v || v[0] !== 4 || v[1] < 2) return { coverage: 'uncovered', verifiedIn: null, reason: `since '${e.since}' is not a 4.x minor >= 4.2.0` };
    if (!isPublished(e.since)) return { coverage: 'uncovered', verifiedIn: null, reason: `aura-glass@${e.since} is not published` };
    if (!ids(e.since).has(e.id)) return { coverage: 'uncovered', verifiedIn: null, reason: `${e.id} is not in aura-glass@${e.since}'s packed deprecations.json` };
    return { coverage: 'covered', verifiedIn: e.since, reason: null };
  };

  const rows = []; const seen = new Set();
  const removedSubpaths = new Set(removals.filter((r) => r.kind === 'subpath').map((r) => r.entry));
  for (const r of removals) {
    if (r.kind !== 'subpath' && removedSubpaths.has(r.entry)) continue; // reported once, as the subpath
    const e = matchEntry(r, entries);
    if (e) seen.add(e.id);
    rows.push({ source: 'snapshot', kind: r.kind, entry: r.entry, symbol: r.symbol, coveringEntry: e?.id ?? null, since: e?.since ?? null, ...judge(e) });
  }
  for (const e of entries) {
    if (seen.has(e.id) || e.removeIn !== removeIn) continue;
    rows.push({ source: 'entry', kind: e.kind, entry: e.entry, symbol: e.symbol, coveringEntry: e.id, since: e.since, breaking: e.breaking, ...judge(e) });
  }
  const uncovered = rows.filter((r) => r.coverage === 'uncovered');
  return { version: 1, removeIn, total: rows.length, uncoveredCount: uncovered.length, removals: rows, uncovered };
}
