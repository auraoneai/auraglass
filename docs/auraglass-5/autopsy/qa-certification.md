# AuraGlass 5.0 Autopsy: QA and Certification Infrastructure

Scope: `tests/`, `src/**/*.test.*`, `jest*.config.js`, `playwright*.config.ts`, `scripts/audit/*`, `scripts/ci/*`, `scripts/verify-glass-pipeline.js`, `scripts/visual-test-runner.js`, `.github/workflows/*`, `reports/*` certification artifacts, and the 44 root-level `probe-*/audit-*` scripts. Everything here was checked against code and git history. The README, release notes, and reports were not taken as proof. Screenshot pixels were analyzed with a PIL script (byte hashes, content bounding boxes) because the image viewer returned empty output in this session. No human visual judgment of the PNGs is included.

## 1. Summary and score

**Score: 4 / 10**

AuraGlass has one runtime audit that is actually sophisticated: `tests/visual/design-system/token-purity-layout-audit.spec.ts`, 4,747 lines. It reads computed backdrop-filter chains, gradient stops, sheen and highlight alphas, local text contrast, overlap and overflow geometry, and a pixel color census. It also has its own regression fixtures. The rest of the QA layer doesn't hold up around it:

- **The "498 visual targets certified green" claim is not reproducible from the repo.** The newest full run on disk is from 2026-08-14 (4.0.0). The 4.1.0 release changed about 100 component sources but recaptured only the 28 recipe directories. Today the repo's own evidence verifier reports **FAIL, 0/498 verified** (`reports/audit/visual-all/visual-summary.md:3-15`).
- **498 counts entries, not distinct visuals.** 470 = 452 canonical + 11 aliases + 7 "coveredBy" entries, drawn from 359 source files. 79 of the 498 evidence directories hold byte-identical screenshots in 24 groups. For example, 13 `GlassDropdownMenu*` sub-exports share one PNG.
- **There is no pixel-diff regression.** `visual-baselines/` is empty. The Playwright `-snapshots/` directories are gitignored and contain only `*-chromium-darwin.png` files. The "App Chrome Visual Baselines" CI job captures screenshots but never compares them.
- **CI runs none of the real gates.** No workflow runs the full Jest suite (759 test files), the token-purity audit (`test:visual:ci`), the Storybook certification, or `audit:visual:evidence`. The npm publish workflow also skips the unit tests.
- **About 355 of the 759 test files come from one template.** They contain a vacuous reduced-motion test, conditionally skipped focus assertions, and a snapshot. Line coverage is 38% against a 33% threshold, and the coverage report dates from June.
- **The "356/356 Storybook certification" is a smoke test.** It passes any story that renders more than 10px, has an element with "glass" in its class or an SVG, and doesn't throw one of a few regex-matched errors. It passed a story that threw `pageerror: Invalid easing type 'ease-in-out'`.

## 2. What exists (counts)

| Asset | Count / fact | Evidence |
| --- | --- | --- |
| Jest test files under `src/` | 759 (`*.test.*` / `*.spec.*`) | `rg --files src -g '*.test.*' -g '*.spec.*'` |
| Jest snapshot files | 339 `.snap`; 340 files call `toMatchSnapshot` | `rg -l toMatchSnapshot src` |
| Template-generated component tests | 355 contain "Test Suite Coverage:"; 358 "renders without crashing"; 350 assert `expect(container).toBeInTheDocument()` | e.g. `src/components/atmospheric/GlassNebulaClouds.test.tsx:1-105` |
| `tests/` tree | 41 files: 13 Playwright specs, about 15 Jest contract tests (hosted-runtime, exports, deployment, liquid-glass), 1 orphaned jest-image-snapshot suite | `tests/` |
| Playwright configs | 3 (`playwright.config.ts` 9 projects; `visual-ci` 5 specs, Chromium only; `visual-matrix` 3 specs, 4 engines) | `playwright.visual-ci.config.ts:12-18` |
| Audit scripts | 11 in `scripts/audit/` (5,384 LOC, of which `static-glass-material-audit.js` is 1,918) | `scripts/audit/` |
| CI scripts | 18 in `scripts/ci/` | `scripts/ci/` |
| Other scripts | 56 entries in `scripts/`, many one-off fixers (`fix-all-remaining-issues.py`, `complete-100-percent-migration.js`, `ultrathink-component-review.cjs`) | `scripts/` |
| Root probes | 44 `probe-*.mjs` / `audit-*.mjs` / `webkit-probe.mjs` (1,491 LOC), **all tracked in git**, all hardcoded to `http://localhost:6006` | `git ls-files '*.mjs'` |
| Workflows | 5 (deploy-storybook, design-system-compliance, glass-pipeline, publish-npm, visual-regression) | `.github/workflows/` |
| Storybook certification evidence | 356 dirs, 712 PNGs (desktop 1440x900, mobile 390x844), generated 2026-08-14T02:58Z | `reports/glassmorphism-storybook-visual-certification.json` |
| Runtime visual evidence | 498 dirs, 1,494 PNGs and 1,494 computed-style JSON files (3 viewports), full run 2026-08-14T03:51Z | `reports/audit/audit-summary.json` |
| `visual-baselines/` | empty directory | `ls -la visual-baselines` |
| Coverage | lines 38.46%, statements 37.21%, functions 25.15%, branches 35.04%; file dated Jun 14 2026 | `coverage/coverage-summary.json` |
| Coverage threshold | branches 28 / functions 20 / lines 33 / statements 32 | `jest.config.js:82-90` |

