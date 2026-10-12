/* REQ-CMP-83: data-ag-animating lifecycle — present only between the
   starting-style frame and the last transitionend; will-change 'auto' at rest
   on popup and scrim for all 9 overlay kinds; anchored popups enter with
   scale(0.96) (the transform captured on the data-starting-style frame is
   matrix(0.96, 0, 0, 0.96, …)); Sheet enters with a translate matrix; the
   scrim's transition-property is exactly opacity. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const ANIMATING = '[data-ag-animating]';
const REST_STORIES: Record<string, string> = {
  dialog: 'flagships-overlays-dialog--playground',
  'alert-dialog': 'flagships-overlays-alertdialog--confirm',
  sheet: 'flagships-overlays-sheet--right-panel',
  popover: 'flagships-overlays-popover--playground',
  menu: 'flagships-overlays-menu--playground',
  tooltip: 'flagships-overlays-tooltip--playground',
  toast: 'flagships-overlays-toast--playground',
  select: 'flagships-controls-select--default',
  combobox: 'flagships-controls-combobox--default',
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

  test('dialog: data-ag-animating is present during the enter and absent after transitionend', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-dialog--playground');
    await reopen(page, '[data-ag-overlay="dialog"]', page.getByRole('button', { name: 'Open dialog' }));
    const rec = await enterRecord(page);
    expect(rec.startingSeen, 'popup never carried data-starting-style').toBe(true);
    expect(rec.animatingDuring, 'data-ag-animating missing during the enter').toBe(true);
    expect(rec.transitionEnds).toBeGreaterThan(0);
    // after transitionend: no marker, will-change back to auto
    await expect(page.locator(ANIMATING)).toHaveCount(0);
    const wc = await page.locator('[data-ag-overlay="dialog"]').first().evaluate((el) => getComputedStyle(el).willChange);
    expect(wc).toBe('auto');
    // the dialog enters with scale(0.96) too
    expect(rec.startingTransforms.some((t) => isScale096(t))).toBe(true);
  });

  for (const [kind, story] of [
    ['popover', 'flagships-overlays-popover--playground'],
    ['menu', 'flagships-overlays-menu--playground'],
  ] as const) {
    test(`${kind}: anchored enter starts at matrix(0.96…) from --transform-origin`, async ({ page }) => {
      await gotoStory(page, story);
      const sel = `[data-ag-overlay="${kind}"]`;
      await reopen(page, sel, page.locator('[data-ag-part="trigger"]').first());
      const rec = await enterRecord(page);
      expect(rec.startingSeen).toBe(true);
      expect(rec.startingTransforms.some((t) => isScale096(t)), `starting transforms: ${rec.startingTransforms.join(' | ')}`).toBe(true);
      expect(rec.animatingDuring).toBe(true);
      await expect(page.locator(ANIMATING)).toHaveCount(0);
      // BU publishes the anchor point as --transform-origin; the popup scales from it
      const origin = await page.locator(sel).first().evaluate((el) => ({
        used: getComputedStyle(el).transformOrigin,
        declared: getComputedStyle(el).getPropertyValue('--transform-origin').trim(),
      }));
      expect(origin.declared).not.toBe('');
      // the popup's own rule reads it (not the default 50% 50% centre)
      const rule = await page.evaluate((s) => {
        for (const sheet of [...document.styleSheets]) {
          let rules: CSSRuleList;
          try { rules = sheet.cssRules; } catch { continue; }
          const stack: CSSRule[] = [...rules];
          while (stack.length) {
            const r = stack.shift()!;
            if ('cssRules' in r) stack.push(...(r as CSSGroupingRule).cssRules);
            const st = (r as CSSStyleRule).style;
            if (st && st.transformOrigin.includes('--transform-origin') && document.querySelector(s)?.matches((r as CSSStyleRule).selectorText)) return true;
          }
        }
        return false;
      }, sel);
      expect(rule).toBe(true);
      expect(origin.used).not.toBe('');
    });
  }

  test('modal scrim transitions opacity only', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-dialog--playground');
    const scrim = page.locator('.ag-scrim').first();
    await expect(scrim).toHaveCount(1);
    const props = await scrim.evaluate((el) => getComputedStyle(el).transitionProperty);
    expect(props).toBe('opacity');
  });

  test('sheet enter is a translate along the side, not a scale', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-sheet--bottom-detents');
    const sel = '[data-ag-overlay="sheet"]';
    await reopen(page, sel, page.getByRole('button', { name: 'Open sheet' }));
    const rec = await enterRecord(page);
    expect(rec.startingSeen).toBe(true);
    expect(rec.startingTransforms.length).toBeGreaterThan(0);
    for (const t of rec.startingTransforms) {
      const m = parseMatrix(t);
      expect(m, `not a matrix: ${t}`).not.toBeNull();
      // pure translateY(100%): identity scale, positive Y offset (bottom side)
      expect(m![0]).toBeCloseTo(1, 3);
      expect(m![3]).toBeCloseTo(1, 3);
      expect(m![5]).toBeGreaterThan(0);
    }
  });
});

/** matrix(a, b, c, d, e, f) -> [a, b, c, d, e, f] */
function parseMatrix(t: string): number[] | null {
  const m = /^matrix\(([^)]+)\)$/.exec(t.trim());
  return m ? m[1]!.split(',').map((n) => Number.parseFloat(n)) : null;
}
function isScale096(t: string): boolean {
  const m = parseMatrix(t);
  return m !== null && Math.abs(m[0]! - 0.96) < 0.005 && Math.abs(m[3]! - 0.96) < 0.005;
}

interface EnterRecord {
  startingSeen: boolean;
  startingTransforms: string[];
  animatingDuring: boolean;
  transitionEnds: number;
}

/** Close the default-open overlay, arm a recorder, then open it through the
    trigger so the starting-style frame is observed live. */
async function reopen(page: import('@playwright/test').Page, sel: string, trigger: import('@playwright/test').Locator) {
  await expect(page.locator(sel).first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator(sel)).toHaveCount(0);
  await page.evaluate((s) => {
    const rec = { startingSeen: false, startingTransforms: [] as string[], animatingDuring: false, transitionEnds: 0 };
    (window as unknown as { __agEnter: typeof rec }).__agEnter = rec;
    const seen = new WeakSet<Element>();
    const sample = () => {
      for (const el of document.querySelectorAll<HTMLElement>(s)) {
        if (el.hasAttribute('data-starting-style')) {
          rec.startingSeen = true;
          rec.startingTransforms.push(getComputedStyle(el).transform);
        }
        if (el.hasAttribute('data-ag-animating')) rec.animatingDuring = true;
        if (!seen.has(el)) {
          seen.add(el);
          el.addEventListener('transitionend', (e) => { if (e.target === el) rec.transitionEnds += 1; });
        }
      }
    };
    new MutationObserver(sample).observe(document.body, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ['data-starting-style', 'data-ag-animating'],
    });
  }, sel);
  await trigger.click();
  await expect(page.locator(sel).first()).toBeVisible();
  await page.waitForFunction((s) => {
    const el = document.querySelector(s);
    return el !== null && !el.hasAttribute('data-starting-style') && !el.hasAttribute('data-ag-animating');
  }, sel);
}

async function enterRecord(page: import('@playwright/test').Page): Promise<EnterRecord> {
  return page.evaluate(() => (window as unknown as { __agEnter: EnterRecord }).__agEnter);
}
