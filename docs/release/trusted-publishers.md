# npm trusted publishers (REQ-PLAT-15, OD-2/OD-10)

One row per published package. Provider = GitLab CI OIDC; namespace
`chahal-foundation-group/github-auraoneai`; project `auraglass` (project id
87152036); job file `.gitlab-ci.yml` include `ci/plat.gitlab-ci.yml`; job
`plat:publish:npm`; GitLab environment `npm-publish`.

| package | provider | namespace | project | file | environment | status | date |
|---|---|---|---|---|---|---|---|
| `aura-glass` | gitlab-ci | chahal-foundation-group/github-auraoneai | auraglass (87152036) | ci/plat.gitlab-ci.yml:plat:publish:npm | npm-publish | **missing — OD-10** | — |
| `@auraglass/cli` | gitlab-ci | chahal-foundation-group/github-auraoneai | auraglass (87152036) | ci/plat.gitlab-ci.yml:plat:publish:npm | npm-publish | **missing — OD-10** | — |
| `@auraglass/registry` | gitlab-ci | chahal-foundation-group/github-auraoneai | auraglass (87152036) | ci/plat.gitlab-ci.yml:plat:publish:npm | npm-publish | **missing — OD-10** | — |
| `@auraglass/mcp` | gitlab-ci | chahal-foundation-group/github-auraoneai | auraglass (87152036) | ci/plat.gitlab-ci.yml:plat:publish:npm | npm-publish | **missing — OD-10** | — |
| `@auraglass/labs` | gitlab-ci | chahal-foundation-group/github-auraoneai | auraglass (87152036) | ci/plat.gitlab-ci.yml:plat:publish:npm | npm-publish | **missing — OD-10** | — |

## First-publish procedure (per package)

1. npmjs.com → package settings → trusted publishing → GitLab CI:
   provider `gitlab`, namespace `chahal-foundation-group/github-auraoneai`,
   project `auraglass`, file `ci/plat.gitlab-ci.yml`, job `plat:publish:npm`,
   environment `npm-publish`.
2. Package must already exist on npm (first publish of a *new* name is manual:
   owner runs `npm publish --access public --provenance` once with an owner
   token, then configures trusted publishing, then all further publishes are
   CI-only via `require-ci-publish.js`).
3. Flip the row status to `configured` + date.
