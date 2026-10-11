---
id: OD-1
title: Aeonik font licence
status: carried
default: "Fonts removed from the tarball (done in 4.1.1 scope); if licensed later, return as opt-in `aura-glass/fonts.css`"
blocks: [REQ-PLAT-54]
decidedBy:
decidedAt:
evidence:
---

# OD-1 — Aeonik font licence (carried)

Draft prepared by the FIN-H agent (H3-5, task FIN-465). The agent has not made
this decision and does not fill in `decidedBy`, `decidedAt` or `evidence`.

## Carried decision

This decision is carried over from the master PRD
(`docs/auraglass-5/AURAGLASS_5_MASTER_PRD.md` §13.1, row OD-1). The text there reads:

> **Aeonik font licence.** Is there a written licence to redistribute Aeonik in an
> MIT tarball? — Needed by 2026-10-12 — Default: Remove the fonts from the tarball;
> if licensed later, return as opt-in `aura-glass/fonts.css` — Blocks: 4.1.1 font
> task (PLAT 1b-4X) — Source: D-31

## Question

Is there a written licence to redistribute the Aeonik font files inside the
MIT-licensed `aura-glass` npm tarball?

## Options

1. **No licence (default).** The fonts stay out of the tarball, as the 4.1.1
   scope already does. The system font stack is the fallback.
2. **Licence exists.** Attach the licence. The fonts come back only as an
   opt-in `aura-glass/fonts.css` entry in a later minor, never in the default
   CSS.

## Default (PRD-F §5.9)

Fonts removed (done in 4.1.1 scope).

## Blocks

REQ-PLAT-54 (4.1.1 font removal and its visual-fix record).

## Owner action

Confirm the carried default, or attach the written licence and choose option 2.

## How to record (owner only)

Keep `status: carried` to confirm the carried decision. Set `status: decided` if
you choose a different outcome. In both cases fill in `decidedBy`,
`decidedAt` (ISO date) and `evidence` (a licence document link, or "no licence"
with a note). Agents never edit these fields.
