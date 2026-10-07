# PROMPT-08g (FND): Remote certification of the foundation pattern and T2/T0 tier

You are implementing the final part of `PRD-FND` (Component Remediation, key FND, self-id PRD-08; REQ-FND-*) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. It writes two cross-cutting checks, runs every remote lane on the owned components, and assembles the AC-FND evidence table. `PRD-xx` in a dependency means architecture §16 numbering (`PRD-08` flagship controls → Button, `PRD-09` flagship overlays → Dialog, `PRD-19` certification infra, `PRD-02` canaries, PERF = `AURAGLASS_PERFORMANCE_PRD.md`).

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §2.3 (runtime baselines), §5.1 REQ-FND-10, §5.2 REQ-FND-15, §12, §13–§16, §17 (all AC), §18, §20 steps 7 and 13.
- Architecture: §11.1 (T0 full matrix, T2 reduced matrix), §15.1 (environment matrix: tiers × schemes × preference modes × engines × 390/1440), §15.2 (lanes, grade ≥C), D-26 (budgets only ratchet down), D-32.
- Runtime evidence: `docs/auraglass-5/autopsy/runtime-remote.md` (§1 contrast 266/342 failing on black, §4 forced-colors table at `:113-118`, §6 0 errors / 0 overflow at 390 px).
- Upstream: `AURAGLASS_QA_CERTIFICATION_PRD.md` (PRD-19 lanes, scenes, OCR, perf harness, grades), `AURAGLASS_PERFORMANCE_PRD.md` REQ-PERF-01 (budget file), `AURAGLASS_PACKAGING_BUILD_PRD.md` REQ-PKG-80/81 (Next 16 canary).
- Contract registry (binding): `docs/auraglass-5/prd/_shared-contracts.md` SC-15 (byte budgets `docs/size-budgets.json` + `verify-size-budgets.mjs` owned by PKG; runtime budgets `tests/perf/harness/budgets.json` owned by PERF), SC-28 (scene ids), SC-29 (lane names L1..L14, workflows `certify-pr.yml`/`certify-main.yml`/`certify-release.yml`, QA-owned configs), SC-30 (APG paths), SC-39 (`check-undefined-custom-props.mjs` is deleted by DS-079). Prose `PRD-19` = `PRD-QA` + `PRD-SB`; `PRD-08` = `PRD-CTL`; `PRD-09` = `PRD-OVL`.
- Tasks: `docs/auraglass-5/tasks/FND.json` FND-131..FND-140 (FND-141 and FND-143 results are collected into the final table).
- Prerequisite owner prompts: PROMPT_18 QA (QA-018, QA-031, QA-042, QA-049, QA-056, QA-058, QA-082, QA-085), PROMPT_17 SB (SB-048), PROMPT_07 PERF (PERF-039), PROMPT_02 PKG (PKG-048/049, PKG-123), PROMPT_09 CTL (CTL-055), PROMPT_10 OVL (OVL-040), PROMPT_03 DS (DS-077).

Requirements: REQ-FND-10, REQ-FND-15, and lane verification of REQ-FND-25..40, 53, 55. Acceptance: AC-FND-04 (Button/Dialog), 05, 06, 07, 08, 09, 10, 16, 18 (re-verified on RC), and the final AC-FND-01..18 table.

## 2. Scope
May create or modify: NEW `tests/e2e/material/disabled-no-opacity.spec.ts`; NEW `scripts/ci/verify-selector-coverage.mjs` + NEW `tests/ci/verify-selector-coverage.test.mjs` + fixtures; (`scripts/ci/check-undefined-custom-props.mjs` is **not** edited: DS-079 deletes it and DS-077 `scripts/tokens/gates/undefined-vars.mjs` replaces it, SC-39; selector extraction lives inside `verify-selector-coverage.mjs`); no new certification workflow: dispatch QA's `certify-release.yml` / `certify-main.yml` (SC-29) with the FND subject set, and add the two new specs as projects in `certification/playwright.cert.config.ts` by MODIFY after QA-018; `tests/foundation/contract-coverage.json` (append `Button`, `Dialog` if PRD-08/09 did not); and component CSS/TSX in owned directories **only** to fix a defect a lane found (each fix is its own commit with the failing run linked).

Must NOT touch: QA lane definitions (`certification/lanes/**`, `packages/qa/**`), scenes, OCR or perf harness code; thresholds anywhere; `docs/size-budgets.json` numbers (PKG-owned file; they only go down, D-26); flagship sources (Button, Dialog), except to report defects; snapshots (`-u` is banned).

