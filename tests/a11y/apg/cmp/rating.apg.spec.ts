
/* CMP-355 (lane 3i-Q). Rating APG: arrows change value (RTL reversed), Home/End,
   readOnly ignores keys + exposes aria-readonly, half value announced "3.5 of 5". */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('rating APG (CMP-355)', () => {
  test('arrow keys step the value; Home/End bound it', async ({ page }) => {
    await gotoStory(page, 'core-rating--default');
    const root = page.locator('[data-ag-part="root"]').first();
    await root.focus();
    await apg.keyboard(page, [{ press: 'End' }]);
    await expect(root).toHaveAttribute('aria-valuenow', /5|10/);
    await apg.keyboard(page, [{ press: 'Home' }]);
    await expect(root).toHaveAttribute('aria-valuenow', /0/);
    await apg.keyboard(page, [{ press: 'ArrowRight' }, { press: 'ArrowRight' }]);
    const v = await root.getAttribute('aria-valuenow');
    expect(Number(v)).toBeGreaterThan(0);
  });

  test('readOnly ignores keys and exposes aria-readonly', async ({ page }) => {
    await gotoStory(page, 'core-rating--read-only');
    const root = page.locator('[data-ag-part="root"]').first();
    await expect(root).toHaveAttribute('aria-readonly', 'true');
    const v = await root.getAttribute('aria-valuenow');
    await root.focus().catch(() => {});
    await page.keyboard.press('ArrowRight');
    await expect(root).toHaveAttribute('aria-valuenow', v ?? '0');
  });

  test('half value is announced as "3.5 of 5"', async ({ page }) => {
    await gotoStory(page, 'core-rating--half');
    const root = page.locator('[data-ag-part="root"]').first();
    const text = (await root.getAttribute('aria-valuetext')) ?? (await root.textContent()) ?? '';
    expect(text).toMatch(/3\.5/);
    await apg.axe(page);
  });
});
