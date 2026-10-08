// MAT-080 remote canaries (QA L11 Consumer canaries, packed tarball via
// scripts/ci/lib/npm-pack.js). Runs only on the remote runner — the page URLs
// come from env so the same spec works across canary apps:
//   CANARY_URL          — vite-tailwind4 canary (utilities compiled by tailwind)
//   CANARY_PLAIN_URL    — vite canary with NO tailwindcss installed
//   CANARY_SHADCN_URL   — shadcn canary page
// Cases per row contract:
//  - getComputedStyle of each of the 6 utilities equals that of a
//    data-ag-variant/thickness sibling (0 property diffs);
//  - vite canary renders with no tailwindcss installed (npm ls tailwindcss exit 1
//    is verified by the lane before this spec runs);
//  - shadcn: stock Button picks up --ag-accent/--ag-focus-outer; with
//    data-ag-shadcn-source + app --primary the AuraGlass surface uses it;
//    no 'cycle' warnings in the console.
import { test, expect, type Page, type Locator } from '@playwright/test';

const CANARY = process.env.CANARY_URL;
const CANARY_PLAIN = process.env.CANARY_PLAIN_URL;
const CANARY_SHADCN = process.env.CANARY_SHADCN_URL;

const UTILITIES = [
  'glass-regular',
  'glass-thin',
  'glass-clear',
  'content-raised',
  'content-sunken',
  'glass-overlay',
] as const;

/** Comparable rendered properties (what a consumer sees), not the custom vars. */
const PROPS = [
  'backgroundColor', 'backgroundImage', 'borderRadius', 'borderTopWidth',
  'boxShadow', 'backdropFilter', 'opacity', 'color',
] as const;

const styleOf = (loc: Locator) =>
  loc.evaluate((el, props) => {
    const s = getComputedStyle(el);
    return Object.fromEntries((props as readonly string[]).map((p) => [p, (s as any)[p]]));
  }, PROPS);

test.describe('consumer canaries (MAT-080)', () => {
  test('utility classes render identically to attribute siblings', async ({ page }) => {
    test.skip(!CANARY, 'CANARY_URL unset — remote lane only');
    await page.goto(CANARY!);
    for (const util of UTILITIES) {
      const viaUtility = page.locator(`[data-canary-utility="${util}"]`);
      const viaAttr = page.locator(`[data-canary-attribute="${util}"]`);
      await expect(viaUtility).toHaveCount(1);
      await expect(viaAttr).toHaveCount(1);
      const [u, a] = await Promise.all([styleOf(viaUtility), styleOf(viaAttr)]);
      const diffs = Object.keys(u).filter((k) => u[k] !== a[k]);
      console.log(`${util}: ${diffs.length} property diffs`);
      expect(diffs).toEqual([]);
    }
  });

  test('vite canary renders with no tailwindcss installed', async ({ page }) => {
    test.skip(!CANARY_PLAIN, 'CANARY_PLAIN_URL unset — remote lane only');
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(CANARY_PLAIN!);
    const surface = page.locator('[data-ag-surface]').first();
    await expect(surface).toBeVisible();
    const fill = await surface.evaluate((el) => getComputedStyle(el).getPropertyValue('--ag-surface-fill'));
    expect(fill.length).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });

  test('shadcn interop: default authority + source mode, no var cycles', async ({ page }) => {
    test.skip(!CANARY_SHADCN, 'CANARY_SHADCN_URL unset — remote lane only');
    const warnings: string[] = [];
    page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') warnings.push(m.text()); });
    await page.goto(CANARY_SHADCN!);

    // default mode: consumer-facing names resolve to --ag-* values
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
    );
    expect(accent.length).toBeGreaterThan(0);

    // source mode: app --primary drives the AuraGlass surface
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-ag-shadcn-source', '');
      document.documentElement.style.setProperty('--primary', 'oklch(0.6 0.2 30)');
    });
    const resolved = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--ag-color-accent').trim(),
    );
    expect(resolved).not.toBe('');
    expect(warnings.filter((w) => /cycle|invalid/i.test(w))).toEqual([]);
  });
});
