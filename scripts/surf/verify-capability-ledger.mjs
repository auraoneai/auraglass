#!/usr/bin/env node
/**
 * verify-capability-ledger.mjs — SURF capability-ledger gate (REQ-SURF-179..187).
 *
 *   node scripts/surf/verify-capability-ledger.mjs [--ledger p] [--prd-dir p]
 *   node scripts/surf/verify-capability-ledger.mjs --write-budgets
 *   node scripts/surf/verify-capability-ledger.mjs --diff <base-sha>
 *        [--exports before.json after.json]
 *   node scripts/surf/verify-capability-ledger.mjs --report md [--write|--check]
 *   node scripts/surf/verify-capability-ledger.mjs --report release-notes --version <x.y.z> [--out [file]]
 *        (--out defaults to .artifacts/surf/ledger/new-capability.md)
 *   node scripts/surf/verify-capability-ledger.mjs --manifest <packed> [--rc]
 *        [--storybook-index <index.json>] [--registry-out <dir>] [--pkg-version <v>]
 *   node scripts/surf/verify-capability-ledger.mjs --budget <packed> [--ga]
 *   node scripts/surf/verify-capability-ledger.mjs --promotion <base-ledger> [--entries <file>]
 *
 * <packed> is a packed tarball (*.tgz), a directory holding it (the root
 * package's tarball is picked by name), or an enumerated-exports JSON
 * `{ entries: [{ subpath, exports: [..], statics?: { Name: [..] } }] }`.
 * A tarball is extracted under .artifacts/surf/ledger/packed/ and every
 * enumerable subpath of its `exports` map is imported to list its value
 * exports (Object.keys(await import(...))) and their static members.
 *
 * Exits 1 naming the offending row on failure. Dependency-free: the JSON
 * Schema subset (type incl. type arrays, enum, pattern, required, items,
 * properties, additionalProperties) is checked by an embedded validator.
 * Evidence (export snapshots, enumerations, delivery/budget results) is
 * written to .artifacts/surf/ledger/. Prints `ledger gate: <ms> ms`.
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, dirname, relative, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const t0 = process.hrtime.bigint();
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const EXP_PRD = 'docs/auraglass-5/archive/v1-19-prd/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md';
const COMPETITORS = 'docs/auraglass-5/research/competitors.md';
const REPORT_MD = 'docs/auraglass-5/capability-ledger.report.md';
const LEDGER_REL = 'docs/auraglass-5/capability-ledger.json';
const SIZE_BUDGETS = 'docs/size-budgets.json';
const ENTRIES_TS = 'src/contracts/entries.ts';
const EVIDENCE_DIR = '.artifacts/surf/ledger';
const REGISTRY_PUBLIC_DIR = 'apps/docs/public/r'; // scripts/docs/paths.mjs REGISTRY_PUBLIC_DIR
const STORY_ROOTS = ['src', 'stories', 'registry', 'showcase'];
const ARTIFACT_URL = /^https:\/\/.+\/-\/jobs\/\d+\/artifacts/;
const ROOT_CEILING = 160;
const TOTAL_CEILING = 250;

const STREAMS = ['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL'];
const OWNER_FILE = {
  PLAT: 'AURAGLASS_PLATFORM_RELEASE_PRD.md',
  MAT: 'AURAGLASS_MATERIAL_SYSTEM_PRD.md',
  CMP: 'AURAGLASS_CORE_COMPONENTS_PRD.md',
  SURF: 'AURAGLASS_PRODUCT_SURFACES_PRD.md',
  QUAL: 'AURAGLASS_QUALITY_SHOWCASE_PRD.md',
};
// REQ-SURF-186 gap rows: owner file has no requirement for these yet — a
// 'planned' row may cite one of these ledger-side REQ-SURF ids instead.
const GAP_ROWS = new Set(['X-07', 'X-16', 'X-19', 'X-25', 'X-26']);
const GAP_REQ_WHITELIST = new Set([
  'REQ-SURF-10', 'REQ-SURF-23', 'REQ-SURF-26', 'REQ-SURF-27', 'REQ-SURF-28',
  'REQ-SURF-78', 'REQ-SURF-79', 'REQ-SURF-105', 'REQ-SURF-184',
]);
const DEMAND_URL = /^https:\/\/github\.com\/.+\/issues\/[0-9]+|^https:\/\/.+\/doctor\/reports\/.+/;

const errors = [];
const fail = (msg) => errors.push(msg);

const args = process.argv.slice(2);
const arg = (flag, i = 1) => {
  const p = args.indexOf(flag);
  return p === -1 ? undefined : args[p + i];
};
const has = (flag) => args.includes(flag);
const repoPath = (p) => (p.startsWith('/') ? p : join(ROOT, p));
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const releaseKey = (r) => (/^5\.\d+$/.test(r) ? Number(r.split('.')[1]) : r === '5.x' ? 1e3 : 1e4);

function writeEvidence(name, data) {
  const dir = repoPath(arg('--evidence-dir') ?? EVIDENCE_DIR);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
}

/* ---------- JSON Schema subset checker (REQ-SURF-179/180) ---------- */
function typeOk(type, value) {
  switch (type) {
    case 'object': return value !== null && typeof value === 'object' && !Array.isArray(value);
    case 'array': return Array.isArray(value);
    case 'string': return typeof value === 'string';
    case 'integer': return Number.isInteger(value);
    case 'boolean': return typeof value === 'boolean';
    case 'null': return value === null;
    default: return false;
  }
}
function checkSchema(schema, value, path) {
  if (schema === true) return;
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeOk(t, value))) return fail(`${path}: expected ${types.join('|')}`);
    if (value === null) return;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    return fail(`${path}: ${JSON.stringify(value)} not in ${schema.enum.join('|')}`);
  }
  if (schema.pattern && !(typeof value === 'string' && new RegExp(schema.pattern).test(value))) {
    return fail(`${path}: ${JSON.stringify(value)} fails ${schema.pattern}`);
  }
  if (typeOk('object', value)) {
    for (const k of schema.required ?? []) if (!(k in value)) fail(`${path}: missing "${k}"`);
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const k of Object.keys(value)) if (!allowed.has(k)) fail(`${path}: unknown key "${k}"`);
    }
    for (const [k, sub] of Object.entries(schema.properties ?? {})) {
      if (k in value) checkSchema(sub, value[k], `${path}.${k}`);
    }
  }
  if (Array.isArray(value)) {
    value.forEach((it, i) => {
      // Rows are named by id so a schema failure names the row (REQ-SURF-179).
      const tag = it && typeof it === 'object' && typeof it.id === 'string' ? ` ${it.id}` : '';
      checkSchema(schema.items ?? true, it, `${path}[${i}]${tag}`);
    });
  }
}

