/* MAT-237 self-test: exercises frames/settle/idle against the lab fixture
 * story with a known transition (Motion Lab/TabsMorph has a 240 ms pill
 * transform transition; Sweep has an infinite ag-sweep). */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';
import { frames, countDistinctFrames } from './helpers/frames';
import { settle } from './helpers/settle';
import { instrumentIdle, idleFor } from './helpers/idle';

const labId = async (name: string) => {
  const subs = await listSubjects();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (subs.find((s) => norm(s.id).includes(norm(name))) ??
    subs.find((s) => norm(s.subject).includes(norm(name))))?.id ?? null;
};

test('frames() samples a known transition: >= 2 distinct frames of 12', async ({ page }) => {
  const id = await labId('TabsMorph');
  expect(id, 'Motion Lab TabsMorph story present').toBeTruthy();
  await gotoStory(page, id!, { motion: 'full' });
  const root = page.locator('[data-ag-root]');
  // trigger the pill transition
  await root.locator('[data-ag-part="tab"][data-index="1"]').click();
  await page.evaluate(() => {
    document.querySelector('.aglab-tab-pill')?.setAttribute('data-on', '1');
  });
  const res = await frames(page, root, { samples: 12 });
  expect(res.samples.length).toBe(12);
  const distinct = await countDistinctFrames(res.samples);
  expect(distinct, 'the pill transition yields distinct frames').toBeGreaterThanOrEqual(2);
});

test('settle() passes on a rest story and fails on a running sweep', async ({ page }) => {
  const rest = await labId('LayoutRest');
  expect(rest).toBeTruthy();
  await gotoStory(page, rest!, { motion: 'full' });
  const root = page.locator('[data-ag-root]');
  const res = await settle(root, { waitMs: 100 });
  expect(res.pass, JSON.stringify(res)).toBe(true);

  const sweep = await labId('Sweep');
  expect(sweep).toBeTruthy();
  await gotoStory(page, sweep!, { motion: 'full' });
  await root.evaluate((el) => (el as HTMLElement).setAttribute('data-ag-continuous', 'on'));
  const res2 = await settle(root, { waitMs: 100 });
  expect(res2.runningAnimations).toBeGreaterThanOrEqual(1);
  expect(res2.pass).toBe(false);
});

test('idle counter attributes rAF activity', async ({ page }) => {
  await instrumentIdle(page);
  const rest = await labId('LayoutRest');
  await gotoStory(page, rest!, { motion: 'full' });
  // a rAF the spec itself schedules must be counted; stack belongs to the spec
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(0))));
  const idle = await idleFor(page, 300);
  expect(idle.rafCount).toBeGreaterThanOrEqual(1);
});
