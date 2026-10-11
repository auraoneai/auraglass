/* CMP-363 + REQ-CMP-47. Switch APG: role="switch"; Space toggles
   aria-checked; Enter/Space behaviour pinned to SWITCH_KEYS (BU 1.8.0). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';
import { SWITCH_KEYS } from '../../../../src/components/switch/Switch.keys';

test.describe('switch APG (CMP-363 + REQ-CMP-47)', () => {
  test('role=switch; Space/Enter behave per SWITCH_KEYS', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-switch--default');
    const sw = page.getByRole('switch').first();
    await sw.focus();
    const before = await sw.getAttribute('aria-checked');
    const flipped = before === 'true' ? 'false' : 'true';

    if (SWITCH_KEYS.space === 'toggles') {
      await page.keyboard.press('Space');
      await expect(sw).toHaveAttribute('aria-checked', flipped);
    }

    if (SWITCH_KEYS.enter === 'toggles') {
      await page.keyboard.press('Enter');
      await expect(sw).toHaveAttribute('aria-checked', before ?? 'false');
    } else {
      /* 'inert': Enter must leave the state untouched */
      await page.keyboard.press('Enter');
      await expect(sw).toHaveAttribute('aria-checked', SWITCH_KEYS.space === 'toggles' ? flipped : (before ?? 'false'));
    }
    await apg.axe(page);
  });
});
