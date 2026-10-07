# AuraGlass 5.0 PRD: Quality, Certification and Showcase (QUAL)

| Field | Value |
|---|---|
| PRD id | **PRD-5** |
| Key | **QUAL** (path key `qual`; task ids `QUAL-NNN`; requirements `REQ-QUAL-NN`; acceptance `AC-QUAL-NN`) |
| Status | **Draft** |
| Date / baseline | 2026-10-06; `aura-glass` 4.1.0 at `15b6de6f7` |
| Contract | `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen). This PRD codes and tests only against it. Where this PRD and the contract disagree, the contract wins (contract §1.4) |
| Sources (archived, consolidated) | `archive/v1-19-prd/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (REQ-QA-01..81, 53 REQs), `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` (REQ-SB-01..57, 48 REQs), `AURAGLASS_PERFORMANCE_PRD.md` (REQ-PERF-01..39, 39 REQs); all 140 are mapped or dropped with a reason in Appendix A; archived `_shared-contracts.md` (SC-07, -09, -15, -16, -21, -28..31) and `_completeness-review.md`; task fragments `archive/v1-19-prd/tasks/{QA,SB,PERF}.json`. Old → new mapping: Appendix A |
| Evidence | `AURAGLASS_CURRENT_STATE_AUTOPSY.md` (C14, TD-31); `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md` §3 item 8, §4.2 pixel gates; `AURAGLASS_MISSING_CAPABILITY_MAP.md`; `autopsy/{qa-certification,storybook-showcase,performance,runtime-remote,visual-quality}.md`; `autopsy/remote-evidence/{metrics,analysis,pixel-diff}.json`; `component-inventory.json` |
| Decisions consumed | D-04/D-05 (tier vocabulary; enhanced Chromium-only, opt-in), D-07 (thickness → blur), D-08 (content layer has no backdrop), D-09 (no production downgrade; budgets held by design, dev warning, certification), D-10 (tier/engine pre-paint; 1×1 probe only in certification), D-11 (OS signals are floors), D-12, D-14 (no `Glass` prefix), D-16 (labs outside core Storybook), D-24 (zero `!important`), D-26 (calibrate at first real pre-release, ratchet down only), D-27 (visible pixel change is breaking on maintenance lines), D-32 (evidence is CI artifacts, never committed; claims generated) |
| Seams provided | S-40 (test helpers), S-41 (story metadata), S-42 (scenes), S-43 (lanes, `qual:*` job names), S-44 runtime half (perf budgets), S-48 (evidence), S-51 (docs blocks), S-55 (report artifacts) |
| Seams consumed | S-01..S-06, S-10..S-13, S-20..S-26, S-30..S-35, S-36, S-38, S-39, S-44 bytes half, S-45, S-46, S-47, S-49, S-50, S-52, S-53, S-54 (§19) |
| Depends on | **No PRD and no task of another stream.** Only frozen contract seams (§19, §21) |

---

## 1. Problem

AuraGlass 4.1.0 claims "498 visual targets certified green" (`RELEASE_NOTES_4.1.0.md:3,7,18`). The claim cannot be reproduced, the certification stack cannot fail on visual grounds, the showcase hides the material, and nothing measures performance:

1. **The headline is stale and inflated.** The repo's own verifier `scripts/audit/verify-visual-evidence.js` reports FAIL, 0/498 at HEAD (run-manifest hashes no longer match; 28 recipe entries lack identity fields). 498 = 470 + 28 hard-coded (`tests/visual/design-system/token-purity-layout-audit.spec.ts:206-211`); 470 includes 11 aliases, 7 heuristic `coveredBy` and ~44 providers; 79 evidence directories are byte-identical PNGs (QA-CERTIFICATION-01, -05, -07).
2. **Certification measures DOM presence, not material.** The 356-story certification passes any story rendering >10 px with a `glass` class or an `<svg>`, drops warnings and passed a story that threw `pageerror` (`scripts/audit/storybook-visual-certification.mjs:296-334`). The global decorator itself supplies the `glass` class (`.storybook/StorySurface.tsx:90`), and `themesInspected` is a literal (QA-CERTIFICATION-04, STORYBOOK-SHOWCASE-01, -03).
3. **Glass is always shot over nothing.** An opaque near-white stage wraps every story (`.storybook/StorySurface.tsx:88-96`): 351/356 shots have mean luminance >200, 0 are dark. With the stage removed and black behind: 266/342 text runs fail WCAG (median 1.92:1); tint adapts in 0/84 pairs; the glass interior changes 0.000 of its pixels when the background changes; `prefers-contrast: more` is a 0.0% no-op on 12/12 stories (runtime-remote §1, §3).
4. **No regression detection and no real gate in CI.** `visual-baselines/` is empty, snapshots are darwin-only and git-ignored, the app-chrome job never compares, and no workflow runs the 759-file Jest suite or the visual specs; `design-system-compliance.yml` passes at a 60/100 "score" (QA-CERTIFICATION-02, -03, -09).
5. **Tests cannot fail.** ~355 generated test files assert `expect(container).toBeInTheDocument()` and other vacuous patterns; coverage 38.46% vs 33%, enforced nowhere (QA-CERTIFICATION-06, -10).
6. **The showcase misrepresents the product.** 24 `!important` overrides in the flagship showcase, a state matrix with zero library imports, six "App Shell" stories that alias one, 128 Default/Variants stubs, version-named sidebar groups, and an inverted story budget (Effects + Advanced 24.4% of stories) (STORYBOOK-SHOWCASE-04..07, -10, -14, -15).
7. **Performance is ungated.** Modal 12 fps, dialog 13–14, app shells 19–23 fps on remote Chromium, with 12–29 visible backdrop filters, nesting depth 4, 40 px blur and 4 infinite animations; uncancellable FPS rAF loops and global `mousemove` handlers run by default; the only size gate allows 1.7 MB for one button (runtime-remote §5; PERFORMANCE-03..08, -15).

5.0 promises "a material that is legible and performant over any content, in every engine and preference." This stream owns the system that proves it: lanes that fail closed, run remotely on GitLab CI, measure pixels and behaviour on the exact SHA, leave artifacts (never commits), and a Storybook that shows the material over real scenes, built only from public entries.

---

## 2. Evidence from the current codebase

All figures re-checked at `15b6de6f7` against the autopsy adversarial tables; PARTIAL verdicts are used with their corrected numbers. No screenshot was viewed; every visual statement is measured.

| # | Finding (verdict) | Evidence | Drives |
|---|---|---|---|
| E1 | Verifier FAIL 0/498; provenance hashes stale (QA-CERTIFICATION-01) | `reports/audit/visual-all/visual-summary.md:3-15` | REQ-QUAL-60..62 |
| E2 | 498 hard-coded; inflated by aliases, providers, duplicates (QA-05, -07) | `token-purity-layout-audit.spec.ts:206-211,2294-2306`; `scripts/audit/public-export-audit.js:318-324` | REQ-QUAL-01..03 |
| E3 | 356 certification is a smoke test; decorator supplies the pass (QA-04; SB-01, -03) | `storybook-visual-certification.mjs:41-151,223,296-334,344`; `.storybook/preview.tsx:185-197` | REQ-QUAL-05, -09 |
| E4 | White stage, 0 dark shots; 0.000 interior change; contrast-more no-op 12/12 (SB-02; runtime-remote §1, §3) | `.storybook/StorySurface.tsx:88-96`; `remote-evidence/pixel-diff.json` | REQ-QUAL-07..09, -13..16 |
| E5 | 3.2 App Shell ink rgba(0,0,0,.9) on rgb(13,31,43) = 1.12–2.14:1 | `remote-evidence/analysis.json` | REQ-QUAL-13, -58 |
| E6 | Forced colors leaves 12→12 backdrop filters on the showcase | `src/styles/glass.css:4073` | REQ-QUAL-16, -43 |
| E7 | No baselines; `toHaveScreenshot` `maxDiffPixels: 1000`; wrong upload path (QA-03) | `playwright.config.ts:123-128`; `.github/workflows/visual-regression.yml:42,49`; `.gitignore:170` | REQ-QUAL-24..26 |
| E8 | No CI runs Jest/visual/evidence; score-based compliance (QA-02, -09) | `.github/workflows/publish-npm.yml:55-65`; `design-system-compliance.yml:174-180`; `scripts/verify-glass-pipeline.js:356,367` | REQ-QUAL-27..31, -64 |
| E9 | 355 templated tests; coverage unenforced (QA-06, -10) | `src/components/input/GlassSlider.test.tsx:58-96`; `jest.config.js:79-90` | REQ-QUAL-30, -31 |
| E10 | Story-supplied glass: 27 story files / 49 `backdrop-filter`; 34 files with `!important`; 948 inline hex | `rg` over `src -g '*.stories.tsx'` | REQ-QUAL-55 |
| E11 | 128 stub titles; 12 text galleries; version groups; 6 aliased shells (SB-06, -07, -10, -15) | `src/stories/AppShell.stories.tsx:1-33`; `preview.tsx:137-154` | REQ-QUAL-49, -58 |
| E12 | Deprecated test packages (`@storybook/jest`, `@storybook/testing-library`, alpha `@storybook/test`); 7 `play` functions in 1,598 stories (SB-13) | `package.json:326-328,433-437` | REQ-QUAL-57 |
| E13 | `storybook-static/` untracked, stale (mtime 2026-09-05), read by tooling | `.gitignore:87`; `scripts/visual-test-runner.js:109` | REQ-QUAL-56 |
| E14 | Remote perf: modal 12 fps / 12 visible filters / 49 long tasks; shells 19–23 fps / 29 filters / nesting 4; state matrix 55 fps with 51 small filters | `remote-evidence/metrics.json` (372 records, Chromium 141, software raster) | REQ-QUAL-34..41 |
| E15 | Count alone does not predict cost; cost tracks blurred area × radius × invalidation | E14 rows | REQ-QUAL-36 (BCI) |
| E16 | Idle cost: rAF loops on by default, 161 rAF calls (72 ungated), 61 pointer listeners, 99 CSS `infinite`, permanent `will-change`, `translateZ(0)`, `transition: all` | `src/hooks/useEnhancedPerformance.ts:49,70-88`; `src/tokens/glass.ts:1034-1036`; `GlassTabBar.module.css:98-104` | REQ-QUAL-42..46 |
| E17 | Remote runner egress CA expired 2026-09-27; no SSM/NAT; offline bundle + S3 worked | runtime-remote "Runs" | REQ-QUAL-67 |

**Kept, not rebuilt:** the token-purity measurement layer (`token-purity-layout-audit.spec.ts:852-2232`) and its 10 detector fixtures (`:3930-4128`); provenance binding in `verify-visual-evidence.js`; the runtime-remote method (stage removal, forced backgrounds, text-hidden twin sampling, rAF FPS under scripted input); the "incomplete language" guard (`storybook-visual-certification.mjs:390-426`); `IconsGallery` (renders real icons). On `next` all of these are under `legacy/**` after C0-10 (contract §3.1a): QUAL **reads and ports** them, never imports them.

---

## 3. Desired end state

At 5.0.0 GA, on one SHA of `next`:

1. **14 lanes L1–L14 exist and fail closed at release scope**, run by `certification/run.mjs` from `ci/qual.gitlab-ci.yml` on GitLab SaaS runners. Each lane reports `pass | fail | pending | double-pass | pre-existing` per subject (contract §6.1); `qual:certify:release` writes `ReleaseVerdict` with `ga: true` only when every G-01..G-16 item passes.
2. **Subjects are discovered, never listed.** Subjects come from `parameters.ag.subject` (S-41), `ComponentMeta` (S-31) and `ENTRIES` (S-35). Adding a component's meta and story grows every lane with no edit under `certification/`. No count literal exists.
3. **Glass is always tested over something:** 8 licensed scenes, a cert mode with no painting ancestor, a glass-over-nothing detector, OCR text contrast on rendered pixels in three engines.
4. **Regressions are visible and approved by humans:** element-cropped Linux baselines, strict diffs, `VisualClassReport` for PLAT's change class, L14 review on every baseline refresh.
5. **Performance is graded:** remote harness, BCI, A–F grades per component, `PerfReport` artifact, default ceilings plus each owner's stricter `perf-budgets` rows, calibrated once (D-26) and ratcheted down.
6. **Storybook is the Material Lab:** flagship-first IA, scene global (default `photo`), Material Lab pages, generated docs pages from meta, ten public-API showcases (six certified product scenes S1, four showcase scenes S2), zero story-supplied glass, built per SHA and published by PLAT's `pages` job.
7. **Every stream tests on day 0** against QUAL's seeds: `tests/helpers` (S-40), `tests/a11y/apg/harness.ts`, `.storybook/preview.tsx`, `.storybook/blocks`, and the contract conformance suite `tests/contract/**`.
8. **Nothing heavy runs on a developer Mac** and no evidence is ever committed.

---

## 4. Architecture

### 4.1 Layout (every path is a QUAL glob in contract §3.2)

```text
packages/qa/                 F01  private "@auraglass/qa" (never published)
  src/inventory/             subjects from ENTRIES (S-35) + **/*.meta.ts (S-31) + @nonvisual
  src/resolve/               the one subject resolver (parameters.ag.subject, SubjectIndex)
  src/inspect/               ported 4.x measurement (computed style, composited contrast, census, layout)
  src/pixel/                 notBlank, separation, frameFill, density, neon, intentDeltaE, containment, materialPresence, dhash
  src/ocr/                   tesseract CLI wrapper, text-hidden twin, per-word contrast
  src/matrix/                axes, prune, force, shard
  src/perf/                  BCI, grade formula, budget resolution (defaults + fragments/perf-budgets/*)
  src/evidence/              lane manifest, verifier, composites, claims, ReleaseVerdict, VisualClassReport, PerfReport
  src/deliverables/          G-04 flagship deliverables check (replaces scripts/ci/verify-flagship-deliverables.mjs)
  fixtures/                  one positive + one negative fixture per detector
certification/               F08
  run.mjs                    LANE_COMMAND entry: --lane L1..L12|all --scope pr|main|nightly|release [--verdict]
  lanes.config.ts            built-in QUAL lanes + loadFragments('lanes') (S-43, S-50)
  playwright.cert.config.ts  QUAL content; appends fragments/playwright/*.json projects named <stream>:cert-*
  lanes/*.spec.ts            environment-visual, preference-modes, regression, engine, behaviour, motion, cost, perf, canaries, console, known-failures
  scenes/                    8 assets + scenes.manifest.json + scene stories (S-42; served at /scenes)
  thresholds.json  ratchets.json  exemptions.json  console-allowlist.json  calibration.json
  baselines/linux/<engine>/  committed element-cropped L7 baselines (size-capped)
  review/                    SR matrix template, L14 rubric, composite layout
  runner/                    shard planner, AWS offline bundle, preflight, worker entry
  RELEASE_CHECKLIST.md       G-01..G-16 (contract §6.2)
.storybook/                  B09/B10  main.ts (globs verbatim), preview.tsx, blocks/, lab/, environment/, contract/
stories/qual/                A16  Start Here, Foundations index, perf fixtures, Material Lab index
showcase/<id>/               F07  ten showcases (public entries + registry block sources only)
tests/contract/  tests/helpers/  tests/a11y/apg/harness.ts  tests/a11y/browser/  tests/storybook/  tests/showcase/   D01
tests/perf/**  tests/visual/**  tests/e2e/**  tests/fixtures/** (not consumer-4x)   D05 (QUAL's own specs under tests/<kind>/qual/)
scripts/storybook/  scripts/audit/  scripts/qual/            E02/E03
lint/rules/qual/             A15  six perf rules (contract §4.11)
fragments/*/qual.*           A12  QUAL's own lanes, playwright projects, perf-budgets, review, a11y-baseline, literals-baseline
ci/qual.gitlab-ci.yml, ci/qual/**   A20  QUAL's GitLab CI fragment
jest.config.js  playwright.config.ts (verbatim), tsconfig.storybook.json, stylelint.showcase.config.mjs, __mocks__/**   B03/B06/B08
docs/certification/**        B19  certification guide
```

### 4.2 Lanes (contract `LANES`, `CERT_JOBS`)

| Lane | QUAL implements | Discovered from other streams (never edited by QUAL) | Runner template | PR / main / nightly / release |
|---|---|---|---|---|
| L1 Static | `npm run lint` (all `auraglass/*` rules, §4.11 rollout), story-glass gate (REQ-QUAL-55), CSS perf gate (REQ-QUAL-44), dist scans (REQ-QUAL-46), vacuous-assertion gate (REQ-QUAL-31), no-committed-evidence guard | F `lanes` `node-script` rows (e.g. MAT literals, optics, undefined vars; PLAT dist purity) | `.ag-node` | ✓ / ✓ / ✓ / ✓ |
| L2 Artifact | tarball-input plumbing, node cold import (REQ-QUAL-47) | PLAT size, side-effect, publint/attw, allowlist gates via F `lanes` | `.ag-node` | ✓ / ✓ / ✓ (+4.x tarball) / ✓ |
| L3 Change class | runs registered gates; supplies `VisualClassReport` (REQ-QUAL-26) | PLAT `plat:gate:change-class` inputs; F `deprecations`, `codemods` | `.ag-node` | ✓ / ✓ / ✓ / ✓ |
| L4 Token contrast | runs registered jest/node rows | MAT contrast matrices (`tests/tokens/**`, `tests/a11y/**`) | `.ag-node` | ✓ (never path-filtered) / ✓ / ✓ / ✓ |
| L5 Behaviour | APG harness, axe spec, SSR/hydration, overlay stacking (REQ-QUAL-19..21) | `tests/a11y/apg/<stream>/**`, `tests/e2e/<stream>/**`, F `playwright` | `.ag-playwright` | affected+sentinel / all / all ×8 scenes / all |
| L6 Environment visual | capture driver, pixel gates, OCR (REQ-QUAL-12..18) | subjects from S-41/S-31 | `.ag-playwright` (sharded) | reduced / full T2-reduced / full / full |
| L7 Pixel regression | baselines, diff, `VisualClassReport` (REQ-QUAL-24..26) | — | `.ag-playwright` | ✓ / ✓ / ✓ ×2 flake check / ✓ |
| L8 Engine-specific | REQ-QUAL-22 | — | `.ag-playwright` | affected / all / all / all |
| L9 Motion | REQ-QUAL-23 | MAT motion specs via F `lanes` | `.ag-playwright` | affected / all / all / all |
| L10 Performance | harness, grades, budgets (REQ-QUAL-34..43) | `tests/perf/browser/<stream>/**`, F `perf-budgets` | `.ag-playwright` (b, c, d), `.ag-gpu` (a), `.ag-aws-remote` (devices) | ratchet (GPU) / ✓ / full / full |
| L11 Consumer canaries | lane driver, 3-engine smoke (REQ-QUAL-29) | `canaries/**` (PLAT, per-stream pages B23a), `tests/fixtures/consumer-4x/**` | `.ag-playwright` | when `package.json`/entries change / ✓ / ✓ / ✓ |
| L12 Unit | coverage floors (REQ-QUAL-30) | every `*.test.ts(x)` by location (`jest.config.js` verbatim) | `.ag-node` | ✓ / ✓ / ✓ / ✓ |
| L13 Manual SR | template + aggregation (REQ-QUAL-72) | `tests/a11y/manual/records/<stream>/**` | release artifact | — / — / dashboard / ✓ |
| L14 Human visual review | composites + rubric (REQ-QUAL-73) | F `review` | release artifact | baseline refresh PRs / — / — / ✓ |

