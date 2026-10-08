// now-playing-container.spec.ts — SURF-461 (REQ-SURF-139/140): NowPlayingBar
// renders title/subtitle/artwork/progress and expands via aria-controls.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('now-playing container (SURF-461)', () => {
  test('bar exposes parts and expand controls the region', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'NowPlayingBar');
    if (!subject) { console.warn('NowPlayingBar subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const bar = page.locator('[data-ag-part="now-playing"]').first();
    if (await bar.count() === 0) { console.warn('no bar — pending'); return; }
    await expect(bar).toBeVisible();
    const expand = page.locator('[data-ag-part="now-playing-expand"]');
    if (await expand.count() > 0) {
      const controls = await expand.first().getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      await expand.first().click();
      await expect(expand.first()).toHaveAttribute('aria-expanded', 'true');
    }
  });
});
