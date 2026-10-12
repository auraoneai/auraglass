// tests/e2e/surf/target-size.spec.ts — SURF slice of the target-size matrix
// (REQ-SURF-192, AC-SURF-31; lane L5 via project surf:targets). Every
// interactive element in every shipped SURF story:
//   - fine pointer (1440x900): owns a 24x24 box centred on itself
//     (elementFromPoint at the centre and ±11.5 px resolves to the element or
//     its hit area) or meets the WCAG 2.5.8 24px-circle spacing exception;
//   - coarse pointer (hasTouch + isMobile, 390x844): owns a 44x44 box centred
//     on itself (elementFromPoint at ±21.5 px), through MAT's hit area or the
//     part's own hit-extension pseudo-element, without a visual size change.
// A missing subject index is a failure, never a skip.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';
import { probeTargets } from '../mat/helpers/targets';

test.describe('SURF target size, fine pointer (REQ-SURF-192)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('every SURF story: centred 24x24 ownership or the spacing exception', async ({ page }) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    const offenders: string[] = [];
    for (const subject of subjects) {
      await gotoStory(page, subject.id);
      for (const p of await probeTargets(page, 11.5)) {
        if (!p.owned && !p.spaced) offenders.push(`${subject.id} ${p.part || p.tag} ${p.w}x${p.h} missed ${p.missed.join(',')}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

test.describe('SURF target size, coarse pointer (REQ-SURF-192)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('every SURF story: every interactive element owns a centred 44x44 box', async ({ page }) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    const offenders: string[] = [];
    let measured = 0;
    for (const subject of subjects) {
      await gotoStory(page, subject.id);
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
      const probes = await probeTargets(page, 21.5);
      measured += probes.length;
      for (const p of probes) {
        if (!p.owned) offenders.push(`${subject.id} ${p.part || p.tag} ${p.w}x${p.h} missed ${p.missed.join(',')}`);
      }
    }
    expect(measured, 'interactive SURF elements measured').toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });

  // REQ-SURF-52 (REQ-FIN-82): coarse-pointer tab bar items are >= 44x44 boxes.
  test('tab bar target size: every [data-ag-part=tab-bar-item] is >= 44x44', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id === 'surf-tab-bar--default');
    if (!subject) throw new Error('surf-tab-bar--default subject not registered');
    await gotoStory(page, subject.id);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    const boxes = await page.$$eval('[data-ag-part="tab-bar-item"]', (els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height };
      }),
    );
    expect(boxes.length).toBe(3);
    expect(boxes.filter((b) => b.w < 44 || b.h < 44)).toEqual([]);
  });
});
