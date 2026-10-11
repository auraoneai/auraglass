# Rejected novelty — what 5.0 deliberately does not ship

The capability ledger's `rejected` rows are the recorded "no"s: features
evaluated against the six-rubric gates and turned down on evidence (see
`docs/auraglass-5/capability-ledger.json`, rows `release: "never"`).

## Why a rejection list at all

In 4.x, spec drift happened because "no" was never recorded — the same
ideas re-surfaced, re-costed, and sometimes shipped half-baked. The ledger
pins each rejected idea to its finding ids and rubric scores so the
decision is auditable and reversible only by re-scoring with new evidence.

## Highlights

- **Holographic / volumetric UI** (`GlassHologram` family) — failed the
  reduced-motion/transparency rubric and the mobile-overlap rubric; no
  demand links cleared the bar.
- **Audio-reactive surfaces** — same rubric class; the idle discipline
  (no wake loops when hidden) is unfixable for continuous audio analysis.
- **Spatial cursor multiplayer extras** — presence is a 5.1 registry item
  (`presence-stack`); the full co-cursor suite stays rejected.
- **In-viewport video auto-play decorators** — rejected on
  reduced-motion alone; autoplay is a source-model flag, not a wrapper.

A rejected row only leaves `release: "never"` when new evidence lands —
the ledger gate re-scores rubric and demand together; removing a name
from the rejected set without evidence fails CI.
