/** @jest-environment node */
// REQ-SURF-91: Sparkline intent stroke colours, computed from BUILT CSS
// (tests/data/helpers/built-css.ts: AG_BUILT_CSS_DIR or a local
// tokens:build + assembleBundle/lowerCss of data.css and material.css).
//
// For light and dark it resolves --_ag-sparkline-color for every intent
// (light-dark() arm, relative oklch(from var(--ag-color-*) …), or the S-03
// muted foreground for neutral) and the content-raised fill, then asserts:
//   - each intent derives from a public S-03 --ag-color-* only
//   - every colour is inside sRGB and >= 3:1 against content-raised (1.4.11)
//   - the @supports-not(light-dark) fallback rules carry the same arms
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import {
  type BuiltCss, SCHEMES, NO_COND, SUPPORTS_NO_LIGHT_DARK, MEDIA_DARK,
  callArgs, contentRaised, contrastRatio, declsOf, evalColor, inGamut, loadBuiltCss, round, splitArgs, srgb, tokenVars,
} from './helpers/built-css';

const INTENTS = [
  { intent: 'info', source: '--ag-color-info' },
  { intent: 'success', source: '--ag-color-success' },
  { intent: 'danger', source: '--ag-color-danger' },
  { intent: 'neutral', source: '--ag-color-on-surface-muted' },
] as const;
const DERIVED = INTENTS.filter((i) => i.intent !== 'neutral');
const PROP = '--_ag-sparkline-color';

let css: BuiltCss;
beforeAll(async () => { css = await loadBuiltCss('ag-sparkline-contrast-'); }, 120_000);
afterAll(() => css?.cleanup());

const sel = (intent: string) => `.ag-sparkline[data-ag-intent=${intent}]`;
const declOf = (intent: string) => declsOf(css.data, sel(intent), { noHeaders: NO_COND })[PROP];

describe('Sparkline intent colours from built CSS (REQ-SURF-91)', () => {
  it.each(INTENTS)('$intent derives from $source only', ({ intent, source }) => {
    const decl = declOf(intent);
    expect(decl).toBeDefined();
    const refs = [...decl!.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]);
    expect(new Set(refs)).toEqual(new Set([source]));
  });

  it.each(SCHEMES)('%s: every intent is inside sRGB and >= 3:1 against content-raised', (scheme) => {
    const vars = tokenVars(css);
    const bg = srgb(contentRaised(css, scheme));
    const measured = INTENTS.map(({ intent }) => {
      const o = evalColor(declOf(intent)!, vars, scheme);
      return { intent, inGamut: inGamut(o), contrast: round(contrastRatio(srgb(o), bg), 2) };
    });
    expect(measured.filter((m) => !m.inGamut)).toEqual([]);
    expect(measured.filter((m) => m.contrast < 3)).toEqual([]);
  });

  it('the no-light-dark() fallback rules carry the same light and dark arms', () => {
    const norm = (s: string | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
    for (const { intent } of DERIVED) {
      const [l, d] = splitArgs(callArgs(declOf(intent)!, 'light-dark')!);
      const light = declsOf(css.data, sel(intent), { withHeader: SUPPORTS_NO_LIGHT_DARK })[PROP];
      const dark = declsOf(css.data, `[data-ag-scheme=dark] ${sel(intent)}`, { withHeader: SUPPORTS_NO_LIGHT_DARK })[PROP];
      const media = declsOf(css.data, `${sel(intent)}:not([data-ag-scheme] *)`, { withHeader: MEDIA_DARK })[PROP];
      expect({ intent, light: norm(light), dark: norm(dark), media: norm(media) })
        .toEqual({ intent, light: norm(l), dark: norm(d), media: norm(d) });
    }
  });
});
