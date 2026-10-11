/* REQ-CMP-112: responsive Grid columns resolve against Grid's own container
   shell at the 480/768/1024 px breakpoints (nearest breakpoint <= width
   wins), with no Container ancestor. Ledger acceptance: columns={{base:1,md:3}}
   in an 800 px container gives 3 tracks. Remote Playwright lane only. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const tracks = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

test.describe('grid responsive columns (REQ-CMP-112)', () => {
  test('track count follows the shell width', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoStory(page, 'core-grid--responsive-containers');
    const expected: Record<string, number> = {
      'frame-400': 1,
      'frame-600': 2,
      'frame-800': 3,
      'frame-1100': 4,
      'frame-md-only': 3,
    };
    for (const [testId, count] of Object.entries(expected)) {
      const grid = page.getByTestId(testId).locator('[data-ag-part="root"]');
      const cols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
      expect(tracks(cols), `${testId}: ${cols}`).toBe(count);
    }
  });

  test('the md-only grid falls back to base below 768 px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoStory(page, 'core-grid--responsive-containers');
    const frame = page.getByTestId('frame-md-only');
    await frame.evaluate((el) => {
      (el as HTMLElement).style.inlineSize = '700px';
    });
    const cols = await frame
      .locator('[data-ag-part="root"]')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(tracks(cols)).toBe(1);
  });
});
