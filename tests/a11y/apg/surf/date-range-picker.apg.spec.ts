// APG date range picker (SURF L5 apg lane, REQ-SURF-102): two labelled
// segment groups, a labelled dialog with one grid per visible month, presets
// through the draft, Apply commits, Escape discards and restores focus.
// Subject: src/date/DateRangePicker.stories.tsx Default ("Report window",
// 2026-10-01 – 2026-10-07, presets "Launch week" / "First half of October").
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from '../../../e2e/surf/date/subjects';

const day = (page: Page, which: 'start' | 'end') =>
  page.locator(`[data-ag-part="date-input-${which}"] [role="spinbutton"][data-type="day"]`);

test.describe('date range picker APG (REQ-SURF-102)', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('two labelled segment groups; presets go through the draft and Apply commits', async ({ page }) => {
    await gotoStory(page, await requireStory('DateRangePicker', 'default'));
    await expect(page.getByRole('group', { name: /Start date/ })).toBeVisible();
    await expect(page.getByRole('group', { name: /End date/ })).toBeVisible();
    const trigger = page.getByRole('button', { name: 'Choose dates' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Report window' });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('[role="grid"]')).toHaveCount(2);
    await dialog.getByRole('option', { name: 'Launch week' }).click();
    await expect(day(page, 'start')).toHaveAttribute('aria-valuenow', '1'); // draft only
    await dialog.getByRole('button', { name: 'Apply' }).click();
    await expect(dialog).toBeHidden();
    await expect(day(page, 'start')).toHaveAttribute('aria-valuenow', '2');
    await expect(day(page, 'end')).toHaveAttribute('aria-valuenow', '8');
    await expect(trigger).toBeFocused();
  });

  test('Escape discards the draft and returns focus to the trigger', async ({ page }) => {
    await gotoStory(page, await requireStory('DateRangePicker', 'default'));
    const trigger = page.getByRole('button', { name: 'Choose dates' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Report window' });
    await dialog.getByRole('option', { name: 'Launch week' }).click();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(day(page, 'start')).toHaveAttribute('aria-valuenow', '1');
    await expect(day(page, 'end')).toHaveAttribute('aria-valuenow', '7');
  });
});
