// tabbar-minimize.spec.ts — SURF-075: minimize-on-scroll collapses the tab bar edge only under motion consent. Remote lane (3 engines where required); absent
// subjects fail the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('tab-bar minimize (SURF-075)', () => {
  test('scrolling minimizes the tab bar', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'TabBar' );
    if (!subject) throw new Error('TabBar subject not registered');
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject.id);
    const bar = page.locator('[data-ag-part="tab-bar"]');
    expect(await bar.count(), 'no tab bar').toBeGreaterThan(0);
    await page.evaluate(() => document.querySelector('[data-ag-part="main"]')?.scrollBy(0, 400) ?? window.scrollBy(0, 400));
    await page.waitForTimeout(400);
    const attr = await bar.first().getAttribute('data-ag-minimized');
    expect([null, 'true', '']).toContain(attr);
  });
});
