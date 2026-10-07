# PROMPT-01c (REL): Change classification, visual-class gate, branch policy

You are working in `/Users/gurbakshchahal/platforms/AuraGlass`. Source PRD: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` (key REL, alias PRD-01) §4.1, §4.2, §4.4, §5.2 (REQ-REL-09), §5.3, §5.4, §5.9, §12, §14 (RESP-REL-1), §20 steps 5 and 8. Binding registry: `docs/auraglass-5/prd/_shared-contracts.md` (SC-09, SC-10, SC-29, SC-40). Requirements: **REQ-REL-09, 12, 13, 14, 15, 16, 17, 18**, plus the CI step of **REQ-REL-42**. Acceptance: **AC-REL-03, AC-REL-09** and the 01c shares of AC-REL-04 and AC-REL-21. Tasks: REL-040..REL-060, REL-142. Branch: `rel/classify` → PR to `main`.

## Common rules

- Remote-first. Visual capture (Playwright/Chromium), builds, packing and the full Jest suite run in this public repo's GitHub Actions (`/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or through `auraone-remote-run`. Never run a local browser or Docker. `visual-class.mjs` may run locally on small generated PNG fixtures only.
- No fake completion, no skipped tests, no lowered thresholds (`threshold: 0.1`, `0.001` changed-ratio, 1440×900 + 390×844 are fixed by the PRD), and no rebasing a visual baseline to make a PR pass.
- `gh api` is read-only (GET) for agents. Applying branch protection is a repo-admin owner action (§ owner actions in `PROMPT_01_REL.md`). Record the exact command and payload; don't run the `PUT`.
- Paths come from `scripts/release/lib/paths.mjs` (01a REL-001): `etc/api/`, root `deprecations.json`, `publish-npm.yml`.
- Visual captures come from QA's `certify-pr.yml` `regression` job (QA-031, QA-072), which runs this prompt's `visual-class.mjs` as its visual-class step. `.github/workflows/visual-regression.yml` is not repurposed or edited (QA-119 deletes it on `main`; TRUST-062 touches it on `release/4.x` only; SC-09). `glass-pipeline.yml` is PKG-owned (SC-10): MODIFY only after PKG-038, job names unchanged.
- Jest tests of Node scripts use `/** @jest-environment node */`.

## May touch / must not touch

May touch: `scripts/release/{visual-class,classify-change,verify-branch-protection}.mjs` (NEW), `scripts/release/lib/branch-policy.mjs` (NEW; the §4.1 allowed-class table as data), `scripts/release/verify-deprecations.mjs` (add `--compare-branch`), `.github/workflows/change-class.yml` (NEW), `.github/workflows/glass-pipeline.yml` (only the `push`/`pull_request` `branches` lists at `:5`/`:7`), `.github/CODEOWNERS` (NEW), `docs/release/branch-policy.md` (NEW), `package.json` (exact-pinned devDeps `pixelmatch` and `pngjs`, script `change:classify`), `tests/release/`.

Must not touch: `src/**`, the publish workflow (01b owns it; it calls `classify-change.mjs`), `.github/workflows/certify-pr.yml` and `.github/workflows/visual-regression.yml` (QA), the deprecations content, visual baselines under `tests/visual/**` (read only), and `scripts/ci/verify-app-chrome-visuals.js` (request any `--out` flag from QA).

## Prerequisites (verify; stop with a blocker report if any fails)

