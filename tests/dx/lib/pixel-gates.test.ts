/* tests/dx/lib/pixel-gates.test.ts — PLAT-369 / REQ-PLAT-97. Each §15.2 gate
   passes on a good capture and fails on the pathology it guards. */
import { describe, expect, it } from '@jest/globals';
import {
  THRESHOLDS, contrastRatio, glassDensity, glassOverNothing, lumaStats, notBlank, relativeLuminance, separation,
  solidHasNoBlur, textContrast, toDevice, worstTextContrast, type Frame,
} from './pixel-gates';

type Px = [number, number, number, number];
const frame = (w: number, h: number, fill: Px): Frame => {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < data.length; i += 4) data.set(fill, i);
  return { data, width: w, height: h };
};
const paint = (f: Frame, x0: number, y0: number, w: number, h: number, px: Px | ((x: number, y: number) => Px)) => {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    const v = typeof px === 'function' ? px(x, y) : px;
    (f.data as Uint8ClampedArray).set(v, (y * f.width + x) * 4);
  }
};

describe('notBlank (≥40 levels from the subject-hidden capture)', () => {
  it('passes when the subject paints over the backdrop and fails when it paints nothing', () => {
    const hidden = frame(40, 40, [240, 240, 240, 255]);
    const shot = frame(40, 40, [240, 240, 240, 255]);
    paint(shot, 10, 10, 10, 4, [20, 20, 20, 255]);
    expect(notBlank(shot, hidden, { x: 0, y: 0, w: 40, h: 40 }).status).toBe('pass');
    expect(notBlank(hidden, hidden, { x: 0, y: 0, w: 40, h: 40 }).status).toBe('fail');
  });
  it('a 39-level deviation fails, 40 passes (threshold is inclusive)', () => {
    const hidden = frame(8, 8, [100, 100, 100, 255]);
    const a = frame(8, 8, [100, 100, 100, 255]); paint(a, 0, 0, 1, 1, [139, 100, 100, 255]);
    const b = frame(8, 8, [100, 100, 100, 255]); paint(b, 0, 0, 1, 1, [140, 100, 100, 255]);
    expect(notBlank(a, hidden, { x: 0, y: 0, w: 8, h: 8 }).status).toBe('fail');
    expect(notBlank(b, hidden, { x: 0, y: 0, w: 8, h: 8 }).status).toBe('pass');
  });
  it('a box outside the capture fails, never passes', () => {
    const f = frame(8, 8, [0, 0, 0, 255]);
    expect(notBlank(f, f, { x: 100, y: 100, w: 4, h: 4 }).status).toBe('fail');
  });
  it('refuses captures of different sizes', () => {
    expect(() => notBlank(frame(4, 4, [0, 0, 0, 255]), frame(5, 4, [0, 0, 0, 255]), { x: 0, y: 0, w: 4, h: 4 })).toThrow(/differ in size/);
  });
});

describe('separation (≥25 % of surface pixels differ by >10 levels)', () => {
  it('passes for a surface distinct from what is behind it, fails for an invisible one', () => {
    const hidden = frame(20, 20, [200, 200, 200, 255]);
    const shot = frame(20, 20, [200, 200, 200, 255]);
    paint(shot, 0, 0, 20, 6, [170, 170, 170, 255]); // 30 % of the box
    expect(separation(shot, hidden, { x: 0, y: 0, w: 20, h: 20 }).status).toBe('pass');
    const faint = frame(20, 20, [200, 200, 200, 255]);
    paint(faint, 0, 0, 20, 20, [208, 208, 208, 255]); // every pixel differs, but only by 8 levels
    expect(separation(faint, hidden, { x: 0, y: 0, w: 20, h: 20 }).status).toBe('fail');
    const small = frame(20, 20, [200, 200, 200, 255]);
    paint(small, 0, 0, 20, 4, [100, 100, 100, 255]); // 20 %
    expect(separation(small, hidden, { x: 0, y: 0, w: 20, h: 20 }).value).toBeCloseTo(0.2, 5);
    expect(separation(small, hidden, { x: 0, y: 0, w: 20, h: 20 }).status).toBe('fail');
  });
});

