# AuraGlass Glassmorphism Component Audit Master Prompt

Use this prompt when you need a reusable, full-library audit of glassmorphism implementation quality across AuraGlass components, stories, docs, pages, visual tests, and e2e coverage.

```text
You are auditing the AuraGlass React design system for glassmorphism quality, consistency, accessibility, and regression-test coverage.

Repository assumptions:
- The canonical component inventory is `reports/component_inventory.json`.
- Public report path exports live under `src/reports/**`.
- Component documentation lives under `docs/components/**`.
- Storybook component stories live under `src/components/**/*.stories.tsx` and gallery stories under `src/stories/**`.
- Visual regression tests live under `tests/visual/**`; e2e tests live under `tests/e2e/**`.
- Do not revert or overwrite unrelated edits. If the worktree is dirty, treat unrelated changes as user or peer work.

Audit goals:
1. Inventory every component listed in `reports/component_inventory.json`.
2. For each component, record whether it has direct Storybook coverage, component docs, unit tests, visual regression coverage, and e2e coverage where relevant.
3. Inspect glass design implementation signals:
   - Uses AuraGlass glass tokens or approved helpers such as `createGlassStyle`.
   - Avoids raw one-off glass values when tokens or helpers exist.
   - Applies visible glass material traits: translucent surface, blur/backdrop-filter or approved fallback, border/highlight, elevation/shadow, and radius.
   - Supports light and dark contexts without losing contrast.
   - Preserves focus visibility, ARIA semantics, keyboard behavior, and reduced-motion handling.
   - Handles high-contrast, reduced-motion, responsive, and no-backdrop-filter environments.
4. Inspect stories for glass design coverage:
   - At least one default glass state.
   - Variants for intent/tint, elevation/depth, size/layout, disabled/loading/error states where applicable.
   - Interactive states for hover, focus, active/pressed, open/closed, selected/unselected, drag/drop, or validation states where applicable.
   - Dark mode and reduced-motion examples for glass surfaces with animation or layered transparency.
5. Inspect visual tests for representative glass regressions:
   - Core primitives: buttons, cards, inputs, modal/overlay, navigation, data display, layout surfaces.
   - Token and material checks: blur progression, opacity, tint, radius, elevation, shadow, border, backdrop fallback.
   - Accessibility visual checks: focus rings, contrast, high contrast, reduced motion.
   - Responsive checks at mobile, tablet, desktop, and at least one dense/wide layout.
6. Produce prioritized findings. Mark each as Critical, High, Medium, or Low and include:
   - Component or category.
   - Evidence path and line when available.
   - Risk to glass design quality or users.
   - Exact remediation in docs, stories, tests, or component code.
   - Verification command.

Preferred workflow:
1. Run `git status --short`.
2. Read `reports/component_inventory.json` and calculate category totals.
3. Build normalized name maps for:
   - `src/components/**/*.tsx`
   - `src/components/**/*.stories.tsx`
   - `src/components/**/*.test.tsx`
   - `docs/components/**/*.md`
   - `tests/visual/**/*.{spec.ts,test.js}`
   - `tests/e2e/**/*.spec.ts`
4. Compare maps against the inventory and report missing direct coverage.
5. Inspect a representative sample from every category, plus every component missing story/docs/visual coverage.
6. Add or update only the smallest necessary docs, stories, reports, visual tests, or e2e tests. Do not modify component implementations unless explicitly assigned.
7. Run focused verification before finalizing.

Recommended verification:
- `npm run typecheck`
- `npm run lint:check`
- `npx playwright test tests/visual/design-system/glass-audit-coverage.spec.ts --project=chromium`
- `npm run test:visual:tokens`
- `npm run test:visual:components`
- `npm run test:e2e`

Final response format:
- Prompt created or updated, with path.
- Issues found, ordered by severity.
- Files changed.
- Verification commands and results.
- Remaining risks and follow-up recommendations.
```

## Minimum Acceptance Criteria

- The audit output must be reproducible from the current repository state.
- All coverage counts must identify their source and matching strategy.
- Story and visual-test gaps must be separated from component implementation gaps.
- No unrelated files or peer changes may be reverted.
- Any generated fixes must include a focused verification command.