1. 01a merged (`PROMPT_01a_REL_BASELINE.md`): `scripts/release/lib/paths.mjs`, `scripts/release/verify-deprecations.mjs`, `scripts/release/verify-task-graph.mjs` and `etc/api/manifest.json` exist on `main`.
2. `scripts/release/dist-tag.mjs` exists (01b REL-023).
3. `docs/release/exception-allowlist.json` exists (01a REL-018).
4. Job names at `glass-pipeline.yml:16,154,175` are still `Glass Quality Gates`, `Next.js npm Integration`, `Vite npm Integration` (`rg -n "name: (Glass Quality Gates|Next.js npm Integration|Vite npm Integration)" .github/workflows/glass-pipeline.yml`). A rename is a co-change with REQ-REL-17 (SC-10); if they changed without one, stop and report it. PKG-038 (`PROMPT_02a_PKG_BUILD.md`) is merged before REL-057 edits the file.
5. QA-031 and QA-072 merged (`PROMPT_18c_QA_CI_FAIL_CLOSED.md`, `PROMPT_18f_QA_REGRESSION_ENGINE_MOTION.md`): `certify-pr.yml` has a `regression` job that uploads `visual-base`/`visual-head`. If not, REL-040/043 still land, REL-042/048 stay report-only, and the blocker is PRD §21 OI-14.

## Steps

1. **REL-040 (REQ-REL-12)** `scripts/release/visual-class.mjs --base <dir> --head <dir> --out visual-class.json [--composites <dir>]`. Pair PNGs by relative path (cell id = path without extension, e.g. `app-chrome/light/1440x900/sidebar`). Use `pixelmatch(a, b, diff, w, h, { threshold: 0.1, includeAA: false })`, with `changedRatio = diffPixels / (w*h)` and `changed = changedRatio > 0.001`. A size mismatch or missing counterpart counts as `changed: true, reason: "missing" | "size"`. With `--composites`, write `base | head | diff` side-by-side PNGs for changed cells. Output `{ cells: [{ cell, changedRatio, changed, reason? }], changedCount }` sorted by cell.
2. **REL-042 (REQ-REL-12, RESP-REL-1)** Verify QA's `certify-pr.yml` `regression` job (QA-072) as the base/head capture source; do not edit it.
   - It runs on `pull_request` to `release/4.x` (and `main` for ≥5.0.0) on hosted runners, capturing base and head SHAs separately.
   - Its cell list must contain the default-mode cells of `test:visual:app-chrome` in Chromium, light + dark, at 1440×900 and 390×844, with tier and preferences forced and no runtime heuristic, plus the frozen 4.x consumer fixture pages once `tests/fixtures/consumer-4x/` exists (01e REL-116).
   - Preview cells (`data-ag-preview="v5"`) are excluded.
   - It runs `scripts/release/visual-class.mjs` and uploads `visual-base/`, `visual-head/`, `visual-class.json` and `composites/`.
   - Any gap is filed against QA-072 with the exact cell list; record it in the report.
3. **REL-043 (REQ-REL-15)** `classify-change.mjs --base <ref> [--head HEAD] [--target <branch>] [--pr <n>] --out change-class.json`. Inputs:
   - the API report diff per entry: additions-only → C-E, any removal/rename/narrowing → C-B, none → C-I
   - the export snapshot diff (`runtime`/`require`/`types` sets; a removed `require` condition → C-B)
   - the `deprecations` diff (added entries → C-D, removed entries → C-B)
   - `package.json` `dependencies`/`peerDependencies`/`engines`/`exports` key diffs
   - `visual-class.json`
   - commit markers: `!` or `BREAKING CHANGE:` from `git log <base>..<head>`
   - PR labels (`gh api` GET)

   `class = max` over all sources. It fails (exit 1, reasons listed) when the class isn't allowed for the target under `lib/branch-policy.mjs`. While `package.json` `version` is 4.x, `main` uses the 4.x rows. It also fails when a `!`/footer disagrees with the computed class (`!` below C-B, or C-B without `!`, or any `!` on `release/4.x`), and when a `change:C-x` label is lower than the computed class. Output shape: `{ class, reasons[], perEntry{}, deprecationsAdded[], removals[], visual{}, commitMarkers{}, approvals{} }`.
