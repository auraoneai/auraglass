/* REQ-CMP-20 (REQ-FIN-70): target-size contract. Every interactive CMP part
   renders <span data-ag-part="hit-area" aria-hidden> sized by
   src/a11y/css/targets.css. Fine pointer: the hit box is >= 24px on both axes.
   Coarse pointer (touch/mobile emulation): the hit box is >= 44px on both axes
   and document.elementFromPoint just inside each of its four edges resolves to
   the control that owns it (icon-only parts included). Remote e2e lane only.
   REQ-CMP-21: `size` emits data-ag-size and the PRD §4.4 block sizes
   (28/36/44 px for sm/md/lg at the regular density, ±0.5 px). */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../helpers/index';

/** story id → selectors of the interactive parts that must each carry a hit-area child. */
const FAMILIES: ReadonlyArray<{ story: string; parts: readonly string[] }> = [
  { story: 'flagships-controls-button--default', parts: ['button[data-ag-part="root"]'] },
  { story: 'flagships-controls-iconbutton--default', parts: ['button[data-ag-part="root"]'] },
  { story: 'flagships-controls-toolbar--default', parts: ['[data-ag-part="button"]'] },
  { story: 'flagships-controls-checkbox--default', parts: ['[role="checkbox"][data-ag-part="root"]'] },
  { story: 'flagships-controls-radiogroup--default', parts: ['[role="radio"][data-ag-part="item"]'] },
  { story: 'flagships-controls-switch--default', parts: ['[role="switch"][data-ag-part="root"]'] },
  { story: 'flagships-controls-slider--default', parts: ['[data-ag-part="thumb"]'] },
  { story: 'flagships-controls-togglegroup--default', parts: ['[data-ag-part="item"]'] },
  { story: 'flagships-controls-segmentedcontrol--default', parts: ['[data-ag-part="item"]'] },
  { story: 'flagships-controls-select--default', parts: ['.ag-select[data-ag-part="trigger"]'] },
  { story: 'flagships-controls-combobox--default', parts: ['[data-ag-part="trigger"]'] },
  { story: 'flagships-controls-numberfield--default', parts: ['[data-ag-part="decrement"]', '[data-ag-part="increment"]'] },
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

/* REQ-CMP-21 / PRD §4.4: sm/md/lg = 28/36/44 px at the regular density. */
const BLOCK_SIZE: Readonly<Record<'sm' | 'md' | 'lg', number>> = { sm: 28, md: 36, lg: 44 };
const SIZED: ReadonlyArray<{ story: string; selector: string }> = [
  { story: 'flagships-controls-button--density', selector: '.ag-button[data-ag-size]' },
  { story: 'flagships-controls-iconbutton--sizes', selector: 'button[data-ag-part="root"][data-ag-size]' },
  { story: 'flagships-controls-select--density', selector: '.ag-select[data-ag-part="trigger"][data-ag-size]' },
];

test.describe('cmp control block sizes (REQ-CMP-21, §4.4)', () => {
  for (const { story, selector } of SIZED) {
    test(`${story}: ${selector} block-size matches §4.4 per size (±0.5px)`, async ({ page }) => {
      await gotoStory(page, story);
      const rows = await page.evaluate((sel) =>
        [...document.querySelectorAll<HTMLElement>(sel)]
          .filter((el) => el.getBoundingClientRect().width > 0)
          .map((el) => ({ size: el.dataset.agSize ?? '', h: el.getBoundingClientRect().height })), selector);
      const seen = new Set(rows.map((r) => r.size));
      expect([...seen].sort(), `${story} renders every size`).toEqual(['lg', 'md', 'sm']);
      for (const { size, h } of rows) {
        const want = BLOCK_SIZE[size as keyof typeof BLOCK_SIZE];
        expect(want, `${story} unknown data-ag-size=${size}`).toBeDefined();
        expect(Math.abs(h - want), `${story} ${size} block-size ${h}px vs ${want}px`).toBeLessThanOrEqual(0.5);
      }
    });
  }
});
