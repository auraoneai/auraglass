/* tests/perf/qual/harness-selftest.spec.ts — REQ-QUAL-34 harness self-test (remote L10 only, qual:certify:l10).
   Runs tests/perf/harness/run-perf.mjs's measurement on fixture pages in Chromium (profile c limits):
     plain          no blur, static page                → no failures at all (the harness does not fail a clean page)
     full blur      full-viewport 20 px backdrop        → every Chromium metric present, BCI 1.0 from real layout
                    (its frame cost on software raster is real and may fail settled-long-frame; that is not asserted)
     scrim          12 px backdrop on ::before          → BCI 0.6 from real layout, every metric present
     long task      forced 200 ms task in the settled window → reported, and the result fails (settled-long-frame)
     animated blur  infinite backdrop-filter keyframes  → reported, and the result fails (animated-blur)
   and checks that a perf-results document containing them validates and has verdict `fail` because of the two
   injected faults. Results are written to the job evidence. Locally (no AG_REMOTE_RUNNER=1) the file throws the
   harness's remote-only message instead of running. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import {
  FIXTURE_IDS, PROFILES, REMOTE_ONLY_MESSAGE, SCHEMA_VERSION, agPerfInit, evaluateFailures, measurePage, validateResults,
  type Failure, type Measurement,
} from '../harness/run-perf.mjs';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const ORIGIN = 'https://perf-selftest.invalid';
const BG = 'background: linear-gradient(135deg, #2b5876 0%, #4e4376 50%, #f7971e 100%); margin: 0; min-height: 200vh; font: 16px system-ui;';
const PAGES = {
  plain: `<!doctype html><html><body style="${BG}"><main><h1>plain</h1><p>No blurred surface.</p></main></body></html>`,
  fullBlur: `<!doctype html><html><body style="${BG}"><div data-ag-part="panel" style="position:fixed;inset:0;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)"></div><p>full blur</p></body></html>`,
  scrim: `<!doctype html><html><head><style>
      .scrim { position: fixed; inset: 0; }
      .scrim::before { content: ''; position: absolute; inset: 0; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    </style></head><body style="${BG}"><div class="scrim" data-ag-part="scrim"></div><p>scrim</p></body></html>`,
  longTask: `<!doctype html><html><body style="${BG}"><p>long task</p><script>
      let fired = false;
      addEventListener('pointerdown', () => {
        if (fired) return; fired = true;
        setTimeout(() => { const t = performance.now(); while (performance.now() - t < 200) { /* forced 200 ms task */ } }, 300);
      }, true);
    </script></body></html>`,
  animatedBlur: `<!doctype html><html><head><style>
      @keyframes ag-selftest-blur { from { backdrop-filter: blur(0px); } to { backdrop-filter: blur(20px); } }
      .pulse { position: fixed; inset: 10vh 10vw; animation: ag-selftest-blur 1s linear infinite alternate; }
    </style></head><body style="${BG}"><div class="pulse" data-ag-part="pulse"></div></body></html>`,
} as const;
type PageName = keyof typeof PAGES;

async function open(page: Page, name: PageName) {
  await page.route(`${ORIGIN}/**`, (route) => route.fulfill({ contentType: 'text/html', body: PAGES[name] }));
  await page.addInitScript(agPerfInit);
  await page.setViewportSize(PROFILES.c.viewport);
  await page.goto(`${ORIGIN}/${name}`);
}

type SelftestResult = Record<string, unknown> & Pick<Measurement, 'windows' | 'gpu' | 'heap' | 'idle' | 'animatedBlur' | 'interaction'> & {
  subject: string; storyId: string; status: 'pass' | 'fail'; failures: Failure[];
};
const collected: SelftestResult[] = [];

async function measure(page: Page, name: PageName): Promise<SelftestResult> {
  await open(page, name);
  const cdp = await page.context().newCDPSession(page);
  const m = await measurePage(page, { profileId: 'c', engine: 'chromium', browser: page.context().browser(), cdp, drive: [], cycle: null });
  const result: SelftestResult = {
    subject: `selftest-${name}`, storyId: `perf-selftest--${name.toLowerCase()}`, kind: 'fixture', owner: 'QUAL', profile: 'c', engine: 'chromium',
    viewport: PROFILES.c.viewport, dpr: 1, refreshHz: 60, tier: 'standard', scene: 'photo', interaction: m.interaction, status: 'pass', failures: [],
    windows: m.windows, gpu: m.gpu, heap: m.heap, idle: m.idle, bytes: null, bytesNote: 'self-test page', delta: null, animatedBlur: m.animatedBlur,
  };
  result.failures = evaluateFailures(result, 'c');
  result.status = result.failures.length ? 'fail' : 'pass';
  collected.push(result);
  return result;
}

/** Failures that mean the harness could not measure (as opposed to a measured budget breach). */
const measurementFailures = (r: { failures: Array<{ code: string }> }) => r.failures.filter((f) => f.code === 'missing-metric' || f.code === 'zero-frames');


