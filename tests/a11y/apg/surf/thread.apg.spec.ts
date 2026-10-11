// thread.apg.spec.ts — SURF-382 / REQ-SURF-107..110 and the REQ-FIN-110 →
// REQ-FIN-85 live-region transfer: APG keyboard spec for AI/Thread through the
// shared apg harness (QUAL L5 imports these files). A missing story fails.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[role="log"]')).toHaveCount(1);
}

/** Tabbable elements inside the thread, in sequential focus order. */
const tabOrder = (page: Page) =>
  page.locator('[data-ag-part="thread"]').evaluate((thread) => {
    const sel = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]';
    const els = [...thread.querySelectorAll<HTMLElement>(sel)].filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);
    // Positive tabindex is never used inside Thread; DOM order is focus order.
    return els.map((el) => ({ part: el.getAttribute('data-ag-part'), tabIndex: el.tabIndex }));
  });

test.describe('thread log APG (SURF-382)', () => {
  test('log: one role=log, labelled, focusable, not aria-live; only allowed live regions', async ({ page }) => {
    await openStory(page, 'ai-thread--short');
    const log = page.locator('[role="log"]');
    await expect(log).toHaveAttribute('aria-label', /.+/);
    await expect(log).toHaveAttribute('aria-relevant', 'additions');
    await expect(log).not.toHaveAttribute('aria-live', /.*/);
    // REQ-FIN-110 transfer (allowed live regions): inside the thread the only
    // live node is the log itself (implicit polite); announcements go through
    // the provider announcer, outside the thread.
    const live = await page.locator('[data-ag-part="thread"]').evaluate((thread) =>
      [thread, ...thread.querySelectorAll('*')]
        .filter((el) => (el.hasAttribute('aria-live') && el.getAttribute('aria-live') !== 'off')
          || ['alert', 'status', 'log'].includes(el.getAttribute('role') ?? ''))
        .map((el) => el.getAttribute('data-ag-part')));
    expect(live).toEqual(['log']);
    await apg.keyboard(page, [{ press: 'Tab', expectFocus: 'log' }]);
    await apg.axe(page);
  });

  test('focused log scrolls with End/Home; tab order starts at the log and ends at the jump pill', async ({ page }) => {
    await openStory(page, 'ai-thread--streaming-replay');
    const log = page.locator('[role="log"]');
    await apg.keyboard(page, [{ press: 'Tab', expectFocus: 'log' }]);
    await apg.keyboard(page, [{ press: 'Home' }]);
    await expect.poll(() => log.evaluate((el) => el.scrollTop)).toBeLessThanOrEqual(1);
    await apg.keyboard(page, [{ press: 'End' }]);
    await expect.poll(() => log.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight)).toBeLessThanOrEqual(1);

    // Unpin, receive two replies: the pill appears, named by its visible text.
    await apg.keyboard(page, [{ press: 'Home' }]);
    await expect.poll(() => log.evaluate((el) => el.scrollTop)).toBeLessThanOrEqual(1);
    await page.evaluate(() => (window as unknown as { __agThreadReplay: { append(n: number): void } }).__agThreadReplay.append(2));
    const pill = page.getByRole('button', { name: '2 new messages' });
    await expect(pill).toBeVisible();
    await expect(pill).not.toHaveAttribute('aria-label', /.*/);

    const order = await tabOrder(page);
    expect(order.length).toBeGreaterThanOrEqual(2);
    expect(order[0]).toEqual({ part: 'log', tabIndex: 0 });
    expect(order[order.length - 1]?.part).toBe('jump-to-latest');
    expect(order.filter((o) => o.part === 'log')).toHaveLength(1);
    expect(order.every((o) => o.tabIndex === 0)).toBe(true);

    // Keyboard activation re-pins and returns focus to the log.
    await pill.focus();
    await apg.keyboard(page, [{ press: 'Enter', expectFocus: 'log' }]);
    await expect.poll(() => log.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight)).toBeLessThanOrEqual(1);
    await expect(page.locator('[data-ag-part="jump-to-latest"]')).toHaveCount(0);
    await apg.axe(page);
  });
});
