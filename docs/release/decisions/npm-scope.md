# npm scope — decision record (D-23, PLAT-046)

## Published names (frozen in `contracts/packages.json`)

Owner decision OD-2 (2026-10-12, [od-2.md](./od-2.md)): no `@auraglass` npm
org. Every package publishes unscoped from the npm account `veeronecorp`, the
same way `aura-glass` has always been published. The D-23 fallback names are
the published names.

| Package | Publishes | Former scoped name (not used) |
|---|---|---|
| `aura-glass` | yes | — |
| `aura-glass-cli` | yes | `@auraglass/cli` |
| `aura-glass-registry` | yes | `@auraglass/registry` |
| `aura-glass-mcp` | yes | `@auraglass/mcp` |
| `aura-glass-labs` | yes (labs admission) | `@auraglass/labs` |
| `aura-glass-qa` | no (private) | `@auraglass/qa` |

## Status

| Row | Status |
|---|---|
| Fallback names recorded | applied (contracts/packages.json keys = unscoped names, fallback = same name) |
| `@auraglass` org + membership | not created — OD-2 chose the unscoped names |
| Name availability | `npm view` → E404 for `aura-glass-cli`, `aura-glass-registry`, `aura-glass-mcp`, `aura-glass-labs` (2026-10-12) |
| Provenance URLs point at `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` `.gitlab-ci.yml` | applied (§4.13.7) |

Names come from `contracts/packages.json`; the pack/publish scripts never
hard-code them. One name per package, never both published.

## Verification step (operator action)

PLAT has no npm credentials on this runner. Until each package's trusted
publisher is configured (OD-10), packages stay unpublished and every publish
path fails closed (`scripts/ci/require-ci-publish.js`).

## Where consumed

`packages/cli/src/meta.ts` `PACKAGE_NAME`; `packages/*/package.json` `name`;
`publishing.md` files; `docs/release/trusted-publishers.md` rows.
