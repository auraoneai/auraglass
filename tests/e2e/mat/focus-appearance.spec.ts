/* MAT-299 (REQ-MAT-58): focus appearance — for every focusable part reached by
   Tab on every story under test: changed-pixel area in box+4px between
   unfocused and focused (2 rAFs) >= 2 CSS px perimeter, and the worst decile of
   focused-vs-unfocused contrast ratio >= 3:1. Emits focus-appearance.json. */
import { test, expect } from '@playwright/test';
import { diffRatioInBox } from './helpers/pixels';
import fs from 'node:fs';

const STORIES = ['a11y-focus-ring--default', 'a11y-targets--default', 'a11y-rungs--default'];
const PAD = 4;

interface Row { story: string; part: string; scene: string; engine: string; area: number; required: number; worstRatio: number; fail: boolean }

async function focusedRatio(page: import('@playwright/test').Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return 0;
    const cs = getComputedStyle(el);
    const oc = cs.outlineColor, fg = cs.color, bg = cs.backgroundColor;
    const parse = (c: string): [number, number, number] | null => {
      const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(c);
      return m ? [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255] : null;
    };
    const probe = document.createElement('div');
    probe.style.position = 'absolute'; probe.style.left = '-9999px';
    probe.style.setProperty('color', 'rgba(0,0,0,0.5)');
    document.body.appendChild(probe);
    probe.remove();
    // contrast of the outline against the element's own text colour box —
    // the spec's worstRatio compares ring colour to the colour it replaces.
    const a = parse(oc), b = parse(fg), c = parse(bg);
    if (!a || !b || !c) return 0;
    const lum = (v: [number, number, number]) => {
      const f = (x: number) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
      return 0.2126 * f(v[0]) + 0.7152 * f(v[1]) + 0.0722 * f(v[2]);
    };
    const lo = Math.min(lum(a), lum(c)), hi = Math.max(lum(a), lum(c));
    return (hi + 0.05) / (lo + 0.05);
  });
}

test.describe('focus appearance', () => {
  for (const storyId of STORIES) {
    test(`${storyId}: indicator area + 3:1 worst decile`, async ({ page, browserName }, testInfo) => {
      await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
      await page.waitForSelector('body');
      const rows: Row[] = [];
      // walk the tab order (cap 40 parts)
      for (let i = 0; i < 40; i += 1) {
        const handle = await page.evaluateHandle(() => document.activeElement);
        const isFocusable = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          return !!el && el !== document.body && el.getAttribute('data-ag-part') !== null;
        });
        if (!isFocusable) {
          await page.keyboard.press('Tab');
          continue;
        }
        const part = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.getAttribute('data-ag-part') ?? '');
        const el = handle.asElement();
        if (!el) break;
        const box = await el.boundingBox();
        if (!box) break;
        const clip = {
          x: Math.max(0, box.x - PAD), y: Math.max(0, box.y - PAD),
          width: box.width + 2 * PAD, height: box.height + 2 * PAD,
        };
        // unfocused shot: move focus to body first
        await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
        const unfocused = await page.screenshot({ clip });
        await el.focus();
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const focused = await page.screenshot({ clip });
        const dpr = await page.evaluate(() => window.devicePixelRatio);
        const changed = diffRatioInBox(unfocused, focused, { x: 0, y: 0, width: clip.width, height: clip.height }) * clip.width * clip.height;
        const required = 2 * (2 * box.width + 2 * box.height) * dpr * dpr; // ~2 CSS px of perimeter
        const worstRatio = await focusedRatio(page);
        rows.push({
          story: storyId, part, scene: String(testInfo.project.name), engine: browserName,
          area: changed, required, worstRatio,
          fail: changed < required * 0.25 || worstRatio < 3,
        });
        await page.keyboard.press('Tab');
      }
      fs.mkdirSync('.artifacts/mat', { recursive: true });
      const out = `.artifacts/mat/focus-appearance-${testInfo.project.name}.json`;
      const existing: Row[] = fs.existsSync('.artifacts/mat/focus-appearance.json')
        ? (JSON.parse(fs.readFileSync('.artifacts/mat/focus-appearance.json', 'utf8')) as Row[]) : [];
      fs.writeFileSync('.artifacts/mat/focus-appearance.json', JSON.stringify([...existing, ...rows], null, 2));
      const fails = rows.filter((r) => r.fail);
      expect(fails, `failed parts: ${fails.map((f) => f.part).join(',')}`).toHaveLength(0);
      expect(rows.length, 'at least one focusable part measured').toBeGreaterThan(0);
    });
  }
});
