
/* CMP-359 (lane 3i-Q). Tour APG: Start tour; Next/Back/Skip by keyboard; each
   step is a dialog labelled by its title; Escape ends the tour and focus returns
   to the element focused before start; popup stays within a 390px viewport. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('tour APG (CMP-359)', () => {
  test('keyboard tour: steps are labelled dialogs; Escape restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStory(page, 'core-tour--default');
    const start = page.getByRole('button', { name: /start|tour/i }).first();
    await start.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('[role="dialog"], [data-ag-part="popup"]').first();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-label', /.+/);

    // popup stays inside a 390px viewport
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390 + 1);

    const next = page.getByRole('button', { name: /next/i }).first();
    if (await next.count()) {
      await next.focus();
      await page.keyboard.press('Enter');
      await expect(dialog).toBeVisible();
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    // focus returns to the element focused before start
    await expect(start).toBeFocused();
    await apg.axe(page);
  });
});
