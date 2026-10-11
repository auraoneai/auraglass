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
| `@auraglass/cli` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |
| `@auraglass/registry` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |
| `@auraglass/mcp` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |
| `@auraglass/labs` | GitLab CI/CD | `chahal-foundation-group/github-auraoneai` | `auraglass` | `.gitlab-ci.yml` | `npm-publish` | missing | — |

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
exists; `@auraglass/cli`, `@auraglass/registry`, `@auraglass/mcp` and
`@auraglass/labs` do not. The owner records one of these choices per package
in `docs/release/decisions/od-10.md` before the first tag that ships it:

1. **Placeholder publish by the owner.** The owner creates the `@auraglass`
   npm org (OD-2), publishes a `0.0.0` placeholder of the name from an owner
   account with 2FA, configures the trusted publisher, then deprecates the
   placeholder. Every later version is published only by `plat:publish:npm`.
2. **Unscoped fallback.** If the `@auraglass` scope cannot be secured, the
   package ships under its `fallback` name from `contracts/packages.json`
   (`aura-glass-cli`, `aura-glass-registry`, `aura-glass-mcp`,
   `aura-glass-labs`), with the same placeholder step for that name. Never
   publish both names.

Until a choice is recorded, the package's row stays `missing` and its publish
fails closed.
