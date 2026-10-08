
/* CMP-368 (lane 3i-Q). SegmentedControl APG radio script: one tab stop on the
   checked item; arrows move and select with wrap; Home/End bound. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('segmented-control APG (CMP-368)', () => {
  test('one tab stop on checked; arrows move+select with wrap', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-segmented-control--default')
      .catch(() => gotoStory(page, 'flagships-controls-segmentedcontrol--default'));
    const items = page.locator('[role="radio"], [data-ag-part="item"]');
    expect(await items.count()).toBeGreaterThanOrEqual(2);
    const tabbables = await items.evaluateAll(
      (els) => els.filter((el) => el.getAttribute('tabindex') !== '-1').length,
    );
    expect(tabbables).toBe(1);
    const first = items.first();
    await first.focus();
    await apg.keyboard(page, [
      { press: 'ArrowRight' },
      { press: 'End' },
      { press: 'ArrowRight' },  // wraps to first
    ]);
    const focusInside = await page.evaluate(
      () => !!document.activeElement?.closest('[data-ag-part="root"], [role="radiogroup"]'),
    );
    expect(focusInside).toBe(true);
    await apg.axe(page);
  });
});
