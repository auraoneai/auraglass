#!/usr/bin/env node
/* PLAT-79: revert dry-run — for each RM-<nn> commit (recorded in
   docs/release/decisions/removals/RM-<nn>.json), `git revert --no-commit`
   in a scratch worktree, run the removal tests, then abort. Proves every
   removal commit is cleanly reversible. Usage:
     node scripts/removal/revert-dry-run.mjs [--family RM-02] [--skip-tests] */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const RECORDS = join(ROOT, 'docs/release/decisions/removals');
const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : null; };
const ONLY = arg('--family');
const SKIP_TESTS = process.argv.includes('--skip-tests');

const git = (args, opts = {}) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts });

// CI clones shallow: a removal commit at the graft boundary has no parent, so
// its revert would "conflict" on every file. Fetch full history first.
if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') {
  execFileSync('git', ['fetch', '--unshallow', '--no-tags', 'origin'], { cwd: ROOT, stdio: 'inherit' });
}

const families = ONLY
  ? [ONLY]
  : readdirSync(RECORDS).filter((f) => /^RM-\d+\.json$/.test(f)).map((f) => f.replace('.json', '')).sort();

let failures = 0;
for (const fam of families) {
  const rec = existsSync(join(RECORDS, `${fam}.json`)) ? JSON.parse(readFileSync(join(RECORDS, `${fam}.json`), 'utf8')) : null;
  const sha = rec?.mergeSha ?? rec?.sha;
  if (!sha || !/^[0-9a-f]{6,40}$/i.test(sha)) { console.log(`${fam}: no merge sha recorded — skipping (record step pending)`); continue; }
  try { git(['cat-file', '-e', `${sha}^{commit}`]); }
  catch { console.log(`${fam}: sha ${sha} not in history — skipping`); continue; }

  const wt = mkdtempSync(join(tmpdir(), `ag-rm-revert-${fam}-`));
  try {
    git(['worktree', 'add', '--detach', wt, 'HEAD']);
    // The scratch worktree has no node_modules; share the checkout's install.
    if (existsSync(join(ROOT, 'node_modules')) && !existsSync(join(wt, 'node_modules')))
      symlinkSync(join(ROOT, 'node_modules'), join(wt, 'node_modules'), 'dir');
    let ok = true;
    try {
      // Directory-rename detection would relocate restored files into later
      // renamed dirs (e.g. legacy/src/tokens -> tokens/legacy/src); a revert
      // restores files at their original paths.
      execFileSync('git', ['-c', 'merge.directoryRenames=false', 'revert', '--no-commit', sha],
        { cwd: wt, stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      // The family's own consumer-grep record (docs/release/decisions/removals/)
      // is evidence written after the removal, not removed code: keep HEAD's copy.
      const unmerged = execFileSync('git', ['diff', '--name-only', '--diff-filter=U'], { cwd: wt, encoding: 'utf8' })
        .split('\n').filter(Boolean);
      const recordOnly = unmerged.length > 0 && unmerged.every((f) => f.startsWith('docs/release/decisions/removals/'));
      if (recordOnly) {
        execFileSync('git', ['checkout', 'HEAD', '--', ...unmerged], { cwd: wt });
        execFileSync('git', ['add', '--', ...unmerged], { cwd: wt });
      } else {
        console.error(`${fam}: revert --no-commit ${sha} conflicts — ${String(e.stderr ?? e.message).split('\n')[0]}${unmerged.length ? ` [${unmerged.join(', ')}]` : ''}`);
        ok = false;
      }
    }
    if (ok && !SKIP_TESTS && existsSync(join(wt, 'tests/removal'))) {
      try {
        execFileSync('npx', ['jest', 'tests/removal', '--passWithNoTests'], { cwd: wt, stdio: 'inherit' });
      } catch {
        console.error(`${fam}: tests/removal failed after revert`); ok = false;
      }
    }
    try { execFileSync('git', ['revert', '--abort'], { cwd: wt }); } catch { execFileSync('git', ['reset', '--hard', 'HEAD'], { cwd: wt }); }
    console.log(`${fam}: ${ok ? 'revert dry-run clean' : 'REVERT DRY-RUN FAILED'}`);
    if (!ok) failures++;
  } finally {
    try { git(['worktree', 'remove', '--force', wt]); } catch { rmSync(wt, { recursive: true, force: true }); }
  }
}
process.exitCode = failures ? 1 : 0;
