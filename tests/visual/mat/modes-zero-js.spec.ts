/* REQ-MAT-12 zero-JS mode parity (FIN D.3-09, REQ-FIN-51, AC-FIN-51).
 *
 * Remote only (GitLab L6 visual lane, chromium/webkit/firefox projects of the
 * root playwright.config.ts) — never run on a developer machine.
 *
 * For each of the six modes (light, dark, contrast more, reduced transparency,
 * forced colours, reduced motion) the same DOM is rendered twice:
 *   - zero-JS:   no data-ag-* attribute anywhere on <html>, the OS preference
 *                is emulated, no script runs;
 *   - attribute: the OS preference is NOT emulated (forced colours excepted:
 *                the system palette has no attribute form) and <html> carries
 *                exactly the data-ag-* values the pre-paint path stamps for
 *                that preference — computed with the real resolver
 *                (src/theme/preferences/resolve.ts resolvePaint).
 * The two captures must differ by <= VISUAL_TOLERANCE.changedRatio of pixels.
 *
 * Stylesheets are the MAT outputs exactly as shipped: dist/css/tokens.css
 * (npm run tokens:build) plus every row of fragments/css/mat.ts in bundle
 * order, served from the checkout through page.route (no dev server).
 *
 * Every case first proves its preference took effect (matchMedia on the
 * zero-JS page, plus a rendering/computed-style probe), so a missing emulation
 * channel fails the case instead of passing vacuously. Per-case evidence is
 * written to .artifacts/mat/<CI_JOB_NAME_SLUG>/modes-zero-js/<engine>-<mode>.json.
 * Baselines: none — the comparison is attribute vs zero-JS within one run.
 */
