#!/usr/bin/env node
/* scripts/release/classify-change.mjs — REQ-PLAT-18..24: computes the PR's change
   class by combining API-report diffs, export-snapshot diffs, deprecation-fragment
   diffs, the VisualClassReport, package.json key diffs, commit markers and changeset
   bumps. Writes .artifacts/plat/change-class/change-class.json.

   node scripts/release/classify-change.mjs --base <ref> [--line 4x|5x] [--out <path>]
       [--coverage] [--require-covered] [--published-dir <dir>] [--target <target>]
       [--fixture <dir>]          (tests/fixtures only: read inputs from a directory)

   Exit 0 with the class on stdout; exit 1 when the change is disallowed for the
   line/target (marker rules, allowed-class table, multi-family trailer, visual
   record) — the artifact is still written. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ALLOWED, CLASS_CHANGESET_FLOOR, CLASS_RANK, BUMP_RANK, allowedOn,
  checkChangesetBump, checkMarkers, installLevelViolations, relPaths,
  VISUAL_TOLERANCE,
} from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PATHS = relPaths(ROOT);
const RUNTIME_DEP_KINDS = new Set(['export', 'prop', 'prop-value', 'css-var', 'css-global', 'cli', 'data-attr', 'peer', 'dependency', 'engine', 'behavior', 'asset', 'subpath']);

// ---------------------------------------------------------------- helpers ----
function git(args, cwd = ROOT) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}
const tryGit = (args) => { try { return git(args); } catch { return ''; } };
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const stable = (v) => JSON.stringify(v, Object.keys(v ?? {}).sort?.() ? undefined : undefined);
function stableStringify(value) {
  const seen = new WeakSet();
  const s = (v) => {
    if (v && typeof v === 'object') {
      if (seen.has(v)) return null;
      seen.add(v);
      if (Array.isArray(v)) return v.map(s);
      return Object.fromEntries(Object.keys(v).sort().map((k) => [k, s(v[k])]));
    }
    return v;
  };
  return `${JSON.stringify(s(value), null, 2)}\n`;
}

// ------------------------------------------------------------- input diffs ---
// Per-entry API report diff: etc/api/<entry>.(exports|api|css-api).(json|md)
export function diffApiReports(baseRef = null, changedFiles = null, fixture = null) {
  const files = changedFiles ?? git(['diff', '--name-only', `${baseRef}...HEAD`]).split('\n').filter(Boolean);
  const apiFiles = files.filter((f) => /^etc\/api\/.+\.(exports\.json|api\.md|css-api\.json)$/.test(f));
  const perEntry = {};
  for (const file of apiFiles) {
    const entry = file.replace(/^etc\/api\//, '').replace(/\.(exports\.json|api\.md|css-api\.json)$/, '');
    const read = (ref, f) => {
      if (fixture) { const p = join(fixture, ref, f); return existsSync(p) ? readFileSync(p, 'utf8') : null; }
      try { return git(['show', `${ref}:${f}`]); } catch { return null; }
    };
    const head = readFileSync(join(ROOT, file), 'utf8');
    const base = baseRef ? read(baseRef, file) : null;
    perEntry[entry] = diffReportText(file, base, head);
  }
  return perEntry;
}

function diffReportText(file, baseText, headText) {
  const names = (text) => {
    if (text == null) return [];
    if (file.endsWith('.json')) {
      try {
        const j = JSON.parse(text);
        if (Array.isArray(j)) return j;
        if (Array.isArray(j.names)) return j.names;
        if (j.exports && typeof j.exports === 'object') return Object.keys(j.exports);
        if (j.runtime) return [...(j.runtime ?? []), ...(j.types ?? [])];
        return Object.keys(j);
      } catch { return []; }
    }
    return text.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('export') || l.startsWith('declare'))
      .map((l) => l.replace(/^(export\s+(default\s+)?(declare\s+)?(const|let|var|function|class|interface|type|enum)\s+|export\s*\{)|[{;,].*$|=.*/g, '').trim())
      .filter(Boolean);
  };
  const b = new Set(names(baseText));
  const h = new Set(names(headText));
  return {
    added: [...h].filter((n) => !b.has(n)).sort(),
    removed: [...b].filter((n) => !h.has(n)).sort(),
  };
}

