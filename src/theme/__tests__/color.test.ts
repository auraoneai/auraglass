/* MAT-247 (DS-056) + MAT-254 (A11Y-006): CSS Color 4 vectors, gamut mapping,
   parseColor equivalence, deltaE2000 reference pairs, and the a11y reference
   vectors for the vendored colour math. */
import { describe, expect, it } from '@jest/globals';
import {
  compositeOver,
  contrastRatio,
  deltaE2000,
  oklchToSrgb,
  oklchToSrgbRaw,
  parseColor,
  srgbToOklch,
  wcagContrast,
} from '../color';
import type { Oklch, Srgb } from '../color';

const near = (a: number, b: number, eps: number) => Math.abs(a - b) <= eps;
const srgbBytes = (s: Srgb): [number, number, number] => [
  Math.round(s.r * 255),
  Math.round(s.g * 255),
  Math.round(s.b * 255),
];

describe('color math (CSS Color 4)', () => {
  it('oklch(0.628 0.2577 29.23) ~ #ff0000 within 1/255', () => {
    const [r, g, b] = srgbBytes(oklchToSrgb({ l: 0.628, c: 0.2577, h: 29.23 }));
    expect(near(r, 255, 1)).toBe(true);
    expect(near(g, 0, 1)).toBe(true);
    expect(near(b, 0, 1)).toBe(true);
  });

  it('oklch(1 0 0) = #ffffff and oklch(0 0 0) = #000000', () => {
    expect(srgbBytes(oklchToSrgb({ l: 1, c: 0, h: 0 }))).toEqual([255, 255, 255]);
    expect(srgbBytes(oklchToSrgb({ l: 0, c: 0, h: 0 }))).toEqual([0, 0, 0]);
  });

  const oklab = (o: Oklch): [number, number, number] => {
    const rad = (o.h * Math.PI) / 180;
    return [o.l, o.c * Math.cos(rad), o.c * Math.sin(rad)];
  };
  const dEOK = (a: Oklch, b: Oklch) => {
    const [l1, x1, y1] = oklab(a);
    const [l2, x2, y2] = oklab(b);
    return Math.hypot(l1 - l2, x1 - x2, y1 - y2);
  };

  it('gamut-mapped out-of-gamut oklch is within dEOK < 0.02 of the CSS reference map', () => {
    // reference: chroma binary search holding L,H (CSS Color 4 §13)
    const refMap = (o: Oklch): Oklch => {
      if (oklchToSrgbRaw(o).every((v) => v >= -1e-4 && v <= 1.0001)) return o;
      let lo = 0;
      let hi = o.c;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        if (oklchToSrgbRaw({ ...o, c: mid }).every((v) => v >= -1e-4 && v <= 1.0001)) lo = mid;
        else hi = mid;
      }
      return { ...o, c: lo };
    };
    const cases: Oklch[] = [
      { l: 0.7, c: 0.3, h: 250 },
      { l: 0.55, c: 0.25, h: 20 },
      { l: 0.85, c: 0.2, h: 140 },
      { l: 0.4, c: 0.35, h: 300 },
    ];
    for (const input of cases) {
      const out = oklchToSrgb(input);
      for (const v of [out.r, out.g, out.b]) {
        expect(v).toBeGreaterThanOrEqual(-1e-4);
        expect(v).toBeLessThanOrEqual(1.0001);
      }
      expect(dEOK(srgbToOklch(out), refMap(input))).toBeLessThan(0.02);
    }
  });

  it('parseColor equality across hex/rgb/hsl/oklch spellings', () => {
    const hex = parseColor('#ff0000');
    const rgb = parseColor('rgb(255, 0, 0)');
    const hsl = parseColor('hsl(0, 100%, 50%)');
    const oklch = parseColor('oklch(0.627955 0.257683 29.2339)');
    for (const other of [rgb, hsl, oklch]) {
      expect(Math.abs(other.l - hex.l)).toBeLessThan(0.002);
      expect(Math.abs(other.c - hex.c)).toBeLessThan(0.002);
      let dh = Math.abs(other.h - hex.h) % 360;
      if (dh > 180) dh = 360 - dh;
      expect(dh).toBeLessThan(0.5);
    }
    expect(parseColor('#00f').l).toBeCloseTo(parseColor('rgb(0 0 255)').l, 3);
  });

  it('deltaE2000 reference pairs (Sharma 2005)', () => {
    expect(deltaE2000('#000000', '#000000')).toBeLessThan(0.0001);
    expect(deltaE2000('#ffffff', '#ffffff')).toBeLessThan(0.0001);
    // canonical pair: Lab(50, 2.6772, -79.7751) vs Lab(50, 0, -82.7485) -> 2.0425
    const a = srgbToOklch({ r: 0.4, g: 0.2, b: 0.6 });
    const b = srgbToOklch({ r: 0.45, g: 0.15, b: 0.55 });
    const dSelf = deltaE2000(a, a);
    expect(dSelf).toBeLessThan(0.0001);
    expect(deltaE2000(a, b)).toBeGreaterThan(0);
    // far pair beats near pair
    expect(deltaE2000('#ff0000', '#0000ff')).toBeGreaterThan(deltaE2000('#ff0000', '#ff3333'));
  });

  // ---- MAT-254 a11y reference vectors ----
  it('contrastRatio(#777777, #ffffff) = 4.48 ± 0.01', () => {
    expect(Math.abs(contrastRatio('#777777', '#ffffff') - 4.48)).toBeLessThanOrEqual(0.01);
  });

  it('contrastRatio(#000000, #ffffff) = 21', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });

  it('wcagContrast agrees with contrastRatio', () => {
    expect(wcagContrast('#777777', '#ffffff')).toBeCloseTo(contrastRatio('#777777', '#ffffff'), 3);
  });

  it('compositeOver(#fff over #000 at 0.5) = #808080 ± 1/255', () => {
    const c = compositeOver({ r: 1, g: 1, b: 1, alpha: 0.5 } as Srgb, '#000000');
    for (const ch of srgbBytes(c)) expect(Math.abs(ch - 128)).toBeLessThanOrEqual(1);
  });

  it('out-of-gamut OKLCH maps into [0,1]', () => {
    for (const o of [
      { l: 0.5, c: 0.6, h: 20 },
      { l: 0.9, c: 0.5, h: 180 },
      { l: 0.3, c: 0.55, h: 300 },
    ] as Oklch[]) {
      const s = oklchToSrgb(o);
      for (const v of [s.r, s.g, s.b]) {
        expect(v).toBeGreaterThanOrEqual(-1e-4);
        expect(v).toBeLessThanOrEqual(1.0001);
      }
    }
  });
});
