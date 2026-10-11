/* REQ-QUAL-24 / REQ-QUAL-25 (QUAL, FIN-432). L7 pixel regression: the ten capture configs per subject-state, the baseline
   path layout, the toHaveScreenshot options, the L7 plan and the per-branch outcome policy.

   Baselines: certification/baselines/linux/<engine>/<subject>/<state>__<scene>__<scheme>__<viewport>.png, produced only by
   `qual:certify:baseline-refresh` in AG_PLAYWRIGHT_IMAGE and committed through a reviewed `next-qual/baselines-<yyyymmdd>`
   PR with an L14 record per changed subject-state. Every L7 config is a default-preference cell (glass / default / standard),
   so the same captures feed the S-55 visual-class report (visualClass.ts). */
import type { StoryStateDrive } from '../../../../src/contracts/testing';
import { BASE_STATE, cellId, DEFAULTS, VIEWPORTS, type Cell, type MatrixEngine, type MatrixScheme, type ViewportId } from '../matrix/axes';

export interface RegressionConfig { engine: MatrixEngine; scene: 'photo' | 'flat-white'; scheme: MatrixScheme; viewport: ViewportId }

/** REQ-QUAL-24: chromium + webkit × {photo, flat-white} × {light, dark} @1440, chromium photo light @390, firefox photo light @1440. */
export const REGRESSION_CONFIGS: readonly RegressionConfig[] = Object.freeze([
  ...(['chromium', 'webkit'] as const).flatMap((engine) => (['photo', 'flat-white'] as const).flatMap((scene) =>
    (['light', 'dark'] as const).map((scheme): RegressionConfig => ({ engine, scene, scheme, viewport: '1440' })))),
  { engine: 'chromium', scene: 'photo', scheme: 'light', viewport: '390' },
  { engine: 'firefox', scene: 'photo', scheme: 'light', viewport: '1440' },
]);

export function configCell(cfg: RegressionConfig): Cell {
  return { engine: cfg.engine, scene: cfg.scene, scheme: cfg.scheme, viewport: cfg.viewport, ...DEFAULTS };
}

/** Playwright `toHaveScreenshot` comparison (REQ-QUAL-24). */
export const SCREENSHOT_TOLERANCE = { threshold: 0.1, maxDiffPixelRatio: 0.002 } as const;
/** Element area (CSS px²) below which `maxDiffPixels` is floored at 20 (0.002 × 10,000 = 20 at the boundary). */
export const SMALL_AREA_PX2 = 10_000;
export const MAX_DIFF_PIXELS_FLOOR = 20;

export interface ScreenshotOptions { threshold: number; maxDiffPixelRatio: number; maxDiffPixels?: number; animations: 'disabled'; caret: 'hide'; scale: 'device' }

export function screenshotOptions(areaPx2: number): ScreenshotOptions {
  if (!(areaPx2 > 0)) throw new Error(`regression: subject area must be > 0 (got ${areaPx2})`);
  const base = { ...SCREENSHOT_TOLERANCE, animations: 'disabled', caret: 'hide', scale: 'device' } as const;
  return areaPx2 < SMALL_AREA_PX2 ? { ...base, maxDiffPixels: MAX_DIFF_PIXELS_FLOOR } : { ...base };
}

/** Pixels allowed to differ for a capture of `pixels` device pixels (Playwright takes the larger of both limits). */
export function allowedDiffPixels(pixels: number, areaPx2: number): number {
  const o = screenshotOptions(areaPx2);
  return Math.max(o.maxDiffPixels ?? 0, Math.floor(o.maxDiffPixelRatio * pixels));
}

export const BASELINE_ROOT = 'certification/baselines';
/** The only platform directory a committed baseline may live in (AG_PLAYWRIGHT_IMAGE is Linux). */
export const BASELINE_PLATFORM = 'linux';

const SEGMENT_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/** Snapshot name passed to toHaveScreenshot: [<subject>, <state>__<scene>__<scheme>__<viewport>.png]. */
export function snapshotName(subject: string, state: string, cfg: RegressionConfig): [string, string] {
  if (!SEGMENT_RE.test(subject)) throw new Error(`regression: subject '${subject}' is not a path-safe name`);
  if (!SEGMENT_RE.test(state)) throw new Error(`regression: state '${state}' is not a path-safe name`);
  return [subject, `${state}__${cfg.scene}__${cfg.scheme}__${cfg.viewport}.png`];
}

