/* @ag-contract-seed: S-21..S-26. Owner MAT. Frozen public surface of aura-glass/theme (§4.7). */
export {
  AuraGlassProvider, AuraGlassScript, auraGlassPrepaintScript, GlassPreferencesPanel,
  usePreference, useResolvedPreferences, usePreferenceActions,
  usePortalContainer, useLayer, useAnnouncer,
  createGlassTheme, createGlassThemeCssVars, createBrandTheme, createBrandGlassTheme,
  presets,
} from './index';
export type {
  AuraGlassProviderProps, AuraGlassScriptProps, GlassPreferencesPanelProps,
  PreferenceKey, PreferenceValues, ResolvedPreferences, UserSettableKey,
  PortalLayerRoot, LayerEntry, AnnounceOptions,
} from '../contracts/preferences';
export type {
  GlassTheme, GlassThemeTokens, GlassThemeMode, GlassDensity, GlassMotionPolicy,
  GlassMotionAxis, GlassContrastAxis, ContrastReport, ContrastPair, ContrastAdjustment,
  CreateGlassThemeOptions,
} from './createGlassTheme';
export type { CreateBrandThemeOptions } from './createBrandTheme';
export type { PresetId, ThemePreset } from './presets';
export type { Oklch, Srgb } from './color';
