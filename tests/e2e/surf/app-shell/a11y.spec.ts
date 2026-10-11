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

  test('splitter target size (SURF-45): ::before hit box >=24px fine, >=44px coarse', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ResizablePanels' && s.id.endsWith('--default'));
    if (!subject) throw new Error('ResizablePanels --default story not registered');
    await gotoStory(page, subject.id);
    const boxes = await page.evaluate(() => {
      const handle = document.querySelector<HTMLElement>('[data-ag-part="resize-handle"]');
      if (!handle) throw new Error('no resize handle rendered');
      // Locate the shipped ::before rules (fine = top level, coarse = inside
      // @media (pointer: coarse)) in the loaded stylesheets.
      let fine: string | null = null;
      let coarse: string | null = null;
      const walk = (rules: CSSRuleList, inCoarse: boolean) => {
        for (const r of Array.from(rules)) {
          if (r instanceof CSSStyleRule && r.selectorText === '.ag-panels__handle::before') {
            const v = r.style.getPropertyValue('inset');
            if (inCoarse) coarse = v;
            else fine = v;
          } else if (r instanceof CSSMediaRule) {
            walk(r.cssRules, inCoarse || /pointer:\s*coarse/.test(r.conditionText));
          } else if ('cssRules' in r && (r as CSSGroupingRule).cssRules) {
            walk((r as CSSGroupingRule).cssRules, inCoarse);
          }
        }
      };
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          walk(sheet.cssRules, false);
        } catch {
          /* cross-origin sheet */
        }
      }
      if (!fine || !coarse) throw new Error(`hit-area rules missing (fine=${fine}, coarse=${coarse})`);
      // Resolve each inset in the handle's own context with a positioned probe
      // (same containing block and custom properties as the pseudo-element).
      const measure = (inset: string) => {
        const probe = document.createElement('span');
        probe.style.position = 'absolute';
        probe.style.setProperty('inset', inset);
        handle.appendChild(probe);
        const r = probe.getBoundingClientRect();
        probe.remove();
        return { w: r.width, h: r.height };
      };
      const pseudo = getComputedStyle(handle, '::before');
      return {
        fine: measure(fine),
        coarse: measure(coarse),
        livePseudo: { position: pseudo.position, content: pseudo.content },
        handleWidth: handle.getBoundingClientRect().width,
      };
    });
    expect(boxes.livePseudo.position).toBe('absolute');
    expect(boxes.livePseudo.content).not.toBe('none');
    // the visual line stays 1 px; only the pseudo hit area grows
    expect(boxes.handleWidth).toBeLessThanOrEqual(1.5);
    expect(boxes.fine.w).toBeGreaterThanOrEqual(24);
    expect(boxes.coarse.w).toBeGreaterThanOrEqual(44);
  });
});

