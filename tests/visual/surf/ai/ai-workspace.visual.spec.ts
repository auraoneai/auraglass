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
      if (!subject) throw new Error(`${name} subject not registered`);
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
    if (!subject) throw new Error('AI subject not registered');
    await page.setViewportSize({ width: 320, height: 568 });
    await gotoStory(page, subject.id);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 320);
    expect(overflow).toBe(false);
  });
});

// REQ-SURF-128: the Thread/Composer layout cases — 1440 desktop, 200% zoom
// (real device-pixel zoom: 1280x800 at dsf 2 = 640x400 CSS px, never
// style.zoom), a 32px root font, and rtl. Every case keeps controls operable
// (non-zero, unclipped boxes) with no horizontal page scroll.
test.describe('ai layout (REQ-SURF-128)', () => {
  const threadId = async () => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Thread') ?? subjects[0];
    if (!subject) throw new Error('AI subject not registered');
    return subject.id;
  };
  const noHOverflow = (page: import('@playwright/test').Page) =>
    page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const operableControls = (page: import('@playwright/test').Page) =>
    page.evaluate(() => [...document.querySelectorAll<HTMLElement>('button, textarea, input, [contenteditable="true"]')]
      .filter((el) => el.offsetParent !== null)
      .every((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }));

  test('1440px: no horizontal page scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(page, await threadId());
    expect(await noHOverflow(page)).toBeLessThanOrEqual(0);
    expect(await operableControls(page)).toBe(true);
  });

  test('zoom200 (640x400 @ dsf 2): no horizontal page scroll, controls operable', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
    try {
      const page = await context.newPage();
      await gotoStory(page, await threadId());
      expect(await noHOverflow(page)).toBeLessThanOrEqual(0);
      expect(await operableControls(page)).toBe(true);
    } finally {
      await context.close();
    }
  });

  test('32px root font: no horizontal page scroll, controls operable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStory(page, await threadId());
    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('32px');
    expect(await noHOverflow(page)).toBeLessThanOrEqual(0);
    expect(await operableControls(page)).toBe(true);
  });

  test('rtl: mirrors without horizontal page scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStory(page, await threadId());
    const doc = await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'rtl');
      return document.documentElement.getAttribute('dir');
    });
    expect(doc).toBe('rtl');
    expect(await noHOverflow(page)).toBeLessThanOrEqual(0);
    expect(await operableControls(page)).toBe(true);
  });
});

test.describe('ai reduced motion (SURF-357)', () => {
  test('500ms after settle: 0 running CSS animations, 0 rAF callbacks', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const aiSubjects = subjects.filter((s) => AI_SUBJECTS.includes(s.subject));
    expect(aiSubjects.length, 'no AI subjects').toBeGreaterThan(0);
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
