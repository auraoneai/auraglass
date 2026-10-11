---
id: OD-7
title: 4.1.1 scope split
status: carried
default: "As written in PLAT §5 (3 items accepted into 4.1.1, 5 deferred to 4.2)"
blocks: [REQ-FIN-35]
decidedBy:
decidedAt:
evidence:
---

# OD-7 — 4.1.1 scope split (carried)

Draft prepared by the FIN-H agent (H3-5, task FIN-468). The agent has not made
this decision and does not fill in `decidedBy`, `decidedAt` or `evidence`.

## Carried decision

This decision is carried over from the master PRD
(`docs/auraglass-5/AURAGLASS_5_MASTER_PRD.md` §13.1, row OD-7). The text there reads:

> **4.1.1 scope split** (3 items accepted into 4.1.1, 5 deferred to 4.2) —
> Needed by 4.1.1 — Default: As written in PLAT §5 — Blocks: PLAT 1b-4X —
> Source: PLAT OI-6

## Question

Do you confirm the 4.1.1 scope split exactly as the Platform & Release PRD
§5 defines it (`docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md`)?

## Options

1. **Confirm (default).** 3 items ship in 4.1.1 and 5 are deferred to 4.2.
2. **Change.** Name the items that move. FIN-C then re-slots them between
   `release/4.1.x` and `release/4.x` (see OD-13).

## Default (PRD-F §5.9)

As PLAT §5.

## Blocks

REQ-FIN-35 (4.1.1 content on `release/4.1.x`). FIN-468 also lists REQ-PLAT-40..55.

## Owner action

Confirm the carried default.

## How to record (owner only)

Keep `status: carried` to confirm, or set `status: decided` if you change it.
Fill in `decidedBy`, `decidedAt` (ISO date) and `evidence`. Agents never edit
these fields.
