/* REQ-CMP-114: Badge intents paint an opaque token background with a text
   color that differs from it (contrast-color() where supported, else
   --ag-color-on-accent). Ledger acceptance: "computed style of .ag-badge
   background != text color in ... visual test". Remote Playwright lane only. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const TRANSPARENT = new Set(['transparent', 'rgba(0, 0, 0, 0)']);

test.describe('badge intent contrast (REQ-CMP-114)', () => {
  test('every intent has an opaque background distinct from its text color', async ({ page }) => {
    const seen = new Map<string, { bg: string; fg: string }>();
    for (const id of ['core-badge--default', 'core-badge--intents']) {
      await gotoStory(page, id);
      const rows = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('.ag-badge[data-ag-intent]')].map((el) => {
          const cs = getComputedStyle(el);
          return { intent: el.dataset.agIntent ?? '', bg: cs.backgroundColor, fg: cs.color };
        }),
      );
      for (const r of rows) seen.set(r.intent, { bg: r.bg, fg: r.fg });
    }
    expect([...seen.keys()].sort()).toEqual(['danger', 'info', 'neutral', 'success', 'warning']);
    for (const [intent, { bg, fg }] of seen) {
      expect(TRANSPARENT.has(bg), `${intent} background ${bg}`).toBe(false);
      expect(bg, `${intent} background vs text`).not.toBe(fg);
    }
  });
});
