// tests/perf/browser/surf/labs-spatial-admission.spec.ts — REQ-SURF-168 (lane L10, remote only).
//
// A spatial @auraglass/labs resident (a labs export whose capability-ledger row
// has area 'spatial') is admitted only when, on the mid-tier mobile profile
// (PerfProfileId 'mid-mobile': Pixel 5 emulation + 4x CPU throttle, Chromium/CDP):
//   1. it costs <= 4 ms p95 main-thread time per frame (CDP Tracing timeline);
//   2. it adds <= 1 composited layer (CDP LayerTree.layerTreeDidChange, with vs without);
//   3. it runs 0 rAF callbacks in the 500 ms after visibilitychange -> hidden;
//   4. it runs 0 rAF callbacks in the 500 ms after scroll-out;
//   5. two reduced-motion captures are byte-identical (Buffer.equals);
//   6. it carries no primary text or focusable controls, and its ledger row
//      names a product use in `surface`.
// The same probe runs against synthetic fixture residents (a well-behaved one
// and one that leaks rAF / carries a control) so the assertions are proven to
// fail where they must. WebXR / AR preview / 360 residents never reach this
// spec: scripts/surf/verify-labs-admission.mjs rejects them (rule rejected-spatial).
import { test, expect, devices, type Page, type CDPSession } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { listSubjects, gotoStory } from '../../../helpers';

const ROOT = join(__dirname, '../../../..');
const BUDGET = { p95MainMsPerFrame: 4, layerDelta: 1, rafAfterHidden: 0, rafAfterScrollOut: 0, windowMs: 500 } as const;
const CPU_THROTTLE = 4;
const FRAME_MS = 1000 / 60;
const RESIDENT = '#storybook-root > *';

// CDP Tracing / LayerTree / CPU throttling are Chromium-only, so the profile pins chromium.
const { defaultBrowserType: _defaultBrowser, ...MID_MOBILE } = devices['Pixel 5'];
test.use({ ...MID_MOBILE, browserName: 'chromium' });

interface Metrics {
  p95MainMsPerFrame: number;
  layerDelta: number;
  rafAfterHidden: number;
  rafAfterScrollOut: number;
  reducedMotionIdentical: boolean;
  textNodes: number;
  focusable: number;
}

/** Budget violations for a measured resident; [] means admitted. */
function violations(m: Metrics): string[] {
  const v: string[] = [];
  if (m.p95MainMsPerFrame > BUDGET.p95MainMsPerFrame) v.push(`p95 main thread ${m.p95MainMsPerFrame.toFixed(2)} ms/frame > ${BUDGET.p95MainMsPerFrame}`);
  if (m.layerDelta > BUDGET.layerDelta) v.push(`composited layer delta ${m.layerDelta} > ${BUDGET.layerDelta}`);
  if (m.rafAfterHidden > BUDGET.rafAfterHidden) v.push(`rAF after hidden ${m.rafAfterHidden}`);
  if (m.rafAfterScrollOut > BUDGET.rafAfterScrollOut) v.push(`rAF after scroll-out ${m.rafAfterScrollOut}`);
  if (!m.reducedMotionIdentical) v.push('reduced-motion captures differ');
  if (m.textNodes > 0) v.push(`primary text nodes ${m.textNodes}`);
  if (m.focusable > 0) v.push(`focusable controls ${m.focusable}`);
  return v;
}

/* ---------- page-side instrumentation ---------- */
// Counts rAF callbacks the page runs while `counting` is on. Installed before
// any page script so residents schedule through the wrapper.
function installRafCounter() {
  const w = window as unknown as { __agRaf?: { calls: number; counting: boolean } };
  if (w.__agRaf) return;
  const raw = window.requestAnimationFrame.bind(window);
  const rec = { calls: 0, counting: false };
  w.__agRaf = rec;
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    raw((t) => { if (rec.counting) rec.calls++; cb(t); });
}

async function countRafFor(page: Page, ms: number): Promise<number> {
  await page.evaluate(() => {
    const rec = (window as unknown as { __agRaf: { calls: number; counting: boolean } }).__agRaf;
    rec.calls = 0;
    rec.counting = true;
  });
  await page.waitForTimeout(ms);
  return page.evaluate(() => {
    const rec = (window as unknown as { __agRaf: { calls: number; counting: boolean } }).__agRaf;
    rec.counting = false;
    return rec.calls;
  });
}

const setVisibility = (page: Page, hidden: boolean) =>
  page.evaluate((h) => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (h ? 'hidden' : 'visible') });
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => h });
    document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
  }, hidden);

