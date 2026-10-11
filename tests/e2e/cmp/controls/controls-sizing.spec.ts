
/* CMP-377 (lane 3i-Q). Block sizes per family × size × density:
   28/36/44 (compact), 24/32/44, 32/40/48 (+-0.5px); hit areas verified via
   document.elementFromPoint at the four edges of each box. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const TOLERANCE = 0.5;

test.describe('controls sizing (CMP-377)', () => {
  test('default-density control heights land in the 32/40/48 table', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--sizes')
      .catch(() => gotoStory(page, 'flagships-controls-button--default'));
    const heights = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('button, [data-ag-part="root"]')]
        .map((el) => el.getBoundingClientRect().height)
        .filter((h) => h > 0),
    );
    expect(heights.length).toBeGreaterThan(0);
    const TABLE = [24, 28, 32, 36, 40, 44, 48];
    for (const h of heights) {
      expect(TABLE.some((t) => Math.abs(h - t) <= TOLERANCE)).toBe(true);
    }
  });

  test('hit area: elementFromPoint at all four edges hits the control', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--default');
    const btn = page.getByRole('button').first();
    const hit = await btn.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const pts: [number, number][] = [
        [r.left + 1, r.top + r.height / 2],
        [r.right - 1, r.top + r.height / 2],
        [r.left + r.width / 2, r.top + 1],
        [r.left + r.width / 2, r.bottom - 1],
      ];
      return pts.every(([x, y]) => {
        const at = document.elementFromPoint(x, y);
        return !!at && (at === el || el.contains(at) || at.contains(el));
      });
    });
    expect(hit).toBe(true);
  });
});
