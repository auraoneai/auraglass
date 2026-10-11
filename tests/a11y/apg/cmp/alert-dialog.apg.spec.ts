
/* CMP-392 (lane 3i-Q). AlertDialog APG, 3 engines: role=alertdialog; initial
   focus on the cancel action; outside press ignored; Escape closes with focus
   return; description announced (aria-describedby resolves). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('alert-dialog APG (CMP-392)', () => {
  test('role, initial cancel focus, escape + description wiring', async ({ page }) => {
    await gotoStory(page, 'overlays-alert-dialog--confirm');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    await expect(popup).toHaveAttribute('role', 'alertdialog');

    // initial focus is on the cancel action
    const cancelFocused = await page.evaluate(() => {
      const el = document.activeElement;
      return !!el && /cancel|close|dismiss/i.test(el.textContent ?? '');
    });
    expect(cancelFocused).toBe(true);

    // aria-describedby resolves to a real description node
    const described = await popup.evaluate((el) => {
      const id = el.getAttribute('aria-describedby');
      return !!id && !!document.getElementById(id);
    });
    expect(described).toBe(true);

    // outside press is ignored (still open)
    await page.mouse.click(5, 5);
    await expect(popup).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY');
    await apg.axe(page);
  });
});
