/* MAT-286 (REQ-MAT-56, REQ-MAT-65): pixel modes — the largest surface box on
   each subject story must pixel-differ (diffRatioInBox > 0.005) between
   default and prefers-contrast=more on 100% of subjects that render a surface.
   Subjects come from listSubjects() (S-40; flagship + MAT at
   MAT_A11Y_SCOPE=pr, the whole index at full); prefers-contrast is emulated
   with page.emulateMedia on every engine. Failures name the subject's owner. */
import { test, expect } from '@playwright/test';
import { listSurfaces } from './helpers/surfaces';
import { emulateContrastMore, assertMedia } from './helpers/emulate';
import { diffRatioInBox } from './helpers/pixels';
import { listSubjects } from '../../helpers';
import { sweepSubjects, tag, byOwner, type Owner } from './helpers/subjects';
import fs from 'node:fs';

test.describe('pixel modes', () => {
  test('contrast more changes pixels on the largest surface', async ({ page, browserName }) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await sweepSubjects(listSubjects);
    const rows: Array<{ id: string; subject: string; owner: Owner; engine: string; ratio: number; fail: boolean }> = [];
    const fails: Array<{ owner: Owner; msg: string }> = [];
    for (const s of subjects) {
      await page.emulateMedia({ contrast: 'no-preference' });
      await page.goto(`/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
      const surfaces = (await listSurfaces(page)).filter((x) => x.box.width > 0 && x.box.height > 0);
      if (!surfaces.length) continue; // subject renders no material surface: nothing to compare
      const largest = surfaces.reduce((a, b) => (a.box.width * a.box.height >= b.box.width * b.box.height ? a : b));
      const clip = {
        x: Math.max(0, largest.box.x), y: Math.max(0, largest.box.y),
        width: Math.max(1, largest.box.width), height: Math.max(1, largest.box.height),
      };
      const before = await page.screenshot({ clip });
      await emulateContrastMore(page);
      await assertMedia(page, '(prefers-contrast: more)');
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const after = await page.screenshot({ clip });
      const ratio = diffRatioInBox(before, after, { x: 0, y: 0, width: clip.width, height: clip.height });
      const fail = ratio <= 0.005;
      rows.push({ id: s.id, subject: s.subject, owner: s.owner, engine: browserName, ratio, fail });
      if (fail) fails.push({ owner: s.owner, msg: `${tag(s)} contrast-more pixel diff ${ratio.toFixed(4)} <= 0.005` });
    }
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/pixel-modes-${browserName}.json`, JSON.stringify({ rows, pass: fails.length === 0, byOwner: byOwner(fails) }, null, 2));
    expect(rows.length, 'subjects with a measurable surface').toBeGreaterThan(0);
    expect(fails.map((f) => f.msg), 'subjects whose surface does not change under contrast more').toEqual([]);
  });
});
