# PROMPT-00c (TRUST): conditional hooks, RSC entry directives, hydration, Slot ref

Source PRD: `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` (PRD-00) §2.3, §4.4 (hook hoisting, hydration-stable first render, Slot ref), §5.4, §7, §11, §12, §15, §16, §5.11 (REQ-TRUST-53, -55), §20 steps 5–6. Architecture §9.2 (Slot), deviations 4, 6, 7, 8 of the PRD. SC-36 accepted intake (NAV E-22, FND AC-FND-02).
Requirements: REQ-TRUST-21, -22, -23, -24, -25, -26, -27, -53, -55. Acceptance: AC-TRUST-08 (rules-of-hooks half), -09, -10, -11, -25, -27.
Tasks: TRUST-028..TRUST-040, TRUST-086, TRUST-087, TRUST-090, TRUST-091. Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`.

## Common rules (binding)

0. Shared contract registry `docs/auraglass-5/prd/_shared-contracts.md` (binding; a registry row wins over PRD or prompt text). Use only registry names: `.github/workflows/publish-npm.yml` (never `release.yml`), `etc/api/` (root slug `index`), `tests/release/`, repo-root `deprecations.json` (`version: 1`), `scripts/ci/lib/{npm-pack,evidence-dir}.js` (no `scripts/lib/`), `auraglass/motion-no-empty-animate`, artifact `retention-days` 14 PR / 30 main / 90 release, unchanged `glass-pipeline.yml` job names (SC-02..SC-07, SC-10, SC-11, SC-16). `depends_on` in `tasks/TRUST.json` holds only real task ids (SC-40).
1. Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` is canonical; deviations declared in the PR with evidence.
2. Remote-first: no `npm run build`, `next build`, integration scripts, full `npx jest --ci`, React 19 install/run, Playwright or Storybook build on the Mac. Use GitHub Actions on the PR (read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or `auraone-remote-run`. Local: `rg`, `git`, `npx eslint <touched files>`, `npx jest <one named test file>`.
3. Forbidden: placeholder implementations; `.skip`/`.only`/`xit`; `--passWithNoTests`; `continue-on-error`; `|| true`; `--no-verify`; `// eslint-disable` for `react-hooks/*`; lowered thresholds; `jest -u`. Hoisting must not change rendered output or ARIA; if an existing snapshot changes, stop and report the diff (it means behaviour changed).
4. D-32: no evidence committed. 5. Public API frozen: `usePredictiveEngine`, `useEyeTracking`, `useBiometricAdaptation`, `useSpatialAudio`, `useAchievements`, `useInteractionRecorder` keep signatures and still throw outside providers; the new `useOptional*` readers are **not exported** from any `index.ts`. No `package.json` `dependencies`/`peerDependencies`/`exports` change. 6. Conventional commits, no `!`, `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

- PROMPT_00a merged: `test -f scripts/ci/lib/npm-pack.js` and `pack-matrix` green on `main` (the RSC `next build` of step 7 relies on the npm 11 pack fix).
- Re-measure baseline and paste in the PR: `rg --pcre2 -c "(\?|&&)\s*use[A-Z]\w*\(" src --glob '!*.stories.*' --glob '!*.test.*'` (expected 109 lines / 24 files).

## May touch

`eslint.config.js` (react-hooks block only); the 24 files: `src/components/toggle-button/ToggleButton.tsx`, `src/components/button/GlassFab.tsx`, `src/components/button/GlassButton.tsx`, `src/components/navigation/GlassHeader.tsx`, `src/components/modal/GlassDrawer.tsx`, `src/components/layout/GlassContainer.tsx`, `src/components/interactive/GlassKanban.tsx`, `src/components/interactive/GlassChat.tsx`, `src/components/interactive/GlassCarousel.tsx`, `src/components/data-display/GlassDataTable.tsx`, `src/components/charts/ModularGlassDataChart.tsx`, `src/components/charts/GlassChart.tsx`, `src/utils/a11yEnhancers.tsx`, `src/utils/a11yHooks.ts`, `src/components/input/{GlassSwitch,GlassStepper,GlassSlider,GlassRadioGroup,GlassInput,GlassCheckboxGroup,GlassCheckbox}.tsx`, `src/components/modal/{GlassModal,GlassHoverCard,GlassBottomSheet}.tsx`; any other file `react-hooks/rules-of-hooks` flags (list in PR); `src/components/advanced/{GlassPredictiveEngine,GlassEyeTracking,GlassBiometricAdaptation,GlassSpatialAudio,GlassAchievementSystem}.tsx` (add readers only); `src/primitives/index.ts`, `src/theme/index.ts` (first line); NEW `scripts/ci/client-entries.json`; `scripts/ci/verify-pack.js` (directive assertion); `scripts/ci/run-next-integration.js` (RSC page + `next build`); `src/components/ssr/AuraGlassClientBoundary.tsx`, `src/hooks/useEnhancedReducedMotion.ts`, `src/hooks/useDeviceCapabilities.ts`; `src/primitives/Slot.tsx`; `.github/workflows/glass-pipeline.yml` (`react19-smoke` and `unit-react19` jobs only; existing job names unchanged, SC-10); `src/components/interactive/GlassCommandPalette.tsx` (fuzzy filter escape only); the jest setup file used by `jest.config.js` (React 19 `element.ref` spy gated by `AURAGLASS_FAIL_ON_ELEMENT_REF`); NEW `docs/release/decisions/4.1.1-react19-matrix.md`; NEW tests listed below.

## Must not touch

`src/index.ts` (no export changes), `package.json`, reduced-motion `animate=` sites (00d — if a file is in both sets, change only hook lines here), `src/primitives/slot/GlassSlot.tsx` unless it reads `element.ref` itself (check with `rg -n "\.ref\b" src/primitives/slot`), `README.md`.

## Steps

1. TRUST-028 (REQ-TRUST-21). Register `eslint-plugin-react-hooks` (already devDependency `package.json:461`) in `eslint.config.js` flat config for `src/**/*.{ts,tsx}` excluding `**/*.test.*`, `**/*.stories.*`: `react-hooks/rules-of-hooks: 'error'`. Push; record the CI count of violations (before hoisting) in the PR.
2. TRUST-029 (REQ-TRUST-22). Next to each provider hook add internal readers: `useOptionalPredictiveEngine`, `useOptionalEyeTracking`, `useOptionalBiometricAdaptation`, `useOptionalSpatialAudio`, `useOptionalAchievements` (`return useContext(XContext) ?? null`) and `useOptionalInteractionRecorder(elementId: string | undefined, enabled: boolean)` in `GlassPredictiveEngine.tsx` (beside `useInteractionRecorder` at `:1128`; returns no-op handlers when `!enabled` or context null, and registers nothing). Export them only via a non-public relative import (e.g. named export from the file, not added to any barrel; verify `rg -n "useOptional" src/index.ts src/**/index.ts` = 0).
3. TRUST-030/-031/-032 (REQ-TRUST-22). Hoist per PRD §4.4 in three PRs if > 40 files change: (030) button, toggle-button, input/*; (031) layout, navigation, modal/*; (032) interactive/*, data-display, charts/*, `src/utils/a11yEnhancers.tsx`, `src/utils/a11yHooks.ts` (e.g. `:375` `const labelIdRaw = useA11yId('label'); const labelId = label ? labelIdRaw : undefined;`). Pattern: `const x = useX(args); const value = cond ? x : undefined`; provider hooks → `const engine = useOptionalPredictiveEngine(); const predictiveEngine = predictive ? engine : null;`. Also fix hooks after early returns/in loops reported by step 1. After: `rg --pcre2 "(\?|&&)\s*use[A-Z]\w*\(" src --glob '!*.stories.*' --glob '!*.test.*'` = 0 and CI `lint:check` shows 0 `rules-of-hooks` errors.
4. TRUST-033. `src/components/input/GlassInput.hooks.test.tsx`: rerender `errorText` undefined → `"x"` → undefined and toggles of `label`/`helperText`: no throw, no `console.error` matching `/Rendered (more|fewer) hooks|change in the order of Hooks/`; `aria-describedby`, `aria-invalid`, label `htmlFor` ids identical to pre-change values and stable across rerenders.
5. TRUST-034. `src/__tests__/hooks-order.test.tsx` per PRD §12: for each of the 24 files' exported components toggle every gating prop over 3 rerenders; `<GlassButton predictive eyeTracking adaptive spatialAudio trackAchievements>` and `<GlassContainer predictive …>` with no provider render without throwing and with 0 listeners/timers/`Worker`/`AudioContext` (spies on `addEventListener`, `setInterval`, `setTimeout`, `window.Worker`, `window.AudioContext`); `renderHook(() => usePredictiveEngine())` outside provider still throws.
6. TRUST-035/-036 (REQ-TRUST-23). Add `"use client";` as the first statement of `src/primitives/index.ts` and `src/theme/index.ts`. Create `scripts/ci/client-entries.json` listing every `exports` key whose source calls `createContext` or a React hook (at least `./primitives`, `./theme`; derive the rest with `rg -l "createContext|use[A-Z]\w*\(" ` over each entry's source and list them). Extend `verify-pack.js` to assert the built `dist/<entry>/index.{mjs,js}` first statement is `"use client";` for each listed entry. Test `tests/ci/use-client-entries.test.ts` reads built `dist` in CI.
7. TRUST-037 (REQ-TRUST-24). In `run-next-integration.js` React 19 app, generate `app/rsc/page.tsx` (no directive) importing from `aura-glass/primitives` and `aura-glass/theme` and rendering a client child; run `next build` (not only `next dev`); exit non-zero on failure; logs to `evidenceDir('integration')` (`scripts/ci/lib/evidence-dir.js`). 4.x-line edit only; PKG-142 removes this script on `main` for 5.0 (SC-39).
8. TRUST-038 (REQ-TRUST-25). `AuraGlassClientBoundary.tsx:14` → `useState(false)` + `useEffect(() => setMounted(true), [])`. `useEnhancedReducedMotion` → initial `true` on server and client, `matchMedia` read + listener in `useEffect`; fix the "SSR-safe" JSDoc at `:9` to describe the conservative first render. `useDeviceCapabilities` → initial `{ ...DEFAULT_DEVICE_INFO }`, `detectDevice()` in `useEffect`. Test `src/__tests__/ssr/hydration.test.tsx` per PRD §12 (`renderToString` → `hydrateRoot` with `onRecoverableError` spy; `matchMedia` reduce=false; desktop UA).
9. TRUST-039 (REQ-TRUST-26). `Slot.tsx:76`: `const isReact19 = Number.parseInt(React.version, 10) >= 19; const childRef = isReact19 ? (child.props as { ref?: React.Ref<HTMLElement> }).ref : (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;`. Test `src/primitives/__tests__/Slot.ref.test.tsx`: outer + child refs receive the `HTMLButtonElement`; child without ref; on React 19 zero `console.error` containing `element.ref`.
10. TRUST-040 (REQ-TRUST-27). Add job `react19-smoke` to `glass-pipeline.yml`: `npm ci`, `npm i --no-save react@19 react-dom@19 @types/react@19 @types/react-dom@19`, `npx jest --ci src/__tests__/ssr/hydration.test.tsx src/primitives/__tests__/Slot.ref.test.tsx src/primitives/native-primitives.test.tsx`; upload `.artifacts/**` as `evidence-react19-smoke-${{ github.sha }}` with `retention-days` per SC-07 (14 PR / 30 main / 90 release).
11. TRUST-086 (REQ-TRUST-53; NAV E-22, SC-36). `GlassCommandPalette.tsx:298-303`: escape each query character with `c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` before `join('.*')`. No API change; results for metacharacter-free queries unchanged. Do not port NAV's 5.0 `commandScore` (REQ-NAV-59) here.
12. TRUST-087. `src/components/interactive/__tests__/GlassCommandPalette.regex.test.tsx` per PRD §12: each of `( [ * + ? \ ^ $ | { }` typed → no throw; label containing `(` still matches; `abc` results equal a 4.1.0 fixture.
13. TRUST-090 (REQ-TRUST-55; FND AC-FND-02, SC-36). Add job `unit-react19` (needs TRUST-039/-040 merged): `npm ci`, `npm i --no-save react@19 react-dom@19 @types/react@19 @types/react-dom@19`, `AURAGLASS_FAIL_ON_ELEMENT_REF=1 npx jest --ci` (full suite); the setup spy fails the run on any `console.error` matching `/element\.ref/`. Same SC-07 upload. The dev install stays React 18.2.
14. TRUST-091. Record the first `unit-react19` run (URL, totals) in `docs/release/decisions/4.1.1-react19-matrix.md`; list React-19-only failures unrelated to `element.ref` as non-gating with an owner key. Never skip or weaken them in the suite.

## Tests to run

Local: each new jest file singly (React 18 dev install). Remote (PR CI): `lint:check`, full `npx jest --ci`, `react19-smoke`, `unit-react19`, `test:integration:next` (with `next build`), `verify:pack` + `tests/ci/use-client-entries.test.ts`.

## Visual evidence (remote)

`auraone-remote-run` on CI-built `storybook-static/` at the PR SHA: `GlassInput` story with `errorText` at 390×844 and 1440×900 — screenshot plus `document.documentElement.scrollWidth <= innerWidth` assertion (PRD §14); console capture of the GlassButton/GlassInput stories showing 0 hook-order errors. Artifacts only.

## Exit criteria

AC-TRUST-08 (rules-of-hooks half: 0 `rules-of-hooks` errors; the conditional-hook `rg` = 0), AC-TRUST-09 (`next build` with the RSC page exits 0 in CI), AC-TRUST-10 (`hydration.test.tsx` 0 recoverable errors on React 18.2 and in `react19-smoke`), AC-TRUST-11 (`Slot.ref.test.tsx` green in `react19-smoke` with 0 `console.error`), AC-TRUST-25 (`GlassCommandPalette.regex.test.tsx` green), AC-TRUST-27 (`unit-react19` 0 `element.ref` errors; decision record merged).

## Final report

```
## PROMPT_00c report
Branch/PR(s): <urls>  Head SHA(s):
| REQ | Status | Commit | Evidence |
| AC  | Status | Evidence |
rules-of-hooks violations: before <N> (CI run url) → after 0; conditional-hook rg: 109 → 0
Files changed beyond the 24 (with reason):
client-entries.json entries:
Tests added + CI URLs (incl. react19-smoke, unit-react19, integration next):
React-19-only non-gating failures (from 4.1.1-react19-matrix.md):
Remote visual artifacts:
Deviations / Blockers:
```
