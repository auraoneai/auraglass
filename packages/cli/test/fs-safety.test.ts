/** PLAT-303/PLAT-85: realpath both-sides + containment; every escape is exit 3. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CliError } from '../src/cli/errors.js';
import { atomicWrite, ensureInsideCwd, isInsideCwd, realpath } from '../src/core/fs-safety.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agfs-'));

describe('fs-safety', () => {
  it('rejects ../x escapes with exit 3', () => {
    const dir = tmp();
    try {
      atomicWrite(dir, '../x.txt', 'evil');
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(CliError);
      expect((e as CliError).code).toBe(3);
    }
    expect(fs.existsSync(path.join(dir, '..', 'x.txt'))).toBe(false);
  });

  it('rejects absolute paths outside cwd', () => {
    const dir = tmp();
    const outside = path.join(tmp(), 'abs.ts');
    try {
      ensureInsideCwd(dir, outside);
      expect.unreachable();
    } catch (e) {
      expect((e as CliError).code).toBe(3);
    }
  });

  it('rejects nested symlink escape: link/new/f.ts where link -> /tmp', () => {
    const dir = tmp();
    const link = path.join(dir, 'link');
    fs.symlinkSync(os.tmpdir(), link);
    try {
      atomicWrite(dir, 'link/new/f.ts', 'evil');
      expect.unreachable();
    } catch (e) {
      expect((e as CliError).code).toBe(3);
    }
    /* nothing created in tmp via the link */
    expect(fs.existsSync(path.join(os.tmpdir(), 'new', 'f.ts'))).toBe(false);
  });

  it('rejects --out ../ style targets', () => {
    const dir = tmp();
    try {
      atomicWrite(dir, path.join('..', 'out-file'), 'evil');
      expect.unreachable();
    } catch (e) {
      expect((e as CliError).code).toBe(3);
    }
  });

  it('writes inside cwd succeed, incl. inside real subdirs', () => {
    const dir = tmp();
    atomicWrite(dir, 'deep/nested/f.ts', 'ok');
    expect(fs.readFileSync(path.join(dir, 'deep/nested/f.ts'), 'utf8')).toBe('ok');
    expect(isInsideCwd(dir, path.join(dir, 'deep/nested/f.ts'))).toBe(true);
  });

  it('realpath resolves the nearest existing ancestor through a symlink', () => {
    const dir = tmp();
    const inner = tmp();
    fs.symlinkSync(inner, path.join(dir, 'link'));
    const resolved = realpath(path.join(dir, 'link', 'new', 'f.ts'));
    expect(resolved).toBe(path.join(fs.realpathSync(inner), 'new', 'f.ts'));
  });
});
