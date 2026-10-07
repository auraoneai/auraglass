# Completeness and concurrency review: five-PRD set

Reviewed 2026-10-07 against `contract-v1.1`. Scope: everything under `docs/auraglass-5/` except `archive/`. Source code was not modified.

## Result

| Check | Result | How verified |
|---|---|---|
| Exactly 5 PRDs + contract | PASS | `prd/` holds PLAT, MAT, CMP, SURF, QUAL; `AURAGLASS_5_CONTRACTS.md` present |
| 22 sections per PRD | PASS | each PRD has `## 1.`..`## 22.` (Problem … Open items) plus Appendix A |
| No PRD/stream waits for another | PASS after fixes | `rg` for after/once/until/wait/blocked/prerequisite/wave/depends on PRD over PRDs, prompts, tasks, master, contract; 30 hits rewritten (below). Remaining "until X merges" text reports `pending`, which is the contract's non-blocking state |
| Prompt prerequisites = contract only | PASS after fixes | 13 hand-written lane prompts already said "None except the frozen contract"; added `## Prerequisites` to the 25 generated prompts (generator change) and to `PROMPT_1_PLAT.md` and `PROMPT_4_SURF.md`. 38/38 now carry it |
| `build-tasklist` | PASS | `node tools/build-tasklist.mjs` → 2,158 tasks, 0 problems (ids, fields, same-stream `depends_on`, per-line single owner) |
| Ownership disjoint | PASS | same run: every task path resolves to exactly one owner via `tools/ownership-table.mjs` (contract §3.2, first match wins); seam files are owned by `CONTRACT` and created once at C0 (contract §2.2, "Identical adds": single creation chosen, stated) |
| Archived content not lost | PASS | all 1,274 archived REQ ids across the 19 PRDs appear in an Appendix A row (scripted check, handles `X-NN, -MM` and `..` ranges). 36 sampled REQs (≥1 per archived PRD) checked for substance: A11Y-10/21, AI-07/51, CTL-10/153, DATA-07/48, DS-24/38, DX-08/65, EXP-03/14, FND-06/28, MAT-09/53, MED-16/36, MOT-65/83, NAV-08/73, OVL-16/29, PERF-04/38, PKG-07/73, QA-03/20, REL-25, SB-30, TRUST-12/40. Each maps to a new REQ whose text carries the specifics (e.g. `useSyncExternalStore` store, `downsamplePeaks`, dHash distinctness, 4.1.0 retraction, `lint:fix`, `skipLibCheck:false`, `keyboard-inset-height`, `ag-src-<id>`), or is recorded as moved (DS-38 → PLAT tailwind bridge; MOT-83 deletions → PLAT legacy quarantine; CTL-150..154 → SURF) |
| Deliverables A–L | PASS | README table; every linked file exists |
| Zero GitHub Actions planned | PASS after fixes | `rg` for `.github/workflows`, `GITHUB_`, `gh run`, `actions/`, `publish-npm.yml`, GitHub Pages, `gh-pages`, `workflow_dispatch`. Remaining hits are (a) evidence rows citing 4.x files, (b) the C0 deletion task PLAT-003 for the five workflows, (c) GitHub→GitLab mapping tables (contract §4.13, R-12), (d) negative test fixtures and "never reference" rules, (e) `mirror-to-gitlab.yml` / OD-8. No job, deploy or publish runs on GitHub |
| All CI/CD on GitLab CI | PASS | contract §4.13: root `.gitlab-ci.yml` (PLAT, verbatim) + `ci/<stream>.gitlab-ci.yml` fragments (row A20, S-53); `merge_request_event` → never; SaaS runners, `mcr.microsoft.com/playwright` image, gated AWS runner as manual fallback (OD-11); `artifacts` + `expire_in`; GitLab Pages `pages` job; npm trusted publishing via `id_tokens` + provenance on the tag pipeline (S-54) |
| Master PRD / README links | PASS | 158 relative links in README, master, contract, architecture, PRDs, prompts; 0 broken |

## Fixes applied

Tasks (then regenerated prompts and ledger):

