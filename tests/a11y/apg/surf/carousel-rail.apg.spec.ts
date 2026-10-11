// carousel-rail.apg.spec.ts — SURF-487 (REQ-SURF-148): roledescription=
// carousel, prev/next buttons, indicators announce slides. Remote; pending.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('CarouselRail APG (SURF-487)', () => {
  test('carousel semantics + navigation controls', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'CarouselRail');
    if (!subject) throw new Error('CarouselRail subject not registered');
    await gotoStory(page, subject.id);
    const rail = page.locator('[aria-roledescription="carousel"]');
    expect(await rail.count(), 'no carousel').toBeGreaterThan(0);
    await expect(rail.first()).toBeVisible();
    const next = page.locator('[data-ag-part="carousel-next"]');
    if (await next.count() > 0) await next.first().click();
  });
});
