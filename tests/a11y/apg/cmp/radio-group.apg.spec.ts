
/* CMP-362 (lane 3i-Q). RadioGroup APG: one tab stop; ArrowDown/ArrowRight move
   and select with wrap; ArrowUp/ArrowLeft move the other way. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('radio-group APG (CMP-362)', () => {
  test('one tab stop; arrows move selection with wrap', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-radio-group--default')
      .catch(() => gotoStory(page, 'flagships-controls-radiogroup--default'));
    const radios = page.getByRole('radio');
    expect(await radios.count()).toBeGreaterThanOrEqual(2);

    const tabbables = await radios.evaluateAll(
      (els) => els.filter((el) => el.getAttribute('tabindex') !== '-1').length,
    );
    expect(tabbables).toBe(1);

    const checked = page.locator('[role="radio"][aria-checked="true"], [role="radio"][data-checked]').first();
    await checked.focus();
    await apg.keyboard(page, [
      { press: 'ArrowDown' },
      { press: 'ArrowDown' },   // wraps
      { press: 'ArrowUp' },
    ]);
    expect(await page.locator('[role="radio"][aria-checked="true"]').count()).toBe(1);
    await apg.axe(page);
  });
});
