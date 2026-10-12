
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

/* REQ-CMP-70: Escape closes, a second Escape clears; Alt+ArrowDown opens
   without moving; Home/End move the caret. */
test.describe('combobox APG keys (REQ-CMP-70)', () => {
  test('Escape closes the list; a second Escape clears the input', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-combobox--keyboard');
    const input = page.getByRole('combobox').first();
    await input.focus();
    await input.pressSequentially('Gr');
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(input).toHaveValue('Gr');
    await page.keyboard.press('Escape');
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
  });

  test('Alt+ArrowDown opens without moving the highlight; Enter then selects nothing', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-combobox--keyboard');
    const input = page.getByRole('combobox').first();
    await input.focus();
    await page.keyboard.press('Alt+ArrowDown');
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(await input.getAttribute('aria-activedescendant')).toBeNull();
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('');
    /* the first ArrowDown afterwards reveals the first option */
    await page.keyboard.press('ArrowDown');
    const ad = await input.getAttribute('aria-activedescendant');
    expect(ad).toBeTruthy();
    await expect(page.locator(`[id="${ad}"]`)).toHaveText('Ada Lovelace');
  });

  test('Home/End move the caret while the list is open', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-combobox--keyboard');
    const input = page.getByRole('combobox').first();
    await input.focus();
    await input.pressSequentially('Grace');
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Home');
    expect(await input.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd])).toEqual([0, 0]);
    await page.keyboard.press('End');
    expect(await input.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd])).toEqual([5, 5]);
    await expect(input).toHaveValue('Grace');
    await expect(page.getByRole('listbox')).toBeVisible();
  });

  test('multi: Backspace focuses the last chip, arrows rove, Backspace/Delete remove one', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-combobox--multi-keyboard');
    const input = page.getByRole('combobox', { name: 'Labels' });
    const chips = page.locator('[data-ag-part="chip"]');
    await expect(chips).toHaveCount(3);
    await input.focus();
    await page.keyboard.press('Backspace');
    await expect(chips.nth(2)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(chips.nth(1)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(chips.nth(2)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Delete'); /* removes 'tokens' */
    await expect(chips).toHaveCount(2);
    await expect(chips).toHaveText(['glass', 'a11y']);
    await page.keyboard.press('Backspace'); /* removes the focused chip */
    await expect(chips).toHaveCount(1);
    await apg.axe(page);
  });
});
