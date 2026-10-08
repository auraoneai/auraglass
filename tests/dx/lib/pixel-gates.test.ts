/* tests/dx/lib/pixel-gates.test.ts — PLAT-369. Each §15.2 gate passes on a
   good frame and fails on the pathology it guards. */
import { describe, expect, it } from '@jest/globals';
import { notBlank, surfaceSeparation, contrastPair, contrastRatio, glassDensity, materialPresence } from './pixel-gates';
import type { Frame } from './pixel-gates';

const frame = (w: number, h: number, fill: [number, number, number, number]): Frame => {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < data.length; i += 4) { data[i] = fill[0]; data[i + 1] = fill[1]; data[i + 2] = fill[2]; data[i + 3] = fill[3]; }
  return { data, width: w, height: h };
};
const setPx = (f: Frame, x: number, y: number, [r, g, b, a]: number[]) => { const i = (y * f.width + x) * 4; f.data[i] = r; f.data[i + 1] = g; f.data[i + 2] = b; f.data[i + 3] = a; };

describe('pixel gates', () => {
  it('notBlank passes on a multi-colour frame, fails on a flat one', () => {
    const f = frame(64, 64, [250, 250, 250, 255]);
    /* paint whole 4px-sample-aligned columns so the step-4 sampler sees them */
    for (let i = 0; i < 16; i++) for (let y = 0; y < 64; y++) for (let x = i * 4; x < i * 4 + 2; x++) setPx(f, x, y, [i * 15, 255 - i * 15, i * 10, 255]);
    expect(notBlank(f).pass).toBe(true);
    expect(notBlank(frame(64, 64, [255, 255, 255, 255])).pass).toBe(false);
    expect(notBlank(frame(64, 64, [0, 0, 0, 0])).pass).toBe(false);
  });
  it('surfaceSeparation detects luminance split between regions', () => {
    const f = frame(100, 100, [30, 30, 30, 255]);
    for (let y = 0; y < 100; y++) for (let x = 50; x < 100; x++) setPx(f, x, y, [230, 230, 230, 255]);
    expect(surfaceSeparation(f, [0, 0, 50, 100], [50, 0, 50, 100]).pass).toBe(true);
    expect(surfaceSeparation(f, [0, 0, 20, 100], [20, 0, 20, 100]).pass).toBe(false);
  });
  it('contrastPair and contrastRatio compute WCAG ratios', () => {
    expect(contrastRatio(1, 0)).toBeCloseTo(21, 1);
    const f = frame(40, 40, [255, 255, 255, 255]);
    setPx(f, 10, 10, [20, 20, 20, 255]);
    expect(contrastPair(f, [10, 10], [20, 20, 20, 20], 3).pass).toBe(true);
    expect(contrastPair(f, [10, 10], [0, 0, 20, 20], 21).pass).toBe(false);
  });
  it('glassDensity passes on mid-tone blends, fails on flat fill', () => {
    const f = frame(40, 40, [128, 140, 160, 200]);
    expect(glassDensity(f, [0, 0, 40, 40]).pass).toBe(true);
    const flat = frame(40, 40, [0, 0, 0, 255]);
    expect(glassDensity(flat, [0, 0, 40, 40]).pass).toBe(false);
  });
  it('materialPresence matches DOM markers for glass vs solid', () => {
    expect(materialPresence({ material: 'glass' }, 'glass').pass).toBe(true);
    expect(materialPresence({ material: 'regular' }, 'solid').pass).toBe(true);
    expect(materialPresence({ material: 'glass' }, 'solid').pass).toBe(false);
    expect(materialPresence({ classes: 'card ag-glass' }, 'glass').pass).toBe(true);
  });
});
