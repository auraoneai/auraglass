/* MAT-238 / REQ-MOT-T05,-23,-72,-17,-129: settled-state invariant for every
 * motion subject story × engine × 2 viewports × {no-preference, reduce} ×
 * data-ag-motion {full, calm, none}. will-change on 0 elements at steady
 * state (during-animation budget <= 3 is asserted by frame-strip.spec.ts). */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';
import { settle, willChangeCount } from './helpers/settle';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;
const MOTION_MODES = ['full', 'calm', 'none'] as const;

test.describe.configure({ mode: 'parallel' });

for (const vp of VIEWPORTS) {
  for (const pref of ['no-preference', 'reduce'] as const) {
    test.describe(`${vp.name} × ${pref}`, () => {
      test.use({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: pref,
      });
      for (const mode of MOTION_MODES) {
        test(`settled invariant — motion=${mode}`, async ({ page }) => {
          const subjects = (await listSubjects({ tags: ['mat:motion'] })).map((s) => s.id);
          expect(subjects.length, 'motion subjects present').toBeGreaterThan(0);
          for (const id of subjects) {
            await gotoStory(page, id, { motion: mode });
            const root = page.locator('[data-ag-root]');
            const trigger = root.locator('[data-ag-part="trigger"], button, [role="tab"]').first();
            if (await trigger.count()) await trigger.click().catch(() => undefined);
            const res = await settle(root, { waitMs: 400 });
            expect(
              res.pass,
              `${id} @${vp.name}/${pref}/${mode}: running=${res.runningAnimations} ` +
              `names=[${res.runningNames}] faded=[${res.fadedParts}] transformed=[${res.transformedParts}] ` +
              `willChange=[${res.willChangeParts}] collapsed=[${res.collapsedParts}]`,
            ).toBe(true);
            await expect(willChangeCount(root)).resolves.toBe(0);
          }
        });
      }
    });
  }
}
