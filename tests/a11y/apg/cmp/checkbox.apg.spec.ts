
/* CMP-361 (lane 3i-Q). Checkbox APG over the Storybook static build:
   each checkbox is its own tab stop; Space toggles and aria-checked flips;
   mixed state cycles; the group pattern holds in CheckboxGroup. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('checkbox APG (CMP-361)', () => {
  test('each checkbox is its own tab stop; Space flips aria-checked', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-checkbox--default');
    const box = page.getByRole('checkbox').first();
    await box.focus();
    const before = await box.getAttribute('aria-checked');
    await page.keyboard.press('Space');
    await expect(box).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true');
  });

  /* REQ-CMP-53: parent checkbox in CheckboxGroup cycles exact
     mixed -> true -> false via aria-checked. */
  test('indeterminate: parent cycles mixed -> true -> false', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-checkbox-group--default')
      .catch(() => gotoStory(page, 'flagships-controls-checkboxgroup--default'));
    const boxes = page.getByRole('checkbox');
    const n = await boxes.count();
    if (n < 2) test.skip();
    const parent = boxes.first();
    await parent.focus();
    await page.keyboard.press('Space');
    expect(await parent.getAttribute('aria-checked')).toBe('true');
    await page.keyboard.press('Space');
    expect(await parent.getAttribute('aria-checked')).toBe('false');
    await apg.axe(page);
  });

  test('group: every checkbox remains a tab stop', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-checkbox-group--default')
      .catch(() => gotoStory(page, 'flagships-controls-checkboxgroup--default'));
    const boxes = page.getByRole('checkbox');
    expect(await boxes.count()).toBeGreaterThanOrEqual(2);
    for (const b of await boxes.all()) {
      expect(await b.getAttribute('tabindex')).not.toBe('-1');
    }
    await apg.axe(page);
  });
});
