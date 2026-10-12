// forced-colors.spec.ts — SURF-104 / REQ-SURF-189: under forced-colors: active
// every SURF story shows 0 backdrop filters, surfaces paint on system colours,
// the current nav item keeps a non-colour cue besides Highlight, focus is
// `outline: 2px solid Highlight`, sliders use CanvasText/Highlight and legend
// swatches have borders. Remote lane only; a missing subject fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

/** System colour resolved by the engine (forced palettes differ per OS). */
const systemColour = (page: Page, keyword: string) =>
  page.evaluate((k) => {
    const probe = document.createElement('span');
    probe.style.color = k;
    document.body.append(probe);
    const c = getComputedStyle(probe).color;
    probe.remove();
    return c;
  }, keyword);

/** Rendered elements (or their ::before/::after) whose computed backdrop filter is not 'none'. */
const visibleBackdropFilters = (page: Page) =>
  page.evaluate(() => {
    const out: string[] = [];
    const filterOf = (cs: CSSStyleDeclaration) =>
      cs.backdropFilter || (cs as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || 'none';
    for (const el of document.querySelectorAll<HTMLElement>('body *')) {
      if (el.getClientRects().length === 0) continue;
      for (const pseudo of [null, '::before', '::after'] as const) {
        const cs = getComputedStyle(el, pseudo);
        if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
        if (filterOf(cs) !== 'none') out.push(`${el.tagName.toLowerCase()}.${el.className}${pseudo ?? ''}: ${filterOf(cs)}`);
      }
    }
    return out;
  });

const requireStory = async (id: string) => {
  const subjects = await listSubjects({ owner: 'SURF' });
  if (!subjects.some((s) => s.id === id)) throw new Error(`${id} subject not registered`);
};

test.describe('forced colors (SURF-104, REQ-SURF-189)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
  });

  test('0 visible backdrop filters in every SURF story', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length).toBeGreaterThan(0);
    test.setTimeout(Math.max(60_000, subjects.length * 10_000));
    const offenders: string[] = [];
    for (const s of subjects) {
      await gotoStory(page, s.id);
      for (const f of await visibleBackdropFilters(page)) offenders.push(`${s.id}: ${f}`);
    }
    expect(offenders).toEqual([]);
  });

  test('the shell and its chrome paint on Canvas / CanvasText', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) throw new Error('AppShell subject not registered');
    await gotoStory(page, subject.id);
    const canvas = await systemColour(page, 'Canvas');
    const text = await systemColour(page, 'CanvasText');
    const chrome = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.ag-app-shell, .ag-app-shell .ag-top-bar, .ag-app-shell .ag-sidebar, .ag-app-shell .ag-status-bar')]
        .map((el) => ({ cls: el.className, bg: getComputedStyle(el).backgroundColor, fg: getComputedStyle(el).color })),
    );
    expect(chrome.length).toBeGreaterThan(1);
    for (const c of chrome) expect({ cls: c.cls, bg: c.bg, fg: c.fg }).toEqual({ cls: c.cls, bg: canvas, fg: text });
  });

  for (const [id, selector] of [
    ['surf-sidebar--default', '.ag-sidebar__item[aria-current="page"]'],
    ['surf-tab-bar--default', '.ag-tab-bar__item[aria-current]'],
    ['surf-breadcrumbs--default', '.ag-breadcrumbs__current'],
  ] as const) {
    test(`${id}: the current item has a non-colour cue besides Highlight`, async ({ page }) => {
      await requireStory(id);
      await gotoStory(page, id);
      const highlight = await systemColour(page, 'Highlight');
      const current = page.locator(selector).first();
      await expect(current).toBeVisible();
      const cue = await current.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { color: cs.color, outline: cs.outlineStyle, decoration: cs.textDecorationLine };
      });
      expect(cue.color).toBe(highlight);
      expect(cue.outline !== 'none' || cue.decoration.includes('underline')).toBe(true);
    });
  }

  test('keyboard focus is outline: 2px solid Highlight', async ({ page }) => {
    const id = 'surf-sidebar--default';
    await requireStory(id);
    await gotoStory(page, id);
    const highlight = await systemColour(page, 'Highlight');
    const item = page.locator('.ag-sidebar__item').first();
    await page.keyboard.press('Tab');
    for (let i = 0; i < 10 && !(await item.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
    await expect(item).toBeFocused();
    const ring = await item.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor };
    });
    expect(ring).toEqual({ style: 'solid', width: '2px', color: highlight });
  });

  test('sliders use CanvasText / Highlight', async ({ page }) => {
    const id = 'media-mediascrubber--buffered';
    await requireStory(id);
    await gotoStory(page, id);
    const highlight = await systemColour(page, 'Highlight');
    const text = await systemColour(page, 'CanvasText');
    const parts = await page.evaluate(() => {
      const q = (p: string) => document.querySelector<HTMLElement>(`.ag-slider [data-ag-part="${p}"]`);
      const track = q('track');
      const range = q('range');
      const thumb = q('thumb');
      if (!track || !range || !thumb) return null;
      return {
        trackBorder: getComputedStyle(track).borderTopColor,
        range: getComputedStyle(range).backgroundColor,
        thumb: getComputedStyle(thumb).backgroundColor,
      };
    });
    expect(parts).toEqual({ trackBorder: text, range: highlight, thumb: highlight });
  });

  test('legend swatches have a CanvasText border', async ({ page }) => {
    const id = 'surf-chart-frame--default';
    await requireStory(id);
    await gotoStory(page, id);
    const text = await systemColour(page, 'CanvasText');
    const swatches = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.ag-chart-frame__swatch')].map((el) => {
        const cs = getComputedStyle(el);
        return { style: cs.borderTopStyle, color: cs.borderTopColor };
      }),
    );
    expect(swatches.length).toBeGreaterThan(0);
    for (const s of swatches) expect(s).toEqual({ style: 'solid', color: text });
  });
});
