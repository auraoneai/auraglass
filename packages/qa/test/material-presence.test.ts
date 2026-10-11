/* REQ-QUAL-14 Glass over nothing (QUAL, FIN-430): positive/negative buffers for both halves of the gate. */
import { describe, expect, it } from '@jest/globals';
import { fileURLToPath } from 'node:url';
import { createRaster, fillRect, type Rgba } from '../src/pixel/raster';
import { loadThresholds } from '../src/pixel/thresholds';
import { glassOverNothing, readFloorAlpha, whiteBlackDelta } from '../src/pixel/materialPresence';
import type { TokenManifest } from '../../../src/contracts/tokens';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const T = loadThresholds(ROOT).thresholds.materialPresence;
const BOX = { x: 20, y: 20, w: 60, h: 40 };

/** a textured "photo" region: checker of two luminances (σ ≈ 50 levels) */
function textured(): Rgba {
  const img = createRaster(100, 80);
  for (let y = 0; y < 80; y++) for (let x = 0; x < 100; x++) {
    const v = ((x >> 2) + (y >> 2)) % 2 ? 210 : 110; const o = (y * 100 + x) * 4;
    img.data[o] = v; img.data[o + 1] = v; img.data[o + 2] = v;
  }
  return img;
}

describe('glass-over-nothing', () => {
  it('passes when the scene shows under the hidden surface', () => {
    const r = glassOverNothing(textured(), BOX, 85.6, T);
    expect(r.status).toBe('pass');
    expect(r.value!).toBeGreaterThan(40);
  });
  it('an opaque stage behind the glass fails glass-over-nothing', () => {
    const img = textured(); fillRect(img, { x: 10, y: 10, w: 80, h: 60 }, [28, 32, 40]); // the stage card
    const r = glassOverNothing(img, BOX, 85.6, T);
    expect(r.gate).toBe('glass-over-nothing');
    expect(r.status).toBe('fail');
    expect(r.value!).toBeLessThan(4);
  });
  it('a flat scene (σ < 20) is not applicable; an unknown scene σ is pending, not pass', () => {
    expect(glassOverNothing(createRaster(100, 80, [255, 255, 255]), BOX, 1.2, T).status).toBe('not-applicable');
    expect(glassOverNothing(textured(), BOX, null, T).status).toBe('pending');
  });
});

describe('flat-white vs flat-black interior delta', () => {
  const over = (l: number) => createRaster(100, 80, [l, l, l]);
  it('regular shows the scene: Δ ≥30 passes, Δ 10 fails', () => {
    const ok = whiteBlackDelta(over(200), over(150), BOX, { variant: 'regular', thickness: 'regular' }, 0.6, T);
    expect(ok.find((r) => r.gate === 'glass-shows-scene')!.status).toBe('pass');
    const bad = whiteBlackDelta(over(160), over(150), BOX, { variant: 'regular', thickness: 'regular' }, 0.6, T);
    expect(bad.find((r) => r.gate === 'glass-shows-scene')!.status).toBe('fail');
  });
  it('the tint floor bounds the show-through: Δ ≤ (1−floorAlpha)·255+5', () => {
    // floorAlpha 0.6 → max 107
    const ok = whiteBlackDelta(over(200), over(100), BOX, { variant: 'clear', thickness: 'thin' }, 0.6, T);
    expect(ok).toEqual([expect.objectContaining({ gate: 'glass-tint-floor', status: 'pass' })]);
    const bad = whiteBlackDelta(over(240), over(20), BOX, { variant: 'clear', thickness: 'thin' }, 0.6, T);
    expect(bad[0]!.status).toBe('fail');
    expect(bad[0]!.limit).toBeCloseTo(107, 5);
  });
  it('a missing floor key yields pending, not pass', () => {
    const r = whiteBlackDelta(over(200), over(100), BOX, { variant: 'regular', thickness: 'thick' }, null, T);
    expect(r.find((x) => x.gate === 'glass-tint-floor')!.status).toBe('pending');
  });
});

describe('readFloorAlpha (S-11 token manifest)', () => {
  const manifest = (value: unknown, name = 'material.material'): TokenManifest => ({ version: 1, generatedFrom: 'tokens/**/*.tokens.json',
    tokens: [{ name, cssVar: '--ag-material', type: 'glass-material', tier: 'material', modes: {}, value: JSON.stringify(value) }] });
  it('reads a nested variants floor', () => {
    expect(readFloorAlpha(manifest({ variants: { regular: { thin: { floorAlpha: 0.58 } } } }), { variant: 'regular', thickness: 'thin' })).toBe(0.58);
  });
  it('reads a flat per-key entry', () => {
    expect(readFloorAlpha(manifest({ floorAlpha: 0.4 }, 'material.clear.thick'), { variant: 'clear', thickness: 'thick' })).toBe(0.4);
  });
  it('returns null when the manifest, the entry or the key is absent (today\'s manifest has no floors)', () => {
    expect(readFloorAlpha(null, { variant: 'regular', thickness: 'thin' })).toBeNull();
    expect(readFloorAlpha(manifest({ variants: { regular: { thin: { alpha: 0.72 } } } }), { variant: 'regular', thickness: 'thin' })).toBeNull();
    expect(readFloorAlpha(manifest({ floorAlpha: 0.4 }, 'material.clear.thick'), { variant: 'clear', thickness: 'thin' })).toBeNull();
  });
});
