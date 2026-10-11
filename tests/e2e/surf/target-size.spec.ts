// tests/e2e/surf/target-size.spec.ts — SURF slice of the target-size matrix
// (L12, AC-SURF-31). Interactive elements in shipped SURF subjects meet the
// 24×24 CSS-pixel minimum (WCAG 2.5.8).
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';

const INTERACTIVE = 'a[href], button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])';

test.describe('SURF target size', () => {
  test('every shipped SURF subject keeps interactive targets >= 24x24', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    for (const subject of subjects) {
      await test.step(subject.id, async () => {
        await gotoStory(page, subject.id);
        const offenders = await page.$$eval(INTERACTIVE, (els) =>
          els
            .filter((el) => {
              const r = (el as HTMLElement).getBoundingClientRect();
              return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24);
            })
            .map((el) => {
              const r = (el as HTMLElement).getBoundingClientRect();
              return `${(el as HTMLElement).tagName}.${(el as HTMLElement).className} ${r.width.toFixed(0)}x${r.height.toFixed(0)}`;
            })
        );
        expect(offenders).toEqual([]);
      });
    }
  });
});

// REQ-SURF-52 (REQ-FIN-82): coarse-pointer tab bar items are >= 44x44.
test.describe('SURF tab bar target size', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

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
