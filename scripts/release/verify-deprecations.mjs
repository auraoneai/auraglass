#!/usr/bin/env node
/* scripts/release/verify-deprecations.mjs — REQ-PLAT-25 (PLAT-183/184). Verifies
   every deprecation fragment entry against the S-38 rule list. With
   --compare-branch <ref> additionally enforces append-only: no id may be
   removed, and no field of an existing entry may change, versus that ref.

     node scripts/release/verify-deprecations.mjs [--compare-branch <ref>] */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PATHS = relPaths(ROOT);

export const KINDS = new Set(['export', 'subpath', 'prop', 'prop-value', 'css-var', 'css-global', 'peer', 'dependency', 'engine', 'behavior', 'cli', 'data-attr', 'asset']);
export const CODEMODS = new Set(['imports-subpaths', 'canonical-names', 'prop-grammar', 'dead-optical-props', 'providers', 'css-vars', 'deps', 'removed', 'ai-chat', 'app-shell-slots', 'media-backdrops', 'reduced-motion-initial', 'motion-imports', 'motion-props']);
export const EXCEPTIONS = new Set(['security', 'privacy', 'crash', 'legal', 'honesty']);
export const AUTOMATIONS = new Set(['full', 'mostly', 'partial', 'manual', 'none']);
export const RUNTIME_WARN_KINDS = new Set(['export', 'prop', 'prop-value', 'css-global', 'cli', 'data-attr']);

const semverMinor = (v) => { const m = /^4\.(\d+)\.(\d+)$/.exec(v ?? ''); return m ? { minor: Number(m[1]), patch: Number(m[2]) } : null; };
const idRe = /^DEP-[PMCSQ]\d+$/;

