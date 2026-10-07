# AuraGlass 5.0 PRD: Developer Experience (CLI, codemods, registry, docs, agent DX)

| Field | Value |
|---|---|
| Key | **DX** (program index `prd/_shared-contracts.md` SC-01). Cite this PRD as `PRD-DX`; `PRD-16` is an alias only and must never appear in `depends_on` (SC-40) |
| PRD id | **PRD-16** (program self-id, alias only; it collides with architecture §16 PRD-16 removal, which is owned by `PRD-FND`). **Numbering note:** `AURAGLASS_5_TARGET_ARCHITECTURE.md` §16 uses PRD-16 for *removal and extraction*. This document implements the architecture boundaries **PRD-18** (`PRD-18-cli-codemods-registry.md`: `@auraglass/cli`, `migrate 4to5`, eject/diff, the shadcn registry, `aura-glass/compat` adapters) and **PRD-20** (`PRD-20-docs-agent-dx.md`: docs app, guides, generated migration guide, selector tables, `llms.txt`, MCP, generated claims). Every other PRD id cited below uses **architecture §16 numbering** (PRD-01 release governance, PRD-02 build, PRD-03 tokens, PRD-16 removal, PRD-19 certification, …), because the sibling PRDs already cite "PRD-18" and "PRD-20" for this work. Where this PRD names an owner it also gives the task key (`PRD-REL`, `PRD-TRUST`, …) per SC-01; the shared contract registry wins over any text here that disagrees |
| Title | Developer experience: install-to-beautiful, CLI, codemods, registry, docs, agent DX |
| Owner area | DX (CLI + registry + docs app). Owns `packages/cli/**` (NEW), `registry/**` (NEW), `apps/docs/**` (NEW), `src/compat/**` adapters (NEW; mapping tables supplied by flagship PRDs), `llms.txt`, `packages/mcp/**` (NEW), `docs/quickstart/**` (NEW), `docs/guides/{theming,tailwind,plain-css,choosing-a-material}.md` (NEW) |
| Status | **Draft** |
| Date / baseline | 2026-10-06, `aura-glass` 4.1.0 at `15b6de6f7` |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§2 D-14, D-17, D-18, D-22, D-23, D-27, D-32; §3.1, §3.2, §4.2, §4.4, §5.5, §10, §11.2, §11.3, §13.5, §14.1–§14.6, §15.2, §15.3, §16 PRD-18/PRD-20); `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md` (DX and distribution rows, :71-72, :129); `AURAGLASS_MISSING_CAPABILITY_MAP.md` (:140-142 typed registry); `autopsy/appshell-workspace-recipes-cli.md` (APPSHELL-WORKSPACE-RECIPES-CLI-01…17); `autopsy/docs-readme.md` (DOCS-README-01…23); `autopsy/packaging-ssr-dx.md` (PACKAGING-SSR-DX-01…18); `research/competitors.md` (:13-32 shadcn CLI v4, registries, liqui-design threat); `prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` (PRD-01: §4.3 `deprecations.json`, §4.6 compat contract, §11.1 B1–B21, §11.2 codemod catalogue, §11.4 frozen fixture) |
| Related decisions | **D-22** (tooling packaging, registry, no `bin` in `aura-glass` 5.0), D-14 (prefix drop + `compat`), D-17 (removed-but-honest components become registry items), D-18 (one `compat` entry), D-23 (scope fallback `aura-glass-cli`), D-27 (`deprecations.json` single source), D-32 (claims generated from CI artifacts) |
| Requirement prefix | `REQ-DX-NN` |
| Acceptance prefix | `AC-DX-NN` |
| Exit criteria (§16) | PRD-18: codemods run clean on the canaries; every registry block renders. PRD-20: docs lint green; zero unsourced claims |

**Boundary.** This PRD owns the *tooling and documentation product*: the CLI binary and its commands, the codemod engine and its fixture runner, the registry source tree, build and publication, the docs app and its information architecture, generated docs (migration guide, selector tables, props tables, claims), `llms.txt`, per-component markdown and the MCP server. It **consumes** without editing: the `deprecations.json` schema and generators (PRD-01), the exports manifest and canary harness (PRD-02, PRD-19), the token CSS, Tailwind bridge and shadcn aliases (PRD-03), the material and `.meta.ts` typed metadata (PRD-04, flagship PRDs), and per-component codemod mapping tables (flagship PRDs). The 4.1.1 and 4.2/4.3 bridge items that touch the 4.x CLI are split per SC-37 (§16 PRD-17 is unfiled; `PRD-REL` is its interim owner and holds the release scope and gates): `doctor --v5` content is built here (DX-037, ported to the 4.x CLI by DX-150), and the "CLI moved" notice is implemented by REL-114 using the text constant owned here. Per SC-32 this PRD owns the registry schema, `registry/registry.json`, build, lint and render harness, and the content of the `auth`, `settings`, `mobile-settings` and `support-inbox` blocks; the other six blocks' content is owned by their area PRDs. Per SC-38 the deletion of 4.x docs is owned by `PRD-FND` (FND-142) and the removal of `src/registry/recipes.ts` by `PRD-NAV` (NAV-136); this PRD only verifies them.

---

## 1. Problem

AuraGlass 4.1 has no credible path from `npm i aura-glass` to a good-looking, correct screen, and no credible path from 4.x to 5.0.

1. **Install is not "to beautiful", it is "to broken".** Installing `aura-glass` pulls an Express, Redis, JWT, OpenAI, Pinecone and Google Vision backend (PACKAGING-SSR-DX-01, PARTIAL). `import { GlassButton }` bundles to about 2 MB minified / 558 KB gzip (PACKAGING-SSR-DX-02). The gap analysis scores "DX: install to beautiful" at 3.5/10 (`AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md:71`). The first Next.js compile in the project's own smoke takes 69.5–104.8 s (PACKAGING-SSR-DX-06). Packaging fixes belong to PRD-02; this PRD owns proving the end-to-end time with a measured, CI-gated quickstart.
2. **The flagship "copy-in" surfaces are broken by construction.** The 28 recipes in `src/registry/recipes.ts` are TypeScript template strings, not a registry. They carry 75 `!important` and about 114 hex literals, declare tokens none of them use (0 of 28), declare peer dependencies none of them import, and two ship frozen controlled inputs (APPSHELL-WORKSPACE-RECIPES-CLI-04, -07, -08 PARTIAL, -11). The `saas-admin-shell` recipe renders its sidebar stacked above main at 1440 px because the app-shell grid utilities do not exist in shipped CSS (APPSHELL-WORKSPACE-RECIPES-CLI-01). The render gate that "certifies" them cannot fail on layout (APPSHELL-WORKSPACE-RECIPES-CLI-03).
3. **The CLI is a recipe copier with audits, not a front door.** `bin/aura-glass.cjs` has `list`, `info`, `add`, `audit deps|imports`, `migrate icons|radix|mui` and `doctor` (`bin/aura-glass.cjs:8-29`). There is no `init`, no `diff`/`update`, no peer detection, no `"use client"` or alias awareness, and `migrate radix|mui --write` silently reports instead of writing (APPSHELL-WORKSPACE-RECIPES-CLI-16). There is no 4→5 migration at all. The architecture's claim that the 4.x CLI already has "dirty-tree refusal" (§3.1, §14.2) is **not true at HEAD**: `rg "dirty|git status" bin/aura-glass.cjs` returns 0 hits. Only `ensureInsideCwd` (`bin/aura-glass.cjs:295-300`), `--dry-run` and `--force` exist.
4. **5.0 is a hard break on every axis**, B1–B21 in PRD-01 §11.1: React 19 floor, ESM-only, `Glass` prefix dropped, about 119 root exports removed, prop grammar, `--glass-*` → `--ag-*`, global CSS removed, CLI moved. Without working, fixture-tested codemods and a generated migration guide, adoption of 5.0 stalls and the 4.x LTS becomes permanent.
5. **The docs actively mislead.** 79 of 278 copy-paste snippets (28%) fail `tsc` (DOCS-README-01; CONFIRMED in every named cause, the verifier did not re-run the aggregate, so REQ-DX-73 re-measures the baseline). 85 imported bindings are not exported from the path named (DOCS-README-02). About 143 stub pages exist to hit a coverage metric (DOCS-README-11; the verifier counted 142 files containing the stub sentence). A 619-line guide documents a fictional package `@aura/glass` (DOCS-README-10). There is no App Router / RSC guidance (DOCS-README-06) and no Vite or Tailwind v4 guide (DOCS-README-20). Three theming systems are documented without telling the reader which one to mount (DOCS-README-15). Migration content lives in 5 places (docs-readme §Duplication).
6. **Agents get stale context.** `llms.txt:39` says "Current release track: `3.0.x`" against `package.json` 4.1.0 (DOCS-README-09), and it recommends `GlassDataTable` and `ContrastGuard` from root (`llms.txt:16-29`), the latter a component that always passes (ACCESSIBILITY-01). There is no MCP server and no shadcn-compatible registry, while shadcn CLI v4 has made registries the distribution standard and `leefanv/liqui-design` already ships Base UI glass components through it (`research/competitors.md:18-30`; gap analysis :129).
7. **Claims are hand-typed.** README and release notes state counts ("498 certified") that do not match pixels (QA-CERTIFICATION-01), and `README.md:525-576` ships the internal certification runbook, including an agent-directed instruction, to npmjs.com (DOCS-README-18).

The 5.0 DX target is shadcn-grade: one command to set up, one command to add a surface, one command to migrate, and docs where every snippet type-checks and every number comes from a CI artifact.

---

## 2. Evidence from the current codebase

All paths verified with `rg --files` at `15b6de6f7`. Verdicts are the autopsy's adversarial verdicts; REFUTED or PARTIAL corrections are honoured as stated.

### 2.1 CLI

| # | Evidence | Finding |
|---|---|---|
| E-01 | `package.json:8` declares `"bin"`; `package.json:233` ships `bin` in `files`. `bin/aura-glass.cjs` is 1,024 lines of CommonJS | The CLI ships inside the runtime package (D-22 moves it out; B15) |
| E-02 | `bin/aura-glass.cjs:8-29` usage: `list`, `info`, `add`, `audit deps`, `audit imports`, `migrate icons --from lucide`, `migrate radix`, `migrate mui`, `doctor` | No `init`, `diff`, `update`, `migrate 4to5`, `eject` |
| E-03 | `bin/aura-glass.cjs:295-300` `ensureInsideCwd`; `:771-799` `writeRecipe` with `--out`, `--dry-run`, `--force` | Path containment is real and is kept (gap analysis :83 "Keepers") |
| E-04 | `rg "dirty\|git status" bin/aura-glass.cjs` → 0 hits | **Deviation from architecture §3.1/§14.2:** there is no dirty-tree refusal to "keep". It is NEW in this PRD (REQ-DX-06) |
| E-05 | `bin/aura-glass.cjs:891-913` `info` prints `"3.2 target: …"` (`:911`); `spawnSync` imported at `:6` and unused (`:605` region) | APPSHELL-WORKSPACE-RECIPES-CLI-16 (low) |
| E-06 | `bin/aura-glass.cjs:587-640` `migrateByReport`, dispatched at `:993-1004`: `--write` yields `report-only-write-requested` | Silent no-op write (APPSHELL-WORKSPACE-RECIPES-CLI-16) |
| E-07 | `bin/aura-glass.cjs:642-700` `runDoctor` checks package.json, install, forbidden deps/imports (MUI, Radix, Lucide, `:31-40`) | Doctor fails a project for importing Radix. In 5.0, AuraGlass must drop into shadcn apps that use Radix (§5.5), so that check becomes a `info`-level note, not a failure |
| E-08 | `scripts/migrate/{doctor,audit-mui,audit-radix,icons-from-lucide,export-tokens}.js`; `scripts/codemods/{tw-to-glass,cleanup-glass-duplicates}.js`; `tools/codemods/{auraglass-from-raw,focusify}.mjs` | Repo-internal codemods, never shipped (`files` = bin, dist, workers, README, LICENSE; DOCS-README §Outdated `docs/guides/migration.md:14` cites `npm run codemod:all`). None targets 4→5. Not reused (different AST strategy, regex based) |
| E-09 | `scripts/ci/verify-cli.js` (236 lines), `scripts/ci/verify-recipes-cli.js` (375), `package.json:277` `test:cli`, `:300-301` `test:recipes:*` | Existing CLI gates. `verify-recipes-cli.js:249-277` validates only field presence (APPSHELL-WORKSPACE-RECIPES-CLI-08, PARTIAL) |

### 2.2 Registry and recipes

| # | Evidence | Finding |
|---|---|---|
| E-10 | `src/registry/recipes.ts` 2,089 lines; 28 ids in `AuraGlassRecipeId` (`:1-29`); `dist/registry/index.js` 113 KB of strings | "28 recipes" claim is accurate in count (appshell autopsy, verified) |
| E-11 | `src/registry/recipes.ts:61-115` `recipePolishStyle`, `:117-213` `lightRecipeCss`, `:874-890` `!important` shell-grid overrides; 75 `!important`, 114–117 hex | APPSHELL-WORKSPACE-RECIPES-CLI-04 (CONFIRMED) |
| E-12 | `src/registry/recipes.ts:225-230` declared tokens vs `:263` hex; `rg 'var\(--glass-' recipes.ts` = 0; `--glass-border-focus` at `:460`, `:564`, `:1192`, `:1533` undefined | APPSHELL-WORKSPACE-RECIPES-CLI-07 (CONFIRMED) |
| E-13 | `src/registry/recipes.ts:31-57` type has no `$schema`, `version`, `registryDependencies`, `cssVars` | APPSHELL-WORKSPACE-RECIPES-CLI-08 (PARTIAL: flat `files[].path` targets do exist) |
| E-14 | `src/registry/recipes.ts:1563`, `:1980` `value="" onChange={() => undefined}` | Frozen inputs (APPSHELL-WORKSPACE-RECIPES-CLI-11, CONFIRMED) |
| E-15 | `src/registry/recipes.ts:1497-1506`, `:1501` names `OPENAI_API_KEY` | Provider-unconfigured stance is right; vendor key contradicts Prism-first policy |
| E-16 | `src/registry/recipes.ts:1484` `md:glass-grid-cols-3`; shipped CSS has one responsive `glass-*` rule | APPSHELL-WORKSPACE-RECIPES-CLI-02 (CONFIRMED in substance, PARTIAL on the "exactly one responsive rule" detail) |
| E-17 | `scripts/ci/verify-recipes-render.js:354-355`, `:398-399` buffer resets; `:1325` only throw; `:1342` `passed = screenshots.length === renderedRecipes.length` | APPSHELL-WORKSPACE-RECIPES-CLI-03 (CONFIRMED). The harness itself (pack → `add all` → Vite → 3 viewports, `:90-140`, `:348-410`) is kept |
| E-18 | `src/registry/StyledComponentsRegistry.tsx`, `src/registry/index.ts:2-7` export a no-op component and `server/registryGuard` helpers | PACKAGING-SSR-DX-14; removal owned by architecture PRD-16 |
| E-19 | `docs/recipes/readme.md` (92 lines) organised by "3.2" and "3.3" batches; evidence at `reports/3.3-release/recipe-render-evidence.json:2-4` is 4.0.0 | Stale (appshell autopsy §Outdated) |

### 2.3 Docs, README, agent context

| # | Evidence | Finding |
|---|---|---|
| E-20 | 488 files under `docs/` excluding `docs/auraglass-5`; `docs/guides/` has 16 files, only `ssr-setup.md` and `react19-integration.md` are framework-related | DOCS-README-20 |
| E-21 | `docs/components/08-interactive/glass-rating.md:3-48`, `docs/components/14-cards/div.md:1-40` | 143 stub pages (verifier: 142 files carry the stub sentence); only 12 component pages have a props table (DOCS-README-11, CONFIRMED) |
| E-22 | 79 / 278 snippets fail `tsc` (`docs/components/23-design-tokens/glass-tokens.md:8-21`, `docs/components/22-hooks-utilities/use-glass-focus.md:8`, …) | DOCS-README-01 (critical) |
| E-23 | 85 / 518 imported bindings not exported from the named path | DOCS-README-02 (critical) |
| E-24 | `docs/guides/consciousness-interface.md:10-24,314`; `docs/guides/consciousness-migration.md` (691 lines) | Fictional `@aura/glass` package (DOCS-README-10) |
| E-25 | Migration content in `docs/guides/migration.md`, `docs/guides/consciousness-migration.md`, `docs/liquid-glass/migration.md`, `docs/components/30-genesis-revolutionary/migration-guide.md`, `docs/migration/*` (3 files), `docs/cli/migration.md` (63 lines) | Five-plus migration locations; `docs/guides/migration.md:3` says "Version 2.0" |
| E-26 | `README.md:391-414`, `docs/theme/theme-engine.md:7-58`, `docs/components/23-design-tokens/theme-system.md:5` | Three theming systems, no guide (DOCS-README-15); root `createGlassTheme` ≠ `aura-glass/theme` `createGlassTheme` (DOCS-README-05) |
| E-27 | `"use client"` appears in 0 doc files; `docs/theme/theme-engine.md:35-51` `Root` example crashes in `app/layout.tsx` | DOCS-README-06 |
| E-28 | `README.md:525-576` (esp. `:529`) certification runbook and agent instruction | DOCS-README-18 |
| E-29 | `README.md:368-382`, `INSTALLATION.md:23-36` hand-maintained peer matrices, both drifted | docs-readme §Duplication |
| E-30 | `llms.txt:39` "`3.0.x`"; `llms.txt:16-29` recommends `GlassDataTable`, `ContrastGuard` | DOCS-README-09; ACCESSIBILITY-01 |
| E-31 | `docs/components/choosing.md:11` vs `docs/app-shell/readme.md:5` recommend different `GlassAppShell`s | APPSHELL-WORKSPACE-RECIPES-CLI-06; DOCS-README-05 |
| E-32 | `docs/design-tokens.md:134-140` blur scale 4/8/16/24/32 px vs `src/styles/tokens.css:41` 16/24/32/40/48 px; 64 of 181 named vars undefined | DOCS-README-04 |
| E-33 | `scripts/ci/verify-markdown-links.js` (300 lines) exists; `docs/components/choosing.md:129` case-mismatched link | Link checker exists but misses case (DOCS-README-22); extended, not replaced |
| E-34 | `.storybook/` and `.github/workflows/deploy-storybook.yml` exist; there is no docs app (`rg --files \| rg "apps/docs"` = 0) | Storybook is the only browsable docs today |

