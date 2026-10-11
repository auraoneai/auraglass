// thread-virtual.spec.ts — REQ-SURF-109 (SURF-352): virtualization bounds,
// one scroll container, stability while the last message streams, and
// prepend offset preservation. Remote lane only (Chromium/WebKit/Gecko). A
// missing story fails the spec.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  const log = page.locator('[role="log"]');
  await expect(log).toHaveCount(1);
  await expect(log).toBeVisible();
  await expect(log.locator('article').first()).toBeVisible();
  return log;
}

/** First article whose bottom is below the log top: its id and offset from the log top. */
const firstVisible = (page: Page) =>
  page.locator('[role="log"]').evaluate((log) => {
    const top = log.getBoundingClientRect().top;
    for (const a of log.querySelectorAll<HTMLElement>('article[id^="ag-msg-"]')) {
      const r = a.getBoundingClientRect();
      if (r.bottom > top) return { id: a.id, offset: r.top - top };
    }
    return null;
  });

const offsetOf = (page: Page, id: string) =>
  page.locator('[role="log"]').evaluate((log, id) => {
    const el = document.getElementById(id);
    return el && log.contains(el) ? el.getBoundingClientRect().top - log.getBoundingClientRect().top : null;
  }, id);

const frames = (page: Page, n: number) =>
  page.evaluate(async (n) => {
    for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r));
  }, n);

test.describe('ai thread virtualization (REQ-SURF-109)', () => {
  test('2,000 messages: mounted articles ≤ visible + 12', async ({ page }) => {
    await openStory(page, 'ai-thread--long-2000-virtualized');
    const counts = await page.locator('[role="log"]').evaluate((log) => {
      const r = log.getBoundingClientRect();
      const articles = [...log.querySelectorAll('article')];
      const visible = articles.filter((a) => {
        const ar = a.getBoundingClientRect();
        return ar.bottom > r.top && ar.top < r.bottom;
      }).length;
      return { mounted: articles.length, visible };
    });
    expect(counts.visible).toBeGreaterThan(0);
    expect(counts.mounted).toBeLessThanOrEqual(counts.visible + 12);
  });

  test('one role=log and exactly one scroll container inside the thread', async ({ page }) => {
    await openStory(page, 'ai-thread--long-2000-virtualized');
    const scrollers = await page.locator('[data-ag-part="thread"]').evaluate((thread) =>
      [thread, ...thread.querySelectorAll('*')]
        .filter((el) => ['auto', 'scroll'].includes(getComputedStyle(el).overflowY))
        .map((el) => el.getAttribute('data-ag-part') ?? el.tagName));
    expect(scrollers).toEqual(['log']);
  });

  test('scrolled up: the first visible message moves ≤2px while the last message streams', async ({ page }) => {
    const log = await openStory(page, 'ai-thread--streaming-replay-virtualized');
    await page.waitForFunction(() => typeof (window as unknown as { __agThreadReplay?: unknown }).__agThreadReplay === 'object');
    await log.evaluate((el) => { el.scrollTop -= 1200; });
    await frames(page, 4);
    const anchor = await firstVisible(page);
    expect(anchor).not.toBeNull();
    await page.evaluate(async () => {
      const replay = (window as unknown as { __agThreadReplay: { step(n: number): void } }).__agThreadReplay;
      for (let i = 0; i < 120; i++) {
        replay.step(50);
        await new Promise((r) => requestAnimationFrame(r));
      }
    });
    await frames(page, 2);
    const now = await offsetOf(page, anchor!.id);
    expect(now).not.toBeNull();
    expect(Math.abs(now! - anchor!.offset)).toBeLessThanOrEqual(2);
  });

  test('prepending k=20 keeps the first visible message offset ±1px', async ({ page }) => {
    const log = await openStory(page, 'ai-thread--prepend-history');
    await page.waitForFunction(() => typeof (window as unknown as { __agThreadPrepend?: unknown }).__agThreadPrepend === 'function');
    await log.evaluate((el) => { el.scrollTop -= 2000; });
    await frames(page, 4);
    const anchor = await firstVisible(page);
    expect(anchor).not.toBeNull();
    const box = () => page.locator('[role="log"]').evaluate((l) => ({ top: l.scrollTop, height: l.scrollHeight }));
    const before = await box();
    await page.evaluate(() => (window as unknown as { __agThreadPrepend(k: number): void }).__agThreadPrepend(20));
    await frames(page, 3);
    const now = await offsetOf(page, anchor!.id);
    expect(now).not.toBeNull();
    expect(Math.abs(now! - anchor!.offset)).toBeLessThanOrEqual(1);
    // History really was prepended above the reader: the log grew and scrollTop
    // moved down by the inserted height, so the reader saw no jump.
    const after = await box();
    expect(after.height).toBeGreaterThan(before.height);
    expect(after.top).toBeGreaterThan(before.top);
    await expect(page.locator('[data-ag-part="jump-to-latest"]')).toHaveCount(0);
  });
});
