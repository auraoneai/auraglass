/* @ag-contract-seed: FND-092. APG keyboard + axe spec for FileUpload (lane 3g).
   Runs on the remote Playwright lanes (tests/e2e, tests/a11y); no local browsers
   per machine policy — this file registers the script for remote execution. */
import { test } from '@playwright/test';
import { gotoStory } from '../../helpers/index';
import { apg } from './harness';

test.describe('file-upload APG (FND-092)', () => {
  test('dropzone is focusable, Enter opens picker, item remove reachable', async ({ page }) => {
    await gotoStory(page, 'core-file-upload--default');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'dropzone' },
      { press: 'Tab', expectFocus: 'remove' },
      { press: 'Enter' },
    ]);
    await apg.axe(page);
  });
});
