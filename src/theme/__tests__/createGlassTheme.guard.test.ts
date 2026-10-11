/* REQ-MAT-02 / REQ-FIN-50 (D.3-04): createGlassTheme output never defines a
   material.* or private --_ag-* key — over every preset, mode, density, contrast,
   radius scale and brand-colour syntax. */
import { describe, expect, it } from '@jest/globals';
import { createGlassTheme, type CreateGlassThemeOptions } from '../createGlassTheme';
import { presets, type PresetId } from '../presets';

const PRESET_IDS = Object.keys(presets) as PresetId[];
const MODES: NonNullable<CreateGlassThemeOptions['mode']>[] = ['light', 'dark', 'system', 'high-contrast'];
const DENSITIES: NonNullable<CreateGlassThemeOptions['density']>[] = ['compact', 'comfortable', 'spacious'];
const CONTRASTS: NonNullable<CreateGlassThemeOptions['contrast']>[] = ['standard', 'more'];
const RADIUS_SCALES = [0.75, 1, 1.25];
// a failing on-accent brand (#ffff00) exercises the adjusted path too
const BRANDS: Array<string | undefined> = [undefined, '#ffff00', 'rgb(59 130 246)', 'hsl(340 80% 45%)', 'oklch(0.6 0.15 250)'];

const combos: CreateGlassThemeOptions[] = [];
for (const preset of PRESET_IDS)
  for (const mode of MODES)
    for (const density of DENSITIES)
      for (const contrast of CONTRASTS)
        for (const radiusScale of RADIUS_SCALES)
          for (const brandColor of BRANDS)
            combos.push({ id: 'guard-theme', preset, mode, density, contrast, radiusScale, brandColor, neutralHue: 200 });

describe('createGlassTheme guard (REQ-MAT-02)', () => {
  it('covers all four presets', () => {
    expect(PRESET_IDS.sort()).toEqual(['aura', 'daylight', 'graphite', 'midnight']);
    expect(combos.length).toBe(4 * 4 * 3 * 2 * 3 * 5);
  });

  it('vars keys and cssText contain no material and no --_ag- for every option combination', () => {
    const offending: string[] = [];
    for (const opts of combos) {
      const theme = createGlassTheme(opts);
      const keys = Object.keys(theme.vars);
      expect(keys.length).toBeGreaterThan(0);
      for (const k of keys) {
        if (/material/i.test(k) || k.includes('--_ag-') || !k.startsWith('--ag-')) offending.push(`${JSON.stringify(opts)} key ${k}`);
      }
      for (const v of Object.values(theme.vars))
        if (/material/i.test(v) || v.includes('--_ag-')) offending.push(`${JSON.stringify(opts)} value ${v}`);
      if (/material/i.test(theme.cssText) || theme.cssText.includes('--_ag-'))
        offending.push(`${JSON.stringify(opts)} cssText ${theme.cssText}`);
    }
    expect(offending).toEqual([]);
  });

  it('the default theme is covered too', () => {
    const theme = createGlassTheme();
    expect(Object.keys(theme.vars).some((k) => /material|--_ag-/.test(k))).toBe(false);
    expect(theme.cssText).not.toMatch(/material|--_ag-/);
  });
});
