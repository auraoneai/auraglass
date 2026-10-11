/* PLAT-292: vite + Tailwind v4 consumer proof, run against the packed tarball.
   - Tailwind's cascade layers are established in order theme < base <
     components < utilities;
   - bridge @theme colours generate utilities that resolve to the --ag-* tokens;
   - bridge @utility glass-regular emits a real backdrop filter;
   - the Button renders. */
import { test, expect } from '@playwright/test';

test.describe('vite-tailwind4 canary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-ag-canary="plat-tailwind"]');
  });

  test('tailwind layers are ordered theme < base < components < utilities', async ({ page }) => {
    /* layer order = order of first declaration (statement or block) */
    const order = await page.evaluate(() => {
      const seen: string[] = [];
      const add = (n: string) => { if (!seen.includes(n)) seen.push(n); };
      for (const sheet of Array.from(document.styleSheets)) {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof CSSLayerStatementRule) rule.nameList.forEach(add);
          else if (rule instanceof CSSLayerBlockRule && rule.name) add(rule.name);
        }
      }
      return seen;
    });
    const idx = ['theme', 'base', 'components', 'utilities'].map((n) => order.indexOf(n));
    expect(idx.every((i) => i >= 0), `layers seen: ${order.join(', ')}`).toBe(true);
    expect([...idx].sort((a, b) => a - b)).toEqual(idx);
  });

  test('bridge colour utility resolves to the --ag-color-accent token', async ({ page }) => {
    const { bg, token } = await page.evaluate(() => {
      const el = document.querySelector('[data-ag-canary="bridge-accent"]')!;
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'var(--ag-color-accent)';
      document.body.appendChild(probe);
      const token = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { bg: getComputedStyle(el).backgroundColor, token };
    });
    expect(token).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).toBe(token);
  });

  test('bridge glass-regular utility applies a backdrop blur', async ({ page }) => {
    const filter = await page.evaluate(() => {
      const el = document.querySelector('[data-ag-canary="bridge-glass"]')!;
      const cs = getComputedStyle(el);
      return cs.backdropFilter || cs.getPropertyValue('-webkit-backdrop-filter');
    });
    expect(filter).toContain('blur(20px)');
  });

  test('Button renders', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'tailwind4' })).toBeVisible();
  });
});
