# AuraGlass 4.1.1 Trust Patch PRD

| Field | Value |
|---|---|
| PRD id | **PRD-00** |
| Key | **TRUST** (task fragment `tasks/TRUST.json`; shared contract registry `prd/_shared-contracts.md` SC-01). Other PRDs are cited by §16 id with their key, e.g. PRD-01 (REL), PRD-02 (PKG); the crosswalk is SC-01 |
| Owner area | Release engineering and trust (security, privacy, crash, packaging, claims) |
| Status | Draft |
| Target release | `aura-glass@4.1.1`, week of 2026-10-12 (architecture §14.1) |
| Baseline | `aura-glass` 4.1.0, HEAD `15b6de6f7`, plus 4 uncommitted files (§2.1) |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§2 D-01/D-27/D-30/D-31/D-32, §7.5, §8, §9, §13.1, §13.2, §14.1, §15.3, §16 PRD-00 row); `AURAGLASS_CURRENT_STATE_AUTOPSY.md` (A1, B3, C5–C12, TD-10..TD-36); `autopsy/packaging-ssr-dx.md`; `autopsy/hooks-utils-types.md`; `autopsy/server-services-ai.md`; `autopsy/motion.md`; `autopsy/history-hygiene.md`; `autopsy/docs-readme.md`; `autopsy/qa-certification.md`; `autopsy/runtime-local.md` §6; `autopsy/runtime-remote.md` §5 |
| Related decisions | **D-01** (4.1.1 ships defects as C-I patches before the major), **D-31** (Aeonik out of the MIT tarball pending licence), **D-32** (evidence is CI artifacts, never committed; no history rewrite); also consumed: D-27 (API report + `deprecations.json`), D-30 (security advisory before server extraction) |
| Requirement prefix | `REQ-TRUST-NN` |
| Acceptance prefix | `AC-TRUST-NN` |

**Deviations from the canonical architecture (declared).**

1. File name. §16 names this PRD `PRD-00-trust-patch-4.1.1.md`. The program assignment writes it to `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md`. The PRD id stays **PRD-00**; PRD-01 and others should link this path.
2. `verify-app-chrome-visuals.js`. Architecture §14.1 says "commit the npm 11/12 `pack --json` fix" and the autopsy names three scripts. A fourth call site, `scripts/ci/verify-app-chrome-visuals.js:776` (`JSON.parse(packOutput)[0]`), still has the npm ≤10-only parse and is run by `publish-npm.yml` (`test:visual:app-chrome`). It is added to scope (REQ-TRUST-02). Evidence: `rg -n "npm pack" scripts/ci` on 2026-10-06.
3. ID drift on the font finding. The autopsy summary cites "TOKENS-THEME-12 / PACKAGING-SSR-DX-05" for Aeonik; in the current reports those IDs describe Storybook CSS and the Next smoke. The verified font finding is **DOCS-README-14**. This PRD cites DOCS-README-14.
4. Slot fallback is version-gated. Architecture §9 says "reads `props.ref` when present and falls back to `element.ref`". A literal `props.ref ?? element.ref` still reads `element.ref` on React 19 whenever the child has no ref, and React 19's dev getter warns on that read. REQ-TRUST-26 therefore selects the read by `React.version` major, which meets the §9 intent (no React 19 warning, React 18 still composes).
5. Contract paths follow the shared contract registry (`prd/_shared-contracts.md`, binding; a registry row wins over any PRD text). The shared artifact names are: publish workflow `.github/workflows/publish-npm.yml`, **kept under that filename** because the npm trusted-publisher binding is `auraoneai/auraglass` + `publish-npm.yml` (SC-05; owner REL); API reports `etc/api/<slug>.api.md`, `etc/api/<slug>.exports.json` and `etc/api/manifest.json`, slug `.` → `index`, built by `scripts/release/api-report.mjs` and `scripts/release/export-snapshot.mjs`, tests in `tests/release/` (SC-04; owner REL); the repo-root `deprecations.json` with `version: 1` from the first 4.1.1 commit and the REL §4.3 entry schema including the `honesty` exception (SC-02/SC-03; owner REL); the pack helper `scripts/ci/lib/npm-pack.js` (SC-06; owner TRUST); the evidence helper `scripts/ci/lib/evidence-dir.js` (SC-07/SC-11); and decision records under `docs/release/decisions/` (SC-35). Architecture §16 gives PRD-00 the 4.1.1 *instances* (CI-only publish, baseline API report, `deprecations.json` seed); this PRD builds them at the registry paths so nothing is renamed later. PRD-01 (REL) keeps the schema file `docs/schemas/deprecations.schema.json`, the change-class gate, the ledger and dist-tag derivation, and extends the API scripts (REL-003). TRUST tasks that create these instances are the registry's foundation anchors (SC-40): TRUST-002, TRUST-006, TRUST-071/072, TRUST-075, TRUST-077, TRUST-079.
6. `useEnhancedReducedMotion` keeps its server value `true`. The hydration fix changes the *client's first pass* to match the server, not the server output (HOOKS-UTILS-TYPES-09: server `?? true` is the documented conservative default). Changing the server value would be an SSR markup change in a patch.
7. Side-effect hooks are not hoisted as-is. `usePredictiveEngine`, `useEyeTracking`, `useBiometricAdaptation`, `useSpatialAudio`, `useAchievements` and `useInteractionRecorder` **throw** outside their providers (`src/components/advanced/GlassPredictiveEngine.tsx:945-952`, `GlassEyeTracking.tsx:459-465`). Calling them unconditionally in `GlassButton`/`GlassContainer` would crash every consumer without the provider, and they are root-exported (`src/index.ts:513-669`), so their signatures cannot change in a patch. REQ-TRUST-22 uses internal non-throwing readers instead.
8. 4.1.1 scope intake (SC-36). This PRD is the only owner of 4.1.1 contents. Three items proposed by other PRDs are accepted (§5.11: NAV E-22, MOT REQ-MOT-28 cookie consent, FND AC-FND-02 React 19 unit matrix). Five proposals are deferred to 4.2 and are **not** in this PRD: MOT FPS-loop removal (REQ-MOT-86), NAV E-15 GlassWorkspaceTabs DOM prop leak, DS `--glass-opacity-24/32/52/72` fix, CTL GlassSwitch shimmer removal, and the DS `getPersona` type change. Their owners retarget them to the REL/§16 PRD-17 4.2 train (D-28 labels where visual).
9. Branch line. While `package.json` `version` is 4.x, `main` follows 4.x rules (REL §4 change-class table); all 4.1.1 PRs merge to `main` before the `release/4.x` cut. Edits to 4.x-only files that 5.0 removes on `main` (`scripts/ci/run-next-integration.js`, `run-vite-integration.js`, removed by PKG-142; `.github/workflows/visual-regression.yml`, removed by QA-119) belong to the 4.x line only and are not ported forward (SC-09, SC-39).

No screenshot was viewed while writing this PRD. Every visual statement is measured, sourced from the autopsy, or inferred from code.

---

## 1. Problem

AuraGlass 4.1.0 is published, installed and trusted by consumers, but several of its defects are not quality debt; they are safety, privacy, crash and honesty failures that cannot wait for 5.0 (D-01, HISTORY-HYGIENE-13). Concretely:

- **Privacy.** Importing the root starts behaviour tracking: document `click`/`scroll` listeners that record element tag, id and coordinates into an unbounded array, a never-cleared 1 s `setInterval`, and later writes of `--glass-ai-*`/`data-ai-*` onto `<html>`. `sideEffects` tells bundlers the JS is pure (HOOKS-UTILS-TYPES-01, CONFIRMED).
- **Security.** `GlassCanvas` evaluates a string prop with `new Function(onClickScript)()`, a script-injection sink for any CMS-authored content (`src/components/cms/GlassCanvas.tsx:315`). The published package also ships a hosted backend whose Docker image bakes in a public default `JWT_SECRET`, with authentication but no authorization and open WebSocket rooms (SERVER-SERVICES-AI-01/-03/-05). No advisory has been published.
- **Crashes.** Conditional hook calls on 109 lines in 24 files (`GlassInput` throws "Rendered more hooks" when `errorText` appears; API-CONSISTENCY-02). `aura-glass/primitives` and `aura-glass/theme` lack `"use client"` and crash at import in an App Router Server Component (PACKAGING-SSR-DX-04). Three root-exported SSR helpers cause hydration mismatches (HOOKS-UTILS-TYPES-09/-10/-23).
- **Accessibility harm.** 84 `animate={reduced ? {} : …}` sites in 35 files leave content at `opacity: 0` or `scale: 0` for exactly the users who asked for reduced motion (MOTION-01, CONFIRMED). ContrastGuard and `validateTextContrast` report WCAG compliance they never measured (ACCESSIBILITY-01, TOKENS-THEME-07).
- **False claims.** README, `llms.txt` and `RELEASE_NOTES_4.1.0.md` assert "498 visual targets certified green", "100% reduced motion", "SSR-safe" and an "optional backend". The repo's own verifier reports `Visual evidence FAIL: 0/498` at HEAD (QA-CERTIFICATION-01), and the backend packages are hard `dependencies` (DOCS-README-07).
- **Unreproducible releases.** 4.1.0 was published outside CI. It depended on 4 uncommitted edits that make `npm pack --json` parsing work on npm ≥11; without them `prepublishOnly` fails on current npm (`runtime-local.md` §6). "AuraGlass Pipeline Validation" has failed every run since v3.3.0 (2026-06-05). `publish-npm.yml` keeps an `NPM_TOKEN` fallback path, and `scripts/publish-307-after-npm-login.sh` documents a laptop publish path.
- **Repository weight.** 47,342 of 50,127 tracked files (2,930 MB of the 2,948 MB HEAD tree, 99.4%; `git ls-tree -r -l HEAD`, HISTORY-HYGIENE-01) are committed evidence in `reports/`, and 45 one-off `*probe*.mjs`/`inspect*.mjs` scripts sit in the repo root (HISTORY-HYGIENE-02/-09).
- **Legal exposure.** 12 Aeonik `woff2` files ship in an MIT tarball with no font licence or notice (DOCS-README-14, CONFIRMED; redistribution rights unverifiable from the repo).
- **No baseline for change control.** There is no API report and no `deprecations.json`, so 4.2/4.3 cannot prove "no removal without prior deprecation" (D-27).

The 4.1.1 trust patch fixes the defects above without changing any intentional public behaviour other than the security, privacy and crash exceptions listed in architecture §13.1. It must be the first release published only from CI with OIDC provenance and a green Pipeline Validation run.

---

## 2. Evidence from the current codebase

All paths were re-checked with `rg --files`/`rg -n` against the working tree on 2026-10-06. Verdicts are the verified ones from the autopsy; no REFUTED finding is used.

### 2.1 The 4 uncommitted files and how they fold in

`git status` at session start shows these as modified (plus untracked `docs/auraglass-5/` and `reports/audit/visual-all/visual-summary.{json,md}`):

