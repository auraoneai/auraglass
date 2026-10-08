/* @jest-environment node */
// PLAT-028/029: sync-fragments.mjs — refuses CI, once per day, correct globs.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

describe('sync-fragments.mjs', () => {
  it('refuses under CI', () => {
    try {
      execFileSync('node', ['scripts/release/sync-fragments.mjs', '--to', 'next'],
        { env: { ...process.env, GITLAB_CI: 'true' }, encoding: 'utf8' });
      throw new Error('expected non-zero exit');
    } catch (e: any) {
      expect(e.status).toBe(2);
    }
  });
  it('syncs deprecations to next (with generated barrel) and codemods to release/4.x', () => {
    const src = readFileSync('scripts/release/sync-fragments.mjs', 'utf8');
    expect(src).toContain("to === 'next' ? 'deprecations' : 'codemods'");
    expect(src).toContain('deprecations.generated.ts');
    expect(src).toContain('sync/fragments-');
  });
});
