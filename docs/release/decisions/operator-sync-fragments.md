---
id: OP-4
title: sync-fragments in both directions, daily while any stream has unsynced rows
req: REQ-FIN-113
relatedReqs: [REQ-FIN-13, REQ-PLAT-08]
status: awaiting-operator
performedBy:
performedAt:
evidence:
---

# OP-4: `sync-fragments` both directions, daily while rows are unsynced

The FIN-H agent drafted this runbook (H3-6) and has run none of it. This is a recurring action.
For each run the operator adds a row to the run log at the bottom. When no stream has unsynced
rows left, the operator fills in the front matter and sets `status: done`.

Directions are fixed by the script:
- `--to next`: `fragments/deprecations/**` from `release/4.x` to `next`. The branch is
  `sync/fragments-deprecations-<yyyymmdd>`.
- `--to release/4.x`: `fragments/codemods/**` from `next` to `release/4.x`. The branch is
  `sync/fragments-codemods-<yyyymmdd>`.

## Prerequisites

- PR #125 (`next-fin/a-fragsync`, FIN-A REQ-FIN-13) has merged on `next`, and its 4.x port
  `4x-fin/a-fragsync` has merged on `release/4.x`. Those add `gen-deprecations.mjs`
  regeneration, deletion propagation and the `--allow-delete <id,…>` guard. The current script
  writes the barrel inline and has no delete guard. Do not run OP-4 before #125.
- Run it on the operator Mac, never in CI. The script exits 2 under `CI=true` or `GITLAB_CI=true`.
- `gh` is already logged in with push and PR rights on `auraoneai/auraglass`. Use the existing
  login only (no login or refresh). The script checks out branches in the current checkout, so
  use a dedicated worktree:
  ```sh
  git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin
  git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add /Users/gurbakshchahal/platforms/AuraGlass.wt/op4-sync --detach origin/next
  cd /Users/gurbakshchahal/platforms/AuraGlass.wt/op4-sync
  ```

## Commands (once per working day)

```sh
git fetch origin
node scripts/release/sync-fragments.mjs --to next
node scripts/release/sync-fragments.mjs --to release/4.x
```

If the deletion guard refuses (exit 1, listing ids present only on the target), do **not** add
`--allow-delete` on your own. Those ids are next-only DEP-C rows that CMP has not yet authored on
`release/4.x` (REQ-FIN-76). Record the refusal and the ids, and tell FIN-E.

Then, for each opened `sync/*` PR: wait for its GitLab pipeline
(`node scripts/ci/gitlab-status.mjs --sha <head>`), and merge it on green in its §3 slot. After a
deprecations sync merges, run `npm run gen:deprecations` on the next PR in the DEP queue.

Done check: no stream has unsynced rows.

```sh
git fetch origin
git diff --stat origin/release/4.x origin/next -- fragments/deprecations/
git diff --stat origin/next origin/release/4.x -- fragments/codemods/
```

Both must be empty, apart from ids the guard deliberately keeps target-only (list them).

## Expected output

- First run of the day, per direction: `sync-fragments: opened https://github.com/auraoneai/auraglass/pull/<n>`,
  or `sync-fragments: no changes — fragments/<kind>/ already in sync`.
- Second run on the same day: `sync-fragments: sync/fragments-<kind>-<yyyymmdd> already exists — once per working day, skipping`.

## Evidence to paste (operator)

| Date | Direction | Output line | PR URL | Pipeline URL | Merged (date) |
|---|---|---|---|---|---|
| | `--to next` | | | | |
| | `--to release/4.x` | | | | |

Final done check output (both diffs empty), with date:
