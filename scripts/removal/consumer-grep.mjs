#!/usr/bin/env node
/* scripts/removal/consumer-grep.mjs — PLAT-223 (REQ-PLAT-81). Per-family
   consumer scan before an RM PR merges (operator, read-only).

   Scan: every source file under the downstream checkouts (/Users/gurbakshchahal/AuraOne
   and /Users/gurbakshchahal/platforms/*, minus the aura-glass checkouts themselves;
   node_modules, .git, .next, dist, reports and storybook-static are pruned) that
   carries an `aura-glass` import specifier is grepped for the family's export names
   (from the dispositions) with a word-boundary pattern. `gh search code --owner auraoneai
   --owner gchahal1982 "aura-glass"` adds the remote files, each fetched and grepped
   the same way (per-file grep). Its absence is recorded, never hidden.

   Record docs/release/decisions/removals/RM-<nn>.json (paths and counts only):
     { family, generatedAt, scanSha, sha?, mergeSha?, names[], status, missingRoots[],
       roots[{root, files, hitCount}], hits[{path, count}], gh{status, files?, reason?},
       acknowledged[{path, via: 'codemod'|'4.x-lts', note?}], signoff? }
   `sha`/`mergeSha` are the removal commit (revert-dry-run.mjs reads them); `scanSha`
   is HEAD when the scan ran. `signoff` is the operator's note for a scan whose roots
   or gh search were unavailable.

   --verify fails on: a missing record; drifted names; the pre-REQ-PLAT-81 record
   shape; a hit with no owner acknowledgement (codemod run or pinned 4.x LTS); an
   unavailable scan with no signoff; and, for the families the PR touches (record
   changed or legacy files deleted between --base / $CI_MERGE_REQUEST_DIFF_BASE_SHA
   and HEAD), a record scanned before the PR's base.

     node scripts/removal/consumer-grep.mjs --family RM-02 \
       [--roots /path/a,/path/b] [--no-gh] [--write]
     node scripts/removal/consumer-grep.mjs --verify [--family RM-02] [--base <sha>]
     node scripts/removal/consumer-grep.mjs --reshape --family RM-02   (old shape -> new, no rescan) */
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DISPOSITIONS = join(ROOT, 'docs/inventory/component-dispositions.md');
export const DEFAULT_ROOTS = ['/Users/gurbakshchahal/AuraOne', '/Users/gurbakshchahal/platforms'];
export const EXCLUDED = ['node_modules', '.git', '.next', 'dist', 'reports', 'storybook-static'];
/** Source files a consumer imports from; prose (.md) mentions are not consumers. */
export const SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts', '.vue', '.svelte', '.astro', '.mdx']);
/** An `aura-glass` (or `aura-glass/<subpath>`) import specifier: static, dynamic, require, side-effect. */
export const SPECIFIER_RE = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s+)['"]aura-glass(?:\/[^'"]*)?['"]/;
/** Owner acknowledgement kinds (REQ-PLAT-81): the consumer ran the codemod, or pins the 4.x LTS. */
export const ACK_VIA = ['codemod', '4.x-lts'];
const RECORDS = 'docs/release/decisions/removals';

