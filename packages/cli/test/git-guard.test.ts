/** PLAT-303/PLAT-85: writers refuse dirty touched paths; allow flags opt out. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CliError } from '../src/cli/errors.js';
import { assertClean, isGitRepo } from '../src/core/git-guard.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'aggit-'));
const git = (cwd: string, ...args: string[]) => execFileSync('git', args, { cwd, stdio: 'pipe' });
function initRepo(cwd: string): void {
  git(cwd, 'init', '-q');
  git(cwd, 'config', 'user.email', 't@t');
  git(cwd, 'config', 'user.name', 't');
}

describe('git-guard', () => {
  it('isGitRepo detects real repos only', () => {
    const dir = tmp();
    expect(isGitRepo(dir)).toBe(false);
    initRepo(dir);
    expect(isGitRepo(dir)).toBe(true);
  });

  it('refuses non-git without --allow-no-git (exit 3), independent of allowDirty', () => {
    const dir = tmp();
    for (const opts of [{}, { allowDirty: true }]) {
      try {
        assertClean(dir, ['a.ts'], opts);
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(CliError);
        expect((e as CliError).code).toBe(3);
      }
    }
    /* allowNoGit is the opt-out */
    expect(() => assertClean(dir, ['a.ts'], { allowNoGit: true })).not.toThrow();
  });

  it('refuses a dirty touched path (exit 3); clean paths pass', () => {
    const dir = tmp();
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'a.ts'), 'v1\n');
    fs.writeFileSync(path.join(dir, 'b.ts'), 'v1\n');
    git(dir, 'add', '.');
    git(dir, 'commit', '-qm', 'init');
    /* dirty a.ts only */
    fs.writeFileSync(path.join(dir, 'a.ts'), 'v2\n');
    expect(() => assertClean(dir, ['b.ts'], {})).not.toThrow();
    try {
      assertClean(dir, ['a.ts'], {});
      expect.unreachable();
    } catch (e) {
      expect((e as CliError).code).toBe(3);
    }
    /* allowDirty opts out inside a repo */
    expect(() => assertClean(dir, ['a.ts'], { allowDirty: true })).not.toThrow();
  });

  it('untracked touched files count as dirty', () => {
    const dir = tmp();
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'a.ts'), 'v1\n');
    git(dir, 'add', '.');
    git(dir, 'commit', '-qm', 'init');
    fs.writeFileSync(path.join(dir, 'new.ts'), 'x\n');
    try {
      assertClean(dir, ['new.ts'], {});
      expect.unreachable();
    } catch (e) {
      expect((e as CliError).code).toBe(3);
    }
  });
});
