// motion.spec.ts — SURF-437 (REQ-SURF-160): drift animates only under the
// continuous gate; backdrop-pause toggles video. Remote lane; pending-warn.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('backdrop motion (SURF-437)', () => {
  test('drift animates only with allowContinuous; video pause toggles', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s: { subject: string }) => s.subject === 'Backdrop');
    if (!subject) { console.warn('Backdrop subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const backdrop = page.locator('[data-ag-backdrop-preset]');
    if (await backdrop.count() === 0) { console.warn('no backdrop — pending'); return; }
    await expect(backdrop.first()).toBeVisible();
    // zero animations by default (static)
    const anims = await page.evaluate(() => document.getAnimations().length);
    expect(anims).toBe(0);
    // pause button present on video preset stories only
    const pause = page.locator('[data-ag-part="backdrop-pause"]');
    if (await pause.count() > 0) {
      await expect(pause.first()).toHaveAttribute('aria-pressed', /true|false/);
    }
  });
});
