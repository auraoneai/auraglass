#!/usr/bin/env node
/* scripts/release/verify-deprecations.mjs — REQ-PLAT-25 (PLAT-183/184). Verifies
   every deprecation fragment entry against the S-38 rule list (PRD-1
   REQ-PLAT-25). Line-neutral: the same file runs on release/4.x,
   release/4.1.x and next.

     node scripts/release/verify-deprecations.mjs [--line 4x|5x]
       [--compare-branch <ref>] [--entries-manifest <json>]

   Rules (each has a fixture in tests/deprecations/verify.test.ts):
     shape     id/kind/status/automation/doc/breaking/message/exception fields
     prefix    id prefix matches the owning stream (plat→DEP-P, mat→M, cmp→C,
               surf→S, qual→Q) and ids are unique
     version   status 'active' with since > package.json version fails;
               status 'planned' with since <= that version fails
     order     removeIn <= since fails
     replace   a non-null replacement must be named verbatim in the message
     codemod   codemod ∈ CORE_CODEMODS ∪ keys(AREA_CODEMODS) (read from
               src/contracts/fragments.ts) with a fixture directory
               fragments/codemods/<stream>/fixtures/<codemod>/
     register  breaking id present in docs/release/breaking-changes.json
     snapshot  kind 'export': symbol present in the `since` version's export
               snapshot (etc/snapshots/<since>.json once published; the
               current tree's etc/api/<entry>.exports.json while `since` is
               the line's own or a later, unpublished version)
     compare   --compare-branch <ref>: on 5x, every id of <ref> (release/4.x)
               must still exist on this tree with identical fields
               (append-only); on 4x, every id of this tree must exist on <ref>
               (next) — an id on release/4.x missing on next fails. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

export const KINDS = new Set(['export', 'subpath', 'prop', 'prop-value', 'css-var', 'css-global', 'peer', 'dependency', 'engine', 'behavior', 'cli', 'data-attr', 'asset']);
export const EXCEPTIONS = new Set(['security', 'privacy', 'crash', 'legal', 'honesty']);
export const AUTOMATIONS = new Set(['full', 'mostly', 'partial', 'manual', 'none']);
export const RUNTIME_WARN_KINDS = new Set(['export', 'prop', 'prop-value', 'css-global', 'cli', 'data-attr']);
export const STREAM_PREFIX = { plat: 'P', mat: 'M', cmp: 'C', surf: 'S', qual: 'Q' };

const idRe = /^DEP-[PMCSQ]\d+$/;
const semverRe = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
const semver = (v) => { const m = semverRe.exec(v ?? ''); return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null; };
/** SemVer 2.0 §11 precedence: a pre-release (4.2.0-pre.0) ranks below its release (4.2.0). */
export function cmpVersion(a, b) {
  const ma = semverRe.exec(a ?? ''); const mb = semverRe.exec(b ?? '');
  if (!ma || !mb) return NaN;
  for (let i = 1; i <= 3; i += 1) if (Number(ma[i]) !== Number(mb[i])) return Number(ma[i]) - Number(mb[i]);
  const pa = ma[4]; const pb = mb[4];
  if (pa === undefined || pb === undefined) return pa === pb ? 0 : (pa === undefined ? 1 : -1);
  const xa = pa.split('.'); const xb = pb.split('.');
  for (let i = 0; i < Math.max(xa.length, xb.length); i += 1) {
    if (xa[i] === undefined) return -1;
    if (xb[i] === undefined) return 1;
    const na = /^\d+$/.test(xa[i]); const nb = /^\d+$/.test(xb[i]);
    if (na && nb) { if (Number(xa[i]) !== Number(xb[i])) return Number(xa[i]) - Number(xb[i]); continue; }
    if (na !== nb) return na ? -1 : 1;
    if (xa[i] !== xb[i]) return xa[i] < xb[i] ? -1 : 1;
  }
  return 0;
}

