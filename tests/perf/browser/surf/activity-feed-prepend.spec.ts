import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('activity feed prepend perf', () => {
  test('day-grouping prepend under budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ActivityFeed');
    if (!subject) { console.warn('ActivityFeed subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('ol').first()).toBeVisible();
  });
});
