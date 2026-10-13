# PROMPT-1 (PLAT): AuraGlass Platform and Release stream — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1, key PLAT, REQ-PLAT-01..106, AC-PLAT-01..33).
Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`; it wins over the PRD and over every prompt).
Decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` D-01..D-32 (its §16 decomposition is replaced).
Task fragment: `docs/auraglass-5/tasks/PLAT.json` (PLAT-001..PLAT-402, 402 tasks; field `lane` selects the prompt).
Archived specifics reused: `docs/auraglass-5/archive/v1-19-prd/prompts/PROMPT_0{0,1,2}*`, `PROMPT_08f*`, `PROMPT_18*`/DX prompts; archived ids are kept in each task's `source` field.
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`.

PLAT owns the whole `release/4.x` line (4.1.1 trust patch, 4.2/4.3/4.4 bridge, LTS), the 5.0 build and artifact gates, GitLab CI/CD and npm publishing, change control and deprecations, compat composition, the `migrate 4to5` engine and CLI, the registry, the docs site and agent DX, and the deletion of `legacy/**`. It is split into six lanes. **All six start on day 0 and run at the same time; their files are disjoint; no lane waits for another lane or for any other stream.**

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). Every PLAT lane starts on day 0; no other PRD, stream or task has to finish first.

## Lane table

| Prompt | Lane | Branch prefixes | REQ-PLAT (primary) | AC-PLAT | Tasks |
|---|---|---|---|---|---|
| `Work package 1a` | 1a-CI: GitLab CI/CD, Pages, npm publishing | `next-plat/ci-*`, `4x-plat/ci-*` | 01–17, 51 | 01, 02, 03, 14, 18 (dist-tags), 31 (publish docs), 33 | PLAT-001..054 |
| `Work package 1b` | 1b-4X: 4.1.1 trust patch, 4.2/4.3 bridge, frozen fixture | `4x-plat/4x-*` (release/4.x only) | 37–50, 52–63 | 01–13, 15–17, 20 | PLAT-055..167 |
| `Work package 1c` | 1c-REL: change control, deprecations, ledger, train, removal RM-01..12 | `next-plat/rel-*`, `next-plat/rm-<nn>-*`, `4x-plat/rel-*` | 18–36, 79–82 | 15–19, 23, 32 | PLAT-168..241 |
| `Work package 1d` | 1d-BUILD: 5.0 build, exports, artifact gates, CSS, canaries | `next-plat/build-*`, `next-plat/canary-*` | 64–78 | 22–27 | PLAT-242..298 |
| `Work package 1e` | 1e-CLI: `@auraglass/cli`, `migrate 4to5`, type DX | `next-plat/cli-*` | 84–93 | 20, 21, 31 (CLI) | PLAT-299..349 |
| `Work package 1f` | 1f-DX: registry, docs site, claims, llms.txt, MCP, RM-13 | `next-plat/dx-*`, `next-plat/rm-13-*` | 83, 94–106 | 28–30, 31 (registry, MCP) | PLAT-350..402 |

REQ coverage check: every REQ-PLAT-01..106 is primary in exactly one lane (01–17 and 51 → 1a; 37–50 and 52–63 → 1b; 18–36 and 79–82 → 1c; 64–78 → 1d; 84–93 → 1e; 83 and 94–106 → 1f). A REQ may also appear in another lane's task where that lane owns one file the REQ touches (for example REQ-PLAT-12: the guard script is 1a's, the `prepublishOnly` wiring is 1b's on `release/4.x` and 1d's on `next`). `tasks/PLAT.json` covers all 106 (`reqs` field).

## Worktrees and branches

```
git fetch origin
git worktree add ../AuraGlass.wt/plat-ci     -b next-plat/ci-bootstrap    origin/next        # 1a (also 4x-plat/ci-* from origin/release/4.x)
git worktree add ../AuraGlass.wt/plat-4x     -b 4x-plat/4x-pack-fix        origin/release/4.x # 1b
git worktree add ../AuraGlass.wt/plat-rel    -b next-plat/rel-policy       origin/next        # 1c
git worktree add ../AuraGlass.wt/plat-build  -b next-plat/build-skeleton   origin/next        # 1d
git worktree add ../AuraGlass.wt/plat-cli    -b next-plat/cli-core         origin/next        # 1e
git worktree add ../AuraGlass.wt/plat-dx     -b next-plat/dx-registry      origin/next        # 1f
```

Each lane opens PRs on GitHub (`github.com/auraoneai/auraglass`) against `next` or `release/4.x` and merges independently after its own SHA's GitLab pipeline succeeded. The branch prefix `next-plat/` / `4x-plat/` is what `contract:ownership` reads; the lane name after it is a convention only.

## File ownership per lane

**On `next`** (first match wins, after the contract's rows; anything not listed here that PLAT owns falls to 1c):

| Lane | Paths |
|---|---|
| 1a | `.gitlab-ci.yml`; `ci/plat.gitlab-ci.yml`; `ci/plat/**`; `fragments/lanes/plat.ts` and any other `fragments/<kind>/plat.ts` not listed below; `.github/**` except `workflows/mirror-to-gitlab.yml` and `CODEOWNERS` (deletion of the five workflows, templates); `.gitlab/**`; `scripts/ci/{verify-ownership,verify-ci-fragments,gitlab-status,assemble-pages}.mjs`; `scripts/ci/require-ci-publish.js`; `scripts/ci/README.md`; `scripts/release/{publish,verify-release-verdict,dist-tag,dry-run,sync-fragments,verify-branch-protection}.mjs`; `scripts/publish-307-after-npm-login.sh`, `scripts/configure-npm-trusted-publishing-307.sh` (delete); `tests/ci/{root-pipeline,no-github-ci,verify-ownership,verify-ci-fragments,plat-fragment,gitlab-status,assemble-pages,decision-records,no-forward-merge}.test.ts` and `tests/ci/fixtures/{ci-fragments,gitlab-api}/**`; `tests/release/{sync-fragments,publish,prepublish-guard,tag-pipeline,dist-tag,publishing-docs,release-job,branch-protection}.test.ts`; `docs/release/branch-policy.md`; `docs/release/decisions/{gitlab-project-settings,gitlab-ci-verification,npm-trusted-publishing,npm-scope}.md` |
| 1b | nothing on `next` (it works only on `release/4.x`) except `fragments/deprecations/plat.ts`, which reaches `next` only through the fragment-sync PR |
| 1c | `scripts/release/**` except 1a's files; `scripts/release/lib/**`; `scripts/build/api-report.mjs`; `api-extractor.base.json`; `etc/api/**` tooling and config (not other owners' reports, not `etc/api/cli.*`); `docs/release/**` except 1a's and 1b's files; `docs/release/decisions/{5.0.0-gates,rollback-drill,change-class-canary}.md`, `docs/release/decisions/downstream-*.json`, `docs/release/decisions/removals/RM-0[1-9].json`, `RM-1[0-2].json`; `docs/schemas/**`; `docs/release-rollback-deprecation.md`; `docs/inventory/component-dispositions.md`; `src/internal/**`; `src/compat/plat/**`; `tests/{release,deprecations,compat,removal}/**` except 1a's and 1b's files; `tests/docs/runbook.test.ts`; `scripts/removal/**`; `legacy/**` except `legacy/tests/**`; root 4.x assets (`server/`, `Dockerfile`, `docker-compose*.yml`, `nginx.conf`, `tsconfig.server.json`, `workers/`, `bin/`, `examples/`, `visual-baselines/`, `reports/`, root probe `*.mjs`, `.dockerignore`, `.env.example`); `.gitignore`; `SECURITY.md`; `CONTRIBUTING.md`, `LICENSE`; `tools/**`; `scripts/{ensure-component-inventory,complete-100-percent-migration,mass-fix-undefined-access,build-tokens}.js`; Z01 fallback paths |
| 1d | `package.json`, `package-lock.json` (scripts, exports generation, `files`, `sideEffects`, engines; dependency sets only through contract PRs); `CHANGELOG.md` (release commits); `tsconfig*.json` (not `tsconfig.storybook.json`); `tsdown.config.ts`; `vite.config.ts`; `.dependency-cruiser.js`, `.npmignore`, `.prettierrc`, `.husky/**`, `.eslintignore`, `patches/**`; `eslint.config.js`, `eslint-plugin-auraglass.js` (verbatim) and deletions `rollup.config.js`, `.eslintrc.js`, `.bundlesizerc`, `scripts/{build-all,postbuild-client,build-workers}.js`; `build/**`; `scripts/build/**` except `api-report.mjs`; `scripts/ci/{verify-deps,verify-side-effects,verify-size-budgets,measure-node-import,verify-compiler}.mjs`; `scripts/ci/verify-pack.js`; `scripts/ci/lib/**`; deletions `scripts/ci/{verify-tree-shaking,verify-no-core-ui-deps,run-next-integration,run-vite-integration}.js`, `scripts/ci/check-undefined-custom-props.mjs`; `fragments/{size-budgets,css,side-effects}/plat.ts`; `lint/rules/plat/**`; `src/compat/css/**`; `docs/dependency-allowlist.json` (verbatim); `docs/size-budgets.json` (gen), `docs/size-budgets.changelog.md`; `canaries/**` except other streams' page directories; `tests/{build,exports,side-effects,deps,react19,css,pack}/**`; `tests/rsc/plat/**`; `tests/lint/plat/**` |
| 1e | `packages/cli/**`; `fragments/codemods/plat.ts` and `fragments/codemods/plat/**`; `etc/api/cli.*`; `tests/types/plat/**`; `tests/dx/{codemod-canary.spec.ts,codemod-perf.test.ts,audit-backdrop.remote.spec.ts}`; `tests/dx/fixtures/{recipes-4x,large-tree}/**`; deletions `scripts/migrate/**`, `scripts/codemods/**`, `tools/codemods/**`, `scripts/ci/{verify-cli,verify-recipes-cli}.js` |
| 1f | `apps/docs/**` (only `content/plat/**` inside `content/`); `scripts/docs/**`; `scripts/registry/**`; `registry/**` except other owners' `blocks/<id>`/`items/<id>` (PLAT: `blocks/{auth,settings}`, `items/{code-surface,diff-viewer,gantt,kanban,react-hook-form,rich-text,transfer-list}`); `packages/{registry,mcp}/**`; `README.md`, `README.tmpl.md`, `llms.txt`, `llms.txt.tmpl`; `.lighthouserc.js`; `stories/plat/**`; `docs/{quickstart,guides,migration}/**`; `docs/inventory/registry-recipe-fates.json`; `docs/release/decisions/removals/RM-13.json`; RM-13 paths (`docs/components/**`, the listed 4.x docs, `INSTALLATION.md`, `legacy/tests/**`); `scripts/ci/verify-markdown-links.js`; deletion `scripts/ci/verify-recipes-render.js`; `tests/{registry,docs}/**` except `tests/docs/runbook.test.ts`; `tests/dx/**` except 1e's files |

**On `release/4.x`**: lane 1b owns every PLAT path (on that branch PLAT owns everything except other streams' `fragments/{deprecations,codemods}/<s>*`, `ci/<s>.gitlab-ci.yml`, `ci/<s>/**` and row H), **except** the line-neutral files that another lane lands identically on both lines by cherry-picking its own commits: 1a's CI files above (incl. `ci/plat.gitlab-ci.yml` with both `4x` and `5x` rules), 1c's `scripts/release/**` (except 1a's), `scripts/release/lib/**`, `scripts/build/api-report.mjs`, `api-extractor.base.json`, `docs/release/{change-classes,lts-policy,train}.md`, `docs/release/*.json`, `docs/schemas/**`, `docs/release-rollback-deprecation.md` and their tests; 1d's `src/compat/css/globals.css`; 1e's `packages/cli/**` (needed for the 4.3 `@auraglass/cli@0.x` publish). 1b owns `docs/release/decisions/4.*.md`, `docs/release/visual-fixes/**`, `docs/security/**` and `tests/{ci,release,deployment,eslint,docs}/**` files it creates there.

Seam-file policy (contract rule 4): **single owner, no identical adds.** Every seam file is created once by C0; PLAT never creates a file another stream or another PLAT lane also creates. Formerly shared files are generators over per-owner fragments (`loadFragments`, S-50) or discovered inputs.

## PLAT internal seams (frozen here so lanes never wait for each other)

**Job → entry point table.** Lane 1a writes every job in `ci/plat.gitlab-ci.yml`; each job calls only these entry points, implemented by the lane named. Until an entry point exists the job is `allow_failure: true` and reports its absence; the C0 seed jobs (`plat:build:dist`, `plat:package:pack`, `plat:gate:glass-quality`, `plat:gate:change-class`, `plat:integration:next`, `plat:integration:vite`, `plat:build:docs`, `plat:publish:npm`, `pages`) already run the 4.1.0 commands on `4x`, so 1b's tests run from day 0.

| Job | `4x` entry point (owner 1b unless noted) | `5x` entry point (owner) |
|---|---|---|
| `plat:build:dist` | `npm run build` (4.1.0) | `npm run build` (1d) |
| `plat:gate:glass-quality` | `npm run typecheck && npm run lint:check && npx jest --ci && npm run verify:css-vars && node scripts/ci/verify-tree-hygiene.js && node scripts/ci/verify-docs-claims.js && node scripts/ci/verify-import-side-effects.js` | `npm run typecheck && npm run lint && npx jest --ci tests/{build,exports,deps,pack,side-effects,react19,css,release,ci,docs,dx,registry,compat,deprecations,removal} tests/{rsc,lint,types}/plat` (each lane its dirs) `&& npm run artifact:publint && npm run artifact:attw && node scripts/ci/verify-size-budgets.mjs && node scripts/ci/verify-deps.mjs && node scripts/ci/verify-side-effects.mjs` (1d) |
| `plat:test:pack-matrix` | prepublishOnly equivalent (REQ-PLAT-38) | — |
| `plat:test:react19` | `react19-smoke`, `unit-react19` legs (REQ-PLAT-47) | — |
| `plat:test:visual-4x` | `npm run test:visual:app-chrome -- --class-report .artifacts/plat/visual-4x/visual-class.json` | — |
| `plat:package:pack` | `node scripts/release/dry-run.mjs --tag` (release scope, 1a) then `npm pack --pack-destination .artifacts/pack` | same + `npm pack -w packages/{cli,registry,mcp,labs}` |
| `plat:gate:change-class` | `node scripts/release/classify-change.mjs --base <prev> --line 4x` (1c) | `--line 5x` (1c) |
| `plat:integration:next` / `:vite` | `npm run test:integration:{next,vite} -- --skip-build` | `canaries/{next16,next15}` / `canaries/{vite,vite-tailwind4}` specs (1d) |
| `plat:test:canaries` | — | `canaries/{vite-compiler,types-strict,jest-cjs}` + `node scripts/ci/verify-compiler.mjs` (1d) |
| `plat:test:cli` | `npx jest packages/cli` (1e, from 4.3) | `npx jest packages/cli tests/types/plat` + `tests/dx/codemod-canary.spec.ts` (1e) |
| `plat:test:registry` | — | `node scripts/registry/build.mjs && node scripts/registry/lint.mjs` + `tests/dx/registry-{render,shadcn-interop}.spec.ts` (1f) |
| `plat:test:docs` | — | `node scripts/docs/compile-snippets.mjs` + `tests/dx/{quickstart,plain-css,docs-a11y,docs-lighthouse}.spec.ts` (1f) |
| `plat:gate:removal` | — | `node scripts/removal/gen-component-dispositions.mjs --check && node scripts/removal/consumer-grep.mjs --verify` + revert dry-run (1c) |
| `plat:build:docs` | 4.x Storybook/docs build | `npm run docs:build` → `apps/docs/out/` (1f) |
| `pages` | `node scripts/ci/assemble-pages.mjs` (1a) | same |
| `plat:release:notes` | `node scripts/release/release-notes.mjs` (1c) | same |
| `plat:publish:npm` | contract §4.13.7 verbatim (1a) | same |
| `plat:release:verify-dist-tags`, `plat:audit:backdrop` | manual (1a; audit config 1e) | manual |

**Pre-declared content of `fragments/lanes/plat.ts`** (owned by 1a; subjects owned by other lanes are listed verbatim so nobody else edits it): L1 ← `lint/rules/plat/*.cjs`, `tests/lint/plat/**`; L2 ← `tests/{pack,build,exports,deps,side-effects,css}/**`; L3 ← `tests/release/classify-change.test.ts`, `tests/deprecations/prior-deprecation.test.ts`; L11 ← `canaries/{next16,next15,vite,vite-tailwind4,vite-compiler,types-strict,jest-cjs}`, `tests/fixtures/consumer-4x`, `tests/dx/codemod-canary.spec.ts`, `tests/dx/registry-render.spec.ts`, `tests/dx/quickstart.spec.ts`. A missing subject is `pending`.

**Pre-declared `.gitignore` additions on `next`** (owned by 1c): `/reports/`, `/.artifacts/`, `/probe-*.mjs`, `/*-probe*.mjs`, `/deprecations.json`, `/registry/registry.json`, `/packages/cli/src/migrate/4to5/mappings/`, `/apps/docs/out/`, `/apps/docs/generated/`, `/apps/docs/public/r/`, `/public/`, `/dist-maps.tgz`, `/storybook-static/`.

**Late task-level edges between PLAT lanes** (all `PLAT-NNN`; none blocks a lane from starting; each consumes a finished tool, not a design): PLAT-135 ← 175, 177 (4.1.1 API baseline uses 1c's report tools); PLAT-137 ← 035, 179; PLAT-139 ← 015, 034 (4.1.1 tag needs the flipped gates and the publish job); PLAT-145 ← 212; PLAT-148 ← 179; PLAT-151 ← 188; PLAT-159 ← 314 (4.x `doctor --v5` port); PLAT-162 ← 194, 349 (4.3 gate); PLAT-295 ← 056, 060 (forward-port of 4.x helpers); PLAT-298 ← 040; PLAT-396 ← 179; PLAT-402 ← 223.

## Contract seams per lane and day-0 stubs

| Lane | Consumes | Tests against before the real code lands |
|---|---|---|
| 1a | S-43, S-48, S-52, S-53, S-54, S-55, S-36 | the C0 root pipeline and seed fragments; `tests/contract-doubles/reports/release-verdict.json`; recorded GitLab API fixtures |
| 1b | S-22 (4.x provider `preview`), S-38, S-47, S-50; row H01–H03 paths | 4.1.0 code itself; row-H-absent fixture (REQ-PLAT-60) |
| 1c | S-35, S-37, S-38, S-39, S-50, S-55, S-30 | `tests/contract-doubles/fragments/` (one valid fragment per kind), `tests/contract-doubles/reports/visual-class.json`, compat seeds |
| 1d | S-01..S-06, S-10, S-11, S-22, S-31, S-35, S-36, S-43..S-45, S-47, S-49, S-50, S-52 | seeds (`src/material/index.ts`, `src/theme/index.ts`, one CMP seed), `contracts/stubs/reference.css`, `tests/contract-doubles/tokens/manifest.json`, `npm run tokens:build` seed |
| 1e | S-05, S-06, S-22, S-30, S-31, S-35, S-36, S-38, S-39, S-46, S-49, S-50 | codemod fragment doubles, `tests/contract-doubles/cmp/*`, the frozen 4.x fixture (read-only) |
| 1f | S-01, S-06, S-10, S-11, S-21, S-24, S-30, S-31, S-33, S-35, S-37..S-44, S-46, S-51, S-55 | CMP/MAT seeds, `tests/contract-doubles/{cmp,tokens,reports}/*`, `.storybook/blocks/index.tsx` seed, `tests/dx/fixtures/alpha-smoke/` |

Stubs and doubles are test inputs only: shipping one as an implementation, or importing one from `src/**`, fails `contract-boundary` and is forbidden.

## Common rules (restated inside every lane prompt)

1. Precedence: Gurbaksh's live instructions → the frozen contract → PRD-1 → the lane prompt. A needed contract change is a `contract/` PR, never an edit in a stream branch.
2. Concurrency: start on day 0 with only C0 merged; never wait for MAT, CMP, SURF, QUAL or another PLAT lane. Absent inputs are `pending`, never a failure and never faked.
3. Ownership: touch only the lane's "May touch" list; `contract:ownership` must pass. Changesets are `.changeset/plat-<lane>-<topic>.md`.
4. CI/CD is GitLab CI only (project 87152036, `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass`). Never create or edit `.github/workflows/*`; `mirror-to-gitlab.yml` is org-managed and untouched (OD-8). No job reads GitHub. A PR merges on GitHub only after `node scripts/ci/gitlab-status.mjs --sha <head>` reports success (URL in the PR). Branch pushes reach GitLab at the next `main` push or the daily 05:23 UTC reconcile (W-6); nobody pushes to the mirror.
5. Remote-first: no Docker, Playwright/Chromium, Storybook build, full `npm run build`, full `jest --ci`, `next build`, canaries or pack matrices on the Mac. They run in GitLab jobs on SaaS runners (`mcr.microsoft.com/playwright:v1.63.0-noble` for browser jobs); device lanes only on the gated AWS runner tag `auraglass-aws-remote`. Locally allowed: bounded `rg`, `git`, `node -e` over JSON, `eslint` on touched files, `jest` on one named node/jsdom test file.
6. Forbidden: fake, mock or placeholder implementations reported as done; shipping a contract seed or stub; `test.skip`/`it.skip`/`xit`/`.only`/`--passWithNoTests`; `|| true`, `--no-verify`; `allow_failure: true` on a flipped required job; lowering any threshold, budget or count; `jest -u`, `--updateSnapshot` or Playwright `--update-snapshots` to make a test pass (single reviewed exception: PLAT-069); mocks in specs marked "no mocks" or "remote".
7. Evidence is GitLab job artifacts under `.artifacts/plat/<job-slug>/` with `expire_in`; never committed (D-32). Only decision records are committed.
8. Credentials stay in provider stores: no `NPM_TOKEN`/`NODE_AUTH_TOKEN`/`GH_TOKEN` exports, no login/logout/refresh of npm, gh, glab; publishing only through `plat:publish:npm` with GitLab OIDC. Owner-only steps are recorded in the release issue with the exact action needed.
9. Commits: conventional commits; `!` only for C-B on `next`, never on `release/4.x`; trailers `Multi-Family:` and `Perf-Budget-Raise:` where required; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.
10. Task status is reported in the PR body and the final report; `tasks/PLAT.json` is edited only by the planning steward (then `node docs/auraglass-5/tools/build-tasklist.mjs`).

## External gates and owner decisions (never `depends_on`)

GHSA publication before `v4.1.1` (PLAT-127); OD-10 npm trusted publishing re-pointed to GitLab (PLAT-044); D-23 npm scope (PLAT-045); D-31 font licence (PLAT-128); OD-8 replace the `mirror-to-gitlab` GitHub Action with GitLab pull mirroring (zero GitHub Actions, removes W-6); OD-9 GitLab → GitHub status; OD-11 project settings (PLAT-025); OD-12 custom domain; OI-1 GitLab Release objects in the mirror; OI-3 install-level C-D; CP-PLAT-1 workspace dependencies (PLAT-300), CP-PLAT-2 PRD path row A18, CP-PLAT-3 `setDeprecationMode` (PLAT-186); G-07, G-12, G-14 release gates; D-26 calibration.

## Final program report (release owner)

One table AC-PLAT-01..33 → status, evidence (GitLab pipeline or artifact URL), SHA, lane; the open owner decisions; the six lane reports linked; confirmation that REQ-PLAT-01..106 are done with their named tests green in the GitLab pipeline of the relevant line.

---

## How to run this prompt

This is the only prompt for this PRD. Give the whole file to one agent. The 6 work packages below touch disjoint files and none waits on another, so an agent that can spawn subagents should run them in parallel (one subagent per work package). Otherwise do them in the order listed. The stream is done when every work package's exit criteria are met.

---

## Work package 1a: CI

### PROMPT-1a (PLAT): GitLab CI/CD, Pages and npm publishing

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §4.1, §4.2, §5.1, §5.2, REQ-PLAT-51, §12.1 (`tests/ci`, `tests/release` publish rows), §19 (S-53, S-54), §22 (OD-8..OD-12, OI-1, OI-2).
Requirements: REQ-PLAT-01..17, REQ-PLAT-51; job definitions for REQ-PLAT-38, -47 and the `plat:test:visual-4x` producer used by REQ-PLAT-20.
Acceptance: AC-PLAT-01 (publish job half), AC-PLAT-02, AC-PLAT-03, AC-PLAT-14, AC-PLAT-18 (dist-tag logic), AC-PLAT-31 (publishing docs), AC-PLAT-33.
Tasks: PLAT-001..PLAT-054 (`lane: "1a-CI"`) in `docs/auraglass-5/tasks/PLAT.json`.
Index (lane table, ownership, job → entry point table, common rules): `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: `archive/v1-19-prd/prompts/PROMPT_00g_TRUST_RELEASE.md`, `PROMPT_01b_REL_PUBLISH_LEDGER.md`, `PROMPT_01f_REL_TRAIN_OPS.md` (every GitHub Actions step replaced by its GitLab equivalent, contract §4.13.1 table).
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-ci`; branches `next-plat/ci-<topic>` from `origin/next` and `4x-plat/ci-<topic>` from `origin/release/4.x` (this lane's files are line-neutral: land the same commits on both lines).

#### Common rules (binding)

1. Precedence: Gurbaksh's live instructions → `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (contract-v1.1) → PRD-1 → this prompt. A needed change to `.gitlab-ci.yml` beyond the five settable values, to §4.13 job contracts or to `CI_JOBS`/`REQUIRED_JOBS` is a `contract/` PR.
2. Concurrency: start on day 0 with only C0 merged. Do not wait for any stream or PLAT lane; other lanes' entry points are called by name from the job table in the index; a missing entry point leaves its job `allow_failure: true` and reporting.
3. Ownership: only the "May touch" list; `contract:ownership` must pass; changesets `.changeset/plat-ci-<topic>.md`.
4. GitLab CI only. Never create or edit any `.github/workflows/*` file other than deleting the five listed; never touch `mirror-to-gitlab.yml`; no job reads PR labels or calls GitHub; merge only after `node scripts/ci/gitlab-status.mjs --sha <head>` succeeds; nobody pushes to the GitLab mirror (W-6: ask the owner to dispatch the mirror if a branch pipeline is late).
5. Remote-first: every pipeline run happens on GitLab SaaS runners; nothing heavy, no Docker and no browser on the Mac. Locally: bounded `rg`, `git`, `node -e`, `npx eslint <files>`, `npx jest <one test file>`.
6. Forbidden: placeholder jobs reported as working; `|| true`, `--no-verify`, `allow_failure: true` on a flipped required job; lowering thresholds; skipped or `.only` tests; snapshot updating; shipping a contract stub.
7. Evidence only as artifacts under `.artifacts/plat/<job-slug>/` with `expire_in`; only decision records are committed.
8. Credentials: no `NPM_TOKEN`, `NODE_AUTH_TOKEN`, `GH_TOKEN`, `CI_JOB_JWT`; `plat:publish:npm` uses only `id_tokens` (`NPM_ID_TOKEN`, `SIGSTORE_ID_TOKEN`); `glab` and `gh` only with existing logins, never login/refresh; owner steps go to the release issue.
9. Conventional commits, no `!`; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

#### Prerequisites

None except the frozen contract and C0. Verify before starting:
- `git show origin/next:.gitlab-ci.yml` exists and its body equals contract §4.13.3; `ci/{plat,mat,cmp,surf,qual}.gitlab-ci.yml` seeds exist; `scripts/ci/verify-ownership.mjs`, `scripts/ci/verify-ci-fragments.mjs` and `contracts/ownership.json` exist (C0-11). If C0 is missing any of these, stop and report the missing C0 item (it is not a stream deliverable).
- `glab auth status` (existing login only) — if absent, every settings task records "missing" instead of applying.

Contract seams consumed: S-53 (root pipeline, fragment rules, `CI_JOBS`, `REQUIRED_JOBS`, artifact paths, environments, Pages layout), S-54 (publish job), S-55 (`ReleaseVerdict`, `VisualClassReport` shapes), S-43, S-48, S-52 (script names), S-36 (package list). Doubles: `tests/contract-doubles/reports/release-verdict.json`, `tests/contract-doubles/reports/visual-class.json`; recorded GitLab API fixtures you capture under `tests/ci/fixtures/gitlab-api/`.

#### May touch

`.gitlab-ci.yml` (five values only), `ci/plat.gitlab-ci.yml`, `ci/plat/**`, `fragments/lanes/plat.ts` (content pre-declared in the index), `.github/workflows/{deploy-storybook,design-system-compliance,glass-pipeline,publish-npm,visual-regression}.yml` (delete only), `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/**`, `.gitlab/**`, `scripts/ci/{verify-ownership,verify-ci-fragments,gitlab-status,assemble-pages}.mjs`, `scripts/ci/require-ci-publish.js`, `scripts/ci/README.md`, `scripts/release/{publish,verify-release-verdict,dist-tag,dry-run,sync-fragments,verify-branch-protection}.mjs`, `scripts/publish-307-after-npm-login.sh` and `scripts/configure-npm-trusted-publishing-307.sh` (delete), the `tests/ci/*` and `tests/release/*` files of PLAT-002..050, `tests/ci/fixtures/{ci-fragments,gitlab-api}/**`, `docs/release/branch-policy.md`, `docs/release/decisions/{gitlab-project-settings,gitlab-ci-verification,npm-trusted-publishing,npm-scope}.md`.

#### Must not touch

`.github/workflows/mirror-to-gitlab.yml`; `.github/CODEOWNERS` and everything CONTRACT-held; other streams' `ci/<s>.gitlab-ci.yml`; `package.json` (prepublishOnly wiring is 1b's on 4.x, 1d's on next); `packages/**/PUBLISHING.md` (package lanes); every script the jobs call that is not in your list (job → entry point table); GitLab mirror settings (OD-8 is the owner's).

#### Steps

1. PLAT-001..002: verify the root pipeline on all three branches, pin `AG_NODE_IMAGE` digest, `AG_NPM_VERSION` exact (>= 11.5.1), `AG_PLAYWRIGHT_IMAGE` = the `@playwright/test` pin; write `tests/ci/root-pipeline.test.ts`.
2. PLAT-003..005: delete any surviving workflow of the five on `main`, `next`, `release/4.x` (one PR per branch); `tests/ci/no-github-ci.test.ts`; rewrite `scripts/ci/README.md` and the PR template for GitLab.
3. PLAT-006..009: complete `verify-ownership.mjs` and `verify-ci-fragments.mjs` (rules 1–9, `no-github-actions`, activation, optional needs, task-graph hook) with one failing fixture per rule.
4. PLAT-010..018: write the full §4.2 job set in `ci/plat.gitlab-ci.yml` (templates `.plat-node`, `.plat-playwright`, `.plat-release`) using the job → entry point table, including `plat:test:pack-matrix` (PLAT-011), `plat:test:react19` (PLAT-012), `plat:test:visual-4x` (PLAT-013), evidence rules (PLAT-017), `ci/plat/activation.json` (PLAT-014) and `fragments/lanes/plat.ts` (PLAT-018). Push to `4x-plat/ci-jobs` first so 1b's 4.1.1 jobs exist early.
5. PLAT-019..021, 030: `gitlab-status.mjs` (no token; public API `GET /api/v4/projects/87152036/pipelines?sha=`), recorded fixtures, `docs/release/branch-policy.md` (merge rule, prefixes, forward-port rule, protection payloads), `no-forward-merge` test.
6. PLAT-022..024: `assemble-pages.mjs`, its test, the `pages` job (environment `pages`, `url: $CI_PAGES_URL`, only on `$AG_PAGES_BRANCH`).
7. PLAT-025..027: apply what the existing `glab` login may change (protected tags `v*`, nightly schedules on `next` and `release/4.x`, Pages public, keep latest artifacts) and record applied/missing; record the four unverified facts from the first pipeline per line.
8. PLAT-028..029: fragment-sync operator chore and its fixture-repo test.
9. PLAT-031..043: `verify-release-verdict.mjs`, `dist-tag.mjs`, `publish.mjs`, `require-ci-publish.js`, `dry-run.mjs --tag`, the verbatim `plat:publish:npm` job, the tag-scope checks inside `plat:package:pack`, the manual dist-tag job, and their tests; delete the two laptop publish scripts.
10. PLAT-044..048: npm trusted-publishing and scope decision records (OD-10, D-23), publishing-docs test, `plat:release:notes` job (GitLab Release via `release:` + `CI_JOB_TOKEN`; OI-1 fallback) and its test.
11. PLAT-049..052: `verify-branch-protection.mjs` (operator, read-only), its test, the owner action to apply protection, OD-8/OD-9 records.
12. PLAT-015: after the first green run per line flip `plat:gate:glass-quality`, `plat:integration:next`, `plat:integration:vite`, `plat:gate:change-class` to `allow_failure: false` with the activation row. No `release/4.x` tag may publish before this.
13. GA only: PLAT-053 (`AG_PAGES_BRANCH: main`, `AG_V4_DIST_TAG: v4-lts`, merge `next` → `main`), PLAT-054 (every `REQUIRED_JOBS` entry `allow_failure: false`; 5.0.0 published only with `ReleaseVerdict.ga === true`).

#### Tests

Node (run in `plat:gate:glass-quality` and `contract:*`): `tests/ci/{root-pipeline,no-github-ci,verify-ownership,verify-ci-fragments,plat-fragment,gitlab-status,assemble-pages,decision-records,no-forward-merge}.test.ts`; `tests/release/{sync-fragments,publish,prepublish-guard,tag-pipeline,dist-tag,publishing-docs,release-job,branch-protection}.test.ts`. Pipeline evidence: the first green pipeline URL per line, the first Pages deploy URL, a `npm publish --dry-run` tag-pipeline run before OD-10 (W-7). Each gate is shown failing once on a deliberate bad input (canary branch), URL recorded.

#### Visual evidence

None (infrastructure). Evidence = pipeline URLs, the Pages URL with `public/storybook/` and `public/lab/` placeholders or content, artifact listings.

#### Exit criteria

- AC-PLAT-14: `.github/workflows/` contains only `mirror-to-gitlab.yml` on `main`, `next`, `release/4.x`; `verify-ci-fragments.mjs` passes on every branch; root pipeline equals the contract with only the allowed values.
- AC-PLAT-02: the `v4.1.1` tag pipeline ran with the four gates at `allow_failure: false`; 0 `|| true`.
- AC-PLAT-03: 0 `NPM_TOKEN`/`NODE_AUTH_TOKEN` references outside the archive; laptop scripts gone; `require-ci-publish.js` exits 1 outside `plat:publish:npm`.
- AC-PLAT-01 (job half): `plat:publish:npm` equals §4.13.7 and produced provenance naming GitLab CI, `chahal-foundation-group/github-auraoneai/auraglass`, `.gitlab-ci.yml`, the tag ref (verified with lane 1b on 4.1.1).
- AC-PLAT-18 (logic half), AC-PLAT-31 (docs half), AC-PLAT-33: as in PRD §17.
- Every PLAT-001..054 task done or listed as blocked with the exact external gate.

#### Final report

```
#### PROMPT_1a report (PLAT CI/CD)
PRs: <urls>   Head SHAs: <next> <release/4.x>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact / Pages URL) |
| AC | Status | Evidence |
GitLab settings applied/missing: <table from gitlab-project-settings.md>
Unverified facts (§4.13): <4 rows with result>
Owner actions open: OD-8, OD-9, OD-10, OD-11 rest, OD-12, OI-1, branch protection
Deviations: <none | text + evidence>
Blockers: <exact error output, action, resource, identity>
```

---

## Work package 1b: 4X

### PROMPT-1b (PLAT): 4.x line — 4.1.1 trust patch, 4.2/4.3 bridge, frozen 4.x fixture

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §3 (4.x end state), §5.4, §5.5, §13.5, §14.1, §15.1, §16 (4.1.1 rows), §11 risks 8–9.
Requirements: REQ-PLAT-37..50, REQ-PLAT-52..63 (plus the 4.x wiring halves of REQ-PLAT-12, -27, -31, -35).
Acceptance: AC-PLAT-01..13 (4.1.1 tag), AC-PLAT-15..17 (4.2/4.3), AC-PLAT-20 (4.x half).
Tasks: PLAT-055..PLAT-167 (`lane: "1b-4X"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: `archive/v1-19-prd/prompts/PROMPT_00a..00g_TRUST_*.md`, `PROMPT_01c_REL_CLASSIFY_BRANCH.md`, `PROMPT_01d_REL_RUNTIME_42.md`, `PROMPT_01e_REL_CONTRACTS_43.md` (their GitHub Actions jobs are GitLab jobs of lane 1a now; their "Must change" registry rows are replaced by the contract).
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-4x`; branches `4x-plat/4x-<topic>` from `origin/release/4.x` only (cut at `v4.1.0` by C0). `main` is frozen; 5.0 work is on `next` and never here.

#### Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt.
2. Concurrency: start on day 0. The 4.x line is intra-stream: on `release/4.x` PLAT owns every path except other streams' `fragments/{deprecations,codemods}/<s>*`, `ci/<s>*` and row H (MAT's bridge content). A row-H input absent at a cut is omitted from that minor, never waited for. Other PLAT lanes' tools are consumed only through the late task edges listed in the index (PLAT-135, 137, 139, 145, 148, 151, 159, 162).
3. Ownership: lane 1b owns every PLAT path on `release/4.x` except the line-neutral files of lanes 1a, 1c, 1d (`src/compat/css/globals.css`) and 1e (`packages/cli/**`) listed in the index. Changesets `.changeset/plat-4x-<topic>.md`.
4. CI/CD is GitLab CI only. Your tests run in the C0 seed jobs from day 0 (`plat:gate:glass-quality` runs `jest --ci` on `4x`; `plat:integration:next`/`:vite` run the 4.1.0 integration scripts); lane 1a adds `plat:test:pack-matrix`, `plat:test:react19`, `plat:test:visual-4x`. Never add or edit a GitHub workflow. Merge only after `node scripts/ci/gitlab-status.mjs --sha <head>` succeeds.
5. Remote-first: no Docker build of `Dockerfile`, no Playwright/Chromium, Storybook build, `npm run build`, full `jest --ci`, `next build`, integration scripts or `npm pack` matrix on the Mac. Locally: bounded `rg`, `git`, `node -e`, `npx eslint <touched files>`, `npx jest <one jsdom test file>`.
6. Forbidden: mock/placeholder/TODO fixes reported as done; skipped or `.only` tests; `--passWithNoTests`; `|| true`, `--no-verify`; lowering any budget or count; snapshot updates to pass (single reviewed exception PLAT-069: the two GlassButton/GlassCard snapshots, regenerated in CI, with the accepted c07fd7111 fill change stated in the PR); shipping a contract stub.
7. Patch scope for 4.1.1: no change to `dependencies`, `peerDependencies` or `exports`; no export removed; no React floor change; no root `"use client"`; no deletion of `server/` or `src/services/**`; no history rewrite. Every observable behaviour removal is a §13.1 exception with a `fragments/deprecations/plat.ts` entry (`DEP-P####`, `since: '4.1.1'`, `removeIn: '5.0.0'`) and a release-note line.
8. No committed evidence; decision records only (`docs/release/decisions/4.*.md`, `docs/release/visual-fixes/*.json`).
9. Credentials: no publish from the Mac, no token exports; the tag is pushed on GitHub and published by the GitLab tag pipeline. GHSA publication, npm trusted publisher (OD-10), font licence (D-31) are owner gates recorded in the release issue.
10. Conventional commits with no `!` (any `!` on `release/4.x` fails change class); end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

#### Prerequisites

None except the frozen contract and C0. Verify:
- `git rev-parse origin/release/4.x` descends from `v4.1.0` (`15b6de6f7`).
- In the main checkout `git status --porcelain` shows ` M scripts/ci/{run-next-integration,run-vite-integration,verify-pack}.js` and ` M reports/3.2-release/vite-integration.json`: carry exactly those three script diffs into PLAT-055 (copy the diff into the worktree with `git diff -- <3 files> | git -C ../AuraGlass.wt/plat-4x apply`), restore the report file. If already committed, cite the commit.
- `ci/plat.gitlab-ci.yml` exists on `release/4.x` (C0 seed). If lane 1a's added jobs are not merged yet, use the seed jobs; do not edit the CI fragment.

Contract seams consumed: S-38 and S-50 (deprecation fragment schema and loader for `fragments/deprecations/plat.ts`), S-47 (`motion-no-empty-animate` rule name), S-22 note (4.x provider `preview?: 'v5'`), S-37 format (4.x `warnDeprecated`), S-11 (row-H token outputs), S-43 (fixture registered as an L11 subject on `next` by 1a). Test inputs: the 4.1.0 code; real npm pack outputs captured in CI; the row-H-absent fixture of REQ-PLAT-60.

#### May touch (on `release/4.x` only)

Every PLAT path on `release/4.x` (4.x `src/**`, `server/**`, `Dockerfile`, `.env.example`, `.gitignore`, `package.json` scripts/files/version and, from 4.2, peers per REQ-PLAT-56, `eslint.config.js`, `eslint-plugin-auraglass.js`, `.storybook/**` (4.x only), `scripts/**` except the line-neutral files, `README.md`, `llms.txt`, `SECURITY.md`, `CHANGELOG.md`, `RELEASE_NOTES_4.1.*.md`, `fragments/deprecations/plat.ts`, `etc/api/*` 4.x baseline files, `docs/inventory/component_inventory.json`, `docs/certification/certification-audit-spec.md`, `docs/security/**`, `docs/release/decisions/4.*.md`, `docs/release/visual-fixes/**`, `tests/{ci,release,deployment,eslint,docs,deprecations,fixtures/consumer-4x}/**` files of PLAT-055..167, root probe scripts and `reports/` (untrack/delete)).

#### Must not touch

`next` and `main`; `.gitlab-ci.yml`, `ci/**`, `scripts/ci/{verify-ownership,verify-ci-fragments,gitlab-status,assemble-pages}.mjs`, `scripts/ci/require-ci-publish.js`, `scripts/release/**`, `scripts/build/api-report.mjs`, `api-extractor.base.json`, `docs/release/{branch-policy,change-classes,lts-policy,train}.md`, `docs/release/*.json`, `docs/schemas/**`, `docs/release-rollback-deprecation.md` (line-neutral files of lanes 1a/1c); `packages/cli/**` (1e); `src/compat/css/globals.css` (1d); row H (`src/material/**`, `tokens/**`, `scripts/tokens/**`, `src/styles/{v5,preview-v5}.css`, `tokens/compat-alias-map.json`: MAT); other streams' fragments and `tests/fixtures/consumer-4x/cases/<s>/**`; `.github/workflows/**`; `docs/auraglass-5/**`.

#### Steps

**4.1.1 (target week of 2026-10-12; a missed gate moves the date, never the gate).** Open PRs in parallel where files do not overlap.
1. PLAT-055..063 (REQ-37/38): pack-fix commit, `scripts/ci/lib/npm-pack.js` (npm 10/11/12 shapes), CI-captured fixtures, all five callers, `evidence-dir.js`, the 28 `reports/` writers, tests; then run `plat:test:pack-matrix` on both legs.
2. PLAT-071..084 (REQ-40..43): adaptiveAI opt-in + `enableAdaptiveAI`, 4.x import side-effect gate and baseline, GlassCanvas `new Function` removal + `onComponentAction`, video player data-src fix, ContrastGuard `unverified`, `validateTextContrast` `"unverified"`, each with its test.
3. PLAT-085..096 (REQ-44..47): rules-of-hooks registration, `useOptional*` readers, hoist all 109 conditional calls (count measured in CI), `GlassInput`/hooks-order tests, `"use client"` on `/primitives` and `/theme` + `client-entries.json` + RSC page in the Next integration app, hydration-stable helpers, `Slot` ref by React major, React 19 matrix record.
4. PLAT-097..107 (REQ-48/49): motion test utils, the 84 reduced-motion sites in two batches, 35-row test, 4.x `motion-no-empty-animate` rule, remote reduced-motion pass in `plat:test:visual-4x`, cookie-consent visibility, command-palette regex escape.
5. PLAT-064..070 (REQ-39) after steps 2–4 merge: measure `lint:check`, fix or baseline `no-inline-glass` (shrink-only), decision record, non-mutating `lint`, `no-gate-bypass` test, the reviewed snapshot update, gate green.
6. PLAT-108..115 (REQ-50): relocate the inventory and certification spec, `ensure-component-inventory` exits 1 when missing, `git rm -r --cached reports`, delete the 45 root probes, `verify-tree-hygiene.js`, report-path constants as `kind: 'export'` entries.
7. PLAT-116..132 (REQ-52..54): README/llms/RELEASE_NOTES_4.1.0/CHANGELOG retractions and the ledger-corrections note, `verify-docs-claims.js`, advisory draft (bounded AuraOne grep, counts only), JWT guard, Dockerfile/.env.example, SECURITY.md, owner GHSA handoff, font decision and default removal, tarball font assertion, labelled visual-fix record with composites.
8. PLAT-133..140 (REQ-55): complete the 4.1.1 deprecation set (>= 19, 20 with font), API reports + export snapshots for all 47 keys from the 4.1.1 build using lane 1c's tools in a GitLab job (commit the artifact unedited), patch-scope test, `prepublishOnly` → `require-ci-publish.js`, remove `release` scripts, size check, release commit, then — only after the GHSA is published, OD-10 is configured and lane 1a's gates are flipped — tag `v4.1.1` on GitHub; verify provenance (AC-PLAT-01); compile the AC table.

**4.2.0 (2026-11-16)** — PLAT-141..155, 163: dependency diet as install-level C-D (OI-3 decision record first), lazy importers with the exact install error, `kind: 'dependency'` and all §14.4 "4.2" entries, real `/forms` and `/data` builds, `./deprecations.json`, 4.x budgets, 4.x `warnDeprecated` + generated table (via lane 1c's generator), providers wrapping, stale TSDoc block, D-28 fixes with visual-fix records, opacity vars, Switch shimmer, FPS loops, WorkspaceTabs props; downstream grep record; 4.2.0 gate record; tag.

**4.3.0 (2027-01-18)** — PLAT-156..162: `./material`, `preview="v5"`, `./styles/v5.css`, `./compat/tokens.css`, `./compat/globals.css` wiring with the row-H-absent omission test, Storybook `preview` toolbar global, 4.x CLI `doctor --v5` port and `MOVED_NOTICE`, PLAT entries active `since <= 4.3.0`, coverage artifact, `@auraglass/cli@0.x` published from the tag pipeline (lane 1e cherry-picks `packages/cli`), 4.3.0 gate record; tag. 4.4.0 only for late C-D entries whose B-id exists.

**Fixture** — PLAT-164..167 (REQ-63) any time from day 0: `tests/fixtures/consumer-4x/` harness (Next 15 + React 19.0, Vite + React 18.3, >= 30 root exports, aliases, subpaths, `--glass-*` reads, global reliance, mobile page), `undeclared-deps` fixture, contents test, run on every 4.x tag. Frozen after first green; later edits need release-owner CODEOWNERS approval (contract PR adds the CODEOWNERS line).

#### Tests

jsdom/node (in `plat:gate:glass-quality` on `4x`): `tests/ci/{npm-pack,evidence-dir,no-gate-bypass,import-side-effects,use-client-entries,tree-hygiene,tarball-fonts,package-json-patch-scope}.test.ts`; `src/utils/__tests__/adaptiveAI.optin.test.ts`; `GlassCanvas.security.test.tsx`; `GlassAdvancedVideoPlayer.datasrc.test.tsx`; `ContrastGuard.honesty.test.tsx`; `validateTextContrast.test.ts`; `GlassInput.hooks.test.tsx`; `src/__tests__/hooks-order.test.tsx`; `src/__tests__/ssr/hydration.test.tsx`; `Slot.ref.test.tsx`; `src/__tests__/motion/reduced-motion-visible.test.tsx`; `tests/eslint/motion-no-empty-animate.test.ts`; `GlassCommandPalette.regex.test.tsx`; `cookie-consent/__tests__/visibility.test.tsx`; `tests/docs/claims-lint.test.ts`; `tests/deployment/jwt-secret-guard.test.ts`; `tests/deprecations/seed-4.1.1.test.ts`; `tests/release/{diet-4.2,budgets-4x,providers-wrap,bridge-wiring,cli-4x,consumer-4x-contents}.test.ts`; `tests/release/4x-fixes/*`.
Remote (GitLab): `plat:test:pack-matrix` (Node 20/npm 10, Node 24/npm 11), `plat:test:react19` (smoke + unit legs), `plat:integration:next` (incl. the RSC page `next build`), `plat:integration:vite`, `plat:test:visual-4x` (app chrome, reduced-motion pass, font composites, D-28 records, preview cells), `jest-axe` suites in touched folders.

#### Visual evidence

`plat:test:visual-4x` artifacts: base | head | diff composites at 1440×900 and 390×844, light and dark, for the font fallback (line-count diff per text node, 0 overflow), the D-28 dark text and contrast-more fixes (measured contrast per text run), the reduced-motion settle check, and the 4.3 preview cells. Each labelled visual change has its `docs/release/visual-fixes/<slug>.json` listing exactly the changed cells.

#### Exit criteria

- 4.1.1 tag: AC-PLAT-01..13 hold (provenance names GitLab CI and the project; four gates `allow_failure: false`; no token path; pack matrix both legs; 0 import-time listeners; `new Function`/`eval` only at the three allowed lines; 0 rules-of-hooks and 0 `lint:check` errors; RSC page builds; hydration clean on 18.2 and 19; 35/35 reduced-motion; ContrastGuard unverified; claims lint 0; `reports/` untracked, <= 3,000 files; one font outcome; 47 export snapshots and >= 19/20 entries; patch scope; GHSA published before the tag; JWT guard).
- 4.2.0 / 4.3.0: AC-PLAT-15, -16, -17 hold; AC-PLAT-20 holds on every 4.x tag.
- All PLAT-055..167 done or listed with their external gate.

#### Final report

```
#### PROMPT_1b report (PLAT 4.x line)
Tags: v4.1.1 <sha> <pipeline>, v4.2.0 ..., v4.3.0 ...
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Measurements: hook calls hoisted N (CI count), lint errors before/after, reduced-motion 35/35, tarball bytes, Button min/gz, entries count
Exceptions shipped (DEP-P ids): <list>
Owner gates: GHSA <id, published time>, OD-10 <status>, D-31 <outcome>, OI-3 <decision>
Deviations / Blockers: <exact output>
```

---

## Work package 1c: REL

### PROMPT-1c (PLAT): change control, deprecations, release governance and removal of `legacy/**`

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §4.3, §4.4, §4.7, §5.3, §5.7, §9, §11 (breaking register), §12.1 (`tests/{release,deprecations,compat,removal}`), §19 (S-37, S-38, S-39 engine side, S-55 reads).
Requirements: REQ-PLAT-18..36, REQ-PLAT-79..82 (RM-01..RM-12; RM-13 is lane 1f), the `next` half of REQ-PLAT-50.
Acceptance: AC-PLAT-15..19, AC-PLAT-23 (snapshot half), AC-PLAT-32, AC-PLAT-33 (gate records).
Tasks: PLAT-168..PLAT-241 (`lane: "1c-REL"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: `archive/v1-19-prd/prompts/PROMPT_01a_REL_BASELINE.md`, `PROMPT_01b_REL_PUBLISH_LEDGER.md` (ledger, notes), `PROMPT_01c_REL_CLASSIFY_BRANCH.md`, `PROMPT_01e_REL_CONTRACTS_43.md`, `PROMPT_01f_REL_TRAIN_OPS.md`, `PROMPT_08f_FND_REMOVAL_EXECUTION.md` (labels → commit trailers and committed records; `removal-gate.yml` → `plat:gate:removal`; `gh api` in CI → operator-run records).
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-rel`; branches `next-plat/rel-<topic>` and `next-plat/rm-<nn>-<slug>` from `origin/next`; line-neutral tools also land on `release/4.x` via `4x-plat/rel-<topic>` (same commits, cherry-picked).

#### Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt.
2. Concurrency: start on day 0; never wait for another stream or PLAT lane. Fragments, metas, compat reports and QUAL reports are read through `loadFragments` (S-50), `etc/api/*` files and `optional: true` artifacts; whatever is absent is `pending` or `uncovered`, never a failure on PRs (G-07 decides at the GA tag).
3. Ownership: only the "May touch" list; changesets `.changeset/plat-rel-<topic>.md`.
4. GitLab CI only. No script reads PR labels or calls the GitHub API in CI: visual-fix approval is a committed `docs/release/visual-fixes/<slug>.json`, multi-family removal is the commit trailer `Multi-Family: <reason>`. Operator-only reads (`gh search code`, `gh api` for GHSA and the archive) run from this worktree with the existing `gh` login and produce committed records.
5. Remote-first: API Extractor runs, export snapshots from packed tarballs, the 4.1.0 → 4.1.1 diff, revert dry-runs and the Vite production-strip test run in GitLab jobs. Locally: bounded `rg`, `git`, `node -e`, `npx eslint <files>`, `npx jest <one test file>`. `downstream-grep.mjs` and `consumer-grep.mjs` are bounded (`rg` with the listed excludes; refuse `$HOME` and `/`).
6. Forbidden: fake classifiers that always pass; hand-edited generated files (`deprecations.json`, `src/internal/deprecations.generated.ts`, schema); skipped tests; lowering rules; shipping a contract stub; history rewrite; deleting any file outside the RM family's paths.
7. Evidence as GitLab artifacts; committed only: decision records, registers, removal records (paths and counts only, no secrets).
8. Credentials: none in CI; no token exports; owner steps (archive repo, GHSA, drill) recorded in the release issue.
9. Conventional commits; RM PRs are one squash commit `refactor(5.0)!: remove <family>` on `next`; never `!` on `release/4.x`; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

#### Prerequisites

None except the frozen contract and C0. Verify: `src/contracts/{fragments.ts,load-fragments.mjs}` (S-38, S-39, S-50), `src/internal/*` seeds (S-37), `scripts/build/api-report.mjs` seed with its final CLI (C0-13), `tests/contract-doubles/{fragments,reports}/` and `legacy/` (C0-10 quarantine) exist on `origin/next`.

Contract seams consumed: S-35 (`ENTRIES` for 5x API reports), S-37 (internal helpers you complete), S-38/S-39 (deprecation and codemod schemas, `CORE_CODEMODS`, `AREA_CODEMODS`), S-50 (`loadFragments`), S-55 (`VisualClassReport`), S-30 (compat adapter render contract). Doubles: `tests/contract-doubles/fragments/*`, `tests/contract-doubles/reports/visual-class.json`, compat seeds.

#### May touch

`scripts/release/**` except 1a's six files; `scripts/release/lib/**`; `scripts/build/api-report.mjs`; `api-extractor.base.json`; `etc/api/**` tooling/config (never another owner's report; `etc/api/cli.*` is 1e's; 4.x baseline reports are committed by 1b); `docs/release/{change-classes,lts-policy,train}.md`; `docs/release/{exception-allowlist,ledger-corrections,breaking-changes}.json`; `docs/release/decisions/{5.0.0-gates,rollback-drill,change-class-canary}.md`; `docs/release/decisions/downstream-*.json`; `docs/release/decisions/removals/RM-01..RM-12.json`; `docs/schemas/**`; `docs/release-rollback-deprecation.md`; `docs/inventory/component-dispositions.md`; `src/internal/**`; `src/compat/plat/**`; `tests/{release,deprecations,compat,removal}/**` except 1a's and 1b's files; `tests/docs/runbook.test.ts`; `scripts/removal/**`; `legacy/**` except `legacy/tests/**`; root 4.x assets on `next` (`server/`, `Dockerfile`, `docker-compose*.yml`, `nginx.conf`, `tsconfig.server.json`, `workers/`, `bin/`, `examples/`, `visual-baselines/`, `reports/`, root probes, `.dockerignore`, `.env.example`); `.gitignore` (next; content pre-declared in the index); `SECURITY.md` (next); `tools/**` except `tools/codemods/**`; the four root 4.x scripts of PLAT-240.

#### Must not touch

`package.json` (1d; scripts you need are invoked as `node scripts/release/<x>.mjs`); `ci/**` (1a; it wires your scripts per the job table); `fragments/deprecations/plat.ts` (1b) and any other stream's fragment; `src/compat/<other>/**`, `src/compat/index.ts` (CONTRACT); `etc/api/<entry>.*` of entry owners; `docs/release/decisions/4.*.md`, `docs/release/visual-fixes/**` (1b); `apps/docs/**` (your `--docs` output is the git-ignored `apps/docs/generated/migration/deprecations.md`, written when 1f's build runs your generator); `legacy/tests/**` and the RM-13 docs (1f); `.github/**`.

#### Steps

1. PLAT-168..174 (REQ-18..21): `lib/policy.mjs` (only code copy of the taxonomy), `change-classes.md`, `classify-change.mjs` over API diffs, export snapshots, fragment diffs, `VisualClassReport` with `VISUAL_TOLERANCE`, `package.json` key diff, commit markers and changeset bumps; visual-fix records; `Multi-Family:` trailer; table-driven tests; the AC-PLAT-17 canary on `release/4.x` and its record.
2. PLAT-175..178 (REQ-22/23): API Extractor 7.59.4 behind the C0 `api:update` CLI (4x and 5x modes, B22a paths, `unanalysable`), `export-snapshot.mjs` (runtime/require/types names, `typesRuntimeMismatch`, byte-stable). Land on both lines early: lane 1b's 4.1.1 baseline (PLAT-135) uses them.
3. PLAT-179..189 (REQ-24..27): `gen-deprecations.mjs` (root `deprecations.json`, committed `src/internal/deprecations.generated.ts`, `--line 4x --out`, `--docs`, `--check`), generated schema, `verify-deprecations.mjs` (prefixes `DEP-P/M/C/S/Q`, since/removeIn rules, codemod and breaking references, `--compare-branch`), `src/internal` completion (`cn`, `warnDeprecated` format and silent/production/once rules), CP-PLAT-3 contract PR, `check-tsdoc-deprecated.mjs`; tests.
4. PLAT-190..195 (REQ-28/29): G-07 prior-deprecation coverage in `classify-change.mjs`, `exception-allowlist.json`, `breaking-changes.json` (B1–B21), `verify-breaking-register.mjs` (+ `--coverage` artifact); tests.
5. PLAT-196..199 (REQ-30): `src/compat/plat/index.ts`, `verify-compat-coverage.mjs`, coverage and generic adapter-contract tests (role/name parity, warn-at-call-time).
6. PLAT-200..217 (REQ-31..36): release ledger + corrections, `release-notes.mjs` (heading order, deps first, claims-sourced numbers, SURF capability-ledger section read-only), rollback runbook rewrite + test + drill record (owner's npm 2FA), LTS policy, release-comms verifier, SECURITY.md for 5.x, `downstream-grep.mjs` + runs at the 4.2 cut and rc.1 (AuraOne follow-up issue, no AuraOne edits), `train.md` + test, 5.0 gate records.
7. PLAT-218..227 (REQ-50 next half, REQ-80..82): untrack `reports/` and probes on `next`, `.gitignore` per the index, dispositions generator (all 496 components, R-01..R-18) + committed output + progress and deprecation-coverage tests, `consumer-grep.mjs` (+ `--verify`), `verify-archive.mjs`, the private archive (owner), `no-backend` test.
8. PLAT-228..241 (REQ-79): RM-02..RM-12 in any order, each after its consumer-grep record, one squash commit, PR body with the generated records, `plat:gate:removal` incl. revert dry-run; RM-01 only after the published GHSA id and the verified archive are in `RM-01.json`; root 4.x tooling deletions; `legacy-empty` GA-scope test (G-12; RM-13 is lane 1f's).

#### Tests

Node (in `plat:gate:glass-quality`, `plat:gate:change-class`, `plat:gate:removal`): `tests/release/{policy,classify-change,api-report,export-snapshot,release-ledger,release-notes,release-comms,downstream-grep,train}.test.ts`; `tests/deprecations/{gen,verify,warn-deprecated,tsdoc,prior-deprecation,breaking-register}.test.ts`; `tests/compat/{coverage.test.ts,adapters-contract.test.tsx}`; `tests/removal/{inventory-remove-progress,deprecations-coverage,no-backend,legacy-empty}.test.ts`; `scripts/removal/consumer-grep.test.mjs` (`node --test`); `tests/docs/runbook.test.ts`.
Remote (GitLab): the 4.1.0 → 4.1.1 export-snapshot diff from the published tarball, API Extractor on every entry, the Vite production build proving `warnDeprecated` messages are stripped, `revert-dry-run` per RM PR, the AC-PLAT-17 canary pipelines.

#### Visual evidence

None produced by this lane; it consumes `VisualClassReport` (QUAL L7 on `next`, `plat:test:visual-4x` on `release/4.x`) and links composite artifacts from visual-fix records in `change-class.json` and the release notes.

#### Exit criteria

- AC-PLAT-15: the 4.1.0→4.2.0 and 4.2.0→4.3.0 `change-class.json` report <= C-D with 0 removals; install-level moves satisfy all four conditions.
- AC-PLAT-16: at `v4.3.0` `verify-breaking-register.mjs` exits 0; coverage artifact classifies 100% of root-exported REMOVE/DEPRECATE/CONSOLIDATE symbols; 0 tags without entries and 0 entries without tags.
- AC-PLAT-17: canary fails without the record and passes with it.
- AC-PLAT-18 (ledger half), AC-PLAT-19 (drill <= 15 min), AC-PLAT-23 (snapshot half).
- AC-PLAT-32: at GA `legacy/` empty and `reports/` absent; every RM PR has its record and passed revert-dry-run; RM-01 cites a published GHSA and a verified archive; dispositions `--check` exits 0.
- AC-PLAT-33 (gate records): `5.0.0-gates.md` holds the evidence for each 5.0 stop.

#### Final report

```
#### PROMPT_1c report (PLAT release control and removal)
PRs: <urls>  Head SHAs: <next> <release/4.x>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Change class per tag: <tag -> class, pipeline>
G-07 coverage: covered N / uncovered M (artifact URL)
Removal: RM-nn -> squash SHA, record, revert-dry-run URL
Owner actions open: archive repo, GHSA id for RM-01, rollback drill, CP-PLAT-3
Deviations / Blockers: <exact output>
```

---

## Work package 1d: BUILD

### PROMPT-1d (PLAT): 5.0 build, exports, artifact gates, CSS assembly and consumer canaries

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §3 items 6–7, §4.5, §5.6, §12.1 (`tests/{build,exports,rsc/plat,side-effects,deps,react19,css,pack,lint/plat}`, canaries), §14.3–14.4, §15.7, §16 (5.0 rows), §19 (S-04, S-35, S-36, S-44 bytes, S-45, S-47, S-49, S-52).
Requirements: REQ-PLAT-64..78 (plus the `next` halves of REQ-PLAT-12 wiring, -30 compat CSS and size rows, -36 release commits).
Acceptance: AC-PLAT-22..27 (and the release-commit half of AC-PLAT-18).
Tasks: PLAT-242..PLAT-298 (`lane: "1d-BUILD"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: `archive/v1-19-prd/prompts/PROMPT_02a_PKG_BUILD.md`, `PROMPT_02b_PKG_ARTIFACT.md`, `PROMPT_02c_PKG_RSC_CSS.md`, `PROMPT_02d_PKG_CANARIES_R19.md` (their `artifact.yml`/`canaries.yml` jobs are now `plat:*` GitLab jobs of lane 1a; tool choices replaced by the frozen set: TypeScript compiler API, esbuild, tsdown).
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-build`; branches `next-plat/build-<topic>`, `next-plat/canary-<topic>` from `origin/next`.

#### Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt. Dependency-set changes (incl. the Rollup fallback) are contract PRs.
2. Concurrency: start on day 0. Every gate runs on the C0 seeds first (skeleton build, PLAT-248) and then on whatever other streams have merged to `next`; a failure on another stream's path is reported `pre-existing` to that stream and blocks only PLAT PRs touching it. Calibration (D-26) is state-triggered, not a dependency.
3. Ownership: only the "May touch" list; changesets `.changeset/plat-build-<topic>.md`.
4. GitLab CI only; lane 1a wires your entry points (index job table) into `plat:build:dist`, `plat:gate:glass-quality`, `plat:package:pack`, `plat:integration:{next,vite}`, `plat:test:canaries`. Never add a GitHub workflow. Merge after `gitlab-status.mjs --sha <head>` succeeds.
5. Remote-first: `npm run build`, `npm pack`, canaries (`next build`, `next start`, Vite builds), Playwright specs, Node cold-import timing, publint/attw on the tarball, the React Compiler pass and `npm install --omit=...` counts run only in GitLab jobs. Locally: bounded `rg`, `git`, `node -e`, `npx eslint <files>`, `npx jest <one node test file>`, `npx tsc -p tsconfig.build.json --noEmit` is allowed only if it completes under a few minutes; otherwise run it in CI.
6. Forbidden: budgets set above measured results; loosening any row beyond `PROVISIONAL_ROWS`/`DEFAULT_CEILINGS`; raising a limit without the changelog entry and `Perf-Budget-Raise:` trailer; disabling a gate for another stream's file instead of reporting it; skipped tests; snapshot updating; bundling seeds into published entries (pre-release filter must drop `@ag-contract-seed` graphs); workspace links in canaries (packed tarball only).
7. Evidence (metafiles, size reports, canary screenshots, axe JSON, timings) as artifacts under `.artifacts/plat/<job-slug>/`; generated `docs/size-budgets.json` and `build/{css-ownership,server-safe-exports}.json` are the only committed generated outputs.
8. Credentials: none needed. 9. Conventional commits (C-B changes on `next` carry `!`); end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

#### Prerequisites

None except the frozen contract and C0. Verify on `origin/next`: `build/exports.manifest.json` (verbatim from `ENTRIES`), `docs/dependency-allowlist.json`, frozen root script names (S-52: `tokens:build`, `build`, `pack:verify`, `api:update`, …), `eslint-plugin-auraglass.js` loader (verbatim), `src/contracts/{tokens,fragments,entries}.ts`, seeds `src/material/index.ts`, `src/theme/index.ts`, `src/internal/*`, `scripts/tokens/build.mjs` seed, `tests/contract-doubles/{tokens/manifest.json,fragments/}` and `contracts/stubs/reference.css`.

Contract seams consumed: S-01..S-06 (CSS assembly ownership, `materialProps` in canaries), S-10/S-11 (token names, manifest for the Tailwind bridge), S-22 (`AuraGlassScript`, `AuraGlassProvider` in canary layouts), S-31 (`rsc: 'server'` metas), S-35 (manifest), S-36/S-49 (frozen dependencies), S-43 (canary pages as L11 subjects, registered by 1a), S-44/S-45 (size, CSS, side-effect fragments), S-47 (lint rule names), S-50 (`loadFragments`), S-52 (script names).

#### May touch

`package.json`, `package-lock.json` (non-dependency fields; lockfile only via contract PRs), `CHANGELOG.md` (release commits on `next`), `tsconfig*.json` (not `tsconfig.storybook.json`), `tsdown.config.ts`, `vite.config.ts`, `.dependency-cruiser.js`, `.npmignore`, `.prettierrc`, `.husky/**`, `.eslintignore`, `patches/**`, `eslint.config.js` and `eslint-plugin-auraglass.js` (verbatim; no edits), deletions `rollup.config.js`, `.eslintrc.js`, `.bundlesizerc`, `scripts/{build-all,postbuild-client,build-workers}.js`, `scripts/ci/{verify-tree-shaking,verify-no-core-ui-deps,run-next-integration,run-vite-integration}.js`, `scripts/ci/check-undefined-custom-props.mjs`; `build/**`; `scripts/build/**` except `api-report.mjs`; `scripts/ci/{verify-deps,verify-side-effects,verify-size-budgets,measure-node-import,verify-compiler}.mjs`; `scripts/ci/verify-pack.js`; `scripts/ci/lib/**` (forward-ported from 1b); `fragments/{size-budgets,css,side-effects}/plat.ts`; `lint/rules/plat/**`; `src/compat/css/**` (line-neutral); `docs/dependency-allowlist.json` (verbatim), `docs/size-budgets.json` (gen), `docs/size-budgets.changelog.md`; `canaries/**` except `canaries/next16/app/<other stream>/**`, `canaries/vite/src/<other stream>/**`, `canaries/<app>/fixtures/<other stream>/**`; `tests/{build,exports,side-effects,deps,react19,css,pack}/**`, `tests/rsc/plat/**`, `tests/lint/plat/**`.

#### Must not touch

Dependency sets in `package.json` (contract PRs only); `build/exports.manifest.json` content (contract PRs only); `src/**` component, material, theme or token code of other streams (report findings to the owner); `src/index.ts`, `src/root/**`, `src/compat/index.ts`; other streams' fragments, canary page directories and lint rule directories; `ci/**`; `scripts/tokens/**`; `jest.config.js`, `playwright.config.ts` (QUAL, verbatim); `.storybook/**`.

#### Steps

1. PLAT-242..248 (REQ-64): `tsdown.config.ts` (unbundle; directive check first; Rollup fallback only via contract PR), `scripts/build/post.mjs`, `package.json` scripts and fields, delete the old build system, `build/README.md`, `single-build` test, then the skeleton build on seeds with every artifact gate green (pipeline URL in `build/README.md`).
2. PLAT-249..253 (REQ-65/66): module-graph, directive, purity, externals, twin tests; `verify-artifact.mjs`; `tsconfig.build.json`; `rewrite-dts-aliases.mjs`; d.ts hygiene and types/runtime graph identity tests.
3. PLAT-254..258 (REQ-67/68): keep the manifest verbatim; `generate-exports.mjs` (`--check`, `--list-entries`, seed filter); `build/v4-exports.snapshot.json`; exports tests (removed subpaths throw `ERR_PACKAGE_PATH_NOT_EXPORTED` from beta; root <= 160 names; `ROOT_EXPORTS` at GA); Node 20.19/22 `import`/`require(esm)` matrix.
4. PLAT-259..262 (REQ-69): the six PLAT lint rules + `_strict.cjs` (error on PLAT globs, warn elsewhere until opt-in; all error at RC-1), RuleTester suites, `build/server-safe-exports.json`, RSC tests.
5. PLAT-263..267 (REQ-70): `verify-side-effects.mjs` (jsdom realm over every `dist/**/*.js`), empty side-effect fragment, bare-import <= 64 B (esbuild and Rolldown), Node trap, cold import <= 150 ms (remote), single-context test.
6. PLAT-268..270 (REQ-71): `verify-deps.mjs` with importer confinement, allowlist verbatim, transitive-count ceiling (set at D-26), `cn` behaviour.
7. PLAT-271..274 (REQ-72/73): React 19 gates (beta), `verify-compiler.mjs` (verify OI-4 facts against current React Compiler docs first and record in `build/README.md`), `artifact:publint`/`artifact:attw` scripts, API-report input test.
8. PLAT-275..281 (REQ-74/75): CSS assembly library (layers, order, esbuild lowering to the baseline, `LAYER_ORDER_STATEMENT`, ownership map), PLAT CSS fragment (`ag.reset`), `src/compat/css/globals.css`, CSS tests (layer order, 0 `!important`, no globals, targets, per-subpath ownership, class coverage), delete `check-undefined-custom-props.mjs`; Tailwind v4 bridge generator and tests.
9. PLAT-282..287 (REQ-76): `verify-size-budgets.mjs`, PLAT size rows (incl. compat rows), generated aggregate and changelog, ratchet and CI-wiring tests, delete `verify-tree-shaking.js` and `verify-no-core-ui-deps.js`; record the calibration when it triggers.
10. PLAT-288..294 (REQ-77): canaries `next16` (PLAT pages under `app/plat/**`, layout at `app/layout.tsx`), `next15`, `vite` (stream page glob entry, cascade proof), `vite-tailwind4`, `vite-compiler`, `types-strict`, `jest-cjs`, Base UI latest leg; delete the 4.x integration scripts on `next` once canaries run.
11. PLAT-295..297 (REQ-78): forward-port `scripts/ci/lib/*` from 1b, rewrite `verify-pack.js` (denylist, seed markers, sizes; sourcemaps as `dist-maps.tgz`), tarball-contents test.
12. PLAT-298 (REQ-36): release commits on `next` for the fixed alpha/beta/rc train and GA (`npx changeset version`, version + `CHANGELOG.md`), tag on GitHub; the GitLab tag pipeline publishes (`next` dist-tag; GA `latest`).

#### Tests

Node (in `plat:gate:glass-quality` on `5x`): `tests/build/{single-build,preserve-modules,directives-preserved,dist-purity,externals,no-module-twins,dts-hygiene,types-runtime-graph,single-context,size-budgets,size-budgets-ratchet,ci-wiring}.test.ts`; `tests/exports/{manifest-shape,manifest-generated,package-exports,removed-subpaths,no-duplicate-names,root-export-count,no-foundation-types,api-report-inputs}.test.ts`; `tests/rsc/plat/*`; `tests/lint/plat/*`; `tests/side-effects/{import-gate,bare-import-drops}.test.ts`; `tests/deps/{allowlist,import-confinement,cn}.test.ts`; `tests/react19/*`; `tests/css/*`; `tests/pack/tarball-contents.test.ts`.
Remote (GitLab): `tests/exports/node-esm-require.test.mjs` (Node 20.19.0, 22), `tests/side-effects/node-import.test.mjs`, `tests/deps/transitive-count.test.mjs`, `measure-node-import.mjs`, publint/attw, `verify-compiler.mjs`, `canaries/*/tests/*.spec.ts` in `plat:integration:{next,vite}` and `plat:test:canaries` (Playwright Chromium, 1440×900 and 390×844, axe colour-contrast on).

#### Visual evidence

Canary screenshots at 1440×900 and 390×844 for every canary page (layout, server, server-helpers, client, button, Vite cascade, Tailwind v4 bridge, forced-colors `ag.a11y` proof) with `scrollWidth <= innerWidth`, axe JSON and first-load byte deltas, all as artifacts of `plat:integration:*`.

#### Exit criteria

- AC-PLAT-22: one build; 1:1 `dist` mapping, 0 chunks, 0 directive mismatches, 0 barrel directives, 0 `.d.ts` with `@/` or global `JSX`; graph identity; publint 0; attw esm-only 0.
- AC-PLAT-23: exports equal generator output; value exports equal `ENTRIES`/`ROOT_EXPORTS` at GA; 47 4.x keys classified; removed paths throw; Node 20.19/22 import and require; cold import <= 150 ms.
- AC-PLAT-24: 0 recorded side effects across 100% of `dist/**/*.js`; bare import <= 64 B per entry; side-effect fragments empty.
- AC-PLAT-25: exactly 4 dependencies; 0 dep-and-peer; 0 bare imports outside the allowlist; transitive count <= ceiling; one React and one Base UI per canary.
- AC-PLAT-26: tarball denylist and limits; every size row within its limit; no unrecorded raise.
- AC-PLAT-27: CSS layered with 0 `!important` and 0 globals outside compat; 0 undefined classNames; React 19 and compiler gates 0 findings; Next 16/15 canaries green; Vite cascade and Tailwind v4 assertions pass.

#### Final report

```
#### PROMPT_1d report (PLAT build and artifact)
PRs: <urls>  Head SHA: <next>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Measurements: tarball packed/unpacked B, { Button } gz B, styles.css gz B, bare import B per entry, cold import ms (20.19/22), transitive count, build s
Findings on other streams' paths (reported, not fixed): <path -> owner -> gate>
Calibration (D-26): <date, rows>
Deviations / Blockers: <exact output>
```

---

## Work package 1e: CLI

### PROMPT-1e (PLAT): `@auraglass/cli`, the `migrate 4to5` engine and TypeScript DX

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §4.6, §5.8, §11 (codemod column), §12.1 (`packages/cli`, `tests/dx` codemod rows, `tests/types/plat`), §12.2 (catalogue minimum cases), §15.3, §16 (CLI and codemod rows), §22 (CP-PLAT-1, OI-5).
Requirements: REQ-PLAT-84..93 (plus `packages/cli/PUBLISHING.md` for REQ-PLAT-15, `etc/api/cli.*` for REQ-PLAT-22, the 4.3 CLI publish half of REQ-PLAT-62).
Acceptance: AC-PLAT-20 (5.0 half), AC-PLAT-21, AC-PLAT-31 (CLI), AC-PLAT-22 (type DX tests).
Tasks: PLAT-299..PLAT-349 (`lane: "1e-CLI"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: the DX prompts in `archive/v1-19-prd/prompts/` covering `packages/cli` (init/add/diff/update/doctor/audit/migrate) and the REL codemod catalogue; `cli.yml` jobs are now `plat:test:cli`; mapping data comes only from `fragments/codemods/*` (contract §4.8), never from `gen-codemod-tables.mjs` or metas.
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-cli`; branches `next-plat/cli-<topic>` from `origin/next`; by 4.3.0 the same `packages/cli/**` commits are cherry-picked to `release/4.x` (`4x-plat/cli-<topic>`, PLAT-349).

#### Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt. Workspace dependencies come only from contract PR CP-PLAT-1 (PLAT-300).
2. Concurrency: start on day 0. Core safety, the JSON contract, the runner and fixtures proceed while CP-PLAT-1 is open (TypeScript compiler API and the frozen set); jscodeshift/postcss transforms run once it merges — no other lane or stream is waited for. Area transforms are written test-first against the owning stream's `areaTransforms[].spec` and fixtures in `fragments/codemods/{surf,mat}*`; until those exist, against `tests/contract-doubles/fragments/` codemod doubles; their fixtures report `pending` until your transform lands (W-3).
3. Ownership: only the "May touch" list; changesets `.changeset/plat-cli-<topic>.md`.
4. GitLab CI only (`plat:test:cli`, `plat:audit:backdrop` manual); never a GitHub workflow; merge after `gitlab-status.mjs --sha <head>` succeeds.
5. Remote-first: the codemod canary (`next build`, three browsers), the 2,000-file perf run, the audit-backdrop remote spec and CLI cold-start timing run in GitLab jobs. Locally: `npx jest <one CLI test file>` over temp-dir fixtures, bounded `rg`, `git`. The CLI bundle never resolves `playwright` or `chromium`.
6. Forbidden: guessing transforms (dynamic values, computed CSS names, unmapped values stay unchanged with the exact `TODO_MARKER`); hard-coded `Glass*`/`--glass-*` literals in `transforms/**`; fixtures edited to match a wrong transform output; `automation: 'full'` outputs containing TODOs; removing a minimum case; skipped tests; mocked HTTP in the remote spec; importing `aura-glass` runtime components or `certification/**`; writing outside the project or into a dirty tree without the flag.
7. Evidence as artifacts (`.artifacts/plat/cli/…`); fixtures are source, not evidence.
8. Credentials: none; publishing only from the tag pipeline; the CLI never stores tokens.
9. Conventional commits; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

#### Prerequisites

None except the frozen contract and C0. Verify on `origin/next`: `src/contracts/fragments.ts` (`DeprecationFragment`, `CodemodFragment`, `CORE_CODEMODS`, `AREA_CODEMODS`, `TODO_MARKER`), `src/contracts/load-fragments.mjs`, `src/contracts/components.ts` (S-30/S-31), `src/theme/index.ts` seed (`AuraGlassProvider`, `AuraGlassScript`, `auraGlassPrepaintScript`), `contracts/packages.json` (package names), `tests/contract-doubles/{fragments,cmp}/`. The frozen 4.x fixture `tests/fixtures/consumer-4x/` (lane 1b) is read-only input; if not yet frozen, use its current state and report cells `pending`.

Contract seams consumed: S-38, S-39, S-50 (deprecation and codemod fragments through `loadFragments`), S-22 (init insertion points), S-30, S-31, S-05, S-06, S-35 (eject set, type DX), S-46 (registry layout for `add`), S-36, S-49 (package name and frozen deps), S-43 (L11 registration of the canary by lane 1a).

#### May touch

`packages/cli/**`; `fragments/codemods/plat.ts`, `fragments/codemods/plat/**`; `etc/api/cli.api.md`, `etc/api/cli.exports.json`; `tests/types/plat/**`; `tests/dx/{codemod-canary.spec.ts,codemod-perf.test.ts,audit-backdrop.remote.spec.ts}`; `tests/dx/fixtures/{recipes-4x,large-tree}/**`; deletions `scripts/migrate/**`, `scripts/codemods/**`, `tools/codemods/**`, `scripts/ci/{verify-cli,verify-recipes-cli}.js` on `next`.

#### Must not touch

Other streams' `fragments/codemods/<s>*` and their fixtures (you read them); `bin/aura-glass.cjs` (lane 1b ports `doctor --v5` and `MOVED_NOTICE` from your `meta.ts`); `tests/fixtures/consumer-4x/**` (1b); `registry/**` (1f; `add` reads it); `ci/**` (1a wires `plat:test:cli`); `package.json` root (1d); `certification/**`; `src/**`.

#### Steps

1. PLAT-299..302 (REQ-84): package, `meta.ts` (`PACKAGE_NAME`, `MOVED_NOTICE`), dependency allowlist, CP-PLAT-1 contract PR, router with `--cwd/--json/--yes/--silent`, exit codes 0–4, `NO_COLOR`, output schemas, contract/version tests.
2. PLAT-303..304 (REQ-85): `fs-safety` (realpath both sides), `git-guard` (dirty touched paths, outside work tree), atomic writes, `--dry-run`; tests with `../x`, absolute, symlink, `--out ../`.
3. PLAT-305..313 (REQ-86/87): project detection, `init` for Next App Router, Vite, shadcn (idempotent; never optional peers), registry client, `list`/`info`, `add` (vendored shadcn v4 schema pinned by sha256, dependency resolution with cycle exit 1, alias rewrite, directive iff `client`, cssVars merge, sha256 header), `--source` eject (44 flagships + T2 core; no optics literals), `diff`/`update`; tests.
4. PLAT-314..319 (REQ-88/89): `doctor` checks and `--v5` report (equals `doctor-v5.expected.json`), legacy `audit deps|imports`, `migrate icons --from lucide`, report-only `radix|mui`; `audit backdrop` remote-only with thresholds constants, own Playwright config, mocked unit test and the no-mocks remote spec (ships at GA only if green, else 5.1).
5. PLAT-320..339 (REQ-90/91): runner (order, globbing, TODO format, preservation, report schema), mapping compilation from `loadFragments('codemods')` + the no-hard-coded-names lint, `catalogue.json`, the 8 core transforms fixture-first with every §12.2 minimum case, the 6 area transforms from SURF/MAT specs, fixture/typecheck/catalogue/deprecation-coverage tests, PLAT's own codemod fragment (subpaths B4/B17–B19, deps list, removed services).
6. PLAT-340..343 (REQ-92): codemod canary (frozen fixture → packed CLI → packed 5.0 → 0 TODOs on the flagship subset, `tsc`, `next build`, three-browser smoke, idempotent second run; every registry block; the 28 4.x recipes → exactly `expected-todos.json`), large-tree perf, AuraOne import-site snapshot for the RC review (read-only).
7. PLAT-344 (REQ-93): type DX tests over the packed `.d.ts` (literal unions, Button variant/intent/prominent, type errors, language-service completion sets); seed subjects report `pending`.
8. PLAT-345..349: CLI perf test, `PUBLISHING.md`, `etc/api/cli.api.md`, delete the 4.x migrate/codemod scripts after successors pass, cherry-pick `packages/cli/**` to `release/4.x` for the `v4.3.0` publish of `@auraglass/cli@0.x`.

#### Tests

Node (in `plat:test:cli`): `packages/cli/test/{package,deps,contract,version,fs-safety,git-guard,dry-run,perf}.test.ts`; `packages/cli/test/commands/{list-info,init.next,init.vite,init.shadcn,init.install,add,add.rsc-alias,add.eject,diff,update,doctor,doctor.shadcn,doctor.v5,audit.compat,migrate-legacy,audit-backdrop}.test.ts`; `packages/cli/src/migrate/4to5/__tests__/{runner,todo-format,preserve,no-hardcoded-names,fixtures,fixtures-typecheck,catalogue-coverage,deprecation-coverage}.test.ts`; `tests/types/plat/{autocomplete.test-d.ts,completions.test.ts}`.
Remote (GitLab Playwright runner): `tests/dx/codemod-canary.spec.ts` (Chromium, WebKit, Firefox), `tests/dx/codemod-perf.test.ts`, `tests/dx/audit-backdrop.remote.spec.ts` (manual `plat:audit:backdrop`).

#### Visual evidence

Codemod-canary screenshots of the migrated frozen fixture at 1440×900 and 390×844 (mobile app-shell page `scrollWidth <= 390`) in three browsers, plus the per-run report JSON, as `plat:test:cli` artifacts; audit-backdrop pass/fail captures from the remote spec.

#### Exit criteria

- AC-PLAT-21: 100% of §12.2 minimum cases exist and pass byte-equality and idempotence; 100% of entries with `codemod != null` covered by a fixture; 0 TODOs in `automation: 'full'` outputs; `migrate 4to5` on every canary and block: 0 errors and 0 changes on a second run.
- AC-PLAT-20 (5.0 half): on `5.0.0-rc.1` the frozen fixture builds (`next build`, Vite) and renders after `migrate 4to5` with 0 TODOs on the flagship subset.
- AC-PLAT-31 (CLI): `@auraglass/cli` (or `aura-glass-cli`) on npm with GitLab provenance; `npm view aura-glass@5 bin` empty.
- Perf rows of §16 for CLI and codemods met on the GitLab runner.

#### Final report

```
#### PROMPT_1e report (PLAT CLI and codemods)
PRs: <urls>  Head SHA: <next>; 4.x cherry-pick SHA: <release/4.x>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Codemods: transform -> cases passing / pending (owner fixture missing)
Canary: TODOs on flagship subset, tsc, next build, browsers, second-run changes, run time
CP-PLAT-1: <PR url, state>
Deviations / Blockers: <exact output>
```

---

## Work package 1f: DX

### PROMPT-1f (PLAT): registry, docs site, claims, `llms.txt`, MCP and the RM-13 docs removal

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §4.6, §5.9, §5.10, REQ-PLAT-83, §12.1 (`tests/{registry,docs}`, `tests/dx` docs/registry rows, `packages/mcp`), §13 items 1–4, §14.3–14.5, §15.8, §16 (registry, block, docs, llms, MCP rows), §19 (S-46 provider; S-24, S-30, S-31, S-51, S-55 consumer).
Requirements: REQ-PLAT-83, REQ-PLAT-94..106 (plus `packages/{registry,mcp}/PUBLISHING.md` for REQ-PLAT-15, the README banner markers of REQ-PLAT-34 on `next`, and the `DOCS_BASE_URL` constant of REQ-PLAT-07).
Acceptance: AC-PLAT-28, AC-PLAT-29, AC-PLAT-30, AC-PLAT-31 (registry, MCP), AC-PLAT-32 (RM-13 half).
Tasks: PLAT-350..PLAT-402 (`lane: "1f-DX"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: the DX prompts in `archive/v1-19-prd/prompts/` covering registry, docs, claims, llms and MCP, `PROMPT_08f_FND_REMOVAL_EXECUTION.md` (RM-13), the REL Storybook migration pages (`SB-REL-3`); `registry.yml`/`docs.yml`/Vercel previews are now `plat:test:registry`, `plat:test:docs`, `plat:build:docs` and GitLab Pages.
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-dx`; branches `next-plat/dx-<topic>` and `next-plat/rm-13-docs` from `origin/next`.

#### Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt. The docs app's `next@16` and MCP's SDK pins arrive through contract PR CP-PLAT-1 (lane 1e opens it); until then build the generators, gates and content against the frozen set.
2. Concurrency: start on day 0. Blocks and items compose only CMP contract props (S-30), MAT seams (S-06, S-21, S-24) and PLAT code, tested against seeds and `tests/contract-doubles/cmp/*`; generators read whatever metas, `registry-item.json` files, fragments and artifacts exist; a missing cross-stream input renders `pending` (claims fail only on the `v5.x.y` tag, G-14); the quickstart falls back to `tests/dx/fixtures/alpha-smoke/` until `app-frame` (SURF) is certified.
3. Ownership: only the "May touch" list; changesets `.changeset/plat-dx-<topic>.md`.
4. GitLab CI only; GitLab Pages serves the docs (`public/`), Storybook (`public/storybook/`) and the Material Lab (`public/lab/`) through lane 1a's `pages` job; no Vercel, no `gh-pages`, no GitHub workflow. Merge after `gitlab-status.mjs --sha <head>` succeeds.
5. Remote-first: docs static build, render gate, shadcn interop, quickstart (verdaccio container), axe, Lighthouse and plain-CSS specs run only in GitLab jobs on the Playwright image. Locally: bounded `rg`, `git`, `node -e`, `npx jest <one node test file>`.
6. Forbidden: hand-written numbers outside claims; claims without an artifact source; pages for non-exported symbols; recipe strings ported into blocks; colour literals, `!important`, inline optics or viewport-only classes in blocks; `Math.random`/wall clock/network in block fixtures; marking an item certified without the render gate; lowering a Lighthouse, axe or size budget; skipped tests; mocks in remote specs; `certification/**` imports (PLAT's own pixel gates live in `tests/dx/lib/pixel-gates.ts`); MCP network I/O, file writes or child processes; any LLM call (MCP calls none, so Kiro Prism does not apply).
7. Evidence as artifacts; `apps/docs/out/`, `apps/docs/generated/**`, `registry/registry.json` and `apps/docs/public/r/**` are git-ignored outputs.
8. Credentials: none; packages publish only from the tag pipeline.
9. Conventional commits; RM-13 is one squash commit `refactor(5.0)!: remove 4.x docs and tests`; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

#### Prerequisites

None except the frozen contract and C0. Verify on `origin/next`: `src/contracts/{components,testing,fragments}.ts` (S-30, S-31, S-40..S-42, S-46), seeds `src/theme/index.ts` (incl. `GlassPreferencesPanel`, S-24) and `src/material/index.ts`, `.storybook/blocks/index.tsx` seed (S-51), `tests/contract-doubles/{cmp,tokens,reports}/`, `build/exports.manifest.json`. Lane 1c's `gen-deprecations.mjs --docs` (PLAT-179) is consumed by the migration guide (task edge PLAT-396); until it lands, the guide renders `pending` sections from the fragment doubles.

Contract seams consumed: S-01, S-06, S-10, S-11, S-21, S-24, S-30, S-31, S-33, S-35, S-37, S-38, S-39, S-40..S-44, S-46 (you provide the registry build), S-51, S-55 (`PerfReport`, `ReleaseVerdict` for claims).

#### May touch

`apps/docs/**` (inside `content/` only `content/plat/**`); `scripts/docs/**`; `scripts/registry/**`; `registry/schema/**`, `registry/base/**`, `registry/blocks/{auth,settings}/**`, `registry/items/{code-surface,diff-viewer,gantt,kanban,react-hook-form,rich-text,transfer-list}/**`; `packages/{registry,mcp}/**`; `README.md`, `README.tmpl.md`, `llms.txt`, `llms.txt.tmpl` (on `next`); `.lighthouserc.js`; `stories/plat/**`; `docs/{quickstart,guides,migration}/**`; `docs/inventory/registry-recipe-fates.json`; `docs/release/decisions/removals/RM-13.json`; RM-13 paths (`docs/components/**`, `docs/guides/{consciousness-interface,consciousness-migration,migration,ssr-setup}.md`, `docs/liquid-glass/migration.md`, `docs/recipes/readme.md`, `docs/cli/migration.md`, `docs/theme/theme-engine.md`, `docs/app-shell/readme.md`, `docs/package-entrypoints.md`, `docs/readme.md`, `INSTALLATION.md`, `legacy/tests/**`); `scripts/ci/verify-markdown-links.js`; deletion `scripts/ci/verify-recipes-render.js`; `tests/{registry,docs}/**` except `tests/docs/runbook.test.ts`; `tests/dx/**` except lane 1e's files.

#### Must not touch

Other owners' `registry/{blocks,items}/<id>/**` (SURF: `app-frame`, `ai-workspace`, `data-workspace`, `analytics-dashboard`, `media-viewer`, `overlay-flows`, `support-inbox`, `mobile-settings`, `schema-viewer`, `ai-sdk-adapter`, …) — the build and render gate discover them; `apps/docs/content/<other stream>/**` (MAT owns Theming and Choosing a material); `.storybook/**` except importing `.storybook/blocks/index.tsx`; `docs/{motion,design-tokens}.md` (MAT); `docs/certification/**` (QUAL); `docs/release/**` other than `removals/RM-13.json`; `docs/release-rollback-deprecation.md`, `docs/auraglass-5/**`; `ci/**`; `package.json` root; `src/**`.

#### Steps

1. PLAT-350: `scripts/docs/paths.mjs` (`DOCS_BASE_URL` = `$CI_PAGES_URL` until OD-12).
2. PLAT-351..357 (REQ-94/95): registry build (every owner's `registry-item.json`, deterministic, certified-SHA filter, size limits, `@auraglass/registry` data), generated `auraglass` base item, schema/build tests, `packages/registry` + `PUBLISHING.md`, shadcn interop spec, registry lint with one seeded failing fixture per rule.
3. PLAT-358..367 (REQ-96): blocks `auth` and `settings` (index, deterministic fixtures, colocated stories with `parameters.ag`, `layout.assert.json`) and the seven PLAT items; render test on seeds and doubles that runs unchanged on real exports.
4. PLAT-368..373 (REQ-97/98): `tests/dx/lib/pixel-gates.ts` (+ unit test), the render gate over every block and item (Next 16 and Vite, 1440/390, light/dark, glass/solid, axe incl. forced colors and contrast more, landmarks, keyboard, touch targets, JS and long-task budgets, pixel gates), recipe fates file and test (committed 4.x id fixture), delete `verify-recipes-render.js` once the gate runs.
5. PLAT-374..385 (REQ-99..102): docs app (Next 16 static export from the packed tarball, exact nav), `Example`/`Claim`/`PropsTable`/`PartsTable`, PLAT content, IA tests, generated component pages and markdown from metas (TSDoc thresholds), PLAT guides (Tailwind v4, plain CSS, shadcn, Next.js, Vite, React Router, RSC table, testing, AI agents), snippet compiler (0 failures vs baseline 79/278), case-sensitive link checker, imports/links/axe/Lighthouse gates, `.lighthouserc.js`.
6. PLAT-386..388 (REQ-103): quickstarts (<= 6 commands, <= 2 manual edits, `{step}` blocks), alpha-smoke fixture, quickstart spec over four cells with timing and material-presence gates.
7. PLAT-389..395 (REQ-104, 106): claims generator/renderer/lint and allow-list, generated README from `README.tmpl.md` (quickstart and release-banner markers), claims tests, generated `llms.txt` (<= 12 KB, version-locked) and `llms-full.txt`, `@auraglass/mcp` with the five tools and the permission-model run (by rc.1).
8. PLAT-396..398 (REQ-105): migration guide template and Migrate pages (from MUI, Radix, Lucide), anchors per entry and B-id, guide test, generated `stories/plat/{migration,packaging}/*.generated.mdx` importing only `.storybook/blocks/index.tsx`.
9. PLAT-399..402 (REQ-83): generated redirects with 301s via `public/_redirects` and `/v4`, redirect/removed tests, RM-13 consumer-grep record (lane 1c's tool), then the RM-13 family PR through `plat:gate:removal`.

#### Tests

Node (in `plat:test:registry`, `plat:test:docs`, `plat:gate:glass-quality`): `tests/registry/{schema,build,lint,plat-blocks,recipe-fates}.test.*`; `tests/docs/{docs-artifact,docs-ia,docs-pages,tsdoc-coverage,docs-content,docs-imports,links,lint-claims,readme-generated,llms,migration-guide,redirects,docs-removed}.test.ts`; `tests/dx/lib/pixel-gates.test.ts`; `packages/mcp/test/tools.test.ts`.
Remote (GitLab Playwright runner): `tests/dx/registry-render.spec.ts`, `tests/dx/registry-shadcn-interop.spec.ts`, `tests/dx/quickstart.spec.ts` (clean container + verdaccio), `tests/dx/plain-css.spec.ts`, `tests/dx/docs-a11y.spec.ts` (Chromium, WebKit, 390×844), `tests/dx/docs-lighthouse.spec.ts`; docs static build in `plat:build:docs` (<= 10 min, `out/` <= 150 MB); Pages deploy by lane 1a.

#### Visual evidence

Render-gate captures for every block/item cell (Next and Vite × 1440×900 and 390×844 × light/dark × glass/solid; `mobile-settings` also 360×740) with per-cell assertion JSON; quickstart first-render screenshots per cell with timings; docs route screenshots at 320, 390 and 1440 px with axe JSON; Lighthouse reports for the three probe pages — all GitLab artifacts, linked from the claims and the release notes.

#### Exit criteria

- AC-PLAT-28: `registry.json` validates; every block of every owner listed and certified at the GA SHA; registry lint 0 violations; render gate passes every cell with 0 console/page errors; shadcn interop installs and builds.
- AC-PLAT-29: all four quickstart cells pass on the GA SHA within <= 300 s (Next) / <= 240 s (Vite) rendering `app-frame` with material presence and 0 console errors.
- AC-PLAT-30: 0 snippet failures, 0 import-lint, 0 broken links; every route axe-clean; Lighthouse budgets met; no page for a non-exported symbol; one guide anchor per entry; 0 unsourced claims, every claim's artifact SHA equals the GA SHA; `llms.txt` version equals `package.json`, <= 12 KB.
- AC-PLAT-31 (registry, MCP): `@auraglass/registry` and `@auraglass/mcp` published with GitLab provenance; the five MCP tools pass schema tests under the permission model.
- AC-PLAT-32 (RM-13): record present, revert-dry-run green, redirects resolve.

#### Final report

```
#### PROMPT_1f report (PLAT registry, docs and agent DX)
PRs: <urls>  Head SHA: <next>  Pages URL: <CI_PAGES_URL>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Registry: items listed / certified / omitted (registry-report.json)
Docs: snippet failures, broken links, axe violations, Lighthouse scores, build time, out/ size
Claims: resolved / pending (cross-stream artifact missing)
Quickstart: cell -> seconds, material presence, console errors
Deviations / Blockers: <exact output>
```

