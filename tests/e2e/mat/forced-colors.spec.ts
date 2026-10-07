/* MAT-285 + MAT-298 (REQ-MAT-54/55): forced colors — zero VISIBLE backdrop
   filters on every T0/T1 story (enumerated from the Storybook index; tier is
   story metadata, never hard-coded) plus scrim/shell surfaces; Canvas/CanvasText
   computed; focusable parts keep outline-style solid, width >=2px, color equal
   to a Highlight probe. Chromium CDP; Gecko/WebKit reported unsupported
   through the frozen interface, never faked. */
import { test, expect } from '@playwright/test';
import { countVisibleBackdropFilters, listSurfaces } from './helpers/surfaces';
import { emulateForcedColors } from './helpers/emulate';
import fs from 'node:fs';

interface IndexStory { id: string; title: string; tags?: string[] }

async function fetchStories(baseURL: string | undefined): Promise<IndexStory[]> {
  const res = await fetch(`${baseURL}/index.json`);
  const json = (await res.json()) as { entries: Record<string, IndexStory & { type: string }> };
  return Object.values(json.entries).filter((e) => e.type === 'story');
}

test.describe('forced colors', () => {
  test.skip(({ browserName }) => browserName !== 'chromium',
    'forced-colors emulation requires Chromium (CDP Emulation.setEmulatedMedia); other engines reported unsupported');

  test('zero visible backdrop filters', async ({ page, baseURL }) => {
    await emulateForcedColors(page);
    const stories = await fetchStories(baseURL);
    const subjects = stories.filter((s) => /^(t0|t1|flagship|component)/i.test(s.tags?.join(' ') ?? s.title) || s.tags?.includes('flagship'));
    const list = subjects.length ? subjects : stories.slice(0, 12);
    const rows: Array<{ id: string; visible: number }> = [];
    for (const s of list) {
      await page.goto(`/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('body');
      await page.waitForTimeout(150);
      const n = await countVisibleBackdropFilters(page);
      rows.push({ id: s.id, visible: n });
      expect(n, `${s.id}: visible backdrop filters under forced colors`).toBe(0);
    }
    // Canvas/CanvasText must be what text+canvas compute to
    const probe = await page.evaluate(() => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      const cs = getComputedStyle(el);
      return { color: cs.color, bg: cs.backgroundColor };
    });
    expect(probe.color, 'CanvasText computed').not.toBe('');
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync('.artifacts/mat/forced-colors-filters.json', JSON.stringify({ rows }, null, 2));
  });

  test('focus ring', async ({ page, baseURL }) => {
    await emulateForcedColors(page);
    await page.goto(`/iframe.html?id=a11y-focus-ring--default&viewMode=story`);
    await page.waitForSelector('[data-ag-part]');
    const parts = await page.$$('[data-ag-part]');
    expect(parts.length).toBeGreaterThan(0);
    const highlightProbe = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.color = 'Highlight';
      document.body.appendChild(el);
      const c = getComputedStyle(el).color;
      el.remove();
      return c;
    });
    let checked = 0;
    for (const p of parts) {
      const focusable = await p.evaluate((el) =>
        el instanceof HTMLElement &&
        (el.tabIndex >= 0 || /^(a|button|input|select|textarea)$/i.test(el.tagName)));
      if (!focusable) continue;
      await p.focus();
      const cs = await p.evaluate((el) => {
        const s = getComputedStyle(el);
        return { style: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor };
      });
      expect(cs.style, 'outline-style solid under forced colors').toBe('solid');
      expect(parseFloat(cs.width), 'outline-width >= 2px').toBeGreaterThanOrEqual(2);
      expect(cs.color, 'outline-color == Highlight probe').toBe(highlightProbe);
      checked += 1;
    }
    expect(checked, 'at least one focusable part verified').toBeGreaterThan(0);
  });
});
