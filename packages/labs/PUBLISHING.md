# Publishing @auraglass/labs

REQ-PLAT-12 / REQ-PLAT-15 labs clauses (contract F02: SURF owns this package;
REQ-FIN-87). CI only: `prepublishOnly` runs `scripts/ci/require-ci-publish.js`
first, which refuses outside `plat:publish:npm` (GitLab project 87152036,
release tag `vX.Y.Z[-(alpha|beta|rc).N]`, OIDC `id_tokens`). No npm access-token
env vars are stored in this repo; publishing uses OIDC provenance.

## Trusted publishing (OD-2 / OD-10)

- Provider GitLab CI/CD; namespace `chahal-foundation-group/github-auraoneai`;
  project `auraglass`; file `.gitlab-ci.yml`; environment `npm-publish`.
- Status and date: the `@auraglass/labs` row of
  `docs/release/trusted-publishers.md` (owner-filled). Until it is
  `configured` the publish fails closed.
- First publish: the name does not exist on npm yet. If the `@auraglass` scope
  is unavailable, the D-23 fallback recorded in `contracts/packages.json` is
  `aura-glass-labs` (owner decision OD-2, `docs/release/decisions/npm-scope.md`);
  rename `package.json` before the first publish — never publish both names.

## Build and pack

- `npm run build -w packages/labs` runs tsdown (`tsdown.config.ts`): one entry
  per resident (`exports` `./<kebab>` → `src/<kebab>/index.ts(x)` →
  `dist/<kebab>/index.js` + `.d.ts`), peers external.
- `prepack` runs the same build, so `npm pack -w packages/labs` in
  `plat:package:pack` always packs a fresh `dist/` (`auraglass-labs-0.x.y.tgz`).
- `tests/labs/package.test.ts` asserts the packed file list contains
  `package.json` and every `exports` target.

## Pipeline contract

- The labs admission lane (`scripts/surf/verify-labs-admission.mjs --manifest
  build/exports.manifest.json`, L1, scopes `pr` + `release`) must pass on the
  tag pipeline; `plat:publish:npm` publishes the tarball recorded by
  `plat:package:pack` with `--provenance`.

## Never

- No npm access-token env vars in any file.
- Never publish from a laptop — the guard exits 1.
