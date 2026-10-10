/** @jest-environment node */
/* tests/perf/qual/run-perf.test.mjs — node-side unit checks of the L10 harness (REQ-QUAL-34/-35).
   The browser measurements themselves run only remotely (tests/perf/qual/harness-selftest.spec.ts, qual:certify:l10). */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import {
  BLANK_ID, FIXTURE_IDS, REMOTE_ONLY_MESSAGE, ROOT, SETTLED_LONG_FRAME_LIMIT, analyzeTrace, cdpDelta, deltaVsBlank, evaluateFailures,
  eventTimingStats, findSizeRow, frameStats, markTs, parseArgs, quantile, softwareFlags, storyUrl, validateResults,
} from '../harness/run-perf.mjs';

const HARNESS = join(ROOT, 'tests/perf/harness/run-perf.mjs');

describe('remote-only guard', () => {
  it('exits 2 with "remote-only" without AG_REMOTE_RUNNER=1', () => {
    const env = { ...process.env };
    delete env.AG_REMOTE_RUNNER;
    const r = spawnSync(process.execPath, [HARNESS, '--profile', 'c'], { env, encoding: 'utf8' });
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('remote-only');
    expect(r.stderr.trim()).toBe(REMOTE_ONLY_MESSAGE);
  });
});

describe('statistics', () => {
  it('quantile uses the nearest-rank method', () => {
    const s = Array.from({ length: 100 }, (_, i) => i + 1);
    expect(quantile(s, 0.5)).toBe(50);
    expect(quantile(s, 0.95)).toBe(95);
    expect(quantile(s, 0.99)).toBe(99);
    expect(quantile([], 0.5)).toBeNull();
  });
  it('frameStats counts frames and missed vsyncs', () => {
    const stamps = [0, 16.7, 33.4, 83.5, 100.2];       // one 50 ms gap = 2 missed vsyncs at 60 Hz
    const f = frameStats(stamps, 1000 / 60, 'raf');
    expect(f.count).toBe(5);
    expect(f.missedVsyncs).toBe(2);
    expect(f.dropped).toBe(2);
    expect(f.p99Ms).toBeCloseTo(50.1, 5);
  });
});

/* A synthetic Chrome trace: two marks, DrawFrame every 16.667 ms on the renderer, one DroppedFrame, task slices. */
function syntheticTrace() {
  const ev = [];
  const us = (ms) => Math.round(ms * 1000);
  ev.push({ name: 'ag-perf:settled:start', cat: 'blink.user_timing', ph: 'R', ts: us(1000), pid: 7, tid: 1 });
  for (let i = 0; i <= 60; i++) ev.push({ name: 'DrawFrame', cat: 'disabled-by-default-devtools.timeline.frame', ph: 'I', ts: us(1000 + i * (1000 / 60)) + (i === 30 ? us(1000 / 60) : 0), pid: 7, tid: 2 });
  ev.push({ name: 'DrawFrame', cat: 'disabled-by-default-devtools.timeline.frame', ph: 'I', ts: us(1500), pid: 9, tid: 2 });   // another process
  ev.push({ name: 'DroppedFrame', cat: 'disabled-by-default-devtools.timeline.frame', ph: 'I', ts: us(1500), pid: 7, tid: 2 });
  ev.push({ name: 'CompositeLayers', cat: 'devtools.timeline', ph: 'X', ts: us(1100), dur: us(2), pid: 7, tid: 1 });
  ev.push({ name: 'RasterTask', cat: 'disabled-by-default-devtools.timeline', ph: 'X', ts: us(1200), dur: us(3), pid: 7, tid: 3 });
  ev.push({ name: 'RasterTask', cat: 'disabled-by-default-devtools.timeline', ph: 'X', ts: us(1300), dur: us(1), pid: 7, tid: 3 });
  ev.push({ name: 'GPUTask', cat: 'gpu', ph: 'X', ts: us(1400), dur: us(4), pid: 3, tid: 1 });
  ev.push({ name: 'RasterTask', cat: 'disabled-by-default-devtools.timeline', ph: 'X', ts: us(5000), dur: us(9), pid: 7, tid: 3 });  // outside
  ev.push({ name: 'ag-perf:settled:end', cat: 'blink.user_timing', ph: 'R', ts: us(2000), pid: 7, tid: 1 });
  return { traceEvents: ev };
}

