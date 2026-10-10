# FIN-C — Platform & release leftovers (PRD §5.3) — status 2026-10-10

Refs: origin/next e5a2d6835, origin/release/4.x 645735fce (unchanged), origin/release/4.1.x a19f4bbe1.
REQ-FIN in scope: 16 (REQ-FIN-30..45). Original REQs mapped to FIN-C in Appendix A: 92 (all REQ-PLAT).

## Headline
- 0 REQ-FIN covered by MERGED PRs. The 18 merged PRs (#352-#369, branch names `fin-c-plat-*`) are SURF/FIN-01 work, not §5.3 PLAT work.
- 13 REQ-FIN covered only by OPEN PRs (#127, #128, #129-#199). All 73 FIN-C PRs show 0 status checks (no GitLab pipeline has ever run, GHA deleted), so none meets "green CI before merge".
- 3 REQ-FIN have no PR at all: REQ-FIN-43 (docs app, PLAT-99..105), REQ-FIN-44 (agent DX / MCP, PLAT-106), REQ-FIN-45 (release execution — no v4.1.1/4.2.0/4.3.0 tags, npm latest still 4.1.0). REQ-FIN-40 also lacks PLAT-89.
- Off-PR: 20 commits were pushed directly to release/4.1.x (no PR) carrying the 4x side of PLAT-18/20/22/23/24/25/27/29/31..36/16/55. These are byte-for-subject duplicates of 16 of the 17 commits in open PR #128 (→ release/4.x).

## REQ-FIN table

| REQ-FIN | Original REQs | Status | PRs | Blocker / what's missing |
|---|---|---|---|---|
| 30 Ownership verifier | PLAT-03 | open PR | #127 (next) | #127 CONFLICTING/DIRTY vs next, 0 checks. No line has the `4x11-` prefix rule yet (git grep 4x11 in scripts/ = 0 on all three lines), so the 14 `4x11-plat/*` PRs would fail the ownership gate once CI runs; needs a port to release/4.1.x and release/4.x as well. |
| 31 Publish chain | PLAT-11,12,13,14,15,16,38 | open PR | #127 (next); #128 (PLAT-16 4x) | #127 conflicting; trusted-publisher rows `missing` pending OD-2/OD-10; Node 20/24 matrix not proven green (no pipeline). `tests/release/publish.test.ts` and `docs/release/trusted-publishers.md` are on no line. PLAT-16 4x is on release/4.1.x as direct push 0d3412a30. |
| 32 Change control | PLAT-18,20,21,22,23 | open PR (4x side on 4.1.x via direct push) | #128 (release/4.x), #127 (PLAT-22 next `--all --check`), PLAT-21 via FIN-A #123/#124 | #128 MERGEABLE/CLEAN but 0 checks; duplicates direct commits b486cd112, d2e54fe42, ceed1ab12, b80a2e386, 22b6cf353 on release/4.1.x. OD-14 reviewer rule is owner. Next-side ENTRIES regeneration only in conflicting #127. |
| 33 Deprecations & compat | PLAT-24..30 | open PR (4x partial on 4.1.x) | #127 (next: 24,26,27,28,29,30), #128 (4x: 24,25,27,29) | #127 conflicting. 4x side has no PLAT-26/28/30 work. `tests/deprecations/{gen,verify}.test.ts` and `src/internal/cn.ts` are on no line (next has a cn/clsx change a3382a72e/2b0218938, not the PRD's location+lint rule). |
| 34 Records/notes/runbook/LTS/train | PLAT-31..36 | open PR (4x on 4.1.x via direct push) | #127 (next), #128 (4x) | #127 conflicting; PLAT-33 drill needs a real pipeline URL (none exist); PLAT-35 operator run is FIN-H (REQ-FIN-113); PLAT-31 tag-pipeline step unexercised. |
| 35 4.1.1 trust patch | PLAT-40..50, 52..55 | open PRs | 4.1.x: #129,131,133,135,137,139,141,143,145,147,149,151,153,155; 4.x cherry-picks: #130,132,134,136,138,140,142,144,146,148,150,152,154,156; PLAT-55: #128 + direct commit a19f4bbe1 | All MERGEABLE/CLEAN, 0 checks. PLAT-55: release/4.1.x created from 78fd7bda1 with the 3 CI commits cherry-picked, seed-4.1.1 and patch-scope tests landed; release/4.x is still version 4.1.1 — the 4.2.0-pre.0 bump exists only in #128. Owner: OD-21 GHSA publish before tag; PLAT-52 GitHub Release text edit is operator. 4.x ports differ from 4.1.x originals (#145 +688/-429 vs #146 +285/-122; #143 6 files vs #144 10). |
| 36 4.2/4.3 bridge | PLAT-56..63 | open PRs | #157,#158,#159,#160,#161,#162,#163,#164 (release/4.x) | Mergeable, 0 checks. PLAT-62 v4.3.0 also needs non-empty fragments/codemods on 4.x via FIN-13 sync (#125 open) and `@auraglass/cli@0.x` OIDC publish (not done). PLAT-63 FROZEN only after first green run. |
| 37 5.0 build/types/exports | PLAT-64..73 | open PRs | #165,#166,#167,#168,#169,#170,#171 (clean); #172,#173,#174 (CONFLICTING) | 0 checks. PLAT-67 needs OD-16 contract PR for `css` condition; PLAT-71 needs OD-16 or peer removal; PLAT-72 depends on CMP REQ-FIN-70 / SURF REQ-FIN-80 / REQ-FIN-04 conversions; PLAT-68 needs REQ-FIN-06 (#114 open). |
| 38 CSS/Tailwind/budgets/canaries/tarball | PLAT-74..78 | open PRs | #175,#176,#177,#178 (CONFLICTING), #179 (clean) | #178 stacks on #177 (contains its commit); #174-#178 share 3 files (5-way overlap). Canaries require a pipeline. |
| 39 legacy removal & server | PLAT-79..83 | open PRs | #180 (CONFLICTING, stacks #179), #181, #182, #183, #184 | `legacy/` still 239 files on next. PLAT-81 operator consumer-grep (FIN-H), PLAT-82 owner GHSA + private archive repo (OD-21). #180 and #184 both delete legacy/src/server paths. |
| 40 @auraglass/cli | PLAT-84..92 | open PRs (partial) | #185,#186,#187,#188,#189,#190,#191,#192 | No PR for PLAT-89 (audit-backdrop thresholds/schema/endpoint). PLAT-92 Playwright canary must run remotely. #185-#188/#190 overlap in packages/cli files. |
| 41 TS DX packed d.ts | PLAT-93 | open PR | #193 | Mergeable, 0 checks; needs `.artifacts/pack`. |
| 42 Registry | PLAT-94..98 | open PRs | #194,#195,#196,#197,#198 | Mergeable, 0 checks; PLAT-96 depends on REQ-FIN-09 (#115 open); PLAT-97 render gate needs CI. |
| 43 Docs app/reference/guides/claims | PLAT-99..105 | no PR | — | Nothing: MDX catch-all route + IA, meta-generated reference + tsdoc-coverage, 8 guides + rsc.md, snippet type-check/link checker/docs a11y+lighthouse, quickstart 4-cell verdaccio spec, gen-claims on CI_COMMIT_SHA + lint-claims + README.tmpl, generated migration 5.mdx. (`tests/docs/docs-ia.test.ts`, `docs-content.test.ts` absent on all lines.) #199's "PLAT-100-105" title refers to PLAT-48 sub-rows, not these. |
| 44 Agent DX | PLAT-106 | no PR | — | Generated llms.txt ≤12 KB, llms-full.txt, `@auraglass/mcp` McpServer with 5 tools + zod, mcp-data.json, `packages/mcp/test/tools.test.ts`, `tests/docs/llms.test.ts` — none exist. |
| 45 Release execution | (consumes PLAT-13,31,32,38,55,62, MAT-67, CMP-132, SURF-12) | no PR (operational) | — | Tags only v4.0.0/v4.1.0; npm latest 4.1.0; GitLab project 87152036 has only `main`, 0 pipelines. Needs OD-13/OD-21, first green pipeline (OD-8), then v4.1.1 → v4.2.0 → v4.3.0 → 5.0 alpha. |

## Original REQ counts (92 FIN-C rows)
- Merged via PR: 0.
- Only in open PRs: 83 (PLAT-03, 11-16, 18, 20-36, 38, 40-50, 52-88, 90-98). Of these, 4x-side code for PLAT-16,18,20,22-25,27,29,31-36,55 is already on release/4.1.x by direct push (not via PR, one line only; REQs require both lines).
- No PR: 9 (PLAT-89, PLAT-99..105, PLAT-106).

## Merge problems
1. No CI anywhere: every FIN-C PR has 0 status checks; GitLab mirror has 0 pipelines (OD-8). "MERGEABLE/CLEAN" on GitHub is not "green".
2. Conflicting vs next: #127, #172, #173, #174, #175, #176, #177, #178, #180 (next moved 30 commits since they were cut).
3. Stacked chains: #178 contains #177's commit; #180 contains #179's commit. Merge #177/#179 first or the content double-lands.
4. Heavy file overlap on next: #127↔#174 (12 files); #174-#178 (3 shared files); #127 shares package.json etc. with #165,#168,#172,#174,#177,#178,#192,#193,#194,#196,#198; #170↔#184 and #180↔#184 (legacy server deletion); #185/#186/#187/#188/#190 (packages/cli).
5. Duplicates across lines: open #128 (→ release/4.x) repeats 16 commits already direct-pushed to release/4.1.x (different SHAs, same subjects). When 4.1.x is cherry-picked/merged to 4.x per OD-13 the same changes will double-apply/conflict; one route must be dropped. The direct pushes also bypassed the PR/ownership process.
6. 4x11/4x pairs (#129-#156) are intended twins but several 4.x ports differ in scope (#142 vs #141, #144 vs #143, #146 vs #145, #156 vs #155); verify they are true cherry-picks. #128 also touches files of #132/#144/#152/#163/#164 on release/4.x; #142↔#144 share 6 files.
7. Ownership-gate ordering: `4x11-` prefix rule lives only in #127 (next); release/4.1.x and release/4.x lack it, so the 14 release/4.1.x PRs can't pass the gate until it is ported.
8. #199 (release/4.x only) removes `useGalileoStateSpring`/`useAuraStateSpring` exports on the 4.x line with no release/4.1.x twin and no DEP entry of its own — API removal in a minor; title mislabels PLAT-48/49 sub-rows as "PLAT-100-105".
9. Cross-WP dependencies still open: FIN-13 sync #125 (PLAT-62), FIN-06 #114 (PLAT-68), FIN-09 #115 (PLAT-96), FIN-10 #123/#124 (PLAT-21), FIN-04 #121 (PLAT-26/72).

## Needs human / owner
OD-2/OD-10 trusted publishers; OD-8 GitLab pipeline activation; OD-13 confirmation of release/4.1.x baseline; OD-14 release-owner reviewer; OD-16 contract PR (css condition, d3 peers); OD-21 GHSA publish + private server-archive repo; PLAT-35/81 operator downstream greps (REQ-FIN-113); PLAT-52 GitHub Release text edit; decide fate of direct-pushed release/4.1.x commits vs #128; tag cuts for 4.1.1/4.2.0/4.3.0.
