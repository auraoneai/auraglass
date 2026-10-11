/* G-12 / REQ-QUAL-04, REQ-QUAL-12 (+ REQ-QUAL-09 ancestor and outside-pixel assertions) — L6 environment-visual capture
   driver (FIN-429, REQ-FIN-102).

   One Playwright test per (subject-state × cell) from packages/qa/src/matrix (§4.3 axes, pruning, cell ids
   `<storyId>|<scene>|<engine>|<axes>`). Subjects are this pipeline's Storybook build only: the plan is read from
   `storybook-static/index.json` + `storybook-static/cert-manifest.json` of the same job (AG_STORYBOOK_STATIC), the stories
   are rendered live from AG_STORYBOOK_URL in cert mode (`ag-cert=1`, built `dist/styles.css`), and no lane input is another
   job's screenshot or computed-style JSON. Each cell gets its own browser context with the cell's viewport, explicit DPR
   (1 desktop / 3 mobile), touch, colour scheme and emulated media; interactive states are produced by real input from
   `parameters.ag.states[].drive` and the story root is marked `data-ag-state-cell`.

   Per test: the rendered story id equals the planned `sourceStoryId` (REQ-QUAL-04); <html> carries the forced data-ag-*
   values; every ancestor between <body> and [data-ag-story-content] paints nothing (REQ-QUAL-09); pixels outside the
   subject differ from the scene-only capture by ≤ 0.5 % of the frame (REQ-QUAL-09).

   Each test title carries `@engine-<engine>`; the chromium/webkit/firefox projects of certification/playwright.cert.config.ts
   select their own engine with `grep`, so no test is skipped. Sharding: AG_SHARD="i/n" or CI_NODE_INDEX/CI_NODE_TOTAL keeps
   only the cells whose stable hash falls into the shard. Browser lane: GitLab CI / gated remote runner only.

   G-13 (REQ-QUAL-13..18, FIN-430) adds to every cell: labels read back from the page (label-mismatch), console hygiene,
   OCR text contrast against the text-hidden twin, the REQ-QUAL-15 pixel gates and the ported 4.1 layout detector,
   glass-over-nothing and separation per glass surface, and in mobile cells containment (ancestor overflow-x clipping
   disabled, right-edge pixels) and target sizes, in focus-visible cells the focus-indicator contrast. Outside the cell
   loop: the flat-white/flat-black interior delta (REQ-QUAL-14), the 768×1024 layout-only pass for product scenes and the
   negative-fixture checks (stories/qual/fixtures/PixelGates.stories.tsx). Measurement code: packages/qa/src/{ocr,pixel,
   inspect,evidence}; page driving: ./_fixtures/pixel-gates.ts. */
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { BrowserContext, Page } from '@playwright/test';
import { test, expect, installDeterminism } from './_fixtures/determinism';
import { readCsfParameters, storyAg } from '../../packages/qa/src/resolve/csf.ts';
import { parseSubjectIndex } from '../../packages/qa/src/resolve/resolveSubject.ts';
import { loadComponentMetas } from '../../packages/qa/src/resolve/componentMetas.ts';
import { forceFor, storyUrl } from '../../packages/qa/src/matrix/force';
import { shardFromEnv, shardOf } from '../../packages/qa/src/matrix/shard';
import {
  assertLiveSources, buildCapturePlan, LiveSubjectError,
  type CapturePlan, type LaneScope, type PlanAg, type PlanEntry, type PlanMeta,
} from '../../packages/qa/src/matrix/plan';
import { SENTINELS } from '../matrix.config';
// G-13 / REQ-QUAL-13..18: per-cell OCR contrast, pixel gates, material presence, labels, console, containment/targets/focus
import {
  collectConsole, consoleFailures, focusGate, runCellGates, tesseractInfo, whiteBlackGates, capture as captureRgba, captureWith,
  settle as settleGates, THRESHOLDS, THRESHOLDS_SHA256, SCENES_SHA256, STORY_ROOT, sceneSigma,
} from './_fixtures/pixel-gates';
import { failures, type GateResult } from '../../packages/qa/src/pixel/gate';
import { toDeviceRect } from '../../packages/qa/src/pixel/raster';
import { glassOverNothing, markPresenceSurfaces } from '../../packages/qa/src/pixel/materialPresence';
import { ocr } from '../../packages/qa/src/ocr/tesseract';
import { evaluateOcr } from '../../packages/qa/src/ocr/contrast';
import { collectTextRuns, twinCss } from '../../packages/qa/src/ocr/twin';
import {
  analyseLayout, collectLayoutSnapshot, collectTargets, containment, measureContainment, restoreAncestorOverflow, targetSizes,
} from '../../packages/qa/src/inspect/layout';
import type { Cell } from '../../packages/qa/src/matrix/axes';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SCOPE = (process.env.AG_SCOPE ?? 'pr') as LaneScope;
const STORYBOOK_URL = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const STATIC_DIR = process.env.AG_STORYBOOK_STATIC ?? join(ROOT, 'storybook-static');
/** run.mjs passes its lane evidence dir (AG_LANE_EVIDENCE_DIR); a direct run uses the S-48 job dir. */
const EVIDENCE_DIR = join(process.env.AG_LANE_EVIDENCE_DIR
  ?? join(ROOT, process.env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG || 'qual-certify-l6'), 'environment-visual');