### Recount of the headline numbers

| Claim | Source of the claim | Recount from source and manifests | Verdict |
| --- | --- | --- | --- |
| "470 visual component-like exports" | `README.md:21`, `RELEASE_NOTES_4.1.0.md:19` | `public-export-audit.js:318-324` treats an export as component-like when it is a value export with a PascalCase name whose source sits under `components/ primitives/ client/ theme/ contexts/`. That yields 470. The manifest splits them into **452 canonical + 11 alias + 7 coveredBy** (`reports/public-visual-target-manifest.json` summary), from **359 unique source files**. At least 46 are providers, engines, or plugins (`ThemeProvider`, `GlassContext`, `GlassPhysicsEngine`, `AnimationProvider`, `AuraGlassClientBoundary`...), so they are not visual components. | 470 is a symbol count from a naming heuristic. The honest number of distinct visual targets is about 452 or fewer. |
| "28 recipes" | `README.md:259` | `src/registry/recipes.ts` has 32 `id:` keys. 4 of them are inner data ids (`monthly-recurring-revenue`, `planned`, `active`, `done`), which leaves **28 recipe ids**. `reports/3.3-release/recipe-render-evidence.json` lists 28. | Accurate. |
| "498 visual targets certified green" (4.0 and 4.1) | `RELEASE_NOTES_4.1.0.md:3,7,18`; commit `15b6de6f7` | 498 = 470 + 28, hardcoded at `token-purity-layout-audit.spec.ts:206-211`. The last full run is `reports/audit/audit-summary.json` (runId `runtime-audit-full-20260814035148-…`, PASS 498/498), which is the 4.0 date. The 4.1.0 commit touched about 100 `src/` component files but re-captured only the 28 `recipe-*` directories under `reports/audit/visual-all/`. No 4.1 full-run summary was committed. `RELEASE_NOTES_4.1.0.md:27` cites an "AWS Playwright certification" with no artifact. Current `verify-visual-evidence.js` output: **FAIL, 0/498** (stale `publicExportAuditSha256`, `recipeEvidenceSha256`, `publicVisualTargetManifestSha256`; the 28 recipes are also missing `runId/kind/sourcePath/storyId/recipeHarness` identity). | Not reproducible for 4.1.0. For 4.0.0 it was true only for that day's inventory hashes. |
| "356 certified" (screenshots dir) | `reports/glassmorphism-storybook-visual-certification.md:3-11` | 356 = `reports/component_inventory.json`, a frozen historical 3.0 inventory (`README.md:446` admits this). The public export audit says 73 current visual exports are missing from it (`reports/public-export-audit.md`, summary). | A historical artifact that doesn't measure the current package, yet it's still enforced by `test:visual:ci`. |
| Distinctness of the 498 evidence set | — | PIL hash scan: **24 groups / 79 dirs with byte-identical desktop PNGs**, e.g. `button`=`glass-button`, `card`=`glass-card`, 13 `glass-dropdown-menu-*`, 5 `adaptive-glass-density`/`mobile-glass-*`/`touch-*`, `glass-canvas`=`glass-drag-drop-provider`, `content-section`=`glass-app-shell`. | About 16% of the "certified targets" are duplicate screenshots. |

## 3. What each certification rule checks, and what it cannot prove

### 3.1 Storybook visual certification (356) — `scripts/audit/storybook-visual-certification.mjs`

- Story matching works by fuzzy name normalization. It strips the `glass` prefix and non-alphanumerics, then ranks Default, then Primary, then Basic (`:41-151`). Only `stories[0]` is rendered (`:223`).
- It renders in two viewports with `colorScheme: dark` and `reducedMotion: reduce` (`:36-39,230-234`). It waits until the root is bigger than 48px or contains text, an SVG, or a canvas (`:264-290`), then settles for 100ms (`:12`).
- A story **fails only when** (`:296-334`):
  - there are 0 visible elements, or
  - the root is smaller than 10x10, or
  - nothing has `glass` in its class name and there is no `<svg>` or `<canvas>`, or
  - a `[data-certification-fallback]` element is present, or
  - a console error matches `/failed to fetch dynamically imported module|error rendering story|uncaught|referenceerror|typeerror|syntaxerror|failed to execute/i`.
- **It cannot prove** blur, alpha, contrast, layout, overflow, clipping, interaction states, light theme, or any change from a previous render. Warnings are ignored completely (`:327`). The stored report holds 26 console events that passed, including `PageTransitionDemo pageerror: Invalid easing type 'ease-in-out'`, which doesn't match the regex. A single `<svg>` icon satisfies the "glass surface" check.
- The paired spec `tests/visual/design-system/storybook-visual-certification.spec.ts:94-227` **never opens a browser**. It checks that the JSON report agrees with itself (counts, 2 PNGs per entry, files exist, markdown wording). It still boots a full Storybook through `webServer` (`playwright.visual-ci.config.ts:40-45`).

### 3.2 Runtime token-purity and layout audit (498) — `tests/visual/design-system/token-purity-layout-audit.spec.ts`

