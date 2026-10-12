/* CMP-368 + REQ-CMP-43. SegmentedControl APG radio script pinned to
   SEGMENTED_KEYS (Base UI 1.8.0): one tab stop on the checked item; arrows
   move AND select with wrap; Home/End bound; Space never deselects. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';
import { SEGMENTED_KEYS } from '../../../../src/components/segmented-control/SegmentedControl.keys';

async function checkedIndex(page: import('@playwright/test').Page) {
  return page.locator('[role="radio"]').evaluateAll(
    (els) => els.findIndex((el) => el.getAttribute('aria-checked') === 'true'),
  );
}

test.describe('segmented-control APG (CMP-368 + REQ-CMP-43)', () => {
  test('aria-checked moves with arrows, wraps, Home/End bound, Space never deselects', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-segmentedcontrol--keyboard');
    const items = page.locator('[role="radio"], [data-ag-part="item"]');
    const n = await items.count();
    expect(n).toBeGreaterThanOrEqual(2);

    /* one tab stop total (on the checked item) */
    if (SEGMENTED_KEYS.oneTabStop) {
      const tabbables = await items.evaluateAll(
        (els) => els.filter((el) => el.getAttribute('tabindex') !== '-1').length,
      );
      expect(tabbables).toBe(1);
    }

    /* The Keyboard story checks the first item; the single tab stop is on it. */
    const start = await checkedIndex(page);
    expect(start, 'Keyboard story must start with the first segment checked').toBe(0);
    await items.nth(start).focus();

    /* arrows move AND select */
    if (SEGMENTED_KEYS.arrowsMoveAndSelect) {
      await page.keyboard.press('ArrowRight');
      expect(await checkedIndex(page)).toBe(1 % n);
    }

    /* Home/End bound */
    if (SEGMENTED_KEYS.homeEndBound) {
      await page.keyboard.press('End');
      expect(await checkedIndex(page)).toBe(n - 1);
      await page.keyboard.press('Home');
      expect(await checkedIndex(page)).toBe(0);
    }

    /* wrap: ArrowRight on last wraps to first */
    if (SEGMENTED_KEYS.arrowWraps) {
      await page.keyboard.press('End');
      await page.keyboard.press('ArrowRight');
      expect(await checkedIndex(page)).toBe(0);
    }

    /* Space on the checked item never deselects */
    if (SEGMENTED_KEYS.spaceNeverDeselects) {
      await page.keyboard.press('Space');
      expect(await checkedIndex(page)).toBe(0);
      const checked = items.first();
      expect(await checked.getAttribute('aria-checked')).toBe('true');
    }

    await apg.axe(page);
  });
});

/* REQ-CMP-42: the indicator tracks the checked item within 1px. Without a
   View Transition engine it moves by CSS transition and, while it moves, it
   carries data-ag-animating + data-ag-allow-nested and its own ::before
   backdrop blur; at rest both are gone and it is an opaque inner fill (no
   blur). The checked item paints no platter of its own. Under calm it jumps. */
const indicatorState = () => {
  const ind = document.querySelector<HTMLElement>('[role="radiogroup"] > [data-ag-part="indicator"]');
  if (!ind) return null;
  return {
    animating: ind.hasAttribute('data-ag-animating'),
    allowNested: ind.hasAttribute('data-ag-allow-nested'),
    blur: getComputedStyle(ind, '::before').backdropFilter,
    willChange: getComputedStyle(ind).willChange,
  };
};

test('REQ-CMP-42: indicator glass while moving, measures item 3 within 1px; calm jumps', async ({ page }) => {
  /* the Keyboard story starts with the first segment checked (REQ-CMP-43) */
  await gotoStory(page, 'flagships-controls-segmentedcontrol--keyboard');
  /* force the CSS-transition path (no View Transition engine) */
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-ag-motion', 'full');
    Object.defineProperty(document, 'startViewTransition', { value: undefined, configurable: true });
  });
  const root = page.locator('[role="radiogroup"]').first();
  const items = root.locator('[role="radio"]');
  const n = await items.count();
  expect(n, 'segmented-control story renders fewer than 3 radios').toBeGreaterThanOrEqual(3);
  const ind = root.locator(':scope > [data-ag-part="indicator"]');

  const rest = await page.evaluate(indicatorState);
  expect(rest).toMatchObject({ animating: false, allowNested: false, blur: 'none' });
  /* the checked item has no platter: the indicator is the only selected cue */
  const checkedBg = await items.first().evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(checkedBg).toBe('rgba(0, 0, 0, 0)');

  const third = items.nth(2);
  await third.click(); /* select item 3 */
  const moving = await page.waitForFunction(() => {
    const ind = document.querySelector<HTMLElement>('[role="radiogroup"] > [data-ag-part="indicator"]');
    if (!ind || !ind.hasAttribute('data-ag-animating')) return null;
    return {
      allowNested: ind.hasAttribute('data-ag-allow-nested'),
      blur: getComputedStyle(ind, '::before').backdropFilter,
      willChange: getComputedStyle(ind).willChange,
    };
  }, null, { polling: 'raf', timeout: 3000 });
  const m = await moving.jsonValue() as { allowNested: boolean; blur: string; willChange: string };
  expect(m.allowNested).toBe(true);
  expect(m.blur).toContain('blur(');
  expect(m.willChange).toContain('transform');
  /* removed on transitionend */
  await page.waitForFunction(() => {
    const ind = document.querySelector('[role="radiogroup"] > [data-ag-part="indicator"]');
    return !!ind && !ind.hasAttribute('data-ag-animating') && !ind.hasAttribute('data-ag-allow-nested');
  }, null, { timeout: 3000 });
  expect(await root.evaluate((el) => el.hasAttribute('data-ag-animating'))).toBe(false);
  expect((await page.evaluate(indicatorState))?.blur).toBe('none');
  const [ir, cr] = await Promise.all([ind.boundingBox(), third.boundingBox()]);
  if (!ir || !cr) throw new Error('Selected item and indicator must both have visible bounds');
  expect(Math.abs(ir.x - cr.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(ir.width - cr.width)).toBeLessThanOrEqual(1);

  /* calm: jumps — no animating flag and no transition */
  await page.evaluate(() => document.documentElement.setAttribute('data-ag-motion', 'calm'));
  await third.focus();
  await page.keyboard.press('ArrowLeft'); /* arrows move AND select */
  await expect(items.nth(1)).toHaveAttribute('aria-checked', 'true');
  const calm = await page.evaluate(indicatorState);
  expect(calm?.animating).toBe(false);
  const dur = await ind.evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(dur === '0s' || dur === '').toBe(true);
  await expect.poll(async () => {
    const [ir2, cr2] = await Promise.all([ind.boundingBox(), items.nth(1).boundingBox()]);
    return ir2 && cr2 ? Math.abs(ir2.x - cr2.x) : Number.POSITIVE_INFINITY;
  }, { timeout: 1000 }).toBeLessThanOrEqual(1);
  expect((await page.evaluate(indicatorState))?.animating).toBe(false);
});
