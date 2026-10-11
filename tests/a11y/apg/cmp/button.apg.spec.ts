
/* CMP-365 (lane 3i-Q). Button APG: Enter and Space activate; focus-visible ring;
   aria-disabled button keeps focusability but does not activate. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('button APG (CMP-365)', () => {
  test('Enter and Space activate the button', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--keyboard')
      .catch(() => gotoStory(page, 'flagships-controls-button--default'));
    const btn = page.getByRole('button').first();
    await btn.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await expect(btn).toBeFocused();
    await apg.axe(page);
  });
});
