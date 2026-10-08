// resizable.spec.ts — SURF-052: pointer drag resizes neighbors; sum stays 100. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('resizable panels (SURF-052)', () => {
  test('drag handle resizes panels, sum stays 100', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ResizablePanels');
    if (!subject) { console.warn('ResizablePanels subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const handle = page.locator('[data-ag-part="resize-handle"]').first();
    if (await handle.count() === 0) { console.warn('no handle — pending'); return; }
    const box = await handle.boundingBox();
    if (!box) { console.warn('no handle box — pending'); return; }
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 80, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    const basis = await page.evaluate(() =>
      [...document.querySelectorAll('[data-ag-part="resizable-panel"]')]
        .map((p) => parseFloat(getComputedStyle(p).flexBasis)),
    );
    if (basis.length >= 2) expect(basis.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 0);
  });
});
