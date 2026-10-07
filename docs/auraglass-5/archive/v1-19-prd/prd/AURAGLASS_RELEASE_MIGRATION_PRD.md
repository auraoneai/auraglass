# AuraGlass Release Governance and Migration Strategy PRD

| Field | Value |
|---|---|
| Key | **REL** (task fragment `tasks/REL.json`, task ids `REL-NNN`; program key per `_shared-contracts.md` SC-01) |
| PRD id | **PRD-01** (release governance; alias of key REL), and it also carries the migration *strategy* half of §16 PRD-18 (deliverable K) and, as interim owner (SC-37), the release scope and gates of the unfiled §16 PRD-17 (4.2/4.3 bridge) |
| Contract registry | `docs/auraglass-5/prd/_shared-contracts.md` is binding. Where this PRD and a registry row disagree, the row wins. This PRD owns SC-01 (key crosswalk), SC-02/SC-03 (deprecations schema and gate), SC-04 (API reports), SC-05 (publish-workflow contract), SC-08 (frozen 4.x fixture), SC-09 (visual tolerance), SC-10 (required check names), SC-33 (codemod id catalogue), SC-37 (program index) and SC-40 (task-graph rules) |
| PRD citation rule | Other PRDs are cited by **§16 id** (architecture numbering) with the key in brackets where it helps: PRD-00 [TRUST], PRD-02 [PKG], PRD-03 [DS], PRD-04 [MAT], PRD-05 [A11Y], PRD-07/14/16 [FND], PRD-08 [CTL], PRD-09 [OVL], PRD-10 [NAV], PRD-11 [DATA], PRD-12 [AI], PRD-13 [MED], PRD-17 [REL interim, content with MAT/DS/DX/MOT per SC-37], PRD-18/20 [DX], PRD-19 [QA; Storybook/Lab half SB]. PERF and EXP have no §16 id. Program self-ids (for example "PRD-16 (DX)") are aliases only and never appear in `depends_on` |
| File | `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` |
| Owner area | Release engineering and migration (release owner + DX lead) |
| Status | Draft |
| Date / baseline | 2026-10-06, `aura-glass` 4.1.0, HEAD `15b6de6f7` |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §1.2, §2, §3.2, §3.4, §12, §13, §14, §15.2–15.3, §16; `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `autopsy/history-hygiene.md`; `autopsy/packaging-ssr-dx.md`; `autopsy/qa-certification.md`; `autopsy/appshell-workspace-recipes-cli.md`; `architecture/proposal-migration-first.md`; `docs/release-rollback-deprecation.md` |
| Related decisions | D-01, D-14, D-17, D-18, D-19, D-27 (anchors); also D-02, D-03, D-06, D-07, D-11, D-22, D-23, D-28, D-30, D-31, D-32 |
| Requirement prefix | `REQ-REL-NN`; acceptance criteria `AC-REL-NN` |

**Boundary.** This PRD owns: the change-class taxonomy and its CI enforcement, the API report baseline and diff, the `deprecations.json` schema and gates, the visual-change-is-breaking gate, branch and dist-tag policy, the release train gates, the rollback runbook, the release ledger (CHANGELOG / tag / npm consistency), the complete 4.x→5.0 breaking-change register, the codemod *catalogue* (ids, inputs, outputs, fixture contract), the `aura-glass/compat` *contract*, the 4.x LTS policy, consumer communication, and the AuraOne downstream grep. As interim owner of §16 PRD-17 (SC-37) it also owns the 4.2/4.3 release scope and gates (REQ-REL-26/27 and the C-D install-level rule). It does **not** own: codemod implementation and the `compat` adapter code (PRD-18 [DX]; engine DX-041/DX-042, compat index DX-065), the 4.2/4.3 bridge *content* (`preview-v5.css` MAT-101; `compat/tokens.css` DS-103; `compat/globals.css` PKG; `doctor --v5` DX-037; the 4.2 experimental `aura-glass/material` and `aura-glass/motion` entries MAT and MOT), the build and exports manifest (PRD-02), deletions (PRD-16), certification infrastructure and canaries (PRD-19), or the generated migration guide app (PRD-20). Those PRDs consume the contracts defined here.

**Deviations from the architecture (explicit).**

1. *File name.* §16 names this PRD `PRD-01-release-governance.md`. The program task assigns `AURAGLASS_RELEASE_MIGRATION_PRD.md`. The PRD id stays PRD-01 (key REL). Resolved by the SC-01 crosswalk; the §16 file-name fix is architecture erratum E-07.
2. *Unclassified 4.x subpaths.* §3.2 lists the removed subpaths, but the 4.1.0 `exports` map (`package.json:12-230`) also contains `./styles`, `./tokens/css`, `./tokens/json`, `./tokens/tailwind`, `./tokens/manifest`, `./icons/<category>` (8), `./primitives/{slot,portal,focus,dismissable-layer,roving-focus,positioning}` and `./utils/env`, none of which §3.2 classifies. This PRD classifies them (B17–B19 in §11.1) so the API gate has no unclassified removals. PRD-02 may overrule the target name but not leave one unclassified. PRD-02 has already overruled one row: `./tokens/json` and `./tokens/manifest` have no 5.0 entry (SC-12), so B19 removes them.
3. *4.x API reports.* D-27 says "API Extractor report diff per entry". 4.x `.d.ts` files contain unresolved `@/` imports (HOOKS-UTILS-TYPES-06), which API Extractor cannot follow. On `release/4.x` the gate therefore pairs the API Extractor report with a **runtime export snapshot** taken from the packed tarball (REQ-REL-03). The snapshot is also the only way to detect the type-only facades (PACKAGING-SSR-DX-10), so it stays on `main` too.
4. *Alignment with PRD-00 [TRUST] (`AURAGLASS_TRUST_PATCH_4_1_1_PRD.md`), which ships first.* Architecture §16 assigns the 4.1.1 *instances* to PRD-00; this PRD owns the *contracts* (SC-02..SC-05) and extends the instances. Nothing is built "jointly" and no parallel copies are created. (a) API reports and export snapshots live in `etc/api/<slug>.api.md` / `etc/api/<slug>.exports.json` plus `etc/api/manifest.json`, with the root entry slug `index` (SC-04; also used by PRD-02 REQ-PKG-102 and the AI and Media PRDs). TRUST-071 creates `scripts/release/api-report.mjs` and `api-extractor.base.json`; TRUST-072 creates `scripts/release/export-snapshot.mjs`. This PRD extends both scripts and adds no second one. There is no `scripts/api/` directory (SC-11). (b) `deprecations.json` sits at the **repo root** and is listed in `files` (SC-02). TRUST-075 seeds it with `{"$schema": "./docs/schemas/deprecations.schema.json", "version": 1, "entries": [...]}` from the first 4.1.1 commit, holding the §13.1 cut entries. There is no `schemaVersion: 0` seed and no v0 migration script. Readers resolve the path through `scripts/docs/paths.mjs` `DEPRECATIONS_PATH` (DX-019). (c) The publish workflow stays **`.github/workflows/publish-npm.yml`** (SC-05). TRUST-077 re-triggers it on tags and TRUST-078 strips the token path; npm trusted publishing is bound to that workflow file name (an npm package setting changed only by the operator). Renaming the workflow would break OIDC publishing. This PRD extends that workflow and does not replace it. (d) PRD-00 owns the 4.1.1 removal of the `release`/`release:dry-run` scripts and the CI guard `scripts/ci/require-ci-publish.js` (TRUST-079), which already checks `GITHUB_ACTIONS === 'true'` and `GITHUB_WORKFLOW_REF` containing `/.github/workflows/publish-npm.yml@refs/tags/v` (SC-05). It also owns the non-mutating `lint` (REQ-TRUST-12). This PRD verifies and keeps the guard (REQ-REL-21). (e) PRD-00 writes `RELEASE_NOTES_4.1.1.md` (REQ-TRUST-42). It is the last root `RELEASE_NOTES_*.md` file.
5. *Dependency diet on a 4.x minor.* Architecture §14.1 and PRD-11/12 data (A-02) move runtime `dependencies` to optional peers in 4.2. Under a strict reading of the C-B definition, an install-level removal on a minor would be C-B. This PRD therefore defines one bounded **C-D (install-level)** rule (§4.1) so that the architecture's 4.2 content passes its own gate. Full removal from both `dependencies` and `peerDependencies` stays C-B (5.0 only).

---

## 1. Problem

AuraGlass has no release discipline that a consumer can rely on, and 5.0 is the largest break the library will ever ship. Without governance and a migration strategy, 5.0 will repeat every 4.x failure at a larger scale.

1. **Semver carries no information.** 73 npm versions in about 11 months; 39 `2.0.x` patches in about 4 days; 8 `fix(ssr)!` breaking commits shipped as patches; 3.0.0 and 4.0.0 were visual reskins whose "breaking review" compared only the 20 top-level `exports` keys, never symbols, props, DOM or pixels (HISTORY-HYGIENE-12 PARTIAL; `reports/breaking-change-review.md:5-18`).
2. **Visual breaks ship in non-major releases.** `c07fd7111` ("harden neutral glass surfaces after 4.0 release", shipped in the 4.1.0 minor) left the inline material at a hard-coded `rgba(255,255,255,0.018)` fill, a 1.8% white wash (TOKENS-THEME-02 CONFIRMED, `src/tokens/glass.ts:995-1001`; `AURAGLASS_CURRENT_STATE_AUTOPSY.md` §synthesis; effectively transparent in a browser per `runtime-remote.md`). No gate treats a pixel change as a compatibility event.
3. **Deprecations are not real.** `src/types/glass-api-stable.ts:288-289` says "will be removed in v2.0.0" and still ships in 4.1.0. There are 20 `@deprecated` tags in `src/` and **zero** `console.warn` deprecation calls, so no consumer is ever told at runtime (HISTORY-HYGIENE-11).
4. **The release ledger contradicts the registry.** 3.4.8 is in `CHANGELOG.md:34` but not on npm; 3.5.0 is on npm with no CHANGELOG entry; 3.0.7 is "Unreleased" but published; tags are missing for v3.4.8, v3.5.0, v3.0.7 and all of v1 (HISTORY-HYGIENE-05, CONFIRMED).
5. **Publishing bypasses CI.** `publish-npm.yml` is `workflow_dispatch` with a free-text version and runs a subset of gates; `package.json:324` `release` publishes from a laptop. 4.1.0 shipped while Pipeline Validation was red (QA-CERTIFICATION-02/-03). The "498 certified" claim fails the repo's own verifier, 0/498 (QA-CERTIFICATION-01).
6. **There is no branch model.** Only `main` exists (`git branch -a`). No `release/4.x`, no `next` dist-tag history, no LTS policy, so 5.0 development and 4.x maintenance cannot coexist.
7. **5.0 is a hard break on every axis.** React 18 → `^19.0` floor (D-02), CJS → ESM-only (D-03), 1,073 → ≤160 root exports (D-15), `Glass*` prefix dropped (D-14), 145 REMOVE records, Base UI DOM (D-13), `--glass-*` → `--ag-*`, global CSS removed, a new default material on every surface, 24 → 4 runtime dependencies. Each of these needs a prior deprecation, a codemod or a documented manual path, and a rollback.
8. **Downstream impact is unknown.** No telemetry; about 156 downloads/week; the AuraOne consumers have never been inventoried (§17 open risk).

The product problem: a consumer on 4.1.0 today cannot tell which upgrades are safe, cannot be warned before something is removed, and has no supported path to 5.0. This PRD makes compatibility a **computed property of every PR and every release**, and makes the 4→5 path mechanical wherever it can be.

## 2. Evidence from the current codebase

All paths verified with `rg --files` / `git` on HEAD `15b6de6f7` on 2026-10-06. Finding IDs follow the crosswalk in `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; where the detail report numbers differ, the detail-report ID is given in brackets.

### 2.1 Release mechanics

| # | Evidence | Finding |
|---|---|---|
| E-01 | `.github/workflows/publish-npm.yml:3-9` is `workflow_dispatch` with a free-text `inputs.version`; `:45-65` runs typecheck, build, tree-shaking, app-chrome a11y, `verify:pack`, `verify:css-vars`, Next/Vite integration and app-chrome visuals, but **not** the full Jest suite, lint, the visual-evidence verifier or any API/compat check | QA-CERTIFICATION-02 |
| E-02 | `publish-npm.yml:67-82` has two publish paths: OIDC trusted publishing when `NPM_TOKEN` is absent, token publish otherwise. No `--tag` is passed, so every publish moves `latest` | No dist-tag policy |
| E-03 | `package.json:324` `"release": "npm run ci && npm publish --provenance --access public"` and `:325` `release:dry-run` allow laptop publishing | 4.1.0 published outside CI (QA-CERTIFICATION-03 PARTIAL) |
| E-04 | `package.json:329` `prepublishOnly` chains build, `verify:pack`, `verify:css-vars`, Next and Vite integration; `scripts/ci/verify-pack.js:135` uses `npm pack --dry-run=false --ignore-scripts --json`, and the npm 11/12 `pack --json` fix is an **uncommitted** working-tree change (`git diff --stat scripts/ci/verify-pack.js`: +9/−2) | §14.1 4.1.1 entry gate |
| E-05 | `.github/workflows/glass-pipeline.yml:3-7` runs on push/PR to `main`, `develop`, `feat/glass-*`; there is no `release/*` trigger. `git branch -a` shows only `main` and `gh-pages` | No maintenance branch |
| E-06 | `git tag` ends `v3.4.4 v3.4.6 v3.4.7 v4.0.0 v4.1.0` (31 tags); no `v3.4.8`, `v3.5.0`, `v3.0.7`, no v1 tags | HISTORY-HYGIENE-05 CONFIRMED |
| E-07 | `CHANGELOG.md:34` `[3.4.8]` (not on npm); `:274` "3.0.7 - Unreleased" (on npm); `:490` mid-file `## Unreleased`; `:497` 2.17.0 and `:509` 2.16.4 (not on npm); `:635-637` 2.0.7 above 2.0.8 | HISTORY-HYGIENE-05 CONFIRMED |
| E-08 | Five root `RELEASE_NOTES_*.md` (3.0.0, 3.0.1, 3.0.2, 4.0.0, 4.1.0) plus `CHANGELOG.md` plus `reports/3.x-release/` tell overlapping, contradictory stories | HISTORY-HYGIENE (duplication §) |
| E-09 | `RELEASE_NOTES_4.1.0.md:3` and `README.md:21` claim "498 passed targets"; `node scripts/audit/verify-visual-evidence.js` returns `FAIL 0/498` at HEAD | QA-CERTIFICATION-01 |
| E-10 | `docs/release-rollback-deprecation.md` (126 lines) is the only rollback runbook: S1–S3 severity table, `npm dist-tag add … latest`, `npm deprecate`, "avoid `npm unpublish`". It assumes a single line (`latest` only), CJS consumers and "optional self-hosted runtime exports" that 5.0 deletes | Must be rewritten for `latest`/`next`/`v4-lts` |

### 2.2 Semver and compatibility history

| # | Evidence | Finding |
|---|---|---|
| E-11 | `npm view aura-glass versions`: 73 versions; 39 are `2.0.x` published 2025-11-07..11; 8 `fix(ssr)!` commits shipped as patches (v2.0.24–2.0.31) | HISTORY-HYGIENE-12 PARTIAL |
| E-12 | `reports/breaking-change-review.md:5-18` compares only top-level `exports` keys (20 vs 20) and peer metadata for 3.0.0; no symbol, prop, DOM or pixel comparison exists anywhere | HISTORY-HYGIENE-12 |
| E-13 | `git show --stat 8c077b4b3` (4.0.0): 6 files, +89/−6; the "major" was a version bump over prior minors' visual changes | HISTORY-HYGIENE-12 |
| E-14 | `c07fd7111` "harden neutral glass surfaces after 4.0 release" changed default surface pixels on the 4.x line (shipped in 4.1.0); the result is the hard-coded `rgba(255,255,255,0.018)` fill (TOKENS-THEME-02, `src/tokens/glass.ts:995-1001`) | Visual break shipped as minor (D-27 motivation) |
| E-15 | `src/types/glass-api-stable.ts:287-289` `@deprecated Legacy glass APIs - will be removed in v2.0.0` / `@removal v2.0.0`; `src/index.ts:982-986` exports the deprecated `interactiveGlass` helpers | HISTORY-HYGIENE-11 [detail -11] |
| E-16 | `rg -c "@deprecated" src` totals 20; `rg -n "console.warn\(.*deprecat" -i src` returns **0** | No runtime deprecation channel |
| E-17 | 456 "payload batch" commits on 2026-08-14 (e.g. `dcfa2b843`) plus 375 single-screenshot commits: 831 of 1,108 commits | HISTORY-HYGIENE-03 PARTIAL; one-revertable-PR rule (§14.6) |
| E-18 | `package.json:247` `"lint": "eslint src --fix"` mutates source; 165 lint errors keep Pipeline Validation red | HISTORY-HYGIENE-15; §14.1 4.1.1 gate |

