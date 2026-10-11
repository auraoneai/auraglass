# Publishing @auraglass/mcp

CI only. `prepublishOnly` runs `scripts/ci/require-ci-publish.js`, which
refuses outside `plat:publish:npm` (GitLab project 87152036, release tag
`vX.Y.Z[-(alpha|beta|rc).N]`, OIDC `id_tokens`). No npm access-token env vars
are stored in this repo; publishing uses OIDC provenance.

## Trusted publishing (OD-10)

- Provider GitLab CI/CD; namespace `chahal-foundation-group/github-auraoneai`;
  project `auraglass`; file `.gitlab-ci.yml`; environment `npm-publish`.
- Status and date: the `@auraglass/mcp` row of
  `docs/release/trusted-publishers.md` (owner-filled). Until it is
  `configured` the publish fails closed.
- First publish: the name does not exist on npm yet; the owner's choice in
  `docs/release/trusted-publishers.md` applies (D-23 fallback `aura-glass-mcp`,
  `docs/release/decisions/npm-scope.md`).

## Pipeline contract

- `plat:package:pack` packs this package (`scripts/release/pack.mjs`) and
  records its sha512 in `.artifacts/plat/pack-record.json`.
- `plat:publish:npm` publishes the recorded tarball with `--provenance`; the
  dist-tag comes from `scripts/release/dist-tag.mjs`.

## Never

- No npm access-token env vars (`NPM_*` / `NODE_AUTH_*`) in any file.
- Never publish from a laptop — the guard exits 1.
