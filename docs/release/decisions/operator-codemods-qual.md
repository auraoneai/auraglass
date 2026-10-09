# Decision: QUAL declares no codemods (`fragments/codemods/qual.ts` stays `{}`)

**Status:** recorded (REQ-PLAT-62 / REQ-FIN-36)
**Date:** 2026-10-09

## Context

The `v4.3.0` tag gate requires non-empty `fragments/codemods/{mat,cmp,surf}.ts`
on `release/4.x` — those rows arrive through the `next → release/4.x` codemods
sync (REQ-FIN-13) from MAT (REQ-FIN-57), CMP (REQ-FIN-76), and SURF (REQ-FIN-80)
authored on `next`.

`fragments/codemods/qual.ts` is explicitly NOT part of that requirement.

## Decision

QUAL (the quality/certification lane) declares **no codemods** — its job is
evidence, certification and gates, not source transformation. `qual.ts`
intentionally stays `export default {} satisfies CodemodMappingFragment`.

## Consequences

- Any tag gate or coverage script must assert non-empty only for
  `mat.ts`, `cmp.ts`, `surf.ts` — `qual.ts` is exempt by design.
- If QUAL ever needs a codemod row, it lands via the same REQ-FIN-13 sync
  contract, not by editing `qual.ts` on this line out of band.
