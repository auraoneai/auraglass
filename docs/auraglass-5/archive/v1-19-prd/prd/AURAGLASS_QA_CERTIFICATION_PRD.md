# AuraGlass 5.0 PRD: QA and Certification (Certification Plan, deliverable L)

| Field | Value |
|---|---|
| Key | **QA** (SC-01 crosswalk in `prd/_shared-contracts.md`; other PRDs are cited as `PRD-<KEY>` or by §16 id, and task ids use the `QA-NNN` prefix) |
| PRD id | **PRD-18** (program self-id, an alias only; the task fragment `prd` field keeps it). **Numbering note:** `AURAGLASS_5_TARGET_ARCHITECTURE.md` §16 lists this boundary as **PRD-19 `PRD-19-certification-infra.md`** and uses PRD-18 for CLI/codemods/registry (that boundary is filed as `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md`). The boundary below is exactly the architecture's PRD-19 row plus the certification plan (deliverable L). Cross-references to other PRDs in this document use the **architecture §16 numbering** unless a file name is given |
| Title | QA and certification: lanes, gates, environment matrix, evidence, release certification |
| Owner area | QA and certification infrastructure. Owns `packages/qa/**` (NEW, private, never published), `certification/**` (NEW), `.github/workflows/certify-*.yml` (NEW), the release certification checklist, the evidence manifest schema, and the retirement of the 4.x certification layer |
| Status | **Draft** |
| Date / baseline | 2026-10-06, `aura-glass` 4.1.0 at `15b6de6f7` (worktree carries 4 uncommitted files: `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js`, `scripts/ci/verify-pack.js`, `reports/3.2-release/vite-integration.json`) |
| Architecture anchors | §15 (certification model: §15.1 environment matrix, §15.2 lanes and gates, §15.3 evidence and claims, §15.4 Material Lab), §16 PRD-19 row (exit criterion: "every lane exists and fails closed"), §1.3 GA gates (visual certification, contrast), §4.7 tiers/budgets/engine matrix, §7.3 contrast guarantee, §3.6 size budgets, §11.3 per-flagship DoD |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md`; `docs/auraglass-5/AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `docs/auraglass-5/AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md` (§4.2 pixel gates, verbatim thresholds; §4.3 failure modes); `docs/auraglass-5/AURAGLASS_MISSING_CAPABILITY_MAP.md`; `docs/auraglass-5/autopsy/qa-certification.md` (QA-CERTIFICATION-01..14, with adversarial verdicts); `docs/auraglass-5/autopsy/runtime-remote.md` (fresh remote Chromium evidence, runs 1–3); `docs/auraglass-5/autopsy/visual-quality.md`; `docs/auraglass-5/autopsy/storybook-showcase.md` (STORYBOOK-SHOWCASE-01..16); `docs/auraglass-5/autopsy/history-hygiene.md` (HISTORY-HYGIENE-01, -04, -09); `docs/auraglass-5/autopsy/accessibility.md`; `docs/auraglass-5/autopsy/performance.md`; `docs/auraglass-5/research/translucent-a11y-perf.md`; `docs/auraglass-5/component-inventory.json` |
| Related decisions | **D-32** (evidence is CI artifacts, never committed; README claims generated from the GA run), **D-27** (visible pixel change counts as breaking on maintenance branches), **D-09** (budgets enforced by design + dev warning + certification; no production downgrade), **D-10** (tier/engine resolved pre-paint; the 1×1 pixel probe exists only in certification), D-04/D-05 (tier vocabulary; enhanced Chromium-only, opt-in), D-11 (OS signals are floors), D-12 (`clear` without backdrop renders `regular`), D-13 (Base UI foundation), D-24 (zero `!important`), D-26 (per-import budgets calibrated in the remote perf lane), D-29 (dependency allowlist), D-01 (4.1.1 trust patch first) |
| Depends on | PRD-PKG (build/exports manifest PKG-005; lint/jest wiring PKG-015; `glass-pipeline.yml` PKG-038; size budgets PKG-048/049; canary fixtures), PRD-REL (classifier `visual-class.mjs` REL-040, publish workflow `.github/workflows/publish-npm.yml` per SC-05, CODEOWNERS REL-053, frozen fixture REL-115; consumes the captures produced here), PRD-TRUST (`reports/` out of the tree; claim retractions; probe deletion; npm-pack helper TRUST-002; evidence-dir helper TRUST-006), PRD-DS (contrast matrix, literals gate DS-072/073), PRD-A11Y (axe spec, APG harness A11Y-073, SR record schema), PRD-SB (`StoryRoot`, cert manifest, preview SB-048), PRD-PERF (perf harness PERF-039) |
| Consumed by | Every component PRD (PRD-04..PRD-15 in §16 numbering) for its "certified in every lane" exit criterion; PRD-20 docs (generated claims); PRD-21 labs (admission gate reuses lanes) |
| Requirement prefix | `REQ-QA-NN` |
| Acceptance prefix | `AC-QA-NN` |

Conventions: "NEW" marks a path that does not exist at `15b6de6f7` (checked with `rg --files` / `test -e`). All other paths were verified to exist. Line references are to `15b6de6f7`. No screenshot was viewed while writing this PRD; every visual statement is measured (from the autopsy evidence) or a requirement for future human review.

**Boundary reconciliation with sibling PRDs (explicit deviations from the §16 PRD-19 row, review pass 2026-10-06).** §16 lists "Material Lab", "perf harness and grades" and "canaries" inside PRD-19. Sibling PRDs have since taken the implementation of those artifacts, and this PRD **consumes** them and owns only the lane that runs them, its evidence and its fail-closed wiring:

| Artifact | Implementation owner (file) | This PRD owns |
|---|---|---|
| Material Lab stories, `environment` global, `StoryRoot` `[data-ag-story-content]`, `.storybook/cert-manifest.json` (REQ-SB-05, -40, -42) | PRD-04 (`AURAGLASS_MATERIAL_ENGINE_PRD.md` §13) and Storybook PRD (`AURAGLASS_STORYBOOK_SHOWCASE_PRD.md`) | scene assets + manifest (REQ-QA-10), `certify:1` mode (REQ-QA-11), capture harness |
| Perf harness `tests/perf/harness/{run-perf.mjs,grade.mjs}`, metric definitions, profiles, grade formula (REQ-PERF-32..38) | `AURAGLASS_PERFORMANCE_PRD.md` | L10 lane wiring, host placement, evidence (REQ-QA-20) |
| Consumer canary fixtures `canaries/{next16,next15,vite,vite-tailwind4}/` (REQ-PKG-80..86) and the frozen 4.x fixture `tests/fixtures/consumer-4x/` (SC-08: owner PRD-REL, REL-115, contents contract REL §11.4; this PRD owns only the `consumer-4x-frozen` job in `certify-main.yml`) | PRD-02 (`AURAGLASS_PACKAGING_BUILD_PRD.md`), PRD-01 | L11 lane wiring, 3-engine smoke, the `consumer-4x-frozen` CI job (PRD-01 §12), evidence (REQ-QA-38, -39) |
| Browser axe spec `tests/a11y/browser/axe.spec.ts` (REQ-A11Y-42), APG harness, SR record schema `tests/a11y/manual/sr-record.schema.json` | PRD-05 (`AURAGLASS_ACCESSIBILITY_PRD.md`) | L5/L13 lane wiring and evidence (REQ-QA-18, -70) |
| Visual-class classifier `scripts/release/visual-class.mjs` (REQ-REL-12/-13), tag workflow `.github/workflows/publish-npm.yml` (SC-05: the file name is kept because the npm trusted-publisher binding is tied to it; owner PRD-REL, 4.1.1 instance TRUST-077), `.github/CODEOWNERS` (REL-053) | PRD-REL, PRD-TRUST | the capture inputs (REQ-QA-26) and the reusable `certify-release.yml` verify job (REQ-QA-34/-35) |
| Rendering claims into README/docs/`llms.txt` (`scripts/docs/gen-claims.mjs`, `lint-claims.mjs`, REQ-DX-77) and release notes (`scripts/release/release-notes.mjs`, REQ-REL-23) | PRD-20 (`AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md`), PRD-01 | `claims.json` (REQ-QA-31) |
| Deletion of the 45 root `.mjs` probes (REQ-TRUST-36) | PRD-00 | nothing (REQ-QA-52 only re-expresses useful logic as detectors) |

---

## 1. Problem

AuraGlass 4.1.0 shipped with the claim "498 visual targets certified green" (`RELEASE_NOTES_4.1.0.md:3,7,18`; commit `15b6de6f7`). That claim cannot be reproduced from the repository, the certification stack that produced it cannot fail on visual grounds, and the evidence behind it is committed into git where it makes the repository 99.4% audit artifacts. Concretely:

1. **The headline is stale and unverifiable.** The repo's own fail-closed verifier, `scripts/audit/verify-visual-evidence.js`, reports **FAIL, 0/498 verified** at HEAD because the run-manifest hashes (`publicExportAuditSha256`, `recipeEvidenceSha256`, `publicVisualTargetManifestSha256`) no longer match current inventory files, and the 28 recipe entries lack `runId/kind/sourcePath/storyId/recipeHarness` identity (`reports/audit/visual-all/visual-summary.md:3-15`; QA-CERTIFICATION-01). The last full run is the 4.0 run of 2026-08-14; 4.1.0 changed ~78–100 component sources and recaptured only the 28 `recipe-*` directories.
2. **The count is inflated.** 498 = 470 + 28, hardcoded (`tests/visual/design-system/token-purity-layout-audit.spec.ts:206-211`). 470 = 452 canonical + 11 aliases + 7 `coveredBy` from a PascalCase-name heuristic (`scripts/audit/public-export-audit.js:318-324`); ~44–46 are providers/engines/contexts; 79 evidence directories in 24 groups are byte-identical PNGs (QA-CERTIFICATION-05).
3. **The certifications measure DOM presence, not material.** The 356-story Storybook certification passes any story that renders >10px with a `glass` class or an `<svg>`, ignores warnings, and passed a story that threw `pageerror: Invalid easing type 'ease-in-out'` (`scripts/audit/storybook-visual-certification.mjs:296-334`; QA-CERTIFICATION-04, STORYBOOK-SHOWCASE-01). Its metadata claims `themesInspected: ["storybook-default-dark"]` as a literal while the actual default is light (STORYBOOK-SHOWCASE-03).
4. **Everything is shot over a white stage that hides the defect the product exists to solve.** `.storybook/StorySurface.tsx:88-96` paints an opaque `glass-on-light` gradient under every story. Fresh remote evidence (runtime-remote §1): with the stage removed and black behind the glass, **266/342 sampled text runs fail WCAG** (median 1.92:1); tint adapts in **0/84** story×viewport pairs; the glass interior changes **0.000** of its pixels when the page background is forced. `prefers-contrast: more` is a **0.0% pixel no-op on 12/12** stories (runtime-remote §3). The 4.x token-purity audit cannot see any of this because it renders default story state on the stage (QA-CERTIFICATION-11).
5. **There is no regression detection.** `visual-baselines/` is empty; Playwright `-snapshots/` are gitignored and contain only `*-chromium-darwin.png`; the "App Chrome Visual Baselines" CI job captures but never compares; `visual-regression.yml:49` uploads a jest-image-snapshot path its Playwright runner never writes (QA-CERTIFICATION-03).
6. **CI runs none of the real gates.** No workflow runs the 759-file Jest suite, `test:visual:ci`, the Storybook certification, or `audit:visual:evidence`; `publish-npm.yml` runs no unit tests (QA-CERTIFICATION-02). `design-system-compliance.yml` passes at a 60/100 "score"; `verify-glass-pipeline.js` "31 checks" are `String.includes` (QA-CERTIFICATION-09).
7. **Unit tests are mostly templated and cannot fail.** ~355 generated files assert `expect(container).toBeInTheDocument()`, a jsdom reduced-motion check that is always `0 < 0.1`, and `if (element)`-guarded focus tests (QA-CERTIFICATION-06). Coverage is 38.46% lines against a 33% threshold, last generated in June, enforced nowhere (QA-CERTIFICATION-10).
8. **Remote execution is fragile.** The gated EC2 runner used for the autopsy aborted run 1 because its egress-proxy CA expired (`notAfter=Sep 27 17:34:57 2026 GMT`); the run succeeded only with an offline, prebuilt `storybook-static/` bundle delivered over the S3 gateway endpoint. The runner VPC has no SSM interface endpoints and no NAT, so only user-data + S3 works (runtime-remote "Operational notes").

5.0 changes the product's promise from "a lot of glass components" to "a material that is legible and performant over any content, in every engine and preference". That promise is only as good as the certification that proves it. This PRD defines the certification system that makes 5.0's claims true by construction: every claim is computed from pixels or behaviour on the release SHA, in lanes that fail closed, run remotely, and leave artifacts (not commits) behind. It keeps the genuinely strong 4.x measurement code, retires the theatre, and specifies the human review that pixels cannot replace.

---

## 2. Evidence from the current codebase

All figures below were re-checked against `15b6de6f7` and the autopsy's adversarial verification tables. Verdicts: CONFIRMED unless marked. **PARTIAL verdicts are honoured with their corrected numbers** (QA-CERTIFICATION-11: 420/498 desktop PNGs have *at least one* pure-white corner, 264 have all four; QA-CERTIFICATION-12: 45 root `.mjs` probes / 1,523 LOC, not 44/1,491; QA-CERTIFICATION-14: only `storybook-visual-certification.spec.ts` is JSON-only, the other `test:visual:ci` specs navigate live stories).

### 2.1 Why the verifier reports 0/498 at HEAD

| # | Cause | Evidence |
|---|---|---|
| 1 | Run manifest binds to inventory hashes; 4.1.0 changed the inventory after the 2026-08-14 run, so every entry fails provenance | `reports/audit/visual-all/visual-summary.md:3-15` ("Status: FAIL", "Fully verified: 0/498"); every row: "run manifest inventory hash publicExportAuditSha256 does not match current authoritative artifact; … recipeEvidenceSha256 …" |
| 2 | The 4.1 commit recaptured only `recipe-*` dirs (0 non-recipe `visual-all` paths) | `git show --stat 15b6de6f7` (QA-CERTIFICATION-01 verification) |
| 3 | The 28 recipe entries lack identity fields `runId/kind/sourcePath/storyId/recipeHarness` | `reports/audit/visual-all/visual-summary.md` recipe rows |
| 4 | No 4.1 full-run summary was ever committed; `RELEASE_NOTES_4.1.0.md:27` cites an "AWS Playwright certification" with no artifact | `reports/audit/audit-summary.json` runId `runtime-audit-full-20260814035148-…` |
| Caveat | `visual-summary.md` is untracked and was generated after release; it proves the evidence is stale now, not that the claim was false at release time | QA-CERTIFICATION-01 verdict note |

Conclusion that drives this PRD: **the verifier is right and the release was wrong**. Provenance binding is the asset to keep; the failure mode is that nothing forced it to run before publish.

### 2.2 What each current certification rule checks, and what it cannot prove

