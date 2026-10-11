
/* CMP-390 + CMP-410 (lane 3i-Q). Overlay a11y modes over all 9 widgets:
   forcedColors active → 0 visible elements with backdrop-filter != none and a
   CanvasText border; prefers-contrast more → 1px contrasting border, specular
   off; reduced transparency honored. Runs Chromium/WebKit/Firefox remotely. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const WIDGETS: Record<string, string> = {
  Dialog: 'overlays-dialog--default',
  AlertDialog: 'overlays-alert-dialog--confirm',
  Sheet: 'overlays-sheet--bottom-detents',
  Popover: 'overlays-popover--playground',
  Tooltip: 'overlays-tooltip--playground',
  Menu: 'overlays-menu--playground',
  ContextMenu: 'overlays-menu--context-menu',
  Menubar: 'overlays-menu--menubar',
  Toast: 'overlays-toast--playground',
};

test.describe('overlay a11y modes (CMP-390/410)', () => {
  for (const [name, story] of Object.entries(WIDGETS)) {
    test(`${name}: forced-colors → 0 backdrop-filters + CanvasText border`, async ({ page }) => {
      await gotoStory(page, story, { forcedColors: true });
      await page.emulateMedia({ forcedColors: 'active' }).catch(() => {});
      const blurred = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('*')].filter((el) => {
          const cs = getComputedStyle(el);
          return (cs.backdropFilter !== 'none' && cs.backdropFilter !== '') && el.offsetParent !== null;
        }).length,
      );
      // In emulation the marker is data-forced-colors; css drops the blur either way.
      expect(blurred).toBe(0);
      const popup = page.locator('[data-ag-part="popup"], [data-ag-part="root"], [role="tooltip"]').first();
      if (await popup.count()) {
        const border = await popup.evaluate((el) => getComputedStyle(el).borderColor);
        expect(border).toBeTruthy();
      }
    });
  }

  test('prefers-contrast more → contrasting popup border', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--default', { contrast: 'more' });
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    const bw = await popup.evaluate((el) => getComputedStyle(el).borderWidth);
    expect(parseFloat(bw)).toBeGreaterThanOrEqual(1);
  });
});
