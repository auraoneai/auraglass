/* MAT-262: preference model types. The frozen public shapes come from
   src/contracts/preferences.ts (S-20/S-21); this module re-exports them and adds
   the internal input/signal shapes resolve.ts, store.ts and prepaint.ts share. */
import type { Transparency, DomTier } from '../../contracts/material';
import type { MotionPreference } from '../../contracts/motion';
import type { Contrast, Density, Scheme, PreferenceStorage } from '../../contracts/preferences';

export type {
  PreferenceKey, PreferenceValues, ResolvedPreferences, UserSettableKey,
  PreferenceStorage, PortalLayerRoot, LayerEntry, LayerKind,
  AnnounceOptions, AuraGlassScriptProps,
} from '../../contracts/preferences';
export {
  SERVER_SNAPSHOT, STORAGE_KEY, LEGACY_STORAGE_KEY,
} from '../../contracts/preferences';
export type { Transparency, DomTier, Contrast, Density, Scheme, MotionPreference };

/** Setting axes as the user/app may express them: a concrete value or 'system'. */
export type TransparencySetting = 'system' | Transparency;
export type ContrastSetting = 'system' | Contrast;
export type MotionSetting = 'system' | MotionPreference;
export type SchemeSetting = 'system' | Scheme;

/** OS media-query booleans the resolver reads. Built by media.ts / prepaint. */
export interface OsSignals {
  forcedColors: boolean;
  contrastMore: boolean;
  reducedTransparency: boolean;
  reducedMotion: boolean;
  schemeDark: boolean;
  coarsePointer: boolean;
}

/** Capability signals (CSS.supports + navigator hints). */
export interface CapabilitySignals {
  backdropFilter: boolean;
  saveData: boolean;
  deviceMemory: number | null;
}

/** Values one level (user persist or app props) may contribute. */
export interface PreferenceInput {
  transparency?: TransparencySetting;
  glassOpacity?: number;
  contrast?: ContrastSetting | 'less' | 'custom';
  motion?: MotionSetting;
  scheme?: SchemeSetting;
  density?: Density;
  allowContinuous?: boolean;
  tier?: 'auto' | DomTier;
}

/** Why a resolved axis sits above the app's/user's choice (D-11). */
export type FloorReason =
  | 'forced-colors'
  | 'prefers-contrast-more'
  | 'prefers-reduced-transparency'
  | 'prefers-reduced-motion'
  | 'no-backdrop-filter'
  | 'glass-opacity'
  | 'contrast-more'
  | 'save-data'
  | 'low-memory-coarse';

/** Resolved preferences plus the floor explanation surfaced to the panel. */
export interface ResolvedDetail {
  transparency: Transparency;
  contrast: Contrast;
  motion: MotionPreference;
  scheme: Scheme;
  density: Density;
  glassOpacity: number;
  tier: DomTier;
  allowContinuous: boolean;
  floors: { transparency: Transparency; motion: MotionPreference };
  reasons: readonly FloorReason[];
}

/** Raw persisted record (storage key ag:prefs:v1). */
export interface PersistedPreferences {
  transparency?: TransparencySetting;
  glassOpacity?: number;
  contrast?: ContrastSetting;
  motion?: MotionSetting;
  scheme?: SchemeSetting;
  density?: Density;
  allowContinuous?: boolean;
}

/** Options accepted by createPreferenceStore (MAT-267). */
export interface PreferenceStoreOptions {
  storage?: PreferenceStorage | null;
  storageKey?: string;
  legacyStorageKey?: string;
  app?: PreferenceInput;
  target?: HTMLElement | null;
  window?: Window | null;
}
