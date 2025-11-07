Fix Plan – AuraGlass Export & API Alignment
===========================================

Overview
--------
Objective is to align the documented/public API surface with actual implementation by exposing existing components/hooks/types, creating missing utilities when required, and updating docs. Tasks are organized by file with actionable checklists.

src/index.ts
------------
- [x] Export missing type definitions with explicit statements near the existing "Type exports" block:
  - [x] `export type { GlassCardProps } from './components/card/GlassCard';`
  - [x] `export type { DateRange } from './components/input/GlassDateRangePicker';`
  - [x] `export type { ChartDataset } from './components/charts/GlassDataChart';`
  - [x] `export type { ColumnDefinition, SortState } from './components/data-display/types';`
  - [x] `export type { MultiSelectOption, Step } from './components/input/types';`
  - [x] `export type { MasonryItem } from './components/layouts/GlassMasonryGrid';`
- [x] Export missing hooks + contexts inside the "Enhanced Hooks" / "Library Utilities" region:
  - [x] `export { useEnhancedReducedMotion } from './hooks/useEnhancedReducedMotion';`
  - [x] `export { useQualityTier, getQualityBasedPhysicsParams, getQualityBasedGlassParams } from './components/charts/hooks/useQualityTier';`
  - [x] `export { useTheme, useThemeVariant, useThemeProviderPresence } from './theme/ThemeProvider';`
  - [x] `export { AnimationProvider, useAnimation } from './contexts/AnimationContext';`
  - [x] Ensure `export * from './hooks/extended';` continues to expose `useZSpaceAnimation`; add explicit named exports if tree-shaking drops them: `export { useZSpaceAnimation, useParallaxZSpace, useCardStackZSpace } from './hooks/extended/useZSpaceAnimation';`
- [x] Add new exports for new files to be created (`useDeviceCapabilities`, accessible animation barrel, `useChartPhysicsInteraction`).
- [x] After edits run `npm run build` to verify Rollup catches duplicate export names (e.g., `SpringConfig` collision) and adjust with explicit named exports where necessary.

src/hooks/useEnhancedReducedMotion.ts
-------------------------------------
- [x] Confirm hook respects SSR (no direct `window` access without guards).
- [x] Add JSDoc describing return value and relationship to `useReducedMotion`.
- [x] Ensure default export removed (use named export) to keep tree shaking predictable.
- [x] Import and re-export via `src/index.ts` (`export { useEnhancedReducedMotion } ...`).

src/components/charts/hooks/useQualityTier.ts
---------------------------------------------
- [x] Confirm hook signature and types match package expectations.
- [x] Create explicit named exports for helper functions + types at bottom of file if not already exported.
- [x] Export `useQualityTier`, `getQualityBasedPhysicsParams`, `getQualityBasedGlassParams` via `src/index.ts`.
- [x] Re-export associated `ChartQualityTier` type for external typing.

src/theme/ThemeProvider.tsx
---------------------------
- [x] Surface named exports for `useTheme`, `useThemeVariant`, `useThemeProviderPresence`, `useThemeObserver`, and `useThemeProviderPresence`.
- [x] Ensure exports are stable (avoid recreating functions each render).
- [x] Document these functions with JSDoc to clarify they are public API.
- [x] Update `src/index.ts` to re-export the hooks plus `ThemeProvider` if not already exported.

src/contexts/AnimationContext.tsx
---------------------------------
- [x] Validate `AnimationProviderProps` interface and ensure defaults for context value.
- [x] Export both `AnimationProvider` and `useAnimation` as named exports.
- [x] In `src/index.ts`, add `export { AnimationProvider, useAnimation } from './contexts/AnimationContext';`.
- [x] Consider adding a simple test or story to ensure provider works after being exported.

src/components/card/GlassCard.tsx & src/types.ts
------------------------------------------------
- [x] Keep `GlassCardProps` declared in component file; add `export type { GlassCardProps };` at bottom if not already.
- [x] Remove duplicate type definitions from `src/types.ts` to avoid confusion (or align them).
- [x] Update `src/index.ts` to re-export from the component file.

src/components/input/GlassDateRangePicker.tsx
---------------------------------------------
- [x] Confirm `DateRange` interface is stable.
- [x] Add `export type { DateRange }` inside file and re-export through `src/index.ts`.
- [x] Consider sharing this type with any other components referencing date ranges to avoid duplication.

