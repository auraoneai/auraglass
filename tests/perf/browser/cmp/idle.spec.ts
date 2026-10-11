/* REQ-CMP-16: settled-idle contract — 500 ms after a story settles, zero
   pending requestAnimationFrame and zero infinite CSS animations across one
   story per CMP family. Remote perf lane only (AG_REMOTE_RUNNER=1). */
import { test, expect } from '@playwright/test';
import { gotoStory, perf, listSubjects } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');

test.describe('cmp idle contract (REQ-CMP-16)', () => {
  const FAMILIES = ['dialog', 'sheet', 'popover', 'tooltip', 'menu', 'toast', 'select', 'combobox', 'skeleton', 'progress'];

  test('one story per family: 0 pending rAF + 0 infinite animations 500 ms after settle', async ({ page }) => {
    const subjects = await listSubjects();
    const picked = FAMILIES.map((f) => subjects.find((s) => s.id.includes(f))).filter(Boolean);
    test.skip(picked.length === 0, 'no CMP subjects registered yet');
    for (const subject of picked) {
      await gotoStory(page, subject!.id);
      const idle = await perf.settledIdle(page, { afterMs: 500 });
      expect(idle.pendingRaf, `${subject!.id}: pending rAF after settle`).toBe(0);
      expect(idle.infiniteAnimations, `${subject!.id}: infinite animations running`).toBe(0);
    }
  });
});
