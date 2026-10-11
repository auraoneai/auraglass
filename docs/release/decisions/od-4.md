---
id: OD-4
title: No git history rewrite
status: carried
default: "History is not rewritten (D-32)"
blocks: []
decidedBy:
decidedAt:
evidence:
---

# OD-4 — No history rewrite (carried)

Draft prepared by the FIN-H agent (H3-5). The agent has not made this decision
and does not fill in `decidedBy`, `decidedAt` or `evidence`.

## Carried decision

This decision is carried over from the master PRD
(`docs/auraglass-5/AURAGLASS_5_MASTER_PRD.md` §13.1, row OD-4). The text there reads:

> **History rewrite.** Confirm that git history is **not** rewritten. `reports/`
> (47,342 files, 2.95 GB tree) leaves the tree in 4.1.1 but stays in history;
> clone size relies on shallow clones — Needed by 4.1.1 — Default: No rewrite
> (D-32) — Blocks: PLAT hygiene — Source: D-32

## Question

Do you confirm that git history on `auraoneai/auraglass` is never rewritten
(no filter-repo, no force-push of shared branches)?

## Options

1. **Confirm (default).** No rewrite. `reports/` leaves the tree but stays in
   history. PRs that must drop commits are re-cut as `-v2`/`-r1` branches,
   never force-pushed (PROMPT-FINAL v2 §3.0).
2. **Rewrite.** This is not recommended. It would invalidate every open PR head,
   every mirror and every recorded SHA.

## Default (PRD-F §5.9)

Not rewritten.

## Blocks

Nothing directly (PRD-F §5.9 lists "—"). The merge plan's no-force-push rule
depends on it.

## Owner action

Confirm the carried default.

## How to record (owner only)

Keep `status: carried` to confirm. Fill in `decidedBy`, `decidedAt` (ISO date)
and `evidence`. Agents never edit these fields.
