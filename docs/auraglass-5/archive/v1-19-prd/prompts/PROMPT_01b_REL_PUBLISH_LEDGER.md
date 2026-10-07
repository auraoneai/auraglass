# PROMPT-01b (REL): CI-only publish, dist-tags, release ledger, release notes, rollback runbook

You are working in `/Users/gurbakshchahal/platforms/AuraGlass`. Source PRD: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` (key REL, alias PRD-01) §4.2, §4.5, §5.5, §5.6 (REQ-REL-25), §11.5, §12, §20 steps 1, 2, 4. Binding registry: `docs/auraglass-5/prd/_shared-contracts.md` (SC-05, SC-06, SC-36). Requirements: **REQ-REL-19, 20, 21, 22, 23, 24, 25, 37**. Acceptance: **AC-REL-02, AC-REL-11** (4.1.1 onward), the runbook half of **AC-REL-19**, and the 01b share of AC-REL-04. Tasks: REL-020..REL-037 in `docs/auraglass-5/tasks/REL.json`. Branch: `rel/publish` → PR to `main`.

## Common rules

- Remote-first. Don't run Docker, browsers, `npm run build`, full-library `npm pack`/install, or the full Jest suite on the Mac. Use this public repo's GitHub Actions (`/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or the `auraone-remote-run` skill. Locally you may run only the single small Jest files listed below.
- Never run `npm publish` (real or `--dry-run` with auth), `npm dist-tag`, `npm deprecate`, `npm login/logout/token`, `gh auth *`. Never set `NPM_TOKEN`/`NODE_AUTH_TOKEN`/`GH_TOKEN` or write an `.npmrc`. Read-only `npm view` and `gh api` GETs are allowed.
- No fake completion, no skipped tests, no lowered thresholds, no snapshot updating to pass. Mock only `npm view`, `gh api` and `git` outputs where the PRD names them.
- Evidence is CI artifacts (D-32), not committed files. The exception is the decision records under `docs/release/decisions/`, which the PRD requires.
- Paths come from `scripts/release/lib/paths.mjs` (01a REL-001). "Publish workflow" means `.github/workflows/publish-npm.yml` (SC-05). Never rename it and never create `release.yml`: the npm trusted-publisher binding is `auraoneai/auraglass` + `publish-npm.yml`. QA's reusable `certify-release.yml` is called from it through `needs:` (QA-096, a PRD-01-reviewed change).
- Jest tests of Node scripts use `/** @jest-environment node */`.

## May touch / must not touch

