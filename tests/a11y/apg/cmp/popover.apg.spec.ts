
/* CMP-397 (lane 3i-Q). Popover APG, 3 engines: focus in/out; Escape closes and
   restores; outside press closes. Companion spec:
   tests/e2e/cmp/overlays/popover.spec.ts ("collision at 390"). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('popover APG (CMP-397)', () => {
  test('focus moves in; Escape and outside-press close with focus return', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-popover--playground');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();

    // focus moves into the popup on open
    const inside = await page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    );
    expect(inside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    // REQ-CMP-98: focus returns to the trigger, not merely 'not BODY'
    await expect(page.locator('[data-ag-part="trigger"]').first()).toBeFocused();
    await apg.axe(page);
  });

  test('outside press closes the popover', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-popover--playground');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    await page.mouse.click(4, 4);
    await expect(popup).toHaveCount(0);
  });

  /* REQ-CMP-98: a click-opened popover moves focus into the popup and
     restores it to the trigger on Escape and on outside press. */
  test('click-open: focus moves into the popup; Escape restores it to the trigger', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-popover--click-to-open');
    const trigger = page.locator('[data-ag-part="trigger"]').first();
    const popup = page.locator('[data-ag-part="popup"]');
    await expect(popup).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(popup).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const controls = await trigger.getAttribute('aria-controls');
    expect(controls).not.toBeNull();
    await expect(popup).toHaveAttribute('id', controls!);
    await expect(popup).toHaveAttribute('role', 'dialog');
    await expect.poll(() => page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    )).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await apg.axe(page);
  });

  test('click-open: outside press closes', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-popover--click-to-open');
    const trigger = page.locator('[data-ag-part="trigger"]').first();
    await trigger.click();
    const popup = page.locator('[data-ag-part="popup"]');
    await expect(popup).toBeVisible();
    await page.mouse.click(4, 4);
    await expect(popup).toHaveCount(0);
  });

  /* REQ-CMP-98: Arrow paints the popup's fill and rim, never a second backdrop. */
  test('arrow uses the popup fill and rim with no backdrop-filter', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-popover--playground');
    const arrow = page.locator('[data-ag-part="arrow"]').first();
    await expect(arrow).toHaveCount(1);
    const paint = await arrow.evaluate((el) => {
      const popup = el.closest('[data-ag-part="popup"]') as HTMLElement;
      const pcs = getComputedStyle(popup);
      const fill = getComputedStyle(el, '::after');
      const rim = getComputedStyle(el, '::before');
      return {
        fill: fill.backgroundColor,
        rim: rim.backgroundColor,
        popupFill: pcs.getPropertyValue('--ag-surface-fill').trim(),
        popupRim: pcs.getPropertyValue('--ag-surface-rim').trim(),
        hostBf: getComputedStyle(el).backdropFilter,
        fillBf: fill.backdropFilter,
        rimBf: rim.backdropFilter,
      };
    });
    expect(paint.popupFill).not.toBe('');
    expect(paint.fill).not.toBe('rgba(0, 0, 0, 0)');
    expect(paint.rim).not.toBe('rgba(0, 0, 0, 0)');
    // resolve the popup read-outs to computed colours for comparison
    const resolved = await page.evaluate(({ f, r }) => {
      const probe = document.createElement('div');
      document.body.append(probe);
      probe.style.backgroundColor = f;
      const fill = getComputedStyle(probe).backgroundColor;
      probe.style.backgroundColor = r;
      const rim = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { fill, rim };
    }, { f: paint.popupFill, r: paint.popupRim });
    expect(paint.fill).toBe(resolved.fill);
    expect(paint.rim).toBe(resolved.rim);
    for (const bf of [paint.hostBf, paint.fillBf, paint.rimBf]) expect(bf === 'none' || bf === '').toBe(true);
  });
});
