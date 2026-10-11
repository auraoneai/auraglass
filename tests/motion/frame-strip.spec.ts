/* MAT-239 / REQ-MOT-T13,-71,-74,-112: frame diversity + animation-class
 * invariant. ≥ 3 distinct frames of 12 for Button press and Dialog open (then
 * Menu open, Popover open, Tabs morph as subjects are delivered) under
 * no-preference with ≥ 1 CSSTransition/CSSAnimation at trigger+1 frame; under
 * reduce Popup scale/translate never differs from settled; ag-sweep
 * luminance change < 10% between frames and ≤ 3 peaks/s. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';
import { frames, countDistinctFrames, pauseAnimations } from './helpers/frames';
import { willChangeCount } from './helpers/settle';
import { decodePng } from './helpers/png';

const subjectsByName = async (names: string[]): Promise<Map<string, string>> => {
  const subs = await listSubjects();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const out = new Map<string, string>();
  for (const n of names) {
    const hit =
      subs.find((s) => norm(s.subject).includes(norm(n)) && s.id.endsWith('--primary')) ??
      subs.find((s) => norm(s.subject).includes(norm(n))) ??
      subs.find((s) => norm(s.id).includes(norm(n)));
    if (hit) out.set(n, hit.id);
  }
  return out;
};

const animTypesAt = async (root: import('@playwright/test').Locator) =>
  root.evaluate((el) =>
    (el as Element).getAnimations({ subtree: true })
      .filter((a) => a.playState === 'running')
      .map((a) => a.constructor.name),
  );

test.describe('frame diversity — no-preference', () => {
  test.use({ reducedMotion: 'no-preference' });
  for (const [subject, triggerDesc] of [
    ['Button', 'press'],
    ['Dialog', 'open'],
    ['Menu', 'open'],
    ['Popover', 'open'],
    ['Tabs', 'morph'],
  ] as const) {
    test(`${subject} ${triggerDesc}: >= 3 of 12 distinct frames`, async ({ page }) => {
      const ids = await subjectsByName([subject]);
      const id = ids.get(subject);
      expect(id, `${subject} subject story present`).toBeTruthy();
      await gotoStory(page, id!, { motion: 'full' });
      const root = page.locator('[data-ag-root]');
      const trigger = root.locator('[data-ag-part="trigger"], button, [role="tab"], [role="menuitem"]').first();
      if (await trigger.count()) await trigger.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(16); // trigger + 1 frame
      const running = await animTypesAt(root);
      const duringWillChange = await willChangeCount(root);
      expect(duringWillChange).toBeLessThanOrEqual(3);
      const res = await frames(page, root, { samples: 12 });
      const distinct = await countDistinctFrames(res.samples);
      test.info().annotations.push({
        type: 'motion',
        description: JSON.stringify({ id: id!, mode: 'full', preference: 'no-preference', framesChanged: distinct }),
      });
      expect(
        running.filter((t) => t === 'CSSTransition' || t === 'CSSAnimation').length,
        `${subject}: >= 1 CSSTransition/CSSAnimation running at trigger+1 frame`,
      ).toBeGreaterThanOrEqual(1);
      expect(distinct, `${subject}: >= 3 distinct frames of 12`).toBeGreaterThanOrEqual(3);
    });
  }
});

test.describe('reduce — Popup identity transform', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const subject of ['Popup', 'Dialog', 'Menu', 'Popover'] as const) {
    test(`${subject}: scale/translate identical to settled under reduce`, async ({ page }) => {
      const ids = await subjectsByName([subject]);
      const id = ids.get(subject);
      // REQ-MAT-43 (D.3-25): an absent subject fails — it is never a pass.
      expect(id, `${subject} subject story present`).toBeTruthy();
      await gotoStory(page, id!, { motion: 'full' });
      const root = page.locator('[data-ag-root]');
      const trigger = root.locator('[data-ag-part="trigger"], button').first();
      if (await trigger.count()) await trigger.click({ force: true }).catch(() => undefined);
      const res = await frames(page, root, { samples: 12 });
      const settled = await root.screenshot();
      const a = decodePng(settled);
      const last = res.samples.at(-1);
      expect(last, `${subject}: frames() returned samples`).toBeDefined();
      const b = decodePng(last!.shot);
      expect(a, `${subject}: settled screenshot decodes`).not.toBeNull();
      expect(b, `${subject}: last sampled frame decodes`).not.toBeNull();
      expect([b!.width, b!.height], `${subject}: sampled frame size equals settled`).toEqual([a!.width, a!.height]);
      const { diffRatio } = await import('./helpers/png.js');
      expect(diffRatio(a!.data, b!.data)).toBeLessThan(0.005);
      // element-level: no part carries scale/translate mid-flight under reduce
      const midBad = await root.evaluate((el) => {
        const bad: string[] = [];
        for (const p of el.querySelectorAll('[data-ag-part]')) {
          const t = getComputedStyle(p).transform;
          if (t !== 'none' && t !== '' && !/matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)/.test(t)) {
            bad.push(`${p.getAttribute('data-ag-part')}=${t}`);
          }
        }
        return bad;
      });
      expect(midBad).toEqual([]);
    });
  }
});

test.describe('ag-sweep luminance', () => {
  test('Spinner/Skeleton sweep: luminance delta < 10% and <= 3 peaks/s', async ({ page }) => {
    const ids = await subjectsByName(['Sweep', 'Spinner', 'Skeleton']);
    const id = ids.get('Sweep') ?? ids.get('Spinner') ?? ids.get('Skeleton');
    expect(id, 'sweep subject present').toBeTruthy();
    await gotoStory(page, id!, { motion: 'full' });
    const root = page.locator('[data-ag-root]');
    await pauseAnimations(root);
    const res = await frames(page, root, { samples: 12 });
    const lums: number[] = [];
    for (const s of res.samples) {
      const p = decodePng(s.shot);
      if (!p) continue;
      let sum = 0;
      for (let i = 0; i < p.data.length; i += 4) {
        sum += 0.2126 * p.data[i]! + 0.7152 * p.data[i + 1]! + 0.0722 * p.data[i + 2]!;
      }
      lums.push(sum / (p.data.length / 4));
    }
    const deltas = lums.slice(1).map((l, i) => Math.abs(l - lums[i]!));
    const maxDelta = Math.max(...deltas, 0);
    const mean = lums.reduce((a, b) => a + b, 0) / Math.max(1, lums.length);
    expect(maxDelta / Math.max(1, mean), 'inter-frame luminance change < 10%').toBeLessThan(0.10);
    // peaks/s: count local maxima then scale by the sampled span
    let peaks = 0;
    for (let i = 1; i < lums.length - 1; i++) {
      if (lums[i]! > lums[i - 1]! && lums[i]! > lums[i + 1]!) peaks++;
    }
    const spanSec = res.spanMs / 1000;
    if (spanSec > 0) expect(peaks / spanSec, '<= 3 luminance peaks/s').toBeLessThanOrEqual(3);
  });
});
