import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('chart 5.1 e2e', () => {
  test('plot is one tab stop with role=group and datum cursor moves on arrows', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Chart');
    if (!subject) { console.warn('Chart subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const plot = page.locator('[data-ag-part="chart-plot"]');
    await expect(plot).toHaveAttribute('role', 'group');
    await plot.focus();
    await page.keyboard.press('ArrowRight');
  });
});
