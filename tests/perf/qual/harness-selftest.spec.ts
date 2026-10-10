/* tests/perf/qual/harness-selftest.spec.ts — REQ-QUAL-34 harness self-test (remote L10 only, qual:certify:l10).
   Runs tests/perf/harness/run-perf.mjs's measurement on four fixture pages in Chromium:
     clean        full-viewport 20 px backdrop → no failures, BCI 1.0, every Chromium metric present
     scrim        12 px backdrop on ::before   → BCI 0.6 measured from real layout (the collector, not the arithmetic)
     long task    a forced 200 ms task inside the settled window → reported, and the result fails (settled-long-frame)
     animated blur  an infinite backdrop-filter keyframe animation → reported, and the result fails (animated-blur)
   and checks that a perf-results document containing them validates and has verdict `fail`. Locally (no
   AG_REMOTE_RUNNER=1) the file throws the harness's remote-only message instead of running. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import {
  FIXTURE_IDS, PROFILES, REMOTE_ONLY_MESSAGE, SCHEMA_VERSION, agPerfInit, evaluateFailures, measurePage, validateResults,
} from '../harness/run-perf.mjs';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const ORIGIN = 'https://perf-selftest.invalid';
const BG = 'background: linear-gradient(135deg, #2b5876 0%, #4e4376 50%, #f7971e 100%); margin: 0; min-height: 200vh; font: 16px system-ui;';
const PAGES: Record<string, string> = {
  clean: `<!doctype html><html><body style="${BG}"><div data-ag-part="panel" style="position:fixed;inset:0;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)"></div><p>clean</p></body></html>`,
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
};

async function open(page: Page, name: keyof typeof PAGES) {
  await page.route(`${ORIGIN}/**`, (route) => route.fulfill({ contentType: 'text/html', body: PAGES[name]! }));
  await page.addInitScript(agPerfInit);
  await page.setViewportSize(PROFILES.c.viewport);
  await page.goto(`${ORIGIN}/${name}`);
}

async function measure(page: Page, name: keyof typeof PAGES) {
  await open(page, name);
  const cdp = await page.context().newCDPSession(page);
  const m = await measurePage(page, { profileId: 'c', engine: 'chromium', browser: page.context().browser(), cdp, drive: [], cycle: null });
  const result = {
    subject: `selftest-${name}`, storyId: `perf-selftest--${name.toLowerCase()}`, kind: 'fixture', owner: 'QUAL', profile: 'c', engine: 'chromium',
    viewport: PROFILES.c.viewport, dpr: 1, refreshHz: 60, tier: 'standard', scene: 'photo', interaction: m.interaction, status: 'pass', failures: [] as Array<{ code: string; detail: string }>,
    windows: m.windows, gpu: m.gpu, heap: m.heap, idle: m.idle, bytes: null, bytesNote: 'self-test page', delta: null, animatedBlur: m.animatedBlur,
  };
  result.failures = evaluateFailures(result, 'c');
  result.status = result.failures.length ? 'fail' : 'pass';
  return result;
}

test.describe.configure({ mode: 'serial', timeout: 120_000 });
/* Runs only in the chromium project of tests/perf/qual/playwright.config.ts: it exercises the trace/CDP path;
   profile (d) is exercised by the L10 run itself. */

const collected: Array<Awaited<ReturnType<typeof measure>>> = [];

test('clean fixture: every Chromium metric present, BCI 1.0, no failures', async ({ page }) => {
  const r = await measure(page, 'clean');
  collected.push(r);
  expect(r.failures).toEqual([]);
  expect(r.windows.settled!.frames.source).toBe('trace');
  expect(r.windows.settled!.frames.count).toBeGreaterThan(0);
  expect(r.windows.settled!.cdp).not.toBeNull();
  expect(r.windows.settled!.loaf).not.toBeNull();
  expect(r.windows.settled!.eventTiming!.pointerdown.dispatched).toBeGreaterThan(0);
  expect(r.gpu.blurredSurfaces).toBe(1);
  expect(r.gpu.bci).toBeCloseTo(1.0, 2);
  expect(Number.isInteger(r.gpu.layerCount)).toBe(true);
});

test('12 px scrim on ::before measures BCI 0.6 from real layout', async ({ page }) => {
  const r = await measure(page, 'scrim');
  collected.push(r);
  expect(r.failures).toEqual([]);
  expect(r.gpu.blurredSurfaces).toBe(1);
  expect(r.gpu.maxBlurPx).toBe(12);
  expect(r.gpu.bci).toBeCloseTo(0.6, 2);
});

test('a forced 200 ms long task is reported and fails the result', async ({ page }) => {
  const r = await measure(page, 'longTask');
  collected.push(r);
  expect(r.windows.settled!.longTasks!.maxMs).toBeGreaterThanOrEqual(200);
  expect(r.windows.settled!.loaf!.over100ms).toBeGreaterThanOrEqual(1);
  expect(r.status).toBe('fail');
  expect(r.failures.map((f) => f.code)).toContain('settled-long-frame');
});

test('an animated blur is reported and fails the result', async ({ page }) => {
  const r = await measure(page, 'animatedBlur');
  collected.push(r);
  expect(r.animatedBlur.length).toBeGreaterThanOrEqual(1);
  expect(r.animatedBlur[0]!.property).toMatch(/backdrop-?filter/i);
  expect(r.idle!.infiniteAnimations).toBeGreaterThanOrEqual(1);
  expect(r.status).toBe('fail');
  expect(r.failures.map((f) => f.code)).toContain('animated-blur');
});

test('a run containing the injected failures validates against the schema and fails', async () => {
  expect(collected.map((r) => r.subject)).toEqual(['selftest-clean', 'selftest-scrim', 'selftest-longTask', 'selftest-animatedBlur']);
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
  const v = validateResults(doc);
  expect(v.errors).toEqual([]);
  expect(doc.verdict).toBe('fail');
  expect(failures.map((f) => f.subject)).toEqual(['perf-selftest--longtask', 'perf-selftest--animatedblur']);
});
