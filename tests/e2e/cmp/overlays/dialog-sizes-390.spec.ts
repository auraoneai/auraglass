/* REQ-CMP-89 (L7). Dialog container-query responsive grid at 390px:
   sm/md popups are 358px (390 - 32, 16px margins each side); lg and
   appearance=wide are bottom-anchored full width. Story: sizes — 4 non-modal
   cells so every size is measurable in one render. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('dialog responsive sizes at 390 (REQ-CMP-89)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStory(page, 'overlays-dialog--sizes');
  });

  test.each(['sm', 'md'] as const)('%s popup is 358px wide', async ({ page }, size) => {
    const popup = page.locator(`[data-ag-size='${size}']`).first();
    await expect(popup).toBeVisible();
    const box = await popup.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.width)).toBe(358);
    expect(Math.round(box!.x)).toBe(16);
  });

  test.each(['lg'] as const)('%s popup is bottom-anchored full width', async ({ page }, size) => {
    const popup = page.locator(`[data-ag-size='${size}']`).first();
    await expect(popup).toBeVisible();
    const box = await popup.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.width)).toBe(390);
    expect(Math.round(box!.y + box!.height)).toBe(844);
  });

  test('appearance=wide popup is bottom-anchored full width', async ({ page }) => {
    const popup = page.locator(`[data-ag-appearance='wide']`).first();
    await expect(popup).toBeVisible();
    const box = await popup.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.width)).toBe(390);
    expect(Math.round(box!.y + box!.height)).toBe(844);
  });
});
