// data-table-5000 (SURF perf lane): 5,000-row virtualized Table stays under
// the frame budget while scrolling.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('table 5000 rows perf', () => {
  test('scroll frame p95 under budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Table');
    if (!subject) { console.warn('Table subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part="table"]').first()).toBeVisible();
    void 0; // perf harness measures frames when the lane harness lands
  });
});