describe('analyzeTrace', () => {
  it('slices by the performance marks and derives frames and compositor/raster/GPU tasks', () => {
    const trace = syntheticTrace();
    const a = markTs(trace, 'ag-perf:settled:start'); const b = markTs(trace, 'ag-perf:settled:end');
    expect([a, b]).toEqual([1_000_000, 2_000_000]);
    const t = analyzeTrace(trace, { startUs: a, endUs: b, vsyncMs: 1000 / 60 });
    expect(t.frames.source).toBe('trace');
    expect(t.frames.count).toBe(60);                     // frame 30 slipped onto frame 31's slot (deduplicated), pid 9 ignored
    expect(t.frames.dropped).toBe(1);
    expect(t.frames.missedVsyncs).toBe(1);
    expect(t.frames.p50Ms).toBeCloseTo(16.667, 2);
    expect(t.trace.compositeLayers).toEqual({ count: 1, totalMs: 2 });
    expect(t.trace.rasterTask).toEqual({ count: 2, totalMs: 4 });
    expect(t.trace.gpuTask).toEqual({ count: 1, totalMs: 4 });
  });
  it('rejects input that is not a trace', () => {
    expect(() => analyzeTrace({}, { startUs: 0, endUs: 1, vsyncMs: 16 })).toThrow(/not a Chrome trace/);
  });
});

describe('CDP and event timing', () => {
  it('cdpDelta reports layout/style deltas (durations in ms) and null when a metric is missing', () => {
    const m = (v) => ({ metrics: [{ name: 'LayoutCount', value: v }, { name: 'LayoutDuration', value: v / 100 }, { name: 'RecalcStyleCount', value: 2 * v }, { name: 'RecalcStyleDuration', value: v / 50 }] });
    const d = cdpDelta(m(10), m(15));
    expect([d.layoutCount, d.recalcStyleCount]).toEqual([5, 10]);
    expect(d.layoutDurationMs).toBeCloseTo(50, 9);
    expect(d.recalcStyleDurationMs).toBeCloseTo(100, 9);
    expect(cdpDelta(m(10), { metrics: [] })).toBeNull();
  });
  it('event timing: a dispatched event with no ≥16 ms entry is below threshold, not missing', () => {
    const e = eventTimingStats([{ name: 'keydown', startTime: 1, duration: 40 }], { pointerdown: 1, keydown: 1 });
    expect(e.pointerdown).toEqual({ dispatched: 1, entries: 0, maxMs: null, belowThresholdMs: 16 });
    expect(e.keydown.maxMs).toBe(40);
  });
});

const win = (over = {}) => ({
  startMs: 0, durationMs: 5000, frames: { count: 300, p50Ms: 16.7, p95Ms: 16.7, p99Ms: 16.8, dropped: 0, missedVsyncs: 0, vsyncMs: 16.67, source: 'trace' },
  raf: { count: 300, p50Ms: 16.7, p95Ms: 16.7, p99Ms: 16.8 }, rafGapsOver100ms: 0, longTasks: { count: 0, totalMs: 0, maxMs: 0 },
  loaf: { count: 0, over100ms: 0, maxMs: 0 }, cdp: { layoutCount: 1, layoutDurationMs: 0.2, recalcStyleCount: 3, recalcStyleDurationMs: 0.4 },
  trace: { compositeLayers: { count: 1, totalMs: 1 }, rasterTask: { count: 1, totalMs: 1 }, gpuTask: { count: 0, totalMs: 0 } },
  eventTiming: { pointerdown: { dispatched: 1, entries: 0, maxMs: null, belowThresholdMs: 16 }, keydown: { dispatched: 1, entries: 0, maxMs: null, belowThresholdMs: 16 } },
  ...over,
});
const result = (over = {}) => ({
  subject: 'perf-nesting', storyId: 'perf-nesting--nest-4', kind: 'fixture', owner: 'QUAL', profile: 'c', engine: 'chromium',
  viewport: { width: 1440, height: 900 }, dpr: 1, refreshHz: 60, tier: 'standard', scene: 'photo', interaction: 'default', status: 'pass', failures: [],
  windows: { transition: null, settled: win() },
  gpu: { layerCount: 4, blurredSurfaces: 4, maxEffectiveNesting: 3, maxBlurPx: 20, bci: 0.4, activeSvgFilters: 0, liveWebglContexts: 0 },
  heap: { cycles: 10, beforeBytes: 1e6, afterBytes: 1.01e6, deltaBytes: 1e4 },
  idle: { quietMs: 1000, rafRequestsInQuiet: 0, pendingRaf: 0, intervals: 0, infiniteAnimations: 0 },
  bytes: null, bytesNote: 'no SizeBudgetRow for this subject', delta: null, animatedBlur: [], ...over,
});

