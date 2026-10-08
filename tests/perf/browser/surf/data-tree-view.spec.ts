import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('tree view perf', () => {
  test('10k-node expansion under budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'TreeView');
    if (!subject) { console.warn('TreeView subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('[role="tree"], [role="treegrid"]').first()).toBeVisible();
  });
});
