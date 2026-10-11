/* REQ-CMP-38. ToggleGroup APG: arrows move roving focus (loop wraps ends),
   Enter/Space toggles aria-pressed, Home/End jump to edges. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('toggle-group APG (REQ-CMP-38)', () => {
  test('arrow keys rove focus with loop wrap-around', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-togglegroup--default')
      .catch(() => gotoStory(page, 'flagships-controls-togglegroup--overview'));
    const items = page.locator('[data-ag-part="item"]');
    test.skip((await items.count()) < 2, 'toggle-group story missing');
    const n = await items.count();
    await items.first().focus();
    await page.keyboard.press('ArrowLeft');
    /* loop: first -> last */
    await expect(items.nth(n - 1)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(items.first()).toBeFocused();
    await page.keyboard.press('End');
    await expect(items.nth(n - 1)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(items.first()).toBeFocused();
  });

  test('Enter/Space flips aria-pressed on the focused item', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-togglegroup--default')
      .catch(() => gotoStory(page, 'flagships-controls-togglegroup--overview'));
    const first = page.locator('[data-ag-part="item"]').first();
    test.skip((await first.count()) === 0, 'toggle-group story missing');
    await first.focus();
    const before = await first.getAttribute('aria-pressed');
    await page.keyboard.press('Enter');
    await expect(first).not.toHaveAttribute('aria-pressed', before ?? '');
    await page.keyboard.press('Space');
    await expect(first).toHaveAttribute('aria-pressed', before ?? 'false');
    await apg.axe(page);
  });
});
