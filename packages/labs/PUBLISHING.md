# Publishing @auraglass/labs

CI only. `prepublishOnly` runs `scripts/ci/require-ci-publish.js`, which
refuses outside `plat:publish:npm` (GitLab project 87152036, release tag
`vX.Y.Z[-(alpha|beta|rc).N]`, OIDC `id_tokens`). No npm access-token env vars
are stored in this repo; publishing uses OIDC provenance.

## Never

- No npm access-token env vars (`NPM_*` / `NODE_AUTH_*`) in any file.
- Never publish from a laptop — the guard exits 1.
