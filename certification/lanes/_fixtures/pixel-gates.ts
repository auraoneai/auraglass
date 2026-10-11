/* G-13 / REQ-QUAL-13..18 (FIN-430): per-cell gate runner shared by the L6 specs (environment-visual, preference-modes,
   console). Captures come from the browser under test and are decoded by it (canvas getImageData) — no PNG decoder
   dependency. Every measurement routine lives in packages/qa/src (unit-tested there); this file only drives the page:
   capture, hide/show, twin CSS, in-page collectors, and maps CSS px to device px. Remote-only (GitLab CI / gated runner). */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BrowserContext, ConsoleMessage, Page } from '@playwright/test';
import type { Cell } from '../../../packages/qa/src/matrix/axes';
import { toDeviceRect, insetRect, type Rect, type Rgba } from '../../../packages/qa/src/pixel/raster';
import type { GateResult } from '../../../packages/qa/src/pixel/gate';
import { loadThresholds, type FrameFillKind, type Thresholds } from '../../../packages/qa/src/pixel/thresholds';
import { notBlank } from '../../../packages/qa/src/pixel/notBlank';
import { separation } from '../../../packages/qa/src/pixel/separation';
import { frameFill } from '../../../packages/qa/src/pixel/frameFill';
import { collectBackdropRects, density } from '../../../packages/qa/src/pixel/density';
import { neon } from '../../../packages/qa/src/pixel/neon';
import { collectFillBoxes, intentDelta } from '../../../packages/qa/src/pixel/intentDelta';
import { glassOverNothing, markPresenceSurfaces, readFloorAlpha, whiteBlackDelta } from '../../../packages/qa/src/pixel/materialPresence';
import { ocr, tesseractVersion } from '../../../packages/qa/src/ocr/tesseract';
import { evaluateOcr, type OcrVerdict } from '../../../packages/qa/src/ocr/contrast';
import { collectTextRuns, twinCss } from '../../../packages/qa/src/ocr/twin';
import {
  analyseLayout, collectLayoutSnapshot, collectTargets, containment, focusIndicator, measureContainment, restoreAncestorOverflow,
  rightEdgeTouched, targetSizes, type LayoutIssue,
} from '../../../packages/qa/src/inspect/layout';
import { compareLabels, labelsFrom, readBack, type RequestedLabels } from '../../../packages/qa/src/evidence/readback';
import { consoleViolations, loadConsoleAllowlist, type ConsoleEvent } from '../../../packages/qa/src/evidence/consoleAllowlist';
import type { TokenManifest } from '../../../src/contracts/tokens';
import { parseSubjectIndex } from '../../../packages/qa/src/resolve/resolveSubject.ts';

export const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
export const STORY_ROOT = '[data-ag-story-content]';
export const SUBJECT_SELECTOR = '[data-ag-story-content], [data-ag-portal-root] > *, [data-ag-layer-root] > *';
/** neon is the subject's own palette: measured only over achromatic scenes */
const ACHROMATIC_SCENES = new Set(['flat-white', 'flat-black']);

const loaded = loadThresholds(ROOT);
export const THRESHOLDS: Thresholds = loaded.thresholds;
export const THRESHOLDS_SHA256 = loaded.sha256;

// ---- evidence inputs ------------------------------------------------------------------------------------------------
let tesseract: { version: string } | { error: string } | null = null;
/** tesseract 5 in the job image (recorded in the lane manifest); `{error}` when absent. */
export function tesseractInfo(): { version: string } | { error: string } {
  if (!tesseract) { try { tesseract = { version: tesseractVersion() }; } catch (e) { tesseract = { error: (e as Error).message }; } }
  return tesseract;
}

const sceneManifest = (() => {
  const f = join(ROOT, 'certification/scenes/scenes.manifest.json');
  return existsSync(f) ? (JSON.parse(readFileSync(f, 'utf8')) as Record<string, { luminanceSigma?: number }>) : {};
})();
export function sceneSigma(scene: string): number | null {
  const v = sceneManifest[scene]?.luminanceSigma;
  return typeof v === 'number' ? v : null;
}
export const SCENES_SHA256 = (() => {
  const f = join(ROOT, 'certification/scenes/scenes.manifest.json');
  return existsSync(f) ? createHash('sha256').update(readFileSync(f)).digest('hex') : null;
})();

/** S-11 token manifest of the build under test (dist/), or null while it is absent / has no floors. */
export const TOKEN_MANIFEST: TokenManifest | null = (() => {
  const f = join(ROOT, 'dist/tokens/manifest.json');
  return existsSync(f) ? (JSON.parse(readFileSync(f, 'utf8')) as TokenManifest) : null;
})();

