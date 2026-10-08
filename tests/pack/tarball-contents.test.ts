/* @jest-environment node */
/* PLAT-297: tarball contents assert — verify-pack.js gates the packed shape. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { ROOT, ensureBuilt, withBuildLock } from '../build/helpers';

describe('tarball contents (PLAT-297)', () => {
  it('verify-pack passes on the current artifact', () => {
    ensureBuilt();
    const out = withBuildLock(() => execFileSync('node', ['scripts/ci/verify-pack.js'], { cwd: ROOT, encoding: 'utf8' }));
    expect(out).toMatch(/verify-pack: \d+ files/);
  }, 240_000);
});
