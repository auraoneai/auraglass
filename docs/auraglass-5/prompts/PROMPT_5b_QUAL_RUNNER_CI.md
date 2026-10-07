# PROMPT-5b (QUAL lane Q2): Lane runner and GitLab CI

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q2**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5b-Q2"` (87 tasks: QUAL-005..091).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside QUAL):** `certification/run.mjs`, `lanes.config.ts`, `matrix.config.ts`, `certification/runner/**`, `ci/qual.gitlab-ci.yml`, `ci/qual/**`, `packages/qa/src/{resolve,inventory,matrix}/**`

**Order inside the lane:** runner + states + fail-closed (-05, -06) → resolver, inventory (-01, -02) → CI fragment jobs (-64) → shards and child pipeline (-65) → AWS fallback (-67) → `allow_failure` flips

**Requirements closed by this lane:** REQ-QUAL-01, REQ-QUAL-02, REQ-QUAL-03, REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-06, REQ-QUAL-07, REQ-QUAL-10, REQ-QUAL-11, REQ-QUAL-12, REQ-QUAL-13, REQ-QUAL-14, REQ-QUAL-15, REQ-QUAL-17, REQ-QUAL-19, REQ-QUAL-20, REQ-QUAL-24, REQ-QUAL-25, REQ-QUAL-26, REQ-QUAL-27, REQ-QUAL-28, REQ-QUAL-29, REQ-QUAL-30, REQ-QUAL-31, REQ-QUAL-32, REQ-QUAL-34, REQ-QUAL-37, REQ-QUAL-38, REQ-QUAL-39, REQ-QUAL-40, REQ-QUAL-47, REQ-QUAL-56, REQ-QUAL-57, REQ-QUAL-60, REQ-QUAL-61, REQ-QUAL-62, REQ-QUAL-63, REQ-QUAL-64, REQ-QUAL-66, REQ-QUAL-67, REQ-QUAL-68, REQ-QUAL-73.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q2 -b next-qual/q2-<topic> origin/next
# release/4.x work in this lane (QUAL-079): fragments and frozen 4.x cases only
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q2-4x -b 4x-qual/<topic> origin/release/4.x
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5b-Q2") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-005 | REMOVE | `scripts/audit/static-glass-material-audit.js` | Delete the dynamic-*-unproven rule (:1385-1404) with its registration/messages; leave the rest of the script until it is retired after REQ-MAT-65 lands. |  |  |
| QUAL-006 | INFRA | `NEW:packages/qa/package.json` | [§8] Create private workspace package "@auraglass/qa" ("private": true, no "files", no publishConfig) with tsconfig packages/qa/tsconfig.json (extends root … |  | REQ-QUAL-01 |
| QUAL-007 | INFRA | `jest.config.js` | [§12.1] Add <rootDir>/certification/lanes/, <rootDir>/certification/runner/ and <rootDir>/canaries/ to testPathIgnorePatterns; add <rootDir>/packages/qa/test to … | QUAL-006 |  |
| QUAL-008 | TEST | `NEW:packages/qa/test/inspect.fixtures.test.ts` | [§4.3, §12.1] Port the 10 detector self-test fixtures (token-purity-layout-audit.spec.ts:3930-4128) to packages/qa/fixtures/inspect/<name>.html plus the collector JSON … |  | REQ-QUAL-32, REQ-QUAL-20 |
| QUAL-009 | CREATE | `NEW:packages/qa/src/resolve/resolveSubject.ts` | REQ-QA-01: map subject id -> story id only via explicit story parameters.ag.subject, cross-checked against .storybook/cert-manifest.json (REQ-SB-42 … | QUAL-006 | REQ-QUAL-01 |
| QUAL-010 | TEST | `NEW:packages/qa/test/resolve.test.ts` | [REQ-QA-01] Fixtures under packages/qa/fixtures/resolve/: story without parameters.ag.subject -> error subject-without-story; manifest id absent from index.json -> … | QUAL-009 | REQ-QUAL-01 |
| QUAL-011 | CREATE | `NEW:packages/qa/src/inventory/buildInventory.ts` | [REQ-QA-02, REQ-QA-04] REQ-QA-02: read build/exports.manifest.json (PRD-02 REQ-PKG-10) and the TS export graph of each subpath; classify each value export … | QUAL-006 | REQ-QUAL-02, REQ-QUAL-04 |
| QUAL-012 | TEST | `NEW:packages/qa/test/inventory.test.ts` | [REQ-QA-02] Fixture manifests under packages/qa/fixtures/inventory/: unclassified export -> unclassified-export; @nonvisual provider excluded; alias counted once; … | QUAL-011 | REQ-QUAL-02 |
| QUAL-013 | REPLACE | `scripts/audit/public-export-audit.js` | [REQ-QA-02] Delete the PascalCase coveredBy heuristic (:318-324) and make the script a thin wrapper that prints buildInventory output (kept for 4.x callers); its own … | QUAL-011 | REQ-QUAL-02 |
| QUAL-014 | TEST | `NEW:packages/qa/test/dhash-duplicates.test.ts` | [REQ-QA-03] Two byte-identical PNG fixtures -> duplicate-visual; a pair differing in >0.1% of pixels -> not flagged; subject duplicated in 9/10 cells -> fail; same … |  | REQ-QUAL-03 |
| QUAL-015 | INFRA | `NEW:certification/runner/image/Dockerfile; NEW:ci/qual/image.gitlab-ci.yml` | [REQ-QA-63, §4.7] Cert container FROM mcr.microsoft.com/playwright:v1.63.0-noble@sha256:<digest> (equal to the @playwright/test pin) with tesseract-ocr 5.x + eng, … |  | REQ-QUAL-66, REQ-QUAL-11 |
| QUAL-016 | CREATE | `NEW:certification/playwright.cert.config.ts` | [§8, REQ-QA-63] One config: projects chromium\|webkit\|firefox; testDir certification/lanes; timeout 60_000; retries 0; fullyParallel; workers from AG_CERT_WORKERS; … | QUAL-006, QUAL-017 | REQ-QUAL-66, REQ-QUAL-11 |
| QUAL-017 | CREATE | `NEW:packages/qa/src/remote/guard.ts` | REQ-QA-60: any code path that launches a browser exits 2 and prints the remote command (push the branch and read its GitLab pipeline, `glab ci run --branch <b> … | QUAL-006 | REQ-QUAL-67, REQ-QUAL-34 |
| QUAL-018 | CREATE | `NEW:packages/qa/src/determinism/initScript.ts` | REQ-QA-63: page.addInitScript stubbing Date.now (fixed 2026-01-01T00:00:00Z epoch + monotonic counter) and Math.random (seeded mulberry32, seed from cell id); … | QUAL-006 | REQ-QUAL-66, REQ-QUAL-11 |
| QUAL-019 | CREATE | `NEW:certification/runner/build-bundle.mjs` | REQ-QA-61: produce cert-bundle-<sha>.tar.zst containing storybook-static/, aura-glass-<ver>.tgz (via scripts/ci/lib/npm-pack.js), certification/ (scenes, configs, … | QUAL-017, QUAL-015 | REQ-QUAL-67 |
| QUAL-020 | CREATE | `NEW:certification/runner/worker-entry.sh` | REQ-QA-61: EC2 user-data entrypoint. `trap "shutdown -h now" EXIT`; background `sleep 7200 && shutdown -h now`; download bundle from the S3 runner prefix … | QUAL-019, QUAL-021 | REQ-QUAL-67 |
| QUAL-021 | CREATE | `NEW:certification/runner/preflight.mjs` | REQ-QA-62: check bundle hash and presence of all three browser builds (exit 1 on mismatch); only when AG_CERT_EGRESS=1, read the proxy CA notAfter (openssl x509 … |  | REQ-QUAL-67 |
| QUAL-022 | TEST | `NEW:certification/runner/preflight.test.mjs` | node --test cases from REQ-QA-62 using PEM fixtures generated in the test with node:crypto (no committed keys): notAfter Sep 27 17:34:57 2026 GMT -> 78; +30 days -> 0; … | QUAL-021 | REQ-QUAL-67 |
| QUAL-023 | CREATE | `NEW:certification/lanes/legacy-4x.spec.ts` | [§4.3, §11 item 2] §4.3 driver: one Playwright test per (legacy subject x {1440x900, 768x1024, 390x844}) from certification/legacy4x-subjects.json, 60 s timeout, judged … | QUAL-009, QUAL-016 | REQ-QUAL-12 |
| QUAL-024 | TEST | `NEW:certification/runner/README.md` | §20 step 2: build the offline bundle for 15b6de6f7 in CI, run legacy-4x lane on (a) GitLab SaaS runners shards and (b) the gated EC2 runner (launch template … | QUAL-023, QUAL-020, QUAL-019 | REQ-QUAL-05 |
| QUAL-025 | CREATE | `NEW:certification/runner/list-stale.mjs` | REQ-QA-64: list EC2 instances tagged ag-cert=1 whose launch time + ttl tag < now and print attempt-id/sha/lane; exit 1 if any; never terminates and never touches … | QUAL-020 | REQ-QUAL-67 |
| QUAL-026 | CREATE | `NEW:packages/qa/src/lanes/runLane.ts; certification/lanes.config.ts` | [REQ-QA-36] Generic lane runner certification/run.mjs (LANE_COMMAND, S-43: `node certification/run.mjs --lane <id> --scope $AG_SCOPE`) used by every qual:certify:l<n> … | QUAL-017 | REQ-QUAL-06 |
| QUAL-027 | CREATE | `NEW:packages/qa/src/matrix/affected.ts` | REQ-QA-36: compute affected subjects from the PR diff via the TS import graph of src/** -> stories (parameters.ag.subject); always add the sentinel set: Surface … | QUAL-009 | REQ-QUAL-06 |
| QUAL-028 | INFRA | `ci/qual.gitlab-ci.yml` | [REQ-QA-34, REQ-QA-36] Fill ci/qual.gitlab-ci.yml from its C0 seed: .qual-lane template (extends .ag-playwright, needs qual:build:storybook optional, rules $AG_LINE == … | QUAL-026, QUAL-027, QUAL-015, QUAL-016 | REQ-QUAL-64, REQ-QUAL-06 |
| QUAL-029 | INFRA | `NEW:ci/qual.gitlab-ci.yml` | [REQ-QA-34] Main scope ($AG_SCOPE == "main" on next and release/4.x): every PR lane on all subjects plus full L6 (shards from packages/qa/src/matrix/shard.ts via … | QUAL-028 | REQ-QUAL-64 |
| QUAL-030 | INFRA | `NEW:ci/qual.gitlab-ci.yml` | [REQ-QA-34, REQ-QA-63] qual:certify:nightly ($AG_SCOPE == "nightly", GitLab pipeline schedule on next and release/4.x, OD-11): full L6 in chromium/webkit/firefox; L10 … | QUAL-028 | REQ-QUAL-64, REQ-QUAL-66, REQ-QUAL-11 |
| QUAL-031 | INFRA | `NEW:ci/qual.gitlab-ci.yml` | [REQ-QA-34] qual:certify:release ($AG_SCOPE == "release", tag pipeline on $CI_COMMIT_TAG): every lane L1-L12 on the tag SHA (full set) via needs, then verify … | QUAL-028 | REQ-QUAL-64, REQ-QUAL-61, REQ-QUAL-62 |
| QUAL-032 | TEST | `NEW:packages/qa/test/ci-fragment.test.ts` | [REQ-QA-36] Parse ci/qual.gitlab-ci.yml (and ci/qual/**) with yaml: 0 allow_failure on jobs already flipped, 0 "\|\| true", 0 jobs computing a "score"; every artifacts … | QUAL-028, QUAL-029, QUAL-030, QUAL-031 | REQ-QUAL-06 |
| QUAL-033 | CREATE | `n/a` | REQ-QA-10: exactly 8 still assets >=2880x1800 plus a 2 s looping video-frame.webm (motion lane only); total <=6 MB. flat-white, flat-black, hf-pattern generated by NEW … |  | REQ-QUAL-07 |
| QUAL-034 | TEST | `NEW:packages/qa/test/scenes-manifest.test.ts` | [REQ-QA-10] Asserts the 8 ids exactly (set equality), sha256 of each file equals the manifest, licence non-empty and photo/dark-media licence in {CC0-1.0, owned}, … |  | REQ-QUAL-07 |
| QUAL-035 | CREATE | `n/a` | §4.4: axes verbatim (engine x 8 environments x scheme x transparency x preference x tier x viewport); prune rules: forced-colors => lightweight+solid and only engines … | QUAL-011, QUAL-009 | REQ-QUAL-01 |
| QUAL-036 | TEST | `NEW:packages/qa/test/matrix-prune.test.ts` | Asserts every prune rule; T0=180, flagship=148 (+32 refraction-eligible), T2=29, PR reduced=24 equal the §4.4 formulas computed independently in the test; shard.ts … | QUAL-035 | REQ-QUAL-12, REQ-QUAL-01 |
| QUAL-037 | TEST | `NEW:packages/qa/test/pixel-gates.test.ts` | [REQ-QA-14] Synthetic PNGs generated in-test with pngjs: 39-level deviation fails / 40 passes; 24.9% separation fails / 25% passes; 1.01% neon fails; 4 hue families … |  | REQ-QUAL-15 |
| QUAL-038 | TEST | `NEW:packages/qa/test/material-presence.test.ts` | [REQ-QA-12] Opaque ancestor over photo -> glass-over-nothing; white 255 / black 22 interiors with fixture opacity-floors.json floorAlpha 0.30 -> fail (delta 233 > … |  | REQ-QUAL-14 |
| QUAL-039 | TEST | `NEW:packages/qa/test/ocr-contrast.test.ts` | [REQ-QA-13] Rendered PNG fixtures (generated remotely once in Chromium from packages/qa/fixtures/ocr/*.html and committed <=40 KB each): rgba(0,0,0,.9) text on … |  | REQ-QUAL-13 |
| QUAL-040 | CREATE | `NEW:packages/qa/src/matrix/readback.ts` | REQ-QA-17: in-page collector returning documentElement.dataset (agTier, agEngine, agTransparency, agContrast, agMotion, agScheme), matchMedia results for … | QUAL-035 | REQ-QUAL-17 |
| QUAL-041 | CREATE | `n/a` | REQ-QA-16: collector for pageerror, console.error, console.warn; any pageerror/error fails; warn fails unless matched by an allowlist entry {regex, owner, expires} with … | QUAL-006 | REQ-QUAL-17 |
| QUAL-042 | CREATE | `n/a` | REQ-QA-73: entries {subject, gate, cells, rationale, approvedBy, expires<=180 days}; gates ocr-contrast and console are never exemptable (loader throws); expired entry … | QUAL-006 | REQ-QUAL-68 |
| QUAL-043 | CREATE | `NEW:certification/lanes/cost.spec.ts` | REQ-QA-22 and §16: per cell record visible backdrop-filter count, nesting depth, max blur px, full-viewport blur elements (must be data-ag-surface="scrim" and <=12px), … |  | REQ-QUAL-38 |
| QUAL-044 | TEST | `certification/runner/README.md` | [§12.3] Run known-failures.spec.ts remotely (GitLab SaaS runners shards from the offline bundle; EC2 optional) and link the run + lane manifest artifact in the PR; … |  | REQ-QUAL-32 |
| QUAL-045 | CREATE | `NEW:packages/qa/src/capture/elementCrop.ts` | [REQ-QA-24, REQ-QA-26] Element-cropped capture helper: locator.screenshot({animations:"disabled", caret:"hide"}) of the subject root; returns PNG + box; used by L7 and … | QUAL-016, QUAL-018 | REQ-QUAL-24, REQ-QUAL-26 |
| QUAL-046 | TEST | `NEW:packages/qa/test/baselines-budget.test.ts` | [REQ-QA-24] Each file under certification/baselines/ <=80 KB; tree <=30 MB; no "darwin" in any path; path matches … | QUAL-015 | REQ-QUAL-24 |
| QUAL-047 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-25: manual job qual:certify:baseline-update (when: manual, input variable PR_BRANCH): runs regression.spec.ts with --update-snapshots in the pinned image on that … | QUAL-028 | REQ-QUAL-25 |
| QUAL-048 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-25 baseline guard inside qual:certify:l7: if the PR diff (git diff origin/$BASE...HEAD) touches certification/baselines/**, the commit message or PR branch must … | QUAL-047, QUAL-028 | REQ-QUAL-25 |
| QUAL-049 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-26: qual:certify:l7 captures element-cropped default-preference cells at 1440x900 and 390x844 for merge-base and head and itself writes … | QUAL-045, QUAL-028 | REQ-QUAL-26 |
| QUAL-050 | TEST | `certification/runner/README.md` | [REQ-QA-26] AC-QA-09 proof on a throwaway branch (never merged): change one pixel row colour of the Button default; L7 visual-class.json shows changed:true (ratio > … | QUAL-049 | REQ-QUAL-26 |
| QUAL-051 | TEST | `certification/runner/README.md` | [REQ-QA-24, REQ-QA-25] AC-QA-08 proof on a throwaway branch: change the Button border radius by 2px (seed sentinel until CMP's Button is real); qual:certify:l7 fails … | QUAL-048 | REQ-QUAL-24, REQ-QUAL-25 |
| QUAL-052 | MODIFY | `playwright.config.ts` | [REQ-QA-24] Remove the toHaveScreenshot defaults (:123-128, threshold 0.3 / maxDiffPixels 1000); the file is deleted in 18g when legacy specs are retired. |  | REQ-QUAL-24 |
| QUAL-053 | MODIFY | `certification/lanes.config.ts` | REQ-QA-27 L1 provider list (consumer only; QA authors none of these gates, SC-16/SC-17/SC-39): MAT auraglass/no-optics-outside-material + auraglass/no-inline-glass … | QUAL-026 | REQ-QUAL-27 |
| QUAL-054 | MODIFY | `certification/lanes.config.ts` | REQ-QA-28 L2 providers run against the tarball from scripts/ci/lib/npm-pack.js (TRUST-002, SC-06; never dist/ in place): publint --strict, attw --pack, … | QUAL-026 | REQ-QUAL-28 |
| QUAL-055 | MODIFY | `certification/lanes.config.ts` | REQ-QA-29: run tests/tokens/contrast-matrix.test.ts (PRD-03 REQ-DS-37) and tests/a11y/contrast-matrix.test.ts (PRD-05 REQ-A11Y-18) on every PR and main push (no path … | QUAL-026 | REQ-QUAL-28 |
| QUAL-056 | CREATE | `NEW:certification/lanes/perf.spec.ts` | REQ-QA-20: invoke tests/perf/harness/run-perf.mjs for profiles a-d and grade.mjs; publish perf-results.json, perf-grades.json and .artifacts/qual/perf-report.json … | QUAL-030 | REQ-QUAL-34, REQ-QUAL-37, REQ-QUAL-40 |
| QUAL-057 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-39: L11 step consumer-4x-frozen installs the PLAT harness tests/fixtures/consumer-4x/ with every stream's cases/<stream>/ from the packed tarball … | QUAL-029 | REQ-QUAL-29 |
| QUAL-058 | TEST | `NEW:packages/qa/test/evidence-verify.test.ts` | [REQ-QA-30] Synthetic evidence sets under packages/qa/fixtures/evidence/: missing lane manifest, empty results, SHA mismatch, stale inventory hash, missing review … |  | REQ-QUAL-61 |
| QUAL-059 | CREATE | `NEW:packages/qa/src/claims/build.ts` | REQ-QA-31: from a verified evidence manifest only, write claims.json {<id>: {value, unit, source: {artifact, sha, path}}} with ids: visual-components-distinct, … |  | REQ-QUAL-62 |
| QUAL-060 | TEST | `NEW:packages/qa/test/claims.test.ts` | [REQ-QA-31] Non-pass lane -> exit non-zero and claims.json absent; every claim has source.artifact, source.sha == manifest sha, source.path present in the evidence set; … | QUAL-059 | REQ-QUAL-62 |
| QUAL-061 | TEST | `NEW:packages/qa/test/no-committed-evidence.test.ts` | REQ-QA-32: `git ls-files` must contain 0 paths matching reports/**, certification/out/**, test-results/**, playwright-report/**, **/*-snapshots/**, coverage/**, and 0 … | QUAL-006 | REQ-QUAL-60 |
| QUAL-062 | TEST | `certification/runner/README.md` | [REQ-QA-30, REQ-QA-35] AC-QA-11 proof: run qual:certify:release in dry-run mode (manual pipeline on a throwaway tag-like branch with AG_CERT_DRY_RUN=1 and DROP_LANE=L7, … |  | REQ-QUAL-61, REQ-QUAL-63 |
| QUAL-063 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-72: manual job qual:certify:record-review (when: manual, variables REVIEWER, SUBJECT, SCORES_JSON) validates against review-record.schema.json (or … | QUAL-031 | REQ-QUAL-73 |
| QUAL-064 | MODIFY | `certification/lanes.config.ts` | [REQ-QA-31] AC-QA-19: qual:certify:release runs PLAT's docs claims lint (registered by PLAT as a node-script lane through fragments/lanes/plat.ts) against claims.json; … | QUAL-059, QUAL-031 | REQ-QUAL-62 |
| QUAL-065 | DOC | `apps/docs/content/qual/contributing.md` | [§18 item 8] DoD item 8: section "Certification" documenting cert:* scripts, remote iteration via cert:bundle + a manual GitLab job (when: manual) (no local browser … | QUAL-048 |  |
| QUAL-066 | CREATE | `NEW:packages/qa/eslint/no-vacuous-assertions.js` | REQ-QA-41 ESLint rule auraglass/no-vacuous-assertions (SC-16 namespace; rule module here, registered in eslint-plugin-auraglass.js by QA-108) reporting: … | QUAL-006 | REQ-QUAL-31 |
| QUAL-067 | TEST | `NEW:packages/qa/test/no-vacuous-assertions.test.ts` | [REQ-QA-41] ESLint RuleTester: one invalid case per banned pattern (6), valid cases: getByRole assertion, if/else with expect in both, length-asserted loop, inline … | QUAL-066 | REQ-QUAL-31 |
| QUAL-068 | CREATE | `NEW:packages/qa/src/unit/flagshipContract.ts` | REQ-QA-42 checker run in L12: for each of the 44 §11.2 flagships, src/<entry>/<Component>/<Component>.test.tsx exists and contains describe blocks named exactly … | QUAL-011 | REQ-QUAL-19, REQ-QUAL-30 |
| QUAL-069 | MODIFY | `jest.config.js` | REQ-QA-43: replace coverageThreshold (:79-90) with path keys: "./src/material/" 90 lines/85 branches; each flagship directory 85/75; "./src/theme/" and "./src/utils/" … | QUAL-070 | REQ-QUAL-30 |
| QUAL-070 | MODIFY | `n/a` | REQ-QA-44: create __mocks__/fileMock.js (`module.exports = "test-file-stub";`) for the :38 mapping; testEnvironment, testEnvironmentOptions and setupFilesAfterEnv … |  | REQ-QUAL-17 |
| QUAL-071 | MODIFY | `certification/lanes.config.ts` | [REQ-QA-43] L12 unit lane: `jest --ci --coverage` (in the cert image so OCR tests have tesseract), auraglass/no-vacuous-assertions lint, flagshipContract; junit via … | QUAL-026, QUAL-069 | REQ-QUAL-30 |
| QUAL-072 | CREATE | `NEW:certification/probe-disposition.json` | REQ-QA-52: for each of the 45 root .mjs probes deleted by PRD-00 REQ-TRUST-36 (list via `git show 15b6de6f7 --name-only` / `git ls-tree 15b6de6f7 --name-only \| rg … |  | REQ-QUAL-32 |
| QUAL-073 | INFRA | `ci/qual.gitlab-ci.yml` | REQ-QA-18 / REQ-A11Y-42 (b): L5 step behaviour-axe-full (nightly and release scopes) runs tests/a11y/browser/axe.spec.ts with color-contrast enabled on every T0/T1/T2 … | QUAL-030, QUAL-031 | REQ-QUAL-61, REQ-QUAL-19 |
| QUAL-074 | MODIFY | `packages/qa/src/matrix/shard.ts; certification/runner/README.md` | REQ-QA-20 / REQ-PERF-36: size the GPU pool for the per-PR frame-time ratchet tests/perf/browser/qual/pr-ratchet.spec.ts (44 flagships, standard tier, profile (a)): pool … | QUAL-056 | REQ-QUAL-40, REQ-QUAL-37, REQ-QUAL-67 |
| QUAL-075 | CREATE | `NEW:scripts/qual/verify-flagship-deliverables.mjs; …` | REQ-QA-80 item 4 / architecture §11.3: create the per-flagship deliverables gate. certification/flagship-deliverables.json lists the 44 §11.2 flagships (owner PRDs … | QUAL-026 | REQ-QUAL-63 |
| QUAL-076 | MODIFY | `ci/qual.gitlab-ci.yml` | qual:build:storybook: npm ci, `npm run build-storybook 2>&1 \| tee sb-build.log`, `node scripts/storybook/check-build-log.mjs sb-build.log`, `node … |  | REQ-QUAL-64 |
| QUAL-077 | INFRA | `NEW:ci/qual.gitlab-ci.yml` | Storybook test steps run inside QUAL lane jobs (no reusable workflows on GitLab): qual:certify:l5 and l6 consume the storybook-static/ artifact of qual:build:storybook … |  | REQ-QUAL-64 |
| QUAL-078 | TEST | `ci/qual.gitlab-ci.yml` | Contract check: qual:build:storybook runs `node scripts/storybook/verify-fresh.mjs storybook-static` after `npm run build-storybook` and before any artifact upload, and … | QUAL-028 | REQ-QUAL-56 |
| QUAL-079 | INFRA | `ci/qual.gitlab-ci.yml` | On release/4.x the 4.x Storybook build is PLAT's (contract §2.4.1); QUAL's ci/qual.gitlab-ci.yml (owned on both branches, row A20) adds a release/4.x-scoped … | QUAL-076 | REQ-QUAL-56 |
| QUAL-080 | TEST | `certification/playwright.cert.config.ts` | Read-only check (no edit; PRD-QA owns certification/** and QA-018 already specifies the command): webServer.command of certification/playwright.cert.config.ts starts … | QUAL-016 | REQ-QUAL-56 |
| QUAL-081 | MODIFY | `fragments/lanes/qual.ts` | Add Storybook lint gates (lint:stories, ratchet --check, lint-titles, static-gates, typecheck:stories, RuleTester + node tests) to lane L1 and Storybook interaction … | QUAL-077 | REQ-QUAL-57, REQ-QUAL-19 |
| QUAL-082 | TEST | `NEW:ci/qual.gitlab-ci.yml` | On RC SHA the vitest job shows >=6 S1 showcase play flows and Material Lab round-trips at 100% pass and 0 deprecated test imports. (Cross-lane input 5h-Q8, 5g-Q7 is … | QUAL-081 | REQ-QUAL-64, REQ-QUAL-34 |
| QUAL-083 | MODIFY | `jest.config.js` | SC-30/SC-29: add <rootDir>/tests/storybook/ and <rootDir>/tests/showcase/ to the Jest roots/testMatch of PRD-QA's jest.config.js (owner QA-003) so the *.test.ts(x) … | QUAL-007 | REQ-QUAL-10 |
| QUAL-084 | MODIFY | `jest.config.js` | Add '<rootDir>/tests/perf/browser/', '<rootDir>/tests/perf/harness/self-test.spec.ts', '<rootDir>/tests/perf/devices/' to testPathIgnorePatterns so Jest (testMatch … | QUAL-007 |  |
| QUAL-085 | MODIFY | `fragments/size-budgets/qual.ts` | REQ-PERF-01: add rows (integer limitBytesGz, min+gz level 9, React and optional peers external) { AppShell } app-shell 15360; { Sparkline } data 3072; { DatePicker } … |  | REQ-QUAL-10 |
| QUAL-086 | MODIFY | `playwright.config.ts` | If PRD-19 has not: add project perf (testDir ./tests/perf, testMatch /(browser\/.*\|harness\/self-test)\.spec\.ts$/, retries 0) and testIgnore /tests\/perf\// on the six … | QUAL-084, QUAL-007, QUAL-016 |  |
| QUAL-087 | MODIFY | `ci/qual.gitlab-ci.yml` | L10 Performance inside QUAL's own lane jobs: main scope runs perf-self-test and profiles b/c/d on .ag-playwright (saas-linux-medium-amd64, AG_REMOTE_RUNNER=1, built … | QUAL-086, QUAL-029, QUAL-030 | REQ-QUAL-64 |
| QUAL-088 | MODIFY | `fragments/lanes/qual.ts` | Register node-cold-import as a QUAL L2 lane step (fragments/lanes/qual.ts, kind node-script) that reads the packed tarball from AURAGLASS_TARBALL (plat:package:pack … |  | REQ-QUAL-47 |
| QUAL-089 | MODIFY | `ci/qual.gitlab-ci.yml` | perf-pr-ratchet as part of qual:certify:l10 at PR scope for changes under src/** (rules: changes): GPU profile (a) from the sized .ag-gpu pool; when no GPU runner is … | QUAL-028 | REQ-QUAL-64 |
| QUAL-090 | MODIFY | `ci/qual.gitlab-ci.yml` | Beta: on the beta SHA, `rg -n "backdrop-filter\|backdropFilter\|backdrop-blur" src` excluding src/material/**, stories and tests = 0 (4.1: 513/537), as a QUAL L1 lane … |  | REQ-QUAL-64 |
| QUAL-091 | MODIFY | `fragments/size-budgets/qual.ts` | REQ-PERF-38 at 5.0.0-alpha.1 (Button+Dialog pattern gate): remote L10 Performance lane + verify-size-budgets.mjs on the candidate SHA; set limitBytesGz = … | QUAL-087 | REQ-QUAL-39 |

## Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q2 REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
