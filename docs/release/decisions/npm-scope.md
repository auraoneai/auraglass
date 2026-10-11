# npm scope — decision record (D-23, PLAT-046)

## Published names (frozen in `contracts/packages.json`)

| Package | Publishes | Fallback name if taken |
|---|---|---|
| `aura-glass` | yes | — |
| `@auraglass/cli` | yes | `aura-glass-cli` |
| `@auraglass/registry` | yes | `aura-glass-registry` |
| `@auraglass/mcp` | yes | `aura-glass-mcp` |
| `@auraglass/labs` | yes (labs admission) | — |
| `@auraglass/qa` | no (private) | — |

## Decision wanted (owner)

Create the **`@auraglass` npm org** and add the publishing machine account to it.
If the scope is squatted, adopt the fallback names above (the pack/publish
scripts read names from `contracts/packages.json`, never hard-coded).

## Status

| Row | Status |
|---|---|
| Fallback names recorded | applied (contracts/packages.json) |
| `@auraglass` org + membership | missing — owner action on npmjs.com |
| Provenance URLs point at `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` `.gitlab-ci.yml` | applied (§4.13.7) |

---

## CLI-side details (1e, #96)

`@auraglass/*` scope for the CLI/registry/MCP support packages:

| Package | Preferred name | D-23 fallback |
|---|---|---|
| CLI (this repo, `packages/cli`) | `@auraglass/cli` | `aura-glass-cli` |
| Registry | `@auraglass/registry` | `aura-glass-registry` |
| MCP | `@auraglass/mcp` | `aura-glass-mcp` |

Names come from `contracts/packages.json` (which lists both spellings). The
fallback applies only if `@auraglass` scope ownership cannot be verified before
the 4.2 line — one name per package, never both published.

## Verification step (operator action)

`npm view @auraglass/cli` / scope membership check owned by Gurbaksh; PLAT has
no npm credentials on this runner (gh/glab unauthenticated). Until verified,
packages stay unpublished and every publish path fails closed
(`scripts/ci/require-ci-publish.js`).

## Where consumed

`packages/cli/src/meta.ts` `PACKAGE_NAME`; `packages/*/package.json` `name`;
`PUBLISHING.md` files. Fallback flip = rename in `meta.ts` + `package.json` +
registry-item schema references, in one PR.
