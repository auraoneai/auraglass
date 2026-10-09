/* REQ-CMP-130 (lane L10): the T2 composite page (~20 components) must stay
   quiet — at most one element with computed backdrop-filter !== 'none'.
   Remote perf lane only (AG_REMOTE_RUNNER=1). */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');

test.describe('T2 page quietness (REQ-CMP-130)', () => {
  test('pages-t2--default renders <=1 blurred surface', async ({ page }) => {
    await gotoStory(page, 'pages-t2--default');
    expect(await perf.blurredSurfaces(page)).toBeLessThanOrEqual(1);
  });
});
