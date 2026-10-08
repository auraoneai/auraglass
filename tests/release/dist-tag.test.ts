/* @jest-environment node */
// REQ-PLAT-14 / PLAT-036: the PRD dist-tag cases verbatim.
import { describe, expect, it } from '@jest/globals';
import { distTagFor } from '../../scripts/release/dist-tag.mjs';

describe('distTagFor', () => {
  const v4 = { v4DistTag: 'v4-lts' };
  it.each([
    ['5.0.0-alpha.3', {}, 'next'],
    ['5.0.0-beta.1', {}, 'next'],
    ['4.9.9', {}, 'latest'],            // pre-GA: 4.x stable -> latest
    ['4.9.9', { v4DistTag: 'v4-lts', ga5: true }, 'v4-lts'], // post-GA
    ['5.0.0', {}, 'latest'],
    ['v5.0.0', {}, 'latest'],
  ])('%s -> %s', (v, opts, want) => {
    expect(distTagFor(v, { ...v4, ...(opts as object) })).toBe(want);
  });
  it('throws for non-semver', () => {
    expect(() => distTagFor('3.9.9', {})).toThrow();
    expect(() => distTagFor('not-a-version', {})).toThrow();
  });
});