### 2.3 Surface that 5.0 breaks

| # | Evidence | Finding |
|---|---|---|
| E-19 | `package.json` `exports` has 47 keys: `.`, 6 `./tokens*`, `./styles`, 9 `./icons*`, 7 `./primitives*`, `./app-shell`, `./workspace`, `./theme`, `./forms`, `./data`, `./navigation`, `./overlays`, `./workflows`, `./marketing`, `./core/mixins/glassMixins`, `./utils/env`, `./hooks/useGlassProbes`, 5 `./services/*`, `./registry`, `./client`, `./server`, `./ssr`, `./three`, `./package.json` | Subpath register input (§11.1 B4, B17–B19) |
| E-20 | 35 of the 47 `exports` entries have a `require` condition (e.g. `package.json:12-16`), so CJS consumers exist by construction. The 12 without one are `./tokens/json`, `./tokens/manifest`, `./tokens/css`, `./tokens/keyframes`, `./styles`, `./core/mixins/glassMixins`, `./utils/env`, the 5 `./services/*` keys and `./package.json` (verified with node over `package.json` `exports`) | D-03 / B2 |
| E-21 | `package.json:369-380` peers `react`/`react-dom` `>=18.0.0 <20.0.0`, `framer-motion >=10`, `openai ^6`, `redis ^5`, `@google-cloud/vision ^5`; `:579-582` `engines.node >=18.18.0` | B1, B2, B7 |
| E-22 | `package.json` `dependencies`: 24 packages including express, socket.io, ioredis, redis, jsonwebtoken, bcryptjs, openai, Pinecone, Vision, `@sentry/node`, date-fns, chart.js, zod, framer-motion | HISTORY-HYGIENE-02; PACKAGING-SSR-DX-01 PARTIAL; B7, B14 |
| E-23 | `package.json:8-10` `"bin": { "aura-glass": "bin/aura-glass.cjs" }` | D-22 / B15 |
| E-24 | Root exports 1,073 runtime values; `forms`, `data`, `navigation`, `overlays`, `marketing` resolve to `dist/index.mjs` at runtime while their `types` point at narrow `.d.ts` | PACKAGING-SSR-DX-10 (type-only facades) |
| E-25 | `docs/auraglass-5/component-inventory.json` (500 records, recomputed with node): REMOVE 153, DEPRECATE 34, CONSOLIDATE 157, REDESIGN 75, REPLACE 22, POLISH 49, KEEP 10. Root-exported REMOVE + DEPRECATE = **131**. The architecture's "119 root-exported" and "145 REMOVE" come from the verified 477-record pass | Inventory drift (§17). The gate counts from the API snapshot, never from a hard-coded number (REQ-REL-09, REQ-REL-15) |
| E-26 | Existing codemod-like scripts: `scripts/codemods/tw-to-glass.js`, `scripts/codemods/cleanup-glass-duplicates.js`, `tools/codemods/auraglass-from-raw.mjs`, `tools/codemods/focusify.mjs`, plus one-shot mass rewrites `scripts/complete-100-percent-migration.js`, `scripts/mass-fix-undefined-access.js` | None are 4→5 transforms; none have fixtures (HISTORY-HYGIENE-10) |
| E-27 | Existing migration docs: `docs/guides/migration.md`, `docs/cli/migration.md`, `docs/liquid-glass/migration.md`, `docs/migration/{radix,mui,lucide}-to-auraglass*.md`, `docs/guides/consciousness-migration.md` | Superseded by the generated 5.0 guide (PRD-20); `consciousness-migration.md` documents a deleted family |

### 2.4 Downstream (AuraOne) grep, run 2026-10-06

Command (bounded, excludes `node_modules`, `dist`, `.next`, lockfiles), run from `/Users/gurbakshchahal/AuraOne`:

```bash
rg -l --glob '!node_modules' --glob '!**/dist/**' --glob '!**/.next/**' "from ['\"]aura-glass" .
rg -n --glob '!node_modules' '"aura-glass"\s*:' -g 'package.json' .
```

| Result | Detail |
|---|---|
| Source imports `from 'aura-glass…'` | **0 files** |
| `package.json` pins | `opensource/open-studio-platform/docs-template/package.json:20` and `opensource/open-studio-platform/templates/tauri-app/package.json:29`, both `"aura-glass": "3.1.1"` (exact) |
| Other mentions | 8 docs/test/CODEOWNERS files in `opensource/open-studio-platform/` (README, maintainers, `tests/maintainers_page_test.mjs`), no imports |
| `aura-glass/services/*` or root AI imports | **0** (precondition for PRD-16 extraction, §13.2) |

Conclusion: AuraOne is pinned to 3.1.1, does not import any symbol, and is unaffected by 4.1.1–4.3. The two templates are a documentation dependency, not a runtime one. The grep is re-run as a gate at 4.2 cut and 5.0 RC (REQ-REL-40), because other `platforms/*` checkouts were not scanned here.

## 3. Desired end state

At 5.0.0 GA (est. 2027-04-26) and continuously after it:

1. **Every PR carries a computed change class** (C-I, C-E, C-D or C-B), derived by CI from four diffs: the API Extractor report per entry, the runtime export snapshot per entry, `deprecations.json`, and the default-mode pixel diff. A human label can only *raise* the class, never lower it. A PR whose computed class is not allowed on its target branch fails.
2. **No removal happens without a prior deprecation.** Every C-B symbol, subpath, prop, prop value, CSS variable, global selector, peer range or dependency removed in 5.0 has a `deprecations.json` entry that shipped in at least one 4.x minor (4.2 or 4.3, 4.4 only if needed). The only exceptions are the §13.1 security, privacy and crash cuts, each recorded with `exception: "security" | "privacy" | "crash" | "legal"`.
3. **A visible pixel change is breaking on maintenance lines.** On `release/4.x`, a default-mode pixel diff above tolerance fails unless it carries the `visual-bug-fix` label, a release-owner approval and before/after composites. D-28's two fixes are the pre-approved examples.
4. **One deprecation source.** `deprecations.json` generates the dev warnings, the codemod coverage table, the migration guide, the release notes "Deprecated" section and the `compat` export list. No hand-written deprecation text exists anywhere else.
5. **Branches and dist-tags are fixed.** `main` → 5.x (`next` until GA, then `latest`). `release/4.x` → 4.x (`latest` until GA, then `v4-lts`). Only the tag workflow publishes, with OIDC provenance, and only when every gate is green. `npm unpublish` is never part of a rollback.
6. **The train shipped in order**: 4.1.1 trust patch → 4.2.0 bridge → 4.3.0 material preview → 5.0.0-alpha.N → beta.N → rc.N → 5.0.0 GA, each with its §14.1 entry gate recorded as a CI artifact linked from the GitHub Release.
7. **The 4→5 path is mechanical where it can be.** `npx @auraglass/cli migrate 4to5` runs 8 idempotent transforms with fixtures. On the frozen 4.x consumer fixture it produces zero TODOs on the flagship subset. Every breaking change B1–B21 has a codemod, a `compat` adapter, a supported escape hatch, or an explicit "stay on 4.x LTS".
8. **`aura-glass/compat`** re-exports every surviving 4.x name with prop adapters and once-per-symbol dev warnings for all of 5.x, plus opt-in `compat/tokens.css` and `compat/globals.css`. It is removed in 6.0 (not before 2028).
9. **4.x LTS** receives security and critical fixes for 12 months after GA (to est. 2028-04-26) on `release/4.x`, under the `v4-lts` dist-tag.
10. **The ledger is true.** CHANGELOG headings, git tags, GitHub Releases and `npm view aura-glass versions` agree for every version from 4.1.1 on, and a CI check fails on any disagreement. Historical mismatches (E-06, E-07) carry a correction note; history is not rewritten (D-32).
11. **Consumers are told in advance**, through dev warnings, `doctor --v5`, GitHub Release notes, `npm deprecate` on bad versions only, the generated migration guide, and pinned GitHub Discussions for each train stop.

## 4. Architecture

### 4.1 Change-class taxonomy (D-27)

| Class | Definition (computed) | Examples |
|---|---|---|
| **C-I** safe internal | No API report diff on any entry. No runtime export snapshot diff. No `deprecations.json` change. Default-mode pixel diff ≤ tolerance (§4.4). No change to `dependencies`/`peerDependencies`/`engines`/`exports` keys except removing a dependency proven unused by `verify-pack` | Refactors, test changes, perf fixes, docs |
| **C-I (visual fix)** | As C-I, but the pixel diff exceeds tolerance and the PR is labelled `visual-bug-fix` with release-owner approval and attached before/after composites (D-28) | Dark-mode navy text (TOKENS-THEME-05), `prefers-contrast: high`→`more` (ACCESSIBILITY-04) |
| **C-E** additive | Report diff contains only additions: new exports, new optional props, widened unions on *inputs*, new subpaths, new optional peers, new `data-ag-*` attributes, new CSS variables | `aura-glass/material` experimental (4.2), `preview="v5"` (4.3), `AuraGlassScript` |
| **C-D** deprecation | Adds a `deprecations.json` entry + `@deprecated` TSDoc (with `since` and `removeIn`) + a dev warning + either a codemod id or `automation: "manual"` with a doc anchor. **No behaviour or pixel change** | `GlassButton` deprecated in 4.3 |
| **C-D (install-level)** | A package moves from `dependencies` to `peerDependencies` with `peerDependenciesMeta.<pkg>.optional: true` on a 4.x minor. It counts as C-D, not C-B, only when **all** of these hold: (a) a `kind: dependency` entry with `since` equal to this version exists; (b) every library module that imports the package loads it lazily or behind its own subpath, and a missing install throws `Error("[aura-glass] <pkg> is now an optional peer; install it: npm i <pkg>")`, never a silent `undefined`; (c) `doctor --v5` reports undeclared direct consumer imports of it; (d) the release notes list it first. Any other dependency removal is C-B | 4.2 diet: `chart.js`, `react-chartjs-2`, `date-fns`, backend packages (architecture §14.1) |
| **C-B** breaking | Any of: a removed or renamed export, subpath or prop; a narrowed input type or widened output type; a new required prop; a changed default; a raised peer/engine floor; a removed `require` condition; a removed CSS variable or global selector; a public DOM, ARIA, `data-*` or part-structure change; a removed dependency that consumers may use transitively; default-mode pixel diff above tolerance without the visual-fix label | All of §11.1 |

Allowed classes per target:

| Target | Allowed | Notes |
|---|---|---|
| `release/4.x` patch (4.x.y) | C-I, C-I (visual fix) | plus `exception:*` entries from §13.1. One-time exception: the 4.1.1 PRD-00 seed entries (`since: "4.1.1"`, REQ-TRUST-35/-51) are allowed because 4.1.1 has no runtime warning channel, so they change no behaviour |
| `main` while `package.json` `version` is 4.x (4.1.1, 4.2.0, before the `release/4.x` cut) | as the matching `release/4.x` row | `main` follows 4.x rules until the first `5.0.0-alpha` version bump |
| `release/4.x` minor (4.2, 4.3, 4.4) | C-I, C-I (visual fix), C-E, C-D, C-D (install-level) | 4.3 is the last minor allowed to *add* a 5.0 deprecation; 4.4 exists only for late finds |
| `main` during 5.0 pre-release | all | C-B only if a `deprecations.json` entry shows a prior published 4.x `since` (REQ-REL-09). A removal whose entry is `since: "4.3.0"` therefore cannot merge to `main` until 4.3.0 is published |
| `main` 5.x minor (after GA) | C-I, C-E, C-D | |
| `main` 5.x patch | C-I | |
| 6.0 | C-B for items whose `removeIn` is `6.0.0` | `compat` removal |

Conventional-commit `!` or a `BREAKING CHANGE:` footer is cross-checked against the computed class: `!` with a computed class below C-B fails ("unjustified breaking marker"); computed C-B without `!` fails; any `!` on `release/4.x` fails the release (§14.6).

### 4.2 Pipeline

```
PR ──► build (PRD-02) ──► npm pack ──► tarball
                                  │
       ┌──────────────────────────┼─────────────────────────────┬─────────────────────┐
       ▼                          ▼                             ▼                     ▼
 api-report.mjs            export-snapshot.mjs          deprecations gate      visual-class gate
 (API Extractor per        (import each entry from      (schema, since/remove,  (default-mode cells,
  entry → etc/api/*.api.md) the packed tarball →        codemod coverage,       pixel diff vs base
                            etc/api/*.exports.json)      no-removal-without-C-D) branch baseline)
       └──────────────────────────┴───────────────┬─────────────┴─────────────────────┘
                                                   ▼
                                   classify-change.mjs → change-class.json
                                   (max class; compares with branch policy,
                                    commit `!` markers and PR labels)
                                                   ▼
                                  required status check "change-class"
```

The tag workflow (`.github/workflows/publish-npm.yml`, existing; TRUST-077/078 make it tag-triggered and OIDC-only, and this PRD extends it, see deviation 4c) calls QA's reusable `certify-release.yml` through `needs:` (SC-05; QA-096 is accepted as a PRD-01-reviewed change), re-runs the same jobs on the tag SHA, verifies the ledger, picks the dist-tag from the branch and version (§4.5) and publishes with OIDC provenance. No other path can publish: `package.json` `release` and `release:dry-run` are removed (PRD-00), and `prepublishOnly` refuses to run unless `GITHUB_ACTIONS=true` and `GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v`.

### 4.3 `deprecations.json` (single source)

Location: repo-root `deprecations.json` (SC-02, in `files`; path constant `DEPRECATIONS_PATH` in `scripts/docs/paths.mjs`). Schema: `docs/schemas/deprecations.schema.json` (JSON Schema 2020-12, owned here). TRUST-075 creates the file in 4.1.1 at `version: 1` with the §13.1 cut entries (never empty, no `schemaVersion: 0` stage). This PRD populates it in 4.2 and 4.3; other PRDs add entries by MODIFY that depends on TRUST-075 (instance) and REL-010 (schema).

```jsonc
{
  "$schema": "./docs/schemas/deprecations.schema.json",
  "version": 1,
  "entries": [
    {
      "id": "DEP-0042",                       // stable, never reused
      "kind": "export",                       // export | subpath | prop | prop-value | css-var | css-global
                                              // | peer | dependency | engine | behavior | cli | data-attr | asset
      "status": "active",                     // active (warns from `since`) | planned (since > current version; no warning yet)
      "entry": ".",                           // package entry (subpath) where the item lives
      "symbol": "GlassButton",                // or prop path "GlassButton.props.elevation", css var "--glass-blur-md"
      "since": "4.3.0",                       // first version that warns
      "removeIn": "5.0.0",                    // 5.0.0 (root) | 6.0.0 (compat)
      "compat": { "entry": "./compat", "until": "6.0.0" },   // null when the item is not in compat
      "replacement": { "entry": ".", "symbol": "Button" },   // null when deleted with no successor
      "codemod": "canonical-names",           // one of the 14 §11.2 ids (8 core + 6 area), or null
      "automation": "full",                   // full | mostly | partial | manual | none
      "breaking": ["B5"],                     // ids in the §11.1 register
      "exception": null,                      // security | privacy | crash | legal | honesty (only for §13.1 cuts)
      "message": "GlassButton is deprecated. Use Button from \"aura-glass\".",
      "doc": "https://auraglass.dev/migrate/5#dep-0042",
      "evidence": ["API-CONSISTENCY-01"]
    }
  ]
}
```

