/* MAT-320 (APG toolbar/radio-group + slider patterns): the panel's radio group
   is one tab stop, arrows move+select, the slider answers Arrow/Page/Home/End.
   Runs remote (3 engines) against the Theme/GlassPreferencesPanel story.
   D.3-36 (REQ-MAT-60 / REQ-FIN-59): RTL case against the RTL story and the
   OS Increase Contrast lock on the contrast 'standard' option. */
import { test, expect } from '@playwright/test';
import { apg } from '../harness';

const STORY = 'theme-glasspreferencespanel--default';
const RTL_STORY = 'theme-glasspreferencespanel--rtl';

async function goto_(page: import('@playwright/test').Page, story = STORY) {
  await page.goto(`/iframe.html?id=${story}&viewMode=story`);
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

  test('RTL: panel resolves rtl, controls sit at inline-start, arrows keep order, axe clean', async ({ page }) => {
    await goto_(page, RTL_STORY);
    const panel = page.locator('[data-ag-preferences-panel]');
    expect(await panel.evaluate((el) => getComputedStyle(el).direction)).toBe('rtl');
    // every option: the native control is on the inline-start (right) side of its label text
    const sides = await page.locator('[data-ag-pref="transparency"] [data-ag-option]').evaluateAll((labels) =>
      labels.map((label) => {
        const input = label.querySelector('input')!.getBoundingClientRect();
        const range = document.createRange();
        const text = [...label.childNodes].find((n) => n.nodeType === Node.TEXT_NODE)!;
        range.selectNodeContents(text);
        const t = range.getBoundingClientRect();
        return { inputLeft: input.left, textRight: t.right };
      }));
    expect(sides).toHaveLength(4);
    for (const s of sides) expect(s.inputLeft, 'control at inline-start in RTL').toBeGreaterThanOrEqual(s.textRight - 1);
    const radios = page.locator('[data-ag-pref="transparency"] input[type="radio"]');
    await radios.nth(0).focus();
    await apg.keyboard(page, [
      { press: 'ArrowDown', expectFocus: 'role=radio[name=Glass]' },
      { press: 'ArrowDown', expectFocus: 'role=radio[name=Tinted]' },
      { press: 'ArrowUp', expectFocus: 'role=radio[name=Glass]' },
    ]);
    await apg.axe(page);
  });

  test('contrast lock under OS Increase Contrast: Standard aria-disabled, focusable, described, inert', async ({ page }) => {
    await page.emulateMedia({ contrast: 'more' });
    await goto_(page);
    const standard = page.locator('[data-ag-pref="contrast"] [data-ag-option]', { hasText: 'Standard' }).locator('input');
    await expect(standard).toHaveAttribute('aria-disabled', 'true');
    const noteId = await standard.getAttribute('aria-describedby');
    expect(noteId, 'locked option is described by its floor note').toBeTruthy();
    await expect(page.locator(`[id="${noteId}"]`)).toContainText('Increase Contrast');
    await standard.focus();
    await expect(standard).toBeFocused();
    await page.keyboard.press('Space');
    await expect(standard).not.toBeChecked();
    const more = page.locator('[data-ag-pref="contrast"] [data-ag-option]', { hasText: 'More' }).locator('input');
    await expect(more).not.toHaveAttribute('aria-disabled', 'true');
  });

  test('axe on the panel story', async ({ page }) => {
    await goto_(page);
    await apg.axe(page);
  });
});
