# PROMPT-18h (QA): Evidence verifier, claims, retention, publish gate, human review lanes, release checklist

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md` SC-05, SC-07, SC-10, SC-29), sections §3 items 1, 11, 12; §4.6; §4.8; §5.6; §5.7 REQ-QA-35; §5.11; §5.12; §10; §18 items 6–8.
Requirements: REQ-QA-30, -31, -32, -33, -35, -70, -71, -72, -80, -81 (REQ-QA-73 exemptions were built in 18d and are verified here). Acceptance: AC-QA-03 (wiring), AC-QA-11, AC-QA-12, AC-QA-18 (infra; the human run is QA-105), AC-QA-19, AC-QA-22. Tasks: QA-088..QA-105, QA-127 (flagship deliverables gate, REQ-QA-80 item 4).

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture, in particular D-32 (evidence is CI artifacts, never committed; claims generated from the GA run). Record deviations with evidence.
- Remote only: `certify-release.yml` runs (dry run through `workflow_dispatch`) and any lane execution happen on GitHub-hosted runners. Read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` and `github-npm.md` first. Never publish, never push a tag, never edit npm trusted-publisher settings.
- `.github/workflows/publish-npm.yml` is a PRD-REL file (REL-025/026; 4.1.1 instance TRUST-077/080). QA-096 is a MODIFY reviewed by the PRD-REL owner. Never rename it (the npm trusted publisher is bound to that filename, SC-05) and never create a `release.yml`. `glass-pipeline.yml` is PRD-PKG's (PKG-038): never delete it or rename its jobs (SC-10).
- Human lanes: the agent generates composites and templates and validates records. It never fills reviewer scores or SR results.
- No fake completion: no synthetic evidence presented as release evidence, no claims for a non-pass lane, no manually ticked mechanical checklist items, and no allowlisting in `no-committed-evidence.test.ts` to get green while `reports/` is still tracked (it stays red, BLOCKED on PRD-TRUST TRUST-063).
- Leave the uncommitted PRD-TRUST files alone.
- Evidence paths resolve through `scripts/ci/lib/evidence-dir.js` (TRUST-006); uploads are `evidence-<job>-${{ github.sha }}` with explicit `retention-days` 14/30/90 (SC-07).

## Prerequisites
1. 18c: `test -f .github/workflows/certify-release.yml`. 18d: `test -f packages/qa/src/matrix/prune.ts && test -f packages/qa/src/gates/exemptions.ts`. 18b: `test -f packages/qa/src/evidence/flake.ts`.
2. PRD-REL / PRD-TRUST: `rg -n "needs:|workflow_call|glass-pipeline" .github/workflows/publish-npm.yml` shows REL-025's publish job and the TRUST-080 `verify` job for QA-096 (`PROMPT_01_REL`, `PROMPT_00_TRUST`); `git ls-files reports | wc -l` = 0 (TRUST-063) for AC-QA-12. If they are not met, BLOCKED on the owner for those items only.
3. PRD-A11Y (A11Y-084, `PROMPT_05_A11Y`): `test -f tests/a11y/manual/sr-record.schema.json && ls tests/a11y/manual/scripts` for QA-099. PRD-DX (DX-134/136, `PROMPT_16_DX`): `test -f scripts/docs/lint-claims.mjs` (REQ-DX-77) for QA-102. If they are missing, fail with provider missing.
4. Open ownership conflict, to report and not resolve: PRD-DX REQ-DX-77 says "README claim regions … PRD-19 `render.ts` does". This PRD's REQ-QA-31 says README rendering is PRD-DX/PRD-REL, not QA. Do **not** create `render.ts`. List it in the report for the orchestrator.

## May touch
NEW `packages/qa/src/evidence/{verify,aggregate,releaseBundle,composite,checklist,srMatrix}.ts`, NEW `packages/qa/src/claims/build.ts`, NEW tests `packages/qa/test/{evidence-verify,aggregate,claims,no-committed-evidence,release-bundle,composite,sr-matrix,checklist}.test.ts` with fixtures under `packages/qa/fixtures/evidence/`, NEW `certification/review/{visual-rubric.md,review-record.schema.json,sr-matrix.template.json}`, NEW `certification/RELEASE_CHECKLIST.md`, `.github/workflows/certify-release.yml` (jobs `verify`, `claims`, `bundle`, `record-review`, `checklist`), `.github/workflows/publish-npm.yml` (QA-096 only: the `certify` job and the publish `needs:` entry), `.gitignore`, `package.json` (`cert:*` scripts), `CONTRIBUTING.md` ("Certification" section), `certification/lanes.config.ts` (the lint-claims consumer step and the QA-127 L1 registration), NEW `scripts/ci/verify-flagship-deliverables.mjs`, NEW `certification/flagship-deliverables.json`, NEW `packages/qa/test/flagship-deliverables.test.ts`.

## Must not touch
`README.md`, `RELEASE_NOTES_*`, `llms.txt`, `scripts/docs/**` (PRD-DX), `scripts/release/**` (PRD-REL), `.github/workflows/glass-pipeline.yml` (PRD-PKG), `scripts/audit/verify-visual-evidence.js` (kept for 4.x), npm/trusted-publisher configuration.

## Steps
1. **QA-090** `aggregate.ts` → `evidence-manifest.json`. **QA-088/089** `verify.ts` implements every REQ-QA-30 check:
   - exact SHA
   - L1–L12 manifests with `results.length` > 0 and status pass
   - quarantined counts as not pass
   - recomputed inventory/thresholds/scenes/baselines sha256s
   - every visual subject present in every required cell
   - PNGs non-blank and at the declared dimensions
   - L13/L14 records bound to the SHA, or to an earlier SHA with zero diffs
   - no expired exemptions or allowlist entries
   - REQ-QA-81: L13/L14 required from `-rc.1`

   Write one fixture per failure code.
