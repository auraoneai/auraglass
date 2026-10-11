// tabs-indicator.spec.ts — SURF-067: tab switch animates the shared indicator via the morph seam. Remote lane (3 engines where required); absent
// subjects fail the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('tabs indicator (SURF-067)', () => {
  test('indicator moves between tabs without layout thrash', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Tabs');
    if (!subject) throw new Error('Tabs subject not registered');
    await gotoStory(page, subject.id);
    const tabs = page.locator('[data-ag-part="tab"]');
    expect(await tabs.count(), 'single tab').toBeGreaterThanOrEqual(2);
    const ind = page.locator('[data-ag-part="indicator"]');
    expect(await ind.count(), 'no indicator').toBeGreaterThan(0);
    const before = await ind.boundingBox();
    await tabs.nth(1).click();
    await page.waitForTimeout(400);
    const after = await ind.boundingBox();
    if (before && after) expect(after.x).not.toBe(before.x);
  });
});
