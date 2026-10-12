/* CMP-397 + REQ-CMP-85 (lane 3i-Q). Anchored popups inside a 390px viewport —
   Popover/Select/Combobox/Menu/Tooltip: no horizontal overflow. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const POPUP_KINDS: Record<string, string> = {
  Popover: 'flagships-overlays-popover--side-align',
  Menu: 'flagships-overlays-menu--playground',
  Tooltip: 'flagships-overlays-tooltip--playground',
  Select: 'flagships-controls-select--default',
  Combobox: 'flagships-controls-combobox--default',
};

test.describe('anchored popup collision at 390 (CMP-397)', () => {
  for (const [kind, story] of Object.entries(POPUP_KINDS)) {
    test(`${kind}: popup stays inside a 390px viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await gotoStory(page, story);
      const popup = page.locator('[data-ag-part="popup"]').first();
      await expect(popup).toBeVisible();
      const box = await popup.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390 + 1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