describe('evaluateFailures (harness-level fail rules)', () => {
  it('a complete chromium result has no failures', () => {
    expect(evaluateFailures({ ...result(), heapRequired: true }, 'c')).toEqual([]);
  });
  it('fails on a 200 ms long animation frame in the settled window', () => {
    const r = result({ windows: { transition: null, settled: win({ longTasks: { count: 1, totalMs: 200, maxMs: 200 }, loaf: { count: 1, over100ms: 1, maxMs: 210 } }) } });
    expect(evaluateFailures(r, 'c').map((f) => f.code)).toEqual(['settled-long-frame']);
    expect(SETTLED_LONG_FRAME_LIMIT.b).toBe(1);
    expect(evaluateFailures(r, 'b')).toEqual([]);         // (b) allows ≤1 (QUAL PRD §16)
  });
  it('fails on an animated blur', () => {
    const r = result({ animatedBlur: [{ target: 'div', property: 'backdropFilter', kind: 'animation' }] });
    expect(evaluateFailures(r, 'c').map((f) => f.code)).toEqual(['animated-blur']);
  });
  it('fails on zero frames and on each missing chromium metric', () => {
    const r = result({ windows: { transition: null, settled: win({ frames: { ...win().frames, count: 0 }, cdp: null, loaf: null }) }, gpu: { ...result().gpu, layerCount: null }, heap: null });
    const codes = evaluateFailures({ ...r, heapRequired: true }, 'c');
    expect(codes.map((f) => f.code)).toEqual(['zero-frames', 'missing-metric', 'missing-metric', 'missing-metric', 'missing-metric']);
    expect(codes.filter((f) => f.code === 'missing-metric').map((f) => f.detail)).toEqual([
      'CDP Performance.getMetrics deltas', 'long-animation-frame entries', 'compositor layer count', 'heap delta after 10 mount/unmount cycles']);
  });
  it('profile (d) needs only rAF cadence and DOM counts', () => {
    const r = result({ engine: 'webkit', profile: 'd', windows: { transition: null, settled: win({ frames: { ...win().frames, source: 'raf' }, cdp: null, loaf: null, trace: null, eventTiming: null }) }, gpu: { ...result().gpu, layerCount: null }, heap: null });
    expect(evaluateFailures(r, 'd')).toEqual([]);
    expect(evaluateFailures({ ...r, windows: { transition: null, settled: win({ ...r.windows.settled, rafGapsOver100ms: 1 }) } }, 'd').map((f) => f.code)).toEqual(['settled-long-frame']);
  });
  it('requires bundle bytes when the subject has a SizeBudgetRow', () => {
    expect(evaluateFailures({ ...result(), bytesRequired: 'Button' }, 'c').map((f) => f.detail)).toEqual(['bundle bytes for SizeBudgetRow Button']);
  });
});

