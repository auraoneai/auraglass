// date locale (SURF L5 e2e lane, REQ-SURF-98): the pickers resolve locale and
// direction from the closest [lang]/[dir] (no locale prop in these stories).
// ar-EG: dir=rtl and Arabic-Indic digits; ja-JP: year → month → day order;
// de-DE: day-first order and Monday as the first calendar column.
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from './subjects';

const segmentTypes = async (page: import('@playwright/test').Page) =>
  page.locator('[data-ag-part="date-input"] [role="spinbutton"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-type')));

test.describe('date locale (REQ-SURF-98)', () => {
  test('ar-EG: right-to-left with Arabic-Indic digits', async ({ page }) => {
    await gotoStory(page, await requireStory('DatePicker', 'locale-ar-eg'));
    const picker = page.locator('[data-ag-part="date-picker"]');
    await expect(picker).toHaveAttribute('dir', 'rtl');
    expect(await picker.evaluate((el) => getComputedStyle(el).direction)).toBe('rtl');
    const year = page.locator('[data-ag-part="date-input"] [role="spinbutton"][data-type="year"]');
    await expect(year).toHaveText('٢٠٢٦');
    await page.getByRole('button', { name: 'Choose date' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('dir', 'rtl');
    await expect(dialog.locator('.ag-calendar__cell[data-selected]')).toHaveText('١٥');
  });

  test('ja-JP: year, month, day segment order', async ({ page }) => {
    await gotoStory(page, await requireStory('DatePicker', 'locale-ja-jp'));
    await expect.poll(() => segmentTypes(page)).toEqual(['year', 'month', 'day']);
  });

  test('de-DE: day-first segments and Monday as the first column header', async ({ page }) => {
    await gotoStory(page, await requireStory('DatePicker', 'locale-de-de'));
    await expect.poll(() => segmentTypes(page)).toEqual(['day', 'month', 'year']);
    await page.getByRole('button', { name: 'Choose date' }).click();
    const dialog = page.getByRole('dialog', { name: 'Datum' });
    await expect(dialog).toBeVisible();
    // First column = Monday (narrow "M"); the first cell of a row is a Monday.
    await expect(dialog.locator('[role="grid"] thead th').first()).toHaveText('M');
    await expect(dialog.locator('[role="grid"] tbody tr').first().locator('[role="button"]').first()).toHaveAttribute('aria-label', /^Montag/);
  });
});
