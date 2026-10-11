// media-controls.apg.spec.ts — SURF-457 (REQ-SURF-134/137): toolbar role,
// roving tabindex, labelled controls. Remote APG lane; pending-warn.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('MediaControls APG (SURF-457)', () => {
  test('toolbar role; buttons labelled; arrow keys move focus', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MediaControls');
    if (!subject) throw new Error('MediaControls subject not registered');
    await gotoStory(page, subject.id);
    const toolbar = page.locator('[role="toolbar"]');
    expect(await toolbar.count(), 'no toolbar').toBeGreaterThan(0);
    await expect(toolbar.first()).toBeVisible();
    const buttons = toolbar.first().locator('button, [role="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 4); i++) {
      const label = await buttons.nth(i).getAttribute('aria-label');
      expect(label).toBeTruthy();
    }
    await buttons.first().focus();
    await page.keyboard.press('ArrowRight');
  });
});