Per export, it renders the resolved Storybook story at 1440x900, 768x1024, and 390x844. It then inspects surfaces, text, paint, and layout. The rules (`checkFilterChain` `:2958-2993`, `checkTokenInvariants` `:2995-3244`, `checkViewportColorCensus` `:2214`, `collectLayoutIssues` `:1107-1530`, `collectPresentationIssues` `:1849-2100`):

| Rule | Exact threshold |
| --- | --- |
| Backdrop blur | must be one of {16, 24, 32, 40, 48}px. `none` fails (`:2964-2974`) |
| saturate / brightness / contrast | saturate ≥ 1.4; brightness ≥ 1.0; contrast in [0.95, 1.2] (`:2978-2992`) |
| Standard vs `-webkit-` parity | the parsed components must be equal (`:3036-3045`) |
| Gradient stops | every stop must be either white-neutral (min channel ≥ 245, spread ≤ 6) with alpha in [0.015, 0.35], or the slate scrim rgb(15,23,42) ±2 with alpha in [0.20, 0.30]. Unparseable color functions fail (`:2924-2939,3048-3086`) |
| Background color | same white-frost / scrim rule; the surface must have at least one frost fill in [0.015, 0.35] (`:3088-3107`) |
| Opaque dark fill | fails at alpha ≥ 0.50 (`:3108`) |
| Border | if width > 0, alpha must be ≥ 0.12 (`:3112-3126`) |
| Inset sheen | alpha in [0.10, 0.18]; level ≤ 3 surfaces must have one (`:3150-3163`) |
| Highlight / specular | ≤ 0.32 (`:3166`) |
| Noise opacity | ≤ 0.10 (`:3170`) |
| Text | effective alpha floors: primary 0.90 / secondary 0.70 / tertiary 0.50. Local composited contrast must be ≥ 4.5:1, or ≥ 3:1 for large text. Unprovable contrast fails (`:3179-3204`) |
| Paint census | saturated canvas (alpha ≥ 0.45, chroma > 48), dark colored control (luminance < 105, chroma > 18), broad tint wash (alpha ≥ 0.08, chroma > 18) (`:3210-3241`) |
| Viewport pixel census | colored area > 18%, tinted neutral > 28%, or a dominant cast with mean chroma > 9 fails (`:2214-2232`) |
| Layout | horizontal overflow, zero-size glass surface, surface overflow, vertical clipping, text truncation, interactive overlap, control spacing < 8px or collision (`:1107-1530`) |
| Presentation | blank or tiny primary output, cropped or displaced output, unfinished native controls, blank or chroma-dominant canvas, hidden compound constituents (`:1849-2100`) |
| Self-tests | 10 regression fixtures that prove the detectors fire (`:3930-4128`) |

**What it cannot prove:**

- **Taste.** It enforces one narrow aesthetic: neutral white frost, near-zero color. A component can pass every rule and still look generic. A beautiful, intentionally tinted component fails. The rules check compliance with a token band. They don't measure premium quality.
- **Regressions.** There is no pixel or perceptual comparison with a prior approved render. A layout can shift by 40px and still pass.
- **States beyond the default story.** Hover, pressed, open, focus-visible, error, loading, RTL, long content, and light vs dark (one Storybook theme only) aren't checked, and neither is real backdrop content behind the glass. The canonical background is mostly white (420/498 desktop corners are rgb 255,255,255), so `backdrop-filter` frosts a blank page.
- **Recipes are not rendered by this test.** `validateRecipeViewportEvidence` (`:3398+`) re-reads PNG and JSON files that `scripts/ci/verify-recipes-render.js` produced earlier. The audit trusts files on disk.
- **Inventory drift.** The counts are hardcoded (`:206-211`, `:2294-2306`), so adding a single component makes the gate throw. The inventory is never discovered from source.
- **Practicality.** `test.setTimeout(180 * 60 * 1000)` (`:4136`): one three-hour test that boots Storybook. That's why it isn't in CI.

### 3.3 Visual evidence verifier — `scripts/audit/verify-visual-evidence.js` (716 LOC)

This script checks that a run manifest exists and that its hashes of `public-export-audit.json`, the recipe evidence, and the visual-target manifest match the current files. It also checks PNG dimensions per viewport, that pixels are non-blank, that per-surface frost alpha falls in [0.015, 0.35], that identity fields are present, and that no captured errors exist. It is a strong integrity check. Current result: **FAIL 0/498** (`reports/audit/visual-all/visual-summary.md:3-15`). It isn't wired into any workflow.

### 3.4 Static and string-level "gates"

- `scripts/verify-glass-pipeline.js` (`npm run glass:validate`) is the "31-check glass pipeline" cited at `README.md:618`. Most checks are `String.includes`. The accessibility check passes if `glass-contrast.spec.ts` contains the strings `'4.5'` and `'WCAG AA'` (`:356`), and it records a pass if the tokens file contains the words `text` and `primary` (`:367`). The documentation check greps for six headings. These checks prove that files exist. They say nothing about behavior.
- `glass-pipeline.yml:57-67` counts `grep -c "glass-.*-level"` matches ≥ 24. `:76-85` caps generated CSS at 30KB, while the same check in the script uses 50KB (`verify-glass-pipeline.js` "Performance Constraints"). `:70-74` runs `npm run glass:validate` twice under two different step names.
- `design-system-compliance.yml:118-185` reruns the same 5 commands, computes a "score", and **passes at 60/100**. Two of five gates (for example typecheck and lint) can fail and the job stays green.
- `scripts/audit/runtime-cleanliness-audit.js` honestly greps for `console.*` / `debugger` / `TODO`. The claim of 0 findings holds: the remaining calls are in excluded `testSetup`/`testingUtils`/`src/scripts`. `src/utils/testingUtils.tsx` and `src/scripts/build-production.js` still sit inside `src/`.
- `scripts/audit/static-glass-material-audit.js` (1,918 LOC) has a real `--self-test` mode (`:1902`), which is good practice.

