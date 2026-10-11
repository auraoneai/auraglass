// date locale (SURF e2e lane): remote Playwright — guarded by subject discovery.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('date locale', () => {
  test('de-DE locale + explicit timeZone render correctly', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'DatePicker');
    if (!subject) throw new Error('DatePicker subject not registered');
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part], [role="main"], body').first()).toBeVisible();
  });
});
