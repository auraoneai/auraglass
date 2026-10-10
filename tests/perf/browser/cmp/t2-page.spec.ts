/* REQ-CMP-130 (lane L10): the T2 composite page (~20 components) must stay
   quiet — at most one element with computed backdrop-filter !== 'none'.
   Runs only in the remote L10 perf lane (.ag-playwright on GitLab CI);
   never invoked on a developer machine. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.describe('T2 page quietness (REQ-CMP-130)', () => {
  test('pages-t2--default renders <=1 blurred surface', async ({ page }) => {
    await gotoStory(page, 'pages-t2--default');
    expect(await perf.blurredSurfaces(page)).toBeLessThanOrEqual(1);
  });
});
