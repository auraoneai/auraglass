# npm trusted publishing — decision record (OD-10, PLAT-044/045)

## Decision wanted

Configure npm **trusted publishing** (OIDC) for `aura-glass` and `@auraglass/*`
so `plat:publish:npm` publishes with `npm publish --provenance` and **no**
npm access-token environment variable (`NPM_*` / `NODE_AUTH_*`) anywhere.

## Operator action (npmjs.com, owner)

npm → each package → Settings → Trusted Publisher → **GitLab CI/CD**:

- project id: `87152036` (namespace `chahal-foundation-group/github-auraoneai`,
  project `auraglass`)
- file: `.gitlab-ci.yml`
- job name: `plat:publish:npm`
- environment: `npm-publish` (must match the job's `environment:`)

Per-package status (5 packages), dates and the first-publish procedure for
names that do not exist on npm yet: `docs/release/trusted-publishers.md`.

npm's check requires the job's `NPM_ID_TOKEN` OIDC token (aud
`npm:registry.npmjs.org`) — already in the verbatim §4.13.7 job. Until this is
configured, `plat:publish:npm` fails at `npm publish --provenance` with a 401 —
that is the expected pre-OD-10 state (W-7).

## Status

| Row | Status |
|---|---|
| OIDC job definition (`id_tokens`) | applied (§4.13.7 verbatim) |
| npmjs.com trusted-publisher entries | missing — **owner decision OD-10** |
| First tag dry-run through `plat:package:pack` + `npm publish --dry-run` (W-7) | unverified — awaits mirror visibility |
