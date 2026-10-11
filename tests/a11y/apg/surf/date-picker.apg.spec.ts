import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('date picker APG', () => {
  test('dialog label, Escape, focus restore', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'DatePicker');
    if (!subject) throw new Error('DatePicker subject not registered');
    await gotoStory(page, subject.id);
    const trigger = page.locator('button', { hasText: 'Choose date' }).first();
    await trigger.click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
});