## 3. Prerequisites (stop with a blocker report if a hard one fails)
- 08c and 08d merged: `node -e "const c=require('./tests/foundation/contract-coverage.json');if(c.expected.length<42)throw c.expected.length"` (36 owned + 6 primitives).
- QA lanes exist and fail closed (hard): L5 Behaviour (`certification/lanes/behaviour.spec.ts`, QA-082), L6 Environment visual with the matrix (QA-042/QA-056), preference modes (QA-058) and OCR (QA-049) over the 8 SC-28 scenes, L10 Performance (`certification/lanes/perf.spec.ts`, QA-085, driving PERF-039 `run-perf.mjs`), in `certify-pr.yml`/`certify-main.yml`/`certify-release.yml` (QA-031). List the exact workflow and lane files used.
- CTL-055 `Button` and OVL-040 `Dialog` built on the §4.2 pattern (hard for AC-FND-05): `test -f src/components/button/Button.meta.ts && test -f src/components/dialog/Dialog.meta.ts` (directory names per those PRDs; resolve with `rg --files -g '*.meta.ts' src/components | rg -i 'button|dialog'`).
- PKG-122/123 `canaries/next16` builds in CI (L11 Consumer canaries) (hard for AC-FND-16).
- PKG-048 `docs/size-budgets.json` with FND rows (FND-067/098) and PKG-049 `scripts/ci/verify-size-budgets.mjs` (hard for AC-FND-10).

## 4. Steps
1. **FND-131 `tests/e2e/material/disabled-no-opacity.spec.ts` (REQ-FND-10).** For every owned component's `States` story (enumerate from Storybook's `index.json` by title prefix `Core/` and `Foundation/`, plus Button and Dialog), in Chromium and WebKit: for each element matching `[data-ag-surface][data-disabled]`, `getComputedStyle(el).opacity === '1'`, and each disabled interactive part has `data-disabled`. It fails if a `States` story renders zero disabled elements for a component whose meta lists `disabled` in `states`. Runs remotely only.
2. **FND-132 `scripts/ci/verify-selector-coverage.mjs` (REQ-FND-15).** Input: each owned `<Name>.css` (selectors parsed with `postcss-selector-parser` if allowlisted, otherwise a documented owned parser with its own fixtures) and the built Storybook (`storybook-static/`). In a remote Playwright job, for every component, load each story iframe and evaluate `document.querySelector(selector)` for every selector of that component's CSS, with pseudo-classes/elements stripped (`:hover`, `:focus-visible`, `::before`, …) and `@media`/`@container`/`@supports` wrappers ignored. A selector matching nothing across all of that component's stories fails, printed as `file:line selector`. A selector targeting a class the component does not render (from `check-undefined-custom-props.mjs --emit-selectors`) fails. Fixture tests cover a matched selector, an orphan selector and a pseudo-stripped selector.
3. **FND-133 Reduced matrix (AC-FND-06, T2).** Run L6 Environment visual's reduced matrix (QA-042 prune rules) for the 30 owned T2 components: standard + lightweight tier × light/dark × default/reduced-transparency/forced-colors × Chromium + WebKit × 390/1440, including the 320 px container check (0 horizontal overflow, 0 clipped text; §14) and the 0 console/page error baseline. Fix owned-component defects in separate commits and re-run. Never change the matrix.
4. **FND-134 T0 full matrix (AC-FND-06, T0).** Run unit + SSR (`tests/ssr/t2-server-safe.test.tsx`) + the full §15.1 environment matrix for Text, Heading, Stack, Grid, Container and Icon.
5. **FND-135 L5 Behaviour (AC-FND-07).** Run all 11 specs (`tests/a11y/apg/{accordion,rating,file-upload,color-picker,inline-edit,tour,collapsible,scroll-area,chip,steps,stacked-escape}.apg.spec.ts`, SC-30) through `certification/lanes/behaviour.spec.ts` in Chromium, WebKit and Gecko, with `@axe-core/playwright` colour contrast on. The result must be 11/11 in each engine, with 0 serious/critical violations.
6. **FND-136 L6 preference-mode cells (AC-FND-08, §15; QA-058).** forcedColors active → 0 visible backdrop-filters on every T2 story and text uses `CanvasText`. Compare against the `runtime-remote.md` §4 baseline (glass-modal 12→10, showcase 12→12, material 1→1; target 0). contrast more → text pairs ≥7:1. reducedTransparency → tinted floor present. reducedMotion → 0 rAF/WAAPI after settle, with the final state visible. Also check §16 "no continuous work at rest": 0 rAF callbacks and 0 running animations 1 s after settle with `allowContinuous=false`, and ≤1 visible backdrop-filter on a 20-component T2 page (only an open popup).
7. **FND-137 OCR contrast (AC-FND-09).** Run the L6 OCR gate (REQ-QA-13, QA-049) over all T2 stories × the 8 SC-28 scenes; report the worst case per story. Thresholds: ≥4.5:1 body, ≥3:1 large text and non-text. Baseline: 266/342 runs failed on black in 4.x.
8. **FND-138 L2 Artifact + L10 Performance (AC-FND-10, REQ-FND-53).** On the candidate SHA: `scripts/ci/verify-size-budgets.mjs` (every FND row, peers external), the T2 CSS total ≤12 KB gz within the 32 KB `styles.css` ceiling, `aura-glass/primitives` ≤4 KB, perf grade ≥C for each T2 component, INP ≤100 ms p75 for Accordion toggle, Rating change, Chip toggle and ColorPicker drag (4× CPU, mid-tier mobile), and ColorPicker drag frame time ≤16.7 ms p95 (120 Hz desktop). Over-budget items are fixed in code, never by raising a number. If calibration at alpha.1 changes a provisional number, that is PERF's PR, not this one.
9. **FND-139 Pattern proof (AC-FND-05, AC-FND-04 Button/Dialog).** Run every §15.2 lane (L1..L12) on CTL-055 `Button` and OVL-040 `Dialog`, and the three contract harnesses with `Button`/`Dialog` in `contract-coverage.json`. Collect written sign-off from the flagship PRD owners (PRD-08..PRD-13) that §4.2–§4.4 is usable without local variation, as PR or issue comments with links. Any variation they request is recorded as an amendment proposal to PRD-08 (FND); do not edit the PRD.
10. **FND-140 RC evidence.** (a) Next 16 canary `canaries/next16/tests/rsc.spec.ts` builds and serves every `meta.rsc="server"` export with 0 hydration warnings (AC-FND-16). (b) Re-verify AC-FND-01, -02, -03, -11, -13, -18 on the RC SHA from CI. (c) Manual screen-reader passes (§15 manual): Accordion, Tour, FileUpload and ColorPicker get one VoiceOver/Safari and one NVDA/Chrome pass, done by a human tester on remote or physical devices. Record them as PR comments with tester, date, and pass/fail per step. The agent prepares the scripts and does not claim results it did not observe. (d) Assemble the AC table (§6).