4. **REL-046 (§4.1 C-D install-level)** A dependency moved from `dependencies` to `peerDependencies` with `peerDependenciesMeta.<pkg>.optional: true` on a 4.x minor is C-D (install-level) only when all of these hold, otherwise C-B:
   - (a) a `kind: dependency` entry for `<pkg>` exists with `since` = the target version
   - (b) `rg -n "from ['\"]<pkg>" src` hits only files whose module is behind its own subpath or that use `await import(` inside a function that throws `[aura-glass] <pkg> is now an optional peer; install it: npm i <pkg>`. Detect this by AST (TypeScript compiler API), not by regex alone.
   - (c) the entry's `doc` anchor exists

   Condition (d), "release notes list it first", is checked by `release-notes.mjs` (01b). Removal from both maps is C-B.
5. **REL-044 (REQ-REL-09)** On `main`, every removed or renamed symbol, subpath, prop, prop value, CSS var or global selector must have a deprecations entry matching `entry`+`symbol`. That entry's `since` must satisfy all three: it is a published 4.x version ≥4.1.1 (`npm view aura-glass@<since> version`, exit 0 and equal), the id appears in `git show v<since>:deprecations.json`, and it isn't back-dated on `main`. Otherwise the gate fails. The exception is an `exception != null` entry listed in `exception-allowlist.json`. Removed CSS vars and global selectors come from a diff of the built CSS custom-property/selector lists. Reuse `verify:css-vars` output if it emits a list; otherwise add a `--list` mode to that script and record the change.
6. **REL-045 (REQ-REL-09 forward-port)** `verify-deprecations.mjs --compare-branch release/4.x` fails when an id exists on `origin/release/4.x` but not on `main`. In `classify-change`, a PR whose head branch starts `forward/4.x-` fails when it touches anything other than the deprecations file and the generated files `src/internal/deprecations.generated.ts` and `docs/migration/5.0/deprecations.generated.md`.
7. **REL-047 (REQ-REL-18)** Fail when the removals map to more than one distinct `breaking` group across entries, unless the PR has label `multi-family` and a body line `multi-family-reason: <text>`.
8. **REL-048 (REQ-REL-13/14)**
   - On `release/4.x`, any `changed` cell makes the visual class C-B, except when all three are present: label `visual-bug-fix`, ≥1 `APPROVED` review whose author appears in `.github/CODEOWNERS` for `/docs/release/`, and the composites artifact URL. With them it is C-I (visual fix), and `approvals` records `{ reviewer, reviewUrl, compositeArtifactUrl }`.
   - On `main` before 5.0.0 the visual class is informational: it is reported and never fails.
   - From version ≥5.0.0 on `main`, the same rule as `release/4.x` applies to the PRD-19 default cells.
9. **REL-052 (REQ-REL-16)** `.github/workflows/change-class.yml`:
   - Trigger: `pull_request` to `main` and `release/4.x`. Job name must be exactly `change-class`.
   - Steps: checkout with `fetch-depth: 0`; `npm ci`; build; pack; `api-report --check` per entry; `export-snapshot --tarball` for the head and base tarballs (base packed from a base worktree); download `visual-class.json` from the `certify-pr.yml` `regression` job artifacts (QA-072) with `workflow_run`, or report `visual: pending` if absent (never capture here); `classify-change`; sticky PR comment (one comment updated in place, marker `<!-- change-class -->`) listing the class and reasons.
   - `permissions: contents: read, pull-requests: write`. Run no untrusted PR code with secrets (none are needed).
   - Timeout ≤ 20 min, with a target of p95 ≤ 10 min excluding visual (§16).
