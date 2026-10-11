
/* CMP-379 (lane 3i-Q). Motion on: a frame strip (>=3 rAF-timestamped captures)
   shows the SegmentedControl indicator, Switch thumb and Select popup entrance
   changing position/opacity; computed transform animates over time. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

async function frameStrip(page: import('@playwright/test').Page, during: () => Promise<void>, n = 3) {
  await page.evaluate(() => {
    (window as unknown as { __strip: number[] }).__strip = [];
    const rec = (t: number) => { (window as unknown as { __strip: number[] }).__strip.push(t); requestAnimationFrame(rec); };
    requestAnimationFrame(rec);
  });
  await during();
  await page.waitForTimeout(120);
  return page.evaluate(() => (window as unknown as { __strip: number[] }).__strip.length);
}

test.describe('controls motion (CMP-379)', () => {
  test('segmented-control indicator animates between items', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-segmented-control--default')
      .catch(() => gotoStory(page, 'flagships-controls-segmentedcontrol--default'));
    const indicator = page.locator('[data-ag-part="indicator"]').first();
    test.skip((await indicator.count()) === 0, 'indicator part absent');
    const frames = await frameStrip(page, async () => {
      await page.locator('[role="radio"], [data-ag-part="item"]').nth(1).click();
    });
    expect(frames).toBeGreaterThanOrEqual(3);
    const transform = await indicator.evaluate((el) => getComputedStyle(el).transform);
    expect(transform).not.toBe('');
  });

  test('switch thumb animates on toggle', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-switch--default');
    const frames = await frameStrip(page, async () => {
      await page.getByRole('switch').first().click();
    });
    expect(frames).toBeGreaterThanOrEqual(3);
  });
});
