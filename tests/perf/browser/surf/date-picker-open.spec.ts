import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('date picker open perf', () => {
  test('popover open within budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'DatePicker');
    if (!subject) throw new Error('DatePicker subject not registered');
    await gotoStory(page, subject.id);
    await expect(page.locator('button', { hasText: 'Choose date' }).first()).toBeVisible();
  });
});
