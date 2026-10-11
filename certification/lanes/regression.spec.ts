/* G-14 / REQ-QUAL-24, -25, -26 — L7 pixel regression and the S-55 visual-class rows (FIN-432, FIN-433, REQ-FIN-103).

   Subjects: this pipeline's Storybook build (storybook-static/index.json + cert-manifest.json, AG_STORYBOOK_STATIC), rendered
   live from AG_STORYBOOK_URL in cert mode. pr = affected subjects (AG_AFFECTED_SUBJECTS) + the sentinel set
   (certification/matrix.config.ts); main / nightly / release = every subject. Each subject-state gets the ten L7 configs
   (packages/qa/src/evidence/regression.ts) and one test per config, titled `@engine-<engine>` so the engine projects of
   certification/playwright.cert.config.ts select their own cells (no skipped tests).

   Per test:
   1. element-cropped `toHaveScreenshot` (animations disabled, caret hidden, threshold 0.1, maxDiffPixelRatio 0.002,
      maxDiffPixels floor 20 below 10,000 px²) against certification/baselines/linux/<engine>/<subject>/<file>.png;
      a diff copies base | head | diff into the lane evidence and fails with `l7-changed:`; a missing baseline fails with
      `l7-no-baseline:`. certification/run.mjs turns those into the REQ-QUAL-25 branch verdict (non-QUAL PR: pending, exit 0;
      baselines PR: L14 record per changed subject-state; release: fail). Nightly repeats the comparison (×2 flake check).
   2. REQ-QUAL-26: the same crop rendered from the merge-base Storybook (AG_STORYBOOK_BASE_URL, prepared by
      scripts/qual/l7-base.mjs → AG_L7_BASE) is compared with pixelmatch at VISUAL_TOLERANCE; the row goes to
      regression/visual-class-<pid>.jsonl and run.mjs writes .artifacts/qual/visual-class.json (REPORTS.visualClass).

   Baselines are never written here: the config sets updateSnapshots 'none'; only qual:certify:baseline-refresh
   (scripts/qual/baseline-refresh.mjs, AG_BASELINE_ROOT = candidate dir, --update-snapshots all) produces candidates.
   Browser lane: GitLab CI / gated remote runner only. */
