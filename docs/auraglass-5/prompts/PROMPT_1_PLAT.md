# PROMPT-1 (PLAT): AuraGlass Platform and Release stream — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1, key PLAT, REQ-PLAT-01..106, AC-PLAT-01..33).
Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`; it wins over the PRD and over every prompt).
Decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` D-01..D-32 (its §16 decomposition is replaced).
Task fragment: `docs/auraglass-5/tasks/PLAT.json` (PLAT-001..PLAT-402, 402 tasks; field `lane` selects the prompt).
Archived specifics reused: `docs/auraglass-5/archive/v1-19-prd/prompts/PROMPT_0{0,1,2}*`, `PROMPT_08f*`, `PROMPT_18*`/DX prompts; archived ids are kept in each task's `source` field.
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`.

PLAT owns the whole `release/4.x` line (4.1.1 trust patch, 4.2/4.3/4.4 bridge, LTS), the 5.0 build and artifact gates, GitLab CI/CD and npm publishing, change control and deprecations, compat composition, the `migrate 4to5` engine and CLI, the registry, the docs site and agent DX, and the deletion of `legacy/**`. It is split into six lanes. **All six start on day 0 and run at the same time; their files are disjoint; no lane waits for another lane or for any other stream.**

## Lane table

| Prompt | Lane | Branch prefixes | REQ-PLAT (primary) | AC-PLAT | Tasks |
|---|---|---|---|---|---|
| `PROMPT_1a_PLAT_CI.md` | 1a-CI: GitLab CI/CD, Pages, npm publishing | `next-plat/ci-*`, `4x-plat/ci-*` | 01–17, 51 | 01, 02, 03, 14, 18 (dist-tags), 31 (publish docs), 33 | PLAT-001..054 |
| `PROMPT_1b_PLAT_4X.md` | 1b-4X: 4.1.1 trust patch, 4.2/4.3 bridge, frozen fixture | `4x-plat/4x-*` (release/4.x only) | 37–50, 52–63 | 01–13, 15–17, 20 | PLAT-055..167 |
| `PROMPT_1c_PLAT_REL.md` | 1c-REL: change control, deprecations, ledger, train, removal RM-01..12 | `next-plat/rel-*`, `next-plat/rm-<nn>-*`, `4x-plat/rel-*` | 18–36, 79–82 | 15–19, 23, 32 | PLAT-168..241 |
| `PROMPT_1d_PLAT_BUILD.md` | 1d-BUILD: 5.0 build, exports, artifact gates, CSS, canaries | `next-plat/build-*`, `next-plat/canary-*` | 64–78 | 22–27 | PLAT-242..298 |
| `PROMPT_1e_PLAT_CLI.md` | 1e-CLI: `@auraglass/cli`, `migrate 4to5`, type DX | `next-plat/cli-*` | 84–93 | 20, 21, 31 (CLI) | PLAT-299..349 |
| `PROMPT_1f_PLAT_DX.md` | 1f-DX: registry, docs site, claims, llms.txt, MCP, RM-13 | `next-plat/dx-*`, `next-plat/rm-13-*` | 83, 94–106 | 28–30, 31 (registry, MCP) | PLAT-350..402 |

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