May touch: `scripts/ci/require-ci-publish.js` (TRUST-079's file; MODIFY only if the guard is weaker than SC-05), `scripts/release/{dry-run,dist-tag,verify-release-ledger,release-notes}.mjs` (NEW), the publish workflow, `.github/workflows/verify-dist-tags.yml` (NEW), `docs/release/ledger-corrections.json` (NEW), `docs/release/decisions/` (NEW records), `docs/release-rollback-deprecation.md`, `CHANGELOG.md` (only a "Ledger corrections" note and generator markers `<!-- AG-CHANGELOG:START -->`/`END`), `package.json` (`prepublishOnly`, the `release:rehearse` script, and exact-pinned devDependencies `semver` and `yaml`, which are only transitive today; pin the version `npm ls` resolves), `tests/release/`.

Must not touch: `src/**`, `RELEASE_NOTES_*.md` (frozen; 4.1.1's file belongs to PRD-00), the history of `CHANGELOG.md` entries below 4.1.1 (D-32; add notes, don't rewrite), `glass-pipeline.yml`, `deprecations` content, npm package settings.

## Prerequisites (verify; stop with a blocker report if any fails)

1. 01a merged (`PROMPT_01a_REL_BASELINE.md`): `scripts/release/lib/paths.mjs` and `scripts/release/verify-deprecations.mjs` exist on `main`.
2. TRUST-079 merged (`PROMPT_00g_TRUST_RELEASE.md`): `scripts/ci/require-ci-publish.js` exists and `package.json` `prepublishOnly` calls it.
3. `node -e "const s=require('./package.json').scripts;process.exit(s.release||s['release:dry-run']?1:0)"` exits 0.
4. TRUST-077/078 merged: `.github/workflows/publish-npm.yml` exists, triggers on tags only, and `rg -n "NPM_TOKEN|NODE_AUTH_TOKEN" .github/workflows` returns nothing; `.github/workflows/release.yml` does not exist.

## Steps

1. **REL-020 (REQ-REL-21)** Verify TRUST-079's `require-ci-publish.js`: it must exit 1 with stderr `publishing is CI-only` unless `GITHUB_ACTIONS === 'true'` and `GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v` (SC-05). If the shipped guard is weaker (for example a `GITHUB_WORKFLOW` name check only), tighten it to exactly that condition; no workflow-name check is kept.
2. **REL-021** `scripts/release/dry-run.mjs` packs with `scripts/ci/lib/npm-pack.js`, runs `verify-pack`, `api-report --check`, `export-snapshot --tarball`, `deprecations:check` and (once 01c lands) `classify-change`, then prints the tarball path. It never calls `npm publish`, and it never sets `npm_lifecycle_event=prepublishOnly`. Add the `release:rehearse` script.
3. **REL-023 (REQ-REL-20)** `scripts/release/dist-tag.mjs` exports a pure `distTag(version, { gaPublished, rollback })` with this table:
   - any pre-release → `next`
   - `4.x` stable and `!gaPublished` → `latest`
   - `4.x` stable and `gaPublished` → `v4-lts`, or `latest` only when `rollback`
   - `5.x` stable → `latest`
   - else throws

   It also exports `assertMonotonic(version, tag, currentDistTags, { rollback })`, which throws unless `semver.gt(version, currentDistTags[tag])`. `rollback` waives it. The CLI form is `node scripts/release/dist-tag.mjs <version>`. It computes `gaPublished` from `npm view aura-glass@5.0.0 version` (a 404 means false) and prints the tag.
4. **REL-025 / REL-026 / REL-037 (REQ-REL-19/20/22)** Extend `publish-npm.yml` without changing its file name, `name:` or `permissions`, and keep QA-096's `needs:` call to `certify-release.yml`. Add these steps in order:
   1. tag == `package.json` `version`
   2. `git fetch origin main release/4.x` and `git merge-base --is-ancestor $GITHUB_SHA origin/<branch>`, where the branch is derived (4.1.x/4.2.0 → `main`; other 4.x → `release/4.x`; 5.x → `main`)
   3. `change-class` re-run with `--base <previous tag on the same line>` (from 01c; until 01c merges, the step runs `dry-run.mjs` and records `change-class: pending`)
   4. `verify-release-ledger.mjs --pending <version>`
   5. derive the tag with `dist-tag.mjs`, plus `assertMonotonic`
   6. `npm publish --provenance --access public --tag "$TAG"`
   7. post-publish `npm view aura-glass dist-tags --json` must show `$TAG` = version (retry up to 5× at 20 s)

   Rollback flag: tag-push workflows have no inputs, so `ROLLBACK_LATEST_TO_4X=true` is a repository variable `vars.ROLLBACK_LATEST_TO_4X` that a release owner sets and clears (PRD §4.5). Record it in the runbook.
5. **REL-028** `.github/workflows/verify-dist-tags.yml` triggers on `workflow_dispatch` only. It needs `permissions: contents: read`, has no secrets, runs `npm view aura-glass dist-tags --json`, uploads it as artifact `dist-tags-<run_id>.json` and fails if `expected_latest`/`expected_next`/`expected_v4lts` inputs (optional) disagree.
6. **REL-029 / REL-030 / REL-031 (REQ-REL-22)** `verify-release-ledger.mjs` collects four version sets:
   - CHANGELOG `## [x.y.z]` headings
   - `git tag -l 'v*'`
   - `gh api repos/auraoneai/auraglass/releases --paginate` tag names
   - `npm view aura-glass versions --json`

   For each version ≥4.1.1, it fails when the version is missing from any of the others (exits 1 and prints a table). `--pending <v>` excludes `<v>` from the npm and Release sets before publish. Versions <4.1.1 must match `docs/release/ledger-corrections.json` `{ version: 1, corrections: [{ version, missingFrom: [...], note, evidence }] }`. Record E-06 and E-07 exactly once each: v3.4.8 (CHANGELOG only), 3.5.0 (npm, no CHANGELOG/tag), 3.0.7 ("Unreleased" but published, no tag), v1.* tags, 2.17.0 and 2.16.4 (CHANGELOG, not npm), 2.0.7/2.0.8 order. Recompute each row from live `git tag`/`npm view` output, not from this list. Add a `## Ledger corrections` note near the top of `CHANGELOG.md` that points at the JSON. Rewrite no history.
7. **REL-033 (REQ-REL-23)** `release-notes.mjs --from <prevTag> --to <sha> --version <v> --claims <claims.json>`. Inputs: merged PR titles (`gh api` search), each PR's `change-class.json` artifact class, and the deprecations file. Output is Markdown with exactly these headings in this order, skipping empty ones: `Breaking` (5.x only), `Deprecated`, `Added`, `Fixed`, `Visual bug fixes` (composite links), `Security`. For 5.0.0, the first `Breaking` bullet block lists `date-fns`, `chart.js`, `react-chartjs-2`, `zod`, `framer-motion` and `tailwind-merge` with `npx @auraglass/cli migrate 4to5 --transform deps`. For 4.2.0, the first section lists the optional-peer subset from the `kind: dependency` entries with `since: "4.2.0"` (REQ-REL-39). The script fails if the body contains a number matching `/\b\d{2,}\b/` in a sentence with `component|target|pass|test|KB|%` unless `claims.json` supplies it as `{{claim:<key>}}`. It emits both the GitHub Release body and the CHANGELOG section between generator markers.
8. **REL-035 (REQ-REL-24, REQ-REL-37, §11.5)** Rewrite `docs/release-rollback-deprecation.md`. Keep the S1–S3 severity table, and keep PRD-00's REQ-TRUST-09 lint-scope decision section verbatim. Add a three-line model (`latest`, `next`, `v4-lts`). Turn each §11.5 row into numbered, copy-pasteable steps with a `verify-dist-tags` run after each dist-tag move. State that `npm deprecate` is only for a bad version (S1/S2) or 4.x EOL, never to push people to upgrade. Unpublish is only for an exposed secret or a legal emergency. Document the `vars.ROLLBACK_LATEST_TO_4X` procedure, and remove the CJS and "self-hosted runtime" scope lines for 5.x.
9. **REL-036 (REQ-REL-25)** 4.1.1 gate verification. In a remote job, run `export-snapshot --tarball "$(npm pack aura-glass@4.1.0)" --out /tmp/a` and the same for 4.1.1 (published, or the candidate artifact). Diff the per-entry `runtime`/`require`/`types` sets. Every removal must match `exception-allowlist.json` (exceptions `security | privacy | crash | legal | honesty`). Confirm the 4.1.1 scope equals the SC-36 intake (TRUST-owned: §13.1-class fixes plus CI-only changes, including NAV E-22, the MOT cookie-consent fix and FND's React 19 matrix; the 5 deferred items are absent). Write `docs/release/decisions/4.1.1-gate.md` with each REQ-REL-25 bullet → evidence URL (Pipeline Validation run, advisory URL published before the tag timestamp, the retraction commit, the `api:check` run, the diff artifact). This record must exist before TRUST-084 pushes `v4.1.1` (task `gate` field). Paste the per-entry diff table into the GitHub Release body (release owner).

## Tests (CI on the PR; the small ones may also run locally)

- `tests/release/prepublish-guard.test.ts` (REL-022). Spawn `node scripts/ci/require-ci-publish.js` instead of `npm publish --dry-run`, then assert `prepublishOnly` invokes it:
  - unset env → non-zero + `publishing is CI-only`
  - `GITHUB_ACTIONS=true` with `GITHUB_WORKFLOW_REF=auraoneai/auraglass/.github/workflows/other.yml@refs/tags/v4.2.0` → non-zero
  - correct ref → 0
  - no `release`/`release:dry-run` scripts
  - no workflow references `secrets.NPM_TOKEN` or `NODE_AUTH_TOKEN`
- `tests/release/dist-tag.test.ts` (REL-024): the seven PRD §12 cases verbatim, plus `assertMonotonic` failing on `4.2.0` vs current `latest` `4.2.1`.
- `tests/release/release-ledger.test.ts` (REL-032): CHANGELOG has 4.1.2 but npm doesn't → fail; a listed pre-4.1.1 mismatch → pass; an unlisted one → fail.
- `tests/release/release-notes.test.ts` (REL-034): fixed heading order; an unsourced "498 passed" → fail; the 5.0.0 body lists the six packages first under `Breaking`.
- `tests/release/publish-workflow-rel.test.ts` (REL-027; parse YAML with `yaml`): the file is `.github/workflows/publish-npm.yml`, the steps appear in the order of step 4, the publish job `needs:` the `certify-release.yml` call, `npm publish` has `--provenance` and `--tag "$TAG"`, and no `workflow_dispatch` `version` input exists.

Visual evidence: none (no UI). Evidence is the CI run URLs and the `verify-dist-tags` artifact.

## Exit criteria

- AC-REL-02: `npm view aura-glass@4.1.1 --json` has `dist.attestations`, the provenance names the publish workflow and the tag commit, and there are no `release` scripts and no token paths. Owner-dependent; record the status.
- AC-REL-11 (from 4.1.1): `verify-release-ledger.mjs` exits 0 on `main`, and each E-06/E-07 mismatch appears exactly once in `ledger-corrections.json`.
- AC-REL-19 (runbook half): every §11.5 row is an executable step list in the runbook. The drill itself happens in 01f.
- The five test files pass in CI.

## Final report

```
PROMPT-01b REL report
SHA / PR: <sha> / <url>
Guard: GITHUB_WORKFLOW_REF check as shipped by TRUST-079 (unchanged|tightened); test run=<url>
Publish workflow steps added: <ordered list>; rollback via vars.ROLLBACK_LATEST_TO_4X; certify-release needs: present=<bool>
Ledger: exit=<code>; corrections=<n> (<versions>)
4.1.1 gate record: docs/release/decisions/4.1.1-gate.md; export diff removals=<n> (all allow-listed: <bool>)
Tests: <file → pass/fail, run URL>
AC-REL-02 / 11 / 19(runbook): <status + evidence>
Owner actions pending: <list>
```
