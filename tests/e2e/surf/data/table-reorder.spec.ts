// REQ-SURF-78 (remote Playwright, L5): column reorder through the CMP column
// menu on the ResizeReorder story — keyboard-open the "Column actions <col>"
// trigger, Move right / Move left, header order follows, ends are disabled.
import { test, expect, type Page } from '@playwright/test';
import { gotoTableStory } from './table-story';

const headerOrder = (page: Page) =>
  page.locator('thead th [data-ag-part="table-sort-trigger"]').allTextContents();

test.describe('table column menu reorder (REQ-SURF-78)', () => {
  test('Move right / Move left from the keyboard', async ({ page }) => {
    await gotoTableStory(page, 'resize-reorder');
    expect(await headerOrder(page)).toEqual(['Name', 'Qty', 'Status']);

    const trigger = page.getByRole('button', { name: 'Column actions Name' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Move left' })).toHaveAttribute('aria-disabled', 'true');
    await menu.getByRole('menuitem', { name: 'Move right' }).click();
    await expect(menu).toBeHidden();
    expect(await headerOrder(page)).toEqual(['Qty', 'Name', 'Status']);

    await page.getByRole('button', { name: 'Column actions Status' }).click();
    await expect(page.getByRole('menuitem', { name: 'Move right' })).toHaveAttribute('aria-disabled', 'true');
    await page.getByRole('menuitem', { name: 'Move left' }).click();
    expect(await headerOrder(page)).toEqual(['Qty', 'Status', 'Name']);
  });
});
