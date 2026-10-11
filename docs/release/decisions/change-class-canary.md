# Decision record — change-class canary (AC-PLAT-17)

Date: 2026-10-08 · Owner action required: **pipeline operator**

## What the gate needs

`plat:gate:change-class` must run on a release/4.x pipeline for an unrelated
candidate (one touching only non-owned files) and produce
`.artifacts/plat/change-class/change-class.json` with `class: "C-I"` and zero
errors — proving the job maps to `scripts/release/classify-change.mjs` and the
allowed-class table accepts a no-op change.

## Status on this VM

- **Recorded: missing.** The canary requires a GitLab pipeline on release/4.x.
  The mirror (project 87152036) is not reachable from this VM (public API 404s —
  the project is private/not yet provisioned) and lane 1a's
  `ci/plat.gitlab-ci.yml` exists only on the unmerged `next-plat/ci-bootstrap`
  branch, so no canary pipeline can be dispatched from here.
- Local equivalent run (both names, proving the seed-name alias works):

  ```
  node scripts/release/classify-change.mjs --base <base> --line 4x   # C-I
  node scripts/release/change-class.mjs   --base <base> --line 4x   # C-I
  ```

## Operator action

1. Merge the lane-1a CI branch so `plat:gate:change-class` exists on release/4.x.
2. Open a no-op MR against release/4.x (a comment-only change to a non-owned file).
3. Confirm the job exits 0 with `class: "C-I"` and the artifact is uploaded.
4. Record the pipeline URL in this file's "Evidence" section, then close.

## Evidence

- `tests/release/policy.test.mjs`, `tests/release/classify-change.test.mjs` —
  105 assertions covering every (class × target) pair, marker rules, the
  Multi-Family trailer, visual-record matching and install-level conditions.
