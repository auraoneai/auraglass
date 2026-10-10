#!/usr/bin/env node
/* tests/perf/harness/run-perf.mjs — REQ-QUAL-34 perf harness + REQ-QUAL-35 blank baseline (QUAL, lane L10).

   Per (subject × profile × tier × scene) it measures, in two windows per run:
     transition window  input → last transitionend/animationend of the opened panel (≤1 s), only when the first
                        scripted step opens/presses something that animates;
     settled window     the next 5 s of scripted interaction (the story's parameters.ag.states drive steps, or the
                        `scroll` + `hover` default, reported `interaction: "default"`).
   Metrics: frame time p50/p95/p99 and dropped frames from the Chrome trace (devtools.timeline +
   disabled-by-default-devtools.timeline.frame DrawFrame/DroppedFrame) with the in-page rAF cadence as secondary;
   CDP Performance.getMetrics deltas (LayoutCount, LayoutDuration, RecalcStyleCount, RecalcStyleDuration); trace
   CompositeLayers / RasterTask / GPUTask; longtask and long-animation-frame entries; event-timing latency for
   scripted pointerdown/keydown; GPU proxies (layer count, blurred-surface count, max effective nesting, max blur,
   BCI from @auraglass/qa, active SVG filters, live WebGL contexts); heap delta after 10 mount/unmount cycles;
   settled-idle counters; per-subject bundle bytes (esbuild, min+gzip level 9, React and optional peers external)
   against the subject's SizeBudgetRow from loadFragments('size-budgets').
   Profiles: (a) desktop 1440×900 DPR 2, headed hardware-accelerated Chromium on .ag-gpu, 60/120 Hz, vsync on,
   --enable-gpu-rasterization, fails on software compositing/raster; (b) 390×844 DPR 3 touch, pointer:coarse, CPU 4×;
   (c) software-raster chromium-headless-shell; (d) WebKit and Gecko, in-page rAF timestamps and DOM counts only.
   A missing metric, crashed page, 0 frames or failed story/scene load is `fail`. Every run measures
   perf-harness-blank--default first (twice: blank-vs-blank must be 0 ± 1 ms) and reports frame-time and long-task
   metrics absolute and as delta vs blank.

   Remote only: without AG_REMOTE_RUNNER=1 it exits 2 with "remote-only" (machine policy; GitLab qual:certify:l10 /
   qual:certify:l10-gpu set it through .ag-playwright). Output: perf-results.json validated against
   tests/perf/harness/perf-results.schema.json before it is written. */
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(HERE, '../../..');
export const SCHEMA_PATH = join(HERE, 'perf-results.schema.json');
export const SCHEMA_VERSION = '1.0.0';

export const REMOTE_ONLY_MESSAGE = 'remote-only: tests/perf/harness/run-perf.mjs runs only on the remote runner (AG_REMOTE_RUNNER=1). '
  + 'Run it in GitLab CI: qual:certify:l10 (profiles b, c, d) or qual:certify:l10-gpu (profile a).';

/** Stable fixture ids (REQ-QUAL-35). Renaming one is a schema bump. */
export const BLANK_ID = 'perf-harness-blank--default';
export const FIXTURES = {
  'perf-harness-blank--default': { subject: 'perf-harness-blank', tier: null },
  'perf-nesting--nest-4': { subject: 'perf-nesting', tier: null },
  'perf-budget--budget-7': { subject: 'perf-budget', tier: null },
  'perf-lens--lens-3': { subject: 'perf-lens', tier: 'enhanced' },
  'perf-webgl--webgl-3': { subject: 'perf-webgl', tier: null },
  'perf-mount-cycle--default': { subject: 'perf-mount-cycle', tier: null },
};
export const FIXTURE_IDS = Object.keys(FIXTURES);

export const PROFILES = {
  a: { id: 'a', name: 'desktop-gpu', engine: 'chromium', viewport: { width: 1440, height: 900 }, dpr: 2, touch: false,
    cpuThrottle: 1, headless: false, refreshHz: [60, 120],
    args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--enable-gpu', '--enable-zero-copy'] },
  b: { id: 'b', name: 'mobile-throttled', engine: 'chromium', viewport: { width: 390, height: 844 }, dpr: 3, touch: true,
    cpuThrottle: 4, headless: true, refreshHz: [60], args: [] },
  c: { id: 'c', name: 'software-raster', engine: 'chromium', channel: 'chromium-headless-shell', viewport: { width: 1440, height: 900 },
    dpr: 1, touch: false, cpuThrottle: 1, headless: true, refreshHz: [60], args: ['--disable-gpu'] },
  d: { id: 'd', name: 'webkit-gecko', engine: ['webkit', 'firefox'], viewport: { width: 1440, height: 900 }, dpr: 1, touch: false,
    cpuThrottle: 1, headless: true, refreshHz: [60], args: [] },
};

/** Settled-window long frames (>100 ms) allowed per profile (QUAL PRD §16: 0 on (a), ≤1 on (b)). */
export const SETTLED_LONG_FRAME_LIMIT = { a: 0, b: 1, c: 0, d: 0 };
export const BLANK_TOLERANCE_MS = 1;
export const WINDOWS = { settledMs: 5000, transitionCapMs: 1000, transitionDetectMs: 100, quietMs: 1000, preSettleMs: 500 };
export const HEAP_CYCLES = 10;
export const TRACE_CATEGORIES = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame',
  'blink.user_timing', 'gpu'];
export const CDP_METRICS = ['LayoutCount', 'LayoutDuration', 'RecalcStyleCount', 'RecalcStyleDuration'];

/* ------------------------------------------------------------------ pure helpers ------------------------------------------------------------------ */

export function quantile(sorted, q) {
  if (!sorted.length) return null;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1));
  return sorted[i];
}

/** count = number of samples; p50/p95/p99 over the samples (null when there are none). */
export function statsOf(values) {
  const s = values.filter((v) => Number.isFinite(v)).sort((x, y) => x - y);
  return { count: s.length, p50Ms: quantile(s, 0.5), p95Ms: quantile(s, 0.95), p99Ms: quantile(s, 0.99) };
}

export function intervals(stamps) {
  const out = [];
  for (let i = 1; i < stamps.length; i++) out.push(stamps[i] - stamps[i - 1]);
  return out;
}

export function missedVsyncs(frameIntervalsMs, vsyncMs) {
  let n = 0;
  for (const d of frameIntervalsMs) n += Math.max(0, Math.round(d / vsyncMs) - 1);
  return n;
}

