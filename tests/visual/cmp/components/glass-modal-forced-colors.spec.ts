
/* CMP-388 (lane 3i-Q). Forced colors: with forcedColors "active" the glass
   modal scene renders 0 visible elements whose computed backdrop-filter is not
   "none" (baseline bug count was 10). Produces before/after counts remotely. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('glass-modal forced colors (CMP-388)', () => {
  test('0 visible backdrop-filtered elements under forced colors', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'forced-colors case is Chromium-gated');
    await page.emulateMedia({ forcedColors: 'active' });
    // the 4.x "glass-modal" story id lives on the 4.x storybook; on `next` the
    // equivalent surface is overlays-dialog. Try both.
    await gotoStory(page, 'glass-modal--default').catch(
      () => gotoStory(page, 'overlays-dialog--default'),
    );
    const count = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('*')].filter((el) => {
        const bf = getComputedStyle(el).backdropFilter;
        return bf !== 'none' && bf !== '' && el.offsetParent !== null;
      }).length,
    );
    expect(count).toBe(0);
  });
});
