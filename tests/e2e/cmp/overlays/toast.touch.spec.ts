/* CMP-408 companion + REQ-CMP-109 (lane 3i-Q). Toast touch: a swipe toward
   the viewport edge dismisses exactly that toast, and the card follows the
   pointer with transform only while dragging. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.use({ hasTouch: true });

const TOAST = '[data-ag-part="viewport"] [data-ag-part="toast"]';

test.describe('toast touch (CMP-408 / REQ-CMP-109)', () => {
  test('swipe toward the edge dismisses one toast', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-toast--intents');
    const toasts = page.locator(TOAST);
    await expect(toasts, 'seeded scene renders three toasts').toHaveCount(3);
    const before = await toasts.count();
    const target = toasts.first();
    const box = await target.boundingBox();
    expect(box, 'toast has a layout box').not.toBeNull();
    const { x, y, width, height } = box!;

    // bottom-right viewport → swipe right (toward the inline-end edge)
    await page.mouse.move(x + width / 2, y + height / 2);
    await page.mouse.down();
    await page.mouse.move(x + width / 2 + 30, y + height / 2, { steps: 3 });
    // mid-drag: the card is translated (transform), not re-laid-out
    await expect(target).toHaveAttribute('data-swiping', '');
    const transform = await target.evaluate((el) => getComputedStyle(el).transform);
    expect(transform).not.toBe('none');
    await page.mouse.move(x + width + 160, y + height / 2, { steps: 6 });
    await page.mouse.up();

    await expect(toasts).toHaveCount(before - 1);
  });
});