// Family -> legacy path prefixes (PRD RM table; matches record `file` under legacy/).
export const FAMILY_PATHS = {
  'RM-01': ['server/', 'src/services/', 'src/lib/ai-client.ts'],
  'RM-02': ['src/components/ai/', 'src/components/voice/'],
  'RM-03': ['src/components/advanced/GlassBiometric', 'src/components/advanced/GlassEye', 'src/components/advanced/GlassNeuro', 'src/components/advanced/GlassPredictive', 'src/components/advanced/GlassContextual', 'src/components/advanced/GlassContext', 'src/components/advanced/GlassMeta', 'src/components/advanced/GlassSelf', 'src/components/advanced/GlassQuantum', 'src/components/quantum/', 'adaptiveAI', 'emotionalIntelligence', 'aiPersonalization', 'consciousnessOptimization', 'soundDesign'],
  'RM-04': ['src/components/advanced/GlassAchievement', 'src/components/social/', 'src/components/collaboration/'],
  'RM-05': ['src/components/cms/', 'src/components/ecommerce/'],
  'RM-06': ['src/components/effects/', 'src/components/immersive/', 'src/components/ar/', 'src/components/atmospheric/', 'src/components/houdini/', 'src/components/spatial/', 'src/components/experiential/', 'LiquidGlassGPU'],
  'RM-07': ['src/components/charts/', 'ModularGlassDataChart', 'GlassDataChart.tsx'],
  'RM-08': ['src/components/layouts/GlassFractal', 'src/components/layouts/GlassGolden', 'src/components/layouts/GlassTess', 'src/components/layouts/GlassIsland', 'src/components/layouts/GlassOrbital', 'src/components/demo/', 'src/components/website-components/', 'src/components/showcase/', 'examples/', 'visual-baselines/'],
  'RM-09': ['src/components/accessibility/', 'src/utils/contrastGuard.ts', 'useAutoTextContrast'],
  'RM-10': ['src/client/', 'src/ssr/', 'src/data/', 'src/constants/', 'src/registry/', 'src/reports/', 'src/types/glass-api-stable.ts', 'src/theme/tokens.ts', 'src/tokens/designConstants.ts', 'src/hooks/'],
  'RM-11': ['src/components/'],
  'RM-12': ['src/primitives/'],
  // RM-13 removes 4.x docs and the legacy test tree: no export names, so the scan
  // records zero names and zero hits (the record still pins scanSha for the gate).
  'RM-13': [],
};

export function dispositionsRows(text) {
  const rows = [];
  /* 11-column table (Owner + Codemod, written by gen-component-dispositions
     after REQ-PLAT-80) or the earlier 9-column table. The two shapes cannot
     both match one row (fixed cell count, pipe-free cells), so a doc in either
     format parses fully instead of silently yielding zero names. */
  for (const m of text.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*([A-Z]+)\s*\|\s*(yes|no)\s*\|\s*([a-z]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|$/gm)) {
    rows.push({ i: +m[1], name: m[2].replace(/\\\|/g, '|'), file: m[3] === '-' ? '' : m[3], disp: m[4], pub: m[5] === 'yes', dest: m[6], target: m[7], owner: m[8], codemod: m[9], prd: m[10], note: m[11] });
  }
  for (const m of text.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*([A-Z]+)\s*\|\s*(yes|no)\s*\|\s*([a-z]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|$/gm)) {
    rows.push({ i: +m[1], name: m[2].replace(/\\\|/g, '|'), file: m[3] === '-' ? '' : m[3], disp: m[4], pub: m[5] === 'yes', dest: m[6], target: m[7], owner: '', codemod: '', prd: m[8], note: m[9] });
  }
  return rows.sort((a, b) => a.i - b.i);
}
const tokenOf = (name) => name.split(/[\s(/]/)[0];

export function familyNames(family, rows) {
  const prefixes = FAMILY_PATHS[family];
  if (!prefixes) return null;
  const matched = rows.filter((r) => prefixes.some((p) =>
    r.file.startsWith(p) || tokenOf(r.name).startsWith(p.replace(/\.tsx$/, ''))));
  // RM-11 is the catch-all: records under src/components/** not claimed by
  // RM-02..RM-09.
  if (family === 'RM-11') {
    const claimed = new Set();
    for (const f of Object.keys(FAMILY_PATHS)) {
      if (f === 'RM-11' || f === 'RM-01' || f === 'RM-12') continue;
      for (const r of familyNames(f, rows) ?? []) claimed.add(r.name);
    }
    return rows.filter((r) => r.file.startsWith('src/components/') && !claimed.has(r.name));
  }
  return matched;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Word-boundary occurrences of any family name in a file that imports aura-glass; 0 when it does not. */
export function countNameHits(text, names) {
  if (!names.length || !SPECIFIER_RE.test(text)) return 0;
  const re = new RegExp(`\\b(?:${names.map(escapeRe).join('|')})\\b`, 'g');
  return (text.match(re) ?? []).length;
}

/** Downstream roots: AuraOne plus each platforms/* checkout except aura-glass's own (its fixtures import itself). */
export function expandRoots(roots) {
  const out = [];
  for (const r of roots) {
    if (!existsSync(r)) { out.push(r); continue; }
    if (r.replace(/\/+$/, '').endsWith('/platforms')) {
      for (const d of readdirSync(r, { withFileTypes: true })) {
        if (d.isDirectory() && !/^aura-?glass/i.test(d.name)) out.push(join(r, d.name));
      }
    } else out.push(r);
  }
  return out.sort();
}

/** Walks one root (no symlinks, EXCLUDED pruned) and returns { files, hits: [{path, count}] }. */
export function scanRoot(root, names) {
  const hits = [];
  let files = 0;
  const walk = (dir) => {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.isSymbolicLink()) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!EXCLUDED.includes(e.name)) walk(p); continue; }
      if (!e.isFile() || !SOURCE_EXT.has(extname(e.name))) continue;
      let text;
      try { if (lstatSync(p).size > 2 * 1024 * 1024) continue; text = readFileSync(p, 'utf8'); } catch { continue; }
      if (!SPECIFIER_RE.test(text)) continue;
      files++;
      const count = countNameHits(text, names);
      if (count) hits.push({ path: p, count });
    }
  };
  walk(root);
  return { files, hits: hits.sort((a, b) => a.path.localeCompare(b.path)) };
}

