/* REQ-MAT-45 (MAT-45, D.3-27): the 4.x createGlassTheme `motionPolicy` option
   lives only in aura-glass/compat. It keeps the REQ-MAT-15 4.x mapping on
   tokens.motion, warns once at call time with DEP-M0902, never at import, and
   without the option the compat result equals the 5.0 theme. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { createGlassTheme } from '../createGlassTheme';
import * as compatMat from '../index';
import { createGlassTheme as createGlassTheme5 } from '../../../theme/createGlassTheme';

afterEach(() => jest.restoreAllMocks());

describe('compat createGlassTheme motionPolicy (DEP-M0902)', () => {
  it('is exported from src/compat/mat', () => {
    expect(compatMat.createGlassTheme).toBe(createGlassTheme);
  });

  it('warns DEP-M0902 exactly once at call time, never at import', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(warn).not.toHaveBeenCalled();
    createGlassTheme({ motionPolicy: 'reduced' });
    createGlassTheme({ motionPolicy: 'none' });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]![0])).toContain('DEP-M0902');
  });

  it.each([
    ['system', { axis: 'system', allowContinuous: false }],
    ['reduced', { axis: 'calm', allowContinuous: false }],
    ['expressive', { axis: 'full', allowContinuous: true }],
    ['none', { axis: 'none', allowContinuous: false }],
  ] as const)('maps motionPolicy %s to the 4.x motion tokens', (policy, expected) => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(createGlassTheme({ motionPolicy: policy }).tokens.motion).toEqual(expected);
  });

  it('without motionPolicy equals the 5.0 theme and does not warn', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const opts = { id: 'c1', preset: 'midnight', density: 'compact', mode: 'dark' } as const;
    expect(createGlassTheme(opts)).toEqual(createGlassTheme5(opts));
    expect(warn).not.toHaveBeenCalled();
  });

  it('only tokens.motion differs from the 5.0 theme when motionPolicy is set', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const base = createGlassTheme5({ id: 'c2' });
    const compat = createGlassTheme({ id: 'c2', motionPolicy: 'expressive' });
    expect({ ...compat, tokens: { ...compat.tokens, motion: base.tokens.motion } }).toEqual(base);
    expect(base.tokens.motion).toEqual({ axis: 'system', allowContinuous: false });
  });
});
