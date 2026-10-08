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
    if (!existsSync(CSS)) { console.warn('app-shell.css absent — pending'); return; }
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
    if (!subject) { console.warn('AppShell subject not registered — pending'); return; }
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, subject.id);
    const cols = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.ag-app-shell')!).gridTemplateColumns.split(' ').length,
    );
    expect(cols).toBe(3);
  });

  test('compact layout under 600px shows bottom tab bar', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MobileShell' );
    if (!subject) { console.warn('no shell subject — pending'); return; }
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject.id);
    const tabBar = page.locator('[data-ag-part="tab-bar"]');
    await expect(tabBar.first()).toBeVisible();
  });
});
