
/* CMP-352 (lane 3i-Q). Collapsible APG: Enter/Space toggle, aria-expanded,
   panel visibility; axe 0 serious/critical. SC-30 superset of the A11Y seed. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('collapsible APG (CMP-352)', () => {
  test('Enter/Space toggles panel and aria-expanded', async ({ page }) => {
    await gotoStory(page, 'core-collapsible--default');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'trigger' },
      { press: 'Enter', expectState: { 'aria-expanded': 'true' } },
    ]);
    await expect(page.locator('[data-ag-part="panel"]')).toBeVisible();
    await apg.keyboard(page, [
      { press: 'Space', expectState: { 'aria-expanded': 'false' } },
    ]);
    await expect(page.locator('[data-ag-part="panel"]')).toBeHidden();
    await apg.axe(page);
  });
});
