// tests/e2e/surf/rtl.spec.ts — SURF RTL slice of QUAL's dir=rtl matrix
// (L12). listSubjects enumerates shipped SURF subjects; absent dirs report
// absence and pass — nothing hard-codes another lane's output.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';

test.describe('SURF RTL', () => {
  test('every shipped SURF subject mirrors cleanly under dir=rtl', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    for (const subject of subjects) {
      await test.step(`${subject.id} renders without horizontal overflow in dir=rtl`, async () => {
        await gotoStory(page, subject.id);
        await page.evaluate(() => {
          document.documentElement.setAttribute('dir', 'rtl');
        });
        const doc = await page.evaluate(() => document.documentElement.dir);
        expect(doc).toBe('rtl');
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `${subject.id} overflows by ${overflow}px in dir=rtl`).toBeLessThanOrEqual(0);
      });
    }
  });
});

// REQ-SURF-10 — mirroring assertions: bounding-box x-order and arrow
// direction for the navigable SURF surfaces, plus axe clean.
test.describe('RTL mirroring (REQ-SURF-10)', () => {
  test.skip(!process.env.AG_REMOTE_RUNNER, 'remote lane only');
  test('rtl surfaces mirror x-order and arrows', async ({ page }) => {
    const { AxeBuilder } = await import('@axe-core/playwright');
    await page.goto(`${process.env.AG_CANARY_BASE_URL ?? 'http://localhost:3116'}/surf/rtl`, { waitUntil: 'networkidle' });
    const checks = await page.evaluate(() => {
      const results: Record<string, boolean> = {};
      // Sidebar: in RTL the sidebar landmark sits on the RIGHT (x > center)
      const sidebar = document.querySelector('[data-ag-part="sidebar"]');
      if (sidebar) { const r = sidebar.getBoundingClientRect(); results.sidebarRight = r.left > window.innerWidth / 2; }
      // Breadcrumbs: first item is rightmost in RTL
      const links = [...document.querySelectorAll('[data-ag-part="breadcrumbs"] a')];
      if (links.length > 1) { results.crumbsMirrored = links[0].getBoundingClientRect().left > links[links.length - 1].getBoundingClientRect().left; }
      // ResizablePanels: handle on the LEFT edge of the second panel in RTL
      const handle = document.querySelector('[data-ag-part="resize-handle"]');
      const panels = [...document.querySelectorAll('[data-ag-part="resizable-panel"]')];
      if (handle && panels.length > 1) {
        const h = handle.getBoundingClientRect(); const p = panels[1].getBoundingClientRect();
        results.handleLeftOfPanel = Math.abs(h.left - p.left) < 8;
      }
      // Message: avatar column mirrors (avatar after content in x)
      const avatar = document.querySelector('[data-ag-part="message-avatar"],[data-ag-part="avatar"]');
      const content = document.querySelector('[data-ag-part="message-content"],[data-ag-part="text-part"]');
      if (avatar && content) results.avatarMirrored = avatar.getBoundingClientRect().left > content.getBoundingClientRect().left;
      return results;
    });
    expect({ checks }).toEqual({ checks: Object.fromEntries(Object.entries(checks).map(([k]) => [k, true])) });
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
});
