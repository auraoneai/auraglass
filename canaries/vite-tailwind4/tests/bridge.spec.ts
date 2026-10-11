/* REQ-PLAT-75 (+ REQ-PLAT-77 vite-tailwind4 rules): the consumer build proves
   the bridge works against the packed tarball.
   - built css (dist/assets/*.css from `vite build`, run by the playwright
     webServer via scripts/ci/canary-prepare.mjs) carries the bridge-generated
     utilities mapped onto the --ag-* tokens and the ag-dark variant selector;
   - the consumer cascade order TAILWIND_BRIDGE_ORDER is declared, so every
     ag.* layer (including the Button's ag.components rules) sits below
     Tailwind's utilities layer;
   - `bg-red-500` on a Button wins over the ag component/material styles
     without !important (computed style, compared to the utility's own value
     and to an unstyled control Button). */
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/* testDir is <canary>/tests (absolute); works whether the spec loads as ESM or CJS */
const builtCss = () => {
  const assets = join(test.info().project.testDir, '..', 'dist', 'assets');
  expect(existsSync(assets), 'vite build output missing (canary-prepare runs it)').toBe(true);
  const files = readdirSync(assets).filter((f) => f.endsWith('.css'));
  expect(files.length, 'no css emitted by vite build').toBeGreaterThan(0);
  return files.map((f) => readFileSync(join(assets, f), 'utf8')).join('\n');
};
/* body of the first rule whose selector is exactly `selector` (minified or not) */
const ruleBody = (css: string, selector: string): string | null => {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = css.match(new RegExp(`(?:^|[{}\\s;,])${esc}\\s*\\{([^}]*)\\}`));
  return m ? m[1]! : null;
};

test.describe('vite-tailwind4 bridge (REQ-PLAT-75)', () => {
  test('built css contains the bridge utilities mapped onto --ag-* tokens', () => {
    const css = builtCss();
    const expected: Array<[string, string, string]> = [
      ['.bg-canvas', 'background-color', 'var(--ag-color-canvas)'],
      ['.text-on-surface', 'color', 'var(--ag-on-surface)'],
      ['.rounded-md', 'border-radius', 'var(--ag-radius-md)'],
    ];
    for (const [sel, prop, value] of expected) {
      const body = ruleBody(css, sel);
      expect(body, `${sel} rule missing from built css`).not.toBeNull();
      expect(body!.replace(/\s+/g, ''), `${sel} body`).toContain(`${prop}:${value}`);
    }
    /* Tailwind 4 routes shadow utilities through --tw-shadow; the token must
       still be the value of the .shadow-glass rule. */
    const shadow = ruleBody(css, '.shadow-glass');
    expect(shadow, '.shadow-glass rule missing from built css').not.toBeNull();
    expect(shadow!).toContain('var(--ag-surface-shadow)');
    const glass = ruleBody(css, '.glass-regular');
    expect(glass, '.glass-regular rule missing from built css').not.toBeNull();
    expect(glass!).toContain('backdrop-filter');
    expect(glass!).not.toContain('@apply');
    expect(css).toMatch(/\.ag-dark\\:bg-canvas[^{]*\[data-ag-scheme=dark\]/);
  });

  test('built css has a .bg-red-500 rule with no !important', () => {
    const body = ruleBody(builtCss(), '.bg-red-500');
    expect(body, '.bg-red-500 rule missing from built css').not.toBeNull();
    expect(body!).toContain('background-color');
    expect(body!).not.toContain('!important');
  });

  test('cascade follows TAILWIND_BRIDGE_ORDER and the Button rules live in an ag.* layer', async ({ page }) => {
    /* Read from the CSSOM, not the minified text: the minifier may merge or
       re-split @layer statements, while the browser's layer order is what the
       cascade actually uses (order of first declaration of each top-level
       layer). */
    await page.goto('/');
    await page.waitForSelector('[data-ag-canary="plat-tailwind"]');
    const r = await page.evaluate(() => {
      const top: string[] = [];
      const addTop = (full: string) => {
        const head = full.split('.')[0]!;
        if (!top.includes(head)) top.push(head);
      };
      const agButtonLayers: string[] = [];
      const walk = (rules: CSSRuleList, path: string[]) => {
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSLayerStatementRule) {
            for (const n of rule.nameList) if (path.length === 0) addTop(n);
          } else if (rule instanceof CSSLayerBlockRule) {
            if (path.length === 0 && rule.name) addTop(rule.name);
            walk(rule.cssRules, rule.name ? [...path, rule.name] : path);
          } else if (rule instanceof CSSStyleRule) {
            if (/\.ag-button\b/.test(rule.selectorText)) agButtonLayers.push(path.join('.'));
          } else if ('cssRules' in rule) {
            walk((rule as CSSGroupingRule).cssRules, path);
          }
        }
      };
      for (const sheet of Array.from(document.styleSheets)) walk(sheet.cssRules, []);
      return { top, agButtonLayers };
    });
    const idx = ['theme', 'base', 'ag', 'components', 'utilities'].map((n) => r.top.indexOf(n));
    expect(idx.every((i) => i >= 0), `top-level layers seen: ${r.top.join(', ')}`).toBe(true);
    expect([...idx].sort((a, b) => a - b), `top-level layers seen: ${r.top.join(', ')}`).toEqual(idx);
    /* the component styles really are in the bundle (otherwise "wins" is vacuous) */
    expect(r.agButtonLayers.length, '.ag-button rules missing from the page css').toBeGreaterThan(0);
    for (const l of r.agButtonLayers) expect(l.split('.')[0], `.ag-button rule in layer "${l}"`).toBe('ag');
  });

  test('bg-red-500 on a Button wins over the ag styles without !important', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-ag-canary="plat-tailwind"]');
    const r = await page.evaluate(() => {
      const red = document.querySelector<HTMLElement>('[data-ag-canary="bridge-red-button"]');
      const control = document.querySelector<HTMLElement>('[data-ag-canary="bridge-control-button"]');
      const probe = document.createElement('div');
      probe.className = 'bg-red-500';
      document.body.appendChild(probe);
      const utility = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return {
        redIsAgButton: !!red?.classList.contains('ag-button'),
        controlIsAgButton: !!control?.classList.contains('ag-button'),
        red: red ? getComputedStyle(red).backgroundColor : 'missing',
        control: control ? getComputedStyle(control).backgroundColor : 'missing',
        utility,
      };
    });
    expect(r.redIsAgButton, 'Button must render with its .ag-button class').toBe(true);
    expect(r.controlIsAgButton).toBe(true);
    expect(r.utility).not.toBe('rgba(0, 0, 0, 0)');
    expect(r.red).toBe(r.utility);
    expect(r.control, 'control Button must not already be red-500').not.toBe(r.utility);
  });
});