| Current gate | What it checks (exact) | What it cannot prove | 5.0 disposition |
|---|---|---|---|
| `scripts/audit/storybook-visual-certification.mjs` (356) | Fuzzy story match (`:41-151`), only `stories[0]` (`:223`); 2 viewports, `colorScheme: dark`, `reducedMotion: reduce` (`:36-39,230-234`); fails only on 0 visible elements, root <10×10, no `glass` class and no `<svg>`/`<canvas>`, `[data-certification-fallback]`, or console error matching one regex (`:296-334`); warnings dropped (`:325-330`) | Blur, alpha, contrast, layout, states, light theme, drift. A single `<svg>` icon satisfies "glass surface". Passed `PageTransitionDemo` with `pageerror: Invalid easing type 'ease-in-out'` | **Retire** (§9) |
| `tests/visual/design-system/storybook-visual-certification.spec.ts:94-227` | Never opens a browser; checks the JSON report agrees with itself and with the frozen 356-entry `reports/component_inventory.json` | Anything about pixels | **Retire** |
| `tests/visual/design-system/token-purity-layout-audit.spec.ts` (4,747 LOC, 498) | Renders each export at 1440×900, 768×1024, 390×844. `checkFilterChain` `:2958-2993`: blur ∈ {16,24,32,40,48}px, saturate ≥1.4, brightness ≥1.0, contrast ∈ [0.95,1.2]; std vs `-webkit-` parity `:3036-3045`. `checkTokenInvariants` `:2995-3244`: gradient stops white-neutral (min channel ≥245, spread ≤6, α ∈ [0.015,0.35]) or slate scrim rgb(15,23,42)±2 α ∈ [0.20,0.30]; opaque dark fill fails at α ≥0.50; border α ≥0.12; inset sheen α ∈ [0.10,0.18]; highlight ≤0.32; noise ≤0.10; text α floors 0.90/0.70/0.50; **local composited contrast ≥4.5:1 (3:1 large), unprovable fails** `:3179-3204`; paint census `:3210-3241`. `checkViewportColorCensus` `:2214-2232`. `collectLayoutIssues` `:1107-1530`; `collectPresentationIssues` `:1849-2100`. **10 detector self-test fixtures** `:3930-4128` | Taste; regressions (no comparison); non-default states; real backdrop (canvas mostly white); recipes (re-reads files from `scripts/ci/verify-recipes-render.js`, `:2421-2462,3398-3440`); inventory growth (hardcoded counts `:206-211,2294-2306`); practicality (`test.setTimeout(180*60*1000)` `:4136`, one 3-hour test) | **Keep the measurement layer, extract into `packages/qa`; replace the driver** (§4.3) |
| `scripts/audit/verify-visual-evidence.js` (716 LOC) | Run manifest exists; its hashes of `public-export-audit.json`, recipe evidence and `public-visual-target-manifest.json` match current files; PNG dimensions per viewport; non-blank pixels; frost α ∈ [0.015,0.35] per surface; identity fields; no captured errors | Not wired into any workflow | **Keep and generalise** into the evidence verifier (REQ-QA-30) |
| `scripts/verify-glass-pipeline.js` ("31 checks") | Mostly `String.includes`; a11y check passes if a spec contains `'4.5'` and `'WCAG AA'` (`:356`); tokens check passes on words `text` and `primary` (`:367`); CSS budget 50KB (`:333`) vs 30KB in `glass-pipeline.yml:78` | Behaviour | **Delete** |
| `.github/workflows/design-system-compliance.yml:118-185` | 5 commands → "score"; exits 1 only below 60 (`:174-180`) | Two of five gates may fail while green | **Delete the score job** |
| `scripts/ci/verify-app-chrome-visuals.js` (CI "App Chrome Visual Baselines", `glass-pipeline.yml:198-226`) | Packs tarball, renders, screenshots (`:898-903`), keyboard + console checks; fixture background `#07111f` navy with teal/purple radials (`:643-646`) | Never compares to a baseline | **Keep tarball + keyboard checks**; screenshots move to the pixel-regression lane |
| `playwright.config.ts:123-128` `toHaveScreenshot` | `threshold: 0.3`, `maxDiffPixels: 1000` | Small-component regressions (1,000 px is the whole of a 30×30 icon) | Replaced by REQ-QA-24 thresholds |
| `visual-regression.yml:42,49` | Runs `npm run test:visual` (`scripts/visual-test-runner.js`); uploads `tests/visual/__image_snapshots__/__diff_output__` | Its runner never writes that path; no Linux baselines exist (`.gitignore:170`) | **Delete**, replaced by `certify-pr.yml` |
| `scripts/storybook-exhaustive-qa.js` | 1,595/1,595, 0 findings, port 6016, 2026-05-08 | A zero-finding detector over 1,595 stories has no teeth | **Delete** |
| `scripts/audit/static-glass-material-audit.js` (1,918 LOC) | Static material scan with a real `--self-test` (`:1902`; `npm run test:audit:glass:materials`) | Runtime | **Keep the self-test pattern**; superseded by the static lane optics lint (PRD-04 owns the rule) |
| `scripts/audit/public-export-audit.js` | Flags 73 exports outside historical inventory, 37 missing tests, 40 missing docs | — | **Keep**, rewritten as source-derived inventory (REQ-QA-02) |
| Package gates (`scripts/ci/verify-pack.js`, `verify-tree-shaking.js --strict`, `verify-no-core-ui-deps.js`, `run-next-integration.js`, `run-vite-integration.js`, `npm run typecheck`) | Test what consumers install; the only gates in `publish-npm.yml:55-65` | Budgets per import, RSC, side effects | **Keep**; extended by PRD-02's artifact lane |

### 2.3 Finding register consumed by this PRD

| Finding | Severity | Fact (verified) | Evidence (path:line) | Requirement(s) |
|---|---|---|---|---|
| QA-CERTIFICATION-01 | critical | 498 claim not reproducible; verifier FAIL 0/498 | `RELEASE_NOTES_4.1.0.md:3,7,27`; `reports/audit/visual-all/visual-summary.md:3-15` | REQ-QA-30..33 |
| QA-CERTIFICATION-02 | critical | No workflow runs Jest, `test:visual:ci` (`package.json:291`), `audit:visual:evidence` (`:337`) or `test:coverage` (`:279`) | `.github/workflows/publish-npm.yml:55-65` | REQ-QA-34..37 |
| QA-CERTIFICATION-03 | high | No pixel regression; `visual-baselines/` empty; snapshots ignored at `.gitignore:170`, darwin-only | `scripts/ci/verify-app-chrome-visuals.js:898-903`; `.github/workflows/visual-regression.yml:42,49` | REQ-QA-24..26 |
| QA-CERTIFICATION-04 | high | 356 certification is a smoke test | `scripts/audit/storybook-visual-certification.mjs:296-334` | REQ-QA-50 |
| QA-CERTIFICATION-05 | high | 470 = 452+11+7; ~44 non-visual; 79 dirs byte-identical in 24 groups | `scripts/audit/public-export-audit.js:318-324`; `reports/public-visual-target-manifest.json` | REQ-QA-02, -03 |
| QA-CERTIFICATION-06 | high | 355 template tests with assertions that cannot fail | `src/components/atmospheric/GlassNebulaClouds.test.tsx:27-30,49-79`; `src/components/input/GlassSlider.test.tsx:58-96` | REQ-QA-40..44 |
| QA-CERTIFICATION-07 | medium | Hardcoded 470/1/28/498 | `token-purity-layout-audit.spec.ts:206-211,2294-2306` | REQ-QA-02 |
| QA-CERTIFICATION-08 | medium | Recipes audited by re-reading files | `token-purity-layout-audit.spec.ts:2421-2462,3398-3440` | REQ-QA-04 |
| QA-CERTIFICATION-09 | medium | String-presence pipeline; 60% score | `scripts/verify-glass-pipeline.js:356,367`; `design-system-compliance.yml:174-180` | REQ-QA-51 |
| QA-CERTIFICATION-10 | medium | Coverage 38.46% lines vs 33%, June, unenforced | `coverage/coverage-summary.json`; `jest.config.js:79-90` | REQ-QA-43 |
| QA-CERTIFICATION-11 (PARTIAL) | medium | Single neutral band, default state, mostly-white canvas | `token-purity-layout-audit.spec.ts:2924-2939,3070-3107` | REQ-QA-10..17 |
| QA-CERTIFICATION-12 (PARTIAL) | low | 45 root `.mjs` probes, 1,523 LOC, all hardcoded `localhost:6006` | `git ls-files '*.mjs'` (e.g. `probe-pb6.mjs`, `webkit-probe.mjs`) | REQ-QA-52 |
| QA-CERTIFICATION-13 | low | `jest.config.js:38` maps to non-existent `__mocks__/fileMock.js`; `jest.visual.config.js:4,20,25` broken and orphaned | `jest.config.js:38`; `jest.visual.config.js` | REQ-QA-44, -52 |
| QA-CERTIFICATION-14 (PARTIAL) | low | `test:visual:ci` asserts the frozen 356 inventory; only the certification spec is JSON-only | `playwright.visual-ci.config.ts:12-18,40-45` | REQ-QA-50 |
| STORYBOOK-SHOWCASE-01 | critical | Global decorator renders a `glass`-classed `<main>` (`ContrastGuard className="glass-contrast-guard"`) so every story meets the pass criteria | `.storybook/StorySurface.tsx:90` | REQ-QA-11, -50 |
| STORYBOOK-SHOWCASE-02 | critical | 351/356 shots mean luminance >200, 330/356 colourfulness <8, 0 dark | `.storybook/StorySurface.tsx:88-96` | REQ-QA-10..12 |
| STORYBOOK-SHOWCASE-03 | high | `themesInspected` is a literal; 1 story per component | `storybook-visual-certification.mjs:344`; `.storybook/preview.tsx:160` | REQ-QA-17 (labels read back), REQ-QA-01 (every declared state is a subject) |
| STORYBOOK-SHOWCASE-04 | high | 24 `!important` in `LiquidGlassShowcase.tsx:33-140` override shipped material | `src/components/showcase/LiquidGlassShowcase.tsx:45-56,68-71` | REQ-QA-14 (0 story `!important`), REQ-QA-27 |
| STORYBOOK-SHOWCASE-08 (PARTIAL) | medium | `reducedMotion: true` hard-set for every story | `.storybook/preview.tsx:168-174` | REQ-QA-21 |
| STORYBOOK-SHOWCASE-13 | medium | 7 `play` functions across 1,598 stories; mixed deprecated/alpha test packages | `package.json:433-437` | REQ-QA-18 |
| HISTORY-HYGIENE-01/-04 | critical/high | `reports/` = 2,930 MB of 2,948 MB HEAD; 17,344 staging duplicate files | `git ls-tree -r -l HEAD` | REQ-QA-32, -33 |
| Runtime-remote §1 | critical | Stage removed + black: 266/342 text runs fail (median 1.92:1); 0/84 tint adaptation; glass interior 0.000 pixel change | `docs/auraglass-5/autopsy/remote-evidence/analysis.json` (`contrastRows`), `pixel-diff.json` | REQ-QA-10..14 |
| Runtime-remote §2 | high | 3.2 App Shell stories fail on their own stage: ink rgba(0,0,0,.9) on rgb(13,31,43), 1.12–2.14:1 | `remote-evidence/analysis.json` | REQ-QA-13 |
| Runtime-remote §3 | high | `prefers-contrast: more` is a 0.000 pixel diff on 12/12; 16 media queries use invalid `high` | `src/styles/glass.css:4055`; `remote-evidence/pixel-diff.json` | REQ-QA-15 |
| Runtime-remote §4 | medium | Forced colors leaves showcase 12→12 and `liquid-glass-material` 1→1 backdrop filters | `src/styles/glass.css:4073` | REQ-QA-15 |
| Runtime-remote §5 | medium | Modal/dialog/app-shell 12–23 fps vs 60 fps (software raster); visible backdrop filters: modal 12, app shells 21–29, state matrix 51; nesting depth 4, max blur 40px | `remote-evidence/metrics.json` | REQ-QA-20, -22 |
| Runtime-remote ops | blocker | Egress-proxy CA expired 2026-09-27; no SSM endpoints/NAT; offline `storybook-static/` + S3 gateway worked | runtime-remote "Runs" table, attempt `auraglass5-autopsy-15b6de6f74e6-20261007T005723Z` | REQ-QA-60..64 |

### 2.4 What is excellent and must be kept (not rebuilt)

1. The token-purity measurement layer: computed-style extraction, composited local contrast, paint and pixel census (`token-purity-layout-audit.spec.ts:852-2232`) and its detector fixtures (`:3930-4128`).
2. Provenance binding in `scripts/audit/verify-visual-evidence.js`.
3. The packed-tarball package gates in `publish-npm.yml:55-65` and the Next/Vite integration scripts (`scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js`).
4. The runtime-remote harness method (stage removal, forced backgrounds, emulated media, per-text-run sampling against a text-hidden twin screenshot, rAF FPS under scripted input). It is the working Chromium prototype of the 5.0 environment matrix (gap analysis §4.2).
5. The "incomplete language" guard (`storybook-visual-certification.mjs:390-426`) that stops a summary claiming success while blockers remain; it moves into the `claims.json` builder (REQ-QA-31).
6. Hand-written behavioural tests: `src/__tests__/production-workflow-components.test.tsx:17-60`, `src/hooks/useAutoTextContrast.test.tsx` (compositing logic; the hook itself is deleted per §7.3, so this test is retired with it), `src/theme/theme-engine.test.tsx`. (`tests/hosted-runtime/*` is good test craft but tests the server/AI-client surface that D-30 deletes; it leaves with that code under PRD-16.)

---

## 3. Desired end state

At 5.0.0 GA, on the GA SHA:

1. **Every public claim is computed.** README and release-note numbers (distinct visual components, flagship count, pass counts per lane, min contrast ratio in the token matrix, worst OCR contrast, per-import sizes, recipes = 1, perf grades) are rendered from the GA run's evidence manifest. A number with no artifact source fails docs lint. There is no "498 certified green"-style literal anywhere in the repo.
2. **Certification proves material, behaviour, artifact and migration** (§15), in 14 named lanes (§4.2), each of which **fails closed**: a lane that does not run, runs zero subjects, or produces no evidence manifest is a failure, not a skip.
3. **Glass is always tested over something.** Every visual capture runs in one of 8 licensed, bundled scenes; the 4.x white `StorySurface` stage is gone from certification; a "glass over nothing" detector fails any surface whose backdrop luminance variance is below threshold, and a surface-separation gate fails any surface indistinguishable from its scene.
4. **Text legibility is measured on rendered pixels** with OCR, worst case across the scene set, in all three engines, and agrees with the build-time three-composite matrix (PRD-03/PRD-05).
5. **Regressions are caught.** Small, element-cropped Linux baselines are committed under `certification/baselines/` (hard size cap), compared with strict thresholds, and updated only through a labelled, human-approved PR that attaches diff images.
6. **Inventory is derived from source.** The visual target list comes from the exports manifest (PRD-02) plus an explicit `@nonvisual` classification; adding a component grows the matrix automatically; unclassified exports fail. Aliases and providers are not counted as visuals.
7. **Engines are first-class.** Chromium, WebKit and Gecko lanes run the same subjects with engine-specific assertions (WebKit literal `-webkit-backdrop-filter` applied; Gecko lens inert; Chromium bezel never over text).
8. **Behaviour runs in real browsers**: APG keyboard scripts per widget, `@axe-core/playwright` with color-contrast on, emulated preferences, SSR → hydrate with zero warnings, stacked-overlay Escape and z-order.
9. **Heavy lanes never run on a developer Mac.** PR lanes run on GitHub-hosted runners (the repo is public: `gh repo view auraoneai/auraglass` → `PUBLIC`); the full matrix and perf lane run on CI shards or the gated EC2 runner from an **offline bundle**, so the expired egress-proxy CA cannot block a release.
10. **Unit tests test behaviour.** The 355 templated files are gone or rewritten; a lint rule forbids the vacuous patterns; per-directory coverage floors are enforced in CI.
11. **Evidence is never committed.** Artifacts are uploaded per SHA with defined retention; release evidence is retained ≥ 400 days and linked from the GitHub release; `reports/` cannot re-enter the tree (guard test).
12. **Human judgment is explicit and recorded.** A manual screen-reader matrix and a human visual review rubric are GA blockers, each recorded as a signed, SHA-bound review record in the evidence manifest. Nothing human-judged is presented as mechanically certified, and nothing mechanical is presented as "reviewed".

---

## 4. Architecture

### 4.1 Components of the certification system

```
packages/qa/                  (NEW, private workspace package "@auraglass/qa", "private": true, never published)
  src/inventory/              source-derived visual target list (exports manifest + @nonvisual + typed variant metadata)
  src/resolve/                ONE story/subject resolver (replaces the 6 copies of normalizeName/rankStory)
  src/inspect/                extracted from token-purity-layout-audit.spec.ts:852-2232 (computed style, composited contrast, census, layout)
  src/pixel/                  pixel gates (gap analysis §4.2) + material-presence (glass-over-nothing) detector
  src/ocr/                    tesseract wrapper, word boxes, text-hidden twin sampling, per-word contrast
  src/matrix/                 matrix expansion, cell ids, forcing attributes, sharding
  src/evidence/               evidence manifest writer + verifier (generalised verify-visual-evidence.js)
  src/claims/                 claims.json builder (computed values + artifact source; rendering into docs is PRD-20/PRD-01)
  fixtures/                   detector self-test fixtures (ported :3930-4128 + new ones per gate)
certification/                (NEW)
  scenes/                     8 bundled scene assets + scenes.manifest.json (sha256, licence, source, dimensions)
  matrix.config.ts            axes, subject sets, reduced sets (T2, PR), thresholds import
  thresholds.json             every numeric gate threshold, versioned; changes require CODEOWNERS approval
  baselines/linux/<engine>/   committed element-cropped regression baselines (size-capped)
  exemptions.json             reviewed exemptions (e.g. intentionally tinted surfaces), each with rationale + reviewer + expiry
  review/                     templates for manual SR matrix and human visual rubric (records go to artifacts, not here)
  playwright.cert.config.ts   one Playwright config, projects = chromium | webkit | firefox, served from storybook-static
  lanes/*.spec.ts             lane specs (see §12)
  runner/                     remote bundle builder + EC2 user-data entrypoint + preflight
.github/workflows/certify-pr.yml | certify-main.yml | certify-release.yml | certify-nightly.yml   (NEW)
```

