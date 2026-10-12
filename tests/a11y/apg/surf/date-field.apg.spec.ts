// APG spinbutton pattern for the DateField segments (SURF L5 apg lane,
// REQ-SURF-100..104): one labelled group of month / day / year spinbuttons,
// Tab enters the first segment and moves between segments, ArrowUp/ArrowDown
// change the focused segment's value, ArrowRight/ArrowLeft move focus.
// Subject: src/date/DateField.stories.tsx Keyboard ("Publish on", en-US,
// 2026-10-07).
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from '../../../e2e/surf/date/subjects';

const KEYBOARD_STORY = 'surf-date-field--keyboard';
const segment = (page: Page, type: 'month' | 'day' | 'year') =>
  page.locator(`[data-ag-part="date-input"] [role="spinbutton"][data-type="${type}"]`);

test.describe('date field APG (spinbutton segments)', () => {
  test.beforeEach(async ({ page }) => {
    expect(await requireStory('DateField', 'keyboard')).toBe(KEYBOARD_STORY);
    await gotoStory(page, KEYBOARD_STORY);
  });

  test('one labelled group of month / day / year spinbuttons', async ({ page }) => {
    await expect(page.getByRole('group', { name: /Publish on/ })).toBeVisible();
    await expect(page.locator('[data-ag-part="date-input"] [role="spinbutton"]')).toHaveCount(3);
    await expect(segment(page, 'month')).toHaveAttribute('aria-valuenow', '10');
    await expect(segment(page, 'day')).toHaveAttribute('aria-valuenow', '7');
    await expect(segment(page, 'year')).toHaveAttribute('aria-valuenow', '2026');
  });

  test('Tab and arrows move between segments; ArrowUp/ArrowDown change the value', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(segment(page, 'month')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(segment(page, 'month')).toHaveAttribute('aria-valuenow', '11');
    await page.keyboard.press('ArrowDown');
    await expect(segment(page, 'month')).toHaveAttribute('aria-valuenow', '10');
    await page.keyboard.press('ArrowRight');
    await expect(segment(page, 'day')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(segment(page, 'day')).toHaveAttribute('aria-valuenow', '8');
    await page.keyboard.press('ArrowLeft');
    await expect(segment(page, 'month')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(segment(page, 'day')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(segment(page, 'year')).toBeFocused();
  });
});
