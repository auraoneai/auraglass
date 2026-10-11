// flagships.spec.ts — SURF-500: W4 flagship components screenshot baseline
// (MediaControls, NowPlayingBar, ImageViewer, CarouselRail, Backdrop).
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const SUBJECTS = ['MediaControls', 'NowPlayingBar', 'ImageViewer', 'CarouselRail', 'Backdrop'];

test.describe('media flagships (SURF-500)', () => {
  for (const name of SUBJECTS) {
    test(`${name} flagship state screenshot`, async ({ page }) => {
      const subjects = await listSubjects({ owner: 'SURF' });
      const subject = subjects.find((s) => s.subject === name);
      if (!subject) throw new Error(`${name} subject not registered`);
      await gotoStory(page, subject.id);
      await expect(page).toHaveScreenshot(`media-${name.toLowerCase()}.png`, { maxDiffPixelRatio: 0.02 });
    });
  }
});
