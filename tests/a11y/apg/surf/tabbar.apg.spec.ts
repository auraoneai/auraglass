// tabbar.apg.spec.ts — SURF-074: APG nav tabs keyboard script over the shipped subject.
// Remote lane; a missing subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'TabBar';

test.describe('APG nav tabs (SURF)', () => {
  test('keyboard contract', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === SUBJECT);
    if (!subject) throw new Error(`${SUBJECT} subject not registered`);
    await gotoStory(page, subject.id);
    await apg.keyboard(page, SCRIPT);
  });

  test('axe clean', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === SUBJECT);
    if (!subject) throw new Error(`${SUBJECT} subject not registered`);
    await gotoStory(page, subject.id);
    await apg.axe(page);
    const res = await page.evaluate(() => []);
    expect(res).toEqual([]);
  });
});

const SCRIPT = [{ press: 'Tab' }, { press: 'ArrowRight' }, { press: 'Enter' }];
