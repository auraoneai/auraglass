// sidebar-toggle.spec.ts — SURF-045: sidebar toggle stays under 100ms frame. Remote perf lane; a missing subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('sidebar-toggle.spec.ts (SURF)', () => {
  test('sidebar toggle stays under the frame budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) throw new Error('AppShell subject not registered');
    await gotoStory(page, subject.id);
    const toggle = page.locator('[data-ag-part="sidebar-toggle"]').first();
    expect(await toggle.count(), 'no toggle').toBeGreaterThan(0);
    const ms = await page.evaluate(async () => {
      const t0 = performance.now();
      document.querySelector<HTMLElement>('[data-ag-part="sidebar-toggle"]')?.click();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return performance.now() - t0;
    });
    expect(ms).toBeLessThan(100);
  });
});