/** REQ-QUAL-09: pixels outside [data-ag-story-content] may differ from the scene by at most 0.5 % of the frame. */
const OUTSIDE_PIXEL_MAX = 0.005;
const READY_TIMEOUT_MS = 30_000;
const TEST_TIMEOUT_MS = 60_000;
const SUBJECT_SELECTOR = '[data-ag-story-content], [data-ag-portal-root] > *, [data-ag-layer-root] > *';

// ---- pending vs failure (PRD-F §4.3 rule 2; REQ-QUAL-06) -------------------------------------------------------------
class AgPendingProducer extends Error {
  constructor(message: string) { super(message); this.name = 'AgPendingProducer'; }
}
/** `pending:` before release (the lane runner reports it pending), a plain failure at release scope. */
function pendingOrFail(reason: string, producer: string): never {
  if (SCOPE === 'release') throw new Error(`release scope: ${reason} (producer: ${producer})`);
  throw new AgPendingProducer(`pending: ${reason} (producer: ${producer})`);
}

// ---- inputs: this pipeline's Storybook build ------------------------------------------------------------------------
interface IndexEntry { id: string; type: string; importPath: string; exportName?: string; tags?: string[] }

function sha256File(file: string): string | null {
  return existsSync(file) ? createHash('sha256').update(readFileSync(file)).digest('hex') : null;
}

function tarballPath(): string | null {
  const env = process.env.AURAGLASS_TARBALL;
  if (env) return existsSync(env) ? env : null;
  const dir = join(ROOT, '.artifacts/pack');
  if (!existsSync(dir)) return null;
  const tgz = readdirSync(dir).filter((f) => f.endsWith('.tgz')).sort();
  return tgz.length === 1 ? join(dir, tgz[0]!) : null;
}

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function affectedSubjects(): Set<string> | null {
  const v = process.env.AG_AFFECTED_SUBJECTS;
  if (!v) return null;
  const list = existsSync(v) ? readJson(v) : v.split(',').map((s) => s.trim()).filter(Boolean);
  if (!Array.isArray(list) || !list.every((s) => typeof s === 'string')) throw new Error('AG_AFFECTED_SUBJECTS must name a JSON string array or a comma list');
  return new Set(list as string[]);
}

function showcaseTiers(): Map<string, 'S1' | 'S2'> {
  const file = join(ROOT, 'showcase/showcases.json');
  const out = new Map<string, 'S1' | 'S2'>();
  if (!existsSync(file)) return out;
  const raw = readJson(file) as { showcases?: Array<{ id?: unknown; tier?: unknown }> };
  for (const s of raw.showcases ?? []) {
    if (typeof s.id === 'string' && (s.tier === 'S1' || s.tier === 'S2')) out.set(s.id, s.tier);
  }
  return out;
}

async function planMetas(names: ReadonlySet<string>): Promise<{ metas: Map<string, PlanMeta>; errors: string[] }> {
  const metas = new Map<string, PlanMeta>();
  const errors: string[] = [];
  for (const [name, recs] of loadComponentMetas(ROOT)) {
    if (!names.has(name)) continue;
    if (recs.length !== 1) { errors.push(`ambiguous-subject: ComponentMeta '${name}' is declared in ${recs.map((r) => r.file).join(', ')}`); continue; }
    const rec = recs[0]!;
    // material.refractionEligible is not an identity field of the static reader; read it from the module itself.
    const mod = (await import(pathToFileURL(join(ROOT, rec.file)).href)) as Record<string, unknown>;
    const full = (Object.values(mod) as Array<{ name?: unknown; material?: { refractionEligible?: boolean } }>)
      .find((v) => v && typeof v === 'object' && v.name === name);
    const meta: PlanMeta = { tier: rec.tier };
    if (rec.flagship !== undefined) meta.flagship = rec.flagship;
    if (full?.material) meta.material = { ...(full.material.refractionEligible !== undefined ? { refractionEligible: full.material.refractionEligible } : {}) };
    metas.set(name, meta);
  }
  return { metas, errors };
}

