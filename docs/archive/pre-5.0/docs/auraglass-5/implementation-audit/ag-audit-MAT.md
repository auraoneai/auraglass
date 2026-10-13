# AuraGlass 5.0 — MAT stream audit (Material System PRD)

Audited: origin/next @ 84a3b94f1, origin/release/4.x @ 645735fce (2026-10-08). Read-only; detached worktrees in /tmp, removed afterwards.
PRD: docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md (67 REQ-MAT, 33 AC-MAT). Ledger: docs/auraglass-5/tasks/MAT.json (374 tasks; every task still has `status: "todo"`, so nobody updated the ledger).

## Verdict

**Partial.** Every MAT stream branch is merged: next-mat/* through PRs #33/35/39/40/43/53/56–61, and 4x-mat/* through #22/25/34/45/64. The one exception is 4x-mat/codemods-fragment (PR #28 was closed unmerged; the branch is 2 commits ahead). The MAT code is real, not stubs. I found no TODOs and no `it.skip` in MAT unit code, and the token compiler, contrast solver, preference store, layer stack, motion ticker, View Transitions and gestures all have genuine logic.

The problem is the merged `next` tree. The lanes were built in parallel and merged on the same day, and they do not work together:

1. **`npm run tokens:build` exits 1 on origin/next.** PR #59 (b-legacy-freeze, 17f34e11c) replaced `tokens/legacy/4x-rendered.tokens.json` with an `$type: "ag-rendered"` format that the lane-T schema rejects (about 865 schema violations). On the tree just before #59 (9026853c6^1) the build exits 0 and is deterministic.
2. **The material engine and the token compiler use different variable names.** `material.css` `::before` uses `blur(var(--_ag-blur))`, and `--_ag-blur` is set to `0px` on the host. Nothing maps thickness to `--_ag-blur`: `generated/ladders.css` sets `--_ag-mat-blur` / `--_ag-mat-saturation`, which nothing reads. In the default (no `data-ag-tier`) tier, surfaces get **zero blur**. The literal ladder rules apply `backdrop-filter` to the **host** (breaking REQ-30), and only when a `data-ag-tier` ancestor is present. Under `lightweight` they still blur (6/10/16 px), breaking REQ-35.
3. **The engine selects `.ag-surface` (class), but `materialProps()` emits only `data-ag-*` attributes.** All 7 materialProps consumers render with no material CSS: Button, Card, Combobox, SegmentedControl, Select, Toolbar and GlassPreferencesPanel.
4. **The provider mount registry is never populated.** `registerProviderMount` is called only from a test. As a result `LensDefs`, the dev surface counter, pointer-light installation, the `preset` prop and the `brand` prop are all inert in production.
5. **The provider no longer renders the portal root or announcer.** CMP's later `Portal` (117d8b6e5) resolves its container through `usePortalContainer`, which looks for the portal root it is supposed to render. The provider and announcer tests pass at the #53 merge commit (18/18) and fail at HEAD.
6. **`dist/compat/tokens.css` is invalid CSS.** The compiler reads the new `compat-alias-map.json` shape and emits `$schema: var(...)` and `counts: var([object Object])`. On 4.x, the bridge emits only 15 `--ag-*` successors.

No CI has validated any of this. GitLab project 87152036 has zero pipelines. Every `ci/mat.gitlab-ci.yml` job on next is `allow_failure: true`. No `mat:test:drift` job exists; `mat:test:tokens-interim` stands in for it. Its `npx jest tests/tokens` step runs without `--experimental-vm-modules` and fails to import `.mjs`. Neither 4.2 nor 4.3 has been published to npm (latest is 4.1.0), so G-07 and AC-MAT-30 cannot be met.

### Local unit evidence

I ran jest 30.5.2 with `node --experimental-vm-modules` over the MAT dirs. Deps were installed separately because `npm ci` on next fails: the lockfile references `.artifacts/pack/aura-glass-5.0.0-alpha.0.tgz`.

**77 suites: 18 failed, 59 passed. 682 tests: 43 failed, 637 passed, 2 skipped.**

The 6 tailwind-bridge failures are my environment (`@tailwindcss/node` was not installed). The rest are real.

| Area | Failing test(s) | Cause |
|---|---|---|
| Token schema | `schema` | Legacy freeze format rejected by the lane-T schema |
| Determinism | `determinism` | Build exits 1 |
| Legacy freeze | `legacy-freeze`, `legacy-gate-superset` | Freeze format changed by #59 |
| Material transform | `material-transform` (40 px blur fixture) | Build fails on the schema first, not on the blur guard |
| Literals | `literals-lint` | Gate exits 1 |
| Variable gates | `vars-gates` | Gates exit 1 |
| Namespace | `private-ag-namespace` | 476 / 303 offending names |
| Types/runtime parity | `types-runtime-parity` | `theme` mismatch |
| `@property` registry | `properties.test` (REQ-28) | Registry does not match the contract list |
| CSS contract | `css-contract` | Layer statement is not first; no coarse block; `api.privateAttributes` |
| Motion | `motion/tokens.test`, `css-output` | `./generated/tokens.js` resolution; sweep duration |
| Motion adapter | `adapter.test` | Drag detents |
| Compat adapters | `adapters.test` | Expects inline `style` |
| Provider | `AuraGlassProvider` | No portal root |
| Announcer | `announcer` | No regions |
| Preferences panel | `GlassPreferencesPanel` | Announcement not delivered |

### Gate scripts at HEAD

| Script | Exit | Result |
|---|---|---|
| verify-optics-css | 1 | Violations found |
| count-glass-recipes | 0 | `independent-glass-recipes: 11` |
| count-glass-recipes `--strict` | 1 | Fails |
| material-css-api `--check` | crash | TypeError |
| verify-material-runtime | 0 | OK |
| verify-motion-css | 1 | 40 issues |
| verify-a11y-css | 1 | 197 violations |
| verify-a11y-manual | crash | SyntaxError: the `records/**/*.json` text in the header comment closes the comment |
| undefined-vars | 1 | Findings |
| dead-vars | 1 | Findings in MAT's own `--_ag-env-brightness`, `--_ag-pointer`, `--_ag-hover` |
| literals | 1 | 89 per-file increases, including MAT's own `src/theme/materials.ts`, `prepaint.ts`, `store.ts` |
| tier-skip | 0 | 0 violations |
| types-runtime | — | `theme`: 3 extra exports; `material` and `motion`: crash |

On 4.x: `build.mjs --platform bridge-4x` is deterministic (no drift).

## REQ table (done 28 / partial 38 / missing 1)

| REQ | Status | Evidence (origin/next unless noted) |
|---|---|---|
| 01 Source | done | `tokens/$schema.json` (`glass-material`, `motion-spring`, `ag.*` extensions); ref/sys/material/modes/presets/contrast/legacy present. `comp/comp.tokens.json` is non-empty, although the PRD says it stays empty until a component owner requests a row |
| 02 Compiler guards | done | `build.mjs` die() on unresolved alias, cycle, material→non-sys and preset `material.*`/`--_ag-*`; blur cap in `validate.mjs:199` and `glass-material.mjs:52`; spring ζ/response in `motion-spring.mjs:47`; bezier [0,1] in the schema; no ajv |
| 03 Outputs/determinism | partial | Deterministic pre-#59, but **exits 1 at HEAD**. No `mat:test:drift` job (only interim, allow_failure). Style Dictionary is never used |
| 04 Namespace/manifest | partial | `tier-skip` 0, but the `private-ag-namespace` test fails (476 public names not in the manifest) |
| 05 Colour | done | OKLCH slate L 0.99→0.18; `light-dark()` ×31; dark on-surface = slate.1; `@supports` fallbacks |
| 06 Type/space/shape | done | `scales.test` passes |
| 07 Material/elevation/env | done | `material.tokens.json`; z 0/100/1000/1100/1200 in `dist/tokens.css`; environment-elevation test passes |
| 08 Motion tokens/springs | partial | Transform is real. `src/motion/__tests__/tokens.test.ts` fails. `spring-linear.test` loosened the stop count to `≤ 2*40+40` |
| 09 Interaction states | done | `interaction-states.test` passes; state × mode blocks emitted |
| 10 Contrast solver | done | `transforms/contrast-solve.mjs`; `dist/contrast-matrix.json` has 2,160 cells, built pre-#59 (blocked at HEAD by REQ-03) |
| 11 Independent recompute | done | `tests/a11y/contrast-matrix.test.ts` passes |
| 12 Modes | partial | Attribute and media mirror blocks exist. No `data-ag-transparency="tinted"` token block (only solid). The zero-JS pixel check is not run |
| 13 No 4.x hooks | partial | No 4.x hooks in MAT CSS, but `dist/compat/tokens.css` is invalid and does not map `[data-theme=dark]` / `.dark` |
| 14 Presets | partial | 4 presets compiled, but `[data-ag-theme=…]` ships in dist although it is not in `AG_ATTRIBUTES` (OI-MAT-01). The provider `preset` prop is inert (no `presetCss` mount) |
| 15 createGlassTheme | done | `createGlassTheme.test` passes |
| 16 createBrandTheme | partial | Real, and the 20-brand fixture passes. `createBrandGlassTheme` lives in `src/theme/` and is exported from `./theme` (should be compat-only, via `warnDeprecated`). The `brand` prop is inert |
| 17 Variable gates | partial | `undefined-vars` and `dead-vars` exist; both exit 1, including on MAT's own variables |
| 18 Raw-value rule/ratchet | partial | `no-raw-design-values.cjs`, stylelint half and `literals.mjs` exist; the gate exits 1 (89 increases); baselines are not 0 |
| 19 Layering | partial | Generated CSS starts with a comment, not `LAYER_ORDER_STATEMENT` (test fails); `verify-a11y-css` reports 197 violations; `motion.css` registers extra `@property` |
| 20 shadcn interchange | partial | Bidirectional block uses `data-ag-shadcn-source` before the contract PR (that direction was not supposed to ship yet) |
| 21 Compat tokens/legacy freeze | partial | Freeze exists but breaks the schema; `legacy-freeze.test` fails; compat CSS is invalid; `fragments/codemods/mat.ts` `cssVars` is empty |
| 22 Entry parity/API reports | partial | `./theme` has extra `createGlassThemeCssVars` and `createBrandGlassTheme`; `./tokens` exports `token`, `materialSpec`, `manifest` (should be `tokens` only); etc/api reports record the drift; `material-css-api --check` crashes |
| 23 materialProps/resolveRole | done | `internal/resolveRole.ts`; `materialProps.test` passes |
| 24 Surface + compat adapters | partial | Surface is correct. Adapters: 7 of 9 (no `GlassPrimitive`, no `GlassAdvanced`); `adapters.test` fails 2 |
| 25 Server safety/tier hook | done | `server-safe.test`, `useMaterialTier.test` pass |
| 26 Structural components | done | `components.test` passes |
| 27 Attribute discipline | partial | Unregistered `data-ag-theme` in dist and `data-ag-theme-style` on the provider `<style>` |
| 28 Registered properties | partial | `generated/properties.css` registers `--_ag-mat-*`, `--_ag-floor-alpha` and others; `--_ag-blur`, `--_ag-saturation`, `--_ag-brightness`, `--_ag-dim`, `--_ag-rim-width`, `--_ag-grain-opacity` are missing; tint-floor 0 (expected 0.6); refraction 1 (expected 0). `properties.test` fails |
| 29 Read-outs/tint | partial | Read-outs set in `material.css`, but keyed on the `.ag-surface` class, so `materialProps()` consumers get nothing |
| 30 Layer stack/host | partial | `ladders.css` sets `backdrop-filter` on the host under `[data-ag-tier]` |
| 31 Nesting/groups/content | done | `material.css:193-234` |
| 32 Optics | partial | Blur is never applied by thickness (`--_ag-blur` stays 0px); grain, rim and specular present |
| 33 clear fail-safe | done | Selector at `material.css:168`; dev warning in `warnings.ts:55` |
| 34 WebKit literal ladder | partial | 18 literals, but no `brightness()`, host-level, and tier-attribute-gated |
| 35 Tiers/no downgrade | partial | `verify-material-runtime` OK; lightweight ladder still blurs |
| 36 Enhanced lens | partial | 9 PNGs (≤2,955 B), `LensDefs`, `lens.css`; never mounted (no registration) |
| 37 Cinematic boundary | partial | No WebGL/three in `src/material`; `apps/docs/content/mat/cinematic-contract.md` missing |
| 38 Dev diagnostics | partial | `dev/surfaceCounter.ts` is real; never started by the provider |
| 39 Optics lint/recipes | partial | Rule and scripts exist; recipes = 11; `verify-optics-css` fails |
| 40 Coarse pointer | **missing** | No `(pointer: coarse)` block in `ladders.css` (`css-contract` test fails) |
| 41 4.x bridge (release/4.x) | partial | `src/material/css/preview-v5.css` is scoped (82 `data-ag-preview` selectors); bridge build is deterministic. Gaps: H01 `src/material/index.ts` exports only a version constant; no `./material` export; the 4.x `build.mjs` is a separate 96-line script with no D-28; `src/styles/preview-v5.css` is an unscoped alias sheet; no colocated `src/material/**` tests |
| 42 Interaction motion | partial | `motion.css` hover/press present; `verify-motion-css` reports 40 issues |
| 43 Enter/exit | done | `motion.css:65-114` |
| 44 Modes/settle | done | `motion-modes.css`, `modes.test` |
| 45 No API raises motion | done | `types.test-d.ts`, `resolve.test` |
| 46 Continuous | partial | `loading.css` sweep is gated; the `css-output` test (expects literal 1400ms) fails |
| 47 Frame runtime | done | `ticker.ts`; `ticker.test` passes |
| 48 View Transitions | done | `viewTransition.ts`; tests pass |
| 49 Pointer light | partial | `pointerLight.ts` is real; never installed (no mount) |
| 50 aura-glass/motion | partial | Exports match `ENTRIES`; drag-detents adapter test fails |
| 51 Motion lint | done | 8 `motion-*` rules in `lint/rules/mat`; preference source covered by `motion-single-preference-source` |
| 52 Resolution | done | `resolve.ts`, `resolve.test` |
| 53 Store/hooks | done | `store.ts`, `store.test`, `usePreference.test` |
| 54 Rungs | done | `src/a11y/css/rungs.css` (browser proof not run) |
| 55 AuraGlassProvider | partial | Attributes and store work; mounts are empty; portal root not rendered at HEAD |
| 56 Portal root | partial | Regression at HEAD: 0 portal roots |
| 57 LayerStack | done | `LayerStack.test` passes; `no-document-escape` rule |
| 58 Announcer | partial | Logic is real; regions absent at HEAD (5 tests fail) |
| 59 AuraGlassScript | partial | Real, but 2,899 B minified against a 1,536 B spec; the test was relaxed to a "ratchet" |
| 60 GlassPreferencesPanel | partial | Present; announce test fails |
| 61 Focus ring | done | `focus.css`; `focus:outline-none` = 0 |
| 62 Target size | done | `targets.css`, `HitArea` |
| 63 Focus not obscured | done | `scroll-padding.css`, `useStickyScrollPadding` |
| 64 No runtime contrast | done | `no-runtime-contrast.cjs` |
| 65 Catalogue a11y suites | partial | Specs exist under `tests/e2e/mat/**` and have never run. "DOUBLE-PASS" early returns; pixel-contrast tests skip without an artifact |
| 66 Manual records | partial | Scripts cover only button/dialog; no `tests/a11y/manual/records/mat/` |
| 67 Deprecations/codemods | partial | 177 DEP-M08xx/09xx rows on 4.x, unpublished; 4.x codemods fragment is `{}` (PR #28 unmerged); next has 18 fixture cases (codemod engine not run) |

## Task sample (40 tasks, 8 per lane, seed 7)

**Verified (31):**
- Lane 2a-T: MAT-042, 020, 051, 007, 010, 013, 069 (tailwind test unverifiable locally)
- Lane 2b-M: MAT-141, 102, 106, 150, 099; MAT-169 and MAT-159 exist under `tests/e2e/mat/material/` rather than the planned path
- Lane 2c-V: MAT-212, 189, 213, 221, 191, 238 (238 is not run)
- Lane 2d-P: MAT-262, 254, 297, 321, 319 (at `src/theme/preferences-panel/`)
- Lane 2e-B: MAT-329, 362, 335, 336, 345, 353, 361

**Problems (9):**

| Task | Problem |
|---|---|
| MAT-084 | `src/theme/materials.ts` still exists (dead, 0 importers, literal-gate offender) |
| MAT-253 | `src/theme/contrast.ts` still exists |
| MAT-122 | `material.css` transitions flagged by `verify-motion-css` |
| MAT-190 | Test fails |
| MAT-201 | Test fails |
| MAT-275 | Budget relaxed |
| MAT-320 | Test fails |
| MAT-341 | `src/styles/index.css` absent (moot) |
| MAT-069 | Env-dependent |

## AC table

**Met (3):**

| AC | Evidence |
|---|---|
| 06 | 0 `!important`, 0 `prefers-contrast: high` |
| 09 | Unit tests (jsdom) |
| 23 | 0 motion imports outside `public.ts` / `adapter/` |

**Not met (11):**

| AC | Reason |
|---|---|
| 01 | 11 glass recipes |
| 02 | Literals and optics gates fail |
| 03 | Build fails at HEAD |
| 04 | Met pre-#59; blocked at HEAD |
| 05 | Undefined/dead gates fail |
| 07 | Entry parity fails |
| 24 | Portal-root unit test fails |
| 25 | `ChartFrame.Interactive` / `Select` have their own `matchMedia` |
| 26 | Partial: the string check is met; browser parts not run |
| 30 | No published 4.2/4.3 |
| 33 | `fragments/review/mat.ts` rows are unsigned |

**Not verifiable without CI and browsers:** AC-08, 10–22, 27–29, 31, 32. These are the Playwright, pixel, 3-engine, AT and budget checks.

## Stubs, fakes, skips and relaxed thresholds

- Provider mount registry: nothing registers, so `LensDefs`, the surface counter, pointer light, preset and brand are wired to nothing.
- 4.x H01 `src/material/index.ts`: exports only `MATERIAL_BRIDGE_VERSION`.
- `prepaint-script`: 1,536 B budget relaxed to a ~2.9 KB "ratchet" (`AuraGlassScript.test.tsx:69`).
- `spring-linear.test.ts:101`: stop-count bound loosened to 120.
- `css-contract.test.ts` and `properties.test.ts`: "pending" pass-through branches when files are seeds. They are inactive now, and those suites fail.
- `tests/motion/responsive.spec.ts` (and frame-time specs): "DOUBLE-PASS" early `return` when a subject is absent.
- `pixel-contrast-artifact.test.ts`: `it.skip` without an artifact.
- Several MAT e2e specs are Chromium-only skips although the PRD requires 3 engines.
- Gate wrappers (`token-gates-l1`, `token-drift-l4`, `codemod-fixtures-check`, `ga-cert`, `api-report`): report "pending" for missing inputs; codemod idempotence is always pending.
- `verify-a11y-manual.mjs`: does not parse.
- `ci/mat.gitlab-ci.yml`: every job is `allow_failure: true`; zero pipelines ever ran.
