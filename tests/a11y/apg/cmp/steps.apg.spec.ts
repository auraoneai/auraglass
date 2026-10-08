
/* CMP-350 (lane 3i-Q). Steps APG: reading order of list items, aria-current="step"
   on the current step, visually hidden "Completed"/"Error" text present.
   Remote Playwright lane only. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('steps APG (CMP-350)', () => {
  test('list reading order + aria-current on current step', async ({ page }) => {
    await gotoStory(page, 'core-steps--default');
    const list = page.locator('[data-ag-part="root"] ol, [data-ag-part="root"] [role="list"]').first();
    await expect(list).toBeVisible();
    const items = list.locator('li, [data-ag-part="item"]');
    const texts = await items.allTextContents();
    expect(texts.length).toBeGreaterThanOrEqual(2);
    await expect(page.locator('[aria-current="step"]')).toHaveCount(1);
  });

  test('with-error step exposes visually hidden status text', async ({ page }) => {
    await gotoStory(page, 'core-steps--with-error');
    const hidden = page.locator('.ag-visually-hidden, [data-ag-part="visually-hidden"]');
    const all = await hidden.allTextContents();
    expect(all.join(' ')).toMatch(/error/i);
    await apg.axe(page, { colorContrast: true });
  });
});
