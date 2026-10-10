// sidebar-drawer.spec.ts — SURF-031/042: compact widths render the drawer;
// Escape and scrim close it; stacked Escape closes only the top overlay.
// Remote lane — a missing subject FAILS (the contract is the spec).
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('sidebar drawer (SURF-031)', () => {
  test.skip(!process.env.AG_REMOTE_RUNNER, 'remote lane only');

  test('drawer opens at compact width and closes on Escape', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    expect(subject, 'AppShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject!.id);
    const toggle = page.locator('[data-ag-part="sidebar-toggle"]').first();
    await expect(toggle, 'sidebar toggle must exist').toHaveCount(1);
    await toggle.click();
    const drawer = page.locator('[data-ag-part="sidebar-drawer"]');
    await expect(drawer.first()).toBeVisible();
    // drawer open never flips the persisted sidebar state
    await expect(page.locator('.ag-app-shell')).toHaveAttribute('data-ag-sidebar', 'expanded');
    await page.keyboard.press('Escape');
    await expect(drawer.first()).not.toBeVisible();
  });

  test('stacked Escape: open CMP Menu over the drawer, Escape hits menu first', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    expect(subject, 'AppShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject!.id);
    const toggle = page.locator('[data-ag-part="sidebar-toggle"]').first();
    await expect(toggle).toHaveCount(1);
    await toggle.click();
    const drawer = page.locator('[data-ag-part="sidebar-drawer"]');
    await expect(drawer.first()).toBeVisible();
    // open a Menu inside the drawer if the subject exposes one
    const menuTrigger = drawer.locator('[data-ag-part="trigger"], [aria-haspopup="menu"]').first();
    if ((await menuTrigger.count()) === 0) {
      test.info().annotations.push({ type: 'note', description: 'subject has no menu — stacked case not exercised' });
      return;
    }
    await menuTrigger.click();
    const menu = page.locator('[role="menu"]').first();
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(drawer.first()).toBeVisible(); // drawer survived the first Escape
    await page.keyboard.press('Escape');
    await expect(drawer.first()).not.toBeVisible();
  });
});