### 3.5 "Visual regression" that isn't

- `visual-baselines/` is empty. `scripts/visual-test-runner.js:67-68` creates it, but nothing writes or reads it.
- `tests/visual/**/-snapshots/` are gitignored (`git status --ignored`) and hold only `*-chromium-darwin.png` (for example `glass-button.spec.ts-snapshots` has 2 files). CI on Linux has no baselines, so `toHaveScreenshot` can't detect drift there. It writes new baselines or fails as missing. The `playwright.config.ts:123-128` tolerance (`threshold: 0.3`, `maxDiffPixels: 1000`) is loose enough to hide real glass regressions in small components anyway.
- `visual-regression.yml:42` runs `npm run test:visual`, which is `playwright test tests/visual` across all 9 projects in `playwright.config.ts`, including the three-hour audit. On failure it uploads `tests/visual/__image_snapshots__/__diff_output__` (`:49`), a jest-image-snapshot path that this Playwright run never produces.
- `jest.visual.config.js` and `tests/visual/visual-regression.test.js` are orphaned: no script references them. The config also has a `moduleNameMapping` typo (`:25`) and declares `setupFilesAfterEnv` twice (`:4,20`).
- `scripts/ci/verify-app-chrome-visuals.js`, run in CI as "App Chrome Visual Baselines" (`glass-pipeline.yml:198-226`), packs the tarball, renders targets, takes screenshots (`:894-901`), checks keyboard behavior and console errors, and **never compares against a baseline**. Its fixture background is `#07111f` navy with teal and purple radials (`:643-646`), which is exactly what the token-purity census forbids.

## 4. What is excellent (keep)

- **The token-purity audit's measurement layer.** Computed-style extraction, composited local contrast, and paint and pixel census, all in `token-purity-layout-audit.spec.ts:852-2232`, plus the detector regression fixtures at `:3930-4128`. This is the most valuable QA code in the repo. Extract it into a library.
- **Evidence provenance in `verify-visual-evidence.js`.** It binds run manifests to source fingerprints and inventory hashes, so stale evidence fails. It has already caught the 4.1 staleness.
- **The public export audit** (`scripts/audit/public-export-audit.js`) honestly flags "73 exports outside historical inventory", "37 missing direct tests", and "40 missing docs" (`reports/public-export-audit.md`). The API surface audit reports 876 explicit `any` and 131 components needing ref-forwarding review (`reports/api-surface-audit.md`).
- **Package-level gates:** `verify-pack.js`, `verify-tree-shaking.js --strict`, `verify-no-core-ui-deps.js`, Next and Vite tarball integration smokes, `test:types` consumer compile, CJS and ESM export tests. These test what consumers actually install. They are the only gates in `publish-npm.yml:52-65`.
- **Hand-written behavioral tests** such as `src/__tests__/production-workflow-components.test.tsx:17-60` (roles, `aria-valuenow`, click callbacks), `src/hooks/useAutoTextContrast.test.tsx` (compositing logic), `src/theme/theme-engine.test.tsx`, and `tests/hosted-runtime/*`.
- **The "incomplete language" guard** in the certification markdown (`storybook-visual-certification.mjs:390-426`) stops the summary from claiming success while blockers remain.

## 5. What is mediocre

- **Template unit tests (about 355 files).** Out of a 20-file sample, 15 are the generated template. Typical defects:
  - `expect(container).toBeInTheDocument()` is always true (`GlassNebulaClouds.test.tsx:27-30`).
  - The reduced-motion test (103 files) runs in jsdom, where computed `animationDuration` is empty and parses to 0. Each check is therefore `0 < 0.1`, and it iterates a possibly empty NodeList, so it can't fail (`GlassNebulaClouds.test.tsx:49-79`).
  - Focus tests are wrapped in `if (element)`, so they pass silently when nothing is focusable (`GlassSlider.test.tsx:75-96`).
  - "supports aria-describedby" asserts only that the helper `<span>` exists. It never checks the association (`GlassSlider.test.tsx:58-67`).
  - A `toMatchSnapshot` per component locks in DOM markup, not visuals, and gets rubber-stamped with `-u`.
  - `axe` in jsdom can't evaluate color contrast.

  Of the 20 sampled tests, 5 test real behavior: production-workflow, theme-engine, usePersonaTheme, useAutoTextContrast, LiquidGlassPhotoInspector. The last is a single 8-line assertion.
- **Coverage.** 38% lines against a 33% threshold with "raise later" comments (`jest.config.js:79-90`). The report on disk is four months old. No workflow runs coverage.
- **E2E.** `tests/e2e/navigation.spec.ts` drives the Storybook manager UI at `/`, not the library. "Keyboard navigation works" asserts that `document.activeElement.tagName` is truthy (`:14-36`).
- **`storybook-exhaustive-qa`** reports 1,595/1,595 pass with 0 findings and 71 "noise" events, generated 2026-05-08 against port 6016. It is stale, and a zero-finding result on 1,595 stories reads as a detector with no teeth.

