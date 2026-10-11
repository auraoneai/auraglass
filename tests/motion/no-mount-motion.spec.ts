/* MAT-242 / REQ-MOT-T19,-15 / REQ-MAT-43 (D.3-25): layout primitives and
 * resting cards produce 0 running/pending document.getAnimations() entries
 * 50 ms after mount in a real browser. Subjects are discovered through
 * listSubjects() (never hard-coded story ids); a subject missing from the
 * Storybook index fails its test — an absent subject is not a pass. Each
 * measurement is published as a `motion` annotation for motion-report.json
 * (tests/motion/helpers/motion-reporter.ts). Remote only (L9). */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';

const REST_SUBJECTS = ['Stack', 'Grid', 'Container', 'Separator', 'Text', 'Heading', 'Card'] as const;
const MOUNT_WINDOW_MS = 50;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

for (const subject of REST_SUBJECTS) {
  test(`${subject}: 0 running/scheduled animations ${MOUNT_WINDOW_MS} ms after mount`, async ({ page }) => {
    const subs = await listSubjects();
    expect(subs.length, 'Storybook subject index (listSubjects) is empty').toBeGreaterThan(0);
    const hit = subs.find((s) => norm(s.subject) === norm(subject)) ??
      subs.find((s) => norm(s.subject).includes(norm(subject)));
    expect(hit, `rest-state subject ${subject} is missing from listSubjects()`).toBeDefined();
    const mode = 'full' as const;
    await gotoStory(page, hit!.id, { motion: mode });
    await page.waitForTimeout(MOUNT_WINDOW_MS);
    const running = await page.evaluate(() =>
      document.getAnimations().filter((a) => a.playState === 'running' || (a.playState as string) === 'pending')
        .map((a) => (a as { animationName?: string }).animationName ?? a.constructor.name),
    );
    test.info().annotations.push({
      type: 'motion',
      description: JSON.stringify({ id: hit!.id, mode, mountAnimations: running.length }),
    });
    expect(running, `${subject} must mount with zero motion`).toEqual([]);
  });
}