Generated artifacts (all from this file; hand edits fail CI):

| Artifact | Generator | Consumer |
|---|---|---|
| `src/internal/deprecations.generated.ts` | `scripts/release/gen-deprecations.mjs` | dev warnings (`warnDeprecated(id)`) |
| TSDoc `@deprecated` tags | checked, not generated: `check-tsdoc-deprecated.mjs` asserts every `kind: export|prop` entry has a matching tag with the same `since`/`removeIn` | IDE strike-through |
| codemod mapping data | `gen-deprecations.mjs --codemods` → `packages/cli/src/migrate/4to5/mappings/*.json` (SC-33; with the `<Component>.meta.ts` `migration` fields, the only mapping source) | PRD-18 [DX] engine DX-041 and fixture suite |
| `compat` export manifest | `gen-deprecations.mjs --compat` | PRD-18 [DX] `src/compat/index.ts` (DX-065) |
| migration guide data | `gen-deprecations.mjs --docs` → `docs/migration/5.0/deprecations.generated.md` | PRD-20 |
| release-notes "Deprecated" / "Removed" | `scripts/release/release-notes.mjs` | GitHub Release body |

### 4.4 Visual-change-is-breaking gate

- **Cells.** On `release/4.x`: the default-mode cells of the existing app-chrome visual suite (`test:visual:app-chrome`) plus the frozen 4.x consumer fixture pages, in Chromium, light and dark, at 1440×900 and 390×844, with tier and preferences forced (no runtime heuristic). On `main` after GA: the PRD-19 T0 + flagship matrix default cells. Preview cells (`data-ag-preview="v5"`) are excluded from the 4.x gate; they are C-E.
- **Diff.** `pixelmatch` with `threshold: 0.1`, anti-aliasing excluded (`includeAA: false`). A cell **changes** when >0.1% of its pixels differ (`changedRatio > 0.001`). This is the program's single visual tolerance (SC-09); QA's L7 Pixel regression lane cites this constant and defines no other. Any changed cell makes the visual class C-B on maintenance branches.
- **Exit.** A changed cell passes only if the PR has the `visual-bug-fix` label, an approving review from a `CODEOWNERS` release owner, and the generated before/after/diff composite artifact. The approval and the composite URL are recorded in `change-class.json`.
- **Where it runs.** Remote CI only, never on a developer Mac. Base/head captures come from QA's `certify-pr.yml` `regression` job (QA-031, QA-072). `.github/workflows/visual-regression.yml` is not repurposed: QA-119 deletes it on `main`, and TRUST-062's evidence-only edit lives on `release/4.x` only.

### 4.5 Branches, dist-tags and versions

| Branch | Versions | Dist-tag on publish | Created |
|---|---|---|---|
| `main` | 4.1.1, 4.2.0 until the cut; then `5.0.0-alpha.N` / `-beta.N` / `-rc.N` → 5.0.0 → 5.x | `latest` for 4.1.1/4.2.0; `next` for every pre-release; `latest` from 5.0.0 | exists |
| `release/4.x` | 4.2.x, 4.3.0, 4.3.x, 4.4.0 (if needed), 4.x LTS patches | `latest` until 5.0.0 GA; `v4-lts` after | cut from the `v4.2.0` tag (NEW) |

The workflow derives the tag; it is never typed. A pre-release version on `latest`, or a 4.x version on `next`, fails. After GA, a 4.x publish to `latest` fails unless the release owner sets the rollback override `ROLLBACK_LATEST_TO_4X=true` (a repository variable `vars.ROLLBACK_LATEST_TO_4X`, because tag-push workflows take no inputs).

**Dist-tag moves are not publishes.** npm trusted publishing (OIDC) authorizes `npm publish` only. It cannot run `npm dist-tag add`, and PRD-00 removes every token path. Three operations are therefore runbook steps that a release owner runs from an npm account with 2FA: setting `v4-lts` at GA, retagging `next` or `latest` in a rollback, and moving `latest` back to 4.x. Each step is followed by a `verify-dist-tags` job (`workflow_dispatch`, read-only `npm view aura-glass dist-tags --json`) whose output is attached to the decision record. No automation token for dist-tags is created; adding one would widen credentials and needs an explicit owner decision.

### 4.6 `aura-glass/compat` contract (implementation in PRD-18)

- Contains exactly the `deprecations.json` entries with `compat != null`: every surviving 4.x export name, mapped to its 5.0 component through a prop adapter (`src/compat/<area>/<OldName>.tsx`, re-exported from `src/compat/index.ts`, DX-065; adapters call `warnDeprecated(id)` from REL-072, SC-34); `compat/tokens.css` (about 620 read `--glass-*` → `--ag-*` aliases, generated by DS from `compat-alias-map.json`, DS-103) and `compat/globals.css` (h1–h6, `.flex`, `.grid`; PKG), both in `@layer ag.compat` (D-18).
- Never contains removed components (B3); those get `removed` codemod TODOs, a registry item (D-17), or "stay on 4.x LTS".
- Warns once per symbol per page load, in dev only, at **call** time, never at module scope (keeps the jsdom side-effect gate green). Silenced only globally via `AuraGlassProvider deprecations="silent"`.
- `adaptive` maps to `data-ag-backdrop="auto"`. Unmappable props warn and are dropped; they never throw.
- Size is reported separately and does not count toward §3.6 budgets. Every export is C-D from 5.0.0; the subpath is removed in 6.0.

### 4.7 Migration flow for a consumer

```
4.1.x ──► 4.2 (fix warnings; doctor --v5; declare transitive deps)
      ──► 4.3 (provider preview="v5" per subtree → re-baseline visuals early;
               compat/*.css opt-in; codemods --dry-run)
      ──► 5.0 (migrate 4to5 → compat for the long tail → remove compat imports before 6.0)
      └─► or stay on 4.x LTS until est. 2028-04-26
```

## 5. Exact implementation requirements

Each requirement is testable; the test or check that proves it is named in §12.

### 5.1 API reports and export snapshots

- **REQ-REL-01** TRUST-071 adds `@microsoft/api-extractor` (exact pin), `api-extractor.base.json` and `scripts/release/api-report.mjs`, and produces the 4.1.1 reports (REQ-TRUST-49). This PRD extends `scripts/release/api-report.mjs` (SC-04, overlap OV-02: TRUST creates, REL extends), which wraps API Extractor with `api-extractor.base.json` (shared with PRD-02 REQ-PKG-102). For every entry in the exports manifest (4.x: `package.json` `exports` keys with a `types` condition, which is 40 of 47 at `15b6de6f7`; 5.x: the PRD-02 manifest) it writes `etc/api/<entry-slug>.api.md`. Slugs: `.` → `index`, `./data` → `data`, `./primitives/slot` → `primitives-slot`, matching PRD-00's `etc/api/index.api.md`. `--check` mode exits 1 when any report differs from the committed one.
- **REQ-REL-02** API Extractor runs on the alias-rewritten `.d.ts` output. On 4.x, until HOOKS-UTILS-TYPES-06 is fixed, the script resolves `@/` via the `tsconfig.json` `paths` map in a temp copy; if an entry still fails to analyse, the script records `"apiReport": "unanalysable"` for that entry in `etc/api/manifest.json` and the gate relies on REQ-REL-03 for it. On `main` from 5.0.0-alpha.1, `unanalysable` fails.
- **REQ-REL-03** Extend `scripts/release/export-snapshot.mjs`, created by TRUST-072 (REQ-TRUST-50; it reads `dist/` directly). Do not add a second script. The extension adds a `--tarball <file>` mode that packs through `scripts/ci/lib/npm-pack.js` (TRUST-002, SC-06), installs the **packed tarball** into a temp project (Node ≥20.19) and writes `etc/api/<entry-slug>.exports.json`, containing the sorted runtime value export names from `await import(spec)`, the `require(spec)` export names where a `require` condition exists (35 of 47 keys, E-20), and the declared type export names from the entry's `types` file. It flags `typesRuntimeMismatch: true` when the runtime set and the type set differ, which catches the facade subpaths (PACKAGING-SSR-DX-10). The gate always uses `--tarball` mode. It can also snapshot a published version (`--tarball $(npm pack aura-glass@4.1.0)`), which is how the 4.1.0 → 4.1.1 diff is computed without a committed 4.1.0 baseline.
- **REQ-REL-04** The 4.1.1 baseline (produced by PRD-00 [TRUST] step 12, TRUST-071/072) contains `etc/api/*.api.md` for the 40 typed keys, `etc/api/*.exports.json` for all 47 4.1.x `exports` keys, and `etc/api/manifest.json`. CSS and JSON keys get an `exports.json` with `kind: "asset"` and the resolved file path only. If the PRD-00 baseline lacks the `require` names or the `manifest.json`, this PRD regenerates them in `--tarball` mode against the published `aura-glass@4.1.1` before any 4.2 PR merges.

### 5.2 `deprecations.json`

- **REQ-REL-05** Create `docs/schemas/deprecations.schema.json` exactly as §4.3. Required fields: `id` (`^DEP-\d{4}$`, unique, never reused), `kind` (enum of 13), `status` (`active` | `planned`), `entry`, `symbol`, `since` (semver), `removeIn` (`5.0.0` or `6.0.0`), `replacement` (object or null), `codemod` (enum of the 14 §11.2 ids, 8 core + 6 area, or null), `automation` (enum), `breaking` (array of `B\d+`), `message` (≤200 chars, must name the replacement when non-null), `doc` (URL with `#dep-NNNN` anchor). Optional: `compat`, `exception` (enum `security | privacy | crash | legal | honesty`; `honesty` covers retracted or simulated claims such as ContrastGuard, `validateTextContrast` and `data-meets-wcag`, SC-03), `evidence`. There is no v0 seed and no migration script (SC-02): TRUST-075 writes `version: 1` entries in this shape from the first 4.1.1 commit, and `verify-deprecations.mjs` must accept that seed unchanged. Any seed field outside the schema is fixed in TRUST-075, not by a converter here.
- **REQ-REL-06** `scripts/release/verify-deprecations.mjs` validates the file against the schema with `ajv`. `ajv` is present only transitively today (8.20.0); add it as an exact-pinned devDependency. The script fails on: duplicate ids; `status: "active"` with `since` later than the current `package.json` version; `status: "planned"` with `since` ≤ the current version (it must be flipped to `active` in the release that ships it); `removeIn ≤ since`; `codemod` referencing a transform with no fixture directory (§11.2); `kind: export` whose `symbol` is absent from the `since` version's `etc/api/*.exports.json`.
- **REQ-REL-07** `gen-deprecations.mjs` generates `src/internal/deprecations.generated.ts`, exporting `const DEPRECATIONS: Readonly<Record<DepId, { message: string; doc: string; since: string; removeIn: string }>>` for `status: "active"` entries of kinds `export | prop | prop-value | css-global | cli | data-attr`. Kinds `peer | engine | dependency | behavior | asset | css-var | subpath` have no runtime call site. They are surfaced by `doctor --v5`, the release notes and the guide, never by `warnDeprecated`. Hand edits fail via `--check`. From 4.2.0, `package.json` `exports` gains `"./deprecations.json": "./deprecations.json"` (C-E, §10), and the file stays in `files`.
- **REQ-REL-08** `src/internal/warnDeprecated.ts` (NEW) exports `warnDeprecated(id: DepId): void`. It is a no-op when `process.env.NODE_ENV === 'production'` (statically replaceable so bundlers drop the message strings), when the provider set `deprecations="silent"`, or when `id` already warned in this page load (module-level `Set`, populated only on call). Output format, one line: `[aura-glass] DEP-0042 (since 4.3.0, removed in 5.0.0): <message> Codemod: npx @auraglass/cli migrate 4to5 --transform <id>. <doc>`; the codemod clause is omitted when `codemod` is null.
- **REQ-REL-09** **No-removal-without-prior-deprecation gate.** `classify-change.mjs` fails a PR on `main` when any removed or renamed symbol, subpath, prop, prop value, CSS variable or global selector has no `deprecations.json` entry whose `since` is a **published** 4.x version ≥4.1.1 (checked with `npm view aura-glass@<since> version`) and that is present in that version's own file (`git show v<since>:deprecations.json`). This blocks entries back-dated on `main` that never shipped to 4.x consumers. The only exception is an entry with `exception` set that also appears in the §13.1 allow-list `docs/release/exception-allowlist.json` (NEW). **Forward-port rule:** every merge to `release/4.x` that changes `deprecations.json` is merged forward to `main` within the same train stop. The forward-merge PR must touch nothing but `deprecations.json` and generated files, and `verify-deprecations.mjs --compare-branch release/4.x` on `main` fails when an id exists on `release/4.x` but not on `main`.
- **REQ-REL-10** Every `kind: export | prop | prop-value` entry has a matching TSDoc `@deprecated since <since>, removed in <removeIn>. Use <replacement>.` tag in source; `check-tsdoc-deprecated.mjs` fails on missing or mismatched tags, and on `@deprecated` tags with no entry (fixes E-15/E-16).
- **REQ-REL-11** The stale "removed in v2.0.0" block (`src/types/glass-api-stable.ts:288-289`, the only hit of `rg -n "v2\.0\.0" src` at HEAD) is rewritten in 4.2 to `since 4.2.0, removed in 5.0.0`, with entries in `deprecations.json` for each symbol it covers (§13.3, HISTORY-HYGIENE-11).

### 5.3 Visual-class gate

- **REQ-REL-12** `scripts/release/visual-class.mjs` takes `--base <sha>` and `--head <sha>` capture directories produced by QA's `certify-pr.yml` `regression` job (QA-072 runs this script as its visual-class step; SC-09) and writes `visual-class.json` with, per cell, `{ cell, changedRatio, changed }`, using `pixelmatch` + `pngjs` (both NEW exact-pinned devDependencies) with `threshold: 0.1`, `includeAA: false`; a cell is `changed` when `changedRatio > 0.001`.
- **REQ-REL-13** On `release/4.x`, any `changed` default-mode cell sets the visual class to C-B unless the PR has label `visual-bug-fix`, ≥1 approving review from a release owner listed in `.github/CODEOWNERS` (NEW; no CODEOWNERS file exists today) for `/docs/release/` and a composite artifact (base | head | diff, per changed cell) uploaded by the job. The approval reviewer and artifact URL are written into `change-class.json`.
- **REQ-REL-14** On `main` before GA the visual class is informational (pre-releases may change pixels); from 5.0.0 it is enforced exactly as REQ-REL-13 on the PRD-19 default cells.

### 5.4 Classification and branch policy

- **REQ-REL-15** `scripts/release/classify-change.mjs --base <ref>` combines REQ-REL-01/03/06/12 outputs into `change-class.json` `{ class, reasons[], perEntry{}, deprecationsAdded[], removals[], visual{}, commitMarkers{} }`. `class` is the maximum of the per-source classes. It fails when `class` is not allowed for the target branch (§4.1 table), when a `!`/`BREAKING CHANGE` marker disagrees with `class`, or when the PR label `change:C-x` is *lower* than computed.
- **REQ-REL-16** `.github/workflows/change-class.yml` (NEW) runs REQ-REL-15 on every PR to `main` and `release/4.x` and is a **required** status check on both branches (branch protection recorded in `docs/release/branch-policy.md`, NEW). It posts the class and reasons as a sticky PR comment.
- **REQ-REL-17** Branch protection on `main` and `release/4.x`: no direct pushes, ≥1 approving review, linear history. Required checks use the exact check-run names: `change-class` (this PRD), `Glass Quality Gates`, `Next.js npm Integration` and `Vite npm Integration` (job names in `.github/workflows/glass-pipeline.yml:16,154,175`; SC-10: this PRD owns the names, PRD-02 [PKG] owns the file, and any rename is a co-change with this requirement). On `main` only, the PRD-02 `artifact` check is added once PKG-073 lands it; QA's certification lanes are added as new checks, never as renames. The settings are applied by a repo admin with `gh api -X PUT repos/{owner}/{repo}/branches/{b}/protection`, and the exact payload is recorded in `docs/release/branch-policy.md`. `scripts/release/verify-branch-protection.mjs` (read-only, `gh api repos/{owner}/{repo}/branches/{b}/protection`) fails when any listed check or rule is missing.
- **REQ-REL-18** Extraction and removal families land as **one revertable PR per family** (PRD-16 families). `classify-change.mjs` fails a PR that removes symbols from more than one `deprecations.json` `breaking` group unless labelled `multi-family` with a reason.

