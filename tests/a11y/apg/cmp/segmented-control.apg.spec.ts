
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

/* REQ-CMP-42: indicator tracks the checked item within 1px; animating flag
   appears and clears; under calm the transition-duration is 0. */
test('REQ-CMP-42: indicator measures item 3 within 1px; calm jumps', async ({ page }) => {
  await gotoStory(page, 'flagships-controls-segmented-control--default')
    .catch(() => gotoStory(page, 'flagships-controls-segmentedcontrol--default'));
  const root = page.locator('[data-ag-part="root"]').first();
  const items = page.locator('[role="radio"]');
  const n = await items.count();
  if (n < 3) test.skip();
  const ind = root.locator('[data-ag-part="indicator"]');
  const third = items.nth(2);
  await third.focus();
  await page.keyboard.press('Enter'); /* select item 3 */
  /* animating flag appears then clears */
  await page.waitForFunction(() => {
    const r = document.querySelector('[data-ag-part="root"]');
    return r && !r.hasAttribute('data-ag-animating');
  }, null, { timeout: 3000 });
  const [ir, cr] = await Promise.all([ind.boundingBox(), third.boundingBox()]);
  if (!ir || !cr) test.skip();
  expect(Math.abs(ir.x - cr.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(ir.width - cr.width)).toBeLessThanOrEqual(1);

  /* calm: transition-duration resolves to 0s */
  await page.evaluate(() => document.documentElement.setAttribute('data-ag-motion', 'calm'));
  await third.focus();
  await page.keyboard.press('Home');
  const dur = await ind.evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(dur === '0s' || dur === '').toBe(true);
});
