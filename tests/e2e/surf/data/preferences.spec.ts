// preferences.spec.ts — REQ-SURF-189 (NAV-78/79): under contrast: more the shell
// chrome visibly changes (pixel diff inside TopBar and Sidebar > 0.5% vs
// default) with 0 contrast failures; reduced transparency resolves the chrome
// to MAT's tinted / solid rungs (D-11). Remote lane only; a missing subject
// fails the test.
import { test, expect, type Page } from '@playwright/test';
import pngjs from 'pngjs';
import { listSubjects, gotoStory, apg } from '../../../helpers';

const Png = pngjs.PNG;
const CHROME = ['.ag-app-shell .ag-top-bar', '.ag-app-shell .ag-sidebar'] as const;

async function fullChromeStory(): Promise<string> {
  const subjects = await listSubjects({ owner: 'SURF' });
  const s = subjects.find((x) => x.subject === 'AppShell' && x.id.endsWith('--full-chrome'));
  if (!s) throw new Error('AppShell FullChrome subject not registered');
  return s.id;
}

/** Share of pixels that differ (any channel > 8/255) over the union box of two PNGs. */
function diffRatio(a: Buffer, b: Buffer): number {
  const pa = Png.sync.read(a);
  const pb = Png.sync.read(b);
  const w = Math.max(pa.width, pb.width);
  const h = Math.max(pa.height, pb.height);
  let differing = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const inA = x < pa.width && y < pa.height;
      const inB = x < pb.width && y < pb.height;
      if (!inA || !inB) { differing++; continue; }
      const ia = (y * pa.width + x) * 4;
      const ib = (y * pb.width + x) * 4;
      for (let c = 0; c < 4; c++) {
        if (Math.abs((pa.data[ia + c] ?? 0) - (pb.data[ib + c] ?? 0)) > 8) { differing++; break; }
      }
    }
  }
  return differing / (w * h);
}

/** Alpha of the element's computed background colour (rgb()/rgba()/color()/oklch() forms). */
const backgroundAlpha = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg === 'transparent') return 0;
    const slash = bg.match(/\/\s*([\d.]+)(%?)\s*\)$/);
    if (slash) return slash[2] === '%' ? Number(slash[1]) / 100 : Number(slash[1]);
    const rgba = bg.match(/^rgba\([^)]*,\s*([\d.]+)\s*\)$/);
    return rgba ? Number(rgba[1]) : 1;
  });

test.describe('shell preferences (REQ-SURF-189)', () => {
  test('contrast more: TopBar and Sidebar pixels change > 0.5% vs default', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const id = await fullChromeStory();
    await gotoStory(page, id, { contrast: 'standard', motion: 'none' });
    const before = await Promise.all(CHROME.map((sel) => page.locator(sel).first().screenshot({ animations: 'disabled' })));
    await gotoStory(page, id, { contrast: 'more', motion: 'none' });
    await expect(page.locator('html')).toHaveAttribute('data-ag-contrast', 'more');
    const after = await Promise.all(CHROME.map((sel) => page.locator(sel).first().screenshot({ animations: 'disabled' })));
    CHROME.forEach((sel, i) => {
      expect.soft(diffRatio(before[i]!, after[i]!), `${sel} pixel diff`).toBeGreaterThan(0.005);
    });
  });

  test('contrast more: 0 contrast failures in the shell chrome', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, await fullChromeStory(), { contrast: 'more' });
    await apg.axe(page, { colorContrast: true });
  });

  test('reduced transparency resolves the chrome to the tinted rung; solid is opaque with no backdrop', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const id = await fullChromeStory();
    const sidebar = '.ag-app-shell .ag-sidebar';

    await gotoStory(page, id, { transparency: 'glass' });
    const glass = await backgroundAlpha(page, sidebar);
    await gotoStory(page, id, { transparency: 'tinted' });
    const tinted = await backgroundAlpha(page, sidebar);
    expect(tinted).toBeGreaterThanOrEqual(glass);

    await gotoStory(page, id, { transparency: 'solid' });
    expect(await backgroundAlpha(page, sidebar)).toBeGreaterThanOrEqual(0.85);
    const solidBackdrop = await page.locator(sidebar).first().evaluate((el) => {
      const cs = getComputedStyle(el, '::before');
      return cs.backdropFilter || (cs as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || 'none';
    });
    expect(solidBackdrop).toBe('none');

    // OS preference (Chromium exposes prefers-reduced-transparency emulation over CDP):
    // the default glass rung resolves to the tinted floor.
    if (browserName === 'chromium') {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
      await gotoStory(page, id, { transparency: 'glass' });
      expect(await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches)).toBe(true);
      expect(await backgroundAlpha(page, sidebar)).toBeCloseTo(tinted, 2);
    }
  });

  test('data Table renders under contrast more and reduced transparency with 0 contrast failures', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Table');
    if (!subject) throw new Error('Table subject not registered');
    for (const env of [{ contrast: 'more' as const }, { transparency: 'solid' as const }]) {
      await gotoStory(page, subject.id, env);
      await expect(page.locator('[data-ag-part="table"], table').first()).toBeVisible();
      await apg.axe(page, { colorContrast: true });
    }
  });
});
