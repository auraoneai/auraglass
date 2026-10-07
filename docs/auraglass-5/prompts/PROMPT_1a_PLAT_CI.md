# PROMPT-1a (PLAT): GitLab CI/CD, Pages and npm publishing

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §4.1, §4.2, §5.1, §5.2, REQ-PLAT-51, §12.1 (`tests/ci`, `tests/release` publish rows), §19 (S-53, S-54), §22 (OD-8..OD-12, OI-1, OI-2).
Requirements: REQ-PLAT-01..17, REQ-PLAT-51; job definitions for REQ-PLAT-38, -47 and the `plat:test:visual-4x` producer used by REQ-PLAT-20.
Acceptance: AC-PLAT-01 (publish job half), AC-PLAT-02, AC-PLAT-03, AC-PLAT-14, AC-PLAT-18 (dist-tag logic), AC-PLAT-31 (publishing docs), AC-PLAT-33.
Tasks: PLAT-001..PLAT-054 (`lane: "1a-CI"`) in `docs/auraglass-5/tasks/PLAT.json`.
Index (lane table, ownership, job → entry point table, common rules): `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: `archive/v1-19-prd/prompts/PROMPT_00g_TRUST_RELEASE.md`, `PROMPT_01b_REL_PUBLISH_LEDGER.md`, `PROMPT_01f_REL_TRAIN_OPS.md` (every GitHub Actions step replaced by its GitLab equivalent, contract §4.13.1 table).
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-ci`; branches `next-plat/ci-<topic>` from `origin/next` and `4x-plat/ci-<topic>` from `origin/release/4.x` (this lane's files are line-neutral: land the same commits on both lines).

## Common rules (binding)

1. Precedence: Gurbaksh's live instructions → `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (contract-v1.1) → PRD-1 → this prompt. A needed change to `.gitlab-ci.yml` beyond the five settable values, to §4.13 job contracts or to `CI_JOBS`/`REQUIRED_JOBS` is a `contract/` PR.
2. Concurrency: start on day 0 with only C0 merged. Do not wait for any stream or PLAT lane; other lanes' entry points are called by name from the job table in the index; a missing entry point leaves its job `allow_failure: true` and reporting.
3. Ownership: only the "May touch" list; `contract:ownership` must pass; changesets `.changeset/plat-ci-<topic>.md`.
4. GitLab CI only. Never create or edit any `.github/workflows/*` file other than deleting the five listed; never touch `mirror-to-gitlab.yml`; no job reads PR labels or calls GitHub; merge only after `node scripts/ci/gitlab-status.mjs --sha <head>` succeeds; nobody pushes to the GitLab mirror (W-6: ask the owner to dispatch the mirror if a branch pipeline is late).
5. Remote-first: every pipeline run happens on GitLab SaaS runners; nothing heavy, no Docker and no browser on the Mac. Locally: bounded `rg`, `git`, `node -e`, `npx eslint <files>`, `npx jest <one test file>`.
6. Forbidden: placeholder jobs reported as working; `|| true`, `--no-verify`, `allow_failure: true` on a flipped required job; lowering thresholds; skipped or `.only` tests; snapshot updating; shipping a contract stub.
7. Evidence only as artifacts under `.artifacts/plat/<job-slug>/` with `expire_in`; only decision records are committed.
8. Credentials: no `NPM_TOKEN`, `NODE_AUTH_TOKEN`, `GH_TOKEN`, `CI_JOB_JWT`; `plat:publish:npm` uses only `id_tokens` (`NPM_ID_TOKEN`, `SIGSTORE_ID_TOKEN`); `glab` and `gh` only with existing logins, never login/refresh; owner steps go to the release issue.
9. Conventional commits, no `!`; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

None except the frozen contract and C0. Verify before starting:
- `git show origin/next:.gitlab-ci.yml` exists and its body equals contract §4.13.3; `ci/{plat,mat,cmp,surf,qual}.gitlab-ci.yml` seeds exist; `scripts/ci/verify-ownership.mjs`, `scripts/ci/verify-ci-fragments.mjs` and `contracts/ownership.json` exist (C0-11). If C0 is missing any of these, stop and report the missing C0 item (it is not a stream deliverable).
- `glab auth status` (existing login only) — if absent, every settings task records "missing" instead of applying.

Contract seams consumed: S-53 (root pipeline, fragment rules, `CI_JOBS`, `REQUIRED_JOBS`, artifact paths, environments, Pages layout), S-54 (publish job), S-55 (`ReleaseVerdict`, `VisualClassReport` shapes), S-43, S-48, S-52 (script names), S-36 (package list). Doubles: `tests/contract-doubles/reports/release-verdict.json`, `tests/contract-doubles/reports/visual-class.json`; recorded GitLab API fixtures you capture under `tests/ci/fixtures/gitlab-api/`.

## May touch

`.gitlab-ci.yml` (five values only), `ci/plat.gitlab-ci.yml`, `ci/plat/**`, `fragments/lanes/plat.ts` (content pre-declared in the index), `.github/workflows/{deploy-storybook,design-system-compliance,glass-pipeline,publish-npm,visual-regression}.yml` (delete only), `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/**`, `.gitlab/**`, `scripts/ci/{verify-ownership,verify-ci-fragments,gitlab-status,assemble-pages}.mjs`, `scripts/ci/require-ci-publish.js`, `scripts/ci/README.md`, `scripts/release/{publish,verify-release-verdict,dist-tag,dry-run,sync-fragments,verify-branch-protection}.mjs`, `scripts/publish-307-after-npm-login.sh` and `scripts/configure-npm-trusted-publishing-307.sh` (delete), the `tests/ci/*` and `tests/release/*` files of PLAT-002..050, `tests/ci/fixtures/{ci-fragments,gitlab-api}/**`, `docs/release/branch-policy.md`, `docs/release/decisions/{gitlab-project-settings,gitlab-ci-verification,npm-trusted-publishing,npm-scope}.md`.

## Must not touch

`.github/workflows/mirror-to-gitlab.yml`; `.github/CODEOWNERS` and everything CONTRACT-held; other streams' `ci/<s>.gitlab-ci.yml`; `package.json` (prepublishOnly wiring is 1b's on 4.x, 1d's on next); `packages/**/PUBLISHING.md` (package lanes); every script the jobs call that is not in your list (job → entry point table); GitLab mirror settings (OD-8 is the owner's).

