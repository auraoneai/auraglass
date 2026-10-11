// date picker e2e (SURF L5 e2e lane, REQ-SURF-101): the popover opens from
// the trigger, an uncontrolled pick updates the field and closes, Escape
// closes and returns focus. Subject: DatePicker Default ("Due date", 2026-10-15).
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from './subjects';

test.describe('date picker e2e (REQ-SURF-101)', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('popover opens on trigger and closes on Escape returning focus', async ({ page }) => {
    await gotoStory(page, await requireStory('DatePicker', 'default'));
    const trigger = page.getByRole('button', { name: 'Choose date' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Due date' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('data-ag-presentation', 'popover');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('uncontrolled pick updates the field and closes the popover', async ({ page }) => {
    await gotoStory(page, await requireStory('DatePicker', 'default'));
    await page.getByRole('button', { name: 'Choose date' }).click();
    const dialog = page.getByRole('dialog', { name: 'Due date' });
    await dialog.getByRole('button', { name: /October 22, 2026/ }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator('[data-ag-part="date-input"] [role="spinbutton"][data-type="day"]')).toHaveAttribute('aria-valuenow', '22');
  });
});
