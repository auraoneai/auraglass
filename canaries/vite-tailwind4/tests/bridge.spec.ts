/* REQ-PLAT-75: the built css proves the bridge works — a Tailwind utility on a
   Button wins over the ag component styles without !important. Runs on the
   output of `vite build` (dist/assets/*.css) plus, when a preview server is
   up, the computed style of the rendered button. */
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(__dirname, '..', 'dist');
const builtCss = () =>
  readdirSync(join(DIST, 'assets'))
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(DIST, 'assets', f), 'utf8'))
    .join('\n');

test.describe('vite-tailwind4 bridge (REQ-PLAT-75)', () => {
  test('built css contains a .bg-red-500 rule with no !important', () => {
    expect(existsSync(join(DIST, 'assets')), 'vite build must run first').toBe(true);
    const css = builtCss();
    const rule = css.match(/\.bg-red-500\s*\{([^}]*)\}/);
    expect(rule, '.bg-red-500 rule missing from built css').toBeTruthy();
    expect(rule![1]).not.toContain('!important');
    expect(rule![1]).toContain('background-color');
  });

  test('built css carries the ag layer ordering so utilities win', () => {
    const css = builtCss();
    expect(css).toContain('@layer');
    /* tailwind emits the theme/base/components/utilities layer statement; the
       bridge's ag styles land in their own ag.* layers, so a plain utility
       rule outranks component styles in the cascade. */
    const utilityIdx = css.indexOf('.bg-red-500');
    const agComponentIdx = css.search(/@layer\s+ag\./);
    expect(utilityIdx).toBeGreaterThan(-1);
    expect(agComponentIdx).toBeGreaterThan(-1);
    expect(utilityIdx).toBeGreaterThan(agComponentIdx);
  });

  test('button computed background is red without !important', async ({ page }) => {
    await page.goto('/');
    const bg = await page.evaluate(() => {
      const b = document.querySelector('button');
      return b ? getComputedStyle(b).backgroundColor : 'missing';
    });
    expect(bg).toBe('rgb(255, 0, 0)');
  });
});
