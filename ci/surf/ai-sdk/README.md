# AI SDK major compatibility evidence harness

This directory is the isolated historical SDK contract harness used by
`scripts/surf/od-evidence/ai-sdk-majors.mjs` for the OD-16 major-version comparison.
Its exact dependency pins describe the v5 baseline; the probe also measures the
explicitly pinned v6 versions. It copies this directory into a temporary sandbox
and installs each major under `.artifacts/surf/od-16/`, preserving existing source
checkout dependencies. Run this workload in remote CI.

The normal `surf:test:ai-sdk` gate uses root TypeScript and Jest configurations,
`tests/types/surf`, and the canonical adapters/routes in
`registry/items/ai-sdk-adapter` and `registry/blocks/ai-workspace`. Those migrations
are complete. The copies here support historical compatibility measurement and
are not an additional runtime entry point. The route retains the canonical
Prism transport contract and its test mocks provider access.

The probe records compiler, approval-state, and Jest evidence for each major;
measurement failures are not claims that a major is supported. Provider or SDK
migration still requires the corresponding compatibility decision.
