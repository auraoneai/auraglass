// APG spinbutton pattern for the TimeField segments (SURF L5 apg lane,
// REQ-SURF-104): one labelled group of hour / minute spinbuttons, Tab enters
// the first segment, ArrowUp/ArrowDown change the focused segment's value,
// ArrowRight/ArrowLeft move focus.
// Subject: src/date/TimeField.stories.tsx Keyboard ("Reminder", en-GB, 24h, 09:30).
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from '../../../e2e/surf/date/subjects';

const KEYBOARD_STORY = 'surf-time-field--keyboard';
const segment = (page: Page, type: 'hour' | 'minute') =>
  page.locator(`[data-ag-part="time-input"] [role="spinbutton"][data-type="${type}"]`);

test.describe('time field APG (spinbutton segments)', () => {
  test('labelled hour / minute spinbuttons; arrows change and move', async ({ page }) => {
    expect(await requireStory('TimeField', 'keyboard')).toBe(KEYBOARD_STORY);
    await gotoStory(page, KEYBOARD_STORY);
    await expect(page.getByRole('group', { name: /Reminder/ })).toBeVisible();
    await expect(segment(page, 'hour')).toHaveAttribute('aria-valuenow', '9');
    await expect(segment(page, 'minute')).toHaveAttribute('aria-valuenow', '30');
    await page.keyboard.press('Tab');
    await expect(segment(page, 'hour')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(segment(page, 'hour')).toHaveAttribute('aria-valuenow', '10');
    await page.keyboard.press('ArrowRight');
    await expect(segment(page, 'minute')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(segment(page, 'minute')).toHaveAttribute('aria-valuenow', '29');
    await page.keyboard.press('ArrowLeft');
    await expect(segment(page, 'hour')).toBeFocused();
  });
});
