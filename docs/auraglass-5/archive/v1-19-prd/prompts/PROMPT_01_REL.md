# PROMPT-01 (REL): Release Governance and Migration Strategy — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` (key **REL**, alias PRD-01; REQ-REL-01..42, AC-REL-01..21, SB-REL-1..5, RESP-REL-1..4, A11Y-REL-1..7, §16 budgets, §21 open items). Binding contract registry: `docs/auraglass-5/prd/_shared-contracts.md` (a registry row wins over any prompt text). Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-01, D-14, D-17, D-18, D-19, D-27, D-28, D-32; §3.2, §12, §13.1, §14, §15.2–15.3, §16). Task fragment: `docs/auraglass-5/tasks/REL.json` (122 tasks: REL-001..018, 020..037, 040..060, 070..091, 100..142; unused numbers in between are reserved).

PRD-01 covers 42 requirements spread across the whole train, from 4.1.1 (week of 2026-10-12) through 5.0.0 GA (est. 2027-04-26) to 4.x EOL (est. 2028-04-26). Its work is gate scripts, CI workflows, policy documents and per-release operations. One agent session can't hold all of it, so it is split into six prompts that can each run on their own. Each prompt restates the common rules, its REQ/AC IDs, its file scope and checkable prerequisites, which name the owner task (and its prompt) that must be merged first.

| Prompt | Scope | REQ-REL | AC-REL | Tasks | Branch | Hard prerequisites (owner tasks) |
|---|---|---|---|---|---|---|
| `PROMPT_01a_REL_BASELINE.md` | path module, API report and tarball export-snapshot extensions, deprecations schema, verifier and seed check, exception allow-list, task-graph validator | 01, 02, 03, 04, 05, 06, 42 | 01, 21 | REL-001..018, REL-140, REL-141 | `rel/baseline` → `main` | TRUST-002, TRUST-071, TRUST-072, TRUST-075 merged (`PROMPT_00a_TRUST_PACK.md`, `PROMPT_00g_TRUST_RELEASE.md`); DX-019 `scripts/docs/paths.mjs` merged |
| `PROMPT_01b_REL_PUBLISH_LEDGER.md` | guard verification, dry-run, dist-tag derivation, publish workflow extension, verify-dist-tags, ledger, release notes, rollback runbook, 4.1.1 gate verification | 19, 20, 21, 22, 23, 24, 25, 37 | 02, 11 (4.1.1 onward), 19 (runbook half) | REL-020..037 | `rel/publish` → `main` | 01a merged; TRUST-077, TRUST-078, TRUST-079 merged (`PROMPT_00g_TRUST_RELEASE.md`) |
| `PROMPT_01c_REL_CLASSIFY_BRANCH.md` | visual-class, classify-change (all sources, install-level rule, families, forward-port), change-class workflow (+ task-graph step), CODEOWNERS, branch policy + protection verifier | 09, 12, 13, 14, 15, 16, 17, 18, 42 (CI step) | 03, 09 | REL-040..060, REL-142 | `rel/classify` → `main` | 01a merged; 01b's REL-023 `dist-tag.mjs` merged; QA-031/QA-072 `certify-pr.yml` regression job (`PROMPT_18c_QA_CI_FAIL_CLOSED.md`, `PROMPT_18f_QA_REGRESSION_ENGINE_MOTION.md`); PKG-038 `glass-pipeline.yml` (`PROMPT_02a_PKG_BUILD.md`) |
| `PROMPT_01d_REL_RUNTIME_42.md` | `warnDeprecated`, generator, TSDoc checker, stale v2.0.0 rewrite, 4.2 entries, `./deprecations.json` export, downstream grep, D-28 composites, 4.2.0 gate + `release/4.x` cut | 07, 08, 10, 11, 26, 39 (4.2 half), 40, 41 | 05 (4.2 half), 08, 16, 17 (4.2 half) | REL-070..091 | `rel/runtime-42` → `main`; cut `release/4.x` | 01a, 01c merged; A11Y-029 `AuraGlassProvider` (`PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`); DX-037 `doctor --v5` (`PROMPT_16b_DX_INIT_ADD_DOCTOR.md`); DS-004 and CTL-154 D-28 PRs open |
| `PROMPT_01e_REL_CONTRACTS_43.md` | breaking register, 4.3 entries, compat coverage, codemod catalogue test (14 ids), generated guide anchors, comms verifier + banners, LTS policy draft, doc pointers, CLI notice, frozen 4.x fixture, Storybook migration contract | 27 (contract half), 33, 34, 35, 36 (draft), 38, 39 (5.0 half) | 06, 12 (fixture freeze), 14, 15 (coverage half) | REL-100..124 | `release/4.x` (4.3 content) + forward-merge to `main` | 01d merged; `release/4.x` exists; DX-041/DX-042/DX-053 engine and fixtures (`PROMPT_16c_DX_CODEMODS_COMPAT.md`); DS-103 alias table (`PROMPT_03f_DS_COMPAT_RETIRE_CERT.md`); MAT-101/MAT-102 preview; SB-048/SB-078 (`PROMPT_17*_SB*.md`) |
| `PROMPT_01f_REL_TRAIN_OPS.md` | per-stop gate records 4.3.0 → GA → EOL, 4.4 scope rule, RC freeze rule, alpha trigger widen + `unanalysable` fatal, rollback drill, GA dist-tags, Discussions, EOL deprecate | 02 (5x flip), 14 (GA flip), 19 (v5 triggers), 27 (record), 28, 29, 30, 31, 32, 36 (publish), 37 (EOL), 38 (Discussions), 39 (5.0 notes) | 04, 05, 07, 10, 12, 13, 15 (budget), 17 (RC), 18, 19, 20 | REL-125..139 | per stop | the matching earlier prompts merged; per stop: MAT-047 + PERF-039 (alpha), QA-087 + DX-060 + FND-107 (beta), PKG-048 + QA-087 (rc); run once per train stop with `STOP=<4.3.0|4.4.0|alpha|beta|rc|ga|eol>` |

