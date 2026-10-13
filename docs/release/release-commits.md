# Release-commit protocol (PLAT-298 — AC-PLAT-18 release-commit half)

Release commits are **release-only** operations, never part of feature PRs.
This record binds the sequence; it is a decision record, not a script.

**Status (2026-10-13):** 5.0.0 GA shipped on `main` (step 6 below is now the current stable flow; 5.0.1 followed the same day). Packages are published via tarballs today; the GitLab trusted-publishing pipeline steps apply once the publisher rows in `docs/release/trusted-publishers.md` are `configured`. The prerelease sequence is retained for future prereleases.

## Sequence (5.x line, prerelease)

1. `npx changeset version` — consumes committed `.changeset/*.md` files,
   bumps `package.json` `version`, writes/extends `CHANGELOG.md` on `next`.
2. Commit `release: v5.0.0-<pre>` (conventional; no `!` — release commits are
   not breaking-change commits).
3. `git tag -a v5.0.0-<pre>.N -m "v5.0.0-<pre>.N"` on the merge commit on
   `next`, pushed to GitHub. **Operator action** — tag creation needs GitHub
   credentials and hits the mirror.
4. The `mirror-to-gitlab` workflow delivers the tag to GitLab; the GitLab tag
   pipeline publishes to npm with `--dist-tag next` and creates the GitLab
   release (`plat:release:notes` job, `release:` block) with linked assets
   `release-notes.md` and `dist-maps.tgz`.
5. **Operator action** — mirror the release on GitHub so GitHub-side users get
   the same notes and assets:

   ```
   gh release create v5.0.0-<pre>.N \
     --notes-file .artifacts/plat/release-notes.md \
     --prerelease \
     .artifacts/plat/dist-maps.tgz .artifacts/pack/*.tgz
   ```

   Use `--prerelease` for alpha/beta/rc tags only (never for stable); assets
   come from the tag pipeline's `plat:package:pack` + `plat:release:notes`
   evidence artifacts. If GitHub releases are out of scope for a train, record
   the skip in `docs/release/decisions/` instead.
6. Stable (current, since the 2026-10-13 GA): same flow on `main`, `git tag -a v5.x.y`,
   publish with `--dist-tag latest` (tarballs today; GitLab trusted publishing once configured); the operator step 5 drops
   `--prerelease`.

## Decision record

- **D-tags**: tags are created by the release operator on `next` for
  prereleases and on `main` for stable releases (the GA flow since 2026-10-13). Devin does not
  hold credentials; tag pushes are recorded as owner actions.
- **changelog**: `npx changeset version` output is the only sanctioned
  CHANGELOG source; lane changesets land per PR under `.changeset/`.
- **npm token**: no npm access-token variable (`NPM_*` / `NODE_AUTH_*`) may appear anywhere in the
  repo; the GitLab pipeline is intended to publish with OIDC only, guarded by
  `scripts/ci/require-ci-publish.js` (until trusted publishing is configured, releases ship via operator-published tarballs).

## Gates before a release commit

- `node scripts/ci/verify-pack.js` clean (this PR's artifact).
- `node scripts/ci/verify-size-budgets.mjs` all rows pass (or pending rows
  documented per-task as PENDING_OWNED).
- Release verdict path (`plat:release-verdict`) reports release-ready on the
  tag pipeline; `verify-release-verdict` (main + release/4.x tags) blocks
  `latest` promotion without it.
