
/* CMP-356 (lane 3i-Q). InlineEdit APG: Enter on the button opens the textbox with
   focus; typing + Enter commits; Escape cancels and restores the old value; focus
   returns to the button in both cases; blur commits. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('inline-edit APG (CMP-356)', () => {
  test('Enter opens editor, Enter commits, focus returns to the button', async ({ page }) => {
    await gotoStory(page, 'core-inline-edit--default');
    const btn = page.locator('[data-ag-part="preview"], [data-ag-part="button"], button').first();
    await btn.focus();
    await page.keyboard.press('Enter');
    const input = page.locator('[data-ag-part="input"], input[type="text"], textarea').first();
    await expect(input).toBeFocused();
    await input.fill('Updated value');
    await page.keyboard.press('Enter');
    await expect(btn).toBeFocused();
    await expect(btn).toContainText('Updated value');
  });

  test('Escape cancels and restores the old value', async ({ page }) => {
    await gotoStory(page, 'core-inline-edit--default');
    const btn = page.locator('[data-ag-part="preview"], [data-ag-part="button"], button').first();
    const original = (await btn.textContent()) ?? '';
    await btn.focus();
    await page.keyboard.press('Enter');
    const input = page.locator('[data-ag-part="input"], input[type="text"], textarea').first();
    await input.fill('Discarded');
    await page.keyboard.press('Escape');
    await expect(btn).toBeFocused();
    await expect(btn).toContainText(original.trim());
    await apg.axe(page);
  });
});
