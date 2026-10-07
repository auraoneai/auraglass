# PROMPT-10b (OVL): Shared overlay layer, lint rules and test harnesses

You are implementing part of PRD-OVL (Flagship Overlays) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`, 5.0 work on `main`). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` §3 items 2–4, §4.1–4.5, §5.1 (REQ-OVL-01..15), §12.1 (`_shared/*` rows), §12.2 (`overlay-motion`, `overlay-a11y-modes`), §16.2.
- Layout and foundation: `docs/auraglass-5/prompts/PROMPT_10_OVL.md` "File layout" (binding); `docs/auraglass-5/prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.2–4.3 (`src/foundation/{types,parts,portal}.ts`).
- Consumed contracts:
  - PRD-MAT `AURAGLASS_MATERIAL_ENGINE_PRD.md`: REQ-MAT-28 (scrim sibling, `data-ag-full-height`), -29 (blur values), -52 (dev counter); `src/material/{materialProps.ts,Surface.tsx,SurfaceGroup.tsx}`.
  - PRD-A11Y `AURAGLASS_ACCESSIBILITY_PRD.md`: REQ-A11Y-32..34, §4.5 `LayerStack` (`src/theme/layers/LayerStack.ts`, `useLayer.ts`).
  - PRD-MOT `AURAGLASS_MOTION_PRD.md`: duration/ease tokens, REQ-MOT-16, -20.
- Architecture: §4.6 (nesting, backdrop root, `will-change`), §4.7 (6/3 budget, scrim ≤12px), §6, §8, §9.1.
- Contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-16 (lint namespace; OVL owns only `no-overlay-global-listeners`), SC-20 (`@layer` statement), SC-21 (OVL attributes), SC-25 (portal, `LayerStack`), SC-29 (lanes, QA-owned configs), SC-30 (test paths).
- Tasks: `docs/auraglass-5/tasks/OVL.json` OVL-020..OVL-039. Anchor prerequisites: FND-001/005/007, MAT-015/020/046/047/048/055, A11Y-029/049/051, DS-026, PKG-015/086/089, QA-003/018/031/082/085.

Requirements: REQ-OVL-01, -02, -04 (CSS), -06 (harness), -09, -10, -11, -12 (CSS), -14 (modules), -15. Acceptance: AC-OVL-12 (rules), and harnesses for AC-OVL-02/-08/-10/-15 that later prompts parametrise.

## 2. Scope
May create or modify:
- NEW `src/components/overlays/_shared/`:
  - `overlayPortal.tsx`
  - `overlaySurface.ts`
  - `positioning.ts`
  - `useOverlayLayer.ts`
  - `useOverlayAnimating.ts`
  - `overlays.css`
  - `index.ts` (internal, not exported from the package)
- NEW tests in `src/components/overlays/_shared/`:
  - `overlay-layer.test.tsx`
  - `overlay-dom-contract.test.tsx`
  - `overlay-idle.test.tsx`
  - `overlay-dev-counter.test.tsx`
  - `popup-contract.test.tsx`
  - `overlay-ssr.test.tsx`
  - `lint-overlays.test.ts`
  - `__fixtures__/lint/*.tsx`
- NEW `tests/e2e/overlays/overlay-motion.spec.ts`, NEW `tests/e2e/overlays/overlay-a11y-modes.spec.ts` (harness only; subjects added by later prompts)
- `eslint-plugin-auraglass.js` (PKG-owned, MODIFY after PKG-015): add the rule `auraglass/no-overlay-global-listeners` only. Render purity (`Date.now()`/`new Date()` in render) is PKG's `auraglass/no-random-in-render` (PKG-086). Don't add `no-date-now-in-render` (SC-16)
- `eslint.config.js`: register `auraglass/no-overlay-global-listeners` as `error` for the overlay file set, and confirm that PKG-089 has `auraglass/no-random-in-render` at `error` there. Also add a `no-restricted-imports` block scoped to the overlay file set
- `playwright.config.ts` (QA-owned, MODIFY after QA-003/QA-018, SC-29): add projects `overlays-chromium`, `overlays-webkit` and `overlays-firefox` (testMatch `tests/a11y/apg/{dialog,alert-dialog,sheet,popover,tooltip,menu,context-menu,menubar,toast}.apg.spec.ts` and `tests/e2e/overlays/*.spec.ts`), plus `overlays-perf` (testMatch `tests/perf/browser/overlays-*.spec.ts`, Chromium, driven by PERF-039 `tests/perf/harness/run-perf.mjs`)
- `jest.config.js`: `testMatch` additions only, if the new paths aren't matched already
- `certification/playwright.cert.config.ts` (QA-018, MODIFY; OVL-037): register the overlay specs in L5 Behaviour (APG specs are imported by QA-082), L8 Engine-specific and L10 Performance (QA-085). They run through QA's `certify-pr.yml` (QA-031). There is no overlay-specific workflow (SC-29). If QA-031 is missing, OVL-037 is blocked.

Must NOT touch: `src/material/**` (PRD-MAT), `src/theme/**` (PRD-A11Y), `src/foundation/**` (foundation PRD), any 4.x overlay file, `src/index.ts`, `package.json` `dependencies`.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- `rg '"@base-ui/react": "[0-9]' package.json` shows an exact-pinned version (REQ-FND-01).
- `test -f src/foundation/types.ts && test -f src/foundation/parts.ts && test -f src/foundation/portal.ts`
- `test -f src/material/materialProps.ts && test -f src/material/Surface.tsx && test -f src/material/SurfaceGroup.tsx && test -f src/material/dev/surfaceCounter.ts` (PRD-MAT: MAT-046, -047, -048, -055)
- `rg -n "ag-surface .ag-surface:not\(\[data-ag-allow-nested\]\)" src/material/css/material.css` (nesting rule, MAT-020)
- `test -f src/theme/layers/LayerStack.ts` and `rg -n "data-ag-portal-root" src/theme/AuraGlassProvider.tsx` (PRD-A11Y)
- DS-026 motion tokens (`tokens/sys/motion.tokens.json`, emitted by DS-016): `rg -n -- "--ag-duration-(small|medium|large)" src` returns the generated CSS.
- `rg -n "data-modal|scrim" src/material/css/material.css`. Read it to settle conflict 1 in the index: if PRD-MAT renders its scrim as a pseudo-element of the popup, stop and file the conflict. Don't add a second scrim.

## 4. Steps
1. **OVL-020 `overlayPortal.tsx`.** `OverlayPortal({ children, keepMounted })` renders the Base UI `*.Portal` passed via a `component` prop with `container={usePortalContainer()}`. Without a provider, the container is `document.body` and it emits one dev warning per page load: `[aura-glass] Overlay rendered without <AuraGlassProvider>; portalling to document.body.`
2. **OVL-021 `overlaySurface.ts`.** `overlayMaterial(kind: "dialog"|"alert"|"sheet"|"popover"|"menu"|"tooltip"|"toast")` returns `{ ...materialProps({ layer: "overlay", thickness, variant: "regular" }), "data-ag-overlay": kind }`, where thickness is `thick` for dialog/alert/sheet, `regular` for popover/menu and `thin` for tooltip/toast. It has no other options.
3. **OVL-022 `positioning.ts`.** `defaultPositionerProps = { sideOffset: 8, collisionPadding: 8, collisionAvoidance: { side: "flip", align: "shift" } }`. Expose `--ag-overlay-available-height: var(--available-height)` through `overlays.css`.
4. **OVL-023 `overlays.css`.** The first line is exactly `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` and all rules sit in `ag.components` (SC-20). The `[data-ag-obscured]` rule is not here: it goes in MAT's `ag.material` (OVL-058).
   - `.ag-scrim { position: fixed; inset: 0; backdrop-filter: blur(var(--_ag-scrim-blur)); }` with `--_ag-scrim-blur` taken from PRD-MAT's scrim token (≤12px). Background is the solved scrim tint, with no `::before`/`::after` and no grain.
   - `.ag-scrim[data-ag-overlay-depth]:not(:last-of-type) { backdrop-filter: none }`, so only the topmost scrim blurs.
   - Under `forced-colors: active` and `[data-ag-transparency="solid"]`: popups and scrims get `backdrop-filter: none`. Popups get `background-color: Canvas; color: CanvasText; border: 1px solid CanvasText`. The scrim gets `background: color-mix(in srgb, Canvas 60%, transparent)` under forced colors, and `rgb(0 0 0 / .5)` under solid.
   - Anchored popups get `transform-origin: var(--transform-origin)` and `max-height: var(--available-height)` with `overflow: auto`.
   - `[data-ag-animating] { will-change: transform, opacity }`.
   - No `transition: all`, no `!important`, no infinite animations, and `backdrop-filter`/`filter` are never transitioned.
5. **OVL-024 `useOverlayAnimating.ts`.** It sets `data-ag-animating` on the popup and scrim from the first `data-starting-style`/`data-ending-style` frame until `transitionend`/`transitioncancel` of the last property. It uses a ref callback with cleanup and no `setState` per frame.
6. **OVL-025 `useOverlayLayer.ts`.** It registers `{ id, kind, modal, onEscape }` with PRD-A11Y `useLayer()` while open. `onEscape` calls the root's `onOpenChange(false, { reason: "escape-key" })`. `LayerStack` (A11Y-049) is the only Escape dispatcher (SC-25). Route Base UI's per-root dismissal through it as FND-007's wrapper prescribes, so the root never handles Escape itself. The file adds no `document`/`window` listeners.
7. **OVL-026 ESLint rule / OVL-027 PKG rule check.**
   - `no-overlay-global-listeners` reports `document|window.addEventListener("keydown"|"mousedown"|"pointerdown"|"scroll"|"resize", …)` and any assignment to `document.body.style.*`.
   - OVL-027 adds no rule. It verifies that PKG's `auraglass/no-random-in-render` reports `Date.now()`/`new Date()` in a component body or JSX expression on overlay files. If `performance.now()` isn't covered, file the gap with PKG.
8. **OVL-028 `eslint.config.js`.**
   - Scope `no-overlay-global-listeners`, PKG's `no-random-in-render` and the existing `Math.random` ban as `error` to the overlay file set.
   - Add `no-restricted-imports` there for:
     - `**/primitives/Positioner`, `**/primitives/positioning/GlassPositioner`
     - `**/primitives/focus/FocusTrap`, `**/utils/a11yEnhancers`
     - `framer-motion`, `motion`, `**/primitives` (barrel `Motion`, MOTION-06)
     - `**/primitives/LiquidGlassMaterial`
9. **OVL-029 `lint-overlays.test.ts`.** RuleTester cases: invalid fixtures for each listener type, `document.body.style.overflow = "hidden"`, `Date.now()` in render and `data-time-spent={Date.now()}`. Valid cases for an effect-scoped `Date.now()` and Base UI usage. Also run ESLint over the real overlay file set and expect 0 errors once later prompts add files.
10. **OVL-030..035 jsdom harnesses.** Each exports a `describe.each(OVERLAY_SUBJECTS)` table (NEW `_shared/__tests__/subjects.ts`), which later prompts append to:
    - `overlay-layer`: portals into `[data-ag-portal-root]`, `document.body` has 0 direct overlay children, and the no-provider fallback emits one warning.
    - `overlay-dom-contract`: snapshot of the attribute-name set per part (not markup), the `data-state` values, absence of the 6 analytics attributes, and `Date.now`/`Math.random` spied at 0 calls during render.
    - `overlay-idle`: React `Profiler` `onRender` count is 0 over 2,000 ms of fake time after the enter transition, and `jest.getTimerCount()` is 0, or 1 per toast.
    - `overlay-dev-counter`: fixture with 5 (fine) / 2 (coarse) page `Surface`s plus one open subject gives exactly 1 warning naming it, and 0 under `NODE_ENV=production`.
    - `popup-contract`: `data-ag-part` positioner/popup/arrow, `data-side`, `data-ag-overlay` and the material attributes.
    - `overlay-ssr`: `renderToString` closed and `defaultOpen`, then `hydrateRoot` with `console.error` spied at 0 calls.
11. **OVL-036/037 remote projects.** Add the Playwright projects. In the config, add a guard that throws when `!process.env.CI && !process.env.AURAGLASS_REMOTE_RUNNER` for `overlays-*` projects, so they can't run on a Mac. Register the specs in the QA cert config lanes (Storybook static build, then the L5/L8/L10 lane entries in `certify-pr.yml`).
12. **OVL-038 `overlay-motion.spec.ts` harness.**
    - Computed `transition-duration` per kind: small 200/140 ms, medium 320/220 ms, large 450/320 ms.
    - Calm mode is opacity only, with duration kept.
    - `motion: none` shows the final state immediately.
    - `will-change` is `auto` at rest.
    - No WAAPI or rAF activity after settle (`document.getAnimations().length === 0`).
13. **OVL-039 `overlay-a11y-modes.spec.ts` harness.**
    - Forced colors, `prefers-contrast: more` and reduced transparency.
    - Under forced colors, the count of visible elements with `backdrop-filter` ≠ `none` is 0 and the popup has a `CanvasText` border.
    - `@axe-core/playwright` runs with colour contrast enabled and expects 0 serious/critical violations. Add it as a devDependency pinned exact only if it is absent, and list it in the report.

## 5. Tests to run
Local (light): `./node_modules/.bin/jest src/components/overlays/_shared` (the harnesses pass with an empty subject list only for `lint-overlays`; the others assert `OVERLAY_SUBJECTS.length > 0` from 10c onward, see note), `./node_modules/.bin/eslint src/components/overlays/_shared`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`.

