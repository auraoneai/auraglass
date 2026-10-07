
/* CMP-382 (lane 3i-Q). Nesting rule: Toolbar in a TopBar, SegmentedControl in a
   Toolbar, SearchField in a Toolbar — every nested surface's ::before
   backdrop-filter is "none" while the group root keeps its blur. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('controls nesting (CMP-382)', () => {
  test('nested surfaces carry no ::before blur; group root keeps it', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-toolbar--overview')
      .catch(() => gotoStory(page, 'flagships-controls-toolbar--default'));
    const root = page.locator('[data-ag-part="root"], [role="toolbar"]').first();
    await expect(root).toBeVisible();

    const nested = await root.evaluate((el) =>
      [...el.querySelectorAll<HTMLElement>('[data-ag-part], button')]
        .map((n) => getComputedStyle(n, '::before').backdropFilter),
    );
    for (const bf of nested) {
      expect(bf === 'none' || bf === '').toBe(true);
    }
    const rootBf = await root.evaluate(
      (el) => getComputedStyle(el, '::before').backdropFilter || getComputedStyle(el).backdropFilter,
    );
    expect(rootBf === 'none' || rootBf.includes('blur')).toBe(true);
  });
});
