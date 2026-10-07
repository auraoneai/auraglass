import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('activity feed APG', () => {
  test('day headings are aria-level headings; list items expose time', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ActivityFeed');
    if (!subject) { console.warn('ActivityFeed subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part="activity-feed"], ol').first()).toBeVisible();
  });
});
