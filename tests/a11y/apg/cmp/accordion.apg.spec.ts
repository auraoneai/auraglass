
/* CMP-351 (lane 3i-Q). Accordion APG: Tab to triggers, Enter/Space toggle,
   aria-expanded flips, trigger inside h3, no role=tab. axe colour contrast on. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('accordion APG (CMP-351)', () => {
  test('keyboard contract: triggers are buttons inside headings', async ({ page }) => {
    await gotoStory(page, 'core-accordion--keyboard');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'role=button[name=Shipping]' },
      { press: 'Enter', expectState: { 'aria-expanded': 'true' } },
      { press: 'Space', expectState: { 'aria-expanded': 'false' } },
      /* roving arrow navigation across headers (REQ-CMP-121): each step names
         the trigger that must hold focus, so a no-op key fails. */
      { press: 'ArrowDown', expectFocus: 'role=button[name=Returns]' },
      { press: 'ArrowDown', expectFocus: 'role=button[name=Warranty]' },
      { press: 'ArrowUp', expectFocus: 'role=button[name=Returns]' },
      { press: 'End', expectFocus: 'role=button[name=Warranty]' },
      { press: 'Home', expectFocus: 'role=button[name=Shipping]' },
      // triggers stay in the Tab order: Tab moves to the next header
      { press: 'Tab', expectFocus: 'role=button[name=Returns]' },
    ]);
    // the arrow keys only moved focus: no section was toggled on the way
    for (const t of await page.locator('[data-ag-part="trigger"]').all()) {
      expect(await t.getAttribute('aria-expanded')).toBe('false');
    }
    const triggers = page.locator('[data-ag-part="trigger"]');
    expect(await triggers.count()).toBe(3);
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
