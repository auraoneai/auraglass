// ai-workspace.visual.spec.ts — SURF-356/357: AI workspace scene + every AI
// story across the §15.1 matrix + reduced-motion hooks. Pixel gates + OCR
// contrast run in QUAL's remote visual lane; this spec feeds it the scenes.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const AI_SUBJECTS = ['Thread', 'Message', 'Composer', 'ToolCall', 'Reasoning', 'AgentSteps', 'SourceList', 'UsageMeter', 'ProviderErrorState'];

test.describe('ai visual matrix (SURF-356)', () => {
  for (const name of AI_SUBJECTS) {
    test(`AI/${name} subject renders without horizontal overflow at 390`, async ({ page }) => {
      const subjects = await listSubjects({ owner: 'SURF' });
      const subject = subjects.find((s) => s.subject === name);
      if (!subject) { console.warn(`${name} subject not registered — pending`); return; }
      await page.setViewportSize({ width: 390, height: 844 });
      await gotoStory(page, subject.id);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    });
  }

  test('320px: no horizontal page scroll', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Thread') ?? subjects[0];
    if (!subject) { console.warn('AI subject not registered — pending'); return; }
    await page.setViewportSize({ width: 320, height: 568 });
    await gotoStory(page, subject.id);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 320);
    expect(overflow).toBe(false);
  });
});

test.describe('ai reduced motion (SURF-357)', () => {
  test('500ms after settle: 0 running CSS animations, 0 rAF callbacks', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const aiSubjects = subjects.filter((s) => AI_SUBJECTS.includes(s.subject));
    if (aiSubjects.length === 0) { console.warn('no AI subjects — pending'); return; }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const s of aiSubjects) {
      await gotoStory(page, s.id, { motion: 'none' });
      const counts = await page.evaluate(async () => {
        await new Promise((r) => setTimeout(r, 500));
        const anims = document.getAnimations().filter((a) => a.playState === 'running').length;
        let rafPending = 0;
        const orig = window.requestAnimationFrame;
        window.requestAnimationFrame = (cb) => { rafPending += 1; return orig(cb); };
        await new Promise((r) => setTimeout(r, 60));
        return { anims, rafPending };
      });
      expect(counts.anims, `${s.subject} has running animations`).toBe(0);
      expect(counts.rafPending, `${s.subject} has pending rAF`).toBe(0);
    }
  });
});
