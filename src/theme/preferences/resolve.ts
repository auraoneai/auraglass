/* MAT-263: pure preference resolution (PRD §4.5, D-11). No DOM access — this
   module is bundled into the pre-paint script (REQ-MAT-59: <= 1 536 B after
   minification and <= 1 ms on the mid-tier mobile profile; see
   scripts/mat/build-prepaint-script.mjs), so the resolver body is kept
   semantically minimal.
     transparency = max(osFloor, capFloor, app, user)   glass<tinted<solid
     contrast     = max(prefers-contrast:more, app, user), less/custom -> standard
     motion       = min(osCeiling, app, user)           reduced-motion -> at most calm
     forced colours => solid + more, absolute.
   resolvePaintCore is the single source: resolvePaint, the per-axis
   resolvers and resolvePreferences are defined through it. It is one
   function body with no helper calls or callbacks because every function
   the pre-paint script reaches costs a lazy compile on each page load,
   which dominated its execution budget. */
import type { Transparency, DomTier } from '../../contracts/material';
import type { MotionPreference } from '../../contracts/motion';
import type { Contrast, Density, Scheme } from '../../contracts/preferences';
import type {
  CapabilitySignals, FloorReason, OsSignals, PreferenceInput, ResolvedDetail,
  ContrastSetting, MotionSetting, SchemeSetting, TransparencySetting,
} from './types';

/* Rank ladders (index = rank). Kept as arrays so the bundled pre-paint body
   (REQ-MAT-59) carries each value name once. */
const TRANSPARENCY: readonly string[] = ['glass', 'tinted', 'solid'];
const MOTION: readonly string[] = ['none', 'calm', 'full'];
const TIERS: readonly string[] = ['standard', 'enhanced', 'lightweight'];
const SCHEMES: readonly string[] = ['light', 'dark'];
const DENSITIES: readonly string[] = ['regular', 'compact', 'spacious'];

export interface ResolveAllInput {
  os: OsSignals;
  cap: CapabilitySignals;
  app?: PreferenceInput;
  user?: PreferenceInput;
}

/** Resolved axes the pre-paint script stamps on <html> (no floors/reasons —
   those exist for the store/panel and are computed by resolvePreferences). */
export interface PaintResult {
  transparency: Transparency;
  contrast: Contrast;
  motion: MotionPreference;
  scheme: Scheme;
  density: Density;
  glassOpacity: number;
  tier: DomTier;
  allowContinuous: boolean;
}

/** Axis keys in PaintTuple order. The pre-paint bundle (REQ-MAT-59) reads
   app/user fields and writes data-ag-* attributes through this one list, so
   each key string ships once instead of once per access. */
export const PAINT_KEYS = [
  'transparency', 'contrast', 'motion', 'scheme', 'density', 'glassOpacity', 'tier', 'allowContinuous',
] as const;
const [kTransparency, kContrast, kMotion, , , kGlassOpacity, kTier, kAllowContinuous] = PAINT_KEYS;

/** resolvePaint as a positional tuple (PAINT_KEYS order) — the lean body the
   pre-paint script bundles. Signals arrive positionally (OsSignals order,
   then CapabilitySignals order) so no signal-object keys ship either. With
   `unknownEngine` given (pre-paint only) the tier slot applies the
   REQ-MAT-59 write rule: '' omits a signal-default 'standard' (written only
   for a persisted/app value or a heuristic 'lightweight'), and an unknown
   engine caps 'enhanced' at 'standard'. */
export type PaintTuple = [Transparency, Contrast, MotionPreference, Scheme, Density, number, DomTier | '', boolean];

export const resolvePaintCore = (
  forcedColors: boolean, contrastMore: boolean, reducedTransparency: boolean,
  reducedMotion: boolean, schemeDark: boolean, coarsePointer: boolean,
  backdropFilter: boolean, saveData: boolean | undefined, deviceMemory: number | null | undefined,
  app: PreferenceInput, user: PreferenceInput,
  unknownEngine?: boolean,
): PaintTuple => {
  // user, else app, else 0 (NaN / non-numbers fall through); clamped to [0, 1]
  let glassOpacity = 0;
  for (const v of [app[kGlassOpacity], user[kGlassOpacity]]) if (typeof v == 'number' && v === v) glassOpacity = v;
  glassOpacity = glassOpacity < 0 ? 0 : glassOpacity > 1 ? 1 : glassOpacity;
  const more = forcedColors || contrastMore || app[kContrast] === 'more' || user[kContrast] === 'more';
  // indexOf: 'system' / unset / unknown rank -1, which never wins the max; for
  // the motion min, (i + 3) % 3 maps -1 to 2 (full: no ceiling).
  const motion = MOTION[Math.min(
    reducedMotion ? 1 : 2,
    (MOTION.indexOf(app[kMotion]!) + 3) % 3,
    (MOTION.indexOf(user[kMotion]!) + 3) % 3,
  )] as MotionPreference;
  // Default axis values index their ladders (SCHEMES[0]=light, DENSITIES[0]=
  // regular, TIERS[0]=standard, TIERS[2]=lightweight, MOTION[2]=full) so the
  // bundled body ships each value name once (REQ-MAT-59).
  const t: PaintTuple = [
    // forced colours floor at solid; contrast more (OS or setting) floors at tinted
    TRANSPARENCY[Math.max(
      forcedColors ? 2 : more || reducedTransparency ? 1 : 0,
      backdropFilter ? 0 : 2,
      TRANSPARENCY.indexOf(app[kTransparency]!),
      TRANSPARENCY.indexOf(user[kTransparency]!),
      glassOpacity >= 0.7 ? 1 : 0,
    )] as Transparency,
    more ? 'more' : TIERS[0] as Contrast,
    motion,
    SCHEMES[schemeDark ? 1 : 0] as Scheme,
    DENSITIES[0] as Density,
    glassOpacity,
    TIERS[saveData || (deviceMemory != null && deviceMemory <= 2 && coarsePointer) ? 2 : 0] as DomTier,
    (user[kAllowContinuous] ?? app[kAllowContinuous] ?? false) && motion === MOTION[2],
  ];
  // scheme / density / tier: a valid user value, else a valid app value, else
  // the signal-derived default above (app first, so a valid user value wins).
  for (const [i, list] of [[3, SCHEMES], [4, DENSITIES], [6, TIERS]] as const) {
    for (const v of [app[PAINT_KEYS[i]], user[PAINT_KEYS[i]]]) if (list.includes(v as string)) (t as unknown[])[i] = v;
  }
  if (unknownEngine !== undefined) {
    if (t[6] === TIERS[0] && app[kTier] !== TIERS[0] && user[kTier] !== TIERS[0]) t[6] = '';
    else if (unknownEngine && t[6] === TIERS[1]) t[6] = TIERS[0] as DomTier;
  }
  return t;
};

