# REQ-PLAT-99 amendment: the docs app installs the packed tarball with `--no-save`

Status: accepted (PLAT, 2026-10-12). Amends the `consuming aura-glass from
"file:../../.artifacts/pack/aura-glass-<version>.tgz"` clause of REQ-PLAT-99.
The requirement's intent is unchanged: the docs site renders the packed
`aura-glass` artifact, never `src/` or a workspace link.

## Why the literal `file:` dependency is not used

`apps/*` is a root npm workspace (`package.json` `workspaces`). A
`"aura-glass": "file:../../.artifacts/pack/aura-glass-<version>.tgz"` entry in
`apps/docs/package.json` would:

1. Put the tarball path and its integrity into the root `package-lock.json`.
   Every CI job starts with `npm ci`, including `plat:package:pack`, which is
   the job that writes the tarball. `npm ci` would fail on a missing
   `.artifacts/pack/` file before the tarball exists, so the pipeline could
   never produce it.
2. Pin a version into the manifest. Each version bump (`changeset version`)
   would have to rewrite `apps/docs/package.json` and the lockfile to a new
   tarball name, and a stale entry would install the wrong version silently.
3. Change the lockfile integrity on every pack, since the tarball bytes
   differ per commit.

## What is used instead

- `scripts/docs/install-pack.mjs` derives the tarball path from the root
  `package.json` version (`.artifacts/pack/aura-glass-<version>.tgz`) and runs
  `npm install --no-save --install-strategy=nested -w apps/docs ./<tarball>`
  inside `plat:build:docs`, after `plat:package:pack` has produced it.
- It then verifies the resolved `aura-glass` from `apps/docs` is a real
  directory in `node_modules` (not a symlink or the repo root), has that
  version, and has no `src/`. Any failure exits 1 and stops the docs build.
- `apps/docs/package.json` declares no `aura-glass` dependency of any kind
  (workspace, link or `file:`), and the app has no path alias out of itself.

## Proof

- `tests/docs/docs-artifact.test.ts`: the tarball path follows the root
  version; a stale tarball is ignored; a self link, a `src/` tree and a
  version mismatch each fail; `apps/docs/package.json` declares no
  `aura-glass` dependency; the build chain runs `install-pack` before
  `next build`.
- `plat:build:docs` fails when `.artifacts/pack/aura-glass-<version>.tgz` is
  missing from the `plat:package:pack` artifacts.