REQ coverage check: 01–06, 42 (01a); 19–25, 37 (01b); 09, 12–18 (01c); 07, 08, 10, 11, 26, 39(4.2), 40, 41 (01d); 27, 33–36, 38, 39(5.0) (01e); the operational halves of 02, 14, 19, 27–32, 36–39 (01f). Every REQ-REL-01..42 is covered at least once in prompts and in `REL.json` (42/42). Where a REQ appears in two rows, one prompt builds it and the other operates it.

Order: 01a → 01b → 01c → 01d → 01e. 01f runs at each train stop after the prompts it names. 01b and 01c can run in parallel once 01a is merged, but 01c's REL-043 imports `scripts/release/dist-tag.mjs` from 01b's REL-023, so merge REL-023 first.

## PRD numbering (SC-01)

PRD-01's prose cites architecture §16 ids with the program key in brackets. `REL.json` `depends_on` never contains a `PRD-xx` string; it names the owner's anchor task (SC-40). External gates go in the optional `gate` field.

| §16 id in PRD-01 text | Key | File | Anchor tasks used by REL |
|---|---|---|---|
| PRD-00 | TRUST | `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` | TRUST-002, -063, -071, -072, -075, -077, -078, -079 |
| PRD-02 | PKG | `AURAGLASS_PACKAGING_BUILD_PRD.md` | PKG-038, PKG-048 |
| PRD-03 | DS | `AURAGLASS_DESIGN_SYSTEM_PRD.md` | DS-004, DS-103 |
| PRD-04 (+ interim PRD-15) | MAT | `AURAGLASS_MATERIAL_ENGINE_PRD.md` | MAT-047, MAT-101, MAT-102 |
| PRD-05 | A11Y | `AURAGLASS_ACCESSIBILITY_PRD.md` | A11Y-029 |
| PRD-07/14/16 | FND | `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` | FND-107 |
| PRD-08 | CTL | `AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` | CTL-154 |
| PRD-17 (unfiled) | REL interim (SC-37) | this PRD holds scope and gates; content MAT-101, DS-103, DX-037, MAT/MOT | — |
| PRD-18 + PRD-20 | DX | `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` | DX-019, -037, -041, -042, -043, -053, -060, -065, -136 |
| PRD-19 | QA | `AURAGLASS_QA_CERTIFICATION_PRD.md` | QA-031, QA-072, QA-087 |
| PRD-19 (Storybook half) | SB | `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` | SB-048, SB-078 |
| none | PERF | `AURAGLASS_PERFORMANCE_PRD.md` | PERF-039 |

