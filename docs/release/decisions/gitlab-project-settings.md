# GitLab project settings — applied/missing (PLAT-025/026)

Project: `87152036` = `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass`.
Recorder: Devin session (no `glab`/`gh` login on this VM — everything is recorded
as the exact operator action; nothing was applied).

| Setting | Wanted | Status | Operator action |
|---|---|---|---|
| CI/CD enabled, `.gitlab-ci.yml` picked up | on | missing | Settings → CI/CD (default on for mirrored repos) |
| Merge-method mirroring | pull-mirror only | missing | Project is already a pull mirror — confirm Settings → Repository → Mirroring |
| `AG_PAGES_BRANCH` | `release/4.x` (→ `main` at GA) | missing | none needed — a root variable, not a project setting |
| `AG_V4_DIST_TAG` | `latest` (→ `v4-lts` at GA) | missing | none needed — root variable |
| `AG_ROLLBACK_LATEST_TO_4X` | protected variable | missing | Settings → CI/CD → Variables → add protected var (only for the 4.x rollback) |
| Protected tags `v*` | protect | missing | Settings → Repository → Protected tags `v*` (publish only from tags) |
| Protected branches `main`, `next`, `release/4.x` | protect | missing | Settings → Repository → Protected branches |
| Scheduled nightly pipeline | daily on both lines | missing | CI/CD → Schedules → nightly on `release/4.x` and on `next` (workflow.rules gives `AG_SCOPE=nightly`) |
| GitLab Pages | enabled | missing | Settings → Pages (deployed by the `pages` job) |
| Status reporting back to GitHub (OD-8) | enabled | missing — **owner decision OD-8** | Settings → Integrations / commit-status API token; decides OD-9 |
| GitHub required-check context (OD-9) | add pipeline context to `next`, `release/4.x` | missing — **owner decision OD-9**, gated on OD-8 | `gh api` payloads in `docs/release/branch-policy.md` |
| npm trusted publisher for `aura-glass` + `@auraglass/*` (OD-10) | configured on npmjs.com | missing — **owner decision OD-10** | npm → package → trusted publishing → GitLab CI provider, project `87152036`, `.gitlab-ci.yml`, job `plat:publish:npm` |
| AWS remote runner `auraglass-aws-remote` (OD-11) | registered | missing — **owner decision OD-11** | GitLab → Settings → CI/CD → Runners → register `auraglass-aws-remote` |

Until `glab auth login` or `glab` exists on the applying machine, every row above
stays `missing`. The API calls to verify are read-only (`glab api
projects/87152036`, `GET /projects/87152036/protected_branches`).