### 5.5 Release workflow, dist-tags and ledger

- **REQ-REL-19** Extend `.github/workflows/publish-npm.yml` (deviation 4c), which TRUST-077 makes trigger on `push: tags: ['v4.*.*']` (REQ-TRUST-06). The trigger widens to `v4.*.*`, `v5.*.*` and `v5.*.*-{alpha,beta,rc}.*` before 5.0.0-alpha.1. The publish job `needs:` QA's reusable `.github/workflows/certify-release.yml` (QA-034, wired by QA-096 as a PRD-01-reviewed change; SC-05). The workflow verifies four things: the tag equals `package.json` `version`; the tagged commit is reachable from `origin/main` or `origin/release/4.x` (`git merge-base --is-ancestor $GITHUB_SHA origin/<branch>`, and the branch must match §4.5 for that version); `change-class` re-run against the previous tag on the same line passes; and every gate the branch requires passes. It then runs `npm publish --provenance --access public --tag <derived>`. The npm trusted-publisher binding (`auraoneai/auraglass` + `publish-npm.yml`) is not changed.
- **REQ-REL-20** Dist-tag derivation (`scripts/release/dist-tag.mjs`, pure function, unit-tested): pre-release → `next`; `4.x` stable before 5.0.0 GA → `latest`; `4.x` stable after GA → `v4-lts`; `5.x` stable → `latest`; anything else fails. A derived `latest`/`v4-lts`/`next` publish also fails when the version is not semver-greater than that tag's current version, except under `ROLLBACK_LATEST_TO_4X=true`. After publish, the workflow asserts that `npm view aura-glass dist-tags --json` matches.
- **REQ-REL-21** PRD-00 deletes the `release`/`release:dry-run` scripts (`package.json:324-325`) and the token publish path, and adds `scripts/ci/require-ci-publish.js` (TRUST-078/079). Per SC-05 that guard already enforces the final condition, and this PRD verifies and keeps it: `prepublishOnly` exits 1 with `publishing is CI-only` unless `GITHUB_ACTIONS === 'true'` and `GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v`. If the shipped 4.1.1 guard is weaker, this PRD tightens it by MODIFY on TRUST-079's file. Local rehearsal uses `scripts/release/dry-run.mjs`, which runs `npm pack` plus the gates and never calls `npm publish`, so the guard does not block it.
- **REQ-REL-22** `scripts/release/verify-release-ledger.mjs` fails when, for any version ≥4.1.1, a CHANGELOG heading, git tag, GitHub Release or npm version is missing from any of the other three. Versions <4.1.1 are checked against `docs/release/ledger-corrections.json` (NEW), which records each known mismatch from E-06/E-07 once; the CHANGELOG gets a "Ledger corrections" note, no history rewrite.
- **REQ-REL-23** `scripts/release/release-notes.mjs` generates the GitHub Release body and the CHANGELOG section from merged PR titles, their computed class, and `deprecations.json`, with fixed headings in order: `Breaking` (5.0 only), `Deprecated`, `Added`, `Fixed`, `Visual bug fixes` (with composite links), `Security`. Any numeric claim (component counts, pass counts, sizes) must come from the release run's artifact (`claims.json`), or docs lint fails (§15.3, D-32).
- **REQ-REL-24** Rewrite `docs/release-rollback-deprecation.md` for three lines (`latest`, `next`, `v4-lts`) with the §14.6 table as executable runbook steps, a severity table S1–S3 kept from the current file, and remove the CJS and "self-hosted runtime" scope lines for 5.x.

### 5.6 Release train gates

Dates are planning estimates; a missed gate moves the date, never the gate (§14.1).

- **REQ-REL-25 (4.1.1, week of 2026-10-12)** Gate conditions:
  - Published by `publish-npm.yml` from tag `v4.1.1` with OIDC provenance (PRD-00).
  - Pipeline Validation green: either the 165 lint errors are fixed, or `auraglass/no-inline-glass` is scoped and the decision is recorded where PRD-00 REQ-TRUST-09 records it (`docs/release-rollback-deprecation.md`).
  - The `etc/api/` baseline (REQ-REL-04) and the TRUST-075 root `deprecations.json` (`version: 1`, seeded with the §13.1 cut entries; never empty) are committed.
  - "498 certified", "100% reduced motion" and "optional backend" are retracted in README, `llms.txt` and `RELEASE_NOTES_4.1.0.md`.
  - Every §13.1 cut has an entry with a non-null `exception` (`security | privacy | crash | legal | honesty`; ContrastGuard and `validateTextContrast` use `honesty`, SC-03), listed in `docs/release/exception-allowlist.json`.
  - 4.1.1 scope is exactly the SC-36 intake owned by TRUST: §13.1-class fixes and CI-only changes, including NAV E-22 (GlassCommandPalette regex escape, crash), the MOT cookie-consent fix (privacy) and FND's React 19 unit-test matrix on `release/4.x` (CI-only, C-I). Anything else is deferred to 4.2.
  - The security advisory is published *before* the tag.
  - The 4.1.0 → 4.1.1 diff must contain no removal, rename or narrowing of exports except the allow-listed §13.1 exceptions. It is computed by running `scripts/release/export-snapshot.mjs --tarball` on `npm pack aura-glass@4.1.0` and on the 4.1.1 candidate tarball. Because `classify-change.mjs` does not exist yet, the release owner records the per-entry diff and its classification in the GitHub Release.
- **REQ-REL-26 (4.2.0, 2026-11-16)** Computed class ≤ C-D (no removals in any API report or export snapshot); a `deprecations.json` entry with `since: "4.2.0"` for every §14.4 row marked "C-D since 4.2"; `doctor --v5` shipped in the 4.x CLI (DX-037); D-28 visual fixes merged as `visual-bug-fix`, and the 4.2 D-28 visual-fix list includes the two SC-36 deferrals: DS's `--glass-opacity-24/32/52/72` fix (DS-004/005) and CTL's GlassSwitch shimmer removal (CTL-154); the other SC-36 deferrals ride the 4.2 train under their owners' classes (MOT FPS-loop fix and NAV E-15 GlassWorkspaceTabs prop leak as C-I; DS `getPersona` as a C-D entry, removed in 5.0); `release/4.x` cut from `v4.2.0`; the AuraOne grep (REQ-REL-40) re-run and attached.
- **REQ-REL-27 (4.3.0, 2027-01-18)** Computed class ≤ C-D; a `deprecations.json` entry with `since ≤ 4.3.0` for **every** C-B item in §11.1 (the 5.0 removal list is frozen here); the codemod fixture suite (§11.2) green with `--dry-run` published as `@auraglass/cli@0.x` (or `aura-glass-cli` per D-23); `preview="v5"` baselines pass the T0 matrix (content `preview-v5.css` MAT-101, tested by MAT-102; captures by PRD-19 [QA]); the 4.x `aura-glass` CLI prints the `@auraglass/cli` replacement command on every invocation.
- **REQ-REL-28 (4.4.0)** Published only if a beta finds a missing deprecation; its scope is limited to C-D entries whose `breaking` id already exists in §11.1 or is added to it in the same PR.
- **REQ-REL-29 (5.0.0-alpha.N, from 2026-12)** Published from `main` to `next` only. Entry gate: PRD-04 environment matrix green for `Surface`. Each alpha's release notes list the budget calibration results (§3.6) from the remote perf lane.
- **REQ-REL-30 (5.0.0-beta.N, from 2027-02-15)** Every removal present; REQ-REL-09 green for the whole `main`-vs-`v4.3.0` diff; all PRD-19 consumer canaries green including the frozen 4.x fixture after `migrate 4to5`.
- **REQ-REL-31 (5.0.0-rc.N, from 2027-03-22)** Flagship API frozen: any further C-B in `etc/api/*.api.md` between rc.1 and GA fails unless it fixes a P0 and is listed in the RC release notes; zero open P0 issues (label `P0`); codemods produce zero errors on every canary and every registry block.
- **REQ-REL-32 (5.0.0 GA, ≥4 weeks after the first P0-free RC)** §15 lanes green on the GA SHA; claims generated from that run; `next` → `latest` promotion is the publish of `5.0.0` itself (not a retag of an RC); immediately after, the release owner runs `npm dist-tag add aura-glass@<newest 4.x> v4-lts` (runbook step, §4.5 dist-tag note), and `verify-dist-tags` confirms `latest` = 5.0.0 and `v4-lts` = newest 4.x.

### 5.7 Compat, codemods and migration guide contracts

- **REQ-REL-33** `scripts/release/verify-compat-coverage.mjs` fails when an entry with `compat != null` has no export of the same `symbol` in `etc/api/compat.exports.json`, or when `aura-glass/compat` exports any symbol with no such entry, or exports a symbol whose entry has `replacement: null` (removed components never enter compat).
- **REQ-REL-34** Every §11.2 transform (8 core and 6 area ids) has a fixture directory `packages/cli/src/migrate/4to5/__fixtures__/<id>/<case>/{input,output}.*` (SC-33; engine DX-041) with ≥3 cases (`basic`, `aliased-import`, `already-migrated` for idempotence) and, where the catalogue lists one, a `todo` case. `verify-deprecations.mjs` fails when an entry names a transform without fixtures, and when a transform claims `automation: "full"` but any fixture output contains `TODO(aura-glass 5)`.
- **REQ-REL-35** Every §11.1 breaking change B-n is referenced by ≥1 `deprecations.json` entry, including B1, B2 and B13. Those three are referenced by notice entries (`kind: peer | engine | behavior`, `codemod: null`, `automation: "manual"` or `"none"`), which produce no runtime warning (REQ-REL-07). Every B-n also has a section `#b-n` in the generated migration guide; `verify-breaking-register.mjs` fails otherwise.

### 5.8 LTS, communication and downstream

- **REQ-REL-36 (4.x LTS)** `docs/release/lts-policy.md` (NEW) states: support window 12 months from the 5.0.0 GA date; accepted classes on `release/4.x` after GA are C-I and `exception:security`; Node and React matrix frozen at the 4.3 canaries; backports require a `backport-4.x` label and a linked `main` PR or a statement that `main` is unaffected; EOL notices at GA, EOL−90 days and EOL−30 days; at EOL, `npm deprecate aura-glass@"<5" "aura-glass 4.x reached end of life on <date>; see https://auraglass.dev/migrate/5"`.
- **REQ-REL-37** `npm deprecate` is used only for (a) a bad version (runbook S1/S2), (b) 4.x at LTS EOL. It is never used to "nudge" upgrades before EOL.
- **REQ-REL-38** Consumer communication artefacts per train stop, each generated or checked by `release-notes.mjs`: GitHub Release body (§4.3 headings); a pinned GitHub Discussion "AuraGlass <version>: what changes for you" for 4.2, 4.3, 5.0.0-beta.1, 5.0.0-rc.1 and 5.0.0; a README banner block between `<!-- AG-RELEASE-BANNER -->` markers that names the current `latest`, `next` and `v4-lts` versions; the `llms.txt` "Versions" section with the same three values. `verify-release-comms.mjs` fails when any of them disagrees with `npm view aura-glass dist-tags`.
- **REQ-REL-39** 5.0.0 release notes list, first, the packages consumers may have used transitively and must now declare (`date-fns`, `chart.js`, `react-chartjs-2`, `zod`, `framer-motion`, `tailwind-merge`; `tailwind-merge` added per PRD-02 risk 1), with the `deps` codemod command (§3.4 silent-break mitigation). The 4.2.0 notes list the subset moved to optional peers in 4.2 the same way (C-D install-level rule, §4.1).
- **REQ-REL-40 (downstream grep)** `scripts/release/downstream-grep.mjs --roots <paths…>` runs the §2.4 bounded `rg` commands (fixed excludes `node_modules`, `.git`, `dist`, `.next`, lockfiles; never rooted at `$HOME` or `/`) against each given repo root and writes `downstream-report.json` `{ root, pins[], imports[{file, line, spec}], servicesImports[], removedSymbolHits[] }`, where `removedSymbolHits` matches every `deprecations.json` `symbol` with `removeIn: "5.0.0"`. Required at the 4.2 cut and at 5.0.0-rc.1, with roots `/Users/gurbakshchahal/AuraOne` plus every `platforms/*` checkout that declares `aura-glass` in a `package.json`. A non-zero `servicesImports` blocks PRD-16's extraction PR.
- **REQ-REL-41** The two AuraOne templates pinned at `3.1.1` (§2.4) get a tracked follow-up issue in that repo to move to `^4.3` (C-I for them, since they import nothing) before 5.0 GA; this PRD does not edit AuraOne.

### 5.9 Program index and task graph

- **REQ-REL-42** This PRD maintains the program index in `_shared-contracts.md` (SC-01 key crosswalk, SC-37 interim owners) and enforces SC-40 with `scripts/release/verify-task-graph.mjs` (NEW). The script reads every `docs/auraglass-5/tasks/*.json` fragment and fails when: a file is not a JSON array; a task lacks any of `id, prd, system, file, action, description, depends_on, priority, test, storybook, acceptance, status`; an id is duplicated or does not match `^(TRUST|REL|PKG|DS|MAT|A11Y|MOT|PERF|FND|CTL|OVL|NAV|DATA|AI|MED|EXP|DX|SB|QA)-\d{3}$`; a `depends_on` entry is not an existing task id (so `PRD-xx` strings fail; external gates go in an optional `gate` field); the dependency graph has a cycle; or a file path receives more than one CREATE across all fragments (SC-40 rule 5, §H overlaps). It prints per-fragment counts and runs in `change-class.yml` on PRs touching `docs/auraglass-5/**`.

## 6. Files/directories affected (existing paths)

| Path | Change | REQ |
|---|---|---|
| `.github/workflows/publish-npm.yml` | Kept (trusted-publisher binding, SC-05). TRUST-077/078 make it tag-triggered and OIDC-only in 4.1.1. This PRD adds dist-tag derivation, branch reachability, `change-class` re-run, ledger and comms checks (4.2), and the `v5.*` triggers (before alpha.1). QA-096 adds the `needs:` call to `certify-release.yml` | 19, 20, 22, 38 |
| `.github/workflows/glass-pipeline.yml` | Owned by PRD-02 [PKG] (SC-10; REL edits are MODIFY after PKG-038). Add `release/4.x` to `push`/`pull_request` branches (`:5`, `:7`); drop `develop` and `feat/glass-*` unless they exist; add the deprecations gates to the `Glass Quality Gates` job without renaming it | 16, 17 |
| `.github/workflows/certify-pr.yml` (QA, QA-031) | Not edited here. Its `regression` job (QA-072) produces the base/head captures and runs `visual-class.mjs`. `visual-regression.yml` is not repurposed (deleted on `main` by QA-119; SC-09) | 12–14 |
| `package.json` | Already done by PRD-00 in 4.1.1: `release`/`release:dry-run` removed (`:324-325`), `lint` made non-mutating (`:247`), `api:*` scripts, `files` += `deprecations.json`. This PRD tightens the `prepublishOnly` guard (`:329`, REQ-REL-21); adds exact-pinned devDeps `ajv`, `pixelmatch` and `pngjs`; adds scripts `deprecations:check` and `change:classify`; and in 4.2 adds the `./deprecations.json` exports key | 06, 07, 12, 21 |
| `CHANGELOG.md` | Generated sections from 4.1.1; "Ledger corrections" note for E-07 | 22, 23 |
| `RELEASE_NOTES_4.1.0.md`, `README.md:21`, `llms.txt` | Claim retraction (4.1.1, owned by PRD-00); README/llms.txt banner markers | 25, 38 |
| `RELEASE_NOTES_3.0.0.md`, `3.0.1`, `3.0.2`, `4.0.0`, `4.1.0` | Frozen. PRD-00's `RELEASE_NOTES_4.1.1.md` (REQ-TRUST-42) is the last root release-notes file; from 4.2.0 GitHub Releases are the release-notes home | 23 |
| `docs/release-rollback-deprecation.md` | Rewritten for three dist-tag lines | 24 |
| `reports/breaking-change-review.md` | Superseded by `etc/api/` reports; header note added, file left in history (removed from tree with the rest of `reports/` by PRD-00) | 01 |
| `src/types/glass-api-stable.ts:287-289` | Stale v2.0.0 deprecation rewritten (4.2) | 11 |
| `src/index.ts:982-986` | `interactiveGlass` helpers get a `deprecations.json` entry (4.2) | 10 |
| `scripts/ci/verify-pack.js` | The npm 11/12 `pack --json` fix is committed by PRD-00 (REQ-TRUST-02) through the shared helper `scripts/ci/lib/npm-pack.js` (TRUST-002, SC-06). `export-snapshot.mjs --tarball` and `dry-run.mjs` pack only through that helper | 03, 25 |
| `scripts/release/api-report.mjs`, `scripts/release/export-snapshot.mjs` (created by TRUST-071/072, REQ-TRUST-49/-50) | Extended: `--check`, 4x/5x modes, `--tarball` mode and `require` names | 01–04 |
| `bin/aura-glass.cjs` | 4.3: prints the `@auraglass/cli` replacement command (B15); removed from 5.0 `files` | 27 |
| `docs/guides/migration.md`, `docs/cli/migration.md`, `docs/liquid-glass/migration.md` | Point to the generated 5.0 guide; `docs/guides/consciousness-migration.md` marked obsolete (family deleted) | 35 |
| `tests/` (Jest root) | New `tests/release/` suite | §12 |

