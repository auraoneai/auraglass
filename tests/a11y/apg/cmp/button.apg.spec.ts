/* CMP-365 (lane 3i-Q) + REQ-CMP-35. Button APG: Enter and Space each fire
   exactly one activation (a real click listener counts); a toggle story
   flips aria-pressed; axe stays clean. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('button APG (CMP-365 / REQ-CMP-35)', () => {
  test('Enter and Space each activate the button exactly once', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--keyboard')
      .catch(() => gotoStory(page, 'flagships-controls-button--default'));
    const btn = page.getByRole('button').first();
    await btn.evaluate((el) => {
      (window as unknown as { __agClicks: number }).__agClicks = 0;
      el.addEventListener('click', () => {
        (window as unknown as { __agClicks: number }).__agClicks += 1;
      });
    });
    await btn.focus();
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => (window as unknown as { __agClicks: number }).__agClicks)).toBe(1);
    await page.keyboard.press('Space');
    expect(await page.evaluate(() => (window as unknown as { __agClicks: number }).__agClicks)).toBe(2);
    await expect(btn).toBeFocused();
    await apg.axe(page);
  });

  test('toggle story flips aria-pressed', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--toggle');
    const btn = page.getByRole('button').first();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await apg.axe(page);
  });
});
