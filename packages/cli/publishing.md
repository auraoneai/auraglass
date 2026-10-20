# Publishing `aura-glass-cli`

REQ-PLAT-15/62/84. This package publishes as `aura-glass-cli` (name from
`src/meta.ts` `PACKAGE_NAME`; D-23 fallback `aura-glass-cli`, see
`docs/release/decisions/npm-scope.md`).

## Trusted publishing (OD-10)

- Provider: GitLab CI/CD; namespace `chahal-foundation-group/github-auraoneai`;
  project `auraglass`; pipeline file `.gitlab-ci.yml`; environment `npm-publish`.
- Status: the `aura-glass-cli` row in `docs/release/trusted-publishers.md`
  (owner-filled status and date) still reads `missing`, so the CI publish
  step still **fails closed** (no token fallback; `prepublishOnly` runs
  `scripts/ci/require-ci-publish.js`, which refuses non-CI publishes).
  `aura-glass-cli@0.1.0` shipped on npm on 2026-10-13 alongside AuraGlass
  5.0; do not read that as the CI trusted-publishing path being live.
- Operator action required: configure the npm trusted publisher entry for
  `aura-glass-cli` before the next CI publish. For the 4.x line the same
  entry covers `aura-glass-cli@0.x` from `release/4.x`.

## First publish (done: `0.1.0`, 2026-10-13)

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
