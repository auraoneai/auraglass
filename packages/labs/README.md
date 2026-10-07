# @auraglass/labs

Experimental AuraGlass surfaces. **0.x — no stability guarantee.** Names, props
and even whole residents may change or disappear in any minor.

## Admission (architecture §13.4)

A resident is admitted only when all of these hold:

1. It has a capability-ledger row with `form` containing `labs`, an `area`, and
   an evidence basis (`research/competitors.md` pin or `exception:` reason).
2. `auraglass/no-simulation` reports 0 violations over `packages/labs/src/**`.
3. Imports resolve only to `react`, `react-dom`, peers, or public `aura-glass`
   entries — never `aura-glass/compat`, `aura-glass/src/**` or `aura-glass/dist/**`.
4. Importing the entry in Node is side-effect free (no module-scope
   `document`/`window`/listener calls).
5. Every rAF/timer loop pauses on `visibilitychange` and offscreen, and renders
   a static frame under reduced motion and reduced transparency.

Spatial residents additionally pass the remote mid-tier perf probe
(`tests/perf/browser/surf/labs-spatial-admission.spec.ts`, lane L10).

## Promotion (REQ-SURF-169)

A resident may move to core or `./three` in a 5.x minor after flagship
certification: the ledger row gains `export` (REQ-SURF-184 demand rules —
exportDelta > 0, a target subpath, ≥10 distinct demand links) and the contract
PR lands; the labs entry re-exports the core symbol with a one-time dev
warning for exactly one labs minor, then is removed.

## Publishing

Published by PLAT's `plat:publish:npm` tag job only (contract §4.13.7). The tag
pipeline fails when the labs admission lane is not `pass`.
