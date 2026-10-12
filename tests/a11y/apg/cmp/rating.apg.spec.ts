
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
    /* REQ-CMP-123: each key moves the value — focus follows the newly
       checked radio, so the focused item must be aria-checked and named by
       its ordinal (a no-op key fails the step). */
    const start = Number(await focused.getAttribute('data-value'));
    const after = Math.min(5, start + 1);
    await apg.keyboard(page, [
      { press: 'ArrowRight', expectFocus: `role=radio[name=${after} of 5]`, expectState: { 'aria-checked': 'true' } },
      { press: 'End', expectFocus: 'role=radio[name=5 of 5]', expectState: { 'aria-checked': 'true' } },
      { press: 'Home', expectFocus: 'role=radio[name=1 of 5]', expectState: { 'aria-checked': 'true' } },
    ]);
    // exactly one radio is checked after the moves, and it is the first
    await expect(radios.and(page.locator('[aria-checked="true"]'))).toHaveCount(1);
    await expect(radios.first()).toHaveAttribute('aria-checked', 'true');
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
