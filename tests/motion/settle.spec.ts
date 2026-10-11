/* MAT-238 / REQ-MAT-44 (REQ-MOT-T05,-23,-72,-17,-129): settled-state invariant
 * for every motion subject story × data-ag-motion {full, calm, none}.
 *
 * The engine × width × OS-preference matrix comes from the Playwright project:
 * the twelve mat:motion-{chromium,webkit,firefox}-{desktop,mobile}[-reduce]
 * projects in fragments/playwright/mat.json (3 engines × {1440, 390} ×
 * {no-preference, reduce}); ci/mat.gitlab-ci.yml mat:test:motion-settle runs
 * this spec on exactly those projects, remote only.
 *
 * A state change is the story mount and every trigger activation. After each
 * one, at --ag-duration-large + 100 ms (read from the token source), every
 * visible part must be settled: opacity >= 0.99, scale ∈ {none, 1},
 * translate ∈ {none, 0px}, visibility != hidden, non-zero box, no running
 * animation and will-change on 0 elements (during-animation budget <= 3 is
 * asserted by frame-strip.spec.ts). */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';
import { settle, settleWaitMs, willChangeCount, type SettleResult } from './helpers/settle';

const MOTION_MODES = ['full', 'calm', 'none'] as const;
const TRIGGERS = '[data-ag-part="trigger"], button, [role="tab"]';

const describe = (r: SettleResult): string =>
  `running=${r.runningAnimations} names=[${r.runningNames}] faded=[${r.fadedParts}] ` +
  `transformed=[${r.transformedParts}] scaled=[${r.scaledParts}] translated=[${r.translatedParts}] ` +
  `hidden=[${r.hiddenParts}] willChange=[${r.willChangeParts}] collapsed=[${r.collapsedParts}]`;

test.describe.configure({ mode: 'parallel' });

for (const mode of MOTION_MODES) {
  test(`settled invariant — motion=${mode}`, async ({ page }, info) => {
    const waitMs = settleWaitMs();
    const subjects = (await listSubjects({ tags: ['mat:motion'] })).map((s) => s.id);
    expect(subjects.length, 'motion subjects present').toBeGreaterThan(0);
    const cell = `${info.project.name}/${mode}`;
    for (const id of subjects) {
      await gotoStory(page, id, { motion: mode });
      const root = page.locator('[data-ag-root]');

      const mounted = await settle(root, { waitMs });
      expect(mounted.pass, `${id} @${cell} after mount: ${describe(mounted)}`).toBe(true);
      await expect(willChangeCount(root)).resolves.toBe(0);

      const triggers = await root.locator(TRIGGERS).all();
      for (const [i, trigger] of triggers.entries()) {
        await trigger.click();
        const after = await settle(root, { waitMs });
        expect(after.pass, `${id} @${cell} after trigger #${i}: ${describe(after)}`).toBe(true);
        await expect(willChangeCount(root)).resolves.toBe(0);
      }
    }
  });
}
