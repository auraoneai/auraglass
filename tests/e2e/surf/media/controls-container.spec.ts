// controls-container.spec.ts — REQ-SURF-135: the MediaControls row follows
// its container width: ≥480 full row; 320–479 Volume → Mute, Rate/PiP in a
// CMP Menu "More", elapsed time only; <320 Play + Scrubber; no wrapping.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const PARTS = ['media-play', 'media-scrubber', 'media-time', 'media-volume', 'media-mute', 'media-rate',
  'media-captions', 'media-pip', 'media-fullscreen', 'media-more'];

async function open(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'MediaControls' && s.id.endsWith('--responsive'));
  expect(subject, 'MediaControls Responsive story registered in the subject index').toBeTruthy();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[data-ag-part="media-controls"]')).toBeVisible();
}

async function atWidth(page: Page, width: number) {
  await page.locator('[data-ag-test="frame"]').evaluate((el, w) => { (el as HTMLElement).style.inlineSize = `${w}px`; }, width);
  const size = width < 320 ? 'minimal' : width < 480 ? 'compact' : 'full';
  await expect(page.locator('.ag-media-controls-frame')).toHaveAttribute('data-ag-media-size', size);
  return page.evaluate((parts) => {
    const toolbar = document.querySelector('[data-ag-part="media-controls"]') as HTMLElement;
    const visible = parts.filter((p) => {
      const el = toolbar.querySelector(`[data-ag-part="${p}"]`) as HTMLElement | null;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none';
    });
    const rows = new Set([...toolbar.children].map((c) => Math.round((c as HTMLElement).getBoundingClientRect().top)));
    return { visible, rows: rows.size, overflow: toolbar.scrollWidth - toolbar.clientWidth, time: toolbar.querySelector('[data-ag-part="media-time"]')?.textContent ?? null };
  }, PARTS);
}

test.describe('media controls container (REQ-SURF-135)', () => {
  test('≥480 px: full row', async ({ page }) => {
    await open(page);
    const r = await atWidth(page, 640);
    expect(r.visible).toEqual(['media-play', 'media-scrubber', 'media-time', 'media-volume', 'media-rate',
      'media-captions', 'media-pip', 'media-fullscreen']);
    expect(r.time).toMatch(/ \/ /);
    expect(r.rows).toBe(1);
    expect(r.overflow).toBeLessThanOrEqual(0);
  });

  test('480 px is still the full row', async ({ page }) => {
    await open(page);
    const r = await atWidth(page, 480);
    expect(r.visible).toContain('media-volume');
    expect(r.visible).not.toContain('media-more');
  });

  test('400 px: Mute + "More" trigger, Volume/Rate/PiP gone, elapsed time only', async ({ page }) => {
    await open(page);
    const r = await atWidth(page, 400);
    expect(r.visible).toEqual(['media-play', 'media-scrubber', 'media-time', 'media-mute', 'media-captions',
      'media-fullscreen', 'media-more']);
    expect(r.time).not.toMatch(/\//);
    expect(r.rows).toBe(1);
    const more = page.locator('[data-ag-part="media-more"]');
    await expect(more).toHaveAttribute('aria-haspopup', 'menu');
    await more.click();
    const menu = page.getByRole('menu', { name: 'More media controls' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitemradio', { name: 'Speed 1.5×' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Picture in picture' })).toBeVisible();
    await menu.getByRole('menuitemradio', { name: 'Speed 1.5×' }).click();
    await more.click();
    await expect(page.getByRole('menuitemradio', { name: 'Speed 1.5×' })).toHaveAttribute('aria-checked', 'true');
  });

  test('320 px: still compact', async ({ page }) => {
    await open(page);
    const r = await atWidth(page, 320);
    expect(r.visible).toContain('media-mute');
    expect(r.visible).toContain('media-more');
    expect(r.visible).not.toContain('media-volume');
  });

  test('<320 px: Play + Scrubber only', async ({ page }) => {
    await open(page);
    const r = await atWidth(page, 300);
    expect(r.visible).toEqual(['media-play', 'media-scrubber']);
    expect(r.rows).toBe(1);
    expect(r.overflow).toBeLessThanOrEqual(0);
  });

  test('play toggles aria-pressed and data-state', async ({ page }) => {
    await open(page);
    const play = page.locator('[data-ag-part="media-play"]');
    await expect(play).toHaveAttribute('aria-label', 'Play');
    await expect(play).toHaveAttribute('aria-pressed', 'false');
    await play.click();
    await expect(play).toHaveAttribute('aria-pressed', 'true');
    await expect(play).toHaveAttribute('aria-label', 'Play');
    await expect(page.locator('[data-ag-part="media-controls"]')).toHaveAttribute('data-state', 'playing');
  });
});
