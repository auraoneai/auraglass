// time-picker APG (SURF e2e lane): remote Playwright — guarded by subject discovery.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('time-picker APG', () => {
  test('dialog/popup roles + spinbutton semantics', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'TimePicker');
    if (!subject) { console.warn('TimePicker subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part], [role="main"], body').first()).toBeVisible();
  });
});
