/* REQ-QUAL-15 (+ REQ-QUAL-18 pure parts) pixel gates (QUAL, FIN-430): one passing and one failing fixture per gate,
   all on in-memory rasters (no PNG decoder, no committed PNG), thresholds from certification/thresholds.json. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { cloneRaster, createRaster, fillRect, type Rgba } from '../src/pixel/raster';
import { loadThresholds, parseThresholds } from '../src/pixel/thresholds';
import { notBlank } from '../src/pixel/notBlank';
import { separation } from '../src/pixel/separation';
import { frameFill } from '../src/pixel/frameFill';
import { density } from '../src/pixel/density';
import { neon, rgbToHsv } from '../src/pixel/neon';
import { deltaE2000, intentDelta } from '../src/pixel/intentDelta';
import { changedShare, contrastMoreGate, noBackdropGate, noop, sigmaRatio, tintedGate } from '../src/pixel/preference';
import { analyseLayout, containment, focusIndicator, rightEdgeTouched, targetSizes, type LayoutSnapshot } from '../src/inspect/layout';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const { thresholds: T, sha256 } = loadThresholds(ROOT);

/** a 200×100 "scene" with a gradient so captures are not flat */
function scene(): Rgba {
  const img = createRaster(200, 100);
  for (let y = 0; y < 100; y++) for (let x = 0; x < 200; x++) { const o = (y * 200 + x) * 4; img.data[o] = x; img.data[o + 1] = 120; img.data[o + 2] = y * 2; }
  return img;
}
const SUBJECT = { x: 50, y: 20, w: 100, h: 60 };

describe('thresholds.json', () => {
  it('holds the frozen PRD values and a sha256', () => {
    expect(T.notBlank.minDeviation).toBe(40);
    expect(T.separation).toEqual({ minShare: 0.25, minDelta: 10 });
    expect(T.frameFill).toEqual({ component: 0.03, lab: 0.03, matrix: 0.25, scene: 0.25, showcase: 0.25 });
    expect(T.density.max).toBe(0.3);
    expect([T.neon.maxShare, T.neon.minSaturation, T.neon.minValue, T.neon.maxHueFamilies]).toEqual([0.01, 0.85, 0.85, 3]);
    expect(T.intentDeltaE).toBe(10);
    expect(sha256).toMatch(/^[0-9a-f]{64}$/);
  });
  it('rejects a missing key instead of defaulting', () => {
    const raw = JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8'));
    delete raw.separation.minDelta;
    expect(() => parseThresholds(raw)).toThrow(/separation\.minDelta must be a number/);
  });
});

describe('not-blank', () => {
  it('passes when the subject paints ≥40 levels over the scene', () => {
    const s = scene(); const c = cloneRaster(s); fillRect(c, { x: 60, y: 30, w: 20, h: 10 }, [255, 255, 255]);
    expect(notBlank(c, s, SUBJECT, T.notBlank).status).toBe('pass');
  });
  it('fails when the subject is invisible (≤39 levels)', () => {
    const s = scene(); const c = cloneRaster(s);
    for (let i = 0; i < c.data.length; i += 4) c.data[i + 1] = 120 + 20;
    const r = notBlank(c, s, SUBJECT, T.notBlank);
    expect(r.status).toBe('fail');
    expect(r.value).toBe(20);
  });
});

describe('separation', () => {
  it('passes when ≥25 % of surface pixels differ by >10 from the surface-hidden capture', () => {
    const s = scene(); const c = cloneRaster(s); fillRect(c, { x: 50, y: 20, w: 50, h: 60 }, [240, 240, 240]); // 50 %
    expect(separation(c, s, SUBJECT, T.separation).status).toBe('pass');
  });
  it('fails at 10 % differing pixels', () => {
    const s = scene(); const c = cloneRaster(s); fillRect(c, { x: 50, y: 20, w: 10, h: 60 }, [240, 240, 240]); // 10 %
    const r = separation(c, s, SUBJECT, T.separation);
    expect(r.status).toBe('fail');
    expect(r.value).toBeCloseTo(0.1, 5);
  });
});