/** `gh search code` + per-file grep. `gh` is injectable for tests: (args) => stdout. */
export function ghSearch(names, { timeoutMs = 30000, gh = (args) => execFileSync('gh', args, { encoding: 'utf8', timeout: timeoutMs, maxBuffer: 8 * 1024 * 1024 }) } = {}) {
  let found;
  try {
    found = JSON.parse(gh(['search', 'code', '--owner', 'auraoneai', '--owner', 'gchahal1982',
      'aura-glass', '--limit', '50', '--json', 'repository,path']));
  } catch (e) {
    return { status: 'missing', reason: `gh search unavailable: ${String(e.message).split('\n')[0]}`, hits: [] };
  }
  const hits = [];
  let unreadable = 0;
  for (const f of found) {
    const nwo = f.repository?.nameWithOwner;
    if (!nwo || !f.path || !SOURCE_EXT.has(extname(f.path))) continue;
    try {
      const text = gh(['api', '-H', 'Accept: application/vnd.github.raw', `repos/${nwo}/contents/${f.path.split('/').map(encodeURIComponent).join('/')}`]);
      const count = countNameHits(text, names);
      if (count) hits.push({ path: `gh:${nwo}/${f.path}`, count });
    } catch { unreadable++; }
  }
  return { status: unreadable ? 'partial' : 'ok', files: found.length, ...(unreadable ? { reason: `${unreadable} file(s) could not be fetched` } : {}), hits };
}

/** git merge-base --is-ancestor, injectable for tests. */
const gitIsAncestor = (a, b) => {
  try { execFileSync('git', ['merge-base', '--is-ancestor', a, b], { cwd: ROOT, stdio: 'ignore' }); return true; } catch { return false; }
};

/**
 * Errors for one record. `opts.base` (PR base sha) applies the freshness rule: the
 * scan must have run at or after the base (`isAncestor(base, scanSha)`).
 */
