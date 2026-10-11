// media-controls.apg.spec.ts — REQ-SURF-134/135/137 (APG toolbar): role +
// label, exactly one tab stop, ArrowRight/End/Home move focus among items,
// a focused slider keeps its arrows, Tab exits; axe 0 violations.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('MediaControls APG (REQ-SURF-135)', () => {
  test('toolbar roving focus and Tab exit', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MediaControls' && s.id.endsWith('--responsive'));
    expect(subject, 'MediaControls Responsive story registered in the subject index').toBeTruthy();
    await gotoStory(page, subject!.id);
    await page.locator('[data-testid="frame"]').evaluate((el) => { (el as HTMLElement).style.inlineSize = '720px'; });
    const toolbar = page.getByRole('toolbar', { name: 'Media controls' });
    await expect(toolbar).toBeVisible();

    expect(await toolbar.evaluate((el) => el.querySelectorAll('[tabindex="0"]').length)).toBe(1);
    const labels = await toolbar.locator('button').evaluateAll((els) => els.map((b) => b.getAttribute('aria-label')));
    expect(labels.every((l) => !!l)).toBe(true);

    const active = () => page.evaluate(() => document.activeElement?.closest('[data-ag-part^="media-"]')?.getAttribute('data-ag-part') ?? null);
    const play = page.locator('[data-ag-part="media-play"]');
    await play.focus();
    expect(await active()).toBe('media-play');
    await page.keyboard.press('ArrowRight');
    expect(await active()).toBe('media-scrubber');
    // the focused scrubber keeps its own arrows: value moves, focus stays
    const thumb = page.locator('[data-ag-part="media-scrubber"] input[type="range"]');
    const before = Number(await thumb.getAttribute('aria-valuenow'));
    await page.keyboard.press('ArrowRight');
    expect(await active()).toBe('media-scrubber');
    await expect(thumb).toHaveAttribute('aria-valuenow', String(before + 1));
    expect(await toolbar.evaluate((el) => el.querySelectorAll('[tabindex="0"]').length)).toBe(1);

    await play.focus();
    await page.keyboard.press('End');
    expect(await active()).toBe('media-fullscreen');
    await page.keyboard.press('Home');
    expect(await active()).toBe('media-play');
    await page.keyboard.press('ArrowLeft'); // wraps
    expect(await active()).toBe('media-fullscreen');

    // Tab leaves the toolbar in one step
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[data-ag-part="media-controls"]'))).toBe(false);
    await page.keyboard.press('Shift+Tab');
    expect(await active()).toBe('media-fullscreen');
  });

  test('shortcuts act only with focus inside the controls', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MediaControls' && s.id.endsWith('--responsive'));
    expect(subject).toBeTruthy();
    await gotoStory(page, subject!.id);
    const play = page.locator('[data-ag-part="media-play"]');
    await page.locator('body').press('k');
    await expect(play).toHaveAttribute('aria-pressed', 'false');
    await play.focus();
    await page.keyboard.press('k');
    await expect(play).toHaveAttribute('aria-pressed', 'true');
  });

  test('axe: 0 violations (full and compact rows)', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MediaControls' && s.id.endsWith('--responsive'));
    expect(subject).toBeTruthy();
    await gotoStory(page, subject!.id);
    for (const w of [720, 400]) {
      await page.locator('[data-testid="frame"]').evaluate((el, px) => { (el as HTMLElement).style.inlineSize = `${px}px`; }, w);
      await expect(page.locator('.ag-media-controls-frame')).toHaveAttribute('data-size', w < 480 ? 'compact' : 'full');
      const results = await new AxeBuilder({ page }).include('[data-ag-part="media-controls"]').analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    }
  });
});
