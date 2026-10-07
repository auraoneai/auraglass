# PROMPT-5e (QUAL lane Q5): Behaviour, motion, canaries and unit

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q5**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5e-Q5"` (8 tasks: QUAL-122..128, 305).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside QUAL):** `certification/lanes/{behaviour,ssr-hydration,overlay-stacking,motion,canaries}.spec.ts`, `certification/ratchets.json`, `scripts/qual/lint-tests.mjs`, `tests/lint/qual/no-vacuous-assertions.test.ts`

**Order inside the lane:** L5 wiring on contract doubles (-19) → SSR/stacking (-21) → L9 (-23) → L11 incl. 4.x tarball (-29, -33) → L12 floors and vacuous gate (-30, -31)

**Requirements closed by this lane:** REQ-QUAL-19, REQ-QUAL-21, REQ-QUAL-23, REQ-QUAL-29, REQ-QUAL-30, REQ-QUAL-33, REQ-QUAL-63.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q5 -b next-qual/q5-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5e-Q5") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-122 | CREATE | `NEW:certification/lanes/motion.spec.ts` | REQ-QA-21: motion on (no forced reduce in certify mode): 12 frames at 16 ms during each declared entrance (parameters.ag.states[].entrance) must contain >=3 distinct … |  | REQ-QUAL-23 |
| QUAL-123 | CREATE | `NEW:certification/ratchets.json` | [REQ-QA-43, REQ-QA-81] This PRD's coverage ratchets only (SC-17: the literal baseline is DS's scripts/tokens/gates/literals-baseline.json, not here): {coverage: … |  | REQ-QUAL-30, REQ-QUAL-63 |
| QUAL-124 | CREATE | `NEW:certification/lanes/behaviour.spec.ts` | REQ-QA-18: in 3 engines, import every tests/a11y/apg/<component>.apg.spec.ts through tests/a11y/apg/harness.ts and run tests/a11y/browser/axe.spec.ts with … |  | REQ-QUAL-19 |
| QUAL-125 | CREATE | `NEW:certification/lanes/ssr-hydration.spec.ts` | REQ-QA-19: for each flagship, renderToString in Node (from the packed tarball) then hydrateRoot in each engine: 0 console warnings/errors; MutationObserver on <html> … | QUAL-124 | REQ-QUAL-21 |
| QUAL-126 | CREATE | `NEW:certification/lanes/overlay-stacking.spec.ts` | REQ-QA-19: open Dialog -> Menu -> Tooltip; Escape closes Tooltip, then Menu, then Dialog (LIFO); computed z-order (elementsFromPoint at each layer centre) matches the … | QUAL-124 | REQ-QUAL-21 |
| QUAL-127 | CREATE | `NEW:certification/lanes/canaries.spec.ts` | REQ-QA-38: run each PRD-02 fixture canaries/{next16,next15,vite,vite-tailwind4} (+ Base UI floor/latest, REQ-PKG-86) own assertions from the packed tarball; assert … |  | REQ-QUAL-29 |
| QUAL-128 | TEST | `certification/ratchets.json` | REQ-QA-81 / §20 step 8: at 5.0.0-alpha.1 run L2 + L10 on the alpha SHA and hand the artifacts to PRD-02 (docs/size-budgets.json via its calibration PR) and PRD-07 … |  | REQ-QUAL-63 |
| QUAL-305 | TEST | `NEW:certification/lanes/canaries.spec.ts` | From day 0 qual:certify:nightly and main-scope l2/l3/l11 also run against two 4.x tarballs: npm pack aura-glass@$AG_V4_DIST_TAG (public registry, no credential) and one … |  | REQ-QUAL-33 |

## Contract seams this lane consumes

S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-35, S-36, S-49. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q5 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