/** Frame stats from a timestamp list (ms). `frames.count` is the number of frames presented in the window. */
export function frameStats(stampsMs, vsyncMs, source, dropped = null) {
  const iv = intervals(stampsMs);
  const st = statsOf(iv);
  return { count: stampsMs.length, p50Ms: st.p50Ms, p95Ms: st.p95Ms, p99Ms: st.p99Ms,
    dropped: dropped ?? missedVsyncs(iv, vsyncMs), missedVsyncs: missedVsyncs(iv, vsyncMs), vsyncMs, source };
}

function traceEventsOf(trace) {
  if (Array.isArray(trace)) return trace;
  if (trace && Array.isArray(trace.traceEvents)) return trace.traceEvents;
  throw new Error('analyzeTrace: not a Chrome trace (no traceEvents array)');
}

/** Finds the trace timestamp (µs) of a performance.mark(name). */
export function markTs(trace, name) {
  const ev = traceEventsOf(trace).find((e) => e.name === name && typeof e.ts === 'number' && String(e.cat ?? '').includes('blink.user_timing'));
  return ev ? ev.ts : null;
}

/** Slices a Chrome trace to [startUs, endUs] and derives frame + compositor/raster/GPU task metrics. */
export function analyzeTrace(trace, { startUs, endUs, vsyncMs }) {
  const events = traceEventsOf(trace).filter((e) => typeof e.ts === 'number' && e.ts >= startUs && e.ts <= endUs);
  const byPid = new Map();
  for (const e of events) {
    if (e.name !== 'DrawFrame') continue;
    if (!byPid.has(e.pid)) byPid.set(e.pid, new Set());
    byPid.get(e.pid).add(e.ts);
  }
  let pid = null; let draws = [];
  for (const [p, set] of byPid) if (set.size > draws.length) { pid = p; draws = [...set].sort((x, y) => x - y); }
  const dropped = events.filter((e) => e.name === 'DroppedFrame' && (pid === null || e.pid === pid)).length;
  const task = (name) => {
    const xs = events.filter((e) => e.name === name && e.ph === 'X');
    return { count: xs.length, totalMs: xs.reduce((s, e) => s + (e.dur ?? 0), 0) / 1000 };
  };
  return {
    frames: frameStats(draws.map((t) => t / 1000), vsyncMs, 'trace', dropped),
    trace: { compositeLayers: task('CompositeLayers'), rasterTask: task('RasterTask'), gpuTask: task('GPUTask') },
  };
}

export function cdpDelta(before, after) {
  const map = (m) => Object.fromEntries((m?.metrics ?? []).map((x) => [x.name, x.value]));
  const b = map(before); const a = map(after);
  const out = {};
  for (const k of CDP_METRICS) {
    if (!(k in a) || !(k in b)) return null;
    const v = a[k] - b[k];
    out[k] = k.endsWith('Duration') ? v * 1000 : v;     // CDP durations are seconds; report ms
  }
  return { layoutCount: out.LayoutCount, layoutDurationMs: out.LayoutDuration, recalcStyleCount: out.RecalcStyleCount, recalcStyleDurationMs: out.RecalcStyleDuration };
}

export function entriesIn(entries, startMs, endMs) {
  return entries.filter((e) => e.startTime >= startMs && e.startTime <= endMs);
}

export function longTaskStats(entries) {
  return { count: entries.length, totalMs: entries.reduce((s, e) => s + e.duration, 0), maxMs: entries.reduce((m, e) => Math.max(m, e.duration), 0) };
}

export function loafStats(entries) {
  return { count: entries.length, over100ms: entries.filter((e) => e.duration > 100).length, maxMs: entries.reduce((m, e) => Math.max(m, e.duration), 0) };
}

/** Event-timing latency per scripted event type. Entries exist only at or above the 16 ms durationThreshold, so a
    dispatched event without an entry has latency < 16 ms (`maxMs: null`, `belowThresholdMs: 16`). */
export function eventTimingStats(entries, dispatched) {
  const out = {};
  for (const type of ['pointerdown', 'keydown']) {
    const xs = entries.filter((e) => e.name === type);
    out[type] = { dispatched: dispatched[type] ?? 0, entries: xs.length,
      maxMs: xs.length ? xs.reduce((m, e) => Math.max(m, e.duration), 0) : null, belowThresholdMs: 16 };
  }
  return out;
}

/** Δ vs blank for frame time and long tasks (REQ-QUAL-35). */
export function deltaVsBlank(window, blankWindow) {
  if (!window || !blankWindow) return null;
  const d = (a, b) => (a === null || b === null || a === undefined || b === undefined ? null : a - b);
  return {
    frameP50Ms: d(window.frames.p50Ms, blankWindow.frames.p50Ms),
    frameP95Ms: d(window.frames.p95Ms, blankWindow.frames.p95Ms),
    frameP99Ms: d(window.frames.p99Ms, blankWindow.frames.p99Ms),
    longTasks: d(window.longTasks.count, blankWindow.longTasks.count),
    longTaskTotalMs: d(window.longTasks.totalMs, blankWindow.longTasks.totalMs),
  };
}

/** Failure rules that belong to the harness itself (budgets and grades are applied by grade.mjs / resolve-budgets.mjs). */
export function evaluateFailures(r, profileId) {
  const f = [];
  const chromium = r.engine === 'chromium';
  const s = r.windows?.settled;
  const need = (ok, metric) => { if (!ok) f.push({ code: 'missing-metric', detail: metric }); };
  if (!s) { f.push({ code: 'missing-metric', detail: 'settled window' }); return f; }
  if (!(s.frames?.count > 0)) f.push({ code: 'zero-frames', detail: `settled window presented ${s.frames?.count ?? 0} frames (${s.frames?.source ?? 'n/a'})` });
  need(s.raf && s.raf.count > 0, 'in-page rAF cadence');
  need(s.longTasks !== null && s.longTasks !== undefined, 'longtask entries');
  need(r.idle !== null && r.idle !== undefined, 'settled-idle counters');
  need(r.gpu && Number.isFinite(r.gpu.bci) && Number.isFinite(r.gpu.blurredSurfaces), 'GPU proxies (BCI, blurred surfaces)');
  need(r.gpu && Number.isFinite(r.gpu.liveWebglContexts), 'live WebGL contexts');
  if (chromium) {
    need(s.frames?.source === 'trace', 'trace frame timing');
    need(s.cdp !== null && s.cdp !== undefined, 'CDP Performance.getMetrics deltas');
    need(s.trace !== null && s.trace !== undefined, 'trace CompositeLayers/RasterTask/GPUTask');
    need(s.loaf !== null && s.loaf !== undefined, 'long-animation-frame entries');
    need(s.eventTiming && s.eventTiming.pointerdown.dispatched > 0 && s.eventTiming.keydown.dispatched > 0, 'event-timing (scripted pointerdown/keydown)');
    need(r.gpu && Number.isInteger(r.gpu.layerCount), 'compositor layer count');
    if (r.heapRequired) need(r.heap && Number.isFinite(r.heap.deltaBytes), `heap delta after ${HEAP_CYCLES} mount/unmount cycles`);
  }
  if (r.bytesRequired) need(r.bytes && Number.isFinite(r.bytes.minGzipBytes), `bundle bytes for SizeBudgetRow ${r.bytesRequired}`);
  const longFrames = chromium ? s.loaf?.over100ms ?? 0 : s.rafGapsOver100ms ?? 0;
  const limit = SETTLED_LONG_FRAME_LIMIT[profileId] ?? 0;
  if (longFrames > limit) {
    f.push({ code: 'settled-long-frame', detail: `${longFrames} frame(s) >100 ms in the settled window (limit ${limit} on profile ${profileId}); longest long task ${Math.round(s.longTasks?.maxMs ?? 0)} ms` });
  }
  if (r.animatedBlur?.length) {
    f.push({ code: 'animated-blur', detail: `running animation/transition on ${[...new Set(r.animatedBlur.map((a) => a.property))].join(', ')} (${r.animatedBlur.length} target(s))` });
  }
  return f;
}

