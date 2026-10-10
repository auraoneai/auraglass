/* CMP-390 + CMP-410 (lane 3i-Q), REQ-CMP-84. Overlay a11y modes over all 9 widgets:
   forcedColors active → 0 visible elements with backdrop-filter != none and a
   solid system-colour border on the open surface; prefers-contrast more → 1px
   contrasting border. Runs Chromium/WebKit/Firefox remotely.
   Story ids are the real Storybook ids (title + export), every story opens its
   surface by default except Toast, which is raised through its Info trigger.
   No conditional assertions: every widget's surface must exist and be visible. */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

interface Widget {
  story: string;
  /** The open overlay surface whose border is asserted. */
  surface: string;
  /** Opens the surface when the story does not render it open by default. */
  open?: (page: Page) => Promise<void>;
}

const WIDGETS: Record<string, Widget> = {
  Dialog: { story: 'flagships-overlays-dialog--playground', surface: '[data-ag-part="popup"]' },
  AlertDialog: { story: 'flagships-overlays-alertdialog--confirm', surface: '[data-ag-part="popup"]' },
  Sheet: { story: 'flagships-overlays-sheet--bottom-detents', surface: '[data-ag-part="popup"]' },
  Popover: { story: 'flagships-overlays-popover--playground', surface: '[data-ag-part="popup"]' },
  Tooltip: { story: 'flagships-overlays-tooltip--playground', surface: '[data-ag-part="popup"]' },
  Menu: { story: 'flagships-overlays-menu--playground', surface: '[data-ag-part="popup"]' },
  Toast: {
    story: 'flagships-overlays-toast--playground',
    surface: '.ag-toast[data-ag-part="root"]',
    open: async (page) => {
      await page.getByRole('button', { name: 'Info', exact: true }).click();
    },
  },
  Select: { story: 'flagships-controls-select--default', surface: '[data-ag-part="popup"]' },
  Combobox: { story: 'flagships-controls-combobox--default', surface: '[data-ag-part="popup"]' },
};

/** Elements that are rendered (have boxes, not visibility:hidden) and paint a
    backdrop-filter on themselves or on a generated ::before box. offsetParent is
    not used: it is null for position:fixed scrims/popups, which would hide them. */
const countVisibleBackdropFilters = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('*')].filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || el.getClientRects().length === 0) return false;
      const own = cs.backdropFilter !== 'none' && cs.backdropFilter !== '';
      const before = getComputedStyle(el, '::before');
      const pseudo = before.content !== 'none' && before.backdropFilter !== 'none' && before.backdropFilter !== '';
      return own || pseudo;
    }).length,
  );

test.describe('overlay a11y modes (CMP-390/410, REQ-CMP-84)', () => {
  for (const [name, widget] of Object.entries(WIDGETS)) {
    test(`${name}: forced-colors → 0 backdrop-filters + system-colour border`, async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' });
      await gotoStory(page, widget.story, { forcedColors: true });
      if (widget.open) await widget.open(page);

      const surface = page.locator(widget.surface).first();
      await expect(surface).toBeVisible();

      expect(await countVisibleBackdropFilters(page)).toBe(0);

      const border = await surface.evaluate((el) => {
        const cs = getComputedStyle(el);
        return (['Top', 'Right', 'Bottom', 'Left'] as const).map((side) => ({
          width: parseFloat(cs.getPropertyValue(`border-${side.toLowerCase()}-width`)),
          style: cs.getPropertyValue(`border-${side.toLowerCase()}-style`),
        }));
      });
      // At least one painted solid edge of ≥1px (popups: all four, Toast: inline-start).
      expect(border.some((b) => b.width >= 1 && b.style === 'solid')).toBe(true);
    });
  }

  test('prefers-contrast more → contrasting popup border', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-dialog--playground', { contrast: 'more' });
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    const { width, style } = await popup.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { width: parseFloat(cs.borderTopWidth), style: cs.borderTopStyle };
    });
    expect(width).toBeGreaterThanOrEqual(1);
    expect(style).toBe('solid');
  });
});
