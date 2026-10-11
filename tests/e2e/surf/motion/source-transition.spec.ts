// source-transition.spec.ts — SURF-092 / REQ-SURF-64/65 (REQ-FIN-82): the
// source->destination morph through the MAT seam on the View Transitions
// path and the FLIP fallback (startViewTransition deleted), plus calm and
// none. The React 19.3 <ViewTransition> engine path is MAT's startMorph
// engine selection (REQ-SURF-65 / REQ-FIN-58, FIN-D D.3-29); its fixture is
// added here once the seam selects it.
// Each path ends with the destination at opacity 1, an identity transform,
// focus on its first focusable, and no view-transition-name left behind.
// Remote lane only; a missing subject fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const STORY = 'surf-source-transition--focusable';

async function openStory(page: Page, motion: 'full' | 'calm' | 'none') {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.id === STORY);
  if (!subject) throw new Error(`${STORY} subject not registered`);
  await gotoStory(page, subject.id, { motion });
}

async function morphAndSettle(page: Page) {
  await page.getByRole('button', { name: 'Open card' }).focus();
  await page.keyboard.press('Enter');
  const dest = page.locator('[data-ag-part="destination"]');
  await expect(page.getByRole('link', { name: 'Card detail' })).toBeFocused();
  await expect
    .poll(() => dest.evaluate((el) => [getComputedStyle(el).opacity, getComputedStyle(el).transform].join('|')))
    .toBe('1|none');
  const names = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-ag-part="source"], [data-ag-part="destination"]')].map(
      (el) => el.style.viewTransitionName,
    ),
  );
  expect(names).toEqual(['', '']);
}

test.describe('source transition (SURF-092)', () => {
  test('View Transitions path', async ({ page }) => {
    await openStory(page, 'full');
    expect(await page.evaluate(() => typeof document.startViewTransition)).toBe('function');
    await page.evaluate(() => {
      const w = window as unknown as { __vtCalls: number };
      w.__vtCalls = 0;
      const orig = document.startViewTransition.bind(document);
      (document as unknown as { startViewTransition: typeof orig }).startViewTransition = ((arg: never) => {
        w.__vtCalls++;
        return orig(arg);
      }) as typeof orig;
    });
    await morphAndSettle(page);
    expect(await page.evaluate(() => (window as unknown as { __vtCalls: number }).__vtCalls)).toBe(1);
  });

  test('FLIP fallback path (no startViewTransition)', async ({ page }) => {
    await page.addInitScript(() => {
      delete (Document.prototype as unknown as { startViewTransition?: unknown }).startViewTransition;
    });
    await openStory(page, 'full');
    expect(await page.evaluate(() => typeof (document as { startViewTransition?: unknown }).startViewTransition)).toBe(
      'undefined',
    );
    await morphAndSettle(page);
  });

  test('calm: the cross-fade finishes within --ag-duration-small', async ({ page }) => {
    await openStory(page, 'calm');
    const small = await page.evaluate(
      () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ag-duration-small')) || 0,
    );
    expect(small).toBeGreaterThan(0);
    await page.getByRole('button', { name: 'Open card' }).focus();
    // measured in the page: keydown -> the first frame with no running animation
    const elapsed = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const t0 = performance.now();
          document.activeElement!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          let sawFrame = false;
          const tick = () => {
            const running = document.getAnimations().some((a) => a.playState === 'running');
            if (sawFrame && !running) resolve(performance.now() - t0);
            else {
              sawFrame = true;
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
        }),
    );
    // one frame of detection latency on top of the duration
    expect(elapsed).toBeLessThanOrEqual(small + 1000 / 60);
    await expect(page.getByRole('link', { name: 'Card detail' })).toBeFocused();
  });

  test('none: the update is synchronous (no transition)', async ({ page }) => {
    await openStory(page, 'none');
    await page.evaluate(() => {
      const w = window as unknown as { __vtCalls: number };
      w.__vtCalls = 0;
      const orig = document.startViewTransition?.bind(document);
      if (orig)
        (document as unknown as { startViewTransition: typeof orig }).startViewTransition = ((arg: never) => {
          w.__vtCalls++;
          return orig(arg);
        }) as typeof orig;
    });
    await morphAndSettle(page);
    expect(await page.evaluate(() => (window as unknown as { __vtCalls: number }).__vtCalls)).toBe(0);
  });
});