export function verifyRecord(family, record, currentNames, opts = {}) {
  const errors = [];
  if (!record) return [`no consumer-grep record for ${family}`];
  if (record.family !== family) errors.push(`record family ${record.family} != ${family}`);
  const stale = currentNames.filter((n) => !(record.names ?? []).includes(n));
  if (stale.length) errors.push(`stale: ${stale.length} names not in record (${stale.slice(0, 3).join(', ')}…)`);
  if (!Array.isArray(record.hits) || !Array.isArray(record.acknowledged)) {
    errors.push('record predates REQ-PLAT-81 shape { hits[], acknowledged[] } (run --reshape or rescan with --write)');
    return errors;
  }
  for (const a of record.acknowledged) {
    if (!a || typeof a.path !== 'string' || !ACK_VIA.includes(a.via)) errors.push(`acknowledged entry ${JSON.stringify(a)} needs { path, via: ${ACK_VIA.join(' | ')} }`);
  }
  const acked = new Set(record.acknowledged.filter((a) => a && ACK_VIA.includes(a.via)).map((a) => a.path));
  const open = record.hits.filter((h) => !acked.has(h.path));
  if (open.length) errors.push(`${open.length} consumer hit(s) without an owner acknowledgement (codemod run or 4.x LTS pin): ${open.slice(0, 3).map((h) => h.path).join(', ')}${open.length > 3 ? ', …' : ''}`);
  const signed = typeof record.signoff === 'string' && record.signoff.trim() !== '';
  if (record.gh?.status && record.gh.status !== 'ok' && !signed) errors.push(`gh search ${record.gh.status} and no operator signoff`);
  if (record.status === 'missing' && !signed) errors.push('all roots missing and no operator signoff');
  if (opts.base) {
    const isAncestor = opts.isAncestor ?? gitIsAncestor;
    if (!record.scanSha) errors.push(`record has no scanSha; rescan after rebasing onto ${opts.base}`);
    else if (!isAncestor(opts.base, record.scanSha)) errors.push(`record scanned at ${record.scanSha}, older than the PR base ${opts.base}; rescan`);
  }
  return errors;
}

/** Families an RM PR touches: its record changed, or files under legacy/<family path> were deleted. */
export function familiesInDiff(nameStatus) {
  const fams = new Set();
  for (const line of nameStatus.split('\n').filter(Boolean)) {
    const [status, ...paths] = line.split('\t');
    for (const p of paths) {
      const rec = p.match(/^docs\/release\/decisions\/removals\/(RM-\d+)\.json$/);
      if (rec) fams.add(rec[1]);
      if (!status.startsWith('D') || !p.startsWith('legacy/')) continue;
      const rel = p.slice('legacy/'.length);
      for (const [fam, prefixes] of Object.entries(FAMILY_PATHS)) if (prefixes.some((x) => x.includes('/') && rel.startsWith(x))) fams.add(fam);
    }
  }
  return fams;
}

