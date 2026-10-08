# GitLab CI verification — the four unverified facts (PLAT-026, §7.4)

Each row is the contract's unverified fact, the exact check, and its result.
Nothing here is faked: where the check could not run on this VM it is recorded
as `unverified` with the operator action needed.

| # | Fact | Check | Status |
|---|---|---|---|
| 1 | A pipeline actually runs on the mirror for a pushed SHA | `node scripts/ci/gitlab-status.mjs --sha <head>` → `success` | **unverified** — public API `GET /projects/87152036/pipelines` returns 404 (project private or not provisioned; memory of prior session). Operator: run `gitlab-status.mjs` with a `glab` login once the mirror is visible, paste the pipeline URL. Gated on W-6 mirror lag. |
| 2 | Protected tags `v*` exist so `plat:publish:npm` can only fire on tags | `glab api projects/87152036/protected_tags` shows `v*` | **missing** — requires admin; see gitlab-project-settings.md |
| 3 | GitLab Pages serves `public/` for `$AG_PAGES_BRANCH` | after first `pages` deploy: `curl -sI https://chahal-foundation-group.gitlab.io/github-auraoneai/auraglass/` | **unverified** — no `pages` pipeline has run; record the first Pages deploy URL when it exists (evidence). |
| 4 | The `auraglass-aws-remote` runner is registered (OD-11) | `glab api projects/87152036/runners?tag_list=auraglass-aws-remote` | **missing** — owner action OD-11; `.ag-aws-remote` jobs stay `when: manual` + `allow_failure: true` until then |