## Fixed artifact paths (SC-02, SC-04, SC-05, SC-06, SC-08, SC-09, SC-11, SC-33)

There is no path-discovery file. Every REL script imports these constants from `scripts/release/lib/paths.mjs` (REL-001):

| Artifact | Path | Instance built by |
|---|---|---|
| API reports / snapshots | `etc/api/<slug>.api.md`, `etc/api/<slug>.exports.json`, `etc/api/manifest.json`; slug `.` → `index`, `./a/b` → `a-b` | TRUST-071/072 (REL extends) |
| API scripts | `scripts/release/api-report.mjs`, `scripts/release/export-snapshot.mjs`; never `scripts/api/` | TRUST-071/072 |
| Deprecations | repo-root `deprecations.json`, `version: 1` from the first 4.1.1 commit, no `schemaVersion: 0`, no migration script; path constant `DEPRECATIONS_PATH` in `scripts/docs/paths.mjs` | TRUST-075 (REL-010 schema) |
| Exception enum | `security | privacy | crash | legal | honesty` | REL-010 |
| Publish workflow | `.github/workflows/publish-npm.yml` (never renamed; trusted-publisher binding); guard `GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v` | TRUST-077..079 |
| Pack helper | `scripts/ci/lib/npm-pack.js` | TRUST-002 |
| Visual captures | QA `certify-pr.yml` `regression` job; `visual-regression.yml` is not repurposed | QA-031/QA-072 |
| Frozen 4.x fixture | `tests/fixtures/consumer-4x/` with `flagship-subset.json`; CI job `consumer-4x-frozen` in `certify-main.yml` (QA L11) | REL-115 (QA-087 harness) |
| Codemods | `packages/cli/src/migrate/4to5/__fixtures__/<id>/<case>/`; 8 core + 6 area ids; marker `TODO(aura-glass 5)` | DX-041/042 |
| Size budgets | rows in `docs/size-budgets.json`, gate `scripts/ci/verify-size-budgets.mjs`; no `size-limit` | PKG-048 |

## Owner actions (outside the agent perimeter; recorded in the release issue, never performed by an agent)

1. Name release owners for `.github/CODEOWNERS` (REL-053).
2. Repo admin applies branch protection with the payload in `docs/release/branch-policy.md` (REL-058; `main` before 4.2, `release/4.x` at the cut).
3. npm 2FA account dist-tag moves: `v4-lts` at GA, rollback retags, the rollback drill (REL-130, REL-134).
4. Push release tags (each tag publishes publicly and can't be undone).
5. Confirm npm scope ownership for `@auraglass/cli` (D-23) before 4.2.
6. Keep the npm trusted-publisher binding at `auraoneai/auraglass` + `publish-npm.yml` (an npm package setting).
7. Pin and publish GitHub Discussions; run `npm deprecate` (bad versions, EOL).
8. Confirm the human decisions in PRD §21: OI-06 (C-D install-level rule), OI-12 (SC-24 Button API break), OI-13 (SC-36 4.1.1 scope split).

## Final program report

Each sub-prompt defines its own report. The release owner merges them into one table: AC-REL-01..21 → status (met / pending stop / blocked) → evidence URL (CI run, artifact, registry output) → SHA. Then list open owner actions, the PRD §21 open items still open, and any PRD contradictions found. Per D-32, evidence is CI artifacts linked from GitHub Releases and is never committed.