interface Loaded { plan: CapturePlan; indexIds: Set<string>; loadErrors: string[] }

async function load(): Promise<Loaded | { pending: string; producer: string }> {
  const indexFile = join(STATIC_DIR, 'index.json');
  const manifestFile = join(STATIC_DIR, 'cert-manifest.json');
  if (!existsSync(indexFile)) return { pending: `${indexFile} not found — the lane needs this pipeline's qual:build:storybook artifact`, producer: 'qual:build:storybook (G-08)' };
  if (!existsSync(manifestFile)) return { pending: `${manifestFile} not found`, producer: 'write-cert-manifest (G-01)' };
  const rawIndex = readJson(indexFile) as { entries?: Record<string, IndexEntry> };
  const entries = Object.values(rawIndex.entries ?? {}).filter((e) => e.type === 'story');
  const indexIds = new Set(entries.map((e) => e.id));
  const byId = new Map(entries.map((e) => [e.id, e]));
  const subjects = parseSubjectIndex(readJson(manifestFile), manifestFile);
  const loadErrors: string[] = [];
  const ag = new Map<string, PlanAg | undefined>();
  const csfCache = new Map<string, ReturnType<typeof readCsfParameters>>();
  for (const s of subjects.stories) {
    const e = byId.get(s.id);
    if (!e) continue; // reported by the plan as `live-subject`
    try {
      if (!e.exportName) throw new Error(`index-entry: ${s.id} has no exportName in index.json`);
      const file = e.importPath.replace(/^\.\//, '');
      let csf = csfCache.get(file);
      if (!csf) { csf = readCsfParameters(file, readFileSync(join(ROOT, file), 'utf8')); csfCache.set(file, csf); }
      ag.set(s.id, storyAg(csf, e.exportName) as PlanAg | undefined);
    } catch (err) {
      loadErrors.push(`${s.id}: ${(err as Error).message}`);
    }
  }
  const { metas, errors } = await planMetas(new Set(subjects.stories.map((s) => s.subject)));
  loadErrors.push(...errors);
  const plan = buildCapturePlan({
    scope: SCOPE, indexIds, stories: subjects.stories, ag, metas, showcaseTiers: showcaseTiers(),
    affected: affectedSubjects(), sentinels: SENTINELS,
  });
  return { plan, indexIds, loadErrors };
}

/** Plan evidence for the lane manifest (certification/run.mjs merges it): cells, subjects, tarball and build hashes. */
function writePlanEvidence(l: Loaded, shardEntries: PlanEntry[]): void {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  const tarball = tarballPath();
  const body = {
    version: 1, lane: 'L6', scope: SCOPE, sha: process.env.CI_COMMIT_SHA ?? null, storybookUrl: STORYBOOK_URL,
    tarball: tarball ? { path: tarball.slice(ROOT.length), sha256: sha256File(tarball) } : null,
    storybookIndexSha256: sha256File(join(STATIC_DIR, 'index.json')),
    certManifestSha256: sha256File(join(STATIC_DIR, 'cert-manifest.json')),
    storybookBuild: existsSync(join(STATIC_DIR, 'ag-build.json')) ? readJson(join(STATIC_DIR, 'ag-build.json')) : null,
    shard: shardFromEnv(process.env), cellsTotal: l.plan.entries.length,
    // G-13: gate inputs bound to this run (REQ-QUAL-13 tesseract version; REQ-QUAL-15 thresholds; REQ-QUAL-14 scene σ)
    thresholdsSha256: THRESHOLDS_SHA256, scenesSha256: SCENES_SHA256, tesseract: tesseractInfo(),
    subjects: [...new Set(shardEntries.map((e) => e.subject))].sort(),
    cells: shardEntries.map((e) => e.id),
    problems: l.plan.problems, loadErrors: l.loadErrors, pendingSentinels: l.plan.pendingSentinels,
  };
  // Every worker computes the same plan; write atomically so concurrent workers never leave a torn file.
  const out = join(EVIDENCE_DIR, 'plan.json');
  const tmp = `${out}.${process.pid}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(body, null, 2)}\n`);
  renameSync(tmp, out);
}

function recordCapture(row: Record<string, unknown>): void {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  appendFileSync(join(EVIDENCE_DIR, `captures-${process.pid}.jsonl`), `${JSON.stringify(row)}\n`);
}

// ---- page helpers ---------------------------------------------------------------------------------------------------
async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
    // finite animations only: an infinite one is the motion lane's failure, not a reason to hang the capture
    await Promise.all(document.getAnimations()
      .filter((a) => Number.isFinite(Number(a.effect?.getComputedTiming().endTime)))
      .map((a) => a.finished.catch(() => undefined)));
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  });
}

