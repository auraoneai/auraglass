/* REQ-MAT-44 (REQ-MOT-20): calm gives *infinite* animations `animation: none`
 * and keeps finite ones (opacity cross-fades keep token durations). Compared per
 * motion subject story against motion=full on the same engine/project:
 *  - every animation declared with a finite iteration count under full is
 *    still declared (same name, same count) under calm;
 *  - no part, surface or ::before/::after declares an infinite animation under
 *    calm.
 * Reads computed animation-name / animation-iteration-count, so the result does
 * not depend on timing. Remote only (ci/mat.gitlab-ci.yml mat:test:motion-settle). */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';
import { declaredAnimations, type DeclaredAnimation } from './helpers/settle';

const key = (a: DeclaredAnimation) => `${a.target}:${a.name}×${a.iterations}`;

test('calm stops infinite animations and keeps finite ones', async ({ page }, info) => {
  const subjects = (await listSubjects({ tags: ['mat:motion'] })).map((s) => s.id);
  expect(subjects.length, 'motion subjects present').toBeGreaterThan(0);
  const root = page.locator('[data-ag-root]');

  const finiteUnderFull: string[] = [];
  for (const id of subjects) {
    await gotoStory(page, id, { motion: 'full' });
    const full = await declaredAnimations(root);
    await gotoStory(page, id, { motion: 'calm' });
    const calm = await declaredAnimations(root);

    const finite = full.filter((a) => a.iterations !== 'infinite').map(key);
    finiteUnderFull.push(...finite);
    const calmKeys = calm.map(key);
    expect(
      finite.filter((k) => !calmKeys.includes(k)),
      `${id} @${info.project.name}: finite animations removed by calm`,
    ).toEqual([]);
    expect(
      calm.filter((a) => a.iterations === 'infinite').map(key),
      `${id} @${info.project.name}: infinite animations surviving calm`,
    ).toEqual([]);
  }
  // the comparison is only meaningful if the subject set exercises a finite animation
  expect(finiteUnderFull.length, 'motion subjects declare at least one finite animation').toBeGreaterThan(0);
});
