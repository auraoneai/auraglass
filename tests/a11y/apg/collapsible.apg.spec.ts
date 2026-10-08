/* @ag-contract-seed: FND-087. APG keyboard + axe spec for Collapsible (lane 3g).
   Runs on the remote Playwright lanes (tests/e2e, tests/a11y); no local browsers
   per machine policy — this file registers the script for remote execution. */
import { test } from '@playwright/test';
import { gotoStory } from '../../helpers/index';
import { apg } from './harness';

test.describe('collapsible APG (FND-087)', () => {
  test('disclosure: Space/Enter toggle, aria-expanded mirrors data-state', async ({ page }) => {
    await gotoStory(page, 'core-collapsible--default');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'trigger' },
      { press: 'Enter', expectState: { 'aria-expanded': 'true' } },
      { press: 'Enter', expectState: { 'aria-expanded': 'false' } },
    ]);
    await apg.axe(page);
  });
});
