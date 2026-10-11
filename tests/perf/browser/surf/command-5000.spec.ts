// command-5000.spec.ts — SURF-089: 5,000-item command list renders in budget. Remote perf lane; a missing subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('command-5000.spec.ts (SURF)', () => {
  test('command palette 5000 items under 4s', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Command');
    if (!subject) throw new Error('Command subject not registered');
    await gotoStory(page, subject.id);
    const t0 = Date.now();
    await page.waitForSelector('[data-ag-part="command"], [data-ag-part="command-palette"]', { timeout: 10_000 });
    expect(Date.now() - t0).toBeLessThan(4000);
  });
});
