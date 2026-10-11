// REQ-SURF-72 (remote Playwright, L5): pinned start/end columns stay put
// (box unchanged within 1px) under a 2,000px horizontal scroll, LTR and RTL.
import { test, expect } from '@playwright/test';
import { gotoTableStory } from './table-story';

for (const [slug, dir] of [['pinned', 1], ['pinned-rtl', -1]] as const) {
  test(`pinned columns hold under a 2,000px horizontal scroll (${slug})`, async ({ page }) => {
    await gotoTableStory(page, slug);
    const scroller = page.locator('[data-ag-part="table-scroller"]').first();
    const startPin = scroller.locator('tr[data-row-id="r0"] [data-ag-cell="name"]');
    const endPin = scroller.locator('tr[data-row-id="r0"] [data-ag-cell="status"]');
    const unpinned = scroller.locator('tr[data-row-id="r0"] [data-ag-cell="c3"]');
    await expect(startPin).toHaveAttribute('data-ag-pinned-edge', 'start');
    await expect(endPin).toHaveAttribute('data-ag-pinned-edge', 'end');
    const scrollable = await scroller.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(scrollable).toBeGreaterThanOrEqual(2000);

    const before = { start: await startPin.boundingBox(), end: await endPin.boundingBox(), free: await unpinned.boundingBox() };
    await scroller.evaluate((el, d) => { el.scrollLeft = d * 2000; }, dir);
    await expect.poll(async () => Math.abs(await scroller.evaluate((el) => el.scrollLeft))).toBe(2000);
    const after = { start: await startPin.boundingBox(), end: await endPin.boundingBox(), free: await unpinned.boundingBox() };

    for (const k of ['start', 'end'] as const) {
      expect(before[k], `${k} pin box`).not.toBeNull();
      expect(Math.abs(after[k]!.x - before[k]!.x), `${k} pin x delta`).toBeLessThanOrEqual(1);
      expect(Math.abs(after[k]!.y - before[k]!.y), `${k} pin y delta`).toBeLessThanOrEqual(1);
      expect(Math.abs(after[k]!.width - before[k]!.width), `${k} pin width delta`).toBeLessThanOrEqual(1);
    }
    // control: an unpinned column did move by the scroll distance
    expect(Math.abs(after.free!.x - before.free!.x)).toBeGreaterThan(1900);
  });
}
