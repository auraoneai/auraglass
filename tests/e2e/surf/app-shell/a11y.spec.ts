// a11y.spec.ts — SURF-032/105/120: axe scan + focus-not-obscured over every SURF shell subject. Remote lane (3 engines where required); absent
// subjects fail the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('app-shell a11y (SURF-032/105/120)', () => {
  test('axe-clean shell subjects', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects').toBeGreaterThan(0);
    const { AxeBuilder } = await import('@axe-core/playwright');
    for (const s of subjects.filter((x) => ['AppShell','Sidebar','TopBar','StatusBar','MobileShell','Inspector','ResizablePanels'].includes(x.subject))) {
      await test.step(s.id, async () => {
        await gotoStory(page, s.id);
        const res = await new AxeBuilder({ page }).analyze();
        expect(res.violations).toEqual([]);
      });
    }
  });

  // REQ-SURF-36: iterate EVERY focusable element in Main (no first-element
  // sample, no early return when none exist); each focused element must sit
  // fully below the sticky/overlay top bar.
  test('focus is not obscured by sticky chrome', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 600 });
    await gotoStory(page, 'surf-app-shell--overlay-top-bar');
    const r = await page.evaluate(() => {
      const bar = document.querySelector<HTMLElement>('.ag-app-shell .ag-top-bar');
      const els = [...document.querySelectorAll<HTMLElement>('.ag-app-shell main :is(a[href], button, [tabindex]:not([tabindex="-1"]))')];
      const bad: string[] = [];
      for (const el of els) {
        el.focus();
        if (bar && el.getBoundingClientRect().top < bar.getBoundingClientRect().bottom) bad.push(el.textContent ?? '');
      }
      return { bar: !!bar, count: els.length, bad };
    });
    expect(r.bar).toBe(true);
    expect(r.count).toBeGreaterThan(0);
    expect(r.bad).toEqual([]);
  });

  // REQ-SURF-18: the SkipLink is the first focusable element, hidden until
  // :focus-visible, and Enter moves focus to <main> (its href is the shell's
  // useId-derived main id).
  test('skip link focuses main', async ({ page, browserName }) => {
    await gotoStory(page, 'surf-app-shell--skip-link');
    const skip = page.locator('.ag-app-shell [data-ag-slot="skip"]');
    const main = page.locator('.ag-app-shell main');
    await expect(skip).toHaveCount(1);
    await expect(main).toHaveCount(1);
    const clip = () => skip.evaluate((el) => getComputedStyle(el).clipPath);
    expect(await clip()).not.toBe('none');
    // WebKit only tabs to links with Alt (macOS "tab to links" default).
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    await expect(skip).toBeFocused();
    expect(await clip()).toBe('none');
    const mainId = await main.getAttribute('id');
    expect(mainId).toMatch(/^ag-main-/);
    expect(await skip.getAttribute('href')).toBe(`#${mainId}`);
    await page.keyboard.press('Enter');
    await expect(main).toBeFocused();
  });

  // REQ-SURF-26: landmark names are unique on every AppShell story (axe
  // landmark-unique = 0), and the full chrome has exactly one complementary
  // landmark (Inspector) — the Sidebar container is not a landmark.
  for (const story of ['default', 'skip-link', 'scroll-ownership', 'full-chrome', 'brand-chrome-a', 'page-header-wrap']) {
    test(`axe landmark-unique = 0: ${story}`, async ({ page }) => {
      await gotoStory(page, `surf-app-shell--${story}`);
      await expect(page.locator('.ag-app-shell')).toHaveCount(1);
      const { AxeBuilder } = await import('@axe-core/playwright');
      const res = await new AxeBuilder({ page })
        .include('.ag-app-shell')
        .withRules(['landmark-unique', 'landmark-no-duplicate-banner', 'landmark-no-duplicate-main', 'landmark-complementary-is-top-level'])
        .analyze();
      expect(res.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  }

  test('full chrome: one complementary landmark, labelled navigation only', async ({ page }) => {
    // At 1440 the bottom TabBar ('Sections') is display:none (compact only),
    // so the exposed navigation landmarks are the sidebar Nav alone.
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, 'surf-app-shell--full-chrome');
    await expect(page.getByRole('complementary')).toHaveCount(1);
    await expect(page.getByRole('complementary')).toHaveAccessibleName('Details');
    const navs = await page.getByRole('navigation').evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')).sort());
    expect(navs).toEqual(['Primary']);
  });

  test('splitter target size (SURF-45): ::before hit box >=24px fine, >=44px coarse', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ResizablePanels' && s.id.endsWith('--default'));
    if (!subject) throw new Error('ResizablePanels --default story not registered');
    await gotoStory(page, subject.id);
    const boxes = await page.evaluate(() => {
      const handle = document.querySelector<HTMLElement>('[data-ag-part="resize-handle"]');
      if (!handle) throw new Error('no resize handle rendered');
      // Locate the shipped ::before rules (fine = top level, coarse = inside
      // @media (pointer: coarse)) in the loaded stylesheets.
      let fine: string | null = null;
      let coarse: string | null = null;
      const walk = (rules: CSSRuleList, inCoarse: boolean) => {
        for (const r of Array.from(rules)) {
          if (r instanceof CSSStyleRule && r.selectorText === '.ag-panels__handle::before') {
            const v = r.style.getPropertyValue('inset');
            if (inCoarse) coarse = v;
            else fine = v;
          } else if (r instanceof CSSMediaRule) {
            walk(r.cssRules, inCoarse || /pointer:\s*coarse/.test(r.conditionText));
          } else if ('cssRules' in r && (r as CSSGroupingRule).cssRules) {
            walk((r as CSSGroupingRule).cssRules, inCoarse);
          }
        }
      };
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          walk(sheet.cssRules, false);
        } catch {
          /* cross-origin sheet */
        }
      }
      if (!fine || !coarse) throw new Error(`hit-area rules missing (fine=${fine}, coarse=${coarse})`);
      // Resolve each inset in the handle's own context with a positioned probe
      // (same containing block and custom properties as the pseudo-element).
      const measure = (inset: string) => {
        const probe = document.createElement('span');
        probe.style.position = 'absolute';
        probe.style.setProperty('inset', inset);
        handle.appendChild(probe);
        const r = probe.getBoundingClientRect();
        probe.remove();
        return { w: r.width, h: r.height };
      };
      const pseudo = getComputedStyle(handle, '::before');
      return {
        fine: measure(fine),
        coarse: measure(coarse),
        livePseudo: { position: pseudo.position, content: pseudo.content },
        handleWidth: handle.getBoundingClientRect().width,
      };
    });
    expect(boxes.livePseudo.position).toBe('absolute');
    expect(boxes.livePseudo.content).not.toBe('none');
    // the visual line stays 1 px; only the pseudo hit area grows
    expect(boxes.handleWidth).toBeLessThanOrEqual(1.5);
    expect(boxes.fine.w).toBeGreaterThanOrEqual(24);
    expect(boxes.coarse.w).toBeGreaterThanOrEqual(44);
  });
});

// REQ-SURF-52 (REQ-FIN-82): coarse-pointer tab bar items are >= 44x44.
test.describe('SURF tab bar target size', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test('tab bar target size: every [data-ag-part=tab-bar-item] is >= 44x44', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id === 'surf-tab-bar--default');
    if (!subject) throw new Error('surf-tab-bar--default subject not registered');
    await gotoStory(page, subject.id);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    const boxes = await page.$$eval('[data-ag-part="tab-bar-item"]', (els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height };
      }),
    );
    expect(boxes.length).toBe(3);
    expect(boxes.filter((b) => b.w < 44 || b.h < 44)).toEqual([]);
  });
});