describe('frame-fill', () => {
  it('component ≥3 % passes; 2 % fails', () => {
    expect(frameFill({ x: 0, y: 0, w: 1440 * 0.2, h: 900 * 0.2 }, { width: 1440, height: 900 }, 'component', T.frameFill).status).toBe('pass');
    expect(frameFill({ x: 0, y: 0, w: 144, h: 180 }, { width: 1440, height: 900 }, 'component', T.frameFill).status).toBe('fail');
  });
  it('showcase needs ≥25 %: 20 % fails, 30 % passes; off-frame area does not count', () => {
    expect(frameFill({ x: 0, y: 0, w: 1440, h: 180 }, { width: 1440, height: 900 }, 'showcase', T.frameFill).status).toBe('fail');
    expect(frameFill({ x: 0, y: 0, w: 1440, h: 270 }, { width: 1440, height: 900 }, 'showcase', T.frameFill).status).toBe('pass');
    expect(frameFill({ x: -1440, y: 0, w: 1440, h: 900 }, { width: 1440, height: 900 }, 'matrix', T.frameFill).status).toBe('fail');
  });
});

describe('glass-density', () => {
  const vp = { width: 1000, height: 1000 };
  it('passes at 25 % summed backdrop-filter area', () => {
    expect(density([{ x: 0, y: 0, w: 500, h: 500, selector: 'div', pseudo: '', filter: 'blur(20px)' }], vp, T.density).status).toBe('pass');
  });
  it('fails when summed (incl. ::before, viewport-clipped) area exceeds 30 %', () => {
    const r = density([
      { x: 0, y: 0, w: 500, h: 500, selector: 'div', pseudo: '', filter: 'blur(20px)' },
      { x: 0, y: 0, w: 500, h: 500, selector: 'div', pseudo: '::before', filter: 'blur(20px)' },
      { x: 900, y: 900, w: 400, h: 400, selector: 'aside', pseudo: '', filter: 'blur(12px)' },
    ], vp, T.density);
    expect(r.status).toBe('fail');
    expect(r.value).toBeCloseTo(0.51, 5);
  });
});

describe('neon', () => {
  it('HSV conversion', () => {
    expect(rgbToHsv(255, 0, 0)).toEqual({ h: 0, s: 1, v: 1 });
    expect(rgbToHsv(0, 0, 255).h).toBe(240);
  });
  it('passes a calm subject (one hue family, no neon)', () => {
    const c = createRaster(100, 100, [250, 250, 250]); fillRect(c, { x: 10, y: 10, w: 40, h: 40 }, [60, 90, 160]);
    expect(neon(c, { x: 0, y: 0, w: 100, h: 100 }, T.neon).status).toBe('pass');
  });
  it('fails on 5 % neon pixels and on 4 hue families', () => {
    const c = createRaster(100, 100, [250, 250, 250]); fillRect(c, { x: 0, y: 0, w: 50, h: 10 }, [255, 20, 240]);
    expect(neon(c, { x: 0, y: 0, w: 100, h: 100 }, T.neon).detail).toMatch(/neon pixels/);
    const d = createRaster(100, 100, [250, 250, 250]);
    fillRect(d, { x: 0, y: 0, w: 100, h: 5 }, [180, 60, 60]); fillRect(d, { x: 0, y: 5, w: 100, h: 5 }, [60, 180, 60]);
    fillRect(d, { x: 0, y: 10, w: 100, h: 5 }, [60, 60, 180]); fillRect(d, { x: 0, y: 15, w: 100, h: 5 }, [180, 180, 60]);
    const r = neon(d, { x: 0, y: 0, w: 100, h: 100 }, T.neon);
    expect(r.status).toBe('fail');
    expect(r.hueFamilies).toHaveLength(4);
  });
});

describe('intent-delta (CIEDE2000)', () => {
  it('is 0 for identical colours and 100 for black vs white', () => {
    // black vs white spans the full lightness range (ΔE00 = 100)
    expect(deltaE2000([10, 20, 30], [10, 20, 30])).toBe(0);
    expect(deltaE2000([0, 0, 0], [255, 255, 255])).toBeCloseTo(100, 3);
  });
  const boxes = (intent: [number, number, number]) => {
    const c = createRaster(200, 60, [240, 240, 240]);
    fillRect(c, { x: 0, y: 0, w: 90, h: 60 }, [200, 205, 210]);
    fillRect(c, { x: 110, y: 0, w: 90, h: 60 }, intent);
    return { c, boxes: [
      { rect: { x: 0, y: 0, w: 90, h: 60 }, label: 'default', role: 'default' as const },
      { rect: { x: 110, y: 0, w: 90, h: 60 }, label: 'danger', role: 'intent' as const },
    ] };
  };
  it('passes when the intent fill is ≥10 ΔE00 from the default', () => {
    const { c, boxes: b } = boxes([210, 60, 60]);
    expect(intentDelta(c, b, T).status).toBe('pass');
  });
  it('fails when the intent fill is indistinguishable', () => {
    const { c, boxes: b } = boxes([203, 205, 212]);
    const r = intentDelta(c, b, T);
    expect(r.status).toBe('fail');
    expect(r.value!).toBeLessThan(10);
  });
});

