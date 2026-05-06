# npm Publish Readiness

Generated: 2026-05-06
Auth rechecked: 2026-05-06T18:53:06Z

This report captures live npm registry state and local authentication evidence for the AuraGlass `3.0.0` publish target.

## Registry State

- Package: `aura-glass`
- Current package version in this worktree: `3.0.0`
- Current npm `latest` dist-tag before publish: `2.16.2`
- Published latest before this release: `2.16.2`
- Target version: `3.0.0`
- `3.0.0` is not published yet.

Live check:

```json
{
  "version": "2.16.2",
  "dist-tags": {
    "latest": "2.16.2"
  }
}
```

## Ownership And Auth Evidence

`npm owner ls aura-glass --json` returns:

```text
veeronecorp <gchahal@veerone.com>
```

`npm whoami --registry=https://registry.npmjs.org/` returns:

```text
veeronecorp
```

This shell has an authenticated npm session for the package owner. Real publishing still depends on npm accepting the account session, any required 2FA step, and provenance support for the current publish environment.

## Latest Local Publish Evidence

`npm publish --dry-run --provenance --access public` completed successfully for `aura-glass@3.0.0` and exercised `prepublishOnly`:

- Build completed.
- Pack verification passed with no nested `node_modules`, React runtimes, or dispatcher artifacts.
- Next 14 / React 18 integration smoke passed.
- Next 15 / React 19 integration smoke passed.
- Dry-run publish target: `aura-glass@3.0.0`.
- Dry-run npm notice package size: `7.6 MB`.
- Dry-run npm notice unpacked size: `40.4 MB`.
- Dry-run npm notice total files: `2002`.

`npm pack --dry-run --json` reports:

- Tarball: `aura-glass-3.0.0.tgz`
- Size: `7596069`
- Unpacked size: `40397720`
- Shasum: `07909a8189be2c1ac821b0edbd35e6325cb7d457`
- Integrity: `sha512-OBRdHbqcEI0boRoeez1UMwXw4m8VFwHnX2zs1p9yVUVVQqnsYSdTY/1L5izB+1ghNSoybghGGMbleh0MKIn3jQ==`
- Entry count: `2002`
- Bundled dependencies: `[]`

## Release Gates

- `npm run typecheck -- --pretty false`: passed.
- `npm run audit:exports && npm run audit:api && npm run audit:runtime`: passed.
- `npm run check:perf`: passed.
- `npm run ci -- --silent`: passed with `401` suites, `2132` tests, and `339` snapshots.
- `npm run build-storybook`: passed; output directory is `storybook-static`.

## Publish Status

The repository is configured for public npm publishing with provenance:

```json
{
  "access": "public",
  "provenance": true
}
```

The remaining npm step is the real publish:

```bash
npm publish --provenance --access public
```

After publish, verify:

```bash
npm view aura-glass version dist-tags --json
```

Then run a clean install smoke test from the published registry package.