## 5. Visual evidence
Remote capture artifacts from steps 3, 4, 6 and 7: every owned story × 390/1440 × light/dark × default/reduced-transparency/forced-colors × Chromium/WebKit, over the `dense-text`, `photo` and `video-frame` scenes (SC-28), plus the `Migration/<family>` before/after stories. Upload them as CI artifacts with retention per PRD-19 (D-32); nothing is committed. A human reviewer signs off in the certification issue. The agent links the artifacts and the reviewer's comment, and does not assess the images itself.

## 6. Integrity rules (binding)
No lowered thresholds, budgets, matrix cells or engines. No `.skip`/`.only`/`.todo`/`test.fixme`/`xit`/`expect(true)`, no retries added to hide flakes (PRD-19's retry policy is fixed), no `-u`, no axe rule disabling, and no OCR scene exclusion. A lane counts as green only with a CI run URL keyed to the SHA. No local Playwright, local browser, local Storybook build or local Docker. Use GitHub Actions per `ci-selection.md` or `auraone-remote-run`. Manual a11y results come only from a human tester.

## 7. Exit criteria
AC-FND-04 (incl. Button/Dialog), -05, -06, -07, -08, -09, -10 and -16 are green on the RC SHA with run URLs; REQ-FND-10 and -15 checks are green; the AC-FND-01..18 table is complete, and each row is either green with evidence or explicitly blocked with its owner.

## 8. Final report format
```
PROMPT-08g REPORT
RC SHA:
Tasks: FND-131..140 -> done|blocked (reason) each
AC table:
| AC | Result | Evidence (CI run URL / artifact) | Notes |
| AC-FND-01 .. AC-FND-18 | pass/fail/blocked | ... | ... |
Lanes: L6 reduced matrix cells pass/total; L6 T0 full matrix pass/total; L5 APG 11/11 per engine; L6 forced-colors backdrop-filters=N; L6 OCR worst ratio per story (min); L10 perf grades (min); L2 budgets over=N
Defects fixed (commit -> failing run URL): ...
Manual SR passes: component -> VO/Safari, NVDA/Chrome (tester, date, link) | pending
Flagship sign-offs: CTL, OVL, NAV, DATA, AI, MED -> link | pending
Open items (PRD §21 O-01..O-16): id -> closed | open (owner, evidence)
Visual review: artifact URLs; reviewer sign-off link | pending
Deviations: ...
```
