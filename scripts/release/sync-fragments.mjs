#!/usr/bin/env node
/* sync-fragments.mjs (§2.4.2/§2.4.5 bot sync, PLAT-028/029; REQ-FIN-13 / REQ-PLAT-09).
   Operator-run chore; refuses under GITLAB_CI/CI (no job may hold a GitHub credential).

     --to next        : fragments/deprecations/** flows origin/release/4.x → next
                        (4.x is the source: every 5.0 removal ships its entry in a
                        4.x minor). The aggregate is regenerated with
                        `node scripts/release/gen-deprecations.mjs` (deprecations.json +
                        src/internal/deprecations.generated.ts), never hand-written.
                        Branch: sync/fragments-deprecations-<yyyymmdd>.
     --to release/4.x : fragments/codemods/** flows origin/next → release/4.x
                        (next is the codemods source of truth).
                        Branch: sync/fragments-codemods-<yyyymmdd>.
     --allow-delete <key,…>
                      : the target is overwritten by the source copy, so deletions
                        propagate. When the target holds keys absent on the source
                        (deprecation ids, codemod row keys, file paths) the run
                        refuses with exit 1 and lists them, before touching the
                        checkout, unless every one of them is named here.

   Runs at most once per working day (a same-date remote branch or open PR means skip).
   Exit codes: 0 synced / nothing to do / skipped; 1 refused or failed; 2 usage, CI,
   dirty checkout. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const arg = (n) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] ?? null : null;
};
const to = arg('to');
if (!['next', 'release/4.x'].includes(to ?? '')) {
  console.error('usage: sync-fragments.mjs --to next|release/4.x [--allow-delete <key,…>]');
  process.exit(2);
}
if (process.env.GITLAB_CI === 'true' || process.env.CI === 'true') {
  console.error('sync-fragments: refusing to run under CI (operator-run chore, §2.3)');
  process.exit(2);
}
const allowDelete = new Set((arg('allow-delete') ?? '').split(',').map((x) => x.trim()).filter(Boolean));

const kind = to === 'next' ? 'deprecations' : 'codemods';
const source = to === 'next' ? 'release/4.x' : 'next';
const target = to;
const srcRef = `origin/${source}`;
const tgtRef = `origin/${target}`;
const dir = `fragments/${kind}`;
const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const branch = `sync/fragments-${kind}-${date}`;
const GENERATED = ['deprecations.json', 'src/internal/deprecations.generated.ts'];

const git = (a, opts = {}) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, ...opts });

// A dirty tracked tree would leak into the sync commit through `checkout -B`.
if (git(['status', '--porcelain', '--untracked-files=no']).trim()) {
  console.error('sync-fragments: the checkout has uncommitted tracked changes; commit or stash them first');
  process.exit(2);
}

git(['fetch', '-q', 'origin', source, target]);

// once per working day: an existing remote branch or open PR for today means skip.
const remoteBranch = git(['ls-remote', '--heads', 'origin', branch]).trim();
let prExists = false;
try {
  const prs = execFileSync(
    'gh',
    ['pr', 'list', '--head', branch, '--state', 'open', '--json', 'number'],
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] },
  );
  prExists = JSON.parse(prs || '[]').length > 0;
} catch {
  /* gh unavailable here — the remote-branch check above still applies */
}
if (remoteBranch || prExists) {
  console.log(`sync-fragments: ${branch} already exists — once per working day, skipping`);
  process.exit(0);
}

// ---- keys held by a ref's fragments/<kind>/ (evaluated, not grepped) --------
const listFiles = (ref) =>
  git(['ls-tree', '-r', '--name-only', ref, '--', `${dir}/`]).split('\n').filter(Boolean);

/** Stable identity of every row a fragment holds, so a removed row is visible
    even when the fragment computes its rows (e.g. 4.x plat.ts maps a table). */
function rowKeys(value) {
  const keys = [];
  if (kind === 'deprecations') {
    for (const e of Array.isArray(value) ? value : []) keys.push(String(e?.id));
    return keys;
  }
  const v = value && typeof value === 'object' ? value : {};
  for (const r of v.renames ?? []) keys.push(`renames:${r.fromEntry}:${r.from}`);
  for (const r of v.props ?? []) keys.push(`props:${r.component}.${r.from}`);
  for (const k of Object.keys(v.cssVars ?? {})) keys.push(`cssVars:${k}`);
  for (const r of v.removed ?? []) keys.push(`removed:${r.entry}:${r.symbol}`);
  for (const r of v.deps ?? []) keys.push(`deps:${r.pkg}`);
  for (const r of v.areaTransforms ?? []) keys.push(`areaTransforms:${r.id}`);
  for (const f of v.fixtures ?? []) keys.push(`fixtures:${f}`);
  return keys;
}

