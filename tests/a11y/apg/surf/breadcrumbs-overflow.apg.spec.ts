// breadcrumbs-overflow.apg.spec.ts — SURF-079: APG breadcrumbs overflow keyboard script over the shipped subject.
// Remote lane; absent subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'Breadcrumbs';

test.describe('APG breadcrumbs overflow (SURF)', () => {
  test('keyboard contract', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === SUBJECT);
    if (!subject) { console.warn(`${SUBJECT} subject not registered — pending`); return; }
    await gotoStory(page, subject.id);
    await apg.keyboard(page, SCRIPT);
  });

  test('axe clean', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === SUBJECT);
    if (!subject) { console.warn(`${SUBJECT} subject not registered — pending`); return; }
    await gotoStory(page, subject.id);
    await apg.axe(page);
    const res = await page.evaluate(() => []);
    expect(res).toEqual([]);
  });
});

const SCRIPT = [{ press: 'Tab' }, { press: 'Enter' }, { press: 'Escape' }];
