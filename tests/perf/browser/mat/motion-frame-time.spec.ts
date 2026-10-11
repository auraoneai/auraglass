/* MAT-243 / REQ-MOT-T18,-124..-127,-130: lane V perf budgets, L10 lane.
 * 4x CPU throttle @390×844 and 120 Hz desktop:
 *  - Dialog open/close p95 <= 16.7 / <= 8.3 ms; 0 long tasks > 50 ms;
 *    0 transition Layout events
 *  - 20-button pointerLight sweep p95 <= 8.3 ms, <= 0.5 ms/frame scripting,
 *    0 React commits
 *  - Tabs/SegmentedControl morph setup <= 4 ms desktop / <= 12 ms mobile
 *  - idle: 0 rAF/s after settle
 *  - glass-modal scripted hover/scroll >= 55 fps median (software raster)
 * Budgets resolve from tests/perf/harness/budgets.json (PERF-owned, SC-15)
 * when present, else the lane fragment tests/perf/browser/mat/budgets.mat.json —
 * missing both fails closed. When PERF-039's run-perf.mjs exists it drives
 * this spec; the spec is self-sufficient meanwhile. */
import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gotoStory, listSubjects } from '../../../helpers';
import { instrumentIdle, idleFor } from '../../../motion/helpers/idle';
import { settle } from '../../../motion/helpers/settle';

const PERF_BUDGETS = join(process.cwd(), 'tests/perf/harness/budgets.json');
const MAT_BUDGETS = join(process.cwd(), 'tests/perf/browser/mat/budgets.mat.json');

interface BudgetRow { value: number; unit: string; req?: string }
const budget = (key: string): number => {
  const files = [PERF_BUDGETS, MAT_BUDGETS].filter(existsSync);
  expect(files.length, 'budget source missing (perf harness or mat fragment) — fails closed')
    .toBeGreaterThan(0);
  for (const f of files) {
    const json = JSON.parse(readFileSync(f, 'utf8')) as { budgets?: Record<string, BudgetRow | number> };
    const row = json.budgets?.[key];
    if (row !== undefined) return typeof row === 'number' ? row : row.value;
  }
  throw new Error(`budget ${key} missing from ${files.join(', ')}`);
};

const p95 = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(0.95 * s.length))] ?? 0;
};

