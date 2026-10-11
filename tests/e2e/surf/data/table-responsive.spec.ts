// REQ-SURF-76 (remote Playwright, L5): coarse-pointer rows >= 44px, no page
// overflow at 320/390px, and no clipped header text at 1440px / 200% zoom.
import { test, expect } from '@playwright/test';
import { gotoTableStory } from './table-story';

test.describe('table responsive (REQ-SURF-76)', () => {
  test.describe('coarse pointer', () => {
    test.use({ hasTouch: true });
    test('rows are >= 44px tall under (pointer: coarse)', async ({ page }) => {
      await gotoTableStory(page, 'basic');
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), 'coarse pointer emulated').toBe(true);
      const rows = page.locator('tbody tr[data-ag-part="table-row"]');
      expect(await rows.count()).toBeGreaterThan(0);
      const heights = await rows.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
      for (const h of heights) expect(h).toBeGreaterThanOrEqual(44);
    });
  });

  for (const width of [320, 390]) {
    test(`no page overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await gotoTableStory(page, 'basic');
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.scrollingElement!.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });
  }

  test('1440px at 200% zoom: header text is not clipped', async ({ page }) => {
    // 200% zoom of a 1440px window = a 720 CSS-px layout viewport at DPR 2.
    await page.setViewportSize({ width: 720, height: 450 });
    await gotoTableStory(page, 'basic');
    const headers = page.locator('thead th[data-ag-part="table-header-cell"]');
    expect(await headers.count()).toBe(3);
    const clipped = await headers.evaluateAll((els) =>
      els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent),
    );
    expect(clipped).toEqual([]);
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.scrollingElement!.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });
});