## Steps

1. PLAT-001..002: verify the root pipeline on all three branches, pin `AG_NODE_IMAGE` digest, `AG_NPM_VERSION` exact (>= 11.5.1), `AG_PLAYWRIGHT_IMAGE` = the `@playwright/test` pin; write `tests/ci/root-pipeline.test.ts`.
2. PLAT-003..005: delete any surviving workflow of the five on `main`, `next`, `release/4.x` (one PR per branch); `tests/ci/no-github-ci.test.ts`; rewrite `scripts/ci/README.md` and the PR template for GitLab.
3. PLAT-006..009: complete `verify-ownership.mjs` and `verify-ci-fragments.mjs` (rules 1–9, `no-github-actions`, activation, optional needs, task-graph hook) with one failing fixture per rule.
4. PLAT-010..018: write the full §4.2 job set in `ci/plat.gitlab-ci.yml` (templates `.plat-node`, `.plat-playwright`, `.plat-release`) using the job → entry point table, including `plat:test:pack-matrix` (PLAT-011), `plat:test:react19` (PLAT-012), `plat:test:visual-4x` (PLAT-013), evidence rules (PLAT-017), `ci/plat/activation.json` (PLAT-014) and `fragments/lanes/plat.ts` (PLAT-018). Push to `4x-plat/ci-jobs` first so 1b's 4.1.1 jobs exist early.
5. PLAT-019..021, 030: `gitlab-status.mjs` (no token; public API `GET /api/v4/projects/87152036/pipelines?sha=`), recorded fixtures, `docs/release/branch-policy.md` (merge rule, prefixes, forward-port rule, protection payloads), `no-forward-merge` test.
6. PLAT-022..024: `assemble-pages.mjs`, its test, the `pages` job (environment `pages`, `url: $CI_PAGES_URL`, only on `$AG_PAGES_BRANCH`).
7. PLAT-025..027: apply what the existing `glab` login may change (protected tags `v*`, nightly schedules on `next` and `release/4.x`, Pages public, keep latest artifacts) and record applied/missing; record the four unverified facts from the first pipeline per line.
8. PLAT-028..029: fragment-sync operator chore and its fixture-repo test.
9. PLAT-031..043: `verify-release-verdict.mjs`, `dist-tag.mjs`, `publish.mjs`, `require-ci-publish.js`, `dry-run.mjs --tag`, the verbatim `plat:publish:npm` job, the tag-scope checks inside `plat:package:pack`, the manual dist-tag job, and their tests; delete the two laptop publish scripts.
10. PLAT-044..048: npm trusted-publishing and scope decision records (OD-10, D-23), publishing-docs test, `plat:release:notes` job (GitLab Release via `release:` + `CI_JOB_TOKEN`; OI-1 fallback) and its test.
11. PLAT-049..052: `verify-branch-protection.mjs` (operator, read-only), its test, the owner action to apply protection, OD-8/OD-9 records.
12. PLAT-015: after the first green run per line flip `plat:gate:glass-quality`, `plat:integration:next`, `plat:integration:vite`, `plat:gate:change-class` to `allow_failure: false` with the activation row. No `release/4.x` tag may publish before this.
13. GA only: PLAT-053 (`AG_PAGES_BRANCH: main`, `AG_V4_DIST_TAG: v4-lts`, merge `next` → `main`), PLAT-054 (every `REQUIRED_JOBS` entry `allow_failure: false`; 5.0.0 published only with `ReleaseVerdict.ga === true`).

