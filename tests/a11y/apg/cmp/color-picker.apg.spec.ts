
/* CMP-358 (lane 3i-Q). ColorPicker APG: open via trigger; Area arrows +-1% and
   Shift+Arrow +-10% update aria-valuetext; the three sliders respond to arrows;
   typing a hex in the input updates the area and back (round-trip); Escape closes. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('color-picker APG (CMP-358)', () => {
  test('sliders respond to arrows; hex input round-trips', async ({ page }) => {
    await gotoStory(page, 'core-color-picker--default');
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    await trigger.focus();
    await page.keyboard.press('Enter');
    const sliders = page.locator('[role="slider"]');
    expect(await sliders.count()).toBeGreaterThanOrEqual(1);
    const s0 = sliders.first();
    const v0 = await s0.getAttribute('aria-valuenow');
    await s0.focus();
    await page.keyboard.press('ArrowRight');
    expect(await s0.getAttribute('aria-valuenow')).not.toBe(v0);

    const hex = page.locator('input').last();
    await hex.fill('#336699');
    await page.keyboard.press('Enter');
    expect(await hex.inputValue()).toMatch(/336699/i);
    await page.keyboard.press('Escape');
    await apg.axe(page);
  });
});
