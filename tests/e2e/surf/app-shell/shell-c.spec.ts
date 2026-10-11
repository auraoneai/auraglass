// shell-c.spec.ts — REQ-SURF-29/30/36/40 browser acceptance (remote
// Playwright lane only; never run on a developer Mac). Every test targets a
// named AppShell story and fails when its subject is missing: no pending
// early returns.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';

const itemBoxes = (page: Page) =>
  page.locator('.ag-app-shell [data-ag-part="sidebar-item"]').evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 };
    }),
  );

test.describe('app-shell c (REQ-SURF-29/30/36/40)', () => {
  // REQ-SURF-29: every rail item box is >=40x40 under a fine pointer.
  test('rail target size >= 40x40 (fine pointer)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, 'surf-app-shell--rail');
    const boxes = await itemBoxes(page);
    expect(boxes.length).toBe(4);
    expect(boxes.filter((b) => b.w < 40 || b.h < 40)).toEqual([]);
    // names are kept: the label is clipped, not removed.
    await expect(page.getByRole('link', { name: 'Reports' })).toHaveCount(1);
    const display = await page
      .locator('.ag-app-shell [data-ag-part="sidebar-item"] .ag-sidebar__item-label')
      .first()
      .evaluate((el) => getComputedStyle(el).display);
    expect(display).not.toBe('none');
  });

  test.describe('coarse pointer', () => {
    // hasTouch only (isMobile is unsupported on Firefox); the matchMedia
    // assertion below fails loudly if an engine does not report coarse.
    test.use({ hasTouch: true });
    // REQ-SURF-29: >=44x44 under hasTouch / coarse emulation.
    test('rail target size >= 44x44 (coarse pointer)', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 900 });
      await gotoStory(page, 'surf-app-shell--rail');
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
      const boxes = await itemBoxes(page);
      expect(boxes.length).toBe(4);
      expect(boxes.filter((b) => b.w < 44 || b.h < 44)).toEqual([]);
    });
  });

  // REQ-SURF-30: collapsed sidebar is display:none + inert from the server
  // markup, never aria-hidden, and axe aria-hidden-focus reports 0.
  test('collapsed sidebar: display none, inert, axe aria-hidden-focus = 0', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, 'surf-app-shell--collapsed');
    const side = page.locator('.ag-app-shell [data-ag-slot="sidebar"]');
    await expect(side).toHaveCount(1);
    expect(
      await side.evaluate((el) => ({
        display: getComputedStyle(el).display,
        inert: el.hasAttribute('inert'),
        ariaHidden: el.getAttribute('aria-hidden'),
      })),
    ).toEqual({ display: 'none', inert: true, ariaHidden: null });
    const { AxeBuilder } = await import('@axe-core/playwright');
    const res = await new AxeBuilder({ page }).include('.ag-app-shell').withRules(['aria-hidden-focus']).analyze();
    expect(res.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    // keyboard never lands inside the collapsed sidebar.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('[data-ag-slot="sidebar"]'))).toBe(false);
    }
  });

  // REQ-SURF-36: nothing overflows at 320px (long title + center region).
  test('top bar: no horizontal overflow at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await gotoStory(page, 'surf-app-shell--overlay-top-bar');
    const r = await page.evaluate(() => {
      const bar = document.querySelector<HTMLElement>('.ag-app-shell .ag-top-bar')!;
      return {
        doc: document.scrollingElement!.scrollWidth,
        barOverflow: bar.scrollWidth - bar.clientWidth,
        center: getComputedStyle(document.querySelector('.ag-top-bar__center')!).display,
      };
    });
    expect(r.doc).toBeLessThanOrEqual(320);
    expect(r.barOverflow).toBeLessThanOrEqual(0);
    expect(r.center).toBe('none');
  });

  // REQ-SURF-36 'focus not obscured' lives in a11y.spec.ts (overlay-top-bar story).

  // REQ-SURF-40: scrolled to the end, the last item is fully above the
  // overlaying tab bar.
  test('mobile last item visible above the tab bar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, 'surf-app-shell--mobile');
    await expect(page.locator('.ag-app-shell[data-ag-layout="mobile"]')).toHaveCount(1);
    const r = await page.evaluate(() => {
      const main = document.querySelector<HTMLElement>('.ag-app-shell main')!;
      main.scrollTop = main.scrollHeight;
      const last = document.querySelector<HTMLElement>('[data-testid="last-item"]')!.getBoundingClientRect();
      const tab = document.querySelector<HTMLElement>('.ag-app-shell [data-ag-slot="tabbar"]')!.getBoundingClientRect();
      return { lastBottom: last.bottom, tabTop: tab.top, tabHeight: tab.height };
    });
    expect(r.tabHeight).toBeGreaterThan(0);
    expect(r.lastBottom).toBeLessThanOrEqual(r.tabTop);
  });
});