// ---- console --------------------------------------------------------------------------------------------------------
/** Starts collecting pageerror / console.error / console.warn for a page (attach before goto). */
export function collectConsole(page: Page): ConsoleEvent[] {
  const events: ConsoleEvent[] = [];
  page.on('pageerror', (err) => events.push({ kind: 'pageerror', text: `${err.name}: ${err.message}` }));
  page.on('console', (m: ConsoleMessage) => {
    const t = m.type();
    if (t === 'error' || t === 'warning') events.push({ kind: t, text: m.text() });
  });
  return events;
}
const ALLOW = loadConsoleAllowlist(ROOT);
export function consoleFailures(events: readonly ConsoleEvent[]): string[] {
  return consoleViolations(events, ALLOW).map((e) => `${e.kind}: ${e.text.slice(0, 300)}`);
}

// ---- captures --------------------------------------------------------------------------------------------------------
/** PNG → RGBA decoded by the browser under test. */
export async function decode(context: BrowserContext, png: Buffer): Promise<Rgba> {
  const scratch = await context.newPage();
  try {
    const r = await scratch.evaluate(async (b64: string) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('2d canvas unavailable');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let bin = '';
      for (let i = 0; i < d.length; i += 0x8000) bin += String.fromCharCode(...d.subarray(i, i + 0x8000));
      return { width: c.width, height: c.height, bytes: btoa(bin) };
    }, png.toString('base64'));
    return { width: r.width, height: r.height, data: new Uint8ClampedArray(Buffer.from(r.bytes, 'base64')) };
  } finally {
    await scratch.close();
  }
}

export async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(document.getAnimations().filter((a) => Number.isFinite(Number(a.effect?.getComputedTiming().endTime))).map((a) => a.finished.catch(() => undefined)));
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  });
}

export async function capture(page: Page): Promise<Rgba> {
  return decode(page.context(), await page.screenshot({ animations: 'disabled', caret: 'hide' }));
}

/** Captures with an extra stylesheet applied, then removes it and re-settles. */
export async function captureWith(page: Page, css: string): Promise<Rgba> {
  const tag = await page.addStyleTag({ content: css });
  await settle(page);
  try { return await capture(page); } finally { await tag.evaluate((el) => (el as Element).remove()); await settle(page); }
}

export async function subjectBox(page: Page): Promise<Rect | null> {
  return page.evaluate((sel) => {
    const rs = [...document.querySelectorAll(sel)].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
    if (!rs.length) return null;
    const x0 = Math.min(...rs.map((r) => r.left)); const y0 = Math.min(...rs.map((r) => r.top));
    const x1 = Math.max(...rs.map((r) => r.right)); const y1 = Math.max(...rs.map((r) => r.bottom));
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }, SUBJECT_SELECTOR);
}