## 6. What is outdated

- `reports/glassmorphism-storybook-visual-certification.*` and `reports/component_inventory.json` (356) describe the frozen 3.0 inventory but are still asserted by `test:visual:ci` (`playwright.visual-ci.config.ts:13`).
- `reports/storybook-exhaustive-qa.md` (May), `reports/component-screenshot-manual-qa` (May, 356), `coverage/` (June), `reports/audit/visual-all` component PNGs (Aug 14, older than about 100 4.1 source changes).
- Version-pinned audits that only make sense historically: `scripts/audit/3.0.7-source-audit.js`, `3.1-frame-loop-audit.js`, `scripts/ci/stale-3-3-scan.js`, `style-audit.js` alongside `style-audit-v2.js`, and `reports/3.2-release/*` / `reports/3.3-release/*`. `buildRecipeList` still reads `reports/3.3-release/recipe-render-evidence.json` for 4.x recipes (`token-purity-layout-audit.spec.ts:2421-2424`).
- Workflows on `actions/*@v4` and Node 20, while publish uses `@v6` and Node 24 (`publish-npm.yml:25-31`). `deploy-storybook.yml` posts a PR preview URL that doesn't exist (it deploys only on main).
- `jest.config.js:38` maps images to `<rootDir>/__mocks__/fileMock.js`, **which doesn't exist**. Any test that imports an image fails to resolve.
- The worktree is dirty: `scripts/ci/run-next-integration.js`, `run-vite-integration.js`, `verify-pack.js`, and `reports/3.2-release/vite-integration.json` are modified and uncommitted (`git diff --stat`).

## 7. Duplication

- `normalizeName` / `candidateNames` / `storyNameForMatch` / `rankStory` are copied across 6 files (`storybook-visual-certification.mjs:41-120`, `storybook-visual-certification.spec.ts:73-92`, `token-purity-layout-audit.spec.ts:437-593`, plus `public-export-audit.js` and others). Each copy has slightly different ranking, so the "same story" can differ between gates.
- Three overlapping story crawlers (`storybook-visual-certification.mjs`, `scripts/storybook-exhaustive-qa.js`, `token-purity-layout-audit.spec.ts`) plus `storybook-showroom-qa.spec.ts`, `storybook-presentation.spec.ts`, `story-presentation-audit.js`, `storybook-smoke-test.js`, and `diagnose-storybook-issues.js`.
- Four "glass" static validators: `verify-glass-pipeline.js`, `glass-violation-scanner.js`, `universal-glass-audit.js`, `static-glass-material-audit.js`, plus `token-lint.js`, `style-audit.js`/`-v2`, `forbidden-check.js`, `audit-css-var-coverage.js`, `check-undefined-custom-props.mjs`.
- Three visual-regression mechanisms (Playwright `toHaveScreenshot`, `jest-image-snapshot`, `visual-regression-system.js`). None has a committed baseline.
- 44 root probes, many near-identical (`probe-pb2…pb6.mjs`, `probe-inner/inner2`, `probe-dom/dom2`, `audit-story-probe/2`). These are ad-hoc debugging copies of the audit's surface-inspection code.
- CI duplication: `design-system-compliance.yml` runs typecheck, lint, tokens, styles, and glass:validate three times (gate steps, report generation, score job). `glass-pipeline.yml` runs `glass:validate` twice.

## 8. Fake complexity

- **"31-check glass pipeline"** (`README.md:618`): string-presence checks dressed up as gates (`verify-glass-pipeline.js:270-378`).
- **"Design System Score" with badges** (`design-system-compliance.yml:118-210`): five exit codes turned into a percentage, with a 60% pass bar.
- **"App Chrome Visual Baselines"**: screenshot capture with no comparison.
- **Certification of 498**: 79 directories are duplicate PNGs of aliases or sub-exports, 46 targets are providers and engines rendered through demo stories, and the counts are hardcoded constants that fail rather than grow.
- **Certification metadata** such as `inspectedBy: "Codex Storybook visual certification runner"`, `statesInspected: ["selected-story-default","reduced-motion"]`, and `themesInspected: ["storybook-default-dark"]` (`storybook-visual-certification.mjs:344-356`). The label says dark, but most screenshots have white backgrounds. These fields imply far more coverage than the 4 checks behind them.
- **Template test headers** that claim "✅ Accessibility / ✅ Reduced motion support" (`GlassNebulaClouds.test.tsx:5-11`) for assertions that can't fail.
- **Self-referential guard specs.** `storybook-visual-certification.spec.ts` and `glass-audit-coverage.spec.ts:78-224` assert that JSON reports agree with other JSON reports, which only proves the bookkeeping is consistent.

## 9. Critical findings

