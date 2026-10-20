# Publishing aura-glass-mcp

CI only. `prepublishOnly` runs `scripts/ci/require-ci-publish.js`, which
refuses outside `plat:publish:npm` (GitLab project 87152036, release tag
`vX.Y.Z[-(alpha|beta|rc).N]`, OIDC `id_tokens`). No npm access-token env vars
are stored in this repo; publishing uses OIDC provenance.

## Trusted publishing (OD-10)

- Provider GitLab CI/CD; namespace `chahal-foundation-group/github-auraoneai`;
  project `auraglass`; file `.gitlab-ci.yml`; environment `npm-publish`.
- Status and date: the `aura-glass-mcp` row of
  `docs/release/trusted-publishers.md` (owner-filled) still reads
  `missing`. Until it is `configured` the CI publish fails closed.
  `aura-glass-mcp@0.1.0` shipped on npm on 2026-10-13 alongside AuraGlass
  5.0; do not read that as the CI trusted-publishing path being live.
- First publish: done (`0.1.0`, 2026-10-13); the name exists on npm,
  unscoped as `aura-glass-mcp` from `veeronecorp` (OD-2,
  `docs/release/decisions/npm-scope.md`) — never publish a second name.

## Pipeline contract

- `plat:package:pack` packs this package (`scripts/release/pack.mjs`) and
  records its sha512 in `.artifacts/plat/pack-record.json`.
- `plat:publish:npm` publishes the recorded tarball with `--provenance`; the
  dist-tag comes from `scripts/release/dist-tag.mjs`.

## Never

- No npm access-token env vars (`NPM_*` / `NODE_AUTH_*`) in any file.
- Never publish from a laptop — the guard exits 1.
