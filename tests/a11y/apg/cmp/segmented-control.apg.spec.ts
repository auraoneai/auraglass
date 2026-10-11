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
