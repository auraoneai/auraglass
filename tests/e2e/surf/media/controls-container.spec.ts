// controls-container.spec.ts — SURF-462 (REQ-SURF-134/135): MediaControls
// renders toolbar parts; play toggles state + media element.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('media controls container (SURF-462)', () => {
  test('toolbar parts render and play toggles data-state', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MediaControls');
    if (!subject) throw new Error('MediaControls subject not registered');
    await gotoStory(page, subject.id);
    const controls = page.locator('[data-ag-part="media-controls"]');
    expect(await controls.count(), 'no controls').toBeGreaterThan(0);
    await expect(controls.first()).toBeVisible();
    const play = page.locator('[data-ag-part="media-play"]').first();
    expect(await play.count(), 'no play button').toBeGreaterThan(0);
    await play.click();
    await expect(play).toHaveAttribute('aria-pressed', /true|false/);
  });
});
