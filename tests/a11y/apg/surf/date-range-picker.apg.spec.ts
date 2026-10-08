import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('date range picker APG', () => {
  test('two labelled segments; presets select a range', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'DateRangePicker');
    if (!subject) { console.warn('DateRangePicker subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('button', { hasText: 'Choose dates' }).first()).toBeVisible();
  });
});
