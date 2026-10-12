# npm trusted publishers (REQ-PLAT-15, OD-2 / OD-10)

One row per package that `contracts/packages.json` marks `published: true`.
`plat:publish:npm` (in `ci/plat.gitlab-ci.yml`, included by `.gitlab-ci.yml`)
publishes only with OIDC (`NPM_ID_TOKEN`, `--provenance`); there is no token
fallback, so a package whose row is not `configured` fails closed at
`npm publish`. Decision context: `docs/release/decisions/npm-trusted-publishing.md`;
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
change, in a PR on `next` (and the same row on `release/4.x` for packages that
publish from there).

## First publish of a name that does not exist on npm yet (owner chooses, OD-2 / OD-10)

npm can attach a trusted publisher only to an existing package. `aura-glass`
exists; `aura-glass-cli`, `aura-glass-registry`, `aura-glass-mcp` and
`aura-glass-labs` do not. OD-2 (2026-10-12) decided there is no `@auraglass`
npm org: all four ship unscoped from the npm account `veeronecorp`, the same
way `aura-glass` is published (the names in `contracts/packages.json`).

**Placeholder publish by the owner.** From `veeronecorp` (2FA), the owner
publishes a `0.0.0` placeholder of the name, configures the trusted publisher,
then deprecates the placeholder. Every later version is published only by
`plat:publish:npm`. The owner records it per package in
`docs/release/decisions/od-10.md` before the first tag that ships it.

Until that is recorded, the package's row stays `missing` and its publish
fails closed.
