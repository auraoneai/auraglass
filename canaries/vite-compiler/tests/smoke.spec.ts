/* REQ-PLAT-72 / PLAT-293: vite + babel-plugin-react-compiler 'infer' canary.
   The production build must (1) actually run the compiler over the canary's
   sources with 0 non-success events, (2) contain compiler output, and (3)
   render the flagship Surface/Button with 0 console errors, a working click
   handler and a ref-as-prop that resolves to the <button>. */
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

test.describe('vite-compiler canary', () => {
  test('the compiler ran over the canary sources with 0 non-success events', () => {
    const events = JSON.parse(readFileSync(`${DIST}compiler-events.json`, 'utf8')) as Array<{
      filename: string | null; kind?: string; reason?: string;
    }>;
    const own = events.filter((e) => (e.filename ?? '').includes('/src/main.tsx'));
    expect(own.some((e) => e.kind === 'CompileSuccess')).toBe(true);
    expect(events.filter((e) => e.kind !== 'CompileSuccess')).toEqual([]);
  });

  test('the bundle contains React Compiler output', () => {
    const assets = readdirSync(`${DIST}assets`).filter((f) => f.endsWith('.js'));
    expect(assets.length).toBeGreaterThan(0);
    const code = assets.map((f) => readFileSync(`${DIST}assets/${f}`, 'utf8')).join('\n');
    expect(code).toContain('react.memo_cache_sentinel');
  });

  test('flagship imports render clean, handle clicks and resolve a ref prop', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('/');
    const btn = page.getByRole('button', { name: /clicks/ });
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('clicks 0');
    await btn.click();
    await expect(btn).toContainText('clicks 1');
    await expect(page.getByTestId('button-ref')).toHaveText('button');
    expect(errors).toEqual([]);
  });
});