async function keysAt(ref) {
  const files = listFiles(ref);
  const keys = new Set(files.map((f) => `file:${f}`));
  if (!files.length) return keys;
  // Materialise the ref's copy in a scratch dir and load it with this checkout's
  // contract loader (S-50), the same loader gen-deprecations uses.
  const scratch = mkdtempSync(join(tmpdir(), 'sync-fragments-'));
  try {
    for (const f of files) {
      mkdirSync(dirname(join(scratch, f)), { recursive: true });
      writeFileSync(join(scratch, f), git(['show', `${ref}:${f}`], { encoding: 'buffer' }));
    }
    const { loadFragments } = await import(pathToFileURL(resolve('src/contracts/load-fragments.mjs')).href);
    for (const { stream, value } of await loadFragments(kind, scratch)) {
      for (const k of rowKeys(value)) keys.add(kind === 'deprecations' ? k : `${stream}:${k}`);
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
  return keys;
}

const sourceKeys = await keysAt(srcRef);
const targetKeys = await keysAt(tgtRef);
const targetOnly = [...targetKeys].filter((k) => !sourceKeys.has(k)).sort();
const refused = targetOnly.filter((k) => !allowDelete.has(k));
if (refused.length) {
  console.error(
    `sync-fragments: refusing — ${refused.length} key(s) on ${tgtRef} absent on ${srcRef} would be deleted:\n  ` +
      refused.join('\n  ') +
      `\nAuthor them on ${source} first, or pass --allow-delete <key,…> to delete them intentionally.`,
  );
  process.exit(1);
}
if (targetOnly.length) console.log(`sync-fragments: deleting (allowed): ${targetOnly.join(', ')}`);

// ---- build the sync commit --------------------------------------------------
let startRef;
try { startRef = git(['symbolic-ref', '-q', '--short', 'HEAD']).trim(); } catch { startRef = git(['rev-parse', 'HEAD']).trim(); }
git(['checkout', '-q', '-B', branch, tgtRef]);
// Propagate deletions: drop the target copy entirely, then take the source copy.
git(['rm', '-r', '-q', '--cached', '--ignore-unmatch', '--', dir]);
rmSync(dir, { recursive: true, force: true });
if (listFiles(srcRef).length) git(['checkout', srcRef, '--', `${dir}/`]);

if (kind === 'deprecations') {
  // The target line's own generator writes the aggregate (byte-equal to
  // `npm run gen:deprecations` on that line).
  execFileSync('node', ['scripts/release/gen-deprecations.mjs'], { stdio: 'inherit' });
  git(['add', '--', ...GENERATED]);
}

const touched = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
const outside = touched.filter(
  (f) => !f.startsWith(`${dir}/`) && !(kind === 'deprecations' && GENERATED.includes(f)),
);
if (outside.length) {
  console.error(`sync-fragments: refusing — the sync would touch paths outside ${dir}/**:\n  ${outside.join('\n  ')}`);
  process.exit(1);
}
if (!touched.length) {
  console.log(`sync-fragments: no changes — ${dir}/ already in sync`);
  git(['checkout', '-q', startRef]);
  git(['branch', '-q', '-D', branch]);
  process.exit(0);
}

const title = `chore(plat): sync ${dir} ${srcRef} → ${target}`;
git(['commit', '-q', '-m', `${title}\n\nGenerated by scripts/release/sync-fragments.mjs (REQ-FIN-13).${
  targetOnly.length ? `\nDeleted (--allow-delete): ${targetOnly.join(', ')}` : ''
}`]);
git(['push', '-q', '-u', 'origin', branch]);
try {
  const out = execFileSync(
    'gh',
    [
      'pr', 'create', '--base', target, '--head', branch, '--title', title,
      '--body', `Automated fragment sync (§2.4.${kind === 'deprecations' ? '2' : '5'}, REQ-FIN-13). Owner review only.`,
    ],
    { encoding: 'utf8' },
  ).trim();
  console.log(`sync-fragments: opened ${out}`);
} catch {
  console.log(`sync-fragments: pushed ${branch}; open the PR manually (gh unavailable here)`);
}
