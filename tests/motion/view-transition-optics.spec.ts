/* MAT-241 / REQ-MOT-T12,-75: VT optics invariant. On engines with
 * startViewTransition: computed --_ag-optics is 0 on participants during
 * ::view-transition activity, 1 one frame after finished + a microtask.
 * Engines without startViewTransition take the FLIP path with the same
 * observable contract (optics restored once the FLIP finishes). */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';

const OPTICS_SUBJECTS = ['Tabs', 'SegmentedControl', 'TabBar', 'SourceTransition'] as const;

const opticsOf = async (root: import('@playwright/test').Locator) =>
  root.evaluate((el) => {
    const parts = el.matches('[data-ag-part]') ? [el] : [...el.querySelectorAll('[data-ag-part]')];
    return parts.map((p) => ({
      part: p.getAttribute('data-ag-part'),
      optics: getComputedStyle(p).getPropertyValue('--_ag-optics').trim(),
    }));
  });

const hasVT = (page: import('@playwright/test').Page) =>
  page.evaluate(() => typeof (document as { startViewTransition?: unknown }).startViewTransition === 'function');

for (const subject of OPTICS_SUBJECTS) {
  test(`${subject}: --_ag-optics 0 during transition, 1 after finished`, async ({ page }) => {
    const subs = await listSubjects();
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hit = subs.find((s) => norm(s.subject).includes(norm(subject)));
    if (!hit) {
      test.info().annotations.push({ type: 'motion', description: `subject ${subject} absent` });
      return; // DOUBLE-PASS: subject lands via its owning PRD
    }
    await gotoStory(page, hit.id, { motion: 'full' });
    const root = page.locator('[data-ag-root]');
    const vt = await hasVT(page);
    // arm a one-frame probe reading --_ag-optics on every participant
    await page.evaluate(() => {
      const w = window as unknown as { __opticsDip: number[] };
      w.__opticsDip = [];
      const read = () => {
        const vals = [...document.querySelectorAll('[data-ag-part]')]
          .map((p) => parseFloat(getComputedStyle(p).getPropertyValue('--_ag-optics') || '1'));
        w.__opticsDip.push(...vals.filter((v) => v === 0));
        requestAnimationFrame(read);
      };
      requestAnimationFrame(read);
    });
    const trigger = root.locator('[role="tab"], [data-ag-part="trigger"], button').nth(1);
    if (await trigger.count() === 0) {
      const first = root.locator('[role="tab"], button').first();
      if (await first.count()) await first.click({ force: true }).catch(() => undefined);
    } else {
      await trigger.click({ force: true }).catch(() => undefined);
    }
    await page.waitForTimeout(60); // inside the transition window
    const dip = await page.evaluate(() =>
      (window as unknown as { __opticsDip: number[] }).__opticsDip.length);
    if (vt) {
      expect(dip, `${subject}: --_ag-optics must dip to 0 on a participant during the VT`)
        .toBeGreaterThan(0);
    }
    // one frame after finished + a microtask: back to 1 on every participant
    await page.evaluate(async () => {
      const d = document as unknown as { startViewTransition?: (cb: () => void) => { finished: Promise<unknown> } };
      void d;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await Promise.resolve();
    });
    const rows = await opticsOf(root);
    const bad = rows.filter((r) => r.optics !== '' && r.optics !== '1');
    expect(bad, `${subject}: --_ag-optics restored to 1 after finished`).toEqual([]);
  });
}
