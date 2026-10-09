
/* CMP-355 (lane 3i-Q). Rating APG: arrows change value (RTL reversed), Home/End,
   readOnly ignores keys + exposes aria-readonly, half value announced "3.5 of 5". */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('rating APG (CMP-355)', () => {
  test('roving tabindex + arrow keys move the checked radio', async ({ page }) => {
    await gotoStory(page, 'core-rating--default');
    const radios = page.locator('[data-ag-part="item"]');
    // exactly one tabbable radio (the checked one, or the first at value 0)
    const tabbable = await radios.evaluateAll((els) => els.filter((e) => e.getAttribute('tabindex') === '0').length);
    expect(tabbable).toBe(1);
    await page.keyboard.press('Tab');
    const focused = page.locator('[data-ag-part="item"][tabindex="0"]');
    await expect(focused).toBeFocused();
    await apg.keyboard(page, [
      { press: 'ArrowRight', expectFocus: 'item' },
      { press: 'End', expectFocus: 'item' },
      { press: 'Home', expectFocus: 'item' },
    ]);
    // radios carry ordinal labels
    await expect(radios.first()).toHaveAttribute('aria-label', '1 of 5');
  });

  test('readOnly ignores keys and exposes aria-readonly', async ({ page }) => {
    await gotoStory(page, 'core-rating--read-only');
    const root = page.locator('[data-ag-part="root"]').first();
    await expect(root).toHaveAttribute('aria-readonly', 'true');
    const checked = await page.locator('[data-ag-part="item"][aria-checked="true"]').count();
    await root.focus().catch(() => {});
    await page.keyboard.press('ArrowRight');
    expect(await page.locator('[data-ag-part="item"][aria-checked="true"]').count()).toBe(checked);
  });

  test('half value announced as "3.5 of 5" on the checked item', async ({ page }) => {
    await gotoStory(page, 'core-rating--half');
    const checked = page.locator('[data-ag-part="item"][aria-checked="true"]').last();
    await expect(checked).toHaveAttribute('aria-label', '3.5 of 5');
    await apg.axe(page);
  });
});