/** Single-pass resolution over every axis (resolvePreferences wraps it with
   floors/reasons for the store); object view of resolvePaintCore. */
export const resolvePaint = (
  os: OsSignals,
  cap: CapabilitySignals,
  app: PreferenceInput = {},
  user: PreferenceInput = {},
): PaintResult => {
  const t = resolvePaintCore(
    os.forcedColors, os.contrastMore, os.reducedTransparency, os.reducedMotion, os.schemeDark, os.coarsePointer,
    cap.backdropFilter, cap.saveData, cap.deviceMemory, app, user,
  );
  return {
    transparency: t[0], contrast: t[1], motion: t[2], scheme: t[3], density: t[4],
    glassOpacity: t[5], tier: t[6] as DomTier, allowContinuous: t[7],
  };
};

/* Per-axis views of resolvePaint (one level per argument). */
const ANY_CAP: CapabilitySignals = { backdropFilter: true, saveData: false, deviceMemory: null };
/** One preference level from possibly-unset values (unset reads as absent). */
const level = (v: Record<string, unknown>): PreferenceInput => v as PreferenceInput;

export const resolveTransparency = (
  os: OsSignals,
  backdropFilter: boolean,
  app?: TransparencySetting,
  user?: TransparencySetting,
  glassOpacity = 0,
): Transparency => resolvePaint(
  os, backdropFilter ? ANY_CAP : { ...ANY_CAP, backdropFilter: false }, level({ transparency: app, glassOpacity }), level({ transparency: user }),
).transparency;

export const resolveContrast = (
  os: OsSignals,
  app?: ContrastSetting | 'less' | 'custom',
  user?: ContrastSetting | 'less' | 'custom',
): Contrast => resolvePaint(os, ANY_CAP, level({ contrast: app }), level({ contrast: user })).contrast;

export const resolveMotion = (
  os: OsSignals,
  app?: MotionSetting,
  user?: MotionSetting,
): MotionPreference => resolvePaint(os, ANY_CAP, level({ motion: app }), level({ motion: user })).motion;

export const resolveScheme = (
  os: OsSignals,
  app?: SchemeSetting,
  user?: SchemeSetting,
): Scheme => resolvePaint(os, ANY_CAP, level({ scheme: app }), level({ scheme: user })).scheme;

export const resolvePreferences = ({ os, cap, app = {}, user = {} }: ResolveAllInput): ResolvedDetail => {
  const r = resolvePaint(os, cap, app, user);
  const reasons: FloorReason[] = [];
  if (os.forcedColors) reasons.push('forced-colors');
  if (os.contrastMore) reasons.push('prefers-contrast-more');
  if (os.reducedTransparency) reasons.push('prefers-reduced-transparency');
  if (os.reducedMotion) reasons.push('prefers-reduced-motion');
  if (!cap.backdropFilter) reasons.push('no-backdrop-filter');
  if (r.glassOpacity >= 0.7) reasons.push('glass-opacity');
  if (r.tier === 'lightweight' && !TIERS.includes(user.tier!) && !TIERS.includes(app.tier!)) {
    reasons.push(cap.saveData ? 'save-data' : 'low-memory-coarse');
  }
  const contrastMore = r.contrast === 'more' && !os.forcedColors && !os.contrastMore;
  if (contrastMore) reasons.push('contrast-more');
  const floor = Math.max(
    os.forcedColors ? 2 : os.contrastMore || os.reducedTransparency ? 1 : 0,
    cap.backdropFilter ? 0 : 2,
    r.glassOpacity >= 0.7 || contrastMore ? 1 : 0,
  );
  return {
    ...r,
    floors: {
      transparency: floor >= 2 ? 'solid' : floor === 1 ? 'tinted' : 'glass',
      motion: os.reducedMotion ? 'calm' : 'full',
    },
    reasons,
  };
};