Boundary: this PRD owns the **harness, lanes, gates, scenes, baselines, evidence and release checklist**. It consumes, and does not author: the optics lint rule (PRD-04), the three-composite contrast solver and `tests/tokens/contrast-matrix.test.ts` (PRD-03) plus the independent recompute `tests/a11y/contrast-matrix.test.ts` (PRD-05 REQ-A11Y-18), the APG harness `tests/a11y/apg/harness.ts`, per-widget `tests/a11y/apg/<component>.apg.spec.ts` and the browser axe spec `tests/a11y/browser/axe.spec.ts` (PRD-05 and flagship PRDs), the perf harness `tests/perf/harness/run-perf.mjs` and `grade.mjs` (Performance PRD), the artifact checks and canary fixtures `canaries/**` (PRD-02), API Extractor, `deprecations.json` and `scripts/release/visual-class.mjs` gates (PRD-01), Material Lab stories (PRD-04 `Material.Lab.stories.tsx`) and the Storybook `StoryRoot`/`cert-manifest.json` contract (Storybook PRD REQ-SB-05, -42). Where those are missing at lane-creation time, the lane exists and **fails** with "provider missing: <path>", which is the §16 exit criterion ("every lane exists and fails closed").

### 4.2 Lanes

| # | Lane | Mechanism | Runs on | Trigger | Gate |
|---|---|---|---|---|---|
| L1 | Static | ESLint + stylelint rules, undefined-class and `--ag-*` dead/undefined var check | GH-hosted | every PR | fail on any |
| L2 | Artifact | `publint`, `@arethetypeswrong/cli`, types-vs-runtime per subpath, allowlist, transitive count, per-import budgets §3.6, jsdom side-effect import, tarball contents (PRD-02 checks) | GH-hosted | every PR | fail |
| L3 | Change class | API Extractor diff, `deprecations.json`, codemod fixtures, visual-class classifier `scripts/release/visual-class.mjs` (all PRD-01) fed by the element-cropped L7 captures produced here | GH-hosted | every PR; release/4.x | fail |
| L4 | Token contrast | three-composite matrix §7.3; solved-floor diff | GH-hosted | every PR (required check; not path-filtered) | <4.5 / 3 / 7:1 fails |
| L5 | Behaviour | APG scripts, `@axe-core/playwright` color-contrast on, emulated preferences, SSR hydrate, overlay stacking | GH-hosted (3 engines) | every PR (affected) ; main (all) | fail |
| L6 | Environment visual (pixel gates) | matrix §4.4 × gates §5 REQ-QA-14 incl. OCR and glass-over-nothing | GH-hosted shards (PR reduced); EC2/CI shards (full) | PR reduced; main + release full | fail; labels from pixels |
| L7 | Pixel regression | element baselines, strict diff | GH-hosted, pinned image | every PR | drift fails |
| L8 | Engine-specific | WebKit literal blur applied; Gecko inert lens; Chromium bezel-text overlap | GH-hosted | every PR (affected) | fail |
| L9 | Motion | frame strips, rAF/WAAPI idle after settle, reduced-motion final state | GH-hosted | every PR (affected) | fail |
| L10 | Performance | Performance PRD harness (profiles a–d, REQ-PERF-32), frame time vs surfaces/blur/tier, A–F grades (REQ-PERF-34) | GPU host for profile (a) (gated EC2 g5/g4dn class or a GitHub GPU larger runner); profiles (b)–(d) on CI shards or EC2 | main nightly + release | T1 below C or T2 below D fails |
| L11 | Consumer canaries | PRD-02 fixtures `canaries/{next16,next15,vite,vite-tailwind4}` (Next 16/19.3, Next 15/19.0 floor, Vite no-Tailwind, Vite + Tailwind v4), Base UI floor/latest (REQ-PKG-86), frozen 4.x fixture `tests/fixtures/consumer-4x/` (PRD-01 §11.4), all from the packed tarball | GH-hosted | main + release; PRs touching `package.json`, `src/**/index.ts` | fail |
| L12 | Unit / component | Jest (jsdom) behavioural tests, coverage floors | GH-hosted | every PR | fail |
| L13 | Manual screen reader | living matrix (§15.2 Manual) | humans | per flagship before RC; re-run on DOM/ARIA change | GA blocker |
| L14 | Human visual review | rubric §4.6 | humans (design reviewer) | baseline update PRs; RC | GA blocker |

### 4.3 Upgrading the existing visual certification (keep, then replace the driver)

The 4.x token-purity audit is the base. It is upgraded in place before 5.0 subjects exist, so that 4.2/4.3 releases are also certified honestly:

| Step | 4.x today | Upgrade |
|---|---|---|
| Measurement | Inline in one 4,747-line spec | Move `:852-2232` into `packages/qa/src/inspect/*` unchanged in behaviour; port the 10 fixtures (`:3930-4128`) to `packages/qa/fixtures/` and keep them green **before** any rule changes |
| Driver | One `test()` with a 3-hour timeout (`:4136`) | One Playwright test per (subject × cell), generated from the matrix; per-test timeout 60 s; sharded |
| Inventory | Hardcoded 470/28/498 (`:206-211`) | `packages/qa/src/inventory` reads the exports manifest; counts are outputs |
| Server | `npm run storybook` dev server (`playwright.visual-ci.config.ts:40-45`) | `storybook-static/` served by a static file server inside the job; the same bundle is used remotely |
| Canvas | White stage (`.storybook/StorySurface.tsx:88-96`) | `?globals=environment:<scene>;certify:1` disables the stage; scene painted by the cert decorator only |
| Neutral-frost band (`:2924-2939,3048-3107`) | One aesthetic band for every surface | Becomes a **4.x-only** rule set (`thresholds.json#legacy4x`). 5.0 surfaces are judged by the §15.2 pixel gates and the material contract (`data-ag-surface`, `--ag-*`), because 5.0 content materials (D-08) are deliberately tinted and would fail the 4.x band |
| Recipes | Re-reads files produced by `verify-recipes-render.js` (`:3398+`) | Recipes/registry blocks are rendered live as subjects; file re-reading deleted |
| Evidence | Committed under `reports/audit/visual-all/` | Written to `$CERT_OUT/<sha>/`, uploaded as an artifact (REQ-QA-32) |

### 4.4 Environment matrix and sizing

Axes are §15.1 verbatim: engine {chromium, webkit, firefox} × environment {photo, saturated-abstract, dense-text, dark-media, flat-white, flat-black, hf-pattern, video-frame} × scheme {light, dark} × transparency {glass, tinted, solid} × preference {default, contrast-more, forced-colors, reduced-motion} × tier {lightweight, standard, enhanced (chromium only)} × viewport {1440×900, 390×844}.

Invalid cells are pruned by rule, not by hand: `forced-colors` ⇒ tier `lightweight` and transparency `solid` only, and only in engines where Playwright `emulateMedia({ forcedColors: 'active' })` is supported (Chromium at minimum; `matrix.config.ts` lists the engine set, and REQ-QA-17 read-back of `matchMedia('(forced-colors: active)')` fails any cell where emulation silently did nothing); transparency `solid` ⇒ tier `lightweight`; `enhanced` ⇒ engine `chromium` ∧ transparency `glass` ∧ `data-ag-motion` ≠ `none` (§4.7) ∧ subject declares `refraction` eligibility, and enhanced cells run at preference `default` only. Every cell forces state via attributes on `<html>` (`data-ag-tier`, `data-ag-engine`, `data-ag-transparency`, `data-ag-contrast`, `data-ag-motion`, `data-ag-scheme`) plus Playwright `emulateMedia` (`colorScheme`, `reducedMotion`, `forcedColors`, `contrast`), so no runtime heuristic decides a baseline (§15.1; D-10).

| Subject set | Cells per subject-state | Basis |
|---|---|---|
| T0 full (`Surface` × {regular, clear, identity, content-raised} × {thin, regular, thick} = 12 subjects) | 3×8×2×2 = 96 core (glass, default, standard) + preference cells on {photo, flat-black} × 2 schemes × 1440: {tinted, solid, contrast-more, reduced-motion} × 3 engines = 48, forced-colors × chromium = 4 → 52 + chromium enhanced 8×2×2 = 32 → **180** | §15.1 subjects |
| Flagship (44, every state declared in typed metadata, ≈4 states avg) | 96 core + 52 preference = 148, + 32 if refraction-eligible | §11.3 |
| Other T0 primitives (`SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`) | flagship matrix: 148 per declared state | §15.1 |
| T2 core (~40, default + 1 interactive state) | reduced: {chromium, webkit} × {photo, flat-white, flat-black} × 2 × 2 = 24 + 5 preference × chromium × photo × light × 1440 = 5 → **29** | §15.1 "T2 runs the reduced matrix" |
| Product scenes (6 full scenes) | 3 engines × 8 × 2 × 2 = 96 | §15.1 |
| **PR reduced** (affected subjects only, from the import graph) | {chromium, webkit} × {photo, flat-black, dense-text} × 2 × {1440, 390} = 24 | time budget REQ-QA-37 |

Estimate for a full release run, in **cells**: 12×180 + 44×4×152 (≈1 in 8 flagship states refraction-eligible, +4 avg) + 4×2×148 + 40×2×29 + 6×96 ≈ 2,160 + 26,752 + 1,184 + 2,320 + 576 ≈ **33,000 cells**. Each L6 cell needs up to **3 screenshots** (the cell, the text-hidden twin for REQ-QA-13, the surface-hidden capture for REQ-QA-12/-14), so ≈ **99,000 captures**. Runtime-remote measured 372 captures in 296 s on one 32-vCPU r7i.8xlarge worker (≈1.26 captures/s, software raster), i.e. ≈ 22 worker-hours on that class; a 4-vCPU GitHub-hosted runner is expected to be several times slower (unmeasured). The shard count is therefore **computed, not fixed**: `packages/qa/src/matrix/shard.ts` sets `shards = ceil(captures ÷ (measuredRate × 3,600 s))` so that each shard's capture time is ≤ 60 min inside the 90-minute release budget (REQ-QA-37); on the r7i class that is ≈ 22 shards, on GitHub-hosted 4-vCPU runners it may exceed 100 (GitHub matrix limit: 256 jobs per workflow run). These are estimates from one measured run; the alpha calibration run records the actual per-host rate in the manifest and `shard.ts` reads it.

### 4.5 What is mechanically testable vs human-judged

| Property | Mechanical gate | Human judgment | Lane |
|---|---|---|---|
| Something rendered; not blank | yes (≥40 levels) | — | L6 |
| Glass is distinguishable from its backdrop | yes (surface separation; glass-over-nothing) | — | L6 |
| Text legible on rendered pixels | yes (OCR contrast worst case; OCR word count > 0) | — | L6 |
| Contrast floors by construction | yes (three-composite matrix) | — | L4 |
| Live blur layers within budget | yes (glass density, visible nodes) | — | L6, L10 |
| Hue chaos / neon | yes (≤1% neon, ≤3 hue families) | — | L6 |
| Intent variants distinguishable | yes (ΔE primary vs secondary) | whether the difference is *appropriate* | L6 / L14 |
| Preference modes art-directed | measurable change (pixel delta + ink/border change) | whether the result looks designed, not broken | L6 / L14 |
| Regression vs approved render | yes (pixel diff) | **approving** any baseline change | L7 / L14 |
| Keyboard, ARIA, focus order | yes (APG scripts, axe) | announcement quality, verbosity, naming | L5 / L13 |
| Screen-reader experience | no | VoiceOver macOS/iOS, NVDA, TalkBack | L13 |
| Motion | timing/idle/final-state checks | easing feel, choreography | L9 / L14 |
| Specular quality, optical hierarchy, radius rhythm, "reads as one hand" | no | yes (rubric) | L14 |
| Story realism (product copy, not a demo shell) | partial (OCR rejects lorem/meta copy list) | yes | L6 / L14 |
| Performance | yes (frame time, grades) | — | L10 |

### 4.6 Human visual review rubric (L14)

Scored 1–4 per criterion by a named design reviewer viewing the generated **review composite** (one PNG per subject-state: 8 scenes × light/dark at 1440, plus the 390 photo cell, plus the previous approved baseline and the diff heat-map). Pass = every criterion ≥3 and no criterion at 1 on any flagship. Records: `review-record.json` (reviewer GitHub login, SHA, subject-state id, scores, free-text notes, composite sha256).

| # | Criterion | 4 (exemplary) | 1 (blocking) |
|---|---|---|---|
| R1 | Material reads as glass over every scene | edge, rim and specular legible on photo and flat-black alike | disappears on flat-white or becomes a grey slab on flat-black |
| R2 | Optical hierarchy | chrome > overlay > content ordering obvious at a glance | competing surfaces of equal weight |
| R3 | Specular quality | single coherent light direction, no banding | multiple light directions, banding, or glow halos |
| R4 | Radius and spacing rhythm | concentric radii; spacing on the 4/8 scale | mismatched radii between nested parts |
| R5 | Typography on glass | crisp, correct weight, no haloing | blurry, thin-on-busy, haloed |
| R6 | Preference modes look designed | tinted/solid/contrast-more read as intentional variants | look like a broken fallback |
| R7 | "Reads as one hand" (product scenes only) | all components look authored together | visible mix of material languages |

### 4.7 Remote execution

Placement (policy: browser automation and heavy suites never run on the Mac; repo is public so GitHub-hosted runners are the default for PR code; private cloud credentials are never exposed to untrusted PR code):

| Work | Where | Credentials |
|---|---|---|
| L1–L5, L7–L9, L11, L12, PR-reduced L6 | GitHub-hosted `ubuntu-24.04` inside a pinned Playwright container image (digest-pinned) | none beyond `GITHUB_TOKEN` read |
| Full L6 matrix | **Option A (default):** GitHub-hosted shards (count from `shard.ts`, §4.4). **Option B:** gated EC2 runner (launch template `lt-001ac3e8c702c66d7`, r7i.8xlarge, no ingress, no public IP, no egress, S3 gateway endpoint), only from `main`/tag workflows, never from `pull_request` | EC2 via OIDC role on `main`/tag only |
| L10 perf | Profile (a) needs a GPU host (Performance PRD §4: g5/g4dn class, hardware compositing verified via `chrome://gpu`); the existing launch template is r7i (no GPU), so profile (a) requires a GPU instance type on the gated runner or a GitHub GPU larger runner. Profiles (b)–(d) run on Option A or B | as above |

**Expired-CA blocker and offline-bundle workaround.** The runner's egress-proxy CA expired (`notAfter=Sep 27 17:34:57 2026 GMT`), so any job that installs packages on the worker fails. The certification design does not depend on worker egress at all:

1. A CI job (with normal egress) builds the **offline bundle**: `storybook-static/`, the packed `aura-glass-<ver>.tgz`, `certification/` (scenes, configs, baselines), `packages/qa/dist`, a `node_modules` tarball produced by `npm ci --omit=optional` for the cert harness only, the exact Playwright browser builds (`PLAYWRIGHT_BROWSERS_PATH` directory for chromium, webkit, firefox) and the tesseract binary + `eng.traineddata`, plus `bundle.manifest.json` (sha256 of every member, git SHA, image digest).
2. It uploads the bundle to the designated runner S3 prefix keyed by `<sha>/<attempt-id>`; the worker downloads via the S3 gateway endpoint, verifies sha256s, runs with `--offline` semantics (network disabled at the browser level: `context.route('**', abort)` for any non-`127.0.0.1` URL), uploads evidence, and terminates itself.
3. A preflight step (`certification/runner/preflight.mjs`, NEW) checks the bundle hash, the presence of all three browser builds, and — only if a job ever requests proxy egress — the proxy CA `notAfter`; an expired CA fails fast with the exact message and the attempt-id. Rotating the CA is outside this PRD's autonomous scope (shared credential): it is recorded as an operator action, never performed by the pipeline.
4. Session Manager is unavailable in the runner VPC (no SSM endpoints/NAT); the worker contract is user-data + S3 only, with a hard wall-clock self-termination.

Option A must be sufficient on its own for every lane except L10 profile (a). If no GPU host is available, L10 **fails** with `provider missing: gpu-host` (grades are never computed from software raster; profile (c) software-raster results are regression-only, per the Performance PRD), and the manifest records `perfHost` so grades are compared only within one host class. Provisioning a GPU instance type on the gated runner is an infrastructure change recorded for the operator if IAM denies it. A blocked runner is never a reason to run a lane on a developer Mac.

### 4.8 Evidence flow, claims and retention

