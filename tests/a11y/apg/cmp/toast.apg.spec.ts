/* CMP-408 + REQ-CMP-107 (lane 3i-Q). Toast APG, 3 engines: the viewport is
   the labelled "Notifications" region (accessibility-tree snapshot); every
   toast is exactly one live entry (role=status for the default 'low'
   priority); nothing is also pushed through the S-26 announcer; a new toast
   never moves focus; F6 reaches the region.
   Companion: tests/e2e/cmp/overlays/toast.touch.spec.ts. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

const VIEWPORT = '[data-ag-part="viewport"]';
const TOAST = `${VIEWPORT} [data-ag-part="toast"]`;
const SEEDED = ['Sync paused', 'Invite sent', 'Upload failed'];

test.describe('toast APG (CMP-408 / REQ-CMP-107)', () => {
  test('labelled region snapshot; one live role per toast; no S-26 echo', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-toast--intents');
    const viewport = page.locator(VIEWPORT);
    await expect(viewport).toHaveCount(1);
    await expect(page.locator(TOAST)).toHaveCount(SEEDED.length);
    await expect(viewport.locator('xpath=ancestor::*[@data-ag-layer-root="toast"]')).toHaveCount(1);

    // accessibility tree, in DOM order: the region holds one status per toast
    const titles = await page.locator(`${TOAST} [data-ag-part="title"]`).allTextContents();
    expect([...titles].sort()).toEqual([...SEEDED].sort());
    await expect(viewport).toMatchAriaSnapshot(
      ['- region "Notifications":', ...titles.map((t) => `  - status "${t}"`)].join('\n'),
    );
    for (const title of titles) {
      await expect(page.getByRole('status', { name: title })).toMatchAriaSnapshot(
        `- status "${title}":\n  - button "Dismiss"`,
      );
    }

    // exactly one live role per toast: the root itself, no nested or duplicate live nodes
    const live = await page.evaluate(({ toastSel }) => {
      const toasts = Array.from(document.querySelectorAll(toastSel));
      const perToast = toasts.map((t) => {
        const nodes = [t, ...Array.from(t.querySelectorAll('*'))];
        return nodes.filter((n) => n.matches('[role="status"], [role="alert"], [aria-live]')).length;
      });
      return { toasts: toasts.length, perToast };
    }, { toastSel: TOAST });
    expect(live.toasts).toBe(SEEDED.length);
    expect(live.perToast).toEqual(SEEDED.map(() => 1));
    // default priority is 'low': no toast in this scene is an alert
    await expect(page.locator(`${TOAST}[role="alert"]`)).toHaveCount(0);

    // never also announced through the S-26 announcer regions
    const announced = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-ag-announcer] [aria-live]')).map((n) => n.textContent ?? '').join('|'),
    );
    for (const title of SEEDED) expect(announced).not.toContain(title);
    await apg.axe(page);
  });

  test('a new toast does not move focus; F6 then reaches the region', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-toast--playground');
    const info = page.getByRole('button', { name: 'Info', exact: true });
    await info.focus();
    await expect(info).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator(TOAST)).toHaveCount(1);
    // focus stayed on the control that raised the toast
    await expect(info).toBeFocused();

    await page.keyboard.press('F6');
    const landed = await page.evaluate((sel) => !!document.activeElement?.closest(sel), VIEWPORT);
    expect(landed).toBe(true);
  });
});
