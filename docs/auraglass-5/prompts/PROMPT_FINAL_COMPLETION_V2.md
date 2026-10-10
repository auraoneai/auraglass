# PROMPT-FINAL v2 (FIN): every task still open for AuraGlass 4.1.1 → 4.3.0 and 5.0.0 GA — one prompt, one agent

**Purpose.** This prompt lists, in one place, every task that still has to happen to finish AuraGlass 5.0 as of 2026-10-10: what to do with each of the 241 open PRs (239 in #113–#369 plus the stale #77 and #97), every follow-up on the 18 merged PRs (#352–#369), every requirement that has no PR yet, every owner and human action, and the GA checklist. It **supersedes `docs/auraglass-5/prompts/PROMPT_FINAL_COMPLETION.md` for all remaining work**; that file stays as history. The requirements source is unchanged: `docs/auraglass-5/prd/AURAGLASS_5_FINAL_COMPLETION_PRD.md` (**PRD-F**, REQ-FIN-01..113, AC-FIN-01..113 + AC-FIN-GLOBAL, §6 file ownership, §6.1 clause transfers, §17–§20, Appendix A). Where this prompt and PRD-F disagree on a requirement, PRD-F wins; where they disagree on PR handling, this prompt wins (it reflects the PR state PRD-F predates).

Binding inputs (read them; do not inherit verdicts from them):
- Contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** wins over PRD-F and over this prompt. Additive changes only through the one `contract/v1.2-final` PR (PRD-F Appendix C, OD-16, task FIN-463).
- Ledger: `docs/auraglass-5/implementation-audit/fin-open-ledger.json` (572 open original REQs; keys `req,status,evidence,remaining_work,acceptance,needs,key`). Its `remaining_work`/`acceptance` text is binding; a stricter PRD-F §5 bullet wins. Exception: where a ledger row offers "run GitHub Actions" (or any `.github/workflows` job) as an alternative way to get a lane running (3 rows, e.g. REQ-CMP-27), ignore that alternative; the only route is GitLab CI via OD-8 / REQ-FIN-20 (§4 CI rules).
- Tasks: `docs/auraglass-5/tasks/FIN.json` (FIN-001..FIN-483).
- Status of 2026-10-10: `docs/auraglass-5/implementation-audit/FINAL_COMPLETION_STATUS_2026-10-10.md` and `implementation-audit/status-2026-10-10/FIN-{A..H}.md`.
- Repo: GitHub `auraoneai/auraglass` (source of truth). CI: GitLab project 87152036 (`gitlab.com/chahal-foundation-group/github-auraoneai/auraglass`). Planning checkout `/Users/gurbakshchahal/platforms/AuraGlass`. The FIN documents live on branch `auraglass-5-planning`; from a worktree read them with `git show origin/auraglass-5-planning:docs/auraglass-5/<path>`. Lines: `next` (5.0), `release/4.x` (4.2 → 4.4 LTS), `release/4.1.x` (4.1.1 only, OD-13), `main` (frozen until GA).
- PR data: `gh pr view <n> -R auraoneai/auraglass`; REST fallback `gh api repos/auraoneai/auraglass/pulls/<n>` (GraphQL may 502).

---

## 1. Current state (verified 2026-10-10)

| Item | State |
|---|---|
| Refs | `next` e5a2d6835 (30 commits after plan base 84a3b94f1), `release/4.x` 645735fce (unchanged, version 4.1.1), `release/4.1.x` a19f4bbe1 (20 direct-pushed commits on 78fd7bda1, no PR) |
| Tags / npm | only `v4.0.0`, `v4.1.0`; npm `latest` = 4.1.0 |
| CI | GitLab 87152036: **0 pipelines ever**, only branch `main` (the org `mirror-to-gitlab` pushes `main` only and prunes the rest — OD-8). GitHub Actions workflows were deleted on `main` (C0). "MERGEABLE/CLEAN" on GitHub does not mean green |
| PRs since the plan (#113–#369) | 18 merged (#352–#369, all into `next`, 0 checks); 239 open: 198 on `next`, 27 on `release/4.x`, 14 on `release/4.1.x`; 61 CONFLICTING; 0 of 257 has a status check. Plus stale #77, #97 → 241 open in total |
| REQ-FIN (77) | 0 done. 46 have only open-PR work, 31 have no PR |
| Original REQs (572 open in the ledger) | 0 done. 42 SURF REQs have code on `next` without CI (#352–#368); 290 exist only in open PRs; 240 have no PR |
| Per WP (REQ-FIN done / open-PR only / no PR) | FIN-A 0/14/0 · FIN-B 0/6/1 · FIN-C 0/13/3 · FIN-D 0/3/7 · FIN-E 0/7/0 · FIN-F 0/3/8 · FIN-G 0/0/8 · FIN-H 0/0/4 |
| Cross-cutting | ~61 conflicting PRs (most cut from 84a3b94f1); duplicate implementations (LayerStack/portal, exports/entry eligibility, `./forms`, provider self-adoption, DEP-C0028 and DEP-C id collisions, the virtualizer, the 4.1.x direct pushes vs #128); stacked chains #177→#178, #179→#180; #118/#120 contain #113's `ad85c6d04`; many PRs edit other WPs' files |
| Owner / human | No `od-*.md` or `operator-*.md` record exists. Issue #16 open with 0 records. No L14 review, no real-device record |
| GA checklist (§14) | 0 of the 12 PRD-F §18 lines met (and 0 of the 2 added lines) |

---

## 2. How to run this prompt

1. Give **this whole file** to one agent. It owns every remaining task and runs to the end (§14).
2. The eight work packages **FIN-A … FIN-H** (§5–§12) own **disjoint files** (PRD-F §6; a path belongs to exactly one WP) and **none waits on another to start**: a consumer codes against the contract-v1.1 type of a seam and reports dependent tests `pending` through the lane runner until the producer lands (PRD-F §4.3 rule 2); a new cross-stream gate lands green with an expiring baseline (rule 3).
   - If you can spawn subagents: start **all eight WPs at once**, one subagent per WP (FIN-A, FIN-C, FIN-E, FIN-F and FIN-G may fan out one subagent per REQ-FIN or per branch). Give each subagent §3, §4, its own WP section and the FIN.json rows of its `lane`. Collect each final report (format in §4).
   - If you cannot spawn subagents: run the WPs in the order A → B → C → D → E → F → G → H, preparing every PR of a WP before moving on, then loop back over the merge plan as pipelines turn green.
3. **Work starts everywhere at once; PRs MERGE only in the global order of §3.** A PR that is ready early is kept rebased and merges in its slot. Rows in a WP section that describe another WP's PR are informational: the **owning** WP's row plus §3.1 govern.
4. Step 0 (minutes, before any WP): `git fetch origin`; record the SHAs of `origin/next`, `origin/release/4.x`, `origin/release/4.1.x`; if they moved past the §1 values, re-verify every PR row you act on (`gh api repos/auraoneai/auraglass/pulls/<n> --jq '.mergeable,.mergeable_state,.head.sha'`). Confirm the ledger has 572 entries, 0 duplicate `req`, and set-equality with PRD-F Appendix A (`node -e` check). Run `gh issue list -R auraoneai/auraglass --state open` (today: only #16); any new issue is triaged into the WP that owns its files, never ignored. Run `gh pr list -R auraoneai/auraglass --state open --json number` and confirm every open PR appears in §3; a PR not in §3 is triaged by file ownership and added to the owning WP's report.
5. Work only in your own worktrees: `git worktree add ../AuraGlass.wt/fin-<wp>-<topic> -b next-fin/<wp>-<topic> origin/next` (or `-b 4x-fin/<topic> origin/release/4.x`, `-b 4x11-fin/<topic> origin/release/4.1.x`). Never edit, install into, build in or delete shared read-only checkouts such as `/tmp/ag-next` and `/tmp/ag-4x`.
6. **Owner and human items** (§13) are for Gurbaksh, the testers and the design reviewer. The agent prepares runbooks, templates, decision-record drafts, verifiers and aggregators, and checks the records; it **never performs, fabricates, back-fills, signs or "completes" them**, and never performs actions outside the autonomous perimeter (org mirror config, branch-protection writes, npm org/trusted-publisher config, GHSA publication, credential rotation, closing PRs it does not own, creating releases).

---

## 3. Global merge plan (all 241 open PRs, every line)

### 3.0 Gate before any merge

- **No PR merges until pipelines exist** (OD-8, or the REQ-FIN-20 fallback `push-gitlab-refs.mjs --apply` run by the owner) **and** the head SHA's GitLab pipeline is green with the PR's jobs at `allow_failure: false`: `node scripts/ci/gitlab-status.mjs --sha <head>`. Record the job URL in the PR body and in the ledger row.
- Until then every PR is **prepared**: rebased onto the current tip, trimmed, amended, split, and kept merge-ready in its slot. Never merge on faith (PRs #110/#112 and the #352–#369 batch did; do not repeat it), never `--admin`.
- If the owner instead records **OD-8 Option B** ("merge on review, CI acceptance later") in `docs/release/decisions/od-8.md` (FIN-H file, owner-filled), the slot order below still holds, merges are one at a time, and every affected ledger row stays `code-merged-awaiting-ci` — never `done`.
- `workflow:rules` in `.gitlab-ci.yml` today run PR pipelines only for `^next-(plat|mat|cmp|surf|qual)/` and `^4x-(plat|mat|cmp|surf|qual)/`. Every `next-fin/*`, `4x-fin/*`, `4x11-*`, `contract/*` and `sync/*` head gets `when: never`. **FIN-B adds these prefixes in #126** (and in its 4.x/4.1.x ports B3-1/B3-2) — see 3.1 row R1. Until that merges, the only CI evidence for those heads is the post-merge pipeline.
- **After every merge**: rebase the next PR in the slot onto the new tip and regenerate, never hand-merge: `npm run gen:deprecations` (`deprecations.json`, `src/internal/deprecations.generated.ts`, 4.x `src/utils/deprecations.generated.ts`), `node scripts/build/generate-exports.mjs` (`build/exports.manifest.json`), `node scripts/tokens/drift.mjs` (`src/tokens/generated/**`), `npm run api:update` in CI (`etc/api/**`), and every stale `scripts/integration/baselines/*.json` row. Deprecation-file PRs (DEP), CSS-sweep PRs (CSS) and `RM-*.json` edits merge **strictly one at a time**.
- Never force-push a shared branch, never rewrite history (OD-4). A PR that must drop commits is re-cut as a new branch (`<old-branch>-v2` / `-r1`) from the current tip with only the needed commits cherry-picked; the replacement PR cites the old one, and the old one is closed with a link.

### 3.1 Cross-section resolutions (these override the WP sections where they disagree)

The eight WP sections were written in parallel. Where two sections describe the same PR or file differently, the row below is the single decision. The owning WP (PRD-F §6) is named.

| # | Topic | Decision | Owner |
|---|---|---|---|
| R1 | Pipelines on FIN branches (FIN-E rule 5) | #126 also edits `.gitlab-ci.yml` `workflow:rules` to run MR pipelines for `^next-fin/`, `^4x-fin/`, `^4x11-fin/`, `^4x11-(plat|mat|cmp|surf|qual)/`, `^contract/`, `^sync/`; B3-1/B3-2 port it. Add a `tests/ci/plat-fragment.test.ts` case per prefix. | FIN-B |
| R2 | #126 (FIN-G lists "merge as is") | FIN-B row governs: REBASE + TRIM (+R1), then merge. | FIN-B |
| R3 | #115 (FIN-G lists "merge as is") | FIN-A row governs: SPLIT, merge with the S0 contract PR. | FIN-A |
| R4 | #119 (FIN-D lists "merge as is") | FIN-A row governs: TRIM — the `src/theme/preferences/prepaint.ts` hunk moves to FIN-D `next-fin/d-prepaint-continuous`, because `contract:ownership` rejects a `next-fin/a-*` branch editing a FIN-D file. | FIN-A (PR), FIN-D (prepaint) |
| R5 | #155 / #156 (FIN-D lists "merge as is") | FIN-C rows govern: TRIM the `tokens/personas/default.json` font hunk into FIN-D `4x11-fin/d-font-stack` / `4x-fin/d-font-stack`, merged in the same slot. | FIN-C (PR), FIN-D (font hunk) |
| R6 | #190 (FIN-D lists "merge as is") | FIN-C row governs: drop `fragments/codemods/{mat,surf}.ts`; FIN-D re-lands `names:['GlassScript']` in D.3-22 `next-fin/d-codemods`, FIN-F re-lands its surf part. | FIN-C (PR) |
| R7 | RM-*.json hunks in other WPs' PRs (#303, #279, #282, #283, #285, #288, #298, #180, #184) | FIN-E (E-O7) and FIN-C drop every `docs/release/decisions/removals/RM-*.json` hunk from these PRs (ownership gate). FIN-H re-files exactly the name changes FIN-H.1 (b) allows, as `next-fin/h-rm11-<source-pr>` PRs, each merged right after its source PR, in the FIN-H.1 (b) sub-order (#303 → #279/#282/#288 → #283 → #285 → #298 → #180 → #184). The #180 re-file may add only `mergeSha`/`sha`; #184's RM-01 `gate.*` fields stay `missing` until the owner records OD-21. The FIN-H.5 sub-order checkbox is met by these re-filed PRs. OP-3 (`consumer-grep --write`) runs after all of them. | FIN-H |
| R8 | #303 (FIN-H lists "merge as is") | TRIM per FIN-E row 124 (RM-11 hunk → R7; test moved to `tests/foundation/codemod-props.test.ts`). | FIN-E |
| R9 | #184 (FIN-H lists "merge as is") | TRIM per FIN-C: drop `ci/plat.gitlab-ci.yml` (FIN-B) and RM-01 (R7); merge only after OD-21. | FIN-C |
| R10 | #125 content hunks (FIN-D says #125 "brings the 180-row mat.ts") | FIN-A row governs: #125 carries the script and tests only; the 180 DEP-M rows and the DEP-C rows reach `next` only through script-created `sync/fragments-deprecations-<yyyymmdd>` PRs after #125 merges. FIN-D then verifies `git diff origin/release/4.x origin/next -- fragments/deprecations/mat.ts` is empty. | FIN-A |
| R11 | LayerStack ownership (status doc recommended #325 → #249 → #326, reduce #122) | FIN-A decision governs: **#122 is the single owner** of every REQ-FIN-07 FIN-A file; the chain is **#122 → #325 → #249 → #326 → #256**. FIN-E's references to "#325 → #249 → #326" mean this chain. Owner may reverse it in §13 item 21; then only FIN-A S6.2–S6.5 change. | FIN-A |
| R12 | #128 vs the 20 direct pushes on `release/4.1.x` | FIN-C decision governs (OD-13 records it): the direct pushes are canonical on 4.1.x and are never cherry-picked to 4.1.x again; **#128 is the only 4.x route** for the 16 duplicated commits, re-created as `git cherry-pick -x` of the 16 4.1.x SHAs plus cc44c413e. | FIN-C |
| R13 | Order of #124 and #128 on `release/4.x` | #124 merges first (same day as #123 on `next`; PRD-F §20 step 7 says REQ-FIN-10 code merges any time), then #128 rebased on it. FIN-C's "X1 first on 4.x" means first after #124. | FIN-A / FIN-C |
| R14 | #332 position in the CSS sweep | #332 needs #120-v2 (S6). The sweep pauses after #331; #332 → #334 → #324 → #340 continue in S6 right after #120-v2. | FIN-A / FIN-E |
| R15 | #248 and #175 | #248 needs both REQ-FIN-02 (#117) and REQ-FIN-07 (#122/#249), so it merges in S6 after #249; #175 (needs #248/#257) merges in FIN-C N10 after it. | FIN-E / FIN-C |
| R16 | #331 and #275 in the deprecation queue | Both drop their hand-edited generated files and regenerate; they add no DEP rows, so they merge in their own slots (#331 in the S4 sweep, #275 in the Toast chain) with `gen:deprecations` after the merge, not in the DEP queue. | FIN-E |
| R17 | FIN-F prerequisite "#113 merged" | Read as "the REQ-FIN-01 remainder PR `next-fin/a-token-build-rest` merged" (#113 is closed, 3.2). | FIN-F |
| R18 | FIN-F `docs/release/decisions/OD-17.md` / `OD-20.md` | Those paths are FIN-H's (`od-*.md`, lowercase). FIN-F hands the decision-request text and evidence to FIN-H, which writes `od-17.md` / `od-20.md` in H3-5. | FIN-H |
| R19 | `docs/release/decisions/od-15-virtualizer.md` (FIN-E E-O3) | FIN-H writes it as `od-15.md` from FIN-E's text. | FIN-H |
| R20 | 9 CMP PRs mapped to FIN-A REQs (#203, #247, #249, #280, #323, #325, #326, #332, #336) | Listed and handled only in FIN-A (§5). FIN-E names them only as gates. #256 is FIN-E's. | FIN-A |
| R21 | `src/compat/mat/` | It already exists on `next`; only `src/compat/mat/theme.ts` is missing (FIN-D). | FIN-D |
| R22 | `scripts/tokens/validate.mjs` `'ag-rendered'` change (carried by six PRs) | Lands once in FIN-D `next-fin/d-validate-rendered` (D.3-01), which merges before FIN-A's S1. Every other PR drops its copy. | FIN-D |
| R23 | `ci/mat.gitlab-ci.yml` hunks in #178/#179/#180 | Dropped (they contain `|| true` fail-opens); FIN-D lands the correct edit in D.3-02 `next-fin/d-ci-fragment`. | FIN-D |
| R24 | `tests/showcase/**` (not in PRD-F §6) | Claimed by FIN-G (contract row F07); FIN-C adds it to the REQ-FIN-30 ownership fixture. | FIN-G / FIN-C |

| R25 | `scripts/integration/baselines/no-github-ci.json` (FIN-B says "FIN-A's baseline PR (FIN-464)") | FIN-464 is the *last* baselines-to-empty sweep. The file is created earlier by a small FIN-A PR `next-fin/a-baseline-no-github-ci` with the rows #126 hands over (4 rows, plus `docs/ai/security-guide.md` if FIN-C has not reworded it), each `expires: RC-1`; it merges in N-0 right before #126. | FIN-A |
| R26 | FIN-G G-02 vs #338/#320 test files | #338 and #320 drop `tests/contract/**`; G-02 re-lands them (stricter). REQ-SURF-01 / REQ-CMP-06 acceptance is evaluated after both merge. | FIN-G |

### 3.2 Closes (first, before any rebase)

| PR | Line | Close because | Survivor | Who closes |
|---|---|---|---|---|
| #77 | `next` stack (head bfc216d0a) | stale stacked PR already contained in `next` via 366ff2023 | `origin/next` | operator (OP-6, §13) |
| #97 | 4.x stack (head d5d950b59) | stale stacked PR already contained in `release/4.x` via 645735fce | `origin/release/4.x` | operator (OP-6, §13) |
| #113 | `next` | cherry-picked by merged #369 | #369 + `next-fin/a-token-build-rest` (S1) | FIN-A agent, after the remainder PR is open (owner approves PR closes it did not author) |
| #280 | `next` | seed strip done by #369; gate is #114 | #369, #114 | FIN-A |
| #228 | `release/4.x` | identical DEP-C0028 row in #313 | #313 | FIN-E |
| #118, #120 | `next` | contain #113's `ad85c6d04` | `next-fin/a-compiler-v2`, `next-fin/a-tokenseam-v2` (closed when the v2 PR opens) | FIN-A |
| #127, #173 | `next` | SPLIT | the split PRs (FIN-C.1) — close only after they are open | FIN-C |
| any PR re-cut as `-r1`/`-v2` | any | replaced (FIN-C per-PR procedure, FIN-A `-v2` rule) | the replacement PR | owning WP |

### 3.3 `next` merge order (198 PRs + new no-PR branches)

Stages follow PRD-F §20. Inside a stage, merge in the listed order, one PR at a time, rebasing and regenerating between merges (3.0). New no-PR branches are shown in `code` without a number; they are defined in their WP sections. A stage may begin once its gate PRs have merged, even if a later PR of the previous stage is still waiting on an owner decision.

**N-0 — CI plumbing and early gates (any time once pipelines exist)**
1. `next-fin/a-baseline-no-github-ci` (R25) → **#126** (FIN-B, rebased + trimmed + R1) → `next-fin/b-push-gitlab-refs` (B3-3) → `next-fin/b-artifacts` (B3-4) → `next-fin/b-plat-defects` (B3-5).
2. FIN-E P0, in order: **#315 → #311** (`ci/cmp.gitlab-ci.yml` chain), **#307** (amended) **→ #301**, **#306**, **#305** (trimmed).
3. FIN-D D.3-01 `next-fin/d-validate-rendered` (R22), D.3-02 `next-fin/d-ci-fragment`, D.2-01 `next-fin/d-seed-evidence`.
4. FIN-H prep H3-5 `next-fin/h-od-drafts`, H3-6 `next-fin/h-operator-runbooks`, H3-7 `next-fin/h-cert-skeletons` (any time).
5. FIN-G G-01 `next-fin/g-qa-package` → G-02 → G-03 (FIN-G merge order, FIN-G.3) as soon as green; the rest of FIN-G follows its own order alongside the stages below.

**S0 — contract bundle (after OD-16 is recorded)**: `contract/v1.2-final` (FIN-463: C-1..C-17, C-4 `jest.config.js` mapper + #369 prettier ratification, C-16 SrRecord schema). C-10 `.github/CODEOWNERS` is a separate contract PR on `main` with FIN-B's B3-15 content. Rejected items use their listed fallbacks; nothing below waits on S0 except where a row says so.

**S1 — REQ-FIN-01 token build**: the FIN-D PR that moves `scripts/tokens/persona-map.mjs` to a 4.x-only path → `next-fin/a-token-build-rest` → **#165** (prettier pin) → `next-fin/c-ownership` (from #127) → `next-fin/c-publish`, `next-fin/c-change-control`, `next-fin/c-records` (from #127) → **#166**, **#167**, **#171**.

**S2 — REQ-FIN-06 entry eligibility**: **#114** (+ FIN-A.3 #6 root-exports test) → **#336** (trimmed) → `next-fin/a-exports-plat67` → **#168** → **#169** (+ `next-fin/b-wire-plat68`) → **#170** → **#172** → **#174** → FIN-F **#343**, **#344**, **#345**, **#338**, **#339** (packed-export tests now meaningful) → **#346**.

**S3 — REQ-FIN-09/08 resolution and discovery**: **#115** (split; with S0 C-4 or its per-stream-config fallback) → `next-fin/c-workspace-test-scripts`, `next-fin/f-labs-test-script` → `next-fin/b-wire-cli` (B3-7) → **#191** (trimmed) → **#196** → **#304** (trimmed). Expect newly red tests; they are fixed by their owners, never skipped.

**S4 — REQ-FIN-14/05 CSS layering, then the first CSS sweeps (CSS, strictly serial)**: **#116** → **#323** → **#322** → **#308** → **#331** (R16). The sweep pauses here for #332 (R14).

**S5 — REQ-FIN-02 then 03**: **#117** (with the hand-off hunks from #247, #248, #251, #254, #257, #265) → **#247** → **#203** → `next-fin/a-compiler-v2` (replaces #118) → **#257**. FIN-D `next-fin/d-wcag-shared` with or right after the compiler PR.

**S6 — REQ-FIN-04 / 07 / 11 / 12**: **#121** → **#122** → **#325** → **#249** → **#326** → **#256** → **#248** (R15) → **#250** → `next-fin/a-tokenseam-v2` (replaces #120) → **#214** (transfer, merged by FIN-A) → **#215** → CSS sweep resumes: **#332** → **#334** → **#324** → **#340** (FIN-F, first SURF CSS) → **#119** (trimmed) + `next-fin/d-prepaint-continuous` (R4) + `next-fin/a-portal-root-attrs` (if not folded into #119) → FIN-E foundation overlays **#317**, **#333**.

**S7 — REQ-FIN-10 / 13 and the deprecation queue**: **#123** (same day as #124 on 4.x, 3.5) → **#125** (trimmed, R10) → *(on 4.x: #313, see 3.5)* → first script-created `sync/fragments-deprecations-<yyyymmdd>` PR → **#314** (reduced to its test). DEP queue, strictly one at a time with `gen:deprecations` between: **#303** (trimmed per R8; it goes first because it is the first RM-11 source in the FIN-H sub-order) **→ #279 → #282 → #283 → #285 → #288 → #298 → #302 → #320** (each trimmed of DEP rows/RM hunks per FIN-E; FIN-H `next-fin/h-rm11-*` re-files per R7 after their source PRs) → `next-fin/c-deprecations` (from #127) → FIN-D `next-fin/d-deprecations-5x` (D.3-22b) → FIN-F `next-fin/f-*` deprecation PRs.

**N-E — remaining FIN-E (CMP) PRs** (after S4–S7 for anything touching the same files; same-file chains rebase on their predecessor; FIN-E.1 rows give the per-PR action):
1. P5 hand-off PRs: **#251**, **#254**, **#265 → #266**.
2. REQ-FIN-70: **#316**, **#318**, **#319**, **#321**, **#327**, **#328**, **#329**, **#330**, **#335**.
3. REQ-FIN-71: **#200** (reduced to its tests). (#281 is FIN-F's, N-F.)
4. REQ-FIN-72: **#201**, **#202**, **#204**, **#205**, **#206**, **#207**, **#208**, **#209**, **#212**, then **#210 → #211 → #213**.
5. REQ-FIN-73: **#220 → #222 → #223**; **#238 → #239** (amended) **→ #240 → #241 → #242** (only after OD-15) **→ #243 → #337**; **#227**; **#244 → #245 → #246**; **#224**, **#225**; **#234 → #235 → #236 → #237** (after #254); **#232 → #233**; **#217 → #218 → #219 → #221**; **#216**; **#229 → #230 → #231**. (#214/#215 merged in S6; #226 is FIN-F's.)
6. REQ-FIN-74: **#252**, **#253** (amended), **#255**, **#258**, **#259**; **#270 → #271 → #272 → #273**; **#260 → #261 → #262 → #263 → #264**; **#274 → #275** (amended, R16) **→ #276 → #277** (amended) **→ #278**; **#267 → #268 → #269**.
7. REQ-FIN-75: **#284**, **#286**, **#287**, **#289**, **#290**, **#291**, **#292**, **#293** (amended), **#294**, **#295**, **#296**, **#297**, **#299** (after #279), **#300**.
8. REQ-FIN-76: **#312** (split; after #303 and #311), **#309** (trimmed), FIN-E E.3 branches (`tests/types/cmp-contract.test-d.ts`, CMP-27 stacked Escape, `chip.apg.spec.ts:24` rewrite), and **#310 last** (regenerates `etc/api/{primitives,icons,forms,root.cmp,compat.cmp}.*`).

**N-C — remaining FIN-C (PLAT) PRs on `next`** (FIN-C.1 slots N9–N13; FIN-B wiring PR right after each producer):
1. N10 (CSS, after #116, #117, #167, #248, #257): **#175 → #176 → #177 → #178** (stacked; drop #177's commit; budget raise held for the owner) **→ #179** (+ `next-fin/b-wire-plat78`).
2. N11: `next-fin/c-*` split of **#173** plus the owners' conversion PRs (FIN-A/E/F, each in its own slot) → close #173.
3. N12: **#180** (stacked on #179; + `next-fin/b-wire-plat79`, then FIN-H `next-fin/h-rm11-180` per R7) **→ #181 → #182 → #183** (after #126) **→ #184** (only after OD-21; + `next-fin/b-wire-plat82`, FIN-H re-file per R7).
4. N13 (CLI, one at a time, each rebased on the previous): **#185 → #186 → #187 → #188 → #189 → #190** (R6) **→ #192 → #193 → #194 → #195 → #197 → #198**. Then `next-fin/b-wire-fin31` after `next-fin/c-publish`; B3-8/B3-9/B3-10 after their FIN-C producers.
5. FIN-C.3 no-PR branches (docs app REQ-FIN-43, agent DX REQ-FIN-44, audit-backdrop PLAT-89, remaining `legacy/` deletions C.3-13, …) in the FIN-C.3 order.

**N-F — remaining FIN-F (SURF) PRs** (after S1, S2 and S6's #340):
1. **#341** (only after OD-17), **#342** (after #344), **#281** (transfer from FIN-E), **#226** (transfer from FIN-E).
2. SURF CSS chain (CSS, strictly serial; app-shell order confirmed by the owner, §13): **#347 → #348 → #349** (after #342) **→ #350** (trimmed) **→ #351** (after #342 and #350; Mod+B via React `onKeyDown`).
3. FIN-F.2 follow-ups on #352–#368 and the 43 FIN-F.3 branches plus the pending-spec sweep, in FIN-F.3 order.

**N-D, N-G, N-H — new-branch work** (no open PR): FIN-D.3 (D.3-01..D.3-40, D.3-22b) in the FIN-D.3 order; FIN-G.3 G-01..G-27 in the FIN-G order (G-16 verdict last); FIN-H H3-1 (after S0 C-16, or its fallback once OD-16 is recorded) → H3-2 → H3-3 → H3-4.

**Last on `next` before RC-1**: `next-fin/a-baselines-zero` (FIN-464: every `scripts/integration/baselines/*.json` is `[]`), then the RC tag pipeline, then the human passes (§13).

### 3.4 `release/4.1.x` merge order (14 PRs) and v4.1.1

Each 4.1.x merge is followed **the same day** by its 4.x twin (3.5) as `git cherry-pick -x <4.1.x merge commit>`; a twin merges as-is only if `git range-diff` shows no content difference beyond context, else it is re-cut and the old twin closed.
1. P0: `4x11-fin/c-ownership` (FIN-C C.3-1, the `4x11-` prefix rule) → `4x11-fin/b-ci` (B3-2, port of #126 + R1, and the `plat:tag:release-ledger` evidence fix for the direct pushes) → `4x11-fin/b-push-gitlab-refs`, `4x11-fin/b-artifacts`, `4x11-fin/b-plat-defects`.
2. DEP: **#129 → #133 → #135**.
3. **#131** (trimmed; + `4x11-fin/b-wire-plat41`), **#137**, **#139**.
4. **#141 → #143** (trimmed; + `4x11-fin/b-react19`).
5. **#145**, **#147**, **#149**, **#151**, **#153**.
6. **#155** (trimmed, R5; + `4x11-fin/d-font-stack`).
7. FIN-C.2 follow-ups `4x11-fin/c-direct-push-record`, `4x11-fin/c-deprecations-4x`, PLAT-31/33/55/16 evidence; `4x11-fin/c-plat48-consent` (#199's twin, C.3-14); `4x11-fin/b-wire-411` (B3-11); activation rows.
8. **v4.1.1** tag on `release/4.1.x` by the owner, only after OD-13, OD-21 (GHSA published first), OD-10/OD-2 and a green 4.1.x pipeline with every required job at `allow_failure: false`.

### 3.5 `release/4.x` merge order (27 PRs) and v4.2.0 / v4.3.0

1. X0: `4x-fin/c-ownership` → `4x-fin/b-ci` (B3-1, + R1) → `4x-fin/b-push-gitlab-refs`, `4x-fin/b-artifacts`, `4x-fin/b-plat-defects`.
2. **#124** (same day as #123 on `next`, R13) → **#128** (re-created per R12; + `4x-fin/b-wire-fin32`).
3. Twins, each the same day as its 4.1.x original: **#130 → #134 → #136** (DEP, with #129/#133/#135), **#132** (+ `4x-fin/b-wire-plat41`), **#138**, **#140**, **#142** (range-diff), **#144** (re-cherry-picked after #142; + `4x-fin/b-react19`), **#146** (re-cherry-picked), **#148**, **#150**, **#152** (after #128), **#154**, **#156** (trimmed, R5; + `4x-fin/d-font-stack`).
4. 4.2/4.3 bridge: **#157** (DEP; after #124 and #136) → **#158** → **#159** (DEP) → **#160** → **#161** → **#162** → **#163** (trimmed; + `4x-fin/b-wire-plat62`) → **#164** (trimmed; + `4x-fin/b-wire-plat63`).
5. **#199** (restored exports + DEP-P entry; after #156 and #159) → **#313** (amended, re-homed to `4x-cmp/e-deprecations`; after `next` #125) → `4x-fin/a-fragsync` (FIN-A.3 #4) → `4x-fin/f-deprecations` (FIN-F SURF-12) → FIN-D `4x-fin/d-bridge` and the 4.x D.3 rows → the remaining `4x-fin/b-*` wiring (B3-6, B3-11 twin, B3-12) → B3-13 records → B3-14 activation rows.
6. **v4.2.0** tag by the owner (downstream grep OP-2 first). **v4.3.0** after the codemods sync carries FIN-D D.3-22 (PR #28's content, redone on `next`) and REQ-FIN-13 to 4.x.

### 3.6 Coverage of the open-PR list

Every one of the 241 open PRs on 2026-10-10 appears in 3.2–3.5 exactly once as a merge or close action:
- closes: #77, #97, #113, #228, #280 (plus #118, #120, #127, #173 closed after their replacements open);
- `next` (198 incl. those above on `next`): N-0, S1–S7, N-E, N-C, N-F;
- `release/4.1.x` (14): 3.4; `release/4.x` (27): 3.5.

At Step 0 and before RC-1, re-run `gh pr list --state open` and diff against this list; a PR missing here is triaged by file ownership (PRD-F §6) and slotted by the owning WP.

---

## 4. Common rules (binding on every WP and subagent)

**Contract and scope**
- contract-v1.1 is binding. A fix that needs a frozen seam change goes only into the `contract/v1.2-final` PR (FIN-463, Appendix C C-1..C-17) and is never made silently in a WP PR. Until OD-16 approves an item, use that item's listed fallback. `jest.config.js` and `src/contracts/**` change only through the contract PR.
- Implement each original REQ from its full text in its stream PRD plus the ledger row; PRD-F §5 bullets summarise the remaining work and are not a licence to drop clauses. Touch only your WP's files (PRD-F §6). A clause in another WP's file is that WP's work (§6.1 clause transfers): drop the hunk, hand the ledger text to the owner, and evaluate the requesting REQ's acceptance after both PRs merge. Never merge a hunk in a foreign file "because it was already written".
- Kiro Prism is the LLM default (policy §4): REQ-FIN-88's `ai-workspace` route reads `PRISM_*` env; no direct provider SDK unless Prism cannot meet a requirement (state why).

**Branches, commits, PRs**
- Branch model: `next-fin/<wp>-<topic>` → `next`; `4x-fin/<topic>` → `release/4.x`; `4x11-fin/<topic>` → `release/4.1.x` (OD-13; cherry-pick the same commit to `release/4.x` the same day via `4x-fin/<topic>`); `contract/v1.2-final` for the contract bundle; `sync/fragments-<kind>-<yyyymmdd>` only through `scripts/release/sync-fragments.mjs`. Existing PR branches keep their names; push follow-up commits, never force-push.
- `contract:ownership` must accept these prefixes: REQ-FIN-30 (FIN-C, `scripts/ci/verify-ownership.mjs`) maps `next-fin/<wp>-*` to that WP's §6 path set and `4x-fin/*`, `4x11-fin/*`, `4x11-<stream>/*` to the 4x zone rule, with fixture cases; FIN-463 adds the same rule to `contracts/ownership.json`. Until both land, ownership failures on FIN branches are expected and recorded, never bypassed.
- One PR per coherent topic (one REQ-FIN or one original REQ where practical), opened with `gh pr create`. PR body: REQ-FIN id, original REQ ids, FIN task ids, the old PR it replaces (if any), tests run (where: local narrow / GitLab job URL), visual-evidence artifact URLs, remaining `pending` items, `deviations`. Conventional commit subjects; end commits with the attribution trailer the session requires.
- **Merge only when the head SHA's GitLab pipeline is green** (`node scripts/ci/gitlab-status.mjs --sha <sha>`) with the PR's jobs at `allow_failure: false`, the job URL recorded, and in the §3 slot. **Until OD-8 is done, PRs may be prepared and rebased but NOT merged** (or merged under a recorded OD-8 Option B, 3.0). Never `--admin`, never rewrite history (OD-4).

**CI and execution location**
- GitLab CI only. No GitHub Actions jobs, no `GITHUB_*` variables, no `secrets.` (REQ-FIN-21). Agents never push to the GitLab mirror and never edit or re-enable `.github/workflows/mirror-to-gitlab.yml`.
- Browser, visual, perf, Storybook builds, Playwright, `npm pack` matrices, canaries, device lanes and full builds run **only** in GitLab CI or the gated remote runner (skill `auraone-remote-run`), never on this Mac; no local Docker ever. Local runs are limited to narrow Jest/node unit tests, `tsc` on a small config and lint of changed files; a lane invoked locally must exit 2 with the remote command (PRD-F §12 rule 6).
- Use existing authenticated tools only (`gh`, `glab`, the governed AWS wrapper); never run login/logout/refresh/setup, never print or copy credentials.

**Prohibited completion shortcuts (any one voids the WP's report)**
- Fake, mock, stub or placeholder implementations presented as done; hand-written component doubles once the owner has landed; `TODO`/`PENDING` bodies; placeholder files such as `pending.txt` standing in for fixtures.
- Skipped tests: `.only`/`.skip`/`test.fixme`, early `return` or `console.warn('pending')`, conditional assertions (`if (await …)`, `<= before`, `Math.max(1, …)`), source-text greps standing in for behaviour, `expect([]).toEqual([])`-style vacuous assertions. Allowed `pending` states are reported by the lane runner only.
- Lowered thresholds, loosened budgets, widened tolerances, new allowlist entries, raised ratchets or extended baseline `expires` to get green (a budget raise needs a measured tool artifact, the `Perf-Budget-Raise:` trailer and owner approval).
- Updating snapshots or visual baselines to make a failing test pass; baselines are produced only by `qual:certify:baseline-refresh` in `AG_PLAYWRIGHT_IMAGE` and reviewed.
- Leaving `allow_failure: true` on a job after its first green run (the flip is an `ci/plat/activation.json` row from a green pipeline); `|| true` / `|| echo PENDING` / `2>/dev/null || true` fail-opens; `--no-verify`.
- Hand-authored "measured" data: contrast numbers, perf timings, sizes (`docs/size-budgets.json`), pipeline URLs, scene stats, calibration, device results, generated files (`deprecations.json`, `*.generated.ts`, `etc/api/**`, `exports.manifest.json`, `src/tokens/generated/**`). Every number and generated file is written by the tool, with its artifact URL.
- Marking human review, SR/touch passes, L14 scores, real-device sign-off, owner decisions or operator actions as done; editing `tests/a11y/manual/records/**`, `certification/review/records/**`, `docs/certification/real-device-matrix.md`, `od-*.md` decision fields, `operator-*.md` performed fields or `RM-*.json` status/acknowledgement with anything but tester/owner/operator-produced content.
- Marking a ledger row `done` without a green `allow_failure: false` job URL on the target line (PRD-F §1.1).

**Done** = every clause implemented, named tests real and passing, run green in an activated GitLab job on the target line with the URL recorded in the ledger row, and any human evidence committed as a schema-valid record bound to the release SHA.

**Final report format (every WP and subagent returns exactly this, as JSON; WP sections may add fields)**

```json
{
  "wp": "FIN-X",
  "refs": { "next": "<sha at start>", "release/4.x": "<sha>", "release/4.1.x": "<sha>" },
  "prs": [{ "url": "", "number": 0, "replaces": "<#n|null>", "branch": "", "base": "", "action": "merge|rebase|trim|split|amend|transfer|close", "reqFin": [], "reqs": [], "tasks": ["FIN-NNN"], "headSha": "", "pipelineUrl": "<url|null>", "state": "open|merged|closed", "slot": "<§3 stage>" }],
  "reqFin": [{ "id": "REQ-FIN-NN", "ac": "AC-FIN-NN", "status": "done|code-merged-awaiting-ci|in-review|pending-producer|blocked-owner|blocked-human", "evidence": ["job/artifact URLs"], "pendingOn": "<seam or OD id|null>" }],
  "ledgerRowsDone": ["REQ-..."], "ledgerRowsOpen": [{ "req": "", "why": "" }],
  "activationRows": [{ "job": "", "line": "", "pipelineUrl": "", "date": "" }],
  "baselineRowsRemoved": [{ "gate": "", "file": "" }],
  "visualEvidence": [{ "subject": "", "artifactUrl": "", "job": "" }],
  "handOffs": [{ "fromPr": "", "file": "", "toWp": "", "toPr": "" }],
  "ownerOrHumanActionsNeeded": [{ "id": "OD-NN|REQ-FIN-11x|OP-n", "exactAction": "", "blocks": [] }],
  "deviations": [{ "rule": "", "what": "", "why": "" }]
}
```

`status: done` is allowed only with a green `allow_failure: false` job URL on the target line in `evidence`.

---

## 5. WP FIN-A — Integration breakages (PRD-F §5.1, REQ-FIN-01..14, FIN-463, FIN-464)

State re-verified 2026-10-10 with `gh api repos/auraoneai/auraglass/pulls/<n>` against `origin/next` e5a2d6835, `origin/release/4.x` 645735fce, `origin/release/4.1.x` a19f4bbe1. 0 of 14 REQ-FIN and 0 of 40 mapped original REQs are `done`. Only merged #369 landed parts of REQ-FIN-01 (legacy `$schema` split, vendored `tokens/legacy/4x-primitives.css` + `4x-reader-set.json`, a single compat writer + `.dark` block, prettier throwing, `scripts/tokens/drift.mjs`), the stale seed-marker strip (CMP-29), and the provider portal-root self-adoption fix. 22 open PRs map to FIN-A REQs: 13 FIN-A PRs (#113–#125) and 9 CMP-branch PRs whose REQ maps to a FIN-A REQ-FIN (#203, #247, #249, #280, #323, #325, #326, #332, #336). This section is the only place those 9 are listed. FIN-E lists only CMP PRs whose REQ maps to REQ-FIN-70..76 (#256, CMP-88, is FIN-E's). None of the 22 has any CI status. GitLab project 87152036 has 0 pipelines. Until OD-8 / REQ-FIN-20 gives pipelines, no PR merges (common rules). Prepare, rebase and review each one in its slot.

Rules specific to FIN-A (in addition to the common rules):
- Ownership comes from PRD-F §6, row FIN-A, exactly. When a PR from any branch edits a file outside its WP, that hunk is removed and re-filed by the file's owner. It is never merged "because it was already written". Hunks in FIN-A files that sit in CMP-branch PRs are folded into the FIN-A survivor PR named below.
- Regenerate after every merge: `npm run gen:deprecations`, `node scripts/build/generate-exports.mjs`, `npm run tokens:build` (via `node scripts/tokens/drift.mjs`), and every `scripts/integration/baselines/*.json` that the merge made stale. Merge deprecation-file PRs and CSS-sweep PRs strictly one at a time, rebasing onto the new `next` tip and regenerating between merges.
- Never rewrite a shared branch. Where a PR has to drop commits (#118, #120 contain #113's `ad85c6d04`), push a new branch `next-fin/a-<topic>-v2` cut from the current `next`, cherry-pick only the commits that are still needed, open a replacement PR that cites the old one, and close the old PR with a link. Never force-push.
- Local runs are limited to narrow Jest/node tests. Browser, visual, Playwright, `npm pack` and full builds run in GitLab CI or through skill `auraone-remote-run`.

### FIN-A.1 Land existing open PRs

Merge slots follow PRD-F §20: S0 contract → S1 REQ-FIN-01 → S2 06 → S3 09+08 → S4 14+05 (then the CSS sweeps one at a time) → S5 02 then 03 → S6 04 / 07 / 11 / 12 → S7 10 / 13 (then the deprecation PRs one at a time). Within a slot, merge in the order of the numbers shown (e.g. S5.1 before S5.2). "State" is GitHub's mergeable state on 2026-10-10. CLEAN does not mean green.

| Slot | PR | Line / branch | REQ-FIN · original REQs | State | Action | Exact conflict / gap to fix |
|---|---|---|---|---|---|---|
| S1 | #113 | next · `next-fin/a-token-build` @ad85c6d04 | 01 · MAT-01, -03, -13, -21 | DIRTY | CLOSE as superseded. Survivors: #369 (merged) plus the new remainder PR `next-fin/a-token-build-rest` (FIN-A.2 #1) | #369 cherry-picked most of it. Close with a link to #369 and to the remainder PR. #118 and #120 must stop depending on `ad85c6d04` (see their rows). |
| S2.1 | #114 | next · `next-fin/a-exports` | 06 · CMP-23, CMP-29 (gate part) | DIRTY | REBASE+RESOLVE, then merge | 1) Rebase onto `next`. Resolve `scripts/build/lib/graph.mjs`, `generate-exports.mjs` and `package.json` against #369 (which added `.` and stripped seed markers). 2) Keep the line-1 rule `/^\/[*\/] @ag-contract-seed:/`. `--check` must print each excluded entry with its seed file, its owner from `contracts/ownership.json`, and the REQ-FIN that removes the seed (52 for `src/theme/{createGlassTheme,public}.ts`, 58 for `src/motion/public.ts`), and exit 1 only on a stale exclusion. 3) Top-level `"types"`. Drop `./charts` (`ga:'5.1'` entries on 5.0.x). 4) `build/exports.manifest.json` is FIN-C's: keep it only as the regenerated output of `generate-exports.mjs` with no hand edits, and record it in `deviations[]`. 5) Add the CMP-29 tarball case (FIN-A.3 #6). 6) Add the absorbed `package.json#exports` hunk from #336 (`./forms`, `./icons/*` pattern, `./primitives`) as regenerator output. |
| S2.2 | #336 | next · `next-fin/cmp-23-barrels` | 06 · CMP-23 | DIRTY | REBASE+RESOLVE + TRIM, after #114 | Remove the `package.json` hunk (owned by REQ-FIN-06, folded into #114) and the `scripts/build/api-report.mjs` hunk (FIN-C: hand it to FIN-C as a `next-fin/c-api-report-entries` PR). Keep `src/root/cmp.ts` trim (ProgressRing → `Progress appearance='ring'`, `SheetHandle` → `Sheet.Handle`, drop `useSheetDetents`/`resolveDetent`), the `src/forms/**` reconcile with the `./forms` that is already on `next` (no second implementation), `etc/api/{root.cmp,primitives,icons,forms,compat.cmp}.*` regenerated by `npm run api:update`, `tests/foundation/barrels.test.ts` and `tests/controls/forms.test.tsx`. FIN-C's #168 (PLAT-67) rebases after this PR. |
| — | #280 | next · `next-fin/cmp-29-exports` | 06 · CMP-29 | DIRTY | CLOSE as duplicate. Survivors: #369 (seed strip, `.`/`./primitives` emitted) and #114 (gate) | It edits `src/theme/createGlassTheme.ts` (FIN-D, REQ-FIN-52) and `tests/exports/**` (FIN-C). Its tarball assertion moves to FIN-A.3 #6. |
| S3 | #115 | next · `next-fin/a-resolution` | 09 + 08 · QUAL-69 (09 unblocks PLAT-84..91, CMP-134, SURF-14/170..178, MAT-67) | CLEAN | SPLIT, then merge together with the contract PR (S0) | 1) Remove the `packages/{mcp,registry}/{package.json,jest.config.mjs}` hunks (FIN-C: PR `next-fin/c-workspace-test-scripts`) and the `packages/labs/**` hunks (FIN-F, contract F02: PR `next-fin/f-labs-test-script`). Each owner adds the `test` script so that `npm test -w packages/<name>` runs. 2) The `aura-glass` mapper is not in this PR and cannot be: it goes in `jest.config.js` through `contract/v1.2-final` C-4 (FIN-A.3 #1). If OD-16 rejects C-4, the fallback is per-stream Jest configs registered as lanes. 3) `listSubjects()` throws when neither `storybook-static/cert-manifest.json` nor the index is reachable. The owner comes from `contracts/ownership.json` by story path. 4) `perf.bci` delegates to `packages/qa/src/perf/bci.ts` once FIN-G lands it. Until then the inline fallback is reported `pending` by the lane runner, never swallowed. 5) Deleting `tests/capability/jest.doubles.cjs`: tell FIN-F that `ci/surf.gitlab-ci.yml:115-118` must stop expecting `tests/<area>/jest.doubles.cjs` (FIN-F file). 6) Fixture discovery must cover `fragments/codemods/{plat,mat,cmp,surf}/fixtures/<id>/<case>/` and `packages/cli/src/migrate/4to5/__fixtures__/` (≥120 cases). Today 79 cases are pending. FIN-C's #191 and FIN-E's #304 rebase after this PR (shared `pending.txt` fixtures). |
| S4.1 | #116 | next · `next-fin/a-css` | 14 + 05 · MAT-19, CMP-09 (14); MAT-54, -61, -62, -63 (05) | DIRTY | REBASE+RESOLVE, then merge | 1) Resolve `fragments/css/{mat,cmp,surf}.ts` against `next`. This PR is the single editor of those three files: #323 and #340 drop their hunks in them. 2) The scroll-padding selector must be `[data-ag-scroll-container]`, not `[data-ag-scroll-locked]` (AC-FIN-05, MAT-63). 3) Create `src/a11y/css/layers.css` (`@layer ag.a11y`, `[data-ag-layer-root=overlay|transient|toast]{position:relative;z-index:var(--ag-z-overlay|transient|toast)}`), register it, and check that `--ag-z-*` exist in the token build (MAT-56 clause). 4) `rungs.css` reads `--_ag-on-surface-max`, `--_ag-border-strong` and `--_ag-fallback-fill`, which only #118 emits. Either list them in the `a11y-css.json` expiring baseline that #118 removes, or merge #118's emitter first. Never add a numeric `var()` fallback. 5) Deleting `src/a11y/css/index.css` is allowed only if nothing imports it (`rg -n "a11y/css/index.css" src .storybook fragments` = 0). Otherwise keep it without `@import url()`. 6) `pointer-events:none` is removed from `[data-ag-part=hit-area]` and coarse clamps use `var(--ag-target-coarse)`. 7) Fragment rows: motion/loading/view-transition CSS → `ag.material`. Register `src/components/overlays/_shared/overlays.css` and `src/backdrops/presets/media.css`. No double inclusion. 8) Every baseline row is `{file, owner, reqFin, expires}` with `expires` = RC-1 date. |
| S4.2 | #323 | next · `next-fin/cmp-09-css-contract` | 14 · CMP-09 | DIRTY | REBASE+RESOLVE + TRIM, first CSS sweep after #116 | Remove the `fragments/css/cmp.ts` hunk (owned by REQ-FIN-14, moved into #116). Keep the line-1 `LAYER_ORDER_STATEMENT` and the single `@layer ag.components` on CMP CSS (REQ-FIN-70 clause), the scoped `[data-ag-animating]`, and `tests/foundation/css-contract.test.ts`. The PR deletes its own rows from `scripts/integration/baselines/css-files.json` (the stale-row check forces this). Then the remaining sweeps run one at a time with a baseline regen and `npx jest tests/integration/css-files.test.ts` after each: FIN-E #322 → #308 → #331, #332 (S6), #334, #324 → FIN-F #340 (which also drops its `fragments/css/surf.ts` hunk). |
| S5.1 | #117 | next · `next-fin/a-engine` | 02 · MAT-09, -29, -31, CMP-34, -78 (+ `material.css`/`lens.css` clauses of MAT-26, -42, -43) | DIRTY | REBASE+RESOLVE, then merge (the first `material.css` PR) | 1) Resolve against `next` (64 `.ag-surface` in `material.css`, 21 in `lens.css`). Result: `rg -c '\.ag-surface' src/material/css` = 0 and `rg -c 'var\(--_ag-state-' src/material/css/material.css` ≥ 9. 2) `src/contracts/material.ts` (`className:'ag-surface'` dropped) is only through C-1 in `contract/v1.2-final`. Do not edit it here. 3) Must include: `:where()` zero specificity; no `--_ag-on-surface` host redeclarations; `--ag-surface-fill` from `--_ag-fill` only; the forced-colors block (Highlight/HighlightText/GrayText) and the `[data-ag-contrast=more]` outline; floor rows `[data-ag-layer=overlay][data-open]`, `[data-expanded]`, `[data-ag-full-height]` (MAT-31); `select`/`combobox` kinds at `regular` in `overlayTypes.ts`, plus prominent passthrough in `overlaySurface.ts` (taken from #247); deletion of the hard-coded `0.16`/`0.7`/`2px`/`0.06`; MAT-26/-42/-43 clauses (`data-ag-spacing|radius|inset` vars, `concentric-frame`, ScrollEdge, no `--_ag-hover`, scoped depth cross-fade, `::before` opacity + `::after` sheen bound to `--_ag-optics`, `transform-origin` on the resting overlay rule); MAT-36 `lens.css` eligibility selectors prefixed `:root[data-ag-tier=enhanced]`; MAT-49 radial-gradient at `var(--_ag-pointer,50% 30%)` on the `[data-ag-surface][data-ag-pointer-light]::after` sheen. 4) `src/material/dev/warnings.ts` keys on `[data-ag-surface]`. 5) Tests: `tests/material/state-readers.test.ts`, `tests/material/tint-formula.test.ts` (6 inputs). FIN-E's #248, #257 and FIN-C's #175 (all `material.css`) rebase after #118. |
| S5.2 | #247 | next · `next-fin/cmp-78-overlay-kinds` | 02 · CMP-78 | CLEAN | TRIM, merge after #117 | Remove the `overlaySurface.ts`/`overlayTypes.ts` hunks (REQ-FIN-02 files, moved into #117) and the `package-lock.json` hunk (FIN-C). Keep the per-component `overlayMaterial('select'|'combobox')` wiring, the restriction of per-instance material to `regular`/`identity` + prominent on Dialog/Popover, and `popup-contract.test.tsx` (9 kinds, thickness table, `data-ag-overlay=select|combobox`). FIN-E's #250 rebases after it. |
| S5.3 | #203 | next · `next-fin/cmp-34-prominent-scope` | 02 · CMP-34 | CLEAN | MERGE as is, after #117 (needs the selector for its `::before` assertion) | Before merge, check against the ledger acceptance: two prominent buttons in separate chrome surfaces give 0 warnings, two in the same surface give 1; `::before` `backdrop-filter` is non-`none` for `regular` and `none` for `identity` until `:hover` (remote); all 5 intents emit `data-ag-intent` except neutral; `data-ag-size-class` renamed to `data-ag-sizeclass`. Anything missing is a follow-up commit on the same branch (no force-push). |
| S5.4 | #118 | next · `next-fin/a-compiler` | 03 · MAT-07, -10, -30, -32, -33, -34, -35, -40 | DIRTY | REBASE+RESOLVE as `next-fin/a-compiler-v2` (drop `ad85c6d04`), then merge | 1) Cut from `next` and cherry-pick only the REQ-FIN-03 commits. Drop every `tokens/{schema,index}.json`, `tokens/personas/**`, `tokens/legacy/**`, `scripts/tokens/{build,freeze-4x,drift,validate}.mjs` and `formats/**` hunk (REQ-FIN-01). 2) `src/theme/color.ts` is FIN-D's. Put the shared WCAG module at `scripts/tokens/transforms/wcag.mjs` (REQ-FIN-03 file) and hand FIN-D the one-line re-export in `color.ts` (PR `next-fin/d-wcag-shared`). Drop the `src/theme/wcag.mjs` and `scripts/tokens/color.mjs` hunks unless FIN-D takes them. 3) `src/tokens/generated/**` only as `drift.mjs` output. 4) Must include: cell scalars `--_ag-blur` 12/20/32, `--_ag-saturation`, `--_ag-brightness`, two-layer `--_ag-shadow`, `--_ag-rim-width` (thick 1.5px), `--_ag-grain-opacity` on `[data-ag-surface][data-ag-variant][data-ag-thickness]` plus `:not([data-ag-thickness])` default rows; no host `backdrop-filter`; WebKit literals only on `::before`; lightweight `none`, grain ≤0.02; coarse block; clear fail-safe = regular row; `auto` dropped from the clear dim selector (MAT-33); ancestor-keyed floors; `--_ag-surface-alpha` not emitted in ladders; solver models (tinted ≥ glass, solid opaque, 3 backdrops, 7:1 contrast=more); `0.6`/`0.55` removed; `tokens/sys/elevation.tokens.json` two-layer pairs; `--_ag-on-surface-max`/`--_ag-border-strong`/`--_ag-fallback-fill` emitted (and #116's `a11y-css.json` rows removed). It overlaps #120 on 16 files: #118 merges first and #120-v2 rebases. FIN-C's #174–#178 rebase after it. |
| S6.1 | #121 | next · `next-fin/a-provider` | 04 · MAT-36, -38, -49, -55 (mount parts; feeds PLAT-26; transfers MAT-53 store reuse, MAT-22 exports, PLAT-72 provider forwardRef) | DIRTY | REBASE+RESOLVE + extend, then merge | 1) Drop the portal-root self-adoption hunk (already on `next` via #369) and the `src/theme/public.ts` hunk (FIN-D, REQ-FIN-52). 2) Registration must run at provider render through a side-effect-free `src/theme/mounts.ts`, not at `./index` import. Edit `src/theme/providerMounts.ts` for that. 3) Mounts: `lensDefs` (resolved tier enhanced/auto, including undefined prop), `pointerLight` (only while a `[data-ag-pointer-light]` element exists and motion=full), `devDiagnostics` (dev only, re-arming thresholds), `presetCss`, `brandCss`. 4) `setDeprecationMode(deprecations ?? 'warn')` in a layout effect. `src/internal/warnDeprecated.ts` strips a trailing period. 5) `PortalRootMarkup` (`AuraGlassProvider.tsx:31`): `React.forwardRef` → ref-as-prop. `rg -c forwardRef src/theme` = 0. 6) Nested providers reuse one document store (identity test). 7) `src/theme/index.ts` stops exporting `createGlassThemeCssVars`/`createBrandGlassTheme` (FIN-D moves them to `src/compat/mat/`). 8) FIN-E's #325 and #317 and FIN-C's #173 drop their `AuraGlassProvider.tsx` hunks. FIN-C's #178 drops its `src/theme/public.ts` hunk to FIN-D. |
| S6.2 | #122 | next · `next-fin/a-layers` | 07 · MAT-56, -57, CMP-11, -12, -80, SURF-60 (LayerStack API part) | CLEAN | TRIM + extend. Survivor for every REQ-FIN-07 FIN-A file. Merge first in the LayerStack chain | 1) Remove `lint/rules/mat/{_strict.cjs,no-layer-global-listeners.cjs}` (wrong owner/name) and the `contracts/lint-rule-owners.json` hunk (contract file). Take #326's `lint/rules/cmp/no-overlay-global-listeners.cjs` (FIN-A file, already on `next`) at `error` over `src/components/**`, `src/primitives/**` and the SURF overlay dirs. Rename the baseline to `scripts/integration/baselines/no-overlay-global-listeners.json`. 2) Move `src/theme/layerInput.ts` under `src/theme/layers/` (FIN-A scope). 3) Fold in from #249: toast root never inert, un-inert the layer-root child that contains the top popup, push/reorder only while `open`, depth 0/1/2. Fold in from #326: `useOverlayLayer.ts` routes Base UI Escape through `onEscape → onOpenChange(false,{reason:'escape-key'})` with BU escape disabled and `lockScroll: modal`; `DismissableLayer`/`FocusScope` without document listeners or `body.style`. Fold in from #325: `src/foundation/portal.ts` becomes a re-export of `src/theme/portal.ts` (returns `null` without a provider), so `rg -c 'export function usePortalContainer' src` = 1. 4) Rename the test to `src/theme/layers/__tests__/layer-stack.integration.test.tsx` and include every AC-FIN-07 case. 5) Fix the PR body REQ ids (it cites MAT-290/294/295) and drop the "depends on #121" claim if it is not true after the rebase. |
| S6.3 | #325 | next · `next-fin/cmp-11-portal-seam` | 07 · CMP-11 | DIRTY | REBASE+RESOLVE + TRIM, after #122 | Remove the `src/foundation/portal.ts` hunk (moved into #122) and the `src/theme/AuraGlassProvider.tsx` hunk (on `next` via #369, FIN-A 04 file). Keep the 10 overlay families importing the S-23 hook, `overlayPortal.tsx`/`portalContainer.ts`, `src/primitives/Portal.tsx`, and `tests/overlays/overlay-portal.test.tsx` (0 overlay children of `body` with a provider). |
| S6.4 | #249 | next · `next-fin/cmp-80-layerstack` | 07 · CMP-80 | CLEAN | TRIM, after #325 | Remove the `src/theme/layers/{LayerStack,useLayer}.ts` hunks (moved into #122) and the `tests/helpers/index.ts` hunk (REQ-FIN-08, #115). Keep the Dialog/Menu/Popover wiring, `overlay-layer.test.tsx`, and the fixed `tests/e2e/cmp/overlays/overlay-stack.spec.ts` story ids. The T-STACK-03 scene mounts a toast so the spec never skips. |
| S6.5 | #326 | next · `next-fin/cmp-12-dismissal` | 07 · CMP-12 | CLEAN | TRIM, after #249 | Remove the hunks in `src/theme/layers/**`, `useOverlayLayer.ts`, `DismissableLayer.tsx`, `FocusScope.tsx` and `lint/rules/cmp/no-overlay-global-listeners.cjs` (moved into #122). Remove `src/components/command-palette/CommandPalette.tsx` (FIN-F: REQ-FIN-82 clause, PR `next-fin/f-command-palette-layer`). Keep the Select/Combobox/Toast registration (REQ-FIN-73/-74 clauses), `src/foundation/useGlobalHotkey.ts`, the story, `tests/lint/cmp/no-overlay-global-listeners.test.ts` and `overlay-stack.spec.ts`. FIN-E's #256 (CMP-88 scroll lock) rebases after it, and its LayerStack hunk is reconciled with #122's single scroll-lock owner. |
| S6.6 | #120 | next · `next-fin/a-tokenseam` | 11 · CMP-19 (unblocks CMP-36, -45, -49, -61, -74, -114, -118) | DIRTY | REBASE+RESOLVE as `next-fin/a-tokenseam-v2` (drop `ad85c6d04`), after #118 | 1) Drop all REQ-FIN-01 files (same list as #118) and the `src/tokens/generated/**` hand edits (drift output only). 2) Delete `tokens/sys/app-shell.tokens.json` (still on `next`). It moves to `tokens/comp/app-shell.tokens.json` as private `--_ag-app-shell-*` (OD-19 default). 3) `dist/tokens.css` declares the 9 `--ag-comp-control-height-{sm,md,lg}-{compact,default,spacious}` (24/32/44, 28/36/44, 32/40/48), `--ag-switch-track-*` and the intent tint tokens. 4) The gate error messages carry the replacement table. `tests/integration/undefined-component-vars.test.ts` fails on a fixture with `var(--ag-space-7)`. 5) FIN-E's #214 (`comp.tokens.json` switch-track) rebases after this PR and drops its `tokens/comp/**` hunk (REQ-FIN-11 file) or the content is folded in here. |
| S6.7 | #332 | next · `next-fin/cmp-19-focus` | 11 · CMP-19 (CMP CSS clause, REQ-FIN-70/-73 transfer) | DIRTY | REBASE+RESOLVE, after #120-v2 and as one step of the S4 CSS sweep sequence | Rebase onto the post-#323 CSS headers. One shared focus mixin in `src/components/control-shared/controls.css`. `rg -n 'outline-offset: var\(--ag-focus-inner\)|0 0 0 var\(--ag-focus-inner\)' src` = 0. Delete the PR's rows from `undefined-component-vars.json`. `tests/e2e/cmp/focus.spec.ts` green remotely (outline ≥2px solid, including focusable-disabled and forced colors). |
| S6.8 | #119 | next · `next-fin/a-motion` | 12 · MAT-46 (+ MAT-53 `store.set` validation transfer) | CLEAN | TRIM, then merge | Move the `src/theme/preferences/prepaint.ts` hunk to FIN-D (`next-fin/d-prepaint-continuous`, the no-flash write of `data-ag-continuous`) and `tests/material/ci/verify-motion-css.test.ts` to FIN-D or to `tests/integration/verify-motion-css.test.ts` (FIN-A). Verify that `store.ts` writes `data-ag-continuous="on"` only when `allowContinuous && motion==='full'` (today `store.ts:181-183` writes it on `allowContinuous` alone). Calm resets `transform` too. Move the loading sweep off `::before`. Add the MAT-56 store clause (FIN-A.3 #5) here or in a follow-up on the same file. When FIN-E's #331 (CMP-18) merges, it deletes its rows from `scripts/integration/baselines/ungated-loops.json`. |
| S7.1 | #123 | next · `next-fin/a-classify` | 10 · PLAT-19 (+ PLAT-21, PLAT-23 item 8, PLAT-56 install cases) | CLEAN | MERGE as is, the same day as #124 | Twin of #124. Reads `.artifacts/qual/visual-class.json`. Before merge, confirm its tests cover: root export on `next-cmp/*` → C-E; `CONTRACT_SURFACE` without `src/index.ts`, `src/root/**`, `src/compat/**`, `deprecations.json`; `changedRatio > VISUAL_TOLERANCE.changedRatio`; head-only `Multi-Family:` trailer; base/head tarball export diff. The stage move to `certify` is FIN-B's (REQ-FIN-22). |
| S7.2 | #124 | release/4.x · `4x-fin/a-classify` | 10 · PLAT-19 (4x) | CLEAN | MERGE as is, with #123. FIN-C's #157 (4.x, same 3 files) rebases after it | Reads `.artifacts/plat/plat-test-visual-4x/visual-class.json`. `verify-app-chrome-visuals.js --class-report` writes it. A missing report on 4x ≥4.2.0 errors. `tests/release/classify-change.test.ts` port. FIN-C's #128 (4.x REQ-FIN-32) is adjacent: rebase it after. |
| S7.3 | #125 | next · `next-fin/a-fragsync` | 13 · PLAT-09 | DIRTY | REBASE+RESOLVE + TRIM, then merge | 1) Remove every content hunk (`deprecations.json`, `fragments/deprecations/{cmp,mat,plat,surf}.ts`, `src/internal/deprecations.generated.ts`). Sync content only lands through script-created `sync/fragments-<kind>-<yyyymmdd>` PRs. 2) Merge `tests/release/sync-fragments-fixture.test.ts` into the named file `tests/release/sync-fragments.test.ts` (two bare repos, stubbed `gh`: branch name, touched paths, same-day skip, deletion propagation, target-only refusal). 3) The `fragments/codemods/**` direction `next → release/4.x` must exist and be tested (missing today). 4) The inline barrel writer is replaced by `node scripts/release/gen-deprecations.mjs`. `--allow-delete <id,…>` guard. 5) Port the same script and test to `release/4.x` via `4x-fin/a-fragsync` (FIN-A.3 #4). After it merges, these merge strictly one at a time with `npm run gen:deprecations` between each: #279, #282, #283, #285, #288, #298, #302, #313/#314, #320, #331, #275, #127, #128, #129 (owned and listed by FIN-C/E/F). |

The 22 PRs are not merged before S0's prerequisites hold: OD-8/REQ-FIN-20 pipelines exist and the head SHA is green (`node scripts/ci/gitlab-status.mjs --sha <head>`). If the owner chooses OD-8 Option B (merge on review, CI later), record that decision in `docs/release/decisions/` (FIN-H) before the first merge, keep every affected ledger row at `code-merged-awaiting-ci`, and still follow the slot order.

### FIN-A.2 Finish partially-merged work

1. **#369 → REQ-FIN-01 remainder** (MAT-01, -03, -13, -21). Branch `next-fin/a-token-build-rest` → `next`, slot S1. Only REQ-FIN-01 files.
   - `git rm tokens/schema.json tokens/index.json tokens/personas/default.json` (still on `next`). FIN-D moves the only reader `scripts/tokens/persona-map.mjs` to a 4.x-only path. Merge after or with that FIN-D PR so the build never imports a deleted file.
   - Make `tests/tokens/legacy-freeze.test.ts` and `tests/tokens/compat-aliases.test.ts` pass. #369's body says they still fail. Fix the producers (`freeze-4x.mjs`, `formats/compat-aliases.mjs`, `tokens/$schema.json`), never the tests (tests are FIN-D's).
   - Confirm `build.mjs` no longer rewrites `tokens/contrast/busy-reference.json`, has exactly one `dist/compat/tokens.css` writer, and that `prettierFormat` throws without prettier (FIN-C pins prettier, REQ-FIN-37).
   - Token emitters write `LAYER_ORDER_STATEMENT` as line 1, header comment after (MAT-19 item 1, assigned to REQ-FIN-01 by §5.1 REQ-FIN-14).
   - Acceptance (AC-FIN-01 + ledger MAT-01/-03/-13/-21): on `git clone --depth 1` of `next`, `npm ci && npm run tokens:build` exits 0 twice with `git status --porcelain` empty; `postcss.parse(dist/compat/tokens.css)` has 0 warnings, 0 `[object Object]`/`$schema`, one `@layer ag.compat` with a `:where([data-theme=dark], .dark)` rule carrying `--ag-color-canvas`, gzip ≤8192 B; `node scripts/tokens/drift.mjs` exits 0; walking `tokens/**` finds only REQ-MAT-01 layout files. All of this runs remotely in FIN-D's `mat:test:drift` (REQ-FIN-53).
   - MAT-21/-03 clauses in FIN-D files, implemented by FIN-D and observed here: `tokens/compat-alias-map.json` `counts.uncovered = 0`; `fragments/codemods/mat.ts` `cssVars` generated with ≥600 keys on both lines; `TOKEN_OUTPUTS` via contract C-7.
2. **#369 → frozen `jest.config.js` edit.** #369 added `'^prettier$'` to `moduleNameMapper` outside the contract PR. Ratify it in `contract/v1.2-final` (C-4 row, together with the `aura-glass` mapper) or revert it there. Record the choice in the contract PR body.
3. **#369 → CMP-29 partial.** The seed strip and the `.`/`./primitives` exports are on `next`. The gate rule (#114) and the packed-tarball proof (FIN-A.3 #6) remain. `src/contracts/seed.tsx` stays excluded from the package build.
4. **#369 → provider self-adoption fix.** Done. The only follow-up is removing the duplicate hunks from #121, #325 (and FIN-E #317/#320) listed in FIN-A.1.

### FIN-A.3 Build work that has no PR

1. **FIN-463 contract bundle.** Branch `contract/v1.2-final` → `next` (C-10 `.github/CODEOWNERS` on `main` as a separate contract PR). Files: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md`, `src/contracts/**`, `contracts/**`, `jest.config.js`.
   - Content: C-1..C-17 exactly as in PRD-F Appendix C, each with its fallback, plus the `src/contracts/tokens.ts` version string `contract-v1.0` → the document's version. Required by FIN-A: C-1 (drop `className:'ag-surface'` from `MaterialAttributes`, REQ-FIN-02) and C-4 (root `moduleNameMapper` `'^aura-glass$' → '<rootDir>/src/index.ts'`, `'^aura-glass/(.*)$'` → ENTRIES sources, REQ-FIN-09) plus the #369 prettier ratification.
   - Tests: `contract:conformance` and `contract:ownership` green. `npx jest tests/capability` shows 0 `PENDING` once C-4 and #115 are both in.
   - Merge only after OD-16 is recorded by the owner (FIN-H). The agent drafts the OD-16 decision text and never records it. If C-4 is rejected, register per-stream Jest configs as lanes (FIN-B/stream WPs) and keep AC-FIN-09 on that path.
2. **FIN-464 AC-FIN-GLOBAL baselines.** Branch `next-fin/a-baselines-zero` → `next`, the last FIN-A PR before RC-1. Files: `scripts/integration/baselines/*.json` only.
   - Each fixing PR deletes its own rows. This PR verifies and removes anything left. If a row cannot be removed because the owner's fix has not merged, name the owner REQ-FIN in `ownerOrHumanActionsNeeded`. Never extend `expires`.
   - Acceptance: every `scripts/integration/baselines/*.json` is `[]` (`css-files`, `a11y-css`, `no-overlay-global-listeners`, `undefined-component-vars`, `ungated-loops`, and REQ-FIN-21's token scan); `rg -n "console.warn\([^)]*pending" tests/{e2e,a11y,perf,visual}` = 0 (the conversions are stream-owned: REQ-FIN-59, -70..-76, -80..-90).
3. **REQ-FIN-13 sync runs** (PLAT-09 operator part).
   - (a) Agent prep: after #125 and its 4x port merge, run `node scripts/release/sync-fragments.mjs` in dry-run/fixture mode in CI and attach the expected diff.
   - (b) Operator (REQ-FIN-113, FIN-H; the agent never does this): once per day while any stream has unsynced rows, run the script for `deprecations` (`release/4.x → next`) and `codemods` (`next → release/4.x`), review and merge the `sync/fragments-<kind>-<yyyymmdd>` PRs on green pipelines, and record date + PR URLs in `docs/release/decisions/operator-fragment-sync.md`. The 87 next-only DEP-C ids are never deleted: use `--allow-delete` only for ids CMP has authored on `release/4.x` (REQ-FIN-76).
   - Acceptance (AC-FIN-13): `git diff --stat origin/next origin/release/4.x -- fragments/deprecations fragments/codemods` is empty after a sync pair (215 files today); `src/internal/deprecations.generated.ts` byte-equals `npm run gen:deprecations`.
4. **REQ-FIN-13 4x port.** Branch `4x-fin/a-fragsync` → `release/4.x`. Files: `scripts/release/sync-fragments.mjs`, `tests/release/sync-fragments.test.ts` (4x copies, same content as #125 after trim). Test: the same fixture-repo cases, run under 4x Jest. Acceptance: AC-FIN-13 refusal case exits 1 on 4x.
5. **MAT-56 portal-root attributes** (REQ-FIN-07 seam; file owned by REQ-FIN-12). Branch: a commit on `next-fin/a-motion` before #119 merges, or `next-fin/a-portal-root-attrs` after it.
   - File: `src/theme/preferences/store.ts`. `store.setTarget` accepts a list, so the resolved `data-ag-scheme` and `data-ag-transparency` mirror onto `[data-ag-portal-root]`.
   - Test: `src/theme/layers/__tests__/layer-stack.integration.test.tsx` case: a nested provider with `scheme='dark'` gives `[data-ag-portal-root][data-ag-scheme=dark]`.
   - Acceptance: ledger MAT-56 (with #116's `layers.css` and #122's single hook).
6. **REQ-FIN-06 packed-tarball root exports** (CMP-29, CMP-23 acceptance). Commit on `next-fin/a-exports` (#114) or `next-fin/a-root-exports` after it.
   - Files: new `tests/integration/root-exports.test.ts` (remote-only: it packs, so locally it exits 2 with the remote command).
   - Test steps: `npm pack`, install into a temp dir, then assert that `import('aura-glass')` and `import('aura-glass/primitives')` both resolve `VisuallyHidden`, that `require('./package.json').exports['./charts']` is undefined on 5.0.x, and that a top-level `types` field exists.
   - `Button` from the tarball is REQ-FIN-52's acceptance (FIN-D), observed after it lands.
   - Acceptance: AC-FIN-06 (`generate-exports --check` exits 0 with the exclusion list `.`, `./theme`, `./motion`, `./primitives`, `./app-shell`, `./ai`, `./media`, `./backdrops`, `./compat` until REQ-FIN-52/-58 land).
7. **Original-REQ clauses in FIN-A files that no open PR carries.** Add each to the named survivor branch before it merges:
   - `glass-material.mjs` floors split so `floors.css` is a single `ag.material` block (MAT-19 item 2) → #118-v2.
   - Grain on its own layer with `opacity: var(--_ag-grain-opacity)`, 0 under contrast=more/forced colours/solid, and the Fresnel band (MAT-32) → `material.css` in #117.
   - `--_ag-surface-alpha` removed from content ladder cells (MAT-31 item 4) → #118-v2.
   - The `undefined --_ag-*` and numeric-fallback checks in `scripts/mat/verify-a11y-css.mjs` (MAT-54) → #116.
   - Clauses of these REQs in FIN-D/E/F files are implemented by their owners (PRD-F §4.3 rule 1) and are listed in those WPs, not here: `src/material/dev/surfaceCounter.ts` re-arm + message + dev-only import (MAT-38), `src/material/lens/LensDefs.tsx` band mask and size test (MAT-36), `src/motion/pointerLight.ts` (MAT-49), `scrim.modal` token (MAT-31), `scripts/mat/a11y-eslint-l1.mjs` (MAT-57), `clear-fallback.spec.ts` early returns (MAT-33), `data-ag-focusable`/`<HitArea/>` adoption (MAT-61/-62, CMP/SURF), Command/CommandPalette on `useLayer` (SURF-60 via REQ-FIN-82).
   - FIN-A's AC for those REQs is evaluated after both PRs merge.

### FIN-A.4 Validation (GitLab CI only, every job `allow_failure: false` with an `ci/plat/activation.json` row)

FIN-A owns no `ci/**` file. The job that runs each check belongs to the WP named in brackets. FIN-A opens an issue/PR comment asking that owner for the job line and never edits the CI fragment. Jobs that do not exist on `next` today are marked "new". Every line runs remotely, with the lanes through `certification/run.mjs` (FIN-G) or the gated remote runner. Locally, run only the narrow Jest/node commands listed.

| AC | Must be green on | Job (owner) | Command / evidence |
|---|---|---|---|
| AC-FIN-01 | next | `mat:test:drift` (new, FIN-D REQ-FIN-53), `mat:build:tokens` | shallow clone, `npm ci && npm run tokens:build` ×2, `git status --porcelain` empty, `node scripts/tokens/drift.mjs`, `npx jest tests/tokens/{legacy-freeze,compat-aliases,schema}.test.ts`, gzip size printed by the tool |
| AC-FIN-02 | next | root Jest lane (FIN-B) + `mat:certify:l5-material` (FIN-D) on Chromium/WebKit/Gecko | `npx jest tests/material/{state-readers,tint-formula}.test.ts`; remote spec: computed background and `::before` `backdrop-filter` for `<Button>`, open `<Dialog>`, `<Select>` popup; `[aria-selected=true]` rim >0 and forced-colours `Highlight`; artifact URLs |
| AC-FIN-03 | next | `mat:test:optics`, `mat:certify:l5-material`, L8 WebKit lane (FIN-G/FIN-D) | `npx jest tests/material/ci/ladders-shape.test.ts`; `node scripts/mat/verify-optics-css.mjs`; dead-vars 0; `webkit-literal.spec.ts`, `optics.spec.ts`, `layer-stack.spec.ts`, `clear-fallback.spec.ts` (3 engines); default Surface `blur(20px)`; `[data-ag-backdrop=dark]` floor equals `floors.css` |
| AC-FIN-04 | next | root Jest lane; L5 Chromium for LensDefs | provider Jest cases without manual registration (one `<style data-ag-theme-style>`, 0 `console.warn` under `silent`, one store for nested providers); `rg` checks from §5.1; remote one `svg[data-ag-lens-ready]` for `tier="enhanced"`; side-effect import gate 0 (FIN-C job) |
| AC-FIN-05 | next | `plat:build:dist` + root lint lane | built `dist/styles.css` grep for the 5 `ag.a11y` rule families; `node scripts/mat/verify-a11y-css.mjs` exits 0; L5 `rungs.spec.ts`, `forced-colors.spec.ts`, `focus-not-obscured.spec.ts` against the built bundle |
| AC-FIN-06 | next | `plat:package:pack`, `plat:test:pack-matrix` | `node scripts/build/generate-exports.mjs --check` exits 0; `npx jest tests/integration/entry-eligibility.test.ts`; `tests/integration/root-exports.test.ts` on the packed tarball |
| AC-FIN-07 | next | root Jest + lint lane; L5 Playwright overlays (FIN-E/FIN-G) | `npx jest src/theme/layers/__tests__/layer-stack.integration.test.tsx tests/overlays/overlay-portal.test.tsx tests/lint/cmp/no-overlay-global-listeners.test.ts`; `rg` = 0 listener/body-style writes; one `usePortalContainer`; `overlay-stack.spec.ts` T-STACK-01..04 with 0 skips |
| AC-FIN-08 | next | root Jest lane | `npx jest tests/helpers/__tests__/helpers.test.tsx` (9 exports); `rg '@ag-contract-seed' tests/helpers` = 0 |
| AC-FIN-09 | next | root Jest lane + `plat:test:cli` (line `npm test -w packages/{cli,registry,mcp,labs}` is FIN-B's, §6.1) | `npx jest tests/capability` 0 `PENDING`; `packages/cli/test/fixtures.test.ts` lists ≥120 `cmp/*`,`mat/*`,`surf/*`,`plat/*` cases, 0 mismatches |
| AC-FIN-10 | next and release/4.x | `plat:gate:change-class` at stage `certify` (FIN-B REQ-FIN-22), `plat:test:visual-4x` (4x), Jest/`node --test` lane on both lines | `tests/release/classify-change.test.mjs` (next), `tests/release/classify-change.test.ts` (4x); a real `next-cmp/*` root-export MR classifies C-E; a 4x pipeline with no visual report fails change-class |
| AC-FIN-11 | next | root Jest + lint lane; L6 focus lane (FIN-E/FIN-G) | `npx jest tests/integration/undefined-component-vars.test.ts`; `node scripts/tokens/gates/undefined-component-vars.mjs` exits 0 with baseline; built `dist/tokens.css` has the 9 control-height vars; `tests/e2e/cmp/focus.spec.ts` outline ≥2px solid remotely |
| AC-FIN-12 | next | root lint lane; L5 continuous/reduced-idle | `node scripts/mat/verify-motion-css.mjs` exits 0 with baseline and 1 on `scripts/mat/__fixtures__/ungated-loop.bad.css`; remote: 0 `iterations === Infinity` animations and 0 library rAF callbacks 1 s after settle without `allowContinuous` |
| AC-FIN-13 | next and release/4.x | Jest lane on both lines; operator sync PR pipelines | `npx jest tests/release/sync-fragments.test.ts`; empty `git diff --stat` after a sync pair; `npm run gen:deprecations` byte-equal |
| AC-FIN-14 | next | root Jest lane | `npx jest tests/integration/css-files.test.ts` (fixtures: unregistered file, missing statement, wrong layer, `!important`) with baseline; `node scripts/build/verify-css-files.mjs` |
| AC-FIN-GLOBAL (baselines part) | next @ RC-1 SHA | the same lanes | all `scripts/integration/baselines/*.json` = `[]`; 0 `console.warn(…pending)` in `tests/{e2e,a11y,perf,visual}` |

Every new gate ships at least one failing fixture that asserts its specific message (PRD-F §12 rule 5). Visual evidence is GitLab/remote artifact URLs only, never local screenshots. Every merged FIN-A row records its job URL in the ledger row and PRD-F Appendix A.

### FIN-A.5 Exit criteria

- [ ] AC-FIN-01 — REQ-FIN-01: REQ-MAT-01, REQ-MAT-03, REQ-MAT-13, REQ-MAT-21
- [ ] AC-FIN-02 — REQ-FIN-02: REQ-MAT-09, REQ-MAT-29, REQ-MAT-31, REQ-CMP-34, REQ-CMP-78 (+ MAT-26/-42/-43 `material.css` clauses observed)
- [ ] AC-FIN-03 — REQ-FIN-03: REQ-MAT-07, REQ-MAT-10, REQ-MAT-30, REQ-MAT-32, REQ-MAT-33, REQ-MAT-34, REQ-MAT-35, REQ-MAT-40
- [ ] AC-FIN-04 — REQ-FIN-04: REQ-MAT-36, REQ-MAT-38, REQ-MAT-49, REQ-MAT-55
- [ ] AC-FIN-05 — REQ-FIN-05: REQ-MAT-54, REQ-MAT-61, REQ-MAT-62, REQ-MAT-63
- [ ] AC-FIN-06 — REQ-FIN-06: REQ-CMP-23, REQ-CMP-29
- [ ] AC-FIN-07 — REQ-FIN-07: REQ-MAT-56, REQ-MAT-57, REQ-CMP-11, REQ-CMP-12, REQ-CMP-80, REQ-SURF-60
- [ ] AC-FIN-08 — REQ-FIN-08: REQ-QUAL-69
- [ ] AC-FIN-09 — REQ-FIN-09 (no mapped REQ; unblocks PLAT-84..91, CMP-134, SURF-14, -170..178, MAT-67)
- [ ] AC-FIN-10 — REQ-FIN-10: REQ-PLAT-19 (next + release/4.x)
- [ ] AC-FIN-11 — REQ-FIN-11: REQ-CMP-19
- [ ] AC-FIN-12 — REQ-FIN-12: REQ-MAT-46
- [ ] AC-FIN-13 — REQ-FIN-13: REQ-PLAT-09 (next + release/4.x; operator runs recorded)
- [ ] AC-FIN-14 — REQ-FIN-14: REQ-MAT-19, REQ-CMP-09
- [ ] FIN-463 `contract/v1.2-final` merged after OD-16 is recorded
- [ ] FIN-464 / AC-FIN-GLOBAL baselines part: every baseline `[]`, 0 pending early returns
- [ ] All 22 PRs in FIN-A.1 merged or closed with the named survivor linked. 0 FIN-A ownership deviations left unrecorded.
- [ ] Each of the 40 original REQ rows above has a green `allow_failure: false` job URL on its target line in `fin-open-ledger.json` / Appendix A. Rows whose acceptance waits on another WP's clause stay `pending-producer` with that REQ-FIN named.

Report: the common JSON format, plus `"mergeOrderObserved": ["REQ-FIN-01", …]`, the `generate-exports --check` exclusion list, and `"closedAsSuperseded": [{"pr":113,"survivor":"#369 + next-fin/a-token-build-rest"},{"pr":280,"survivor":"#369 + #114"}]`.





---

## 6. WP FIN-B — CI and validation activation on GitLab (remaining work as of 2026-10-10)

Source: PRD-F §5.2 (REQ-FIN-20..26, AC-FIN-20..26), §6 FIN-B row, §6.1 row "REQ-FIN-09 `plat:test:cli` script line; REQ-FIN-10 change-class stage/needs; every 'wire into job'/'run in CI' clause of REQ-FIN-26, -31..-44 → REQ-FIN-22 (FIN-B)", §20 ("FIN-B: OD-8 (owner) and REQ-FIN-21/-22/-25/-26 code start together; REQ-FIN-23/-24 records are written as soon as the first pipelines exist; activation flips continuously"). Original REQs: PLAT-02, 04, 05, 06, 07, 08, 10, 17, 39, 51 (all open, 0 merged). Tasks FIN-043..062.

State verified 2026-10-10 (`gh api repos/auraoneai/auraglass/pulls/<n>`, `git show origin/<line>:<path>`):
- Nothing for FIN-B has merged on any line. `next` @ `e5a2d6835`, `release/4.x` @ `645735fce`, `release/4.1.x` @ `a19f4bbe1` (exists, descends from `78fd7bda1`).
- Only FIN-B PR: **#126** `next-fin/b-ci` → `next`, head `0130607f5`, `mergeable: true / clean`, 0 status checks, based on `84a3b94f1` (30 commits behind).
- On all three lines: `scripts/ci/require-activated.mjs` and `scripts/release/push-gitlab-refs.mjs` do not exist; `docs/auraglass-5/tools/verify-task-graph.mjs` does not exist; `ci/plat/activation.json` has 0 rows; `plat:package:pack` still has `|| echo "PENDING: npm script verify:pack"` (fail-open); `plat:build:docs` (4x branch) runs `npm run build-storybook`; `plat:gate:removal` has an `else echo "PENDING: removal revert dry-run"` branch; `plat:test:react19` guards on `tests/react19/*` and never installs React 19; no Base UI latest leg in `plat:test:canaries`; only 6 of 20 PLAT jobs carry `evidence-$CI_JOB_NAME_SLUG-*` artifacts. `tests/ci/no-gate-bypass.test.ts` is missing on `next` (exists on 4.x/4.1.x). `.github/CODEOWNERS` is absent on `main`; no `contract/v1.2-final` PR exists.
- GitLab 87152036: 0 pipelines, only branch `main` (OD-8 not applied). Therefore **no FIN-B PR can satisfy the "merge only on a green GitLab pipeline" rule until OD-8 or its fallback runs**; PRs are prepared, rebased and kept merge-ready, and merge the day pipelines exist (never merge on faith, never `--admin`).

FIN-B May touch (PRD-F §6, exclusive): `.gitlab-ci.yml`, `ci/plat.gitlab-ci.yml`, `ci/plat/**`, `scripts/ci/{verify-ci-fragments,gitlab-status,assemble-pages,require-activated}.mjs`, `scripts/release/{push-gitlab-refs,verify-branch-protection}.mjs`, `tests/ci/{no-github-ci,verify-ci-fragments,plat-fragment,no-gate-bypass,gitlab-status,assemble-pages,decision-records,no-forward-merge}.test.ts`, `tests/ci/fixtures/ci-fragments/**`, `tests/release/branch-protection.test.ts`, `docs/release/{branch-policy.md,decisions/gitlab-*.md}`; `.github/CODEOWNERS` only as content handed to the FIN-A `contract/v1.2-final` PR on `main` (C-10).
Must not touch: `ci/{mat,cmp,surf,qual}.gitlab-ci.yml`, `ci/{mat,cmp,surf,qual}/**`, `scripts/integration/**` (FIN-A), `scripts/release/{classify-change.mjs,lib/policy.mjs}` (FIN-A REQ-FIN-10, incl. `PRODUCER_PATHS`), any other `scripts/{release,removal,docs,registry,ci}/**` file (FIN-C), `docs/release/decisions/{od-*,operator-*}.md` (FIN-H), `.github/workflows/mirror-to-gitlab.yml` (never edit or re-enable), the GitLab mirror (never push), GitLab project settings and GitHub branch protection (owner/operator only).

### FIN-B.1 Land existing open PRs

#### FIN-B.1a PRs owned by FIN-B

| PR | Line | REQ-FIN / original REQs | Action | Exact conflict / gap to fix before merge | Merge slot |
|---|---|---|---|---|---|
| #126 `next-fin/b-ci` (head `0130607f5`, clean) | `next` | REQ-FIN-20, 21, 22, 23, 25, 26 / PLAT-02, 04, 05, 06, 07, 08, 10, 17, 39, 51 (tasks FIN-044, 046–050, 052, 057–058, 060–061) | **REBASE + TRIM, then merge** | (1) Rebase onto `origin/next` `e5a2d6835` (currently merge-tree clean). (2) **Delete the duplicate** `scripts/ci/verify-branch-protection.mjs` and `tests/ci/verify-branch-protection.test.ts`; move their logic (URL-encode `release%2F4.x`, `required_approving_review_count ≥ 1`, per-branch failure counters, status-context check when OD-9 is on, stub-`gh` fixtures compliant→0 / missing linear history→1 / review count 0→1) into the PRD-named `scripts/release/verify-branch-protection.mjs` and `tests/release/branch-protection.test.ts`, covering `main`, `next`, `release/4.x`, `release/4.1.x`. (3) **Remove** `scripts/integration/baselines/no-github-ci.json` from the PR (FIN-A directory): hand its four rows verbatim (`scripts/docs/gen-claims.mjs`→REQ-FIN-43, `tests/dx/registry-render.spec.ts`→REQ-FIN-42, `tests/motion/helpers/report.ts`→REQ-FIN-58, `ci/cmp.gitlab-ci.yml`→REQ-FIN-76; `expires: RC-1`) to FIN-A's baseline PR (FIN-464); #126 merges after that file is on `next`. (4) **Remove** the `docs/ai/security-guide.md` reword (not a FIN-B path): either FIN-C lands the same one-line reword first, or add a fifth baseline row `{file: "docs/ai/security-guide.md", owner: "PLAT", reqFin: "REQ-FIN-43", expires: "RC-1"}` to the FIN-A hand-off. (5) Make `require-activated.mjs` the **first** script line of `plat:package:pack` (no `before_script`/earlier line runs before it). (6) Extend `tests/ci/plat-fragment.test.ts` to assert every REQ-PLAT-05 item fixed in this PR (ledger AC). Gaps that stay out of #126 and are tracked in FIN-B.3: artifacts dir for the other PLAT jobs, Base UI leg, 4x `plat:build:docs`, 4x react19, change-class stage, §6.1 wiring, ports to 4.x/4.1.x, `push-gitlab-refs.mjs`. | FIN-B slot 1 on `next` (CI plumbing, may merge any day — status §3.2 step 1), right after FIN-A's `no-github-ci.json` baseline lands; must merge **before** FIN-C #183 is rebased (#183 must drop its `assemble-pages.mjs` hunk against #126's version). |

No other open PR has a `next-fin/b-*`, `4x-fin/b-*` or `4x11-fin/b-*` head. Stale #97 and #77 are FIN-H/REQ-FIN-113 closures, not FIN-B.

#### FIN-B.1b Other WPs' open PRs that edit FIN-B files (FIN-B re-authors the hunk; the PR itself is merged/trimmed in its owner's section)

Rule (PRD-F §6.1): the file owner implements the clause. For each row the owning WP **trims the FIN-B-owned hunk out of its PR**; FIN-B opens the listed wiring PR from the requesting REQ's ledger text, with the fixes named here, and merges it the same day, immediately **after** the producer PR (a CI line calling a script that is not on the line yet is not merged). These rows are not separate FIN-B merges of the other WP's PR.

| PR (owner) | Line, mergeable 2026-10-10 | FIN-B-owned hunk | FIN-B wiring PR and required correction |
|---|---|---|---|
| #127 `next-fin/c-plat` (FIN-C, REQ-FIN-30/31) | `next`, **dirty (CONFLICTING)** | `ci/plat.gitlab-ci.yml`: glass-quality adds `gen-deprecations --schema --check`, `check-tsdoc-deprecated --line 5x`, `verify-compat-coverage`, `gen-deprecations --docs && verify-breaking-register`, `api-report --all --check` (PLAT-22/24/25/27/29); pack dist-maps producer (PLAT-16); new `plat:tag:release-ledger` (PLAT-31) | `next-fin/b-wire-fin31`: same lines; `plat:tag:release-ledger` gets `extends: .ag-evidence-release` (90d, `when: always`, `.artifacts/plat/$CI_JOB_NAME_SLUG/`) and runs before `plat:publish:npm` (`needs`); add `verify-deprecations --line $AG_LINE` (PLAT-25). The dist-maps producer here is the canonical one (fail-closed) — see #179/#180. |
| #128 `4x-fin/32-policy-v2` (FIN-C, REQ-FIN-32) | `release/4.x`, clean | same set with `--line 4x`, `api-report --line 4x --check`, dist-maps, `plat:tag:release-ledger` | `4x-fin/b-wire-fin32`: same, plus `verify-deprecations --line 4x --compare-branch origin/next` (PLAT-25). Not needed on `release/4.1.x` (already there via direct pushes `22b6cf353`, `0d3412a30`, `7363ec27a`). |
| #131 `4x11-plat/import-side-effects` (FIN-C, PLAT-41) | `release/4.1.x`, clean | pack: `node scripts/ci/import-side-effects.mjs --dist dist/index.mjs` | `4x11-fin/b-wire-plat41` (+ same commit `4x-fin/b-wire-plat41` for #132, same day). |
| #132 `4x-plat/import-side-effects` (FIN-C) | `release/4.x`, clean | same | covered by `4x-fin/b-wire-plat41`. |
| #143 `4x11-plat/react19-legs` (FIN-C, PLAT-47) | `release/4.1.x`, clean | react19: `npm install --no-save … react@19 react-dom@19` | `4x11-fin/b-react19`: install line **plus** REQ-PLAT-05 4x react19 fix — delete the `test -d tests/react19 \|\| … PENDING` guard so a missing leg fails; both legs `react19-smoke`, `unit-react19`. |
| #144 `4x-plat/react19-legs` (FIN-C) | `release/4.x`, clean | same | `4x-fin/b-react19` (cherry-pick of the 4x11 commit, same day). |
| #163 `4x-plat/tag-62` (FIN-C, PLAT-62) | `release/4.x`, clean | new `plat:release:verify-codemods`, `plat:release:deprecation-coverage`, `plat:publish:cli` | `4x-fin/b-wire-plat62`: `plat:release:verify-codemods` gets an evidence artifacts block (rule 5); `plat:publish:cli` keeps `id_tokens` only in the publish stage, `environment: npm-publish`, manual on `v4.3.*`; `verify-ci-fragments` must accept it (fixture). |
| #164 `4x-plat/consumer-63` (FIN-C, PLAT-63) | `release/4.x`, clean | visual-4x: `AG_CONSUMER_4X=1 node scripts/ci/run-vite-integration.js --skip-build \|\| echo "PENDING…"` | `4x-fin/b-wire-plat63`: **without** `\|\| echo PENDING` (prohibited fail-open); the job stays `allow_failure: true` until its activation row. |
| #169 `next-fin/plat-68` (FIN-C, PLAT-68) | `next`, clean | new `plat:test:pack-matrix:5x` + `tests/ci/plat-fragment.test.ts` block | `next-fin/b-wire-plat68`: job (node:20.19.0 + node:22 legs, `node --test tests/exports/node-esm-require.test.mjs`) with evidence artifacts; the `plat-fragment.test.ts` block moves into this PR. |
| #179 `next-fin/plat-78-tarball` (FIN-C, PLAT-78) | `next`, clean | pack: `test -d dist-maps && tar … \|\| echo "no dist-maps dir…"` | **Drop** (fail-open, duplicates #127's producer). `next-fin/b-wire-plat78`: `plat:release:notes` `needs: plat:package:pack` and links `dist-maps.tgz` by the pack job's artifact URL (PLAT-78). `ci/mat.gitlab-ci.yml` hunk is FIN-D's. |
| #180 `next-fin/plat-79-removal` (FIN-C, PLAT-79) | `next`, **dirty (CONFLICTING)** | removal comment; same dist-maps line as #179 | Drop the dist-maps line. `next-fin/b-wire-plat79`: after #180 lands `scripts/removal/revert-dry-run.mjs`, delete the `else echo "PENDING: removal revert dry-run"` branch; remove `allow_failure` from `plat:gate:removal` only via an activation row (PLAT-79/82). |
| #184 `next-fin/plat-82-server-archive` (FIN-C, PLAT-82) | `next`, clean | `plat:test:docs` `allow_failure: true → false` + `node scripts/removal/verify-archive.mjs --verify` | `next-fin/b-wire-plat82`: add the `verify-archive --verify` line; **reject the flip** — `allow_failure: false` only with an `activation.json` row from a green pipeline. |
| #183 `next-fin/plat-83-redirects` (FIN-C, PLAT-83) | `next`, clean vs `next`, **conflicts with #126** in `scripts/ci/assemble-pages.mjs` | imports `../docs/gen-redirects.mjs` and writes `public/_redirects` unconditionally | No FIN-B hunk to re-author: #126 already copies `apps/docs/public/_redirects` or writes the `/v4/*` placeholder. FIN-C rebases #183 after #126, drops the `assemble-pages.mjs` hunk and has the docs build write `apps/docs/public/_redirects` (REQ-FIN-39). |

### FIN-B.2 Finish partially-merged work

No FIN-B PR has merged on any line, so there is no merged-with-gaps FIN-B PR. One related state to clean up:

- `release/4.1.x` carries direct-pushed FIN-C commits that edited the FIN-B-owned `ci/plat.gitlab-ci.yml` (`6a801d6da`, `efe5c4497`, `543866512`, `388c19a4c`, `9e9329999`, `22b6cf353`, `7363ec27a`, `0d3412a30`). Under OD-13 they are canonical on 4.1.x (status §3.1: rebase #128 down to 4.x-only parts). Follow-up, inside `4x11-fin/b-ci` (FIN-B.3 task B3-2), no separate PR: run `node scripts/ci/verify-ci-fragments.mjs` on that branch and fix every rule violation those commits introduced in `ci/plat.gitlab-ci.yml` (`plat:tag:release-ledger` has no evidence artifacts block → add `.ag-evidence-release`); do not revert them.

### FIN-B.3 Build work that has no PR

Every task: worktree `git worktree add ../AuraGlass.wt/fin-b-<topic> -b <branch> origin/<line>`; narrow local checks only (`npx jest tests/ci/<file> tests/release/branch-protection.test.ts`, `node scripts/ci/verify-ci-fragments.mjs`); never run pipelines, Playwright or builds locally. A 4x11 commit is cherry-picked to `release/4.x` the same day via the paired `4x-fin/*` branch. PR body: REQ-FIN, original REQs, FIN task ids, tests run, remaining `pending`.

**B3-1 `4x-fin/b-ci` → `release/4.x`** (REQ-FIN-20/21/22/23/25/26; PLAT-02, 04, 05, 06, 07, 08, 10, 17, 39, 51; FIN-044, 046–050, 052, 057–058, 060–061; AC-FIN-20, 21, 22, 25, 26 need both lines)
- Cherry-pick the post-fix #126 commits (after its FIN-B.1a trim). Resolve against 4x: keep the existing `tests/ci/no-gate-bypass.test.ts` and rewrite it to read `ci/plat/activation.json` (require `allow_failure: false` only for activated jobs and, at tag scope, for the four gates).
- 4x-specific in the same PR: `plat:build:docs` 4x branch builds the 4.x docs site into `apps/docs/out/` instead of `npm run build-storybook` (producer script is FIN-C's 4x docs build; until it exists the line fails with `PENDING … exit 1`, job stays `allow_failure: true`); `no-github-ci.test.ts` FORBIDDEN_WORKFLOWS = `deploy-storybook.yml, design-system-compliance.yml, glass-pipeline.yml, publish-npm.yml, visual-regression.yml`, docs exclusion `^docs/auraglass-5/archive/` only; `docs/release/branch-policy.md` on 4.x gets W-6 correction, "Daily merge cadence", `forward-port` label rule, "next owner cherry-picks", "2 business days", "PLAT cherry-picks only PLAT-owned next paths".
- Tests: `tests/ci/{no-github-ci,verify-ci-fragments,plat-fragment,no-gate-bypass,gitlab-status,assemble-pages,decision-records,no-forward-merge}.test.ts`, `tests/release/branch-protection.test.ts`, all fixtures in `tests/ci/fixtures/ci-fragments/**` on 4.x.
- Acceptance: AC-FIN-21 (`npx jest tests/ci/no-github-ci.test.ts tests/ci/verify-ci-fragments.test.ts` pass on 4.x; `verify-ci-fragments` names only `ci/mat.gitlab-ci.yml` jobs until FIN-D REQ-FIN-53); ledger PLAT-02 AC (`git grep -nE 'GITHUB_SHA\b|GITHUB_REF\b|GITHUB_EVENT_NAME|GITHUB_WORKFLOW_REF|gh run|secrets\.' -- . ':!docs/auraglass-5/archive' ':!legacy' ':!.github/workflows/mirror-to-gitlab.yml'` → only allow-listed docs); PLAT-04 AC (one fixture per rule with its message, `passing/` exits 0).
- Slot: merge on 4.x as FIN-B slot 1 for that line (any day, after pipelines exist there).

**B3-2 `4x11-fin/b-ci` → `release/4.1.x`** (same REQs; OD-13 requires FIN-B tooling on 4.1.x; 4.1.1 gate "FIN-B pipelines on release/4.1.x")
- Cherry-pick B3-1's commits; plus the FIN-B.2 rule-violation fixes for the direct-pushed jobs. `AG_LINE=4x` for 4x11 heads (PRD-F OD-13). `verify-branch-protection.mjs` checks `release%2F4.1.x`.
- Acceptance: same tests green on 4.1.x; `node scripts/ci/gitlab-status.mjs --sha $(git rev-parse origin/release/4.1.x)` prints a pipeline URL once OD-8 is applied.
- Slot: before any other `4x11-fin/*` wiring PR (B3-11) on 4.1.x.

**B3-3 `next-fin/b-push-gitlab-refs` → `next`, cherry-picked as `4x-fin/b-push-gitlab-refs` and `4x11-fin/b-push-gitlab-refs`** (REQ-FIN-20 fallback; PLAT-06; FIN-044/045; AC-FIN-20)
- Create `scripts/release/push-gitlab-refs.mjs`: dry-run by default (prints the exact `git push` per ref); `--apply` pushes exactly `main`, `next`, `release/4.x`, `release/4.1.x`, `next-*/**`, `4x-*/**`, `4x11-*/**`, `contract/**`, `sync/**`, tags `v*`; refuses when `CI` is set, when `$USER` is not the owner account, and while `.github/workflows/mirror-to-gitlab.yml` still contains `--prune` (reads the file from `origin/main`, never edits it); uses the existing Keychain GitLab credential through git's credential helper, never reads/prints tokens.
- Test: new `describe('push-gitlab-refs')` in `tests/ci/gitlab-status.test.ts` (FIN-B path) with a stubbed `git` on PATH: dry-run prints all ref patterns and pushes nothing; `--apply` under `CI=1` → exit 1; wrong `$USER` → exit 1; fixture workflow with `--prune` → exit 1 with message naming OD-8.
- Docs: `docs/release/decisions/gitlab-ci-verification.md` §"OD-8 owner action" with the exact owner steps (FIN-B.5 Owner list) and the fallback command. The agent never runs `--apply`.

**B3-4 `next-fin/b-artifacts` → `next` (+ `4x-fin/b-artifacts`, `4x11-fin/b-artifacts`)** (REQ-FIN-22; PLAT-51; FIN-050; AC-FIN-22)
- Every PLAT job (all 20: `plat:build:dist`, `plat:gate:glass-quality`, `plat:test:{pack-matrix,react19,visual-4x,canaries,cli,registry,docs}`, `plat:gate:{removal,change-class}`, `plat:integration:{next,vite}`, `plat:package:pack`, `plat:build:docs`, `pages`, `plat:release:{notes,verify-dist-tags}`, `plat:publish:npm`, `plat:audit:backdrop`, plus jobs added by B3-6..B3-12) writes only under `.artifacts/plat/$CI_JOB_NAME_SLUG/` via `.ag-evidence-{pr,nightly,release}` templates (14d/30d/90d, `name: evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA`, `when: always`); add the nightly 30d template; `AURAGLASS_EVIDENCE_DIR` defaults to that dir; pack, visual-4x, docs and release-notes outputs move there.
- `verify-ci-fragments.mjs` rule 5 rejects any PLAT artifact path outside `.artifacts/plat/<slug>/` (or a contract `PRODUCER_PATHS` entry); new failing fixture `tests/ci/fixtures/ci-fragments/rule5-plat-path/` using `.artifacts/pack/`.
- Hand-off (not FIN-B): `PRODUCER_PATHS`/paths in `scripts/release/lib/policy.mjs` → `.artifacts/plat/change-class.json` is a FIN-A REQ-FIN-10 edit; land after it or keep the old path as the producer path until it does.
- Tests: `tests/ci/plat-fragment.test.ts` asserts every job's `artifacts.paths` ⊂ `.artifacts/plat/<slug>/` ∪ producer paths; `tests/ci/verify-ci-fragments.test.ts` asserts the new fixture message.
- Acceptance (ledger PLAT-51): the fixture fails; a `release/4.x` pipeline shows archive `evidence-<slug>-<sha>` containing only `.artifacts/plat/<slug>/`.

**B3-5 `next-fin/b-plat-defects` → `next` (+ `4x-fin/b-plat-defects`, `4x11-fin/b-plat-defects`)** (REQ-FIN-22; PLAT-05 items 2, 6, 9, 11; PLAT-39 item 1; FIN-049/051; AC-FIN-22)
- `plat:test:pack-matrix`: replace `npm run prepublishOnly` with the explicit build + verify steps, then `npm publish --dry-run --ignore-scripts` (if `scripts/ci/require-ci-publish.js` must honour `npm_config_dry_run=true`, that is a FIN-C edit — request it, do not edit).
- Remove every remaining `|| echo PENDING` / `|| true` fail-open in `ci/plat.gitlab-ci.yml` on each line (`rg -n '\|\| *(echo|true)' ci/plat.gitlab-ci.yml` = 0); `{ echo "PENDING: …"; exit 1; }` guards stay (they fail closed).
- `plat:release:verify-dist-tags` also runs `node scripts/release/verify-release-comms.mjs --dist-tags` after publish (PLAT-34) into `.artifacts/plat/dist-tags.json`.
- 4x and 4x11: `plat:gate:glass-quality` gets `rules: if $CI_COMMIT_TAG → allow_failure: false` (from #126) and runs `npx jest --ci` and `npm run lint:check` on the release SHA (PLAT-39 item 3). PLAT-39 items 2 and 4 (`docs/release/decisions/4.1.1-lint-scope.md`, GlassCard PR link) are FIN-C files — FIN-B only supplies the pipeline URL once green.
- Tests: `tests/ci/plat-fragment.test.ts` asserts each item (removal paths exist on disk, no fail-open, pack-matrix has no `prepublishOnly`, dist-tags writes the json, change-class optional need — from B3-6).
- Acceptance (ledger PLAT-05): `plat-fragment.test.ts` assertions pass; a synthetic 4x tag pipeline with the four gates `allow_failure: true` exits 1 at `plat:package:pack` (`require-activated.mjs`); first green pipeline on each line recorded.

**B3-6 `next-fin/b-wire-change-class` → `next` (+ `4x-fin/b-wire-change-class`, `4x11-fin/b-wire-change-class`)** (§6.1 REQ-FIN-10 transfer; PLAT-05 item 8, PLAT-19; AC-FIN-10 CI half, AC-FIN-22)
- 5x: `plat:gate:change-class` → `stage: certify`, `needs: [{job: "qual:certify:l7", artifacts: true, optional: true}]`, plus optional needs on `mat:build:tokens` and `qual:certify:l10` where their artifacts are consumed. 4x: `needs: [{job: "plat:test:visual-4x", artifacts: true}]`, ordered after visual-4x. Reads `.artifacts/qual/visual-class.json` (5x) / `.artifacts/plat/plat-test-visual-4x/visual-class.json` (4x) — the reader is FIN-A's `classify-change.mjs`.
- Merge right after FIN-A's REQ-FIN-10 PR on each line (§20 step 7). Test: `plat-fragment.test.ts` asserts stage and needs.

**B3-7 `next-fin/b-wire-cli` → `next` (+ `4x-fin/b-wire-cli` from 4.3 scope)** (§6.1 REQ-FIN-09, REQ-FIN-40, -41; PLAT-89, 92, 93; AC-FIN-09 CI half)
- `plat:test:cli`: `npm test -w packages/cli -w packages/registry -w packages/mcp -w packages/labs`; `needs: plat:package:pack` (artifacts); `npx tsc -p tests/types/plat`. `plat:audit:backdrop`: `when: manual`, Playwright image `$AG_PLAYWRIGHT_IMAGE`, `-c packages/cli/audit/playwright.config.ts`.
- Merge after FIN-A REQ-FIN-09 (`jest.config.js` contract PR) and FIN-C's `tests/types/plat` land (§20 step 3). Test: `plat-fragment.test.ts`.

**B3-8 `next-fin/b-wire-docs` → `next` (+ `4x-fin/b-wire-docs`)** (§6.1 REQ-FIN-42, -43, -26; PLAT-94, 99, 102, 104; AC-FIN-26)
- `plat:test:registry` copies `registry-report.json` to `.artifacts/plat/$CI_JOB_NAME_SLUG/`; `plat:build:docs` runs after `plat:package:pack` with `needs`, derives the tgz path from `package.json` version; `plat:test:docs` runs the two docs gates named in PLAT-102's ledger row; `plat:build:docs` and `plat:release:notes` run the PLAT-104 claims chain; `pages` keeps `needs: plat:build:docs, plat:test:registry (optional)`.
- Merge after FIN-C's REQ-FIN-42/43 producer PRs. Test: `plat-fragment.test.ts`, `tests/ci/assemble-pages.test.ts`.

**B3-9 `next-fin/b-wire-pack` → `next` (+ 4x/4x11 for PLAT-11)** (§6.1 REQ-FIN-31, -38; PLAT-11, 104)
- `plat:package:pack` writes `.artifacts/plat/$CI_JOB_NAME_SLUG/pack-record.json` `{name: {file, integrity}}` from `npm pack --json` (PLAT-11); adds `TARBALL_MB` to `pack.env` (PLAT-104). Keep `require-activated.mjs` the first line.

**B3-10 `next-fin/b-wire-canaries` → `next` (+ `4x-fin/b-wire-canaries`)** (§6.1 REQ-FIN-38; PLAT-05 item 9, PLAT-72, 77)
- `plat:test:canaries`: add the Base UI latest reporting leg (`npm i --no-save @base-ui/react@latest` against the tarball; result written to `.artifacts/plat/<slug>/base-ui-latest.json`; gating mode exactly as PRD-1 REQ-PLAT-05 states — no invented exemption); wire PLAT-72's canary; canary reports `pending` (not pass) while entries are seed-excluded (PLAT-77, via the lane runner).

**B3-11 `4x11-fin/b-wire-411` → `release/4.1.x`, same-day `4x-fin/b-wire-411`** (§6.1 REQ-FIN-35; PLAT-50, 54)
- `plat:build:storybook` + `tsc` run on 4x CI (PLAT-50); `plat:test:visual-4x` produces before/after composites into its evidence dir (PLAT-54). Merge after FIN-C's 4x11 producer PRs; before the `v4.1.1` tag.

**B3-12 `4x-fin/b-wire-42` → `release/4.x`** (§6.1 REQ-FIN-36; PLAT-57, 36)
- `plat:build:dist` runs `verify-import-side-effects.js` in report mode over every dist file (PLAT-57); `plat:test:visual-4x` produces the 4.3 preview baselines artifact consumed by PLAT-36 (baselines only via the reviewed refresh job, never hand-updated).

**B3-13 `next-fin/b-records` → `next`, `4x-fin/b-records` → `release/4.x`** (REQ-FIN-23; PLAT-08; FIN-052–054; AC-FIN-23) — starts the day the first pipeline exists on each line
- `docs/release/decisions/gitlab-ci-verification.md`: 8 rows = {multi-ref push pipeline creation, SaaS runner tags on the tier, Playwright image existence, `--provenance` with `SIGSTORE_ID_TOKEN`} × {`next`, `release/4.x`}, each with result and the job/pipeline URL produced by the run (never typed numbers); multi-ref push stays `FAILED` until OD-8 is applied; if a fact fails, FIN-B drafts the §4.13.1/W-6 amendment for FIN-A's `contract/v1.2-final` PR.
- `docs/release/decisions/gitlab-project-settings.md`: one row per OD-11 setting (CI config path, protected tags `v*`, nightly schedules `next` and `release/4.x` (and `release/4.1.x` until 4.1.1 ships), Pages public, keep-latest-artifacts, AWS runner tag) with columns `status | appliedBy | date | evidence`; the agent writes the exact steps and leaves `status: missing` until the operator applies and dates each.
- `tests/ci/decision-records.test.ts` asserts the 4 named facts per line exist, and no PLAT-settable settings row is `missing` once tag `v4.1.1` exists.
- Records the first green pipeline URL per line (`next`, `release/4.x`, `release/4.1.x`).

**B3-14 Activation PRs (continuous)** (REQ-FIN-22 procedure, REQ-FIN-24; CMP-141, SURF-195, PLAT-38, 39; FIN-051, 055–056; AC-FIN-22, AC-FIN-24)
- PLAT jobs (FIN-B owns `ci/plat.gitlab-ci.yml`): after a `plat:*` job's first green pipeline on a line, branch `next-fin/b-activate-<job-slug>` (or `4x-fin/…`, `4x11-fin/…`) adds `{job, line, pipelineUrl, sha, date}` to `ci/plat/activation.json` and flips that job's `allow_failure: false` in the same PR. Order of priority: the four tag gates (`plat:gate:glass-quality`, `plat:integration:{next,vite}`, `plat:gate:change-class`), then `plat:package:pack`, `plat:gate:removal` (PLAT-79/82), `plat:test:docs` (PLAT-82), then the rest of `REQUIRED_JOBS ∪ CERT_JOBS`.
- Stream jobs: the stream WP (FIN-D `ci/mat`, FIN-E REQ-FIN-76 `ci/cmp`, FIN-F REQ-FIN-90 `ci/surf`, FIN-G REQ-FIN-101 `ci/qual`) opens the activation PR with the row + its own flip; FIN-B reviews (row matches a real green job URL on that line and SHA, `verify-ci-fragments` passes, `no-gate-bypass.test.ts` passes) and merges. FIN-B never flips a stream job. `qual:certify:release` is never `allow_failure`.
- Acceptance: AC-FIN-24 — every job in `ci/{mat,cmp,surf,qual}.gitlab-ci.yml` green on a `next` pipeline with an `activation.json` row and `allow_failure: false`; AC-FIN-22 — every `REQUIRED_JOBS ∪ CERT_JOBS` job activated.

**B3-15 CODEOWNERS content for `main`** (REQ-FIN-25; PLAT-17; C-10; FIN-059)
- FIN-B writes the `.github/CODEOWNERS` content (paths per `contracts/ownership.json`, `docs/release/**` and `ci/**` → owner) and hands it to FIN-A's `contract/v1.2-final` PR (FIN-463, base `main`); merges only after OD-16. FIN-B does not open a separate PR on `main`.

**B3-16 Pages on 4.x** (REQ-FIN-26; PLAT-07; FIN-062; AC-FIN-26) — no new branch: delivered by B3-1 (assemble-pages port + 4x `plat:build:docs` → `apps/docs/out`) and B3-8; acceptance observed after the first `release/4.x` pipeline.

FIN-B.3 count: 16 no-PR tasks (B3-1 … B3-16).

**FIN-B merge order (per line; PRD-F §20; each merge needs a green GitLab pipeline on the head SHA via `node scripts/ci/gitlab-status.mjs --sha <sha>`):**
- `next`: FIN-A `no-github-ci.json` baseline → #126 (trimmed) → B3-3 → B3-4 → B3-5 → wiring PRs each right after its producer: B3-7 after FIN-A REQ-FIN-09; B3-6 after FIN-A REQ-FIN-10; `next-fin/b-wire-fin31` after #127; `-plat68` after #169; `-plat78` after #179; `-plat79` after #180; `-plat82` after #184; B3-8/B3-9/B3-10 after their FIN-C producers → B3-13 when the first pipeline exists → B3-14 continuously.
- `release/4.x`: B3-1 → B3-3 → B3-4 → B3-5 → `4x-fin/b-wire-plat41` (with #132), `4x-fin/b-react19` (with #144), `-fin32` (after #128 trimmed), `-plat62` (after #163), `-plat63` (after #164), B3-6, B3-11 cherry-picks, B3-12 → B3-13 → B3-14.
- `release/4.1.x`: B3-2 → B3-3 → B3-4 → B3-5 → `4x11-fin/b-wire-plat41` (with #131), `4x11-fin/b-react19` (with #143), B3-11 → activation rows → before `v4.1.1`.
- FIN-B owns no deprecation-fragment or CSS-sweep PRs; none of its PRs need a regenerate step.

### FIN-B.4 Validation (GitLab CI only; `allow_failure: false` where stated)

Local runs are limited to `npx jest tests/ci/<file>.test.ts tests/release/branch-protection.test.ts` and `node scripts/ci/verify-ci-fragments.mjs`; any lane invoked locally exits 2 with the remote command. No Docker on this Mac; no GitHub Actions.

| AC | Must be green / observed in GitLab | Lines | Remote-only |
|---|---|---|---|
| AC-FIN-20 | Any pipeline exists for `origin/next` and `origin/release/4.x` SHAs: `node scripts/ci/gitlab-status.mjs --sha $(git rev-parse origin/next)` and `… origin/release/4.x` print a pipeline URL (and `success` for the PLAT-06 ledger AC); same for `release/4.1.x` before 4.1.1 | next, 4.x, 4.1.x | yes (needs OD-8) |
| AC-FIN-21 | Root `contract:ci-fragments` job prints `contract:ci-fragments OK` with `allow_failure: false` (after FIN-D REQ-FIN-53; until then it names only `ci/mat.gitlab-ci.yml` jobs); `plat:gate:glass-quality` (or the root contract job) runs `tests/ci/no-github-ci.test.ts` + `tests/ci/verify-ci-fragments.test.ts` green | next, 4.x | yes |
| AC-FIN-22 | Synthetic tag pipeline on a throwaway tag ref prepared by the owner (or a pipeline with `CI_COMMIT_TAG` set via a manual run variable) with the four gates `allow_failure: true` → `plat:package:pack` exits 1 at `require-activated.mjs`; then on the real tag pipeline every `REQUIRED_JOBS ∪ CERT_JOBS` job is `allow_failure: false` with an activation row; `no-gate-bypass.test.ts` green | 4.x (synthetic), all lines (activation) | yes |
| AC-FIN-23 | 8 rows in `gitlab-ci-verification.md` each with a job/pipeline URL; `decision-records.test.ts` green; first green pipeline URL per line | next, 4.x | yes + operator |
| AC-FIN-24 | Every `mat:*`, `cmp:*`, `surf:*`, `qual:*` job green on one `next` pipeline, each with an activation row and `allow_failure: false` | next | yes |
| AC-FIN-25 | `tests/ci/no-forward-merge.test.ts` (fixture fails, real history passes), `tests/release/branch-protection.test.ts` (mocked `gh`) green in CI; `branch-policy.md` contains `forward-port` and `2 business days` on both lines; live `node scripts/release/verify-branch-protection.mjs` exits 0 for `main`, `next`, `release/4.x`, `release/4.1.x` (run by agent read-only after the owner applies protection) | next, 4.x, 4.1.x | live run read-only |
| AC-FIN-26 | `pages` job green on `release/4.x` (and `next`); `curl -sI https://chahal-foundation-group.gitlab.io/github-auraoneai/auraglass/` → 200; `/lab/` redirects (relative) into `storybook/?path=/story/lab-`; `tests/ci/assemble-pages.test.ts` green | 4.x (+ next) | yes |

PLAT-39 ledger AC also needs: a `release/4.x` pipeline with `plat:gate:glass-quality` green and `allow_failure: false`, jest summary 0 failed suites, URL recorded in FIN-C's `4.1.1-lint-scope.md`. PLAT-51 ledger AC: `release/4.x` artifact archive `evidence-<slug>-<sha>` contains only `.artifacts/plat/<slug>/`.

### FIN-B.5 Exit criteria

Agent-completable (code + tests + green activated job URL recorded in the ledger row):
- [ ] AC-FIN-21 — REQ-PLAT-02, REQ-PLAT-04 (next and 4.x; needs FIN-D REQ-FIN-53 for `OK`)
- [ ] AC-FIN-22 — REQ-PLAT-05, REQ-PLAT-39, REQ-PLAT-51 (incl. all §6.1 wiring B3-6…B3-12 and FIN-B.1b re-authored hunks)
- [ ] AC-FIN-26 — REQ-PLAT-07
- [ ] AC-FIN-25 code half — REQ-PLAT-10 done; REQ-PLAT-17 code done (live run pending owner)
Blocked on owner/operator (report `blocked-owner` with the exact action, never `done`):
- [ ] AC-FIN-20 — REQ-PLAT-06 (OD-8)
- [ ] AC-FIN-23 — REQ-PLAT-08 (OD-8 + OD-11)
- [ ] AC-FIN-24 — integration of REQ-CMP-141, REQ-SURF-195, MAT (REQ-FIN-53), QUAL (REQ-FIN-101) (OD-8 + stream WPs)
- [ ] AC-FIN-25 live half — REQ-PLAT-17 (OD-14, protection writes, C-10 via OD-16)
- [ ] `ci/plat/activation.json` has a row for every `plat:*` job on every line it runs on; `rg -n '\|\| *(echo|true)' ci/plat.gitlab-ci.yml` = 0 on all three lines; `scripts/ci/verify-branch-protection.mjs` does not exist.

#### Owner / operator actions (Gurbaksh or operator only; the agent prepares, never performs or fakes them)

(a) Agent prep: B3-3 script + test; `gitlab-ci-verification.md` §"OD-8 owner action"; `gitlab-project-settings.md` checklist rows; B3-15 CODEOWNERS content; branch-protection payloads printed by `verify-branch-protection.mjs --print-payload` (if added) for review; draft OD-8/OD-11/OD-14 decision text handed to FIN-H (`docs/release/decisions/od-*.md` is FIN-H's file).

(b) Owner steps:
1. **OD-8** (unblocks AC-FIN-20/23/24 and every merge): create a fine-grained GitHub PAT for `auraoneai/auraglass` with Contents: read, Metadata: read (only Gurbaksh creates it; never copied from this Mac). GitLab project 87152036 → Settings → Repository → Mirroring repositories → add **pull** mirror `https://github.com/auraoneai/auraglass.git` with that PAT; "Mirror only protected branches" **off**; "Trigger pipelines for mirror updates" **on**; "Overwrite diverged branches" **on**. Once the pull mirror has synced `next` and `release/4.x` and pipelines appear, disable the org `mirror-to-gitlab` workflow for this repo only (it force-pushes with `--prune`). Record the date in `gitlab-ci-verification.md`. **Fallback** if no PAT: remove the `--prune` step from `mirror-to-gitlab` for this repo, then after each merge run from the owner Mac `node scripts/release/push-gitlab-refs.mjs` (dry-run, review) and `node scripts/release/push-gitlab-refs.mjs --apply`.
2. **OD-11** (operator with an existing `glab` login): set CI config path `.gitlab-ci.yml`; protect tags `v*`; nightly schedules on `next`, `release/4.x` (and `release/4.1.x` until 4.1.1); Pages visibility public; "Keep artifacts from most recent successful jobs" on; AWS runner tag registered; date each row in `docs/release/decisions/gitlab-project-settings.md`.
3. **Synthetic tag pipeline for AC-FIN-22**: the owner pushes a throwaway tag (e.g. `v4.2.0-gatecheck.1`, never published) on `release/4.x` or approves a manual pipeline with `CI_COMMIT_TAG` set; delete the tag afterwards.
4. **OD-14**: choose second reviewer, review bot, or documented admin bypass; then apply branch protection on `main`, `next`, `release/4.x`, `release/4.1.x` (linear history, `required_approving_review_count ≥ 1`, status context if OD-9 is on). **OD-9**: decide GitLab → GitHub status reporting. **OD-16**: approve the contract bundle so C-10 CODEOWNERS lands on `main`.
5. Confirm `forward-port` label exists on GitHub (`gh label create forward-port` is a repo write the owner approves once).


---

## 7. WP FIN-C — Platform and release leftovers (PLAT) and the release train

Source: PRD-F §5.3, REQ-FIN-30..45 (92 original REQ-PLAT rows in Appendix A.1: PLAT-03, 11–16, 18, 20–36, 38, 40–50, 52–106). Tasks FIN-063..171 and FIN-483. Status input: `implementation-audit/status-2026-10-10/FIN-C.md`. Remaining-work and acceptance text per original REQ: `implementation-audit/fin-open-ledger.json` (binding; a stricter PRD-F §5.3 bullet wins).

Verified 2026-10-10 (re-verify at Step 0): `next` e5a2d6835, `release/4.x` 645735fce (`package.json` version 4.1.1), `release/4.1.x` a19f4bbe1 (version 4.1.1, 20 direct-pushed commits on top of `78fd7bda1`, no PR). Tags: only `v4.0.0`, `v4.1.0` in the 4.x series; npm `latest` = 4.1.0. **0 FIN-C REQ-FIN is done**; 0 of the 73 FIN-C PRs (#127–#199) is merged; every one has 0 status checks (GitLab 87152036 has 0 pipelines, OD-8). `legacy/` = 239 files on `next`. Absent on every line: `tests/release/publish.test.ts`, `docs/release/trusted-publishers.md`, `src/internal/cn.ts`, `packages/cli/schema/audit-backdrop.json`, the docs MDX route (`apps/docs/app/` has only `layout.tsx`, `page.tsx`, `globals.css`), a real `@auraglass/mcp` (only `packages/mcp/src/server.ts`).

**May touch / must not touch**: PRD-F §6 FIN-C row exactly (as in the previous prompt). Every PR below that edits a non-FIN-C path is trimmed: the hunk is moved to a PR of the owning WP (named in the row), never merged from a FIN-C branch. Recurring foreign hunks: `ci/plat.gitlab-ci.yml` → FIN-B (REQ-FIN-22, §6.1); `ci/mat.gitlab-ci.yml`, `tokens/**`, `scripts/tokens/**`, `src/tokens/generated/**`, `src/theme/**`, `fragments/*/mat.ts` → FIN-D (FIN-A where §6 names the file: `tokens/$schema.json`, `tokens/legacy/**`, `scripts/tokens/{build,freeze-4x,drift}.mjs`); `scripts/build/{generate-exports.mjs,lib/graph.mjs}`, `package.json` keys `exports`/`main`/`types`, `scripts/release/{classify-change.mjs,lib/policy.mjs}`, `packages/cli/test/fixtures.test.ts`, `scripts/integration/baselines/**` → FIN-A; `src/contracts/**`, `contracts/**` → FIN-463 contract PR; `src/compat/cmp/**`, CMP CSS/TSX → FIN-E; `src/compat/surf/**`, SURF files, `packages/labs/**` → FIN-F (REQ-FIN-87 for labs); `docs/release/decisions/{operator-*.md,removals/RM-*.json,downstream-*.json}` → FIN-H (operator/owner-produced records); stream `etc/api/{<entry>,root.<s>,compat.<s>}.*` → owning stream (contract B22a; FIN-C regenerates them only as CI artifacts). Tracked `deprecations.json` hunks are dropped everywhere (PLAT-24 untracks it; it is generated at `prepack`).

Per-PR procedure (every row): worktree per PR; `gh pr checkout <n>`; `git rebase origin/<base>` (no force-push to shared branches — push the rebased result to a new branch `<old-head>-r1` and open a replacement PR that names the old one, then close the old one with "superseded by #new"; if the PR head branch is the agent's own FIN branch, a normal push of new commits on top is preferred); trim as stated; run the narrow local check named in the row; push; merge only when `node scripts/ci/gitlab-status.mjs --sha <head>` reports a green pipeline with every job the row lists at `allow_failure: false` (Common rules). Until OD-8 lands no PR merges; keep rebasing in slot order.

### FIN-C.1 Land existing open PRs

Slots: `N<k>` = `next` (FIN-A gates from PRD-F §20 in brackets), `P<k>` = `release/4.1.x`, `X<k>` = `release/4.x`. Inside a slot, listed order. **Deprecation-file PRs** (marked DEP) merge strictly one at a time; after each merge run `node scripts/release/gen-deprecations.mjs --schema --check` and `node scripts/release/verify-deprecations.mjs` (both lines' names as on the line) and rebase the next DEP PR. **CSS-sweep PRs** (marked CSS) likewise one at a time with `node scripts/build/verify-css-files.mjs` and the FIN-A baselines regenerated in between. Mergeable states below were re-read with `gh pr view` on 2026-10-10.

#### `next` (35 PRs)

| PR | Line | REQ-FIN / REQs | Action | Exact conflict / gap to fix | Slot |
|---|---|---|---|---|---|
| #127 | next | 30, 31, 32, 33, 34 / PLAT-03, 11–16, 18, 20, 22–36, 38 | SPLIT, then CLOSE #127 as superseded by the five PRs | CONFLICTING/DIRTY, 223 files, 17 commits. Split by commit into `next-fin/c-ownership` (caa0e9bbd: `scripts/ci/verify-ownership.mjs` + `tests/ci/verify-ownership.test.ts`, cases a–g), `next-fin/c-publish` (66b3e2107, af4e94180: publish/pack-record/dist-tag/dry-run/require-ci-publish, `tests/release/publish.test.ts`, `docs/release/trusted-publishers.md`, `packages/{cli,registry,mcp}/PUBLISHING.md`, `prepublish:verify`), `next-fin/c-change-control` (c9f0cea8a: `api-report --all --check`, PLAT-22), `next-fin/c-deprecations` DEP (fc7fb7eea, 412aa7fc6, 230ba0bcd, 641852e99, cbb52a3a5, 5f6cbc907, ad72e0dae: PLAT-24..30), `next-fin/c-records` (a4daa4f2a, 9bf126531, 788f00512, e0f266e72, 9c51d37aa, 9acea8d8d: PLAT-31..36). Drop: `ci/plat.gitlab-ci.yml` → FIN-B; `fragments/deprecations/{cmp,mat,surf}.ts` → FIN-E/D/F; 19 `src/compat/cmp/**` TSDoc hunks → FIN-E (PLAT-27 clause in CMP files); `packages/labs/{package.json,PUBLISHING.md}` → FIN-F REQ-FIN-87; `contracts/lint-rule-owners.json` → FIN-463; `deprecations.json`; stream `etc/api/*` reports. Gaps: `src/internal/cn.ts` itself is missing (lint rule lands without the file) — add it in `c-deprecations`; release-notes `dist-maps.tgz` line coverage (C.3-4). | N1 ownership (after FIN-A step 1 remainder and FIN-B #126); N3 publish; N4 change-control; N5 deprecations DEP (queues behind FIN-A #125 in the §20 step 7 DEP queue); N6 records |
| #165 | next | 37 / PLAT-64 (+ REQ-FIN-01 prettier transfer) | MERGE as is | CLEAN; `package.json` keys `devDependencies.prettier`/`yaml` only (FIN-C keys). First FIN-C next merge because FIN-A's `prettierFormat` throws without the pin. | N2 (right after FIN-A step 1) |
| #166 | next | 37 / PLAT-65 | MERGE as is | CLEAN, no overlap. | N7 |
| #167 | next | 37 / PLAT-66 | MERGE as is | CLEAN; shares `scripts/build/post.mjs` with #175 — #175 rebases after it. | N7 |
| #171 | next | 37 / PLAT-70 | MERGE as is | CLEAN; cold-import median must be CI-measured (no local timing in the PR body counts). | N7 |
| #168 | next | 37 / PLAT-67 | TRIM, then merge | CLEAN but edits FIN-A files `scripts/build/generate-exports.mjs`, `scripts/build/lib/graph.mjs` and `package.json` `exports`/`types` (`./icons/*` rows, top-level `types`). Move those hunks to a FIN-A PR (`next-fin/a-exports-plat67`, merged with/after #114); keep `build/v4-exports.snapshot.json`, `build/exports.manifest.json` consumer side and the six `tests/exports/*` suites. `css` condition stays out until OD-16 (C-x). Overlaps #127 (manifest), #170, #174, #177, #178. | N8 [after FIN-A #114] |
| #169 | next | 37 / PLAT-68 | TRIM, then merge | CLEAN; drop the `ci/plat.gitlab-ci.yml` pack-matrix legs → FIN-B PR. Needs REQ-FIN-06 (#114) merged first. | N8 |
| #170 | next | 37 / PLAT-69 | TRIM, then merge | CLEAN; drop `scripts/build/lib/graph.mjs` hunk → FIN-A; drop the `legacy/src/server/{index,registryGuard}.ts` deletion (kept only in #184, which is gated on OD-21 archive verification). | N8 |
| #172 | next | 37 / PLAT-71 | REBASE+RESOLVE then merge | CONFLICTING/DIRTY; overlaps #173/#178 (`scripts/ci/run-{next,vite}-integration.mjs`) and #177/#178 (`docs/size-budgets.changelog.md`). `d3-scale`/`d3-shape` peer removal stands unless OD-16 approves C-6; D-26 calibration reports `pending` while Button/Dialog are seed-excluded. | N8 |
| #174 | next | 37 / PLAT-73 | REBASE+RESOLVE + TRIM, then merge | CONFLICTING/DIRTY. Drop `tokens/$schema.json`, `tokens/legacy/4x-rendered.tokens.json`, `scripts/tokens/validate.mjs`, `src/tokens/generated/manifest.ts` (FIN-A/FIN-D, already on next via #369), `scripts/build/generate-exports.mjs` and `package.json` `css`/`default` export conditions (FIN-A + OD-16), the 14 stream-owned `etc/api/{charts,data,date,icons,material,three,tokens}.*` files (B22a; generated in CI). Keep `scripts/build/api-report.mjs` ROOT fix, `rewrite-dts-aliases.mjs`, `.attw.json`, `canaries/types-strict/**`, `tests/exports/api-report-inputs.test.ts`. 13-file overlap with #127 is resolved by the split. | N8 |
| #191 | next | 40 / PLAT-91 | TRIM, then merge | CLEAN; drop `packages/cli/test/fixtures.test.ts` (FIN-A REQ-FIN-09) and the 78 `fragments/codemods/{cmp,mat,surf}/fixtures/**/pending.txt` placeholders (stream-owned; placeholder files are a prohibited shortcut — unknown ids are reported `pending` by FIN-A's discovery instead). Keep `catalogue.json` `minCases`, catalogue-coverage, fixtures-typecheck, deprecation-coverage. | N9 [after FIN-A #115] |
| #196 | next | 42 / PLAT-96 | MERGE as is (after #115) | CLEAN; depends on REQ-FIN-09 `aura-glass` mapping; serialise its `package.json` script hunk with #192–#198. | N9 |
| #175 | next | 38 / PLAT-74 | REBASE+RESOLVE + TRIM (CSS) | CONFLICTING/DIRTY. Drop 15 non-FIN-C CSS files (`src/{ai,backdrops,media}/**` → FIN-F, `src/components/{button,combobox,popover,sheet,tooltip}/*.css` → FIN-E, `src/material/css/material.css` → FIN-D/FIN-A REQ-FIN-02) and `tokens/**`, `scripts/tokens/**`, `src/tokens/generated/**`. Keep `scripts/build/lib/css.mjs`, `scripts/build/post.mjs` (rebase on #167), `src/compat/css/{globals,reset}.css`, `build/css-ownership.json`, the `tests/css/*` suites; offenders the new gates find go to the FIN-A expiring baseline, never fixed here. | N10 [after FIN-A #116 (step 4) and #117 (step 5)] |
| #176 | next | 38 / PLAT-75 | REBASE+RESOLVE + TRIM (CSS) | CONFLICTING/DIRTY; drop `tokens/$schema.json`, `tokens/legacy/*`, `scripts/tokens/validate.mjs`, `src/tokens/generated/manifest.ts`. Keep `gen-tailwind-bridge.mjs`, `tests/css/tailwind-bridge.test.ts`, `canaries/vite-tailwind4/**`. | N10 after #175 |
| #177 | next | 38 / PLAT-76 | REBASE+RESOLVE + TRIM | CONFLICTING/DIRTY; drop tokens/scripts-tokens/generated hunks, `fragments/size-budgets/mat.ts` (FIN-D), `package.json` `./internal` export (FIN-A). Merge **before** #178 (11 shared files). | N10 after #176 |
| #178 | next | 38 / PLAT-77 | REBASE+RESOLVE + TRIM | CONFLICTING/DIRTY, stacked on #177: rebase onto `next` after #177 merges and drop #177's commit. Drop `ci/mat.gitlab-ci.yml` (FIN-D), `src/theme/{createGlassTheme,public}.ts` (FIN-D REQ-FIN-52), `src/root/surf.ts` (FIN-F), `fragments/size-budgets/{mat,surf}.ts`, `package.json` `exports` rows (FIN-A), token hunks. Canary job reports `pending` (never pass) while `./theme` is seed-excluded. | N10 after #177 |
| #179 | next | 38 / PLAT-78 | TRIM, then merge | CLEAN; drop `ci/mat.gitlab-ci.yml` (FIN-D) and `ci/plat.gitlab-ci.yml` (FIN-B). Merge **before** #180. | N10 after #178 |
| #173 | next | 37 / PLAT-72 | SPLIT | CONFLICTING/DIRTY; 54 conversions in other WPs' files. Hand conversions to owners: CMP files → FIN-E REQ-FIN-70 (CMP-03), SURF/app-shell/charts/data/media → FIN-F REQ-FIN-80 (SURF-10), `AuraGlassProvider.tsx` → FIN-A REQ-FIN-04, `src/primitives/{DismissableLayer,FocusScope}.tsx` → FIN-A REQ-FIN-07. FIN-C keeps `tests/react19/no-forwardref.test.ts` (filter removed; remaining offenders as rows handed to FIN-A's expiring baseline), `floor-imports.test.mjs` (19.0.0 + 19.2.x/19.3.x), `canaries/vite-compiler/tests/smoke.spec.ts`, `scripts/ci/verify-compiler.mjs`. Drop `tokens/$schema.json`, `deprecations.json`. Close #173 when the FIN-C part and owner PRs are open. | N11 (after N10; owners' PRs land in their own slots) |
| #180 | next | 39 / PLAT-79 | REBASE+RESOLVE + TRIM | CONFLICTING/DIRTY, stacked on #179: rebase after #179 merges and drop its commit. Drop `ci/{mat,plat}.gitlab-ci.yml`, `deprecations.json`, the 13 `docs/release/decisions/removals/RM-01..13.json` (FIN-H operator records — agent-written RM records are forbidden), and any `legacy/src/server/**` path (only #184 deletes it). It deletes 82 of 239 `legacy/**` files; the other 157 are C.3-13. Overlaps #181 (`docs/inventory/component-dispositions.md`). | N12 |
| #181 | next | 39 / PLAT-80 | REBASE + TRIM | CLEAN; rebase after #180. Move `scripts/release/gen-component-dispositions.mjs` to `scripts/removal/gen-component-dispositions.mjs` (PRD: generator lives in `scripts/removal/`); drop its `scripts/release/consumer-grep.mjs` (#182 owns the move). Verify GlassHoverCard → Popover `openOnHover`, GlassTimelineRail/GlassAdvancedDataViz removed. | N12 after #180 |
| #182 | next | 39 / PLAT-81 | MERGE as is | CLEAN; tool + fixture only — the RM-01..13 consumer-grep runs are FIN-H REQ-FIN-113. | N12 |
| #183 | next | 39 / PLAT-83 | TRIM, then merge | CLEAN; drop `scripts/ci/assemble-pages.mjs` (FIN-B; it conflicts with #126); make `scripts/docs/gen-redirects.mjs` write `apps/docs/public/_redirects` (one 301 per docs path deleted in `4842edc5e` + `/v4/*`) and commit it; rename `tests/docs/redirects.test.mjs` → `redirects.test.ts` per PRD. | N12 (after FIN-B #126) |
| #184 | next | 39 / PLAT-82 | TRIM, then merge only after OD-21 | CLEAN; drop `ci/plat.gitlab-ci.yml` (FIN-B) and `docs/release/decisions/removals/RM-01.json` (FIN-H). Merge only when the owner-created private `auraoneai/auraglass-server-archive` exists and `node scripts/removal/verify-archive.mjs` is byte-identical in CI. Sole deleter of `legacy/src/server/**`. | N12 last (blocked-owner OD-21) |
| #185 | next | 40 / PLAT-84 | MERGE as is | CLEAN; shares `packages/cli/src/commands/add.ts` with #186/#188, `schema/SOURCE.md` with #188. CLI PRs merge one at a time in this order, each rebased on the previous. | N13-1 |
| #186 | next | 40 / PLAT-85 | REBASE after #185 | shares `add.ts`, `update.ts`, `init.ts`, `migrate.ts` with #185/#187/#188/#190. | N13-2 |
| #187 | next | 40 / PLAT-86 | REBASE after #186 | `init.ts` overlap; `init` ≤2 s measured in CI. | N13-3 |
| #188 | next | 40 / PLAT-87 | REBASE after #187 | `add.ts`/`update.ts`/`SOURCE.md` overlap; schema pinned by sha256. | N13-4 |
| #189 | next | 40 / PLAT-88 | MERGE as is | CLEAN; frozen `doctor-v5.expected.json`; timings CI-measured. | N13-5 |
| #190 | next | 40 / PLAT-90 | TRIM + REBASE after #186 | drop `fragments/codemods/{mat,surf}.ts` (FIN-D/FIN-F) and `src/contracts/fragments.ts` (FIN-463 contract PR). | N13-6 |
| #192 | next | 40 / PLAT-92 | REBASE (package.json scripts) | CLEAN but its `package.json` `description`/`artifact:deps`/`plat:*` script lines collide with #193/#194/#196/#198 — drop the `description` edit (not in scope), rebase each in turn. Playwright canary runs **remote only**. | N13-7 (after #191) |
| #193 | next | 41 / PLAT-93 | MERGE as is | CLEAN; `.gitignore` overlap with #127-split; needs `.artifacts/pack` (pending when absent). | N13-8 |
| #194 | next | 42 / PLAT-94 | MERGE as is | CLEAN; script-line rebase only. | N13-9 |
| #195 | next | 42 / PLAT-95 | MERGE as is | CLEAN; 56 lint violations → 0. | N13-10 |
| #197 | next | 42 / PLAT-98 | MERGE as is | CLEAN. | N13-11 |
| #198 | next | 42 / PLAT-97 | MERGE as is | CLEAN; must read `CI_COMMIT_SHA` (removes the REQ-FIN-21 baseline row in the same PR); full capture matrix **remote**. | N13-12 |

#### `release/4.1.x` (14 PRs, all MERGEABLE/CLEAN, 0 checks)

Precondition P0 (C.3-1): the `4x11-` ownership rule ported to `release/4.1.x` and FIN-B #126 ported, else every row fails `contract:ownership`. Each 4.1.x merge is followed **the same day** by its 4.x twin (next table) as `git cherry-pick -x <4.1.x merge commit>`.

| PR | Line | REQ-FIN / REQs | Action | Exact conflict / gap to fix | Slot |
|---|---|---|---|---|---|
| #129 | 4.1.x | 35 / PLAT-40 | MERGE as is (DEP) | edits `fragments/deprecations/plat.ts` (DEP-P0012) — DEP queue #129 → #133 → #135. | P1 |
| #133 | 4.1.x | 35 / PLAT-42 | REBASE after #129 (DEP) | `plat.ts` (DEP-P0013). | P2 |
| #135 | 4.1.x | 35 / PLAT-43 | REBASE after #133 (DEP) | `plat.ts` data-attr/behaviour entries. | P3 |
| #131 | 4.1.x | 35 / PLAT-41 | TRIM | drop `ci/plat.gitlab-ci.yml` → FIN-B `4x11-fin/b-*`. | P4 |
| #137 | 4.1.x | 35 / PLAT-44 | MERGE as is | CI-measured hook count. | P4 |
| #139 | 4.1.x | 35 / PLAT-45 | MERGE as is | `next build` canary remote. | P4 |
| #141 | 4.1.x | 35 / PLAT-46 | MERGE as is | merge before #143 (shared `src/primitives/Slot.tsx`, `4.1.1-react-19-matrix.md`). | P5 |
| #143 | 4.1.x | 35 / PLAT-47 | REBASE after #141 + TRIM | drop `ci/plat.gitlab-ci.yml` → FIN-B; flip react19 leg only after green. | P6 |
| #145 | 4.1.x | 35 / PLAT-48 | MERGE as is | 36 files; regenerate the 35-file table from `rg` in the PR. | P7 |
| #147 | 4.1.x | 35 / PLAT-49 | MERGE as is | — | P7 |
| #149 | 4.1.x | 35 / PLAT-50 | MERGE as is | Storybook build + `tsc` green on 4.1.x CI. | P7 |
| #151 | 4.1.x | 35 / PLAT-52 | MERGE as is | GitHub Release text edit is FIN-H operator. | P7 |
| #153 | 4.1.x | 35 / PLAT-53 | MERGE as is | advisory draft only; GHSA publish = OD-21 before the tag. | P7 |
| #155 | 4.1.x | 35 / PLAT-54 | TRIM | move `tokens/personas/default.json` font hunk to a FIN-D `4x11-fin/d-font-stack` PR merged in the same slot; before/after composites from `plat:test:visual-4x` artifacts. | P8 |

#### `release/4.x` (24 PRs, all MERGEABLE/CLEAN, 0 checks)

Precondition X0 (C.3-1): `4x-fin/c-ownership` port of the `4x11-`/FIN prefix rule. Each twin is valid only if `git range-diff <4.1.x PR base>..<4.1.x head> <4.x base>..<4.x head>` shows no content difference beyond context; otherwise re-create it with `git cherry-pick -x` of the merged 4.1.x commit and close the old twin as superseded.

| PR | Line | REQ-FIN / REQs | Action | Exact conflict / gap to fix | Slot |
|---|---|---|---|---|---|
| #128 | 4.x | 32, 33, 34, 31 (PLAT-16), 35 (PLAT-55) / PLAT-16, 18, 20, 22–25, 27, 29, 31–36, 55 | TRIM, then merge first on 4.x | 17 commits; 16 are subject-identical to the 20 direct pushes on 4.1.x (b486cd112, d2e54fe42, ceed1ab12, b80a2e386, 543866512, 860c7fda5, 388c19a4c, 9e9329999, 22b6cf353, 40c5b2bcc, 7363ec27a, ab4ba3d92, 7ba35a050, 0a10b2730, f8f2ba1d3, 0d3412a30). Decision for this prompt (OD-13 records it): the 4.1.x direct pushes are canonical on 4.1.x; #128 is the **one** 4.x route for them — re-create its branch as `git cherry-pick -x` of those 16 4.1.x SHAs plus cc44c413e (4.2.0-pre.0 bump + all-key api reports), so the trailers prove identity, and never cherry-pick them to 4.x again. Drop the `ci/plat.gitlab-ci.yml` hunk (22b6cf353's 4x twin bda47de4a) → FIN-B `4x-fin/b-*`. Fix the `.gitignore` `build/` pattern to `/build/` instead of force-adding `scripts/build/api-report.mjs`. Shares `README.md` with #152. | X1 |
| #130 | 4.x | 35 / PLAT-40 | MERGE as is (DEP) | twin of #129 (same 3 files); DEP queue on 4.x: #130 → #134 → #136 → #157 → #159. | X2 same day as P1 |
| #132 | 4.x | 35 / PLAT-41 | TRIM | twin of #131; drop `ci/plat.gitlab-ci.yml`. | X2 with P4 |
| #134 | 4.x | 35 / PLAT-42 | REBASE after #130 (DEP) | twin of #133. | X2 with P2 |
| #136 | 4.x | 35 / PLAT-43 | REBASE after #134 (DEP) | twin of #135. | X2 with P3 |
| #138 | 4.x | 35 / PLAT-44 | MERGE as is | twin of #137. | X2 with P4 |
| #140 | 4.x | 35 / PLAT-45 | MERGE as is | twin of #139. | X2 with P4 |
| #142 | 4.x | 35 / PLAT-46 | MERGE after range-diff | +164/-38 vs #141 +154/-29 on the same 6 files — prove the extra lines are 4.x context, else re-cherry-pick. | X2 with P5 |
| #144 | 4.x | 35 / PLAT-47 | REBASE+RESOLVE (re-cherry-pick) + TRIM | 10 files vs #143's 6: it re-carries PLAT-46's `AuraGlassClientBoundary.tsx`, `clientBoundary.hydration.test.tsx`, `useDeviceCapabilities.ts`, `useEnhancedReducedMotion.ts` (6-file overlap with #142). Re-create from #143's merged commit after #142; drop `ci/plat.gitlab-ci.yml`. | X2 with P6 |
| #146 | 4.x | 35 / PLAT-48 | REBASE+RESOLVE (re-cherry-pick) | same 36 files as #145 but +285/-122 vs +688/-429: not a cherry-pick. Re-create via `cherry-pick -x` of #145's merge, resolve, and list in the PR any site already converted on 4.x. | X2 with P7 |
| #148 | 4.x | 35 / PLAT-49 | MERGE as is | twin of #147. | X2 with P7 |
| #150 | 4.x | 35 / PLAT-50 | MERGE as is | twin of #149. | X2 with P7 |
| #152 | 4.x | 35 / PLAT-52 | REBASE after #128 | twin of #151; `README.md` overlap with #128. | X2 with P7 |
| #154 | 4.x | 35 / PLAT-53 | MERGE as is | twin of #153. | X2 with P7 |
| #156 | 4.x | 35 / PLAT-54 | TRIM | twin of #155 (+154/-14 vs +151/-10 — range-diff); move `tokens/personas/default.json` to the FIN-D `4x-fin/d-font-stack` twin; shares `src/components/charts/GlassDataChart.tsx` with #199 — merge #156 first. | X2 with P8 |
| #157 | 4.x | 36 / PLAT-56 | TRIM (DEP) | drop `scripts/release/{classify-change.mjs,lib/policy.mjs}` install-level cases → FIN-A REQ-FIN-10 (#124, §6.1 transfer); merge after #124 (FIN-A) and #136. | X3 |
| #158 | 4.x | 36 / PLAT-57 | MERGE as is | 4.x `package.json` `import`/`require` rows for `./forms`, `./data` are PLAT-57 scope on 4.x (FIN-A's generator owns only `next`); shares `scripts/build-all.js` with #161 — merge first. | X3 |
| #159 | 4.x | 36 / PLAT-58 | REBASE after #157 (DEP) | `plat.ts`; shares `src/workspace/index.tsx` with #160 — merge first. | X3 |
| #160 | 4.x | 36 / PLAT-59 | REBASE after #159 | the four `docs/release/visual-fixes/*.json` must carry contrast numbers written by the measuring tool with artifact URL; hand-entered values → set `pending` until `plat:test:visual-4x` writes them. | X3 |
| #161 | 4.x | 36 / PLAT-60 | REBASE after #158 | `scripts/build-all.js` overlap. | X3 |
| #162 | 4.x | 36 / PLAT-61 | MERGE as is | — | X3 |
| #163 | 4.x | 36 / PLAT-62 | TRIM | drop `docs/release/decisions/operator-codemods-qual.md` (FIN-H file; the agent drafts it in FIN-H prep for owner sign-off) and `ci/plat.gitlab-ci.yml` (FIN-B adds the tag-pipeline coverage step and `@auraglass/cli@0.x` publish job). | X3 |
| #164 | 4.x | 36 / PLAT-63 | TRIM | drop `ci/plat.gitlab-ci.yml` → FIN-B; `consumer-4x` FROZEN marker only after its first green run. | X3 |
| #199 | 4.x | 35 / PLAT-48 (sub-rows; title wrongly says PLAT-100–105) | TRIM + retitle | removes `useGalileoStateSpring`/`useAuraStateSpring` exports in a 4.x minor with no DEP entry and no 4.1.x twin. Restore both exports, add a DEP-P entry (kind `export`, `removeIn: '5.0.0'`) + `warnDeprecated` call (DEP queue after #159), keep `consent-lifecycle.test.tsx` and the remote `reduced-motion-4x.spec.ts`; retitle "fix(motion): PLAT-48 consent lifecycle + remote reduced-motion spec (REQ-PLAT-48)"; open its `4x11-fin/c-plat48-consent` twin (C.3-14). Rebase after #156. | X4 |

### FIN-C.2 Finish partially-merged work

No FIN-C PR is merged (the 18 merged `fin-c-plat-*` PRs #352–#369 are FIN-F/FIN-A work and are followed up there). The only FIN-C code that landed is the **20 direct pushes on `release/4.1.x`** (6a801d6da … a19f4bbe1, no PR, no review, no CI). Follow-ups, on `4x11-fin/c-<topic>` PRs, each cherry-picked to 4.x only where #128 does not already carry it:

1. **Record and review them** (`4x11-fin/c-direct-push-record`): `docs/release/4.1.x-baseline.md` lists the 20 SHAs, subject, REQ, the #128 twin SHA, and states they were pushed without PR; the owner acknowledges under OD-13 (FIN-H). Each REQ they carry is still unverified: re-check every clause against the ledger row before claiming anything.
2. **PLAT-26/28/30 4x side** (none in the pushes): 4x `tests/deprecations/{gen,verify}.test.ts` (also absent on `next`; add to `next-fin/c-deprecations`), 4x coverage check against the newest published 4.x tarball (`npm view` since-check with mocked 404, PR non-blocking / tag blocking), 4x compat globals rows. Branch `4x11-fin/c-deprecations-4x` → cherry-pick `4x-fin/c-deprecations-4x`. DEP.
3. **PLAT-31** (7363ec27a): the `plat:tag:release-ledger` job exists only on 4.1.x — FIN-B ports the job to 4.x/next; FIN-C adds `tests/release/ledger-corrections.test.ts` asserting fetch failure = error and computed `missingFrom`.
4. **PLAT-33** (ab4ba3d92): drill record needs a real rollback-drill pipeline URL — run the drill as a manual job on the first green 4.1.x pipeline and commit `docs/release/drills/<date>.json` written by the job (never hand-typed).
5. **PLAT-55** (a19f4bbe1): `tests/ci/package-json-patch-scope.test.ts` and `tests/deprecations/seed-4.1.1.test.ts` must run green on 4.1.x CI; regenerate `etc/api/*` for all 47 keys + `manifest.json` at the actual cut commit (the committed set predates P1–P8).
6. **PLAT-16** (0d3412a30): `dist-maps.tgz` must appear as an artifact of `plat:package:pack` on the first green 4.1.x pipeline; the release-notes `--tag --line` call is checked on both lines (`next` side in `next-fin/c-publish`).

### FIN-C.3 Build work that has no PR

Each item: worktree, branch, files (FIN-C-owned only), steps, named tests, acceptance. "CI wiring" lines are requests to FIN-B (one FIN-B PR per item), never edits by FIN-C.

**C.3-1 REQ-FIN-30 ownership rule on both release lines** — branches `4x11-fin/c-ownership`, `4x-fin/c-ownership` (cherry-pick of the `next-fin/c-ownership` commit from #127). Files: `scripts/ci/verify-ownership.mjs`, `tests/ci/verify-ownership.test.ts`. Steps: port cases (a)–(g) incl. (g) `4x11-<stream>/*` → 4x zone rule; add `next-fin/<wp>-*` → that WP's §6 path set and `4x-fin/*`, `4x11-fin/*` → 4x zone rule with fixture cases (common rules); the rename case uses a real temp git repo. Tests: `npx jest tests/ci/verify-ownership.test.ts`. Acceptance: AC-FIN-30 / ledger REQ-PLAT-03 — ≥1 case per rule, real-git rename, green on `next`, `release/4.x`, `release/4.1.x`. Merge before every P/X row.

**C.3-2 PLAT-26 `cn` location** — branch `next-fin/c-internal-cn` (fold into `next-fin/c-deprecations` if that is still open). Files: `src/internal/cn.ts`, `lint/rules/plat/no-cn-outside-internal.cjs`, `tests/lint/plat/no-cn-outside-internal.test.ts`, `tests/compat/plat/deprecation-warnings.test.tsx`. Steps: move the clsx-based `cn` into `src/internal/cn.ts`; every import goes through it (other WPs' call-site edits are their PRs; offenders → FIN-A baseline); production build 0 warnings, import side-effect 0. Acceptance: AC-FIN-33 / ledger REQ-PLAT-26.

**C.3-3 PLAT-89 `audit --backdrop`** — branch `next-fin/c-cli-audit-backdrop` (after N13-6). Files: `packages/cli/src/audit/thresholds.ts`, `packages/cli/src/commands/audit.ts`, new `packages/cli/schema/audit-backdrop.json`, `packages/cli/audit/{playwright.config.ts,reference-server.mjs}`, `packages/cli/test/commands/audit-backdrop.test.ts`, `tests/dx/audit-backdrop.remote.spec.ts` (rewrite in `@playwright/test`, no mocks), delete `tests/dx/audit-backdrop.remote.test.ts`. Steps: ledger steps 1–6 (architecture §15.2 constants lumVariance / OCR contrast 4.5/3.0 / rung ids; request/response validation; `--selector`; one line per `[data-ag-surface]`; non-zero on fail; dist bundle references no playwright/chromium). FIN-B request: `plat:audit:backdrop` `when: manual`, Playwright image, `-c packages/cli/audit/playwright.config.ts`. Acceptance: AC-FIN-40 / ledger REQ-PLAT-89 — schema in `npm pack -w packages/cli --dry-run`, ≥5 mocked tests, manual remote run shows one pass and one fail case (else defer to 5.1 per OI-5, recorded as `blocked-owner`, never `done`).

**C.3-4 REQ-FIN-31 remainder not in #127** — commits on `next-fin/c-publish` (from the #127 split). Files: `scripts/release/release-notes.mjs`, `scripts/release/pack.mjs` (or the pack script `plat:package:pack` calls), `tests/release/release-notes.test.ts`. Steps: `release-notes.mjs --tag --line` on `next` matching the 4.1.x version (0d3412a30); `dist-maps.tgz` in pack on `next`; FIN-B request: Node 20/npm 10.9 and Node 24/npm 11 `plat:test:pack-matrix` legs ≤45 min. Trusted-publisher rows stay `missing` until OD-2/OD-10 (owner). Acceptance: AC-FIN-31 / ledger REQ-PLAT-11..16, 38.

**C.3-5 REQ-FIN-43 docs app shell (PLAT-99)** — branch `next-fin/c-docs-app`. Files: `apps/docs/app/[...slug]/page.tsx` (`generateStaticParams` over `content/**`, `docs/quickstart`, `docs/guides`, generated pages; `next/link`), `apps/docs/nav.config.ts` (exact REQ IA: Components from `*.meta.ts`, Surfaces from certified registry items), example renderer inside Environment + 8 SCENES, Sheet mobile nav, code blocks `role="region" tabIndex={0}`, 390 preview toggle, tgz path derived from version; `tests/docs/docs-artifact.test.ts`, `tests/docs/docs-ia.test.ts`. FIN-B request: `plat:build:docs` `needs: plat:package:pack`. Acceptance: AC-FIN-43 / ledger REQ-PLAT-99 — `npm run docs:build` in CI yields `apps/docs/out` with an HTML file per nav href; docs-ia passes; `pages` deploys.

**C.3-6 PLAT-100 generated reference** — branch `next-fin/c-docs-reference` (after C.3-5). Files: `scripts/docs/gen-component-docs.mjs`, `scripts/docs/gen-props.mjs` (fix the replacer bug; TS compiler API over packed d.ts), `apps/docs/examples/<slug>/*.tsx` consumption, output `apps/docs/public/components/<slug>.md`, real `--check`; `tests/docs/tsdoc-coverage.test.ts` (100 % T0/T1, ≥95 % T2), `tests/docs/docs-pages.test.ts`. Acceptance: ledger REQ-PLAT-100 — `--check` exits 1 after a meta edit; props rows have name and type; tsdoc-coverage fails on a seeded undocumented prop.

**C.3-7 PLAT-101 guides** — branch `next-fin/c-docs-guides`. Files: `apps/docs/content/guides/{tailwind,plain-css,shadcn,nextjs,vite,react-router,testing,ai-agents}.mdx`, generated `rsc.md` from `build/server-safe-exports.json` (after #170), `tests/docs/docs-content.test.ts`, `tests/dx/plain-css.spec.ts` (remote). Content per ledger (Tailwind v4 only, `glass-*` utilities, `ag-dark/ag-tinted/ag-solid`; layer statement and `data-ag-part`/`data-state` styling; Jest ESM / Vitest role queries; MCP configs for Claude Code, Cursor, VS Code). Acceptance: ledger REQ-PLAT-101 — all 11 files exist, docs-content passes, plain-css spec green remotely.

**C.3-8 PLAT-102 docs gates** — branch `next-fin/c-docs-gates`. Files: `scripts/docs/compile-snippets.mjs` (one strict `ts.Program`, `jsx: react-jsx`, `moduleResolution: bundler`, packed-tarball types, examples/README/jsx fences), delete `scripts/docs/snippets-baseline.json` at 0 failures, `scripts/docs/verify-markdown-links.js` → route-aware case-sensitive checker, `tests/docs/{docs-imports,links}.test.ts`, `tests/docs/docs-a11y.spec.ts`, `tests/docs/docs-lighthouse.spec.ts` (remote), build ≤10 min and `out` ≤150 MB checks. FIN-B request: run in `plat:test:docs`. Acceptance: ledger REQ-PLAT-102.

**C.3-9 PLAT-103 quickstarts** — branch `next-fin/c-docs-quickstart`. Files: `docs/quickstart/*.md` (≤6 commands to `app-frame`), `tests/dx/quickstart.spec.ts` (verdaccio seeded with packed tgz; cells next-tailwind/next-plain/vite-plain/vite-tailwind; per-phase timing; 1440×900 + 390×844 materialPresence; 0 console errors; glass-regular parity; real `alpha-smoke` fallback reporting `pending`), writes `.artifacts/plat/quickstart-timing.json`; `generated:quickstart` README markers via `scripts/docs/gen-readme.mjs`. Remote only. Acceptance: ledger REQ-PLAT-103 — 4 cells, Next ≤300 s, Vite ≤240 s, material presence passing.

**C.3-10 PLAT-104 claims** — branch `next-fin/c-docs-claims`. Files: `scripts/docs/{gen-claims,render-claims,lint-claims}.mjs`, `docs/README.tmpl.md` (rewrite; peer table from `peerDependenciesMeta`; no runbook/font claim — shared with #179/#180, rebase after them), `README.md` regenerated, `tests/docs/readme-generated.test.ts`. Steps: `CI_COMMIT_SHA` replaces `GITHUB_SHA` (delete the `scripts/docs/gen-claims.mjs:38` row from FIN-A's `no-github-ci` baseline in the same PR), per-artifact sha custody, GA = `CI_COMMIT_TAG` `v5.x.y`, `TARBALL_MB` (FIN-B adds it to `pack.env`), PRD-verbatim `lint-claims` over README, `apps/docs/content/**`, `llms.txt.tmpl`, release body. FIN-B request: chain in `plat:build:docs` and `plat:release:notes`. Acceptance: ledger REQ-PLAT-104 — lint-claims fails on today's template and passes after; foreign-sha artifact exits 1; pending cross-stream claim on a v5.0.0 tag exits 1.

**C.3-11 PLAT-105 migration guide** — branch `next-fin/c-docs-migration` (after `next-fin/c-deprecations`). Files: `scripts/release/gen-deprecations.mjs --docs` → `apps/docs/generated/migration/deprecations.md` (`dep-<id>` anchors), `apps/docs/content/migration/5.mdx` thin template (Before you start, Run the codemods, By component, Removed, Rollback) from `docs/release/breaking-changes.json` and `catalogue.json`, `scripts/docs/gen-migration-stories.mjs` → `stories/plat/migration/*.generated.mdx`, `tests/docs/migration-guide.test.ts` reading `.entries` on built HTML. Acceptance: ledger REQ-PLAT-105 — >0 entries iterated, no "Pending" in 5.mdx output, 0 Glass tokens in the template.

**C.3-12 REQ-FIN-44 agent DX (PLAT-106)** — branch `next-fin/c-agent-dx`. Files: `scripts/docs/{gen-llms,gen-mcp-data}.mjs`, `llms.txt.tmpl`, generated `llms.txt` (≤12 KB, in tarball, version == `package.json`, no Glass* recommendations) and `llms-full.txt` (Pages only), `packages/mcp/src/server.ts` on `McpServer` + `StdioServerTransport`, tools `search_components`, `get_component`, `list_registry`, `get_registry_item`, `get_migration` with zod schemas, exact zod pin in `packages/mcp/package.json`, `packages/mcp/data/mcp-data.json {version, sha, components, registry, migrations}`, sha in serverInfo, fixed start script; `packages/mcp/test/tools.test.ts` (run under `node --permission --allow-fs-read`, initialize ≤500 ms, `search_components modal` → Dialog first, `get_migration GlassModal` → canonical-names), `tests/docs/llms.test.ts`, replace `tests/docs/mcp-tools.test.ts`. FIN-B request: `npm test -w packages/mcp` in `plat:test:cli` (REQ-FIN-09 line). Acceptance: AC-FIN-44 / ledger REQ-PLAT-106 — `tools/list` returns exactly the 5 names.

**C.3-13 REQ-FIN-39 remaining `legacy/**` deletions (PLAT-79)** — after #180 merges, `git ls-files legacy | wc -l` will still be ≈157 (`legacy/src/{utils,styles,icons,stories,theme,animations,app-shell,types,core,__tests__,…}`, workers, lib). Open one RM-14 follow-up PR per family directory: branches `next-fin/c-rm14-<dir>` (e.g. `next-fin/c-rm14-utils`, `-styles`, `-icons`, `-stories`, `-theme`, `-animations`, `-app-shell`, `-types`, `-core`, `-tests`, `-rest`), merged one at a time after #181/#182, each with `node scripts/removal/revert-dry-run.mjs --family <id>` output in the PR and `plat:gate:removal` green; `legacy/src/server/**` only through #184. Each deletion needs its family's consumer-grep record (FIN-H operator). Acceptance: AC-FIN-39 — `git ls-files legacy | wc -l` = 0 before RC-1; ledger REQ-PLAT-79/80 assertions R-01..R-18 green.

**C.3-14 PLAT-48 sub-rows on 4.1.x (twin of #199)** — branch `4x11-fin/c-plat48-consent`. Files (as in #199): `src/components/cookie-consent/__tests__/consent-lifecycle.test.tsx`, `src/components/interactive/GlassCommandPalette{.tsx,.fuzzy.test.tsx}`, `tests/visual/design-system/reduced-motion-4x.spec.ts` (remote); `src/components/{cookie-consent,charts}/**` and `src/index.ts` are outside the FIN-C 4x PLAT dirs — confirm `contract:ownership` accepts them under the 4x zone rule, else hand those hunks to the owning stream's `4x11-*` branch. No export removal and no new DEP entry on 4.1.x (`seed-4.1.1.test.ts` forbids `since: '4.2.0'`). Cherry-pick the behaviour commit to 4.x and rebase #199 on it. Acceptance: AC-FIN-35 / ledger REQ-PLAT-48.

**C.3-15 REQ-FIN-45 release execution — agent prep** (no PR can do the tagging). Branches `4x11-fin/c-release-4.1.1`, `4x-fin/c-release-4.2.0`, `4x-fin/c-release-4.3.0`, `next-fin/c-release-alpha`. Per version: `CHANGELOG.md` first `## [X.Y.Z]` heading, `RELEASE_NOTES_X.Y.Z.md` from `release-notes.mjs --tag vX.Y.Z --line <line>` (moved deps first for 4.2.0), `docs/release/train-checklist.json` row filled by the jobs, `.changeset` consumption, and the PLAT-55 tooling cherry-picks: every later FIN-B/FIN-C tooling commit on `next`/`release/4.x` is cherry-picked `-x` to `release/4.1.x` before the 4.1.1 cut (list them in `docs/release/4.1.x-baseline.md`). 4.2.0 needs FIN-H's downstream-grep record attached; 4.3.0 needs non-empty `fragments/codemods/{mat,cmp,surf}.ts` on 4.x via the FIN-A REQ-FIN-13 codemods sync (FIN-D REQ-FIN-57 PR #28 content, FIN-E REQ-FIN-76, FIN-F REQ-FIN-80) and the `@auraglass/cli@0.x` OIDC publish from the tag pipeline after `migrate 4to5 --dry-run` on the consumer fixture. The agent never runs `npm publish`, never pushes tags it is not instructed to push, never runs `scripts/production/release-main.mjs`; tags are pushed only after every gate in C.4 is green and the owner prerequisites (below) are recorded.

### FIN-C.4 Validation (GitLab CI only, `allow_failure: false`, job URL recorded in the ledger row)

Nothing below can run before OD-8 (pipelines for every ref). Local runs are limited to narrow Jest/node tests, `tsc` on a small config and lint of changed files; every lane marked **remote** runs only in GitLab CI or via the `auraone-remote-run` runner (never on this Mac, never local Docker). The activation row (`{job, line, pipelineUrl, date}` in `ci/plat/activation.json`) and the `allow_failure: false` flip are requested from FIN-B after each job's first green run.

| AC | Must be green (job → line) | Remote-only parts |
|---|---|---|
| AC-FIN-30 | `contract:ownership` + `plat:gate:glass-quality` (runs `tests/ci/verify-ownership.test.ts`) → next, release/4.x, release/4.1.x | — |
| AC-FIN-31 | `plat:package:pack` (pack-record, `dist-maps.tgz`), `plat:test:pack-matrix` Node 20/npm 10.9 + Node 24/npm 11 ≤45 min, `plat:gate:glass-quality` (`tests/release/{publish,dist-tag,prepublish-guard,publishing-docs}.test.ts`), dry-run step → next + both 4.x lines | pack matrix |
| AC-FIN-32 | `plat:gate:glass-quality` (`api-report --all --check`, `policy.test.ts`, `visual-fixes.test.ts`, `export-snapshot.test.ts`); `plat:gate:change-class` (FIN-A REQ-FIN-10 tests for PLAT-21/23-8) → all three lines | — |
| AC-FIN-33 | `plat:gate:glass-quality` (`gen-deprecations --schema --check`, `verify-deprecations`, `tests/deprecations/{gen,verify,tsdoc}.test.ts`, breaking-register, compat adapters, `src/compat/css/globals.css` ≤1 KB gz) → all three lines | — |
| AC-FIN-34 | `plat:release:notes`, `plat:tag:release-ledger` (tag pipeline), runbook/train/LTS tests in glass-quality; rollback drill job URL → all three lines | drill |
| AC-FIN-35 | on release/4.1.x and release/4.x: `plat:build:dist`, `plat:test:react19` (18.2 + 19), `plat:test:visual-4x` (font + reduced-motion composites), `plat:test:canaries` (`next build` RSC), `plat:integration:{next,vite}`, `plat:gate:glass-quality` (patch-scope, seed-4.1.1, side-effect gate, claims-lint, tree-hygiene, tarball-fonts, jwt spawn) | visual, canaries, integration |
| AC-FIN-36 | release/4.x: diet, budgets-4x ratchet, providers-wrap, 4x-fixes, bridge-wiring, doctor parity, breaking-register `--coverage`, `consumer-4x` in `plat:integration:{next,vite}` and `plat:test:visual-4x` | integration, visual |
| AC-FIN-37 | next: `plat:build:dist`, `plat:test:pack-matrix` (node-esm-require 8/8 on node:20.19.0 and node:22; publint `--strict`; attw `--profile esm-only`), `plat:test:react19` (floor imports), cold-import/bare-import gates | pack matrix |
| AC-FIN-38 | next: `plat:build:dist` (CSS assembly, `tests/css/*`), size budgets with base-branch ratchet, `plat:test:canaries` (next16, next15, vite, vite-tailwind4, vite-compiler, types-strict, jest-cjs, Base UI latest) blocking, `plat:package:pack` (pack-breakdown, seed scan, negative fixtures) | canaries |
| AC-FIN-39 | next: `plat:gate:removal` (RM-01..14 with consumer-grep records, verify-archive), `tests/docs/{redirects,docs-removed}.test.ts`, `git ls-files legacy | wc -l` = 0 | — |
| AC-FIN-40 | next: `plat:test:cli` (`npm test -w packages/cli`, schemas, fs-safety, timings), `plat:test:dx` packed-CLI Playwright canary (3 browsers), manual `plat:audit:backdrop` | dx canary, audit |
| AC-FIN-41 | next: `plat:test:cli` runs `tsc -p tests/types/plat` against `.artifacts/pack` | — |
| AC-FIN-42 | next: `plat:test:registry` (build, lint 0, `npm test -w packages/registry`), registry render gate (Next 16 + Vite, full capture matrix, Chromium + WebKit) | render gate |
| AC-FIN-43 | next: `plat:build:docs` (after pack), `plat:test:docs` (snippets 0 failures ≤5 min, links, docs-a11y, docs-lighthouse, quickstart 4 cells), `pages` deploy | a11y, lighthouse, quickstart |
| AC-FIN-44 | next: `plat:test:cli` (`npm test -w packages/mcp` under `--permission`), `tests/docs/llms.test.ts`, `llms.txt` in `npm pack --dry-run` | — |
| AC-FIN-45 | tag pipelines `v4.1.1` (release/4.1.x), `v4.2.0`, `v4.3.0` (release/4.x), `v5.0.0-alpha.N` (next): `plat:publish:npm` with OIDC provenance, `plat:release:verify-dist-tags` writes `.artifacts/plat/dist-tags.json`; GitLab Release per tag with a working `dist-maps.tgz` link | all |

### FIN-C owner and human items (agent prepares; never performs, records or fakes them)

| Item | (a) Agent prep | (b) Owner / operator action, exact steps | Blocks |
|---|---|---|---|
| OD-8 / OD-11 | none in FIN-C (FIN-B prepares) | as in FIN-B | every AC-FIN-30..45 job URL |
| OD-13 | `docs/release/4.1.x-baseline.md` (20 direct-push SHAs ↔ #128 twins, recommendation: 4.1.x pushes canonical, #128 = sole 4.x route) and an `od-13` draft for FIN-H | Gurbaksh records OD-13 in `docs/release/decisions/od-13.md`: confirms `release/4.1.x` from `78fd7bda1` and acknowledges the 20 unreviewed direct pushes | P*, X1, v4.1.1 |
| OD-2 / OD-10 | `docs/release/trusted-publishers.md` table (5 packages, provider `gitlab-ci`, namespace `chahal-foundation-group/github-auraoneai`, project `auraglass`, env `npm-publish`, status `missing`) + first-publish procedure | on npmjs.com for `aura-glass`, `@auraglass/cli`, `@auraglass/registry`, `@auraglass/mcp`, `@auraglass/labs`: Settings → Trusted publishing → GitLab CI/CD, the values in that table; then set the row `status`/`date` | AC-FIN-31, all publishes |
| OD-21 | advisory draft `docs/security/advisories/2026-10-hosted-runtime.md` (6 sections, from #153), `scripts/removal/verify-archive.mjs` | (1) publish the GHSA on `auraoneai/auraglass` from the draft **before** `v4.1.1`; (2) create private `auraoneai/auraglass-server-archive` and push `legacy/src/server/**` history into it | v4.1.1, #184, AC-FIN-39 |
| OD-14 | reviewer-distinct-from-author check in `verify-visual-fix.mjs` (PLAT-20) | choose second reviewer / bot / documented admin bypass (FIN-B CODEOWNERS PR on `main`) | AC-FIN-32 |
| OD-16 | none (contract PR is FIN-463) | approve C-6 (`d3-*` peers) and the `css` export condition, or keep the fallbacks | PLAT-67, PLAT-71 |
| PLAT-35 / PLAT-81 (REQ-FIN-113) | `scripts/release/downstream-grep.mjs`, `scripts/removal/consumer-grep.mjs` (#182) with fixtures | operator runs `node scripts/release/downstream-grep.mjs --version 4.2.0` over `~/AuraOne` and `~/platforms/*` and `node scripts/removal/consumer-grep.mjs --family RM-NN` for RM-01..13 on the owner Mac; commits the generated `docs/release/decisions/{downstream-4.2.0.json,removals/RM-NN.json}` | v4.2.0, #180, C.3-13 |
| PLAT-52, PLAT-16 | claims text and runbook `gh release create` step | operator edits the GitHub Release text of v4.1.0 per the retraction block and runs `gh release create vX.Y.Z --notes-file RELEASE_NOTES_X.Y.Z.md` per tag | AC-FIN-35, AC-FIN-45 |
| Tags | C.3-15 prep; all gates green | owner pushes `v4.1.1` on `release/4.1.x`, then `v4.2.0`, `v4.3.0` on `release/4.x`, then `v5.0.0-alpha.N` on `next` (publish only by `plat:publish:npm`) | AC-FIN-45 |
| `operator-codemods-qual.md` | draft text: QUAL declares no codemods, `fragments/codemods/qual.ts = {}` on 4.x | operator signs and commits `docs/release/decisions/operator-codemods-qual.md` | v4.3.0 |

### FIN-C.5 Exit criteria

- [ ] All 73 FIN-C PRs resolved per C.1: 0 open; every SPLIT/TRIM survivor merged green; every closed PR names its survivor.
- [ ] AC-FIN-30 — REQ-PLAT-03 on next, release/4.x, release/4.1.x.
- [ ] AC-FIN-31 — REQ-PLAT-11, 12, 13, 14, 15, 16, 38.
- [ ] AC-FIN-32 — REQ-PLAT-18, 20, 21 (on FIN-A REQ-FIN-10 tests), 22, 23.
- [ ] AC-FIN-33 (REQ-FIN-33 deprecations and compat composition: #127 split `next-fin/c-deprecations`, C.2 item 2, C.3-2) — REQ-PLAT-24, 25, 26, 27, 28, 29, 30 (both lines).
- [ ] AC-FIN-34 — REQ-PLAT-31, 32, 33 (real drill URL), 34, 35 (operator run recorded by FIN-H), 36.
- [ ] AC-FIN-35 — REQ-PLAT-40..50, 52..55 on release/4.1.x and cherry-picked to release/4.x.
- [ ] AC-FIN-36 — REQ-PLAT-56..63 on release/4.x (`consumer-4x` FROZEN after first green).
- [ ] AC-FIN-37 — REQ-PLAT-64..73 on next.
- [ ] AC-FIN-38 — REQ-PLAT-74..78 on next.
- [ ] AC-FIN-39 — REQ-PLAT-79..83; `git ls-files legacy | wc -l` = 0 before RC-1.
- [ ] AC-FIN-40 — REQ-PLAT-84..92.
- [ ] AC-FIN-41 (REQ-FIN-41 TypeScript DX over the packed d.ts: #193, FIN-B B3-7 `tsc -p tests/types/plat` in `plat:test:cli`) — REQ-PLAT-93; widening Button `variant` to `string` fails the test.
- [ ] AC-FIN-42 — REQ-PLAT-94..98.
- [ ] AC-FIN-43 — REQ-PLAT-99..105.
- [ ] AC-FIN-44 — REQ-PLAT-106.
- [ ] AC-FIN-45 — `npm view aura-glass versions` includes 4.1.1, 4.2.0, 4.3.0; dist-tags verified by `plat:release:verify-dist-tags`; GitLab Releases with working `dist-maps.tgz`; `@auraglass/cli@0.x` published.
- [ ] All 92 Appendix A.1 FIN-C rows `done` in the ledger with a green `allow_failure: false` job URL on the target line; FIN-C rows removed from every `scripts/integration/baselines/*.json`.

Report: the common JSON format plus `"tags": [{"tag": "", "pipelineUrl": "", "npm": "<version|not-published>", "provenance": true}]` and `"prDispositions": [{"pr": 0, "action": "", "survivor": null, "mergedSha": null}]`.


---

## 8. WP FIN-D — Material leftovers (MAT), PRD-F §5.4, REQ-FIN-50..59 (38 original REQ-MAT rows)

State on 2026-10-10 (`next` e5a2d6835, `release/4.x` 645735fce, `release/4.1.x` a19f4bbe1): no PR in #113–#369 is a FIN-D PR, and no `next-fin/d-*` or `4x-fin/d-*` branch exists. FIN-D work merged so far came in as a side effect of #369. That covers the REQ-FIN-52 seed headers (ab362c747, 311777e40 also cleared the `src/motion/public.ts` seed), the MAT-04 partial rename (e6090fad4), and partial MAT-17/MAT-18 (1d5cfe628, ca5e408e9). 0 of the 38 rows is done, and none has a green job, because GitLab project 87152036 has 0 pipelines (OD-8).

**Owned paths (PRD §6, exclusive):** `tokens/**`, `src/{material,motion,theme,a11y,tokens}/**` and `scripts/{mat,tokens}/**`, each minus the FIN-A files and minus `scripts/mat/verify-a11y-manual.mjs` (FIN-H). Also `src/compat/mat/**`, `lint/rules/mat/**`, `stylelint.config.mjs`, `fragments/*/mat.ts` minus `fragments/css/mat.ts`, `fragments/literals-baseline/mat.json`, `ci/mat.gitlab-ci.yml`, `ci/mat/**`, `tests/{tokens,material,motion,lint/mat,e2e/mat,visual/mat,a11y/apg/mat,a11y/mat}/**`, `tests/a11y/contrast-matrix.test.ts`, `stories/mat/**`, `apps/docs/content/mat/**`, and the stream-owned API reports `etc/api/{material,theme,tokens,motion}.*` and `etc/api/{root,compat}.mat.*` (contract B22a).

**Not yours (§6.1: the file owner implements the clause; you never edit these files):**
- FIN-A REQ-FIN-01: `tokens/$schema.json`, `tokens/legacy/**`, `scripts/tokens/{build,freeze-4x}.mjs` on `next`, `scripts/tokens/drift.mjs`, `scripts/tokens/formats/{compat-aliases,_shared}.mjs`.
- FIN-A REQ-FIN-02: `src/material/css/{material,lens}.css`, `src/material/dev/warnings.ts`.
- FIN-A REQ-FIN-03: `scripts/tokens/transforms/{glass-material,contrast-solve}.mjs`, `src/material/css/generated/**`, `tokens/material/material.tokens.json`, `tokens/sys/elevation.tokens.json`.
- FIN-A REQ-FIN-04: `src/theme/{providerMounts,mounts,index}.ts`, `src/theme/AuraGlassProvider.tsx`, `src/internal/warnDeprecated.ts`.
- FIN-A REQ-FIN-05: `fragments/css/mat.ts`, `src/a11y/css/**`, `GlassPreferencesPanel.css`, `scripts/mat/verify-a11y-css.mjs`.
- FIN-A REQ-FIN-07: `src/theme/{portal.ts,layers/**}`.
- FIN-A REQ-FIN-09: `packages/cli/test/fixtures.test.ts`.
- FIN-A REQ-FIN-11: `tokens/comp/**`, `tokens/sys/app-shell.tokens.json`.
- FIN-A REQ-FIN-12: `src/theme/preferences/store.ts`, `src/motion/css/{motion-modes,loading}.css`, `scripts/mat/verify-motion-css.mjs`.

Where a FIN-D ledger clause lands in one of those files, the step below says **→ transfer** and names the owner. Write the ledger text into that owner's PR description and keep your own test `pending` through the lane runner until that PR is on `next`.

**Branches:** `next-fin/d-<topic>` → `next`; `4x-fin/d-<topic>` → `release/4.x`. FIN-D has no `4x11` work. The common rules apply in full: merge only on a green GitLab pipeline for the head SHA, measured numbers come from tools only, and browser/visual/perf/pack runs are remote only. Report in the common JSON format, plus `"seedFreeEntries": [...]` and `Object.keys(cssVars).length` against the `--glass-*` count on both lines.

### FIN-D.1 Land existing open PRs

None of these is a FIN-D PR. Each one touches a FIN-D requirement or a FIN-D-owned path. The **merge itself** is done in the owning WP's section, in that section's slot (FIN-A/FIN-C/FIN-E, following status §3.2 / PRD §20). FIN-D's job here is limited to these steps:
- (a) Get the FIN-D-owned hunks removed where the table says TRIM.
- (b) Land the replacement for each removed hunk in the FIN-D PR named in the table.
- (c) Re-verify FIN-D tests after each merge.

Re-check the state immediately before acting: `gh api repos/auraoneai/auraglass/pulls/<n> --jq '.mergeable,.mergeable_state,.head.sha'` (use the REST call; GraphQL may 502). The states below were re-checked on 2026-10-10. `dirty` means CONFLICTING. No PR has any status check.

| PR | Line | REQ-FIN / original REQs (owner WP) | State | Action | Exact conflict / gap to fix (FIN-D part) | Slot |
|---|---|---|---|---|---|---|
| #113 | next | REQ-FIN-01 (FIN-A) | dirty | **CLOSE as superseded.** Survivor: FIN-A's "#113 remainder" PR, after #369 cherry-picked 9c5d9f012 and e17d64eb4. | Its `scripts/tokens/validate.mjs` `'ag-rendered'` shape and its `src/tokens/generated/manifest.ts` edit must not be re-landed in the remainder PR. The shape lands once, in `next-fin/d-validate-rendered` (D.3-01). `manifest.ts` is regenerated, never hand-merged. | Step 1 (closed before any rebase) |
| #117 | next | REQ-FIN-02 (FIN-A), MAT-26/42/43 `material.css` clauses | dirty | **REBASE+RESOLVE, then merge** | FIN-D-owned file in the PR: `tests/material/tint-formula.test.ts`. Keep it. FIN-D reviews that it asserts behaviour, not source text. | Step 5, first |
| #118 | next | REQ-FIN-03 (FIN-A) | dirty | **REBASE+RESOLVE, then merge** | Rebase onto `next` without `ad85c6d04`. FIN-D-owned hunks: `scripts/tokens/color.mjs`, `src/theme/{color.ts,wcag.mjs}`, `tests/material/ci/ladders-shape.test.ts`. Keep them, and FIN-D reviews them. Drop the hand edits to `src/tokens/generated/{tokens.ts,tokens.d.ts,material-spec.ts,manifest.ts}` and `scripts/tokens/validate.mjs`; regenerate with `npm run tokens:build`. | Step 5, after #117/#247/#203 |
| #119 | next | REQ-FIN-12 (FIN-A); touches MAT-59 `src/theme/preferences/prepaint.ts` | clean | **MERGE as is** | The `prepaint.ts` hunk (continuous gate) is FIN-D-owned but compatible. D.3-35 (`next-fin/d-prepaint`) rebases on it. | Step 6 |
| #120 | next | REQ-FIN-11 (FIN-A); MAT-04 `--ag-app-shell*` move | dirty | **REBASE+RESOLVE, then merge** | Drop `ad85c6d04`, the `validate.mjs` hunk and the generated `src/tokens/generated/*` hand edits; regenerate. After it merges, D.2-02 re-runs the MAT-04 set-equality test (36 `--ag-app-shell*` hits must be gone). | Step 6, before #214 |
| #121 | next | REQ-FIN-04 (FIN-A); MAT-22 `index.ts` clause, MAT-53 store reuse | dirty | **TRIM to remaining scope** (mount registrations only) | #369 already landed the provider fix. Remove its `src/theme/public.ts` hunk: `public.ts` is FIN-D's, and D.3-14 removes `createGlassThemeCssVars`/`createBrandGlassTheme` from it when `src/compat/mat/theme.ts` exists. The `src/theme/index.ts` export drop stays in #121 (§6.1 transfer). Registration must run at render, not at import (§5.1). | Step 6, first |
| #125 | next | REQ-FIN-13 (FIN-A); MAT-67 deprecations direction | dirty | **REBASE+RESOLVE, then merge** | It brings the 180-row 4.x `fragments/deprecations/mat.ts` to `next`. This conflicts with #127's 132 `DEP-M1000…` rows. Rebase onto `next` with #127's `mat.ts` hunk removed, and resolve by running `scripts/release/sync-fragments.mjs`, never by hand. After the merge, FIN-D verifies `git diff origin/release/4.x origin/next -- fragments/deprecations/mat.ts` is empty. | Step 7, first deprecation PR (one at a time, `gen:deprecations` after each) |
| #127 | next | REQ-FIN-30/31 (FIN-C) | dirty | **TRIM to remaining scope** | Remove `fragments/deprecations/mat.ts` (+132 `DEP-M1000…` 5x compat rows) and `etc/api/{material,motion,theme,tokens}.{api.md,exports.json}`. Both are FIN-D-owned (B22a). The 5x-only DEP-M rows are re-proposed in `next-fin/d-deprecations-5x` (D.3-22b) after #125. The API reports are regenerated by D.3-14. | Step 2 (ownership verifier) |
| #128 | 4.x | REQ-FIN-32 (FIN-C) | clean | **TRIM to remaining scope** (status §3.1, OD-13) | Its `etc/api/{theme,tokens-css,tokens-json,tokens-keyframes,tokens-manifest}.*` must be byte-equal to `npm run api:update` output on the trimmed head. If not, drop them and FIN-D regenerates them in `4x-fin/d-bridge` (D.3-21). | 4.x step 1 |
| #155 | 4.1.x | REQ-PLAT-54 (FIN-C) | clean | **MERGE as is** | Touches FIN-D paths `src/tokens/{designConstants,generated}.ts` and `tokens/personas/default.json` on 4.1.x. These are font-stack values only, so FIN-D has no objection. Check that the result is identical to #156. | 4.1.x, in the #129–#155 run |
| #156 | 4.x | REQ-PLAT-54 twin (FIN-C) | clean | **MERGE as is** | Same as #155. On 4.x it must merge before D.3-21 regenerates `src/tokens/generated.ts`. | 4.x step 2 |
| #173 | next | REQ-PLAT-72 (FIN-C) | dirty | **TRIM to remaining scope** | Remove `src/material/Surface.tsx` (MutableRefObject→RefObject); FIN-D carries it in D.3-16 `next-fin/d-surface`. Remove `AuraGlassProvider.tsx` (FIN-A REQ-FIN-04 owns it, §6.1) and `tokens/$schema.json` (FIN-A). | Step 3, PLAT-37 run |
| #174 | next | REQ-PLAT-73 (FIN-C) | dirty | **TRIM to remaining scope** | Remove `etc/api/{material,tokens}.*` (B22a, FIN-D regenerates in D.3-14), `scripts/tokens/validate.mjs` (D.3-01), and hand edits to `src/tokens/generated/manifest.ts` and `tokens/{$schema.json,legacy/4x-rendered.tokens.json}`. | Step 3, after #168 |
| #175 | next | REQ-PLAT-74 (FIN-C) | dirty | **REBASE+RESOLVE, then merge** | Drop `validate.mjs` (D.3-01) and the generated `manifest.ts`. `material.css`, `build.mjs` and `compat-aliases.mjs` are FIN-A's. | Step 5, after #248/#257; then FIN-C step 10 |
| #178 | next | REQ-PLAT-77 (FIN-C); stacked on #177 | dirty | **TRIM to remaining scope** | Remove `ci/mat.gitlab-ci.yml` (D.3-02). Remove the seed-header hunks on `src/theme/{createGlassTheme,public}.ts`, which #369 already did. Remove `validate.mjs` and the generated files. Remove the `fragments/size-budgets/mat.ts` raise of `mat:tokens-js` 2048→6144 B: a budget raise needs a measured tool artifact plus owner approval (`Perf-Budget-Raise:` trailer), and D.3-14 shrinks `./tokens` to `tokens` only. Re-measure after D.3-14 and raise only with owner sign-off. | FIN-C step 10, after #177 |
| #179 | next | REQ-PLAT-78 (FIN-C) | clean | **TRIM, then merge** | Remove its `ci/mat.gitlab-ci.yml` hunk. It adds `cp … 2>/dev/null \|\| true` fail-opens, which are prohibited, and an `.ag-playwright` extend on a job FIN-D deletes. The correct edit lands in D.3-02. | FIN-C step 10 |
| #180 | next | REQ-PLAT-79 (FIN-C); stacked on #179 | dirty | **TRIM to remaining scope** | Remove its `ci/mat.gitlab-ci.yml` hunk (same as #179). `scripts/tokens/freeze-4x.mjs` and `tokens/legacy/**` are FIN-A's call, not FIN-D's. | FIN-C step 10, after #179 |
| #190 | next | REQ-PLAT-90 (FIN-C); MAT-67 | clean | **MERGE as is** | Adds `names:['GlassScript']` to `fragments/codemods/mat.ts` (FIN-D-owned). Compatible. D.3-22 (`next-fin/d-codemods`) rebases on it. | FIN-C step 10, CLI #185–#192 one at a time |
| #280 | next | REQ-CMP-29 (FIN-E/FIN-A list) | dirty | **CLOSE as superseded.** Survivor: #369 (ab362c747, 311777e40). | Its only FIN-D file is `src/theme/createGlassTheme.ts` (seed strip), which is already on `next`. | Before any rebase (§3.1) |

Other material-adjacent PRs are not FIN-D's and are not listed here. #248, #257 and #122/#249/#326 touch `material.css`/`layers/**` (FIN-A files). #317 and #325 touch `AuraGlassProvider.tsx` (FIN-A). Their sections handle them.

### FIN-D.2 Finish partially-merged work

| # | What merged (via #369) | Exact follow-up | Branch | Acceptance |
|---|---|---|---|---|
| D.2-01 | REQ-FIN-52 seed clause. ab362c747/311777e40 removed the line-1 `@ag-contract-seed` headers from `src/theme/{createGlassTheme,public}.ts` and `src/motion/public.ts`, and the export map now has `.`, `./theme`, `./primitives`, `./app-shell`, `./ai`, `./media`, `./backdrops`, `./compat`. | 1) Run `node scripts/build/generate-exports.mjs --check` and confirm that none of the nine entries, and not `./motion`, is excluded. Record the printed list as `seedFreeEntries`. 2) On the **remote** pack job (GitLab `plat:build:pack` or skill `auraone-remote-run`, never this Mac), run `npm pack`, install the tgz in an empty dir, then `node -e "import('aura-glass').then(m=>console.log(!!m.Button))"`. It must print `true`. 3) Add `tests/material/exports/seed-free.test.ts`: for `src/theme/createGlassTheme.ts`, `src/theme/public.ts` and `src/motion/public.ts`, line 1 does not match `/^\/[*\/] @ag-contract-seed:/`, and `import('aura-glass/theme')` exposes `createGlassTheme`. | `next-fin/d-seed-evidence` | AC-FIN-52 seed bullet + AC-FIN-06 tarball line. Job URL plus pack log artifact. |
| D.2-02 | MAT-04 partial. e6090fad4 renamed 180 `--ag-` → `--_ag-`. | 1) Rename the rest of the non-contract names, or route them to contract C-7: `group-spacing` is read by `material.css:230` (**→ transfer** REQ-FIN-02 for the reader), then tinted-floor, scrim-blur, fallback-fill, on-surface-max, border-strong, on-surface-disabled, focus-offset, hit-gap, `accent-1..12` (with D.3-12). Emitters live in `scripts/tokens/formats/{css-layered,manifest,ts-constants}.mjs`. 2) In `scripts/tokens/formats/manifest.mjs`, map types to the contract union (density→number, radius-inner/body-size→dimension). 3) In `tests/tokens/private-ag-namespace.test.ts`, delete `RUNTIME_PREFIXES`/`COMPONENT_VARS` and assert set equality: emitted `--ag-*` = `PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS`, with no whitelist. `--ag-app-shell*` (36 hits) is REQ-FIN-11's (#120). Re-run after #120 merges. | `next-fin/d-namespace` | Ledger MAT-04: 0 extra and 0 missing over `dist/tokens.css`, `src/material/css/**`, `src/a11y/css/**`, `src/motion/css/**`. Every manifest type is in the union. |
| D.2-03 | MAT-17 partial. 1d5cfe628 is dead-vars work. | 1) `scripts/tokens/gates/undefined-vars.mjs`: build its entries from the `loadFragments('css')` MAT rows plus the dist token entries, and resolve each bundle's closure. 2) `dead-vars.mjs`: drop the generated-file exemption for `--_ag-*`, so every private needs ≥1 `var()` reader outside its defining rule. 3) Both gates attribute findings through `contracts/ownership.json`: print `pre-existing (<stream>)` and exit 1 only on MAT findings. 4) Wire or delete MAT's unread privates. For readers inside `material.css`/`generated/**`, **→ transfer** REQ-FIN-02/-03. 5) Run `node scripts/mat/token-gates-l1.mjs` in a non-allow_failure job (D.3-02). | `next-fin/d-var-gates` | Ledger MAT-17: both gates exit 0 with 0 MAT findings and list other streams as pre-existing. L1 job green. |
| D.2-04 | MAT-18 partial. ca5e408e9 is literals genesis. | 1) `scripts/tokens/gates/literals.mjs --stream <s>` reads/writes `fragments/literals-baseline/<s>.json` and measures only that stream's globs. Remove the hard-coded FRAGMENT write and the global `scripts/tokens/gates/literals-baseline.json`. Never write a fragment when `--baseline` is a custom path. 2) Fix `tests/tokens/literals-lint.test.ts` so it never writes repo files. It is what leaked `{"src/a.ts":{"color":1}}`. 3) Delete `src/theme/materials.ts`. Tokenise the literals in `src/theme/preferences/prepaint.ts`; for `store.ts` **→ transfer** REQ-FIN-12. Then `--stream mat --update` on a clean tree drives `mat.json` to real paths summing 0. 4) `lint/rules/mat/no-raw-design-values.cjs` agConfig: `error` on MAT globs (`src/{material,motion,theme,a11y,tokens}/**`, `src/compat/mat/**`), `warn` elsewhere, escalated via `lint/rules/<s>/_strict.cjs`. Mirror it in `stylelint.config.mjs` overrides. 5) Add `tests/lint/mat/no-raw-design-values.test.ts` (RuleTester, ≥1 invalid case per category incl. `linear()`, `oklch(`, motion numeric keys outside `src/motion/**`, the `color.ts` allow comment) and a stylelint case. | `next-fin/d-literals` | Ledger MAT-18: `literals.mjs --stream mat` exits 0. After the jest literals test, `git status` is clean. `npx eslint src/components` gives warnings, not errors. `mat:lint:literals` job green (D.3-02). |

### FIN-D.3 Build work that has no PR

One PR per row unless the row says otherwise. Every test named here is real and fails closed: no `return` with `console.warn('pending')`, no source greps standing in for behaviour. For each row, acceptance is the AC-FIN id **and** the ledger `acceptance` text from `implementation-audit/fin-open-ledger.json`; the stricter §5.4 text wins. Start with D.3-01 and D.3-02. They unblock other packages' trims.

**Prerequisites and CI (REQ-FIN-53 fragment)**

- **D.3-01 `next-fin/d-validate-rendered`.** A single owner for the `'ag-rendered': { type: 'string' }` value shape in `scripts/tokens/validate.mjs`. Today six PRs carry it: #113/#118/#120/#174/#175/#178. Include the MAT-328 comment from #174. Test: add a `tests/tokens/validate.test.ts` case where a `tokens/legacy` token with `$type: 'ag-rendered'` validates and a non-string value fails with its message. Merge **before** the FIN-A #113-remainder PR (step 1). Acceptance: AC-FIN-01 prerequisite. The test is green in `mat:test:tokens-interim`.
- **D.3-02 `next-fin/d-ci-fragment`** (+ `4x-fin/d-ci-fragment`). Edit `ci/mat.gitlab-ci.yml` on both lines:
  1. `mat:test:tokens-interim` copies its evidence into `.artifacts/mat/$CI_JOB_NAME_SLUG/` and fails if a copy fails (no `|| true`). It sets `paths: [.artifacts/mat/]` and `when: always`, and runs `NODE_OPTIONS=--experimental-vm-modules npm test -- tests/tokens` (drop `--passWithNoTests`).
  2. **Delete** `mat:certify:l5-material`. Register the `mat:material-{chromium,webkit,firefox}` specs as L5/L8 rows in `fragments/lanes/mat.ts`. Rule 7 says no `<s>:certify:l<n>` outside QUAL.
  3. Add `mat:test:drift` (`node scripts/tokens/drift.mjs`, the AC-FIN-01 job).
  4. Add `mat:lint:literals`: `node scripts/tokens/gates/literals.mjs --stream $s` for each of mat, cmp, surf, plat, qual. Exit 1 only for mat (D.2-04).
  5. Add `node scripts/mat/token-gates-l1.mjs` to a mat test job (D.2-03).
  6. On 4x: `mat:build:bridge` writes only to the Appendix C C-8 producer paths `src/material/`, `src/styles/{v5,preview-v5}.css`, `dist/tokens/4x/`. Until OD-16 approves C-8, move them under `.artifacts/mat/`.
  7. Leave every job `allow_failure: true` until its first green run on the line, then flip it in the same PR as its activation row (FIN-B `ci/plat/activation.json`).
  
  Tests: the FIN-B fixtures in `tests/ci/fixtures/ci-fragments/**` must pass against the edited file. Do not edit FIN-B files; if a rule message is missing, file it in FIN-B's PR. Acceptance: `node scripts/ci/verify-ci-fragments.mjs` prints `contract:ci-fragments OK` on `next` and `release/4.x` (REQ-FIN-53 bullet 1, REQ-FIN-21's MAT row removed from the expiring baseline). Merge any time (CI plumbing, step 1). After this, #178/#179/#180 merge **without** their `ci/mat` hunk.
- **D.3-03 `next-fin/d-optics-lint`** (MAT-39).
  1. Extend the optics agConfig to `src/**`, `stories/**`, `tests/**`, `apps/**` (exclude `tests/lint/mat/**`), at `error` or with `--max-warnings` tied to `optics-baseline.json`.
  2. Re-record `scripts/mat/glass-recipes-baseline.json` **by running** `node scripts/mat/count-glass-recipes.mjs --update`: N=11 measured today vs the recorded 2. No hand edits.
  3. Run `--ratchet` in `mat:test:optics`, and `--strict` after beta.1 (`mat:certify:beta-optics`). Write `.artifacts/mat/$CI_JOB_NAME_SLUG/recipes.json`.
  4. Retire `no-inline-glass` from `lint-rule-owners.json` through the `contract/v1.2-final` PR. Do not edit it here.
  5. Fix the `isMain` symlink bug in `scripts/mat/{count-glass-recipes,make-grain,material-css-api}.mjs` and every other `scripts/mat/*.mjs` that has an `isMain`: compare `realpathSync(fileURLToPath(import.meta.url))` against `realpathSync(process.argv[1])`.
  
  Tests: `tests/lint/mat/optics.test.ts` (a new `backdropFilter` in a `stories/` fixture fails) and `tests/material/ci/is-main.test.ts` (the script runs through a symlinked path). Acceptance: AC-FIN-53 + ledger MAT-39 (`independent-glass-recipes: N` with N≤baseline; `verify-optics-css` green in a non-allow_failure job).

**REQ-FIN-50 (MAT-02, -05, -06, -08; MAT-04 is in D.2-02)**

- **D.3-04 `next-fin/d-guards`** (MAT-02). Guards live in `scripts/tokens/build.mjs`, which is FIN-A's. Move the guard logic into a new FIN-D module, `scripts/tokens/guards.mjs`, with these guards:
  - key-walking `guardPresets`, which rejects keys or aliases under `material.*` and any value containing `--_ag-`;
  - a ref-leak guard, which fails when an emitted `--ag-*` value or comp-tier alias resolves through a ref-tier token with no sys hop;
  - blur-cap, bezier-y, spring-zeta and spring-response.
  
  The one-line import and call in `build.mjs` **→ transfer** REQ-FIN-01 (FIN-A). Add fixtures `tests/tokens/fixtures/guards/{blur-cap,bezier-y,spring-zeta,spring-response,comp-ref-leak}/tokens/{$schema.json,x.tokens.json}` and rows in `tests/tokens/compiler-guards.test.ts` (≥11 cases, each asserting exit 1 plus the token path). Change the `preset-material` fixture to use a real `material` key with a neutral name. Add `src/theme/__tests__/createGlassTheme.guard.test.ts`: `Object.keys(vars)` and `cssText` contain no `material` and no `--_ag-`. Acceptance: AC-FIN-50 + ledger MAT-02.
- **D.3-05 `next-fin/d-srgb-fallback`** (MAT-05). In `scripts/tokens/formats/css-layered.mjs`, emit an `@supports not (color: oklch(0 0 0))` block with hex/`rgb()` for all 13 `--ag-color-*` per scheme (light `:root`, `[data-ag-scheme=dark]`, the `prefers-color-scheme` mirror), using `srgbToHex(gamutMapOklch())` from `scripts/tokens/color.mjs`. Keep alpha (`--ag-scrim-media` stays `rgb(0 0 0 / 0.72)`) and emit shadows as full sRGB strings. Test: extend `tests/tokens/oklch.test.ts` to postcss-parse `dist/tokens.css` and find 13+13 declarations matching `/^#[0-9a-f]{6}$|^rgb\(/`. Acceptance: AC-FIN-50 + ledger MAT-05.
- **D.3-06 `next-fin/d-density`** (MAT-06). In `css-layered.mjs`, make every `[data-ag-density=…]` block redeclare `--ag-density` and the 11 `--ag-space-*` as `calc(n*4px*var(--ag-density))`. Tests: `tests/tokens/scales.test.ts` asserts the compact block has `--ag-space-4: calc(16px * var(--ag-density))` and `--ag-density: 0.875`; the remote L5 spec `tests/e2e/mat/density-nested.spec.ts` checks that a nested compact div computes 14px. Acceptance: AC-FIN-50 + ledger MAT-06.
- **D.3-07 `next-fin/d-springs`** (MAT-08).
  - `scripts/tokens/transforms/motion-spring.mjs`: settle T is measured at the start of the 50 ms hold (`settleMs = settledSince`), giving 300/470/650 ms.
  - `css-layered.mjs` fallback: snappy→`var(--ag-ease-standard)`, smooth/fluid→emphasized-decelerate.
  - `formats/ts-constants.mjs`: emit `motionTokens.spring.{snappy,smooth,fluid}.{zeta,response,duration,linear,stiffness,damping}`.
  - `src/motion/adapter/toMotionTransition.ts` reads them.
  
  Test: tighten `src/motion/__tests__/spring-linear.test.ts` to ≤40 stops, ≤600 B, durations 300/470/650, smooth 322.3±0.1 / 32.31±0.01. Acceptance: AC-FIN-50 + ledger MAT-08.

**REQ-FIN-51 (MAT-11, -12)**

- **D.3-08 `next-fin/d-contrast-recompute`** (MAT-11). In `tests/a11y/contrast-matrix.test.ts`, parse `src/material/css/generated/floors.css`. Assert that each `[transparency][thickness][backdrop]` row and the contrast=more row equals max(cell `floorAlpha`) over presets×schemes×variants. Recompute each pair from the PRD composite model, not from the solver: on-surface ≥4.5 (≥7 more), muted ≥4.5 (≥7 more, ≥3 large-only), border/focus ≥3. Add a mutation case: a −0.05 edit of one floor makes the test fail. Acceptance: AC-FIN-51 + ledger MAT-11.
- **D.3-09 `next-fin/d-modes`** (MAT-12).
  - In the `css-layered.mjs` mode emitter, emit `[data-ag-transparency="tinted"]`, make the reduced-transparency mirror use the tinted set, and emit a forced-colours token block.
  - The `fragments/css/mat.ts` rows for `src/a11y/css/**` and the `material.css` include **→ transfer** REQ-FIN-05/-02. `rungs.css` reading the generated floors **→ transfer** REQ-FIN-05.
  - Add the remote visual spec `tests/visual/mat/modes-zero-js.spec.ts`: media-driven vs attribute-driven renders for light, dark, more, reduced-transparency, forced-colors and reduced-motion on chromium/webkit/firefox, ≤0.1 % (`VISUAL_TOLERANCE`). Baselines come only from `qual:certify:baseline-refresh`.
  
  Acceptance: AC-FIN-51 + ledger MAT-12.

**REQ-FIN-52 (MAT-14, -15, -16; the seed clause is D.2-01)**

- **D.3-10 `next-fin/d-presets`** (MAT-14, needs OD-16 C-2).
  - With C-2 approved, `data-ag-theme` comes into `AG_ATTRIBUTES` through `contract/v1.2-final`. Fallback until then: stop emitting `[data-ag-theme]` to `dist/` and generate per-preset cssText scoped to `[data-ag-root]`.
  - Preset emitter: neutral ramps derived from `neutralHue`; `sys.color.{canvas,accent,on-accent,border}` each emitted as `light-dark()`.
  - The `presetCss`/`brandCss` mount registration **→ transfer** REQ-FIN-04 (FIN-A `mounts.ts`).
  - Test: `src/theme/__tests__/presets.test.tsx`. Rendering `<AuraGlassProvider preset="graphite">` with no manual registration gives one `<style>` containing `--ag-color-accent: light-dark(`. Report it as `pending` through the lane runner until REQ-FIN-04's mounts are on `next`.
  
  Acceptance: AC-FIN-52 + ledger MAT-14.
- **D.3-11 `next-fin/d-create-theme`** (MAT-15). In `src/theme/createGlassTheme.ts`:
  - emit `color-scheme: light|dark` for mode light/dark/high-contrast and stop pinning canvas;
  - apply contrast `more` values or `data-ag-contrast`, and emit `--ag-density` for compact/spacious;
  - give exactly one dev warning when `adjusted` is non-empty, and add dark-scheme pairs to the report;
  - move `createGlassThemeCssVars` to a new `src/compat/mat/theme.ts` (export it from `src/compat/mat/index.ts`) and remove it from `src/theme/public.ts`. The `src/theme/index.ts` side is #121 (REQ-FIN-04).
  
  Tests: `src/theme/__tests__/createGlassTheme.test.ts` gets the `color-scheme: dark`, `--ag-density: 0.875`, and `#ffff00` → `adjusted.length>0` with one `console.warn` cases. Acceptance: AC-FIN-52 + ledger MAT-15.
- **D.3-12 `next-fin/d-brand-theme`** (MAT-16, needs OD-18). In `src/theme/createBrandTheme.ts:41`, `accentShift ?? 0.34` becomes `?? 0`; this applies the OD-18 default unless the owner records otherwise. Ramp vars move to private `--_ag-accent-1..12` (or C-7). One `ContrastPair` per ramp text step. Move `createBrandGlassTheme` to `src/compat/mat/createBrandGlassTheme.ts` using `warnDeprecated('createBrandGlassTheme')` with a DEP-M id, and remove it from `src/theme/public.ts`. Test: `src/theme/__tests__/createBrandTheme.test.ts` asserts that all 240 ramp-pairs (12×20 fixtures) are ≥4.5 and that `oklch(0.6 0.15 250)` keeps hue 250. Acceptance: AC-FIN-52 + ledger MAT-16.

**REQ-FIN-54 (MAT-20, -22)**

- **D.3-13 `next-fin/d-shadcn`** (MAT-20, needs OD-16 C-2). Either `data-ag-shadcn-source` arrives via C-2, or (fallback) `css-layered.mjs` gates the `:root[data-ag-shadcn-source]` block off so that only the `:where(:root:not([data-ag-shadcn-source]))` form ships. Regenerate. Test: extend `tests/tokens/shadcn-interop.test.ts` to check the 8 names, and add a synthetic cycle fixture that makes the build die. Acceptance: AC-FIN-54 + ledger MAT-20.
- **D.3-14 `next-fin/d-entry-parity`** (MAT-22). Merge it after D.3-11/-12 and after #121.
  1. `src/tokens/index.ts` exports only `tokens`, and `formats/ts-constants.mjs` excludes `--_ag-*`.
  2. Fix the crashes in `scripts/mat/material-css-api.mjs --check` and `scripts/tokens/gates/types-runtime.mjs`.
  3. Add `tests/material/exports/entries.test.ts`: `Object.keys(import(entry))` equals `ENTRIES[i].exports` for `./material`, `./theme`, `./tokens`, `./motion`, and `src/root/mat.ts` equals `ROOT_EXPORTS.mat`.
  4. Run `npm run api:update -- --entry <e>` for the four entries plus root.mat and compat.mat. This replaces the `etc/api` hunks trimmed from #127/#174.
  5. Re-measure the `mat:tokens-js` size row with the size tool. Raise it only with a tool artifact and an owner-approved `Perf-Budget-Raise:` (D.1 #178).
  
  Acceptance: AC-FIN-54 + ledger MAT-22 (`etc/api/tokens.exports.json` lists only `tokens`; `rg '"--_ag-' src/tokens/generated/tokens.ts` = 0).

**REQ-FIN-55 (MAT-23, -24, -26, -27, -28)**

- **D.3-15 `next-fin/d-material-props`** (MAT-23). Add an internal `componentMaterialProps(role, sizeClass)` in `src/material/internal/index.ts`, outside the public types. `resolveRole` emits `data-ag-thickness` whenever it derives the thickness from the size class. The Button and Toolbar call sites are FIN-E's (`src/components/**`): **→ transfer** REQ-FIN-70. Tests: `src/material/__tests__/materialProps.test.ts` covers control→thin, bar/panel→regular, sheet→thick; `tests/types/mat/material-props.test-d.ts` checks that `sizeClass` is absent from `SurfaceProps`. Acceptance: AC-FIN-55 + ledger MAT-23.
- **D.3-16 `next-fin/d-surface`** (MAT-24 + the trimmed #173 hunk). Changes:
  - `src/material/Surface.tsx`: use `cn` instead of `clsx`; add `style` only when it is passed; apply the ref-as-prop / `RefObject` change from #173.
  - `src/compat/mat/index.ts`: export `GlassPrimitive` and `GlassAdvanced`.
  - `src/compat/mat/material/shared.ts`: one DEP-M id per adapter; remove the adaptive→regular rewrite.
  - Fix `adapters.test.tsx` to the no-inline-style contract.
  
  Add `tests/types/mat/surface.test-d.ts` with `@ts-expect-error` for `as` and the 17 removed props. Acceptance: AC-FIN-55 + ledger MAT-24 (`rg clsx src/material` = 0).
- **D.3-17 `next-fin/d-structural`** (MAT-26). FIN-D side:
  - `data-ag-part="concentric-frame"` on ConcentricFrame;
  - a ScrollEdge part background `var(--ag-surface-fill, canvas)`, if it is set in component code;
  - the spacing/radius/inset → var mapping rules, generated by a FIN-D emitter (`css-layered.mjs`).
  
  The rules inside `material.css` **→ transfer** REQ-FIN-02. Tests: `tests/material/css-contract.test.ts` checks the mapping for every token. The remote spec `tests/e2e/mat/material/group.spec.ts` checks gap == `--ag-space-4`, concentric radius = lg − space-3, and that the ScrollEdge background is not transparent. Acceptance: AC-FIN-55 + ledger MAT-26.
- **D.3-18 `next-fin/d-attributes`** (MAT-27, needs OD-16 C-2).
  - Register `data-ag-{theme,shadcn-source,scroll-locked,hit-clamp,focus-inset,lens-defs}` via C-2, or rename them to `data-ag-part` values.
  - Remove `data-ag-theme-style`.
  - Disabled cells keyed on `[data-disabled]/[aria-disabled]` **→ transfer** REQ-FIN-03 (`glass-material.mjs`).
  - Document the non-ag state attributes in the C-2 PR.
  
  Test: `tests/material/attribute-discipline.test.ts` renders every MAT component plus the provider and panel and asserts each `data-ag-*` is in `AG_ATTRIBUTES` (setter MAT|ANY) and none is in `BANNED_ATTRIBUTES`; it also scans MAT CSS selectors. Acceptance: AC-FIN-55 + ledger MAT-27.
- **D.3-19 `next-fin/d-properties`** (MAT-28; a CSS sweep, see the order notes below).
  - Hand-author `src/material/css/properties.css` with exactly the 14 registrations and PRD initial values, line 1 `LAYER_ORDER_STATEMENT`, one `@layer` block.
  - Stop `scripts/tokens/formats/property-registry.mjs` from emitting `generated/properties.css`. Deleting the committed generated file **→ transfer** REQ-FIN-03's drift run. Registering the new file in `fragments/css/mat.ts` **→ transfer** REQ-FIN-05.
  - Remove the 5 `@property` blocks from `src/motion/css/motion.css`.
  
  Tests: repoint `src/material/__tests__/properties.test.ts` to the new file with exact 14-name set equality and drop its seed/pending branch. Add `tests/material/properties-union.test.ts`: the union over every `fragments/css/*.ts` file has ≤16 registrations, each once. Acceptance: AC-FIN-55 + ledger MAT-28 (`rg registerProperty src` = 0).

**REQ-FIN-56 (MAT-37)**

- **D.3-20 `next-fin/d-cinematic`.** Write `apps/docs/content/mat/cinematic-contract.md` with the 7 admission rules:
  1. library-owned pixels only;
  2. ≤1 WebGL context;
  3. pause offscreen;
  4. pause when the document is hidden;
  5. standard Surface under calm/none, non-glass, forced colours or context loss;
  6. no import side effects;
  7. public entries only.
  
  Before writing, check this split against the full REQ-MAT-37 text in PRD-2. The ledger lists rules 3 and 4 together.
  
  Register `scripts/mat/verify-material-runtime.mjs` as an L1 row in `fragments/lanes/mat.ts`. Acceptance: AC-FIN-56, the L1 log line `[verify-material-runtime] OK`.

**REQ-FIN-57 (MAT-41, -67)**

- **D.3-21 `4x-fin/d-bridge`** (MAT-41, on `release/4.x`). Merge after #128 (trimmed), #156 and #124.
  1. Port the 5.0 compiler to 4.x as `node scripts/tokens/build.mjs --platform bridge-4x`, reading the same token tree. Delete the hand-authored `AG_VALUES` (durations must be 200/320/450).
     - The 4x `scripts/tokens/build.mjs` falls under the 4x zone rule, and PRD §5.4 assigns the edit to REQ-FIN-57. State that in the PR body. If `contract:ownership` flags it, record that and do not bypass.
  2. Generate:
     - `src/material/css/{ladders,floors,properties}.css`;
     - a scoped `src/styles/preview-v5.css` over the six 4.x primitives under `[data-ag-preview=v5]`;
     - `src/styles/v5.css` (`--ag-duration-medium: 320ms`).
     
     `build.mjs` becomes the only writer of `src/material/css/preview-v5.css`; delete the hand copy.
  3. Fix D-28 navy via `tokens/legacy`, and list the changed names and values in the PR body.
  4. Generate `src/material/compat/tokens.css` from the alias map and resolve the `no rendered 4.x value — review` entries.
  5. Add the test `src/material/__tests__/preview-v5.test.tsx`.
  6. Run the remote visual check: the frozen consumer-4x fixture is pixel-identical without the attribute.
  7. Regenerate the 4x `etc/api/{theme,tokens-*}.*`.
  
  The PLAT side (exports `./material`, `./compat/tokens.css`, the provider `preview` prop) **→** FIN-C REQ-FIN-36. Acceptance: AC-FIN-57 — on a **4x pipeline**, `node scripts/tokens/build.mjs --platform bridge-4x && git diff --exit-code src/material src/styles/v5.css src/styles/preview-v5.css` is clean, plus ledger MAT-41. This depends on OD-8 (the mirror pushes only `main`).
- **D.3-22 `next-fin/d-codemods`** (MAT-67, PR #28's content; #28 is CLOSED and unmerged). Merge after #190. On `next`, complete `fragments/codemods/mat.ts`:
  - renames;
  - `props` rows for the motion and a11y prop removals;
  - `cssVars` generated from `tokens/generated/compat-alias-map.json`: every `--glass-*` → `--ag-*` or `null`, resolving the 174 `uncovered`. Use a generator script in `scripts/mat/compat-alias-map.mjs` and do not hand-write the map.
  
  Fix the transforms until `fragments/codemods/mat/fixtures/{reduced-motion-initial,motion-imports,motion-props}` pass byte-equal and idempotent. Enabling the mat fixtures in `packages/cli/test/fixtures.test.ts` (remove `.filter(x => x === 'plat')`) **→ transfer** REQ-FIN-09. Never edit 4x `fragments/codemods/mat.ts` directly; it arrives through the `next → release/4.x` codemods sync (REQ-FIN-13, `sync/fragments-codemods-<yyyymmdd>`). Acceptance: AC-FIN-57 + ledger MAT-67 (`Object.keys(cssVars).length` = `--glass-*` count in the alias map on **both** lines after the sync).
- **D.3-22b `next-fin/d-deprecations-5x`** (MAT-67 / #127 remainder). After #125 has made `fragments/deprecations/mat.ts` equal across the lines, re-propose the 5x-only compat rows trimmed from #127 (`DEP-M1000…`) only where each one covers a 5.0 removal not already in the 180 4.x rows. Each DEP id needs a 4.x minor ≥4.2.0 `since`, and rows bound for 4.x go through the `release/4.x → next` direction. Run `gen:deprecations` and regenerate `src/internal/deprecations.generated.ts`. This joins the serial deprecation queue: one PR at a time, with regeneration in between. Acceptance: the ledger MAT-67 line-diff is empty, and `verify-breaking-register --coverage` covers every MAT removal.

**REQ-FIN-58 (MAT-42, -43, -44, -45, -47, -48, -50, -51, plus the layering and report clauses)**

- **D.3-23 `next-fin/d-motion-layers`** (a CSS sweep). Line 1 is `LAYER_ORDER_STATEMENT`, followed by one `@layer` equal to the fragment row, in `src/motion/css/{motion,view-transition}.css`. (`properties.css` is handled in D.3-19.) Delete their REQ-FIN-14 rows from `scripts/integration/baselines/*.json`. In `tests/motion/helpers/report.ts:38`, replace `GITHUB_SHA` with `CI_COMMIT_SHA`, which removes its REQ-FIN-21 `no-github-ci` baseline row. Acceptance: AC-FIN-14 MAT rows are clean, AC-FIN-58.
- **D.3-24 `next-fin/d-motion-transitions`** (MAT-42). Transition lists in `motion.css`/`view-transition.css` must be ⊆ `ANIMATABLE`: use `transition-behavior` for display/overlay, or amend the contract. Drop `--_ag-hover` from the motion CSS. Remove the `@property` for `--_ag-pointer/--_ag-optics/--_ag-press` (with D.3-19). The `ALLOWED_PROPS === ANIMATABLE` change in `verify-motion-css.mjs` **→ transfer** REQ-FIN-12. The `material.css` cascade and depth cross-fade scope **→ transfer** REQ-FIN-02. Test: `tests/motion/cascade.test.ts` checks that `[data-ag-interactive][data-ag-layer]` keeps `--ag-specular` and `--_ag-press`. Acceptance: ledger MAT-42.
- **D.3-25 `next-fin/d-no-mount`** (MAT-43). The no-mount-motion spec fails on absent subjects; it uses `listSubjects()`, and `test.fail()` when a subject is missing. Run L9 `tests/motion` remotely and emit `.artifacts/mat/<job>/motion-report.json`. The `::before`/`::after` binding and `transform-origin` **→ transfer** REQ-FIN-02. Acceptance: ledger MAT-43 (≥3 distinct frames of 12; 0 `will-change` 100 ms after settle; 0 animations 50 ms after mount).
- **D.3-26 `next-fin/d-calm-settle`** (MAT-44). Calm sets `animation: none` only on infinite animations. Run `settle.spec` remotely across 3 engines × {1440,390} × {no-preference,reduce} × {full,calm,none}. Acceptance: ledger MAT-44.
- **D.3-27 `next-fin/d-motion-ban`** (MAT-45). Add `@ts-expect-error` for every banned motion key on `AuraGlassProviderProps`, `MaterialRole`, `SurfaceProps` and MotionProvider props, in `tests/types/mat/motion-ban.test-d.ts` (≥9 lines), and remove the Pending block. Move `motionPolicy` out of `createGlassTheme` into `src/compat/mat/` with a DEP-M warning. `src/motion/pointerLight.ts` `pointerLightActive` returns false under forced colours (`pointerLight.test.ts`: 0 `setProperty`). Acceptance: ledger MAT-45.
- **D.3-28 `next-fin/d-ticker`** (MAT-47). Ref-count observed elements in `src/motion/ticker.ts`. Resolved motion comes only from `data-ag-motion` or the store, so remove every `matchMedia` from `src/motion/**` (`ticker`, `pointerLight`, `magnetic`). Test: in `src/motion/__tests__/ticker.test.ts`, subscribing and unsubscribing on an observed element keeps `data-ag-offscreen` live. Acceptance: ledger MAT-47 (`rg matchMedia src/motion` = 0; ticker test in a lane log).
- **D.3-29 `next-fin/d-view-transitions`** (MAT-48).
  - Use `view-transition-class: ag-morph` or `:active-view-transition-type(ag-morph)`.
  - Calm: opacity-only keyframes at `--ag-duration-micro` (120 ms), and FLIP under calm is an opacity cross-fade.
  - Read micro from the computed CSS.
  - The consumers that call `startMorph` **→ transfer** FIN-E REQ-FIN-72 (CMP-42 SegmentedControl) and FIN-F REQ-FIN-82 (Tabs, SourceTransition).
  - Run the remote spec `tests/visual/mat/view-transition-optics.spec.ts`.
  
  Acceptance: ledger MAT-48.
- **D.3-30 `next-fin/d-motion-entry`** (MAT-50; the seed is done in D.2-01).
  - `src/motion/peer-guard.ts` becomes browser-safe: `import('motion/react')` in try/catch, or an exports-condition stub, with no `node:` imports.
  - Add `'use client'` on `src/motion/public.ts` and every file under `adapter/**`.
  - Clean up the magnetic listeners.
  - Strengthen the adapter tests: MotionConfig mode; spring-smooth ≈ 322.3/32.31; drag ±1500 px/s dismisses and a slow drag snaps to a detent; momentum settles in ≤1000 ms; magnetic ≤8 px plus cleanup; Shared toggles `data-ag-animating`.
  - Add a remote Vite fixture with and without `motion`.
  
  Acceptance: ledger MAT-50.
- **D.3-31 `next-fin/d-motion-lint`** (MAT-51). Extend `GUARDED_DIRS` in `lint/rules/mat/motion-raf-via-ticker.cjs` (and siblings) to components/app-shell/data/ai/media/backdrops/date, at error or with a baseline ratchet. Create `scripts/mat/verify-preference-source.mjs`: it flags `matchMedia` on the 4 queries and 4.x reduced-motion hook imports outside `src/theme/{preferences,script}/**`. Add `tests/material/ci/verify-preference-source.test.ts` with a failing fixture and register it as L1. The loop check and `ANIMATABLE` allow-list in `verify-motion-css` **→ transfer** REQ-FIN-12. Violations in CMP/SURF files are routed to FIN-E/FIN-F as transfers. Acceptance: ledger MAT-51.

**REQ-FIN-59 (MAT-52, -53, -58, -59, -60, -64, -65, MAT stories, the QUAL-49..57 transfer)**

- **D.3-32 `next-fin/d-resolve`** (MAT-52). In `src/theme/preferences/resolve.ts`:
  - `resolveContrast` = `forced||contrastMore ? 'more' : max(rank(app), rank(user))`;
  - `pickDensity` accepts `spacious`;
  - contrast more ⇒ transparency ≥ tinted;
  - floors report glass-opacity and contrast-more;
  - a NaN guard on the `glassOpacity` clamp.
  
  Rebuild `src/theme/generated/prepaint-script.ts` with `scripts/mat/build-prepaint-script.mjs`. Test: `src/theme/__tests__/resolve.test.ts` gets a 1,024-case loop (forced×contrastMore×reducedTransparency×capability×app(4)×user(4)×glassOpacity{0,0.69,0.7,1}) that asserts on `resolvePreferences`, plus the app-more/user-standard and spacious cases. Acceptance: ledger MAT-52.
- **D.3-33 `next-fin/d-store-tests`** (MAT-53, tests only). Add to `src/theme/__tests__/store.test.ts`:
  - nested providers share one store instance (identity check);
  - a `set()` from an inner panel updates the outer snapshot and `<html>`;
  - a Profiler test: ≤1 commit in a 50-surface tree.
  
  The store reuse in `AuraGlassProvider.tsx` **→ transfer** REQ-FIN-04 (#121 rebased). The `store.set` validation **→ transfer** REQ-FIN-12 (#119). Keep the tests `pending` through the lane runner until both are on `next`. Acceptance: ledger MAT-53.
- **D.3-34 `next-fin/d-announcer`** (MAT-58). In `src/theme/announcer/**`: a per-region queue with replacement by id; `createStreamingAnnouncer.stop()` flushes the tail as a final write, with discard kept as a separate path. SURF StreamingText/Thread adopting it **→** FIN-F REQ-FIN-85. Tests in `src/theme/__tests__/announcer.test.tsx`: the final token is the last write with ≤11 writes over 10 s; two messages with the same id within 100 ms write only the second. Acceptance: ledger MAT-58.
- **D.3-35 `next-fin/d-prepaint`** (MAT-59). Merge after #119.
  1. Bring the body to ≤1,536 B minified and set `LIMIT = SPEC_LIMIT = 1536` in `scripts/mat/build-prepaint-script.mjs` (today `LIMIT = 3072`). Only an owner-approved contract change can raise it.
  2. Write `data-ag-tier` for persisted/app `standard|enhanced`, and cap an unknown engine at standard.
  3. Share the engine detector: `prepaint.ts` imports `src/theme/preferences/engine.ts`.
  4. Add the Jest drift test `src/theme/__tests__/prepaint-drift.test.ts` (esbuild in memory vs `PREPAINT_IMPL`).
  5. `tests/e2e/mat/prepaint.spec.ts` renders `AuraGlassScript` from the **built package** and never skips: 20 reloads × 3 engines, 0 blur frames, CLS 0, remote.
  6. Add the perf spec `tests/perf/browser/mat/a11y/prepaint.spec.ts` (≤1 ms, mid-tier mobile, remote).
  
  Acceptance: ledger MAT-59.
- **D.3-36 `next-fin/d-prefs-panel`** (MAT-60). In `src/theme/preferences-panel/GlassPreferencesPanel.tsx`:
  - a `Spacious` option;
  - `React.useId()` radio names;
  - per-option `aria-describedby` on disabled inputs;
  - a contrast `standard` lock under forced colours or OS more.
  
  `GlassPreferencesPanel.css` **→ transfer** REQ-FIN-05. Tests: Jest in `src/theme/__tests__/GlassPreferencesPanel.test.tsx` (two panels with distinct names, Spacious, the lock) and an RTL case in the remote visual/APG spec `tests/a11y/apg/mat/preferences-panel.spec.ts`. Acceptance: ledger MAT-60.
- **D.3-37 `next-fin/d-no-runtime-contrast`** (MAT-64). `scripts/mat/a11y-eslint-l1.mjs` must dynamically import the default export and exit 1 when a rule is missing; this is the L1 ESM loader fix, which also unblocks the REQ-FIN-05/07 lint gates. Raise the second agConfig block to `error`. Add a RuleTester case for canvas `getImageData` in `src/media`. For `src/media/sampling`, add an expiring exemption row naming it until REQ-FIN-86 (FIN-F) moves it under `src/backdrops/**` (§6.1). Acceptance: ledger MAT-64.
- **D.3-38 `next-fin/d-stories`** (MAT stories, §5.4). Remove story-supplied optics, ink overrides and private vars from `stories/mat/{ContrastFloors,Presets}.stories.tsx` and the Rungs story, and delete their rows from QUAL's story-contract baseline (REQ-FIN-106). Every MAT story has `parameters.ag {subject, kind}`. Acceptance: QUAL story-contract shows 0 MAT rows (part of AC-FIN-59).
- **D.3-39 `next-fin/d-a11y-suites`** (MAT-65).
  - Create `tests/visual/mat/a11y/pixel-contrast.spec.ts` (text-hidden twin; worst sample vs median backdrop; the 8×3×2×3×3×2 matrix; writes `.artifacts/mat/<job>/a11y-pixel-contrast.json`).
  - Create `tests/e2e/mat/coverage.spec.ts` (100 % of live `::before` backdrop filters carry `data-ag-surface`; decorative material elements are `aria-hidden`, not focusable, and have no role).
  - Every `tests/e2e/mat/*.spec.ts` iterates `listSubjects()` with owner attribution.
  - `pixel-contrast-artifact.test.ts` fails when the artifact is missing on release or main.
  - Zoom uses `deviceScaleFactor`.
  - Run `apg.axe({colorContrast:true})` over MAT subjects.
  
  The lane runs fail-closed, remote only. Acceptance: ledger MAT-65 (`rg -L listSubjects tests/e2e/mat/*.spec.ts` is empty; an `allow_failure:false` pipeline on `next` uploads the JSON with 0 failing flagship rows).
- **D.3-40 `next-fin/d-a11y-config`** (§6.1: the REQ-QUAL-49..57 transfer to REQ-FIN-59). Reconcile `tests/a11y/storybook-a11y-config.test.ts` (contract D06: MAT) with QUAL's REQ-QUAL-49..57 text: the axe rule set, colour contrast on, serious/critical = 0. Acceptance: the FIN-G REQ-FIN-104/-106 lane reads it with no pending rows.

**Merge-order notes for D.3 (PRD §20)**

FIN-D PRs merge in their slot. A PR that is ready early rebases and waits.

- **First:** D.3-01, then D.3-02 and D.2-01 at any time.
- **Token emitters:** D.3-04..-09, D.3-13 and D.2-02 merge after the FIN-A step-1 #113-remainder, because `tokens:build` has to exit 0 first. Run them one at a time, regenerating (`npm run tokens:build`, commit `src/tokens/generated/**`) after each.
- **CSS sweeps:** D.3-19, D.3-23 and D.3-24 merge after FIN-A step 4 (REQ-FIN-14/05), one at a time, regenerating the fragment baselines in between.
- **Theme and provider:** D.3-11/-12/-14/-16 merge after #121. D.3-33/-35 merge after #119 and #121.
- **Deprecations and codemods:** D.3-22b sits in the serial deprecation queue after #125. D.3-22 merges after #190, and the codemods sync then carries it to 4.x before the v4.3.0 tag.
- **4.x:** D.3-21 merges after #128 (trimmed), #156 and #124, and before v4.2.0/v4.3.0.

### FIN-D.4 Validation (GitLab CI only, `allow_failure: false`, job URL recorded in the Appendix A row)

Nothing below can be proven until OD-8 gives GitLab project 87152036 pipelines on `next` and `release/4.x`; today it has 0 pipelines and only `main`. Until then:
- Local runs are limited to narrow Jest/node tests (`npx jest <file>`, `node scripts/... --check`) and `tsc` on a small config.
- Everything marked *remote* runs only in GitLab or through skill `auraone-remote-run`. Never use this Mac and never use local Docker.
- No row is `done` without the green job URL. Each job flips to `allow_failure: false` after its first green run, with a `ci/plat/activation.json` row (FIN-B).

| AC-FIN | Must be green (line) | Jobs / lanes | Remote-only? |
|---|---|---|---|
| AC-FIN-50 | `next` | `mat:test:tokens-interim` (`tests/tokens/{compiler-guards,oklch,scales,private-ag-namespace}.test.ts`, `src/motion/__tests__/spring-linear.test.ts`, `src/theme/__tests__/createGlassTheme.guard.test.ts`), `mat:test:drift`, L1 token gates; L5 nested-density spec | L5 density spec remote |
| AC-FIN-51 | `next` | L1 `tests/a11y/contrast-matrix.test.ts` (with mutation case); L5/visual `tests/visual/mat/modes-zero-js.spec.ts` 6 modes × 3 engines ≤0.1 % | visual remote |
| AC-FIN-52 | `next` | L1 `src/theme/__tests__/{presets,createGlassTheme,createBrandTheme}.test.*`, `tests/material/exports/seed-free.test.ts`; `plat:build:pack` tarball import printing `true`; `generate-exports --check` exit 0 | pack remote |
| AC-FIN-53 | `next` + `release/4.x` | `contract:ci-fragments` (`verify-ci-fragments.mjs` → `contract:ci-fragments OK` on both lines), `mat:lint:literals`, `mat:test:optics` with `--ratchet`, `mat:certify:beta-optics` (release scope), `token-gates-l1` (undefined/dead vars), `tests/lint/mat/**` | no |
| AC-FIN-54 | `next` | L1 `tests/material/exports/entries.test.ts`, `tests/tokens/shadcn-interop.test.ts`, `material-css-api.mjs --check`, `types-runtime.mjs`, API-report check over `etc/api/{material,theme,tokens,motion,root.mat,compat.mat}.*` | no |
| AC-FIN-55 | `next` | L1 `materialProps`, `properties.test.ts`, `properties-union.test.ts`, `attribute-discipline.test.ts`, `css-contract.test.ts`; typecheck incl. `tests/types/mat/**`; L5 `tests/e2e/mat/material/group.spec.ts` | e2e remote |
| AC-FIN-56 | `next` | L1 row `verify-material-runtime` (log `[verify-material-runtime] OK`) | no |
| AC-FIN-57 | `release/4.x` + `next` | 4x `mat:build:bridge` (`build.mjs --platform bridge-4x && git diff --exit-code …`), 4x Jest `preview-v5.test.tsx`, 4x consumer-4x visual identity; `next` `plat:test:cli` fixtures (mat cases byte-equal and idempotent); the cssVars-count check on both lines after the codemods sync; deprecations line-diff empty | consumer-4x visual remote |
| AC-FIN-58 | `next` | L1 `verify-motion-css` (FIN-A file), `verify-preference-source`, motion lint at error; Jest `src/motion/__tests__/**`, `tests/types/mat/motion-ban.test-d.ts`; L9 `tests/motion` + `motion-report.json`; settle spec 3 engines × 2 widths × 2 OS × 3 modes; VT optics spec; Vite fixture with/without `motion` | L9/settle/VT/Vite remote |
| AC-FIN-59 | `next` | Jest `src/theme/__tests__/{resolve,store,announcer,prepaint-drift,GlassPreferencesPanel}.test.*`, `a11y-eslint-l1.mjs`; L5 `prepaint.spec.ts` (20 reloads × 3 engines, CLS 0, not skipped); perf `prepaint.spec.ts` ≤1 ms; `pixel-contrast.spec.ts` artifact, `coverage.spec.ts`, axe `colorContrast` over MAT subjects; QUAL story-contract 0 MAT rows | all browser/perf/visual remote |

The cross-WP gates must also stay green after every FIN-D merge: AC-FIN-01 (`mat:test:drift`) and the AC-FIN-14 MAT rows in `scripts/integration/baselines/*.json` (each one only shrinks; delete the rows as D.3-19/-23 land).

### FIN-D.5 Exit criteria

- [ ] **AC-FIN-50** — REQ-FIN-50: REQ-MAT-02 (D.3-04), -04 (D.2-02), -05 (D.3-05), -06 (D.3-06), -08 (D.3-07)
- [ ] **AC-FIN-51** — REQ-FIN-51: REQ-MAT-11 (D.3-08), -12 (D.3-09)
- [ ] **AC-FIN-52** — REQ-FIN-52: seed clause with tarball evidence (D.2-01), REQ-MAT-14 (D.3-10), -15 (D.3-11), -16 (D.3-12)
- [ ] **AC-FIN-53** — REQ-FIN-53: MAT CI fragment `contract:ci-fragments OK` on both lines (D.3-02), REQ-MAT-17 (D.2-03), -18 (D.2-04), -39 (D.3-03)
- [ ] **AC-FIN-54** — REQ-FIN-54: REQ-MAT-20 (D.3-13), -22 (D.3-14)
- [ ] **AC-FIN-55** — REQ-FIN-55: REQ-MAT-23 (D.3-15), -24 (D.3-16), -26 (D.3-17), -27 (D.3-18), -28 (D.3-19)
- [ ] **AC-FIN-56** — REQ-FIN-56: REQ-MAT-37 (D.3-20)
- [ ] **AC-FIN-57** — REQ-FIN-57: REQ-MAT-41 (D.3-21), -67 (D.3-22, D.3-22b, plus 4.2.0/4.3.0 published by FIN-C REQ-FIN-45)
- [ ] **AC-FIN-58** — REQ-FIN-58: layering/report (D.3-23), REQ-MAT-42 (D.3-24), -43 (D.3-25), -44 (D.3-26), -45 (D.3-27), -47 (D.3-28), -48 (D.3-29), -50 (D.2-01 seed + D.3-30), -51 (D.3-31)
- [ ] **AC-FIN-59** — REQ-FIN-59: REQ-MAT-52 (D.3-32), -53 (D.3-33), -58 (D.3-34), -59 (D.3-35), -60 (D.3-36), -64 (D.3-37), MAT stories (D.3-38), -65 (D.3-39), QUAL-49..57 config (D.3-40)
- [ ] Transfers resolved: every **→ transfer** clause above is merged by its owner, and the dependent FIN-D test is no longer `pending`
- [ ] D.1 complete:
  - #113 and #280 closed with the survivor named;
  - `ci/mat` hunks removed from #178/#179/#180;
  - #121/#127/#128/#173/#174 trimmed of FIN-D-owned hunks;
  - no `validate.mjs` `'ag-rendered'` duplicate on `next`
- [ ] Ledger: all 38 FIN-D rows in Appendix A show `done`, each with a green `allow_failure:false` job URL on its line

### Owner/human actions this package depends on (the agent never performs, approves or records them)

(a) **Agent prep, done by FIN-D.**
- Write each item's exact contract text for the `contract/v1.2-final` PR (Appendix C):
  - C-2: `data-ag-{theme,shadcn-source,scroll-locked,hit-clamp,focus-inset,lens-defs}`;
  - C-7: any `--ag-*` that stays public;
  - C-8: the 4x bridge producer paths;
  - retiring `no-inline-glass` from `lint-rule-owners.json`.
- Implement the listed fallback for each item in the meantime: stop emitting, rename to `data-ag-part` or `--_ag-*`, or move outputs under `.artifacts/mat/`.
- Prepare the measured size artifact for any `mat:tokens-js` raise.
- Write the 4.2.0/4.3.0 DEP-M row list for the release notes.

(b) **Owner actions (Gurbaksh). Record each one in `docs/release/decisions/od-<nn>.md` (FIN-H path).**
1. **OD-8.** Configure a GitLab pull mirror on project 87152036 with pipelines on mirror updates enabled, then disable `mirror-to-gitlab --prune` for this repo. This blocks every AC-FIN-5x job URL and the 4x `mat:build:bridge` run.
2. **OD-16.** Approve or reject C-2, C-7 and C-8 in the `contract/v1.2-final` PR. This blocks MAT-14/-20/-27 (otherwise the fallbacks ship) and the 4x bridge output paths.
3. **OD-18.** Confirm the `createBrandTheme` `accentShift` default of 0, or state a different value. This blocks MAT-16.
4. **Perf budget.** Approve or reject any `Perf-Budget-Raise:` for `mat:tokens-js` (#178 proposed 6144 B).
5. **Release owner (REQ-FIN-45, deployment runbook).** Publish 4.2.0 (material/motion/a11y DEP-M rows active) and 4.3.0 (`--glass-*`, mode hooks, personas, theme rows active), only after D.3-21/D.3-22 have reached `release/4.x`. Publishing goes through the tag pipeline `plat:publish:npm` and needs OD-2/OD-10 trusted publishing. This blocks MAT-67 acceptance (`npm view aura-glass versions`).
6. **PR #28.** It is CLOSED. Confirm that its content is redone on `next` as D.3-22 rather than reopened.


---

## 9. WP FIN-E — Core components leftovers (CMP)

Source: PRD-F §5.5 (REQ-FIN-70..76 = 129 original REQ-CMP rows, Appendix A.3), AC-FIN-70..76 (§17), the ledger rows `key: "CMP"` in `implementation-audit/fin-open-ledger.json`, and the status in `implementation-audit/status-2026-10-10/FIN-E.md`.

State as of 2026-10-10 (re-checked with `gh pr list --json mergeable,mergeStateStatus` and `git merge-tree --write-tree` against `next` e5a2d6835 and `release/4.x` 645735fce):
- Done: 0 of 7 REQ-FIN and 0 of 129 original REQs. Merged: only parts of CMP-31 and CMP-59, through #369.
- 129 open FIN-E PRs: #200–#337, minus 9 that map to FIN-A (#203, #247, #249, #280, #323, #325, #326, #332, #336).
  - 127 target `next`; #228 and #313 target `release/4.x`; none targets `release/4.1.x`, and the PRD needs none there.
  - All are single commits on `84a3b94f1`, 30 commits behind `next`. 35 are CONFLICTING and 94 MERGEABLE. None has a status check.
- GitLab project 87152036 has 0 pipelines, so no remote APG, visual, perf or canary spec has ever run.
- No PR exists for REQ-CMP-27 (its remaining work is CI only) or for `tests/types/cmp-contract.test-d.ts` (the AC-FIN-74 gate).

**May touch**:
- `src/{components,primitives,icons,foundation,forms}/**`, minus the FIN-A files and minus the SURF dirs `src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition,timeline}/**`
- `src/compat/cmp/**`, `src/root/cmp.ts`
- `lint/rules/cmp/**` minus `no-overlay-global-listeners.cjs`
- `fragments/*/cmp.ts` (plus `fragments/codemods/cmp/**`, `fragments/literals-baseline/cmp.json`, `fragments/playwright/cmp.json`) minus `fragments/css/cmp.ts`
- `scripts/cmp/**`, `ci/cmp.gitlab-ci.yml`, `ci/cmp/**`, `.changeset/cmp-*.md`
- `registry/{items/{confirm-dialog,account-menu},blocks/overlay-flows}/**`, `stories/cmp/**`, `canaries/next16/app/cmp/**`
- `tests/fixtures/consumer-4x/cases/cmp/**`, `etc/api/{primitives,icons,forms,root.cmp,compat.cmp}.*`
- `tests/{foundation,controls,overlays,primitives,compiler,ssr/cmp,e2e/cmp,visual/cmp,perf/browser/cmp,a11y/apg/cmp,lint/cmp,types/cmp}/**`, `tests/types/cmp-contract.test-d.ts`

**Must not touch** (the open PRs below currently do; every such hunk is listed per PR with its owner):
- FIN-A: `src/components/overlays/_shared/{overlaySurface,overlayTypes,useOverlayLayer}.ts`, `src/foundation/portal.ts`, `src/primitives/{DismissableLayer,FocusScope}.tsx`, `src/theme/**`, `src/material/css/{material,lens}.css`, `tokens/comp/**`, `packages/cli/test/fixtures.test.ts`, `scripts/integration/**`.
- The contract PR: `jest.config.js` and `src/contracts/**`.
- FIN-F: the SURF dirs, `src/{data,date,ai}/**` and `src/compat/surf/**`.
- FIN-C: `package.json` (non-`exports` keys), `packages/cli/src/**`, `scripts/{build,release,docs}/**`, `tests/{release,dx}/**`, and `canaries/**` outside `canaries/next16/app/cmp/`.
- FIN-D: `lint/rules/mat/**` and `tests/{a11y,tokens}/**` outside `tests/a11y/apg/cmp/`.
- FIN-G: `lint/rules/qual/**` and `tests/contract/**`.
- FIN-H: `docs/release/decisions/removals/RM-*.json` and `docs/release/decisions/od-*.md`.
- Also: `.storybook/**` and `tests/helpers/**`.

**FIN-E rules (in addition to the Common rules)**
1. **Hand-offs, not edits.** When a PR carries a hunk in another WP's file, drop the hunk and open a one-line clause request on that WP's PR (or its §6.1 transfer row), quoting the ledger text. The requesting REQ's acceptance is evaluated after both PRs merge (§6.1). Never merge a FIN-E PR that still contains another WP's hunk: `contract:ownership` must pass, and a failure is recorded, never bypassed.
2. **Generated deprecation files.** `deprecations.json`, `src/internal/deprecations.generated.ts` and the 4.x `src/utils/deprecations.generated.ts` are only ever regenerated, with `npm run gen:deprecations`, never hand-merged.
   - The single source of DEP-C rows is `fragments/deprecations/cmp.ts` on `release/4.x` (#313). It reaches `next` only through the REQ-FIN-13 sync (`scripts/release/sync-fragments.mjs`, FIN-A #125).
   - next-side PRs must not add DEP-C rows. Seven of them do, and their ids collide with #313; see P7.
   - Deprecation-touching PRs merge one at a time, each followed by a regenerate and a rebase of the next one.
3. **CSS sweeps one at a time.** P4 merges strictly in order #322 → #308 → #331 → (FIN-A #332) → #334 → #324. After each merge:
   - regenerate `fragments/literals-baseline/cmp.json`;
   - delete the PR's own CMP rows from `scripts/integration/baselines/*.json` (once FIN-A creates them; PRD-F §4.3 rule 3);
   - rebase the next sweep and every per-component CSS PR (11 PRs touch `Combobox.css`, 10 touch `Select.css`).
4. **Same-file chains** (rebase each on its predecessor, never in parallel):
   - SegmentedControl #210 → #211 → #213
   - Slider #217 → #218 → #219 → #221
   - Checkbox #220 → #222 → #223
   - TextField #229 → #230 → #231
   - Select #234 → #235 → #236 → #237 (all rebase on #254, which merges earlier in P5)
   - Combobox #238 → #239 → #240 → #241 → #242 → #243 → #337 (#337 also covers non-Combobox files, but must follow #242)
   - NumberField #244 → #245 → #246
   - Sheet #260 → #261 → #262 → #263 → #264
   - Tooltip #267 → #268 → #269
   - Menu #270 → #271 → #272 → #273
   - Toast #274 → #275 → #276 → #277 → #278
   - `ci/cmp.gitlab-ci.yml`: #315 → #311 → #312
   - `fragments/lanes/cmp.ts`: #307 → #301
5. **Pipelines on FIN branches.** The `.gitlab-ci.yml` `workflow:rules` on next run PR-scope pipelines only for `^next-(plat|mat|cmp|surf|qual)/` and `^4x-(plat|mat|cmp|surf|qual)/`.
   - `next-fin/*`, `4x-fin/*` and every current FIN-E head (`next-fin/cmp-*`, `next-fin/4x-cmp-*`) get `when: never`.
   - Until FIN-B (REQ-FIN-20/-22, owner of `.gitlab-ci.yml`) adds the `next-fin/`, `4x-fin/` and `4x11-fin/` prefixes, the only GitLab evidence is the post-merge `next` / `release/4.x` pipeline. The CMP-132 4.x PR must use `4x-cmp/e-deprecations`, the prefix PRD §5.5 names.
   - Never merge on faith. Under PRD-F §1.1 a row is `done` only with a green `allow_failure: false` job URL on the target line.
6. **Merge gate per PR:**
   - the GitLab pipeline on the head SHA (or the post-merge pipeline under the OD-8 fallback) is green: `node scripts/ci/gitlab-status.mjs --sha <sha>`;
   - the PR's ledger `acceptance` is met;
   - the PR has no foreign hunks;
   - the PR has no conditional assertions: `rg -n "if \(await|<= before|Math\.max\(1" <its specs>` returns 0.

### FIN-E.1 Land existing open PRs

Every one of the 129 open FIN-E PRs appears exactly once below. The FIN-A-mapped CMP PRs (#203, #247, #249, #280, #323, #325, #326, #332, #336) are in the FIN-A section; they are named here only where they gate a FIN-E slot.

**Merge phases.** Each phase is tied to a PRD §20 FIN-A step, so a FIN-E PR merges only once the producer behaviour it depends on is on `next`. Work on every PR (rebase, trim, amend) starts now, in parallel; only the merge waits for its slot.

| Phase | Gate before the first merge in the phase |
|---|---|
| P0 CI plumbing | none (any time). These PRs register the CMP jobs, lanes and budgets that every later PR is validated by. |
| P4 CSS sweeps | FIN-A §20 step 4: REQ-FIN-14 #116 merged, then FIN-A #323 (CMP-09). Strictly serial (rule 3). |
| P5 material seam | FIN-A §20 step 5: REQ-FIN-02 #117, #247, #203. The hand-off hunks from P5 PRs must be in the REQ-FIN-02 PR before it merges. |
| P6 foundation overlays | FIN-A §20 step 6: #121 (rebased), the LayerStack chain #325 → #249 → #326, and #120 for #214. |
| P7 deprecations | FIN-A §20 step 7: REQ-FIN-13 #125 merged. Then #313 on `release/4.x`, then the `sync/fragments-deprecations-<yyyymmdd>` PR, then the next-side PRs one at a time with `npm run gen:deprecations` between them. |
| P8 families | After P4–P7 for anything touching the same files. Order: 70, 71, 72, 73, 74, 75, 76, with #310 last (it regenerates `etc/api`). |

**Action legend:**
- **MERGE as is**: no conflict and no foreign hunk. Merge once green; if a predecessor merge makes it conflict, rebase in its slot.
- **REBASE+RESOLVE**: the conflict files are listed; take `next`'s side for anything already merged.
- **TRIM**: drop the named hunks or files.
- **AMEND**: mergeable, but a ledger clause is missing; add it in the same PR.
- **SPLIT**: drop the hunks in other WPs' files and hand them to the named owner.
- **TRANSFER**: the whole PR sits in another WP's files; that WP merges it, and FIN-E only verifies the CMP acceptance.
- **CLOSE**: the survivor is named.

| # | PR | Line | REQ-FIN · original REQ | gh state 2026-10-10 | Action | Exact conflict / gap to fix |
|---|---|---|---|---|---|---|
| 1 | #315 | next | REQ-FIN-70 · CMP-01 | MERGEABLE | TRIM to remaining scope | Drop the `src/data/chip/Chip.tsx` hunk (SURF file; §6.1 gives it to REQ-FIN-83/FIN-F, who switch Chip to the new `src/components/chip/ChipToggle.tsx` seam). Keep the Base UI pin test, import confinement (allow-list `src/data/chip/Chip.tsx` only until REQ-FIN-83 merges, as an expiring baseline row) and `cmp:build:dts` tarball check. First of the `ci/cmp.gitlab-ci.yml` chain (#315 → #311 → #312). |
| 2 | #311 | next | REQ-FIN-76 · CMP-141 | MERGEABLE | REBASE+RESOLVE then merge | Rebase on #315 (`ci/cmp.gitlab-ci.yml`). Keep `cmp:test:selectors`, `.artifacts/cmp/<slug>/` and §4.13.4 `allow_failure: true` only until each job's first green. The flip to `allow_failure: false` is an `ci/plat/activation.json` row that FIN-B writes; FIN-E supplies the URL. Line 2 must read "no cloud credentials" (REQ-FIN-21 row), with no duplicate `npm ci`. |
| 3 | #307 | next | REQ-FIN-76 · CMP-138 | MERGEABLE | AMEND then merge | Survivor for `fragments/lanes/cmp.ts` (also edited by #301) and `fragments/playwright/cmp.json`. **Gap:** `fragments/playwright/cmp.json` has `cmp:cert-touch` but no `tests/a11y/apg/cmp/**` projects, and there is no Firefox project anywhere. Add `cmp:apg-{chromium,webkit,firefox}` (testMatch `tests/a11y/apg/cmp/**/*.spec.ts`) and `cmp:overlays-{webkit,firefox}`. CMP-27 and the APG legs need all 3 engines. |
| 4 | #301 | next | REQ-FIN-75 · CMP-130 | MERGEABLE | REBASE+RESOLVE then merge | Rebase on #307 and add only the L10 (t2-page) and L11 (next16 server) rows. `canaries/next16/tests/cmp-server.spec.ts` is a FIN-C path (`canaries/**` minus `canaries/*/cmp/`). Move it under `canaries/next16/app/cmp/` if the canary runner collects it there; otherwise hand the file to FIN-C. Survivor for `canaries/next16/app/cmp/server/page.tsx` over #330. |
| 5 | #306 | next | REQ-FIN-76 · CMP-137 | MERGEABLE | MERGE as is | 416 perf rows marked `provisional: true` until the D-26 calibration. Grading in CI is AC-FIN-76 (CMP-137). |
| 6 | #305 | next | REQ-FIN-76 · CMP-136 | MERGEABLE | TRIM to remaining scope | Drop the `docs/size-budgets.json` hunk. It hand-writes measured data (`status: pass → pending`, `measuredBytes: null`), which is banned; the size tool regenerates that file in CI. Keep `fragments/size-budgets/cmp.ts`. |
| 7 | #322 | next | REQ-FIN-70 · CMP-08 | CONFLICTING | TRIM to remaining scope | Conflicts with next on 30 CSS files (MAT-003 namespace/literal commits): rebase onto next after FIN-A #116 (REQ-FIN-14) and #323 (CMP-09), then rerun the sweep. Drop the SURF CSS files {breadcrumbs,command-palette,pagination,tab-bar,tabs,timeline} (FIN-F REQ-FIN-90/SURF-190) and `lint/rules/qual/{no-transition-all,no-permanent-will-change}.cjs` (FIN-G REQ-FIN-104/105). Remove the CMP rows of the REQ-FIN-11/-14 baselines in the same PR. |
| 8 | #308 | next | REQ-FIN-76 · CMP-139 | CONFLICTING | TRIM to remaining scope | Conflicts on 50 CSS files plus `lint/rules/mat/_literals.cjs`. Rebase after #322. Drop the 7 SURF CSS files (→ FIN-F) and the `_literals.cjs` marker change (MAT-owned; send it to FIN-D as a clause request). Regenerate `fragments/literals-baseline/cmp.json` with the tool (every file `{}`). Keep `fragments/review/cmp.ts` (L14 items). |
| 9 | #331 | next | REQ-FIN-70 · CMP-18 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on AlertDialog/Combobox/Dialog/SearchField/Select/Sheet/Switch CSS and `deprecations.json`. Rebase after #308. Drop the hand-edited `deprecations.json` and regenerate it with `npm run gen:deprecations`. |
| 10 | #334 | next | REQ-FIN-70 · CMP-21 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Select.css`. Rebase after #331 (and FIN-A #332). Container queries replace the 5 viewport rules; `tests/visual/cmp/reflow.spec.ts` stays remote-only. |
| 11 | #324 | next | REQ-FIN-70 · CMP-13 | MERGEABLE | TRIM to remaining scope | Move `tests/components/focusable-when-disabled.test.tsx` to `tests/controls/` (`tests/components/` has no owner). Rebase after #334 (same component CSS). |
| 12 | #248 | next | REQ-FIN-74 · CMP-79 | CONFLICTING | SPLIT | Conflicts on `overlays/_shared/overlays.css` and `src/material/css/material.css`. FIN-E part: Dialog/AlertDialog/Sheet Backdrop `data-ag-layer="scrim"`, `data-ag-overlay-top`, `forceRender`, `overlays.css` (layout and opacity only) and `tests/overlays/scrim.test.tsx`. Hand off: the `material.css` scrim rule (`--ag-scrim-{clear,media}`, no `pointer-events:none`) to REQ-FIN-02 (#117); `src/theme/layers/{LayerStack,useLayer}.ts` and `useOverlayLayer.ts` depth to REQ-FIN-07 (#122/#249). Merge after both. |
| 13 | #257 | next | REQ-FIN-74 · CMP-89 | MERGEABLE | TRIM to remaining scope | Move the `material.css` nested-dialog dim (`.ag-dialog-popup[data-ag-nested-open]`) to REQ-FIN-02 (§6.1, MAT clause in `material.css`). Keep the container query, size grid, stories and the 390 spec. |
| 14 | #251 | next | REQ-FIN-74 · CMP-82 | MERGEABLE | TRIM to remaining scope | Drop the `overlaySurface.ts`/`overlayTypes.ts` hunks (`'select'\|'combobox'` OverlayKind + `regular` map). They are FIN-A 02 files; send them to the REQ-FIN-02 PR as a clause. #254 needs the same lines. Keep the idle test and the infinite-animation spec. |
| 15 | #254 | next | REQ-FIN-74 · CMP-85 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Combobox.css` and `Select.css`; rebase after the P4 sweeps. Drop the duplicate `overlayTypes.ts` hunk (see #251). Combobox/Select use `defaultPositionerProps`; the 390 px spec covers 5 kinds. |
| 16 | #265 | next | REQ-FIN-74 · CMP-97 | MERGEABLE | TRIM to remaining scope | Drop the `overlaySurface.ts` hunk (`OverlayMaterialOpts` variant/thickness/prominent) and send it to REQ-FIN-02. Delete the stray `tests/debug/dbg.test.tsx`. |
| 17 | #256 | next | REQ-FIN-74 · CMP-88 | MERGEABLE | TRIM to remaining scope | Slot after FIN-A #325 → #249 → #326 (status §3.1). Drop the `useOverlayLayer.ts` hunk (`lockScroll`, `restoreFocusTo:false`, ownership comment); it is REQ-FIN-07's file, so hand it to the #122 owner. Record the ownership decision in REQ-FIN-07's PR. Keep the Dialog/AlertDialog/Sheet changes and `dialog.apg.spec.ts`. |
| 18 | #250 | next | REQ-FIN-74 · CMP-81 | MERGEABLE | MERGE as is | Merge after FIN-A #247/#249. The exact blurred-surface counts are only observable once those land. |
| 19 | #214 | next | REQ-FIN-73 · CMP-45 | CONFLICTING | TRANSFER (merge in owner WP slot) | Conflicts on `tokens/comp/comp.tokens.json`. The whole PR is outside FIN-E (`tokens/comp/**` = FIN-A REQ-FIN-11; `tests/tokens/**` = FIN-D). The REQ-FIN-11 owner rebases it after #120, re-runs `npm run tokens:build`, and merges. CMP-45 acceptance is evaluated after it merges together with #215. |
| 20 | #317 | next | REQ-FIN-70 · CMP-03 | CONFLICTING | TRIM to remaining scope | Conflicts on `Breadcrumbs.Overflow.tsx`, `Toast.client.tsx` and `AuraGlassProvider.tsx`. Drop the `AuraGlassProvider.tsx` self-adoption hunk (already on next via #369; FIN-A 04 file). Drop the 11 SURF files (breadcrumbs, command-palette, tab-bar, tabs, timeline; FIN-F REQ-FIN-80 forwardRef). Rebase `Toast.client.tsx`. **Gap:** delete `tests/foundation/contract-coverage.json` and change `src/foundation/__tests__/portal-root.test.tsx` (still reads it) to iterate `discoverCmpMetas()`. |
| 21 | #333 | next | REQ-FIN-70 · CMP-20 | MERGEABLE | TRIM to remaining scope | Drop `src/components/tabs/Tabs.tsx` (SURF, FIN-F). Keep hit-area spans and `tests/e2e/cmp/sizing.spec.ts`. |
| 22 | #313 | 4.x | REQ-FIN-76 · CMP-132 | MERGEABLE | AMEND then merge | Survivor CMP fragment (166 DEP-C rows) on `release/4.x`. Add the 22 symbols that only #302 has: GlassActivityFeed, GlassBreadcrumbs, GlassButtonGroup, GlassChip, GlassCommand, GlassCommandPalette, GlassDescriptionList, GlassDropdown, GlassField, GlassHeading, GlassImageList, GlassKeyValueEditor, GlassLink, GlassMenu, GlassNumberInput, GlassPagination, GlassSearchInput, GlassTabBar, GlassTabs, GlassText, GlassTimeline, GlassToggleGroup. SURF names go to `fragments/deprecations/surf.ts` via FIN-F. Generate `deprecations.json`, `src/internal/deprecations.generated.ts` and `src/utils/deprecations.generated.ts` with the generator, never by hand. Re-home the branch to `4x-cmp/e-deprecations` (the only 4x prefix `.gitlab-ci.yml` runs, and the prefix PRD §5.5 names). Then REQ-FIN-13's sync PR carries the rows to next with no deletions. |
| 23 | #314 | next | REQ-FIN-76 · CMP-132 | CONFLICTING | TRIM to remaining scope | Conflicts on `deprecations.json`. The fragment content reaches next through the REQ-FIN-13 sync, not by a forward-port. Reduce the PR to `tests/overlays/overlay-deprecations-4x.test.ts` (PENDING-test replacement) and merge it right after the sync PR. |
| 24 | #279 | next | REQ-FIN-71 · CMP-28 | CONFLICTING | TRIM to remaining scope | Conflicts on `deprecations.json`. Drop the new DEP-C0221 row: GlassLabel is DEP-C0280 in #313, so point the `src/compat/cmp/controls/GlassLabel.tsx` warn id at DEP-C0280. Drop the `docs/release/decisions/removals/RM-11.json` hunk; FIN-H removes GlassLabel from RM-11. Regenerate. Keep FocusScope in Sheet/Tour and `tests/primitives/primitives.test.tsx`. |
| 25 | #282 | next | REQ-FIN-75 · CMP-111 | CONFLICTING | TRIM to remaining scope | Conflicts on `deprecations.json`, `Heading.css` and `Text.css`. Drop rows DEP-C0222/0223, use #313's DEP-C0265 (Typography) and DEP-C0266 (DisplayText) in the compat adapters, drop the RM-11 hunk (→ FIN-H), rebase the CSS after P4, and regenerate. |
| 26 | #283 | next | REQ-FIN-75 · CMP-112 | CONFLICTING | TRIM to remaining scope | Conflicts on `deprecations.json` and `Grid.css`. Drop rows DEP-C0224..0226 and use #313's ids (GlassGrid = DEP-C0270; look up GlassMasonry/GlassMasonryGrid). Drop the RM-11 hunk (→ FIN-H) and regenerate. **Gap:** add the Grid.stories Masonry story with focusable buttons; delete `if (domOrder.length === 0) return;` at `tests/e2e/cmp/layout/grid-masonry.spec.ts:16`; add the GlassFlex/GlassBox compat that PRD-3 §7 requires. HStack/VStack are `removeIn 5.0.0` removals in #313, so they get no adapter. |
| 27 | #285 | next | REQ-FIN-75 · CMP-114 | CONFLICTING | TRIM to remaining scope | Conflicts on `deprecations.json` and `Badge.css`. Drop rows DEP-C0227..0229 and use #313's ids (LiquidGlassBadgeCluster = DEP-C0236). Drop the RM-11 hunk (→ FIN-H), rebase the CSS, regenerate. |
| 28 | #288 | next | REQ-FIN-75 · CMP-117 | CONFLICTING | TRIM to remaining scope | Conflicts on `deprecations.json`. Drop row DEP-C0230 (CircularProgress already has an id in #313). Drop the RM-11 hunk (→ FIN-H). Regenerate. |
| 29 | #298 | next | REQ-FIN-75 · CMP-127 | CONFLICTING | TRIM to remaining scope | Conflicts on `deprecations.json`. **ID collision:** its DEP-C0231..0234 (ImageList, ImageListItem, ImageListItemBar, GlassGallery) are GlassCard, GlowingCard, WidgetGlass and GlassWorkspacePanel in #313. Drop the rows and use #313's ImageList ids. Drop the RM-11 hunk (→ FIN-H). Regenerate. |
| 30 | #302 | next | REQ-FIN-76 · CMP-131 | CONFLICTING | TRIM to remaining scope | Conflicts on `deprecations.json`. **ID collision:** all 59 added ids clash with different #313 symbols (e.g. DEP-C0240 is CircularProgress here and GlassAvatarGroup in #313). Drop every fragment row and re-point the 57 adapters at #313 ids; the 22 missing symbols go into #313 (P7.1). Adapters for SURF names (GlassBreadcrumbs, GlassPagination, GlassTimeline, GlassActivityFeed, GlassTabs, GlassTabBar, GlassCommand, GlassCommandPalette) move to `src/compat/surf/**` (FIN-F) unless PRD-3 §7 lists them as CMP core. GlassStepper stays `<ol aria-current="step">`. Regenerate. |
| 31 | #320 | next | REQ-FIN-70 · CMP-06 | CONFLICTING | SPLIT | Conflicts on `deprecations.json`, `Breadcrumbs.Overflow.tsx`, `src/contracts/components.ts` and `tests/contract/components.test.tsx`. Hand off `src/contracts/components.ts` to the `contract/v1.2-final` PR (Appendix C, CC-CMP-01, OD-16), `tests/contract/**` to FIN-G, and `tests/{app-shell,media}/doubles/dialog.tsx` plus Breadcrumbs to FIN-F. Drop the 2 fragment rows, which already match #313. Keep the compound pruning on the OD-16 fallback list until OD-16 approves; post-seed parts-contract runs over every meta. |
| 32 | #316 | next | REQ-FIN-70 · CMP-02 | MERGEABLE | MERGE as is | 10-value `ChangeReason` table test. |
| 33 | #318 | next | REQ-FIN-70 · CMP-04 | MERGEABLE | MERGE as is | `useControllableWarning` on every controllable root. |
| 34 | #319 | next | REQ-FIN-70 · CMP-05 | MERGEABLE | MERGE as is | `lint/rules/cmp/prop-grammar.cjs` (error on CMP, warn on SURF) plus `Omit<…,'onChange'>` type tests. |
| 35 | #321 | next | REQ-FIN-70 · CMP-07 | MERGEABLE | MERGE as is | Normalised `data-state`. The 3 pre-existing parts-contract failures (Form, KeyValueEditor×2) must be green by AC-FIN-70. |
| 36 | #327 | next | REQ-FIN-70 · CMP-14 | MERGEABLE | MERGE as is | `tests/foundation/dom-contract.test.tsx` over every meta's stories. |
| 37 | #328 | next | REQ-FIN-70 · CMP-15 | MERGEABLE | TRIM to remaining scope | Drop the `package.json` hunk: the `scripts` key belongs to FIN-C, which adds the `cmp:test:foundation-pattern` script line, and the PR's rewrite of `—` to `\u2014` in `description` must go. Keep `tests/foundation/hooks.test.tsx` and the `.mjs` → `.test.ts` moves. |
| 38 | #329 | next | REQ-FIN-70 · CMP-16 | MERGEABLE | MERGE as is | `subscribeFrame` SheetHandle and `tests/perf/browser/cmp/idle.spec.ts` (remote). |
| 39 | #330 | next | REQ-FIN-70 · CMP-17 | MERGEABLE | TRIM to remaining scope | Drop `canaries/next16/tests/rsc.spec.ts` and `lint/rules/plat/use-client-needless.cjs` (FIN-C paths) and the `canaries/next16/app/cmp/**` page that duplicates #301 (keep #301's). Keep server ImageList, the masonry island and `tests/ssr/cmp/ssr.test.tsx`. |
| 40 | #335 | next | REQ-FIN-70 · CMP-22 | MERGEABLE | MERGE as is | `budgetKb` = size row on every meta; `tests/foundation/meta-complete.test.ts`. |
| 41 | #200 | next | REQ-FIN-71 · CMP-31 | CONFLICTING | TRIM to remaining scope | Conflicts on `package.json` and `src/forms/FormField.tsx`; `src/forms/*` and the `./forms` export are already on next via #369. Reduce to `tests/controls/forms.test.tsx` (7 controls) and `src/components/field/Form.test.tsx` (Field.Error id in `aria-describedby`, not a live region). FIN-A #336 must drop its own copy of `tests/controls/forms.test.tsx`, because `tests/controls/**` is FIN-E's. Finishes CMP-31 (E.2). |
| 42 | #281 | next | REQ-FIN-71 · CMP-30 | MERGEABLE | TRANSFER (merge in owner WP slot) | Every product file is `src/ai/icons/**` (SURF, FIN-F REQ-FIN-85). FIN-F merges it in its own slot; FIN-E evaluates CMP-30 (≤1,024 B gz glyph budget in CI) after the merge. |
| 43 | #201 | next | REQ-FIN-72 · CMP-32 | MERGEABLE | MERGE as is | No conflict and no foreign files. APG/L6 legs run only on the remote lanes. |
| 44 | #202 | next | REQ-FIN-72 · CMP-33 | MERGEABLE | MERGE as is | No conflict and no foreign files. APG/L6 legs run only on the remote lanes. |
| 45 | #204 | next | REQ-FIN-72 · CMP-35 | MERGEABLE | MERGE as is | No conflict and no foreign files. APG/L6 legs run only on the remote lanes. |
| 46 | #205 | next | REQ-FIN-72 · CMP-36 | MERGEABLE | MERGE as is | L6 IconButton ≥3:1 in 8 scenes runs on the remote contrast lane. |
| 47 | #206 | next | REQ-FIN-72 · CMP-37 | MERGEABLE | MERGE as is | No conflict and no foreign files. APG/L6 legs run only on the remote lanes. |
| 48 | #207 | next | REQ-FIN-72 · CMP-38 | MERGEABLE | MERGE as is | No conflict and no foreign files. APG/L6 legs run only on the remote lanes. |
| 49 | #208 | next | REQ-FIN-72 · CMP-39 | MERGEABLE | MERGE as is | No conflict and no foreign files. APG/L6 legs run only on the remote lanes. |
| 50 | #209 | next | REQ-FIN-72 · CMP-40 | MERGEABLE | MERGE as is | No conflict and no foreign files. APG/L6 legs run only on the remote lanes. |
| 51 | #212 | next | REQ-FIN-72 · CMP-43 | MERGEABLE | MERGE as is | No conflict and no foreign files. APG/L6 legs run only on the remote lanes. |
| 52 | #210 | next | REQ-FIN-72 · CMP-41 | MERGEABLE | MERGE as is | First of the SegmentedControl chain #210 → #211 → #213. They share `SegmentedControl.client.tsx`/`.css`; rebase each on the previous one. `name` is now required (API break); the compat fallback is in place. |
| 53 | #211 | next | REQ-FIN-72 · CMP-42 | MERGEABLE | MERGE as is | After #210. `startMorph` comes from MAT REQ-FIN-58. Re-check `SegmentedControl.css` against next. |
| 54 | #213 | next | REQ-FIN-72 · CMP-44 | MERGEABLE | MERGE as is | After #211. |
| 55 | #220 | next | REQ-FIN-73 · CMP-52 | MERGEABLE | MERGE as is | Checkbox chain #220 → #222 → #223. |
| 56 | #222 | next | REQ-FIN-73 · CMP-53 | MERGEABLE | MERGE as is | After #220. |
| 57 | #223 | next | REQ-FIN-73 · CMP-54 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Checkbox.css` (next MAT-003 namespace changes). Rebase after P4 and #222. |
| 58 | #238 | next | REQ-FIN-73 · CMP-69 | MERGEABLE | MERGE as is | Combobox chain #238 → #239 → #240 → #241 → #242 → #243. |
| 59 | #239 | next | REQ-FIN-73 · CMP-70 | MERGEABLE | AMEND then merge | **Gap** (from the PR body): Base UI keeps its internal `activeIndex` after Alt+ArrowDown, so Enter can select a stale item. Add a strict Enter-after-Alt+ArrowDown case and fix it (CMP-70 acceptance: strict jest + `combobox.apg.spec.ts` remote). |
| 60 | #240 | next | REQ-FIN-73 · CMP-71 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 61 | #241 | next | REQ-FIN-73 · CMP-73 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 62 | #242 | next | REQ-FIN-73 · CMP-72 | MERGEABLE | MERGE as is | Owned windowed list on `subscribeFrame`, no tanstack. Merge **only after the OD-15 owner decision** accepts option (a). If OD-15 picks the allowlist amendment instead, close it and implement C-11. Survivor over #337's virtualizer rewrite. |
| 63 | #243 | next | REQ-FIN-73 · CMP-74 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Combobox.css`. Rebase after P4 and #242. |
| 64 | #337 | next | REQ-FIN-70 · CMP-24 | CONFLICTING | TRIM to remaining scope | Conflicts on `src/components/command-palette/Command.tsx`. Drop the SURF files (Command.tsx, CommandPalette.tsx, TabBar.tsx → FIN-F), `canaries/vite-compiler/**` (→ FIN-C) and the `ComboboxVirtualList.client.tsx` rewrite (#242 is the survivor). Rebase on #242. `tests/compiler/react-compiler.fixture.test.ts` must still report 0 bail-outs. |
| 65 | #227 | next | REQ-FIN-73 · CMP-59 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `src/components/field/Fieldset.client.tsx`, which is already flat on next via #369. Take next's version and keep the stories, `GlassFieldGroup` compat (description as a Field description part), `Field.test.tsx` and codemod-fixture hunks. Finishes the next-side of CMP-59 (E.2). |
| 66 | #244 | next | REQ-FIN-73 · CMP-75 | MERGEABLE | MERGE as is | NumberField chain #244 → #245 → #246. |
| 67 | #245 | next | REQ-FIN-73 · CMP-76 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 68 | #246 | next | REQ-FIN-73 · CMP-77 | MERGEABLE | MERGE as is | Exact-value APG runs remote only. |
| 69 | #224 | next | REQ-FIN-73 · CMP-55 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 70 | #225 | next | REQ-FIN-73 · CMP-56 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 71 | #234 | next | REQ-FIN-73 · CMP-65 | MERGEABLE | MERGE as is | Select chain #234 → #235 → #236 → #237. |
| 72 | #235 | next | REQ-FIN-73 · CMP-66 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 73 | #236 | next | REQ-FIN-73 · CMP-67 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Combobox.css` and `Select.css`. Rebase after P4 and #235. |
| 74 | #237 | next | REQ-FIN-73 · CMP-68 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Select.css`. Rebase after #236. |
| 75 | #232 | next | REQ-FIN-73 · CMP-63 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 76 | #233 | next | REQ-FIN-73 · CMP-64 | MERGEABLE | MERGE as is | After #232. |
| 77 | #217 | next | REQ-FIN-73 · CMP-48 | MERGEABLE | MERGE as is | Slider chain #217 → #218 → #219 → #221 (`Slider.client.tsx`/`.css`). |
| 78 | #218 | next | REQ-FIN-73 · CMP-49 | MERGEABLE | MERGE as is | After #217. |
| 79 | #219 | next | REQ-FIN-73 · CMP-50 | MERGEABLE | MERGE as is | After #218. |
| 80 | #221 | next | REQ-FIN-73 · CMP-51 | MERGEABLE | MERGE as is | After #219. |
| 81 | #215 | next | REQ-FIN-73 · CMP-46 | MERGEABLE | MERGE as is | After #214 (FIN-A slot). |
| 82 | #216 | next | REQ-FIN-73 · CMP-47 | MERGEABLE | MERGE as is | CI-gated: APG `SWITCH_KEYS` in CI. |
| 83 | #229 | next | REQ-FIN-73 · CMP-60 | MERGEABLE | MERGE as is | TextField chain #229 → #230 → #231. |
| 84 | #230 | next | REQ-FIN-73 · CMP-61 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `TextField.css`. Rebase after P4. Use the shared focus mixin from CMP-08 in `control-shared/controls.css`, not a local ring. Danger ≥4.5:1 evidence comes from the remote contrast lane. |
| 85 | #231 | next | REQ-FIN-73 · CMP-62 | MERGEABLE | MERGE as is | After #230. |
| 86 | #226 | next | REQ-FIN-73 · CMP-57 | MERGEABLE | TRANSFER (merge in owner WP slot) | All 3 files are in `src/date/**` (SURF; CMP-57 is the REQ-FIN-84 seam). FIN-F merges it; FIN-E records CMP-57 after `rg 'components/field' src/date` shows imports. |
| 87 | #252 | next | REQ-FIN-74 · CMP-83 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 88 | #253 | next | REQ-FIN-74 · CMP-84 | MERGEABLE | AMEND then merge | **Gap:** `tests/e2e/cmp/overlays/overlay-a11y-modes.spec.ts` still has 1 `if (await …)` conditional; make it unconditional (CMP-84; REQ-FIN-74 no-conditional rule). |
| 89 | #255 | next | REQ-FIN-74 · CMP-86 | MERGEABLE | MERGE as is | `modal='trap-focus'` stays on the OD-16 fallback (Base UI semantics) until OD-16 decides; xl/full go to compat. |
| 90 | #258 | next | REQ-FIN-74 · CMP-90 | MERGEABLE | MERGE as is | Dialog perf ≤100 ms at 4× CPU runs remote only; the CommandPalette row reports `pending`. |
| 91 | #259 | next | REQ-FIN-74 · CMP-91 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 92 | #270 | next | REQ-FIN-74 · CMP-102 | MERGEABLE | MERGE as is | Menu chain #270 → #271 → #272 → #273. |
| 93 | #271 | next | REQ-FIN-74 · CMP-103 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 94 | #272 | next | REQ-FIN-74 · CMP-104 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Menu.css`. Rebase after P4 and #271. |
| 95 | #273 | next | REQ-FIN-74 · CMP-105 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 96 | #266 | next | REQ-FIN-74 · CMP-98 | MERGEABLE | MERGE as is | After #265. |
| 97 | #260 | next | REQ-FIN-74 · CMP-92 | MERGEABLE | MERGE as is | Sheet chain #260 → #261 → #262 → #263 → #264. SheetSide `left\|right` kept, pending owner confirmation (owner item E-O3). |
| 98 | #261 | next | REQ-FIN-74 · CMP-93 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 99 | #262 | next | REQ-FIN-74 · CMP-94 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Sheet.client.tsx` and `Sheet.css`. Rebase after #261 and P4/P6 (#317 also edits `Sheet.client.tsx`). |
| 100 | #263 | next | REQ-FIN-74 · CMP-95 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 101 | #264 | next | REQ-FIN-74 · CMP-96 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Sheet.css`. Rebase after #263. |
| 102 | #274 | next | REQ-FIN-74 · CMP-106 | MERGEABLE | MERGE as is | Toast chain #274 → #275 → #276 → #277 → #278 (`Toast.client.tsx`). |
| 103 | #275 | next | REQ-FIN-74 · CMP-107 | MERGEABLE | AMEND then merge | Drop the hand-edited `src/internal/deprecations.generated.ts` hunk and regenerate it. **Gap:** replace `toBeLessThanOrEqual(Math.max(1, liveCounts.toasts))` at `tests/a11y/apg/cmp/toast.apg.spec.ts:33` with an exact assertion (CMP-107). Migrate every `useToast` consumer (registry overlay-flows, compat, stories, subjects, DEP-C0115/C0130 messages). |
| 104 | #276 | next | REQ-FIN-74 · CMP-108 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 105 | #277 | next | REQ-FIN-74 · CMP-109 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Toast.css`. Rebase after #276. **Gap (CMP-109 ledger):** rewrite `tests/e2e/cmp/overlays/toast.touch.spec.ts:23` (`after <= before`) to assert count == before−1 after a 40% swipe, and add the `Toast.test.tsx` case that 3 toasts produce exactly 1 element with backdrop-filter (SurfaceGroup host). |
| 106 | #278 | next | REQ-FIN-74 · CMP-110 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 107 | #267 | next | REQ-FIN-74 · CMP-99 | MERGEABLE | MERGE as is | Tooltip chain #267 → #268 → #269. |
| 108 | #268 | next | REQ-FIN-74 · CMP-100 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 109 | #269 | next | REQ-FIN-74 · CMP-101 | MERGEABLE | MERGE as is | Touch spec runs remote (`cmp:cert-touch`). |
| 110 | #284 | next | REQ-FIN-75 · CMP-113 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 111 | #286 | next | REQ-FIN-75 · CMP-115 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 112 | #287 | next | REQ-FIN-75 · CMP-116 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Alert.css`. Rebase after P4. |
| 113 | #289 | next | REQ-FIN-75 · CMP-118 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 114 | #290 | next | REQ-FIN-75 · CMP-119 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 115 | #291 | next | REQ-FIN-75 · CMP-120 | MERGEABLE | MERGE as is | Deletes the duplicate `tests/a11y/apg/collapsible.apg.spec.ts`, which is a MAT-owned path (contract D06). Get FIN-D's ack in review; PRD CMP-120 requires the deletion. |
| 116 | #292 | next | REQ-FIN-75 · CMP-121 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 117 | #293 | next | REQ-FIN-75 · CMP-122 | MERGEABLE | AMEND then merge | **Gap (CMP-122 ledger):** remove the `if (scrollable)` guard at `tests/a11y/apg/cmp/scroll-area.apg.spec.ts:16` and assert `scrollable === true`. |
| 118 | #294 | next | REQ-FIN-75 · CMP-123 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Rating.css`. Rebase after P4. |
| 119 | #295 | next | REQ-FIN-75 · CMP-124 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 120 | #296 | next | REQ-FIN-75 · CMP-125 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 121 | #297 | next | REQ-FIN-75 · CMP-126 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 122 | #299 | next | REQ-FIN-75 · CMP-128 | CONFLICTING | REBASE+RESOLVE then merge | Conflicts on `Tour.css`. Rebase after P4 and #279 (FocusScope in Tour). **Gap (CMP-128):** remove the `if (await next.count())` block at `tests/a11y/apg/cmp/tour.apg.spec.ts:27`; the spec must pass at 390 px. |
| 123 | #300 | next | REQ-FIN-75 · CMP-129 | MERGEABLE | MERGE as is | No conflict and no foreign files. |
| 124 | #303 | next | REQ-FIN-76 · CMP-133 | MERGEABLE | TRIM to remaining scope | Drop the `docs/release/decisions/removals/RM-11.json` hunk (→ FIN-H). Move `tests/release/cmp-codemod-props.test.ts` (FIN-C path) to `tests/foundation/codemod-props.test.ts`. Survivor for the CMP-133 mapping rows over #312. |
| 125 | #304 | next | REQ-FIN-76 · CMP-134 | MERGEABLE | TRIM to remaining scope | Drop the `packages/cli/test/fixtures.test.ts` hunk: `cmp` discovery belongs to FIN-A REQ-FIN-09 (#115), so merge after #115. CMP-134 is done only when the 122 `pending.txt` markers are gone: each is removed as #303/#312 transforms land, and AC-FIN-09 requires 0 mismatches. |
| 126 | #309 | next | REQ-FIN-76 · CMP-140 | CONFLICTING | TRIM to remaining scope | Conflicts on `jest.config.js` (contract PR only). Drop it; the registry test roots go into the `jest.config.js` contract PR / REQ-FIN-09. Keep the confirm-dialog/account-menu fixtures, stories, tests and `AlertDialog.Action` `intent`. |
| 127 | #312 | next | REQ-FIN-76 · CMP-133, CMP-135 | CONFLICTING | SPLIT | Conflicts on `jest.config.js` (drop it). Hand off `packages/cli/src/migrate/4to5/transforms/{canonical-names,prop-grammar,providers}.ts` and `tests/dx/consumer-4x-cmp.test.ts` to FIN-C (owner of `packages/cli`, `tests/dx`). Keep `tests/fixtures/consumer-4x/cases/cmp/**`, `scripts/cmp/consumer-4x-l11.mjs`, the compat files and the `cmp:test:consumer-4x`/`cmp:remote:consumer-4x` jobs. Rebase on #303 (drop duplicate CMP-133 rows) and #311 (`ci/cmp.gitlab-ci.yml`). |
| 128 | #310 | next | REQ-FIN-76 · CMP-142 | CONFLICTING | TRIM to remaining scope | Last FIN-E merge, so the API reports match final source. Conflicts on `package.json` and `src/forms/index.ts`, both already on next; drop them. Drop `scripts/build/api-report.mjs` (FIN-C; duplicates #174). Keep the `.changeset/cmp-t-core.md` package-name fix and regenerate `etc/api/{primitives,icons,forms,root.cmp,compat.cmp}.*` with the tool. Survivor for those reports over FIN-A #336, which must drop its `etc/api` hunks. |
| — | #228 | 4.x | REQ-FIN-73 · CMP-59 | MERGEABLE | CLOSE | Superseded by #313, which carries the identical DEP-C0028 row (GlassFieldGroup → Fieldset, `since 4.3.0`, `removeIn 6.0.0`) in the same 4.x file. |

**Counts:** 129 PRs listed.
- 71 MERGE as is
- 18 REBASE+RESOLVE
- 27 TRIM
- 6 AMEND
- 3 SPLIT
- 3 TRANSFER: #214 → FIN-A REQ-FIN-11; #226 and #281 → FIN-F
- 1 CLOSE: #228, survivor #313

**Cross-WP notes for the FIN-A section** (FIN-E depends on them but does not edit them):
- #336 drops `src/forms/*`, `tests/controls/forms.test.tsx` and `etc/api/**`; the survivors are next (#369), #200 and #310.
- #122 receives the `useOverlayLayer.ts` hunks from #248 and #256.
- REQ-FIN-02 (#117/#247) receives the `overlaySurface.ts`/`overlayTypes.ts` hunks from #251, #254 and #265, and the `material.css` hunks from #248 and #257.

### FIN-E.2 Finish partially-merged work

Only #369 (merged into `next`, 2026-10-10) landed FIN-E code. The follow-ups below are already assigned in E.1 and are listed here so nothing is done twice.

| Merged piece on `next` | What is still missing | Done by |
|---|---|---|
| CMP-31: `src/forms/{index.ts,FormField.tsx,useFormField.ts}` and the `./forms` export | `tests/controls/forms.test.tsx` covering all 7 controls (TextField, NumberField, SearchField via native input; Switch, Checkbox, Select, Combobox via hidden input), submit values and RHF errors shown. `Form.test.tsx`: Field.Error id in the control's `aria-describedby`, not a live region. `rg -l react-hook-form src \| grep -v '^src/forms/'` must be empty. | #200 (TRIM), E.1 row. Ledger acceptance: "tests/controls/forms.test.tsx passes for all 7 controls; rg -l react-hook-form src \| grep -v '^src/forms/' is empty; package exports include './forms'". |
| CMP-59: `Fieldset = Object.assign(FieldsetRoot, { Root })` in `src/components/field/Fieldset.client.tsx` | Stories (`Fieldset.stories.tsx`, `ControlsDenseForm.stories.tsx`), `src/compat/cmp/controls/GlassFieldGroup.tsx` (description as a Field description part), `Field.test.tsx`, the codemod fixture `fnd-glass-field-group/output.tsx`, and DEP-C0028 on `release/4.x` | #227 (REBASE, take next's Fieldset) plus #313 (DEP-C0028). #228 closed. Ledger acceptance: "`render(<Fieldset legend='L'><input/></Fieldset>)` gives a fieldset with legend[data-ag-part=legend]; the GlassFieldGroup→Fieldset codemod output renders; the 4x fragment contains DEP-C0028". |
| Provider self-adoption fix in `src/theme/AuraGlassProvider.tsx` (FIN-A 04 file) | Nothing for FIN-E. The duplicate hunks must leave #317 and #320 (E.1). | #317, #320 TRIM/SPLIT |

The SURF PRs #352–#368 also merged into `next`. They changed only SURF dirs and compose CMP through public parts, so FIN-E has no follow-up for them. The conflicts they created in #308, #317, #320, #322 and #337 are handled in E.1.

### FIN-E.3 Build work that has no PR

**E3.1: `tests/types/cmp-contract.test-d.ts`, the AC-FIN-74 gate**
- REQs: REQ-FIN-74 (overlays) and REQ-FIN-70 (CMP-06 parts). Branch `next-fin/e-cmp-contract-types`.
- Files (all FIN-E):
  - create `tests/types/cmp-contract.test-d.ts`;
  - edit `tests/types/cmp/tsconfig.json` to add `"../cmp-contract.test-d.ts"` to `include`, because the current glob `./**/*.test-d.ts` misses it;
  - edit `ci/cmp.gitlab-ci.yml` only if the `npx tsc -p tests/types/cmp/tsconfig.json --noEmit` step in `cmp:test:foundation-pattern` is gone after #311/#312.
- Steps:
  1. For every key `K` of `COMPOUND_PARTS` (from `src/contracts/components.ts`, read-only), assert with `expectTypeOf` or a `satisfies` helper that `keyof typeof <Component>` equals the contract part list plus `Root`. Generate one assertion per key; never hand-pick a subset.
  2. `useToast satisfies UseToast`: `toast`, `update`, `dismiss`, `promise`, `toasts`, `history`. Reuse, don't duplicate, `tests/types/cmp/usetoast-contract.test-d.ts` from #275 (import or merge it).
  3. Add `// @ts-expect-error` negatives: one removed part per family (e.g. `Dialog.Portal` after #320) and a `useToast()` result missing `promise`.
  4. Until OD-16 approves CC-CMP-01, the Header/Body/Footer, Tooltip.Provider, Toast.Progress/History/HistoryItem and Combobox.Group/GroupLabel keys use the OD-16 fallback list, marked `// OD-16 fallback`. The file asserts whatever `COMPOUND_PARTS` says after the contract PR.
- Tests: the file itself, run by `npx tsc -p tests/types/cmp/tsconfig.json --noEmit` in `cmp:test:foundation-pattern`. Locally only that narrow `tsc`.
- Merge slot: after #320 (P7.10) and #275 (Toast chain).
- Acceptance: AC-FIN-74, "`cmp-contract.test-d.ts` green" (§17), plus PRD §5.5 REQ-FIN-74 "asserts every `COMPOUND_PARTS` key and `useToast satisfies UseToast`", observed in a green `cmp:test:foundation-pattern` job on `next` with `allow_failure: false`.

**E3.2: REQ-CMP-27, stacked Escape on 3 engines (REQ-FIN-71)**
- Branch `next-fin/e-stacked-escape` (code part only).
- The ledger says CI only, but the stricter PRD §5.5 text wins: "stacked-escape APG spec (Dialog → Popover → Menu, Escape closes one layer per press) green on 3 engines". On next, `tests/a11y/apg/cmp/stacked-escape.apg.spec.ts` covers only the two-layer `foundation-dismissable-layer--stacked` story.
- Files:
  - create `stories/cmp/overlays/StackedEscape.stories.tsx`, with meta `id: 'overlays-stacked-escape'` and a Dialog containing a Popover trigger whose popup contains a Menu;
  - extend `tests/a11y/apg/cmp/stacked-escape.apg.spec.ts` with a second test: open Dialog, then Popover, then Menu; press Escape 3 times; after each press exactly the top layer is gone, the others stay visible, and focus is on that layer's trigger. No conditionals.
- Lane: `tests/a11y/apg/cmp/**` must be in the `cmp:apg-{chromium,webkit,firefox}` projects that #307's AMEND adds. Until REQ-FIN-07 (#325 → #249 → #326) is on next, the lane runner reports the spec `pending`; the pending state is removed in this PR once it is.
- Also must hold (ledger acceptance): `rg "addEventListener\(.keydown" src/primitives/DismissableLayer.tsx` = 0 (currently 0).
- Acceptance: AC-FIN-71, with the ledger text "CI job log shows stacked-escape.apg.spec.ts passing in 3 browsers on a next commit". Record the 3 job URLs in Appendix A row REQ-CMP-27.

**E3.3: Remove the conditional assertion no open PR covers (REQ-FIN-74 rule; prohibited-shortcut rule)**
- Branch `next-fin/e-apg-strict`.
- Edit `tests/a11y/apg/cmp/chip.apg.spec.ts:24`: replace `if (await remove.count()) { … }` with an unconditional `await expect(remove).toHaveCount(1)` followed by the removal assertions. If the story has no remove button, fix the story in `stories/cmp/**`; never weaken the test.
- The other conditionals on next are fixed in their REQ PRs (E.1): `menu.apg` (#271), `tooltip.touch` (#269), `overlay-a11y-modes` (#253), `toast.apg` (#275), `toast.touch` (#277), `tour.apg` (#299), `scroll-area.apg` (#293) and `grid-masonry` (#283). `overlay-stack` is fixed by FIN-A #249/#326.
- Hand-off (not FIN-E files): ask FIN-D (owner of `tests/a11y/**`, contract D06) to delete the stale duplicates `tests/a11y/apg/{color-picker,inline-edit,scroll-area,tour}.apg.spec.ts`, which are superseded by the `tests/a11y/apg/cmp/` copies, as #291 did for collapsible. Ask FIN-G (stage owner) to delete the stale `tests/e2e/layout/grid-masonry.spec.ts`.
- Acceptance: `rg -n "if \(await|<= before|toBeLessThanOrEqual\(before|Math\.max\(1" tests/a11y/apg/cmp tests/e2e/cmp tests/perf/browser/cmp tests/visual/cmp` returns 0 on next after E.1 and E3.3 merge. That is part of AC-FIN-74 and of the AC-FIN-GLOBAL "0 pending early returns" clause.

### FIN-E.4 Validation (GitLab CI only, every job `allow_failure: false` before a row counts)

**Where things run:**
- **Local (this Mac):** only narrow Jest on touched suites, `npx tsc -p tests/types/cmp/tsconfig.json --noEmit` and `eslint` on changed files.
- **Remote-only (GitLab `AG_PLAYWRIGHT_IMAGE` jobs or the gated remote runner, skill `auraone-remote-run`; never locally, never local Docker):** every Playwright, APG, visual (L6–L8), motion (L9), perf (L10), canary (L11), Storybook-build, `npm pack` and consumer-4x leg. A lane invoked locally exits 2 and prints its remote command.
- **Activation:** each job's first green run on `next` (or `release/4.x`) gets an activation row in `ci/plat/activation.json`, written by FIN-B. The same PR flips that job's `allow_failure: true` (added by #311/#312) to `false`. Record the job URL in the REQ's Appendix A row and in the ledger.

| AC | Must be green on `next` (CMP jobs from `ci/cmp.gitlab-ci.yml` after #315/#311/#312; lanes from `fragments/lanes/cmp.ts` after #307/#301) | Remote-only legs |
|---|---|---|
| AC-FIN-70 | `cmp:test:foundation-pattern`: `eslint src/components src/primitives src/foundation --max-warnings 0`, `verify-foundation-pattern.mjs`, Jest `tests/foundation` (ref/parts over every meta ≥74, dom-contract, hooks ≥60, side-effects, meta-complete, prop-grammar), `tests/compiler/react-compiler.fixture.test.ts` (0 bail-outs), `tsc` type tests. `cmp:build:dts` (Base UI pin, `no-foundation-types` on the packed tarball). `cmp:test:selectors` (0 unmatched; needs `qual:build:storybook` artifacts). `rg -c forwardRef src/components src/primitives src/icons -g '!*.test.*'` = 0 outside SURF dirs. CMP rows of `scripts/integration/baselines/{css-files,undefined-component-vars,…}.json` = 0. `fragments/literals-baseline/cmp.json` all `{}`. | `disabled-no-opacity.spec.ts`, `tests/e2e/cmp/motion.spec.ts` (ANIMATABLE), `tests/e2e/cmp/sizing.spec.ts` (44 px coarse), `tests/visual/cmp/reflow.spec.ts` (390, 320 container, 200 %, text spacing), `tests/perf/browser/cmp/idle.spec.ts` (L10), `canaries/next16/app/cmp/server` (L11), describedby/SSR legs |
| AC-FIN-71 | Jest `tests/primitives/primitives.test.tsx` and `tests/controls/forms.test.tsx`; PLAT size job grading the AI-glyph row ≤1,024 B gz | `stacked-escape.apg.spec.ts` on `cmp:apg-chromium`, `cmp:apg-webkit`, `cmp:apg-firefox` |
| AC-FIN-72 | Jest `tests/controls/**` and component suites for Button/IconButton/Toolbar/ToggleGroup/ButtonGroup/SegmentedControl | APG `toggle-group`, `toolbar`, `segmented-control`, `button` (exact indexes/counts); L6 IconButton ≥3:1 in 8 scenes; Toolbar computed-style spec; nesting radius ±0.5 px; >5-items-at-390 warning |
| AC-FIN-73 | Jest Switch/Slider/Checkbox/Radio/Fieldset/TextField (IME)/SearchField/Select/Combobox (10,000 items ≤60 nodes, 500 ms throttle, autocomplete)/NumberField (locale parse) | APG per control incl. `SWITCH_KEYS`, slider vertical/RTL, checkbox mixed cycle, number-field hold-repeat; slider perf case (L10); danger ≥4.5:1 in 8 scenes (QUAL contrast lane); Combobox scroll-follow (controls-perf lane) |
| AC-FIN-74 | Jest `tests/overlays/**` (scrim, toast-timers, nested-content, overlay-contract), Toast/Menu/Popover/Tooltip/Sheet/Dialog suites; **`tests/types/cmp-contract.test-d.ts`** in `cmp:test:foundation-pattern` | APG dialog/alert-dialog/menu/popover/tooltip/toast; `tests/e2e/cmp/overlays/*` incl. 390 px geometry for 5 kinds and the exact blurred-surface budgets; Dialog open ≤100 ms at 4× CPU and long-task windows (L10); `cmp:cert-touch` (tooltip, toast swipe, ContextMenu long-press) |
| AC-FIN-75 | Jest content suites (Text/Heading/Grid/Card/Badge/Avatar/Alert/Progress/Skeleton/Kbd/DescriptionList/Accordion/ScrollArea/Rating/InlineEdit/ColorPicker/FileUpload/ImageList/Tour/StateView) and the compat tests for the absorbed names | APG collapsible/accordion/scroll-area/rating/inline-edit/color-picker/tour (390 px); `grid-masonry.spec.ts`; card content-layer spec; next16 `cmp/server` hydration (L11); T2 page ≤1 blurred surface (L10) |
| AC-FIN-76 | Jest `tests/overlays/compat-overlays.test.tsx`, `tests/foundation/compat-core.test.tsx`, registry item tests; `packages/cli/test/fixtures.test.ts` with `cmp` cases and 0 `pending.txt` (FIN-A REQ-FIN-09 job); `cmp:test:consumer-4x`; `contract:ci-fragments` (`verify-ci-fragments`) clean for every `cmp:*` job; PLAT `verify-size-budgets` and perf grading of the CMP rows; `api-report --check` for `etc/api/{primitives,icons,forms,root.cmp,compat.cmp}.*`; `verify-deprecations` and fragment-identity (AC-FIN-13) on **both** `next` and `release/4.x` after the sync | `cmp:remote:consumer-4x` (needs OD-11 runner), `tests/visual/cmp/**` (L6–L8), L14 review items registered (scoring is FIN-H) |

**Pipeline triggers FIN-E depends on (not FIN-E's files):**
- OD-8: GitLab pipelines exist for `next` and `release/4.x`.
- REQ-FIN-20/-22 (FIN-B): `workflow:rules` accept `next-fin/`, `4x-fin/` and `4x11-fin/`.
- REQ-FIN-30 (FIN-C): `contract:ownership` maps `next-fin/e-*` to the FIN-E path set.

Until these land, FIN-E rows can reach at most `code-merged-awaiting-ci`, never `done`.

### FIN-E.5 Exit criteria

- [ ] AC-FIN-70: REQ-CMP-01, -02, -03, -04, -05, -06, -07, -08, -10, -13, -14, -15, -16, -17, -18, -20, -21, -22, -24 (19)
- [ ] AC-FIN-71: REQ-CMP-27, -28, -30, -31 (4)
- [ ] AC-FIN-72: REQ-CMP-32, -33, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44 (12)
- [ ] AC-FIN-73: REQ-CMP-45 … -57, -59 … -77 (32; -72 needs OD-15)
- [ ] AC-FIN-74: REQ-CMP-79, -81 … -86, -88 … -110 (30; -86 and the CC-CMP-01 parts need OD-16, -92 needs the SheetSide call), plus `tests/types/cmp-contract.test-d.ts` green
- [ ] AC-FIN-75: REQ-CMP-111 … -130 (20)
- [ ] AC-FIN-76: REQ-CMP-131 … -142 (12; -132 also on `release/4.x`, shipped in the 4.3.0 minor through FIN-C's release train)
- [ ] Each of the 129 rows has its ledger `acceptance` (or the stricter §5.5 bullet) passing in a green `allow_failure: false` job on its line, with the URL in its Appendix A row.
- [ ] 0 open FIN-E PRs: every row of E.1 is merged, closed with its survivor named, or transferred and merged by its owner WP.
- [ ] `tests/foundation/contract-coverage.json` deleted.
- [ ] `fragments/deprecations/cmp.ts` byte-identical on `next` and `release/4.x`, with no next-only DEP-C ids and no id collisions.
- [ ] 0 CMP rows in `scripts/integration/baselines/*.json`.
- [ ] 0 conditional assertions in `tests/{a11y/apg/cmp,e2e/cmp,perf/browser/cmp,visual/cmp}`.
- [ ] Report: the Common JSON format, plus `"forwardRefRemaining": <rg count in CMP files>`, `"apgSpecsPerFlagship": {...}`, `"depIdCollisionsResolved": ["DEP-C0221", …]` and `"handOffs": [{"pr": n, "hunk": "path", "toWp": "FIN-X", "landedIn": "#n|null"}]`.

### FIN-E.6 Owner/human items in this package (the agent never performs, fakes or back-fills them)

| Id | (a) Agent prep (FIN-E does this) | (b) Owner/human action, exact steps | Blocks |
|---|---|---|---|
| E-O1 OD-8 pipelines | Nothing in FIN-E files. Keep every PR open and rebased; list in the report each PR whose acceptance waits on CI. | Gurbaksh: (1) create a read-only GitHub PAT for `auraoneai/auraglass`; (2) on GitLab project 87152036, set up a pull mirror of `github.com/auraoneai/auraglass` with "Trigger pipelines for mirror updates" on; (3) disable the org `mirror-to-gitlab` `--prune`/main-only push for this repo so `next`, `release/4.x`, `release/4.1.x` and stream/FIN branches reach GitLab. Then confirm `node scripts/ci/gitlab-status.mjs --sha $(git rev-parse origin/next)` prints a pipeline URL. | Every AC-FIN-70..76 job URL; CMP-27; all remote legs |
| E-O2 OD-11 remote runner | Make sure `cmp:remote:consumer-4x` (#312) and the `AG_REMOTE_RUNNER=1` lanes use `.ag-aws-remote` / `.ag-playwright` and need no new credentials. | Owner registers or approves the gated AWS remote runner for project 87152036, through the existing operator chain and with no new IAM grants beyond the documented gated pattern. | CMP-135 remote leg, remote perf/visual lanes |
| E-O3 OD-15 Combobox virtualisation (CMP-72) | Put #242's evidence in the decision draft: the owned windowed list on `subscribeFrame`, no tanstack, 19 rows mounted at 500 items and ≤60 at 10,000, `aria-setsize`/`posinset`. Draft `docs/release/decisions/od-15-virtualizer.md` text in a PR comment and hand it to FIN-H, which owns the path. | Gurbaksh picks (a) accept the owned list (then #242 merges and #337 drops its rewrite) or (b) amend the `scripts/ci/verify-deps.mjs` allowlist for `@tanstack/react-virtual` (C-11; then #242 closes and FIN-C edits the allowlist). The record is signed by the owner. | REQ-CMP-72, AC-FIN-73 |
| E-O4 OD-16 contract bundle items | Keep the fallbacks in code: #255 `modal` uses Base UI trap-focus semantics; #320 parts on the fallback list; Toast.Progress/History/HistoryItem per #278 behind the fallback. List the exact `COMPOUND_PARTS` diff for Appendix C C-1..C-17 in the `contract/v1.2-final` PR description (FIN-A FIN-463 owns that PR). | Gurbaksh approves or rejects the CC-CMP-01 compound parts (Header/Body/Footer, Tooltip.Provider, Toast.Progress/History/HistoryItem, Combobox.Group/GroupLabel) and `modal='trap-focus'`, by merging or declining `contract/v1.2-final`. | REQ-CMP-06, -86, -106..110 parts, AC-FIN-74 type test final shape |
| E-O5 CMP-92 SheetSide `left \| right` | #260 keeps them and records why (shipped API, orthogonal to `start \| end`). Draft the decision text for FIN-H. | Owner confirms "keep" (no change) or "remove" (a new breaking-change REQ with a DEP-C row in a 4.x minor). | REQ-CMP-92 |
| E-O6 4.x minor carrying the CMP fragment | #313 merged on `release/4.x` via `4x-cmp/e-deprecations`, and the REQ-FIN-13 sync merged on next. | FIN-C runs the release train (REQ-FIN-45). The owner approves the 4.3.0 publish via `plat:publish:npm` with provenance; never a local `npm publish`. | REQ-CMP-132 "shipped in a 4.x minor", DEP-C0028 (CMP-59) |
| E-O7 RM-11 removal ledger | The GlassLabel/Typography/DisplayText/Grid/Badge/Progress/ImageList hunks are dropped from #279, #282, #283, #285, #288, #298 and #303. Send FIN-H the exact name list to remove from RM-11 removals. | A FIN-H owner/consumer-grep record updates `docs/release/decisions/removals/RM-11.json`. | REQ-CMP-28 (GlassLabel), CMP-111..127 compat names |

Not FIN-E's to do: the L14 review scores for CMP flagships (REQ-FIN-111) and the SR/touch passes (REQ-FIN-110) are FIN-H human work. FIN-E only keeps the stories, ids and `fragments/review/cmp.ts` items (#308) they need.


---

## 10. WP FIN-F — Product surfaces leftovers (SURF), REQ-FIN-80..90

Source: PRD-F §5.6 (REQ-FIN-80..90), §6 ownership row FIN-F, §6.1 transfers, §17 AC-FIN-80..90, §20; per-REQ remaining work and acceptance from `docs/auraglass-5/implementation-audit/fin-open-ledger.json` (stricter §5.6 text wins). State as of 2026-10-10: `next` e5a2d6835, `release/4.x` 645735fce, `release/4.1.x` a19f4bbe1. FIN-F has no `release/4.1.x` work. Its only `release/4.x` work is SURF-12 (DEP rows).

Where the 188 FIN-F REQs stand: 0 of the 11 REQ-FIN items are done. 42 REQs have code merged into `next` (#352–#368, merged together with 0 checks). Their CI legs and the leftover clauses are in FIN-F.2. 27 REQs exist only in the 14 open PRs #338–#351 (FIN-F.1). 119 REQs have no PR (FIN-F.3). Not FIN-F: SURF-60 (REQ-FIN-07, FIN-A), SURF-129 and SURF-196 (REQ-FIN-110, FIN-H). Already done and not in the ledger: SURF-16, 22, 132, 180, 186.

**May touch** (PRD §6): `src/{app-shell,data,date,ai,media,backdrops,charts,three}/**`, `src/root/surf.ts`, `src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition,timeline}/**`, `src/compat/surf/**`, `packages/labs/**` (contract F02), SURF `registry/{blocks,items}/**`, `scripts/surf/**`, `lint/rules/surf/**`, `fragments/*/surf.*` except `fragments/css/surf.ts`, `ci/surf.gitlab-ci.yml`, `ci/surf/**`, `docs/auraglass-5/capability-ledger.*`, `stories/surf/**`, `canaries/next16/app/surf/**`, `tests/fixtures/consumer-4x/cases/surf/**`, `etc/api/{app-shell,data,date,ai,media,backdrops,three,charts}.*`, `etc/api/{root,compat}.surf.*`, and `tests/{app-shell,data,ai,media,backdrops,charts,labs,capability,types/surf,rsc/surf,ssr/surf,e2e/surf,visual/surf,perf/browser/surf,a11y/apg/surf}/**` including `tests/e2e/surf/clear-over-media/**` but excluding `tests/capability/jest.doubles.cjs`.

SURF registry blocks: app-frame, ai-workspace, data-workspace, analytics-dashboard, media-viewer, support-inbox, mobile-settings, commerce-cart, commerce-checkout, pricing, audit-log, permissions-matrix. SURF registry items: `ai-*`, `app-shell-workspace`, `backdrop-hero`, `comment-thread`, `faceted-search`, `presence-stack`, `query-builder`, `schema-viewer`, `tree-select`, `media-*`.

**Must not touch**:
- `src/foundation/**`. The app-shell `render` handler composition uses Base UI `mergeProps` inside `src/app-shell/**` only.
- CMP components and metas: `src/components/**` outside the 7 SURF dirs.
- MAT CSS and tokens. Send needs as seam requests.
- `fragments/css/surf.ts`. Registering `presets/media.css` there is REQ-FIN-14, FIN-A.
- `fragments/lanes/plat.ts`, root `eslint.config.js`, `scripts/build/**`, PLAT-owned registry items (for example `registry/items/code-surface`, whose meta says `owner: PLAT`). These are FIN-C.
- `tests/a11y/**` outside `tests/a11y/apg/surf/**`. That is MAT (contract D06).
- `.storybook/**` (FIN-G) and `ci/{plat,qual,mat,cmp}.gitlab-ci.yml`.

When a clause needs one of these files, open a seam request to the file's owner WP (§6.1) and record it in `deviations`.

Common rules from "Common rules" apply unchanged:
- Merge only on a green GitLab pipeline: `node scripts/ci/gitlab-status.mjs --sha <head>`.
- No local browser, Playwright, pack or Storybook runs.
- No `pending` early returns, vacuous tests, lowered budgets or hand-written measurements.
- Kiro Prism is the default for REQ-FIN-88's route.

Branches:
- `next-fin/f-<topic>` → PR to `next`.
- `4x-fin/f-deprecations` → PR to `release/4.x`.
- The `sync/fragments-deprecations-<yyyymmdd>` branch is created only by `scripts/release/sync-fragments.mjs`.
- The rebuilt open PRs keep their existing branches (`next-fin/surf-*`). Push follow-up commits to them and never force-push (OD-4). Resolve conflicts by merging `origin/next` into the branch, not by rebasing a shared branch with a force-push.

### FIN-F.1 Land existing open PRs

Re-checked 2026-10-10 with `gh api repos/auraoneai/auraglass/pulls/<n>` and `git merge-tree --write-tree origin/next pr/<n>`. All 14 PRs:
- target `next`,
- branch from the old tip 84a3b94f1,
- have 1 commit each and are not stacked,
- have 0 status checks.

Before every merge:
1. Re-run `gh api repos/auraoneai/auraglass/pulls/<n> --jq '.mergeable_state'`.
2. Re-run the narrow local jest set named in the row.
3. Require a green `allow_failure: false` GitLab pipeline on the head SHA.

**Prerequisites for every FIN-F.1 merge (§20):**
- Pipelines exist on `next` (OD-8, or the FIN-B REQ-FIN-20 fallback).
- #113 (REQ-FIN-01 token build, currently `dirty`) is merged, so `npm run build` exits 0. The dist-gated tests in #341 and #343, and the builds behind #338 and #342, are inert until then.
- REQ-FIN-06 entry eligibility (FIN-A) is merged before #338/#339 assert packed exports.
- REQ-FIN-14 CSS layering (FIN-A) is merged before #340.

**CSS-sweep rule.** #340, #347, #348, #349 and #350 all edit SURF CSS, and all but #340 edit `src/app-shell/app-shell.css`. Merge them strictly one at a time. Between merges:
1. Merge `origin/next` into the next PR's branch and resolve.
2. Re-run `npm test -- tests/data/css/surf-css.test.ts src/app-shell/app-shell.css.test.ts`.
3. Get a green remote `plat:build:dist` (CSS assembly), plus FIN-A's REQ-FIN-14 layering gate.
4. Confirm `fragments/literals-baseline/surf.json` stays all-empty.

There are no open FIN-F deprecation-file PRs. The new ones in FIN-F.3 follow the deprecation rule there.

| Slot | PR | Branch | REQ-FIN / original REQs | mergeable now | Action | Exact conflict / gap to fix |
|---|---|---|---|---|---|---|
| 1 | #343 | next-fin/surf-06-sidefx | 80 / SURF-06 | clean | TRIM | Drop the `fragments/lanes/plat.ts` hunk, which is a PLAT file. Add the two dist side-effect trap rows (`scripts/ci/verify-side-effects.mjs`, scopes `main` and `release`) as a seam request to FIN-C, or register a SURF-owned row in `fragments/lanes/surf.ts` that calls a `scripts/surf/` wrapper. Keep `tests/ai/side-effects.test.ts` (6 entries + root SURF, 0 exemptions) and the exemption removal in `src/ai/__tests__/side-effects.test.ts`. Acceptance also needs the PLAT `verify-side-effects` job green with 0 undeclared SURF calls (FIN-F.4). |
| 2 | #344 | next-fin/surf-07-rsc | 80, 82 / SURF-07, SURF-57 (canary leg) | clean | MERGE as is | Adds `canaries/next16/app/surf/breadcrumbs-server/page.tsx`, `scripts/surf/verify-canary-rsc.mjs` and `tests/rsc/surf/chartframe-function-child.test.tsx`, and edits `fragments/lanes/surf.ts`. It shares `fragments/lanes/surf.ts` with #342; #342 rebases after this one. Done only when the L11 job builds 4 canaries and the manifest lists 0 server modules (FIN-F.4). |
| 3 | #345 | next-fin/surf-08-hydration | 80 / SURF-08 | clean | TRIM | Drop the root `eslint.config.js` hunk (FIN-C file). `lint/rules/surf/_strict.cjs` can only escalate `auraglass/<rule>` configs, so add `lint/rules/surf/no-to-locale.cjs` banning `toLocale*` over the SURF globs and escalate it in `_strict.cjs`. Add a planted-violation test in `src/data`. Otherwise, open a seam request to FIN-C for `no-restricted-properties`. Keep the cross-TZ fixtures and `tests/ssr/surf/hydration.spec.ts`. Still to add: the AppShell `sidebar:rail` cookie fixture, and the full `useMediaElement` server snapshot asserted with `toEqual`. |
| 4 | #341 | next-fin/surf-04-peers | 80 / SURF-04 | clean | MERGE as is (gated on OD-17) | It implements the "document peers" option: a note in `src/compat/index.ts` plus `tests/data/exports/peer-isolation.test.ts`. Merge only after OD-17 is recorded. If OD-17 selects "lazy" or a "compat subpath" instead, add that change to this PR before merging. The test is inert until #113 makes `dist` buildable. |
| 5 | #338 | next-fin/surf-01-exports | 80 / SURF-01 (+ the `AppShell.parseCookie` part of SURF-02/-21) | clean | TRIM | Drop the `scripts/build/api-report.mjs` ROOT fix (`'..'`→`'../..'`), which is a FIN-C file. Raise it as a seam request, or regenerate through SURF's own `scripts/surf/api-report.mjs`. Keep the 7-value `./app-shell`, `Timeline.formatTimestamp` (not exported from root), and `AppShell.parseCookie`. #338 is the single owner of `parseCookie`; #348 drops its copy. After merging, run `npm run api:update` (remote build) and commit the regenerated `etc/api/{app-shell,root.surf}.*` in the same PR so the etc/api diff is clean. `tests/data/exports/surf-entries.test.ts` must run against the packed tarball (`AURAGLASS_TARBALL`), not `src`. |
| 6 | #339 | next-fin/surf-02-statics | 80 / SURF-02 | dirty (Pagination.tsx, SourceTransition.tsx) | TRIM | All three statics already reached `next`: `Pagination.getRange` via #358, `Command.score` via #360, `SourceTransition.start` via #362. Revert the 3 `src/components/**` hunks, which makes the conflict disappear. Keep `tests/data/exports/surf-statics.test.ts` and change it to assert all 11 statics (including `AppShell.parseCookie` from #338) on the packed exports, with no extra names per entry. |
| 7 | #342 | next-fin/surf-05-purity | 80 / SURF-05 (+ the REQ-FIN-07 SidebarToggle transfer) | clean | TRIM | Drop the `registry/items/code-surface/index.tsx` hunk. That file is PLAT-owned, and the hunk is a behaviour regression: `copied` never resets. Open a seam request to FIN-C for a timer-free reset. Keep: the AST gate over all SURF roots + labs, the exact timer allowlist, and the fixes in SidebarToggle (no document Mod+B listener), appShellStore (`getAnimations` instead of a timer), CarouselRail, mediaStore, toneCache, `useMediaElement`, and `scripts/surf/verify-dist-ai.mjs`. Merge `origin/next` after #344 (`fragments/lanes/surf.ts`). Add a no-args fixture test that expects exit 1, and confirm the lane log lists >0 scanned files. |
| 8 | #340 | next-fin/surf-03-css | 80 / SURF-03 | dirty (`src/backdrops/presets/media.css`, `src/date/date.css`) | REBASE+RESOLVE + TRIM | First CSS sweep; requires REQ-FIN-14 merged first. Drop the `fragments/css/surf.ts` hunk (FIN-A registers `presets/media.css`). Resolve both CSS conflicts so that each file keeps the next-side rules inside a single `@layer ag.components {}` block after `LAYER_ORDER_STATEMENT`. Delete the `!important` visually-hidden rule in `ai.css`. `surf-css.test.ts` must cover every SURF CSS root and report 0 orphans, 0 missing layer-order lines, 0 `!important`, 0 non-`ag.components` layers and 0 raw literals. Cross-WP: #175 (PLAT-74, dirty) edits the same 8 ai/media/backdrops CSS files, and #308/#322/#323 (CMP, dirty) edit the 6 W1 CSS files. By §6.1, #340 survives. Record a seam note asking FIN-C and FIN-E to drop those hunks. |
| 9 | #347 | next-fin/surf-10-forwardref | 80 / SURF-10 | clean | MERGE as is (in its CSS slot) | Second CSS sweep (`app-shell.css` RTL safe-area). On the PR head, `forwardRef` is gone from SURF src: only a comment remains in `Table.tsx`. It also escalates `no-forward-ref`, and adds `tests/surf/pseudo-locale.test.tsx` and the `rtl.spec.ts` x-order assertions. Merge `origin/next` after #340 and re-run the CSS tests. #173 (PLAT-72, dirty) touches the same 20 files; by §6.1 #347 survives and FIN-C drops those hunks. The remote `rtl.spec.ts` must pass (FIN-F.4). Move `tests/surf/pseudo-locale.test.tsx` to `tests/app-shell/` or another §6 SURF test root: `tests/surf/` is not in the ownership list. |
| 10 | #346 | next-fin/surf-09-metas | 80 / SURF-09 | clean | TRIM | Drop `src/components/field/Form.meta.ts` and `src/components/key-value-editor/KeyValueEditor.meta.ts` (CMP, FIN-E). Its `AppShell.tsx` change (`data-ag-part` main/skip-link) overlaps #338, #348, #349 and #350, so merge `origin/next` after #338. `tests/app-shell/meta-coverage.test.ts` must render each story fixture and diff the rendered parts. A static check is not enough. |
| 11 | #348 | next-fin/surf-app-shell-a | 81 / SURF-18, 19, 21 | clean | REBASE+RESOLVE | Third CSS sweep. After #338, remove the duplicate `parseCookie: parseAppShellCookie` member and import. Resolve `AppShell.tsx` against #338 and #346. Still to add for acceptance: a dev warning when the SkipLink is not first; `:focus-visible` reveal; the remote a11y.spec "skip link focuses main" test; the layout.spec tests "main owns scroll" and "safe-area env fixture"; a 0 render-phase cookie-read spy; and the exact cookie string with both keys. |
| 12 | #349 | next-fin/surf-app-shell-b | 81 / SURF-20, 23, 24, 25, 26, 27 | dirty (`Sidebar.test.tsx`, `app-shell.css`, `Breadcrumbs.tsx`, `Pagination.tsx`) | REBASE+RESOLVE | Fourth CSS sweep. Merge `origin/next` after #342 and #348. In `appShellStore.transition()`, keep #349's removal of the animating flag and timer (SURF-24). That supersedes #342's `getAnimations` code, so the final function has no timer and no `getAnimations`. In SidebarToggle, keep #342's removal of the document listener. Resolve Breadcrumbs/Pagination against #357/#358 already on next, keeping the next-side `getRange` and IconButton overflow. Acceptance still needs: the remote theme.spec with 3 colour changes under `createBrandTheme`; the computed-style probe (transform none, willChange auto); and axe `landmark-unique`=0 in L5. |
| 13 | #350 | next-fin/surf-app-shell-c | 81 / SURF-28, 29, 30, 36, 39, 40 | dirty (`Sidebar.test.tsx`, `app-shell.css`) | REBASE+RESOLVE + TRIM | Fifth CSS sweep. Revert the `src/foundation/index.ts` hunk, which REQ-FIN-81 forbids. Instead, compose `onClick`/`onKeyDown` inside `src/app-shell/Sidebar.Nav.tsx` with Base UI `mergeProps`, user handler first, and add the "RouterLink onClick + Item onClick both fire" jest case. Resolve `app-shell.css` and `Sidebar.test.tsx` after #349. Acceptance still needs remote: rail boxes ≥40/44 px, 320 px no overflow, focus not obscured, mobile last item above the tab bar, and axe `aria-hidden-focus`=0. |
| 14 | #351 | next-fin/surf-drawer | 81 / SURF-31, 32 | clean (semantic conflict with #342) | REBASE+RESOLVE | Merge `origin/next` after #342 and #350. #351 keeps `document.addEventListener('keydown')` for Mod+B, which SURF-05 forbids. Bind Mod+B through a React `onKeyDown` on the shell root element (`src/app-shell/**`) that calls the same mode-aware `activate()`, with no document or window listener, and keep the purity gate green. Confirm the drawer uses `useLayer({kind:'drawer', modal:true})`, width `min(85%,20rem)` and focus return. Rewrite `layout.spec.ts`/`sidebar-drawer.spec.ts` with no pending early returns. Their remote runs at 375 and 1440 must pass. |

Action totals: 14 PRs listed. MERGE as is: 3 (#341, #344, #347). REBASE+RESOLVE: 5 (#340, #348, #349, #350, #351; #340 and #350 also TRIM). TRIM only: 6 (#338, #339, #342, #343, #345, #346). CLOSE: 0. SPLIT: 0. #339 is trimmed rather than closed because its test is still the only SURF-02 packed-statics check.

### FIN-F.2 Finish partially-merged work (PRs #352–#368 on `next`)

These 17 PRs were stacked and merged at the same instant with 0 checks. Their bodies report a pre-existing jest failure in `tests/contract/fragments.test.ts` (#353) and compat PENDING failures (#357). For every REQ below:
1. Re-run its ledger `acceptance` on `next`.
2. Implement only what is still missing.
3. Delete that REQ's `console.warn(...pending); return` paths in its specs.
4. Get the acceptance green in an activated GitLab job.

Rows tagged "verified" were checked against `origin/next` e5a2d6835 on 2026-10-10. The other clauses are unproven because no pipeline has ever run. Do not re-implement what already passes. One PR per bullet group, on the branch named.

**Branch `next-fin/f-fragments-contract-fix`** (gate everything else in this section on it): make `tests/contract/fragments.test.ts` pass on `next`. It is the acceptance check for SURF-34/-47 and for every DEP row. Find the failing SURF case and fix it in `fragments/deprecations/surf.ts` or `fragments/codemods/surf.ts`. A failing case in a non-SURF fragment goes to its owner as a seam request. Then run `node scripts/release/gen-deprecations.mjs` and commit `src/internal/deprecations.generated.ts`.

**Branch `next-fin/f-app-shell-merged`** (REQ-FIN-81; merge after FIN-F.1 slot 14 so `app-shell.css` is settled):
- SURF-33 (#352): `Sidebar.test.tsx` must assert a `console.error` spy count of 0 for `validateDOMNesting`. Remove the pending early return in `tests/a11y/apg/surf/sidebar.apg.spec.ts` so it fails on a missing subject. The remote APG run must be green.
- SURF-34 (#353): DEP rows for GlassTopBar/GlassHeader/GlassNavigation exist (verified). Remaining: a green `fragments.test.ts`, and the `TopBar.test.tsx` placement='overlay' case asserting `data-ag-placement` with `getAllByRole('banner').length===1`.
- SURF-35 (#352): the remount case exists in `TopBar.test.tsx` (verified). Add `MobileShell.test.tsx` "top and bottom edge, no warning": exactly 1 `[data-ag-edge=top]` and 1 `[data-ag-edge=bottom]`, with TabBar registering `bottom`. Add the two-TopBars → 1 warning and two-shells → 0 warnings cases.
- SURF-37 (#352): add `@container ag-inspector (width < 280px){.ag-inspector__field{grid-template-columns:1fr}}`. Verified missing: the container is declared at `app-shell.css:204`, but no query uses it. Add the `.ag-inspector__field` `grid-template-columns:minmax(6rem,40%) minmax(0,1fr)` assertion to `app-shell.css.test.ts`. Delivering the LiquidGlassInspectorPanel adapter is FIN-F.3 SURF-13 and is not repeated here.
- SURF-38 (#354): `Inspector.Sheet.tsx` uses `side=end` (verified, lines 3 and 62). Change it to CMP Sheet `side='bottom'` with `detents={[0.5, 1]}`, opened only from InspectorToggle. Add the jest case "compact + defaultInspector closed → no dialog; toggle → role=dialog". Rewrite `tests/e2e/surf/app-shell/inspector.spec.ts` (docked at 1440, floating at 1200, sheet at 375, focus returns to the toggle) with no pending return.
- SURF-42..46 (#355):
  - Remote `tests/e2e/surf/app-shell/resizable.spec.ts` touch drag with 0 React Profiler commits between pointerdown and pointerup.
  - `tests/perf/browser/surf/resizable-drag.spec.ts` with no pending return.
  - `tests/a11y/apg/surf/splitter.apg.spec.ts` failing on a missing subject.
  - a11y.spec "splitter target size": `::before` hit box ≥24 px fine and ≥44 px coarse.
  - Jest: the nested 2×2 case, `minSize='240px'` clamping at 20%, `onCollapse` once, RTL ArrowRight decreasing, `resizePanels([30,70],…,-21)` → `[0,100]` and `-12` → `[20,80]`, and SSR `renderToString` flex-basis plus hydrate with 0 `console.error`.
  - Verify each and add whatever is missing.

**Branch `next-fin/f-nav-merged`** (REQ-FIN-82):
- SURF-47 (#356): add EnhancedGlassTabs, GlassTabItem and TabItem to `fragments/deprecations/surf.ts` and the `fragments/codemods/surf.ts` renames. Verified missing: 0 hits. This is a deprecation-file PR, so it merges alone, then run `gen-deprecations.mjs`, and it goes to `release/4.x` through SURF-12's `4x-fin/f-deprecations`. Assert the default `data-ag-appearance='pill'` and `onValueChange('b', objectContaining({reason}))`.
- SURF-48 (#356): `Tabs.test.tsx` has no keyboard or axe cases (verified). Add:
  - ArrowLeft/ArrowRight/Home/End,
  - 0 dangling idrefs across two identical instances,
  - axe `duplicate-id-aria`=0.
  Make `tests/a11y/apg/surf/tabs.apg.spec.ts` real.
- SURF-49/50 (#356/#357): a CSS test that the indicator `transition-property` is only translate and scale. Remote `tests/e2e/surf/motion/tabs-indicator.spec.ts` in Chromium (VT) and Firefox (fallback). `scrollIntoView` spy called once. `data-state` on every panel. Remote 320 px `scrollWidth ≤ 320`. Both specs drop their pending returns.
- SURF-51..54 (#357):
  - `useTabBarPanel` is present in tabs (verified). Assert "tabs requires panels" errors 1/0.
  - Remote `tests/e2e/surf/target-size.spec.ts` tab bar items ≥44×44.
  - `blur-budget.spec.ts` "tab bar = 1 backdrop filter" on 3 engines, with the TabBar story subject registered.
  - `tabbar-minimize.spec.ts`: label opacity <1 after 400 px of scroll, and the floating bar visible at 800 px.
- SURF-55..59 (#357/#358):
  - Last breadcrumb `li` has 0 separators; the RTL flip rule is asserted.
  - "collapses middle" gives "Show 3 more" + 3 link menuitems.
  - APG overflow focus return in `breadcrumbs-overflow.apg.spec.ts`, with no pending return.
  - 16ch truncation, accessible name = full text, at 390 px remote.
  - The SURF-57 canary leg is FIN-F.1 #344.
  - Pagination "uncontrolled button mode advances" and "labels.page in button mode".
  - The range-cap loop (pageCount 1..50 × sibling 0..2 × boundary 0..2).
  - Remote layout spec at 390 px showing exactly Previous, "Page N of M" and Next.
- REQ-FIN-07 transfer (REQ-FIN-82): `src/components/command-palette/CommandPalette.tsx` must register through `useLayer` + `usePortalContainer` from `src/theme`, with no own portal and no document listeners. Verified: no `useLayer` in `src/components/command-palette`. In the same PR, delete CommandPalette's REQ-FIN-07 baseline row in FIN-A's gate baseline (coordinate the file edit with FIN-A as a §6.1 transfer). Stacked Escape is closed by the top layer only.
- SURF-61/62 (#360):
  - Assert `Command.score('oS','openSettings')` > a mid-word subsequence, and `shouldFilter={false}` shows all items.
  - Add the IME jest case: Enter with `isComposing:true` does not select. Verified missing from the tests.
  - Add "hotkey opens and restores focus" (Ctrl+K → combobox focused; Escape twice → opener focused).
  - Make `tests/a11y/apg/surf/command.apg.spec.ts` real.
- SURF-63 (#361):
  - Add `Command.test` "5,000 items": ≤30 `[role=option]`, and ArrowDown to item 4999 gives an `aria-activedescendant` that exists. Verified missing.
  - Add "announces count" (fake timers, 500 ms → "N results"). The code exists at `Command.tsx:118`.
  - Rewrite `tests/perf/browser/surf/command-5000.spec.ts`, which today is a pending stub, to measure input→paint p95 ≤50 ms on the remote perf lane.
- SURF-64/65 (#362):
  - Jest with a mocked `startViewTransition`: name source→destination, both cleared after `finished`, and a duplicate-id dev error.
  - "focus follows morph" only when the source had focus.
  - Remote `tests/e2e/surf/motion/source-transition.spec.ts`, 3/3 engine paths (VT, React `<ViewTransition>`, FLIP), plus calm and none cases.

**Branch `next-fin/f-data-merged`** (REQ-FIN-83):
- SURF-66/67 (#363/#364): 120 rows with no pagination props → 120 `tbody tr`. Controlled-pair tests for columnVisibility, sizing, pinning, order and pagination. The handle test: virtualize 10k rows, `scrollToRow('r9000')` renders it, and `focusCell` moves `activeElement`.
- SURF-69 (#364): CMP Checkbox is imported (verified). Add the Profiler test (≤3 commits per toggle) and the Shift+Space range case (anchor r2 → r6 selects 5).
- SURF-70 (#364):
  - The 400,000 px total and the ≤31-row bound are missing (verified: no `400000` in `src/data/table`). Assert `tbody` height `400000px`, ≤31 rows, `aria-rowindex=1` on the header, and the >500-row dev warning.
  - Remote `table-virtual.spec.ts` finds `aria-rowindex=9001` after scrolling.
- SURF-71/72 (#364): jest End → 1200 for maxSize 1200, and ArrowLeft grows under a `dir=rtl` wrapper. For right pins, `insetInlineEnd` is 0 for the last column and `data-ag-pinned-edge` is present. Also add auto-pin <480 px with >3 columns. Remote `table-pinning.spec.ts` box delta ≤1 px.
- SURF-73 (#364): add a `useGridKeyboard` row of ≤2.5 KB (2560 bytes) to `fragments/size-budgets/surf.ts`. Verified missing. Jest: a single `tabindex=0`, Enter → `onRowAction`, PageDown moves 15 rows at 600/40. Real `table.apg.spec.ts`.
- SURF-74/75 (#364/#365): loading gives 3 `table-row` + 8 `table-loading` rows and `aria-busy`. Empty gives `td[data-ag-part=table-empty][colspan]`. Regenerate the inline snapshot to exactly 13 parts with no duplicates. Confirm `plat:gate:change-class` (L3) reads it and flags a renamed part as C-B in a pipeline.
- SURF-76 (#366): size/numeric jest assertions. Remote `table-responsive.spec.ts`: coarse rows ≥44 px, no overflow at 320 or 390, no skipped assertions.
- SURF-80 (#366): the existing "idle timers" case at `VirtualList.test.tsx:106` must spy `requestAnimationFrame` and `setInterval` for 500 ms after settle and assert 0 calls. Also: `onEndReached` exactly once for 3 scroll events inside the threshold, and the `anchor='end'` append test.
- SURF-81 (#368): make `aria-label | aria-labelledby` a required union. Add `tests/types/surf/tree-view.test-d.ts` with an `@ts-expect-error` for `<TreeView items={…}/>`; verified: no such type test. Jest `loadChildren` on expand: `aria-busy` true → absent. Replace the emoji with CMP icons, indent with the CSS var at 20/12 px, and localise the chevron label.
- SURF-84/85 (#367): `tsc --noEmit` over the type-test config consumes every `@ts-expect-error`, plus the `makeRule` dev-warning spy. The deep-frozen 3-level tree keeps sibling identity for all 7 ops. `FilterBar.useModel` exists (`FilterBar.tsx:209`); assert that `FilterBar` itself consumes it with stable callbacks.

### FIN-F.3 Build work that has no PR

This section covers 119 original REQs with no PR, merged or open. Each group below is one PR on the named branch. Every REQ's **Steps** and **Acceptance** are copied verbatim from `fin-open-ledger.json`; implement the full REQ text from PRD-4 plus PRD-F §5.6. If a step says another stream (PLAT, QUAL, CMP or MAT) "adds" or "ships" something, that clause belongs to that WP: send the request (§6.1) and don't write it yourself. Every spec a group touches loses its `console.warn(...pending); return` path in that same PR (AC-FIN-GLOBAL); the leftovers are listed under SWEEP at the end. Branch prefix `next-fin/` → PR to `next`.

#### `next-fin/f-grammar` — REQ-FIN-80, AC-FIN-80; REQ-SURF-11
Files: `tests/types/surf/prop-grammar.test-d.ts`, `src/data/sparkline/**`, `src/ai/error/**`, `src/backdrops/Backdrop.tsx`, `lint/rules/surf/_strict.cjs`.
Notes: OD-17 (owner) decides Backdrop `tone` vs `BANNED_PROPS`. Until it is recorded, use the previous prompt's fallback: rename to `mediaTone` unless OD-17/C-13 says otherwise. Removing `density`/`backdrop` from `AppShell.Root` is delivered by #349 (SURF-20) and is not repeated here; this PR only asserts it in the type test. Write the `_strict.cjs` escalation of `prop-grammar.cjs` now, guarded so that the lint lane reports it `pending` while the rule file is absent (PRD-F §4.3 rule 2); this PR merges after the FIN-E PR that ships the rule. Declaring attributes in `AG_ATTRIBUTES`, if that is a contract file, goes through `contract/v1.2-final`.

- **REQ-SURF-11** (needs: owner-decision)
  - Steps: Rewrite prop-grammar.test-d.ts against real SURF prop types: no BANNED_PROPS keys, the value/onValueChange(value, details) triple for selection, and the open/onOpenChange pair for disclosure. Change the Sparkline and ProviderErrorState variants to appearance (data-ag-appearance). Resolve the Backdrop tone vs BANNED_PROPS conflict (owner decision, since REQ-SURF-153 mandates tone). Remove density and backdrop from AppShell.Root, and declare or remove the extra data-ag-* attributes in AG_ATTRIBUTES. CMP ships prop-grammar.cjs, then SURF escalates it in _strict.cjs.
  - Acceptance: tsc fails on a planted banned prop for any SURF component. The attributes contract test reports 0 SURF-emitted attributes outside SURF/CMP|SURF/ANY setters.

#### `4x-fin/f-deprecations → sync` — REQ-FIN-80, AC-FIN-80; REQ-SURF-12
Files: `fragments/deprecations/surf.ts` on `release/4.x`, then `src/internal/deprecations.generated.ts` on both lines.
Notes: Deprecation-file PR. Merge it alone, then run `node scripts/release/gen-deprecations.mjs`. This same `release/4.x` PR also carries the SURF-47 Tabs rows from FIN-F.2. After it merges on `release/4.x`, run `node scripts/release/sync-fragments.mjs` (FIN-A REQ-FIN-13 owns the script); it opens `sync/fragments-deprecations-<yyyymmdd>` into `next`. Regenerate on `next`. Hand-editing the `next` copy is not allowed.

- **REQ-SURF-12** (needs: agent)
  - Steps: On release/4.x: set since 4.3.0 for renamed and consolidated rows, set removeIn 5.0.0 on all rows (adapter lifetime goes in compat), set codemod app-shell-slots for the shell, sidebar and tab-bar items, dedupe symbols, fix the Waveform wording and keep messages at 200 chars or fewer. Sync to next and regenerate deprecations.generated.ts.
  - Acceptance: fragments.test.ts passes on both lines. Next's generated table contains all 145 DEP-S ids, with 0 duplicates and 0 removeIn values other than 5.0.0.

#### `next-fin/f-compat-adapters` — REQ-FIN-80, AC-FIN-80; REQ-SURF-13
Files: `src/compat/surf/**`, `tests/fixtures/consumer-4x/cases/surf/**`.
Notes: Merge after the SURF-12 sync, so every DEP-S id exists on `next`. It also covers the LiquidGlassInspectorPanel adapter left from SURF-37 (FIN-F.2).

- **REQ-SURF-13** (needs: agent)
  - Steps: Use DEP-S ids in every warnDeprecated call. Add the 7 missing adapters. Drop the GlassGallery adapter. Export the 4.x TreeView under its 4.x name. Make GlassAppShell map sidebarPlacement to sidebarSide and collapsed to defaultSidebar, and wrap header, sidebar and children. Feed the compat tests 4.x story args and assert a single warning matching /DEP-S\d{4}/.
  - Acceptance: Every adapter renders from 4.x story props and warns once with a DEP-S id. rg "warnDeprecated\('Glass" over src/compat/surf returns 0.

#### `next-fin/f-codemods` — REQ-FIN-80, AC-FIN-80; REQ-SURF-14
Files: `fragments/codemods/surf.ts`, `fragments/codemods/surf/fixtures/**` (normalise to `<id>/<case>/{input,output}.tsx`).
Notes: The transform `packages/cli/src/migrate/4to5/transforms/app-shell-slots.ts` and the plat-only filter in `packages/cli/src/migrate/4to5/__tests__/fixtures.test.ts` are FIN-C files (`packages/cli`). File a §6.1 seam request with the exact emitted output `render={<button type="button" onClick={h}/>}` and the `data-grid-columns` decision. FIN-F authors ≥1 fixture per absorbed name (~80). Move the PLAT-dir fixture `fragments/codemods/plat/fixtures/app-shell-slots/basic` only through FIN-C.

- **REQ-SURF-14** (needs: agent)
  - Steps: Remove the plat-only filter in fixtures.test.ts. Fix app-shell-slots.ts to emit render={<button type="button" onClick={h} />} for handler-only items. Implement the data-grid-columns transform, or fold it into canonical-names. Normalize fixtures to <id>/<case>/{input,output}.tsx. Author at least one fixture per absorbed name, covering every REQ-SURF-14 mapping (tabs index TODO, Pagination, SplitPane, DataTable, DatePicker range and format TODO, ai-chat, media/backdrops, deps).
  - Acceptance: The cli fixtures test discovers 80 or more SURF cases, all pass byte-equal, and every renames[].from has a fixture.

#### `next-fin/f-migrate-canary` — REQ-FIN-80, AC-FIN-80; REQ-SURF-15
Files: `tests/fixtures/consumer-4x/cases/surf/**` (split `data/Stats.page.tsx`), `fragments/lanes/surf.ts` (L11 row), `ci/surf.gitlab-ci.yml` job.
Notes: Remote only. Installing `aura-glass@4.1.0`, running `migrate 4to5`, swapping in the 5.0 tarball, then `tsc` and the render smoke all happen in GitLab CI. Needs #113 and FIN-C's tarball job.

- **REQ-SURF-15** (needs: ci)
  - Steps: Build the L11 codemod canary: install aura-glass@4.1.0, run migrate 4to5, swap to the 5.0 tarball, then run tsc and a render smoke test. Assert the flagship subset has 0 TODOs, each chart page has 1 removed TODO, and handler items become render={<button>}. Register it in the lanes fragment and CI. Split Stats.page.tsx.
  - Acceptance: The L11 canary job is green and its TODO report matches these expectations.

#### `next-fin/f-app-shell-frame` — REQ-FIN-81, AC-FIN-81; REQ-SURF-17
Files: `src/app-shell/app-shell.css`, `src/app-shell/appShellStore.ts`, `src/app-shell/AppShell.tsx`, `tests/e2e/surf/app-shell/layout.spec.ts`.
Notes: CSS sweep. Merge after FIN-F.1 slot 14 (#351) and after `next-fin/f-app-shell-merged`. `class-coverage.test.ts` is PLAT's (FIN-C) part of the clause.

- **REQ-SURF-17** (needs: agent)
  - Steps: Restructure app-shell.css: Root becomes the container and an inner .ag-app-shell__frame holds the grid, with all grid rules targeting the inner frame inside @container. Use the contract values auto|desktop|mobile for data-ag-layout. Delete the ResizeObserver mode logic. Add the two layout.spec tests (1440 and 1024: sidebar.right ≤ main.left+1; a 900px shell in a 1920 viewport resolves to medium) in a Vite app without Tailwind. Remove the early-return pending paths. PLAT adds class-coverage.test.ts.
  - Acceptance: The remote layout.spec tests pass on chromium, webkit and firefox. app-shell.css.test asserts exactly 3 @container conditions applied to descendants.

#### `next-fin/f-app-shell-workspace` — REQ-FIN-81, AC-FIN-81; REQ-SURF-41
Files: `registry/items/app-shell-workspace/**`, `src/app-shell/app-shell.css` (auto-grid track), `tests/capability/registry/app-shell-workspace.test.tsx`.
Notes: Composes CMP Card through public `aura-glass` imports. The L11 registry render harness is PLAT's job (`plat:test:registry`).

- **REQ-SURF-41** — Registry item app-shell-workspace composing AppShell, PageHeader (tabs slot), ResizablePanels, Inspector, Tabs, Timeline, CMP Card; .ag-app-shell__auto-grid = repeat(auto-fit, minmax(min(100%,28rem),1fr)); capability test (needs: agent)
  - Steps: index.tsx: pass Tabs via PageHeader `tabs`, with matching Tabs.Panel per tab. Add a Timeline (aura-glass Timeline) in a panel and wrap auto-grid cells in CMP Card. Set defaultInspector='open'. app-shell.css: change auto-grid to `repeat(auto-fit, minmax(min(100%, 28rem), 1fr))`. Create tests/capability/registry/app-shell-workspace.test.tsx that renders the item and asserts the PageHeader [data-ag-part=tabs] contains a tablist, 1 tabpanel, a Timeline root, >=1 Card, the Inspector complementary and ResizablePanels separators, and that the auto-grid class is present.
  - Acceptance: The new jest capability test passes. A CSS test asserts the auto-grid track string exactly. The PLAT registry render harness (L11) renders the item.

#### `next-fin/f-table-rest` — REQ-FIN-83, AC-FIN-83; REQ-SURF-68, 77, 78, 79
Files: `src/data/table/**`, `tests/e2e/surf/data/**`.
Notes: SURF-79 `onCellEditCommit` is 5.1 C-E scope. Ship it behind the contract only if C-E is in contract-v1.1; otherwise it goes through `contract/v1.2-final` and the ledger row is closed as `deferred` with that slot (record the decision). Merge after `next-fin/f-data-merged`.

- **REQ-SURF-68** — sort cycle, aria-sort, 'Sort by' name, announcements via useAnnouncer (needs: agent)
  - Steps: Route onSortClick announcements through useAnnouncer().announce. Update Table.test to assert announce('Sorted by Qty, ascending') through the provider mock. Rewrite table.apg.spec.ts to activate a sort header via the keyboard and assert aria-sort transitions.
  - Acceptance: jest spy on the announcer receives exactly 'Sorted by Qty, ascending' on first activation
- **REQ-SURF-77** (needs: ci)
  - Steps: Table.test.tsx 'toggle every boolean': include virtualize:true (with a height-bearing scroller mock), enableRowSelection-type booleans, and render false->true->false explicitly; assert rows still render after each rerender. Make the L1 lint job blocking (remove allow_failure) and get a pipeline run on next.
  - Acceptance: jest toggle test covers all 8 boolean props of TableProps (enableMultiSort, enableColumnResizing, enableColumnReordering, manualPagination, manualSorting, virtualize, stickyHeader, loading); a CI pipeline on next runs `eslint` over src/data with exit 0 and the rules-of-hooks test green, non-allow_failure.
- **REQ-SURF-78** (needs: agent)
  - Steps: Table.tsx renderHeaderCell: replace the span of buttons with CMP Menu (src/components/menu) triggered by an IconButton aria-label=msgs.columnActions + label, items 'Move left'/'Move right' (disabled at ends/boundary). In moveColumn: compute pinned left/right/center partitions from `pinning` and reject moves that cross partitions (no-op, item disabled). Table.reorder.test.tsx: open menu via trigger, choose Move left and Move right, assert columnOrder/onColumnOrderChange, announcement text 'Moved Name to position 2 of 2', and that a center column cannot move into a left-pinned column's slot.
  - Acceptance: jest Table.reorder.test.tsx has >=3 cases (menu trigger role=button name 'Column actions Name', move both directions, pinning boundary blocked) all passing; rg 'components/menu' src/data/table/Table.tsx >=1.
- **REQ-SURF-79** (needs: agent)
  - Steps: Table.tsx: add prop onCellEditCommit(rowId, columnId, value); in grid mode handle Enter/F2 on focused cell (useGridKeyboard) to swap the cell content to CMP TextField/NumberField/Select per meta.editor (options from meta.options); Enter/Tab commits once via onCellEditCommit and exits, Escape cancels and refocuses the cell; never mutate `data`. Create src/data/table/Table.edit.test.tsx covering F2/Enter open, Enter commit once, Tab commit, Escape cancel+focus restore, deep-frozen data not mutated, select editor options.
  - Acceptance: jest Table.edit.test.tsx >=6 passing cases; onCellEditCommit called exactly once per commit; Object.isFrozen(data) input does not throw.

#### `next-fin/f-tree` — REQ-FIN-83, AC-FIN-83; REQ-SURF-82, 83
Files: `src/data/tree-view/**`, `tests/a11y/apg/surf/tree-view.apg.spec.ts`, `tests/e2e/surf/data/tree-virtual.spec.ts`, `tests/perf/browser/surf/data-tree-view.spec.ts`.
Notes: SURF-82 needs OD-20 (treegrid vs tree). Until it is decided, implement the previous prompt's default `treegrid` and keep the role switch isolated so it can change.

- **REQ-SURF-82** (needs: owner-decision)
  - Steps: Decide (owner) whether treegrid/row satisfies the requirement or amend PRD; if treeitem required, render RAC Tree inside a custom role override or build on useTree. Rewrite tree-view.apg.spec.ts: fail if subject missing; assert one tab stop (Tab once lands in tree, Tab again leaves), Up/Down, Right expand/enter child, Left collapse/parent, Home/End, '*' expands siblings, type-ahead within 1000 ms, Enter fires onAction (story logs), Space toggles aria-selected, and aria-level/aria-setsize/aria-posinset/aria-expanded on every item.
  - Acceptance: Remote Playwright tree-view.apg.spec.ts executes (not skipped) with >=10 expect() assertions all passing on the built Storybook.
- **REQ-SURF-83** (needs: agent)
  - Steps: TreeView.tsx: when virtualize, wrap RACTree in RAC <Virtualizer layout={ListLayout} layoutOptions={{rowHeight}}> (or flatten visible nodes into VirtualList). Add a 5,000-node story. tree-virtual.spec.ts: expand all, assert count of [role=treeitem|row] <=40 in a 480px container. data-tree-view.spec.ts: measure expand-all with performance marks, assert <=150 ms desktop.
  - Acceptance: jest unit: virtualize with 5000 nodes in jsdom renders <=40 items (mocked size); remote Playwright tree-virtual and perf specs execute and pass budgets.

#### `next-fin/f-filterbar` — REQ-FIN-83, AC-FIN-83; REQ-SURF-86, 87
Files: `src/data/filter-bar/**`, `tests/e2e/surf/data/filter-bar.spec.ts`, `tests/a11y/apg/surf/filter-bar.apg.spec.ts`.
Notes: CMP SearchField/ToggleGroup/IconButton/Popover/Sheet are used only through public parts (seam S-30).

- **REQ-SURF-86** (needs: agent)
  - Steps: filter-serialize.ts: encode values with explicit typing (e.g. JSON or percent-escaped components with a type tag), parse number/date 'between' into {start,end}, boolean into boolean (extend FilterRule.value type), escape separators. filter-model.test.ts 'round-trip': table of 40 fixed cases covering every field type x every default operator incl. between/is-empty/no-value, values with ',', '..', '&', unicode; assert deep equality modulo ids and serialize(parse(s))===s.
  - Acceptance: jest 'round-trip' runs 40 parameterized cases, all lossless; number between [1,2] round-trips to {start:1,end:2}.
- **REQ-SURF-87** (needs: agent)
  - Steps: FilterBar.tsx: use CMP SearchField, ToggleGroup (aria-pressed items), IconButton for remove ('Remove filter {field} {operator} {value}'), Popover anchored to the chip with initial focus on first field and finalFocus back to chip; fix add-filter to use a placeholder option/Menu and DEFAULT_OPERATORS[f.type][0]; fix CSS class mismatch; add container-query responsive: <480px collapse chips into 'Filters (n)' Button opening CMP Sheet side=bottom, 480-767 two-line clamp + '+n more'. FilterBar.test.tsx: cases for add-filter first field, operator validity, popover focus return, '{n} results' live region; rewrite filter-bar.apg.spec.ts with viewport 375/600 assertions.
  - Acceptance: jest FilterBar.test.tsx asserts focus returns to the chip after Escape and add-filter creates a rule with a valid operator for each field type; rg "components/(search-field|toggle-group|popover|sheet)" src/data/filter-bar/FilterBar.tsx = 4 imports; remote APG spec passes at 375px showing 'Filters (n)' sheet.

#### `next-fin/f-data-display` — REQ-FIN-83, AC-FIN-83; REQ-SURF-88, 89, 90, 91
Files: `src/data/{chip,key-value-editor,stat-card,sparkline}/**`, `src/compat/surf/**` (GlassMetricChip).
Notes: The REQ-CMP-01 transfer is done here: `src/data/chip/Chip.tsx` composes CMP `Toggle` (§6.1).

- **REQ-SURF-88** (needs: agent)
  - Steps: Chip.tsx: apply MAT `content` material (data-ag-material="content" or MAT class per contract); accept `label` string prop for remove naming when children is non-string. Add src/compat/surf/data/GlassMetricChip.tsx mapping onto Chip and export from src/compat/surf/index.ts. Chip.test.tsx: assert material attribute and remove button name with ReactNode children. Run size budget in CI.
  - Acceptance: jest Chip.test.tsx asserts content material; rg 'export { GlassMetricChip' src/compat/surf/index.ts = 1; verify-size-budgets reports Chip <=3 KB in a pipeline.
- **REQ-SURF-89** (needs: agent)
  - Steps: KeyValueEditor.tsx: build rows with Base UI Field (Field.Root invalid={dup}, Field.Error) wrapping CMP TextField for key and value; stable row ids (generate on add); after Enter-add, focus new row's key field; aria-describedby error. KeyValueEditor.test.tsx: assert Field invalid/aria-invalid + error described-by, focus moves to new key input after Enter, removing middle row keeps other rows' values/focus. Size row SB-SURF-W2-KVE in CI.
  - Acceptance: jest KeyValueEditor.test.tsx passes new focus and aria-describedby assertions; rg 'text-field|@base-ui/react/field' KeyValueEditor.tsx >=2.
- **REQ-SURF-90** (needs: agent)
  - Steps: StatCard.tsx: accept optional `id` and otherwise derive from label+value hash, or render labelledby to a label inside the same element without ids (use aria-label from label text); deep-walk children for interactive elements. stat-card.css: add container-type:inline-size on .ag-stat-card (or a wrapper) so the 200px query works. StatCard.test.tsx: locale matrix (en-US, de-DE, ja-JP, ar-EG) asserting formatted text; trend matrix up/down/zero x up-is-good/down-is-good/neutral asserting intent + hidden text 'Up 12.5% vs previous period'; duplicate-label uniqueness test. Add token-contrast lane check for delta intents on content-raised.
  - Acceptance: jest StatCard.test.tsx has >=9 matrix cases passing; hidden text exact match 'Up 12.5% vs previous period'; two same-label cards have distinct labelledby targets.
- **REQ-SURF-91** (needs: agent)
  - Steps: sparkline.css: add @media (forced-colors: active){ .ag-sparkline__line,.ag-sparkline__dot,.ag-sparkline__bar{stroke:CanvasText;fill:CanvasText} .ag-sparkline__area{fill:CanvasText;fill-opacity:.15} }. Sparkline.tsx: type label as required unless aria-hidden (discriminated union) and dev-warn. Create tests/e2e/surf/data/forced-colors.spec.ts using page.emulateMedia({forcedColors:'active'}) asserting computed stroke == CanvasText for Sparkline (and ChartFrame swatches). Add contrast assertion of --ag-fg-muted/intent colours vs content-raised >=3:1 in L4 lane.
  - Acceptance: rg 'forced-colors' src/data/sparkline/sparkline.css >=1; remote forced-colors.spec.ts executes and passes; tsc error for <Sparkline data={[1]}/> without label.

#### `next-fin/f-chart-timeline-feed` — REQ-FIN-83, AC-FIN-83; REQ-SURF-92, 93, 94, 95, 96, 97
Files: `src/data/chart-frame/**`, `src/components/timeline/**`, `tests/e2e/surf/data/chart-frame-sr.spec.ts`, `tests/a11y/apg/surf/activity-feed.apg.spec.ts`, `tests/perf/browser/surf/activity-feed-prepend.spec.ts`.
Notes: Palette ΔE2000/3:1 numbers are computed by the test from built CSS in CI. Never hand-write them.

- **REQ-SURF-92** (needs: agent)
  - Steps: ChartFrame.tsx: either mark ChartFrame itself client when children is a function (export separate ChartFrame.Client) or require adapters to be client components passed as elements (`adapter={<MyAdapter/>}` reading ChartContext via a client context hook); split islands into Legend, TableToggle, Plot client components. chart-frame.css: container-type on .ag-chart-frame, @container (max-width:480px){legend order after plot, wrap; .ag-chart-frame__plot{min-block-size:160px}}; toggle text 'Hide data table' when open. Add tests/data/rsc-hydration case rendering ChartFrame via renderAgServer with function children.
  - Acceptance: renderAgServer(<ChartFrame ...>{ctx=>...}</ChartFrame>) succeeds (or documented pattern compiles) in tests/data/rsc-hydration.test.tsx; jest ChartFrame.test.tsx asserts toggle label changes and legend placement attr at narrow container.
- **REQ-SURF-93** (needs: agent)
  - Steps: ChartFrame.Interactive.tsx: derive dir from closest [dir] / getComputedStyle(plot).direction; render a placeholder div of `height` when width===undefined before invoking children. Add apps/docs/src/chart-adapters/{recharts,visx,chartjs}.tsx typed against ChartAdapter (chart.js registration inside component) included in docs app tsconfig, with those libs as docs-app devDependencies only. ChartFrame.test.tsx: 'context' (dir rtl under dir=rtl parent, color returns var(--_ag-chart-N)), 'observer cleanup' (mock RO, unmount -> disconnect called once).
  - Acceptance: jest ChartFrame.test.tsx 'context' and 'observer cleanup' pass; docs-app typecheck covers the 3 adapter files; package.json dependencies/peerDependencies contain none of recharts/visx/chart.js.
- **REQ-SURF-94** (needs: agent)
  - Steps: Use CMP Tooltip for the last-series message (or aria-describedby text). Rewrite chart-frame-sr.spec.ts: for each table mode (toggle closed/open, visually-hidden, always) take page.locator('figure').ariaSnapshot() and compare to committed expected snapshots; fail if subject missing; add ChartFrame stories per mode.
  - Acceptance: Remote Playwright chart-frame-sr.spec.ts executes 4 ariaSnapshot assertions matching committed snapshots.
- **REQ-SURF-95** (needs: agent)
  - Steps: chart-frame.css: derive 8 colours from distinct S-03 colour vars (e.g. --ag-color-accent/info/success/warning/danger + rotations) with explicit L per scheme ([data-ag-scheme=dark] block) chosen to meet 3:1; drop the --ag-chart-N fallback until the contract PR (OI-03) lands. tests/data/chart-palette.test.ts: load built dist/data.css, resolve OKLCH for light and dark (culori or own OKLCH->sRGB), assert contrast vs content-raised >=3:1 for 1..8, chroma>=0.08 for 1..6, pairwise ΔE2000>=15 for 1..4 after Brettel/Machado deuteranopia/protanopia/tritanopia simulation; register in L4 token-contrast lane.
  - Acceptance: jest chart-palette.test.ts computes numeric contrast/ΔE values from built CSS in both schemes and passes; L4 lane lists chart palette rows.
- **REQ-SURF-96** (needs: agent)
  - Steps: Timeline.tsx: render visually-hidden intent text (e.g. labels.intent[intent]) next to the icon; add timeZone prop (default undefined or 'UTC' documented). timeline.css: set container-type:inline-size on a wrapper so the 480px fallback fires. Timeline.test.tsx: assert hidden intent text for danger/success, horizontal class/attr, dev error when relative without now.
  - Acceptance: jest Timeline.test.tsx asserts intent text content and console.error spy for missing now; rg 'container-type' src/components/timeline/timeline.css >=1.
- **REQ-SURF-97** (needs: agent)
  - Steps: ActivityFeed.tsx: render CMP Avatar (src/components/avatar) with actor.avatarUrl/name. ActivityFeed.Interactive.tsx: use CMP Button; pass first item id to detect prepends (count items before previous first id); batch announcements with a 2 s window (one timeout, cleared on unmount). Create src/components/timeline/ActivityFeed.test.tsx: prepend 3 items in two rerenders within 2 s -> single '3 new activities'; append via load more -> no announcement; autoLoad IO observe/disconnect; Avatar rendered. Add GlassInfiniteScroll migration mapping or shim.
  - Acceptance: jest ActivityFeed.test.tsx with fake timers: exactly one announcement '3 new activities' per 2 s window; appends produce none; IO disconnect called on unmount.

#### `next-fin/f-date` — REQ-FIN-84, AC-FIN-84; REQ-SURF-98, 99, 100, 101, 102, 103, 104, 105
Files: `src/date/**`, `tests/e2e/surf/date/**`, `tests/a11y/apg/surf/{calendar,date-picker,date-range-picker,time-picker}.apg.spec.ts`, `tests/perf/browser/surf/date-picker-open.spec.ts`.
Notes: SURF-105 DateTimePicker is OD-20 (owner) and 5.1 via an additive contract PR. FIN-F's part is the contract-PR text and, after the decision, a `deferred` ledger row with the 5.1 slot. Never fake a shipped DateTimePicker. The PLAT `doctor` peer check (SURF-98) is a FIN-C seam request. Open CMP PR #226 (REQ-CMP-57, TimePicker description) also edits `src/date`; merge `origin/next` after it lands.

- **REQ-SURF-98** (needs: agent)
  - Steps: DateProvider.tsx: resolve from the rendered element's closest('[lang]')/[dir] via a ref (client) and accept dir; avoid SSR mismatch by requiring locale on server or deferring. DatePicker/DateRangePicker/TimePicker: render popup through CMP Popover at >=640px container and CMP Sheet side='bottom' below (container query/useMediaQuery). packages/cli/src/doctor/checks.ts: add check that resolves both peers when aura-glass/date is imported and prints both package names. Create src/date/DatePicker.test.tsx (open/close, selection fires onValueChange once, name ISO submit). Rewrite locale.spec.ts: ar-EG dir=rtl + Arabic-Indic digits, ja-JP order, de-DE Monday first column header.
  - Acceptance: jest DatePicker.test.tsx passes; doctor test case with peers missing outputs both names; remote locale.spec.ts asserts 3 locales without skipping.
- **REQ-SURF-99** (needs: agent)
  - Steps: DatePicker.tsx/DateRangePicker.tsx: do not pass value/defaultValue/onValueChange to the inner Calendar (let RAC context drive it). date-props.test.tsx: per component, assert onValueChange fires exactly once on selection, controlled value displayed, name renders hidden input with ISO value inside a <form> (FormData), minValue/maxValue/isDateUnavailable mark cells, hourCycle 24 renders no AM/PM segment, granularity 'minute' renders minute segment, isReadOnly/isDisabled/isRequired/isInvalid attrs.
  - Acceptance: jest date-props.test.tsx >=12 assertive cases; selecting a date in DatePicker calls onValueChange exactly once (toHaveBeenCalledTimes(1)).
- **REQ-SURF-100** (needs: agent)
  - Steps: Calendar.tsx: implement week numbers per row (custom CalendarGridBody rows using state.getDatesInWeek or render rowheader only when date is weekday index 0). Add src/date/Calendar.stories.tsx. Rewrite calendar.apg.spec.ts: one tab stop; ArrowLeft/Right ±1, Up/Down ±7, Home/End week start/end, PageUp/PageDown ±1 month, Shift+PageUp/Down ±1 year (assert focused cell aria-label/date and heading text), Enter/Space sets aria-selected, unavailable cell aria-disabled=true yet focusable, coarse emulation cell box >=44x44.
  - Acceptance: Remote Playwright calendar.apg.spec.ts runs (not skipped) with >=10 assertions passing; jest test with showWeekNumbers asserts each row has exactly 1 rowheader + 7 gridcells.
- **REQ-SURF-101** — DatePicker (needs: agent)
  - Steps: DatePicker.tsx: render the trigger as CMP Button (src/components Button) with aria-describedby pointing at a visually hidden span holding the formatted value; stop passing value/defaultValue/onValueChange to the inner <Calendar> (let RAC context drive it) or add a 'contextual' mode to Calendar; register the popover in LayerStack via useLayer({kind:'popover'}) so Escape and focus return go through it; date.css: add @container (max-width:640px) .ag-date-picker__popover {position:fixed; inset-inline:0; inset-block-end:0; border-end-radius:0} (bottom sheet); focus the selected cell, or today's, on open (RAC autoFocus on the Calendar); add src/date/DatePicker.test.tsx (uncontrolled select updates the field and closes; Escape returns focus; aria-describedby holds the value; DateField segments are spinbuttons that respond to Up/Down, digits and Backspace); create tests/e2e/surf/date/date-picker-responsive.spec.ts (390px width gives a bottom sheet); make the APG/e2e specs fail, not return, when the subject is missing
  - Acceptance: jest src/date/DatePicker.test.tsx green with ≥5 assertions incl. uncontrolled select→input value; e2e at 390px shows popover bounding box bottom == viewport bottom; spec fails if DatePicker subject absent
- **REQ-SURF-102** — DateRangePicker presets/visibleMonths/draft-commit (needs: agent)
  - Steps: Calendar.tsx RangeCalendar: map Array.from({length:visibleMonths}) to <RACCalendarGrid offset={{months:i}}> inside .ag-range-calendar__months; DateRangePicker: make visibleMonths default to 2 at ≥768px container and 1 below (ResizeObserver on the group, or container query plus a useContainerWidth hook); keep draft state (useState of the pending range), apply it to RAC only on an Apply/close commit, and put presets through the draft too; CSS: .ag-date-range-picker__dialog as a grid, presets column beside the calendar ≥640px and above it below 640px (@container); create src/date/DateRangePicker.test.tsx covering 2 grids rendered, an uncontrolled preset updating the inputs, a draft not committed until Apply, and Escape discarding the draft
  - Acceptance: DateRangePicker.test.tsx: querySelectorAll('.ag-calendar__grid').length===2 by default; preset click in uncontrolled mode changes start/end segments; onValueChange not called before commit
- **REQ-SURF-103** — ISO week numbers (needs: agent)
  - Steps: week-number.ts: accept CalendarDate ({year,month,day}) and compute with Date.UTC(year,month-1,day); Calendar.tsx: render week numbers per row (RAC CalendarGridBody gives no row hook, so render a custom <tbody> from state.getDatesInWeek(weekIndex) via useCalendarGrid, or a separate week-number column using RAC's weeksInMonth) with exactly one <th role=rowheader scope=row> per week; create src/date/week-number.test.ts with 20 fixed cases incl. 2020-12-31→53, 2021-01-03→53, 2021-01-04→1, 2026-12-28..2027-01-03→53, run under TZ=Asia/Tokyo and TZ=America/Los_Angeles
  - Acceptance: week-number.test.ts 20 cases pass under TZ=Asia/Tokyo; Calendar with showWeekNumbers renders querySelectorAll('[role=rowheader]').length === number of week rows (5 or 6)
- **REQ-SURF-104** — TimePicker (needs: agent)
  - Steps: TimePicker.tsx: keep internal value state (useControllableState) shared by RACTimeField value and the listboxes; set selectedKeys on both columns; when hourCycle===12 add an AM/PM column; swap RACPopover for CMP Popover from the core components (or document a contract exception); create src/date/TimePicker.test.tsx covering minuteStep (1/5/10/15/30 option counts 60/12/6/4/2), an uncontrolled pick updating the segments, and selected options having aria-selected; harden time-picker.apg.spec.ts
  - Acceptance: TimePicker.test.tsx: uncontrolled defaultValue 09:30, click hour 14 → field text contains 14; option counts per minuteStep exact
- **REQ-SURF-105** — DateTimePicker (5.1) (needs: owner-decision)
  - Steps: 5.1 scope: open additive contract PR to ./date; create src/date/DateTimePicker.tsx (DateField granularity minute|second + CMP Popover with Calendar + TimeField, draft-commit shared with DateRangePicker); src/date/DateTimePicker.test.tsx; tests/a11y/apg/surf/date-time-picker.apg.spec.ts; export from src/date/index.ts
  - Acceptance: DateTimePicker exported from aura-glass/date; test commits ZonedDateTime only on Apply; APG spec asserts dialog label + Escape focus return

#### `next-fin/f-ai-sdk` — REQ-FIN-85, AC-FIN-85; REQ-SURF-106
Files: `tests/types/surf/ai-sdk-compat.test-d.ts`, `scripts/surf/gen-ai-fixtures.mjs`, `registry/items/ai-sdk-adapter/**`; delete `ci/surf/ai-sdk/**`.
Notes: Single owner of moving the compat type test and the adapter out of `ci/surf/ai-sdk/`. The route move is SURF-172 and the CI job edit is SURF-195; neither is repeated here. OD-16 decides SDK v6 for approval states (an additive contract PR if v6). Until then, pin the current major and record it in the fixture.

- **REQ-SURF-106** — AI types / SDK compat / generated fixtures (needs: agent)
  - Steps: Move ci/surf/ai-sdk/ai-sdk-compat.test-d.ts → tests/types/surf/ai-sdk-compat.test-d.ts and replace tsd with a type-level assert (e.g. `const _: AgMessage[] = sdk;` plus `satisfies`), or add exact-pinned tsd through a PLAT contract PR; delete ci/surf/ai-sdk/ai-sdk-adapter and ci/surf/ai-sdk/ai-workspace once registry copies are canonical; move ai-workspace-route.test.ts under registry/blocks/ai-workspace/__tests__; update surf:test:ai-sdk to run `npx tsc -p tsconfig.json --noEmit` and `npx jest tests/types/surf registry/items/ai-sdk-adapter registry/blocks/ai-workspace`; change ui-messages.source.ts to `satisfies UIMessage[]` (now importable in tests/ or scripts/) and make gen-ai-fixtures.mjs typecheck it against the pinned `ai` types; decide on the SDK major (v6 for approval states) and record the version in the fixture; add assertion useChat().status assignable to AgChatStatus
  - Acceptance: `npx tsc --noEmit` on repo passes with tests/types/surf/ai-sdk-compat.test-d.ts included; `rg -l "from 'ai'" ci/surf` returns nothing; gen-ai-fixtures --check fails if source.ts no longer satisfies UIMessage[]; surf:test:ai-sdk green on a next pipeline

#### `next-fin/f-ai-thread` — REQ-FIN-85, AC-FIN-85; REQ-SURF-107, 108, 109, 110
Files: `src/ai/thread/**`, `tests/e2e/surf/ai/thread-*.spec.ts`, `tests/a11y/apg/surf/thread.apg.spec.ts`.
Notes: The REQ-FIN-110 transfer (AI live regions and AI meta selectors) is done in this group and the next two (§6.1).

- **REQ-SURF-107** — Thread compound (Root/Viewport/Items/Empty/JumpToLatest) (needs: agent)
  - Steps: Make Thread.Viewport the role=log element (move the log attrs, ref, onScroll and sentinels into ThreadViewport via context) and have Root render <Thread.Viewport><Thread.Items/></Thread.Viewport> by default; in virtualized mode render items through the same ThreadItems renderer (pass renderers/renderText/onApprovalResponse); ai.css: [data-ag-part=log]{overflow-y:auto; min-block-size:0; block-size:100%}; extend Thread.test.tsx: custom Viewport composition has exactly one role=log, and RenderersProvider renderer is applied at 150 messages
  - Acceptance: Thread.test.tsx: <Thread.Root><Thread.Viewport><Thread.Items/></Thread.Viewport></Thread.Root> yields 1 [role=log]; renderer 'data-x' output present with 150 messages
- **REQ-SURF-108** — pin / follow / JumpToLatest (needs: ci)
  - Steps: useThreadScroll: observe the content wrapper (ResizeObserver on the items container, or a MutationObserver plus one rAF) and assign scrollTop = scrollHeight once per frame while pinned; jump: behavior = motion==='full' ? 'smooth' : 'auto' via usePreference('motion'); remove the aria-label from the pill (visible text is the name); fix Thread.test.tsx 'user send re-pins' to unpin first and then assert isPinned()===true and no pill; rewrite thread-scroll.spec.ts against [role=log] using the replay fixture at 50 tokens/frame for 300 frames (drift ≤1px), a 400px scroll-up (scrollTop stable ±1px), and failing when the subject is absent
  - Acceptance: e2e on 3 engines: drift ≤1px after 300 frames; scroll-up 400px stable ±1; jsdom test: growing last message text while pinned triggers scrollTop==scrollHeight
- **REQ-SURF-109** — virtualization / onReachTop / prepend (needs: ci)
  - Steps: Add a getScrollElement/scrollElementRef prop to VirtualList so Thread passes the log element (no inner overflow); pass anchor='start' and let useThreadScroll drive scrollTop; implement prepend preservation (record the first visible key's offset before commit and restore it in useLayoutEffect); fire onReachTop on the isIntersecting false→true edge only; move or rename the fixture script to scripts/surf/gen-ai-thread-fixture.mjs and update ci/surf.gitlab-ci.yml surf:build:ai-fixtures; harden thread-virtual.spec.ts (DOM articles ≤ visible+12 with 2,000 messages, first visible moves ≤2px while the last streams, prepend k keeps offset ±1px)
  - Acceptance: thread-virtual e2e green on 3 engines; jsdom: only one element with computed overflow auto inside Thread; onReachTop called exactly once per sentinel entry
- **REQ-SURF-110** — imperative handle (needs: agent)
  - Steps: Pass scrollToKey only when virtualized; add id={`ag-msg-${message.id}`} to MessageRoot <article>; compute scrollTop with getBoundingClientRect deltas, not offsetTop; honour block (start/center/end); extend the test: non-virtualized scrollToMessage('m-2') sets log.scrollTop to the expected value (mock layout), and virtualized calls VirtualList.scrollToKey
  - Acceptance: Thread.test.tsx asserts scrollTop changed for non-virtualized and scrollToKey spy called for virtualized; scrollIntoView spy 0

#### `next-fin/f-ai-message` — REQ-FIN-85, AC-FIN-85; REQ-SURF-111, 112, 113, 114, 115
Files: `src/ai/message/**`, `tests/a11y/apg/surf/message.apg.spec.ts`, `tests/perf/browser/surf/ai-streaming.spec.ts`.
Notes: Allowed live regions only, and file links reject `javascript:`.

- **REQ-SURF-111** — Message compound (needs: agent)
  - Steps: Add Root: MessageRoot to the Object.assign (and to the MessageComponent type); strengthen Message.test.tsx: createdAt 2026-05-12T09:14:03Z with timeZone 'Pacific/Kiritimati' (UTC+14) → heading 'Assistant, 11:14 PM'; check Message.Root exists
  - Acceptance: Message.Root === MessageRoot; heading text exact-equals expected string for two zones
- **REQ-SURF-112** — Message.Parts rendering/precedence (needs: agent)
  - Steps: markText: for /\[(\d+)\]/ use Number(n) as the index into sources; for /\[\^([^\]]+)\]/ use sourceIndex.get(id); change AgTextRenderer to (text,{streaming,messageId}); route dynamic-tool to the 'tool-*' prefix; drop '*' or document it; emit SourceList at the end when lastTextIdx===-1; ai.css [data-ag-part=text-part]{white-space:pre-wrap}; MessageParts.test.tsx: it.each over every fixture message → snapshot of data-ag-part tree, exactly one console.warn for mystery-part, citation [2]→Source 2
  - Acceptance: snapshot file with ≥20 fixture entries; test '[2] maps to sources[1]' passes; renderText receives messageId
- **REQ-SURF-113** — StreamingText coalescing/announce (needs: agent)
  - Steps: Implement a per-instance external store flushed in one rAF (useSyncExternalStore) so 1,000 setText calls in one frame make 1 commit; truncate the complete announcement to 600 chars plus the suffix; batch sentences with a ≥1,000 ms gate (performance.now; the purity gate bans setTimeout, so use rAF timestamps); set aria-busy={streaming} on the content wrapper; add status-transition announcements (submitted→'Sending' polite, error assertive) in Thread or Composer status effect; create StreamingText.test.tsx with React Profiler commit count and an announcer double
  - Acceptance: StreamingText.test.tsx: Profiler onRender count ===1 for 1,000 same-frame updates; announcer called once with ≤600+suffix chars; aria-busy toggles
- **REQ-SURF-114** — Message.Actions (needs: agent)
  - Steps: ai.css: [data-ag-part=message] [data-ag-part=actions]{opacity:0} shown on :hover, :focus-within, @media (pointer:coarse), (hover:none) (opacity only, so it stays in the a11y tree); container-type:inline-size on [data-ag-part=thread]; @container (max-width:480px){[data-ag-part=message] [data-ag-part=avatar]{display:none} actions order after content}; labels.copy prop; add Message.test.tsx 'actions reachable' (tab order reaches copy/regenerate/feedback) + jest-axe 0 violations
  - Acceptance: Message.test.tsx 'actions reachable' + axe 0; CSS contains the 4 visibility selectors
- **REQ-SURF-115** — file parts / error / aborted (needs: agent)
  - Steps: FilePart: always render <a href={url}> (download attr only for blob:/data:, rel=noopener for http); guard against javascript: URLs (text only); add test cases for http pdf link without download and javascript: rejected
  - Acceptance: test: http pdf renders a[href^=https]:not([download]); blob pdf renders a[download]

#### `next-fin/f-ai-composer` — REQ-FIN-85, AC-FIN-85; REQ-SURF-116, 117, 118, 119
Files: `src/ai/composer/**`, `tests/e2e/surf/ai/composer-*.spec.ts`, `tests/a11y/apg/surf/composer.apg.spec.ts`.

- **REQ-SURF-116** — Composer anatomy/props (needs: agent)
  - Steps: Wrap in Base UI Field.Root/Field.Label/Field.Control (or a CMP TextField primitive) with a visually hidden <label htmlFor>; rename the part to 'textarea' (and the meta parts) or fix the CSS selectors; drive max-block-size from calc(var(--_ag-composer-max-rows)*1lh)
  - Acceptance: getByLabelText('Message') resolves through a <label>; computed style of textarea has field-sizing content in a CSS-parsing test or visual spec
- **REQ-SURF-117** — Composer keyboard/IME/stop (needs: agent)
  - Steps: After onSubmit, clear the internal value in uncontrolled mode (setValue('')) and keep focus in the textarea; add tests: isComposing:true Enter no submit, Ctrl+Enter submits with submitOnEnter=false, status=streaming Enter does not call onSubmit, status=error keeps text, activeElement===textarea after submit; harden composer-ime e2e (fail if subject missing)
  - Acceptance: Composer.test.tsx has the 5 new cases green; uncontrolled textarea value '' after Enter
- **REQ-SURF-118** — attachments (needs: agent)
  - Steps: Compute accepted/rejected outside setState (read current files via ref), then setFiles(next) and fire callbacks once; key chips by a generated id; track dragenter/leave depth; add a StrictMode test asserting onAttachmentReject is called once per rejected file; harden composer-dropzone e2e
  - Acceptance: <React.StrictMode> test: onReject calledTimes(2) for 2 rejects; duplicate-name files both listed and individually removable
- **REQ-SURF-119** — grow / narrow / counter / keyboard (needs: agent)
  - Steps: Add a ComposerMenu (CMP Menu) rendered as data-ag-part=composer-menu holding the secondary actions below 480px; change the CSS to hide only [data-ag-part=action] and keep submit/stop; remove aria-live from the counter <output> (announcer only); add a measured-height fallback when CSS.supports('field-sizing','content') is false; add a single visualViewport resize listener fallback setting --_ag-ai-keyboard-inset; have Composer write --_ag-ai-composer-block on the Thread via ResizeObserver so growth doesn't unpin; tests: counter announcer called exactly twice across 0→100%, Submit visible at 400px container in composer-grow e2e
  - Acceptance: composer-grow e2e at 390px: Submit button visible and clickable; counter test: announce calledTimes(2); no aria-live on counter

#### `next-fin/f-ai-tools` — REQ-FIN-85, AC-FIN-85; REQ-SURF-120, 121, 122, 123, 124, 125
Files: `src/ai/{tool,reasoning,agent,sources}/**`, `tests/a11y/apg/surf/{tool-call,citation}.apg.spec.ts`, `tests/e2e/surf/ai/citation-preview.spec.ts`.

- **REQ-SURF-120** — ToolCall (needs: agent)
  - Steps: Add an effect that opens on transition into needs-approval/failed unless the user toggled; use Base UI Collapsible (keeps the panel id mounted/hidden) or always render the content with hidden; map per-state icons (queued/running/needs-approval/succeeded/failed/denied); replace role=alert with plain text and let the announcer speak the failure once; ToolCall.test.tsx: rerender from input-streaming to approval-requested → expanded and Approve visible
  - Acceptance: test 'opens on transition to needs-approval' green; rg 'role="alert"' src/ai/tool returns 0
- **REQ-SURF-121** — ToolCall.Approval (needs: agent)
  - Steps: Reset responded when part.state/approval.id changes; use the CMP TextField for the reason; add a test where the state goes back to approval-requested with a new approval id and the buttons are re-enabled
  - Acceptance: ToolCall.test.tsx 'approval resets on new approval id' green
- **REQ-SURF-122** — Reasoning (needs: agent)
  - Steps: Fix the test: start with defaultOpen streaming, user closes then reopens (toggle) during streaming, then done → still expanded; keep the panel mounted (hidden) or use Base UI Collapsible; add a test for the performance.now path (mock performance.now 0→3456 → 'Thought for 3.5 s')
  - Acceptance: Reasoning.test.tsx: toggled-open-during-stream stays aria-expanded=true after done; perf-mock duration label exact
- **REQ-SURF-123** — AgentSteps (needs: agent)
  - Steps: Render AiIcon per state in step-icon (server-safe SVG); ai.css: [data-ag-part=step][data-state=running] [data-ag-part=step-icon]::after animated atom with @media (prefers-reduced-motion) / [data-ag-motion!=full] static; extend AgentSteps.test.tsx to assert an svg per step
  - Acceptance: renderToString contains 3 step svgs; CSS includes reduced-motion rule for step running atom
- **REQ-SURF-124** — SourceList (needs: agent)
  - Steps: Use `s.title || hostname(s.url) || s.url`; scope the registry by a React context provided by Thread/Message rather than a module-global Map; add a test where a source without title or with an invalid URL shows the raw url text
  - Acceptance: test: source {url:'mailto:x'} with no title renders text 'mailto:x'
- **REQ-SURF-125** — Citation (needs: agent)
  - Steps: Re-implement on Base UI PreviewCard (Trigger delay=300, Positioner collisionPadding=8, Portal container=usePortalContainer('overlay')) with useLayer({kind:'preview-card'}) for Escape; remove role=dialog and the local keydown; add a snippet field to the source type (or from providerMetadata); add Citation.test.tsx cases for the 300ms hover (fake rAF/AbortSignal), Escape closing, and Enter→SourceList item focused; harden the citation-preview e2e (WebKit iOS tap opens the list and focuses #ag-src-…)
  - Acceptance: Citation.test.tsx 4 new cases green; no [role=dialog|tooltip] under citation-preview; e2e tap focuses source item

#### `next-fin/f-ai-meter-layout` — REQ-FIN-85, AC-FIN-85; REQ-SURF-126, 127, 128
Files: `src/ai/{usage,error}/**`, `src/ai/ai.css`, `tests/visual/surf/ai/ai-workspace.visual.spec.ts`.
Notes: CSS sweep (`ai.css`). Merge after #340.

- **REQ-SURF-126** — UsageMeter (needs: agent)
  - Steps: Replace the hand-rolled div with CMP Meter from src/components/meter (Meter.client.tsx). Meter is a client module, so either keep UsageMeter server-safe by having CMP expose a server-renderable Meter markup part, or document the client boundary. Pass value=used, max=contextWindow and a level→variant mapping for warning/critical. Make format='full' actually differ from 'compact' (full = standard notation, compact = notation:'compact'); today both use compact notation. Add tests: full vs compact output for 1234567, de-DE locale, costUsd 0.12345 → '$0.1235', and 'critical' text present at 95%.
  - Acceptance: rg "components/meter" src/ai/usage/UsageMeter.tsx returns 1 hit; UsageMeter.test.tsx asserts format='full' renders '1,234,567' and compact renders '1.2M'; renderToString still passes
- **REQ-SURF-127** — ProviderErrorState (needs: agent)
  - Steps: Use CMP Button (src/components/button) for Retry. Clear the interval once remaining hits 0. Keep the countdown text live in a way that does not add an aria-live region (REQ-SURF-129). Add tests: each kind's default title matches the copy table exactly, not just length>3; onRetry is not called while disabled; the interval is cleared at 0 (jest.getTimerCount()===0).
  - Acceptance: rg "components/button" src/ai/error/ProviderErrorState.tsx has a hit; test asserts per-kind exact titles and getTimerCount()===0 after the countdown
- **REQ-SURF-128** — AI layout/container queries/scroll padding (needs: ci)
  - Steps: Add container-type:inline-size and a container-name to [data-ag-part=thread]. In Composer.tsx add a ResizeObserver on the composer root that writes --_ag-ai-composer-block onto the thread section and --ag-scroll-padding-bottom (composer block + pill height) onto the scroll viewport. Centre the JumpToLatest pill with inline-size:fit-content. Extend ai-workspace.visual.spec.ts with 1440, zoom200 (CSS zoom or deviceScaleFactor), a 32px root font and rtl cases. Replace the early return when no subject is found with test.fail/expect so the test cannot pass vacuously.
  - Acceptance: jsdom test: resizing the composer sets thread style --_ag-ai-composer-block; the visual spec has 5 projects/cases (320,390,1440,zoom200,rtl) and none of them early-return; the remote L6 run is green

#### `next-fin/f-media-element` — REQ-FIN-86, AC-FIN-86; REQ-SURF-130, 131, 133
Files: `src/media/useMediaElement.ts`, `src/media/mediaStore.ts`, `src/media/__tests__/**`.
Notes: Merge after #342, which edits `useMediaElement`/`mediaStore`.

- **REQ-SURF-130** — useMediaElement API + MediaState (needs: agent)
  - Steps: mediaStore.ts: add 'leavepictureinpicture', 'loadeddata', 'playing' and 'canplaythrough' events, plus el.textTracks addEventListener('addtrack'|'removetrack'|'change') on the same AbortSignal. media.test-d.ts: add `// @ts-expect-error` useMediaElement(React.createRef<HTMLDivElement>()). useMediaElement.test.tsx: for every wired event (§4.6), set the element property via defineProperty to a non-default value, dispatch, and assert the field changed (e.g. volume 0.3, playbackRate 2, waiting true then false on 'playing', a buffered range, a textTracks entry).
  - Acceptance: test iterates over the full EVENTS list with non-default values; tsc on tests/types/surf/media.test-d.ts fails if the non-media expect-error is removed
- **REQ-SURF-131** — snapshot throttle + progress frame loop (needs: agent)
  - Steps: Subscribe/unsubscribe subscribeFrame from the IntersectionObserver callback (subscribe only when isIntersecting && !document.hidden && !paused), or pass { element: root } to MAT subscribeFrame so the ticker skips it. Add raf tests: trigger IO isIntersecting=false → the count of rAF registrations stops growing within 1 frame; document hidden → 0 callbacks.
  - Acceptance: useMediaElement.raf.test.tsx: three cases (paused, hidden, offscreen) each assert 0 frame callbacks after 1 frame
- **REQ-SURF-133** — no src/load/AudioContext/fetch; one AbortController (needs: agent)
  - Steps: Pass { once:true, signal } using the store's AbortController (export a getSignal(el) from mediaStore), or remove the listener in the effect cleanup. Change the test so it counts ALL addEventListener calls on the element and asserts every one carries a signal (registrations without a signal === 0), then unmount → all aborted. Also add a sampleTone=true variant.
  - Acceptance: test with sampleTone:true asserts unsignalled registrations === 0; purity gate passes in L1

#### `next-fin/f-media-controls` — REQ-FIN-86, AC-FIN-86; REQ-SURF-134, 135, 136, 137, 138
Files: `src/media/{MediaControls,MediaScrubber}/**`, `tests/e2e/surf/media/{controls-container,scrubber-drag,target-size}.spec.ts`, `tests/a11y/apg/surf/media-controls.apg.spec.ts`.
Notes: Merge after #347, which converts the same parts away from `forwardRef`.

- **REQ-SURF-134** — MediaControls parts + controlled/headless (needs: agent)
  - Steps: Implement toggleCaptions. With media: find the chosen captions|subtitles TextTrack on the element (expose the element ref through MediaHandle or add handle.setTextTrackMode(id, mode)) and flip showing/disabled. Controlled: add an onCaptionsChange prop. Wire refraction through to the material data attribute. Add tests: Captions click flips track.mode; the C shortcut does the same.
  - Acceptance: MediaControls test with a jsdom TextTrack stub: click Captions → track.mode==='showing', second click → 'disabled'
- **REQ-SURF-135** — Toolbar roving + responsive layout (needs: agent)
  - Steps: Render parts through CMP Toolbar.Button/Toolbar.Item (src/components/toolbar) so roving tabindex works. Mark Scrubber/Volume as toolbar items that keep their own arrows. Add container-type:inline-size; container-name:ag-media-controls to a wrapper around the toolbar root. Below 480px swap Volume → Mute, move Rate/PiP into a CMP Menu 'More' (src/components/menu), and show elapsed time only. Below 320px show Play + Scrubber only. APG spec: assert exactly one tabindex=0, ArrowRight/End/Home move focus, Tab exits. controls-container.spec.ts: set widths 320/480 and assert visible parts.
  - Acceptance: apg spec asserts document.activeElement changes on ArrowRight and querySelectorAll('[tabindex="0"]') within the toolbar === 1; container spec at 400px shows media-mute plus a 'More' menu trigger and hides media-volume
- **REQ-SURF-136** — MediaScrubber (needs: agent)
  - Steps: Coalesce onValueChange through requestAnimationFrame (≤1 seek/frame). Gate ,/. on a `paused` prop. Set data-dragging on the thumb during drag; CSS gives the thumb transient glass only under [data-dragging]. Render the tooltip above the thumb at (pointer:coarse) while dragging. Make Volume use CMP Slider directly with percentage valuetext ('50%'). Rewrite scrubber-drag.spec.ts: 300px drag over 30 steps, count onSeek via a story spy → ≤30 seeks and exactly 1 commit.
  - Acceptance: jest: 10 pointermoves inside one frame → 1 onValueChange; e2e asserts seeks<=30 && commits===1; Volume aria-valuetext matches /%$/
- **REQ-SURF-137** — Shortcuts scoped to Root (needs: agent)
  - Steps: Bind a keydown listener on shortcutTarget (AbortController, element only, never window/document) that applies only when shortcutTarget.contains(document.activeElement). Implement C (captions) and </> with controlled callbacks (onRateChange). Test F, C, < and >; test that keys on shortcutTarget act; spy on window/document addEventListener and assert no keydown registration.
  - Acceptance: shortcuts test covers all 9 keys plus shortcutTarget, and asserts window.addEventListener was not called with 'keydown'
- **REQ-SURF-138** — PlayButton/Time/Captions/target sizes (needs: agent)
  - Steps: PlayButton: constant aria-label 'Play' + aria-pressed, icons from src/icons (CMP Icon). Same for Mute/PiP/Fullscreen/NowPlaying actions. Time: compute aria-hidden from Root context (register Scrubber presence). Captions: CMP Menu listing tracks when >1, toggle when exactly 1. Create tests/e2e/surf/media/target-size.spec.ts (≥44×44 coarse, ≥32×32 fine). Add jsdom TextTrack stub cases 0/1/2 and remove the seed bail-out from the a11y test.
  - Acceptance: jest: PlayButton aria-label==='Play' in both states; 2 tracks → menu trigger rendered; e2e target-size spec exists and asserts boundingBox sizes

#### `next-fin/f-media-nowplaying-waveform` — REQ-FIN-86, AC-FIN-86; REQ-SURF-139, 140
Files: `src/media/{NowPlayingBar,Waveform}/**`, `src/media/media.css`.
Notes: Waveform/WaveformLevel stay out of the `./media` barrel until the contract-v1.2 additive PR (OD-16, 5.1 entry). FIN-F drafts that PR text.

- **REQ-SURF-139** — NowPlayingBar (needs: agent)
  - Steps: Default children render Expand only when expandedId is set. When `progress` is controlled, write --_ag-media-progress (4 decimals) on the root via a ref effect. Implement sampleTone: sample Artwork <img> once per src via toneCache and write data-ag-media-tone/--_ag-media-luma. Add a `fixed` prop → data-ag-now-playing-fixed. For variant='clear' declare data-ag-backdrop='media'. Tests: default render does not throw; controlled progress 0.4 → style var '0.4000'; e2e at 320/360/600 asserts single-row vs play+title only.
  - Acceptance: jest: render(<NowPlayingBar.Root playing={false}/>) does not throw; progress=0.4 sets --_ag-media-progress=0.4000; e2e checks 3 widths
- **REQ-SURF-140** — Waveform (5.1) (needs: agent)
  - Steps: Split: Waveform.tsx is a server module (no 'use client', no hooks) rendering peaks only. Move level mode into WaveformLevel.tsx ('use client'), with motion read there and the transform on an unclipped bar. Add media.css rules: @media (forced-colors: active) fill CanvasText/GrayText, plus a transform transition var(--ag-duration-micro) set to 0s under [data-ag-motion=calm|none]. Add a toMatchSnapshot on d for the peaks-voice fixture and a renderToString test (@jest-environment node). Keep it out of the ./media barrel until the 5.1 contract PR.
  - Acceptance: renderToString(<Waveform peaks label/>) works under the node env; WaveformLevel level=0.6 renders a visible bar with scaleY(0.6); snapshot committed

#### `next-fin/f-media-imageviewer` — REQ-FIN-86, AC-FIN-86; REQ-SURF-141, 142, 143, 144, 145
Files: `src/media/ImageViewer/**`, `tests/a11y/apg/surf/image-viewer.apg.spec.ts`.
Notes: Includes the REQ-FIN-07 transfer: ImageViewer registers with LayerStack, with one Escape owner and one portal.

- **REQ-SURF-141** — ImageViewer parts/props (needs: agent)
  - Steps: Add ImageViewer.test.tsx cases: controlled value + onValueChange(id) on ArrowRight; defaultOpen renders the popup; loop=true wraps End→next→first; Stage data-state zoomed|fit. Add a type test (tests/types/surf/media.test-d.ts) asserting `alt` is required on ImageViewerItem.
  - Acceptance: 4 new jest cases plus @ts-expect-error for an item without alt
- **REQ-SURF-142** — Popup dialog/layer/focus/keys (needs: agent)
  - Steps: Remove the outer createPortal and let CMP Dialog.Portal (overlay root) portal once. Move focus to Close only on the open transition. Restore focus to the Trigger ref on close (finalFocus). Use aria-labelledby pointing at the caption id or a visually-hidden alt span. Let one of Dialog/useLayer own Escape (LayerStack top-only). Rewrite the APG spec: assert focus on Close after open, ArrowRight leaves focus on Close? (no: focus stays put), Escape closes and focus returns to the trigger, the background has inert.
  - Acceptance: jest: after ArrowRight, document.activeElement is not reset; after close, activeElement===trigger; exactly 1 portal node; APG spec has no early returns
- **REQ-SURF-143** — id-resolved navigation (needs: agent)
  - Steps: In Trigger, when the id is not in items, do nothing and emit a dev warning; do not open index 0. Add a test: filter out p7, click the p7 trigger → popup not opened.
  - Acceptance: jest: trigger for a missing id → no [data-ag-part=image-viewer-popup] in the DOM
- **REQ-SURF-144** — zoom/pan/pinch/touch-action (needs: agent)
  - Steps: Implement pinch: with 2 pointers, scale by the ratio of distances (clamped 1–8) and reset pan when zoom===1. Add jest tests: wheel without ctrl at 1× → defaultPrevented false; wheel with ctrl → zoomed and prevented; pointer pan only when zoomed; 2-pointer pinch increases zoom. Add pointer/wheel scripts to image-viewer.apg.spec.ts.
  - Acceptance: jest cases for wheel-not-prevented at 1× and pinch→data-state=zoomed; e2e wheel script
- **REQ-SURF-145** — Counter/chrome/scrim/≤3 img/Inspector/reduced motion (needs: agent)
  - Steps: Put data-ag-backdrop='media' and container-type:inline-size on the Stage/popup. Sample the current <img> after decode() via toneCache and write data-ag-media-tone on Stage. Apply MAT chrome material (clear) to Toolbar/Caption. Add the Inspector to the layout (≥768 side 320px, otherwise bottom ≤50dvh) with a working container. Reduced motion: opacity-only transitions and no zoom transition. Create tests/e2e/surf/media/image-viewer-chrome.spec.ts (computed scrim background === --ag-scrim-media, backdrop-filter none; inspector width 320 at 1440, bottom at 390).
  - Acceptance: chrome spec exists and asserts computed styles at 390/1440; jest asserts Stage has data-ag-backdrop=media

#### `next-fin/f-media-carousel` — REQ-FIN-86, AC-FIN-86; REQ-SURF-146, 147, 148, 149, 150
Files: `src/media/CarouselRail/**`, `tests/a11y/apg/surf/carousel-rail.apg.spec.ts`.

- **REQ-SURF-146** — CarouselRail parts/props (needs: agent)
  - Steps: Accept children in Root (default layout when absent) so the parts compose. Add `as: 'tabs'|'buttons'` on Indicators (keep indicatorsAs as an alias or remove it). Add container-type:inline-size on .ag-carousel so the 480px rule applies. Tests: compositional children render, and numeric slidesPerView sets --_ag-slides-per-view.
  - Acceptance: jest renders <CarouselRail.Root><CarouselRail.Viewport/>…<CarouselRail.Indicators as="buttons"/></CarouselRail.Root> successfully
- **REQ-SURF-147** — APG carousel semantics (needs: agent)
  - Steps: After step() in Indicators onKeyDown, focus the new active tab (refs array); add Home/End. Add carousel-rail to the L5 lane path glob. Rewrite carousel-rail.apg.spec.ts: both variants, axe 0 violations, ArrowRight moves focus and aria-selected, no early return.
  - Acceptance: jest: ArrowRight on tab 1 → document.activeElement is tab 2; fragments/lanes/surf.ts L5 glob includes carousel-rail; APG spec runs axe for both variants
- **REQ-SURF-148** — Viewport scroll-snap + IO index + Prev/Next (needs: agent)
  - Steps: Route Indicators clicks through a scrollToIndex helper. Use behavior: reducedMotion ? 'auto' : 'smooth'. Read the latest index via a ref inside the IO callback. Add an APG/e2e swipe (touchscreen or a scrollLeft set) → onIndexChange.
  - Acceptance: jest: click indicator 3 → viewport.scrollTo called with slide 3 offsetLeft; e2e swipe spec asserts onIndexChange
- **REQ-SURF-149** — Autoplay gated loop (needs: agent)
  - Steps: Resolve the gate via closest('[data-ag-continuous="on"]') (or MAT helper) plus the motion==='full' check. Add document.visibilitychange pause. The toggle reflects autoplayActive||gate state ('Start …', aria-pressed=false when the gate is off). Fix the test expectation. Add a test wrapping the provider with allowContinuous+motion full → advanceTimers(5000) → onIndexChange(1). Create tests/e2e/surf/motion/carousel-autoplay.spec.ts.
  - Acceptance: jest: prop only → no rotation and label 'Start automatic slide show'; prop+gate → rotation; the L9 spec file exists
- **REQ-SURF-150** — Carousel materials + no backdrop-filter (needs: agent)
  - Steps: Apply MAT material to slides (content-raised) and to Prev/Next/Indicators (chrome thin; clear when overMedia, else regular) via the MAT material API/data attributes. Set data-ag-backdrop='media' on the root when overMedia. Create tests/e2e/surf/media/blur-budget.spec.ts counting backdrop-filter surfaces within the budget, and confirm auraglass/no-optics-outside-material passes on src/media in L1.
  - Acceptance: jest: overMedia root has data-ag-backdrop=media and nav buttons carry the clear material marker; blur-budget spec exists and is in the L5 glob

#### `next-fin/f-media-sampling` — REQ-FIN-86, AC-FIN-86; REQ-SURF-151, 152, 153, 154
Files: `src/media/sampling/**` → `src/backdrops/` (REQ-MAT-64 relocation transfer), `scripts/surf/calibrate-media-tone.mjs`, `tests/e2e/surf/media/sampling-engines.spec.ts`, `tests/perf/browser/surf/media-sampling.spec.ts`.
Notes: `scene-stats.json` and calibration come only from the real script run in CI. When the relocation lands, MAT's expiring exemption row is removed (tell FIN-D).

- **REQ-SURF-151** (needs: ci)
  - Steps: Rewrite tests/e2e/surf/media/sampling-engines.spec.ts. Load certification/scenes flat-white and flat-black (plus the other 6 QUAL scene ids) as <img crossOrigin=anonymous> on a harness page, call the real sampler via a story or test page that exposes sampleOwnedPixels, and assert flat-white mean>=0.999 and flat-black mean<=0.001 on chromium, firefox and webkit. Delete every early return that only warns 'pending'. Register a Playwright project surf:cert-media-sampling with 3 browser projects in the merged config (PLAT playwright.config.ts fragment merge) and run it remotely.
  - Acceptance: The remote L8 job for surf:cert-media-sampling shows 3 engines x 8 scenes passed and 0 skipped. grep 'pending' in sampling-engines.spec.ts returns 0.
- **REQ-SURF-152** (needs: ci)
  - Steps: Implement scripts/surf/calibrate-media-tone.mjs for real: launch Playwright on a remote runner, serve certification/scenes, run sampleOwnedPixels in-page per scene, write .artifacts/surf/<job>/media-tone-calibration.json with measured stats and derived TONE_* values, then regenerate src/media/sampling/__fixtures__/scene-stats.json from that artifact (add a --check mode that diffs the two). Adjust the TONE_* constants only if the measured data requires it.
  - Acceptance: The CI artifact media-tone-calibration.json exists with 8 numeric scene entries and no 'pending' key. scene-stats.json equals the artifact's per-scene stats (script --check exits 0). classifyTone.test passes on the measured values.
- **REQ-SURF-153** (needs: agent)
  - Steps: 1. Add a client island inside Backdrop for preset photo/video (e.g. extend BackdropTone) that, when no explicit tone prop is given, calls getOrSampleTone on the layer <img> after decode(), or on the <video> poster (via an Image of poster) else at first loadeddata. It writes only data-ag-media-tone/--_ag-media-luma on .ag-backdrop.
2. Wire NowPlayingBar.Root sampleTone into useMediaElement({sampleTone}) or into the Artwork img sampler.
3. Add sampling to ImageViewer.Stage for the active image.
4. In useMediaElement, prefer poster for video.
5. Wrap sampleOwnedPixels in performance.mark/measure('ag:sample').
6. Rewrite toneCache.test to render a real <video> via the hook, dispatch 100 timeupdate + 10 seeked, and assert the getImageData spy was called 1 time.
7. Add a BackdropTone.test.tsx MutationObserver assertion that only the two names change.
8. Fix media-sampling.spec.ts to read performance.getEntriesByName('ag:sample') at 4x CPU throttle, assert <=4ms, and register it on L10.
  - Acceptance: Jest: the Backdrop photo with a mocked decode sets data-ag-media-tone on .ag-backdrop. The MutationObserver records only data-ag-media-tone and style(--_ag-media-luma). 100 timeupdate + 10 seeked produce 1 getImageData. Remote L10: max ag:sample measure <=4ms.
- **REQ-SURF-154** (needs: ci)
  - Steps: 1. Add small-chrome CSS in src/media/media.css selecting [data-ag-backdrop=media][data-ag-media-tone=light|dark] that only flips glyph colour polarity (no floor changes).
2. Delete or import presets/media.css consistently.
3. Create the L6 spec at the registered path (or fix the registration to tests/visual/surf/media/clear-over-media.spec.ts). It renders each of the 8 scenes twice (tone attribute forced on and off) and computes the worst-case text contrast per scene via QUAL's OCR/contrast helper, asserting contrast(on) >= contrast(off).
4. Add @ts-expect-error cases proving useMediaElement/sampleTone reject arbitrary Element/selector inputs.
  - Acceptance: The remote L6 run reports 8 scenes x 2 runs with per-scene contrast(on) >= contrast(off) and 0 failures. tsc on tests/types/surf/media.test-d.ts passes with the new expect-error lines.

#### `next-fin/f-backdrops` — REQ-FIN-86, AC-FIN-86; REQ-SURF-155, 156, 157, 158, 159, 160
Files: `src/backdrops/**`, `tests/e2e/surf/backdrops/**`, `tests/perf/browser/surf/backdrops-presets.spec.ts`.
Notes: CSS sweep (`backdrops.css`, presets). Merge after #340.

- **REQ-SURF-155** (needs: agent)
  - Steps: 1. Destructure src, srcSet, sizes, poster, crossOrigin out of props before ...rest in src/backdrops/Backdrop.tsx.
2. Add palette CSS (src/backdrops/presets/palettes.css, or inside aurora.css/mesh.css) defining --_ag-aurora-a/b/c and the mesh colours per [data-ag-palette=aurora|prism|ocean|ember|mono] from MAT S-03 colour tokens, and import it from backdrops.css.
3. Add an SSR test asserting the root div has no src/poster attribute.
4. Add a test that 5 palettes yield distinct computed custom properties (CSS parse test).
  - Acceptance: renderToString(<Backdrop preset='photo' src='/x.jpg'/>) has no match for /<div[^>]* src=/. A CSS test finds 5 [data-ag-palette=...] rule blocks.
- **REQ-SURF-156** (needs: agent)
  - Steps: Add a stylelint config (PLAT-owned root config or a SURF fragment) with declaration-property-disallowed-list {filter, backdrop-filter} scoped to src/backdrops/presets/*.css, registered on L1. Alternatively add a jest test tests/backdrops/no-filter.test.ts that greps presets/*.css for /(^|[^-])filter\s*:/ and expects 0.
  - Acceptance: Running the lint/test on a temp copy with 'filter: blur(1px)' added to aurora.css fails. The real tree passes.
- **REQ-SURF-157** (needs: ci)
  - Steps: 1. In BackdropTone, render the button only while `playing || pausedByUser`, and keep the accessible name 'Pause background video' with aria-pressed reflecting the paused state.
2. Create tests/e2e/surf/motion/backdrop-drift.spec.ts (or fix the lane path) that: loads the video Backdrop story; asserts video.paused===true with the poster shown after 2s by default; asserts that with continuous on, scrolling it offscreen pauses it within 250ms; asserts emulateMedia reducedMotion shows the poster; asserts clicking backdrop-pause toggles aria-pressed and paused.
3. Remove the early returns from motion.spec.ts.
  - Acceptance: The remote L9 run passes 4 assertions (default paused, offscreen<=250ms, reduced-motion poster, toggle) with 0 'pending' warnings. A jest test shows no [data-ag-part=backdrop-pause] when not playing.
- **REQ-SURF-158** (needs: agent)
  - Steps: In presets/aurora.css and mesh.css, add [data-ag-backdrop=light] and [data-ag-backdrop=dark] colour sets, plus [data-ag-backdrop=auto] using light-dark(<light>, <dark>) for the base and blob colours (with color-scheme: light dark on the root). Add a CSS test asserting light-dark( appears under the auto selector.
  - Acceptance: rg -c 'light-dark\(' src/backdrops/presets/{aurora,mesh}.css >=1 each. The SSR test still passes.
- **REQ-SURF-159** (needs: ci)
  - Steps: 1. Add a client observer (in BackdropTone or a new BackdropMotion island, rendered when motion='drift') that sets data-ag-offscreen via IntersectionObserver and data-ag-hidden on visibilitychange, plus CSS that pauses the animation for both.
2. Move the animation assertions to a browser test (tests/e2e/surf/motion/backdrop-drift.spec.ts): document.getAnimations().length===0 per preset by default; with continuous on and motion=drift, exactly 1 animation with animationName 'ag-backdrop-drift'; paused when offscreen or hidden.
3. Record the transform-vs-background-position decision from the L10 measurement.
  - Acceptance: The remote browser test asserts 0 animations for 5 presets and exactly 1 'ag-backdrop-drift' under the gate, with playState 'paused' after scroll-out and visibility hidden.
- **REQ-SURF-160** (needs: agent)
  - Steps: 1. In Backdrop.tsx, set data-ag-backdrop-grain when preset==='grain' || grain.
2. Add an explicit [data-ag-reduced-transparency] / @media (prefers-reduced-transparency: reduce) rule that keeps photo/video visible.
3. Rewrite modes.spec.ts with page.emulateMedia({forcedColors:'active'}): assert the layer has display:none and the root background is Canvas. Under reduced transparency, assert the img/video is visible.
4. Add tests/backdrops/import-boundary.test.ts that greps src/backdrops/** for '.storybook' and 'certification/' and expects 0.
5. After PLAT build, verify dist/backdrops.css resolves both grain assets inside the tarball.
  - Acceptance: Jest: renderToString(<Backdrop preset='grain'/>) contains data-ag-backdrop-grain. The import-boundary test passes. Remote modes.spec passes with 0 pending. The tarball contains dist assets referenced by dist/backdrops.css.

#### `next-fin/f-charts` — REQ-FIN-87, AC-FIN-87; REQ-SURF-161, 162, 163, 164
Files: `src/charts/**`, `tests/e2e/surf/charts/**`.
Notes: `./charts` must be absent on 5.0.x; the entry-eligibility side is REQ-FIN-06 (FIN-A). The doctor hint is a FIN-C seam.

- **REQ-SURF-161** (needs: agent)
  - Steps: 1. Thread yDomain into Line/Area/Bar y-scale extent (use the fixed [min,max] when provided).
2. Implement curves with d3-shape curveLinear/curveMonotoneX/curveStep once the peers are imported (see 162), or an exact monotone-cubic (Fritsch-Carlson).
3. Add pointermove crosshair to ChartTooltip as a 'use client' island and drop 'use client' from Chart.tsx static marks.
4. Add tests: yDomain=[0,100] changes the path y for a known datum; monotone path never exceeds data extent.
  - Acceptance: Chart.test asserts that a yDomain change alters the rendered path d, that a monotone curve stays within the data min/max, and that pointermove shows chart-tooltip.
- **REQ-SURF-162** (needs: agent)
  - Steps: 1. Import d3-scale (scaleLinear/scaleBand) and d3-shape (line/area/arc/curve*) in src/charts/scale.ts and marks.
2. Change peer-isolation.test.ts so d3 imports are allowed only under src/charts/** and banned elsewhere.
3. Add a test that resolving aura-glass/charts with d3 absent (mock require failure) throws a message containing the 'npx aura-glass doctor' hint, and add that check to packages/cli doctor.
4. Mark the d3 externals in the build.
  - Acceptance: rg "from 'd3-" src --glob '!src/charts/**' = 0 and src/charts >=1. peer-isolation.test passes. The doctor test asserts the hint text.
- **REQ-SURF-163** (needs: agent)
  - Steps: 1. Pass titleId to ChartFrame as the figcaption/title id (or read ChartFrame's title id from ctx) so aria-labelledby resolves.
2. Implement a true 150ms trailing debounce for the live region.
3. Unit test: document.getElementById(svg.getAttribute('aria-labelledby')).textContent === title.
4. Rewrite keyboard.spec.ts: Tab focuses the plot once (the next Tab leaves it); ArrowRight x3 produces one polite announcement containing the x value and every series value after 150ms.
  - Acceptance: The jest label-resolution assertion passes. Remote e2e keyboard.spec asserts the tab-stop count is 1 and the live text contains 'Feb' plus both series values.
- **REQ-SURF-164** (needs: agent)
  - Steps: 1. Make scripts/build/generate-exports.mjs (PLAT) omit ga:'5.1' entries when package.json version is 5.0.x, and only include them for next-dist-tag preview builds.
2. Remove ./charts from package.json exports and build/exports.manifest.json for 5.0.
3. Add the test 'no charts in 5.0' to tests/data/exports/surf-entries.test.ts: when the version matches ^5\.0\., expect(Object.keys(pkg.exports)).not.toContain('./charts').
4. Tag every src/charts export with @tier preview JSDoc.
5. Add a delivery.test case that row X-28 stays non-delivered unless the L2 artifact shows Chart <=15KB min+gz with d3 external.
  - Acceptance: node -e "require('./package.json').exports['./charts']" prints undefined on the 5.0 line. The surf-entries 'no charts in 5.0' test passes. The delivery test fails if X-28 is 'delivered' without the artifact.

#### `next-fin/f-three` — REQ-FIN-87, AC-FIN-87; REQ-SURF-165
Files: `tests/capability/entries.test.ts` (entries test only).
Notes: Dropping the three/@react-three peers in `package.json` is a contract PR (Appendix C C-6, OD-16 bundle) that FIN-C applies. FIN-F does not edit `package.json`.

- **REQ-SURF-165** (needs: agent)
  - Steps: 1. Drop the three, @react-three/fiber and @react-three/drei peers (and their peerDependenciesMeta) via a contract/PLAT PR, since 5.0 exports nothing that needs them.
2. QUAL: add packages/qa entries test (or tests/capability/entries.test.ts) that asserts the ./three dist has 0 named exports and that the G-03 report marks ./three as 'pending'.
  - Acceptance: pkg.peerDependencies has no three or @react-three/* keys. The entries test asserts Object.keys(await import('aura-glass/three')).length===0. The G-03 report JSON shows {'./three':'pending'}.

#### `next-fin/f-labs` — REQ-FIN-87, AC-FIN-87; REQ-SURF-166, 167, 168, 169
Files: `packages/labs/**` (contract F02, incl. the REQ-PLAT-12/-15 transfer for `packages/labs/{package.json,PUBLISHING.md}`), `scripts/surf/verify-labs-admission.mjs`, `tests/labs/**`, `tests/perf/browser/surf/labs-spatial-admission.spec.ts`.

- **REQ-SURF-166** (needs: ci)
  - Steps: 1. Add a build (tsdown) script for packages/labs producing dist.
2. Extend tests/labs/package.test.ts to run `npm pack --dry-run --json -w packages/labs` and assert every exports target is present in the file list.
3. Record the @auraglass/labs vs aura-glass-labs decision in contracts/packages.json (PLAT D-23).
  - Acceptance: The package test asserts pack output files include package.json and every exports target. The CI plat:pack artifact contains auraglass-labs-0.x.tgz.
- **REQ-SURF-167** (needs: ci)
  - Steps: 1. In rule (d), also flag VariableStatements whose initializer references document/window, and add an actual `node --input-type=module -e "await import(entry)"` run with globalThis.document undefined that fails on a throw or on registered listeners.
2. Add fixture tests/labs/fixtures/side-effect-var/ to cover it.
3. Make the labs admission job allow_failure:false on release scope.
  - Acceptance: The new fixture exits 1 naming side-effect. A GitLab tag pipeline shows the labs admission job pass and as a needs: dependency of plat:publish:npm.
- **REQ-SURF-168** (needs: agent)
  - Steps: 1. Rewrite the spec against the S-40 mid-tier mobile profile. Use a CDP Tracing/Performance timeline to compute p95 main-thread ms/frame <=4, and LayerTree.layerTreeDidChange to assert a layer delta <=1. Instrument requestAnimationFrame to count calls in a 500ms window after visibilitychange hidden and after scroll-out, expecting 0. Take two reduced-motion screenshots and expect Buffer.equals. Assert no text nodes or focusable controls in the resident. Assert the ledger row has `surface`.
2. Register it on L10.
3. Add an admission rule rejecting residents whose ledger capability matches /webxr|ar preview|360/i.
  - Acceptance: The spec contains the 6 assertions. A synthetic fixture resident that leaks rAF fails. The L10 registration exists in fragments/lanes/surf.ts.
- **REQ-SURF-169** (needs: agent)
  - Steps: 1. Pass --manifest build/exports.manifest.json in the fragments/lanes/surf.ts labs lane path/args.
2. Add a rule: a promoted resident still present when the labs version minor > the promotion minor + 1 fails (store promotedIn in the ledger row).
3. Validate row.demand per REQ-SURF-184 when form includes export.
4. Add fixture tests.
  - Acceptance: The new fixture 'promoted-stale' exits 1 naming promotion. The lane command line includes --manifest.

#### `next-fin/f-registry-lint` — REQ-FIN-88, AC-FIN-88; REQ-SURF-170
Files: `registry/{blocks,items}/**` (SURF entries only), `lint/rules/surf/**`.
Notes: Open FIN-C PR #195 (PLAT-95) also edits SURF `registry-item.json` files and stamps `owner: PLAT` into SURF metas. Ask FIN-C to drop the SURF hunks (ownership). The SURF meta owner stays SURF.

- **REQ-SURF-170** (needs: agent)
  - Steps: 1. In blocks-lint.test.ts, scan every .ts/.tsx in each item dir. Fail on relative imports leaving the item dir, on /#[0-9a-f]{3,8}\b|!important|blur\(|rgba?\(|oklch\(/ outside fixtures, and on any aura-glass import name or sibling registry id not listed in registryDependencies (map exports to registry ids via registry/base/auraglass). Require 'Loading' for async items, and require every source file to be listed in files[].
2. Replace __fixtures__/registry-item.schema.json with the verbatim shadcn v4 registry-item schema.
3. Fix every registry-item.json: complete files[] and registryDependencies; convert cross-item relative imports to registry ids.
4. Add fixtures.ts to the media-* and ai-* items.
  - Acceptance: The strengthened lint passes on the tree and fails on a temp mutation (adding '#fff' or a ../../items import). A script count shows every source file under registry/{blocks,items}/<surf-id>/ appears in its files[].

#### `next-fin/f-registry-blocks` — REQ-FIN-88, AC-FIN-88; REQ-SURF-171
Files: `registry/blocks/{media-viewer,support-inbox,mobile-settings}/**`, `tests/capability/registry/ga-blocks.test.tsx`.
Notes: The QUAL showcase import of fixtures is FIN-G's side of seam SURF → QUAL.

- **REQ-SURF-171** (needs: agent)
  - Steps: 1. media-viewer: add NowPlayingBar.Root bound to the same media handle and a CarouselRail of ITEM_IMAGES.
2. support-inbox: replace the detail list with Thread from aura-glass/ai, apply the FilterBar model to rows (filter TICKETS by status/priority), and append the reply to the thread state on submit.
3. mobile-settings: add a CMP Sheet that opens GlassPreferencesPanel from aura-glass/theme, with 44px controls.
4. Add a root jest moduleNameMapper (PLAT or a SURF jest fragment) mapping '^aura-glass(/.*)?$' to src entries, or register tests/capability/jest.doubles.cjs on L1/L12 and add ai/media/backdrops mappings.
5. Delete every `if (!M) { console.warn(PENDING); return; }` guard.
6. Create tests/capability/registry/ga-blocks.test.tsx rendering all 7 blocks and asserting the required component parts.
7. QUAL: wire showcases to import these fixtures.
  - Acceptance: grep -c PENDING tests/capability/registry/*.tsx = 0. ga-blocks.test asserts data-ag-part for now-playing, carousel-rail, thread (support-inbox), sheet and preferences panel (mobile-settings). The L11 render harness shows 0 console errors and axe 0 for all 7 blocks.

#### `next-fin/f-ai-route` — REQ-FIN-88, AC-FIN-88; REQ-SURF-172
Files: `registry/blocks/ai-workspace/app/api/chat/route.ts`, `registry/blocks/ai-workspace/README.md`, `registry/blocks/ai-workspace/fixtures.ts`, `tests/capability/registry/ai-workspace-route.test.ts`; delete `ci/surf/ai-sdk/ai-workspace/**` and `ci/surf/ai-sdk/ai-workspace-route.test.ts`.
Notes: LLM traffic defaults to **Kiro Prism**: base URL, key and model come from `PRISM_*` env, and when `PRISM_MODEL` is unset the first id from `/v1/models` is used. No direct provider SDK. The route has no auth by itself. Its README must say that a consuming app adds authentication/authorisation before exposure and that the token bucket is per instance. The test uses mocked fetch and makes 0 network calls.

- **REQ-SURF-172** (needs: agent)
  - Steps: 1. Move the route to registry/blocks/ai-workspace/app/api/chat/route.ts and list it in files[].
2. Use `messages: convertToModelMessages(body.messages)`.
3. Read the body via a streamed reader capped at 32768 bytes and return 413 when exceeded.
4. Implement a real token bucket (capacity 20, refill 20/min) and return 429 with a Retry-After header and body {kind:'rate-limit', retryAfterMs}.
5. Add README.md stating the bucket is per-instance.
6. Rewrite fixtures.ts as a support-engineering agent session with source-url citations and a tool part in state 'approval-requested' followed by its approval response.
7. Wire index.tsx/page.tsx through useAuraChat with DefaultChatTransport({api:'/api/chat'}) and a fixture replay transport for stories.
8. Move ci/surf/ai-sdk/ai-workspace-route.test.ts to tests/capability/registry/ai-workspace-route.test.ts with a mocked fetch. Cover the 503, 413 (actual body > 32KB with a lying content-length), 429 retryAfterMs, PRISM_MODEL-unset → /v1/models first id, and no-network cases.
  - Acceptance: tests/capability/registry/ai-workspace-route.test.ts passes under root jest with 0 network calls. The 429 JSON has a numeric retryAfterMs. A 40KB body with content-length:10 returns 413. ci/surf/ai-sdk/ai-workspace/ no longer exists.

#### `next-fin/f-ai-chat-hook` — REQ-FIN-88, AC-FIN-88; REQ-SURF-173
Files: `registry/items/ai-sdk-adapter/**`, `registry/items/{ai-artifact-panel,ai-markdown}/**`.

- **REQ-SURF-173** (needs: agent)
  - Steps: 1. Extend useAuraChat to return messageProps(message) (onRegenerate → chat.regenerate({messageId}), onCopy), toolCallProps(part) (onApprove/onDeny → chat.addToolApprovalResponse or the SDK-5 equivalent), and composerProps.onSubmit passing files (sendMessage({text, files})). Remove the cast by typing AgMessage as a UIMessage supertype.
2. Delete the ci/surf copy.
3. ArtifactPanel: add a `renderCode?: (code, language) => ReactNode` prop, remove the dynamic import, and keep code-surface in registryDependencies.
4. ai-markdown: close unterminated **, *, _ and ` while streaming.
5. Type capabilities as ('vision'|'tools'|'reasoning'|'long-context')[].
6. Rewrite ai-items.test.tsx without PENDING guards. Add the useAuraChat test with a mock ChatTransport asserting sendMessage/stop/regenerate/approval calls. Add a test that greps EvalDashboard.tsx for numeric literals outside fixtures.
  - Acceptance: The ai-items.test asserts that useAuraChat returns the 4 prop builders, that the mock transport receives regenerate with messageId and an approval response, that StreamingMarkdown('**bold', streaming) renders <strong>, and that ArtifactPanel source has 0 import(' matches. It runs with 0 PENDING warnings.

#### `next-fin/f-registry-items` — REQ-FIN-88, AC-FIN-88; REQ-SURF-174, 175, 176, 177, 178
Files: `registry/items/{tree-select,faceted-search,media-gallery,media-transcript,presence-stack,comment-thread}/**`, `registry/blocks/{commerce-cart,commerce-checkout,pricing,audit-log,permissions-matrix}/**`.

- **REQ-SURF-174** (needs: agent)
  - Steps: 1. tree-select: compose CMP Select (Select.Root/Trigger/Popup) from 'aura-glass' with TreeView inside the popup.
2. faceted-search: derive the visible results from the FilterBar model + search query (evaluate rules against result fields) and pass filtered.length as resultCount.
3. Fill registryDependencies (filter-bar/tree-view/select ids).
4. Fix jest resolution and remove the PENDING guards.
5. Add behaviour tests: selecting a facet reduces the result count; selecting a tree node updates the trigger label.
  - Acceptance: The data-items.test passes under the root (or registered doubles) config with 0 PENDING. The faceted-search facet click changes the rendered result count. tree-select renders [data-ag-component=select] or the CMP Select part.
- **REQ-SURF-175** (needs: agent)
  - Steps: 1. media-gallery: wrap triggers in CMP Grid from 'aura-glass'.
2. media-transcript: accept `cues | TextTrack` (map TextTrackCueList to {start,end,text}); make `end` required; scroll the active cue into view via scrollIntoView({block:'nearest'}) only when !hovered && !focusWithin && useResolvedPreferences().motion==='full'.
3. In media-items.test, render with @testing-library in jsdom: fireEvent.click(cue) calls media.seek(start), and a rerender with currentTime moves aria-current.
4. Add registryDependencies.
  - Acceptance: The media-items.test has a jsdom test where seek is called with the cue start and aria-current moves after the currentTime change. A scroll spy is called 0 times while hovered and 1 time at motion full. media-gallery source imports Grid.
- **REQ-SURF-176** (needs: agent)
  - Steps: Both items exist, but neither matches the API in the spec.

PresenceStack.tsx:
- Rename `imageUrl` to `avatarUrl`. Add `color?` and type `status` as 'active'|'idle'.
- The cap is `Math.min(max, 5)` and ignores the container width. Replace it with a container query that clamps to 3 below 390 px, using CSS in a colocated presence-stack.css plus a `data-narrow` fallback.
- Render a `<ul>` of `<li>` with each name as visible or visually-hidden text. Drop the extra 'N online' span, or keep it only as additional text.
- Replace the inline `hsl(...)` literal (which also breaks the REQ-SURF-170 no-colour-literal rule) with `var(--_ag-chart-${(hash % N) + 1})`, indexed by a deterministic hash of `id`.

CommentThread.tsx:
- Add `onResolve(id)` and `anchorLabel`.
- Render `<ol>` > `<li>` > `<article>` with `<time dateTime={c.at}>`.
- Use `<TextField multiline>`.
- Put the IME guard on the textarea keydown, not on Card.Footer. Shift+Enter must insert a newline.
- Collapse the avatar column below 360 px via a container query.

Tests: rewrite both so they assert unconditionally, with no PENDING early return. Map 'aura-glass' to src/index.ts in the test config (see cross_cutting). Add:
- a test that fires keydown Enter with `isComposing: true` via @testing-library and asserts onSubmit was not called, plus a test that a plain Enter submits;
- a test that the same id gives the same colour var;
- a `jest.getTimerCount() === 0` check;
- a test that the overflow button is named 'N more collaborators'.
  - Acceptance: Run `npx jest tests/capability/registry/presence-stack.test.tsx tests/capability/registry/comment-thread.test.tsx` under the root config. It must pass, print 0 'PENDING' warnings, include a behavioural IME test (not a source-string match), and `rg -n 'hsl\(|#[0-9a-f]{3,6}' registry/items/{presence-stack,comment-thread}` must return 0.
- **REQ-SURF-177** (needs: agent)
  - Steps: commerce-cart:
- Change LineItem's props to `{id,title,quantity,onQuantityChange,unitPrice,lineTotal?,onRemove?,maxQuantity?}`.
- Use CMP `NumberField` with min 1 and max `maxQuantity`. Today it is a pair of Buttons and allows 0.
- Add a polite live region that announces the new line total.
- Change CartSummary to `{lines,total,currency,cta,footnote?}`.
- Add layout CSS: side-by-side at 1024 px and above; below that, a sticky bottom CTA with `padding-bottom: env(safe-area-inset-bottom)`.

commerce-checkout:
- Change CheckoutSteps to `{steps:{id;label;status}[], value, onValueChange}`.
- Below 768 px, show 'Step n of m' and move the list into a CMP `Sheet`.
- Build the fields with CMP `Form`.

pricing:
- Replace the hand-rolled Button radiogroup with CMP `SegmentedControl`.
- In PlanComparison boolean cells, render an icon plus visually-hidden 'Included'/'Not included'. Today they are bare ✓/— glyphs.
- Add a horizontal-scroll wrapper with a sticky first column at 390 px.

Tests:
- Add a JPY assertion to commerce-cart.test.tsx.
- Remove the PENDING early returns.
- registry-only.test.ts: scan an extracted packed tarball's `dist/` (for example via `$AG_TARBALL_DIR`), not the repo's `dist/`, which does not exist. Today it passes vacuously. Delete the tautological second test.
  - Acceptance: Under the root config, `npx jest tests/capability/registry/{commerce-cart,commerce-checkout,pricing}.test.tsx` passes with real assertions for: JPY with 0 decimals; de-DE EUR; exactly 1 `aria-current="step"`; `role="radiogroup"` from SegmentedControl; hidden 'Included' text. registry-only.test.ts fails when a fixture dist contains 'CommerceCart'.
- **REQ-SURF-178** (needs: agent)
  - Steps: audit-log:
- At 390 px, move FilterBar and DateRangePicker into a CMP `Sheet` with a 'Filters' trigger, using a container query or useMediaQuery.
- Fixtures should page server-side: slice EVENTS by pageIndex. Today all EVENTS are passed regardless of page.

permissions-matrix:
- Render the permission column as row headers (`<th scope="row">`) through the Table rowHeader column option.
- Make sure role column headers are `<th scope="col">`.
- Point the `aria-describedby` targets at rendered description elements.

Tests: add unconditional assertions for:
- the checkbox accessible name '{role} {permission}';
- describedby resolving to the description text;
- `onPaginationChange` being called with pageIndex 1 on next-page;
- the Sheet at 390 px (container-width prop or jsdom matchMedia).
  - Acceptance: Under the root config, the audit-log and permissions-matrix tests contain at least 4 non-guarded assertions each and pass. `getAllByRole('rowheader')` returns one per permission.

#### `next-fin/f-capability-ledger` — REQ-FIN-89, AC-FIN-89; REQ-SURF-179, 181, 182, 183, 184, 185, 187
Files: `docs/auraglass-5/capability-ledger.{json,schema.json,report.md}`, `scripts/surf/verify-capability-ledger.mjs`, `tests/capability/**` (not `jest.doubles.cjs`), `stories/surf/capability/**`.
Notes: PLAT reading the report (seam REQ-FIN-34) is FIN-C. Flipping rows to `delivered` happens only after the delivery check passes in CI.

- **REQ-SURF-179** (needs: agent)
  - Steps: - Populate `budgetKb` (archived R6 gzip line), `artifacts: []`, `demand: []` and `stories: []` on every row. Set `subpath` on every export-form row.
- Add these fields to `required` in capability-ledger.schema.json.
- Diff each row against archived EXP PRD §4.4 (docs/auraglass-5/archive/v1-19-prd/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md) to confirm the rows are verbatim apart from the owner column.
- Extend tests/capability/ledger-schema.test.ts to fail when any of the 20 archived fields is absent.
  - Acceptance: `node scripts/surf/verify-capability-ledger.mjs` exits 0, and a row with `budgetKb` deleted exits 1 naming the row. ledger-schema.test.ts asserts all 20 fields on all 71 rows.
- **REQ-SURF-181** (needs: ci)
  - Steps: - Extend deliveryCheck to resolve each name through any of four routes: (a) a value export or static member of `subpath` in the packed tarball's enumerated exports; (b) a `data-ag-part` in the owner's `*.meta.ts`; (c) a story id in `storybook-static/index.json`; (d) `registry/{blocks,items}/<name>/registry-item.json` plus the built registry JSON, with a type matching `form`.
- Register the delivery check in fragments/lanes/surf.ts W5 as an L2 lane: `kind:'node-script'`, `--manifest <packed manifest>`, scope main and release.
- Flip shipped rows to `delivered`: for example X-08 Command/CommandPalette, X-14, X-31..X-34, X-46..X-50 registry items, which exist on next.
- Mark the rest `deferred` with a 5.1 slot by owner decision.
- Add delivery.test.ts cases for the part, story and registry resolution paths.
  - Acceptance: delivery.test.ts has passing and failing fixtures for all 4 resolution routes. On next, `node scripts/surf/verify-capability-ledger.mjs --manifest <packed>` exits 0 with at least 1 delivered row per shipped area. At the rc.1 tag, 0 P0/P1 5.0 rows are `planned`.
- **REQ-SURF-182** (needs: agent)
  - Steps: - Extend reportMd to render the per-release roadmap text (rows grouped by release and area), between markers in capability-ledger.report.md.
- Add `--out <file>` to `--report release-notes`, writing to `.artifacts/surf/ledger/new-capability.md`.
- Seam fix (PLAT-owned, raise as a PLAT task): release-notes.mjs should read that output file instead of `capabilityLedger.capabilities`.
- Make the artifact-URL match strict: `/^https:\/\/.+\/-\/jobs\/\d+\/artifacts/`, not `includes(rel)`.
- Add a report.test.ts fixture with a delivered row that lacks an artifact and must exit 1, plus one with an artifact that must list the URL.
  - Acceptance: report.test.ts includes a 'delivered row without artifact exits 1' fixture and passes. `--report md --check` exits 0, and the committed report contains roadmap sections. The PLAT notes for a fixture tag include the SURF 'New capability' section.
- **REQ-SURF-183** (needs: agent)
  - Steps: - In diffGate, derive the before/after value-export snapshots automatically. Option 1: from `build/exports.manifest.json` at `<base>` vs HEAD (`git show`). Option 2: from the api-report `scripts/build/api-report.mjs` output at both shas.
- Alternatively, change the CI script to generate both snapshots and pass `--exports`.
- Make the job write evidence to `.artifacts/surf/ledger/`. Today the artifacts path is declared but nothing is written.
- Add a test that uses a temp git repo where a commit adds an export with no ledger row, and assert it exits 1.
  - Acceptance: In a temp git repo fixture, adding `export const GhostExport` to an entry barrel without a ledger row makes `--diff <base>` exit 1 naming GhostExport, with no `--exports` flag. The CI log has no 'exports diff not evaluated' line.
- **REQ-SURF-184** (needs: ci)
  - Steps: - Add a `--budget <packed-exports.json>` mode to verify-capability-ledger.mjs. It enumerates root and subpath value exports from the packed tarball (or api-report). It must assert root ≤160 and total ≤250. It must assert ledger sum == enumerated count (difference 0), or fail printing both numbers.
- At GA (`--ga`), assert ≥1 root and ≥4 subpath slots remain.
- Check that the promotion gate requires the contract-PR name in `src/contracts/entries.ts` for promoted names.
- Add fixture 'promotion without demand' explicitly in export-budget.test.ts, as named in the spec.
  - Acceptance: export-budget.test.ts has a fixture where the ledger and manifest differ by 1, which exits 1 with both numbers. A '0 subpath slots free at --ga' fixture exits 1. Against the real packed tarball in L2, the difference is 0.
- **REQ-SURF-185** (needs: agent)
  - Steps: - Add ModelPicker, QueryBuilder, TraceTree and Artifact to ALIASES. Scope the scan to the entry barrels in src/contracts/entries.ts (registry items may legitimately export these names).
- Add the 4 names to the X-R11 `names`, or record why they belong to another row.
- Create the spec-named `tests/capability/no-rejected.test.ts` check: rg over `src/**/*.stories.*`, `registry/**/*.stories.*` and `build/exports.manifest.json` for every X-R01..X-R13 name. The current no-rejected.test.ts only checks ledger internals.
  - Acceptance: Adding `export { ModelPicker }` to src/ai/index.ts makes no-alias-exports.test.ts fail. Adding a story titled with a rejected name, such as GlassHologram, makes no-rejected.test.ts fail.
- **REQ-SURF-187** (needs: agent)
  - Steps: - Add filters for area, priority, owner, form and status.
- Add a 'Rejected' tab (CMP Tabs) listing X-R01..X-R13 with their reasons.
- Compute counts at build time from the JSON import.
- For every `part`/`prop` form row, add a named story in the owner component's story file and record its id in the row's `stories` field.
- In delivery.test.ts, assert that every `stories[]` id exists in a storybook index fixture or in story exports (static parse of the CSF files).
  - Acceptance: delivery.test.ts fails on a fake story id in a row's `stories`. The roadmap story renders 6 filter controls and a Rejected tab with 13 rows.

#### `next-fin/f-clear-over-media` — REQ-FIN-90, AC-FIN-90; REQ-SURF-188
Files: `tests/e2e/surf/clear-over-media/*.spec.ts`, `fragments/lanes/surf.ts` (L6 row), `fragments/playwright/surf.json` (`testDir`), the 15 registry stories' `parameters.ag`.
Notes: Never `tests/a11y/**` (MAT, D06). Open FIN-C PR #196 (PLAT-96) adds a `parameters.ag` gate. Do not duplicate the gate; FIN-F only adds the parameters.

- **REQ-SURF-188** (needs: ci)
  - Steps: - Add `parameters: { ag: { subject, kind: 'showcase'|'component', scenes: 'all' } satisfies StoryAgParameters }` to the 15 registry stories listed above.
- Create `tests/a11y/clear-over-media/*.spec.ts`, which W4 registers on L6.
- QUAL dependency: implement the cert-manifest.json generator, deriving `owner` from meta.ts or the ledger, so L6 discovers SURF subjects.
- Run L6 remotely and fix failing text runs, especially on dark-media and flat-black.
  - Acceptance: Every registry/**/*.stories.tsx carries `ag:`. QUAL's cert-manifest lists ≥1 SURF subject per flagship. An L6 run on next reports 0 SURF contrast failures across 8 scenes × light/dark × 3 transparency rungs × 2 widths × 3 engines, with the artifact linked.

#### `next-fin/f-forced-colors` — REQ-FIN-90, AC-FIN-90; REQ-SURF-189
Files: SURF CSS in app-shell, data, media, ai and the nav dirs; `tests/e2e/surf/app-shell/forced-colors.spec.ts`.
Notes: CSS sweep. Run after all FIN-F.1 CSS PRs, one at a time.

- **REQ-SURF-189** (needs: agent)
  - Steps: CSS:
- src/app-shell/app-shell.css: add `@media (forced-colors: active)` rules. Set `backdrop-filter: none` on every SURF surface, and use system colours (Canvas, CanvasText).
- Give the current nav item (`[aria-current=page]` in Sidebar.Nav, Tabs, TabBar, Breadcrumbs) `outline` or `text-decoration: underline` in addition to Highlight.
- Focus style: `outline: 2px solid Highlight`.
- Equivalent rules in src/data (legend swatches get `border: 1px solid CanvasText`), src/media (slider track and thumb in CanvasText/Highlight) and src/ai.
- Add `[data-ag-contrast=more]` chrome changes (stronger borders and solid fills) on TopBar and Sidebar.

Tests: rewrite both specs.
- forced-colors.spec: count elements whose computed `backdropFilter` is not 'none' and require 0 per SURF story; check the current item's outline/text-decoration; check the focus outline colour.
- preferences.spec: screenshot-diff TopBar and Sidebar between default and `contrast: more` and require >0.5%; check reduced transparency resolves to the tinted/solid rung via a computed data attribute.
  - Acceptance: Run remotely: forced-colors.spec finds 0 visible backdrop filters in every SURF story and finds a non-colour cue on aria-current. The contrast-more pixel diff inside TopBar/Sidebar is >0.5%. Both specs fail when the new CSS is reverted.

#### `next-fin/f-idle` — REQ-FIN-90, AC-FIN-90; REQ-SURF-190
Files: `tests/e2e/surf/motion/idle.spec.ts`, SURF gate loops.
Notes: Includes the REQ-FIN-12 SURF-loop transfer (§6.1).

- **REQ-SURF-190** (needs: agent)
  - Steps: - Rewrite idle.spec.ts. For each SURF subject and each motion setting (full/calm/none), load the story, wait 1,000 ms with no input, and assert `document.getAnimations().filter(a => a.playState === 'running').length === 0` and 0 rAF callbacks via QUAL `perf.settledIdle` (S-40).
- Under `none`, assert:
  - no caret blink;
  - no running dots;
  - `scroll-behavior` is not 'smooth';
  - no entrance transform.
- Ensure the static (non-streaming) story states render no caret.
- Make sure no SURF prop can raise motion above the OS floor: add a unit test on the motion prop resolution.
  - Acceptance: Run remotely: idle.spec iterates ≥1 SURF subject (no pending), and 0 running animations after 1,000 ms at all 3 motion settings. Injecting an infinite animation into a story makes it fail.

#### `next-fin/f-blur-budget` — REQ-FIN-90, AC-FIN-90; REQ-SURF-191
Files: `tests/e2e/surf/app-shell/blur-budget.spec.ts`, `fragments/lanes/surf.ts`, `fragments/size-budgets/surf.ts`.
Notes: Exact numbers (≤3 fine / ≤2 coarse, depth 1, chrome ≤32 px, scrims ≤12 px, StatusBar none). Never loosen them.

- **REQ-SURF-191** (needs: agent)
  - Steps: - Rewrite app-shell/blur-budget.spec.ts on `perf.blurredSurfaces`. Assertions:
  - ≤3 at fine and ≤2 at coarse (`hasTouch`/`isMobile` project);
  - nesting depth 1 (no blurred ancestor of a blurred element);
  - parsed blur radius ≤32 px on chrome and ≤12 px on scrims;
  - StatusBar computes to 'none';
  - TabBar is 1 and Table ≤1.
- Create tests/e2e/surf/media/blur-budget.spec.ts:
  - MediaControls 1;
  - NowPlayingBar 1;
  - ImageViewer open ≤2;
  - CarouselRail ≤3 fine / ≤1 coarse.
- In registry-blocks.spec.ts, assert ai-workspace ≤6 fine / ≤3 coarse and every other block ≤3.
- Register the media spec under L10/L5 in fragments/lanes/surf.ts.
  - Acceptance: All three specs run against ≥1 discovered subject each on a remote run and pass at the exact spec numbers. Raising the app-shell budget to 4 is no longer possible without editing the spec constants.

#### `next-fin/f-hit-areas` — REQ-FIN-90, AC-FIN-90; REQ-SURF-192
Files: SURF interactive-part CSS, `tests/e2e/surf/target-size.spec.ts`.
Notes: Build it now; it merges after the REQ-FIN-05 hit-area fix (FIN-A) and reports the dependent cases `pending` through the lane runner until then.

- **REQ-SURF-192** (needs: agent)
  - Steps: - Add HitArea, or `::after` hit-area pseudo-elements sized by `--ag-target-min`/`--ag-target-coarse`, to SURF interactive parts. Candidates: Tabs triggers, Breadcrumbs links, Pagination buttons, TreeView chevrons, Table resize handles, MediaControls, Composer actions, commerce quantity steppers, presence overflow.
- Raise with MAT: the hit-area's `pointer-events: none` defeats its purpose. It should be `auto` on the extension, or the pseudo-element should live on the interactive element itself.
- Extend target-size.spec.ts with a coarse project (`hasTouch: true`, `isMobile: true`). Measure the effective hit box via `elementFromPoint` at the 44×44 corners, not only `getBoundingClientRect`.
- Register it in lanes/surf.ts W5 (L12 or L5, remote).
  - Acceptance: Under coarse emulation, `document.elementFromPoint` at ±22 px from the centre of every SURF interactive element returns that element or a descendant, across every SURF story. Visual bounding boxes are unchanged against the L7 baseline.

#### `next-fin/f-focus` — REQ-FIN-90, AC-FIN-90; REQ-SURF-193
Files: `tests/e2e/surf/focus.spec.ts`, `src/date/date.css`, `src/charts/**` (replace `outline: none`).

- **REQ-SURF-193** (needs: agent)
  - Steps: - Rewrite focus.spec.ts using `page.keyboard.press('Tab')`. For each focused element, assert the computed outline/box-shadow matches `--ag-focus-inner/outer/width`, including `aria-disabled` cells.
- Assert the focused element's rect is not covered by sticky TopBar/TabBar/StatusBar, using elementFromPoint at its centre.
- Open and close Sidebar drawer, Sheet, CommandPalette, ImageViewer and Popover, and assert `document.activeElement` returns to the trigger.
- CSS: replace `outline: none` in date.css:24 and charts.css:4 with the MAT focus ring on `:focus-visible` / `[data-focused]`.
- Add `scroll-padding-top`/`bottom` equal to the sticky chrome heights in app-shell.css.
- Register focus.spec in lanes/surf.ts.
  - Acceptance: Run remotely: focus.spec visits ≥10 focusable elements per SURF story with ring tokens matched, 0 obscured elements, and focus restored for all 5 overlays. `rg -n 'outline:\s*none' src/{date,charts,data,media,ai,app-shell}` hits only rules that have a `:focus-visible` replacement.

#### `next-fin/f-playwright-fragment` — REQ-FIN-90, AC-FIN-90; REQ-SURF-194
Files: `fragments/playwright/surf.json`, `fragments/lanes/surf.ts`, L14 review-item definitions for the six product blocks.
Notes: L14 scores are human work (FIN-H REQ-FIN-111). FIN-F only defines the review items.

- **REQ-SURF-194** (needs: agent)
  - Steps: - fragments/playwright/surf.json:
  - Remove the W2 `surf:cert-media-sampling` entry.
  - Point `surf:cert-rtl` at `tests/e2e/surf` with `testMatch: rtl.spec.ts`.
  - Change `surf:ai-perf` to testDir `tests/perf/browser/surf` plus testMatch.
- fragments/review/surf.ts: add L14 ReviewItems for the six product-surface blocks (blocks/app-frame, data-workspace, analytics-dashboard, media-viewer, ai-workspace, support-inbox).
- Confirm that the literals and a11y baselines being empty matches a real 0-violation scan, or record the current baselines.
- Ask QUAL to make fragments.test.ts assert unique Playwright project names across all streams and existing testDirs.
  - Acceptance: A uniqueness check over all fragments/playwright/*.json project names finds 0 duplicates. Every testDir exists as a directory. The review fragment has ≥1 item per subject `blocks/<id>--default` for all 6 blocks.

#### `next-fin/f-ci-fragment` — REQ-FIN-90, AC-FIN-90; REQ-SURF-195
Files: `ci/surf.gitlab-ci.yml`, `ci/surf/**`.
Notes: Repoint `surf:test:ai-sdk` at the final paths produced by SURF-106/-172; do not move the files again. Tee `surf:test:ledger` output to `.artifacts/surf/ledger/`. Fix the 'v6' comment. Pass `verify-ci-fragments`. Flip `allow_failure: false` per job only after its first green run on `next`. The mirror is OD-8 (owner).

- **REQ-SURF-195** (needs: owner-decision)
  - Steps: - Move ci/surf/ai-sdk/{ai-sdk-compat.test-d.ts,ai-workspace-route.test.ts,ai-sdk-adapter} to the final paths: tests/types/surf/ai-sdk-compat.test-d.ts, and registry/blocks/ai-workspace/app/api/chat/route.ts plus its test (REQ-SURF-106/172).
- Change surf:test:ai-sdk to run `npx tsc -p tsconfig.json && npx jest tests/types/surf registry/blocks/ai-workspace` with no scratch install. Fix the 'v6' comment.
- Make the ledger job tee its output to `.artifacts/surf/ledger/`.
- Owner action (cross-stream): the GitHub→GitLab mirror must push `next` and `release/4.x`, or the jobs never run. Then get the first green run and flip `allow_failure` to false per job.
  - Acceptance: A pipeline on `next` in GitLab project 87152036 shows surf:test:ledger, surf:test:doubles (5 cells), surf:build:ai-fixtures and surf:test:ai-sdk green. A follow-up MR sets `allow_failure: false` on each. `contract:ci-fragments` is green.

#### SWEEP `next-fin/f-pending-sweep`: AC-FIN-GLOBAL for SURF specs
On `next` e5a2d6835 (verified), 88 SURF spec files still return early on `console.warn('… pending')` or a missing subject. Each file is fixed in the PR of the group that owns its subject; this branch picks up only the files still left when FIN-F's last group merges. A missing subject must fail the test. A subject that is not built yet goes through the lane runner's `pending` state, never an in-test `return`. Done means `git grep -lE "pending'\); return|pending\`\); return|pending\"\); return|— pending" -- tests/a11y/apg/surf tests/e2e/surf tests/perf/browser/surf tests/visual/surf` returns 0 files.

- `tests/a11y/apg/surf/`:
  - activity-feed, breadcrumbs-overflow, calendar, carousel-rail
  - citation, command, composer, date-picker
  - date-range-picker, filter-bar, image-viewer, media-controls
  - message, now-playing, sidebar, splitter
  - tabbar, table, tabs, thread
  - time-picker, tool-call, tree-view
  - each `.apg.spec.ts`
- `tests/e2e/surf/ai/`:
  - citation-preview, composer-dropzone, composer-grow, composer-ime
  - thread-scroll, thread-virtual
- `tests/e2e/surf/app-shell/`:
  - a11y, blur-budget, forced-colors, inspector
  - layout, resizable, sidebar-drawer, ssr-hydration, theme
- `tests/e2e/surf/backdrops/`: modes, motion
- `tests/e2e/surf/charts/`: chart, keyboard
- `tests/e2e/surf/data/`:
  - axe, chart-frame-sr, data-table, filter-bar
  - preferences, responsive-cards, table-pinning, table-responsive
  - table-virtual, tree-virtual
- `tests/e2e/surf/date/`: date-picker, locale
- `tests/e2e/surf/media/`:
  - controls-container, now-playing-container, sampling-engines
  - scrubber-drag, stories-modes, waveform-modes
- `tests/e2e/surf/motion/`: idle, source-transition, tabbar-minimize, tabs-indicator
- `tests/e2e/surf/`: focus, rtl, target-size
- `tests/perf/browser/surf/`:
  - activity-feed-prepend, ai-streaming, app-shell-scroll, backdrops-presets
  - command-5000, data-filter, data-table-5000, data-table
  - data-tree-view, date-picker-open, labs-spatial-admission, media-playback
  - media-sampling, registry-blocks, resizable-drag, sidebar-toggle
- `tests/visual/surf/`: `ai/ai-workspace.visual`, `data-states`, `data/data-surface.gates`, `media/clear-over-media`, `media/flagships`

Visual baselines come only from `qual:certify:baseline-refresh` in `AG_PLAYWRIGHT_IMAGE` (FIN-G). FIN-F never updates them to make a test pass.

#### FIN-F.3.0 Owner-gated items in FIN-F: what the agent prepares vs what the owner does
**(a) Agent prep work.** The agent does all of this. It never decides for the owner and never records a decision.
- **OD-17** (SURF-04, SURF-11): write `docs/release/decisions/OD-17.md` as a decision request with no decision filled in. It lays out the options:
  - compat date adapters: lazy import, own `./compat/date` subpath, or documented peer requirement (#341 implements the last);
  - Backdrop `tone`: `mediaTone` rename vs a `BANNED_PROPS` exception.
  Attach the esbuild-metafile output from the remote #341 test and the REQ-SURF-153 text.
- **OD-20** (SURF-82, SURF-105): a decision request for treegrid vs tree, with the APG spec results for both role sets from a remote run. Also the DateTimePicker 5.1 additive-contract PR text, ready but not merged.
- **OD-16** (SURF-106 SDK v6 approval states; the Waveform 5.1 entry; dropping the three peers, C-6): draft the `contract/v1.2-final` hunks (FIN-463 owns the bundle). Attach `tsc` results against `ai` v5 and v6 from the remote `surf:test:ai-sdk` job.
- **OD-8** (all CI legs): nothing to build in FIN-F. Report which `ci/surf.gitlab-ci.yml` jobs are ready and waiting for pipelines.

**(b) Owner actions (Gurbaksh). The agent never performs or fakes these.**
1. OD-17: choose the compat-date option and the Backdrop `tone` resolution. Record it in `docs/release/decisions/OD-17.md` with date and signature line, or reply on the PR with the choice so the agent can commit it with attribution.
2. OD-20: choose treegrid or tree, and confirm DateTimePicker = 5.1. Record in `docs/release/decisions/OD-20.md`.
3. OD-16: approve or reject the SDK major (v5/v6) and the Waveform 5.1 / three-peer drop hunks in the `contract/v1.2-final` PR (approve the PR on GitHub).
4. OD-8: make GitLab project 87152036 receive `next`, `release/4.x`, `release/4.1.x`, the stream/contract/sync branches and `v*` tags. Today the org mirror pushes `main` only and prunes the others. Pipelines must then run on them. Agents never push to the mirror and never edit `.github/workflows/mirror-to-gitlab.yml`.
5. Merge order sign-off for the app-shell cluster. This is the order of slots 11–14 above; the agent proposes it and the owner confirms.

### FIN-F.4 Validation (GitLab CI only, `allow_failure: false`)

Status: no FIN-F job has ever run. GitLab 87152036 has 0 pipelines, and all 4 jobs in `ci/surf.gitlab-ci.yml` are `allow_failure: true`.
- An AC-FIN id counts only with a green job URL on `next`, recorded in that REQ's Appendix A row and the ledger.
- Confirm a head SHA with `node scripts/ci/gitlab-status.mjs --sha <sha>`.
- Flip each job to `allow_failure: false` in a follow-up commit after its first green run, and add the `ci/plat/activation.json` row through FIN-B (REQ-FIN-22/-24, which integrates SURF-195).

Locally, run only narrow jest/node tests (`npm test -- <paths>`), `tsc` on a small config, and ESLint on changed files.

These run only remote (GitLab CI or the `auraone-remote-run` gated runner): Playwright e2e, APG, visual, perf, Storybook, `npm pack`, canaries, `next build`, and the full `npm run build`. A lane invoked locally must exit 2 and print the remote command.

| AC-FIN | Jobs / lanes that must be green on `next` (all `allow_failure: false`) | Remote-only legs |
|---|---|---|
| AC-FIN-80 | Jest L1 rows of `fragments/lanes/surf.ts`: `tests/data/exports/{surf-entries,surf-statics,peer-isolation}`, `tests/ai/side-effects`, `tests/data/rsc-hydration`, `tests/app-shell/meta-coverage`, `tests/data/css/surf-css`, `tests/capability/purity-gate`, codemod fixtures, compat adapter tests, `tests/types/surf/prop-grammar.test-d.ts` under `tsc`. Also `plat:package:pack` (packed entries), `plat:test:canaries` (L11 next16 manifest: 0 server modules), the L11 migrate-4to5 canary job, `contract:ci-fragments`, FIN-C's `verify-side-effects`, `tests/contract/fragments.test.ts` on `next` and `release/4.x`, and `api:update` diff clean. | Packed-tarball import, `next build` canary, migrate canary, `tests/ssr/surf/hydration.spec.ts`, `tests/e2e/surf/rtl.spec.ts` |
| AC-FIN-81 | `src/app-shell/**` jest (`app-shell.test`, `app-shell.css.test`, `Sidebar.test`, `AppShellSidebarToggle.test`, `StatusBar.test`, `MobileShell.test`, `TopBar.test`, `Inspector.test`, `ResizablePanels.test`, `app-shell-ssr.test`), `tests/capability/registry/app-shell-workspace.test.tsx`, `surf:test:doubles` (app-shell cell). | `tests/e2e/surf/app-shell/{layout,a11y,inspector,resizable,sidebar-drawer,theme,forced-colors,blur-budget,ssr-hydration}.spec.ts` on chromium, webkit and firefox; APG `sidebar` and `splitter`; L5 axe (`landmark-unique`, `aria-hidden-focus` = 0); app-shell composites at 320, 390, 1024 and 1440 |
| AC-FIN-82 | Tabs, TabBar, Breadcrumbs, Pagination, Command and SourceTransition jest including `getRange.test` (40 cases), `score.test`, `Command.test` (5,000 items), `CommandPalette.test` (hotkey/IME), and the REQ-FIN-07 gate with the CommandPalette baseline row deleted. | APG `tabs`, `tabbar`, `breadcrumbs-overflow`, `command`; `tests/e2e/surf/motion/{tabs-indicator,tabbar-minimize,source-transition}`; `target-size`; `tests/perf/browser/surf/command-5000` (p95 ≤50 ms, L10) |
| AC-FIN-83 | `src/data/**` jest (Table incl. Profiler, 400,000 px, 13-part snapshot, `edit`; VirtualList idle; TreeView; FilterBar 40-case serialisation; Chip/KVE/StatCard/Sparkline; ChartFrame/Timeline/ActivityFeed), `tests/types/surf/{filter-model,tree-view}.test-d.ts`, `plat:gate:change-class` (L3 reads the snapshot), the size-budget job (`useGridKeyboard` ≤2.5 KB). | `tests/e2e/surf/data/*` (10 specs), APG `table`, `tree-view`, `filter-bar`, `activity-feed`; `tests/perf/browser/surf/{data-table,data-table-5000,data-tree-view,data-filter,activity-feed-prepend}`; chart palette ΔE2000/CVD from built CSS |
| AC-FIN-84 | `src/date/**` jest (`DatePicker.test`, `DateRangePicker.test`, `TimePicker.test`, ISO week 20 cases × 2 TZ, ≥12 forwarding tests). | APG `calendar`, `date-picker`, `date-range-picker`, `time-picker`; `tests/e2e/surf/date/{date-picker,locale}` and `date-picker-responsive`; `tests/perf/browser/surf/date-picker-open` |
| AC-FIN-85 | `src/ai/**` jest, `tests/types/surf/ai-sdk-compat.test-d.ts` under `tsc --noEmit`, `surf:test:ai-sdk` (repointed), `surf:build:ai-fixtures` (`gen-ai-fixtures --check`), `surf:test:doubles` (ai cell). | `tests/e2e/surf/ai/*` (6 specs), APG `thread`, `message`, `composer`, `tool-call`, `citation`; `tests/perf/browser/surf/ai-streaming`; `tests/visual/surf/ai/ai-workspace.visual` |
| AC-FIN-86 | `src/media/**` and `src/backdrops/**` jest (`useMediaElement` SSR snapshot, Waveform `renderToString` under node), `tests/types/surf/{media,backdrops}.test-d.ts`, `surf:test:doubles` (media cell), the calibration script `--check`. | `tests/e2e/surf/media/*` (incl. `target-size`), `tests/e2e/surf/backdrops/*`, APG `media-controls`, `now-playing`, `image-viewer`, `carousel-rail`; L8 sampling on 3 engines; L9 motion; `tests/perf/browser/surf/{media-playback,media-sampling,backdrops-presets}`; `tests/visual/surf/media/*`; media chrome and blur-budget specs |
| AC-FIN-87 | `src/charts/**` jest, `tests/capability/entries.test.ts` (`./three` = 0 exports), `tests/labs/**`, `verify-labs-admission.mjs` in a blocking release lane, labs build + pack test. | `tests/e2e/surf/charts/{chart,keyboard}`; `tests/perf/browser/surf/labs-spatial-admission` (six REQ budgets, L10) |
| AC-FIN-88 | `tests/capability/registry/{ga-blocks,ai-workspace-route,app-shell-workspace}` (0 network calls), registry lint over every item directory, `plat:test:registry` (L11 render harness). | `tests/perf/browser/surf/registry-blocks`; registry block captures for the six product blocks (L14 inputs) |
| AC-FIN-89 | `surf:test:ledger` (output teed to `.artifacts/surf/ledger/`), `tests/capability/**` (delivery, export-budget `--budget` root ≤160 / total ≤250 / diff 0, `no-rejected.test.ts`, temp-repo snapshot test). | L2 delivery check with `--manifest` against the packed artifact |
| AC-FIN-90 | `ci/surf.gitlab-ci.yml` passes `verify-ci-fragments`; all 4 SURF jobs green then flipped; `fragments/playwright/surf.json` with unique project names and real `testDir`s. | `tests/e2e/surf/clear-over-media/*` (L6, 0 SURF failures over the full matrix); `tests/e2e/surf/app-shell/forced-colors` (pixel diff >0.5 %); `tests/e2e/surf/motion/idle` (0 animations, 0 rAF at 1 s, × full/calm/none); `blur-budget`; `target-size` (coarse `elementFromPoint`); `tests/e2e/surf/focus` |
| AC-FIN-GLOBAL (SURF share) | 0 SURF rows open in Appendix A; `fragments/{a11y,literals}-baseline/surf.json` stay empty (verified empty today); 0 pending early returns in the 88 files listed under SWEEP. | — |

### FIN-F.5 Exit criteria

FIN-F is done only when every box is ticked with a green `allow_failure: false` job URL on `next` (and on `release/4.x` for SURF-12/-47) recorded in the ledger row. Owner-gated rows may close only with the owner's recorded decision.

- [ ] FIN-F.1: all 14 open PRs (#338–#351) are trimmed, resolved and merged, each on a green pipeline. None stays open. The cross-WP survivor notes for #173, #175, #195, #308, #322 and #323 have been sent.
- [ ] FIN-F.2: every leftover clause of the 42 merged REQs passes. `tests/contract/fragments.test.ts` is green on both lines.
- [ ] FIN-F.3: all 119 no-PR REQs are implemented, and the SWEEP grep returns 0 files.
- [ ] AC-FIN-80, REQ-FIN-80: REQ-SURF-01, 02, 03, 04 (OD-17), 05, 06, 07, 08, 09, 10, 11 (OD-17), 12, 13, 14, 15
- [ ] AC-FIN-81, REQ-FIN-81: REQ-SURF-17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46
- [ ] AC-FIN-82, REQ-FIN-82: REQ-SURF-47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, plus the REQ-FIN-07 CommandPalette transfer
- [ ] AC-FIN-83, REQ-FIN-83: REQ-SURF-66 … 97, all 32 (82 needs OD-20)
- [ ] AC-FIN-84, REQ-FIN-84: REQ-SURF-98, 99, 100, 101, 102, 103, 104, 105 (OD-20, 5.1 deferral recorded)
- [ ] AC-FIN-85, REQ-FIN-85: REQ-SURF-106 (OD-16) … 128, all 23, plus the REQ-FIN-110 AI live-region and meta-selector transfer
- [ ] AC-FIN-86, REQ-FIN-86: REQ-SURF-130, 131, 133 … 160 (30 REQs), plus the REQ-FIN-07 ImageViewer transfer and the REQ-MAT-64 sampling relocation
- [ ] AC-FIN-87, REQ-FIN-87: REQ-SURF-161 … 169 (165 contract PR merged by FIN-C after OD-16)
- [ ] AC-FIN-88, REQ-FIN-88: REQ-SURF-170 … 178 (172 route on Kiro Prism `PRISM_*`, with the README auth note)
- [ ] AC-FIN-89, REQ-FIN-89: REQ-SURF-179, 181, 182, 183, 184, 185, 187. The `capabilityLedger` delivered/deferred counts come from the CI run.
- [ ] AC-FIN-90, REQ-FIN-90: REQ-SURF-188 … 195, and all 4 `ci/surf.gitlab-ci.yml` jobs at `allow_failure: false`
- [ ] Not FIN-F's to close, but they need the hand-offs above to have landed: REQ-SURF-60 (FIN-A, REQ-FIN-07), and REQ-SURF-129 and -196 (FIN-H, REQ-FIN-110 human SR passes).

**Report**: the common JSON format, plus:
- `"forwardRefRemaining"`: the SURF files still using `forwardRef`; must be `[]`.
- `"capabilityLedger": {"delivered": n, "deferred": n}`.
- `"pendingSpecsRemaining"`: must be `[]`.
- `"openPrDisposition"`: `[{ "pr": 338, "action": "TRIM", "mergedSha": "", "pipelineUrl": "" }, …]` for all 14.


---

## 11. WP FIN-G — Quality, certification and showcase (QUAL, PRD-F §5.7, REQ-FIN-100..107)

State on 2026-10-10 (`next` e5a2d6835, `release/4.x` 645735fce, `release/4.1.x` a19f4bbe1): **FIN-G has not started.** 0 of 70 FIN-G-primary QUAL REQs merged, 0 covered by an open PR. None of the FIN-G paths exist on any line (`packages/qa/`, `jest.qual.config.js`, `certification/run.mjs`, `certification/lanes.config.ts`, `certification/lanes/`, `certification/{thresholds,ratchets,quarantine,exemptions,calibration,console-allowlist}.json`, `certification/baselines/`, `tests/perf/harness/`, `lint/rules/qual/`, `showcase/`, `StoryRoot`, `tsconfig.storybook.json`, `RELEASE_CHECKLIST.md`, `scripts/{qual,storybook}/`). On `next`, `certification/` holds only `playwright.cert.config.ts`, `scenes/photo.jpg` (800×500) and `scenes/scenes.manifest.json` (`{}`); `.storybook/StorySurface.tsx` still exists; `ci/qual.gitlab-ci.yml` is the seed (`.qual-lane` with `allow_failure: true`, only `qual:certify:l1` written out, `l2..l12` are a comment). `release/4.x` and `release/4.1.x` have no `certification/` at all.

Scope: 70 QUAL REQs (Appendix A.5 minus QUAL-69 → REQ-FIN-08/FIN-A, QUAL-72 → REQ-FIN-110/FIN-H, QUAL-73 → REQ-FIN-111/FIN-H; FIN-G still builds the REQ-FIN-111 tooling by §6.1 transfer). Tasks FIN-416..FIN-456 in `tasks/FIN.json` (`lane: FIN-G`). Every REQ is built from its full text in `prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` plus its `fin-open-ledger.json` row (`remaining_work`, `acceptance`); the stricter of ledger and PRD-F §5.7 wins.

**May touch (PRD-F §6, exclusive)**: `packages/qa/**`, `jest.qual.config.js`, `certification/**` minus `certification/review/records/**`, `.storybook/**`, `showcase/**`, `scripts/{qual,storybook}/**`, `stories/qual/**`, `lint/rules/qual/**`, `tests/{storybook,contract,perf/{harness,qual},lint/qual,e2e/qual,a11y/browser}/**`, `tests/a11y/apg/harness.ts`, `ci/qual.gitlab-ci.yml`, `ci/qual/**`, `fragments/*/qual.*`, `stylelint.showcase.config.mjs`, `tsconfig.storybook.json`. `tests/showcase/**` (named by REQ-QUAL-59) is not listed in §6; claim it for FIN-G in the PR body and add it to the REQ-FIN-30 ownership fixture via FIN-C (contract row F07 makes showcase files QUAL's).
**Must not touch**: `tests/helpers/**` (FIN-A, REQ-FIN-08), `package.json` (FIN-C; `exports/main/types` FIN-A), `.gitignore`/root config (FIN-C), `.github/CODEOWNERS` (FIN-B contract PR on `main`), `ci/plat*` (FIN-B), `src/contracts/**` and `jest.config.js` (contract PR only), stream specs/stories/fragments (`stories/{mat,cmp,surf}/**`, `tests/perf/browser/<stream>/**`, `fragments/*/<stream>.ts`), `certification/review/records/**`, `tests/a11y/manual/**`, `docs/certification/real-device-matrix.md` (FIN-H), product code under `src/**`.

**Clause transfers FIN-G depends on (implemented by the other WP; never edit their files):**
- REQ-QUAL-01/-36/-69 `tests/helpers/index.ts` (`listSubjects` → `resolveSubject`, drop `owner: 'PLAT'` literal; `perf.bci` → `@auraglass/qa` `bci`; `gotoStory` `&ag-cert=1`) → REQ-FIN-08 (FIN-A, PR #115 + follow-up). FIN-G exports the functions first; FIN-A wires them.
- `@axe-core/playwright` pin 4.13.0 (QUAL-20), `yaml@2.9.1` devDependency (QUAL-64), tesseract/`@typescript-eslint/parser` devDeps, `storybook:build` / `test:contract` / `qual:*` npm scripts (QUAL-01, -55, -56, -70), `.gitignore` entry for `certification/budgets.json` (QUAL-38) → FIN-C (REQ-FIN-37, `package.json` non-export keys). Until it lands, FIN-G invokes tools from `ci/qual.gitlab-ci.yml` with `node <script>` and reports the pin as `pending-producer`.
- `certification/baselines/**` CODEOWNERS line (QUAL-25) → FIN-B contract PR on `main` (`.github/CODEOWNERS`).
- `plat:gate:change-class` stage/needs on `qual:certify:l7` (QUAL-26 / S-55) → REQ-FIN-22 (FIN-B); consumer `scripts/release/classify-change.mjs` → REQ-FIN-10 (FIN-A, PR #123).
- PNG allowlist admitting `src/**/assets/` (QUAL-60) → record an OD-19-adjacent decision in `docs/release/decisions/` (FIN-H file; agent drafts, owner decides) and the allowlist in `packages/qa/test/no-committed-evidence.test.ts` reads it.
- MAT story offenders Floors/Presets/Rungs (QUAL-55) and `tests/a11y/storybook-a11y-config.test.ts` reconcile to the frozen `scene` global (QUAL-49..57) → REQ-FIN-59 (FIN-D).
- Flagship renumbering to exactly 44 unique (QUAL-71) and `Keyboard` stories for 43 flagships (QUAL-50) → CMP/SURF owners (FIN-E REQ-FIN-70.., FIN-F REQ-FIN-80..); FIN-G ships the validator with an expiring baseline listing offenders by owner (§4.3 rule 3).
- `--line 4x` (QUAL-33) needs `release/4.x` pipelines → REQ-FIN-20 (FIN-B, PR #126 + OD-8).
- REQ-FIN-05 cert-mode CSS import into `.storybook/preview.tsx` → implemented here under REQ-FIN-106 (FIN-G owns the file).

### FIN-G.1 Land existing open PRs

FIN-G has **no PR of its own**. Mergeable state re-checked 2026-10-10 with `gh api repos/auraoneai/auraglass/pulls/<n>`; changed-file lists scanned for all 241 open PRs. Only three open PRs write FIN-G-owned paths; four more are producers FIN-G consumes. None has a CI check (GitLab 87152036: 0 pipelines, only `main`), so "merge" below always means "after its head SHA's GitLab pipeline is green" (Common rules).

| Slot | PR | Line | Owner WP / REQ | FIN-G path in PR | State (2026-10-10) | Action | Exact conflict/gap to fix |
|---|---|---|---|---|---|---|---|
| A-3 (PRD §20 FIN-A step 3) | #115 `next-fin/a-resolution` | next | FIN-A REQ-FIN-08/09 (QUAL-69) | none | MERGEABLE/CLEAN, 0 checks, head 20b032cfb | MERGE as is (by FIN-A; listed for order only) | FIN-G needs it for real `listSubjects`; FIN-A's follow-up switches `listSubjects` to `@auraglass/qa` `resolveSubject` after G-01 merges. |
| A-7 | #123 `next-fin/a-classify` | next | FIN-A REQ-FIN-10 | none | MERGEABLE/CLEAN, 0 checks, e5689775c | MERGE as is (by FIN-A) | Consumer of `.artifacts/qual/visual-class.json`; producer is FIN-G G-14 (QUAL-26). No FIN-G edit. |
| B-first | #126 `next-fin/b-ci` | next | FIN-B REQ-FIN-20/21/22 | none | MERGEABLE/CLEAN, 0 checks, 0130607f5 | MERGE as is (by FIN-B) | Prerequisite for QUAL-33 and for any `qual:*` job to run. No FIN-G edit. |
| E (any) | #306 `next-fin/cmp-137-perf-budgets` | next | FIN-E REQ-CMP-137 | none (`fragments/perf-budgets/cmp.ts`) | MERGEABLE/CLEAN, 0 checks, bda2f4750 | MERGE as is (by FIN-E) | Input to QUAL-38 `resolve-budgets.mjs`; must pass G-21's `perf-budget-looser` check once G-21 lands (if looser than defaults, FIN-E fixes rows, never FIN-G raising defaults). |
| F, before G-02 | #338 `next-fin/surf-01-exports` | next | FIN-F REQ-SURF-01 | `tests/contract/entries.test.ts` (added, 66 lines) | MERGEABLE/CLEAN, 0 checks, 8abf8a3b8 | TRIM to remaining scope | FIN-F drops `tests/contract/entries.test.ts` from #338 (FIN-G-owned; `contract:ownership` rejects it). FIN-G re-lands it in G-02 (QUAL-70) from this content, replacing the hard-coded `KNOWN_PENDING = new Set(['./forms'])` literal with lane-runner `pending` and the silent `catch { skipped.push }` with an owner-naming failure. REQ-SURF-01 acceptance is evaluated after both merge (§6.1). |
| E, in FIN-E's CSS-sweep sequence (one at a time, `npm run tokens:build` + `generate-exports --check` regenerate between) | #322 `next-fin/cmp-08-css-seam` | next | FIN-E REQ-CMP-08 | `lint/rules/qual/no-permanent-will-change.cjs`, `lint/rules/qual/no-transition-all.cjs` (added) | CONFLICTING/DIRTY, a87d33ca5 | TRIM + REBASE+RESOLVE (rebase is FIN-E's) | FIN-E removes both `lint/rules/qual/*` files from #322 and resolves its conflicts on current `next`. FIN-G adopts the two rules into G-23 (QUAL-45) with the `{meta, create, agConfig}` shape, error on QUAL globs / warn elsewhere, and RuleTester tests; FIN-E's CMP CSS must then pass them. |
| E, after contract PR C-bundle item for `COMPOUND_PARTS` | #320 `next-fin/cmp-06-compound` | next | FIN-E REQ-CMP-06 | `tests/contract/components.test.tsx` (+33/−10) | CONFLICTING/DIRTY, 2013f985d | TRIM + REBASE+RESOLVE (rebase is FIN-E's) | FIN-E drops `tests/contract/components.test.tsx` (FIN-G-owned) and moves its `src/contracts/components.ts` edit to the `contract/v1.2-final` PR (src/contracts changes only there). The #320 test diff also weakens the seam check (accepts any `[data-ag-part]` descendant instead of `root`, skips mounting non-portal roots); FIN-G replaces it in G-02 with a post-seed version that asserts `data-ag-part="root"`, no `data-ag-seed`, and mounts every Root with the required props from its meta fixture. |

Not FIN-G rows (tangential, owned and landed by FIN-E): CMP perf specs under `tests/perf/browser/cmp/` (#221, #250, #251, #253, #258, #262, #264, #301, #329; #262/#264 both edit `overlays-sheet-perf.spec.ts`, both CONFLICTING). L10 (G-20) discovers them by location; FIN-G does not edit them.

Counts: 7 listed · 0 close · 2 rebase (#320, #322, by FIN-E) · 3 trim (#320, #322, #338) · 4 merge as is (#115, #123, #126, #306, by their owners).

### FIN-G.2 Finish partially-merged work

None. 0 FIN-G PRs merged; none of the 18 merged PRs (#352–#369, SURF/MAT batches) touches a QUAL path. The seed files that exist on `next` and are rewritten by G.3 (not follow-ups to a merged PR): `.storybook/{main.ts,preview.tsx,blocks/index.tsx,StorySurface.tsx}`, `certification/playwright.cert.config.ts`, `certification/scenes/*`, `ci/qual.gitlab-ci.yml`, `tests/contract/{components,fragments,material,ownership,preferences}.test.tsx?`, `tests/a11y/apg/harness.ts`.

### FIN-G.3 Build work that has no PR

27 PRs (G-01..G-27), all from `origin/next` in a worktree `../AuraGlass.wt/fin-g-<topic>` on branch `next-fin/g-<topic>`, PR → `next`. FIN-G has no `release/4.x` or `release/4.1.x` code work: 4.x coverage is produced from `next` by `--line 4x` (G-05). Each PR lands green with `pending` for producers that have not landed (§4.3 rule 2) and with an expiring baseline for new cross-stream gates (rule 3); pending states are reported only by the lane runner, never by early `return`/`console.warn`. Local runs: only `npx jest -c jest.qual.config.js <file>` and `tsc -p` on a small config; every browser/OCR/perf/Storybook/pack step runs in GitLab CI or the gated remote runner (`auraone-remote-run`).

Merge order inside FIN-G (all start at once; this is the merge order only): G-01 → G-02 → G-03 → {G-07, G-08} → {G-04, G-05, G-06, G-09, G-10, G-11, G-23, G-24} → G-12 → {G-13, G-14, G-17, G-18, G-19, G-20} → {G-15, G-21, G-22, G-25, G-26} → G-27 → G-16 (verdict last, it reads every lane).

#### G-01 `next-fin/g-qa-package` — REQ-FIN-100 / QUAL-01, -02, -03, -60 · FIN-416, -417, -418, -435
Files (create): `packages/qa/{package.json (private "@auraglass/qa"),tsconfig.json}`, `jest.qual.config.js` (root `jest.config.js` already ignores `<rootDir>/packages/` — verify; if not, that one-line change goes in the contract PR), `packages/qa/src/resolve/resolveSubject.ts`, `scripts/storybook/write-cert-manifest.mjs`, `packages/qa/src/inventory/buildInventory.ts`, `packages/qa/src/pixel/{dhash,duplicates}.ts`, `packages/qa/test/{resolve,inventory,dhash-duplicates,no-committed-evidence}.test.ts`.
Steps:
1. QUAL-01: `resolveSubject` reads the SubjectIndex, maps subject → `ComponentMeta.name` from `src/**/*.meta.ts` or a showcase id from `showcase/showcases.json`; throws on unresolved. `write-cert-manifest.mjs` walks `storybook-static/index.json` + each story's `parameters.ag`, writes `storybook-static/cert-manifest.json` (REPORTS.subjects), fails on index/manifest mismatch for kinds lab/scene/showcase/matrix; wire it into `qual:build:storybook` in `ci/qual.gitlab-ci.yml` (no `package.json` edit). Hand FIN-A the `listSubjects` change (transfer above).
2. QUAL-02: `buildInventory.ts` from `ENTRIES` (TS compiler API over entry source or dist `.d.ts`); classify visual/alias/nonvisual; throw `unclassified-export`; no count literals.
3. QUAL-03: 64-bit dHash + Hamming; duplicate = Hamming ≤2 AND pixelmatch ratio <0.001; visual subject duplicate in ≥90 % of cells and not alias → fail.
4. QUAL-60: `no-committed-evidence.test.ts` (fails when `reports/x.json` or a non-allowlisted PNG is tracked; allowlist reads the recorded `src/**/assets/` decision); artifact `name: evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA` and `expire_in` per `EVIDENCE.expireIn` on every `qual:*` job; register on L1 (G-03). Note `reports/3.2-release/*.json` and `reports/audit/**` exist in the planning checkout — the test must fail on any such path tracked on `next`; removal of existing tracked evidence is FIN-C's (`reports/**` is not FIN-G's).
Tests: `resolve.test.ts` (≥3 throwing fixtures: unresolved subject, id in manifest not in index, reverse), `inventory.test.ts` (unclassified fixture; `/\b(470|498|356)\b/` grep over `packages/qa/**` and `certification/**`), `dhash-duplicates.test.ts` (identical, 1-pixel, distinct, 90 %-duplicate non-alias = fail, alias = pass), `no-committed-evidence.test.ts`.
Acceptance: AC-FIN-100 + ledger QUAL-01 (`jest packages/qa/test/resolve.test.ts` passes with ≥3 throw cases; Storybook build output has `cert-manifest.json` whose ids equal `index.json` ids for lab/scene/showcase/matrix; `rg 'owner: .PLAT. as const' tests/helpers/index.ts` empty — after FIN-A's follow-up), QUAL-02 (injecting an export without meta/`@nonvisual` fails with `unclassified-export`; inserting `498` into a certification file fails), QUAL-03 (positive/negative fixtures as above), QUAL-60 (passes on `next`, fails when `reports/x.json` is git-added; every qual job artifact name matches `evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA`).

#### G-02 `next-fin/g-contract-conformance` — REQ-FIN-100 / QUAL-70 · FIN-419
Files: create `tests/contract/{attributes,css-vars,layers,meta,entries}.test.ts`, `tests/contract/doubles.test.tsx`, `tests/contract/__selftest__/conformance.selftest.test.ts`; modify `tests/contract/components.test.tsx` (replaces the #320 diff, see G.1); define `contract:conformance` invocation in `ci/qual.gitlab-ci.yml` only if the root job (FIN-B `.gitlab-ci.yml`) delegates to it — otherwise hand FIN-B the exact script line.
Steps: attributes test asserts the S-01 attribute set and that the five story-only attributes (`data-ag-story-content|story-kind|cert-ready|lab-override|state-cell`) and `data-ag-seed` are absent from `dist/`; css-vars/layers/meta tests per contract; `entries.test.ts` adopts #338's content with pending mode before GA (lane runner reports `pending`, no literal pending set, no silent skip); `doubles.test.tsx` checks contract doubles match seam types; every failure message names the seam id and owning stream (from `contracts/ownership.json`) and classifies pre-existing vs introduced; mutation self-test breaks a seed copy and asserts the named failure.
Tests: the 6 new files + `__selftest__`; total `npm run test:contract` = 11 files (5 existing + 6 new).
Acceptance: AC-FIN-100 + ledger QUAL-70 (`npm run test:contract` runs 11 files green on `next`; mutation self-test yields the named failure; `contract:conformance` green in a GitLab pipeline with `allow_failure: false`).

#### G-03 `next-fin/g-lane-runner` — REQ-FIN-101 / QUAL-05, -06, -27, -28, -30, -64, -68 · FIN-421, -422, -423, -425
Files: create `certification/run.mjs`, `certification/lanes.config.ts`, `certification/matrix.config.ts` (sentinel set), `certification/ratchets.json`, `certification/exemptions.json` (`[]`), `certification/schemas/lane-manifest.schema.json`, `packages/qa/src/evidence/{laneRunner,coverageThreshold,exemptions}.ts`, `stylelint.showcase.config.mjs`, `packages/qa/test/{lane-runner,fail-closed,ci-fragment,l1-wiring,coverage-ratchet,exemptions}.test.ts`; rewrite `ci/qual.gitlab-ci.yml`.
Steps:
1. QUAL-05: `run.mjs --lane L1..L12|all --scope pr|main|nightly|release [--verdict <path>] [--line 4x]`; `lanes.config.ts` = built-ins + `loadFragments('lanes')`; kinds node-script/jest/playwright/story-subjects/manual-record; reject `remote:false` browser kinds; write `.artifacts/qual/<job-slug>/lane-manifest.json` with sha, scope, runnerTag, imageDigest, browserVersions, subjects, cells, results, thresholdsSha256, scenesSha256, inventorySha256, durationMs, captureRate; pre-existing attribution from `contracts/ownership.json` vs branch prefix.
2. `ci/qual.gitlab-ci.yml`: 12 explicit `qual:certify:l1..l12` jobs (L1–L4, L12 extend `.ag-node`; browser lanes `.ag-playwright`), keep `qual:build:storybook`, `qual:certify:nightly`, `qual:certify:release`; add the seven QUAL-only jobs (QUAL-64): `qual:certify:l10-gpu` (`.ag-gpu`), `qual:certify:devices` (`.ag-aws-remote`), `qual:certify:release-matrix` (dynamic child, `strategy: depend`), `qual:certify:baseline-refresh` and `qual:certify:review-record` (`when: manual`), `qual:certify:known-failures` (nightly), `qual:test:selftest`. Each lane job keeps `allow_failure: true` only until its first green run on `next`, then flips (activation row via FIN-B); `qual:certify:release` never has `allow_failure`. No `GITHUB_*`, `gh`, `CI_JOB_JWT`, `merge_request_event`.
3. QUAL-06 fail-closed: crash / missing manifest / junit 0 tests with ≥1 subject / registered path missing → fail; 0 subjects → pending at pr|main|nightly, fail at release; sentinel set (Surface regular/regular, Button Playground, Dialog open) added to affected-subject PR lanes.
4. QUAL-27 L1: register `npm run lint`, `stylelint --config stylelint.showcase.config.mjs 'showcase/**/*.css'`, every L1 node-script fragment row, `scripts/qual/lint-tests.mjs` (G-19), `verify-css-perf.mjs` (G-23), `verify-dist-perf.mjs` (G-24), story-glass gate (G-10), evidence guard (G-01), zero-`!important` grep over `**/*.stories.tsx`, `showcase/**`, `.storybook/**`. Not-yet-landed gates register as `pending` with the producing G-id.
5. QUAL-28 L2/L3/L4: tarball from `AURAGLASS_TARBALL` (`plat:package:pack` dotenv) else `npm pack --pack-destination .artifacts/pack`; never path-filter L4; empty lane → pending; `needs: plat:package:pack` (optional: true).
6. QUAL-30 L12: `ratchets.json` floors (lines/branches) `src/material/**` 90/85, each flagship dir 85/75, `src/theme/**` 80/70, global 70/60; `coverageThreshold.ts` builds `--coverageThreshold` JSON excluding `@ag-contract-seed` dirs.
7. QUAL-68: validator rejects gate ∈ {ocr-contrast REQ-QUAL-13, console REQ-QUAL-17}, expiry >180 d, expired entries.
Tests: listed six; `ci-fragment.test.ts` parses with `yaml` (pin via FIN-C) and asserts naming, rules, optional cross-stream needs, every `CERT_JOBS` key present, no `|| true`, no `allow_failure` on `qual:certify:release`, baseline-refresh present.
Acceptance: AC-FIN-101 + ledger QUAL-05 (`node certification/run.mjs --lane L1 --scope pr` exits 0/1, never module-not-found, manifest validates; `rg -c '^qual:certify:l(1[0-2]|[1-9]):' ci/qual.gitlab-ci.yml` = 12; pipeline on `next` shows all 12), QUAL-06 (5 failure modes with exit codes; empty release lane exits non-zero in a pipeline), QUAL-27 (`!important` in a story → non-zero; `l1-wiring.test.ts`), QUAL-28 (tarball from env and pack fallback; empty L4 → pending; L2 manifest lists PLAT rows with per-row state), QUAL-30 (lowering a floor fails; `src/material` change <90 % lines exits non-zero), QUAL-64 (`ci-fragment.test.ts`; every `CERT_JOBS` name is a YAML key; pipeline on `next` creates all qual jobs), QUAL-68 (expired, OCR/console, >180 d rejected; valid accepted).

#### G-04 `next-fin/g-shard-quarantine-remote` — REQ-FIN-101 / QUAL-65, -66, -67 · FIN-425
Files: create `scripts/qual/shard-plan.mjs`, `certification/quarantine.json` (`[]`, schema cell/issue/expires ≤7 d), `scripts/qual/remote-guard.mjs` (imported by every browser-launching QUAL script), `scripts/qual/remote/{build-bundle.mjs,worker-entry.sh,preflight.mjs}`, `packages/qa/test/{shard-plan,quarantine,remote-guard}.test.ts`, `scripts/qual/remote/preflight.test.mjs`; modify `certification/playwright.cert.config.ts` (`animations: 'disabled'` for L7), `ci/qual.gitlab-ci.yml` (`qual:certify:release-matrix` trigger, `strategy: depend`; release job downloads shard artifacts via jobs API with `CI_JOB_TOKEN`).
Steps: QUAL-65 shard planner writes `.artifacts/qual/shards.gitlab-ci.yml` with `parallel ≤200` from measured capture rate per runner tag; durations/capture rate in manifests; 5-consecutive-overrun report. QUAL-66 quarantine handling (reported `quarantined`, never `pass` at release), nightly L7 ×2 agreement ≥99.9 %, fonts + image digest in manifest. QUAL-67 guard exits 2 printing the remote command unless `CI=true|AG_REMOTE_RUNNER=1|AG_CERT_ALLOW_LOCAL=1`; offline bundle + `bundle.manifest.json` sha256s; worker verifies hashes, aborts non-127.0.0.1 routes, uploads `.artifacts/qual`, halts at 120 min; preflight exits 78 with the exact message on expired/≤7 d CA (OD-5).
Acceptance: AC-FIN-101 + ledger QUAL-65 (parallel capped at 200 computed from rate; PR p90 ≤20 min, main ≤45, release ≤90 from pipeline history), QUAL-66 (expired >7 d entry fails; quarantined cell at release ≠ pass; nightly manifest shows agreement ratio), QUAL-67 (`preflight.test.mjs`, `remote-guard.test.ts` pass; a cert script run locally without env vars exits 2).

#### G-05 `next-fin/g-line-4x` — REQ-FIN-101 / QUAL-33 · FIN-424
Files: modify `certification/run.mjs`, `packages/qa/src/evidence/laneRunner.ts`, `packages/qa/test/lane-runner.test.ts`, `ci/qual.gitlab-ci.yml`.
Steps: `--line 4x` with two tarball sources — `npm pack aura-glass@$AG_V4_DIST_TAG` and `git fetch origin release/4.x` → scratch worktree → `npm ci && npm pack`; run L2, L3 (G-07 deprecations check) and L11 for both in `qual:certify:nightly` and main-scope l2/l3/l11, rows `line: '4x'`, never blocking. Head-tarball source reports `pending` until REQ-FIN-20 (FIN-B, #126 + OD-8) gives `release/4.x` pipelines.
Acceptance: AC-FIN-101 + ledger QUAL-33 (nightly manifest has `line:'4x'` rows for published and head tarballs; `lane-runner.test.ts` covers both resolutions).

#### G-06 `next-fin/g-canaries-l11` — REQ-FIN-101 / QUAL-29 · FIN-423
Files: create `certification/lanes/canaries.spec.ts`; modify `ci/qual.gitlab-ci.yml` (`qual:certify:l11`). Fixtures in `canaries/**` are FIN-C's (read only).
Steps: run each `canaries/<app>` from the tarball, assert `node_modules/aura-glass` is not a symlink; `next start` for `canaries/next16`, visit every route incl. `app/<stream>/*` in chromium/webkit/firefox (HTTP 200, 0 console errors); consumer-4x unchanged against the 4.x tarball; on 5.x run `migrate 4to5` from `npm pack -w @auraglass/cli` and assert 0 `TODO(aura-glass 5)` on `flagship-subset.json`; missing fixture/command → pending before RC-1, fail at release.
Acceptance: AC-FIN-101 + ledger QUAL-29 (one result per route per engine; removing a route fails; migrate TODO count in manifest; needs a pipeline run).

#### G-07 `next-fin/g-story-root` — REQ-FIN-106 / QUAL-09, -10, -11 + REQ-FIN-05 transfer · FIN-449
Files: create `.storybook/contract/StoryRoot.tsx`, `certification/lanes/_fixtures/determinism.ts`, `tests/storybook/{StoryRoot.test.tsx,storybook-config.test.ts,story-ready.test.tsx}`; modify `.storybook/preview.tsx`, `.storybook/main.ts`; delete `.storybook/StorySurface.tsx`.
Steps: StoryRoot = one `<div data-ag-story-content data-ag-story-kind={kind}>` (no class/style); `data-ag-cert-ready` only after `document.fonts.ready` + all `img.decode()` + two rAFs, removed on unmount. Preview decorator = AuraGlassProvider (props from globals) → Environment (`backdrop=SCENE_BACKDROP[scene]`, image `/scenes/<file>`) → StoryRoot; remove the direct `data-ag-motion` write. Cert mode (`?ag-cert=1`): preview imports only built `dist/styles.css` (never a `src/**/*.css` glob — REQ-FIN-05 transfer), scene painted only via Environment (body background for kind `scene`), every ancestor transparent / no filters / opacity 1. Determinism init script freezes `Date.now`/`new Date` to 2026-03-02T09:30:00Z and seeds `Math.random`; every lane fixture uses it.
Acceptance: AC-FIN-106 + ledger QUAL-09 (`StoryRoot.test.tsx` fails if cert-ready is set before `fonts.ready`; remote Chromium ancestor walk finds 0 painting ancestors), QUAL-10 (`storybook-config.test.ts`: globalTypes deep-equal contract, `decorators.length===1`, no `parameters.backgrounds`, no extra toolbars, no `@storybook/jest|testing-library|test` import; `rg StorySurface .storybook` empty; jsdom render has AuraGlassProvider + `[data-ag-backdrop]`), QUAL-11 (`story-ready.test.tsx` passes with fake timers not advanced and fails for a `setTimeout`-open fixture; `rg addInitScript certification/lanes` finds the shared fixture); REQ-FIN-05 (cert-mode preview has exactly one CSS import, `dist/styles.css`).

#### G-08 `next-fin/g-storybook-build` — REQ-FIN-106 / QUAL-56, -57 · FIN-452
Files: modify `.storybook/main.ts` (`AG_STORYBOOK_DIST=1` `viteFinal` resolving to package exports/dist; add `@storybook/addon-a11y`), `ci/qual.gitlab-ci.yml` (`qual:build:storybook` optional `needs: plat:build:dist`, fallback `npm run build`, then the three writers); create `scripts/storybook/{write-build-manifest,write-apg-manifest,verify-fresh}.mjs` (with `write-cert-manifest.mjs` from G-01 = the four scripts), `tsconfig.storybook.json`, `tests/storybook/verify-fresh.test.mjs`, `tests/e2e/qual/storybook/*.spec.ts` (≥6 S1 flows: S1-1 send → tool-call approval, S1-6 sheet detent change, Lab control round-trips, one per S1 showcase); extend `tests/storybook/storybook-config.test.ts` (import scan). Add `tsc --noEmit -p tsconfig.storybook.json` to L1. Every browser lane runs `verify-fresh` first.
Acceptance: AC-FIN-106 + ledger QUAL-56 (4 `verify-fresh` cases: missing manifest, SHA mismatch, dirty, hash mismatch; CI `qual:build:storybook` writes `ag-build.json` with `sha == CI_COMMIT_SHA`, ≤60 MB excluding maps, ≤6 min), QUAL-57 (config test fails on a planted `@storybook/test` import; ≥6 S1 flow specs; addon-a11y in `main.ts`).

#### G-09 `next-fin/g-story-ia` — REQ-FIN-106 / QUAL-49, -50, -51, -52 · FIN-450
Files: modify `.storybook/preview.tsx` (`parameters.options.storySort.order` = the exact REQ-QUAL-49 array, flagships by `ComponentMeta.flagship`; `parameters.docs.page`), `.storybook/blocks/index.tsx` (`<caption>` + `scope=col` `th` in `T`, remove `@ag-contract-seed`); create `scripts/storybook/{lint-titles,lint-story-copy,write-apg-index}.mjs`, `stories/qual/StartHere.mdx`, `tests/storybook/{lint-titles.test.mjs,story-contract.test.ts,lint-story-copy.test.mjs,docs-pages.test.mjs,start-here.test.mjs}`.
Steps: title lint's 8 rules (version segment, lowercase leaf, `Glass` prefix, title in >1 group, leaf ≠ `meta.name`, >12 non-matrix stories, oversize non-flagship title, `{Default,Variants}`-only); story-contract validator (S-41: `parameters.ag {subject,kind}`, tags ⊆ `STORY_TAGS`, flagships export Playground/States/Keyboard, Keyboard tagged `apg` and referenced under `tests/a11y/apg/<owner>/`, no `.storybook/**` imports, no `any`), failures attributed by owner, current offenders (≈43 flagships missing Keyboard) in an expiring baseline in `certification/baselines-gates/story-contract.json` that streams shrink; docs page renders Usage/Anatomy/material role/Keyboard/Migration/Selectors; Start Here counts computed from `index.json` + inventory + `package.json` version with a `?path=` link validator.
Acceptance: AC-FIN-106 + ledger QUAL-49 (one failing fixture per rule; built-index run lists violations per owner; storySort deep-equals REQ array), QUAL-50 (per-owner failures; fixture tests pass; banned word fails `lint-story-copy.test.mjs`), QUAL-51 (`docs-pages.test.mjs` 44×6 sections, pending before metas exist; `rg '<caption' .storybook/blocks/index.tsx` ≥1; no `@ag-contract-seed` in `.storybook/blocks`; no MDX imports `*.apg.spec.ts`), QUAL-52 (`start-here.test.mjs`; bogus `?path=` fails; `rg '5\.[0-9]\.[0-9]' stories/qual/StartHere.mdx` empty).

#### G-10 `next-fin/g-material-lab` — REQ-FIN-106 / QUAL-53, -54, -55 · FIN-451
Files: create `.storybook/lab/MaterialLab.stories.tsx`, `.storybook/lab/{ContrastReadout.tsx,LabControls.tsx,SpecKnobs.tsx}`, `scripts/qual/lint-stories.mjs`, `tests/storybook/{storybook-index.test.mjs,contrast-readout.test.tsx,lab-import-guard.test.ts}`, `tests/lint/qual/story-rules.test.ts`.
Steps: 12 lab stories in order Overview, Regular, Clear, Identity, Content Raised, Content Sunken, Tiers ("inert on this engine" when `data-ag-engine` ≠ chromium), Nesting & Groups, Shape & Concentricity, Scroll Edge, Preferences, Motion — composing only S-05/S-06 exports and S-21/S-22 hooks; controls (discrete Surface props + `--ag-light-angle/--ag-specular/--ag-glass-opacity`), spec-knob panel on `[data-ag-lab-override]` ("pending seam" until CC-Q2), Spec deviation badge, Reset, Export MaterialSpec patch validated against `TokenManifestEntry` `glass-material`; ContrastReadout (canvas readback, `role=status`, ≤100 ms debounce, labelled "estimate"); import guard (no `src`/`showcase`/`registry` import of `.storybook`) + dist/tarball scan for the five story-only attributes; `lint-stories.mjs` six checks (story-no-optics/no-important/no-ink-override/no-tone-class/no-stage-background/no-private-vars), ignores disable comments, error on QUAL paths, report-only per-stream counts elsewhere (Floors/Presets/Rungs → FIN-D REQ-FIN-59 in the expiring baseline); record the `legacy/**` exclusion decision in the PR.
Acceptance: AC-FIN-106 + ledger QUAL-53 (exactly 12 lab ids in order; Overview subjects ≥360×240 at 1440), QUAL-54 (three tests; ContrastReadout within ±0.05 of reference WCAG; `npm pack --dry-run` and `dist/` contain no `.storybook` file and none of the five story-only attributes), QUAL-55 (`story-rules.test.ts` ≥4 valid + ≥4 invalid per check + disable-comment fixture; script reports per-stream counts and exits non-zero on a planted QUAL-path violation).

#### G-11 `next-fin/g-scenes` — REQ-FIN-102 / QUAL-07, -08 · FIN-427, -428
Files: add `certification/scenes/{photo,saturated-abstract,dense-text,dark-media,flat-white,flat-black,hf-pattern,video-frame}.<ext>` + `video-frame.webm` (2 s) (replace the 800×500 `photo.jpg`), fill `certification/scenes/scenes.manifest.json`; create `certification/scenes/Scenes.stories.tsx`, `packages/qa/test/scenes-manifest.test.ts`, `tests/storybook/{scene-bands.test.mjs,cert-scenes.test.ts}`.
Steps: each asset ≥2880×1800, total ≤6 MB, photo and dark-media CC0/owned; manifest per asset `{sha256, licence, source, width, height, meanLuminance, luminanceSigma, backdrop (= SCENE_BACKDROP)}` with luminance numbers written by a script, never by hand; band tests (flat-white mean ≥245, flat-black ≤12, dark-media ≤70, video-frame ≤100, σ ≥40 photo/saturated, Hasler–Süsstrunk ≥60, hf-pattern block test, dense-text ≥400 OCR words via tesseract — remote); tarball excludes scenes (assert in `scenes-manifest.test.ts` via `npm pack --dry-run --json`; the `files` key is FIN-C's if a change is needed). 8 stories `scenes--<id>`, tag `scene`, `parameters.ag {subject:'scene:<id>', kind:'scene'}`, each with 12 Surface cells (regular|clear|identity|content-raised × thin|regular|thick, ≥240×160 at 1440, ≥160×120 at 390, 2-line label + 14 px paragraph) and a strip of Button, SegmentedControl, Slider, TextField, Switch, Toast from public entries.
Licence rule: licence/source recorded from the real source; if no licensed asset is available for an id, report `blocked-owner` (owner supplies or approves the asset) — never invent provenance.
Acceptance: AC-FIN-102 + ledger QUAL-07 (`ls certification/scenes` shows 9 asset files; manifest 8 entries; both tests pass; `du -c` ≤6 MB; `npm pack --dry-run` lists no `certification/scenes` file), QUAL-08 (`index.json` has exactly `scenes--photo`..`scenes--video-frame`; `cert-scenes.test.ts` asserts 12 `[data-ag-surface]` + 6 flagship roots and root `data-ag-backdrop` = manifest value).

#### G-12 `next-fin/g-capture-matrix` — REQ-FIN-102 / QUAL-04, -12 · FIN-429
Files: create `packages/qa/src/matrix/{axes,prune,force,shard}.ts`, `certification/lanes/environment-visual.spec.ts`, `certification/lanes/_fixtures/fragments.ts` (fragment loader validating project shape), `packages/qa/test/matrix-prune.test.ts`; modify `certification/playwright.cert.config.ts` (`testDir: 'certification/lanes'`, chromium/webkit/firefox projects, CMP/SURF fragment cert projects loaded instead of dropped).
Steps: §4.3 axes, pruning, cell id `<storyId>|<scene>|<engine>|<axes>`, `shards = ceil(captures/(rate*3600))`; one test per subject-state × cell against `AG_STORYBOOK_URL`, 60 s timeout, DPR 1/3, states driven from `parameters.ag.states[].drive` marked `data-ag-state-cell`; live subjects only — each capture's `sourceStoryId` must be in the same pipeline's `storybook-static/index.json`, Storybook built against the packed tarball (`AG_STORYBOOK_DIST=1`), never reading other jobs' screenshots/JSON; lane manifest records tarball sha256. Add the REQ-QUAL-09 ancestor + outside-pixel (≤0.5 %) assertions here.
Acceptance: AC-FIN-102 + ledger QUAL-04 (a test fails when a capture references an id absent from `index.json`, via fixture manifest; manifest records tarball sha256), QUAL-12 (`matrix-prune.test.ts` asserts 180/148/29/96/29/24 cells; `npx playwright test -c certification/playwright.cert.config.ts --list` — remote — lists only `certification/lanes` + fragment cert projects).

#### G-13 `next-fin/g-pixel-gates` — REQ-FIN-102 / QUAL-13..18 · FIN-430
Files: create `packages/qa/src/ocr/{tesseract,twin,contrast}.ts`, `packages/qa/src/pixel/{materialPresence,notBlank,separation,frameFill,density,neon,intentDelta}.ts`, `packages/qa/src/inspect/layout.ts` (port of `collectLayoutIssues`), `packages/qa/src/evidence/readback.ts`, `certification/thresholds.json`, `certification/console-allowlist.json`, `certification/lanes/{preference-modes,console}.spec.ts`, containment/target/focus suites + 768×1024 layout pass inside `environment-visual.spec.ts`, negative fixture stories in `stories/qual/fixtures/**`, `packages/qa/test/{ocr-contrast,material-presence,pixel-gates,labels,console-allowlist}.test.ts`.
Steps: QUAL-13 `tesseract --psm 11` on 2× Lanczos upscale, TSV parse, text-hidden twin (`color: transparent`), median glyph vs twin box colour, 4.5/3/7, large-text rule from DOM font-size/weight, APCA reported only, fail when ≥1 visible text node and 0 OCR words, tesseract version in manifest; `AG_PLAYWRIGHT_IMAGE` must carry tesseract 5 (image is FIN-B's `ci/plat/**`; request it there if missing). QUAL-14 glass-over-nothing (σ(L) <4 under border box in a scene with σ ≥20), flat-white vs flat-black interior Δ ≥30 for regular, ≤(1−floorAlpha)·255+5 with floorAlpha from `dist/tokens/manifest.json` `glass-material` (pending when absent). QUAL-15 `thresholds.json` keys `notBlank.minDeviation=40`, `separation.minShare=0.25/minDelta=10`, `frameFill` (component/lab 0.03; matrix/scene/showcase 0.25), `density.max=0.3`, `neon` (1 %, S≥0.85 V≥0.85, ≤3 hue families), `intentDeltaE=10`; gates via in-page `getImageData` or pixelmatch, no PNG decoder dependency. QUAL-16 contrast-more changes ≥0.5 % surface pixels and raises worst OCR contrast or reaches 7:1; tinted cuts σ(interior)/σ(scene) ≥25 %; solid + forced-colors → 0 `backdrop-filter` incl. `::before`; 0.000 Δ → `preference-noop`. QUAL-17 `pageerror`/`console.error` fail, `console.warn` fails unless allowlisted and unexpired (`{regex, owner, expires ≤90 d}`); read-back of scheme/preference/engine/tier/transparency with `label-mismatch` incl. forcedColors emulation reading back false. QUAL-18 containment at 390×844 (ancestor overflow-x clipping disabled, `scrollWidth ≤ clientWidth+1`, no subject pixel on right edge), targets ≥44×44 or 24×24 + spacing for declared `sm`, focus indicator ≥3:1 on every scene, 768×1024 layout-only pass for product scenes.
Acceptance: AC-FIN-102 + ledger QUAL-13 (`ocr-contrast.test.ts` passes remotely with tesseract 5 — 4.6:1 pass, 2.1:1 fail, large 3.1:1 pass; the 4.1 App Shell fixture 1.12–2.14:1 fails), QUAL-14 (opaque-stage fixture → `glass-over-nothing`; missing floor key → pending), QUAL-15 (`pixel-gates.test.ts` ≥14 cases, all pass; no PNG-decoder dependency added — diff check on `package.json`), QUAL-16 (spec fails on a fixture ignoring `data-ag-contrast`, passes on Surface regular once MAT CSS lands; remote Playwright run), QUAL-17 (`labels.test.ts` fails on mismatch; console spec fails on a throwing fixture; allowlist rejects expiry >90 d), QUAL-18 (each suite fails on its negative fixture — overflowing, 20 px target, low-contrast ring — remotely).

#### G-14 `next-fin/g-regression` — REQ-FIN-103 / QUAL-24, -25, -26 · FIN-432, -433
Files: create `certification/lanes/regression.spec.ts`, `packages/qa/src/evidence/visualClass.ts`, `scripts/qual/baseline-refresh.mjs` (candidate PNGs + `baseline-diff-report.html`), `packages/qa/test/{baselines-budget,baseline-refresh,visual-class-report}.test.ts`; modify `certification/playwright.cert.config.ts` (`snapshotPathTemplate: certification/baselines/linux/<engine>/<subject>/<state>__<scene>__<scheme>__<viewport>.png`), `certification/run.mjs` (L7 non-QUAL branch → `changed` + pending + exit 0 for that cell; release: changed/pending ≠ pass), `ci/qual.gitlab-ci.yml` (`qual:certify:l7`, `qual:certify:baseline-refresh` `when: manual` + schedule, in `AG_PLAYWRIGHT_IMAGE`).
Steps: `locator.screenshot` (animations disabled, caret hidden) over 10 configs per subject-state (chromium+webkit × photo,flat-white × light,dark @1440; chromium photo light @390; firefox photo light @1440); `toHaveScreenshot({threshold:0.1, maxDiffPixelRatio:0.002})`, `maxDiffPixels` floor 20 below 10,000 px²; visual-class: merge-base vs head element-cropped PNGs for every default-preference cell at 1440×900 and 390×844, pixelmatch `VISUAL_TOLERANCE` (0.1, includeAA false), `changed = changedRatio > 0.001`, write `.artifacts/qual/visual-class.json` (REPORTS.visualClass). Baseline PNGs are produced only by the refresh job and committed through a reviewed `next-qual/baselines-<yyyymmdd>` PR with an L14 record — never by this PR. CODEOWNERS line and change-class stage order: transfers (FIN-B).
Acceptance: AC-FIN-103 + ledger QUAL-24 (`baselines-budget.test.ts`: each PNG ≤80 KB, tree ≤30 MB, no `-darwin` names, no tEXt chunks; regression reports `changed` on a 1 % fixture), QUAL-25 (`baseline-refresh.test.ts`: `next-cmp/x` diff → pending + exit 0; `next-qual/baselines-20261008` diff without L14 record → fail; release + changed → fail; `ci-fragment.test.ts` finds the refresh job), QUAL-26 (0.2 % diff → `changed:true`, 0.05 % → `false`; nightly `next` artifact has `visual-class.json` with `changedCount` = changed cells and `plat:gate:change-class` logs that it read it — needs #123 + REQ-FIN-22).

#### G-15 `next-fin/g-known-failures` — REQ-FIN-103 / QUAL-32 · FIN-434
Files: create `packages/qa/src/inspect/**` (port of `legacy/tests/visual/design-system/token-purity-layout-audit.spec.ts:852-2232`, read from `legacy/`, never imported), `packages/qa/fixtures/**` (port of `:3930-4128`), `packages/qa/test/inspect.fixtures.test.ts`, `certification/lanes/known-failures.spec.ts`; add nightly `qual:certify:known-failures` to `ci/qual.gitlab-ci.yml` (checks out `v4.1.0` in a scratch dir, builds its Storybook, runs L6/L7/L8). Port before FIN-C deletes `legacy/**` (FIN-C removal work, RM rows); if it is already gone, read it with `git show v4.1.0:<path>`.
Acceptance: AC-FIN-103 + ledger QUAL-32 (10/10 fixture verdicts identical; nightly job reports all five gate ids against v4.1.0: `3-2-app-shell` OCR ≤2.2:1, `glass-modal` cost 12>6, 12 stories `preference-noop`, `liquid-glass-showcase` 12 filters under forced-colors, `PageTransitionDemo` pageerror; a detector change that drops any of them fails).

#### G-16 `next-fin/g-evidence-verdict` — REQ-FIN-103 / QUAL-61, -62, -63 + REQ-FIN-111 tooling (QUAL-73 agent part) · FIN-435, -436
Files: create `packages/qa/src/evidence/{verify,claims,verdict,composite}.ts`, `certification/RELEASE_CHECKLIST.md` (G-01..G-16 → lanes/artifacts), `certification/review/visual-rubric.md` (R1–R7, scores 1–4), `certification/schemas/{review-record,release-verdict}.schema.json`, `scripts/qual/review-record.mjs`, `packages/qa/test/{evidence-verify,claims,release-verdict,review-record}.test.ts`; modify `certification/run.mjs` (`--verdict`), `ci/qual.gitlab-ci.yml` (`qual:certify:review-record` `when: manual`; render checklist into the release artifact). Do **not** create anything under `certification/review/records/**` (FIN-H).
Steps: QUAL-61 verifier ports `legacy/scripts/audit/verify-visual-evidence.js` provenance binding: per-lane L1–L12 manifests with results >0; recomputed inventory/thresholds/scenes/baselines sha256; required cells per visual subject; non-blank PNG of declared size; L13/L14 records per flagship + S1 showcase bound to the SHA (or an unchanged-baseline earlier SHA); no expired exemption/console-allowlist entry; 0 quarantined. QUAL-62 `claims.json {id:{value,unit,source:{artifact,sha,path}}}` from verified manifests only; any lane ≠ pass → exit non-zero, no file. QUAL-63 ReleaseVerdict `{version:1, sha, tag, items: G-01..G-16, ga}`; external items G-11/12/14/15/16 read from owner artifacts else `pending`; L13/L14 gate at RC-1; advisory on pre-release/4.x; the aggregator consumes `.artifacts/qual/a11y-manual-<sha>.json` from FIN-H. REQ-FIN-111 composite (8 scenes × light/dark at 1440, 390 photo, previous baseline, diff heat-map) and the review-record job validating human-made records against the schema and the RC SHA (pass = all ≥3, none 1).
Acceptance: AC-FIN-103 + ledger QUAL-61 (≥8 omission cases each failing, one complete synthetic set passing), QUAL-62 (one non-pass lane → no file, exit ≠0), QUAL-63 (validates against S-55 type and the double; `node certification/run.mjs --lane all --scope release --verdict out.json` on a synthetic set emits 16 items and `ga=false` when any pending), QUAL-73 agent part (`review-record.test.ts` passes). The AC-FIN-111 human scores are FIN-H.

#### G-17 `next-fin/g-behaviour` — REQ-FIN-104 / QUAL-19, -20 · FIN-438, -439
Files: modify `tests/a11y/apg/harness.ts` (line 52 today: `builder.withRules(['color-contrast'])` disables every other rule); create `tests/a11y/browser/axe.spec.ts`, `tests/a11y/browser/__selftest__/harness.selftest.spec.ts` + fixture page, `certification/lanes/behaviour.spec.ts`; modify `certification/playwright.cert.config.ts` (location-based discovery of `tests/a11y/apg/<stream>/**/*.apg.spec.ts` and `tests/e2e/<stream>/**` in addition to fragment projects).
Steps: axe always runs the full ruleset; `colorContrast:false` only `disableRules(['color-contrast'])`; return/throw by impact (serious/critical; moderate optional); each step wrapped and rethrown as `step <i>: expected <x>, actual <y>` reading the real activeElement part/role/attr; remove the seed marker; pin `@axe-core/playwright` 4.13.0 (FIN-C transfer). Behaviour lane: axe over `listSubjects()` in photo and flat-white × light/dark with color-contrast on; serious/critical fail, moderate fails for flagships; all 8 scenes nightly/release in chromium+webkit; forcedColors/contrast/reducedMotion emulation + `data-ag-transparency=solid`; flagship without APG spec pending before RC-1, fail at release; self-run against `tests/contract-doubles/cmp/*` recording `double-pass`.
Acceptance: AC-FIN-104 + ledger QUAL-19 (`--list` remote includes `tests/a11y/apg/{cmp,mat,surf}/**` and `tests/e2e/*/**` in 3 engines; double-pass recorded), QUAL-20 (selftest ≥8 cases passes remotely; `colorContrast:true` on missing-alt fixture reports `image-alt`; message matches `/step \d+: expected .* actual/`).

#### G-18 `next-fin/g-ssr-engine-motion` — REQ-FIN-104 / QUAL-21, -22, -23 · FIN-440
Files: create `certification/lanes/{ssr-hydration,overlay-stacking,engine,motion}.spec.ts`, negative fixture stories in `stories/qual/fixtures/**`, `packages/qa/test/settled-idle.selftest.test.ts`. `renderAgServer` (await hydration: `act` + microtask flush before restoring console) and `perf.frames` (store rAF id, cancel on collect) live in `tests/helpers/**` → FIN-A transfer under REQ-FIN-08; FIN-G writes the failing unit tests in `tests/storybook/` against the helper API and hands the fix to FIN-A.
Steps: SSR then `hydrateRoot` per flagship in each engine: 0 console warnings/errors, 0 `<html>` `data-ag-*` mutations after AuraGlassScript, 0 React commits in first 1 s (`react-dom/profiling` + Profiler), 0 `className`/`data-ag-tier` mutations on `[data-ag-surface]`; Dialog → Menu → Tooltip closes LIFO on Escape, z-order per S-25. Engine: WebKit 32×32 probe over hf-pattern cuts σ(L) ≥60 % vs surface-hidden; Gecko refraction = standard within 0.001 with 0 `url()` backdrops; Chromium enhanced bezel rect intersects 0 text rects. Motion: 12-frame strip ≥3 distinct frames on entrance; reduce+none → 0 rAF and 0 running animations over 1 s after 500 ms settle; final opacity 1, scale 1; settledIdle 0 rAF/intervals/infinite animations except indeterminate progress; no `will-change ≠ auto` 100 ms after settle; no `backdrop-filter` on `::view-transition-*`.
Acceptance: AC-FIN-104 + ledger QUAL-21 (both specs in 3 engines remotely; `Date.now()` mismatch fixture fails; a `renderAgServer` unit test catches a hydration warning), QUAL-22 (3 engine projects remotely; no-`-webkit-backdrop-filter` fixture fails on WebKit), QUAL-23 (passes on Surface, fails on an infinite-animation fixture; after `perf.frames` returns, settledIdle reports 0 pending rAF).

#### G-19 `next-fin/g-vacuous-gate-deliverables` — REQ-FIN-104 / QUAL-31, -71 · FIN-441, -442
Files: create `scripts/qual/lint-tests.mjs` (`@typescript-eslint/parser` AST), `tests/lint/qual/no-vacuous-assertions.test.ts`, `scripts/qual/deliverables/check.ts`, `packages/qa/test/deliverables.test.ts`; register both on L1 (G-03).
Steps: QUAL-31 flags expect(container).toBeInTheDocument(); expect inside `if` with no failing else; `querySelectorAll` loop with no preceding length assert; `animationDuration` via `getComputedStyle` in jsdom; `toMatchSnapshot` on DOM under `src/**`; jsdom color-contrast; plus the "missing subject returns" early-return pattern (REQ-FIN-08); error on QUAL paths, report-only elsewhere until RC-1. QUAL-71 per flagship: meta, parts, `migration.selectors`, registry block, APG spec under `tests/a11y/apg/<stream>/`, size-budgets row, perf grade ≥C, L7 baselines, codemod fixtures in `fragments/codemods/<owner>/fixtures/`; pending before RC-1, fail at release; today metas have 43 distinct flagship numbers with duplicates → report offenders by owner (CMP/SURF renumber).
Acceptance: AC-FIN-104 + ledger QUAL-31 (≥1 invalid fixture per pattern, each exactly one diagnostic; ≥1 valid fixture with 0; run over `src/**` lists current violations by owner), QUAL-71 (`deliverables.test.ts` passes; check reports exactly 44 flagships with per-item status).

#### G-20 `next-fin/g-perf-harness` — REQ-FIN-105 / QUAL-34, -35, -36 · FIN-444
Files: create `tests/perf/harness/{run-perf.mjs,perf-results.schema.json}`, `tests/perf/qual/harness-selftest.spec.ts`, `stories/qual/perf/PerfFixtures.stories.tsx`, `tests/storybook/perf-fixtures-index.test.mjs`, `packages/qa/src/perf/bci.ts`, `packages/qa/test/bci.test.ts`; `ci/qual.gitlab-ci.yml` `qual:certify:l10` (`.ag-playwright`) and `qual:certify:l10-gpu` (`.ag-gpu`). `perf.bci` in `tests/helpers` is switched to `@auraglass/qa` `bci` by FIN-A (transfer).
Steps: harness covers Chrome trace frame p50/p95/p99 + dropped frames, CDP `Performance.getMetrics` deltas, CompositeLayers/Raster/GPU tasks, longtask + LoAF, event-timing, GPU proxies incl. BCI, heap delta over 10 cycles, settled idle, per-subject esbuild bytes vs the SizeBudgetRow; transition and settled windows separate; profiles a/b/c/d; fail on software compositing in (a); exit 2 `remote-only` without `AG_REMOTE_RUNNER=1`. Fixture ids `perf-harness-blank--default`, `perf-nesting--nest-4`, `perf-budget--budget-7`, `perf-lens--lens-3`, `perf-webgl--webgl-3`, `perf-mount-cycle--default` from S-06 Surface/SurfaceGroup + public entries; blank baseline subtracted; `interaction:default` for flagships with no drive steps. BCI = Σ (visibleArea/viewportArea) × (blurPx/20) over elements and `::before` with `backdrop-filter ≠ none`, clipped to viewport, plus effective nesting.
Acceptance: AC-FIN-105 + ledger QUAL-34 (local run without `AG_REMOTE_RUNNER` exits 2; selftest fails the run on an injected 200 ms long task and an animated blur; pipeline `perf-results.json` validates against the schema), QUAL-35 (index has all 6 ids; blank-vs-blank Δ 0±1 ms), QUAL-36 (`bci.test.ts`: full-viewport 20 px = 1.0, 12 px scrim = 0.6, 4.1 modal fixture ≥2.4; `perf.bci` returns 1.0, not a capped fraction — after FIN-A's switch).

#### G-21 `next-fin/g-perf-grades-budgets` — REQ-FIN-105 / QUAL-37..41 · FIN-445
Files: create `packages/qa/src/perf/grade.ts`, `scripts/qual/perf/{grade,resolve-budgets}.mjs`, perf section in `certification/thresholds.json`, `certification/calibration.json` (`{"sha": null}`), `tests/perf/qual/{surface-budget,pr-ratchet,regression-4x}.spec.ts`, `tests/perf/qual/budgets-frozen.test.ts`, `packages/qa/test/grade.test.ts`; `ci/qual.gitlab-ci.yml` (`l10-gpu` `parallel: ceil(subjects×perSubjectSeconds/600)` on PRs touching `src/**`).
Steps: A–F grades (lowest column wins; F without a size-budget row) → `.artifacts/qual/perf-report.json` (profiles desktop-120hz and mid-mobile on main/nightly/release); release gate T1 < C, T2 < D, or a ≥1-letter drop vs previous release on the same runner tag fails. `resolve-budgets.mjs` merges defaults with `loadFragments('perf-budgets')` (incl. #306 rows), fails `perf-budget-looser`, writes git-ignored `certification/budgets.json` (`.gitignore` via FIN-C). `surface-budget.spec.ts` 3 engines × 3 scroll positions with all overlays open at 1440×900, 1920×1080, 390×844. Calibration recorded only once Button and Dialog are seed-free, never before; `budgets-frozen.test.ts` pending until `calibration.sha` set, then fails on any raised max or remaining `provisional:true` vs merge base; document the `Perf-Budget-Raise:` window. PR ratchet: affected flagships from import graph + sentinel, fetch merge-base main `perf-report.json`, fail on p95 regression > max(10 %, 1 ms) or any BCI/blurred-surface increase. `regression-4x.spec.ts` (profile c) over flagships + `ai-command-center`, `ops-console`: Dialog open ≥50 fps desktop+mobile, both AppShell scenes ≥50 fps, each ≥0.85× blank, 0 library long tasks >50 ms; pending while subjects are seeds.
Acceptance: AC-FIN-105 + ledger QUAL-37 (`grade.test.ts` every column boundary; pipeline `perf-report.json` validates against PerfReport and is consumed by PLAT docs-claims), QUAL-38 (looser fixture row → non-zero; per-subject results in 3 engines in a pipeline), QUAL-39 (set sha + raised max fixture fails; null sha → pending), QUAL-40 (base fixture + head 15 % slower fails; PR pipeline on a `src/**` change shows l10-gpu jobs finishing ≤10 min), QUAL-41 (per-subject fps; pending for seed subjects; fails on a fixture throttled <50 fps).

#### G-22 `next-fin/g-perf-invariants` — REQ-FIN-105 / QUAL-42, -43 · FIN-446
Files: create `tests/perf/qual/instrument.js`, `tests/perf/qual/mount-unmount-leak.spec.ts`, `tests/perf/qual/{backdrop-root,lens-defs,webgl-context,a11y-fallback}.spec.ts`, negative fixtures in `stories/qual/fixtures/perf/**`.
Steps: instrument wraps add/removeEventListener on window/document, rAF/cAF, setInterval/clearInterval, Mutation/Resize/IntersectionObserver; 10 cycles per flagship with `--js-flags=--expose-gc` → listeners back to baseline, 0 pending rAF/intervals/observers, heap Δ ≤1 MB. Invariants in chromium/webkit/gecko over every subject cell: `.ag-surface` host is not a backdrop root; exactly one `svg[data-ag-lens-defs]` with 10 enhanced surfaces and 0 `url()` backdrops on Gecko/WebKit; ≤1 WebGL context with 3 `./three` surfaces, released on unmount, 0 rAF while hidden, DPR ≤1.5; 0 `backdrop-filter` elements under forced-colors, solid transparency and lightweight tier. All in `qual:certify:l10`.
Acceptance: AC-FIN-105 + ledger QUAL-42 (window-listener leak fixture fails, clean passes), QUAL-43 (each spec runs in 3 engines in l10 and fails on its seeded negative fixture).

#### G-23 `next-fin/g-perf-lint` — REQ-FIN-105 / QUAL-44, -45 · FIN-446 (adopts the 2 rules trimmed from #322)
Files: create `scripts/qual/stylelint-perf/*.mjs` (plugins), `scripts/qual/verify-css-perf.mjs`, `tests/lint/qual/css-perf.test.ts`, `lint/rules/qual/{no-transition-all,no-permanent-will-change,no-translatez-hack,no-global-pointer-listener,raf-requires-cancel,raf-requires-visibility-gate}.cjs` (each `{meta, create, agConfig}`, error on QUAL globs, warn elsewhere, auto-discovered by the lint loader), `tests/lint/qual/{layer-forcing,raf,no-global-pointer-listener}.test.ts`.
Steps: plugins: blur radius ∈ {0,12,20,32}px; backdrop-filter value regex from REQ-QUAL-44; no `translateZ(0)`/`translate3d(0,0,0)`/`backface-visibility` hacks; `will-change` only under `[data-ag-animating]`/`[data-starting-style]`/`[data-ending-style]`; no transitions/keyframes on `backdrop-filter`, `filter`, `--_ag-blur` or layout properties. `verify-css-perf.mjs` over `dist/**/*.css` + `src/**/*.css`: error on QUAL paths and dist, report-only per stream until RC-1; L1. If #322 merges before its trim, this PR modifies the two files instead of adding them — never both.
Acceptance: AC-FIN-105 + ledger QUAL-44 (≥1 invalid fixture per rule fails; run on `src/**/*.css` emits a per-owner report), QUAL-45 (`npx eslint --print-config` shows the 6 `auraglass/*` rules; three RuleTester files pass with ≥36 cases, ≥3 valid + ≥3 invalid per rule).

#### G-24 `next-fin/g-dist-perf` — REQ-FIN-105 / QUAL-46, -47 · FIN-446
Files: create `scripts/qual/verify-dist-perf.mjs`, `tests/perf/qual/dist-perf.test.ts` + fixture dist files, `tests/perf/qual/node-cold-import.test.mjs`; register on L1 and L2 (G-03).
Steps: ban `ChartJS.register`, `Chart.defaults`, `defaults.plugins`, module-scope `window.x =`; `.animate`/`style.transition` on blur/filter/layout; `elementsFromPoint`; `MutationObserver` outside the allowlist; `feTurbulence`; per-export esbuild metafile bundle of `import {X} from 'aura-glass'` with no module from chart.js, react-chartjs-2, date-fns, three, @react-three, motion, framer-motion, d3-*; min+gzip-9 bytes per export into the L2 manifest. Cold import (remote L2 only): tarball into scratch project, 11 fresh node processes per entry on Node 20.19.0 and 22 LTS, drop page cache first (or record fallback); fail if `.` median >150 ms or p90 >200 ms, `./material`/`./tokens`/`./primitives` median >30 ms, or runner tag missing.
Acceptance: AC-FIN-105 + ledger QUAL-46 (`ChartJS.register` fixture fails; L2 manifest has bytes map keyed by export), QUAL-47 (L2 manifest records Node versions, runner tag, per-entry medians; fails when `CI_RUNNER_TAGS` unset).

#### G-25 `next-fin/g-devices` — REQ-FIN-105 / QUAL-48 agent part · FIN-447
Files: create `scripts/qual/devices/device-farm-run.mjs` (`--self-check` offline), `tests/perf/qual/device-farm-self-check.test.mjs`; `ci/qual.gitlab-ci.yml` `qual:certify:devices` extending `.ag-aws-remote`. `docs/certification/real-device-matrix.md` (sign-off template) is FIN-H's file — FIN-H agent prep creates it; FIN-G's runner writes results JSON as artifact only.
Steps: AWS Device Farm (iPhone 13 Safari 18 and 26, Pixel 7, Moto G Power class) + EC2 `mac1.metal` Safari host using only the instance role (`/Users/gurbakshchahal/.local/bin/aws`, operator chain, no `--profile`, no credentials in files); in-page rAF probe, Android LoAF via adb; tag every resource `attempt-id, sha, lane, ttl`; terminate on exit. Real runs only after OD-5/OD-11 and runner registration (owner/infra).
Acceptance: AC-FIN-105 + ledger QUAL-48 agent part (`node scripts/qual/devices/device-farm-run.mjs --self-check` passes offline). The real-device p95 ≤16.7 ms (≤25 ms mid Android) and sign-off are AC-FIN-112 (FIN-H, human).

#### G-26 `next-fin/g-showcases` — REQ-FIN-107 / QUAL-58 · FIN-455
Files: create `showcase/showcases.json` and, for each id `ai-command-center` (S1, dark-media, `registry/blocks/ai-workspace`), `financial-dashboard` (S1, flat-white, `data-workspace`), `ops-console` (S1, flat-black, `app-frame`), `media-workspace` (S1, video-frame, `media-viewer`), `collaborative-workspace` (S1, saturated-abstract, public entries), `mobile-productivity` (S1, photo, 390×844, public entries), `music-player` (S2, photo, `media-viewer`), `spatial-control-center` (S2, hf-pattern), `ecommerce` (S2, photo), `analytics` (S2, dense-text, `analytics-dashboard`): `showcase/<id>/{<Name>.showcase.tsx,<Name>.stories.tsx (kind/tag showcase, one fullscreen story + 2–4 fragments),<name>.module.css,copy.ts,assets/}`. Composition per contract §3.3 from SURF/PLAT registry blocks; a block not yet on `next` → that showcase story reports `pending-producer` via the lane runner (REQ-FIN-88 SURF), never a hand-written stand-in.
Acceptance: AC-FIN-107 + ledger QUAL-58 (10 dirs each with the 4 required files; `showcases.json` lists 10 ids; Storybook index has 10 fullscreen showcase stories).

#### G-27 `next-fin/g-showcase-hygiene` — REQ-FIN-107 / QUAL-59 · FIN-455
Files: create `scripts/storybook/verify-showcase-imports.mjs`, `stylelint.showcase.config.mjs` rules (file created in G-03; `declaration-property-allowlist`: display, grid-*, flex*, gap, padding, margin, inline-size, block-size, min-*, max-*, position, inset*, overflow, container-*), `tests/showcase/{showcase-imports.test.mjs,showcase-determinism.test.ts,showcase-a11y.test.tsx}`.
Steps: Vite build of every `showcase/**/*.showcase.tsx` against the packed tarball in a temp dir (remote); allowed imports only `aura-glass`, `aura-glass/<subpath>`, `registry/blocks/<id>/{index.tsx,fixtures.ts}`, own folder; static checks for `!important`, colour literals, banned `style` props, `[data-ag-part]` selectors; determinism (no `Math.random`/`Date.now`/network in render, fixed-epoch `now` prop; two renders identical HTML); assets ≤300 KB AVIF, ≤12 per showcase, licensed; product-realistic copy (REQ-QUAL-50 banned list, ≥40 text runs in one region); one `<main>`, skip link, ordered headings, named landmarks, `role="log"` Thread in `ai-command-center`; 390 collapsed layouts (Sidebar → drawer Sheet, Inspector → bottom Sheet), `mobile-productivity` also 834.
Acceptance: AC-FIN-107 + ledger QUAL-59 (three showcase tests pass over all 10; `stylelint --config stylelint.showcase.config.mjs 'showcase/**/*.css'` exits 0).

#### Ledger close-out (no new PR) — FIN-420, -426, -431, -437, -443, -448, -453/-454, -456
After each G-PR merges and its job is green with `allow_failure: false`, re-verify every clause of the listed REQs on `next`, record the job URL in the REQ's ledger row and Appendix A row (in the planning branch PR that FIN-C/FIN-H aggregate — FIN-G supplies the URLs in its report, it does not edit `implementation-audit/**` on `next`), and set `done`. A missing pipeline keeps the row open.

### FIN-G.4 Validation (GitLab CI only; every job `allow_failure: false` before its AC counts)

Prerequisites, not FIN-G work: pipelines on `next` (OD-8 owner action, or the REQ-FIN-20 alternative, FIN-B #126); `release/4.x` pipelines for QUAL-33; `contract:ownership` accepting `next-fin/g-*` (REQ-FIN-30 / FIN-463). Until then G-PRs stay open with narrow local Jest evidence only; nothing merges on faith.

| AC | Jobs that must be green on `next` (pipeline URL recorded) | Remote-only lanes |
|---|---|---|
| AC-FIN-100 | `contract:conformance` (root, runs `tests/contract/**` 11 files + `__selftest__`), `qual:certify:l1` (runs `packages/qa/test/**` via `jest -c jest.qual.config.js`, evidence guard), `qual:build:storybook` (cert-manifest equality) | Storybook build |
| AC-FIN-101 | `qual:certify:l1..l12` (12 jobs), `qual:certify:nightly` (incl. `--line 4x` rows), `qual:test:selftest`, `qual:certify:release-matrix` (child, `strategy: depend`), `qual:certify:release` (never `allow_failure`); activation row per job in `ci/plat/activation.json` (FIN-B writes it) | L5–L11 browser lanes, L11 canaries, shard child pipelines |
| AC-FIN-102 | `qual:certify:l5` / `l6` (environment-visual, OCR, pixel gates, preference, console, containment/target/focus per lane assignment in `lanes.config.ts`), `qual:build:storybook` | all; tesseract 5 in `AG_PLAYWRIGHT_IMAGE` |
| AC-FIN-103 | `qual:certify:l7` (regression + visual-class), `qual:certify:baseline-refresh` (manual run once, candidates reviewed), `qual:certify:known-failures` (nightly vs v4.1.0), `qual:certify:review-record` (manual, schema check), `plat:gate:change-class` logs that it read `visual-class.json` | L7 in `AG_PLAYWRIGHT_IMAGE` only |
| AC-FIN-104 | behaviour, SSR/hydration, overlay-stacking (L5/L6 per registry), `qual:certify:l8` (engine), `qual:certify:l9` (motion), L1 (vacuous gate, deliverables) | chromium + webkit + firefox projects |
| AC-FIN-105 | `qual:certify:l10`, `qual:certify:l10-gpu` (PR ratchet ≤10 min), L1 (css-perf, perf lint, dist-perf), L2 (bytes map, cold import on Node 20.19.0 + 22), `qual:certify:devices` (`--self-check`; real run after OD-5/OD-11) | all perf; `.ag-gpu`; Device Farm / mac1.metal |
| AC-FIN-106 | `qual:build:storybook` (dist-backed, `ag-build.json` sha = `CI_COMMIT_SHA`, ≤60 MB, ≤6 min), L1 (`tsc -p tsconfig.storybook.json`, title/copy/story lint, story-contract validator), `tests/e2e/qual/storybook/**` in the browser lane | Storybook build, S1 flows |
| AC-FIN-107 | L1 (showcase stylelint, showcase static checks, determinism), L2 (`verify-showcase-imports.mjs` tarball build), L5 showcase cells | tarball Vite build, captures |
| AC-FIN-100..107 (aggregate) | `node certification/run.mjs --lane all --scope release --verdict .artifacts/qual/release-verdict.json` exits 0 with 16 items `pass` and 0 quarantined cells on the RC SHA (`qual:certify:release`) | release scope |

Visual evidence (GitLab artifacts, never commits): every L7 cell, OCR contrast reports, scene captures, showcase captures, `visual-class.json`, `perf-report.json`, `release-verdict.json`, rendered `RELEASE_CHECKLIST.md`. Report each artifact URL in `visualEvidence`.

### FIN-G.5 Exit criteria

- [ ] AC-FIN-100 — REQ-FIN-100: REQ-QUAL-01, -02, -03, -70 done
- [ ] AC-FIN-101 — REQ-FIN-101: REQ-QUAL-05, -06, -27, -28, -29, -30, -33, -64, -65, -66, -67, -68 done
- [ ] AC-FIN-102 — REQ-FIN-102: REQ-QUAL-04, -07, -08, -12, -13, -14, -15, -16, -17, -18 done
- [ ] AC-FIN-103 — REQ-FIN-103: REQ-QUAL-24, -25, -26, -32, -60, -61, -62, -63 done + REQ-FIN-111 tooling merged
- [ ] AC-FIN-104 — REQ-FIN-104: REQ-QUAL-19, -20, -21, -22, -23, -31, -71 done
- [ ] AC-FIN-105 — REQ-FIN-105: REQ-QUAL-34..47 done; REQ-QUAL-48 agent part merged (row closes only with AC-FIN-112 human sign-off)
- [ ] AC-FIN-106 — REQ-FIN-106: REQ-QUAL-09, -10, -11, -49..57 done; REQ-FIN-05 cert-mode CSS clause done
- [ ] AC-FIN-107 — REQ-FIN-107: REQ-QUAL-58, -59 done
- [ ] #338, #320, #322 trimmed of FIN-G paths (or, if merged first, their FIN-G files replaced by G-02/G-23 — never duplicated)
- [ ] Every `qual:*` job in `CI_JOBS.qual` + the seven QUAL-only jobs exists, has an activation row, and `allow_failure: false` (release job never had it)
- [ ] All expiring baselines created by FIN-G gates (story-contract, deliverables, lint-stories, lint-tests, css-perf) are `[]` by RC-1
- [ ] `release-verdict.json` on the RC SHA: 16 items `pass`, `ga` gated only by FIN-H/owner items
- Report: Common-rules JSON plus `"lanes": {"L1": "<job url|pending reason>", …, "L12": ""}` and the verdict artifact path.

### Owner / human items inside FIN-G (agent never performs or fakes them)

(a) Agent prep (FIN-G): scene-licence evidence collection (G-11), device runner + `--self-check` (G-25), review-record job, rubric and composite (G-16), decision-record drafts for the PNG allowlist and the `legacy/**` lint exclusion.
(b) Owner/human actions (exact steps):
1. OD-8 (Gurbaksh): change the org mirror so GitLab 87152036 receives `next`, `release/4.x`, `release/4.1.x`, stream branches and `v*` tags — or approve the REQ-FIN-20 alternative. Blocks every FIN-G.4 row.
2. Scene licences (Gurbaksh or design owner): supply or approve licensed sources for any scene id the agent reports `blocked-owner`; record licence/source in the PR review.
3. OD-5 / OD-11 (Gurbaksh/infra): register the Device Farm project and mac1.metal runner for `qual:certify:devices`, confirm CA bundle; then testers run the real-device matrix and sign `docs/certification/real-device-matrix.md` (AC-FIN-112, FIN-H).
4. Baseline approval (named design reviewer): review `baseline-diff-report.html` from `qual:certify:baseline-refresh`, approve the `next-qual/baselines-<yyyymmdd>` PR (CODEOWNERS on `certification/baselines/**`).
5. L14 review (named design reviewer, AC-FIN-111, FIN-H): score every flagship subject-state, T0 matrix and six S1 showcases on the RC-1 composites; records go to `certification/review/records/**`.
6. PNG allowlist decision (owner): approve `src/**/assets/` admission or relocation (OD-19-adjacent record in `docs/release/decisions/`).


---

## 12. WP FIN-H — Human certification, owner decisions, operator actions

Source: PRD-F §5.8 (REQ-FIN-110..113), §5.9 (OD-1..OD-21), §6 FIN-H row, §6.1 (REQ-FIN-110 schema → C-16 contract PR; REQ-FIN-110 AI live regions + AI meta selectors → REQ-FIN-85; REQ-FIN-111 composite/rubric/review-record job → REQ-FIN-103), §17 AC-FIN-110..113, §18, §20, Appendix A (5 original REQs: REQ-MAT-66, REQ-SURF-129, REQ-SURF-196, REQ-QUAL-72 → 110; REQ-QUAL-73 → 111), Appendix C C-16. Operator parts of REQ-PLAT-08/-09/-16/-35/-81/-82 and the REQ-QUAL-48 sign-off are done here, but they're counted under FIN-C/FIN-G.

State re-checked 2026-10-10 (origin/next `e5a2d6835`, release/4.x `645735fce`, release/4.1.x `a19f4bbe1`; files of all 241 open PRs scanned for FIN-H globs):
- None of the 18 merged PRs touches a FIN-H deliverable. Nothing under FIN-H paths has changed on `next` since plan base `84a3b94f1`.
- On `next`: `contracts/schemas/sr-record.schema.json` exists (from C0). Its required fields are `flagship, at, result, date, tester, sha`, with `at` ∈ `voiceover-macos|voiceover-ios|nvda-chrome|talkback-chrome|touch`. The duplicate `tests/a11y/manual/sr-record.schema.json` is still there and differs from it: it requires `sha, cell, at, atVersion, browser, browserVersion, os, osVersion, tester, date, component, steps`, with `at` ∈ `VoiceOver|NVDA|JAWS|TalkBack|Narrator` and `cell` SR-1..SR-6. `scripts/mat/verify-a11y-manual.mjs:16` still reads the `tests/` copy. `--sha` exists.
- Step scripts on `next`: 17. These are cmp (12: checkbox, combobox, icon-button, number-field, radio-group, search-field, segmented-control, select, slider, switch, text-field, toolbar), mat (button, dialog, plus `_TEMPLATE.md`) and surf (data-date, plus `README.md`). Records: 0 (only `records/{cmp,surf}/README.md`). `gen-matrix.mjs`, `sr-matrix.template.json` and `aggregate.mjs` are all missing.
- Flagships on `next`: 58 `*.meta.ts` carry `flagship: <n>`, covering 43 distinct numbers (1–17, 19–44). **Flagship 18 has no meta.**
- No `certification/review/**` and no `docs/certification/real-device-matrix.md` on any line. No `od-*.md`, `operator-*.md` or `downstream-*.json`. RM-01..13 on `next` all have `status: "missing"` and `acknowledged: false` (`gh search unavailable`).
- Issue #16 is OPEN with 0 comments. Releases: only v4.1.0 and v4.0.0. GitLab project 87152036: 0 pipelines, branch `main` only (OD-8). No open PR has a CI check.

**May touch**: `tests/a11y/manual/**`, `scripts/mat/verify-a11y-manual.mjs`, `certification/review/records/**` (tester/reviewer content, plus an agent-written README), `docs/certification/real-device-matrix.md` (the agent writes the skeleton, the signer fills the content), `docs/release/decisions/{od-*.md,operator-*.md,removals/RM-*.json,downstream-*.json}`. `contracts/schemas/sr-record.schema.json` changes only through the contract PR `contract/v1.2-final` (FIN-463, C-16).
**Must not touch**: product code (`src/**`, `packages/**`), any CI file (`.gitlab-ci.yml`, `ci/**`), `jest.config.js`, `docs/release/decisions/{gitlab-*.md,npm-*.md,change-class-canary.md,rollback-drill.md}` (FIN-B/FIN-C).
**Never (agent)**: perform, fabricate, back-fill, sign or "complete" any human record (SrRecord, review record, device sign-off, operator record, OD decision). Never set `status: decided` on an OD draft. Never close PRs, create releases, change GitLab/GitHub settings, publish a GHSA, or run a login/refresh/setup.
Branches: `next-fin/h-<topic>` (the FIN-H agent's prep PRs and the human record PRs). FIN-H has no `release/4.x` or `release/4.1.x` deliverables.

### FIN-H.1 Land existing open PRs

No open PR implements a FIN-H deliverable. Two open PRs need a FIN-H action (stale stacked PRs, REQ-FIN-113). Ten more PRs belonging to other WPs edit FIN-H-owned files. For those, FIN-H sets the condition their hunk must meet and the RM-11 sub-order. Their merge action and slot are counted in the owning WP's section, not here, so nothing is done twice.

**(a) FIN-H-owned actions** (operator/owner performs them; the agent drafts the comment in `docs/release/decisions/operator-close-stale-prs.md`)

| PR | Line (base) | REQ | State now | Action | Exact fix | Slot |
|---|---|---|---|---|---|---|
| #77 | next stack (base `next-plat/rel-ledger`, head `next-plat/rel-removal-tooling` `bfc216d0a`) | REQ-FIN-113 (REQ-PLAT-08 part) | OPEN, mergeable CLEAN | CLOSE as superseded. Survivor: `origin/next`, which contains it through merge `366ff2023` "Merge pull request #77 from auraoneai/next-plat/rel-removal-tooling" | Operator: `gh pr close 77 -R auraoneai/auraglass --comment "Superseded: head bfc216d0a is an ancestor of origin/next (contained via 366ff2023). Closing per REQ-FIN-113."`, then record it in `operator-close-stale-prs.md` | Any time before RC-1. Do it first, because it removes a stale RM-01..12 diff from the open list |
| #97 | 4.x stack (base `4x-plat/4x-lint-gate`, head `4x-plat/4x-tree-hygiene` `d5d950b59`) | REQ-FIN-113 | OPEN, CLEAN | CLOSE as superseded. Survivor: `origin/release/4.x`, which contains it through merge `645735fce` (PR #112) | Operator: `gh pr close 97 -R auraoneai/auraglass --comment "Superseded: head d5d950b59 is an ancestor of origin/release/4.x (contained via 645735fce). Closing per REQ-FIN-113."`, then record it | Same as #77 |

Before closing, the operator re-verifies with `git fetch origin && git merge-base --is-ancestor bfc216d0a origin/next && git merge-base --is-ancestor d5d950b59 origin/release/4.x` (both exit 0 on 2026-10-10).

**(b) Other WPs' PRs that edit FIN-H files** (FIN-H review condition only; counted under the named WP)

| PR | Owner WP / REQ | State now | FIN-H file | Owning-WP action | FIN-H condition on the FIN-H hunk | RM sub-order |
|---|---|---|---|---|---|---|
| #303 `next-fin/cmp-133-codemod-mappings` | FIN-E REQ-CMP-133 | CLEAN | RM-11 (-88 names, the scrub) | MERGE as is | The 88 removed names must each be either a CMP deprecation entry (`fragments/deprecations/cmp.ts`) or a codemod row. Verify with `node scripts/release/gen-component-dispositions.mjs --check` on the PR head | **1st** RM-11 edit |
| #279 `next-fin/cmp-28-focusscope` | FIN-E REQ-CMP-28 | DIRTY | RM-11 (-`GlassLabel`) | REBASE+RESOLVE | After #303, drop the RM-11 hunk: `GlassLabel` is already removed by #303 | after #303 (any order among 279/282/288) |
| #282 `next-fin/cmp-111-text-heading` | FIN-E REQ-CMP-111 | DIRTY | RM-11 (-`DisplayText`, -`Typography`) | REBASE+RESOLVE | Drop the hunk (both names are in #303) | after #303 |
| #288 `next-fin/cmp-117-progress` | FIN-E REQ-CMP-117 | DIRTY | RM-11 (-`CircularProgress`) | REBASE+RESOLVE | Drop the hunk (covered by #303) | after #303 |
| #283 `next-fin/cmp-112-grid` | FIN-E REQ-CMP-112 | DIRTY | RM-11 (-`GlassGrid`, -`GlassMasonry`, -`GlassMasonryGrid`) | REBASE+RESOLVE | Keep only `-"GlassMasonryGrid"` (the other two are covered by #303) | after #303, one at a time with #285/#298 |
| #285 `next-fin/cmp-114-badge` | FIN-E REQ-CMP-114 | DIRTY | RM-11 (-`GlassConnectionStatus`, -`GlassStatusDot`, -`LiquidGlassBadgeCluster`) | REBASE+RESOLVE | Keep `GlassConnectionStatus` and `GlassStatusDot`. Drop `LiquidGlassBadgeCluster` (covered by #303) | after #283 |
| #298 `next-fin/cmp-127-image-list` | FIN-E REQ-CMP-127 | DIRTY | RM-11 (-`GlassGallery`, -`ImageList`, -`ImageListItem`, -`ImageListItemBar`, EOF newline) | REBASE+RESOLVE | Keep all four names (none are in #303). Keep a valid JSON array and the trailing newline | after #285 |
| #180 `next-fin/plat-79-removal` | FIN-C REQ-PLAT-79 | DIRTY | RM-01..RM-13 (adds `mergeSha`/`sha`) | REBASE+RESOLVE | Rebase after all RM-11 edits above. RM hunks may only add the `mergeSha`/`sha` fields. They must not change `status`, `acknowledged`, `names` or `gh`. Every record keeps `status: "missing"` until the operator `consumer-grep --write` run. No `"gh search unavailable"` text may be presented as an operator result | after #298 |
| #184 `next-fin/plat-82-server-archive` | FIN-C REQ-PLAT-82 | CLEAN | RM-01 (`gate.archive` fields) | MERGE as is (re-check after #180 lands; rebase if RM-01 then conflicts) | `gate.ghsa` and `gate.archive` stay `status: "missing"` until the owner records OD-21 (GHSA id + archive repo). The agent never fills them | after #180 |
| #163 `4x-plat/tag-62` (base `release/4.x`) | FIN-C REQ-PLAT-62 | CLEAN | `docs/release/decisions/operator-codemods-qual.md` (FIN-H glob) | TRIM | Move the file to a FIN-C path (e.g. `docs/release/codemods-qual.md`) and update its references in the PR. `operator-*.md` is reserved for FIN-H operator-action records with date and evidence (AC-FIN-113), and this file is a decision note | FIN-C slot; independent of the RM sub-order |

Two more open PRs are dependencies, not rows (no FIN-H paths; counted under their WP): #182 `next-fin/plat-81-consumer-grep` (FIN-C, CLEAN), which moves `scripts/release/consumer-grep.mjs` to `scripts/removal/consumer-grep.mjs` (record shape `{family, sha, hits[], acknowledged[]}`) and must merge before operator action OP-3; and #125 `next-fin/a-fragsync` (FIN-A REQ-FIN-13, DIRTY), which adds the `--to next|release/4.x` directions and the `--allow-delete` guard to `scripts/release/sync-fragments.mjs` and must merge before OP-4.

Rule: RM-*.json edits merge **one at a time**. After each merge, run `node scripts/release/gen-component-dispositions.mjs --check` and the RM JSON parse check (`node -e 'for (const f of require("fs").readdirSync("docs/release/decisions/removals")) JSON.parse(require("fs").readFileSync("docs/release/decisions/removals/"+f))'`) on `next` before the next one rebases. The operator `consumer-grep --write` run (OP-3) comes **after** every row above, because it regenerates RM-01..13 and would otherwise be overwritten.

### FIN-H.2 Finish partially-merged work

No merged PR (of the 18 merged in #113–#369) left a FIN-H gap. Two FIN-H gaps in older content already on `next` are handled once, in the tasks named here:
- C0's `contracts/schemas/sr-record.schema.json` diverges from the copy the verifier reads → H3-1.
- RM-01..13 records merged through #77's content (into `next` via `366ff2023`) are placeholders (`status: missing`, `acknowledged: false`, RM-13 "consumer-grep pending") → operator action OP-3 (FIN-H.3 (b)), after the FIN-H.1 (b) sub-order.

### FIN-H.3 Build work that has no PR

Every FIN-H item has no PR. **(a)** is agent prep (one FIN-H agent, task FIN-457 and FIN-465..482 drafts). **(b)** is human/owner work. The agent prepares the inputs for (b), validates the records the humans commit, and reports gaps, but never performs or fakes any part of (b). Light local checks are allowed (`node` on JSON, jest on `tests/a11y/manual/**`). Storybook builds and anything browser-based are remote/CI only.

#### (a) Agent prep

**H3-1 Single SrRecord schema + verifier repoint** — REQ-FIN-110 (C-16). Original REQs: REQ-MAT-66, REQ-QUAL-72. Branch `next-fin/h-sr-schema`.
1. Write the unified field set and hand it to FIN-463 (contract PR `contract/v1.2-final`, C-16). The FIN-H agent doesn't edit `contracts/**`. The schema on `next` lacks fields the verifier and template need, so C-16 must define: `sha`, `subject` (meta id), `flagship` (number|null for non-flagship subjects such as Lab/Panel/overlays), `stream` (`mat|cmp|surf`), `pass` (`sr|touch|motion`), `at` ∈ `voiceover-macos|voiceover-ios|nvda-chrome|talkback-chrome|touch-ios|touch-android` (replaces the bare `touch`, so the iOS/Android split required by REQ-MAT-66 is machine-checkable), `atVersion`, `browser`, `browserVersion`, `os`, `osVersion`, `device` (required when `pass` is `touch` or `at` is `*-ios`/`talkback-chrome`), `tester`, `date` (ISO), `result` (`pass|fail`), `steps[]` (`{action, expected, announced, nameRoleValue, stateChange, openClose, liveRegion, pass}`), `storybookArtifactUrl`, `notes`. Use `additionalProperties: false`.
2. After C-16 merges, delete `tests/a11y/manual/sr-record.schema.json` and change `scripts/mat/verify-a11y-manual.mjs` to read `contracts/schemas/sr-record.schema.json`. Validate every keyword the schema uses (`type`, `enum`, `required`, `additionalProperties`, `items`, `format: date`). `ajv` isn't a direct dependency on `next`, so either ask FIN-C to add a pinned `ajv` devDependency (it owns that `package.json` key) or keep a small in-file validator for exactly those keywords. Don't edit `package.json` yourself. Keep `--sha`. Exit 1 when the record set is empty, when `--sha` is given without a value, on any record with `sha !== --sha`, on a record whose file path ≠ `records/<stream>/<subject>-<at>.json`, and on duplicate (subject, at, pass). Print the total count and a per-stream count.
3. Fallback if OD-16 rejects C-16: keep `tests/a11y/manual/sr-record.schema.json` as the only schema, extended with the same fields; delete nothing under `contracts/` (that also goes through the contract PR). FIN-G's aggregator consumer imports the `tests/` path. Record which branch was taken in `od-16.md`.
4. Tests: `tests/a11y/manual/__tests__/verify-a11y-manual.test.ts` with fixtures under `tests/a11y/manual/__fixtures__/` (never under `records/`). Cases: valid set exits 0; empty dir exits 1; wrong SHA exits 1; missing `steps` exits 1; bad `at` exits 1; misplaced path exits 1; duplicate exits 1; `--sha` without value exits 1. A last case asserts `git ls-files | grep -c sr-record.schema.json` = 1.
Acceptance: AC-FIN-110 (verifier part). Ledger REQ-MAT-66 "only one sr-record schema file exists in the repo"; ledger REQ-QUAL-72 "single schema file".

**H3-2 Matrix generator + template** — REQ-FIN-110. Original REQ: REQ-QUAL-72. Branch `next-fin/h-sr-matrix`.
1. Create `tests/a11y/manual/gen-matrix.mjs`. It reads every `src/**/*.meta.ts` through the repo's existing meta loader (the one `tests/helpers/index.ts` `listSubjects` uses; don't hand-parse TS with regexes) and writes `tests/a11y/manual/sr-matrix.template.json`. Rows: for each flagship 1..44, one row per (subject, pass, at): SR × {voiceover-macos, voiceover-ios, nvda-chrome, talkback-chrome} + touch × {touch-ios, touch-android}. That's 5 passes as counted by AC-FIN-110 (4 SR + touch; the touch pass is recorded on both devices). Add the non-flagship issue-#16 subjects: menus, AlertDialog, Sheet, Popover, Tooltip, app-shell navigation (drawer, rail, tab bar), tabs, command palette, toast (incl. swipe), workflow states, select, combobox, dialog/drawer detents, orientation change, the Surface/Material Lab and GlassPreferencesPanel (MAT). Add motion rows for Button, Dialog, Menu, Sheet, Tabs × the 4 SR platforms under OS reduced motion. Each row carries `subject`, `stream`, `flagship`, `pass`, `at`, `storyId`, `script` (path of its step script) and `required: true`.
2. `--check` mode regenerates in memory and exits 1 on drift.
3. Flagship gap: on `next` there are 58 metas over 43 distinct numbers and **no flagship 18**. The generator emits `missingFlagships: [18]` and exits 0 with a warning. The test reports `pending` through the lane runner until the owning stream adds or renumbers the meta. Tell the owning stream; don't edit `src/**`.
4. Test: `tests/a11y/manual/__tests__/sr-matrix.test.ts`. It asserts the template equals the generated output. Flagship numbers must be contiguous 1..44 (`pending` while `missingFlagships` is non-empty, failing once the baseline date expires). Every row must reference an existing `script`, and every SURF flagship (24) and every MAT subject (Lab, Panel, reduced-motion) must be present.
Acceptance: ledger REQ-QUAL-72 "sr-matrix.test.ts passes". Feeds AC-FIN-110.

**H3-3 Step scripts for every subject** — REQ-FIN-110. Original REQs: REQ-MAT-66, REQ-SURF-129, REQ-SURF-196. Branch `next-fin/h-sr-scripts` (split per stream if a PR exceeds review size: `next-fin/h-sr-scripts-mat`, `-cmp`, `-surf`).
1. Keep the 17 existing scripts, bringing them to the template below. Add `tests/a11y/manual/scripts/<stream>/<subject>.md` for every template row's subject that has no script. MAT needs `surface-material-lab.md`, `glass-preferences-panel.md` and `reduced-motion-pass.md` (the ledger names these exact files), covering VO macOS/iOS, NVDA, TalkBack and physical touch on iOS and Android, with subjects reached through `listSubjects`. SURF needs all 24 flagships (ledger REQ-SURF-196), including `ai-thread.md`, `ai-message.md`, `ai-composer.md`, `ai-tool-call.md` and `ai-citation.md` (REQ-SURF-129). These cover the tab order viewport → message actions → triggers → approval → citations → jump pill → attachment removes → Submit/Stop, and the `aria-busy` double-announce check (OI-08). CMP needs the remaining CMP flagships plus the overlay/menu/tabs/toast/command-palette subjects. The app-shell subjects go under `surf/`.
2. Each script follows the updated `scripts/mat/_TEMPLATE.md`. It gives the exact URL (`<CI Storybook artifact for $SHA>/?path=/story/<storyId>`, never a local server), AT + browser + OS version, device for touch, numbered keystrokes/gestures, the expected announcement (name/role/value, state change, open/close, live-region text), pass/fail per step, and "how to write the record": the path `records/<stream>/<subject>-<at>.json` plus the required fields from H3-1. Rename the template's AT list to the H3-1 `at` enum and drop JAWS/Narrator.
3. Test: `tests/a11y/manual/__tests__/scripts-coverage.test.ts`. It asserts one script per template subject, that every script contains the sections Environment / Steps / Expected / Record, and that every script has a non-empty Steps table.
Acceptance: ledger REQ-MAT-66 (scripts part), ledger REQ-SURF-196 "Write SR scripts … for all 24", ledger REQ-SURF-129 (script part; the live-region test and APG spec fixes are REQ-FIN-85's).

**H3-4 Aggregator** — REQ-FIN-110 → FIN-G ReleaseVerdict (REQ-FIN-103). Original REQ: REQ-QUAL-72. Branch `next-fin/h-sr-aggregate`.
1. Create `tests/a11y/manual/aggregate.mjs --sha <sha> [--records tests/a11y/manual/records] [--out .artifacts/qual/a11y-manual-<sha>.json]`. It runs the H3-1 validation, joins the records against `sr-matrix.template.json`, and writes `{sha, generatedAt, required, recorded, passed, failed, missing[], failures[], byStream{mat,cmp,surf}, byPass{sr,touch,motion}, verdict: "pass"|"fail"|"incomplete"}`. The verdict is `pass` only when every required row has a `result: "pass"` record on that SHA. The minimums are ≥44×5 flagship records, MAT ≥10, SURF ≥24×5, ≥3 `ai-*`, and 4 motion records. It exits 0 only on `pass`.
2. Agree the output shape with FIN-G (the REQ-FIN-103 ReleaseVerdict consumer). The shape belongs to FIN-H; FIN-G reads it.
3. Test: `tests/a11y/manual/__tests__/aggregate.test.ts`, with fixtures for complete-pass (exit 0), one failing record (exit 1, `failed: 1`), one missing row (`incomplete`), and wrong SHA (excluded and counted as missing).
Acceptance: AC-FIN-110 ("QUAL aggregator exit 0"); ledger REQ-QUAL-72 "aggregate shows pass for 44 flagships x 5 passes on the RC SHA".

**H3-5 Owner-decision drafts** — §5.9, tasks FIN-465..482. Branch `next-fin/h-od-drafts`.
Create one `docs/release/decisions/od-<n>.md` per decision, OD-1 through OD-21 (21 files). Each has front matter `id`, `status: awaiting-owner` (carried ODs 1/3/4/6/7: `status: carried`, quoting the existing master-PRD decision), `default`, `blocks`, `decidedBy:` (empty), `decidedAt:` (empty), `evidence:` (empty). The body has the question, the options, the PRD-F §5.9 default, what it blocks (REQ ids), and the exact owner action with click-path or command. The agent never fills `decidedBy`/`decidedAt`/`evidence` and never sets `decided`/`defaulted`. Content that must be exact:
- `od-8.md`: the PRD §5.2 owner steps verbatim. (1) Create a read-only fine-grained PAT for `auraoneai/auraglass` with Contents: read and Metadata: read. (2) In GitLab 87152036 → Settings → Repository → Mirroring repositories, add a pull mirror from `https://github.com/auraoneai/auraglass.git` with "Mirror only protected branches" off, "Trigger pipelines for mirror updates" on, and "Overwrite diverged branches" on. (3) Once it's green, disable `mirror-to-gitlab` for this repo only (it force-pushes `--prune`). List the refs: `main`, `next`, `release/4.x`, `release/4.1.x`, `next-*/**`, `4x-*/**`, `contract/**`, `sync/**`, tags `v*`. Fallback: the owner runs `node scripts/release/push-gitlab-refs.mjs --apply` after removing `--prune`. Cross-link FIN-B's `gitlab-ci-verification.md` (don't edit it).
- `od-13.md`: `release/4.1.x` already exists at `a19f4bbe1`. The draft asks the owner to confirm it was cut from `78fd7bda1` with cherry-picks `85e844776`, `f4d5f884b`, `4dabc703b` (the agent pre-fills the result of `git merge-base --is-ancestor 78fd7bda1 origin/release/4.1.x` and `git log --format='%h %s' 78fd7bda1..origin/release/4.1.x` as evidence for the owner to confirm). `v4.1.1` isn't tagged.
- `od-16.md`: the C-1..C-17 list from Appendix C, with each item's fallback. Include the C-16 branch taken (H3-1 step 3).
- `od-21.md`: GHSA publication from `docs/security/advisories/2026-10-hosted-runtime.md` (FIN-C draft) before `v4.1.1`, and creation of private `auraoneai/auraglass-server-archive` matching `RM-01-archive.json`. The record fields the owner fills are `ghsaId` and `archiveRepoUrl`.
- `od-2/5/9/10/11/12/14/15/17/18/19/20.md`: the §5.9 rows as written. `od-10.md` and `od-2.md` cross-link FIN-C's existing `npm-trusted-publishing.md`/`npm-scope.md` without editing them. `od-11.md` lists protected `v*`, nightly schedules on `next` and `release/4.x`, Pages public, keep-latest-artifacts, and the AWS runner tag.
Validation: these rows are asserted by FIN-B's `tests/ci/decision-records.test.ts`. Send FIN-B the file list. FIN-H adds no test outside its paths.
Acceptance: input to AC-FIN-113 and to every OD-gated AC (the OD records themselves are human, see (b)).

**H3-6 Operator runbooks** — REQ-FIN-113. Branch `next-fin/h-operator-runbooks`.
Create one `docs/release/decisions/operator-<topic>.md` per operator action. Each has front matter `status: awaiting-operator`, `performedBy:` (empty), `performedAt:` (empty) and `evidence:` (empty), plus prerequisites, exact commands (existing logins only; no login/refresh/setup), expected output, and the evidence to paste:
- `operator-od11-gitlab-settings.md` (OP-1): the OD-11 settings list, with GitLab UI paths for project 87152036.
- `operator-downstream-grep-4.2.md` (OP-2): `node scripts/release/downstream-grep.mjs --roots /Users/gurbakshchahal/AuraOne,/Users/gurbakshchahal/platforms --out docs/release/decisions/downstream-4.2.0.json` at the 4.2 cut, after FIN-C's PLAT-35 fixes, which give the report shape at `docs/release/decisions/downstream-<version>.json`. Then file the AuraOne follow-up issue for the two templates pinned at `aura-glass@3.1.1` (`gh issue create -R <AuraOne repo> --title "Upgrade aura-glass from 3.1.1 in <template paths>" --body-file <report excerpt>`).
- `operator-consumer-grep.md` (OP-3): after #182 and the FIN-H.1 (b) sub-order, `for f in 01 02 03 04 05 06 07 08 09 10 11 12 13; do node scripts/removal/consumer-grep.mjs --family RM-$f --roots /Users/gurbakshchahal/AuraOne,/Users/gurbakshchahal/platforms --write; done`, then `--verify` per family. The operator reviews the hits and sets `acknowledged[]`. The resulting RM-*.json changes are committed by the operator on `next-fin/h-rm-consumer-grep`.
- `operator-sync-fragments.md` (OP-4): after #125, `node scripts/release/sync-fragments.mjs --to next` and `--to release/4.x`, daily while any stream has unsynced rows. Each run opens `sync/fragments-*-<yyyymmdd>` PRs.
- `operator-gh-release.md` (OP-5): per tag (`v4.1.1`, `v4.2.0`, `v4.3.0`, `v5.0.0-alpha.N`, RC, GA), `gh release create <tag> -R auraoneai/auraglass --verify-tag --notes-file RELEASE_NOTES_<version>.md` (attach `downstream-4.2.0.json` for `v4.2.0`). Only after the tag pipeline's `plat:publish:npm` is green.
- `operator-close-stale-prs.md` (OP-6): the #77/#97 commands and comments from FIN-H.1 (a), plus a final check that the open-PR list has no PR whose head is an ancestor of `origin/next` or `origin/release/4.x`. The agent pre-computes that list with `gh pr list --state open --json number,headRefOid` + `git merge-base --is-ancestor` and appends it to the draft.
Acceptance: input to AC-FIN-113.

**H3-7 Real-device matrix skeleton + review-records README** — REQ-FIN-111/-112 (agent part only). Branch `next-fin/h-cert-skeletons`.
1. `docs/certification/real-device-matrix.md`: front matter `status: awaiting-signature`, `signer:`, `signedAt:`, `sha:` (all empty). Rows: the six S1 scenes + Dialog + AppShell × devices (iPhone iOS 18, iPhone iOS 26, Pixel 7-class Android, plus the device-farm list from FIN-G's REQ-QUAL-67 lane), with columns `p95 frame ms (measured)`, `budget` (16.7 ms; 25 ms mid Android), `pass`, and the `artifact URL` the device-farm job produced. Every measured cell is empty. Prerequisites: OD-5, OD-11.
2. `certification/review/records/README.md`: where the L14 records go, the record file naming `<subject>-<state>.json` / `t0-matrix.json` / `showcase-<id>.json`, that `qual:certify:review-record` (FIN-G) validates them against the RC SHA, and that a score below 3 is filed as a bug in the owning WP and never edited.
Acceptance: inputs for AC-FIN-111/-112.

FIN-H merge order (own PRs): H3-1 merges after the C-16 contract PR (or immediately via the fallback once OD-16 is recorded) → H3-2 → H3-3 (per stream, any order) → H3-4. H3-5, H3-6 and H3-7 merge any time. Every one targets `next`.

#### (b) Human / owner actions (Gurbaksh, testers, design reviewer). The agent never performs, records or fakes these.

**HU-1 Issue #16 SR + touch + motion passes (L13)** — REQ-FIN-110. Original REQs: REQ-MAT-66, REQ-SURF-129, REQ-SURF-196, REQ-QUAL-72. Testers.
1. Practice passes from day 1, using H3-3 scripts against the latest nightly `next` Storybook CI artifact once FIN-B pipelines exist (OD-8). Practice records go to a personal branch only and are never merged as binding.
2. Binding pass: on the RC SHA's CI-built Storybook artifact (URL from the RC pipeline), run every template row in `sr-matrix.template.json`.
   - SR: VoiceOver macOS/Safari, VoiceOver iOS/Safari, NVDA/Chrome, TalkBack/Chrome.
   - Touch: physical iPhone on iOS 18 and iOS 26, and an Android Pixel 7-class phone.
   - Motion: Button, Dialog, Menu, Sheet and Tabs under OS reduced motion, on all 4 platforms.
3. Commit `tests/a11y/manual/records/<stream>/<subject>-<at>.json` with `sha` = the RC SHA. Use one PR, `next-fin/h-sr-records-<rc>`, authored by the testers. Minimums: ≥44×5, MAT ≥10, SURF ≥24×5 (≥3 `ai-*` with reviewer + AT + result), 4 motion.
4. A failure becomes a bug filed against the owning WP. The failing record stays as recorded, and a re-test on a new RC SHA replaces the whole set.
5. Run `node scripts/mat/verify-a11y-manual.mjs --sha <rc>` and `node tests/a11y/manual/aggregate.mjs --sha <rc>` (both must exit 0; the CI job of FIN-H.4 is authoritative). Then **Gurbaksh closes issue #16** with a comment linking the records PR, the aggregate artifact and the RC pipeline. Agent prep for this: H3-1..H3-4.

**HU-2 L14 human visual review** — REQ-FIN-111. Original REQ: REQ-QUAL-73. A named design reviewer.
At RC-1, after FIN-G's REQ-FIN-103 tooling (composite.ts, `certification/review/visual-rubric.md`, the manual `qual:certify:review-record` job) is on `next`: score every flagship subject-state, the T0 matrix and the six S1 showcases with R1–R7 (1–4), using the composites from the RC pipeline. Commit the records under `certification/review/records/**` in `next-fin/h-review-records-<rc>`. Run `qual:certify:review-record` on the RC pipeline; all scores must be ≥3, with none at 1. Agent prep: H3-7.2.

**HU-3 Real-device performance sign-off** — REQ-FIN-112 (REQ-QUAL-48 sign-off part). Gurbaksh, or a named performance signer.
Prerequisites: OD-5 (renew the remote-runner egress CA) and OD-11 (runner registration/tag) done. Trigger the device-farm job (FIN-G REQ-QUAL-67 lane) for the six S1 scenes, Dialog and AppShell on the RC SHA, fill in the measured p95 cells and artifact URLs in `docs/certification/real-device-matrix.md` (≤16.7 ms; ≤25 ms mid Android), and sign (`signer`, `signedAt`, `sha`). Agent prep: H3-7.1.

**HU-4 Operator actions** — REQ-FIN-113 (operator parts of REQ-PLAT-08/-09/-16/-35/-81/-82). Gurbaksh, from a PLAT worktree with existing logins only.
- OP-1: apply the OD-11 GitLab settings.
- OP-2: downstream grep at the 4.2 cut, plus the AuraOne issue for the two 3.1.1-pinned templates.
- OP-3: `consumer-grep --write` for RM-01..13, plus acknowledgements.
- OP-4: `sync-fragments` both directions, daily while any stream has unsynced rows.
- OP-5: `gh release create` per tag. The current tags are v4.0.0 and v4.1.0; v4.1.1, v4.2.0, v4.3.0, the alphas, RC and GA are all pending.
- OP-6: close #77 and #97 with the FIN-H.1 (a) comments, and confirm no stale stacked PR remains before RC-1.
Each one is recorded by filling in its `operator-<topic>.md` (H3-6) with date and evidence. Agent prep: H3-6, plus the stale-PR list in OP-6.

**HU-5 Owner decisions** — §5.9. Gurbaksh.
For each `od-<n>.md` (H3-5), decide or explicitly accept the default, and fill in `status: decided|defaulted`, `decidedBy`, `decidedAt` and `evidence`. Order by blast radius:
1. **OD-8**, which unblocks every needs=ci item.
2. **OD-13**: confirm `release/4.1.x` at `a19f4bbe1`.
3. **OD-21**: GHSA published, then the private archive repo created. The GHSA id and repo URL also go into `RM-01.json` `gate.ghsa`/`gate.archive` (owner commit).
4. **OD-16**: contract-v1.2-final, including C-16.
5. **OD-10/OD-2**: npm trusted publisher and `@auraglass` org.
6. **OD-11/OD-12/OD-9**.
7. **OD-14**.
8. **OD-5**.
9. **OD-15, OD-17, OD-18, OD-19, OD-20**.
10. Carried ODs 1/3/4/6/7: confirm.
The agent never performs the underlying actions: mirror config, branch-protection writes, npm org/publisher config, GHSA publication, credential rotation.

### FIN-H.4 Validation

Every job below runs in GitLab CI (project 87152036) with `allow_failure: false`, on the ref named. None of them can run until OD-8 brings the refs and pipelines to GitLab. Job definitions live in CI files FIN-H doesn't own, so FIN-H asks the owner to add each one; the requested file is named in each row.

| AC | Must be green | Where / ref | Remote-only |
|---|---|---|---|
| H3-1..H3-4 (pre-AC) | jest `tests/a11y/manual/__tests__/{verify-a11y-manual,sr-matrix,scripts-coverage,aggregate}.test.ts`, picked up by the existing `testMatch` `tests/**/*.test.{ts,tsx,mjs}`, inside the existing jest lane; `node tests/a11y/manual/gen-matrix.mjs --check` | MR pipeline on each `next-fin/h-*` branch, then `next`. The `--check` step is requested in `ci/mat.gitlab-ci.yml` (FIN-D) next to the existing MAT a11y jobs | no (light), but CI is authoritative |
| AC-FIN-110 | job `mat:a11y:manual-verify`: `node scripts/mat/verify-a11y-manual.mjs --sha $CI_COMMIT_SHA` (requested in `ci/mat.gitlab-ci.yml`, FIN-D). `node tests/a11y/manual/aggregate.mjs --sha $CI_COMMIT_SHA` uploads `.artifacts/qual/a11y-manual-$CI_COMMIT_SHA.json`, which `qual:certify:verdict` (FIN-G, REQ-FIN-103) consumes with verdict `pass`. The Storybook build artifact used by the testers is produced by the RC pipeline's Storybook job | RC tag pipeline (`v5.0.0-rc.1`, on `next`) | yes: Storybook build in CI; SR/touch on physical devices by humans |
| AC-FIN-111 | manual job `qual:certify:review-record` (FIN-G), run and passed (not skipped) on the RC-1 pipeline; it is a release-blocking `needs` of the verdict job | RC-1 pipeline | yes |
| AC-FIN-112 | device-farm lane (FIN-G REQ-QUAL-67) non-`pending` and within budget for the 8 subjects; `docs/certification/real-device-matrix.md` signed with the same SHA | RC pipeline on the AWS runner tag (OD-11) | yes: device farm only, after OD-5 |
| AC-FIN-113 | FIN-B `tests/ci/decision-records.test.ts` passes with every `operator-*.md` and `od-*.md` filled; `plat:gate:removal` (FIN-C, blocking) green for RM-01..RM-14, with consumer-grep records `acknowledged`; open-PR list free of stale stacked PRs (OP-6 output attached to `operator-close-stale-prs.md`) | `next` pipeline before the RC tag; `release/4.x` pipeline at the `v4.2.0` cut for the downstream report | yes |

The agent must not run Storybook, Playwright or any device lane locally. It may run `node scripts/mat/verify-a11y-manual.mjs`, `node tests/a11y/manual/gen-matrix.mjs --check`, `node tests/a11y/manual/aggregate.mjs` and `npm test -- tests/a11y/manual` locally (light). It must report anything that only CI can confirm as unverified until a pipeline URL exists.

### FIN-H.5 Exit criteria

Agent prep (done when merged on `next` with green MR pipelines):
- [ ] H3-1: one `sr-record.schema.json` in the repo; the verifier reads it and passes the 8 negative/positive cases (REQ-MAT-66 and REQ-QUAL-72 schema clause).
- [ ] H3-2: `sr-matrix.template.json` generated, with `--check` clean; `sr-matrix.test.ts` green, or `pending` only for flagship 18 within its baseline expiry (REQ-QUAL-72).
- [ ] H3-3: a script for every template subject, including MAT Lab/Panel/reduced-motion, 24 SURF flagships and 5 `ai-*`; `scripts-coverage.test.ts` green (REQ-MAT-66, REQ-SURF-196, REQ-SURF-129 script parts).
- [ ] H3-4: `aggregate.mjs` and `aggregate.test.ts` green; output shape accepted by FIN-G's verdict job.
- [ ] H3-5: `od-1.md`..`od-21.md` drafted (`awaiting-owner`/`carried`).
- [ ] H3-6: six `operator-*.md` runbooks drafted.
- [ ] H3-7: the real-device matrix skeleton and the review-records README.
- [ ] FIN-H.1: the RM-11 sub-order was respected (#303 → #279/#282/#288 → #283 → #285 → #298 → #180 → #184), and #163 was trimmed of `operator-codemods-qual.md`.

Human/owner (done only with real records; the agent verifies them, never writes them):
- [ ] **AC-FIN-110** (REQ-FIN-110; REQ-MAT-66, REQ-SURF-129, REQ-SURF-196, REQ-QUAL-72): binding records on the RC SHA; verifier and aggregator exit 0 in the RC pipeline; issue #16 closed by Gurbaksh with links.
- [ ] **AC-FIN-111** (REQ-FIN-111; REQ-QUAL-73): L14 records for every flagship subject-state, the T0 matrix and the 6 S1 showcases, all ≥3 and none at 1; `qual:certify:review-record` green on RC-1.
- [ ] **AC-FIN-112** (REQ-FIN-112; REQ-QUAL-48 sign-off): matrix signed within the p95 budgets, after OD-5 and OD-11.
- [ ] **AC-FIN-113** (REQ-FIN-113; REQ-PLAT-08/-09/-16/-35/-81/-82 operator parts): OP-1..OP-6 each recorded with date and evidence; #77 and #97 closed; RM-01..13 `acknowledged`; `downstream-4.2.0.json` attached to the `v4.2.0` release; a GitHub release for every tag cut.
- [ ] OD-1..OD-21: each `od-<n>.md` is `decided`, `defaulted` or `carried`, with owner fields filled.

Report (JSON): `{"wp":"FIN-H","prepPRs":{...},"issue16":{"state":"open|closed","recordsOnRcSha":n,"required":n},"reviewRecords":{"count":n,"min":n},"realDevice":"unsigned|signed","operator":{"OP-1".."OP-6":"awaiting-operator|done"},"ownerDecisions":{"OD-n":"decided|defaulted|carried|awaiting-owner"},"staleOpenPRs":[...],"unverified":[...]}`.


---

## 13. Owner and human actions (consolidated; the agent prepares, never performs, records or fakes them)

This list replaces the per-WP owner lists for scheduling; each WP section keeps its agent-prep detail. Every decision is recorded by the owner in `docs/release/decisions/od-<n>.md` (FIN-H drafts them in H3-5 with `status: awaiting-owner`; the owner fills `status: decided|defaulted`, `decidedBy`, `decidedAt`, `evidence`). Every operator action is recorded in its `operator-<topic>.md` runbook (FIN-H H3-6) with date and evidence.

| # | Item | Exact owner / human steps | Agent prep (WP) | Blocks |
|---|---|---|---|---|
| 1 | **OD-8 pipelines (do first)** | (1) Create a fine-grained GitHub PAT for `auraoneai/auraglass` with Contents: read, Metadata: read (only Gurbaksh creates it; never copied from this Mac). (2) GitLab 87152036 → Settings → Repository → Mirroring repositories → add **pull** mirror `https://github.com/auraoneai/auraglass.git` with that PAT; "Mirror only protected branches" off; "Trigger pipelines for mirror updates" on; "Overwrite diverged branches" on. (3) Once `next` and `release/4.x` have pipelines, disable the org `mirror-to-gitlab` workflow for this repo only (it force-pushes `--prune`). Refs that must arrive: `main`, `next`, `release/4.x`, `release/4.1.x`, `next-*/**`, `4x-*/**`, `4x11-*/**`, `contract/**`, `sync/**`, tags `v*`. **Fallback:** remove `--prune` from `mirror-to-gitlab` for this repo, then after each merge run `node scripts/release/push-gitlab-refs.mjs` (dry-run, review) and `--apply` from the owner Mac. **Or** record Option B (merge on review, CI later) in `od-8.md`. Confirm with `node scripts/ci/gitlab-status.mjs --sha $(git rev-parse origin/next)`. | FIN-B B3-3 script + `gitlab-ci-verification.md` section; FIN-H `od-8.md` | every merge and every AC-FIN |
| 2 | OD-11 GitLab settings (OP-1) | With an existing `glab` login: CI config path `.gitlab-ci.yml`; protect tags `v*`; nightly schedules on `next`, `release/4.x` (and `release/4.1.x` until 4.1.1); Pages public; "Keep artifacts from most recent successful jobs" on; register/approve the gated AWS runner tag (no new IAM grants). Date each row in `docs/release/decisions/gitlab-project-settings.md`. | FIN-B checklist rows; FIN-H `operator-od11-gitlab-settings.md` | REQ-FIN-23, -112, -113, remote lanes |
| 3 | Synthetic tag pipeline (AC-FIN-22) | Push a throwaway tag (e.g. `v4.2.0-gatecheck.1`, never published) on `release/4.x` or run a manual pipeline with `CI_COMMIT_TAG` set; delete the tag after. | FIN-B | AC-FIN-22 |
| 4 | OD-13 4.1.x baseline | Confirm `release/4.1.x` (a19f4bbe1) was cut from 78fd7bda1 with cherry-picks 85e844776, f4d5f884b, 4dabc703b; acknowledge the 20 unreviewed direct pushes as canonical on 4.1.x and #128 as the only 4.x route (R12). | FIN-C `docs/release/4.1.x-baseline.md`; FIN-H `od-13.md` with pre-filled `git` evidence | 3.4, 3.5, v4.1.1 |
| 5 | OD-21 GHSA + archive | (1) Publish the GHSA from `docs/security/advisories/2026-10-hosted-runtime.md` **before** `v4.1.1`. (2) Create private `auraoneai/auraglass-server-archive` and push the `legacy/src/server/**` history. (3) Fill `ghsaId`/`archiveRepoUrl` in `od-21.md` and `RM-01.json` `gate.ghsa`/`gate.archive` (owner commit). | FIN-C draft + `verify-archive.mjs` | v4.1.1, #184, REQ-FIN-39 |
| 6 | OD-2 / OD-10 npm | Create/confirm the `@auraglass` npm org. On npmjs.com for `aura-glass`, `@auraglass/cli`, `@auraglass/registry`, `@auraglass/mcp`, `@auraglass/labs`: Settings → Trusted publishing → GitLab CI/CD with the values in `docs/release/trusted-publishers.md` (namespace `chahal-foundation-group/github-auraoneai`, project `auraglass`, env `npm-publish`); set each row's status/date. | FIN-C table + first-publish procedure | REQ-FIN-31, -45, -87, every publish |
| 7 | OD-16 contract bundle | Approve or decline each C-1..C-17 item in the `contract/v1.2-final` PR (incl. `data-ag-theme` and the other C-2 attributes, the `css` export condition, C-6 d3/three peer drop, `trap-focus`, CC-CMP-01 compound parts, AI SDK v6, Waveform 5.1, C-16 SrRecord schema, C-10 CODEOWNERS on `main`); declined items keep their fallbacks. Record in `od-16.md` before the PR merges. | FIN-A FIN-463 PR text; FIN-B/D/E/F/H hunks | S0, MAT-14/20/27, PLAT-67/71, CMP-06/86, SURF-106/165, H3-1 |
| 8 | OD-14 sole-maintainer review | Choose second reviewer, review bot, or documented admin bypass; then apply branch protection on `main`, `next`, `release/4.x`, `release/4.1.x` (linear history, `required_approving_review_count ≥ 1`, status context if OD-9 is on). Create the `forward-port` label once. | FIN-B payloads from `verify-branch-protection.mjs` | REQ-FIN-25, -32 |
| 9 | OD-9, OD-12 | Decide GitLab → GitHub status reporting; Pages custom domain (default `$CI_PAGES_URL`). | FIN-H drafts | REQ-FIN-25, -26 |
| 10 | OD-5 | Renew the remote-runner egress CA; register the Device Farm project and mac1.metal runner for `qual:certify:devices`. | FIN-G G-25 `--self-check` | REQ-FIN-112, QUAL-67 |
| 11 | OD-15 | Combobox virtualisation: (a) accept #242's owned windowed list (then #337 drops its rewrite) or (b) amend the `verify-deps.mjs` allowlist for `@tanstack/react-virtual` (C-11; #242 closes). | FIN-E evidence → FIN-H `od-15.md` (R19) | CMP-72, #242, #337 |
| 12 | OD-17 | Compat date adapters (lazy / own `./compat/date` subpath / documented peer — #341 implements the last) and Backdrop `tone` (`mediaTone` rename vs `BANNED_PROPS` exception). | FIN-F evidence → FIN-H `od-17.md` (R18) | SURF-04, -11, #341 |
| 13 | OD-18 | Confirm `createBrandTheme` `accentShift` default 0 (or another value). | FIN-D | MAT-16 |
| 14 | OD-19 + PNG allowlist | App-shell token namespace (default private `--_ag-app-shell-*`) and shipping-asset PNG allowlist (`src/**/assets/` admission or relocation). | FIN-A #120-v2 default; FIN-G decision draft | MAT-04, QUAL-60 |
| 15 | OD-20 | TreeView `treegrid` vs `tree`; DateTimePicker in 5.1. | FIN-F remote APG results → FIN-H `od-20.md` | SURF-82, -105 |
| 16 | Carried OD-1, OD-3, OD-4, OD-6, OD-7 | Confirm each `od-<n>.md` (`status: carried`). | FIN-H H3-5 | §14 line 12 |
| 17 | Owner calls inside WPs | (a) `mat:tokens-js` budget raise (#178 proposed 6144 B) — approve with a measured artifact or reject; (b) CMP-92 SheetSide `left|right` keep or remove; (c) confirm PR #28's content is redone on `next` (D.3-22) rather than reopened; (d) confirm the app-shell merge order #347 → #348 → #349 → #350 → #351; (e) sign the QUAL-codemods note (QUAL declares no codemods; `fragments/codemods/qual.ts = {}` on 4.x) before v4.3.0 — it lives at the FIN-C path `docs/release/codemods-qual.md` that #163 is trimmed to, not under `operator-*.md` (FIN-H.1 (b) governs over FIN-C's owner table); (f) supply or approve licensed sources for the 8 QUAL-07 scenes; (g) approve each `next-qual/baselines-<yyyymmdd>` baseline PR from `baseline-diff-report.html`. | FIN-D, FIN-E, FIN-F, FIN-C, FIN-G | named REQs |
| 18 | Operator runs (OP-2..OP-5) | OP-2: `downstream-grep` at the 4.2 cut over `/Users/gurbakshchahal/AuraOne` and `/Users/gurbakshchahal/platforms`, then file the AuraOne issue for the two templates pinned at 3.1.1. OP-3: after #182 and the R7 sub-order, `consumer-grep --family RM-NN --write` for RM-01..13, review, set `acknowledged[]`, commit on `next-fin/h-rm-consumer-grep`. OP-4: after #125 (and `4x-fin/a-fragsync`), `sync-fragments.mjs` for `deprecations` (4.x → next) and `codemods` (next → 4.x) daily while rows are unsynced; merge the `sync/*` PRs on green. OP-5: per tag, `gh release create <tag> -R auraoneai/auraglass --verify-tag --notes-file RELEASE_NOTES_<version>.md` after `plat:publish:npm` is green; edit the v4.1.0 release text per PLAT-52. | FIN-H H3-6 runbooks; FIN-C tools | REQ-FIN-113, PLAT-35/81, AC-FIN-13 |
| 19 | Close #77 and #97 (OP-6) | Re-verify `git merge-base --is-ancestor bfc216d0a origin/next && git merge-base --is-ancestor d5d950b59 origin/release/4.x`, then `gh pr close 77 -R auraoneai/auraglass --comment "Superseded: head bfc216d0a is an ancestor of origin/next (contained via 366ff2023). Closing per REQ-FIN-113."` and `gh pr close 97 -R auraoneai/auraglass --comment "Superseded: head d5d950b59 is an ancestor of origin/release/4.x (contained via 645735fce). Closing per REQ-FIN-113."`; confirm no other open PR's head is an ancestor of `next`/`release/4.x` before RC-1. | FIN-H `operator-close-stale-prs.md` with the pre-computed list | REQ-FIN-113, RC-1 |
| 20 | Tags and releases | Owner pushes `v4.1.1` on `release/4.1.x` (items 4–6 done), then `v4.2.0` and `v4.3.0` on `release/4.x`, then `v5.0.0-alpha.N`, RC and GA on `next`. Publishing only by `plat:publish:npm` with provenance; never a local `npm publish`. Follow `/Users/gurbakshchahal/AuraOne/AuraOne-Deploy-Final-PERMANENT.md` where it applies. | FIN-C C.3-15 prep; FIN-D/E DEP row lists for notes | REQ-FIN-45, §14 |
| 21 | Merge arbitration confirmation | Confirm or reverse the 3.1 decisions with blast radius: R11 (#122 single LayerStack owner), R12 (#128 as the only 4.x route), R7 (RM hunk re-filing). | this prompt | §3 |
| 22 | **Issue #16 passes (HU-1, REQ-FIN-110)** | Testers: practice on nightly `next` Storybook artifacts; binding pass on the **RC SHA's** CI-built Storybook: SR on VoiceOver macOS/Safari, VoiceOver iOS/Safari, NVDA/Chrome, TalkBack/Chrome; touch on physical iPhone (iOS 18 and 26) and Pixel 7-class Android; reduced motion for Button, Dialog, Menu, Sheet, Tabs on 4 platforms. Commit `tests/a11y/manual/records/<stream>/<subject>-<at>.json` (≥44×5, MAT ≥10, SURF ≥24×5 with ≥3 `ai-*`, 4 motion) in `next-fin/h-sr-records-<rc>`. Failures become bugs in the owning WP; a failing record is never edited. Then `verify-a11y-manual.mjs --sha <rc>` and `aggregate.mjs --sha <rc>` exit 0 in the RC pipeline, and **Gurbaksh closes #16** with links. | FIN-H H3-1..H3-4 | AC-FIN-110 |
| 23 | **L14 design review (HU-2, REQ-FIN-111)** | A named design reviewer scores every flagship subject-state, the T0 matrix and the six S1 showcases at RC-1 with R1–R7 (1–4) on the RC composites; all ≥3, none 1; records under `certification/review/records/**` in `next-fin/h-review-records-<rc>`; `qual:certify:review-record` passes on RC-1. | FIN-G G-16 tooling; FIN-H H3-7 README | AC-FIN-111 |
| 24 | **Real-device sign-off (HU-3, REQ-FIN-112)** | After items 2 and 10: trigger the device-farm job for the six S1 scenes, Dialog and AppShell on the RC SHA; fill measured p95 cells and artifact URLs in `docs/certification/real-device-matrix.md` (≤16.7 ms; ≤25 ms mid Android) and sign (`signer`, `signedAt`, `sha`). | FIN-H H3-7 skeleton; FIN-G G-25 | AC-FIN-112 |

---

## 14. Final GA checklist (5.0.0) and final report

Run after all WPs report. Tag `v5.0.0` (FIN-483) only when **every** line is true and recorded in `.artifacts/qual/release-verdict.json` (G-01..G-16, `ga: true`, `sha` = the tagged SHA). An unchecked line means no tag; report the blocking line, its owner and the exact action instead. Lines 1–12 are PRD-F §18 verbatim in substance; lines 13–14 are the AC-FIN-GLOBAL and REQ-FIN-113 conditions carried from the previous prompt.

- [ ] 1. All 584 requirements of PRD-1..5 are `done` per PRD-F §1.1 (Appendix A / ledger: 0 open rows), each with a green job URL; the `implementation-audit/` re-run reports 584/584. *(today: 572 open, 42 with code but no CI, 0 URLs)*
- [ ] 2. Pipelines run on `next`, `release/4.x`, `release/4.1.x`, every stream/`next-fin`/`4x-fin`/`4x11-*`/`contract/*`/`sync/*` branch and every `v*` tag (OD-8 or the REQ-FIN-20 alternative). *(today: 0 pipelines)*
- [ ] 3. Every job in `REQUIRED_JOBS` and `CERT_JOBS` is `allow_failure: false` with a `ci/plat/activation.json` row; `contract:ci-fragments` and `contract:conformance` green on both lines. *(today: `activation.json` is `[]`; conformance does not exist)*
- [ ] 4. `aura-glass@4.1.1` (from `release/4.1.x`, GHSA published first, OD-21), `4.2.0`, `4.3.0` (from `release/4.x`) published by `plat:publish:npm` with provenance; `@auraglass/cli@0.x` published; GitLab Releases created with working `dist-maps.tgz`; dist-tags verified. *(today: npm latest 4.1.0; tags v4.0.0, v4.1.0 only)*
- [ ] 5. Deprecation fragments identical across lines; every 5.0 removal covered by a DEP entry shipped in a published 4.x minor ≥4.2.0 (`verify-breaking-register --coverage --require-covered` exits 0 on the GA tag). *(today: 215-file next vs 4.x diff)*
- [ ] 6. `git ls-files legacy | wc -l` = 0; removal gate green for RM-01..RM-14 with consumer-grep records. *(today: 239 files; RM records `missing`)*
- [ ] 7. Packed tarball: every export target exists, `import`/`require` 8/8 on Node 20.19 and 22, `publint --strict` and `attw --profile esm-only` clean, size and side-effect budgets green; root `import('aura-glass')` resolves `Button`; no `./charts` on 5.0.x.
- [ ] 8. Canaries green from the tarball: next16, next15, vite, vite-tailwind4, vite-compiler, types-strict, jest-cjs, Base UI latest, consumer-4x; `migrate 4to5` fixtures ≥120 cases across all streams, 0 mismatches.
- [ ] 9. Lanes L1–L12 green at release scope with 0 quarantined cells; perf grades meet thresholds (T1 ≥C, T2 ≥D, no letter drop); real-device matrix signed (REQ-FIN-112).
- [ ] 10. Issue #16 closed with SrRecords for 44 flagships × 5 passes on the RC SHA (REQ-FIN-110); L14 review records all ≥3 (REQ-FIN-111). *(today: open, 0 records; flagship 18 has no meta)*
- [ ] 11. Docs site deployed to Pages from the release pipeline; README, `llms.txt` and release notes pass `lint-claims` with every number traced to an artifact.
- [ ] 12. Owner decisions OD-1..OD-21 recorded (decided or explicitly defaulted). *(today: 0 `od-*.md`)*
- [ ] 13. AC-FIN-GLOBAL: every `scripts/integration/baselines/*.json` is `[]`; 0 `console.warn(…pending)` early returns in `tests/{e2e,a11y,perf,visual}`.
- [ ] 14. Open-PR list free of stale stacked PRs (#77, #97 closed) and of PRs superseded by this plan; `gh issue list --state open` triaged with no GA-blocking issue; every operator action (OP-1..OP-6) recorded with date and evidence.

**Final answer of the running agent**: the eight WP JSON reports (§4 format plus each WP's extra fields: FIN-D `seedFreeEntries` and `cssVars` counts; FIN-H `issue16`, `reviewRecords`, `realDevice`, `operator`, `ownerDecisions`, `staleOpenPRs`), then one summary JSON:

```json
{
  "gaReady": false,
  "gaChecklist": [{ "line": 1, "met": false, "evidence": ["<url>"], "blocking": "<text|null>" }],
  "blocking": [{ "item": "", "owner": "agent|ci|human|owner", "exactAction": "" }],
  "openPrs": { "atStart": 241, "merged": 0, "closed": 0, "stillOpen": 0, "notInPlan": [] },
  "tags": [],
  "ledger": { "done": 0, "open": 572, "codeMergedAwaitingCi": 0 }
}
```
