
/* CMP-367 (lane 3i-Q). SearchField APG: Escape clears a non-empty field, then
   propagates when empty; clear button tabbable per meta table. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('search-field APG (CMP-367)', () => {
  test('Escape clears value when non-empty, propagates when empty', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-searchfield--keyboard');
    const input = page.locator('input[type="search"], input').first();
    await input.focus();
    await page.keyboard.press('Escape');
    expect(await input.inputValue()).toBe('');
    // second Escape on the empty field must propagate (no preventDefault)
    await page.keyboard.press('Escape');
    await apg.axe(page);
  });

  /* REQ-CMP-64: Enter inside a form submits (implicit submission). */
  test('Enter in the form submits the query', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-searchfield--keyboard');
    const input = page.getByRole('searchbox', { name: 'Search' });
    await input.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('submitted')).toHaveText('Submitted: glacier');
  });

  /* REQ-CMP-64: Tab reaches the clear button only while the field has a
     value; with an empty field Tab goes straight to the next control. */
  test('Tab reaches clear only with a value', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-searchfield--keyboard');
    const input = page.getByRole('searchbox', { name: 'Search' });
    await input.focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-ag-part="clear"]')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeFocused();

    // empty the field: the clear button unmounts and Tab skips to the next control
    await input.focus();
    await page.keyboard.press('Escape');
    expect(await input.inputValue()).toBe('');
    await expect(page.locator('[data-ag-part="clear"]')).toHaveCount(0);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeFocused();
  });
});
