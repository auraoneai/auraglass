// modes.spec.ts — REQ-SURF-160 (MED-75..77) + REQ-SURF-155/158, project
// surf:backdrops. Every preset renders its aria-hidden decorative layer;
// preset="grain" paints the grain tile on its own; forced colours drop the
// decorative layer and give the root a Canvas background; the reduced
// transparency rung (solid) keeps photo/video visible; the declared scheme
// pins the layer's color-scheme. A missing story is a failure, never a skip.
import { test, expect, type Page } from '@playwright/test';
import { openBackdrop, type BackdropStory } from '../_support/backdrop';

const layer = (page: Page) => page.locator('.ag-backdrop > [data-ag-part="backdrop-layer"]');

test.describe('backdrop modes', () => {
  const PRESETS: BackdropStory[] = ['aurora-light', 'aurora-dark', 'mesh', 'grain', 'photo', 'video', 'mono'];
  for (const story of PRESETS) {
    test(`${story}: aria-hidden decorative layer + content`, async ({ page }) => {
      await openBackdrop(page, story);
      await expect(layer(page)).toHaveCount(1);
      await expect(layer(page)).toBeVisible();
      await expect(layer(page)).toHaveAttribute('aria-hidden', 'true');
      await expect(page.locator('.ag-backdrop > [data-ag-part="backdrop-content"]')).toHaveCount(1);
    });
  }

  test('preset="grain" paints the 112px grain tile at opacity 0.03 by itself', async ({ page }) => {
    await openBackdrop(page, 'grain');
    const grain = await layer(page).evaluate((el) => {
      const s = getComputedStyle(el, '::after');
      return { image: s.backgroundImage, size: s.backgroundSize, opacity: s.opacity };
    });
    expect(grain.image).toMatch(/grain-112\.(avif|png)/);
    expect(grain.size).toBe('112px 112px');
    expect(grain.opacity).toBe('0.03');
  });

  test('aurora and mesh paint palette gradients; light/dark pin the layer color-scheme', async ({ page }) => {
    for (const [story, scheme] of [['aurora-light', 'light'], ['aurora-dark', 'dark']] as const) {
      await openBackdrop(page, story);
      const s = await layer(page).evaluate((el) => ({ scheme: getComputedStyle(el).colorScheme, image: getComputedStyle(el).backgroundImage }));
      expect(s.scheme).toBe(scheme);
      expect((s.image.match(/radial-gradient/g) ?? []).length).toBe(3);
    }
    await openBackdrop(page, 'mesh');
    const mesh = await layer(page).evaluate((el) => getComputedStyle(el).backgroundImage);
    expect((mesh.match(/radial-gradient/g) ?? []).length).toBe(4);
    expect(mesh).toMatch(/linear-gradient/);
  });

  test('palette ids change the painted hues (mono differs from aurora)', async ({ page }) => {
    await openBackdrop(page, 'mesh');
    const aurora = await layer(page).evaluate((el) => getComputedStyle(el).backgroundImage);
    await openBackdrop(page, 'mono');
    const mono = await layer(page).evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(mono).not.toBe(aurora);
  });

  test.describe('forced colours', () => {
    test.use({ forcedColors: 'active' });
    for (const story of ['aurora-light', 'mesh', 'photo', 'video'] as const) {
      test(`${story}: decorative layer display:none, root background Canvas`, async ({ page }) => {
        await openBackdrop(page, story);
        expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
        expect(await layer(page).evaluate((el) => getComputedStyle(el).display)).toBe('none');
        const [root, canvas] = await page.evaluate(() => {
          const probe = document.createElement('div');
          probe.style.background = 'Canvas';
          document.body.appendChild(probe);
          const out = [
            getComputedStyle(document.querySelector('.ag-backdrop')!).backgroundColor,
            getComputedStyle(probe).backgroundColor,
          ];
          probe.remove();
          return out;
        });
        expect(root).toBe(canvas);
      });
    }
  });

  test.describe('reduced transparency (solid rung)', () => {
    for (const story of ['photo', 'video'] as const) {
      test(`${story}: the media stays visible`, async ({ page }) => {
        await openBackdrop(page, story, { transparency: 'solid' });
        expect(await page.evaluate(() => document.querySelector('[data-ag-transparency]')?.getAttribute('data-ag-transparency'))).toBe('solid');
        const media = page.locator(`.ag-backdrop [data-ag-part="backdrop-layer"] > ${story === 'photo' ? 'img' : 'video'}`);
        await expect(media).toBeVisible();
        const s = await media.evaluate((el) => {
          const c = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return { display: c.display, visibility: c.visibility, opacity: Number(c.opacity), w: r.width, h: r.height };
        });
        expect(s.display).not.toBe('none');
        expect(s.visibility).toBe('visible');
        expect(s.opacity).toBe(1);
        expect(s.w).toBeGreaterThan(0);
        expect(s.h).toBeGreaterThan(0);
      });
    }
  });
});
