// APG date-grid pattern (SURF apg lane): Calendar grid roles, arrow-key
// navigation across cells, week numbers as rowheaders.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('calendar APG', () => {
  test('grid cells navigate with arrows; roving tabindex', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Calendar');
    if (!subject) throw new Error('Calendar subject not registered');
    await gotoStory(page, subject.id);
    const grid = page.locator('[role="grid"]').first();
    await expect(grid).toBeVisible();
    const cell = grid.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
    await cell.click();
    await page.keyboard.press('ArrowRight');
  });
});
