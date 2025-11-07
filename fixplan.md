Fix Plan – AuraGlass Export & API Alignment
===========================================

Overview
--------
Objective is to align the documented/public API surface with actual implementation by exposing existing components/hooks/types, creating missing utilities when required, and updating docs. Tasks are organized by file with actionable checklists.

src/index.ts
------------
- [ ] Export missing type definitions with explicit statements near the existing “Type exports” block:
  - [ ] `export type { GlassCardProps } from './components/card/GlassCard';`
  - [ ] `export type { DateRange } from './components/input/GlassDateRangePicker';`
  - [ ] `export type { ChartDataset } from './components/charts/GlassDataChart';`
  - [ ] `export type { ColumnDefinition, SortState } from './components/data-display/types';`
  - [ ] `export type { MultiSelectOption, Step } from './components/input/types';`
  - [ ] `export type { MasonryItem } from './components/layouts/GlassMasonryGrid';`
- [ ] Export missing hooks + contexts inside the “Enhanced Hooks” / “Library Utilities” region:
  - [ ] `export { useEnhancedReducedMotion } from './hooks/useEnhancedReducedMotion';`
  - [ ] `export { useQualityTier, getQualityBasedPhysicsParams, getQualityBasedGlassParams } from './components/charts/hooks/useQualityTier';`
  - [ ] `export { useTheme, useThemeVariant, useThemeProviderPresence } from './theme/ThemeProvider';`
  - [ ] `export { AnimationProvider, useAnimation } from './contexts/AnimationContext';`
  - [ ] Ensure `export * from './hooks/extended';` continues to expose `useZSpaceAnimation`; add explicit named exports if tree-shaking drops them: `export { useZSpaceAnimation, useParallaxZSpace, useCardStackZSpace } from './hooks/extended/useZSpaceAnimation';`
- [ ] Add new exports for new files to be created (`useDeviceCapabilities`, accessible animation barrel, `useChartPhysicsInteraction`).
- [ ] After edits run `npm run build` to verify Rollup catches duplicate export names (e.g., `SpringConfig` collision) and adjust with explicit named exports where necessary.

src/hooks/useEnhancedReducedMotion.ts
-------------------------------------
- [ ] Confirm hook respects SSR (no direct `window` access without guards).
- [ ] Add JSDoc describing return value and relationship to `useReducedMotion`.
- [ ] Ensure default export removed (use named export) to keep tree shaking predictable.
- [ ] Import and re-export via `src/index.ts` (`export { useEnhancedReducedMotion } ...`).

src/components/charts/hooks/useQualityTier.ts
---------------------------------------------
- [ ] Confirm hook signature and types match package expectations.
- [ ] Create explicit named exports for helper functions + types at bottom of file if not already exported.
- [ ] Export `useQualityTier`, `getQualityBasedPhysicsParams`, `getQualityBasedGlassParams` via `src/index.ts`.
- [ ] Re-export associated `ChartQualityTier` type for external typing.

src/theme/ThemeProvider.tsx
---------------------------
- [ ] Surface named exports for `useTheme`, `useThemeVariant`, `useThemeProviderPresence`, `useThemeObserver`, and `useThemeProviderPresence`.
- [ ] Ensure exports are stable (avoid recreating functions each render).
- [ ] Document these functions with JSDoc to clarify they are public API.
- [ ] Update `src/index.ts` to re-export the hooks plus `ThemeProvider` if not already exported.

src/contexts/AnimationContext.tsx
---------------------------------
- [ ] Validate `AnimationProviderProps` interface and ensure defaults for context value.
- [ ] Export both `AnimationProvider` and `useAnimation` as named exports.
- [ ] In `src/index.ts`, add `export { AnimationProvider, useAnimation } from './contexts/AnimationContext';`.
- [ ] Consider adding a simple test or story to ensure provider works after being exported.

src/components/card/GlassCard.tsx & src/types.ts
------------------------------------------------
- [ ] Keep `GlassCardProps` declared in component file; add `export type { GlassCardProps };` at bottom if not already.
- [ ] Remove duplicate type definitions from `src/types.ts` to avoid confusion (or align them).
- [ ] Update `src/index.ts` to re-export from the component file.