/** Playwright snapshotPathTemplate for the lane projects (project name = engine). `root` is relative to the config dir. */
export function snapshotPathTemplate(root: string): string {
  return `${root.replace(/\/+$/, '')}/{platform}/{projectName}/{arg}{ext}`;
}

/** Repository-relative baseline path; equals the template expansion on Linux. */
export function baselinePath(subject: string, state: string, cfg: RegressionConfig, root = BASELINE_ROOT, platform = BASELINE_PLATFORM): string {
  const [dir, file] = snapshotName(subject, state, cfg);
  return `${root}/${platform}/${cfg.engine}/${dir}/${file}`;
}

/** Inverse of baselinePath for a path relative to the baseline root (`linux/<engine>/<subject>/<file>`); null if malformed. */
export function parseBaselinePath(rel: string): { platform: string; subject: string; state: string; cfg: RegressionConfig } | null {
  const m = /^([^/]+)\/(chromium|webkit|firefox)\/([^/]+)\/([^/]+)__(photo|flat-white)__(light|dark)__(1440|390)\.png$/.exec(rel);
  if (!m) return null;
  const [, platform, engine, subject, state, scene, scheme, viewport] = m as unknown as [string, string, MatrixEngine, string, string, RegressionConfig['scene'], MatrixScheme, ViewportId];
  const cfg: RegressionConfig = { engine, scene, scheme, viewport };
  if (!REGRESSION_CONFIGS.some((c) => c.engine === engine && c.scene === scene && c.scheme === scheme && c.viewport === viewport)) return null;
  if (!SEGMENT_RE.test(subject) || !SEGMENT_RE.test(state)) return null;
  return { platform, subject, state, cfg };
}

export { VIEWPORTS };

// ---- plan ---------------------------------------------------------------------------------------------------------
export type LaneScope = 'pr' | 'main' | 'nightly' | 'release';
/** Story kinds with L7 baselines (the L6 capture subjects; lab and scene stories are not regression subjects). */
export const L7_KINDS = ['component', 'matrix', 'showcase'] as const;

export interface RegressionStory { id: string; subject: string; kind: string; tags: readonly string[]; owner: string }
export interface RegressionSentinel { subject: string; story?: string; state?: string }

export interface RegressionEntry {
  /** S-55 cell id `<storyId>|<scene>|<engine>|<axes>` */
  id: string;
  storyId: string;
  subject: string;
  owner: string;
  state: string;
  drive: StoryStateDrive['drive'];
  config: RegressionConfig;
  cell: Cell;
}

export interface RegressionPlan { entries: RegressionEntry[]; problems: Array<{ storyId: string; owner: string; code: string; message: string }>; pendingSentinels: RegressionSentinel[] }

export interface RegressionPlanInput {
  scope: LaneScope;
  indexIds: ReadonlySet<string>;
  stories: readonly RegressionStory[];
  states: ReadonlyMap<string, readonly StoryStateDrive[] | undefined>;
  /** null = every subject */
  affected: ReadonlySet<string> | null;
  sentinels: readonly RegressionSentinel[];
}

function sentinelHit(s: RegressionSentinel, story: RegressionStory, state: string): boolean {
  return s.subject === story.subject && (!s.story || story.id.endsWith(`--${s.story}`)) && (!s.state || s.state === state);
}

/** pr: affected subjects + the sentinel set; main / nightly / release: every subject. Each subject-state gets the ten configs. */
export function buildRegressionPlan(input: RegressionPlanInput): RegressionPlan {
  const entries: RegressionEntry[] = [];
  const problems: RegressionPlan['problems'] = [];
  const hit = new Set<RegressionSentinel>();
  const stories = input.stories.filter((s) => (L7_KINDS as readonly string[]).includes(s.kind) && !s.tags.includes('no-cert'))
    .slice().sort((a, b) => a.id.localeCompare(b.id));
  for (const story of stories) {
    if (!input.indexIds.has(story.id)) {
      problems.push({ storyId: story.id, owner: story.owner, code: 'live-subject', message: `${story.id} is in cert-manifest.json but not in this pipeline's index.json` });
      continue;
    }
    const states: Array<{ name: string; drive: StoryStateDrive['drive'] }> = [{ name: BASE_STATE, drive: undefined }];
    let bad = false;
    for (const s of input.states.get(story.id) ?? []) {
      if (!s?.name || states.some((x) => x.name === s.name)) {
        problems.push({ storyId: story.id, owner: story.owner, code: 'invalid-state', message: `${story.id}: state '${s?.name}' is missing a name, duplicated or reserved` });
        bad = true;
        break;
      }
      states.push({ name: s.name, drive: s.drive });
    }
    if (bad) continue;
    const affected = input.affected === null || input.affected.has(story.subject);
    for (const st of states) {
      if (input.scope === 'pr') {
        const sentinels = input.sentinels.filter((s) => sentinelHit(s, story, st.name));
        sentinels.forEach((s) => hit.add(s));
        if (!affected && sentinels.length === 0) continue;
      }
      for (const config of REGRESSION_CONFIGS) {
        const cell = configCell(config);
        entries.push({ id: cellId(story.id, cell, st.name), storyId: story.id, subject: story.subject, owner: story.owner, state: st.name, drive: st.drive, config, cell });
      }
    }
  }
  return { entries, problems, pendingSentinels: input.scope === 'pr' ? input.sentinels.filter((s) => !hit.has(s)) : [] };
}

