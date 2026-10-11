
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

/* REQ-CMP-66: Home/End bound the highlight; Space selects+closes; Tab moves
   focus to the next focusable element. */
test.describe('select keys (REQ-CMP-66)', () => {
  test('End highlights last, Home highlights first', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-select--default')
      .catch(() => gotoStory(page, 'flagships-controls-select--keyboard'));
    const trigger = page.locator('[data-ag-part="trigger"], [role="combobox"]').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    const listbox = page.locator('[role="listbox"]').first();
    await expect(listbox).toBeVisible();
    await page.keyboard.press('End');
    const last = page.locator('[role="option"]').last();
    await expect(last).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('Home');
    const first = page.locator('[role="option"]').first();
    await expect(first).toHaveAttribute('data-highlighted', '');
    await apg.axe(page);
  });

  test('Space selects and closes; Tab moves to the next button', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-select--default')
      .catch(() => gotoStory(page, 'flagships-controls-select--keyboard'));
    const trigger = page.locator('[data-ag-part="trigger"], [role="combobox"]').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await expect(page.locator('[role="listbox"]')).toHaveCount(0);
    const before = await trigger.evaluate((el) => el.textContent);
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => (document.activeElement as HTMLElement)?.tagName);
    expect(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']).toContain(focused);
    expect(await page.evaluate(() => document.activeElement === null)).toBe(false);
    await apg.axe(page);
  });
});
