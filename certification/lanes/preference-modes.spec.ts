/* G-13 / REQ-QUAL-16 (FIN-430) — L6 preference modes must change something.

   Per certification subject (one story per subject from this pipeline's Storybook build) and engine, over `photo`
   (light, 1440, standard tier) versus the `default` cell of the same scene, scheme and engine:
   - contrast-more (emulateMedia contrast:'more' + data-ag-contrast=more): ≥0.5 % of surface pixels change AND the worst
     OCR contrast rises or reaches ≥7:1;
   - tinted: σ(interior) ÷ σ(scene under it) drops by ≥25 % per glass surface;
   - solid and forced-colors (forced-colors only where its emulation reads back, FORCED_COLORS_ENGINES): 0 elements with
     computed backdrop-filter ≠ none (incl. ::before) inside the subject;
   - a 0.000 pixel delta against default fails `preference-noop`.
   Labels of every capture are read back (REQ-QUAL-17). Negative control: `qual-fixtures-pixel-gates--preference-noop`
   (fixed colours that ignore data-ag-contrast/transparency) must be reported preference-noop.
   Thresholds: certification/thresholds.json `preference`. Remote-only browser lane (GitLab CI / gated runner). */
import { join } from 'node:path';
import type { Browser, Page } from '@playwright/test';
import { test, expect, installDeterminism } from './_fixtures/determinism';
import { forceFor, storyUrl } from '../../packages/qa/src/matrix/force';
import { normalize, FORCED_COLORS_ENGINES } from '../../packages/qa/src/matrix/prune';
import type { Cell, MatrixEngine } from '../../packages/qa/src/matrix/axes';
import { failures, type GateResult } from '../../packages/qa/src/pixel/gate';
import { toDeviceRect, insetRect, type Rect, type Rgba } from '../../packages/qa/src/pixel/raster';
import { collectBackdropRects } from '../../packages/qa/src/pixel/density';
import { markPresenceSurfaces } from '../../packages/qa/src/pixel/materialPresence';
import { changedShare, contrastMoreGate, noBackdropGate, noop, sigmaRatio, tintedGate } from '../../packages/qa/src/pixel/preference';
import { ocr } from '../../packages/qa/src/ocr/tesseract';
import { evaluateOcr } from '../../packages/qa/src/ocr/contrast';
import { collectTextRuns, twinCss } from '../../packages/qa/src/ocr/twin';
import { compareLabels, readBack } from '../../packages/qa/src/evidence/readback';
import {
  ROOT, STORY_ROOT, SUBJECT_SELECTOR, THRESHOLDS, capture, captureWith, collectConsole, consoleFailures, laneStories,
  requestedLabels, settle, subjectBox, tesseractInfo,
} from './_fixtures/pixel-gates';

const SCOPE = process.env.AG_SCOPE ?? 'pr';
const STORYBOOK_URL = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const STATIC_DIR = process.env.AG_STORYBOOK_STATIC ?? join(ROOT, 'storybook-static');
const READY_TIMEOUT_MS = 30_000;
const NOOP_FIXTURE = 'qual-fixtures-pixel-gates--preference-noop';
const ENGINES: readonly MatrixEngine[] = ['chromium', 'webkit', 'firefox'];

function pendingOrFail(reason: string, producer: string): never {
  if (SCOPE === 'release') throw new Error(`release scope: ${reason} (producer: ${producer})`);
  throw new Error(`pending: ${reason} (producer: ${producer})`);
}

const base = (engine: MatrixEngine): Cell => ({ engine, scene: 'photo', scheme: 'light', transparency: 'glass', preference: 'default', tier: 'standard', viewport: '1440' });

interface Render { rgba: Rgba; sceneOnly: Rgba; surfaces: Array<{ rect: Rect; label: string }>; subject: Rect | null; backdrops: ReturnType<typeof collectBackdropRects>; worstOcr: number | null; labels: GateResult; console: string[] }

async function render(browser: Browser, storyId: string, cell: Cell, withOcr: boolean): Promise<Render> {
  const force = forceFor(cell);
  const context = await browser.newContext({ ...force.context, colorScheme: force.media.colorScheme, reducedMotion: force.media.reducedMotion,
    forcedColors: force.media.forcedColors, contrast: force.media.contrast, baseURL: STORYBOOK_URL });
  try {
    const page: Page = await context.newPage();
    const events = collectConsole(page);
    await installDeterminism(page);
    await page.emulateMedia(force.media);
    await page.goto(storyUrl(STORYBOOK_URL, storyId, cell));
    await page.locator('[data-ag-story-content][data-ag-cert-ready]').waitFor({ state: 'attached', timeout: READY_TIMEOUT_MS });
    await settle(page);
    const dpr = await page.evaluate(() => window.devicePixelRatio);
    const labels = compareLabels(requestedLabels(cell), await page.evaluate(readBack));
    const rgba = await capture(page);
    const sceneOnly = await captureWith(page, `${SUBJECT_SELECTOR} { visibility: hidden !important; }`);
    const surfaces = (await page.evaluate(markPresenceSurfaces, STORY_ROOT)).map((s) => ({ rect: toDeviceRect(s.rect, dpr), label: s.label }));
    const sb = await subjectBox(page);
    const subject = sb ? toDeviceRect(sb, dpr) : null;
    const backdrops = await page.evaluate(collectBackdropRects, STORY_ROOT);
    let worstOcr: number | null = null;
    if (withOcr) {
      const runs = await page.evaluate(collectTextRuns, STORY_ROOT);
      const twin = await captureWith(page, twinCss(STORY_ROOT));
      const words = ocr(rgba, { psm: THRESHOLDS.ocr.psm, upscale: THRESHOLDS.ocr.upscale, ...(subject ? { region: subject } : {}) }).words;
      worstOcr = evaluateOcr({ capture: rgba, twin, words, runs, dpr, contrastMore: cell.preference === 'contrast-more', thresholds: THRESHOLDS.ocr }).worst?.ratio ?? null;
    }
    return { rgba, sceneOnly, surfaces, subject, backdrops, worstOcr, labels, console: consoleFailures(events) };
  } finally {
    await context.close();
  }
}

