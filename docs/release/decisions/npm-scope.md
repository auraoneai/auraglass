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
