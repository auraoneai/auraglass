---
id: OD-6
title: Button API break
status: carried
default: "As written in the contract (`ButtonContract`)"
blocks: []
decidedBy:
decidedAt:
evidence:
---

# OD-6 — Button API break (carried)

Draft prepared by the FIN-H agent (H3-5). The agent has not made this decision
and does not fill in `decidedBy`, `decidedAt` or `evidence`.

## Carried decision

This decision is carried over from the master PRD
(`docs/auraglass-5/AURAGLASS_5_MASTER_PRD.md` §13.1, row OD-6). The text there reads:

> **Button API break.** 4.x `primary/secondary/ghost/danger` → `prominent` /
> `variant="regular"` / `variant="identity"` / `intent="danger"` (contract
> `ButtonContract`) — Needed before CMP lane A ships Button — Default: As written
> in the contract — Blocks: CMP, compat adapters, QUAL sentinel, Storybook
> matrices — Source: PLAT OI-6

## Question

Do you confirm the 5.0 Button API break as contract-v1.1 defines it in `ButtonContract`?

## Options

1. **Confirm (default).** The 4.x variants map to `prominent` /
   `variant="regular"` / `variant="identity"` / `intent="danger"`. 4.x callers
   are covered by the compat adapter and the codemod.
2. **Change.** This needs a contract change through `contract/v1.2-final`
   (OD-16) and touches CMP, the compat adapters, the QUAL sentinel and the
   Storybook matrices.

## Default (PRD-F §5.9)

As contract.

## Blocks

Nothing directly (PRD-F §5.9 lists "—").

## Owner action

Confirm the carried default.

## How to record (owner only)

Keep `status: carried` to confirm, or set `status: decided` if you change it.
Fill in `decidedBy`, `decidedAt` (ISO date) and `evidence`. Agents never edit
these fields.
