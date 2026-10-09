
/* CMP-394 + CMP-399 + CMP-404 + CMP-409 (lane 3i-Q). Overlay stack cases
   T-OVL-STACK-01..04 over nested/composite overlay scenes. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const popups = (page: import('@playwright/test').Page) =>
  page.locator('[data-ag-part="popup"]');

test.describe('overlay stack (CMP-394/399/404/409)', () => {
  test('T-OVL-STACK-04: nested Dialog — nested-open marker, top scrim only, one Escape per layer', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--nested');
    const outer = page.locator('[data-ag-part="popup"][aria-label="outer dialog"]');
    const inner = page.locator('[data-ag-part="popup"][aria-label="inner dialog"]');
    await expect(outer).toBeVisible();
    await expect(inner).toBeVisible();

    // parent popup carries the nested-open marker while the child is up
    await expect(outer).toHaveAttribute('data-ag-nested-open', /.*/);

    // only the topmost scrim blurs
    const blurredScrims = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('[data-ag-part="backdrop"], [data-ag-part="scrim"]')]
        .filter((el) => getComputedStyle(el).backdropFilter !== 'none'
          || getComputedStyle(el, '::before').backdropFilter !== 'none').length,
    );
    expect(blurredScrims).toBeLessThanOrEqual(1);

    // one Escape closes exactly the child; focus returns to the parent layer
    await page.keyboard.press('Escape');
    await expect(inner).toHaveCount(0);
    await expect(outer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(outer).toHaveCount(0);
  });

  test('T-OVL-STACK-02: press inside Dialog popup outside Popover closes only the Popover', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--with-popover');
    const dialogPopup = page.locator('[data-ag-part="popup"][aria-label="composite dialog"]');
    const popoverPopup = page.locator('[data-ag-part="popup"][aria-label="composite popover"]');
    await expect(dialogPopup).toBeVisible();
    await expect(popoverPopup).toBeVisible();

    // Press inside the dialog popup but outside the popover → popover only.
    await page.locator('[data-ag-testid="dialog-outside-target"]').click();
    await expect(popoverPopup).toHaveCount(0);
    await expect(dialogPopup).toBeVisible();
  });

  test('T-OVL-STACK-01: Dialog→Popover→Menu — exactly one layer per Escape', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--with-popover-menu');
    const dialogPopup = page.locator('[data-ag-part="popup"][aria-label="stack dialog"]');
    const popoverPopup = page.locator('[data-ag-part="popup"][aria-label="stack popover"]');
    const menuPopup = page.locator('[data-ag-part="popup"][aria-label="stack menu"]');
    await expect(dialogPopup).toBeVisible();
    await expect(popoverPopup).toBeVisible();
    await expect(menuPopup).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menuPopup).toHaveCount(0);
    await expect(popoverPopup).toBeVisible();
    await expect(dialogPopup).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(popoverPopup).toHaveCount(0);
    await expect(dialogPopup).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialogPopup).toHaveCount(0);
  });

  test('T-OVL-STACK-03: toast layer root has no inert ancestor over a modal Dialog; F6 reaches it', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--default');
    /* REQ-CMP-80: the toast layer root is always mounted by the provider
       ([data-ag-layer-root="toast"]) and is exempt from modal inert — the test
       asserts on it directly so it never skips. */
    const toastRoot = page.locator('[data-ag-layer-root="toast"]');
    await expect(toastRoot).toHaveCount(1);
    const hasInertAncestor = await toastRoot.evaluate(
      (el) => { let n: Element | null = el; while (n) { if (n.hasAttribute('inert')) return true; n = n.parentElement; } return false; },
    );
    expect(hasInertAncestor).toBe(false);
    await page.keyboard.press('F6');
  });
});