/** Every REQ-QUAL-16 gate of one subject × engine (plus the labels and console of each render). */
async function preferenceGates(browser: Browser, storyId: string, engine: MatrixEngine): Promise<GateResult[]> {
  const tess = tesseractInfo();
  const withOcr = !('error' in tess);
  const d = await render(browser, storyId, base(engine), withOcr);
  const out: GateResult[] = [d.labels];
  if (!d.subject) return [...out, { gate: 'preference-subject', status: 'fail', detail: 'no subject box' }];
  const regions = d.surfaces.length ? d.surfaces.map((s) => s.rect) : [d.subject];

  const more = await render(browser, storyId, normalize({ ...base(engine), preference: 'contrast-more' }), withOcr);
  out.push(more.labels);
  const moreDelta = changedShare(d.rgba, more.rgba, regions, THRESHOLDS.separation.minDelta);
  out.push(noop('contrast-more', changedShare(d.rgba, more.rgba, [d.subject], 0)));
  if (withOcr) out.push(...contrastMoreGate(moreDelta, d.worstOcr, more.worstOcr, THRESHOLDS.preference));
  else out.push({ gate: 'contrast-more-ocr', status: 'pending', detail: `${tess.error} (producer: FIN-B AG_PLAYWRIGHT_IMAGE with tesseract 5)` }, contrastMoreGate(moreDelta, null, null, THRESHOLDS.preference)[0]!);

  const tinted = await render(browser, storyId, normalize({ ...base(engine), transparency: 'tinted' }), false);
  out.push(tinted.labels, noop('tinted', changedShare(d.rgba, tinted.rgba, [d.subject], 0)));
  d.surfaces.forEach((s, i) => {
    const interior = insetRect(s.rect, 6);
    const t = tinted.surfaces[i];
    out.push(tintedGate(sigmaRatio(d.rgba, d.sceneOnly, interior), t ? sigmaRatio(tinted.rgba, tinted.sceneOnly, insetRect(t.rect, 6)) : null, THRESHOLDS.preference, s.label));
  });

  const solid = await render(browser, storyId, normalize({ ...base(engine), transparency: 'solid' }), false);
  out.push(solid.labels, noBackdropGate('solid', solid.backdrops));
  if (d.backdrops.length) out.push(noop('solid', changedShare(d.rgba, solid.rgba, [d.subject], 0)));

  if (FORCED_COLORS_ENGINES.includes(engine)) {
    const forced = await render(browser, storyId, normalize({ ...base(engine), preference: 'forced-colors' }), false);
    out.push(forced.labels, noBackdropGate('forced-colors', forced.backdrops));
  }
  const consoleBad = [d, more, tinted, solid].flatMap((r) => r.console);
  if (consoleBad.length) out.push({ gate: 'console', status: 'fail', detail: consoleBad.join(' | ') });
  return out;
}

const subjects = laneStories(STATIC_DIR);

test.describe('L6 preference modes (REQ-QUAL-16)', () => {
  if ('pending' in subjects) {
    test('preference-modes inputs', () => { pendingOrFail(subjects.pending, subjects.producer); });
    return;
  }

  test('negative control: a fixture that ignores data-ag-contrast is preference-noop @engine-chromium', async ({ browser }) => {
    test.setTimeout(120_000);
    if (!subjects.indexIds.has(NOOP_FIXTURE)) pendingOrFail(`${NOOP_FIXTURE} is not in this pipeline's index.json`, 'stories/qual/fixtures/PixelGates.stories.tsx');
    const d = await render(browser, NOOP_FIXTURE, base('chromium'), false);
    const more = await render(browser, NOOP_FIXTURE, normalize({ ...base('chromium'), preference: 'contrast-more' }), false);
    expect(d.subject).not.toBeNull();
    const r = noop('contrast-more', changedShare(d.rgba, more.rgba, [d.subject!], 0));
    expect(r.gate).toBe('preference-noop');
    expect(r.status, r.detail).toBe('fail');
  });

  if (subjects.stories.length === 0) {
    test('preference-modes has subjects', () => { pendingOrFail(`0 certification subjects at scope ${SCOPE}`, 'stream stories with parameters.ag'); });
  }

  for (const s of subjects.stories) {
    for (const engine of ENGINES) {
      test(`${s.id} [${s.owner}] @engine-${engine}`, async ({ browser }) => {
        test.setTimeout(180_000);
        const results = await preferenceGates(browser, s.id, engine);
        expect(failures(results), `REQ-QUAL-16 preference modes for ${s.subject} (${s.owner})`).toEqual([]);
        const pending = results.filter((r) => r.status === 'pending');
        if (pending.length) pendingOrFail(pending.map((r) => r.detail).join(' | '), 'see gate detail');
      });
    }
  }
});
