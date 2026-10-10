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
