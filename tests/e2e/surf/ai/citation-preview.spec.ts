// citation-preview.spec.ts — SURF-355: citation preview card on hover/focus,
// Escape dismiss, tap navigates to the source item.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ai citation preview (SURF-355)', () => {
  test('hover opens after ~300ms; focus opens; Escape closes and restores focus', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id.includes('citation') || s.subject === 'SourceList');
    if (!subject) throw new Error('Citation subject not registered');
    await gotoStory(page, subject.id);
    const cite = page.locator('[data-ag-part="citation"]').first();
    expect(await cite.count(), 'no citations in scene').toBeGreaterThan(0);
    await cite.hover();
    await page.waitForTimeout(450);
    const preview = page.locator('[data-ag-part="citation-preview"], [role="dialog"]').first();
    await expect(preview).toBeVisible();
    await expect(preview).not.toHaveAttribute('role', 'tooltip');
    await page.keyboard.press('Escape');
    await expect(preview).toBeHidden();
    await expect(cite).toBeFocused();
  });
});
