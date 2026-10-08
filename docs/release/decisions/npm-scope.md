# D-23 — npm scope for AuraGlass packages (decision record)

**Status:** pending owner verification (operator action), decision recorded for 4.2.

## Preferred

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
