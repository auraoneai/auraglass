/* AuraGlass 5.0 contract-v1.0. CONTRACT-owned. Implemented by MAT; runtime exported from src/theme/index.ts. */
import type * as React from 'react';
import type { Transparency, DomTier } from './material';
import type { MotionPreference } from './motion';

export type Scheme = 'light' | 'dark';
export type Contrast = 'standard' | 'more';
export type Density = 'compact' | 'regular' | 'spacious';

export interface PreferenceValues {
  transparency: 'system' | Transparency;
  glassOpacity: number;                 // 0..1; >= 0.7 implies at least 'tinted'
  contrast: 'system' | Contrast;
  motion: 'system' | MotionPreference;
  scheme: 'system' | Scheme;
  density: Density;
  allowContinuous: boolean;             // default false; gates every loop (architecture §9, MOTION-12); never true under reduced motion
  // read-only OS/capability signals
  forcedColors: boolean; reducedMotionOS: boolean; reducedTransparencyOS: boolean; contrastMoreOS: boolean; coarsePointer: boolean;
}
export type PreferenceKey = keyof PreferenceValues;
export type UserSettableKey = 'transparency' | 'glassOpacity' | 'contrast' | 'motion' | 'scheme' | 'density' | 'allowContinuous';
export interface ResolvedPreferences {
  transparency: Transparency; contrast: Contrast; motion: MotionPreference; scheme: Scheme; density: Density;
  glassOpacity: number; tier: DomTier; allowContinuous: boolean;   // resolved allowContinuous is false unless motion === 'full'
  floors: { transparency: Transparency; motion: MotionPreference }; // OS/capability floors (D-11): results never go below these
}
export const SERVER_SNAPSHOT: PreferenceValues = {
  transparency: 'system', glassOpacity: 0, contrast: 'system', motion: 'system', scheme: 'system', density: 'regular', allowContinuous: false,
  forcedColors: false, reducedMotionOS: false, reducedTransparencyOS: false, contrastMoreOS: false, coarsePointer: false,
};
export const STORAGE_KEY = 'ag:prefs:v1' as const;
export const LEGACY_STORAGE_KEY = 'aura-glass-accessibility-settings' as const; // read once, never written
export interface PreferenceStorage { get(key: string): string | null; set(key: string, v: string): void; remove?(key: string): void }

/** S-21 hooks */
export type UsePreference = <K extends PreferenceKey>(key: K) => PreferenceValues[K];  // useSyncExternalStore, server snapshot above
export type UseResolvedPreferences = () => ResolvedPreferences;
export type UsePreferenceActions = () => {
  set<K extends UserSettableKey>(key: K, value: PreferenceValues[K]): void;
  reset(): void;
};

/** S-22 provider and pre-paint script */
export interface AuraGlassProviderProps {
  children: React.ReactNode;
  transparency?: PreferenceValues['transparency'];
  glassOpacity?: number;
  contrast?: PreferenceValues['contrast'];
  motion?: PreferenceValues['motion'];
  scheme?: PreferenceValues['scheme'];
  density?: Density;
  allowContinuous?: boolean;             // default false
  tier?: 'auto' | DomTier;               // subtree override; 'auto' = pre-paint detection
  preset?: string;                       // ThemePreset id
  brand?: string;                        // oklch() accent; createBrandTheme derives the ramp
  storage?: PreferenceStorage | null;    // null = do not persist
  portalContainer?: HTMLElement | null;  // overrides the provider-rendered portal root
  toasts?: boolean;                      // default true: render the toast layer root
  tooltips?: boolean;                    // default true: render the transient layer root
  deprecations?: 'warn' | 'silent';      // compat warnings (§14.3); default 'warn' in dev
}
export interface AuraGlassScriptProps {
  nonce?: string;
  storageKey?: string;                   // default STORAGE_KEY
  defaults?: Partial<Pick<PreferenceValues, UserSettableKey>>; // must equal the provider props, so pre-paint and hydration agree (no flash)
}
// export const auraGlassPrepaintScript: string   (same compiled body as AuraGlassScript; for non-RSC heads)

/** S-23 portal root. Rendered once per document by the outermost provider. */
export type PortalLayerRoot = 'overlay' | 'transient' | 'toast';
export type UsePortalContainer = (root?: PortalLayerRoot) => HTMLElement | null; // default 'overlay'; null = no provider (Base UI default)
export const PORTAL_ROOT_MARKUP =
  '<div data-ag-portal-root><div data-ag-layer-root="overlay"></div><div data-ag-layer-root="transient"></div>' +
  '<div data-ag-layer-root="toast" role="region" aria-label="Notifications"></div>' +
  '<div data-ag-announcer><div aria-live="polite" aria-atomic="true"></div><div aria-live="assertive" aria-atomic="true"></div></div></div>';

/** S-25 LayerStack: the ONLY Escape, inert and scroll-lock dispatcher. */
export type LayerKind = 'dialog' | 'alert-dialog' | 'sheet' | 'popover' | 'menu' | 'select' | 'combobox'
  | 'tooltip' | 'toast' | 'command-palette' | 'preview-card' | 'image-viewer' | 'drawer';
export interface LayerEntry { kind: LayerKind; modal: boolean; open: boolean; onEscape: () => void; element: HTMLElement | null; lockScroll?: boolean }
export type UseLayer = (entry: LayerEntry) => { id: string; depth: number; isTop: boolean };

/** S-26 announcer (archived A11Y-054 shape: coalesces identical messages within 500 ms; a message with the same id replaces the queued one) */
export interface AnnounceOptions { politeness?: 'polite' | 'assertive'; id?: string }
export type UseAnnouncer = () => { announce(message: string, opts?: AnnounceOptions): void; clear(): void };

/** S-24 */
export interface GlassPreferencesPanelProps {
  keys?: readonly UserSettableKey[];     // default: all seven
  onChange?: (key: UserSettableKey, value: unknown) => void;
  className?: string;
}
