/* @jest-environment node */
// REQ-PLAT-14 / PLAT-036: the PRD dist-tag cases verbatim, run through the CLI
// (the 4.x jest transform cannot import .mjs directly).
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';

const run = (args: string[]): { code: number; out: string } => {
  try {
    const out = execFileSync('node', ['scripts/release/dist-tag.mjs', ...args], {
      encoding: 'utf8',
    });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('dist-tag.mjs', () => {
  it.each([
    ['5.0.0-alpha.3', 'next'],
    ['5.0.0-beta.1', 'next'],
    ['5.0.0-rc.2', 'next'],
    ['4.9.9', 'latest'], // pre-GA: 4.x stable -> latest
    ['5.0.0', 'latest'],
    ['v5.0.0', 'latest'],
  ])('%s -> %s', (v, want) => {
    const r = run([v]);
    expect(r.code).toBe(0);
    expect(r.out.trim()).toBe(want);
  });
  it('4.x stable -> AG_V4_DIST_TAG post-GA (--ga true --v4-dist-tag v4-lts)', () => {
    const r = run(['4.9.9', '--ga', 'true', '--v4-dist-tag', 'v4-lts']);
    expect(r.out.trim()).toBe('v4-lts');
  });
  it('throws for non-semver', () => {
    for (const v of ['3.9.9', 'not-a-version']) {
      const r = run([v]);
      expect(r.code).toBe(1);
      expect(r.out).toContain('dist-tag:');
    }
  });
});
