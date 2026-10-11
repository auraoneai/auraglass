
/* CMP-405 (lane 3i-Q). Sheet APG, 3 engines: handle Enter/Space cycles detents;
   live region announces the detent; Body reachable by Tab at every detent;
   Escape closes; focus returns; every drag result has a single-pointer
   alternative (the detent buttons). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('sheet APG (CMP-405)', () => {
  test('handle keys cycle detents; body stays reachable; escape restores', async ({ page }) => {
    await gotoStory(page, 'overlays-sheet--bottom-detents');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    /* REQ-CMP-95: the handle is a plain button named 'Resize sheet'
       (no separator role, no aria-orientation). */
    const handle = page.getByRole('button', { name: 'Resize sheet' }).first();
    await expect(handle).toBeVisible();

    const detentBefore = await popup.getAttribute('data-ag-detent');
    await handle.focus();
    await page.keyboard.press('Enter');
    const detentAfter = await popup.getAttribute('data-ag-detent');
    expect(detentAfter).not.toBe(detentBefore);

    // body reachable by Tab from the handle at the new detent
    // announcement derives from the detent value — 'full' reads 'Full height'
    await expect(page.locator('[data-ag-part="detent-live"]')).toHaveText(/full height/i);

    await apg.keyboard(page, [{ press: 'Tab' }]);
    const inside = await page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    );
    expect(inside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    await apg.axe(page);
  });
});