const PART_RE = /^[a-z][a-z0-9-]*$/;

async function driveState(page: Page, entry: PlanEntry): Promise<void> {
  for (const step of entry.drive ?? []) {
    if (!PART_RE.test(step.target)) throw new Error(`${entry.storyId} state '${entry.state}': drive target '${step.target}' is not a data-ag-part name`);
    const target = page.locator(`[data-ag-story-content] [data-ag-part="${step.target}"], [data-ag-portal-root] [data-ag-part="${step.target}"]`).first();
    await expect(target, `drive target [data-ag-part="${step.target}"] of ${entry.storyId}`).toBeVisible();
    switch (step.action) {
      case 'hover': await target.hover(); break;
      case 'focus':
        // keyboard modality first, so :focus-visible matches as it does for a keyboard user
        await page.keyboard.press('Shift');
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
        if (typeof step.text !== 'string') throw new Error(`${entry.storyId} state '${entry.state}': 'type' needs text`);
        await target.click();
        await page.keyboard.type(step.text);
        break;
      default: throw new Error(`${entry.storyId} state '${entry.state}': unknown drive action '${String((step as { action: unknown }).action)}'`);
    }
  }
  await page.evaluate((state) => {
    const root = document.querySelector('[data-ag-story-content]');
    if (!root) throw new Error('no [data-ag-story-content]');
    root.setAttribute('data-ag-state-cell', state);
  }, entry.state);
}

/** REQ-QUAL-09: ancestors between <body> (exclusive) and [data-ag-story-content] that paint anything. */
async function paintingAncestors(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const alpha = (c: string): number => {
      if (c === 'transparent') return 0;
      const m = /^rgba?\(([^)]+)\)$/.exec(c.trim());
      if (!m) return 1; // unparsable colour: treat as painting
      const parts = m[1]!.split(/[\s,/]+/).filter(Boolean);
      return parts.length === 4 ? Number(parts[3]) : 1;
    };
    const root = document.querySelector('[data-ag-story-content]');
    if (!root) return ['[data-ag-story-content] missing'];
    const out: string[] = [];
    for (let el = root.parentElement; el && el !== document.body; el = el.parentElement) {
      const cs = getComputedStyle(el);
      const why: string[] = [];
      if (alpha(cs.backgroundColor) !== 0) why.push(`background-color ${cs.backgroundColor}`);
      if (cs.backgroundImage !== 'none') why.push('background-image');
      const bf = cs.getPropertyValue('backdrop-filter') || cs.getPropertyValue('-webkit-backdrop-filter');
      if (bf && bf !== 'none') why.push(`backdrop-filter ${bf}`);
      if (cs.filter !== 'none') why.push(`filter ${cs.filter}`);
      if (cs.opacity !== '1') why.push(`opacity ${cs.opacity}`);
      if (why.length) {
        const id = el.id ? `#${el.id}` : '';
        const attrs = [...el.attributes].filter((a) => a.name.startsWith('data-ag-')).map((a) => `[${a.name}]`).join('');
        out.push(`${el.tagName.toLowerCase()}${id}${attrs}: ${why.join(', ')}`);
      }
    }
    return out;
  });
}

interface Rgba { width: number; height: number; data: Uint8ClampedArray }

