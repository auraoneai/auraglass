# Release-commit protocol (PLAT-298 — AC-PLAT-18 release-commit half)

Release commits are **release-only** operations, never part of feature PRs.
This record binds the sequence; it is a decision record, not a script.

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
6. From GA (v5.x.y on `main`): same flow on `main`, `git tag -a v5.x.y`,
   GitLab publishes with `--dist-tag latest`; the operator step 5 drops
   `--prerelease`.

## Decision record

- **D-tags**: tags are created by the release operator on `next` during the
  beta window (prereleases) and on `main` after GA (stable). Devin does not
  hold credentials; tag pushes are recorded as owner actions.
- **changelog**: `npx changeset version` output is the only sanctioned
  CHANGELOG source; lane changesets land per PR under `.changeset/`.
- **npm token**: no `NPM_TOKEN`/`NODE_AUTH_TOKEN` may appear anywhere in the
  repo; the GitLab pipeline uses CI-side publish auth per
  `scripts/ci/require-ci-publish.js`.

## Gates before a release commit

- `node scripts/ci/verify-pack.js` clean (this PR's artifact).
- `node scripts/ci/verify-size-budgets.mjs` all rows pass (or pending rows
  documented per-task as PENDING_OWNED).
- Release verdict path (`plat:release-verdict`) reports release-ready on the
  tag pipeline; `verify-release-verdict` (main + release/4.x tags) blocks
  `latest` promotion without it.
