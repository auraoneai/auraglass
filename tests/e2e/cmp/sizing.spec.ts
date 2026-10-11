/* REQ-CMP-20 (REQ-FIN-70): target-size contract. Every interactive CMP part
   renders <span data-ag-part="hit-area" aria-hidden> sized by
   src/a11y/css/targets.css. Fine pointer: the hit box is >= 24px on both axes.
   Coarse pointer (touch/mobile emulation): the hit box is >= 44px on both axes
   and document.elementFromPoint just inside each of its four edges resolves to
   the control that owns it (icon-only parts included). Remote e2e lane only. */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../helpers/index';

/** story id → selectors of the interactive parts that must each carry a hit-area child. */
const FAMILIES: ReadonlyArray<{ story: string; parts: readonly string[] }> = [
  { story: 'flagships-controls-button--default', parts: ['button[data-ag-part="root"]'] },
  { story: 'flagships-controls-icon-button--default', parts: ['button[data-ag-part="root"]'] },
  { story: 'flagships-controls-toolbar--default', parts: ['[data-ag-part="button"]'] },
  { story: 'flagships-controls-checkbox--default', parts: ['[role="checkbox"][data-ag-part="root"]'] },
  { story: 'flagships-controls-radio-group--default', parts: ['[role="radio"][data-ag-part="item"]'] },
  { story: 'flagships-controls-switch--default', parts: ['[role="switch"][data-ag-part="root"]'] },
  { story: 'flagships-controls-slider--default', parts: ['[data-ag-part="thumb"]'] },
  { story: 'flagships-controls-toggle-group--default', parts: ['[data-ag-part="item"]'] },
  { story: 'flagships-controls-segmented-control--default', parts: ['[data-ag-part="item"]'] },
  { story: 'flagships-controls-select--default', parts: ['.ag-select[data-ag-part="trigger"]'] },
  { story: 'flagships-controls-combobox--default', parts: ['[data-ag-part="trigger"]'] },
  { story: 'flagships-controls-number-field--default', parts: ['[data-ag-part="decrement"]', '[data-ag-part="increment"]'] },
  { story: 'core-link--default', parts: ['a[data-ag-part="root"]'] },
  { story: 'core-chip--default', parts: ['button.ag-chip'] },
  { story: 'core-accordion--default', parts: ['.ag-accordion-trigger'] },
  { story: 'flagships-overlays-menu--playground', parts: ['[role="menuitem"][data-ag-part="item"]'] },
  { story: 'flagships-overlays-dialog--playground', parts: ['[data-ag-part="close"]'] },
  { story: 'flagships-overlays-sheet--right-panel', parts: ['.ag-sheet-close'] },
];

interface HitBox { part: string; w: number; h: number; edgesOnControl: boolean[] }

/** For every element matching each required part: its direct hit-area child's
    box, and whether each edge point hit-tests into the owning control. */
async function measure(page: Page, parts: readonly string[]): Promise<HitBox[]> {
  return page.evaluate((wanted) => {
    const out: { part: string; w: number; h: number; edgesOnControl: boolean[] }[] = [];
    for (const part of wanted) {
      const owners = [...document.querySelectorAll<HTMLElement>(part)]
        .filter((el) => el.getBoundingClientRect().width > 0);
      for (const owner of owners) {
        const ha = [...owner.children].find(
          (c): c is HTMLElement => c instanceof HTMLElement && c.dataset.agPart === 'hit-area',
        );
        if (!ha) { out.push({ part, w: 0, h: 0, edgesOnControl: [] }); continue; }
        ha.scrollIntoView({ block: 'center', inline: 'center' });
        const r = ha.getBoundingClientRect();
        const pts: [number, number][] = [
          [r.left + 1, r.top + r.height / 2],
          [r.right - 1, r.top + r.height / 2],
          [r.left + r.width / 2, r.top + 1],
          [r.left + r.width / 2, r.bottom - 1],
        ];
        out.push({
          part,
          w: r.width,
          h: r.height,
          edgesOnControl: pts.map(([x, y]) => {
            const at = document.elementFromPoint(x, y);
            return at !== null && owner.contains(at);
          }),
        });
      }
    }
    return out;
  }, parts);
}

test.describe('cmp target sizing — fine pointer (REQ-CMP-20)', () => {
  for (const { story, parts } of FAMILIES) {
    test(`${story}: every ${parts.join('/')} hit-area is >= 24px`, async ({ page }) => {
      await gotoStory(page, story);
      const boxes = await measure(page, parts);
      expect(boxes.length, `${story} renders ${parts.join('/')}`).toBeGreaterThan(0);
      for (const b of boxes) {
        expect(b.w, `${story} ${b.part} hit-area inline-size`).toBeGreaterThanOrEqual(24);
        expect(b.h, `${story} ${b.part} hit-area block-size`).toBeGreaterThanOrEqual(24);
      }
    });
  }
});

test.describe('cmp target sizing — coarse pointer (REQ-CMP-20)', () => {
  /* Touch + mobile emulation makes Chromium match (pointer: coarse). */
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  for (const { story, parts } of FAMILIES) {
    test(`${story}: 44px coarse hit box hit-tests to the control`, async ({ page }) => {
      await gotoStory(page, story);
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), 'coarse pointer emulated').toBe(true);
      const boxes = await measure(page, parts);
      expect(boxes.length, `${story} renders ${parts.join('/')}`).toBeGreaterThan(0);
      for (const b of boxes) {
        expect(b.w, `${story} ${b.part} hit-area inline-size`).toBeGreaterThanOrEqual(44);
        expect(b.h, `${story} ${b.part} hit-area block-size`).toBeGreaterThanOrEqual(44);
        expect(b.edgesOnControl, `${story} ${b.part} edges (left,right,top,bottom) hit the control`)
          .toEqual([true, true, true, true]);
      }
    });
  }
});
