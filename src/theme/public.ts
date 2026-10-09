/* @ag-contract-seed: S-21..S-26. Owner MAT. Frozen public surface of aura-glass/theme (§4.7).
   usePortalContainer/useLayer/useAnnouncer are internal (§4.7): consumed by
   CMP/SURF through src/theme/index.ts and deliberately not re-exported here. */
export {
  AuraGlassProvider, AuraGlassScript, auraGlassPrepaintScript, GlassPreferencesPanel,
  usePreference, useResolvedPreferences, usePreferenceActions,
  createGlassTheme, createBrandTheme, presets,
} from './index';
/* MAT-22 (REQ-FIN-04): the 4.x names stay on the frozen surface but are no
   longer routed through ./index — they live on the legacy modules until the
   src/compat/mat move lands (FIN-D). */
export { createGlassThemeCssVars } from './createGlassTheme';
export { createBrandGlassTheme } from './createBrandGlassTheme';
export type {
  AuraGlassProviderProps, AuraGlassScriptProps, GlassPreferencesPanelProps,
  PreferenceKey, PreferenceValues, ResolvedPreferences, UserSettableKey,
} from '../contracts/preferences';
export type { PortalLayerRoot, LayerEntry, AnnounceOptions } from '../contracts/preferences';
export type { GlassTheme, GlassThemeTokens, GlassThemeMode, ContrastReport } from './createGlassTheme';
export type { ThemePreset, PresetId } from './presets';
