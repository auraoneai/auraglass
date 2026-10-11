import { describe, expect, it } from '@jest/globals';
import { computeLumaStats } from '../luma';

function rgbaBuf(w: number, h: number, fill: (i: number) => [number, number, number, number]): Uint8ClampedArray {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const [r, g, b, a] = fill(i);
    d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = a;
  }
  return d;
}

describe('computeLumaStats (REQ-SURF-151)', () => {
  it('white → mean 1.000 ±0.001', () => {
    const s = computeLumaStats(rgbaBuf(8, 8, () => [255, 255, 255, 255]), 8, 8);
    expect(s.mean).toBeCloseTo(1.0, 3);
    expect(s.stdev).toBeCloseTo(0, 3);
  });
  it('black → mean 0.000 ±0.001', () => {
    const s = computeLumaStats(rgbaBuf(8, 8, () => [0, 0, 0, 255]), 8, 8);
    expect(s.mean).toBeCloseTo(0.0, 3);
  });
  it('50/50 white/black → p10 0, p90 1', () => {
    const s = computeLumaStats(rgbaBuf(8, 8, (i) => (i % 2 === 0 ? [255, 255, 255, 255] : [0, 0, 0, 255])), 8, 8);
    expect(s.p10).toBe(0);
    expect(s.p90).toBe(1);
    expect(s.mean).toBeCloseTo(0.5, 3);
  });
  it('transparent pixels are ignored', () => {
    const s = computeLumaStats(rgbaBuf(4, 4, (i) => (i < 8 ? [255, 255, 255, 255] : [0, 0, 0, 0])), 4, 4);
    expect(s.mean).toBeCloseTo(1.0, 3);
  });
});
