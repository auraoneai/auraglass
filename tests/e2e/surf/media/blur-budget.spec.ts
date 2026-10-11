// tests/e2e/surf/media/blur-budget.spec.ts — REQ-SURF-191 (REQ-FIN-90,
// AC-FIN-90, AC-FIN-86 "media chrome and blur-budget specs"). Remote only:
// L5 media e2e (fragments/lanes/surf.ts W4 `tests/e2e/surf/{media,backdrops}/**`)
// and L10 (W4 row for this file); chromium, webkit and firefox.
//
// Counts come from QUAL `perf.blurredSurfaces` (S-40):
//   - MediaControls: exactly 1 blurred surface;
//   - NowPlayingBar: exactly 1 blurred surface;
//   - ImageViewer open: ≤2 (popup chrome + scrim);
//   - CarouselRail: ≤3 under a fine pointer, ≤1 under a coarse pointer
//     (hasTouch + isMobile 390×844 context; the page must report
//     `(pointer: coarse)`).
// Every measurement also asserts nesting depth 1 and the 32 px chrome /
// 12 px scrim radius ceilings. The budgets are the spec numbers and live
// only here. A subject missing from the index fails.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import {
  coarseContext,
  expectDepthOne,
  expectPointer,
  expectRadii,
  isMaterialStory,
  measureBlur,
  surfStoriesOf,
  type BlurReport,
} from '../_support/blur-budget';

const MEDIA_CONTROLS_EXACT = 1;
const NOW_PLAYING_EXACT = 1;
const IMAGE_VIEWER_OPEN_MAX = 2;
const CAROUSEL_MAX_FINE = 3;
const CAROUSEL_MAX_COARSE = 1;

const POPUP = '[data-ag-part="image-viewer-popup"]';
const TRIGGER = '[data-ag-part="image-viewer-trigger"]';

const listed = (r: BlurReport) => r.surfaces.map((s) => s.label).join(', ');

async function measureChecked(page: Page, where: string): Promise<BlurReport> {
  const report = await measureBlur(page);
  expectDepthOne(report, where);
  expectRadii(report, where);
  return report;
}

test.describe('media blur budget (REQ-SURF-191)', () => {
  test(`MediaControls: exactly ${MEDIA_CONTROLS_EXACT} blurred surface`, async ({ page }) => {
    const stories = (await surfStoriesOf('MediaControls')).filter(isMaterialStory);
    expect(stories.map((s) => s.id), 'MediaControls: no material story').not.toEqual([]);
    for (const story of stories) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        await expect(page.locator('[data-ag-part="media-controls"]').first()).toBeVisible();
        const report = await measureChecked(page, story.id);
        expect(report.count, `${story.id}: ${listed(report)}`).toBe(MEDIA_CONTROLS_EXACT);
      });
    }
  });

  test(`NowPlayingBar: exactly ${NOW_PLAYING_EXACT} blurred surface`, async ({ page }) => {
    const stories = (await surfStoriesOf('NowPlayingBar')).filter(isMaterialStory);
    expect(stories.map((s) => s.id), 'NowPlayingBar: no material story').not.toEqual([]);
    for (const story of stories) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        const report = await measureChecked(page, story.id);
        expect(report.count, `${story.id}: ${listed(report)}`).toBe(NOW_PLAYING_EXACT);
      });
    }
  });

  test(`ImageViewer: ≤${IMAGE_VIEWER_OPEN_MAX} blurred surfaces while open`, async ({ page }) => {
    const stories = await surfStoriesOf('ImageViewer');
    let measuredOpen = 0;
    for (const story of stories) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        // Stories that render closed are opened through their trigger; a story
        // with neither an open popup nor a trigger cannot be measured and fails.
        if (await page.locator(POPUP).count() === 0) {
          const trigger = page.locator(TRIGGER).first();
          await expect(trigger, `${story.id}: closed ImageViewer story without ${TRIGGER}`).toBeVisible();
          await trigger.click();
        }
        await expect(page.locator(POPUP).first()).toBeVisible();
        const report = await measureChecked(page, `${story.id} (open)`);
        expect(report.count, `${story.id} (open): ${listed(report)}`).toBeLessThanOrEqual(IMAGE_VIEWER_OPEN_MAX);
        measuredOpen += 1;
      });
    }
    expect(measuredOpen).toBe(stories.length);
  });

  test(`CarouselRail: ≤${CAROUSEL_MAX_FINE} blurred surfaces at fine`, async ({ page }) => {
    for (const story of await surfStoriesOf('CarouselRail')) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        await expectPointer(page, 'fine');
        const report = await measureChecked(page, `${story.id} (fine)`);
        expect(report.count, `${story.id} (fine): ${listed(report)}`).toBeLessThanOrEqual(CAROUSEL_MAX_FINE);
      });
    }
  });

  test(`CarouselRail: ≤${CAROUSEL_MAX_COARSE} blurred surface at coarse`, async ({ browser, browserName, baseURL }) => {
    const stories = await surfStoriesOf('CarouselRail');
    const context = await coarseContext(browser, browserName, baseURL);
    try {
      const page = await context.newPage();
      for (const story of stories) {
        await test.step(story.id, async () => {
          await gotoStory(page, story.id);
          await expectPointer(page, 'coarse');
          const report = await measureChecked(page, `${story.id} (coarse)`);
          expect(report.count, `${story.id} (coarse): ${listed(report)}`).toBeLessThanOrEqual(CAROUSEL_MAX_COARSE);
        });
      }
    } finally {
      await context.close();
    }
  });
});
