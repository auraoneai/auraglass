// now-playing-container.spec.ts — SURF-461 (REQ-SURF-139): the NowPlayingBar
// row follows its container (@container ag-now-playing): ≥360 px every part on
// one row; below 360 px only Play remains with a truncated title. Expand
// controls its region through aria-controls.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const PARTS = ['now-playing-artwork', 'now-playing-title', 'now-playing-subtitle', 'now-playing-prev',
  'now-playing-play', 'now-playing-next', 'now-playing-progress', 'now-playing-expand'];

async function open(page: Page, story: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'NowPlayingBar' && s.id.endsWith(`--${story}`));
  expect(subject, `NowPlayingBar ${story} story registered in the subject index`).toBeTruthy();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[data-ag-part="now-playing"]')).toBeVisible();
}

async function atWidth(page: Page, width: number) {
  await page.locator('[data-testid="frame"]').evaluate((el, w) => { (el as HTMLElement).style.inlineSize = `${w}px`; }, width);
  await expect.poll(() => page.locator('[data-ag-part="now-playing"]').evaluate((el) => Math.round(el.getBoundingClientRect().width)))
    .toBe(width);
  return page.evaluate((parts) => {
    const bar = document.querySelector('[data-ag-part="now-playing"]') as HTMLElement;
    const boxes = parts.flatMap((p) => {
      const el = bar.querySelector(`[data-ag-part="${p}"]`) as HTMLElement | null;
      if (!el) return [];
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none' ? [{ p, top: r.top, bottom: r.bottom }] : [];
    });
    const title = bar.querySelector('[data-ag-part="now-playing-title"]') as HTMLElement;
    const barBox = bar.getBoundingClientRect();
    // the progress hairline is drawn over the bar's bottom edge, not in the row
    const row = boxes.filter((b) => b.p !== 'now-playing-progress');
    const progress = boxes.find((b) => b.p === 'now-playing-progress');
    return {
      visible: boxes.map((b) => b.p),
      // one row: every visible part shares a horizontal band
      oneRow: row.length > 0 && Math.max(...row.map((b) => b.top)) < Math.min(...row.map((b) => b.bottom)),
      progressOnBottomEdge: !!progress && Math.abs(progress.bottom - barBox.bottom) <= 0.5,
      height: barBox.height,
      overflow: bar.scrollWidth - bar.clientWidth,
      titleTruncated: title.scrollWidth > title.clientWidth && getComputedStyle(title).textOverflow === 'ellipsis',
    };
  }, PARTS);
}

test.describe('now-playing container (SURF-461, REQ-SURF-139)', () => {
  test('600 px: every part on a single row', async ({ page }) => {
    await open(page, 'responsive');
    const r = await atWidth(page, 600);
    expect(r.visible).toEqual(PARTS);
    expect(r.oneRow).toBe(true);
    expect(r.progressOnBottomEdge).toBe(true);
    expect(r.overflow).toBeLessThanOrEqual(0);
    /* REQ-SURF-139: 48 px at a fine pointer */
    expect(Math.abs(r.height - 48), `bar height ${r.height}px`).toBeLessThanOrEqual(0.5);
  });

  test('360 px: still the single full row', async ({ page }) => {
    await open(page, 'responsive');
    const r = await atWidth(page, 360);
    expect(r.visible).toEqual(PARTS);
    expect(r.oneRow).toBe(true);
    expect(r.overflow).toBeLessThanOrEqual(0);
  });

  test('320 px: Play + truncated title only', async ({ page }) => {
    await open(page, 'responsive');
    const r = await atWidth(page, 320);
    expect(r.visible).toEqual(['now-playing-title', 'now-playing-play', 'now-playing-progress']);
    expect(r.oneRow).toBe(true);
    expect(Math.abs(r.height - 48), `bar height ${r.height}px`).toBeLessThanOrEqual(0.5);
    expect(r.overflow).toBeLessThanOrEqual(0);
    expect(r.titleTruncated).toBe(true);
  });

  test('Expand toggles aria-expanded and the region it controls', async ({ page }) => {
    await open(page, 'expandable');
    const expand = page.locator('[data-ag-part="now-playing-expand"]');
    await expect(expand).toHaveAttribute('aria-controls', 'np-expanded');
    await expect(expand).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#np-expanded')).toBeHidden();
    await expand.click();
    await expect(expand).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#np-expanded')).toBeVisible();
  });
});

test.describe('now-playing height at a coarse pointer (REQ-SURF-139)', () => {
  /* touch + mobile emulation makes Chromium match (pointer: coarse) */
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('56 px tall at 360 px', async ({ page }) => {
    await open(page, 'responsive');
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), 'coarse pointer emulated').toBe(true);
    const r = await atWidth(page, 360);
    expect(r.oneRow).toBe(true);
    expect(Math.abs(r.height - 56), `bar height ${r.height}px`).toBeLessThanOrEqual(0.5);
  });
});
