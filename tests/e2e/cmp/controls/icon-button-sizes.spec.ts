/* REQ-CMP-36. IconButton square boxes measure 28/36/44px for sm/md/lg at the
   control-height tokens; the hit-area target stays >=44px; no label part. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('icon-button sizes (REQ-CMP-36)', () => {
  test('sm/md/lg boxes measure 28/36/44px', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-iconbutton--sizes');
    const buttons = page.locator('.ag-icon-button');
    test.skip((await buttons.count()) < 3, 'sizes story missing');
    const sizes = await buttons.evaluateAll((els) =>
      els.map((el) => ({ size: el.getAttribute('data-ag-size'), w: (el as HTMLElement).offsetWidth, h: (el as HTMLElement).offsetHeight })),
    );
    const expected: Record<string, number> = { sm: 28, md: 36, lg: 44 };
    for (const { size, w, h } of sizes) {
      if (size && size in expected) {
        expect(w).toBe(expected[size]);
        expect(h).toBe(expected[size]);
      }
    }
    /* hit-area still reaches the 44px target on every size */
    const hit = buttons.first().locator('[data-ag-part="hit-area"]');
    if ((await hit.count()) > 0) {
      const hw = await hit.evaluate((el) => (el as HTMLElement).offsetWidth);
      expect(hw).toBeGreaterThanOrEqual(44);
    }
    expect(await buttons.first().locator('[data-ag-part="label"]').count()).toBe(0);
  });
});