import { test, expect, type Browser, type BrowserContextOptions, type BrowserType, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { mkdirSync, readFileSync, writeFileSync, existsSync, realpathSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import cssFragments from '../../../fragments/css/mat';
import { resolvePaint } from '../../../src/theme/preferences/resolve';
import type { OsSignals } from '../../../src/theme/preferences/types';
import { materialProps } from '../../../src/material/materialProps';
import { VISUAL_TOLERANCE } from '../../../src/contracts/testing';

const ROOT = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..'));
const ORIGIN = 'http://ag-modes.test';
const VIEWPORT = { width: 1024, height: 720 };
const EVIDENCE_DIR = join(
  ROOT,
  process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts',
  'mat',
  process.env.CI_JOB_NAME_SLUG ?? 'modes-zero-js',
  'modes-zero-js',
);

/* ------------------------------------------------------------------ CSS -- */

const BUNDLE_ORDER = ['material.css', 'styles.css'];
const STYLESHEETS = [
  'dist/css/tokens.css',
  ...[...cssFragments]
    .sort((a, b) => BUNDLE_ORDER.indexOf(a.bundle) - BUNDLE_ORDER.indexOf(b.bundle) || a.order - b.order)
    .map((row) => row.file),
];

const MIME: Record<string, string> = { '.css': 'text/css', '.avif': 'image/avif', '.png': 'image/png', '.svg': 'image/svg+xml' };

/* ------------------------------------------------------------- fixture -- */

const SURFACES: Array<{ label: string; role: Parameters<typeof materialProps>[0] }> = [
  { label: 'chrome regular', role: { layer: 'chrome' } },
  { label: 'chrome thin clear', role: { layer: 'chrome', variant: 'clear', thickness: 'thin' } },
  { label: 'overlay thick', role: { layer: 'overlay', thickness: 'thick' } },
  { label: 'content raised', role: {} },
  { label: 'content sunken', role: { content: 'content-sunken' } },
  { label: 'interactive', role: { layer: 'chrome', interactive: true } },
];

const attrs = (o: Record<string, string>) =>
  Object.entries(o)
    .map(([k, v]) => (v === '' ? k : `${k}="${v.replace(/"/g, '&quot;')}"`))
    .join(' ');

const fixtureHtml = (htmlAttrs: Record<string, string>) => `<!doctype html>
<html lang="en" ${attrs(htmlAttrs)}>
<head>
<meta charset="utf-8">
<title>REQ-MAT-12 zero-JS parity</title>
${STYLESHEETS.map((href) => `<link rel="stylesheet" href="${ORIGIN}/${href}">`).join('\n')}
<style>
  body { margin: 0; font-family: var(--ag-font-sans); background: var(--ag-color-canvas); color: var(--ag-color-on-surface); }
  .scene { position: relative; padding: 24px; min-block-size: 640px;
    background:
      repeating-linear-gradient(45deg, oklch(0.62 0.2 25) 0 18px, oklch(0.7 0.16 145) 18px 36px, oklch(0.55 0.2 265) 36px 54px); }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .ag-surface { padding: 20px; min-block-size: 120px; border-radius: var(--ag-radius-lg); }
  .muted { color: var(--ag-color-on-surface-muted); }
  button { font: inherit; padding: 8px 14px; border-radius: var(--ag-radius-md);
    background: var(--ag-color-accent); color: var(--ag-color-on-accent); border: 1px solid var(--ag-color-border); }
</style>
</head>
<body>
<main class="scene">
  <div class="grid">
    ${SURFACES.map(
      (s) => `<div class="ag-surface" ${attrs(materialProps(s.role) as unknown as Record<string, string>)}>
      <strong>${s.label}</strong><p class="muted">Muted body copy over glass.</p><button type="button">Action</button>
    </div>`,
    ).join('\n    ')}
  </div>
</main>
</body>
</html>`;

/* --------------------------------------------------------------- modes -- */

const NO_OS: OsSignals = {
  forcedColors: false, contrastMore: false, reducedTransparency: false,
  reducedMotion: false, schemeDark: false, coarsePointer: false,
};

/** Context media that neutralises every OS preference (the attribute page's environment). */
const NEUTRAL_MEDIA: BrowserContextOptions = {
  colorScheme: 'light', reducedMotion: 'no-preference', forcedColors: 'none', contrast: 'no-preference',
};

type Mode = {
  id: string;
  os: Partial<OsSignals>;
  /** media query that must match on the zero-JS page once the preference is emulated */
  query: string;
  /** context options that emulate the preference (reduced transparency has no option: see openZeroJs) */
  media: BrowserContextOptions;
  /** forced colours cannot be expressed as an attribute: emulate it on both pages */
  emulateOnBaseline?: boolean;
  /** does `query` match in the attribute baseline's environment (neutral media, or forced colours) */
  baselineMatches: boolean;
  /**
   * How the case proves the preference changed rendering (so parity is never vacuous):
   *   'baseline' — light IS the no-preference render; proves tokens resolved instead;
   *   'pixels'   — the zero-JS capture differs from the no-preference capture;
   *   'motion'   — static frames are identical by design; springs resolve to the standard ease.
   */
  effect: 'baseline' | 'pixels' | 'motion';
};

const MODES: Mode[] = [
  { id: 'light', os: {}, query: '(prefers-color-scheme: light)', media: { colorScheme: 'light' }, baselineMatches: true, effect: 'baseline' },
  { id: 'dark', os: { schemeDark: true }, query: '(prefers-color-scheme: dark)', media: { colorScheme: 'dark' }, baselineMatches: false, effect: 'pixels' },
  { id: 'contrast-more', os: { contrastMore: true }, query: '(prefers-contrast: more)', media: { contrast: 'more' }, baselineMatches: false, effect: 'pixels' },
  { id: 'reduced-transparency', os: { reducedTransparency: true }, query: '(prefers-reduced-transparency: reduce)', media: {}, baselineMatches: false, effect: 'pixels' },
  { id: 'forced-colors', os: { forcedColors: true }, query: '(forced-colors: active)', media: { forcedColors: 'active' }, emulateOnBaseline: true, baselineMatches: true, effect: 'pixels' },
  { id: 'reduced-motion', os: { reducedMotion: true }, query: '(prefers-reduced-motion: reduce)', media: { reducedMotion: 'reduce' }, baselineMatches: false, effect: 'motion' },
];

/** The data-ag-* attributes the pre-paint path writes on <html> for these OS signals. */
const stampedAttributes = (os: OsSignals, backdropFilter: boolean): Record<string, string> => {
  const r = resolvePaint(os, { backdropFilter, saveData: false, deviceMemory: null });
  const out: Record<string, string> = {
    'data-ag-transparency': r.transparency,
    'data-ag-contrast': r.contrast,
    'data-ag-motion': r.motion,
    'data-ag-scheme': r.scheme,
    'data-ag-density': r.density,
  };
  if (r.tier === 'lightweight') out['data-ag-tier'] = 'lightweight';
  return out;
};

/* ------------------------------------------------------------- helpers -- */

const serve = async (page: Page, html: string) => {
  await page.route(`${ORIGIN}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === '/' || url.pathname === '/index.html') {
      await route.fulfill({ status: 200, contentType: 'text/html', body: html });
      return;
    }
    const file = resolve(ROOT, `.${decodeURIComponent(url.pathname)}`);
    if (!file.startsWith(ROOT + sep) || !existsSync(file)) {
      await route.fulfill({ status: 404, body: 'not found' });
      return;
    }
    await route.fulfill({ status: 200, contentType: MIME[extname(file)] ?? 'application/octet-stream', body: readFileSync(file) });
  });
  const failed: string[] = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);
  expect(failed, 'every fixture stylesheet loads').toEqual([]);
  const sheets = await page.evaluate(() => document.styleSheets.length);
  expect(sheets, 'all MAT stylesheets attached').toBe(STYLESHEETS.length + 1);
};

const shoot = (page: Page) => page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });

/** Decode a PNG inside the page (no Node PNG dependency) to RGBA bytes. */
const decode = (page: Page, png: Buffer) =>
  page.evaluate(async (b64) => {
    const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
    const c = new OffscreenCanvas(img.width, img.height);
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    return { width: img.width, height: img.height, data: Array.from(ctx.getImageData(0, 0, img.width, img.height).data) };
  }, png.toString('base64'));

const changedRatio = async (page: Page, a: Buffer, b: Buffer): Promise<number> => {
  const [pa, pb] = await Promise.all([decode(page, a), decode(page, b)]);
  expect(`${pa.width}x${pa.height}`, 'captures have identical dimensions').toBe(`${pb.width}x${pb.height}`);
  const changed = pixelmatch(
    new Uint8ClampedArray(pa.data), new Uint8ClampedArray(pb.data), undefined, pa.width, pa.height,
    { threshold: VISUAL_TOLERANCE.pixelmatchThreshold, includeAA: VISUAL_TOLERANCE.includeAA },
  );
  return changed / (pa.width * pa.height);
};

/**
 * Open the zero-JS page with the mode's OS preference emulated.
 * prefers-reduced-transparency has no Playwright context option:
 *   chromium — CDP Emulation.setEmulatedMedia feature;
 *   firefox  — a dedicated browser launched with the Gecko UI preference;
 *   webkit   — no emulation channel exists; the case fails (reported, never skipped).
 */
const openZeroJs = async (
  mode: Mode, browser: Browser, firefox: BrowserType, browserName: string, html: string,
): Promise<{ page: Page; close: () => Promise<void> }> => {
  if (mode.id === 'reduced-transparency' && browserName === 'firefox') {
    const ff = await firefox.launch({
      firefoxUserPrefs: { 'layout.css.prefers-reduced-transparency.enabled': true, 'ui.prefersReducedTransparency': 1 },
    });
    const ctx = await ff.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await serve(page, html);
    return { page, close: () => ff.close() };
  }
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, ...mode.media });
  const page = await ctx.newPage();
  if (mode.id === 'reduced-transparency') {
    if (browserName !== 'chromium') {
      throw new Error(`${browserName}: no emulation channel for prefers-reduced-transparency — REQ-MAT-12 cell cannot be measured`);
    }
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
  }
  await serve(page, html);
  return { page, close: () => ctx.close() };
};

/** Computed values that prove a preference changed what the CSS resolves. */
const probe = (page: Page) =>
  page.evaluate(() => {
    const surface = document.querySelector('[data-ag-surface]')!;
    const html = getComputedStyle(document.documentElement);
    const s = getComputedStyle(surface);
    return {
      canvas: html.getPropertyValue('--ag-color-canvas').trim(),
      springSnappy: s.getPropertyValue('--ag-spring-snappy').trim(),
      easeStandard: s.getPropertyValue('--ag-ease-standard').trim(),
    };
  });

/* --------------------------------------------------------------- cases -- */

test.describe('REQ-MAT-12 zero-JS mode parity', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const mode of MODES) {
    test(`zero-JS render equals the attribute baseline under ${mode.id}`, async ({ browser, browserName, playwright }) => {
      const browserType: BrowserType = playwright.firefox;
      const os: OsSignals = { ...NO_OS, ...mode.os };
      const zeroHtml = fixtureHtml({});

      // reference: zero-JS with no preference at all (proves each mode changes rendering)
      const refCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, ...NEUTRAL_MEDIA });
      const refPage = await refCtx.newPage();
      await serve(refPage, zeroHtml);
      const refShot = await shoot(refPage);
      const refProbe = await probe(refPage);
      const backdropFilter = await refPage.evaluate(
        () => CSS.supports('(backdrop-filter: blur(1px))') || CSS.supports('(-webkit-backdrop-filter: blur(1px))'),
      );

      const zero = await openZeroJs(mode, browser, browserType, browserName, zeroHtml);
      expect(await zero.page.evaluate((q) => matchMedia(q).matches, mode.query), `${mode.query} emulated`).toBe(true);
      expect(
        await zero.page.evaluate(() => document.documentElement.getAttributeNames().filter((n) => n.startsWith('data-ag-'))),
        'zero-JS page carries no data-ag-* attribute',
      ).toEqual([]);
      const zeroShot = await shoot(zero.page);
      const zeroProbe = await probe(zero.page);

      const stamped = stampedAttributes(os, backdropFilter);
      const baseCtx = await browser.newContext({
        viewport: VIEWPORT, deviceScaleFactor: 1, ...NEUTRAL_MEDIA,
        ...(mode.emulateOnBaseline ? mode.media : {}),
      });
      const basePage = await baseCtx.newPage();
      await serve(basePage, fixtureHtml(stamped));
      expect(await basePage.evaluate((q) => matchMedia(q).matches, mode.query), 'attribute baseline environment')
        .toBe(mode.baselineMatches);
      const baseShot = await shoot(basePage);
      const baseProbe = await probe(basePage);

      const ratio = await changedRatio(refPage, baseShot, zeroShot);
      const effect = await changedRatio(refPage, refShot, zeroShot);

      mkdirSync(EVIDENCE_DIR, { recursive: true });
      writeFileSync(
        join(EVIDENCE_DIR, `${browserName}-${mode.id}.json`),
        JSON.stringify({ req: 'REQ-MAT-12', engine: browserName, mode: mode.id, stamped, ratio,
          tolerance: VISUAL_TOLERANCE.changedRatio, effectVsNoPreference: effect, zeroProbe, baseProbe }, null, 2),
      );
      await test.info().attach(`${browserName}-${mode.id}-attribute.png`, { body: baseShot, contentType: 'image/png' });
      await test.info().attach(`${browserName}-${mode.id}-zero-js.png`, { body: zeroShot, contentType: 'image/png' });

      // the preference really changed what renders (no vacuous parity)
      const effects: Record<Mode['effect'], () => void> = {
        baseline: () => expect(zeroProbe.canvas.length, 'tokens.css resolved').toBeGreaterThan(0),
        pixels: () => expect(effect, `${mode.id} changes the render vs no preference`)
          .toBeGreaterThan(VISUAL_TOLERANCE.changedRatio),
        motion: () => {
          expect(refProbe.springSnappy).not.toBe(refProbe.easeStandard);
          expect(zeroProbe.springSnappy).toBe(zeroProbe.easeStandard);
          expect(baseProbe.springSnappy).toBe(zeroProbe.springSnappy);
        },
      };
      effects[mode.effect]();

      expect(ratio, `${browserName} ${mode.id}: changed-pixel ratio attribute vs zero-JS`).toBeLessThanOrEqual(
        VISUAL_TOLERANCE.changedRatio,
      );

      await Promise.all([zero.close(), baseCtx.close(), refCtx.close()]);
    });
  }
});
