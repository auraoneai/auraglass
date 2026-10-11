// message.apg.spec.ts — SURF-383 / REQ-SURF-111, -114, -115 and the
// REQ-FIN-110 → REQ-FIN-85 live-region transfer: APG keyboard spec for
// AI/Message through the shared apg harness (QUAL L5 imports these files).
// A missing story fails the spec.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[data-ag-part="message"]').first()).toBeVisible();
}

test.describe('message APG (SURF-383)', () => {
  test('article named by its hidden "{author}, {time}" heading; no own live regions', async ({ page }) => {
    await openStory(page, 'ai-message--actions-focused');
    const article = page.getByRole('article');
    await expect(article).toHaveCount(1);
    await expect(article).toHaveAccessibleName(/^Assistant, 9:14\s?AM$/);
    // Allowed live regions only: a message adds none (speech goes through the
    // provider announcer; the streaming text node is aria-live="off").
    const live = await article.evaluate((el) =>
      [el, ...el.querySelectorAll('*')]
        .filter((n) => (n.hasAttribute('aria-live') && n.getAttribute('aria-live') !== 'off')
          || ['alert', 'status', 'log'].includes(n.getAttribute('role') ?? ''))
        .map((n) => n.getAttribute('data-ag-part')));
    expect(live).toEqual([]);
    await apg.axe(page);
  });

  test('actions are in the tab order and become visible on focus', async ({ page }) => {
    await openStory(page, 'ai-message--actions-focused');
    const actions = page.locator('[data-ag-part="message"] [data-ag-part="actions"]');
    await page.mouse.move(0, 0);
    // Fine pointers: hidden by opacity only until hover/focus. Coarse pointers
    // and no-hover devices: always visible.
    const alwaysShown = await page.evaluate(() => matchMedia('(pointer: coarse), (hover: none)').matches);
    await expect(actions).toHaveCSS('opacity', alwaysShown ? '1' : '0');
    await expect(page.getByRole('button', { name: 'Copy message' })).toBeAttached();
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'role=button[name=Copy message]' },
      { press: 'Tab', expectFocus: 'role=button[name=Regenerate]' },
      { press: 'Tab', expectFocus: 'role=button[name=Helpful]' },
      { press: 'Tab', expectFocus: 'role=button[name=Not helpful]' },
    ]);
    await expect(actions).toHaveCSS('opacity', '1');
    await apg.keyboard(page, [
      { press: 'Enter', expectState: { 'aria-pressed': 'true' } },
      { press: 'Shift+Tab', expectFocus: 'role=button[name=Helpful]' },
    ]);
    await apg.axe(page);
  });

  test('file parts: http link without download, blob download, javascript: as text', async ({ page }) => {
    await openStory(page, 'ai-message--file-links');
    const http = page.getByRole('link', { name: 'spec.pdf' });
    await expect(http).toHaveAttribute('href', /^https:/);
    await expect(http).not.toHaveAttribute('download', /.*/);
    await expect(page.getByRole('link', { name: 'local.pdf' })).toHaveAttribute('download', 'local.pdf');
    await expect(page.getByRole('link', { name: 'unsafe.pdf' })).toHaveCount(0);
    await expect(page.locator('a[href^="javascript:" i]')).toHaveCount(0);
    await expect(page.getByText('unsafe.pdf')).toBeVisible();
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'attachment-link' },
      { press: 'Tab', expectFocus: 'attachment-link' },
    ]);
    await apg.axe(page);
  });
});