| ID | Severity | Claim | Evidence |
| --- | --- | --- | --- |
| QA-CERTIFICATION-01 | critical | The 4.1.0 "498 visual targets certified green" claim has no reproducible artifact. Component evidence predates about 100 4.1 source changes, and the repo's own verifier currently reports FAIL 0/498. | `RELEASE_NOTES_4.1.0.md:3,7,27`; `reports/audit/audit-summary.json` (runId `…20260814035148…`); `git show --stat 15b6de6f7` (only `recipe-*` visual dirs changed); `reports/audit/visual-all/visual-summary.md:3-15` |
| QA-CERTIFICATION-02 | critical | No CI workflow runs the full unit suite, the token-purity audit, the Storybook certification, or the evidence verifier. The npm publish gate runs no Jest suite beyond app-chrome axe. | `.github/workflows/publish-npm.yml:52-65`; `glass-pipeline.yml:42,91`; `package.json:291,323,337` (scripts exist, but no workflow invokes them) |
| QA-CERTIFICATION-03 | high | There is no pixel-diff regression: `visual-baselines/` is empty, Playwright snapshots are gitignored and darwin-only, the "baselines" job never compares, and the visual-regression workflow uploads a path its runner never writes. | `visual-baselines/` (empty); `.gitignore` (snapshots ignored, per `git status --ignored`); `scripts/ci/verify-app-chrome-visuals.js:894-901`; `.github/workflows/visual-regression.yml:42,49` |
| QA-CERTIFICATION-04 | high | The 356 Storybook certification is a smoke test: any render over 10px with a "glass" class or an `<svg>` passes, warnings are ignored, and a story that threw `Invalid easing type` passed. | `scripts/audit/storybook-visual-certification.mjs:296-334`; `reports/glassmorphism-storybook-visual-certification.json` (PageTransitionDemo pageerror, status passed) |
| QA-CERTIFICATION-05 | high | 498 is inflated: 470 = 452 canonical + 18 alias/coveredBy entries from 359 files, about 46 are providers or engines, and 79 evidence dirs are byte-identical duplicates in 24 groups. | `reports/public-visual-target-manifest.json` (summary); `scripts/audit/public-export-audit.js:318-324`; PIL hash scan of `reports/audit/visual-all/*/desktop.png` |
| QA-CERTIFICATION-06 | high | About 355 generated unit tests contain assertions that can't fail (container in document, jsdom reduced-motion, `if (element)` guarded focus), which inflates the test count to 759 files without behavioral value. | `src/components/atmospheric/GlassNebulaClouds.test.tsx:27-30,49-79`; `src/components/input/GlassSlider.test.tsx:58-96`; `rg -l "Test Suite Coverage:" src` = 355 |
| QA-CERTIFICATION-07 | medium | Inventory counts are hardcoded constants (470/1/28/498), so the gate can't grow with the library and must be hand-edited per release. | `tests/visual/design-system/token-purity-layout-audit.spec.ts:206-211,2294-2306,4270-4275` |
| QA-CERTIFICATION-08 | medium | Recipes are "audited" by re-reading PNG and JSON files produced earlier by a separate harness. The audit never renders them. | `token-purity-layout-audit.spec.ts:2421-2462,3398-3440,4560-4590` |
| QA-CERTIFICATION-09 | medium | The "31-check glass pipeline" and the "Design System Score" are string-presence and exit-code bookkeeping. The score passes at 60%, and the CSS budget is 30KB in CI but 50KB in the script. | `scripts/verify-glass-pipeline.js:356,367`; `.github/workflows/design-system-compliance.yml:176-185`; `glass-pipeline.yml:79` |
| QA-CERTIFICATION-10 | medium | Coverage is 38% lines against a 33% threshold, the report is from June, and no workflow enforces coverage. | `coverage/coverage-summary.json`; `jest.config.js:79-90` |
| QA-CERTIFICATION-11 | medium | The token-purity gate tests one narrow neutral-white aesthetic on a mostly white canvas in default story state. It can't measure premium visual quality, interaction states, or real backdrop refraction. | `token-purity-layout-audit.spec.ts:2924-2939,3070-3107`; 420/498 desktop PNG corners are rgb(255,255,255) |
| QA-CERTIFICATION-12 | low | 44 tracked root probe scripts hardcoded to localhost:6006 clutter the package root and duplicate audit code. | `git ls-files '*.mjs'` (probe-pb2…pb6, probe-inner2, audit-story-probe2) |
| QA-CERTIFICATION-13 | low | Broken or orphaned config: the `__mocks__/fileMock.js` mapping target doesn't exist, `jest.visual.config.js` has a `moduleNameMapping` typo and is unused, and `visual-regression.test.js` is orphaned. | `jest.config.js:38`; `jest.visual.config.js:4,20,25`; `tests/visual/visual-regression.test.js` |
| QA-CERTIFICATION-14 | low | The release-blocking `test:visual:ci` includes two specs that only compare JSON files but boot Storybook, and it asserts the frozen 3.0 356 inventory. | `playwright.visual-ci.config.ts:12-18,40-45`; `tests/visual/design-system/storybook-visual-certification.spec.ts:94-151` |

## 10. Recommendations for AuraGlass 5.0

### 10.1 Rebuild the gate stack (mechanically testable, all in CI)

