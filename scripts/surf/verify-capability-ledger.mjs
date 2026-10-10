#!/usr/bin/env node
/**
 * verify-capability-ledger.mjs — SURF capability-ledger gate (REQ-SURF-179..186).
 *
 *   node scripts/surf/verify-capability-ledger.mjs [--ledger p] [--prd-dir p]
 *   node scripts/surf/verify-capability-ledger.mjs --diff <base-sha>
 *        [--exports before.json after.json]
 *   node scripts/surf/verify-capability-ledger.mjs --report md [--write|--check]
 *   node scripts/surf/verify-capability-ledger.mjs --report release-notes --version <x.y>
 *   node scripts/surf/verify-capability-ledger.mjs --manifest <exports-manifest.json>
 *
 * Exits 1 naming the offending row on failure. Dependency-free — the JSON
 * Schema subset (type, enum, pattern, required, items, properties,
 * additionalProperties) is checked by an embedded validator; ajv is not a
 * devDependency. Prints `ledger gate: <ms> ms` (must stay ≤3000, REQ-SURF-180).
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const t0 = process.hrtime.bigint();
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const EXP_PRD = 'docs/auraglass-5/archive/v1-19-prd/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md';
const COMPETITORS = 'docs/auraglass-5/research/competitors.md';
const REPORT_MD = 'docs/auraglass-5/capability-ledger.report.md';

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

/* ---------- JSON Schema subset checker (REQ-SURF-180) ---------- */
function checkSchema(schema, value, path) {
  if (schema === true) return;
  if (schema.type) {
    const ok =
      (schema.type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) ||
      (schema.type === 'array' && Array.isArray(value)) ||
      (schema.type === 'string' && typeof value === 'string') ||
      (schema.type === 'integer' && Number.isInteger(value)) ||
      (schema.type === 'boolean' && typeof value === 'boolean');
    if (!ok) return fail(`${path}: expected ${schema.type}`);
  }
  if (schema.enum && !schema.enum.includes(value)) {
    return fail(`${path}: ${JSON.stringify(value)} not in ${schema.enum.join('|')}`);
  }
  if (schema.pattern && !(typeof value === 'string' && new RegExp(schema.pattern).test(value))) {
    return fail(`${path}: ${JSON.stringify(value)} fails ${schema.pattern}`);
  }
  if (schema.type === 'object' && value && typeof value === 'object') {
    for (const k of schema.required ?? []) if (!(k in value)) fail(`${path}: missing "${k}"`);
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const k of Object.keys(value)) if (!allowed.has(k)) fail(`${path}: unknown key "${k}"`);
    }
    for (const [k, sub] of Object.entries(schema.properties ?? {})) {
      if (k in value) checkSchema(sub, value[k], `${path}.${k}`);
    }
  }
  if (schema.type === 'array' && Array.isArray(value)) {
    value.forEach((it, i) => checkSchema(schema.items ?? true, it, `${path}[${i}]`));
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

/* ---------- semantic checks (REQ-SURF-180/-184/-185/-186) ---------- */
function semanticChecks(ledger, { prdDir, eIds, compLines, isDefaultLedger }) {
  const seen = new Set();
  const rejectedNames = new Map(); // lowercase name -> {id, capability}
  let exportRoot = 0, exportSub = 0, nonRejected = 0, rejected = 0;
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
    exportRoot += row.exportDelta?.root ?? 0;
    exportSub += row.exportDelta?.subpath ?? 0;
  }
  // Aggregate invariants (58 + 13 rows, export-budget ceilings) bind the real
  // ledger; fixture ledgers under --ledger exercise row-level defects only.
  if (isDefaultLedger) {
    if (nonRejected !== 58) fail(`ledger: expected 58 non-rejected rows, got ${nonRejected}`);
    if (rejected !== 13) fail(`ledger: expected 13 rejected rows, got ${rejected}`);
    if (exportRoot > 160) fail(`ledger: sum(exportDelta.root)=${exportRoot} exceeds 160`);
    if (exportRoot + exportSub > 250) fail(`ledger: sum(exportDelta)=${exportRoot + exportSub} exceeds 250`);
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

/* ---------- REQ-SURF-183 --diff gate ---------- */
function diffGate(baseSha) {
  let changed;
  try {
    changed = execSync(`git diff --name-only ${baseSha}...HEAD`, { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter(Boolean);
  } catch (e) {
    fail(`diff: cannot diff ${baseSha}...HEAD: ${e.message.split('\n')[0]}`);
    return;
  }
  const ledgerChanged = changed.includes('docs/auraglass-5/capability-ledger.json');
  // Registry blocks/items and labs residents added in this diff must be a
  // names entry of a row whose JSON changed in the same diff.
  const idOf = (p) => {
    const m = /^registry\/(?:blocks|items)\/([^/]+)\//.exec(p) ?? /^packages\/labs\/src\/([^/]+)\//.exec(p);
    return m ? m[1] : null;
  };
  // Only entries that did not exist at <base> are "added"; editing a file of an
  // existing entry (e.g. a story's parameters) needs no ledger change.
  const dirOf = (p) => (/^(registry\/(?:blocks|items)\/[^/]+)\//.exec(p) ?? /^(packages\/labs\/src\/[^/]+)\//.exec(p))?.[1];
  const existedAtBase = (dir) => {
    try {
      execSync(`git cat-file -e ${baseSha}:${dir}`, { cwd: ROOT, stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  };
  const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const newIds = [...new Set(changed.filter((p) => idOf(p) && !existedAtBase(dirOf(p))).map(idOf))];
  if (newIds.length) {
    let namesInChangedRows = new Set();
    if (ledgerChanged) {
      const ledger = readJson(LEDGER_PATH);
      let baseLedger = null;
      try {
        baseLedger = JSON.parse(execSync(`git show ${baseSha}:docs/auraglass-5/capability-ledger.json`, { cwd: ROOT, encoding: 'utf8' }));
      } catch { /* base had no ledger */ }
      const baseById = new Map((baseLedger?.rows ?? []).map((r) => [r.id, JSON.stringify(r)]));
      for (const r of ledger.rows) {
        if (JSON.stringify(r) !== baseById.get(r.id)) {
          for (const n of r.names ?? []) namesInChangedRows.add(kebab(n));
        }
      }
    }
    for (const id of newIds) {
      if (!namesInChangedRows.has(id.toLowerCase())) {
        fail(`diff: registry/labs entry ${id} added without a matching ledger row change`);
      }
    }
  }
  // Value exports: --exports before.json after.json ({subpath: [names]}).
  if (has('--exports')) {
    exportsDiffCheck(ledger, repoPath(arg('--exports', 1)), repoPath(arg('--exports', 2)));
  } else {
    console.log('exports diff not evaluated (no --exports)');
  }
}

/* Value exports added between two snapshots must be a name in some ledger row
 * (REQ-SURF-183). Snapshot shape: { "<subpath>": ["<name>", ...] }.
 * Runs under --diff in CI and standalone for fixtures/tests. */
function exportsDiffCheck(ledger, beforePath, afterPath) {
  const before = readJson(beforePath);
  const after = readJson(afterPath);
  const allNames = new Set();
  for (const r of ledger.rows) {
    if (r.status !== 'rejected') for (const n of r.names ?? []) allNames.add(String(n).toLowerCase());
  }
  for (const [sub, names] of Object.entries(after)) {
    const beforeSet = new Set((before[sub] ?? []).map((n) => n.toLowerCase()));
    for (const n of names) {
      if (!beforeSet.has(n.toLowerCase()) && !allNames.has(n.toLowerCase())) {
        fail(`export ${n} (${sub}) added without a ledger row`);
      }
    }
  }
}

/* ---------- REQ-SURF-184 promotion gate ---------- */
// Base ledger comes from `git show <base-sha>:...ledger.json` under --diff, or
// from a file passed to --promotion (used by the promotion-9/-10 fixtures).
function promotionCheck(baseSha) {
  let baseLedger = null;
  if (has('--promotion')) {
    baseLedger = readJson(repoPath(arg('--promotion')));
  } else if (baseSha) {
    try {
      baseLedger = JSON.parse(execSync(`git show ${baseSha}:docs/auraglass-5/capability-ledger.json`, { cwd: ROOT, encoding: 'utf8' }));
    } catch { return; }
  } else return;
  const baseById = new Map(baseLedger.rows.map((r) => [r.id, r]));
  for (const row of readJson(LEDGER_PATH).rows) {
    const was = baseById.get(row.id);
    if (!was) continue;
    const promoted = row.form.includes('export') &&
      (was.form.includes('registry-item') || was.form.includes('registry-block')) &&
      !was.form.includes('export');
    if (!promoted) continue;
    const delta = (row.exportDelta?.root ?? 0) + (row.exportDelta?.subpath ?? 0);
    if (delta <= 0) fail(`${row.id}: promoted to export but exportDelta is 0`);
    if (!row.subpath) fail(`${row.id}: promoted to export but subpath is unset`);
    const urls = new Set((row.demand ?? []).filter((u) => DEMAND_URL.test(u)));
    if (urls.size < 10) fail(`${row.id}: promotion needs ≥10 distinct demand links, has ${urls.size}`);
  }
}

/* ---------- REQ-SURF-181 delivery check (L2, packed manifest) ---------- */
function deliveryCheck(manifestPath) {
  const f = repoPath(manifestPath);
  if (!existsSync(f)) {
    console.log(`delivery: ${manifestPath} not present — skipped (offline)`);
    return;
  }
  const manifest = readJson(f);
  const pkgVersion = arg('--pkg-version') ?? readJson(repoPath('package.json')).version;
  const exportsByEntry = new Map();
  for (const e of manifest.entries ?? []) {
    exportsByEntry.set(e.subpath, new Set(e.exports ?? []));
  }
  for (const row of readJson(LEDGER_PATH).rows) {
    if (row.status !== 'delivered' || !/^5\.\d+$/.test(row.release)) continue;
    const [maj, min] = row.release.split('.').map(Number);
    const [pmaj, pmin] = pkgVersion.split('.').map(Number);
    if (pmaj < maj || (pmaj === maj && pmin < min)) continue;
    const set = exportsByEntry.get(row.subpath ?? '.') ?? new Set();
    for (const name of row.names ?? []) {
      const ok = set.has(name) || [...set].some((s) => s.startsWith(`${name}.`));
      if (!ok) fail(`${row.id}: delivered name ${name} missing from manifest entry ${row.subpath ?? '.'}`);
    }
  }
}

/* ---------- REQ-SURF-182 --report ---------- */
function reportMd(ledger) {
  const live = ledger.rows.filter((r) => r.status !== 'rejected');
  const n = (p) => live.filter((r) => r.priority === p).length;
  const byRel = (rel) => live.filter((r) => r.release === rel).length;
  const pending = live.filter((r) => r.status === 'planned').length;
  return [
    '<!-- capability-ledger:totals:start -->',
    `Totals: ${live.length} rows. By priority: P0 ${n('P0')}, P1 ${n('P1')}, P2 ${n('P2')}, P3 ${n('P3')}. ` +
      `By primary release: 5.0 ${byRel('5.0')}, 5.1 ${byRel('5.1')}, 5.2 ${byRel('5.2')}, 5.x/labs ${byRel('5.x')}. ` +
      `${ledger.rows.length - live.length} rejected rows (X-R01..X-R13). ` +
      `Open rows: ${pending}.`,
    '<!-- capability-ledger:totals:end -->',
    '',
  ].join('\n');
}
function releaseNotes(ledger, version) {
  const rel = version.replace(/\.\d+$/, '');
  const lines = [`## New capability (${version})`, ''];
  for (const r of ledger.rows) {
    if (r.status !== 'delivered' || r.release !== rel) continue;
    const url = (r.artifacts ?? []).find((a) => a.includes(rel));
    if (!url) fail(`${r.id}: listed in release notes without a ${rel} CI artifact URL`);
    lines.push(`- **${r.names.join(', ')}** (${r.id}, ${r.owner}): ${r.capability} — [CI run](${url ?? 'MISSING'})`);
  }
  return lines.join('\n') + '\n';
}

function readJson(p) { return JSON.parse(readFileSync(p, 'utf8')); }

/* ---------- entry ---------- */
const LEDGER_PATH = repoPath(arg('--ledger') ?? 'docs/auraglass-5/capability-ledger.json');
const SCHEMA_PATH = (() => {
  const side = join(dirname(LEDGER_PATH), 'capability-ledger.schema.json');
  return existsSync(side) ? side : repoPath('docs/auraglass-5/capability-ledger.schema.json');
})();
const prdDir = repoPath(arg('--prd-dir') ?? 'docs/auraglass-5/prd');

const ledger = readJson(LEDGER_PATH);
checkSchema(readJson(SCHEMA_PATH), ledger, '$');
const { rejectedNames } = semanticChecks(ledger, {
  prdDir, eIds: definedEIds(), compLines: competitorsLines(),
  isDefaultLedger: !has('--ledger'),
});
checkRejectedNames(ledger, rejectedNames);

const base = arg('--diff');
if (has('--diff')) {
  diffGate(base);
  promotionCheck(base);
} else if (has('--exports')) {
  exportsDiffCheck(ledger, repoPath(arg('--exports', 1)), repoPath(arg('--exports', 2)));
}
if (has('--promotion')) promotionCheck(null);
if (has('--manifest')) deliveryCheck(arg('--manifest'));
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
    if (!v) fail('release-notes: --version <x.y> required');
    else process.stdout.write(releaseNotes(ledger, v));
  }
}

const ms = Number(process.hrtime.bigint() - t0) / 1e6;
if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`);
  console.log(`ledger gate: ${ms.toFixed(0)} ms`);
  process.exit(1);
}
console.log(`capability-ledger: ok`);
console.log(`ledger gate: ${ms.toFixed(0)} ms`);
