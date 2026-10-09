/* S-21..S-26 frozen surface (contract §4.7). Implemented by MAT lane 2d-P.
   usePortalContainer/useLayer/useAnnouncer are internal: exported here for
   CMP/SURF, never re-exported from ./public.
   createGlassTheme/createBrandTheme/presets (+ types) are the frozen lane 2a-T
   interface, vendored byte-verbatim from next-mat/t-tokens@7132f8d80
   ("consumed through its frozen interface, never waited for" — identical-add
   merge when that lane lands). */
import './mounts'; // REQ-FIN-04: registers lensDefs/pointerLight/devDiagnostics/presetCss/brandCss

export { AuraGlassProvider } from './AuraGlassProvider';
export { AuraGlassScript, auraGlassPrepaintScript } from './AuraGlassScript';
export { GlassPreferencesPanel } from './preferences-panel/GlassPreferencesPanel';
export {
  usePreference, useResolvedPreferences, usePreferenceActions,
} from './preferences/usePreference';
export { usePortalContainer } from './portal';
export { useLayer } from './layers/useLayer';
export { useAnnouncer } from './announcer/useAnnouncer';

export { createGlassTheme } from './createGlassTheme';
export { createBrandTheme } from './createBrandTheme';
export { presets } from './presets';

export type {
  PreferenceKey, PreferenceValues, ResolvedPreferences, UserSettableKey,
  AuraGlassProviderProps, AuraGlassScriptProps, PortalLayerRoot, LayerEntry, LayerKind,
  AnnounceOptions, GlassPreferencesPanelProps,
} from '../contracts/preferences';
export type {
  GlassTheme, GlassThemeTokens, GlassThemeMode, CreateGlassThemeOptions,
  ContrastReport, ContrastAdjustment, ContrastPair,
} from './createGlassTheme';
export type { CreateBrandThemeOptions } from './createBrandTheme';
export type { ThemePreset, PresetId } from './presets';
