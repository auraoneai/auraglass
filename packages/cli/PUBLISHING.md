# Publishing `aura-glass-cli`

REQ-PLAT-15/62/84. This package publishes as `aura-glass-cli` (name from
`src/meta.ts` `PACKAGE_NAME`; D-23 fallback `aura-glass-cli`, see
`docs/release/decisions/npm-scope.md`).

## Trusted publishing (OD-10)

- Provider: GitLab CI/CD; namespace `chahal-foundation-group/github-auraoneai`;
  project `auraglass`; pipeline file `.gitlab-ci.yml`; environment `npm-publish`.
- Status: **pending owner configuration** (row `aura-glass-cli` in
  `docs/release/trusted-publishers.md`, owner-filled status and date) — the
  owner registers the npm trusted publisher for this package. Until configured, the publish step **fails
  closed** (no token fallback; `prepublishOnly` runs
  `scripts/ci/require-ci-publish.js`, which refuses non-CI publishes).
- Operator action required: configure the npm trusted publisher entry for
  `aura-glass-cli` before `v5.0.0-rc.1`. For the 4.x line the same entry covers
  `aura-glass-cli@0.x` from `release/4.x`.

## First publish (name does not exist on npm yet)

OD-2 (2026-10-12): no `@auraglass` npm org; this package publishes unscoped as
`aura-glass-cli` from the npm account `veeronecorp`, like `aura-glass`. Never
publish a second (scoped) name.

## Pipeline contract

- `npm publish --dry-run` runs in the tag pipeline (W-7) as the pre-publish gate.
- Publish fires only on GitLab tag pipelines (`v5.*` on `next`, `v4.3.*` on
  `release/4.x`) with provenance (`--provenance`).
- Unpacked install size ≤15 MB; verify with `npm pack --dry-run`.

## Never

- No npm access-token env vars (`NPM_*` / `NODE_AUTH_*`) in any file.
- Never register an `aura-glass` bin name.