### 2.4 Packaging facts this PRD depends on (owned elsewhere)

| # | Evidence | Owner |
|---|---|---|
| E-35 | `package.json:134-163` `/forms`, `/data`, `/navigation`, `/overlays`, `/marketing` resolve to root at runtime | PACKAGING-SSR-DX-10 → PRD-02 |
| E-36 | `scripts/ci/run-next-integration.js:92,177,191,239-245` runs only `next dev`, pages are `'use client'` | PACKAGING-SSR-DX-05 → PRD-19 canaries |
| E-37 | `scripts/ci/run-vite-integration.js`, `reports/3.2-release/vite-integration.json` | Vite exercised, undocumented (DOCS-README-20) |
| E-38 | `src/styles/index.css:24-25` imports `storybook-utility-shim.css` (unprefixed `.flex`, `.block`, `.max-w-7xl`) | APPSHELL-WORKSPACE-RECIPES-CLI-05 → PRD-03/PRD-16 removal; DX consequence: Tailwind consumers collide today |
| E-39 | `deprecations.json` (repo root) and `docs/schemas/deprecations.schema.json` do not exist at HEAD | SC-02: instance seeded at the repo root by `PRD-TRUST` (TRUST-075, `version: 1`), schema by `PRD-REL` (REL-010); consumed here |

---

## 3. Desired end state

At 5.0.0 GA:

1. **Install to beautiful in under 5 minutes, measured.** From an empty directory, a developer follows the Next 16 or Vite quickstart, runs `npx @auraglass/cli init` and `npx @auraglass/cli add app-frame`, and sees a certified glass app frame over a declared backdrop, light and dark, with no console errors. CI times the scripted path on a remote runner (third-party npm cache warmed, AuraGlass packages cold, REQ-DX-55) and fails if it exceeds 300 s (Next) / 240 s (Vite) wall clock, more than 6 shell commands, or more than 2 manual file edits (§16).
2. **One CLI, separate from the runtime.** `@auraglass/cli` (fallback `aura-glass-cli`, D-23) provides `init`, `add` (with `--source` eject), `diff`, `update`, `doctor` (incl. `--v5`), `audit backdrop`, `audit deps|imports` (kept), `migrate 4to5`, plus the kept `migrate icons --from lucide`. `aura-glass@5` has no `bin`. Every writing command keeps path containment, `--dry-run`, and gains dirty-tree refusal and a JSON change report.
3. **Codemods do the migration.** `npx @auraglass/cli migrate 4to5` runs the PRD-01 §11.2 catalogue (8 core transforms plus area transforms registered by other PRDs), all idempotent, each with complete compilable fixtures. On the frozen 4.x consumer fixture it produces zero TODOs on the flagship subset and the result passes `tsc`, `next build` and the canary Playwright run.
4. **A real shadcn CLI v4-compatible registry.** Static JSON at `https://auraglass.dev/r/<name>.json`, also published to npm as `@auraglass/registry` data. `registry:base` (`auraglass`: theme, cssVars, Tailwind bridge), `registry:block` (6 product surfaces + `auth`, `settings`, `mobile-settings`, `support-inbox` = 10 blocks), `registry:item` (D-17 re-authored items and adapters). Both `npx shadcn@latest add https://auraglass.dev/r/<name>.json` and `npx @auraglass/cli add <name>` install the same files. Every block uses only public `aura-glass` exports and `--ag-*` tokens, has 0 `!important`, 0 hex/rgb literals, 0 inline optics, and renders green in the recipe render gate, which now fails on layout and on any console error in any viewport.
5. **The 28 recipes are retired, not ported.** Each has a recorded fate (§9.2): folded into one of the 10 blocks, re-authored as a registry item, or deleted. `aura-glass/registry` and `src/registry/recipes.ts` are gone in 5.0; the 4.x CLI keeps working on 4.x.
6. **TypeScript guides the developer.** Material props are literal unions (`MaterialVariant`, `Thickness`, …, §4.2 of the architecture) and autocomplete in VS Code without importing types. Deprecated names strike through with `@deprecated` TSDoc carrying `since`/`removeIn` and the replacement. Every flagship's variant metadata (`*.meta.ts`) drives docs props tables, Storybook matrices and codemod tables from one source.
7. **Docs app at `https://auraglass.dev`**, built from `apps/docs` (Next 16, static export), with IA: Get started → Foundations (material, theming, accessibility, motion) → Components (44 flagships first, then T2) → Surfaces (registry blocks) → Guides (Next, Vite, Tailwind, plain CSS, RSC, testing) → Migrate (4→5, generated) → API reference (generated). Every code block compiles in CI against the packed tarball. Every number on the site comes from a CI artifact keyed to a SHA.
8. **Guides that answer the real questions:** a theming guide with exactly one provider (`AuraGlassProvider` + `AuraGlassScript`) and `createGlassTheme`/`createBrandTheme`; Tailwind v4 interop through `aura-glass/tailwind.css`; plain-CSS interop through `@layer` order and `data-ag-part`/`data-state`; "Choosing a material".
9. **A generated migration guide.** `apps/docs/content/migrate/5.mdx` renders from the repo-root `deprecations.json` (SC-02) and the PRD-01 breaking-change register; per-component selector change tables render from flagship metadata. No hand-written deprecation text.
10. **Agent DX:** `llms.txt` and `llms-full.txt` generated from the API report and metadata at each release; per-component markdown at `https://auraglass.dev/components/<slug>.md`; an MCP server `@auraglass/mcp` (stdio) with `search_components`, `get_component`, `list_registry`, `get_registry_item`, `get_migration` tools, read-only and offline (bundled data). Not a GA blocker (§10 of the architecture), but shipped by RC.
11. **Generated claims only.** README, docs home, release notes and `llms.txt` render numbers (component count, flagship count, sizes, contrast minimum, recipes = 1, pass counts) from the GA run's artifacts. `claims.json` and the README/release-note claim regions (`<!-- ag:claim id="…" -->…<!-- /ag:claim -->`) are produced by PRD-19 (`packages/qa/src/claims/render.ts`, REQ-QA-31); this PRD owns the docs-app `<Claim>` rendering, the `llms.txt` claim regions, and the docs-lint check REQ-QA-31 names (`lint-claims`). A numeric claim without an artifact source fails docs lint. The README contains no certification runbook.

---

## 4. Architecture

### 4.1 Packages and directories

```
aura-glass/                         (repo root; package "aura-glass", no "bin" in 5.0)
├─ src/compat/**                    NEW  4.x name + prop adapters (contract PRD-01 §4.6; tables from flagship PRDs)
├─ packages/cli/                    NEW  "@auraglass/cli" (fallback "aura-glass-cli", D-23), ESM, Node >=20.19
│  ├─ src/bin.ts                    entry; command router
│  ├─ src/commands/{init,add,diff,update,doctor,audit,migrate,list,info}.ts
│  ├─ src/core/{fs-safety,git-guard,project-detect,package-manager,report,config}.ts
│  ├─ src/registry/{fetch,resolve,install,hash}.ts
│  ├─ src/migrate/4to5/
│  │  ├─ index.ts                   transform registry + default order
│  │  ├─ transforms/<id>.ts         one file per transform (8 core + area transforms)
│  │  ├─ mappings/*.json            generated from deprecations.json + flagship tables
│  │  └─ __fixtures__/<id>/<case>/{input,output}.<ext>
│  ├─ src/migrate/legacy/{icons-from-lucide,radix-report,mui-report}.ts   ported from bin/aura-glass.cjs
│  └─ test/**
├─ packages/mcp/                    NEW  "@auraglass/mcp", stdio MCP server, bundled read-only data
├─ registry/                        NEW  registry source of truth (SC-32; DX owns schema, index, build, lint, render)
│  ├─ registry.json                 shadcn v4 "registry" index ($schema https://ui.shadcn.com/schema/registry.json; DX-067)
│  ├─ base/auraglass/**             registry:base
│  ├─ blocks/<id>/**                registry:block (10; content per area PRD, SC-32)
│  └─ items/<id>/**                 registry:item (incl. AI items as items/ai-<name>/; there is no registry/ai/)
├─ apps/docs/                       NEW  Next 16 static-export docs app (https://auraglass.dev)
│  ├─ content/**.mdx                hand-written prose (no numbers, no API tables)
│  ├─ generated/**                  build output of scripts/docs/* (git-ignored)
│  └─ public/r/*.json               registry build output (git-ignored), served at /r/
├─ docs/quickstart/{next,vite}.md   NEW  canonical quickstarts (rendered by apps/docs; also shipped in README)
├─ scripts/docs/                    NEW  generators: gen-props, gen-selectors, gen-migration, gen-llms, gen-claims, lint-claims, compile-snippets
└─ tests/dx/**                      NEW  quickstart timing, registry render, codemod canaries (run remotely)
```

The CLI depends on `aura-glass` **only for data**: it reads `registry` JSON and the generated codemod mappings. It never imports runtime components, so the CLI version is decoupled from the consumer's installed `aura-glass` version (it reads the consumer's installed `aura-glass/package.json` to pick the matching registry release).

### 4.2 CLI design

