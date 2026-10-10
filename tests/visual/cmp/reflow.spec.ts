/* REQ-CMP-21: reflow contract — every CMP story must not clip at a 390px
   viewport, must reflow inside a 320px container, must show no clipped text
   at 200% zoom, and must tolerate the WCAG 1.4.12 text-spacing stylesheet.
   Remote visual lane only. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote visual lane only (AG_REMOTE_RUNNER=1)');

const FAMILIES = [
  'controls-button--default',
  'controls-checkbox--default',
  'controls-switch--default',
  'controls-slider--default',
  'controls-select--default',
  'controls-text-field--default',
  'controls-segmented-control--default',
  'content-card--default',
  'content-alert--default',
];

/* WCAG 1.4.12 text spacing override stylesheet */
const SPACING_CSS = `
  * { line-height: 1.5 !important; letter-spacing: 0.12em !important;
      word-spacing: 0.16em !important; }
  p { margin-bottom: 2em !important; }`;

async function noHorizontalOverflow(page: import('@playwright/test').Page, label: string) {
  const res = await page.evaluate(() => {
    const de = document.documentElement;
    const clipped = Array.from(document.querySelectorAll('[data-ag-part]')).filter(
      (el) => el.scrollWidth > el.clientWidth + 1,
    ).length;
    return { doc: de.scrollWidth <= de.clientWidth + 1, clipped };
  });
  expect(res.doc, `${label}: document scrollWidth ≤ clientWidth`).toBe(true);
  expect(res.clipped, `${label}: clipped parts`).toBe(0);
}

test.describe('cmp reflow', () => {
  for (const storyId of FAMILIES) {
    test(`${storyId} @390px viewport: no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await gotoStory(page, storyId);
      await noHorizontalOverflow(page, '390px');
    });

    test(`${storyId} in 320px container: no horizontal overflow`, async ({ page }) => {
      await gotoStory(page, storyId);
      await page.evaluate(() => {
        const root = document.getElementById('storybook-root') ?? document.body.firstElementChild;
        if (root instanceof HTMLElement) {
          root.style.inlineSize = '320px';
          root.style.overflow = 'hidden';
        }
      });
      await noHorizontalOverflow(page, '320px container');
    });

    test(`${storyId} @200% zoom: no clipped text`, async ({ page }) => {
      await gotoStory(page, storyId);
      await page.evaluate(() => { (document.body.style as CSSStyleDeclaration).zoom = '2'; });
      await page.waitForTimeout(100);
      await noHorizontalOverflow(page, '200% zoom');
    });

    test(`${storyId} WCAG 1.4.12 text spacing: no clipping`, async ({ page }) => {
      await gotoStory(page, storyId);
      await page.addStyleTag({ content: SPACING_CSS });
      await page.waitForTimeout(100);
      await noHorizontalOverflow(page, '1.4.12 spacing');
    });
  }
});
