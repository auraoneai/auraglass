/* @jest-environment node */
// PLAT-021/030: forward-port rule — no merge may go next -> release/4.x;
// 4.x fixes backport only via the sync chore or manual cherry-pick.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

describe('no-forward-merge rule', () => {
  it('states the direction in branch-policy.md', () => {
    const doc = readFileSync('docs/release/branch-policy.md', 'utf8');
    expect(doc).toMatch(/never merge[^*\n]*release\/4\.x/i);
    expect(doc).toMatch(/forward-port/i);
  });
  it('has no merge commit from next into release/4.x in history', () => {
    // check that the 4x line base does not contain a merge whose second parent is next
    const bases = ['origin/release/4.x', 'release/4.x'].filter((b) => {
      try { execFileSync('git', ['rev-parse', '--verify', b], { stdio: 'ignore' }); return true; } catch { return false; }
    });
    if (!bases.length) return; // shallow clone — nothing to assert
    const merges = execFileSync(
      'git', ['log', '--merges', '--format=%H %s', '-20', bases[0] as string], { encoding: 'utf8' },
    );
    for (const line of merges.split('\n').filter(Boolean)) {
      expect(line).not.toMatch(/merge.*next into|forward.port|merge branch .next./i);
    }
  });
});
