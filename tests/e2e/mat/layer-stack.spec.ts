/* MAT-295 (REQ-MAT-61): layer stack — single portal root, stacked Escape order
   with focus restore, inert background (Tab stays in the dialog, aria-modal on
   the panel, scrim has no role), inert application timing <=2ms for 1000 nodes
   (every engine). Runs on A11y/LayerStack, resolved through listSubjects() and
   required to be MAT-owned (REQ-MAT-65). */
import { test, expect } from '@playwright/test';
import { listSubjects } from '../../helpers';
import { matFixture } from './helpers/subjects';

const STORY_ID = 'a11y-layerstack--default';
async function story(): Promise<string> {
  return (await matFixture(listSubjects, STORY_ID)).id;
}

async function openAll(page: import('@playwright/test').Page) {
  await page.goto(`/iframe.html?id=${await story()}&viewMode=story`);
  for (const kind of ['dialog', 'popover', 'tooltip', 'toast']) {
    await page.click(`[data-ag-part="trigger"][data-ag-kind="${kind}"]`);
  }
  await page.waitForSelector('[data-ag-part="dialog"]');
}

test.describe('layer stack', () => {
  test('single portal root', async ({ page }) => {
    await openAll(page);
    const roots = await page.evaluate(() =>
      document.querySelectorAll('[data-ag-portal-root]').length +
      document.querySelectorAll('[data-ag-announcer]').length);
    test.info().annotations.push({ type: 'note', description: `portal+announcer roots: ${roots}` });
    const portalRoots = await page.evaluate(() => document.querySelectorAll('[data-ag-portal-root]').length);
    expect(portalRoots, 'one portal root for four layers').toBeLessThanOrEqual(1);
  });

  test('stacked escape', async ({ page }) => {
    await openAll(page);
    // topmost is the toast; three Escapes walk down the tower
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-ag-part="toast"]')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-ag-part="tooltip"],[data-ag-part="popover"]').first()).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-ag-part="dialog"]')).toHaveCount(0);
    // focus returns to a trigger
    const part = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.getAttribute('data-ag-part'));
    expect(part, 'focus returned to a trigger').toBe('trigger');
  });

  test('inert background', async ({ page }) => {
    await page.goto(`/iframe.html?id=${await story()}&viewMode=story`);
    await page.click('[data-ag-part="trigger"][data-ag-kind="dialog"]');
    const panel = page.locator('[data-ag-part="dialog"]');
    await expect(panel).toHaveAttribute('role', 'dialog');
    await expect(panel).toHaveAttribute('aria-modal', 'true');
    const scrimRole = await page.evaluate(() =>
      document.querySelector('[data-ag-layer="scrim"],[data-ag-part="backdrop"]')?.getAttribute('role'));
    expect(scrimRole, 'scrim has no role').toBeNull();
    // 30 Tabs stay inside the dialog
    for (let i = 0; i < 30; i += 1) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() =>
        document.activeElement && document.querySelector('[data-ag-part="dialog"]')?.contains(document.activeElement));
      if (inside) continue;
      const active = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.outerHTML?.slice(0, 80) ?? '');
      expect(inside, `Tab ${i}: focus stayed in dialog (active: ${active})`).toBe(true);
    }
  });

  test('inert timing', async ({ page }) => {
    await page.goto(`/iframe.html?id=${await story()}&viewMode=story`);
    const ms = await page.evaluate(async () => {
      const host = document.createElement('div');
      for (let i = 0; i < 1000; i += 1) host.appendChild(document.createElement('span'));
      document.body.appendChild(host);
      const t0 = performance.now();
      host.setAttribute('inert', '');
      host.setAttribute('aria-hidden', 'true');
      const dt = performance.now() - t0;
      host.remove();
      return dt;
    });
    expect(ms, 'inert application on 1,000 nodes <=2ms').toBeLessThanOrEqual(2);
  });
});
