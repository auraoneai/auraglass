// nav-layout.spec.ts — REQ-FIN-82 layout legs for merged #357/#358:
// SURF-57 breadcrumbs truncate at 390 px (<=16ch, full accessible name) and
// SURF-59 pagination compact at 390 px (exactly Previous, 'Page N of M',
// Next). Remote lane only; a missing subject fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.id === id);
  if (!subject) throw new Error(`${id} subject not registered`);
  await gotoStory(page, subject.id);
}

test.describe('SURF nav layout at 390px', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('breadcrumbs truncate at 390: a 40-char link is <=16ch wide and keeps its full name', async ({ page }) => {
    await openStory(page, 'surf-breadcrumbs--long-label');
    const full = 'A forty character breadcrumb label here!';
    const link = page.getByRole('link', { name: full, exact: true });
    await expect(link).toBeVisible();
    const { width, ch } = await link.evaluate((el) => {
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;visibility:hidden;inline-size:16ch;font:inherit';
      el.parentElement!.appendChild(probe);
      const ch16 = probe.getBoundingClientRect().width;
      probe.remove();
      return { width: el.getBoundingClientRect().width, ch: ch16 };
    });
    expect(width).toBeLessThanOrEqual(ch + 0.5);
    expect(await link.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true); // actually truncated
    await expect(page.locator('[data-ag-part="current"]')).toHaveText('Here');
  });

  test("pagination compact at 390: exactly Previous, 'Page N of M' and Next are visible", async ({ page }) => {
    for (const id of ['surf-pagination--default', 'surf-pagination--buttons']) {
      await test.step(id, async () => {
        await openStory(page, id);
        const nav = page.locator('[data-ag-part="pagination"]');
        const visible = await nav.evaluate((root) =>
          [...root.querySelectorAll<HTMLElement>('[data-ag-part]')]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
            })
            .map((el) => el.getAttribute('data-ag-part'))
            .filter((p) => p !== 'item' && p !== 'pagination-list'),
        );
        expect(visible).toEqual(['status', 'previous', 'next']);
        await expect(nav.locator('[data-ag-part="status"]')).toHaveText('Page 5 of 12');
        await expect(nav.locator('[data-ag-part="previous"]')).toBeVisible();
        await expect(nav.locator('[data-ag-part="next"]')).toBeVisible();
      });
    }
  });
});
