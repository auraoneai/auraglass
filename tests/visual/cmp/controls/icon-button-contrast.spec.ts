/* REQ-CMP-36 (L6). IconButton glyph-vs-surface non-text contrast is >=3:1 over
   all 8 scenes in light and dark, and the glyph colour is --ag-color-on-surface
   resolved under the scene's declared data-ag-backdrop (CSS only, no JS).
   Each cell captures the page twice — glyphs shown, then every
   [data-ag-part="icon"] at visibility:hidden — and measures the glyph core
   against the surface pixels directly beneath it (glyph-contrast.ts).
   Remote visual lane only (Storybook at AG_STORYBOOK_URL). */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, scenes } from '../../../helpers/index';
import { SCENE_BACKDROP } from '../../../../src/contracts/testing';
import { decodePng } from '../../../../packages/qa/src/pixel/png';
import { toDeviceRect, type Rgba } from '../../../../packages/qa/src/pixel/raster';
import { GLYPH_MIN_CONTRAST, measureGlyphContrast } from './glyph-contrast';

const STORY = 'flagships-controls-iconbutton--overview';
const SCHEMES = ['light', 'dark'] as const;
const ICON = '.ag-icon-button [data-ag-part="icon"]';
const HIDE_ICONS = `${ICON}, ${ICON} * { visibility: hidden !important; }`;

async function shot(page: Page): Promise<Rgba> {
  const png = await page.screenshot({ animations: 'disabled', caret: 'hide' });
  const img = decodePng(png);
  return { width: img.width, height: img.height, data: img.data };
}

async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  });
}

test.describe('icon-button glyph contrast (REQ-CMP-36)', () => {
  for (const scene of scenes) {
    for (const scheme of SCHEMES) {
      test(`${scene} / ${scheme}: glyph >= ${GLYPH_MIN_CONTRAST}:1 against its surface`, async ({ page }) => {
        await gotoStory(page, STORY, { scene, scheme, backdrop: SCENE_BACKDROP[scene] });
        await settle(page);

        const icons = page.locator(ICON);
        const n = await icons.count();
        expect(n, 'overview story renders no IconButton icon parts').toBeGreaterThanOrEqual(1);

        // glyph colour is the on-surface role, resolved by CSS for the declared backdrop
        const colours = await icons.evaluateAll((els) => els.map((el) => {
          const probe = document.createElement('span');
          probe.style.color = 'var(--ag-color-on-surface)';
          el.parentElement!.appendChild(probe);
          const want = getComputedStyle(probe).color;
          probe.remove();
          return { got: getComputedStyle(el).color, want };
        }));
        for (const c of colours) expect(c.got, `${scene}/${scheme}: glyph colour is not --ag-color-on-surface`).toBe(c.want);

        const dpr = await page.evaluate(() => window.devicePixelRatio);
        const rects = await icons.evaluateAll((els) => els.map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left, y: r.top, w: r.width, h: r.height };
        }));
        const shown = await shot(page);
        const tag = await page.addStyleTag({ content: HIDE_ICONS });
        await settle(page);
        const hidden = await shot(page);
        await tag.evaluate((el) => (el as Element).remove());

        rects.forEach((r, i) => {
          expect(r.w > 0 && r.h > 0, `icon ${i} has no box`).toBe(true);
          const m = measureGlyphContrast(shown, hidden, toDeviceRect(r, dpr));
          expect(m, `${scene}/${scheme}: icon ${i} glyph did not paint`).not.toBeNull();
          expect(m!.ratio, `${scene}/${scheme}: icon ${i} glyph ${m!.glyph.join(',')} vs surface ${m!.surface.join(',')}`)
            .toBeGreaterThanOrEqual(GLYPH_MIN_CONTRAST);
        });
      });
    }
  }
});
