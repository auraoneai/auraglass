# schema/registry-item.json

Vendored shadcn v4 `registry-item` schema.
Source: https://ui.shadcn.com/schema/registry-item.json (draft-07)
sha256: cdf0fba75a26ebf594018264eff2d55407ec14deb3071d0fce0e2b20848e5d44

Items additionally carry `meta.auraglass` (minVersion, certified, surface,
client, components) — enforced by `src/registry/schema.ts` (zod), which is the
runtime validator. `test/commands/registry-schema.test.ts` recomputes the sha.

# schema/output/

JSON Schema (draft 2020-12) for every `auraglass <command> --json` payload.
Validated in `test/output-schema.test.ts` against real command output via
`test/helpers/json-schema.ts` (dependency-free draft subset).
