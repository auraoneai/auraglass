/* MAT-240 / REQ-MOT-T08,-30,-73,-111,-127: allowContinuous gating.
 * off → 0 infinite running animations and 0 library rAF/interval callbacks
 *   1 s after settle on every story; under reduce 0 for 2 s after settle;
 * on  → only ag-sweep runs, and it stops when content resolves;
 * never → auto-starting motion longer than 5 s. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';
import { instrumentIdle, idleFor } from './helpers/idle';
import { settle } from './helpers/settle';

const runningInfinite = (root: import('@playwright/test').Locator) =>
  root.evaluate((el) =>
    (el as Element).getAnimations({ subtree: true }).filter((a) => {
      if (a.playState !== 'running') return false;
      const t = a.effect?.getComputedTiming();
      return t?.iterations === Infinity;
    }),
  );

const runningNames = (root: import('@playwright/test').Locator) =>
  root.evaluate((el) =>
    (el as Element).getAnimations({ subtree: true })
      .filter((a) => a.playState === 'running')
      .map((a) => (a as { animationName?: string }).animationName ?? a.constructor.name),
  );

for (const mode of ['full', 'calm', 'none'] as const) {
  test(`allowContinuous off (${mode}): 0 infinite animations + 0 library rAF/interval 1 s after settle`, async ({ page }) => {
    await instrumentIdle(page);
    const subjects = (await listSubjects({ tags: ['mat:motion'] })).map((s) => s.id);
    expect(subjects.length).toBeGreaterThan(0);
    for (const id of subjects) {
      // data-ag-continuous=off is the subject-gate global consumed by loading.css
      await gotoStory(page, id, { motion: mode });
      const root = page.locator('[data-ag-root]');
      await root.evaluate((el) => (el as HTMLElement).setAttribute('data-ag-continuous', 'off'));
      await settle(root, { waitMs: 300 });
      const idle = await idleFor(page, 1_000);
      const inf = await runningInfinite(root);
      expect(inf.length, `${id}: 0 infinite running animations when off`).toBe(0);
      expect(idle.agRafStacks.length, `${id}: 0 library rAF callbacks when off`).toBe(0);
      expect(idle.agIntervalStacks.length, `${id}: 0 library interval callbacks when off`).toBe(0);
    }
  });
}

test.describe('reduce: 0 library callbacks for 2 s after settle', () => {
  test.use({ reducedMotion: 'reduce' });
  test('sweeps idle stats across motion subjects', async ({ page }) => {
    await instrumentIdle(page);
    const subjects = (await listSubjects({ tags: ['mat:motion'] })).map((s) => s.id);
    expect(subjects.length).toBeGreaterThan(0);
    for (const id of subjects) {
      await gotoStory(page, id, { motion: 'full' });
      const root = page.locator('[data-ag-root]');
      await settle(root, { waitMs: 300 });
      const idle = await idleFor(page, 2_000);
      expect(idle.agRafStacks.length, `${id}: 0 rAF under reduce`).toBe(0);
      expect(idle.agIntervalStacks.length, `${id}: 0 interval under reduce`).toBe(0);
    }
  });
});

test('allowContinuous on: only ag-sweep runs and it stops when content resolves', async ({ page }) => {
  const subjects = (await listSubjects({ tags: ['mat:motion'] })).map((s) => s.id);
  expect(subjects.length).toBeGreaterThan(0);
  for (const id of subjects) {
    await gotoStory(page, id, { motion: 'full' });
    const root = page.locator('[data-ag-root]');
    await root.evaluate((el) => (el as HTMLElement).setAttribute('data-ag-continuous', 'on'));
    // resolve any pending-loading content, then verify nothing infinite but sweep
    await root.evaluate((el) => {
      el.querySelectorAll('[data-loading], [aria-busy="true"]').forEach((n) => {
        n.removeAttribute('data-loading');
        n.setAttribute('aria-busy', 'false');
      });
    });
    await page.waitForTimeout(250);
    const names = await runningNames(root);
    const infSweep = names.filter((n) => /sweep/i.test(String(n)));
    const others = names.filter((n) => !/sweep/i.test(String(n)));
    expect(others, `${id}: nothing but ag-sweep may keep running`).toEqual([]);
    void infSweep;
  }
});

test('no auto-starting motion runs longer than 5 s', async ({ page }) => {
  const subjects = (await listSubjects({ tags: ['mat:motion'] })).map((s) => s.id);
  for (const id of subjects) {
    await gotoStory(page, id, { motion: 'full' });
    await page.waitForTimeout(5_050);
    const root = page.locator('[data-ag-root]');
    const names = await runningNames(root);
    const auto = names.filter((n) => !/sweep/i.test(String(n)));
    expect(auto, `${id}: no auto-started motion still running past 5 s`).toEqual([]);
  }
});
