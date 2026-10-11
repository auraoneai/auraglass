/* @jest-environment node */
// REQ-FIN-25 (PLAT-010/030): forward-port rule — a merge commit on `next`
// whose non-first parent is a release/4.x commit (not also on main) is a
// prohibited 4.x → next merge; forward-ports are cherry-picks/labels, not merges.
// Fixture: a synthetic repo with a release/4.x → next merge fails; real
// history passes.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const git = (cwd: string, args: string[], env: NodeJS.ProcessEnv = {}) =>
  execFileSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, ...env } });

/* Fail when any non-first parent P of a `git rev-list --merges <next>` commit
   satisfies `merge-base --is-ancestor P <release/4.x>` AND NOT
   `merge-base --is-ancestor P <main>`. Returns the offending merge shas. */
export function findForbiddenMerges(
  cwd: string,
  nextRef = 'next',
  fourXRef = 'release/4.x',
  mainRef = 'main',
): string[] {
  const merges = git(cwd, ['rev-list', '--merges', nextRef])
    .trim()
    .split('\n')
    .filter(Boolean);
  const bad: string[] = [];
  for (const m of merges) {
    const parents = git(cwd, ['rev-list', '--parents', '-1', m]).trim().split(' ');
    for (const p of parents.slice(2)) {
      const on4x = (() => {
        try { git(cwd, ['merge-base', '--is-ancestor', p, fourXRef]); return true; }
        catch { return false; }
      })();
      if (!on4x) continue;
      const onMain = (() => {
        try { git(cwd, ['merge-base', '--is-ancestor', p, mainRef]); return true; }
        catch { return false; }
      })();
      if (!onMain) bad.push(m);
    }
  }
  return bad;
}

describe('no-forward-merge rule', () => {
  it('states the direction + label rule in branch-policy.md', () => {
    const doc = readFileSync('docs/release/branch-policy.md', 'utf8');
    expect(doc).toMatch(/never merge[^*\n]*release\/4\.x/i);
    expect(doc).toMatch(/forward-port/i);
    expect(doc).toContain('2 business days');
  });

  it('fixture repo: a release/4.x → next merge is flagged', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nfm-'));
    git(dir, ['init', '-q']);
    git(dir, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '--allow-empty', '-qm', 'base']);
    git(dir, ['branch', '-M', 'main']);
    git(dir, ['checkout', '-qb', 'next']);
    git(dir, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '--allow-empty', '-qm', 'n1']);
    git(dir, ['checkout', '-qb', 'release/4.x', 'main']);
    git(dir, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '--allow-empty', '-qm', 'x1']);
    git(dir, ['checkout', '-q', 'next']);
    // prohibited: merge release/4.x into next (non-first parent on 4.x, not main)
    git(dir, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'merge', '-q', '--no-ff', 'release/4.x', '-m', 'bad forward merge']);
    const bad = findForbiddenMerges(dir, 'next', 'release/4.x', 'main');
    expect(bad.length).toBe(1);
  });

  it('fixture repo: a main → next merge is allowed (parent is on main too)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nfm-'));
    git(dir, ['init', '-q']);
    git(dir, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '--allow-empty', '-qm', 'base']);
    git(dir, ['branch', '-M', 'main']);
    git(dir, ['checkout', '-qb', 'next']);
    git(dir, ['checkout', '-q', 'main']);
    git(dir, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '--allow-empty', '-qm', 'm1']);
    git(dir, ['checkout', '-q', 'next']);
    git(dir, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'merge', '-q', '--no-ff', 'main', '-m', 'ok main merge']);
    git(dir, ['branch', 'release/4.x', 'main']);
    expect(findForbiddenMerges(dir)).toEqual([]);
  });

  it('real history has no 4.x → next merge', () => {
    try {
      execFileSync('git', ['rev-parse', '--verify', 'origin/next'], { stdio: 'ignore' });
      execFileSync('git', ['rev-parse', '--verify', 'origin/release/4.x'], { stdio: 'ignore' });
      execFileSync('git', ['rev-parse', '--verify', 'origin/main'], { stdio: 'ignore' });
    } catch {
      return; // shallow clone — nothing to assert
    }
    const bad = findForbiddenMerges('.', 'origin/next', 'origin/release/4.x', 'origin/main');
    expect(bad).toEqual([]);
  });
});