2. **QA-091/092** `claims/build.ts`:
   - writes the claim ids listed in QA-091 in the REQ-DX-77 shape
   - ports the incomplete-language guard from `storybook-visual-certification.mjs:390-426`: any lane that is not pass → exit 1 and no file written
3. **QA-093/094** `no-committed-evidence.test.ts` + `.gitignore` patterns (REQ-QA-32). The PNG allowlist is exactly `certification/baselines/`, `certification/scenes/`, `docs/**/assets/` and `packages/qa/fixtures/` (≤40 KB).
4. **QA-095** `releaseBundle.ts`: `certification-<version>.tar.zst` (zstd -19), JPEG q85 except regression cells, ≤2 GB. Retention: PR 14, main/nightly 30, release 90 days plus the GitHub release asset. EC2 runs also copy to the S3 evidence prefix.
5. **QA-096 (REQ-QA-35)** In `publish-npm.yml` (after REL-025):
   - add job `certify: uses: ./.github/workflows/certify-release.yml` with `sha: ${{ github.sha }}`
   - publish `needs: [verify, certify]`: keep the existing `verify` job that calls `glass-pipeline.yml` (REQ-TRUST-10, REL-026)
   - do not rename the file, its `name:` or `permissions`; do not touch `glass-pipeline.yml`

   `workflows.test.ts` (18c) turns fully green.
6. **QA-097 (AC-QA-11 proof)** Dry-run `workflow_dispatch` of `certify-release.yml` with input `drop_lane=L7` (honoured only in dry runs) → `verify` red, `claims` not started. Link the run.
7. **QA-098** `composite.ts`: 8 scenes × light/dark @1440, the 390 photo cell, the previous baseline and the diff, with a sha256 per composite.
8. **QA-099** Rubric R1–R7 (§4.6), `review-record.schema.json`, and `sr-matrix.template.json` generated by `srMatrix.ts` from the PRD-A11Y scripts:
   - AT/browser pairs: VoiceOver+Safari macOS 26, VoiceOver+Safari iOS 26, NVDA 2025.x+Chrome Win 11, TalkBack+Chrome Android 15, plus a physical touch pass
   - GA rule = PRD-A11Y's issue-#16 rule (SC-29): SR-1..SR-4 and the physical-touch pass recorded as pass for all 44 flagships on the RC SHA; no waiver allowance
9. **QA-100** `record-review` dispatch job: validates against the schema, binds SHA and composite sha256, uploads the record (retention 90), never commits.
10. **QA-101** `RELEASE_CHECKLIST.md` (items 1–8 of REQ-QA-80) + `checklist.ts`, rendered into the release PR body with `gh pr edit` and ticked only from evidence.
    **QA-127** (depends only on QA-029, so run it as its own PR as soon as QA-029 merges, ahead of the rest of this wave-5 prompt: wave-4 tasks AI-092 and MED-156 depend on it) NEW `scripts/ci/verify-flagship-deliverables.mjs` + NEW `certification/flagship-deliverables.json`: the item-4 gate for architecture §11.3. Fails closed when a §11.2 flagship is absent from the config, any item is missing or marked optional, or perf grade < C. Owner PRDs append their own entries; this task ships the script, schema and fixture tests (`packages/qa/test/flagship-deliverables.test.ts`), not the entries.
11. **QA-102** Run PRD-DX `lint-claims.mjs` as a consumer step in `certify-release`. **QA-103** `cert:static|visual|regression|verify|claims|bundle`. `cert:verify` runs the inventory check first, so `unclassified-export` exits 1 (AC-QA-03). **QA-104** CONTRIBUTING section.
12. **QA-105** At RC-1, humans execute L13 and L14 through `record-review`. Status stays todo until records exist.

## Tests (named)
CI unit: `packages/qa/test/evidence-verify.test.ts`, `aggregate.test.ts`, `claims.test.ts`, `no-committed-evidence.test.ts`, `release-bundle.test.ts`, `composite.test.ts`, `sr-matrix.test.ts`, `checklist.test.ts`, `workflows.test.ts` (full). Remote: the `certify-release.yml` dry run (complete), and the dry run with `drop_lane=L7`.

## Visual evidence
Review composites for the sentinel subjects, generated in the dry run and uploaded as artifacts (retention 14) to show reviewers the format. Human reviewers score them; the agent does not.

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-03 | Fixture run of `npm run cert:verify` exits 1 with `unclassified-export` after `@nonvisual` is removed |
| AC-QA-11 | Dry-run URL: `verify` exits non-zero with a lane manifest missing; `publish-npm.yml` publish `needs: [verify, certify]` (`workflows.test.ts`) |
| AC-QA-12 | `git ls-files reports test-results playwright-report coverage` = 0 and `no-committed-evidence.test.ts` green (or BLOCKED on PRD-TRUST TRUST-063) |
| AC-QA-18 (infra) | Templates, schema and record job present; `sr-matrix.test.ts` green. The human records come from QA-105 |
| AC-QA-19 | `claims.test.ts` green; the lint-claims consumer step runs, or reports provider missing (PRD-DX) |
| AC-QA-22 | `checklist.test.ts` green; the dry run renders the checklist into a draft PR body with mechanical items ticked from evidence only |

## Final report
```
PROMPT-18h REPORT
SHA / PRs (QA-096 marked PRD-REL-reviewed):
Tasks QA-088..105, QA-127: status each
Dry runs: full <url>; drop_lane=L7 <url>
AC-QA-03/11/12/18(infra)/19/22: status + evidence
Open item: README render.ts ownership (REQ-DX-77 vs REQ-QA-31)
Deviations / Operator actions / Blockers:
```