## 7. Components affected

This PRD changes no component's behaviour. It governs every public component by class:

| Group | Count source | Governance effect |
|---|---|---|
| Root-exported REMOVE + DEPRECATE records | inventory: 131 today (verified pass: 119) | Each needs a `kind: export` entry, `since: 4.2.0` (4.3.0 for late finds), `removeIn: 5.0.0`, `replacement: null` or a registry item, codemod `removed` |
| CONSOLIDATE losers (157 records, 120 root-exported) and all `Glass*` names | inventory + §12 map | Entry `since: 4.3.0`, `removeIn: 5.0.0` from root and `compat.until: 6.0.0`; codemod `canonical-names` |
| REDESIGN / REPLACE flagship lineages (§11.2 44) | §11.2 | Prop and DOM changes need `kind: prop | prop-value | data-attr` entries; codemod `prop-grammar`; B10 selector tables |
| The six 4.x glass primitives in the 4.3 preview (D-19) | §16 PRD-17 (interim REL scope; content MAT-101 `preview-v5.css`) | `data-ag-surface` attributes are C-E; preview cells excluded from the 4.x visual gate |
| KEEP/POLISH (10 / 49) | inventory | Prefix drop only (B5) |
| Providers (5 theme, `MotionPreferenceProvider`, `AuraGlassSSRProvider`) | §12 | Entries `since: 4.2.0`; codemod `providers` / `imports-subpaths` |

## 8. New components/files

All NEW (verified absent with `rg --files` on 2026-10-06). Rows marked *(TRUST)* are created by PRD-00 in 4.1.1 under this PRD's contract (SC-02/SC-04); this PRD extends them and never re-creates them (one CREATE per file, SC-40 rule 5).

| Path | Purpose |
|---|---|
| `.github/workflows/change-class.yml` | Required PR check |
| `.github/CODEOWNERS` | Release owners for `/docs/release/`, `/deprecations.json`, `/etc/api/` (REL-053 is the only CREATE; QA and others MODIFY, overlap OV-21) |
| `etc/api/<entry-slug>.api.md`, `etc/api/<entry-slug>.exports.json`, `etc/api/manifest.json` *(TRUST-071/072)* | Committed API baselines |
| `api-extractor.base.json` *(TRUST-071)* | Shared API Extractor config (per-entry configs generated in a temp dir) |
| `deprecations.json` *(TRUST-075)* | Single deprecation source (repo root) |
| `docs/schemas/deprecations.schema.json` | Schema (REL-010) |
| `docs/release/branch-policy.md`, `docs/release/lts-policy.md` | Policies |
| `docs/release/exception-allowlist.json` | §13.1 exceptions to REQ-REL-09 |
| `docs/release/ledger-corrections.json` | Pre-4.1.1 ledger mismatches |
| `docs/release/breaking-changes.json` | Machine-readable §11.1 register (ids B1–B21) |
| `docs/release/decisions/` | Release decision records (e.g. 4.1.1 lint scope) |
| `docs/migration/5.0/deprecations.generated.md` | Generated guide data for PRD-20 |
| `scripts/release/lib/paths.mjs`, `verify-deprecations.mjs`, `gen-deprecations.mjs`, `check-tsdoc-deprecated.mjs`, `visual-class.mjs`, `classify-change.mjs`, `dist-tag.mjs`, `dry-run.mjs`, `verify-release-ledger.mjs`, `release-notes.mjs`, `verify-release-comms.mjs`, `verify-compat-coverage.mjs`, `verify-breaking-register.mjs`, `verify-branch-protection.mjs`, `downstream-grep.mjs`, `verify-task-graph.mjs` | Gate scripts (all under `scripts/release/`, SC-11). `verify-task-graph.mjs` enforces SC-40 rules 1 and 5 over `docs/auraglass-5/tasks/*.json` |
| `src/internal/warnDeprecated.ts`, `src/internal/deprecations.generated.ts` | Runtime warning channel |
| `tests/release/*.test.ts`, `tests/release/fixtures/` | §12 |
| Codemod fixtures `packages/cli/src/migrate/4to5/__fixtures__/<id>/<case>/{input,output}.*` | Layout fixed by SC-33; engine and fixtures built by PRD-18 [DX] (DX-041/042/053), area-id fixtures by the area PRDs; contract here |
| `tests/fixtures/consumer-4x/` (incl. `flagship-subset.json`) | Frozen 4.x consumer fixture (REL-115, SC-08; contents contract §11.4; CI job `consumer-4x-frozen` in `certify-main.yml` is QA L11, QA-087) |

## 9. Components/files to remove or deprecate

| Item | Action | When |
|---|---|---|
| `.github/workflows/publish-npm.yml` `workflow_dispatch` free-text `version` input | Removed by PRD-00 (REQ-TRUST-06); the workflow file is kept | 4.1.1 |
| `package.json` `release`, `release:dry-run` | Remove (PRD-00 REQ-TRUST-08) | 4.1.1 |
| Token publish path (`publish-npm.yml:80-84`) | Remove; OIDC only (PRD-00 REQ-TRUST-07) | 4.1.1 |
| `reports/breaking-change-review.md` | Superseded | 4.1.1 (tree removal by PRD-00) |
| New root `RELEASE_NOTES_*.md` files | Stop creating | 4.2.0 (4.1.1's file is PRD-00's) |
| `docs/guides/consciousness-migration.md` | Remove with the family | 5.0 (PRD-16) |
| `bin` in `aura-glass` | C-D 4.3, removed 5.0 (B15) | 4.3 / 5.0 |
| `aura-glass/compat`, `compat/tokens.css`, `compat/globals.css` | C-D from 5.0.0 | removed 6.0 |
| All items in §11.1 | per `deprecations.json` | 4.2 / 4.3 → 5.0 |

## 10. API changes

Consumer-visible APIs introduced or changed by this PRD (component APIs are classified by their own PRDs and registered in §11.1).

| API | Change | Version | Class |
|---|---|---|---|
| `AuraGlassProvider` prop `deprecations?: "warn" \| "silent"` (default `"warn"`) | New; silences all `warnDeprecated` output globally. No per-call-site silencing. The prop is declared by PRD-05 [A11Y] on its provider (A11Y-029); REL-073 wires it | 4.2.0 (provider exists from 4.2 under the §16 PRD-17 bridge scope) | C-E |
| Dev console warning format `[aura-glass] DEP-NNNN (since …, removed in …): …` | New, stable; tests may match on `DEP-\d{4}` | 4.2.0 | C-E |
| `aura-glass/compat` subpath | New entry (5.0.0); every export C-D from birth | 5.0.0 | C-E (entry), C-D (exports) |
| `aura-glass/compat/tokens.css`, `aura-glass/compat/globals.css` | New opt-in CSS (4.3.0 under `styles/v5` preview, stable in 5.0) | 4.3.0 | C-E, C-D from 5.0.0 |
| `data-ag-preview="v5"`, provider `preview="v5"` | New (§16 PRD-17 scope; CSS MAT-101) | 4.3.0 | C-E |
| `@auraglass/cli migrate 4to5 [--transform <id>] [--dry-run] [--allow-todo] [--report <file>] <paths…>` | New CLI command (PRD-18) | 4.3.0 (0.x beta), 5.0.0 stable | n/a (new package) |
| `aura-glass doctor --v5` (new flag on the existing 4.x `bin/aura-glass.cjs` `doctor` command, `:1006`); same command in `@auraglass/cli doctor --v5` from 4.3 | New readiness report (spec owned by PRD-18/20 REQ-DX-25) | 4.2.0 (4.x CLI) | C-E |
| `aura-glass` `bin` | Prints the replacement command | 4.3.0 | C-D |
| `aura-glass` `bin` | Removed | 5.0.0 | C-B (B15) |
| npm dist-tags `next`, `v4-lts` | New | `next` from 5.0.0-alpha.1; `v4-lts` at GA | process |
| Publishing | CI-only, OIDC provenance; local publish refused | 4.1.1 | C-I (no consumer surface) |
| `etc/api/*.api.md`, `etc/api/*.exports.json` | Published in the repo (not the tarball) as the documented public surface | 4.1.1 | process |
| `deprecations.json` | Shipped in the tarball at `aura-glass/deprecations.json` (new `exports` key) so tools (`doctor`, IDE plugins) can read it | 4.2.0 | C-E |

## 11. Migration concerns

### 11.1 Complete breaking-change register (4.x → 5.0)

Machine-readable copy: `docs/release/breaking-changes.json`. B1–B16 are §14.5 verbatim in scope; B17–B21 close gaps found while writing this PRD (deviation 2) and are proposals for PRD-02/PRD-04 to confirm. "C-D in" is the 4.x minor where the warning first ships.

| # | Breaking change (5.0.0) | Who is affected | C-D in | Migration path | Codemod | Rollback / escape hatch |
|---|---|---|---|---|---|---|
| B1 | React peer `^19.0.0` (from `>=18 <20`, `package.json:369-380`); `element.ref` reads removed internally | React 18 apps | 4.3 notice entry `kind: peer` | Upgrade React (`npx types-react-codemod` for `@types/react` 19), or stay on 4.x LTS | none (consumer `forwardRef` untouched) | 4.x LTS |
| B2 | ESM-only, `"type":"module"`, no `require` conditions; `engines.node >=20.19` (from `>=18.18.0`) | CJS / Jest-CJS consumers, Node 18 | 4.3 notice entry `kind: engine` | Node ≥20.19 `require(esm)`; Jest `transformIgnorePatterns` for `aura-glass` or Jest ESM mode; documented recipes per tool | none | 4.x LTS; a CJS build is a 5.x contingency only if beta canaries prove the need (D-03) |
| B3 | Removed components: every root-exported REMOVE/DEPRECATE record (131 in the current inventory, 119 in the verified pass; the gate uses the API snapshot) | users of those exports | 4.2 (4.3 for late finds) | `removed` TODOs with a reason; registry items for Kanban, Gantt, TransferList, SchemaViewer, CodeSurface, RichText, DiffViewer (D-17); labs residents (§13.4) | `removed` | 4.x LTS; registry item |
| B4 | Removed subpaths: `./navigation`, `./overlays`, `./marketing`, `./workflows`, `./workspace`, `./client`, `./ssr`, `./server`, `./registry`, `./services/ai/{config,cache-service,openai-service,vision-service}`, `./services/websocket/collaboration-service`, `./hooks/useGlassProbes`, `./tokens/keyframes`, `./core/mixins/glassMixins`, `dist/esm` deep paths. `./forms` and `./data` are reborn as real entries with **different** contents | subpath users | 4.2 | `imports-subpaths` rewrites to `.`, `./app-shell`, `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./motion`; deletes `ssr`/`server`/`client` imports | `imports-subpaths` | 4.x LTS |
| B5 | Names: `Glass` prefix dropped, the 90 aliases and 35 duplicated names removed, CONSOLIDATE losers mapped (§12) | everyone | 4.3 | `canonical-names`; `aura-glass/compat` for anything not mechanically mappable | `canonical-names` | `compat` until 6.0 |
| B6 | Prop grammar (SC-24): `variant` unions (61–91 values) → material axis `regular \| clear \| identity` (D-06, default `regular`); `elevation` and material-selecting values → `variant`/`thickness`/`prominent` (D-07); semantic status stays on `intent` (`neutral\|info\|success\|warning\|danger` subsets; tints text/rim/specular only); no `material`, `elevation` or `as` props (`render` instead); `data-ag-button-variant` → `data-ag-intent`; `size`, `radius`, `error`; `onChange` → `onValueChange`. Button: `primary` → `prominent`, `secondary` → `variant="regular"`, `ghost` → `variant="identity"`, `danger` → `intent="danger"` | most call sites | 4.3 | per-component tables from the flagship PRDs (FND wrapping pattern owns the grammar); unmapped values get TODOs | `prop-grammar` | `compat` prop adapters |
| B7 | Dependency diet: 24 → 4 runtime deps (§3.4); `framer-motion`, `chart.js`, `react-chartjs-2`, `date-fns`, `zod`, `tailwind-merge`, `openai`, `redis`, `@google-cloud/vision`, `@sentry/react` peers removed or made optional | undeclared transitive users | 4.2 (moved to optional peers) | declare them directly; `doctor` lists undeclared use | `deps` | 4.x LTS |
| B8 | Global CSS removed (`h1`–`h6`, `.flex`, `.grid`, Storybook shim); CSS in `@layer ag.*`, zero `!important` (D-24) | apps relying on library globals or on out-specifying library CSS | 4.3 | `compat/globals.css`; app utilities now win by layer order | none (CSS) | `compat/globals.css` until 6.0 |
| B9 | `--glass-*` → `--ag-*` (about 620 read variables) | consumer CSS | 4.3 | `css-vars`; `compat/tokens.css` aliases | `css-vars` | `compat/tokens.css` until 6.0 |
| B10 | Base UI DOM, ARIA and `data-*` changes; part structure via `data-ag-part`, state via `data-state` | consumer CSS and tests targeting internals | 4.3 (`kind: data-attr` entries per flagship) | per-component selector tables (old selector → `[data-ag-part=…]`) generated by the flagship PRDs | none (selectors in consumer tests are not rewritten) | 4.x LTS |
| B11 | New default material: every surface changes pixels | everyone visually | 4.3 (preview) | opt into `preview="v5"` per subtree in 4.3 and re-baseline; `data-ag-transparency="tinted\|solid"` per subtree | none | `data-ag-transparency`; 4.x LTS |
| B12 | Content layer (Card, Table, Thread, form panels) is `content-raised`/`content-sunken`, not glass, by default (D-08) | apps expecting glass cards | 4.3 | `variant="regular"` over a declared media backdrop | none | explicit `variant` |
| B13 | OS accessibility signals are floors; reduced motion and forced colors cannot be overridden by app or user settings (D-11) | apps forcing glass or animation | 4.3 notice `kind: behavior` | none: accessibility fix | none | none by design |
| B14 | Server, `services/*`, simulated AI removed (D-30); `aura-glass/ai` is presentational | `services/*` users (AuraOne: 0, §2.4) | 4.2 | `auraglass-server-archive` pointer; route generation through Kiro Prism in the app | `removed` | 4.x LTS |
| B15 | CLI moved to `@auraglass/cli`; `aura-glass` has no `bin` (D-22) | CLI users | 4.3 | `npx @auraglass/cli …` | none | 4.x CLI |
| B16 | `ssr`/`server` shims removed (`AuraGlassSSRProvider` renders a fragment) | SSR wrapper users | 4.2 | deletion is behaviour-preserving | `imports-subpaths` | n/a |
| B17 | CSS and token asset subpaths renamed: `./styles` → `./styles.css`; `./tokens/css` → `./tokens.css`; `./tokens/tailwind` (JS theme) → `./tailwind.css` (Tailwind v4 bridge). **Proposal** | CSS importers, Tailwind v3 users | 4.3 | `imports-subpaths` rewrites CSS imports in JS/TS and `@import` in CSS; Tailwind v3 users stay on 4.x or move to v4 | `imports-subpaths` | 4.x LTS |
| B18 | Granular primitive subpaths `./primitives/{slot,portal,focus,dismissable-layer,roving-focus,positioning}` collapse into `./primitives` (§3.2 lists only `./primitives`). **Proposal** | deep primitive importers | 4.3 | `imports-subpaths` | `imports-subpaths` | 4.x LTS |
| B19 | `./icons/<category>` (8 category barrels) replaced by `./icons/<name>` per glyph. `./utils/env` (SSR helpers `isBrowser` etc., no `require` condition) is removed with no public successor, because consumers use their own `typeof window` checks. `./tokens/json` and `./tokens/manifest` are removed with no 5.0 entry (SC-12, PRD-02 [PKG] decision; DS requests no JSON artifact row). **Proposal** for the icon and `utils/env` rows | icon category importers; `utils/env` and token JSON importers | 4.3 | `imports-subpaths` splits category imports into per-glyph imports. `utils/env`, `tokens/json` and `tokens/manifest` imports get a `removed` TODO | `imports-subpaths`, `removed` | 4.x LTS |
| B20 | Dead optical props removed: `ior`, `caustics`, `refraction` (4.x meaning; 5.0 `refraction` is a new opt-in boolean on flagship chrome), `chromatic`, `quality`, `tier` | call sites using them | 4.2 | removal changes no pixels (props were no-ops) | `dead-optical-props` | n/a |
| B21 | Theme and motion providers replaced by `AuraGlassProvider` + `AuraGlassScript`; 10 reduced-motion detectors → `usePreference('motion')` | every app root | 4.2 (old providers wrap `AuraGlassProvider`) | `providers` adds `AuraGlassScript` to Next `app/layout.tsx` | `providers` | `compat` exports the old provider names until 6.0 |