```
lane job → $CERT_OUT/<sha>/<lane>/{cells/*.json, captures/*.png, review-composites/*.png, junit.xml}
         → lane-manifest.json  {lane, sha, imageDigest, browserVersions, subjects[], cells[], results[], thresholdsSha256, scenesSha256, inventorySha256}
release  → evidence-manifest.json  (all lane manifests + review records + SR matrix) → verify (REQ-QA-30) → claims.json (REQ-QA-31)
         → uploaded as GitHub release asset `certification-<version>.tar.zst` + workflow artifacts
```

Retention: PR artifacts 14 days; `main` 30 days; nightly 30 days; release (`v*` tags, including prereleases) evidence bundle attached to the GitHub release as an asset (indefinite) and as a workflow artifact with 90-day retention (GitHub maximum for public repos); a copy to the S3 runner evidence prefix (Object Lock, per runtime-remote ops notes) for runs executed on EC2. Nothing under `$CERT_OUT` is ever committed (D-32).

---

## 5. Exact implementation requirements

Each requirement is testable; the verifying test is named in §12.

### 5.1 Inventory and subjects

- **REQ-QA-01** One subject resolver. `packages/qa/src/resolve/resolveSubject.ts` (NEW) is the only implementation mapping an export/subject id to a story id. The six copies of `normalizeName`/`candidateNames`/`storyNameForMatch`/`rankStory` (`storybook-visual-certification.mjs:41-120`, `storybook-visual-certification.spec.ts:73-92`, `token-purity-layout-audit.spec.ts:437-593`, `public-export-audit.js`, and others) are removed. 5.0 subjects resolve by **explicit** `parameters.ag.subject` on the story, cross-checked against the Storybook PRD's generated `.storybook/cert-manifest.json` (REQ-SB-42: `{ id, tags, kind, viewports, axes }`) and `storybook-static/index.json` (no fuzzy matching); a subject with no story, or a manifest id missing from `index.json`, fails.
- **REQ-QA-02** Source-derived inventory. `packages/qa/src/inventory/buildInventory.ts` (NEW) reads the PRD-02 exports manifest and classifies each value export as `visual | nonvisual | alias` from source metadata (`/** @nonvisual */` JSDoc or the typed variant metadata registry). Unclassified exports fail. No count constant exists anywhere in `packages/qa` or `certification/` (enforced by a grep test for `/\b(470|498|356)\b/` in those trees).
- **REQ-QA-03** Distinctness. Captures of different subjects in the same cell whose dHash Hamming distance ≤ 2 **and** pixel diff ratio < 0.001 are reported as `duplicate-visual`; a subject classified `visual` whose captures are duplicates of another subject in ≥ 90% of cells fails unless it is declared `alias` (prevents the 79-dir/24-group duplicate inflation, QA-CERTIFICATION-05).
- **REQ-QA-04** Registry blocks and recipes are live subjects rendered from the packed tarball; no lane reads screenshots or computed-style JSON produced by another job as proof (QA-CERTIFICATION-08).

### 5.2 Environment visual lane (L6)

- **REQ-QA-10** Scenes. `certification/scenes/` contains exactly 8 assets with ids `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame` (a still frame, plus a 2 s looping `video-frame.webm` used only by the motion lane). `scenes.manifest.json` records per asset: sha256, licence (SPDX id or written grant reference), source URL/author, width × height ≥ 2880 × 1800, mean luminance and luminance standard deviation. `flat-*` are generated; `photo`/`dark-media` must be CC0 or owned. Total ≤ 6 MB. The Storybook `environment` toolbar global (PRD-04 Material Lab) reads the same manifest.
- **REQ-QA-11** Certification decorator. With global `certify:1`, the preview renders no `StorySurface` stage, no `ContrastGuard`, no SkipLinks and no padding wrapper; it paints the selected scene as `background` on `<body>` (`background-size: cover; background-position: center; background-attachment: fixed`). The only element allowed between `<body>` and the subject is the Storybook PRD's non-painting `StoryRoot` `[data-ag-story-content]` wrapper (REQ-SB-05) plus Storybook's own `#storybook-root`. Tests assert (a) every ancestor between `<body>` and the subject root has computed `background-color` with alpha 0, `background-image: none`, `backdrop-filter: none`, `filter: none` and `opacity: 1`; (b) pixels outside `[data-ag-story-content]` differ from the scene by ≤ 0.5% of the frame (the REQ-SB-05 assertion, implemented here).
- **REQ-QA-12** Glass-over-nothing (material presence) detector. For each visible `[data-ag-surface]` with a backdrop material (`data-ag-variant` ∈ {regular, clear}), capture the cell with the surface hidden (`visibility:hidden` on the surface only) and compute luminance variance of the scene region under the surface's border box. If σ(L) < 4 levels (0–255) in a scene whose manifest σ ≥ 20, the backdrop the user would see through is empty: fail `glass-over-nothing` (e.g. an opaque ancestor between scene and surface). Additionally, in `standard`-tier `glass` cells, for each subject-state the mean surface-interior luminance must differ between the `flat-white` and `flat-black` cells by ≥ 30 levels for `regular` (it is translucent) and by ≤ `(1 − floorAlpha) × 255 + 5` levels, where `floorAlpha` is the solved `--_ag-tint-floor` for that transparency/thickness/backdrop key read from PRD-03's `tokens/generated/opacity-floors.json` (REQ-DS-15) — i.e. the rendered tint is at least the solved floor. Runtime-remote measured white 255 vs black 19–26 (a 229–236 delta, ≈ 0.08 effective alpha) for the 4.x near-transparent fills; a hand-coded threshold is not used because the floor is a solver output.
- **REQ-QA-13** OCR text contrast. For every cell, run tesseract 5 (`--psm 11`, 2× Lanczos upscale) on the capture; for each word with confidence ≥ 60, compute contrast between the median glyph-pixel colour and the median colour of the same box in the **text-hidden twin** capture (`color: transparent` on text nodes). Gate: every word ≥ 4.5:1 (≥ 3:1 when the DOM font size ≥ 24px, or ≥ 18.66px and weight ≥ 700), worst case across the scene set for the subject-state. Also: if the subject DOM contains ≥ 1 visible text node, OCR word count must be > 0 ("legible text exists"). Under `contrast-more`, the floor is 7:1. APCA Lc is computed and reported, never gated (§7.3 item 5).
- **REQ-QA-14** Pixel gates, thresholds verbatim from gap analysis §4.2 / §15.2 where those sources give a number (not blank, separation, frame fill, density 0.3, neon 1% / 3 families, 0 `!important`); where they do not (neon pixel definition, hue-family bin, density area definition, ΔE minimum), the value below is set by this PRD. All stored in `certification/thresholds.json` (keys in parentheses): not blank — max deviation from the scene ≥ 40 levels (`notBlank.minDeviation`); surface separation — ≥ 25% of surface pixels differ from the surface-hidden capture by > 10 levels (`separation.minShare`, `separation.minDelta`); frame fill — subject content box ≥ 3% of the frame, matrix stories ≥ 25% (`frameFill`); glass density ≤ 0.3 on visible glass nodes (`density.max`; definition: summed visible area of elements with computed `backdrop-filter ≠ none` ÷ viewport area); live backdrop-filter layers per viewport ≤ 6 at fine pointer, ≤ 3 at coarse pointer (§4.7); neon ≤ 1% of pixels (HSV S ≥ 0.85 ∧ V ≥ 0.85) and ≤ 3 hue families (30° bins with ≥ 2% share) per subject (`neon`); intent ΔE2000 between `primary` and `secondary` fills ≥ 10 (`intentDeltaE`); mobile containment — at 390px with `overflow-x` clipping disabled on every ancestor, no subject pixel within 0px of the right edge and `scrollWidth ≤ clientWidth`; 0 `!important` in stories and registry blocks (static, L1); layout overlap/overflow (ported `collectLayoutIssues`).
- **REQ-QA-15** Preference modes must change something measurable. For each subject-state, versus the `default` cell in the same scene/scheme/engine: `contrast-more` must change ≥ 0.5% of surface pixels **and** raise the worst OCR contrast or reach ≥ 7:1; `tinted` must raise surface-interior σ-suppression (σ of surface interior ÷ σ of scene under it decreases by ≥ 25%); `solid` and `forced-colors` must yield 0 elements with computed `backdrop-filter ≠ none` inside the subject; `reduced-motion` is checked by L9. A 0.000 pixel delta (runtime-remote §3) fails `preference-noop`.
- **REQ-QA-16** Console hygiene. Any `pageerror` or `console.error` in any cell fails. `console.warn` fails unless its message matches an entry in `certification/console-allowlist.json` (NEW; each entry: regex, owner, expiry date ≤ 90 days). The 4.x regex filter (`storybook-visual-certification.mjs:327-330`) is not reused.
- **REQ-QA-17** Labels from pixels. Every result field that names a theme, scheme, preference, engine or tier is read back from the rendered page (`document.documentElement.dataset`, `matchMedia(...)` results, `navigator.userAgent` engine), never written from the requested config; a mismatch between requested and observed fails `label-mismatch` (fixes STORYBOOK-SHOWCASE-03).

### 5.3 Behaviour, motion, performance, engine lanes