async function rafAfterHidden(page: Page): Promise<number> {
  await setVisibility(page, true);
  const n = await countRafFor(page, BUDGET.windowMs);
  await setVisibility(page, false);
  return n;
}

async function rafAfterScrollOut(page: Page): Promise<number> {
  await page.evaluate((sel) => {
    const spacer = document.createElement('div');
    spacer.id = '__ag-scroll-spacer';
    spacer.style.height = `${window.innerHeight * 4}px`;
    document.querySelector(sel)?.parentElement?.after(spacer);
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, RESIDENT);
  // IntersectionObserver delivers asynchronously; one delivery tick, then the window.
  await page.waitForTimeout(100);
  const n = await countRafFor(page, BUDGET.windowMs);
  await page.evaluate(() => { document.getElementById('__ag-scroll-spacer')?.remove(); window.scrollTo(0, 0); });
  return n;
}

/* ---------- CDP probes ---------- */
interface TraceEvent { name: string; ph: string; ts: number; dur?: number; pid: number; tid: number; args?: { name?: string } }

/** p95 over 1/60 s frame buckets of top-level main-thread task time (ms), from a Tracing timeline. */
async function mainThreadP95(cdp: CDPSession, page: Page, durationMs = 3000): Promise<number> {
  const events: TraceEvent[] = [];
  const onData = (e: { value: Array<{ [key: string]: string }> }) => { events.push(...(e.value as unknown as TraceEvent[])); };
  cdp.on('Tracing.dataCollected', onData);
  await cdp.send('Tracing.start', {
    transferMode: 'ReportEvents',
    traceConfig: { includedCategories: ['toplevel', 'devtools.timeline', 'disabled-by-default-devtools.timeline', '__metadata'] },
  });
  await page.waitForTimeout(durationMs);
  const complete = new Promise<void>((r) => cdp.once('Tracing.tracingComplete', () => r()));
  await cdp.send('Tracing.end');
  await complete;
  cdp.off('Tracing.dataCollected', onData);

  const mains = new Set(events
    .filter((e) => e.ph === 'M' && e.name === 'thread_name' && e.args?.name === 'CrRendererMain')
    .map((e) => `${e.pid}:${e.tid}`));
  const tasks = events.filter((e) => e.ph === 'X' && e.name === 'RunTask' && mains.has(`${e.pid}:${e.tid}`) && e.dur);
  expect(tasks.length, 'trace contains renderer main-thread tasks').toBeGreaterThan(0);
  // The busiest renderer main thread is the page under test.
  const byThread = new Map<string, TraceEvent[]>();
  for (const t of tasks) {
    const k = `${t.pid}:${t.tid}`;
    byThread.set(k, [...(byThread.get(k) ?? []), t]);
  }
  const main = [...byThread.values()].sort((a, b) =>
    b.reduce((s, t) => s + (t.dur ?? 0), 0) - a.reduce((s, t) => s + (t.dur ?? 0), 0))[0]!;
  const start = Math.min(...main.map((t) => t.ts));
  const end = start + durationMs * 1000;
  const frameUs = FRAME_MS * 1000;
  const buckets = new Array(Math.ceil((end - start) / frameUs)).fill(0) as number[];
  for (const t of main) {
    let a = t.ts;
    const b = Math.min(t.ts + (t.dur ?? 0), end);
    while (a < b) {
      const i = Math.floor((a - start) / frameUs);
      const edge = start + (i + 1) * frameUs;
      const seg = Math.min(b, edge) - a;
      if (i >= 0 && i < buckets.length) buckets[i] = (buckets[i] ?? 0) + seg / 1000;
      a += seg;
    }
  }
  const sorted = [...buckets].sort((x, y) => x - y);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? 0;
}

/** Composited layer count from the latest LayerTree.layerTreeDidChange after `settleMs`. */
async function layerCount(cdp: CDPSession, page: Page, settleMs = 500): Promise<number> {
  let latest: unknown[] | undefined;
  const on = (e: { layers?: unknown[] }) => { if (e.layers) latest = e.layers; };
  cdp.on('LayerTree.layerTreeDidChange', on);
  await cdp.send('LayerTree.enable');
  // Force a commit so the tree is reported even for a static page.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.waitForTimeout(settleMs);
  await cdp.send('LayerTree.disable');
  cdp.off('LayerTree.layerTreeDidChange', on);
  expect(latest, 'LayerTree.layerTreeDidChange reported a layer tree').toBeDefined();
  return latest!.length;
}

async function layerDelta(cdp: CDPSession, page: Page): Promise<number> {
  const withResident = await layerCount(cdp, page);
  await page.evaluate((sel) => { const el = document.querySelector<HTMLElement>(sel); if (el) el.style.display = 'none'; }, RESIDENT);
  const without = await layerCount(cdp, page);
  await page.evaluate((sel) => { const el = document.querySelector<HTMLElement>(sel); if (el) el.style.display = ''; }, RESIDENT);
  return withResident - without;
}

/* ---------- static content checks ---------- */
const contentCounts = (page: Page) =>
  page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return { textNodes: -1, focusable: -1 };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let textNodes = 0;
    while (walker.nextNode()) if ((walker.currentNode.textContent ?? '').trim()) textNodes++;
    const focusable = root.querySelectorAll(
      'a[href], button, input, select, textarea, summary, [contenteditable=""], [contenteditable="true"], [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="slider"]',
    ).length + (root.matches('[tabindex]:not([tabindex="-1"])') ? 1 : 0);
    return { textNodes, focusable };
  }, RESIDENT);

