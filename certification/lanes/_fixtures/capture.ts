/* Shared page helpers for capture lanes that render one story in cert mode (L7 regression; same behaviour as the L6
   driver in environment-visual.spec.ts): settle, real-input state driving from parameters.ag.states[].drive, and the
   element-cropped subject target. */
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const STORY_CONTENT = '[data-ag-story-content]';
const PORTAL_CONTENT = '[data-ag-portal-root] > *, [data-ag-layer-root] > *';
const PART_RE = /^[a-z][a-z0-9-]*$/;

export async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
    // finite animations only: an infinite one is the motion lane's failure, not a reason to hang the capture
    await Promise.all(document.getAnimations()
      .filter((a) => Number.isFinite(Number(a.effect?.getComputedTiming().endTime)))
      .map((a) => a.finished.catch(() => undefined)));
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  });
}

export interface DriveStep { action: 'hover' | 'focus' | 'press' | 'open' | 'type'; target: string; text?: string }

export async function driveState(page: Page, storyId: string, state: string, drive: readonly DriveStep[] | undefined): Promise<void> {
  for (const step of drive ?? []) {
    if (!PART_RE.test(step.target)) throw new Error(`${storyId} state '${state}': drive target '${step.target}' is not a data-ag-part name`);
    const target = page.locator(`${STORY_CONTENT} [data-ag-part="${step.target}"], [data-ag-portal-root] [data-ag-part="${step.target}"]`).first();
    await expect(target, `drive target [data-ag-part="${step.target}"] of ${storyId}`).toBeVisible();
    switch (step.action) {
      case 'hover': await target.hover(); break;
      case 'focus':
        await page.keyboard.press('Shift'); // keyboard modality, so :focus-visible matches as for a keyboard user
        await target.focus();
        break;
      case 'press': {
        const box = await target.boundingBox();
        if (!box) throw new Error(`press target [data-ag-part="${step.target}"] has no box`);
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        break;
      }
      case 'open': await target.click(); break;
      case 'type':
        if (typeof step.text !== 'string') throw new Error(`${storyId} state '${state}': 'type' needs text`);
        await target.click();
        await page.keyboard.type(step.text);
        break;
      default: throw new Error(`${storyId} state '${state}': unknown drive action '${String((step as { action: unknown }).action)}'`);
    }
  }
  await page.evaluate(({ sel, s }) => {
    const root = document.querySelector(sel);
    if (!root) throw new Error(`no ${sel}`);
    root.setAttribute('data-ag-state-cell', s);
  }, { sel: STORY_CONTENT, s: state });
}

export type SubjectTarget =
  | { kind: 'locator'; locator: Locator; areaPx2: number }
  | { kind: 'clip'; clip: { x: number; y: number; width: number; height: number }; areaPx2: number };

/** The element crop: [data-ag-story-content], or — when the subject renders portal content (an open Dialog) — the union
    of the story content and its portal layers, as a page clip. Throws when the subject has no box. */
export async function subjectTarget(page: Page): Promise<SubjectTarget> {
  const rects = await page.evaluate(({ content, portal }) => {
    const box = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
    const main = document.querySelector(content);
    return { main: main ? box(main) : null, portal: [...document.querySelectorAll(portal)].map(box).filter((r) => r.w > 0 && r.h > 0) };
  }, { content: STORY_CONTENT, portal: PORTAL_CONTENT });
  if (!rects.main || rects.main.w <= 0 || rects.main.h <= 0) throw new Error(`${STORY_CONTENT} has no box`);
  if (!rects.portal.length) return { kind: 'locator', locator: page.locator(STORY_CONTENT).first(), areaPx2: rects.main.w * rects.main.h };
  const all = [rects.main, ...rects.portal];
  const x0 = Math.max(0, Math.floor(Math.min(...all.map((r) => r.x))));
  const y0 = Math.max(0, Math.floor(Math.min(...all.map((r) => r.y))));
  const x1 = Math.ceil(Math.max(...all.map((r) => r.x + r.w)));
  const y1 = Math.ceil(Math.max(...all.map((r) => r.y + r.h)));
  return { kind: 'clip', clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }, areaPx2: (x1 - x0) * (y1 - y0) };
}

export async function captureTarget(page: Page, t: SubjectTarget): Promise<Buffer> {
  const opts = { animations: 'disabled', caret: 'hide', scale: 'device' } as const;
  return t.kind === 'locator' ? t.locator.screenshot(opts) : page.screenshot({ ...opts, clip: t.clip });
}
