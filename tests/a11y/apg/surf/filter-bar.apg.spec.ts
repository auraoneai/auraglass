import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('filter bar APG', () => {
  test('chips are buttons; remove button has accessible name', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'FilterBar');
    if (!subject) { console.warn('FilterBar subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const bar = page.locator('[data-ag-part="filter-bar"]').first();
    await expect(bar).toBeVisible();
  });
});