src/components/charts/GlassDataChart.tsx
----------------------------------------
- [x] Validate `ChartDataset` interface.
- [x] Export type plus supporting chart interfaces if needed (`DataPoint`, `PhysicsParams`).
- [x] Move any helper types to a separate `types.ts` file if they need to be reused elsewhere and re-export via `src/index.ts`.
- [x] Update stories/docs referencing old type names.

src/components/data-display/types.ts
------------------------------------
- [x] Export `ColumnDefinition`, `SortState`, `GlassDataGridProps` for downstream usage.
- [x] If these types overlap with `src/types.ts`, consolidate to single source.
- [x] Add unit tests or lint rules to ensure columns typed correctly (optional).

src/components/input/types.ts
-----------------------------
- [x] Export `MultiSelectOption`, `Step`, `OptionGroup`, `MultiSelectProps` as needed.
- [x] Ensure `export type { MultiSelectOption, Step }` statements exist for tree-shaking.
- [x] Update any files importing from deep paths to use the new barrel exports.

src/components/layouts/GlassMasonryGrid.tsx
-------------------------------------------
- [x] Export `MasonryItem` type.
- [x] Confirm layout component itself is exported (currently `GlassMasonry` vs `GlassMasonryGrid`).
- [x] If necessary, add `export type { MasonryItem }` and re-export in `src/index.ts`.
- [x] Update docs/stories referencing `GlassMasonry` vs `GlassMasonryGrid`.

New Utilities / Hooks to Implement
----------------------------------
1. `useDeviceCapabilities` hook
   - [x] File: `src/hooks/useDeviceCapabilities.ts`
   - [x] Implementation details:
       - `import { useEffect, useState } from 'react';`
       - Wrap existing `detectDevice` from `src/utils/deviceCapabilities` and store result in state.
       - Expose shape `{ deviceInfo, reload: () => void }`, memoized for SSR (return defaults when `typeof window === 'undefined'`).
   - [x] Export via `src/index.ts` under Enhanced Hooks.

2. Accessible animation utilities barrel
   - [x] File: `src/animations/accessible/index.ts`
   - [x] Implementation details:
       - Re-export `prefersReducedMotion` & `createAccessibleAnimation` from `../accessibleAnimation`.
       - Add future-proof placeholder exports (commented) to keep structure consistent.
   - [x] Update `src/index.ts` to include `export * from './animations/accessible';`.

3. `useChartPhysicsInteraction` hook
   - [x] File: `src/components/charts/hooks/useChartPhysicsInteraction.ts`
   - [x] Implementation specifics:
       - Move logic currently in `GlassDataChart.tsx` lines ~40-60.
       - Provide a reusable hook signature: `useChartPhysicsInteraction(chartRef, wrapperRef, options)`.
       - Ensure types for options (pan/zoom speeds, bounds) and return object (`isPanning`, `zoomLevel`, `applyZoom`, `resetZoom`).
   - [x] Update `GlassDataChart.tsx` to import from the new file.
   - [x] Export hook via `src/index.ts` (under Enhanced Hooks or chart-specific exports).

Documentation & Examples
------------------------
- [x] Update README / docs to reflect accurate component names (`GlassResponsiveNav` instead of generic `ResponsiveNavigation`).
- [x] Document new exports in `docs/README.md` and component reference pages.

Validation Tasks
----------------
- [x] Run `npm run typecheck` to ensure new exports don't introduce TS errors.
- [x] Run `npm run build` to confirm Rollup bundle succeeds after export changes.
- [x] (Optional) Add smoke tests ensuring new hooks/components can be imported from the package entry.

Notes
-----
- Creating new files (e.g., `src/hooks/useDeviceCapabilities.ts`, extracted `useChartPhysicsInteraction`) must include full production-ready implementations plus barrel exports.
- Keep naming consistent with existing "Glass*" convention for components and `use*` for hooks.

COMPLETION STATUS
-----------------
All tasks have been completed successfully:
- ✅ All type exports added to src/index.ts
- ✅ All missing hooks and contexts exported
- ✅ useEnhancedReducedMotion updated with SSR guards and JSDoc
- ✅ useDeviceCapabilities hook created
- ✅ Accessible animation barrel export created
- ✅ useChartPhysicsInteraction hook created
- ✅ All components already have proper type exports in their source files
- ✅ fixplan.md updated to reflect completion
