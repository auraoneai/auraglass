# FIN-B — CI & GitLab activation (PRD §5.2) — status 2026-10-10

Headline: nothing for FIN-B has merged. One open PR (#126, next only, 2 commits, MERGEABLE/CLEAN, 0 status checks, not draft) covers most of the agent work for REQ-FIN-20..26. Nothing exists for release/4.x or release/4.1.x. The owner/CI halves (OD-8 pull mirror, OD-11 settings, first pipelines, activation rows) have not started: GitLab 87152036 still has 0 pipelines.

## REQ-FIN table

| REQ-FIN | Originals | Merged? | Open PR | Why it isn't done / what's left |
|---|---|---|---|---|
| REQ-FIN-20 pipelines for every ref (OD-8) | PLAT-06 | no | #126 (partial) | #126 fixes the glab `pipelines?sha=` fallback and adds W-6 plus the merge-cadence text to branch-policy.md (next only). Still missing: `scripts/release/push-gitlab-refs.mjs` (fallback script) isn't in any PR or on any line; branch-policy isn't updated on release/4.x or 4.1.x; OD-8 (Gurbaksh: PAT plus GitLab pull mirror, then disable mirror-to-gitlab `--prune`) hasn't been done, so AC-FIN-20 can't pass. |
| REQ-FIN-21 root contract gates green on both lines | PLAT-02, PLAT-04 | no | #126 | no-github-ci contract token set, expiring baseline (4 offenders), rule 5 and rule 7, AG_LINE task-graph hook, and rule1-9/gha/activation/taskgraph fixtures. Next only: no 4.x or 4.1.x port, but the AC requires both lines. A clean `contract:ci-fragments OK` also depends on FIN-D REQ-FIN-53 (mat fragment). |
| REQ-FIN-22 fail-closed release gates and activation | PLAT-05, -39, -51 | no | #126 (partial) | Done in #126: require-activated.mjs as the first line of pack, `$CI_COMMIT_TAG → allow_failure:false` on 4 gates, no-gate-bypass.test.ts, and verify-dist-tags manual on every scope writing dist-tags.json. Gaps in #126: only about 7 of about 18 PLAT jobs write `.artifacts/plat/$CI_JOB_NAME_SLUG/`; there's no Base UI latest reporting leg; the 4x `plat:build:docs` still runs `build-storybook`, not `apps/docs/out`; the 4x react19 job script isn't fixed; and none of the §6.1 cross-REQ edits are in (REQ-FIN-09 `npm test -w packages/{cli,registry,mcp,labs}`, REQ-FIN-10 change-class moved to stage `certify` with optional needs, REQ-FIN-26/31..44 wiring). There's no release/4.x or 4.1.x PR. The CI half (activation rows after green) is blocked by OD-8. |
| REQ-FIN-23 first green pipelines and recorded facts | PLAT-08 | no | #126 (records only) | #126 rewrites gitlab-ci-verification.md with 8 rows (multi-ref push FAILED) and a decision-records test for 8 rows. Missing: evidence URLs (there are no pipelines), the OD-11 operator settings in gitlab-project-settings.md (all rows still `missing`), and a first green pipeline URL per line. Needs a human and CI. |
| REQ-FIN-24 stream fragments activated | (integration, no primary row) | no | none | No activation-row PRs, and `ci/plat/activation.json` is `[]`. Blocked: no pipeline has ever run. Stream-fragment PRs #307/#311 (CMP) exist but don't touch activation.json. |
| REQ-FIN-25 governance and forward-port | PLAT-10, PLAT-17 | no | #126 (partial) | Done in #126: no-forward-merge.test.ts rewrite plus fixture repos; branch-policy has the forward-port label rule and "2 business days" (next only). Problem: #126 adds a NEW `scripts/ci/verify-branch-protection.mjs` plus `tests/ci/verify-branch-protection.test.ts`, but the PRD names the existing `scripts/release/verify-branch-protection.mjs` and `tests/release/branch-protection.test.ts`. The old script is left in place, so there are now two scripts. Still missing: `.github/CODEOWNERS` on main (absent; needs a contract PR on main, and none exists), the OD-14 owner decision, a live run exiting 0 for 4 branches, and the 4.x/4.1.x branch-policy update. |
| REQ-FIN-26 GitLab Pages deploys | PLAT-07 | no | #126 (+#183 FIN-C) | #126 adds the relative lab redirect, 'pending' titles, the `public/r` source, `_redirects` copy/placeholder, `pages` needs plat:test:registry (optional), and tests. Gaps: the 4x `plat:build:docs` → `apps/docs/out` change is missing; no 4.x PR exists (the AC is a release/4.x pipeline plus curl 200). #183 (FIN-C, PLAT-83) also edits `scripts/ci/assemble-pages.mjs`, which the PRD forbids, and it conflicts with #126. |

Counts: 7 REQ-FIN items, 0 merged, 6 with only open (partial) PRs, 1 (REQ-FIN-24) with no PR.

## Original REQs mapped to FIN-B (10, per Appendix A / A.6)

PLAT-02, -04, -05, -06, -07, -08, -10, -17, -39, -51 are all still open. None is covered by merged code. All 10 are touched only by open PR #126, and only partially. PLAT-06 and PLAT-08 are mainly owner/human/CI work; PLAT-39 and PLAT-51 need CI. 0 merged, 10 with an open PR, 0 with no PR.

## Merge problems
- #126 is based on 84a3b94f1, 30 commits behind origin/next e5a2d6835. It still merges cleanly with next (git merge-tree, and GitHub reports CLEAN). It has never had CI: the rollup is empty.
- #126 vs #183: content conflict in `scripts/ci/assemble-pages.mjs`. #183 is a FIN-C PR editing a FIN-B-owned file, which goes against the PRD ownership rule (PLAT-83: "this WP never edits that script").
- `ci/plat.gitlab-ci.yml` is FIN-B-owned but is also edited by FIN-C PRs. On next: #127, #169 (also tests/ci/plat-fragment.test.ts), #179, #180, #184, all merge-tree clean against #126. On release/4.x: #128, #132, #144, #163, #164. On release/4.1.x: #131, #143. Per §6.1 these edits should go through FIN-B.
- #126 creates a duplicate verify-branch-protection script under scripts/ci/ next to the existing scripts/release/ one.
- There are no 4.x or 4.1.x counterparts of #126, even though REQ-FIN-21/22/25/26 require both lines, and OD-13 needs FIN-B tooling cherry-picked onto release/4.1.x.

## Needs human
- OD-8: GitHub read-only PAT plus GitLab pull mirror on 87152036 (trigger pipelines on), then disable `mirror-to-gitlab` `--prune` for this repo.
- OD-11: config path, protected tags `v*`, nightly schedules on both lines, Pages public, keep-latest-artifacts.
- OD-14: second reviewer, bot, or documented admin bypass. Also a CODEOWNERS contract PR on main.
- Review and merge #126 (no CI is possible yet), then resolve the conflict with #183.