/**
 * @param {object[]} entries fragment entries; `stream` is the owning fragment file
 * @param {object} ctx
 * @param {string|null} ctx.version     package.json version of the line
 * @param {Set<string>|null} ctx.codemods       CORE_CODEMODS ∪ keys(AREA_CODEMODS)
 * @param {Set<string>|null} ctx.codemodFixtures codemod ids with a fixture directory
 * @param {(since: string, entry: string) => Set<string>|null} ctx.exportsAt
 *        export names of `entry` in the `since` version's snapshot (null = no snapshot)
 */
export function checkEntries(entries, {
  entriesManifest = null, breakingIds = null, version = null,
  codemods = null, codemodFixtures = null, exportsAt = null,
} = {}) {
  const errors = []; const seen = new Set();
  for (const e of entries) {
    const at = e.id ?? '(no id)';
    const fail = (m) => errors.push(`${at}: ${m}`);
    if (!e.id || !idRe.test(e.id)) fail('id must match DEP-[PMCSQ]\\d+');
    if (seen.has(e.id)) fail('duplicate id');
    seen.add(e.id);
    if (e.stream && STREAM_PREFIX[e.stream] && e.id && !e.id.startsWith(`DEP-${STREAM_PREFIX[e.stream]}`)) {
      fail(`id prefix does not match stream '${e.stream}' (expected DEP-${STREAM_PREFIX[e.stream]}####)`);
    }
    if (!KINDS.has(e.kind)) fail(`invalid kind '${e.kind}'`);
    if (e.status !== 'active' && e.status !== 'planned') fail(`invalid status '${e.status}'`);
    if (entriesManifest && !entriesManifest.includes(e.entry) && !e.exception) {
      fail(`entry '${e.entry}' is not a 4.x subpath in ENTRIES`);
    }
    if (!/^4\.\d+\.\d+$/.test(e.since ?? '')) fail(`since '${e.since}' is not a 4.x.y version`);
    if (e.removeIn !== '5.0.0' && e.removeIn !== '6.0.0') fail(`removeIn must be '5.0.0' or '6.0.0'`);
    if (semver(e.since) && semver(e.removeIn) && cmpVersion(e.removeIn, e.since) <= 0) {
      fail(`removeIn '${e.removeIn}' must be later than since '${e.since}'`);
    }
    if (e.removeIn === '5.0.0' && semver(e.since) && semver(e.since)[1] < 2 && !e.exception) {
      fail(`removeIn '5.0.0' requires the deprecation to have shipped in a 4.x minor >= 4.2.0 (since=${e.since})`);
    }
    if (version && semver(version) && semver(e.since)) {
      if (e.status === 'active' && cmpVersion(e.since, version) > 0) {
        fail(`status 'active' but since '${e.since}' is later than the line version ${version} (use 'planned' until that minor is cut)`);
      }
      if (e.status === 'planned' && cmpVersion(e.since, version) <= 0) {
        fail(`status 'planned' but since '${e.since}' is not later than the line version ${version} (it shipped: use 'active')`);
      }
    }
    if (e.codemod == null && e.automation !== 'manual' && e.automation !== 'none') {
      fail(`codemod is null but automation is '${e.automation}' (expected 'manual' or 'none')`);
    }
    if (e.codemod != null && codemods && !codemods.has(e.codemod)) fail(`unknown codemod '${e.codemod}' (not in CORE_CODEMODS ∪ AREA_CODEMODS)`);
    else if (e.codemod != null && codemodFixtures && !codemodFixtures.has(e.codemod)) {
      fail(`codemod '${e.codemod}' has no fixture directory fragments/codemods/<stream>/fixtures/${e.codemod}/`);
    }
    if (!AUTOMATIONS.has(e.automation)) fail(`invalid automation '${e.automation}'`);
    if (!/^B\d+$/.test(e.breaking ?? '')) fail(`breaking '${e.breaking}' must be B<n>`);
    if (breakingIds && /^B\d+$/.test(e.breaking ?? '') && !breakingIds.has(e.breaking)) {
      fail(`breaking '${e.breaking}' is not in docs/release/breaking-changes.json`);
    }
    if (typeof e.message !== 'string' || !e.message.length) fail('message is empty');
    else {
      if (e.message.length > 200) fail(`message is ${e.message.length} chars (> 200)`);
      if (e.replacement != null && !e.message.includes(e.replacement)) {
        fail(`message does not name the replacement '${e.replacement}'`);
      }
    }
    if (!/^#dep-.+/.test(e.doc ?? '')) fail(`doc '${e.doc}' must be a '#dep-*' anchor`);
    if (e.compat != null && typeof e.compat !== 'string') fail('compat must be an aura-glass/compat export name');
    if (e.exception != null && !EXCEPTIONS.has(e.exception)) fail(`invalid exception '${e.exception}'`);
    if (e.exception != null && !e.evidence) fail('exception entries require evidence');
    if (e.kind === 'export' && exportsAt && semver(e.since)) {
      const names = exportsAt(e.since, e.entry);
      if (names == null) fail(`no export snapshot for ${e.since} '${e.entry}' (etc/snapshots/${e.since}.json)`);
      else if (!names.has(e.symbol)) fail(`export '${e.symbol}' is not in the ${e.since} export snapshot of '${e.entry}'`);
    }
  }
  return errors;
}

// 5x (next): append-only versus release/4.x — no id removed, no field changed.
// 4x: every id on this tree must exist on the compare ref (next).
export function checkCompareBranch(current, base, { line = '5x', ref = 'compare branch' } = {}) {
  const errors = [];
  if (line === '4x') {
    const baseIds = new Set(base.map((e) => e.id));
    for (const e of current) if (!baseIds.has(e.id)) errors.push(`${e.id}: present on this 4.x line but absent on ${ref}`);
    return errors;
  }
  const curById = new Map(current.map((e) => [e.id, e]));
  for (const b of base) {
    const c = curById.get(b.id);
    if (!c) { errors.push(`${b.id}: entry removed vs ${ref}`); continue; }
    for (const [k, v] of Object.entries(b)) {
      if (k === 'file' || k === 'stream') continue;
      if (JSON.stringify(v) !== JSON.stringify(c[k])) errors.push(`${b.id}: field '${k}' changed vs ${ref} (${JSON.stringify(v)} -> ${JSON.stringify(c[k])})`);
    }
  }
  return errors;
}

async function loadFragmentEntries(root, contractsRoot = root) {
  const { loadFragments } = await import(new URL(`file://${join(contractsRoot, 'src/contracts/load-fragments.mjs')}`).href);
  const rows = await loadFragments('deprecations', root);
  return rows.flatMap(({ stream, file, value }) => (value ?? []).map((e) => ({ ...e, stream, file })));
}

// A ref's fragments are evaluated exactly like the working tree's (esbuild via
// the contract loader), from a temp copy of fragments/deprecations + the
// contract types, so computed entries (e.g. `.map(...)` rows) are not missed.
export async function loadEntriesForRef(ref, root = ROOT) {
  const tmp = mkdtempSync(join(tmpdir(), 'ag-verify-dep-'));
  try {
    const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const files = git(['ls-tree', '-r', '--name-only', ref, 'fragments/deprecations', 'src/contracts/fragments.ts'])
      .split('\n').filter(Boolean);
    for (const f of files) {
      mkdirSync(dirname(join(tmp, f)), { recursive: true });
      writeFileSync(join(tmp, f), git(['show', `${ref}:${f}`]));
    }
    return await loadFragmentEntries(tmp, root);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

// CORE_CODEMODS ∪ keys(AREA_CODEMODS) from the frozen contract file.
export async function contractCodemods(root = ROOT) {
  const { build } = await import('esbuild');
  const res = await build({ entryPoints: [join(root, 'src/contracts/fragments.ts')], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
  const mod = await import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`);
  return new Set([...(mod.CORE_CODEMODS ?? []), ...Object.keys(mod.AREA_CODEMODS ?? {})]);
}

export function codemodFixtureIds(root = ROOT) {
  const ids = new Set(); const base = join(root, 'fragments/codemods');
  if (!existsSync(base)) return ids;
  for (const stream of readdirSync(base)) {
    const fx = join(base, stream, 'fixtures');
    if (!existsSync(fx) || !statSync(fx).isDirectory()) continue;
    for (const id of readdirSync(fx)) if (statSync(join(fx, id)).isDirectory()) ids.add(id);
  }
  return ids;
}

const entrySlug = (entry) => (entry === '.' ? 'index' : entry.replace(/^\.\//, '').replace(/\//g, '-'));

// (since, entry) → export names. etc/snapshots/<since>.json (export-snapshot
// output of a published version) wins; while `since` is not published
// (>= the line's own version, no snapshot committed) the current tree's
// api report is the snapshot.
export function snapshotResolver(root = ROOT, version = null) {
  const cache = new Map();
  const readJson = (p) => { if (!cache.has(p)) cache.set(p, existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null); return cache.get(p); };
  return (since, entry) => {
    const snap = readJson(join(root, 'etc/snapshots', `${since}.json`));
    if (snap) {
      const row = snap.entries?.[entry];
      return row ? new Set([...(row.runtime ?? []), ...(row.types ?? [])]) : new Set();
    }
    if (version && cmpVersion(since, version) >= 0) {
      const api = readJson(join(root, 'etc/api', `${entrySlug(entry)}.exports.json`));
      return api ? new Set(api.exports ?? []) : new Set();
    }
    return null;
  };
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n, def = null) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : def; };
  const paths = relPaths(root);
  const line = arg('--line', '5x');
  const entries = await loadFragmentEntries(root);
  const pkg = existsSync(paths.packageJson) ? JSON.parse(readFileSync(paths.packageJson, 'utf8')) : {};

  // `entry` resolves against the *4.x* surface: on a 4.x line the local
  // package.json exports; on next only a manifest passed via --entries-manifest.
  let entriesManifest = null;
  const mf = arg('--entries-manifest');
  if (mf) entriesManifest = JSON.parse(readFileSync(mf, 'utf8'));
  else if (line === '4x') entriesManifest = Object.keys(pkg.exports ?? {});

  const register = existsSync(paths.breakingRegister) ? JSON.parse(readFileSync(paths.breakingRegister, 'utf8')) : null;
  const breakingIds = register ? new Set((register.items ?? register.changes ?? []).map((c) => c.id)) : null;

  const errors = checkEntries(entries, {
    entriesManifest, breakingIds,
    // On next (5.x versions) the 4.x since/active rule has no line version to compare to.
    version: line === '4x' ? pkg.version ?? null : null,
    codemods: await contractCodemods(root),
    codemodFixtures: codemodFixtureIds(root),
    exportsAt: snapshotResolver(root, line === '4x' ? pkg.version ?? null : null),
  });

  const ref = arg('--compare-branch');
  if (ref) errors.push(...checkCompareBranch(entries, await loadEntriesForRef(ref, root), { line, ref }));

  // Every active runtime-kind entry must appear in the generated table.
  if (existsSync(paths.generatedTs)) {
    const gen = readFileSync(paths.generatedTs, 'utf8');
    for (const e of entries) {
      if (e.status === 'active' && RUNTIME_WARN_KINDS.has(e.kind) && !gen.includes(`"${e.id}"`)) {
        errors.push(`${e.id}: active runtime-kind entry missing from src/internal/deprecations.generated.ts`);
      }
    }
  }
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); console.error(`verify-deprecations: ${errors.length} error(s)`); return 1; }
  console.log(`verify-deprecations: ${entries.length} entries OK${ref ? ` (${line === '4x' ? `every id present on ${ref}` : `append-only vs ${ref}`})` : ''}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
