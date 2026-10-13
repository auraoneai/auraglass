/* @jest-environment node */
/* REQ-PLAT-70: side-effect exceptions are {module, api} pairs with a semver
   expiry — module-only rows no longer whitelist every api, and expiry is a
   real semver compare (5.10.0 > 5.9.0), not a string compare. */
import { describe, expect, it } from '@jest/globals';
// @ts-expect-error -- plain .mjs gate script, no types
import { exceptionState, semverCompare } from '../../scripts/ci/verify-side-effects.mjs';

describe('verify-side-effects exception rules (REQ-PLAT-70)', () => {
  it('semverCompare orders numerically, not lexically', () => {
    expect(semverCompare('5.9.0', '5.10.0')).toBe(-1);
    expect(semverCompare('5.10.0', '5.9.0')).toBe(1);
    expect(semverCompare('v5.0.0', '5.0.0')).toBe(0);
    expect(semverCompare('5.0.0-beta.1', '5.0.0')).toBe(-1);
    expect(semverCompare('not-a-version', '5.0.0')).toBeNull();
  });

  it('module-only rows are invalid and allow nothing', () => {
    const s = exceptionState([{ module: 'dist/x.js', reason: 'r', expires: '9.9.9' }], '5.0.0');
    expect(s.invalid).toHaveLength(1);
    expect(s.allowed({ module: 'dist/x.js', api: 'setInterval' })).toBe(false);
  });

  it('{module, api} pairs allow exactly that api', () => {
    const s = exceptionState([{ module: 'dist/x.js', api: 'setInterval', reason: 'r', expires: '9.9.9' }], '5.0.0');
    expect(s.allowed({ module: 'dist/x.js', api: 'setInterval' })).toBe(true);
    expect(s.allowed({ module: 'dist/x.js', api: 'fetch' })).toBe(false);
    expect(s.allowed({ module: 'dist/y.js', api: 'setInterval' })).toBe(false);
  });

  it('rows past their semver expiry lapse', () => {
    const s = exceptionState([{ module: 'dist/x.js', api: 'fetch', reason: 'r', expires: '5.9.0' }], '5.10.0');
    expect(s.expired).toHaveLength(1);
    expect(s.allowed({ module: 'dist/x.js', api: 'fetch' })).toBe(false);
    const live = exceptionState([{ module: 'dist/x.js', api: 'fetch', reason: 'r', expires: '5.10.0' }], '5.9.0');
    expect(live.expired).toHaveLength(0);
    expect(live.allowed({ module: 'dist/x.js', api: 'fetch' })).toBe(true);
  });

  it('a non-semver expires is invalid, never silently live', () => {
    const s = exceptionState([{ module: 'dist/x.js', api: 'fetch', reason: 'r', expires: 'soon' }], '5.0.0');
    expect(s.invalid).toHaveLength(1);
    expect(s.allowed({ module: 'dist/x.js', api: 'fetch' })).toBe(false);
  });
});
