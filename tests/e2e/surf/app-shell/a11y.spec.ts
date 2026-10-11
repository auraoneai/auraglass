// a11y.spec.ts — SURF-032/105/120: axe scan + focus-not-obscured over every SURF shell subject. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('app-shell a11y (SURF-032/105/120)', () => {
  test('axe-clean shell subjects', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    if (subjects.length === 0) { console.warn('no SURF subjects — pending'); return; }
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
    if (!subject) { console.warn('AppShell subject not registered — pending'); return; }
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

  // REQ-SURF-18: the SkipLink is the first focusable element, hidden until
  // :focus-visible, and Enter moves focus to <main> (its href is the shell's
  // useId-derived main id).
  test('skip link focuses main', async ({ page, browserName }) => {
    await gotoStory(page, 'surf-app-shell--skip-link');
    const skip = page.locator('.ag-app-shell [data-ag-slot="skip"]');
    const main = page.locator('.ag-app-shell main');
    await expect(skip).toHaveCount(1);
    await expect(main).toHaveCount(1);
    const clip = () => skip.evaluate((el) => getComputedStyle(el).clipPath);
    expect(await clip()).not.toBe('none');
    // WebKit only tabs to links with Alt (macOS "tab to links" default).
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    await expect(skip).toBeFocused();
    expect(await clip()).toBe('none');
    const mainId = await main.getAttribute('id');
    expect(mainId).toMatch(/^ag-main-/);
    expect(await skip.getAttribute('href')).toBe(`#${mainId}`);
    await page.keyboard.press('Enter');
    await expect(main).toBeFocused();
  });
});
