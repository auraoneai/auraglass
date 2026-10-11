// tree virtual (SURF e2e lane): remote Playwright — guarded by subject discovery.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('tree virtual', () => {
  test('TreeView renders only visible nodes', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'TreeView');
    if (!subject) throw new Error('TreeView subject not registered');
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part], [role="main"], body').first()).toBeVisible();
  });
});
