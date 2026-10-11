/* MAT-187 / REQ-MOT-T06: one test per frozen M-01 file's story under
 * reducedMotion 'reduce' — 1 s after load every animated element must be
 * opacity 1 and scale 1. Named tests: GlassA11y, GlassPresenceIndicator,
 * GlassQuantumTunnel. Subject ids are discovered through listSubjects()
 * (never hard-coded), matching the named component OR a lab parity story. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';

test.use({ reducedMotion: 'reduce' });

/** find a subject story by component/lab name (exact then substring). */
const subjectId = async (name: string): Promise<string | null> => {
  const subs = await listSubjects();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hit =
    subs.find((s) => norm(s.subject) === norm(name) && s.id.endsWith('--primary')) ??
    subs.find((s) => norm(s.subject) === norm(name)) ??
    subs.find((s) => norm(s.id).includes(norm(name)));
  return hit?.id ?? null;
};

const expectSettledVisible = async (
  page: import('@playwright/test').Page,
  storyId: string,
): Promise<void> => {
  await gotoStory(page, storyId, { motion: 'full' });
  await page.waitForTimeout(1_000);
  const offenders = await page.evaluate(() => {
    const bad: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>('*')) {
      const cs = getComputedStyle(el);
      const op = parseFloat(cs.opacity);
      const scaleNonOne =
        cs.transform !== 'none' &&
        !/^matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)$/.test(cs.transform) &&
        !/^matrix3d\(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1\)$/.test(cs.transform.replace(/\s+/g, ''));
      // only check elements that participate in motion (animated/transitioned or part-tagged)
      const running = el.getAnimations({ subtree: false }).some((a) => a.playState === 'running');
      const isPart = el.hasAttribute('data-ag-part');
      if (!running && !isPart && cs.transitionDuration === '0s' && cs.animationName === 'none') continue;
      if (running || isPart) {
        if (op < 1 || scaleNonOne) {
          bad.push(
            `${el.tagName.toLowerCase()}${isPart ? `[data-ag-part=${el.getAttribute('data-ag-part')}]` : ''}` +
            ` opacity=${cs.opacity} transform=${cs.transform.slice(0, 48)} running=${running}`,
          );
        }
      }
    }
    return bad;
  });
  expect(offenders, 'elements must be opacity 1 / scale 1 after 1 s under reduce').toEqual([]);
};

for (const name of ['GlassA11y', 'GlassPresenceIndicator', 'GlassQuantumTunnel'] as const) {
  test(`${name}: reducedMotion reduce settles visible within 1 s`, async ({ page }) => {
    const id = await subjectId(name);
    expect(id, `subject story for ${name} (component or lab parity)`).not.toBeNull();
    await expectSettledVisible(page, id!);
  });
}

test('all 4x-parity tagged subjects settle visible under reduce', async ({ page }) => {
  const subs = await listSubjects({ tags: ['4x-parity'] });
  expect(subs.length, '4x-parity subjects present').toBeGreaterThan(0);
  for (const s of subs) await expectSettledVisible(page, s.id);
});
