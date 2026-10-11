/* MAT-06 (REQ-MAT-06, REQ-FIN-50): nested density. --ag-space-* must rescale
   inside any [data-ag-density] element, not only on <html>. Loads the compiled
   dist/css/tokens.css (produced by `npm run tokens:build` in the job) into a
   blank page and reads computed values in the real engine. Remote L5 lane
   only (tests/e2e/mat row in fragments/lanes/mat.ts); never run on a dev Mac. */
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TOKENS_CSS = readFileSync(join(process.cwd(), 'dist/css/tokens.css'), 'utf8');

const HTML = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>density-nested</title></head>
  <body>
    <div id="root-probe"></div>
    <div data-ag-density="compact">
      <div id="compact-probe"></div>
      <div data-ag-density="regular"><div id="regular-in-compact-probe"></div></div>
    </div>
    <div data-ag-density="spacious"><div id="spacious-probe"></div></div>
  </body>
</html>`;

/** Resolved px of `padding-inline-start: var(<v>)` on the probe (custom props stay unresolved strings otherwise). */
async function spacePx(page: import('@playwright/test').Page, id: string, cssVar: string): Promise<number> {
  return page.evaluate(
    ([probeId, v]) => {
      const el = document.getElementById(probeId)!;
      el.style.paddingInlineStart = `var(${v})`;
      return parseFloat(getComputedStyle(el).paddingInlineStart);
    },
    [id, cssVar] as const,
  );
}

test.describe('nested density (MAT-06)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(HTML);
    await page.addStyleTag({ content: TOKENS_CSS });
  });

  test('nested compact div computes --ag-space-4 to 14px', async ({ page }) => {
    expect(await spacePx(page, 'root-probe', '--ag-space-4')).toBe(16);
    expect(await spacePx(page, 'compact-probe', '--ag-space-4')).toBe(14);
    const density = await page.evaluate(() =>
      getComputedStyle(document.getElementById('compact-probe')!).getPropertyValue('--ag-density').trim(),
    );
    expect(density).toBe('0.875');
  });

  test('spacious and regular-inside-compact rescale every step', async ({ page }) => {
    for (const n of [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16]) {
      expect(await spacePx(page, 'spacious-probe', `--ag-space-${n}`)).toBeCloseTo(n * 4 * 1.125, 3);
      expect(await spacePx(page, 'compact-probe', `--ag-space-${n}`)).toBeCloseTo(n * 4 * 0.875, 3);
      expect(await spacePx(page, 'regular-in-compact-probe', `--ag-space-${n}`)).toBeCloseTo(n * 4, 3);
    }
  });
});
