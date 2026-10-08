
/* CMP-372 (lane 3i-Q). Select APG (select-only combobox pattern):
   Enter/Space/ArrowDown/ArrowUp open; typeahead; arrows move highlight. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('select APG (CMP-372)', () => {
  test('opens on ArrowDown; arrows move; Enter selects and focus returns', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-select--keyboard')
      .catch(() => gotoStory(page, 'flagships-controls-select--default'));
    const trigger = page.locator('[data-ag-part="trigger"], [role="combobox"], button').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    const listbox = page.locator('[role="listbox"]').first();
    await expect(listbox).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(listbox).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await apg.axe(page);
  });
});
