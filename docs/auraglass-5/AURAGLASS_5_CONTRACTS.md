# AuraGlass 5.0 frozen cross-stream contract

| Field | Value |
|---|---|
| Contract version | `contract-v1.2` (additive bundle FIN-463, items C-1..C-17, effective only after owner decision OD-16 is recorded; v1.1 frozen 2026-10-06 was the pre-C0 amendment for GitLab CI/CD and the adversarial-review fixes, §8) |
| CI/CD | **GitLab CI only** (Gurbaksh's instruction, 2026-10-06). No GitHub Actions workflow is used for build, test, certification, deploy or publish. Pipelines run in the mirror project `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project id 87152036); `github.com/auraoneai/auraglass` stays the git source of truth and the place where PRs are opened and merged (§4.13) |
| Replaces | Architecture §16 decomposition and execution waves; `archive/v1-19-prd/prd/_shared-contracts.md` (SC-01..SC-40) as the ownership authority. SC rows are reused below where they still hold and are cited as `(was SC-nn)` |
| Still binding | Architecture decisions D-01..D-32 and §3–§15 of `AURAGLASS_5_TARGET_ARCHITECTURE.md`, plus errata E-01..E-11 (archived `_shared-contracts.md` §J) |
| Streams | 5 PRDs, all starting on day 0, none waiting on another (table below) |

| Key | Path key | PRD file | Absorbs (archived keys) | Scope in one line |
|---|---|---|---|---|
| PLAT | `plat` | `AURAGLASS_PLATFORM_RELEASE_PRD.md` | TRUST, REL, PKG, DX, plus FND removal and extraction execution | the whole `release/4.x` line, build, exports, packaging, gates, change class, compat entry, codemod engine, CLI, registry, docs site, removals |
| MAT | `mat` | `AURAGLASS_MATERIAL_SYSTEM_PRD.md` | DS, MAT, MOT, A11Y | tokens and compiler, `src/material/**`, tiers and lens, motion, preference store, provider, script, portal root, LayerStack, a11y rungs |
| CMP | `cmp` | `AURAGLASS_CORE_COMPONENTS_PRD.md` | FND (foundation pattern, primitives, T0/T2 core), CTL, OVL | Base UI wrapping pattern, KEEP primitives, flagships 1–13 and 15–21, T2 core, icons |
| SURF | `surf` | `AURAGLASS_PRODUCT_SURFACES_PRD.md` | NAV, DATA, AI, MED, EXP | flagships 14 and 22–44, the `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./charts` entries, labs, area registry blocks |
| QUAL | `qual` | `AURAGLASS_QUALITY_SHOWCASE_PRD.md` | QA, SB, PERF | certification lanes L1–L14, scenes, perf harness, Storybook and Material Lab harness, showcases, test helpers, contract-conformance tests |

Flagship 14 (`./date`) moves from CTL to SURF because it ships from a SURF-owned entry. That is the only change to the archived flagship split.

---

## 1. Purpose and change control

### 1.1 What this contract does

The 19-PRD plan had 1,487 cross-group dependency edges and 75 files claimed by more than one group (`archive/v1-19-prd/cross-prd-coupling-analysis.txt`). That made the work sequential. This contract removes every one of those edges by fixing up front everything that one stream consumes from another:

1. **Ownership.** Every path in the repository has exactly one owner stream (§3). Only the owner creates, edits, renames or deletes it.
2. **Seams.** Every name, type, attribute, CSS custom property, CSS layer, class name, module path and function signature that crosses a stream boundary is written out here verbatim (§4). Streams code and test against the text of this contract, not against each other's progress.
3. **Fragments.** Every file that several streams used to edit is either split into per-owner fragment files that a generator merges, or has its full final content written here and is owned by one stream (§3.4, §4.8).
4. **Seeds.** Every runtime module that another stream imports exists from day 0 as a contract seed at its final path, with its final exports (§4.10). The owner replaces the seed's internals; consumers never rewire.
5. **Integration and GA.** Integration is continuous. GA is a checklist gate on the release, never a dependency between PRDs (§6).

### 1.2 Rules for every stream

- **R1. No cross-stream dependency.** No PRD and no task may list another PRD, or another PRD's task, as a dependency. A task fragment's `depends_on` may contain only task ids of the same stream. A need for something another stream builds is met by citing a contract seam id (`S-nn`) in the task's `contract` field.
- **R2. One owner per path.** §3 is authoritative. A PR that touches a path owned by a different stream fails the `contract:ownership` job (§3.1). The only exception is a contract PR (§1.3).
- **R3. Code to the contract.** Consumers import only the module paths and names in §4. They never import a stream's internal file. The ESLint rule `auraglass/contract-boundary` (owned by PLAT, content in §4.11) enforces this.
- **R4. Never block.** If the real implementation of a seam has not merged, the consumer tests against the seed or the stub (§5). A stream never waits, and never asks another stream to hurry.
- **R5. Never ship a stub.** Seeds carry the marker `@ag-contract-seed`. Stubs live under `contracts/stubs/**` and `tests/contract-doubles/**`. Both are banned from `dist/` and from the tarball, and GA requires zero seed markers in `src/` (§6.2).

### 1.3 Change control

- The contract changes only through a **contract PR**: a PR whose title starts with `contract:`, whose branch is `contract/<topic>`, and which edits this file, plus any of the contract-held paths in §3.2 row group A.
- A contract PR needs approval from all 5 stream owners (CODEOWNERS on contract-held paths lists all 5 owner teams). A stream owner who has not reviewed within 2 business days is treated as approving, except for a change to that owner's own seam.
- **Additive changes** (a new export name, a new fragment field marked optional, a new data attribute, a new allowed dependency) bump the minor version (`contract-v1.1`), and every stream may adopt them immediately.
- **Breaking changes** (renaming or removing a seam, changing a signature, or moving ownership of a path) bump the major version and must ship with: the seed updated in the same PR, the conformance test updated in the same PR, and a migration note in §8. A breaking change is accepted only if it removes a defect. Convenience is not a reason.
- The contract PR updates the seeds (§4.10) and the generated `.github/CODEOWNERS` in the same commit, so `next` never holds a contract that its seeds do not implement.
- A contract PR never waits on implementation, and implementation never waits on a contract PR. If a stream needs a seam that does not exist, it opens the contract PR and keeps working on its own paths in the meantime.
- Contract PRs merge into `next`. Any change to `src/contracts/fragments.ts` or `src/contracts/load-fragments.mjs` is cherry-picked by PLAT to `release/4.x` on the same day.

### 1.4 Precedence

Gurbaksh's live instructions come first, then this contract, then the architecture, then the 5 PRDs. A PRD that contradicts this contract is wrong and is corrected by a PRD edit; the contract wins until then.

---

## 2. Branch and worktree model

### 2.1 Long-lived branches

| Branch | Cut from | Purpose | Owner of the branch policy | Publishes |
|---|---|---|---|---|
| `main` | existing | Frozen at C0 except for contract PRs and planning docs. At GA, PLAT merges `next` into `main`, and `main` becomes the 5.x line | PLAT | nothing until GA; then `latest` (5.x) |
| `release/4.x` | tag `v4.1.0` (commit `15b6de6f7`, "release: AuraGlass 4.1.0") | 4.1.1 trust patch, 4.2.0 bridge, 4.3.0 preview, 4.4.0 if needed, then 4.x LTS for 12 months after 5.0 GA | PLAT | `latest` until 5.0 GA, then `v4-lts` |
| `next` | `main` at C0 (§2.2) | All 5.0 work by all 5 streams | PLAT (merge policy); each stream owns its paths | `next` dist-tag: `5.0.0-alpha.N`, `-beta.N`, `-rc.N` |

Verified on 2026-10-06: the repository has only `main` locally and `origin/main` and `origin/gh-pages` remotely. Neither `release/4.x` nor `next` exists yet. Both are created by C0 on GitHub; the GitLab mirror receives them through the org-managed mirror (§4.13.1). `gh-pages` is retired: docs, Storybook and Material Lab deploy through GitLab Pages (§4.13.6).

The 4.x line and the 5.0 line run at the same time. Nothing on `next` waits for a 4.x release, and nothing on `release/4.x` waits for 5.0 work. The only ordering between the lines is a **release gate** (§6.2, item G-07): a 5.0 removal ships at GA only if its deprecation entry has shipped in a published 4.x minor. That gate decides what goes into the GA tag. It never stops a stream working.

### 2.2 C0, the contract bootstrap commit

C0 is the commit that adopts this contract. It is authored from the verbatim text of §3 and §4 by the contract steward (PLAT's lead acting for all 5 streams), reviewed under §1.3, and merged before any stream branch is created. C0 is part of adopting the contract, not a stream deliverable, so it is not a dependency edge. It contains exactly:

| # | Content | Section |
|---|---|---|
| C0-1 | `release/4.x` created at `v4.1.0`; `next` created at `main` | §2.1 |
| C0-2 | `src/contracts/*.ts`, verbatim | §4.2–§4.9 |
| C0-3 | Seed modules at their final owner paths, with `@ag-contract-seed` | §4.10 |
| C0-4 | Pre-declared files with their final content: `src/index.ts`, `src/root/*.ts`, `eslint.config.js`, `eslint-plugin-auraglass.js`, `jest.config.js`, `playwright.config.ts`, `certification/playwright.cert.config.ts`, `.storybook/main.ts`, `.changeset/config.json`, `build/exports.manifest.json`, `docs/dependency-allowlist.json` | §4.11 |
| C0-5 | Root `package.json` dependency, peer, optional-peer and devDependency sets and `workspaces`, plus the regenerated `package-lock.json` | §4.12 |
| C0-6 | Empty fragment files `fragments/<kind>/<stream>.ts` for every kind and stream | §3.4 |
| C0-7 | `contracts/ownership.json` (machine form of §3.2), `contracts/legacy-ownership.json` (the §3.1a keep list), `contracts/lint-rule-owners.json` (§4.11), `contracts/packages.json` (§4.12), and the generated `.github/CODEOWNERS` | §3, §4.11, §4.12 |
| C0-8 | `contracts/stubs/reference.css` and `tests/contract-doubles/**` | §5 |
| C0-9 | On `release/4.x` only: C0-6 for `fragments/deprecations/*` and `fragments/codemods/*`, plus `src/contracts/fragments.ts` and `src/contracts/load-fragments.mjs` | §2.4 |
| C0-10 | On `next` only: the legacy quarantine (`git mv` of `src/**` and `tests/**` into `legacy/`, except the keep list) | §3.1a |
| C0-11 | On **both** branches, the CI bootstrap (GitLab only, §4.13): (a) `.github/workflows/{deploy-storybook,design-system-compliance,glass-pipeline,publish-npm,visual-regression}.yml` are deleted on `main`, `next` and `release/4.x`; `.github/workflows/mirror-to-gitlab.yml` is org-managed and left untouched; no other file is ever added under `.github/workflows/`; (b) the root `.gitlab-ci.yml`, verbatim from §4.13.3, containing the contract jobs `contract:ownership`, `contract:conformance` and `contract:ci-fragments`; (c) the five seed fragments `ci/{plat,mat,cmp,surf,qual}.gitlab-ci.yml` (§4.13.4). On `release/4.x` the PLAT seed fragment already carries the 4.x equivalents of the deleted workflows (`plat:gate:glass-quality`, `plat:integration:next`, `plat:integration:vite`, `plat:publish:npm`, `pages`), so the 4.1.1 trust patch has CI from day 0; (d) seeds of `scripts/ci/verify-ownership.mjs` and `scripts/ci/verify-ci-fragments.mjs` (PLAT; final logic per §3.1 and §4.13.4, each about 60 lines) and of `tests/contract/{ownership,fragments,material,preferences,components}.test.ts*` (QUAL; the §6.3 assertions that hold against seeds) | §2.3, §4.13, §6.3 |
| C0-12 | Storybook bootstrap: the full `.storybook/main.ts`, the seed `.storybook/preview.tsx` and the seed docs blocks `.storybook/blocks/index.tsx` in §4.11, so every stream can run Storybook on day 0 without QUAL's harness | §4.11 |
| C0-13 | Build seeds that other streams' builds call (no stream runs another stream's unfinished generator): `scripts/tokens/build.mjs` (MAT seed, writes `dist/tokens/manifest.json`, `dist/tokens.css` and the committed generated files from `PUBLIC_CSS_VARS` and `MOTION_CSS_VARS`), `scripts/build/api-report.mjs` (PLAT seed: `npm run api:update -- --entry <entry>` writes a report listing the barrel's value exports; api-extractor replaces it later without changing the CLI), and the frozen root `package.json` script names of §4.12 | §4.10, §4.12 |

### 2.3 Per-stream branches and worktrees

- Each stream works in its own git worktree on its own branch line: `next-plat/*`, `next-mat/*`, `next-cmp/*`, `next-surf/*` and `next-qual/*`, cut from `next`. PLAT's 4.x work uses `4x-plat/*`, cut from `release/4.x`. The other streams use `4x-<stream>/*` only for their own deprecation fragments and, for MAT, the bridge content (row group H).
- Worktree layout (local editing only; all heavy work runs remotely per the machine policy): `../AuraGlass.wt/<stream>/` via `git worktree add ../AuraGlass.wt/<stream> -b next-<stream>/<topic> origin/next`.
- **Merge cadence.** Each stream merges small PRs into `next` whenever its own checks are green, and at least once per working day while it has open work. Streams never batch across days, and never wait for another stream's PR.
- **Required checks on a stream PR** (`REQUIRED_JOBS`, §4.9): `contract:ownership` (every path is owned by the PR's stream), `contract:conformance` (§6.3), `contract:ci-fragments`, the PR-scoped lane jobs `qual:certify:l*` and `plat:gate:glass-quality`, all from the GitLab pipeline of the PR's head SHA on its mirrored branch. A lane that fails only because of code on paths the PR does not own is reported as `pre-existing` and does not block that PR (QUAL's lane runner computes this from `contracts/ownership.json`).
- **How a GitHub PR is gated by a GitLab pipeline.** PRs are opened and merged on GitHub; GitLab never sees an MR (the mirror is one-way). The merge rule is: the GitLab pipeline for the PR head SHA has finished `success` (every job that is not `allow_failure: true` passed). The merging stream checks it with `node scripts/ci/gitlab-status.mjs --sha <sha>` (PLAT; reads the public pipelines API `GET /projects/87152036/pipelines?sha=<sha>` with no token, or `glab ci status` with the machine's existing `glab` login) and pastes the pipeline URL into the PR. If the owner enables status reporting back to GitHub (OD-9, §7.4), GitHub branch protection on `next` and `release/4.x` requires that single GitLab pipeline status context instead, and the manual step disappears.
- **Required-check activation (no stream waits for another's job).** At C0 only the three `contract:*` jobs are blocking (`allow_failure: false`), and C0-11 ships them working. Every other job starts with `allow_failure: true` and becomes blocking only after it has run green on `next` once; **the job's own stream** flips it to `allow_failure: false` in its own fragment (`ci/<stream>.gitlab-ci.yml`), so no admin action and no other stream is involved. A job is never made blocking in a state where it cannot pass on `next` as it is.
- **Bot sync exemption.** The daily fragment-sync PRs of §2.4.2 and §2.4.5 use the branch prefix `sync/fragments-` and may touch only `fragments/deprecations/**` and `src/internal/deprecations.generated.ts` (on `next`) or `fragments/codemods/**` (on `release/4.x`). `verify-ownership.mjs` accepts exactly those globs for that prefix, and nothing else. Because no GitLab job may hold a GitHub credential (machine policy), these PRs are opened by PLAT's operator, not by CI: `node scripts/release/sync-fragments.mjs --to next|release/4.x` run from a PLAT worktree, which pushes the branch and opens the PR with the existing `gh` login. It is a PLAT chore and never a dependency for another stream (§3.1 rule 5 keeps stale copies harmless).
- **Pre-release tags** (`5.0.0-alpha.N` and later) are cut by PLAT from whatever is on `next` on the train date. A stream whose work is not merged by the cut ships in the next pre-release. The train never waits.

### 2.4 Line-crossing rules (`release/4.x` and `next`)

1. **On `release/4.x`, PLAT owns every path** except the fragment files of other streams (`fragments/deprecations/<stream>.ts` and `fragments/codemods/<stream>.ts`), each stream's CI fragment `ci/<stream>.gitlab-ci.yml` (row A20, owned by that stream on both branches; only MAT has 4.x jobs, for the bridge content) and the 4.2/4.3 bridge content paths in §3.2 row group H, which MAT owns on both branches. PLAT executes every 4.x fix itself, including the ones whose domain belongs to another stream (D-28 visual fixes, the GlassSwitch shimmer removal, the FPS-loop fix, the GlassWorkspaceTabs prop leak, the GlassCommandPalette regex escape and the cookie-consent fix). Domain streams may review these PRs, but their review is advisory and never required.
2. **Deprecation fragments are authored on `release/4.x` only.** Every stream writes its own `fragments/deprecations/<stream>.ts` there, because each entry must ship in a 4.x minor (G-07). On `next` these files are read-only mirrors. A PLAT-owned bot PR syncs them once a day with `git checkout origin/release/4.x -- fragments/deprecations` and nothing else. Each file has a single owner on both branches, so the sync cannot conflict.
3. **No general forward-merge.** `release/4.x` is never merged wholesale into `next`. A 4.x fix that also applies to a file that survives on `next` is cherry-picked by **that file's `next` owner**, using the `forward-port` label that PLAT applies when the fix merges on 4.x. Security fixes have a 2-business-day service level. The cherry-pick is the owner's own work and blocks no one.
4. **Nothing flows from `next` to `release/4.x`**, except MAT's bridge content (row group H), which MAT lands on both branches itself.
5. **Codemod mapping fragments** (`fragments/codemods/<stream>.ts`) are authored on `next`, because the 5.0 targets exist there. They are mirrored to `release/4.x` by the same daily bot PR, in the opposite direction, so that the 4.3 beta CLI ships them.

### 2.5 Merge-conflict policy

- **Path conflicts cannot happen between streams**, because no two streams own the same path. A conflict between two PRs from the same stream is that stream's problem.
- **Shared-content conflicts are designed out.** Aggregates (`deprecations.json`, `docs/size-budgets.json`, `tests/perf/harness/budgets.json`, `registry/registry.json`, `build/css-ownership.json`, `packages/cli/src/migrate/4to5/mappings/*.json`, `CHANGELOG.md`) are build outputs that are generated and git-ignored (§3.4). The one exception is `CHANGELOG.md`, which changesets writes on release commits only.
- **The lockfile.** `package-lock.json` is owned by PLAT. The dependency sets are frozen in C0 (§4.12), so no other stream changes it. A dependency change is a contract PR, and PLAT regenerates the lockfile in that same PR.
- **Contract seam files** (`src/contracts/**`) are never edited outside a contract PR. If two contract PRs conflict, the second rebases. Neither one blocks stream work.
- **Identical adds.** This contract does **not** rely on several streams creating the same file. Every seam file is created once, in C0 (§2.2). The choice is deliberate: identical adds merge cleanly only while the bytes are identical, and one formatter difference turns them into a conflict.

---

## 3. File ownership map

### 3.1 Rules

1. **First match wins.** §3.2 is an ordered list of globs (picomatch syntax, `dot: true`), matched top to bottom. Its machine form is `contracts/ownership.json` (C0-7), which preserves the same order and expands every `<stream>` placeholder into five literal rows. The `ownership` check (PLAT, `scripts/ci/verify-ownership.mjs`, GitLab job `contract:ownership`) fails any PR that touches a path whose owner is not the PR's stream, and any path whose first matching row has owner `NONE` (row D02x). The PR's stream comes from its branch prefix: `next-<stream>/`, `4x-<stream>/`, `4x11-<stream>/` (line `4x`, OD-13, C-17), `next-fin/<wp>-`, `4x-fin/`, `4x11-fin/` (REQ-FIN-30), `contract/` (CONTRACT) or `sync/fragments-` (§2.3). On `release/4.x` and `release/4.1.x`, non-PLAT prefixes may touch only that stream's own fragments, its CI fragment and row group H. Since v1.2 the prefix rules are also machine-readable in `contracts/ownership.json#branchRules` (rule kinds `stream`, `4x-zone`, `fin-wp`, `any-owned`, `sync`, `report-only`, `fail-closed`); `verify-ownership.mjs` implements them and `scripts/ci/fin-ownership.json` holds the PRD-F §6 work-package table used by `fin-wp`.
2. **Branch scope.** Rows apply on `next`. On `release/4.x`, rule §2.4.1 applies: PLAT owns every path except the fragments of other streams and row group H.
3. **`CONTRACT` owner.** Paths owned by `CONTRACT` change only in a contract PR (§1.3).
4. **Fallback.** The last row assigns any unmatched path to PLAT. A stream that needs a new top-level directory opens a contract PR to add a row. It does not put files under someone else's glob.
5. **Generated files** (marked *gen*) are git-ignored build outputs. The owner named is the owner of the generator. Nobody hand-edits them. **Exception: generated files that other code imports at type-check time are committed**, so that no stream ever has to run another stream's generator before `tsc`, Jest or Storybook works. They are: `src/tokens/index.ts`, `src/motion/tokens.generated.ts`, `src/material/css/generated/{ladders,floors}.css` (MAT, regenerated only in MAT PRs; MAT's L1 drift check fails if the committed copy differs from a fresh compile) and `src/internal/deprecations.generated.ts` (PLAT, regenerated by the daily `sync/fragments-` bot PR right after the deprecation mirror). Each starts life as its C0 seed. A stale committed copy is never an error for a consumer: `warnDeprecated(id)` with an id missing from the table warns `[aura-glass] <id> is deprecated; see deprecations.json`.

### 3.1a Legacy quarantine (C0-10)

On `next` only, C0 runs `git mv` on every tracked path under `src/` and `tests/` into `legacy/src/` and `legacy/tests/`. The exceptions are the keep list below, which is **copied** to the same path under `src/`, so legacy files keep resolving their relative imports. Effects:

- PLAT owns `legacy/**` and deletes it family by family. Each family is one revertable PR, following architecture §14.6, and is preceded by the AuraOne consumer grep (§13.2).
- `legacy/**` is outside the 5.0 typecheck, lint, Jest, Storybook and build graph from C0 onward. The `tsconfig.json` `exclude`, `jest.config.js`, `eslint.config.js` and `.storybook/main.ts` content in §4.11 encodes this. So no 5.0 stream can be broken by legacy code, and no 5.0 stream needs legacy code to build.
- A stream that wants to read a 4.x source reads `legacy/src/...` on `next`, or the same path on `release/4.x`. Legacy code is never imported.
- `reports/` (47,342 tracked files, verified 2026-10-06) is not moved. PLAT removes it from the tree on both branches (4.1.1 item), with no history rewrite.

Keep list (copied to `src/`, then owned and rewritten in place by the named stream):

| Path at C0 | Owner on `next` | Why it is kept (architecture) |
|---|---|---|
| `src/primitives/{Slot,Portal,FocusScope,Label,DismissableLayer}.tsx` | CMP | KEEP primitives (§6, was SC-26). These five import only `react`/`react-dom` (verified 2026-10-06). The 4.x alias subdirectories `src/primitives/{slot,portal,focus,label,dismissable-layer}/**` are **not** kept: `focus/{ScreenReader,SkipLinks}.tsx` import `@/design-system/utilsCore`, which is legacy, so copying them would break the 5.0 typecheck on day 0. Their 4.x alias names (`GlassSlot`, `GlassPortal`, ...) are compat entries (`src/compat/cmp/`). `VisuallyHidden.tsx` does not exist at C0 (verified) and is a new CMP file |
| `src/icons/**` | CMP | one module per glyph (§3.2); relative imports only (verified) |
| `src/theme/color.ts`, `src/theme/materials.ts`, `src/theme/createGlassTheme.ts`, `src/theme/createBrandGlassTheme.ts` | MAT | `color.ts` kept (§7.3); `createGlassTheme` keeps its call shape (§5.4) and imports `./color` and `./materials` (`materials.ts` has no imports, verified), so `materials.ts` must be kept too or the `src/theme/index.ts` seed fails to compile; `createBrandGlassTheme` becomes `createBrandTheme` |
| `tokens/**` (3 files at C0) | MAT | the DTCG tree root (§5.1) |

Everything else under `src/` and `tests/` at C0 is legacy. That includes all 498 inventoried components: 153 REMOVE, 34 DEPRECATE, 157 CONSOLIDATE, 75 REDESIGN, 49 POLISH, 22 REPLACE and 8 KEEP (counted from `component-inventory.json`, 2026-10-06). A REDESIGN or CONSOLIDATE target is written fresh at its 5.0 path by its owner (§3.3), and the legacy file is deleted by PLAT. So no file is ever edited by both the remover and the rebuilder.

### 3.2 Ownership table (ordered; first match wins)

**A. Contract-held and fragments**

| # | Glob | Owner | Notes |
|---|---|---|---|
| A01 | `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` | CONTRACT | this file |
| A02 | `src/contracts/**` | CONTRACT | seam types and loader (§4.2–§4.9) |
| A03 | `contracts/**` | CONTRACT | `ownership.json`, `legacy-ownership.json`, `schemas/**`, `stubs/**` |
| A04 | `tests/contract-doubles/**` | CONTRACT | test doubles (§5) |
| A05 | `.github/CODEOWNERS` | CONTRACT | generated from `contracts/ownership.json` in each contract PR |
| A06 | `src/index.ts`, `src/compat/index.ts`, `src/root/index.ts` | CONTRACT | verbatim (§4.11) |
| A07 | `src/root/cmp.ts` · `src/root/surf.ts` · `src/root/mat.ts` | CMP · SURF · MAT | per-owner root barrels (§4.7) |
| A08 | `fragments/*/plat{.ts,.json}`, `fragments/*/plat/**` | PLAT | §3.4 |
| A09 | `fragments/*/mat{.ts,.json}`, `fragments/*/mat/**` | MAT | §3.4 |
| A10 | `fragments/*/cmp{.ts,.json}`, `fragments/*/cmp/**` | CMP | §3.4 |
| A11 | `fragments/*/surf{.ts,.json}`, `fragments/*/surf/**` | SURF | §3.4 |
| A12 | `fragments/*/qual{.ts,.json}`, `fragments/*/qual/**` | QUAL | §3.4 |
| A13 | `.changeset/config.json` | CONTRACT | verbatim (§4.11) |
| A14 | `.changeset/<stream>-*.md` (for example `.changeset/surf-table-virtual.md`) | that stream | the filename prefix is enforced by `ownership` |
| A15 | `lint/rules/<stream>/**` | that stream | auto-discovered lint rules (§4.11) |
| A16 | `stories/<stream>/**` | that stream | docs-only stories and MDX |
| A17 | `apps/docs/content/<stream>/**` | that stream | hand-written guides (for example MAT's "Choosing a material") |
| A18 | `docs/auraglass-5/AURAGLASS_PLATFORM_RELEASE_PRD.md` · `…MATERIAL_SYSTEM_PRD.md` · `…CORE_COMPONENTS_PRD.md` · `…PRODUCT_SURFACES_PRD.md` · `…QUALITY_SHOWCASE_PRD.md` (and `prompts/<stream>/**`, `tasks/<KEY>.json`) | PLAT · MAT · CMP · SURF · QUAL | each stream owns its own PRD, prompt and task fragment |
| A19 | `.gitlab-ci.yml` | PLAT | root pipeline, verbatim (§4.13.3). PLAT may change only the image and `AG_NPM_VERSION` values in `variables`, and `AG_PAGES_BRANCH`/`AG_V4_DIST_TAG` at GA; anything else is a contract PR |
| A20 | `ci/<stream>.gitlab-ci.yml`, `ci/<stream>/**` | that stream (on both branches) | the stream's CI fragment and its helper files, included by the root through `include: local: 'ci/*.gitlab-ci.yml'` (§4.13.4). This is the CI ownership seam |

**B. Root, build, release and repo configuration**

| # | Glob | Owner | Notes |
|---|---|---|---|
| B01 | `legacy/**` | PLAT | quarantine (§3.1a) |
| B02 | `package.json`, `package-lock.json` | PLAT | dependency sets frozen (§4.12) |
| B03 | `tsconfig.storybook.json` | QUAL | listed before B04 on purpose |
| B04 | `tsconfig*.json`, `tsdown.config.ts`, `rollup.config.js`, `vite.config.ts`, `api-extractor.base.json`, `.dependency-cruiser.js`, `.npmignore`, `.gitignore`, `.prettierrc`, `.husky/**`, `.bundlesizerc`, `.lighthouserc.js`, `.dockerignore`, `.env.example`, `.eslintignore`, `patches/**` | PLAT | |
| B05 | `eslint.config.js`, `eslint-plugin-auraglass.js`, `.eslintrc.js` | PLAT | first two verbatim (§4.11); `.eslintrc.js` is deleted |
| B06 | `stylelint.showcase.config.mjs` | QUAL | |
| B07 | `stylelint.config.mjs`, `stylelint-plugin-auraglass/**` | MAT | `no-raw-design-values` stylelint half (was SC-17) |
| B08 | `jest.config.js`, `jest.*.config.js`, `jest.setup.js`, `playwright.config.ts`, `playwright.*.config.ts`, `vitest.storybook.config.ts`, `__mocks__/**` | QUAL | `jest.config.js`, `playwright.config.ts` verbatim (§4.11) |
| B09 | `.storybook/main.ts` | QUAL | verbatim story globs (§4.11) |
| B10 | `.storybook/**` | QUAL | `preview.tsx`, `lab/**`, `environment/**`, `contract/**`, `cert-manifest.json` (*gen*) |
| B11 | `.github/workflows/**` | PLAT (deletion only) | GitHub Actions are not used (CI/CD rule). C0-11 deletes `deploy-storybook`, `design-system-compliance`, `glass-pipeline`, `publish-npm` and `visual-regression`. `mirror-to-gitlab.yml` is org-managed: no stream edits it, and it is outside every PRD (OD-8). Any other file added here fails `contract:ci-fragments` |
| B12 | `.github/**` | PLAT | issue and PR templates only (`CODEOWNERS` is row A05). GitHub is used for git hosting, PRs, CODEOWNERS review and labels, never for CI |
| B12a | `.gitlab/**` | PLAT | GitLab-side templates, if any (no CI content: all CI is in A19/A20) |
| B13 | `deprecations.json` | PLAT *gen* | generated at `prepack` from `fragments/deprecations/*` and shipped in the tarball |
| B14 | `CHANGELOG.md`, `README*.md`, `RELEASE_NOTES_*.md`, `SECURITY.md`, `INSTALLATION.md`, `CONTRIBUTING.md`, `LICENSE`, `llms.txt` | PLAT | `CHANGELOG.md` is written by changesets on release commits only |
| B15 | `build/exports.manifest.json` | PLAT | verbatim (§4.7) |
| B16 | `build/**` | PLAT | `css-ownership.json` *gen* from `fragments/css/*` |
| B17 | `docs/dependency-allowlist.json` | PLAT | verbatim (§4.12) |
| B18 | `docs/size-budgets.json` | PLAT *gen* | from `fragments/size-budgets/*`; `docs/size-budgets.changelog.md` is PLAT |
| B19 | `docs/certification/**` | QUAL | |
| B20 | `docs/{motion,design-tokens}.md` | MAT | moved to `apps/docs/content/mat/` |
| B20a | `docs/auraglass-5/capability-ledger.json`, `docs/auraglass-5/capability-ledger.schema.json` | SURF | the expansion capability ledger (archived EXP-001..093, SURF-only). Its gate moves from `scripts/ci/verify-capability-ledger.mjs` to `scripts/surf/verify-capability-ledger.mjs` (row E03) and joins CI through F `lanes`; its release-notes section is read by PLAT's generator from the ledger file, so SURF never edits a PLAT script |
| B21 | `docs/**` | PLAT | `release/decisions/`, `schemas/`, `guides/`, `migration/`, `inventory/`, `quickstart/`, `security/` |
| B22a | `etc/api/<entry>.api.md`, `etc/api/<entry>.exports.json`, `etc/api/<entry>.css-api.json`, where `<entry>` is the subpath key without `./` (`material`, `theme`, `tokens`, `motion` → MAT; `primitives`, `icons`, `forms` → CMP; `app-shell`, `data`, `date`, `ai`, `media`, `backdrops`, `three`, `charts` → SURF; `cli` → PLAT) | owner of the `ENTRIES` row | API reports are written by the entry owner in its own PR with `npm run api:update -- --entry <entry>` (PLAT's tool, seeded at C0-13 with its final CLI, so no owner waits for api-extractor wiring). `css-api.json` is the public-CSS report (archived MAT-041 `material.css-api.json` → `etc/api/material.css-api.json`). The two composed entries are reported per owner barrel: root as `etc/api/root.<stream>.api.md` from `src/root/<stream>.ts` (cmp, surf, mat; replaces the archived single `etc/api/index.api.md`), and `./compat` as `etc/api/compat.<stream>.api.md` from `src/compat/<stream>/index.ts` (all five), each owned by that stream. So an API change never needs a PR on another stream's path |
| B22 | `etc/api/**` | PLAT | report tooling, config and any other API report (was SC-04) |
| B23a | `canaries/next16/app/<stream>/**`, `canaries/vite/src/<stream>/**`, `canaries/<app>/fixtures/<stream>/**` | that stream | per-stream canary pages (archived SURF `canaries/next16/app/{ai-rsc,data-server}/page.tsx` → `canaries/next16/app/surf/{ai-rsc,data-server}/page.tsx`; CMP `canaries/next16/app/server/page.tsx` → `canaries/next16/app/cmp/server/page.tsx`). The Next app discovers them through the App Router; the Vite app's PLAT-owned entry renders `import.meta.glob('./*/**/*.page.tsx', { eager: true })` as routes `/<stream>/<file>`. So no stream edits a PLAT canary file |
| B23 | `canaries/**` | PLAT | consumer canary apps (lane L11 runs them) |
| B24 | `bin/**`, `server/**`, `Dockerfile`, `docker-compose*.yml`, `nginx.conf`, `*.mjs` at repo root (`probe-*`, `audit-*`, `inspect-*`, `list-stories`, `webkit-probe`) | PLAT | removed or extracted (§13.2) |
| B25 | `reports/**`, `visual-baselines/**`, `examples/**` | PLAT | removed from the tree |

**C. Source (`src/`, 5.0 tree on `next`)**

| # | Glob | Owner | Notes |
|---|---|---|---|
| C01 | `src/material/**`, `src/tokens/**`, `src/theme/**`, `src/a11y/**`, `src/motion/**`, `src/styles/**`, `src/hooks/**` | MAT | `./material`, `./tokens`, `./theme`, `./motion`, the a11y rungs, `styles.css` sources. `GlassPreferencesPanel` lives at `src/theme/preferences-panel/` |
| C02 | `src/compat/mat/**` | MAT | compat adapters for 4.x theme, provider, material and motion names |
| C03 | `src/foundation/**`, `src/primitives/**`, `src/icons/**`, `src/forms/**` | CMP | the wrapping pattern, `./primitives`, `./icons`, `./forms` |
| C04 | `src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition,timeline}/**` | SURF | root-exported SURF flagships (§4.7). Listed before C05 on purpose |
| C05 | `src/components/**` | CMP | every other 5.0 component directory (§3.3) |
| C06 | `src/compat/cmp/**` | CMP | |
| C07 | `src/app-shell/**`, `src/data/**`, `src/date/**`, `src/ai/**`, `src/media/**`, `src/backdrops/**`, `src/charts/**`, `src/three/**` | SURF | entries `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./charts` (5.1), `./three` |
| C08 | `src/compat/surf/**` | SURF | |
| C09 | `src/internal/**`, `src/compat/plat/**`, `src/compat/css/**` | PLAT | `warnDeprecated`, `cn`, the `deprecations.generated.ts` *gen*, `compat/globals.css` source |
| C10 | `src/**/*.stories.tsx`, `src/**/*.lab.stories.tsx`, `src/**/__tests__/**`, `src/**/*.test.ts(x)`, `src/**/*.meta.ts` | owner of the containing directory | listed for clarity; these are already matched by C01–C09, because a colocated file follows its directory |
| C11 | `src/**` | PLAT | anything else, including new top-level `src/` directories, until a contract PR assigns it |

**D. Tests**

| # | Glob | Owner | Notes |
|---|---|---|---|
| D01 | `tests/contract/**`, `tests/helpers/**`, `tests/a11y/apg/harness.ts`, `tests/a11y/browser/**`, `tests/storybook/**`, `tests/showcase/**` | QUAL | conformance, helper API (S-40), APG harness, axe lane |
| D02 | `tests/{a11y/apg,a11y/manual/records,a11y/manual/scripts,perf/browser,visual,e2e,ssr,rsc,types,lint}/<stream>/**` | that stream | the per-stream subdirectory pattern for every shared test kind. A stream's browser tests of preference rungs, motion or a11y behaviour that the archive put in `tests/a11y/browser/` (QUAL, D01) go to `tests/e2e/<stream>/` |
| D02x | `tests/{a11y/apg,a11y/manual/records,a11y/manual/scripts,perf/browser,visual,e2e,ssr,rsc,types,lint}/*/**` and `tests/{a11y/apg,a11y/manual/scripts,perf/browser,visual,e2e,ssr,rsc,types,lint}/*` (any direct child of a D02 kind that is not one of the five stream directories, except `tests/a11y/apg/harness.ts` and `tests/a11y/apg/__selftest__/**`, which D01 already matched) | `NONE` | invalid location: `contract:ownership` fails with "use tests/<kind>/<stream>/". Re-parsing the archived tasks found 40 archived paths of this form (for example `tests/e2e/app-shell/layout.spec.ts`, `tests/visual/controls/controls-matrix.visual.spec.ts`, `tests/lint/no-simulation.test.ts`); they relocate to `tests/<kind>/<stream>/<area>/…` (§7.1 R-02). Without this row they would silently fall through to QUAL (D05/D10) or MAT (D06). QUAL's own lane-level specs also live under `tests/<kind>/qual/` |
| D03 | `tests/fixtures/consumer-4x/cases/<stream>/**` | that stream | the frozen 4.x usage cases each stream contributes (authored on `release/4.x`, §2.4) |
| D04 | `tests/fixtures/consumer-4x/**` | PLAT | harness, `package.json`, `flagship-subset.json` (was SC-08) |
| D05 | `tests/perf/**`, `tests/fixtures/**`, `tests/visual/**`, `tests/e2e/**` | QUAL | harness, `budgets.json` *gen*, shared fixtures, lane-level specs |
| D06 | `tests/{material,tokens,motion,theme,a11y}/**` | MAT | |
| D07 | `tests/{controls,overlays,foundation,primitives,icons,compiler}/**` | CMP | |
| D08 | `tests/{app-shell,data,date,ai,media,backdrops,charts,labs,capability}/**` | SURF | |
| D09 | `tests/{release,build,deps,pack,ci,dx,exports,side-effects,react19,css,removal,registry,compat,deprecations,docs}/**` | PLAT | gate tests live with the gate's owner. So `tests/perf/{size-budgets,size-budgets-ratchet,dist-purity,ci-wiring}.test.ts` move to `tests/build/`. These directories hold PLAT's cross-cutting gate tests only: a stream's tests of its **own** entry, compat adapters, registry blocks or private gate go to its own area directory (D06–D08) or `tests/<kind>/<stream>/` (§7.1 R-03; for example archived `tests/exports/data-date-entries.test.ts` → `tests/data/exports/data-date-entries.test.ts`, `tests/registry/pricing.test.tsx` → `tests/capability/registry/pricing.test.tsx`, `tests/ci/verify-optics-css.test.ts` → `tests/material/gates/verify-optics-css.test.ts`) |
| D10 | `tests/**` | QUAL | fallback for tests |

**E. Scripts**

| # | Glob | Owner | Notes |
|---|---|---|---|
| E01 | `scripts/tokens/**` | MAT | compiler, transforms, formats, gates, lens maps (`scripts/tokens/lens-maps.mjs`) |
| E02 | `scripts/storybook/**`, `scripts/audit/**` | QUAL | `scripts/audit/` is dev-only and never a required check (was SC-11) |
| E03 | `scripts/{mat,cmp,surf,qual}/**` | that stream | stream-private gates and tools, registered as lanes (§4.9). For example `scripts/surf/verify-ai-purity.mjs` and `scripts/mat/verify-optics-css.mjs` |
| E04 | `scripts/**` | PLAT | `ci/`, `ci/lib/`, `release/`, `build/`, `docs/`, `registry/`, `removal/`, `codemods/internal/`, and every 4.x script |

**F. Packages, apps, registry, showcase, certification, tokens**

| # | Glob | Owner | Notes |
|---|---|---|---|
| F01 | `packages/qa/**` | QUAL | private, never published |
| F02 | `packages/labs/**` | SURF | `@auraglass/labs` and its admission gate |
| F03 | `packages/{cli,registry,mcp}/**` | PLAT | the codemod engine reads `fragments/codemods/*` |
| F04 | `apps/docs/**` | PLAT | after A17 |
| F05 | `registry/{blocks,items}/<id>/**` | per §3.3 table | each item directory carries its own `registry-item.json` |
| F06 | `registry/**` | PLAT | `registry/base/**`, `registry/registry.json` *gen*, schema, build, lint |
| F07 | `showcase/**` | QUAL | compositions import SURF/CMP registry blocks (§5.3) |
| F08 | `certification/**` | QUAL | lanes, scenes, runner, review, thresholds, `RELEASE_CHECKLIST.md` |
| F09 | `tokens/**` | MAT | DTCG sources (was SC-18) |

**H. Bridge content on `release/4.x` (MAT on both branches)**

| # | Glob (on `release/4.x`) | Owner | Content |
|---|---|---|---|
| H01 | `src/material/**`, `tokens/**`, `scripts/tokens/**` | MAT | the 4.2 experimental `aura-glass/material` generated by the 5.0 compiler (D-19) |
| H02 | `src/styles/v5.css`, `src/styles/preview-v5.css` | MAT | the 4.3 `data-ag-preview="v5"` subtree preview (D-19) |
| H03 | `compat/tokens.css` source map `tokens/compat-alias-map.json` | MAT | `--glass-*` read aliases (D-18) |

PLAT wires these into the 4.x exports map and provider. Specifically, it adds the `preview` provider prop with the type `preview?: 'v5'` (S-22 note).

**Z. Fallback**

| # | Glob | Owner |
|---|---|---|
| Z01 | `**` | PLAT |

### 3.3 Component, block and item ownership

**5.0 component directories** (`src/components/<kebab>/`, files per archived FND §4.1: `<Name>.tsx`, `<Name>.client.tsx`, `<Name>.css`, `<Name>.meta.ts`, `index.ts`, colocated tests and stories):

| Owner | Directories |
|---|---|
| CMP (flagships 1–13) | `button`, `icon-button`, `button-group`, `toolbar`, `toggle-group`, `segmented-control`, `switch`, `slider`, `checkbox`, `radio-group`, `text-field`, `search-field`, `select`, `combobox`, `number-field`, `field` (Field, Fieldset, Form) |
| CMP (flagships 15–21) | `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip`, `menu` (Menu, ContextMenu, Menubar), `toast` |
| CMP (T0 non-material) | `text`, `heading`, `stack`, `grid`, `container`, `icon` |
| CMP (T2 core) | `card`, `badge`, `avatar`, `alert`, `progress`, `meter`, `skeleton`, `separator`, `kbd`, `accordion`, `collapsible`, `link`, `scroll-area`, `rating`, `inline-edit`, `file-upload`, `color-picker`, `description-list`, `image-list`, `tour`, `state-view` (EmptyState, ErrorState, LoadingState) |
| SURF (root-exported, row C04) | `tabs`, `tab-bar`, `breadcrumbs`, `pagination`, `command-palette` (CommandPalette, Command), `source-transition`, `timeline` (Timeline, ActivityFeed) |
| SURF (entry trees, row C07) | `src/app-shell/` (AppShell, Sidebar, TopBar, StatusBar, Inspector, ResizablePanels, MobileShell); `src/data/` (Table, TreeView, FilterBar, Chip, KeyValueEditor, StatCard, Sparkline, ChartFrame); `src/date/` (DateField, TimeField, DatePicker, DateRangePicker, Calendar, TimePicker, RangeCalendar); `src/ai/`; `src/media/`; `src/backdrops/` |
| MAT | `src/theme/preferences-panel/` (`GlassPreferencesPanel`) |

A new component directory needs a contract PR only when its owner is ambiguous. A CMP directory not listed above is still CMP under row C05.

**Registry blocks and items** (`registry/blocks/<id>/`, `registry/items/<id>/`). Block ids are from the archived SC-32. The rule is **one owner per block, with no cross-stream contributions**. A block composes other streams' public exports only, coded against §4.

| Owner | Blocks (GA unless marked) | Items |
|---|---|---|
| SURF | `app-frame`, `ai-workspace`, `data-workspace`, `analytics-dashboard`, `media-viewer`, `support-inbox`, `mobile-settings`; 5.x: `commerce-cart`, `commerce-checkout`, `pricing`, `audit-log`, `permissions-matrix` | `ai-*` (incl. `ai-eval-dashboard`, `ai-sdk-adapter`, `ai-markdown`, `ai-model-picker`, `ai-artifact-panel`, `ai-trace-tree`, `ai-voice-input`), `app-shell-workspace`, `backdrop-hero`, `comment-thread`, `faceted-search`, `presence-stack`, `query-builder`, `schema-viewer`, `tree-select`, `media-*` (incl. `media-audio-player`, `media-gallery`, `media-now-playing`, `media-transcript`, `media-video-player`) |
| CMP | `overlay-flows` | `account-menu`, `confirm-dialog` |
| PLAT | `auth`, `settings` | `code-surface`, `diff-viewer`, `gantt`, `kanban`, `react-hook-form`, `rich-text`, `transfer-list` (§13.5) |
| `registry/base/**` | PLAT, generated from MAT's `dist/tokens` outputs through the S-11 token manifest | — |

**Composition rule for blocks and items.** A block or item composes only CMP exports (S-30), MAT seams (S-05..S-26) and its own owner's components. SURF exports have no frozen cross-stream prop contract, so anything that composes a SURF component is SURF-owned. That is why `support-inbox` (archived DX-080: Table + Thread), `mobile-settings` (DX-079: MobileShell) and `schema-viewer` (DX-085: Table) move from PLAT to SURF in v1.1; the archived edges DX-079←NAV-095, DX-080←DATA-108/AI-075 and DX-085←DATA-108 had no seam under v1.0.

The archived plan had `settings` built by DX with OVL and CTL contributions. Under this contract PLAT builds the whole `settings` block from CMP's contract props (S-30) and MAT's `GlassPreferencesPanel` (S-24). Showcase `ai-command-center` imports `registry/blocks/ai-workspace`; `financial-dashboard`, `analytics` and `ops-console` import `data-workspace`/`analytics-dashboard`/`app-frame`; `media-workspace` and `music-player` import `media-viewer`; `collaborative-workspace` and `mobile-productivity` compose public entries directly. Showcase files themselves are QUAL's (row F07).

**Block file contract.** Every block directory exports its composition from `registry/blocks/<id>/index.tsx` and its deterministic sample data from `registry/blocks/<id>/fixtures.ts` (no `Math.random`, no wall clock, no network). Showcases import only those two files and public entries. They never import a stream's internal fixtures (for example `src/ai/__fixtures__/`); the archived SB-103/AI-080 hand-off of AI session data becomes `registry/blocks/ai-workspace/fixtures.ts`, written by SURF.

### 3.4 Fragment kinds (per-owner files merged by a loader)

Every fragment is a TypeScript module, `fragments/<kind>/<stream>.ts`, whose default export `satisfies` the type named below from `src/contracts/fragments.ts` (§4.8). The two ratchet baselines and the Playwright project lists are JSON, because a gate writes the baselines and Playwright loads its config synchronously. Each stream's own typecheck validates its fragments, so a stream never needs another stream's generator to know its fragment is valid. Consumers read fragments only through the contract loader `loadFragments(kind)` (`src/contracts/load-fragments.mjs`, §4.8), never through an aggregate. Aggregates exist only for publishing and for humans, and they are git-ignored build outputs.

| Kind | File | Type | Read by (owner) | Aggregate output (*gen*, git-ignored) | Replaces (archived) |
|---|---|---|---|---|---|
| `deprecations` | `fragments/deprecations/<stream>.ts` (authored on `release/4.x`, §2.4) | `DeprecationEntry[]` | PLAT change-class gate, CLI `doctor`, docs migration guide; QUAL L3 | root `deprecations.json` (in the tarball), `src/internal/deprecations.generated.ts` | SC-02/03, OV-01 |
| `codemods` | `fragments/codemods/<stream>.ts` | `CodemodMappingFragment` | PLAT `migrate 4to5` engine; QUAL L11 canary | `packages/cli/src/migrate/4to5/mappings/<stream>.json` | SC-33 mapping data, DX-048 tables |
| `size-budgets` | `fragments/size-budgets/<stream>.ts` | `SizeBudgetRow[]` | PLAT `scripts/ci/verify-size-budgets.mjs` (L2) | `docs/size-budgets.json` | SC-15, OV-07 |
| `perf-budgets` | `fragments/perf-budgets/<stream>.ts` | `PerfBudgetRow[]` | QUAL `tests/perf/harness/run-perf.mjs` (L10) | `tests/perf/harness/budgets.json` | SC-15 runtime half |
| `lanes` | `fragments/lanes/<stream>.ts` | `LaneRegistration[]` | QUAL `certification/lanes.config.ts` | none | SC-29 "add projects by MODIFY" |
| `playwright` | `fragments/playwright/<stream>.json` (JSON, because Playwright configs load synchronously) | `PlaywrightProjectFragment[]` | `playwright.config.ts`, `certification/playwright.cert.config.ts` (verbatim, §4.11) | none | OV-22 |
| `css` | `fragments/css/<stream>.ts` | `CssFragment[]` | PLAT CSS assembly (`styles.css`, per-subpath CSS) | `build/css-ownership.json`, `dist/**/*.css` | SC-20 layer content owners |
| `side-effects` | `fragments/side-effects/<stream>.ts` | `SideEffectException[]` (target: empty) | PLAT `scripts/ci/verify-side-effects.mjs` | none | OV-24 |
| `review` | `fragments/review/<stream>.ts` | `ReviewItem[]` | QUAL L14 human visual review | `certification/review/checklist.json` | MAT/QA review split |
| `literals-baseline` | `fragments/literals-baseline/<stream>.json` | `LiteralsBaseline` (counts for the stream's own files only) | MAT `scripts/tokens/gates/literals.mjs` (L1), which writes each stream's file with `--update --stream <s>` | none | SC-17 single baseline |
| `a11y-baseline` | `fragments/a11y-baseline/<stream>.json` | `A11yBaseline` | QUAL L5 axe run; MAT a11y CSS gates | none | `scripts/ci/a11y-baselines/` |

Three more per-owner inputs are discovered without a fragment file:

- **Registry items.** `registry/{base,blocks,items}/<id>/registry-item.json` (shadcn schema) is globbed by PLAT's `scripts/registry/build.mjs`.
- **Component metadata.** `src/**/<Name>.meta.ts` (`ComponentMeta`, S-31) is globbed by PLAT docs, QUAL inventory and lanes, and PLAT codemod checks.
- **Stories.** `parameters.ag` on stories (`StoryAgParameters`, S-41) is read by QUAL's subject resolver.

### 3.5 Resolution of the files touched by more than one group

The archived coupling analysis lists 75 multi-group files. Re-parsing all 2,405 archived tasks, with brace and directory entries expanded, finds 85 (2026-10-06). All 85 are resolved below, plus the analysis's `n/a` pseudo-entry. Mechanisms: **Q** = legacy quarantine, deleted by PLAT (§3.1a); **P** = pre-declared final content, one owner (§4.11–§4.12); **F** = per-owner fragment (§3.4); **D** = per-stream subdirectory (row D02/E03); **S** = seam, consumed through §4; **O** = single owner, with the other claimants' needs met through a seam. The Ref column holds labels, not a count. Grouped rows (for example 54–58) cover several paths. The table covers all 85 files, plus `src/compat/index.ts` and `n/a`.

| Ref | Path (claimants) | Owner | Mechanism and resolution |
|---|---|---|---|
| 1 | `package.json` (all 5) | PLAT | P: dependency sets, `workspaces`, `exports` (generated from B15) frozen in §4.12; scripts are PLAT's |
| 2 | `eslint.config.js` (all 5) | PLAT | P: verbatim loader config (§4.11); rules come from `lint/rules/<stream>/` |
| 3 | `eslint-plugin-auraglass.js` (all 5) | PLAT | P: verbatim plugin loader that globs `lint/rules/*/*.cjs` (§4.11). The rule-name table (§4.11) fixes each rule's owner |
| 4 | `.eslintrc.js` (PLAT, QUAL) | PLAT | Q: deleted (ESLint 9 flat config only) |
| 5 | `docs/dependency-allowlist.json` (all 5) | PLAT | P: verbatim (§4.12); a change is a contract PR |
| 6 | `docs/size-budgets.json` (all 5) | PLAT *gen* | F `size-budgets` |
| 7 | `playwright.config.ts` (CMP, MAT, QUAL, SURF) | QUAL | P + F `playwright` |
| 8 | `jest.config.js` (CMP, PLAT, QUAL) | QUAL | P: verbatim; discovers tests by location, so nobody registers anything |
| 9 | `certification/playwright.cert.config.ts` (CMP, MAT, QUAL) | QUAL | P + F `playwright` |
| 10 | `certification/lanes.config.ts` (MAT, QUAL, SURF) | QUAL | F `lanes` |
| 11 | `certification/lanes/environment-visual.spec.ts` (MAT, QUAL, SURF) | QUAL | S: subjects come from `parameters.ag` (S-41) and meta (S-31), never from edits to the spec |
| 12 | `certification/review/` (MAT, QUAL) | QUAL | F `review` |
| 13 | `.github/workflows/certify-pr.yml` (all 5) | QUAL → `ci/qual.gitlab-ci.yml` | Q: GitHub workflow not created (CI/CD rule). P: lane job names fixed in §4.9 (`CERT_JOBS`); jobs run `node certification/run.mjs --lane <id> --scope $AG_SCOPE`, which discovers registrations from F `lanes` |
| 14 | `.github/workflows/glass-pipeline.yml` (MAT, PLAT, QUAL, SURF) | PLAT → `ci/plat.gitlab-ci.yml` | Q: deleted at C0-11. P: the required job names (`REQUIRED_JOBS`, §4.9); stream gates join through F `lanes` (kind `node-script`) or the stream's own CI fragment (row A20) |
| 15 | `.github/workflows/artifact.yml` (PLAT, QUAL, SURF) | PLAT → `ci/plat.gitlab-ci.yml` | O: job `plat:package:pack`; SURF and QUAL artifact checks register through F `lanes` and read the tarball through `AURAGLASS_TARBALL` (dotenv artifact, §4.13.5) |
| 16 | `.github/workflows/publish-npm.yml` (PLAT, QUAL) | PLAT → job `plat:publish:npm` | Q: deleted at C0-11. O: GitLab tag pipeline with npm trusted publishing over GitLab OIDC (§4.13.7); reads QUAL's `ReleaseVerdict` artifact (S-55) through an `optional: true` need, never QUAL's job internals |
| 17 | `.github/workflows/visual-regression.yml` (PLAT, QUAL) | PLAT (deletion, both branches) | Q: deleted at C0-11. On `release/4.x` the TRUST-062 evidence-only visual job becomes `plat:test:visual-4x` in `ci/plat.gitlab-ci.yml`; on `next` visual regression is QUAL lane L7 (`qual:certify:l7`) |
| 18 | `.storybook/preview.tsx` (MAT, PLAT, QUAL, SURF) | QUAL | S: globals are the preference keys of S-20 and the scene ids of S-42, so no other stream edits the preview |
| 19 | `.storybook/main.ts` (PLAT, QUAL) | QUAL | P: verbatim story globs (§4.11) |
| 20 | `CHANGELOG.md` (MAT, PLAT, SURF) | PLAT | F: changesets `.changeset/<stream>-*.md` (row A14) |
| 21 | `deprecations.json` (CMP, MAT, PLAT, SURF) | PLAT *gen* | F `deprecations` |
| 22 | `build/exports.manifest.json` (MAT, PLAT, SURF) | PLAT | P: verbatim (§4.7) |
| 23 | `build/css-ownership.json` (MAT, PLAT) | PLAT *gen* | F `css` |
| 24 | `tests/perf/harness/budgets.json` (MAT, QUAL, SURF) | QUAL *gen* | F `perf-budgets` |
| 25 | `scripts/tokens/gates/literals-baseline.json` (CMP, MAT) | MAT gate | F `literals-baseline` (split per stream) |
| 26 | `scripts/ci/verify-side-effects.mjs` (CMP, PLAT, QUAL, SURF) | PLAT | F `side-effects` |
| 27 | `scripts/ci/verify-pack.js` (CMP, PLAT) | PLAT | O; CMP's Base UI duplicate check is a PLAT rule over the frozen pin (§4.12) |
| 28 | `scripts/ci/verify-flagship-deliverables.mjs` (QUAL, SURF) | PLAT row E04 (moves to `packages/qa/src/deliverables/`, QUAL) | S: reads meta (S-31) and §11.3; SURF adds nothing |
| 29 | `scripts/docs/gen-selectors.mjs` (CMP, PLAT) | PLAT | S: reads `ComponentMeta.parts` and `migration.selectors` |
| 30 | `scripts/release/visual-class.mjs` (PLAT, SURF; QUAL depended on it through QA-072) | PLAT | O; QUAL's L7 writes the `VisualClassReport` artifact itself from `VISUAL_TOLERANCE` (S-55), and PLAT's change-class gate only reads that file. The archived QA-072→REL-040 edge (QUAL's job calling PLAT's script) is gone |
| 31 | `scripts/ensure-component-inventory.js` (PLAT, QUAL) | PLAT | Q: deleted; replaced by `packages/qa/src/inventory/buildInventory.ts` (QUAL) |
| 32 | `src/index.ts` (CMP, PLAT, SURF) | CONTRACT | P: verbatim; content comes from the per-owner `src/root/*.ts` (§4.7) |
| 33 | `src/primitives/index.ts` (CMP, PLAT) | CMP | O: the `./primitives` barrel; its export list is frozen in §4.7 |
| 34 | `src/primitives/Slot.tsx` (CMP, PLAT) | CMP on `next`; PLAT on `release/4.x` (4.x `props.ref` fallback) | keep list + §2.4 |
| 35–37 | `src/primitives/{Portal,DismissableLayer,VisuallyHidden}.tsx` (CMP, MAT) | CMP | O: MAT's behaviour requirements become CMP tests; the portal container comes from S-23 |
| 38 | `src/primitives/GlassCore.tsx` (CMP, PLAT) | PLAT | Q: successor `Surface` (MAT) |
| 39 | `src/theme/AuraGlassProvider.tsx` (MAT, PLAT) | MAT | S-22 seed; PLAT's 4.x old-provider wrapping happens on `release/4.x` only |
| 40 | `src/theme/index.ts` (MAT, PLAT) | MAT | S-22 seed (the `./theme` export list, §4.7) |
| 41 | `src/tokens/glass.ts` (MAT, PLAT) | PLAT on `release/4.x`; on `next`, Q, with successor `src/tokens/index.ts` (MAT, generated) | §2.4 |
| 42 | `src/styles/index.css` (MAT, PLAT) | MAT | O: source sheets are MAT's; PLAT assembles them from F `css` |
| 43 | `src/styles/glass.css` (CMP, MAT) | PLAT | Q: successor `src/material/css/material.css` (MAT) |
| 44 | `src/material/css/material.css` (CMP, MAT) | MAT | S: CMP reads the class and attribute contract (S-01..S-05); CMP CSS goes in `src/components/*/<Name>.css` under `@layer ag.components` |
| 45 | `src/components/button/Button.css` (CMP, MAT) | CMP | S: uses only S-03 public vars and S-01 attributes |
| 46 | `src/components/dialog/Dialog.css` (CMP, MAT) | CMP | same |
| 47 | `src/components/button/Button.stories.tsx` (CMP, QUAL) | CMP | S: story contract S-41; QUAL checks it and never writes it |
| 48 | `src/components/dialog/Dialog.stories.tsx` (CMP, QUAL) | CMP | same |
| 49 | `src/components/input/GlassSwitch.tsx` (CMP, MAT) | PLAT | `release/4.x`: PLAT removes the shimmer (D-28 list). `next`: Q, successor `src/components/switch/` (CMP) |
| 50 | `src/components/accessibility/ContrastGuard.tsx` (CMP, MAT, PLAT) | PLAT | 4.1.1 honesty cut on `release/4.x`; Q on `next`. CMP's absence check and MAT's test become one PLAT test |
| 51–52 | `src/components/cookie-consent/CookieConsent.tsx` and its `__tests__/visibility.test.tsx` (MAT, PLAT) | PLAT | `release/4.x` privacy fix (was SC-36). Q on `next` |
| 53 | `src/components/interactive/GlassCommandPalette.tsx` (PLAT, SURF) | PLAT | `release/4.x` regex escape (crash). Q on `next`, successor `src/components/command-palette/` (SURF) |
| 54–58 | `src/components/`, `src/components/advanced/`, `src/components/interactive/`, `src/components/navigation/` (CMP, MAT, PLAT, SURF) | PLAT | Q: all legacy. 5.0 directories are owned per §3.3 |
| 59 | `src/icons/__tests__/icon-a11y.test.tsx` (CMP, MAT) | CMP | O; MAT's decorative-icon rule is a CMP requirement |
| 60 | `src/stories/AppShell.stories.tsx` (QUAL, SURF) | PLAT | Q; SURF writes `src/app-shell/AppShell.stories.tsx` |
| 61 | `src/stories/AppChromeVisualBaseline.stories.tsx` (QUAL, SURF) | PLAT | Q (was SB-106) |
| 62 | `src/stories/blocks/` (PLAT, SURF) | owner of each block | D: stories colocate in `registry/blocks/<id>/` |
| 63 | `src/stories/migration/` (PLAT, QUAL) | PLAT | D: `stories/plat/migration/` |
| 64 | `src/compat/index.ts` (PLAT) | CONTRACT | P: verbatim; areas live in `src/compat/<stream>/` |
| 65 | `registry/registry.json` (PLAT, SURF) | PLAT *gen* | discovered from `registry-item.json` files |
| 66–70 | `registry/blocks/{analytics-dashboard,app-frame,media-viewer}/` (PLAT, SURF); `registry/blocks/{overlay-flows,settings}/` (CMP, PLAT) | SURF ×3; CMP (`overlay-flows`); PLAT (`settings`) | O per §3.3 |
| 71–74 | `showcase/{ai-command-center,financial-dashboard,media-workspace,music-player}/*.showcase.tsx` (QUAL, SURF) | QUAL | S: compositions come from SURF-owned registry blocks (§3.3) |
| 75 | `tests/fixtures/consumer-4x/` (CMP, MAT, PLAT, SURF) | PLAT harness | D: `cases/<stream>/` (row D03) |
| 76 | `tests/a11y/browser/axe.spec.ts` (MAT, SURF) | QUAL | S: the subject list comes from S-41 |
| 77 | `tests/a11y/manual/sr-record.schema.json` (MAT, SURF) | CONTRACT | moves to `contracts/schemas/sr-record.schema.json`, the single SrRecord schema since v1.2 (C-16: it gains the optional evidence fields `atVersion`, `browser`, `browserVersion`, `os`, `osVersion`, `device`, `subject`, `steps[]` of the MAT copy; MAT's verifier and QUAL's aggregator both read it, and the MAT copy is deleted); records go to `tests/a11y/manual/records/<stream>/` |
| 78 | `tests/css/class-coverage.test.ts` (PLAT, SURF) | PLAT | O: one test covering every `className` in `src/` |
| 79–80 | `tests/dx/codemod-canary.spec.ts`, `tests/dx/registry-render.spec.ts` (PLAT, SURF) | PLAT | F `codemods`; blocks are discovered |
| 81 | `tests/exports/root-export-count.test.ts` (CMP, PLAT) | PLAT | P: asserts the root list in §4.7 |
| 82 | `tests/side-effects/import-gate.test.ts` (PLAT, SURF) | PLAT | F `side-effects` |
| 83–84 | `tests/perf/{size-budgets,size-budgets-ratchet,dist-purity,ci-wiring}.test.ts` (PLAT, QUAL) | PLAT | moved to `tests/build/` (row D09) |
| 85 | `release/4.x` (branch, CMP, MAT, PLAT, SURF) | PLAT | §2.4.1 |
| — | `n/a` (tasks with no file: issues, sign-offs, decisions) | each task's own stream | becomes a `gate` field on the release checklist (§6.2), never a dependency |

---

## 4. Seam interfaces (exact content)

### 4.1 Seam inventory

The **Form** column says how the seam exists from day 0. **T** = type-only module under `src/contracts/` (CONTRACT-owned, verbatim below). **Seed** = a runtime module at the owner's final path, created by C0 with the marker `@ag-contract-seed` (§4.10); the owner replaces its internals without changing its exports. **P** = a pre-declared file (§4.11–§4.12). **F** = a fragment kind (§3.4).

| Id | Seam | Owner (implements) | Consumers | Form | Module path consumers import |
|---|---|---|---|---|---|
| S-01 | `data-ag-*` attribute registry and values | MAT (registry); each attribute's setter per §4.2 | all | T | `src/contracts/material.ts` |
| S-02 | Class-name grammar (`ag-surface`, `ag-<component>`, `ag-<component>__<part>`) | MAT (`ag-surface`); component owners | all | T | `src/contracts/material.ts` |
| S-03 | Public CSS custom properties | MAT | CMP, SURF, PLAT (compat, Tailwind bridge), QUAL | T | `src/contracts/tokens.ts` |
| S-04 | CSS layer names, order statement and layer content owners | PLAT (statement); per-layer owners | all CSS authors | T | `src/contracts/tokens.ts` |
| S-05 | Material API types and `materialProps()` | MAT | CMP, SURF, QUAL (Lab) | T + Seed | types `src/contracts/material.ts`; runtime `src/material/index.ts` |
| S-06 | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `useMaterialTier` | MAT | CMP, SURF, QUAL, PLAT (blocks) | Seed | `src/material/index.ts` |
| S-10 | Token names (`sys` tier) and the token TS module | MAT | all | T + Seed | `src/contracts/tokens.ts`; `src/tokens/index.ts` |
| S-11 | Token manifest `dist/tokens/manifest.json` schema | MAT | PLAT (registry base, Tailwind bridge, compat CSS), QUAL | T | `src/contracts/tokens.ts` |
| S-12 | Motion token names and values | MAT | CMP, SURF, QUAL | T | `src/contracts/motion.ts` |
| S-13 | Motion runtime (frame ticker, offscreen observer, `startMorph`, `MotionCapability`) | MAT | CMP (Sheet, Tabs indicator), SURF (CarouselRail, media, TabBar), QUAL (perf) | Seed | `src/motion/index.ts` |
| S-20 | Preference keys, values, store and storage types | MAT | all | T | `src/contracts/preferences.ts` |
| S-21 | `usePreference`, `useResolvedPreferences`, `usePreferenceActions` | MAT | CMP, SURF, QUAL, PLAT (blocks) | Seed | `src/theme/index.ts` |
| S-22 | `AuraGlassProvider`, `AuraGlassScript`, `auraGlassPrepaintScript` | MAT | all; canaries | Seed | `src/theme/index.ts` |
| S-23 | Portal root and `usePortalContainer()` | MAT | CMP (every Base UI `*.Portal`), SURF | Seed | `src/theme/index.ts` |
| S-24 | `GlassPreferencesPanel` props | MAT | PLAT (`settings` block), SURF (`mobile-settings` block) | T + Seed | `src/theme/index.ts` |
| S-25 | `LayerStack` (`useLayer`): the only Escape, `inert` and scroll-lock dispatcher | MAT | CMP overlays, SURF (CommandPalette, ImageViewer, MobileShell drawer) | Seed | `src/theme/index.ts` |
| S-26 | Announcer (`useAnnouncer`) | MAT | CMP (Toast), SURF (Thread, StreamingText) | Seed | `src/theme/index.ts` |
| S-30 | Component prop grammar and the CMP component contracts that SURF, PLAT and QUAL compose | CMP | SURF, PLAT (blocks, compat, codemods), QUAL (showcases) | T + Seed | `src/contracts/components.ts`; runtime `src/components/<dir>/index.ts` |
| S-31 | `ComponentMeta` schema (`<Name>.meta.ts`) and `defineMeta` | CMP (helper) | every component owner; PLAT (docs, codemod checks); QUAL (inventory, lanes) | T + Seed | `src/contracts/components.ts`; `src/foundation/index.ts` |
| S-32 | Base UI wrapping helpers (`ChangeDetails`, `toChangeDetails`, `renderElement`) | CMP | SURF (owned components on Base UI) | T + Seed | `src/foundation/index.ts` |
| S-33 | Part-name grammar (`data-ag-part`) | CMP | all | T | `src/contracts/components.ts` |
| S-34 | KEEP primitives (`Slot`, `Portal`, `VisuallyHidden`, `FocusScope`, `Label`, `DismissableLayer`) | CMP | SURF, MAT (provider uses `Portal`) | Seed (`VisuallyHidden`); keep list | `src/primitives/index.ts` |
| S-35 | Export entries, per-entry export names, root composition | PLAT (manifest); entry owners (barrels) | all | T + P | `src/contracts/entries.ts` |
| S-36 | Package names and workspaces | PLAT | all | P | §4.12 |
| S-37 | `warnDeprecated(id)`, `setDeprecationMode(mode)`, `cn(...)`, compat composition | PLAT | CMP, SURF, MAT (compat adapters), MAT (provider) | Seed + P | `src/internal/index.ts`; `src/compat/index.ts` |
| S-38 | Deprecation entry schema | PLAT | all | T + F | `src/contracts/fragments.ts` |
| S-39 | Codemod ids and mapping fragment schema | PLAT (engine) | all | T + F | `src/contracts/fragments.ts` |
| S-40 | Test helper API (`tests/helpers`) | QUAL | all | T + Seed | `src/contracts/testing.ts`; `tests/helpers/index.ts` |
| S-41 | Story metadata (`parameters.ag`), story tags and kinds | QUAL | every story author | T | `src/contracts/testing.ts` |
| S-42 | Certification scene ids and asset paths | QUAL | MAT, CMP, SURF, PLAT | T | `src/contracts/testing.ts` |
| S-43 | Lane ids, lane registration, CI job names, required job names | QUAL (lanes, `qual:*` jobs); PLAT (root pipeline, required jobs) | all | T + F | `src/contracts/testing.ts`, `src/contracts/fragments.ts` |
| S-44 | Size and perf budget schemas and default ceilings | PLAT (bytes); QUAL (runtime) | all | T + F | `src/contracts/fragments.ts` |
| S-45 | CSS, side-effect, review and baseline fragment schemas | PLAT / QUAL / MAT | all | T + F | `src/contracts/fragments.ts` |
| S-46 | Registry item layout and block ids | PLAT | SURF, CMP | T | §3.3; `src/contracts/fragments.ts` (`RegistryItemOwner`) |
| S-47 | Lint rule names and owners | per §4.11 | all | P | §4.11 |
| S-48 | Evidence directory and artifact naming | QUAL | all lanes | T | `src/contracts/testing.ts` |
| S-49 | Frozen dependency set | PLAT | all | P | §4.12 |
| S-50 | Fragment loader `loadFragments(kind)` | CONTRACT | PLAT, QUAL, MAT gates | P | `src/contracts/load-fragments.mjs` |
| S-51 | Storybook docs blocks (`Anatomy`, `KeyboardTable`, `MigrationTable`, `PropsTable`, `SelectorTable`) and auto-generated flagship docs pages | QUAL | every MDX author (CMP, SURF, MAT, PLAT migration pages) | Seed | `.storybook/blocks/index.tsx` (the only `.storybook/**` path that MDX may import) |
| S-52 | Frozen root `package.json` script names (`tokens:build`, `api:update`, `build`, `pack:verify`, `storybook:build`, `docs:build`, `test`, `test:contract`, `lint`, `typecheck`) | PLAT (names); each script's implementation owner per §4.12 | all CI fragments | P + Seed | §4.12 |
| S-53 | CI fragment seam: stages, job naming, rules variables, `needs` rules, artifact paths, environments, Pages layout | PLAT (root `.gitlab-ci.yml`); each stream (its fragment) | all | P | §4.13 |
| S-54 | npm publish contract on GitLab (tag pipeline, OIDC `id_tokens`, provenance, dist-tags) | PLAT | QUAL (release verdict), all package owners | P | §4.13.7 |
| S-55 | Cross-stream report artifacts: `VisualClassReport`, `PerfReport`, `ReleaseVerdict`, `SubjectIndex` | QUAL (writes); PLAT (reads for change class, claims, publish) | PLAT, QUAL | T | `src/contracts/testing.ts` |

Total: 43 seams (ids are grouped by area, so the numbering has gaps).

### 4.2 `src/contracts/material.ts` (S-01, S-02, S-05)

Created by C0. Verbatim:

```ts
/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned: change only in a contract PR. Type-only except frozen constants. */
import type * as React from 'react';
import type { RadiusToken, SpaceToken } from './tokens';

export type MaterialVariant = 'regular' | 'clear' | 'identity';           // D-06
export type Thickness = 'thin' | 'regular' | 'thick';                     // D-07
export type Layer = 'chrome' | 'overlay' | 'transient' | 'content';       // §4.1
export type LayerAttr = Layer | 'scrim';                                  // 'scrim' is emitted only by overlay backdrops
export type ContentMaterial = 'content-raised' | 'content-sunken';
export type Backdrop = 'light' | 'dark' | 'media' | 'auto';
export type Tier = 'lightweight' | 'standard' | 'enhanced' | 'cinematic';
export type DomTier = Exclude<Tier, 'cinematic'>;                         // values allowed in data-ag-tier
export type Engine = 'chromium' | 'webkit' | 'gecko' | 'unknown';
export type Transparency = 'glass' | 'tinted' | 'solid';
export type Shape = 'fixed' | 'capsule' | 'concentric';
export type EdgeStyle = 'soft' | 'hard';                                  // erratum E-01: prop is edgeStyle, not style

export interface MaterialRole {
  layer?: Layer;
  variant?: MaterialVariant;      // default 'regular'; ignored for layer='content' unless set explicitly
  thickness?: Thickness;
  content?: ContentMaterial;      // layer='content' only; default 'content-raised'
  shape?: Shape;
  fallbackRadius?: RadiusToken;
  interactive?: boolean;
  prominent?: boolean;
  refraction?: boolean;
  allowNested?: boolean;
}

/** C-1 (v1.2): no className key. Material CSS keys on [data-ag-surface]; materialProps() returns data-ag-* attributes only. */
export interface MaterialAttributes {
  'data-ag-surface': '';
  'data-ag-layer': Layer;
  'data-ag-variant'?: MaterialVariant;
  'data-ag-thickness'?: Thickness;
  'data-ag-content'?: ContentMaterial;
  'data-ag-shape'?: Shape;
  'data-ag-interactive'?: '';
  'data-ag-prominent'?: '';
  'data-ag-refraction'?: '';
  'data-ag-allow-nested'?: '';
}
export type MaterialPropsFn = (role: MaterialRole) => MaterialAttributes;
export type UseMaterialTier = () => Tier;   // reads <html data-ag-tier> via useSyncExternalStore; 'cinematic' only inside @auraglass/labs

export interface SurfaceProps extends MaterialRole, Omit<React.HTMLAttributes<HTMLElement>, 'content'> {
  render?: React.ReactElement;
  ref?: React.Ref<HTMLElement>;
}
export interface SurfaceGroupProps { spacing?: SpaceToken; children: React.ReactNode; className?: string; refraction?: boolean }
export interface EnvironmentProps { backdrop: Backdrop; image?: string; video?: string; children: React.ReactNode; className?: string }
export interface ScrollEdgeProps { edge: 'top' | 'bottom'; edgeStyle?: EdgeStyle }
export interface ConcentricFrameProps { radius: RadiusToken; inset: SpaceToken; children: React.ReactNode }

/** S-02: class grammar. Library CSS keys only on these, data-ag-* and STATE_ATTRIBUTES (data-state plus, since v1.2 C-2, the
    Base UI / component state attributes listed there). Since v1.2 (C-1) no material rule keys on
    SURFACE_CLASS: Surface/SurfaceGroup still add it as a consumer styling hook, materialProps() never emits it. */
export const SURFACE_CLASS = 'ag-surface' as const;
export type ComponentClass<K extends string> = `ag-${K}`;
export type PartClass<K extends string, P extends string> = `ag-${K}__${P}`;

/** S-01: attribute registry. Setter = the stream allowed to emit the attribute in dist/. */
export const AG_ATTRIBUTES = {
  // public, semver-stable (architecture §4.5)
  'data-ag-surface': { setter: 'MAT', values: [''] },
  'data-ag-layer': { setter: 'MAT', values: ['chrome', 'overlay', 'transient', 'content', 'scrim'] },
  'data-ag-variant': { setter: 'MAT', values: ['regular', 'clear', 'identity'] },
  'data-ag-thickness': { setter: 'MAT', values: ['thin', 'regular', 'thick'] },
  'data-ag-content': { setter: 'MAT', values: ['content-raised', 'content-sunken'] },
  'data-ag-shape': { setter: 'MAT', values: ['fixed', 'capsule', 'concentric'] },
  'data-ag-interactive': { setter: 'MAT', values: [''] },
  'data-ag-prominent': { setter: 'MAT', values: [''] },
  'data-ag-refraction': { setter: 'MAT', values: [''] },
  'data-ag-allow-nested': { setter: 'MAT', values: [''] },
  'data-ag-group': { setter: 'MAT', values: [''] },
  'data-ag-backdrop': { setter: 'ANY', values: ['light', 'dark', 'media', 'auto'] },
  'data-ag-engine': { setter: 'MAT', values: ['chromium', 'webkit', 'gecko', 'unknown'] },
  'data-ag-tier': { setter: 'MAT', values: ['lightweight', 'standard', 'enhanced'] },
  'data-ag-scheme': { setter: 'MAT', values: ['light', 'dark'] },
  'data-ag-contrast': { setter: 'MAT', values: ['standard', 'more'] },
  'data-ag-transparency': { setter: 'MAT', values: ['glass', 'tinted', 'solid'] },
  'data-ag-motion': { setter: 'MAT', values: ['full', 'calm', 'none'] },
  'data-ag-density': { setter: 'MAT', values: ['compact', 'regular', 'spacious'] },
  'data-ag-animating': { setter: 'MAT', values: [''] },
  'data-ag-part': { setter: 'ANY', values: 'kebab-case part name (S-33)' },
  'data-ag-preview': { setter: 'MAT', values: ['v5'], branch: 'release/4.x' },
  // ratified, public (MAT: a11y + motion)
  'data-ag-root': { setter: 'MAT', values: [''] },
  'data-ag-provider': { setter: 'MAT', values: [''] },
  'data-ag-portal-root': { setter: 'MAT', values: [''] },
  'data-ag-layer-root': { setter: 'MAT', values: ['overlay', 'transient', 'toast'] },
  'data-ag-announcer': { setter: 'MAT', values: [''] },
  'data-ag-obscured': { setter: 'MAT', values: [''] },
  'data-ag-focusable': { setter: 'ANY', values: [''] },
  'data-ag-scroll-container': { setter: 'ANY', values: [''] },
  'data-ag-continuous': { setter: 'MAT', values: ['on'] },
  'data-ag-offscreen': { setter: 'MAT', values: [''] },
  'data-ag-vt': { setter: 'MAT', values: [''] },
  'data-ag-vt-participant': { setter: 'MAT', values: [''] },
  'data-ag-vt-settled': { setter: 'MAT', values: [''] },
  'data-ag-pointer-light': { setter: 'MAT', values: [''] },
  'data-ag-highlights': { setter: 'MAT', values: [''] },
  // ratified, public (CMP)
  'data-ag-size': { setter: 'CMP|SURF', values: ['sm', 'md', 'lg'] },
  'data-ag-intent': { setter: 'CMP|SURF', values: ['neutral', 'info', 'success', 'warning', 'danger'] },
  'data-ag-overlay': { setter: 'CMP', values: ['dialog', 'alert-dialog', 'sheet', 'popover', 'menu', 'tooltip', 'toast', 'select', 'combobox', 'preview-card'] },
  'data-ag-overlay-depth': { setter: 'CMP', values: 'integer >= 0' },
  'data-ag-nested-open': { setter: 'CMP', values: [''] },
  // ratified, public (SURF)
  'data-ag-media-root': { setter: 'SURF', values: [''] },
  'data-ag-media-tone': { setter: 'SURF', values: ['light', 'dark'] },
  'data-ag-backdrop-preset': { setter: 'SURF', values: ['aurora', 'mesh', 'photo', 'video', 'grain'] },
  'data-ag-palette': { setter: 'SURF', values: 'preset palette id' },
  'data-ag-slot': { setter: 'SURF', values: 'AppShell slot name, declared in AppShell.meta.ts' },
  'data-ag-sidebar': { setter: 'SURF', values: ['expanded', 'collapsed', 'rail'] },
  'data-ag-sidebar-side': { setter: 'SURF', values: ['start', 'end'] },
  'data-ag-layout': { setter: 'SURF', values: ['auto', 'desktop', 'mobile'] },
  'data-ag-placement': { setter: 'SURF', values: ['inline', 'overlay'] },
  'data-ag-appearance': { setter: 'CMP|SURF', values: 'component-specific non-material look (e.g. sidebar|inset|floating, underline|pill), declared in meta; Sheet popup value full-height is read by the MAT floor (C-2)' },
  'data-ag-inspector': { setter: 'SURF', values: ['open', 'closed'] },
  'data-ag-pinned-edge': { setter: 'SURF', values: ['start', 'end', 'top'] },
  // ratified in v1.2 (C-2), public. MAT CSS reads all six; MAT code writes scroll-locked and lens-defs. theme, shadcn-source,
  // hit-clamp and focus-inset are opt-in hooks that the app or a component writes on its own element (setter ANY).
  'data-ag-theme': { setter: 'ANY', values: 'theme id: a preset id or the id passed to createGlassTheme/createBrandTheme; on the element that scopes that theme cssText' },
  'data-ag-shadcn-source': { setter: 'ANY', values: [''] },     // on :root only; shadcn variables are authoritative (shadcn -> ag)
  'data-ag-scroll-locked': { setter: 'MAT', values: [''] },     // LayerStack, on <html> only, while a modal layer is open
  'data-ag-hit-clamp': { setter: 'ANY', values: ['start', 'end', 'both', 'none'] }, // container of adjacent hit-area targets
  'data-ag-focus-inset': { setter: 'ANY', values: [''] },       // focusable inside a clipping container: ring drawn inside
  'data-ag-lens-defs': { setter: 'MAT', values: [''] },         // the hidden SVG host rendered by LensDefs
  // private to MAT (not semver, undocumented)
  'data-ag-sizeclass': { setter: 'MAT', values: 'private' },
  'data-ag-radius': { setter: 'MAT', values: 'private' },
  'data-ag-spacing': { setter: 'MAT', values: 'private' },
  'data-ag-inset': { setter: 'MAT', values: 'private' },
  'data-ag-edge': { setter: 'MAT', values: ['top', 'bottom'] },
  'data-ag-edge-style': { setter: 'MAT', values: ['soft', 'hard'] },
  'data-ag-lens-ready': { setter: 'MAT', values: 'private' },
  'data-ag-full-height': { setter: 'MAT', values: 'private' },
  // story-only: must never appear in dist/ (QUAL)
  'data-ag-story-content': { setter: 'QUAL', values: 'story-only' },
  'data-ag-story-kind': { setter: 'QUAL', values: ['lab', 'component', 'matrix', 'scene', 'showcase'] },
  'data-ag-cert-ready': { setter: 'QUAL', values: 'story-only' },
  'data-ag-lab-override': { setter: 'QUAL', values: 'story-only' },
  'data-ag-state-cell': { setter: 'QUAL', values: 'story-only' },
  'data-ag-seed': { setter: 'CONTRACT', values: 'seed-only; banned in dist/ (§1.2 R5)' },
} as const;
export type AgAttribute = keyof typeof AG_ATTRIBUTES;
/** Banned forever (D-20 and erratum to CTL): */
export const BANNED_ATTRIBUTES = ['data-ag-material', 'data-ag-button-variant', 'data-meets-wcag'] as const;
/** S-02 / C-2 (v1.2): the only non-data-ag attributes library CSS may select. Base UI or the CMP/SURF component writes them
    (setter ANY); MAT CSS only reads them. aria-* entries are matched with an explicit value, e.g. [aria-disabled="true"]. */
export const STATE_ATTRIBUTES = ['data-state', 'data-disabled', 'data-pressed', 'data-selected', 'data-loading', 'data-drop-target',
  'data-open', 'data-expanded', 'data-side', 'data-starting-style', 'data-ending-style',
  'aria-disabled', 'aria-pressed', 'aria-selected', 'aria-busy'] as const;
```

Semantics carried over unchanged: `data-ag-backdrop="auto"` does not satisfy `variant="clear"`. A `clear` surface with no declared light, dark or media backdrop renders `regular` and logs a dev warning (D-12). `data-ag-backdrop` may be set by any stream, because sections, backdrops and media declare it.

**C-2 (v1.2) attribute discipline for MAT (REQ-MAT-14, -20, -27).** Setter is the stream (or `ANY`, meaning the app or any component) that writes the attribute on an element; CSS selectors that read an attribute do not make their stream its setter.

- `data-ag-theme` scopes a theme: the `cssText` of `createGlassTheme`/`createBrandTheme` and the preset blocks select `[data-ag-theme="<id>"]`, and the app (or the provider for its `preset`/`theme` prop) writes the id on the scope element. It is not a scheme switch: `light`/`dark` go through `data-ag-scheme`.
- `data-ag-shadcn-source` is written by the app on `:root` when shadcn's variables are the source; without it only the `:where(:root:not([data-ag-shadcn-source]))` ag → shadcn direction applies.
- `data-ag-scroll-locked` is written only by the layer stack on `<html>` while a scroll-locking layer is open.
- `data-ag-hit-clamp` is written on a container of adjacent targets; `start`/`end`/`both` limit the hit-area overshoot to half the private hit gap, `none` (the default when absent) does not clamp.
- `data-ag-focus-inset` is written on a focusable inside a clipping container; it draws the focus ring inside the border box.
- `data-ag-lens-defs` marks the hidden SVG host rendered once by `LensDefs`.
- Not registered, and therefore renamed by MAT before 5.0 (to `data-ag-part` values or no attribute): `data-ag-theme-style` (provider `<style>`), `data-ag-preferences-panel`, `data-ag-pref`, `data-ag-option`, `data-ag-options`, `data-ag-floor-note`, `data-ag-floor` (preferences panel and a11y stories), `data-ag-debug-targets`, and the generated `[data-ag-state~="disabled"]` ladder cells, which key on `STATE_ATTRIBUTES` (`[data-disabled]`, `[aria-disabled="true"]`) instead.
- `STATE_ATTRIBUTES` lists every non-`data-ag` attribute MAT CSS (`material.css`, `motion.css`, `loading.css`, `motion-modes.css`, `rungs.css`) reads today. A selector on any other non-`data-ag` attribute fails attribute discipline.
- If OD-16 rejects C-2 the fallback applies per attribute: MAT stops emitting it (presets scope to `[data-ag-root]`; only the `:not([data-ag-shadcn-source])` shadcn form ships) or renames it to a `data-ag-part` value, and `STATE_ATTRIBUTES` is dropped with MAT state styling moved to CMP.

### 4.3 `src/contracts/tokens.ts` (S-03, S-04, S-10, S-11)

```ts
/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. */
export type RadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';           // 6/10/14/20/28/9999px (§5.2)
export type SpaceToken = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16'; // n × 4px (4pt grid)
export type TypeRole = 'display' | 'title-1' | 'title-2' | 'title-3' | 'body' | 'callout' | 'caption' | 'label' | 'mono';
export type SysColor = 'canvas' | 'on-surface' | 'on-surface-muted' | 'accent' | 'on-accent' | 'border'
  | 'focus-inner' | 'focus-outer' | 'specular' | 'danger' | 'warning' | 'success' | 'info';
export type ZLayer = 'content' | 'chrome' | 'overlay' | 'transient' | 'toast';

/** S-03: every public custom property. Anything else starting with --ag- fails MAT's dead/undefined-var gate. */
export const PUBLIC_CSS_VARS = {
  light: ['--ag-light-angle', '--ag-specular', '--ag-glass-opacity'],
  readouts: ['--ag-surface-fill', '--ag-surface-rim', '--ag-surface-shadow', '--ag-surface-radius', '--ag-on-surface', '--ag-on-surface-muted'],
  shape: ['--ag-radius-outer', '--ag-inset', '--ag-radius-inner'],
  focus: ['--ag-focus-inner', '--ag-focus-outer', '--ag-focus-width'],
  layout: ['--ag-scroll-padding-top', '--ag-scroll-padding-bottom'],
  color: ['canvas', 'on-surface', 'on-surface-muted', 'accent', 'on-accent', 'border', 'focus-inner', 'focus-outer',
    'specular', 'danger', 'warning', 'success', 'info'].map((c) => `--ag-color-${c}`),
  space: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'].map((s) => `--ag-space-${s}`),
  radius: ['xs', 'sm', 'md', 'lg', 'xl', 'full'].map((r) => `--ag-radius-${r}`),
  type: ['display', 'title-1', 'title-2', 'title-3', 'body', 'callout', 'caption', 'label', 'mono']
    .flatMap((t) => [`--ag-type-${t}-size`, `--ag-type-${t}-leading`, `--ag-type-${t}-weight`]),
  font: ['--ag-font-sans', '--ag-font-mono'],
  shadow: ['--ag-shadow-thin', '--ag-shadow-regular', '--ag-shadow-thick'],
  z: ['content', 'chrome', 'overlay', 'transient', 'toast'].map((z) => `--ag-z-${z}`),
  state: ['--ag-state-hover-specular', '--ag-state-press-glow', '--ag-state-disabled-alpha'],
  target: ['--ag-target-min', '--ag-target-coarse'],                            // 24px / 44px
  density: ['--ag-density'],                                                    // 0.875 | 1 | 1.125
  scrim: ['--ag-scrim-clear', '--ag-scrim-media'],                             // 0.35 / media scrim
  motion: [/* see src/contracts/motion.ts MOTION_CSS_VARS */],
  // C-7 (v1.2): MAT component tokens consumed by CMP CSS (REQ-FIN-11, REQ-CMP-19/-45). Every other comp/sys output is --_ag-*.
  comp: ['sm', 'md', 'lg'].flatMap((s) => ['compact', 'default', 'spacious'].map((d) => `--ag-comp-control-height-${s}-${d}`)),
  switchTrack: ['w', 'h'].flatMap((a) => ['sm', 'md', 'lg'].map((s) => `--ag-switch-track-${a}-${s}`)),
  shadcn: ['--background', '--foreground', '--primary', '--primary-foreground', '--muted', '--border', '--ring', '--radius'],
} as const;

/** Private namespaces. --_ag-* is MAT's; components use --_ag-<component>-* inside their own CSS only. */
export const PRIVATE_VAR_PREFIX = '--_ag-' as const;
export type ComponentPrivateVar<K extends string> = `--_ag-${K}-${string}`;

/** S-04: CSS layers. Every shipped CSS file starts with exactly this statement (no !important anywhere). */
export const CSS_LAYERS = ['ag.compat', 'ag.reset', 'ag.tokens', 'ag.material', 'ag.components', 'ag.a11y'] as const;
export type CssLayer = (typeof CSS_LAYERS)[number];
export const LAYER_ORDER_STATEMENT = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;' as const;
export const LAYER_CONTENT_OWNER: Record<CssLayer, string> = {
  'ag.compat': 'PLAT (compat/globals.css) + MAT (compat/tokens.css)',
  'ag.reset': 'PLAT (scoped under :where([data-ag-root],[data-ag-surface]))',
  'ag.tokens': 'MAT',
  'ag.material': 'MAT',
  'ag.components': 'CMP and SURF, each in its own <Name>.css files',
  'ag.a11y': 'MAT',
};
export const TAILWIND_BRIDGE_ORDER = '@layer theme, base, ag, components, utilities;' as const; // PLAT, §5.5

/** S-10/S-11: generated token module and manifest (MAT compiler is the only writer). */
export interface TokenManifestEntry {
  name: string;                 // DTCG path, e.g. 'sys.color.canvas'
  cssVar: `--ag-${string}`;
  type: 'color' | 'dimension' | 'number' | 'duration' | 'cubicBezier' | 'motion-spring' | 'shadow' | 'glass-material' | 'fontFamily' | 'fontWeight';
  tier: 'sys' | 'material' | 'comp';   // 'ref' never appears in the manifest
  modes: Partial<Record<'light' | 'dark' | 'more' | 'tinted' | 'solid' | 'compact' | 'spacious', string>>;
  value: string;                // resolved default (light, standard, glass, regular)
}
export interface TokenManifest { version: 1; generatedFrom: 'tokens/**/*.tokens.json'; tokens: TokenManifestEntry[] }
export const TOKEN_OUTPUTS = {
  css: 'dist/tokens.css',                       // @layer ag.tokens
  manifest: 'dist/tokens/manifest.json',
  ts: 'src/tokens/index.ts',                    // generated; exported as aura-glass/tokens
  motionTs: 'src/motion/tokens.generated.ts',
  ladders: 'src/material/css/generated/ladders.css',
  floors: 'src/material/css/generated/floors.css',
  compat: 'dist/compat/tokens.css',             // from tokens/compat-alias-map.json, @layer ag.compat
  // C-7 (v1.2): the other outputs tokens:build actually writes and ships or commits. Anything not listed here is not
  // written by the build (e.g. dist/css/* copies and tokens/contrast/busy-reference.json are not build outputs).
  generated: ['src/tokens/generated/tokens.ts', 'src/tokens/generated/tokens.d.ts', 'src/tokens/generated/material-spec.ts',
    'src/tokens/generated/presets.ts', 'src/tokens/generated/manifest.ts'],
  properties: 'src/material/css/generated/properties.css',
  tailwind: 'dist/tailwind.css',                // ./tailwind.css subpath, TAILWIND_BRIDGE_ORDER
  contrastMatrix: 'dist/contrast-matrix.json',
  opacityFloors: 'tokens/generated/opacity-floors.json',
  registry: 'dist/tokens/registry-cssvars.json',
} as const;
```

These are contract-v1 decisions that the archived PRDs left open:

- **Every source `.css` file is self-layered.** Each `.css` file under `src/**` starts with `LAYER_ORDER_STATEMENT` and puts all of its rules inside exactly one `@layer <its fragments/css layer> { … }` block. Because cascade layers fix precedence, the load order of source sheets does not matter. So Storybook, Playwright pages and Jest-free browser tests can load any subset of source CSS in any order (`.storybook/preview.tsx` globs `src/**/*.css`, §4.11), and no stream needs PLAT's CSS assembly (`fragments/css`, `dist/**/*.css`) to see its own styles. PLAT's assembly is needed only for `dist/` and the L2 artifact lane. `layers.test.ts` (§6.3) checks the rule on source files as well as on shipped files.
- **Type tokens** are split into `-size`, `-leading` and `-weight`.
- **`info`** is added to the `sys` colours so that the `intent` union (S-30) has a colour for every value.
- **Density values** follow architecture §5.4 (`compact | regular | spacious`). They are not SC-23's `comfortable | compact`, which conflicted with the architecture.
- **C-7 (v1.2): MAT adds no other public custom property.** `PUBLIC_CSS_VARS.comp` and `.switchTrack` are the only new public names. Every other `--ag-*` name a MAT source declares or reads becomes a private `--_ag-*` (REQ-MAT-04): `--ag-group-spacing`, `--ag-tinted-floor`, `--ag-scrim-blur`, `--ag-fallback-fill`, `--ag-color-on-surface-max`, `--ag-color-border-strong`, `--ag-color-on-surface-disabled`, `--ag-focus-offset`, `--ag-hit-gap` and the brand ramp `--ag-accent-1`…`--ag-accent-12` (REQ-MAT-16). On `next` at this PR only `--ag-group-spacing` (read by `material.css`) is still public-named; the rest already use `--_ag-*`. The nine `--ag-app-shell-*` names from `tokens/sys/app-shell.tokens.json` are not part of C-7: REQ-FIN-11 renames them or proposes them in a separate contract item. `tokens/compat-alias-map.json` may map a `--glass-*` name only to a name in `PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS` or to `null` (today `--ag-on-surface-tertiary` and `--ag-particle-alpha` violate this). The acceptance check is set equality: the `--ag-*` declarations in `dist/tokens.css`, `src/material/css/**`, `src/a11y/css/**` and `src/motion/css/**` equal `PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS`. If OD-16 rejects C-7, the 15 comp/switch-track names are renamed to `--_ag-*` and CMP reads them as private MAT values.

### 4.4 `src/contracts/motion.ts` (S-12, S-13)

```ts
/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. Values: archived MOT §4.2 (decided). */
export type MotionPreference = 'full' | 'calm' | 'none';
export type DurationName = 'instant' | 'micro' | 'small' | 'medium' | 'large';
export type EaseName = 'standard' | 'emphasized' | 'emphasized-decelerate' | 'accelerate';
export type SpringName = 'snappy' | 'smooth' | 'fluid';
export type MotionTokenName = `duration-${DurationName}` | `spring-${SpringName}`;

export const DURATIONS_MS: Record<DurationName, { enter: number; exit: number }> = {
  instant: { enter: 90, exit: 60 }, micro: { enter: 120, exit: 80 }, small: { enter: 200, exit: 140 },
  medium: { enter: 320, exit: 220 }, large: { enter: 450, exit: 320 },
};
export const AMBIENT_DURATION_MS = 40000;        // valid only under [data-ag-continuous="on"]
export const EASES: Record<EaseName, readonly [number, number, number, number]> = {
  standard: [0.2, 0, 0, 1], emphasized: [0.2, 0, 0, 1],
  'emphasized-decelerate': [0.05, 0.7, 0.1, 1], accelerate: [0.3, 0, 1, 1],
};
export const SPRINGS: Record<SpringName, { zeta: number; responseMs: number }> = {
  snappy: { zeta: 1.0, responseMs: 200 }, smooth: { zeta: 0.9, responseMs: 350 }, fluid: { zeta: 0.82, responseMs: 450 },
};
export const MOTION_CSS_VARS = [
  ...(['instant', 'micro', 'small', 'medium', 'large'] as const).flatMap((d) => [`--ag-duration-${d}`, `--ag-duration-${d}-exit`]),
  '--ag-duration-ambient',
  ...(['standard', 'emphasized', 'emphasized-decelerate', 'accelerate'] as const).map((e) => `--ag-ease-${e}`),
  ...(['snappy', 'smooth', 'fluid'] as const).flatMap((s) => [`--ag-spring-${s}`, `--ag-spring-${s}-duration`]),
] as const;
/** Properties components may animate (lint auraglass/motion-*): */
export const ANIMATABLE = ['transform', 'opacity', 'translate', 'scale', '--ag-specular', '--_ag-optics', '--_ag-press', '--_ag-refraction-scale'] as const;

/** S-13 runtime, implemented by MAT at src/motion/index.ts (internal entry, not a public subpath). */
export type FrameCallback = (dtMs: number, nowMs: number) => void;           // dt capped at 50 ms
export interface MotionRuntime {
  subscribeFrame(cb: FrameCallback, opts?: { element?: Element }): () => void; // one shared rAF; pauses hidden/offscreen
  observeOffscreen(el: Element): () => void;                                   // sole owner of data-ag-offscreen
  startMorph(update: () => void | Promise<void>, opts?: { surfaces?: Element[] }): Promise<void>; // View Transition + FLIP fallback
}
export interface DragBindings { onPointerDown: (e: PointerEvent) => void; style?: Record<string, string> }
export interface MotionCapability {                                             // provided only by aura-glass/motion's MotionProvider
  dragDetents?(opts: { detents: number[]; axis: 'x' | 'y'; onSettle(i: number): void }): DragBindings;
  momentum?(opts: { axis: 'x' | 'y'; bounds: [number, number] }): DragBindings;
}
```

Rules that travel with S-12 and S-13:

- Hover and press never use `scale` or `translate` (was SC-38).
- `backdrop-filter` and `filter` are never animated.
- Every loop requires `allowContinuous`, `motion=full` and `[data-ag-continuous="on"]`. CarouselRail autoplay counts as a loop.
- No frame callback calls a React state setter.
- Under `prefers-reduced-motion: reduce` the resolved motion is at most `calm`, and no API can raise it.

### 4.5 `src/contracts/preferences.ts` (S-20..S-26)

```ts
/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. Implemented by MAT; runtime exported from src/theme/index.ts. */
import type * as React from 'react';
import type { Transparency, DomTier } from './material';
import type { MotionPreference } from './motion';

export type Scheme = 'light' | 'dark';
export type Contrast = 'standard' | 'more';
export type Density = 'compact' | 'regular' | 'spacious';

export interface PreferenceValues {
  transparency: 'system' | Transparency;
  glassOpacity: number;                 // 0..1; >= 0.7 implies at least 'tinted'
  contrast: 'system' | Contrast;
  motion: 'system' | MotionPreference;
  scheme: 'system' | Scheme;
  density: Density;
  allowContinuous: boolean;             // default false; gates every loop (architecture §9, MOTION-12); never true under reduced motion
  // read-only OS/capability signals
  forcedColors: boolean; reducedMotionOS: boolean; reducedTransparencyOS: boolean; contrastMoreOS: boolean; coarsePointer: boolean;
}
export type PreferenceKey = keyof PreferenceValues;
export type UserSettableKey = 'transparency' | 'glassOpacity' | 'contrast' | 'motion' | 'scheme' | 'density' | 'allowContinuous';
export interface ResolvedPreferences {
  transparency: Transparency; contrast: Contrast; motion: MotionPreference; scheme: Scheme; density: Density;
  glassOpacity: number; tier: DomTier; allowContinuous: boolean;   // resolved allowContinuous is false unless motion === 'full'
  floors: { transparency: Transparency; motion: MotionPreference }; // OS/capability floors (D-11): results never go below these
}
export const SERVER_SNAPSHOT: PreferenceValues = {
  transparency: 'system', glassOpacity: 0, contrast: 'system', motion: 'system', scheme: 'system', density: 'regular', allowContinuous: false,
  forcedColors: false, reducedMotionOS: false, reducedTransparencyOS: false, contrastMoreOS: false, coarsePointer: false,
};
export const STORAGE_KEY = 'ag:prefs:v1' as const;
export const LEGACY_STORAGE_KEY = 'aura-glass-accessibility-settings' as const; // read once, never written
export interface PreferenceStorage { get(key: string): string | null; set(key: string, v: string): void; remove?(key: string): void }

/** S-21 hooks */
export type UsePreference = <K extends PreferenceKey>(key: K) => PreferenceValues[K];  // useSyncExternalStore, server snapshot above
export type UseResolvedPreferences = () => ResolvedPreferences;
export type UsePreferenceActions = () => {
  set<K extends UserSettableKey>(key: K, value: PreferenceValues[K]): void;
  reset(): void;
};

/** S-22 provider and pre-paint script */
export interface AuraGlassProviderProps {
  children: React.ReactNode;
  transparency?: PreferenceValues['transparency'];
  glassOpacity?: number;
  contrast?: PreferenceValues['contrast'];
  motion?: PreferenceValues['motion'];
  scheme?: PreferenceValues['scheme'];
  density?: Density;
  allowContinuous?: boolean;             // default false
  tier?: 'auto' | DomTier;               // subtree override; 'auto' = pre-paint detection
  preset?: string;                       // ThemePreset id
  brand?: string;                        // oklch() accent; createBrandTheme derives the ramp
  storage?: PreferenceStorage | null;    // null = do not persist
  portalContainer?: HTMLElement | null;  // overrides the provider-rendered portal root
  toasts?: boolean;                      // default true: render the toast layer root
  tooltips?: boolean;                    // default true: render the transient layer root
  deprecations?: 'warn' | 'silent';      // compat warnings (§14.3); default 'warn' in dev
}
export interface AuraGlassScriptProps {
  nonce?: string;
  storageKey?: string;                   // default STORAGE_KEY
  defaults?: Partial<Pick<PreferenceValues, UserSettableKey>>; // must equal the provider props, so pre-paint and hydration agree (no flash)
}
// export const auraGlassPrepaintScript: string   (same compiled body as AuraGlassScript; for non-RSC heads)

/** S-23 portal root. Rendered once per document by the outermost provider. */
export type PortalLayerRoot = 'overlay' | 'transient' | 'toast';
export type UsePortalContainer = (root?: PortalLayerRoot) => HTMLElement | null; // default 'overlay'; null = no provider (Base UI default)
export const PORTAL_ROOT_MARKUP =
  '<div data-ag-portal-root><div data-ag-layer-root="overlay"></div><div data-ag-layer-root="transient"></div>' +
  '<div data-ag-layer-root="toast" role="region" aria-label="Notifications"></div>' +
  '<div data-ag-announcer><div aria-live="polite" aria-atomic="true"></div><div aria-live="assertive" aria-atomic="true"></div></div></div>';

/** S-25 LayerStack: the ONLY Escape, inert and scroll-lock dispatcher. */
export type LayerKind = 'dialog' | 'alert-dialog' | 'sheet' | 'popover' | 'menu' | 'select' | 'combobox'
  | 'tooltip' | 'toast' | 'command-palette' | 'preview-card' | 'image-viewer' | 'drawer';
export interface LayerEntry { kind: LayerKind; modal: boolean; open: boolean; onEscape: () => void; element: HTMLElement | null; lockScroll?: boolean }
export type UseLayer = (entry: LayerEntry) => { id: string; depth: number; isTop: boolean };

/** S-26 announcer (archived A11Y-054 shape: coalesces identical messages within 500 ms; a message with the same id replaces the queued one) */
export interface AnnounceOptions { politeness?: 'polite' | 'assertive'; id?: string }
export type UseAnnouncer = () => { announce(message: string, opts?: AnnounceOptions): void; clear(): void };

/** S-24 */
export interface GlassPreferencesPanelProps {
  keys?: readonly UserSettableKey[];     // default: all seven
  onChange?: (key: UserSettableKey, value: unknown) => void;
  className?: string;
}
```

**`src/theme/index.ts`** export names, frozen. Created by C0 as a seed (§4.10): `AuraGlassProvider`, `AuraGlassScript`, `auraGlassPrepaintScript`, `usePreference`, `useResolvedPreferences`, `usePreferenceActions`, `usePortalContainer`, `useLayer`, `useAnnouncer`, `GlassPreferencesPanel`, `createGlassTheme`, `createBrandTheme`, `presets`, plus the types above.

`./theme` publishes only the names listed in §4.7. `usePortalContainer`, `useLayer` and `useAnnouncer` are internal: imported by CMP and SURF through `src/theme/index.ts`, and not re-exported from the public `./theme` entry.

This replaces two archived decisions:

- SC-25 had FND own `usePortalContainer()` in `src/foundation/portal.ts`. Under this contract the accessor lives with MAT, which owns the provider and the portal root, so only one stream ever touches that context. CMP's wrapping pattern calls it.
- SC-25's "FND routes dismissal through LayerStack" becomes this rule: every CMP and SURF overlay calls `useLayer` and passes Base UI `onEscapeKeyDown` and dismiss handling to it.
- Archived REQ-OVL-61 had `AuraGlassProvider` mount CMP's `Toast.Provider`. That would make MAT import CMP. Under this contract the provider renders only the toast **region** (`[data-ag-layer-root="toast"]` in `PORTAL_ROOT_MARKUP`) and imports nothing from CMP. The application, or a block, mounts `Toast.Provider` once; `Toast.Viewport` portals into `usePortalContainer('toast')`. `useToast()` outside a `Toast.Provider` logs one dev error and returns no-op methods. MAT's `toasts?: boolean` prop controls only whether the region is rendered.

### 4.6 `src/contracts/components.ts` (S-30..S-33)

```ts
/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. Grammar implemented by CMP; obeyed by CMP and SURF. */
import type * as React from 'react';
import type { MaterialVariant, Thickness } from './material';

// ---- S-30 prop grammar (was SC-24) ----
export type Intent = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type Size = 'sm' | 'md' | 'lg';                   // components may accept a subset; emitted as data-ag-size
export interface MaterialBearingProps { variant?: MaterialVariant; thickness?: Thickness; prominent?: boolean; refraction?: boolean }
export interface IntentProps<I extends Intent = Intent> { intent?: I }       // tints text/rim/specular; never selects material
export interface SizeProps<S extends Size = Size> { size?: S }
export interface ChangeDetails { event: Event | undefined; reason: string }  // never a Base UI or RA type
export type RenderProp<P = Record<string, unknown>, S = Record<string, unknown>> =
  React.ReactElement | ((props: P, state: S) => React.ReactElement);
export interface RenderProps<P = Record<string, unknown>, S = Record<string, unknown>> { render?: RenderProp<P, S> }
export interface ValueProps<T> { value?: T; defaultValue?: T; onValueChange?: (value: T, details: ChangeDetails) => void }
export interface CheckedProps { checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (checked: boolean, details: ChangeDetails) => void }
export interface OpenProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean, details: ChangeDetails) => void }
/** Banned prop names on every 5.0 component (type test + lint auraglass/prop-grammar): */
export const BANNED_PROPS = ['material', 'elevation', 'as', 'tone', 'asChild', 'onChange' /* value callbacks */] as const;
/** Non-material visual choice uses `appearance` (emitted as data-ag-appearance), never `variant`. */
export type PartProps<E extends keyof React.JSX.IntrinsicElements = 'div'> =
  Omit<React.ComponentPropsWithoutRef<E>, 'onChange'> & RenderProps & { ref?: React.Ref<HTMLElement> };

// 4.x Button mapping used by compat and the prop-grammar codemod
export const BUTTON_VARIANT_MAP = {
  primary: { prominent: true }, secondary: { variant: 'regular' }, ghost: { variant: 'identity' }, danger: { intent: 'danger' },
} as const;

// ---- S-33 part grammar ----
export type AgPart = string & { readonly __kebab?: never };   // kebab-case; validated by PART_NAME_RE
export const PART_NAME_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
export const COMMON_PARTS = ['root', 'trigger', 'content', 'popup', 'positioner', 'backdrop', 'item', 'item-indicator',
  'indicator', 'thumb', 'track', 'range', 'label', 'description', 'error', 'icon', 'close', 'title', 'header', 'footer',
  'body', 'list', 'group', 'group-label', 'separator', 'viewport', 'arrow', 'value', 'input', 'clear', 'hit-area'] as const;
/** Compound naming: Name.Root, Name.Trigger, Name.Content, Name.Item ...; flat export for single-part components. */

// ---- S-31 typed metadata (<Name>.meta.ts, one per exported component) ----
export interface MigrationRow {
  from: string;                                  // 4.x export name, e.g. 'GlassButton'
  props?: Record<string, string | { to: string; values?: Record<string, string> } | null>; // null = removed prop
  selectors?: Record<string, string>;            // 4.x CSS selector -> 5.0 data-ag-part/data-state selector
  automation: 'full' | 'mostly' | 'partial' | 'manual' | 'none';
  compat: boolean;                               // ships an adapter in aura-glass/compat
}
export interface ComponentMeta {
  name: string;                                  // 5.0 export name
  owner: 'CMP' | 'SURF' | 'MAT';
  entry: string;                                 // subpath from S-35, e.g. '.', './data'
  tier: 'T0' | 'T1' | 'T2' | 'preview';
  flagship?: number;                             // 1..44 (architecture §11.2)
  rsc: 'server' | 'client' | 'mixed';
  parts: readonly AgPart[];
  states: readonly string[];                     // data-state / Base UI data-* values
  variants: Readonly<Record<string, readonly string[]>>; // e.g. { variant: [...], size: [...], intent: [...], appearance: [...] }
  material?: { layer: 'chrome' | 'overlay' | 'transient' | 'content'; refractionEligible?: boolean };
  apg?: string;                                  // APG pattern URL when interactive
  budgetKb?: number;                             // must match the stream's size-budgets fragment row
  migration: readonly MigrationRow[];
}
export type DefineMeta = <const M extends ComponentMeta>(meta: M) => M;     // runtime: src/foundation/index.ts (seed)

// ---- S-32 Base UI wrapping helpers (runtime in src/foundation/index.ts, CMP) ----
export type ToChangeDetails = (eventDetails: unknown) => ChangeDetails;
export type RenderElement = <P extends object>(render: RenderProp<P> | undefined, fallback: React.ReactElement, props: P, state?: object) => React.ReactElement;

// ---- S-30 component contracts that other streams compose (exports of CMP modules) ----
export type ButtonContract = React.FC<MaterialBearingProps & IntentProps & SizeProps & RenderProps
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>
  & { pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (p: boolean, d: ChangeDetails) => void; loading?: boolean; ref?: React.Ref<HTMLButtonElement> }>;
export type IconButtonContract = React.FC<React.ComponentProps<ButtonContract> & { label: string; icon: React.ReactNode }>;
export type CompoundContract<Parts extends string, RootProps> =
  { [P in Parts]: React.FC<(P extends 'Root' ? RootProps : unknown) & PartProps & { children?: React.ReactNode }> };
export const COMPOUND_PARTS = {
  Dialog: ['Root', 'Trigger', 'Content', 'Title', 'Description', 'Close', 'Header', 'Body', 'Footer'],
  AlertDialog: ['Root', 'Trigger', 'Content', 'Title', 'Description', 'Cancel', 'Action', 'Header', 'Body', 'Footer'],
  Sheet: ['Root', 'Trigger', 'Content', 'Title', 'Description', 'Close', 'Handle', 'Header', 'Body', 'Footer'],
  Popover: ['Root', 'Trigger', 'Content', 'Title', 'Description', 'Close', 'Arrow'],
  Tooltip: ['Root', 'Trigger', 'Content', 'Arrow', 'Provider'],
  Menu: ['Root', 'Trigger', 'Content', 'Item', 'CheckboxItem', 'RadioGroup', 'RadioItem', 'Group', 'GroupLabel', 'Separator', 'Submenu', 'SubmenuTrigger'],
  ContextMenu: ['Root', 'Trigger', 'Content', 'Item', 'Group', 'GroupLabel', 'Separator'],
  ColorPicker: ['Root', 'Trigger', 'Content', 'Area', 'Hue'],
  Toast: ['Provider', 'Viewport', 'Root', 'Title', 'Description', 'Action', 'Close', 'Progress'],
  Select: ['Root', 'Trigger', 'Value', 'Content', 'Item', 'ItemIndicator', 'Group', 'GroupLabel', 'Separator'],
  Combobox: ['Root', 'Input', 'Trigger', 'Content', 'Item', 'Empty', 'Chips', 'Chip', 'ChipRemove', 'Clear', 'Group', 'GroupLabel'],
  Toolbar: ['Root', 'Button', 'Group', 'Separator', 'Link'],
  ToggleGroup: ['Root', 'Item'],
  SegmentedControl: ['Root', 'Item'],
  Slider: ['Root', 'Value'],
  RadioGroup: ['Root', 'Item'],
  Field: ['Root', 'Label', 'Control', 'Description', 'Error'],
  Collapsible: ['Root', 'Trigger', 'Content'],
  Accordion: ['Root', 'Item', 'Header', 'Trigger', 'Content'],
  ScrollArea: ['Root', 'Viewport', 'Scrollbar', 'Thumb'],
  Avatar: ['Root', 'Image', 'Fallback'],
  Card: ['Root', 'Header', 'Title', 'Description', 'Body', 'Footer'],
  Tour: ['Root', 'Step'],
} as const;
/** C-3b (v1.2): parts the contract requires (REQ-CMP-06, -105, -110) that are not implemented on next yet. Each moves into
    COMPOUND_PARTS (Menubar from FLAT_CMP_COMPONENTS) in the contract commit that follows its CMP implementation, so the
    conformance suite never asserts a part that does not exist. Consumers must not rely on them before that. */
export const COMPOUND_PARTS_PENDING = {
  SegmentedControl: ['Indicator'],
  Slider: ['Track', 'Range', 'Thumb'],
  Menubar: ['Root', 'Menu'],
  Toast: ['History', 'HistoryItem'],
} as const;
export interface CmpRootProps {
  Dialog: OpenProps & { modal?: boolean } & MaterialBearingProps;
  AlertDialog: OpenProps;
  Sheet: OpenProps & { side?: 'start' | 'end' | 'top' | 'bottom'; detents?: number[]; modal?: boolean };
  Popover: OpenProps & { openOnHover?: boolean; delay?: number } & MaterialBearingProps;
  Tooltip: OpenProps & { delay?: number };
  Menu: OpenProps; ContextMenu: OpenProps; Menubar: { orientation?: 'horizontal' | 'vertical' };
  Toast: { limit?: number }; Select: ValueProps<string> & OpenProps & SizeProps; Combobox: ValueProps<string | string[]> & OpenProps & { multiple?: boolean };
  Toolbar: { orientation?: 'horizontal' | 'vertical' } & MaterialBearingProps; ToggleGroup: ValueProps<string[]> & { multiple?: boolean };
  SegmentedControl: ValueProps<string> & SizeProps; Slider: ValueProps<number | number[]> & { min?: number; max?: number; step?: number };
  RadioGroup: ValueProps<string>; Field: { invalid?: boolean; disabled?: boolean; name?: string };
  Collapsible: OpenProps; Accordion: ValueProps<string[]> & { multiple?: boolean }; ScrollArea: Record<string, never>;
  Avatar: SizeProps; Card: MaterialBearingProps & { interactive?: boolean }; Tour: OpenProps & { step?: number };
  ColorPicker: OpenProps;
}
/** Flat CMP components other streams compose (props = PartProps of the root element + the grammar types they list in meta): */
export const FLAT_CMP_COMPONENTS = ['Button', 'IconButton', 'ButtonGroup', 'Switch', 'Checkbox', 'CheckboxGroup', 'TextField',
  'SearchField', 'NumberField', 'Fieldset', 'Form', 'Badge', 'AvatarGroup', 'Alert', 'Progress', 'Meter', 'Skeleton', 'Separator', 'Kbd',
  'Link', 'Rating', 'InlineEdit', 'Menubar', 'FileUpload', 'DescriptionList', 'ImageList', 'EmptyState', 'ErrorState',
  'LoadingState', 'Text', 'Heading', 'Stack', 'Grid', 'Container', 'Icon'] as const;
/** Typed compound contracts, one per COMPOUND_PARTS key (what seeds, doubles and real components all satisfy). */
export type CmpCompounds = { [K in keyof typeof COMPOUND_PARTS]: CompoundContract<(typeof COMPOUND_PARTS)[K][number], CmpRootProps[K]> };
export type CmpExportName = keyof typeof COMPOUND_PARTS | (typeof FLAT_CMP_COMPONENTS)[number] | 'useToast';
/** The one module path that exports each name (consumers import `src/components/<dir>/index.ts`; never a deeper file). */
export const CMP_MODULES: Record<CmpExportName, `src/components/${string}/index.ts`> = {
  Button: 'src/components/button/index.ts', IconButton: 'src/components/icon-button/index.ts', ButtonGroup: 'src/components/button-group/index.ts',
  Toolbar: 'src/components/toolbar/index.ts', ToggleGroup: 'src/components/toggle-group/index.ts', SegmentedControl: 'src/components/segmented-control/index.ts',
  Switch: 'src/components/switch/index.ts', Slider: 'src/components/slider/index.ts', Checkbox: 'src/components/checkbox/index.ts',
  CheckboxGroup: 'src/components/checkbox/index.ts', RadioGroup: 'src/components/radio-group/index.ts', TextField: 'src/components/text-field/index.ts',
  SearchField: 'src/components/search-field/index.ts', Select: 'src/components/select/index.ts', Combobox: 'src/components/combobox/index.ts',
  NumberField: 'src/components/number-field/index.ts', Field: 'src/components/field/index.ts', Fieldset: 'src/components/field/index.ts',
  Form: 'src/components/field/index.ts', Dialog: 'src/components/dialog/index.ts', AlertDialog: 'src/components/alert-dialog/index.ts',
  Sheet: 'src/components/sheet/index.ts', Popover: 'src/components/popover/index.ts', Tooltip: 'src/components/tooltip/index.ts',
  Menu: 'src/components/menu/index.ts', ContextMenu: 'src/components/menu/index.ts', Menubar: 'src/components/menu/index.ts',
  Toast: 'src/components/toast/index.ts', useToast: 'src/components/toast/index.ts', Text: 'src/components/text/index.ts',
  Heading: 'src/components/heading/index.ts', Stack: 'src/components/stack/index.ts', Grid: 'src/components/grid/index.ts',
  Container: 'src/components/container/index.ts', Icon: 'src/components/icon/index.ts', Card: 'src/components/card/index.ts',
  Badge: 'src/components/badge/index.ts', Avatar: 'src/components/avatar/index.ts', AvatarGroup: 'src/components/avatar/index.ts',
  Alert: 'src/components/alert/index.ts', Progress: 'src/components/progress/index.ts', Meter: 'src/components/meter/index.ts',
  Skeleton: 'src/components/skeleton/index.ts', Separator: 'src/components/separator/index.ts', Kbd: 'src/components/kbd/index.ts',
  Accordion: 'src/components/accordion/index.ts', Collapsible: 'src/components/collapsible/index.ts', Link: 'src/components/link/index.ts',
  ScrollArea: 'src/components/scroll-area/index.ts', Rating: 'src/components/rating/index.ts', InlineEdit: 'src/components/inline-edit/index.ts',
  FileUpload: 'src/components/file-upload/index.ts', ColorPicker: 'src/components/color-picker/index.ts', DescriptionList: 'src/components/description-list/index.ts',
  ImageList: 'src/components/image-list/index.ts', Tour: 'src/components/tour/index.ts', EmptyState: 'src/components/state-view/index.ts',
  ErrorState: 'src/components/state-view/index.ts', LoadingState: 'src/components/state-view/index.ts',
};

// ---- S-30 toast API (archived REQ-OVL-61/67; Toast.Provider is mounted by the app, never by AuraGlassProvider, §4.5) ----
export interface ToastOptions { title: React.ReactNode; description?: React.ReactNode; intent?: Intent;
  action?: { label: string; onClick: () => void }; duration?: number; priority?: 'low' | 'high' }
export interface ToastHistoryItem { id: string; title: React.ReactNode; description?: React.ReactNode; intent?: Intent; createdAt: number; read: boolean }
export type UseToast = () => {
  toast(options: ToastOptions): string;
  update(id: string, options: Partial<ToastOptions>): void;
  dismiss(id?: string): void;
  promise<T>(p: Promise<T>, o: { loading: ToastOptions; success: ToastOptions | ((v: T) => ToastOptions); error: ToastOptions | ((e: unknown) => ToastOptions) }): Promise<T>;
  toasts: readonly ({ id: string } & ToastOptions)[];
  history: { items: readonly ToastHistoryItem[]; unread: number; markRead(id: string): void; markAllRead(): void; clear(): void } | null; // null unless Provider history is on
};
```

**What S-30 guarantees.** The names, the compound part names, the root props above and the grammar types are frozen. CMP may **add** optional props without a contract PR. A new **required** prop, a renamed part, or a removed prop is a breaking contract change (§1.3). SURF, PLAT and QUAL may rely on nothing beyond this block and the component's `meta.ts`.

The archived FND example used `layer: "control"`. That value does not exist: a Switch thumb is `layer: "transient"`.

### 4.7 `src/contracts/entries.ts` (S-35) and the root composition

```ts
/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. build/exports.manifest.json is generated from this list by C0 and
   regenerated only by contract PRs. Value exports listed; type exports are free within the entry owner's barrel. */
export interface EntrySpec { subpath: string; source: string; owner: 'PLAT' | 'MAT' | 'CMP' | 'SURF'; ga: '5.0' | '5.1'; exports: readonly string[]; css?: string }
export const ENTRIES: readonly EntrySpec[] = [
  { subpath: '.', source: 'src/index.ts', owner: 'PLAT', ga: '5.0', exports: ['@see ROOT_EXPORTS'], css: 'dist/styles.css' },
  { subpath: './material', source: 'src/material/index.ts', owner: 'MAT', ga: '5.0', css: 'dist/material.css',
    exports: ['Surface', 'SurfaceGroup', 'Environment', 'ScrollEdge', 'ConcentricFrame', 'materialProps', 'useMaterialTier'] },
  { subpath: './theme', source: 'src/theme/public.ts', owner: 'MAT', ga: '5.0',
    exports: ['AuraGlassProvider', 'AuraGlassScript', 'auraGlassPrepaintScript', 'createGlassTheme', 'createBrandTheme', 'presets',
      'usePreference', 'useResolvedPreferences', 'usePreferenceActions', 'GlassPreferencesPanel'] },
  { subpath: './tokens', source: 'src/tokens/index.ts', owner: 'MAT', ga: '5.0', exports: ['tokens'], css: 'dist/tokens.css' },
  { subpath: './motion', source: 'src/motion/public.ts', owner: 'MAT', ga: '5.0',
    exports: ['MotionProvider', 'toMotionTransition', 'useDragDetents', 'useMomentum', 'SharedLayout', 'Shared', 'magnetic'] },
  { subpath: './primitives', source: 'src/primitives/index.ts', owner: 'CMP', ga: '5.0',
    exports: ['Slot', 'Portal', 'VisuallyHidden', 'FocusScope', 'Label', 'DismissableLayer'] },
  { subpath: './icons', source: 'src/icons/index.ts', owner: 'CMP', ga: '5.0', exports: ['@glyphs'] },   // + './icons/<name>' pattern
  { subpath: './forms', source: 'src/forms/index.ts', owner: 'CMP', ga: '5.0', exports: ['FormField', 'useFormField'] },
  { subpath: './app-shell', source: 'src/app-shell/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/app-shell.css',
    exports: ['AppShell', 'Sidebar', 'TopBar', 'StatusBar', 'Inspector', 'ResizablePanels', 'MobileShell'] },
  { subpath: './data', source: 'src/data/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/data.css',
    exports: ['Table', 'TreeView', 'FilterBar', 'Chip', 'KeyValueEditor', 'StatCard', 'Sparkline', 'ChartFrame'] },
  { subpath: './date', source: 'src/date/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/date.css',
    exports: ['DateField', 'TimeField', 'DatePicker', 'DateRangePicker', 'Calendar', 'TimePicker', 'RangeCalendar'] },
  { subpath: './ai', source: 'src/ai/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/ai.css',
    exports: ['Thread', 'Message', 'StreamingText', 'Composer', 'ToolCall', 'SourceList', 'Citation', 'Reasoning', 'AgentSteps', 'UsageMeter', 'ProviderErrorState'] },
  { subpath: './media', source: 'src/media/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/media.css',
    exports: ['MediaControls', 'NowPlayingBar', 'ImageViewer', 'CarouselRail', 'useMediaElement', 'MediaScrubber', 'formatMediaTime'] },
  { subpath: './backdrops', source: 'src/backdrops/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/backdrops.css', exports: ['Backdrop'] },
  { subpath: './three', source: 'src/three/index.ts', owner: 'SURF', ga: '5.0', exports: [] }, // OI-01: no 4.x three component ported; exports: [] at 5.0, ga kept
  { subpath: './charts', source: 'src/charts/index.ts', owner: 'SURF', ga: '5.1', exports: ['Chart'], css: 'dist/charts.css' },
  { subpath: './compat', source: 'src/compat/index.ts', owner: 'PLAT', ga: '5.0', exports: ['@union of src/compat/<stream>/index.ts'] },
  // CSS-only and data entries (PLAT assembles from fragments/css/*):
  { subpath: './styles.css', source: 'build:css', owner: 'PLAT', ga: '5.0', exports: [] },
  { subpath: './tokens.css', source: 'build:css', owner: 'MAT', ga: '5.0', exports: [] },
  { subpath: './material.css', source: 'build:css', owner: 'MAT', ga: '5.0', exports: [] },
  { subpath: './tailwind.css', source: 'build:css', owner: 'PLAT', ga: '5.0', exports: [] },
  { subpath: './compat/tokens.css', source: 'build:css', owner: 'MAT', ga: '5.0', exports: [] },
  { subpath: './compat/globals.css', source: 'build:css', owner: 'PLAT', ga: '5.0', exports: [] },
  { subpath: './deprecations.json', source: 'build:deprecations', owner: 'PLAT', ga: '5.0', exports: [] },
  { subpath: './package.json', source: 'package.json', owner: 'PLAT', ga: '5.0', exports: [] },
];
/** './fonts.css' exists only if the D-31 licence clears (PLAT decision record); it is then added by a contract PR. */
export const ROOT_EXPORTS = {
  cmp: ['Button', 'IconButton', 'ButtonGroup', 'Toolbar', 'ToggleGroup', 'SegmentedControl', 'Switch', 'Slider', 'Checkbox',
    'CheckboxGroup', 'RadioGroup', 'TextField', 'SearchField', 'Select', 'Combobox', 'NumberField', 'Field', 'Fieldset', 'Form',
    'Dialog', 'AlertDialog', 'Sheet', 'Popover', 'Tooltip', 'Menu', 'ContextMenu', 'Menubar', 'Toast', 'useToast',
    'Text', 'Heading', 'Stack', 'Grid', 'Container', 'Icon',
    'Card', 'Badge', 'Avatar', 'AvatarGroup', 'Alert', 'Progress', 'Meter', 'Skeleton', 'Separator', 'Kbd', 'Accordion',
    'Collapsible', 'Link', 'ScrollArea', 'Rating', 'InlineEdit', 'FileUpload', 'ColorPicker', 'DescriptionList', 'ImageList',
    'Tour', 'EmptyState', 'ErrorState', 'LoadingState', 'VisuallyHidden'],
  surf: ['Tabs', 'TabBar', 'Breadcrumbs', 'Pagination', 'CommandPalette', 'Command', 'SourceTransition', 'Timeline', 'ActivityFeed'],
  mat: ['Surface', 'SurfaceGroup', 'Environment', 'ScrollEdge', 'ConcentricFrame', 'AuraGlassProvider', 'AuraGlassScript', 'usePreference'],
} as const;
```

**Pre-declared root files** (created by C0, rows A06 and A07):

```ts
// src/index.ts  (CONTRACT, verbatim, no directive; duplicate names fail tsc with TS2308)
export * from './root/cmp';
export * from './root/surf';
export * from './root/mat';
```

```ts
// src/root/cmp.ts | src/root/surf.ts | src/root/mat.ts  (C0 seed content; each owner fills in its re-exports)
/* @ag-contract-seed: the owner replaces this with re-exports of exactly ROOT_EXPORTS.<stream> */
export {};
```

```ts
// src/compat/index.ts  (CONTRACT, verbatim)
export * from './plat';
export * from './mat';
export * from './cmp';
export * from './surf';
```

Each `src/compat/<stream>/index.ts` starts as `export {};` (seed). The conformance test `tests/contract/entries.test.ts` (QUAL) asserts, against the packed tarball, that each entry's value exports equal its `exports` list. During pre-releases a missing name is reported as `pending` rather than failing (§6.1). At GA it fails (G-03).

**`build/exports.manifest.json`** is generated mechanically from `ENTRIES` by C0. It is owned by PLAT, and changes only when `entries.ts` changes in a contract PR. Its shape is `{ "$schema": "./exports.manifest.schema.json", "version": 1, "entries": [{ "subpath", "source", "types", "default", "css" }] }`. `types` comes first in the generated `exports` map (D-03). Removed 4.x subpaths (§3.2 "Removed in 5.0") have no row.

**Export conditions (C-5, v1.2).** The generated JS entries carry exactly `{ types, default }`. A `css` condition is rejected: Node and bundlers stop at `default`, so a `css` key after it is never selected, and CSS is reached only through the CSS subpaths (`./styles.css`, `./material.css`, …). `ENTRIES[].css` names the bundle that the entry's CSS subpath ships, not an export condition.

**5.1 additions (C-14, v1.2).** `DateTimePicker` (`./date`) and `Waveform` (`./media`) are not 5.0 exports. The 5.1 contract PR adds them to those entries' `exports`; there is no `./date-time` entry.

The 4.x subpaths `./tokens/json`, `./tokens/tailwind`, `./tokens/manifest`, `./tokens/css`, `./styles`, `./primitives/<name>`, `./icons/<category>` and the alias subpaths are not 5.0 entries. Their 4.x deprecation entries are PLAT's (`fragments/deprecations/plat.ts`).

### 4.8 `src/contracts/fragments.ts` and `src/contracts/load-fragments.mjs` (S-38, S-39, S-43..S-46, S-50)

```ts
/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. Every fragments/<kind>/<stream>.ts default-exports `[...] satisfies <Type>`. */
export type StreamKey = 'plat' | 'mat' | 'cmp' | 'surf' | 'qual';

// ---- S-38 deprecations (was SC-02/SC-03; envelope generated as {"$schema","version":1,"entries":[...]}) ----
export type DeprecationKind = 'export' | 'subpath' | 'prop' | 'prop-value' | 'css-var' | 'css-global' | 'peer'
  | 'dependency' | 'engine' | 'behavior' | 'cli' | 'data-attr' | 'asset';
export interface DeprecationEntry {
  id: `DEP-${'P' | 'M' | 'C' | 'S' | 'Q'}${number}`;   // per-stream id space: DEP-P0001 (PLAT) ... DEP-S0001 (SURF); no collisions
  kind: DeprecationKind;
  status: 'active' | 'planned';
  entry: string;                        // 4.x subpath, e.g. '.', './navigation'
  symbol: string;
  since: `4.${number}.${number}`;
  removeIn: '5.0.0' | '6.0.0';
  replacement: string | null;
  codemod: CodemodId | null;
  automation: 'full' | 'mostly' | 'partial' | 'manual' | 'none';
  breaking: `B${number}`;               // architecture §14.5 B1..B16
  message: string;                      // <= 200 chars
  doc: `#dep-${string}`;
  compat?: string;                      // aura-glass/compat export that keeps it working in 5.x
  exception?: 'security' | 'privacy' | 'crash' | 'legal' | 'honesty';
  evidence?: string;
}
export type DeprecationFragment = readonly DeprecationEntry[];

// ---- S-39 codemods (was SC-33) ----
export const CORE_CODEMODS = ['imports-subpaths', 'canonical-names', 'prop-grammar', 'dead-optical-props', 'providers', 'css-vars', 'deps', 'removed'] as const;
export const AREA_CODEMODS = { 'ai-chat': 'surf', 'app-shell-slots': 'surf', 'media-backdrops': 'surf',
  'reduced-motion-initial': 'mat', 'motion-imports': 'mat', 'motion-props': 'mat' } as const;
export type CodemodId = (typeof CORE_CODEMODS)[number] | keyof typeof AREA_CODEMODS;
export interface CodemodMappingFragment {
  renames?: Array<{ from: string; fromEntry: string; to: string; toEntry: string; compatOnly?: boolean }>;   // canonical-names, imports-subpaths
  props?: Array<{ component: string; from: string; to: string | null; values?: Record<string, string | Record<string, unknown>>; todo?: string }>; // prop-grammar
  cssVars?: Record<`--glass-${string}`, `--ag-${string}` | null>;   // css-vars (MAT supplies the alias map)
  removed?: Array<{ symbol: string; entry: string; reason: string; registryItem?: string; doc: string }>;  // removed
  deps?: Array<{ pkg: string; range: string; when: string }>;      // deps (PLAT)
  areaTransforms?: Array<{ id: keyof typeof AREA_CODEMODS; module: string /* packages/cli/src/migrate/4to5/transforms/<id>.ts, written by PLAT from this spec */; spec: string }>;
  fixtures?: string[];                  // fragments/codemods/<stream>/fixtures/<id>/<case>/ dirs the stream authored (never under packages/cli/)
}
export const TODO_MARKER = '// TODO(aura-glass 5): <reason>, see <doc>' as const;

// ---- S-44 budgets (was SC-15) ----
export interface SizeBudgetRow { id: string; import: string /* e.g. "{ Button } from 'aura-glass'" or 'aura-glass/data.css' */; limitBytes: number; kind: 'js' | 'css' }
export const DEFAULT_CEILINGS = { subpathCssBytes: 8192, stylesCssBytes: 32768, tarballBytes: 2 * 1024 * 1024, nodeColdImportMs: 150 } as const;
export const PROVISIONAL_ROWS = { Button: 10240, Dialog: 20480, Select: 25600, Table: 46080, AiThreadMessageComposer: 25600, MaterialJs: 3072, SingleIcon: 1024 } as const;
export interface PerfBudgetRow {
  subject: string;                      // story id or component name
  profile: 'mid-mobile' | 'desktop-120hz';
  metric: 'frame-p95-ms' | 'long-tasks' | 'blurred-surfaces' | 'bci' | 'lcp-ms' | 'grade';
  max: number | 'A' | 'B' | 'C';
  provisional: boolean;                 // true until the alpha.1 calibration PR (D-26); afterwards ratchet-down only
}

// ---- S-43 lane registration ----
export type LaneId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10' | 'L11' | 'L12' | 'L13' | 'L14';
export interface LaneRegistration {
  lane: LaneId;
  kind: 'node-script' | 'jest' | 'playwright' | 'story-subjects' | 'manual-record';
  path: string;                         // glob or file inside the registering stream's own paths
  scope: 'pr' | 'main' | 'release' | 'nightly';
  remote: boolean;                      // true for every browser, perf and heavy lane (machine policy)
  failClosed: true;
}
export interface PlaywrightProjectFragment { name: `${StreamKey}:${string}`; testDir: string; testMatch?: string; use?: Record<string, unknown> }

// ---- S-45 other fragments ----
export interface CssFragment { file: string; layer: 'ag.compat' | 'ag.reset' | 'ag.tokens' | 'ag.material' | 'ag.components' | 'ag.a11y'; bundle: 'styles.css' | 'tokens.css' | 'material.css' | 'data.css' | 'date.css' | 'ai.css' | 'media.css' | 'app-shell.css' | 'backdrops.css' | 'charts.css' | 'compat/tokens.css' | 'compat/globals.css'; order?: number }
export interface SideEffectException { module: string; reason: string; expires: string /* version */ }
export interface ReviewItem { id: string; subject: string; criterion: 'specular-quality' | 'optical-hierarchy' | 'radius-rhythm' | 'one-hand' | 'other'; note?: string }
export interface LiteralsBaseline { version: 1; files: Record<string, Partial<Record<'color' | 'blur' | 'radius' | 'shadow' | 'duration' | 'easing' | 'spring', number>>> }
export interface A11yBaseline { version: 1; violations: Array<{ subject: string; rule: string; count: number; issue: string }> }
export interface SrRecord { flagship: string; at: 'voiceover-macos' | 'voiceover-ios' | 'nvda-chrome' | 'talkback-chrome' | 'touch'; result: 'pass' | 'fail'; date: string; tester: string; notes?: string; sha: string
  /* C-16 (v1.2), optional evidence fields; schema contracts/schemas/sr-record.schema.json is the single SrRecord schema */
  atVersion?: string; browser?: string; browserVersion?: string; os?: string; osVersion?: string; device?: string; subject?: string;
  steps?: ReadonlyArray<{ nameRoleValue: string; stateChange: string; openClose: string; liveRegion: string; gesture?: string; nonDragAlternative?: string; pass: boolean; notes?: string }> }
export type RegistryItemOwner = { id: string; type: 'registry:base' | 'registry:block' | 'registry:item'; owner: 'PLAT' | 'CMP' | 'SURF'; ga: boolean };
export type FragmentKind = 'deprecations' | 'codemods' | 'size-budgets' | 'perf-budgets' | 'lanes' | 'playwright' | 'css' | 'side-effects' | 'review' | 'literals-baseline' | 'a11y-baseline';
```

**Codemod authoring split.** PLAT owns `packages/cli/**`, including every transform module and every fixture directory. A stream never writes into `packages/cli/`. It supplies:

- its mapping data in `fragments/codemods/<stream>.ts`;
- for area transforms (`ai-chat`, `app-shell-slots`, `media-backdrops`, `reduced-motion-initial`, `motion-imports`, `motion-props`), a written spec in `areaTransforms[].spec` plus input/output fixture pairs under `fragments/codemods/<stream>/fixtures/<id>/<case>/{input,output}.*`.

PLAT's engine loads fixtures from both `packages/cli/src/migrate/4to5/__fixtures__/` and `fragments/codemods/*/fixtures/`. The area transform code is PLAT's, written from the spec. Until it lands, the fixtures are reported as `pending`, never as blocking (§6.1).

**One source per mapping.** The engine reads only `fragments/codemods/*`. A component's `meta.ts` `migration` rows are documentation input for PLAT's docs generators; `meta.test.ts` (§6.3) asserts that every `MigrationRow.props` entry equals the matching `CodemodMappingFragment.props` row of the same stream, so the two can never disagree, and neither needs another stream's generator.

```js
// src/contracts/load-fragments.mjs  (CONTRACT, verbatim; S-50). Node >= 20.19, esbuild from devDependencies.
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { build } from 'esbuild';
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];
/** @returns {Promise<Array<{ stream: string, file: string, value: unknown }>>} sorted by stream order, then file name */
export async function loadFragments(kind, root = process.cwd()) {
  const dir = join(root, 'fragments', kind);
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const stream = basename(name, extname(name));
    if (!STREAMS.includes(stream) || !['.ts', '.json'].includes(extname(name))) continue;
    const file = join(dir, name);
    if (extname(name) === '.json') { out.push({ stream, file, value: JSON.parse(readFileSync(file, 'utf8')) }); continue; }
    const res = await build({ entryPoints: [file], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
    /* The esbuild bundle is self-contained — evaluate it directly rather than
       `import('data:…')`, which jest's module registry cannot resolve. Same
       code path under node and jest: rewrite `export default` → `return`. */
    let code = res.outputFiles[0].text;
    code = code
      .replace(/export\s*\{\s*([\w$]+)\s+as\s+default[^}]*\};?\s*$/, 'return $1;')
      .replace(/export\s+default\s+([^;]+);?\s*$/, 'return $1;');
    const value = new Function(code)();
    out.push({ stream, file, value: value ?? [] });
  }
  return out.sort((a, b) => STREAMS.indexOf(a.stream) - STREAMS.indexOf(b.stream));
}
```

A fragment module may import only from `src/contracts/**`. That keeps every fragment loadable on the day it is written. Deprecation ids change from SC-03's single `DEP-\d{4}` space to one id space per stream (`DEP-P…`, `DEP-M…`, `DEP-C…`, `DEP-S…`, `DEP-Q…`), so that two streams can never pick the same id.

### 4.9 `src/contracts/testing.ts` (S-40..S-43, S-48)

```ts
/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. Runtime helpers implemented by QUAL in tests/helpers/index.ts. */
import type * as React from 'react';
import type { Backdrop, DomTier, Transparency } from './material';
import type { Scheme, Contrast } from './preferences';
import type { MotionPreference } from './motion';

// ---- S-42 scenes (was SC-28) ----
export const SCENES = ['photo', 'saturated-abstract', 'dense-text', 'dark-media', 'flat-white', 'flat-black', 'hf-pattern', 'video-frame'] as const;
export type SceneId = (typeof SCENES)[number];
export const SCENE_ASSETS = { dir: 'certification/scenes/', manifest: 'certification/scenes/scenes.manifest.json', storybookStaticPath: '/scenes', storyId: (id: SceneId) => `scenes--${id}` } as const;
export const SCENE_BACKDROP: Record<SceneId, Backdrop> = { photo: 'media', 'saturated-abstract': 'media', 'dense-text': 'light',
  'dark-media': 'media', 'flat-white': 'light', 'flat-black': 'dark', 'hf-pattern': 'media', 'video-frame': 'media' };
export const COMPOSITES = ['white', 'black', 'busy'] as const;   // contrast-gate inputs; never called "backdrops"

// ---- S-43 lanes (was SC-29) ----
export const LANES = { L1: 'Static', L2: 'Artifact', L3: 'Change class', L4: 'Token contrast', L5: 'Behaviour', L6: 'Environment visual',
  L7: 'Pixel regression', L8: 'Engine-specific', L9: 'Motion', L10: 'Performance', L11: 'Consumer canaries', L12: 'Unit',
  L13: 'Manual SR', L14: 'Human visual review' } as const;
/** CI is GitLab CI only (§4.13). No GitHub Actions workflow exists; these are GitLab job names. */
export const CI = { root: '.gitlab-ci.yml', fragment: (s: 'plat' | 'mat' | 'cmp' | 'surf' | 'qual') => `ci/${s}.gitlab-ci.yml`,
  project: 'chahal-foundation-group/github-auraoneai/auraglass', projectId: 87152036 } as const;
export const STAGES = ['contract', 'build', 'test', 'package', 'certify', 'deploy', 'publish'] as const; // v1.2: package before certify (qual:certify:* need plat:package:pack)
export type CiScope = 'pr' | 'main' | 'nightly' | 'release';     // $AG_SCOPE, set by workflow:rules in .gitlab-ci.yml
export type CiLine = '4x' | '5x';                                // $AG_LINE
export const LANE_COMMAND = 'node certification/run.mjs --lane <id> --scope $AG_SCOPE' as const;
/** Jobs whose failure fails the pipeline that gates a PR (§2.3). Was REQUIRED_CHECKS ('Glass Quality Gates', 'Next.js npm Integration',
    'Vite npm Integration', 'change-class', 'ownership', 'contract-conformance'). contract:* are blocking from C0; the rest from activation. */
export const REQUIRED_JOBS = ['contract:ownership', 'contract:conformance', 'contract:ci-fragments', 'plat:gate:glass-quality',
  'plat:integration:next', 'plat:integration:vite', 'plat:gate:change-class'] as const;
/** QUAL lane jobs (was certify-l1..l12 in certify-pr.yml/certify-main.yml). L13/L14 are release artifacts, not jobs. */
export const CERT_JOBS = ['qual:certify:l1', 'qual:certify:l2', 'qual:certify:l3', 'qual:certify:l4', 'qual:certify:l5', 'qual:certify:l6',
  'qual:certify:l7', 'qual:certify:l8', 'qual:certify:l9', 'qual:certify:l10', 'qual:certify:l11', 'qual:certify:l12'] as const;
/** Every job name another stream (or the root) may reference in `needs` (always with optional: true, §4.13.4). */
export const CI_JOBS = { root: ['contract:ownership', 'contract:conformance', 'contract:ci-fragments'],
  plat: ['plat:build:dist', 'plat:package:pack', 'plat:gate:glass-quality', 'plat:gate:change-class', 'plat:integration:next',
    'plat:integration:vite', 'plat:build:docs', 'plat:publish:npm', 'pages'],
  mat: ['mat:build:tokens'],
  qual: ['qual:build:storybook', ...CERT_JOBS, 'qual:certify:nightly', 'qual:certify:release'],
  cmp: [], surf: [] } as const;
export const REQUIRED_CHECKS = REQUIRED_JOBS;   // alias kept for archived references; do not use in new code
export const VISUAL_TOLERANCE = { pixelmatchThreshold: 0.1, includeAA: false, changedRatio: 0.001 } as const; // was SC-09

// ---- S-48 evidence (was SC-07). GitLab job artifacts; never committed. ----
export const EVIDENCE = { dirEnv: 'AURAGLASS_EVIDENCE_DIR', defaultDir: '.artifacts',
  /** each job writes only under .artifacts/<stream>/<CI_JOB_NAME_SLUG>/ so artifacts from several jobs merge without collisions */
  jobDir: '.artifacts/<stream>/<job-slug>/', artifactName: 'evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA',
  expireIn: { pr: '14 days', main: '14 days' /* plus GitLab "keep latest artifacts" per ref */, nightly: '30 days', release: '90 days' },
  committed: false,
  /** Tarball hand-off: any lane that needs the package runs plain `npm pack --pack-destination .artifacts/pack` (or reads AURAGLASS_TARBALL
      when plat:package:pack ran in the same pipeline and exported it through its dotenv report). No lane depends on a PLAT pack script existing. */
  tarballEnv: 'AURAGLASS_TARBALL', tarballDir: '.artifacts/pack' } as const;

// ---- S-55 cross-stream report artifacts (QUAL writes; PLAT reads). Paths are relative to the pipeline's merged artifacts. ----
export const REPORTS = { visualClass: '.artifacts/qual/visual-class.json', perf: '.artifacts/qual/perf-report.json',
  releaseVerdict: '.artifacts/qual/release-verdict.json', subjects: 'storybook-static/cert-manifest.json' } as const;
export interface VisualClassReport { version: 1; sha: string; base: string;
  cells: Array<{ cell: string /* <storyId>|<scene>|<engine>|<axes> */; changedRatio: number; changed: boolean; reason?: string }>;
  changedCount: number }      // archived REL-040 shape; written by qual:certify:l7, read by plat:gate:change-class, which decides the class
export interface PerfReport { version: 1; sha: string;
  subjects: Array<{ subject: string; profile: PerfProfileId; metrics: Record<string, number>; grade: 'A' | 'B' | 'C' | 'D' | 'F' }> } // read by PLAT docs-claims (G-14)
export type PerfProfileId = 'mid-mobile' | 'desktop-120hz';
export interface ReleaseVerdict { version: 1; sha: string; tag: string;
  items: Array<{ id: `G-${string}`; status: 'pass' | 'fail' | 'pending' }>; ga: boolean /* true only when every G-01..G-16 item is pass */ } // read by plat:publish:npm
export interface SubjectIndex { version: 1; stories: Array<{ id: string; subject: string; kind: StoryKind; tags: readonly string[];
  owner: 'CMP' | 'SURF' | 'MAT' | 'QUAL' | 'PLAT' }> }   // generated by QUAL from parameters.ag at storybook build; seed builds it from index.json tags

// ---- S-41 story metadata (was REQ-QA-01, REQ-SB-05/12/42) ----
export type StoryKind = 'lab' | 'component' | 'matrix' | 'scene' | 'showcase';
export const STORY_TAGS = ['flagship', 'core', 'apg', 'lab', 'scene', 'showcase', 'certified', 'no-cert'] as const;
export const REQUIRED_FLAGSHIP_STORIES = ['Playground', 'States', 'Keyboard'] as const;
export interface StoryStateDrive { name: string; drive?: Array<{ action: 'hover' | 'focus' | 'press' | 'open' | 'type'; target: string /* data-ag-part */; text?: string }> }
export interface StoryAgParameters {
  subject: string;                      // ComponentMeta.name or showcase id; explicit, never fuzzy-matched
  kind: StoryKind;
  states?: StoryStateDrive[];
  refraction?: boolean;
  scenes?: readonly SceneId[] | 'all';  // default 'all' for flagships
  tier?: DomTier;                       // forced in certification runs
  axes?: { transparency?: readonly Transparency[]; scheme?: readonly Scheme[]; contrast?: readonly Contrast[] };
}
// usage: export default { title, component, tags: ['flagship'], parameters: { ag: { subject: 'Button', kind: 'component' } satisfies StoryAgParameters } }
/** Stories in src/**, stories/**, registry/** and showcase/** never import from .storybook/**. Lab framing, matrix grids,
    scene backgrounds and preference axes are applied by QUAL's preview decorators from parameters.ag: kind 'matrix' renders
    meta.variants × states (from the component's meta.ts, found by subject); kind 'lab' wraps the story in the Material Lab frame.
    Archived helpers (defineComponentStories, MatrixGrid, MaterialLabFrame) are QUAL internals behind these decorators. */

// ---- S-40 test helper API (tests/helpers/index.ts, QUAL; seed in C0) ----
export interface AgEnvironment { scheme?: Scheme; contrast?: Contrast; transparency?: Transparency; motion?: MotionPreference;
  tier?: DomTier; backdrop?: Backdrop; forcedColors?: boolean; provider?: boolean /* default true */ }
export type RenderAg = (ui: React.ReactElement, env?: AgEnvironment) => import('@testing-library/react').RenderResult;  // jsdom; sets data-ag-* like AuraGlassScript
export type RenderAgServer = (ui: React.ReactElement, env?: AgEnvironment) => { html: string; hydrate(): Promise<{ warnings: string[] }> };
export type ExpectParts = (container: Element, meta: { parts: readonly string[] }) => void;   // DOM parts == meta.parts
export type ExpectNoBannedAttributes = (container: Element) => void;                          // BANNED_ATTRIBUTES, data-ag-seed
export type GotoStory = (page: import('@playwright/test').Page, storyId: string, env?: AgEnvironment & { scene?: SceneId; stub?: 'reference' }) => Promise<void>; // waits for data-ag-cert-ready
/** Subject enumeration for stream-authored browser specs that iterate other streams' stories (e.g. MAT zoom-reflow over every flagship):
    reads REPORTS.subjects from the Storybook under test. A spec never hard-codes another stream's story ids. */
export type ListSubjects = (filter?: { tags?: readonly string[]; kind?: StoryKind; owner?: SubjectIndex['stories'][number]['owner'] }) => Promise<SubjectIndex['stories']>;
export interface ApgStep {
  press?: string;                       // Playwright key, e.g. 'ArrowRight', 'Shift+Tab'
  type?: string;                        // text typed into the focused element
  expectFocus?: string;                 // data-ag-part value, or 'role=<role>[name=<accessible name>]'
  expectState?: Record<string, string>; // attribute -> value on the focused element (aria-*, data-state)
  expectAnnounced?: string;             // substring expected in the announcer regions (S-26)
}
export interface ApgHarness {                                                                  // tests/a11y/apg/harness.ts
  keyboard(page: import('@playwright/test').Page, script: readonly ApgStep[]): Promise<void>;  // call after gotoStory
  axe(page: import('@playwright/test').Page, opts?: { colorContrast?: true }): Promise<void>;
}
/** Page-side perf probes for stream-authored tests/perf/browser/<stream>/*.spec.ts (QUAL implements; L10 runs them remotely). */
export interface PerfProbe {
  blurredSurfaces(page: import('@playwright/test').Page): Promise<number>;            // elements with non-none backdrop-filter, incl. ::before
  bci(page: import('@playwright/test').Page): Promise<number>;                        // blur cost index (archived PERF §4.6)
  frames(page: import('@playwright/test').Page, opts: { durationMs: number; during?: () => Promise<void> }): Promise<{ p95Ms: number; longTasks: number }>;
  settledIdle(page: import('@playwright/test').Page, opts?: { afterMs?: number }): Promise<{ pendingRaf: number; intervals: number; infiniteAnimations: number }>;
}
```

The `tests/helpers/index.ts` exports are frozen: `renderAg`, `renderAgServer`, `expectParts`, `expectNoBannedAttributes`, `gotoStory`, `listSubjects`, `apg` (an `ApgHarness`), `perf` (a `PerfProbe`) and `scenes` (re-exporting `SCENES`). The Jest setup file is `tests/helpers/setup.ts`, which adds `@testing-library/jest-dom` and `jest-axe` matchers. Both are created by C0 as seeds (§4.10). The `stub: 'reference'` option of `gotoStory` (used in §5.1) is part of the frozen signature.

**S-51 docs blocks.** `.storybook/blocks/index.tsx` (QUAL) exports exactly `Anatomy` (`{ of: ComponentMeta }`: the `data-ag-part` table), `KeyboardTable` (`{ script: readonly ApgStep[] }`), `MigrationTable` (`{ of: ComponentMeta }`: `meta.migration` rows), `PropsTable` (`{ of: ComponentMeta }`) and `SelectorTable` (`{ of: ComponentMeta }`: `migration.selectors`). MDX files anywhere in the story globs may import that one module and nothing else under `.storybook/**`; `.stories.tsx` files still import nothing from `.storybook/**`. Flagship docs pages are **not** hand-written MDX in QUAL's paths: QUAL's preview sets `parameters.docs.page` for every story whose `parameters.ag.subject` resolves to a `ComponentMeta`, rendering those blocks from the meta. That removes the archived SB-083..SB-088 edges (QUAL MDX importing CMP and SURF story files, an R3 violation). A stream that wants extra prose writes `<Name>.mdx` beside its own component. PLAT's generated migration pages (`stories/plat/migration/*.generated.mdx`, archived REL-119) use the same blocks.

### 4.10 Seeds (C0-3)

A seed is a real, working, minimal module at the owner's final path. It exports exactly the frozen names, so consumers compile, render and test on day 0. Rules:

- The first line is `/* @ag-contract-seed: <seam id>. Owner <STREAM> replaces internals; exports frozen. */`.
- Seeds use only React, `src/contracts/**` and the shared seed helper `src/contracts/seed.tsx`. They never use Base UI and never use another stream's code.
- Rendered seed elements carry `data-ag-seed`, which QUAL's `expectNoBannedAttributes` and the GA gate reject (R5, G-02).
- The owner removes the marker in the PR that lands the real implementation. Removing the marker without replacing the behaviour fails the conformance test for that seam (§6.3).

| Seed path | Seam | Owner | Seed behaviour (C0) |
|---|---|---|---|
| `src/material/index.ts` | S-05, S-06 | MAT | `materialProps` is the **final** implementation, with exactly these emission rules: `data-ag-layer` = `role.layer ?? 'content'` (always emitted; components pass their own layer); `data-ag-variant` = `role.variant ?? 'regular'`, omitted only when the layer is `content` and `role.variant` is undefined; `data-ag-content` = `role.content ?? 'content-raised'` when the layer is `content`, never otherwise; `data-ag-thickness` and `data-ag-shape` only when set; each boolean attribute only when `true`. `Surface` renders `render ?? <div>` with `materialProps` merged, `className` joined and `style` passed through untouched. `SurfaceGroup` renders `div[data-ag-group]`. `Environment` renders `div[data-ag-backdrop]`. `ScrollEdge` renders `div[data-ag-edge][data-ag-edge-style]`. `ConcentricFrame` sets `--ag-radius-outer` and `--ag-inset`. `useMaterialTier` returns `'standard'` |
| `src/tokens/index.ts` | S-10 | MAT | `tokens` is an object with one entry per `PUBLIC_CSS_VARS` name and the value `var(<name>)` |
| `src/motion/index.ts` | S-13 | MAT | `subscribeFrame` runs one rAF loop, with a 50 ms cap and a pause on `visibilitychange`. `observeOffscreen` uses one shared `IntersectionObserver` that toggles `data-ag-offscreen`. `startMorph` calls `update()` synchronously. `MotionCapabilityContext` is `createContext<MotionCapability \| null>(null)` |
| `src/motion/public.ts` | `./motion` | MAT | exports throw `Error('aura-glass/motion: not yet implemented (seed)')` when called; the module imports nothing from `motion` |
| `src/theme/index.ts`, `src/theme/public.ts` | S-21..S-26 | MAT | `usePreference(key)` returns `SERVER_SNAPSHOT[key]` through `useSyncExternalStore`. `useResolvedPreferences` returns the defaults (`glass`, `standard`, `full`, `light`, `regular`, tier `standard`, `allowContinuous: false`). `AuraGlassProvider` renders children and portals `PORTAL_ROOT_MARKUP` into `document.body`. `usePortalContainer(root)` returns the matching layer-root element or `null`. `useLayer` keeps a module-level stack and calls `onEscape` of the top entry on Escape. `useAnnouncer` writes into the announcer regions, and `clear()` empties them. `AuraGlassScript` renders `<script nonce>` with an empty body. `auraGlassPrepaintScript` is `''`. `GlassPreferencesPanel` renders a `fieldset` of native controls bound to `usePreferenceActions`. `createGlassTheme` and `createBrandTheme` are the kept 4.x files, re-exported |
| `src/foundation/index.ts` | S-31, S-32 | CMP | `defineMeta = (m) => m`. `toChangeDetails(e) => ({ event: e instanceof Event ? e : undefined, reason: 'unknown' })`. `renderElement` clones `render` with merged props, or renders the fallback |
| `src/components/<dir>/index.ts` for every path in `CMP_MODULES` | S-30 | CMP | `createSeedCompound(kebab, parts)` / `createSeedComponent(kebab, tag)` from `src/contracts/seed.tsx`: each part renders a semantic element (`button` for `Trigger`, `Close` and `Item`; `div` otherwise) with `data-ag-part`, `className="ag-<kebab>__<part>"` and `data-ag-seed`. Overlay `Content` renders only while `open`. No behaviour beyond `open` and `value` state. `src/components/toast/index.ts` also exports a seed `useToast` whose methods are no-ops returning `''`/`[]`/`null` |
| `src/primitives/VisuallyHidden.tsx` | S-34 | CMP | the standard visually-hidden span; the other primitives are kept 4.x files |
| `src/internal/index.ts` | S-37 | PLAT | `cn = clsx` (final). `warnDeprecated(id)` warns once per id in development (final, about 10 lines). `deprecations` is the generated table (empty array until generated). `setDeprecationMode(mode: 'warn' \| 'silent')` is an additive export (CP-PLAT-3): MAT's provider calls it for `deprecations="silent"`; until this seam lands the prop is a no-op and warnings stay dev-only |
| `src/root/{cmp,surf,mat}.ts`, `src/compat/<stream>/index.ts` | S-35, S-37 | per row A07, C02/C06/C08/C09 | `export {};` |
| `tests/helpers/index.ts`, `tests/helpers/setup.ts`, `tests/a11y/apg/harness.ts` | S-40 | QUAL | `renderAg` wraps RTL `render` in a `div` carrying the `data-ag-*` environment. `renderAgServer` uses `react-dom/server` then `hydrateRoot`, collecting console warnings. `expectParts` and `expectNoBannedAttributes` are the final implementations. `gotoStory` navigates to `iframe.html?id=<id>&globals=…`. `listSubjects` reads `REPORTS.subjects` from `AG_STORYBOOK_URL`, falling back to `index.json` (subject = component title segment, owner from `contracts/ownership.json` of the story's `importPath`). The `apg` harness implements `keyboard` and `axe` over `@axe-core/playwright`. `perf.blurredSurfaces` and `perf.settledIdle` are final (page-side counts); `perf.frames` uses in-page rAF timestamps; `perf.bci` returns the area-weighted blurred fraction until QUAL lands the archived formula |
| `.storybook/preview.tsx` | S-41, S-42 | QUAL | content in §4.11: globals from S-20/S-42, eager import of `src/**/*.css`, `data-ag-*` environment decorator, `data-ag-cert-ready` after first paint |
| `.storybook/blocks/index.tsx` | S-51 | QUAL | each block renders a plain `<table>` from the meta fields named in §4.9 |
| `scripts/tokens/build.mjs` | S-10, S-11, S-52 | MAT | writes `TOKEN_OUTPUTS` from `PUBLIC_CSS_VARS` and `MOTION_CSS_VARS` with placeholder values (`initial` for colours, `0` for dimensions), each CSS file layered per S-04; idempotent, so the committed generated files never change in non-MAT PRs |
| `scripts/build/api-report.mjs` | S-52 | PLAT | `--entry <entry>` writes `etc/api/<entry>.exports.json` (sorted value exports from the built barrel) and a minimal `.api.md`; final CLI flags |
| `scripts/ci/verify-ownership.mjs`, `scripts/ci/verify-ci-fragments.mjs`, `scripts/ci/gitlab-status.mjs` | S-43, S-53 | PLAT | final logic (§3.1, §4.13.4, §2.3); each about 60 lines |
| `ci/{plat,mat,cmp,surf,qual}.gitlab-ci.yml` | S-53 | each stream | content in §4.13.4 (PLAT's carries the 4.x jobs and the publish/pages jobs; QUAL's carries the lane jobs; the other three carry one hidden template so the file is never empty) |

`src/contracts/seed.tsx` (CONTRACT, about 40 lines) holds `createSeedComponent` and `createSeedCompound` and is excluded from the package build: `tsconfig.build.json` `exclude` contains `src/contracts/seed.tsx`, `src/contracts/testing.ts`, `src/contracts/fragments.ts` and `src/contracts/load-fragments.mjs`. The type modules `material.ts`, `tokens.ts`, `motion.ts`, `preferences.ts`, `components.ts` and `entries.ts` are part of the build, because the public `.d.ts` files re-export their types.

### 4.11 Pre-declared configuration files (C0-4) and lint rules (S-47)

Each file below has one owner, who may change only what the note allows. Everything else needs a contract PR.

**Module format.** The root `package.json` has `"type": "module"` (D-03, set at C0 in §4.12). So every verbatim `.js` config below is ESM. CommonJS is allowed only in files named `*.cjs` (lint rule modules, `contracts/lint-rule-owners.json` readers).

**`eslint.config.js`** (PLAT, verbatim):

```js
/* contract-v1.0 verbatim (ESM). Rules are discovered from lint/rules/<stream>/*.cjs by eslint-plugin-auraglass.js. */
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import auraglass from './eslint-plugin-auraglass.js';
export default [
  { ignores: ['legacy/**', 'dist/**', 'storybook-static/**', 'reports/**', '.artifacts/**', '**/node_modules/**', 'packages/*/dist/**', 'apps/docs/.next/**', 'apps/docs/public/r/**'] },
  { files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { auraglass, 'react-hooks': reactHooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'warn' } },
  ...auraglass.configs.discovered,
];
```

**`eslint-plugin-auraglass.js`** (PLAT, verbatim):

```js
/* contract-v1.0 verbatim (ESM). A rule module is lint/rules/<stream>/<rule-name>.cjs exporting { meta, create, agConfig }.
   agConfig: Array<{ files: string[], ignores?: string[], severity: 'error' | 'warn' }>. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const root = import.meta.dirname; // Node >= 20.11
const RULE_OWNERS = require('./contracts/lint-rule-owners.json'); // { "<rule-name>": "<stream>" } = the table below
const rules = {};
const discovered = [];
for (const stream of ['plat', 'mat', 'cmp', 'surf', 'qual']) {
  const dir = path.join(root, 'lint', 'rules', stream);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.cjs') && !f.startsWith('_')).sort()) {
    const name = path.basename(file, '.cjs');
    if (RULE_OWNERS[name] !== stream) throw new Error(`auraglass/${name}: owner is ${RULE_OWNERS[name] ?? 'unregistered'}, found in ${stream}`);
    const mod = require(path.join(dir, file));
    rules[name] = { meta: mod.meta, create: mod.create };
    for (const c of mod.agConfig ?? []) discovered.push({ files: c.files, ignores: c.ignores ?? [], rules: { [`auraglass/${name}`]: c.severity } });
  }
  const strictFile = path.join(dir, '_strict.cjs'); // { strict: { '<rule-name>': string[] /* globs this stream owns */ } }
  if (fs.existsSync(strictFile)) {
    for (const [name, files] of Object.entries(require(strictFile).strict ?? {})) discovered.push({ files, rules: { [`auraglass/${name}`]: 'error' } });
  }
}
export default { meta: { name: 'eslint-plugin-auraglass' }, rules, configs: { discovered } };
```

**Lint rule owners** (`contracts/lint-rule-owners.json`; all rules are `auraglass/<name>`; was SC-16, re-keyed to the 5 streams):

| Stream | Rules |
|---|---|
| PLAT | `no-random-in-render` (also `Date.now()`/`new Date()` in render), `no-dom-lazy-init`, `use-client-required`, `use-client-needless`, `contract-boundary` (R3: import only §4 module paths across streams), `no-legacy-import` (nothing imports `legacy/**`) |
| MAT | `no-optics-outside-material` (replaces `no-inline-glass`, retired in v1.2, C-15), `no-raw-design-values` (with stylelint), `motion-no-empty-animate`, `motion-raf-via-ticker`, `motion-transition-allowlist`, `motion-no-ungated-loop`, `motion-no-runtime-import`, `motion-no-hover-transform`, `motion-single-preference-source`, `motion-no-random`, `no-document-escape`, `no-runtime-contrast`, `no-outline-none-focus` |
| CMP | `no-forward-ref`, `require-data-ag-part`, `no-overlay-global-listeners`, `prop-grammar` (BANNED_PROPS, `onValueChange`) |
| SURF | `no-network-in-ai`, `no-simulation`, `no-to-locale` (`toLocale*` and `Intl` formatters built without a locale) |
| QUAL | `no-transition-all`, `no-permanent-will-change`, `no-translatez-hack`, `no-global-pointer-listener`, `raf-requires-cancel`, `raf-requires-visibility-gate` |

**Non-blocking rule rollout.** A rule owner may set `severity: 'error'` only for globs that the owner stream itself owns. For every other stream's globs, the rule is `warn` until that stream switches it to `error`. The switch happens by adding the glob to the stream's own rule-config fragment (`lint/rules/<stream>/_strict.cjs`, which exports `{ strict: { '<rule-name>': string[] /* globs this stream owns */ } }`, exactly the shape the plugin loader above reads). At RC-1 all auraglass rules become `error` everywhere (gate G-05). So no stream can turn another stream's CI red.

**`jest.config.js`** (QUAL, verbatim; tests are discovered by location, never registered). ESM, because the root `package.json` has `"type": "module"`; v1.0 used `module.exports`, which fails to load under `"type": "module"`. contract-v1.2 ratifies the #369 edits: the transform goes through `tests/helpers/babel-jest-import-meta.cjs` (babel-jest with the same presets, plus the `import.meta.url`/`import.meta.dirname` rewrite that lets `.mjs` sources run under Jest's CJS loader), `.mjs` is a module extension, and `prettier` is mapped to its ESM entry and transformed, because its CJS entry loads the formatter through a dynamic `import()` that Jest's CJS runtime rejects ("A dynamic import callback was invoked without --experimental-vm-modules"; reproduced with `tests/tokens/determinism.test.ts`):

```js
/* contract-v1.2 verbatim (ESM). Node-environment tests add the docblock  @jest-environment node. */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/tests/**/*.test.{ts,tsx,mjs}', '<rootDir>/registry/**/*.test.{ts,tsx}',
    '<rootDir>/showcase/**/*.test.{ts,tsx}', '<rootDir>/fragments/**/*.test.ts', '<rootDir>/scripts/**/*.test.{ts,mjs}'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/legacy/', '<rootDir>/dist/', '<rootDir>/packages/', '<rootDir>/apps/'],
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.ts'],
  transform: { '^.+\\.(t|j|mj)sx?$': ['<rootDir>/tests/helpers/babel-jest-import-meta.cjs', {}] },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'json'],
  transformIgnorePatterns: ['/node_modules/(?!prettier)'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '^prettier$': '<rootDir>/node_modules/prettier/index.mjs',
    // C-4: the package name resolves to the ENTRIES sources (src/contracts/entries.ts), never to dist/ or node_modules.
    // Subpaths not in ENTRIES (e.g. 'aura-glass/components') stay unresolvable, as in the published package.
    '^aura-glass$': '<rootDir>/src/index.ts',
    '^aura-glass/material$': '<rootDir>/src/material/index.ts',
    '^aura-glass/theme$': '<rootDir>/src/theme/public.ts',
    '^aura-glass/tokens$': '<rootDir>/src/tokens/index.ts',
    '^aura-glass/motion$': '<rootDir>/src/motion/public.ts',
    '^aura-glass/primitives$': '<rootDir>/src/primitives/index.ts',
    '^aura-glass/icons$': '<rootDir>/src/icons/index.ts',
    '^aura-glass/icons/(.+)$': '<rootDir>/src/icons/$1',
    '^aura-glass/forms$': '<rootDir>/src/forms/index.ts',
    '^aura-glass/app-shell$': '<rootDir>/src/app-shell/index.ts',
    '^aura-glass/data$': '<rootDir>/src/data/index.ts',
    '^aura-glass/date$': '<rootDir>/src/date/index.ts',
    '^aura-glass/ai$': '<rootDir>/src/ai/index.ts',
    '^aura-glass/media$': '<rootDir>/src/media/index.ts',
    '^aura-glass/backdrops$': '<rootDir>/src/backdrops/index.ts',
    '^aura-glass/three$': '<rootDir>/src/three/index.ts',
    '^aura-glass/charts$': '<rootDir>/src/charts/index.ts',
    '^aura-glass/compat$': '<rootDir>/src/compat/index.ts',
    '^aura-glass/deprecations\\.json$': '<rootDir>/deprecations.json',
    '^aura-glass/package\\.json$': '<rootDir>/package.json',
  },
};
```

**`playwright.config.ts`** (QUAL, verbatim):

```ts
/* contract-v1.0 verbatim. Browser runs are remote-only (machine policy); this file never raises local workers. */
import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;
const KINDS = ['a11y/apg', 'e2e', 'visual', 'ssr', 'rsc'] as const;
const fragmentProjects = STREAMS.flatMap((s) => {
  const f = `fragments/playwright/${s}.json`;
  return existsSync(f) ? (JSON.parse(readFileSync(f, 'utf8')) as Array<Record<string, unknown>>) : [];
});
const testMatch = STREAMS.flatMap((s) => KINDS.map((k) => `${k}/${s}/**/*.spec.ts`)).concat(['a11y/browser/**/*.spec.ts', 'perf/browser/**/*.spec.ts']);
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['json', { outputFile: `${process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts'}/playwright/results.json` }]],
  use: { baseURL: process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testMatch },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testMatch },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testMatch },
    ...fragmentProjects,
  ],
});
```

**`certification/playwright.cert.config.ts`** (QUAL): QUAL's own content. The contract fixes only one thing: it appends every project from `fragments/playwright/*.json` whose `name` matches `<stream>:cert-*`, in the same way as above.

**`.storybook/main.ts`** (QUAL): the `stories` and `staticDirs` fields are verbatim. The rest (`addons`, `framework`, `viteFinal`) is QUAL's.

```ts
stories: [
  '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)',
  '../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)',
  '../registry/**/*.stories.@(ts|tsx)', '../showcase/**/*.stories.@(ts|tsx)',
  '../certification/scenes/**/*.stories.@(ts|tsx)', '../.storybook/lab/**/*.stories.@(ts|tsx)',
],
staticDirs: [{ from: '../certification/scenes', to: '/scenes' }],
```

**`.storybook/preview.tsx`** (QUAL; C0 seed, referenced by C0-12 and missing from v1.0). The global names and their values are frozen (they are the S-20 preference keys and the S-42 scene ids); everything else is QUAL's to replace:

```tsx
/* @ag-contract-seed: S-41/S-42. Owner QUAL replaces internals; global names and values frozen. */
import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import { SCENES } from '../src/contracts/testing';
import.meta.glob('../src/**/*.css', { eager: true });           // every source sheet is self-layered (§4.3), so order does not matter
const item = (v: readonly string[]) => ({ toolbar: { items: [...v], dynamicTitle: true } });
const preview: Preview = {
  globalTypes: {
    scheme: { defaultValue: 'light', ...item(['light', 'dark']) },
    contrast: { defaultValue: 'standard', ...item(['standard', 'more']) },
    transparency: { defaultValue: 'glass', ...item(['glass', 'tinted', 'solid']) },
    motion: { defaultValue: 'full', ...item(['full', 'calm', 'none']) },
    density: { defaultValue: 'regular', ...item(['compact', 'regular', 'spacious']) },
    tier: { defaultValue: 'standard', ...item(['lightweight', 'standard', 'enhanced']) },
    scene: { defaultValue: 'photo', ...item(SCENES) },
  },
  decorators: [(Story, ctx) => {
    React.useEffect(() => { document.documentElement.setAttribute('data-ag-cert-ready', ''); }, []);
    const g = ctx.globals;
    return <div data-ag-root="" data-ag-scheme={g.scheme} data-ag-contrast={g.contrast} data-ag-transparency={g.transparency}
      data-ag-motion={g.motion} data-ag-density={g.density} data-ag-tier={g.tier} data-ag-story-kind={ctx.parameters.ag?.kind}><Story /></div>;
  }],
};
export default preview;
```

**`.changeset/config.json`** (CONTRACT, verbatim). One changeset per stream PR, file name `.changeset/<stream>-<slug>.md`. PLAT runs `changeset version` on release commits only.

```json
{ "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json", "changelog": "@changesets/cli/changelog", "commit": false,
  "fixed": [], "linked": [["aura-glass", "@auraglass/cli", "@auraglass/registry"]], "access": "public", "baseBranch": "next",
  "updateInternalDependencies": "patch", "ignore": ["@auraglass/qa"], "privatePackages": { "version": false, "tag": false } }
