# AuraGlass Storybook Visual Certification Prompt

Use this prompt when the goal is to prove, with evidence, that all 356 AuraGlass glassmorphism components are fully upgraded, visually correct in Storybook, and personally inspected end to end.

This prompt is intentionally stricter than the general audit prompt. It must not be used to make a completion claim unless every inventory component has been mapped to runnable Storybook coverage or an explicit blocking gap has been fixed and reverified.

```text
You are performing an exhaustive Storybook visual certification of the AuraGlass React design system.

Your objective is to make this statement true, or explicitly prove why it is not yet true:

"All 356 AuraGlass glassmorphism components are fully upgraded, visually correct in Storybook, and personally inspected end to end."

Important truthfulness rule:
- Do not claim all 356 components are visually correct unless you personally render and inspect every inventory component through Storybook or a documented equivalent story harness.
- Do not infer visual correctness from TypeScript, lint, unit tests, static code review, or partial Storybook coverage.
- If any component lacks Storybook coverage, fails to render, has no meaningful visual glass state, has poor contrast, has overflow, has broken interaction, or cannot be inspected, the final answer must say certification is incomplete and list the blockers.

Repository assumptions:
- Canonical component inventory: `reports/component_inventory.json`.
- Existing report exports: `src/reports/**`.
- Storybook stories: `src/components/**/*.stories.tsx` and `src/stories/**/*.stories.tsx`.
- Visual tests: `tests/visual/**`.
- E2E tests: `tests/e2e/**`.
- Existing audit prompt: `docs/prompts/glassmorphism-component-audit-master-prompt.md`.
- Existing coverage snapshot, if present: `src/reports/glassmorphismAuditCoverage.ts`.
- Do not revert or overwrite unrelated edits. Treat a dirty worktree as user or peer work unless you can directly connect a file to this task.

Certification scope:
1. Load `reports/component_inventory.json`.
2. Confirm the exact inventory count. If it is not 356, report the actual count and use the actual count for all evidence.
3. Build a component-to-story map for every inventory component.
4. For each inventory component, identify one or more Storybook stories that exercise the actual component implementation.
5. If no story exists, create or fix the smallest useful story that renders the component in a meaningful glassmorphism state.
6. Render every mapped story in Storybook.
7. Personally inspect screenshots or live rendered pages for every component.
8. Fix every visual, accessibility, responsive, or interaction issue found.
9. Re-render and re-inspect every fixed component.
10. Produce a final certification report with per-component evidence.

Required visual inspection matrix:
- Desktop viewport: at least 1440x900.
- Mobile viewport: at least 390x844.
- Light theme or default theme.
- Dark theme when the component renders glass over dark, tinted, media, or atmospheric backgrounds.
- Reduced motion for components with animation, transitions, particles, canvas, WebGL, parallax, hover motion, entrance/exit motion, shimmer, pulse, or skeleton loading.
- Focus-visible state for every keyboard-focusable interactive component.
- Disabled/loading/error/empty/open/selected states where applicable.
- Dense/wide content state for data display, charts, tables, navigation, layout, and media components.

Glassmorphism correctness checklist for each component:
- Visible glass material is present where expected: translucent surface, blur/backdrop-filter or approved fallback, border/highlight, depth/elevation, radius, and readable foreground content.
- Uses AuraGlass tokens/helpers rather than raw one-off glass values unless a documented exception exists.
- Text and icons remain readable over varied backgrounds.
- No text clipping, overlap, illegible wrapping, unexpected truncation, or layout shift.
- Responsive layout works on mobile and desktop.
- Focus indicators are visible and not clipped.
- Interactive controls have correct hover, active, selected, disabled, loading, and keyboard states.
- Open/closed overlays, popovers, drawers, menus, modals, and mobile nav do not leak focus or scroll.
- Reduced motion disables or minimizes nonessential motion.
- High-contrast, no-backdrop-filter, and reduced-transparency fallbacks remain usable where possible.
- Canvas/WebGL/3D/media components render nonblank content and provide safe fallback content.
- Story controls and args do not hide required glass states.

Required implementation workflow:
1. Run:
   - `git status --short`
   - `npm run audit:components`
   - `npm run typecheck`
   - `npm run lint:check`
   - `npm run lint:tokens`
   - `npm run lint:styles`
2. Parse `reports/component_inventory.json`.
3. Generate a machine-readable inspection plan containing:
   - component name
   - category
   - source file
   - story file(s)
   - story id(s)
   - states/viewports/themes to inspect
   - certification status: `pending`, `passed`, `fixed`, `blocked`, or `missing-story`
4. Start Storybook with an available port.
5. Enumerate Storybook story IDs from the built index or Storybook iframe routes.
6. Use Playwright or the in-app browser to render each story.
7. Capture screenshots for every inspected component/state.
8. For each screenshot, inspect:
   - visible rendering
   - glass material
   - contrast/readability
   - layout and overflow
   - focus/interaction state where relevant
   - responsiveness
   - blank canvas/media failures
   - console errors and runtime exceptions
9. Fix component, story, token, or CSS issues immediately when found.
10. Re-run the failing story and update the inspection result.
11. Add or update visual regression tests for every repeated component-family issue.
12. Continue until every component is `passed` or `fixed`, or until the remaining blockers are explicit and reproducible.

Required automation artifacts:
- Create or update a report file, preferably `reports/glassmorphism-storybook-visual-certification.json`, with one entry per inventory component.
- Create or update a human-readable summary, preferably `reports/glassmorphism-storybook-visual-certification.md`.
- Store screenshot paths or Playwright artifact references for every inspected story/state.
- Add a guardrail test that fails if the certification report count drifts from the inventory count.

Required report schema:
Each component entry must include:
- `name`
- `category`
- `sourcePath`
- `storyPaths`
- `storyIds`
- `viewportsInspected`
- `themesInspected`
- `statesInspected`
- `screenshots`
- `consoleErrors`
- `issuesFound`
- `fixesApplied`
- `status`
- `verifiedCommands`
- `inspectedBy`
- `inspectedAt`

Allowed statuses:
- `passed`: rendered and visually correct without changes.
- `fixed`: issue found, code/story/test fixed, then re-rendered and visually verified.
- `blocked`: cannot certify; include exact blocker and next action.
- `missing-story`: no usable story exists yet; create one or keep certification incomplete.

Required final verification:
- `npm run typecheck`
- `npm run lint:check`
- `npm run lint:tokens`
- `npm run lint:styles`
- `npm run audit:components`
- focused Jest tests for every component family changed
- Playwright Storybook visual certification run
- any newly added visual regression tests

Final answer requirements:
1. Start with one of these exact statements:
   - `Certification complete: all inventory components were visually inspected and passed/fixed.`
   - `Certification incomplete: not all inventory components could be visually certified.`
2. Include the exact inventory count inspected.
3. Include counts by status: passed, fixed, blocked, missing-story.
4. Include links to the JSON and Markdown certification reports.
5. Include representative screenshot/artifact location.
6. Include all files changed.
7. Include all verification commands and results.
8. If certification is incomplete, list blockers first and do not use language implying all components are complete.

Do not stop after creating a plan. Execute the inspection, fix failures, re-run Storybook, and continue until certification is complete or blockers are explicit and reproducible.
```

## Minimum Acceptance Criteria

- Every component in `reports/component_inventory.json` has a certification entry.
- Every certification entry has at least one Storybook story ID or a `blocked`/`missing-story` status.
- Every `passed` or `fixed` entry has screenshot evidence.
- Every `fixed` entry includes the fix path and reinspection evidence.
- The final answer does not claim full certification if any entry is `blocked` or `missing-story`.
- Repo checks and relevant visual checks pass after fixes.
