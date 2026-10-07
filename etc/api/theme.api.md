## API Report — aura-glass ./theme

- `AuraGlassProvider`
- `AuraGlassScript`
- `GlassPreferencesPanel`
- `auraGlassPrepaintScript`
- `createBrandGlassTheme`
- `createGlassTheme`
- `glassMaterialPresets`
- `useAnnouncer`
- `useLayer`
- `usePortalContainer`
- `usePreference`
- `usePreferenceActions`
- `useResolvedPreferences`

## Diff vs ENTRIES (architecture §4.2)

- missing (contract exports absent from barrel): `createBrandTheme`, `presets`
- extra (barrel exports not in contract): `createBrandGlassTheme`, `glassMaterialPresets`, `useAnnouncer`, `useLayer`, `usePortalContainer`
