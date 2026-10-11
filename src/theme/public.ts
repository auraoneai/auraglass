/* Frozen public surface of aura-glass/theme (§4.7; S-21..S-26 delivered).
   usePortalContainer/useLayer/useAnnouncer are internal (§4.7): consumed by
   CMP/SURF through src/theme/index.ts and deliberately not re-exported here. */
export {
  AuraGlassProvider, AuraGlassScript, auraGlassPrepaintScript, GlassPreferencesPanel,
  usePreference, useResolvedPreferences, usePreferenceActions,
  createGlassTheme, createGlassThemeCssVars, createBrandTheme, presets,
} from './index';
export type {
  AuraGlassProviderProps, AuraGlassScriptProps, GlassPreferencesPanelProps,
  PreferenceKey, PreferenceValues, ResolvedPreferences, UserSettableKey,
} from '../contracts/preferences';
export type { PortalLayerRoot, LayerEntry, AnnounceOptions } from '../contracts/preferences';
export type { GlassTheme, GlassThemeTokens, GlassThemeMode, ContrastReport } from './createGlassTheme';
export type { ThemePreset, PresetId } from './presets';