### 11.2 Codemod catalogue (`npx @auraglass/cli migrate 4to5`; implementation PRD-18 [DX])

This PRD owns the id catalogue and the schema enum (SC-33). DX implements the engine at `packages/cli/src/migrate/4to5/{index.ts, catalogue.json, transforms/<id>.ts, mappings/*.json, __fixtures__/<id>/<case>/{input,output}.*, __tests__/}` (DX-041 engine, DX-042 machine copy of this table). Ids are kebab-case in one flat namespace. Mapping data comes only from the generated `mappings/*.json` (`gen-deprecations.mjs --codemods`) and the `migration` fields in `<Component>.meta.ts`. Repo-internal codemods (for example `forwardref-to-ref-prop`) live in `scripts/codemods/internal/` and are not catalogue ids.

Common contract for every transform: idempotent (running twice = running once, asserted by an `already-migrated` fixture); keeps the 4.x write safety (`ensureInsideCwd`, `--dry-run`, refusal on a dirty git tree); emits a JSON change report (`--report`); never guesses: an unmapped value becomes `// TODO(aura-glass 5): <reason>, see <doc>`; preserves `aria-*`, `data-testid`, `className`, `style`, `ref` and spread props verbatim. File types: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, plus `.css`, `.scss`, `.module.css` for `css-vars` and B17 `@import`s. Default run order: `imports-subpaths` → `providers` → `canonical-names` → `prop-grammar` → `dead-optical-props` → `css-vars` → `deps` → `removed`.

| Id | Input (4.x) | Output (5.0) | Automation | Required fixture cases (`<transform>/<case>/{input,output}`) |
|---|---|---|---|---|
| `imports-subpaths` | `import { GlassDataTable } from 'aura-glass/data'` (facade), `'aura-glass/workflows'`, `'aura-glass/workspace'`, `'aura-glass/navigation'`, `'aura-glass/overlays'`, `'aura-glass/marketing'`, `'aura-glass/ssr'`, `'aura-glass/server'`, `'aura-glass/client'`, `'aura-glass/styles'`, `'aura-glass/tokens/css'`, `'aura-glass/primitives/slot'`, `'aura-glass/icons/action'`; `<AuraGlassSSRProvider>{children}</AuraGlassSSRProvider>` | Real subpaths per §3.2 (`./data`, `./app-shell`, `./date`, `./ai`, `./media`, `./backdrops`, `./motion`, `./primitives`, `./icons/<name>`); `'aura-glass/styles.css'`; SSR wrapper unwrapped to `{children}`; `ssr`/`server`/`client` imports deleted | full | `basic`, `aliased-import`, `already-migrated`, `ssr-wrapper-unwrap`, `css-import` (B17), `icon-category-split` (B19), `mixed-root-and-subpath` |
| `canonical-names` | `import { GlassButton as Btn, GlassModal } from 'aura-glass'`; JSX `<GlassModal>`; the 90 aliases; CONSOLIDATE losers (§12) | `import { Button as Btn, Dialog } from 'aura-glass'`; when the prop mapping is not mechanical: `import { GlassModal } from 'aura-glass/compat'` + TODO | full where mechanical; else compat + TODO | `basic`, `aliased-import`, `already-migrated`, `namespace-import` (`import * as AG`), `re-export` (`export { GlassButton } from 'aura-glass'`), `compat-fallback`, `todo` |
| `prop-grammar` | `<Button variant="primary" elevation={2} onChange={f}>`, `<Button variant="secondary">`, `<Button variant="ghost">`, `<Button variant="danger">`; per-component tables from flagship PRDs | Button per SC-24: `primary` → `<Button variant="regular" prominent onValueChange={f}>` (`elevation` dropped or mapped to `thickness` per the flagship table), `secondary` → `variant="regular"`, `ghost` → `variant="identity"`, `danger` → `intent="danger"` (status only, never material); other components map by their flagship PRD's table (no value invented here); unmapped `variant="aurora"` → TODO; any 4.x `material` prop → TODO (no 5.0 `material` prop) | mostly | `basic`, `already-migrated`, `spread-props-untouched`, `dynamic-value` (`variant={v}` → TODO, unchanged), `onchange-signature`, `button-variant-map` (all four Button values), `todo` |
| `dead-optical-props` | `<Glass ior={1.5} caustics chromatic quality="ultra" tier="high">` | props removed; no other change | full (no pixel change) | `basic`, `already-migrated`, `spread-props-untouched`, `new-refraction-not-removed` (5.0 `refraction` boolean on flagship chrome is kept) |
| `providers` | root `<ThemeProvider>`, `<GlassThemeProvider>` from `aura-glass/theme`, `<MotionPreferenceProvider>` and the remaining theme providers enumerated by PRD-05 (5 in total, §12), nested combinations; Next `app/layout.tsx` | One `<AuraGlassProvider>` with merged props; `<AuraGlassScript />` inserted in `<head>` of `app/layout.tsx` (once) | full | `basic`, `nested-providers`, `already-migrated`, `next-layout-script`, `pages-router-document` (`pages/_document.tsx`) |
| `css-vars` | `var(--glass-blur-md)` in `.css`, CSS modules, `style={{ '--glass-tint': x }}`, template literals | `var(--ag-…)` per the `compat/tokens.css` alias table; computed names (`` `--glass-${k}` ``) listed in the report, unchanged | full for literals; report for computed | `basic-css`, `css-module`, `inline-style-object`, `template-literal-computed` (report only), `already-migrated` |
| `deps` | Consumer files importing `date-fns`, `chart.js`, `react-chartjs-2`, `zod`, `framer-motion`/`motion`, `tailwind-merge` without declaring them | Adds them to the nearest `package.json` `dependencies` at the version currently resolved in the lockfile (never `latest`); prints the install command; does not run it | full | `basic`, `already-declared`, `workspace-nearest-package-json`, `no-lockfile` (adds with a TODO in the report, not a guessed range) |
| `removed` | Imports of deleted components (B3, B14), e.g. `GlassQuantumField`, `GlassEyeTracking`, `services/ai/openai-service` | Import kept, `// TODO(aura-glass 5): <reason from deprecations.json>, see <doc>`; registry-item pointer for D-17 items (`npx @auraglass/cli add kanban`). The run exits 1 with the list unless `--allow-todo` | partial, by design | `basic`, `registry-pointer`, `services-import`, `allow-todo-exit-0`, `already-annotated` |

Fixture rules: one directory per case; `input` and `output` are complete compilable files (type-checked against the 4.x and 5.0 `.d.ts` respectively in CI); every case is also run twice to assert idempotence. The catalogue table above is the minimum set; PRD-18 may add cases but not remove them.

**Registered area ids (SC-33).** These six ids are part of the same flat namespace and the schema `codemod` enum. Each area PRD owns its transform content and fixtures under the same engine layout; DX owns the engine and registration. They run after the 8 core ids, before `removed`.

| Id | Owner | Scope | Minimum fixture cases |
|---|---|---|---|
| `ai-chat` | AI | 4.x chat/assistant components and props → `aura-glass/ai` presentational API | `basic`, `already-migrated`, `todo` |
| `app-shell-slots` | NAV | 4.x `GlassAppShell`/workspace layout props → `aura-glass/app-shell` slots | `basic`, `already-migrated`, `todo` |
| `reduced-motion-initial` | MOT | reduced-motion `initial`/animate overrides → preference-driven motion | `basic`, `already-migrated`, `todo` |
| `motion-imports` | MOT | `framer-motion`/4.x motion helper imports → `aura-glass/motion` | `basic`, `already-migrated`, `todo` |
| `motion-props` | MOT | 4.x animation props → motion tokens/presets | `basic`, `already-migrated`, `todo` |
| `media-backdrops` | MED | 4.x media/background components → `aura-glass/media` and `aura-glass/backdrops` | `basic`, `already-migrated`, `todo` |

`deprecations.json` `codemod` must be one of the 14 ids or null.

### 11.3 Deprecation timeline (all entries live in `deprecations.json`)

| Item | C-D since | Removed from root | Removed from compat |
|---|---|---|---|
| Backend `services/*`, `useGlassProbes`, backend deps | 4.2.0 | 5.0.0 | never in compat |
| Dead optical props (B20) | 4.2.0 | 5.0.0 | never in compat |
| Old theme and motion providers (B21) | 4.2.0 | 5.0.0 | 6.0.0 |
| Alias and shim subpaths (B4, B16) | 4.2.0 | 5.0.0 | never in compat |
| REMOVE/DEPRECATE components (B3) | 4.2.0 (4.3.0 late) | 5.0.0 | never in compat |
| Stale "v2.0.0" deprecations (E-15) | 4.2.0 (rewritten) | 5.0.0 | never |
| `Glass*` names, aliases, CONSOLIDATE losers (B5) | 4.3.0 | 5.0.0 | 6.0.0 |
| Prop grammar (B6) | 4.3.0 | 5.0.0 | 6.0.0 (adapters) |
| `--glass-*` vars, global `h1`–`h6`/`.flex`/`.grid` (B8, B9) | 4.3.0 | 5.0.0 (`styles.css`) | 6.0.0 (`compat/*.css`) |
| Asset and granular subpaths (B17–B19) | 4.3.0 | 5.0.0 | never |
| `aura-glass` `bin` (B15) | 4.3.0 | 5.0.0 | n/a |
| React 18, CJS, Node <20.19 (B1, B2) | 4.3.0 (notice) | 5.0.0 | n/a |
| `aura-glass/compat` itself | 5.0.0 | — | 6.0.0 (not before 2028) |

### 11.4 Frozen 4.x consumer fixture (contents contract; owner REL, harness PRD-19 [QA])

`tests/fixtures/consumer-4x/` (SC-08; REL-115 is the only CREATE, and PKG, DS, DATA and QA consume it, never a second copy such as `canaries/v4-frozen/`) is a Next 15 + React 19.0 app and a Vite + React 18.3 app, installed from the **packed** tarball, that use: 30 root exports spanning every §12 family row (at least `GlassButton`, `GlassModal`, `GlassTabs`, `GlassSelect`, `GlassInput`, `GlassDataTable`, `GlassCard`, `GlassToast`, `GlassTooltip`, `GlassSidebar`, `GlassAppShell`, plus `AuroraBackground` from `aura-glass/marketing`), 3 aliases, every surviving subpath, `aura-glass/styles` + `aura-glass/tokens/css`, 10 literal `--glass-*` reads, one `h1`/`.flex` global reliance, `elevation`/`intent`/`onChange` props and one theme provider. Every third-party package the fixture imports directly (including the one `date-fns` import that PRD-11/12 data asks for) is declared in the fixture's own `package.json`. Otherwise the 4.2 optional-peer move would break the "unchanged" assertion. The undeclared-import warning path is proven separately by `doctor --v5` on a `tests/release/fixtures/undeclared-deps/` variant. It is frozen when it merges to `release/4.x` at §20 step 8 (REL-116; it cannot be frozen at the 4.1.1 tag because it is built after 4.1.1): from then on any edit requires a release-owner approval through `CODEOWNERS`. `flagship-subset.json` lists the files that make up the flagship subset. The CI job `consumer-4x-frozen` in `certify-main.yml` belongs to QA lane L11 Consumer canaries (QA-087). Assertions: on every 4.x minor and patch it builds, renders and its default-mode cells pass the visual-class gate unchanged; on 5.0 it passes `next build` and the Vite build after `migrate 4to5` with zero TODOs on the flagship subset.

### 11.5 Rollback (executable steps in `docs/release-rollback-deprecation.md`)

| Failure | Rollback | Forward fix |
|---|---|---|
| Bad 4.x release before GA | `npm dist-tag add aura-glass@<prev> latest`; `npm deprecate aura-glass@<bad> "<message>"` | patch on `release/4.x` |
| Bad 4.x LTS patch after GA | `npm dist-tag add aura-glass@<prev> v4-lts` + deprecate | LTS patch |
| Bad 5.0 pre-release | release owner runs `npm dist-tag add aura-glass@<previous pre-release> next` (runbook) | next pre-release |
| Bad 5.0 GA | Release owner runs `npm dist-tag add aura-glass@<current v4-lts> latest` (runbook step; npm 2FA account, see the dist-tag note in §4.5); 5.0.0 stays installable at its exact version. A 4.x fix published while rolled back needs `ROLLBACK_LATEST_TO_4X=true` on the workflow | 5.0.1 |
| enhanced-tier regression | `tier="standard"` on the provider or `data-ag-tier="standard"` per subtree | 5.x patch |
| Material unreadable on a backdrop | `data-ag-transparency="tinted\|solid"` per subtree | raise the floor in `MaterialSpec` |
| Codemod damage | dirty-tree refusal guarantees `git checkout .` restores; re-run one `--transform` | codemod patch + new fixture |
| Removed item needed | 4.x LTS or a registry item | promote in 5.x (C-E) |

`npm unpublish` is not a rollback step (exception: an exposed secret or legal emergency, per the current runbook, release-owner action).

### 11.6 Migration risks

- **Silent transitive breaks (B7)** are the most likely failure; mitigated by 4.2 optional peers, `doctor`, the `deps` transform and REQ-REL-39.
- **Visual re-baselining (B11)** hits every consumer's screenshot tests; 4.3 `preview="v5"` lets them re-baseline per subtree a full minor ahead.
- **Low consumer visibility** (about 156 downloads/week, no telemetry): the LTS window is fixed at 12 months and only extended (never shortened) from opt-in `doctor` reports and issues.
- **Inventory drift** (E-25): counts in docs are generated from `etc/api/*.exports.json`, never typed.

## 12. Tests required

All Jest tests live in `tests/release/` (NEW) and run with the existing `jest` runner (`package.json:269`). Fixture repos live in `tests/release/fixtures/`. Heavy jobs (pack-and-install, visual capture) run in remote CI only. `tests/release/export-snapshot.test.ts` and `tests/release/deprecations-seed.test.ts` are created by TRUST-074/TRUST-076 for 4.1.1; this PRD extends them with the cases below and creates no second file.

