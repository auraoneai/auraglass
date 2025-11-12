# AUTONOMOUS DESIGN MATRIX EXECUTION PROMPT

## PRIMARY DIRECTIVE
Execute the complete Design Matrix Integration PRD (`designmatrix-PRD.md`) from start to finish without any interruptions, pauses, or interim communications. Work autonomously through every workstream, task, and checklist item systematically.

## EXECUTION RULES
- **IMMEDIATE TASK ADDITION**: Add ALL workstreams and checklist items to your immediate to-do list at the start of execution
- **CONTINUOUS OPERATION**: Never pause, send updates, or communicate until ALL tasks are 100% complete
- **AUTONOMOUS JUDGMENT**: Rely solely on your own problem-solving abilities - no requests for clarification, feedback, or input
- **SYSTEMATIC PROGRESSION**: Complete tasks in the order specified in the PRD workstreams (1→2→3→4→5→6)
- **DOCUMENT UPDATES**: Update `designmatrix-PRD.md` immediately after completing each task by checking off completed items
- **COMPREHENSIVE REPORT**: Only after finishing EVERYTHING, submit a single comprehensive status report

## WORKSTREAM EXECUTION SEQUENCE

### WORKSTREAM 1: CANONICAL PERSONA DATASET
**Files**: `docs/guides/design-matrix.md`, `src/theme/designMatrix.ts`, `docs/tokens/design-tokens.md`

1. Read and analyze `docs/guides/design-matrix.md` to extract all persona definitions (Midnight Slate, Midnight Meridian, Solar Apex, Ultrathink, etc.)
2. Extract structured data including: palette anchors, typography settings, motion parameters, surface definitions
3. Create `src/theme/designMatrix.ts` with:
   - `PersonaId` type definition
   - `DESIGN_MATRIX` record containing all personas
   - Proper TypeScript interfaces for persona structure
4. Update `docs/tokens/design-tokens.md` with schema documentation and contribution guidelines
5. Update `docs/guides/design-matrix.md` to reference the new TypeScript source
6. Check off completed items in `designmatrix-PRD.md`

### WORKSTREAM 2: THEMEPROVIDER INTEGRATION
**Files**: `src/theme/ThemeProvider.tsx`, `src/core/themeContext.ts`, `src/theme/themeConstants.ts`

1. Analyze current `ThemeProvider` implementation
2. Inject persona state management (prop, context value, setter, persistence)
3. Map `DESIGN_MATRIX` tokens into existing theme utilities (`getColor`, `getSpacing`, etc.)
4. Ensure `<html>` receives `data-persona="<id>"` attributes
5. Implement `usePersonaTheme()` hook for component access
6. Create migration layer for legacy `themeVariant` props
7. Update `src/theme/themeConstants.ts` with persona-aware constants
8. Check off completed items in `designmatrix-PRD.md`

### WORKSTREAM 3: CSS VARIABLE LAYER & TOKEN WIRING
**Files**: `src/styles/glass.css`, `src/styles/globals.css`, `scripts/generate-persona-css.ts`, `package.json`

1. Create `scripts/generate-persona-css.ts` script to read `DESIGN_MATRIX` and emit CSS custom properties
2. Implement CSS generation logic for `[data-persona="<id>"]` selectors
3. Update `src/styles/glass.css` to consume generated variables instead of hard-coded values
4. Wire generation script into `package.json` build process
5. Add validation guards to ensure CSS stays synchronized
6. Test CSS generation across all personas
7. Check off completed items in `designmatrix-PRD.md`

### WORKSTREAM 4: PERSONA PICKER & UX SURFACES
**Files**: `src/components/theme/PersonaPicker.tsx`, `src/components/navigation/GlassTabItem.tsx`, `src/components/layout/ZSpaceAppLayout.tsx`, Storybook stories

1. Build `PersonaPicker` component enumerating all `DESIGN_MATRIX` entries
2. Implement color previews and metadata display in picker
3. Integrate picker into docs site/demo shell (`ZSpaceAppLayout.tsx`)
4. Add Storybook controls for persona selection
5. Update navigation/layout components to consume persona tokens
6. Ensure visual shifts happen automatically on persona changes
7. Test picker functionality across all personas
8. Check off completed items in `designmatrix-PRD.md`

### WORKSTREAM 5: DOCUMENTATION & ADOPTION
**Files**: `README.md`, `docs/README.md`, `docs/guides/design-matrix.md`, `docs/DesignMatrix.md`

1. Document setup steps in main README
2. Add usage snippets for `usePersonaTheme()` hook
3. Update docs site with persona picker integration
4. Create before/after visual examples for each persona
5. Document migration path from legacy themes
6. Update `CHANGELOG.md` with feature announcement
7. Validate all documentation links and examples
8. Check off completed items in `designmatrix-PRD.md`

### WORKSTREAM 6: QA & AUTOMATION
**Files**: `src/components/**/test.tsx`, `jest.config.js`, `playwright.config.ts`

1. Add unit tests for `usePersonaTheme()` hook
2. Implement visual regression tests for persona switching
3. Write Playwright smoke tests looping through all personas
4. Validate accessibility compliance across personas
5. Add CI guards for persona data integrity
6. Test CSS generation script in automated builds
7. Verify tree-shaking works for persona payloads
8. Check off completed items in `designmatrix-PRD.md`

## EXECUTION CONSTRAINTS
- **NO INTERRUPTIONS**: Execute all tasks without any communication until 100% completion
- **AUTONOMOUS PROBLEM SOLVING**: Use available tools and codebase knowledge to resolve any issues
- **IMMEDIATE DOCUMENTATION UPDATES**: Update `designmatrix-PRD.md` checkboxes after each completed task
- **COMPREHENSIVE VALIDATION**: Ensure each workstream is fully functional before moving to the next
- **FINAL REPORT ONLY**: Submit single comprehensive status report when everything is complete

## SUCCESS CRITERIA METRICS
- All personas from design-matrix.md available via runtime picker
- `ThemeProvider` persists selections and stamps `data-persona` on `<html>`
- CSS variables load automatically for all personas
- Components consume persona tokens via `usePersonaTheme()`
- Docs and Storybook demonstrate working persona switching
- All checklist items in `designmatrix-PRD.md` checked off
- No breaking changes to existing theme system

## FINAL DELIVERABLE
After completing ALL workstreams and tasks, provide a comprehensive status report covering:
- Execution summary and timeline
- All implemented features and files
- Testing results and validation
- Any technical decisions made
- Updated `designmatrix-PRD.md` with all checkboxes marked complete
