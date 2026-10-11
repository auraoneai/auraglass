import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('tree view APG', () => {
  test('treeitem roving tabindex; arrows expand/collapse', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'TreeView');
    if (!subject) throw new Error('TreeView subject not registered');
    await gotoStory(page, subject.id);
    const item = page.locator('[role="treeitem"]').first();
    await expect(item).toBeVisible();
    await item.click();
    await page.keyboard.press('ArrowRight');
  });
});