// Export-snapshot diff (two JSON files or pre-extracted objects).
export function diffSnapshots(baseSnap = null, headSnap = null) {
  const e = (snap) => snap && snap.entries ? snap.entries : (snap ?? {});
  const b = e(baseSnap); const h = e(headSnap);
  const per = {}; const removed = []; const added = [];
  for (const key of new Set([...Object.keys(b), ...Object.keys(h)])) {
    const bk = b[key]; const hk = h[key];
    const d = {
      removed: [...(bk?.runtime ?? [])].filter((n) => !(hk?.runtime ?? []).includes(n))
        .concat([...(bk?.require ?? [])].filter((n) => !(hk?.require ?? []).includes(n)))
        .concat([...(bk?.types ?? [])].filter((n) => !(hk?.types ?? []).includes(n))).sort(),
      added: [...(hk?.runtime ?? [])].filter((n) => !(bk?.runtime ?? []).includes(n))
        .concat([...(hk?.require ?? [])].filter((n) => !(bk?.require ?? []).includes(n)))
        .concat([...(hk?.types ?? [])].filter((n) => !(bk?.types ?? []).includes(n))).sort(),
    };
    if (!bk && hk) { added.push(key); d.added = 'whole-entry'; }
    if (bk && !hk) { removed.push(key); d.removed = 'whole-entry'; }
    if (d.added.length || d.removed.length) per[key] = d;
  }
  return { perEntry: per, entriesRemoved: removed, entriesAdded: added };
}

// package.json tracked keys.
const PKG_KEYS = ['dependencies', 'peerDependencies', 'optionalPeerDependencies', 'engines', 'exports'];
export function diffPackageJson(baseText, headText) {
  const base = baseText ? JSON.parse(baseText) : {}; const head = JSON.parse(headText);
  const out = {};
  for (const key of PKG_KEYS) {
    const b = base[key] ?? {}; const h = head[key] ?? {};
    const added = Object.keys(h).filter((k) => !(k in b));
    const removed = Object.keys(b).filter((k) => !(k in h));
    const changed = Object.keys(h).filter((k) => k in b && JSON.stringify(h[k]) !== JSON.stringify(b[k]));
    if (added.length || removed.length || changed.length) out[key] = { added, removed, changed };
  }
  return out;
}

// Deprecation fragment diff: entries added on this branch.
export function diffDeprecationEntries(baseRef, { load } = {}) {
  const loader = load ?? ((ref) => {
    const files = git(['ls-tree', '-r', '--name-only', ref, 'fragments/deprecations']).split('\n').filter((f) => f.endsWith('.ts'));
    const entries = [];
    for (const f of files) {
      try {
        const text = git(['show', `${ref}:${f}`]);
        for (const m of text.matchAll(/\bid:\s*'(DEP-[A-Z]\d+)'[\s\S]*?kind:\s*'([\w-]+)'[\s\S]*?breaking:\s*(\d+)[\s\S]*?since:\s*'([\d.]+)'/g)) {
          entries.push({ id: m[1], kind: m[2], breaking: Number(m[3]), since: m[4], file: f });
        }
      } catch { /* tolerate unparsable double */ }
    }
    return entries;
  });
  const current = loader('HEAD');
  const base = baseRef ? loader(baseRef) : [];
  const baseIds = new Set(base.map((x) => x.id));
  return current.filter((x) => !baseIds.has(x.id));
}

// Commit markers + trailers.
export function parseCommitMarkers(logText) {
  const subjects = logText.split('\n').filter(Boolean);
  const hasBang = subjects.some((s) => /^[a-z]+(\([^)]*\))?!:/.test(s));
  const hasBreaking = logText.includes('BREAKING CHANGE:') || subjects.some((s) => /!:/.test(s.split(' ')[0] ?? ''));
  const multi = [...logText.matchAll(/^Multi-Family:\s*(.+)$/gm)].map((m) => m[1].trim());
  return { hasBang, hasBreaking, multiFamily: multi, subjects };
}

// .changeset bump types added on this branch.
export function parseChangesetBumps(changesetTexts) {
  const bumps = [];
  for (const text of changesetTexts) {
    const front = text.match(/^---\n([\s\S]*?)\n---/);
    if (!front) continue;
    for (const m of front[1].matchAll(/:\s*(patch|minor|major)/g)) bumps.push(m[1]);
  }
  return bumps;
}

