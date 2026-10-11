/// <reference path="../../packages/qa/src/types/playwright-core-utils-bundle.d.ts" />
/* G-15 / REQ-QUAL-32 (FIN-434) — known-failures proof against AuraGlass 4.1.0. AC-QUAL-01: a certification that passes
   4.1.0 is broken.

   Input: the v4.1.0 Storybook built in-job from the tag (`AG_KNOWN_FAILURES_STORYBOOK` = its storybook-static dir; job
   qual:certify:known-failures checks the tag out in a scratch worktree and builds it with the 4.1 scripts unchanged).
   This spec serves that directory, runs the 5.x L6 detectors on it (OCR contrast, cost, preference-noop,
   forced-colors backdrop, console) next to the ported 4.x measurement layer, and asserts every entry of
   packages/qa/fixtures/known-failures-4.1.json is reported with its gate id. A missing report fails; nothing is
   skipped. It also re-runs the 10 ported 4.1 detector fixtures (the same module as
   packages/qa/test/inspect.fixtures.test.ts) so a detector change that drops a verdict fails here too.

   Chromium only (the 4.1 evidence is Chromium; tests are tagged @engine-chromium). Desktop 1440×900, DPR 1, light,
   pointer:fine. Evidence: $AURAGLASS_EVIDENCE_DIR/qual/<job-slug>/known-failures.json. Remote-only (GitLab CI). */
import { createServer, type Server } from 'node:http';
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect, type Browser, type Page } from '@playwright/test';
import { PNG } from 'playwright-core/lib/utilsBundle';
import type { Rgba } from '../../packages/qa/src/pixel/raster';
import type { GateResult } from '../../packages/qa/src/pixel/gate';
import { loadThresholds } from '../../packages/qa/src/pixel/thresholds';
import { collectBackdropRects } from '../../packages/qa/src/pixel/density';
import { changedShare, noBackdropGate, noop } from '../../packages/qa/src/pixel/preference';
import { ocr, tesseractVersion } from '../../packages/qa/src/ocr/tesseract';
import { evaluateOcr } from '../../packages/qa/src/ocr/contrast';
import { collectTextRuns, twinCss } from '../../packages/qa/src/ocr/twin';
import { consoleViolations, loadConsoleAllowlist, type ConsoleEvent } from '../../packages/qa/src/evidence/consoleAllowlist';
import { costGate, loadCostCeilings } from '../../packages/qa/src/inspect/cost';
import { inspectSurface } from '../../packages/qa/src/inspect/v41';
import { INSPECT_FIXTURES, loadFixture } from '../../packages/qa/fixtures/inspect/fixtures';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const EXPECTED = JSON.parse(readFileSync(join(ROOT, 'packages/qa/fixtures/known-failures-4.1.json'), 'utf8')) as KnownFailures;
const THRESHOLDS = loadThresholds(ROOT).thresholds;
const COST = loadCostCeilings(ROOT);
const ALLOW = loadConsoleAllowlist(ROOT);
const STATIC_DIR = process.env.AG_KNOWN_FAILURES_STORYBOOK;
const EVIDENCE_DIR = join(ROOT, process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-known-failures');
const READY_TIMEOUT_MS = 30_000;
/** after render, keep listening long enough for mount effects, zero-delay timers and enter transitions to run */
const QUIET_MS = 1_500;

type Mode = 'default' | 'contrast-more' | 'forced-colors';
interface Expectation {
  id: string; gate: string; mode: Mode; story?: string; stories?: string[]; storyImportPath?: string; pointer?: 'fine' | 'coarse';
  expect: { status: 'fail'; worstRatioAtMost?: number; every?: boolean; kind?: ConsoleEvent['kind'] };
  reference41: string;
}
interface KnownFailures { tag: string; commit: string; viewport: { width: number; height: number }; expected: Expectation[] }
interface IndexEntry { id: string; type?: string; importPath?: string; title?: string; name?: string }

const VIEWPORT = EXPECTED.viewport;
const byId = (id: string): Expectation => {
  const e = EXPECTED.expected.find((x) => x.id === id);
  if (!e) throw new Error(`packages/qa/fixtures/known-failures-4.1.json has no entry '${id}'`);
  return e;
};

// ---- the 4.1 Storybook, served from the in-job build ---------------------------------------------------------------
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon', '.map': 'application/json',
};