/** Painted content box of the story root: union of descendants that are visible and have a box. */
async function contentBox(page: Page): Promise<Rect | null> {
  return page.evaluate((root) => {
    const r0 = document.querySelector(root);
    if (!r0) return null;
    const rs = [r0, ...r0.querySelectorAll('*')].filter((e) => { const cs = getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden'; })
      .map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
    if (!rs.length) return null;
    const x0 = Math.max(0, Math.min(...rs.map((r) => r.left))); const y0 = Math.max(0, Math.min(...rs.map((r) => r.top)));
    const x1 = Math.min(innerWidth, Math.max(...rs.map((r) => r.right))); const y1 = Math.min(innerHeight, Math.max(...rs.map((r) => r.bottom)));
    return { x: x0, y: y0, w: Math.max(0, x1 - x0), h: Math.max(0, y1 - y0) };
  }, STORY_ROOT);
}

const HIDE_SUBJECT = `${SUBJECT_SELECTOR} { visibility: hidden !important; }`;

export function requestedLabels(cell: Cell): RequestedLabels {
  return { scheme: cell.scheme, preference: cell.preference, engine: cell.engine, tier: cell.tier, transparency: cell.transparency };
}

export interface CellGateReport {
  labels: ReturnType<typeof labelsFrom>;
  results: GateResult[];
  ocr: OcrVerdict | null;
  layoutIssues: LayoutIssue[];
  tesseract: string | null;
}

/** Every per-cell mechanical gate of REQ-QUAL-13..18 for the page as rendered (state already driven and settled). */
export async function runCellGates(page: Page, input: { cell: Cell; kind: string; focusDriven: boolean }): Promise<CellGateReport> {
  const { cell, kind } = input;
  const T = THRESHOLDS;
  const results: GateResult[] = [];
  const dpr = await page.evaluate(() => window.devicePixelRatio);
  const vp = page.viewportSize()!;

  // REQ-QUAL-17 labels: read back, never copied from the request
  const rb = await page.evaluate(readBack);
  results.push(compareLabels(requestedLabels(cell), rb));

  const shot = await capture(page);
  const sceneOnly = await captureWith(page, HIDE_SUBJECT);
  const subj = await subjectBox(page);
  if (!subj) {
    results.push({ gate: 'not-blank', status: 'fail', detail: 'no subject box ([data-ag-story-content] has no painted area)' });
    return { labels: labelsFrom(rb), results, ocr: null, layoutIssues: [], tesseract: null };
  }
  const subjD = toDeviceRect(subj, dpr);

  // REQ-QUAL-15 pixel gates
  results.push(notBlank(shot, sceneOnly, subjD, T.notBlank));
  const content = await contentBox(page);
  results.push(content ? frameFill(content, vp, kind as FrameFillKind, T.frameFill) : { gate: 'frame-fill', status: 'fail', detail: 'no content box' });
  results.push(density(await page.evaluate(collectBackdropRects, null), vp, T.density));
  if (ACHROMATIC_SCENES.has(cell.scene)) results.push(neon(shot, subjD, T.neon));
  const fills = (await page.evaluate(collectFillBoxes, STORY_ROOT)).map((b) => ({ ...b, rect: toDeviceRect(b.rect, dpr) }));
  results.push(intentDelta(shot, fills, T));
  const layoutIssues = analyseLayout(await page.evaluate(collectLayoutSnapshot, STORY_ROOT));
  results.push({ gate: 'layout', status: layoutIssues.length ? 'fail' : 'pass', value: layoutIssues.length, limit: 0,
    detail: layoutIssues.length ? layoutIssues.slice(0, 10).map((i) => `${i.type}: ${i.detail}`).join('; ') : 'no overlap/overflow/truncation' });

  // REQ-QUAL-14 glass over nothing + REQ-QUAL-15 separation, per measured surface (each hidden alone)
  const surfaces = await page.evaluate(markPresenceSurfaces, STORY_ROOT);
  for (const s of surfaces) {
    const hidden = await captureWith(page, `[data-qa-surface="${s.index}"] { visibility: hidden !important; }`);
    const box = toDeviceRect(s.rect, dpr);
    const sep = separation(shot, hidden, box, T.separation);
    results.push({ ...sep, detail: `${s.label}: ${sep.detail}` });
    // the scene region under the surface is what the hidden capture shows inside its border box, minus the subject's other paint
    results.push(glassOverNothing(hidden, box, sceneSigma(cell.scene), T.materialPresence, s.label));
  }
  await page.evaluate(() => { for (const el of document.querySelectorAll('[data-qa-surface]')) el.removeAttribute('data-qa-surface'); });

  // REQ-QUAL-13 OCR contrast over the subject region
  let ocrVerdict: OcrVerdict | null = null;
  const tess = tesseractInfo();
  if ('error' in tess) {
    results.push({ gate: 'ocr-contrast', status: 'pending', detail: `${tess.error} (producer: FIN-B AG_PLAYWRIGHT_IMAGE with tesseract 5)` });
  } else {
    const runs = await page.evaluate(collectTextRuns, STORY_ROOT);
    const twin = await captureWith(page, twinCss(STORY_ROOT));
    const pad = 8 * dpr;
    const region = { x: subjD.x - pad, y: subjD.y - pad, w: subjD.w + 2 * pad, h: subjD.h + 2 * pad };
    const read = ocr(shot, { psm: T.ocr.psm, upscale: T.ocr.upscale, region });
    ocrVerdict = evaluateOcr({ capture: shot, twin, words: read.words, runs, dpr, contrastMore: cell.preference === 'contrast-more', thresholds: T.ocr });
    const w = ocrVerdict.worst;
    results.push({ gate: 'ocr-contrast', status: ocrVerdict.status, ...(w ? { value: w.ratio, limit: w.required } : {}), detail: ocrVerdict.detail });
  }

  // REQ-QUAL-18 containment and targets (mobile cells)
  if (vp.width <= 390) {
    const m = await page.evaluate(measureContainment, STORY_ROOT);
    await settle(page);
    try {
      results.push(containment(m, T.layout));
      const wide = await capture(page);
      const wideScene = await captureWith(page, HIDE_SUBJECT);
      results.push(rightEdgeTouched(wide, wideScene, T.separation.minDelta));
    } finally {
      await page.evaluate(restoreAncestorOverflow);
      await settle(page);
    }
    results.push(targetSizes(await page.evaluate(collectTargets, STORY_ROOT), T.layout));
  }

  // REQ-QUAL-18 focus indicator (focus-visible cells): focused vs blurred, last because it changes focus
  if (input.focusDriven) results.push(await focusGate(page, dpr));

  return { labels: labelsFrom(rb), results, ocr: ocrVerdict, layoutIssues, tesseract: 'version' in tess ? tess.version : null };
}

/** Focus indicator of the currently focused element against adjacent pixels (≥3:1). */
export async function focusGate(page: Page, dpr: number): Promise<GateResult> {
  const r = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const b = el.getBoundingClientRect();
    return { x: b.left, y: b.top, w: b.width, h: b.height, focusVisible: el.matches(':focus-visible') };
  });
  if (!r) return { gate: 'focus-indicator', status: 'fail', detail: 'focus state driven but no element has focus' };
  if (!r.focusVisible) return { gate: 'focus-indicator', status: 'fail', detail: 'focused element does not match :focus-visible after keyboard focus' };
  const focused = await capture(page);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await settle(page);
  const unfocused = await capture(page);
  const ring = 8; // outline + offset allowance around the control, CSS px
  const region = toDeviceRect({ x: r.x - ring, y: r.y - ring, w: r.w + 2 * ring, h: r.h + 2 * ring }, dpr);
  return focusIndicator(focused, unfocused, region, THRESHOLDS.layout);
}

