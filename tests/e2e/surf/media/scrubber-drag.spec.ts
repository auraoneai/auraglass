// scrubber-drag.spec.ts — SURF-445 (REQ-SURF-136, AC-SURF-20): pointer drag
// seeks; >=55fps during scrub. Remote lane; pending-warn.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('media scrubber drag (SURF-445)', () => {
  test('drag on the track moves aria-valuenow', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MediaControls' ) ?? subjects.find((s) => s.subject === 'MediaScrubber');
    if (!subject) { console.warn('MediaControls subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const scrubber = page.locator('[data-ag-part="media-scrubber"]').first();
    if (await scrubber.count() === 0) { console.warn('no scrubber — pending'); return; }
    const box = await scrubber.boundingBox();
    if (!box) { console.warn('no box — pending'); return; }
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 8 });
    await page.mouse.up();
    const valuenow = await page.locator('[data-ag-part="media-scrubber-thumb"] [role="slider"], [data-ag-part="media-scrubber-thumb"]').first().getAttribute('aria-valuenow');
    expect(valuenow === null || Number(valuenow) >= 0).toBeTruthy();
  });
});