| Test file | Asserts | REQ |
|---|---|---|
| `tests/release/api-report.test.ts` | Running `api-report.mjs --check` on an unchanged fixture exits 0; adding an export to a fixture entry makes the diff non-empty and classified C-E; removing one is C-B; an `@/` alias in a fixture `.d.ts` yields `unanalysable` on a 4.x-mode run and a failure on a 5.x-mode run | 01, 02 |
| `tests/release/export-snapshot.test.ts` | On a fixture tarball whose `./data` `types` points at a narrow file but whose runtime resolves to the root, `typesRuntimeMismatch` is `true`; the snapshot is sorted and stable across two runs (byte-identical) | 03, 04 |
| `tests/release/deprecations-schema.test.ts` | The schema rejects: duplicate id, `id` not matching `^DEP-\d{4}$`, `removeIn ≤ since`, unknown `kind`, unknown `codemod`, `message` >200 chars, a non-null `replacement` whose symbol is absent from `message`; accepts the §4.3 example, `exception: "honesty"` and each of the 14 codemod ids | 05, 06 |
| `tests/release/deprecations-gen.test.ts` | `gen-deprecations.mjs --check` fails after a hand edit of `deprecations.generated.ts`; the generated compat manifest equals the set of entries with `compat != null` | 07, 33 |
| `tests/release/warn-deprecated.test.ts` | `warnDeprecated('DEP-0001')` called 3 times logs exactly once with the REQ-REL-08 format (regex `^\[aura-glass\] DEP-\d{4} \(since \d+\.\d+\.\d+, removed in \d+\.\d+\.\d+\): `); logs 0 times with `NODE_ENV=production`; 0 times under `<AuraGlassProvider deprecations="silent">`; importing the module registers no listener, timer or console output (jsdom spy) | 08 |
| `tests/release/warn-deprecated-prod-strip.test.ts` | A production Vite build of a fixture calling a deprecated export contains none of the `DEPRECATIONS` message strings (grep on output chunks) | 08, §16 |
| `tests/release/tsdoc-deprecated.test.ts` | `check-tsdoc-deprecated.mjs` fails on a fixture with an entry but no `@deprecated` tag, on a tag with a mismatched `since`, and on a tag with no entry; `src/types/glass-api-stable.ts` no longer contains `v2.0.0` after 4.2 | 10, 11 |
| `tests/release/no-removal-without-deprecation.test.ts` | Removing a fixture export with no entry → fail; with an entry whose `since` is unpublished (mocked `npm view` 404) → fail; with a published `since` → pass; with `exception: "security"` listed in `exception-allowlist.json` → pass; not listed → fail | 09 |
| `tests/release/visual-class.test.ts` | Two identical PNGs → `changed: false`; a 1440×900 pair differing in 0.05% of pixels → `false`; in 0.2% → `true`; anti-aliased edge-only difference → `false`; output JSON shape | 12 |
| `tests/release/classify-change.test.ts` | Table-driven: each §4.1 class from synthetic inputs; max-class combination; `release/4.x` + C-B → fail; `release/4.x` + changed cell + `visual-bug-fix` + approval → C-I (visual fix); same without approval → fail; `feat!:` with computed C-E → fail; computed C-B without `!` → fail; label `change:C-I` on computed C-E → fail; two removal families without `multi-family` → fail. Install-level cases: a dependency moved to an optional peer on `release/4.x` with a matching `kind: dependency` entry and the named install error → C-D (install-level), pass; the same move without the entry → C-B, fail; a dependency removed from both `dependencies` and `peerDependencies` → C-B. A 4.x-version PR on `main` with a removal → fail. A `main` removal whose entry is `since: "4.3.0"` while `npm view aura-glass@4.3.0` returns 404 → fail | 09, 13, 15, 18 |
| `tests/release/deprecations-seed.test.ts` | The TRUST-075 root `deprecations.json` has `$schema` and `version: 1`, no `schemaVersion` key, ≥1 entry, every entry passes the schema unchanged, and the ContrastGuard/`validateTextContrast` entries use `exception: "honesty"`; no `scripts/release/migrate-deprecations-v0.mjs` and no `docs/deprecations.json` exist. An `active` entry with `since` later than the current version fails; a `planned` one passes | 05, 06 |
| `tests/release/deprecations-forward-port.test.ts` | `verify-deprecations.mjs --compare-branch` against fixture git refs fails when an id exists on the `release/4.x` ref but not on `main`, and when a `main` entry's `since` tag file lacks the id | 09 |
| `tests/release/dist-tag.test.ts` | `distTag('4.1.1', {gaPublished:false})==='latest'`; `('4.3.2',{gaPublished:true})==='v4-lts'`; `('5.0.0-beta.3')==='next'`; `('5.0.0')==='latest'`; `('5.1.0')==='latest'`; `('4.4.0',{gaPublished:true, rollback:true})==='latest'`; `('3.9.9')` throws | 20 |
| `tests/release/prepublish-guard.test.ts` | `npm publish --dry-run` with `GITHUB_ACTIONS` unset exits non-zero with message `publishing is CI-only`; with `GITHUB_ACTIONS=true` but `GITHUB_WORKFLOW_REF` naming another workflow it also exits non-zero; `package.json` has no `release` or `release:dry-run` script; no file under `.github/workflows/` references `secrets.NPM_TOKEN` or `NODE_AUTH_TOKEN` | 21 |
| `tests/release/release-ledger.test.ts` | Mocked sources where CHANGELOG has `4.1.2` but npm does not → fail; a pre-4.1.1 mismatch listed in `ledger-corrections.json` → pass; unlisted → fail | 22 |
| `tests/release/release-notes.test.ts` | Generated body has headings in the fixed order; a numeric claim without a `claims.json` source fails; the 5.0.0 body lists `date-fns`, `chart.js`, `react-chartjs-2`, `zod`, `framer-motion`, `tailwind-merge` first under `Breaking` | 23, 39 |
| `tests/release/release-comms.test.ts` | README banner, `llms.txt` "Versions" and mocked `npm view … dist-tags` disagree → fail; agree → pass | 38 |
| `tests/release/compat-coverage.test.ts` | Compat export without entry → fail; entry with `compat` but no export → fail; compat export with `replacement: null` → fail | 33 |
| `tests/release/codemod-catalogue.test.ts` | Every transform id in §11.2 has a fixture directory with the required cases; `automation: "full"` entries have no `TODO(aura-glass 5)` in any fixture output; every case is idempotent (run twice, byte-identical). Runs against PRD-18's fixture root | 34 |
| `tests/release/breaking-register.test.ts` | `docs/release/breaking-changes.json` contains B1–B21; each id (B1, B2, B13 included, via notice entries) is referenced by ≥1 deprecation entry; each has an anchor in the generated guide | 35 |
| `tests/release/downstream-grep.test.ts` | Against a fixture tree with a pinned `package.json`, a `from 'aura-glass/services/ai/openai-service'` import and a `node_modules` copy: reports 1 pin, 1 services import, ignores `node_modules`; refuses `--roots $HOME` and `/` | 40 |
| `tests/release/branch-protection.test.ts` | With a mocked `gh api` response missing `change-class` in required checks → fail | 17 |
| `tests/release/task-graph.test.ts` | `verify-task-graph.mjs` fails on fixture fragments with: a `PRD-08` string in `depends_on`; a dependency on a missing id; a duplicate id; a missing field; a 2-task cycle; two CREATE tasks on one file. Passes on a clean fixture | 42 |
| CI job `change-class` (`.github/workflows/change-class.yml`) | Runs on every PR; required check on `main` and `release/4.x` | 16 |
| CI job `consumer-4x-frozen` (`certify-main.yml`, QA L11, QA-087) | §11.4 assertions on every `release/4.x` PR and on 5.0 pre-releases after `migrate 4to5` | 26–32 |

## 13. Storybook requirements

Storybook is not a release gate by itself (evidence is CI artifacts, D-32), but it is the consumer-facing migration preview.

- **SB-REL-1** Every story whose component has a `deprecations.json` entry shows a `Deprecated since <since> · removed in <removeIn>` badge (Storybook `tags: ['deprecated']` plus a docs-page banner), generated from `deprecations.json` by the SB docs blocks (`<MigrationTable>` in `.storybook/contract/docs-blocks.tsx`, SB-078), which read `gen-deprecations.mjs --storybook` output. No hand-written badges.
- **SB-REL-2** 4.3 Storybook adds a toolbar global `preview: off | v5` that wraps every story in `data-ag-preview="v5"` (CSS MAT-101), so reviewers see the 4.x and 5.0 material of the six primitives on the same story. `.storybook/preview.tsx` belongs to SB (SB-048, SC-31); REL edits it only by MODIFY that depends on SB-048.
- **SB-REL-3** One MDX page per §12 family row, `Migration/<Family>`, rendered from `deprecations.json` and the flagship mapping tables: 4.x import → 5.0 import, prop table, codemod id, automation level, selector table (B10). Code snippets come from the codemod fixtures (`input`/`output`), so docs and codemods cannot diverge.
- **SB-REL-4** Dev warnings surface in the Storybook console exactly as in an app (no Storybook-only silencing), and the CI snapshot run sets `deprecations="silent"` so warnings never alter captured pixels.
- **SB-REL-5** No Storybook-only props are introduced for migration (`previewUsers`, `forceVisible`, `isStorybookDataMedia` are being removed by §13.3).

## 14. Responsive requirements

- **RESP-REL-1** The visual-class gate captures every cell at **1440×900** and **390×844** (§4.4). A change above tolerance at either viewport is a change.
- **RESP-REL-2** The 4.3 preview baselines (`preview="v5"`) are captured at both viewports before 4.3 ships, so consumers re-baselining mobile screenshots see the same cells.
- **RESP-REL-3** The frozen 4.x consumer fixture includes one mobile layout page (`GlassAppShell` with the responsive nav collapsed at 390 px) so B5/B21 migrations of app shells are proven at mobile width, and its post-`migrate 4to5` render must have no horizontal overflow at 390 px (`document.documentElement.scrollWidth ≤ 390`).
- **RESP-REL-4** The generated migration guide and Storybook migration pages are readable at 390 px: prop tables scroll horizontally inside their container, never the page.

## 15. Accessibility requirements

- **A11Y-REL-1** No migration path may lower an accessibility floor. Neither `compat` adapters nor codemods may emit props or CSS that re-enable glass or motion under `forced-colors`, `prefers-contrast: more`, `prefers-reduced-transparency` or `prefers-reduced-motion` (B13, D-11). `compat` adapters for 4.x props that forced animation or transparency (`forceVisible`, motion overrides) drop them with a warning.
- **A11Y-REL-2** Codemods preserve every `aria-*`, `role`, `id`, `htmlFor`, `tabIndex` and `data-testid` attribute byte-for-byte; asserted by a `preserve-a11y-attrs` fixture in `canonical-names` and `prop-grammar` (added to the §11.2 minimum set).
- **A11Y-REL-3** Every `compat` adapter maps the 4.x accessible-name props (`label`, `aria-label`, `title`, `ariaLabel` variants) onto the 5.0 component's accessible name; PRD-18 asserts with `@axe-core/playwright` (colour contrast on) that a compat-rendered component has the same accessible name and role as its 4.x original on the frozen fixture.
- **A11Y-REL-4** The B10 selector tables also list ARIA changes per component (e.g. 4.x `role="dialog"` on an inner div → Base UI popup part), so consumer tests that query by role know what moved. Tests by role and name are recommended over class selectors in the guide.
- **A11Y-REL-5** Deprecation warnings go only to the console; nothing is rendered into the DOM or announced.
- **A11Y-REL-6** The 4.2 D-28 visual fixes (navy dark-mode text, `prefers-contrast: more`) are classified C-I (visual fix) and must ship with before/after composites that include the measured contrast ratio per text run.
- **A11Y-REL-7** Release notes and the migration guide pass docs lint for heading order, link text and alt text (PRD-20 lint).

## 16. Performance requirements

| Metric | Budget | How measured |
|---|---|---|
| `warnDeprecated` in production | 0 bytes of message strings in production output; function body ≤150 B min+gz | `warn-deprecated-prod-strip.test.ts`; a row in `docs/size-budgets.json` checked by `scripts/ci/verify-size-budgets.mjs` (PKG-048/049, SC-15; no `size-limit`) |
| `warnDeprecated` in dev, repeat call | ≤0.01 ms per call after the first (Set lookup) | micro-benchmark in `warn-deprecated.test.ts`, median of 10,000 calls |
| `aura-glass/compat` per-symbol overhead | `import { GlassButton } from 'aura-glass/compat'` ≤ `{ Button }` budget + **2 KB** min+gz | PRD-02 per-import budget job: rows in `docs/size-budgets.json` (added by MODIFY after PKG-048), checked by `verify-size-budgets.mjs`, reported separately (does not count toward §3.6) |
| `compat/tokens.css` | ≤8 KB gz; `compat/globals.css` ≤1 KB gz | `docs/size-budgets.json` rows, `verify-size-budgets.mjs` (artifact lane) |
| `change-class` PR job wall time | ≤10 min p95 (pack + API reports + snapshot + classify, excluding the remote visual job) | GitHub Actions timing |
| API report for all entries | ≤5 min | job step timing |
| Visual-class job (4.x cells) | ≤20 min p95 on the remote runner | job timing |
| `migrate 4to5` throughput | ≥500 files/min on the frozen fixture and canaries on a 2-vCPU CI runner | `--report` timing |
| `doctor --v5` | ≤30 s on a 2,000-file repo | CLI timing in PRD-18 tests |
| `downstream-grep.mjs` | ≤60 s per root (bounded `rg`, excludes enforced) | script timeout; exits non-zero on timeout |
| Release workflow (tag → published) | ≤60 min, all gates included | workflow timing |

## 17. Acceptance criteria

