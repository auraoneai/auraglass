/* REQ-QUAL-03 Distinctness — packages/qa/test/dhash-duplicates.test.ts.
   Fixtures are generated RGBA buffers: identical, 1-pixel-different, distinct, and a 10-cell matrix for
   the 90 % rule (non-alias fails, alias passes, 80 % passes). */
import { describe, expect, it } from '@jest/globals';
import { dhash, hamming, luminanceGrid, toHex, type RgbaImage } from '../src/pixel/dhash.ts';
import { checkDistinctness, comparePair, diffRatio, DISTINCTNESS, type Capture } from '../src/pixel/duplicates.ts';

const SIZE = 64;

function image(fn: (x: number, y: number) => [number, number, number]): RgbaImage {
  const data = new Uint8Array(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const [r, g, b] = fn(x, y);
      data.set([r, g, b, 255], (y * SIZE + x) * 4);
    }
  }
  return { data, width: SIZE, height: SIZE };
}

/** A smooth pattern whose horizontal gradients differ per row (non-trivial hash). */
const pattern = (seed: number) => image((x, y) => {
  const v = Math.round(127 + 120 * Math.sin((x + seed * 7) / (4 + (y % 5)) + y / 9 + seed));
  return [v, (v * 3 + seed * 40) % 256, 255 - v];
});
const withPixel = (img: RgbaImage, x: number, y: number): RgbaImage => {
  const data = new Uint8Array(img.data);
  data.set([255 - data[(y * SIZE + x) * 4]!, 0, 255, 255], (y * SIZE + x) * 4);
  return { ...img, data };
};

describe('dhash', () => {
  it('is 64-bit and stable for identical buffers', () => {
    const a = pattern(1);
    const h = dhash(a);
    expect(toHex(h)).toHaveLength(16);
    expect(dhash({ ...a, data: new Uint8Array(a.data) })).toBe(h);
    expect(hamming(h, h)).toBe(0);
  });
  it('a 1-pixel change keeps Hamming ≤ 2; distinct images are far apart', () => {
    const a = pattern(1);
    expect(hamming(dhash(a), dhash(withPixel(a, 30, 30)))).toBeLessThanOrEqual(DISTINCTNESS.maxHamming);
    expect(hamming(dhash(a), dhash(pattern(5)))).toBeGreaterThan(DISTINCTNESS.maxHamming);
  });
  it('hamming counts differing bits', () => {
    expect(hamming(0n, 0b1011n)).toBe(3);
    expect(hamming(0xffff_ffff_ffff_ffffn, 0n)).toBe(64);
  });
  it('averages over area and treats transparency as composited on white', () => {
    const clear = { data: new Uint8Array(SIZE * SIZE * 4), width: SIZE, height: SIZE };
    expect([...luminanceGrid(clear, 2, 2)].map((v) => Math.round(v))).toEqual([255, 255, 255, 255]);
    expect(() => dhash({ data: new Uint8Array(4), width: 2, height: 2 })).toThrow(/buffer length/);
  });
});

describe('duplicate-visual pair rule (Hamming ≤ 2 AND diff ratio < 0.001)', () => {
  const cap = (subject: string, img: RgbaImage, cell = 'c0'): Capture => ({ subject, cell, image: img });
  it('identical captures are duplicates', () => {
    const a = pattern(2);
    expect(comparePair(cap('A', a), cap('B', a))).toMatchObject({ hamming: 0, diffRatio: 0, duplicate: true });
  });
  it('1-pixel-different captures are duplicates (1/4096 < 0.001)', () => {
    const a = pattern(2);
    const r = comparePair(cap('A', a), cap('B', withPixel(a, 10, 50)));
    expect(r.diffRatio).toBeCloseTo(1 / (SIZE * SIZE), 6);
    expect(r.duplicate).toBe(true);
  });
  it('distinct captures are not duplicates', () => {
    expect(comparePair(cap('A', pattern(2)), cap('B', pattern(9))).duplicate).toBe(false);
  });
  it('same hash but ≥ 0.1 % of pixels changed is not a duplicate', () => {
    const a = pattern(3);
    let b = a;
    for (let i = 0; i < 8; i++) b = withPixel(b, 3 + i * 7, 5 + i * 6);    // 8/4096 ≈ 0.2 %
    const r = comparePair(cap('A', a), cap('B', b));
    expect(r.hamming).toBeLessThanOrEqual(DISTINCTNESS.maxHamming);
    expect(r.diffRatio).toBeGreaterThanOrEqual(DISTINCTNESS.maxDiffRatio);
    expect(r.duplicate).toBe(false);
  });
  it('different sizes never compare equal', () => {
    expect(diffRatio(pattern(1), { data: new Uint8Array(4 * 4 * 4), width: 4, height: 4 })).toBe(1);
  });
});

describe('90 % rule', () => {
  /** A and B share `dupCells` of 10 cells; the rest are distinct. */
  const matrix = (dupCells: number): Capture[] => Array.from({ length: 10 }, (_, i) => {
    const base = pattern(10 + i);
    return [{ subject: 'A', cell: `cell-${i}`, image: base },
      { subject: 'B', cell: `cell-${i}`, image: i < dupCells ? base : pattern(40 + i) }];
  }).flat();

  it('a visual subject duplicating another in 9/10 cells fails', () => {
    const r = checkDistinctness(matrix(9), () => 'visual');
    expect(r.subjects.map((s) => [s.subject, s.duplicateCells, s.cells, s.verdict])).toEqual([['A', 9, 10, 'fail'], ['B', 9, 10, 'fail']]);
    expect(r.failures[0]).toMatch(/^duplicate-visual: 'A' \(visual\) duplicates B in 9\/10 cells/);
  });
  it('the same pair passes when the duplicate subject is classified alias', () => {
    const r = checkDistinctness(matrix(9), (s) => (s === 'B' ? 'alias' : 'visual'));
    expect(r.subjects.find((s) => s.subject === 'B')?.verdict).toBe('pass');
    // A is still a visual subject that duplicates B in 90 % of cells
    expect(r.failures).toHaveLength(1);
    const both = checkDistinctness(matrix(9), () => 'alias');
    expect(both.failures).toEqual([]);
  });
  it('8/10 duplicate cells is below the threshold and passes', () => {
    const r = checkDistinctness(matrix(8), () => 'visual');
    expect(r.failures).toEqual([]);
    expect(r.subjects.every((s) => s.share === 0.8)).toBe(true);
  });
  it('rejects a subject captured twice in one cell', () => {
    const a = pattern(1);
    expect(() => checkDistinctness([{ subject: 'A', cell: 'c', image: a }, { subject: 'A', cell: 'c', image: a }], () => 'visual'))
      .toThrow(/captured twice/);
  });
});
