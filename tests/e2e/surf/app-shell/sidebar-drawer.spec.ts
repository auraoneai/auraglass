// sidebar-drawer.spec.ts — REQ-SURF-31/32: compact/medium shells present the
// sidebar as a modal drawer (CMP Sheet, LayerStack-registered). Remote L5 lane
// (Storybook) only, run at 375 and 1440 — never on a dev Mac. A missing story,
// toggle or part FAILS the test; nothing here pends.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';

const STORY = 'surf-sidebar-drawer--toggle';
const COOKIE = 'ag-shell-sidebar-drawer-story';

const shell = (page: Page) => page.locator('.ag-app-shell');
const toggle = (page: Page) => page.locator('[data-ag-part="sidebar-toggle"]');
const drawer = (page: Page) => page.locator('[data-ag-part="sidebar-drawer"]');
const inlineSidebar = (page: Page) => page.locator('.ag-app-shell [data-ag-slot="sidebar"]');

async function openAt(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await gotoStory(page, STORY);
  await expect(toggle(page)).toHaveCount(1);
  await expect(drawer(page)).toHaveCount(0); // default: closed, nothing mounted
}

test.describe('sidebar drawer (REQ-SURF-31/32)', () => {
  test('375: inline sidebar is display:none, main at x=0; toggle opens a start-edge min(85%,20rem) dialog', async ({ page }) => {
    await openAt(page, 375, 812);
    expect(await inlineSidebar(page).boundingBox()).toBeNull();
    const main = await page.locator('.ag-app-shell main').boundingBox();
    const shellBox = await shell(page).boundingBox();
    expect(main).not.toBeNull();
    expect(shellBox).not.toBeNull();
    expect(main!.x).toBe(shellBox!.x);

    await expect(toggle(page)).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await toggle(page).click();
    await expect(drawer(page)).toBeVisible();
    await expect(drawer(page)).toHaveAttribute('role', 'dialog');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
    const id = await drawer(page).getAttribute('id');
    expect(id).not.toBeNull();
    await expect(toggle(page)).toHaveAttribute('aria-controls', id!);
    // Opening the drawer never touches the persisted sidebar state.
    await expect(shell(page)).toHaveAttribute('data-ag-sidebar', 'expanded');
    expect((await page.context().cookies()).map((c) => c.name)).not.toContain(COOKIE);

    // Geometry: inline-start edge, width min(85%, 20rem) of the viewport.
    const box = await drawer(page).boundingBox();
    expect(box).not.toBeNull();
    const rootRem = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.documentElement).fontSize));
    const expected = Math.min(0.85 * 375, 20 * rootRem);
    expect(Math.abs(box!.width - expected)).toBeLessThanOrEqual(1);
    expect(Math.round(box!.x)).toBe(0);
  });

  test('375: Escape closes the drawer and focus returns to the toggle', async ({ page }) => {
    await openAt(page, 375, 812);
    await toggle(page).focus();
    await page.keyboard.press('Enter');
    await expect(drawer(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer(page)).toHaveCount(0);
    await expect(toggle(page)).toBeFocused();
    await expect(shell(page)).toHaveAttribute('data-ag-sidebar', 'expanded');
  });

  test('375: a scrim click closes the drawer and focus returns to the toggle', async ({ page }) => {
    await openAt(page, 375, 812);
    await toggle(page).focus();
    await page.keyboard.press('Enter');
    await expect(drawer(page)).toBeVisible();
    const scrim = page.locator('[data-ag-part="backdrop"]');
    await expect(scrim).toHaveCount(1);
    // click the scrim outside the drawer (the drawer is at most 85% wide, from x=0)
    await scrim.click({ position: { x: 370, y: 400 } });
    await expect(drawer(page)).toHaveCount(0);
    await expect(toggle(page)).toBeFocused();
    await expect(shell(page)).toHaveAttribute('data-drawer', 'closed');
  });

  test('375: item activation closes the drawer', async ({ page }) => {
    await openAt(page, 375, 812);
    await toggle(page).click();
    await drawer(page).locator('[data-ag-part="sidebar-item"]').first().click();
    await expect(drawer(page)).toHaveCount(0);
  });

  test('375: stacked Escape closes the CMP Menu first, then the drawer', async ({ page }) => {
    await openAt(page, 375, 812);
    await toggle(page).click();
    await expect(drawer(page)).toBeVisible();
    await drawer(page).getByTestId('drawer-menu').click();
    const menu = page.getByTestId('drawer-menu-popup');
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(drawer(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer(page)).toHaveCount(0);
  });

  test('375: Mod+B inside the shell opens the drawer and leaves data-ag-sidebar alone', async ({ page }) => {
    await openAt(page, 375, 812);
    await page.locator('.ag-app-shell main').click();
    await page.keyboard.press('ControlOrMeta+b');
    await expect(drawer(page)).toBeVisible();
    await expect(shell(page)).toHaveAttribute('data-ag-sidebar', 'expanded');
    await page.keyboard.press('ControlOrMeta+b');
    await expect(drawer(page)).toHaveCount(0);
  });

  test('1440: after a drawer opened and closed at 800, the sidebar is expanded inline and no drawer exists', async ({ page }) => {
    await openAt(page, 800, 700);
    await toggle(page).click();
    await expect(drawer(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer(page)).toHaveCount(0);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(shell(page)).toHaveAttribute('data-ag-sidebar', 'expanded');
    await expect(shell(page)).not.toHaveAttribute('data-mode', /^(compact|medium)$/);
    await expect(inlineSidebar(page)).toBeVisible();
    await expect(toggle(page)).not.toHaveAttribute('aria-haspopup', 'dialog');
    await expect(drawer(page)).toHaveCount(0);
  });

  test('1440: the toggle collapses the inline sidebar to the rail and back; no drawer', async ({ page }) => {
    await openAt(page, 1440, 900);
    await toggle(page).click();
    await expect(shell(page)).toHaveAttribute('data-ag-sidebar', 'rail');
    await expect(drawer(page)).toHaveCount(0);
    await toggle(page).click();
    await expect(shell(page)).toHaveAttribute('data-ag-sidebar', 'expanded');
  });
});