/** Deterministic static checks of the profile itself (GPU feature status, refresh, pointer). */
export function softwareFlags(featureStatus) {
  const soft = (v) => v === undefined || v === null || /software|^disabled|^unavailable/.test(String(v));
  return { softwareCompositing: soft(featureStatus?.gpu_compositing), softwareRaster: soft(featureStatus?.rasterization) };
}

/* ------------------------------------------------------------------ page side ------------------------------------------------------------------ */

/** Installed with page.addInitScript before any page script runs. Self-contained. */
export function agPerfInit() {
  const w = window;
  if (w.__agPerf) return;
  const P = { longtasks: [], loaf: [], events: [], supported: {}, rafRequested: [], intervals: new Map(), webgl: [],
    dispatched: { pointerdown: 0, keydown: 0 }, clock: { on: false, stamps: [] } };
  w.__agPerf = P;
  const origRaf = w.requestAnimationFrame.bind(w);
  const origCaf = w.cancelAnimationFrame.bind(w);
  const pending = new Set();
  w.requestAnimationFrame = function (cb) {
    P.rafRequested.push(performance.now());
    const id = origRaf((t) => { pending.delete(id); cb(t); });
    pending.add(id);
    return id;
  };
  w.cancelAnimationFrame = function (id) { pending.delete(id); origCaf(id); };
  P.pendingRaf = () => pending.size;
  const origSI = w.setInterval.bind(w);
  const origCI = w.clearInterval.bind(w);
  w.setInterval = function (fn, ms, ...rest) { const id = origSI(fn, ms, ...rest); P.intervals.set(id, performance.now()); return id; };
  w.clearInterval = function (id) { P.intervals.delete(id); origCI(id); };
  const origGet = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const ctx = origGet.call(this, type, ...rest);
    if (ctx && /^(webgl2?|experimental-webgl)$/.test(String(type)) && !P.webgl.some((x) => x.ctx === ctx)) P.webgl.push({ canvas: this, ctx });
    return ctx;
  };
  const observe = (type, into, extra) => {
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) into.push({ name: e.name, startTime: e.startTime, duration: e.duration });
      }).observe({ type, buffered: true, ...extra });
      P.supported[type] = true;
    } catch { P.supported[type] = false; }
  };
  observe('longtask', P.longtasks);
  observe('long-animation-frame', P.loaf);
  observe('event', P.events, { durationThreshold: 16 });
  for (const t of ['pointerdown', 'keydown']) w.addEventListener(t, () => { P.dispatched[t]++; }, { capture: true, passive: true });
  /* Frame clock: a 1 px main-thread paint on every rAF, so every vsync produces a frame in the trace and the in-page
     cadence is sampled continuously. Uses the original rAF, so it is never counted as subject rAF; its cost is the
     same on every subject and cancels out in the delta vs blank. */
  P.startClock = () => {
    const d = document.createElement('div');
    d.setAttribute('data-ag-perf-clock', '');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;pointer-events:none;z-index:2147483647;contain:strict';
    document.body.appendChild(d);
    P.clock = { on: true, stamps: [], el: d };
    let n = 0;
    const loop = (t) => {
      if (!P.clock.on) { d.remove(); return; }
      P.clock.stamps.push(t);
      d.style.backgroundColor = (n++ & 1) ? 'rgb(0, 0, 1)' : 'rgb(0, 0, 2)';
      origRaf(loop);
    };
    origRaf(loop);
  };
  P.stopClock = () => { P.clock.on = false; return P.clock.stamps.slice(); };
}

/** Running animations/transitions on blur, filter or --_ag-blur (forbidden by REQ-QUAL-44; detected at runtime here). */
export function detectAnimatedBlur() {
  const out = [];
  const BLUR = /^(backdropFilter|webkitBackdropFilter|filter|--_ag-blur|backdrop-filter|-webkit-backdrop-filter)$/;
  for (const a of document.getAnimations()) {
    if (a.playState !== 'running') continue;
    const t = a.effect && a.effect.target;
    const desc = t ? `${t.tagName.toLowerCase()}${t.getAttribute('data-ag-part') ? `[data-ag-part=${t.getAttribute('data-ag-part')}]` : ''}` : '?';
    if (a.transitionProperty && BLUR.test(a.transitionProperty)) { out.push({ target: desc, property: a.transitionProperty, kind: 'transition' }); continue; }
    const kfs = a.effect && a.effect.getKeyframes ? a.effect.getKeyframes() : [];
    for (const k of kfs) {
      const prop = Object.keys(k).find((p) => BLUR.test(p));
      if (prop) { out.push({ target: desc, property: prop, kind: 'animation' }); break; }
    }
  }
  return out;
}

/* ------------------------------------------------------------------ measurement ------------------------------------------------------------------ */

