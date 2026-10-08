/* @ag-contract-seed: FND-093. APG keyboard + axe spec for ColorPicker (lane 3g).
   Runs on the remote Playwright lanes (tests/e2e, tests/a11y); no local browsers
   per machine policy — this file registers the script for remote execution. */
import { test } from '@playwright/test';
import { gotoStory } from '../../helpers/index';
import { apg } from './harness';

test.describe('color-picker APG (FND-093)', () => {
  test('area is the single tab stop; arrows step ±1%, Shift ±10%', async ({ page }) => {
    await gotoStory(page, 'core-color-picker--default');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'trigger' },
      { press: 'Enter' },
      { press: 'Tab', expectFocus: 'area' },
      { press: 'ArrowRight' },
      { press: 'Shift+ArrowRight' },
      { press: 'ArrowDown' },
      { press: 'Escape' },
    ]);
    await apg.axe(page);
  });
});
