
/* CMP-363 (lane 3i-Q). Switch APG: role="switch"; Space toggles aria-checked;
   Enter behaves per Switch.meta migration table (toggles). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('switch APG (CMP-363)', () => {
  test('role=switch; Space and Enter toggle aria-checked', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-switch--default');
    const sw = page.getByRole('switch').first();
    await sw.focus();
    const before = await sw.getAttribute('aria-checked');
    await page.keyboard.press('Space');
    await expect(sw).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true');
    await page.keyboard.press('Enter');
    await expect(sw).toHaveAttribute('aria-checked', before ?? 'false');
    await apg.axe(page);
  });
});
