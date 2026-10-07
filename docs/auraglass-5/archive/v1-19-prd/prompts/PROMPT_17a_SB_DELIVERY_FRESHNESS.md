# PROMPT-17a (SB): Storybook delivery, freshness gate and legacy-cert callers

You are implementing part of PRD-SB (key SB, self-id alias PRD-17; Storybook, Material Lab and Showcase) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`, Storybook 9.1.20). This prompt is self-contained. Other PRD numbers below use architecture §16 numbering (PRD-19 = QA certification infra, key QA; PRD-01 = release governance, key REL). Task `depends_on` uses task ids only (SC-40).

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` deviation 3, §2 rows E12/E18, §5.F REQ-SB-41, §5.H, §5.I, §6, §11 "Two Storybooks", §12 (`verify-fresh.test.mjs`, `deploy-workflow.test.mjs`), §16 (build size/time), §17 AC-SB-14..17, §20 step 1.
- PRD-19: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` REQ-QA-50, -51, -52, -60..64 (you only consume these; tasks QA-018, QA-031, QA-032, QA-115, QA-119 in `tasks/QA.json`, prompts `PROMPT_18a_QA_HARNESS_FOUNDATION.md` and `PROMPT_18c_QA_CI_FAIL_CLOSED.md`).
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-09 (visual gate in `certify-pr.yml`; `visual-regression.yml` deleted on `main` by QA-119), SC-11 (scripts layout), SC-29 (lane/workflow names), SC-30 (tests under `tests/storybook/`), SC-40. PRD §21 O-SB-06/O-SB-07 are this prompt's open items.
- Policy: `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`, `/Users/gurbakshchahal/.config/agent-policy/reference/cloudflare.md`, `/Users/gurbakshchahal/.config/agent-policy/reference/shared-service-access.md`, `/Users/gurbakshchahal/.config/agent-policy/reference/github-npm.md`.
- Tasks: `docs/auraglass-5/tasks/SB.json` SB-001..SB-019.

Requirements: REQ-SB-41, REQ-SB-50, REQ-SB-51, REQ-SB-52, REQ-SB-53, REQ-SB-54, REQ-SB-55, REQ-SB-56, REQ-SB-57. Acceptance: AC-SB-14, AC-SB-15, AC-SB-16 (verified at the first 5.x tag), AC-SB-17 (Storybook-side half).

## 2. Scope
May create or modify:
- `.github/workflows/deploy-storybook.yml` (rewrite), NEW `.github/workflows/storybook-tests.yml` (reusable skeleton; PROMPT_17b adds the Vitest job)
- NEW `scripts/storybook/write-build-manifest.mjs`, `verify-fresh.mjs`, `check-build-log.mjs`, `assemble-pages.mjs`
- NEW `tests/storybook/verify-fresh.test.mjs`, `check-build-log.test.mjs`, `deploy-workflow.test.mjs`, `assemble-pages.test.mjs`, fixtures under `tests/storybook/fixtures/**`
- NEW `.storybook/redirects.json`, NEW `.storybook/manager-head.html` (redirect shim only)
- `package.json`: `scripts` (`postbuild-storybook`, `build-storybook`, remove `audit:storybook:presentation` at `:339`) and devDependency `yaml` (exact pin)
- `scripts/ci/forbidden-check.js` (one added check)
- On `release/4.x` only: `scripts/visual-test-runner.js` and `.github/workflows/visual-regression.yml` (insert the `verify-fresh.mjs` call only). On `main` these files are PRD-QA's to delete (QA-119, REQ-QA-52) and you do not edit them (SC-09)
- Delete `scripts/audit/story-presentation-audit.js`
- On `release/4.x` only (SB-017): the same workflow permissions and freshness scripts

Must NOT touch: any `src/**` file, `.storybook/preview.tsx`, `.storybook/main.ts`, `certification/**`, `packages/qa/**`, `.github/workflows/certify-*.yml` (QA-031/032/034 own them; SB-014 is a read-only contract check), `scripts/audit/storybook-visual-certification.mjs` (QA-115, REQ-QA-50, deletes it), `.github/workflows/visual-regression.yml` and `scripts/visual-test-runner.js` on `main`, `.gitignore`, `scripts/ci/verify-no-core-ui-deps.js`, `scripts/ci/stale-3-3-scan.js`, `scripts/ci/verify-pack.js` (dirty in the worktree and owned by PRD-02).

## 3. Prerequisites (check each; continue unblocked work and report blockers)
- Baseline: `git merge-base --is-ancestor 15b6de6f7 HEAD`.
- Repo visibility and Pages mode: `gh repo view auraoneai/auraglass --json visibility` and `gh api repos/auraoneai/auraglass/pages --jq .build_type`. Today Pages is served from the `gh-pages` branch (`origin/gh-pages` exists). Switching to `build_type=workflow` replaces the live site. Don't flip it yourself. Record the exact command (`gh api -X PUT repos/auraoneai/auraglass/pages -f build_type=workflow`) as a cutover action in the report. Cutover is allowed only after the `/v4/` release asset exists (SB-006).
- Cloudflare preview (SB-005): read `cloudflare.md`. Check whether Pages project `auraglass-storybook` exists with the existing authenticated Wrangler (`wrangler pages project list`). If it doesn't exist, create it under the existing account (a standard, reversible remote resource). Never create, print or copy an API token, and never write a token into GitHub secrets. If repo secret `CLOUDFLARE_PAGES_STORYBOOK_TOKEN` (check with `gh secret list`) is absent, the job must skip cleanly. Report the exact missing grant (a token scoped to `Cloudflare Pages:Edit` on that one project, plus the secret name).
- PRD-19 check name: the job `certify / cert-scene` is defined by QA-032 in `certify-main.yml` (tags: reusable `certify-release.yml`, QA-034). Check with `rg -n "cert-scene" .github/workflows/certify-*.yml`. If it's absent, still land SB-004 failing closed. `deploy-pages` stays blocked and the report says so.
- `release/4.x`: `git ls-remote --heads origin release/4.x`. If PRD-REL hasn't created it (branch policy REL-054, `PROMPT_01c_REL_CLASSIFY_BRANCH.md`), SB-013 and SB-017 are blocked (task `gate` field).

## 4. Steps
1. **SB-010 `write-build-manifest.mjs`**: writes `storybook-static/ag-build.json` = `{ sha, dirty, builtAt, storybookVersion, packageVersion, storyCount, indexSha256 }`. Get `sha` from `git rev-parse HEAD` and `dirty` from `git status --porcelain` (non-empty means true). Read `storybookVersion` from `node_modules/storybook/package.json`, `packageVersion` from `package.json`, and `storyCount` as the count of `index.json` entries with `type: "story"`. `indexSha256` is the sha256 of the `index.json` bytes. Add `"postbuild-storybook": "node scripts/storybook/write-build-manifest.mjs"` (npm runs it automatically after `build-storybook`).
2. **SB-011 `verify-fresh.mjs [dir=storybook-static]`**: exits 1 with a one-line reason unless the manifest exists, `sha === git rev-parse HEAD`, `dirty === false` when `CI=true`, and `indexSha256` matches. **SB-012** `verify-fresh.test.mjs` (`node --test`) uses temp-dir fixtures for: pass; missing manifest; SHA mismatch; dirty in CI; dirty allowed locally; index hash mismatch. Add a deliberately stale build negative case (AC-SB-15).
3. **SB-008 `check-build-log.mjs <log>`**: fails on Storybook build output lines about duplicate story ids, missing/unknown story ids, `Failed to resolve import`, `Could not resolve`, and `[vite]` unresolved-import warnings. Prints the matching lines. **SB-009** tests it against real-format fixture logs (1 clean, 1 per failure class). Never pass `--quiet` to the build.
4. **SB-001/002/003/004/005/006 rewrite `deploy-storybook.yml`**:
   - Top-level `permissions: contents: read`. Triggers: `push` to `main`, `push` tags `v5.*`, `pull_request` to `main`. Drop `develop`; it has no remote branch.
   - `build`: checkout, setup-node 20 with npm cache, `npm ci`, `npm run build-storybook 2>&1 | tee sb-build.log`, `node scripts/storybook/check-build-log.mjs sb-build.log`, `node scripts/storybook/verify-fresh.mjs`, then upload artifact `storybook-${{ github.sha }}` (retention 30).
   - `storybook-tests`: `uses: ./.github/workflows/storybook-tests.yml`. **SB-002** creates that file with `on: workflow_call` and `pull_request`, one job that downloads the artifact, runs `verify-fresh.mjs` and records build time (≤6 min target, §16). 17b adds the Vitest job.
   - `cert-scene-gate` (job-level `checks: read`): `gh api repos/${{ github.repository }}/commits/${{ github.sha }}/check-runs --jq '.check_runs[] | select(.name=="certify / cert-scene") | .conclusion'` must equal `success`; otherwise exit 1.
   - `deploy-pages`: `if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/tags/v5.'))`, `needs: [build, storybook-tests, cert-scene-gate]`, job-level `pages: write` and `id-token: write`, `environment: github-pages`. It runs `assemble-pages.mjs` (step 5), then `actions/upload-pages-artifact` and `actions/deploy-pages`. Set the custom domain `storybook.aura-glass.auraone.com` (from the old `:40` `cname`) as a `CNAME` file in the assembled root. Remove `peaceiris/actions-gh-pages` and every `contents: write` grant.
   - `release-asset` (tags only; job-level `contents: write`, `if: startsWith(github.ref, 'refs/tags/v5.')`): tar the build as `storybook-static-<version>.tar.gz` and `gh release upload`.
   - `deploy-preview` (**SB-005**): `if: github.event_name == 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository`. A first step sets an output from `${{ secrets.CLOUDFLARE_PAGES_STORYBOOK_TOKEN != '' }}`; later steps run only when it is true. Use `cloudflare/wrangler-action` pinned by full commit SHA with `command: pages deploy storybook-static --project-name=auraglass-storybook --branch=pr-${{ github.event.number }}`. The comment step (job-level `pull-requests: write`) posts `steps.<id>.outputs.deployment-url`. A fork PR's comment gives only the artifact link and runs no secret-bearing step.
5. **SB-006 `assemble-pages.mjs`**: builds `_site/` with `/next/` (this build on `main`), `/v5/<version>/` for every `v5.*` release asset (downloaded with `gh release download --pattern 'storybook-static-*.tar.gz'`, never with Actions artifacts), `/latest/` (a copy of the highest non-prerelease `v5.*` by semver), `/v4/` (from release asset `storybook-static-4.x.tar.gz`), root `index.html` redirecting to `/latest/` (to `/next/` until a non-prerelease exists), `CNAME`, and `redirects.json`. Fail if `/v4/` is missing so the first deploy can't erase the 4.x site. **SB-007** `.storybook/redirects.json` maps the 50 most-linked 4.x story ids (gathered with `rg -o "\?path=/(story|docs)/[a-z0-9-]+" README.md docs/ -g '!docs/auraglass-5/**'`, ranked by count) to 5.0 ids, or to `start-here--page` with `moved=1` when there's no successor. `.storybook/manager-head.html` contains only the redirect lookup script. `assemble-pages.test.mjs` covers layout, latest selection, a missing-v4 failure and the redirect file.
6. **SB-015 `forbidden-check.js`**: add a check that fails when `git ls-files storybook-static` prints anything. Keep the existing ignore at `:20`.
7. **SB-013/014 readers (SC-09)**: SB-013 is `release/4.x` only: run `verify-fresh.mjs` before the `http-server storybook-static` line (`:109`) of `scripts/visual-test-runner.js` and abort if it fails (lands with SB-017). SB-014 is a read-only contract check on `main`: `deploy-workflow.test.mjs` parses QA's `.github/workflows/certify-pr.yml` and asserts its `build-storybook` job (QA-031) runs `node scripts/storybook/verify-fresh.mjs storybook-static` before any upload/serve, and that no `main` workflow references `visual-regression.yml`. If QA-031 lacks the step, report a PRD-QA defect; don't edit the file.
8. **SB-016**: remove `audit:storybook:presentation` from `package.json` and delete `scripts/audit/story-presentation-audit.js`. Then `rg -n "storybook-visual-certification|story-presentation-audit" package.json .github .storybook` must print nothing (REQ-SB-41). Its replacements are 17b's `lint-titles.mjs`/`lint-story-copy.mjs` and 17e's `storybook-index.test.mjs`. Record which checks are temporarily uncovered until those land.
9. **SB-018 `deploy-workflow.test.mjs`** (`node --test`, `yaml` exact-pinned devDependency) parses both workflow files and asserts:
   - top-level permissions are exactly `{contents: read}`;
   - every job with any `write` permission has an `if` that restricts it to push/tag or same-repo PR;
   - `deploy-pages.needs` ⊇ {build, storybook-tests, cert-scene-gate};
   - the preview comment body references `steps.*.outputs.deployment-url`;
   - no step in a job reachable by fork PRs references `secrets.*` other than `GITHUB_TOKEN`;
   - `peaceiris` is absent;
   - tags `v5.*` trigger `release-asset`;
   - `assemble-pages.mjs` is invoked and uses `gh release download`.
10. **SB-019 PRD-19 consumers**: check that `certification/playwright.cert.config.ts` `webServer.command` (QA-018) and the REQ-QA-60..64 offline-bundle builder (QA-021) call `scripts/storybook/verify-fresh.mjs`. You may not edit them. If they don't, report a PRD-19 defect with the file and line.
11. **SB-017 back-port to `release/4.x`** (separate PR, only if the branch exists): top-level `contents: read`, job-scoped writes, the manifest, verify-fresh and forbidden-check additions, the SB-013 `visual-test-runner.js` guard and a `verify-fresh.mjs` step before `npx serve -s storybook-static` (`:36`) in that branch's `visual-regression.yml` (TRUST-062's evidence-only edit is the only other change to that file). Make no story or visual change (D-27 visual-class gate). Also produce `storybook-static-4.x.tar.gz` from that branch's build and attach it to a `v4-storybook` GitHub release. That is the frozen `/v4/` input.

## 5. Tests to run
Local (light, Node only): `node --test tests/storybook/verify-fresh.test.mjs tests/storybook/check-build-log.test.mjs tests/storybook/deploy-workflow.test.mjs tests/storybook/assemble-pages.test.mjs`, then `node scripts/ci/forbidden-check.js`. Remote: push a branch and open a same-repo PR. Attach the URLs for the `deploy-storybook` run (build, check-build-log, verify-fresh, artifact) and the `storybook-tests` run. Never run `build-storybook` locally as evidence.

## 6. Visual evidence
None; this prompt changes no pixels. AC-SB-16 is verified after the first `v5.*` tag: `curl -s https://storybook.aura-glass.auraone.com/v5/<version>/ag-build.json | jq -r .sha` must equal `git rev-list -n1 v<version>`.

## 7. Integrity rules (binding)
Don't mark the preview as working when the secret is absent. A skipped job with no comment is the correct outcome. Never post a constructed URL. Don't weaken the cert-scene gate (no `continue-on-error`, no `|| true`). Don't run `assemble-pages` without `/v4/`. No `test.skip`/`.only`. Don't commit `storybook-static/`. Don't create, print or copy credentials, and don't run login, refresh or setup scripts. No local Docker and no local browser.

## 8. Exit criteria
- AC-SB-14: `deploy-workflow.test.mjs` green in CI. A PR run shows no write token at top level. A same-repo PR comment URL returns HTTP 200 (`curl -o /dev/null -w '%{http_code}'`), or no comment is posted.
- AC-SB-15: every reader present in the repo runs `verify-fresh.mjs`. The stale-build negative test fails as designed. `git ls-files storybook-static | wc -l` = 0.
- AC-SB-16: the procedure in §6 is documented, and the result is recorded at the first tag (or marked pending-tag).
- AC-SB-17 (this half): `rg` from step 8 prints nothing.
- REQ-SB-54: `check-build-log.mjs` runs in `build` and fails on every fixture class.

## 9. Final report format
```
PROMPT-17a REPORT
Branch/SHA:
Tasks: SB-001..SB-019 -> done|blocked (reason) each
Cutover actions recorded (not executed): Pages build_type, Cloudflare token grant
Prereq blockers: (exact command + output)
Tests: name -> pass/fail (local|remote run URL)
Evidence: deploy-storybook run URL, storybook-tests run URL, artifact name, preview URL/HTTP code or "skipped: secret absent"
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