export function checkEntries(entries, { entriesManifest = null, rootExports = null, breakingIds = null } = {}) {
  const errors = []; const seen = new Set();
  for (const e of entries) {
    const at = e.id ?? '(no id)';
    const fail = (m) => errors.push(`${at}: ${m}`);
    if (!e.id || !idRe.test(e.id)) fail('id must match DEP-[PMCSQ]\\d+');
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
    if (e.removeIn !== '5.0.0' && e.removeIn !== '6.0.0') fail(`removeIn must be '5.0.0' or '6.0.0'`);
    if (e.removeIn === '5.0.0' && semverMinor(e.since) && semverMinor(e.since).minor < 2 && !e.exception) {
      fail(`removeIn '5.0.0' requires the deprecation to have shipped in a 4.x minor >= 4.2.0 (since=${e.since})`);
    }
    if (e.codemod == null && e.automation !== 'manual' && e.automation !== 'none') {
      fail(`codemod is null but automation is '${e.automation}' (expected 'manual' or 'none')`);
    }
    if (e.codemod != null && !CODEMODS.has(e.codemod)) fail(`unknown codemod '${e.codemod}'`);
    if (!AUTOMATIONS.has(e.automation)) fail(`invalid automation '${e.automation}'`);
    if (!/^B\d+$/.test(e.breaking ?? '')) fail(`breaking '${e.breaking}' must be B<n>`);
    if (breakingIds && /^B\d+$/.test(e.breaking ?? '') && !breakingIds.has(e.breaking)) {
      fail(`breaking '${e.breaking}' is not in docs/release/breaking-changes.json`);
    }
    if (typeof e.message !== 'string' || !e.message.length) fail('message is empty');
    else if (e.message.length > 200) fail(`message is ${e.message.length} chars (> 200)`);
    if (!/^#dep-.+/.test(e.doc ?? '')) fail(`doc '${e.doc}' must be a '#dep-*' anchor`);
    if (e.compat != null && typeof e.compat !== 'string') fail('compat must be an aura-glass/compat export name');
    if (e.exception != null && !EXCEPTIONS.has(e.exception)) fail(`invalid exception '${e.exception}'`);
    if (e.exception != null && !e.evidence) fail('exception entries require evidence');
  }
  return errors;
}

// Append-only vs a compare ref (entries are never edited or deleted on 4.x).
export function checkCompareBranch(current, base) {
  const errors = []; const baseById = new Map(base.map((e) => [e.id, e]));
  const curIds = new Set(current.map((e) => e.id));
  for (const [id, b] of baseById) {
    if (!curIds.has(id)) { errors.push(`${id}: entry removed vs compare branch`); continue; }
    const c = curIds && current.find((e) => e.id === id);
    for (const [k, v] of Object.entries(b)) {
      if (k === 'file' || k === 'stream') continue;
      if (JSON.stringify(v) !== JSON.stringify(c[k])) errors.push(`${id}: field '${k}' changed vs compare branch (${JSON.stringify(v)} -> ${JSON.stringify(c[k])})`);
    }
  }
  return errors;
}

async function loadEntriesForRef(ref, root) {
  const { loadFragments } = await import(new URL(`file://${join(root, 'src/contracts/load-fragments.mjs')}`).href);
  if (!ref) {
    const rows = await loadFragments('deprecations', root);
    return rows.flatMap(({ stream, file, value }) => (value ?? []).map((e) => ({ ...e, stream, file })));
  }
  // Parse entries out of the ref's fragments without checking it out.
  const files = execFileSync('git', ['ls-tree', '-r', '--name-only', ref, 'fragments/deprecations'], { cwd: root, encoding: 'utf8' }).split('\n').filter((f) => f.endsWith('.ts'));
  const entries = [];
  for (const f of files) {
    const text = execFileSync('git', ['show', `${ref}:${f}`], { cwd: root, encoding: 'utf8' });
    for (const m of text.matchAll(/\{[^{}]*id:[^{}]*\}/gs)) {
      const get = (k) => { const mm = new RegExp(`${k}:\\s*'([^']*)'|${k}:\\s*null`).exec(m[0]); return mm ? (mm[1] ?? null) : undefined; };
      const e = { id: get('id'), kind: get('kind'), status: get('status'), entry: get('entry'), symbol: get('symbol'), since: get('since'), removeIn: get('removeIn'), replacement: get('replacement'), codemod: get('codemod'), automation: get('automation'), breaking: get('breaking'), message: get('message'), doc: get('doc'), compat: get('compat'), exception: get('exception'), evidence: get('evidence') };
      for (const k of Object.keys(e)) if (e[k] === undefined) delete e[k];
      if (e.id) entries.push(e);
    }
  }
  return entries;
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const entries = await loadEntriesForRef(null, root);
  const line = arg('--line', '5x');
  // `entry`/`symbol` resolve against the *4.x* surface: on release/4.x use the
  // local package.json exports + src root barrel; on next the 4.x set is not
  // present, so only a manifest passed via --entries-manifest is enforced.
  let entriesManifest = null; let rootExports = null;
  const mf = arg('--entries-manifest');
  if (mf) entriesManifest = JSON.parse(readFileSync(mf, 'utf8'));
  else if (line === '4x' && existsSync(join(root, 'package.json'))) {
    entriesManifest = Object.keys(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).exports ?? {});
  }
  const re = arg('--root-exports');
  if (re) rootExports = new Set(JSON.parse(readFileSync(re, 'utf8')));
  else if (line === '4x' && existsSync(join(root, 'deprecations.json'))) {
    rootExports = null; // root barrel scan is a 4.x-CI concern; see PLAT-135
  }
  const breakingIds = existsSync(PATHS.breakingRegister)
    ? new Set(((JSON.parse(readFileSync(PATHS.breakingRegister, 'utf8')).changes
        ?? JSON.parse(readFileSync(PATHS.breakingRegister, 'utf8')).items) ?? []).map((c) => c.id)) : null;
  const errors = checkEntries(entries, { entriesManifest, rootExports, breakingIds });

  const ref = arg('--compare-branch');
  if (ref) errors.push(...checkCompareBranch(entries, await loadEntriesForRef(ref, root)));

  // Every active runtime-kind entry must appear in the generated table.
  if (existsSync(PATHS.generatedTs)) {
    const gen = readFileSync(PATHS.generatedTs, 'utf8');
    for (const e of entries) {
      if (e.status === 'active' && RUNTIME_WARN_KINDS.has(e.kind) && !gen.includes(`"${e.id}"`)) {
        errors.push(`${e.id}: active runtime-kind entry missing from src/internal/deprecations.generated.ts`);
      }
    }
  }
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); console.error(`verify-deprecations: ${errors.length} error(s)`); return 1; }
  console.log(`verify-deprecations: ${entries.length} entries OK${ref ? ` (append-only vs ${ref})` : ''}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
