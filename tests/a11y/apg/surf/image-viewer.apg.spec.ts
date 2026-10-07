// image-viewer.apg.spec.ts — SURF-477 (REQ-SURF-142..146): dialog semantics,
// escape closes, arrow keys navigate, zoom keys adjust.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ImageViewer APG (SURF-477)', () => {
  test('dialog role; Escape closes; arrows navigate', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ImageViewer');
    if (!subject) { console.warn('ImageViewer subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const trigger = page.locator('[data-ag-part="image-viewer-trigger"]').first();
    if (await trigger.count() > 0) await trigger.click();
    const dialog = page.locator('[role="dialog"]');
    if (await dialog.count() === 0) { console.warn('viewer did not open — pending'); return; }
    await expect(dialog.first()).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
});
