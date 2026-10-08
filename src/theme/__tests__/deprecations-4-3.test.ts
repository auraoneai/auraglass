/** @jest-environment node */
import { describe, test, expect, afterEach, jest } from '@jest/globals';
// MAT-066/067 done-when (DS-107): the kept 4.x names still work at 4.3 (file
// cherry-picked to release/4.x) and each emits its one-time dev warning.
// Jest module registry is fresh per test file, so the warned-once guarantee is
// provable inside this file only.
import { createBrandGlassTheme } from '../createBrandGlassTheme';
import { createBrandTheme } from '../createBrandTheme';
import { createGlassThemeCssVars } from '../createGlassTheme';
import type { GlassTheme } from '../createGlassTheme';

describe('4.3 deprecations (DS-107)', () => {
  afterEach(() => { jest.restoreAllMocks(); });

  test('createBrandGlassTheme warns once and delegates to createBrandTheme', () => {
    const warn = jest.spyOn(console, 'warn');
    const theme = createBrandGlassTheme({ l: 0.62, c: 0.18, h: 255 });
    const again = createBrandGlassTheme({ l: 0.62, c: 0.18, h: 255 });
    const direct = createBrandTheme({ l: 0.62, c: 0.18, h: 255 });
    // createBrandTheme itself warns on accent-step contrast adjustments — the
    // deprecation notice must still fire exactly once across both calls
    const deprecationCalls = warn.mock.calls.filter(([msg]) =>
      String(msg).startsWith('createBrandGlassTheme is deprecated'),
    );
    expect(deprecationCalls).toEqual([
      ['createBrandGlassTheme is deprecated; use createBrandTheme'],
    ]);
    expect(theme).toEqual(direct);
    expect(again).toEqual(direct);
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
