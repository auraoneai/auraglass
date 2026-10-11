// blur-budget.spec.ts — REQ-SURF-150 / REQ-SURF-191 (REQ-FIN-86/89): media
// surfaces stay inside the blur budget. CarouselRail: ≤3 blurred surfaces at
// a fine pointer (Prev, Next, Indicators chrome) and ≤1 at a coarse pointer
// (Prev/Next are not rendered; Indicators only); slides are opaque content
// and never blur; nesting depth 1 (no blurred ancestor of a blurred surface).
// A surface counts when the element or its ::before computes a
// backdrop-filter other than 'none' and the element is rendered (a
// display:none element composites nothing). A missing subject or story is a
// failure, never a skip.
//
// FIN-F `next-fin/f-blur-budget` (REQ-SURF-191) adds the MediaControls (1),
// NowPlayingBar (1) and ImageViewer-open (≤2) cases to this file.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const CAROUSEL_FINE_MAX = 3;
const CAROUSEL_COARSE_MAX = 1;

async function storyId(story: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'CarouselRail' && s.id.endsWith(`--${story}`));
  expect(subject, `CarouselRail ${story} story registered in the subject index`).toBeTruthy();
  return subject!.id;
}

/** Rendered blurred surfaces inside `scope`, with their blurred-ancestor depth. */
async function blurred(page: Page, scope: string) {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) throw new Error(`no ${sel}`);
    const isBlurred = (el: Element) => {
      if (el.getClientRects().length === 0) return false; // not rendered (display:none or detached)
      const cs = getComputedStyle(el);
      return cs.backdropFilter !== 'none' || getComputedStyle(el, '::before').backdropFilter !== 'none';
    };
    const all = [root, ...root.querySelectorAll('*')].filter(isBlurred);
    return all.map((el) => {
      let depth = 0;
      for (let p = el.parentElement; p; p = p.parentElement) if (all.includes(p)) depth++;
      return { part: el.getAttribute('data-ag-part'), depth };
    });
  }, scope);
}

test.describe('media blur budget — CarouselRail (REQ-SURF-150)', () => {
  for (const story of ['over-media', 'tabs'] as const) {
    test(`${story}: fine pointer ≤${CAROUSEL_FINE_MAX} blurred surfaces, depth 1`, async ({ browser }) => {
      const id = await storyId(story);
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await gotoStory(page, id);
      expect(await page.evaluate(() => matchMedia('(pointer: fine)').matches)).toBe(true);
      if (story === 'over-media') {
        await expect(page.locator('[aria-roledescription="carousel"]')).toHaveAttribute('data-ag-backdrop', 'media');
      }
      const found = await blurred(page, '[aria-roledescription="carousel"]');
      expect(found.length, JSON.stringify(found)).toBeGreaterThan(0);
      expect(found.length, JSON.stringify(found)).toBeLessThanOrEqual(CAROUSEL_FINE_MAX);
      expect(found.every((f) => f.depth === 0), 'no blurred surface inside another').toBe(true);
      expect(found.some((f) => f.part === 'carousel-slide'), 'slides never blur').toBe(false);
      expect(found.some((f) => f.part === 'carousel-indicator'), 'indicator dots never blur').toBe(false);
      await context.close();
    });
  }

  test(`over-media: coarse pointer ≤${CAROUSEL_COARSE_MAX} blurred surface`, async ({ browser, browserName }) => {
    const id = await storyId('over-media');
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      ...(browserName === 'firefox' ? {} : { isMobile: true }),
    });
    const page = await context.newPage();
    await gotoStory(page, id);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), 'context emulates a coarse pointer').toBe(true);
    const found = await blurred(page, '[aria-roledescription="carousel"]');
    expect(found.length, JSON.stringify(found)).toBeGreaterThan(0);
    expect(found.length, JSON.stringify(found)).toBeLessThanOrEqual(CAROUSEL_COARSE_MAX);
    expect(found.map((f) => f.part)).toEqual(['carousel-indicators']);
    await context.close();
  });
});