1. **Derive the inventory from source; don't hardcode it.** Generate the visual target list from the export map plus an explicit `nonVisual` annotation in source, such as a `@nonvisual` JSDoc tag or a registry. Fail on unclassified exports, not on count changes. Remove aliases and providers from the visual count, and report "N distinct visual components" honestly.
2. **Add real pixel regression with committed Linux baselines.** Use one Playwright config, a pinned Docker or CI image, `toHaveScreenshot` with `maxDiffPixelRatio` of about 0.002 per component, and baselines committed under `tests/visual/__baselines__/linux/`. Updating baselines requires a PR label and a human approval. Run this on remote CI, never on the Mac.
3. **Shard the token-purity audit.** Split it into one Playwright test per component (or per family) so it parallelizes across CI shards and fails individually. Run it on a static `storybook-static` build, not `npm run storybook`. Make it required on PRs that touch `src/`.
4. **Pin evidence to a commit.** Every release gate writes artifacts keyed by git SHA. `verify-visual-evidence.js` runs in `publish-npm.yml` and must PASS for `HEAD`. Release notes may cite only artifacts that the verifier validated for the tagged SHA.
5. **Test more than one state.** Story args matrix for hover, focus-visible, pressed, open, disabled, error, loading, long text, and RTL. Run on two canonical backdrops: a photographic or busy backdrop to prove frost and legibility, and a solid one. Run in both light and dark themes.
6. **Make console hygiene strict.** Any `pageerror` or `console.error` fails. Warnings come from an explicit allowlist file.
7. **Replace the unit-test template.** Delete the generated reduced-motion, focus, and `container`-in-document tests and most DOM snapshots. Require per-component behavioral tests (keyboard contract, ARIA association, controlled and uncontrolled props, callbacks) for the core 60 to 80 components. Use `@testing-library/user-event` and assert on roles. Raise the coverage threshold per directory for the core packages instead of globally, and enforce it in CI.
8. **Run accessibility in a real browser.** Use axe-playwright on the rendered stories (it can evaluate contrast), plus keyboard-trap and focus-order scripts for overlays and menus.
9. **Keep package gates.** Pack, tree-shaking, no-core-ui-deps, Next and Vite tarball smokes, and consumer type tests already work. Add a bundle-size budget per entrypoint (size-limit) with a hard fail.
10. **Make every gate fail, not just score.** Delete the "score" job and any `continue-on-error` reporting duplicates.

### 10.2 Needs human review (cannot be mechanized)

- Premium look and feel: hierarchy, typography rhythm, material depth, and refraction quality against a reference board, such as first-party OS screenshots.
- Motion quality (easing feel, choreography). Mechanize only duration and easing tokens and reduced-motion compliance.
- Whether an intentionally tinted or semantic surface should be exempt from the neutral-frost rule. Record each exemption in a reviewed allowlist with a rationale.
- Approving baseline updates. A designer signs off on each diff image.
- Story quality: whether the default story shows the component realistically, not as a demo shell.

### 10.3 Delete or consolidate

- Delete the 44 root `probe-*.mjs`/`audit-*.mjs` files. Fold any useful checks into the audit library as named detectors with fixtures.
- Delete `jest.visual.config.js`, `tests/visual/visual-regression.test.js`, `scripts/visual-regression-system.js`, the empty `visual-baselines/`, the legacy darwin-only snapshot specs, version-pinned audits (`3.0.7-*`, `3.1-*`, `stale-3-3-scan`, `style-audit.js` v1), and one-off fixer scripts in `scripts/`. Move historical `reports/3.x-release/*` to a release-archive branch or tag, not the main tree.
- Merge the story crawlers and name matchers into one `@auraglass/qa` module: story resolver, surface inspector, census, and layout detectors, each with self-test fixtures.
- Replace `verify-glass-pipeline.js` string checks with real tests, or remove them. Stop citing "31 checks".
- Retire the 356 Storybook certification and `component_inventory.json`. The new inventory plus pixel regression supersede them.

## Verification (adversarial)

Each finding was re-checked against code and artifacts on 2026-10-06. Nothing was rendered locally. Pixel and hash checks used Python/PIL over files already on disk.

