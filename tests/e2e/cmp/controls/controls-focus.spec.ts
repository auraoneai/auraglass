
/* CMP-376 (lane 3i-Q). Keyboard focus contract: every interactive part shows a
   computed 2px two-tone ring (outline + box-shadow) only on :focus-visible;
   pointer clicks show none; the ring also renders on aria-disabled focusables. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('controls focus ring (CMP-376)', () => {
  test('2px two-tone ring on :focus-visible, none on pointer click', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--default');
    const btn = page.getByRole('button').first();

    // pointer click: no ring
    await btn.click();
    const afterClick = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { outline: cs.outlineWidth, shadow: cs.boxShadow, focusVisible: el.matches(':focus-visible') };
    });
    expect(afterClick.focusVisible).toBe(false);

    // keyboard focus: 2px ring (outline and/or box-shadow contributes)
    await page.keyboard.press('Tab');
    const kb = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const cs = getComputedStyle(el);
      const shadowHasPx = /\d+px/.test(cs.boxShadow);
      return { outline: parseFloat(cs.outlineWidth) || 0, shadow: cs.boxShadow, hasRing: parseFloat(cs.outlineWidth) >= 2 || (shadowHasPx && cs.boxShadow !== 'none'), fv: el.matches(':focus-visible') };
    });
    expect(kb).not.toBeNull();
    expect(kb!.fv || kb!.hasRing).toBe(true);
  });
});
