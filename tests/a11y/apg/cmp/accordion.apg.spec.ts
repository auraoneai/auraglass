
/* CMP-351 (lane 3i-Q). Accordion APG: Tab to triggers, Enter/Space toggle,
   aria-expanded flips, trigger inside h3, no role=tab. axe colour contrast on. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('accordion APG (CMP-351)', () => {
  test('keyboard contract: triggers are buttons inside headings', async ({ page }) => {
    await gotoStory(page, 'core-accordion--multiple');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'trigger' },
      { press: 'Enter', expectState: { 'aria-expanded': 'true' } },
      { press: 'Space', expectState: { 'aria-expanded': 'false' } },
      // roving arrow navigation across triggers (REQ-CMP-121)
      { press: 'ArrowDown', expectFocus: 'trigger' },
      { press: 'ArrowDown', expectFocus: 'trigger' },
      { press: 'ArrowUp', expectFocus: 'trigger' },
      { press: 'End', expectFocus: 'trigger' },
      { press: 'Home', expectFocus: 'trigger' },
      { press: 'Tab', expectFocus: 'trigger' },
    ]);
    const triggers = page.locator('[data-ag-part="trigger"]');
    expect(await triggers.count()).toBeGreaterThanOrEqual(2);
    for (const t of await triggers.all()) {
      const inHeading = await t.evaluate((el) => !!el.closest('h3'));
      expect(inHeading).toBe(true);
      expect(await t.getAttribute('role')).not.toBe('tab');
    }
    await apg.axe(page, { colorContrast: true });
  });

  test('headingLevel story renders trigger inside an h4', async ({ page }) => {
    await gotoStory(page, 'core-accordion--heading-level');
    const trigger = page.locator('[data-ag-part="trigger"]');
    expect(await trigger.evaluate((el) => !!el.closest('h4'))).toBe(true);
  });
});
