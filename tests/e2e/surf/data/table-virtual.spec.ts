// REQ-SURF-70 (remote Playwright, L5): the 10,000-row virtualized table keeps
// <= ceil(viewport/40) + 2*8 rows in the DOM at every scroll step and reaches
// aria-rowindex 9001 (the 9,000th data row; header = 1).
import { test, expect } from '@playwright/test';
import { gotoTableStory } from './table-story';

test.describe('table virtual (REQ-SURF-70)', () => {
  test('scroll to row 9,000: aria-rowindex=9001 exists, rows bounded throughout', async ({ page }) => {
    await gotoTableStory(page, 'virtualized');
    const scroller = page.locator('[data-ag-part="table-scroller"]').first();
    const table = scroller.locator('table');
    await expect(table).toHaveAttribute('aria-rowcount', '10001');
    const viewport = await scroller.evaluate((el) => el.clientHeight);
    expect(viewport).toBeGreaterThan(0);
    const bound = Math.ceil(viewport / 40) + 2 * 8;
    const rows = scroller.locator('tbody tr[data-ag-part="table-row"]');

    const target = 8999 * 40; // top of the 9,000th row (40px md rows)
    for (let step = 1; step <= 10; step++) {
      await scroller.evaluate((el, top) => { el.scrollTop = top; }, Math.round((target * step) / 10));
      await expect.poll(async () => rows.count()).toBeGreaterThan(0);
      const n = await rows.count();
      expect(n, `rows in DOM at step ${step}`).toBeLessThanOrEqual(bound);
    }
    const row9001 = scroller.locator('tr[aria-rowindex="9001"]');
    await expect(row9001).toHaveCount(1);
    await expect(row9001).toHaveAttribute('data-row-id', 'r8999');
    // rows are absolutely positioned with translateY
    const transform = await row9001.evaluate((el) => (el as HTMLElement).style.transform);
    expect(transform).toBe(`translateY(${8999 * 40}px)`);
    expect(await rows.count()).toBeLessThanOrEqual(bound);
  });
});
