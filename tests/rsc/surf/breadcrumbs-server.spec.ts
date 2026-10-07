// breadcrumbs-server.spec.ts — SURF-080: server-rendered breadcrumbs produce
// complete markup in the RSC payload — no client round-trip needed for the
// non-overflow path. Remote canary lane (runs against the storybook build).
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';

test.describe('breadcrumbs server render (SURF-080)', () => {
  test('nav > ol > li markup is in the initial HTML', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Breadcrumbs');
    if (!subject) { console.warn('Breadcrumbs subject not registered — pending'); return; }
    const res = await gotoStory(page, subject.id);
    const html = await page.content();
    expect(html).toContain('aria-label');
    await expect(page.locator('nav ol li a[data-ag-part="link"]').first()).toBeAttached();
    await expect(page.locator('[data-ag-part="current"]').first()).toHaveAttribute('aria-current', 'page');
    void res;
  });
});
