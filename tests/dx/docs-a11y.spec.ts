/* tests/dx/docs-a11y.spec.ts — REQ-PLAT-102 (REQ-FIN-43), PLAT-384 / DX-114.
   Remote only (tests/dx/docs.playwright.config.ts; projects a11y-chromium and
   a11y-webkit). For EVERY route of the static export apps/docs/out:
     - axe (@axe-core/playwright, colour-contrast ON) at 1440×900 and at
       390×844: 0 serious/critical violations;
     - at 390×844 no page-level horizontal overflow (scrollWidth <= innerWidth);
   plus site-wide behaviour checks on the home page and one long page:
     - the first Tab stop is a skip link whose target exists and receives focus;
     - every keyboard focus stop shows a visible focus indicator;
     - scrollable code regions are focusable (role=region, tabindex=0, label);
     - prefers-reduced-motion: reduce → no running animation/transition
       longer than 0.01 s;
     - prefers-reduced-transparency: reduce (Chromium, CDP media feature;
       WebKit cannot emulate it) → no element keeps a backdrop-filter.
   Evidence: axe JSON per route and 390 screenshots attached to the report. */
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { routesFromOut } from '../../scripts/docs/verify-markdown-links.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'apps', 'docs', 'out');
if (!existsSync(OUT)) throw new Error(`${OUT} missing — plat:test:docs needs the plat:build:docs artifacts`);

const ROUTES = [...routesFromOut(OUT).keys()].filter((r) => r !== '/404' && r !== '/_not-found').sort();
if (ROUTES.length === 0) throw new Error('apps/docs/out has no HTML routes');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;
const BLOCKING = new Set(['serious', 'critical']);
/* Two probe pages for the behaviour checks: home and the longest code-bearing page. */
const PROBES = ['/', ROUTES.includes('/plat/migrate/5') ? '/plat/migrate/5' : ROUTES[ROUTES.length - 1]!];

const url = (route: string) => (route === '/' ? './' : `.${route}/`);

async function open(page: Page, route: string) {
  const res = await page.goto(url(route), { waitUntil: 'load' });
  expect(res?.status(), `${route} HTTP status`).toBe(200);
  await page.evaluate(() => document.fonts.ready);
}

for (const vp of VIEWPORTS) {
  test.describe(`axe ${vp.name} ${vp.width}x${vp.height}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });
    for (const route of ROUTES) {
      test(`${route}`, async ({ page }, info) => {
        await open(page, route);
        const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
        await info.attach(`axe-${vp.name}.json`, { body: JSON.stringify(result.violations, null, 2), contentType: 'application/json' });
        const contrastRan = [...result.passes, ...result.violations, ...result.incomplete].some((r) => r.id === 'color-contrast');
        expect(contrastRan, 'color-contrast rule must run').toBe(true);
        const blocking = result.violations.filter((v) => BLOCKING.has(v.impact ?? ''));
        expect(blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
        if (vp.name === 'mobile') {
          await info.attach('390.png', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
          const { scrollWidth, innerWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
          expect(scrollWidth, `${route} page-level horizontal overflow at 390`).toBeLessThanOrEqual(innerWidth);
        }
      });
    }
  });
}

test.describe('site behaviour', () => {
  for (const route of PROBES) {
    test(`skip link is the first Tab stop and moves focus to main content (${route})`, async ({ page }) => {
      await open(page, route);
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => {
        const a = document.activeElement as HTMLAnchorElement | null;
        return a ? { tag: a.tagName, href: a.getAttribute('href') ?? '', text: (a.textContent ?? '').trim() } : null;
      });
      expect(first?.tag).toBe('A');
      expect(first?.href.startsWith('#')).toBe(true);
      expect(first?.text.toLowerCase()).toContain('skip');
      const id = first!.href.slice(1);
      expect(await page.locator(`[id="${id}"]`).count(), `skip target #${id}`).toBe(1);
      await page.keyboard.press('Enter');
      const landed = await page.evaluate((target) => {
        const t = document.getElementById(target);
        const a = document.activeElement;
        return !!t && (a === t || t.contains(a)) && location.hash === `#${target}`;
      }, id);
      expect(landed, 'focus/scroll lands on the skip target').toBe(true);
    });

    test(`every Tab stop has a visible focus indicator (${route})`, async ({ page }) => {
      await open(page, route);
      const missing: string[] = [];
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press('Tab');
        const r = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2;
          const ring = cs.boxShadow !== 'none' && cs.boxShadow !== '';
          return { visible: outline || ring, name: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''} ${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40)}` };
        });
        if (!r) break;
        if (!r.visible) missing.push(r.name);
      }
      expect(missing).toEqual([]);
    });

    test(`scrollable code regions are keyboard-focusable regions (${route})`, async ({ page }) => {
      await open(page, route);
      const bad = await page.evaluate(() =>
        [...document.querySelectorAll('pre')]
          .filter((pre) => {
            const box = pre.parentElement ?? pre;
            return box.scrollWidth > box.clientWidth || pre.scrollWidth > pre.clientWidth;
          })
          .map((pre) => pre.closest('[role="region"]') as HTMLElement | null)
          .filter((r) => !r || r.tabIndex !== 0 || !(r.getAttribute('aria-label') || r.getAttribute('aria-labelledby')))
          .length,
      );
      expect(bad, 'overflowing <pre> without a focusable, labelled region').toBe(0);
    });

    test(`prefers-reduced-motion: reduce stops animations and transitions (${route})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, route);
      const long = await page.evaluate(() =>
        document.getAnimations()
          .filter((a) => a.playState === 'running')
          .map((a) => {
            const t = a.effect?.getComputedTiming();
            return { d: Number(t?.duration ?? 0), it: t?.iterations ?? 1, name: (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty ?? 'animation' };
          })
          .filter((a) => a.d > 10 || a.it === Infinity)
          .map((a) => a.name),
      );
      expect(long).toEqual([]);
    });

    /* Chromium only (config: a11y-webkit has grepInvert for this title) —
       WebKit has no prefers-reduced-transparency media emulation. */
    test(`prefers-reduced-transparency: reduce removes backdrop filters (${route})`, async ({ page, context }) => {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
      await open(page, route);
      const matches = await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches);
      expect(matches, 'CDP media emulation applied').toBe(true);
      const filtered = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('body *')]
          .filter((el) => {
            const cs = getComputedStyle(el) as CSSStyleDeclaration & { webkitBackdropFilter?: string };
            return (!!cs.backdropFilter && cs.backdropFilter !== 'none') || (!!cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none');
          })
          .map((el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? `.${el.className.split(' ')[0]}` : '')),
      );
      expect(filtered).toEqual([]);
    });
  }
});
