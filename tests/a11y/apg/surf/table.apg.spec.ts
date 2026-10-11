// REQ-SURF-73 (remote Playwright, L5): APG data grid keyboard script on the
// GridMode story — one tab stop, roving cell focus, arrows, Home/End,
// Ctrl+Home/End, PageDown/PageUp, Enter -> onRowAction, Space -> selection.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers';

async function gotoGrid(page: Page) {
  const subjects = await listSubjects({});
  const story = subjects.find((s) => s.subject === 'Table' && s.id.endsWith('--grid-mode'));
  expect(story, 'Table GridMode story must be registered').toBeDefined();
  await gotoStory(page, story!.id);
}

const focused = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return {
      row: el?.closest('[data-row-id]')?.getAttribute('data-row-id') ?? null,
      col: el?.getAttribute('data-ag-cell') ?? null,
      role: el?.getAttribute('role') ?? null,
    };
  });

test.describe('table grid APG (REQ-SURF-73)', () => {
  test('grid: keyboard script', async ({ page }) => {
    await gotoGrid(page);
    const grid = page.locator('[role="grid"]');
    await expect(grid).toHaveCount(1);
    await expect(grid.locator('[tabindex="0"]')).toHaveCount(1);
    await expect(grid.locator('[role="row"]').first()).toBeVisible();
    await expect(grid.locator('[role="gridcell"]').first()).toBeVisible();

    // the single tab stop is the first cell
    await grid.locator('[role="gridcell"][tabindex="0"]').focus();
    expect(await focused(page)).toEqual({ row: 'r0', col: 'name', role: 'gridcell' });

    await page.keyboard.press('ArrowRight');
    expect(await focused(page)).toMatchObject({ row: 'r0', col: 'qty' });
    await page.keyboard.press('ArrowDown');
    expect(await focused(page)).toMatchObject({ row: 'r1', col: 'qty' });
    await page.keyboard.press('End');
    expect(await focused(page)).toMatchObject({ row: 'r1', col: 'status' });
    await page.keyboard.press('Home');
    expect(await focused(page)).toMatchObject({ row: 'r1', col: 'name' });
    await page.keyboard.press('Control+End');
    expect(await focused(page)).toMatchObject({ row: 'r7', col: 'status' });
    await page.keyboard.press('Control+Home');
    expect(await focused(page)).toMatchObject({ row: 'r0', col: 'name' });
    // 8 rows all fit the viewport: PageDown goes to the last row, PageUp back
    await page.keyboard.press('PageDown');
    expect(await focused(page)).toMatchObject({ row: 'r7', col: 'name' });
    await page.keyboard.press('PageUp');
    expect(await focused(page)).toMatchObject({ row: 'r0', col: 'name' });
    // the roving tab stop followed focus
    await expect(grid.locator('[tabindex="0"]')).toHaveCount(1);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('row-action')).toHaveText('r1');
    await page.keyboard.press('Space');
    await expect(grid.locator('[data-row-id="r1"]')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Space');
    await expect(grid.locator('[data-row-id="r1"]')).toHaveAttribute('aria-selected', 'false');

    // Tab leaves the grid (single tab stop)
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="grid"]'))).toBe(false);
  });

  // REQ-SURF-68: a sort header activated from the keyboard cycles aria-sort
  // none -> ascending -> descending -> none (sortDescFirst false, removal on).
  test('sort header via keyboard: aria-sort transitions', async ({ page }) => {
    const subjects = await listSubjects({});
    const story = subjects.find((s) => s.subject === 'Table' && s.id.endsWith('--basic'));
    expect(story, 'Table Basic story must be registered').toBeDefined();
    await gotoStory(page, story!.id);
    const sortBtn = page.getByRole('button', { name: 'Sort by Quantity' });
    const th = page.locator('th', { has: sortBtn });
    await expect(th).toHaveAttribute('aria-sort', 'none');
    await sortBtn.focus();
    await page.keyboard.press('Enter');
    await expect(th).toHaveAttribute('aria-sort', 'ascending');
    await page.keyboard.press('Space');
    await expect(th).toHaveAttribute('aria-sort', 'descending');
    await page.keyboard.press('Enter');
    await expect(th).toHaveAttribute('aria-sort', 'none');
    // only one column is sorted at a time (enableMultiSort off)
    await page.keyboard.press('Enter');
    await expect(page.locator('th[aria-sort="ascending"], th[aria-sort="descending"]')).toHaveCount(1);
    // focus stays on the sort button across re-sorts
    await expect(sortBtn).toBeFocused();
  });

  test('column resize separator via keyboard', async ({ page }) => {
    const subjects = await listSubjects({});
    const story = subjects.find((s) => s.subject === 'Table' && s.id.endsWith('--resize-reorder'));
    expect(story, 'Table ResizeReorder story must be registered').toBeDefined();
    await gotoStory(page, story!.id);
    const sep = page.locator('[role="separator"]').first();
    await expect(sep).toHaveAttribute('aria-orientation', 'vertical');
    const start = Number(await sep.getAttribute('aria-valuenow'));
    await sep.focus();
    await page.keyboard.press('ArrowRight');
    await expect(sep).toHaveAttribute('aria-valuenow', String(start + 8));
    await page.keyboard.press('End');
    await expect(sep).toHaveAttribute('aria-valuenow', await sep.getAttribute('aria-valuemax') as string);
  });
});
