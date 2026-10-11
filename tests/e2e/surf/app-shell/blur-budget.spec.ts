// tests/e2e/surf/app-shell/blur-budget.spec.ts — REQ-SURF-191 (REQ-FIN-90,
// AC-FIN-90; was SURF-070/103). L5 app-shell lane, remote only
// (fragments/lanes/surf.ts W1 `tests/e2e/surf/app-shell/**/*.spec.ts`;
// chromium, webkit and firefox).
//
// Counts come from QUAL `perf.blurredSurfaces` (S-40). For every AppShell
// story in the subject index:
//   - ≤3 blurred surfaces under a fine pointer, ≤2 under a coarse pointer
//     (hasTouch + isMobile 390×844 context; the page must report
//     `(pointer: coarse)`);
//   - nesting depth 1: no blurred surface has a blurred ancestor;
//   - every parsed blur radius ≤32 px on chrome and ≤12 px on scrims;
//   - StatusBar's backdrop-filter computes to 'none'.
// TabBar renders exactly 1 blurred surface; Table at most 1.
//
// The budgets below are the spec numbers. Changing them means editing this
// file; they are never read from a fragment, threshold file or env var.
// A subject missing from the index fails. A negative control proves the
// nesting and radius probes catch a violation, so their [] is never vacuous.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import {
  CHROME_MAX_BLUR_PX,
  coarseContext,
  expectDepthOne,
  expectPointer,
  expectRadii,
  isMaterialStory,
  measureBlur,
  surfStoriesOf,
} from '../_support/blur-budget';

const APP_SHELL_MAX_FINE = 3;
const APP_SHELL_MAX_COARSE = 2;
const TAB_BAR_EXACT = 1;
const TABLE_MAX = 1;

/** StatusBar root and its ::before compute backdrop-filter 'none'; the root must exist. */
async function statusBarFilters(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('[data-ag-part="status-bar"]')].flatMap((el) => {
      const read = (cs: CSSStyleDeclaration) =>
        cs.backdropFilter || (cs as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || 'none';
      return [read(getComputedStyle(el)), read(getComputedStyle(el, '::before'))];
    }));
}

async function expectStatusBarUnblurred(page: Page, where: string): Promise<void> {
  const filters = await statusBarFilters(page);
  expect(filters.length, `${where}: [data-ag-part="status-bar"] not rendered`).toBeGreaterThan(0);
  expect(filters.filter((f) => f !== 'none'), `${where}: StatusBar backdrop-filter must compute to 'none'`).toEqual([]);
}

async function expectAppShellBudget(page: Page, where: string, max: number): Promise<void> {
  const report = await measureBlur(page);
  expect(report.count, `${where}: ${report.surfaces.map((s) => s.label).join(', ')}`).toBeLessThanOrEqual(max);
  expectDepthOne(report, where);
  expectRadii(report, where);
  await expectStatusBarUnblurred(page, where);
}

test.describe('app-shell blur budget (REQ-SURF-191)', () => {
  test(`AppShell: ≤${APP_SHELL_MAX_FINE} blurred surfaces at fine, depth 1, radii, StatusBar none`, async ({ page }) => {
    for (const story of await surfStoriesOf('AppShell')) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        await expectPointer(page, 'fine');
        await expectAppShellBudget(page, `${story.id} (fine)`, APP_SHELL_MAX_FINE);
      });
    }
  });

  test(`AppShell: ≤${APP_SHELL_MAX_COARSE} blurred surfaces at coarse, depth 1, radii, StatusBar none`, async ({ browser, browserName, baseURL }) => {
    const stories = await surfStoriesOf('AppShell');
    const context = await coarseContext(browser, browserName, baseURL);
    try {
      const page = await context.newPage();
      for (const story of stories) {
        await test.step(story.id, async () => {
          await gotoStory(page, story.id);
          await expectPointer(page, 'coarse');
          await expectAppShellBudget(page, `${story.id} (coarse)`, APP_SHELL_MAX_COARSE);
        });
      }
    } finally {
      await context.close();
    }
  });

  test('StatusBar: backdrop-filter computes to none in every StatusBar story', async ({ page }) => {
    for (const story of await surfStoriesOf('StatusBar')) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        await expectStatusBarUnblurred(page, story.id);
      });
    }
  });

  test(`TabBar: exactly ${TAB_BAR_EXACT} blurred surface`, async ({ page }) => {
    const stories = (await surfStoriesOf('TabBar')).filter(isMaterialStory);
    expect(stories.map((s) => s.id), 'TabBar: no material (non forced-colors) story').not.toEqual([]);
    for (const story of stories) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        const report = await measureBlur(page);
        expect(report.count, `${story.id}: ${report.surfaces.map((s) => s.label).join(', ')}`).toBe(TAB_BAR_EXACT);
        expectDepthOne(report, story.id);
        expectRadii(report, story.id);
      });
    }
  });

  test(`Table: ≤${TABLE_MAX} blurred surface`, async ({ page }) => {
    for (const story of await surfStoriesOf('Table')) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        const report = await measureBlur(page);
        expect(report.count, `${story.id}: ${report.surfaces.map((s) => s.label).join(', ')}`).toBeLessThanOrEqual(TABLE_MAX);
        expectDepthOne(report, story.id);
        expectRadii(report, story.id);
      });
    }
  });

  test('negative control: the probes catch a nested, over-radius blurred surface', async ({ page }) => {
    const [story] = await surfStoriesOf('AppShell');
    await gotoStory(page, story!.id);
    const before = await measureBlur(page);
    await page.evaluate((px) => {
      const outer = document.createElement('div');
      outer.setAttribute('data-ag-part', 'blur-budget-control-outer');
      outer.style.cssText = `position:fixed;inset:0 auto auto 0;width:40px;height:40px;backdrop-filter:blur(${px}px);-webkit-backdrop-filter:blur(${px}px)`;
      const inner = document.createElement('div');
      inner.setAttribute('data-ag-part', 'blur-budget-control-inner');
      inner.style.cssText = 'width:20px;height:20px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)';
      outer.append(inner);
      document.body.append(outer);
    }, CHROME_MAX_BLUR_PX + 8);
    const after = await measureBlur(page);
    expect(after.count).toBe(before.count + 2);
    const nested = after.surfaces.filter((s) => s.blurredAncestors.length > 0).map((s) => s.label);
    expect(nested).toContain('div[data-ag-part=blur-budget-control-inner]');
    const outer = after.surfaces.find((s) => s.label === 'div[data-ag-part=blur-budget-control-outer]');
    expect(outer?.radiiPx).toEqual([CHROME_MAX_BLUR_PX + 8]);
    expect(() => expectDepthOne(after, 'control')).toThrow();
    expect(() => expectRadii(after, 'control')).toThrow();
  });
});
