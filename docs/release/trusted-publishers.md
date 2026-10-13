# npm trusted publishers (REQ-PLAT-15, OD-2 / OD-10)

One row per package that `contracts/packages.json` marks `published: true`.
`plat:publish:npm` (in `ci/plat.gitlab-ci.yml`, included by `.gitlab-ci.yml`)
publishes only with OIDC (`NPM_ID_TOKEN`, `--provenance`); there is no token
fallback, so a package whose row is not `configured` fails closed at
`npm publish` in CI. Until the rows are configured, shipped releases publish via operator tarballs instead (5.0.0 GA + 5.0.1, 2026-10-13: `aura-glass@5.0.1`, `aura-glass-registry@5.0.0`, `aura-glass-cli@0.1.0`, `aura-glass-mcp@0.1.0`, `aura-glass-labs@0.1.0`). Decision context: `docs/release/decisions/npm-trusted-publishing.md`;
scope and fallback names: `docs/release/decisions/npm-scope.md`.

The `status` and `date` cells are owner-filled: the owner configures the
publisher on npmjs.com and then sets `status` to `configured` with the date.
The agent never changes them.

| package | provider | namespace | project | file | environment | status | date |
|---|---|---|---|---|---|---|---|
| `aura-glass` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |
| `aura-glass-cli` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |
| `aura-glass-registry` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |
| `aura-glass-mcp` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |
| `aura-glass-labs` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |

GitLab project id: `87152036`. Job: `plat:publish:npm`. npm checks the
top-level pipeline file (`.gitlab-ci.yml`), not the included fragment.

## Configuring a publisher (owner, npmjs.com)

For each row: npmjs.com → the package → Settings → Trusted publishing →
GitLab CI/CD, with namespace, project, file and environment exactly as in the
row. Then set the row's `status` to `configured` and `date` to the day of the
change, in a PR on `main` (and the same row on `release/4.x` for packages that
publish from there).

## First publish of a name that does not exist on npm yet

Done for the 5.0 names (OD-2 / OD-10):

npm can attach a trusted publisher only to an existing package. All five names now exist on npm (first published 2026-10-13): `aura-glass`, `aura-glass-cli`, `aura-glass-registry`, `aura-glass-mcp` and
`aura-glass-labs`. OD-2 (2026-10-12) decided there is no `@auraglass`
npm org: all ship unscoped from the npm account `veeronecorp`, the same
way `aura-glass` is published (the names in `contracts/packages.json`).

For any future new name, the owner first-publishes the name from `veeronecorp` (2FA), then configures the trusted publisher as above and records it per package in
`docs/release/decisions/od-10.md`.

Until a package's row is `configured`, its CI publish fails closed and releases go out via operator tarballs.
