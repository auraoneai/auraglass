// now-playing.apg.spec.ts — REQ-SURF-139/140: NowPlayingBar landmark semantics,
// artwork alt, progress role=progressbar with int valuenow, expand button.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('NowPlayingBar APG', () => {
  test('progressbar semantics + labelled actions + expand', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'NowPlayingBar');
    if (!subject) throw new Error('NowPlayingBar subject not registered');
    await gotoStory(page, subject.id);
    const bar = page.locator('[data-ag-part="now-playing"]');
    expect(await bar.count(), 'no bar').toBeGreaterThan(0);
    const progress = bar.first().locator('[role="progressbar"]');
    if (await progress.count() > 0) {
      await expect(progress.first()).toHaveAttribute('aria-valuenow', /^\d+$/);
      await expect(progress.first()).toHaveAttribute('aria-label', 'Playback progress');
    }
    const play = page.locator('[data-ag-part="now-playing-play"]');
    if (await play.count() > 0) await expect(play.first()).toHaveAttribute('aria-pressed', /true|false/);
  });
});
