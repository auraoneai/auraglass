/** @jest-environment jsdom */
/* REQ-QUAL-36 — Blur Cost Index (packages/qa/src/perf/bci.ts).
   Acceptance: full-viewport 20 px = 1.0; 12 px scrim = 0.6; 4.1 modal fixture ≥ 2.4; never capped at 1.
   The arithmetic is exercised directly; the page-side collector is exercised in jsdom through its injected
   environment (jsdom has no layout engine and no ::before styles). The same collector runs against real layout in
   Chromium in tests/perf/qual/harness-selftest.spec.ts (remote L10). */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import {
  BCI_REFERENCE_BLUR_PX, blurRadiusPx, clippedArea, collectBlurLayers, computeBci, summarizeBlurCost,
  type BlurEnv, type LayerRect,
} from '../src/perf/bci';

const DESKTOP = { width: 1440, height: 900 };
const full = (vp: { width: number; height: number }): LayerRect => ({ x: 0, y: 0, width: vp.width, height: vp.height });

describe('computeBci (§4.6 formula)', () => {
  it('full-viewport 20 px surface = 1.0', () => {
    expect(BCI_REFERENCE_BLUR_PX).toBe(20);
    expect(computeBci([{ rect: full(DESKTOP), blurPx: 20 }], DESKTOP)).toBeCloseTo(1.0, 10);
  });

  it('full-viewport 12 px scrim = 0.6', () => {
    expect(computeBci([{ rect: full(DESKTOP), blurPx: 12 }], DESKTOP)).toBeCloseTo(0.6, 10);
  });

  it('is not capped at 1: two stacked full-viewport 20 px layers = 2.0', () => {
    expect(computeBci([{ rect: full(DESKTOP), blurPx: 20 }, { rect: full(DESKTOP), blurPx: 20 }], DESKTOP)).toBeCloseTo(2.0, 10);
  });

  it('clips each layer to the viewport', () => {
    const overhang: LayerRect = { x: -720, y: 0, width: 1440, height: 1800 };     // half off-screen horizontally, double height
    expect(clippedArea(overhang, DESKTOP)).toBe(720 * 900);
    expect(computeBci([{ rect: overhang, blurPx: 20 }], DESKTOP)).toBeCloseTo(0.5, 10);
    expect(computeBci([{ rect: { x: 2000, y: 0, width: 100, height: 100 }, blurPx: 32 }], DESKTOP)).toBe(0);
  });

  it('rejects a zero-area viewport instead of dividing by zero', () => {
    expect(() => computeBci([], { width: 0, height: 900 })).toThrow(/no area/);
  });
});

describe('4.1 modal fixture (v4.1.0 remote evidence, E14)', () => {
  const fixture = JSON.parse(readFileSync(join(__dirname, 'fixtures/bci/glass-modal-4.1.json'), 'utf8')) as {
    viewports: Record<'mobile' | 'desktop', { width: number; height: number }>;
    records: Array<{ viewport: 'mobile' | 'desktop'; visibleBackdropCount: number; topGlass: Array<{ box: [number, number, number, number]; backdropFilter: string }> }>;
  };
  const mobile = fixture.records.find((r) => r.viewport === 'mobile');

  it('has the measured mobile record with its 12 visible backdrops', () => {
    expect(mobile).toBeDefined();
    expect(mobile!.visibleBackdropCount).toBe(12);
    expect(mobile!.topGlass).toHaveLength(3);
  });

  it('BCI ≥ 2.4 from the three largest measured layers alone (a lower bound)', () => {
    const layers = mobile!.topGlass.map((g) => ({
      rect: { x: g.box[0], y: g.box[1], width: g.box[2], height: g.box[3] },
      blurPx: blurRadiusPx(g.backdropFilter),
    }));
    expect(layers.map((l) => l.blurPx)).toEqual([24, 40, 24]);
    expect(computeBci(layers, fixture.viewports.mobile)).toBeGreaterThanOrEqual(2.4);
  });
});

describe('blurRadiusPx', () => {
  it('reads the blur() radius out of a filter chain', () => {
    expect(blurRadiusPx('blur(20px) saturate(1.8) brightness(1.05)')).toBe(20);
    expect(blurRadiusPx('saturate(1.4)')).toBe(0);
    expect(blurRadiusPx('none')).toBe(0);
    expect(blurRadiusPx('')).toBe(0);
  });
  it('adds the stdDeviation of a referenced SVG lens filter', () => {
    expect(blurRadiusPx('url("#ag-lens-3") blur(12px)', (id) => (id === 'ag-lens-3' ? 8 : 0))).toBe(20);
  });
});

