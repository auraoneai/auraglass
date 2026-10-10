// APG date-grid pattern (SURF L5 apg lane, REQ-SURF-100): one tab stop,
// arrow / Home / End / PageUp / PageDown / Shift+Page navigation (focused
// cell and heading asserted), Enter/Space selection, unavailable cell
// aria-disabled yet focusable, week-number rowheaders, coarse 44px cells.
// Subject: src/date/Calendar.stories.tsx Default (en-US, 2026-10-07 selected,
// 2026-10-13 unavailable, week numbers on).
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from '../../../e2e/surf/date/subjects';

const focused = (page: Page) => page.locator('[role="grid"] :focus');
const heading = (page: Page) => page.locator('.ag-calendar__heading');

async function focusGrid(page: Page) {
  const id = await requireStory('Calendar', 'default');
  await gotoStory(page, id);
  const grid = page.locator('[role="grid"]').first();
  await expect(grid).toBeVisible();
  // One tab stop: exactly one cell is in the tab order.
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1);
  await grid.locator('[tabindex="0"]').focus();
  await expect(focused(page)).toHaveAttribute('aria-label', /October 7, 2026/);
}

test.describe('calendar APG (REQ-SURF-100)', () => {
  test('arrow, Home/End and paging keys move the focused date', async ({ page }) => {
    await focusGrid(page);
    await page.keyboard.press('ArrowRight');
    await expect(focused(page)).toHaveAttribute('aria-label', /October 8, 2026/);
    await page.keyboard.press('ArrowLeft');
    await expect(focused(page)).toHaveAttribute('aria-label', /October 7, 2026/);
    await page.keyboard.press('ArrowDown');
    await expect(focused(page)).toHaveAttribute('aria-label', /October 14, 2026/);
    await page.keyboard.press('ArrowUp');
    await expect(focused(page)).toHaveAttribute('aria-label', /October 7, 2026/);
    await page.keyboard.press('Home');
    await expect(focused(page)).toHaveAttribute('aria-label', /Sunday, October 4, 2026/);
    await page.keyboard.press('End');
    await expect(focused(page)).toHaveAttribute('aria-label', /Saturday, October 10, 2026/);
    await page.keyboard.press('PageDown');
    await expect(focused(page)).toHaveAttribute('aria-label', /November 10, 2026/);
    await expect(heading(page)).toHaveText('November 2026');
    await page.keyboard.press('PageUp');
    await expect(focused(page)).toHaveAttribute('aria-label', /October 10, 2026/);
    await expect(heading(page)).toHaveText('October 2026');
    await page.keyboard.press('Shift+PageDown');
    await expect(focused(page)).toHaveAttribute('aria-label', /October 10, 2027/);
    await expect(heading(page)).toHaveText('October 2027');
    await page.keyboard.press('Shift+PageUp');
    await expect(focused(page)).toHaveAttribute('aria-label', /October 10, 2026/);
    await expect(heading(page)).toHaveText('October 2026');
    // Still a single tab stop after navigation.
    await expect(page.locator('[role="grid"] [tabindex="0"]')).toHaveCount(1);
  });

  test('Enter and Space select the focused date (aria-selected)', async ({ page }) => {
    await focusGrid(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.locator('[role="gridcell"][aria-selected="true"]')).toHaveCount(1);
    await expect(page.locator('[role="gridcell"][aria-selected="true"] [role="button"]')).toHaveAttribute('aria-label', /October 8, 2026/);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await expect(page.locator('[role="gridcell"][aria-selected="true"] [role="button"]')).toHaveAttribute('aria-label', /October 9, 2026/);
  });

  test('an unavailable date is aria-disabled yet focusable', async ({ page }) => {
    await focusGrid(page);
    await page.keyboard.press('ArrowDown'); // Oct 14
    await page.keyboard.press('ArrowLeft'); // Oct 13 (unavailable)
    await expect(focused(page)).toHaveAttribute('aria-label', /October 13, 2026/);
    await expect(focused(page)).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('Enter');
    await expect(page.locator('[role="gridcell"][aria-selected="true"] [role="button"]')).toHaveAttribute('aria-label', /October 7, 2026/);
  });

  test('week numbers: one rowheader per week row', async ({ page }) => {
    await focusGrid(page);
    const rows = page.locator('[role="grid"] tbody tr');
    const n = await rows.count();
    expect(n).toBeGreaterThanOrEqual(5);
    expect(n).toBeLessThanOrEqual(6);
    await expect(page.locator('[role="grid"] [role="rowheader"]')).toHaveCount(n);
    for (let i = 0; i < n; i++) {
      await expect(rows.nth(i).locator('[role="rowheader"]')).toHaveCount(1);
      await expect(rows.nth(i).locator('[role="gridcell"]')).toHaveCount(7);
    }
  });
});

test.describe('calendar APG coarse pointer (REQ-SURF-100)', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test('every day cell box is at least 44x44', async ({ page }) => {
    await focusGrid(page);
    const cells = page.locator('[role="gridcell"] .ag-calendar__cell');
    const count = await cells.count();
    expect(count).toBeGreaterThanOrEqual(28);
    for (let i = 0; i < count; i++) {
      const box = await cells.nth(i).boundingBox();
      expect(box, `cell ${i} has a box`).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });
});
