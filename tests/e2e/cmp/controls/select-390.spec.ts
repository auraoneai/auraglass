/* REQ-CMP-68 (lane L6/L9 remote): at a 390 px viewport the Select popup is at
   least the trigger's width and at most innerWidth - 16 px, kept 8 px inside
   the viewport (collisionPadding 8); under a coarse pointer its block size is
   capped at min(60dvh, 400px). */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const STORY = 'flagships-controls-select--default';

async function openFirstSelect(page: Page) {
  await gotoStory(page, STORY);
  const trigger = page.locator('[data-ag-part="trigger"]').first();
  await trigger.click();
  const popup = page.locator('.ag-select-popup').first();
  await expect(popup).toBeVisible();
  // let the open transition settle so the box is the final one
  await page.waitForTimeout(400);
  const [t, p, vw] = await Promise.all([
    trigger.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
    popup.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
    page.evaluate(() => window.innerWidth),
  ]);
  return { t, p, vw, popup };
}

test.describe('Select popup sizing at 390 px (REQ-CMP-68)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('popup width is between the trigger width and innerWidth - 16, 8 px collision padding', async ({ page }) => {
    const { t, p, vw } = await openFirstSelect(page);
    expect(p.width).toBeGreaterThanOrEqual(t.width - 0.5);
    expect(p.width).toBeLessThanOrEqual(vw - 16 + 0.5);
    expect(p.left).toBeGreaterThanOrEqual(8 - 0.5);
    expect(p.right).toBeLessThanOrEqual(vw - 8 + 0.5);
  });
});

test.describe('Select popup under a coarse pointer (REQ-CMP-68)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('max-block-size resolves to min(60dvh, 400px)', async ({ page }) => {
    const { popup, p } = await openFirstSelect(page);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    const cap = await page.evaluate(() => Math.min(window.innerHeight * 0.6, 400));
    // compare against a probe carrying the literal PRD value, so the check does
    // not depend on how the engine serialises min()
    const [max, expected] = await popup.evaluate((el) => {
      const probe = document.createElement('div');
      probe.style.maxBlockSize = 'min(60dvh, 400px)';
      document.body.appendChild(probe);
      const out = [getComputedStyle(el).maxBlockSize, getComputedStyle(probe).maxBlockSize];
      probe.remove();
      return out;
    });
    expect(max).toBe(expected);
    expect(p.height).toBeLessThanOrEqual(cap + 0.5);
  });
});