src/components/input/GlassDateRangePicker.tsx
---------------------------------------------
- [ ] Confirm `DateRange` interface is stable.
- [ ] Add `export type { DateRange }` inside file and re-export through `src/index.ts`.
- [ ] Consider sharing this type with any other components referencing date ranges to avoid duplication.

src/components/charts/GlassDataChart.tsx
----------------------------------------
- [ ] Validate `ChartDataset` interface.
- [ ] Export type plus supporting chart interfaces if needed (`DataPoint`, `PhysicsParams`).
- [ ] Move any helper types to a separate `types.ts` file if they need to be reused elsewhere and re-export via `src/index.ts`.
- [ ] Update stories/docs referencing old type names.

src/components/data-display/types.ts
------------------------------------
- [ ] Export `ColumnDefinition`, `SortState`, `GlassDataGridProps` for downstream usage.
- [ ] If these types overlap with `src/types.ts`, consolidate to single source.
- [ ] Add unit tests or lint rules to ensure columns typed correctly (optional).

src/components/input/types.ts
-----------------------------
- [ ] Export `MultiSelectOption`, `Step`, `OptionGroup`, `MultiSelectProps` as needed.
- [ ] Ensure `export type { MultiSelectOption, Step }` statements exist for tree-shaking.
- [ ] Update any files importing from deep paths to use the new barrel exports.

src/components/layouts/GlassMasonryGrid.tsx
-------------------------------------------
- [ ] Export `MasonryItem` type.
- [ ] Confirm layout component itself is exported (currently `GlassMasonry` vs `GlassMasonryGrid`).
- [ ] If necessary, add `export type { MasonryItem }` and re-export in `src/index.ts`.
- [ ] Update docs/stories referencing `GlassMasonry` vs `GlassMasonryGrid`.

New Utilities / Hooks to Implement
----------------------------------
1. `useDeviceCapabilities` hook
   - [ ] File: `src/hooks/useDeviceCapabilities.ts`
   - [ ] Implementation details:
       - `import { useEffect, useState } from 'react';`
       - Wrap existing `detectDevice` from `src/utils/deviceCapabilities` and store result in state.
       - Expose shape `{ deviceInfo, reload: () => void }`, memoized for SSR (return defaults when `typeof window === 'undefined'`).
   - [ ] Export via `src/index.ts` under Enhanced Hooks.

2. Accessible animation utilities barrel
   - [ ] File: `src/animations/accessible/index.ts`
   - [ ] Implementation details:
       - Re-export `prefersReducedMotion` & `createAccessibleAnimation` from `../accessibleAnimation`.
       - Add future-proof placeholder exports (commented) to keep structure consistent.
   - [ ] Update `src/index.ts` to include `export * from './animations/accessible';`.

3. `useChartPhysicsInteraction` hook
   - [ ] File: `src/components/charts/hooks/useChartPhysicsInteraction.ts`
   - [ ] Implementation specifics:
       - Move logic currently in `GlassDataChart.tsx` lines ~40-60.
       - Provide a reusable hook signature: `useChartPhysicsInteraction(chartRef, wrapperRef, options)`.
       - Ensure types for options (pan/zoom speeds, bounds) and return object (`isPanning`, `zoomLevel`, `applyZoom`, `resetZoom`).
   - [ ] Update `GlassDataChart.tsx` to import from the new file.
   - [ ] Export hook via `src/index.ts` (under Enhanced Hooks or chart-specific exports).

Documentation & Examples
------------------------
- [ ] Update README / docs to reflect accurate component names (`GlassResponsiveNav` instead of generic `ResponsiveNavigation`).
- [ ] Document new exports in `docs/README.md` and component reference pages.

Validation Tasks
----------------
- [ ] Run `npm run typecheck` to ensure new exports don’t introduce TS errors.
- [ ] Run `npm run build` to confirm Rollup bundle succeeds after export changes.
- [ ] (Optional) Add smoke tests ensuring new hooks/components can be imported from the package entry.

Notes
-----
- Creating new files (e.g., `src/hooks/useDeviceCapabilities.ts`, extracted `useChartPhysicsInteraction`) must include full production-ready implementations plus barrel exports.
- Keep naming consistent with existing “Glass*” convention for components and `use*` for hooks.