/** Old `{ scans:[{root,hitCount,hits:[line]}], acknowledged:false }` -> paths and counts. */
export function reshapeRecord(prev) {
  if (Array.isArray(prev.hits) && Array.isArray(prev.acknowledged)) return prev;
  const counts = new Map();
  for (const s of prev.scans ?? []) {
    for (const line of s.hits ?? []) {
      const path = String(line).split(':')[0];
      counts.set(path, (counts.get(path) ?? 0) + 1);
    }
  }
  const { scans, acknowledged, note, ...rest } = prev;
  return {
    ...rest,
    roots: (scans ?? []).map((s) => ({ root: s.root, hitCount: s.hitCount })),
    hits: [...counts].map(([path, count]) => ({ path, count })).sort((a, b) => a.path.localeCompare(b.path)),
    gh: prev.gh ? { status: prev.gh.status, ...(Array.isArray(prev.gh.hits) ? { files: prev.gh.hits.length } : {}), ...(prev.gh.reason ? { reason: prev.gh.reason } : {}) } : prev.gh,
    acknowledged: [],
    ...(note ? { note } : {}),
  };
}

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const headSha = () => { try { return execFileSync('git', ['rev-parse', '--short=9', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return null; } };

export function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const family = arg('--family');
  const rows = existsSync(DISPOSITIONS) ? dispositionsRows(readFileSync(DISPOSITIONS, 'utf8')) : [];
  const namesFor = (fam) => [...new Set((familyNames(fam, rows) ?? []).map((r) => tokenOf(r.name)).filter(Boolean))].sort();
  const recordPath = (fam) => join(ROOT, RECORDS, `${fam}.json`);

  if (argv.includes('--verify')) {
    const base = arg('--base') ?? process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA ?? null;
    let inPr = new Set();
    if (base) {
      try {
        inPr = familiesInDiff(execFileSync('git', ['diff', '--name-status', '--no-renames', `${base}...HEAD`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
      } catch (e) { console.error(`FAIL consumer-grep --verify: cannot diff ${base}...HEAD (${String(e.message).split('\n')[0]})`); return 1; }
    }
    /* Bare --verify checks the union of every known family and every record on
       disk: a family with no record is a failure, not a skip. */
    const onDisk = existsSync(join(ROOT, RECORDS)) ? readdirSync(join(ROOT, RECORDS))
      .filter((f) => /^RM-\d+\.json$/.test(f)).map((f) => f.replace('.json', '')) : [];
    const fams = family ? [family] : [...new Set([...Object.keys(FAMILY_PATHS), ...onDisk])].sort();
    let bad = 0;
    for (const fam of fams) {
      const errors = verifyRecord(fam, readJson(recordPath(fam)), namesFor(fam), inPr.has(fam) ? { base } : {});
      if (errors.length) { bad++; for (const e of errors) console.error(`FAIL consumer-grep --verify ${fam}: ${e}`); }
      else console.log(`consumer-grep --verify ${fam}: record current (${namesFor(fam).length} names${inPr.has(fam) ? `, scanned at/after ${base}` : ''})`);
    }
    return bad ? 1 : 0;
  }

  if (!family || !/^RM-\d+$/.test(family)) { console.error('usage: --family RM-<nn> [--write] | --verify [--base <sha>] | --reshape --family RM-<nn>'); return 2; }
  const path = recordPath(family);

  if (argv.includes('--reshape')) {
    const prev = readJson(path);
    if (!prev) { console.error(`consumer-grep --reshape: no record at ${path}`); return 1; }
    writeFileSync(path, `${JSON.stringify(reshapeRecord(prev), null, 2)}\n`);
    console.log(`consumer-grep --reshape ${family}: wrote ${path}`);
    return 0;
  }

  const names = namesFor(family);
  const roots = expandRoots((arg('--roots') ?? DEFAULT_ROOTS.join(',')).split(',').filter(Boolean));
  const missingRoots = roots.filter((r) => !existsSync(r));
  const scans = names.length ? roots.filter((r) => existsSync(r)).map((r) => ({ root: r, ...scanRoot(r, names) })) : [];
  const gh = argv.includes('--no-gh') || !names.length
    ? { status: names.length ? 'missing' : 'ok', ...(names.length ? { reason: '--no-gh' } : { files: 0 }), hits: [] }
    : ghSearch(names);
  const hits = [...scans.flatMap((s) => s.hits), ...gh.hits];
  const prev = readJson(path) ?? {};
  // Keep acknowledgements whose path is still a hit; keep the removal commit pointer and any extra keys (e.g. RM-01 gate).
  const acknowledged = (Array.isArray(prev.acknowledged) ? prev.acknowledged : []).filter((a) => hits.some((h) => h.path === a?.path));
  const { hits: ghHits, ...ghMeta } = gh;
  const record = {
    ...prev,
    family, generatedAt: new Date().toISOString(), scanSha: headSha(), names,
    status: roots.length && missingRoots.length === roots.length ? 'missing' : 'ok',
    missingRoots,
    roots: scans.map((s) => ({ root: s.root, files: s.files, hitCount: s.hits.length })),
    hits, gh: { ...ghMeta, hitCount: ghHits.length }, acknowledged,
  };
  delete record.scans;
  if (argv.includes('--write')) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`);
    console.log(`consumer-grep ${family}: wrote ${path} (${names.length} names, ${hits.length} hit(s), status=${record.status}, gh=${gh.status})`);
  } else {
    console.log(JSON.stringify({ family, names: names.length, hits: hits.length, status: record.status, gh: gh.status }));
  }
  return 0;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
