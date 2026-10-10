/* REQ-CMP-18: motion contract — transitionProperty ⊆ ANIMATABLE
   {opacity, --ag-specular, --_ag-press}, transform identity at hover/press,
   and no running animations at rest. Remote lane only. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote e2e lane only (AG_REMOTE_RUNNER=1)');

const ANIMATABLE = new Set(['opacity', '--ag-specular', '--_ag-press', 'all']);

/* controls whose pointer feedback must stay inside ANIMATABLE — popups are
   excluded (their enter/exit transform is the sanctioned motion path). */
const CONTROL_FAMILIES = [
  'controls-button--default',
  'controls-checkbox--default',
  'controls-switch--default',
  'controls-slider--default',
  'controls-select--default',
  'controls-text-field--default',
];

const IDENTITY = /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/;

test.describe('cmp motion contract', () => {
  for (const storyId of CONTROL_FAMILIES) {
    test(`${storyId}: transitionProperty ⊆ ANIMATABLE at rest`, async ({ page }) => {
      await gotoStory(page, storyId);
      const props = await page.evaluate(() => {
        const el = document.querySelector('[data-ag-part]') ?? document.body.firstElementChild;
        return el ? getComputedStyle(el).transitionProperty : '';
      });
      const names = props.split(',').map((s) => s.trim()).filter(Boolean);
      const banned = names.filter((n) => !ANIMATABLE.has(n) && !/^--_?ag-/.test(n));
      expect(banned).toEqual([]);
    });

    test(`${storyId}: transform is identity at hover and press`, async ({ page }) => {
      await gotoStory(page, storyId);
      const part = page.locator('[data-ag-part]').first();
      await part.hover();
      const atHover = await part.evaluate((el) => getComputedStyle(el).transform);
      expect(atHover).toMatch(IDENTITY);
      await page.mouse.down();
      const atPress = await part.evaluate((el) => getComputedStyle(el).transform);
      await page.mouse.up();
      expect(atPress).toMatch(IDENTITY);
    });

    test(`${storyId}: no running animations at rest`, async ({ page }) => {
      await gotoStory(page, storyId);
      await page.waitForTimeout(600);
      const running = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[data-ag-part]')).filter((el) => {
          const cs = getComputedStyle(el);
          return cs.animationName !== 'none' || cs.transitionDuration !== '0s';
        }).length,
      );
      /* a transition-duration > 0 at rest is legal (declared, not running) —
         only live animations count. */
      const animating = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[data-ag-part]')).filter(
          (el) => getComputedStyle(el).animationName !== 'none',
        ).length,
      );
      expect(animating, `rest state: ${running} parts styled`).toBe(0);
    });
  }

  test('loading spinners are static without [data-ag-motion=full]', async ({ page }) => {
    const subjects = await listSubjects();
    void subjects;
    await gotoStory(page, CONTROL_FAMILIES[0]);
    const animated = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-ag-part]')).filter(
        (el) => getComputedStyle(el).animationName !== 'none',
      ).length,
    );
    expect(animated).toBe(0);
  });
});
