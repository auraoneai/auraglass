# PROMPT-05b (A11Y): Preference runtime: resolver, store, `usePreference`, `AuraGlassProvider` attributes, `AuraGlassScript`

You are implementing part of PRD-05 for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`. Tasks: A11Y-020..A11Y-035 in `docs/auraglass-5/tasks/A11Y.json`.

## 1. Sources (read in full)
- PRD: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md`. Read deviations 7 and 8, §4.2 (resolution model), §4.4 (store), §5.1 REQ-A11Y-01/02/03/07, §5.4 REQ-A11Y-21..23, REQ-A11Y-31, REQ-A11Y-37, REQ-A11Y-39, §10 (API), §11 items 6–7, §12.1 and §16.
- `AURAGLASS_MATERIAL_ENGINE_PRD.md` REQ-MAT-52 (`startSurfaceCounter`) and REQ-MAT-54..56. The engine/tier detection is implemented in this script.
- `AURAGLASS_MOTION_PRD.md` REQ-MOT-20 (`prefers-reduced-motion: reduce` → at most `calm`).
- Architecture: D-10, D-11, §9.1, §14.5 B13.
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-11, SC-12, SC-15, SC-21, SC-23 (this PRD owns the `./theme` preference runtime; A11Y-027/029/032 are SC-40 anchors), SC-25.
- 4.x sources you replace (don't edit them): `src/components/accessibility/AccessibilityProvider.tsx` (legacy key `aura-glass-accessibility-settings` at `:67`), `src/hooks/useAccessibilitySettings.ts`, `src/utils/a11y.ts:970`.

Requirements: REQ-A11Y-01, 02 (unit), 03, 07 (unit), 21, 22, 23, 31, 37 (unit and bundle), 39 (store half). Acceptance: AC-A11Y-19 (store/provider half), AC-A11Y-23, AC-A11Y-25 (script and `./theme` rows).

## 2. Files
May touch:
- NEW under `src/theme/preferences/`: `types.ts`, `resolve.ts`, `storage.ts`, `media.ts`, `store.ts`, `usePreference.ts`, `prepaint.ts`
- NEW: `src/theme/preferences/__tests__/{resolve,store,usePreference}.test.ts(x)`
- NEW: `src/theme/AuraGlassProvider.tsx`, `src/theme/AuraGlassScript.tsx`, `src/theme/generated/prepaint-script.ts`
- NEW: `scripts/build/build-prepaint-script.mjs` (SC-11 layout; no top-level `scripts/*.mjs`)
- NEW: `src/theme/__tests__/{AuraGlassProvider,AuraGlassScript}.test.tsx`
- `src/theme/index.ts`: add exports only
- `package.json`: a `prebuild` hook calling `scripts/build/build-prepaint-script.mjs`

Must not touch:
- the portal root, layer stack and announcer (05d adds them to the provider; leave a marked `{/* 05d: portal root */}` slot)
- 4.x providers. `GlassThemeProvider`/`AccessibilityProvider` wrappers belong to PRD-17.
- motion CSS (PRD-06)
- `src/material/**`

## 3. Prerequisites
- 05a merged: `rg --files scripts/ci | rg verify-a11y-css.mjs` exists and the A11Y cells are registered in `certification/lanes.config.ts` (A11Y-019).
- PRD-02 exposes `./theme` in `package.json` `exports` (PKG-005 `build/exports.manifest.json`, SC-12), with its per-file `'use client'` directive lint and the jsdom side-effect gate. Check: `node -e "console.log(require('./package.json').exports['./theme'])"`. If it's missing, build and unit-test the source anyway, and record a blocker for the subpath.
- PROMPT-04 merged `Surface` (MAT-047) and `startSurfaceCounter` exists (`rg -n "export function startSurfaceCounter" src/material`). If it's missing, the provider omits the call behind a TODO that names REQ-MAT-52, and you report a blocker. Don't stub it.

## 4. Steps
1. **A11Y-020 `types.ts`**:
   - `PreferenceKey`, exactly as listed in PRD §4.4
   - `TransparencySetting = 'system'|'glass'|'tinted'|'solid'`
   - `ContrastSetting = 'system'|'standard'|'more'`
   - `MotionSetting = 'system'|'full'|'calm'|'none'`
   - `OsSignals { forcedColors; contrastMore; reducedTransparency; reducedMotion; coarsePointer: boolean }`
   - `ResolvedPreferences { transparency; contrast; motion; scheme; density; floors: { transparency: 'glass'|'tinted'|'solid'; contrast; motion; reasons: Array<'forced-colors'|'contrast-more'|'reduced-transparency'|'no-backdrop-filter'|'reduced-motion'> } }`
   - `PreferenceStorage` and `UserSettableKey`
2. **A11Y-021 `resolve.ts`**: pure functions with no DOM access:
   - `resolveTransparency` follows PRD §4.2 exactly: the ladder is glass 0, tinted 1, solid 2, and the result is the max of the OS floor, the capability floor, the app value, the user value, and `glassOpacity ≥ 0.7 → 1`. `glassOpacity` is clamped to [0,1].
   - `resolveContrast`: `less`/`custom` → standard; the string `high` never appears.
   - `resolveMotion`, per REQ-MOT-20.
   - `resolvePreferences(input) → ResolvedPreferences`. Forced colors → `solid` + `more`, which is absolute (REQ-A11Y-02).
3. **A11Y-022 `resolve.test.ts`**: generate the full cartesian product of 8 OS combos × 2 capability × 4 app × 4 user × glassOpacity {0, 0.69, 0.7, 1} = 1,024 cases. Assert `expect(cases).toHaveLength(1024)` and that no result falls below any floor. Named cases:
   - `"forced colors is absolute"`
   - `"glassOpacity 0.69 stays glass, 0.7 tinted"`
   - `"less and custom map to standard"`
   - `"clamps glassOpacity"`: −1 → 0, 2 → 1
4. **A11Y-023 `storage.ts`**: `createLocalStorageAdapter()`, where every access is wrapped in `try/catch` and a throw switches permanently to `createMemoryStorage()`; plus `createMemoryStorage()`. The key is `ag:prefs:v1`, holding JSON `{transparency, glassOpacity, contrast, motion, scheme, density}`.
5. **A11Y-024 `media.ts`**: a registry keyed by `window` (WeakMap) then query string. It creates a `MediaQueryList` lazily on the first subscribe and never at import. It removes the `change` listener when the subscriber count reaches 0. Queries: `(forced-colors: active)`, `(prefers-contrast: more)`, `(prefers-reduced-transparency: reduce)`, `(prefers-reduced-motion: reduce)`, `(prefers-color-scheme: dark)`, `(pointer: coarse)`. That's ≤6 in total (PRD §16).
6. **A11Y-025 `store.ts`**: `createPreferenceStore({ storage?, storageKey?, legacyStorageKey?, app?, target?: HTMLElement })`. It implements `getSnapshot`/`getServerSnapshot`/`subscribe`/`set`/`resolved`.
   - `set` persists the *user* value, re-resolves, and writes the effective `data-ag-transparency`, `data-ag-contrast`, `data-ag-motion`, `data-ag-scheme`, `data-ag-density` and `--ag-glass-opacity` on `target`.
   - Corrupt JSON → `'system'`, with no throw.
   - `set('transparency','glass')` under contrast-more persists `glass`, but `resolved().transparency === 'tinted'` (REQ-A11Y-39).
   - Legacy migration (PRD §11.6): read `legacyStorageKey` once, map `highContrast→contrast:'more'` and `reducedTransparency→transparency:'tinted'`, write `ag:prefs:v1`, and leave the legacy key in place.
7. **A11Y-026 `store.test.ts`** (jsdom; this is unit logic only, not browser evidence) covers:
   - a persistence round trip
   - corrupt JSON
   - throwing storage → memory
   - a below-floor `set`
   - legacy migration
   - that attribute writes happen only on change
8. **A11Y-027 `usePreference.ts`**:
   - `usePreference(key)` uses `useSyncExternalStore` with server snapshots: settings → `'system'`, OS booleans → `false`, `glassOpacity` → 0.
   - `useResolvedPreferences()` and `usePreferenceActions()` (returns `{ set }`).
   - Without a provider, use a module singleton created on the first call.
9. **A11Y-028 `usePreference.test.tsx`**:
   - `renderToString` renders the server snapshot
   - `hydrateRoot` produces 0 `console.error` hydration warnings (spy on it)
   - `"shared MQL"`: 200 components calling `usePreference('reducedMotionOS')` → the `matchMedia` spy is called exactly 1 time; after unmount, `removeEventListener` has been called and there are 0 listeners
   - importing the module calls `matchMedia` 0 times
10. **A11Y-029 `AuraGlassProvider.tsx`** (`'use client'`):
    - Props exactly as in PRD §10: `transparency`, `glassOpacity`, `contrast`, `motion`, `scheme`, `density`, `storage` (`false` = memory), `storageKey`, `legacyStorageKey`, `portalContainer`, `deprecations`, `toasts`, `tooltips` (SC-21 opt-outs; default `true`).
    - Marks its root with `data-ag-root` (`<html>` for the outermost provider; the wrapper for a nested one). `portalContainer` feeds the portal-root context that FND-007 `usePortalContainer()` reads (SC-25).
    - It writes only `data-ag-*` attributes and `--ag-glass-opacity`, plus an optional brand `<style>`. No other inline style goes on any element (REQ-A11Y-31).
    - The outermost provider targets `<html>`. A nested provider renders a `<div data-ag-provider>` wrapper and scopes attributes on it.
    - In development it calls PRD-04 `startSurfaceCounter()` and disposes it on unmount.
11. **A11Y-030 `AuraGlassProvider.test.tsx`**:
    - `"writes only data-ag and --ag-glass-opacity"`: walk every element and assert that `style` is empty except `--ag-glass-opacity`
    - `"legacy key migration"`
    - `"nested provider scopes attributes"`
    - `"deprecations silent"`
12. **A11Y-031 pre-paint source**:
    - `prepaint.ts` exports an IIFE-compatible function that reads storage, the four OS media queries, and `CSS.supports('(backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))')`.
    - It calls the *same* `resolve.ts` functions. Don't copy the logic.
    - It sets the preference attributes, `--ag-glass-opacity`, `data-ag-engine` (UA-CH `brands` first, then the UA string, per REQ-MAT-54) and `data-ag-tier=lightweight` (only for the REQ-MAT-55 conditions).
    - `scripts/build/build-prepaint-script.mjs` bundles and minifies it with the repo's existing bundler (PRD-02) into `src/theme/generated/prepaint-script.ts` (`export const PREPAINT = "…"`), and fails if the output exceeds 1,536 bytes.
13. **A11Y-032 `AuraGlassScript.tsx`**:
    - A Server Component (no `'use client'`) with signature `({ nonce, storageKey = 'ag:prefs:v1', defaults })`.
    - It renders `<script nonce={nonce} dangerouslySetInnerHTML={{__html: PREPAINT_WITH_ARGS}} />`, where the args are JSON-serialized and escaped (every `<` becomes the six-character sequence backslash-u-003c).
    - No `eval` and no `new Function`.
    - Also export `auraGlassPrepaintScript` (the same compiled body, args defaulted) as a string constant for Vite/non-RSC heads (SC-23; DX REQ-DX-12).
14. **A11Y-033 `AuraGlassScript.test.tsx`**:
    - `"nonce present"`
    - `"no eval"`: no `new Function` or `eval` in the output
    - `"minified budget"`: `Buffer.byteLength(PREPAINT) <= 1536`
    - `"engine and tier fixtures"`: execute the emitted string in jsdom with mocked `matchMedia`, `navigator.userAgentData` and UA strings for Chromium/WebKit/Gecko/unknown, `saveData`, and `deviceMemory 2` + coarse, then assert the attributes
    - persisted `solid` → `data-ag-transparency="solid"`

    A minimal inline snapshot of the wrapper markup is allowed. Updating that snapshot with `-u` to pass is not.
15. **A11Y-034 `src/theme/index.ts`**: export `AuraGlassProvider`, `AuraGlassScript`, `auraGlassPrepaintScript`, `usePreference`, `useResolvedPreferences`, `usePreferenceActions` and the types. `useAnnouncer` and `GlassPreferencesPanel` are added by 05d/05g. The PRD-02 directive lint must pass: the script file is server-safe and the hooks are client.
16. **A11Y-035, remote**:
    - Bundle size: `{ AuraGlassProvider, usePreference }` ≤4 KB min+gz, measured by PKG's size gate (`docs/size-budgets.json` + `scripts/ci/verify-size-budgets.mjs`, PKG-049; SC-15, no size-limit).
    - Hydration: 0 warnings in QA's L11 Consumer canaries (QA-086) for Next 15/16, with the provider and script in `app/layout.tsx`. If a canary is missing, record a blocker.

    Run both through `certify-pr.yml` (L2 Artifact, L11 Consumer canaries). Never build or serve locally.

## 5. Running
Unit tests run locally: `npm run test:a11y:unit`. The build, canaries and size checks run remotely (GitHub Actions on `auraoneai/auraglass`, per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`, or the `auraone-remote-run` skill). No local Docker, no local browser.

## 6. Prohibited
- constant-returning resolvers
- a second copy of the resolver logic inside the script
- skipped or `.only` tests
- raising the 1,536-byte or 4 KB budgets
- `-u` snapshot updates to pass
- jsdom results cited as browser evidence. The browser pre-paint proof is 05c's `prepaint.spec.ts`.

## 7. Exit criteria
| AC / REQ | Evidence |
|---|---|
| REQ-A11Y-01/02/03/07 | `resolve.test.ts` with 1,024 cases green in CI L12 Unit |
| REQ-A11Y-21/22/23/39 | `usePreference.test.tsx` and `store.test.ts` green |
| REQ-A11Y-31 | `AuraGlassProvider.test.tsx` green |
| REQ-A11Y-37 (unit) / AC-A11Y-25 | `AuraGlassScript.test.tsx` green; the byte count is in the report |
| AC-A11Y-23 | canary run URL with 0 hydration warnings, or a blocker |
| AC-A11Y-19 (half) | one store and one provider exist; the 4.x detectors are still present until PRD-16 (counted in 05g) |

## 8. Final report
1. Task table A11Y-020..035 → status, commit, CI URL.
2. Minified script bytes, and `./theme` min+gz bytes.
3. Hydration canary results per Next version.
4. Blockers with their owner PRD.
5. Deviations, with evidence.
