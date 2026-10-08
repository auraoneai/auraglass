/* CMP-347 (lane 3i-Q). Stacked DismissableLayer: Escape closes only the top layer
   and focus returns to each layer's own context, in Chromium/WebKit/Gecko.
   Remote Playwright lane only — no local browsers per machine policy.
   Drives foundation-dismissable-layer--stacked (the dedicated scene landed with
   the composite scenes); the same contract over real dialogs is covered by
   T-OVL-STACK-04 in tests/e2e/cmp/overlays/overlay-stack.spec.ts. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('stacked-escape APG (CMP-347)', () => {
  test('Escape order is topmost-first; focus returns per layer', async ({ page }) => {
    await gotoStory(page, 'foundation-dismissable-layer--stacked');

    // Open the two layers; each layer's previous focus is the button that
    // opened it, so closing restores focus into the parent layer's context.
    await page.getByRole('button', { name: 'Open outer' }).click();
    const outer = page.locator('[data-ag-part="layer"][aria-label="outer layer"]');
    await expect(outer).toBeVisible();
    await outer.getByRole('button', { name: 'Open inner' }).click();
    const inner = page.locator('[data-ag-part="layer"][aria-label="inner layer"]');
    await expect(inner).toBeVisible();

    // First Escape: only the top (inner) layer closes; the parent stays open.
    await page.keyboard.press('Escape');
    await expect(inner).toHaveCount(0);
    await expect(outer).toBeVisible();
    // Focus must not escape to <body> — it returns inside the parent layer.
    const focusInOuter = await page.evaluate(
      () => document.querySelector('[data-ag-part="layer"][aria-label="outer layer"]')
        ?.contains(document.activeElement) ?? false,
    );
    expect(focusInOuter).toBe(true);

    // Second Escape: the parent closes too; focus returns to its trigger.
    await page.keyboard.press('Escape');
    await expect(outer).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Open outer' })).toBeFocused();

    await apg.axe(page);
  });
});
