#!/usr/bin/env node
/* contract:ownership (§3.1, §3.2, §2.4.1, §2.3 sync exemption). Final logic.
   Usage: node scripts/ci/verify-ownership.mjs [--branch <b>] [--files f1,f2]
   CI: reads AG_STREAM or derives the stream from the branch prefix. */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import picomatch from 'picomatch';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const branch = opt('branch') ?? process.env.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME ?? process.env.GITHUB_HEAD_REF ?? '';
const explicit = opt('files')?.split(',').filter(Boolean);

const owned = JSON.parse(readFileSync('contracts/ownership.json', 'utf8')).rows;
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];
const OTHER = (s) => STREAMS.filter((x) => x !== s);

function ownerOf(path) {
  for (const r of owned) {
    if (line === '5x' && r.lines && !r.lines.includes('5x')) continue;   // 4x-only rows
    if (line === '4x' && !r.lines) continue;                            // 4x uses §2.4.1 rows
    if (picomatch(r.glob, { dot: true })(path)) return r;
  }
  return line === '4x' ? { id: 'Z01-4x', glob: '**', owner: 'PLAT' } : owned[owned.length - 1];
}

const base = opt('base') ?? process.env.AG_BASE ?? `origin/${process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME ?? 'next'}`;
const files = explicit ?? execSync(
  `git diff --name-only --diff-filter=ACMRD ${base}...HEAD`,
  { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

// ---- stream & rules for this branch ----
const b = branch.replace(/^refs\/heads\//, '');
const line = b.startsWith('4x-') || process.env.AG_LINE === '4x' ? '4x' : '5x';
let allowed, label;
const m5 = /^next-(plat|mat|cmp|surf|qual)\//.exec(b);
const m4 = /^4x-(plat|mat|cmp|surf|qual)\//.exec(b);
const mSync = /^sync\/fragments-(deprecations|codemods)-/.exec(b);
if (process.env.AG_STREAM) {
  const s = process.env.AG_STREAM.toLowerCase();
  allowed = (r) => r.owner === s.toUpperCase();
  label = `AG_STREAM=${s}`;
} else if (m5) {
  const s = m5[1].toUpperCase();
  allowed = (r) => r.owner === s;
  label = `stream ${s} (next)`;
} else if (m4) {
  const s = m4[1].toUpperCase();
  const own = (r, p) => r.owner === s &&
    /^(fragments\/(deprecations|codemods)\/|ci\/)/.test(p);
  allowed = s === 'PLAT'
    ? (r, p) => r.owner !== 'NONE' &&
        !OTHER('plat').some((o) => picomatch(`{fragments/{deprecations,codemods}/${o}{.ts,.json,/},ci/${o}.gitlab-ci.yml,ci/${o}/**}`, { dot: true })(p))
    : (r, p) => own(r, p) || (s === 'MAT' && /^src\/(material|styles|styles\/v5|styles\/preview-v5)|^tokens\/compat-alias-map|^tokens\/|^scripts\/tokens\//.test(p));
  label = `stream ${s} (4x bridge)`;
} else if (b.startsWith('contract/')) {
  allowed = (r) => r.owner !== 'NONE';
  label = 'contract PR';
} else if (mSync) {
  const kind = mSync[1];
  const extra = kind === 'deprecations' ? ['src/internal/deprecations.generated.ts'] : [];
  allowed = (r, p) => picomatch(`fragments/${kind}/**`)(p) || extra.includes(p);
  label = `sync/fragments-${kind}`;
} else if (['main', 'next', 'release/4.x'].includes(b) || b === '') {
  allowed = () => true; // direct pushes/unknown: report only
  label = 'unrestricted branch';
} else {
  allowed = () => false;
  label = `unrecognised branch ${b}`;
}

const bad = [];
for (const f of files) {
  const r = ownerOf(f);
  if (r.owner === 'NONE' || !allowed(r, f)) bad.push(`${f}  -> ${r.owner} (${r.id} ${r.glob})`);
}
if (bad.length) {
  console.error(`contract:ownership FAIL (${label}; ${files.length} files):\n` + bad.join('\n'));
  if (!['unrestricted branch'].includes(label)) process.exit(1);
}
console.log(`contract:ownership OK (${label}; ${files.length} files checked)`);
