// scrubber-drag.spec.ts — REQ-SURF-136 (AC-SURF-20): a 300 px drag over 30
// pointer steps seeks at most once per frame (≤30 onValueChange) and commits
// exactly once; the thumb is transient glass only while data-dragging.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('media scrubber drag (REQ-SURF-136)', () => {
  test('300 px over 30 steps → ≤30 seeks, 1 commit', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MediaScrubber' && s.id.endsWith('--drag-probe'));
    expect(subject, 'MediaScrubber DragProbe story registered in the subject index').toBeTruthy();
    await gotoStory(page, subject!.id);
    const probe = page.locator('[data-testid="probe"]');
    const control = probe.locator('[data-ag-part="media-scrubber"] [data-ag-part="control"]');
    const box = await control.boundingBox();
    expect(box, 'scrubber control has a layout box').not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(300);
    const y = box!.y + box!.height / 2;
    const x0 = box!.x + 10;
    await page.mouse.move(x0, y);
    await page.mouse.down();
    const thumb = probe.locator('[data-ag-part="thumb"]');
    await page.mouse.move(x0 + 150, y, { steps: 15 });
    // mid-drag: the thumb carries data-dragging and the transient material layer
    await expect(thumb).toHaveAttribute('data-dragging', '');
    await expect(thumb).toHaveAttribute('data-ag-layer', 'transient');
    await page.mouse.move(x0 + 300, y, { steps: 15 });
    await page.mouse.up();
    await expect(probe).toHaveAttribute('data-commits', '1');
    const seeks = Number(await probe.getAttribute('data-seeks'));
    expect(seeks).toBeGreaterThan(0);
    expect(seeks).toBeLessThanOrEqual(30);
    await expect(thumb).not.toHaveAttribute('data-ag-layer', 'transient');
    const input = thumb.locator('input[type="range"]');
    const valuenow = Number(await input.getAttribute('aria-valuenow'));
    expect(valuenow).toBeGreaterThan(200);
    await expect(input).toHaveAttribute('aria-valuetext', /^\d.* of 5 minutes$/);
  });
});