describe('blank baseline and profiles', () => {
  it('delta vs blank is 0 for identical windows', () => {
    expect(deltaVsBlank(win(), win())).toEqual({ frameP50Ms: 0, frameP95Ms: 0, frameP99Ms: 0, longTasks: 0, longTaskTotalMs: 0 });
  });
  it('flags software compositing / raster from chrome://gpu feature status', () => {
    expect(softwareFlags({ gpu_compositing: 'enabled', rasterization: 'enabled' })).toEqual({ softwareCompositing: false, softwareRaster: false });
    expect(softwareFlags({ gpu_compositing: 'disabled_software', rasterization: 'unavailable_software' })).toEqual({ softwareCompositing: true, softwareRaster: true });
    expect(softwareFlags({})).toEqual({ softwareCompositing: true, softwareRaster: true });
  });
  it('story URLs carry the scene/tier globals and ag-cert=1', () => {
    expect(storyUrl('http://h', BLANK_ID, { scene: 'photo', tier: 'standard' }))
      .toBe('http://h/iframe.html?id=perf-harness-blank--default&viewMode=story&globals=scene%3Aphoto%3Btier%3Astandard&ag-cert=1');
  });
  it('parseArgs: profiles b,c,d by default; flagships only outside PR scope; rejects unknown profiles', () => {
    expect(parseArgs(['--scope', 'pr']).profiles).toEqual(['b', 'c', 'd']);
    expect(parseArgs(['--scope', 'pr']).includeFlagships).toBe(false);
    expect(parseArgs(['--scope', 'main']).includeFlagships).toBe(true);
    expect(() => parseArgs(['--profile', 'z'])).toThrow(/unknown profile/);
  });
  it('matches a subject to its SizeBudgetRow by id or by import', () => {
    const rows = [{ id: 'Button', import: "{ Button } from 'aura-glass'", limitBytes: 10000, kind: 'js' },
      { id: 'cmp:dialog', import: "{ Dialog } from 'aura-glass'", limitBytes: 20480, kind: 'js' },
      { id: 'Dialog', import: 'aura-glass/dialog.css', limitBytes: 100, kind: 'css' }];
    expect(findSizeRow(rows, 'Button')?.id).toBe('Button');
    expect(findSizeRow(rows, 'Dialog')?.id).toBe('cmp:dialog');
    expect(findSizeRow(rows, 'Menu')).toBeNull();
  });
});

describe('perf-results.schema.json', () => {
  const profile = { id: 'c', name: 'software-raster', engine: 'chromium', refreshHz: 60, viewport: { width: 1440, height: 900 }, dpr: 1, cpuThrottle: 1,
    headless: true, browserVersion: '141.0', gpu: null, display: null,
    blank: { photo: { blankRepeatDelta: { frameP50Ms: 0, frameP95Ms: 0.4, frameP99Ms: 1, longTasks: 0, longTaskTotalMs: 0 }, withinTolerance: true, toleranceMs: 1 } }, failures: [] };
  const doc = (over = {}) => ({ version: 1, schemaVersion: '1.0.0', sha: 'abc', generatedAt: '2026-10-10T00:00:00.000Z', scope: 'pr',
    runner: { tags: 'saas-linux-large-amd64', job: 'qual:certify:l10', jobUrl: null, pipelineUrl: null, node: 'v22', playwright: '1.63.0' },
    storybook: { source: 'storybook-static' }, fixtureIds: FIXTURE_IDS, profiles: [profile], results: [result()], verdict: 'pass', failures: [], ...over });

  it('accepts a complete document', () => {
    expect(validateResults(doc())).toEqual({ ok: true, errors: [] });
  });
  it('rejects a renamed fixture id, a missing metric block, and a pass verdict with failures', () => {
    expect(validateResults(doc({ fixtureIds: [...FIXTURE_IDS.slice(0, 5), 'perf-renamed--x'] })).ok).toBe(false);
    const noGpu = result(); delete noGpu.gpu;
    expect(validateResults(doc({ results: [noGpu] })).ok).toBe(false);
    expect(validateResults(doc({ failures: [{ code: 'zero-frames', detail: 'x' }] })).ok).toBe(false);
    expect(validateResults(doc({ results: [result({ status: 'pass', failures: [{ code: 'zero-frames', detail: 'x' }] })] })).ok).toBe(false);
    expect(validateResults(doc({ results: [result({ status: 'fail' })], verdict: 'fail', failures: [{ code: 'subject-failed', detail: 'x' }] })).ok).toBe(false);
  });
});
