/* @jest-environment node */
/* REQ-FIN-03 / REQ-MAT-10 (ledger item d): "one WCAG module shared with
   src/theme/color.ts". The runtime colour API (src/theme/color.ts) and the
   tokens build that feeds the contrast solver (scripts/tokens/color.mjs) must
   compute WCAG luminance, contrast and composites through src/theme/wcag.mjs,
   so a solved floor and a runtime/test re-check can never disagree. */
import { describe, expect, it } from '@jest/globals';
import * as wcag from '../../src/theme/wcag.mjs';
import * as color from '../../src/theme/color';
import * as build from '../../scripts/tokens/color.mjs';

type Rgb = [number, number, number];

/* Deterministic sample set: every 8-bit grey step plus a coarse colour cube,
   which covers both sides of the sRGB linear/power threshold (10/255, 11/255). */
const greys: Rgb[] = Array.from({ length: 256 }, (_, i) => [i / 255, i / 255, i / 255]);
const cube: Rgb[] = [];
for (const r of [0, 10, 11, 64, 128, 200, 255])
  for (const g of [0, 11, 96, 255])
    for (const b of [0, 10, 160, 255]) cube.push([r / 255, g / 255, b / 255]);
const samples = [...greys, ...cube];
const toHex = ([r, g, b]: Rgb) =>
  `#${[r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')}`;

describe('shared WCAG module: reference values', () => {
  it('black/white is 21:1 and identical colours are 1:1', () => {
    expect(wcag.wcagContrastRatio([0, 0, 0], [1, 1, 1])).toBeCloseTo(21, 10);
    expect(wcag.wcagContrastRatio([0.5, 0.2, 0.9], [0.5, 0.2, 0.9])).toBeCloseTo(1, 12);
  });

  it('matches published WCAG ratios (#777 on #fff = 4.48, #595959 on #fff = 7.00)', () => {
    expect(wcag.wcagContrastRatio([0x77 / 255, 0x77 / 255, 0x77 / 255], [1, 1, 1])).toBeCloseTo(4.478, 3);
    expect(wcag.wcagContrastRatio([0x59 / 255, 0x59 / 255, 0x59 / 255], [1, 1, 1])).toBeCloseTo(7.0, 2);
  });

  it('is symmetric and luminance is monotonic over the grey ramp', () => {
    for (let i = 1; i < greys.length; i++) {
      expect(wcag.wcagRelativeLuminance(greys[i]!)).toBeGreaterThan(wcag.wcagRelativeLuminance(greys[i - 1]!));
    }
    expect(wcag.wcagContrastRatio([0.1, 0.4, 0.7], [0.9, 0.8, 0.2])).toBe(
      wcag.wcagContrastRatio([0.9, 0.8, 0.2], [0.1, 0.4, 0.7]),
    );
  });

  it('transfer functions round-trip and composite endpoints are fg/bg', () => {
    for (let i = 0; i <= 255; i++) {
      const x = i / 255;
      expect(wcag.srgbChannelFromLinear(wcag.srgbChannelToLinear(x))).toBeCloseTo(x, 12);
    }
    expect(wcag.wcagComposite([1, 0, 0], 1, [0, 0, 1])).toEqual([1, 0, 0]);
    expect(wcag.wcagComposite([1, 0, 0], 0, [0, 0, 1])).toEqual([0, 0, 1]);
    expect(wcag.wcagComposite([1, 1, 1], 0.25, [0, 0, 0])).toEqual([0.25, 0.25, 0.25]);
  });
});

describe('src/theme/color.ts computes WCAG through the shared module', () => {
  it('relativeLuminance / contrastRatio (hex API) equal the shared module exactly', () => {
    for (const s of samples) {
      expect(color.relativeLuminance(toHex(s))).toBe(wcag.wcagRelativeLuminance(s));
    }
    for (let i = 0; i < cube.length; i++) {
      const a = cube[i]!;
      const b = cube[(i * 7 + 3) % cube.length]!;
      expect(color.contrastRatio(toHex(a), toHex(b))).toBe(wcag.wcagContrastRatio(a, b));
    }
  });

  it('wcagContrast / compositeOver (Srgb API) equal the shared module exactly', () => {
    for (let i = 0; i < cube.length; i++) {
      const [r, g, b] = cube[i]!;
      const [br, bg, bb] = cube[(i * 5 + 1) % cube.length]!;
      expect(color.wcagContrast({ r, g, b }, { r: br, g: bg, b: bb })).toBe(
        wcag.wcagContrastRatio([r, g, b], [br, bg, bb]),
      );
      const out = color.compositeOver({ r, g, b, alpha: 0.4 }, { r: br, g: bg, b: bb });
      expect([out.r, out.g, out.b]).toEqual(wcag.wcagComposite([r, g, b], 0.4, [br, bg, bb]));
      expect(out.alpha).toBe(1);
    }
  });
});

describe('scripts/tokens/color.mjs (tokens build / contrast solver) uses the same module', () => {
  it('re-exports the shared functions instead of re-implementing them', () => {
    expect(build.relativeLuminance).toBe(wcag.wcagRelativeLuminance);
    expect(build.contrastRatio).toBe(wcag.wcagContrastRatio);
    expect(build.composite).toBe(wcag.wcagComposite);
  });

  it('build-side and runtime-side contrast agree on every sample (hex inputs)', () => {
    for (let i = 0; i < samples.length; i++) {
      const a = samples[i]!;
      const b = samples[(i * 13 + 5) % samples.length]!;
      const viaBuild = build.contrastRatio(build.hexToSrgb(toHex(a)), build.hexToSrgb(toHex(b)));
      expect(viaBuild).toBe(color.contrastRatio(toHex(a), toHex(b)));
    }
  });
});
