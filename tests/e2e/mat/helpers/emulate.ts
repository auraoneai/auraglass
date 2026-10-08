/* MAT-282: CDP emulation helpers. Reduced transparency is a real media feature
 *  (prefers-reduced-transparency) that only Chromium's Emulation.setEmulatedMedia
 *  can drive; on WebKit/Gecko there is no channel, which callers must report
 *  as 'switch unavailable' rather than fake. */
import type { Page } from '@playwright/test';

export async function emulateReducedTransparency(page: Page): Promise<void> {
  const session = await page.context().newCDPSession(page).catch(() => null);
  if (!session) throw new Error('reduced-transparency emulation requires Chromium (CDP)');
  await session.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
  });
}

export async function emulateContrastMore(page: Page): Promise<void> {
  const session = await page.context().newCDPSession(page).catch(() => null);
  if (!session) throw new Error('prefers-contrast emulation requires Chromium (CDP)');
  await session.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-contrast', value: 'more' }],
  });
}

export async function emulateForcedColors(page: Page): Promise<void> {
  const session = await page.context().newCDPSession(page).catch(() => null);
  if (!session) throw new Error('forced-colors emulation requires Chromium (CDP)');
  await session.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value: 'active' }],
  });
}
