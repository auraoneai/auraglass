// thread-scroll.spec.ts — REQ-SURF-108 (SURF-351): pinned follow and
// scroll-up stability over the AI/Thread StreamingReplay story. Remote lane
// only (Chromium/WebKit/Gecko). A missing story fails the spec.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const TOKENS_PER_FRAME = 50;

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  const log = page.locator('[role="log"]');
  await expect(log).toHaveCount(1);
  await expect(log).toBeVisible();
  await page.waitForFunction(() => typeof (window as unknown as { __agThreadReplay?: unknown }).__agThreadReplay === 'object');
  return log;
}

/** Streams `frames` × 50 tokens, one batch per animation frame. */
async function stream(page: Page, frames: number) {
  await page.evaluate(async ({ frames, perFrame }) => {
    const replay = (window as unknown as { __agThreadReplay: { step(n: number): void } }).__agThreadReplay;
    for (let i = 0; i < frames; i++) {
      replay.step(perFrame);
      await new Promise((r) => requestAnimationFrame(r));
    }
    // Let the last commit and the follow frame land.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, { frames, perFrame: TOKENS_PER_FRAME });
}

const metrics = (page: Page) =>
  page.locator('[role="log"]').evaluate((el) => ({
    scrollTop: el.scrollTop,
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    distance: el.scrollHeight - el.scrollTop - el.clientHeight,
  }));

test.describe('ai thread scroll (REQ-SURF-108)', () => {
  test('pinned thread: distance from bottom ≤1px after 300 frames at 50 tokens/frame', async ({ page }) => {
    await openStory(page, 'ai-thread--streaming-replay');
    await expect.poll(async () => (await metrics(page)).distance).toBeLessThanOrEqual(1);
    const before = await metrics(page);
    await stream(page, 300);
    const after = await metrics(page);
    // The stream grew the log by several viewports; following kept the bottom in view.
    expect(after.scrollHeight - before.scrollHeight).toBeGreaterThan(after.clientHeight);
    expect(after.distance).toBeLessThanOrEqual(1);
  });

  test('scrolled up 400px: scrollTop stays within ±1px while the last message streams', async ({ page }) => {
    const log = await openStory(page, 'ai-thread--streaming-replay');
    await stream(page, 20);
    await expect.poll(async () => (await metrics(page)).distance).toBeLessThanOrEqual(1);
    await log.evaluate((el) => { el.scrollTop -= 400; });
    await expect.poll(async () => (await metrics(page)).distance).toBeGreaterThanOrEqual(399);
    const held = (await metrics(page)).scrollTop;
    await stream(page, 100);
    const after = await metrics(page);
    expect(Math.abs(after.scrollTop - held)).toBeLessThanOrEqual(1);
    expect(after.distance).toBeGreaterThan(400);
  });

  test('new replies while scrolled up show the pill; activating it re-pins and focuses the log', async ({ page }) => {
    const log = await openStory(page, 'ai-thread--streaming-replay');
    await expect.poll(async () => (await metrics(page)).distance).toBeLessThanOrEqual(1);
    await log.evaluate((el) => { el.scrollTop -= 400; });
    await expect.poll(async () => (await metrics(page)).distance).toBeGreaterThanOrEqual(399);
    await page.evaluate(() => (window as unknown as { __agThreadReplay: { append(n: number): void } }).__agThreadReplay.append(2));
    const pill = page.getByRole('button', { name: '2 new messages' });
    await expect(pill).toBeVisible();
    await pill.click();
    await expect.poll(async () => (await metrics(page)).distance).toBeLessThanOrEqual(1);
    await expect(page.locator('[data-ag-part="jump-to-latest"]')).toHaveCount(0);
    await expect(log).toBeFocused();
  });
});