// ---- outcome policy (REQ-QUAL-25) ------------------------------------------------------------------------------------
/** Per-cell comparison result written by certification/lanes/regression.spec.ts. */
export type CellOutcome = 'match' | 'changed' | 'no-baseline';

export const BASELINES_BRANCH_RE = /^next-qual\/baselines-(\d{8})$/;
/** QUAL-owned PR branches: next-qual/* and the FIN-G branches next-fin/g-* (certification/run.mjs branchStream). */
export function isQualBranch(branch: string | null | undefined): boolean {
  return !!branch && (/^(next|4x|4x11)-qual\//.test(branch) || /^(next|4x|4x11)-fin\/g-/.test(branch));
}

export interface L7PolicyInput {
  scope: LaneScope;
  branch: string | null;
  cells: ReadonlyArray<{ id: string; subject: string; state: string; outcome: CellOutcome }>;
  /** subject-states (`<subject>/<state>`) with a passing L14 record (REQ-QUAL-73) */
  l14: ReadonlySet<string>;
}

export interface L7Verdict { state: 'pass' | 'pending' | 'fail'; reason?: string; changed: string[]; noBaseline: string[]; missingL14: string[] }

/**
 * - no changed / no-baseline cell → pass;
 * - release scope: any changed or no-baseline cell → fail (G-01: changed/pending is not pass);
 * - `next-qual/baselines-<yyyymmdd>`: every changed subject-state needs a passing L14 record, else fail; recorded → pass;
 * - any other QUAL branch: a diff fails (QUAL changes baselines only through a baselines PR);
 * - every other branch, and main / nightly: never blocks — the cells are `changed`, the subject-states `pending`.
 * A cell without a committed baseline is pending below release (bootstrap, REQ-QUAL-25).
 */
export function l7Verdict(input: L7PolicyInput): L7Verdict {
  const changed = input.cells.filter((c) => c.outcome === 'changed');
  const noBaseline = input.cells.filter((c) => c.outcome === 'no-baseline').map((c) => c.id);
  const changedIds = changed.map((c) => c.id);
  const changedStates = [...new Set(changed.map((c) => `${c.subject}/${c.state}`))].sort();
  const base = { changed: changedIds, noBaseline, missingL14: [] as string[] };
  if (!changed.length && !noBaseline.length) return { state: 'pass', ...base };
  const summary = `${changedIds.length} changed cell(s) over ${changedStates.length} subject-state(s), ${noBaseline.length} cell(s) without a baseline`;
  if (input.scope === 'release') return { state: 'fail', reason: `release scope: ${summary} — changed/pending L7 cells are not pass`, ...base };
  if (input.scope === 'pr' && input.branch && BASELINES_BRANCH_RE.test(input.branch)) {
    const missingL14 = changedStates.filter((s) => !input.l14.has(s));
    if (missingL14.length) return { state: 'fail', reason: `baselines PR: no passing L14 record for ${missingL14.join(', ')}`, ...base, missingL14 };
    if (noBaseline.length) return { state: 'pending', reason: `baselines PR: ${noBaseline.length} cell(s) still without a baseline`, ...base };
    return { state: 'pass', reason: `baselines PR: ${changedStates.length} changed subject-state(s), each with an L14 record`, ...base };
  }
  if (input.scope === 'pr' && isQualBranch(input.branch) && changed.length) {
    return { state: 'fail', reason: `QUAL branch ${input.branch}: ${summary}; QUAL changes baselines only through next-qual/baselines-<yyyymmdd>`, ...base };
  }
  return { state: 'pending', reason: `${summary}; awaiting a reviewed baselines PR (REQ-QUAL-25)`, ...base };
}
