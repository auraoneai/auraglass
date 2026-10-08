/* @jest-environment node */
// PLAT-050: verify-branch-protection.mjs is read-only and refuses CI.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

describe('verify-branch-protection.mjs', () => {
  it('refuses to run under CI', () => {
    try {
      execFileSync('node', ['scripts/release/verify-branch-protection.mjs'],
        { env: { ...process.env, GITLAB_CI: 'true' }, encoding: 'utf8' });
      throw new Error('expected non-zero exit');
    } catch (e: any) {
      expect(e.status).toBe(2);
      expect(`${e.stdout}${e.stderr}`).toContain('never run under CI');
    }
  });
  it('issues only read-only gh api calls', () => {
    const src = readFileSync('scripts/release/verify-branch-protection.mjs', 'utf8');
    expect(src).not.toMatch(/gh\s+(api\s+(-X|--method)\s+(PUT|POST|PATCH|DELETE))/);
    expect(src).toContain('protection');
  });
});
