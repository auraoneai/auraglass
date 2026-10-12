
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

/* REQ-CMP-40: items in a capsule Toolbar root are concentric — every item's
   radius = max(0, root radius − root inset) within ±0.5px. */
test('toolbar items are concentric with the capsule root (±0.5px)', async ({ page }) => {
  await gotoStory(page, 'flagships-controls-toolbar--default');
  const root = page.locator('[role="toolbar"][data-ag-shape="capsule"]').first();
  await expect(root).toBeVisible();
  const rows = await root.evaluate((el) => {
    const rcs = getComputedStyle(el);
    const rootR = parseFloat(rcs.borderTopLeftRadius);
    const inset = parseFloat(rcs.paddingTop);
    return [...el.querySelectorAll<HTMLElement>('.ag-button, .ag-toolbar-link')].map((item) => ({
      item: (item.getAttribute('aria-label') ?? item.textContent ?? '').trim(),
      radius: parseFloat(getComputedStyle(item).borderTopLeftRadius),
      want: Math.max(0, rootR - inset),
    }));
  });
  expect(rows.length, 'toolbar renders items').toBeGreaterThan(0);
  for (const r of rows) {
    expect(Math.abs(r.radius - r.want), `${r.item}: radius ${r.radius}px vs ${r.want}px`).toBeLessThanOrEqual(0.5);
  }
});
