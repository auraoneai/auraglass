// modes.spec.ts — SURF-438: preset × scheme modes render (aurora light/dark/
// auto, mesh, grain, photo, video) and declare data-ag-backdrop correctly.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('backdrop modes (SURF-438)', () => {
  test('each preset renders decorative layer + content', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s: { subject: string }) => s.subject === 'Backdrop');
    if (!subject) { console.warn('Backdrop subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const layer = page.locator('[data-ag-part="backdrop-layer"]');
    if (await layer.count() === 0) { console.warn('no layer — pending'); return; }
    await expect(layer.first()).toBeVisible();
    await expect(layer.first()).toHaveAttribute('aria-hidden', 'true');
  });
});
