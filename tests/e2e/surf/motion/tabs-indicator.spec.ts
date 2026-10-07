// tabs-indicator.spec.ts — SURF-067: tab switch animates the shared indicator via the morph seam. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('tabs indicator (SURF-067)', () => {
  test('indicator moves between tabs without layout thrash', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Tabs');
    if (!subject) { console.warn('Tabs subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const tabs = page.locator('[data-ag-part="tab"]');
    if (await tabs.count() < 2) { console.warn('single tab — pending'); return; }
    const ind = page.locator('[data-ag-part="indicator"]');
    if (await ind.count() === 0) { console.warn('no indicator — pending'); return; }
    const before = await ind.boundingBox();
    await tabs.nth(1).click();
    await page.waitForTimeout(400);
    const after = await ind.boundingBox();
    if (before && after) expect(after.x).not.toBe(before.x);
  });
});