| id | verdict | note |
| --- | --- | --- |
| QA-CERTIFICATION-01 | CONFIRMED | `RELEASE_NOTES_4.1.0.md:3,7` claims 498/0/0. `reports/audit/audit-summary.json` runId is `runtime-audit-full-20260814035148-...`. `git show --stat 15b6de6f7` touches 78 `src/components` paths, and every `visual-all` path it touches is a `recipe-*` dir (0 non-recipe). `reports/audit/visual-all/visual-summary.md:3,13` reads `Status: FAIL`, `Fully verified: 0/498`. Caveat: that summary is untracked and was generated after the release, so it shows the evidence is stale now. It doesn't prove the 4.1 claim was false at release time. |
| QA-CERTIFICATION-02 | CONFIRMED | `publish-npm.yml:55-65` runs only typecheck, build, lint:no-core-ui-deps, tree-shaking, app-chrome a11y, verify:pack, css-vars, next/vite integration and app-chrome visuals. No workflow runs a bare `npm test`/`jest`, `test:coverage`, `test:visual:ci` or `audit:visual:evidence`. The only Jest calls are targeted `glass-pipeline.yml:42` (glass-contrast), `:91` (`--testPathPattern=a11y`) and `design-system-compliance.yml:52`. |
| QA-CERTIFICATION-03 | CONFIRMED | `visual-baselines/` has 0 entries. `.gitignore:170` ignores `tests/visual/**/*.spec.ts-snapshots/`, and the files present are `*-chromium-darwin.png`. `verify-app-chrome-visuals.js:898-903` writes `page.screenshot`/`locator.screenshot` to a path with no comparison. `visual-regression.yml:42` runs `scripts/visual-test-runner.js` (Playwright), but `:49` uploads `tests/visual/__image_snapshots__/__diff_output__` (a jest-image-snapshot layout). Nuance: `toHaveScreenshot` exists (`tests/visual/utils/glassmorphism-helpers.ts:96`, `tokens.spec.ts:326`), so the comparison mechanism is there. Without committed Linux baselines it can't detect a regression. |
| QA-CERTIFICATION-04 | CONFIRMED | `storybook-visual-certification.mjs:296-312` only checks visibleElementCount>0, root>=10px, any glass/canvas/svg, and no fallback. `:325-330` drops warnings and blocks only on the regex. The report has `statusCounts {passed:356}` and 26 console events. PageTransitionDemo logged `pageerror "Invalid easing type 'ease-in-out'"` on desktop and mobile and is still `status: passed`. |
| QA-CERTIFICATION-05 | CONFIRMED | The manifest summary is 452 canonical + 11 alias + 7 coveredBy = 470. `public-export-audit.js:318-324` decides `isComponentLike` with `/^[A-Z]/` plus a path regex over components/primitives/client/theme/contexts. My name scan for Provider/Engine/Context/Manager/Orchestrator/Boundary gives 44 of 470, close to the claimed ~46. A sha256 scan of 498 `visual-all/*/desktop.png` gives exactly 24 duplicate groups covering 79 dirs. The largest group has 13 members, all `glass-dropdown-menu*`. I didn't re-verify the "359 source files" count. |
| QA-CERTIFICATION-06 | CONFIRMED | `rg -l 'Test Suite Coverage:' src` = 355. Test files under `src` = 759 (792 repo-wide). `GlassNebulaClouds.test.tsx:27-30` asserts `container` toBeInTheDocument. The reduced-motion test reads jsdom `getComputedStyle` durations, which are empty, so `parseFloat('0')` passes every time. I didn't re-run the "5 of 20 sampled" figure or check GlassSlider line by line. |
| QA-CERTIFICATION-07 | CONFIRMED | `token-purity-layout-audit.spec.ts:206-211` hardcodes 470/1/471/28/498/499 (plus a stale 439). `:2294-2306` throws when the manifest length or summary differs from 470. |
| QA-CERTIFICATION-08 | CONFIRMED | `:2421-2460` loads recipes from `reports/3.3-release/recipe-render-evidence.json` with `recipeHarness: scripts/ci/verify-recipes-render.js`. `:3398-3410` (`validateRecipeViewportEvidence`) says recipe evidence "is produced by the independent recipe harness" and reads the PNG and computed-styles JSON from disk. Component exports are rendered live (`:2745` `page.goto`). |
| QA-CERTIFICATION-09 | CONFIRMED | `verify-glass-pipeline.js:356` passes if the file contains '4.5' and 'WCAG AA'. `:333` sets a 50KB budget against `glass-pipeline.yml:78` `max_size=30720`. `design-system-compliance.yml:174-180` exits 1 only when the score is below 60. |
| QA-CERTIFICATION-10 | CONFIRMED | `coverage/coverage-summary.json` (mtime Jun 14) has lines 38.46, statements 37.21, functions 25.15, branches 35.04. The global threshold in `jest.config.js:79-90` is lines 33, statements 32, functions 20, branches 28. No workflow runs `test:coverage`. `test:regression:ci` -> `test:all` -> coverage is never invoked from CI. |
| QA-CERTIFICATION-11 | PARTIAL | The general point stands: there's a single neutral band, default state only, and backdrop/refraction isn't measured. The "420 of 498" figure is worded loosely. 420 desktop PNGs have at least one pure-white corner. Only 264 have all four corners pure white, and 284 have all four corners >=240. The canvas is mostly white, but less uniformly than the wording suggests. |
| QA-CERTIFICATION-12 | PARTIAL | The substance is right, but the counts are slightly off. `git ls-files '*.mjs'` at repo root = 45 files and 1,523 LOC (not 44/1,491), and all 45 reference 6006. I didn't check the near-duplicate claim beyond file names. |
| QA-CERTIFICATION-13 | CONFIRMED | `jest.config.js:38` maps images to `<rootDir>/__mocks__/fileMock.js`, and `__mocks__/` doesn't exist. `jest.visual.config.js:4,20` declares `setupFilesAfterEnv` twice, and `:25` uses the invalid key `moduleNameMapping`. Outside docs/reports, `rg` finds no reference to `jest.visual.config` or `visual-regression.test`. |
| QA-CERTIFICATION-14 | PARTIAL | `playwright.visual-ci.config.ts:12-18,40-45` does boot Storybook, and `storybook-visual-certification.spec.ts` checks report counts against `inventory.components.length` (the 356-entry inventory). But "specs that only compare JSON reports" is wrong. `token-purity-layout-audit.spec.ts:2745` renders each export via `page.goto`, `glass-audit-coverage.spec.ts:293`, `accessibility-story-quality.spec.ts:107,152,188,285` and `liquid-glass-showcase.spec.ts:4` all navigate live stories, and `:3930-4111` holds real detector regression fixtures. Booting Storybook is justified for most of this config. Only the certification spec is JSON-only. |
