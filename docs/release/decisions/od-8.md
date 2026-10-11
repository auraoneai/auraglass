---
id: OD-8
title: GitLab pull mirroring of all refs (pipelines for every ref)
status: awaiting-owner
default: "Owner-run `node scripts/release/push-gitlab-refs.mjs --apply` after removing `--prune` from the push workflow (REQ-FIN-20 fallback)"
blocks: [REQ-FIN-20, REQ-PLAT-06, "every needs=ci ledger row"]
decidedBy:
decidedAt:
evidence:
---

# OD-8 — Pipelines for every ref (GitLab pull mirror)

Draft prepared by the FIN-H agent (H3-5, task FIN-469). The agent has not made
this decision and does not fill in `decidedBy`, `decidedAt` or `evidence`. Agents
never change the org mirror, never push to the GitLab mirror and never edit or
re-enable `.github/workflows/mirror-to-gitlab.yml`.

## Question

GitLab project 87152036
(`gitlab.com/chahal-foundation-group/github-auraoneai/auraglass`) receives only
`main` from the org-managed `mirror-to-gitlab` workflow, which force-pushes with
`--prune`. That is why `next`, `release/4.x`, `release/4.1.x` and the PR branches
have never had an organic pipeline. How should every required ref reach GitLab
with pipelines?

## Options

- **A. GitLab pull mirror (recommended).** Use the exact steps below.
- **B. Fallback / default (REQ-FIN-20).** Remove the `--prune` step from
  `mirror-to-gitlab` for this repo. After each merge, the owner (never an agent)
  runs `node scripts/release/push-gitlab-refs.mjs` (dry run, review the output),
  then `node scripts/release/push-gitlab-refs.mjs --apply`, from the owner Mac with
  the existing Keychain GitLab credential. That script is FIN-B task B3-3
  (`next-fin/b-push-gitlab-refs`). It is dry-run by default, refuses to run under
  CI or when `$USER` is not the owner, and is not on `next` at the time of this draft.
- **C. Merge on review, CI acceptance later (PROMPT-FINAL v2 §3.0).** PRs merge one
  at a time in the §3 slot order. Every affected ledger row stays
  `code-merged-awaiting-ci`, never `done`, until pipelines exist.

## Option A owner steps (PRD-F §5.2 REQ-FIN-20, verbatim)

1. Create a read-only GitHub fine-grained PAT for `auraoneai/auraglass` with
   **Contents: read** and **Metadata: read**. Only Gurbaksh can create it, and it
   is never copied from this Mac's credentials.
2. In GitLab project 87152036 → **Settings → Repository → Mirroring
   repositories**, add a **pull** mirror from
   `https://github.com/auraoneai/auraglass.git` with that PAT, and set:
   - "Mirror only protected branches": **off**
   - "Trigger pipelines for mirror updates": **on**
   - "Overwrite diverged branches": **on**

   The group is Ultimate tier, so pull mirroring is available.
3. The existing `mirror-to-gitlab` workflow force-pushes with `--prune`, so once
   the pull mirror is green, **disable that workflow for this repo only**.
   Otherwise each push-sync deletes the pulled branches.

Refs that must reach GitLab:

- `main`
- `next`
- `release/4.x`
- `release/4.1.x` (OD-13)
- `next-*/**`
- `4x-*/**`
- `4x11-*/**`
- `contract/**`
- `sync/**`
- tags `v*`

`4x11-*/**` is listed in PROMPT-FINAL v2 §13 item 1. It is the OD-13 PR prefix.

## Confirmation

Pipelines exist when these commands print a pipeline URL for each line:

```sh
node scripts/ci/gitlab-status.mjs --sha "$(git rev-parse origin/next)"
node scripts/ci/gitlab-status.mjs --sha "$(git rev-parse origin/release/4.x)"
node scripts/ci/gitlab-status.mjs --sha "$(git rev-parse origin/release/4.1.x)"
```

## Default (PRD-F §5.9)

Owner-run `push-gitlab-refs.mjs --apply` after removing `--prune` from the push
workflow (REQ-FIN-20 fallback).

## Blocks

Everything with needs=ci. That means every merge (PROMPT-FINAL v2 §3.0), every
AC-FIN, REQ-FIN-20 / AC-FIN-20 (REQ-PLAT-06), and AC-FIN-23 and AC-FIN-24.

## Related records (FIN-B, not edited here)

- [`gitlab-ci-verification.md`](./gitlab-ci-verification.md): the multi-ref
  push fact, which stays `failed` until this is applied. Record the applied
  option and its date there as well.
- [`gitlab-project-settings.md`](./gitlab-project-settings.md): OD-11 settings.

## How to record (owner only)

Set `status: decided` and name the option (A, B or C) in `evidence`, or set
`status: defaulted` (option B). Fill in `decidedBy`, `decidedAt` (ISO date) and
`evidence`: the first pipeline URL on `next` and `release/4.x`, plus, for A, the
date the `mirror-to-gitlab` workflow was disabled for this repo. Agents never
edit these fields.
