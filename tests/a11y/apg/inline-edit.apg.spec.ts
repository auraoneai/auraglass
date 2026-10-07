/* @ag-contract-seed: FND-091. APG keyboard + axe spec for InlineEdit (lane 3g).
   Runs on the remote Playwright lanes (tests/e2e, tests/a11y); no local browsers
   per machine policy — this file registers the script for remote execution. */
import { test } from '@playwright/test';
import { gotoStory } from '../../helpers/index';
import { apg } from './harness';

test.describe('inline-edit APG (FND-091)', () => {
  test('button→textbox activation, Enter commit, Escape cancel', async ({ page }) => {
    await gotoStory(page, 'core-inline-edit--default');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'trigger' },
      { press: 'Enter', expectFocus: 'input' },
      { type: 'updated' },
      { press: 'Enter', expectFocus: 'trigger' },
      { press: 'Enter', expectFocus: 'input' },
      { type: 'ignored' },
      { press: 'Escape', expectFocus: 'trigger' },
    ]);
    await apg.axe(page);
  });
});
