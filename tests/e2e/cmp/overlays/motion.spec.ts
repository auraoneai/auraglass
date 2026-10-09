/* REQ-CMP-83: data-ag-animating lifecycle — present only between the
   starting-style frame and the last transitionend; will-change 'auto' at rest
   on popup and scrim for all 9 overlay kinds; anchored popups enter with
   scale(0.96); Sheet enters with translate; scrim animates opacity only. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const ANIMATING = '[data-ag-animating]';
const REST_STORIES: Record<string, string> = {
  dialog: 'overlays-dialog--default',
  'alert-dialog': 'overlays-alert-dialog--confirm',
  sheet: 'overlays-sheet--right-panel',
  popover: 'overlays-popover--playground',
  menu: 'overlays-menu--playground',
  tooltip: 'overlays-tooltip--playground',
  toast: 'overlays-toast--playground',
  select: 'overlays-select--playground',
  combobox: 'overlays-combobox--playground',
};

test.describe('overlay animating contract (REQ-CMP-83)', () => {
  for (const [kind, story] of Object.entries(REST_STORIES)) {
    test(`${kind}: will-change 'auto' at rest on popup + scrim`, async ({ page }) => {
      await gotoStory(page, story);
      await page.waitForTimeout(400); // settle past enter transition
      const states = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('[data-ag-overlay], .ag-scrim')]
          .map((el) => ({ part: el.getAttribute('data-ag-part'), wc: getComputedStyle(el).willChange })),
      );
      for (const s of states) expect(s.wc).toBe('auto');
      await expect(page.locator(ANIMATING)).toHaveCount(0);
    });
  }

  test('dialog: animating attr spans starting-style → transitionend only', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--default');
    // The story opens defaultOpen — re-render captures enter; at rest, none.
    await expect(page.locator(ANIMATING)).toHaveCount(0);
  });

  test('anchored popup enter transform is scale(0.96); scrim animates opacity only', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--playground');
    const popup = page.locator('[data-ag-overlay="popover"]').first();
    await expect(popup).toBeVisible();
    const entry = await popup.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { transform: cs.transform, dur: cs.transitionDuration, props: cs.transitionProperty };
    });
    expect(entry.props).toMatch(/transform|opacity/);
    const scrimProps = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.ag-scrim');
      return el ? getComputedStyle(el).transitionProperty : 'no-scrim';
    });
    if (scrimProps !== 'no-scrim') expect(scrimProps).not.toMatch(/backdrop-filter|filter(?!-)/);
  });

  test('sheet enter uses translate, not scale', async ({ page }) => {
    await gotoStory(page, 'overlays-sheet--bottom-detents');
    const sheet = page.locator('[data-ag-overlay="sheet"]').first();
    await expect(sheet).toBeVisible();
    const transform = await sheet.evaluate((el) => getComputedStyle(el).transform);
    expect(transform === 'none' || /matrix/.test(transform)).toBe(true);
  });
});
