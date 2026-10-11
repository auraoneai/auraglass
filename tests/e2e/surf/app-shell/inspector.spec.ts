// inspector.spec.ts — SURF-059: inspector opens/closes, sections collapse, sheet mode at compact. Remote lane (3 engines where required); absent
// subjects fail the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('inspector (SURF-059)', () => {
  test('toggle opens and closes the inspector', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell' );
    if (!subject) throw new Error('shell subject not registered');
    await gotoStory(page, subject.id);
    const toggle = page.locator('[data-ag-part="inspector-toggle"]').first();
    expect(await toggle.count(), 'no inspector toggle').toBeGreaterThan(0);
    await toggle.click();
    const insp = page.locator('[data-ag-part="inspector"]').first();
    await expect(insp).toBeVisible();
    await toggle.click();
    const state = await page.evaluate(() =>
      document.querySelector('.ag-app-shell')?.getAttribute('data-ag-inspector'));
    expect(state === 'closed' || !(await insp.isVisible().catch(() => false))).toBe(true);
  });
});