async function reducedMotionIdentical(page: Page, open: () => Promise<void>): Promise<boolean> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open();
  const el = page.locator(RESIDENT).first();
  await expect(el).toBeVisible();
  await page.waitForTimeout(300);
  const a = await el.screenshot({ animations: 'allow' });
  await page.waitForTimeout(BUDGET.windowMs);
  const b = await el.screenshot({ animations: 'allow' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return a.equals(b);
}

async function measure(page: Page, open: (env?: { motion?: 'none' }) => Promise<void>): Promise<Metrics> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE });
  await page.addInitScript(installRafCounter);
  await open();
  await expect(page.locator(RESIDENT).first()).toBeVisible();
  const p95MainMsPerFrame = await mainThreadP95(cdp, page);
  const delta = await layerDelta(cdp, page);
  const hidden = await rafAfterHidden(page);
  const scrolled = await rafAfterScrollOut(page);
  const { textNodes, focusable } = await contentCounts(page);
  const identical = await reducedMotionIdentical(page, () => open({ motion: 'none' }));
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await cdp.detach();
  return { p95MainMsPerFrame, layerDelta: delta, rafAfterHidden: hidden, rafAfterScrollOut: scrolled,
    reducedMotionIdentical: identical, textNodes, focusable };
}

/* ---------- residents under test ---------- */
interface LedgerRow { id: string; area: string; form: string[]; names: string[]; surface?: string }
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function spatialResidents(): Array<{ resident: string; row: LedgerRow; name: string }> {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'packages/labs/package.json'), 'utf8')) as { exports?: Record<string, unknown> };
  const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8')) as { rows: LedgerRow[] };
  const out: Array<{ resident: string; row: LedgerRow; name: string }> = [];
  for (const key of Object.keys(pkg.exports ?? {})) {
    if (key === './package.json') continue;
    const resident = key.replace(/^\.\//, '');
    const row = ledger.rows.find((r) => r.form.includes('labs') && r.names.some((n) => kebab(n) === resident || n === resident));
    const name = row?.names.find((n) => kebab(n) === resident || n === resident);
    if (row && name && row.area === 'spatial') out.push({ resident, row, name });
  }
  return out;
}

/* ---------- synthetic fixtures (prove the probes fail where they must) ---------- */
const FIXTURE_ORIGIN = 'https://labs-fixture.auraglass.test';
const fixturePage = (body: string) => `<!doctype html><html><head><meta name="viewport" content="width=device-width">
<style>html,body{margin:0}#storybook-root>*{display:block;width:200px;height:200px}</style></head>
<body><div id="storybook-root">${body}</div></body></html>`;

// Well-behaved: draws one static frame under reduced motion, pauses on hidden and offscreen.
const GOOD = fixturePage(`<canvas aria-hidden="true"></canvas><script>
  const c = document.querySelector('canvas'); const g = c.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let id = 0, visible = true, onscreen = true, t = 0;
  const draw = () => { g.fillStyle = 'hsl(' + (t % 360) + ' 60% 50%)'; g.fillRect(0, 0, 200, 200); };
  const tick = () => { t += 2; draw(); id = requestAnimationFrame(tick); };
  const sync = () => { cancelAnimationFrame(id); id = 0; if (!still && visible && onscreen) id = requestAnimationFrame(tick); };
  document.addEventListener('visibilitychange', () => { visible = document.visibilityState === 'visible'; sync(); });
  new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; sync(); }).observe(c);
  draw(); sync();
</script>`);

