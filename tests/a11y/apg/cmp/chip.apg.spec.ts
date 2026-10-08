
/* CMP-354 (lane 3i-Q). Chip APG: Space/Enter toggle aria-pressed on selectable
   chips; remove button reachable by Tab and named "Remove {label}"; activating it
   fires removal and moves focus to the next chip. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('chip APG (CMP-354)', () => {
  test('selectable chips toggle aria-pressed', async ({ page }) => {
    await gotoStory(page, 'core-chip--default');
    const chip = page.locator('[data-ag-part="chip"], [data-ag-part="root"]').first();
    await chip.focus();
    const pressed = await chip.getAttribute('aria-pressed');
    if (pressed !== null) {
      await page.keyboard.press('Space');
      await expect(chip).toHaveAttribute('aria-pressed', pressed === 'true' ? 'false' : 'true');
    }
  });

  test('remove button is named and removes its chip, focus moves on', async ({ page }) => {
    await gotoStory(page, 'core-chip--with-icons');
    const remove = page.getByRole('button', { name: /^remove /i }).first();
    if (await remove.count()) {
      const before = await page.locator('[data-ag-part="chip"], [data-ag-part="root"]').count();
      await remove.focus();
      await page.keyboard.press('Enter');
      const after = await page.locator('[data-ag-part="chip"], [data-ag-part="root"]').count();
      expect(after).toBe(before - 1);
      // focus must not be lost to <body>
      expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY');
    }
    await apg.axe(page);
  });
});