function serve(dir: string): Promise<{ server: Server; url: string }> {
  const base = resolve(dir);
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
    let file = normalize(join(base, path));
    if (file !== base && !file.startsWith(base + sep)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((ok, ko) => {
    server.once('error', ko);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') { ko(new Error('static server has no port')); return; }
      ok({ server, url: `http://127.0.0.1:${addr.port}` });
    });
  });
}

function storyIndex(dir: string): Map<string, IndexEntry> {
  const file = join(dir, 'index.json');
  if (!existsSync(file)) throw new Error(`${file} is missing: AG_KNOWN_FAILURES_STORYBOOK must be the v4.1.0 storybook-static directory`);
  const raw = JSON.parse(readFileSync(file, 'utf8')) as { entries?: Record<string, IndexEntry> };
  return new Map(Object.values(raw.entries ?? {}).filter((e) => e.type === 'story').map((e) => [e.id, e]));
}

// ---- one render of a 4.1 story ---------------------------------------------------------------------------------------
interface Render { rgba: Rgba; page: Page; events: ConsoleEvent[]; close: () => Promise<void> }

function decode(png: Buffer): Rgba {
  const img = PNG.sync.read(png);
  return { width: img.width, height: img.height, data: new Uint8ClampedArray(img.data.buffer, img.data.byteOffset, img.data.byteLength) };
}

async function readBackMode(page: Page, mode: Mode): Promise<void> {
  const got = await page.evaluate(() => ({ more: matchMedia('(prefers-contrast: more)').matches, forced: matchMedia('(forced-colors: active)').matches }));
  const want = { more: mode === 'contrast-more', forced: mode === 'forced-colors' };
  if (got.more !== want.more || got.forced !== want.forced) {
    throw new Error(`label-mismatch: requested ${mode}, page reads prefers-contrast:more=${got.more} forced-colors:active=${got.forced}`);
  }
}

async function render(browser: Browser, baseUrl: string, storyId: string, mode: Mode): Promise<Render> {
  const context = await browser.newContext({
    viewport: VIEWPORT, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'no-preference',
    contrast: mode === 'contrast-more' ? 'more' : 'no-preference', forcedColors: mode === 'forced-colors' ? 'active' : 'none',
  });
  const page = await context.newPage();
  const events: ConsoleEvent[] = [];
  page.on('pageerror', (err) => events.push({ kind: 'pageerror', text: `${err.name}: ${err.message}` }));
  page.on('console', (m) => { const t = m.type(); if (t === 'error' || t === 'warning') events.push({ kind: t, text: m.text() }); });
  try {
    await page.goto(`${baseUrl}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`);
    await page.waitForFunction(() => document.body.classList.contains('sb-show-main') || document.body.classList.contains('sb-show-errordisplay')
      || document.body.classList.contains('sb-show-nopreview'), undefined, { timeout: READY_TIMEOUT_MS });
    const shown = await page.evaluate(() => [...document.body.classList].filter((c) => c.startsWith('sb-show-')).join(' '));
    if (!shown.includes('sb-show-main')) throw new Error(`${storyId}: Storybook did not render the story (${shown})`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    });
    await page.waitForTimeout(QUIET_MS);
    await readBackMode(page, mode);
    const rgba = decode(await page.screenshot({ animations: 'disabled', caret: 'hide' }));
    return { rgba, page, events, close: () => context.close() };
  } catch (error) {
    await context.close();
    throw error;
  }
}

// ---- evidence --------------------------------------------------------------------------------------------------------
/** One JSON line per expectation result, appended as it is measured (a failing test restarts the worker; nothing is lost). */
const EVIDENCE_FILE = join(EVIDENCE_DIR, 'known-failures.jsonl');
function record(e: Expectation, story: string, result: GateResult | { gate: string; status: string; detail: string }, reported: boolean): void {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  appendFileSync(EVIDENCE_FILE, `${JSON.stringify({
    tag: EXPECTED.tag, commit: EXPECTED.commit, id: e.id, gate: e.gate, story, mode: e.mode, reported, result, reference41: e.reference41,
    retry: test.info().retry,
  })}\n`);
}

