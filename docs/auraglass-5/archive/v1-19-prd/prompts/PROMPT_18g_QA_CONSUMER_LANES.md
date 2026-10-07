# PROMPT-18g (QA): Consumer-provided lanes — L1 static, L2 artifact, L4 token, L5 behaviour/SSR/overlays, L10 perf, L11 canaries

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md` SC-08, SC-15, SC-17, SC-29), sections §4.1 boundary, §4.2 (L1, L2, L4, L5, L10, L11), §5.3 REQ-QA-18..20, §5.5, §5.7 REQ-QA-38/-39, §14 item 5, §15.
Requirements: REQ-QA-18, -19, -20, -27, -28, -29, -38, -39. Acceptance: AC-QA-14 (L5 half), AC-QA-15. Tasks: QA-078..QA-087, QA-125 (nightly/RC 8-scene axe), QA-126 (GPU pool for REQ-PERF-36).

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture. Record deviations with evidence.
- This prompt **wires** lanes. It never authors the provider:
  - optics lint: PRD-MAT (MAT-004, `PROMPT_04_MAT`)
  - token gates, literals gate + baseline and contrast solver: PRD-DS (DS-060, DS-063, DS-072/073, `PROMPT_03_DS`)
  - hydration/`use client` lint rules: PRD-PKG (PKG-082/084/086); `no-transition-all`: PRD-PERF (PERF-025)
  - APG harness, axe spec and contrast recompute: PRD-A11Y (A11Y-073, A11Y-078, A11Y-007, `PROMPT_05_A11Y`)
  - perf harness: PRD-PERF (PERF-039/042, `PROMPT_07_PERF`)
  - artifact checks, size budgets and `canaries/**`: PRD-PKG (PKG-038, PKG-048/049, PKG-120/121, `PROMPT_02_PKG`); npm-pack helper: PRD-TRUST (TRUST-002)
  - `tests/fixtures/consumer-4x/`: PRD-REL (REL-115, `PROMPT_01_REL`; SC-08)
  - `migrate 4to5`: PRD-DX (DX-041, `PROMPT_16_DX`)
- A missing provider makes the lane fail with `provider missing: <path>`. That red state is correct and is reported BLOCKED with the owner. Never write a stand-in.
- Remote only: Playwright (3 engines), `next build`/`next start`, tarball installs and perf all run on GitHub-hosted runners in the cert image. L10 profile (a) needs a GPU host: a GitHub GPU larger runner, or a GPU instance type on the gated EC2 runner via `auraone-remote-run` (read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md`). If neither exists, the lane fails with `provider missing: gpu-host`. Never run on the Mac.
- No fake completion: no `--passWithNoTests`, no moderate-impact axe downgrades for flagships, no `retries`, no grade computed from software raster (profile (c) is regression-only), and no lowered floors.
- Leave the uncommitted PRD-TRUST files alone. Never commit evidence.

## Prerequisites (check each; missing ones become provider-missing failures, not skips)
1. 18c merged: `test -f packages/qa/src/lanes/runLane.ts && test -f certification/lanes.config.ts`.
2. Provider checks (record the result of each command in the report):
   - `rg --files scripts/tokens/gates`
   - `test -f tests/tokens/contrast-matrix.test.ts; test -f tests/a11y/contrast-matrix.test.ts`
   - `test -f tests/a11y/apg/harness.ts; test -f tests/a11y/browser/axe.spec.ts`
   - `test -f tests/perf/harness/run-perf.mjs; test -f tests/perf/harness/grade.mjs`
   - `ls canaries`
   - `test -d tests/fixtures/consumer-4x`
   - `test -f scripts/ci/verify-size-budgets.mjs; test -f scripts/ci/verify-side-effects.mjs; test -f scripts/ci/lib/npm-pack.js`
   - `rg -n "no-random-in-render|use-client" eslint-plugin-auraglass.js`

## May touch
`certification/lanes.config.ts` (L1, L2, L4, L5, L10, L11 entries), NEW `certification/ratchets.json`, NEW `certification/lanes/{behaviour,ssr-hydration,overlay-stacking,perf,canaries}.spec.ts`, NEW tests `packages/qa/test/{static-lane,ratchets,perf-regression}.test.ts`, `.github/workflows/certify-{pr,main,nightly,release}.yml` (the steps of these lanes and job `consumer-4x-frozen`), `scripts/ci/verify-app-chrome-visuals.js` (read only, to port its keyboard/console cases).

## Must not touch
Any provider file listed above; `canaries/**`; `tests/a11y/**`; `tests/perf/**`; `tests/tokens/**`; `scripts/tokens/**`; `docs/size-budgets.json`; `src/**`.

## Steps
1. **QA-078 L1 static.** Providers:
   - PRD-MAT `auraglass/no-optics-outside-material` and `auraglass/no-inline-glass`
   - PRD-DS `scripts/tokens/gates/literals.mjs` (rule `auraglass/no-raw-design-values`) against DS's own `scripts/tokens/gates/literals-baseline.json` (SC-17; QA keeps no literal count)
   - PRD-PERF `auraglass/no-transition-all` (`transition: all` = 0)
   - `!important` = 0 in `src/**` and `*.stories.*`
   - PRD-PKG `auraglass/use-client-required`, `auraglass/use-client-needless` and `auraglass/no-random-in-render`
   - no `Glass*` alias exports from 5.0 subpaths (inventory alias check)
   - undefined-class check
   - PRD-DS `undefined-vars`/`dead-vars` (DS-063; `check-undefined-custom-props.mjs` is removed by DS-079, SC-39)
   - `scripts/audit/runtime-cleanliness-audit.js`
   - `auraglass/no-vacuous-assertions` (18i, SC-16)
2. **QA-079** `ratchets.json` holds coverage ratchets only (`coverage` from 18i; no `literals` key, SC-17). `ratchets.test.ts` compares against the merge-base and fails on any loosening.
3. **QA-080 L2 artifact.** Against the tarball from `scripts/ci/lib/npm-pack.js`, never `dist/`. Run:
   - `publint --strict`, `attw --pack`
   - `verify-side-effects.mjs`, `verify-size-budgets.mjs`
   - dependency allowlist, transitive count, tarball ≤2 MB
   - existing `verify-pack.js` (`verify-tree-shaking.js` and `verify-no-core-ui-deps.js` are removed by PKG-054/PKG-075, SC-39; do not invoke them)
   - byte budgets only from `docs/size-budgets.json` (SC-15); no `size-limit`, `.size-limit.json` or `build/budgets.lock.json`
4. **QA-081 L4 token.** Run both contrast-matrix tests on every PR and every main push (no path filter) and upload `dist/contrast-matrix.json`.
5. **QA-082 L5 behaviour.** `behaviour.spec.ts` in 3 engines:
   - runs every `tests/a11y/apg/*.apg.spec.ts` through the harness
   - runs axe with `color-contrast` enabled for each subject-state in `photo` and `flat-white`, light and dark
   - serious/critical fail; moderate fails for flagships
   - emulates `forcedColors: active`, `contrast: more`, `reducedMotion: reduce` and `data-ag-transparency=solid`
   - checks touch targets in mobile cells: ≥44×44, or ≥24×24 with spacing when metadata says `compact`
   - ports the keyboard + console cases from `verify-app-chrome-visuals.js`
   - a flagship without an APG spec fails with `provider missing`
   - **QA-125** job `behaviour-axe-full` in `certify-nightly.yml` and `certify-release.yml`: the same axe spec on every T0/T1/T2 story in all 8 scenes (`photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`), light and dark, chromium and webkit, same impact gate (REQ-A11Y-42 (b), SC-29)
6. **QA-083** `ssr-hydration.spec.ts`: `renderToString` from the packed tarball, then `hydrateRoot` in each engine. Expect 0 warnings and 0 `<html>` attribute mutations after `AuraGlassScript`. **QA-084** `overlay-stacking.spec.ts`: Dialog → Menu → Tooltip close LIFO on Escape, and z-order (via `elementsFromPoint`) matches the stack.
7. **QA-085 L10.** `perf.spec.ts` runs `run-perf.mjs` profiles a–d and `grade.mjs`, and uploads `perf-results.json` and `perf-grades.json`. It fails when:
   - a T1 grade is below C or a T2 grade is below D
   - a grade drops ≥1 letter vs the previous release asset `perf-grades.json` on the same `perfHost` (fetched with `gh release download`)
   - the harness or host is missing, or there are 0 frames
   **QA-126** GPU pool for PRD-PERF's per-PR ratchet `tests/perf/browser/pr-ratchet.spec.ts` (REQ-PERF-36): pool size `ceil(44 × perFlagshipSeconds / 600)` from the alpha.1 run via `shard.ts`; trusted refs only; record pool size, cost and quota in `certification/runner/README.md`; on an IAM deny record action/resource/role and the minimal grant (PRD §21 OI-QA-04/05)
8. **QA-086 L11.** `canaries.spec.ts` runs each `canaries/<name>` fixture's own assertions from the packed tarball, including the Base UI floor/latest pair. It checks that `fs.lstat(node_modules/aura-glass)` is not a symlink. For `next16`, every page under `next start` returns 200 with 0 console errors in chromium, webkit and firefox.
9. **QA-087** Job `consumer-4x-frozen`:
   - installs `tests/fixtures/consumer-4x/` (PRD-REL REL-115) from the tarball
   - on 4.x: build, render, and default-mode cells unchanged (via the visual-class inputs)
   - on 5.0: install the packed `@auraglass/cli` tarball into the fixture and run its bin (`migrate 4to5`, i.e. the PRD's `npx @auraglass/cli migrate 4to5` via the locally installed bin under `node_modules/.bin/`), then build with 0 `TODO(aura-glass 5)` markers (SC-33) in the flagship subset. If there is no CLI tarball, fail with `provider missing: packages/cli`

## Tests (named)
CI unit: `packages/qa/test/static-lane.test.ts` (provider list), `ratchets.test.ts`, `perf-regression.test.ts`. Remote: `certify-pr / static`, `/ artifact`, `/ token`, `/ behaviour` (`behaviour.spec.ts`, `ssr-hydration.spec.ts`, `overlay-stacking.spec.ts`), `certify-main` L11 (`canaries.spec.ts`, `consumer-4x-frozen`), `certify-nightly` L10 (`perf.spec.ts`).

## Visual evidence
- axe and APG HTML reports and the canary Playwright reports with screenshots, as artifacts for human review.
- `perf-results.json` and `perf-grades.json`, also as artifacts. Nothing is committed.

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-14 (L5) | The behaviour lane manifest lists `browserVersions` for chromium, webkit and firefox with >0 results on every flagship that has a story (others fail with provider missing, BLOCKED on the owner) |
| AC-QA-15 | On main: all PRD-PKG canaries plus Base UI floor/latest plus the frozen 4.x fixture green from the packed tarball; no symlink; `next16` 200 with 0 console errors in 3 engines. If not green, BLOCKED with the failing provider |
| REQ-QA-27..29 | static/artifact/token checks report on every PR and are never path-skipped |
| REQ-QA-20 | Nightly L10 run URL; grades present, or `provider missing: gpu-host` with the operator action recorded |

## Final report
```
PROMPT-18g REPORT
SHA / PRs:
Tasks QA-078..087, QA-125, QA-126: status each
Provider table: lane -> provider path -> present? -> lane result (run URL)
AC-QA-14(L5) / AC-QA-15: status + evidence
Deviations (none expected: SC-15/SC-17/SC-39 names are canonical; list any provider path that differs)
Operator actions (GPU host) / Blockers (PRD + path):
```
