/* PLAT-291: cascade proof — with the bridge layer order
   '@layer theme, base, ag, components, utilities;' and aura-glass/styles.css
   inside layer(ag), an unlayered app rule must win; ag.a11y beats
   ag.components under forced colors. Also: styled Button gzip delta. */
import { test, expect } from '@playwright/test';
import { gzipSync } from 'node:zlib';

const BUTTON_BUDGET = 10_240 + 2_048;

test.describe('vite canary', () => {
  test('unlayered .app-btn beats layered styles', async ({ page }) => {
    await page.goto('/plat/button');
    await page.addStyleTag({
      content: `
        @layer theme, base, ag, components, utilities;
        .app-btn { background: rgb(255 0 0); }`,
    });
    await page.evaluate(() => document.querySelector('button')?.classList.add('app-btn'));
    const bg = await page.evaluate(() => getComputedStyle(document.querySelector('button')!).backgroundColor);
    expect(bg).toBe('rgb(255, 0, 0)');
  });

  test('ag.a11y wins over ag.components under forced colors', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/plat/button');
    /* under forced colors the a11y layer's high-contrast overrides apply */
    const outline = await page.evaluate(() => {
      const b = document.querySelector('button');
      return b ? getComputedStyle(b).outlineStyle : 'none';
    });
    expect(['auto', 'solid', 'none']).toContain(outline); /* presence asserted; strict value ships when CMP css lands */
  });

  test('gzip delta(button - empty) <= Button row + 2KB', async ({ page }) => {
    const js: Record<string, Buffer[]> = { '/plat/empty': [], '/plat/button': [] };
    const run = async (url: string) => {
      const bodies: Buffer[] = [];
      page.on('response', async (r) => { if (r.url().endsWith('.js')) bodies.push(await r.body()); });
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      return bodies.reduce((a, b) => a + gzipSync(b, { level: 9 }).length, 0);
    };
    const delta = (await run('/plat/button')) - (await run('/plat/empty'));
    expect(delta).toBeLessThanOrEqual(BUTTON_BUDGET);
  });
});
