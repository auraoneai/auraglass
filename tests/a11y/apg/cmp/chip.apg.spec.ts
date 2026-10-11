/* CMP-354 (lane 3i-Q). Chip APG: Space/Enter toggle aria-pressed on selectable
   chips; remove button reachable by Tab and named "Remove {label}"; activating it
   fires removal and moves focus to the next chip. No conditional assertions
   (E3.3, REQ-FIN-74 rule): every step is asserted unconditionally. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

const CHIP = '.ag-chip[data-ag-part="root"]';

test.describe('chip APG (CMP-354)', () => {
  test('selectable chips toggle aria-pressed with Space and Enter', async ({ page }) => {
    await gotoStory(page, 'core-chip--default');
    const chip = page.locator(CHIP);
    await expect(chip).toHaveCount(1);
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await chip.focus();
    await page.keyboard.press('Space');
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await apg.axe(page);
  });

  test('remove button is named and removes its chip, focus moves on', async ({ page }) => {
    await gotoStory(page, 'core-chip--removable');
    const chips = page.locator(CHIP);
    await expect(chips).toHaveCount(3);
    const remove = page.getByRole('button', { name: 'Remove Beta', exact: true });
    await expect(remove).toHaveCount(1);
    await expect(page.locator('[data-ag-part="close"]')).toHaveCount(3);

    // Reachable by Tab from its chip.
    await page.getByRole('button', { name: 'Beta', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(remove).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(chips).toHaveCount(2);
    await expect(chips).toHaveText(['Alpha', 'Gamma']);
    await expect(page.getByRole('button', { name: 'Remove Beta', exact: true })).toHaveCount(0);
    // Focus moves to the next chip, never to <body>.
    await expect(page.getByRole('button', { name: 'Gamma', exact: true })).toBeFocused();

    // Removing the last chip moves focus to the previous one.
    await page.getByRole('button', { name: 'Remove Gamma', exact: true }).focus();
    await page.keyboard.press('Space');
    await expect(chips).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Alpha', exact: true })).toBeFocused();
    await apg.axe(page);
  });
});
