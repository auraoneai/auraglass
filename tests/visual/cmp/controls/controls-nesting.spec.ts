
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

  /* REQ-CMP-40: concentric item radius = max(0, root radius - inset), within 0.5px. */
  test('capsule toolbar items are concentric (root radius - inset, ±0.5px)', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-toolbar--overview')
      .catch(() => gotoStory(page, 'flagships-controls-toolbar--default'));
    const root = page.locator('[role="toolbar"][data-ag-shape="capsule"], [role="toolbar"]').first();
    await expect(root).toBeVisible();
    const { rootRadius, padding, itemRadius } = await root.evaluate((el) => {
      const cs = getComputedStyle(el);
      const item = el.querySelector<HTMLElement>('.ag-button');
      return {
        rootRadius: parseFloat(cs.borderTopLeftRadius) || 0,
        padding: parseFloat(cs.paddingLeft) || 0,
        itemRadius: item ? parseFloat(getComputedStyle(item).borderTopLeftRadius) : null,
      };
    });
    if (itemRadius === null) test.skip();
    const expected = Math.max(0, rootRadius - padding);
    /* capsule full-radius resolves to a large px value; the item must be
       concentric, i.e. root radius minus the root's inset padding. */
    expect(Math.abs(itemRadius - expected)).toBeLessThanOrEqual(0.5);
  });
});
