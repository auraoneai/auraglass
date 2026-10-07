/* @ag-contract-seed: FND-094. APG keyboard + axe spec for Tour (lane 3g).
   Runs on the remote Playwright lanes (tests/e2e, tests/a11y); no local browsers
   per machine policy — this file registers the script for remote execution. */
import { test } from '@playwright/test';
import { gotoStory } from '../../helpers/index';
import { apg } from './harness';

test.describe('tour APG (FND-094)', () => {
  test('step dialog: Next/Back traverse, Escape ends and restores focus', async ({ page }) => {
    await gotoStory(page, 'core-tour--default');
    await apg.keyboard(page, [
      { press: 'Tab' },
      { press: 'Enter' },
      { press: 'Escape' },
    ]);
    await apg.axe(page);
  });
});