let qaModule = null;
/** Loads packages/qa/src/perf/bci.ts (TypeScript) through esbuild, so this .mjs runs under plain node and Playwright. */
export async function loadQaPerf() {
  if (qaModule) return qaModule;
  const { build } = await import('esbuild');
  const res = await build({ entryPoints: [join(ROOT, 'packages/qa/src/perf/bci.ts')], bundle: true, write: false, format: 'esm', platform: 'neutral', logLevel: 'silent' });
  const dir = mkdtempSync(join(tmpdir(), 'ag-qa-perf-'));
  const file = join(dir, 'bci.mjs');
  writeFileSync(file, res.outputFiles[0].text);
  qaModule = await import(pathToFileURL(file).href);
  return qaModule;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Reads the current story's parameters.ag drive steps (S-41) from the Storybook preview. */
export async function readDrive(page) {
  return page.evaluate(() => {
    const p = window.__STORYBOOK_PREVIEW__;
    const ag = p?.currentRender?.story?.parameters?.ag;
    const steps = [];
    for (const s of ag?.states ?? []) for (const d of s.drive ?? []) steps.push(d);
    return steps;
  });
}

async function locate(page, target) {
  const loc = page.locator(`[data-ag-part="${target}"]`).first();
  if (!(await loc.count())) throw new Error(`drive step target [data-ag-part="${target}"] not found`);
  return loc;
}

async function performStep(page, step, profile) {
  const loc = await locate(page, step.target);
  if (step.action === 'hover') await loc.hover();
  else if (step.action === 'focus') await loc.focus();
  else if (step.action === 'type') { await loc.focus(); await page.keyboard.type(step.text ?? 'perf'); }
  else if (profile.touch) await loc.tap();
  else await loc.click();
}

async function pageNow(page) { return page.evaluate(() => performance.now()); }

/**
 * Measures the page as it is now (already navigated, init script installed).
 * opts: { profileId, engine, browser (chromium, for tracing), cdp (CDPSession|null), drive: steps[], cycle: async()=>void | null,
 *         settledMs, vsyncMs }
 */
export async function measurePage(page, opts) {
  const profile = PROFILES[opts.profileId] ?? PROFILES.c;
  const chromium = opts.engine === 'chromium';
  const settledMs = opts.settledMs ?? WINDOWS.settledMs;
  const vsyncMs = opts.vsyncMs ?? 1000 / 60;
  const drive = opts.drive ?? [];
  const qa = await loadQaPerf();
  await page.evaluate(async () => { await document.fonts?.ready; });
  await sleep(WINDOWS.preSettleMs);

  if (opts.cdp) await opts.cdp.send('Performance.enable', { timeDomain: 'timeTicks' });
  const tracing = chromium && opts.browser;
  if (tracing) await opts.browser.startTracing(page, { categories: TRACE_CATEGORIES });
  await page.evaluate(() => window.__agPerf.startClock());
  await sleep(100);

  /* transition window */
  let transition = null;
  const first = drive[0];
  const opens = first && (first.action === 'open' || first.action === 'press');
  if (opens) {
    const t0 = await page.evaluate(() => { performance.mark('ag-perf:transition:start'); return performance.now(); });
    await performStep(page, first, profile);
    const t1 = await page.evaluate(async ({ detect, cap, start }) => {
      const running = () => document.getAnimations().filter((a) => a.playState === 'running' && !(a.effect?.getComputedTiming?.().iterations === Infinity)).length;
      const until = (ms) => new Promise((r) => setTimeout(r, ms));
      while (performance.now() - start < detect && running() === 0) await until(10);
      if (running() === 0) return null;
      while (performance.now() - start < cap && running() > 0) await until(10);
      performance.mark('ag-perf:transition:end');
      return performance.now();
    }, { detect: WINDOWS.transitionDetectMs, cap: WINDOWS.transitionCapMs, start: t0 });
    if (t1 !== null) transition = { startMs: t0, endMs: t1 };
  }

  /* settled window */
  const before = opts.cdp ? await opts.cdp.send('Performance.getMetrics') : null;
  const s0 = await page.evaluate(() => { performance.mark('ag-perf:settled:start'); return performance.now(); });
  const steps = drive.filter((d, i) => !(opens && i === 0) && d.action !== 'open' && d.action !== 'press');
  const vp = profile.viewport;
  const anchor = steps.length ? await (await locate(page, steps[steps.length - 1].target)).boundingBox() : null;
  const px = anchor ? anchor.x + anchor.width / 2 : vp.width / 2;
  const py = anchor ? anchor.y + anchor.height / 2 : vp.height / 2;
  if (profile.touch) await page.touchscreen.tap(px, py); else { await page.mouse.move(px, py); await page.mouse.down(); await page.mouse.up(); }
  await page.keyboard.press('Shift');
  let animatedBlur = [];
  const deadline = Date.now() + settledMs;
  let phase = 0;
  while (Date.now() < deadline) {
    if (steps.length) { for (const st of steps) { if (Date.now() >= deadline) break; await performStep(page, st, profile); } }
    const x = vp.width * (0.25 + 0.5 * ((phase % 4) / 3));
    await page.mouse.move(x, vp.height * 0.5, { steps: 4 });
    await page.mouse.wheel(0, phase % 2 ? -240 : 240);
    if (phase === 2) animatedBlur = await page.evaluate(detectAnimatedBlur);
    phase++;
    await sleep(120);
  }
  if (phase <= 2) animatedBlur = await page.evaluate(detectAnimatedBlur);
  const s1 = await page.evaluate(() => { performance.mark('ag-perf:settled:end'); return performance.now(); });
  const after = opts.cdp ? await opts.cdp.send('Performance.getMetrics') : null;
  const stamps = await page.evaluate(() => window.__agPerf.stopClock());
  const trace = tracing ? JSON.parse((await opts.browser.stopTracing()).toString('utf8')) : null;
  const P = await page.evaluate(() => {
    const p = window.__agPerf;
    return { longtasks: p.longtasks, loaf: p.loaf, events: p.events, supported: p.supported, dispatched: p.dispatched };
  });

  const windowOf = (startMs, endMs, startMark, endMark, withCdp) => {
    const raf = frameStats(stamps.filter((t) => t >= startMs && t <= endMs), vsyncMs, 'raf');
    let frames = raf; let traceTasks = null;
    if (trace) {
      const a = markTs(trace, startMark); const b = markTs(trace, endMark);
      if (a !== null && b !== null) { const t = analyzeTrace(trace, { startUs: a, endUs: b, vsyncMs }); frames = t.frames; traceTasks = t.trace; }
    }
    return {
      startMs, durationMs: endMs - startMs, frames, raf: { count: raf.count, p50Ms: raf.p50Ms, p95Ms: raf.p95Ms, p99Ms: raf.p99Ms },
      rafGapsOver100ms: intervals(stamps.filter((t) => t >= startMs && t <= endMs)).filter((d) => d > 100).length,
      longTasks: P.supported.longtask ? longTaskStats(entriesIn(P.longtasks, startMs, endMs)) : (chromium ? null : longTaskFromRaf(stamps, startMs, endMs)),
      loaf: P.supported['long-animation-frame'] ? loafStats(entriesIn(P.loaf, startMs, endMs)) : null,
      cdp: withCdp && before && after ? cdpDelta(before, after) : null,
      trace: traceTasks,
      eventTiming: P.supported.event ? eventTimingStats(entriesIn(P.events, startMs, endMs), P.dispatched) : null,
    };
  };
  const windows = {
    transition: transition ? windowOf(transition.startMs, transition.endMs, 'ag-perf:transition:start', 'ag-perf:transition:end', false) : null,
    settled: windowOf(s0, s1, 'ag-perf:settled:start', 'ag-perf:settled:end', true),
  };

  /* quiet period → settled idle */
  const quietStart = await pageNow(page);
  await sleep(WINDOWS.quietMs);
  const idle = await page.evaluate((qs) => {
    const p = window.__agPerf;
    return {
      quietMs: performance.now() - qs,
      rafRequestsInQuiet: p.rafRequested.filter((t) => t > qs + 100).length,
      pendingRaf: p.pendingRaf(),
      intervals: p.intervals.size,
      infiniteAnimations: document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getComputedTiming?.().iterations === Infinity).length,
    };
  }, quietStart);

  /* GPU proxies */
  const cost = qa.summarizeBlurCost(await page.evaluate(qa.collectBlurLayers));
  const liveWebglContexts = await page.evaluate(() => window.__agPerf.webgl.filter((x) => x.canvas.isConnected && !x.ctx.isContextLost()).length);
  const layerCount = opts.cdp ? await countLayers(page, opts.cdp) : null;
  const gpu = { layerCount, blurredSurfaces: cost.blurredSurfaces, maxEffectiveNesting: cost.maxEffectiveNesting, maxBlurPx: cost.maxBlurPx,
    bci: cost.bci, activeSvgFilters: cost.activeSvgFilters, liveWebglContexts };

  /* heap after 10 mount/unmount cycles (Chromium; CDP) */
  let heap = null;
  if (opts.cycle && opts.cdp) {
    await opts.cdp.send('HeapProfiler.enable');
    await opts.cycle();
    await opts.cdp.send('HeapProfiler.collectGarbage');
    const b = await opts.cdp.send('Runtime.getHeapUsage');
    for (let i = 0; i < HEAP_CYCLES; i++) await opts.cycle();
    await opts.cdp.send('HeapProfiler.collectGarbage');
    const a = await opts.cdp.send('Runtime.getHeapUsage');
    heap = { cycles: HEAP_CYCLES, beforeBytes: b.usedSize, afterBytes: a.usedSize, deltaBytes: a.usedSize - b.usedSize };
  }

  return { windows, idle, gpu, heap, animatedBlur, interaction: drive.length ? 'drive' : 'default' };
}