let server: Server | null = null;
let baseUrl = '';
let index = new Map<string, IndexEntry>();

// default mode: in order, one worker, and a failing test never skips the remaining reports (serial mode would)
test.describe.configure({ mode: 'default' });

test.describe('REQ-QUAL-32 known failures against v4.1.0 @engine-chromium', () => {
  test.beforeAll(async () => {
    if (!STATIC_DIR) throw new Error('AG_KNOWN_FAILURES_STORYBOOK is unset: run through the qual:certify:known-failures job (it builds the v4.1.0 Storybook in a scratch worktree)');
    index = storyIndex(STATIC_DIR);
    ({ server, url: baseUrl } = await serve(STATIC_DIR));
  });

  test.afterAll(async () => {
    await new Promise<void>((r) => (server ? server.close(() => r()) : r()));
  });

  for (const fixture of INSPECT_FIXTURES) {
    test(`ported 4.1 detector fixture keeps its verdict: ${fixture.id} (${fixture.expected})`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
      try {
        const page = await context.newPage();
        await loadFixture(page, fixture);
        const v = await fixture.verdict(page);
        expect(v.ok, `${fixture.title} (:${fixture.source}) — detector output: ${JSON.stringify(v.observed).slice(0, 4000)}`).toBe(true);
      } finally {
        await context.close();
      }
    });
  }

  test('every expected subject exists in the v4.1.0 index.json', () => {
    const ids = EXPECTED.expected.flatMap((e) => (e.stories ?? (e.story ? [e.story] : [])));
    expect(ids.filter((id) => !index.has(id)), 'story ids from known-failures-4.1.json missing in the built index').toEqual([]);
    const paths = EXPECTED.expected.flatMap((e) => (e.storyImportPath ? [e.storyImportPath] : []));
    for (const p of paths) expect([...index.values()].some((s) => s.importPath?.replace(/^\.\//, '') === p), `${p} has no story in index.json`).toBe(true);
  });

  test('3.2 SaaS App Shell: ocr-contrast fails with worst ≤2.2:1', async ({ browser }) => {
    test.setTimeout(240_000);
    const e = byId('app-shell-ocr-contrast');
    const r = await render(browser, baseUrl, e.story!, e.mode);
    try {
      const runs = await r.page.evaluate(collectTextRuns, 'body');
      await r.page.addStyleTag({ content: twinCss('body') });
      await r.page.evaluate(() => new Promise<void>((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok()))));
      const twin = decode(await r.page.screenshot({ animations: 'disabled', caret: 'hide' }));
      const words = ocr(r.rgba, { psm: THRESHOLDS.ocr.psm, upscale: THRESHOLDS.ocr.upscale }).words;
      const v = evaluateOcr({ capture: r.rgba, twin, words, runs, dpr: 1, contrastMore: false, thresholds: THRESHOLDS.ocr });
      const worst = v.worst?.ratio ?? null;
      const reported = v.gate === e.gate && v.status === 'fail' && worst !== null && worst <= e.expect.worstRatioAtMost!;
      record(e, e.story!, { gate: v.gate, status: v.status, detail: `${v.detail} (worst ${worst === null ? 'n/a' : worst.toFixed(2)}:1; tesseract ${tesseractVersion()})` }, reported);
      expect(v.status, v.detail).toBe('fail');
      expect(worst, `worst OCR contrast must be ≤${e.expect.worstRatioAtMost}:1; ${v.detail}`).not.toBeNull();
      expect(worst!).toBeLessThanOrEqual(e.expect.worstRatioAtMost!);
    } finally {
      await r.close();
    }
  });

  test('Glass Modal: cost fails (visible blurred surfaces over the fine-pointer ceiling)', async ({ browser }) => {
    const e = byId('glass-modal-cost');
    const r = await render(browser, baseUrl, e.story!, e.mode);
    try {
      const rects = await r.page.evaluate(collectBackdropRects, null);
      const g = costGate(rects, VIEWPORT, e.pointer!, COST);
      // the ported 4.x surface walk must see the same material (it inspects every rendered glass surface)
      const surfaces = (await inspectSurface(r.page)).filter((s) => s.surfaceKind === 'backdrop');
      record(e, e.story!, { ...g, detail: `${g.detail}; 4.x inspectSurface backdrop surfaces: ${surfaces.length}` }, g.gate === e.gate && g.status === 'fail');
      expect(g.gate).toBe('cost');
      expect(g.status, g.detail).toBe('fail');
      expect(g.value!).toBeGreaterThan(g.limit!);
    } finally {
      await r.close();
    }
  });

  test('contrast-more is preference-noop on all 12 measured 4.1 stories', async ({ browser }) => {
    test.setTimeout(600_000);
    const e = byId('contrast-more-noop');
    const notReported: string[] = [];
    for (const story of e.stories!) {
      const d = await render(browser, baseUrl, story, 'default');
      const more = await render(browser, baseUrl, story, 'contrast-more').catch(async (err) => { await d.close(); throw err; });
      try {
        const full = [{ x: 0, y: 0, w: d.rgba.width, h: d.rgba.height }];
        const g = noop('contrast-more', changedShare(d.rgba, more.rgba, full, 0));
        const reported = g.gate === e.gate && g.status === 'fail';
        record(e, story, g, reported);
        if (!reported) notReported.push(`${story}: ${g.detail}`);
      } finally {
        await d.close();
        await more.close();
      }
    }
    expect(notReported, 'stories where contrast-more was not reported preference-noop').toEqual([]);
  });

  test('Liquid Glass showcase: forced-colors keeps backdrop filters (forced-colors-no-backdrop fails)', async ({ browser }) => {
    const e = byId('showcase-forced-colors-backdrop');
    const r = await render(browser, baseUrl, e.story!, e.mode);
    try {
      const g = noBackdropGate('forced-colors', await r.page.evaluate(collectBackdropRects, null));
      record(e, e.story!, g, g.gate === e.gate && g.status === 'fail');
      expect(g.gate).toBe('forced-colors-no-backdrop');
      expect(g.status, g.detail).toBe('fail');
    } finally {
      await r.close();
    }
  });

  test('PageTransitionDemo: console reports a pageerror', async ({ browser }) => {
    const e = byId('page-transition-pageerror');
    const story = [...index.values()].find((s) => s.importPath?.replace(/^\.\//, '') === e.storyImportPath);
    expect(story, `${e.storyImportPath} has no story in index.json`).toBeDefined();
    // the story may throw while rendering: a render failure is still a console report, so collect before asserting render
    const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, colorScheme: 'light' });
    const page = await context.newPage();
    const events: ConsoleEvent[] = [];
    page.on('pageerror', (err) => events.push({ kind: 'pageerror', text: `${err.name}: ${err.message}` }));
    page.on('console', (m) => { const t = m.type(); if (t === 'error' || t === 'warning') events.push({ kind: t, text: m.text() }); });
    try {
      await page.goto(`${baseUrl}/iframe.html?id=${encodeURIComponent(story!.id)}&viewMode=story`);
      await page.waitForFunction(() => [...document.body.classList].some((c) => c === 'sb-show-main' || c === 'sb-show-errordisplay'), undefined, { timeout: READY_TIMEOUT_MS });
      await page.waitForTimeout(QUIET_MS);
      const violations = consoleViolations(events, ALLOW);
      const pageerrors = violations.filter((v) => v.kind === e.expect.kind);
      const g = { gate: 'console', status: violations.length ? 'fail' : 'pass', detail: violations.map((v) => `${v.kind}: ${v.text.slice(0, 300)}`).join(' | ') || 'no console violations' };
      record(e, story!.id, g, g.status === 'fail' && pageerrors.length > 0);
      expect(pageerrors.map((p) => p.text), `console gate for ${story!.id}: ${g.detail}`).not.toEqual([]);
    } finally {
      await context.close();
    }
  });
});
