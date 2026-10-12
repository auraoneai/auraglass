
/* CMP-361 (lane 3i-Q). Checkbox APG over the Storybook static build:
   each checkbox is its own tab stop; Space toggles and aria-checked flips;
   mixed state cycles; the group pattern holds in CheckboxGroup. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('checkbox APG (CMP-361)', () => {
  test('each checkbox is its own tab stop; Space flips aria-checked', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-checkbox--keyboard');
    const box = page.getByRole('checkbox').first();
    await box.focus();
    const before = await box.getAttribute('aria-checked');
    await page.keyboard.press('Space');
    await expect(box).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true');
  });

  /* REQ-CMP-53: a parent checkbox over a partly selected group starts at
     aria-checked="mixed" and Space cycles it exactly mixed -> true -> false,
     selecting and then clearing every child. */
  test('indeterminate: parent cycles mixed -> true -> false', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-checkbox--parent-keyboard');
    const parent = page.getByRole('checkbox', { name: 'All workspaces' });
    const children = [
      page.getByRole('checkbox', { name: 'Design' }),
      page.getByRole('checkbox', { name: 'Research' }),
    ];
    await expect(parent).toHaveAttribute('aria-checked', 'mixed');
    await parent.focus();
    await page.keyboard.press('Space');
    await expect(parent).toHaveAttribute('aria-checked', 'true');
    for (const c of children) await expect(c).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('Space');
    await expect(parent).toHaveAttribute('aria-checked', 'false');
    for (const c of children) await expect(c).toHaveAttribute('aria-checked', 'false');
    await apg.axe(page);
  });

  test('group: every checkbox remains a tab stop', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-checkboxgroup--keyboard');
    const boxes = page.getByRole('checkbox');
    expect(await boxes.count()).toBeGreaterThanOrEqual(2);
    for (const b of await boxes.all()) {
      expect(await b.getAttribute('tabindex')).not.toBe('-1');
    }
    await apg.axe(page);
  });
});