// Visual report + record matching.
export function visualClass({ report, recordFiles = [], line = '5x' }) {
  const out = { status: 'absent', cells: [], class: null, record: null };
  if (!report) { out.status = line === '5x' ? 'pending' : 'missing-blocking'; return out; }
  const cells = (report.cells ?? report.changed ?? []).filter(
    (c) => (c.changedRatio ?? c.ratio ?? 0) > VISUAL_TOLERANCE.changedRatio,
  );
  out.cells = cells;
  if (!cells.length) { out.status = 'clean'; return out; }
  const listed = new Set();
  let matched = null;
  for (const rf of recordFiles) {
    try {
      const rec = readJson(rf);
      for (const c of rec.cells ?? []) listed.add(c.id ?? c);
      if ((rec.cells ?? []).length === cells.length &&
          cells.every((c) => listed.has(c.id ?? c))) matched = rf;
    } catch { /* unreadable record */ }
  }
  out.status = matched ? 'recorded' : 'unrecorded';
  out.record = matched;
  out.class = matched ? 'C-I-VF' : (line === '4x' ? 'C-B' : null);
  return out;
}

// Class per contribution — highest wins; at equal rank the later (more
// specific) entry in CLASSES wins so C-I-VF / C-D-IL survive compression.
function bumpTo(top, cls, reasons, reason) {
  if (CLASS_RANK[cls] > CLASS_RANK[top.v] || (CLASS_RANK[cls] === CLASS_RANK[top.v] && cls !== top.v && cls.length > top.v.length)) top.v = cls;
  if (reason) reasons.push(reason);
  return top;
}

