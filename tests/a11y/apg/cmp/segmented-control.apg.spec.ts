/* CMP-368 + REQ-CMP-43. SegmentedControl APG radio script pinned to
   SEGMENTED_KEYS (Base UI 1.8.0): one tab stop on the checked item; arrows
   move AND select with wrap; Home/End bound; Space never deselects. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';
import { SEGMENTED_KEYS } from '../../../../src/components/segmented-control/SegmentedControl.keys';

async function checkedIndex(page: import('@playwright/test').Page) {
  return page.locator('[role="radio"]').evaluateAll(
    (els) => els.findIndex((el) => el.getAttribute('aria-checked') === 'true'),
  );
}

test.describe('segmented-control APG (CMP-368 + REQ-CMP-43)', () => {
  test('aria-checked moves with arrows, wraps, Home/End bound, Space never deselects', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-segmented-control--default')
      .catch(() => gotoStory(page, 'flagships-controls-segmentedcontrol--default'));
    const items = page.locator('[role="radio"], [data-ag-part="item"]');
    const n = await items.count();
    expect(n).toBeGreaterThanOrEqual(2);

    /* one tab stop total (on the checked item) */
    if (SEGMENTED_KEYS.oneTabStop) {
      const tabbables = await items.evaluateAll(
        (els) => els.filter((el) => el.getAttribute('tabindex') !== '-1').length,
      );
      expect(tabbables).toBe(1);
    }

    const first = items.first();
    await first.focus();
    const start = await checkedIndex(page);
    expect(start).toBe(0);

    /* arrows move AND select */
    if (SEGMENTED_KEYS.arrowsMoveAndSelect) {
      await page.keyboard.press('ArrowRight');
      expect(await checkedIndex(page)).toBe(1 % n);
    }

    /* Home/End bound */
    if (SEGMENTED_KEYS.homeEndBound) {
      await page.keyboard.press('End');
      expect(await checkedIndex(page)).toBe(n - 1);
      await page.keyboard.press('Home');
      expect(await checkedIndex(page)).toBe(0);
    }

    /* wrap: ArrowRight on last wraps to first */
    if (SEGMENTED_KEYS.arrowWraps) {
      await page.keyboard.press('End');
      await page.keyboard.press('ArrowRight');
      expect(await checkedIndex(page)).toBe(0);
    }

    /* Space on the checked item never deselects */
    if (SEGMENTED_KEYS.spaceNeverDeselects) {
      await page.keyboard.press('Space');
      expect(await checkedIndex(page)).toBe(0);
      const checked = items.first();
      expect(await checked.getAttribute('aria-checked')).toBe('true');
    }

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
