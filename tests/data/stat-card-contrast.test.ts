/** @jest-environment node */
// REQ-SURF-90: StatCard delta intent colours, computed from BUILT CSS
// (tests/data/helpers/built-css.ts: AG_BUILT_CSS_DIR or a local
// tokens:build + assembleBundle/lowerCss of data.css and material.css).
//
// For light and dark it resolves the success/danger delta colours inside
// .ag-stat-card (light-dark() arm, relative oklch(from var(--ag-color-*) …))
// and the content-raised fill, then asserts:
//   - each delta rule's `color` reads the private intent property
//   - each colour derives from the public S-03 --ag-color-success/danger only
//   - every colour is inside sRGB and >= 4.5:1 against content-raised
//   - the @supports-not(light-dark) fallback blocks carry the same arms
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import {
  type BuiltCss, SCHEMES, NO_COND, SUPPORTS_NO_LIGHT_DARK, MEDIA_DARK,
  callArgs, contentRaised, contrastRatio, declsOf, evalColor, inGamut, loadBuiltCss, round, splitArgs, srgb, tokenVars,
} from './helpers/built-css';

const INTENTS = [
  { intent: 'success', prop: '--_ag-stat-card-success', source: '--ag-color-success' },
  { intent: 'danger', prop: '--_ag-stat-card-danger', source: '--ag-color-danger' },
] as const;

let css: BuiltCss;
beforeAll(async () => { css = await loadBuiltCss('ag-stat-card-contrast-'); }, 120_000);
afterAll(() => css?.cleanup());

const root = () => declsOf(css.data, '.ag-stat-card', { noHeaders: NO_COND });

describe('StatCard delta colours from built CSS (REQ-SURF-90)', () => {
  it.each(INTENTS)('$intent delta colour reads $prop, derived from $source only', ({ intent, prop, source }) => {
    const rule = declsOf(css.data, `.ag-stat-card__delta[data-ag-intent=${intent}]`, { noHeaders: NO_COND, all: true });
    expect(rule['color']?.replace(/\s+/g, '')).toBe(`var(${prop})`);
    const decl = root()[prop];
    expect(decl).toBeDefined();
    const refs = [...decl!.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]);
    expect(refs).toEqual([source, source]);
  });

  it.each(SCHEMES)('%s: every delta colour is inside sRGB and >= 4.5:1 against content-raised', (scheme) => {
    const vars = tokenVars(css);
    const bg = srgb(contentRaised(css, scheme));
    const measured = INTENTS.map(({ intent, prop }) => {
      const o = evalColor(root()[prop]!, vars, scheme);
      return { intent, inGamut: inGamut(o), contrast: round(contrastRatio(srgb(o), bg), 2) };
    });
    expect(measured.filter((m) => !m.inGamut)).toEqual([]);
    expect(measured.filter((m) => m.contrast < 4.5)).toEqual([]);
  });

  it('the no-light-dark() fallback blocks carry the same light and dark arms', () => {
    const main = root();
    const light = declsOf(css.data, '.ag-stat-card', { withHeader: SUPPORTS_NO_LIGHT_DARK });
    const dark = declsOf(css.data, '[data-ag-scheme=dark] .ag-stat-card', { withHeader: SUPPORTS_NO_LIGHT_DARK });
    const media = declsOf(css.data, '.ag-stat-card:not([data-ag-scheme] *)', { withHeader: MEDIA_DARK });
    const norm = (s: string | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
    for (const { prop } of INTENTS) {
      const [l, d] = splitArgs(callArgs(main[prop]!, 'light-dark')!);
      expect({ prop, light: norm(light[prop]), dark: norm(dark[prop]), media: norm(media[prop]) })
        .toEqual({ prop, light: norm(l), dark: norm(d), media: norm(d) });
    }
  });
});
