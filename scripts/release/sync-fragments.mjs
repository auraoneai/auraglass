#!/usr/bin/env node
/* sync-fragments.mjs (§2.4.2/§2.4.5 bot sync, PLAT-028/029). Operator-run chore;
   refuses under GITLAB_CI (no job may hold a GitHub credential).
     --to next        : checkout origin/release/4.x's fragments/deprecations/** into
                        this checkout, regenerate src/internal/deprecations.generated.ts,
                        push sync/fragments-deprecations-<yyyymmdd>, open the gh PR.
     --to release/4.x : same for fragments/codemods/** → sync/fragments-codemods-<yyyymmdd>.
   Runs at most once per working day (a same-date branch/PR means skip). */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const to = arg('to');
const allowDelete = new Set((arg('allow-delete') ?? '').split(',').map((x) => x.trim()).filter(Boolean));
if (!['next', 'release/4.x'].includes(to ?? '')) {
  console.error('usage: sync-fragments.mjs --to next|release/4.x');
  process.exit(2);
}
if (process.env.GITLAB_CI === 'true' || process.env.CI === 'true') {
  console.error('sync-fragments: refusing to run under CI (operator-run chore, §2.3)');
  process.exit(2);
}

const kind = to === 'next' ? 'deprecations' : 'codemods';
const srcRef = to === 'next' ? 'origin/release/4.x' : 'origin/next';
const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const branch = `sync/fragments-${kind}-${date}`;
const git = (a, opts = {}) => execFileSync('git', a, { encoding: 'utf8', ...opts });

git(['fetch', 'origin', to === 'next' ? 'release/4.x' : 'next']);

// once per working day: an open branch or PR for today means skip.
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
  /* gh not authenticated — the caller runs this locally where gh exists */
}
if (remoteBranch || prExists) {
  console.log(`sync-fragments: ${branch} already exists — once per working day, skipping`);
  process.exit(0);
}

const target = to === 'next' ? 'next' : 'release/4.x';
git(['checkout', '-B', branch, `origin/${target}`]);

const collectIds = (dir) => {
  const ids = new Set();
  if (!existsSync(dir)) return ids;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.ts')) {
        for (const m of readFileSync(p, 'utf8').matchAll(/\bid:\s*'([^']+)'/g)) ids.add(m[1]);
      }
    }
  };
  walk(dir);
  return ids;
};
const targetIds = collectIds(`fragments/${kind}`);

// propagate deletions: clear the dir in the index, then check out the source copy.
rmSync(`fragments/${kind}`, { recursive: true, force: true });
// 'fragments/' always exists (it holds both kinds); add -A under it so a
// fully-deleted kind dir still stages its deletions.
git(['add', '-A', 'fragments/']);
const srcHasDir = git(['ls-tree', '--name-only', srcRef, `fragments/${kind}/`]).trim().length > 0;
if (srcHasDir) git(['checkout', srcRef, '--', `fragments/${kind}/`]);
// a dir absent on the source means 'delete it' — handled by the refusal below.
const sourceIds = collectIds(`fragments/${kind}`);
const dropped = [...targetIds].filter((id) => !sourceIds.has(id) && !allowDelete.has(id));
if (dropped.length) {
  console.error(
    `sync-fragments: refusing — ${dropped.length} target id(s) absent on ${srcRef}:\n  ` +
    dropped.join('\n  ') +
    `\nPass --allow-delete <id,…> to delete intentionally.`,
  );
  process.exit(1);
}

// regenerate the generated aggregate on the deprecation sync
if (kind === 'deprecations' && existsSync(`fragments/${kind}`)) {
  execFileSync('node', ['scripts/release/gen-deprecations.mjs'], { stdio: 'inherit' });
  git(['add', 'src/internal/deprecations.generated.ts', 'deprecations.json']);
}

const diff = execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' }).trim();
if (!diff) {
  console.log(`sync-fragments: no changes — fragments/${kind}/ already in sync`);
  process.exit(0);
}
git(['commit', '-m', `chore(plat): sync fragments/${kind} ${srcRef} → ${target}\n\nCo-Authored-By: Claude <noreply@anthropic.com>`]);
git(['push', '-u', 'origin', branch]);
try {
  const out = execFileSync(
    'gh',
    [
      'pr', 'create', '--base', target, '--head', branch,
      '--title', `chore(plat): sync fragments/${kind} ${srcRef} → ${target}`,
      '--body', `Automated fragment sync (§2.4.${kind === 'deprecations' ? '2' : '5'}). Owner review only.`,
    ],
    { encoding: 'utf8' },
  ).trim();
  console.log(`sync-fragments: opened ${out}`);
} catch {
  console.log(`sync-fragments: pushed ${branch}; open the PR manually (gh not authenticated here)`);
}
