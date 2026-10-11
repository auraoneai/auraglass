#!/usr/bin/env node
/* scripts/release/verify-deprecations.mjs — REQ-PLAT-25 (PLAT-183/184). Verifies
   every deprecation fragment entry against the S-38 rule list. With
   --compare-branch <ref> additionally enforces append-only: no id may be
   removed, and no field of an existing entry may change, versus that ref; on
   --line 4x every 4.x id must also exist on the ref (compare origin/next).

     node scripts/release/verify-deprecations.mjs [--line 4x|5x] [--compare-branch <ref>]
       [--version <x.y.z>] [--entries-manifest <json>] [--root-exports <json>] */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

export const KINDS = new Set(['export', 'subpath', 'prop', 'prop-value', 'css-var', 'css-global', 'peer', 'dependency', 'engine', 'behavior', 'cli', 'data-attr', 'asset']);
export const CODEMODS = new Set(['imports-subpaths', 'canonical-names', 'prop-grammar', 'dead-optical-props', 'providers', 'css-vars', 'deps', 'removed', 'ai-chat', 'app-shell-slots', 'media-backdrops', 'reduced-motion-initial', 'motion-imports', 'motion-props']);
export const EXCEPTIONS = new Set(['security', 'privacy', 'crash', 'legal', 'honesty']);
export const AUTOMATIONS = new Set(['full', 'mostly', 'partial', 'manual', 'none']);
export const RUNTIME_WARN_KINDS = new Set(['export', 'prop', 'prop-value', 'css-global', 'cli', 'data-attr']);

const semverMinor = (v) => { const m = /^4\.(\d+)\.(\d+)$/.exec(v ?? ''); return m ? { minor: Number(m[1]), patch: Number(m[2]) } : null; };
const idRe = /^DEP-[PMCSQ]\d+$/;
export const STREAM_PREFIX = { plat: 'P', mat: 'M', cmp: 'C', surf: 'S', qual: 'Q' };
// x.y.z[-pre] → comparable tuple; a prerelease sorts before its release.
const parseVer = (v) => {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(v ?? '');
  return m ? [Number(m[1]), Number(m[2]), Number(m[3]), m[4] ?? null] : null;
};
export function compareVersions(a, b) {
  const x = parseVer(a); const y = parseVer(b);
  if (!x || !y) return NaN;
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  if (x[3] === y[3]) return 0;
  if (x[3] == null) return 1;
  if (y[3] == null) return -1;
  return x[3] < y[3] ? -1 : 1;
}

/* Rule list (S-38 + REQ-PLAT-25). Options:
   - entriesManifest / rootExports: the 4.x surface (4x line)
   - breakingIds: B-ids of docs/release/breaking-changes.json
   - codemods: CORE_CODEMODS ∪ keys(AREA_CODEMODS) from src/contracts/fragments.ts
   - codemodFixtures: codemod ids with a fragments/codemods/<stream>/fixtures/<id>/ dir
   - version: package.json version of the line (4x only: on next the
     version is 5.x and the 4.x minor of an entry is not this tree's). */
