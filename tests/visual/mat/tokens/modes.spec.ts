// MAT-079 remote modes lane (QA L6 Environment visual; Chromium/WebKit/Gecko).
// Runs on the remote runner — fixtures are plain HTML pages served with the
// packed CSS. Cases per row contract:
//  - 'zero-js matches attribute baseline under <pref>' for colorScheme
//    light/dark, contrast more, reducedTransparency reduce (N/A where the
//    engine can't emulate it — reported, not skipped), forcedColors active,
//    reducedMotion reduce — <= 0.1% changed pixels (SC-09);
//  - computed --ag-color-on-surface differs light vs dark;
//  - forced-colors beats data-ag-transparency=glass (backdropFilter 'none' on
//    every [data-ag-surface]);
//  - createGlassTheme system follows media (AuraGlassScript block present).
import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';

const FIXTURES = {
  zeroJs: '/tests/visual/tokens/fixtures/zero-js.html',
  attr: '/tests/visual/tokens/fixtures/attr.html',
};

type Pref = {
  name: string;
  media?: Parameters<Page['emulateMedia']>[0];
  /** CDP fallback for prefs Playwright can't emulate (Chromium-only). */
  cdpFeatures?: Array<{ name: string; value: string }>;
};

const PREFS: Pref[] = [
  { name: 'colorScheme light', media: { colorScheme: 'light' } },
  { name: 'colorScheme dark', media: { colorScheme: 'dark' } },
  { name: 'contrast more', media: { contrast: 'more' } },
  { name: 'forcedColors active', media: { forcedColors: 'active' } },
  { name: 'reducedMotion reduce', media: { reducedMotion: 'reduce' } },
  {
    name: 'reducedTransparency reduce',
    cdpFeatures: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
  },
];

/** Decode a PNG screenshot inside the page (no pngjs dep): ImageData pixels. */
const decodePng = (page: Page, buf: Buffer) =>
  page.evaluate(async (b64) => {
    const img = await createImageBitmap(
      await (await fetch(`data:image/png;base64,${b64}`)).blob(),
    );
    const canvas = Object.assign(document.createElement('canvas'), {
      width: img.width, height: img.height,
    });
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, img.width, img.height);
    return { width: img.width, height: img.height, data: Array.from(d.data) };
  }, buf.toString('base64'));

/** SC-09: fraction of changed pixels between two screenshot buffers. */
const changedRatio = async (page: Page, a: Buffer, b: Buffer): Promise<number> => {
  const [pa, pb] = await Promise.all([decodePng(page, a), decodePng(page, b)]);
  const w = Math.min(pa.width, pb.width);
  const h = Math.min(pa.height, pb.height);
  const changed = pixelmatch(
    new Uint8ClampedArray(pa.data), new Uint8ClampedArray(pb.data), null,
    w, h, { threshold: 0.1, includeAA: false },
  );
  return changed / (w * h);
};

const applyPref = async (page: Page, pref: Pref): Promise<boolean> => {
  if (pref.media) { await page.emulateMedia(pref.media); return true; }
  if (pref.cdpFeatures) {
    try {
      const session = await page.context().newCDPSession(page);
      await session.send('Emulation.setEmulatedMedia', { features: pref.cdpFeatures });
      return true;
    } catch {
      return false; // engine can't emulate this pref — reported N/A
    }
  }
  return false;
};

test.describe('token modes (MAT-079)', () => {
  for (const pref of PREFS) {
    test(`zero-js matches attribute baseline under ${pref.name}`, async ({ page, browserName }) => {
      const applied = await applyPref(page, pref);
      if (!applied) {
        console.log(`[${browserName}] ${pref.name}: N/A (engine cannot emulate)`);
        return; // reported, not skipped
      }
      await page.goto(FIXTURES.attr);
      const attrShot = await page.screenshot({ fullPage: true });
      await page.goto(FIXTURES.zeroJs);
      const zeroShot = await page.screenshot({ fullPage: true });
      const ratio = await changedRatio(page, attrShot, zeroShot);
      console.log(`[${browserName}] ${pref.name}: ${(ratio * 100).toFixed(4)}% changed pixels`);
      // attach both captures for the per-engine artifact review
      await test.info().attach(`attr-${browserName}.png`, { body: attrShot, contentType: 'image/png' });
      await test.info().attach(`zerojs-${browserName}.png`, { body: zeroShot, contentType: 'image/png' });
      expect(ratio).toBeLessThanOrEqual(0.001);
    });
  }

  test('computed --ag-color-on-surface differs light vs dark', async ({ page }) => {
    await page.goto(FIXTURES.attr);
    const read = () =>
      page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ag-color-on-surface').trim());
    await page.emulateMedia({ colorScheme: 'light' });
    const light = await read();
    await page.emulateMedia({ colorScheme: 'dark' });
    const dark = await read();
    console.log(`on-surface light=${light} dark=${dark}`);
    expect(light).not.toBe(dark);
    expect(light.length).toBeGreaterThan(0);
    expect(dark.length).toBeGreaterThan(0);
  });

  test('forced-colors beats data-ag-transparency=glass', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(FIXTURES.attr);
    const values = await page.evaluate(() =>
      [...document.querySelectorAll('[data-ag-surface]')].map(
        (el) => getComputedStyle(el).backdropFilter,
      ),
    );
    for (const v of values) expect(v).toBe('none');
  });

  test('createGlassTheme system follows media (script present)', async ({ page }) => {
    await page.goto(FIXTURES.attr);
    await page.emulateMedia({ colorScheme: 'dark' });
    const dark = await page.evaluate(() => document.documentElement.dataset.agScheme);
    await page.emulateMedia({ colorScheme: 'light' });
    const light = await page.evaluate(() => document.documentElement.dataset.agScheme);
    expect({ dark, light }).toEqual({ dark: 'dark', light: 'light' });
  });
});
