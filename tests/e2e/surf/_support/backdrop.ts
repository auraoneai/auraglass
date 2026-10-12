// tests/e2e/surf/_support/backdrop.ts — shared lookup for the Backdrop
// stories (Backdrops/Backdrop), used by tests/e2e/surf/backdrops/*.spec.ts and
// tests/e2e/surf/motion/backdrop-drift.spec.ts. A missing story
// is a failure, never a skip.
import { expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import type { AgEnvironment } from '../../../../src/contracts/testing';

export type BackdropStory =
  | 'aurora-light' | 'aurora-dark' | 'mesh' | 'grain' | 'photo' | 'video'
  | 'video-continuous' | 'drift' | 'drift-continuous' | 'aurora-continuous-static' | 'mono';

export async function openBackdrop(page: Page, story: BackdropStory, env: AgEnvironment = {}): Promise<void> {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'Backdrop' && s.id.endsWith(`--${story}`));
  expect(subject, `Backdrop ${story} story registered in the subject index`).toBeTruthy();
  await gotoStory(page, subject!.id, env);
  await expect(page.locator('.ag-backdrop')).toHaveCount(1);
}

/** Simulates a hidden / visible tab for the page's document. */
export async function setHidden(page: Page, hidden: boolean): Promise<void> {
  await page.evaluate((h) => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => h });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (h ? 'hidden' : 'visible') });
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
}
