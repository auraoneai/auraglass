/* MAT-263: pure preference resolution (PRD §4.5, D-11). No DOM access — this
   module is bundled into the pre-paint script (REQ-MAT-59 budget 1 536 B
   after minification; see scripts/mat/build-prepaint-script.mjs), so the
   resolver body is kept semantically minimal.
     transparency = max(osFloor, capFloor, app, user)   glass<tinted<solid
     contrast     = max(prefers-contrast:more, app, user), less/custom -> standard
     motion       = min(osCeiling, app, user)           reduced-motion -> at most calm
     forced colours => solid + more, absolute. */
import type { Transparency, DomTier } from '../../contracts/material';
import type { MotionPreference } from '../../contracts/motion';
import type { Contrast, Density, Scheme } from '../../contracts/preferences';
import type {
  CapabilitySignals, FloorReason, OsSignals, PreferenceInput, ResolvedDetail,
  ContrastSetting, MotionSetting, SchemeSetting, TransparencySetting,
} from './types';

/* Rank ladders (index = rank). Kept as arrays so the bundled pre-paint body
   (REQ-MAT-59) carries each value name once. */
const TRANSPARENCY: readonly Transparency[] = ['glass', 'tinted', 'solid'];
const MOTION: readonly MotionPreference[] = ['none', 'calm', 'full'];
const TIERS: readonly DomTier[] = ['standard', 'enhanced', 'lightweight'];

/** Rank of `v` in `list`, or `fallback` for 'system' / unset / unknown values. */
const rank = (list: readonly string[], v: string | undefined, fallback: number): number => {
  const i = list.indexOf(v as string);
  return i < 0 ? fallback : i;
};

/** First of `vs` (highest precedence first) that is a member of `list`. */
const pick = <T extends string>(list: readonly T[], ...vs: (string | undefined)[]): T | undefined =>
  vs.find((v) => list.includes(v as T)) as T | undefined;

export const resolveTransparency = (
  os: OsSignals,
  backdropFilter: boolean,
  app?: TransparencySetting,
  user?: TransparencySetting,
  glassOpacity = 0,
): Transparency => TRANSPARENCY[Math.max(
  os.forcedColors ? 2 : os.contrastMore || os.reducedTransparency ? 1 : 0,
  backdropFilter ? 0 : 2,
  rank(TRANSPARENCY, app, 0),
  rank(TRANSPARENCY, user, 0),
  glassOpacity >= 0.7 ? 1 : 0,
)]!;

export const resolveContrast = (
  os: OsSignals,
  app?: ContrastSetting | 'less' | 'custom',
  user?: ContrastSetting | 'less' | 'custom',
): Contrast =>
  os.forcedColors || os.contrastMore
  || pick(['more', 'standard', 'less', 'custom'], user, app) === 'more' ? 'more' : 'standard';

export const resolveMotion = (
  os: OsSignals,
  app?: MotionSetting,
  user?: MotionSetting,
): MotionPreference =>
  MOTION[Math.min(os.reducedMotion ? 1 : 2, rank(MOTION, app, 2), rank(MOTION, user, 2))]!;

export const resolveScheme = (
  os: OsSignals,
  app?: SchemeSetting,
  user?: SchemeSetting,
): Scheme => pick<Scheme>(['light', 'dark'], user, app) ?? (os.schemeDark ? 'dark' : 'light');

const pickTier = (v: 'auto' | DomTier | undefined): DomTier | undefined => pick(TIERS, v);

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

/** Single-pass resolution over every axis — the lean body the pre-paint script
   bundles (resolvePreferences wraps it with floors/reasons for the store). */
export const resolvePaint = (
  os: OsSignals,
  cap: CapabilitySignals,
  app: PreferenceInput = {},
  user: PreferenceInput = {},
): PaintResult => {
  const glassOpacity = Math.min(1, Math.max(0, user.glassOpacity ?? app.glassOpacity ?? 0));
  const motion = resolveMotion(os, app.motion, user.motion);
  return {
    // forced colours resolve to solid inside resolveTransparency (floor 2).
    transparency: resolveTransparency(os, cap.backdropFilter, app.transparency, user.transparency, glassOpacity),
    contrast: resolveContrast(os, app.contrast, user.contrast),
    motion,
    scheme: resolveScheme(os, app.scheme, user.scheme),
    density: pick<Density>(['regular', 'compact'], user.density, app.density) ?? 'regular',
    glassOpacity,
    tier: pick(TIERS, user.tier, app.tier)
      ?? (cap.saveData || (cap.deviceMemory !== null && cap.deviceMemory <= 2 && os.coarsePointer)
        ? 'lightweight' : 'standard'),
    allowContinuous: (user.allowContinuous ?? app.allowContinuous ?? false) && motion === 'full',
  };
};

export const resolvePreferences = ({ os, cap, app = {}, user = {} }: ResolveAllInput): ResolvedDetail => {
  const r = resolvePaint(os, cap, app, user);
  const reasons: FloorReason[] = [];
  if (os.forcedColors) reasons.push('forced-colors');
  if (os.contrastMore) reasons.push('prefers-contrast-more');
  if (os.reducedTransparency) reasons.push('prefers-reduced-transparency');
  if (os.reducedMotion) reasons.push('prefers-reduced-motion');
  if (!cap.backdropFilter) reasons.push('no-backdrop-filter');
  if (r.glassOpacity >= 0.7) reasons.push('glass-opacity');
  if (r.tier === 'lightweight' && !pickTier(user.tier) && !pickTier(app.tier)) {
    reasons.push(cap.saveData ? 'save-data' : 'low-memory-coarse');
  }
  const floor = Math.max(
    os.forcedColors ? 2 : os.contrastMore || os.reducedTransparency ? 1 : 0,
    cap.backdropFilter ? 0 : 2,
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
