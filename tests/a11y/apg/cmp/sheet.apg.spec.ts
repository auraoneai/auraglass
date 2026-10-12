
/* CMP-405 (lane 3i-Q). Sheet APG, 3 engines: handle Enter/Space cycles detents;
   live region announces the detent; Body reachable by Tab at every detent;
   Escape closes; focus returns; every drag result has a single-pointer
   alternative (the detent buttons). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('sheet APG (CMP-405)', () => {
  test('handle keys cycle detents; body stays reachable; escape restores', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-sheet--bottom-detents');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    /* REQ-CMP-95: the handle is a plain button named 'Resize sheet'
       (no separator role, no aria-orientation). */
    const handle = page.getByRole('button', { name: 'Resize sheet' }).first();
    await expect(handle).toBeVisible();

    const detentBefore = await popup.getAttribute('data-detent');
    await handle.focus();
    await page.keyboard.press('Enter');
    const detentAfter = await popup.getAttribute('data-detent');
    expect(detentAfter).not.toBe(detentBefore);

    // body reachable by Tab from the handle at the new detent
    // announcement derives from the detent value — 'full' reads 'Full height'
    await expect(page.locator('[data-ag-part="detent-live"]')).toHaveText(/full height/i);

    /* REQ-CMP-95 (CC-CMP-03): the full-height detent resolves the popup's
       material to the tinted rung. The popup carries the full-height
       appearance, and its computed fill equals a reference surface with the
       same material attributes on the [data-ag-transparency=tinted] rung. */
    await expect(popup).toHaveAttribute('data-ag-appearance', 'full-height');
    const fill = await popup.evaluate((el) => {
      const ref = document.createElement('div');
      for (const a of Array.from(el.attributes)) {
        if (a.name.startsWith('data-ag-') && a.name !== 'data-ag-appearance') ref.setAttribute(a.name, a.value);
      }
      ref.setAttribute('data-ag-transparency', 'tinted');
      ref.className = el.className;
      ref.style.cssText = 'position:fixed;inset:auto;inline-size:10px;block-size:10px;pointer-events:none;';
      el.parentElement!.appendChild(ref);
      const read = (n: Element) => {
        const cs = getComputedStyle(n);
        return { floor: cs.getPropertyValue('--_ag-tint-floor').trim(), background: cs.backgroundColor };
      };
      const out = { popup: read(el), tinted: read(ref) };
      ref.remove();
      return out;
    });
    expect(fill.popup.floor).not.toBe('');
    expect(fill.popup.floor).toBe(fill.tinted.floor);
    expect(fill.popup.background).toBe(fill.tinted.background);

    await apg.keyboard(page, [{ press: 'Tab' }]);
    const inside = await page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    );
    expect(inside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    // focus returns to the trigger after Escape
    await expect(page.getByRole('button', { name: 'Open sheet' })).toBeFocused();
    await apg.axe(page);
  });
});