/** PNG → RGBA decoded by the browser under test (no PNG decoder dependency). */
async function decodePng(context: BrowserContext, png: Buffer): Promise<Rgba> {
  const scratch = await context.newPage();
  try {
    const r = await scratch.evaluate(async (b64: string) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
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

/** Ratio of frame pixels outside the subject rects that differ between the capture and the scene-only capture. */
async function outsideDiffRatio(page: Page, context: BrowserContext): Promise<{ ratio: number; frame: number }> {
  const { rects, dpr } = await page.evaluate((sel) => ({
    dpr: window.devicePixelRatio,
    rects: [...document.querySelectorAll(sel)].map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0).map((r) => ({ x: r.left, y: r.top, w: r.width, h: r.height })),
  }), SUBJECT_SELECTOR);
  const withSubject = await page.screenshot({ animations: 'disabled', caret: 'hide' });
  const style = await page.addStyleTag({ content: `${SUBJECT_SELECTOR} { visibility: hidden !important; }` });
  await settle(page);
  const sceneOnly = await page.screenshot({ animations: 'disabled', caret: 'hide' });
  await style.evaluate((el) => (el as Element).remove());
  await settle(page);
  const a = await decodePng(context, withSubject);
  const b = await decodePng(context, sceneOnly);
  if (a.width !== b.width || a.height !== b.height) throw new Error(`capture size changed ${a.width}x${a.height} → ${b.width}x${b.height}`);
  // mask the subject region (device pixels) in both captures, then count differing pixels with the contract tolerance
  for (const r of rects) {
    const x0 = Math.max(0, Math.floor(r.x * dpr)); const y0 = Math.max(0, Math.floor(r.y * dpr));
    const x1 = Math.min(a.width, Math.ceil((r.x + r.w) * dpr)); const y1 = Math.min(a.height, Math.ceil((r.y + r.h) * dpr));
    for (let y = y0; y < y1; y++) {
      a.data.fill(0, (y * a.width + x0) * 4, (y * a.width + x1) * 4);
      b.data.fill(0, (y * b.width + x0) * 4, (y * b.width + x1) * 4);
    }
  }
  const { default: pixelmatch } = await import('pixelmatch');
  const { VISUAL_TOLERANCE } = await import('../../src/contracts/testing');
  const diff = pixelmatch(a.data, b.data, undefined, a.width, a.height,
    { threshold: VISUAL_TOLERANCE.pixelmatchThreshold, includeAA: VISUAL_TOLERANCE.includeAA });
  return { ratio: diff / (a.width * a.height), frame: a.width * a.height };
}

// ---- test generation ------------------------------------------------------------------------------------------------
const loaded = await load();

/** REQ-QUAL-04 self-check fixture: a capture whose source id is absent from the index must fail the live-subject rule. */
const LIVE_FIXTURE = readJson(fileURLToPath(new URL('./_fixtures/live-subjects.fixture.json', import.meta.url))) as {
  indexIds: string[]; captures: Array<{ sourceStoryId: string }>; absent: string[];
};

test.describe('L6 environment-visual', () => {
  test('live-subject rule rejects a capture absent from index.json (fixture manifest) @engine-chromium', () => {
    let err: unknown;
    try { assertLiveSources(LIVE_FIXTURE.captures, new Set(LIVE_FIXTURE.indexIds)); } catch (e) { err = e; }
    expect(err).toBeInstanceOf(LiveSubjectError);
    expect((err as LiveSubjectError).missing).toEqual(LIVE_FIXTURE.absent);
  });

  if ('pending' in loaded) {
    test('capture plan inputs @engine-chromium', () => { pendingOrFail(loaded.pending, loaded.producer); });
    return;
  }

  const shard = shardFromEnv(process.env);
  const entries = shard ? loaded.plan.entries.filter((e) => shardOf(e.id, shard.total) === shard.index) : loaded.plan.entries;
  writePlanEvidence(loaded, entries);

  test('every capture source is a story of this pipeline\'s index.json @engine-chromium', async () => {
    assertLiveSources(loaded.plan.entries, loaded.indexIds);
    // the served Storybook (AG_STORYBOOK_URL) is the same build as the artifact on disk
    const res = await fetch(`${STORYBOOK_URL.replace(/\/+$/, '')}/index.json`);
    expect(res.ok, `${STORYBOOK_URL}/index.json HTTP ${res.status}`).toBe(true);
    const served = (await res.json()) as { entries?: Record<string, { id: string; type: string }> };
    const servedIds = Object.values(served.entries ?? {}).filter((e) => e.type === 'story').map((e) => e.id).sort();
    expect(servedIds).toEqual([...loaded.indexIds].sort());
  });

  test('capture plan has no problems @engine-chromium', () => {
    const lines = [...loaded.loadErrors, ...loaded.plan.problems.map((p) => `[${p.owner}] ${p.storyId} (${p.subject}): ${p.code} — ${p.message}`)];
    expect(lines, 'capture-plan problems (owner-attributed)').toEqual([]);
  });

  test('sentinel set is present @engine-chromium', () => {
    if (loaded.plan.pendingSentinels.length) {
      pendingOrFail(`sentinel subject(s) not in the build: ${loaded.plan.pendingSentinels.map((s) => JSON.stringify(s)).join(', ')}`, 'MAT Surface / CMP Button, Dialog stories');
    }
  });

  test('capture tarball is recorded @engine-chromium', () => {
    const tarball = tarballPath();
    if (!tarball) pendingOrFail('no packed tarball (AURAGLASS_TARBALL or a single .artifacts/pack/*.tgz)', 'plat:package:pack / npm pack');
    expect(sha256File(tarball)).toMatch(/^[0-9a-f]{64}$/);
  });

  if (entries.length === 0) {
    test('capture matrix has subjects @engine-chromium', () => { pendingOrFail(`0 capture cells at scope ${SCOPE}`, 'stream stories with parameters.ag'); });
  }

  for (const entry of entries) {
    test(`${entry.id} @engine-${entry.cell.engine}`, async ({ browser }) => {
      test.setTimeout(TEST_TIMEOUT_MS);
      const t0 = Date.now();
      const force = forceFor(entry.cell);
      const context = await browser.newContext({
        ...force.context, colorScheme: force.media.colorScheme, reducedMotion: force.media.reducedMotion,
        forcedColors: force.media.forcedColors, contrast: force.media.contrast, baseURL: STORYBOOK_URL,
      });
      try {
        const page = await context.newPage();
        const consoleEvents = collectConsole(page); // REQ-QUAL-17: attached before the story loads
        await installDeterminism(page);
        await page.emulateMedia(force.media);
        await page.goto(storyUrl(STORYBOOK_URL, entry.sourceStoryId, entry.cell));
        await page.locator('[data-ag-story-content][data-ag-cert-ready]').waitFor({ state: 'attached', timeout: READY_TIMEOUT_MS });

        // REQ-QUAL-04: the live render is the planned story of this build
        const rendered = await page.evaluate(() => {
          const w = window as unknown as { __STORYBOOK_PREVIEW__?: { selectionStore?: { selection?: { storyId?: string } } } };
          return { id: w.__STORYBOOK_PREVIEW__?.selectionStore?.selection?.storyId ?? null,
            error: document.body.classList.contains('sb-show-errordisplay') || document.body.classList.contains('sb-show-nopreview') };
        });
        expect(rendered.error, `Storybook shows an error/no-preview for ${entry.sourceStoryId}`).toBe(false);
        expect(rendered.id, 'rendered story id').toBe(entry.sourceStoryId);

        // forced state reads back on <html> (never re-labelled)
        const html = await page.evaluate((keys) => Object.fromEntries(keys.map((k) => [k, document.documentElement.getAttribute(k)])), Object.keys(force.html));
        expect(html, `forced data-ag-* on <html> for ${entry.id}`).toEqual(force.html);

        await driveState(page, entry);
        await settle(page);

        expect(await paintingAncestors(page), 'REQ-QUAL-09: painting ancestors between <body> and [data-ag-story-content]').toEqual([]);
        const outside = await outsideDiffRatio(page, context);
        expect(outside.ratio, `REQ-QUAL-09: outside-subject pixels differing from the scene (${(outside.ratio * 100).toFixed(3)} % of ${outside.frame})`)
          .toBeLessThanOrEqual(OUTSIDE_PIXEL_MAX);

        // G-13: REQ-QUAL-13 OCR contrast, -14 glass over nothing, -15 pixel gates + layout, -17 labels, -18 containment,
        // targets (mobile cells) and focus (focus-visible cells). Measured on this live render only.
        const gates = await runCellGates(page, {
          cell: entry.cell, kind: entry.kind, focusDriven: (entry.drive ?? []).some((s) => s.action === 'focus'),
        });
        const consoleBad = consoleFailures(consoleEvents);

        recordCapture({
          id: entry.id, sourceStoryId: entry.sourceStoryId, renderedStoryId: rendered.id, subject: entry.subject, owner: entry.owner,
          set: entry.set, matrix: entry.matrix, state: entry.state, cell: entry.cell, labels: gates.labels, captures: 2,
          outsideDiffRatio: outside.ratio, gates: gates.results, ocr: gates.ocr && { status: gates.ocr.status, worst: gates.ocr.worst, words: gates.ocr.subjectWords, textRuns: gates.ocr.visibleTextRuns },
          tesseract: gates.tesseract, console: consoleEvents, durationMs: Date.now() - t0,
        });
        expect(failures(gates.results), `L6 gates for ${entry.id}`).toEqual([]);
        expect(consoleBad, `REQ-QUAL-17 console for ${entry.id}`).toEqual([]);
        const pendingGates = gates.results.filter((r) => r.status === 'pending');
        if (pendingGates.length) pendingOrFail(pendingGates.map((r) => `${r.gate}: ${r.detail}`).join(' | '), 'see gate detail');
      } finally {
        await context.close();
      }
    });
  }
});

// ---- G-13 suites outside the per-cell loop ----------------------------------------------------------------------------
/** Opens a story in a fresh context forced to `cell`, optionally at another viewport (768×1024 layout pass). */
async function openStory(browser: import('@playwright/test').Browser, storyId: string, cell: Cell, viewport?: { width: number; height: number }) {
  const force = forceFor(cell);
  const context = await browser.newContext({
    ...force.context, ...(viewport ? { viewport, deviceScaleFactor: 1, hasTouch: false, isMobile: false } : {}),
    colorScheme: force.media.colorScheme, reducedMotion: force.media.reducedMotion, forcedColors: force.media.forcedColors,
    contrast: force.media.contrast, baseURL: STORYBOOK_URL,
  });
  const page = await context.newPage();
  const consoleEvents = collectConsole(page);
  await installDeterminism(page);
  await page.emulateMedia(force.media);
  await page.goto(storyUrl(STORYBOOK_URL, storyId, cell));
  await page.locator('[data-ag-story-content][data-ag-cert-ready]').waitFor({ state: 'attached', timeout: READY_TIMEOUT_MS });
  await settleGates(page);
  return { context, page, consoleEvents };
}

const DEFAULT_CELL = (engine: Cell['engine'], scene: Cell['scene'], viewport: Cell['viewport'] = '1440'): Cell =>
  ({ engine, scene, scheme: 'light', transparency: 'glass', preference: 'default', tier: 'standard', viewport });

test.describe('L6 G-13 suites', () => {
  if ('pending' in loaded) {
    test('G-13 suite inputs @engine-chromium', () => { pendingOrFail(loaded.pending, loaded.producer); });
    return;
  }
  const shard = shardFromEnv(process.env);
  const inShard = (key: string) => !shard || shardOf(key, shard.total) === shard.index;

  // REQ-QUAL-14: standard-tier glass cells, flat-white vs flat-black, per story-state × engine × scheme present in the plan
  const pairs = new Map<string, { white?: PlanEntry; black?: PlanEntry }>();
  for (const e of loaded.plan.entries) {
    const c = e.cell;
    if (c.transparency !== 'glass' || c.tier !== 'standard' || c.preference !== 'default' || c.viewport !== '1440') continue;
    if (c.scene !== 'flat-white' && c.scene !== 'flat-black') continue;
    const key = `${e.sourceStoryId}|${e.state}|${c.engine}|${c.scheme}`;
    const p = pairs.get(key) ?? {};
    if (c.scene === 'flat-white') p.white = e; else p.black = e;
    pairs.set(key, p);
  }
  for (const [key, p] of pairs) {
    if (!p.white || !p.black || !inShard(`wb|${key}`)) continue;
    const { white, black } = p;
    test(`REQ-QUAL-14 flat-white vs flat-black ${key} @engine-${white.cell.engine}`, async ({ browser }) => {
      test.setTimeout(TEST_TIMEOUT_MS);
      const w = await openStory(browser, white.sourceStoryId, white.cell);
      const b = await openStory(browser, black.sourceStoryId, black.cell);
      try {
        await driveState(w.page, white); await settleGates(w.page);
        await driveState(b.page, black); await settleGates(b.page);
        const results = await whiteBlackGates(w.page, b.page);
        recordCapture({ id: `wb|${key}`, sourceStoryId: white.sourceStoryId, subject: white.subject, owner: white.owner, gates: results });
        expect(failures(results), `REQ-QUAL-14 white/black interior for ${key}`).toEqual([]);
        const pending = results.filter((r) => r.status === 'pending');
        if (pending.length) pendingOrFail(pending.map((r) => r.detail).join(' | '), 'MAT dist/tokens/manifest.json glass-material floorAlpha');
      } finally {
        await w.context.close(); await b.context.close();
      }
    });
  }

  // REQ-QUAL-18: product scenes (showcases) also run at 768×1024, layout gates only
  const product = [...new Map(loaded.plan.entries.filter((e) => e.kind === 'showcase').map((e) => [e.sourceStoryId, e])).values()];
  for (const e of product) {
    if (!inShard(`768|${e.sourceStoryId}`)) continue;
    test(`REQ-QUAL-18 768×1024 layout ${e.sourceStoryId} @engine-chromium`, async ({ browser }) => {
      test.setTimeout(TEST_TIMEOUT_MS);
      const o = await openStory(browser, e.sourceStoryId, DEFAULT_CELL('chromium', 'photo'), THRESHOLDS.layout.productViewport);
      try {
        const issues = analyseLayout(await o.page.evaluate(collectLayoutSnapshot, STORY_ROOT));
        const m = await o.page.evaluate(measureContainment, STORY_ROOT);
        await o.page.evaluate(restoreAncestorOverflow);
        const results: GateResult[] = [containment(m, THRESHOLDS.layout),
          { gate: 'layout', status: issues.length ? 'fail' : 'pass', detail: issues.map((i) => `${i.type}: ${i.detail}`).join('; ') || 'clean' }];
        recordCapture({ id: `768|${e.sourceStoryId}`, sourceStoryId: e.sourceStoryId, subject: e.subject, owner: e.owner, gates: results });
        expect(failures(results), `REQ-QUAL-18 768×1024 layout for ${e.sourceStoryId}`).toEqual([]);
      } finally {
        await o.context.close();
      }
    });
  }

  // Negative fixtures (stories/qual/fixtures/PixelGates.stories.tsx): each gate must report its fixture.
  const FIXTURE = (name: string) => `qual-fixtures-pixel-gates--${name}`;
  const needFixture = (id: string): void => {
    if (!loaded.indexIds.has(id)) pendingOrFail(`fixture story ${id} is not in this pipeline's index.json`, 'stories/qual/fixtures/PixelGates.stories.tsx in qual:build:storybook');
  };

  test('REQ-QUAL-18 containment fails on the overflowing fixture @engine-chromium', async ({ browser }) => {
    needFixture(FIXTURE('overflowing'));
    const o = await openStory(browser, FIXTURE('overflowing'), DEFAULT_CELL('chromium', 'flat-white', '390'));
    try {
      const m = await o.page.evaluate(measureContainment, STORY_ROOT);
      await settleGates(o.page);
      expect(containment(m, THRESHOLDS.layout).status).toBe('fail');
      await o.page.evaluate(restoreAncestorOverflow);
    } finally { await o.context.close(); }
  });

  test('REQ-QUAL-18 target size fails on the 20 px target fixture @engine-chromium', async ({ browser }) => {
    needFixture(FIXTURE('small-target'));
    const o = await openStory(browser, FIXTURE('small-target'), DEFAULT_CELL('chromium', 'flat-white', '390'));
    try {
      const r = targetSizes(await o.page.evaluate(collectTargets, STORY_ROOT), THRESHOLDS.layout);
      expect(r.status).toBe('fail');
      expect(r.detail).toMatch(/20(\.0)?×20(\.0)? < 44×44/);
    } finally { await o.context.close(); }
  });

  for (const scene of ['flat-white', 'photo'] as const) {
    test(`REQ-QUAL-18 focus indicator fails on the low-contrast ring fixture (${scene}) @engine-chromium`, async ({ browser }) => {
      needFixture(FIXTURE('low-contrast-ring'));
      const o = await openStory(browser, FIXTURE('low-contrast-ring'), DEFAULT_CELL('chromium', scene));
      try {
        await o.page.keyboard.press('Shift');
        await o.page.locator('[data-ag-story-content] [data-ag-part="trigger"]').focus();
        await settleGates(o.page);
        const dpr = await o.page.evaluate(() => window.devicePixelRatio);
        const r = await focusGate(o.page, dpr);
        expect(r.gate).toBe('focus-indicator');
        expect(r.status, r.detail).toBe('fail');
      } finally { await o.context.close(); }
    });
  }

  test('REQ-QUAL-13 OCR contrast fails on the 4.1 App Shell ink fixture @engine-chromium', async ({ browser }) => {
    needFixture(FIXTURE('low-contrast-text'));
    const tess = tesseractInfo();
    if ('error' in tess) pendingOrFail(tess.error, 'FIN-B AG_PLAYWRIGHT_IMAGE with tesseract 5');
    const o = await openStory(browser, FIXTURE('low-contrast-text'), DEFAULT_CELL('chromium', 'flat-white'));
    try {
      const shot = await captureRgba(o.page);
      const runs = await o.page.evaluate(collectTextRuns, STORY_ROOT);
      const twin = await captureWith(o.page, twinCss(STORY_ROOT));
      const v = evaluateOcr({ capture: shot, twin, words: ocr(shot, { psm: THRESHOLDS.ocr.psm, upscale: THRESHOLDS.ocr.upscale }).words, runs, dpr: 1, contrastMore: false, thresholds: THRESHOLDS.ocr });
      expect(runs.length).toBeGreaterThan(0);
      expect(v.status, v.detail).toBe('fail');
    } finally { await o.context.close(); }
  });

  test('REQ-QUAL-14 glass-over-nothing fails on the opaque-stage fixture @engine-chromium', async ({ browser }) => {
    needFixture(FIXTURE('opaque-stage'));
    const o = await openStory(browser, FIXTURE('opaque-stage'), DEFAULT_CELL('chromium', 'photo'));
    try {
      const surfaces = await o.page.evaluate(markPresenceSurfaces, STORY_ROOT);
      expect(surfaces.length, 'the fixture renders one regular Surface').toBeGreaterThan(0);
      const hidden = await captureWith(o.page, `[data-qa-surface="${surfaces[0]!.index}"] { visibility: hidden !important; }`);
      const r = glassOverNothing(hidden, toDeviceRect(surfaces[0]!.rect, 1), sceneSigma('photo'), THRESHOLDS.materialPresence);
      if (r.status === 'pending') pendingOrFail(r.detail, 'G-11 scenes.manifest.json');
      expect(r.status, r.detail).toBe('fail');
    } finally { await o.context.close(); }
  });

});
