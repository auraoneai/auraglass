/* tests/dx/plain-css.spec.ts — PLAT-381 (REQ-PLAT-101, FIN-162). Remote only
   (GitLab plat:test:docs, Playwright image), run with
   `npx playwright test -c tests/dx/plain-css.playwright.config.ts`
   after plat:build:dist (needs dist/).

   Verifies the plain-css guide's central claim on the built package: an
   unlayered app rule `.cta[data-ag-part="root"] { border-radius: 0 }` on
   <Button className="cta"> beats the library's layered styles, computing
   0px on every corner, with no !important anywhere — while the same Button
   without the class keeps the library radius (so the override, not missing
   CSS, is what produced 0px). */
import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pkgRequire = createRequire(join(ROOT, 'package.json'));
const APP_CSS = '.cta[data-ag-part="root"] {\n  border-radius: 0;\n}';

/** The built stylesheet and Button, resolved through the package's own exports map. */
async function builtPackage(): Promise<{ css: string; markup: string }> {
  const cssPath = pkgRequire.resolve('aura-glass/styles.css');
  if (!existsSync(cssPath)) throw new Error(`${cssPath} missing — this spec needs the plat:build:dist artifact (dist/)`);
  // Node resolution through the package's self-reference (exports map → dist/), not the
  // tsconfig `paths` alias to src/, so this is the built Button consumers get.
  const entry = pkgRequire.resolve('aura-glass');
  if (!entry.includes(`${join(ROOT, 'dist')}`)) throw new Error(`aura-glass resolved to ${entry}, expected dist/`);
  const { Button } = (await import(pathToFileURL(entry).href)) as { Button: React.ComponentType<{ className?: string; children?: React.ReactNode }> };
  const markup = renderToStaticMarkup(
    React.createElement('main', null,
      React.createElement(Button, { className: 'cta' }, 'Create account'),
      React.createElement(Button, null, 'Cancel')),
  );
  return { css: readFileSync(cssPath, 'utf8'), markup };
}

test.describe('plain-css guide: unlayered app CSS wins (REQ-PLAT-101)', () => {
  test('shipped styles.css starts with the layer statement and has no !important', async () => {
    const { css } = await builtPackage();
    expect(css.trimStart().startsWith('@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;')).toBe(true);
    expect(css).not.toMatch(/!\s*important/i);
  });

  test('.cta[data-ag-part="root"] { border-radius: 0 } on <Button className="cta"> computes 0px', async ({ page }) => {
    const { css, markup } = await builtPackage();
    expect(markup).toContain('data-ag-part="root"');
    await page.setContent(`<!doctype html><html><head><style>${css}</style><style>${APP_CSS}</style></head><body>${markup}</body></html>`);

    const cta = page.getByRole('button', { name: 'Create account' });
    const plain = page.getByRole('button', { name: 'Cancel' });
    await expect(cta).toHaveAttribute('data-ag-part', 'root');
    await expect(cta).toHaveClass(/\bcta\b/);

    const radii = (el: Element) => {
      const s = getComputedStyle(el);
      return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
    };
    expect(await cta.evaluate(radii)).toEqual(['0px', '0px', '0px', '0px']);
    // Control: without the app class the library's layered radius applies.
    expect((await plain.evaluate(radii)).every((r) => r !== '0px')).toBe(true);

    // 0 !important in every stylesheet the page loaded (library + app).
    const importantCount = await page.evaluate(() => {
      let n = 0;
      const walk = (rules: CSSRuleList) => {
        for (const r of Array.from(rules)) {
          if (r instanceof CSSStyleRule) {
            for (let i = 0; i < r.style.length; i++) if (r.style.getPropertyPriority(r.style.item(i)) === 'important') n++;
          }
          if ('cssRules' in r && (r as CSSGroupingRule).cssRules) walk((r as CSSGroupingRule).cssRules);
        }
      };
      for (const sheet of Array.from(document.styleSheets)) walk(sheet.cssRules);
      return n;
    });
    expect(importantCount).toBe(0);
  });
});