```

On `release/4.x` the same file is used with `"baseBranch": "release/4.x"`.

**`tsconfig.json`** (PLAT): the contract fixes these two fields. Everything else is PLAT's.

```json
"include": ["src", "tests", "fragments", "registry", "showcase", "certification", "stories", ".storybook"],
"exclude": ["legacy", "dist", "node_modules", "packages/*/dist", "apps/docs/.next"]
```

### 4.12 Frozen dependency set and packages (S-36, S-49)

C0 writes these sets into the root `package.json` and regenerates `package-lock.json`. Versions are exact. Each version was checked as the npm registry version on 2026-10-06, and the major line was chosen to match the architecture. A change to any row is a contract PR, and PLAT updates the lockfile in that same PR. `docs/dependency-allowlist.json` is generated from the first two tables (its `importers` column enforces D-25 and §3.4).

**Runtime `dependencies` of `aura-glass` 5.0 (on `next`):**

| Package | Version | Allowed importers (`docs/dependency-allowlist.json`) | Owner of the usage |
|---|---|---|---|
| `@base-ui/react` | `1.8.0` (exact, D-13) | `src/components/**`, `src/foundation/**`, `src/app-shell/**`, `src/data/**`, `src/ai/**`, `src/media/**`, `src/date/**` | CMP (the pattern); SURF |
| `clsx` | `2.1.1` | `src/internal/cn.ts` only | PLAT |
| `@tanstack/react-table` | `8.21.3` (v8 depends only on `table-core`; v9.2.6 adds `@tanstack/react-store`, so it stays out until a contract PR) | `src/data/**` | SURF |
| `@tanstack/react-virtual` | `3.14.13` | `src/data/**`, `src/ai/**`; `src/components/combobox/**` only if OD-15 approves C-11 (CC-CMP-06), otherwise Combobox keeps an owned windowed list and the allowlist row is removed | SURF; CMP for Combobox |

**`peerDependencies` (with `peerDependenciesMeta.optional` where marked):**

| Package | Range | Optional | Allowed importers |
|---|---|---|---|
| `react`, `react-dom` | `^19.0.0` (D-02) | no | all |
| `react-aria-components` | `^1.21.1` | yes | `src/date/**`, `src/data/tree-view/**` |
| `@internationalized/date` | `^3.12.4` | yes | `src/date/**` |
| `motion` | `^12.0.0` (D-25; latest 12.x is 12.43.0. npm `latest` is 14.0.0, and widening the range is an open contract item, CC-01) | yes | `src/motion/public.ts` and files under `src/motion/adapter/**` only |
| `react-hook-form` | `^7.0.0` | yes | `src/forms/**` |
| `three` | `>=0.170.0` | yes, 5.1 only (C-6: `./three` exports nothing at 5.0, so the peer is removed until the 5.1 contract PR) | `src/three/**` |
| `@react-three/fiber` | `^9.0.0` (8.x is React 18 only, and the peer floor is React 19) | yes, 5.1 only (C-6) | `src/three/**` |
| `@react-three/drei` | `^10.0.0` | yes, 5.1 only (C-6) | `src/three/**` |
| `tailwindcss` | `^4.0.0` | yes | none (CSS bridge only) |
| `d3-scale`, `d3-shape` | `^4.0.2`, `^3.2.0` | yes, 5.1 only (added by contract PR at 5.1) | `src/charts/**` |

**`devDependencies` (exact):**

| Group | Packages |
|---|---|
| Build | `typescript@5.9.3` (matches `@microsoft/api-extractor@7.59.4`'s bundled compiler; TS 7.0.2 is npm `latest` but is not adopted, CC-02), `tsdown@0.23.0`, `esbuild@0.28.2`, `@microsoft/api-extractor@7.59.4`, `publint@0.3.25`, `@arethetypeswrong/cli@0.18.5`, `@changesets/cli@3.0.3`, `picomatch@4.0.7`, `yaml` (latest 2.x at C0; parses CI fragments in `verify-ci-fragments.mjs`) |
| Tokens | `style-dictionary@4.4.0` (architecture §5.1 names Style Dictionary 4; 5.6.0 is `latest`, CC-03) |
| Lint | `eslint@9.39.5` (ESLint 9 per §9.2; 10.x is `latest`, CC-04), `@typescript-eslint/parser@8.71.1`, `eslint-plugin-react-hooks@7.1.1`, `stylelint@17.16.0` |
| Unit tests | `jest@30.5.2`, `jest-environment-jsdom@30.5.2`, `babel-jest@30.5.2`, `@babel/core`, `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript` (latest 7.x at C0), `@testing-library/react@16.3.3`, `@testing-library/jest-dom@7.0.1`, `jest-axe@11.0.0`, `identity-obj-proxy@3.0.0` |
| Browser and visual | `@playwright/test@1.63.0`, `@axe-core/playwright@4.13.0`, `pixelmatch@8.0.0` |
| Storybook | `storybook@9.1.20`, `@storybook/react-vite@9.1.20`, `@storybook/addon-a11y@9.1.20`, `@storybook/addon-docs@9.1.20` (the versions at C0; 10.x is CC-05), `vite` (version at C0) |
| React | `react@19.3.0`, `react-dom@19.3.0`, `@types/react@19.3.0`, `@types/react-dom@19.3.0`, `@types/node@26.6.4`, `babel-plugin-react-compiler@1.0.0` |
| Peers for tests | each optional peer at its latest version within the declared range |
| AI SDK (fixtures and adapter types only, never imported by `src/**`) | `ai@5.0.29`, `@ai-sdk/react@2.0.29`, `@ai-sdk/openai-compatible@1.0.29` (contract PR #48). C-12 (optional, v1.2): `ai@6.0.303`, `@ai-sdk/react@3.0.306`, `@ai-sdk/openai-compatible@2.0.81`, the first major whose `UIMessage` tool parts carry `approval-requested`/`approval-responded`/`output-denied`; if rejected, stay on 5.0.29 and drop the approval states from the fixtures |

Every other 4.1.0 runtime dependency is removed on `next` at C0: express, express-rate-limit, helmet, cors, compression, socket.io (+client), ioredis, redis, jsonwebtoken, bcryptjs, dotenv, openai, @pinecone-database/pinecone, @google-cloud/vision, @sentry/node, chart.js, react-chartjs-2, date-fns, zod, tailwind-merge, framer-motion. Only `legacy/**` imports them, and legacy is outside the build. On `release/4.x` they follow PLAT's 4.2 dependency diet instead.

**Packages and workspaces** (was SC-13). `workspaces: ["packages/*", "apps/*"]`:

| Package | Directory | Owner | Published |
|---|---|---|---|
| `aura-glass` | repo root | PLAT (manifest), all (content) | yes, no `bin` (D-22) |
| `@auraglass/cli` | `packages/cli` | PLAT | yes |
| `@auraglass/registry` | `packages/registry` | PLAT | yes (data) |
| `@auraglass/mcp` | `packages/mcp` | PLAT | yes (not a GA blocker) |
| `@auraglass/labs` | `packages/labs` | SURF | yes, 0.x |
| `@auraglass/qa` | `packages/qa` | QUAL | never (private) |
| docs app | `apps/docs` | PLAT | deployed, not published |

The D-23 unscoped fallback (`aura-glass-cli` and so on) is decided by PLAT once, before 4.2, and recorded in `docs/release/decisions/`. Package names are the only thing other streams consume, and both spellings live in the same `contracts/packages.json` (C0-7), so the decision does not affect any other stream's work.

**Frozen root `package.json` script names (S-52).** CI fragments call only these names, so no fragment depends on another stream's file layout. PLAT owns `package.json`; the command bodies below are fixed at C0 and the named implementation file belongs to the listed owner (seeded at C0-13 where it is another stream's):

| Script | Command at C0 | Implementation owner |
|---|---|---|
| `tokens:build` | `node scripts/tokens/build.mjs` | MAT |
| `build` | `npm run tokens:build && tsdown` | PLAT (tsdown config), MAT (tokens) |
| `api:update` | `node scripts/build/api-report.mjs` | PLAT |
| `pack:verify` | `node scripts/ci/verify-pack.js` | PLAT |
| `storybook:build` | `storybook build -o storybook-static` | QUAL |
| `docs:build` | `npm run build -w apps/docs` (static export to `apps/docs/out/`) | PLAT |
| `test` | `node --experimental-vm-modules node_modules/jest/bin/jest.js` (needed for `.mjs` tests under `"type": "module"`) | QUAL (config) |
| `test:contract` | `npm test -- tests/contract` | QUAL |
| `lint` | `eslint . && stylelint "src/**/*.css"` | PLAT, MAT |
| `typecheck` | `tsc -p tsconfig.json --noEmit` | PLAT |

