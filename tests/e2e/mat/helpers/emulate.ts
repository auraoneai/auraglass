/* MAT-282: CDP emulation helpers. Reduced transparency is a real media feature
 *  (prefers-reduced-transparency) that only Chromium's Emulation.setEmulatedMedia
 *  can drive; on WebKit/Gecko there is no channel, which callers must report
 *  as 'switch unavailable' rather than fake. prefers-contrast and forced-colors
 *  use page.emulateMedia on every engine (REQ-MAT-65, D.3-39). */
import type { Page } from '@playwright/test';

export async function emulateReducedTransparency(page: Page): Promise<void> {
  const session = await page.context().newCDPSession(page).catch(() => null);
  if (!session) throw new Error('reduced-transparency emulation requires Chromium (CDP)');
  await session.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
  });
}

/** prefers-contrast: more through Playwright's cross-engine media emulation
 *  (Chromium, WebKit and Firefox in @playwright/test 1.63). */
export async function emulateContrastMore(page: Page): Promise<void> {
  await page.emulateMedia({ contrast: 'more' });
}

/** forced-colors: active through Playwright's cross-engine media emulation. */
export async function emulateForcedColors(page: Page): Promise<void> {
  await page.emulateMedia({ forcedColors: 'active' });
}

/** Fail closed when the engine did not honour an emulated media feature: a
 *  cell whose mode was not applied is a failure, never a silent pass. */
export async function assertMedia(page: Page, query: string): Promise<void> {
  const ok = await page.evaluate((q) => window.matchMedia(q).matches, query);
  if (!ok) throw new Error(`media emulation not applied on this engine: ${query}`);
}
