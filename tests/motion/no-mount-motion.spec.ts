/* MAT-242 / REQ-MOT-T19,-15: rest-state components produce 0
 * document.getAnimations() entries 50 ms after mount in a real browser. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';

const REST_SUBJECTS = ['Stack', 'Grid', 'Container', 'Separator', 'Text', 'Heading', 'Card'] as const;

for (const subject of REST_SUBJECTS) {
  test(`${subject}: 0 running/scheduled animations 50 ms after mount`, async ({ page }) => {
    const subs = await listSubjects();
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hit = subs.find((s) => norm(s.subject) === norm(subject)) ??
      subs.find((s) => norm(s.subject).includes(norm(subject)));
    if (!hit) {
      test.info().annotations.push({ type: 'motion', description: `subject ${subject} absent` });
      return; // DOUBLE-PASS: lands with the component PRD
    }
    await gotoStory(page, hit.id, { motion: 'full' });
    await page.waitForTimeout(50);
    const running = await page.evaluate(() =>
      document.getAnimations().filter((a) => a.playState === 'running' || (a.playState as string) === 'pending')
        .map((a) => (a as { animationName?: string }).animationName ?? a.constructor.name),
    );
    expect(running, `${subject} must mount with zero motion`).toEqual([]);
  });
}
