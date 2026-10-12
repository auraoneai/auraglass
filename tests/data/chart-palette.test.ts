/** @jest-environment node */
// REQ-SURF-95 (SURF-185): the chart palette, computed from BUILT CSS.
//
// Inputs are the shipped bundles, never the source text:
//   - dist/tokens.css   (MAT tokens:build; S-03 --ag-color-* per scheme)
//   - dist/material.css (content-raised fill: the content-layer rule)
//   - dist/data.css     (chart-frame.css as assembled + lowered for dist)
// They are loaded by tests/data/helpers/built-css.ts: AG_BUILT_CSS_DIR (a
// built dist/), else AURAGLASS_TARBALL (the L4 token-contrast lane row in
// fragments/lanes/surf.ts, which runs against the packed tarball and fails
// closed without one), else a local build the way the package build does:
// `scripts/tokens/build.mjs --out <tmp>` for tokens.css, and
// scripts/build/lib/css.mjs (collectCssFragments -> assembleBundle ->
// lowerCss, the functions scripts/build/post.mjs calls) for material.css and
// data.css.
//
// For light and dark it resolves --_ag-chart-1..8 inside .ag-chart-frame
// (light-dark() arm, relative oklch(from var(--ag-color-*) …) channels) and
// the content-raised fill, then asserts:
//   - every colour is inside sRGB (so no gamut mapping changes the numbers)
//   - WCAG contrast >= 3:1 against content-raised for 1..8 (WCAG 1.4.11)
//   - OKLCH chroma >= 0.08 for 1..6
//   - CIEDE2000 >= 15 for every pair of 1..4 after Machado (2009) severity-1
//     protan / deutan / tritan simulation
//   - the @supports-not(light-dark) fallback blocks carry the same arms
// The computed table is written to .artifacts/surf/chart-palette.json.
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { simulateCvd, type CvdType } from '../e2e/mat/helpers/machado';
import { deltaE2000 } from '../e2e/mat/helpers/ciede2000';
import {
  type BuiltCss, type Oklch, type Vars, ROOT, SCHEMES, NO_COND, SUPPORTS_NO_LIGHT_DARK, MEDIA_DARK,
  callArgs, contentRaised as contentRaisedOf, contrastRatio, declsOf, evalColor, inGamut, lab, loadBuiltCss,
  round, splitArgs, srgb, tokenVars as tokenVarsOf,
} from './helpers/built-css';

type Scheme = 'light' | 'dark';
const CVD: CvdType[] = ['protan', 'deutan', 'tritan'];

let css: BuiltCss;

beforeAll(async () => { css = await loadBuiltCss('ag-chart-palette-'); }, 120_000);

afterAll(() => css?.cleanup());

const tokenVars = (): Vars => tokenVarsOf(css);
const contentRaised = (scheme: Scheme): Oklch => contentRaisedOf(css, scheme);

function palette(): Vars {
  return declsOf(css.data, '.ag-chart-frame', { noHeaders: NO_COND });
}

interface Row { index: number; oklch: Oklch; inGamut: boolean; contrast: number }
function rows(scheme: Scheme): Row[] {
  const pal = palette();
  const vars = tokenVars();
  const bg = srgb(contentRaised(scheme));
  return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
    const decl = pal[`--_ag-chart-${i}`];
    if (decl === undefined) throw new Error(`--_ag-chart-${i} missing from .ag-chart-frame in data.css`);
    const o = evalColor(decl, vars, scheme);
    return { index: i, oklch: o, inGamut: inGamut(o), contrast: contrastRatio(srgb(o), bg) };
  });
}

function cvdPairs(scheme: Scheme) {
  const first4 = rows(scheme).slice(0, 4);
  const out: { type: CvdType; a: number; b: number; deltaE: number }[] = [];
  for (const type of CVD) {
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const a = simulateCvd(type, ...srgb(first4[i]!.oklch));
      const b = simulateCvd(type, ...srgb(first4[j]!.oklch));
      out.push({ type, a: i + 1, b: j + 1, deltaE: deltaE2000(lab(a), lab(b)) });
    }
  }
  return out;
}

