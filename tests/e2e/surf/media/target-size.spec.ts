// target-size.spec.ts — REQ-SURF-138: MediaControls buttons are ≥32×32 at a
// fine pointer and ≥44×44 at a coarse pointer; the scrubber hit area is
// ≥44 px tall at a coarse pointer (REQ-SURF-136).
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const BUTTONS = ['media-play', 'media-mute', 'media-rate', 'media-captions', 'media-pip', 'media-fullscreen', 'media-more'];

async function storyId() {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'MediaControls' && s.id.endsWith('--responsive'));
  expect(subject, 'MediaControls Responsive story registered in the subject index').toBeTruthy();
  return subject!.id;
}

async function measure(page: Page) {
  return page.evaluate((parts) => {
    const out: { part: string; w: number; h: number }[] = [];
    for (const p of parts) {
      for (const el of document.querySelectorAll<HTMLElement>(`[data-ag-part="${p}"]`)) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) out.push({ part: p, w: r.width, h: r.height });
      }
    }
    const scrub = document.querySelector<HTMLElement>('[data-ag-part="media-scrubber"]')!.getBoundingClientRect();
    return { buttons: out, scrubberHeight: scrub.height };
  }, BUTTONS);
}

test.describe('media target sizes (REQ-SURF-138)', () => {
  test('fine pointer: every media button ≥32×32', async ({ browser }) => {
    const id = await storyId();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await gotoStory(page, id);
    expect(await page.evaluate(() => matchMedia('(pointer: fine)').matches)).toBe(true);
    const { buttons } = await measure(page);
    expect(buttons.map((b) => b.part).sort()).toEqual(['media-captions', 'media-fullscreen', 'media-pip', 'media-play', 'media-rate']);
    for (const b of buttons) {
      expect(b.w, `${b.part} width`).toBeGreaterThanOrEqual(32);
      expect(b.h, `${b.part} height`).toBeGreaterThanOrEqual(32);
    }
    await context.close();
  });

  test('coarse pointer: every media button ≥44×44, scrubber ≥44 px tall', async ({ browser, browserName }) => {
    const id = await storyId();
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      ...(browserName === 'firefox' ? {} : { isMobile: true }),
    });
    const page = await context.newPage();
    await gotoStory(page, id);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), 'context emulates a coarse pointer').toBe(true);
    const { buttons, scrubberHeight } = await measure(page);
    expect(buttons.length).toBeGreaterThanOrEqual(4); // compact row: play, mute, captions, fullscreen, more
    for (const b of buttons) {
      expect(b.w, `${b.part} width`).toBeGreaterThanOrEqual(44);
      expect(b.h, `${b.part} height`).toBeGreaterThanOrEqual(44);
    }
    expect(scrubberHeight).toBeGreaterThanOrEqual(44);
    await context.close();
  });
});
