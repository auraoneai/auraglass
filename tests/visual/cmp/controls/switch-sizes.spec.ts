/* REQ-CMP-45 / REQ-CMP-46 (lane L6, tests/visual/cmp/**). Computed switch
   geometry and thumb motion on the Sizes story:
   - outer track boxes are 32x18 / 40x22 / 52x30 px (sm/md/lg);
   - the thumb sits 2px inside the track on every edge it rests against;
   - checked moves the thumb by track-w - track-h via the `translate`
     property, ending 2px from the inline-end edge;
   - transition-property includes translate under full motion and the
     duration is 0 under data-ag-motion=calm. */
import { test, expect, type Locator } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const STORY = 'flagships-controls-switch--sizes';
const SIZES = [
  { label: 'Small', w: 32, h: 18 },
  { label: 'Medium', w: 40, h: 22 },
  { label: 'Large', w: 52, h: 30 },
] as const;

async function boxes(sw: Locator) {
  return sw.evaluate((root) => {
    const thumb = root.querySelector<HTMLElement>('[data-ag-part="thumb"]')!;
    const r = root.getBoundingClientRect();
    const t = thumb.getBoundingClientRect();
    return {
      w: r.width, h: r.height,
      tw: t.width, th: t.height,
      top: t.top - r.top, bottom: r.bottom - t.bottom,
      start: t.left - r.left, end: r.right - t.right,
      translate: getComputedStyle(thumb).translate,
    };
  });
}

async function settle(sw: Locator) {
  await sw.evaluate((root) => Promise.all(
    root.querySelector('[data-ag-part="thumb"]')!.getAnimations().map((a) => a.finished),
  ));
}

test.describe('switch sizes (REQ-CMP-45)', () => {
  for (const { label, w, h } of SIZES) {
    test(`${label}: track ${w}x${h}, thumb inset 2px, slide ${w - h}px`, async ({ page }) => {
      await gotoStory(page, STORY, { motion: 'none' });
      const sw = page.getByRole('switch', { name: label });
      await expect(sw).toBeVisible();
      if ((await sw.getAttribute('aria-checked')) === 'true') {
        await sw.click();
        await settle(sw);
      }

      const off = await boxes(sw);
      expect(off.w).toBeCloseTo(w, 0);
      expect(off.h).toBeCloseTo(h, 0);
      expect(off.tw).toBeCloseTo(h - 4, 0);
      expect(off.th).toBeCloseTo(h - 4, 0);
      expect(off.top).toBeCloseTo(2, 0);
      expect(off.bottom).toBeCloseTo(2, 0);
      expect(off.start).toBeCloseTo(2, 0);

      await sw.click();
      await expect(sw).toHaveAttribute('aria-checked', 'true');
      await settle(sw);
      const on = await boxes(sw);
      expect(on.translate).toBe(`${w - h}px`);
      expect(on.end).toBeCloseTo(2, 0);
      expect(on.start - off.start).toBeCloseTo(w - h, 0);
    });
  }
});

test.describe('switch thumb motion (REQ-CMP-46)', () => {
  test('full motion: translate changes on toggle and transitions on translate', async ({ page }) => {
    await gotoStory(page, STORY, { motion: 'full' });
    const sw = page.getByRole('switch', { name: 'Small' });
    const thumb = sw.locator('[data-ag-part="thumb"]');
    const before = await thumb.evaluate((el) => getComputedStyle(el).translate);
    const timing = await thumb.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { prop: cs.transitionProperty, dur: cs.transitionDuration };
    });
    expect(timing.prop.split(',').map((s) => s.trim())).toContain('translate');
    expect(Number.parseFloat(timing.dur)).toBeGreaterThan(0);
    /* record every attribute state the thumb passes through during the toggle */
    await thumb.evaluate((el) => {
      const seen: string[] = [];
      (window as unknown as { __thumbSeen: string[] }).__thumbSeen = seen;
      new MutationObserver(() => {
        seen.push(`${el.hasAttribute('data-ag-animating')}:${el.hasAttribute('data-ag-allow-nested')}`);
      }).observe(el, { attributes: true, attributeFilter: ['data-ag-animating', 'data-ag-allow-nested'] });
    });
    await sw.click();
    await settle(sw);
    /* glass while moving (animating + allowNested together), inner fill at rest */
    await expect.poll(() => page.evaluate(() => (window as unknown as { __thumbSeen: string[] }).__thumbSeen))
      .toContain('true:true');
    await expect(thumb).not.toHaveAttribute('data-ag-animating', /.*/);
    await expect(thumb).not.toHaveAttribute('data-ag-allow-nested', /.*/);
    const after = await thumb.evaluate((el) => getComputedStyle(el).translate);
    expect(after).not.toBe(before);
    expect(after).toBe('14px');
  });

  test('calm motion: the thumb transition duration is 0', async ({ page }) => {
    await gotoStory(page, STORY, { motion: 'calm' });
    const thumb = page.getByRole('switch', { name: 'Small' }).locator('[data-ag-part="thumb"]');
    const durations = await thumb.evaluate((el) => getComputedStyle(el).transitionDuration);
    for (const d of durations.split(',')) expect(Number.parseFloat(d)).toBe(0);
  });
});