// Leaky: an rAF loop that never pauses, plus a focusable control and text.
const LEAKY = fixturePage(`<div><canvas aria-hidden="true"></canvas><button>Play</button></div><script>
  const g = document.querySelector('canvas').getContext('2d'); let t = 0;
  const tick = () => { t += 2; g.fillStyle = 'hsl(' + (t % 360) + ' 60% 50%)'; g.fillRect(0, 0, 200, 200); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
</script>`);

async function openFixture(page: Page, html: string) {
  await page.route(`${FIXTURE_ORIGIN}/**`, (route) => route.fulfill({ contentType: 'text/html', body: html }));
  return async () => { await page.goto(`${FIXTURE_ORIGIN}/resident`); };
}

test.describe('SURF labs spatial admission (REQ-SURF-168, mid-mobile)', () => {
  test('synthetic resident that leaks rAF and carries a control fails admission', async ({ page }) => {
    const open = await openFixture(page, LEAKY);
    const v = violations(await measure(page, open));
    expect(v).toEqual(expect.arrayContaining([
      expect.stringMatching(/^rAF after hidden [1-9]/),
      expect.stringMatching(/^rAF after scroll-out [1-9]/),
      expect.stringMatching(/^reduced-motion captures differ$/),
      expect.stringMatching(/^primary text nodes [1-9]/),
      expect.stringMatching(/^focusable controls [1-9]/),
    ]));
  });

  test('synthetic well-behaved resident passes the pause, stillness and content budgets', async ({ page }) => {
    const open = await openFixture(page, GOOD);
    const m = await measure(page, open);
    expect(m.rafAfterHidden).toBe(0);
    expect(m.rafAfterScrollOut).toBe(0);
    expect(m.reducedMotionIdentical).toBe(true);
    expect(m.textNodes).toBe(0);
    expect(m.focusable).toBe(0);
  });

  test('every spatial labs resident meets the six admission budgets', async ({ page }) => {
    const residents = spatialResidents();
    const subjects = residents.length ? await listSubjects({ owner: 'SURF' }) : [];
    for (const { resident, row, name } of residents) {
      await test.step(resident, async () => {
        // Ledger row names a product use (REQ-SURF-168).
        expect(typeof row.surface === 'string' && row.surface.trim().length > 0,
          `${row.id} (${resident}) has a ledger surface`).toBe(true);
        const subject = subjects.find((s) => s.subject === name);
        expect(subject, `${resident}: story subject ${name} registered`).toBeDefined();
        const m = await measure(page, (env) => gotoStory(page, subject!.id, env ?? {}));
        expect(violations(m), `${resident} admission budgets`).toEqual([]);
      });
    }
  });

  test('every delivered spatial labs ledger row ships as a labs export (so it is measured above)', () => {
    const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8')) as { rows: Array<LedgerRow & { status: string }> };
    const measured = new Set(spatialResidents().map((r) => r.name));
    // Promoted rows (form 'export') leave labs after one minor (REQ-SURF-169) and are excluded.
    const delivered = ledger.rows.filter((r) => r.form.includes('labs') && !r.form.includes('export') && r.area === 'spatial' && r.status === 'delivered');
    const unmeasured = delivered.flatMap((r) => r.names.filter((n) => !measured.has(n)).map((n) => `${r.id}:${n}`));
    expect(unmeasured).toEqual([]);
  });
});

// REQ-SURF-180, AC-SURF-33: each shipped labs/three subject holds >= 24 fps and
// <= 256 MB heap at story idle, and shows no horizontal overflow at 360 px.
test.describe('SURF labs spatial admission', () => {
  test('every shipped labs subject meets the spatial budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF', kind: 'lab' });
    expect(subjects.length, 'no labs subjects registered in the subject index').toBeGreaterThan(0);
    const isPerfMode = !!process.env.PERF_MODE;
    for (const subject of subjects) {
      await test.step(subject.id, async () => {
        await page.setViewportSize({ width: 360, height: 640 });
        await gotoStory(page, subject.id);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow).toBeLessThanOrEqual(0);
        if (!isPerfMode) return; // fps/heap assertions run on perf-mode runners only
        const fps = await page.evaluate(
          () =>
            new Promise<number>((resolve) => {
              let frames = 0;
              const start = performance.now();
              const loop = () => {
                frames++;
                if (performance.now() - start < 2000) requestAnimationFrame(loop);
                else resolve((frames / (performance.now() - start)) * 1000);
              };
              requestAnimationFrame(loop);
            })
        );
        expect(fps).toBeGreaterThanOrEqual(24);
        const heap = await page.evaluate(
          () => (performance as any).memory?.usedJSHeapSize ?? 0
        );
        if (heap) expect(heap).toBeLessThan(256 * 1024 * 1024);
      });
    }
  });
});
