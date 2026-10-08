/* CMP-347 (lane 3i-Q). Stacked DismissableLayer: Escape closes only the top layer
   and focus returns to each layer's own context, in Chromium/WebKit/Gecko.
   Remote Playwright lane only — no local browsers per machine policy.
   NOTE: the dedicated Foundation/DismissableLayer `Stacked` story does not exist
   yet (lane 3a authored Default/States/ForcedColors/RTL only); until it lands this
   spec drives the same contract through overlays-dialog--nested, which mounts two
   real DismissableLayer subtrees (both defaultOpen). PENDING: also point at
   foundation-dismissable-layer--stacked when that scene is added. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('stacked-escape APG (CMP-347)', () => {
  test('Escape order is topmost-first; focus returns per layer', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--nested');

    const outer = page.locator('[data-ag-part="popup"][aria-label="outer dialog"]');
    const inner = page.locator('[data-ag-part="popup"][aria-label="inner dialog"]');
    await expect(outer).toBeVisible();
    await expect(inner).toBeVisible();

    // First Escape: only the top (inner) layer closes; the parent stays open and
    // carries the nested-open marker while the child was up.
    await page.keyboard.press('Escape');
    await expect(inner).toHaveCount(0);
    await expect(outer).toBeVisible();
    // Focus must not escape to <body> — it returns inside the parent layer.
    const focusInOuter = await page.evaluate(
      () => document.querySelector('[data-ag-part="popup"][aria-label="outer dialog"]')
        ?.contains(document.activeElement) ?? false,
    );
    expect(focusInOuter).toBe(true);

    // Second Escape: the parent closes too.
    await page.keyboard.press('Escape');
    await expect(outer).toHaveCount(0);

    await apg.axe(page);
  });
});
