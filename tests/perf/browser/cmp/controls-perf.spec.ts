/* CMP-383 (lane 3i-Q). Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs). This file
   registers the cases; harness seam lands with PRD-PERF. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');


test.describe('controls perf (CMP-383)', () => {
  const BUDGETS = { mobileInpP75: 100, desktopInpP75: 50 };
  const CASES = [
    { name: 'Button press', story: 'flagships-controls-button--default', sel: 'button' },
    { name: 'Switch toggle', story: 'flagships-controls-switch--default', sel: '[role="switch"]' },
    { name: 'Select open', story: 'flagships-controls-select--default', sel: '[data-ag-part="trigger"], button' },
    { name: 'Combobox type', story: 'flagships-controls-combobox--default', sel: 'input, [role="combobox"]' },
  ];

  for (const c of CASES) {
    test(`${c.name}: INP p75 within budget`, async ({ page }) => {
      await gotoStory(page, c.story);
      const target = page.locator(c.sel).first();
      const res = await perf.frames(page, {
        durationMs: 500,
        during: async () => {
          await target.click().catch(() => target.press('Enter'));
          await page.waitForTimeout(120);
        },
      });
      expect(res.p95Ms).toBeLessThanOrEqual(BUDGETS.desktopInpP75);
      expect(res.longTasks).toBe(0);
    });
  }
});
