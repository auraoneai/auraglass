# GitLab project settings — OD-11 (REQ-FIN-23, REQ-PLAT-08)

Project: `87152036` = `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass`.

The agent never applies these. It wrote the exact steps and read the current
state (read-only `glab api`, existing login) on 2026-10-11; that reading is in
the `evidence` column. `status` stays `missing` until the operator applies a
setting and fills `appliedBy`, `date` (ISO) and `evidence` (the API output or
UI screenshot link that shows it applied), then sets `status: applied`. The
full operator runbook is FIN-H's `docs/release/decisions/operator-od11-gitlab-settings.md`
(OP-1); the steps below match it. `tests/ci/decision-records.test.ts` fails
once tag `v4.1.1` exists while any row here is still `missing`.

## OD-11 settings (PLAT-settable)

| # | Setting | Wanted | status | appliedBy | date | evidence | Exact operator steps |
|---|---|---|---|---|---|---|---|
| 1 | CI config path | `.gitlab-ci.yml` | missing | | | 2026-10-11 read: `ci_config_path: ""` (GitLab falls back to `.gitlab-ci.yml`; not set explicitly) | Settings → CI/CD → General pipelines → CI/CD configuration file = `.gitlab-ci.yml`; or `glab api -X PUT projects/87152036 -f ci_config_path=.gitlab-ci.yml` |
| 2 | Protected tags | `v*`, create: Maintainers | missing | | | 2026-10-11 read: `protected_tags: []` | Settings → Repository → Protected tags → `v*`, Allowed to create: Maintainers; or `glab api -X POST projects/87152036/protected_tags -f name='v*' -f create_access_level=40` |
| 3 | Nightly schedule `next` | daily, active | missing | | | 2026-10-11 read: `pipeline_schedules: []` | Build → Pipeline schedules → New → branch `next`, cron `0 3 * * *` UTC; or `glab api -X POST projects/87152036/pipeline_schedules -f description='nightly next' -f ref=next -f cron='0 3 * * *' -f cron_timezone=UTC -f active=true` |
| 4 | Nightly schedule `release/4.x` | daily, active | missing | | | 2026-10-11 read: `pipeline_schedules: []` | Same, branch `release/4.x`, cron `30 3 * * *` UTC, description `nightly release/4.x` |
| 5 | Nightly schedule `release/4.1.x` (until `v4.1.1` ships, then deactivate) | daily, active | missing | | | 2026-10-11 read: `pipeline_schedules: []` | Same, branch `release/4.1.x`, cron `0 4 * * *` UTC, description `nightly release/4.1.x (until v4.1.1)` |
| 6 | Pages visibility | public | missing | | | 2026-10-11 read: `pages_access_level: "private"`, project `visibility: "private"` | Settings → General → Visibility, project features, permissions → Pages: Everyone; or `glab api -X PUT projects/87152036 -f pages_access_level=public` |
| 7 | Keep latest artifacts | on | missing | | | 2026-10-11 read: `keep_latest_artifact: true` (GitLab default; operator confirms and dates) | Settings → CI/CD → Artifacts → "Keep artifacts from most recent successful jobs" on; or `glab api -X PUT projects/87152036 -f keep_latest_artifact=true` |
| 8 | AWS remote runner tag | runner tagged `auraglass-aws-remote`, online, assigned to the project | missing | | | 2026-10-11 read: project runners are `auraglass-azure-1`, `auraglass-azure-2` (tags `saas-linux-{small,medium,large}-amd64`, `auraglass-azure`); none has `auraglass-aws-remote`, so `qual:certify:devices` stays manual | Settings → CI/CD → Runners → New project runner, tags `auraglass-aws-remote`, "Run untagged jobs" off; register it on the gated remote-runner host. The runner token is shown once: pass it straight to `gitlab-runner register`, never print, commit or store it in CI variables |

## Other project facts (owner decisions, not OD-11)

| Setting | Wanted | status | evidence | Owner action |
|---|---|---|---|---|
| Shared runners / compute minutes | jobs run on a remote runner pool | missing — owner decision | 2026-10-11 read: `shared_runners_enabled: false`; group minutes exhausted (`ci_quota_exceeded`, see `gitlab-ci-verification.md` row 3) | Buy minutes, or keep the Azure project runners as the pool (contract amendment A-2) |
| GPU runner `saas-linux-medium-amd64-gpu-standard` | a runner with that tag | missing — owner decision | `stuck_pending_no_matching_runners` (`gitlab-ci-verification.md` row 3) | Register a GPU runner with that tag, or accept A-2 (`qual:certify:l10-gpu` manual, `pending`) |
| GitLab pull mirror (OD-8) | pull mirror of GitHub, pipelines on mirror updates | missing — **owner decision OD-8** | 2026-10-11 read: `mirror: false` | `gitlab-ci-verification.md` §"OD-8 owner action" |
| Protected branches `main`, `next`, `release/4.x`, `release/4.1.x` | protected | missing | 2026-10-11 read: only `main` protected | Settings → Repository → Protected branches |
| Status reporting back to GitHub (OD-9) | enabled | missing — **owner decision OD-9**, gated on OD-8 | — | Settings → Integrations / commit-status token; `gh api` payloads in `docs/release/branch-policy.md` |
| npm trusted publisher for `aura-glass` + `@auraglass/*` (OD-10) | configured on npmjs.com | missing — **owner decision OD-10** | — | npm → package → trusted publishing → GitLab CI, project `87152036`, `.gitlab-ci.yml`, job `plat:publish:npm` |
| `AG_ROLLBACK_LATEST_TO_4X` | protected variable | missing | — | Settings → CI/CD → Variables → protected variable (only for the 4.x rollback) |