describe('chart palette from built CSS (REQ-SURF-95)', () => {
  it('declares --_ag-chart-1..8 in .ag-chart-frame from S-03 --ag-color-* only', () => {
    const pal = palette();
    const names = Object.keys(pal).filter((k) => k.startsWith('--_ag-chart-')).sort();
    expect(names).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map((i) => `--_ag-chart-${i}`));
    const sources = new Set<string>();
    for (const n of names) {
      const refs = [...pal[n]!.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]!);
      // each arm reads exactly one public S-03 colour, never a private or --ag-chart-N name
      expect({ n, refs: refs.filter((r) => !/^--ag-color-(accent|info|success|warning|danger)$/.test(r)) }).toEqual({ n, refs: [] });
      refs.forEach((r) => sources.add(r));
    }
    expect(sources.size).toBeGreaterThanOrEqual(5);
  });

  it.each(SCHEMES)('%s: every colour is inside sRGB and >= 3:1 against content-raised', (scheme) => {
    const r = rows(scheme);
    expect(r.filter((x) => !x.inGamut).map((x) => x.index)).toEqual([]);
    expect(r.filter((x) => x.contrast < 3).map((x) => ({ index: x.index, contrast: round(x.contrast, 2) }))).toEqual([]);
  });

  it.each(SCHEMES)('%s: OKLCH chroma >= 0.08 for indices 1..6', (scheme) => {
    const r = rows(scheme).slice(0, 6);
    expect(r.filter((x) => x.oklch.c < 0.08).map((x) => ({ index: x.index, c: round(x.oklch.c) }))).toEqual([]);
  });

  it.each(SCHEMES)('%s: CIEDE2000 >= 15 between indices 1..4 under protan, deutan and tritan simulation', (scheme) => {
    const pairs = cvdPairs(scheme);
    expect(pairs).toHaveLength(18);
    expect(pairs.filter((p) => p.deltaE < 15).map((p) => ({ ...p, deltaE: round(p.deltaE, 1) }))).toEqual([]);
  });

  it('the no-light-dark() fallback blocks carry the same light and dark arms', () => {
    const main = palette();
    const SUP = SUPPORTS_NO_LIGHT_DARK;
    const light = declsOf(css.data, '.ag-chart-frame', { withHeader: SUP });
    const dark = declsOf(css.data, '[data-ag-scheme=dark] .ag-chart-frame', { withHeader: SUP });
    // OS dark with no explicit scheme on any ancestor (chart-frame.css: no
    // `:root`/`html` subject in ag.components, REQ-FIN-14 / REQ-PLAT-74).
    const darkMedia = declsOf(css.data, '.ag-chart-frame:not([data-ag-scheme] *)', { withHeader: MEDIA_DARK });
    const norm = (s: string | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
    for (let i = 1; i <= 8; i++) {
      const k = `--_ag-chart-${i}`;
      const [l, d] = splitArgs(callArgs(main[k]!, 'light-dark')!);
      expect({ k, light: norm(light[k]), dark: norm(dark[k]), media: norm(darkMedia[k]) })
        .toEqual({ k, light: norm(l), dark: norm(d), media: norm(d) });
    }
  });

  it('writes the computed table (tool output, never hand-authored)', () => {
    const table = Object.fromEntries(SCHEMES.map((s) => [s, {
      contentRaised: contentRaised(s),
      colours: rows(s).map((r) => ({ ...r, oklch: { l: round(r.oklch.l), c: round(r.oklch.c), h: round(r.oklch.h, 1) }, contrast: round(r.contrast, 2) })),
      cvd: cvdPairs(s).map((p) => ({ ...p, deltaE: round(p.deltaE, 2) })),
    }]));
    const dir = join(ROOT, '.artifacts/surf');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'chart-palette.json'), JSON.stringify({ source: css.source, ...table }, null, 2) + '\n');
    expect(Object.keys(table)).toEqual(SCHEMES);
  });
});
