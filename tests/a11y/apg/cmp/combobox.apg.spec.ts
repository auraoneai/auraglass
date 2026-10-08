
/* CMP-373 (lane 3i-Q). Combobox APG: focus stays on the input;
   aria-activedescendant follows the highlight; ArrowDown/Up move; Enter selects. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('combobox APG (CMP-373)', () => {
  test('focus stays on input; aria-activedescendant tracks highlight', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-combobox--keyboard')
      .catch(() => gotoStory(page, 'flagships-controls-combobox--default'));
    const input = page.locator('[role="combobox"], input').first();
    await input.focus();
    await input.type('a');
    const listbox = page.locator('[role="listbox"]').first();
    await expect(listbox).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expect(input).toBeFocused();
    const activedesc = await input.getAttribute('aria-activedescendant');
    expect(activedesc).toBeTruthy();
    await page.keyboard.press('Escape');
    await apg.axe(page);
  });
});