function longTaskFromRaf(stamps, startMs, endMs) {
  // WebKit/Gecko expose no longtask entries; profile (d) reports rAF gaps > 50 ms as the long-task proxy.
  const gaps = intervals(stamps.filter((t) => t >= startMs && t <= endMs)).filter((d) => d > 50);
  return { count: gaps.length, totalMs: gaps.reduce((s, d) => s + d, 0), maxMs: gaps.reduce((m, d) => Math.max(m, d), 0) };
}

async function countLayers(page, cdp) {
  const got = new Promise((resolveLayers) => {
    const h = (e) => { if (e.layers) { cdp.off('LayerTree.layerTreeDidChange', h); resolveLayers(e.layers.length); } };
    cdp.on('LayerTree.layerTreeDidChange', h);
  });
  await cdp.send('LayerTree.enable');
  await page.evaluate(() => new Promise((r) => {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;pointer-events:none';
    document.body.appendChild(d);
    requestAnimationFrame(() => requestAnimationFrame(() => { d.remove(); r(); }));
  }));
  const n = await Promise.race([got, sleep(5000).then(() => null)]);
  await cdp.send('LayerTree.disable');
  return n;
}

/* ------------------------------------------------------------------ Storybook plumbing ------------------------------------------------------------------ */

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.map': 'application/json' };

/** Minimal static server for storybook-static (no directory listing, no path escape). */
export function serveStatic(dir, port = 0) {
  const root = resolve(dir);
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://x');
    let file = normalize(join(root, decodeURIComponent(url.pathname)));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(port, '127.0.0.1', () => r({ server, url: `http://127.0.0.1:${server.address().port}` })));
}

export function storyUrl(base, storyId, { scene, tier }) {
  const globals = [scene ? `scene:${scene}` : null, tier ? `tier:${tier}` : null].filter(Boolean).join(';');
  return `${base}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story${globals ? `&globals=${encodeURIComponent(globals)}` : ''}&ag-cert=1`;
}

