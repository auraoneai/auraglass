// SURF-013/033/044 — app-shell layout: grid geometry, container-query
// breakpoints, and resizable tracks across engines. Static half asserts the
// CSS contract locally; dynamic half runs on the remote browser lane.
import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { listSubjects, gotoStory } from '../../../helpers';

const CSS = join(__dirname, '../../../src/app-shell/app-shell.css');
const SHELL_CSS = join(__dirname, '../../../../src/app-shell/app-shell.css');
const SHELL_STORIES = ['default', 'rtl', 'reduced-transparency', 'forced-colors', 'skip-link', 'scroll-ownership'];

test.describe('app-shell layout (SURF-013/033/044)', () => {
  test('css contract: grid areas, breakpoints, no !important', () => {
    if (!existsSync(CSS)) { console.warn('app-shell.css absent — pending'); return; }
    const css = readFileSync(CSS, 'utf8');
    expect(css).toContain("grid-template-areas");
    expect(css).toContain('600');
    expect(css).toContain('1024');
    expect(css).toContain('1440');
    expect(css).not.toMatch(/!important/);
    expect(css).not.toMatch(/will-change|transform:\s|contain:\s*paint/);
    expect(css).toContain('overscroll-behavior');
  });

  test('shell renders grid tracks at desktop size', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) { console.warn('AppShell subject not registered — pending'); return; }
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, subject.id);
    const cols = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.ag-app-shell')!).gridTemplateColumns.split(' ').length,
    );
    expect(cols).toBe(3);
  });

  test('compact layout under 600px shows bottom tab bar', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MobileShell' );
    if (!subject) { console.warn('no shell subject — pending'); return; }
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject.id);
    const tabBar = page.locator('[data-ag-part="tab-bar"]');
    await expect(tabBar.first()).toBeVisible();
  });

  // REQ-SURF-19: Main is the only frame scroll container in every AppShell story.
  for (const story of SHELL_STORIES) {
    test(`main owns scroll: ${story}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await gotoStory(page, `surf-app-shell--${story}`);
      const r = await page.evaluate(() => ({
        doc: document.scrollingElement!.scrollHeight,
        inner: window.innerHeight,
        mainOverflow: getComputedStyle(document.querySelector('.ag-app-shell main')!).overflowY,
        mainOverscroll: getComputedStyle(document.querySelector('.ag-app-shell main')!).overscrollBehaviorY,
      }));
      expect(r.doc).toBeLessThanOrEqual(r.inner);
      expect({ overflow: r.mainOverflow, overscroll: r.mainOverscroll }).toEqual({ overflow: 'auto', overscroll: 'contain' });
    });
  }

  test('main owns scroll: overflowing main, sidebar and inspector content scroll themselves', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, 'surf-app-shell--scroll-ownership');
    const main = page.locator('.ag-app-shell main');
    await main.hover();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => main.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    const r = await page.evaluate(() => {
      const q = (s: string) => document.querySelector<HTMLElement>(s)!;
      const box = (el: HTMLElement) => ({
        scrolls: el.scrollHeight > el.clientHeight,
        overflowY: getComputedStyle(el).overflowY,
        overscroll: getComputedStyle(el).overscrollBehaviorY,
      });
      return {
        doc: document.scrollingElement!.scrollHeight <= window.innerHeight,
        windowY: window.scrollY,
        main: box(q('.ag-app-shell main')),
        sidebar: box(q('[data-ag-part="sidebar-content"]')),
        inspector: box(q('[data-ag-part="inspector-content"]')),
      };
    });
    const own = { scrolls: true, overflowY: 'auto', overscroll: 'contain' };
    expect(r).toEqual({ doc: true, windowY: 0, main: own, sidebar: own, inspector: own });
  });

  // REQ-SURF-19: CSS env() override fixture. Headless engines report 0 for
  // every safe-area inset, so the fixture loads the real app-shell.css with
  // env(safe-area-inset-*) rewritten to distinct per-edge test variables and
  // asserts which element pads which edge, at wide and compact widths.
  for (const width of [1440, 375]) {
    test(`safe-area env fixture at ${width}px`, async ({ page }) => {
      const css = readFileSync(SHELL_CSS, 'utf8');
      const rewritten = css.replace(/env\(safe-area-inset-(top|right|bottom|left)\)/g, 'var(--ag-test-safe-$1)');
      expect(rewritten).not.toMatch(/env\(safe-area-inset-/);
      await page.setViewportSize({ width, height: 800 });
      await page.setContent(`<!doctype html><html><head><style>
        html, body { margin: 0; }
        :root { --ag-test-safe-top: 11px; --ag-test-safe-right: 13px; --ag-test-safe-bottom: 17px; --ag-test-safe-left: 19px; }
      </style><style>${rewritten}</style></head><body>
        <div class="ag-app-shell" data-ag-part="root" data-ag-layout="auto" data-ag-sidebar="expanded" data-ag-inspector="closed" data-ag-sidebar-side="start">
          <a data-ag-slot="skip" href="#m">Skip to content</a>
          <header data-ag-slot="top">Top</header>
          <main data-ag-slot="main" id="m" tabindex="-1">Main</main>
          <nav data-ag-slot="tabbar" data-ag-placement="overlay" aria-label="Tabs">Tabs</nav>
        </div></body></html>`);
      const r = await page.evaluate(() => {
        const root = getComputedStyle(document.querySelector('.ag-app-shell')!);
        const bar = getComputedStyle(document.querySelector('[data-ag-slot="tabbar"]')!);
        return {
          root: { top: root.paddingTop, right: root.paddingRight, bottom: root.paddingBottom, left: root.paddingLeft },
          overlayBarBottom: bar.paddingBottom,
        };
      });
      expect(r).toEqual({
        root: { top: '11px', right: '13px', bottom: '17px', left: '19px' },
        overlayBarBottom: '17px',
      });
    });
  }
});
