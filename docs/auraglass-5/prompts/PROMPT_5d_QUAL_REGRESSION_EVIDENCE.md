# PROMPT-5d (QUAL lane Q4): Regression and evidence

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q4**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5d-Q4"` (15 tasks: QUAL-108..121, 309).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside QUAL):** `certification/baselines/**`, `certification/lanes/regression.spec.ts`, `packages/qa/src/evidence/**`, `certification/{exemptions,console-allowlist,quarantine}.json`, `certification/RELEASE_CHECKLIST.md`, `certification/review/**`

**Order inside the lane:** evidence layout + guard (-60) → L7 + `VisualClassReport` (-24, -26) → baseline refresh flow (-25) → verifier, claims, verdict (-61..-63) → L13/L14 tooling (-72, -73)

**Requirements closed by this lane:** REQ-QUAL-11, REQ-QUAL-13, REQ-QUAL-24, REQ-QUAL-25, REQ-QUAL-60, REQ-QUAL-61, REQ-QUAL-63, REQ-QUAL-65, REQ-QUAL-66, REQ-QUAL-71, REQ-QUAL-72, REQ-QUAL-73.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q4 -b next-qual/q4-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5d-Q4") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-108 | CREATE | `NEW:packages/qa/src/evidence/manifest.ts` | [§4.8, REQ-QA-30] Lane manifest writer + JSON Schema packages/qa/src/evidence/lane-manifest.schema.json: {lane, sha, imageDigest, … |  | REQ-QUAL-61 |
| QUAL-109 | CREATE | `NEW:packages/qa/src/evidence/flake.ts` | REQ-QA-63: compare two L7 lane manifests for the same SHA; any cell whose verdict differs -> flake record; >0.1% differing cells fails; a flaky cell may be marked … | QUAL-108 | REQ-QUAL-66, REQ-QUAL-11, REQ-QUAL-61 |
| QUAL-110 | CREATE | `NEW:packages/qa/src/evidence/budgetWatch.ts` | REQ-QA-37: compare pipeline wall clock to budgets (PR-scope lane jobs p90 <= 20 min over the last 20 pipelines, main <= 45, release <= 90) using the GitLab pipelines … |  | REQ-QUAL-65 |
| QUAL-111 | CREATE | `NEW:packages/qa/src/evidence/a11yPixelContrast.ts` | Emit a11y-pixel-contrast.json for PRD-05 REQ-A11Y-19 from the same captures: one row per visible DOM text run (no cap) {text, color, alpha, bg, ratio, worstRatio, need, … |  | REQ-QUAL-13 |
| QUAL-112 | CREATE | `NEW:certification/lanes/regression.spec.ts` | REQ-QA-24: per subject-state 10 baseline cells: chromium and webkit x {photo, flat-white} x {light, dark} at 1440, chromium x photo x light at 390, firefox x photo x … |  | REQ-QUAL-24 |
| QUAL-113 | CREATE | `NEW:packages/qa/src/evidence/diffReport.ts` | [REQ-QA-25] Generate baseline-diff-report.html from old/new baseline pairs: per file base, head, pixelmatch diff heat map (threshold 0.1), changed ratio; self-contained … |  | REQ-QUAL-25 |
| QUAL-114 | CREATE | `NEW:packages/qa/src/evidence/verify.ts` | [REQ-QA-30, REQ-QA-81] REQ-QA-30 (generalises scripts/audit/verify-visual-evidence.js provenance binding): evidence-manifest.json exists for the exact release SHA; … | QUAL-108, QUAL-109 | REQ-QUAL-61, REQ-QUAL-63 |
| QUAL-115 | CREATE | `NEW:packages/qa/src/evidence/aggregate.ts` | [REQ-QA-30] §4.8: collect all lane manifests + review records (review-record.json) + SR matrix (a11y-manual-<sha>.json) for one SHA into evidence-manifest.json {sha, … | QUAL-108 | REQ-QUAL-61 |
| QUAL-116 | CREATE | `NEW:packages/qa/src/evidence/releaseBundle.ts` | REQ-QA-33: build certification-<version>.tar.zst (zstd -19) from .artifacts/qual/<sha>; captures JPEG q85 except baseline-compared cells (PNG); fail if > 2 GB; … | QUAL-115 | REQ-QUAL-60 |
| QUAL-117 | CREATE | `NEW:packages/qa/src/evidence/composite.ts` | REQ-QA-71 / §4.6: one PNG per subject-state: 8 scenes x light/dark at 1440, the 390 photo cell, previous approved baseline and diff heat map; filename includes … | QUAL-113 | REQ-QUAL-73 |
| QUAL-118 | CREATE | `NEW:certification/review/{visual-rubric.md,review-record.schema.json,sr-matrix.template.j …` | [REQ-QA-70, REQ-QA-71] REQ-QA-70/71: visual-rubric.md = R1-R7 rubric with 1 and 4 anchors (§4.6), pass rule (all >=3, none 1 on flagships); review-record.schema.json … |  | REQ-QUAL-72, REQ-QUAL-73 |
| QUAL-119 | CREATE | `NEW:certification/RELEASE_CHECKLIST.md` | REQ-QA-80 items 1-8 as a template with machine keys; packages/qa/src/evidence/checklist.ts renders it from evidence-manifest.json + verify output into … | QUAL-114 | REQ-QUAL-63 |
| QUAL-120 | TEST | `certification/review/` | [REQ-QA-70, REQ-QA-71] At RC-1: run L13 SR matrix and L14 rubric for all flagship subject-states and the 6 product scenes via record-review; this is human work (status … | QUAL-117 | REQ-QUAL-72, REQ-QUAL-73 |
| QUAL-121 | TEST | `certification/RELEASE_CHECKLIST.md` | [REQ-QA-80] GA run: qual:certify:release on the GA tag SHA, every lane pass, verify pass, claims.json built (worst OCR >= 4.5/3/7; solid/forced-colors 0 backdrop … | QUAL-119, QUAL-120, QUAL-110 | REQ-QUAL-63 |
| QUAL-309 | CREATE | `NEW:packages/qa/src/deliverables/check.ts` | For each of the 44 flagships (ComponentMeta.flagship) verify meta, rendered parts = meta.parts, migration.selectors, a composing registry block/item, an APG spec under … |  | REQ-QUAL-71 |

## Contract seams this lane consumes

S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-40, S-41, S-42, S-43. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q4 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
