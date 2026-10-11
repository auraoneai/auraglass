// theme.spec.ts — REQ-SURF-25: a createBrandTheme scope recolours the shell
// chrome with no prop change. surf-app-shell--brand-chrome-a and -b render the
// identical <Chrome /> tree under createBrandTheme({l:0.55,c:0.2,h:250}) and
// createBrandTheme({l:0.6,c:0.2,h:30}); the active nav indicator, the
// keyboard focus ring and the Tabs/TabBar indicators must all follow the
// brand accent. Remote L5 lane (Storybook), never run on a dev Mac.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';

async function chromeColours(page: Page, story: string) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoStory(page, `surf-app-shell--${story}`);
  // The first focusable element is the top bar action; reach it by keyboard
  // so :focus-visible matches in every engine.
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('top-action')).toBeFocused();
  return page.evaluate(() => {
    const q = (s: string) => {
      const el = document.querySelector<HTMLElement>(s);
      if (!el) throw new Error(`missing ${s}`);
      return getComputedStyle(el);
    };
    return {
      accent: q('[data-testid="brand-scope"]').getPropertyValue('--ag-color-accent').trim(),
      nav: q('.ag-app-shell [data-ag-part="sidebar-item"][aria-current="page"]').boxShadow,
      focus: getComputedStyle(document.activeElement as HTMLElement).outlineColor,
      tabs: q('.ag-app-shell .ag-tabs__indicator').backgroundColor,
      tabbar: q('.ag-app-shell .ag-tab-bar__item[aria-current="page"]').boxShadow,
      markup: document.querySelector('.ag-app-shell')!.outerHTML.replace(/«[^»]*»|:r[0-9a-z]+:|_r_[0-9a-z]+_|ag-main-[\w-]+/g, 'ID'),
    };
  });
}

test.describe('theme (REQ-SURF-25)', () => {
  test('createBrandTheme recolours nav indicator, focus ring and tab indicators with no prop change', async ({ page }) => {
    const a = await chromeColours(page, 'brand-chrome-a');
    const b = await chromeColours(page, 'brand-chrome-b');
    // Same component tree, same props: only the theme scope differs.
    expect(a.markup).toBe(b.markup);
    expect(a.accent).not.toBe('');
    expect(a.accent).not.toBe(b.accent);
    // The three chrome colour changes the requirement names (plus TabBar).
    expect({
      nav: a.nav !== b.nav,
      focus: a.focus !== b.focus,
      tabs: a.tabs !== b.tabs,
      tabbar: a.tabbar !== b.tabbar,
    }).toEqual({ nav: true, focus: true, tabs: true, tabbar: true });
    // And none of them is a currentColor / transparent fallback.
    for (const v of [a.tabs, b.tabs, a.focus, b.focus]) {
      expect(v).not.toMatch(/^rgba\(0, 0, 0, 0\)$|^transparent$/);
    }
  });
});