/* ---------- shared reads ---------- */
function definedEIds() {
  const f = repoPath(EXP_PRD);
  if (!existsSync(f)) return null;
  return new Set([...readFileSync(f, 'utf8').matchAll(/\|\s*(E-\d{2})\s*\|/g)].map((m) => m[1]));
}
function competitorsLines() {
  const f = repoPath(COMPETITORS);
  if (!existsSync(f)) return null;
  return readFileSync(f, 'utf8').split('\n').length;
}
function ownerReqIds(owner, prdDir) {
  const f = join(prdDir, OWNER_FILE[owner]);
  if (!existsSync(f)) return new Set();
  return new Set([...readFileSync(f, 'utf8').matchAll(/\bREQ-[A-Z0-9]+-[0-9]+\b/g)].map((m) => m[0]));
}

/* ---------- budgetKb from docs/size-budgets.json (R6 gzip line) ---------- */
// A JS row `{ A, B } from 'aura-glass[/sub]'` is the per-import gzip line of
// each listed name. budgetKb of a row with a subpath = ceil(max over its names of
// the most specific line's limitBytes / 1024); null when no line exists.
function sizeLines() {
  const f = repoPath(SIZE_BUDGETS);
  if (!existsSync(f)) return null;
  const lines = [];
  for (const r of readJson(f).rows ?? []) {
    if (r.kind !== 'js' || /\(.*share\)/.test(r.import)) continue;
    const m = /^\{([^}]*)\}\s*from\s*'aura-glass(\/[a-z0-9-]+)?'$/.exec(String(r.import).trim());
    if (!m) continue;
    lines.push({ names: m[1].split(',').map((s) => s.trim()).filter(Boolean), subpath: m[2] ? `.${m[2]}` : '.', limitBytes: r.limitBytes });
  }
  return lines;
}
function derivedBudgetKb(row, lines) {
  if (typeof row.subpath !== 'string') return null;
  let max = null;
  for (const name of row.names ?? []) {
    const hits = lines.filter((l) => l.subpath === (row.subpath ?? '.') && l.names.includes(name));
    if (!hits.length) continue;
    const specific = hits.reduce((a, b) => (b.names.length < a.names.length ? b : a));
    max = Math.max(max ?? 0, specific.limitBytes);
  }
  return max === null ? null : Math.ceil(max / 1024);
}

/* ---------- CSF static parse → Storybook ids (REQ-SURF-187) ---------- */
const sanitize = (s) => String(s).toLowerCase()
  .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
  .replace(/-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
const startCase = (key) => key
  .replace(/([a-z\d])([A-Z])/g, '$1 $2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  .replace(/([a-zA-Z])(\d)/g, '$1 $2')
  .replace(/(\d)([a-zA-Z])/g, '$1 $2')
  .replace(/[_-]+/g, ' ').trim();
function storyIdsOf(text) {
  const title = /\btitle:\s*['"]([^'"]+)['"]/.exec(text)?.[1];
  if (!title) return { title: null, ids: [] };
  const ids = [];
  for (const m of text.matchAll(/^export\s+const\s+([A-Za-z_$][\w$]*)\s*[:=]/gm)) {
    if (m[1] === 'default' || m[1] === '__namedExportsOrder') continue;
    ids.push(`${sanitize(title)}--${sanitize(startCase(m[1]))}`);
  }
  return { title, ids };
}
function* walkFiles(dir, re) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkFiles(p, re);
    else if (re.test(name)) yield p;
  }
}
let storyIdCache = null;
function csfStoryIds() {
  if (storyIdCache) return storyIdCache;
  storyIdCache = new Set();
  for (const r of STORY_ROOTS) {
    for (const f of walkFiles(join(ROOT, r), /\.stories\.(ts|tsx|js|jsx|mdx)$/)) {
      for (const id of storyIdsOf(readFileSync(f, 'utf8')).ids) storyIdCache.add(id);
    }
  }
  return storyIdCache;
}

