# GitLab CI verification — contract facts × lines (REQ-FIN-23, REQ-PLAT-08)

Four contract facts, recorded once per release line (`next`, `release/4.x`).
A row's status is `verified` only with an evidence URL (pipeline, API output
or Pages response); anything else names the blocker. Nothing is faked:
project 87152036 has run **0 pipelines** as of 2026-10-09 — every pipeline
fact stays `missing`/`failed` until REQ-FIN-20 (OD-8) lands.

| # | Fact | Line | Result | Evidence / blocker |
|---|---|---|---|---|
| 1 | Multi-ref push creates a pipeline for the pushed SHA | next | **failed** | No pipeline has ever run on `next` (0 pipelines on project 87152036). Blocked on OD-8 pull mirror (or the owner-run `push-gitlab-refs.mjs` fallback). Recorded FAILED until REQ-FIN-20. |
| 2 | Multi-ref push creates a pipeline for the pushed SHA | release/4.x | **failed** | Same — 0 pipelines on project 87152036. Blocked on OD-8. |
| 3 | SaaS runner tags (`saas-linux-medium-amd64` etc.) exist on the group tier | next | **unverified** | Requires `glab api projects/87152036/runners` or group runner list (owner); `.ag-*` templates already tag `saas-linux-medium-amd64`. Operator: record the tag list once the runner pool is visible. |
| 4 | SaaS runner tags exist on the group tier | release/4.x | **unverified** | Same as row 3 — identical tags run both lines. |
| 5 | Playwright image used by `.ag-playwright` exists (pullable) | next | **unverified** | `mcr.microsoft.com/playwright` image tag is pinned in `.gitlab-ci.yml`; existence to be proven by the first browser job's `pull` log line. Pending first pipeline. |
| 6 | Playwright image used by `.ag-playwright` exists (pullable) | release/4.x | **unverified** | Same — first 4x browser job will record the pull log. |
| 7 | `npm publish --provenance` works under `SIGSTORE_ID_TOKEN` | next | **unverified** | `plat:publish:npm` declares `id_tokens: { SIGSTORE_ID_TOKEN: { aud: "sigstore" } }`; provenance verified by the first real publish job (or the publish dry-run on a tag). Blocked on OD-2/OD-10 + first tag pipeline. |
| 8 | `npm publish --provenance` works under `SIGSTORE_ID_TOKEN` | release/4.x | **unverified** | Same — first 4.x tag publish records it. |

## First green pipelines

Recorded here once REQ-FIN-20 lands (AC-FIN-23):

- `next`: **none yet** (blocked on OD-8)
- `release/4.x`: **none yet** (blocked on OD-8)

Operator (OD-11) actions: apply the `.gitlab-ci.yml` config path in project
settings, protected tags `v*`, nightly schedules on both lines, Pages public,
keep-latest-artifacts — dates go in `gitlab-project-settings.md`.

## Contract C-items

- **contract C-item: stages package before certify.** Root `stages` is
  `[contract, build, test, package, certify, deploy, publish]` (contract v1.1
  listed `certify` before `package`). GitLab rejects a `needs:` on a job in a
  later stage, and every `qual:certify:*` job needs `plat:package:pack`, so the
  v1.1 order made the merged config invalid. `scripts/ci/verify-ci-fragments.mjs`
  `STAGES` and every `tests/ci/fixtures/ci-fragments/**/.gitlab-ci.yml` carry
  the new order; fixture `stage-order-legacy/` proves the v1.1 order now fails.
  To be folded into contract v1.2-final.
- **contract C-item: contract:ci-fragments fetches its base ref.** The job runs with
  `GIT_DEPTH: "0"` and fetches `origin/next` (or `origin/release/4.x` on 4x)
  before `verify-ci-fragments.mjs`, so the task-graph hook's
  `origin/<base>...HEAD` diff resolves (probe pipeline 2934006051 failed with
  `fatal: ambiguous argument 'origin/next...HEAD'`). Under `GITLAB_CI` an
  unresolvable base is now a failure, not a silent skip.
- **contract C-item: R1 workflow prefixes.** `workflow:rules` also run
  pipelines for `^next-fin/`, `^4x-fin/`, `^4x11-(plat|mat|cmp|surf|qual|fin)/`
  (line 4x), `^sync/` (5x unless the 4x `sync/fragments-codemods-` rule
  matched first) and `release/4.1.x` (scope main, line 4x), so FIN heads get
  CI evidence before merge (PROMPT_FINAL_COMPLETION_V2 §3.1 R1).

`tests/ci/root-pipeline.test.ts` compares the root file with the v1.1 block
after applying exactly these C-items; any other deviation fails.
