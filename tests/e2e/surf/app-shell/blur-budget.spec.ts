// blur-budget.spec.ts — SURF-070/103: concurrent blurred surfaces stay under the release budget. Remote lane (3 engines where required); absent
// subjects fail the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('blur budget (SURF-070/103)', () => {
  test('shell renders ≤ the blurred-surface budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) throw new Error('AppShell subject not registered');
    await gotoStory(page, subject.id);
    const blurred = await page.evaluate(() =>
      [...document.querySelectorAll('*')].filter((el) => {
        const s = getComputedStyle(el);
        return (s.backdropFilter && s.backdropFilter !== 'none') || (s.filter ?? '').includes('blur');
      }).length,
    );
    expect(blurred).toBeLessThanOrEqual(4);
  });
});
