# GitLab CI verification — contract facts × lines (REQ-FIN-23, REQ-PLAT-08)

The four facts that contract v1.1 §7 lists as "not verified by this review"
(multi-ref push pipeline creation, SaaS runner tags on the tier, Playwright
image existence, `--provenance` with `SIGSTORE_ID_TOKEN`), recorded once per
release line (`next`, `release/4.x`). Result is one of `verified`, `failed`,
`partial` or `unverified`. A `verified` or `partial` row cites the GitLab job
or pipeline URL that showed it; an `unverified` row names the blocker. Every
URL below was read from the GitLab API for project 87152036 (read-only, with
the existing `glab` login) on 2026-10-11; the command that reproduces each
one is in "How each row was read". `tests/ci/decision-records.test.ts`
enforces the shape.

Multi-ref push stays `failed` until OD-8 is applied (`docs/release/decisions/od-8.md`).

| # | Fact | Line | Result | Evidence / blocker |
|---|---|---|---|---|
| 1 | Multi-ref push creates a pipeline for the pushed SHA | next | **failed** | The org mirror (`mirror-to-gitlab`, scheduled run https://github.com/auraoneai/auraglass/actions/runs/38115204791) made one multi-ref push at 2026-10-11T06:47:19Z: event `removed`, `ref_type: branch`, `ref_count: 334` (its `--prune`), and pushed no `next` ref; its other pushes since 2026-10-02 are `main` only. Every `next` pipeline is `source: push` from a single-ref push of that SHA by the orchestrator CI pump (e.g. https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935466639), not from the mirror. Stays FAILED until OD-8. |
| 2 | Multi-ref push creates a pipeline for the pushed SHA | release/4.x | **failed** | Same mirror run and event: no `release/4.x` push by the mirror. https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935433804 (`b03d104c3`) came from a single-ref pump push. Stays FAILED until OD-8. |
| 3 | SaaS runner tags on the group tier (`saas-linux-{small,medium,large}-amd64`, `saas-linux-medium-amd64-gpu-standard`) | next | **failed** | Group `chahal-foundation-group` plan `ultimate`. `saas-linux-medium-amd64` ran on shared runner `k8s.saas-linux-medium-amd64.runners-manager.gitlab.com/default`: https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17088613647; `saas-linux-large-amd64` on `k8s.saas-linux-large-amd64…`: https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17088613639. `saas-linux-medium-amd64-gpu-standard` never ran: https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17089502585 `failure_reason: ci_quota_exceeded`, https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17091031505 `stuck_pending_no_matching_runners`. `saas-linux-small-amd64` (only `plat:publish:npm`, tag pipelines) not exercised. The group's shared-runner minutes ran out (`ci_quota_exceeded`, 2026-10-11T03:07Z); the project now has `shared_runners_enabled: false` and runs on project runners `auraglass-azure-1`/`-2` registered 2026-10-11T03:18Z with tags `saas-linux-{small,medium,large}-amd64`, `auraglass-azure` (no GPU tag). Contract amendment draft A-2 below. |
| 4 | SaaS runner tags on the group tier (`saas-linux-{small,medium,large}-amd64`) | release/4.x | **partial** | 4x config (the `contract/batch-4x-1` head `d0eaf4505` merged into `release/4.x` by #546) on shared runners: medium https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17089174603, large https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17089174602. The `release/4.x` ref pipeline https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935433804 ran on project runner `auraglass-azure-1` (medium https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17091307036, large https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17091307034) because shared runners are disabled. `saas-linux-small-amd64` not exercised; no 4.x job uses the GPU tag. Same shared-minutes finding as row 3 (amendment A-2). |
| 5 | Playwright image used by `.ag-playwright` exists (pullable) | next | **verified** | `AG_PLAYWRIGHT_IMAGE: mcr.microsoft.com/playwright:v1.63.0-noble` (= `@playwright/test` 1.63.0). Job https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17088613639 (`plat:integration:vite`, success) log: `Using Docker executor with image mcr.microsoft.com/playwright:v1.63.0-noble`. |
| 6 | Playwright image used by `.ag-playwright` exists (pullable) | release/4.x | **verified** | `AG_PLAYWRIGHT_IMAGE: mcr.microsoft.com/playwright:v1.56.1-noble`. Job https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/17091307034 (`plat:integration:vite`, success) log: `Pulling docker image mcr.microsoft.com/playwright:v1.56.1-noble`. Note: 4.x `package.json` declares `@playwright/test: ^1.55.0`, a range, not the exact pin §4.12 asks for (FIN-C hand-off). |
| 7 | `npm publish --provenance` works under `SIGSTORE_ID_TOKEN` | next | **unverified** | `plat:publish:npm` (`id_tokens: { SIGSTORE_ID_TOKEN: { aud: "sigstore" } }`) is created only on `v*` tag pipelines; no tag pipeline exists on project 87152036 and branch pipelines such as https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935466639 do not create it. Blocked on OD-2/OD-10 and the first tag pipeline. |
| 8 | `npm publish --provenance` works under `SIGSTORE_ID_TOKEN` | release/4.x | **unverified** | Same: https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935433804 has `plat:release:verify-dist-tags` (manual) but no publish job; first `v4.*` tag pipeline records it. Blocked on OD-2/OD-10. |

## First green pipelines

First pipeline per line with GitLab status `success` (a success can still
contain `allow_failure: true` jobs that failed; activation rows in
`ci/plat/activation.json` track those separately, B3-14):

- `next`: https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935466639 (`3d354a221`, finished 2026-10-11T10:20Z, `node scripts/ci/gitlab-status.mjs --sha 3d354a2210d30072aa2b883bf3777b2da022a8d7` → `success`; `allow_failure: true` jobs such as `plat:build:docs`, `plat:test:docs`, `plat:test:canaries`, `qual:certify:l1` failed in it, and `qual:certify:l10-gpu` had no runner). The 16 earlier `next` pipelines (first one 2026-10-10T18:42Z) are 15 `failed` and 1 `canceled`.
- `release/4.x`: https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935433804 (`b03d104c3`, 2026-10-11T08:12Z, `node scripts/ci/gitlab-status.mjs --sha b03d104c3ca567f8bf2cf39c7cd3b3b3ec2c5840` → `success`). Failed with `allow_failure: true`: `plat:build:docs`, `plat:test:visual-4x` and others.
- `release/4.1.x`: https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935007635 (`d2f90a892`, 2026-10-11T02:12Z, `success`). A later re-run on the same SHA, https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/2935380373, is `canceled`, so `gitlab-status.mjs --sha` (newest pipeline only) reports `canceled` for that SHA.

These pipelines exist because of the orchestrator pump, not OD-8: AC-FIN-20
stays blocked on the owner.

## How each row was read

All read-only, existing `glab` login, no token printed:

```sh
glab api "projects/87152036/events?action=pushed&per_page=100"           # rows 1-2 (mirror bot push events, ref_count)
gh run list -R auraoneai/auraglass -w mirror-to-gitlab.yml -L 8          # rows 1-2 (mirror run)
glab api "projects/87152036/pipelines/<id>/jobs?per_page=100"             # rows 3-6 (tag_list, runner.description, runner.is_shared)
glab api "projects/87152036/jobs/<id>"                                    # rows 3-4 (failure_reason)
glab api "projects/87152036/runners" ; glab api runners/<id>              # rows 3-4 (project runners, tag_list)
glab api projects/87152036                                                # shared_runners_enabled
glab api groups/chahal-foundation-group ; glab api namespaces/chahal-foundation-group  # plan
glab api "projects/87152036/jobs/<id>/trace"                              # rows 5-6 (image line)
node scripts/ci/gitlab-status.mjs --sha <sha> --json                      # first green pipelines
```

## Contract amendment drafts (for FIN-A's `contract/v1.2-final`, FIN-463)

FIN-B does not edit the contract. These drafts are handed to FIN-A; until
OD-16 approves them, contract v1.1 text stands and these rows stay as recorded.

**A-1 — §4.13.1 "Sync" and §7.3 W-6 (fact 1 failed).** Replace the sentence
"force-pushes all refs. So tags (publishing) reach GitLab within minutes, but
pushes to `next`, `release/4.x` and stream branches reach GitLab only at the
next `main` push or the daily reconcile" with: "pushes `main` and tags and runs
`--prune`, which deletes every other GitLab branch in one multi-ref push
(observed 2026-10-11: one push event removing 334 branches). It does not push
`next`, `release/4.x` or stream branches, so no pipeline is created for them
by the mirror. Until OD-8, those refs reach GitLab only through single-ref
pushes (`scripts/release/push-gitlab-refs.mjs --apply`, owner-run, one
`git push` per ref) and each pushed SHA gets its own pipeline." W-6 row:
change "latency, not a dependency" to "blocking: without OD-8 or the
owner-run single-ref push, PR heads and line tips get no pipeline at all, so
the §2.3 merge rule cannot be met".

**A-2 — §4.13.1 "Runners" (fact 2 failed on next, partial on 4.x).** Add: "The
group's shared-runner compute minutes are finite (exhausted on 2026-10-11,
`ci_quota_exceeded`). When they are exhausted, project runners registered with
the same `saas-linux-{small,medium,large}-amd64` tags (project 87152036:
`auraglass-azure-1`, `auraglass-azure-2`) take the jobs; they are remote, so
the remote-first rule still holds. `saas-linux-medium-amd64-gpu-standard` has
no matching runner (`stuck_pending_no_matching_runners`): `qual:certify:l10-gpu`
is `when: manual`, `allow_failure: true` and reports `pending` until a GPU
runner with that tag exists (OD-11), exactly like the `auraglass-aws-remote`
lanes." Owner decision needed: buy minutes, keep the Azure project runners as
the primary pool, or register a GPU runner.

## OD-8 owner action

Owner-only (Gurbaksh). The agent prepares these steps and the fallback script;
it never performs them, never runs `--apply`, never pushes to GitLab and never
edits `.github/workflows/mirror-to-gitlab.yml`. Unblocks AC-FIN-20, AC-FIN-23,
AC-FIN-24 and every merge (PROMPT_FINAL_COMPLETION_V2 §3.0).

**Primary path — GitLab pull mirror**

1. Create a fine-grained GitHub PAT for `auraoneai/auraglass` with
   Contents: read, Metadata: read. Only the owner creates it; it is never
   copied from this Mac.
2. GitLab project 87152036 → Settings → Repository → Mirroring repositories →
   add a **pull** mirror of `https://github.com/auraoneai/auraglass.git` with
   that PAT: "Mirror only protected branches" **off**, "Trigger pipelines for
   mirror updates" **on**, "Overwrite diverged branches" **on**.
3. When the pull mirror has synced `next` and `release/4.x` and pipelines
   appear, disable the org `mirror-to-gitlab` workflow for this repo only (it
   force-pushes with `--prune`).
4. Record the date here under "First green pipelines".

Refs that must reach GitLab: `main`, `next`, `release/4.x`, `release/4.1.x`,
`next-*/**`, `4x-*/**`, `4x11-*/**`, `contract/**`, `sync/**`, tags `v*`.

**Fallback — no PAT (REQ-FIN-20 fallback, `scripts/release/push-gitlab-refs.mjs`)**

1. Remove the `--prune` step from `mirror-to-gitlab` for this repo (org
   automation; owner action). The script reads
   `origin/main:.github/workflows/mirror-to-gitlab.yml` and refuses `--apply`
   while it still contains `--prune`.
2. After each merge, from the owner Mac (owner account, not under CI):

   ```sh
   git fetch origin
   node scripts/release/push-gitlab-refs.mjs           # dry-run: review every git push line
   node scripts/release/push-gitlab-refs.mjs --apply   # pushes each matching ref by its GitHub SHA
   ```

   `--apply` refuses when `CI`/`GITLAB_CI` is set, when `$USER` is not the
   owner account, while the mirror workflow still prunes, or when
   `--gitlab-url` embeds credentials. It pushes one ref per `git push` without
   `--force`/`--prune`; a ref that diverged on GitLab is reported and left
   alone. Authentication comes only from git's credential helper (the
   existing Keychain GitLab credential); the script never reads or prints a
   token.

**Or** the owner records OD-8 Option B (merge on review, CI acceptance later)
in `docs/release/decisions/od-8.md` (FIN-H file).

Confirm: `node scripts/ci/gitlab-status.mjs --sha $(git rev-parse origin/next)`
prints a pipeline URL.

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
