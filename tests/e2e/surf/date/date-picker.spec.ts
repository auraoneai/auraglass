import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('date picker e2e', () => {
  test('popover opens on trigger and closes on Escape returning focus', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'DatePicker');
    if (!subject) throw new Error('DatePicker subject not registered');
    await gotoStory(page, subject.id);
    const trigger = page.locator('button', { hasText: 'Choose date' }).first();
    await trigger.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
});
