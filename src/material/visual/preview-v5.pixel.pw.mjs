// REQ-MAT-41 / REQ-FIN-57 item 6 (AC-MAT-31): remote pixel check of the 4.3 preview on the
// frozen 4.x consumer fixture (tests/material/fixtures/frozen-4x/, never edited).
//  1. Without data-ag-preview anywhere on the page, loading the generated preview sheet
//     changes 0 pixels: full-page screenshots with and without the sheet are byte-equal.
//  2. Outside the preview subtree the 4.x card is byte-equal with and without the sheet.
//  3. With data-ag-preview="v5", each of the six 4.x primitives' ::before backdrop-filter is
//     the ladders.css cell for its [variant][thickness]; the host carries no filter.
// Runs on chromium, webkit and firefox via playwright.bridge.config.mjs (remote only).
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const FIXTURE = pathToFileURL(join(ROOT, 'tests/material/fixtures/frozen-4x/index.html')).href;
const SHEET = 'preview-v5.css';

const PRIMITIVES = [
  { name: 'OptimizedGlass', variant: 'regular', thickness: 'regular', layer: 'chrome' },
  { name: 'OptimizedGlassCore', variant: 'regular', thickness: 'thin', layer: 'chrome' },
  { name: 'GlassCore', variant: 'regular', thickness: 'thick', layer: 'chrome' },
  { name: 'GlassAdvanced', variant: 'clear', thickness: 'regular', layer: 'overlay' },
  { name: 'OptimizedGlassAdvanced', variant: 'clear', thickness: 'thin', layer: 'overlay' },
  { name: 'LiquidGlassMaterial', variant: 'clear', thickness: 'thick', layer: 'chrome' },
];

/** --_ag-mat-blur / --_ag-mat-saturation of a ladders.css cell (read from the committed file). */
function ladderCell(variant, thickness) {
  const css = readFileSync(join(ROOT, 'src/material/css/ladders.css'), 'utf8');
  const sel = `[data-ag-variant="${variant}"][data-ag-thickness="${thickness}"] {`;
  const at = css.indexOf(`  ${sel}`);
  if (at < 0) throw new Error(`ladders.css has no cell ${sel}`);
  const body = css.slice(at + sel.length + 2, css.indexOf('}', at));
  const get = (p) => {
    const m = new RegExp(`${p}:\\s*([^;]+);`).exec(body);
    if (!m) throw new Error(`ladders.css cell ${sel} has no ${p}`);
    return m[1].trim();
  };
  return { blur: get('--_ag-mat-blur'), saturation: get('--_ag-mat-saturation') };
}

async function settle(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

async function sheetRuleCount(page) {
  return page.evaluate((name) => {
    for (const s of Array.from(document.styleSheets)) if (s.href && s.href.endsWith(name)) return s.cssRules.length;
    return -1;
  }, SHEET);
}

async function dropSheet(page) {
  await page.evaluate((name) => {
    const link = document.querySelector(`link[href$="${name}"]`);
    if (!link) throw new Error('preview sheet link not found');
    link.remove();
  }, SHEET);
  await settle(page);
}

test.describe('frozen 4.x consumer fixture + preview-v5.css', () => {
  test('without data-ag-preview the page is pixel-identical with and without the preview sheet', async ({ page }) => {
    await page.goto(FIXTURE);
    expect(await sheetRuleCount(page)).toBeGreaterThan(0); // the generated sheet really loaded
    await page.evaluate(() => {
      for (const el of Array.from(document.querySelectorAll('[data-ag-preview]'))) el.removeAttribute('data-ag-preview');
    });
    await settle(page);
    const withSheet = await page.screenshot({ fullPage: true, animations: 'disabled' });
    await dropSheet(page);
    const withoutSheet = await page.screenshot({ fullPage: true, animations: 'disabled' });
    expect(withSheet.equals(withoutSheet)).toBe(true);
  });

  test('the 4.x card outside the preview subtree is pixel-identical', async ({ page }) => {
    await page.goto(FIXTURE);
    expect(await sheetRuleCount(page)).toBeGreaterThan(0);
    const card = page.locator('#four-x');
    const withSheet = await card.screenshot({ animations: 'disabled' });
    await dropSheet(page);
    const withoutSheet = await card.screenshot({ animations: 'disabled' });
    expect(withSheet.equals(withoutSheet)).toBe(true);
  });

  test('inside data-ag-preview="v5" the six primitives take the ladders.css cell on ::before', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate((prims) => {
      const root = document.querySelector('[data-ag-preview="v5"]');
      for (const p of prims) {
        const el = document.createElement('div');
        el.id = `prim-${p.name}`;
        el.className = 'ag-surface';
        el.setAttribute('data-ag-surface', p.layer);
        el.setAttribute('data-ag-layer', p.layer);
        el.setAttribute('data-ag-variant', p.variant);
        el.setAttribute('data-ag-thickness', p.thickness);
        el.textContent = p.name;
        el.style.cssText = 'width: 200px; height: 60px; margin-top: 12px;';
        root.appendChild(el);
      }
    }, PRIMITIVES);
    await settle(page);
    for (const p of PRIMITIVES) {
      const cell = ladderCell(p.variant, p.thickness);
      const el = page.locator(`#prim-${p.name}`);
      const before = await el.evaluate((n) => {
        const cs = getComputedStyle(n, '::before');
        return cs.backdropFilter || cs.webkitBackdropFilter;
      });
      expect(before, p.name).toMatch(new RegExp(`^blur\\(${cell.blur}\\) saturate\\(${cell.saturation}\\)`));
      const host = await el.evaluate((n) => {
        const cs = getComputedStyle(n);
        return cs.backdropFilter || cs.webkitBackdropFilter || 'none';
      });
      expect(host, p.name).toBe('none');
    }
  });
});
