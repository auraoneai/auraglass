# Branch policy — AuraGlass 5.0

Source of truth: GitHub `auraoneai/auraglass`. GitLab project `87152036`
(`chahal-foundation-group/github-auraoneai/auraglass`) is the **one-way mirror**
that runs CI; it never sees a merge request.

## Merge rule

A PR merges on GitHub only after the GitLab pipeline for its **head SHA**
finishes `success` (every job that is not `allow_failure: true` passed). Check it
with `node scripts/ci/gitlab-status.mjs --sha <head>` and paste the pipeline URL
in the PR (the template has a required field). The pipeline may lag up to ~a
day: branch pushes reach GitLab only on a `main` push or the daily 05:23 UTC
full reconcile (contract W-6).

## Branch prefixes

| Prefix | Line | Pipeline scope |
|---|---|---|
| `next-<stream>/*` | next (5x) | `pr` / `AG_LINE=5x` |
| `4x-<stream>/*` | release/4.x | `pr` / `AG_LINE=4x` |
| `contract/*` | next | `pr` |
| `sync/fragments-<kind>-*` | per kind | `pr` (bot sync, §2.3) |

Any other branch name gets no pipeline (root `workflow.rules` ends in `when: never`).

## Forward-port rule (PLAT-030)

- **4.x → 5x:** fixes ship first on `release/4.x`; content syncs to `next` only
  through `node scripts/release/sync-fragments.mjs --to next` (deprecations +
  the regenerated `src/internal/deprecations.generated.ts`) or a manual cherry-pick.
- **never merge `next` into `release/4.x`** and never cherry-pick `next`
  into `release/4.x`. The 4.x line receives 5.x work only via
  `sync-fragments.mjs --to release/4.x` (codemods). `tests/ci/no-forward-merge.test.ts`
  asserts this.
- Line-neutral lane files (this lane's CI/scripts/tests/docs) land on **both**
  lines as the same commits — not as merges.

## GitHub branch protection payloads (operator, gh api)

Once OD-8/OD-9 are decided, apply with `gh api` (POST/PUT as shown; these are
the same for all three branches unless noted):

```sh
gh api -X PUT repos/auraoneai/auraglass/branches/main/protection --input - <<'JSON'
{ "required_status_checks": { "strict": true, "contexts": [] },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true, "require_code_owner_reviews": true,
    "required_approving_review_count": 1 },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false, "allow_deletions": false }
JSON
```

Repeat with `branches/next/protection` and `branches/release%2F4.x/protection`.
When OD-9 lands (GitLab→GitHub status reporting), add the single pipeline
status context to `required_status_checks.contexts` on `next` and `release/4.x`
so the manual `gitlab-status.mjs` step disappears.

## Waits and owner decisions

- **W-6:** branch pushes reach GitLab only on a `main` push or the daily
  reconcile — expect pipeline lag for lane branches.
- **W-7:** the first release-scope `npm publish --dry-run` on `release/4.x`
  awaits the trusted-publishing decision (OD-10).
- **OD-8:** enable GitHub status reporting from GitLab (or keep the manual
  `gitlab-status` merge gate) — recorded in
  `docs/release/decisions/gitlab-project-settings.md`.
- **OD-9:** require the GitLab pipeline status context in GitHub branch
  protection — recorded in the same file.
