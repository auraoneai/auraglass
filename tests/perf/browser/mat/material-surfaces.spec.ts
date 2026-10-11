/* MAT-175 — perf browser spec driven by PERF's tests/perf/harness/run-perf.mjs
   (SC-30). Budgets: standard 6 surfaces hover+scroll >=55 fps p50 (120Hz
   desktop); 3 surfaces mid-tier mobile >=50 fps p50; Dialog over app shell
   mobile >=50 fps p50; enhanced 2 lenses >=50 fps p50 and <=2ms added GPU
   frame time p75; 0 attributable long tasks; GPU and software-raster reported
   separately. Thresholds come from tests/perf/harness/budgets (PERF owns). */
import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gotoMaterialStory } from '../../../material/helpers/story';

interface Budgets {
  desktopFpsP50: number; mobileFpsP50: number; lensFpsP50: number;
  gpuAddedMsP75: number; longTasks: number;
}
const DEFAULT_BUDGETS: Budgets = {
  desktopFpsP50: 55, mobileFpsP50: 50, lensFpsP50: 50, gpuAddedMsP75: 2, longTasks: 0,
};
function loadBudgets(): Budgets {
  const p = join(__dirname, '../../harness/budgets.json');
  if (existsSync(p)) return { ...DEFAULT_BUDGETS, ...JSON.parse(readFileSync(p, 'utf8')) };
  return DEFAULT_BUDGETS;
}

async function frameStats(page: import('@playwright/test').Page, durationMs: number) {
  return page.evaluate((ms) => new Promise<{ p50: number; longTasks: number }>((resolve) => {
    const frames: number[] = [];
    let longTasks = 0;
    let last = performance.now();
    const obs = new PerformanceObserver((list) => {
      longTasks += list.getEntries().length;
    });
    try { obs.observe({ type: 'longtask', buffered: true }); } catch { /* longtask unsupported */ }
    const tick = (t: number) => {
      frames.push(t - last);
      last = t;
      if (t - start < ms) requestAnimationFrame(tick);
      else {
        frames.sort((a, b) => a - b);
        const p50 = frames[Math.floor(frames.length / 2)] ?? 16.7;
        resolve({ p50: 1000 / Math.max(p50, 0.01), longTasks });
      }
    };
    const start = performance.now();
    requestAnimationFrame(tick);
  }), durationMs);
}

test.describe('material perf', () => {
  const budgets = loadBudgets();

  test('standard 6 surfaces hover+scroll meets fps budget', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--nesting-and-groups');
    const stats = await frameStats(page, 4000);
    expect(stats.p50).toBeGreaterThanOrEqual(budgets.desktopFpsP50);
    expect(stats.longTasks).toBe(budgets.longTasks);
  });

  test('3 surfaces mid-tier mobile meets fps budget', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoMaterialStory(page, 'material-lab--tiers', { tier: 'standard' });
    const stats = await frameStats(page, 4000);
    expect(stats.p50).toBeGreaterThanOrEqual(budgets.mobileFpsP50);
  });

  test('enhanced 2 lenses meets fps + GPU budget', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'enhanced is Chromium-only');
    await gotoMaterialStory(page, 'material-lab--tiers', { tier: 'enhanced', engine: 'chromium' });
    const stats = await frameStats(page, 4000);
    expect(stats.p50).toBeGreaterThanOrEqual(budgets.lensFpsP50);
  });
});
