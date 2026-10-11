// time-picker APG (SURF L5 apg lane, REQ-SURF-104): spinbutton segments, a
// labelled dialog with Hour / Minute listboxes whose selected options mirror
// the value, keyboard selection updating the segments, Escape focus return.
// Subject: src/date/TimePicker.stories.tsx Default ("Start time", 09:30, 24h,
// minuteStep 15).
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from '../../../e2e/surf/date/subjects';

test.describe('time-picker APG (REQ-SURF-104)', () => {
  test('dialog/listbox roles, selected options, keyboard pick, Escape', async ({ page }) => {
    await gotoStory(page, await requireStory('TimePicker', 'default'));
    const hourSeg = page.locator('[data-ag-part="time-input"] [role="spinbutton"][data-type="hour"]');
    await expect(hourSeg).toHaveAttribute('aria-valuenow', '9');
    await expect(page.locator('[data-ag-part="time-input"] [role="spinbutton"][data-type="minute"]')).toHaveAttribute('aria-valuenow', '30');
    const trigger = page.getByRole('button', { name: 'Choose time' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Start time' });
    await expect(dialog).toBeVisible();
    const hours = dialog.getByRole('listbox', { name: 'Hour' });
    const minutes = dialog.getByRole('listbox', { name: 'Minute' });
    await expect(hours.getByRole('option')).toHaveCount(24);
    await expect(minutes.getByRole('option')).toHaveCount(4);
    await expect(hours.getByRole('option', { selected: true })).toHaveText('09');
    await expect(minutes.getByRole('option', { selected: true })).toHaveText('30');
    // Focus starts on the selected hour; ArrowDown + Enter picks 10.
    await expect(hours.getByRole('option', { name: '09' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(hours.getByRole('option', { selected: true })).toHaveText('10');
    await expect(hourSeg).toHaveAttribute('aria-valuenow', '10');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('12-hour story has an AM/PM listbox', async ({ page }) => {
    await gotoStory(page, await requireStory('TimePicker', 'twelve-hour'));
    await page.getByRole('button', { name: 'Choose time' }).click();
    const dialog = page.getByRole('dialog', { name: 'Start time' });
    const period = dialog.getByRole('listbox', { name: 'AM/PM' });
    await expect(period.getByRole('option')).toHaveCount(2);
    await expect(period.getByRole('option', { selected: true })).toHaveText('AM');
    await period.getByRole('option', { name: 'PM' }).click();
    await expect(page.locator('[data-ag-part="time-input"] [role="spinbutton"][data-type="dayPeriod"]')).toHaveText('PM');
  });
});