describe('text contrast on rendered pixels (4.5:1 body, 3:1 large and glyphs)', () => {
  const textOn = (bg: Px, ink: Px) => {
    const f = frame(60, 20, bg);
    for (let x = 4; x < 56; x += 3) paint(f, x, 5, 1, 10, ink); // glyph strokes
    return f;
  };
  it('black on white is ~21:1 and passes body text', () => {
    const r = textContrast(textOn([255, 255, 255, 255], [0, 0, 0, 255]), { rect: { x: 0, y: 0, w: 60, h: 20 }, large: false, glyph: false, label: 'p' });
    expect(r.value).toBeGreaterThan(20);
    expect(r.status).toBe('pass');
  });
  it('#777 on white (~4.48:1) fails body text but passes large text and glyphs', () => {
    const f = textOn([255, 255, 255, 255], [119, 119, 119, 255]);
    const rect = { x: 0, y: 0, w: 60, h: 20 };
    expect(contrastRatio(relativeLuminance(119, 119, 119), 1)).toBeLessThan(4.5);
    expect(textContrast(f, { rect, large: false, glyph: false, label: 'p' }).status).toBe('fail');
    expect(textContrast(f, { rect, large: true, glyph: false, label: 'h1' }).status).toBe('pass');
    expect(textContrast(f, { rect, large: false, glyph: true, label: 'svg' }).status).toBe('pass');
  });
  it('light ink on a dark background is measured the same way', () => {
    const r = textContrast(textOn([18, 18, 18, 255], [240, 240, 240, 255]), { rect: { x: 0, y: 0, w: 60, h: 20 }, large: false, glyph: false, label: 'p' });
    expect(r.status).toBe('pass');
  });
  it('the worst run decides; no runs is not-applicable, never pass', () => {
    const f = frame(120, 20, [255, 255, 255, 255]);
    for (let x = 4; x < 56; x += 3) paint(f, x, 5, 1, 10, [0, 0, 0, 255]);
    for (let x = 64; x < 116; x += 3) paint(f, x, 5, 1, 10, [200, 200, 200, 255]);
    const runs = [
      { rect: { x: 0, y: 0, w: 60, h: 20 }, large: false, glyph: false, label: 'good' },
      { rect: { x: 60, y: 0, w: 60, h: 20 }, large: false, glyph: false, label: 'faint' },
    ];
    const w = worstTextContrast(f, runs);
    expect(w.status).toBe('fail');
    expect(w.detail).toContain('faint');
    expect(worstTextContrast(f, []).status).toBe('not-applicable');
  });
});

describe('glass density (Σ blurred area ÷ viewport ≤ 0.3)', () => {
  const vp = { width: 100, height: 100 };
  it('passes at 0.3 and fails above it', () => {
    expect(glassDensity([{ x: 0, y: 0, width: 100, height: 30 }], vp).status).toBe('pass');
    expect(glassDensity([{ x: 0, y: 0, width: 100, height: 20 }, { x: 0, y: 50, width: 100, height: 11 }], vp).status).toBe('fail');
  });
  it('clips rects to the viewport (off-screen blur does not count)', () => {
    const r = glassDensity([{ x: -50, y: 0, width: 100, height: 100 }, { x: 0, y: 200, width: 100, height: 100 }], vp);
    expect(r.value).toBeCloseTo(0.5, 5);
  });
  it('uses the PRD max', () => {
    expect(THRESHOLDS.density.max).toBe(0.3);
  });
});

describe('material presence', () => {
  const noisy = (w: number, h: number) => {
    const f = frame(w, h, [0, 0, 0, 255]);
    paint(f, 0, 0, w, h, (x, y) => ((x + y) % 2 ? [220, 220, 220, 255] : [30, 30, 30, 255]));
    return f;
  };
  it('glass over a varied backdrop passes; glass over an opaque stage fails', () => {
    const box = { x: 0, y: 0, w: 20, h: 20 };
    expect(glassOverNothing(noisy(20, 20), box, 60, 'panel').status).toBe('pass');
    expect(glassOverNothing(frame(20, 20, [250, 250, 250, 255]), box, 60, 'panel').status).toBe('fail');
  });
  it('is not applicable over a flat backdrop', () => {
    expect(glassOverNothing(frame(20, 20, [250, 250, 250, 255]), { x: 0, y: 0, w: 20, h: 20 }, 3, 'panel').status).toBe('not-applicable');
  });
  it('solid transparency must leave no visible blur', () => {
    expect(solidHasNoBlur(0).status).toBe('pass');
    expect(solidHasNoBlur(2).status).toBe('fail');
  });
});

describe('helpers', () => {
  it('lumaStats and toDevice', () => {
    const st = lumaStats(frame(4, 4, [255, 255, 255, 255]), { x: 0, y: 0, w: 4, h: 4 });
    expect(st.n).toBe(16);
    expect(st.mean).toBeCloseTo(255, 6);
    expect(st.sigma).toBeCloseTo(0, 4);
    expect(toDevice({ x: 1, y: 2, width: 3, height: 4 }, 2)).toEqual({ x: 2, y: 4, w: 6, h: 8 });
    expect(contrastRatio(1, 0)).toBeCloseTo(21, 5);
  });
});
