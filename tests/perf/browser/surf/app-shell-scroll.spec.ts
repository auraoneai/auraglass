// app-shell-scroll.spec.ts — SURF-106: main scroll does not jank chrome. Remote perf lane; a missing subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('app-shell-scroll.spec.ts (SURF)', () => {
  test('scroll keeps chrome responsive', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) throw new Error('AppShell subject not registered');
    await gotoStory(page, subject.id);
    const t0 = Date.now();
    await page.evaluate(() => document.querySelector('[data-ag-part="main"]')?.scrollBy(0, 800) ?? window.scrollBy(0, 800));
    const bar = await page.locator('[data-ag-part="top-bar"]').first().boundingBox();
    expect(Date.now() - t0).toBeLessThan(1000);
    expect(bar).toBeTruthy();
  });
});
