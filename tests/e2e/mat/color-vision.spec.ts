/* MAT-314 (REQ-A11Y-34): color vision — every intent pair in the intent matrix
   must stay discriminable under protan/deutan/tritan severity-1.0 simulation:
   ΔE2000 >= 10 for every pair, or the cell carries a registered non-colour cue
   (data-ag-part="intent-icon" with an accessible name, or literal text).
   REQ-MAT-65: the A11y/ColorVision fixture is resolved through listSubjects()
   and must be MAT-owned. */
import { test, expect } from '@playwright/test';
import { simulateCvd } from './helpers/machado';
import { deltaE2000 } from './helpers/ciede2000';
import { listSubjects } from '../../helpers';
import { matFixture } from './helpers/subjects';
import fs from 'node:fs';

const STORY = 'a11y-colorvision--default';
const CVD = ['protan', 'deutan', 'tritan'] as const;

// sRGB -> CIE Lab (D65)
function srgbToLab(r: number, g: number, b: number) {
  const f = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const [lr, lg, lb] = [f(r), f(g), f(b)];
  const x = (0.4124 * lr + 0.3576 * lg + 0.1805 * lb) / 0.95047;
  const y = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  const z = (0.0193 * lr + 0.1192 * lg + 0.9505 * lb) / 1.08883;
  const t = (v: number) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
  return { L: 116 * t(y) - 16, a: 500 * (t(x) - t(y)), b: 200 * (t(y) - t(z)) };
}
const hex = (h: string): [number, number, number] => {
  const m = /^#?([0-9a-f]{6})$/i.exec(h)!;
  return [parseInt(m[1]!.slice(0, 2), 16) / 255, parseInt(m[1]!.slice(2, 4), 16) / 255, parseInt(m[1]!.slice(4, 6), 16) / 255];
};
const toHex = ([r, g, b]: [number, number, number]) =>
  `#${[r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')}`;

const INTENT_COLORS: Record<string, string> = {
  danger: '#d92d20', warning: '#b54708', success: '#067647', info: '#175cd3',
  selected: '#4f39f6', current: '#5925dc', invalid: '#d92d20',
};

test.describe('color vision', () => {
  test('every intent pair >= dE2000 10 under all three CVDs or has a cue', async ({ page, baseURL }, testInfo) => {
    const fixture = await matFixture(listSubjects, STORY);
    await page.goto(`${baseURL ?? ''}/iframe.html?id=${fixture.id}&viewMode=story`);
    await page.waitForSelector('[data-ag-part="intent-cell"]');
    const cues = await page.evaluate(() => {
      const out: Record<string, boolean> = {};
      document.querySelectorAll('[data-ag-part="intent-cell"]').forEach((cell) => {
        const intent = cell.getAttribute('data-ag-intent') ?? '';
        const icon = cell.querySelector('[data-ag-part="intent-icon"]');
        const named = !!(icon?.getAttribute('aria-label') || (icon?.textContent ?? '').trim());
        const text = (cell.textContent ?? '').trim().length > 0;
        out[intent] = named || text;
      });
      return out;
    });
    const names = Object.keys(INTENT_COLORS);
    const fails: string[] = [];
    const rows: Array<{ pair: string; cvd: string; de: number; cue: boolean }> = [];
    for (const cvd of CVD) {
      const sim = names.map((n) => {
        const [r, g, b] = simulateCvd(cvd, ...hex(INTENT_COLORS[n]!));
        return { name: n, lab: srgbToLab(r, g, b), hex: toHex([r, g, b]) };
      });
      for (let i = 0; i < sim.length; i += 1) {
        for (let j = i + 1; j < sim.length; j += 1) {
          const de = deltaE2000(sim[i]!.lab, sim[j]!.lab);
          const pair = `${sim[i]!.name}/${sim[j]!.name}`;
          const cue = cues[sim[i]!.name] === true && cues[sim[j]!.name] === true;
          rows.push({ pair, cvd, de, cue });
          if (de < 10 && !cue) fails.push(`${pair} under ${cvd}: dE00=${de.toFixed(2)} <10 and no cue`);
        }
      }
    }
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync('.artifacts/mat/color-vision.json', JSON.stringify({ rows, fails }, null, 2));
    testInfo.annotations.push({ type: 'note', description: `${rows.length} pairs x ${CVD.length} CVDs` });
    expect(fails, 'intent pairs failing discrimination without a cue').toEqual([]);
  });
});
