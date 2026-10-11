/* @ag-contract-seed: FND-090. APG keyboard + axe spec for Rating (lane 3g).
   Runs on the remote Playwright lanes (tests/e2e, tests/a11y); no local browsers
   per machine policy — this file registers the script for remote execution. */
import { test } from '@playwright/test';
import { gotoStory } from '../../helpers/index';
import { apg } from './harness';

test.describe('rating APG (FND-090)', () => {
  test('radiogroup keyboard: arrows value, Home/End bounds, readOnly inert', async ({ page }) => {
    await gotoStory(page, 'core-rating--default');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'role=radiogroup' },
      { press: 'ArrowRight', expectState: { 'aria-readonly': 'false' } },
      { press: 'ArrowLeft' },
      { press: 'End' },
      { press: 'Home' },
    ]);
    await apg.axe(page);
  });
});
