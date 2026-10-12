/* REQ-CMP-36: unit proof of the glyph-vs-surface measurement the L6 spec
   (tests/visual/cmp/controls/icon-button-contrast.spec.ts) applies per scene. */
import { describe, expect, it } from '@jest/globals';
import { createRaster, fillRect, over, type Rgb } from '../../packages/qa/src/pixel/raster';
import { GLYPH_MIN_CONTRAST, measureGlyphContrast } from '../visual/cmp/controls/glyph-contrast';

const BOX = { x: 4, y: 4, w: 12, h: 12 };
const round = (c: Rgb): Rgb => [Math.round(c[0]), Math.round(c[1]), Math.round(c[2])];

/** surface + a 4x4 solid glyph core ringed by 50% anti-aliased edge pixels */
function frames(surface: Rgb, glyph: Rgb) {
  const hidden = createRaster(20, 20, surface);
  const shown = createRaster(20, 20, surface);
  fillRect(shown, { x: 7, y: 7, w: 6, h: 6 }, round(over(glyph, 0.5, surface)));
  fillRect(shown, { x: 8, y: 8, w: 4, h: 4 }, glyph);
  return { shown, hidden };
}

describe('measureGlyphContrast (REQ-CMP-36)', () => {
  it('measures the solid glyph core, not the anti-aliased edge', () => {
    const { shown, hidden } = frames([255, 255, 255], [0, 0, 0]);
    const m = measureGlyphContrast(shown, hidden, BOX)!;
    expect(m.glyphPixels).toBe(36);
    expect(m.glyph).toEqual([0, 0, 0]);
    expect(m.surface).toEqual([255, 255, 255]);
    expect(m.ratio).toBeCloseTo(21, 5);
  });

  it('passes a dark-on-light glyph at >= 3:1 and fails a low-contrast one', () => {
    const ok = frames([240, 240, 240], [90, 90, 90]);
    expect(measureGlyphContrast(ok.shown, ok.hidden, BOX)!.ratio).toBeGreaterThanOrEqual(GLYPH_MIN_CONTRAST);
    const weak = frames([240, 240, 240], [180, 180, 180]);
    const m = measureGlyphContrast(weak.shown, weak.hidden, BOX)!;
    expect(m.ratio).toBeLessThan(GLYPH_MIN_CONTRAST);
    expect(m.glyph).toEqual([180, 180, 180]);
  });

  it('uses the surface under the glyph, not elsewhere in the frame', () => {
    const { shown, hidden } = frames([20, 20, 20], [235, 235, 235]);
    // a bright region outside the icon box must not change the result
    fillRect(shown, { x: 0, y: 0, w: 3, h: 3 }, [255, 255, 255]);
    fillRect(hidden, { x: 0, y: 0, w: 3, h: 3 }, [255, 255, 255]);
    const m = measureGlyphContrast(shown, hidden, BOX)!;
    expect(m.surface).toEqual([20, 20, 20]);
    expect(m.ratio).toBeGreaterThan(10);
  });

  it('returns null when the glyph did not paint', () => {
    const hidden = createRaster(20, 20, [128, 128, 128]);
    const shown = createRaster(20, 20, [128, 128, 128]);
    expect(measureGlyphContrast(shown, hidden, BOX)).toBeNull();
  });

  it('rejects mismatched captures and an invalid core fraction', () => {
    const a = createRaster(20, 20);
    expect(() => measureGlyphContrast(a, createRaster(10, 10), BOX)).toThrow(/raster size/);
    expect(() => measureGlyphContrast(a, a, BOX, { coreFraction: 0 })).toThrow(/coreFraction/);
  });
});