/* ---------- semantic checks (REQ-SURF-179/-180/-184/-185/-186/-187) ---------- */
function semanticChecks(ledger, { prdDir, eIds, compLines, isDefaultLedger }) {
  const seen = new Set();
  const rejectedNames = new Map(); // lowercase name -> {id, capability}
  let exportRoot = 0, exportSub = 0, nonRejected = 0, rejected = 0;
  const lines = sizeLines();
  for (const row of ledger.rows) {
    const tag = row.id ?? '(no id)';
    if (seen.has(row.id)) fail(`${tag}: duplicate row id`);
    seen.add(row.id);
    if (!row.owner || Array.isArray(row.owner) || !STREAMS.includes(row.owner)) {
      fail(`${tag}: owner missing, an array, or not a stream key`);
    }
    if (row.collaborators?.includes(row.owner)) fail(`${tag}: owner ${row.owner} repeats in collaborators`);
    if (row.status === 'rejected') {
      rejected++;
      for (const n of row.names ?? []) rejectedNames.set(String(n).toLowerCase(), row);
    } else {
      nonRejected++;
      for (const [k, v] of Object.entries(row.rubric ?? {})) {
        if (v === false) fail(`${tag}: non-rejected row has rubric.${k} = false`);
      }
      if (!(row.evidence ?? []).length) fail(`${tag}: non-rejected row carries no evidence entry`);
    }
    if ((row.form ?? []).includes('export') && typeof row.subpath !== 'string') {
      fail(`${tag}: export-form row has no subpath`);
    }
    // Evidence: competitors.md line pin that exists, or non-empty exception:
    for (const e of row.evidence ?? []) {
      const pin = /^research\/competitors\.md:(\d+)$/.exec(e);
      if (pin) {
        if (compLines !== null && Number(pin[1]) > compLines) {
          fail(`${tag}: evidence ${e} exceeds ${COMPETITORS} (${compLines} lines)`);
        }
      } else if (!/^exception:.+/.test(e)) {
        fail(`${tag}: evidence ${JSON.stringify(e)} is neither a competitors.md pin nor exception:`);
      }
    }
    // Findings: every E-id must be defined in the expansion PRD §2 table.
    for (const fid of row.findings ?? []) {
      if (eIds !== null && !eIds.has(fid)) fail(`${tag}: undefined finding ${fid}`);
    }
    // budgetKb is tool-derived from docs/size-budgets.json (--write-budgets).
    if (lines && 'budgetKb' in row) {
      const want = derivedBudgetKb(row, lines);
      if (row.budgetKb !== want) {
        fail(`${tag}: budgetKb ${row.budgetKb} != ${want} derived from ${SIZE_BUDGETS} — run --write-budgets`);
      }
    }
    // Story ids cited by a row exist as CSF exports (REQ-SURF-187).
    if ((row.stories ?? []).length) {
      const ids = csfStoryIds();
      for (const s of row.stories) if (!ids.has(s)) fail(`${tag}: story id ${s} not found in any CSF file`);
    }
    if (row.status === 'delivered' && (row.form ?? []).some((f) => f === 'part' || f === 'prop') && !(row.stories ?? []).length) {
      fail(`${tag}: delivered part/prop row cites no story id`);
    }
    exportRoot += row.exportDelta?.root ?? 0;
    exportSub += row.exportDelta?.subpath ?? 0;
  }
  // Aggregate invariants (58 + 13 rows, export-budget ceilings) bind the real
  // ledger; fixture ledgers under --ledger exercise row-level defects only.
  if (isDefaultLedger) {
    if (nonRejected !== 58) fail(`ledger: expected 58 non-rejected rows, got ${nonRejected}`);
    if (rejected !== 13) fail(`ledger: expected 13 rejected rows, got ${rejected}`);
    if (exportRoot > ROOT_CEILING) fail(`ledger: sum(exportDelta.root)=${exportRoot} exceeds ${ROOT_CEILING}`);
    if (exportRoot + exportSub > TOTAL_CEILING) fail(`ledger: sum(exportDelta)=${exportRoot + exportSub} exceeds ${TOTAL_CEILING}`);
  }

  // REQ-SURF-186: reqRefs resolve in the owning PRD file (or gap whitelist on
  // a planned gap row).
  const cache = new Map();
  for (const row of ledger.rows) {
    if (row.status === 'rejected' || !STREAMS.includes(row.owner)) continue;
    const ids = cache.get(row.owner) ?? ownerReqIds(row.owner, prdDir);
    cache.set(row.owner, ids);
    for (const ref of row.reqRefs ?? []) {
      if (ids.has(ref)) continue;
      if (GAP_ROWS.has(row.id) && row.status === 'planned' && GAP_REQ_WHITELIST.has(ref)) continue;
      fail(`${row.id}: reqRef ${ref} not found in ${OWNER_FILE[row.owner] ?? row.owner}`);
    }
  }
  return { exportRoot, exportSub, rejectedNames };
}

/* ---------- REQ-SURF-185 rejected-name / alias guard ---------- */
function checkRejectedNames(ledger, rejectedNames) {
  for (const row of ledger.rows) {
    if (row.status === 'rejected') continue;
    for (const n of row.names ?? []) {
      const hit = rejectedNames.get(String(n).toLowerCase());
      if (hit) fail(`${row.id}: ${hit.id} rejected: ${hit.capability}`);
    }
  }
}

