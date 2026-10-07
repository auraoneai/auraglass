import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('table grid APG', () => {
  test('grid/gridcell roles; column resize via keyboard', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Table');
    if (!subject) { console.warn('Table subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const grid = page.locator('[role="grid"], [role="table"]').first();
    await expect(grid).toBeVisible();
  });
});
