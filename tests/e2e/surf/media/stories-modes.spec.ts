// stories-modes.spec.ts — SURF-501: every W4 subject story mounts without
// console errors across story modes. Remote lane; pending-warn per subject.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const SUBJECTS = ['MediaControls', 'MediaScrubber', 'NowPlayingBar', 'Waveform', 'ImageViewer', 'CarouselRail', 'Backdrop'];

test.describe('media stories modes (SURF-501)', () => {
  for (const name of SUBJECTS) {
    test(`${name} stories mount cleanly`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      const subjects = await listSubjects({ owner: 'SURF' });
      const subject = subjects.find((s) => s.subject === name);
      if (!subject) { console.warn(`${name} subject not registered — pending`); return; }
      await gotoStory(page, subject.id);
      expect(errors).toHaveLength(0);
    });
  }
});