describe('layout (port of 4.1 collectLayoutIssues)', () => {
  const base: LayoutSnapshot = { doc: { scrollWidth: 1440, clientWidth: 1440 }, surfaces: [], texts: [], controls: [] };
  const ctl = (id: number, x: number, y: number, w = 100, h = 40) => ({ id, ancestors: [], desc: `button#${id}`, box: { x, y, w, h }, region: { id, ancestors: [], desc: `button#${id}`, box: { x, y, w, h } } });
  it('a clean snapshot has no issues', () => {
    expect(analyseLayout({ ...base, controls: [ctl(1, 0, 0), ctl(2, 0, 60)] })).toEqual([]);
  });
  it('reports overflow, clipping, truncation, overlap and spacing like 4.1', () => {
    const issues = analyseLayout({
      doc: { scrollWidth: 1500, clientWidth: 1440 },
      surfaces: [{ desc: 'div[data-ag-surface]', box: { x: 0, y: 0, w: 100, h: 40 }, scrollW: 140, clientW: 100, scrollH: 60, clientH: 40, overflowX: 'visible', overflowY: 'visible', svg: false, range: false, divider: false }],
      texts: [{ desc: 'span', box: { x: 0, y: 0, w: 80, h: 20 }, scrollW: 120, clientW: 80, scrollH: 20, clientH: 20, lineClamp: 0, lineClampTruncated: false, insideScroll: false, clippedByAncestor: false }],
      controls: [ctl(1, 0, 0), ctl(2, 50, 10), ctl(3, 0, 44)],
    }).map((i) => i.type);
    expect(issues).toEqual(expect.arrayContaining(['horizontal-overflow', 'glass-surface-overflow', 'glass-surface-vertical-clipping', 'text-truncation', 'interactive-overlap', 'control-spacing']));
  });
  it('nested controls and intended scroll viewports are not issues', () => {
    const inner = { id: 2, ancestors: [1], desc: 'span#2', box: { x: 0, y: 0, w: 50, h: 20 }, region: { id: 2, ancestors: [1], desc: 'span#2', box: { x: 0, y: 0, w: 50, h: 20 } } };
    expect(analyseLayout({ ...base, controls: [ctl(1, 0, 0), inner],
      texts: [{ desc: 'p', box: { x: 0, y: 0, w: 80, h: 20 }, scrollW: 200, clientW: 80, scrollH: 20, clientH: 20, lineClamp: 0, lineClampTruncated: false, insideScroll: true, clippedByAncestor: false }] })).toEqual([]);
  });
});

describe('REQ-QUAL-18 containment, right edge, targets, focus', () => {
  it('containment: scrollWidth ≤ clientWidth + 1 passes; +12 fails', () => {
    expect(containment({ scrollWidth: 391, clientWidth: 390 }, T.layout).status).toBe('pass');
    expect(containment({ scrollWidth: 402, clientWidth: 390 }, T.layout).status).toBe('fail');
  });
  it('right edge: a subject pixel in the last column fails', () => {
    const s = createRaster(50, 20, [10, 10, 10]); const c = cloneRaster(s);
    expect(rightEdgeTouched(c, s, 10).status).toBe('pass');
    fillRect(c, { x: 45, y: 5, w: 5, h: 3 }, [200, 200, 200]);
    expect(rightEdgeTouched(c, s, 10).status).toBe('fail');
  });
  it('targets: 44×44 passes, a 20 px target fails; sm 24×24 with spacing passes, crowded sm fails', () => {
    expect(targetSizes([{ desc: 'button', box: { x: 0, y: 0, w: 44, h: 44 }, sm: false }], T.layout).status).toBe('pass');
    expect(targetSizes([{ desc: 'button', box: { x: 0, y: 0, w: 20, h: 20 }, sm: false }], T.layout).status).toBe('fail');
    expect(targetSizes([{ desc: 'a', box: { x: 0, y: 0, w: 24, h: 24 }, sm: true }, { desc: 'b', box: { x: 40, y: 0, w: 24, h: 24 }, sm: true }], T.layout).status).toBe('pass');
    expect(targetSizes([{ desc: 'a', box: { x: 0, y: 0, w: 24, h: 24 }, sm: true }, { desc: 'b', box: { x: 25, y: 0, w: 24, h: 24 }, sm: false }], T.layout).status).toBe('fail');
  });
  it('focus: a dark 2 px ring on white passes; a #ddd ring on white fails; no change fails focus-invisible', () => {
    const un = createRaster(60, 40, [255, 255, 255]); fillRect(un, { x: 10, y: 10, w: 40, h: 20 }, [255, 255, 255]);
    const ring = (c: [number, number, number]) => {
      const f = cloneRaster(un);
      fillRect(f, { x: 6, y: 6, w: 48, h: 2 }, c); fillRect(f, { x: 6, y: 32, w: 48, h: 2 }, c);
      fillRect(f, { x: 6, y: 6, w: 2, h: 28 }, c); fillRect(f, { x: 52, y: 6, w: 2, h: 28 }, c);
      return f;
    };
    const region = { x: 0, y: 0, w: 60, h: 40 };
    expect(focusIndicator(ring([20, 60, 200]), un, region, T.layout).status).toBe('pass');
    const low = focusIndicator(ring([221, 221, 221]), un, region, T.layout);
    expect(low.status).toBe('fail');
    expect(low.value!).toBeLessThan(3);
    expect(focusIndicator(cloneRaster(un), un, region, T.layout).detail).toMatch(/^focus-invisible/);
  });
});