test.describe.configure({ mode: 'serial', timeout: 120_000 });
/* Runs only in the chromium project of tests/perf/qual/playwright.config.ts: it exercises the trace/CDP path;
   profile (d) is exercised by the L10 run itself. */

test('plain page: every Chromium metric present and no failures', async ({ page }) => {
  const r = await measure(page, 'plain');
  expect(r.failures).toEqual([]);
  expect(r.windows.settled!.frames.source).toBe('trace');
  expect(r.windows.settled!.frames.count).toBeGreaterThan(0);
  expect(r.windows.settled!.cdp).not.toBeNull();
  expect(r.windows.settled!.trace).not.toBeNull();
  expect(r.windows.settled!.loaf).not.toBeNull();
  expect(r.windows.settled!.eventTiming!.pointerdown.dispatched).toBeGreaterThan(0);
  expect(r.windows.settled!.eventTiming!.keydown.dispatched).toBeGreaterThan(0);
  expect(Number.isInteger(r.gpu.layerCount)).toBe(true);
  expect(r.gpu.blurredSurfaces).toBe(0);
  expect(r.gpu.bci).toBe(0);
});

test('full-viewport 20 px backdrop measures BCI 1.0 from real layout', async ({ page }) => {
  const r = await measure(page, 'fullBlur');
  expect(measurementFailures(r)).toEqual([]);
  expect(r.gpu.blurredSurfaces).toBe(1);
  expect(r.gpu.maxBlurPx).toBe(20);
  expect(r.gpu.bci).toBeCloseTo(1.0, 2);
});

test('12 px scrim on ::before measures BCI 0.6 from real layout', async ({ page }) => {
  const r = await measure(page, 'scrim');
  expect(measurementFailures(r)).toEqual([]);
  expect(r.gpu.blurredSurfaces).toBe(1);
  expect(r.gpu.maxBlurPx).toBe(12);
  expect(r.gpu.bci).toBeCloseTo(0.6, 2);
});

test('a forced 200 ms long task is reported and fails the result', async ({ page }) => {
  const r = await measure(page, 'longTask');
  expect(measurementFailures(r)).toEqual([]);
  expect(r.windows.settled!.longTasks!.maxMs).toBeGreaterThanOrEqual(200);
  expect(r.windows.settled!.loaf!.over100ms).toBeGreaterThanOrEqual(1);
  expect(r.status).toBe('fail');
  expect(r.failures.map((f) => f.code)).toContain('settled-long-frame');
});

test('an animated blur is reported and fails the result', async ({ page }) => {
  const r = await measure(page, 'animatedBlur');
  expect(measurementFailures(r)).toEqual([]);
  expect(r.animatedBlur.length).toBeGreaterThanOrEqual(1);
  expect(r.animatedBlur[0]!.property).toMatch(/backdrop-?filter/i);
  expect(r.idle!.infiniteAnimations).toBeGreaterThanOrEqual(1);
  expect(r.status).toBe('fail');
  expect(r.failures.map((f) => f.code)).toContain('animated-blur');
});

test('a run containing the injected faults validates against the schema and fails because of them', async () => {
  expect(collected.map((r) => r.subject)).toEqual(['selftest-plain', 'selftest-fullBlur', 'selftest-scrim', 'selftest-longTask', 'selftest-animatedBlur']);
  const failures = collected.filter((r) => r.status === 'fail').map((r) => ({ code: 'subject-failed' as const, subject: r.storyId, profile: 'c/chromium@60', detail: r.failures.map((f) => f.code).join(', ') }));
  const doc = {
    version: 1, schemaVersion: SCHEMA_VERSION, sha: process.env.CI_COMMIT_SHA ?? 'selftest', generatedAt: new Date().toISOString(), scope: 'pr',
    runner: { tags: process.env.CI_RUNNER_TAGS ?? null, job: process.env.CI_JOB_NAME ?? null, jobUrl: process.env.CI_JOB_URL ?? null, pipelineUrl: process.env.CI_PIPELINE_URL ?? null, node: process.version, playwright: 'selftest' },
    storybook: { source: ORIGIN }, fixtureIds: FIXTURE_IDS,
    profiles: [{ id: 'c', name: PROFILES.c.name, engine: 'chromium', refreshHz: 60, viewport: PROFILES.c.viewport, dpr: 1, cpuThrottle: 1, headless: true, browserVersion: null, gpu: null, display: null, blank: {}, failures: [] }],
    results: collected, verdict: failures.length ? 'fail' : 'pass', failures,
  };
  const dir = resolve(process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-l10');
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'harness-selftest-results.json'), `${JSON.stringify(doc, null, 2)}\n`);
  expect(validateResults(doc).errors).toEqual([]);
  expect(doc.verdict).toBe('fail');
  const failing = failures.map((f) => f.subject);
  expect(failing).toEqual(expect.arrayContaining(['perf-selftest--longtask', 'perf-selftest--animatedblur']));
  expect(failing).not.toContain('perf-selftest--plain');
});
