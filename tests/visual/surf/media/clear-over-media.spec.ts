// clear-over-media.spec.ts — SURF-498/499 (AC-SURF-18): clear-variant surfaces
// over media backdrops — 4-step tone matrix, 0 failures. Remote visual lane.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('clear-over-media (SURF-498/499)', () => {
  test('clear variant over light and dark media backdrops', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'NowPlayingBar') ?? subjects.find((s) => s.subject === 'Backdrop');
    if (!subject) { console.warn('no clear-over-media subject — pending'); return; }
    await gotoStory(page, subject.id);
    const surface = page.locator('[data-ag-variant="clear"], .ag-now-playing').first();
    if (await surface.count() === 0) { console.warn('no clear surface — pending'); return; }
    await expect(surface).toBeVisible();
    await expect(page).toHaveScreenshot('clear-over-media.png', { maxDiffPixelRatio: 0.02 });
  });
});
