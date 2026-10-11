/* vite-compiler canary — proves the React Compiler preset ships a working
   component output: the built page renders a glass element carrying
   data-ag-variant and no console errors. */
import { test, expect } from '@playwright/test';

test('compiler output renders [data-ag-variant]', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await page.waitForSelector('[data-ag-variant]', { timeout: 10000 });
  expect(errors).toEqual([]);
});