import { appendFileSync, copyFileSync, existsSync, globSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';
import { test, expect, installDeterminism } from './_fixtures/determinism';
import { captureTarget, driveState, settle, STORY_CONTENT, subjectTarget, type DriveStep, type SubjectTarget } from './_fixtures/capture';
import { readCsfParameters, storyAg } from '../../packages/qa/src/resolve/csf.ts';
import { parseSubjectIndex } from '../../packages/qa/src/resolve/resolveSubject.ts';
import { forceFor, storyUrl } from '../../packages/qa/src/matrix/force';
import { shardFromEnv, shardOf } from '../../packages/qa/src/matrix/shard';
import {
  BASELINE_PLATFORM, BASELINE_ROOT, buildRegressionPlan, screenshotOptions, snapshotName,
  type CellOutcome, type LaneScope, type RegressionEntry, type RegressionPlan,
} from '../../packages/qa/src/evidence/regression';
import { absentAtBase, cellRow, compareRgba, isVisualClassCell } from '../../packages/qa/src/evidence/visualClass';
import { decodePng } from '../../packages/qa/src/pixel/png';
import { SENTINELS } from '../matrix.config';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SCOPE = (process.env.AG_SCOPE ?? 'pr') as LaneScope;
const STORYBOOK_URL = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const BASE_URL = process.env.AG_STORYBOOK_BASE_URL ?? null;
const STATIC_DIR = process.env.AG_STORYBOOK_STATIC ?? join(ROOT, 'storybook-static');
const BASELINE_DIR = join(ROOT, process.env.AG_BASELINE_ROOT ?? BASELINE_ROOT);
const EVIDENCE_DIR = join(process.env.AG_LANE_EVIDENCE_DIR
  ?? join(ROOT, process.env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG || 'qual-certify-l7'), 'regression');
const READY_TIMEOUT_MS = 30_000;
const TEST_TIMEOUT_MS = 90_000;

class AgPendingProducer extends Error {
  constructor(message: string) { super(message); this.name = 'AgPendingProducer'; }
}
function pendingOrFail(reason: string, producer: string): never {
  if (SCOPE === 'release') throw new Error(`release scope: ${reason} (producer: ${producer})`);
  throw new AgPendingProducer(`pending: ${reason} (producer: ${producer})`);
}

const readJson = (file: string): unknown => JSON.parse(readFileSync(file, 'utf8'));

function affectedSubjects(): Set<string> | null {
  const v = process.env.AG_AFFECTED_SUBJECTS;
  if (!v) return null;
  const list = existsSync(v) ? readJson(v) : v.split(',').map((s) => s.trim()).filter(Boolean);
  if (!Array.isArray(list) || !list.every((s) => typeof s === 'string')) throw new Error('AG_AFFECTED_SUBJECTS must name a JSON string array or a comma list');
  return new Set(list as string[]);
}

interface IndexEntry { id: string; type: string; importPath: string; exportName?: string }

interface Loaded { plan: RegressionPlan; loadErrors: string[] }

function load(): Loaded | { pending: string; producer: string } {
  const indexFile = join(STATIC_DIR, 'index.json');
  const manifestFile = join(STATIC_DIR, 'cert-manifest.json');
  if (!existsSync(indexFile)) return { pending: `${indexFile} not found — the lane needs this pipeline's qual:build:storybook artifact`, producer: 'qual:build:storybook (G-08)' };
  if (!existsSync(manifestFile)) return { pending: `${manifestFile} not found`, producer: 'write-cert-manifest (G-01)' };
  const entries = Object.values((readJson(indexFile) as { entries?: Record<string, IndexEntry> }).entries ?? {}).filter((e) => e.type === 'story');
  const byId = new Map(entries.map((e) => [e.id, e]));
  const subjects = parseSubjectIndex(readJson(manifestFile), manifestFile);
  const loadErrors: string[] = [];
  const states = new Map<string, Array<{ name: string; drive?: DriveStep[] }> | undefined>();
  const csfCache = new Map<string, ReturnType<typeof readCsfParameters>>();
  for (const s of subjects.stories) {
    const e = byId.get(s.id);
    if (!e) continue; // reported by the plan as `live-subject`
    try {
      if (!e.exportName) throw new Error(`index-entry: ${s.id} has no exportName in index.json`);
      const file = e.importPath.replace(/^\.\//, '');
      let csf = csfCache.get(file);
      if (!csf) { csf = readCsfParameters(file, readFileSync(join(ROOT, file), 'utf8')); csfCache.set(file, csf); }
      const ag = storyAg(csf, e.exportName) as { states?: Array<{ name: string; drive?: DriveStep[] }> } | undefined;
      states.set(s.id, ag?.states);
    } catch (err) {
      loadErrors.push(`${s.id}: ${(err as Error).message}`);
    }
  }
  const plan = buildRegressionPlan({ scope: SCOPE, indexIds: new Set(byId.keys()), stories: subjects.stories, states, affected: affectedSubjects(), sentinels: SENTINELS });
  return { plan, loadErrors };
}

/** Merge-base build prepared by scripts/qual/l7-base.mjs: { sha, storybookStatic } or { sha, error }. */
interface BaseInfo { sha: string | null; storybookStatic?: string; error?: string }
function baseInfo(): BaseInfo | null {
  const f = process.env.AG_L7_BASE;
  return f && existsSync(f) ? (readJson(f) as BaseInfo) : null;
}

function writeAtomic(file: string, body: unknown): void {
  mkdirSync(join(file, '..'), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(body, null, 2)}\n`);
  renameSync(tmp, file);
}

function append(file: string, row: unknown): void {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  appendFileSync(join(EVIDENCE_DIR, file), `${JSON.stringify(row)}\n`);
}

const slug = (id: string) => id.replace(/[^A-Za-z0-9._-]+/g, '_');

async function openStory(page: Page, baseUrl: string, entry: RegressionEntry): Promise<SubjectTarget> {
  const force = forceFor(entry.cell);
  await installDeterminism(page);
  await page.emulateMedia(force.media);
  await page.goto(storyUrl(baseUrl, entry.storyId, entry.cell));
  await page.locator(`${STORY_CONTENT}[data-ag-cert-ready]`).waitFor({ state: 'attached', timeout: READY_TIMEOUT_MS });
  const html = await page.evaluate((keys) => Object.fromEntries(keys.map((k) => [k, document.documentElement.getAttribute(k)])), Object.keys(force.html));
  expect(html, `forced data-ag-* on <html> for ${entry.id} (${baseUrl})`).toEqual(force.html);
  await driveState(page, entry.storyId, entry.state, entry.drive as DriveStep[] | undefined);
  await settle(page);
  return subjectTarget(page);
}

const loaded = load();
const base = baseInfo();
let baseIndex: Set<string> | null = null;
if (base?.storybookStatic && existsSync(join(base.storybookStatic, 'index.json'))) {
  baseIndex = new Set(Object.values((readJson(join(base.storybookStatic, 'index.json')) as { entries?: Record<string, IndexEntry> }).entries ?? {})
    .filter((e) => e.type === 'story').map((e) => e.id));
}

test.describe('L7 regression', () => {
  if ('pending' in loaded) {
    test('regression plan inputs @engine-chromium', () => { pendingOrFail(loaded.pending, loaded.producer); });
    return;
  }
  const shard = shardFromEnv(process.env);
  const entries = shard ? loaded.plan.entries.filter((e) => shardOf(e.id, shard.total) === shard.index) : loaded.plan.entries;
  writeAtomic(join(EVIDENCE_DIR, 'plan.json'), {
    version: 1, lane: 'L7', scope: SCOPE, sha: process.env.CI_COMMIT_SHA ?? null, storybookUrl: STORYBOOK_URL,
    base: base ? { sha: base.sha, url: BASE_URL, error: base.error ?? null } : null, shard, cellsTotal: loaded.plan.entries.length,
    cells: entries.map((e) => e.id), visualClassCells: entries.filter((e) => isVisualClassCell(e.id)).map((e) => e.id),
    problems: loaded.plan.problems, loadErrors: loaded.loadErrors, pendingSentinels: loaded.plan.pendingSentinels,
  });

  test('regression plan has no problems @engine-chromium', () => {
    const lines = [...loaded.loadErrors, ...loaded.plan.problems.map((p) => `[${p.owner}] ${p.storyId}: ${p.code} — ${p.message}`)];
    expect(lines, 'regression-plan problems (owner-attributed)').toEqual([]);
  });

  test('sentinel set is present @engine-chromium', () => {
    if (loaded.plan.pendingSentinels.length) {
      pendingOrFail(`sentinel subject(s) not in the build: ${loaded.plan.pendingSentinels.map((s) => JSON.stringify(s)).join(', ')}`, 'MAT Surface / CMP Button, Dialog stories');
    }
  });

  test('merge-base Storybook for the visual-class report @engine-chromium', () => {
    if (!base) pendingOrFail('AG_L7_BASE not set — scripts/qual/l7-base.mjs did not run', 'qual:certify:l7 job');
    if (base.error || !base.storybookStatic || !baseIndex) pendingOrFail(`merge-base ${base.sha ?? '?'} Storybook unavailable: ${base.error ?? 'no index.json'}`, 'merge-base qual Storybook build');
    if (!BASE_URL) pendingOrFail('AG_STORYBOOK_BASE_URL not set', 'qual:certify:l7 job');
    expect(base.sha).toMatch(/^[0-9a-f]{40}$/);
  });

  if (entries.length === 0) {
    test('regression matrix has subjects @engine-chromium', () => { pendingOrFail(`0 regression cells at scope ${SCOPE}`, 'stream stories with parameters.ag'); });
  }

  for (const entry of entries) {
    test(`${entry.id} @engine-${entry.config.engine}`, async ({ browser }, testInfo) => {
      test.setTimeout(TEST_TIMEOUT_MS);
      const force = forceFor(entry.cell);
      const context = await browser.newContext({
        ...force.context, colorScheme: force.media.colorScheme, reducedMotion: force.media.reducedMotion,
        forcedColors: force.media.forcedColors, contrast: force.media.contrast,
      });
      try {
        const page = await context.newPage();
        const target = await openStory(page, STORYBOOK_URL, entry);
        const head = await captureTarget(page, target);

        // ---- REQ-QUAL-26: merge-base vs head, element-cropped, VISUAL_TOLERANCE
        if (isVisualClassCell(entry.id) && base?.storybookStatic && baseIndex && BASE_URL && !base.error) {
          if (!baseIndex.has(entry.storyId)) append(`visual-class-${process.pid}.jsonl`, absentAtBase(entry.id));
          else {
            const basePage = await context.newPage();
            try {
              const baseTarget = await openStory(basePage, BASE_URL, entry);
              const basePng = await captureTarget(basePage, baseTarget);
              append(`visual-class-${process.pid}.jsonl`, cellRow(entry.id, compareRgba(decodePng(basePng), decodePng(head))));
            } catch (e) {
              // The merge-base render is an input of the visual-class report, not of this regression cell: a base that
              // cannot render the story in cert mode leaves the cell without a row, and run.mjs then writes no report
              // (pending below release, fail at release) naming this error.
              append(`vc-errors-${process.pid}.jsonl`, { cell: entry.id, error: (e as Error).message.split('\n')[0] });
            } finally {
              await basePage.close();
            }
          }
        }

        // ---- REQ-QUAL-24/-25: committed baseline
        const name = snapshotName(entry.subject, entry.state, entry.config);
        const baselineFile = join(BASELINE_DIR, BASELINE_PLATFORM, entry.config.engine, ...name);
        const refreshing = testInfo.config.updateSnapshots === 'all';
        const record = (outcome: CellOutcome, extra: Record<string, unknown> = {}) => append(`cells-${process.pid}.jsonl`, {
          id: entry.id, subject: entry.subject, owner: entry.owner, state: entry.state, storyId: entry.storyId, config: entry.config, outcome, ...extra,
        });
        if (!refreshing && !existsSync(baselineFile)) {
          const dir = join(EVIDENCE_DIR, 'no-baseline', slug(entry.id));
          mkdirSync(dir, { recursive: true });
          writeFileSync(join(dir, 'head.png'), head);
          record('no-baseline', { head: join(dir, 'head.png').slice(ROOT.length) });
          throw new Error(`l7-no-baseline: ${entry.id} has no ${baselineFile.slice(ROOT.length)}`);
        }
        const opts = screenshotOptions(target.areaPx2);
        const compare = async () => (target.kind === 'locator'
          ? expect(target.locator).toHaveScreenshot(name, opts)
          : expect(page).toHaveScreenshot(name, { ...opts, clip: target.clip }));
        try {
          await compare();
          // nightly: ×2 flake check — a second comparison must agree with the first
          if (SCOPE === 'nightly' && !refreshing) {
            try { await compare(); } catch (e) {
              throw new Error(`l7-flaky: ${entry.id} matched the baseline once and differed on the repeat: ${(e as Error).message.split('\n')[0]}`);
            }
          }
        } catch (e) {
          const msg = (e as Error).message;
          // only a pixel/size difference is a regression diff; anything else (unstable capture, timeout) is a real failure
          if (msg.startsWith('l7-flaky:') || !/are different|Expected an image .* received/.test(msg)) throw e;
          // Playwright leaves <name>-expected / -actual / -diff PNGs in the test output dir: keep them as base | head | diff.
          const dir = join(EVIDENCE_DIR, 'changed', slug(entry.id));
          mkdirSync(dir, { recursive: true });
          const images: Record<string, string> = {};
          for (const f of globSync('**/*.png', { cwd: testInfo.outputDir })) {
            const kind = /-(expected|actual|diff)\.png$/.exec(f)?.[1];
            if (!kind) continue;
            const as = { expected: 'base.png', actual: 'head.png', diff: 'diff.png' }[kind]!;
            copyFileSync(join(testInfo.outputDir, f), join(dir, as));
            images[kind === 'expected' ? 'base' : kind === 'actual' ? 'head' : 'diff'] = join(dir, as).slice(ROOT.length);
          }
          if (!images.head) { writeFileSync(join(dir, 'head.png'), head); images.head = join(dir, 'head.png').slice(ROOT.length); }
          record('changed', { images, message: msg.split('\n')[0] });
          throw new Error(`l7-changed: ${entry.id} differs from ${baselineFile.slice(ROOT.length)} (${basename(dir)}): ${msg.split('\n')[0]}`);
        }
        record('match');
      } finally {
        await context.close();
      }
    });
  }
});
