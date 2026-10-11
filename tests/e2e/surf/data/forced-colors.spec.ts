// forced-colors.spec.ts — REQ-SURF-91: under forced-colors: active every
// Sparkline mark paints in the CanvasText system colour (line/area/bar/dot),
// never the intent palette. Remote L5 lane only (fragments/lanes/surf.ts
// tests/e2e/surf/{data,date,charts}); fails closed when the stories are absent.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const STORIES = [
  { suffix: '--line', marks: ['.ag-sparkline__line', '.ag-sparkline__dot'] },
  { suffix: '--area', marks: ['.ag-sparkline__line', '.ag-sparkline__area'] },
  { suffix: '--bar', marks: ['.ag-sparkline__bar'] },
] as const;

test.describe('Sparkline forced colors (REQ-SURF-91)', () => {
  for (const { suffix, marks } of STORIES) {
    test(`story ${suffix}: marks use CanvasText`, async ({ page }) => {
      const subjects = await listSubjects({ owner: 'SURF' });
      const story = subjects.find((s) => s.subject === 'Sparkline' && s.id.endsWith(suffix));
      expect(story, `Sparkline story ${suffix} must be registered in the subject index`).toBeTruthy();
      await page.emulateMedia({ forcedColors: 'active' });
      await gotoStory(page, story!.id);
      await expect(page.locator('svg.ag-sparkline').first()).toBeVisible();
      const res = await page.evaluate((selectors) => {
        // Resolve the system colour the engine uses for CanvasText.
        const probe = document.createElement('span');
        probe.style.color = 'CanvasText';
        document.body.appendChild(probe);
        const canvasText = getComputedStyle(probe).color;
        probe.remove();
        const out: Array<{ sel: string; count: number; stroke: string[]; fill: string[] }> = [];
        for (const sel of selectors) {
          const els = [...document.querySelectorAll(sel)];
          out.push({
            sel,
            count: els.length,
            stroke: els.map((e) => getComputedStyle(e).stroke),
            fill: els.map((e) => getComputedStyle(e).fill),
          });
        }
        return { canvasText, out };
      }, [...marks]);
      for (const m of res.out) {
        expect(m.count, `${m.sel} rendered`).toBeGreaterThan(0);
        if (m.sel === '.ag-sparkline__line') {
          for (const s of m.stroke) expect(s).toBe(res.canvasText);
          for (const f of m.fill) expect(f).toBe('none');
        } else if (m.sel === '.ag-sparkline__area') {
          for (const f of m.fill) expect(f).toBe(res.canvasText);
        } else {
          for (const s of m.stroke) expect(s).toBe(res.canvasText);
          for (const f of m.fill) expect(f).toBe(res.canvasText);
        }
      }
    });
  }
});
