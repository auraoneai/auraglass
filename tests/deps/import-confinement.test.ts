/* @jest-environment node */
/* PLAT-268/270: verify-deps.mjs passes on the emitted artifact. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { ROOT, ensureBuilt } from '../build/helpers';

describe('import confinement (PLAT-270)', () => {
  it('verify-deps passes', () => {
    ensureBuilt();
    const out = execFileSync('node', ['scripts/ci/verify-deps.mjs'], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toMatch(/verify-deps: \d+ deps match allowlist/);
  }, 120_000);
});
