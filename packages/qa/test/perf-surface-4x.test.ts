/** @jest-environment node */
/* packages/qa/test/perf-surface-4x.test.ts — REQ-QUAL-38 surface-budget cell evaluator, REQ-QUAL-41 4.1-regression verdict
   (incl. a fixture throttled below 50 fps), and the L10 Playwright verdict's pending rule. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { parsePerfThresholds } from '../src/perf/budgets';
import { evaluateSurfaceCell } from '../src/perf/surfaceBudget';
import { fpsOf, regression4xRow } from '../src/perf/regression4x';
import type { BlurLayer, BlurLayerSnapshot } from '../src/perf/bci';
import { verdict } from '../../../scripts/qual/perf/pw-verdict.mjs';

const ROOT = join(__dirname, '../../..');
const t = parsePerfThresholds(JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8')));
const VP = { width: 1440, height: 900 };
let host = 0;
const layer = (o: Partial<BlurLayer> & { w?: number; h?: number }): BlurLayer => ({ kind: 'before', host: o.host ?? host++, tag: 'div', part: o.part ?? 'root',
  rect: o.rect ?? { x: 0, y: 0, width: o.w ?? 200, height: o.h ?? 100 }, backdropFilter: o.backdropFilter ?? 'blur(16px)', blurPx: o.blurPx ?? 16, nesting: o.nesting ?? 0 });
const snap = (layers: BlurLayer[]): BlurLayerSnapshot => ({ viewport: VP, layers, activeSvgFilters: 0 });
const ev = (layers: BlurLayer[], o: { pointer?: 'fine' | 'coarse'; scrim?: number[]; nested?: number[]; webgl?: number; budgets?: { blurredSurfaces: number; bci: number } } = {}) =>
  evaluateSurfaceCell({ pointer: o.pointer ?? 'fine', snapshot: snap(layers),
    hosts: layers.map((l) => ({ host: l.host, scrim: (o.scrim ?? []).includes(l.host), allowNested: (o.nested ?? []).includes(l.host) })),
    liveWebglContexts: o.webgl ?? 0 }, o.budgets ?? { blurredSurfaces: 6, bci: 2 }, t).violations;

describe('surface budget cell', () => {
  it('a Dialog-like cell (scrim 12 px + panel) passes', () => {
    const scrim = layer({ host: 900, rect: { x: 0, y: 0, ...VP }, blurPx: 12, backdropFilter: 'blur(12px)' });
    expect(ev([scrim, layer({ w: 480, h: 320 })], { scrim: [900] })).toEqual([]);
  });
  it('more blurred surfaces than the budget fail; an owner row can tighten it', () => {
    const seven = Array.from({ length: 7 }, () => layer({ w: 40, h: 40 }));
    expect(ev(seven)).toEqual(['blurred-surfaces 7 > 6']);
    expect(ev(seven.slice(0, 2), { budgets: { blurredSurfaces: 1, bci: 2 } })).toEqual(['blurred-surfaces 2 > 1']);
  });
  it('BCI over budget fails', () => {
    const big = layer({ rect: { x: 0, y: 0, ...VP }, blurPx: 32, backdropFilter: 'blur(32px)' });
    expect(ev([big, layer({ rect: { x: 0, y: 0, ...VP }, blurPx: 20 })], { scrim: [] })).toEqual(expect.arrayContaining([expect.stringMatching(/^bci 2\.600 > 2$/)]));
  });
  it('nesting >1 fails unless data-ag-allow-nested (then ≤2)', () => {
    expect(ev([layer({ host: 1, nesting: 2 })])).toEqual(['effective nesting 2 > 1 at div[data-ag-part=root]::before']);
    expect(ev([layer({ host: 2, nesting: 2 })], { nested: [2] })).toEqual([]);
    expect(ev([layer({ host: 3, nesting: 3 })], { nested: [3] })).toEqual(['effective nesting 3 > 2 at div[data-ag-part=root]::before']);
  });
  it('blur radius >32 px fails', () => { expect(ev([layer({ blurPx: 40 })])).toEqual(['blur radius 40px > 32px at div[data-ag-part=root]::before']); });
  it('full-viewport blur only on the scrim layer, ≤12 px', () => {
    const full = (h: number, px: number) => layer({ host: h, rect: { x: 0, y: 0, ...VP }, blurPx: px });
    expect(ev([full(10, 8)])).toEqual([expect.stringMatching(/^full-viewport blur \(100% of the viewport\) outside data-ag-layer="scrim"/)]);
    expect(ev([full(11, 16)], { scrim: [11] })).toEqual(['full-viewport scrim blur 16px > 12px at div[data-ag-part=root]::before']);
  });
  it('refracting surfaces: ≤2 fine / ≤1 coarse, each ≤25 % of the viewport', () => {
    const lens = (w: number, h: number) => layer({ w, h, backdropFilter: 'url(#ag-lens-1) blur(8px)', blurPx: 8 });
    expect(ev([lens(100, 100), lens(100, 100)])).toEqual([]);
    expect(ev([lens(100, 100), lens(100, 100)], { pointer: 'coarse', budgets: { blurredSurfaces: 3, bci: 1.2 } })).toEqual(['refracting surfaces 2 > 1 (coarse)']);
    expect(ev([lens(800, 500)])[0]).toMatch(/^refracting surface covers 30\.9% > 25% of the viewport/);
  });
  it('more than one live WebGL context fails', () => { expect(ev([], { webgl: 2 })).toEqual(['live WebGL contexts 2 > 1']); });
});

describe('regression vs 4.1 (profile c)', () => {
  const w = (frames: number, longTasks = 0) => ({ durationMs: 5000, frames: { count: frames }, longTasks: { count: longTasks } });
  it('fps = presented frames / settled seconds', () => { expect(fpsOf(w(300))).toBe(60); expect(fpsOf(null)).toBeNull(); });
  it('≥50 fps, ≥0.85× blank and 0 library long tasks passes', () => {
    expect(regression4xRow({ subject: 'Dialog', viewport: 'desktop', window: w(290), blank: w(300) }, t.regression4x).failures).toEqual([]);
  });
  it('a fixture throttled below 50 fps fails (the 4.1 modal measured 12 fps)', () => {
    const r = regression4xRow({ subject: 'Dialog', viewport: 'mobile', window: w(60), blank: w(300) }, t.regression4x);
    expect(r.fps).toBe(12);
    expect(r.failures).toEqual(['12.0 fps < 50 fps', '0.200× blank < 0.85× (blank 60.0 fps)']);
  });
  it('≥50 fps but <0.85× blank fails; extra long tasks vs blank fail; missing data fails', () => {
    expect(regression4xRow({ subject: 'S', viewport: 'desktop', window: w(255), blank: w(600) }, t.regression4x).failures).toEqual(['0.425× blank < 0.85× (blank 120.0 fps)']);
    expect(regression4xRow({ subject: 'S', viewport: 'desktop', window: w(300, 3), blank: w(300, 1) }, t.regression4x).failures)
      .toEqual(['2 long task(s) >50 ms beyond the blank fixture during the interaction']);
    expect(regression4xRow({ subject: 'S', viewport: 'desktop', window: null, blank: null }, t.regression4x).failures).toHaveLength(3);
  });
});

describe('L10 Playwright verdict (lane-runner pending rule)', () => {
  const rep = (...errs: Array<string | null>) => ({ suites: [{ specs: errs.map((e, i) => ({ title: `t${i}`, tests: [{ status: e === null ? 'expected' : 'unexpected',
    results: [{ error: e === null ? undefined : { message: e } }] }] })) }] });
  it('all pass → 0; all-pending below release → 0 (PENDING); pending at release → 1; a real failure → 1; 0 tests → 1', () => {
    expect(verdict(rep(null, null), 'pr').code).toBe(0);
    expect(verdict(rep(null, 'Error: pending: 3 seed subject(s)'), 'main')).toEqual({ code: 0, line: 'PENDING pending: 3 seed subject(s)' });
    expect(verdict(rep('Error: pending: x'), 'release').code).toBe(1);
    expect(verdict(rep('Error: pending: x', 'expect(received).toEqual(expected)'), 'pr').code).toBe(1);
    expect(verdict({ suites: [] }, 'pr').code).toBe(1);
  });
  it('a passing report with a non-zero Playwright exit is a failure', () => { expect(verdict(rep(null), 'pr', 1).code).toBe(1); });
});
