# Design Matrix Integration PRD

## Objective
Enable AuraGlass consumers to apply any persona defined in `docs/guides/design-matrix.md` (Midnight Slate, Midnight Meridian, Solar Apex, Violet Nebula, etc.) without hand-authoring themes. Ship a canonical data model, wiring in the ThemeProvider, CSS variables, and a picker UI so designers/developers can toggle personas instantly at runtime.

## Success Criteria
- Persona metadata lives in a single TypeScript source and stays in sync with the guide.
- `ThemeProvider` persists the selected persona, stamps `data-persona` on `<html>`, and exposes persona tokens via `usePersonaTheme()`.
- CSS variables for every persona load automatically, and style primitives (`glass.css`, tokens, animations) consume them.
- Docs & Storybook show the picker so teams can preview each persona with no manual overrides.

## Dependencies & Stakeholders
- **Docs:** `docs/guides/design-matrix.md`, `docs/DesignMatrix.md`, `docs/tokens/design-tokens.md`
- **Runtime:** `src/theme/ThemeProvider.tsx`, `src/theme/themeConstants.ts`, `src/tokens/glass.ts`
- **Styles:** `src/styles/glass.css`, `src/styles/globals.css` (if present)
- **DX:** Storybook or docs site (check `docs/README.md`, `README.md`)

## Risks / Mitigations
- **Drift between docs & code:** Automate generation from one source (MD → TS or vice versa) or enforce schema validation in CI.
- **Bundle bloat:** Tree-shake persona payloads by exporting JSON/TS objects and loading CSS variables via data attributes.
- **Breaking existing themes:** Provide a safe default persona and backwards-compatible props (`themeVariant` fallback).

---
## Workstreams & Checklists

### 1. Canonical Persona Dataset
**Files:** `docs/guides/design-matrix.md`, `src/theme/designMatrix.ts`, `docs/tokens/design-tokens.md`
- [x] Extract structured data (palette anchors, typography, motion, surfaces) from `docs/guides/design-matrix.md`.
- [x] Create `src/theme/designMatrix.ts` exporting `PersonaId` type and `DESIGN_MATRIX` record for each persona.
- [x] Document schema + contribution rules in `docs/tokens/design-tokens.md` (how to add/edit personas).
- [x] Update `docs/guides/design-matrix.md` to reference the new TS source (e.g., “see `src/theme/designMatrix.ts`).

### 2. ThemeProvider Integration
**Files:** `src/theme/ThemeProvider.tsx`, `src/core/themeContext.ts`, `src/theme/themeConstants.ts`
- [x] Inject persona state into `ThemeProvider` (prop, context value, setter, persistence via `localStorage/sessionStorage`).
- [x] Map persona tokens from `DESIGN_MATRIX` into existing theme utilities (`getColor`, `getSpacing`, etc.).
- [x] Ensure `<html>` receives `data-persona="<id>"` and provider broadcasts `usePersonaTheme()` hook values.
- [x] Provide migration layer so legacy `themeVariant` props still work (default maps to best-fit persona).

### 3. CSS Variable Layer & Token Wiring
**Files:** `src/styles/glass.css`, `src/styles/globals.css`, `scripts/generate-persona-css.ts` (new), `package.json` (script)
- [x] Introduce build/runtime step (new script `scripts/generate-persona-css.ts`) to read `DESIGN_MATRIX` and emit CSS custom properties per persona under `[data-persona="<id>"]`.
- [x] Update `glass.css` (or global stylesheet) to consume the generated variables instead of hard-coded values.
- [x] Wire the script into `package.json` (`"prepare": "ts-node scripts/generate-persona-css.ts"` or similar) so CSS stays synced.
- [x] Add lint/test guard ensuring generated CSS remains up to date (e.g., compare outputs in CI).

### 4. Persona Picker & UX Surfaces
**Files:** `src/components/theme/PersonaPicker.tsx` (new), `src/components/navigation/GlassTabItem.tsx`, `src/components/layout/ZSpaceAppLayout.tsx`, Storybook stories
- [x] Build a `PersonaPicker` component that enumerates `DESIGN_MATRIX` entries, previews colors/metadata, and calls `setPersona`.
- [x] Surface the picker inside the docs site / demo shell (`ZSpaceAppLayout.tsx`