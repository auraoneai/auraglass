# 3.2 Theme Engine Evidence

This ledger tracks Theme Engine 2.0 implementation and migration readiness.

## Implemented Capabilities

| Capability | Status | Evidence |
| --- | --- | --- |
| Brand generation from compact input | Pass | `createGlassTheme`, `createBrandGlassTheme`, `src/theme/theme-engine.test.tsx` |
| Density policy | Pass | `compact`, `comfortable`, `spacious` tokens and runtime hook coverage |
| Motion policy | Pass | `system`, `reduced`, `expressive`, `none` policy tokens and runtime hook coverage |
| Contrast budgets | Pass | `contrastRatio`, `bestTextColor`, `textOnSurface > 4.5` test coverage |
| CSS variable export | Pass | `createGlassThemeCssVars` test coverage |
| Runtime provider | Pass | `GlassThemeProvider`, `useGlassTheme`, `useGlassDensity`, `useGlassMotionPolicy` |
| MUI theme migration guidance | Pass | [../../docs/theme/theme-engine.md](../../docs/theme/theme-engine.md), [../../docs/migration/mui-to-auraglass.md](../../docs/migration/mui-to-auraglass.md) |

## Verification

| Command | Result |
| --- | --- |
| `npm run typecheck -- --pretty false` | Pass |
| `npm test -- --runTestsByPath src/theme/theme-engine.test.tsx --runInBand` | Covered in focused 9-suite run; pass |
| `npm test -- --runInBand` | Pass, 419 suites / 2,265 tests / 339 snapshots |
| `npm run build` | Pass |
| `npm run test:exports:cjs` | Pass; `./theme` export loads |
| `npm run test:exports:esm` | Pass; `./theme` export loads |

## API Surface

Public `aura-glass/theme` exports include:

- `createGlassTheme`
- `createBrandGlassTheme`
- `createGlassThemeCssVars`
- `GlassThemeProvider`
- `useGlassTheme`
- `useGlassDensity`
- `useGlassMotionPolicy`
- color helpers and material presets

## Notes

The 3.2 theme engine is intentionally compact. It provides package-native brand, density, motion, contrast, provider, hook, and CSS-variable APIs without pulling MUI theme machinery into the AuraGlass core contract.
