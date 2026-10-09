#!/usr/bin/env node
/* contract:ownership (§3.1, §3.2, §2.4.1, §2.3 sync exemption).
   Usage: node scripts/ci/verify-ownership.mjs [--branch <b>] [--files f1,f2] [--base <ref>]
   CI: derives the stream from the branch prefix (AG_STREAM overrides).

   Rules:
   - next-<s>/  : files must resolve to owner <S> on the 5x table.
   - 4x-<s>/    : release/4.x table — PLAT owns every path except other streams'
                  fragments/{deprecations,codemods}/<s>* and ci/<s>* plus the
                  row-H material bridge (MAT only).
   - contract/  : any non-NONE owner.
   - sync/fragments-deprecations-* : fragments/deprecations/** + src/internal/deprecations.generated.ts
   - sync/fragments-codemods-*     : fragments/codemods/**
   - main, next, release/4.x, or no branch: report only (warn, exit 0).
   - any other branch: fail closed.
   Renames count as the delete+add pair (--no-renames). */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import picomatch from 'picomatch';

const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : null;
};
const branch = opt('branch') ?? process.env.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME ?? '';
const explicit = opt('files')?.split(',').filter(Boolean);

const rows = JSON.parse(readFileSync('contracts/ownership.json', 'utf8')).rows;
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];
const OTHER = (s) => STREAMS.filter((x) => x !== s);
const is = (glob) => picomatch(glob, { dot: true });

const rowH = rows.filter((r) => /^H\d/.test(r.id));
const rowHGlobs = rowH.map((r) => r.glob);

const b = branch.replace(/^refs\/heads\//, '');
const line = b.startsWith('4x-') || b.startsWith('4x11-') || process.env.AG_LINE === '4x' ? '4x' : '5x';

function ownerOf(path) {
  for (const r of rows) {
    if (line === '4x' && !r.lines) continue; // 4x resolves only §2.4.1 rows (H*, 4x-scoped)
    if (r.lines && !r.lines.includes(line)) continue; // row scoped to the other line
    if (is(r.glob)(path)) return r;
  }
  return { id: 'Z01', glob: '**', owner: 'PLAT' };
}

// On 4x, the path zones a non-PLAT stream may touch.
const streamZone = (s, p) =>
  is(`{fragments/{deprecations,codemods}/${s}{.ts,.json,/**},ci/${s}.gitlab-ci.yml,ci/${s}/**}`)(p);
const matZone = (p) => streamZone('mat', p) || rowHGlobs.some((g) => is(g)(p));

let allowed, label;
const m5 = /^next-(plat|mat|cmp|surf|qual)\//.exec(b);
const m4 = /^(?:4x|4x11)-(plat|mat|cmp|surf|qual)\//.exec(b);
const mSync = /^sync\/fragments-(deprecations|codemods)-/.exec(b);
if (process.env.AG_STREAM) {
  const s = process.env.AG_STREAM.toLowerCase();
  allowed =
    line === '4x'
      ? s === 'plat'
        ? (r, p) => !OTHER('plat').some((o) => streamZone(o, p)) && !matZone(p)
        : (r, p) => streamZone(s, p) || (s === 'mat' && rowHGlobs.some((g) => is(g)(p)))
      : (r) => r.owner === s.toUpperCase();
  label = `AG_STREAM=${s}`;
} else if (m5) {
  const s = m5[1].toUpperCase();
  allowed = (r) => r.owner === s;
  label = `stream ${s} (next)`;
} else if (m4) {
  const s = m4[1].toLowerCase();
  allowed =
    s === 'plat'
      ? (r, p) => r.owner !== 'NONE' && !OTHER('plat').some((o) => streamZone(o, p)) && !matZone(p)
      : (r, p) => streamZone(s, p) || (s === 'mat' && rowHGlobs.some((g) => is(g)(p)));
  label = `stream ${s.toUpperCase()} (4x bridge)`;
} else if (b.startsWith('contract/')) {
  allowed = (r) => r.owner !== 'NONE';
  label = 'contract PR';
} else if (mSync) {
  const kind = mSync[1];
  const extra = kind === 'deprecations' ? ['src/internal/deprecations.generated.ts'] : [];
  allowed = (r, p) => is(`fragments/${kind}/**`)(p) || extra.includes(p);
  label = `sync/fragments-${kind}`;
} else if (['main', 'next', 'release/4.x', ''].includes(b)) {
  allowed = () => true;
  label = 'unrestricted branch';
} else {
  allowed = () => false;
  label = `unrecognised branch ${b}`;
}

const base =
  opt('base') ?? process.env.AG_BASE ?? `origin/${process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME ?? 'next'}`;
const files =
  explicit ??
  execFileSync(
    'git',
    ['diff', '--name-only', '--no-renames', '--diff-filter=ACMRD', `${base}...HEAD`],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  )
    .trim()
    .split('\n')
    .filter(Boolean);

const bad = [];
for (const f of files) {
  const r = ownerOf(f);
  if (r.owner === 'NONE' || !allowed(r, f)) {
    const note = r.note ? ` [${r.note}]` : '';
    bad.push(`${f}  -> ${r.owner} (${r.id} ${r.glob})${note}`);
  }
}
if (bad.length) {
  console.error(`contract:ownership FAIL (${label}; ${files.length} files):\n` + bad.join('\n'));
  if (label !== 'unrestricted branch') process.exit(1);
}
console.log(`contract:ownership OK (${label}; ${files.length} files checked)`);
