---
id: OP-5
title: gh release create per tag
req: REQ-FIN-113
relatedReqs: [REQ-PLAT-09, REQ-PLAT-16, REQ-PLAT-52]
status: awaiting-operator
performedBy:
performedAt:
evidence:
---

# OP-5: `gh release create` for each tag

The FIN-H agent drafted this runbook (H3-6) and ran none of it. Each tag counts as one run. The
operator adds a row to the run log for every run. `status: done` is set only after the GA
(`v5.0.0`) release has been created and every earlier tag in the table has its release.

On 2026-10-10 the only GitHub releases are `v4.0.0` and `v4.1.0`. Pending: `v4.1.1`, `v4.2.0`,
`v4.3.0`, `v5.0.0-alpha.N`, `v5.0.0-rc.N` and `v5.0.0`.

## Prerequisites (per tag)

1. The tag exists on GitHub. Tags are created through the release train (FIN-C), not by this
   runbook:
   `git ls-remote --tags origin refs/tags/<tag>` prints the SHA.
2. That tag's GitLab pipeline has `plat:publish:npm` green. Check it with:
   ```sh
   node scripts/ci/gitlab-status.mjs --sha "$(git rev-parse <tag>^{commit})"
   ```
   Do not create the release while `plat:publish:npm` is missing, failed or skipped.
3. The notes file exists at the tagged commit. For 4.x tags that is `RELEASE_NOTES_<version>.md`
   at the repo root (`RELEASE_NOTES_4.1.0.md` already exists, for example). Confirm with
   `git show <tag>:RELEASE_NOTES_<version>.md | head`.
   For 5.0 tags, if the train ships the notes at `docs/release/notes/<version>.md`
   (`scripts/release/release-notes.mjs`) and not at the root, use that path in `--notes-file`
   and record it here.
4. For `v4.2.0` only: `docs/release/decisions/downstream-4.2.0.json` (OP-2) has been committed.
5. `gh` is already logged in with release rights. Use the existing login only.

## Commands (per tag)

Run these from a worktree checked out at the tag:

```sh
TAG=v4.1.1; VERSION=${TAG#v}
git fetch origin --tags
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add /Users/gurbakshchahal/platforms/AuraGlass.wt/op5-$TAG --detach "$TAG"
cd /Users/gurbakshchahal/platforms/AuraGlass.wt/op5-$TAG

# 4.x and every 5.0 tag:
gh release create "$TAG" -R auraoneai/auraglass --verify-tag --notes-file "RELEASE_NOTES_$VERSION.md"

# v4.2.0 additionally attaches the downstream report:
gh release create v4.2.0 -R auraoneai/auraglass --verify-tag --notes-file RELEASE_NOTES_4.2.0.md \
  docs/release/decisions/downstream-4.2.0.json

# pre-releases (alpha / rc) are marked as such:
gh release create "$TAG" -R auraoneai/auraglass --verify-tag --prerelease --notes-file "RELEASE_NOTES_$VERSION.md"
```

One-time action (PLAT-52): edit the existing `v4.1.0` release text to the retraction wording that
FIN-C lands for REQ-PLAT-52. Once that wording is on `release/4.x`, run:

```sh
gh release edit v4.1.0 -R auraoneai/auraglass --notes-file RELEASE_NOTES_4.1.0.md
```

## Expected output

- `gh release create` prints `https://github.com/auraoneai/auraglass/releases/tag/<tag>`.
- `--verify-tag` aborts with an error if the tag does not exist on the remote. That is the
  intended guard, so do not drop the flag.
- `gh release view <tag> -R auraoneai/auraglass --json tagName,isPrerelease,assets` shows the
  tag, the correct pre-release flag, and for `v4.2.0` the `downstream-4.2.0.json` asset.

## Evidence to paste (operator)

| Tag | Tag SHA | `plat:publish:npm` job URL (green) | Notes file used | Release URL | Date |
|---|---|---|---|---|---|
| v4.1.0 (text edit, PLAT-52) | | n/a | | | |
| v4.1.1 | | | | | |
| v4.2.0 | | | | | |
| v4.3.0 | | | | | |
| v5.0.0-alpha.N | | | | | |
| v5.0.0-rc.N | | | | | |
| v5.0.0 | | | | | |
