---
id: OD-9
title: GitLab to GitHub pipeline status reporting
status: awaiting-owner
default: "`scripts/ci/gitlab-status.mjs` merge rule (no status written back to GitHub)"
blocks: [REQ-FIN-25]
decidedBy:
decidedAt:
evidence:
---

# OD-9 — GitLab → GitHub status reporting

Draft prepared by the FIN-H agent (H3-5, task FIN-470). The agent has not made
this decision and does not fill in `decidedBy`, `decidedAt` or `evidence`.

## Question

Should GitLab pipeline status be reported back to GitHub commits, so that
branch protection can require it as a status check?

## Options

1. **Report status back.** Gurbaksh issues a GitHub token and stores it in GitLab
   CI/CD variables; it is never copied from this Mac. The GitHub integration or the
   commit-status API then posts the pipeline result. Branch protection (OD-14) adds
   the pipeline status context on `main`, `next`, `release/4.x` and `release/4.1.x`.
2. **No status reporting (default).** The merge rule is checked manually with
   `node scripts/ci/gitlab-status.mjs --sha <head>` before each merge
   (PROMPT-FINAL v2 §4).

## Default (PRD-F §5.9)

`gitlab-status.mjs` merge rule.

## Blocks

REQ-FIN-25 (REQ-PLAT-10, REQ-PLAT-17): the status-context part of branch
protection in `verify-branch-protection.mjs`.

## Owner action

- For option 1: GitLab 87152036 → **Settings → Integrations → GitHub** (or a
  CI job using the commit-status API). Use a fine-grained token for
  `auraoneai/auraglass` with **Commit statuses: read and write**, stored only as a
  masked, protected GitLab variable.
- For option 2: nothing to configure.

## Related records (FIN-B, not edited here)

[`gitlab-project-settings.md`](./gitlab-project-settings.md) has the rows
"Status reporting back to GitHub" and "GitHub required-check context".

## How to record (owner only)

Set `status: decided` or `status: defaulted`, then fill in `decidedBy`,
`decidedAt` (ISO date) and `evidence` (for option 1, a GitHub commit showing the
GitLab status). Agents never edit these fields.
