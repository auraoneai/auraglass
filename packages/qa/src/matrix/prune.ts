/* REQ-QUAL-12 (QUAL, FIN-429). Pruning rules and the per-subject-set cell lists of PRD-QUAL §4.3.

   Implications (normalisation, applied before validity):
     forced-colors ⇒ tier lightweight + transparency solid;  solid ⇒ tier lightweight.
   Validity (a cell that violates one is pruned):
     forced-colors only in engines whose `forcedColors` emulation reads back true (REQ-QUAL-17);
     enhanced ⇒ chromium ∧ glass ∧ motion ≠ none ∧ refraction-eligible subject ∧ preference default.

   Cell sets are built from three blocks over the default point (glass / default / standard):
     core       — engines × scenes × schemes × viewports at the default point;
     deviations — one non-default transparency or preference at a time (tinted, solid, contrast-more, forced-colors,
                  reduced-motion), normalised by the implications, then pruned;
     enhanced   — the core cells moved to tier enhanced, then pruned (chromium only, refraction-eligible only).
   Counts per subject-state (asserted by packages/qa/test/matrix-prune.test.ts):
     T0 Surface 180 · flagship / T0 core 148 (+32 if refraction-eligible) · T2 core 29 · product scene 96 ·
     S2 showcase 29 · PR reduced 24. */
import {
  DEFAULTS, ENGINES, SCENES, SCHEMES, VIEWPORT_IDS, product,
  type Cell, type MatrixEngine, type MatrixPreference, type MatrixTransparency, type SceneId,
} from './axes';

/** Engines whose Playwright `forcedColors: 'active'` emulation reads back `matchMedia('(forced-colors: active)')` true. */
export const FORCED_COLORS_ENGINES: readonly MatrixEngine[] = ['chromium'];

export interface PruneContext {
  /** ComponentMeta.material.refractionEligible (or parameters.ag.refraction) of the subject */
  refractionEligible: boolean;
}

/** Applies the axis implications; never changes engine, scene, scheme or viewport. */
export function normalize(cell: Cell): Cell {
  const out = { ...cell };
  if (out.preference === 'forced-colors') { out.transparency = 'solid'; out.tier = 'lightweight'; }
  if (out.transparency === 'solid') out.tier = 'lightweight';
  return out;
}

/** null when the cell is valid for the subject, else the pruning reason. Expects a normalised cell. */
export function pruneReason(cell: Cell, ctx: PruneContext): string | null {
  const n = normalize(cell);
  if (n.tier !== cell.tier || n.transparency !== cell.transparency) return 'not-normalised';
  if (cell.preference === 'forced-colors' && !FORCED_COLORS_ENGINES.includes(cell.engine)) return 'forced-colors-not-emulated';
  if (cell.tier === 'enhanced') {
    if (cell.engine !== 'chromium') return 'enhanced-chromium-only';
    if (cell.transparency !== 'glass') return 'enhanced-glass-only';
    if (cell.preference !== 'default') return 'enhanced-default-preference-only'; // also excludes motion none
    if (!ctx.refractionEligible) return 'enhanced-not-refraction-eligible';
  }
  return null;
}

export function prune(cells: readonly Cell[], ctx: PruneContext): Cell[] {
  const seen = new Set<string>();
  const out: Cell[] = [];
  for (const c of cells) {
    if (pruneReason(c, ctx) !== null) continue;
    const key = JSON.stringify(c);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

/** The five single-axis deviations from the default point. */
export const DEVIATIONS: ReadonlyArray<{ transparency: MatrixTransparency; preference: MatrixPreference }> = [
  { transparency: 'tinted', preference: 'default' },
  { transparency: 'solid', preference: 'default' },
  { transparency: 'glass', preference: 'contrast-more' },
  { transparency: 'glass', preference: 'forced-colors' },
  { transparency: 'glass', preference: 'reduced-motion' },
];

interface Span { engines: readonly MatrixEngine[]; scenes: readonly SceneId[]; schemes: readonly Cell['scheme'][]; viewports: readonly Cell['viewport'][] }

function core(span: Span): Cell[] {
  return product({ ...span, transparencies: [DEFAULTS.transparency], preferences: [DEFAULTS.preference], tiers: [DEFAULTS.tier] });
}

function deviations(span: Span, ctx: PruneContext): Cell[] {
  return prune(core(span).flatMap((c) => DEVIATIONS.map((d) => normalize({ ...c, ...d }))), ctx);
}

function enhanced(span: Span, ctx: PruneContext): Cell[] {
  return prune(core(span).map((c) => ({ ...c, tier: 'enhanced' as const })), ctx);
}

const FULL: Span = { engines: ENGINES, scenes: SCENES, schemes: SCHEMES, viewports: VIEWPORT_IDS };
/** Preference deviations run on one representative scene across every engine, scheme and viewport. */
const PREFERENCE_SPAN: Span = { ...FULL, scenes: ['photo'] };
const T2_SPAN: Span = { engines: ['chromium', 'webkit'], scenes: ['photo', 'flat-white', 'flat-black'], schemes: SCHEMES, viewports: VIEWPORT_IDS };
/** T2 preference deviations: once each at the base cell chromium / photo / light / 1440. */
const T2_PREFERENCE_SPAN: Span = { engines: ['chromium'], scenes: ['photo'], schemes: ['light'], viewports: ['1440'] };
const PR_SPAN: Span = { engines: ['chromium', 'webkit'], scenes: ['photo', 'flat-black', 'dense-text'], schemes: SCHEMES, viewports: VIEWPORT_IDS };

export const SUBJECT_SETS = ['t0-surface', 'flagship', 't0-core', 't2', 'product-scene', 's2-showcase', 'pr-reduced'] as const;
export type SubjectSet = (typeof SUBJECT_SETS)[number];

/** The cells one subject-state of `set` is captured in. `t0-surface` always carries the enhanced block. */
export function cellsFor(set: SubjectSet, ctx: PruneContext): Cell[] {
  switch (set) {
    case 't0-surface': {
      const eligible = { refractionEligible: true };
      return [...core(FULL), ...deviations(PREFERENCE_SPAN, eligible), ...enhanced(FULL, eligible)];
    }
    case 'flagship':
    case 't0-core':
      return [...core(FULL), ...deviations(PREFERENCE_SPAN, ctx), ...enhanced(FULL, ctx)];
    case 't2':
    case 's2-showcase':
      return [...core(T2_SPAN), ...deviations(T2_PREFERENCE_SPAN, ctx)];
    case 'product-scene':
      return core(FULL);
    case 'pr-reduced':
      return core(PR_SPAN);
  }
}
