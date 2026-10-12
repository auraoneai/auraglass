#!/usr/bin/env node
/* scripts/release/classify-change.mjs — REQ-PLAT-18..24: computes the PR's change
   class by combining API-report diffs, export-snapshot diffs, deprecation-fragment
   diffs, DOM-part contract diffs, the VisualClassReport, package.json key diffs,
   commit markers and changeset bumps. Writes .artifacts/plat/change-class/change-class.json.

   node scripts/release/classify-change.mjs --base <ref> [--line 4x|5x] [--out <path>]
       [--target <target>] [--coverage] [--require-covered] [--published-dir <dir>]
       [--base-snapshot <json>] [--head-snapshot <json>] [--head-tarball <tgz>]
       [--require-snapshots] [--no-real-snapshots]
       [--fixture <dir>]          (tests/fixtures only: read inputs from a directory)

   Export snapshots (REQ-PLAT-23 item 8) are real by default outside --fixture:
   the head snapshot comes from --head-snapshot, or from the head tarball
   (--head-tarball, $AURAGLASS_TARBALL, or .artifacts/pack/aura-glass-*.tgz);
   the base snapshot from --base-snapshot, or — when the base ref is a release
   tag — from etc/snapshots/<version>.json or the published tarball
   (`npm pack aura-glass@<version>`). A side that cannot be produced is reported
   in change-class.json `snapshots` ('unavailable' + reason); with
   --require-snapshots (tag pipelines) that is a failure.

   Exit 0 with the class on stdout; exit 1 when the change is disallowed for the
   line/target (marker rules, allowed-class table, multi-family trailer, visual
   record, unreadable inputs) — the artifact is still written. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ALLOWED, allowedOn, checkChangesetBump, checkMarkers, installLevelViolations, relPaths,
  VISUAL_TOLERANCE,
} from './lib/policy.mjs';
import { CLASS_RANK } from './lib/policy.mjs';
import { dirRegistry, entryJudge, npmRegistry } from './lib/deprecation-coverage.mjs';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ---------------------------------------------------------------- helpers ----
function git(args, cwd = ROOT) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
}
const tryGit = (args, cwd = ROOT) => { try { return git(args, cwd); } catch { return ''; } };
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const readOrNull = (p) => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const showOrNull = (ref, file, cwd) => { if (!ref) return null; try { return git(['show', `${ref}:${file}`], cwd); } catch { return null; } };
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
export function diffApiReports(baseRef = null, changedFiles = null, fixture = null, { cwd = ROOT } = {}) {
  const files = changedFiles ?? git(['diff', '--name-only', `${baseRef}...HEAD`], cwd).split('\n').filter(Boolean);
  const apiFiles = files.filter((f) => /^etc\/api\/.+\.(exports\.json|api\.md|css-api\.json)$/.test(f));
  const perEntry = {};
  for (const file of apiFiles) {
    const entry = file.replace(/^etc\/api\//, '').replace(/\.(exports\.json|api\.md|css-api\.json)$/, '');
    const read = (ref, f) => {
      if (fixture) { const p = join(fixture, ref, f); return existsSync(p) ? readFileSync(p, 'utf8') : null; }
      return showOrNull(ref, f, cwd);
    };
    // A report deleted on this branch has no head text: every base name is removed.
    const head = readOrNull(join(cwd, file));
    const base = baseRef ? read(baseRef, file) : null;
    const d = diffReportText(file, base, head);
    const prev = perEntry[entry];
    perEntry[entry] = prev
      ? { added: [...new Set([...prev.added, ...d.added])].sort(), removed: [...new Set([...prev.removed, ...d.removed])].sort() }
      : d;
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
        // etc/api/<entry>.exports.json: { entry, exports: [names...] }
        if (Array.isArray(j.exports)) return j.exports;
        if (j.exports && typeof j.exports === 'object') return Object.keys(j.exports);
        // etc/api/<entry>.css-api.json: { entry, vars | public: [...] }
        if (Array.isArray(j.vars)) return j.vars;
        if (Array.isArray(j.public)) return j.public;
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
  const names = (row, k) => [...(row?.[k] ?? [])];
  for (const key of [...new Set([...Object.keys(b), ...Object.keys(h)])].sort()) {
    const bk = b[key]; const hk = h[key];
    const diff = (from, to) => [...new Set(['runtime', 'require', 'types']
      .flatMap((k) => names(from, k).filter((n) => !names(to, k).includes(n))))].sort();
    const d = { removed: diff(bk, hk), added: diff(hk, bk) };
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

// ---------------------------------------------------- deprecation fragments ---
// REQ-PLAT-19/21: fragments are parsed for real (esbuild through the contract's
// loadFragments), never regex-scanned, so key order and `breaking: 'Bnn'`
// strings do not matter.
export function normalizeDeprecation(e, file = null) {
  return {
    id: e.id, kind: e.kind ?? null, status: e.status ?? null, entry: e.entry ?? null,
    symbol: e.symbol ?? null, breaking: e.breaking ?? null, since: e.since ?? null,
    removeIn: e.removeIn ?? null, exception: e.exception ?? null, pkg: e.pkg ?? null, file,
  };
}

/** Every deprecation entry of fragments/deprecations at a git ref ('HEAD', a
    branch, a tag or a sha). [] when the ref has no fragments directory; throws
    when the ref is unknown or a fragment does not evaluate. */
