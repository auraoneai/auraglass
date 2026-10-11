/* G-18 / REQ-QUAL-21 (FIN-440) — overlay stacking lane.

   Dialog -> Menu -> Tooltip, opened in that order from the QUAL fixture
   stories/qual/fixtures/OverlayStack.stories.tsx (public CMP overlays):
   - computed paint order follows the S-25 LayerStack order: wherever two
     layers overlap, elementsFromPoint lists the later layer first, and no
     layer's own centre is covered by an earlier one;
   - Escape closes LIFO: Tooltip, then Menu, then Dialog, one per press.
   Browser lane: GitLab CI / gated remote runner only, chromium + webkit + firefox. */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../tests/helpers';
import { fixtureStory } from './_fixtures/subjects';

const STACK_FIXTURE = 'qual-fixtures-overlay-stack--dialog-menu-tooltip';
const LAYERS = ['layer-dialog', 'layer-menu', 'layer-tooltip'] as const;

interface OrderReport { overlaps: string[]; violations: string[] }

/** Paint-order check over the open layers, lower → upper. */
async function paintOrder(page: Page, ids: readonly string[]): Promise<OrderReport> {
  return page.evaluate((testIds) => {
    const els = testIds.map((id) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`));
    const out = { overlaps: [] as string[], violations: [] as string[] };
    const owner = (e: Element | null) => (e ? els.findIndex((x) => !!x && x.contains(e)) : -1);
    els.forEach((el, i) => {
      if (!el) { out.violations.push(`${testIds[i]} not mounted`); return; }
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      const o = owner(top);
      // covered by a later (upper) layer is correct; by an earlier layer or by non-layer content is not
      if (o < i) {
        out.violations.push(`${testIds[i]}: its centre is painted by ${o >= 0 ? testIds[o] : (top ? top.tagName.toLowerCase() : 'nothing')}`);
      }
    });
    for (let lo = 0; lo < els.length; lo++) {
      for (let hi = lo + 1; hi < els.length; hi++) {
        const a = els[lo];
        const b = els[hi];
        if (!a || !b) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const l = Math.max(ra.left, rb.left);
        const r = Math.min(ra.right, rb.right);
        const t = Math.max(ra.top, rb.top);
        const btm = Math.min(ra.bottom, rb.bottom);
        if (r - l < 2 || btm - t < 2) continue;
        const pair = `${testIds[lo]} < ${testIds[hi]}`;
        out.overlaps.push(pair);
        const stack = document.elementsFromPoint((l + r) / 2, (t + btm) / 2);
        const ia = stack.findIndex((e) => a.contains(e));
        const ib = stack.findIndex((e) => b.contains(e));
        if (ib < 0 || (ia >= 0 && ia < ib)) out.violations.push(`${pair}: lower layer paints above the upper layer`);
      }
    }
    return out;
  }, ids);
}

test.describe('L5 overlay stacking (REQ-QUAL-21, S-25)', () => {
  test('Dialog -> Menu -> Tooltip: z-order follows the layer stack and Escape closes LIFO', async ({ page }) => {
    const story = await fixtureStory(STACK_FIXTURE);
    await gotoStory(page, story.id);
    const layer = (id: (typeof LAYERS)[number]) => page.getByTestId(id);

    await page.getByTestId('open-dialog').click();
    await expect(layer('layer-dialog')).toBeVisible();
    await page.getByTestId('open-menu').click();
    await expect(layer('layer-menu')).toBeVisible();
    await page.getByTestId('open-tooltip').hover();
    await expect(layer('layer-tooltip')).toBeVisible();

    const order = await paintOrder(page, LAYERS);
    expect(order.violations).toEqual([]);
    expect(order.overlaps.length, `overlapping layer pairs checked: ${order.overlaps.join(', ')}`).toBeGreaterThan(0);

    await page.keyboard.press('Escape');
    await expect(layer('layer-tooltip')).toBeHidden();
    await expect(layer('layer-menu')).toBeVisible();
    await expect(layer('layer-dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(layer('layer-menu')).toBeHidden();
    await expect(layer('layer-dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(layer('layer-dialog')).toBeHidden();
  });
});
