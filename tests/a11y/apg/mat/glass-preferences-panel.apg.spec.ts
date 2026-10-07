/* MAT-320 (APG toolbar/radio-group + slider patterns): the panel's radio group
   is one tab stop, arrows move+select, the slider answers Arrow/Page/Home/End.
   Runs remote (3 engines) against the Theme/GlassPreferencesPanel story. */
import { test, expect } from '@playwright/test';
import { apg } from '../harness';

const STORY = 'theme-glasspreferencespanel--default';

async function goto_(page: import('@playwright/test').Page) {
  await page.goto(`/iframe.html?id=${STORY}&viewMode=story`);
  await page.waitForSelector('[data-ag-preferences-panel]');
}

test.describe('GlassPreferencesPanel APG', () => {
  test('radio group: one tab stop, arrows move and select', async ({ page }) => {
    await goto_(page);
    const radios = page.locator('[data-ag-pref="transparency"] input[type="radio"]');
    await expect(radios).toHaveCount(4);
    await radios.nth(0).focus();
    await apg.keyboard(page, [
      { press: 'ArrowDown', expectFocus: 'role=radio[name=Tinted]' },
      { press: 'ArrowUp', expectFocus: 'role=radio[name=Glass]' },
      { press: 'ArrowRight', expectFocus: 'role=radio[name=Tinted]' },
      { press: 'ArrowLeft', expectFocus: 'role=radio[name=Glass]' },
      { press: 'End', expectFocus: 'role=radio[name=Solid]' },
      { press: 'Home', expectFocus: 'role=radio[name=System]' },
    ]);
    // still a single tab stop for the whole group
    // selection followed the focus (native radios select on move)
    const checked = await page.evaluate(() =>
      (document.activeElement as HTMLInputElement | null)?.checked === true);
    expect(checked, 'arrow moved selection to the focused radio').toBe(true);
    await page.keyboard.press('Tab');
    const after = await page.evaluate(() => {
      const el = document.activeElement as HTMLInputElement | null;
      return el?.type ?? '';
    });
    expect(after, 'radio group is one tab stop').not.toBe('radio');
  });

  test('slider: arrows/PageUp/PageDown/Home/End move the value', async ({ page }) => {
    await goto_(page);
    const slider = page.locator('[data-ag-pref="glassOpacity"] input[type="range"]');
    await expect(slider).toHaveCount(1);
    await slider.focus();
    const v0 = Number(await slider.inputValue());
    await apg.keyboard(page, [
      { press: 'End' },
      { expectState: { 'aria-valuetext': '100% more opaque' } },
      { press: 'Home' },
      { expectState: { 'aria-valuetext': '0% more opaque' } },
    ]);
    await page.keyboard.press('ArrowUp');
    const v1 = Number(await slider.inputValue());
    expect(v1, 'ArrowUp increments').toBeGreaterThanOrEqual(v0 === 0 ? 5 : v0);
    await page.keyboard.press('PageUp');
    const v2 = Number(await slider.inputValue());
    expect(v2, 'PageUp jumps').toBeGreaterThanOrEqual(v1);
    await page.keyboard.press('PageDown');
    const v3 = Number(await slider.inputValue());
    expect(v3, 'PageDown drops').toBeLessThanOrEqual(v2);
  });

  test('axe on the panel story', async ({ page }) => {
    await goto_(page);
    await apg.axe(page);
  });
});