/** REQ-QUAL-14 white/black half: interior of each presence surface over flat-white and flat-black (same cell otherwise). */
export async function whiteBlackGates(white: Page, black: Page): Promise<GateResult[]> {
  const dpr = await white.evaluate(() => window.devicePixelRatio);
  const ws = await white.evaluate(markPresenceSurfaces, STORY_ROOT);
  const bs = await black.evaluate(markPresenceSurfaces, STORY_ROOT);
  if (ws.length !== bs.length) return [{ gate: 'glass-shows-scene', status: 'fail', detail: `surface count differs between flat-white (${ws.length}) and flat-black (${bs.length})` }];
  const W = await capture(white); const B = await capture(black);
  const out: GateResult[] = [];
  ws.forEach((s, i) => {
    const key = { variant: s.variant as 'regular' | 'clear', thickness: (['thin', 'regular', 'thick'].includes(s.thickness) ? s.thickness : 'regular') as 'thin' | 'regular' | 'thick' };
    const interior = toDeviceRect(insetRect(s.rect, 6), dpr);
    for (const g of whiteBlackDelta(W, B, interior, key, readFloorAlpha(TOKEN_MANIFEST, key), THRESHOLDS.materialPresence)) out.push({ ...g, detail: `${s.label} [${i}]: ${g.detail}` });
  });
  return out;
}

// ---- subjects for the per-subject lanes (preference-modes, console) -------------------------------------------------
export interface LaneStory { id: string; subject: string; kind: string; owner: string }

/** One story per certification subject (kinds component/matrix/showcase, not `no-cert`) from this pipeline's Storybook
    build (`index.json` + `cert-manifest.json`), restricted to AG_AFFECTED_SUBJECTS when set. `{pending}` while the build
    artifact is absent. Fixture ids are checked against the same index. */
export function laneStories(staticDir: string): { stories: LaneStory[]; indexIds: Set<string> } | { pending: string; producer: string } {
  const indexFile = join(staticDir, 'index.json');
  const manifestFile = join(staticDir, 'cert-manifest.json');
  if (!existsSync(indexFile)) return { pending: `${indexFile} not found — the lane needs this pipeline's qual:build:storybook artifact`, producer: 'qual:build:storybook (G-08)' };
  if (!existsSync(manifestFile)) return { pending: `${manifestFile} not found`, producer: 'write-cert-manifest (G-01)' };
  const index = JSON.parse(readFileSync(indexFile, 'utf8')) as { entries?: Record<string, { id: string; type: string }> };
  const indexIds = new Set(Object.values(index.entries ?? {}).filter((e) => e.type === 'story').map((e) => e.id));
  const subjects = parseSubjectIndex(JSON.parse(readFileSync(manifestFile, 'utf8')), manifestFile);
  const affectedEnv = process.env.AG_AFFECTED_SUBJECTS;
  const affected = affectedEnv
    ? new Set<string>(existsSync(affectedEnv) ? (JSON.parse(readFileSync(affectedEnv, 'utf8')) as string[]) : affectedEnv.split(',').map((s) => s.trim()).filter(Boolean))
    : null;
  const bySubject = new Map<string, LaneStory>();
  for (const s of [...subjects.stories].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!['component', 'matrix', 'showcase'].includes(s.kind) || s.tags.includes('no-cert') || !indexIds.has(s.id)) continue;
    if (affected && !affected.has(s.subject)) continue;
    if (!bySubject.has(s.subject)) bySubject.set(s.subject, { id: s.id, subject: s.subject, kind: s.kind, owner: s.owner });
  }
  return { stories: [...bySubject.values()], indexIds };
}
