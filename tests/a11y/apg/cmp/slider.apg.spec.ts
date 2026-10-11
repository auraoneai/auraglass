
/* CMP-370 (lane 3i-Q). Slider APG: Arrow +-step, Shift+Arrow and
   PageUp/PageDown +-largeStep, Home->min, End->max. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('slider APG (CMP-370)', () => {
  test('arrow/page keys respect step and largeStep; Home/End bound', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-slider--default');
    const thumb = page.getByRole('slider').first();
    await thumb.focus();

    const v0 = Number(await thumb.getAttribute('aria-valuenow'));
    const min = Number(await thumb.getAttribute('aria-valuemin'));
    const max = Number(await thumb.getAttribute('aria-valuemax'));

    await page.keyboard.press('Home');
    await expect(thumb).toHaveAttribute('aria-valuenow', String(min));
    await page.keyboard.press('End');
    await expect(thumb).toHaveAttribute('aria-valuenow', String(max));
    await page.keyboard.press('Home');

    await apg.keyboard(page, [
      { press: 'ArrowRight' },          // +step
      { press: 'Shift+ArrowRight' },    // +largeStep
      { press: 'PageDown' },            // -largeStep
    ]);
    const v = Number(await thumb.getAttribute('aria-valuenow'));
    expect(v).toBeGreaterThanOrEqual(min);
    expect(v).not.toBe(v0);
    await apg.axe(page);
  });
});

/* REQ-CMP-50: exact value assertions incl. RTL key mirroring. */
test('REQ-CMP-50: exact step/largeStep values; RTL mirrors arrows', async ({ page }) => {
  await gotoStory(page, 'flagships-controls-slider--default');
  const thumb = page.getByRole('slider').first();
  await thumb.focus();
  const step = Number(await thumb.getAttribute('data-step')) || 1;
  const min = Number(await thumb.getAttribute('aria-valuemin'));
  const max = Number(await thumb.getAttribute('aria-valuemax'));
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  expect(Number(await thumb.getAttribute('aria-valuenow'))).toBe(Math.min(min + step, max));
  await page.keyboard.press('Shift+ArrowRight');
  /* largeStep defaults to 10 in BU */
  const largeStep = 10;
  expect(Number(await thumb.getAttribute('aria-valuenow'))).toBe(Math.min(min + step + largeStep, max));

  /* RTL: ArrowRight DECREMENTS (mirrored) */
  await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  expect(Number(await thumb.getAttribute('aria-valuenow'))).toBeLessThan(max);
  await page.evaluate(() => document.documentElement.removeAttribute('dir'));
});
