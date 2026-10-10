# FIN-H status — human certification, operator actions, owner decisions (PRD §5.8, §5.9)

Checked 2026-10-10 against origin/next e5a2d6835, origin/release/4.x 645735fce, origin/release/4.1.x a19f4bbe1, all 257 PR heads #113-#369 (file lists diffed against each PR's base).

Headline: FIN-H is untouched. None of the 18 merged PRs and none of the 239 open PRs touches a FIN-H deliverable (gen-matrix, sr-matrix.template.json, aggregate.mjs, records, certification/review/records, real-device-matrix.md, od-*.md, operator-*.md, downstream-*.json). Nothing under FIN-H-owned paths has changed on origin/next since the plan base 84a3b94f1.

## REQ-FIN table

| REQ-FIN | Status | Evidence / what is missing |
|---|---|---|
| REQ-FIN-110 SR + touch matrix (issue #16) | (c) no PR | Agent prereqs missing: `scripts/mat/verify-a11y-manual.mjs` on next still reads `tests/a11y/manual/sr-record.schema.json` (line 16), not `contracts/schemas/sr-record.schema.json` (both exist; the duplicate was never deleted). `--sha` already exists from C0. Missing: `tests/a11y/manual/gen-matrix.mjs`, `sr-matrix.template.json`, `aggregate.mjs` (writes `.artifacts/qual/a11y-manual-<sha>.json`). Only 17 step scripts exist (cmp 12, mat 2 + template, surf 2); not every flagship, and no Lab, GlassPreferencesPanel or reduced-motion scripts. 0 records (only README stubs). Human SR/touch/motion passes not run. Issue #16 OPEN. Also needs an RC SHA that doesn't exist yet. |
| REQ-FIN-111 L14 human visual review | (c) no PR | No `certification/review/**` on any line (no rubric, no records). Upstream FIN-G tooling (composite.ts, visual-rubric.md, `qual:certify:review-record`) has no PR either. Needs RC-1 plus a named design reviewer. |
| REQ-FIN-112 Real-device perf sign-off | (c) no PR | `docs/certification/real-device-matrix.md` is on no line. Blocked by OD-5 (CA renewal) and OD-11 (runner registration). GitLab has 0 pipelines. |
| REQ-FIN-113 Operator actions | (c) no PR, with partial tooling in open PRs | None of the actions has been done. OD-11 settings not applied. No downstream grep run or AuraOne issue filed, and no `downstream-*.json`. `consumer-grep --write` not run: RM-01..13 on next have `status: missing`, `acknowledged: false`, and RM-13 says consumer-grep is "pending". The tooling is in open #182 (PLAT-81, MERGEABLE/CLEAN, 0 checks) and #184 (PLAT-82 verify-archive, CLEAN, 0 checks). `sync-fragments` hasn't been run both ways, and its tooling is open #125 (REQ-FIN-13). No `gh release create`: the latest release is still v4.1.0. PRs #97 and #77 are still OPEN, which is the stale stacked chain this REQ says to close. No `operator-*.md` records. |

Owner decisions (§5.9, OD-1..OD-21): no `docs/release/decisions/od-*.md` exists on any line or in any PR. All open ODs are undecided, so their defaults apply. OD-8 (mirror/PAT) still blocks everything that needs CI: GitLab project 87152036 has only `main` and 0 pipelines, and every open PR shows 0 status checks. OD-13 is partly done (release/4.1.x exists at a19f4bbe1), but no record was written and v4.1.1 isn't tagged. OD-21 (GHSA + archive repo) and OD-10 (trusted publishing) haven't been done; npm latest is 4.1.0. OD-2, -5, -9, -11, -12, -14..-20 have no evidence.

## Original REQs mapped to FIN-H (Appendix A: 5)

| REQ | Appendix status | REQ-FIN | Now |
|---|---|---|---|
| REQ-MAT-66 | M | 110 | no PR |
| REQ-SURF-129 | P | 110 | no PR |
| REQ-SURF-196 | P | 110 | no PR |
| REQ-QUAL-72 | B | 110 | no PR |
| REQ-QUAL-73 | M | 111 | no PR |

Merged 0 · open-PR 0 · no-PR 5. The partial operator parts of REQ-PLAT-08/-35/-81/-82/-09/-16 and REQ-QUAL-48 are counted under FIN-C and FIN-G.

## Merge problems relevant to FIN-H paths

- `docs/release/decisions/removals/RM-11.json` is edited by 9 open PRs, all with different patches: #180, #184 (RM-01 only), #279, #282, #283, #285, #288, #298, #303. #303 deletes 88 lines and the others make 1-5 line edits, so they will conflict with each other serially. #180 and #279 are already CONFLICTING/DIRTY.
- #180 (PLAT-79) rewrites all RM-01..RM-13. It adds `mergeSha`/`sha`, but every record still says `gh search unavailable`, so it does not satisfy the `consumer-grep --write` operator run. It is CONFLICTING.
- #163 (release/4.x, PLAT-62) adds `docs/release/decisions/operator-codemods-qual.md`. That is a FIN-H-owned glob (`operator-*.md`) written by a FIN-C PR, which breaks ownership, and it's a decision note, not an operator action record.
- #97 and #77 (stale, already ancestors of release/4.x and next) remain open. Per REQ-FIN-113 they have to be closed before RC-1.
- No open PR has any CI check (0 statusCheckRollup), because GitLab pipelines don't run (OD-8).

## Needs a human or the owner

All four REQ-FIN items are human work, and the ODs are owner work. One agent task can start now: the REQ-FIN-110 prerequisites (schema repoint, gen-matrix, template, aggregator, step scripts).
