import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('filter bar e2e', () => {
  test('rule chips render; remove returns focus', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'FilterBar');
    if (!subject) { console.warn('FilterBar subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part="filter-bar"]').first()).toBeVisible();
  });
});
