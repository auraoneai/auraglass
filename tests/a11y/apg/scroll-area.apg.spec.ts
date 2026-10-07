/* @ag-contract-seed: FND-088. APG keyboard + axe spec for ScrollArea (lane 3g).
   Runs on the remote Playwright lanes (tests/e2e, tests/a11y); no local browsers
   per machine policy — this file registers the script for remote execution. */
import { test } from '@playwright/test';
import { gotoStory } from '../../helpers/index';
import { apg } from './harness';

test.describe('scroll-area APG (FND-088)', () => {
  test('overflowing viewport is keyboard-focusable and scrolls with arrows', async ({ page }) => {
    await gotoStory(page, 'core-scroll-area--default');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'viewport' },
      { press: 'ArrowDown' },
      { press: 'PageDown' },
      { press: 'End' },
      { press: 'Home' },
    ]);
    await apg.axe(page);
  });
});