/* ---------------- collector in jsdom through the injected environment ---------------- */

type Style = ReturnType<BlurEnv['style']>;
const NONE: Style = { backdropFilter: 'none', filter: 'none', content: 'none', position: 'static', visibility: 'visible', opacity: '1',
  display: 'block', left: 'auto', top: 'auto', width: 'auto', height: 'auto', borderLeftWidth: '0px', borderTopWidth: '0px' };

function envFor(html: string, viewport = DESKTOP, styles: Record<string, { el?: Partial<Style>; before?: Partial<Style>; rect: LayerRect }> = {}): BlurEnv {
  document.body.innerHTML = html;
  return {
    document,
    viewport,
    style(el, pseudo) {
      const spec = styles[el.id];
      if (!spec) return NONE;
      return { ...NONE, ...(pseudo ? spec.before : spec.el) } as Style;
    },
    rect(el) { return styles[el.id]?.rect ?? { x: 0, y: 0, width: 0, height: 0 }; },
  };
}

describe('collectBlurLayers', () => {
  it('full-viewport 20 px surface = 1.0 through the collector', () => {
    const env = envFor('<div id="a"></div>', DESKTOP, { a: { el: { backdropFilter: 'blur(20px) saturate(1.8)' }, rect: full(DESKTOP) } });
    const cost = summarizeBlurCost(collectBlurLayers(env));
    expect(cost.bci).toBeCloseTo(1.0, 10);
    expect(cost.blurredSurfaces).toBe(1);
    expect(cost.maxBlurPx).toBe(20);
  });

  it('counts ::before backdrops (the AuraGlass 5 material layer) and the 12 px scrim = 0.6', () => {
    const env = envFor('<div id="scrim"></div>', DESKTOP, {
      scrim: { el: { position: 'fixed' }, before: { content: '""', position: 'absolute', backdropFilter: 'blur(12px)', left: '0px', top: '0px', width: '1440px', height: '900px' }, rect: full(DESKTOP) },
    });
    const snap = collectBlurLayers(env);
    expect(snap.layers.map((l) => l.kind)).toEqual(['before']);
    expect(summarizeBlurCost(snap).bci).toBeCloseTo(0.6, 10);
  });

  it('computes effective nesting from ancestors with a ::before backdrop', () => {
    const r = { x: 100, y: 100, width: 200, height: 200 };
    const before = { content: '""', backdropFilter: 'blur(20px)' };
    const env = envFor('<div id="o"><div id="m"><div id="i"></div></div></div>', DESKTOP, {
      o: { before, rect: r }, m: { before, rect: r }, i: { before, rect: r },
    });
    const snap = collectBlurLayers(env);
    expect(snap.layers.map((l) => l.nesting)).toEqual([0, 1, 2]);
    expect(summarizeBlurCost(snap).maxEffectiveNesting).toBe(2);
  });

  it('ignores hidden, transparent and off-screen layers', () => {
    const blur = { backdropFilter: 'blur(32px)' };
    const env = envFor('<div id="h"></div><div id="p"><div id="c"></div></div><div id="off"></div>', DESKTOP, {
      h: { el: { ...blur, visibility: 'hidden' }, rect: full(DESKTOP) },
      p: { el: { opacity: '0' }, rect: full(DESKTOP) },
      c: { el: blur, rect: full(DESKTOP) },
      off: { el: blur, rect: { x: 0, y: 2000, width: 100, height: 100 } },
    });
    const cost = summarizeBlurCost(collectBlurLayers(env));
    expect(cost.bci).toBe(0);
    expect(cost.blurredSurfaces).toBe(0);
  });

  it('resolves url(#lens) to the SVG filter blur and counts active SVG filters', () => {
    const env = envFor(
      '<svg><filter id="ag-lens-1"><feGaussianBlur stdDeviation="10"></feGaussianBlur></filter></svg><div id="lens"></div>',
      DESKTOP,
      { lens: { el: { backdropFilter: 'url("#ag-lens-1") blur(10px)' }, rect: full(DESKTOP) } },
    );
    const cost = summarizeBlurCost(collectBlurLayers(env));
    expect(cost.maxBlurPx).toBe(20);
    expect(cost.bci).toBeCloseTo(1.0, 10);
    expect(cost.activeSvgFilters).toBe(1);
  });
});
