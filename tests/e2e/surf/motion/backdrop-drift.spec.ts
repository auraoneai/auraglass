// backdrop-drift.spec.ts — REQ-SURF-159 (MED-74), lane L9 (fragments/lanes/surf.ts).
// Default Backdrop output runs 0 animations for every preset; motion="drift"
// under [data-ag-continuous="on"] runs exactly one animation, named
// ag-backdrop-drift, on the decorative layer; it is paused after the backdrop
// scrolls out (MAT observeOffscreen → data-ag-offscreen) and while the tab is
// hidden (data-backdrop-hidden), and is absent under reduced motion. A missing
// story is a failure, never a skip.
import { test, expect, type Page } from '@playwright/test';
import { openBackdrop, setHidden, type BackdropStory } from '../_support/backdrop';

const animations = (page: Page) =>
  page.evaluate(() => document.getAnimations().map((a) => ({
    name: (a as CSSAnimation).animationName ?? '',
    playState: a.playState,
    onLayer: (a.effect as KeyframeEffect | null)?.target instanceof Element
      && ((a.effect as KeyframeEffect).target as Element).matches('.ag-backdrop > [data-ag-part="backdrop-layer"]'),
  })));

const drift = async (page: Page) => (await animations(page)).filter((a) => a.name === 'ag-backdrop-drift');

test.describe('backdrop drift (REQ-SURF-159)', () => {
  test.describe.configure({ timeout: 60_000 });

  const DEFAULTS: BackdropStory[] = ['aurora-light', 'mesh', 'grain', 'photo', 'video'];
  for (const story of DEFAULTS) {
    test(`${story}: 0 animations by default`, async ({ page }) => {
      await openBackdrop(page, story);
      await page.waitForTimeout(500);
      expect(await animations(page)).toEqual([]);
    });
  }

  test('drift without the continuous gate: 0 animations', async ({ page }) => {
    await openBackdrop(page, 'drift');
    expect(await page.evaluate(() => !!document.querySelector('[data-ag-continuous="on"]'))).toBe(false);
    await page.waitForTimeout(500);
    expect(await animations(page)).toEqual([]);
  });

  test('the continuous gate alone (motion static): 0 animations', async ({ page }) => {
    await openBackdrop(page, 'aurora-continuous-static');
    expect(await page.evaluate(() => !!document.querySelector('[data-ag-continuous="on"]'))).toBe(true);
    await page.waitForTimeout(500);
    expect(await animations(page)).toEqual([]);
  });

  test('gate + drift: exactly one ag-backdrop-drift on the layer; paused offscreen and when hidden', async ({ page }) => {
    await openBackdrop(page, 'drift-continuous');
    expect(await page.evaluate(() => !!document.querySelector('[data-ag-continuous="on"]'))).toBe(true);
    const all = await animations(page);
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual({ name: 'ag-backdrop-drift', playState: 'running', onLayer: true });
    // transform-only keyframes (L10 decision: no background-position)
    const props = await page.evaluate(() => {
      const a = document.getAnimations()[0]!;
      return [...new Set((a.effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k)))]
        .filter((k) => !['offset', 'computedOffset', 'easing', 'composite'].includes(k));
    });
    expect(props).toEqual(['transform']);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.locator('.ag-backdrop')).toHaveAttribute('data-ag-offscreen', '');
    await expect.poll(async () => (await drift(page)).map((a) => a.playState)).toEqual(['paused']);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('.ag-backdrop')).not.toHaveAttribute('data-ag-offscreen', /.*/);
    await expect.poll(async () => (await drift(page)).map((a) => a.playState)).toEqual(['running']);

    await setHidden(page, true);
    await expect.poll(async () => (await drift(page)).map((a) => a.playState)).toEqual(['paused']);
    await setHidden(page, false);
    await expect.poll(async () => (await drift(page)).map((a) => a.playState)).toEqual(['running']);
  });

  test('reduced motion: gate + drift runs 0 animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openBackdrop(page, 'drift-continuous');
    await page.waitForTimeout(500);
    expect(await drift(page)).toEqual([]);
  });
});
