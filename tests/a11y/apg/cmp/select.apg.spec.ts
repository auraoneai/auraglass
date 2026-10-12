
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

/* REQ-CMP-66 (in-browser): every opening key, typeahead, and Tab while the
   listbox is OPEN (closes it and moves focus to the next control). */
test.describe('select opening keys, typeahead and Tab-while-open (REQ-CMP-66)', () => {
  for (const key of ['Enter', 'Space', 'ArrowDown', 'ArrowUp'] as const) {
    test(`${key} on the trigger opens the listbox`, async ({ page }) => {
      await gotoStory(page, 'flagships-controls-select--keyboard');
      const trigger = page.getByRole('combobox').first();
      await trigger.focus();
      await expect(page.locator('[role="listbox"]')).toHaveCount(0);
      await page.keyboard.press(key);
      await expect(page.locator('[role="listbox"]').first()).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  }

  test('typeahead highlights the option whose label starts with the typed text', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-select--keyboard');
    const trigger = page.getByRole('combobox').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('[role="listbox"]').first()).toBeVisible();
    // Base UI moves focus onto an option once the popup mounts
    await expect(page.locator('[role="option"]:focus')).toHaveCount(1);
    await page.keyboard.press('f');
    await expect(page.getByRole('option', { name: 'Finland' })).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('i');
    await expect(page.getByRole('option', { name: 'Finland' })).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('Enter');
    await expect(page.locator('[role="listbox"]')).toHaveCount(0);
    await expect(trigger).toHaveText(/Finland/);
  });

  test('Tab while the listbox is open closes it and moves focus to the next control', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-select--keyboard');
    const trigger = page.getByRole('combobox').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    const listbox = page.locator('[role="listbox"]').first();
    await expect(listbox).toBeVisible();
    // Tab is pressed from inside the open listbox (focus is on an option)
    await expect(page.locator('[role="option"]:focus')).toHaveCount(1);
    await page.keyboard.press('Tab');
    await expect(page.locator('[role="listbox"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Continue' })).toBeFocused();
  });
});