| ID | Criterion (measurable) | Verified by |
|---|---|---|
| AC-REL-01 | `etc/api/manifest.json` lists all 47 4.1.x `exports` keys, each with an `.exports.json`; `npm run api:check` exits 0 on the `v4.1.1` tag | CI artifact on `v4.1.1` |
| AC-REL-02 | 4.1.1 was published by `.github/workflows/publish-npm.yml` from tag `v4.1.1` with npm provenance: `npm view aura-glass@4.1.1 --json` shows `dist.attestations`, and the provenance names `publish-npm.yml` and the tag commit. The `release` scripts and every `NPM_TOKEN` path are gone | registry + repo |
| AC-REL-03 | `change-class` is a required status check on `main` and `release/4.x` (`verify-branch-protection.mjs` exit 0) | script output |
| AC-REL-04 | Every test in §12 passes in CI on `main` and `release/4.x` | CI |
| AC-REL-05 | The 4.1.0→4.2.0 and 4.2.0→4.3.0 `change-class.json` both report class ≤ C-D with 0 removals | release artifacts |
| AC-REL-06 | `deprecations.json` has ≥1 entry for every B-id B1–B21 (B1, B2 and B13 through notice entries), and for every root-exported REMOVE/DEPRECATE/CONSOLIDATE symbol present in `etc/api/index.exports.json` at `v4.3.0`; `verify-breaking-register.mjs` exits 0 | script output |
| AC-REL-07 | At 5.0.0-beta.1, `classify-change.mjs --base v4.3.0` reports 0 removals lacking a published 4.x `since` (excluding allow-listed exceptions) | artifact |
| AC-REL-08 | 0 `@deprecated` tags in `src/` without an entry, 0 entries without a tag, 0 occurrences of `v2.0.0` deprecation text (`rg "removed in v2" src` empty) at 4.2.0 | `check-tsdoc-deprecated.mjs`, `rg` |
| AC-REL-09 | On `release/4.x`, a deliberately changed default cell (canary PR) fails `change-class`; the same PR with `visual-bug-fix` + release-owner approval passes and records the composite URL | canary PR log |
| AC-REL-10 | `npm view aura-glass dist-tags` shows: before GA `latest` = newest 4.x, `next` = newest 5.0 pre-release; after GA `latest` = 5.0.x, `v4-lts` = newest 4.x | registry |
| AC-REL-11 | `verify-release-ledger.mjs` exits 0 for every version from 4.1.1 to GA; the pre-4.1.1 mismatches E-06/E-07 are each recorded once in `ledger-corrections.json` | script output |
| AC-REL-12 | The frozen 4.x fixture passes unchanged on 4.2.0, 4.3.0 and every 4.x patch; on 5.0.0-rc.1 it passes `next build`, the Vite build and render after `migrate 4to5` with **0** TODOs on the flagship subset | PRD-19 canary artifacts |
| AC-REL-13 | `migrate 4to5` runs on every PRD-19 canary and every registry block with 0 errors, and a second run produces 0 changes (idempotence) | CI |
| AC-REL-14 | All 8 core transforms in §11.2 have every listed fixture case plus `preserve-a11y-attrs` where required, and each of the 6 registered area ids has its minimum cases; 0 `TODO(aura-glass 5)` in outputs of `automation: "full"` transforms | `codemod-catalogue.test.ts` |
| AC-REL-15 | `aura-glass/compat` exports exactly the entries with `compat != null`, 0 removed components; `import { GlassButton } from 'aura-glass/compat'` ≤ `{ Button }` budget + 2 KB gz | `compat-coverage.test.ts`; budget job |
| AC-REL-16 | A production build of the fixture contains 0 deprecation message strings | `warn-deprecated-prod-strip.test.ts` |
| AC-REL-17 | Downstream report at the 4.2 cut and 5.0.0-rc.1 attached to the release; `servicesImports` = 0 for every root before PRD-16 merges the extraction | `downstream-report.json` |
| AC-REL-18 | GitHub Release bodies for 4.1.1, 4.2.0, 4.3.0, 5.0.0-beta.1, 5.0.0-rc.1 and 5.0.0 are generated, contain 0 unsourced numeric claims, and each has a pinned Discussion link | `release-notes.test.ts`; manual check of 6 releases |
| AC-REL-19 | A rollback drill on a throwaway pre-release (`5.0.0-alpha.N`): retag `next` to the previous alpha and back, completed in ≤15 min following only the runbook | drill record in `docs/release/decisions/` |
| AC-REL-20 | `docs/release/lts-policy.md` published at GA with the EOL date (GA + 12 months) and the three notice dates | repo |
| AC-REL-21 | `verify-task-graph.mjs` exits 0 over all 19 `docs/auraglass-5/tasks/*.json` fragments (0 invalid `depends_on`, 0 duplicate ids, 0 cycles, 1 CREATE per file) before the first 4.2 PR merges | script output |

## 18. Definition of done

- Every REQ-REL-01..42 is implemented, and each has a named passing test or CI check (§12).
- AC-REL-01..21 are met, with their evidence as CI artifacts linked from the corresponding GitHub Release (none committed, D-32).
- `change-class`, `release` and the frozen-fixture job fail closed: each was shown failing on a deliberate bad input (canary PRs recorded).
- `docs/release-rollback-deprecation.md`, `docs/release/branch-policy.md` and `docs/release/lts-policy.md` are reviewed by the release owner, and the rollback drill (AC-REL-19) is done.
- The bridge content owners (MAT-101, DS-103, DX-037, MAT/MOT experimental entries; SC-37), PRD-18 and PRD-20 [DX] have consumed the contracts (schema, catalogue, register) without local copies: their CI reads `deprecations.json` and `docs/release/breaking-changes.json` directly.
- The §11.1 proposals B17, B18 and the icon/`utils/env` rows of B19 are confirmed or replaced by PRD-02/PRD-03, and the architecture §3.2 and §16 are updated to match (errata E-04, E-07).
- No local Docker, no local browser lanes, no laptop publishing were used to reach any of the above.

## 19. Dependencies

Cross-PRD task dependencies point at the owner's anchor task (SC-40), never at a `PRD-xx` string.

| PRD (§16 id [key]) | Relationship | Anchor tasks |
|---|---|---|
| PRD-00 [TRUST] trust patch | **Blocks** this PRD's 4.1.1 items. Builds the 4.1.1 instances of this PRD's contracts: `scripts/ci/lib/npm-pack.js`, the tag-triggered OIDC-only `publish-npm.yml` and its `GITHUB_WORKFLOW_REF` guard, `reports/` out of the tree, claim retractions, the `etc/api/` baseline and scripts, and the root `deprecations.json` seed at `version: 1`. Owns the 4.1.1 scope (SC-36). This PRD owns the schema, gates and later population | TRUST-002, TRUST-071, TRUST-072, TRUST-075, TRUST-077, TRUST-079, TRUST-084 (v4.1.1 tag) |
| PRD-02 [PKG] build/packaging | Exports manifest and per-entry `.d.ts` for 5.x API reports; owns `glass-pipeline.yml` and the size-budget file/gate; confirms B17–B19 | PKG-005, PKG-038, PKG-048, PKG-073 |
| PRD-03 [DS] token compiler | `--glass-*` → `--ag-*` alias table for `css-vars` and `compat/tokens.css` (B9) | DS-103 |
| PRD-04 [MAT] material | `Surface` (alpha entry gate), `preview-v5.css` for the 4.3 preview | MAT-047, MAT-101, MAT-102 |
| PRD-05 [A11Y] a11y/preferences | `AuraGlassProvider` (`deprecations` prop) and `AuraGlassScript`; provider list for `providers` | A11Y-029, A11Y-032 |
| PRD-07/14/16 [FND] and PRD-08..13 [CTL, OVL, NAV, DATA, AI, MED] | Prop grammar wrapping pattern (FND) and per-component prop-mapping (B6) and selector/ARIA (B10) tables via `<Component>.meta.ts`; PRD-16 removal families consume the no-removal gate, the one-PR-per-family rule and the downstream report | FND-005, FND-103, FND-107 |
| §16 PRD-17 bridge 4.2/4.3 (interim owner: this PRD, SC-37) | Release scope and gates are here (REQ-REL-26/27, C-D install-level rule). Content stays with its owners | MAT-101, DS-103, DX-037, A11Y-029 |
| PRD-18/20 [DX] CLI/codemods/registry/docs | Implements the §11.2 engine, fixtures, `aura-glass/compat` adapters and registry items; `doctor --v5`; renders the migration guide from `deprecations.generated.md`; docs claims lint | DX-019, DX-037, DX-041, DX-042, DX-043, DX-053, DX-060, DX-065, DX-136 |
| PRD-19 [QA] certification infra | `certify-pr.yml` regression captures and visual-class step, `certify-main.yml` `consumer-4x-frozen` (L11), `certify-release.yml`, artifact retention | QA-031, QA-032, QA-034, QA-072, QA-087, QA-096 |
| PRD-19 [SB] Storybook half | `.storybook/preview.tsx` and docs blocks (deprecation badges, migration tables) | SB-048, SB-078 |
| PERF (no §16 id) | Remote perf lane for alpha budget calibration | PERF-039 |
| Owner decisions | D-23 npm scope ownership (before 4.2); release owners named in `.github/CODEOWNERS`; the npm trusted-publisher binding stays `auraoneai/auraglass` + `publish-npm.yml` (an npm package setting that only the operator changes; agents do not change it); a release owner with an npm 2FA account for dist-tag moves (§4.5); a repo admin to apply branch protection (REQ-REL-17) | recorded as task `gate` fields, not `depends_on` (SC-40 rule 3) |

## 20. Execution order

1. **(4.1.1, delivered by PRD-00 [TRUST]; this PRD verifies)** TRUST delivers `scripts/ci/lib/npm-pack.js` and the `verify-pack.js` `pack --json` fix, the tag-triggered OIDC-only `publish-npm.yml`, the removal of the `release` scripts and token path, the `require-ci-publish.js` guard, the `etc/api/` baseline and scripts, and the root `deprecations.json` seed at `version: 1` (TRUST-002, -071, -072, -075, -077..-079). This PRD checks them against REQ-REL-04, REQ-REL-21 and REQ-REL-25 and produces the 4.1.0 → 4.1.1 tarball diff (REQ-REL-03 `--tarball` mode, run against `npm pack aura-glass@4.1.0`).
2. **(4.1.1)** Add the `exception` field values (including `honesty`) for the §13.1 cuts to `exception-allowlist.json`, and add `verify-release-ledger.mjs`, `ledger-corrections.json` and `release-notes.mjs`. 4.1.1 is published from CI with the advisory first (REQ-REL-22, 23, 25).
3. **(before any 4.2 PR merges)** Add `docs/schemas/deprecations.schema.json` and `verify-deprecations.mjs`, and validate the TRUST-075 seed unchanged (REQ-REL-05, 06). Extend `api-report.mjs` and add the `export-snapshot.mjs --tarball` mode (REQ-REL-01..04). Add `verify-task-graph.mjs` (REQ-REL-42).
4. **(before 4.2)** Verify the `prepublishOnly` guard (REQ-REL-21). Add dist-tag derivation, branch reachability and the post-publish dist-tag assertion to `publish-npm.yml` (REQ-REL-19, 20).
5. **(before 4.2)** Add `classify-change.mjs` with the API, snapshot and deprecations sources; add `change-class.yml`, `.github/CODEOWNERS` and branch protection; make `change-class` required on `main` (REQ-REL-09, 15..17).
6. **(4.2)** Add `warnDeprecated`, `gen-deprecations.mjs` and `check-tsdoc-deprecated.mjs`. Populate the 4.2 entries (B3, B4, B7 with the C-D install-level rule, B14, B16, B20, B21, stale v2.0.0) and flip the PRD-00 `planned` entries to `active`. Confirm the scope (D-23) (REQ-REL-07, 08, 10, 11). Add `visual-class.mjs` in report mode, so the D-28 fixes carry generated composites (A11Y-REL-6) before the gate is enforced.
7. **(4.2)** Run the downstream grep; publish 4.2.0; cut `release/4.x` from `v4.2.0`; extend `glass-pipeline.yml` and branch protection to it (REQ-REL-26, 40).
8. **(4.2→4.3)** Turn on the visual-class gate on `release/4.x` with QA's `certify-pr.yml` regression captures (QA-072); freeze the 4.x consumer fixture at its approved contents (REQ-REL-12..14, §11.4).
9. **(4.3)** Populate every remaining C-B entry (B1, B2, B5, B6, B8–B13, B15, B17–B19); write `breaking-changes.json`; land the codemod fixture contract with PRD-18 and publish `@auraglass/cli` 0.x; the 4.x `bin` prints the new command; publish 4.3.0 (REQ-REL-27, 33..35).
10. **(alpha, from 2026-12)** Widen the `publish-npm.yml` tag triggers to `v5.*` (REQ-REL-19). Publish `5.0.0-alpha.N` to `next` from `main`. Removals whose entries are `since: "4.3.0"` stay unmerged on `main` until 4.3.0 is published (§4.1). Make `unanalysable` API reports fatal on `main`, and run the rollback drill (REQ-REL-29, AC-REL-19).
11. **(beta, from 2027-02-15)** Enforce REQ-REL-09 over `main` vs `v4.3.0`; frozen fixture plus `migrate 4to5` in the canaries; 4.4 only if a late deprecation is found (REQ-REL-28, 30).
12. **(RC, from 2027-03-22)** Freeze the flagship API; second downstream grep; compat budget check; 0 open P0 (REQ-REL-31).
13. **(GA, est. 2027-04-26)** Publish 5.0.0 to `latest`; set `v4-lts`; publish `lts-policy.md`, release notes, Discussions and banners; turn on the 5.x visual-class gate on `main` (REQ-REL-32, 36..39).
14. **(GA+12 months, est. 2028-04-26)** 4.x EOL: final notice, `npm deprecate aura-glass@"<5"`.

## 21 Open items

Status of the REL items in `_verification-remaining-concerns.md` and of the registry decisions that touch this PRD. "Resolved" means this file now follows the registry row.

| # | Item | Status | Owner | How to close |
|---|---|---|---|---|
| OI-01 | Cross-PRD numbering (program ids vs §16; old §16 file name) | Resolved here by SC-01 (Key field, citation rule in the header) | REL (index); architecture owner (E-07) | Architecture §16 lists `AURAGLASS_*_PRD.md` names (erratum E-07) |
| OI-02 | No bridge PRD file for §16 PRD-17 | Resolved by SC-37: REL holds scope and gates; content with MAT-101, DS-103, DX-037, MAT/MOT | REL | Close when a PRD-17 file exists or the program accepts the interim split permanently |
| OI-03 | PRD-00 seed schema (`schemaVersion: 0`, reason/class/status, `attribute` kind) and the weak guard | Resolved: no v0 seed or migration; TRUST-075 writes `version: 1`; TRUST-079 uses `GITHUB_WORKFLOW_REF` (SC-02, SC-05) | TRUST | TRUST PRD and TRUST-075/077..080 apply SC-02/SC-05 (`release.yml` → `publish-npm.yml`, `docs/deprecations.json` → root). REL-012/REL-016 fail until they do |
| OI-04 | `honesty` exception value | Resolved: added to §4.3 and REQ-REL-05 (SC-03) | REL, TRUST | TRUST maps ContrastGuard/`validateTextContrast` to `honesty` |
| OI-05 | npm OIDC cannot run `npm dist-tag add` (untested claim) | Open | REL release owner | Before GA, test `npm dist-tag add` under OIDC on a throwaway pre-release; if supported, move the v4-lts/rollback steps into the workflow and record it in `docs/release/decisions/` |
| OI-06 | C-D (install-level) rule stretches "no behaviour change" | Open, needs explicit acceptance | REL release owner | Accept in a decision record before 4.2 (REL-090 gate) or defer the 4.2 dependency moves to 5.0 |
| OI-07 | B17, B18 and the icon/`utils/env` rows of B19 are proposals | Partly resolved: `./tokens/json` and `./tokens/manifest` are removed (SC-12) | PKG, DS | PKG confirms or renames the rows; architecture §3.2 updated (E-04) |
| OI-08 | Inventory drift (131/153 vs 119/145; registry erratum says 496/152) | Open | QA (5.0 inventory, SC-35); architecture owner (E-11) | Gates count only from `etc/api/*.exports.json` and the CI inventory artifact; architecture §13/§14.4 updated by E-11 |
| OI-09 | Required check names could drift | Resolved by SC-10 (REL owns names, PKG owns file; rename is a co-change) | REL, PKG | `verify-branch-protection.mjs` fails on drift |
| OI-10 | Visual tolerance is this PRD's own number | Resolved by SC-09: QA L7 cites §4.4 | REL, QA | QA PRD cites the constant |
| OI-11 | Downstream grep covers only AuraOne | Open | REL | REL-086 runs `downstream-grep.mjs` over every `platforms/*` checkout declaring `aura-glass` at the 4.2 cut and rc.1 |
| OI-12 | SC-24 Button API break (primary→prominent, secondary→regular, ghost→identity, danger→`intent="danger"`) | Applied here; **needs human confirmation** | Product owner; FND (grammar), CTL | Record the decision in `docs/release/decisions/`; CTL REQ-CTL-21 updated |
| OI-13 | SC-36 4.1.1 scope split (3 accepted, 5 deferred to 4.2) | Applied here (REQ-REL-25/26); **needs human confirmation** | TRUST; release owner | Confirm in the 4.1.1 release issue |
| OI-14 | `release/4.x` captures depend on QA's `certify-pr.yml` existing before the 4.2 cut | Open | QA | QA-031/QA-072 land on `main` before `release/4.x` is cut from `v4.2.0`; otherwise the 4.x visual gate stays report-only until they are backported |
| OI-15 | SB-REL-2 needs `.storybook/preview.tsx` on `release/4.x`, but SB-048 rewrites the 5.0 file on `main` | Open | SB, REL | SB confirms that REL-118 may edit the 4.x preview file, or provides the toolbar global through its own task |
| OI-16 | Area codemod scopes in §11.2 are summaries written here | Open | AI, NAV, MOT, MED | Each area PRD confirms its row and fixture cases |
| OI-17 | `verify-task-graph.mjs` does not exist yet | Open (REQ-REL-42, task REL-140) | REL | Land REL-140 before the first 4.2 PR; AC-REL-21 |

