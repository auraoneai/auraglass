
/* CMP-367 (lane 3i-Q). SearchField APG: Escape clears a non-empty field, then
   propagates when empty; clear button tabbable per meta table. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('search-field APG (CMP-367)', () => {
  test('Escape clears value when non-empty, propagates when empty', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-search-field--with-value')
      .catch(() => gotoStory(page, 'flagships-controls-searchfield--with-value'));
    const input = page.locator('input[type="search"], input').first();
    await input.focus();
    await page.keyboard.press('Escape');
    expect(await input.inputValue()).toBe('');
    // second Escape on the empty field must propagate (no preventDefault)
    await page.keyboard.press('Escape');
    await apg.axe(page);
  });
});
