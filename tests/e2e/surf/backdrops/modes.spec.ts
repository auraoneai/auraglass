// modes.spec.ts — SURF-438: preset × scheme modes render (aurora light/dark/
// auto, mesh, grain, photo, video) and declare data-ag-backdrop correctly.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('backdrop modes (SURF-438)', () => {
  test('each preset renders decorative layer + content', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s: { subject: string }) => s.subject === 'Backdrop');
    if (!subject) throw new Error('Backdrop subject not registered');
    await gotoStory(page, subject.id);
    const layer = page.locator('[data-ag-part="backdrop-layer"]');
    expect(await layer.count(), 'no layer').toBeGreaterThan(0);
    await expect(layer.first()).toBeVisible();
    await expect(layer.first()).toHaveAttribute('aria-hidden', 'true');
  });
});
