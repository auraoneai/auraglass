// SURF-013/017/033/044 — app-shell layout: grid geometry, container-query
// breakpoints, and resizable tracks across engines. Static half asserts the
// CSS contract; dynamic half runs on the remote browser lane (Storybook, a
// Vite app without Tailwind, all three engines).
import { test, expect, type Page } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSubjects, gotoStory } from '../../../helpers';

// package.json is "type": "module": Playwright loads specs as ESM, where __dirname is undefined.
const HERE = fileURLToPath(new URL('.', import.meta.url));

const SHELL_CSS = join(HERE, '../../../../src/app-shell/app-shell.css');
const SHELL_STORIES = ['default', 'rtl', 'reduced-transparency', 'forced-colors', 'skip-link', 'scroll-ownership'];

/** Geometry + resolved layout of the first shell on the page (REQ-SURF-17). */
const shellGeometry = (page: Page) =>
  page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('.ag-app-shell')!;
    const frame = root.querySelector<HTMLElement>(':scope > .ag-app-shell__frame');
    const box = (sel: string) => {
      const el = root.querySelector<HTMLElement>(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, width: r.width, height: r.height };
    };
    // Tailwind ships --tw-* custom properties; a shell rendered next to it
    // would not prove the package CSS alone lays it out.
    let tailwindRules = 0;
    for (const sheet of document.styleSheets) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin sheet (none expected in Storybook)
      }
      for (const rule of rules) if (rule.cssText.includes('--tw-')) tailwindRules++;
    }
    return {
      viewport: window.innerWidth,
      rootWidth: root.getBoundingClientRect().width,
      rootDisplay: getComputedStyle(root).display,
      frameDisplay: frame ? getComputedStyle(frame).display : null,
      cssMode: frame ? getComputedStyle(frame).getPropertyValue('--_ag-app-shell-mode').trim() : null,
      dataMode: root.getAttribute('data-mode'),
      sidebarState: root.getAttribute('data-ag-sidebar'),
      sidebar: box('[data-ag-slot="sidebar"]'),
      main: box('[data-ag-slot="main"]'),
      top: box('[data-ag-slot="top"]'),
      tailwindRules,
    };
  });