Remote: one `overlays-chromium` dry run that lists 0 tests, which proves the wiring.

Note: in this prompt, harness files must not pass vacuously. Add a single internal fixture subject, NEW `_shared/__tests__/FixturePopover.tsx`, which is a real Base UI Popover wrapped with the shared modules (no mocks). Every harness runs against it and must go green. 10d replaces it with the real `Popover` and deletes it.

## 6. Visual evidence
None in this prompt; no shipped pixels change.

## 7. Integrity rules (binding)
- Never use local Docker or a local browser.
- No `jest.mock` of `@base-ui/react`, `AuraGlassProvider` or the material modules.
- No `test.skip`/`.only`/`fixme`.
- No lowered budgets.
- Don't relax lint rules with `eslint-disable` in overlay files.
- Don't add a second dev counter (REQ-OVL-11).

## 8. Exit criteria
- REQ-OVL-01/-15: `overlay-layer` and `overlay-dom-contract` are green on the fixture subject.
- REQ-OVL-02/-10, AC-OVL-12 (rules): `lint-overlays.test.ts` is green, and every invalid fixture fails.
- REQ-OVL-04/-09/-12: CSS rules exist; `overlay-motion` and `overlay-a11y-modes` run remotely on the fixture subject.
- REQ-OVL-06/-11/-14 and the SSR harness are green on the fixture.
- The Playwright projects are guarded against local runs.

## 9. Final report format
```
PROMPT-10b REPORT
Branch/SHA:
Tasks: OVL-020..039 -> done|blocked (reason) each
Escape routing: Base UI dismissal routed through LayerStack (SC-25) + evidence
Scrim conflict resolution (PRD-MAT REQ-MAT-28): …
Prereq blockers:
Tests: name -> pass/fail (local|remote URL)
DevDependencies added (exact versions):
Deviations (with evidence) or none
Files changed:
```