- **REQ-QA-18** Behaviour lane wiring. `certification/lanes/behaviour.spec.ts` (NEW) runs, in chromium/webkit/firefox, every `tests/a11y/apg/<component>.apg.spec.ts` contributed by component PRDs through the PRD-05 harness `tests/a11y/apg/harness.ts` (REQ-A11Y-40), and the PRD-05 browser axe spec `tests/a11y/browser/axe.spec.ts` (REQ-A11Y-42; `@axe-core/playwright` exact-pinned devDependency added by PRD-05) at the per-PR coverage this PRD defines: every subject-state in the `photo` and `flat-white` scenes, light and dark, with `color-contrast` **enabled**; any violation of impact `serious` or `critical` fails; `moderate` fails for flagships. Nightly/RC full coverage (REQ-A11Y-42 (b), SC-29) is a job this PRD owns: `certify-nightly.yml` job `behaviour-axe-full` and the same job in `certify-release.yml` run the same axe spec on every T0/T1/T2 story in **all 8 scenes** (`photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`; SC-28), light and dark, Chromium and WebKit, with the same impact gate; its manifest is an L5 manifest and REQ-QA-30 requires it on RC/GA SHAs. Emulates `forcedColors: active`, `contrast: more`, `reducedMotion: reduce` and the `data-ag-transparency=solid` attribute. A flagship with no APG spec fails with `provider missing`. Storybook `play` functions are not the mechanism (STORYBOOK-SHOWCASE-13).
- **REQ-QA-19** SSR/hydration and overlays. For each flagship, `renderToString` on Node then `hydrateRoot` in each engine produces 0 console warnings/errors and 0 DOM mutations to `<html>` attributes after `AuraGlassScript` (D-10). Stacked overlays (Dialog → Menu → Tooltip) close in LIFO order on Escape, and computed z-order matches the layer stack.
- **REQ-QA-20** Performance lane wiring. `certification/lanes/perf.spec.ts` (NEW) invokes the Performance PRD harness `tests/perf/harness/run-perf.mjs` (REQ-PERF-32) for every profile it defines ((a) desktop GPU 1440×900 DPR 2 at 60 and 120 Hz, (b) mobile emulation 390×844 DPR 3 CPU 4×, (c) software-raster regression, (d) WebKit/Gecko rAF probe) and `tests/perf/harness/grade.mjs` (REQ-PERF-34), and uploads `perf-results.json` and `perf-grades.json` (A–F per subject) as lane evidence. Gate (REQ-PERF-34, restated, not redefined): any T1 subject below C or any T2 subject below D fails; in addition this lane fails any subject whose grade drops by ≥ 1 letter vs the last release's `perf-grades.json` on the same `perfHost` class. A missing harness, missing profile host (§4.7) or 0 frames is a lane failure. **GPU pool (SC-29, REQ-PERF-36):** this PRD sizes and provisions the GPU runner pool that PRD-PERF's per-PR frame-time ratchet (`tests/perf/browser/pr-ratchet.spec.ts`, 44 flagships at standard tier, profile (a)) runs on: pool size = `ceil(44 × perFlagshipSeconds / 600)` hosts so the ratchet finishes in ≤ 10 min, computed by `packages/qa/src/matrix/shard.ts` from the alpha.1 calibration run; hosts are gated EC2 g5/g4dn-class instances (task-tagged, TTL, REQ-QA-64) or a GitHub GPU larger runner; the ratchet runs only from trusted refs (no cloud credentials on fork PR code, §4.7). Cost and quota are recorded in §21 OI-QA-05.
- **REQ-QA-21** Motion lane. With motion **on** (the CI Storybook does not force reduced motion; STORYBOOK-SHOWCASE-08's `.storybook/preview.tsx:168-174` hard-set is removed in cert mode), a 12-frame strip at 16 ms intervals during each declared entrance must show ≥ 3 distinct frames (entrance actually animates). Under `reducedMotion: reduce`, after 500 ms settle: 0 `requestAnimationFrame` callbacks and 0 running `document.getAnimations()` over the next 1,000 ms, and final computed `opacity` = 1 and transform scale = 1 on the subject root. View-transition captures drop optics per engine (no `backdrop-filter` on `::view-transition-*` pseudo-elements).
- **REQ-QA-22** Cost gate. Visible backdrop-filter count, nesting depth and max blur per cell are recorded; flagship overlays and app-shell scenes must satisfy §4.7 (≤ 6 / ≤ 3 layers, blur ≤ 32px, full-viewport blur only on `scrim` at ≤ 12px). Runtime-remote measured 12 (modal), 21–29 (app shells), 51 (state matrix); each would fail.
- **REQ-QA-23** Engine-specific checks. WebKit: for each standard-tier surface, a 32×32 CSS-px probe region inside the surface interior (≥ 8 px from any edge and from any text client rect) over `hf-pattern` must show σ(L) reduced by ≥ 60% vs the same region in the surface-hidden capture (proves literal `-webkit-backdrop-filter` blur applied; distinct from the D-10 1×1 engine-detection probe). Gecko: for subjects with `refraction`, capture equals the `standard`-tier capture within maxDiffPixelRatio 0.001 (lens inert, never blank). Chromium enhanced: the bezel band rectangle (from `data-ag-part="bezel"` geometry) intersects 0 text client rects.

### 5.4 Pixel regression (L7) and visual-class gate

- **REQ-QA-24** Baseline set and thresholds. Baselines are element-cropped (`locator.screenshot`, `animations: 'disabled'`, `caret: 'hide'`) PNGs for the regression subset per subject-state: chromium and webkit × {photo, flat-white} × {light, dark} at 1440, plus chromium × photo × light at 390, plus firefox × photo × light at 1440 = **10 per subject-state**. Comparison: `toHaveScreenshot({ threshold: 0.1, maxDiffPixelRatio: 0.002 })`, with `maxDiffPixels` floor 20 for subjects < 10,000 px². Stored at `certification/baselines/linux/<engine>/<subject>/<state>__<scene>__<scheme>__<viewport>.png`. Each file ≤ 80 KB; total tree ≤ 30 MB (test-enforced). Baselines are produced only by the pinned container image on CI; darwin baselines are rejected by filename and by a PNG metadata check.
- **REQ-QA-25** Baseline updates. A PR that changes any file under `certification/baselines/` must carry the label `baseline-update`, include the generated `baseline-diff-report.html` artifact link in its description, and receive an approving review from a member of the `@auraoneai/auraglass-design` CODEOWNERS team (entry added by this PRD to `.github/CODEOWNERS`, a NEW file created by PRD-01 REQ-REL-13; the GitHub team itself is an org setting, recorded as an operator action if it does not exist). `--update-snapshots` is never run by a CI workflow on `pull_request`; updates come from a `workflow_dispatch` job that commits to the PR branch.
- **REQ-QA-26** Visual-class inputs (D-27). The classifier and its rule belong to PRD-01 (`scripts/release/visual-class.mjs`, REQ-REL-12: `pixelmatch` `threshold: 0.1`, `includeAA: false`, cell `changed` when `changedRatio > 0.001`; REQ-REL-13: `visual-bug-fix` label + release-owner approval + composite). This PRD supplies its inputs: on every `release/4.x` PR and 4.x tag, the `certify-pr / regression` job captures the **element-cropped** default-preference cells (REQ-QA-24 crop rules, at 1440×900 and 390×844 per RESP-REL-1) for the merge-base SHA and the head SHA into `$CERT_OUT/<sha>/visual-class/{base,head}/` and uploads the base | head | diff composites. Element crops are required so a small change on a small component is not diluted below `0.001` of a full viewport. This PRD does not write `visual-class.json` or decide the class. Per SC-09 the tolerance constants are PRD-REL's (cited, not redefined here); `.github/workflows/visual-regression.yml` is not repurposed and is deleted on `main` by QA-119; the 4.1.1 evidence-only edit to it (TRUST-062) lands on `release/4.x` only.

### 5.5 Static, artifact and token lanes

- **REQ-QA-27** Static lane (L1) runs on every PR. It runs gates owned by other PRDs and authors none of them (SC-16, SC-17, SC-39): MAT's `auraglass/no-optics-outside-material` and `auraglass/no-inline-glass` (no optics outside `src/material`); DS's raw-value gate `scripts/tokens/gates/literals.mjs` (rule `auraglass/no-raw-design-values`, ESLint + stylelint) against DS's single baseline `scripts/tokens/gates/literals-baseline.json` (DS-072/073; per-file counts by category, ratchets down only, 0 by 5.0.0-beta.1; architecture §15.2 "≈1,890" is measured on the first run) — this PRD keeps **no** literal count of its own; PERF's `auraglass/no-transition-all` (`transition: all` = 0); `!important` = 0 in `src/**` and stories (stylelint `declaration-no-important`, D-24); PKG's `auraglass/use-client-required`, `auraglass/use-client-needless` and `auraglass/no-random-in-render`; no `Glass*` alias exports from 5.0 entries; undefined-class check; and DS's dead/undefined `--ag-*` gate `scripts/tokens/gates/undefined-vars.mjs` (DS-063), which replaces `scripts/ci/check-undefined-custom-props.mjs` (removed by DS-079, SC-39). Each provider is registered in `certification/lanes.config.ts` by MODIFY; a missing provider fails the lane with `provider missing: <path>`.
- **REQ-QA-28** Artifact lane runs the PRD-PKG checks against the packed tarball (never `dist/` in place; tarball from `scripts/ci/lib/npm-pack.js`, SC-06): `publint --strict`, `attw --pack`, side-effect import in jsdom, per-import byte budgets from `docs/size-budgets.json` through PKG's `scripts/ci/verify-size-budgets.mjs` (SC-15; no `size-limit`, `.size-limit.json` or `build/budgets.lock.json`), dependency allowlist, transitive count, tarball contents ≤ 2 MB. `scripts/ci/verify-tree-shaking.js` (PKG-054) and `scripts/ci/verify-no-core-ui-deps.js` (PKG-075) are removed by PKG and are not invoked on `main`.
- **REQ-QA-29** Token lane runs `tests/tokens/contrast-matrix.test.ts` (PRD-03 REQ-DS-37) and `tests/a11y/contrast-matrix.test.ts` (PRD-05 REQ-A11Y-18) on every PR and every `main` push (it is a required check, REQ-QA-36, so it is never path-filtered: a path-skipped required check never reports and blocks merge); it uploads PRD-03's generated `dist/contrast-matrix.json` (min ratio per cell) as lane evidence used by claims (REQ-QA-31). Thresholds 4.5:1 / 3:1 / 7:1.

### 5.6 Evidence, claims, retention

- **REQ-QA-30** Evidence verifier. `packages/qa/src/evidence/verify.ts` (NEW) generalises `scripts/audit/verify-visual-evidence.js`: it verifies that `evidence-manifest.json` exists for the exact git SHA being released; that every lane L1–L12 has a manifest with `results.length > 0` and `status: pass`; that inventory, thresholds, scenes and baselines sha256s in every lane manifest equal the values recomputed from the checkout; that every `visual` subject has results in every required cell; that every PNG is non-blank and of the declared dimensions; that L13/L14 review records exist for every flagship and every product scene, bound to the same SHA (or to an earlier SHA with zero diffs in that subject's baselines and DOM snapshot). Any missing element fails. It runs in `certify-release.yml` before publish (REQ-QA-35).
- **REQ-QA-31** Computed claims. `packages/qa/src/claims/build.ts` (NEW) produces `claims.json` from verified manifests only, in the shape PRD-20 consumes (REQ-DX-77): `{ <id>: { value, unit, source: { artifact, sha, path } } }`. Claims at minimum: distinct visual components, flagships certified, cells executed per lane, failures = 0, worst OCR contrast, token-matrix minimum per class, per-import sizes, recipes = 1, perf grade distribution, engines covered, review records count. The "incomplete language" guard (`storybook-visual-certification.mjs:390-426`) is ported: if any lane is not `pass`, `build.ts` exits non-zero and writes no `claims.json`. Rendering into README, docs and `llms.txt` (`scripts/docs/gen-claims.mjs`, `<Claim id>`), the docs lint (`scripts/docs/lint-claims.mjs`) and the release-notes body (`scripts/release/release-notes.mjs`, REQ-REL-23) are PRD-20 and PRD-01 artifacts; this PRD does not write README or release-note text.
- **REQ-QA-32** Artifacts are never committed. A guard test fails if any tracked path matches `reports/**`, `certification/out/**`, `test-results/**`, `playwright-report/**`, `**/*-snapshots/**`, `coverage/**`, or any PNG outside `certification/baselines/`, `certification/scenes/` and `docs/**/assets/` (allowlist in the test). `.gitignore` gains these patterns. (PRD-00 removes the existing `reports/` tree; this requirement keeps it out.)
- **REQ-QA-33** Retention as specified in §4.8 (SC-07 owner: this PRD), set explicitly in every `actions/upload-artifact` step (`retention-days: 14 | 30 | 90` for PR | main and nightly | release); uploads are named `evidence-<job>-${{ github.sha }}`; lane scripts resolve their output root through TRUST's helper `scripts/ci/lib/evidence-dir.js` (`AURAGLASS_EVIDENCE_DIR ?? <repo>/.artifacts`, TRUST-006), so `$CERT_OUT` defaults to `<evidence-dir>/cert`; the release workflow attaches `certification-<version>.tar.zst` (zstd -19) to the GitHub release; size of the release bundle ≤ 2 GB (captures at JPEG q85 except baseline-compared cells, which stay PNG).

### 5.7 CI wiring and fail-closed behaviour

- **REQ-QA-34** Workflows (NEW): `certify-pr.yml` (`pull_request`: L1–L5, L7–L9, L12, PR-reduced L6, L11 when triggered; no cloud credentials); `certify-main.yml` (`push: main`: all PR lanes on all subjects + full L6 + L11); `certify-nightly.yml` (`schedule` 03:00 UTC: full L6 on 3 engines + L10); `certify-release.yml` (`on: workflow_call` with input `sha`, plus `workflow_dispatch` for dry runs that never publish: every lane on the given SHA, REQ-QA-30, REQ-QA-31; it contains **no** publish step and needs no `id-token: write`). All use `actions/*@v6` and Node 24, matching `publish-npm.yml:25-31` (file name kept, SC-05).
- **REQ-QA-35** Publish precondition (SC-05, SC-10). The only publish path is PRD-REL's tag workflow `.github/workflows/publish-npm.yml` (the npm trusted publisher is bound to `auraoneai/auraglass` + that file name, so it is **never** renamed or replaced; owner PRD-REL REL-025/026, 4.1.1 instance TRUST-077/080). `certify-release.yml` is a reusable workflow called from `publish-npm.yml` as job `certify` (`uses: ./.github/workflows/certify-release.yml`, `with: sha`), and the publish job's `needs:` gains `certify` **in addition to** the existing `verify` job that calls `glass-pipeline.yml` through `workflow_call` (REQ-TRUST-10; REL-026 keeps `Glass Quality Gates` on the publish path). `npm publish` cannot run if `packages/qa` `verify` exits non-zero. `glass-pipeline.yml` is owned by PRD-PKG (PKG-038) and is **not** deleted or replaced by this PRD; its job names `Glass Quality Gates`, `Next.js npm Integration` and `Vite npm Integration` stay required checks (SC-10). The single edit to `publish-npm.yml` (QA-096) is a MODIFY that depends on REL-025 and is reviewed by the PRD-REL owner.
- **REQ-QA-36** Fail closed. No certification workflow step uses `continue-on-error: true` or `|| true`; no "score" aggregation exists; a lane whose subject list is empty, whose manifest is missing, or whose junit has 0 tests fails. PR lanes that select affected subjects from the import graph (L5, L6 reduced, L7, L8, L9) always add a fixed sentinel set (`Surface` regular/regular, `Button` default, `Dialog` open, once those exist; before 5.0 subjects exist, the 4.x `GlassButton` default) so an unaffected PR still executes > 0 cells instead of passing empty. Required status checks on `main` and `release/4.x` are **added** alongside the existing ones (SC-10: `Glass Quality Gates`, `Next.js npm Integration`, `Vite npm Integration` and `change-class` keep their names and are never renamed by this PRD; check names are PRD-REL's, REQ-REL-17): `certify-pr / static`, `/ artifact`, `/ token`, `/ behaviour`, `/ visual-reduced`, `/ regression`, `/ engine`, `/ motion`, `/ unit`. Adding them to branch protection is an operator action recorded in §21 OI-QA-07. A meta-test parses every workflow YAML and asserts these properties.
- **REQ-QA-37** Time budgets. `certify-pr.yml` wall clock p90 ≤ 20 min; `certify-main.yml` ≤ 45 min; `certify-release.yml` ≤ 90 min including the full matrix on the shard count computed by `packages/qa/src/matrix/shard.ts` (§4.4); each lane records duration and per-host capture rate in its manifest; a budget overrun for 5 consecutive runs opens an issue (does not fail the release).
- **REQ-QA-38** Consumer canaries (L11). The fixtures are PRD-02's (`canaries/next16/`, `canaries/next15/`, `canaries/vite/`, `canaries/vite-tailwind4/`, REQ-PKG-80..84; Base UI floor/latest via REQ-PKG-86); this PRD does not create a second fixture tree. The L11 lane runs each fixture's own assertions from the packed tarball produced by `scripts/ci/lib/npm-pack.js` (REQ-PKG-66), asserts `node_modules/aura-glass` is not a symlink, and adds one cross-engine smoke that PRD-02 does not run: every page of the `next16` production server (`next start`) returns HTTP 200 with 0 console errors in chromium, webkit and firefox. A missing fixture fails the lane with `provider missing: canaries/<name>`.
- **REQ-QA-39** Frozen 4.x consumer fixture (SC-08): the fixture `tests/fixtures/consumer-4x/` and its contents contract (PRD-REL §11.4, including `flagship-subset.json`) are owned by PRD-REL (REL-115); this PRD owns only the L11 CI job `consumer-4x-frozen` in `certify-main.yml`, which installs it from the packed tarball; it passes unchanged on every 4.x minor (build, render, default-mode cells unchanged per REQ-QA-26 inputs); on 5.0, `npx @auraglass/cli migrate 4to5` (SC-33; engine DX-041, run from the locally installed packed CLI tarball, no network download) then build passes with 0 `TODO(aura-glass 5)` markers on the flagship subset.

### 5.8 Test-quality upgrade (L12)

- **REQ-QA-40** Template removal. All files containing the marker `Test Suite Coverage:` (355 at HEAD) are deleted or rewritten. A rewritten file must contain ≥ 1 `userEvent` interaction or role-based assertion (`getByRole`/`findByRole`) and no assertion from the banned list (REQ-QA-41). Files for components that are REMOVE/CONSOLIDATE in the inventory are deleted with their components (PRD-16).
- **REQ-QA-41** Vacuous-assertion lint. ESLint rule `auraglass/no-vacuous-assertions` (SC-16 namespace; implemented in `packages/qa/eslint/no-vacuous-assertions.js` and registered by MODIFY in the existing `eslint-plugin-auraglass.js`, wired in `eslint.config.js` after PKG-015; no separate `ag-test` plugin) fails on: `expect(container).toBeInTheDocument()`; `expect` inside `if (...)` without an `else` that fails; loops over `querySelectorAll` results without a preceding length assertion; `getComputedStyle(...).animationDuration` in jsdom tests; `toMatchSnapshot()` on DOM in `src/**` (inline snapshots of serialised props allowed); `axe` color-contrast assertions in jsdom.
- **REQ-QA-42** Per-flagship behavioural contract. Each flagship has `src/<entry>/<Component>/<Component>.test.tsx` covering: controlled and uncontrolled value, every callback, disabled state, `data-ag-part`/`data-state` contract per §11.3, ref forwarding to the documented element, ARIA associations (`aria-describedby` id resolves to the helper text node), and SSR render without warnings. Keyboard behaviour lives in the APG spec (L5), not jsdom.
- **REQ-QA-43** Coverage floors per directory, enforced in `certify-pr / unit` via `coverageThreshold` path keys: `src/material/**` 90% lines / 85% branches; flagship directories 85% / 75%; `src/theme/**` and `src/utils/**` 80% / 70%; global 70% / 60%. Thresholds may only increase (ratchet test against `certification/ratchets.json`).
- **REQ-QA-44** Jest config hygiene: the `jest.config.js:38` image mapping points to an existing `__mocks__/fileMock.js` (NEW) or is removed; `jest.visual.config.js` and `tests/visual/visual-regression.test.js` are deleted; `testEnvironment` options and `setupFilesAfterEnv` appear exactly once.

### 5.9 Retirement of the 4.x certification layer

- **REQ-QA-50** Retire the 356 certification: delete `scripts/audit/storybook-visual-certification.mjs`, `tests/visual/design-system/storybook-visual-certification.spec.ts`, and the `test:visual:ci` dependency on `reports/component_inventory.json`; `playwright.visual-ci.config.ts` is deleted once `certification/playwright.cert.config.ts` covers its remaining live specs (`tests/visual/design-system/glass-audit-coverage.spec.ts`, `tests/visual/design-system/accessibility-story-quality.spec.ts`, `tests/visual/design-system/token-purity-layout-audit.spec.ts`, `tests/visual/liquid-glass/liquid-glass-showcase.spec.ts`, per QA-CERTIFICATION-14 PARTIAL). Until then (4.1.1–4.3), the certification markdown must not use the words "certified" or "green" (claim retraction is PRD-00).
- **REQ-QA-51** Delete `scripts/verify-glass-pipeline.js` (and `npm run glass:validate`); delete `.github/workflows/design-system-compliance.yml` entirely (QA-118 is its single remover, SC-39; DS-047/061/062/076 move their gates into L1/L4 first); remove the duplicate `glass:validate` steps in `glass-pipeline.yml:70-74` by a MODIFY that depends on PKG-038 (the file and its job names stay, SC-10); delete `visual-regression.yml` on `main` (QA-119, SC-09). The README "31-check glass pipeline" sentences (`README.md:26,618`) are removed by PRD-TRUST/PRD-DX.
- **REQ-QA-52** The 45 tracked root `.mjs` probes (`git ls-files '*.mjs'` at repo root; all hardcode `localhost:6006`) are deleted by PRD-00 REQ-TRUST-36 in 4.1.1 (Wave 0, before this PRD starts); this PRD reads them from history (`git show 15b6de6f7:<file>`) and re-expresses any useful probe logic as a named detector in `packages/qa` **with a fixture each**, or records it as dropped. This PRD deletes `scripts/visual-regression-system.js`, `scripts/visual-test-runner.js`, the empty `visual-baselines/`, `scripts/storybook-exhaustive-qa.js`, version-pinned audits `scripts/audit/3.0.7-source-audit.js`, `scripts/audit/3.1-frame-loop-audit.js`, `scripts/ci/stale-3-3-scan.js`, `scripts/ci/style-audit.js` (v2 kept until the static lane replaces it).

### 5.10 Remote execution

- **REQ-QA-60** Placement. No certification lane script runs a browser unless `process.env.CI === 'true'` or `AG_CERT_REMOTE=1` is set by the runner entrypoint (which also sets `AG_REMOTE_RUNNER=1`, the Performance PRD's remote-only switch, REQ-PERF-32); local invocation prints the remote command and exits 2. (Policy: browser automation runs remotely; local runs are allowed only when the operator explicitly requests local debugging, via `AG_CERT_ALLOW_LOCAL=1`.)
- **REQ-QA-61** Offline bundle. `certification/runner/build-bundle.mjs` (NEW) produces `cert-bundle-<sha>.tar.zst` with the members listed in §4.7 and `bundle.manifest.json`; `certification/runner/worker-entry.sh` (NEW, EC2 user-data) verifies every sha256, runs the requested lanes/shards with network access limited to `127.0.0.1`, uploads `$CERT_OUT` to the S3 evidence prefix, and calls `shutdown -h now` on exit or after a 120-minute wall clock.
- **REQ-QA-62** CA-expiry preflight. `certification/runner/preflight.mjs` (NEW) fails with exit 78 and the message `runner egress CA expired: notAfter=<date>; offline bundle required` when a job requests egress and the proxy CA is expired or expires within 7 days. Jobs never request egress by default. The pipeline never rotates, replaces or bypasses the CA (outside autonomous scope; recorded for the operator).
- **REQ-QA-63** Determinism. One container image digest and one exact Playwright version (pinned exact in devDependencies; `^1.55.0` at `package.json:422` becomes an exact version) for all lanes; fonts installed in the image and listed in the manifest; `deviceScaleFactor` 1 for desktop and 3 for mobile, set explicitly; `animations: 'disabled'` for regression captures; `Date.now`/`Math.random` stubbed via `page.addInitScript` in visual lanes. Two consecutive runs on the same SHA produce identical L7 results (flake gate, nightly). A cell quarantined for flake (§16, ≤ 7 days) is recorded as `quarantined` in the lane manifest and counts as **not pass** for REQ-QA-30: no release SHA may carry a quarantined cell.
- **REQ-QA-64** Resource hygiene. Every EC2 attempt is tagged `attempt-id`, `sha`, `lane`, `ttl`; a nightly job lists instances with the cert tag older than their TTL and reports them (does not terminate instances it did not launch, e.g. the unrelated `prism-budget-build` noted in runtime-remote).

### 5.11 Manual and human lanes

- **REQ-QA-70** Manual screen-reader matrix (L13). The protocol, per-flagship scripts (`tests/a11y/manual/scripts/<component>.md`) and record schema (`tests/a11y/manual/sr-record.schema.json`) are PRD-05's (REQ-A11Y-43, -44); `certification/review/sr-matrix.template.json` (NEW) is generated from them and lists, per flagship, tasks (e.g. Dialog: open, read title + description, Tab cycle trapped, Escape closes, focus returns) × AT/browser pairs: VoiceOver + Safari macOS 26, VoiceOver + Safari iOS 26, NVDA 2025.x + Chrome stable (Windows 11), TalkBack + Chrome Android 15, plus one physical-touch pass (iOS and Android, REQ-A11Y-44). Each cell records pass/fail/notes, tester, date, SHA, AT + browser versions; the uploaded artifact is PRD-05's `a11y-manual-<sha>.json`. GA requires PRD-A11Y's issue-#16 closure rule (SC-29): SR-1..SR-4 and the physical-touch pass recorded as pass for **all 44 flagships** on the RC SHA. There is no waiver allowance for the SR matrix; a failing cell is fixed or the flagship is not GA. A known AT defect outside AuraGlass's control is recorded in the cell's notes with a linked `sr-known-issue` issue and still requires a pass verdict for the AuraGlass behaviour under test.
- **REQ-QA-71** Human visual review (L14) per the §4.6 rubric, on review composites generated by `packages/qa/src/evidence/composite.ts` (NEW). Required: every flagship subject-state and all 6 product scenes at RC-1; any baseline-update PR (subjects changed only).
- **REQ-QA-72** Review records are artifacts (`review-record.json`, `a11y-manual-<sha>.json`) uploaded by a `workflow_dispatch` job that takes the reviewer's input; they are bound to SHA and composite sha256; REQ-QA-30 consumes them. They are not committed.
- **REQ-QA-73** Exemptions. A subject may be exempt from a specific mechanical gate only through `certification/exemptions.json` (`subject`, `gate`, `cells`, `rationale`, `approvedBy`, `expires` ≤ 180 days). Contrast (REQ-QA-13) and console (REQ-QA-16) cannot be exempted. Expired exemptions fail.

### 5.12 Release certification checklist

- **REQ-QA-80** `certification/RELEASE_CHECKLIST.md` (NEW) is rendered into the release PR body by `certify-release.yml` with each item auto-ticked from the evidence manifest (no manual ticking of mechanical items):
  1. Tag SHA = evidence SHA; worktree clean (no uncommitted files, unlike HEAD today).
  2. L1 static, L2 artifact, L3 change class, L4 token, L5 behaviour, L6 full environment visual, L7 regression, L8 engine, L9 motion, L10 perf, L11 canaries, L12 unit: all `pass`, each with > 0 results.
  3. Evidence verifier (REQ-QA-30) `pass`; `claims.json` built; README/release-note claim values rendered from it by PRD-20 `gen-claims.mjs` / PRD-01 `release-notes.mjs` in the release commit.
  4. Every flagship: §11.3 deliverables present (variant metadata, `data-ag-part` contract, APG script, budget line, perf grade ≥ C, baselines, codemod fixture). Gate: `scripts/ci/verify-flagship-deliverables.mjs` over `certification/flagship-deliverables.json` (QA-127; owner PRDs append their entries, e.g. AI-092, MED-156), registered in L1 Static and failing closed on a missing flagship or item.
  5. L13 SR matrix complete for all 44 flagships (issue-#16 rule, REQ-QA-70); L14 rubric records for all flagships and product scenes.
  6. No expired exemptions or console-allowlist entries; 0 quarantined cells.
  7. Frozen 4.x fixture green on `release/4.x`; post-codemod green on 5.0.
  8. Release bundle attached to the GitHub release; artifact retention set.
- **REQ-QA-81** Prereleases (`-alpha`, `-beta`, `-rc`) run the same checklist; L13/L14 are required from RC-1 only; at alpha.1 the L10/L2 lanes provide the calibration run whose artifacts the owners freeze (D-26): byte ceilings in PRD-PKG's `docs/size-budgets.json` (SC-15, PKG-048/049; changes logged in `docs/size-budgets.changelog.md`) and surface/BCI targets in PRD-PERF's `tests/perf/harness/budgets.json` (REQ-PERF-38). `certification/ratchets.json` holds only this PRD's coverage ratchets (REQ-QA-43); the literal baseline is DS's (SC-17).

---

## 6. Files/directories affected (existing paths)

All verified to exist at `15b6de6f7`.

| Path | Change |
|---|---|
| `tests/visual/design-system/token-purity-layout-audit.spec.ts` | Measurement code `:852-2232` and fixtures `:3930-4128` extracted into `packages/qa`; spec reduced to a 4.x driver over `thresholds.json#legacy4x`; deleted at 5.0 GA |
| `scripts/audit/verify-visual-evidence.js` | Logic ported to `packages/qa/src/evidence/verify.ts`; kept as a thin 4.x wrapper until 4.x EOL |
| `scripts/audit/public-export-audit.js` | Replaced by `packages/qa/src/inventory/buildInventory.ts`; heuristic at `:318-324` removed |
| `scripts/audit/static-glass-material-audit.js` | Kept on `release/4.x`; superseded on `main` by the PRD-04 optics lint |
| `scripts/audit/runtime-cleanliness-audit.js` | Kept; wired into L1 |
| `scripts/ci/verify-app-chrome-visuals.js` | Keyboard and console checks kept as L5 cases; screenshot capture removed |
| `scripts/ci/verify-recipes-render.js` | Removed by DX-100 (SC-39); live subject rendering (REQ-QA-04) covers the cert side |
| `scripts/ci/verify-pack.js` | Kept; invoked by L2 through the PKG artifact checks |
| `scripts/ci/verify-tree-shaking.js`, `verify-no-core-ui-deps.js`, `check-undefined-custom-props.mjs` | Not kept here: removed by PKG-054, PKG-075 and DS-079 respectively (SC-39); L2 uses `scripts/ci/verify-size-budgets.mjs` and the PKG allowlist, L1 uses DS's `scripts/tokens/gates/undefined-vars.mjs` |
| `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js` | Not modified here; PRD-02 replaces them with `canaries/*` (REQ-PKG-80..84) after PRD-00 resolves the uncommitted diffs; L11 runs the replacements |
| `playwright.config.ts` | `toHaveScreenshot` defaults at `:123-128` removed; config deleted when legacy specs are retired |
| `playwright.visual-ci.config.ts`, `playwright.visual-matrix.config.ts` | Replaced by `certification/playwright.cert.config.ts` |
| `jest.config.js` | QA-owned (SC-29): `:38` mapping fixed; `coverageThreshold` `:79-90` replaced by per-directory floors; other PRDs add projects by MODIFY depending on QA-003 |
| `eslint-plugin-auraglass.js` | PKG-owned file (SC-16): MODIFY to register `auraglass/no-vacuous-assertions` (REQ-QA-41) |
| `.storybook/preview.tsx` | Cert mode only: no forced `reducedMotion` (`:168-174`), `certify` global and decorator branch (REQ-QA-11). The `environment` global and all non-cert preview changes are the Storybook PRD's |
| `.storybook/StorySurface.tsx` | Not rendered under `certify:1` (`:88-96` stage) |
| `.github/workflows/publish-npm.yml` | PRD-REL-owned, file name kept (SC-05; trusted-publisher binding). This PRD only adds the `certify` job calling `certify-release.yml` and appends it to the publish job's `needs:` (REQ-QA-35, QA-096 after REL-025) |
| `.github/workflows/glass-pipeline.yml` | PRD-PKG-owned (PKG-038); kept, job names unchanged (SC-10). This PRD removes only the duplicate `glass:validate` steps `:70-74` (REQ-QA-51) |
| `.github/workflows/design-system-compliance.yml` | Deleted by QA-118 (SC-39) after DS gates move into L1/L4 |
| `.github/workflows/visual-regression.yml` | Deleted; its role as the base/head capture job for PRD-01's `visual-class.mjs` (PRD-01 §6 row) is taken by `certify-pr / regression` (REQ-QA-26) |
| `.github/workflows/deploy-storybook.yml` | Not modified by this PRD (Storybook PRD owns it); cert lanes build their own `storybook-static/` per SHA with the same command |
| `.gitignore` | Adds REQ-QA-32 patterns; `:170` snapshot ignore kept for legacy dirs |
| `package.json` | Scripts `test:visual*`, `glass:validate`, `audit:ux`, `audit:visual:evidence` replaced by `cert:*` scripts; `@playwright/test` pinned exact (`:422`); a tesseract runner dependency added as devDependency only (`@axe-core/playwright` is added by PRD-05 REQ-A11Y-42) |
| `src/**/*.test.tsx` containing `Test Suite Coverage:` (355 files) | Deleted or rewritten (REQ-QA-40) |
| `src/**/__snapshots__/*.snap` (339 files) | Deleted with their templated tests |
| `tests/e2e/navigation.spec.ts` | Deleted (tests Storybook manager UI, asserts truthy `tagName`) |
| `README.md` (`:26`, `:618`), `RELEASE_NOTES_4.1.0.md` | Not edited here: certification claims are retracted by PRD-00 and re-rendered from `claims.json` by PRD-20 / PRD-01 (REQ-QA-31) |
| `reports/**` | Removed from the tree by PRD-00; kept out by REQ-QA-32 |

## 7. Components affected

This PRD changes no runtime component code. It affects components through the contracts it enforces:

| Components | Effect |
|---|---|
| All 44 flagships (§11.2) | Must declare `parameters.ag.subject`, states in typed metadata, `refraction` eligibility; must pass L5–L9, L13, L14 and have L7 baselines (§11.3) |
| T0 `Surface` (12 variant × thickness subjects) | Full T0 matrix (180 cells per subject-state, §4.4) |
| T0 `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame` | Flagship matrix (148 cells per declared state) |
| T2 core (~40, PRD-14) | Reduced matrix (29 cells) |
| Registry blocks / six product scenes (PRD-18 in §16 numbering) | Rendered live as subjects; L14 "reads as one hand" |
| 4.x components on `release/4.x` (6 glass primitives with `data-ag-preview="v5"` in 4.3, PRD-17) | Legacy driver + visual-class gate (REQ-QA-26) |
| Story decorators (`.storybook/StorySurface.tsx`, `ContrastGuard` wrapper) | Disabled in cert mode |

## 8. New components/files

| Path (all NEW) | Purpose |
|---|---|
| `packages/qa/package.json` | `"name": "@auraglass/qa"`, `"private": true` |
| `packages/qa/src/inventory/buildInventory.ts` | REQ-QA-02 |
| `packages/qa/src/resolve/resolveSubject.ts` | REQ-QA-01 |
| `packages/qa/src/inspect/{computedStyle,compositedContrast,census,layout,presentation}.ts` | Extracted 4.x measurement |
| `packages/qa/src/pixel/{notBlank,separation,frameFill,density,neon,intentDeltaE,containment,materialPresence,dhash}.ts` | REQ-QA-03, -12, -14 |
| `packages/qa/src/ocr/{tesseract,textHiddenTwin,wordContrast}.ts` | REQ-QA-13 |
| `packages/qa/src/matrix/{axes,prune,force,shard}.ts` | §4.4 |
| `packages/qa/src/evidence/{manifest,verify,composite}.ts` | REQ-QA-30, -71 |
| `packages/qa/src/claims/build.ts` | REQ-QA-31 |
| `packages/qa/eslint/no-vacuous-assertions.js` | REQ-QA-41 |
| `packages/qa/fixtures/**` | Detector self-test fixtures (one positive + one negative per detector) |
| `certification/scenes/*` + `scenes.manifest.json` | REQ-QA-10 |
| `certification/matrix.config.ts`, `thresholds.json`, `ratchets.json`, `exemptions.json`, `console-allowlist.json` | Config |
| `certification/playwright.cert.config.ts` | Projects `chromium`, `webkit`, `firefox`; `webServer` = static server over `storybook-static/` |
| `certification/lanes/*.spec.ts` | §12 |
| `certification/baselines/linux/{chromium,webkit,firefox}/**` | REQ-QA-24 |
| `certification/runner/{build-bundle.mjs,worker-entry.sh,preflight.mjs}` | REQ-QA-61, -62 |
| `certification/review/{sr-matrix.template.json,visual-rubric.md}` | REQ-QA-70, -71 |
| `certification/RELEASE_CHECKLIST.md` | REQ-QA-80 |
| `.github/workflows/certify-{pr,main,nightly,release}.yml` | REQ-QA-34 |
| Entries in `.github/CODEOWNERS` (file created by PRD-01 REQ-REL-13) | `certification/baselines/` and `certification/thresholds.json` → design + QA owners |
| `__mocks__/fileMock.js` | REQ-QA-44 (if mapping kept) |

Note: neither `packages/` nor `certification/` exists at HEAD, and `package.json` declares no `workspaces`. Adding the `packages/*` workspace is a PRD-02 build decision; if PRD-02 does not adopt workspaces, `packages/qa` lives at `certification/qa/` with the same internal layout and is never included in the published `files` list.

## 9. Components/files to remove or deprecate

| Path | Action | When | Reason |
|---|---|---|---|
| `scripts/audit/storybook-visual-certification.mjs` | delete | 4.2 (`main`); kept unused on `release/4.x` | QA-CERTIFICATION-04, STORYBOOK-SHOWCASE-01/-03 |
| `tests/visual/design-system/storybook-visual-certification.spec.ts` | delete | 4.2 | JSON-only self-agreement (QA-CERTIFICATION-14) |
| `reports/component_inventory.json`, `reports/glassmorphism-storybook-visual-certification.*` | removed with `reports/` | 4.1.1 (PRD-00) | frozen 3.0 inventory |
| `scripts/verify-glass-pipeline.js`; `npm run glass:validate` | delete | 4.2 | QA-CERTIFICATION-09 |
| `.github/workflows/design-system-compliance.yml` (QA-118), `visual-regression.yml` (QA-119, `main` only) | delete | when `certify-pr.yml` is required (Step 4, §20) | score-based, or wrong upload path |
| `scripts/visual-test-runner.js`, `scripts/visual-regression-system.js`, `visual-baselines/`, `jest.visual.config.js`, `tests/visual/visual-regression.test.js` | delete | 4.2 | QA-CERTIFICATION-03, -13 |
| 45 root `*.mjs` probes | deleted by PRD-00 (REQ-TRUST-36) | 4.1.1 | QA-CERTIFICATION-12, HISTORY-HYGIENE-09; this PRD only ports useful logic from history (REQ-QA-52) |
| `scripts/storybook-exhaustive-qa.js` | delete | 4.2 | stale, no teeth |
| `scripts/audit/3.0.7-source-audit.js`, `scripts/audit/3.1-frame-loop-audit.js`, `scripts/ci/stale-3-3-scan.js`, `scripts/ci/style-audit.js` | delete | 4.2 | version-pinned |
| `tests/e2e/navigation.spec.ts` | delete | 4.2 | tests Storybook manager UI |
| 355 templated `*.test.tsx` + their `.snap` | delete/rewrite | rolling, completed by 5.0.0-beta | QA-CERTIFICATION-06 |
| `tests/visual/**/*.spec.ts-snapshots/` darwin baselines (untracked) | ignore, never used by CI | now | QA-CERTIFICATION-03 |
| `token-purity-layout-audit.spec.ts` (driver) | deprecate on `main` at 5.0.0-alpha.1; delete at GA | — | replaced by L6 driver; measurement survives in `packages/qa` |
| `scripts/audit/verify-visual-evidence.js` | keep on `release/4.x`; `main` uses `packages/qa` verify | — | provenance logic kept |

## 10. API changes

This PRD changes **no published runtime API**. Its "API" is the contributor and consumer-facing certification contract.

| Change | Surface | Class | Notes |
|---|---|---|---|
| `parameters.ag.subject`, `parameters.ag.states`, `parameters.ag.refraction` story parameters | Storybook stories (internal) | C-I | required for every certified subject |
| `/** @nonvisual */` JSDoc tag on exports | source metadata (internal) | C-I | REQ-QA-02 |
| `environment` and `certify` Storybook globals | docs Storybook (public site) | C-E | `environment` is also a Material Lab feature (PRD-04) |
| `npm run` scripts `test:visual`, `test:visual:ci`, `test:visual:matrix`, `glass:validate`, `audit:ux`, `audit:visual:evidence` removed; `cert:static`, `cert:visual`, `cert:regression`, `cert:verify`, `cert:claims`, `cert:bundle` added | contributor scripts (not a published API) | C-I | documented in CONTRIBUTING |
| README/release-note claims become generated regions | docs | C-I | numbers may drop (honest counts); not an API break |
| Visual output changes on `release/4.x` | rendered pixels | treated as **C-B** unless labelled `visual-bug-fix` (D-27, REQ-QA-26) | enforced by L3 |
| Evidence no longer in the npm tarball or git tree | repository/tarball contents | C-I | PRD-00 removes; REQ-QA-32 guards |

## 11. Migration concerns

1. **Counts will go down, publicly.** "498 certified" becomes "N distinct visual components certified in 14 lanes" where N ≤ ~452 on 4.x and ≈ 160–250 on 5.0. Release notes must explain the recount (QA-CERTIFICATION-05) once, in 4.1.1, so the drop is not read as a regression (PRD-00 owns the wording).
2. **4.x will fail the new gates.** Running L6 on 4.x today would fail most subjects (266/342 text runs on black). The 4.x lanes therefore run in **report-only mode on `release/4.x` for gates that would require a visual change** (OCR contrast over dark scenes, glass-over-nothing), while the visual-class gate stays blocking. This is the only place a gate does not fail closed, and it is scoped to `release/4.x` with the report attached to every 4.x release. Deviation note: §15.2 says "fail" for every lane; applying that to 4.x would make every 4.x patch unshippable without the C-B visual changes that D-27 forbids on maintenance branches. 4.2's D-28 visual bug fixes (dark-mode text, `prefers-contrast: more`) are the exception and must pass the relevant gates.
3. **Baseline bootstrapping.** The first baseline set is created from the alpha.1 SHA by a `workflow_dispatch` job and approved by human review (L14) in one PR per flagship family, not one giant PR, so reviewers actually look at the composites.
4. **Template-test deletion lowers the test count** from 759 files. Coverage may drop before rewritten tests land; per-directory floors (REQ-QA-43) apply to 5.0 directories only, and the global floor starts at the measured value on the first `certify-pr` run and ratchets.
5. **Contributors lose local visual runs by default** (REQ-QA-60). The PR lane publishes the HTML report and diff images as artifacts; `cert:bundle` + remote dispatch is the supported way to iterate.
6. **Storybook stage removal** changes how every story looks in cert mode only; the interactive docs Storybook keeps an `environment` default of `photo` (PRD-04 §15.4), not white.
7. **History is not rewritten** (D-32 owner decision); the 2.95 GB of committed evidence remains in history. Clone cost for CI is mitigated with `actions/checkout` `fetch-depth: 1` and `filter: blob:none`.

## 12. Tests required

All paths NEW. "Self-test" = runs the detector against `packages/qa/fixtures/` positive and negative cases; every detector must fire on its positive fixture and stay silent on its negative one.

### 12.1 Harness self-tests (Jest/Node; run in L12 on every PR)

| Test file | Asserts |
|---|---|
| `packages/qa/test/inspect.fixtures.test.ts` | The 10 ported 4.x fixtures (`token-purity-layout-audit.spec.ts:3930-4128`) produce the same verdicts as at HEAD |
| `packages/qa/test/inventory.test.ts` | Unclassified export → error; `@nonvisual` excluded; alias counted once; grep finds no `470|498|356` literal in `packages/qa` and `certification/` |
| `packages/qa/test/resolve.test.ts` | Subject without `parameters.ag.subject` story → error; no fuzzy matching code path exists |
| `packages/qa/test/pixel-gates.test.ts` | Each gate in REQ-QA-14 on synthetic PNGs: 39-level deviation fails, 40 passes; 24.9% separation fails; 1.01% neon fails; 4 hue families fail; ΔE 9.9 fails; right-edge contact at 390 fails |
| `packages/qa/test/material-presence.test.ts` | Opaque ancestor over `photo` → `glass-over-nothing`; surface with white 255 / black 22 interiors (4.x-like, ≈0.08 effective alpha) fails the solved-floor rule against a fixture `opacity-floors.json` with `floorAlpha` 0.30; tinted surface at the floor passes |
| `packages/qa/test/ocr-contrast.test.ts` | Rendered fixture with rgba(0,0,0,.9) text on rgb(13,31,43) reports ≈1.2:1 and fails; 18.66px bold at 3.1:1 passes; text present + 0 OCR words fails "legible text exists" |
| `packages/qa/test/dhash-duplicates.test.ts` | Two identical captures flagged `duplicate-visual`; 1-pixel-different captures over threshold not flagged |
| `packages/qa/test/matrix-prune.test.ts` | forced-colors ⇒ only lightweight/solid and only in engines listed as supporting forced-colors emulation; enhanced only on chromium/glass/motion ≠ none/default preference; total cell counts for T0 (180)/flagship (148 + 32)/T2 (29) equal §4.4 formulas; `shard.ts` returns `ceil(captures ÷ (rate × 3600))` for a fixture rate |
| `packages/qa/test/evidence-verify.test.ts` | Missing lane manifest, empty results, SHA mismatch, stale inventory hash, missing review record → each FAIL; complete synthetic manifest → PASS |
| `packages/qa/test/claims.test.ts` | Any non-pass lane makes `build.ts` exit non-zero and write no `claims.json`; every emitted claim has `source.artifact`, `source.sha` equal to the manifest SHA and `source.path` that exists in the evidence set; output validates against the REQ-DX-77 shape |
| `packages/qa/test/no-vacuous-assertions.test.ts` | ESLint rule reports each banned pattern in REQ-QA-41 and none of the allowed ones |
| `packages/qa/test/workflows.test.ts` | Parses `.github/workflows/certify-*.yml` and `publish-npm.yml` (SC-05): no `continue-on-error`, no `|| true`, every artifact upload has `retention-days`, `pull_request` jobs reference no cloud secrets, `certify-release.yml` has no `npm publish` step, and `publish-npm.yml`'s publish job `needs` both the `certify` job (`certify-release.yml`) and the existing `verify` job (`glass-pipeline.yml`, SC-10); fails if any workflow named `release.yml` exists |
| `packages/qa/test/no-committed-evidence.test.ts` | REQ-QA-32 tracked-path guard via `git ls-files` |
| `packages/qa/test/baselines-budget.test.ts` | Each baseline ≤ 80 KB, total ≤ 30 MB, no `darwin` in names, PNG metadata from the pinned image |
| `packages/qa/test/scenes-manifest.test.ts` | 8 ids exactly; sha256 match; licence present; dimensions ≥ 2880×1800; total ≤ 6 MB |
| `certification/runner/preflight.test.mjs` | Expired CA date → exit 78 with the exact message; bundle hash mismatch → exit 1 |

### 12.2 Lane specs (Playwright, `certification/playwright.cert.config.ts`, projects chromium/webkit/firefox)

| Test file | Asserts |
|---|---|
| `certification/lanes/environment-visual.spec.ts` | One test per (subject-state × cell): REQ-QA-11..17 gates; writes cell JSON and capture |
| `certification/lanes/preference-modes.spec.ts` | REQ-QA-15 deltas vs default cell |
| `certification/lanes/regression.spec.ts` | REQ-QA-24 `toHaveScreenshot` per baseline cell |
| `certification/lanes/engine.spec.ts` | REQ-QA-23 WebKit blur-applied, Gecko inert lens, Chromium bezel/text disjoint |
| `certification/lanes/behaviour.spec.ts` | REQ-QA-18 axe (color-contrast on) + APG specs + emulated preferences |
| `certification/lanes/ssr-hydration.spec.ts` | REQ-QA-19 zero warnings, no `<html>` attribute mutation after script |
| `certification/lanes/overlay-stacking.spec.ts` | REQ-QA-19 LIFO Escape, z-order |
| `certification/lanes/motion.spec.ts` | REQ-QA-21 frame strip ≥ 3 distinct frames; reduced motion idle and final state |
| `certification/lanes/cost.spec.ts` | REQ-QA-22 layer counts, depth, blur per cell |
| `certification/lanes/perf.spec.ts` | REQ-QA-20 grades; regression of ≥ 1 letter fails |
| `certification/lanes/console.spec.ts` | REQ-QA-16 across all cells |
| `certification/lanes/canaries.spec.ts` | REQ-QA-38/-39: runs PRD-02 `canaries/*` fixtures and the PRD-01 `tests/fixtures/consumer-4x/` fixture from the packed tarball; `next16` pages HTTP 200 with 0 console errors in 3 engines; non-symlink install; missing fixture → `provider missing` |
| `certification/lanes/legacy-4x.spec.ts` (release/4.x only) | 4.x driver over `thresholds.json#legacy4x` + visual-class diff |

### 12.3 Detector regression proofs against known 4.1 failures

Run once on `15b6de6f7` `storybook-static/` (remote) and kept as fixtures: the lanes must **fail** on `3-2-app-shell--saa-s-app-shell` (OCR contrast), `glass-modal` (cost gate REQ-QA-22: 12 visible backdrop filters > 6), any of the 12 stories under `contrast-more` (preference-noop), `liquid-glass-showcase` under forced colors (backdrop-filter count 12), and `PageTransitionDemo` (console). `certification/lanes/known-failures.spec.ts` asserts each expected failure is reported with the right gate id. A certification system that passes 4.1.0 is broken.

## 13. Storybook requirements

1. One static build (`npm run build-storybook` → `storybook-static/`) per SHA is the only thing any visual lane renders; the dev server is never used in CI.
2. Globals: `environment` (8 scene ids from `scenes.manifest.json`, default `photo` in docs, required in cert), `certify` (0/1), `scheme`, `transparency`, `contrast`, `tier`, `motion`. Cert URLs are `iframe.html?id=<id>&globals=environment:<scene>;certify:1;…`.
3. Under `certify:1`: no `StorySurface` stage, no `ContrastGuard`/SkipLinks wrapper, no padding, no forced reduced motion; a `data-ag-cert-ready="true"` attribute is set on `<body>` after fonts load (`document.fonts.ready`) and two rAFs, and lanes wait for it instead of fixed sleeps (4.x used 100 ms, `storybook-visual-certification.mjs:12`).
4. Every certified story declares `parameters.ag = { subject, states: [...], refraction?: boolean }`; the story kind is read from the Storybook PRD's `data-ag-story-kind` ∈ {`lab`, `component`, `matrix`, `scene`, `showcase`} (REQ-SB-05) and `.storybook/cert-manifest.json` (REQ-SB-42), not redefined here. Kind selects the frame-fill threshold: `matrix`, `scene` and `showcase` ≥ 25%; `component` and `lab` ≥ 3%.
5. States are stories or `args` presets, not `play` functions; interactive states (hover, focus-visible, pressed, open) are produced by the lane via Playwright actions declared in `parameters.ag.states[].drive`.
6. 0 `!important` in `*.stories.*` (L1). No story-only props on shipped components (STORYBOOK-SHOWCASE-16).
7. Product copy only: OCR text matching `/lorem|ipsum|placeholder|glass ?morphism .* component/i` fails for `scene` and `showcase` kinds.

## 14. Responsive requirements

1. Every visual cell runs at 1440×900 (DPR 1) and 390×844 (DPR 3, `hasTouch`, `isMobile`, pointer coarse) — §15.1.
2. Mobile containment gate (REQ-QA-14) runs with all ancestor `overflow-x` clipping disabled (the 4.x `StorySurface` `overflowX: hidden` masked bleed).
3. Glass density budget is evaluated per viewport class: ≤ 6 live layers at `(hover:hover) and (pointer:fine)`, ≤ 3 at `(pointer:coarse)` (§4.7).
4. Product scenes additionally run at 768×1024 (the 4.x audit's tablet size) for layout gates only (no regression baselines).
5. Touch targets: L5 asserts every interactive element in mobile cells has a hit box ≥ 44×44 CSS px (or ≥ 24×24 with spacing per WCAG 2.2 2.5.8 when the flagship's metadata declares `compact`).

## 15. Accessibility requirements

1. Rendered-pixel contrast (REQ-QA-13) is the GA metric; jsdom contrast checks are banned (REQ-QA-41).
2. axe in real browsers, color-contrast on, three engines; serious/critical = fail; moderate = fail on flagships.
3. Preference emulation in every engine where supported: `forcedColors: 'active'` (Chromium), `contrast: 'more'`, `reducedMotion: 'reduce'`; `reducedTransparency` is forced through `data-ag-transparency` because Safari and Firefox do not fire `prefers-reduced-transparency` (§7.4).
4. Forced colors: 0 backdrop filters in any certified subject (runtime-remote §4 showed 12→12 on the showcase).
5. APG keyboard scripts (PRD-05 harness) are required per flagship; L5 fails if a flagship has none.
6. Manual SR matrix (REQ-QA-70) is a GA blocker; mechanical lanes never mark SR behaviour as passed.
7. Focus visibility: in each interactive state cell with `:focus-visible`, the focus indicator region must have ≥ 3:1 contrast against adjacent pixels on every scene (WCAG 2.4.11/1.4.11), measured from the capture.

## 16. Performance requirements (numeric budgets)

Two kinds: budgets the lanes **enforce on the library**, and budgets on **the certification system itself**.

| Budget | Value | Enforced by |
|---|---|---|
| T1 flagship perf grade | ≥ C (T2 ≥ D) per REQ-PERF-34 grade formula; no ≥ 1-letter regression vs last release on the same host class | L10 (REQ-QA-20) |
| Live blurred surfaces per viewport | ≤ 6 fine pointer, ≤ 3 coarse pointer; blur ≤ 32px; full-viewport blur only on `scrim` ≤ 12px | L6/L10 (REQ-QA-22) |
| Refracting surfaces (enhanced) | ≤ 2, each ≤ ¼ viewport area | L6 cost on chromium enhanced cells |
| Glass density | ≤ 0.3 visible glass area ratio | L6 |
| Reduced-motion idle | 0 rAF callbacks, 0 running animations in 1,000 ms after 500 ms settle | L9 |
| Per-import sizes | rows in `docs/size-budgets.json` (SC-15; source of truth, architecture §3.6 table per errata E-06), tarball ≤ 2 MB, Node cold import per REQ-PERF-09 | L2 (PKG `scripts/ci/verify-size-budgets.mjs`) |
| `certify-pr.yml` wall clock | p90 ≤ 20 min | REQ-QA-37 |
| `certify-main.yml` | ≤ 45 min | REQ-QA-37 |
| `certify-release.yml` | ≤ 90 min (shard count from `shard.ts`) | REQ-QA-37 |
| Per-cell capture | ≤ 2.5 s p95 (runtime-remote ≈0.8 s/capture measured) | lane manifest |
| Per-test timeout | 60 s (vs 4.x 3-hour single test) | `playwright.cert.config.ts` |
| Flake rate | ≤ 0.1% of cells differ between two identical nightly runs; any L7 flake opens an issue and quarantines only that cell for ≤ 7 days; a quarantined cell blocks release (REQ-QA-63) | REQ-QA-63 |
| Committed baselines | ≤ 80 KB each, ≤ 30 MB total | REQ-QA-24 |
| Scenes | ≤ 6 MB total | REQ-QA-10 |
| Release evidence bundle | ≤ 2 GB compressed | REQ-QA-33 |

## 17. Acceptance criteria

- **AC-QA-01** Running the L6/L7/L8 lanes on the `15b6de6f7` `storybook-static/` reports failures for every case in §12.3 (app-shell OCR ≤ 2.2:1, modal 12 visible backdrop filters failing REQ-QA-22, contrast-more no-op on 12/12, showcase forced-colors 12 backdrop filters, `PageTransitionDemo` pageerror). 0 of those cases pass.
- **AC-QA-02** `packages/qa` contains no literal visual-target count; adding one stub component with `parameters.ag.subject` grows the L6 cell count by exactly the formula in §4.4 without any edit to `certification/`.
- **AC-QA-03** Removing `@nonvisual` from a provider export makes `cert:verify` fail with `unclassified-export`.
- **AC-QA-04** All 8 scenes present with licence entries; `scenes-manifest.test.ts` passes; total ≤ 6 MB.
- **AC-QA-05** A synthetic opaque wrapper placed between scene and a `Surface` fails `glass-over-nothing` in all 3 engines.
- **AC-QA-06** On the GA SHA, worst OCR word contrast across all flagship cells is ≥ 4.5:1 (≥ 3:1 large; ≥ 7:1 in contrast-more cells), and the value is emitted in `claims.json` with its artifact source (rendering into README is AC-DX side, PRD-20).
- **AC-QA-07** On the GA SHA, every flagship cell under `solid` and `forced-colors` has 0 computed `backdrop-filter ≠ none` elements; every `contrast-more` cell differs from default by ≥ 0.5% of surface pixels.
- **AC-QA-08** Modifying a flagship's border radius by 2px on a PR fails L7 with a diff image artifact; merging the change requires the `baseline-update` label and a design CODEOWNER approval.
- **AC-QA-09** On `release/4.x`, a 1-pixel-row colour change to `GlassButton` default produces an element-cropped base/head capture pair whose PRD-01 `visual-class.mjs` result is `changed: true` (changed ratio > 0.001 of the crop), so L3 fails unless labelled `visual-bug-fix` with release-owner approval (REQ-REL-13).
- **AC-QA-10** `workflows.test.ts` passes: 0 `continue-on-error`, 0 `|| true`, 0 score jobs, every artifact has `retention-days`, no secrets in `pull_request` jobs, `publish-npm.yml` publish `needs` the `certify` job (`certify-release.yml`) as well as the `glass-pipeline.yml` verify job.
- **AC-QA-11** Deleting any lane manifest from a release evidence set makes `cert:verify` exit non-zero, and the `publish-npm.yml` publish job does not start.
- **AC-QA-12** `git ls-files` on `main` returns 0 paths under `reports/`, `test-results/`, `playwright-report/`, `coverage/`; `no-committed-evidence.test.ts` passes.
- **AC-QA-13** `rg -l "Test Suite Coverage:" src` returns 0 files; `no-vacuous-assertions` reports 0 violations; per-directory coverage floors in REQ-QA-43 met in CI.
- **AC-QA-14** All three engines execute L5–L9 on every flagship; the manifest lists browser versions for chromium, webkit and firefox.
- **AC-QA-15** L11 runs all PRD-02 canaries (`next16`, `next15`, `vite`, `vite-tailwind4`, Base UI floor/latest) and the frozen 4.x fixture green on the GA SHA from the packed tarball; `node_modules/aura-glass` is not a symlink in any canary; `next16` pages return 200 with 0 console errors in all 3 engines.
- **AC-QA-16** A full release run on the offline bundle completes on the gated EC2 runner with worker network egress disabled, or on GitHub-hosted shards, within 90 minutes using the shard count from `shard.ts`; preflight reports the CA status without attempting rotation.
- **AC-QA-17** Two consecutive nightly runs on the same SHA produce identical L7 verdicts on ≥ 99.9% of cells.
- **AC-QA-18** SR matrix: SR-1..SR-4 and the physical-touch pass are recorded as pass for all 44 flagships on the RC SHA (PRD-A11Y issue-#16 rule, no waiver allowance); L14 rubric records exist for all flagship subject-states and all 6 product scenes with every criterion ≥ 3.
- **AC-QA-19** Every certification/count/size number in README and release notes resolves to a `claims.json` entry produced by this PRD on the release SHA (checked by PRD-20 `lint-claims.mjs`, which this lane runs as a consumer).
- **AC-QA-20** `verify-glass-pipeline.js`, the 356 certification script/spec, `visual-regression.yml` and `design-system-compliance.yml` are absent from `main`; the 45 root probes are absent (deleted by PRD-TRUST) and each probe either has a named detector with fixtures in `packages/qa` or is listed as dropped in the REQ-QA-52 PR.
- **AC-QA-21** `certify-pr.yml` p90 ≤ 20 min over the last 20 runs; `certify-release.yml` ≤ 90 min.
- **AC-QA-22** Release checklist (REQ-QA-80) is auto-rendered into the release PR with every mechanical item ticked from the manifest and no manually-ticked mechanical items.

## 18. Definition of done

1. Every REQ-QA requirement implemented and its §12 test green on `main`.
2. All 14 lanes exist, run on the triggers in §4.2 and **fail closed** (§16 exit criterion), demonstrated by AC-QA-01 and AC-QA-11.
3. The 4.x retirement list (§9) is deleted from `main`; the legacy driver runs only on `release/4.x`.
4. Baselines bootstrapped at alpha.1 and human-approved per family.
5. Perf and size budgets calibrated at alpha.1 from this PRD's lane artifacts and frozen by their owners in `docs/size-budgets.json` (PRD-PKG, SC-15) and `tests/perf/harness/budgets.json` (PRD-PERF) (D-26).
6. `certify-release.yml` verify is a required `needs:` of the only `npm publish` path, PRD-REL's `publish-npm.yml` (SC-05).
7. GA run green, evidence bundle attached to the GitHub release, claims rendered, checklist complete.
8. CONTRIBUTING documents the cert scripts, remote iteration (`cert:bundle`), baseline-update process and exemption policy.
9. No heavy lane was executed on a developer Mac in the course of delivering this PRD.

## 19. Dependencies (other PRDs; architecture §16 numbering unless a file name is given)

| PRD | What this PRD needs | Blocking? |
|---|---|---|
| PRD-TRUST (§16 PRD-00, `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md`) | `reports/` removed (TRUST-063); claim retractions; uncommitted CI script diffs resolved; 4.1.1 `publish-npm.yml` instance (TRUST-077/080, name kept per SC-05); `scripts/ci/lib/npm-pack.js` (TRUST-002) and `scripts/ci/lib/evidence-dir.js` (TRUST-006); 45 probes deleted (REQ-TRUST-36, TRUST-064) | yes for REQ-QA-32, -35, -52 |
| PRD-REL (§16 PRD-01, `AURAGLASS_RELEASE_MIGRATION_PRD.md`) | `publish-npm.yml` publish job (REL-025/026), API reports `etc/api/<slug>.api.md`, repo-root `deprecations.json` (REL-010), `visual-class.mjs` classifier (REL-040; consumes REQ-QA-26 captures), `.github/CODEOWNERS` (REL-053), frozen fixture `tests/fixtures/consumer-4x/` (REL-115, §11.4), `release-notes.mjs`, required check names (REQ-REL-17) | yes for REQ-QA-25, -26, -35, -39 |
| PRD-PKG (§16 PRD-02, `AURAGLASS_PACKAGING_BUILD_PRD.md`) | exports manifest `build/exports.manifest.json` (PKG-005, inventory input), artifact checks and `glass-pipeline.yml` (PKG-038), `canaries/*` fixtures (PKG-120/121), lint/jest wiring (PKG-015), workspace decision, `docs/size-budgets.json` + `scripts/ci/verify-size-budgets.mjs` (PKG-048/049) | yes for REQ-QA-02, -28, -38 |
| PRD-03 Token compiler (`AURAGLASS_DESIGN_SYSTEM_PRD.md`) | `tests/tokens/contrast-matrix.test.ts`, `dist/contrast-matrix.json`, `tokens/generated/opacity-floors.json` | L4 and REQ-QA-12 floor check fail until delivered |
| PRD-04 Material engine (`AURAGLASS_MATERIAL_ENGINE_PRD.md`) | `data-ag-*` attributes, optics lint, Material Lab stories | L1/L6 subjects |
| PRD-05 A11y (`AURAGLASS_ACCESSIBILITY_PRD.md`) | `tests/a11y/apg/harness.ts`, `tests/a11y/browser/axe.spec.ts`, `tests/a11y/contrast-matrix.test.ts`, SR record schema and scripts, `AuraGlassScript`, rungs | L5, L13 |
| Storybook PRD (`AURAGLASS_STORYBOOK_SHOWCASE_PRD.md`) | `StoryRoot` `[data-ag-story-content]` (REQ-SB-05), scene stories (REQ-SB-40), `.storybook/cert-manifest.json` (REQ-SB-42), `environment` global | REQ-QA-01, -11; L6 subjects |
| PRD-06 Motion (`AURAGLASS_MOTION_PRD.md`) | motion tokens, declared entrances | L9 |
| Performance PRD (`AURAGLASS_PERFORMANCE_PRD.md`) | `tests/perf/harness/{run-perf.mjs,grade.mjs,budgets.json}`, profiles a–d | L10 |
| PRD-07..PRD-15 component PRDs | subjects, typed state metadata, APG specs | per-subject |
| PRD-18/PRD-20 DX (`AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md`) | `migrate 4to5` for the frozen fixture; `gen-claims.mjs` / `lint-claims.mjs` consume `claims.json` | REQ-QA-39; consumer of REQ-QA-31 |
| PRD-21 Labs | reuses lanes for admission | consumer |

## 20. Execution order

1. **Wave 1, step 1 (with PRD-00/PRD-02 start):** create `packages/qa` (or `certification/qa`), extract the 4.x measurement layer and port the 10 fixtures; `inspect.fixtures.test.ts` green with identical verdicts.
2. Build the offline bundle and remote entrypoint (REQ-QA-61..64); run the extracted 4.x driver remotely on `15b6de6f7` to prove parity with the 2026-08-14 numbers and the runtime-remote findings.
3. Add scenes, the cert decorator, matrix expansion, pixel gates, glass-over-nothing and OCR; land `known-failures.spec.ts` (§12.3) — it must fail on 4.1 exactly as expected (AC-QA-01).
4. Create `certify-pr.yml` with L1, L2, L12 and PR-reduced L6 as required checks; delete `design-system-compliance.yml`, `visual-regression.yml`, `verify-glass-pipeline.js`, the 356 certification and orphans (§9). Ship as part of 4.2 on `main`.
5. Evidence manifest, verifier, retention, `no-committed-evidence` guard, `claims.json` builder; add the `certify` job (`certify-release.yml` reusable call) to the publish job's `needs:` in PRD-REL's `publish-npm.yml` (after REL-025), keeping the existing `glass-pipeline.yml` verify job and its required check names (SC-05, SC-10) (first used for 4.2.0, with 4.x report-only scoping per §11 item 2).
6. Test-quality upgrade: lint rule on, template tests deleted/rewritten family by family alongside PRD-16 removals; coverage floors on.
7. Behaviour, engine, motion, SSR and canary lanes (L5, L8, L9, L11, frozen 4.x fixture) — each initially failing with "provider missing" until the owning PRD delivers.
8. **Alpha.1 (PRD-07 Button + Dialog):** first 5.0 subjects green in every lane; perf lane produces the calibration artifacts for §3.6/§4.7 budgets (frozen by PRD-02 / Performance PRD); baselines bootstrapped and human-approved; this PRD's ratchets frozen.
9. Wave 4: flagship PRDs land subjects; full matrix in `certify-main.yml` and nightly; L13 SR matrix and L14 rubric executed per flagship.
10. RC-1: every lane green on the RC SHA; enhanced tier certified or deferred (D-05); release checklist rendered.
11. GA: release run on the GA SHA, evidence attached, claims rendered, publish.

## 21. Open items

Reconciled on 2026-10-06 against `prd/_shared-contracts.md` (QA fix index: SC-05, SC-08, SC-15, SC-17, SC-29, SC-40; also SC-01 Key field, SC-07, SC-09, SC-10, SC-16, SC-28, SC-39). This section supersedes the QA block of `prd/_verification-remaining-concerns.md`.

**Resolved in this PRD (no further QA action):**

| Concern | Resolution |
|---|---|
| Frozen 4.x fixture dual naming (`canaries/v4-frozen/` vs `tests/fixtures/consumer-4x/`) | SC-08: `tests/fixtures/consumer-4x/` (REL-115) only; QA owns the `consumer-4x-frozen` job (REQ-QA-39). PRD-PKG REQ-PKG-85 must drop `canaries/v4-frozen/` (PKG's SC-08 fix) |
| PRD-REL repurposing `visual-regression.yml` | SC-09: capture is `certify-pr / regression` (QA-072); QA-119 deletes the file on `main`; PRD-REL §6 and REL-042/089/116 retarget (REL's SC-09 fix) |
| `release.yml` naming and the `glass-pipeline.yml` deletion (REQ-QA-35) | SC-05/SC-10: `publish-npm.yml` is kept; `certify` is added as an extra `needs:`; `glass-pipeline.yml` stays PKG-owned and is not deleted |
| Literal ratchet overlap (REQ-QA-27 vs PRD-DS gate) | SC-17: DS owns `scripts/tokens/gates/literals-baseline.json`; `certification/ratchets.json` holds coverage only |
| ≤ 3 SR waivers vs issue-#16 rule (REQ-QA-70) | SC-29: issue-#16 rule (all 44 flagships recorded) governs; waiver allowance removed (REQ-QA-70, AC-QA-18, REQ-QA-80 item 5) |
| Only one contrast-matrix test in L4 | REQ-QA-29 wires both `tests/tokens/contrast-matrix.test.ts` (DS-060) and `tests/a11y/contrast-matrix.test.ts` (A11Y-007) |
| Nightly/RC 8-scene axe run (REQ-A11Y-42 (b)) | Added to REQ-QA-18 (`behaviour-axe-full` job, QA-125) |
| GPU pool for REQ-PERF-36 | Added to REQ-QA-20 (sizing via `shard.ts`, QA-126); cost/quota is OI-QA-05 |
| Budgets file name | SC-15: `docs/size-budgets.json` everywhere; no `build/budgets.lock.json` |
| Lint rule namespace | SC-16: `auraglass/no-vacuous-assertions` in `eslint-plugin-auraglass.js` (no `ag-test` plugin) |
| Invalid `depends_on` entries in `tasks/QA.json` (30) | SC-40: rewritten to owner anchor tasks; PRD/REQ references moved into `acceptance` |

**Still open:**

| Id | Item | Owner | How to close |
|---|---|---|---|
| OI-QA-01 | QA-096 edits PRD-REL's `publish-npm.yml` (adds the `certify` job and `needs:`). | PRD-REL (accepts), QA (delivers) | PRD-REL lists QA-096 as an accepted MODIFY after REL-025 in its task fragment and §6; the `workflows.test.ts` assertion passes on the first 4.2 tag |
| OI-QA-02 | Repository visibility (`PUBLIC`, §3 item 9) was not re-verified in this pass; it decides whether GitHub-hosted runners may run PR code with no cloud credentials. | QA | Before QA-031 merges, run `gh repo view auraoneai/auraglass --json visibility` through the existing authenticated wrapper per the shared-service-access reference; if private, apply the CI-selection reference rules and record the result in the QA-031 PR |
| OI-QA-03 | Capture rate on GitHub-hosted 4-vCPU runners is unmeasured; shard count may exceed 100 (limit 256 jobs per matrix) and the 90-minute release budget may not hold under Option A. | QA | Alpha.1 calibration run (QA-123) records per-host capture rate; `shard.ts` recomputes shards; if > 200 shards, move the full matrix to EC2 Option B and record it |
| OI-QA-04 | L10 profile (a) needs a GPU instance type that the gated launch template (r7i) does not provide; provisioning may hit an IAM deny. | QA (operator grant if denied) | Attempt the gated launch with a g5/g4dn type; on deny, record the exact action, resource and role plus the minimal grant, and fall back to a GitHub GPU larger runner |
| OI-QA-05 | GPU pool cost and quota for the REQ-PERF-36 per-PR ratchet (44 flagships on every `src/**` PR). | QA (with PRD-PERF OI-PERF-04) | QA-126 computes pool size from the alpha.1 run; record monthly cost and quota in `certification/runner/README.md`; if quota is unavailable, restrict the ratchet to `main` pushes and record the deviation in PRD-PERF |
| OI-QA-06 | Engine support for Playwright `forcedColors`/`contrast` emulation at the pinned Playwright version is unconfirmed; cell counts assume Chromium-only forced-colors. | QA | REQ-QA-17 read-back in the first remote run; update `matrix.config.ts` engine sets and the §4.4 cell counts from the result |
| OI-QA-07 | Adding the `certify-pr / *` checks to branch protection on `main` and `release/4.x`, and creating the `@auraoneai/auraglass-design` CODEOWNERS team (REQ-QA-25), are GitHub org settings. | Operator (check names: PRD-REL, REQ-REL-17) | Record the exact settings change in the QA-031/QA-071 PRs; QA-118 waits for it (§20 step 4) |
| OI-QA-08 | The sentinel set (REQ-QA-36) names `Button` default; SC-24 (Button `variant` becomes the material axis) awaits human confirmation. | PRD-CTL (decision), QA (sentinel update) | After SC-24 is confirmed, set the sentinel to the confirmed default Button story id in `certification/matrix.config.ts` |
| OI-QA-09 | `scripts/release/verify-task-graph.mjs` (SC-40 validator) does not exist yet, so the `tasks/QA.json` graph was checked by an ad-hoc script only. | PRD-REL | REL delivers the validator; it must pass on `tasks/QA.json` with 0 rule-1 and rule-5 failures |
