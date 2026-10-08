# comp tier

`comp.*` tokens are narrow component tokens. They are added **only** by the flagship
component PRDs (PRD-07..14) through this token compiler — do not add comp tokens for
one-off components.

Rules (enforced by the tier-skip gate, `scripts/tokens/gates/tier-skip.mjs`):

- comp tokens may alias **only** `sys.*` and `material.*` — never `ref.*` (tier inversion)
  and never each other sideways into other tiers.
- comp vars are private (`--_ag-comp-*`) unless a flagship PRD promotes a readout.