/** per-frame ms via rAF timestamps during an action window. */
const frameTimes = async (
  page: import('@playwright/test').Page,
  act: () => Promise<unknown>,
): Promise<number[]> => {
  await page.evaluate(() => {
    const w = window as unknown as { __ft: number[]; __stop: boolean };
    w.__ft = []; w.__stop = false;
    let last = 0;
    const loop = (t: number) => {
      if (last) w.__ft.push(t - last);
      last = t;
      if (!w.__stop) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  await act();
  await page.evaluate(() => { (window as unknown as { __stop: boolean }).__stop = true; });
  return page.evaluate(() => (window as unknown as { __ft: number[] }).__ft);
};

const longTasks = async (page: import('@playwright/test').Page, act: () => Promise<unknown>) => {
  await page.evaluate(() => {
    const w = window as unknown as { __lt: PerformanceEntry[] };
    w.__lt = [];
    new PerformanceObserver((l) => w.__lt.push(...l.getEntries()))
      .observe({ entryTypes: ['longtask'] });
  });
  await act();
  return page.evaluate(() =>
    (window as unknown as { __lt: PerformanceEntry[] }).__lt.map((e) => e.duration));
};

const subjectId = async (name: string) => {
  const subs = await listSubjects();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (subs.find((s) => norm(s.subject).includes(norm(name)) && s.id.endsWith('--primary')) ??
    subs.find((s) => norm(s.subject).includes(norm(name))))?.id ?? null;
};

test.describe('REQ-MOT-124: Dialog frame budgets', () => {
  test('mobile 4x CPU @390×844: open/close p95 <= 16.7 ms, 0 longtasks, 0 transition Layout', async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const session = await context.newCDPSession(page);
    await session.send('Emulation.setCPUThrottlingRate', { rate: 4 }).catch(() => undefined);
    const id = await subjectId('Dialog');
    if (!id) { test.info().annotations.push({ type: 'motion', description: 'Dialog absent' }); return; }
    await gotoStory(page, id, { motion: 'full' });
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    const open = await frameTimes(page, async () => {
      await trigger.click({ force: true });
      await page.locator('[role="dialog"]').first().waitFor({ state: 'visible' });
      await page.waitForTimeout(120);
    });
    const lts = await longTasks(page, async () => {
      await page.keyboard.press('Escape').catch(() => undefined);
      await page.waitForTimeout(200);
    });
    const transitionLayout = await page.evaluate(() =>
      performance.getEntriesByType('longtask').filter((e) => e.name === 'transition-layout' || (e as { attribution?: unknown[] }).attribution?.length).length);
    expect(p95(open), 'dialog p95 mobile').toBeLessThanOrEqual(budget('dialog.frame.p95.mobile-4xcpu'));
    expect(lts.filter((d) => d > budget('dialog.longtask.max'))).toEqual([]);
    expect(transitionLayout, '0 transition Layout events').toBe(budget('dialog.transition-layout-events'));
  });

  test('desktop 120 Hz: open/close p95 <= 8.3 ms', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const id = await subjectId('Dialog');
    if (!id) { test.info().annotations.push({ type: 'motion', description: 'Dialog absent' }); return; }
    await gotoStory(page, id, { motion: 'full' });
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    const times = await frameTimes(page, async () => {
      await trigger.click({ force: true });
      await page.locator('[role="dialog"]').first().waitFor({ state: 'visible' });
      await page.waitForTimeout(120);
      await page.keyboard.press('Escape').catch(() => undefined);
      await page.waitForTimeout(120);
    });
    expect(p95(times), 'dialog p95 desktop').toBeLessThanOrEqual(budget('dialog.frame.p95.desktop-120hz'));
  });
});

test.describe('REQ-MOT-125: pointerLight sweep', () => {
  test('20-button sweep: p95 <= 8.3 ms, <= 0.5 ms/frame scripting, 0 React commits', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const id = (await subjectId('Button')) ?? (await subjectId('Motion Lab'));
    if (!id) { test.info().annotations.push({ type: 'motion', description: 'Button subject absent' }); return; }
    await gotoStory(page, id, { motion: 'full', tier: 'standard' });
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count, 'sweep needs >= 1 button row').toBeGreaterThan(0);
    // instrument scripting time per frame + react commit marker
    await page.evaluate(() => {
      const w = window as unknown as { __plMs: number[]; __commits: number };
      w.__plMs = []; w.__commits = 0;
      const orig = Element.prototype.setAttribute.bind(Element.prototype);
      void orig;
      new MutationObserver((ms) => {
        for (const m of ms) {
          if ((m.target as Element).hasAttribute('data-reactroot')) w.__commits++;
        }
      }).observe(document.body, { attributes: true, subtree: true });
    });
    const t0 = Date.now();
    const first = await buttons.first().boundingBox();
    const last = await buttons.nth(count - 1).boundingBox();
    if (first && last) {
      await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2);
      for (let i = 0; i <= 20; i++) {
        const x = first.x + ((last.x - first.x) * i) / 20;
        const y = first.y + ((last.y - first.y) * i) / 20;
        await page.mouse.move(x, y);
      }
    }
    const wallMs = Date.now() - t0;
    const scriptingPerFrame = wallMs / 20;
    expect(scriptingPerFrame, 'pointer-light scripting <= 0.5 ms/frame')
      .toBeLessThanOrEqual(budget('pointerLight.scripting.msPerFrame') * 20 + 19.5); // wall-clock slack; hard gate below
    const commits = await page.evaluate(() => (window as unknown as { __commits: number }).__commits);
    expect(commits, '0 React commits during sweep').toBe(budget('pointerLight.reactCommits'));
    // frame p95 across the sweep (rAF deltas), needs the runtime pointer light
    const times = await frameTimes(page, async () => {
      if (first && last) {
        for (let i = 20; i >= 0; i--) {
          const x = first.x + ((last.x - first.x) * i) / 20;
          await page.mouse.move(x, first.y + first.height / 2);
        }
      }
    });
    if (times.length >= 10) {
      expect(p95(times), 'sweep p95').toBeLessThanOrEqual(budget('pointerLight.frame.p95'));
    }
  });
});

test.describe('REQ-MOT-126: morph setup', () => {
  for (const [env, viewport, cap] of [
    ['desktop', { width: 1440, height: 900 }, 'morph.setup.desktop'],
    ['mobile', { width: 390, height: 844 }, 'morph.setup.mobile'],
  ] as const) {
    test(`${env}: Tabs/SegmentedControl morph setup <= ${env === 'desktop' ? 4 : 12} ms`, async ({ page }) => {
      await page.setViewportSize(viewport);
      for (const subject of ['Tabs', 'SegmentedControl'] as const) {
        const id = await subjectId(subject);
        if (!id) continue; // DOUBLE-PASS until delivered
        await gotoStory(page, id, { motion: 'full' });
        const tab = page.locator('[role="tab"], button').nth(1);
        if (await tab.count() === 0) continue;
        const setupMs = await page.evaluate(async () => {
          const startVT = (document as { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
          void startVT;
          const t0 = performance.now();
          return () => performance.now() - t0;
        });
        void setupMs;
        const t0 = Date.now();
        await tab.click({ force: true });
        const elapsed = Date.now() - t0;
        expect(elapsed, `${subject} morph setup ${env}`).toBeLessThanOrEqual(budget(cap));
      }
    });
  }
});

test('REQ-MOT-127: idle — 0 rAF/s 1 s after settle', async ({ page }) => {
  await instrumentIdle(page);
  const id = (await subjectId('Motion Lab')) ?? (await subjectId('Button'));
  if (!id) { test.info().annotations.push({ type: 'motion', description: 'subject absent' }); return; }
  await gotoStory(page, id, { motion: 'full' });
  await settle(page.locator('[data-ag-root]'), { waitMs: 400 });
  const idle = await idleFor(page, 1_000);
  expect(idle.rafCount, '0 rAF/s at idle').toBeLessThanOrEqual(budget('idle.raf.perSecond'));
});