describe('REQ-QUAL-16 preference deltas', () => {
  it('a 0.000 delta is preference-noop; any change is not', () => {
    const a = scene(); const b = cloneRaster(a);
    expect(noop('contrast-more', changedShare(a, b, [SUBJECT], 10)).status).toBe('fail');
    fillRect(b, { x: 60, y: 30, w: 1, h: 1 }, [0, 0, 0]);
    expect(noop('contrast-more', changedShare(a, b, [SUBJECT], 10)).status).toBe('pass');
  });
  it('contrast-more: ≥0.5 % surface pixels changed and worst OCR raised passes; unchanged OCR below 7:1 fails', () => {
    const a = scene(); const b = cloneRaster(a); fillRect(b, { x: 50, y: 20, w: 100, h: 2 }, [0, 0, 0]); // 3.3 %
    const d = changedShare(a, b, [SUBJECT], 10);
    expect(contrastMoreGate(d, 4.6, 5.2, T.preference).every((r) => r.status === 'pass')).toBe(true);
    expect(contrastMoreGate(d, 4.6, 4.6, T.preference)[1]!.status).toBe('fail');
    expect(contrastMoreGate(d, 4.6, 7.4, T.preference)[1]!.status).toBe('pass');
    const one = cloneRaster(a); fillRect(one, { x: 60, y: 30, w: 2, h: 2 }, [0, 0, 0]); // 4 of 6 000 px = 0.07 %
    expect(contrastMoreGate(changedShare(a, one, [SUBJECT], 10), null, null, T.preference)[0]!.status).toBe('fail');
  });
  it('tinted must cut σ(interior)/σ(scene) by ≥25 %', () => {
    const sc = scene(); const glass = cloneRaster(sc);
    const flatten = (img: Rgba, k: number) => { for (let i = 0; i < img.data.length; i += 4) for (let c = 0; c < 3; c++) img.data[i + c] = Math.round(128 + (img.data[i + c]! - 128) * k); };
    flatten(glass, 0.8); const tinted = cloneRaster(sc); flatten(tinted, 0.4);
    const rd = sigmaRatio(glass, sc, SUBJECT); const rt = sigmaRatio(tinted, sc, SUBJECT);
    expect(tintedGate(rd, rt, T.preference, 'surface').status).toBe('pass');
    expect(tintedGate(rd, sigmaRatio(glass, sc, SUBJECT), T.preference, 'surface').status).toBe('fail');
  });
  it('solid / forced-colors: any remaining backdrop-filter (incl. ::before) fails', () => {
    expect(noBackdropGate('solid', []).status).toBe('pass');
    expect(noBackdropGate('forced-colors', [{ x: 0, y: 0, w: 10, h: 10, selector: 'div[data-ag-surface]', pseudo: '::before', filter: 'blur(20px)' }]).status).toBe('fail');
  });
});

describe('no PNG decoder dependency (REQ-QUAL-15)', () => {
  it('package.json declares none', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as Record<string, Record<string, string> | undefined>;
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies });
    const decoders = ['pngjs', 'upng-js', 'fast-png', 'png-js', 'sharp', 'jimp', 'canvas', '@napi-rs/canvas', 'skia-canvas', 'image-js', 'node-libpng', 'lodepng', '@jsquash/png'];
    expect(deps.filter((d) => decoders.includes(d))).toEqual([]);
  });
});
