// APG datepicker-dialog pattern (SURF L5 apg lane, REQ-SURF-101): the CMP
// Button trigger is keyboard operable, the dialog is labelled by the field
// label, focus moves to the selected date on open, Escape closes through the
// LayerStack and restores focus to the trigger, the field is spinbuttons.
// Subject: src/date/DatePicker.stories.tsx Default ("Due date", 2026-10-15).
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from '../../../e2e/surf/date/subjects';

test.describe('date picker APG (REQ-SURF-101)', () => {
  test('dialog label, initial focus, Escape, focus restore', async ({ page }) => {
    await gotoStory(page, await requireStory('DatePicker', 'default'));
    const segments = page.locator('[data-ag-part="date-input"] [role="spinbutton"]');
    await expect(segments).toHaveCount(3);
    const trigger = page.getByRole('button', { name: 'Choose date' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Due date' });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(dialog.locator(':focus')).toHaveAttribute('aria-label', /October 15, 2026/);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('selecting with the keyboard commits, closes and restores focus', async ({ page }) => {
    await gotoStory(page, await requireStory('DatePicker', 'default'));
    const trigger = page.getByRole('button', { name: 'Choose date' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Due date' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(dialog).toBeHidden();
    await expect(page.locator('[data-ag-part="date-input"] [role="spinbutton"][data-type="day"]')).toHaveAttribute('aria-valuenow', '16');
    await expect(trigger).toBeFocused();
    const describedBy = await trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`[id="${describedBy}"]`)).toHaveText('October 16, 2026');
  });
});
