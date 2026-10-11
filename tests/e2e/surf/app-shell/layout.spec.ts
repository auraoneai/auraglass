// SURF-013/033/044 — app-shell layout: grid geometry, container-query
// breakpoints, and resizable tracks across engines. Static half asserts the
// CSS contract locally; dynamic half runs on the remote browser lane.
import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { listSubjects, gotoStory } from '../../../helpers';

const CSS = join(__dirname, '../../../src/app-shell/app-shell.css');

test.describe('app-shell layout (SURF-013/033/044)', () => {
  test('css contract: grid areas, breakpoints, no !important', () => {
    expect(existsSync(CSS), 'src/app-shell/app-shell.css must exist').toBe(true);
    const css = readFileSync(CSS, 'utf8');
    expect(css).toContain("grid-template-areas");
    expect(css).toContain('600');
    expect(css).toContain('1024');
    expect(css).toContain('1440');
    expect(css).not.toMatch(/!important/);
    expect(css).not.toMatch(/will-change|transform:\s|contain:\s*paint/);
    expect(css).toContain('overscroll-behavior');
  });

  test('shell renders grid tracks at desktop size', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    expect(subject, 'AppShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, subject!.id);
    const cols = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.ag-app-shell')!).gridTemplateColumns.split(' ').length,
    );
    expect(cols).toBe(3);
  });

  test('compact layout under 600px shows bottom tab bar', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MobileShell');
    expect(subject, 'MobileShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject!.id);
    const tabBar = page.locator('[data-ag-part="tab-bar"]');
    await expect(tabBar.first()).toBeVisible();
  });

  test('medium forces rail and restores (SURF-031)', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    expect(subject, 'AppShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, subject!.id);
    const shell = page.locator('.ag-app-shell');
    const sidebar = page.locator('.ag-app-shell [data-ag-slot="sidebar"]');
    const sidebarWidth = async () => {
      const box = await sidebar.boundingBox();
      expect(box, 'inline sidebar must be laid out').not.toBeNull();
      return box!.width;
    };
    // 1440: the expanded sidebar is a real column (mode expanded or wide,
    // depending on the story padding around the shell).
    await expect(shell).toHaveAttribute('data-ag-sidebar', 'expanded');
    await expect(shell).toHaveAttribute('data-mode', /^(expanded|wide)$/);
    const expandedWidth = await sidebarWidth();
    expect(expandedWidth).toBeGreaterThan(0);
    // 900: medium resolves; CSS forces the expanded sidebar to the rail width
    // without changing the stored state.
    await page.setViewportSize({ width: 900, height: 700 });
    await expect(shell).toHaveAttribute('data-mode', 'medium');
    await expect(shell).toHaveAttribute('data-ag-sidebar', 'expanded');
    await expect.poll(sidebarWidth).toBeLessThan(expandedWidth);
    // back to 1440: the expanded column is restored at its original width.
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(shell).toHaveAttribute('data-mode', /^(expanded|wide)$/);
    await expect(shell).toHaveAttribute('data-ag-sidebar', 'expanded');
    await expect.poll(sidebarWidth).toBe(expandedWidth);
  });

  test('375: compact hides the inline sidebar (display:none) and main starts at the shell edge (SURF-031)', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    expect(subject, 'AppShell subject must be registered').toBeDefined();
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject!.id);
    const shell = page.locator('.ag-app-shell');
    await expect(shell).toHaveAttribute('data-mode', 'compact');
    await expect(shell).toHaveAttribute('data-ag-sidebar', 'expanded');
    expect(await page.locator('.ag-app-shell [data-ag-slot="sidebar"]').boundingBox()).toBeNull();
    const [shellBox, mainBox] = await Promise.all([
      shell.boundingBox(),
      page.locator('.ag-app-shell main').boundingBox(),
    ]);
    expect(shellBox).not.toBeNull();
    expect(mainBox).not.toBeNull();
    expect({ x: mainBox!.x, width: mainBox!.width }).toEqual({ x: shellBox!.x, width: shellBox!.width });
    // Drawer content is not mounted until the drawer is opened.
    await expect(page.locator('[data-ag-part="sidebar-drawer"]')).toHaveCount(0);
  });
});
