# scripts/ci — GitLab CI helpers

CI/CD here is **GitLab CI only** (contract §4.13). The repo
`github.com/auraoneai/auraglass` is the source of truth; GitLab project
`87152036` is a one-way mirror that runs pipelines on pushed branches/tags.

## Layout

- `.gitlab-ci.yml` (root) — stages `contract, build, test, certify, package,
  deploy, publish`; workflow rules set `AG_SCOPE` (`pr|main|nightly|release`)
  and `AG_LINE` (`4x|5x`); `.ag-*` runner templates; the three `contract:*` jobs.
- `ci/<stream>.gitlab-ci.yml` — per-stream fragments, included by wildcard.
- `ci/plat/activation.json` — first-green-run records that let a REQUIRED job
  flip to `allow_failure: false`.

## Scripts

| Script | Purpose |
|---|---|
| `verify-ownership.mjs` | `contract:ownership` — every changed path is owned by the branch's stream (§3.1) |
| `verify-ci-fragments.mjs` | `contract:ci-fragments` — §4.13.4 rules 1-9 + G-16 + activation + task-graph hook |
| `gitlab-status.mjs` | Merge gate — `node scripts/ci/gitlab-status.mjs --sha <head>` must print `success` |
| `assemble-pages.mjs` | `pages` job — builds `public/` (docs, storybook, lab redirect, `r/` registry) |
| `require-ci-publish.js` | `prepublishOnly` guard — exits 1 outside `plat:publish:npm` |

Evidence lives under `.artifacts/plat/<job-slug>/` (`evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA`,
expire 14d pr/main, 30d nightly, 90d release). Evidence is never committed.
