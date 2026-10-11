// tabs-indicator.spec.ts — SURF-067 / REQ-SURF-49/50 (REQ-FIN-82): tab
// activation morphs the shared indicator through the MAT seam (startMorph).
// With View Transitions (all three engines ship same-document VT) the
// indicator runs in a ::view-transition-group of its ag-tabs-indicator-*
// name; with startViewTransition deleted every engine exercises the CSS
// fallback, which may change only translate and scale. Remote lane only; a missing subject fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function openStory(page: Page, id: string, motion?: 'full' | 'calm' | 'none') {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.id === id);
  if (!subject) throw new Error(`${id} subject not registered`);
  await gotoStory(page, subject.id, motion ? { motion } : {});
}

test.describe('tabs indicator (SURF-067)', () => {
  test('View Transitions path: the indicator runs in a ::view-transition-group', async ({ page }) => {
    await openStory(page, 'surf-tabs--default', 'full');
    expect(await page.evaluate(() => typeof document.startViewTransition)).toBe('function');
    // Record every view-transition pseudo animation started during the click.
    await page.evaluate(() => {
      const seen: string[] = [];
      (window as unknown as { __vt: string[] }).__vt = seen;
      const poll = () => {
        for (const a of document.getAnimations()) {
          const pe = (a.effect as KeyframeEffect | null)?.pseudoElement;
          if (pe && !seen.includes(pe)) seen.push(pe);
        }
        if (seen.length < 50) requestAnimationFrame(poll);
      };
      requestAnimationFrame(poll);
    });
    await page.getByRole('tab', { name: 'Beta' }).click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __vt: string[] }).__vt))
      .toEqual(expect.arrayContaining([expect.stringMatching(/^::view-transition-group\(ag-tabs-indicator-/)]));
    await expect(page.getByRole('tab', { name: 'Beta' })).toHaveAttribute('data-state', 'active');
  });

  test('fallback (no startViewTransition): only translate/scale change on the indicator', async ({ page }) => {
    await page.addInitScript(() => {
      delete (Document.prototype as unknown as { startViewTransition?: unknown }).startViewTransition;
      delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
    });
    await openStory(page, 'surf-tabs--default', 'full');
    const ind = page.locator('[data-ag-part="indicator"]');
    await expect(ind).toHaveCount(1);
    const props = ['translate', 'scale', 'inline-size', 'block-size', 'inset-inline-start', 'inset-block-start', 'transform', 'opacity', 'background-color'];
    const read = () =>
      ind.evaluate((el, keys) => {
        const cs = getComputedStyle(el);
        return Object.fromEntries(keys.map((k) => [k, cs.getPropertyValue(k)]));
      }, props);
    const before = await read();
    expect(await ind.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe('translate, scale');
    await page.getByRole('tab', { name: 'Gamma' }).click();
    await expect.poll(async () => (await read())['translate']).not.toBe(before['translate']);
    const after = await read();
    const changed = props.filter((k) => after[k] !== before[k]);
    // width may follow the new tab's measured width (BU sets --active-tab-width);
    // anything animated is translate/scale only.
    expect(changed.filter((k) => !['translate', 'scale', 'inline-size'].includes(k))).toEqual([]);
  });

  test('reduced motion: 0 running WAAPI animations on the indicator', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openStory(page, 'surf-tabs--default', 'none');
    await page.getByRole('tab', { name: 'Beta' }).click();
    const running = await page.evaluate(() =>
      document.getAnimations().filter((a) => {
        const t = (a.effect as KeyframeEffect | null)?.target as Element | null;
        return a.playState === 'running' && !!t?.closest('[data-ag-part="tabs"]');
      }).length,
    );
    expect(running).toBe(0);
  });

  test('320px: the overflowing list scrolls the active tab into view without page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await openStory(page, 'surf-tabs--overflow');
    const last = page.getByRole('tab', { name: 'Audit log' });
    await last.focus();
    await page.keyboard.press('Enter');
    await expect(last).toHaveAttribute('data-state', 'active');
    await expect(last).toBeInViewport();
    const list = page.locator('[data-ag-part="list"]');
    await expect(list).toHaveAttribute('data-ag-overflow-start', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    const panels = page.locator('[data-ag-part="panel"]');
    for (const el of await panels.all()) await expect(el).toHaveAttribute('data-state', /^(active|inactive)$/);
  });
});