/** Navigates and waits for data-ag-cert-ready and a completed story render; collects scene/asset load failures. */
export async function openStory(page, base, storyId, env) {
  const failed = [];
  page.on('requestfailed', (r) => failed.push(`${r.url()} (${r.failure()?.errorText ?? 'failed'})`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.url()} (HTTP ${r.status()})`); });
  await page.goto(storyUrl(base, storyId, env), { waitUntil: 'load' });
  await page.waitForSelector('[data-ag-cert-ready]', { timeout: 30_000, state: 'attached' });
  const phase = await waitRender(page, storyId);
  if (phase !== 'completed') throw new Error(`story ${storyId} render phase ${phase}`);
  const images = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
  return { failedRequests: failed, brokenImages: images };
}

async function waitRender(page, storyId) {
  return page.evaluate(async (id) => {
    const t0 = performance.now();
    for (;;) {
      const r = window.__STORYBOOK_PREVIEW__?.currentRender;
      if (r && r.id === id && (r.phase === 'completed' || r.phase === 'errored' || r.phase === 'aborted')) return r.phase;
      if (performance.now() - t0 > 30_000) return r ? `${r.phase ?? 'unknown'} (timeout)` : 'no-render (timeout)';
      await new Promise((res) => setTimeout(res, 25));
    }
  }, storyId);
}

/** One unmount + mount of `storyId` through the Storybook preview (switches to the blank fixture and back). */
export function storyCycle(page, storyId) {
  const go = async (id) => {
    await page.evaluate((sid) => { window.__STORYBOOK_PREVIEW__.onSetCurrentStory({ storyId: sid, viewMode: 'story' }); }, id);
    const phase = await waitRender(page, id);
    if (phase !== 'completed') throw new Error(`mount cycle: ${id} render phase ${phase}`);
  };
  return async () => { await go(BLANK_ID); await go(storyId); };
}

/** Flagship subjects from REPORTS.subjects (cert-manifest.json), falling back to index.json `flagship` tags. */
export function listFlagships(staticDir) {
  const manifest = join(staticDir, 'cert-manifest.json');
  let stories;
  if (existsSync(manifest)) {
    stories = JSON.parse(readFileSync(manifest, 'utf8')).stories.filter((s) => s.tags.includes('flagship'))
      .map((s) => ({ id: s.id, subject: s.subject, owner: s.owner }));
  } else {
    const idx = JSON.parse(readFileSync(join(staticDir, 'index.json'), 'utf8'));
    stories = Object.values(idx.entries ?? {}).filter((e) => e.type === 'story' && (e.tags ?? []).includes('flagship'))
      .map((e) => ({ id: e.id, subject: String(e.title ?? e.id).split('/').pop(), owner: null }));
  }
  const bySubject = new Map();
  const rank = (id) => (id.endsWith('--playground') ? 0 : id.endsWith('--states') ? 1 : 2);
  for (const s of stories) {
    const cur = bySubject.get(s.subject);
    if (!cur || rank(s.id) < rank(cur.id)) bySubject.set(s.subject, s);
  }
  return [...bySubject.values()].sort((x, y) => x.subject.localeCompare(y.subject));
}

/* ------------------------------------------------------------------ bundle bytes (S-44 method) ------------------------------------------------------------------ */

export function findSizeRow(rows, subject) {
  const re = new RegExp(`\\{\\s*${subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\}`);
  return rows.find((r) => r.kind === 'js' && (r.id === subject || re.test(r.import))) ?? null;
}

/** Resolves the packed package directory: AURAGLASS_TARBALL, or the newest .artifacts/pack/*.tgz, extracted to a temp dir. */
export function resolvePackageDir() {
  let tgz = process.env.AURAGLASS_TARBALL ?? null;
  const packDir = join(ROOT, '.artifacts/pack');
  if (!tgz && existsSync(packDir)) {
    const t = readdirSync(packDir).filter((f) => f.endsWith('.tgz')).map((f) => join(packDir, f)).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
    tgz = t ?? null;
  }
  if (!tgz) return null;
  const dir = mkdtempSync(join(tmpdir(), 'ag-perf-pkg-'));
  execFileSync('tar', ['-xzf', tgz, '-C', dir]);
  return join(dir, 'package');
}

export async function measureBytes(row, pkgDir) {
  const { build } = await import('esbuild');
  const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
  const peers = Object.keys({ ...(pkg.peerDependencies ?? {}), ...(pkg.peerDependenciesMeta ?? {}) });
  const external = [...new Set(['react', 'react-dom', ...peers])].flatMap((p) => [p, `${p}/*`]);
  const work = mkdtempSync(join(tmpdir(), 'ag-perf-bytes-'));
  mkdirSync(join(work, 'node_modules'), { recursive: true });
  symlinkSync(pkgDir, join(work, 'node_modules', 'aura-glass'), 'dir');
  const entry = join(work, 'entry.js');
  writeFileSync(entry, /^\{/.test(row.import.trim()) ? `export ${row.import};\n` : `export * from ${JSON.stringify(row.import.trim())};\n`);
  const res = await build({ entryPoints: [entry], bundle: true, write: false, minify: true, format: 'esm', platform: 'browser', external,
    absWorkingDir: work, logLevel: 'silent', loader: { '.css': 'empty' } });
  const code = res.outputFiles[0].contents;
  return { sizeBudgetId: row.id, import: row.import, limitBytes: row.limitBytes, minGzipBytes: gzipSync(code, { level: 9 }).length,
    overBudget: gzipSync(code, { level: 9 }).length > row.limitBytes };
}

/* ------------------------------------------------------------------ schema ------------------------------------------------------------------ */

export function validateResults(doc) {
  const require = createRequire(join(ROOT, 'package.json'));
  const Ajv2020 = require('ajv/dist/2020').default;
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  const validate = ajv.compile(JSON.parse(readFileSync(SCHEMA_PATH, 'utf8')));
  const ok = validate(doc);
  return { ok, errors: ok ? [] : validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`) };
}

/* ------------------------------------------------------------------ CLI ------------------------------------------------------------------ */

export function parseArgs(argv) {
  const o = { profiles: [], subjects: null, scenes: ['photo'], tiers: ['standard'], refreshHz: null, engines: null, out: null,
    staticDir: join(ROOT, 'storybook-static'), url: null, scope: process.env.AG_SCOPE ?? 'pr', serve: null, port: 0, includeFlagships: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]; const v = () => { const x = argv[++i]; if (x === undefined) throw new Error(`${a} needs a value`); return x; };
    if (a === '--profile') o.profiles.push(...v().split(','));
    else if (a === '--subjects') o.subjects = v().split(',').filter(Boolean);
    else if (a === '--scenes') o.scenes = v().split(',');
    else if (a === '--tiers') o.tiers = v().split(',');
    else if (a === '--refresh-hz') o.refreshHz = v().split(',').map(Number);
    else if (a === '--engines') o.engines = v().split(',');
    else if (a === '--out') o.out = v();
    else if (a === '--storybook-static') o.staticDir = resolve(v());
    else if (a === '--storybook-url') o.url = v();
    else if (a === '--scope') o.scope = v();
    else if (a === '--serve') o.serve = resolve(v());
    else if (a === '--port') o.port = Number(v());
    else if (a === '--flagships') o.includeFlagships = true;
    else if (a === '--no-flagships') o.includeFlagships = false;
    else throw new Error(`unknown argument ${a}`);
  }
  for (const p of o.profiles) if (!PROFILES[p]) throw new Error(`unknown profile ${p} (a|b|c|d)`);
  if (!o.profiles.length) o.profiles = ['b', 'c', 'd'];
  if (!['pr', 'main', 'nightly', 'release'].includes(o.scope)) throw new Error(`unknown scope ${o.scope}`);
  if (o.includeFlagships === null) o.includeFlagships = o.scope !== 'pr';
  o.out ??= join(process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-l10', 'perf-results.json');
  return o;
}

async function launch(engineName, profile) {
  const pw = await import('@playwright/test');
  const bt = pw[engineName];
  const opts = { headless: profile.headless, args: profile.args };
  if (profile.channel) opts.channel = profile.channel;
  return bt.launch(opts);
}

function gitSha() {
  if (process.env.CI_COMMIT_SHA) return process.env.CI_COMMIT_SHA;
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; }
}

async function runOne(browser, engine, profile, base, { storyId, subject, kind, owner, scene, tier, refreshHz, heapRequired, bytes, bytesRequired }) {
  const ctx = await browser.newContext({ viewport: profile.viewport, deviceScaleFactor: profile.dpr, isMobile: profile.touch && engine === 'chromium',
    hasTouch: profile.touch, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const result = { subject, storyId, kind, owner: owner ?? null, profile: profile.id, engine, viewport: profile.viewport, dpr: profile.dpr,
    refreshHz, tier, scene, interaction: 'default', status: 'fail', failures: [], windows: { transition: null, settled: null },
    gpu: null, heap: null, idle: null, bytes, bytesNote: bytes ? null : bytesRequired ? 'bundle not measured' : 'no SizeBudgetRow for this subject',
    delta: null, animatedBlur: [] };
  let crashed = false; const pageErrors = [];
  page.on('crash', () => { crashed = true; });
  page.on('pageerror', (e) => pageErrors.push(String(e?.message ?? e)));
  try {
    await page.addInitScript(agPerfInit);
    const cdp = engine === 'chromium' ? await ctx.newCDPSession(page) : null;
    if (cdp && profile.cpuThrottle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpuThrottle });
    let load;
    try { load = await openStory(page, base, storyId, { scene, tier }); } catch (e) {
      result.failures.push({ code: 'story-load-failed', detail: String(e?.message ?? e) });
      return result;
    }
    const sceneFails = [...load.failedRequests, ...load.brokenImages.map((s) => `${s} (broken image)`)];
    if (sceneFails.length) result.failures.push({ code: 'scene-load-failed', detail: sceneFails.slice(0, 5).join('; ') });
    if (profile.touch && !(await page.evaluate(() => matchMedia('(pointer: coarse)').matches))) {
      result.failures.push({ code: 'pointer-not-coarse', detail: 'profile (b) requires pointer:coarse' });
    }
    const drive = await readDrive(page);
    const m = await measurePage(page, { profileId: profile.id, engine, browser: engine === 'chromium' ? browser : null, cdp, drive,
      cycle: heapRequired && cdp ? storyCycle(page, storyId) : null, vsyncMs: 1000 / refreshHz });
    Object.assign(result, { windows: m.windows, idle: m.idle, gpu: m.gpu, heap: m.heap, animatedBlur: m.animatedBlur, interaction: m.interaction });
    result.heapRequired = heapRequired; result.bytesRequired = bytesRequired;
    result.failures.push(...evaluateFailures(result, profile.id));
    delete result.heapRequired; delete result.bytesRequired;
  } catch (e) {
    result.failures.push({ code: crashed ? 'page-crash' : 'harness-error', detail: String(e?.stack ?? e).slice(0, 2000) });
  } finally {
    if (crashed && !result.failures.some((f) => f.code === 'page-crash')) result.failures.push({ code: 'page-crash', detail: 'renderer crashed' });
    if (pageErrors.length) result.pageErrors = pageErrors.slice(0, 10);
    result.status = result.failures.length ? 'fail' : 'pass';
    await ctx.close().catch(() => {});
  }
  return result;
}

export async function runCli(argv = process.argv.slice(2)) {
  if (process.env.AG_REMOTE_RUNNER !== '1') { process.stderr.write(`${REMOTE_ONLY_MESSAGE}\n`); return 2; }
  const o = parseArgs(argv);
  if (o.serve) {
    const { url } = await serveStatic(o.serve, o.port);
    process.stdout.write(`serving ${o.serve} at ${url}\n`);
    return new Promise(() => {});                       // server mode (Playwright webServer for tests/perf/browser/**)
  }
  let base = o.url; let server = null;
  if (!base) {
    if (!existsSync(join(o.staticDir, 'index.json'))) throw new Error(`no Storybook build at ${o.staticDir} (qual:build:storybook artifact) and no --storybook-url`);
    ({ server, url: base } = await serveStatic(o.staticDir));
  }
  const doc = { version: 1, schemaVersion: SCHEMA_VERSION, sha: gitSha(), generatedAt: new Date().toISOString(), scope: o.scope,
    runner: { tags: process.env.CI_RUNNER_TAGS ?? null, job: process.env.CI_JOB_NAME ?? null, jobUrl: process.env.CI_JOB_URL ?? null,
      pipelineUrl: process.env.CI_PIPELINE_URL ?? null, node: process.version, playwright: createRequire(join(ROOT, 'package.json'))('@playwright/test/package.json').version },
    storybook: { source: o.url ?? o.staticDir }, fixtureIds: FIXTURE_IDS, profiles: [], results: [], verdict: 'fail', failures: [] };

  /* subjects */
  const subjects = [];
  const wanted = o.subjects ? new Set(o.subjects) : null;
  for (const id of FIXTURE_IDS) if (!wanted || wanted.has(id) || id === BLANK_ID) subjects.push({ storyId: id, subject: FIXTURES[id].subject, kind: 'fixture', owner: 'QUAL', tier: FIXTURES[id].tier });
  if (o.includeFlagships || wanted) {
    const staticDir = o.url ? null : o.staticDir;
    if (!staticDir) throw new Error('flagship enumeration needs --storybook-static (cert-manifest.json / index.json)');
    for (const f of listFlagships(staticDir)) if (!wanted || wanted.has(f.id) || wanted.has(f.subject)) subjects.push({ storyId: f.id, subject: f.subject, kind: 'flagship', owner: f.owner, tier: null });
  }
  if (wanted) for (const w of wanted) if (!subjects.some((s) => s.storyId === w || s.subject === w)) doc.failures.push({ code: 'unknown-subject', detail: w });

  /* bytes (once per subject; the same bundle for every profile) */
  const { loadFragments } = await import(pathToFileURL(join(ROOT, 'src/contracts/load-fragments.mjs')).href);
  const rows = (await loadFragments('size-budgets', ROOT)).flatMap((f) => f.value);
  let pkgDir; let pkgError = null;
  try { pkgDir = resolvePackageDir(); } catch (e) { pkgError = String(e?.message ?? e); }
  const bytesBy = new Map();
  for (const s of subjects) {
    if (s.kind === 'fixture') continue;
    const row = findSizeRow(rows, s.subject);
    if (!row) continue;
    s.bytesRequired = row.id;
    if (!pkgDir) continue;
    try { bytesBy.set(s.subject, await measureBytes(row, pkgDir)); } catch (e) { doc.failures.push({ code: 'harness-error', subject: s.subject, detail: `bundle ${row.import}: ${e?.message ?? e}` }); }
  }
  if (subjects.some((s) => s.bytesRequired) && !pkgDir) doc.failures.push({ code: 'missing-metric', detail: `bundle bytes: no packed tarball (AURAGLASS_TARBALL or .artifacts/pack/*.tgz from plat:package:pack)${pkgError ? `: ${pkgError}` : ''}` });

  for (const pid of o.profiles) {
    const profile = PROFILES[pid];
    const engines = Array.isArray(profile.engine) ? (o.engines ?? profile.engine) : [profile.engine];
    const rates = pid === 'a' ? (o.refreshHz ?? profile.refreshHz) : profile.refreshHz;
    for (const engine of engines) for (const hz of rates) {
      const run = { id: pid, name: profile.name, engine, refreshHz: hz, viewport: profile.viewport, dpr: profile.dpr, cpuThrottle: profile.cpuThrottle,
        headless: profile.headless, browserVersion: null, gpu: null, display: null, blank: {}, failures: [] };
      doc.profiles.push(run);
      if (pid === 'a' && !process.env.DISPLAY) { run.failures.push({ code: 'headed-display-missing', detail: 'profile (a) is headed; run under xvfb-run or a GPU display' }); continue; }
      let browser;
      try { browser = await launch(engine, profile); } catch (e) { run.failures.push({ code: 'browser-launch-failed', detail: String(e?.message ?? e) }); continue; }
      run.browserVersion = browser.version();
      try {
        if (pid === 'a') {
          const bcdp = await browser.newBrowserCDPSession();
          const info = await bcdp.send('SystemInfo.getInfo');
          const flags = softwareFlags(info.gpu?.featureStatus);
          run.gpu = { featureStatus: info.gpu?.featureStatus ?? {}, ...flags, device: info.gpu?.devices?.[0]?.deviceString ?? null };
          if (flags.softwareCompositing) run.failures.push({ code: 'software-compositing', detail: `gpu_compositing=${info.gpu?.featureStatus?.gpu_compositing}` });
          if (flags.softwareRaster) run.failures.push({ code: 'software-raster', detail: `rasterization=${info.gpu?.featureStatus?.rasterization}` });
        }
        for (const scene of o.scenes) {
          /* blank baseline, measured twice: Δ blank-vs-blank must be 0 ± 1 ms */
          const blankArgs = { storyId: BLANK_ID, subject: 'perf-harness-blank', kind: 'fixture', owner: 'QUAL', scene, tier: 'standard', refreshHz: hz, heapRequired: false, bytes: null, bytesRequired: null };
          const blank = await runOne(browser, engine, profile, base, blankArgs);
          const repeat = await runOne(browser, engine, profile, base, blankArgs);
          const dRepeat = deltaVsBlank(repeat.windows.settled, blank.windows.settled);
          blank.delta = { frameP50Ms: 0, frameP95Ms: 0, frameP99Ms: 0, longTasks: 0, longTaskTotalMs: 0 };
          const stable = dRepeat && Math.abs(dRepeat.frameP50Ms ?? Infinity) <= BLANK_TOLERANCE_MS && Math.abs(dRepeat.frameP95Ms ?? Infinity) <= BLANK_TOLERANCE_MS;
          run.blank[scene] = { blankRepeatDelta: dRepeat, withinTolerance: !!stable, toleranceMs: BLANK_TOLERANCE_MS };
          if (!stable) run.failures.push({ code: 'blank-baseline-unstable', detail: `scene ${scene}: blank-vs-blank Δp50 ${dRepeat?.frameP50Ms} ms, Δp95 ${dRepeat?.frameP95Ms} ms (tolerance ±${BLANK_TOLERANCE_MS} ms)` });
          if (pid === 'a' && blank.windows.settled?.raf?.p50Ms) {
            const measuredHz = 1000 / blank.windows.settled.raf.p50Ms;
            run.display = { requestedHz: hz, measuredHz };
            if (Math.abs(measuredHz - hz) / hz > 0.1) run.failures.push({ code: 'display-refresh-mismatch', detail: `requested ${hz} Hz, measured ${measuredHz.toFixed(1)} Hz on the blank fixture` });
          }
          doc.results.push(blank);
          for (const s of subjects) {
            if (s.storyId === BLANK_ID) continue;
            const tiers = s.tier ? [s.tier] : o.tiers;
            for (const tier of tiers) {
              const r = await runOne(browser, engine, profile, base, { ...s, scene, tier, refreshHz: hz, heapRequired: true,
                bytes: bytesBy.get(s.subject) ?? null, bytesRequired: s.bytesRequired ?? null });
              r.delta = deltaVsBlank(r.windows.settled, blank.windows.settled);
              doc.results.push(r);
            }
          }
        }
      } finally { await browser.close().catch(() => {}); }
    }
  }
  if (server) server.close();

  const failing = [...doc.failures, ...doc.profiles.flatMap((p) => p.failures.map((f) => ({ ...f, profile: `${p.id}/${p.engine}@${p.refreshHz}` }))),
    ...doc.results.filter((r) => r.status === 'fail').map((r) => ({ code: 'subject-failed', subject: r.storyId, profile: `${r.profile}/${r.engine}@${r.refreshHz}`,
      detail: r.failures.map((f) => f.code).join(', ') }))];
  doc.failures = failing;
  doc.verdict = failing.length ? 'fail' : 'pass';
  const v = validateResults(doc);
  mkdirSync(dirname(resolve(o.out)), { recursive: true });
  if (!v.ok) {
    writeFileSync(resolve(`${o.out}.invalid.json`), `${JSON.stringify(doc, null, 2)}\n`);
    process.stderr.write(`perf-results.json does not validate against ${SCHEMA_PATH}:\n  ${v.errors.slice(0, 50).join('\n  ')}\n`);
    return 1;
  }
  writeFileSync(resolve(o.out), `${JSON.stringify(doc, null, 2)}\n`);
  process.stdout.write(`L10 perf: ${doc.results.length} results, verdict ${doc.verdict} → ${o.out}\n`);
  for (const f of failing.slice(0, 40)) process.stdout.write(`  FAIL ${f.code}${f.subject ? ` ${f.subject}` : ''}${f.profile ? ` [${f.profile}]` : ''}: ${f.detail ?? ''}\n`);
  return doc.verdict === 'pass' ? 0 : 1;
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  runCli().then((code) => { if (code !== undefined) process.exitCode = code; }, (e) => { process.stderr.write(`${e?.stack ?? e}\n`); process.exitCode = 1; });
}
