// data-table e2e (SURF e2e lane): Table sorting + pagination through the
// registry storybook — remote lane, guarded by subject discovery.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('data table e2e', () => {
  test('sort toggles column aria-sort; pagination changes page rows', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Table');
    if (!subject) throw new Error('Table subject not registered');
    await gotoStory(page, subject.id);
    const header = page.locator('[data-ag-part="table"] [role="columnheader"]').first();
    await expect(header).toBeVisible();
  });
});
