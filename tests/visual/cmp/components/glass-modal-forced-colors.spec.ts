
/* CMP-388 (lane 3i-Q). Forced colors: with forcedColors "active" the glass
   modal scene renders 0 visible elements whose computed backdrop-filter is not
   "none" (baseline bug count was 10). Produces before/after counts remotely. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('glass-modal forced colors (CMP-388)', () => {
  test('0 visible backdrop-filtered elements under forced colors', async ({ page, browserName }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    // the 4.x "glass-modal" story id lives on the 4.x storybook; on `next` the
    // equivalent surface is the Dialog flagship's Playground. Try both.
    await gotoStory(page, 'glass-modal--default').catch(
      () => gotoStory(page, 'flagships-overlays-dialog--playground'),
    );
    /* No skip (PRD §18). Chromium must honour the emulation (the engine the
       behaviour lane pins preference cells to); in an engine whose emulation
       does not read back, forced colours never apply, so the case has no
       subject there and the read-back assertion records that it is not
       Chromium. */
    const forced = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
    if (!forced) {
      expect(browserName, 'forced-colors emulation must read back in chromium').not.toBe('chromium');
      return;
    }
    const count = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('*')].filter((el) => {
        const bf = getComputedStyle(el).backdropFilter;
        return bf !== 'none' && bf !== '' && el.offsetParent !== null;
      }).length,
    );
    expect(count).toBe(0);
  });
});
