#!/usr/bin/env node
/* scripts/removal/remove-progress.mjs — PLAT-221 (REQ-PLAT-80).
   For every committed removal record docs/release/decisions/removals/RM-<nn>.json
   that names its merge commit (`sha`), diff the disposition rows between the
   commit's parent and the commit: the rows whose `legacy/<file>` source the
   commit deletes must be exactly the record's `names` (by export token), and
   no other row's source may disappear (no other row changes destination).

     node scripts/removal/remove-progress.mjs [--family RM-02] [--json]

   CI clones shallow; a removal commit at the graft boundary has no parent, so
   full history is fetched first (same rule as revert-dry-run.mjs). */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dispositionsRows } from './consumer-grep.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const RECORDS = 'docs/release/decisions/removals';
const DISPOSITIONS = 'docs/inventory/component-dispositions.md';
const tokenOf = (name) => name.split(/[\s(/]/)[0];

const git = (root, args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });

export function ensureFullHistory(root = ROOT) {
  if (git(root, ['rev-parse', '--is-shallow-repository']).trim() === 'true') {
    execFileSync('git', ['fetch', '--unshallow', '--no-tags', 'origin'], { cwd: root, stdio: 'inherit' });
  }
}

export function loadRecords(root = ROOT) {
  const dir = join(root, RECORDS);
  return readdirSync(dir).filter((f) => /^RM-\d+\.json$/.test(f)).sort()
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
}

const treeFiles = (root, rev) => new Set(git(root, ['ls-tree', '-r', '--name-only', rev]).split('\n').filter(Boolean));

/* rows: parsed dispositions rows; record: { family, sha, names[] }. */
export function familyProgress(root, rows, record) {
  const components = rows.filter((r) => r.dest !== 'note' && r.file);
  const noteTokens = new Set(rows.filter((r) => r.dest === 'note').map((r) => tokenOf(r.name)));
  const before = treeFiles(root, `${record.sha}^`);
  const after = treeFiles(root, record.sha);
  const deleted = [...new Set(components
    .filter((r) => before.has(`legacy/${r.file}`) && !after.has(`legacy/${r.file}`))
    .map((r) => tokenOf(r.name)))].sort();
  const listed = [...new Set((record.names ?? []).filter((n) => !noteTokens.has(n)))].sort();
  return {
    family: record.family,
    sha: record.sha,
    deleted,
    listed,
    unlisted: deleted.filter((n) => !listed.includes(n)),
    notDeleted: listed.filter((n) => !deleted.includes(n)),
  };
}

export function removeProgress(root = ROOT, { family } = {}) {
  ensureFullHistory(root);
  const rows = dispositionsRows(readFileSync(join(root, DISPOSITIONS), 'utf8'));
  return loadRecords(root)
    .filter((r) => r.sha && (!family || r.family === family))
    .map((r) => familyProgress(root, rows, r));
}

function main(argv = process.argv.slice(2)) {
  const i = argv.indexOf('--family');
  const results = removeProgress(ROOT, { family: i >= 0 ? argv[i + 1] : undefined });
  if (argv.includes('--json')) console.log(JSON.stringify(results, null, 2));
  let bad = 0;
  for (const r of results) {
    const ok = r.unlisted.length === 0 && r.notDeleted.length === 0;
    if (!ok) bad++;
    console.error(`${ok ? 'OK  ' : 'FAIL'} ${r.family} ${r.sha}: ${r.deleted.length} records deleted, ${r.listed.length} listed`
      + (r.unlisted.length ? `; deleted but not listed: ${r.unlisted.join(', ')}` : '')
      + (r.notDeleted.length ? `; listed but not deleted: ${r.notDeleted.join(', ')}` : ''));
  }
  if (!existsSync(join(ROOT, RECORDS)) || results.length === 0) { console.error('no RM record with a sha'); process.exit(1); }
  process.exit(bad ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
