/* MAT-263: pure preference resolution (PRD §4.5, D-11). No DOM access — this
   module is bundled into the pre-paint script (≤ 1 536 B after minification),
   so the resolver body is kept semantically minimal.
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

const T: Record<Transparency, number> = { glass: 0, tinted: 1, solid: 2 };
const M: Record<MotionPreference, number> = { none: 0, calm: 1, full: 2 };

export const resolveTransparency = (
  os: OsSignals,
  backdropFilter: boolean,
  app?: TransparencySetting,
  user?: TransparencySetting,
  glassOpacity = 0,
): Transparency => {
  const floor = Math.max(
    os.forcedColors ? 2 : os.contrastMore || os.reducedTransparency ? 1 : 0,
    backdropFilter ? 0 : 2,
    T[app === 'system' ? 'glass' : (app ?? 'glass') as Transparency] ?? 0,
    T[user === 'system' ? 'glass' : (user ?? 'glass') as Transparency] ?? 0,
    glassOpacity >= 0.7 ? 1 : 0,
  );
  return floor >= 2 ? 'solid' : floor === 1 ? 'tinted' : 'glass';
};

export const resolveContrast = (
  os: OsSignals,
  app?: ContrastSetting | 'less' | 'custom',
  user?: ContrastSetting | 'less' | 'custom',
): Contrast =>
  // max(prefers-contrast:more, app, user) on standard(0) < more(1): 'less',
  // 'custom' and 'system' rank as standard, so a user value never lowers app.
  os.forcedColors || os.contrastMore || app === 'more' || user === 'more' ? 'more' : 'standard';

export const resolveMotion = (
  os: OsSignals,
  app?: MotionSetting,
  user?: MotionSetting,
): MotionPreference => {
  const req = (v: MotionSetting | undefined): number =>
    v === 'none' || v === 'calm' || v === 'full' ? M[v] : 2;
  const n = Math.min(os.reducedMotion ? 1 : 2, req(app), req(user));
  return n === 0 ? 'none' : n === 1 ? 'calm' : 'full';
};

const pickScheme = (v: SchemeSetting | undefined): Scheme | undefined =>
  v === 'light' || v === 'dark' ? v : undefined;

export const resolveScheme = (
  os: OsSignals,
  app?: SchemeSetting,
  user?: SchemeSetting,
): Scheme => pickScheme(user) ?? pickScheme(app) ?? (os.schemeDark ? 'dark' : 'light');

const pickDensity = (v: Density | undefined): Density | undefined =>
  v === 'regular' || v === 'compact' || v === 'spacious' ? v : undefined;

/** NaN and non-numbers (e.g. an unparsable persisted record) count as unset
   instead of poisoning the [0, 1] clamp. */
const pickOpacity = (v: unknown): number | undefined =>
  typeof v === 'number' && v === v ? v : undefined;

const pickTier = (v: 'auto' | DomTier | undefined): DomTier | undefined =>
  v === 'standard' || v === 'enhanced' || v === 'lightweight' ? v : undefined;

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
  const glassOpacity = Math.min(1, Math.max(0,
    pickOpacity(user.glassOpacity) ?? pickOpacity(app.glassOpacity) ?? 0));
  const contrast = resolveContrast(os, app.contrast, user.contrast);
  const t = os.forcedColors
    ? 'solid'
    : resolveTransparency(os, cap.backdropFilter, app.transparency, user.transparency, glassOpacity);
  // REQ-MAT-12: contrast=more (OS, app or user) selects at least tinted.
  const transparency: Transparency = contrast === 'more' && t === 'glass' ? 'tinted' : t;
  const motion = resolveMotion(os, app.motion, user.motion);
  const scheme = resolveScheme(os, app.scheme, user.scheme);
  const density = pickDensity(user.density) ?? pickDensity(app.density) ?? 'regular';
  const tier = pickTier(user.tier) ?? pickTier(app.tier)
    ?? (cap.saveData || (cap.deviceMemory !== null && cap.deviceMemory <= 2 && os.coarsePointer)
      ? 'lightweight' : 'standard');
  const allowContinuous = (user.allowContinuous ?? app.allowContinuous ?? false) && motion === 'full';
  return { transparency, contrast, motion, scheme, density, glassOpacity, tier, allowContinuous };
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
  // App/user contrast=more is a tinted floor too (OS contrast-more is above).
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
