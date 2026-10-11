---
id: OP-1
title: Apply the OD-11 GitLab project settings
req: REQ-FIN-113
relatedReqs: [REQ-FIN-23, REQ-FIN-112, REQ-PLAT-09, REQ-PLAT-16]
decision: OD-11
status: awaiting-operator
performedBy:
performedAt:
evidence:
---

# OP-1: Apply the OD-11 GitLab project settings

Agent-drafted runbook (FIN-H H3-6). The agent did not perform anything here. The operator runs the
steps, then fills in `performedBy`, `performedAt` (ISO date), `evidence` and the Evidence section,
and changes `status` to `done`. The same dated rows also go into FIN-B's
`docs/release/decisions/gitlab-project-settings.md`. That file belongs to FIN-B, so this runbook
does not edit it.

Project: GitLab `87152036` (`gitlab.com/chahal-foundation-group/github-auraoneai/auraglass`).

## Prerequisites

- OD-11 is recorded in `docs/release/decisions/od-11.md` as `decided` or `defaulted`.
- OD-8 is done, so refs and pipelines exist on GitLab. Without OD-8 the schedules have nothing to
  run against.
- `glab` is already logged in on the operator Mac with Maintainer or Owner on the project. Use the
  existing login only. Do not run `glab auth login`, refresh tokens or run a setup script. If
  `glab api user` fails, stop and record the exact error under Evidence.
- To register the AWS runner, the gated remote-runner host must already exist. This step needs no
  new IAM grants. If the host is missing, mark that row `missing` and say why.

Check the current state first (read-only):

```sh
glab api projects/87152036 | node -e 'const p=JSON.parse(require("fs").readFileSync(0));console.log({ci_config_path:p.ci_config_path,pages_access_level:p.pages_access_level,keep_latest_artifact:p.keep_latest_artifact})'
glab api projects/87152036/protected_tags
glab api projects/87152036/pipeline_schedules
glab api "projects/87152036/runners?type=project_type"
```

## Settings

| # | Setting | Wanted | UI path (project 87152036) | API command (existing `glab` login) |
|---|---|---|---|---|
| 1 | CI config path | `.gitlab-ci.yml` | Settings → CI/CD → General pipelines → CI/CD configuration file | `glab api -X PUT projects/87152036 -f ci_config_path=.gitlab-ci.yml` |
| 2 | Protected tags | `v*`, create allowed for Maintainers only | Settings → Repository → Protected tags → Tag `v*`, Allowed to create: Maintainers | `glab api -X POST projects/87152036/protected_tags -f name='v*' -f create_access_level=40` |
| 3 | Nightly schedule on `next` | daily, active | Build → Pipeline schedules → New schedule → Target branch `next`, cron `0 3 * * *` UTC | `glab api -X POST projects/87152036/pipeline_schedules -f description='nightly next' -f ref=next -f cron='0 3 * * *' -f cron_timezone=UTC -f active=true` |
| 4 | Nightly schedule on `release/4.x` | daily, active | Build → Pipeline schedules → New schedule → Target branch `release/4.x`, cron `30 3 * * *` UTC | `glab api -X POST projects/87152036/pipeline_schedules -f description='nightly release/4.x' -f ref=release/4.x -f cron='30 3 * * *' -f cron_timezone=UTC -f active=true` |
| 5 | Nightly schedule on `release/4.1.x` (until `v4.1.1` ships, then deactivate) | daily, active | Build → Pipeline schedules → New schedule → Target branch `release/4.1.x`, cron `0 4 * * *` UTC | `glab api -X POST projects/87152036/pipeline_schedules -f description='nightly release/4.1.x (until v4.1.1)' -f ref=release/4.1.x -f cron='0 4 * * *' -f cron_timezone=UTC -f active=true` |
| 6 | Pages visibility | public | Settings → General → Visibility, project features, permissions → Pages: Everyone | `glab api -X PUT projects/87152036 -f pages_access_level=public` |
| 7 | Keep latest artifacts | on | Settings → CI/CD → Artifacts → "Keep artifacts from most recent successful jobs" | `glab api -X PUT projects/87152036 -f keep_latest_artifact=true` |
| 8 | AWS remote runner tag | runner with tag `auraglass-aws-remote` online and assigned to the project | Settings → CI/CD → Runners → New project runner → Tags `auraglass-aws-remote`, "Run untagged jobs" off | `glab api -X POST user/runners -f runner_type=project_type -f project_id=87152036 -f tag_list=auraglass-aws-remote -f run_untagged=false`. This returns a runner auth token **once**. Pass it straight into `gitlab-runner register` on the gated runner host. Never print it, paste it here, commit it or copy it into CI variables. |

Notes:
- The `workflow:rules` in `.gitlab-ci.yml` map `CI_PIPELINE_SOURCE == "schedule"` on `release/4.x`
  to `AG_SCOPE=nightly AG_LINE=4x`. Every other schedule (`next`) maps to `AG_SCOPE=nightly AG_LINE=5x`.
  `release/4.1.x` has no dedicated nightly rule, so a schedule on that branch runs with
  `AG_LINE=5x`. Record what the first scheduled pipeline actually ran. If the 4.1.x schedule needs
  the 4x line, hand that to FIN-B (`.gitlab-ci.yml`) and do not edit CI yourself.
- The jobs that extend `.ag-aws-remote` are `when: manual` and `allow_failure: true` until this
  runner exists. FIN-B flips them through a `ci/plat/activation.json` row taken from a green
  pipeline. That is not part of this runbook.

## Expected output

- Row 1: `ci_config_path` is `.gitlab-ci.yml` in the `PUT` response.
- Row 2: `GET protected_tags` lists `{"name":"v*", ...}` with create access level 40.
- Rows 3–5: each `POST` returns a schedule `id`. `GET pipeline_schedules` lists all three as `active: true`.
- Row 6: `pages_access_level` is `public`.
- Row 7: `keep_latest_artifact` is `true`.
- Row 8: `GET projects/87152036/runners` lists a runner whose `tag_list` includes
  `auraglass-aws-remote`, with `status: online` once `gitlab-runner register` has run.
- Within 24 hours there is one scheduled pipeline per scheduled branch. Record each pipeline URL.

## Evidence to paste (operator)

For each row: the date applied, the read-back command output (redact nothing secret, because
none of these responses contain secrets; never paste the runner token) and, for rows 3–5, the
first scheduled pipeline URL.

| # | Applied (date) | Read-back / pipeline URL | Status (applied / missing + reason) |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
