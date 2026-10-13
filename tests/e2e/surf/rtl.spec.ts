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
// direction for the navigable SURF surfaces, plus axe clean. Every check is
// unconditional: the canary page (canaries/next16/app/surf/rtl) renders all
// six surfaces, so a missing element fails the count assertion instead of
// silently dropping the check.
test.describe('RTL mirroring (REQ-SURF-10)', () => {
  test.beforeEach(async ({ page }) => {
    // remote lane only (the canary server it reads is remote): a local run fails, never skips (PRD §18)
    expect(process.env.AG_REMOTE_RUNNER, 'remote lane only: run on the remote runner (AG_REMOTE_RUNNER=1)').toBe('1');
    await page.goto(`${process.env.AG_CANARY_BASE_URL ?? 'http://localhost:3116'}/surf/rtl`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-ag-canary="surf-rtl"]')).toHaveCount(1);
  });

  test('rtl surfaces mirror bounding-box x-order', async ({ page }) => {
    const { AxeBuilder } = await import('@axe-core/playwright');
    const checks = await page.evaluate(() => {
      const counts: Record<string, number> = {};
      const left = (sel: string) => {
        const els = [...document.querySelectorAll(sel)];
        counts[sel] = els.length;
        return els.map((el) => el.getBoundingClientRect().left);
      };
      // Sidebar: in RTL the sidebar sits on the RIGHT (x > center)
      const sidebarLefts = left('[data-ag-part="sidebar"]');
      const crumbs = left('[data-ag-part="breadcrumbs"] a');
      const handle = left('[data-ag-part="resize-handle"]');
      const panels = left('[data-ag-part="resizable-panel"]');
      const avatar = left('[data-ag-part="message"] [data-ag-part="avatar"]');
      const content = left('[data-ag-part="message"] [data-ag-part="content"]');
      const headers = left('table thead th');
      const indicators = left('[data-ag-part="carousel-indicator"]');
      return {
        counts,
        sidebarRight: sidebarLefts.length === 1 && sidebarLefts[0]! > window.innerWidth / 2,
        // Breadcrumbs: the first item is rightmost in RTL
        crumbsMirrored: crumbs.length > 1 && crumbs[0]! > crumbs[crumbs.length - 1]!,
        // ResizablePanels: the first panel is rightmost; the handle sits on
        // the LEFT edge of the panel that follows it in DOM order
        panelsMirrored: panels.length > 1 && panels[0]! > panels[panels.length - 1]!,
        handleLeftOfPanel: handle.length === 1 && panels.length > 1 && Math.abs(handle[0]! - panels[1]!) < 8,
        // Message: the avatar column mirrors (avatar after content in x)
        avatarMirrored: avatar.length === 1 && content.length === 1 && avatar[0]! > content[0]!,
        // Table: the first column header is rightmost in RTL
        tableMirrored: headers.length > 1 && headers[0]! > headers[headers.length - 1]!,
        // CarouselRail: the first indicator tab is rightmost in RTL
        carouselMirrored: indicators.length > 1 && indicators[0]! > indicators[indicators.length - 1]!,
      };
    });
    // Presence is asserted, never assumed: every surface rendered.
    expect(checks.counts).toEqual({
      '[data-ag-part="sidebar"]': 1,
      '[data-ag-part="breadcrumbs"] a': 2,
      '[data-ag-part="resize-handle"]': 1,
      '[data-ag-part="resizable-panel"]': 2,
      '[data-ag-part="message"] [data-ag-part="avatar"]': 1,
      '[data-ag-part="message"] [data-ag-part="content"]': 1,
      'table thead th': 3,
      '[data-ag-part="carousel-indicator"]': 3,
    });
    const { counts: _counts, ...mirrored } = checks;
    expect(mirrored).toEqual({
      sidebarRight: true,
      crumbsMirrored: true,
      panelsMirrored: true,
      handleLeftOfPanel: true,
      avatarMirrored: true,
      tableMirrored: true,
      carouselMirrored: true,
    });
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });

  test('carousel arrow keys follow RTL direction (ArrowLeft advances)', async ({ page }) => {
    const tabs = page.getByRole('tablist').getByRole('tab');
    await expect(tabs).toHaveCount(3);
    await tabs.nth(0).focus();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    // In RTL the visual "next" is to the left: ArrowLeft moves to Card 2,
    // ArrowRight moves back to Card 1.
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  });
});