export async function loadDeprecationsAt(ref, { cwd = ROOT } = {}) {
  git(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], cwd);
  const files = git(['ls-tree', '--name-only', ref, '--', 'fragments/deprecations/'], cwd)
    .split('\n').filter((f) => /\.(ts|json)$/.test(f));
  if (!files.length) return [];
  const tmp = mkdtempSync(join(tmpdir(), 'ag-deps-'));
  try {
    mkdirSync(join(tmp, 'fragments/deprecations'), { recursive: true });
    for (const f of files) writeFileSync(join(tmp, 'fragments/deprecations', basename(f)), git(['show', `${ref}:${f}`], cwd));
    const rows = await loadFragments('deprecations', tmp);
    const out = [];
    for (const { file, value } of rows) {
      for (const e of Array.isArray(value) ? value : []) {
        if (e && typeof e.id === 'string') out.push(normalizeDeprecation(e, `fragments/deprecations/${basename(file)}`));
      }
    }
    return out.sort((a, b) => a.id.localeCompare(b.id));
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

/** base/HEAD deprecation sets: `added` = ids new on HEAD, `all` = merged set
    (HEAD rows win), so a removal's breaking group resolves whether its entry
    landed earlier or in this PR. */
export async function deprecationSets(baseRef, { cwd = ROOT, load = null } = {}) {
  const loader = load ?? ((ref) => loadDeprecationsAt(ref, { cwd }));
  const head = await loader('HEAD');
  const base = baseRef ? await loader(baseRef) : [];
  const baseIds = new Set(base.map((x) => x.id));
  const byId = new Map(base.map((e) => [e.id, e]));
  for (const e of head) byId.set(e.id, e);
  return {
    base, head,
    added: head.filter((x) => !baseIds.has(x.id)),
    all: [...byId.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };
}

/** Entries added on HEAD versus baseRef (kept for callers of the older API). */
export async function diffDeprecationEntries(baseRef, opts = {}) {
  return (await deprecationSets(baseRef, opts)).added;
}

// ------------------------------------------------------ DOM-part contracts ---
// REQ-SURF-75 / change-classes.md C-B "public DOM/ARIA/data-*/part change": the
// DOM contract lives in *dom-contract* test snapshots and ComponentMeta.parts.
export const DOM_CONTRACT_FILE = /(^|\/)[^/]*dom-contract[^/]*\.test\.[cm]?[jt]sx?$|(^|\/)__snapshots__\/[^/]*dom-contract[^/]*\.snap$/;
export const META_FILE = /^src\/.+\.meta\.ts$/;

const normSnap = (s) => s.replace(/\\`/g, '`').split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
export function domSnapshots(text, file = '') {
  if (text == null) return new Map();
  const out = new Map();
  if (file.endsWith('.snap')) {
    for (const m of text.matchAll(/exports\[`((?:\\[\s\S]|[^`\\])*)`\]\s*=\s*`((?:\\[\s\S]|[^`\\])*)`;/g)) out.set(m[1], normSnap(m[2]));
    return out;
  }
  let i = 0;
  for (const m of text.matchAll(/toMatchInlineSnapshot\(\s*`((?:\\[\s\S]|[^`\\])*)`/g)) out.set(`inline#${i++}`, normSnap(m[1]));
  return out;
}
export function metaParts(text) {
  if (text == null) return [];
  const m = /\bparts\s*:\s*\[([^\]]*)\]/.exec(text);
  return m ? [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]).sort() : [];
}

/** { file, kind, removed[], changed[], added[] } for one DOM-contract file. */
export function diffDomContract(file, baseText, headText) {
  if (META_FILE.test(file)) {
    const b = metaParts(baseText); const h = metaParts(headText);
    return { file, kind: 'meta-parts', removed: b.filter((p) => !h.includes(p)), changed: [], added: h.filter((p) => !b.includes(p)) };
  }
  const b = domSnapshots(baseText, file); const h = domSnapshots(headText, file);
  if (file.endsWith('.snap')) {
    return {
      file, kind: 'dom-snapshot',
      removed: [...b.keys()].filter((k) => !h.has(k)),
      changed: [...b.keys()].filter((k) => h.has(k) && h.get(k) !== b.get(k)),
      added: [...h.keys()].filter((k) => !b.has(k)),
    };
  }
  // Inline snapshots have no names: compare bodies as multisets.
  const hv = [...h.values()]; const bv = [...b.values()];
  const removed = []; const pool = [...hv];
  for (const body of bv) { const at = pool.indexOf(body); if (at >= 0) pool.splice(at, 1); else removed.push(body.split('\n')[0] ?? ''); }
  // An edited body shows up as one vanished + one new body: count it once, as changed.
  return { file, kind: 'dom-snapshot', removed: [], changed: removed, added: pool.slice(removed.length).map((x) => x.split('\n')[0] ?? '') };
}

export function domContractDiffs(changedFiles, { base, cwd = ROOT, read = null } = {}) {
  const out = [];
  for (const f of changedFiles) {
    if (!DOM_CONTRACT_FILE.test(f) && !META_FILE.test(f)) continue;
    const [b, h] = read ? read(f) : [showOrNull(base, f, cwd), readOrNull(join(cwd, f))];
    const d = diffDomContract(f, b, h);
    if (d.removed.length || d.changed.length || d.added.length) out.push(d);
  }
  return out;
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

// ------------------------------------------------------------------ visual ---
// REQ-PLAT-20. Default-mode cells: Chromium, light|dark, 1440x900|390x844,
// preview `data-ag-preview="v5"` excluded. A cell is the S-55 string
// `<storyId>|<scene>|<engine>|<axes>` (axes `k=v` joined by , ; or &) or an
// object with the same fields.
export const VISUAL_FIX_IDS = ['D-28-dark-text', 'D-28-contrast-more'];
export const DEFAULT_SCHEMES = ['light', 'dark'];
export const DEFAULT_VIEWPORTS = ['1440x900', '390x844'];

export function cellKey(c) { return typeof c === 'string' ? c : String(c?.cell ?? c?.id ?? ''); }
export function parseCell(c) {
  const key = cellKey(c);
  const [story = '', scene = '', engine = '', axesText = ''] = key.split('|');
  const axes = {};
  for (const kv of axesText.split(/[,;&]/).map((s) => s.trim()).filter(Boolean)) {
    const at = kv.indexOf('=');
    if (at > 0) axes[kv.slice(0, at).trim()] = kv.slice(at + 1).trim().replace(/^["']|["']$/g, '');
  }
  const obj = typeof c === 'object' && c ? c : {};
  for (const k of ['scheme', 'viewport', 'preview']) if (obj[k] != null) axes[k] = String(obj[k]);
  return { key, story, scene, engine: String(obj.engine ?? engine).toLowerCase(), axes };
}
export function isDefaultModeCell(c) {
  const { engine, axes } = parseCell(c);
  if (engine && engine !== 'chromium') return false;
  const scheme = axes.scheme ?? axes.theme;
  if (scheme && !DEFAULT_SCHEMES.includes(scheme)) return false;
  const vp = (axes.viewport ?? axes.vp)?.replace(/×/g, 'x');
  if (vp && !DEFAULT_VIEWPORTS.includes(vp)) return false;
  if ((axes.preview ?? axes['data-ag-preview']) === 'v5') return false;
  return true;
}

/** Schema errors of a visual-fix record (empty = valid). */
export function validateVisualRecord(rec, { exceptionIds = [], artifactExists = () => true } = {}) {
  const errors = [];
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return ['record is not a JSON object'];
  const ids = new Set([...VISUAL_FIX_IDS, ...exceptionIds]);
  if (typeof rec.id !== 'string' || !ids.has(rec.id)) {
    errors.push(`id '${rec.id}' is not D-28-dark-text, D-28-contrast-more or a §13.1 exception id${exceptionIds.length ? ` (${exceptionIds.slice(0, 5).join(', ')}${exceptionIds.length > 5 ? ', …' : ''})` : ''}`);
  }
  if (!Array.isArray(rec.cells) || !rec.cells.length || rec.cells.some((c) => !cellKey(c))) errors.push('cells[] must list the changed cells');
  if (typeof rec.compositeArtifact !== 'string' || !rec.compositeArtifact.trim()) errors.push('compositeArtifact (base | head | diff composite) is missing');
  else if (!/^https?:\/\//.test(rec.compositeArtifact) && !artifactExists(rec.compositeArtifact)) errors.push(`compositeArtifact '${rec.compositeArtifact}' does not exist`);
  if (rec.measuredContrast != null && !Array.isArray(rec.measuredContrast)) errors.push('measuredContrast must be an array when present');
  return errors;
}

const stableAtLeast5 = (version) => { const m = /^(\d+)\.\d+\.\d+$/.exec(version ?? ''); return Boolean(m && Number(m[1]) >= 5); };

/** Visual class from the report and the records the PR adds. `records` are
    `{ file, data }` (or `recordFiles` paths); each is matched on its own. */
export function visualClass({ report, records = null, recordFiles = [], line = '5x', version = null, exceptionIds = [], artifactExists = () => true }) {
  const out = { status: 'absent', cells: [], excluded: 0, class: null, record: null, recordErrors: [] };
  if (!report) { out.status = line === '5x' ? 'pending' : 'missing-blocking'; return out; }
  const all = (report.cells ?? report.changed ?? []).filter(
    (c) => (c.changedRatio ?? c.ratio ?? 0) > VISUAL_TOLERANCE.changedRatio,
  );
  const cells = all.filter(isDefaultModeCell);
  out.excluded = all.length - cells.length;
  out.cells = cells;
  if (!cells.length) { out.status = 'clean'; return out; }
  const recs = records ?? recordFiles.map((file) => {
    try { return { file, data: readJson(file) }; } catch (e) { return { file, data: null, parseError: e.message }; }
  });
  const want = new Set(cells.map(cellKey));
  for (const r of recs) {
    const errs = r.parseError ? [`unreadable JSON (${r.parseError})`] : validateVisualRecord(r.data, { exceptionIds, artifactExists });
    if (errs.length) { out.recordErrors.push(...errs.map((e) => `${r.file}: ${e}`)); continue; }
    const listed = new Set(r.data.cells.map(cellKey));
    if (listed.size === want.size && [...want].every((k) => listed.has(k))) { out.record = r.file; break; }
    const missing = [...want].filter((k) => !listed.has(k)); const extra = [...listed].filter((k) => !want.has(k));
    out.recordErrors.push(`${r.file}: cells do not match the changed default-mode cells${missing.length ? ` (unlisted: ${missing.slice(0, 3).join(', ')})` : ''}${extra.length ? ` (not changed: ${extra.slice(0, 3).join(', ')})` : ''}`);
  }
  if (out.record) out.recordErrors = out.recordErrors.filter((e) => !/cells do not match/.test(e));
  out.status = out.record ? 'recorded' : 'unrecorded';
  // 4x: always blocking; 5x: informational before GA, C-B from 5.0.0 (main).
  out.class = out.record ? 'C-I-VF' : (line === '4x' || stableAtLeast5(version) ? 'C-B' : null);
  return out;
}

// Class per contribution — highest wins; at equal rank the later (more
// specific) entry in CLASSES wins so C-I-VF / C-D-IL survive compression.
function bumpTo(top, cls, reasons, reason) {
  if (CLASS_RANK[cls] > CLASS_RANK[top.v] || (CLASS_RANK[cls] === CLASS_RANK[top.v] && cls !== top.v && cls.length > top.v.length)) top.v = cls;
  if (reason) reasons.push(reason);
  return top;
}

/** The deprecation covering a removed symbol: exact symbol, preferring a row
    whose `entry` matches the removal's subpath. */
export function coveringEntry(removal, entries) {
  const sym = removal.symbol;
  const hits = entries.filter((e) => e.symbol === sym || (removal.whole && e.kind === 'subpath' && e.entry === removal.entry));
  if (hits.length <= 1) return hits[0] ?? null;
  const entry = removal.entry?.startsWith('.') ? removal.entry : null;
  return hits.find((e) => entry && e.entry === entry) ?? hits[0];
}

export function classify(inputs) {
  const {
    apiDiffs = {}, snapshotDiff = { perEntry: {}, entriesRemoved: [], entriesAdded: [] },
    deprecationsAdded = [], deprecationsAll = deprecationsAdded,
    packageDiff = {}, markers = { hasBang: false, hasBreaking: false, multiFamily: [] },
    changesetBumps = [], visual = { status: 'absent', cells: [] }, line = '5x',
    changedFiles = [], version = null, sources = {}, doctorReport = null, releaseNotes = null,
    installDeps = [], domDiffs = [], inputErrors = [], snapshots = null,
  } = inputs;
  const reasons = []; const rank = { v: 'C-I' }; const perEntry = {};
  const removedNames = []; // { entry, symbol, whole }

  // API-report diffs.
  for (const [entry, d] of Object.entries(apiDiffs)) {
    perEntry[entry] = perEntry[entry] ?? { added: [], removed: [] };
    perEntry[entry].added.push(...(d.added ?? [])); perEntry[entry].removed.push(...(d.removed ?? []));
    for (const symbol of d.removed ?? []) removedNames.push({ entry, symbol });
    if ((d.removed ?? []).length) bumpTo(rank, 'C-B', reasons, `${entry}: removed ${d.removed.length} public name(s)`);
    else if ((d.added ?? []).length) bumpTo(rank, 'C-E', reasons, `${entry}: added ${d.added.length} public name(s)`);
  }
  // Snapshot diffs.
  for (const [key, d] of Object.entries(snapshotDiff.perEntry ?? {})) {
    perEntry[key] = perEntry[key] ?? { added: [], removed: [] };
    if (d.removed === 'whole-entry' || (Array.isArray(d.removed) && d.removed.length)) {
      if (d.removed === 'whole-entry') { perEntry[key].removed.push(key); removedNames.push({ entry: key, symbol: key, whole: true }); }
      else { perEntry[key].removed.push(...d.removed); for (const symbol of d.removed) removedNames.push({ entry: key, symbol }); }
      bumpTo(rank, 'C-B', reasons, `${key}: removed subpath or names (export snapshot)`);
    } else if (d.added === 'whole-entry' || (Array.isArray(d.added) && d.added.length)) {
      perEntry[key].added.push(...(d.added === 'whole-entry' ? [key] : d.added));
      bumpTo(rank, 'C-E', reasons, `${key}: added subpath or names (export snapshot)`);
    }
  }
  // DOM-part contract (REQ-SURF-75): a removed/renamed part or a changed DOM
  // snapshot is C-B; purely added parts/snapshots are C-E.
  for (const d of domDiffs) {
    if (d.removed.length || d.changed.length) {
      bumpTo(rank, 'C-B', reasons, `${d.file}: DOM-part contract ${d.kind === 'meta-parts' ? `parts removed (${d.removed.join(', ')})` : `snapshot changed (${d.changed.length + d.removed.length})`}`);
    } else if (d.added.length) bumpTo(rank, 'C-E', reasons, `${d.file}: DOM-part contract extended (${d.added.length} added)`);
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
  if (visual.class) bumpTo(rank, visual.class, reasons, visual.class === 'C-I-VF' ? `visual fix with record ${visual.record}` : 'visual change above tolerance without a matching record');

  const cls = rank.v;
  const errors = [...inputErrors, ...checkMarkers(cls, { hasBang: markers.hasBang, hasBreaking: markers.hasBreaking, line })];
  // REQ-FIN-10: on the 4.x line at version >= 4.2.0 a missing visual-class
  // report is itself a gate failure, not just a class input.
  if (line === '4x' && visual.status === 'missing-blocking') {
    const [maj, min] = (version ?? '0.0.0').split('.').map(Number);
    if ((maj ?? 0) > 4 || ((maj ?? 0) === 4 && (min ?? 0) >= 2)) {
      errors.push('visual-class report missing on 4x >= 4.2.0 (run the 4x visual job first; REQ-PLAT-56)');
    }
  }
  // A malformed visual-fix record added by the PR is a defect on any line.
  for (const e of visual.recordErrors ?? []) if (!/cells do not match/.test(e) || visual.class) errors.push(`visual-fix record ${e}`);
  errors.push(...checkChangesetBump(cls, changesetBumps));

  // Multi-Family trailer (REQ-PLAT-21): >1 breaking group among removals, each
  // removal's group looked up in the merged base+HEAD deprecation set.
  const removals = []; const seen = new Set();
  for (const r of removedNames) {
    const cov = coveringEntry(r, deprecationsAll);
    const key = `${r.symbol}\0${cov?.id ?? r.entry}`;
    if (seen.has(key)) continue;
    seen.add(key);
    removals.push({ entry: r.entry, symbol: r.symbol, breaking: cov?.breaking ?? null, coveringEntry: cov?.id ?? null });
  }
  const groups = new Set(removals.map((r) => r.breaking ?? 'untracked'));
  if (groups.size > 1 && !markers.multiFamily.length) {
    errors.push(`removals span ${groups.size} breaking groups (${[...groups].sort().join(', ')}) without a 'Multi-Family: <reason>' trailer on the head commit`);
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
    domContract: domDiffs.map((d) => ({ file: d.file, kind: d.kind, removed: d.removed.length, changed: d.changed.length, added: d.added.length })),
    snapshots: snapshots ?? { status: 'not-run' },
    visual: { status: visual.status, cells: visual.cells?.length ?? 0, excluded: visual.excluded ?? 0, record: visual.record ?? null },
    commitMarkers: { hasBang: markers.hasBang, hasBreaking: markers.hasBreaking, multiFamily: markers.multiFamily },
    changesets: { bumps: changesetBumps },
    errors,
  };
}

// ------------------------------------------------------------- G-07 coverage ---
// For every removal, the covering deprecation (exact symbol match) must have
// since = a published 4.x minor >= 4.2.0 AND appear in that version's packed
// deprecations.json, or be an allow-listed `exception`. The rules are the
// shared ones of lib/deprecation-coverage.mjs (verify-breaking-register --coverage).
export function deprecationCoverage(removals, entries, { publishedDir = null, published = null, registry = null, allowlist = new Set() } = {}) {
  const reg = registry ?? (published
    ? { published: (v) => (Object.hasOwn(published, v) ? v : null), packedIds: (v) => published[v] ?? [], newest4x: () => null }
    : publishedDir ? dirRegistry(publishedDir) : npmRegistry());
  const judge = entryJudge({ registry: reg, allowlist });
  const rows = removals.map((r) => {
    const cov = coveringEntry(r, entries);
    const j = judge(cov);
    return { ...r, coveringEntry: cov?.id ?? null, since: cov?.since ?? null, verifiedIn: j.verifiedIn, coverage: j.coverage, reason: j.reason };
  });
  return { version: 1, removals: rows, uncovered: rows.filter((r) => r.coverage !== 'covered') };
}

// --------------------------------------------------------- export snapshots ---
const isStableVersion = (v) => /^\d+\.\d+\.\d+$/.test(v ?? '');
/** Is `ref` the release tag of `version` (v<version> or <version>)? */
function isReleaseTag(ref, version, cwd) {
  const at = tryGit(['rev-parse', `${ref}^{commit}`], cwd).trim();
  if (!at || !version) return false;
  return [`v${version}`, version].some((t) => tryGit(['rev-parse', '--verify', '--quiet', `refs/tags/${t}^{commit}`], cwd).trim() === at);
}

export async function realSnapshotDiff({ base, cwd = ROOT, argv = [], env = process.env, snapshotter = null } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const abs = (p) => (isAbsolute(p) ? p : join(cwd, p));
  const snap = snapshotter ?? (await import('./export-snapshot.mjs'));
  const out = { status: 'unavailable', base: null, head: null, reasons: [] };
  let baseSnap = null; let headSnap = null;
  try {
    if (arg('--base-snapshot')) { baseSnap = readJson(abs(arg('--base-snapshot'))); out.base = arg('--base-snapshot'); }
    else {
      const baseVersion = (() => { try { return JSON.parse(showOrNull(base, 'package.json', cwd) ?? 'null')?.version ?? null; } catch { return null; } })();
      if (!isReleaseTag(base, baseVersion, cwd)) out.reasons.push(`base '${base}' is not a release tag; no published export snapshot of it`);
      else if (existsSync(join(cwd, 'etc/snapshots', `${baseVersion}.json`))) { baseSnap = readJson(join(cwd, 'etc/snapshots', `${baseVersion}.json`)); out.base = `etc/snapshots/${baseVersion}.json`; }
      else if (!isStableVersion(baseVersion) && !/^\d+\.\d+\.\d+-[\w.]+$/.test(baseVersion ?? '')) out.reasons.push(`base version '${baseVersion}' is not a semver`);
      else { baseSnap = JSON.parse(snap.snapshotPublished(baseVersion, { cwd }).json); out.base = `aura-glass@${baseVersion}`; }
    }
    if (arg('--head-snapshot')) { headSnap = readJson(abs(arg('--head-snapshot'))); out.head = arg('--head-snapshot'); }
    else {
      const packDir = join(cwd, '.artifacts/pack');
      const tgz = arg('--head-tarball') ?? env.AURAGLASS_TARBALL
        ?? (existsSync(packDir) ? readdirSync(packDir).filter((f) => /^aura-glass-.+\.tgz$/.test(f)).sort().map((f) => join(packDir, f))[0] : null);
      if (!tgz || !existsSync(abs(tgz))) out.reasons.push('no head tarball (--head-tarball, $AURAGLASS_TARBALL or .artifacts/pack/aura-glass-*.tgz)');
      else { headSnap = JSON.parse(snap.snapshotTarball(abs(tgz), { cwd }).json); out.head = relative(cwd, abs(tgz)); }
    }
  } catch (e) { out.reasons.push(`export snapshot failed: ${String(e.message ?? e).split('\n')[0]}`); }
  if (baseSnap && headSnap) { out.status = 'diffed'; return { snapshots: out, diff: diffSnapshots(baseSnap, headSnap) }; }
  return { snapshots: out, diff: { perEntry: {}, entriesRemoved: [], entriesAdded: [] } };
}

// ------------------------------------------------------------------- main ----
export async function main(argv = process.argv.slice(2), { cwd = ROOT, env = process.env, snapshotter = null } = {}) {
  const PATHS = relPaths(cwd);
  const arg = (name, def = null) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : def; };
  const has = (f) => argv.includes(f);
  const base = arg('--base', 'origin/next');
  const line = arg('--line', '5x');
  const outArg = arg('--out', null);
  const out = outArg ? (isAbsolute(outArg) ? outArg : join(cwd, outArg)) : PATHS.changeClassOut;
  const target = arg('--target', null) ?? (line === '4x' ? '4x-minor' : 'next-pre');
  const fixtureDir = arg('--fixture');
  const inputErrors = [];

  const changedFiles = fixtureDir
    ? readFileSync(join(fixtureDir, 'changed-files.txt'), 'utf8').split('\n').filter(Boolean)
    : tryGit(['diff', '--name-only', `${base}...HEAD`], cwd).split('\n').filter(Boolean);
  const logText = fixtureDir ? readFileSync(join(fixtureDir, 'log.txt'), 'utf8')
    : tryGit(['log', '--format=%s%n%b', `${base}..HEAD`], cwd);
  // REQ-PLAT-21: the Multi-Family trailer is read from the HEAD commit only.
  const headLogText = fixtureDir
    ? (existsSync(join(fixtureDir, 'head-log.txt')) ? readFileSync(join(fixtureDir, 'head-log.txt'), 'utf8') : logText)
    : tryGit(['log', '-1', '--format=%B', 'HEAD'], cwd);
  const pkgBase = fixtureDir ? (existsSync(join(fixtureDir, 'pkg.base.json')) ? readFileSync(join(fixtureDir, 'pkg.base.json'), 'utf8') : null)
    : showOrNull(base, 'package.json', cwd);
  const pkgHead = fixtureDir ? readFileSync(join(fixtureDir, 'pkg.head.json'), 'utf8') : readFileSync(PATHS.packageJson ?? join(cwd, 'package.json'), 'utf8');
  const changesetTexts = changedFiles.filter((f) => f.startsWith('.changeset/') && f.endsWith('.md'))
    .map((f) => readOrNull(join(cwd, f)) ?? '');
  const fx = (name, def) => fixtureDir && existsSync(join(fixtureDir, name)) ? readJson(join(fixtureDir, name)) : def;
  const version = JSON.parse(pkgHead).version;

  // Deprecations: real parse at base and HEAD (REQ-PLAT-19/21).
  let deps = { added: [], all: [] };
  if (!fixtureDir) {
    try { deps = await deprecationSets(base, { cwd }); }
    catch (e) { inputErrors.push(`deprecation fragments could not be loaded at ${base}/HEAD: ${String(e.message ?? e).split('\n')[0]}`); }
  }
  const deprecationsAdded = fx('deprecations-added.json', deps.added);
  const deprecationsAll = fx('deprecations-all.json', fixtureDir ? deprecationsAdded : deps.all);

  // Visual: report + the records this PR adds (REQ-PLAT-20).
  const visualPath = fixtureDir && existsSync(join(fixtureDir, 'visual-class.json'))
    ? join(fixtureDir, 'visual-class.json') : PATHS.visualReport(line);
  const visualRel = relative(cwd, PATHS.visualFixesDir).split('\\').join('/');
  const recordFiles = fixtureDir
    ? (existsSync(join(fixtureDir, 'visual-fixes')) ? readdirSync(join(fixtureDir, 'visual-fixes')).filter((f) => f.endsWith('.json')).map((f) => join(fixtureDir, 'visual-fixes', f)) : [])
    : tryGit(['diff', '--name-only', '--diff-filter=A', `${base}...HEAD`, '--', `${visualRel}/`], cwd)
      .split('\n').filter((f) => f.endsWith('.json')).map((f) => join(cwd, f));
  const allowlistIds = (() => { try { return readJson(PATHS.exceptionAllowlist).allowlist ?? []; } catch { return []; } })();
  const exceptionIds = [...new Set([...deprecationsAll.filter((e) => e.exception).map((e) => e.id), ...allowlistIds])].sort();
  const visual = visualClass({
    report: existsSync(visualPath) ? readJson(visualPath) : null,
    recordFiles: recordFiles.sort(), line, version, exceptionIds,
    artifactExists: (p) => existsSync(isAbsolute(p) ? p : join(cwd, p)),
  });
  visual.record = visual.record ? relative(fixtureDir ?? cwd, visual.record) : null;

  const apiDiffs = fixtureDir && existsSync(join(fixtureDir, 'api-diffs.json'))
    ? readJson(join(fixtureDir, 'api-diffs.json')) : diffApiReports(fixtureDir ? null : base, fixtureDir ? [] : changedFiles, fixtureDir, { cwd });

  let snapshotDiff = fx('snapshot-diff.json', null);
  let snapshots = { status: fixtureDir ? 'fixture' : 'skipped' };
  if (!snapshotDiff) {
    snapshotDiff = { perEntry: {}, entriesRemoved: [], entriesAdded: [] };
    if (!fixtureDir && !has('--no-real-snapshots')) {
      const r = await realSnapshotDiff({ base, cwd, argv, env, snapshotter });
      snapshotDiff = r.diff; snapshots = r.snapshots;
      if ((has('--require-snapshots') || has('--real-snapshots')) && snapshots.status !== 'diffed') {
        inputErrors.push(`export-snapshot diff required but unavailable: ${snapshots.reasons.join('; ')}`);
      }
    }
  }
  const domDiffs = fx('dom-diffs.json', fixtureDir ? [] : domContractDiffs(changedFiles, { base, cwd }));

  const result = classify({
    apiDiffs, snapshotDiff, deprecationsAdded, deprecationsAll, domDiffs, inputErrors, snapshots,
    packageDiff: diffPackageJson(pkgBase, pkgHead),
    markers: { ...parseCommitMarkers(logText), multiFamily: parseCommitMarkers(headLogText).multiFamily },
    changesetBumps: parseChangesetBumps(changesetTexts),
    visual, line, target, changedFiles, version,
  });

  if (has('--coverage')) {
    const pdir = arg('--published-dir');
    const cov = deprecationCoverage(result.removals, deprecationsAll, {
      publishedDir: pdir ? (isAbsolute(pdir) ? pdir : join(cwd, pdir)) : null, allowlist: new Set(allowlistIds),
    });
    mkdirSync(dirname(PATHS.deprecationCoverage), { recursive: true });
    writeFileSync(PATHS.deprecationCoverage, stableStringify(cov));
    if (has('--require-covered') && cov.uncovered.length) result.errors.push(`${cov.uncovered.length} removal(s) without a deprecation shipped in a published 4.x minor >= 4.2.0`);
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, stableStringify(result));
  console.log(`${result.class}  (${result.reasons.length} reason(s), ${result.errors.length} error(s)) -> ${relative(cwd, out)}`);
  for (const e of result.errors) console.error(`  FAIL ${e}`);
  return result.errors.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((code) => process.exit(code)).catch((e) => { console.error(e); process.exit(1); });
}
