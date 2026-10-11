// tabbar-minimize.spec.ts — SURF-075 / REQ-SURF-54 (REQ-FIN-82): labels
// minimize through the CSS scroll-timeline (no scroll listener) under full
// motion and stay at opacity 1 under calm; the bar appearance is compact-only
// while a floating tab bar stays visible at 800px. Remote lane only; a
// missing subject fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function openStory(page: Page, id: string, motion?: 'full' | 'calm') {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.id === id);
  if (!subject) throw new Error(`${id} subject not registered`);
  await gotoStory(page, subject.id, motion ? { motion } : {});
}

const labelOpacity = (page: Page) =>
  page.locator('[data-ag-part="tab-bar-item-label"]').first().evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe('tab-bar minimize (SURF-075)', () => {
  // Scroll-driven animations ship in Chromium and WebKit; Firefox has no
  // animation-timeline, where the bar degrades to never minimizing.
  test('motion full: label opacity < 1 after a 400px scroll (opacity 1 without scroll timelines)', async ({ page, browserName }) => {
    const expectsTimeline = browserName !== 'firefox';
    await page.setViewportSize({ width: 375, height: 812 });
    await openStory(page, 'surf-tab-bar--minimize-on-scroll', 'full');
    expect(await page.evaluate(() => CSS.supports('animation-timeline: scroll()'))).toBe(expectsTimeline);
    expect(await labelOpacity(page)).toBe(1);
    await page.mouse.wheel(0, 400);
    if (expectsTimeline) {
      await expect.poll(() => labelOpacity(page)).toBeLessThan(1);
    } else {
      await page.waitForTimeout(300);
      expect(await labelOpacity(page)).toBe(1);
    }
  });

  test('motion calm: label opacity stays 1 after a 400px scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openStory(page, 'surf-tab-bar--minimize-on-scroll', 'calm');
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(300);
    expect(await labelOpacity(page)).toBe(1);
  });

  test('bar only in compact: bar hidden at 800px, floating visible', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await openStory(page, 'surf-tab-bar--in-shell-bar');
    await expect(page.locator('[data-ag-part="tab-bar"]')).toBeHidden();
    await openStory(page, 'surf-tab-bar--in-shell-floating');
    await expect(page.locator('[data-ag-part="tab-bar"][data-ag-appearance="floating"]')).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await openStory(page, 'surf-tab-bar--in-shell-bar');
    await expect(page.locator('[data-ag-part="tab-bar"]')).toBeVisible();
  });
});