- Cross-stream "blocked/waits" phrasing rewritten to seam + `pending`: CMP portal/LayerStack (S-23, S-25), toast mounts (S-22/S-23), `./date` cases (SURF), compat test (PLAT), CommandPalette story ids (SURF); MAT `data-ag-obscured` (S-25), deprecation schema (PLAT), beta gate after removals, a11y-pixel job (QUAL), StatCard (SURF), scene assets (S-42); QUAL docs grade page (PLAT, was "BLOCKED on PRD-20"), `reports/` removal, `workspaces`, server-graph cut, PERF lint flip; SURF API-report draft.
- Stale closed part vocabulary removed: CMP-008 and five Menu/Sheet/Toast tasks referenced `AG_PARTS` and "blocked on AG_PARTS"; now `PART_NAME_RE`/`COMMON_PARTS` (S-33), matching REQ-CMP-06 and Appendix A (FND-11 replaced).
- Legacy workflow names in task tests: `foundation-pattern.yml` → `cmp:test:foundation-pattern`; `jobs/main/release.yml` → `qual:certify:l*` in `ci/qual.gitlab-ci.yml`; MAT no longer says QA deletes `design-system-compliance.yml` (PLAT deletes it at C0, row B11).
- "Wave A/B/C" CMP gates renamed "Checkpoint A/B/C" (CMP-internal; they never were cross-PRD); "Wave 0/3" PERF lint wording → ratchet steps.

Docs and tools:

- `tools/build-stream-prompts.mjs`: emits a `## Prerequisites` section (contract only) in every MAT/CMP/QUAL index and lane prompt.
- `prompts/PROMPT_1_PLAT.md`, `prompts/PROMPT_4_SURF.md`: same section added.
- `AURAGLASS_5_MASTER_PRD.md` §5: legend stating that two-digit `PRD-00`..`PRD-21`, `SC-NN` and old group keys inside task provenance are archived ids, not dependencies, and that the archived 19-file numbering differs from the architecture §16 numbering.

## Remaining gaps (not fixed)

1. **Archived ids in task text.** 266 occurrences of `PRD-00`..`PRD-21` and many `SC-NN`/old-key references remain in `tasks/*.json` provenance (`acceptance: "archived: …"`, "Upstream contracts (SC-40, formerly in depends_on): PRD-02:REQ-PKG-10"). They are labelled as archived and none is a `depends_on`, but two numbering schemes coexist (`PRD_TO_GROUP` in `relocate-archived-paths.mjs` vs architecture §16). A mechanical rewrite to new keys needs an agreed mapping per scheme; left as-is with the master PRD legend.
2. **`mirror-to-gitlab.yml` ownership.** `tools/ownership-table.mjs` row B11 resolves `.github/workflows/mirror-to-gitlab.yml` to PLAT; only the contract text says it is org-managed and untouched. Adding an `ORG` owner needs a contract §3.2 amendment (contract change, not a small fix).
3. **Operator `gh` CLI steps.** PLAT keeps operator-run `gh api` (branch protection), `gh release create` and GHSA steps on GitHub. These are not Actions and GitHub is the source of truth, but branch protection cannot require the GitLab pipeline until OD-9 (GitLab → GitHub status) is decided; until then `gitlab-status.mjs` is a merge rule, not an enforced check.
4. **Intra-SURF merge ordering.** `PROMPT_4_SURF.md` I-3: cross-lane blocks (`data-workspace`, `support-inbox`, `ai-workspace`) merge once the imported name is exported on `next`. Inside one PRD and stated as non-blocking for every other task, but it is a merge-order condition.
5. **External gates.** First GitLab publish needs the npm trusted publisher re-pointed from GitHub to GitLab (OD-10, W-7) and GitLab project settings (OD-11). Zero Actions overall needs OD-8 (GitLab pull mirroring). All are owner actions outside the agent perimeter.
6. **Uncommitted.** These edits are in the working tree on `auraglass-5-planning`; they have not been committed or pushed, and so are not yet on GitHub or mirrored to GitLab.
