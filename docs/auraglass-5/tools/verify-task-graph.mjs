#!/usr/bin/env node
// Task-graph validator for docs/auraglass-5/tasks/*.json (contract §7.2 rule 4).
// Run by `contract:ci-fragments` whenever a task fragment changes (REQ-PLAT-04, REQ-FIN-21).
// Usage: node docs/auraglass-5/tools/verify-task-graph.mjs
//
// Checks, per contract §7.2 (replaces archived SC-40):
//   0. every fragment parses as a JSON array; every task has the ledger fields
//      (the same FIELDS build-tasklist.mjs compiles); ids are unique and are
//      `<KEY>-NNN` where KEY is the fragment name.
//   1. `depends_on` holds only existing ids of the task's own stream
//      (^(PLAT|MAT|CMP|SURF|QUAL)-\d{3}$, same prefix). Cross-stream needs go in
//      the contract seam field, never in `depends_on`.
//   2. release ordering (G-nn) is never in `depends_on`; it belongs in `gate`.
//   3/4. every path a task edits is owned by the task's stream according to
//      contracts/ownership.json (first match wins, per line). Paths owned by
//      CONTRACT (contract PR only) or NONE (invalid location) always fail.
//      On release/4.x the §2.4.1 zone rule applies, as in scripts/ci/verify-ownership.mjs.
//
// FIN.json (PRD-F, final completion) is the sixth fragment: its tasks depend only on
// FIN ids; work packages (`lane` FIN-A..H) own disjoint files (PRD-F §4.3 rule 1); the
// stream WPs FIN-C..G resolve through contracts/ownership.json as their stream, and on
// release/4.x through wpTo4xStream in scripts/ci/fin-ownership.json (REQ-FIN-30).
import { createRequire } from 'node:module';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expandBraces, filesOf } from './ownership-table.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const picomatch = createRequire(join(repo, 'package.json'))('picomatch');
const tasksDir = join(repo, 'docs/auraglass-5/tasks');
const readJson = (p) => JSON.parse(readFileSync(join(repo, p), 'utf8'));

const FIELDS = ['id', 'prd', 'lane', 'system', 'file', 'action', 'description', 'depends_on', 'priority', 'test', 'storybook', 'acceptance', 'status'];
const STREAM_KEYS = ['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL'];
const KEYS = [...STREAM_KEYS, 'FIN'];
// The FIN open-REQ ledger is row-scoped bookkeeping: each close-out task edits only its own rows.
const ROW_SCOPED = new Set(['implementation-audit/fin-open-ledger.json']);

const problems = [];
const tasks = [];