## Tests

Node (run in `plat:gate:glass-quality` and `contract:*`): `tests/ci/{root-pipeline,no-github-ci,verify-ownership,verify-ci-fragments,plat-fragment,gitlab-status,assemble-pages,decision-records,no-forward-merge}.test.ts`; `tests/release/{sync-fragments,publish,prepublish-guard,tag-pipeline,dist-tag,publishing-docs,release-job,branch-protection}.test.ts`. Pipeline evidence: the first green pipeline URL per line, the first Pages deploy URL, a `npm publish --dry-run` tag-pipeline run before OD-10 (W-7). Each gate is shown failing once on a deliberate bad input (canary branch), URL recorded.

## Visual evidence

None (infrastructure). Evidence = pipeline URLs, the Pages URL with `public/storybook/` and `public/lab/` placeholders or content, artifact listings.

## Exit criteria

- AC-PLAT-14: `.github/workflows/` contains only `mirror-to-gitlab.yml` on `main`, `next`, `release/4.x`; `verify-ci-fragments.mjs` passes on every branch; root pipeline equals the contract with only the allowed values.
- AC-PLAT-02: the `v4.1.1` tag pipeline ran with the four gates at `allow_failure: false`; 0 `|| true`.
- AC-PLAT-03: 0 `NPM_TOKEN`/`NODE_AUTH_TOKEN` references outside the archive; laptop scripts gone; `require-ci-publish.js` exits 1 outside `plat:publish:npm`.
- AC-PLAT-01 (job half): `plat:publish:npm` equals §4.13.7 and produced provenance naming GitLab CI, `chahal-foundation-group/github-auraoneai/auraglass`, `.gitlab-ci.yml`, the tag ref (verified with lane 1b on 4.1.1).
- AC-PLAT-18 (logic half), AC-PLAT-31 (docs half), AC-PLAT-33: as in PRD §17.
- Every PLAT-001..054 task done or listed as blocked with the exact external gate.

## Final report

```
## PROMPT_1a report (PLAT CI/CD)
PRs: <urls>   Head SHAs: <next> <release/4.x>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact / Pages URL) |
| AC | Status | Evidence |
GitLab settings applied/missing: <table from gitlab-project-settings.md>
Unverified facts (§4.13): <4 rows with result>
Owner actions open: OD-8, OD-9, OD-10, OD-11 rest, OD-12, OI-1, branch protection
Deviations: <none | text + evidence>
Blockers: <exact error output, action, resource, identity>
```
