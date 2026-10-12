/* MAT-299 (REQ-MAT-58, REQ-MAT-61): focus appearance — for every focusable
   part reached by Tab on every story under test, in each of the 8 scenes:
   inside box+4px, the pixels that change between the unfocused and focused
   renders (2 rAFs) at >= 3:1 focused-vs-unfocused contrast cover >= a 2 CSS px
   perimeter of the part. Both are computed from rendered pixels, never from
   computed colours. Emits
   focus-appearance-<engine>.json. REQ-MAT-65: stories come from
   listSubjects() (S-40; flagship + MAT at MAT_A11Y_SCOPE=pr, the whole index at
   full) and every failing part is attributed to the subject's owner. */
import { test, expect } from '@playwright/test';
import { changedPixelRatios } from './helpers/pixels';
import { gotoStory, listSubjects } from '../../helpers';
import { SCENES, type SceneId } from '../../../src/contracts/testing';
import { sweepSubjects, tag, byOwner, type Owner } from './helpers/subjects';
import fs from 'node:fs';

const PAD = 4;

interface Row { story: string; subject: string; owner: Owner; part: string; scene: SceneId; engine: string; area: number; required: number; worstRatio: number; fail: boolean }

/* REQ-MAT-61 / WCAG 2.4.13 on rendered pixels: the indicator must cover at
   least the area of a 2 CSS px perimeter of the part, and every pixel of that
   area must change by >= 3:1 between the unfocused and focused renders.
   `ratios` are the changed pixels' focused-vs-unfocused contrast ratios
   (high → low, device pixels): the best `required` of them form the
   indicator, and the weakest pixel inside it is the worst ratio. */
function grade(ratios: number[], required: number): { area: number; worstRatio: number } {
  const area = ratios.filter((r) => r >= 3).length;
  const worstRatio = ratios.length >= required ? ratios[required - 1]! : 1;
  return { area, worstRatio };
}

test.describe('focus appearance', () => {
  test('every subject x 8 scenes: indicator area >= 2px perimeter at >= 3:1 changed-pixel contrast', async ({ page, browserName }) => {
    test.setTimeout(8 * 45 * 60 * 1000);
    const subjects = await sweepSubjects(listSubjects);
    const rows: Row[] = [];
    for (const scene of SCENES) {
      for (const s of subjects) {
        await gotoStory(page, s.id, { scene });
        // walk the tab order (cap 40 parts)
        for (let i = 0; i < 40; i += 1) {
          await page.keyboard.press('Tab');
          const part = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null;
            return el && el !== document.body ? el.getAttribute('data-ag-part') ?? (el.hasAttribute('data-ag-focusable') ? 'focusable' : null) : null;
          });
          if (part === null) continue;
          const handle = await page.evaluateHandle(() => document.activeElement);
          const el = handle.asElement();
          if (!el) break;
          const box = await el.boundingBox();
          if (!box || box.width === 0 || box.height === 0) continue;
          const clip = {
            x: Math.max(0, box.x - PAD), y: Math.max(0, box.y - PAD),
            width: box.width + 2 * PAD, height: box.height + 2 * PAD,
          };
          // unfocused render: drop focus, wait two frames (the ring is never animated)
          await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          const unfocused = await page.screenshot({ clip });
          await el.focus();
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          const focused = await page.screenshot({ clip });
          const dpr = await page.evaluate(() => window.devicePixelRatio);
          // 2 CSS px x the part's perimeter, in device pixels
          const required = Math.ceil(2 * (2 * box.width + 2 * box.height) * dpr * dpr);
          const { area, worstRatio } = grade(changedPixelRatios(unfocused, focused), required);
          rows.push({
            story: s.id, subject: s.subject, owner: s.owner, part, scene, engine: browserName,
            area, required, worstRatio, fail: area < required || worstRatio < 3,
          });
        }
      }
    }
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    const fails = rows.filter((r) => r.fail);
    fs.writeFileSync(`.artifacts/mat/focus-appearance-${browserName}.json`, JSON.stringify({
      rows, byOwner: byOwner(fails.map((f) => ({ owner: f.owner, msg: `${tag({ owner: f.owner, subject: f.subject, id: f.story })} ${f.part}` }))),
    }, null, 2));
    expect(rows.length, 'at least one focusable part measured').toBeGreaterThan(0);
    expect(new Set(rows.map((r) => r.scene)).size, 'all 8 scenes measured').toBe(SCENES.length);
    expect(fails.map((f) => `${tag({ owner: f.owner, subject: f.subject, id: f.story })} scene=${f.scene} part=${f.part} area=${f.area.toFixed(0)}/${f.required.toFixed(0)} ratio=${f.worstRatio.toFixed(2)}`),
      'focus indicators below the appearance minimum').toEqual([]);
  });
});
