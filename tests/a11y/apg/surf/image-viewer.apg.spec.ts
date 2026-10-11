// image-viewer.apg.spec.ts — SURF-477 (REQ-SURF-142, REQ-SURF-144; REQ-FIN-86
// and the REQ-FIN-07 ImageViewer transfer): APG dialog semantics for the
// ImageViewer popup. Focus lands on Close after open and stays put while
// arrows navigate; Escape closes and focus returns to the Trigger; the
// background is inert while open. Wheel/pointer scripts cover the zoom rules.
// A missing subject or story is a failure, never a skip.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function openStory(page: Page, story: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'ImageViewer' && s.id.endsWith(`--${story}`));
  expect(subject, `ImageViewer ${story} story registered in the subject index`).toBeTruthy();
  await gotoStory(page, subject!.id);
}

const dialog = (page: Page) => page.locator('[data-ag-part="image-viewer-popup"]');
const stage = (page: Page) => page.locator('[data-ag-part="image-viewer-stage"]');
const currentAlt = (page: Page) =>
  stage(page).locator('img:not([hidden])').first().getAttribute('alt');

async function openFromGrid(page: Page) {
  await openStory(page, 'grid');
  const trigger = page.locator('[data-ag-part="image-viewer-trigger"]').nth(1);
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(dialog(page)).toBeVisible();
  return trigger;
}

test.describe('ImageViewer APG (SURF-477)', () => {
  test('dialog role, modal, named by aria-labelledby', async ({ page }) => {
    await openFromGrid(page);
    const d = dialog(page);
    await expect(d).toHaveAttribute('role', 'dialog');
    await expect(d).toHaveAttribute('aria-modal', 'true');
    const labelledBy = await d.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    await expect(page.locator(`[id="${labelledBy}"]`)).toHaveText('Curved glass stair');
    await expect(page.locator('[data-ag-portal-root] [data-ag-layer-root="overlay"] [data-ag-part="image-viewer-popup"]')).toHaveCount(1);
  });

  test('focus on Close after open; arrows navigate without moving focus', async ({ page }) => {
    await openFromGrid(page);
    const close = page.locator('[data-ag-part="image-viewer-close"]');
    await expect(close).toBeFocused();
    expect(await currentAlt(page)).toBe('Curved glass stair');
    await page.keyboard.press('ArrowRight');
    expect(await currentAlt(page)).toBe('Frosted panel wall');
    await expect(close).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    expect(await currentAlt(page)).toBe('Atrium with glass ceiling');
    await expect(close).toBeFocused();
    await page.keyboard.press('End');
    expect(await currentAlt(page)).toBe('Frosted panel wall');
    await page.keyboard.press('Home');
    expect(await currentAlt(page)).toBe('Atrium with glass ceiling');
  });

  test('background is inert while open', async ({ page }) => {
    const trigger = await openFromGrid(page);
    const inert = await trigger.evaluate((el) => {
      let n: Element | null = el;
      while (n && n.parentElement !== document.body) n = n.parentElement;
      return n?.hasAttribute('inert') ?? false;
    });
    expect(inert).toBe(true);
    await expect(page.locator('[data-ag-portal-root]')).not.toHaveAttribute('inert', '');
  });

  test('Escape closes and focus returns to the Trigger', async ({ page }) => {
    const trigger = await openFromGrid(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toHaveCount(0);
    await expect(trigger).toBeFocused();
    const inert = await trigger.evaluate((el) => !!el.closest('[inert]'));
    expect(inert).toBe(false);
  });

  test('zoom keys + − 0 set the Stage state', async ({ page }) => {
    await openFromGrid(page);
    await expect(stage(page)).toHaveAttribute('data-state', 'fit');
    await page.keyboard.press('+');
    await expect(stage(page)).toHaveAttribute('data-state', 'zoomed');
    await page.keyboard.press('0');
    await expect(stage(page)).toHaveAttribute('data-state', 'fit');
  });

  test('wheel: plain wheel at 1× does not zoom; ctrl+wheel zooms (REQ-SURF-144)', async ({ page }) => {
    await openFromGrid(page);
    // record defaultPrevented of every wheel the Stage receives (read after
    // dispatch, so the component's own listener has run)
    await stage(page).evaluate((el) => {
      const log: boolean[] = [];
      (window as unknown as { __agWheel: boolean[] }).__agWheel = log;
      el.addEventListener('wheel', (e) => { setTimeout(() => log.push(e.defaultPrevented), 0); });
    });
    const wheelLog = () => page.evaluate(() => (window as unknown as { __agWheel: boolean[] }).__agWheel);
    const box = (await stage(page).boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -120);
    await expect.poll(wheelLog).toEqual([false]);
    await expect(stage(page)).toHaveAttribute('data-state', 'fit');
    await page.keyboard.down('Control');
    await page.mouse.wheel(0, -120);
    await page.keyboard.up('Control');
    await expect.poll(wheelLog).toEqual([false, true]);
    await expect(stage(page)).toHaveAttribute('data-state', 'zoomed');
  });

  test('pointer: dragging pans only while zoomed (REQ-SURF-144)', async ({ page }) => {
    await openFromGrid(page);
    const img = stage(page).locator('img:not([hidden])').first();
    const box = (await stage(page).boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const drag = async () => {
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 40, cy + 20, { steps: 4 });
      await page.mouse.up();
    };
    await drag();
    expect(await img.evaluate((el) => (el as HTMLElement).style.transform)).toMatch(/translate3d\(0px, 0px, 0(px)?\)/);
    await page.locator('[data-ag-part="image-viewer-zoom-in"]').click();
    await expect(stage(page)).toHaveAttribute('data-state', 'zoomed');
    await drag();
    expect(await img.evaluate((el) => (el as HTMLElement).style.transform)).toMatch(/translate3d\(40px, 20px, 0(px)?\)/);
  });
});