export function checkEntries(entries, {
  entriesManifest = null, rootExports = null, breakingIds = null,
  codemods = CODEMODS, codemodFixtures = null, version = null,
} = {}) {
  const errors = []; const seen = new Set();
  for (const e of entries) {
    const at = e.id ?? '(no id)';
    const fail = (m) => errors.push(`${at}: ${m}`);
    if (!e.id || !idRe.test(e.id)) fail('id must match DEP-[PMCSQ]\\d+');
    else if (e.stream && STREAM_PREFIX[e.stream] && e.id[4] !== STREAM_PREFIX[e.stream]) {
      fail(`id prefix DEP-${e.id[4]} does not match stream '${e.stream}' (expected DEP-${STREAM_PREFIX[e.stream]})`);
    }
    if (seen.has(e.id)) fail('duplicate id');
    seen.add(e.id);
    if (!KINDS.has(e.kind)) fail(`invalid kind '${e.kind}'`);
    if (e.status !== 'active' && e.status !== 'planned') fail(`invalid status '${e.status}'`);
    if (entriesManifest && !entriesManifest.includes(e.entry) && !e.exception) {
      fail(`entry '${e.entry}' is not a 4.x subpath in ENTRIES`);
    }
    if (rootExports && e.kind === 'export' && !rootExports.has(e.symbol) && !e.exception) {
      fail(`export symbol '${e.symbol}' is not in ROOT_EXPORTS (add an exception or fix the entry)`);
    }
    if (!semverMinor(e.since)) fail(`since '${e.since}' is not a 4.x.y version`);
    // removeIn ∈ {5.0.0, 6.0.0} with since = 4.x.y makes removeIn > since hold by construction.
    if (e.removeIn !== '5.0.0' && e.removeIn !== '6.0.0') fail(`removeIn must be '5.0.0' or '6.0.0'`);
    // 4.1.1 exception entries are legal (security/privacy/... fixes in a patch).
    if (e.removeIn === '5.0.0' && !e.exception && semverMinor(e.since) && semverMinor(e.since).minor < 2) {
      fail(`removeIn '5.0.0' requires the deprecation to have shipped in a 4.x minor >= 4.2.0 (since=${e.since})`);
    }
    if (version && semverMinor(e.since)) {
      const cmp = compareVersions(e.since, version);
      if (e.status === 'active' && cmp > 0) fail(`status 'active' but since ${e.since} is after the line version ${version} (use 'planned' until that minor is cut)`);
      if (e.status === 'planned' && cmp <= 0) fail(`status 'planned' but since ${e.since} has shipped (line version ${version}); flip to 'active'`);
    }
    if (e.codemod == null && e.automation !== 'manual' && e.automation !== 'none') {
      fail(`codemod is null but automation is '${e.automation}' (expected 'manual' or 'none')`);
    }
    if (e.codemod != null && !codemods.has(e.codemod)) fail(`unknown codemod '${e.codemod}' (not in CORE_CODEMODS ∪ AREA_CODEMODS)`);
    else if (e.codemod != null && codemodFixtures && !codemodFixtures.has(e.codemod)) {
      fail(`codemod '${e.codemod}' has no fragments/codemods/<stream>/fixtures/${e.codemod}/ directory`);
    }
    if (!AUTOMATIONS.has(e.automation)) fail(`invalid automation '${e.automation}'`);
    if (!/^B\d+$/.test(e.breaking ?? '')) fail(`breaking '${e.breaking}' must be B<n>`);
    if (breakingIds && /^B\d+$/.test(e.breaking ?? '') && !breakingIds.has(e.breaking)) {
      fail(`breaking '${e.breaking}' is not in docs/release/breaking-changes.json`);
    }
    if (typeof e.message !== 'string' || !e.message.length) fail('message is empty');
    else {
      if (e.message.length > 200) fail(`message is ${e.message.length} chars (> 200)`);
      if (e.replacement != null && !e.message.includes(e.replacement)) fail(`message must name the replacement '${e.replacement}'`);
    }
    if (!/^#dep-.+/.test(e.doc ?? '')) fail(`doc '${e.doc}' must be a '#dep-*' anchor`);
    if (e.compat != null && typeof e.compat !== 'string') fail('compat must be an aura-glass/compat export name');
    if (e.exception != null && !EXCEPTIONS.has(e.exception)) fail(`invalid exception '${e.exception}'`);
    if (e.exception != null && !e.evidence) fail('exception entries require evidence');
  }
  return errors;
}

// Append-only vs a compare ref (entries are never edited or deleted). With
// requireInBase (release/4.x vs origin/next) every current id must also exist
// on the ref: 4.x entries reach next through the fragments sync.
export function checkCompareBranch(current, base, { requireInBase = false, ref = 'compare branch' } = {}) {
  const errors = []; const baseById = new Map(base.map((e) => [e.id, e]));
  const curById = new Map(current.map((e) => [e.id, e]));
  for (const [id, b] of baseById) {
    const c = curById.get(id);
    if (!c) { errors.push(`${id}: entry removed vs ${ref}`); continue; }
    for (const k of new Set([...Object.keys(b), ...Object.keys(c)])) {
      if (k === 'file' || k === 'stream') continue;
      if (JSON.stringify(b[k]) !== JSON.stringify(c[k])) errors.push(`${id}: field '${k}' changed vs ${ref} (${JSON.stringify(b[k])} -> ${JSON.stringify(c[k])})`);
    }
  }
  if (requireInBase) {
    for (const id of curById.keys()) if (!baseById.has(id)) errors.push(`${id}: present here but missing on ${ref}`);
  }
  return errors;
}

// CORE_CODEMODS ∪ keys(AREA_CODEMODS), evaluated from the contract module.
export async function loadCodemodIds(root) {
  const { build } = await import('esbuild');
  const res = await build({ entryPoints: [join(root, 'src/contracts/fragments.ts')], bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'silent' });
  const mod = { exports: {} };
  new Function('module', 'exports', res.outputFiles[0].text)(mod, mod.exports);
  const { CORE_CODEMODS, AREA_CODEMODS } = mod.exports;
  if (!Array.isArray(CORE_CODEMODS) || !AREA_CODEMODS) throw new Error('src/contracts/fragments.ts: CORE_CODEMODS/AREA_CODEMODS not found');
  return new Set([...CORE_CODEMODS, ...Object.keys(AREA_CODEMODS)]);
}

export function codemodFixtureIds(root) {
  const ids = new Set(); const base = join(root, 'fragments/codemods');
  if (!existsSync(base)) return ids;
  for (const s of readdirSync(base)) {
    const dir = join(base, s, 'fixtures');
    if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
    for (const id of readdirSync(dir)) if (statSync(join(dir, id)).isDirectory()) ids.add(id);
  }
  return ids;
}

async function loadEntriesForRef(ref, root) {
  const { loadFragments } = await import(new URL(`file://${join(root, 'src/contracts/load-fragments.mjs')}`).href);
  const flat = (rows) => rows.flatMap(({ stream, file, value }) => (value ?? []).map((e) => ({ ...e, stream, file })));
  if (!ref) return flat(await loadFragments('deprecations', root));
  // Materialise the ref's fragments in a temp tree and load them with the same
  // loader (no checkout, no regex parsing of TS source).
  const tmp = mkdtempSync(join(tmpdir(), 'ag-verify-dep-'));
  try {
    const files = execFileSync('git', ['ls-tree', '-r', '--name-only', ref, 'fragments/deprecations'], { cwd: root, encoding: 'utf8' })
      .split('\n').filter((f) => /\.(ts|json)$/.test(f));
    for (const f of files) {
      const text = execFileSync('git', ['show', `${ref}:${f}`], { cwd: root, encoding: 'utf8' });
      mkdirSync(dirname(join(tmp, f)), { recursive: true });
      writeFileSync(join(tmp, f), text);
    }
    // fragments import their types from src/contracts; type-only imports are
    // erased by esbuild, but the path must resolve.
    mkdirSync(join(tmp, 'src/contracts'), { recursive: true });
    writeFileSync(join(tmp, 'src/contracts/fragments.ts'), readFileSync(join(root, 'src/contracts/fragments.ts'), 'utf8'));
    return flat(await loadFragments('deprecations', tmp));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const paths = relPaths(root);
  const entries = await loadEntriesForRef(null, root);
  const line = arg('--line') ?? '5x';
  // `entry`/`symbol` resolve against the *4.x* surface: on release/4.x use the
  // local package.json exports + src root barrel; on next the 4.x set is not
  // present, so only a manifest passed via --entries-manifest is enforced.
  let entriesManifest = null; let rootExports = null;
  const pkg = existsSync(paths.packageJson) ? JSON.parse(readFileSync(paths.packageJson, 'utf8')) : {};
  const mf = arg('--entries-manifest');
  if (mf) entriesManifest = JSON.parse(readFileSync(mf, 'utf8'));
  else if (line === '4x') entriesManifest = Object.keys(pkg.exports ?? {});
  const re = arg('--root-exports');
  if (re) rootExports = new Set(JSON.parse(readFileSync(re, 'utf8')));
  // breaking-changes.json is `{version, items}` on next and `{version, changes}` on release/4.x.
  let breakingIds = null;
  if (existsSync(paths.breakingRegister)) {
    const reg = JSON.parse(readFileSync(paths.breakingRegister, 'utf8'));
    breakingIds = new Set((reg.items ?? reg.changes ?? []).map((c) => c.id));
  }
  const errors = checkEntries(entries, {
    entriesManifest, rootExports, breakingIds,
    codemods: await loadCodemodIds(root),
    codemodFixtures: codemodFixtureIds(root),
    version: line === '4x' ? (arg('--version') ?? pkg.version ?? null) : arg('--version'),
  });

  const ref = arg('--compare-branch');
  if (ref) {
    errors.push(...checkCompareBranch(entries, await loadEntriesForRef(ref, root), { requireInBase: line === '4x', ref }));
  }

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
  console.log(`verify-deprecations --line ${line}: ${entries.length} entries OK${ref ? ` (append-only vs ${ref})` : ''}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
