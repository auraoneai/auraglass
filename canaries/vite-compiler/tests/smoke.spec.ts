/* REQ-PLAT-72/PLAT-293: vite + babel-plugin-react-compiler 'infer' canary —
   the flagship Surface/Button render must produce zero console errors and a
   visible button. Run by plat:integration:vite when AG_PLAYWRIGHT=1. */
import { test, expect } from '@playwright/test';

test.describe('vite-compiler canary', () => {
  test('flagship imports compile and render clean', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('/');
    const btn = page.getByRole('button');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('clicks 0');
    await btn.click();
    await expect(btn).toContainText('clicks 1');
    expect(errors).toEqual([]);
  });
});
