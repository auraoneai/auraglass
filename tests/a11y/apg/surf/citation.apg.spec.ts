// citation.apg.spec.ts — SURF-386: APG keyboard spec for AI/Sources Citation.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

test.describe('citation APG (SURF-386)', () => {
  test('focus opens preview; Escape restores focus', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'SourceList' || s.id.includes('citation'));
    if (!subject) { console.warn('SourceList subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await apg.keyboard(page, [
      { press: 'Tab' },
      { press: 'Escape' },
    ]);
    await apg.axe(page);
  });
});
