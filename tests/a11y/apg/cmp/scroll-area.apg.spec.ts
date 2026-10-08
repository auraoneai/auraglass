
/* CMP-353 (lane 3i-Q). ScrollArea APG: viewport is a tab stop only when it
   overflows; Arrow/PageDown scroll it; accessible name present. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('scroll-area APG (CMP-353)', () => {
  test('overflowing viewport is focusable with an accessible name', async ({ page }) => {
    await gotoStory(page, 'core-scroll-area--default');
    const viewport = page.locator('[data-ag-part="viewport"]');
    await expect(viewport).toBeVisible();
    const scrollable = await viewport.evaluate(
      (el) => el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth,
    );
    if (scrollable) {
      await expect(viewport).toHaveAttribute('tabindex', '0');
      const name = await viewport.evaluate(
        (el) => el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'),
      );
      expect(name).toBeTruthy();
      await viewport.focus();
      const before = await viewport.evaluate((el) => el.scrollTop);
      await apg.keyboard(page, [{ press: 'ArrowDown' }, { press: 'PageDown' }]);
      const after = await viewport.evaluate((el) => el.scrollTop);
      expect(after).toBeGreaterThan(before);
    }
    await apg.axe(page);
  });
});
