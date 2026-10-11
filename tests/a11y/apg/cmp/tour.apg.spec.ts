/* CMP-359 (lane 3i-Q). Tour APG: Start tour; Next/Back/Skip by keyboard; each
   step is a dialog labelled by its title; Escape ends the tour and focus returns
   to the element focused before start; popup stays within a 390px viewport. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('tour APG (CMP-359)', () => {
  test('keyboard tour: steps are labelled dialogs; Escape restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStory(page, 'core-tour--start-tour');
    const start = page.getByRole('button', { name: 'Start tour' });
    await start.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('[data-ag-part="step"][role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName('Welcome');

    // popup stays inside a 390px viewport
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390 + 1);

    // Next by keyboard advances to the second (last) step.
    const next = dialog.getByRole('button', { name: 'Next' });
    await expect(next).toBeVisible();
    await next.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toHaveAccessibleName('Second step');
    await expect(dialog.getByRole('button', { name: 'Done' })).toBeVisible();

    // Back by keyboard returns to the first step.
    const back = dialog.getByRole('button', { name: 'Back' });
    await back.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toHaveAccessibleName('Welcome');

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    // focus returns to the element focused before start
    await expect(start).toBeFocused();

    // Skip by keyboard also ends the tour and restores focus.
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    const skip = dialog.getByRole('button', { name: 'Skip' });
    await skip.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toHaveCount(0);
    await expect(start).toBeFocused();
    await apg.axe(page);
  });
});
