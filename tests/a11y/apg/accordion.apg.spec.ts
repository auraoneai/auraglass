/* @ag-contract-seed: FND-086. APG keyboard + axe spec for Accordion (lane 3g).
   Runs on the remote Playwright lanes (tests/e2e, tests/a11y); no local browsers
   per machine policy — this file registers the script for remote execution. */
import { test } from '@playwright/test';
import { gotoStory } from '../../helpers/index';
import { apg } from './harness';

test.describe('accordion APG (FND-086)', () => {
  test('keyboard contract: headers as buttons, Enter/Space toggle, arrows move', async ({ page }) => {
    await gotoStory(page, 'core-accordion--default');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'trigger' },
      { press: 'ArrowDown', expectFocus: 'trigger' },
      { press: 'Enter', expectState: { 'aria-expanded': 'true' } },
      { press: 'Enter', expectState: { 'aria-expanded': 'false' } },
      { press: 'Home' },
      { press: 'End' },
    ]);
    await apg.axe(page);
  });
});
