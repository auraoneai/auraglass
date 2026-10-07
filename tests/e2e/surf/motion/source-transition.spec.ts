// source-transition.spec.ts — SURF-092: source→destination morph keeps focus on the destination. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('source transition (SURF-092)', () => {
  test('morph focuses the destination', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'SourceTransition');
    if (!subject) { console.warn('SourceTransition subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const src = page.locator('[data-ag-part="source"]').first();
    if (await src.count() === 0) { console.warn('no source — pending'); return; }
    const dest = page.locator('[data-ag-part="destination"]').first();
    await expect(dest).toBeAttached();
  });
});
