---
id: OD-3
title: Base UI sign-off
status: carried
default: "Base UI adopted (contract default, W-5); alpha does not publish without the record"
blocks: [G-15]
decidedBy:
decidedAt:
evidence:
---

# OD-3 — Base UI sign-off (carried)

Draft prepared by the FIN-H agent (H3-5). The agent has not made this decision
and does not fill in `decidedBy`, `decidedAt` or `evidence`.

## Carried decision

This decision is carried over from the master PRD
(`docs/auraglass-5/AURAGLASS_5_MASTER_PRD.md` §13.1, row OD-3). The text there reads:

> **Base UI sign-off.** Product sign-off on reversing the 4.x "no third-party
> primitives" stance and pinning `@base-ui/react` exactly — Needed before
> 5.0.0-alpha — Default: Base UI adopted (contract default, W-5); alpha does not
> publish without the record — Blocks: CMP foundation pin, every flagship —
> Source: D-13; architecture §17

## Question

Do you sign off on 5.0 depending on `@base-ui/react`, pinned to an exact
version, which reverses the 4.x "no third-party primitives" stance?

## Options

1. **Confirm (default).** Base UI stays the primitive layer, as contract-v1.1 says.
2. **Reverse.** This needs a contract change through `contract/v1.2-final`
   (OD-16) and a re-plan of every CMP flagship. It is not recommended at this stage.

## Default (PRD-F §5.9)

Base UI adopted.

## Blocks

G-15 (FIN-G release-verdict item for the Base UI record). The master PRD also
lists the CMP foundation pin and every flagship.

## Owner action

Confirm the carried default.

## How to record (owner only)

Keep `status: carried` to confirm, or set `status: decided` if you reverse it.
Fill in `decidedBy`, `decidedAt` (ISO date) and `evidence`. Agents never edit
these fields.
