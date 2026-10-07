# PROMPT-5a (QUAL lane Q1): Contract conformance and test helpers

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q1**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5a-Q1"` (6 tasks: QUAL-001..004, 307..308).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside QUAL):** `tests/contract/**`, `tests/helpers/**`, `tests/a11y/apg/harness.ts` (+ selftest), `tests/a11y/browser/**`

**Order inside the lane:** conformance suite green on seeds (C0) → real helpers (REQ-QUAL-69) → APG harness and axe spec (-20) → mutation self-test

**Requirements closed by this lane:** REQ-QUAL-20, REQ-QUAL-34, REQ-QUAL-69, REQ-QUAL-70.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q1 -b next-qual/q1-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5a-Q1") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-001 | CREATE | `NEW:tests/a11y/apg/harness.ts` | Export ApgScript type (exact PRD shape), runApgScript(page, script) (story -> /iframe.html?id=<story>; per step press/type then assert focused by data-ag-part or … |  | REQ-QUAL-20, REQ-QUAL-34 |
| QUAL-002 | TEST | `NEW:tests/a11y/apg/__selftest__/harness.selftest.spec.ts` | Fixture story A11y/HarnessFixture (native button + input): correct script passes; deliberately wrong script rejects (expect(...).rejects); empty steps throws; 3 engines. | QUAL-001 | REQ-QUAL-20 |
| QUAL-003 | TEST | `NEW:tests/a11y/apg/__selftest__/button-pattern.selftest.spec.ts` | Harness self-test fixture (SC-30, OV-15): a minimal button/toggle-button fixture story drives runApgScript (Enter/Space activate, aria-pressed toggles) to prove the … | QUAL-001 |  |
| QUAL-004 | TEST | `NEW:tests/a11y/apg/__selftest__/dialog-pattern.selftest.spec.ts` | Harness self-test fixture (SC-30, OV-15): minimal modal dialog fixture proves runApgScript expectations for focus-in, Tab cycle, Escape-closes-topmost via LayerStack … | QUAL-001 |  |
| QUAL-307 | MODIFY | `tests/helpers/index.ts; NEW:tests/helpers/setup.ts` | Replace the C0 seed with the real helpers exporting exactly renderAg, renderAgServer, expectParts, expectNoBannedAttributes, gotoStory, listSubjects, apg, perf, scenes … |  | REQ-QUAL-69 |
| QUAL-308 | TEST | `NEW:tests/contract/` | tests/contract/{material,attributes,css-vars,layers,preferences,components,meta,entries,fragments,ownership,doubles}.test.* each assert exactly the contract §6.3 row … |  | REQ-QUAL-70 |

## Contract seams this lane consumes

S-20, S-21, S-22, S-23, S-24, S-25, S-26. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q1 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
