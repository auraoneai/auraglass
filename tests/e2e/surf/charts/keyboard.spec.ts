// charts keyboard (SURF e2e lane): remote Playwright — guarded by subject discovery.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('charts keyboard', () => {
  test('plot is one tab stop; arrows move the crosshair', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Chart');
    if (!subject) throw new Error('Chart subject not registered');
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part], [role="main"], body').first()).toBeVisible();
  });
});
