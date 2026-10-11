/** fs-safety + git-guard (PLAT-303/304). */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ensureInsideCwd, isInsideCwd, atomicWrite, writeProjectFile } from '../src/core/fs-safety.js';
import { isGitRepo, assertClean } from '../src/core/git-guard.js';
import { CliError, EXIT } from '../src/cli/errors.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agsafe-'));

describe('fs-safety', () => {
  it('refuses paths outside cwd with exit 3', () => {
    const dir = tmp();
    expect(() => ensureInsideCwd(dir, '/etc/passwd')).toThrow(CliError);
    try { ensureInsideCwd(dir, '/etc/passwd'); } catch (e) {
      expect((e as CliError).code).toBe(EXIT.safety);
      expect((e as CliError).message).toContain('Refusing to write outside the current project');
    }
  });
  it('isInsideCwd', () => {
    const dir = tmp();
    expect(isInsideCwd(dir, path.join(dir, 'x.ts'))).toBe(true);
    expect(isInsideCwd(dir, '/tmp')).toBe(false);
  });
  it('atomicWrite leaves no temp files', () => {
    const dir = tmp();
    const f = path.join(dir, 'f.txt');
    atomicWrite(dir, 'f.txt', 'hello');
    expect(fs.readFileSync(f, 'utf8')).toBe('hello');
    expect(fs.readdirSync(dir)).toEqual(['f.txt']);
  });
  it('writeProjectFile refuses symlink escapes', () => {
    const dir = tmp();
    const outside = path.join(dir, '..', `outside-${process.pid}.txt`);
    fs.writeFileSync(outside, 'x');
    const link = path.join(dir, 'link.txt');
    fs.symlinkSync(outside, link);
    expect(() => writeProjectFile(dir, 'link.txt', 'y')).toThrow(CliError);
    fs.unlinkSync(outside);
  });
});

describe('git-guard', () => {
  it('isGitRepo false for tmp', () => {
    expect(isGitRepo(tmp())).toBe(false);
  });
  it('assertClean refuses non-repo without --allow-no-git (exit 3)', () => {
    const dir = tmp();
    let threw = false;
    try { assertClean(dir, ['x.ts'], {}); } catch { threw = true; }
    expect(threw).toBe(true);
    expect(() => assertClean(dir, ['x.ts'], { allowNoGit: true })).not.toThrow();
  });
});
