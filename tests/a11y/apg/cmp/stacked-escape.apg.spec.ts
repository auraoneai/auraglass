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

  /* REQ-CMP-27 (REQ-FIN-71, E3.2): real overlays, three layers — Dialog →
     Popover → Menu (overlays-stacked-escape). Each Escape closes exactly the
     top layer, the layers below stay visible, and focus lands on the trigger
     of the layer that just closed. */
  test('Dialog > Popover > Menu: one layer per Escape, focus to each trigger', async ({ page }) => {
    await gotoStory(page, 'overlays-stacked-escape--dialog-popover-menu');

    const dialogTrigger = page.getByRole('button', { name: 'Open dialog' });
    const dialog = page.locator('[data-ag-part="popup"][aria-label="Stacked dialog"]');
    const popover = page.locator('[data-ag-part="popup"][aria-label="Stacked popover"]');
    const menu = page.locator('[data-ag-part="popup"][aria-label="Stacked menu"]');

    await dialogTrigger.click();
    await expect(dialog).toBeVisible();
    const popoverTrigger = dialog.getByRole('button', { name: 'Open popover' });
    await popoverTrigger.click();
    await expect(popover).toBeVisible();
    const menuTrigger = popover.getByRole('button', { name: 'Open menu' });
    await menuTrigger.click();
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('role', 'menu');

    // Escape 1: only the Menu closes; focus returns to the Menu trigger.
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(popover).toBeVisible();
    await expect(dialog).toBeVisible();
    await expect(menuTrigger).toBeFocused();

    // Escape 2: only the Popover closes; focus returns to the Popover trigger.
    await page.keyboard.press('Escape');
    await expect(popover).toHaveCount(0);
    await expect(dialog).toBeVisible();
    await expect(popoverTrigger).toBeFocused();

    // Escape 3: the Dialog closes; focus returns to the Dialog trigger.
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(dialogTrigger).toBeFocused();

    await apg.axe(page);
  });
});