export function classify(inputs) {
  const {
    apiDiffs = {}, snapshotDiff = { perEntry: {}, entriesRemoved: [], entriesAdded: [] },
    deprecationsAdded = [], deprecationsAll = deprecationsAdded,
    packageDiff = {}, markers = { hasBang: false, hasBreaking: false, multiFamily: [] },
    changesetBumps = [], visual = { status: 'absent', cells: [] }, line = '5x',
    changedFiles = [], version = null, sources = {}, doctorReport = null, releaseNotes = null,
    installDeps = [],
  } = inputs;
  const reasons = []; const rank = { v: 'C-I' }; const perEntry = {};

  // API-report diffs.
  for (const [entry, d] of Object.entries(apiDiffs)) {
    perEntry[entry] = perEntry[entry] ?? { added: [], removed: [] };
    perEntry[entry].added.push(...(d.added ?? [])); perEntry[entry].removed.push(...(d.removed ?? []));
    if ((d.removed ?? []).length) bumpTo(rank, 'C-B', reasons, `${entry}: removed ${d.removed.length} public name(s)`);
    else if ((d.added ?? []).length) bumpTo(rank, 'C-E', reasons, `${entry}: added ${d.added.length} public name(s)`);
  }
  // Snapshot diffs.
  for (const [key, d] of Object.entries(snapshotDiff.perEntry ?? {})) {
    perEntry[key] = perEntry[key] ?? { added: [], removed: [] };
    if (d.removed === 'whole-entry' || (Array.isArray(d.removed) && d.removed.length)) {
      perEntry[key].removed.push(key); bumpTo(rank, 'C-B', reasons, `${key}: removed subpath or names`);
    } else if (d.added === 'whole-entry' || (Array.isArray(d.added) && d.added.length)) {
      perEntry[key].added.push(key); bumpTo(rank, 'C-E', reasons, `${key}: added subpath or names`);
    }
  }
  // Deprecation additions → C-D (or C-D-IL for install-level, condition-checked).
  for (const e of deprecationsAdded) {
    if (e.kind === 'dependency' || installDeps.includes(e.id)) {
      const violations = installLevelViolations({
        depEntry: e, version, sources, doctorReport, releaseNotes,
      });
      if (violations.length) { bumpTo(rank, 'C-B', reasons, `${e.id}: install-level move fails conditions (${violations[0]})`); }
      else bumpTo(rank, 'C-D-IL', reasons, `${e.id}: dependency '${e.symbol}' moved to optional peer (all four conditions met)`);
    } else bumpTo(rank, 'C-D', reasons, `${e.id}: deprecation entry added (${e.kind})`);
  }
  // package.json key diffs.
  for (const [key, d] of Object.entries(packageDiff)) {
    if (key === 'exports' && d.removed.length) bumpTo(rank, 'C-B', reasons, `package.json exports removed: ${d.removed.join(', ')}`);
    else if (key === 'exports' && (d.added.length || d.changed.length)) bumpTo(rank, 'C-E', reasons, `package.json exports added/changed`);
    else if ((key === 'engines' || key === 'peerDependencies') && (d.changed.length || d.removed.length)) {
      bumpTo(rank, 'C-B', reasons, `${key} floor raised or entry removed: ${[...d.changed, ...d.removed].join(', ')}`);
    } else if (key === 'optionalPeerDependencies') {
      bumpTo(rank, 'C-E', reasons, 'package.json optionalPeerDependencies changed');
    } else if (key === 'dependencies' && d.removed.length) {
      const optAdded = new Set(packageDiff.optionalPeerDependencies?.added ?? []);
      const covered = d.removed.every((dep) => optAdded.has(dep) || installDeps.includes(dep)
        || deprecationsAdded.some((e) => e.kind === 'dependency' && (e.symbol === dep || e.pkg === dep)));
      bumpTo(rank, covered ? 'C-D-IL' : 'C-B', reasons,
        `dependencies removed: ${d.removed.join(', ')}${covered ? ' (install-level move)' : ''}`);
    } else bumpTo(rank, 'C-E', reasons, `package.json ${key} changed`);
  }
  // Contract surfaces (the C0 seed's BREAKING list): a diff touching the frozen
  // contract surface is C-B and needs the marker; on release/4.x `!` then fails.
  const CONTRACT_SURFACE = [/^src\/contracts\//, /^contracts\//, /^build\/exports\.manifest\.json$/];
  const surface = changedFiles.filter((f) => CONTRACT_SURFACE.some((re) => re.test(f)));
  if (surface.length) bumpTo(rank, 'C-B', reasons, `frozen contract surface touched: ${surface.slice(0, 5).join(', ')}${surface.length > 5 ? ` (+${surface.length - 5})` : ''}`);
  // Maps-artifact rule: a store/docs file without the regenerated artifacts is C-E.
  const mapsFiles = changedFiles.filter((f) => /(^|\/)(map|maps|mapbox)(\/|[^/]*\.(ts|tsx|mdx?)$)/i.test(f));
  const hasArtifact = changedFiles.some((f) => f === 'dist-maps.tgz' || f.startsWith('apps/docs/public/r/'));
  if (mapsFiles.length && !hasArtifact) bumpTo(rank, 'C-E', reasons, 'maps consumer without regenerated artifacts');
  // Visual.
  if (visual.class) bumpTo(rank, visual.class, reasons, visual.class === 'C-I-VF' ? `visual fix with record ${visual.record}` : 'visual change above tolerance without a record');

  const cls = rank.v;
  const errors = [...checkMarkers(cls, { hasBang: markers.hasBang, hasBreaking: markers.hasBreaking, line })];
  // REQ-FIN-10: on the 4.x line at version >= 4.2.0 a missing visual-class
  // report is itself a gate failure, not just a class input.
  if (line === '4x' && visual.status === 'missing-blocking') {
    const [maj, min] = (version ?? '0.0.0').split('.').map(Number);
    if ((maj ?? 0) > 4 || ((maj ?? 0) === 4 && (min ?? 0) >= 2)) {
      errors.push('visual-class report missing on 4x >= 4.2.0 (run the 4x visual job first; REQ-PLAT-56)');
    }
  }
  errors.push(...checkChangesetBump(cls, changesetBumps));

  // Multi-family trailer (REQ-PLAT-21): >1 breaking group among removals.
  const removals = [];
  for (const [entry, d] of Object.entries(perEntry)) {
    for (const sym of d.removed ?? []) {
      const cov = deprecationsAll.find((e) => e.symbol === sym);
      removals.push({ entry, symbol: sym, breaking: cov?.breaking ?? null });
    }
  }
  const groups = new Set(removals.map((r) => r.breaking ?? 'untracked'));
  if (groups.size > 1 && !markers.multiFamily.length) {
    errors.push(`removals span ${groups.size} breaking groups without a 'Multi-Family: <reason>' trailer`);
  }

  // Target check.
  const target = inputs.target ?? (line === '4x' ? '4x-minor' : 'next-pre');
  if (target === '4x-patch') {
    const nonException = deprecationsAdded.filter((e) => !e.exception);
    if (!nonException.length && cls === 'C-D') { /* exception entries allowed on patch */ }
    else if (!allowedOn(cls, target)) errors.push(`class ${cls} is not allowed on ${target} (allowed: ${ALLOWED[target].join(', ')})`);
  } else if (!allowedOn(cls, target)) {
    errors.push(`class ${cls} is not allowed on ${target} (allowed: ${ALLOWED[target].join(', ')})`);
  }

  return {
    class: cls,
    reasons,
    perEntry,
    deprecationsAdded,
    removals,
    visual: { status: visual.status, cells: visual.cells?.length ?? 0, record: visual.record ?? null },
    commitMarkers: { hasBang: markers.hasBang, hasBreaking: markers.hasBreaking, multiFamily: markers.multiFamily },
    changesets: { bumps: changesetBumps },
    errors,
  };
}

// ------------------------------------------------------------- G-07 coverage ---
// For every removal, the covering deprecation must have since = a published
// 4.x minor >= 4.2.0 AND appear in that version's packed deprecations.json.
export function deprecationCoverage(removals, entries, { publishedDir = null, published = null } = {}) {
  const index = published ?? {};
  if (publishedDir && existsSync(publishedDir)) {
    for (const f of readdirSync(publishedDir).filter((x) => x.endsWith('.json'))) {
      const j = readJson(join(publishedDir, f));
      index[j.version ?? f.replace('.json', '')] = (j.entries ?? j.ids ?? []).map((e) => (typeof e === 'string' ? e : e.id));
    }
  }
  const minors = (v) => { const m = /^4\.(\d+)\.(\d+)$/.exec(v ?? ''); return m ? { minor: Number(m[1]) } : null; };
  const rows = removals.map((r) => {
    const cov = entries.find((e) => e.symbol === r.symbol || (r.symbol.includes(e.symbol ?? '\0') && e.symbol));
    const m = minors(cov?.since);
    const shipped = cov && m && m.minor >= 2 && (index[cov.since] ?? []).includes(cov.id);
    return { ...r, coveringEntry: cov?.id ?? null, since: cov?.since ?? null, verifiedIn: shipped ? cov.since : null };
  });
  return { version: 1, removals: rows, uncovered: rows.filter((r) => !r.verifiedIn) };
}

// ------------------------------------------------------------------- main ----
export function main(argv = process.argv.slice(2), { cwd = ROOT } = {}) {
  const arg = (name, def = null) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : def; };
  const has = (f) => argv.includes(f);
  const base = arg('--base', 'origin/next');
  const line = arg('--line', '5x');
  const out = arg('--out', PATHS.changeClassOut);
  const target = arg('--target', null) ?? (line === '4x' ? '4x-minor' : 'next-pre');
  const fixtureDir = arg('--fixture');

  const changedFiles = fixtureDir
    ? readFileSync(join(fixtureDir, 'changed-files.txt'), 'utf8').split('\n').filter(Boolean)
    : tryGit(['diff', '--name-only', `${base}...HEAD`]).split('\n').filter(Boolean);
  const logText = fixtureDir ? readFileSync(join(fixtureDir, 'log.txt'), 'utf8')
    : tryGit(['log', '--format=%s%n%b', `${base}..HEAD`]);
  // REQ-PLAT-21: the Multi-Family trailer is read from the HEAD commit only.
  const headLogText = fixtureDir ? logText : tryGit(['log', '-1', '--format=%B', 'HEAD']);
  const pkgBase = fixtureDir ? (existsSync(join(fixtureDir, 'pkg.base.json')) ? readFileSync(join(fixtureDir, 'pkg.base.json'), 'utf8') : null)
    : tryGit(['show', `${base}:package.json`]) || null;
  const pkgHead = fixtureDir ? readFileSync(join(fixtureDir, 'pkg.head.json'), 'utf8') : readFileSync(PATHS.packageJson, 'utf8');
  const changesetTexts = changedFiles.filter((f) => f.startsWith('.changeset/') && f.endsWith('.md'))
    .map((f) => { try { return readFileSync(join(ROOT, f), 'utf8'); } catch { return ''; } });

  const visualPath = fixtureDir && existsSync(join(fixtureDir, 'visual-class.json'))
    ? join(fixtureDir, 'visual-class.json') : PATHS.visualReport(line);
  const recordDir = fixtureDir ?? PATHS.visualFixesDir;
  const recordFiles = existsSync(recordDir) ? readdirSync(recordDir).filter((f) => f.endsWith('.json')).map((f) => join(recordDir, f)) : [];
  const fx = (name, def) => fixtureDir && existsSync(join(fixtureDir, name)) ? readJson(join(fixtureDir, name)) : def;

  const apiDiffs = fixtureDir && existsSync(join(fixtureDir, 'api-diffs.json'))
    ? readJson(join(fixtureDir, 'api-diffs.json')) : diffApiReports(fixtureDir ? null : base, fixtureDir ? [] : changedFiles, fixtureDir);
  let snapshotDiff = fx('snapshot-diff.json', null);
  if (!snapshotDiff) {
    snapshotDiff = { perEntry: {}, entriesRemoved: [], entriesAdded: [] };
    if (!fixtureDir && has('--real-snapshots')) {
      // REQ-PLAT-23 item 8: diff real export snapshots — base worktree + npm pack
      // vs the head pack — never fixture-only for the CI path.
      const tmp = mkdtempSync(join(tmpdir(), 'ag-classify-'));
      try {
        execFileSync('git', ['worktree', 'add', '--detach', join(tmp, 'base'), base], { cwd: ROOT, stdio: 'pipe' });
        const pack = (dir) => {
          const tgz = execFileSync('npm', ['pack', '--ignore-scripts', '--pack-destination', tmp], { cwd: dir, encoding: 'utf8' }).trim().split('\n').pop();
          return join(tmp, tgz.trim());
        };
        const snap = (tgz) => {
          const outp = join(tmp, `snap-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
          execFileSync(process.execPath, [join(ROOT, 'scripts/release/export-snapshot.mjs'), '--tarball', tgz, '--out', outp], { cwd: ROOT, stdio: 'pipe' });
          return readJson(outp);
        };
        snapshotDiff = diffSnapshots(snap(pack(join(tmp, 'base'))), snap(pack(ROOT)));
      } finally {
        try { execFileSync('git', ['worktree', 'remove', '--force', join(tmp, 'base')], { cwd: ROOT, stdio: 'pipe' }); } catch { /* best effort */ }
      }
    } else snapshotDiff = { perEntry: {}, entriesRemoved: [], entriesAdded: [] };
  }
  const deprecationsAdded = fx('deprecations-added.json', fixtureDir ? [] : diffDeprecationEntries(base, {}));
  // REQ-PLAT-21: breaking group of each removed symbol is looked up in the
  // full merged deprecation set (base + HEAD rows), not only added rows.
  const loadDeps = (ref) => {
    try {
      return diffDeprecationEntries(null, {
        load: (r) => {
          const files = git(['ls-tree', '-r', '--name-only', r, 'fragments/deprecations']).split('\n').filter((f) => f.endsWith('.ts'));
          const rows = [];
          for (const f of files) {
            try {
              const text = git(['show', `${r}:${f}`]);
              for (const m of text.matchAll(/\bid:\s*'(DEP-[A-Z]\d+)'[\s\S]*?kind:\s*'([\w-]+)'[\s\S]*?breaking:\s*(\d+)[\s\S]*?since:\s*'([\d.]+)'/g)) {
                rows.push({ id: m[1], kind: m[2], breaking: Number(m[3]), since: m[4], file: f });
              }
            } catch { /* tolerate */ }
          }
          return rows;
        },
      });
    } catch { return []; }
  };
  const deprecationsAll = fx('deprecations-all.json',
    fixtureDir ? deprecationsAdded : [...loadDeps(base), ...loadDeps('HEAD')]);
  const result = classify({
    apiDiffs, snapshotDiff, deprecationsAdded, deprecationsAll,
    packageDiff: diffPackageJson(pkgBase, pkgHead),
    markers: { ...parseCommitMarkers(logText), multiFamily: parseCommitMarkers(headLogText).multiFamily },
    changesetBumps: parseChangesetBumps(changesetTexts),
    visual: visualClass({ report: existsSync(visualPath) ? readJson(visualPath) : null, recordFiles, line }),
    line, target, changedFiles,
    version: JSON.parse(pkgHead).version,
  });

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, stableStringify(result));
  if (has('--coverage')) {
    const cov = deprecationCoverage(result.removals, deprecationsAdded, { publishedDir: arg('--published-dir') });
    mkdirSync(dirname(PATHS.deprecationCoverage), { recursive: true });
    writeFileSync(PATHS.deprecationCoverage, stableStringify(cov));
    if (has('--require-covered') && cov.uncovered.length) result.errors.push(`${cov.uncovered.length} removal(s) without a deprecation shipped in a published 4.x minor >= 4.2.0`);
  }
  console.log(`${result.class}  (${result.reasons.length} reason(s), ${result.errors.length} error(s)) -> ${relative(ROOT, out)}`);
  for (const e of result.errors) console.error(`  FAIL ${e}`);
  return result.errors.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main());
}