Because `package.json` is PLAT's, no other stream adds scripts to it. Stream-specific commands live in the stream's CI fragment or under `scripts/<stream>/` and are invoked as `node scripts/<stream>/<file>.mjs`.

### 4.13 CI/CD on GitLab (S-53, S-54)

#### 4.13.1 Hosting model

- **Git source of truth:** `github.com/auraoneai/auraglass`. All branches, tags, PRs, reviews, CODEOWNERS and labels live there.
- **CI/CD:** GitLab CI in `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project id 87152036, verified in the mirror fleet state file 2026-10-06). Nobody pushes to, commits in or opens MRs against the mirror (machine policy). Pipelines therefore run on **mirrored branch and tag updates**, on schedules and on manual or API runs. `merge_request_event` pipelines never exist.
- **Sync** is the org-managed `mirror-to-gitlab` GitHub workflow, out of scope for every PRD. As verified on 2026-10-06 it fires on pushes to `main`, on every tag push, daily at 05:23 UTC and on manual dispatch, and force-pushes all refs. So tags (publishing) reach GitLab within minutes, but pushes to `next`, `release/4.x` and stream branches reach GitLab only at the next `main` push or the daily reconcile. This latency is residual wait W-6 (§7.3); OD-8 (§7.4) removes it and also removes the last GitHub Action.
- **Runners:** GitLab-hosted SaaS runners for everything (`saas-linux-small-amd64`, `saas-linux-medium-amd64`, `saas-linux-large-amd64`; GPU lanes `saas-linux-medium-amd64-gpu-standard`). These are remote, so the machine policy's remote-first rule is met by default. Real-device and macOS/iOS Safari lanes, which GitLab SaaS Linux runners cannot provide, use the gated AWS remote runner as a fallback through runner tag `auraglass-aws-remote` (OD-11); until that runner is registered those jobs are `when: manual` and `allow_failure: true`, and the lane reports `pending`.
- **Evidence:** job artifacts with `expire_in` (S-48), never committed. **Deploys:** GitLab Pages. **Publishing:** npm trusted publishing from a GitLab tag pipeline (§4.13.7).
- **No GitHub credential in GitLab.** No job reads PR labels or posts to GitHub. Anything the archived plan read from GitHub at CI time (PR labels in change-class, `gh run`, `gh api`, `GITHUB_WORKFLOW_REF`, `GITHUB_SHA`, `GITHUB_REF`, `GITHUB_EVENT_NAME`) comes from git and GitLab predefined variables instead: change class reads commit markers and the `.changeset/*.md` bump types of the diff, never labels.

| Archived GitHub reference | GitLab replacement |
|---|---|
| `.github/workflows/*.yml` | `.gitlab-ci.yml` + `ci/<stream>.gitlab-ci.yml` |
| `on: pull_request` | branch pipeline on the mirrored PR branch (`$AG_SCOPE == "pr"`) |
| `on: push` to `main`/`next`/`release/4.x` | `$AG_SCOPE == "main"` |
| `on: schedule` | GitLab pipeline schedule (`$AG_SCOPE == "nightly"`) |
| `on: push: tags` / `workflow_dispatch` publish | tag pipeline (`$CI_COMMIT_TAG`, `$AG_SCOPE == "release"`) |
| `GITHUB_SHA`, `GITHUB_REF_NAME`, `GITHUB_EVENT_NAME` | `CI_COMMIT_SHA`, `CI_COMMIT_REF_NAME` / `CI_COMMIT_BRANCH` / `CI_COMMIT_TAG`, `CI_PIPELINE_SOURCE` |
| `GITHUB_WORKFLOW_REF` (npm provenance identity) | the GitLab OIDC claims `ci_config_ref_uri` / `project_path` in `NPM_ID_TOKEN` (§4.13.7) |
| `actions/upload-artifact`, `${{ github.sha }}` | `artifacts:` with `name: evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA`, `expire_in` |
| `needs:` / reusable `workflow_call` (`certify-release.yml`) | job `needs:` with `optional: true` across fragments; no reusable workflows |
| `actions/deploy-pages`, `gh-pages` branch | `pages` job, `public/` artifact |
| `gh run list/watch`, `gh api` | `glab ci status`, `glab ci view`, or the public API `GET /projects/87152036/pipelines?sha=` (`scripts/ci/gitlab-status.mjs`) |
| `CI_JOB_JWT` (removed in GitLab 17) | `id_tokens:` only |

#### 4.13.2 Pipeline vocabulary (frozen)

- **Stages**, in order: `contract`, `build`, `test`, `package`, `certify`, `deploy`, `publish` (`STAGES`, §4.9). contract-v1.2 ratifies `package` before `certify`: the `qual:certify:*` lanes need `plat:package:pack` in an earlier stage.
- **Variables set by `workflow:rules`** and available to every job's `rules`: `AG_SCOPE` ∈ `pr | main | nightly | release`, `AG_LINE` ∈ `4x | 5x`.
- **Job names:** `<stream>:<stage>:<name>` (for example `mat:build:tokens`, `surf:test:ledger`, `qual:certify:l6`). Root jobs are `contract:<name>`. The one exception is `pages` (PLAT), because GitLab Pages deploys the job of that name.
- **Hidden templates:** the root defines `.ag-node`, `.ag-playwright`, `.ag-gpu`, `.ag-aws-remote` and `.ag-evidence-release`; a fragment's own templates are named `.<stream>-<name>`.
- **Artifacts:** a job writes evidence only under `.artifacts/<stream>/<job-slug>/` and its build outputs only at the fixed paths below, so `needs` from several jobs merge without collisions.

| Producer job | Artifact path | Consumers (always `optional: true`) |
|---|---|---|
| `mat:build:tokens` | `dist/tokens/`, `dist/tokens.css`, `dist/compat/tokens.css` | `plat:build:dist` (otherwise it runs `npm run tokens:build` itself) |
| `plat:build:dist` | `dist/` | lanes, `plat:package:pack` |
| `plat:package:pack` | `.artifacts/pack/*.tgz` + dotenv report `.artifacts/plat/pack.env` (`AURAGLASS_TARBALL=…`) | L2, L3, L11, `plat:publish:npm` |
| `qual:build:storybook` | `storybook-static/` (with `cert-manifest.json`, S-55 `SubjectIndex`) | browser lanes, `pages` |
| `qual:certify:l7` | `.artifacts/qual/visual-class.json` (S-55) | `plat:gate:change-class` |
| `qual:certify:l10` | `.artifacts/qual/perf-report.json` (S-55) | PLAT docs-claims |
| `qual:certify:release` | `.artifacts/qual/release-verdict.json` (S-55) | `plat:publish:npm` |
| `plat:build:docs` | `apps/docs/out/` | `pages` |
| `mat:build:bridge` (4x line only, C-8) | `src/material/`, `src/styles/v5.css`, `src/styles/preview-v5.css`, `dist/tokens/4x/` | `plat:build:dist` on `release/4.x` |

C-8 (v1.2): `mat:build:bridge` runs `node scripts/tokens/build.mjs --platform bridge-4x` on `release/4.x` and its `4x-*`/`4x11-*` heads only. Inside `src/material/` it writes exactly `src/material/css/{ladders,floors,properties,preview-v5}.css` and `src/material/compat/tokens.css`; it is the only writer of those files, the two `src/styles/` files and `dist/tokens/4x/`, and the drift check is `git diff --exit-code src/material src/styles/v5.css src/styles/preview-v5.css` after the build. Evidence (logs, reports) still goes under `.artifacts/mat/<job-slug>/`. If OD-16 rejects C-8, the job writes all of these under `.artifacts/mat/bridge/` instead and the drift check compares that tree.

- **Environments:** `npm-publish` (tier `production`; the job `plat:publish:npm`), `pages` (tier `production`; the job `pages`, `url: $CI_PAGES_URL`). No other environment is created by these PRDs.

#### 4.13.3 Root `.gitlab-ci.yml` (PLAT, verbatim)

```yaml
# contract-v1.2 verbatim (PLAT-owned). PLAT may change only the values of AG_NODE_IMAGE, AG_PLAYWRIGHT_IMAGE, AG_NPM_VERSION,
# AG_PAGES_BRANCH and AG_V4_DIST_TAG. GitHub (github.com/auraoneai/auraglass) is the source of truth; this project is its
# one-way mirror, so there are no merge-request pipelines.
stages: [contract, build, test, package, certify, deploy, publish]

variables:
  AG_NODE_IMAGE: "node:22-bookworm@sha256:0e5f906573693feaa1e21057ebdcfdb5bd5021f050b2dc7c9deceb629c7da2a8"  # PLAT pins a digest at C0
  AG_PLAYWRIGHT_IMAGE: "mcr.microsoft.com/playwright:v1.63.0-noble" # must equal the @playwright/test pin (§4.12)
  AG_NPM_VERSION: "11.21.0"                                       # >= 11.5.1 for trusted publishing; PLAT pins exact at C0
  AG_PAGES_BRANCH: "release/4.x"                                    # becomes "main" at 5.0 GA
  AG_V4_DIST_TAG: "latest"                                          # becomes "v4-lts" at 5.0 GA
  AURAGLASS_EVIDENCE_DIR: ".artifacts"

workflow:
  name: "$AG_SCOPE/$AG_LINE $CI_COMMIT_REF_NAME"
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      when: never
    - if: $CI_COMMIT_TAG =~ /^v4\.\d+\.\d+(-[0-9A-Za-z.]+)?$/
      variables: { AG_SCOPE: release, AG_LINE: "4x" }
    - if: $CI_COMMIT_TAG =~ /^v5\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/
      variables: { AG_SCOPE: release, AG_LINE: "5x" }
    - if: $CI_COMMIT_TAG
      when: never
    - if: $CI_PIPELINE_SOURCE == "schedule" && $CI_COMMIT_BRANCH == "release/4.x"
      variables: { AG_SCOPE: nightly, AG_LINE: "4x" }
    - if: $CI_PIPELINE_SOURCE == "schedule"
      variables: { AG_SCOPE: nightly, AG_LINE: "5x" }
    - if: $CI_COMMIT_BRANCH == "release/4.x" || $CI_COMMIT_BRANCH == "release/4.1.x"
      variables: { AG_SCOPE: main, AG_LINE: "4x" }
    - if: $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_BRANCH == "next"
      variables: { AG_SCOPE: main, AG_LINE: "5x" }
    - if: $CI_COMMIT_BRANCH =~ /^4x-(plat|mat|cmp|surf|qual|fin)\// || $CI_COMMIT_BRANCH =~ /^4x11-(plat|mat|cmp|surf|qual|fin)\// || $CI_COMMIT_BRANCH =~ /^sync\/fragments-codemods-/
      variables: { AG_SCOPE: pr, AG_LINE: "4x" }
    - if: $CI_COMMIT_BRANCH =~ /^next-(plat|mat|cmp|surf|qual|fin)\// || $CI_COMMIT_BRANCH =~ /^sync\/fragments-deprecations-/ || $CI_COMMIT_BRANCH =~ /^contract\// || $CI_COMMIT_BRANCH =~ /^sync\//
      variables: { AG_SCOPE: pr, AG_LINE: "5x" }
    - when: never

include:
  - local: "ci/*.gitlab-ci.yml"          # one fragment per stream (row A20); wildcard, so no edit here when a stream adds jobs

.ag-node:
  image: $AG_NODE_IMAGE
  tags: [saas-linux-medium-amd64]
  interruptible: true
  cache:
    key: { files: [package-lock.json] }
    paths: [.npm/]
  before_script:
    - npm ci --cache .npm --prefer-offline --no-audit --no-fund
  artifacts:
    name: "evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA"
    when: always
    expire_in: 14 days
    paths: [.artifacts/]

.ag-playwright:
  extends: .ag-node
  image: $AG_PLAYWRIGHT_IMAGE
  tags: [saas-linux-large-amd64]
  variables: { AG_REMOTE_RUNNER: "1" }

.ag-gpu:
  extends: .ag-playwright
  tags: [saas-linux-medium-amd64-gpu-standard]

.ag-aws-remote:                           # gated AWS remote runner (OD-11); manual until registered
  extends: .ag-playwright
  tags: [auraglass-aws-remote]
  when: manual
  allow_failure: true

.ag-evidence-release:
  artifacts:
    name: "evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA"
    when: always
    expire_in: 90 days
    paths: [.artifacts/]

contract:ownership:
  extends: .ag-node
  stage: contract
  variables: { GIT_DEPTH: "0" }
  rules:
    - if: $AG_SCOPE == "pr"
  script:
    - BASE=$([ "$AG_LINE" = "4x" ] && echo release/4.x || echo next)
    - git fetch --no-tags origin "+refs/heads/$BASE:refs/remotes/origin/$BASE"
    - node scripts/ci/verify-ownership.mjs --base "origin/$BASE" --branch "$CI_COMMIT_BRANCH"

contract:conformance:
  extends: .ag-node
  stage: contract
  rules:
    - if: $AG_LINE == "5x"
  script:
    - npm run test:contract

contract:ci-fragments:
  extends: .ag-node
  stage: contract
  variables: { GIT_DEPTH: "0" }
  rules:
    - if: $AG_SCOPE == "pr" || $AG_SCOPE == "main"
  script:
    - BASE=$([ "$AG_LINE" = "4x" ] && echo release/4.x || echo next)
    - git fetch --no-tags origin "+refs/heads/$BASE:refs/remotes/origin/$BASE"
    - node scripts/ci/verify-ci-fragments.mjs --base "origin/$BASE"   # C-9 (v1.2): the task-graph hook gets the line base
```

#### 4.13.4 Stream fragments `ci/<stream>.gitlab-ci.yml` (the CI ownership seam)

Rules, enforced by `contract:ci-fragments` (`scripts/ci/verify-ci-fragments.mjs`, PLAT):

1. A fragment contains only jobs named `<stream>:<stage>:<name>` for its own stream (PLAT may also define `pages`) and hidden templates `.<stream>-<name>`. It never defines `stages`, `workflow`, `default`, `include`, top-level `variables` or top-level `image`; only the root does.
2. `stage` is one of `STAGES`. Every job `extends` one of the root templates (`.ag-node`, `.ag-playwright`, `.ag-gpu`, `.ag-aws-remote`), directly or through the stream's own template.
3. Every job has `rules` that test `$AG_SCOPE` (and `$AG_LINE` when the job applies to one line only). No job runs on `merge_request_event`.
4. **`needs` across streams** may name only jobs listed in `CI_JOBS` (§4.9) and must set `optional: true`, so a job never fails pipeline creation because another stream's job does not exist yet. Within its own fragment a stream uses `needs` freely. `dependencies:` across streams is forbidden.
5. A job writes evidence only under `.artifacts/<stream>/`, and produces only the fixed artifact paths of §4.13.2 when it is a listed producer.
6. A new job starts `allow_failure: true`. The owning stream flips it to `false` after its first green run on `next` (§2.3). The jobs in `REQUIRED_JOBS` may never be `allow_failure: true` once flipped.
7. Lanes are QUAL's: a stream does not add per-lane jobs. It registers its specs and gates through F `lanes`, and QUAL's `qual:certify:l<n>` jobs discover them. A stream's own build or private tool jobs (for example `mat:build:tokens`, `surf:test:ledger`) live in its fragment.
8. No job holds or reads a GitHub, npm or cloud credential, except `plat:publish:npm`, which uses only the OIDC `id_tokens` of §4.13.7, and the `.ag-aws-remote` jobs, which use only the registered runner's own instance role.
9. Heavy, browser and perf jobs use `.ag-playwright`, `.ag-gpu` or `.ag-aws-remote`; nothing in CI raises worker counts beyond the runner's CPU count.

Seed content at C0:

```yaml
# ci/mat.gitlab-ci.yml (MAT). cmp and surf seeds are the same with their own key and no job.
.mat-base:
  extends: .ag-node
mat:build:tokens:
  extends: .mat-base
  stage: build
  allow_failure: true
  rules:
    - if: $AG_LINE == "5x" && $AG_SCOPE != "release"
  script:
    - npm run tokens:build
  artifacts:
    name: "evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA"
    expire_in: 14 days
    paths: [dist/tokens/, dist/tokens.css, dist/compat/tokens.css, .artifacts/]
```

```yaml
# ci/qual.gitlab-ci.yml (QUAL), seed: Storybook build and the lane matrix. Real lanes report pending until registered.
.qual-lane:
  extends: .ag-playwright
  stage: certify
  allow_failure: true
  needs:
    - { job: "qual:build:storybook", artifacts: true, optional: true }
    - { job: "plat:package:pack", artifacts: true, optional: true }
  rules:
    - if: $AG_LINE == "5x" && ($AG_SCOPE == "pr" || $AG_SCOPE == "main")
  script:
    - node certification/run.mjs --lane "$LANE" --scope "$AG_SCOPE"
qual:build:storybook:
  extends: .ag-node
  stage: build
  allow_failure: true
  rules:
    - if: $AG_LINE == "5x"
  script:
    - npm run storybook:build
  artifacts:
    name: "storybook-$CI_COMMIT_SHORT_SHA"
    expire_in: 14 days
    paths: [storybook-static/]
qual:certify:l1:  { extends: .qual-lane, variables: { LANE: L1 } }
# ... one job per lane L1..L12, named exactly as CERT_JOBS ...
qual:certify:nightly:
  extends: .qual-lane
  rules: [{ if: $AG_SCOPE == "nightly" }]
  script: [node certification/run.mjs --lane all --scope nightly]
qual:certify:release:
  extends: [.qual-lane, .ag-evidence-release]
  rules: [{ if: $AG_SCOPE == "release" && $AG_LINE == "5x" }]
  script: [node certification/run.mjs --lane all --scope release --verdict .artifacts/qual/release-verdict.json]
```

PLAT's seed carries `plat:build:dist`, `plat:package:pack` (dotenv `AURAGLASS_TARBALL`), `plat:gate:glass-quality`, `plat:gate:change-class`, `plat:integration:next`, `plat:integration:vite`, `plat:build:docs`, `plat:publish:npm` and `pages`, with `rules` on `$AG_LINE` so that the 4.x line runs the 4.1.0 scripts (`npm run test:integration:next`, `npm run test:integration:vite`, the existing glass quality gate commands) and the 5x line runs the 5.0 ones.

#### 4.13.5 Lines and scopes

| Pipeline | Trigger | `AG_SCOPE` / `AG_LINE` | Runs |
|---|---|---|---|
| stream PR branch | mirrored push of `next-<stream>/*`, `contract/*`, `sync/fragments-deprecations-*` | `pr` / `5x` | `contract:*`, PR-scope lanes, stream jobs |
| 4.x PR branch | mirrored push of `4x-<stream>/*`, `sync/fragments-codemods-*` | `pr` / `4x` | `contract:ownership`, `contract:ci-fragments`, PLAT 4.x gates, L2/L3/L11 on the 4.x tarball |
| line | mirrored push of `next`, `main`, `release/4.x` | `main` / `5x` or `4x` | every main-scope job; `pages` when `$CI_COMMIT_BRANCH == $AG_PAGES_BRANCH` |
| nightly | GitLab schedules on `next` and `release/4.x` (OD-11) | `nightly` | full §15.1 matrix, GA dashboard |
| tag | mirrored tag `v4.*` or `v5.*` | `release` | pack, `qual:certify:release` (5x), `plat:publish:npm` |

#### 4.13.6 GitLab Pages

One `pages` job (PLAT, in `ci/plat.gitlab-ci.yml`) runs on `$AG_PAGES_BRANCH` and assembles `public/` with `node scripts/ci/assemble-pages.mjs`: `public/` ← `apps/docs/out/` (docs site; on the 4.x line the 4.x docs), `public/storybook/` ← `storybook-static/` (Storybook, including the Material Lab under `?path=/story/lab-*`), and `public/lab/index.html` redirecting to the Lab. Inputs come through `needs` with `optional: true`; a missing input keeps the previous section's placeholder page, so the job never waits for another stream. The site URL is `$CI_PAGES_URL` (for this subgroup project, `https://chahal-foundation-group.gitlab.io/github-auraoneai/auraglass/`), and Pages visibility must be public (OD-11). `next` previews are not deployed to Pages; they are browsable as the `storybook-static/` artifact of `qual:build:storybook` (GitLab artifact browser).

#### 4.13.7 npm publishing from GitLab (S-54)

- **Trigger:** a tag pipeline only (`$AG_SCOPE == "release"`). Tags are cut on GitHub by PLAT (`v4.x.y` on `release/4.x`, `v5.0.0-alpha.N` … on `next`, `v5.x.y` on `main`) and reach GitLab through the mirror within minutes. On GitLab, tags matching `v*` are protected so only the mirror's own token can create them (OD-11).
- **Identity:** npm trusted publishing with GitLab OIDC. Each published package (`aura-glass`, `@auraglass/cli`, `@auraglass/registry`, `@auraglass/mcp`, `@auraglass/labs`) has a trusted publisher on npmjs.com with provider **GitLab CI/CD**, namespace `chahal-foundation-group/github-auraoneai`, project `auraglass`, top-level CI file `.gitlab-ci.yml` and environment `npm-publish`. The job runs on a GitLab-hosted SaaS runner, which trusted publishing requires. No `NPM_TOKEN` exists anywhere.
- **Job contract** (`plat:publish:npm`, PLAT):

```yaml
plat:publish:npm:
  extends: [.ag-node, .ag-evidence-release]
  stage: publish
  tags: [saas-linux-small-amd64]
  environment: { name: npm-publish, deployment_tier: production }
  rules:
    - if: $AG_SCOPE == "release"
  needs:
    - { job: "plat:package:pack", artifacts: true }
    - { job: "qual:certify:release", artifacts: true, optional: true }
  id_tokens:
    NPM_ID_TOKEN:      { aud: "npm:registry.npmjs.org" }   # npm CLI exchanges it for a short-lived publish token
    SIGSTORE_ID_TOKEN: { aud: "sigstore" }                 # provenance signing
  script:
    - npm install -g "npm@$AG_NPM_VERSION"
    - node scripts/release/verify-release-verdict.mjs --tag "$CI_COMMIT_TAG" --line "$AG_LINE"
    - node scripts/release/publish.mjs --tag "$CI_COMMIT_TAG" --line "$AG_LINE" --v4-dist-tag "$AG_V4_DIST_TAG"
```

- `verify-release-verdict.mjs` (PLAT) reads `ReleaseVerdict` (S-55). For a 5.x GA tag it fails unless the file exists and `ga === true` (gate §6.2). For pre-release tags and 4.x tags the verdict is advisory and a missing file is reported, not fatal. PLAT codes against the type and a double in `tests/contract-doubles/reports/`, never against QUAL's job.
- `publish.mjs` (PLAT) publishes the verified tarballs from `.artifacts/pack/` with `npm publish <tgz> --provenance --access public --tag <dist-tag>`, skipping any package version already on the registry. Dist-tags: `v4.*` → `$AG_V4_DIST_TAG` (`latest` until 5.0 GA, then `v4-lts`); `v5.*-alpha|beta|rc.*` → `next`; `v5.x.y` → `latest`.
- The archived `publish-npm.yml` checks (classify-change re-run, integration smoke) become earlier jobs in the same tag pipeline that `plat:publish:npm` needs within PLAT's own fragment.
- **External prerequisites** (outside the agent perimeter, recorded as G-15 and OD-10): switching each package's npm trusted publisher from the GitHub `publish-npm.yml` workflow to the GitLab entry above, before 4.1.1 is published; and the first publish of a scoped package that does not exist yet on npm (trusted publishing can only be configured on an existing package).

---

## 5. Contract stubs and fakes: testing before other streams land

### 5.1 What each stream tests against on day 0

| Stream | Needs from others | Tests against, before the real code merges | Switches to the real code |
|---|---|---|---|
| MAT | CMP primitives (provider uses `Portal`); QUAL helpers | the kept 4.x `Portal` (keep list) and the S-40 seed helpers | automatically, because the import paths do not change |
| CMP | `materialProps`, `Surface`, CSS vars and layers, preferences, portal container, LayerStack, announcer, motion runtime, test helpers | seeds (§4.10), plus **`contracts/stubs/reference.css`** for visual and computed-style tests. This stylesheet implements S-01..S-04 minimally: `.ag-surface` gets a background from `--ag-surface-fill` and the rim and shadow vars, and each `[data-ag-*]` axis maps to fixed test colours, under the full layer statement. CMP's Playwright and visual specs load it via `gotoStory(..., { stub: 'reference' })` until MAT's `material.css` is present, which the seed `gotoStory` detects by file existence | when `src/material/css/material.css` exists, the helper stops injecting the stub |
| SURF | CMP components (S-30), MAT seams, test helpers | CMP seeds give structure (parts, open/value state). For behaviour, SURF uses **`tests/contract-doubles/cmp/*.tsx`**: CONTRACT-owned doubles that implement the S-30 contracts directly on `@base-ui/react` (Dialog, Popover, Menu, Tooltip, Select, Combobox, Slider, Toolbar, Collapsible, ScrollArea), about 15 lines each. SURF's own tests map CMP module paths to these doubles through the Jest `moduleNameMapper` in a SURF-owned `tests/<area>/jest.doubles.cjs` preset, never through the root config | the double mapping is deleted by SURF when the CMP component's conformance test passes (§6.3). The doubles stay for QUAL's double-vs-real comparison |
| PLAT | every stream's fragments, metas, registry items, entries; MAT's built token outputs; QUAL's report artifacts | `loadFragments` over whatever exists; fixtures in `tests/contract-doubles/fragments/` (one valid fragment of every kind) for generator and engine tests; `tests/contract-doubles/tokens/manifest.json` (a valid `TokenManifest`) for the registry base, Tailwind bridge and compat CSS generators; `tests/contract-doubles/reports/{visual-class,perf-report,release-verdict}.json` (valid S-55 reports) for change class, docs claims and publish; the `ENTRIES` list for the exports manifest; seeds for building the tarball | continuously: generators read real fragments as they land; real builds call `npm run tokens:build` (seeded, S-52) and real report artifacts through `optional: true` needs |
| QUAL | stories with `parameters.ag`, metas, lane registrations, every runtime | lanes run on whatever has merged, including **4.x code today**: L2, L3 and L11 run against the `release/4.x` tarball from day 0. L6 and L7 run against seed-rendered and stub-styled stories (marked `pending`, never `pass`). The perf harness self-tests on a blank page and the 4.1 baseline | each lane's subject list grows as metas and stories merge, with no edit to `certification/` (AC-QA-02 carried over) |

### 5.2 Rules for stubs and doubles

1. Stubs and doubles live only in `contracts/stubs/**` and `tests/contract-doubles/**` (CONTRACT-owned), or in a consumer's own test-only preset. They are never imported from `src/**` production modules. Lint rule `contract-boundary` fails on such an import.
2. A seed is not a stub, but it is equally banned at GA: no `@ag-contract-seed` marker in `src/`, and no `data-ag-seed` in `dist/` (G-02).
3. `npm pack` contents are checked by PLAT's L2 artifact gate. The tarball must not contain `contracts/`, `tests/`, `fragments/`, `src/contracts/seed.tsx` or any file containing `@ag-contract-seed`. This check is active from C0, so no pre-release can ship a stub either. PLAT's pre-release build filters `ENTRIES` to the entries whose source import graph contains no seed marker, and L2 then verifies the tarball. Owners add a name to their `src/root/<stream>.ts` barrel only once that component is real, so the root entry is publishable from the first real component onward.
4. A test that passes only against a double is recorded as `double-pass` in the lane report. It never counts towards certification.
5. Doubles change only in a contract PR. If a CMP contract changes, the double changes in the same PR.

### 5.3 Showcases and blocks before their inputs land

QUAL's `showcase/<id>/` files import the SURF-owned block sources in `registry/blocks/<id>/` (§3.3). While a block directory is empty, the showcase renders QUAL's `ShowcasePending` frame, with the scene background and a "block pending" label. That story carries the tag `no-cert`, which L6 and L7 skip. This is visible in Storybook, and it is never a pass. It cannot reach `dist/`, because showcases are not in the package.

---

## 6. Integration and the GA gate

### 6.1 Continuous integration on `next`

- Every pipeline on `next` (a mirrored push of `next`, `AG_SCOPE=main`) runs every lane at `main` scope, against the merged tree and its packed tarball. Lane results are per subject, keyed by `ComponentMeta.name` or the story `subject`.
- **States.** Each lane reports one of `pass`, `fail`, `pending` (the subject or seam is still a seed or stub, or is not merged), `double-pass` (passes only against a double) or `pre-existing` (the failure is in paths not owned by the PR's stream). Only `fail` on the PR stream's own paths blocks that PR.
- **Nightly** runs (remote) cover the full §15.1 environment matrix on whatever is merged, and publish the GA dashboard: a count per GA-checklist item, per stream.
- **Pre-releases.** `5.0.0-alpha.N`, `-beta.N` and `-rc.N` are cut by PLAT on a fixed train from `next`, as is. A pre-release never waits for a stream.
- **Calibration** (D-26) happens at the first pre-release where Button and Dialog have no seed: QUAL's L10 and L2 artifacts drive the single `perf-budget-raise` PR, and **each stream applies its own fragment rows** in that PR window. This is an event triggered by state, not a dependency. If Button lands before Dialog, calibration runs for Button first.

### 6.2 GA checklist (`certification/RELEASE_CHECKLIST.md`, QUAL-owned, run by the GitLab job `qual:certify:release` on the GA candidate tag, which writes `ReleaseVerdict`)

GA is promoted only when every item is true on one SHA of `next`. No item is a dependency between PRDs; each one is a property of the release.

| # | Item | Verified by | Streams whose paths it covers |
|---|---|---|---|
| G-01 | Every lane L1–L12 is `pass` for every GA subject. No `pending`, `double-pass` or `pre-existing` remains | `qual:certify:release` | all |
| G-02 | Zero `@ag-contract-seed` markers in `src/`; zero `data-ag-seed`, story-only attributes or banned attributes in `dist/`; the tarball contains no `contracts/`, `tests/`, `fragments/` or stub files | L1, L2 | all |
| G-03 | Every `ENTRIES` row with `ga: '5.0'` is built, and its value exports equal the contract list exactly. `ROOT_EXPORTS` equals the root's value exports | `tests/contract/entries.test.ts` against the tarball | PLAT, MAT, CMP, SURF |
| G-04 | All 44 flagships have §11.3 deliverables: meta, parts contract, selector table, registry usage, APG script, budget row, perf grade ≥C, L7 baselines, a codemod fixture per absorbed 4.x name | `packages/qa/src/deliverables/` | CMP, SURF |
| G-05 | All auraglass lint rules are at `error` everywhere, with zero violations; the literal baseline is 0 for every stream (was SC-17, by beta.1) | L1 | all |
| G-06 | Contract conformance suite green (§6.3) | `tests/contract/**` | all |
| G-07 | Every 5.0 removal or rename has a `deprecations` entry that shipped in a **published** 4.x minor (≥4.2.0) | L3 against the published 4.x tarballs | all (fragments authored on `release/4.x`) |
| G-08 | Codemods run clean on the canaries and every registry block. The frozen 4.x fixture passes after `migrate 4to5` with zero TODOs on the flagship subset | L11 | PLAT (engine), all (mappings and fixtures) |
| G-09 | L13 manual screen-reader records exist for all 44 flagships (`tests/a11y/manual/records/<stream>/`), with no `fail` open | L13 artifact | CMP, SURF, MAT |
| G-10 | L14 human visual review signed for the six product surfaces and the T0 matrix | L14 artifact (`fragments/review/*`) | QUAL, MAT |
| G-11 | Zero open P0, and ≥4 weeks since the first P0-free RC (§14.1) | issue tracker query | all |
| G-12 | `legacy/` is empty and `reports/` is absent | L1 | PLAT |
| G-13 | Size and perf budgets are within their calibrated ceilings, with no raise after calibration | L2, L10 | all |
| G-14 | README and release-note claims are generated from this run's artifacts | PLAT docs-claims gate | PLAT |
| G-15 | Gates outside the agent perimeter are recorded as decided: Base UI adoption sign-off (§17), the D-31 font licence, the npm scope (D-23), npm trusted publishing re-pointed to the GitLab publisher of §4.13.7 for every package and verified by a provenance-bearing pre-release (OD-10), and the GitLab project settings of OD-11 | `docs/release/decisions/` | PLAT records them; product decides |
| G-16 | No GitHub Actions workflow other than the org-managed `mirror-to-gitlab.yml` exists on the GA SHA, and every `REQUIRED_JOBS` entry is `allow_failure: false` | `contract:ci-fragments` | PLAT |

A missed item moves the GA date, never the gate (§14.1). The 5.1 items (`./charts`, enhanced tier if not certified, labs promotions) are not on this list.

### 6.3 How incompatibilities are detected: the contract conformance suite (QUAL)

`tests/contract/**` (QUAL-owned) runs in every branch pipeline as the blocking GitLab job `contract:conformance`, and on every merge. It tests **the contract, not the stream**, so it passes against seeds on day 0 and keeps passing as each real implementation lands:

| Test | Asserts |
|---|---|
| `material.test.tsx` | `materialProps` output equals `MaterialAttributes` for a table of 40 roles; `Surface` passes `style` through untouched and emits only registered attributes |
| `attributes.test.ts` | every `data-ag-*` in `dist/` and in rendered stories is in `AG_ATTRIBUTES`, emitted by its allowed setter's paths; none is in `BANNED_ATTRIBUTES` |
| `css-vars.test.ts` | every `--ag-*` defined in built CSS is in `PUBLIC_CSS_VARS` or `MOTION_CSS_VARS`; every one of those is defined (dead/undefined both fail; seeds are reported `pending`) |
| `layers.test.ts` | every shipped CSS file starts with `LAYER_ORDER_STATEMENT`; zero `!important`; each file's layer matches its `fragments/css` declaration |
| `preferences.test.tsx` | the hooks return `SERVER_SNAPSHOT` on the server; the provider renders `PORTAL_ROOT_MARKUP`; `usePortalContainer` resolves each layer root; Escape reaches only the top `useLayer` entry |
| `components.test.tsx` | for every `COMPOUND_PARTS` and `FLAT_CMP_COMPONENTS` export: the export exists; parts render `data-ag-part`; the root accepts the S-30 root props; no `BANNED_PROPS` in the `.d.ts`; behaviour matches the doubles (§5.1) once the seed is gone |
| `meta.test.ts` | every `*.meta.ts` satisfies `ComponentMeta`; `parts` equals the rendered DOM parts; `budgetKb` equals the stream's size-budget row |
| `entries.test.ts` | G-03, in `pending` mode before GA |
| `fragments.test.ts` | every fragment loads through `loadFragments` and satisfies its type; deprecation ids are unique and use the stream's prefix; codemod ids are in the catalogue |
| `ownership.test.ts` | `contracts/ownership.json` equals §3.2; every tracked path has exactly one owner; CODEOWNERS is in sync |
| `doubles.test.tsx` | each `tests/contract-doubles/cmp/*` satisfies the same S-30 assertions as the real component, so a double cannot drift from the contract |

A conformance failure on a PR names the seam id and the owning stream. If the PR's own change caused it, the PR is blocked. If the main branch was already failing, the failure is `pre-existing` for other streams and blocking only for the seam owner's next PR.

---

## 7. Migration of the old dependency edges

### 7.1 How the 1,487 cross-group edges are eliminated

Method: all 2,405 tasks in `archive/v1-19-prd/tasks/*.json` were re-read on 2026-10-06. Every `depends_on` id was resolved, and archived `PRD-xx` strings were mapped through §16 numbering to the group that owns them. Each archived key was mapped to its new stream. That reproduces exactly **1,487** edges that cross streams. Each edge was then classified by what the depended-on task produces. The counts sum to 1,487.

| # | Category (what the consumer waited for) | Edges | Eliminated by |
|---|---|---|---|
| 1 | Certification lanes, scenes, OCR and pixel gates, APG harness, test helpers | 200 | S-40..S-43 types and seeds; lanes discover subjects from meta and story parameters; per-stream spec dirs (row D02); F `lanes`, F `playwright` |
| 2 | Preference store, provider, script, portal root, LayerStack, a11y rungs | 152 | S-20..S-26 types and seeds at final paths; the a11y rungs key only on S-01 attributes |
| 3 | Storybook preview, story contract, Lab harness, showcases | 124 | S-41 story metadata; verbatim `.storybook/main.ts` globs; QUAL builds globals from S-20 and S-42 without edits from others; showcases import SURF-owned blocks (§5.3) |
| 4 | Tokens, CSS custom properties, layers, compiled CSS | 116 | S-03, S-04, S-10, S-11 frozen names; `contracts/stubs/reference.css`; F `css` for assembly |
| 5 | Registry blocks, compat adapters, docs app | 90 | one owner per block or item (§3.3); per-stream `src/compat/<stream>/` with a verbatim `src/compat/index.ts`; `apps/docs/content/<stream>/` |
| 6 | `package.json`, Base UI pin, dependency allowlist, exports manifest | 83 | §4.12 frozen sets; `ENTRIES` and the manifest generated at C0 |
| 7 | ESLint plugin, config and rules | 73 | verbatim loader; `lint/rules/<stream>/`; rule owner table; non-blocking rollout |
| 8 | Material engine (`Surface`, `materialProps`, `material.css`) | 70 | S-05/S-06 seed, with the final `materialProps` in C0 |
| 9 | Deprecations schema, seed and generator | 67 | S-38 type; F `deprecations` authored on `release/4.x` |
| 10 | CMP component props and parts (Button, Popover, Menu, Dialog, …) | 66 | S-30 contracts, seeds and doubles |
| 11 | Build, gate scripts, workflows, tsconfig | 64 | fixed GitLab job names and required jobs (S-43, S-53); per-stream CI fragments; stream gates under `scripts/<stream>/` registered through F `lanes`; verbatim tsconfig `include`/`exclude` |
| 12 | Foundation pattern, parts registry, meta, KEEP primitives | 55 | S-31..S-34 seeds; keep list |
| 13 | Size and perf budget files | 54 | F `size-budgets`, F `perf-budgets`; default ceilings in S-44; calibration is a state-triggered event (§6.1) |
| 14 | Jest, Playwright and certification configs | 52 | verbatim configs that discover by location; F `playwright` |
| 15 | Codemod engine, catalogue and mapping tables | 44 | S-39; F `codemods` with fixtures; PLAT implements area transforms from stream specs |
| 16 | Platform gates and fixtures (canaries, consumer-4x, pack, doctor, claims, hygiene) | 42 | PLAT single ownership; `tests/fixtures/consumer-4x/cases/<stream>/`; gates read fragments |
| 17 | Specific CMP components consumed by others (Card, Icon, Stack, IconButton, …) | 33 | S-30 (`FLAT_CMP_COMPONENTS`, `COMPOUND_PARTS`) |
| 18 | Specific SURF components consumed by others (AppShell, Table, Tabs, CommandPalette, …) | 33 | ownership moves: the date flagship (14) and CommandPalette go to SURF; MAT/A11Y and QUAL/PERF tests of SURF components become SURF tests in SURF's dirs, or are lane subjects discovered from SURF's meta. No other stream composes SURF internals |
| 19 | `warnDeprecated`, `cn` and other internal helpers | 31 | S-37 seed with the final implementation at C0 |
| 20 | Motion runtime and tokens | 23 | S-12, S-13 |
| 21 | Legacy removal families (RM-xx) | 10 | legacy quarantine (§3.1a): nothing on `next` can depend on a removal, because legacy code is outside the build from C0 |
| 22 | 4.x-line ordering (trust patch, 4.2 items) | 5 | PLAT owns `release/4.x` (§2.4.1), so these are now intra-stream edges |
| | **Total** | **1,487** | **0 cross-stream edges remain** |

The second structural fix is ownership. The 1,831 distinct paths that the archived tasks name (85 of them claimed by more than one group) now each match exactly one row of §3.2. Of these, 1,260 keep the single owner they already had. The other 571 are relocated by the rules above, mainly:

- per-stream subdirectories for APG, e2e and visual specs (for example `tests/a11y/apg/button.apg.spec.ts` becomes `tests/a11y/apg/cmp/button.apg.spec.ts`);
- legacy paths quarantined to PLAT;
- docs moved to `apps/docs/content/<stream>/`;
- the gate tests moved to `tests/build/`.

The relocation table is produced mechanically by `docs/auraglass-5/tools/relocate-archived-paths.mjs` when the five new task fragments are written. It is a **planning tool run once by the PRD authors**, not a PLAT stream deliverable (v1.0 placed it at `scripts/release/`, which would have made every other PRD's task fragments wait for PLAT). Its rules, in order:

| # | Archived pattern | Relocated to | Example |
|---|---|---|---|
| R-01 | any task whose `action` is `REMOVE`, whose `system` starts with `removal/` or `dispositions/`, or whose file is a 4.x path that C0 quarantines (§3.1a) | **reassigned to PLAT**, the path becomes `legacy/<path>` | 119 archived removal tasks: 33 FND (FND-042..FND-143: removal families RM-01..RM-13, consumer grep, archive, gate, dispositions), 73 of the other non-PLAT groups (for example MAT-113, MAT-115, NAV-136, the MOT and DS removals) and 13 already in PLAT groups. Archived FND maps to CMP **except** these; v1.0 mapped all FND tasks to CMP, which contradicts "PLAT absorbs FND removal and extraction execution". The reassignment adds a net 106 cross-stream edges (1,487 → 1,593); every one of them is a "removal waits for its successor or its deprecation" ordering, which is category 21 (legacy is outside the build) plus release gate G-07, never a work dependency |
| R-02 | `tests/<D02 kind>/<area>/…` and `tests/<D02 kind>/<file>` | `tests/<D02 kind>/<stream>/<area>/…` | `tests/a11y/apg/button.apg.spec.ts` → `tests/a11y/apg/cmp/button.apg.spec.ts`; `tests/e2e/app-shell/layout.spec.ts` → `tests/e2e/surf/app-shell/layout.spec.ts`; `tests/perf/browser/data-table.spec.ts` → `tests/perf/browser/surf/data-table.spec.ts` |
| R-03 | a stream's test in a D09 (PLAT gate) directory, `tests/motion/` by a non-MAT stream, or `tests/a11y/browser/` by a non-QUAL stream | the stream's own area directory or `tests/e2e/<stream>/` | `tests/exports/data-date-entries.test.ts` → `tests/data/exports/…`; `tests/motion/tabs-indicator.spec.ts` (SURF) → `tests/e2e/surf/motion/tabs-indicator.spec.ts`; `tests/a11y/browser/floors.spec.ts` (MAT) → `tests/e2e/mat/floors.spec.ts`; `tests/canary/next16/breadcrumbs-server.spec.ts` → `tests/e2e/surf/canary/…` |
| R-04 | `src/compat/<area>/…` | `src/compat/<stream>/<area>/…` | `src/compat/controls/GlassButton.tsx` → `src/compat/cmp/controls/GlassButton.tsx`; `src/compat/media/…` → `src/compat/surf/media/…` |
| R-05 | `src/components/navigation/<Name>.*` (SURF flagships) and `src/primitives/SourceTransition.*` | `src/components/<kebab>/<Name>.*` (row C04) | `src/components/navigation/Tabs.tsx` → `src/components/tabs/Tabs.tsx`; `src/primitives/SourceTransition.tsx` → `src/components/source-transition/SourceTransition.tsx` |
| R-06 | `src/icons/ai/**` (SURF) | `src/ai/icons/**` (SURF-internal glyphs built on CMP's `Icon`, not exported from `./icons`) | `src/icons/ai/index.ts` → `src/ai/icons/index.ts` |
| R-07 | `src/stories/**`, `src/design-system/stories/**` | `stories/<stream>/**`, or colocated with the component; block stories → `registry/blocks/<id>/` | `src/stories/perf/PerfFixtures.stories.tsx` → `stories/qual/perf/…`; `src/design-system/stories/Tokens.mdx` → `stories/mat/Tokens.mdx`; `src/stories/flagships/**/*.mdx` → deleted, replaced by auto docs pages (S-51) |
| R-08 | a stream's gate or tool under `scripts/{ci,build,release,docs}/` | `scripts/<stream>/` (row E03) and registered through F `lanes` | `scripts/ci/verify-optics-css.mjs` → `scripts/mat/verify-optics-css.mjs`; `scripts/ci/verify-selector-coverage.mjs` → `scripts/cmp/…`; `scripts/build/lens-maps.mjs` → `scripts/tokens/lens-maps.mjs` |
| R-09 | `packages/cli/src/migrate/4to5/{transforms,__fixtures__}/…` by a non-PLAT stream | spec in `fragments/codemods/<stream>.ts`, fixtures in `fragments/codemods/<stream>/fixtures/<id>/<case>/` (§4.8) | `…/__fixtures__/canonical-names/controls/` → `fragments/codemods/cmp/fixtures/canonical-names/controls/` |
| R-10 | `docs/**` and `apps/docs/content/components/**` by a non-PLAT stream | `apps/docs/content/<stream>/**` | `docs/migration/data-table.md` → `apps/docs/content/surf/migration/data-table.md` |
| R-11 | `canaries/**` pages by a non-PLAT stream | row B23a | `canaries/vite/src/DataTable.tsx` → `canaries/vite/src/surf/DataTable.page.tsx` |
| R-12 | `.github/workflows/<name>.yml` | a job in `ci/<owner>.gitlab-ci.yml` (or a lane registration) | `foundation-pattern.yml` (CMP) → `cmp:test:foundation-pattern`; `removal-gate.yml` → `plat:gate:removal`; `certify-nightly.yml` → `qual:certify:nightly`; `storybook-tests.yml` → lane L5/L6 |
| R-13 | a QUAL test of another stream's internal module (for example archived PERF-011 over `src/material/dev/surfaceCounter.ts`) | the owning stream's test directory | `tests/perf/dev-only-elimination.test.ts` → `tests/material/dev-only-elimination.test.ts` (MAT) |

Re-check on 2026-10-06 (contract-v1.1 review, picomatch over all 2,405 archived tasks, braces and `;` lists expanded): 1,994 distinct archived paths; 1,361 already sit with their claimant's stream (or are CONTRACT-held); 593 need one of R-01..R-13; 84 had more than one claimant; 40 hit row D02x and so would have no valid owner without relocation. The v1.0 figures (1,831 / 1,260 / 571) came from a stricter path parser; the rules above cover both counts.

### 7.2 Task-fragment rules for the 5 new PRDs (replaces SC-40)

1. `depends_on` contains only ids of the same stream: `^(PLAT|MAT|CMP|SURF|QUAL)-\d{3}$`, with the same prefix as the task. A cross-stream need goes in the field `contract: ["S-nn", …]`.
2. Release ordering (G-07, the 4.x minors) goes in `gate: "G-nn"`. It is never in `depends_on`.
3. A task that would edit another stream's path is invalid. It becomes either a fragment task in the task's own stream or a contract PR.
4. The validator `docs/auraglass-5/tools/verify-task-graph.mjs` (planning tool, run when the fragments are written and by `contract:ci-fragments` whenever `docs/auraglass-5/tasks/*.json` changes) fails on any violation, and on any path that is not owned by the task's stream according to `contracts/ownership.json`. It is not a PLAT deliverable, so no stream waits for it.

### 7.3 Residual waits

**Hard waits between streams: zero.** None of the following is a PRD-to-PRD dependency, but all are listed so that nothing is hidden:

| # | Ordering | Why it remains | Why it is not a wait |
|---|---|---|---|
| W-0 | C0 before any stream branch | the contract must exist before code is written against it | C0 is the adoption of this document, authored mechanically from §3–§4 on day 0, and it is not a stream deliverable |
| W-1 | G-07: a 5.0 removal ships at GA only if its deprecation shipped in a published 4.x minor | semver policy (C-D before C-B, §14.4) | this is a release gate on the GA tag. Both lines proceed in parallel. A missed deprecation drops that removal from GA (kept in `compat` or postponed), and it never pauses work |
| W-2 | Budget calibration at the first pre-release where Button and Dialog are real (D-26) | calibration needs real measurements | it is state-triggered. Provisional ceilings apply until then, and nobody waits for it |
| W-3 | Area codemod transforms: SURF and MAT write spec and fixtures, PLAT writes the transform code | `packages/cli/**` has one owner | each side works independently against the fixtures (test-first). G-08 needs both halves, but neither half waits to start |
| W-4 | Showcases and blocks compose other streams' real components | product surfaces must be built from unmodified components (§15.4) | they render seeds, doubles and `ShowcasePending` until the inputs land, and they turn green automatically |
| W-5 | External decisions (Base UI sign-off §17, D-31 fonts, D-23 npm scope, trusted-publishing verification) | outside the agent perimeter | recorded as G-15 gates, with defaults already in the contract (Base UI adopted; system font stack; scoped names, with fallback names reserved) |
| W-6 | GitLab sees pushes to `next`, `release/4.x` and stream branches only at the next `main` push or the daily 05:23 UTC mirror reconcile (§4.13.1) | the org-managed mirror workflow triggers only on `main`, tags and the schedule | latency, not a dependency: streams keep merging; the merging stream may ask the owner to dispatch the mirror. OD-8 removes it. Until then a PR's pipeline may not exist when the PR is ready, and the merge rule of §2.3 waits for that SHA's pipeline only for the PR's own stream |
| W-7 | npm trusted publishing must be re-pointed from GitHub `publish-npm.yml` to the GitLab publisher before the first GitLab publish (4.1.1) | npm account setting, outside the agent perimeter (OD-10) | PLAT prepares and dry-runs the tag pipeline (`npm publish --dry-run`) independently; only the publish step itself waits, and no other stream is involved |

**v1.1 adversarial edge sample.** 80 archived cross-stream edges were sampled (4 per ordered pair, all 20 pairs) and checked against the seams. 68 were already removed by v1.0 seams. 12 were not, and v1.1 fixes them: QA-072←REL-040 and DX-134←PERF-042 (QUAL/PLAT script coupling → S-55 report artifacts); DX-079←NAV-095, DX-080←DATA-108/AI-075, DX-085←DATA-108 (PLAT blocks composing SURF components → ownership moved to SURF, §3.3); SB-083/SB-086/SB-088←CMP and SURF stories and REL-119←SB-078 (MDX importing other streams' story files and `.storybook` internals → S-51); A11Y-080/A11Y-082←NAV-016/NAV-064 (MAT specs iterating SURF stories → `listSubjects`, S-40); DX-068←DS-090 (PLAT build needing MAT's compiler → S-52 `tokens:build` seed and the manifest double); PERF-011←MAT-055 (QUAL testing a MAT internal → R-13); AI-024←FND-048 (SURF writing under `src/icons/` → R-06); MAT-096/DS-106 and every FND removal edge (→ R-01). Residual, not fixed by an edit: DX-038←QA-018 (`aura-glass audit` CLI reusing QUAL's cert Playwright config): PLAT's CLI must ship its own config and may not import `certification/**`; SB-062←DS-014 (Lab spec export validated against MAT's DTCG schema file): QUAL validates against the S-11 `TokenManifest` type instead until `tokens/$schema.json` lands.

### 7.4 Open contract-change items (non-blocking; each defaults to the frozen value)

| Id | Question | Frozen value until decided | Proposer |
|---|---|---|---|
| CC-01 | Widen the `motion` peer to `^12 \|\| ^13 \|\| ^14` (npm `latest` is 14.0.0)? | `^12.0.0` (D-25) | MAT |
| CC-02 | Adopt TypeScript 7 (native) once API Extractor supports it? | `5.9.3` | PLAT |
| CC-03 | Style Dictionary 5? | `4.4.0` | MAT |
| CC-04 | ESLint 10? | `9.39.5` | PLAT |
| CC-05 | Storybook 10? | `9.1.20` | QUAL |
| CC-06 | `@tanstack/react-table` v9 (adds `@tanstack/react-store`)? | `8.21.3` | SURF |
| CC-07 | Architecture errata E-01..E-11, plus the new ones from this contract: density values per §5.4, root composition (§4.7), and the portal accessor moving to MAT (§4.5) | as written here | PLAT (architecture owner) |

**Owner decisions for the GitLab CI/CD model** (outside the agent perimeter; each has a working default, so no stream waits):

| Id | Decision | Default until decided | Who |
|---|---|---|---|
| OD-8 | Replace the org-managed `mirror-to-gitlab` GitHub Action with GitLab **pull mirroring** of the public GitHub repo, with "Trigger pipelines for mirror updates" enabled, so there are zero GitHub Actions and every branch push reaches GitLab within minutes (removes W-6). For a public repo this needs no GitHub token; it is a GitLab project setting, and the mirror fleet rules forbid agents changing mirror sync without Gurbaksh's instruction | the existing push mirror (main, tags, daily) | Gurbaksh |
| OD-9 | Report GitLab pipeline status back to GitHub commits (GitLab "GitHub" integration with a GitHub token stored in GitLab), so GitHub branch protection can require it | off: the merge rule of §2.3 is checked with `scripts/ci/gitlab-status.mjs` | Gurbaksh (token must come from him; never copied from this Mac) |
| OD-10 | Re-point npm trusted publishing for `aura-glass` (and configure it for `@auraglass/*` after their first publish) to GitLab CI/CD `chahal-foundation-group/github-auraoneai/auraglass`, file `.gitlab-ci.yml`, environment `npm-publish` | no publish from GitLab until done (W-7) | Gurbaksh (npm account) |
| OD-11 | GitLab project settings on 87152036: CI/CD enabled with config path `.gitlab-ci.yml`; protected tags `v*`; pipeline schedules (nightly on `next` and `release/4.x`); Pages visibility public; "keep latest artifacts" on; optional registration of the AWS remote runner with tag `auraglass-aws-remote` for device lanes | PLAT applies the ones an existing `glab` login may change and records the rest in `docs/release/decisions/` | PLAT, Gurbaksh for anything needing new credentials |

Not verified by this review (needs a live check against GitLab, npm or the runner fleet; PLAT confirms them in its first pipeline): that GitLab creates pipelines for every branch in a multi-ref `git push --all` from the mirror (GitLab skips pipeline creation when a single push updates more than a small number of refs, so the daily reconcile may not run every branch's pipeline; OD-8 avoids this); the exact SaaS runner tags available on the group's tier; that `npm publish <tarball> --provenance` produces provenance on GitLab with `SIGSTORE_ID_TOKEN`; and that `mcr.microsoft.com/playwright:v1.63.0-noble` exists for the pinned Playwright version.

---

## 8. Change log

| Version | Date | Change |
|---|---|---|
| `contract-v1.0` | 2026-10-06 | Initial freeze. Replaces the §16 decomposition and SC-01..SC-40 ownership with 5 concurrent streams, 38 seams, 11 fragment kinds and an 81-row ordered ownership table (A01–Z01, before `<stream>` expansion) |
| `contract-v1.1` | 2026-10-06 | Pre-C0 amendment, so no seed or stream is affected. (1) CI/CD moves to GitLab CI only (Gurbaksh's instruction): five GitHub workflows deleted on every branch; rows A19/A20 (`.gitlab-ci.yml`, `ci/<stream>.gitlab-ci.yml`), B11/B12/B12a rewritten; §4.13 adds the root pipeline, the fragment seam (S-53) and npm OIDC publishing from GitLab (S-54); `WORKFLOWS`/`REQUIRED_CHECKS`/`CERT_JOB_IDS`/`EVIDENCE.uploadName` replaced by `CI`, `REQUIRED_JOBS`, `CERT_JOBS`, `CI_JOBS`, GitLab artifact naming; required-check activation is now each stream's own `allow_failure` flip; the fragment-sync bot is an operator task because CI holds no GitHub credential; change class no longer reads PR labels. (2) Review fixes: row D02x rejects non-stream test subdirectories (40 archived paths would otherwise silently fall to QUAL or MAT); B22a covers `css-api.json` and the root report; B23a per-stream canary pages; `support-inbox`, `mobile-settings` and `schema-viewer` move to SURF; S-51 docs blocks, S-52 script names, S-55 report artifacts and `listSubjects`; `.storybook/preview.tsx` seed content (referenced by C0-12 but missing); `jest.config.js` made ESM (v1.0's `module.exports` cannot load under `"type": "module"`); `_strict.cjs` shape made consistent with the loader; seeds for `tokens:build` and `api:update`; the relocation and task-graph tools moved to `docs/auraglass-5/tools/` so no PRD waits for PLAT; R-01 reassigns all removal tasks to PLAT; G-16 added. 43 seams |
| `contract-v1.1+CP-PLAT-3` | 2026-10-08 | Additive S-37 export `setDeprecationMode(mode: 'warn' \| 'silent')` (contract PR CP-PLAT-3, PLAT proposes / MAT adopts). No seed changes: until it merges, `AuraGlassProvider deprecations="silent"` is a documented no-op and warnings stay dev-only (REQ-PLAT-26). |
| `contract-v1.2` | 2026-10-10 | Additive bundle FIN-463 (PRD-F Appendix C), contract PR `contract/v1.2-final`; takes effect only when OD-16 is recorded, and every item the owner rejects falls back as listed. **Reconciliation** of edits that reached `next` outside a contract PR: ratified `jest.config.js` (#369: `babel-jest-import-meta.cjs` transform, `.mjs` extension, `^prettier$` → `prettier/index.mjs` with `transformIgnorePatterns`), `load-fragments.mjs` direct bundle evaluation, `SurfaceGroupProps.refraction`, `./three` `exports: []`, `./charts` `css`, `CssFragment` bundle `charts.css`, `COMPOUND_PARTS.ColorPicker` + `CmpRootProps.ColorPicker`, stages `package` before `certify`; reverted `PUBLIC_CSS_VARS` readouts/focus back to `--ag-surface-*`/`--ag-focus-*` (REQ-MAT-29, -61, REQ-CMP-19; `etc/api/material.css-api.json` already lists the public names). **Items:** C-1 `MaterialAttributes` has no `className` (required, no fallback). C-2 `AG_ATTRIBUTES` += `data-ag-theme`, `data-ag-shadcn-source`, `data-ag-scroll-locked`, `data-ag-hit-clamp`, `data-ag-focus-inset`, `data-ag-lens-defs` (setter MAT for scroll-locked and lens-defs, ANY for the four opt-in hooks), the `data-ag-appearance="full-height"` value, and `STATE_ATTRIBUTES`, the non-`data-ag` state attributes library CSS may select; the MAT attributes left unregistered are listed in §4.2 and renamed by MAT (fallback: stop emitting or rename to `data-ag-part`). C-3 `COMPOUND_PARTS` += `Dialog`/`AlertDialog`/`Sheet` `Header`, `Body`, `Footer`, `Tooltip.Provider`, `Toast.Progress`, `Combobox.Group`/`GroupLabel` (implemented on `next`); `COMPOUND_PARTS_PENDING` declares `SegmentedControl.Indicator`, `Slider.Track`/`Range`/`Thumb`, `Menubar = {Root, Menu}` and `Toast.History`/`HistoryItem`, which move into `COMPOUND_PARTS` in the contract commit after their CMP implementation, so conformance never asserts a missing part; `Fieldset` stays flat (fallback: remove the parts). C-4 root `moduleNameMapper` maps `aura-glass` and every `ENTRIES` source (fallback: per-stream Jest configs registered as lanes). C-5 the `css` export condition is rejected (§4.7). C-6 `three`, `@react-three/*` are 5.1-only peers like `d3-*` (fallback: keep only with a documented 5.0 use). C-7 `PUBLIC_CSS_VARS.comp` (9 control heights) and `.switchTrack` (6), `TOKEN_OUTPUTS` lists every output the build writes; MAT adds no other public name and the names it moves to `--_ag-*` are listed in §4.3 (fallback: rename to `--_ag-*`). C-8 producer row `mat:build:bridge` with its exact written files (§4.13.2) (fallback: outputs under `.artifacts/mat/bridge/`). C-9 `contract:ci-fragments` passes `--base` (fallback: script-side derivation, the current behaviour). C-10 `.github/CODEOWNERS` on `main` is a separate contract PR. C-11 optional Combobox importer of `@tanstack/react-virtual`, only with OD-15. C-12 optional AI SDK v6 pins. C-13 `BANNED_PROPS` keeps `tone`; Backdrop's media tone prop is `mediaTone` (emits `data-ag-media-tone`; OD-17). C-14 `DateTimePicker`/`Waveform` are 5.1. C-15 `no-inline-glass` retired from `contracts/lint-rule-owners.json` (no rule file exists; `no-optics-outside-material` replaces it). C-16 `contracts/schemas/sr-record.schema.json` is the single SrRecord schema, with optional evidence fields. C-17 `release/4.1.x` and `4x11-*` are line `4x` (root `workflow:rules`, already on `next`); `contracts/ownership.json#branchRules` records the prefix rules. Version strings in `src/contracts/**` and `jest.config.js` read `contract-v1.2` |