test.describe('app-shell layout (SURF-013/017/033/044)', () => {
  test('css contract: grid areas, breakpoints, no !important', () => {
    expect(existsSync(SHELL_CSS), 'src/app-shell/app-shell.css must exist').toBe(true);
    const css = readFileSync(SHELL_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(css).toContain('grid-template-areas');
    expect(css).toContain('@container ag-app-shell (width < 600px)');
    expect(css).toContain('@container ag-app-shell (600px <= width < 1024px)');
    expect(css).toContain('@container ag-app-shell (width >= 1440px)');
    expect(css).not.toMatch(/!important/);
    expect(css).not.toMatch(/will-change|transform:\s|contain:\s*paint/);
    expect(css).toContain('overscroll-behavior');
  });

  test('shell renders grid tracks at desktop size', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    expect(subject, 'AppShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, subject!.id);
    const cols = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.ag-app-shell > .ag-app-shell__frame')!).gridTemplateColumns.split(' ').length,
    );
    expect(cols).toBe(3);
  });

  // REQ-SURF-17: at container width >= 1024 the sidebar sits beside Main.
  // Storybook is a Vite app; the assertion also proves no Tailwind is loaded.
  for (const [width, mode] of [
    [1440, 'wide'],
    [1024, 'expanded'],
  ] as const) {
    test(`desktop sidebar beside main at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await gotoStory(page, 'surf-app-shell--default');
      await expect(page.locator('.ag-app-shell')).toHaveAttribute('data-mode', mode);
      const g = await shellGeometry(page);
      expect({
        tailwindRules: g.tailwindRules,
        rootDisplay: g.rootDisplay,
        frameDisplay: g.frameDisplay,
        cssMode: g.cssMode,
        rootWidth: g.rootWidth,
      }).toEqual({ tailwindRules: 0, rootDisplay: 'block', frameDisplay: 'grid', cssMode: mode, rootWidth: width });
      expect(g.sidebar, 'inline sidebar must be laid out').not.toBeNull();
      expect(g.main).not.toBeNull();
      expect(g.top, 'the Default story has a top bar').not.toBeNull();
      expect(g.sidebar!.width).toBeGreaterThan(0);
      expect(g.sidebar!.right).toBeLessThanOrEqual(g.main!.left + 1);
      expect(Math.abs(g.sidebar!.top - g.main!.top)).toBeLessThanOrEqual(g.top!.height);
    });
  }

  // REQ-SURF-17: a 900px shell in a 1920px viewport resolves medium — the
  // container decides, not the window.
  test('layout follows container not viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await gotoStory(page, 'surf-app-shell--container-playground');
    await expect(page.locator('.ag-app-shell')).toHaveAttribute('data-mode', 'medium');
    const g = await shellGeometry(page);
    expect({ viewport: g.viewport, rootWidth: g.rootWidth, cssMode: g.cssMode, sidebarState: g.sidebarState, tailwindRules: g.tailwindRules }).toEqual({
      viewport: 1920,
      rootWidth: 900,
      cssMode: 'medium',
      sidebarState: 'expanded',
      tailwindRules: 0,
    });
    // Medium renders the stored 'expanded' sidebar at the rail width (4rem).
    const rail = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize) * 4);
    expect(g.sidebar).not.toBeNull();
    expect(Math.abs(g.sidebar!.width - rail)).toBeLessThanOrEqual(1);
    expect(g.sidebar!.right).toBeLessThanOrEqual(g.main!.left + 1);
  });

  test('compact layout under 600px shows bottom tab bar', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MobileShell');
    expect(subject, 'MobileShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject!.id);
    const tabBar = page.locator('[data-ag-part="tab-bar"]');
    await expect(tabBar.first()).toBeVisible();
  });

  test('medium forces rail and restores (SURF-031)', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    expect(subject, 'AppShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, subject!.id);
    const shell = page.locator('.ag-app-shell');
    const sidebar = page.locator('.ag-app-shell [data-ag-slot="sidebar"]');
    const sidebarWidth = async () => {
      const box = await sidebar.boundingBox();
      expect(box, 'inline sidebar must be laid out').not.toBeNull();
      return box!.width;
    };
    // 1440: the expanded sidebar is a real column (mode expanded or wide,
    // depending on the story padding around the shell).
    await expect(shell).toHaveAttribute('data-ag-sidebar', 'expanded');
    await expect(shell).toHaveAttribute('data-mode', /^(expanded|wide)$/);
    const expandedWidth = await sidebarWidth();
    expect(expandedWidth).toBeGreaterThan(0);
    // 900: medium resolves; CSS forces the expanded sidebar to the rail width
    // without changing the stored state.
    await page.setViewportSize({ width: 900, height: 700 });
    await expect(shell).toHaveAttribute('data-mode', 'medium');
    await expect(shell).toHaveAttribute('data-ag-sidebar', 'expanded');
    await expect.poll(sidebarWidth).toBeLessThan(expandedWidth);
    // back to 1440: the expanded column is restored at its original width.
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(shell).toHaveAttribute('data-mode', /^(expanded|wide)$/);
    await expect(shell).toHaveAttribute('data-ag-sidebar', 'expanded');
    await expect.poll(sidebarWidth).toBe(expandedWidth);
  });

  test('375: compact hides the inline sidebar (display:none) and main starts at the shell edge (SURF-031)', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    expect(subject, 'AppShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject!.id);
    const shell = page.locator('.ag-app-shell');
    await expect(shell).toHaveAttribute('data-mode', 'compact');
    await expect(shell).toHaveAttribute('data-ag-sidebar', 'expanded');
    expect(await page.locator('.ag-app-shell [data-ag-slot="sidebar"]').boundingBox()).toBeNull();
    const [shellBox, mainBox] = await Promise.all([
      shell.boundingBox(),
      page.locator('.ag-app-shell main').boundingBox(),
    ]);
    expect(shellBox).not.toBeNull();
    expect(mainBox).not.toBeNull();
    expect({ x: mainBox!.x, width: mainBox!.width }).toEqual({ x: shellBox!.x, width: shellBox!.width });
    // Drawer content is not mounted until the drawer is opened.
    await expect(page.locator('[data-ag-part="sidebar-drawer"]')).toHaveCount(0);
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
          <div class="ag-app-shell__frame">
            <a data-ag-slot="skip" href="#m">Skip to content</a>
            <header data-ag-slot="top">Top</header>
            <main data-ag-slot="main" id="m" tabindex="-1">Main</main>
            <nav data-ag-slot="tabbar" data-ag-placement="overlay" aria-label="Tabs">Tabs</nav>
          </div>
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

  // REQ-SURF-24: no promoted layers. Every element of the shell computes
  // transform none and will-change auto at rest, and again after a sidebar
  // toggle under motion=full (the old JS animating flag/timer are gone).
  test('computed-style probe: transform none and willChange auto on every shell element', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, 'surf-app-shell--full-chrome', { motion: 'full' });
    const probe = () =>
      page.evaluate(() => {
        const els = [document.querySelector('.ag-app-shell')!, ...document.querySelectorAll('.ag-app-shell *')];
        const offenders = els
          .map((el) => ({ el, cs: getComputedStyle(el) }))
          .filter(({ cs }) => cs.transform !== 'none' || cs.willChange !== 'auto')
          .map(({ el, cs }) => `${el.tagName.toLowerCase()}[${el.getAttribute('data-ag-part') ?? el.className}] ${cs.transform} ${cs.willChange}`);
        return { count: els.length, offenders, animating: document.querySelector('[data-ag-animating]') !== null };
      });
    const rest = await probe();
    expect(rest.count).toBeGreaterThan(20);
    expect({ offenders: rest.offenders, animating: rest.animating }).toEqual({ offenders: [], animating: false });
    await page.getByRole('button', { name: 'Collapse sidebar' }).click();
    await expect(page.locator('.ag-app-shell')).not.toHaveAttribute('data-ag-sidebar', 'expanded');
    const toggled = await probe();
    expect({ offenders: toggled.offenders, animating: toggled.animating }).toEqual({ offenders: [], animating: false });
  });

  // REQ-SURF-23: under a 600px shell the page-header actions wrap to their
  // own row below the title.
  test('page header actions wrap at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, 'surf-app-shell--page-header-wrap');
    const title = await page.locator('.ag-page-header [data-ag-part="title"]').boundingBox();
    const actions = await page.locator('.ag-page-header [data-ag-part="actions"]').boundingBox();
    expect(title).not.toBeNull();
    expect(actions).not.toBeNull();
    expect(actions!.y).toBeGreaterThanOrEqual(title!.y + title!.height);
  });
});
