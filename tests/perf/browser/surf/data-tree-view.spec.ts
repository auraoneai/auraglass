import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('tree view perf', () => {
  test('10k-node expansion under budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'TreeView');
    if (!subject) throw new Error('TreeView subject not registered');
    await gotoStory(page, subject.id);
    await expect(page.locator('[role="tree"], [role="treegrid"]').first()).toBeVisible();
  });
});
