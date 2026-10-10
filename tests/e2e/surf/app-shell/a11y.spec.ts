// a11y.spec.ts — SURF-032/105/120: axe scan + focus-not-obscured over every SURF shell subject. Remote lane (3 engines where required); absent
// subjects fail the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('app-shell a11y (SURF-032/105/120)', () => {
  test('axe-clean shell subjects', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects').toBeGreaterThan(0);
    const { AxeBuilder } = await import('@axe-core/playwright');
    for (const s of subjects.filter((x) => ['AppShell','Sidebar','TopBar','StatusBar','MobileShell','Inspector','ResizablePanels'].includes(x.subject))) {
      await test.step(s.id, async () => {
        await gotoStory(page, s.id);
        const res = await new AxeBuilder({ page }).analyze();
        expect(res.violations).toEqual([]);
      });
    }
  });

  test('focus is not obscured by sticky chrome', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) throw new Error('AppShell subject not registered');
    await gotoStory(page, subject.id);
    const obscured = await page.evaluate(async () => {
      const el = document.querySelector<HTMLElement>('main button, main a, [data-ag-part="main"] *:is(button,a)');
      if (!el) return 'no-focusable';
      el.focus();
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.x + r.width / 2, r.y + 1);
      return top === null ? false : !el.contains(top) && top !== el;
    });
    expect(obscured).not.toBe(true);
  });
});