// ---------- 0. fragment shape, fields, ids ----------
const fragments = readdirSync(tasksDir).filter((f) => f.endsWith('.json')).sort();
for (const f of fragments) {
  const key = f.replace(/\.json$/, '');
  if (!KEYS.includes(key)) problems.push(`tasks/${f}: unknown fragment (expected one of ${KEYS.join(', ')})`);
  let list;
  try {
    list = JSON.parse(readFileSync(join(tasksDir, f), 'utf8'));
  } catch (e) {
    problems.push(`tasks/${f}: invalid JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(list)) {
    problems.push(`tasks/${f}: not a JSON array`);
    continue;
  }
  list.forEach((t, i) => {
    const label = t?.id ?? `tasks/${f}[${i}]`;
    if (!t || typeof t !== 'object' || Array.isArray(t)) {
      problems.push(`${label}: not an object`);
      return;
    }
    for (const k of FIELDS) if (t[k] === undefined) problems.push(`${label}: missing ${k}`);
    if (typeof t.id === 'string' && !new RegExp(`^${key}-\\d{3}$`).test(t.id)) problems.push(`${t.id}: id is not ${key}-NNN (tasks/${f})`);
    tasks.push({ ...t, _key: key });
  });
}

const byId = new Map();
for (const t of tasks) {
  if (byId.has(t.id)) problems.push(`duplicate id ${t.id}`);
  else byId.set(t.id, t);
}

// ---------- 1 + 2. depends_on stays inside the stream ----------
for (const t of tasks) {
  if (t.depends_on !== undefined && !Array.isArray(t.depends_on)) {
    problems.push(`${t.id}: depends_on is not an array`);
    continue;
  }
  for (const d of t.depends_on ?? []) {
    if (/^G-/.test(d)) {
      problems.push(`${t.id}: depends_on ${d} is a release gate; put it in gate (contract §7.2 rule 2)`);
    } else if (!/^(PLAT|MAT|CMP|SURF|QUAL|FIN)-\d{3}$/.test(d) || d.split('-')[0] !== t._key) {
      problems.push(`${t.id}: depends_on ${d} is not a ${t._key}-NNN id; cross-stream needs go in the contract seam field (contract §7.2 rule 1)`);
    } else if (!byId.has(d)) {
      problems.push(`${t.id}: depends_on unknown ${d} (contract §7.2 rule 1)`);
    } else if (d === t.id) {
      problems.push(`${t.id}: depends on itself`);
    }
  }
}

// ---------- 3 + 4. path ownership (contracts/ownership.json) ----------
const rows = readJson('contracts/ownership.json').rows.map((r) => ({ ...r, test: picomatch(r.glob, { dot: true }) }));
const FIN = readJson('scripts/ci/fin-ownership.json');
const is = (glob) => picomatch(glob, { dot: true });
const rowH = rows.filter((r) => /^H\d/.test(r.id));

// Same resolution as scripts/ci/verify-ownership.mjs ownerOf().
function ownerOf(path, line) {
  for (const r of rows) {
    if (line === '4x' && !r.lines) continue;
    if (r.lines && !r.lines.includes(line)) continue;
    if (r.test(path)) return r;
  }
  return { id: 'Z01', glob: '**', owner: 'PLAT' };
}
// release/4.x zones (contract §2.4.1): PLAT owns everything except the other streams'
// fragments/{deprecations,codemods}/<s>*, ci/<s>* and (for MAT) the row-H bridge.
const streamZone = (s, p) => is(`{fragments/{deprecations,codemods}/${s}{.ts,.json,/**},ci/${s}.gitlab-ci.yml,ci/${s}/**}`)(p);
const inRowH = (p) => rowH.some((r) => r.test(p));
function allowed4x(stream, p) {
  const s = stream.toLowerCase();
  if (s === 'plat') {
    return ownerOf(p, '5x').owner !== 'NONE' && !STREAM_KEYS.filter((x) => x !== 'PLAT').some((o) => streamZone(o.toLowerCase(), p)) && !inRowH(p);
  }
  return streamZone(s, p) || (s === 'mat' && inRowH(p));
}

const linesOf = (t) => {
  const b = String(t.branch ?? 'next');
  if (b === 'both') return ['5x', '4x'];
  const out = [];
  if (/\bnext\b/.test(b)) out.push('5x');
  if (/release\/4\./.test(b)) out.push('4x');
  return out.length ? out : ['5x'];
};
// A file entry may be a glob or a directory; resolve it by a concrete stand-in path.
const concrete = (p) => {
  let c = p.replace(/^\.\//, '');
  if (c.endsWith('/')) c += '__dir__/__any__';
  return c.replace(/\*\*.*$/, '__any__/__any__').replace(/\*/g, '__any__');
};

// FIN tasks: PRD-F §4.3. Rule 1 "one owner per file": a path belongs to exactly one work
// package. The stream WPs FIN-C..G may write only their stream's contracts/ownership.json
// rows; FIN-A (integration), FIN-B (CI) and FIN-H (human records) own explicit cross-stream
// lists (PRD-F §6), so they are bound by disjointness, not by the stream rows.
const FIN_WP_STREAM = { 'FIN-C': 'PLAT', 'FIN-D': 'MAT', 'FIN-E': 'CMP', 'FIN-F': 'SURF', 'FIN-G': 'QUAL' };
const finWriter = new Map();

for (const t of tasks) {
  const fin = t._key === 'FIN';
  if (fin && !/^FIN-[A-H]$/.test(String(t.lane))) {
    problems.push(`${t.id}: lane ${t.lane} is not a FIN work package FIN-A..FIN-H`);
    continue;
  }
  const stream = fin ? FIN_WP_STREAM[t.lane] : t._key;
  for (const entry of filesOf(t.file)) {
    if (fin && ROW_SCOPED.has(entry.replace(/^docs\/auraglass-5\//, ''))) continue;
    for (const line of linesOf(t)) {
      if (fin) {
        const k = `${line}:${entry}`;
        const prev = finWriter.get(k);
        if (prev && prev.lane !== t.lane) problems.push(`${t.id}: ${entry} is also written by ${prev.lane} (${prev.id}) on ${line}; one owner per file (PRD-F §4.3 rule 1)`);
        else if (!prev) finWriter.set(k, t);
      }
    }
    if (!stream) continue;
    for (const path of expandBraces(entry).map(concrete)) {
      for (const line of linesOf(t)) {
        if (line === '5x') {
          const r = ownerOf(path, '5x');
          if (r.owner !== stream) problems.push(`${t.id}: ${entry} is owned by ${r.owner} (${r.id} ${r.glob}) on next, not ${stream}${fin ? ` (${t.lane})` : ''} (contract §7.2 rule 3)`);
        } else {
          const s4 = fin ? FIN.wpTo4xStream[t.lane] : stream;
          if (!allowed4x(s4, path)) problems.push(`${t.id}: ${entry} is outside the ${s4.toUpperCase()} zone on release/4.x (contract §2.4.1, §7.2 rule 3)`);
        }
      }
    }
  }
}

const uniq = [...new Set(problems)];
if (uniq.length) {
  console.error(`verify-task-graph FAIL: ${uniq.length} problem(s) in ${tasks.length} tasks\n` + uniq.join('\n'));
  process.exit(1);
}
console.log(`verify-task-graph OK: ${tasks.length} tasks in ${fragments.length} fragments`);
