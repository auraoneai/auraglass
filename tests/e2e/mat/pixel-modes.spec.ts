/* MAT-286 (REQ-MAT-56): pixel modes — the largest surface box on each story
   must pixel-differ (diffRatioInBox > 0.005) between default and
   prefers-contrast=more on 100% of stories. */
import { test, expect } from '@playwright/test';
import { listSurfaces } from './helpers/surfaces';
import { emulateContrastMore } from './helpers/emulate';
import { diffRatioInBox } from './helpers/pixels';
import fs from 'node:fs';

test.describe('pixel modes', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'prefers-contrast emulation is Chromium-only');

  test('contrast more changes pixels on the largest surface', async ({ page, baseURL }) => {
    const res = await fetch(`${baseURL}/index.json`);
    const json = (await res.json()) as { entries: Record<string, { id: string; type: string }> };
    const stories = Object.values(json.entries).filter((e) => e.type === 'story');
    const rows: Array<{ id: string; ratio: number; fail: boolean }> = [];
    for (const s of stories.slice(0, 50)) {
      await page.goto(`/iframe.html?id=${s.id}&viewMode=story`);
      const surfaces = await listSurfaces(page);
      if (!surfaces.length) continue;
      const largest = surfaces.reduce((a, b) => (a.box.width * a.box.height >= b.box.width * b.box.height ? a : b));
      const clip = {
        x: Math.max(0, largest.box.x), y: Math.max(0, largest.box.y),
        width: Math.max(1, largest.box.width), height: Math.max(1, largest.box.height),
      };
      const before = await page.screenshot({ clip });
      await emulateContrastMore(page);
      await page.waitForTimeout(150);
      const after = await page.screenshot({ clip });
      const ratio = diffRatioInBox(before, after, { x: 0, y: 0, width: clip.width, height: clip.height });
      rows.push({ id: s.id, ratio, fail: ratio <= 0.005 });
      expect(ratio, `${s.id}: contrast-more pixel diff`).toBeGreaterThan(0.005);
    }
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync('.artifacts/mat/pixel-modes.json', JSON.stringify({ rows, pass: rows.every((r) => !r.fail) }, null, 2));
    expect(rows.length, 'stories with a measurable surface').toBeGreaterThan(0);
  });
});