- **Runtime:** TypeScript compiled to ESM with `tsdown` (same toolchain as PRD-02), `engines.node >=20.19`. Dependencies (exact pins, CLI-local allowlist `packages/cli/dependency-allowlist.json`): `jscodeshift` (TSX transforms, `tsx` parser), `postcss` + `postcss-value-parser` (CSS transforms), `zod` (registry and config validation; architecture §3.4 moves zod here), `picocolors`, `prompts` (interactive `init` only; `--yes` bypass). Total install footprint target ≤15 MB unpacked (§16).
- **Command contract (every command):** `--cwd <dir>`, `--json` (machine output, exit code is the only status), `--yes` (non-interactive), `--silent`. Exit codes: `0` success, `1` validation/TODO failure, `2` usage error, `3` safety refusal (dirty tree, path escape), `4` network/registry failure.
- **Write safety (`src/core/fs-safety.ts`, `src/core/git-guard.ts`):** `ensureInsideCwd` ported verbatim from `bin/aura-glass.cjs:295-300`; symlink targets resolved with `fs.realpathSync` before containment; writes are staged in memory and applied atomically per file (`write tmp → rename`). `git-guard` refuses any write when `git status --porcelain` is non-empty for paths the command would touch (override `--allow-dirty`); outside a git repo it requires `--allow-no-git`. `--dry-run` prints a unified diff and writes nothing.
- **Project detection (`project-detect.ts`):** framework (`next` App Router if `app/` with `layout.(t|j)sx`, Pages Router if `pages/_app`, `vite`, `react-router`, unknown), TypeScript (tsconfig `paths` aliases resolved, e.g. `@/*`), package manager (lockfile: `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `package-lock.json`), Tailwind version (`tailwindcss` major in `package.json`, `@import "tailwindcss"` in CSS), global CSS entry (`app/globals.css`, `src/index.css`, `src/main.css`), and `components.json` (shadcn) presence.
- **Config:** `auraglass.json` at project root (NEW; zod-validated, `$schema https://auraglass.dev/schema/config.json`): `{ "registry": "https://auraglass.dev/r", "aliases": { "components": "@/components", "blocks": "@/components/blocks" }, "css": "app/globals.css", "tailwind": true, "rsc": true }`. If `components.json` exists, `init` reads its `aliases` and `tailwind.css` instead of asking.
- **Registry protocol:** items are fetched from `<registry>/<name>.json` (or a local path), validated against the shadcn v4 `registry-item` schema plus AuraGlass extensions under `meta.auraglass` (`{ "minVersion": "5.0.0", "certified": "<sha>", "surface": "ai-workspace" }`). `registryDependencies` are resolved depth-first with cycle detection. Each written file gets a header `// @auraglass/registry <name>@<registryVersion> sha256:<hash>`; `diff` and `update` compare against it.
- **Eject (`add <component> --source`):** copies the component's built source (from the registry item `aura-glass-src/<component>`, generated per release from `src/**`) into `aliases.components/<slug>/`, rewrites internal imports to public `aura-glass/*` subpaths, and records the version tag. Ejected files stay on the material: they import `materialProps` from `aura-glass/material` and never inline optics.

### 4.3 Codemod engine

```
migrate 4to5 [--transform <id>[,<id>]] [--dry-run] [--report <file>] [--allow-todo] [--allow-dirty] <paths…>
   │
   ├─ git-guard (refuse dirty)            ├─ load mappings/*.json (generated, versioned with the CLI)
   ├─ glob <paths> (respect .gitignore; skip node_modules, dist, .next, build)
   ├─ for transform in DEFAULT_ORDER ∩ --transform:
   │     JS/TS files → jscodeshift(transform, parser "tsx")
   │     CSS files   → postcss(transform)       (css-vars, imports-subpaths @import)
   │     package.json → JSON transform          (deps)
   ├─ collect TODOs: `// TODO(aura-glass 5): <reason>, see <doc>`
   ├─ write atomically; emit report { files, changes[], todos[], skipped[] }
   └─ exit 1 if todos.length > 0 && !--allow-todo
```

- **Default order** (PRD-01 §11.2): `imports-subpaths` → `providers` → `canonical-names` → `prop-grammar` → `dead-optical-props` → `css-vars` → `deps` → `removed`. Transform ids are one flat kebab-case namespace whose catalogue and schema enum are owned by `PRD-REL` (SC-33); this PRD implements the engine (DX-041) and its machine copy (DX-042). The registered area transforms are `ai-chat` (AI, AI-115), `app-shell-slots` (NAV, NAV-145), `reduced-motion-initial`, `motion-imports`, `motion-props` (MOT, MOT-001/MOT-090) and `media-backdrops` (MED). They run after `prop-grammar` and before `css-vars`, in registration order, and must meet the same contract.
- **Mapping data is generated, not hand-coded.** `scripts/release/gen-deprecations.mjs --codemods` (PRD-01) emits `packages/cli/src/migrate/4to5/mappings/{names,subpaths,props,css-vars,removed}.json`. Flagship PRDs supply prop tables as `src/**/<Component>.meta.ts` `migration` fields; `scripts/docs/gen-codemod-tables.mjs` (NEW) merges them into `props.json`. A transform never contains a literal 4.x name.
- **Never guess.** Dynamic values (`variant={v}`), computed CSS var names and unmapped values are left unchanged with a TODO comment. `aria-*`, `data-testid`, `className`, `style`, `ref` and spread props are preserved byte-for-byte.

### 4.4 Registry build and publication

`scripts/registry/build.mjs` (NEW) reads `registry/registry.json`, inlines file contents, validates every item with the shadcn v4 schema (vendored at `packages/cli/schema/registry-item.json`, pinned by hash), writes `apps/docs/public/r/<name>.json` and `apps/docs/public/r/registry.json`, and packs `@auraglass/registry` (data-only npm package: `r/*.json`, `index.json`). The registry version equals the `aura-glass` version it was certified against; `https://auraglass.dev/r/v/<version>/<name>.json` serves immutable copies, `/r/<name>.json` serves the latest GA.

### 4.5 Docs app and generation pipeline

```
src/**/*.meta.ts ──┐                     etc/api/<slug>.api.md, etc/api/<slug>.exports.json (SC-04, PRD-REL) ──┐
deprecations.json (repo root, SC-02) ─┼─► scripts/docs/gen-*.mjs ─► apps/docs/generated/{props,selectors,migration,api}/*.json|mdx
registry/** ───────┘                     CI artifacts (claims.json, perf-grades.json, contrast-matrix.json, size.json) ─► gen-claims
                                                         │
apps/docs (Next 16, output: "export") ◄──────────────────┘ ─► llms.txt, llms-full.txt, /components/<slug>.md, MCP data bundle
```

- Live examples import from the **packed** `aura-glass` tarball installed into `apps/docs` (never `src/`), so the docs prove the artifact.
- Examples are files (`apps/docs/examples/<slug>/<example>.tsx`), not inline strings; MDX embeds them with `<Example file="…" />`. `scripts/docs/compile-snippets.mjs` type-checks every example file and every fenced `tsx`/`ts` block in `content/**` and `docs/quickstart/**` against the tarball's `.d.ts`.
- Numbers in prose use `<Claim id="flagship-count" />`, resolved from `claims.json` produced by the GA certification run (PRD-19 REQ-QA-31). `README.md` and the generated release body use PRD-19's region markers `<!-- ag:claim id="…" -->…<!-- /ag:claim -->`, filled by `packages/qa/src/claims/render.ts` (PRD-19); `llms.txt.tmpl` uses the same markers, filled by `gen-llms.mjs` from the same `claims.json`. `scripts/docs/lint-claims.mjs` fails on any digit-bearing claim pattern (`\b\d+(\.\d+)?\s?(%|KB|MB|ms|s|components|flagships|targets|recipes|blocks|transforms)\b`) outside a `<Claim>` or a claim region in `content/**`, `README.md`, `llms.txt.tmpl` and the generated release body.
- Hosted as a static site on the project's existing deployment path (Vercel preview per PR, production on GA tag), chosen by the project's existing runtime environment; no server.

### 4.6 MCP server

`@auraglass/mcp` (stdio transport, `@modelcontextprotocol/sdk`, exact pin) bundles `mcp-data.json` generated at release (components, props, parts, registry index, migration entries). Tools (all read-only, no network, no file writes): `search_components({ query, surface? })`, `get_component({ name })` → props, `data-ag-part` table, examples, a11y notes; `list_registry({ type? })`; `get_registry_item({ name })` → install command + file list; `get_migration({ symbol })` → `deprecations.json` entry + codemod id. It never calls an LLM, so the Kiro Prism policy does not apply; it is a data server.

---

## 5. Exact implementation requirements

Each requirement names the test that proves it (§12).

### 5.1 CLI package and safety

- **REQ-DX-01** Create `packages/cli` publishing `@auraglass/cli` (or `aura-glass-cli` if the `@auraglass` npm scope is not verified owned before 4.2, D-23; the name lives in one constant `packages/cli/src/meta.ts` `PACKAGE_NAME`). `bin: { "auraglass": "./dist/bin.js" }`, `"type": "module"`, `engines.node ">=20.19"`, ESM only. Test: `packages/cli/test/package.test.ts`.
- **REQ-DX-02** The CLI's runtime dependencies equal `packages/cli/dependency-allowlist.json` exactly (initial: `jscodeshift`, `postcss`, `postcss-value-parser`, `zod`, `picocolors`, `prompts`), each exact-pinned. CI `scripts/ci/verify-deps.mjs` (`PRD-PKG`, PKG-057; SC-14) runs in `packages/cli` with that allowlist. Test: `packages/cli/test/deps.test.ts`.
- **REQ-DX-03** `aura-glass@5` `package.json` has no `bin` key and `files` excludes `bin/`. `bin/aura-glass.cjs` is deleted on `main` at 5.0.0-beta.1 and remains on `release/4.x`. Test: `tests/dx/no-bin.test.ts` reads the packed tarball manifest.
- **REQ-DX-04** Global flags on every command: `--cwd`, `--json`, `--yes`, `--silent`; exit codes 0/1/2/3/4 as §4.2. `--json` output for each command validates against `packages/cli/schema/output/<command>.json`. Test: `packages/cli/test/contract.test.ts` runs each command with `--json` against `test/fixtures/projects/*`.
- **REQ-DX-05** `ensureInsideCwd` is ported with identical semantics to `bin/aura-glass.cjs:295-300` and extended to resolve symlinks (`realpath`) on both sides. A write target escaping `cwd` exits 3 with `Refusing to write outside the current project: <path>`. Test: `packages/cli/test/fs-safety.test.ts` (cases: `../x`, absolute path, symlink to `/tmp`, `--out ../`).
- **REQ-DX-06** NEW dirty-tree refusal (absent in 4.x, E-04): every writing command (`init`, `add`, `update`, `migrate 4to5`, `migrate icons --write`) exits 3 if `git status --porcelain -- <touched paths>` is non-empty, unless `--allow-dirty`. Outside a git work tree it exits 3 unless `--allow-no-git`. Test: `packages/cli/test/git-guard.test.ts`.
- **REQ-DX-07** All writes are atomic per file (temp file + `rename`), and a run that throws mid-way leaves no partially written file. Test: `fs-safety.test.ts` "aborts cleanly" injects a failure after the 3rd of 5 files and asserts files 1–3 are either all applied or the report lists them as applied and files 4–5 untouched.
- **REQ-DX-08** `--dry-run` on every writing command prints a unified diff (or JSON `changes[]` with `before`/`after` hashes) and performs zero writes (asserted by an fs spy). Test: `packages/cli/test/dry-run.test.ts`.
- **REQ-DX-09** No stale version strings: `rg "3\.2 target|3\.3|3\.0\.x" packages/cli/src` returns 0. Version printed by `auraglass --version` equals `packages/cli/package.json` version. Test: `packages/cli/test/version.test.ts`.
- **REQ-DX-10** `list` and `info <name>` are kept, now reading the registry index; `info` prints type, files, `dependencies`, `registryDependencies`, `cssVars` keys and the certified SHA. Test: `packages/cli/test/commands/list-info.test.ts`.

### 5.2 `init`

- **REQ-DX-11** `auraglass init` detects the project (§4.2) and, for **Next App Router**, writes or patches: (a) `app/globals.css` to begin with `@layer theme, base, ag, components, utilities;` followed by `@import "aura-glass/styles.css" layer(ag);` (and, when Tailwind v4 is detected, `@import "tailwindcss";` kept and `@import "aura-glass/tailwind.css";` added after it); (b) `app/layout.tsx` to import `AuraGlassScript` from `aura-glass/theme` and render `<AuraGlassScript />` as the first child of `<head>` (inserting `<head>` if absent) and to wrap `{children}` in a client `app/providers.tsx` (NEW file, `"use client"`) that renders `<AuraGlassProvider>`; (c) `auraglass.json`. Test: `packages/cli/test/commands/init.next.test.ts` with fixtures `next-app-tailwind`, `next-app-plain`, `next-app-existing-head`, `next-app-src-dir`.
- **REQ-DX-12** For **Vite** (`index.html` + `src/main.tsx`), `init` patches `src/main.tsx` to import `aura-glass/styles.css` (once, before the app CSS import) and wrap `<App />` in `<AuraGlassProvider>`, and inlines the pre-paint script into `index.html` `<head>` as a classic inline `<script>` whose body is the string constant `auraGlassPrepaintScript` exported by `aura-glass/theme` (the same compiled string `AuraGlassScript` emits, REQ-A11Y-37; SC-23 adds this export to the `PRD-A11Y` API table, built by A11Y-032/A11Y-034). If the export has not landed by 5.0.0-alpha, `init` writes no script and the Vite quickstart documents the zero-JS media-query mirrors (architecture §5.4), which still honour every OS floor. Test: `init.vite.test.ts` (fixtures `vite-react-ts`, `vite-react-tailwind`).
- **REQ-DX-13** `init` is idempotent: a second run reports `no changes` and produces a byte-identical tree. Test: each `init.*.test.ts` runs twice.
- **REQ-DX-14** `init` installs `aura-glass` with the detected package manager at the CLI's matching major (`aura-glass@^5`), prints the exact command, and with `--no-install` only prints it. It never installs optional peers unless a later `add` needs them. Test: `init.install.test.ts` (spawn mocked; asserts argv per package manager).
- **REQ-DX-15** If `components.json` exists (shadcn project), `init` reuses its `aliases` and `tailwind.css` path, does not create a second globals file, and appends AuraGlass imports after shadcn's `@import "tailwindcss"`. Test: `init.shadcn.test.ts` (fixture `next-shadcn-base-ui`).

### 5.3 `add`, `diff`, `update`, eject

- **REQ-DX-16** `auraglass add <name…>` fetches `<registry>/<name>.json`, validates with zod against the vendored shadcn v4 item schema plus `meta.auraglass`, resolves `registryDependencies` depth-first (cycle → exit 1 with the cycle path), writes files to `aliases.*` honouring `target`, merges `cssVars` into the configured CSS under `@layer ag` without duplicating existing variables, and prints the install command for `dependencies`/`devDependencies` (runs it unless `--no-install`). Test: `packages/cli/test/commands/add.test.ts` against a local registry served from `test/fixtures/registry/`.
- **REQ-DX-17** `add` inserts `"use client"` as line 1 of a written file **iff** the registry file declares `meta.auraglass.client: true`, and never into files that declare `meta.auraglass.client: false` (server blocks). It rewrites `@/components/…` imports in item files to the project's configured alias. Test: `add.rsc-alias.test.ts`.
- **REQ-DX-18** Every written file starts with the header `// @auraglass/registry <name>@<version> sha256:<64 hex>` (CSS: `/* … */`), where the hash covers the file body after the header as published. Test: `add.test.ts` "header".
- **REQ-DX-19** `auraglass diff [name]` lists, for each header-tagged file, one of `unchanged`, `locally-modified` (hash mismatch vs header), `upstream-changed` (registry hash differs), `both`, and with `--patch` prints the upstream unified diff. Test: `packages/cli/test/commands/diff.test.ts` (four states).
- **REQ-DX-20** `auraglass update <name>` applies the upstream version for `unchanged`/`upstream-changed` files, refuses `locally-modified` and `both` (exit 1, lists files) unless `--force`, in which case it writes `<file>.auraglass-upstream` next to the local file instead of overwriting. Test: `packages/cli/test/commands/update.test.ts`.
- **REQ-DX-21** `auraglass add <component> --source` (eject) writes the component's source from the `aura-glass-src/<component>` registry item into `aliases.components/<slug>/`, rewrites internal `@/…` and relative library imports to public `aura-glass/*` subpaths, and fails (exit 1) if any rewritten import does not resolve against the installed `aura-glass` `exports` map. Ejectable set at GA: the 44 flagships and T2 core; T0 (`Surface`, `SurfaceGroup`, `Environment`) is not ejectable (the material stays centrally upgradeable, architecture §10). Test: `add.eject.test.ts` ejects `Button`, `Dialog`, `Table`; then `tsc --noEmit` on the fixture passes.
- **REQ-DX-22** An ejected file contains no `backdrop-filter`, `rgba(`, `#hex` or `blur(` literal (it consumes `materialProps()`/`--ag-*`). Test: `add.eject.test.ts` greps the written files.

### 5.4 `doctor` and `audit`

- **REQ-DX-23** `auraglass doctor` emits checks with ids and statuses `pass|info|warn|fail`: `node-version` (fail <20.19), `react-version` (fail <19.0 for `aura-glass@5`), `duplicate-react` and `duplicate-base-ui` (fail when `npm ls`/lockfile shows >1 resolved copy), `undeclared-transitive` (warn per `date-fns`, `chart.js`, `react-chartjs-2`, `zod`, `framer-motion`, `motion` imported by source but not declared), `global-css-reliance` (warn when source uses `.flex`/`.grid`/bare `h1` styling expectations matched by `compat/globals.css` selectors and `compat/globals.css` is not imported), `layer-order` (warn when the global CSS lacks the `@layer theme, base, ag, components, utilities;` statement), `script-missing` (warn when a Next App Router layout lacks `AuraGlassScript`), `tailwind-source` (info: no `@source` needed). Test: `packages/cli/test/commands/doctor.test.ts` with one fixture per check.
- **REQ-DX-24** The 4.x forbidden-UI checks (`bin/aura-glass.cjs:31-40`, MUI/Radix/Lucide) are downgraded to `info` with the message "Coexists with AuraGlass; not required" (Radix, MUI) and kept as `warn` for Lucide only when `aura-glass/icons` is used in the same file. No doctor check may `fail` a shadcn/Radix app. Test: `doctor.shadcn.test.ts`.
- **REQ-DX-25** `doctor --v5` (built here in `@auraglass/cli`, DX-037, and ported unchanged into the 4.x CLI on `release/4.x` for 4.2 by DX-150; SC-37 puts the 4.2 gate with `PRD-REL`) reports, per file and line, every usage that has a `deprecations.json` entry with `removeIn: "5.0.0"`, grouped by codemod id with `automation`, and a summary `{ automatic, needsReview, manual }`. Test: `doctor.v5.test.ts` against `tests/fixtures/consumer-4x/` (PRD-01 §11.4) asserts the summary equals the committed `doctor-v5.expected.json`.
- **REQ-DX-26** `audit deps` and `audit imports` are ported with unchanged JSON shape (snapshot of 4.1.0 output against `test/fixtures/projects/legacy-audit`). Test: `packages/cli/test/commands/audit.compat.test.ts`.
- **REQ-DX-27** `audit backdrop --url <url> [--selector <css>]` is a **remote** dev pixel audit: it submits the URL to the PRD-19 remote capture service (endpoint from `AURAGLASS_AUDIT_ENDPOINT`), never launches a local browser, and prints, per `[data-ag-surface]`, backdrop luminance variance, OCR text contrast and the matched transparency rung, using the §15.2 pixel-gate thresholds. With no endpoint configured it exits 4 with setup instructions. Test: `packages/cli/test/commands/audit-backdrop.test.ts` (HTTP mocked; asserts request/response schema and that no `playwright`/`chromium` module is resolved by the CLI bundle) **and** `tests/dx/audit-backdrop.remote.spec.ts` (NEW, remote, no mocks): against the real PRD-19 capture endpoint, a fixture page with one surface over a declared backdrop and one "glass over nothing" surface must report `pass` and `fail` respectively. A mocked-only pass does not satisfy this requirement.
- **REQ-DX-28** `migrate radix|mui --write` either performs writes or is removed; the silent `report-only-write-requested` path (E-06) is deleted. Decision: keep them as report-only, reject `--write` with exit 2 and the message "report-only; no automated migration". Test: `packages/cli/test/commands/migrate-legacy.test.ts`.

### 5.5 `migrate 4to5` (catalogue: PRD-01 §11.2; this PRD implements it)

- **REQ-DX-29** `auraglass migrate 4to5 [--transform <ids>] [--dry-run] [--report <file>] [--allow-todo] [--allow-dirty] <paths…>` runs transforms in the §4.3 default order. Unknown transform id → exit 2 listing valid ids. Test: `packages/cli/src/migrate/4to5/__tests__/runner.test.ts`.
- **REQ-DX-30** The 8 core transforms exist as `packages/cli/src/migrate/4to5/transforms/{imports-subpaths,providers,canonical-names,prop-grammar,dead-optical-props,css-vars,deps,removed}.ts`, each implementing exactly the input → output behaviour and automation level of PRD-01 §11.2, including B17–B19 asset/granular subpath rewrites inside `imports-subpaths` and `@import` rewrites in CSS.
- **REQ-DX-31** Fixtures: every case listed in PRD-01 §11.2's "Required fixture cases" column exists as `__fixtures__/<transform>/<case>/input.<ext>` and `output.<ext>` (complete, compilable files). The runner `__tests__/fixtures.test.ts` discovers all case directories (including area-PRD subfolders such as `__fixtures__/canonical-names/controls/*`, REQ-CTL-19), asserts `transform(input) === output` byte-for-byte, and asserts idempotence `transform(output) === output`. A CI meta-test `__tests__/catalogue-coverage.test.ts` reads `packages/cli/src/migrate/4to5/catalogue.json` (NEW, owned here: a machine copy of PRD-01 §11.2's ids, automation levels and "Required fixture cases" column) and fails if any required case directory is missing; `__tests__/catalogue-sync.test.ts` parses the §11.2 markdown table in `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` and fails if `catalogue.json` drops any id or case listed there (PRD-01 permits adding cases, never removing them).
- **REQ-DX-32** Type-checked fixtures: `__tests__/fixtures-typecheck.test.ts` compiles every `input.tsx` against the 4.3 `.d.ts` (installed from the packed 4.3 tarball into `packages/cli/test/types-4x/`) and every `output.tsx` against the current 5.0 `.d.ts`, `tsc --noEmit --strict`. TODO-bearing outputs are allowed to reference `aura-glass/compat`.
- **REQ-DX-33** Mapping data comes only from `packages/cli/src/migrate/4to5/mappings/*.json`, generated by `gen-deprecations.mjs --codemods` and `scripts/docs/gen-codemod-tables.mjs`. Lint rule `packages/cli/eslint.config.js` `no-restricted-syntax` forbids string literals matching `/^Glass[A-Z]/` and `/^--glass-/` in `transforms/**`. Test: `__tests__/no-hardcoded-names.test.ts`.
- **REQ-DX-34** Coverage gate: every `deprecations.json` entry with `codemod != null` maps to an existing transform id and appears in at least one fixture's `input` (by `symbol`). Test: `__tests__/deprecation-coverage.test.ts`. An entry with `automation: "full"` whose fixture output contains a TODO fails.
- **REQ-DX-35** TODO format is exactly `// TODO(aura-glass 5): <reason>, see <doc>` (CSS: `/* TODO(aura-glass 5): … */`), with `<reason>` = the entry's `message` and `<doc>` = its `doc` URL. Run exits 1 when any TODO is emitted unless `--allow-todo`. The AI PRD's `TODO(auraglass-5)` spelling (REQ-AI-48) is normalised to this format (deviation recorded in §11). Test: `__tests__/todo-format.test.ts`.
- **REQ-DX-36** Preservation: for every JSX transform, a `preserve-attrs` fixture asserts `aria-*`, `data-testid`, `className`, `style`, `ref`, `key` and `{...spread}` survive in original order and text. Formatting: changed files are reprinted with recast's `quote: "auto"`; unchanged files are not rewritten (mtime unchanged). Test: `__tests__/preserve.test.ts`.
- **REQ-DX-37** `--report <file>` writes `{ version, cliVersion, transforms[], files: [{ path, changes: [{ transform, line, before, after }], todos: [] }], summary: { filesChanged, changes, todos } }` validated against `packages/cli/schema/output/migrate-report.json`.
- **REQ-DX-38** Canary gate (remote CI, PRD-19 harness): `tests/dx/codemod-canary.spec.ts` copies `tests/fixtures/consumer-4x/` (PRD-01 §11.4), runs `migrate 4to5` from the packed CLI, replaces `aura-glass@4` with the packed 5.0 tarball, and asserts: 0 TODOs in the flagship-subset files listed in `tests/fixtures/consumer-4x/flagship-subset.json`; `tsc --noEmit` exit 0; `next build` exit 0; the canary's Playwright smoke passes in Chromium, WebKit and Gecko; second run of `migrate 4to5` reports 0 changes.
- **REQ-DX-39** Real-world canaries: the same run against (a) every registry block's 4.x-era recipe ancestor (`tests/dx/fixtures/recipes-4x/*`, the 28 recipe files extracted from `src/registry/recipes.ts` at 4.3.0) must terminate without exceptions and with every residual TODO listed in `tests/dx/fixtures/recipes-4x/expected-todos.json`; (b) a pinned snapshot of each AuraOne consumer app's `aura-glass` import sites (path list owned by PRD-01 §2.4 grep) produces a report artifact reviewed by the release owner before RC.
- **REQ-DX-40** Performance: `migrate 4to5` on a 2,000-file TSX tree (generated fixture `tests/dx/fixtures/large-tree/`) completes in ≤60 s on the CI runner with ≤1.5 GB RSS (§16). Test: `tests/dx/codemod-perf.test.ts` (remote).

### 5.6 `aura-glass/compat` adapters

- **REQ-DX-41** `src/compat/index.ts` exports exactly the names listed by `gen-deprecations.mjs --compat` (PRD-01 §4.6); a test diffs the runtime export list against that manifest. Each adapter is `src/compat/<area>/<OldName>.tsx`, maps props using the same `mappings/props.json` the codemod uses (one table, two consumers), calls `warnDeprecated(id)` from `src/internal/warnDeprecated.ts` (`PRD-REL`, REL-072; SC-34) at call time, and drops unmappable props with a warning, never throwing. Test: `src/compat/__tests__/manifest.test.ts`, `src/compat/__tests__/adapters.test.tsx` (one render per adapter: no throw, one warning per page load, zero warnings when `NODE_ENV=production`).
- **REQ-DX-42** `aura-glass/compat` contains no removed component (B3). Test: `manifest.test.ts` asserts the intersection with `deprecations.json` entries where `compat == null` is empty.

### 5.7 Registry (shadcn CLI v4 compatible)

- **REQ-DX-43** `registry/registry.json` declares `"$schema": "https://ui.shadcn.com/schema/registry.json"`, `"name": "auraglass"`, `"homepage": "https://auraglass.dev"`, and lists every item. Every item validates against the vendored `registry-item` schema (pinned by sha256 in `packages/cli/schema/SOURCE.md`). Test: `tests/dx/registry-schema.test.ts`.
- **REQ-DX-44** `registry:base` item `auraglass` contains: `dependencies: ["aura-glass@^5"]`; `cssVars` with `theme`, `light`, `dark` blocks mapping the shadcn interchange variables (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius`, architecture §4.4) to `var(--ag-*)`; a `css` entry adding `@import "aura-glass/styles.css" layer(ag);` and, when installed into a Tailwind v4 project, `@import "aura-glass/tailwind.css";`; and a `files` entry `lib/auraglass.ts` re-exporting `cn` from `aura-glass`. `npx shadcn@latest add https://auraglass.dev/r/auraglass.json` into a fresh shadcn Base UI app yields a project whose `next build` passes. Test: `tests/dx/registry-shadcn-interop.spec.ts` (remote).
- **REQ-DX-45** Exactly 10 `registry:block` items at GA, one per certification scene and pattern: `app-frame` (AppShell + Sidebar + TopBar + StatusBar + Inspector), `ai-workspace` (Thread, Message, Composer, ToolCall, SourceList, plus the AI PRD items; the components stay presentational, and the block's server route `app/api/chat/route.ts` calls Kiro Prism exactly as AI PRD REQ-AI-43 specifies, with the key read server-side from `process.env.PRISM_API_KEY` and never shipped to the client), `data-workspace` (Table, FilterBar, TreeView, StatCard, Pagination), `analytics-dashboard` (StatCard, Sparkline, ChartFrame, Timeline), `media-viewer` (MediaControls, NowPlayingBar, CarouselRail, ImageViewer over `Backdrop preset="photo"`), `overlay-flows` (Dialog, AlertDialog, Sheet, Popover, Menu, CommandPalette, Toast), `auth` (sign-in, sign-up, reset), `settings` (desktop settings with `GlassPreferencesPanel`), `mobile-settings` (MobileShell + TabBar + Sheet at 390 px), `support-inbox` (list/detail with Thread and FilterBar). Each block declares `registryDependencies: ["auraglass"]` and lists every flagship it uses in `meta.auraglass.components`. **Content ownership (SC-32):** `app-frame` NAV (NAV-106 creates it), `ai-workspace` AI (AI-107/AI-108), `data-workspace` and `analytics-dashboard` DATA (DATA-133), `media-viewer` MED (MED-153), `overlay-flows` OVL (OVL-164); `auth`, `settings`, `mobile-settings` and `support-inbox` are authored here, with OVL/CTL contributions by MODIFY (OVL-143, CTL-161). For area-owned blocks this PRD only scaffolds, registers, lints and render-certifies (DX-071..076). Test: `tests/dx/registry-blocks.test.ts` asserts the 10 names and that `meta.auraglass.components` equals the set of `aura-glass` imports parsed from its files.
- **REQ-DX-46** Block content rules, enforced by `scripts/registry/lint.mjs` (NEW): 0 `!important`; 0 colour literals (`#[0-9a-fA-F]{3,8}\b`, `rgb(`, `rgba(`, `hsl(`, `hsla(`, `oklch(`, `oklab(`, `color-mix(`), forbidden everywhere including as `var()` fallbacks; 0 `backdrop-filter`, `blur(` or inline optics; 0 `style={{` containing colour, blur, shadow or radius; imports only from `aura-glass`, `aura-glass/*` public subpaths, `react`, `next/*` (Next-only route and layout files), the block's own files, and declared `dependencies`; every declared `dependency` is imported (fixes APPSHELL-WORKSPACE-RECIPES-CLI-07); no controlled input with a constant `value` and no-op `onChange` (AST check, fixes -11); no vendor API key names (`/[A-Z_]*API_KEY/` matches fail, with one allow-listed exception: `PRISM_API_KEY` inside server-only route files matching `app/api/**/route.ts`; any `NEXT_PUBLIC_*KEY` or key reference in a client file fails); product-realistic copy (JSX text nodes and string props matching `/\b(lorem|ipsum|demo|placeholder text)\b/i` fail; `example.com` addresses in auth-form placeholders are allowed). Test: `tests/dx/registry-lint.test.ts` runs the linter over `registry/**` and over seeded bad fixtures (one per rule, each must fail).
- **REQ-DX-47** `registry:item` set at GA: the D-17 re-authored items `kanban` (on `@dnd-kit/core`), `gantt`, `transfer-list`, `schema-viewer`, `code-surface` (lazy CodeMirror 6, Shiki highlighting), `rich-text` (Tiptap), `diff-viewer`; adapters `react-hook-form` and `ai-sdk-adapter`; plus the AI PRD items (`ai-sdk-adapter`, `ai-markdown`, `ai-model-picker`, `ai-artifact-panel`, `ai-trace-tree`, `ai-eval-dashboard`, `ai-voice-input`; REQ-AI-41, content owned by `PRD-AI`, sources under `registry/items/ai-<name>/` per SC-32, listed in `registry/registry.json` like any other item) and one `aura-glass-src/<component>` source item per ejectable component (REQ-DX-21). `ai-eval-dashboard` is a `registry:item` (SC-32), so the block set stays the architecture §3 ten (six surfaces + auth, settings, mobile settings, support inbox); `PRD-AI` changes its §3 table accordingly. Its render certification still runs in the REQ-DX-48 lane. Later blocks (`commerce-cart`, `commerce-checkout`, `pricing`, `audit-log`, `permissions-matrix`) are 5.x C-E additions through the EXP ledger, not GA. Items that miss certification by RC ship in 5.1 (C-E); they are never published uncertified. Test: `registry-blocks.test.ts` "items".
- **REQ-DX-48** Recipe render gate rewrite: `scripts/ci/verify-recipes-render.js` is replaced by `tests/dx/registry-render.spec.ts` (Playwright, remote). For each block it: packs `aura-glass` and the registry, creates fresh Next 16 and Vite apps, runs `auraglass init --yes` and `auraglass add <block> --yes`, builds (`next build` / `vite build`), serves the production build, and captures 1440×900 and 390×844, light and dark, transparency `glass` and `solid`. It fails on: any `pageerror` or `console.error` in **any** capture (buffers are per capture and asserted per capture, fixing APPSHELL-WORKSPACE-RECIPES-CLI-03); any §15.2 pixel gate (not blank, surface separation, OCR text contrast, glass density ≤0.3, mobile containment, material presence); any layout assertion in `registry/blocks/<name>/layout.assert.json` (e.g. `app-frame`: sidebar `x + width ≤ main.x` and `|sidebar.y − main.y| ≤ 1` at 1440; fixes -01); horizontal overflow at 390. The pass flag is the conjunction of all assertions, never a screenshot count.
- **REQ-DX-49** Registry build `scripts/registry/build.mjs` writes `apps/docs/public/r/*.json`, `apps/docs/public/r/v/<version>/*.json` (immutable), and packs `@auraglass/registry`. Item JSON is deterministic (sorted keys, LF), so a rebuild without source change is byte-identical. Test: `tests/dx/registry-build.test.ts` builds twice and compares hashes.
- **REQ-DX-50** Every block and item records `meta.auraglass.certified: "<sha>"` written by the registry render gate on the release SHA; the build fails if any published item lacks a certification SHA equal to the release SHA. Test: `registry-build.test.ts` "certified".

### 5.8 Recipes fate (the 28 claimed)

- **REQ-DX-51** Every one of the 28 ids in `AuraGlassRecipeId` (`src/registry/recipes.ts:1-29`) has exactly one fate in §9.2 (`→ block <name>`, `→ item <name>`, or `delete`), recorded machine-readably in `docs/auraglass-5/registry-recipe-fates.json` (NEW). Test: `tests/dx/recipe-fates.test.ts` asserts 28 entries, ids equal the union type, and every target block/item exists in `registry/registry.json`.
- **REQ-DX-52** In 4.2, each recipe id gets a `deprecations.json` entry (`kind: "cli"`, `symbol: "recipe:<id>"`, `replacement` = the block/item or null, `removeIn: "5.0.0"`); the 4.x CLI `add <recipe>` prints the replacement command once. In 5.0, `src/registry/**` and the `./registry` subpath are removed (B4; `src/registry/recipes.ts` removal is NAV-136 per SC-38, and DX-100 removes only the 4.x recipe gates). Test: `doctor.v5.test.ts` covers one recipe entry; the 4.x CLI message test belongs to the 4.2 bridge (`PRD-REL` interim owner, SC-37).
- **REQ-DX-53** No block is a port of a recipe string. Blocks are authored new from flagship components; recipe content survives only as product copy and layout intent. The single source of truth for block files is `registry/blocks/<id>/` (SC-32). Storybook block stories (`src/stories/blocks/`, DX-097) import those files and never copy them; a Storybook showcase may seed a block only if it uses public `aura-glass` exports exclusively and is moved into `registry/blocks/<id>/` by the block's content owner. Test: `registry-lint.test.ts` asserts no block file contains the 4.x `recipePolishStyle`/`lightRecipeCss` selectors (`.glass-app-shell__body`, `.glass-sidebar-rail`).

### 5.9 Install to beautiful in under 5 minutes

- **REQ-DX-54** `docs/quickstart/next.md` and `docs/quickstart/vite.md` contain the complete path from `npx create-next-app@latest` / `npm create vite@latest -- --template react-ts` to a rendered `app-frame` block, in ≤6 shell commands and ≤2 manual file edits each (target: 0 manual edits, `init` does them). Each step is a fenced block tagged `{step}` so `tests/dx/quickstart.spec.ts` can execute the document literally.
- **REQ-DX-55** `tests/dx/quickstart.spec.ts` (remote runner, Playwright) executes each quickstart's `{step}` blocks in order in a clean container using the packed tarballs via a local registry proxy (`verdaccio`) seeded with `aura-glass`, `@auraglass/cli` and `@auraglass/registry`; npm cache warmed for third-party packages only (the measured time excludes `create-next-app`/`create-vite` scaffolding downloads but includes AuraGlass install, `init`, `add`, build and first render). It asserts: total measured wall time ≤300 s (Next) / ≤240 s (Vite); the first screenshot of the built page, taken after `load` plus two `requestAnimationFrame` callbacks, shows `[data-ag-surface][data-ag-layer="chrome"]` with the §15.2 material-presence gate passing; zero console errors; `next build` output contains no "use client" boundary error. The timing is written to `quickstart-timing.json` and consumed as a claim (REQ-DX-78).
- **REQ-DX-56** The quickstarts contain no step that installs an optional peer, configures Tailwind `@source`, or edits `tsconfig.json`. Zero-Tailwind (Vite) and Tailwind v4 (Next) variants both pass REQ-DX-55. Test: `quickstart.spec.ts` matrix `{next-tailwind, next-plain, vite-plain, vite-tailwind}`.
- **REQ-DX-57** The README "Quick start" section is generated from `docs/quickstart/next.md` steps by `scripts/docs/gen-readme.mjs` (NEW); hand edits between `<!-- generated:quickstart -->` markers fail CI. Test: `tests/dx/readme-generated.test.ts`.

### 5.10 TypeScript autocomplete and variants

- **REQ-DX-58** Material role props on every flagship are literal unions re-exported from `aura-glass/material` (`MaterialVariant`, `Thickness`, `Layer`, `ContentMaterial`, `Shape`, `Tier`, `Transparency`, `Backdrop`; architecture §4.2), never `string`. Prop grammar follows SC-24 (owner `PRD-FND`): on every material-bearing component `variant` is the material axis (`'regular' | 'clear' | 'identity'`, default `regular`) with `thickness`, `prominent` and `refraction`; semantic status is `intent` (component-specific subset of `'neutral' | 'info' | 'success' | 'warning' | 'danger'`); there is no `material`, `elevation` or `as` prop. Test: `tests/types/autocomplete.test-d.ts` (tsd/`expectType`) asserts `ComponentProps<typeof Button>['variant']` is exactly `'regular' | 'clear' | 'identity' | undefined`, `ComponentProps<typeof Button>['intent']` is exactly Button's status subset from `Button.meta.ts` `| undefined`, `ComponentProps<typeof Button>['prominent']` is `boolean | undefined`, Button has no `material` or `elevation` key, `ComponentProps<typeof Surface>['variant']` is exactly `MaterialVariant | undefined`, and that `<Button variant="primary" />`, `<Button variant="solid" />` and `<Surface variant="solid" />` are type errors (`@ts-expect-error`; `primary` is the 4.x name rewritten to `prominent` by `prop-grammar`, `solid` is reserved for the transparency axis, D-06).
- **REQ-DX-59** Autocomplete is measured, not assumed: `tests/types/completions.test.ts` drives the TypeScript language service (`ts.createLanguageService` over the packed `.d.ts`) at the cursor in `<Button variant="|"`, `<Button intent="|"`, `<Surface thickness="|"`, `<Dialog.|` and `import { | } from "aura-glass/data"`, and asserts the completion list equals the expected set from the flagship `.meta.ts` (no `string & {}` widening, no internal symbols, no `Glass*` names from root).
- **REQ-DX-60** Every `deprecations.json` entry of `kind: export|prop|prop-value` has a `@deprecated since <since>, removed in <removeIn>. Use {@link <replacement>}.` TSDoc tag (checker `check-tsdoc-deprecated.mjs`, PRD-01). In `aura-glass/compat` the language service reports `deprecated: true` for each export. Test: `completions.test.ts` "compat strike-through" asserts `kindModifiers` contains `deprecated`.
- **REQ-DX-61** Every public prop has TSDoc with a one-line description and `@default` where a default exists; `scripts/docs/gen-props.mjs` fails on a public prop without TSDoc. Test: `tests/dx/tsdoc-coverage.test.ts` (100% of props on T0/T1, ≥95% on T2 at beta, 100% at RC).
- **REQ-DX-62** `data-ag-part` values are typed: each flagship exports `type <Component>Part = 'trigger' | 'content' | …` generated from `.meta.ts`, and the docs selector tables render from the same source. Test: `autocomplete.test-d.ts` "parts".

### 5.11 Theming guide and Tailwind / plain-CSS interop

- **REQ-DX-63** `docs/guides/theming.md` (NEW, rendered at `/docs/theming`) documents exactly one provider pair (`AuraGlassProvider` client, `AuraGlassScript` server), `createGlassTheme` and `createBrandTheme` from `aura-glass/theme`, the 4–6 `ThemePreset`s, the five mode axes (scheme, contrast, transparency, motion, density; architecture §5.4) as `data-ag-*` attributes, nested provider scoping, and the OS-floor rule (B13). It contains a "Coming from 4.x" table mapping the 5 old providers and both `createGlassTheme`s (E-26) to the 5.0 API. Test: `compile-snippets` covers every block; `tests/dx/docs-content.test.ts` asserts the page names no 4.x provider outside the "Coming from 4.x" table.
- **REQ-DX-64** `docs/guides/tailwind.md` (NEW) documents Tailwind v4 only: `@import "tailwindcss"; @import "aura-glass/tailwind.css";`, the generated `@theme inline` mapping, the `glass-regular|clear|thin|thick` and `content-raised` utilities, the `ag-dark|ag-tinted|ag-solid` custom variants (architecture §5.5), that no `@source` is needed, and the layer statement. It states Tailwind v3 is unsupported in 5.0 (B17). Test: `quickstart.spec.ts` `next-tailwind` cell renders an element styled only with `glass-regular` utilities and asserts its computed `backdrop-filter` equals that of `[data-ag-variant=regular]`.
- **REQ-DX-65** `docs/guides/plain-css.md` (NEW) documents the zero-Tailwind path: the `@layer theme, base, ag, components, utilities;` statement, why unlayered app CSS wins without specificity fights (architecture §10), styling via `[data-ag-part]` and `[data-state]` only, overriding tokens by redefining `--ag-*` in the app's own layer, and the partial sheets (`tokens.css`, `material.css`, per-subpath CSS). Test: `tests/dx/plain-css.spec.ts` (remote) renders a Vite app whose `app.css` (unlayered) sets `.cta[data-ag-part="root"] { border-radius: 0 }` on `<Button className="cta">` and asserts the computed `border-radius` is `0px`, with 0 `!important` in `app.css`.
- **REQ-DX-66** `docs/guides/choosing-a-material.md` (NEW) contains the decision table layer × variant × thickness × backdrop with one live example per cell from `apps/docs/examples/material/*`, and the rule "content is not glass by default" (B12). Owned here; content numbers (contrast minima) are `<Claim>`s from the token contrast matrix artifact.
- **REQ-DX-67** shadcn coexistence guide `docs/guides/shadcn.md` (NEW): installing the `auraglass` base into an existing shadcn app, which variables are read vs emitted (§4.4 interchange row), and that AuraGlass components and shadcn components can share a page. Test: `registry-shadcn-interop.spec.ts` renders a shadcn `Button` and an AuraGlass `Button` side by side and asserts both use the same `--primary` resolved colour.
- **REQ-DX-68** Framework guides `docs/guides/{nextjs,vite,react-router,rsc,testing}.md` (NEW). `rsc.md` lists which exports are server-safe and which are client, per subpath, generated from PRD-02's `build/server-safe-exports.json` and the exports manifest. `testing.md` documents the `data-ag-part`/`data-state` testing contract and Jest ESM setup (B2). Test: `docs-content.test.ts` asserts `rsc.md`'s generated table equals `build/server-safe-exports.json`.

### 5.12 Docs app and information architecture

- **REQ-DX-69** `apps/docs` is a Next 16 app with `output: "export"`, React 19, consuming `aura-glass` from the packed tarball (`"aura-glass": "file:../../.artifacts/aura-glass-<version>.tgz"`), never `src/` or a workspace link. Test: `tests/dx/docs-artifact.test.ts` asserts `apps/docs/node_modules/aura-glass/package.json` version equals the packed version and that no `apps/docs/**` file imports `../../src`.
- **REQ-DX-70** Top-level IA, exactly: `Get started` (Introduction, Next quickstart, Vite quickstart, CLI), `Foundations` (Choosing a material, Theming, Accessibility, Motion, Layers & CSS), `Components` (Flagships grouped Controls/Overlays/Navigation/Data/AI/Media, then Core), `Surfaces` (the 10 blocks), `Guides` (Next.js, Vite, React Router, RSC, Tailwind, Plain CSS, shadcn, Testing), `Migrate` (4→5, From MUI, From Radix, From Lucide icons), `API` (generated per subpath). Encoded in `apps/docs/nav.config.ts`; test `tests/dx/docs-ia.test.ts` snapshots the nav tree.
- **REQ-DX-71** Each component page is generated from `<Component>.meta.ts` + API report: import line (correct subpath), live examples, props table (name, type, default, description), `data-ag-part` and `data-state` tables, keyboard table (from the APG script, REQ-A11Y-40), RSC status, size budget and perf grade (`<Claim>` from `size.json` and `perf-grades.json`), "Replaces in 4.x" list, and the selector change table vs 4.x. Pages for non-exported symbols cannot exist: `gen-props.mjs` fails if a page's component is absent from the runtime export snapshot (fixes DOCS-README-02/-11). Test: `tests/dx/docs-pages.test.ts`.
- **REQ-DX-72** All 4.x `docs/**` content is removed from the published site and from the npm tarball in 5.0. This PRD is **consume-only** here (SC-38): the deletion is owned by `PRD-FND` (FND-142, §16 PRD-16 removal); this PRD supplies the path list and verifies it (DX-111). Paths deleted on `main` at 5.0.0-beta.1: `docs/components/**` (stub pages), `docs/guides/consciousness-interface.md`, `docs/guides/consciousness-migration.md`, `docs/liquid-glass/migration.md`, `docs/components/30-genesis-revolutionary/**`, `docs/guides/migration.md`, `docs/guides/ssr-setup.md`, `docs/recipes/readme.md`, `docs/design-tokens.md`. `docs/migration/{lucide-to-auraglass-icons,mui-to-auraglass,radix-to-auraglass}.md` are rewritten into `apps/docs/content/migrate/*`. `docs/release-rollback-deprecation.md` and `docs/auraglass-5/**` stay (internal). Test: `tests/dx/docs-removed.test.ts` asserts these paths are absent on `main` after beta.1.
- **REQ-DX-73** Snippet compilation: `scripts/docs/compile-snippets.mjs` type-checks every `apps/docs/examples/**/*.tsx`, every fenced `tsx|ts|jsx` block in `apps/docs/content/**`, `docs/quickstart/**`, `docs/guides/**` and `README.md` against the packed `.d.ts` (`strict: true`, `jsx: react-jsx`, `moduleResolution: bundler`). Blocks tagged `{fragment}` are wrapped in a generated component. Gate: 0 failures (today 79/278 fail, DOCS-README-01). Test: CI job `docs:snippets`.
- **REQ-DX-74** Import lint: no docs file imports from `@/`, `../src`, `@aura/glass` or any specifier absent from the `exports` map. Test: `tests/dx/docs-imports.test.ts` (fixes DOCS-README-08/-10/-13).
- **REQ-DX-75** Link check: `scripts/ci/verify-markdown-links.js` is extended to be case-sensitive on every OS (resolve with `fs.realpathSync.native` and compare case) and to check `apps/docs` routes. Gate: 0 broken links (fixes DOCS-README-22). Test: `tests/dx/links.test.ts`.
- **REQ-DX-76** Live examples on the docs site render inside an `Environment` with a declared backdrop and a scene switcher (8 scenes from PRD-19); examples obey the OS floors (no forced preferences on the docs site). Every docs page passes `@axe-core/playwright` with colour-contrast on, in Chromium and WebKit (remote). Test: `tests/dx/docs-a11y.spec.ts`.

### 5.13 Generated claims

- **REQ-DX-77** `scripts/docs/gen-claims.mjs` reads the release SHA's CI artifacts (`claims.json` from PRD-19 REQ-QA-31, `size.json`, `perf-grades.json` from REQ-PERF-34, `contrast-matrix.json`, `quickstart-timing.json`, `etc/api/*.exports.json`) and writes `apps/docs/generated/claims.json` `{ id: { value, unit, source: { artifact, sha, path } } }`. Missing artifact, or an artifact whose `sha` differs from the build SHA → build fails. It does not write `README.md` claim regions (PRD-19 `render.ts` does); it fails if a README region's value differs from `claims.json`.
- **REQ-DX-78** Claim ids at GA (minimum): `flagship-count`, `component-count`, `root-value-exports`, `button-gzip-kb`, `styles-css-gzip-kb`, `tarball-mb`, `contrast-min-regular`, `contrast-min-large`, `glass-recipes` (must be 1), `quickstart-seconds-next`, `quickstart-seconds-vite`, `registry-block-count`, `codemod-transform-count`, `pixel-gates-passed`. Rendered via `<Claim id />` in MDX and `<!-- ag:claim id="…" -->…<!-- /ag:claim -->` regions (PRD-19 REQ-QA-31 syntax) in `README.md`, `llms.txt` and the release body. Ids not in PRD-19's minimum set (`quickstart-seconds-*`, `registry-block-count`, `codemod-transform-count`) are added to PRD-19's renderer input by this PRD as artifacts, not typed values.
- **REQ-DX-79** `scripts/docs/lint-claims.mjs` fails on any digit-bearing claim pattern (§4.5) outside a claim reference in `README.md`, `INSTALLATION.md` (deleted in 5.0; content moves to quickstarts), `apps/docs/content/**`, `llms.txt.tmpl`, and the release body generated by `scripts/release/release-notes.mjs` (PRD-01 REQ-REL-23; there is no hand-written release-notes template). Allow-list file `scripts/docs/claims-allow.json` for non-claim numbers (versions, `1440`, `390`, Node `20.19`), each with a reason. Test: `tests/dx/lint-claims.test.ts` (seeded "498 certified" fixture must fail).
- **REQ-DX-80** `README.md` 5.0 is generated from `README.tmpl.md` and contains: one-paragraph pitch, generated quickstart, the 10 surfaces with links, CLI and registry commands, links to docs. It contains no certification runbook, no agent-directed instructions, no hand-maintained peer matrix (generated from `package.json` `peerDependenciesMeta`), and no font redistribution claim (D-31). Test: `readme-generated.test.ts` asserts the absence of `README.md:525-576`'s headings and of the string "final summary".

### 5.14 Migration guide generated from `deprecations.json`

- **REQ-DX-81** `apps/docs/content/migrate/5.mdx` is a thin template; its body is rendered from `gen-deprecations.mjs --docs` output `docs/migration/5.0/deprecations.generated.md` (PRD-01) plus `docs/release/breaking-changes.json` (B1–B21). Sections: "Before you start" (4.3 + `doctor --v5`), "Run the codemods" (one subsection per transform with automation level and fixture example pulled from `__fixtures__/<id>/basic`), "Breaking changes" (B1–B21 table), "By component" (old name → new name, prop table, selector table), "Removed with no successor" (with registry-item or 4.x LTS pointer), "Rollback". Every deprecation has an anchor `#dep-NNNN` matching its `doc` URL. Test: `tests/dx/migration-guide.test.ts` asserts one anchor per entry and that every `doc` URL in `deprecations.json` resolves to an anchor on the built page.
- **REQ-DX-82** The guide contains no hand-written deprecation text: `docs-content.test.ts` asserts that the non-generated parts of `migrate/5.mdx` contain zero `Glass[A-Z]\w+` tokens.
- **REQ-DX-83** Per-component selector change tables (B10) render from each flagship's `.meta.ts` `selectorChanges: Array<{ before: string; after: string }>`. A flagship without the field fails `gen-selectors.mjs`. Test: `docs-pages.test.ts` "selector tables".
- **REQ-DX-84** The 4.x CLI deprecation notice (B15): from 4.3 the 4.x `bin/aura-glass.cjs` prints once per run `aura-glass CLI moved: use npx @auraglass/cli <command>` to stderr (implementation REL-114 on `release/4.x`, `PRD-REL` as interim owner of §16 PRD-17 per SC-37; text owned here as the constant in `packages/cli/src/meta.ts` `MOVED_NOTICE`).

### 5.15 `llms.txt`, per-component markdown, MCP

- **REQ-DX-85** `llms.txt` is generated by `scripts/docs/gen-llms.mjs` from `llms.txt.tmpl`, the exports manifest and `.meta.ts`, following the llms.txt convention (H1, blockquote summary, H2 sections of links). It states the package version from `package.json` (fixes `llms.txt:39` "3.0.x"), the install + `init` commands, the subpath map, the 44 flagships with one line each and a link to `/components/<slug>.md`, the "do not" list (no `Glass*` names from root, no inline optics, no `!important`, style via `data-ag-part`), and nothing about removed components. Size ≤12 KB. Test: `tests/dx/llms.test.ts` (version equality, every linked `.md` exists in the build, no symbol absent from the runtime export snapshot, size).
- **REQ-DX-86** `llms-full.txt` concatenates every component markdown and the guides; size ≤400 KB. Shipped at `https://auraglass.dev/llms-full.txt` only (not in the npm tarball). `llms.txt` ships in the `aura-glass` tarball. Test: `llms.test.ts` "full".
- **REQ-DX-87** Per-component markdown `apps/docs/public/components/<slug>.md` generated from the same data as the HTML page (REQ-DX-71), with import line, props table, parts table, one minimal example that passes `compile-snippets`, and a11y notes. Test: `docs-pages.test.ts` "markdown parity" asserts the props set equals the HTML page's.
- **REQ-DX-88** `packages/mcp` publishes `@auraglass/mcp` with `bin: { "auraglass-mcp": "./dist/server.js" }`, stdio transport, and exactly the five tools in §4.6 with zod input schemas. It performs no network I/O and no file writes (asserted by running under the Node permission model, `node --permission --allow-fs-read=<pkg dir>` on Node ≥22.13 and `--experimental-permission` on Node 20.19, with no `--allow-fs-write` and no `--allow-child-process`; the test runs on both Node lines). Test: `packages/mcp/test/tools.test.ts` (each tool returns schema-valid output for a known and an unknown name; `search_components({ query: "modal" })` returns `Dialog` first; `get_migration({ symbol: "GlassModal" })` returns the `canonical-names` entry).
- **REQ-DX-89** MCP data `packages/mcp/data/mcp-data.json` is generated at release from the same sources as the docs and carries `{ version, sha }`; the server reports them in `serverInfo`. Test: `tools.test.ts` "version".
- **REQ-DX-90** Docs include `/docs/ai-agents` with copy-paste MCP configuration snippets for Claude Code, Cursor and VS Code, and the registry URL for agents that use the shadcn MCP/registry flow. Snippets are JSON validated in `docs-content.test.ts`.
- **REQ-DX-91** The MCP server and `llms.txt` ship by 5.0.0-rc.1; they are not GA blockers (architecture §10), but a stale `llms.txt` (version mismatch) **is** a release blocker because it ships in the tarball.

---

## 6. Files/directories affected (existing paths)

| Path | Change | Notes |
|---|---|---|
| `bin/aura-glass.cjs` | 4.2: `doctor --v5` added on `release/4.x` (DX-150). 4.3: prints the moved notice (REL-114). 5.0: deleted on `main` by DX-149, kept on `release/4.x` | E-01…E-07; logic ported to `packages/cli` |
| `package.json` | 5.0: remove `bin`, remove `bin` from `files`; add `llms.txt` to `files`; scripts `test:cli`, `test:recipes:render`, `test:recipes:cli` replaced by `test:dx:*` | `:8`, `:233`, `:277`, `:300-301` |
| `src/registry/recipes.ts`, `src/registry/index.ts`, `src/registry/StyledComponentsRegistry.tsx` | 4.2: C-D entries per recipe (REQ-DX-52). 5.0: deleted (`src/registry/recipes.ts` by NAV-136 per SC-38; the rest of `src/registry/**` in the same `PRD-NAV`/`PRD-FND` removal PR) | E-10…E-19 |
| `scripts/ci/verify-cli.js` | Replaced by `packages/cli/test/**` | |
| `scripts/ci/verify-recipes-cli.js` | Replaced by `tests/dx/registry-*.test.ts` | |
| `scripts/ci/verify-recipes-render.js` | Replaced by `tests/dx/registry-render.spec.ts`; the pack → scaffold → build → capture flow (`:90-140`, `:348-410`) is reused, the gating logic (`:354-355`, `:398-399`, `:1325-1342`) is not | E-17 |
| `scripts/ci/verify-markdown-links.js` | Extended: case-sensitive, docs-app routes (REQ-DX-75) | E-33 |
| `scripts/ci/run-next-integration.js`, `scripts/ci/run-vite-integration.js` | Superseded for DX purposes by `tests/dx/quickstart.spec.ts`; canaries remain PRD-19's | E-36, E-37 (both modified in the working tree; not touched by this PRD) |
| `scripts/migrate/{doctor,audit-mui,audit-radix,icons-from-lucide,export-tokens}.js` | Ported into `packages/cli/src/migrate/legacy/*`, then deleted in 5.0 | E-08 |
| `scripts/codemods/tw-to-glass.js`, `scripts/codemods/cleanup-glass-duplicates.js`, `tools/codemods/auraglass-from-raw.mjs`, `tools/codemods/focusify.mjs` | Deleted in 5.0 (internal one-shots, never shipped) | E-08 |
| `llms.txt` | Generated from `llms.txt.tmpl` (4.1.1 retraction of claims is PRD-00; generation from 4.2) | E-30 |
| `README.md` | Generated from `README.tmpl.md` in 5.0; 4.1.1 removes `:525-576` (PRD-00) | E-28, E-29 |
| `INSTALLATION.md` | Deleted in 5.0; content → `docs/quickstart/*` | E-29 |
| `docs/components/**`, `docs/guides/{consciousness-interface,consciousness-migration,migration,ssr-setup}.md`, `docs/liquid-glass/migration.md`, `docs/recipes/readme.md`, `docs/design-tokens.md`, `docs/cli/migration.md` | Deleted at 5.0.0-beta.1 by FND-142 (SC-38); verified here (REQ-DX-72, DX-111) | E-21…E-27, E-32 |
| `docs/migration/{lucide-to-auraglass-icons,mui-to-auraglass,radix-to-auraglass}.md` | Rewritten into `apps/docs/content/migrate/*` | |
| `docs/theme/theme-engine.md`, `docs/app-shell/readme.md`, `docs/package-entrypoints.md`, `docs/readme.md` | Replaced by generated docs-app pages | E-26, E-31 |
| `deprecations.json` (repo root), `docs/schemas/deprecations.schema.json` | Consumed (SC-02: instance TRUST-075, schema REL-010); DX-096 adds the 28 recipe entries by MODIFY | E-39 |
| `.github/workflows/deploy-storybook.yml` | Unchanged; a new `docs.yml` deploys `apps/docs` | E-34 |
| `tests/fixtures/consumer-4x/` | Consumed (PRD-01 §11.4 contents, PRD-19 harness) | not yet present |

---

## 7. Components affected

This PRD changes no component behaviour. It consumes each component's public contract and requires metadata from it.

| Component set | What this PRD requires from it | Owner of the data |
|---|---|---|
| All 44 flagships (architecture §11.2) | `<Component>.meta.ts` with `variants`, `parts`, `states`, `examples`, `migration` (4.x names absorbed + prop mapping table), `selectorChanges`, `client: boolean`; TSDoc on every prop | flagship PRDs (controls, overlays, app shell, data/date, AI, media) |
| T0 `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `materialProps` | Literal-union types (REQ-DX-58); docs "Choosing a material" examples; not ejectable | PRD-04 |
| `AuraGlassProvider`, `AuraGlassScript`, `GlassPreferencesPanel`, `createGlassTheme`, `createBrandTheme` | Insertion points for `init`; `auraGlassPrepaintScript` constant for Vite (REQ-DX-12); theming guide content | PRD-03, PRD-05 |
| T2 core (~40) | Same `.meta.ts` contract; reduced docs page (no perf grade until graded) | architecture PRD-14 |
| Every `aura-glass/compat` export | Adapter per surviving 4.x name (REQ-DX-41) | this PRD (adapters) + flagship PRDs (tables) |
| Registry blocks use: AppShell, Sidebar, TopBar, StatusBar, Inspector, MobileShell, TabBar, Thread, Message, Composer, ToolCall, SourceList, Table, FilterBar, TreeView, StatCard, Sparkline, ChartFrame, Timeline, Pagination, MediaControls, NowPlayingBar, CarouselRail, ImageViewer, Dialog, AlertDialog, Sheet, Popover, Menu, CommandPalette, Toast, TextField, Button, Switch, SegmentedControl, Select | Block authoring only; a block bug found in a component is filed to the owning PRD, never patched in the block (no overrides, REQ-DX-46) | owning PRDs |
| 4.x `GlassSearchField` (frozen controlled input in recipes) | None; the recipes are retired (REQ-DX-51) | n/a |

---

## 8. New components/files

| Path (all NEW) | Purpose |
|---|---|
| `packages/cli/package.json`, `packages/cli/src/bin.ts`, `packages/cli/src/meta.ts` | `@auraglass/cli` package, router, name/notice constants |
| `packages/cli/src/commands/{init,add,diff,update,doctor,audit,migrate,list,info}.ts` | Commands (§5.1–§5.5) |
| `packages/cli/src/core/{fs-safety,git-guard,project-detect,package-manager,report,config}.ts` | Safety, detection, config (`auraglass.json`) |
| `packages/cli/src/registry/{fetch,resolve,install,hash}.ts` | Registry client |
| `packages/cli/src/migrate/4to5/{index.ts,catalogue.json,transforms/*.ts,mappings/*.json,__fixtures__/**,__tests__/**}` | Codemod engine, catalogue machine copy, 8 core transforms, fixtures |
| `packages/cli/src/migrate/legacy/{icons-from-lucide,radix-report,mui-report}.ts` | Ported 4.x migrations |
| `packages/cli/schema/{registry-item.json,SOURCE.md,config.json,output/*.json}` | Vendored shadcn schema, config and output schemas |
| `packages/cli/dependency-allowlist.json`, `packages/cli/test/**` | CLI allowlist and tests |
| `packages/mcp/{package.json,src/server.ts,src/tools/*.ts,data/mcp-data.json,test/**}` | `@auraglass/mcp` |
| `registry/registry.json`, `registry/base/auraglass/**`, `registry/blocks/<10 names>/**` (+ `layout.assert.json` each), `registry/items/<names>/**` | Registry source |
| `scripts/registry/{build,lint}.mjs` | Registry build and lint |
| `scripts/docs/{gen-props,gen-selectors,gen-codemod-tables,gen-llms,gen-claims,gen-readme,lint-claims,compile-snippets}.mjs`, `scripts/docs/claims-allow.json`, `scripts/docs/paths.mjs` (`DEPRECATIONS_PATH`, `CONSUMER_4X_PATH` constants, §11.10, §19) | Docs generators and gates |
| `apps/docs/**` (`next.config.ts`, `nav.config.ts`, `content/**`, `examples/**`, `components/{Example,Claim,PropsTable,PartsTable}.tsx`) | Docs app |
| `docs/quickstart/{next,vite}.md` | Executable quickstarts |
| `docs/guides/{theming,tailwind,plain-css,choosing-a-material,shadcn,nextjs,vite,react-router,rsc,testing}.md` | Guides |
| `README.tmpl.md`, `llms.txt.tmpl` | Generated-output templates (release body is generated by PRD-01 `release-notes.mjs`, not a template here) |
| `docs/auraglass-5/registry-recipe-fates.json` | Machine copy of §9.2 |
| `src/compat/index.ts`, `src/compat/<area>/*.tsx`, `src/compat/__tests__/**` | Compat adapters |
| `tests/dx/{quickstart.spec.ts,registry-render.spec.ts,registry-shadcn-interop.spec.ts,codemod-canary.spec.ts,plain-css.spec.ts,docs-a11y.spec.ts,docs-lighthouse.spec.ts,audit-backdrop.remote.spec.ts}`, `packages/cli/test/perf.test.ts`, `tests/dx/recipes-4x.test.ts`, `tests/dx/fixtures/{recipes-4x,large-tree}/` | Remote Playwright lanes, CLI perf, recipe migration fixtures |
| `tests/dx/*.test.ts` (unit/static: `registry-schema`, `registry-blocks`, `registry-lint`, `registry-build`, `recipe-fates`, `readme-generated`, `docs-*`, `links`, `lint-claims`, `llms`, `migration-guide`, `tsdoc-coverage`, `no-bin`, `codemod-perf`) | Static and node tests |
| `tests/types/{autocomplete.test-d.ts,completions.test.ts}` | Type-level DX tests |
| `.github/workflows/{cli.yml,registry.yml,docs.yml}` | CI: CLI tests, registry build + render gate, docs build + deploy. No publish step: npm publishing of all three packages extends `publish-npm.yml` (DoD 4) |
| `tests/dx/fixtures/alpha-smoke/` | Unpublished alpha quickstart target (§20 step 5) |

---

## 9. Components/files to remove or deprecate

### 9.1 Removals and deprecations

| Item | C-D since | Removed | Successor |
|---|---|---|---|
| `aura-glass` `bin` (`bin/aura-glass.cjs`) | 4.3.0 | 5.0.0 | `@auraglass/cli` (B15) |
| `aura-glass/registry` subpath, `auraGlassRecipes`, `getAuraGlassRecipe`, `AuraGlassRecipeId` | 4.2.0 | 5.0.0 | registry JSON + `@auraglass/cli add` |
| 28 recipe ids (as `kind: cli` entries) | 4.2.0 | 5.0.0 | §9.2 |
| `migrate radix|mui --write` | 4.2.0 | 5.0.0 (`--write` rejected) | report-only |
| `scripts/ci/verify-cli.js`, `verify-recipes-cli.js`, `verify-recipes-render.js` | n/a (internal) | 5.0.0-beta.1 | `packages/cli/test`, `tests/dx/*` |
| `scripts/migrate/*`, `scripts/codemods/*`, `tools/codemods/*` | n/a (internal) | 5.0.0-beta.1 | `packages/cli/src/migrate/*` |
| 4.x docs (REQ-DX-72 list), `INSTALLATION.md` | n/a (docs) | 5.0.0-beta.1 | `apps/docs` |

### 9.2 Recipe fates (28 claimed, 28 verified in `src/registry/recipes.ts:1-29`)

Rule: recipes collapse into 10 blocks plus D-17 items; overlapping 3.2/3.3 variants (appshell autopsy §"What exists": at least 8 overlap) fold into the same block. Fate is about *intent*; no recipe code is reused (REQ-DX-53).

| # | Recipe id | Fate | Reason |
|---|---|---|---|
| 1 | `saas-dashboard` | → block `app-frame` | shell + KPI overview |
| 2 | `ai-command-center` | → block `ai-workspace` | |
| 3 | `media-player-surface` | → block `media-viewer` | |
| 4 | `analytics-overview` | → block `analytics-dashboard` | |
| 5 | `settings-billing` | → block `settings` | |
| 6 | `kanban-workspace` | → item `kanban` | D-17 |
| 7 | `calendar-schedule` | delete | no calendar-page block; `DatePicker`/`Calendar` docs examples cover it |
| 8 | `collaborative-workspace` | delete | depended on simulated collaboration (`socket.io-client` peer declared, never imported, E-12) |
| 9 | `admin-data-table` | → block `data-workspace` | |
| 10 | `ecommerce-product-panel` | delete | the capability map lists Checkout as P2 and Pricing as P3 (`AURAGLASS_MISSING_CAPABILITY_MAP.md:134`); its 5.0 targets (`ProductCard`, `CartSummary`, `CheckoutSteps`, `PricingTable`, :135) are registry recipes, deferred here to 5.1 registry items (C-E), not GA blocks |
| 11 | `saas-admin-shell` | → block `app-frame` | the broken-grid recipe (APPSHELL-WORKSPACE-RECIPES-CLI-01); `layout.assert.json` guards the regression |
| 12 | `ai-product-console` | → block `ai-workspace` | claimed shell it lacked (-07) |
| 13 | `media-review-workspace` | → block `media-viewer` | |
| 14 | `commerce-operations-panel` | delete | as #10 |
| 15 | `team-collaboration-hub` | delete | as #8 |
| 16 | `settings-and-billing-suite` | → block `settings` | duplicate of #5 |
| 17 | `analytics-command-center` | → block `analytics-dashboard` | duplicate of #4 |
| 18 | `calendar-operations-board` | delete | as #7 |
| 19 | `customer-support-console` | → block `support-inbox` | |
| 20 | `creator-studio-dashboard` | delete | marketing-style composition, no product surface |
| 21 | `ai-ops-control-room` | → block `ai-workspace` (ToolCall/AgentSteps state) + item `ai-trace-tree` | |
| 22 | `semantic-search-console` | → block `overlay-flows` (CommandPalette search) | frozen input (-11) |
| 23 | `vision-review-workbench` | delete | tied to removed Vision service (B14) |
| 24 | `collaboration-room-console` | delete | as #8 |
| 25 | `support-triage-workspace` | → block `support-inbox` | frozen input (-11) |
| 26 | `release-command-center` | → block `data-workspace` (Timeline + Table) | |
| 27 | `developer-docs-portal` | delete | the docs app is the reference |
| 28 | `marketing-launch-kit` | delete | marketing surfaces are not a 5.0 product surface |

Totals by primary fate: **16 → block** (#1–5, 9, 11–13, 16, 17, 19, 21, 22, 25, 26; they land in 8 of the 10 blocks, while `auth` and `mobile-settings` are new), **1 → item** (#6 `kanban`), **11 delete** (#7, 8, 10, 14, 15, 18, 20, 23, 24, 27, 28). 16 + 1 + 11 = 28. #21 also seeds the secondary item `ai-trace-tree` (owned by the AI PRD). The machine copy (REQ-DX-51) is authoritative; its test asserts 28 rows with exactly one primary fate each.

---

## 10. API changes

| API | Change | Class | When |
|---|---|---|---|
| `aura-glass` `bin` `aura-glass` | Removed; replaced by `@auraglass/cli` `auraglass` | C-D in 4.3, C-B in 5.0 | B15 |
| `aura-glass/registry` (`auraGlassRecipes`, `getAuraGlassRecipe`, `AuraGlassRecipeId`, `StyledComponentsRegistry`, registry guard helpers) | Removed | C-D in 4.2, C-B in 5.0 | B4 |
| `@auraglass/cli` package and commands `init`, `add [--source]`, `diff`, `update`, `doctor [--v5]`, `audit deps|imports|backdrop`, `migrate 4to5`, `migrate icons --from lucide`, `list`, `info` | New package | C-E (new package; its own semver tracks core major) | 4.3 beta (`migrate 4to5 --dry-run`), 5.0.0-alpha (full) |
| `migrate radix|mui --write` | Rejected with exit 2 | C-B for the CLI (was a silent no-op) | `@auraglass/cli` 5.0 |
| `doctor` Radix/MUI findings | `fail` → `info` | C-I in behaviour terms (less strict) | `@auraglass/cli` 5.0 |
| CLI `--json` output schemas | New versioned schemas `packages/cli/schema/output/*.json`; breaking changes to them follow CLI semver | C-E | 5.0 |
| `auraglass.json` config | New | C-E | 5.0 |
| Registry `https://auraglass.dev/r/*.json`, `@auraglass/registry` | New; items are outside `aura-glass` semver (consumer-owned once installed) and versioned per release under `/r/v/<version>/` | C-E | 5.0.0-beta |
| `aura-glass/compat` | New entry; every export C-D from 5.0.0, removed in 6.0 (D-18) | C-E (entry) / C-D (exports) | 4.3 preview, 5.0 |
| `aura-glass/theme` `auraGlassPrepaintScript` (string constant) | Requested addition (PRD-05 owns) | C-E | 5.0.0-alpha |
| `<Component>Part` types, literal-union role types | New exported types | C-E | 5.0 |
| `@auraglass/mcp` | New package | C-E | 5.0.0-rc |
| `llms.txt` content | Regenerated; agent-facing names change to 5.0 | C-I (docs) | 4.2 (4.x names, correct version), 5.0 (5.0 names) |

---

## 11. Migration concerns

1. **CLI users (B15).** 4.x users who script `npx aura-glass add …` keep working on 4.x. From 4.3 the 4.x CLI prints `MOVED_NOTICE`. `@auraglass/cli` does not register an `aura-glass` bin name, to avoid shadowing a 4.x install in the same project.
2. **Recipe users.** Copied recipe files remain the user's code and keep compiling against 4.x. Against 5.0 they reference removed names; `migrate 4to5` rewrites them like any consumer code, and the `removed` transform points to the replacement block. REQ-DX-39 proves the run on all 28 recipe files terminates and lists expected TODOs. The recommended path is to replace them with the mapped block (`auraglass add <block>`).
3. **Scope fallback (D-23).** If `@auraglass` is not verified owned before 4.2, every doc, notice and generated snippet uses `aura-glass-cli`, `aura-glass-mcp`, `aura-glass-registry`, from the single `PACKAGE_NAME` constant and a docs-build variable. No document hard-codes the scope.
4. **Codemod damage.** Dirty-tree refusal (REQ-DX-06, NEW) means `git checkout .` restores the tree; `--transform <id>` re-runs one transform. Each transform bug is fixed with a fixture first (architecture §14.6).
5. **Deviation: dirty-tree refusal is new, not kept.** The architecture (§3.1, §14.2) and PRD-01 (§11.2) describe dirty-tree refusal as existing 4.x behaviour. Evidence E-04 shows it does not exist. This PRD implements it; PRD-01's contract is unchanged.
6. **TODO spelling (resolved, SC-33).** The canonical marker is `TODO(aura-glass 5)` (PRD-01, architecture §14.2). The AI PRD's `TODO(auraglass-5)` (REQ-AI-48) is changed by `PRD-AI` (AI-115); REQ-DX-35 enforces one spelling so one grep finds all TODOs.
7. **Deviation: `doctor` no longer fails on Radix.** 4.x `doctor` marks MUI/Radix/Lucide as forbidden (`bin/aura-glass.cjs:31-40`). 5.0 targets drop-in use inside shadcn apps (architecture §5.5, research `competitors.md:13-15`, shadcn's default base is Base UI, with Radix and React Aria still selectable), so a fail would block the main adoption path (REQ-DX-24).
8. **Fixture path conventions (resolved, SC-33/SC-34).** The canonical engine layout is `packages/cli/src/migrate/4to5/{index.ts,catalogue.json,transforms/<id>.ts,mappings/*.json,__fixtures__/<id>/<case>/{input,output}.*,__tests__/}`. Area transforms live at `transforms/<id>.ts` with cases under `__fixtures__/<id>/<case>/` or area subfolders under a core transform (`__fixtures__/canonical-names/controls/*`), discovered automatically (REQ-DX-31). The AI, Motion, Data, Media and Overlays PRDs change their non-canonical paths (`packages/cli/transforms/`, `packages/cli/src/codemods/`, `src/media/__codemod__/`, `tools/codemods/fixtures/`, `codemods/fixtures/overlays/`) per SC-33. Compat adapters live at `src/compat/<area>/<OldName>.tsx`, re-exported from `src/compat/index.ts` (DX-065); the AI PRD's single-file `src/compat/ai.tsx` becomes `src/compat/ai/*.tsx` (SC-34).
9. **`ai-eval-dashboard` is an item, not a block (resolved, SC-32)** (REQ-DX-47). The AI PRD changes the `type` field; its content and tests are unchanged.
10. **`deprecations.json` location (resolved, SC-02).** The file is the repo-root `deprecations.json` with `{"$schema": "./docs/schemas/deprecations.schema.json", "version": 1, "entries": [...]}` from the first 4.1.1 commit (no v0 seed). Every generator and test in this PRD reads the path from `scripts/docs/paths.mjs` `DEPRECATIONS_PATH` (DX-019), whose value is `deprecations.json`. The `exception` enum (`security|privacy|crash|legal|honesty`) and entry schema are `PRD-REL`'s (SC-03); `doctor --v5` and the migration guide only read them.
11. **Docs deletion and SEO.** Deleting 4.x docs at beta.1 breaks inbound links. `apps/docs/redirects.json` (generated from `deprecations.json` `doc` fields plus a hand list for guides) is compiled into the host's redirect config (`apps/docs/vercel.json` `redirects`, permanent 301), because Next `output: "export"` does not apply `next.config` redirects. A `/v4` route points to the 4.x GitHub tag docs. Test: `tests/dx/links.test.ts` "redirects" asserts every deleted docs path in REQ-DX-72 has a redirect entry.
12. **Third-party deps in blocks and items.** Blocks and items declare every third-party package they import in `dependencies` (lint REQ-DX-46); `add` installs them. `ai-workspace` brings the AI SDK packages its route and adapter import (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, per the AI PRD); `data-workspace` needs none beyond `@tanstack/*`, which are `aura-glass` dependencies. Items (`kanban`, `rich-text`, `code-surface`) bring `@dnd-kit/core`, Tiptap, CodeMirror and Shiki, which never enter `aura-glass` (allowlist D-29).
13. **Tailwind v3 users** cannot use `aura-glass/tailwind.css`. The tailwind guide says so and points to the plain-CSS path, which needs no Tailwind at all.

---

## 12. Tests required

Node/static tests run in CI (Vitest). Every `*.spec.ts` that launches a browser or builds an app runs in the remote lane (GitHub Actions or the PRD-19 remote runner), never on a developer Mac.

| Test file | Asserts | REQ |
|---|---|---|
| `packages/cli/test/package.test.ts` | bin name, ESM, `engines.node`, name constant | 01 |
| `packages/cli/test/deps.test.ts` | runtime deps = allowlist, exact pins | 02 |
| `tests/dx/no-bin.test.ts` | packed `aura-glass@5` has no `bin`, no `bin/` files | 03 |
| `packages/cli/test/contract.test.ts` | `--json` schema validity and exit codes per command | 04 |
| `packages/cli/test/fs-safety.test.ts` | path escapes refused (4 cases), atomic writes, abort leaves no partial file | 05, 07 |
| `packages/cli/test/git-guard.test.ts` | dirty tree → exit 3; `--allow-dirty`; non-git → exit 3; `--allow-no-git` | 06 |
| `packages/cli/test/dry-run.test.ts` | zero writes under `--dry-run` for every writing command | 08 |
| `packages/cli/test/version.test.ts` | no stale version strings; `--version` | 09 |
| `packages/cli/test/commands/list-info.test.ts` | list/info output from registry index | 10 |
| `packages/cli/test/commands/init.{next,vite,shadcn,install}.test.ts` | file patches per fixture; idempotent second run; install argv per package manager; shadcn alias reuse | 11–15 |
| `packages/cli/test/commands/add.test.ts`, `add.rsc-alias.test.ts`, `add.eject.test.ts` | resolve, cycle error, cssVars merge, header hash, `"use client"` rule, alias rewrite, eject compiles and contains no optics literals | 16–18, 21–22 |
| `packages/cli/test/commands/{diff,update}.test.ts` | four diff states; update refusal and `.auraglass-upstream` sidecar | 19–20 |
| `packages/cli/test/commands/doctor.test.ts`, `doctor.shadcn.test.ts`, `doctor.v5.test.ts` | each check id; shadcn/Radix app has no `fail`; `--v5` summary equals expected on consumer-4x | 23–25, 52 |
| `packages/cli/test/commands/audit.compat.test.ts`, `audit-backdrop.test.ts`, `tests/dx/audit-backdrop.remote.spec.ts` (remote) | 4.1.0 JSON shape preserved; backdrop audit uses remote endpoint only, no browser module bundled; real endpoint returns pass/fail on the two fixture surfaces | 26–27 |
| `packages/cli/test/commands/migrate-legacy.test.ts` | `radix|mui --write` exit 2; `icons --from lucide` parity with 4.1.0 | 28 |
| `packages/cli/src/migrate/4to5/__tests__/runner.test.ts` | order, unknown id, report schema, exit on TODO | 29, 35, 37 |
| `…/__tests__/fixtures.test.ts` | byte-equal output and idempotence for every case directory | 30–31 |
| `…/__tests__/catalogue-coverage.test.ts` | every PRD-01 §11.2 required case exists | 31 |
| `…/__tests__/fixtures-typecheck.test.ts` | inputs compile vs 4.3 `.d.ts`, outputs vs 5.0 `.d.ts` | 32 |
| `…/__tests__/no-hardcoded-names.test.ts`, `deprecation-coverage.test.ts`, `todo-format.test.ts`, `preserve.test.ts` | mappings-only, coverage of every codemod-bearing deprecation, TODO format, attribute preservation | 33–36 |
| `tests/dx/codemod-canary.spec.ts` (remote) | consumer-4x: 0 flagship TODOs, `tsc`, `next build`, 3-engine smoke, second run 0 changes | 38 |
| `tests/dx/codemod-perf.test.ts` (remote) | 2,000 files ≤60 s, ≤1.5 GB RSS | 40 |
| `tests/dx/recipes-4x.test.ts` | 28 recipe files migrate without exception; TODOs equal expected list | 39 |
| `src/compat/__tests__/manifest.test.ts`, `adapters.test.tsx` | export list = manifest; no removed component; warn once, dev only, never throw | 41–42 |
| `tests/dx/registry-schema.test.ts`, `registry-blocks.test.ts`, `registry-lint.test.ts`, `registry-build.test.ts` | schema validity; 10 blocks + item set; lint rules incl. seeded failures; deterministic build; certified SHA | 43, 45–47, 49–50, 53 |
| `tests/dx/registry-shadcn-interop.spec.ts` (remote) | shadcn CLI installs base into a shadcn app; `next build`; shared `--primary` | 44, 67 |
| `tests/dx/registry-render.spec.ts` (remote) | every block × {Next, Vite} × {1440, 390} × {light, dark} × {glass, solid}: zero console/page errors per capture, pixel gates, layout asserts, no overflow | 48 |
| `tests/dx/recipe-fates.test.ts` | 28 fates, targets exist | 51 |
| `tests/dx/quickstart.spec.ts` (remote) | 4-cell matrix; ≤300 s; material presence; zero console errors; Tailwind utility parity | 54–56, 64 |
| `tests/dx/readme-generated.test.ts` | generated sections unchanged by hand; runbook absent | 57, 80 |
| `tests/types/autocomplete.test-d.ts`, `tests/types/completions.test.ts` | literal unions; completion lists; deprecated modifiers; part types | 58–60, 62 |
| `tests/dx/tsdoc-coverage.test.ts` | TSDoc coverage thresholds | 61 |
| `tests/dx/plain-css.spec.ts` (remote) | unlayered app CSS wins without `!important` | 65 |
| `tests/dx/docs-content.test.ts` | theming page names no 4.x provider outside the mapping table; rsc table = manifest; no hand-written `Glass*` in migration prose; MCP config snippets valid | 63, 68, 82, 90 |
| `tests/dx/docs-artifact.test.ts`, `docs-ia.test.ts`, `docs-pages.test.ts`, `docs-removed.test.ts`, `docs-imports.test.ts`, `links.test.ts` | tarball consumption; nav snapshot; generated pages only for exported symbols; selector tables; markdown parity; removed docs; import lint; links | 69–75, 83, 87 |
| CI job `docs:snippets` (`scripts/docs/compile-snippets.mjs`) | 0 snippet compile failures | 73 |
| `tests/dx/docs-a11y.spec.ts` (remote) | axe with colour contrast on, every docs route, Chromium + WebKit | 76 |
| `tests/dx/lint-claims.test.ts` | seeded "498 certified" fails; claims resolve to artifacts | 77–79 |
| `tests/dx/migration-guide.test.ts` | one anchor per deprecation; every `doc` URL resolves | 81 |
| `tests/dx/llms.test.ts` | version equality, links exist, only exported symbols, size ≤12 KB / ≤400 KB | 85–86 |
| `packages/mcp/test/tools.test.ts` | 5 tools, schemas, ranking, no network or fs-write under the permission model, version in `serverInfo` | 88–89 |

---

## 13. Storybook requirements

Storybook remains the Material Lab (PRD-19, architecture §15.4); the docs app is the public reference. DX requirements on Storybook:

1. **Blocks in Storybook.** Each of the 10 registry blocks has a story `src/stories/blocks/<Block>.stories.tsx` (NEW) that imports the block's files from `registry/blocks/<name>/` (the exact registry source, no copies), under the `environment` toolbar global with all 8 scenes. Stories carry `tags: ["block", "certified"]` and no story-level CSS (`!important` count 0, gap analysis §4.2 "no story-level overrides").
2. **One source for examples.** Docs examples (`apps/docs/examples/**`) and Storybook stories for flagships share the `.meta.ts` `examples` entries; a story may not contain a usage that the docs do not, and vice versa. Test: `tests/dx/docs-pages.test.ts` "story parity" compares example ids.
3. **No meta copy.** Story and block text is product-realistic; `registry-lint` rules on "Lorem/example/demo" apply to block stories.
4. **Storybook is not the quickstart.** The quickstart never links to Storybook as the way to see components; it links to docs pages that render the packed artifact.
5. **Deprecated stories.** 4.x recipe stories (if any are found by `rg "recipes" src/stories`) are deleted with `src/registry` in 5.0.

---

## 14. Responsive requirements

1. **Every block** passes REQ-DX-48 at 1440×900 and 390×844 with no horizontal overflow (`document.scrollingElement.scrollWidth ≤ innerWidth`), and with layout asserts per breakpoint in `layout.assert.json`. `mobile-settings` is certified at 390 only and additionally at 360×740.
2. **Blocks use container queries and component props**, never viewport-only `md:`/`lg:` utility classes (APPSHELL-WORKSPACE-RECIPES-CLI-02). `registry-lint` fails on `/\b(sm|md|lg|xl|2xl):/` in block files unless the project is Tailwind v4 *and* the class is a Tailwind core utility; AuraGlass-prefixed responsive classes are always forbidden.
3. **Docs app** is usable at 320 px width: navigation collapses into a `Sheet`; code blocks scroll horizontally inside their own container; live examples have a 390 px preview toggle. Test: `docs-a11y.spec.ts` also captures 390×844 and asserts no page-level horizontal overflow.
4. **Quickstart result** (the `app-frame` block) is verified at both viewports in `quickstart.spec.ts`.
5. **Touch targets** in blocks meet the a11y floor (≥24×24 CSS px per WCAG 2.2 AA 2.5.8; ≥44×44 for primary mobile controls in `mobile-settings`), asserted by bounding-box checks in `registry-render.spec.ts`.

---

## 15. Accessibility requirements

1. **Blocks** pass `@axe-core/playwright` with colour contrast **on**, in Chromium and WebKit, in light and dark, `glass` and `solid` transparency, and under emulated `forcedColors: active`, `prefers-contrast: more` and `reducedMotion: reduce`. 0 violations of impact `serious` or `critical`. Each block has a landmark structure (`banner`, `navigation`, `main`), exactly one `h1`, and keyboard reachability of every interactive element (scripted tab walk in `registry-render.spec.ts`).
2. **OCR text contrast** on rendered block pixels meets the §15.2 gate (worst case across scenes): ≥4.5:1 body text, ≥3:1 large text and UI glyphs.
3. **No frozen or fake controls** in blocks (REQ-DX-46 AST rule). Every input is uncontrolled or wired to state.
4. **Docs app**: WCAG 2.2 AA; skip link; visible focus ring from the library's focus token; code blocks are focusable when scrollable (`tabindex="0"`, `role="region"`, `aria-label`); the scene switcher is a `SegmentedControl` with radiogroup semantics; docs respect `prefers-reduced-motion` and `prefers-reduced-transparency` (no forced preferences). Every component page documents its keyboard table from the APG script.
5. **CLI output** is screen-reader and CI friendly: no information conveyed by colour alone (status words `pass/info/warn/fail` always printed), `NO_COLOR` and non-TTY disable colour, no spinners when `!process.stdout.isTTY`. Test: `contract.test.ts` "no colour without TTY".
6. **Generated a11y claims** ("WCAG AA", contrast minima) appear only as `<Claim>`s backed by the contrast-matrix and axe artifacts (REQ-DX-77).

---

## 16. Performance requirements (numeric budgets)

All timings measured on the remote CI runner class used by PRD-19 (recorded in each artifact); never on a developer Mac.

| Metric | Budget | Measured by |
|---|---|---|
| Install to beautiful, Next 16 (AuraGlass install + `init` + `add app-frame` + `next build` + first render) | ≤300 s wall clock; target ≤180 s | `quickstart.spec.ts` → `quickstart-timing.json` |
| Install to beautiful, Vite | ≤240 s; target ≤120 s | same |
| Quickstart length | ≤6 shell commands, ≤2 manual edits (target 0) | step count in `docs/quickstart/*.md` |
| `npx @auraglass/cli --version` cold start (installed) | ≤300 ms | `packages/cli/test/perf.test.ts` (NEW, 20 runs, p95) |
| `@auraglass/cli` unpacked install size incl. deps | ≤15 MB | `npm pack` + install in `deps.test.ts` |
| `auraglass init` on a fresh Next app (no install) | ≤2 s | `init.next.test.ts` timing |
| `auraglass add app-frame` (local registry, no install) | ≤3 s | `add.test.ts` timing |
| `migrate 4to5` on 2,000 TSX files | ≤60 s, ≤1.5 GB RSS | `codemod-perf.test.ts` |
| `migrate 4to5` on consumer-4x fixture | ≤15 s | `codemod-canary.spec.ts` |
| `doctor` on consumer-4x | ≤5 s | `doctor.v5.test.ts` |
| Registry item JSON | ≤150 KB per block, ≤400 KB per item (`code-surface`, `rich-text`), ≤40 KB for `auraglass` base | `registry-build.test.ts` |
| Block runtime: first render JS for `app-frame` (Next production, gzip, excluding React/Next) | ≤60 KB provisional, calibrated at alpha against §3.6 per-import budgets, ratchet down only | `registry-render.spec.ts` bundle stats |
| Block runtime: no long task >50 ms during first render on emulated mid-tier mobile (4× CPU throttle) | 0 long tasks >200 ms; ≤2 long tasks >50 ms | `registry-render.spec.ts` trace |
| Docs app: Lighthouse (mobile, remote) on home, a component page, the migration guide | Performance ≥90, Accessibility 100, Best practices ≥95; LCP ≤2.5 s; CLS ≤0.05; INP ≤200 ms (lab TBT ≤200 ms) | `tests/dx/docs-lighthouse.spec.ts` (NEW) |
| Docs app: static build | ≤10 min CI; total `out/` ≤150 MB | `docs.yml` |
| `llms.txt` / `llms-full.txt` | ≤12 KB / ≤400 KB | `llms.test.ts` |
| MCP server start to `initialize` response | ≤500 ms; data bundle ≤5 MB | `packages/mcp/test/tools.test.ts` |
| Snippet compilation gate | ≤5 min CI for all snippets | `docs:snippets` job |

---

## 17. Acceptance criteria

| ID | Criterion (measurable) |
|---|---|
| AC-DX-01 | `npm view @auraglass/cli` (or `aura-glass-cli` under D-23 fallback) shows a version published from CI with provenance; `npm view aura-glass@5 bin` is empty |
| AC-DX-02 | All `packages/cli/test/**` pass; command coverage: every command and flag in §5.1–§5.5 has ≥1 test (coverage report `packages/cli/coverage/lines ≥ 90%`) |
| AC-DX-03 | Writing into a dirty git tree exits 3 for all 5 writing commands; path-escape cases exit 3 (4/4) |
| AC-DX-04 | `init` then `add app-frame` in each of the 4 quickstart cells produces a page that passes material presence, zero console errors, in ≤300 s (Next) / ≤240 s (Vite) on the GA SHA |
| AC-DX-05 | `migrate 4to5` on `tests/fixtures/consumer-4x/`: 0 TODOs in flagship-subset files, `tsc` 0 errors, `next build` exit 0, smoke green in 3 engines, second run 0 changes |
| AC-DX-06 | 100% of PRD-01 §11.2 required fixture cases exist and pass byte-equality + idempotence; 100% of `deprecations.json` entries with `codemod != null` are covered by ≥1 fixture |
| AC-DX-07 | `registry/registry.json` validates; exactly 10 blocks; every item has `meta.auraglass.certified` = GA SHA |
| AC-DX-08 | `registry-lint` reports 0 `!important`, 0 colour literals, 0 inline optics, 0 undeclared/unused dependencies, 0 frozen inputs across `registry/**` |
| AC-DX-09 | `registry-render.spec.ts`: every block passes every capture cell (10 blocks × 2 frameworks × 2 viewports × 2 schemes × 2 transparencies = 160 cells), each with zero console/page errors |
| AC-DX-10 | `npx shadcn@latest add https://auraglass.dev/r/auraglass.json` and `…/r/app-frame.json` into a fresh shadcn Base UI app succeed and `next build` exits 0 |
| AC-DX-11 | `registry-recipe-fates.json` has 28 rows: 16 block, 1 item, 11 delete; `src/registry/**` absent on `main` at 5.0.0-beta.1 |
| AC-DX-12 | `completions.test.ts`: completion sets at the 5 probe positions equal expected sets exactly; `@ts-expect-error` cases all error |
| AC-DX-13 | TSDoc coverage 100% on T0/T1 public props at RC |
| AC-DX-14 | `docs:snippets` 0 failures across all docs, quickstarts, guides and README (baseline 79/278 failing) |
| AC-DX-15 | Docs import lint 0 violations; link check 0 broken (case-sensitive) |
| AC-DX-16 | Every docs page: axe 0 serious/critical with colour contrast on (Chromium + WebKit); Lighthouse budgets of §16 met on the 3 probe pages |
| AC-DX-17 | `lint-claims` 0 unsourced numeric claims in README, docs content, `llms.txt`, release notes; every `<Claim>` resolves to an artifact with the GA SHA |
| AC-DX-18 | Migration guide has one anchor per `deprecations.json` entry and 0 hand-written `Glass*` tokens outside generated sections |
| AC-DX-19 | `llms.txt` version equals `package.json` version; 0 symbols absent from the runtime export snapshot; ≤12 KB |
| AC-DX-20 | `@auraglass/mcp` 5 tools pass schema tests; runs with no fs-write/child-process permission; `get_migration("GlassModal")` returns the `canonical-names` entry |
| AC-DX-21 | No component page exists for a symbol absent from the runtime export snapshot (baseline: 85 bindings, 143 stub pages) |
| AC-DX-22 | Each of the 10 guides in REQ-DX-63…68 exists and is linked from the IA; `docs-ia.test.ts` snapshot approved by the DX owner |

---

## 18. Definition of done

1. Every REQ-DX-01…91 is implemented and its named test passes in CI on the GA SHA; remote lanes have artifacts linked from the release.
2. Every AC-DX-01…22 is green on the GA SHA; the numbers they assert are rendered as claims, not typed.
3. Architecture §16 exit criteria met: PRD-18 "codemods clean on canaries; every block renders" (AC-DX-05, AC-DX-09); PRD-20 "docs lint green; zero unsourced claims" (AC-DX-14, -15, -17).
4. `@auraglass/cli`, `@auraglass/registry` and `@auraglass/mcp` publish only from the tag workflow `.github/workflows/publish-npm.yml` with OIDC provenance (SC-05: owner `PRD-REL`, instance TRUST-077; the filename stays because npm trusted publishing is bound to it; guard `scripts/ci/require-ci-publish.js` checks `GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v`). DX-145 only adds the package steps by MODIFY. Each new package needs an npm trusted-publisher binding, an operator-only npm setting; this PRD records the exact binding (package name, repository, workflow file) in `packages/*/PUBLISHING.md` and does not publish with a token in the meantime. `docs.yml` deploys `auraglass.dev` from the same SHA.
5. The 4.x CLI on `release/4.x` prints the moved notice (4.3, REL-114) and `doctor --v5` (4.2, DX-150) works against consumer-4x (text and expected output owned here; release gate held by `PRD-REL`, SC-37).
6. No 4.x doc page, recipe, or repo-internal codemod script remains on `main`; redirects for removed docs URLs return 301 to their successors.
7. Release notes' "CLI", "Registry" and "Docs" sections are generated; the human review checklist (architecture §15.2 Manual lane) includes a blind review of the 10 blocks for "reads as one hand", performed on remote captures.
8. The DX owner has run the Next and Vite quickstarts once by hand from the published packages (not tarballs) after GA promotion, and the timing is within 20% of the CI artifact; deviations are filed as P1.

---

## 19. Dependencies (architecture §16 numbering)

| Key (§16) | What this PRD needs | Anchor tasks (`depends_on`, SC-40) | Needed by |
|---|---|---|---|
| `PRD-TRUST` (PRD-00) | Repo-root `deprecations.json` seed (`version: 1`, SC-02); README runbook removal; `llms.txt` claim retraction; npm-pack helper `scripts/ci/lib/npm-pack.js` (SC-06); 4.1.1 API report instance; publish workflow instance and CI-publish guard (SC-05) | TRUST-075, TRUST-002, TRUST-071, TRUST-077, TRUST-079 | 4.1.1 |
| `PRD-REL` (PRD-01; interim §16 PRD-17, SC-37) | Deprecation schema and enums (SC-03) + `gen-deprecations.mjs --codemods/--compat/--docs`; codemod id catalogue (§11.2, SC-33; machine copy `catalogue.json` is DX-042); B1–B21 register `docs/release/breaking-changes.json`; frozen fixture `tests/fixtures/consumer-4x/` (SC-08); API reports `etc/api/` (SC-04); `warnDeprecated`; TSDoc deprecation checker; release notes generator; moved notice in the 4.x CLI; 4.2/4.3 bridge gates | REL-010, REL-070, REL-106, REL-100, REL-115, REL-072, REL-077, REL-033, REL-114 | 4.2 |
| `PRD-PKG` (PRD-02) | Exports manifest, `build/server-safe-exports.json`, tsdown/build pipeline, `scripts/ci/verify-deps.mjs` + allowlists (SC-14), size budgets `docs/size-budgets.json` (SC-15), `src/styles/index.css` | PKG-005, PKG-092, PKG-008, PKG-009, PKG-056, PKG-057, PKG-048, PKG-101 | alpha |
| `PRD-DS` (PRD-03) | Token compiler and `tokens.css`, `tailwind.css` bridge, shadcn interchange vars, `compat/tokens.css` alias map, `createGlassTheme`/`createBrandTheme`, presets | DS-016, DS-090, DS-103, DS-083 | alpha |
| `PRD-MAT` (PRD-04) | `aura-glass/material` types and `materialProps()`; `Surface` | MAT-001, MAT-047 | alpha |
| `PRD-A11Y` (PRD-05) | `AuraGlassProvider`, `AuraGlassScript`, `auraGlassPrepaintScript` export (accepted, SC-23), `GlassPreferencesPanel`, contrast matrix, APG scripts for keyboard tables | A11Y-029, A11Y-032, A11Y-034, A11Y-088, A11Y-073 | alpha |
| `PRD-FND` (PRD-07/14/16) | Parts registry and `.meta.ts` contract; prop grammar owner (SC-24); 4.x docs deletion (SC-38) | FND-005, FND-142 | alpha; beta.1 |
| `PRD-CTL`, `PRD-OVL`, `PRD-NAV`, `PRD-DATA`, `PRD-AI`, `PRD-MED` (PRD-08…PRD-13) | `.meta.ts` per component incl. `migration` prop tables and `selectorChanges`; certified components used by blocks; block content per SC-32; area transforms per SC-33; recipes removal (NAV-136) | CTL-055, CTL-057, OVL-040, OVL-131, NAV-095, NAV-106, NAV-136, NAV-145, DATA-108, DATA-133, AI-075, AI-107, AI-108, AI-115, MED-155, MED-153 | 4.3 code freeze for name and prop mapping tables (4.3 is the last minor that may add a 5.0 deprecation, architecture §14.1; 4.4 only if needed), so `canonical-names`/`prop-grammar` ship complete in the 4.3 `--dry-run` beta; beta for `selectorChanges`; RC for certification |
| `PRD-MOT` (PRD-06) | `reduced-motion-initial`, `motion-imports`, `motion-props` transforms + fixtures | MOT-001, MOT-090 | beta |
| `PRD-PERF` | `perf-grades.json` (REQ-PERF-34) | PERF-042 | GA |
| `PRD-QA` (PRD-19) | Remote runner and cert Playwright config, 8 scenes (SC-28), pixel gates, OCR, axe lane, `claims.json` and the README claim-region renderer (REQ-QA-31), `consumer-4x-frozen` job, remote capture endpoint for `audit backdrop` (no task yet, §21) | QA-018, QA-039, QA-087, QA-091 | alpha (harness), GA (artifacts) |
| `PRD-SB` (PRD-19 Storybook half) | `.storybook/preview.tsx` environment global for block stories | SB-048 | beta |

Blocking external facts: npm scope `@auraglass` ownership (D-23) before 4.2; `auraglass.dev` domain and hosting (existing project deployment path) before beta.

---

## 20. Execution order

1. **4.1.1 (week of 2026-10-12, with PRD-00):** confirm `llms.txt` and README retractions land; record E-04 (no dirty-tree refusal) with PRD-01.
2. **Scaffold (before 4.2):** create `packages/cli` with `fs-safety`, `git-guard`, `project-detect`, `--json` contract and ported `list/info/audit/migrate icons` with parity tests (REQ-DX-01…10, 26, 28). Verify the npm scope (D-23) and lock `PACKAGE_NAME`.
3. **4.2 (2026-11-16, bridge train held by `PRD-REL`, SC-37):** `doctor --v5` (REQ-DX-25) in `@auraglass/cli` (DX-037) and the 4.x CLI (DX-150); recipe `deprecations.json` entries (REQ-DX-52); `llms.txt` generator with 4.x names (REQ-DX-85); `registry-recipe-fates.json` (REQ-DX-51).
4. **Codemod engine (Nov–Dec 2026):** runner, mapping generation, the 8 core transforms with every PRD-01 fixture case, typecheck and coverage meta-tests (REQ-DX-29…37). `imports-subpaths`, `dead-optical-props`, `providers`, `deps` first (mappings known in 4.2); `canonical-names`, `prop-grammar`, `css-vars`, `removed` as flagship tables land (all by the 4.3 code freeze, §19).
5. **Alpha (from 2026-12, before 4.3):** `init` and `add` against a local registry (REQ-DX-11…22); registry base `auraglass` (REQ-DX-44); quickstart spec running in the remote lane (REQ-DX-54…57) and first timing calibration, rendering the unpublished test fixture `tests/dx/fixtures/alpha-smoke/` (NEW; `Surface`, `Button`, `Dialog`, the only flagships certified at the alpha gate, architecture §16 Wave 3) because the `app-frame` block depends on PRD-10's AppShell family (Wave 4). `app-frame` becomes the first certified block as soon as PRD-10 certifies AppShell, Sidebar, TopBar, StatusBar and Inspector, and the quickstart switches to it then; GA acceptance (AC-DX-04) is measured on `app-frame` only. The first alpha `.d.ts` is the "5.0 `.d.ts`" that REQ-DX-32 output fixtures compile against until beta.
6. **4.3 (2027-01-18):** publish `@auraglass/cli` beta with `migrate 4to5 --dry-run` (entry gate: codemod fixture suite green, architecture §14.1); `MOVED_NOTICE` in 4.x CLI; `compat` adapters for the 4.3 C-D list (REQ-DX-41/42).
7. **Beta (from 2027-02-15):** all 10 blocks and the item set (REQ-DX-45…50); `registry-render.spec.ts` gating (REQ-DX-48); `diff`/`update`/eject; `doctor` 5.0 checks; codemod canary on consumer-4x and recipes-4x (REQ-DX-38/39); docs app skeleton, IA, generated component pages, guides, snippet and import gates (REQ-DX-58…76); delete 4.x docs at beta.1 with redirects (REQ-DX-72).
8. **RC (from 2027-03-22):** migration guide generated (REQ-DX-81…84); claims pipeline wired to RC artifacts (REQ-DX-77…80); `llms-full.txt`, per-component markdown, `@auraglass/mcp` (REQ-DX-85…91); codemod perf (REQ-DX-40); Lighthouse budgets; AuraOne consumer migration report reviewed.
9. **GA (est. 2027-04-26):** regenerate all claims from the GA run; publish CLI, registry, MCP from the tag workflow; deploy `auraglass.dev`; run the hand quickstart check (DoD 8).
10. **GA + 8 weeks (5.1):** any registry item that missed certification ships (C-E); ratchet block runtime budget from measured values.

---

## 21. Open items

Reconciled against `prd/_shared-contracts.md` on 2026-10-06 (SC-02, SC-24, SC-32, SC-38 and SC-40 applied; SC-04, SC-05, SC-08, SC-23, SC-33, SC-34 and SC-37 referenced as a consumer). The DX entries in `_verification-remaining-concerns.md` are resolved as follows:

| Concern | Resolution |
|---|---|
| Button prop grammar (PRD-01 §11.2 vs REQ-CTL-21) | Resolved by SC-24 (REQ-DX-58/59, DX-048, DX-131/132). Needs human confirmation, OI-DX-01 |
| `deprecations.json` location | Resolved by SC-02: repo root, `version: 1` (§11.10, DX-019, DX-096) |
| API report manifest location | Resolved by SC-04: `etc/api/manifest.json`, slug `.` → `index` (DX-019 `API_DIR`) |
| Frozen 4.x fixture path | Resolved by SC-08: `tests/fixtures/consumer-4x/` (REL-115) |
| AI PRD block type, TODO spelling, codemod/compat paths | Resolved by SC-32/33/34 (§11.6, §11.8, §11.9). The AI PRD edits are `PRD-AI`'s |
| PRD numbering collision | Resolved by SC-01: Key `DX`; `PRD-16` is an alias only |
| Header boundary and 4.x docs deletion owner | Resolved by SC-38: FND owns deletion (FND-142); REQ-DX-72 and DX-111 are consume-only |
| Storybook showcase vs authored-new blocks | Resolved by SC-32 and REQ-DX-53: `registry/blocks/<id>/` is the single source; showcases enter only via the content owner. Confirm with SB, OI-DX-06 |
| Unverified externals; uncalibrated budgets | Still open: OI-DX-03, OI-DX-04, OI-DX-07 |

| Id | Item | Owner | How to close |
|---|---|---|---|
| OI-DX-01 | SC-24 Button API break (4.x `primary/secondary/ghost/danger` → `prominent`, `variant="regular"`, `variant="identity"`, `intent="danger"`) is listed under "decisions needing human confirmation" | Gurbaksh (product), with `PRD-FND`/`PRD-CTL` | Record the decision in `docs/release/decisions/`. If it is rejected, change REQ-DX-58/59 and DX-048/131/132 back in one PR |
| OI-DX-02 | No `PRD-DATA` task supplies content for the `data-workspace` block (DATA-133 covers only `analytics-dashboard`), but SC-32 assigns that content to DATA | `PRD-DATA` | DATA adds a MODIFY task on `registry/blocks/data-workspace/` that depends on DX-073, and DX-081 adds it to `depends_on`. Until then DX-073 is only a scaffold |
| OI-DX-03 | External gates are unverified: npm scope `@auraglass` (D-23), the `auraglass.dev` domain and hosting, the vendored shadcn v4 `registry-item` schema hash, and npm trusted-publisher bindings for the three new packages | DX owner (scope, schema hash); operator (npm bindings, domain) | Record these as `gate` fields on DX-018/028/118/145. Close each one with evidence in `packages/cli/PUBLISHING.md` and `packages/cli/schema/SOURCE.md` |
| OI-DX-04 | No task in any fragment provides the QA remote capture endpoint contract that `audit backdrop` (REQ-DX-27) needs | `PRD-QA` | QA files a task for the endpoint and its request/response schema. DX-038/039 then depend on it. Until then DX-039 stays blocked, and a mocked pass does not count |
| OI-DX-05 | `PRD-MED` requested an `@auraglass/cli sample-media` command (precomputed `tone`). It is not in this PRD's CLI list | DX owner, with `PRD-MED` | Accept it as a new REQ-DX-92 with a task (this needs an image-decoder entry in `packages/cli/dependency-allowlist.json`), or reject it and have MED keep only the `tone` prop path. Either way, record the decision in both PRDs |
| OI-DX-06 | The Storybook PRD describes lifting showcases into blocks | `PRD-SB` | SB aligns its text with REQ-DX-53 (blocks are sourced only from `registry/blocks/<id>/`, imported by DX-097) |
| OI-DX-07 | The §16 numeric budgets (CLI ≤15 MB, cold start ≤300 ms, codemod ≤60 s per 2,000 files, block JS ≤60 KB, Lighthouse) are design targets that have not been measured | DX owner, with `PRD-PERF` | Calibrate at alpha from remote-runner artifacts and ratchet only downward. Per SC-15, per-import sizes come from `docs/size-budgets.json` (PKG-048) |
| OI-DX-08 | No other fragment removes `bin/aura-glass.cjs` on `main` or adds `doctor --v5` to the 4.x CLI. New tasks DX-149 and DX-150 take both | DX owner; `PRD-FND` may absorb DX-149 | If FND files its own removal task, drop DX-149 so there is still exactly one remover (SC-39) |
| OI-DX-09 | `PRD-FND` FND-021 creates `scripts/docs/gen-component-docs.mjs`, which overlaps DX's `scripts/docs/gen-props.mjs` (DX-104) | REL (program index) | Add an SC-H row choosing one generator. DX's proposal: FND-021 becomes a MODIFY or input to DX-104 |
| OI-DX-10 | `PRD-MED` has no `media-backdrops` transform task at the SC-33 path (MED-013/157 use non-canonical paths) | `PRD-MED` | MED retargets to `packages/cli/src/migrate/4to5/transforms/media-backdrops.ts` and its `__fixtures__/media-backdrops/`. DX-059 then adds it to `depends_on` |
