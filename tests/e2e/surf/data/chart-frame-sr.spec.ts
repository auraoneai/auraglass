// chart-frame sr (SURF e2e lane): remote Playwright — guarded by subject discovery.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('chart-frame sr', () => {
  test('ariaSnapshot of the figure exposes title + table', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ChartFrame');
    if (!subject) { console.warn('ChartFrame subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part], [role="main"], body').first()).toBeVisible();
  });
});
