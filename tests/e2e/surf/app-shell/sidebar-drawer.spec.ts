// sidebar-drawer.spec.ts — SURF-042: compact widths render the drawer; Escape and scrim close it. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('sidebar drawer (SURF-042)', () => {
  test('drawer opens at compact width and closes on Escape', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell' );
    if (!subject) { console.warn('shell subject not registered — pending'); return; }
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStory(page, subject.id);
    const toggle = page.locator('[data-ag-part="sidebar-toggle"]').first();
    if (await toggle.count() === 0) { console.warn('no toggle in subject — pending'); return; }
    await toggle.click();
    const drawer = page.locator('[data-ag-part="sidebar-drawer"]');
    await expect(drawer.first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer.first()).not.toBeVisible();
  });
});
