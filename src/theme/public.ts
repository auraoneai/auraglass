/* @ag-contract-seed: S-21..S-26. Owner MAT. Frozen public surface of aura-glass/theme (§4.7). */
export {
  AuraGlassProvider, AuraGlassScript, auraGlassPrepaintScript, GlassPreferencesPanel,
  usePreference, useResolvedPreferences, usePreferenceActions,
  usePortalContainer, useLayer, useAnnouncer,
  createGlassTheme, createBrandGlassTheme,
} from './index';
export type {
  AuraGlassProviderProps, AuraGlassScriptProps, GlassPreferencesPanelProps,
  PreferenceKey, PreferenceValues, ResolvedPreferences, UserSettableKey,
  PortalLayerRoot, LayerEntry, AnnounceOptions,
} from '../contracts/preferences';
export type { GlassTheme, GlassThemeTokens, GlassThemeMode } from './createGlassTheme';
export type { GlassMaterialPreset, GlassMaterialTokens } from './materials';
export { glassMaterialPresets } from './materials';