**Lane states** (contract §6.1): `pass`, `fail`, `pending` (seed, stub, or not merged), `double-pass` (passes only against a contract double), `pre-existing` (failing paths not owned by the PR's stream, computed from `contracts/ownership.json`). Only `fail` on the PR stream's own paths blocks a PR. At `release` scope `pending`, `double-pass` and `pre-existing` are all **not pass** (G-01).

### 4.3 Environment matrix

Axes (architecture §15.1): engine {chromium, webkit, firefox} × scene (8, S-42) × scheme {light, dark} × transparency {glass, tinted, solid} × preference {default, contrast-more, forced-colors, reduced-motion} × tier {lightweight, standard, enhanced} × viewport {1440×900 DPR 1, 390×844 DPR 3 touch}. Pruning by rule: forced-colors ⇒ lightweight + solid, only in engines whose emulation reads back true (REQ-QUAL-17); solid ⇒ lightweight; enhanced ⇒ chromium ∧ glass ∧ motion ≠ none ∧ `ComponentMeta.material.refractionEligible` ∧ preference default. State is forced with `data-ag-*` on `<html>` (S-01 values) plus Playwright `emulateMedia` (`colorScheme`, `reducedMotion`, `forcedColors`, `contrast`); no runtime heuristic picks a baseline (D-10).

| Subject set | Cells per subject-state |
|---|---|
| T0 `Surface` × {regular, clear, identity, content-raised} × {thin, regular, thick} (12 subjects) | 96 core + 52 preference + 32 enhanced = **180** |
| Flagship (44, every `ComponentMeta.states` entry) and T0 `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame` | 96 + 52 = **148** (+32 if refraction-eligible) |
| T2 core (~40) | {chromium, webkit} × {photo, flat-white, flat-black} × 2 × 2 = 24 + 5 preference = **29** |
| Product scenes (6 S1 showcases) | 3 × 8 × 2 × 2 = **96** |
| S2 showcases (4) | T2 reduced = **29** |
| PR reduced (affected subjects + sentinel) | {chromium, webkit} × {photo, flat-black, dense-text} × 2 × {1440, 390} = **24** |

Release estimate ≈33,000 cells ≈99,000 captures (cell, text-hidden twin, surface-hidden). Shard count is computed: `shards = ceil(captures ÷ (measuredRate × 3,600))`, so each shard captures ≤60 min within the 90-minute release budget; the measured rate per runner tag is recorded in every lane manifest (runtime-remote: 1.26 captures/s on r7i.8xlarge software raster; GitLab `saas-linux-large-amd64` rate is measured at the first nightly).

### 4.4 Mechanical vs human

| Property | Mechanical (lane) | Human (lane) |
|---|---|---|
| Rendered, not blank; distinct from scene; glass over something | L6 | — |
| Text legible on pixels; contrast floors by construction | L6 OCR; L4 | — |
| Blur budget, BCI, nesting | L6 cost, L10 | — |
| Preference modes change something | L6 | whether they look designed (L14) |
| Regression vs approved render | L7 | approving any change (L14) |
| Keyboard, ARIA, focus order, axe | L5 | announcement quality (L13) |
| Screen-reader experience | — | L13 |
| Motion timing, idle, final state | L9 | easing feel (L14) |
| Specular quality, optical hierarchy, radius rhythm, "one hand" | — | L14 |
| Frame time, grades | L10 | — |

### 4.5 Storybook model

- **Preview** (`.storybook/preview.tsx`, QUAL; frozen global names/values, contract §4.11): globals `scheme`, `contrast`, `transparency`, `motion`, `density`, `tier`, `scene`. One decorator: `AuraGlassProvider` (S-22) driven by the globals → `Environment` (S-06) painting the selected scene (`SCENE_BACKDROP`, S-42) → `StoryRoot` (`[data-ag-story-content][data-ag-story-kind]`). `parameters.ag.kind` selects framing: `matrix` renders `meta.variants × meta.states` from the subject's `ComponentMeta`; `lab` wraps in the Material Lab frame; `scene`/`showcase` render full-bleed. Stories import nothing from `.storybook/**` (S-41); MDX may import only `.storybook/blocks/index.tsx` (S-51).
- **Cert mode** is the iframe query parameter `ag-cert=1` (read by the preview; not a global, so the frozen global set is untouched). `gotoStory` (S-40) sets it.
- **IA**: `Start Here` → `Material Lab` → `Scenes` → `Showcases` → `Flagships` (`Controls`, `Overlays`, `App Shell`, `Data`, `AI`, `Media`) → `Core` → `Foundations` → `Migration`.
- **Material Lab** stories live under `.storybook/lab/**` (main.ts glob) and are QUAL's; they compose MAT's public `Surface` family (S-05/S-06) only.
- **Showcases** live in `showcase/<id>/` and compose the owner's registry block sources `registry/blocks/<id>/{index.tsx,fixtures.ts}` (contract §3.3) or public entries; while a block is empty they render `ShowcasePending` tagged `no-cert` (contract §5.3).

### 4.6 Perf model

Three cost planes: **import** (bytes: PLAT's L2 size gates over `fragments/size-budgets/*`; QUAL measures Node cold import), **render** (blurred area × radius × layers; QUAL's L6 cost and L10), **idle** (rAF, intervals, listeners, infinite animations; QUAL lint + L9/L10 settled probe). No plane is enforced by production runtime code (D-09). Runtime budgets resolve as: **QUAL default ceilings** (`certification/thresholds.json#perf`, REQ-QUAL-38) → overridden only downward by each owner's `fragments/perf-budgets/<stream>.ts` rows (`PerfBudgetRow`, S-44) → frozen at calibration (REQ-QUAL-39). The generated aggregate `tests/perf/harness/budgets.json` is git-ignored.

**Blur Cost Index** (certification-only metric): `BCI = Σ over visible elements with computed backdrop-filter ≠ none (incl. ::before) of (visibleArea / viewportArea) × (blurPx / 20)`. A full-viewport 20 px surface = 1.0; a 12 px scrim = 0.6; the 4.1 modal ≥ 2.4.

### 4.7 CI on GitLab

`ci/qual.gitlab-ci.yml` (QUAL-owned on both branches; jobs only on the `5x` line) extends the root templates of contract §4.13.3. GitHub stays the git source of truth; pipelines run on mirrored branch and tag pushes (no MR pipelines). No QUAL job holds a GitHub, npm or cloud credential (`.ag-aws-remote` jobs use only the registered runner's instance role). Evidence is GitLab job artifacts under `.artifacts/qual/<job-slug>/` with `expire_in` per `EVIDENCE.expireIn` (S-48). Storybook and the Lab reach the public site through PLAT's `pages` job, which consumes the `qual:build:storybook` artifact through an `optional: true` need (contract §4.13.6).

---

## 5. Exact implementation requirements

Each requirement names its verifying test (§12). "Fails" means the job exits non-zero. Thresholds live in `certification/thresholds.json` (key in parentheses); a threshold change is a QUAL PR reviewed by the design reviewer (CODEOWNERS on `certification/thresholds.json`).

### 5.1 Subjects and lanes

- **REQ-QUAL-01 One subject resolver.** `packages/qa/src/resolve/resolveSubject.ts` is the only code mapping a subject to story ids. It reads `parameters.ag.subject` (S-41) through the `SubjectIndex` that `scripts/storybook/write-cert-manifest.mjs` writes to `storybook-static/cert-manifest.json` (`REPORTS.subjects`, S-55) at every `storybook:build`, cross-checked against `storybook-static/index.json`. No fuzzy matching exists; a story whose `subject` resolves to no `ComponentMeta.name` or showcase id, or a manifest id missing from `index.json` (or vice versa for kinds `lab`, `scene`, `showcase`, `matrix`), fails. Test: `packages/qa/test/resolve.test.ts`.
- **REQ-QUAL-02 Source-derived inventory.** `packages/qa/src/inventory/buildInventory.ts` enumerates every value export of every `ENTRIES` row (S-35) and classifies it `visual` (has a `ComponentMeta` with `tier` T0/T1/T2), `alias` (re-export of another export), or `nonvisual` (JSDoc `@nonvisual` on the export, or a hook/provider/type). Unclassified exports fail `unclassified-export`. No count literal exists: a test greps `packages/qa/**` and `certification/**` for `/\b(470|498|356)\b/` and fails on a match. Test: `packages/qa/test/inventory.test.ts`.
- **REQ-QUAL-03 Distinctness.** Captures of different subjects in the same cell with dHash Hamming ≤2 **and** pixel diff ratio <0.001 are `duplicate-visual`; a `visual` subject duplicating another in ≥90% of cells fails unless classified `alias`. Test: `packages/qa/test/dhash-duplicates.test.ts`.
- **REQ-QUAL-04 Live subjects only.** Registry blocks (`registry/blocks/<id>/index.tsx`) and showcases are rendered live from the packed tarball (`AURAGLASS_TARBALL`, S-48) as subjects; no lane reads another job's screenshots or computed-style JSON as proof. Test: `certification/lanes/environment-visual.spec.ts` asserts every capture's `sourceStoryId` exists in the same pipeline's `index.json`.
- **REQ-QUAL-05 Lane runner and registry.** `certification/run.mjs --lane <L1..L12|all> --scope <pr|main|nightly|release> [--verdict <path>]` (exactly `LANE_COMMAND`, S-43) loads `certification/lanes.config.ts` = QUAL's built-in lanes + `loadFragments('lanes')` (S-50). For each `LaneRegistration` it runs `kind` `node-script` (`node <path>`), `jest` (`npm test -- <path>`), `playwright` (`certification/playwright.cert.config.ts` filtered to `<path>`), `story-subjects` (subjects from `<path>` glob of stories) or `manual-record` (artifact presence), at the registration's `scope`; a registration with `remote: false` for a browser kind is rejected. It writes `.artifacts/qual/<job-slug>/lane-manifest.json` = `{ lane, sha, scope, runnerTag, imageDigest, browserVersions, subjects[], cells[], results[] (state per subject), thresholdsSha256, scenesSha256, inventorySha256, durationMs, captureRate }`, and computes `pre-existing` from `contracts/ownership.json` against the PR branch prefix. Test: `packages/qa/test/lane-runner.test.ts` (fixture registrations in `tests/contract-doubles/fragments/`).
- **REQ-QUAL-06 Fail closed, without waiting.** A lane that crashes, writes no manifest, produces a junit with 0 tests while it has ≥1 subject, or whose registered `path` does not exist is `fail`. A lane with 0 subjects is `pending` at `pr`/`main`/`nightly` scope and `fail` at `release` scope. No QUAL job uses `|| true`, `allow_failure` beyond the activation rule (contract §2.3), or score aggregation. Affected-subject PR lanes (L5, L6 reduced, L7, L8, L9) always add the sentinel set from `certification/matrix.config.ts` (`Surface` regular/regular; `Button` Playground; `Dialog` open), whose members are skipped as `pending` while still seeds. Test: `packages/qa/test/fail-closed.test.ts`, `packages/qa/test/ci-fragment.test.ts`.

### 5.2 Scenes, cert mode and preview

- **REQ-QUAL-07 Scenes.** `certification/scenes/` holds exactly the 8 `SCENES` ids (S-42) — `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame` (still, plus a 2 s `video-frame.webm` loop used only by L9 and the interactive view). `scenes.manifest.json` records per asset: sha256, licence (SPDX id or written grant; `photo` and `dark-media` CC0 or owned), source, width × height ≥2880×1800, mean luminance, luminance σ, the `SCENE_BACKDROP` value. Total ≤6 MB. Content bands (asserted on the files): `flat-white` mean ≥245; `flat-black` ≤12; `dark-media` ≤70; `video-frame` still ≤100; `photo` and `saturated-abstract` σ ≥40; `saturated-abstract` Hasler–Süsstrunk colourfulness ≥60; `hf-pattern` ≥30% of 8×8 blocks with ≥40-level range; `dense-text` ≥400 OCR-readable words; each served `/scenes/<file>` sha256 equals the manifest. Scenes ship only in Storybook, never in the tarball. Tests: `packages/qa/test/scenes-manifest.test.ts`, `tests/storybook/scene-bands.test.mjs`.
- **REQ-QUAL-08 Scene stories.** `certification/scenes/Scenes.stories.tsx` exports 8 stories with ids `SCENE_ASSETS.storyId(id)` (`scenes--<id>`), tag `scene`, `parameters.ag = { subject: 'scene:<id>', kind: 'scene' }`, each composing over its scene: `Surface` × {regular, clear, identity, content-raised} × {thin, regular, thick} (12 cells, ≥240×160 px at 1440, ≥160×120 at 390, 2-line label + 14 px paragraph each) plus a strip of CMP flagships at rest (`Button`, `SegmentedControl`, `Slider`, `TextField`, `Switch`, `Toast`; S-30 public exports only). Axes come only from globals so lanes force every cell by URL. Test: `tests/storybook/cert-scenes.test.ts` (8 ids; 12 `[data-ag-surface]` + 6 flagship roots; root `data-ag-backdrop` = manifest value).
- **REQ-QUAL-09 Cert mode and story root.** `StoryRoot` (`.storybook/contract/StoryRoot.tsx`) wraps story output in exactly one `[data-ag-story-content]` with `data-ag-story-kind` ∈ `StoryKind`. The decorator renders no `.glass*` class, no contrast wrapper, no skip links and nothing else that paints inside `#storybook-root`. With `ag-cert=1`: the scene is painted only by `Environment` (or `<body>` background for kind `scene`), cover/center; every ancestor between `<body>` and the subject root has computed background alpha 0, `background-image: none`, `backdrop-filter: none`, `filter: none`, `opacity: 1`; pixels outside `[data-ag-story-content]` differ from the scene by ≤0.5% of the frame. `data-ag-cert-ready` is set after `document.fonts.ready`, decoded images and two rAFs; lanes wait on it, never on sleeps. Tests: `tests/storybook/StoryRoot.test.tsx`, `certification/lanes/environment-visual.spec.ts` (ancestor and outside-pixel assertions).
- **REQ-QUAL-10 Preview.** `.storybook/preview.tsx` keeps the frozen `globalTypes` (names, values, defaults: `scheme` light, `contrast` standard, `transparency` glass, `motion` full, `density` regular, `tier` standard, `scene` photo) and has exactly one decorator: `AuraGlassProvider` (S-22) with props from the globals → `Environment` → `StoryRoot`. No `parameters.backgrounds`, no persona/preview toolbars, no forced `reducedMotion`, no story-level `data-ag-motion` write (the provider applies the OS floor, D-11). It eagerly imports `src/**/*.css` (self-layered, S-04). Test: `tests/storybook/storybook-config.test.ts` (globals deep-equal the contract; `decorators.length === 1`; no backgrounds).
- **REQ-QUAL-11 Deterministic stories.** In lanes, `page.addInitScript` stubs `Date.now`, `new Date()` (fixed epoch `2026-03-02T09:30:00Z`) and `Math.random` (seeded); overlays reach their state via `defaultOpen`/controlled `open`; streaming fixtures step by args; no story reaches its captured state through timers. Test: `tests/storybook/story-ready.test.tsx`.

### 5.3 L6 Environment visual

- **REQ-QUAL-12 Capture driver.** `certification/lanes/environment-visual.spec.ts` generates one Playwright test per (subject-state × cell) from `packages/qa/src/matrix` (§4.3 axes, pruning and cell ids `<storyId>|<scene>|<engine>|<axes>`), served from the `storybook-static/` artifact of the same pipeline (`AG_STORYBOOK_URL`), 60 s per-test timeout, `deviceScaleFactor` 1 desktop / 3 mobile set explicitly. Interactive states (`hover`, `focus-visible`, `pressed`, `open`, `type`) are produced by real input from `parameters.ag.states[].drive` (`StoryStateDrive`), marked with `data-ag-state-cell`. Test: `packages/qa/test/matrix-prune.test.ts` (cell counts equal §4.3; shard formula).
- **REQ-QUAL-13 OCR text contrast.** For every cell, tesseract 5 (system binary in the job image, version recorded in the manifest; `--psm 11`, 2× Lanczos upscale) reads the capture; for each word with confidence ≥60 the contrast between the median glyph colour and the median colour of the same box in the **text-hidden twin** (`color: transparent` on text nodes) must be ≥4.5:1 (≥3:1 when DOM font-size ≥24 px, or ≥18.66 px and weight ≥700), ≥7:1 in `contrast-more` cells, worst case across scenes per subject-state. If the subject has ≥1 visible text node, OCR word count must be >0. APCA Lc is reported, never gated. Not exemptable. Test: `packages/qa/test/ocr-contrast.test.ts`.
- **REQ-QUAL-14 Glass over nothing.** For each visible `[data-ag-surface]` with `data-ag-variant` ∈ {regular, clear} and a non-content layer, capture with only that surface `visibility:hidden`; if σ(L) of the scene region under its border box is <4 levels in a scene whose manifest σ ≥20, fail `glass-over-nothing`. In standard-tier glass cells, mean interior luminance must differ between `flat-white` and `flat-black` by ≥30 levels for `regular`, and by ≤ `(1 − floorAlpha) × 255 + 5` levels, where `floorAlpha` is the tint floor for that key read from the token manifest `dist/tokens/manifest.json` (S-11, `glass-material` entries); while the manifest has no floor for the key, that half reports `pending`. Test: `packages/qa/test/material-presence.test.ts`.
- **REQ-QUAL-15 Pixel gates.** not blank: max deviation from scene ≥40 levels (`notBlank.minDeviation`); separation: ≥25% of surface pixels differ from the surface-hidden capture by >10 levels (`separation.minShare`, `separation.minDelta`); frame fill: content box ≥3% of frame (kinds `component`, `lab`), ≥25% (`matrix`, `scene`, `showcase`) (`frameFill`); glass density: summed visible area with computed `backdrop-filter ≠ none` ÷ viewport ≤0.3 (`density.max`); neon: ≤1% of pixels with HSV S ≥0.85 ∧ V ≥0.85 and ≤3 hue families (30° bins with ≥2% share) per subject (`neon`); intent: ΔE2000 between `prominent`/`intent` fills and the default ≥10 (`intentDeltaE`); layout overlap/overflow (ported `collectLayoutIssues`). Pixel analysis runs in-page (canvas `getImageData`) or with `pixelmatch` (frozen, §4.12); no PNG-decoder dependency is added. Test: `packages/qa/test/pixel-gates.test.ts`.
- **REQ-QUAL-16 Preference modes must change something.** Versus the `default` cell (same scene, scheme, engine): `contrast-more` changes ≥0.5% of surface pixels **and** raises worst OCR contrast or reaches ≥7:1; `tinted` lowers σ(interior) ÷ σ(scene under it) by ≥25%; `solid` and `forced-colors` yield 0 elements with computed `backdrop-filter ≠ none` (including `::before`) inside the subject; a 0.000 delta fails `preference-noop`. Test: `certification/lanes/preference-modes.spec.ts`.
- **REQ-QUAL-17 Console hygiene and labels from pixels.** Any `pageerror` or `console.error` in any cell fails; `console.warn` fails unless it matches `certification/console-allowlist.json` (regex, owner stream, expiry ≤90 days; not exemptable otherwise). Every result field naming scheme, preference, engine, tier or transparency is read back from the page (`documentElement.dataset`, `matchMedia`, user agent), never copied from the request; a mismatch fails `label-mismatch`, including forced-colors emulation that silently did nothing. Tests: `certification/lanes/console.spec.ts`, `packages/qa/test/labels.test.ts`.
- **REQ-QUAL-18 Layout, focus and touch.** At 390×844 with every ancestor `overflow-x` clipping disabled: `scrollWidth ≤ clientWidth + 1` on `[data-ag-story-content]` and no subject pixel touches the right edge. Interactive elements in mobile cells have hit boxes ≥44×44 CSS px (≥24×24 with spacing when `ComponentMeta.variants.size` includes `sm` and the story declares it). In `focus-visible` cells the focus indicator region has ≥3:1 against adjacent pixels on every scene (WCAG 2.4.11/1.4.11). Product scenes additionally run at 768×1024 for layout gates only. Test: `certification/lanes/environment-visual.spec.ts` (containment, target, focus suites).

### 5.4 L5 Behaviour, L8 Engine, L9 Motion

- **REQ-QUAL-19 Behaviour lane.** L5 runs, through `certification/playwright.cert.config.ts` projects in chromium, webkit and firefox, every `tests/a11y/apg/<stream>/**/*.apg.spec.ts` and `tests/e2e/<stream>/**/*.spec.ts` (discovered by location and F `playwright`), plus `certification/lanes/behaviour.spec.ts`, QUAL's axe spec over every subject-state from `listSubjects()` in `photo` and `flat-white`, light and dark, with `color-contrast` **on**: impact `serious`/`critical` fails, `moderate` fails for flagships. Nightly and release: the same axe run in all 8 scenes, chromium and webkit. Emulates `forcedColors: 'active'`, `contrast: 'more'`, `reducedMotion: 'reduce'` and `data-ag-transparency="solid"` (reduced transparency is forced by attribute). A flagship (`ComponentMeta.flagship` set) with no APG spec under its owner's directory is `pending` before RC-1 and `fail` at release scope. Storybook `play` functions are not the mechanism. Test: `certification/lanes/behaviour.spec.ts` self-run against `tests/contract-doubles/cmp/*` stories (`double-pass` recorded).
- **REQ-QUAL-20 APG harness and axe spec (S-40).** `tests/a11y/apg/harness.ts` implements `ApgHarness.keyboard(page, steps)` (press/type, `expectFocus` by `data-ag-part` or `role=<role>[name=…]`, `expectState`, `expectAnnounced` against the S-26 announcer regions) and `ApgHarness.axe(page, { colorContrast })` over `@axe-core/playwright@4.13.0`; `tests/a11y/browser/axe.spec.ts` iterates `listSubjects()`. Its self-test `tests/a11y/apg/__selftest__/harness.selftest.spec.ts` drives a fixture page and asserts each step type passes and fails as designed. A failure names the step index and the expected/actual value.
- **REQ-QUAL-21 SSR, hydration, overlay stacking.** For every flagship subject: `renderAgServer` (`react-dom/server`) then `hydrateRoot` in each engine produces 0 console warnings/errors, 0 mutations of `<html>` `data-ag-*` after `AuraGlassScript`, 0 React commits in the first 1 s without input (React `<Profiler>` on the `react-dom/profiling` build), and 0 `className`/`data-ag-tier` mutations on `[data-ag-surface]`. Stacked overlays (`Dialog` → `Menu` → `Tooltip`, from the overlay-flows story where present) close LIFO on Escape and computed z-order follows the layer stack (S-25). Tests: `certification/lanes/ssr-hydration.spec.ts`, `certification/lanes/overlay-stacking.spec.ts`.
- **REQ-QUAL-22 Engine-specific (L8).** WebKit: a 32×32 CSS-px probe inside each standard-tier surface interior (≥8 px from edges and text rects) over `hf-pattern` shows σ(L) reduced ≥60% vs the surface-hidden capture (literal `-webkit-backdrop-filter` applied). Gecko: subjects with `refraction` capture equal to the `standard` capture within diff ratio 0.001 (lens inert, never blank) and 0 `url()` backdrop values apply. Chromium enhanced: the `data-ag-part="bezel"` rectangle intersects 0 text client rects. Test: `certification/lanes/engine.spec.ts`.
- **REQ-QUAL-23 Motion and settled state (L9).** With motion `full`: a 12-frame strip at 16 ms during each declared entrance (`ComponentMeta.states` containing `open`, or `parameters.ag.states` drive `open`) shows ≥3 distinct frames. Under `reducedMotion: 'reduce'` + motion `none`, after 500 ms settle: 0 rAF callbacks and 0 running `document.getAnimations()` over the next 1,000 ms; final `opacity` 1 and scale 1 on the subject root. For every subject, 500 ms after the last `transitionend` without input: 0 pending rAF, 0 intervals, 0 infinite animations (`perf.settledIdle`, S-40) except subjects whose meta marks continuous indeterminate progress (≤1 animation on `transform`/`opacity` only, 0 under reduced motion); no element keeps computed `will-change ≠ auto` 100 ms after its transition settles; no `backdrop-filter` on `::view-transition-*`. Test: `certification/lanes/motion.spec.ts`.

### 5.5 L7 Pixel regression

- **REQ-QUAL-24 Baselines and thresholds.** Element-cropped captures (`locator.screenshot`, `animations: 'disabled'`, `caret: 'hide'`) per subject-state: chromium and webkit × {photo, flat-white} × {light, dark} at 1440, + chromium × photo × light at 390, + firefox × photo × light at 1440 = **10 per subject-state**. Compare with `toHaveScreenshot({ threshold: 0.1, maxDiffPixelRatio: 0.002 })`, `maxDiffPixels` floor 20 below 10,000 px². Stored at `certification/baselines/linux/<engine>/<subject>/<state>__<scene>__<scheme>__<viewport>.png`; each ≤80 KB, tree ≤30 MB; produced only by the pinned `AG_PLAYWRIGHT_IMAGE`; darwin names or non-image PNG metadata fail. Test: `packages/qa/test/baselines-budget.test.ts`, `certification/lanes/regression.spec.ts`.
- **REQ-QUAL-25 Baseline refresh without blocking other streams.** On a non-QUAL PR, an L7 diff never blocks: the cell is recorded `changed` with base | head | diff images in the job artifact, and the subject state becomes `pending` (awaiting review). Baselines change only in QUAL PRs on branches `next-qual/baselines-<yyyymmdd>` generated by job `qual:certify:baseline-refresh` (manual or scheduled, writes the candidate PNGs and `baseline-diff-report.html` as artifacts; QUAL's operator commits them from a QUAL worktree, because CI holds no GitHub credential). Such a PR requires CODEOWNERS approval from the design reviewer on `certification/baselines/**` and an L14 record for every changed subject (REQ-QUAL-73). At release scope any `changed` or `pending` L7 cell is not pass (G-01). Bootstrapping: first baselines at the first pre-release where the subject has no seed marker, one PR per flagship family. Test: `packages/qa/test/baseline-refresh.test.ts`.
- **REQ-QUAL-26 Visual-class report (S-55).** `qual:certify:l7` writes `.artifacts/qual/visual-class.json` (`VisualClassReport`) for every pipeline: one row per default-preference cell at 1440×900 and 390×844, element-cropped, with `changedRatio` computed by `pixelmatch` with `VISUAL_TOLERANCE` (`pixelmatchThreshold: 0.1`, `includeAA: false`, `changed` when `changedRatio > 0.001`) between the merge-base and head captures. QUAL never decides the change class (PLAT's `plat:gate:change-class`). Test: `packages/qa/test/visual-class-report.test.ts` (validates against the S-55 type and the double in `tests/contract-doubles/reports/visual-class.json`).

### 5.6 L1–L4, L11, L12 wiring

- **REQ-QUAL-27 L1 Static.** Runs `npm run lint` (ESLint 9 flat config with discovered `auraglass/*` rules; severity per the non-blocking rollout, contract §4.11), `stylelint` with `stylelint.showcase.config.mjs` on `showcase/**/*.css`, and every `node-script` registration for L1; plus QUAL's gates REQ-QUAL-31, -44, -46, -55 and REQ-QUAL-60's tracked-path guard. Zero `!important` in `**/*.stories.tsx`, `showcase/**`, `.storybook/**` (D-24). Test: `packages/qa/test/l1-wiring.test.ts`.
- **REQ-QUAL-28 L2, L3, L4 are discovery-only.** QUAL authors none of the artifact, change-class or token-contrast gates; it runs every registration for those lanes against the tarball from `AURAGLASS_TARBALL` (dotenv from `plat:package:pack`) or, if absent, `npm pack --pack-destination .artifacts/pack` (S-48). L4 is never path-filtered. A lane with no registration is `pending` (REQ-QUAL-06). Test: `packages/qa/test/lane-runner.test.ts` (tarball resolution both ways).
- **REQ-QUAL-29 L11 Consumer canaries.** Runs each `canaries/<app>/` fixture's own assertions from the packed tarball (asserting `node_modules/aura-glass` is not a symlink), and adds a cross-engine smoke: every route of the `canaries/next16` production server (`next start`), including the per-stream pages under `app/<stream>/`, returns HTTP 200 with 0 console errors in chromium, webkit and firefox. It runs `tests/fixtures/consumer-4x/` unchanged against the 4.x tarball and, on 5.x, after `migrate 4to5` from the packed CLI tarball with 0 `TODO(aura-glass 5)` markers on `flagship-subset.json` (G-08). A missing fixture, or a `packages/cli` that does not yet pack a `migrate` command (`npm pack -w @auraglass/cli` in-job), is `pending` before RC-1 and `fail` at release. Test: `certification/lanes/canaries.spec.ts`.
- **REQ-QUAL-30 L12 Unit and coverage floors.** `npm test` (jest config verbatim, tests discovered by location) with `--coverage --coverageThreshold=<json>` built from `certification/ratchets.json`: `src/material/**` 90% lines / 85% branches; every flagship directory 85/75; `src/theme/**` 80/70; global 70/60. A directory whose code still carries `@ag-contract-seed` is excluded (`pending`). Floors only increase (ratchet test against the merge base). Test: `packages/qa/test/coverage-ratchet.test.ts`.
- **REQ-QUAL-31 Vacuous-assertion gate.** `scripts/qual/lint-tests.mjs` (AST via `@typescript-eslint/parser`, frozen) fails on, in any `*.test.ts(x)` outside `legacy/**`: `expect(container).toBeInTheDocument()`; `expect` inside an `if` without a failing `else`; loops over `querySelectorAll` without a preceding length assertion; `getComputedStyle(...).animationDuration` in jsdom; `toMatchSnapshot()` on DOM under `src/**`; jsdom color-contrast assertions. Severity: error on QUAL paths, report-only on other streams' paths until RC-1, error everywhere from RC-1 (G-05). When the contract adds rule `no-vacuous-assertions` to QUAL's row (CC-Q1), the logic moves to `lint/rules/qual/no-vacuous-assertions.cjs` unchanged. Test: `tests/lint/qual/no-vacuous-assertions.test.ts`.
- **REQ-QUAL-32 Known-failures proof against 4.1.0.** Nightly job `qual:certify:known-failures` checks out tag `v4.1.0` into a scratch directory in the job, builds its Storybook there and runs L6/L7/L8 detectors on it; `certification/lanes/known-failures.spec.ts` asserts each of these is reported with the right gate id: `3-2-app-shell--saa-s-app-shell` OCR contrast (≤2.2:1); `surfaces-modals-glass-modal--default` cost gate (12 visible filters >6); all 12 measured stories `preference-noop` under contrast-more; `liquid-glass-showcase` 12 backdrop filters under forced colors; `PageTransitionDemo` pageerror. A certification that passes 4.1.0 is broken. The 4.x measurement layer (`legacy/tests/visual/design-system/token-purity-layout-audit.spec.ts:852-2232` and fixtures `:3930-4128`) is ported to `packages/qa/src/inspect/` and `packages/qa/fixtures/`, read from `legacy/` and never imported. Tests: `packages/qa/test/inspect.fixtures.test.ts` (10 ported fixtures, identical verdicts), `known-failures.spec.ts`.
- **REQ-QUAL-33 4.x coverage today.** From day 0, `qual:certify:nightly` and every `main`-scope run of `qual:certify:l2`, `l3` and `l11` on `next` also run L2, L3 and L11 (contract §5.1) against two 4.x tarballs: the latest published `aura-glass@4` (`npm pack aura-glass@<AG_V4_DIST_TAG>`, public registry, no credential) and one packed in-job from the `release/4.x` head (`git fetch origin release/4.x` with the job's own same-project access, `npm ci && npm pack` in a scratch worktree using the 4.x scripts unchanged). L3 uses these to check G-07 (deprecations shipped in a published 4.x minor). So 4.x code is certified while the 5.0 subjects are still seeds. Results are reported in the GA dashboard as `line: 4x`; they never block a `next` PR. QUAL's fragment carries no `$AG_LINE == "4x"` jobs, because `certification/**` exists only on `next` (on `release/4.x` every non-fragment path is PLAT's, contract §2.4.1); the 4.x-line PR gates on `release/4.x` pipelines are PLAT's own jobs (see OI-QUAL-10). Test: `packages/qa/test/lane-runner.test.ts` (`--line 4x` resolution for both tarball sources).

### 5.7 Performance (L10 and perf static gates)

- **REQ-QUAL-34 Perf harness.** `tests/perf/harness/run-perf.mjs` implements, per (subject × profile × tier × scene): frame time p50/p95/p99 and dropped frames (Chrome trace `devtools.timeline` + `disabled-by-default-devtools.timeline.frame` over a 5 s scripted interaction; rAF cadence via `perf.frames` as secondary); CDP `Performance.getMetrics` deltas (`LayoutCount`, `LayoutDuration`, `RecalcStyleCount`, `RecalcStyleDuration`); trace `CompositeLayers`/`RasterTask`/`GPUTask`; `longtask` and `long-animation-frame` entries; event-timing interaction latency for scripted `pointerdown`/`keydown`; GPU proxies (layer count, blurred-surface count, max effective nesting, max blur, BCI, active SVG filters, live WebGL contexts); heap delta after 10 mount/unmount cycles; settled-idle counters; per-subject bundle bytes measured by QUAL itself with the REQ-QUAL-46 esbuild bundle (min+gzip level 9, React and optional peers external, the S-44 method) and compared with the subject's `SizeBudgetRow` from `loadFragments('size-budgets')`; PLAT's size-gate output is never parsed (its format is not a seam). Each overlay/transition interaction reports a **transition window** (input → panel `transitionend`, ≤1 s) and a **settled window** (next 5 s) separately. Profiles: (a) desktop 1440×900 DPR 2, headed hardware-accelerated Chromium on `.ag-gpu` (`saas-linux-medium-amd64-gpu-standard`), 60 Hz and 120 Hz virtual display, vsync on, `--enable-gpu-rasterization`; fails if `chrome://gpu` reports software compositing or raster; (b) 390×844 DPR 3 touch, `pointer:coarse`, CDP CPU throttle 4×, on `.ag-playwright`; (c) software-raster regression on `.ag-playwright` with `chrome-headless-shell`; (d) WebKit and Gecko: in-page rAF timestamps and DOM counts only. A missing metric, crashed page, 0 frames or failed scene load is `fail`. Invoked without `AG_REMOTE_RUNNER=1` it exits 2 with "remote-only". Output `perf-results.json` (schema `tests/perf/harness/perf-results.schema.json`). Test: `tests/perf/qual/harness-selftest.spec.ts` (forced 200 ms long task and an animated blur are both reported and the run fails).
- **REQ-QUAL-35 Blank baseline and perf fixtures.** Each run measures `perf-harness-blank--default` (empty Lab page over `photo`) per profile; frame-time and long-task metrics are reported absolute and as delta vs blank (blank delta 0 ± 1 ms). Grades use absolute frame time and delta long tasks; Storybook boot tasks are removed only by this subtraction. Fixtures in `stories/qual/perf/PerfFixtures.stories.tsx` with stable ids `perf-harness-blank--default`, `perf-nesting--nest-4`, `perf-budget--budget-7`, `perf-lens--lens-3`, `perf-webgl--webgl-3`, `perf-mount-cycle--default`, composed only from S-06 `Surface`/`SurfaceGroup` and public entries; a renamed id is a schema bump of `perf-results.schema.json`. Every flagship story declares its scripted interaction through `parameters.ag.states` drive steps; a flagship with none uses `scroll` + `hover` defaults and is reported `interaction: default`.
- **REQ-QUAL-36 Blur Cost Index.** `packages/qa/src/perf/bci.ts` implements §4.6 and is the implementation behind `perf.bci` (S-40; replaces the seed's area-weighted fraction). Effective nesting per element = count of ancestors whose `::before` computed `backdrop-filter ≠ none`. Test: `packages/qa/test/bci.test.ts` (full-viewport 20 px = 1.0; 12 px scrim = 0.6; 4.1 modal fixture ≥2.4).
- **REQ-QUAL-37 Grades and PerfReport.** `tests/perf/harness/grade.mjs` (logic in `packages/qa/src/perf/grade.ts`) grades every flagship and T2 subject from its worst cell over profiles (a) at **120 Hz** and (b), standard tier, `photo`; the lowest column wins:

  | Grade | Frame p95 (a@120 / b) | Long-anim frames >100 ms in 5 s | Settled idle | Heap delta, 10 cycles | Bytes vs row | BCI vs budget |
  |---|---|---|---|---|---|---|
  | A | ≤8.3 / ≤16.7 ms | 0 | 0 | ≤0.5 MB | ≤80% | ≤50% |
  | B | ≤11 / ≤20 ms | 0 | 0 | ≤1 MB | ≤100% | ≤75% |
  | C | ≤16.7 / ≤25 ms | ≤1 | 0 | ≤2 MB | ≤100% | ≤100% |
  | D | ≤25 / ≤33 ms | ≤3 | 0 | ≤5 MB | ≤100% | ≤150% (T2 only) |
  | F | worse than D in any column, or no size-budget row for the subject | | | | | |

  It writes `.artifacts/qual/perf-report.json` (`PerfReport`, S-55; letters A–F; `profile` uses the frozen `PerfProfileId` values: profile (a) → `desktop-120hz`, profile (b) → `mid-mobile`; profiles (c) and (d) are recorded only in `perf-results.json`) on every main, nightly and release run. Release gate: any T1 subject below C, any T2 below D, or a drop of ≥1 letter vs the previous release's report on the same runner tag fails. Test: `tests/perf/qual/grade.test.ts` (boundary values per column; lowest column wins).
- **REQ-QUAL-38 Runtime budgets.** Default ceilings in `certification/thresholds.json#perf` apply to every subject at standard tier, measured at 3 scroll positions with every overlay in the story opened: visible blurred surfaces ≤6 at `(hover:hover) and (pointer:fine)` and ≤3 at `(pointer:coarse)`; BCI ≤2.0 fine / ≤1.2 coarse (evaluated at 1440×900, 1920×1080 and 390×844); effective nesting ≤1 (≤2 only where `data-ag-allow-nested` is present); blur radius ≤32 px; full-viewport blur only on `data-ag-layer="scrim"` and ≤12 px; enhanced refracting surfaces ≤2 fine / ≤1 coarse, each ≤25% of viewport; live WebGL contexts ≤1; frame p95 ≤16.7 ms at 60 Hz on (a) and ≤25 ms on (b); long-animation frames >100 ms in the settled window 0 on (a), ≤1 on (b); interaction latency p95 ≤50 ms (a) / ≤100 ms (b) for `keydown` on `Menu`, `Select`, `Combobox`, `Tabs`; heap delta ≤1 MB after 10 cycles; heap of the dashboard scene at rest ≤30 MB; 0 layouts per frame and style recalc ≤1 ms (a) / ≤3 ms (b) during scroll; `renderToString` of the dashboard scene ≤50 ms median. A `PerfBudgetRow` in any `fragments/perf-budgets/<stream>.ts` may only tighten a ceiling for its subject; a row looser than the default fails `perf-budget-looser`. `tests/perf/harness/budgets.json` is generated (git-ignored) by `tests/perf/harness/resolve-budgets.mjs`. Recommended owner rows (each owner decides; QUAL enforces whatever is registered): `Dialog`/`AlertDialog` blurred-surfaces = 2 (scrim + panel), `Sheet` ≤2, `Popover`/`Tooltip`/`Menu`/`Toast` 1 each, `AppShell` chrome ≤3 with `StatusBar` unblurred, `Table` 10,000-row scroll p95 ≤16.7 ms on (a). Test: `tests/perf/qual/surface-budget.spec.ts` (Chromium, WebKit, Gecko).
- **REQ-QUAL-39 Calibration and ratchet (D-26).** Calibration happens once, at the first pre-release where `Button` and `Dialog` carry no seed marker (contract §6.1). `qual:certify:l10` and `qual:certify:l2` artifacts (QUAL's own lane jobs; bytes from the REQ-QUAL-46 measurement) drive one window in which each stream may raise its own `size-budgets`/`perf-budgets` rows to `min(provisional, ceil(measured × 1.10))` (bytes: `ceil(measured × 1.10 / 256) × 256`), using the changeset marker `perf-budget-raise` in its own PR. QUAL then records the calibration SHA in `certification/calibration.json`; from that SHA on, `tests/perf/qual/budgets-frozen.test.ts` fails any PR whose fragment rows raise a `max` (it compares `loadFragments('perf-budgets')` and `loadFragments('size-budgets')` at head vs merge base, so it needs no PLAT code). Rows marked `provisional: true` must be `false` after calibration. Test: that file.
- **REQ-QUAL-40 PR frame-time ratchet.** Job `qual:certify:l10-gpu` (QUAL-only job, `.ag-gpu`) runs profile (a) on affected flagships of any PR touching `src/**` (affected from the import graph, plus sentinel): p95 frame time may not regress by more than max(10%, 1 ms) vs the latest `main`-scope `perf-report.json` artifact of the merge base, comparing like windows only; blurred-surface count and BCI may not increase. Pool size = `ceil(subjects × perSubjectSeconds ÷ 600)` parallel jobs (`parallel:`), so it finishes in ≤10 min; measured at the first nightly. Test: `tests/perf/qual/pr-ratchet.spec.ts`.
- **REQ-QUAL-41 Regression vs 4.1 evidence.** On profile (c), the 5.0 successors of the 4.1 measurements reach: `Dialog` open story ≥50 fps desktop and mobile (4.1 modal 12, dialog 13–14); both `AppShell` product scenes (S1-3 ops console, S1-1 AI command center, §5.9) ≥50 fps (4.1: 19–23); each ≥0.85× blank; 0 long tasks >50 ms attributable to library scripts during interaction. Subjects are found by `listSubjects({ tags: ['flagship'] })` and showcase ids; while they are seeds the test is `pending`. Test: `tests/perf/qual/regression-4x.spec.ts`.
- **REQ-QUAL-42 Leaks.** Mount/unmount every flagship 10× in a harness page: listener counts on `window`/`document` return to the pre-mount value; 0 pending rAF, 0 intervals, 0 observers (constructor wrappers in `tests/perf/harness/instrument.js`); heap delta ≤1 MB after forced GC (`--js-flags=--expose-gc`). Test: `tests/perf/qual/mount-unmount-leak.spec.ts`.
- **REQ-QUAL-43 Browser perf invariants.** Over every subject cell in Chromium, WebKit and Gecko: no `.ag-surface` host is a backdrop root (computed `backdrop-filter none`, `filter none`, `opacity 1`, `mix-blend-mode normal`, `will-change auto` unless `[data-ag-animating]`); exactly one `svg[data-ag-lens-defs]` with 10 enhanced surfaces mounted and 0 applied `url()` backdrops on Gecko/WebKit; with 3 `./three` surfaces ≤1 live WebGL context, released on unmount (`WEBGL_lose_context`), 0 rAF frames while `document.visibilityState === 'hidden'` or offscreen, DPR ≤1.5; under `forcedColors: 'active'`, reduced transparency (`data-ag-transparency="solid"`) and tier `lightweight`, 0 elements with computed `backdrop-filter ≠ none` on every scene. Tests: `tests/perf/qual/{host-backdrop-root,svg-lens-budget,webgl-budget,a11y-fallback-cost}.spec.ts`.
- **REQ-QUAL-44 CSS perf gate.** `scripts/qual/verify-css-perf.mjs` (stylelint Node API with QUAL plugins in `scripts/qual/stylelint-perf/`; stylelint is frozen, no `postcss` direct dependency) over `dist/**/*.css` and `src/**/*.css`: blur radii inside `backdrop-filter`/`-webkit-backdrop-filter` only in {0, 12px, 20px, 32px}; every `backdrop-filter` value matches `^(none|blur\([^)]+\) saturate\([^)]+\) brightness\([^)]+\)|url\(#ag-lens-(fixed|capsule|concentric)-(control|bar|panel)\)( blur\([^)]+\) saturate\([^)]+\)( brightness\([^)]+\))?)?)$` (no `contrast()`); 0 `translateZ(0)`, `translate3d(0,0,0)`, `backface-visibility: hidden` hacks; 0 `will-change` outside `[data-ag-animating]`, `[data-starting-style]`, `[data-ending-style]`; 0 transitions/keyframes on `backdrop-filter`, `filter`, `--_ag-blur` or layout properties (`left`, `top`, `right`, `bottom`, `width`, `height`, `margin*`, `padding*`, `inset*`). Registered on L1; error on QUAL paths and `dist/`, report-only per stream path until RC-1. Test: `tests/perf/qual/css-perf.test.ts`.
- **REQ-QUAL-45 Perf lint rules (S-47).** QUAL implements its six contract rules as `lint/rules/qual/<name>.cjs` (`{ meta, create, agConfig }`): `no-transition-all` (JS/TSX style objects and strings), `no-permanent-will-change`, `no-translatez-hack`, `no-global-pointer-listener` (`window`/`document` `mousemove|pointermove|scroll|deviceorientation` listeners outside `src/motion/**`), `raf-requires-cancel` (every `requestAnimationFrame` id reaches `cancelAnimationFrame` in the same cleanup or `stop()`), `raf-requires-visibility-gate` (a rAF loop checks `document.visibilityState` or subscribes via the S-13 `subscribeFrame`). `agConfig` severity is `error` only for QUAL globs and `warn` elsewhere (contract §4.11 rollout); `error` everywhere at RC-1 (G-05). Tests: `tests/lint/qual/{layer-forcing,raf,no-global-pointer-listener}.test.ts` (RuleTester, ≥3 valid and ≥3 invalid per rule).
- **REQ-QUAL-46 Dist JS scans.** `scripts/qual/verify-dist-perf.mjs` over `dist/**/*.js` (from `plat:build:dist` or the tarball): 0 `ChartJS.register`, `Chart.defaults`, `defaults.plugins`, module-scope `window.<x> =`; 0 `.animate(` keyframes or inline `style.transition` naming `backdropFilter`, `filter`, `--_ag-blur` or a layout property; 0 `elementsFromPoint`; no `MutationObserver(` outside an allowlist (`primitives/DismissableLayer*`, Base UI internals); 0 `feTurbulence`; for every value export `X` of `.`, an esbuild metafile bundle of `import { X } from 'aura-glass'` (esbuild frozen) contains no module from `chart.js`, `react-chartjs-2`, `date-fns`, `three`, `@react-three/*`, `motion`, `framer-motion`, `d3-*`; each such bundle's min+gzip (level 9) byte count is recorded per export in the L2 lane manifest for REQ-QUAL-34/-37/-39 (it is a measurement, never a size gate; byte gates are PLAT's). Registered on L1/L2. Test: `tests/perf/qual/dist-perf.test.ts`.
- **REQ-QUAL-47 Node cold import.** `tests/perf/qual/node-cold-import.test.mjs` (remote L2 only) installs the packed tarball into a scratch project and runs 11 fresh `node` processes per entry on Node 20.19.0 and Node 22 LTS, each timing `await import(<entry>)` with `performance.now()`, after dropping the OS page cache (`sync; echo 3 > /proc/sys/vm/drop_caches`, or the runner's equivalent when not root, recorded). Fails if `.` median > `DEFAULT_CEILINGS.nodeColdImportMs` (150 ms) or p90 >200 ms, or median >30 ms for `./material`, `./tokens`, `./primitives`; output records Node version and runner tag (missing tag = fail). PLAT's side-effect trap gates are separate and PLAT's.
- **REQ-QUAL-48 Real devices before RC-1.** Job `qual:certify:devices` (`.ag-aws-remote`, manual until the runner exists, OD-11) runs the six S1 scenes, `Dialog` and `AppShell` on AWS Device Farm (iPhone 13 / Safari 18 and 26, Pixel 7 / Chrome, Moto G Power class / Chrome) and an EC2 `mac1.metal` Safari host as the Intel-Mac proxy, using only the runner's instance role. Frame p95 from the in-page rAF probe; Android adds LoAF via CDP over `adb forward`. Gate: Pixel 7, iPhone 13 and Intel proxy ≤16.7 ms for `Dialog` open/close and `AppShell` scroll; mid-tier Android ≤25 ms, one signed exception ≤33 ms; >33 ms fails; a session with 0 frames is a failure. Sign-off is recorded in `docs/certification/real-device-matrix.md`. Every session and instance is tagged `attempt-id`, `sha`, `lane`, `ttl` and terminated on exit. Test: `tests/perf/qual/devices/device-farm-run.mjs` self-check mode.

### 5.8 Storybook and Material Lab

- **REQ-QUAL-49 Information architecture.** `parameters.options.storySort.order` = `['Start Here','Material Lab','Scenes','Showcases','Flagships',['Controls','Overlays','App Shell','Data','AI','Media'],'Core','Foundations','Migration']`; flagships within a group follow `ComponentMeta.flagship` order. `scripts/storybook/lint-titles.mjs` fails on: a title segment matching `/^\d+\.\d+/`; a lowercase-initial leaf; a `Glass` prefix in a leaf (D-14); a component title in more than one group; a leaf that is not the subject's `ComponentMeta.name`; a component title with >12 non-matrix stories; a title outside `Flagships`/`Showcases`/`Material Lab` with more stories than the smallest flagship title; a title whose story set is exactly {`Default`, `Variants`}. Labs components are not in this Storybook (D-16). Tests: `tests/storybook/storybook-index.test.mjs`, `tests/storybook/lint-titles.test.mjs`.
- **REQ-QUAL-50 Story contract validator (S-41).** `tests/storybook/story-contract.test.ts` reads every story file in the `.storybook/main.ts` globs and asserts: every story whose subject is a `ComponentMeta` declares `parameters.ag` satisfying `StoryAgParameters` with an explicit `subject` and a `kind`; tags ⊆ `STORY_TAGS`; flagship titles export at least `REQUIRED_FLAGSHIP_STORIES` (`Playground`, `States`, `Keyboard`), the `Keyboard` story is tagged `apg` and its id is referenced by an APG spec under `tests/a11y/apg/<owner>/`; no story file imports from `.storybook/**`; args type-check under `tsconfig.storybook.json` (`strict`, `noImplicitAny`, no `as any`/`: any`); rendered copy contains none of `glass morphism`, `Lorem`, `Sample `, `This is a`, `Click Me`, `consciousness`, `quantum`, `predictive`, `eye tracking`, or the rendered text `Default`. Matrix, scenes and Lab framing are rendered by QUAL's decorators from `parameters.ag.kind` and meta, so owners never hand-write matrices. QUAL never writes another stream's story; a violation is a failure on the **owner's** paths (contract §6.1), so it blocks only that owner's PR. Test: that file, plus `scripts/storybook/lint-story-copy.mjs` and its test `tests/storybook/lint-story-copy.test.mjs`.
- **REQ-QUAL-51 Docs blocks and generated docs pages (S-51).** `.storybook/blocks/index.tsx` exports exactly `Anatomy` (`data-ag-part` table from `meta.parts`), `KeyboardTable` (from an `ApgStep[]`), `MigrationTable` (`meta.migration`), `PropsTable`, `SelectorTable` (`migration.selectors`), each accessible tables with captions. The preview sets `parameters.docs.page` for every story whose `subject` resolves to a `ComponentMeta`, rendering Usage (the `Playground` story), Anatomy, material role (`meta.material.layer`), Keyboard (the owner's APG script, imported from its spec through the generated `storybook-static/apg-index.json` written by `scripts/storybook/write-apg-index.mjs`, never by MDX importing spec files), Migration and Selectors. No flagship MDX is written in QUAL paths. Test: `tests/storybook/docs-pages.test.mjs` (44 flagships, 6 sections each, once metas exist; `pending` before).
- **REQ-QUAL-52 Start Here.** `stories/qual/StartHere.mdx` is rendered from build-time data (`storybook-static/index.json`, inventory, `package.json` version): counts of flagships, core, stories and interaction flows are computed; every link uses `?path=` validated against the index; a broken link fails the build; no version literal except the one read from `package.json`. Test: `tests/storybook/start-here.test.mjs`.
- **REQ-QUAL-53 Material Lab pages.** `.storybook/lab/MaterialLab.stories.tsx` (kind `lab`, tag `lab`) contains, in order: `Overview` (five materials — regular, clear, identity, content-raised, content-sunken — × 3 thicknesses over the selected scene, subjects ≥360×240 at 1440), `Regular`, `Clear`, `Identity`, `Content Raised`, `Content Sunken`, `Tiers` (lightweight/standard/enhanced side by side; enhanced shows "inert on this engine" when `data-ag-engine` ≠ chromium), `Nesting & Groups` (`SurfaceGroup` one-backdrop demo, nested collapse, `allowNested`), `Shape & Concentricity` (`ConcentricFrame`, capsule, `--ag-radius-inner` read-out), `Scroll Edge` (soft/hard over `dense-text`), `Preferences` (glass/tinted/solid × contrast more × forced colors), `Motion` (entrance, hover/press, pointer light, View Transition optics drop). It composes only S-05/S-06 exports and S-21/S-22 hooks. Test: `tests/storybook/storybook-index.test.mjs` (12 Lab stories in order).
- **REQ-QUAL-54 Lab controls, contrast read-out, never shipped.** Discrete axes (`variant`, `thickness`, `layer`, `content`, `shape`, `tier`, `transparency`, `interactive`, `prominent`, `refraction`) are public `Surface` props (S-05); public knobs `--ag-light-angle` (0–360deg), `--ag-specular` (0–1), `--ag-glass-opacity` (0–1) are set by `style` on the Lab subtree (S-03). Spec knobs (per-thickness blur 0–32 px, saturation 1.0–2.0, brightness 0.9–1.2, tint floor 0–1, grain 0–0.06, bezel 8–32 px, refraction scale 0–1, rim 0.5–2 px) write only private overrides on `[data-ag-lab-override]` from `.storybook/lab/**`, with names taken from the frozen seam proposed in CC-Q2; until it merges the spec panel renders "pending seam" and exports nothing. A "Spec deviation — not shipped" badge shows when any spec knob differs from the compiled default; "Reset to shipped" removes every inline `--_ag-*`; "Export MaterialSpec patch" emits JSON validated against the S-11 `TokenManifestEntry` (`type: 'glass-material'`) shape. `ContrastReadout` samples the scene asset pixels under the subject rect (canvas readback of owned pixels), composites the resolved `--ag-surface-fill`, reports worst-case `--ag-on-surface` / `--ag-on-surface-muted` ratios vs 4.5:1 / 3:1 (7:1 under contrast more) within one frame of a settled change (≤100 ms debounce), labels itself "estimate" (the gate of record is L6 OCR), is a `role="status"` live region announcing on settle, and imports no runtime contrast code. Nothing under `.storybook/**` is importable from `src/**`, `showcase/**` or `registry/**`, and no `.storybook` file or story-only attribute (`data-ag-story-content`, `data-ag-story-kind`, `data-ag-cert-ready`, `data-ag-lab-override`, `data-ag-state-cell`) appears in the tarball or `dist/`. Tests: `tests/storybook/MaterialLab.test.tsx`, `tests/storybook/ContrastReadout.test.ts` (±0.05 of a reference WCAG implementation), `tests/storybook/lab-not-shipped.test.ts`.
- **REQ-QUAL-55 Zero story-supplied glass.** `scripts/qual/lint-stories.mjs` (AST, frozen parser) applies six checks to `**/*.stories.tsx`, `**/*.mdx`, `showcase/**`, `certification/scenes/**`, `.storybook/**`: `story-no-optics` (`backdropFilter`, `WebkitBackdropFilter`, `filter`, `mixBlendMode` in `style`/CSS-in-JS; `backdrop-filter` strings); `story-no-important`; `story-no-ink-override` (`color`, `--ag-on-surface*`, `--glass-text-*` on a library component or wrapper); `story-no-tone-class` (`/^glass(-on-|-contrast|-neutral-|-level)/`, `.liquid-glass-*`); `story-no-stage-background` (`background*` on any JSX ancestor of a library component except `Environment`); `story-no-private-vars` (`--_ag-*` outside `.storybook/lab/**`). "Library component" = JSX bound by an import whose specifier matches `^aura-glass(/|$)` or a relative import into `src/**`; ancestry is same-tree JSX. Inline disable comments are ignored. Severity: error on QUAL paths; on other streams' story paths report-only with per-stream counts in the lane manifest until RC-1, then error (G-05). When CC-Q1 adds the six names to QUAL's lint-rule row, the checks move to `lint/rules/qual/story-*.cjs` unchanged. Test: `tests/lint/qual/story-rules.test.ts` (≥4 valid, ≥4 invalid per check, plus a disable-comment fixture that still fails).
- **REQ-QUAL-56 Storybook build and freshness.** `qual:build:storybook` runs `npm run storybook:build` with `AG_STORYBOOK_DIST=1` (Vite resolves `aura-glass` and subpaths through the package `exports` to `dist/`, never `src/` or `@/` aliases; the dev server may alias `src`). `dist/` comes from the `plat:build:dist` artifact through an `optional: true` need; when that artifact is absent the job runs `npm run build` (S-52) itself first, so the build never waits for a PLAT job. It then runs `scripts/storybook/write-cert-manifest.mjs`, `write-apg-index.mjs` and `write-build-manifest.mjs`, which writes `storybook-static/ag-build.json` = `{ sha: $CI_COMMIT_SHA, dirty, builtAt, storybookVersion, packageVersion, storyCount, indexSha256 }`. `scripts/storybook/verify-fresh.mjs` exits non-zero unless the file exists, `sha` equals the SHA under test, `dirty` is false in CI and `indexSha256` matches `index.json`; every QUAL consumer of a built Storybook (all browser lanes, the AWS bundle builder) runs it first. `scripts/storybook/check-build-log.mjs` fails on missing or duplicate story ids or unresolved imports. `tsc --noEmit -p tsconfig.storybook.json` is part of L1. `storybook-static/` stays git-ignored and `git ls-files storybook-static` is empty. `storybook-static` ≤60 MB excluding source maps; build ≤6 min. Tests: `tests/storybook/verify-fresh.test.mjs` (missing manifest, SHA mismatch, dirty tree, hash mismatch), `tests/storybook/storybook-config.test.ts`.
- **REQ-QUAL-57 Test tooling.** No 5.0 file imports `@storybook/jest`, `@storybook/testing-library` or `@storybook/test`; Storybook-side interaction smoke flows (≥1 primary-task flow per S1 showcase, e.g. S1-1 send → tool-call approval, S1-6 sheet detent change, plus Lab control round-trips) are Playwright specs in `tests/e2e/qual/storybook/**` against the built Storybook (no Vitest, no `@storybook/addon-vitest`: not in the frozen set, §4.12). `@storybook/addon-a11y` runs in the interactive Storybook; the gate of record is REQ-QUAL-19. Test: `tests/storybook/storybook-config.test.ts` (import scan).

### 5.9 Showcases

- **REQ-QUAL-58 Ten showcases.** `showcase/<id>/` holds `<Name>.showcase.tsx`, `<Name>.stories.tsx` (kind `showcase`, tag `showcase`, one full-page story with `layout: 'fullscreen'` + 2–4 fragment stories), `<name>.module.css`, `copy.ts`, and assets. Tier and default scene live in `showcase/showcases.json` (QUAL). Composition source per contract §3.3:

  | Id | Tier | Default scene | Composes | Must contain (5.0 names) | Fragments |
  |---|---|---|---|---|---|
  | `ai-command-center` | S1 | `dark-media` | `registry/blocks/ai-workspace` | AppShell, Sidebar, TopBar, Thread, Message, StreamingText, Composer, ToolCall (5 states), Reasoning, AgentSteps, SourceList, Citation, CommandPalette, Toast, Button, IconButton | Thread; Composer; ToolCall stack |
  | `financial-dashboard` | S1 | `flat-white` | `registry/blocks/data-workspace` | AppShell, TopBar, StatCard ×4, Sparkline, ChartFrame, Table (sort, select, sticky header, 10,000 virtual rows), FilterBar, DateRangePicker, SegmentedControl, Tabs, Select, Pagination | KPI row; table header + 20 rows |
  | `ops-console` | S1 | `flat-black` | `registry/blocks/app-frame` | AppShell, Sidebar (rail), TopBar, Table (grid), Timeline/ActivityFeed, TreeView, ResizablePanels, Menu, Tooltip, AlertDialog, Toast | incident table; tree + panel split |
  | `media-workspace` | S1 | `video-frame` | `registry/blocks/media-viewer` | MediaControls, NowPlayingBar, ImageViewer chrome, CarouselRail, Toolbar, Slider, Popover, Sheet | clear-over-media controls (canonical `clear` demo); inspector sheet |
  | `collaborative-workspace` | S1 | `saturated-abstract` | public entries | AppShell, Tabs, ResizablePanels, Thread, Message, Menu/ContextMenu, Popover, Combobox (multi, chips), Breadcrumbs, Dialog, Avatar | document + comments; share popover |
  | `mobile-productivity` (390×844) | S1 | `photo` | public entries | MobileShell, TabBar (+ accessory), Sheet (detents), SearchField, Switch, Checkbox, TextField, RadioGroup, NumberField, Toast, SourceTransition, `GlassPreferencesPanel` | tab bar + accessory; sheet at 3 detents |
  | `music-player` | S2 | `photo` | `registry/blocks/media-viewer` | NowPlayingBar, MediaControls, Slider, CarouselRail, SegmentedControl, IconButton | now-playing bar |
  | `spatial-control-center` | S2 | `hf-pattern` | public entries | SurfaceGroup, ButtonGroup/Toolbar, Slider, Switch, SegmentedControl, IconButton, ConcentricFrame, one `refraction` chrome surface | control grid |
  | `ecommerce` | S2 | `photo` | public entries | CarouselRail, Select, NumberField, RadioGroup, Button (`prominent`), Sheet (cart), Breadcrumbs, Pagination, Toast | product detail; cart sheet |
  | `analytics` | S2 | `dense-text` | `registry/blocks/analytics-dashboard` | StatCard, Sparkline, ChartFrame, Table, FilterBar, DateRangePicker, Tabs, Popover | filter bar + chart |

  The union of S1 rows names all 44 flagships, so no flagship is certified only in isolation. While a block directory is empty or a component is a seed, the showcase renders `ShowcasePending` (scene background, "block pending" label, tag `no-cert`; L6/L7 skip it, it never counts as pass). S1 runs the full product-scene matrix (GA-blocking); S2 runs the T2-reduced matrix (not GA-blocking). Test: `tests/showcase/showcase-coverage.test.ts` (listed root `data-ag-part`s present, S1 union = 44 flagships; `pending` per missing input).
- **REQ-QUAL-59 Showcase hygiene.** Showcases import only `aura-glass`, `aura-glass/<subpath>` (S-35 entries), `registry/blocks/<id>/{index.tsx,fixtures.ts}` and files in their own folder; banned: `**/src/**`, `@/**`, `.storybook/**`, `aura-glass/compat`, any 4.x `Glass*` name, any stream internal fixture. `scripts/storybook/verify-showcase-imports.mjs` builds every `showcase/**/*.showcase.tsx` with Vite against the packed tarball installed in a temp dir and fails on any unresolved import. Showcases contain 0 `!important`, 0 colour literals, 0 `style` props setting `background*`, `backdrop*`, `filter`, `box-shadow`, `border*`, `color`, `opacity`, `mix-blend-mode` on a library component or its ancestors up to `Environment`, 0 selectors targeting `[data-ag-part]`; `showcase/**/*.module.css` may use only `display`, `grid-*`, `flex*`, `gap`, `padding`, `margin`, `inline-size`, `block-size`, `min-*`, `max-*`, `position`, `inset*`, `overflow`, `container-*` (`stylelint.showcase.config.mjs`, `declaration-property-allowlist`). Data is deterministic (no `Math.random`, `Date.now` or network in render; time from the fixed epoch via a `now` prop); images ≤300 KB AVIF, ≤12 per showcase, licensed for a public static site. Copy is product-realistic: no meta copy about AuraGlass, glass, certification or Storybook, the REQ-QUAL-50 banned list applies, ≥1 data-dense region (≥40 text runs). Each showcase has one `<main>`, its own skip link, ordered headings, named landmarks; `ai-command-center`'s Thread is `role="log"`. Collapsed layouts exist at 390 (Sidebar → drawer `Sheet`, Inspector → bottom `Sheet`); `mobile-productivity` also renders at 834. Tests: `tests/showcase/showcase-imports.test.mjs`, `tests/showcase/showcase-determinism.test.ts` (two renders, identical HTML), `tests/showcase/showcase-a11y.test.tsx`.

### 5.10 Evidence, verdict and CI

- **REQ-QUAL-60 Evidence is artifacts, never commits (S-48, D-32).** Every QUAL job writes only under `.artifacts/qual/<CI_JOB_NAME_SLUG>/` (plus the fixed S-55 report paths and `storybook-static/`), names its artifact `evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA`, and sets `expire_in` per `EVIDENCE.expireIn` (pr 14 days, main 14 days + "keep latest", nightly 30 days, release 90 days via `.ag-evidence-release`). Captures are PNG for compared cells and JPEG q85 otherwise. `packages/qa/test/no-committed-evidence.test.ts` fails if `git ls-files` returns any path under `reports/`, `certification/out/`, `test-results/`, `playwright-report/`, `coverage/`, `.artifacts/`, `storybook-static/`, any `*-snapshots/` directory, or any PNG outside `certification/baselines/`, `certification/scenes/`, `showcase/*/assets/` and `docs/**/assets/`. Registered on L1.
- **REQ-QUAL-61 Evidence verifier.** `packages/qa/src/evidence/verify.ts` (generalising `legacy/scripts/audit/verify-visual-evidence.js` provenance binding) checks, for the SHA under test: every lane L1–L12 has a manifest with `results.length > 0`; the inventory, thresholds, scenes and baselines sha256s in each manifest equal values recomputed from the checkout; every `visual` subject has results in every required cell; every PNG is non-blank and of its declared size; L13 and L14 records exist for every flagship and every S1 showcase, bound to this SHA or to an earlier SHA with zero diffs in that subject's baselines and DOM snapshot; no exemption or console-allowlist entry is expired; 0 quarantined cells. Any missing element fails. Test: `packages/qa/test/evidence-verify.test.ts` (each omission fails; a complete synthetic set passes).
- **REQ-QUAL-62 Computed claims.** `packages/qa/src/evidence/claims.ts` writes `.artifacts/qual/claims.json` = `{ <id>: { value, unit, source: { artifact, sha, path } } }` from verified manifests only: distinct visual components, flagships certified, cells per lane, failures (= 0), worst OCR contrast, token-matrix minimum per class (from the L4 artifact), per-import sizes (from QUAL's own REQ-QUAL-46 measurement recorded in the L2 manifest), perf grade distribution, engines covered, review record counts. The ported "incomplete language" guard applies: if any lane is not `pass` it exits non-zero and writes no file. Until CC-Q3 adds `REPORTS.claims`, PLAT's docs-claims gate (G-14) uses `PerfReport` and `ReleaseVerdict`, and `claims.json` is an extra input it may read. QUAL writes no README or release-note text. Test: `packages/qa/test/claims.test.ts`.
- **REQ-QUAL-63 Release verdict and checklist (S-55, contract §6.2).** `certification/RELEASE_CHECKLIST.md` lists G-01..G-16 with the verifying lane or artifact for each. `qual:certify:release` (tag pipeline, `AG_LINE == 5x`) runs every lane at release scope, then `node certification/run.mjs --lane all --scope release --verdict .artifacts/qual/release-verdict.json`, which writes `ReleaseVerdict` `{ version: 1, sha, tag, items: [{ id: 'G-01'..'G-16', status }], ga }` with `ga: true` only if every item is `pass`; items verified outside QUAL (G-11 issue query, G-12, G-14, G-15, G-16) are read from their owners' artifacts when present and are `pending` otherwise. The rendered checklist (every mechanical item ticked from evidence, none by hand) is attached to the job artifact. Pre-release tags (`-alpha`, `-beta`, `-rc`) run the same checklist; L13/L14 are required from RC-1 only; the verdict is advisory for pre-release and 4.x tags (contract §4.13.7). Test: `packages/qa/test/release-verdict.test.ts` (validates against the S-55 type and the double `tests/contract-doubles/reports/release-verdict.json`).
- **REQ-QUAL-64 CI fragment.** `ci/qual.gitlab-ci.yml` contains only `qual:<stage>:<name>` jobs and `.qual-*` templates, each extending a root template, with `rules` on `$AG_SCOPE` and `$AG_LINE == "5x"`: `qual:build:storybook`; `qual:certify:l1`..`l12` (`CERT_JOBS`, each `node certification/run.mjs --lane L<n> --scope $AG_SCOPE`); `qual:certify:nightly`; `qual:certify:release`; and QUAL-only jobs not referenced by other streams: `qual:test:selftest` (`packages/qa` + harness self-tests), `qual:certify:l10-gpu` (`.ag-gpu`), `qual:certify:baseline-refresh` (manual), `qual:certify:review-record` (manual), `qual:certify:known-failures` (nightly), `qual:certify:release-matrix` (dynamic child pipeline, REQ-QUAL-65), `qual:certify:devices` (`.ag-aws-remote`). Cross-stream `needs` name only `CI_JOBS` entries with `optional: true` (`plat:package:pack`, `plat:build:dist`, `mat:build:tokens`); no `dependencies:` across streams; no job reads a GitHub, npm or cloud credential; nothing references `GITHUB_*`, `gh`, `actions/*`, `CI_JOB_JWT` or `merge_request_event`. Every new job starts `allow_failure: true` and QUAL flips it to `false` in its own fragment after its first green run on `next` (contract §2.3). Browser and perf jobs use `.ag-playwright`, `.ag-gpu` or `.ag-aws-remote`; Playwright `workers` never exceed the runner's CPU count. Test: `packages/qa/test/ci-fragment.test.ts` (parses YAML with `yaml`; asserts every rule above; complements PLAT's `contract:ci-fragments`).
- **REQ-QUAL-65 Time budgets and sharding.** PR pipelines' QUAL jobs p90 ≤20 min; `main` ≤45 min; release ≤90 min including the full L6 matrix. The release matrix runs as a dynamic child pipeline: `certification/runner/shard-plan.mjs` writes `.artifacts/qual/shards.gitlab-ci.yml` with `parallel: <computed>` (≤200, GitLab's limit) from the measured capture rate per runner tag (§4.3), and `qual:certify:release-matrix` triggers it with `strategy: depend`; `qual:certify:release` downloads the shard artifacts through the jobs API with `CI_JOB_TOKEN` (same project). Each manifest records duration and capture rate; a budget overrun on 5 consecutive runs is reported in the GA dashboard (never fails a release). Test: `packages/qa/test/shard-plan.test.ts`.
- **REQ-QUAL-66 Determinism, flake and quarantine.** One Playwright version (`@playwright/test@1.63.0`, equal to `AG_PLAYWRIGHT_IMAGE`) and one image digest per run, fonts listed in the manifest, `animations: 'disabled'` for L7. Nightly runs L7 twice on the same SHA; ≥99.9% of cells must agree. A flaky cell may be quarantined for ≤7 days in `certification/quarantine.json` (`cell`, `issue`, `expires`), reported `quarantined`, and counts as not pass at release (no release SHA carries a quarantined cell). Test: `packages/qa/test/quarantine.test.ts`.
- **REQ-QUAL-67 Remote-only and the AWS fallback.** No QUAL script launches a browser unless `CI=true` or `AG_REMOTE_RUNNER=1` (set by `.ag-playwright`); a local run prints the remote command and exits 2 unless the operator sets `AG_CERT_ALLOW_LOCAL=1` for explicit local debugging. For `.ag-aws-remote` jobs (no egress in the runner VPC), `certification/runner/build-bundle.mjs` packs an offline bundle (`storybook-static/`, the tarball, `certification/`, `packages/qa` build, a cert-only `node_modules`, the three Playwright browser builds, tesseract + `eng.traineddata`, `bundle.manifest.json` with sha256s, git SHA, image digest); `certification/runner/worker-entry.sh` verifies every hash, blocks non-`127.0.0.1` requests (`context.route('**', abort)`), uploads `.artifacts/qual/`, and halts after 120 min; `certification/runner/preflight.mjs` exits 78 with `runner egress CA expired: notAfter=<date>; offline bundle required` if a job requests egress and the proxy CA is expired or expires within 7 days. Rotating that CA is an operator action, never done by CI. Tests: `certification/runner/preflight.test.mjs`, `packages/qa/test/remote-guard.test.ts`.
- **REQ-QUAL-68 Exemptions.** A subject may skip one mechanical gate only through `certification/exemptions.json` (`subject`, `gate`, `cells`, `rationale`, `approvedBy`, `expires` ≤180 days). OCR contrast (REQ-QUAL-13) and console (REQ-QUAL-17) cannot be exempted. An expired exemption fails. Test: `packages/qa/test/exemptions.test.ts`.

### 5.11 Contract helpers and conformance

- **REQ-QUAL-69 Test helpers (S-40) final.** `tests/helpers/index.ts` exports exactly `renderAg`, `renderAgServer`, `expectParts`, `expectNoBannedAttributes`, `gotoStory`, `listSubjects`, `apg`, `perf`, `scenes`, with the frozen signatures; `tests/helpers/setup.ts` adds `@testing-library/jest-dom` and `jest-axe` matchers. `renderAg` applies the `AgEnvironment` as the `data-ag-*` attributes `AuraGlassScript` would set (S-01 values) and wraps in `AuraGlassProvider` unless `provider: false`; `gotoStory` navigates to `iframe.html?id=<id>&globals=…&ag-cert=1`, injects `contracts/stubs/reference.css` while `stub: 'reference'` is requested and `src/material/css/material.css` does not exist, and waits for `data-ag-cert-ready`; `listSubjects` reads `REPORTS.subjects` from `AG_STORYBOOK_URL`, falling back to `index.json`; `perf` implements `PerfProbe` with REQ-QUAL-36's BCI. The `@ag-contract-seed` marker is removed in the PR that lands each real implementation. Test: `tests/helpers/__tests__/helpers.test.tsx`.
- **REQ-QUAL-70 Contract conformance suite (contract §6.3).** `tests/contract/` holds `material.test.tsx`, `attributes.test.ts`, `css-vars.test.ts`, `layers.test.ts`, `preferences.test.tsx`, `components.test.tsx`, `meta.test.ts`, `entries.test.ts` (G-03; `pending` mode before GA), `fragments.test.ts`, `ownership.test.ts` and `doubles.test.tsx`, each asserting exactly the §6.3 row against seams and seeds, so it passes on day 0 and keeps passing as real code lands. It runs as `npm run test:contract` in the blocking root job `contract:conformance`; each failure message names the seam id and owning stream; a failure that pre-dates the PR is reported `pre-existing` for other streams. `attributes.test.ts` also asserts the five story-only attributes and `data-ag-seed` never appear in `dist/`. Test: the suite itself, plus a mutation self-test (`tests/contract/__selftest__/`) that breaks a seed copy and expects the named failure.
- **REQ-QUAL-71 Flagship deliverables (G-04).** `packages/qa/src/deliverables/check.ts` verifies for each of the 44 flagships (`ComponentMeta.flagship`): meta present; parts rendered = `meta.parts`; `migration.selectors` table; at least one registry block or item composing it; an APG spec under the owner's `tests/a11y/apg/<stream>/`; a `size-budgets` row; perf grade ≥C in `perf-report.json`; L7 baselines; a codemod fixture per absorbed 4.x name in `fragments/codemods/<owner>/fixtures/`. It reads only meta, fragments, artifacts and file existence. Registered on L1; `pending` per missing item before RC-1, `fail` at release. Test: `packages/qa/test/deliverables.test.ts`.

### 5.12 Manual lanes

- **REQ-QUAL-72 L13 manual screen reader.** `certification/review/sr-matrix.template.json` is generated per release candidate from metas: per flagship, the tasks (for example Dialog: open, read title + description, Tab cycle trapped, Escape closes, focus returns) × AT pairs VoiceOver + Safari macOS 26, VoiceOver + Safari iOS 26, NVDA 2025.x + Chrome (Windows 11), TalkBack + Chrome (Android 15), plus a physical-touch pass. Records are `SrRecord` JSON (schema `contracts/schemas/sr-record.schema.json`) authored by each owner in `tests/a11y/manual/records/<stream>/`; QUAL aggregates them into `.artifacts/qual/a11y-manual-<sha>.json`. GA requires `pass` for all 44 flagships on the RC SHA, no waiver; a known AT defect is noted with a linked issue and still needs a pass for the AuraGlass behaviour. Test: `packages/qa/test/sr-matrix.test.ts`.
- **REQ-QUAL-73 L14 human visual review.** `packages/qa/src/evidence/composite.ts` builds one review composite per subject-state (8 scenes × light/dark at 1440, the 390 `photo` cell, the previous approved baseline and a diff heat-map). A named design reviewer scores R1 material reads as glass over every scene, R2 optical hierarchy, R3 specular quality, R4 radius and spacing rhythm, R5 typography on glass, R6 preference modes look designed, R7 "reads as one hand" (S1 showcases only), each 1–4; pass = every criterion ≥3 and none at 1 on any flagship. Review items come from `fragments/review/*` (`ReviewItem`, S-45) plus QUAL's own; records (`review-record.json`: reviewer, SHA, subject-state, scores, notes, composite sha256) are created by the manual job `qual:certify:review-record` from reviewer input and kept as release artifacts, never committed. Required: every flagship subject-state, the T0 matrix and all six S1 showcases at RC-1, and every subject changed by a baseline refresh. Test: `packages/qa/test/review-record.test.ts`.

---

## 6. Files/directories affected

Exactly QUAL's rows of the contract ownership map (§3.2; first match wins). QUAL creates, edits or deletes nothing else. On `release/4.x` QUAL owns only `fragments/deprecations/qual.ts`, `fragments/codemods/qual.ts` and `ci/qual.gitlab-ci.yml` (which carries no 4.x jobs).

| Row | Glob | Use in this PRD |
|---|---|---|
| A12 | `fragments/*/qual{.ts,.json}`, `fragments/*/qual/**` | QUAL's own `lanes`, `playwright`, `perf-budgets` (perf fixtures only), `review`, `a11y-baseline`, `literals-baseline`, `deprecations` (empty unless a QUAL-facing 4.x tool name is removed), `codemods` (empty) |
| A14 | `.changeset/qual-*.md` | one per QUAL PR (`@auraglass/qa` is ignored by changesets; markers such as `perf-budget-raise` live here) |
| A15 | `lint/rules/qual/**` | six perf rules (REQ-QUAL-45), `_strict.cjs` |
| A16 | `stories/qual/**` | Start Here, perf fixtures, Foundations/Migration index pages that QUAL renders from metas |
| A17 | `apps/docs/content/qual/**` | contributor guide: certification, baselines, exemptions, remote iteration |
| A18 | this PRD, `prompts/qual/**`, `tasks/QUAL.json` | see open item OI-QUAL-01 (path) |
| A20 | `ci/qual.gitlab-ci.yml`, `ci/qual/**` | REQ-QUAL-64 |
| B03 | `tsconfig.storybook.json` | REQ-QUAL-56 |
| B06 | `stylelint.showcase.config.mjs` | REQ-QUAL-59 |
| B08 | `jest.config.js`, `jest.*.config.js`, `jest.setup.js`, `playwright.config.ts`, `playwright.*.config.ts`, `vitest.storybook.config.ts`, `__mocks__/**` | `jest.config.js` and `playwright.config.ts` stay verbatim; `jest.qual.config.js` added for `packages/qa`/`certification` tests (§12); no `vitest.storybook.config.ts` is created (REQ-QUAL-57) |
| B09, B10 | `.storybook/main.ts`, `.storybook/**` | `main.ts` `stories`/`staticDirs` verbatim; QUAL sets `addons`, `framework`, `viteFinal`; preview, blocks, lab, environment, contract |
| B19 | `docs/certification/**` | `real-device-matrix.md`, certification overview |
| D01 | `tests/contract/**`, `tests/helpers/**`, `tests/a11y/apg/harness.ts` (+ `__selftest__/**`), `tests/a11y/browser/**`, `tests/storybook/**`, `tests/showcase/**` | REQ-QUAL-20, -69, -70 |
| D02 (qual) | `tests/{a11y/apg,…,perf/browser,visual,e2e,ssr,rsc,types,lint}/qual/**` | QUAL's own specs |
| D05, D10 | `tests/perf/**`, `tests/fixtures/**` (except `consumer-4x/**`), `tests/visual/**`, `tests/e2e/**` (except other streams' D02 dirs), `tests/**` fallback | harness and lane-level specs; QUAL never puts another stream's test here |
| E02 | `scripts/storybook/**`, `scripts/audit/**` | build manifests, freshness, title/copy lint; `scripts/audit/` dev-only, never required |
| E03 | `scripts/qual/**` | `verify-css-perf.mjs`, `stylelint-perf/`, `verify-dist-perf.mjs`, `lint-stories.mjs`, `lint-tests.mjs` |
| F01 | `packages/qa/**` | the certification library |
| F07 | `showcase/**` | REQ-QUAL-58, -59 |
| F08 | `certification/**` | lanes, scenes, runner, baselines, thresholds, checklist |
| B23a (qual) | `canaries/next16/app/qual/**`, `canaries/vite/src/qual/**`, `canaries/<app>/fixtures/qual/**` | optional cross-engine smoke pages only |

Paths QUAL **reads but never writes**: `legacy/**` (4.x measurement code, scenes of evidence), `src/**/*.meta.ts`, every story file, `registry/blocks/*/{index.tsx,fixtures.ts}`, `contracts/**`, `tests/contract-doubles/**`, `fragments/*/<other>.*`, `canaries/**`, `tests/fixtures/consumer-4x/**`, `dist/`, the tarball, other streams' CI artifacts.

## 7. Components affected

QUAL changes no shipped runtime code. It affects components only through the contracts it enforces.

| Components (owner) | Effect |
|---|---|
| T0 `Surface` ×12 subjects, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame` (MAT) | full T0 / flagship matrices; Lab pages; BCI and nesting gates |
| Flagships 1–13, 15–21 (CMP); 14, 22–44 (SURF) | `parameters.ag`, `REQUIRED_FLAGSHIP_STORIES`, APG spec, L5–L10 cells, L7 baselines, grade ≥C, L13 records, L14 review, G-04 deliverables |
| T2 core (~40, CMP) | reduced matrix, grade ≥D, coverage floors |
| `GlassPreferencesPanel` (MAT), preference rungs | preference-mode gates; `mobile-productivity` showcase |
| Registry blocks (SURF, CMP, PLAT) | live subjects; composed by showcases |
| Consumer canaries (PLAT) and `consumer-4x` | L11 |
| 4.x `aura-glass@4` tarball | L2/L11 nightly (REQ-QUAL-33); 4.1.0 Storybook known-failures proof (REQ-QUAL-32) |

## 8. New components/files

All under QUAL globs (§6). Key files only; `packages/qa/test/**` and lane specs are listed in §12.

| Path | Purpose |
|---|---|
| `packages/qa/package.json` | `"name": "@auraglass/qa"`, `"private": true` |
| `packages/qa/src/{inventory,resolve,inspect,pixel,ocr,matrix,perf,evidence,deliverables}/**` | REQ-QUAL-01..03, -12..18, -32, -36..39, -60..63, -71 |
| `packages/qa/fixtures/**` | positive + negative fixture per detector; 10 ported 4.x fixtures |
| `certification/run.mjs`, `lanes.config.ts`, `matrix.config.ts`, `playwright.cert.config.ts` | REQ-QUAL-05, -06, -12 |
| `certification/{thresholds,ratchets,exemptions,console-allowlist,calibration,quarantine}.json` | thresholds and policy data |
| `certification/scenes/*`, `scenes.manifest.json`, `Scenes.stories.tsx` | REQ-QUAL-07, -08 |
| `certification/baselines/linux/{chromium,webkit,firefox}/**` | REQ-QUAL-24 |
| `certification/lanes/*.spec.ts` | §12.2 |
| `certification/runner/{shard-plan.mjs,build-bundle.mjs,worker-entry.sh,preflight.mjs}` | REQ-QUAL-65, -67 |
| `certification/review/{sr-matrix.template.json,visual-rubric.md}`, `certification/RELEASE_CHECKLIST.md` | REQ-QUAL-63, -72, -73 |
| `.storybook/preview.tsx` (replaces seed internals), `.storybook/blocks/index.tsx`, `.storybook/contract/StoryRoot.tsx`, `.storybook/environment/{StoryEnvironment.tsx,scenes.ts}`, `.storybook/lab/{MaterialLab.stories.tsx,MaterialLabFrame.tsx,LabControls.tsx,ContrastReadout.tsx,spec-export.ts}`, `.storybook/README.md` | REQ-QUAL-09, -10, -51, -53, -54 |
| `scripts/storybook/{write-cert-manifest,write-apg-index,write-build-manifest,verify-fresh,check-build-log,lint-titles,lint-story-copy,verify-showcase-imports}.mjs` | REQ-QUAL-01, -49..52, -56, -59 |
| `scripts/qual/{verify-css-perf.mjs,stylelint-perf/**,verify-dist-perf.mjs,lint-stories.mjs,lint-tests.mjs}` | REQ-QUAL-31, -44, -46, -55 |
| `lint/rules/qual/{no-transition-all,no-permanent-will-change,no-translatez-hack,no-global-pointer-listener,raf-requires-cancel,raf-requires-visibility-gate}.cjs`, `_strict.cjs` | REQ-QUAL-45 |
| `tests/perf/harness/{run-perf.mjs,grade.mjs,resolve-budgets.mjs,instrument.js,perf-results.schema.json}` | REQ-QUAL-34..38 |
| `stories/qual/{StartHere.mdx,perf/PerfFixtures.stories.tsx}` | REQ-QUAL-35, -52 |
| `showcase/<id>/**` ×10, `showcase/showcases.json`, `showcase/ShowcasePending.tsx` | REQ-QUAL-58, -59 |
| `tsconfig.storybook.json`, `stylelint.showcase.config.mjs`, `__mocks__/fileMock.js`, `jest.qual.config.js`, `scripts/qual/run-jest-qual.mjs` | story typecheck, showcase CSS allowlist, Jest asset mock, discovery of `packages/qa` and `certification` tests (§12) |
| `ci/qual.gitlab-ci.yml` (replaces seed), `ci/qual/**` | REQ-QUAL-64 |
| `fragments/{lanes,playwright,perf-budgets,review}/qual.ts(on)` | QUAL's own registrations |
| `docs/certification/{README.md,real-device-matrix.md}`, `apps/docs/content/qual/**` | docs |

## 9. Components/files to remove or deprecate

QUAL removes nothing outside its paths. Every 4.x certification artifact is already outside the 5.0 build on `next` through the C0-10 quarantine (`legacy/**`, PLAT deletes family by family) and C0-11 (GitHub workflows deleted). QUAL's obligations are (a) port what is kept, (b) never re-create what is retired, guarded by `packages/qa/test/no-retired-tools.test.ts` (fails if any of these names exists outside `legacy/**`):

| Retired (4.x) | Reason | Successor (QUAL) |
|---|---|---|
| `scripts/audit/storybook-visual-certification.mjs`, `tests/visual/design-system/storybook-visual-certification.spec.ts`, `scripts/audit/story-presentation-audit.js`, `audit:storybook:presentation` | smoke test; JSON self-agreement | L6, REQ-QUAL-49/50 |
| `scripts/verify-glass-pipeline.js`, `glass:validate`, `design-system-compliance.yml` score | string presence; 60% score | L1–L4 |
| `visual-regression.yml`, `scripts/visual-test-runner.js`, `scripts/visual-regression-system.js`, `visual-baselines/`, `jest.visual.config.js`, `tests/visual/visual-regression.test.js` | no comparison; wrong paths | L7 |
| `scripts/storybook-exhaustive-qa.js`, `scripts/audit/{3.0.7-source-audit,3.1-frame-loop-audit}.js`, `scripts/ci/{stale-3-3-scan,style-audit}.js` | stale, version-pinned | L1 gates |
| `token-purity-layout-audit.spec.ts` driver (3-hour single test) | unscalable driver | measurement ported to `packages/qa/src/inspect`, driver replaced by REQ-QUAL-12 |
| `scripts/audit/public-export-audit.js` heuristic | PascalCase `coveredBy` | REQ-QUAL-02 |
| `.storybook/StorySurface.tsx`, `previewSurface` (235 files), persona toolbars, backgrounds addon config, forced `reducedMotion` | opaque stage | REQ-QUAL-09, -10 |
| 12 text galleries, `AppShell.stories.tsx` (6 aliases), `AuraGlassIcons`, `CuratedComponentGuide`, `GlassAuditCoverage`, `ProductionWorkflowComponents`, `AuraGlass33ThemeShowcase`, `AppChromeVisualBaseline`, `LiquidGlassStateMatrix`, `ComprehensiveShowcase` stories, 128 stubs, `examples/*.tsx` | misrepresent the product | showcases, generated docs, Start Here; `IconsGallery` content becomes a CMP-owned icons story (S-41) |
| 355 templated `*.test.tsx` + 339 `.snap` | cannot fail | REQ-QUAL-31 keeps them from returning |
| `@storybook/jest`, `@storybook/testing-library`, `@storybook/test@9.0.0-alpha.2` | deprecated/alpha | not in the frozen set (§4.12) |
| `deploy-storybook.yml` / `gh-pages` / PR-preview comments | write tokens on PRs; dead URLs | PLAT `pages` job on GitLab Pages; previews = `storybook-static/` artifact |
| 45 root `*.mjs` probes | hard-coded `localhost:6006` | each useful probe re-expressed as a named detector with fixtures, or listed as dropped in the QUAL PR that ports it |

Component removals (`LiquidGlassShowcase` and friends) and their deprecation entries are PLAT's (R-01).

## 10. API changes

QUAL ships **no published runtime API**. Its surface is the contributor contract.

| Change | Surface | Class | Notes |
|---|---|---|---|
| `parameters.ag` (`StoryAgParameters`), `STORY_TAGS`, `REQUIRED_FLAGSHIP_STORIES` | every story (internal) | C-I | S-41, frozen |
| `tests/helpers` exports, `ApgHarness`, `PerfProbe` | contributor test API | C-I | S-40, frozen |
| `scene` global, `ag-cert=1` cert parameter | public Storybook site | C-E | `environment` (archived name) → `scene` |
| Storybook story ids and URL layout | public Storybook site | C-E (old 4.x ids 404) | PLAT's Pages assembly owns versioned paths and redirects |
| Story-only attributes `data-ag-story-content`, `data-ag-story-kind`, `data-ag-cert-ready`, `data-ag-lab-override`, `data-ag-state-cell` | Storybook only | C-I | never in `dist/` (REQ-QUAL-54, -70) |
| `VisualClassReport`, `PerfReport`, `ReleaseVerdict`, `SubjectIndex` | CI artifacts | C-I | S-55, frozen |
| npm scripts `test:visual*`, `glass:validate`, `audit:ux`, `audit:visual:evidence` gone | contributor | C-I | replaced by `node certification/run.mjs …` (no new `package.json` scripts; names frozen, S-52) |
| Public claims become generated | docs | C-I | numbers drop to honest counts |

## 11. Migration concerns

1. **Counts go down publicly.** "498 certified" becomes "N distinct visual components in 14 lanes" (N ≈160–250 on 5.0). PLAT's 4.1.1 notes explain the recount once; QUAL's claims are the only source after that.
2. **4.x would fail most 5.0 gates.** QUAL never runs 5.0 visual gates as blocking on the 4.x line; 4.x visual regressions are PLAT's `plat:test:visual-4x` (D-27). QUAL's 4.x nightly (REQ-QUAL-33) is report-only, and the 4.1.0 known-failures proof must *fail* by design.
3. **Baseline bootstrap** happens per family at the first pre-release where the family has no seed, through QUAL refresh PRs with L14 review, never one giant PR.
4. **Contributors lose local visual runs by default** (REQ-QUAL-67): iterate through the GitLab pipeline of the mirrored branch and its artifacts; the `glab ci view` / artifact browser is the supported loop.
5. **Mirror latency (W-6).** Stream branches reach GitLab only at the next `main` push or the daily 05:23 UTC reconcile until OD-8; QUAL's PR lanes therefore may report hours after a push. Lanes never wait on it; the merging stream does (contract §2.3).
6. **Storybook URLs change**; PLAT's Pages assembly carries any redirects.
7. **History is not rewritten** (D-32); clones use `GIT_DEPTH` defaults, and only `contract:ownership` fetches full depth.

## 12. Tests required

All run remotely in GitLab CI. Jest/Node tests run in L12 (or the named lane); browser specs run only under `.ag-playwright`/`.ag-gpu`/`.ag-aws-remote`.

**Discovery of QUAL's own tests.** The verbatim root configs do not reach every QUAL test path: `jest.config.js` ignores `<rootDir>/packages/` and has no `certification/**` match, and `playwright.config.ts` matches only `<kind>/<stream>/**` for `a11y/apg`, `e2e`, `visual`, `ssr`, `rsc` plus `a11y/browser/**` and `perf/browser/**`. Therefore:

- `packages/qa/test/**/*.test.ts` and `certification/**/*.test.mjs` run through `jest.qual.config.js` (QUAL, row B08 `jest.*.config.js`; ESM; same transform as the root config, `roots: ['<rootDir>/packages/qa', '<rootDir>/certification']`), invoked by `qual:test:selftest` and registered on L12 through `fragments/lanes/qual.ts` as a `node-script` row (`scripts/qual/run-jest-qual.mjs`). Every other QUAL `*.test.*` file (under `tests/**`) is found by the root `npm test`.
- `certification/lanes/**/*.spec.ts`, `tests/perf/qual/**/*.spec.ts` and `tests/a11y/apg/__selftest__/**/*.spec.ts` run only through `certification/playwright.cert.config.ts` (QUAL content, contract §4.11), whose built-in projects set `testDir` to those paths for chromium, webkit and firefox. `tests/e2e/qual/**` is matched by the root config.
- `tests/perf/qual/node-cold-import.test.mjs` is matched by the root Jest glob but skips (reported `pending`, never `pass`) unless `AG_LANE=L2` and `AG_REMOTE_RUNNER=1`, so plain L12 never runs it.
- `qual:test:selftest` fails if any file listed in §12.1 or §12.2 is collected by none of the three configs (`packages/qa/test/test-discovery.test.ts`).

### 12.1 Unit and self-tests (L12, `qual:test:selftest`)

| File | Asserts (REQ) |
|---|---|
| `packages/qa/test/{resolve,inventory,dhash-duplicates,lane-runner,fail-closed}.test.ts` | -01, -02, -03, -05, -06, -28, -33 |
| `packages/qa/test/{scenes-manifest,matrix-prune,pixel-gates,material-presence,ocr-contrast,labels}.test.ts` | -07, -12..-17 |
| `packages/qa/test/inspect.fixtures.test.ts` | -32 (10 ported verdicts identical to `15b6de6f7`) |
| `packages/qa/test/{baselines-budget,baseline-refresh,visual-class-report}.test.ts` | -24..-26 |
| `packages/qa/test/{l1-wiring,coverage-ratchet}.test.ts`, `tests/lint/qual/no-vacuous-assertions.test.ts` | -27, -30, -31 |
| `packages/qa/test/bci.test.ts`, `tests/perf/qual/{grade,budgets-frozen,css-perf,dist-perf}.test.ts`, `tests/lint/qual/{layer-forcing,raf,no-global-pointer-listener,story-rules}.test.ts` | -36, -37, -39, -44..-46, -55 |
| `tests/storybook/{storybook-config,StoryRoot,story-ready,cert-scenes,story-contract,MaterialLab,ContrastReadout,lab-not-shipped}.test.ts(x)`, `tests/storybook/{scene-bands,storybook-index,lint-titles,lint-story-copy,start-here,docs-pages,verify-fresh}.test.mjs` | -07..-11, -49..-57 |
| `tests/showcase/{showcase-coverage,showcase-determinism,showcase-a11y}.test.ts(x)`, `showcase-imports.test.mjs` | -58, -59 |
| `packages/qa/test/{no-committed-evidence,no-retired-tools,evidence-verify,claims,release-verdict,ci-fragment,shard-plan,quarantine,remote-guard,exemptions,deliverables,sr-matrix,review-record}.test.ts`, `certification/runner/preflight.test.mjs` | -60..-68, -71..-73 |
| `tests/helpers/__tests__/helpers.test.tsx`, `tests/contract/**` + `__selftest__/` | -69, -70 |

### 12.2 Browser lane specs

| File | Lane | Asserts (REQ) |
|---|---|---|
| `certification/lanes/environment-visual.spec.ts` | L6 | -04, -09, -12..-15, -17, -18 |
| `certification/lanes/preference-modes.spec.ts` | L6 | -16 |
| `certification/lanes/console.spec.ts` | L6 | -17 |
| `certification/lanes/behaviour.spec.ts`, `tests/a11y/browser/axe.spec.ts`, `tests/a11y/apg/__selftest__/harness.selftest.spec.ts` | L5 | -19, -20 |
| `certification/lanes/{ssr-hydration,overlay-stacking}.spec.ts` | L5 | -21 |
| `certification/lanes/engine.spec.ts` | L8 | -22 |
| `certification/lanes/motion.spec.ts` | L9 | -23 |
| `certification/lanes/regression.spec.ts` | L7 | -24..-26 |
| `certification/lanes/canaries.spec.ts` | L11 | -29 |
| `certification/lanes/known-failures.spec.ts` | nightly | -32 |
| `tests/perf/qual/{harness-selftest,surface-budget,pr-ratchet,regression-4x,mount-unmount-leak,host-backdrop-root,svg-lens-budget,webgl-budget,a11y-fallback-cost}.spec.ts` | L10 | -34, -35, -38, -40..-43 |
| `tests/perf/qual/node-cold-import.test.mjs` | L2 (remote) | -47 |
| `tests/perf/qual/devices/device-farm-run.mjs` | devices | -48 |
| `tests/e2e/qual/storybook/*.spec.ts` | L5 | -57 (showcase and Lab flows) |

### 12.3 Detector proofs

Each detector has a positive fixture (must fire) and a negative fixture (must stay silent) in `packages/qa/fixtures/`. The 4.1.0 known-failures proof (REQ-QUAL-32) is the end-to-end proof that the system can fail: **a certification that passes 4.1.0 is broken.**

## 13. Storybook requirements

This PRD owns Storybook's harness; component stories are owned by their component's stream. The contract every story author follows (enforced by REQ-QUAL-50):

1. Story files live beside their component (or in `stories/<stream>/`, `registry/**`, `showcase/**`) and import nothing from `.storybook/**`; MDX may import only `.storybook/blocks/index.tsx`.
2. `parameters.ag = { subject, kind, states?, refraction?, scenes?, tier?, axes? } satisfies StoryAgParameters`; tags from `STORY_TAGS`.
3. Flagships export `Playground`, `States`, `Keyboard` (tag `apg`); everything else (matrix, scenes strip, Lab framing, docs page) is rendered by QUAL from meta.
4. No story-supplied glass, no ink override, no stage background, no `!important`, no `--_ag-*` (REQ-QUAL-55).
5. Deterministic: no timers to reach state, fixed epoch, seeded data (REQ-QUAL-11).
6. Titles: `Flagships/<Group>/<Name>` or `Core/<Name>` with the 5.0 export name (REQ-QUAL-49).
7. Interactive defaults: `scene` `photo`, never white; the stage is gone.

## 14. Responsive requirements

1. Every visual cell runs at 1440×900 (DPR 1, fine pointer) and 390×844 (DPR 3, `hasTouch`, `isMobile`, coarse pointer); product scenes also at 768×1024 (layout gates only) and `mobile-productivity` at 834 (REQ-QUAL-18, -58).
2. Budgets are per pointer class: ≤6 blurred surfaces / BCI ≤2.0 at `(hover:hover) and (pointer:fine)`; ≤3 / ≤1.2 at `(pointer:coarse)`; BCI is also evaluated at 1920×1080 (REQ-QUAL-38).
3. Containment at 390 with all ancestor `overflow-x` clipping disabled; touch targets ≥44×44 (REQ-QUAL-18).
4. Showcases collapse via `AppShell` container queries (Sidebar → drawer, Inspector → bottom sheet) and are certified collapsed at 390.
5. Storybook viewports: `desktop` 1440×900, `laptop` 1280×800, `tablet` 834×1194, `mobile` 390×844. Lab cells ≥240×160 at 1440 and ≥160×120 at 390 (never below OCR-readable 14 px text). Scenes use `object-fit: cover` with focal points from `.storybook/environment/scenes.ts` so the busy region stays behind the subject.

## 15. Accessibility requirements

1. Rendered-pixel OCR contrast is the GA text metric (REQ-QUAL-13); jsdom contrast assertions are banned (REQ-QUAL-31).
2. axe runs in real browsers with `color-contrast` on; serious/critical fail, moderate fails on flagships; nightly and release cover all 8 scenes (REQ-QUAL-19).
3. Preferences are emulated where engines support them (`forcedColors`, `contrast`, `reducedMotion`); reduced transparency is forced with `data-ag-transparency="solid"` because Safari and Firefox do not expose the query; every emulation is read back (REQ-QUAL-17).
4. Forced colors, reduced transparency and lightweight produce 0 backdrop filters (REQ-QUAL-16, -43); a lightweight surface keeps its solved contrast (L4 runs for lightweight too).
5. Focus indicators ≥3:1 against adjacent pixels on every scene (REQ-QUAL-18).
6. APG keyboard scripts are required per flagship (REQ-QUAL-19); the manual SR matrix (REQ-QUAL-72) is a GA blocker; no mechanical lane reports SR behaviour as passed.
7. Reduced motion removes cost, not just movement: 0 infinite animations and 0 rAF after settle (REQ-QUAL-23).
8. Storybook chrome: toolbar globals have visible text labels; Lab controls are native inputs with `<label>` and `aria-valuetext` (e.g. "Blur 20 pixels"); the contrast read-out is a settle-only `role="status"` region; `video-frame.webm` is muted, pausable and does not autoplay under reduced motion (WCAG 2.2.2); under forced colors no story conveys information only by blur, tint or shadow.
9. Showcases: one `<main>`, own skip link, ordered headings, named landmarks; Thread is `role="log"` (REQ-QUAL-59).
10. Interaction latency p95 for `keydown` on `Menu`, `Select`, `Combobox`, `Tabs` ≤50 ms (a) / ≤100 ms (b) so assistive input does not lag (REQ-QUAL-38).

## 16. Performance requirements

Budgets the lanes enforce on the library (runtime half of S-44; byte rows are PLAT's L2 over `fragments/size-budgets/*`, with `DEFAULT_CEILINGS` and `PROVISIONAL_ROWS` in the contract):

| Budget | Value | REQ |
|---|---|---|
| Visible blurred surfaces / BCI / effective nesting | ≤6 / ≤2.0 / ≤1 fine; ≤3 / ≤1.2 / ≤1 coarse | -38 |
| Blur radius; full-viewport blur | ∈ {12, 20, 32} px, cap 32; scrim only, ≤12 px | -38, -44 |
| Backdrop filter chain | `blur() saturate() brightness()` or `ag-lens-*` url | -44 |
| Enhanced lenses | ≤2 fine / ≤1 coarse, each ≤25% viewport; one defs block | -38, -43 |
| WebGL contexts | ≤1; released on unmount; 0 frames hidden/offscreen; DPR ≤1.5 | -43 |
| Frame p95 (every flagship) | ≤16.7 ms @60 Hz on (a); ≤25 ms on (b); grade from (a)@120 Hz | -37, -38 |
| `Dialog` open/close + `AppShell` scroll | ≥50 fps and ≥0.85× blank on (c), desktop and mobile (4.1: 12–14, 19–23); on (a)/(b) the generic frame p95 ≤16.7 / ≤25 ms ceilings apply | -41, -38 |
| Long-animation frames >100 ms (settled window) | 0 (a), ≤1 (b) | -38 |
| Settled idle | 0 rAF, 0 intervals, 0 infinite animations; 0 `will-change` at rest | -23 |
| Heap | ≤1 MB delta after 10 cycles; dashboard scene ≤30 MB | -38, -42 |
| Node cold import | `.` median ≤150 ms, p90 ≤200 ms; small entries ≤30 ms | -47 |
| Grades | T1 ≥C, T2 ≥D, no ≥1-letter regression | -37 |
| PR ratchet | p95 regression ≤ max(10%, 1 ms); counts/BCI non-increasing | -40 |
| Real devices | ≤16.7 ms (Pixel 7, iPhone 13, Intel proxy); ≤25 ms mid-tier Android (one signed ≤33 ms) | -48 |

Budgets on the certification system itself:

| Budget | Value | REQ |
|---|---|---|
| QUAL jobs in a PR pipeline (p90) / main / release | ≤20 / ≤45 / ≤90 min | -65 |
| Per-cell capture p95; per-test timeout | ≤2.5 s; 60 s | -12 |
| Flake | ≥99.9% identical L7 verdicts on two nightly runs; quarantine ≤7 days, blocks release | -66 |
| Baselines | ≤80 KB each, ≤30 MB total | -24 |
| Scenes | ≤6 MB | -07 |
| Storybook build | ≤6 min; `storybook-static` ≤60 MB without maps; per-story preview JS (gzip) growth ≤10% release over release | -56 |
| Showcase assets | ≤12 images × ≤300 KB | -59 |
| Showcase runtime | scripted hover+scroll p50 ≥110 fps on 120 Hz desktop, ≥55 fps mobile; LCP ≤1.8 s desktop / ≤2.8 s mobile; ≤2 tasks >50 ms and none >150 ms above blank; Lab control → repaint ≤16 ms main-thread | -38 (as QUAL `perf-budgets` rows for showcase subjects) |

## 17. Acceptance criteria

Each is checked against the GitLab artifacts of the named SHA (never committed files).

- **AC-QUAL-01** Running L6/L7/L8 on the 4.1.0 Storybook reports every §5.6 known failure (app-shell OCR ≤2.2:1; modal 12 visible filters; contrast-more no-op on 12/12; showcase 12 filters under forced colors; `PageTransitionDemo` pageerror); 0 of them pass.
- **AC-QUAL-02** Adding one meta + story with `parameters.ag.subject` grows L6 cell count by exactly the §4.3 formula with **zero** edits under `certification/` or `packages/qa/`; `rg -n '\b(470|498|356)\b' packages/qa certification` returns 0.
- **AC-QUAL-03** Removing `@nonvisual` from a provider export fails L1 with `unclassified-export`.
- **AC-QUAL-04** 8 scenes with licences and bands; total ≤6 MB; `scenes--<id>` stories present; forcing a different scene changes ≥30% of pixels inside the largest `regular` surface (4.1: 0.000).
- **AC-QUAL-05** A synthetic opaque wrapper between scene and `Surface` fails `glass-over-nothing` in all three engines.
- **AC-QUAL-06** On the GA SHA, worst OCR word contrast across flagship cells ≥4.5:1 (≥3:1 large, ≥7:1 contrast-more), emitted in `claims.json` with its source.
- **AC-QUAL-07** On the GA SHA every `solid` and `forced-colors` cell has 0 elements with `backdrop-filter ≠ none`; every `contrast-more` cell differs from default by ≥0.5% of surface pixels.
- **AC-QUAL-08** A 2 px radius change in a CMP PR produces an L7 `changed` cell with a diff image and does **not** block the CMP PR; the GA verdict stays `ga: false` until a QUAL baseline-refresh PR with design approval and L14 records lands.
- **AC-QUAL-09** `visual-class.json` validates against `VisualClassReport`; a 1-pixel-row change in a default cell yields `changed: true` (`changedRatio > 0.001` of the element crop).
- **AC-QUAL-10** `ci-fragment.test.ts` passes: only `qual:*` jobs, every job extends a root template, `rules` on `$AG_SCOPE`/`$AG_LINE`, cross-stream `needs` only to `CI_JOBS` with `optional: true`, no GitHub/npm/cloud credential, no `merge_request_event`, every artifact has `expire_in`; `contract:ci-fragments` green.
- **AC-QUAL-11** Deleting any lane manifest from a release run makes `qual:certify:release` write `ga: false`, and the written file validates against `ReleaseVerdict` (S-55) and is accepted by the contract double `tests/contract-doubles/reports/release-verdict.json` schema check; under S-54 a `ga: false` verdict is what `plat:publish:npm` refuses for a GA tag (QUAL verifies only its file, never PLAT's job).
- **AC-QUAL-12** `git ls-files` returns 0 paths under `reports/`, `test-results/`, `playwright-report/`, `coverage/`, `.artifacts/`, `storybook-static/`; `no-committed-evidence.test.ts` passes.
- **AC-QUAL-13** At RC-1: `lint-tests.mjs` (or `auraglass/no-vacuous-assertions`) reports 0 violations repository-wide; coverage floors of REQ-QUAL-30 met for every non-seed directory.
- **AC-QUAL-14** L5–L9 execute every flagship in chromium, webkit and firefox; manifests list all three browser versions.
- **AC-QUAL-15** L11 is green on the GA SHA for every canary and `consumer-4x` (4.x tarball and post-`migrate 4to5`), from the packed tarball, 3-engine smoke 200/0 errors.
- **AC-QUAL-16** A full release run completes within 90 min on GitLab SaaS runners with the computed shard count; the AWS fallback preflight reports CA status without rotating anything.
- **AC-QUAL-17** Two nightly runs on one SHA agree on ≥99.9% of L7 cells.
- **AC-QUAL-18** L13 records `pass` for all 44 flagships on the RC SHA; L14 records exist for every flagship subject-state, the T0 matrix and all six S1 showcases with every criterion ≥3.
- **AC-QUAL-19** `perf-report.json` exists for every flagship and T2 subject; 0 T1 below C; 0 T2 below D; the harness self-test fails as designed on its injected regression.
- **AC-QUAL-20** All six S1 showcases and 44 flagship default stories: ≤6 / ≤3 blurred surfaces, BCI ≤2.0 / ≤1.2, nesting ≤1, in all three engines; `Dialog` and both `AppShell` scenes ≥50 fps and ≥0.85× blank on profile (c).
- **AC-QUAL-21** `settled-idle`, `mount-unmount-leak` and hydration stability green for every flagship; `node-cold-import` `.` median ≤150 ms on Node 20.19.0 and 22.
- **AC-QUAL-22** `verify-css-perf.mjs` and `verify-dist-perf.mjs` report 0 violations on the GA `dist/`; the six perf lint rules are at `error` everywhere with 0 violations.
- **AC-QUAL-23** After calibration, `budgets-frozen.test.ts` shows no `max` increase in any `perf-budgets`/`size-budgets` fragment row after the SHA in `certification/calibration.json`.
- **AC-QUAL-24** Real-device matrix recorded in `docs/certification/real-device-matrix.md` for RC-1 with every row within budget (only the mid-tier Android ≤33 ms exception allowed, signed).
- **AC-QUAL-25** Storybook IA test green: first five roots `Start Here`, `Material Lab`, `Scenes`, `Showcases`, `Flagships`; 0 version groups, 0 duplicates, 0 Default/Variants stubs; 12 Material Lab pages in order.
- **AC-QUAL-26** 44/44 flagships have `Playground`, `States`, `Keyboard` (`apg`) stories linked to an existing APG spec and a generated docs page with 6 sections.
- **AC-QUAL-27** 10 showcases build against the packed tarball; S1 union = 44/44 flagships; showcase determinism and a11y tests green; 0 `ShowcasePending` renders on the GA SHA.
- **AC-QUAL-28** Story-supplied-glass checks report 0 on every path at RC-1; 0 `--_ag-*` outside `.storybook/lab/**`.
- **AC-QUAL-29** `storybook-static/ag-build.json` `sha` on the deployed Pages site equals the release SHA; `verify-fresh.mjs` rejects a deliberately stale build.
- **AC-QUAL-30** `tests/contract/**` green on the GA SHA and on every `next` pipeline since C0 that did not change a seam; its mutation self-test names the broken seam id.
- **AC-QUAL-31** `release-verdict.json` on the GA tag has `ga: true` with G-01..G-16 all `pass`, and the rendered `RELEASE_CHECKLIST.md` has no hand-ticked mechanical item.

## 18. Definition of done

1. Every REQ-QUAL-01..73 implemented with its §12 test green on `next`.
2. All 14 lanes exist and fail closed at release scope (AC-QUAL-01, -11), and every `qual:*` job that gates PRs is flipped to `allow_failure: false` after its first green run on `next`.
3. Seeds owned by QUAL (`tests/helpers/*`, `tests/a11y/apg/harness.ts`, `.storybook/preview.tsx`, `.storybook/blocks/index.tsx`, `ci/qual.gitlab-ci.yml`) carry no `@ag-contract-seed` marker.
4. Baselines bootstrapped per family and human-approved; budgets calibrated once and frozen.
5. GA run green; `ReleaseVerdict.ga === true`; evidence retained as release artifacts; claims generated.
6. `apps/docs/content/qual/` and `docs/certification/README.md` document lanes, subject registration (F `lanes`, F `playwright`, F `perf-budgets`, `parameters.ag`), baseline refresh, exemptions and remote iteration.
7. No heavy lane, browser or Docker workload ran on a developer Mac while delivering this PRD; every AWS fallback session was tagged and terminated.

## 19. Dependencies (frozen contract seams only)

No PRD and no task of another stream is a dependency. Every cross-stream need is a seam of contract-v1.1.

**Provided by QUAL** (others code against these from day 0; the seeds exist from C0):

| Seam | What | Where | Consumers |
|---|---|---|---|
| S-40 | test helper API, APG harness, perf probes | `tests/helpers/index.ts`, `tests/helpers/setup.ts`, `tests/a11y/apg/harness.ts` | all streams' tests |
| S-41 | story metadata, tags, kinds, `REQUIRED_FLAGSHIP_STORIES` | `src/contracts/testing.ts` (types); `.storybook/preview.tsx` (behaviour) | every story author |
| S-42 | scene ids, assets, `/scenes`, `scenes--<id>` | `certification/scenes/` | MAT, CMP, SURF, PLAT |
| S-43 | lane ids, `LaneRegistration`, `CERT_JOBS`, `LANE_COMMAND` | `certification/run.mjs`, `ci/qual.gitlab-ci.yml` | all (register through F `lanes`) |
| S-44 (runtime) | `PerfBudgetRow` enforcement and default ceilings | `tests/perf/harness/**`, `certification/thresholds.json#perf` | all (rows through F `perf-budgets`) |
| S-48 | evidence directory and artifact naming | every `qual:*` job | all lanes |
| S-51 | docs blocks and generated docs pages | `.storybook/blocks/index.tsx`, preview | MDX authors; PLAT migration pages |
| S-55 | `VisualClassReport`, `PerfReport`, `ReleaseVerdict`, `SubjectIndex` | `.artifacts/qual/*.json`, `storybook-static/cert-manifest.json` | PLAT change class, docs claims, publish |

**Consumed by QUAL** (tested against seeds, stubs or doubles until real code lands):

| Seam | Used for | Day-0 stand-in |
|---|---|---|
| S-01, S-02, S-33 | attribute registry, class and part grammar for forcing cells and asserting DOM | `src/contracts/material.ts`, `components.ts` |
| S-03, S-04, S-10, S-11 | CSS vars, layers, token manifest (tint floors, Lab export shape) | `contracts/stubs/reference.css`; `tests/contract-doubles/tokens/manifest.json` |
| S-05, S-06 | `Surface` family in scenes, Lab, perf fixtures | MAT seed `src/material/index.ts` |
| S-12, S-13 | motion tokens; `subscribeFrame` for rAF lint guidance | MAT seed `src/motion/index.ts` |
| S-20..S-26 | provider, preferences, portal root, LayerStack, announcer in preview, helpers and stacking tests | MAT seed `src/theme/index.ts` |
| S-30, S-31 | CMP component contracts (scene strip, sentinels); `ComponentMeta` for inventory, matrices, docs, deliverables | CMP seeds; `tests/contract-doubles/cmp/*` (recorded `double-pass`) |
| S-35 | `ENTRIES` for inventory and showcase import check | `src/contracts/entries.ts` |
| S-38, S-39 | deprecation and codemod fragments read by L3/L11 and G-04 | `tests/contract-doubles/fragments/` |
| S-45 | `ReviewItem`, `A11yBaseline`, `SrRecord` | `src/contracts/fragments.ts` |
| S-46 / §3.3 | registry block file contract (`index.tsx`, `fixtures.ts`) for showcases | `ShowcasePending` while empty (contract §5.3) |
| S-47 | QUAL's six lint rule names and the rollout rule | §4.11 loader |
| S-36 | package name `@auraglass/qa` (private, never published) and the workspaces list | §4.12 |
| S-49, S-52 | frozen dependency set and script names (`storybook:build`, `test`, `test:contract`, `lint`, `typecheck`) | §4.12 |
| S-50 | `loadFragments(kind)` | `src/contracts/load-fragments.mjs` |
| S-53 | root `.gitlab-ci.yml` templates, `AG_SCOPE`/`AG_LINE`, `CI_JOBS` needs | root file from C0-11 |
| S-54 | `plat:publish:npm` reads `ReleaseVerdict` | none needed (QUAL only writes) |

## 20. Execution order (parallel internal lanes, disjoint files)

All lanes start on day 0 and run in parallel inside the QUAL stream; each owns disjoint files, so lanes never block each other. Arrows inside a lane are same-stream task order only.

| Lane | Files (disjoint) | Order inside the lane |
|---|---|---|
| Q1 Contract and helpers | `tests/contract/**`, `tests/helpers/**`, `tests/a11y/apg/harness.ts` (+ selftest), `tests/a11y/browser/**` | conformance suite green on seeds (C0) → real helpers (REQ-QUAL-69) → APG harness and axe spec (-20) → mutation self-test |
| Q2 Lane runner and CI | `certification/run.mjs`, `lanes.config.ts`, `matrix.config.ts`, `certification/runner/**`, `ci/qual.gitlab-ci.yml`, `ci/qual/**`, `packages/qa/src/{resolve,inventory,matrix}/**` | runner + states + fail-closed (-05, -06) → resolver, inventory (-01, -02) → CI fragment jobs (-64) → shards and child pipeline (-65) → AWS fallback (-67) → `allow_failure` flips |
| Q3 Scenes and pixel gates | `certification/scenes/**`, `packages/qa/src/{pixel,ocr,inspect}/**`, `packages/qa/fixtures/**`, `certification/lanes/{environment-visual,preference-modes,console,engine,known-failures}.spec.ts`, `certification/thresholds.json` | port 4.x measurement + 10 fixtures (-32) → scenes + manifest (-07) → pixel gates, OCR, glass-over-nothing (-12..-18) → engine lane (-22) → known-failures proof on 4.1.0 (AC-QUAL-01) |
| Q4 Regression and evidence | `certification/baselines/**`, `certification/lanes/regression.spec.ts`, `packages/qa/src/evidence/**`, `certification/{exemptions,console-allowlist,quarantine}.json`, `certification/RELEASE_CHECKLIST.md`, `certification/review/**` | evidence layout + guard (-60) → L7 + `VisualClassReport` (-24, -26) → baseline refresh flow (-25) → verifier, claims, verdict (-61..-63) → L13/L14 tooling (-72, -73) |
| Q5 Behaviour, motion, canaries, unit | `certification/lanes/{behaviour,ssr-hydration,overlay-stacking,motion,canaries}.spec.ts`, `certification/ratchets.json`, `scripts/qual/lint-tests.mjs`, `tests/lint/qual/no-vacuous-assertions.test.ts` | L5 wiring on contract doubles (-19) → SSR/stacking (-21) → L9 (-23) → L11 incl. 4.x tarball (-29, -33) → L12 floors and vacuous gate (-30, -31) |
| Q6 Performance | `tests/perf/**` (QUAL), `packages/qa/src/perf/**`, `scripts/qual/{verify-css-perf.mjs,stylelint-perf/**,verify-dist-perf.mjs}`, `lint/rules/qual/**`, `stories/qual/perf/**`, `fragments/perf-budgets/qual.ts`, `certification/calibration.json`, `docs/certification/real-device-matrix.md` | lint rules + static CSS/dist gates (-44..-46) → harness, BCI, blank baseline, self-test on a blank page and the 4.1 baseline (-34..-36) → budgets and grades (-37, -38) → node import (-47) → PR ratchet on GPU (-40) → calibration event (-39) → 4.1 regression and leaks (-41..-43) → devices before RC-1 (-48) |
| Q7 Storybook and Lab | `.storybook/**` (except `main.ts` verbatim fields), `tsconfig.storybook.json`, `scripts/storybook/**`, `stories/qual/StartHere.mdx`, `tests/storybook/**`, `scripts/qual/lint-stories.mjs`, `tests/lint/qual/story-rules.test.ts`, `tests/e2e/qual/storybook/**` | preview, `StoryRoot`, cert mode, scene stories (-08..-11) → build, freshness, manifests (-56) → IA, titles, story contract, docs blocks/pages, Start Here (-49..-52) → Material Lab (-53, -54) → story-glass gate (-55) → interaction flows (-57) |
| Q8 Showcases | `showcase/**`, `stylelint.showcase.config.mjs`, `tests/showcase/**` | ten showcase shells rendering `ShowcasePending` (-58) → hygiene, import, determinism checks (-59) → each showcase turns real as its block or entries land (no edit needed when they do, beyond composition) |

Milestones are **state-triggered**, never dates that wait on others: calibration at the first pre-release where `Button` and `Dialog` have no seed; baseline bootstrap per family when its seeds are gone; L13/L14 at RC-1.

## 21. Concurrency statement

- **What QUAL provides via the contract:** S-40, S-41, S-42, S-43, S-44 (runtime), S-48, S-51, S-55 (§19). All exist as C0 seeds or frozen types, so other streams never wait for QUAL: they register lanes and Playwright projects in their own fragments, author stories with `parameters.ag`, write specs in `tests/<kind>/<stream>/`, and run Storybook on the C0 preview.
- **What QUAL consumes:** only frozen seams (§19). Before real code lands QUAL tests against MAT/CMP/PLAT seeds, `contracts/stubs/reference.css`, `tests/contract-doubles/{cmp,fragments,tokens,reports}/**`, and real **4.x code today** (the published `aura-glass@4` tarball and the `v4.1.0` Storybook). Results against seeds are `pending`, against doubles `double-pass`; neither is a pass, so nothing is certified by a stand-in.
- **Why QUAL never waits:** (1) subjects, lanes, Playwright projects and perf rows are **discovered** (S-41 parameters, S-31 metas, F `lanes`/`playwright`/`perf-budgets`/`review`), so QUAL needs no edit when another stream lands work; (2) every cross-stream CI `needs` is `optional: true` and a missing artifact is regenerated locally in the job (`npm pack`, `npm run storybook:build`) or reported `pending`; (3) QUAL's verdict and reports are files PLAT reads, never jobs PLAT calls; (4) gates on other streams' paths start report-only (lint rollout, story-glass, vacuous tests, CSS perf) and become errors at RC-1 by rule, so QUAL can never turn another stream red early, and another stream's failure on its own paths is `pre-existing` for QUAL's PRs; (5) L7 drift never blocks a non-QUAL PR (REQ-QUAL-25), so no stream waits for a QUAL baseline PR; (6) calibration, bootstrap and RC milestones are state-triggered events, not dependencies.
- **Why no one waits on QUAL:** the contract conformance suite (REQ-QUAL-70) passes on seeds at C0; required root jobs are the three `contract:*` jobs; every `qual:*` job starts `allow_failure: true` and is flipped by QUAL only after it is green on `next`.
- **Branches:** all QUAL work is on `next-qual/*` worktrees cut from `next` and merged at least daily; QUAL has no work on `release/4.x` beyond its (empty) fragment files and its CI fragment, which has no 4.x jobs.

## 22. Open items

| Id | Item | Default until decided (non-blocking) | Close by |
|---|---|---|---|
| OI-QUAL-01 | Path mismatch: this file is at `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (task instruction), but row A18 names `docs/auraglass-5/AURAGLASS_QUALITY_SHOWCASE_PRD.md`; `prd/` falls through to B21 (PLAT) | treat as QUAL's document | contract PR (additive): widen A18 to `docs/auraglass-5/{,prd/}AURAGLASS_*_PRD.md`, or move the five PRDs |
| CC-Q1 | Add QUAL lint rules `no-vacuous-assertions` and `story-no-optics`, `story-no-important`, `story-no-ink-override`, `story-no-tone-class`, `story-no-stage-background`, `story-no-private-vars` to `contracts/lint-rule-owners.json` (the loader throws on unregistered rule files) | the checks run as `scripts/qual/lint-{tests,stories}.mjs` registered on L1 (REQ-QUAL-31, -55) | additive contract PR (minor bump) |
| CC-Q2 | A frozen list of Lab spec-knob private variables (e.g. `LAB_SPEC_VARS` in `src/contracts/tokens.ts`, MAT-proposed) | Lab spec panel shows "pending seam"; public knobs work | additive contract PR by MAT or QUAL |
| CC-Q3 | Add `REPORTS.claims = '.artifacts/qual/claims.json'` and its type to S-55 so PLAT's G-14 gate can read computed claims | PLAT reads `PerfReport` and `ReleaseVerdict`; `claims.json` published as an extra artifact | additive contract PR |
| CC-Q4 | OCR binary: tesseract is installed per job from the image's package manager (not an npm dependency) | pinned apt version recorded in manifests | if an npm OCR package is preferred, contract PR to S-49 |
| OI-QUAL-02 | Long-term release evidence retention beyond GitLab's 90-day `expire_in` (archived plan: ≥400 days on GitHub releases, which CI may no longer write) | 90 days + "keep latest artifacts" on tags (OD-11) | owner decision: GitLab generic package registry in the mirror project vs S3 via the AWS runner role; neither may push git refs to the mirror |
| OI-QUAL-03 | Capture rate on `saas-linux-large-amd64` and GPU runner availability/quotas on the group's GitLab tier are unmeasured; shard count may exceed 200 | first nightly measures; if >200 shards, the release matrix splits into two child pipelines | first nightly on `next` |
| OI-QUAL-04 | Playwright `forcedColors`/`contrast` emulation coverage per engine at 1.63.0 is unconfirmed | forced-colors cells Chromium-only; read-back fails silent no-ops (REQ-QUAL-17) | first remote run updates `matrix.config.ts` |
| OI-QUAL-05 | AWS remote runner (tag `auraglass-aws-remote`) for real devices and macOS Safari is not registered (OD-11); Device Farm and `mac1.metal` access and quota unverified | `qual:certify:devices` stays `when: manual`, `allow_failure: true`; L10 devices `pending` | operator registers runner; record any IAM denial with the exact action and minimal grant |
| OI-QUAL-06 | `mcr.microsoft.com/playwright:v1.63.0-noble` existence and GitLab pipeline creation for multi-ref mirror pushes are unverified (contract §7.4) | QUAL's first `qual:build:storybook`/`qual:certify:l5` run on `next` verifies the image pull and records the digest in the lane manifest; a missing image is reported in that job's log with the nearest available tag | QUAL's own first pipeline (PLAT may confirm independently; neither waits on the other) |
| OI-QUAL-07 | Mirror latency W-6 delays QUAL's PR lanes for stream branches | lanes run when the branch reaches GitLab | OD-8 (GitLab pull mirroring), Gurbaksh's decision |
| OI-QUAL-08 | Design-reviewer CODEOWNERS team for `certification/baselines/**` and `certification/thresholds.json` is a GitHub org setting | QUAL lead approves; recorded | operator creates the team; CODEOWNERS regenerated in a contract PR |
| OI-QUAL-09 | Sentinel `Button` story id depends on CMP's final Button grammar | `Button` `Playground` by subject, resolved through S-41 | none needed (resolved by subject, not id) |
| OI-QUAL-10 | Contract §4.13.5 lists "L2/L3/L11 on the 4.x tarball" in the 4.x PR-branch pipeline, but lane jobs are QUAL's (§4.13.4 rule 7), the QUAL seed `.qual-lane` is `$AG_LINE == "5x"` only, and `certification/**` does not exist on `release/4.x` | 4.x L2/L3/L11 coverage runs from `next` pipelines against the published and the `release/4.x`-head tarballs (REQ-QUAL-33); 4.x PR gating is PLAT's 4.x gates | additive contract PR clarifying the §4.13.5 row (non-blocking) |

---

## Appendix A. Old REQ → new REQ mapping

### A.1 QA (archived `AURAGLASS_QA_CERTIFICATION_PRD.md`)

| Old | New | Note |
|---|---|---|
| QA-01 | 01 | explicit subjects via S-41 + `SubjectIndex` |
| QA-02 | 02 | inventory from `ENTRIES` + metas |
| QA-03 | 03 | |
| QA-04 | 04 | |
| QA-10 | 07 | merged with SB-04 bands |
| QA-11 | 09 | `ag-cert=1` parameter instead of a `certify` global; merged with SB-05 |
| QA-12 | 14 | floor from S-11 token manifest |
| QA-13 | 13 | |
| QA-14 | 15 (+ 18, 38) | containment/density into 18/38 |
| QA-15 | 16 | |
| QA-16, QA-17 | 17 | merged |
| QA-18 | 19 | |
| QA-19 | 21 | merged with PERF-30 |
| QA-20 | 37, 40 | lane wiring folded into the perf REQs |
| QA-21 | 23 | merged with PERF-24, -26 |
| QA-22 | 38 | merged with PERF-17 |
| QA-23 | 22 | |
| QA-24 | 24 | |
| QA-25 | 25 | labels → QUAL baseline-refresh PRs (CI reads no GitHub labels) |
| QA-26 | 26 | QUAL writes `VisualClassReport`; 4.x captures are PLAT's `plat:test:visual-4x` |
| QA-27 | 27 | |
| QA-28, QA-29 | 28 | discovery-only |
| QA-30 | 61 | |
| QA-31 | 62 | |
| QA-32 | 60 | |
| QA-33 | 60 | GitLab `expire_in` |
| QA-34 | 64 | GitHub workflows → `ci/qual.gitlab-ci.yml` |
| QA-35 | 63 | publish reads `ReleaseVerdict` (S-54/S-55) |
| QA-36 | 06 | |
| QA-37 | 65 | |
| QA-38, QA-39 | 29 | |
| QA-41 | 31 | script until CC-Q1 |
| QA-43 | 30 | CLI thresholds (jest config verbatim) |
| QA-52 | 32 (probe porting), §9 | |
| QA-60 | 67 | |
| QA-61, QA-62, QA-64 | 67 | scoped to the AWS fallback |
| QA-63 | 66, 11 | |
| QA-70 | 72 | |
| QA-71, QA-72 | 73 | |
| QA-73 | 68 | |
| QA-80, QA-81 | 63 | G-01..G-16 |
| §12.3 known failures | 32 | |
| §14.5 targets, §15.7 focus | 18 | |

### A.2 SB (archived `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md`)

| Old | New | Note |
|---|---|---|
| SB-01, SB-02, SB-03, SB-06, SB-07 | 10 | frozen globals; `environment` → `scene`; motion default `full` per frozen preview (OS floor applied by provider) |
| SB-04 | 07 | |
| SB-05 | 09 | |
| SB-08, SB-10, SB-11, SB-14 | 49 | |
| SB-09 | 52 | |
| SB-12, SB-13 | 50 | required set reduced to the contract's `Playground`, `States`, `Keyboard`; matrix etc. rendered by decorators |
| SB-15, SB-45 | 57 | Vitest addon dropped (not frozen); flows as Playwright specs |
| SB-16 | 50 | story-only props are owner-path failures |
| SB-17 | 51 | generated docs pages (S-51) instead of QUAL-authored MDX |
| SB-18 | 53 | Lab stories now QUAL's (`.storybook/lab/**`) |
| SB-19, SB-20, SB-21 | 54 | |
| SB-22 | 58 | blocks per contract §3.3 |
| SB-23..SB-26 | 59 | |
| SB-27, SB-33 | §9 | legacy story deletion by quarantine/PLAT |
| SB-30..SB-32 | 55 | script until CC-Q1; ratchet = per-stream report-only counts |
| SB-40 | 08 | strip uses CMP flagships only |
| SB-41 | §9 | |
| SB-42 | 01 | `SubjectIndex` at `storybook-static/cert-manifest.json` |
| SB-43 | 11, 09 | |
| SB-46, SB-47, SB-49, SB-54..SB-57 | 56 | |
| SB-48 | 57, 19 | |

### A.3 PERF (archived `AURAGLASS_PERFORMANCE_PRD.md`)

| Old | New | Note |
|---|---|---|
| PERF-03 (forbidden modules), PERF-07, PERF-20 (JS), PERF-31 | 46 | |
| PERF-09 | 47 | |
| PERF-12, PERF-13, PERF-20 (CSS), PERF-23 (CSS), PERF-25 | 44 | |
| PERF-15, PERF-21, PERF-22, §15.1 | 43 | |
| PERF-17 | 38 | |
| PERF-23 (JS), PERF-28, PERF-29 | 45 | |
| PERF-24, PERF-26 | 23 | |
| PERF-27 | 42 | |
| PERF-30 | 21 | |
| PERF-32 | 34 | |
| PERF-33 | 35 | |
| PERF-34 | 37 | |
| PERF-35 | 41 | |
| PERF-36 | 40 | |
| PERF-37 | 48 | |
| PERF-38 (runtime half) | 39 | |
| §4.3 BCI | 36 | |
| §15.7 interaction latency, §16 tables | 38 | |

### A.4 Deliberately dropped from QUAL (with reason)

| Old | Reason |
|---|---|
| QA-40, QA-44, QA-50, QA-51 | 4.x templated tests, jest hygiene, retired certification scripts and workflows are on `legacy/**` (C0-10) or deleted at C0-11; PLAT deletes legacy families. QUAL only guards against re-creation (§9) |
| QA-42 | per-flagship behavioural test content belongs to each component owner; QUAL checks presence through G-04 (REQ-QUAL-71) |
| SB-50..SB-53 | Storybook deploy, versioned paths and PR previews move to PLAT's GitLab Pages job (contract §4.13.6); Cloudflare previews and `gh api` checks are gone (no GitHub credential in CI) |
| PERF-01, PERF-02 (bytes), PERF-10, PERF-11 | byte budgets, CSS bytes and rigged-gate removal are PLAT's L2 over `fragments/size-budgets/*` (S-44 bytes half); QUAL's calibration freeze (REQ-QUAL-39) covers the ratchet |
| PERF-04, PERF-05, PERF-06 | side-effect, purity and import-confinement gates are PLAT's |
| PERF-08 | dev-counter elimination tests a MAT internal → MAT (R-13) |
| PERF-14 | optics lint is MAT's (`no-optics-outside-material`) |
| PERF-16, PERF-39 | nesting collapse and dev counter behaviour test MAT internals → MAT; QUAL keeps the generic nesting ≤1 measurement (REQ-QUAL-38) |
| PERF-18, PERF-19 | component-specific counts (Dialog 2, AppShell ≤3) become owner `perf-budgets` rows that QUAL enforces (REQ-QUAL-38 lists them as recommended rows) |
| SB-31 (`eslint-comments` plugin) | not in the frozen dependency set; QUAL's script checks ignore disable comments instead |
