/** @jest-environment node */
import { describe, test, expect, afterEach, jest } from '@jest/globals';
// MAT-066/067 done-when (DS-107): the kept 4.x names still work at 4.3 (file
// cherry-picked to release/4.x) and each emits its one-time dev warning.
// Jest module registry is fresh per test file, so the warned-once guarantee is
// provable inside this file only.
// REQ-MAT-16 (FIN-D D.3-12): createBrandGlassTheme lives in src/compat/mat and
// warns through warnDeprecated (DEP-M0969) instead of a bare console.warn.
import { createBrandGlassTheme, CREATE_BRAND_GLASS_THEME_DEP_ID } from '../../compat/mat/createBrandGlassTheme';
import * as compat from '../../compat';
import * as themePublic from '../public';
import { createBrandTheme } from '../createBrandTheme';
import { createGlassThemeCssVars } from '../createGlassTheme';
import type { GlassTheme } from '../createGlassTheme';

describe('4.3 deprecations (DS-107)', () => {
  afterEach(() => { jest.restoreAllMocks(); });

  test('createBrandGlassTheme warns once via warnDeprecated and delegates to createBrandTheme', () => {
    const warn = jest.spyOn(console, 'warn');
    warn.mockImplementation(() => {});
    expect(CREATE_BRAND_GLASS_THEME_DEP_ID).toBe('DEP-M0969');
    const theme = createBrandGlassTheme({ l: 0.62, c: 0.18, h: 255 });
    const again = createBrandGlassTheme({ l: 0.62, c: 0.18, h: 255 });
    const direct = createBrandTheme({ l: 0.62, c: 0.18, h: 255 });
    // createBrandTheme itself warns on accent-step contrast adjustments — the
    // deprecation notice must still fire exactly once across both calls
    const deprecationCalls = warn.mock.calls.filter(([msg]) =>
      String(msg).startsWith('[aura-glass] DEP-M0969'),
    );
    expect(deprecationCalls).toHaveLength(1);
    expect(theme).toEqual(direct);
    expect(again).toEqual(direct);
  });

  test('createBrandGlassTheme ships from aura-glass/compat, not aura-glass/theme', () => {
    expect(compat.createBrandGlassTheme).toBe(createBrandGlassTheme);
    expect('createBrandGlassTheme' in themePublic).toBe(false);
    expect(typeof themePublic.createBrandTheme).toBe('function');
  });

  test('createGlassThemeCssVars warns once and returns the 4.x --glass-theme-* map', () => {
    const warn = jest.spyOn(console, 'warn');
    warn.mockImplementation(() => {});
    // named colors — the literals gate flags hex/rgb() in shipped src
    const theme = {
      tokens: {
        color: {
          canvas: { light: 'ivory', dark: 'black' },
          accent: 'mediumblue',
          onAccent: 'whitesmoke',
        },
        density: { scale: 1 },
      },
    } as unknown as GlassTheme;
    const vars = createGlassThemeCssVars(theme);
    createGlassThemeCssVars(theme);
    const deprecationCalls = warn.mock.calls.filter(([msg]) =>
      String(msg).startsWith('createGlassThemeCssVars is deprecated'),
    );
    expect(deprecationCalls).toEqual([
      ['createGlassThemeCssVars is deprecated; use createGlassTheme(...).vars (--ag-*) instead.'],
    ]);
    expect(vars).toEqual({
      '--glass-theme-brand': 'mediumblue',
      '--glass-theme-accent': 'mediumblue',
      '--glass-theme-background': 'ivory',
      '--glass-theme-surface': 'black',
      '--glass-theme-text': 'whitesmoke',
      '--glass-theme-density-scale': '1',
    });
  });
});
