/** @jest-environment node */
/* REQ-MAT-65 (D.3-39): the colour math behind
   tests/visual/mat/a11y/pixel-contrast.spec.ts (scripts/mat/a11y-pixel-contrast.mjs).
   Reference values are the WCAG 2.x definitions (black/white 21:1, #777 on
   white 4.48:1). */
import { describe, expect, it } from '@jest/globals';
import {
  luminance, contrast, composite, hex, medianPixel, glyphCore, requiredRatio, loadContract,
} from '../../scripts/mat/a11y-pixel-contrast.mjs';

const T = loadContract(process.cwd()).thresholds;

/** w x h RGBA buffer filled by fn(x, y). */
function buf(w: number, h: number, fn: (x: number, y: number) => [number, number, number]) {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const [r, g, b] = fn(x, y);
    d.set([r, g, b, 255], (y * w + x) * 4);
  }
  return d;
}

describe('WCAG contrast math', () => {
  it('luminance and ratio match the WCAG definitions', () => {
    expect(luminance([255, 255, 255])).toBeCloseTo(1, 6);
    expect(luminance([0, 0, 0])).toBe(0);
    expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 6);
    expect(contrast([0x77, 0x77, 0x77], [255, 255, 255])).toBeCloseTo(4.478, 2);
    expect(contrast([10, 20, 30], [200, 100, 50])).toBeCloseTo(contrast([200, 100, 50], [10, 20, 30]), 10);
  });

  it('composites source-over at the given alpha', () => {
    expect(composite([0, 0, 0], 0.5, [255, 255, 255])).toEqual([127.5, 127.5, 127.5]);
    expect(composite([10, 20, 30], 1, [255, 0, 0])).toEqual([10, 20, 30]);
    expect(hex([255, 0, 127.6])).toBe('#ff0080');
  });

  it('medianPixel returns the median-luminance rendered pixel inside the rect', () => {
    // left half black, right half white, one grey column in the middle
    const d = buf(5, 2, (x) => (x < 2 ? [0, 0, 0] : x === 2 ? [128, 128, 128] : [255, 255, 255]));
    expect(medianPixel(d, 5, { x: 0, y: 0, width: 5, height: 2 })).toEqual([128, 128, 128]);
    expect(medianPixel(d, 5, { x: 3, y: 0, width: 2, height: 2 })).toEqual([255, 255, 255]);
    expect(medianPixel(d, 5, { x: 9, y: 9, width: 2, height: 2 })).toBeNull();
  });

  it('glyphCore picks the pixel that differs most from the text-hidden twin', () => {
    const hidden = buf(4, 1, () => [255, 255, 255]);
    const visible = buf(4, 1, (x) => (x === 2 ? [20, 20, 20] : x === 1 ? [180, 180, 180] : [255, 255, 255]));
    expect(glyphCore(visible, hidden, 4, { x: 0, y: 0, width: 4, height: 1 })).toEqual([20, 20, 20]);
    expect(glyphCore(hidden, hidden, 4, { x: 0, y: 0, width: 4, height: 1 })).toBeNull();
  });

  it('requiredRatio: body 4.5, large 3 (>=24px or >=18.66px bold), contrast=more 7', () => {
    expect(requiredRatio({ mode: 'default', fontSizePx: 16, fontWeight: 400 }, T)).toBe(4.5);
    expect(requiredRatio({ mode: 'default', fontSizePx: 24, fontWeight: 400 }, T)).toBe(3);
    expect(requiredRatio({ mode: 'forced', fontSizePx: 19, fontWeight: 700 }, T)).toBe(3);
    expect(requiredRatio({ mode: 'default', fontSizePx: 19, fontWeight: 400 }, T)).toBe(4.5);
    expect(requiredRatio({ mode: 'more', fontSizePx: 32, fontWeight: 700 }, T)).toBe(7);
  });
});