10. **REL-053 (REQ-REL-13)** `.github/CODEOWNERS` (REL-053 is the only CREATE; QA and others MODIFY, overlap OV-21) covers `/docs/release/`, `/deprecations.json`, `/etc/api/`, `/scripts/release/` and `/.github/workflows/`. Release owners are an owner decision. Propose candidates from `gh api repos/auraoneai/auraglass/collaborators?permission=admin` (GET) in the PR body. Don't invent handles. If no confirmed owner exists, open the PR as a draft and list the blocker.
11. **REL-054 / REL-055 / REL-057 / REL-058 (REQ-REL-16/17)**
    - `docs/release/branch-policy.md` holds the class table (§4.1) and the exact `gh api -X PUT repos/auraoneai/auraglass/branches/<b>/protection` JSON payloads for `main` and `release/4.x`: `required_status_checks.strict: true`, `checks` = `change-class`, `Glass Quality Gates`, `Next.js npm Integration`, `Vite npm Integration` (and on `main` PRD-02 `artifact` once it exists), `required_pull_request_reviews.required_approving_review_count: 1`, `enforce_admins: true`, `required_linear_history: true`, `allow_force_pushes: false`, `restrictions: null`.
    - `verify-branch-protection.mjs --branch <b>` does a GET of the protection and fails when any listed check or rule is missing.
    - In `glass-pipeline.yml`, add `release/4.x` to the `push` and `pull_request` branch lists. Drop `develop` and `feat/glass-*` only if `git ls-remote --heads origin develop 'feat/glass-*'` is empty.
    - REL-058 is the repo admin applying the `main` payload. Afterwards, run `verify-branch-protection.mjs --branch main` and attach the output.
12. **REL-060** Add the `change:classify` script and pin `pixelmatch` and `pngjs` exactly.
13. **REL-142 (REQ-REL-42)** Add a `change-class.yml` step that runs `node scripts/release/verify-task-graph.mjs` on PRs touching `docs/auraglass-5/**` (job name stays `change-class`). It runs with `--report` until every fragment is clean, then blocks before the first 4.2 PR merges (AC-REL-21).

## Tests

- `tests/release/visual-class.test.ts` (REL-041), with generated PNGs (pngjs in-test, no browser): identical → `false`; 1440×900 pair with 0.05% of pixels differing → `false`; 0.2% → `true`; a 1-px anti-aliased edge-only difference → `false`; JSON shape.
- `tests/release/classify-change.test.ts` (REL-049), table-driven over synthetic inputs: every case listed in PRD §12 for this file, verbatim, including the three install-level cases, the 4.x-version PR on `main` with a removal, and `since: "4.3.0"` with a mocked `npm view` 404.
- `tests/release/no-removal-without-deprecation.test.ts` (REL-050): the five PRD §12 cases.
- `tests/release/deprecations-forward-port.test.ts` (REL-051): fixture git repo built in a temp dir (`git init`, two branches, tag); the two PRD §12 failure cases plus one pass.
- `tests/release/branch-protection.test.ts` (REL-056): mocked `gh api` JSON missing `change-class` → fail; complete → pass.

Run everything in CI on the PR.

## Visual evidence

**REL-059 (AC-REL-09)** canary, after `release/4.x` exists:
1. Open throwaway PR A on `release/4.x` that changes one default-mode surface colour in a token by a visible amount. `change-class` must fail (C-B).
2. Add `visual-bug-fix` and a release-owner approval. `change-class` must pass as C-I (visual fix), and `change-class.json` must show `compositeArtifactUrl`.
3. Close the PR unmerged.

Record both run URLs and the composite artifact for human review, since screenshots can't be inspected by the agent here. Until `release/4.x` exists, run the same canary against a scratch branch `canary/visual-class` with `--target release/4.x` and record it as provisional.

## Exit criteria

- AC-REL-03: `verify-branch-protection.mjs --branch main` exits 0 with `change-class` required. `release/4.x` gets the same check at its cut (01d REL-090).
- AC-REL-09: canary PR log as above.
- The five test files pass in CI, `change-class` runs on this PR itself, and it posts a sticky comment.

## Final report

```
PROMPT-01c REL report
SHA / PR: <sha> / <url>
change-class on own PR: class=<C-x> reasons=<…> run=<url> wall=<min>
certify-pr regression (QA-072): cells=<n> (light/dark × 1440×900/390×844) run=<url>; gaps filed against QA=<list>
Task graph step (REL-142): mode=report|blocking; counts=<per fragment>
Branch protection main: verify exit=<code> (applied by <admin>, date)
CODEOWNERS owners: <handles | BLOCKED>
Canary AC-REL-09: fail-run=<url> pass-run=<url> composite=<url>
Tests: <file → pass/fail>
Deviations / blockers: <list>
```