/* ---------- static value-export enumeration of entry barrels at a sha (REQ-SURF-183) ---------- */
function git(argv, input) {
  return execFileSync('git', argv, { cwd: ROOT, encoding: 'utf8', input, maxBuffer: 256 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
}
// Batch-read blobs at <sha> (one git process per BFS level).
function readBlobs(sha, paths) {
  const out = new Map();
  if (!paths.length) return out;
  const buf = execFileSync('git', ['cat-file', '--batch'], {
    cwd: ROOT, input: paths.map((p) => `${sha}:${p}`).join('\n') + '\n', maxBuffer: 256 * 1024 * 1024,
  });
  let pos = 0;
  for (const p of paths) {
    const nl = buf.indexOf(10, pos);
    const header = buf.subarray(pos, nl).toString('utf8');
    pos = nl + 1;
    if (header.endsWith(' missing')) continue;
    const size = Number(header.split(' ')[2]);
    out.set(p, buf.subarray(pos, pos + size).toString('utf8'));
    pos += size + 1;
  }
  return out;
}
function parseEntries(text) {
  const entries = [];
  for (const m of text.matchAll(/\{\s*subpath:\s*'([^']+)',\s*source:\s*'([^']+)'/g)) {
    if (/\.(ts|tsx|mts)$/.test(m[2])) entries.push({ subpath: m[1], source: m[2] });
  }
  return entries;
}
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
function parseModule(text) {
  const src = stripComments(text);
  const names = new Set();
  const stars = [];
  for (const m of src.matchAll(/\bexport\s+(?:declare\s+)?(?:async\s+)?(?:const|let|var|function\*?|class|enum|abstract\s+class)\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of src.matchAll(/\bexport\s+(type\s+)?\{([^}]*)\}/g)) {
    if (m[1]) continue;
    for (const part of m[2].split(',')) {
      const p = part.trim();
      if (!p || /^type\s/.test(p)) continue;
      const alias = p.split(/\s+as\s+/).pop().trim();
      if (alias && alias !== 'default') names.add(alias);
    }
  }
  for (const m of src.matchAll(/\bexport\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from/g)) names.add(m[1]);
  for (const m of src.matchAll(/\bexport\s+\*\s+from\s+['"]([^'"]+)['"]/g)) stars.push(m[1]);
  return { names, stars };
}
function resolveRel(from, spec, files) {
  if (!spec.startsWith('.')) return null;
  const base = join(dirname(from), spec).replace(/\\/g, '/').replace(/\.js$/, '');
  for (const c of [base, `${base}.ts`, `${base}.tsx`, `${base}.mts`, `${base}/index.ts`, `${base}/index.tsx`]) {
    if (files.has(c)) return c;
  }
  return null;
}
function enumerateExportsAt(sha) {
  const files = new Set(git(['ls-tree', '-r', '--name-only', sha]).split('\n').filter(Boolean));
  const entriesText = readBlobs(sha, [ENTRIES_TS]).get(ENTRIES_TS);
  if (!entriesText) return null;
  const entries = parseEntries(entriesText).filter((e) => files.has(e.source));
  const parsed = new Map();
  let frontier = [...new Set(entries.map((e) => e.source))];
  while (frontier.length) {
    const blobs = readBlobs(sha, frontier);
    const next = [];
    for (const f of frontier) {
      const mod = parseModule(blobs.get(f) ?? '');
      const starFiles = mod.stars.map((s) => resolveRel(f, s, files)).filter(Boolean);
      parsed.set(f, { names: mod.names, starFiles });
      for (const s of starFiles) if (!parsed.has(s) && !next.includes(s)) next.push(s);
    }
    frontier = next.filter((f) => !parsed.has(f));
  }
  const collect = (f, seen = new Set()) => {
    if (seen.has(f)) return new Set();
    seen.add(f);
    const p = parsed.get(f);
    const all = new Set(p?.names ?? []);
    for (const s of p?.starFiles ?? []) for (const n of collect(s, seen)) all.add(n);
    return all;
  };
  const snapshot = {};
  for (const e of entries) snapshot[e.subpath] = [...collect(e.source)].sort();
  return snapshot;
}

/* ---------- REQ-SURF-183 --diff gate ---------- */
function diffGate(ledger, baseSha) {
  let changed;
  try {
    changed = git(['diff', '--name-only', `${baseSha}...HEAD`]).split('\n').filter(Boolean);
  } catch (e) {
    fail(`diff: cannot diff ${baseSha}...HEAD: ${String(e.message).split('\n')[0]}`);
    return;
  }
  const ledgerChanged = changed.includes(LEDGER_REL);
  // Registry blocks/items and labs residents added in this diff must be a
  // names entry of a row whose JSON changed in the same diff.
  const idOf = (p) => {
    const m = /^registry\/(?:blocks|items)\/([^/]+)\//.exec(p) ?? /^packages\/labs\/src\/([^/]+)\//.exec(p);
    return m ? m[1] : null;
  };
  const newIds = [...new Set(changed.map(idOf).filter(Boolean))];
  const evidence = { base: baseSha, head: git(['rev-parse', 'HEAD']).trim(), changedFiles: changed.length, registryOrLabs: newIds, exportsAdded: [], failures: [] };
  if (newIds.length) {
    const namesInChangedRows = new Set();
    if (ledgerChanged) {
      let baseLedger = null;
      try { baseLedger = JSON.parse(git(['show', `${baseSha}:${LEDGER_REL}`])); } catch { /* base had no ledger */ }
      const baseById = new Map((baseLedger?.rows ?? []).map((r) => [r.id, JSON.stringify(r)]));
      for (const r of ledger.rows) {
        if (JSON.stringify(r) !== baseById.get(r.id)) for (const n of r.names ?? []) namesInChangedRows.add(kebab(n));
      }
    }
    for (const id of newIds) {
      if (!namesInChangedRows.has(id.toLowerCase())) {
        const msg = `diff: registry/labs entry ${id} added without a matching ledger row change`;
        evidence.failures.push(msg);
        fail(msg);
      }
    }
  }
  // Value exports: explicit snapshots (--exports before after) or derived
  // from the entry barrels of src/contracts/entries.ts at <base> and HEAD.
  let before, after;
  if (has('--exports')) {
    before = readJson(repoPath(arg('--exports', 1)));
    after = readJson(repoPath(arg('--exports', 2)));
  } else {
    before = enumerateExportsAt(baseSha) ?? {};
    after = enumerateExportsAt('HEAD');
    if (!after) {
      fail(`diff: ${ENTRIES_TS} missing at HEAD — value exports cannot be enumerated`);
      after = {};
    }
    writeEvidence('exports-base.json', before);
    writeEvidence('exports-head.json', after);
  }
  evidence.exportsAdded = exportsDiffCheck(ledger, before, after);
  evidence.failures.push(...errors.filter((e) => e.startsWith('export ')));
  writeEvidence('diff.json', evidence);
}

/* Value exports added between two snapshots must be a name in some ledger row
 * (REQ-SURF-183). Snapshot shape: { "<subpath>": ["<name>", ...] }. */
function exportsDiffCheck(ledger, before, after) {
  const allNames = new Set();
  for (const r of ledger.rows) {
    if (r.status !== 'rejected') for (const n of r.names ?? []) allNames.add(String(n).toLowerCase());
  }
  const added = [];
  for (const [sub, names] of Object.entries(after)) {
    const beforeSet = new Set((before[sub] ?? []).map((n) => n.toLowerCase()));
    for (const n of names) {
      if (beforeSet.has(n.toLowerCase())) continue;
      added.push({ subpath: sub, name: n, row: allNames.has(n.toLowerCase()) });
      if (!allNames.has(n.toLowerCase())) fail(`export ${n} (${sub}) added without a ledger row`);
    }
  }
  return added;
}

/* ---------- REQ-SURF-184 promotion gate ---------- */
// Base ledger comes from `git show <base-sha>:...ledger.json` under --diff, or
// from a file passed to --promotion. A promoted name must also be a value
// export named in the contract (src/contracts/entries.ts, or --entries).
function contractNames() {
  const f = repoPath(arg('--entries') ?? ENTRIES_TS);
  if (!existsSync(f)) return new Set();
  const text = stripComments(readFileSync(f, 'utf8'));
  const names = new Set();
  for (const m of text.matchAll(/\[([^\]]*)\]/g)) {
    for (const s of m[1].matchAll(/'([^']+)'/g)) names.add(s[1]);
  }
  return names;
}
function promotionCheck(ledger, baseSha) {
  let baseLedger = null;
  if (has('--promotion')) {
    baseLedger = readJson(repoPath(arg('--promotion')));
  } else if (baseSha) {
    try { baseLedger = JSON.parse(git(['show', `${baseSha}:${LEDGER_REL}`])); } catch { return; }
  } else return;
  const baseById = new Map(baseLedger.rows.map((r) => [r.id, r]));
  let contract = null;
  for (const row of ledger.rows) {
    const was = baseById.get(row.id);
    if (!was) continue;
    const promoted = row.form.includes('export') &&
      (was.form.includes('registry-item') || was.form.includes('registry-block') || was.form.includes('labs')) &&
      !was.form.includes('export');
    if (!promoted) continue;
    const delta = (row.exportDelta?.root ?? 0) + (row.exportDelta?.subpath ?? 0);
    if (delta <= 0) fail(`${row.id}: promoted to export but exportDelta is 0`);
    if (!row.subpath) fail(`${row.id}: promoted to export but subpath is unset`);
    const urls = new Set((row.demand ?? []).filter((u) => DEMAND_URL.test(u)));
    if (urls.size < 10) fail(`${row.id}: promotion needs ≥10 distinct demand links, has ${urls.size}`);
    contract ??= contractNames();
    for (const n of row.names ?? []) {
      if (!contract.has(n)) fail(`${row.id}: promoted name ${n} is not in the contract (${arg('--entries') ?? ENTRIES_TS}); land the contract PR first`);
    }
  }
}

/* ---------- packed-exports enumeration (REQ-SURF-181/-184) ---------- */
function pickConditional(v) {
  if (typeof v === 'string') return v;
  if (!v || typeof v !== 'object') return null;
  for (const k of ['import', 'default', 'node', 'require']) {
    if (k in v) {
      const r = pickConditional(v[k]);
      if (r) return r;
    }
  }
  return null;
}
function tarballFor(dir) {
  const rootName = readJson(repoPath('package.json')).name;
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.tgz')).sort()) {
    try {
      const pkg = JSON.parse(execFileSync('tar', ['-xzOf', join(dir, f), 'package/package.json'], { encoding: 'utf8' }));
      if (pkg.name === rootName) return join(dir, f);
    } catch { /* not an npm tarball */ }
  }
  return null;
}
const packedCache = new Map();
async function loadPacked(src) {
  if (packedCache.has(src)) return packedCache.get(src);
  const p = repoPath(src);
  let result = null;
  if (!existsSync(p)) {
    fail(`packed: ${src} not present (needs the plat:package:pack artifact)`);
  } else if (statSync(p).isDirectory()) {
    const tgz = tarballFor(p);
    if (!tgz) fail(`packed: no ${readJson(repoPath('package.json')).name} tarball in ${src}`);
    else result = await enumerateTarball(tgz);
  } else if (p.endsWith('.tgz')) {
    result = await enumerateTarball(p);
  } else {
    const j = readJson(p);
    result = { version: j.version ?? null, entries: j.entries ?? [] };
  }
  packedCache.set(src, result);
  return result;
}
async function enumerateTarball(tgz) {
  const dest = repoPath(join(arg('--evidence-dir') ?? EVIDENCE_DIR, 'packed', basename(tgz, '.tgz')));
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  execFileSync('tar', ['-xzf', tgz, '-C', dest]);
  const pkgDir = join(dest, 'package');
  const pkg = readJson(join(pkgDir, 'package.json'));
  const map = typeof pkg.exports === 'string' ? { '.': pkg.exports } : (pkg.exports ?? {});
  const entries = [];
  for (const [sub, target] of Object.entries(map)) {
    if (sub.includes('*') || /\.(css|json)$/.test(sub)) continue;
    const file = pickConditional(target);
    if (!file || !/\.(m?js|cjs)$/.test(file)) continue;
    const abs = join(pkgDir, file);
    if (!existsSync(abs)) { fail(`packed: ${sub} → ${file} missing from ${basename(tgz)}`); continue; }
    try {
      const mod = await import(pathToFileURL(abs).href);
      const exports = Object.keys(mod).filter((k) => k !== 'default' && k !== '__esModule').sort();
      const statics = {};
      for (const k of exports) {
        const v = mod[k];
        if ((typeof v === 'function' || (v && typeof v === 'object')) && !Array.isArray(v)) {
          const members = Object.getOwnPropertyNames(v).filter((m) => /^[A-Z]/.test(m));
          if (members.length) statics[k] = members.sort();
        }
      }
      entries.push({ subpath: sub, exports, statics });
    } catch (e) {
      fail(`packed: import of ${sub} (${file}) failed: ${String(e?.message ?? e).split('\n')[0]}`);
    }
  }
  const out = { tarball: relative(ROOT, tgz), version: pkg.version, entries };
  writeEvidence('packed-exports.json', out);
  return out;
}

/* ---------- REQ-SURF-181 delivery check (L2, packed tarball) ---------- */
function metaParts() {
  const out = [];
  for (const f of walkFiles(join(ROOT, 'src'), /\.meta\.ts$/)) {
    const text = readFileSync(f, 'utf8');
    const owner = /\bowner:\s*'([A-Z]+)'/.exec(text)?.[1];
    const parts = /\bparts:\s*\[([^\]]*)\]/.exec(text)?.[1];
    if (!owner || parts === undefined) continue;
    out.push({ file: relative(ROOT, f), owner, parts: new Set([...parts.matchAll(/'([^']+)'/g)].map((m) => m[1])) });
  }
  return out;
}
const FORM_TYPE = { 'registry-item': 'registry:item', 'registry-block': 'registry:block' };
function resolveName(row, name, ctx) {
  const sub = row.subpath ?? '.';
  // (a) value export or static member of `subpath` in the packed tarball.
  const entry = ctx.packed?.entries?.find((e) => e.subpath === sub);
  if (entry) {
    const set = new Set(entry.exports ?? []);
    if (set.has(name)) return 'export';
    const dot = name.indexOf('.');
    if (dot > 0 && (entry.statics?.[name.slice(0, dot)] ?? []).includes(name.slice(dot + 1))) return 'static';
    if (Object.values(entry.statics ?? {}).some((m) => m.includes(name))) return 'static';
  }
  // (b) data-ag-part in a *.meta.ts owned by the row's owner.
  const part = name.startsWith('data-ag-') ? name.slice('data-ag-'.length) : kebab(name);
  if (ctx.metas.some((m) => m.owner === row.owner && (m.parts.has(part) || m.parts.has(name)))) return 'part';
  // (c) a story id of the row in storybook-static/index.json naming the name.
  if (ctx.storyIndex && (row.stories ?? []).length) {
    const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const id of row.stories) {
      const e = ctx.storyIndex[id];
      if (e && [e.id, e.title, e.name].some((s) => norm(s).includes(norm(name)))) return 'story';
    }
  }
  // (d) registry item source + built JSON with a type matching the form.
  for (const form of row.form ?? []) {
    const type = FORM_TYPE[form];
    if (!type) continue;
    for (const kind of ['blocks', 'items']) {
      const f = join(ROOT, 'registry', kind, name, 'registry-item.json');
      if (!existsSync(f)) continue;
      let item;
      try { item = readJson(f); } catch { continue; }
      if (item.type === type && existsSync(join(ctx.registryOut, `${name}.json`))) return 'registry';
    }
  }
  return null;
}
async function deliveryCheck(ledger, src) {
  const packed = await loadPacked(src);
  if (!packed) return;
  const pkgVersion = arg('--pkg-version') ?? packed.version ?? readJson(repoPath('package.json')).version;
  const indexPath = repoPath(arg('--storybook-index') ?? 'storybook-static/index.json');
  const storyIndex = existsSync(indexPath) ? (readJson(indexPath).entries ?? null) : null;
  const ctx = { packed, metas: metaParts(), storyIndex, registryOut: repoPath(arg('--registry-out') ?? REGISTRY_PUBLIC_DIR) };
  const [pmaj, pmin] = String(pkgVersion).split('.').map(Number);
  const report = { pkgVersion, storybookIndex: storyIndex ? relative(ROOT, indexPath) : null, rows: [] };
  for (const row of ledger.rows) {
    if (row.status !== 'delivered' || !/^5\.\d+$/.test(row.release)) continue;
    const [maj, min] = row.release.split('.').map(Number);
    if (pmaj < maj || (pmaj === maj && pmin < min)) continue;
    const routes = {};
    for (const name of row.names ?? []) {
      routes[name] = resolveName(row, name, ctx);
      if (!routes[name]) {
        fail(`${row.id}: delivered name ${name} resolves through no route (export/static of ${row.subpath ?? '.'}, ${row.owner} meta part, story id, registry item)`);
      }
    }
    report.rows.push({ id: row.id, area: row.area, routes });
  }
  // REQ-SURF-181: from 5.0.0-rc.1 on (or --rc), no 5.0 P0/P1 row is planned.
  const tag = process.env.CI_COMMIT_TAG ?? '';
  if (has('--rc') || /^v5\.0\.0-rc\.\d+$|^v5\.\d+\.\d+$/.test(tag)) {
    for (const row of ledger.rows) {
      if (row.release === '5.0' && (row.priority === 'P0' || row.priority === 'P1') && row.status === 'planned') {
        fail(`${row.id}: 5.0 ${row.priority} row is still planned at rc (deliver or defer to 5.1 by owner decision)`);
      }
    }
  }
  writeEvidence('delivery.json', report);
  console.log(`delivery: ${report.rows.length} delivered row(s) checked against ${src}`);
}

/* ---------- REQ-SURF-184 export budget against the packed exports ---------- */
async function budgetCheck(ledger, src) {
  const packed = await loadPacked(src);
  if (!packed) return;
  const pkgVersion = arg('--pkg-version') ?? packed.version ?? readJson(repoPath('package.json')).version;
  const [pmaj, pmin] = String(pkgVersion).split('.').map(Number);
  const bySub = new Map(packed.entries.map((e) => [e.subpath, new Set(e.exports ?? [])]));
  const root = bySub.get('.')?.size ?? 0;
  let total = 0;
  for (const s of bySub.values()) total += s.size;
  // Ledger-derived vs enumerated: rows whose release has shipped (≤ package
  // version) declare exportDelta; the tarball must carry exactly that many of
  // their names on their subpath.
  let ledgerRoot = 0, ledgerSub = 0, enumRoot = 0, enumSub = 0;
  for (const row of ledger.rows) {
    if (row.status === 'rejected' || !/^5\.\d+$/.test(row.release)) continue;
    const [maj, min] = row.release.split('.').map(Number);
    if (pmaj < maj || (pmaj === maj && pmin < min)) continue;
    ledgerRoot += row.exportDelta?.root ?? 0;
    ledgerSub += row.exportDelta?.subpath ?? 0;
    if (typeof row.subpath !== 'string') continue;
    const set = bySub.get(row.subpath) ?? new Set();
    const n = (row.names ?? []).filter((x) => set.has(x)).length;
    if (row.subpath === '.') enumRoot += n; else enumSub += n;
  }
  const result = { pkgVersion, root, total, ledger: { root: ledgerRoot, subpath: ledgerSub }, enumerated: { root: enumRoot, subpath: enumSub },
    perSubpath: Object.fromEntries([...bySub].map(([k, v]) => [k, v.size])) };
  if (root > ROOT_CEILING) fail(`budget: root value exports ${root} exceed ${ROOT_CEILING}`);
  if (total > TOTAL_CEILING) fail(`budget: total value exports ${total} exceed ${TOTAL_CEILING}`);
  if (ledgerRoot !== enumRoot) fail(`budget: ledger root exportDelta ${ledgerRoot} != enumerated ledger root exports ${enumRoot} (difference ${ledgerRoot - enumRoot})`);
  if (ledgerSub !== enumSub) fail(`budget: ledger subpath exportDelta ${ledgerSub} != enumerated ledger subpath exports ${enumSub} (difference ${ledgerSub - enumSub})`);
  if (has('--ga') || /^v5\.0\.0$/.test(process.env.CI_COMMIT_TAG ?? '')) {
    // 5.1 headroom: ≥1 root slot (OtpField) and ≥4 subpath slots (DateTimePicker,
    // Chart, Waveform, CompareSlider) within the total after the root reservation.
    const rootFree = ROOT_CEILING - root;
    const subFree = TOTAL_CEILING - total - 1;
    result.ga = { rootFree, subFree };
    if (rootFree < 1) fail(`budget --ga: ${rootFree} root slots free, need ≥1`);
    if (subFree < 4) fail(`budget --ga: ${subFree} subpath slots free, need ≥4`);
  }
  writeEvidence('budget.json', result);
  console.log(`budget: root ${root}/${ROOT_CEILING}, total ${total}/${TOTAL_CEILING}, ledger ${ledgerRoot}+${ledgerSub} vs enumerated ${enumRoot}+${enumSub}`);
}

/* ---------- REQ-SURF-182 --report ---------- */
function reportMd(ledger) {
  const live = ledger.rows.filter((r) => r.status !== 'rejected');
  const n = (p) => live.filter((r) => r.priority === p).length;
  const byRel = (rel) => live.filter((r) => r.release === rel).length;
  const pending = live.filter((r) => r.status === 'planned').length;
  const out = [
    '<!-- capability-ledger:totals:start -->',
    `Totals: ${live.length} rows. By priority: P0 ${n('P0')}, P1 ${n('P1')}, P2 ${n('P2')}, P3 ${n('P3')}. ` +
      `By primary release: 5.0 ${byRel('5.0')}, 5.1 ${byRel('5.1')}, 5.2 ${byRel('5.2')}, 5.x/labs ${byRel('5.x')}. ` +
      `${ledger.rows.length - live.length} rejected rows (X-R01..X-R13). ` +
      `Open rows: ${pending}.`,
    '<!-- capability-ledger:totals:end -->',
    '',
    '<!-- capability-ledger:roadmap:start -->',
  ];
  const releases = [...new Set(live.map((r) => r.release))].sort((a, b) => releaseKey(a) - releaseKey(b));
  for (const rel of releases) {
    const rows = live.filter((r) => r.release === rel);
    out.push('', `## ${rel === '5.x' ? '5.x (labs)' : rel}`);
    for (const area of [...new Set(rows.map((r) => r.area))].sort()) {
      out.push('', `### ${area}`, '');
      for (const r of rows.filter((x) => x.area === area)) {
        const where = r.subpath ? ` \`${r.subpath}\`` : '';
        out.push(`- ${r.id} ${r.priority} ${r.owner} (${r.form.join('+')}${where}; ${r.status}): ${r.capability}: ${r.names.map((x) => `\`${x}\``).join(', ')}`);
      }
    }
  }
  out.push('', '<!-- capability-ledger:roadmap:end -->', '');
  return out.join('\n');
}
function releaseNotes(ledger, version) {
  const rel = version.split('.').slice(0, 2).join('.');
  const lines = [`## New capability (${version})`, ''];
  for (const r of ledger.rows) {
    if (r.status !== 'delivered' || r.release !== rel) continue;
    const art = (r.artifacts ?? []).find((a) => a && a.release === rel && ARTIFACT_URL.test(a.url ?? ''));
    if (!art) fail(`${r.id}: listed in release notes without a ${rel} CI job-artifact URL`);
    lines.push(`- **${r.names.join(', ')}** (${r.id}, ${r.owner}): ${r.capability} — [CI artifacts](${art?.url ?? 'MISSING'})`);
  }
  return lines.join('\n') + '\n';
}

/* ---------- --write-budgets ---------- */
function writeBudgets(ledgerPath, ledger) {
  const lines = sizeLines();
  if (!lines) { fail(`write-budgets: ${SIZE_BUDGETS} missing`); return; }
  for (const row of ledger.rows) row.budgetKb = derivedBudgetKb(row, lines);
  writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');
  console.log(`wrote budgetKb on ${ledger.rows.length} rows from ${SIZE_BUDGETS}`);
}

/* ---------- entry ---------- */
const LEDGER_PATH = repoPath(arg('--ledger') ?? LEDGER_REL);
const SCHEMA_PATH = (() => {
  const side = join(dirname(LEDGER_PATH), 'capability-ledger.schema.json');
  return existsSync(side) ? side : repoPath('docs/auraglass-5/capability-ledger.schema.json');
})();
const prdDir = repoPath(arg('--prd-dir') ?? 'docs/auraglass-5/prd');

const ledger = readJson(LEDGER_PATH);
if (has('--write-budgets')) writeBudgets(LEDGER_PATH, ledger);
checkSchema(readJson(SCHEMA_PATH), ledger, '$');
const { rejectedNames } = semanticChecks(ledger, {
  prdDir, eIds: definedEIds(), compLines: competitorsLines(),
  isDefaultLedger: !has('--ledger'),
});
checkRejectedNames(ledger, rejectedNames);

if (has('--diff')) {
  const base = arg('--diff');
  diffGate(ledger, base);
  promotionCheck(ledger, base);
} else if (has('--exports')) {
  exportsDiffCheck(ledger, readJson(repoPath(arg('--exports', 1))), readJson(repoPath(arg('--exports', 2))));
}
if (has('--promotion')) promotionCheck(ledger, null);
if (has('--manifest')) await deliveryCheck(ledger, arg('--manifest'));
if (has('--budget')) await budgetCheck(ledger, arg('--budget'));
if (has('--report')) {
  const kind = arg('--report');
  if (kind === 'md') {
    const out = reportMd(ledger);
    if (has('--check')) {
      const f = repoPath(REPORT_MD);
      const committed = existsSync(f) ? readFileSync(f, 'utf8') : '';
      if (committed !== out) fail(`report: ${REPORT_MD} stale — run --report md --write`);
    } else if (has('--write')) {
      writeFileSync(repoPath(REPORT_MD), out);
      console.log(`wrote ${REPORT_MD}`);
    } else process.stdout.write(out);
  } else if (kind === 'release-notes') {
    const v = arg('--version');
    if (!v) fail('release-notes: --version <x.y.z> required');
    else {
      const notes = releaseNotes(ledger, v);
      if (has('--out')) {
        // Default path is the one PLAT's release-note generator reads (seam REQ-FIN-34).
        const v = arg('--out');
        const out = repoPath(v && !v.startsWith('--') ? v : join(EVIDENCE_DIR, 'new-capability.md'));
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, notes);
        console.log(`wrote ${relative(ROOT, out)}`);
      } else process.stdout.write(notes);
    }
  } else fail(`report: unknown kind ${kind}`);
}

const ms = Number(process.hrtime.bigint() - t0) / 1e6;
if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`);
  console.log(`ledger gate: ${ms.toFixed(0)} ms`);
  process.exit(1);
}
console.log(`capability-ledger: ok`);
console.log(`ledger gate: ${ms.toFixed(0)} ms`);