| File | What the diff does | Verdict | Fold-in |
|---|---|---|---|
| `scripts/ci/run-next-integration.js:47-50` | `JSON.parse(packOutput)[0]` → `Array.isArray(parsed) ? parsed[0] : Object.values(parsed)[0]`. npm ≤10 emits `[{…}]`; npm ≥11 emits `{ "aura-glass": {…} }` | Correct, needed (`runtime-local.md` §6; `packaging-ssr-dx.md:136-146`) | Commit as-is inside REQ-TRUST-01, then refactor to the shared helper (REQ-TRUST-02) |
| `scripts/ci/run-vite-integration.js:42-48` | Same shape fallback | Correct, needed | As above |
| `scripts/ci/verify-pack.js:134-147` | `indexOf('[')` → `search(/[[{]/)` (the old code landed inside the object's `files` array and parsed garbage) plus the shape fallback, including the `parsed.files ? parsed : …` branch | Correct, needed | As above |
| `reports/3.2-release/vite-integration.json` | Regenerated output: 3.5.0 → 4.1.0, shasum `08fd6660…`, `generatedAt` 2026-09-05T19:48:05Z (9 minutes before the 4.1.0 publish at 19:57Z) | Evidence only; it proves 4.1.0 was packed on a laptop with these edits | **Not committed.** Discarded with `git restore` before the `reports/` tree removal (REQ-TRUST-31). Its successor is a CI artifact (REQ-TRUST-33) |

Why it matters: `package.json:329` `prepublishOnly` runs `verify:pack`, `test:integration:next` and `test:integration:vite`. `publish-npm.yml:30` uses Node 24 (npm 11), where the committed code throws "Failed to generate npm pack tarball" / "Unexpected npm pack output". `glass-pipeline.yml` uses Node 20 (npm 10), which is why the bug is invisible there. The 4.1.0 tarball is not reproducible from git.

Related sites found during this PRD: `scripts/ci/verify-recipes-render.js:100-102` already handles both shapes (a third variant of the same logic); `scripts/ci/verify-app-chrome-visuals.js:776` does **not** (`JSON.parse(packOutput)[0]`).

### 2.2 Security and privacy

| Finding | Evidence |
|---|---|
| HOOKS-UTILS-TYPES-01 (critical, CONFIRMED) | `src/utils/adaptiveAI.ts:84` constructor calls `initializeTracking()`; `:150-187` document `click`/`scroll` listeners push `tagName#id` and clientX/Y; `:190` `setInterval` with no handle; `:213`/`:468-500` writes `--glass-ai-*` and `data-ai-*` to `<html>`; `:563` `export const adaptiveAI = AdaptiveAIEngine.getInstance();`; `src/index.ts:915` root export; `package.json` `sideEffects` lists only CSS |
| `new Function` sink (§13.1) | `src/components/cms/GlassCanvas.tsx:302` `const onClickScript = toStringProp(component.props.onClick)`; `:315` `new Function(onClickScript)()` inside an `eslint-disable no-new-func` |
| Consumer media forced to poster (STORYBOOK-SHOWCASE-07, PARTIAL: the one real production leak) | `src/components/media/GlassAdvancedVideoPlayer.tsx:82-83` `isStorybookDataMedia = src?.startsWith("data:video/")`; `:985-986` `usePosterSurface = !mediaFile.src \|\| isStorybookDataMedia(mediaFile.src)` |
| SERVER-SERVICES-AI-01 (critical, CONFIRMED scoped) | `Dockerfile:50` copies `.env.example` (`:22` `JWT_SECRET=your-super-secret-jwt-key-change-in-production`) to `.env`; `server/index.ts:26` `dotenv.config()`; `src/services/auth/auth-service.ts:38-41,109-110,136` accepts any truthy secret and trusts the role claim. `docker-compose.yml:29,55` fails closed; plain `docker run`/k8s does not |
| SERVER-SERVICES-AI-03/-05/-07 | Auth without authorization on paid routes, no WebSocket room ACL, cost abuse (`server/index.ts:272-284,347-348,497-506`) |
| Supported-versions table stale | `SECURITY.md` lists 3.1.x as the active line |

### 2.3 Crash, RSC and hydration

| Finding | Evidence |
|---|---|
| API-CONSISTENCY-02 (understated; C5) | `rg --pcre2 "(\?\|&&)\s*use[A-Z]\w*\(" src` (excluding stories/tests) = **109 lines in 24 files**. Top: `ToggleButton.tsx`, `GlassFab.tsx`, `GlassButton.tsx` (7 each; `GlassButton.tsx:286-300`), `GlassHeader`, `GlassDrawer`, `GlassContainer`, `GlassKanban`, `GlassChat`, `GlassCarousel`, `GlassDataTable`, `ModularGlassDataChart`, `GlassChart` (6 each); `GlassInput.tsx:147-150` (`errorText ? useA11yId(…)`). `eslint.config.js` registers no `react-hooks` plugin although `eslint-plugin-react-hooks@^4.6.0` is a devDependency (`package.json:461`) |
| PACKAGING-SSR-DX-04 (high, CONFIRMED) | `src/primitives/index.ts:1` and `src/theme/index.ts:1` open with a comment, not a directive; `dist/primitives/index.mjs:3181,3882` and `dist/theme/index.mjs:232` call `createContext` at module scope |
| PACKAGING-SSR-DX-03 (high, CONFIRMED) | `src/index.ts:1` `"use client"` makes the root one client boundary. **Out of scope for 4.1.1** (fixing it requires the per-file build of PRD-02); recorded so README stops claiming otherwise |
| HOOKS-UTILS-TYPES-09 | `src/hooks/useEnhancedReducedMotion.ts:33-36` `safeMatchMedia(…)?.matches ?? true` (server `true`, client real value); exported `src/index.ts:875` |
| HOOKS-UTILS-TYPES-10 | `src/hooks/useDeviceCapabilities.ts:31-36` lazy initializer returns `detectDevice()` during hydration; exported `src/index.ts:893` |
| HOOKS-UTILS-TYPES-23 (high, CONFIRMED) | `src/components/ssr/AuraGlassClientBoundary.tsx:14` `useState(() => isBrowser())` renders `fallback` on the server and `children` on the first client pass; exported `src/index.ts:916` |
| Slot ref (architecture §9.2) | `src/primitives/Slot.tsx:76` reads `(child as …).ref`, i.e. `element.ref`, which React 19 deprecates with a warning on every render through `Slot` |

### 2.4 Reduced motion and contrast honesty

| Finding | Evidence |
|---|---|
| MOTION-01 (CONFIRMED: 84 sites / 35 files) | `rg --pcre2 "animate=\{[^}]*[Rr]educed[^?]*\?\s*\{\}" src` = 84. Top: `interactive/GlassFacetSearch.tsx` 7, `social/GlassPresenceIndicator.tsx` 6 (`:207-208`), `mobile/TouchGlassOptimization.tsx` 6, `voice/VoiceGlassControl.tsx` 5; also `accessibility/GlassFocusIndicators.tsx`, `animations/GlassTransitions.tsx` 4, `GlassA11y.tsx:398-401`. With `animate={}` Framer keeps `initial` (`opacity: 0`), and nothing overrides it |
| MOTION-02 | `src/contexts/MotionPreferenceContext.tsx:9-13` default `false`; the provider is mounted only in its story and one test |
| Browser evidence | `runtime-remote.md` §5: CSS infinite animations drop 4→0 under emulated reduced motion; the JS paths above were **not** exercised in the browser |
| ACCESSIBILITY-01 (CONFIRMED) | `src/components/accessibility/ContrastGuard.tsx:245-247` emits `data-contrast-ratio` and `data-meets-wcag` from fabricated math; reports pass on throw |
| TOKENS-THEME-07 | `src/tokens/glass.ts:931-935` `validateTextContrast` returns `true` unconditionally |

### 2.5 Claims, CI, repository and legal

| Finding | Evidence |
|---|---|
| QA-CERTIFICATION-01 (CONFIRMED) | `npm run audit:visual:evidence` → `Visual evidence FAIL: 0/498` at HEAD (re-run 2026-10-06) |
| Claims | `README.md:3,16,21,27,74,153,156,187,219,221,223,443,446,451-459,497,525-576,610`; `llms.txt:5` ("SSR-safe"); `RELEASE_NOTES_4.1.0.md:3,7,18,27` ("certifies the full visual surface", "498 passed") |
| QA-CERTIFICATION-02 / HISTORY-HYGIENE-01 | Pipeline Validation red for its last 30 runs (last green v3.3.0, 2026-06-05); 4.1.0 on npm 2026-09-05T19:57Z with no matching publish run |
| CI publish path | `.github/workflows/publish-npm.yml:3-9` `workflow_dispatch` only; `:20` `HAS_NPM_TOKEN`; `:80-84` token-provenance branch with `NODE_AUTH_TOKEN: secrets.NPM_TOKEN`; `package.json:324-325` local `release`/`release:dry-run`; `scripts/publish-307-after-npm-login.sh`, `scripts/configure-npm-trusted-publishing-307.sh` |
| Lint gate | `glass-pipeline.yml:36` `npm run lint:check`; `eslint.config.js:29` `auraglass/no-inline-glass: 'error'`; 165 errors recorded (architecture §17; `architecture/proposal-migration-first.md:492`; count to be re-measured in CI by REQ-TRUST-09) |
| Stale snapshots | `src/components/button/GlassButton.test.tsx` and `src/components/card/GlassCard.test.tsx` fail on clean `main` (c07fd7111 regression: card fill 0.12 → 0.018) |
| HISTORY-HYGIENE-02 | `git ls-files reports \| wc -l` = 47,342; `du -sh reports` = 2.8 G; `reports/audit/` 46,352 files. `rg -l "['\"]reports['\"]\|['\"/]reports/" scripts` = 28 files (27 scripts + `scripts/ci/README.md`); most write into `reports/`, `scripts/ensure-component-inventory.js` (run by `prebuild-storybook`, `package.json:327`) writes an **empty** `{ components: [] }` fallback when the inventory is missing |
| Hidden `reports/` consumers | `src/stories/CuratedComponentGuide.stories.tsx:3` imports `../../reports/component_inventory.json`; `tests/visual/design-system/storybook-visual-certification.spec.ts:8-14,126`; `src/reports/glassmorphismAuditCoverage.ts:5-6,47,66-68`; root exports of report paths at `src/index.ts:767-785` |
| HISTORY-HYGIENE-09 | 45 tracked root scripts: 37 `probe-*.mjs`, `webkit-probe.mjs`, `audit-probe.mjs`, `audit-dom-probe.mjs`, `audit-story-probe.mjs`, `audit-story-probe2.mjs`, `inspect-toggle.mjs`, `list-stories.mjs`, `.audit-inspect.mjs` |
| DOCS-README-14 (CONFIRMED) | `src/styles/fonts/Aeonik-*.woff2` (12 files, 468 KB, `performance.md:55`); `src/styles/index.css:4` `@import "./aeonik.css"`; `src/styles/variables.css:31` `"Aeonik", system-ui, …`; `scripts/build-all.js:161` emits `fonts/[name]`; `LICENSE` is MIT with no font notice; `README.md:27` |
| Change-control baseline | No `api-extractor.json`, no `etc/*.api.md`, no `deprecations.json` in the tree (`rg --files`) |

---

## 3. Desired end state

When 4.1.1 is on npm `latest`:

1. **Reproducible, CI-only release.** `aura-glass@4.1.1` was published by `.github/workflows/publish-npm.yml` (filename kept for the npm trusted-publisher binding, SC-05) from tag `v4.1.1` via npm trusted publishing (OIDC) with a provenance attestation that names that workflow and commit. No `NPM_TOKEN` path exists in any workflow, no local `release` script exists, and the commit carries a green "AuraGlass Pipeline Validation" run. `prepublishOnly` passes on npm 10 and npm 11+.
2. **No import-time side effects from `adaptiveAI`.** `import "aura-glass"` in jsdom adds zero document listeners, zero intervals and zero `<html>` attribute writes from `adaptiveAI`. Tracking runs only after an explicit `enableAdaptiveAI()` call, which itself warns as deprecated.
3. **No code-evaluation sinks.** `rg -n "new Function|eval\(" src --glob '!*.test.*'` returns only the documented feature probes in `src/utils/browserCompatibility.ts` (which are removed in 5.0 by PRD-16), and `GlassCanvas` never evaluates a string. `GlassCommandPalette` search never throws on regex metacharacters (§5.11).
4. **No known crash paths in the tested set.** Zero conditional hook calls (`react-hooks/rules-of-hooks` at `error` over `src/**`). `aura-glass/primitives` and `aura-glass/theme` import cleanly in a Server Component under a `next build`. `GlassInput` toggling `errorText` does not throw.
5. **No hydration mismatch** from `AuraGlassClientBoundary`, `useEnhancedReducedMotion` or `useDeviceCapabilities` under `renderToString` → `hydrateRoot` with React 18.2 and React 19.
6. **`Slot` is warning-free on React 19** and still composes refs on React 18.
7. **Reduced motion never hides content.** None of the 84 sites remains; under `prefers-reduced-motion: reduce` every affected component's settled state has computed `opacity: 1` and an identity transform. The three cookie-consent banners are visible when shown and neither visible nor hit-testable when hidden (§5.11).
8. **Honest signals.** ContrastGuard and `validateTextContrast` report `"unverified"`; `data-meets-wcag` is not emitted.
9. **Honest claims.** README, `llms.txt`, `RELEASE_NOTES_4.1.0.md` (amended with a retraction banner), `RELEASE_NOTES_4.1.1.md` and `CHANGELOG.md` contain no "498 certified", "100% reduced motion", "SSR-safe" (unqualified), "optional backend" or "licensed Aeonik ships" claims. A docs-lint check fails if they return.
10. **Small tree.** `git ls-files reports` is empty; `/reports/` is gitignored; no tracked `*probe*.mjs` at the root; evidence is uploaded as CI artifacts keyed to the SHA. History is not rewritten (D-32).
11. **Security advisory published** (GitHub Security Advisory on `auraoneai/auraglass`) for the hosted backend before any 4.2 extraction (D-30), and `SECURITY.md` lists 4.1.x as supported.
12. **Font decision recorded.** Aeonik is absent from the tarball (`dist/styles/fonts/` contains no `Aeonik-*`), with a system fallback stack, unless a written redistribution licence is committed as `LICENSE-FONTS` before the tag (D-31).
13. **Change-control baseline exists.** A committed API report per public entry (`etc/api/`) and a seeded repo-root `deprecations.json` describe the 4.1.1 surface, so PRD-01 can diff 4.2 against it.

What 4.1.1 explicitly does **not** do: no dependency diet, no subpath/type corrections, no removal of any export, no new visual default, no React floor change, no history rewrite, no fix for the root `"use client"` boundary (PACKAGING-SSR-DX-03, owned by PRD-02 (PKG)), no deletion of `server/` or `src/services/**` (§16 PRD-16, interim FND, after the 4.2 C-D), and none of the five proposals deferred to 4.2 by SC-36 (deviation 8).

---

## 4. Architecture

4.1.1 is a **patch on the 4.x code base**, not a 5.0 artefact. It touches four layers; each change is the smallest one that removes the defect.

### 4.1 Change classes (D-01, D-27)

| Change | Class | Rationale |
|---|---|---|
| Pack-parse fix, CI/publish workflow, lint config, `.gitignore`, `reports/`/probe removal, API report, `deprecations.json`, React 19 unit matrix (REQ-TRUST-55) | C-I (tooling, not shipped) | No runtime surface |
| Hooks hoisting, `"use client"` on `primitives`/`theme`, hydration fixes, Slot ref read, reduced-motion final state, `isStorybookDataMedia` removal, `GlassCommandPalette` regex escape (REQ-TRUST-53) | C-I (bug/crash fix) | Behaviour converges on documented intent |
| `adaptiveAI` inert until `enableAdaptiveAI()`; `GlassCanvas` script no-op; ContrastGuard/`validateTextContrast` → `"unverified"`; `data-meets-wcag` removed; Aeonik out of tarball; cookie-consent banners not hit-testable while hidden (REQ-TRUST-54) | C-I **security/privacy/honesty/legal exception** (architecture §13.1) | These are the only observable behaviour removals allowed outside a major. Each gets a `deprecations.json` entry and a release-note line |
| New `enableAdaptiveAI` export | C-E then immediately C-D | Escape hatch for anyone relying on the old behaviour |

### 4.2 Shared pack helper

One module owns `npm pack --json` parsing so the five call sites cannot drift again:

```js
// scripts/ci/lib/npm-pack.js (NEW, CommonJS like the callers)
// Returns { name, version, filename, shasum, integrity, files } for the single packed package.
function parsePackJson(stdout) {
  const start = stdout.search(/[[{]/);             // tolerate lifecycle noise before JSON
  const parsed = JSON.parse(start >= 0 ? stdout.slice(start) : stdout);
  if (Array.isArray(parsed)) return parsed[0];      // npm <= 10
  if (parsed && Array.isArray(parsed.files)) return parsed; // defensive: bare object
  const values = Object.values(parsed || {});       // npm >= 11: { "<name>": {...} }
  if (values.length !== 1) throw new Error(`Expected 1 packed package, got ${values.length}`);
  return values[0];
}
function packToDir(rootDir, destDir, { ignoreScripts = true } = {}) { /* execFileSync('npm', ['pack', '--json', '--pack-destination', destDir, ...(ignoreScripts ? ['--ignore-scripts'] : [])]) → parsePackJson */ }
module.exports = { parsePackJson, packToDir };
```

`execFileSync` with an argument array replaces the string-interpolated commands (`run-next-integration.js:47` concatenates `tmpRoot`).

### 4.3 Release pipeline

```
push tag v4.1.1 ──► publish-npm.yml (filename kept, SC-05) (on: push: tags: ['v4.*.*'])
                     ├─ needs: verify (reusable glass-pipeline.yml via workflow_call, same SHA)
                     ├─ assert tag == package.json version == top CHANGELOG entry
                     ├─ gates: typecheck, lint:check, unit (jest --ci), build, verify:pack,
                     │         verify:css-vars, integration next/vite (--skip-build), side-effect import,
                     │         api-report check, docs-claims lint, tarball font check
                     ├─ upload evidence → actions/upload-artifact evidence-<job>-<sha> (release retention 90 days, SC-07)
                     └─ npm publish --provenance --access public --tag latest   (OIDC only; permissions id-token: write;
                        prepublishOnly guard checks GITHUB_WORKFLOW_REF, REQ-TRUST-08)
```

The npm package settings already bind `auraoneai/auraglass` + `publish-npm.yml` as the trusted publisher; keeping the filename means no npm access change is needed. The operator only confirms the binding (recorded in §11; agents do not change npm access settings). PRD-01 (REL) later adds dist-tag derivation, the ledger and change-class checks, and PRD-19 (QA) adds the reusable `certify-release.yml` called through `needs:` (SC-05).

### 4.4 Runtime patterns

- **Opt-in tracking.** `AdaptiveAIEngine.getInstance()` constructs an inert object; `initializeTracking()` moves out of the constructor into `enable()`. `enableAdaptiveAI(): () => void` calls `enable()` once (idempotent), returns a disposer that removes both listeners and clears the interval (handle now stored), and emits one dev-only `console.warn` per page load. `useAdaptiveAI()` no longer starts tracking implicitly.
- **Hook hoisting.** Every `cond ? useX(args) : undefined` for a hook that is safe to call unconditionally (`useA11yId`, `useId`, `useRef`, `useMemo`, `useCallback`, `useContext`, and local hooks that only allocate) becomes `const x = useX(args); const value = cond ? x : undefined`. The six provider hooks (`usePredictiveEngine`, `useEyeTracking`, `useBiometricAdaptation`, `useSpatialAudio`, `useAchievements`, `useInteractionRecorder`) throw without their provider, so call sites use NEW **internal, non-exported** readers next to each hook: `useOptionalPredictiveEngine()`, `useOptionalEyeTracking()`, `useOptionalBiometricAdaptation()`, `useOptionalSpatialAudio()`, `useOptionalAchievements()` (each `return useContext(XContext) ?? null`, never throws) and `useOptionalInteractionRecorder(elementId: string \| undefined, enabled: boolean)` (no-op handlers when `enabled` is `false` or the context is null). The call site is `const engine = useOptionalPredictiveEngine(); const predictiveEngine = predictive ? engine : null;`. Public hook signatures and their throw-outside-provider behaviour are unchanged.
- **Hydration-stable first render.** All three helpers render the server value on the first client pass, then update in `useEffect` (or `useSyncExternalStore` with `getServerSnapshot`). Server values are the current 4.1.0 server values, unchanged: `AuraGlassClientBoundary` → `false` (fallback); `useEnhancedReducedMotion` → `true` (conservative default, `src/hooks/useEnhancedReducedMotion.ts:35`); `useDeviceCapabilities` → `DEFAULT_DEVICE_INFO`.
- **Slot ref.** `const isReact19 = Number.parseInt(React.version, 10) >= 19; const childRef = isReact19 ? (child.props as { ref?: React.Ref<HTMLElement> }).ref : (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;` On React 19 `element.ref` is never read (reading it warns even when the child has no ref); on React 18 `props.ref` is always `undefined`, so `element.ref` is the only source (architecture §9.2; deviation 4).
- **Reduced-motion final state.** Replace `animate={reduced ? {} : X}` with `initial={reduced ? false : I}` and `animate={reduced ? FINAL : X}` where `FINAL` is the visible end state (at minimum `{ opacity: 1, scale: 1, x: 0, y: 0 }` for the keys present in `I`), and `transition={reduced ? { duration: 0 } : T}`. `initial={false}` makes Framer render the `animate` target on mount.
- **Honest contrast.** `validateTextContrast` keeps its signature for compatibility but its return type widens from `boolean` to `boolean | "unverified"` and it returns `"unverified"`; ContrastGuard sets `data-contrast-status="unverified"` and stops emitting `data-meets-wcag` and `data-contrast-ratio`.

### 4.5 Evidence location (D-32)

Scripts that today write into `reports/` resolve a single directory: `process.env.AURAGLASS_EVIDENCE_DIR ?? path.join(repoRoot, ".artifacts")`, via `scripts/ci/lib/evidence-dir.js` (NEW; SC-07/SC-11 path, next to `npm-pack.js`; `scripts/lib/` is not an allowed directory). `.artifacts/` and `/reports/` are gitignored. CI uploads `.artifacts/**` with `actions/upload-artifact` under the SC-07 naming and retention rules (owner PRD-19 (QA)). Inputs that are not evidence (the component inventory JSON and the certification spec) move to `docs/inventory/` and `docs/certification/`.

---

## 5. Exact implementation requirements

Each requirement is testable; the verifying test or check is named in brackets and specified in §12.

### 5.1 Packaging and the uncommitted files

- **REQ-TRUST-01** Commit the existing diffs of `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js` and `scripts/ci/verify-pack.js` unchanged as the first commit on the 4.1.1 branch (message `fix(ci): parse npm>=11 pack --json output`), so the fix is attributable. Do **not** commit `reports/3.2-release/vite-integration.json`; restore it with `git restore reports/3.2-release/vite-integration.json`. [`git show --stat`]
- **REQ-TRUST-02** Create `scripts/ci/lib/npm-pack.js` exporting `parsePackJson(stdout)` and `packToDir(rootDir, destDir, opts)` per §4.2. Replace the inline parse in all five callers: `run-next-integration.js:47-50`, `run-vite-integration.js:42-48`, `verify-pack.js:134-147`, `verify-recipes-render.js:96-102`, and the unfixed `verify-app-chrome-visuals.js:772-776`. After the change, `rg -n "JSON.parse\(packOutput\)" scripts` returns 0 lines. [`tests/ci/npm-pack.test.ts`]
- **REQ-TRUST-03** `parsePackJson` must accept: an npm 10 array fixture, an npm 11 object fixture, either preceded by lifecycle log lines, and must throw on 0 or ≥2 packages. Fixtures are captured from real `npm pack --json` output on npm 10.9 and npm 11.x and committed under `tests/ci/fixtures/npm-pack/`. [`tests/ci/npm-pack.test.ts`]
- **REQ-TRUST-04** `npm run prepublishOnly`-equivalent (`npm run build && npm run verify:pack && npm run verify:css-vars && npm run test:integration:next -- --skip-build && npm run test:integration:vite -- --skip-build`) exits 0 in CI on **both** Node 20 (npm 10) and Node 24 (npm 11). Run remotely in GitHub Actions, never on the Mac. [CI job `pack-matrix`]
- **REQ-TRUST-05** `run-next-integration.js` and `run-vite-integration.js` write their logs and JSON (`next-integration.log`, `next-integration-react19.log`, `vite-integration.json`) to `evidenceDir()` (REQ-TRUST-32), not `reports/`. [`tests/ci/evidence-dir.test.ts`]

### 5.2 CI-only publish and Pipeline Validation

- **REQ-TRUST-06** Keep `.github/workflows/publish-npm.yml` under that filename (SC-05: the npm trusted-publisher binding is tied to it; renaming would require an npm access change outside the agent perimeter). Its `name:` stays `Publish npm package`. It triggers only on `push: tags: ['v4.*.*']`; `workflow_dispatch` is removed (the dry-run path is the `pack-matrix` job of REQ-TRUST-04 plus `npm publish --dry-run` in that job). It asserts tag `vX.Y.Z` == `package.json` `version` == the first `## [X.Y.Z]` heading of `CHANGELOG.md`, else fails. PRD-01 (REL) later adds dist-tag derivation, ledger and change-class checks to the same file. [`tests/ci/publish-workflow.test.ts`]
- **REQ-TRUST-07** Delete the `HAS_NPM_TOKEN` env (`publish-npm.yml:20`) and the "Publish with npm token provenance" step (`:80-84`). The single publish step is `npm publish --provenance --access public` with `permissions: { contents: read, id-token: write }`. No workflow under `.github/workflows/` references `secrets.NPM_TOKEN` or `NODE_AUTH_TOKEN`. [`tests/ci/publish-workflow.test.ts`]
- **REQ-TRUST-08** Remove the `release` and `release:dry-run` scripts (`package.json:324-325`) and delete `scripts/publish-307-after-npm-login.sh` and `scripts/configure-npm-trusted-publishing-307.sh`. `prepublishOnly` additionally fails unless `process.env.GITHUB_ACTIONS === "true"` **and** `process.env.GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v` (a new guard `scripts/ci/require-ci-publish.js`, NEW; the SC-05 condition, so PRD-01 (REL) does not need to tighten it later), so a laptop `npm publish` aborts. [`tests/ci/require-ci-publish.test.ts`]
- **REQ-TRUST-09** "AuraGlass Pipeline Validation" (`glass-pipeline.yml`) is green on the 4.1.1 release SHA. The 165 `lint:check` errors are resolved by **one** of: (a) fixing them; or (b) keeping `auraglass/no-inline-glass` at `error` for all of `src/**` except the files listed in a committed allowlist `eslint/no-inline-glass-baseline.json` (NEW; generated from the measured violations on the step-8 SHA, one path per entry), for which an `eslint.config.js` override sets it to `warn`. The allowlist may only shrink (a CI check fails if an entry is added or if a listed file no longer violates and is not removed). The choice and the measured count are recorded in `docs/release/decisions/4.1.1-lint-scope.md` (NEW; SC-35 path). `--no-verify`, `continue-on-error`, `|| true` or removing `lint:check` from the workflow are forbidden. [`tests/ci/no-gate-bypass.test.ts`]
- **REQ-TRUST-10** `publish-npm.yml` runs the Pipeline Validation job via `workflow_call` (`glass-pipeline.yml` gains `on: workflow_call`) as `needs:` of the publish job on the same SHA, plus `npx jest --ci` (full unit suite) and the new gates of REQ-TRUST-15, -27, -37, -41, -48, -49/-50 and -55. Existing `glass-pipeline.yml` job names (`Glass Quality Gates`, `Next.js npm Integration`, `Vite npm Integration`) are not renamed; new jobs (`pack-matrix`, `react19-smoke`) are added alongside (SC-10). [`tests/ci/publish-workflow.test.ts`]
- **REQ-TRUST-11** Fix the 2 stale-snapshot suites `src/components/button/GlassButton.test.tsx` and `src/components/card/GlassCard.test.tsx`. Update the snapshot **only after** reviewing the diff; the review comment in the PR states that the GlassCard fill change (`rgba(255,255,255,0.12)` → `0.018`, c07fd7111) is accepted 4.1.0 behaviour (not reverted in a patch; D-27 forbids visible pixel change on a patch except labelled visual fixes). `npx jest --ci` reports 0 failed suites. [CI `jest --ci`]
- **REQ-TRUST-12** `"lint"` in `package.json:247` becomes non-mutating (`eslint src`), with `"lint:fix": "eslint src --fix"` (HISTORY-HYGIENE-15). [`tests/ci/no-gate-bypass.test.ts`]

### 5.3 Security and privacy cuts (§13.1)

- **REQ-TRUST-13** `src/utils/adaptiveAI.ts`: the constructor no longer calls `initializeTracking()`; the `setInterval` handle is stored and cleared by `disable()`; the `click`/`scroll` listeners are removed by `disable()`; the interaction arrays are capped at 20 entries (matching the only reader at `:220-221`).
- **REQ-TRUST-14** Add and root-export `enableAdaptiveAI(): () => void` (from `src/utils/adaptiveAI.ts`, re-exported at `src/index.ts:915`). It is idempotent, returns a disposer, and logs once per page load in non-production: `[aura-glass] enableAdaptiveAI() is deprecated and will be removed in 5.0. It records click and scroll activity on this page.` `useAdaptiveAI()` returns the same shape as 4.1.0 but does not enable tracking. [`src/utils/__tests__/adaptiveAI.optin.test.ts`]
- **REQ-TRUST-15** Side-effect import gate: `scripts/ci/verify-import-side-effects.js` (NEW) imports `dist/index.mjs` in a fresh jsdom and fails if `document.addEventListener`, `window.addEventListener`, `setInterval`, `setTimeout` (any delay > 0) or `document.documentElement.setAttribute`/`style.setProperty` were called during import. 4.1.1 allow-list: none for `adaptiveAI`; other pre-existing import effects found by the gate (e.g. injected keyframes, HOOKS-UTILS-TYPES-15) are listed by symbol in `scripts/ci/import-side-effects-baseline.json` (NEW) and may only shrink. [`tests/ci/import-side-effects.test.ts`]
- **REQ-TRUST-16** `src/components/cms/GlassCanvas.tsx:302-320`: remove the `new Function` call and its `eslint-disable no-new-func`. When `component.props.onClick` is a non-empty string, the button renders without an `onClick` handler and, in non-production, warns once per component id: `[aura-glass] GlassCanvas no longer executes string onClick scripts (security). Pass a function via onComponentAction instead.` Add `onComponentAction?: (componentId: string, action: "click") => void` to `GlassCanvas` props (C-E) and call it on click. Add `no-new-func: "error"` and `no-eval: "error"` to `eslint.config.js` for `src/**`, with an inline disable permitted only in `src/utils/browserCompatibility.ts:197,421,424` (constant strings). [`src/components/cms/GlassCanvas.security.test.tsx`]
- **REQ-TRUST-17** `src/components/media/GlassAdvancedVideoPlayer.tsx:82-83,985-986`: delete `isStorybookDataMedia`; `usePosterSurface = !mediaFile.src`. Stories that relied on it set `mediaFile.src` to `undefined` with a `poster` instead. [`src/components/media/GlassAdvancedVideoPlayer.datasrc.test.tsx`]
- **REQ-TRUST-18** ContrastGuard (`src/components/accessibility/ContrastGuard.tsx:245-247`) emits `data-contrast-status="unverified"` and no longer emits `data-meets-wcag` or `data-contrast-ratio`. Any `onContrastChange`/callback payload field `meetsRequirement` is set to `undefined` and a new field `status: "unverified"` is added. JSDoc on the component and the ContrastGuard story state: "Does not measure rendered contrast. Do not use as a WCAG signal." [`src/components/accessibility/ContrastGuard.honesty.test.tsx`]
- **REQ-TRUST-19** `src/tokens/glass.ts:931-935` `validateTextContrast` returns `"unverified"`; its declared return type is `boolean | "unverified"`. All internal callers (`rg -n "validateTextContrast" src`; 0 call sites besides the definition at `15b6de6f7`) are updated to treat `"unverified"` as not-passed. JSDoc warns that `"unverified"` is truthy, so `if (validateTextContrast(a, b))` no longer means "passes"; callers must compare `=== true`. [`src/tokens/__tests__/validateTextContrast.test.ts`]
- **REQ-TRUST-20** Update `SECURITY.md` "Supported Versions" to `4.1.x` Active, `4.0.x` Security fixes until 2026-12-31, `< 4.0` Not supported, and add a "Hosted runtime" section stating that `server/`, `src/services/**`, `Dockerfile` and `docker-compose.yml` are unsupported example code scheduled for extraction in 4.2/5.0 and must not be deployed. [`tests/docs/claims-lint.test.ts`]

### 5.4 Crash, RSC and hydration

- **REQ-TRUST-21** Register `eslint-plugin-react-hooks` (already a devDependency, `package.json:461`) in `eslint.config.js` with `react-hooks/rules-of-hooks: "error"` for `src/**/*.{ts,tsx}` excluding tests and stories. `npm run lint:check` reports 0 `rules-of-hooks` errors. [`npm run lint:check`]
- **REQ-TRUST-22** Hoist all 109 conditional hook calls in the 24 files of §2.3 per §4.4, and fix every other `react-hooks/rules-of-hooks` violation REQ-TRUST-21 reports (hooks after early returns, in loops or callbacks), whose count is measured in CI before this step and recorded in the PR. Provider hooks are replaced at call sites by the internal `useOptional*` readers of §4.4; the public `usePredictiveEngine`, `useEyeTracking`, `useBiometricAdaptation`, `useSpatialAudio`, `useAchievements` and `useInteractionRecorder` keep their signatures and still throw outside their providers. Rendering `<GlassButton predictive eyeTracking adaptive spatialAudio trackAchievements>` and `<GlassContainer predictive …>` with **no** provider mounted does not throw and registers 0 listeners, timers, workers or `AudioContext`s. `useA11yId` calls become unconditional, and the computed id is discarded when unused. [`src/components/input/GlassInput.hooks.test.tsx`, `src/__tests__/hooks-order.test.tsx`]
- **REQ-TRUST-23** Add `"use client";` as the first statement of `src/primitives/index.ts` and `src/theme/index.ts`. The built `dist/primitives/index.mjs`, `dist/primitives/index.js`, `dist/theme/index.mjs` and `dist/theme/index.js` start with `"use client";` (byte-for-byte first statement). Extend `scripts/ci/verify-pack.js` to assert it for every `exports` entry whose source module calls `createContext` or a React hook, using the list in `scripts/ci/client-entries.json` (NEW). [`tests/ci/use-client-entries.test.ts`]
- **REQ-TRUST-24** Extend `scripts/ci/run-next-integration.js` (React 19 app) with one Server Component page `app/rsc/page.tsx` (no `'use client'`) that imports from `aura-glass/primitives` and `aura-glass/theme` and renders a client child, and run `next build` for that app (not only `next dev`). The build exits 0. [CI `test:integration:next`]
- **REQ-TRUST-25** `AuraGlassClientBoundary` (`src/components/ssr/AuraGlassClientBoundary.tsx:14`) initialises `useState(false)` and sets `true` in `useEffect`. `useEnhancedReducedMotion` initialises to `true` on both server and client (the existing server value, deviation 6) and reads `matchMedia` in `useEffect` (fix the "SSR-safe" JSDoc at `:9`). `useDeviceCapabilities` initialises to `{ ...DEFAULT_DEVICE_INFO }` on both server and client and calls `detectDevice()` in `useEffect`. [`src/__tests__/ssr/hydration.test.tsx`]
- **REQ-TRUST-26** `src/primitives/Slot.tsx:76` selects the ref source by React major (§4.4): `child.props.ref` on React ≥19, `element.ref` on React 18. On React 19, rendering `<Slot ref={r}><button ref={c} /></Slot>` **and** `<Slot ref={r}><button /></Slot>` emits no `console.error` containing `element.ref`, and every passed ref receives the `HTMLButtonElement`. On React 18 both refs still receive it. [`src/primitives/__tests__/Slot.ref.test.tsx`]
- **REQ-TRUST-27** Add a CI job `react19-smoke` that installs `react@19 react-dom@19` over the dev install in the runner and runs the tests named in REQ-TRUST-25/-26 plus `src/primitives/native-primitives.test.tsx`. [CI job]

### 5.5 Reduced motion

- **REQ-TRUST-28** Rewrite all 84 `animate={reduced ? {} : …}` sites in the 35 files of §2.4 per §4.4 so that under reduced motion `initial` is `false` and `animate` is the visible end state. Where the motion variable has another name (`prefersReducedMotion`, `shouldReduceMotion`, `isReducedMotion`), the same rule applies. After the change, `rg --pcre2 "animate=\{[^}]*[Rr]educed[^?]*\?\s*\{\}" src` returns 0 matches, and so does `rg --pcre2 "\?\s*\{\}\s*:\s*\{\s*(opacity|scale)"`. [`src/__tests__/motion/reduced-motion-visible.test.tsx`]
- **REQ-TRUST-29** Add the ESLint rule `auraglass/motion-no-empty-animate` (name owned by PRD-06 (MOT) REQ-MOT-64, SC-16; one name on both branches) to the existing `eslint-plugin-auraglass.js` (MODIFY; the plugin file and namespace are owned by PRD-02 (PKG)) at `error` that flags a JSX `animate` attribute whose expression is a conditional with an empty object literal in either branch. This is the 4.1.1 subset of REQ-MOT-64; PRD-06 (MOT) extends it (`undefined`/`false` branches, conditional `initial`). [`tests/eslint/motion-no-empty-animate.test.ts`]
- **REQ-TRUST-30** The jest assertion helper `expectSettledVisible(element)` (NEW, `src/test-utils/motion.ts`) checks computed/inline `opacity` is `1` (or unset) and `transform` is `none` or identity, after `matchMedia('(prefers-reduced-motion: reduce)')` is mocked to `true` and `act()` flushes. It is applied to one representative component per file of the 35.

### 5.6 Repository hygiene (D-32)

- **REQ-TRUST-31** Run `git rm -r --cached reports` after REQ-TRUST-34, commit it as `chore(repo): stop tracking reports/ (evidence moves to CI artifacts)` (no `!`: nothing in the published API breaks), and leave the developer's local copy on disk, now ignored. Fresh clones of the new commit no longer contain `reports/`. Add `/reports/` and `/.artifacts/` to `.gitignore`, replacing the five specific `/reports/...` lines at `.gitignore:157-161`. The untracked `reports/audit/visual-all/visual-summary.{json,md}` from the session baseline are not added. History is not rewritten (D-32), so the 1.86 GiB pack remains until a future owner decision.
- **REQ-TRUST-32** Create `scripts/ci/lib/evidence-dir.js` (SC-07) exporting `evidenceDir(subdir?)` per §4.5 (creates the directory). Every script that writes into `reports/` (from the 28 files of `rg -l "['\"]reports['\"]|['\"/]reports/" scripts`; readers-only such as `scripts/ci/verify-no-core-ui-deps.js` and `scripts/ci/forbidden-check.js` keep their `existsSync`-guarded path filters) resolves its output through it. Version-stamped one-off scripts (`scripts/ci/stale-3-3-scan.js`, `scripts/audit/3.0.7-source-audit.js`, `scripts/audit/3.1-frame-loop-audit.js`) are deleted instead if `rg` finds no reference to them in `package.json` or `.github/workflows/`; otherwise they are ported. [`tests/ci/evidence-dir.test.ts`]
- **REQ-TRUST-33** Every workflow job that produces evidence uploads `.artifacts/**` with `actions/upload-artifact` named `evidence-<job>-${{ github.sha }}` and an explicit `retention-days` per SC-07 (owner PRD-19 (QA)): `14` on `pull_request`, `30` on `main` pushes, `90` on tag/release runs. The `.github/workflows/visual-regression.yml` edit is 4.x-line only (QA-119 deletes that file on `main` for 5.0; SC-09). The publish job links the artifact URL in the GitHub Release body.
- **REQ-TRUST-34** Relocate non-evidence inputs before the removal: `reports/component_inventory.json` → `docs/inventory/component_inventory.json` (update the import at `src/stories/CuratedComponentGuide.stories.tsx:3`, `tests/visual/design-system/storybook-visual-certification.spec.ts:14`, and `src/reports/glassmorphismAuditCoverage.ts:5,47`, which is not root-exported). The root-exported constants in `src/reports/componentInventory.ts` keep their string values (REQ-TRUST-35). Retarget `scripts/ensure-component-inventory.js` (`prebuild-storybook`) to `docs/inventory/component_inventory.json` and make it **exit 1** when the file is missing instead of writing the empty `{ components: [] }` fallback, so a Storybook build can never render an empty guide as success. `reports/audit/certification-audit-spec.md` → `docs/certification/certification-audit-spec.md` (update `README.md:527`; SC-35 inventory/docs locations). The two Playwright specs that read committed certification evidence (`storybook-visual-certification.spec.ts:8-13`, `glass-audit-coverage.spec.ts`) read it via `evidenceDir()` and fail with "evidence not generated in this run" when absent; they are not 4.1.1 gates (certification is retracted; PRD-19 rebuilds it). Storybook builds (`npm run build-storybook`, remote CI) and `tsc --noEmit` pass after the move.
- **REQ-TRUST-35** The root-exported path constants at `src/index.ts:767-785` and `src/reports/legacyDocuments.ts:1-3` keep their names and string values (C-I; removing them would be C-B) and are added to the repo-root `deprecations.json` (SC-02) as `since: "4.1.1"`, `removeIn: "5.0.0"`, reason "points to evidence no longer in the repository". The 11 symbols are `component_inventory_json`, `COMPONENT_INVENTORY_JSON_PATH`, `component_inventory_json_path`, `GILDED_TOKENS_CATALOGUE_MD`, `GILDED_TOKENS_CATALOGUE_MD_PATH`, `REDUCED_MOTION_100_COMPLETE_MD`, `REDUCED_MOTION_100_COMPLETE_MD_PATH`, `REDUCED_MOTION_101_GUIDE_MD`, `REDUCED_MOTION_101_GUIDE_MD_PATH`, `TYPESCRIPT_FIX_PROGRESS_MD_PATH`, `REDUCED_MOTION_FINAL_REPORT_JSON_PATH`.
- **REQ-TRUST-36** `git rm` the 45 root scripts listed in §2.5 (37 `probe-*.mjs`, `webkit-probe.mjs`, `audit-probe.mjs`, `audit-dom-probe.mjs`, `audit-story-probe.mjs`, `audit-story-probe2.mjs`, `inspect-toggle.mjs`, `list-stories.mjs`, `.audit-inspect.mjs`). Before deletion, `rg -n "probe-|inspect-toggle|list-stories|audit-.*probe" package.json .github scripts` must return 0 references (if `list-stories.mjs` is referenced, move it to `scripts/storybook/list-stories.mjs` instead). Add `/probe-*.mjs`, `/*-probe*.mjs` to `.gitignore`.
- **REQ-TRUST-37** CI check `scripts/ci/verify-tree-hygiene.js` (NEW) fails when `git ls-files reports` is non-empty, when any tracked root file matches `/(^|\/)[^/]*probe[^/]*\.mjs$/` at depth 0, or when a tracked file exceeds 5 MB outside `src/styles/fonts/` and `visual-baselines/`. [`tests/ci/tree-hygiene.test.ts`]

### 5.7 Claim retractions

- **REQ-TRUST-38** `README.md` edits (line numbers at `15b6de6f7`):
  - `:3` replace "accessibility guardrails, and SSR-safe package wiring" with "accessibility fallbacks for forced colors and reduced transparency, and a server-safe `aura-glass/tokens` entry".
  - `:16`, `:74`, `:219`, `:221`: remove "SSR helpers" and "contrast handling/guardrails"; state "reduced-motion handling is partial in 4.x; see Known limitations".
  - `:21`: replace the 498-target sentence with: "The 4.0/4.1 '498 visual targets certified' claim is retracted: the evidence verifier does not pass at 4.1.x (`0/498`). Visual certification is being rebuilt for 5.0."
  - `:27`: replace with the font outcome of REQ-TRUST-46/-47.
  - `:153`: "Smoke-tested with React 18.2 + Next 14.2 and React 19.0 + Next 15.5 under `next dev`; Server Component use is limited to `aura-glass/tokens`, `aura-glass/primitives` and `aura-glass/theme` (client references)."
  - `:156`, `:187`, `:493-497`, `:509`: state that `express`, `express-rate-limit`, `helmet`, `cors`, `compression`, `dotenv`, `socket.io`, `redis`, `ioredis`, `jsonwebtoken`, `bcryptjs`, `openai`, `@pinecone-database/pinecone`, `@google-cloud/vision` and `@sentry/node` are currently **hard dependencies installed for every consumer** and will move out in 4.2; delete "optional backend"; link the advisory (REQ-TRUST-43).
  - `:223`, `:446-459`, `:525-576`, `:610`: remove "Checked-in release evidence" and every link into `reports/`; point to `docs/certification/certification-audit-spec.md` and "CI artifacts on each release".
  - Add a `## Known limitations (4.1.x)` section listing: root import is one client boundary; ContrastGuard is unverified; reduced-motion coverage is partial; certification is not current; backend deps are installed.
- **REQ-TRUST-39** `llms.txt:5`: replace "accessible glassmorphism components, SSR-safe React components" with "glassmorphism React components (client components; tokens are server-safe)". Add one line pointing agents to the Known limitations section.
- **REQ-TRUST-40** Prepend to `RELEASE_NOTES_4.1.0.md` a block `> **Retraction (4.1.1, 2026-10):** The "498 passed" visual-gate result could not be reproduced: the repository's evidence verifier reports 0/498 at this release, and 4.1.0 was published outside CI. Treat this release's certification claims as unverified.` Do not edit the historical body text. Add the same retraction under the 4.1.0 entry of `CHANGELOG.md` and on the GitHub Release for `v4.1.0`.
- **REQ-TRUST-41** `scripts/ci/verify-docs-claims.js` (NEW) fails if any of `README.md`, `llms.txt`, `RELEASE_NOTES_4.1.1.md`, `docs/**/*.md` (excluding `docs/auraglass-5/**` and quoted retraction blocks) matches: `/498 (visual )?(targets|passed|certified)/i`, `/100\s?%\s*(reduced[- ]motion|coverage)/i`, `/SSR-safe(?! portal)/`, `/optional backend/i`, `/licensed Aeonik/i`, `/certified green/i`, or links to `./reports/`. Wired into Pipeline Validation. [`tests/docs/claims-lint.test.ts`]
- **REQ-TRUST-42** `RELEASE_NOTES_4.1.1.md` (NEW) and the `CHANGELOG.md` `## [4.1.1]` entry list every behaviour change of §4.1 row 3 under a `### Security and privacy` heading, each with the `deprecations.json` id, plus the advisory link and the font decision.

### 5.8 Security advisory

- **REQ-TRUST-43** Draft a GitHub Security Advisory on `auraoneai/auraglass` (repository owner publishes it; agents do not publish advisories or change repository security settings) titled "Hosted example runtime: default JWT secret, missing authorization and open WebSocket rooms". Content: affected versions (every published version whose tarball or repository contains `Dockerfile`/`server/`; the agent determines the first such version with `git log --diff-filter=A -- Dockerfile server/index.ts` and `npm view aura-glass time`), scope (deployments built from the repository `Dockerfile` or `server/`; **not** browser use of the npm package), the three issues with file references from §2.2, and mitigations: set a unique `JWT_SECRET` ≥32 bytes, do not expose `server/` publicly, rotate any secret that equalled the default (deployer's action). Severity: the drafter proposes CVSS 3.1 with vector; the owner confirms. The advisory must be **published before** the 4.1.1 tag and before any PRD-16 extraction (D-30). The draft text lives at `docs/security/advisories/2026-10-hosted-runtime.md` (NEW) until published.
- **REQ-TRUST-44** Add a guard in `server/index.ts` startup: if `process.env.JWT_SECRET` equals the `.env.example` default or is shorter than 32 characters, log an error and `process.exit(1)`. Change `.env.example:22` to `JWT_SECRET=` (empty). Remove `COPY .env.example .env` from `Dockerfile:50`. These are C-I security fixes to unpublished example code. [`tests/deployment/jwt-secret-guard.test.ts`]
- **REQ-TRUST-45** Before the advisory, grep AuraOne consumers for exposure: `rg -n "aura-glass/(services|server)|from ['\"]aura-glass['\"].*(openai|vision|collaboration)" /Users/gurbakshchahal/AuraOne --glob '!**/node_modules/**'` (bounded to that repo). Record the result (hit count and file list, no secret values) in the advisory draft.

### 5.9 Font licence decision (D-31)

- **REQ-TRUST-46** Default outcome (licence unconfirmed by the tag date): delete `src/styles/fonts/Aeonik-*.woff2` (12 files) and `src/styles/aeonik.css`; remove `@import "./aeonik.css"` from `src/styles/index.css:4`; change `src/styles/variables.css:31` to `--glass-font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (keep the variable name; drop `"Aeonik"`). Update `src/tokens/generated.ts`, `src/tokens/designConstants.ts`, `src/theme/tokens.ts` and the 4 media/chart components that name `Aeonik` (`GlassAdvancedAudioPlayer.tsx`, `GlassAdvancedVideoPlayer.tsx`, `ModularGlassDataChart.tsx`, `GlassDataChart.tsx`) to the same stack. Consumers who own a licence keep `"Aeonik"` by overriding `--glass-font-sans`. This is a labelled visual change permitted by §13.1 (legal exception) and is documented in the release notes with before/after composites captured in the remote visual lane.
- **REQ-TRUST-47** Alternative outcome (a written licence permits redistribution in an MIT package): commit it as `LICENSE-FONTS` at the root and `dist/styles/fonts/LICENSE` via the build, add it to `package.json` `files`, and add a README notice. The owner records the decision with date and licensor in `docs/release/decisions/4.1.1-font-licence.md` (NEW). Under REQ-TRUST-46 the same file records "licence unconfirmed → removed" with the date. Exactly one of REQ-TRUST-46/-47 ships.
- **REQ-TRUST-48** Tarball font check in `scripts/ci/verify-pack.js`: under REQ-TRUST-46 the packed `files` list contains no path matching `/Aeonik/i`; under -47 it contains `dist/styles/fonts/LICENSE`. [`tests/ci/tarball-fonts.test.ts`]

### 5.10 Change-control baseline (D-27; schema owned by PRD-01)

- **REQ-TRUST-49** Add devDependency `@microsoft/api-extractor` pinned to an exact version (recorded in the PR), a shared `api-extractor.base.json` (NEW) and `scripts/release/api-report.mjs` (NEW; SC-04 contract owned by PRD-01 (REL), which extends it in REL-003; 4.1.1 instance built here). For every `package.json` `exports` key with a `types` condition (40 of the 47 keys at `15b6de6f7`; excluded because they have no `types`: `./tokens/json`, `./tokens/tailwind`, `./tokens/manifest`, `./tokens/css`, `./tokens/keyframes`, `./styles`, `./package.json`) it writes `etc/api/<entry-slug>.api.md` (NEW; SC-04 slug rule: `.` → `index`, `./a/b` → `a-b`, e.g. `./primitives/slot` → `primitives-slot`). `npm run api:check` (`api-report.mjs --check`) exits 1 when any report differs from the committed one. [CI `npm run api:check`]
- **REQ-TRUST-50** Fallback when API Extractor cannot analyse an entry (for example `@/` aliases in emitted `.d.ts`, HOOKS-UTILS-TYPES-06 / PACKAGING-SSR-DX-10): the entry is recorded as `"apiReport": "unanalysable"` with the error text in `etc/api/manifest.json` (NEW). `scripts/release/export-snapshot.mjs` (NEW; SC-04 contract, `--tarball` mode) installs the **packed tarball** into a temp project and writes `etc/api/<entry-slug>.exports.json` for **all 47** keys: sorted runtime export names from `await import(spec)` (jsdom globals installed), `require(spec)` names where a `require` condition exists, declared type export names from the `types` file (TypeScript compiler API), and `typesRuntimeMismatch: boolean`; the 7 untyped keys get `kind: "asset"` and the resolved file path only. The root must have both `.api.md` (or a recorded `unanalysable` reason) and `.exports.json`. [`tests/release/export-snapshot.test.ts`]
- **REQ-TRUST-51** Repo-root `deprecations.json` (NEW; SC-02 location, owner PRD-01 (REL); added to `package.json` `files` so `doctor` can read it in 4.2; the `./deprecations.json` exports key is added by REL/PKG in 4.2, not here, because REQ-TRUST-52 forbids `exports` changes) with the envelope `{ "$schema": "./docs/schemas/deprecations.schema.json", "version": 1, "entries": [...] }` from its first commit (no `schemaVersion: 0` seed, no v0 migration). Entries use the SC-03 schema (REL §4.3): required `id` (`DEP-\d{4}`), `kind`, `status` (`active|planned`; every 4.1.1 seed entry is `active`), `entry`, `symbol`, `since`, `removeIn` (`5.0.0|6.0.0`), `replacement`, `codemod` (an SC-33/SC-34 id or `null`), `automation` (`full|mostly|partial|manual|none`), `breaking` (array of `B\d+` ids from architecture §11.1, `[]` when none is assigned yet), `message` (≤200 chars), `doc` (`#dep-NNNN` anchor); optional `compat`, `exception`, `evidence`. `kind` uses only the 13-value enum `export | subpath | prop | prop-value | css-var | css-global | peer | dependency | engine | behavior | cli | data-attr | asset`; `exception` uses only `security | privacy | crash | legal | honesty`. The schema file `docs/schemas/deprecations.schema.json` and gate `scripts/release/verify-deprecations.mjs` are PRD-01 (REL)'s (REL-010); until they land, `deprecations-seed.test.ts` asserts these keys and enums directly, and switches to the schema once REL-010 merges. Seed entries (all `since: "4.1.1"`, `removeIn: "5.0.0"`, `status: "active"`): `adaptiveAI`, `useAdaptiveAI`, `enableAdaptiveAI` (`kind: export`, `exception: "privacy"` on `adaptiveAI`); ContrastGuard `data-meets-wcag` and `data-contrast-ratio` (`kind: data-attr`) and `validateTextContrast` return value (`kind: behavior`), all three with `exception: "honesty"` (SC-03: retracted or simulated claims); `GlassCanvas` string `component.props.onClick` (`kind: behavior`, `exception: "security"`); cookie-consent hidden-but-clickable banners (`kind: behavior`, `exception: "privacy"`, REQ-TRUST-54); the 11 report-path constants of REQ-TRUST-35 (`kind: export`, `exception: null`); and the Aeonik font files if REQ-TRUST-46 ships (`kind: asset`, `exception: "legal"`). **No `since: "4.2.0"` entry is seeded**: PRD-01 REQ-REL-06 fails any active entry whose `since` is later than the current version; REL (interim owner of §16 PRD-17, SC-37) adds the `./services/*` and `./hooks/useGlassProbes` entries in 4.2. Readers resolve the path through `scripts/docs/paths.mjs` `DEPRECATIONS_PATH` once that constant exists (SC-02/SC-35); 4.1.1 tests use the literal root path. [`tests/release/deprecations-seed.test.ts`]
- **REQ-TRUST-52** `package.json` `version` becomes `4.1.1`; no `dependencies`, `peerDependencies` or `exports` key is added, removed or retargeted (verified by diffing `package.json` against `15b6de6f7` for those three fields; only `devDependencies`, `scripts`, `files` and `version` may change). [`tests/ci/package-json-patch-scope.test.ts`]


### 5.11 Accepted scope intake from other PRDs (SC-36)

These three items were proposed by other PRDs and are accepted into 4.1.1 because they are §13.1-class (crash, privacy) or CI-only. The proposing PRD keeps the 5.0 design; this PRD owns only the 4.x patch.

- **REQ-TRUST-53** (NAV E-22, crash; proposed by PRD-10 (NAV) §4.1.1 note) `src/components/interactive/GlassCommandPalette.tsx:298-303`: the fuzzy filter no longer builds `new RegExp(query.split("").join(".*"))` from unescaped input. Each character is escaped with `c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` before joining, so ranking and match results for queries without metacharacters are unchanged. Typing any of `( [ * + ? \ ^ $ | { }` neither throws nor empties the list for a value that contains that character. No API change. The 5.0 `commandScore` replacement stays with PRD-10 (NAV) REQ-NAV-59. [`src/components/interactive/__tests__/GlassCommandPalette.regex.test.tsx`]
- **REQ-TRUST-54** (MOT M-03, privacy; contract PRD-06 (MOT) REQ-MOT-28 and test REQ-MOT-T07) `src/components/cookie-consent/{CookieConsent,GlobalCookieConsent,CompactCookieNotice}.tsx` stop using `useGalileoStateSpring` (a frozen `useState`) and drive opacity and transform from `visible` directly, using a CSS transition on a `data-state="open|closed"` attribute. After the show timeout the banner has computed `opacity: 1` without `forceVisible`. After dismiss, or while hidden, it has `visibility: hidden` and `pointer-events: none`, so an invisible banner can never receive a consent click. Under reduced motion the transition duration is 0. `useGalileoStateSpring` itself is unchanged (PRD-06 removes it in 5.0). Gets a `deprecations.json` behaviour entry with `exception: "privacy"` (REQ-TRUST-51) and a release-note line. [`src/components/cookie-consent/__tests__/visibility.test.tsx`, the REQ-MOT-T07 file, created here and inherited by MOT]
- **REQ-TRUST-55** (FND AC-FND-02, CI-only, C-I) Add a CI matrix leg `unit-react19` to `glass-pipeline.yml` that runs the **full** unit suite (`npx jest --ci`) with `react@19 react-dom@19 @types/react@19 @types/react-dom@19` installed over the dev install (`npm i --no-save`). It records 0 `console.error` calls matching `/element\.ref/` across the suite, using a jest setup spy that fails the run when such a call happens (enabled only in this leg). Snapshot or test failures that are React-19-only and unrelated to `element.ref` are listed in `docs/release/decisions/4.1.1-react19-matrix.md` (NEW) and are non-gating for 4.1.1. The `element.ref` assertion is gating. The 4.x dev install stays on React 18.2 (no React floor change). REQ-TRUST-27's `react19-smoke` stays as the fast targeted subset. [CI job `unit-react19`]

**Deferred to 4.2 (SC-36, not in this PRD):** MOT FPS-loop removal (REQ-MOT-86); NAV E-15 GlassWorkspaceTabs DOM prop leak; DS `--glass-opacity-24/32/52/72` fix and the `getPersona` type (C-D in 4.2, removed in 5.0); CTL GlassSwitch shimmer removal. The visual items carry D-28 labels on the REL 4.2 train.

---

## 6. Files/directories affected (existing paths)

All verified with `rg --files` / `git ls-files` at `15b6de6f7`.

| Path | Change | REQ |
|---|---|---|
| `scripts/ci/run-next-integration.js` | commit diff; use helper; evidence dir; RSC page + `next build` | 01, 02, 05, 24 |
| `scripts/ci/run-vite-integration.js` | commit diff; use helper; evidence dir | 01, 02, 05 |
| `scripts/ci/verify-pack.js` | commit diff; use helper; `"use client"` and font assertions | 01, 02, 23, 48 |
| `scripts/ci/verify-recipes-render.js` | use helper | 02 |
| `scripts/ci/verify-app-chrome-visuals.js` | fix `:776` via helper | 02 |
| `reports/3.2-release/vite-integration.json` | `git restore`, then untracked with all of `reports/` | 01, 31 |
| `reports/` (47,342 tracked files) | `git rm -r --cached` | 31 |
| `.gitignore` | `/reports/`, `/.artifacts/`, probe patterns | 31, 36 |
| `.github/workflows/publish-npm.yml` (filename kept, SC-05) | tag trigger, OIDC-only, `needs` verify, gates, artifacts | 06, 07, 10, 33 |
| `.github/workflows/glass-pipeline.yml` (file owner PRD-02 (PKG) from 5.0 work; job names fixed by SC-10) | `workflow_call`, pack matrix Node 20/24, `react19-smoke`, `unit-react19`, claims lint, hygiene, side-effect gate | 04, 09, 10, 27, 37, 41, 55 |
| `.github/workflows/design-system-compliance.yml`, `visual-regression.yml`, `deploy-storybook.yml` | evidence upload only; no gate semantics changed here (PRD-01 (REL)/PRD-19 (QA)); `visual-regression.yml` edit is 4.x-line only (SC-09) | 33 |
| `package.json` | version, `lint`/`lint:fix`, remove `release*`, `prepublishOnly` guard, `api:*` scripts, `files` += `deprecations.json` | 08, 12, 49, 51, 52 |
| `scripts/publish-307-after-npm-login.sh`, `scripts/configure-npm-trusted-publishing-307.sh` | delete | 08 |
| `eslint.config.js` | `react-hooks/rules-of-hooks`, `no-new-func`, `no-eval`, `no-inline-glass` scope, new rule | 09, 16, 21, 29 |
| `eslint-plugin-auraglass.js` (existing; MODIFY, file owner PRD-02 (PKG), SC-16) | add `motion-no-empty-animate` (name owner PRD-06 (MOT)) | 29 |
| `src/utils/adaptiveAI.ts` | inert singleton, `enableAdaptiveAI`, disposer, cap | 13, 14 |
| `src/index.ts` (`:767-785`, `:875`, `:893`, `:915-916`) | add `enableAdaptiveAI` export; others unchanged | 14, 35 |
| `src/components/cms/GlassCanvas.tsx` | remove sink; `onComponentAction` | 16 |
| `src/utils/browserCompatibility.ts` | scoped eslint-disable only | 16 |
| `src/components/media/GlassAdvancedVideoPlayer.tsx` (+ stories) | remove `isStorybookDataMedia` | 17 |
| `src/components/accessibility/ContrastGuard.tsx`, `ContrastGuard.stories.tsx`, `ContrastGuard.test.tsx`, `__snapshots__/ContrastGuard.test.tsx.snap` | unverified status | 18 |
| `src/utils/contrastGuard.ts` | callers of the verdict | 18, 19 |
| `src/tokens/glass.ts` | `validateTextContrast` | 19 |
| `SECURITY.md` | supported versions, hosted-runtime notice | 20 |
| 24 files with conditional hooks (§2.3), including `src/components/input/GlassInput.tsx`, `src/components/button/GlassButton.tsx`, `src/components/button/GlassFab.tsx`, `src/components/toggle-button/ToggleButton.tsx`, `src/components/layout/GlassContainer.tsx`, `src/utils/a11yEnhancers.tsx`, `src/utils/a11yHooks.ts` | hoist | 22 |
| `src/components/advanced/GlassPredictiveEngine.tsx`, `GlassEyeTracking.tsx`, `GlassBiometricAdaptation.tsx`, `GlassSpatialAudio.tsx`, `GlassAchievementSystem.tsx` | add internal non-throwing `useOptional*` readers (not exported) | 22 |
| `src/primitives/index.ts`, `src/theme/index.ts` | `"use client"` | 23 |
| `src/components/ssr/AuraGlassClientBoundary.tsx`, `src/hooks/useEnhancedReducedMotion.ts`, `src/hooks/useDeviceCapabilities.ts` | hydration-stable init | 25 |
| `src/primitives/Slot.tsx` | `props.ref` first | 26 |
| 35 files with `animate={reduced ? {} : …}` (§2.4) | visible final state | 28 |
| `src/components/button/GlassButton.test.tsx`, `src/components/card/GlassCard.test.tsx` and their `__snapshots__` | reviewed snapshot update | 11 |
| 29 scripts writing into `reports/` (`rg -l "['\"/]reports/" scripts`) | evidence dir | 32 |
| `src/stories/CuratedComponentGuide.stories.tsx`, `src/reports/glassmorphismAuditCoverage.ts`, `scripts/ensure-component-inventory.js`, `tests/visual/design-system/storybook-visual-certification.spec.ts`, `tests/visual/design-system/glass-audit-coverage.spec.ts` | relocated inputs; no empty-inventory fallback | 34 |
| 45 root `*.mjs` scripts (§2.5) | delete | 36 |
| `README.md`, `llms.txt`, `RELEASE_NOTES_4.1.0.md`, `CHANGELOG.md` | retractions | 38–42 |
| `server/index.ts`, `.env.example`, `Dockerfile` | JWT guard, empty default, no `.env` copy | 44 |
| `src/components/interactive/GlassCommandPalette.tsx` | escape fuzzy-search input | 53 |
| `src/components/cookie-consent/CookieConsent.tsx`, `GlobalCookieConsent.tsx`, `CompactCookieNotice.tsx` | visibility driven by `visible`; hidden ⇒ not hit-testable | 54 |
| `src/styles/index.css`, `src/styles/variables.css`, `src/styles/aeonik.css`, `src/styles/fonts/Aeonik-*.woff2`, `src/tokens/generated.ts`, `src/tokens/designConstants.ts`, `src/theme/tokens.ts`, `src/components/media/GlassAdvancedAudioPlayer.tsx`, `src/components/charts/ModularGlassDataChart.tsx`, `src/components/charts/GlassDataChart.tsx` | font decision | 46–48 |
| `docs/release-rollback-deprecation.md` | link to the two 4.1.1 decision records (`docs/release/decisions/`, NEW) | 09, 47 |

---

## 7. Components affected

Dispositions are from `component-inventory.json` (5.0 fate); a 4.1.1 fix does not change the 5.0 disposition. "—" means no record under that exact name.

| Component / module | 4.1.1 change | 5.0 disposition |
|---|---|---|
| `GlassInput` | hooks hoisted; `errorText` toggle no longer throws | REDESIGN |
| `GlassButton`, `GlassFab`, `ToggleButton` | 7 conditional hooks each hoisted; consciousness hooks gated by `enabled` | REDESIGN / CONSOLIDATE / — |
| `GlassSwitch`, `GlassSlider`, `GlassCheckbox`, `GlassCheckboxGroup`, `GlassRadioGroup`, `GlassStepper` | hooks hoisted | REDESIGN / REDESIGN / REDESIGN / CONSOLIDATE / — / — |
| `GlassModal`, `GlassDrawer`, `GlassBottomSheet`, `GlassHoverCard`, `GlassHeader`, `GlassContainer` | hooks hoisted | REDESIGN / CONSOLIDATE / CONSOLIDATE / CONSOLIDATE / — / REDESIGN |
| `GlassChat`, `GlassCarousel`, `GlassDataTable`, `GlassKanban`, `GlassChart`, `ModularGlassDataChart` | hooks hoisted | REDESIGN / REPLACE / — / REMOVE / — / — |
| `GlassCanvas` | string `onClick` no longer executed; `onComponentAction` added | REMOVE |
| `GlassAdvancedVideoPlayer` | `data:video/` sources play | REDESIGN |
| `ContrastGuard` (+ `src/utils/contrastGuard.ts`, `validateTextContrast`) | reports `"unverified"` | REPLACE |
| `Slot` / `GlassSlot` (`src/primitives/Slot.tsx`, `src/primitives/slot/GlassSlot.tsx`) | `props.ref` first | POLISH (autopsy A2) |
| `AuraGlassClientBoundary`, `useEnhancedReducedMotion`, `useDeviceCapabilities` | hydration-stable | POLISH / — / — |
| `adaptiveAI`, `useAdaptiveAI`, `enableAdaptiveAI` | opt-in tracking | deleted in 5.0 (architecture §13.3) |
| `primitives` and `theme` entries (`Portal`, `FocusScope`, `DismissableLayer`, `RovingFocusGroup`, `Positioner`, `GlassCore`, `createGlassTheme`, …) | client directive on entry | KEEP/POLISH/REPLACE per item |
| 35 reduced-motion files incl. `GlassFacetSearch`, `GlassPresenceIndicator`, `GlassTransitions`, `GlassFocusIndicators`, `TouchGlassOptimization`, `VoiceGlassControl` | visible final state | mostly CONSOLIDATE/REMOVE |
| `GlassCard` | snapshot re-baselined (no code change) | POLISH |
| Every component using `--glass-font-sans` | font stack changes if REQ-TRUST-46 ships | n/a |

---

## 8. New components/files

All paths are **NEW** (none exist at `15b6de6f7`).

| Path | Purpose |
|---|---|
| `scripts/ci/lib/npm-pack.js` | `parsePackJson`, `packToDir` |
| `scripts/ci/lib/evidence-dir.js` | `evidenceDir()` (SC-07) |
| `scripts/ci/require-ci-publish.js` | aborts `prepublishOnly` outside GitHub Actions |
| `scripts/ci/verify-import-side-effects.js`, `scripts/ci/import-side-effects-baseline.json` | jsdom import gate |
| `scripts/ci/client-entries.json` | entries that must start with `"use client"` |
| `scripts/ci/verify-tree-hygiene.js` | no `reports/`, no root probes, size cap |
| `scripts/ci/verify-docs-claims.js` | claims lint |
| `scripts/release/api-report.mjs`, `scripts/release/export-snapshot.mjs` | API Extractor report + runtime/declared export snapshot (SC-04 names; REL extends) |
| `api-extractor.base.json` | shared API Extractor config (per-entry configs generated in a temp dir) |
| `etc/api/<entry-slug>.api.md`, `etc/api/<entry-slug>.exports.json`, `etc/api/manifest.json` | baseline API reports (SC-04; root slug `index`) |
| `deprecations.json` (repo root) | seed (SC-02 envelope, SC-03 schema, `version: 1`) |
| `docs/release/decisions/4.1.1-lint-scope.md`, `docs/release/decisions/4.1.1-font-licence.md` | decision records |
| `eslint/no-inline-glass-baseline.json` | only if REQ-TRUST-09 option (b) |
| `src/test-utils/motion.ts` | `expectSettledVisible` |
| `docs/release/decisions/4.1.1-react19-matrix.md` | non-gating React 19 failures list (REQ-TRUST-55) |
| `src/components/interactive/__tests__/GlassCommandPalette.regex.test.tsx`, `src/components/cookie-consent/__tests__/visibility.test.tsx` | accepted-intake tests (REQ-TRUST-53/-54) |
| `useOptionalPredictiveEngine`, `useOptionalEyeTracking`, `useOptionalBiometricAdaptation`, `useOptionalSpatialAudio`, `useOptionalAchievements`, `useOptionalInteractionRecorder` (internal, not exported) | non-throwing provider readers for hoisted call sites |
| `enableAdaptiveAI` (export in `src/utils/adaptiveAI.ts`) | explicit opt-in, deprecated |
| `GlassCanvas` prop `onComponentAction` | safe replacement for string scripts |
| `docs/inventory/component_inventory.json` | moved input |
| `docs/certification/certification-audit-spec.md` | moved input |
| `docs/security/advisories/2026-10-hosted-runtime.md` | advisory draft |
| `RELEASE_NOTES_4.1.1.md` | release notes |
| `LICENSE-FONTS` | only if REQ-TRUST-47 |
| Tests listed in §12 | |

---

## 9. Components/files to remove or deprecate

**Removed from the tree in 4.1.1 (not shipped API):** `reports/` (index only, D-32), 45 root probe/inspect scripts, `scripts/publish-307-after-npm-login.sh`, `scripts/configure-npm-trusted-publishing-307.sh`, `package.json` scripts `release` and `release:dry-run`, the `NPM_TOKEN` publish branch, and, if unused, `scripts/ci/stale-3-3-scan.js`, `scripts/audit/3.0.7-source-audit.js`, `scripts/audit/3.1-frame-loop-audit.js`.

**Removed from the tarball (security/privacy/legal exception, §13.1):** `dist/styles/fonts/Aeonik-*.woff2` and the `aeonik.css` rules (REQ-TRUST-46 path only).

**Removed behaviour (exception, each with a `deprecations.json` entry):** import-time `adaptiveAI` tracking; `GlassCanvas` string-script execution; `data-meets-wcag` and `data-contrast-ratio` on ContrastGuard; `validateTextContrast` returning `true`; hit-testable hidden cookie-consent banners (REQ-TRUST-54). The `GlassCommandPalette` regex escape (REQ-TRUST-53) is a plain C-I crash fix with a release-note line only. `isStorybookDataMedia` poster forcing is removed as a plain C-I bug fix (it was never documented consumer behaviour) and gets a release-note line, not an entry.

**Deprecated (C-D, removed in 5.0):** `adaptiveAI`, `useAdaptiveAI`, `enableAdaptiveAI`, `ContrastGuard`, `validateTextContrast`, the report-path constants (`src/index.ts:767-785`, `src/reports/legacyDocuments.ts`), and `GlassCanvas` string `onClick`. Dev warnings exist in 4.1.1 only for `enableAdaptiveAI` and `GlassCanvas` string scripts; the general warning rollout is 4.2 (§16 PRD-17, interim owner REL, SC-37).

**Not removed in 4.1.1 (owned elsewhere):** `server/`, `src/services/**`, `Dockerfile`, `docker-compose.yml`, the `./services/*`, `./server`, `./ssr`, `./client` subpaths, backend `dependencies`, and every REMOVE-disposition component. These need a 4.2 C-D first (§16 PRD-16 removal, owned by FND; §16 PRD-17 bridge, interim REL).

---

## 10. API changes

| Change | Entry | Class | Notes |
|---|---|---|---|
| `enableAdaptiveAI(): () => void` added | `aura-glass` | C-E, deprecated on arrival (C-D) | Only way to get 4.1.0 tracking behaviour |
| `adaptiveAI` no longer tracks until enabled | `aura-glass` | C-I (privacy exception, §13.1) | Same object identity and methods |
| `useAdaptiveAI()` no longer starts tracking | `aura-glass` | C-I (privacy exception) | Same return shape |
| `GlassCanvas` string `onClick` not executed | `aura-glass` | C-I (security exception) | Dev warning |
| `GlassCanvas` `onComponentAction?` prop | `aura-glass` | C-E | |
| `validateTextContrast` returns `"unverified"`; type `boolean \| "unverified"` | `aura-glass` (`glassTokenUtils` path in `src/tokens/glass.ts`) | C-I (honesty exception, architecture §7.5) | TS consumers comparing `=== true` still compile and now get `false`; `if (result)` compiles but treats the truthy `"unverified"` as a pass, which the release notes call out; narrowing on `boolean` may need a cast. Listed in release notes |
| ContrastGuard: `data-contrast-status="unverified"` added; `data-meets-wcag`, `data-contrast-ratio` removed | `aura-glass` | C-I (honesty exception) | Consumer CSS/tests selecting those attributes break; documented |
| `"use client"` added to `aura-glass/primitives`, `aura-glass/theme` | subpaths | C-I (crash fix) | Server imports now yield client references instead of crashing |
| Hydration-stable first render of 3 helpers | `aura-glass` | C-I (bug fix) | First client paint now equals the server output |
| `Slot` reads `props.ref` | `aura-glass`, `aura-glass/primitives`, `aura-glass/primitives/slot` | C-I | |
| Reduced-motion final state visible | 35 components | C-I (a11y fix) | |
| Aeonik removed from tarball and default stack | `aura-glass/styles` | C-I (legal exception, D-31) | Visible font change; documented with composites |
| Report-path constants deprecated | `aura-glass` | C-D | Values unchanged |
| `GlassCommandPalette` search escapes regex metacharacters | `aura-glass` | C-I (crash fix) | No API change |
| Cookie-consent banners not hit-testable while hidden | `aura-glass` | C-I (privacy exception) | Visible when shown, as documented |
| No `dependencies`/`peerDependencies`/`exports` change | — | — | REQ-TRUST-52 |

---

## 11. Migration concerns

- **Consumers relying on adaptive tracking** (none known; verify with REQ-TRUST-45's grep) add `useEffect(() => enableAdaptiveAI(), [])` once at app root. Release notes show this snippet.
- **CMS content with string `onClick` in `GlassCanvas`** stops executing. Replacement: `onComponentAction={(id) => …}`. Treat any stored script strings as untrusted content and purge them.
- **Tests or CSS selecting `[data-meets-wcag]`** break. Replacement: none (the value was fabricated); select `[data-contrast-status]` if a hook is needed.
- **TypeScript narrowing of `glassTokenUtils.validateTextContrast`** to `boolean` may fail type-check. This is the one type-visible change; it is intentional and listed.
- **Server Components importing `aura-glass/primitives` or `aura-glass/theme`** go from crash to client reference. Calling a non-component helper (for example `createGlassTheme`) *on the server* still fails, now with Next's "client function called from server" error; this is documented as a known limitation, fixed in 5.0 (PRD-02/PRD-03).
- **Hydration fixes** change the first client paint of `AuraGlassClientBoundary` children (now the fallback for one commit), and of components reading `useEnhancedReducedMotion` (reduced motion assumed (`true`) until effects run, matching the server; users without the preference see motion start one commit later). Apps that relied on the mismatch to skip SSR content will see their `fallback` briefly.
- **Font change.** Apps that did not set a font see system UI instead of Aeonik. Apps with an Aeonik licence restore it by defining `@font-face` and `--glass-font-sans`. Line heights and widths shift; visual baselines in consumer repos must be re-approved. If REQ-TRUST-47 ships instead, nothing changes.
- **Contributors.** After REQ-TRUST-31, `git pull` deletes nothing on disk but `git status` stops showing `reports/`; scripts write to `.artifacts/`. Old evidence remains reachable at commits ≤ `15b6de6f7`. Clone size does not drop until a history decision (out of scope).
- **Publishing.** The npm package's trusted-publisher setting names `auraoneai/auraglass` and `publish-npm.yml`; keeping the filename (SC-05) means no change to it. The operator **confirms** the binding (changing it would be outside the autonomous perimeter; agents do not perform it). If the binding is missing, the tag workflow fails closed at `npm publish`, which is the intended behaviour (no token fallback).
- **Rollback.** If 4.1.1 regresses, `npm dist-tag add aura-glass@4.1.0 latest` plus `npm deprecate aura-glass@4.1.1 "<reason>"` (architecture §14.6), run by the owner. Because 4.1.0 contains the privacy and security defects, a forward fix 4.1.2 is preferred over a long rollback.

---

## 12. Tests required

All jest tests run under the existing `jest.config.js` (jsdom, `roots: ['<rootDir>']`). Heavy suites (Next/Vite integration, Storybook build, Playwright) run in GitHub Actions or remote runners only.

| Test file (NEW unless stated) | Asserts |
|---|---|
| `tests/ci/npm-pack.test.ts` | `parsePackJson` returns `{ filename, files }` for npm 10 array, npm 11 object and noisy-prefix fixtures; throws on `{}` and on 2 packages; `rg`-equivalent scan of `scripts/**` finds no `JSON.parse(packOutput)` |
| `tests/ci/evidence-dir.test.ts` | `scripts/ci/lib/evidence-dir.js` `evidenceDir()` honours `AURAGLASS_EVIDENCE_DIR`, defaults to `<root>/.artifacts`; no file under `scripts/` contains a write call with a literal `reports/` path |
| `tests/ci/publish-workflow.test.ts` | parses `publish-npm.yml`: it exists and `release.yml` does not (SC-05); only trigger is tag `v4.*.*` (no `workflow_dispatch`); `permissions.id-token == write`; exactly one `npm publish` step and it has `--provenance`; no `NPM_TOKEN`/`NODE_AUTH_TOKEN` in any workflow; publish job `needs` the verify job; version/tag/CHANGELOG assertion step present |
| `tests/ci/require-ci-publish.test.ts` | the guard exits 1 without `GITHUB_ACTIONS=true`; exits 1 with `GITHUB_ACTIONS=true` and `GITHUB_WORKFLOW_REF=auraoneai/auraglass/.github/workflows/glass-pipeline.yml@refs/heads/main` or `.../publish-npm.yml@refs/heads/main`; exits 0 with `GITHUB_ACTIONS=true` and `GITHUB_WORKFLOW_REF=auraoneai/auraglass/.github/workflows/publish-npm.yml@refs/tags/v4.1.1` |
| `tests/ci/no-gate-bypass.test.ts` | no workflow step uses `continue-on-error: true`, `\|\| true` on a gate, or `--no-verify`; `lint:check` present in `glass-pipeline.yml`; `package.json` `lint` has no `--fix` |
| `tests/ci/import-side-effects.test.ts` | importing `dist/index.mjs` in jsdom registers 0 listeners and 0 intervals attributable to `adaptiveAI`; total effects ⊆ baseline |
| `src/utils/__tests__/adaptiveAI.optin.test.ts` | import → 0 listeners; `enableAdaptiveAI()` → exactly 2 document listeners + 1 interval; disposer removes all 3; second call is idempotent; one dev warning; arrays capped at 20 |
| `src/components/cms/GlassCanvas.security.test.tsx` | a button with `props.onClick = "window.__pwned=1"` clicked → `window.__pwned` undefined, `Function` constructor spy not called, one warning; `onComponentAction` called with id |
| `src/components/media/GlassAdvancedVideoPlayer.datasrc.test.tsx` | `src="data:video/mp4;base64,…"` renders a `<video>` with that `src`, not the poster surface |
| `src/components/accessibility/ContrastGuard.honesty.test.tsx` | rendered root has `data-contrast-status="unverified"`, no `data-meets-wcag`, no `data-contrast-ratio`; callback payload `status === "unverified"` |
| `src/tokens/__tests__/validateTextContrast.test.ts` | returns `"unverified"` for `#000`/`#fff` and for `#777`/`#888` |
| `src/components/input/GlassInput.hooks.test.tsx` | rerender `errorText` undefined → `"x"` → undefined, and `label`/`helperText` toggles: no throw, no React hook-order warning |
| `src/__tests__/hooks-order.test.tsx` | for each of the 24 files' exported components, toggling every boolean/optional prop that gated a hook across 3 rerenders produces no "Rendered more/fewer hooks" error; `GlassButton` and `GlassContainer` with `predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, `trackAchievements` all `true` and **no provider** mounted render without throwing and with 0 listeners/timers/`AudioContext` (spies); `usePredictiveEngine()` called directly outside its provider still throws (public behaviour unchanged) |
| `tests/ci/use-client-entries.test.ts` | each file in `client-entries.json` (built `dist`) begins with `"use client"` |
| `src/__tests__/ssr/hydration.test.tsx` | for the 3 helpers: `renderToString` then `hydrateRoot` into a container with `matchMedia` reduce=false and a desktop UA → `onRecoverableError` never called, no `console.error` containing "did not match"/"Hydration" |
| `src/primitives/__tests__/Slot.ref.test.tsx` | outer and child refs both receive the element; on React 19 (job `react19-smoke`) no `console.error` mentioning `element.ref`, both for a child with a ref and for a child **without** one; on React 18 the `element.ref` path composes refs |
| `src/__tests__/motion/reduced-motion-visible.test.tsx` | with reduced motion mocked, one representative component per file of the 35 mounts and `expectSettledVisible` passes for its content root |
| `tests/eslint/motion-no-empty-animate.test.ts` | `auraglass/motion-no-empty-animate` `RuleTester` valid/invalid cases (`animate={r ? {} : {opacity:1}}` invalid; `animate={r ? {opacity:1} : v}` valid) |
| `tests/ci/tree-hygiene.test.ts` | `verify-tree-hygiene.js` fails on a fixture index containing `reports/x.json` or `probe-a.mjs`, passes on a clean one |
| `tests/docs/claims-lint.test.ts` | `verify-docs-claims.js` exits 0 on the repo; exits 1 on fixtures containing each banned pattern; ignores retraction blockquotes; `SECURITY.md` lists `4.1.x` |
| `tests/deployment/jwt-secret-guard.test.ts` | server startup with the `.env.example` default or a 16-char secret exits 1; with 32+ chars proceeds; `Dockerfile` has no `COPY .env.example` |
| `tests/ci/tarball-fonts.test.ts` | packed file list obeys REQ-TRUST-48 for the chosen path |
| `tests/release/export-snapshot.test.ts` | all 47 export keys have `etc/api/<entry-slug>.exports.json` (7 with `kind: "asset"`; root file `etc/api/index.exports.json`); root runtime names include `enableAdaptiveAI`; every `typesRuntimeMismatch` value equals the committed baseline; every typed key has `.api.md` or an `unanalysable` reason in `etc/api/manifest.json` |
| `tests/release/deprecations-seed.test.ts` | root `deprecations.json` parses with `$schema` and `version: 1`; every entry has the SC-03 required keys (incl. `status`) and enum values (`kind` 13 values incl. `asset`; `exception` incl. `honesty`); ContrastGuard/`validateTextContrast` entries have `exception: "honesty"`; ids match `^DEP-\d{4}$` and are unique; no `since` > `package.json` `version`; every seeded `symbol` with `kind: "export"` exists in `etc/api/index.exports.json`; `package.json` `files` contains `deprecations.json` |
| `src/components/interactive/__tests__/GlassCommandPalette.regex.test.tsx` | typing each of `( [ * + ? \ ^ $ \| { }` into the palette input: no throw, no error boundary; an item whose label contains `(` is still matched by `(`; results for `abc` equal the 4.1.0 results (fixture) |
| `src/components/cookie-consent/__tests__/visibility.test.tsx` | for each of the 3 components, without `forceVisible`: after the show timeout computed `opacity` is `1`; after dismiss `visibility: hidden` and `pointer-events: none`; a click at the banner position while hidden calls no consent callback |
| `tests/ci/package-json-patch-scope.test.ts` | `dependencies`, `peerDependencies`, `exports` deep-equal the `15b6de6f7` values (fixture snapshot) |
| Existing, must stay green: `src/components/button/GlassButton.test.tsx`, `src/components/card/GlassCard.test.tsx`, `src/__tests__/components/GlassButton.test.tsx`, `src/components/input/GlassInput.test.tsx`, `src/components/cms/GlassCanvas.test.tsx`, `src/components/accessibility/ContrastGuard.test.tsx`, `src/primitives/native-primitives.test.tsx`, `tests/exports/package-exports.test.ts` | snapshots updated only with the review note of REQ-TRUST-11 |

CI jobs (remote): `pack-matrix` (Node 20 + 24), `react19-smoke`, `unit-react19` (REQ-TRUST-55), `test:integration:next` with the RSC `next build`, `test:integration:vite`, `api:check`, Storybook build.

---

## 13. Storybook requirements

- `src/stories/CuratedComponentGuide.stories.tsx` imports the inventory from `docs/inventory/component_inventory.json`; `build-storybook` passes in CI.
- `ContrastGuard.stories.tsx`: description and a visible `Callout` text "Unverified: does not measure rendered contrast" on every story; no story asserts WCAG pass.
- `GlassAdvancedVideoPlayer` stories that used `data:video/` to force posters pass `src: undefined` + `poster`; one story demonstrates a real `data:video/` source playing.
- `GlassCanvas.stories.tsx`: replace any string `onClick` sample with `onComponentAction`.
- 4.1.1 adds no Storybook tooling (the Material Lab is PRD-19). Reduced-motion verification lives in jest (§12) and the remote capture of §15/§16.
- No story may import from `reports/` (`rg -n "reports/" src --glob '*.stories.*'` = 0).

---

## 14. Responsive requirements

4.1.1 changes no layout. Requirements are regression-only:

- The REQ-TRUST-46 font change must not create horizontal overflow: in the remote Playwright lane, the existing app-chrome visual run (`test:visual:app-chrome`) at 1440×900 and 390×844 reports `document.documentElement.scrollWidth <= innerWidth` for every captured story, and button/label text does not wrap where it did not wrap in 4.1.0 (computed line count per text node, diff = 0) or the diff is listed in the release notes.
- `GlassInput` with `errorText` at 390×844 renders the error text without overflow (same check).

---

## 15. Accessibility requirements

- Under `prefers-reduced-motion: reduce`, all content of the 35 affected components is visible at settle (`opacity` 1, identity transform); verified in jest (§12) and in the remote Chromium lane by emulating `reducedMotion: 'reduce'` on the stories of those components that exist and asserting no visible-text node has computed `opacity < 1` 500 ms after load.
- No component claims WCAG compliance it did not measure: zero `data-meets-wcag` in the rendered DOM of any story (remote DOM scan).
- Fixing hooks must not change ARIA: `GlassInput`'s `aria-describedby`/`aria-invalid` and label association are unchanged when `errorText`/`helperText`/`label` are set (assert ids in `GlassInput.hooks.test.tsx`). `useA11yId` ids stay stable across rerenders.
- `GlassAdvancedVideoPlayer` keeps its control labels when a `data:` source plays.
- Font fallback stack keeps the same `font-size` tokens; the remote contrast sampling (`runtime-remote.md` method) on the default stage must not regress the 17/342 failure count by more than 0.
- `jest-axe` suites in touched component folders stay green.

---

## 16. Performance requirements

4.1.1 sets no new size budgets (that is PRD-02/D-26); it must not regress, and it removes known waste.

| Metric | 4.1.0 measured | 4.1.1 budget | How measured (remote CI) |
|---|---|---|---|
| `import { GlassButton } from "aura-glass"` min / gzip | 1,658,245 B / 448,812 B (`runtime-local.md`) | ≤ 4.1.0 + 1% (≤ 1,674,828 B / 453,301 B) | `npm run test:tree-shaking -- --strict` (existing `maxBytes: 1700000` stays) |
| `import { Slot } from "aura-glass/primitives/slot"` | 631 B / 414 B | ≤ 700 B / 460 B | same harness |
| Packed tarball | 9.65 MB | ≤ 9.25 MB if REQ-TRUST-46 (−468 KB fonts), else ≤ 9.70 MB | `verify-pack` `size` from `npm pack --json` |
| Import-time listeners / intervals from `adaptiveAI` | 2 / 1 | 0 / 0 | REQ-TRUST-15 |
| Idle CPU from the 1 s `adaptiveAI` interval | 1 tick/s forever | 0 until `enableAdaptiveAI()` | `adaptiveAI.optin.test.ts` fake timers |
| Unbounded interaction arrays | unbounded | ≤ 20 entries each | same test |
| Reduced-motion components: rAF/WAAPI activity 1 s after mount | not measured | 0 animations running (`document.getAnimations().length === 0` for the component subtree) | remote Chromium, emulated reduce |
| Conditional-hook fix overhead | n/a | gated hooks with `enabled=false` add 0 listeners, 0 timers, 0 workers | `hooks-order.test.tsx` spies |
| Repository HEAD tree | 2.95 GB, 50,127 files | ≤ 200 MB, ≤ 3,000 tracked files | `git ls-files \| wc -l`; `git ls-tree -r -l HEAD` sum |
| Fresh `git clone --depth 1` | ~2 GB | ≤ 200 MB | CI step on the release SHA |
| `prepublishOnly`-equivalent wall time | unrunnable on npm 11 | ≤ 25 min on `ubuntu-latest` | Actions timing; job `timeout-minutes: 45` stays |

---

## 17. Acceptance criteria

- **AC-TRUST-01** `npm view aura-glass@4.1.1 dist.attestations` shows a provenance attestation whose builder is GitHub Actions, workflow `.github/workflows/publish-npm.yml`, ref `refs/tags/v4.1.1`, and whose source commit equals the tag commit.
- **AC-TRUST-02** The tag commit has a successful "AuraGlass Pipeline Validation" run; `gh run list --workflow glass-pipeline.yml --commit <sha>` shows `success`. Zero gate steps use `continue-on-error` or `|| true`.
- **AC-TRUST-03** `rg -n "NPM_TOKEN|NODE_AUTH_TOKEN" .github` = 0 lines; `package.json` has no `release` script; `scripts/publish-307-after-npm-login.sh` does not exist.
- **AC-TRUST-04** The `pack-matrix` job passes on Node 20 (npm 10) and Node 24 (npm 11); `rg -n "JSON.parse\(packOutput\)" scripts` = 0.
- **AC-TRUST-05** The 3 committed pack-fix diffs are attributable (`git log --follow -p scripts/ci/verify-pack.js` shows REQ-TRUST-01's commit); `reports/3.2-release/vite-integration.json` is not in the 4.1.1 tree.
- **AC-TRUST-06** Importing `aura-glass@4.1.1` from the packed tarball in jsdom: 0 document `click`/`scroll` listeners, 0 intervals, 0 `data-ai-*` attributes on `<html>` after 2 s and 15 simulated clicks.
- **AC-TRUST-07** `rg -n "new Function|eval\(" src --glob '!*.test.*'` returns only `src/utils/browserCompatibility.ts:197,421,424`.
- **AC-TRUST-08** `npm run lint:check` reports 0 `react-hooks/rules-of-hooks` errors and 0 total errors; `rg --pcre2 "(\?|&&)\s*use[A-Z]\w*\(" src --glob '!*.stories.*' --glob '!*.test.*'` = 0.
- **AC-TRUST-09** The React 19 Next app's `next build` with the Server Component page importing `aura-glass/primitives` and `aura-glass/theme` exits 0.
- **AC-TRUST-10** `hydration.test.tsx` records 0 recoverable errors and 0 hydration warnings for the 3 helpers on React 18.2 and React 19.
- **AC-TRUST-11** `Slot.ref.test.tsx` passes in `react19-smoke` with 0 `console.error` calls.
- **AC-TRUST-12** `rg --pcre2 "animate=\{[^}]*[Rr]educed[^?]*\?\s*\{\}" src` = 0; `reduced-motion-visible.test.tsx` passes for 35/35 files.
- **AC-TRUST-13** In the rendered DOM of every ContrastGuard story, `[data-meets-wcag]` count = 0 and `[data-contrast-status="unverified"]` count ≥ 1; `glassTokenUtils.validateTextContrast("#000","#fff") === "unverified"`.
- **AC-TRUST-14** `verify-docs-claims.js` exits 0 on the release SHA; `RELEASE_NOTES_4.1.0.md` line 1–3 contains the retraction block; the GitHub Release `v4.1.0` body contains it.
- **AC-TRUST-15** `git ls-files reports | wc -l` = 0; `git ls-files | grep -cE '^[^/]*probe[^/]*\.mjs$'` = 0; total tracked files ≤ 3,000.
- **AC-TRUST-16** The release run uploaded ≥ 1 `evidence-*-<sha>` artifact with `retention-days: 90`, linked from the GitHub Release `v4.1.1`; every `actions/upload-artifact` step in `.github/workflows/` sets `retention-days` explicitly (14 PR / 30 main / 90 release, SC-07).
- **AC-TRUST-17** A GitHub Security Advisory for the hosted runtime is in state `published` with a publish time earlier than the `v4.1.1` tag time; `SECURITY.md` lists `4.1.x`.
- **AC-TRUST-18** `server/` refuses to start with the default or a < 32-char `JWT_SECRET` (`jwt-secret-guard.test.ts`); `Dockerfile` has 0 `.env.example` copies.
- **AC-TRUST-19** Exactly one of: `npm pack --dry-run --json` lists 0 `Aeonik` paths **and** `docs/release/decisions/4.1.1-font-licence.md` records "unconfirmed → removed"; or the tarball contains `dist/styles/fonts/LICENSE` **and** the record names the licensor and date.
- **AC-TRUST-20** `etc/api/` contains a `.exports.json` for each of the 47 export keys (root slug `index`) and, for each of the 40 typed keys, an `.api.md` or an `unanalysable` reason in `etc/api/manifest.json`; `test ! -d api` (no legacy `api/` directory); `npm run api:check` passes on the release SHA.
- **AC-TRUST-21** The repo-root `deprecations.json` (and no `docs/deprecations.json`) has `version: 1` and ≥ 19 entries (8 behaviour/export entries of REQ-TRUST-51 including cookie consent + 11 report-path constants; 20 with the Aeonik `asset` entry) covering every symbol in §9 "Deprecated" and "Removed behaviour"; the 3 ContrastGuard/`validateTextContrast` entries carry `exception: "honesty"`; `tests/release/deprecations-seed.test.ts` passes.
- **AC-TRUST-22** `package-json-patch-scope.test.ts` passes (no change to `dependencies`, `peerDependencies`, `exports`).
- **AC-TRUST-23** The Button-only import size and tarball size meet §16.
- **AC-TRUST-24** `npx jest --ci` on the release SHA: 0 failed suites, 0 obsolete snapshots written.
- **AC-TRUST-25** `GlassCommandPalette.regex.test.tsx` passes; `rg -n "new RegExp\(query" src/components/interactive/GlassCommandPalette.tsx` returns only the escaped construction.
- **AC-TRUST-26** `src/components/cookie-consent/__tests__/visibility.test.tsx` passes for all 3 components (REQ-MOT-T07 assertions); `rg -n "useGalileoStateSpring" src/components/cookie-consent` = 0.
- **AC-TRUST-27** The `unit-react19` job on the release SHA reports 0 `console.error` calls matching `/element\.ref/`; `docs/release/decisions/4.1.1-react19-matrix.md` lists any non-gating React-19-only failures.
- **AC-TRUST-28** `rg -n "motion-no-empty-animate" eslint-plugin-auraglass.js` ≥ 1 and `rg -n "no-empty-reduced-animate|scripts/lib/|release\.yml" .github scripts eslint-plugin-auraglass.js eslint.config.js package.json` = 0 (registry names only, SC-05/SC-11/SC-16).

---

## 18. Definition of done

1. REQ-TRUST-01 … REQ-TRUST-55 are implemented, or (REQ-TRUST-09, -46/-47 only) the alternative chosen is recorded in `docs/release/decisions/4.1.1-lint-scope.md` / `4.1.1-font-licence.md`.
2. AC-TRUST-01 … AC-TRUST-28 are met and their evidence is a CI artifact keyed to the `v4.1.1` SHA (D-32), linked from the GitHub Release. No evidence file is committed.
3. Every test in §12 exists, runs in CI, and fails when its requirement is reverted (spot-checked by the reviewer on REQ-TRUST-13, -16, -22, -25, -28).
4. `RELEASE_NOTES_4.1.1.md`, `CHANGELOG.md` `## [4.1.1]`, `SECURITY.md` and the advisory are merged/published; each §4.1 exception has a release-note line and a `deprecations.json` id.
5. Changes land as small revertable PRs, one per workstream (§20), each with a conventional-commit title and no `!`.
6. `aura-glass@4.1.1` is `latest` on npm, published only by the tag workflow.
7. Operator actions recorded and either done or listed as open in the release issue: npm trusted-publisher confirmation (`publish-npm.yml` binding), advisory publication, font licence decision.
8. PRD-01 (REL) has the API report (`etc/api/`) and root `deprecations.json` it needs (handoff note in the PRD-01 issue); the §21 open items are filed on their owners.
9. The Mac ran no Docker, Playwright, Storybook build or integration suite for this work (remote-first policy).

---

## 19. Dependencies

Keys and §16 ids per SC-01. Cross-PRD task links use the SC-40 anchor tasks.

| PRD | Relationship |
|---|---|
| — | PRD-00 (TRUST) has **no upstream PRD** (architecture §16). It is Wave 0; `tasks/TRUST.json` has no cross-fragment `depends_on`. |
| PRD-01 (REL), `AURAGLASS_RELEASE_MIGRATION_PRD.md` | **Downstream, hard; shared contract owner.** REL owns the contracts this PRD builds the 4.1.1 instances of: SC-02/SC-03 (`deprecations.json` envelope and schema; REL-010 schema, REL-070 generator), SC-04 (`etc/api/`, `scripts/release/{api-report,export-snapshot}.mjs`; REL-003 extends), SC-05 (`publish-npm.yml`; REL adds dist-tag derivation, ledger, change class). TRUST anchors REL depends on: TRUST-071/072 (API scripts), TRUST-075 (deprecations seed), TRUST-077 (publish workflow), TRUST-079 (guard). REL must not re-implement them, and must not start its schema freeze before AC-TRUST-20/-21. REL also holds §16 PRD-17 (4.2/4.3 bridge) as interim owner (SC-37): it receives the deferred SC-36 items and adds the `since: "4.2.0"` entries (the six `./services/*` keys, `./hooks/useGlassProbes`). |
| PRD-02 (PKG) | Downstream. Consumes `scripts/ci/lib/npm-pack.js` (TRUST-002; PKG-001 extends, SC-06), owns `glass-pipeline.yml` and the scripts layout (SC-10/SC-11) from 5.0 work, owns `eslint-plugin-auraglass.js` (SC-16), replaces the 4.x side-effect gate with `scripts/ci/verify-side-effects.mjs` (PKG-042) carrying the baseline (ratchets to 0), supersedes `client-entries.json` with per-file directives, owns the root `"use client"` fix (PACKAGING-SSR-DX-03), and removes `run-{next,vite}-integration.js` on `main` (PKG-142, SC-39). |
| PRD-05 (A11Y) | Downstream. Replaces ContrastGuard (made `"unverified"` but **not deleted** here by TRUST-026; the 5.0 deletion is verified by FND-125, see §21 item 9) with the build-time contrast matrix. |
| PRD-06 (MOT) | Downstream. Replaces the 84-site patch with the `usePreference` store; owns the `auraglass/motion-no-empty-animate` rule name (REQ-MOT-64) that TRUST-045 ships first, `expectSettledVisible`, and the REQ-MOT-28 cookie-consent contract implemented here (REQ-TRUST-54). REQ-MOT-86 (FPS loops) is deferred to 4.2. |
| PRD-07/14/16 (FND) | Downstream. AC-FND-02's React 19 unit run is satisfied on 4.1.1 by REQ-TRUST-55. §16 PRD-16 (removal) server extraction may start only after AC-TRUST-17 (advisory published) and uses REQ-TRUST-45's consumer grep. |
| PRD-10 (NAV) | Downstream. E-22 regex escape shipped here (REQ-TRUST-53); E-15 deferred to 4.2; 5.0 `commandScore` stays NAV's. |
| PRD-03 (DS), PRD-08 (CTL) | Not in 4.1.1. `--glass-opacity-*` fix, `getPersona`, GlassSwitch shimmer are deferred to 4.2 (SC-36). |
| PRD-19 (QA) | Downstream. Owns artifact naming/retention (SC-07), reuses `evidenceDir()`, deletes `visual-regression.yml` on `main` (QA-119), adds `certify-release.yml` to `publish-npm.yml`, and replaces the retracted 498 certification. |
| PRD-18/20 (DX) | Downstream. Turns `verify-docs-claims.js` into generated claims and owns `llms.txt` after 4.1.1; reads root `deprecations.json` (SC-02). |
| External | npm trusted-publisher binding confirmation (owner); GitHub Security Advisory publication (owner); font licence (legal). These are `gate` entries in `tasks/TRUST.json`, not `depends_on` (SC-40 rule 3). |

---

## 20. Execution order

Each step is one PR to `main` unless noted, reviewed and merged in order; steps 3–9 can be parallel PRs once step 2 is merged. All heavy runs (integration, Storybook, Playwright, pack matrix) execute in GitHub Actions.

1. **Commit the uncommitted fix.** On branch `release/4.1.1-trust`: `git restore reports/3.2-release/vite-integration.json`; commit the 3 script diffs (REQ-TRUST-01). Open the PR so CI runs the pack path on npm 11 for the first time.
2. **Shared helper + evidence dir.** REQ-TRUST-02, -03, -05, -32 (scripts only), with `tests/ci/npm-pack.test.ts` and `tests/ci/evidence-dir.test.ts`. Add `pack-matrix` (REQ-TRUST-04).
3. **Security advisory draft + server guard.** REQ-TRUST-43 (draft file), -44, -45, -20. Hand the draft to the owner for publication immediately; publication is on the critical path for the tag.
4. **Privacy and security cuts.** REQ-TRUST-13, -14, -15, -16, -17, -18, -19 with their tests.
5. **Crash fixes.** REQ-TRUST-21, -22 (hooks; split into two PRs by directory if > 40 files changed), -23, -24, and the command-palette escape REQ-TRUST-53.
6. **Hydration + Slot.** REQ-TRUST-25, -26, -27, and the full React 19 unit leg REQ-TRUST-55.
7. **Reduced motion.** REQ-TRUST-28, -29, -30, and the cookie-consent fix REQ-TRUST-54.
8. **Lint debt decision.** Measure `lint:check` in CI after steps 4–7 (hoisting removes part of the 165); then REQ-TRUST-09 option (a) or (b), recorded; REQ-TRUST-12; fix stale snapshots REQ-TRUST-11. Pipeline Validation goes green here.
9. **Font decision.** Owner decides by 2026-10-12; implement REQ-TRUST-46 (default) or -47, plus -48, with before/after composites from the remote visual lane.
10. **Repository hygiene.** REQ-TRUST-34 (relocate inputs, verify Storybook build in CI), then -31, -33, -35, -36, -37.
11. **Claims.** REQ-TRUST-38, -39, -40, -41, -42 (release notes reference the advisory URL once published).
12. **Change-control baseline.** REQ-TRUST-49, -50, -51 generated from the build of the merged steps 1–11; commit `etc/api/*` and the root `deprecations.json`.
13. **Publish pipeline.** REQ-TRUST-06, -07, -08, -10, -52 on `publish-npm.yml` (no rename). Owner confirms the npm trusted-publisher binding names `publish-npm.yml`.
14. **Release.** Bump `version` to `4.1.1`, finalize `CHANGELOG.md`; merge; confirm Pipeline Validation green on the merge commit; confirm the advisory is published; push tag `v4.1.1`. The tag workflow publishes. Verify AC-TRUST-01 … -28, attach evidence links to the GitHub Release, amend the `v4.1.0` Release body (REQ-TRUST-40).
15. **Handoff.** Open the PRD-01 (REL) kickoff issue linking `etc/api/`, the root `deprecations.json` and the `docs/release/decisions/` records; open the §16 PRD-16 (FND) issue linking the published advisory; file each §21 open item on its owner.

---

## 21 Open items

Items from `_verification-remaining-concerns.md` (sections TRUST, MOT, NAV, FND, DS, REL, DX, PKG) and the shared contract registry. Resolved items are listed first so the concerns file can be closed against them.

**Resolved in this revision (no further action in PRD-00):**

| Concern (source) | Resolution |
|---|---|
| `deprecations.json` location `docs/` vs root (DX; REL) | Root `deprecations.json`, `version: 1` from the first commit, no v0 seed (SC-02; REQ-TRUST-51) |
| API manifest `api/` vs `etc/api/` (DX) | `etc/api/`, root slug `index`, tests in `tests/release/` (SC-04; REQ-TRUST-49/-50) |
| No `honesty` exception value (TRUST bullet 3) | `honesty` is in the SC-03 enum; ContrastGuard/`validateTextContrast` entries use it |
| Seed schema fields `reason/class/status`, kinds `attribute/asset` (REL) | Seed uses the SC-03 field set incl. `status` and `kind: asset`; no migration script needed |
| REQ-TRUST-08 guard checks only `GITHUB_ACTIONS` (REL) | Guard checks `GITHUB_WORKFLOW_REF` for `publish-npm.yml@refs/tags/v` (SC-05) |
| `release.yml` vs `publish-npm.yml`; PKG second helper `lib/pack.mjs` (TRUST bullet 4) | `publish-npm.yml` kept (SC-05); single helper `scripts/ci/lib/npm-pack.js` (SC-06, PKG already aligned) |
| `scripts/lib/evidence-dir.js` (SC-07/SC-11) | `scripts/ci/lib/evidence-dir.js` |
| `no-empty-reduced-animate` vs `motion-no-empty-animate` (SC-16) | One name, `auraglass/motion-no-empty-animate`; plugin file MODIFY |
| Cookie-consent and FPS-loop fixes not in scope (MOT) | Cookie consent accepted (REQ-TRUST-54); FPS loops deferred to 4.2 (SC-36) |
| GlassCommandPalette regex (E-22) and GlassWorkspaceTabs prop leak (E-15) (NAV) | E-22 accepted (REQ-TRUST-53); E-15 deferred to 4.2 |
| React 19 unit matrix on 4.1.1 (FND AC-FND-02) | Accepted (REQ-TRUST-55) |
| `getPersona`, `--glass-opacity-24/32/52/72` (DS) | Deferred to 4.2 (SC-36); DS retargets |

**Open (owner and how to close):**

| # | Item | Owner | How to close |
|---|---|---|---|
| 1 | PRD-01 (REL) still says the 4.1.1 release.yml/API baseline/`deprecations.json` are built "jointly", describes a `schemaVersion: 0` seed and an "empty-but-valid" file, and omits `honesty` in §4.3 / REQ-REL-05 | REL | Apply the SC-02/SC-03/SC-04/SC-05 "Must change" rows in `AURAGLASS_RELEASE_MIGRATION_PRD.md` and REL tasks; REL depends on TRUST-071/072/075/077/079 |
| 2 | QA PRD and QA-096 still name `release.yml` | QA | SC-05 Must change; retarget to `publish-npm.yml` |
| 3 | 2 stale-snapshot suites, the c07fd7111 fill `0.12 → 0.018` claim, the 165 `lint:check` errors and the count of rules-of-hooks violations beyond the 109 regex hits are unmeasured (nothing heavy runs on the Mac) | TRUST | TRUST-047 measures in CI on `main` and records counts and the run URL in `docs/release/decisions/4.1.1-lint-scope.md`; TRUST-052 records the snapshot diff review |
| 4 | §16 budgets for depth-1 clone (~2 GB → ≤200 MB) and tarball size (REQ-TRUST-46) are estimates | TRUST | TRUST-083 measures on the release-candidate SHA in CI and edits §16 with measured values before the tag |
| 5 | `exception` values and the REQ-TRUST-15 side-effect baseline (soundDesign capture-phase listeners, PKG E-06) cannot be validated until REL's schema and PKG's import gate exist | REL (REL-010), PKG (PKG-042) | The seed test switches to `docs/schemas/deprecations.schema.json` when REL-010 lands; PKG-042 imports `scripts/ci/import-side-effects-baseline.json` as its starting ratchet |
| 6 | npm trusted-publisher binding for `publish-npm.yml` must be confirmed on npmjs.com | Repository owner (operator) | Owner comments on the release issue; TRUST-084 `gate` field. Agents do not change npm access settings |
| 7 | GitHub Security Advisory publication before the tag (D-30) | Repository owner | Owner publishes the TRUST-011/012 draft; AC-TRUST-17 |
| 8 | Aeonik licence decision by 2026-10-12 (D-31) | Owner / legal | Recorded by TRUST-055; default REQ-TRUST-46 if no written licence |
| 9 | SC-39 lists TRUST-026 as the *remover* of `ContrastGuard.tsx`, but 4.1.1 only makes it `"unverified"` (no export removal in a patch, REQ-TRUST-52) | REL (registry) | Amend SC-39: remover is FND (§16 PRD-16, 5.0); TRUST-026 is the 4.1.1 honesty cut |
| 10 | SC-02 says the `./deprecations.json` exports key arrives in 4.2 (C-E); PKG §4.2 must add it to `build/exports.manifest.json` | PKG, REL | PKG adds the row for 4.2; 4.1.1 ships the file via `files` only |
| 11 | REQ-TRUST-55 adds a jest setup spy in the 4.x `jest.config.js`, a file QA owns on `main` (OV-22) | QA | QA-003 carries the `element.ref` spy forward or drops it after React 18 support ends |
| 12 | Owners of deferred items must retarget them to 4.2: MOT REQ-MOT-86, NAV E-15, DS opacity/`getPersona`, CTL GlassSwitch shimmer; REL adds the 2 D-28 entries | MOT, NAV, DS, CTL, REL | SC-36 Must change rows in each PRD |
| 13 | The SC-40 task-graph validator `scripts/release/verify-task-graph.mjs` does not exist yet, so `tasks/TRUST.json` cross-references were checked by a one-off script only | REL | REL builds the validator; TRUST.json must pass it unchanged |
