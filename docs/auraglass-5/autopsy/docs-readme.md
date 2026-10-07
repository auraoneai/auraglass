# AuraGlass 5.0 Autopsy: Documentation Accuracy (README, INSTALLATION, CONTRIBUTING, llms.txt, docs/**)

Scope: `README.md`, `INSTALLATION.md`, `CONTRIBUTING.md`, `llms.txt`, and all of `docs/**` (excluding `docs/auraglass-5/**`), including `docs/migration/*`. The package is `aura-glass` 4.1.0 (`package.json` version, `CHANGELOG.md:3`). `dist/` was built on 2026-09-05, after the last commit that touched `src` (`git log --since=2026-09-05 -- src` is empty), so `dist/*.d.ts` represents the shipped API.

Method (read-only; no browser, no Docker, no full-repo build):

1. **Import existence.** A TypeScript checker loaded every `.d.ts` target in the `package.json` export map and called `getExportsOfModule`. All `import … from 'aura-glass[/sub]'` statements in 492 doc files were then checked: **518 named bindings** in 229 files.
2. **Snippet type-check.** Every fenced `ts/tsx/js` block that imports from `aura-glass` and uses no private paths was extracted (291 blocks) and compiled with `tsc --noEmit` against the shipped `dist` declarations, with `paths` mapped from the export map. 13 blocks are not even valid TSX. The other **278** were type-checked.
3. **Runtime cross-check.** I `require`d `dist/index.js` (1,073 runtime exports) and imported `dist/tokens/index.mjs`, `dist/tokens/tailwind.theme.mjs`, and `dist/registry/index.mjs` with Node.
4. **Link check.** I checked 679 relative Markdown links and whether each target is tracked in git with exact case.
5. **CSS check.** Every `--glass-*`/`--aura-*` variable and `glass-*` class named in token and utility docs was checked against `dist/styles/index.css` + `dist/tokens/tokens.css`.
6. **Same-name collisions.** I resolved every export name that appears in both root and a subpath to its declaration file.

Not verified: external URLs (`auraglass.auraone.ai/docs/*`), runtime visual behaviour, and the 1,595-story runtime crawl.

---

## Summary & score

**Score: 4 / 10**

The docs have **good link hygiene and a few honest, precise reference pages** (`docs/package-entrypoints.md`, `docs/theme/theme-engine.md`, `docs/app-shell/readme.md`, CLI docs). Around those sits **a large body of volume-for-coverage content that does not compile against the shipped package**:

- **About 28% of copy-pasteable public-import snippets fail type-checking against the shipped `.d.ts`.** That is 79 of 278. The failures are missing exports, wrong hook return shapes, and missing required props. 13 more snippets are not valid TSX.
- **85 of 518 named bindings (16%)** import something not exported from the path named. The failures are spread across 69 files, including README, INSTALLATION, and package-entrypoints (`personas` from `aura-glass/tokens`).
- **The core token reference is wrong about the core material.** `docs/design-tokens.md:134-140` documents blur `sm/md/lg/xl/2xl = 4/8/16/24/32px`. The shipped CSS is `16/24/32/40/48px`. 64 of the 181 variables it names (35%) are not defined anywhere in the shipped CSS. The 643 `--aura-*` variables that actually back the Tailwind preset are documented nowhere.
- **The same export name means different things depending on import path,** and the docs never say so. There are 16 collisions, including `createGlassTheme`/`GlassTheme`, `GlassAppShell`, `GlassSplitPane`, `Motion`, and `GlassIcon`.
- **The docs offer no App Router guidance.** `"use client"` appears in zero docs. `dist/theme/index.mjs` and `dist/primitives/index.mjs` ship hooks and `createContext` with the directive stripped, so the theme-engine `Root` example fails if pasted into `app/layout.tsx`.
- **Version references conflict.** Entry docs cite six different release lines (2.x, 3.0.x, 3.1, 3.3, 3.4, 4.0) for a 4.1.0 package. `llms.txt`, the agent-facing file, is the most stale.
- **142 generated stub pages** exist to satisfy a coverage metric, and roughly 50 pages document "consciousness/quantum/genesis" APIs, several of them fictional.
- **"Optional" peers are hard dependencies.** `openai`, `express`, `jsonwebtoken`, `socket.io`, Pinecone, and others are in `dependencies`. The docs' "optional" framing is false at install time.
- **Licensing risk.** The licensed Aeonik webfonts (12 `woff2` files) are redistributed in an MIT-licensed npm tarball with no font license or notice.

---

## What exists (counts)

| Item | Count | Evidence |
| --- | --- | --- |
| Root docs | README 648 lines, INSTALLATION 199, CONTRIBUTING 97, llms.txt 39 | `wc -l` |
| `docs/**` files (excl. auraglass-5) | 488 files | `rg --files docs` |
| Component pages | 432 `.md` in 36 numbered sections + `core/`, `marketing/`, `35-liquid-glass/*` | `docs/components/*` |
| Generated stub pages ("tracked in the AuraGlass historical certification inventory") | **143** (142 with the `aria-label="X example"` placeholder) | `rg -l` |
| Component pages with a props table | 12 (4 with `## Props`) | `rg -l '\| *Prop *\|'` |
| Guides | 16 `docs/guides`, 9 `docs/ai`, 13 `docs/liquid-glass`, 3 `docs/migration`, 1 each theme/cli/icons/primitives/app-shell/workflows/recipes | listing |
| Named bindings imported from `aura-glass*` | 518 in 229 files; **85 missing** (69 files) | checker (`getExportsOfModule` on dist d.ts) |
| Public-import snippets type-checked | 278 compiled; **79 with API errors** (52 TS2305, 25 TS2724, 23 TS2339, 10 TS2345, 2 TS2739, 1 TS2741, 2 TS2322); 13 more are syntactically invalid | `tsc --noEmit` against `dist` |
| Doc files importing private/non-existent paths (`@/…`, `../src`, `./…`, `@aura/glass`) | **40 files** | `rg -l` |
| `examples/` | 2 files, both import from `../src` (`examples/dashboard.tsx:7-10`, `examples/page-button-spacing.tsx:7-9`) | read |
| Relative Markdown links | 679; 0 missing on case-insensitive FS; **1 case-broken** on Linux/GitHub (`docs/components/choosing.md:129` → `../../readme.md`, but the tracked file is `README.md`) | link script + `git ls-files` |
| CSS custom properties shipped | 1,430 (643 `--aura-*`, 633 `--glass-*`) | `dist/styles/index.css` |
| `--aura-*` mentions in token/theme docs and README | **0** | `rg -c -- "--aura-"` |
| Root exports (types+values) / runtime values | 1,358 / 1,073 | checker; `require('dist/index.js')` |
| Same-name exports with different declarations (root vs subpath) | 16 | collision script |
| Recipes | 28 (matches claim; IDs match the README list) | `dist/registry/index.mjs` |
| CLI commands | all documented commands exist | `bin/aura-glass.cjs:9-28,863-1006` |
| Story files | 460 | `rg --files -g '*.stories.tsx'` |
| Non-test, non-story `src` TS/TSX files | 760 (matches the "760 scanned source files" claim) | `rg --files` |
| Images in README/docs | 6 shields.io badges; **0 product screenshots** in docs (0 image files under `docs/`) | `README.md:5-10` |

### Claims recorded for validation

| Claim | Where | Status |
| --- | --- | --- |
| 470 visual exports + 1 nonvisual + 28 recipes; 498/498 visual targets passed | `README.md:21,529`; `docs/readme.md:8-9`; `CHANGELOG.md:7` | Report-only; recipe count verified (28). The 470 figure cannot be derived from root exports alone, because many visual components are not root-exported (see DOCS-README-02). |
| 31-check glass pipeline; 760 files, zero runtime findings | `README.md:26` | 760 matches the file count; the pipeline was not re-run |
| 1,595 stories, zero hard failures | `docs/readme.md:18` | 460 story files; runtime crawl not re-run |
| React 18 \| 19, Next.js 14 \| 15 | `README.md:9-10,153` | Smoke script pins Next 14.2.35/React 18.2.0 and Next 15.5.15/React 19.0.0 (`scripts/ci/run-next-integration.js:63-65,272-274`). Next 16 untested. Every smoke page starts with `'use client'` (`:176,190`), so Server Component imports are never exercised. |
| "Tree Shaking: only used components are bundled"; "SSR utilities ~2KB gzipped"; "hydrate cleanly with no console warnings" | `docs/guides/ssr-setup.md:230-232` | Unbacked. The root runtime is a single 5.7 MB `dist/index.mjs` that opens with `"use client"` and a `__require` shim. `forms`/`data`/`navigation`/`overlays`/`marketing` resolve to it (`package.json` exports). |
| "Package-only apps … do not need … Redis, OpenAI, Pinecone, Google Vision" | `README.md:185` | The infrastructure isn't needed, but the npm packages install unconditionally (`dependencies`). |
| "The licensed Aeonik family ships locally" | `README.md:27` | True: `dist/styles/fonts/Aeonik-*.woff2` (12 files). No font license file ships, and the package `LICENSE` is MIT. |
| `chart.js` is a peer | `README.md:373,380` | False. `chart.js` is a hard `dependency`, not a peer. |
| `docs/components` = 423 files | `docs/readme.md:72` | 432 |

---

## What is excellent (keep)

- **`docs/package-entrypoints.md`.** Honest and correct about which subpaths are typed-only and resolve to the root bundle (`:56-66`), `workflows` = `workspace` (`:46`), and tarball contents (`:114`, matches `package.json` `files`). This is the template for 5.0 reference docs. (One defect: `:73` imports `personas`, which the shipped types do not export.)
- **`docs/theme/theme-engine.md`.** States defaults and the CSS variable list, and explicitly lists presets that do *not* exist (`:68`). All 17 documented `--glass-theme-*` variables are emitted by `createGlassThemeCssVars`.
- **`docs/app-shell/readme.md`.** Warns that root `GlassAppShell` differs from `aura-glass/app-shell`'s. The warning is correct and needed; it should be generalised to all 16 collisions.
- **CLI and recipe docs.** Every command/flag exists (`bin/aura-glass.cjs:9-28`). The 28 recipe IDs match `getAuraGlassRecipe`.
- **Link integrity.** 0 missing relative targets out of 679.
- **README positioning.** The "AuraGlass vs shadcn/ui" and "Compatibility And Limits" sections (`README.md:77-85,150-157`) are candid about when *not* to use the library.
- **README hosted-runtime error contract** (`README.md:199-210`) matches `src/services/ai/config.ts:61,123` and `server/index.ts:38,225-231`.
- **`docs/components/choosing.md`.** Choosing by product job is the right IA idea (contents need fixing).
- **Glass utility classes doc.** `docs/glass-utilities.md` names 14 variables (all defined) and 14 classes (13 defined).
- **`docs/release-rollback-deprecation.md`.** A real operational runbook.

## What is mediocre

- **README is two documents.** A landing page (`:1-181`) is followed, *after* the License section, by a second README (`:183-648`) covering the hosted runtime, flagships, registry, theming, a11y, a 30-row entrypoint table, the certification procedure, and the release gates. The entrypoint table appears twice (`:100-115` and `:465-495`), as do the quickstart (`:40-55`, `:317-334`), the "start with" tables (`:57-67`, `:225-239`), and the agent-safe import block (`:89-98`, `:243-251`).
- **No visuals.** For a visual design system, README and docs contain zero screenshots. The repo has 356 certified desktop/mobile PNGs under `reports/glassmorphism-storybook-visual-certification/screenshots/`, and none is used.
- **The tables mix entrypoints and then tell agents to import from root.** `GlassTopBar`, `GlassSidebarRail` (app-shell only) and `GlassWorkspace`, `GlassWorkflowShell` (workspace only) appear next to root components (`README.md:65,234`). `README.md:241,504` then says to import from root, so `import { GlassWorkspace } from 'aura-glass'` fails.
- **Accessibility, AI, and Liquid Glass primitive guides import private `@/…` paths** (`docs/guides/accessibility.md:81,239,279,303`, `docs/liquid-glass/primitives/liquid-glass-system.md:68,82,127`, `docs/ai/production-infrastructure.md:26,54,82,111,153,570` uses `../src/...`).
- **Compound components are undocumented.** The parts of Select/Tabs/DropdownMenu/Tooltip are never shown, even though README warns "Do not wrap compound children without their parent components" (`README.md:510`).
- **The Liquid Glass design language is thin.** For a "Liquid Glass" library, the governing doc is 13 lines (`docs/liquid-glass/design-rules.md`) and the showcase page is 3 lines (`docs/liquid-glass/showcase.md`). The real material spec (blur whitelist, gradient stops L1–L5) lives only inside the README audit runbook (`README.md:546-547`).
- **Tailwind coverage is one snippet.** `README.md:419-427` / `INSTALLATION.md:73-81` use `theme` (the preset is `{ extend: … }`, so this works). There is nothing on Tailwind v4 (`@theme`, CSS-first config), on how `--aura-*` vars must be loaded, or on content globs for package classes. `tailwindcss` is not even a devDependency of the repo.
- **AI docs are stale.** They recommend `gpt-4`/`gpt-3.5-turbo` (`docs/ai/api-reference.md:81`, `docs/ai/quick-start.md:9,251`) and "$5 free credit" (`:23`), and use `text-embedding-ada-002` (`src/services/ai/semantic-search-service.ts:333`).

## What is outdated

| Location | Stale content | Current |
| --- | --- | --- |
| `llms.txt:39` | "Current release track: `3.0.x`" | 4.1.0 |
| `INSTALLATION.md:3` | "matches AuraGlass by AuraOne 3.3.0" | 4.1.0 |
| `INSTALLATION.md:28` | `@sentry/react` `^7.100.0` | `^7.100.0 \|\| ^8 \|\| ^9 \|\| ^10` (`package.json` peers) |
| `INSTALLATION.md:149-160` | `{ error: { code: "PROVIDER_UNCONFIGURED", … } }` | flat `{ error, message, code: "AURA_PROVIDER_UNCONFIGURED", provider, feature, docsUrl }` (`src/services/ai/config.ts:61,123`) |
| `README.md:19` | "What's New In 4.0" | 4.1.0 (`RELEASE_NOTES_4.1.0.md` not linked) |
| `README.md:446` | "AuraGlass 3.4 layers … on top of the 3.3-era evidence" | 4.x |
| `README.md:298-301,456-459,513,639-648` | 3.3 evidence presented as current readiness | `reports/audit/*` (4.x) |
| `CONTRIBUTING.md:7` | "Work in the package repo: `/Users/gurbakshchahal/AuraGlass`" | That path does not exist; a personal absolute path should not be in public docs |
| `CONTRIBUTING.md:84,88-97` | "3.1 gate", "3.1 Launch Evidence" | 4.x |
| `docs/readme.md:40-41` | Links only 3.0.0/3.0.1 release notes | 4.0.0/4.1.0 notes exist, unlinked |
| `docs/readme.md:72` | 423 component files | 432 |
| `docs/components/readme.md:9`, `docs/migration/*.md:3` | "3.3 adds…", "AuraGlass 3.3 …" | 4.1 |
| `docs/guides/react19-integration.md:13` | `next@15.1.x` | script pins `15.5.15` (`scripts/ci/run-next-integration.js:272`) |
| `docs/guides/ssr-setup.md:3,234-241` | "v2.1.0+", "Migration from 2.0.12", styled-components setup | styled-components removed; `src/ssr/StyleSheetManager.tsx` utilities are no-ops |
| `docs/guides/ssr-setup.md:28-89` | Pages Router `_app`/`_document` as primary | App Router is the default since Next 13.4 |
| `docs/guides/ssr-setup.md:199` | Remix `import styles from 'aura-glass/styles'` as a URL | raw CSS export; Vite/RR7 needs `?url`; Remix is now React Router 7 |
| `docs/guides/migration.md:3,14` | "Version 2.0"; `npm run codemod:all` | repo-only script, not shipped (`files` = bin, dist, workers, README, LICENSE) |
| `docs/liquid-glass/migration.md:29` | "Liquid Glass Ready (v2.0+)" | n/a |
| `README.md:10,153` | Next.js 14 \| 15 badge | Next 16 is current and untested |
| `README.md:152` | "Node.js 18.18+" | Node 18 is EOL (Apr 2025); the repo's own Vite 7 devDependency needs Node 20.19+ |

## Duplication

- **Three theming systems, two persona namespaces, no reconciliation.**
  - Persona `ThemeProvider`/`PersonaPicker`/`usePersonaTheme` from root (`README.md:391-406`; `src/theme/ThemeProvider.tsx:309-319,1530`). Personas come from `src/theme/designMatrix.ts` (`DEFAULT_PERSONA_ID = "midnight-slate"`, `:1040`).
  - Theme Engine 2.0 `GlassThemeProvider`/`createGlassTheme`/`useGlassTheme` from `aura-glass/theme` (`docs/theme/theme-engine.md:7-58`).
  - Token personas from `aura-glass/tokens`, where `PersonaId` is only `"auraglass-default"` (`src/tokens/generated.ts:2`). README shows both persona systems on the same page (`README.md:395` uses `midnight-slate`; `:411-414` reads `personas[0].metadata.displayName`), and they are unrelated sets.
  - Legacy `darkTheme`/`glassTheme` (`docs/components/23-design-tokens/theme-system.md:5`), not exported.
  - Root `createGlassTheme` (`dist/utils/themeHelpers.d.ts`) is a **different function** from `aura-glass/theme`'s `createGlassTheme` (`dist/theme/createGlassTheme.d.ts`).
- **Same-name exports with different implementations (16).** These are `GlassAppShell` (root `components/layout/GlassAppShell.tsx:15-19` has `variant: default|floating|minimal`; app-shell `src/app-shell/components.tsx:15-21` has `topBar/sidebar/actionBar/density`), `GlassSplitPane(+Props)`, `createGlassTheme`, `GlassTheme`, `Motion` (root `MotionNative` vs primitives `MotionFramer`), `OptimizedGlassProps`, `QualityTier`, and `GlassIcon` (×8 icon subpaths). `docs/components/choosing.md:11` recommends the root `GlassAppShell`; `docs/app-shell/readme.md:5` recommends the other one.
- **Duplicate component pages.** `docs/components/core/glass-{button,card,header,modal}.md` duplicate the pages in `13-buttons`, `14-cards`, `06-navigation`, and `07-modal`, and the `core` copies use `@/` imports. Other duplicate groups: skeleton (3 pages), masonry (2), kanban (2), chart (3), tab-item (2).
- **Repeated topic guides.** Migration has 5 locations (`guides/migration.md`, `guides/consciousness-migration.md`, `liquid-glass/migration.md`, `30-genesis-revolutionary/migration-guide.md`, `docs/migration/*`). Security has 2, performance 4, accessibility 5, and focus management 2.
- **The hosted-runtime contract is duplicated.** It appears in `README.md:189-195`, `INSTALLATION.md:135-140`, and `docs/readme.md:11-12`, and the copies already disagree on the error shape.
- **Peer matrix maintained by hand in two places** (`README.md:368-382`, `INSTALLATION.md:23-36`), and both have drifted from `package.json`.

## Fake complexity

- **143 generated stub pages written to hit the `audit:components` "direct documentation coverage" metric.** Example: `docs/components/08-interactive/glass-rating.md:3-48`. Its overview says the component "is tracked in the AuraGlass historical certification inventory". The usage block is `<GlassRating aria-label="GlassRating example">GlassRating content</GlassRating>`, and the "Verification" section lists coverage gates. The real API (`value`, `max`, `onChange` in `src/components/rating/GlassRating.tsx`) is absent. **`GlassRating` is not exported from the package at all** (absent from `dist/index.d.ts` and from runtime `dist/index.js`). `docs/components/14-cards/div.md` documents an export literally named `div` (`src/components/card/div.tsx:13`, `export const div = GlassCard`).
- **Consciousness, quantum, and genesis docs describe APIs that do not exist.** `docs/guides/consciousness-interface.md:10-24` puts a `consciousnessFeatures` prop on `GlassButton`; that prop is not in `src/components/button/GlassButton.tsx`. It also imports from `@aura/glass`, `@aura/glass/{consciousness,testing,performance,a11y}` (`:10,314,364,485,503,515,598,606`), which is a package name that does not exist. `ConsciousnessProvider` has 0 definitions in `src`. The 619-line guide and the 691-line `consciousness-migration.md` are documentation for fiction.
- **SSR layer documented as setup when it is a no-op.** `AuraGlassSSRProvider`/`collectStyles` (`README.md:354-362`, `INSTALLATION.md:92-100`, `docs/guides/ssr-setup.md:23-89,182-188`) are no-ops (`src/ssr/StyleSheetManager.tsx:1-8,20-38`). Meanwhile the thing App Router users actually need, `StyledComponentsRegistry` from `aura-glass/registry`, is what the smoke test uses (`scripts/ci/run-next-integration.js:152`). It is not explained anywhere.
- **The certification runbook sits in the public README.** `README.md:525-576` is roughly 50 lines of audit invariants and Playwright commands. It even includes an agent-directed instruction: "record the 471-vs-439 discrepancy in the final summary" (`:529`). It ships to npmjs.com.

---

## Critical findings

| ID | Severity | Claim | Evidence |
| --- | --- | --- | --- |
| DOCS-README-01 | critical | 79 of 278 copy-pasteable public-import snippets (28%) fail `tsc` against the shipped `dist` types. Missing exports are only part of it. Hook return shapes are wrong: `glassUtils.getVariant/getColorScheme/getResponsiveBlur/getSpring` don't exist, `useGlassFocus` has no `focusRingStyles`, `useQualityTier` has no `currentTier/updateQuality`, `AdaptiveQuality.getInstance` doesn't exist, and `useSortableData` key typing fails. Required props are missing: `CollaborativeGlassWorkspace` needs `userEmail`, `GlassLiveCursorPresence` needs `roomId`/`currentUser`. 13 more snippets are invalid TSX. | `docs/components/23-design-tokens/glass-tokens.md:8-21`, `docs/components/22-hooks-utilities/use-glass-focus.md:8`, `docs/components/25-chart-enhancements/chart-quality-tiers.md:8`, `docs/components/24-performance/performance-monitoring.md:16`, `docs/components/30-genesis-revolutionary/readme.md:138`, `docs/components/27-revolutionary-enhancements/glass-live-cursor-presence.md:31`, `docs/components/22-hooks-utilities/use-sortable-data.md:25-36`; invalid: `docs/components/02-advanced-effects/*.md:4`, `docs/icons/readme.md:35`, `docs/ai/ai-components.md:45,406` |
| DOCS-README-02 | critical | 85 of 518 imported bindings (16%, 69 files) are not exported from the path named. Many are components that exist in `src` but were never re-exported, so the doc page is the only "public" trace: `GlassRating`, `GlassTreeSelect`, `GlassTransferList`, `GlassSpotlightSearch`, `GlassSignaturePad`, `GlassColorWheel`, `GlassVoiceInput`, `Typography`, `HeaderUserMenu`, `TabItem`, `ChartContainer/Axis/Legend/Tooltip/Grid`, `KpiChart`, `ModularGlassDataChart`, `Metric/Table/ChartWidget`, `SkipLinks`, `useFocusTrap`, `useGlassTheme` (root), `darkTheme`. `Chart`, `patterns`, and `personas` (in types) have no matching export at all. Runtime confirms: these are absent from `require('dist/index.js')`. | `docs/components/08-interactive/glass-rating.md:27`, `docs/components/09-form/glass-tree-select.md:27`, `docs/components/10-data-display/typography.md:27`, `docs/components/11-charts/chart-container.md:27`, `docs/guides/component-standards.md:379`, `docs/guides/migration.md:476`, `docs/components/23-design-tokens/theme-system.md:5`, `docs/components/32-new-genesis-components/*` (19 failures) |
| DOCS-README-03 | high | README, INSTALLATION, and package-entrypoints all show `import auraTokens, { personas } from 'aura-glass/tokens'`, but the shipped types (`dist/tokens/generated.d.ts`) do not export `personas`, so `tsc` fails with TS2724. The types *do* declare `getPersona`/`getPersonaModeTokens`, which the runtime module (`dist/tokens/index.mjs:3-7`) does not export, so the types and runtime disagree in both directions. The only token persona is `"auraglass-default"`, unrelated to the `ThemeProvider` personas (`midnight-slate`, …) shown in the code block 15 lines above. | `README.md:395,411-414`, `INSTALLATION.md:67-70`, `docs/package-entrypoints.md:73`; `dist/tokens/generated.d.ts:1,1231-1232`; `dist/tokens/index.mjs:3-7`; `src/theme/designMatrix.ts:1040` |
| DOCS-README-04 | high | The design-token reference contradicts the shipped material. Blur scale documented as `sm 4 / md 8 / lg 16 / xl 24 / 2xl 32px`; shipped CSS is `sm 16 / md 24 / lg 32 / xl 40 / 2xl 48px`. 64 of the 181 variables the doc names are undefined in shipped CSS (e.g. `--glass-elev-modal`, `--glass-color-primary-dark`, `--glass-button-height-md`). The 643 `--aura-*` variables that the Tailwind preset depends on are never documented. | `docs/design-tokens.md:134-140,83,183,502` vs `src/styles/tokens.css:41`, `dist/styles/index.css`; `dist/tokens/tailwind.theme.mjs` (all `var(--aura-*)`); `rg -c -- "--aura-"` on docs = 0 |
| DOCS-README-05 | high | 16 same-name exports resolve to different implementations depending on import path, and only `GlassAppShell` is warned about. `createGlassTheme`/`GlassTheme` from root (`utils/themeHelpers`) is not Theme Engine 2.0. `Motion` from root is native and from `primitives` is framer-motion. `GlassSplitPane` exists twice. | `dist/index.d.ts` vs `dist/theme/createGlassTheme.d.ts`, `dist/primitives/motion/MotionFramer.d.ts`, `dist/app-shell/components.d.ts`; `src/index.ts:72`; `docs/components/choosing.md:11` vs `docs/app-shell/readme.md:5` |
| DOCS-README-06 | high | No Next.js App Router / RSC guidance: `"use client"` appears in 0 doc files. The root bundle is a client module, but `dist/theme/index.mjs` (has `createContext`/`useState`, `:232,248`) and `dist/primitives/index.mjs` (57 hook calls) ship **without** the directive, even though source has it (`src/theme/GlassThemeProvider.tsx:1`). Pasting the theme-engine `Root` example into `app/layout.tsx` therefore errors. The smoke tests always wrap usage in `'use client'` files, so this path is untested. | `docs/theme/theme-engine.md:35-51`, `docs/guides/ssr-setup.md:177-193`, `README.md:336-352`; `scripts/ci/run-next-integration.js:149-190` |
| DOCS-README-07 | high | The docs present AI/server packages as optional, but they are hard `dependencies` installed by every consumer: `openai`, `@google-cloud/vision`, `@pinecone-database/pinecone`, `redis`, `ioredis`, `express`, `helmet`, `jsonwebtoken`, `bcryptjs`, `socket.io`, `@sentry/node`. Six packages are listed as both optional peers and hard deps. README's peer table lists `chart.js` as a peer, but it is only a hard dependency. | `README.md:75,156,185,373,380`, `INSTALLATION.md:19`, `docs/package-entrypoints.md:11` vs `package.json` `dependencies`/`peerDependenciesMeta` |
| DOCS-README-08 | high | The docs break their own "public imports only" rule. 40 doc files import from `@/…`, `../src`, or the non-existent `@aura/glass`. The README-linked `examples/` directory imports only from `../src`. | Rule: `README.md:253,508`, `CONTRIBUTING.md:10`. Violations: `docs/guides/accessibility.md:81,239,279,303`, `docs/liquid-glass/primitives/liquid-glass-system.md:68,82,127`, `docs/ai/production-infrastructure.md:26,54,82,111,153`, `docs/example.tsx:15`, `examples/dashboard.tsx:7-10`, `docs/guides/consciousness-interface.md:10,314` |
| DOCS-README-09 | high | Six conflicting release lines appear in the entry docs, and the agent context file says `3.0.x`. | `llms.txt:39`, `INSTALLATION.md:3`, `README.md:19,446`, `CONTRIBUTING.md:84,88`, `docs/guides/ssr-setup.md:3`, `docs/guides/migration.md:3` vs `package.json` 4.1.0 |
| DOCS-README-10 | high | The consciousness-interface guide documents a fictional package (`@aura/glass`), fictional subpaths, a fictional `GlassButton` prop, and fictional symbols (`ConsciousnessProvider`, `ConsciousnessMockProvider`, `runConsciousnessCompatibilityTests`). | `docs/guides/consciousness-interface.md:10-24,314,364,485,503,515,598,606`; 0 definitions in `src` |
| DOCS-README-11 | high | 143 generated stub pages carry placeholder usage that ignores each component's props. They satisfy a coverage metric without giving API information. Only 12 component pages have a props table. | `docs/components/08-interactive/glass-rating.md:3-48`, `docs/components/14-cards/div.md:1-40` |
| DOCS-README-12 | medium | The SSR guide's "SSR-safe" example is wrong. `if (isBrowser)` tests a function reference, which is always truthy. `isBrowser` and `canUseDOM` are listed as interchangeable, but one is a function and the other a boolean. `AuraGlassSSRProvider`/`collectStyles` are recommended but are no-ops. | `docs/guides/ssr-setup.md:96-101,114,165`; `src/utils/env.ts:20`; `src/ssr/StyleSheetManager.tsx:1-8,32-38` |
| DOCS-README-13 | medium | The 3D/AR pages import `ARGlassEffects`, `GlassShatterEffects`, `SeasonalParticles`, and `AuroraPro` from root; they exist only in `aura-glass/three`. | `docs/components/31-ar-effects/readme.md:55`, `ar-glass-effects.md:21,127`, `aurora-pro.md:22`, `glass-shatter-effects.md:21`, `seasonal-particles.md:21` vs `INSTALLATION.md:110` |
| DOCS-README-14 | medium | Licensed Aeonik webfonts (12 `woff2`) are redistributed in the MIT npm tarball with no font license, EULA, or notice, and README advertises this. This needs legal confirmation of redistribution rights. | `README.md:27`; `dist/styles/fonts/Aeonik-*.woff2`; `src/styles/aeonik.css:1-5`; `LICENSE:1` (MIT); no `*licen*`/`*eula*` file in `dist/styles/fonts` or `src/styles` |
| DOCS-README-15 | medium | Three-plus undifferentiated theming APIs and two unrelated persona sets; no guide says which provider to mount or whether they compose. | `README.md:391-414`, `docs/theme/theme-engine.md:7-58`, `docs/components/23-design-tokens/theme-system.md:5`, `docs/components/choosing.md:21` |
| DOCS-README-16 | medium | Flagship tables mix root, app-shell, and workspace exports without labels while telling agents to import from root. | `README.md:65,234,241,504`; `GlassWorkspace`/`GlassTopBar`/`GlassSidebarRail` not in root |
| DOCS-README-17 | medium | The INSTALLATION provider-unconfigured shape and code contradict README and the server. | `INSTALLATION.md:149-160` vs `README.md:199-210`, `src/services/ai/config.ts:61,123`, `server/index.ts:38,225-231` |
| DOCS-README-18 | medium | README embeds the internal certification procedure and an agent-directed instruction, which ship to npmjs.com. | `README.md:525-576` (esp. `:529`) |
| DOCS-README-19 | medium | `docs/readme.md` ("Current Source Of Truth"), INSTALLATION, and README market `forms`/`data`/`navigation`/`overlays`/`marketing` as focused subpaths. At runtime they are the full root bundle, and the SSR guide promises tree-shaking. | `docs/readme.md:8`, `INSTALLATION.md:3`, `README.md:446`, `docs/guides/ssr-setup.md:230` vs `package.json` exports (`./forms` → `./dist/index.mjs`), `docs/package-entrypoints.md:56-66` |
| DOCS-README-20 | medium | There are no Vite, Tailwind v4, or framework-matrix guides. Next 16 is untested and undocumented. The integration smoke reports (`reports/3.2-release/vite-integration.json`) show Vite is exercised but undocumented. | `docs/guides/*` (16 files; only `ssr-setup`, `react19-integration` are framework-related); `scripts/ci/run-vite-integration.js` |
| DOCS-README-21 | low | AI docs recommend legacy OpenAI models and stale pricing claims. | `docs/ai/api-reference.md:81`, `docs/ai/quick-start.md:9,23,251` |
| DOCS-README-22 | low | A case-mismatched link breaks on GitHub/Linux. | `docs/components/choosing.md:129` → `../../readme.md` (tracked as `README.md`) |
| DOCS-README-23 | low | CONTRIBUTING hard-codes a personal absolute path that does not exist. | `CONTRIBUTING.md:7` |
| DOCS-README-24 | low | Consumer docs tell users to run repo-only scripts that the tarball does not ship. | `docs/guides/migration.md:14` (`codemod:all`), `README.md:429-434` |
| DOCS-README-25 | low | Peer-range drift: the INSTALLATION Sentry range is narrower than `package.json`, and react19-integration cites `next@15.1.x` when 15.5.15 is tested. | `INSTALLATION.md:28`; `docs/guides/react19-integration.md:13` vs `scripts/ci/run-next-integration.js:272` |
| DOCS-README-26 | low | README has no product screenshots despite 356 certified PNG pairs in the repo; there are 0 images under `docs/`. | `README.md:5-10`; `reports/glassmorphism-storybook-visual-certification/screenshots/` |

Corrections to the earlier draft of this file: `CollapsedMenu` exists in source (`src/components/navigation/components/CollapsedMenu.tsx`) but is not exported. `GlassNavbar` is an alias of `GlassNavigation` (`src/index.ts:125`), which has a page. The `docs/components` count is 432, not 423.

---

## Recommendations for AuraGlass 5.0

1. **Make docs compile, in CI.** Add a remote CI job that extracts every fenced `ts/tsx` block from README, INSTALLATION, llms.txt, and `docs/**` and type-checks it against the *packed* tarball's `.d.ts` (the harness used here: export-map → `paths`, `tsc --noEmit`). Twoslash-style annotations would also work. Fail the build on TS2305/TS2724/TS2339/TS2322/TS2741. Ban `@/`, `../src`, and `@aura/glass` outside `docs/contributing/`.
2. **Generate component reference from source.** Replace the 143 stubs with pages generated by react-docgen-typescript: props, defaults, compound-part anatomy, keyboard map, and one real screenshot per component, pulled from the certification PNGs. If a component is not a public export, it gets no page; either export it deliberately or delete the page.
3. **Fix the token docs from the generator.** Generate `design-tokens.md` from `tokens/` and `dist/tokens/tokens.json` so the blur, elevation, and colour values cannot drift. Document the `--aura-*` layer, or collapse to one namespace in 5.0. Publish the Liquid Glass material spec (blur whitelist, L1–L5 gradient stops, scrim rules) as a first-class "Material" foundation page, not as README audit text.
4. **Resolve the name collisions in the API, not the docs.** For 5.0, one name means one component. Rename or remove the legacy root `GlassAppShell`, `GlassSplitPane`, `createGlassTheme`, `GlassTheme`, and `Motion`. Ship a codemod (`npx aura-glass migrate v5`) and document it.
5. **One theming story.** Pick Theme Engine 2.0 *or* persona `ThemeProvider` as the 5.0 API, deprecate the other, and write one Theming guide with a decision tree. Fix the `aura-glass/tokens` types (export `personas`; drop `getPersona` or implement it).
6. **Write the missing guides,** each backed by a remote smoke app:
   - Next.js App Router (15/16): where `'use client'` goes, provider placement, `aura-glass/styles` in `app/layout.tsx`, `StyledComponentsRegistry` (or remove it). Also restore `"use client"` banners in the `theme` and `primitives` bundles (a build fix), and add an RSC import test.
   - Vite + React 19.
   - Tailwind v3 preset and v4 `@theme`.
   - 4.x → 5.0 migration.
7. **Make the dependency story true.** Move the server/AI stack (`express`, `openai`, Pinecone, `socket.io`, `jsonwebtoken`, …) to a separate package (e.g. `@auraone/aura-glass-server`). Keep only true runtime deps, generate the peer matrix from `package.json`, and stop hand-maintaining it twice.
8. **One README of about 150 lines.** Hero screenshot, install, quickstart, App Router snippet, an entrypoint table with an explicit "lives in" column for flagships, a 10-line theming section, and links. Move the hosted runtime, certification runbook, release gates, and repo map to `docs/contributing/*` and `docs/hosted-runtime.md`. Remove agent-directed audit instructions.
9. **One version source.** Inject the version at release time into README, INSTALLATION, llms.txt, and `docs/readme.md`, or remove version numbers from prose. Archive 2.x/3.x material under `docs/history/`. Rewrite `llms.txt` for 5.0 with the flagship→subpath map and forbidden patterns.
10. **Quarantine the fiction.** Delete or move `01-consciousness-interface`, `27-revolutionary-enhancements`, `28-next-wave-systems`, `30-genesis-revolutionary`, `32-new-genesis-components`, `33-quantum-ui`, `guides/consciousness-*.md`, `14-cards/div.md`, and `14-cards/patterns.md` to `experimental/` with a "not public API" banner, or delete them with the code.
11. **Docs IA.** Replace the 36 numbered sections with Diátaxis top levels: Get Started (install, Next, Vite, Tailwind, theming), Foundations (material, tokens, motion, a11y), Components (one page per public family, generated), Patterns/Recipes, Reference (entrypoints, CLI, tokens), and Contributing (certification, release). Align it with the 13-group Storybook taxonomy (`docs/readme.md:19`).
12. **Legal.** Confirm the Aeonik redistribution licence before 5.0 ships. Add `dist/styles/fonts/LICENSE` or switch to a licensable or OFL font with a documented fallback stack.

## Verification (adversarial)

Independent re-check against `package.json`, `dist/`, and `src/`. I spot-checked aggregate counts from the method above but did not re-run the full tsc/link harness. I tried to refute each finding. A "PARTIAL" verdict means the core claim holds but a sub-claim is overstated.

| id | verdict | note |
| --- | --- | --- |
| DOCS-README-01 | CONFIRMED | I did not reproduce the 79/278 aggregate. Every named cause reproduces. `dist/tokens/glass.d.ts:213` `glassUtils` has no `getVariant`, `getColorScheme`, or `getSpring` (0 hits). `useGlassFocus` (`dist/hooks/extended/useGlassFocus.d.ts:37`) declares no `focusRingStyles` (0 hits in any `dist` d.ts). `currentTier` belongs to `useAdaptiveQuality`, not `useQualityTier`, which takes `(metrics, chartType)` and returns `ChartQualityTier` (`dist/components/charts/hooks/useQualityTier.d.ts:17,22-23`). No `AdaptiveQuality.getInstance` is declared. `CollaborativeGlassWorkspace` requires `userEmail` (`dist/components/collaboration/CollaborativeGlassWorkspace.d.ts:25`), which `docs/components/30-genesis-revolutionary/readme.md:138-142` omits. |
| DOCS-README-02 | CONFIRMED | I did not re-derive the 85/518 count. I required `dist/index.js`: `GlassRating`, `GlassTreeSelect`, `GlassTransferList`, `GlassSpotlightSearch`, `Typography`, `ChartContainer`, `KpiChart`, `SkipLinks`, `useFocusTrap`, and `useGlassTheme` are all `false`. `src/components/rating/GlassRating.tsx` exists. `GlassRating`, `GlassTreeSelect`, and `Typography` appear in no other `dist` d.ts, so no subpath exports them either. `useFocusTrap` exists only under `aura-glass/primitives`, `useGlassTheme` only under `aura-glass/theme`, and `SkipLinks` only in `components/accessibility`. |
| DOCS-README-03 | CONFIRMED | `package.json` `exports["./tokens"].types` is `./dist/tokens/generated.d.ts`, which exports `auraTokens`, `getPersona`, `getPersonaModeTokens`, and default, but no `personas` (lines 1-24, 1231-1239). The runtime `dist/tokens/index.mjs:1-7` exports `personas` but neither `getPersona` function, so types and runtime are inverted. The only token persona is `metadata.id: "auraglass-default"`. README.md:394 uses `initialPersona="midnight-slate"` (`src/theme/designMatrix.ts:104`). |
| DOCS-README-04 | PARTIAL | The blur contradiction is exact. `docs/design-tokens.md:134-139` gives 0/4/8/16/24/32/48. `src/styles/tokens.css:39-46` and `dist/styles/index.css` give 0/16/24/32/40/48/48. My own diff found 65 of 182 `--glass-*` names in the doc undefined in `dist/styles/index.css` + `dist/tokens/tokens.css`, which matches the claim. The Tailwind sub-claim is overstated. The CSS defines 643 unique `--aura-*` properties, but `dist/tokens/tailwind.theme.mjs` references only 45 of them. They are also not documented nowhere: a few `--aura-marketing-*` variables are named in `docs/components/13-buttons/glass-button.md:34` and `docs/components/marketing/readme.md`. The substance stands: no doc gives a reference for the `--aura-*` layer. |
| DOCS-README-05 | CONFIRMED | I did not verify the count of 16. Collisions I verified: root `Motion` = `MotionNative` (`dist/index.d.ts:6`), but `aura-glass/primitives` `Motion` = `MotionFramer` (`dist/primitives/index.d.ts:28`). `createGlassTheme` is `themeHelpers` in `dist/utils/index.d.ts:6` and `./createGlassTheme` in `dist/theme/index.d.ts:1`. Root `GlassSplitPane` comes from `components/layout` (`dist/index.d.ts:30`), but `app-shell` has its own (`dist/app-shell/components.d.ts:69`). Root `GlassAppShell` is legacy (`src/index.ts:72`). `docs/components/choosing.md:11` lists `GlassAppShell` as the default with no path, implying the root/legacy one, while `docs/app-shell/readme.md:5` says not to use the root export. |
| DOCS-README-06 | CONFIRMED | `rg "use client"` over docs, README, and INSTALLATION returns 0 files. `dist/theme/index.mjs` starts with `// src/theme/color.ts`, and `"use client"` appears only mid-bundle (line 230ff), where Next ignores it because the directive must come first. `dist/primitives/index.mjs` likewise starts without it. The root `dist/index.js`/`index.mjs` do carry it. Both `exports["./theme"]` and `exports["./primitives"]` point to these files. `docs/theme/theme-engine.md:35-51` has no directive. `scripts/ci/run-next-integration.js:177,191,383,397` writes `'use client'` fixtures. |
| DOCS-README-07 | CONFIRMED | `package.json` `dependencies` includes `openai`, `@google-cloud/vision`, `@pinecone-database/pinecone`, `redis`, `ioredis`, `express`, `helmet`, `jsonwebtoken`, `bcryptjs`, `socket.io`, `@sentry/node`, and `chart.js`. `openai`, `@google-cloud/vision`, and `redis` are also listed as optional peers, but they are still installed for every consumer because they are in `dependencies`. `chart.js` is not in `peerDependencies`, although README.md:373,380 and INSTALLATION.md:14 list it with the peer installs. README.md:75,156 and docs/package-entrypoints.md:11 say these integrations are optional. |
| DOCS-README-08 | CONFIRMED | `rg` for `from '@/…' \| '../src' \| '@aura/glass'` in `docs/**/*.md` (excluding auraglass-5) returns 37-39 files, depending on the regex. The 40 is within noise. Both files in `examples/` (`dashboard.tsx:7-10`, `page-button-spacing.tsx:7-9`) import only from `../src`, with 0 `aura-glass` imports, and README.md:166 links that directory. Confirmed at `docs/guides/accessibility.md:81` and `docs/ai/production-infrastructure.md:26`. |
| DOCS-README-09 | CONFIRMED | `llms.txt:39` says "3.0.x". `INSTALLATION.md:3` says 3.3.0. `README.md:19` says "4.0". `README.md:446` says 3.4/3.3/3.0. `CONTRIBUTING.md:84,88` say 3.1. `ssr-setup.md:3` says v2.1.0+. `migration.md:3` says 2.0. `package.json` is 4.1.0. That is at least six distinct lines. |
| DOCS-README-10 | CONFIRMED | `@aura/glass` and its `/consciousness`, `/testing`, `/performance`, and `/a11y` subpaths appear at the cited lines. `ConsciousnessProvider` and `ConsciousnessMockProvider` have 0 hits in `src`. GlassButton has a `consciousness` prop (`src/components/button/GlassButton.tsx:333`) but no `consciousnessFeatures` (0 hits in `src/components/button/`). One nuance that does not refute the finding: `src/types/consciousness.ts:258-260` defines an unused `WithConsciousnessProps.consciousnessFeatures` type. |
| DOCS-README-11 | CONFIRMED | 142 doc files contain the stub sentence "This page provides direct component documentation coverage". 142 `docs/components` files use `aria-label="… example"`. 12 files have a Prop/Name table header. `docs/components/14-cards/div.md` documents `div`, which is `export const div = GlassCard` (`src/components/card/div.tsx:13`). The 143 vs 142 difference is immaterial. |
| DOCS-README-12 | CONFIRMED | At runtime, root `isBrowser` is a `function` (`src/utils/env.ts:20`), so `if (isBrowser)` at `ssr-setup.md:98` is always true. Root `canUseDOM` is a boolean, which makes the `isBrowser / canUseDOM` pairing at :114 misleading too. `src/ssr/StyleSheetManager.tsx:1-8` documents itself as a no-op layer, and `collectStyles`/`AuraGlassSSRProvider` are identity/empty (lines 19-40). |
| DOCS-README-14 | CONFIRMED | `dist/styles/fonts/` holds 12 `Aeonik-*.woff2` files. `package.json` `files` includes `dist`. `LICENSE` is MIT ("AuraOne Team") with no font notice, and `rg --files -g '*icen*'` finds no font licence file. README.md:27 says "The licensed Aeonik family ships locally". Whether a redistribution licence exists elsewhere (contract) cannot be verified from the repo. |
| DOCS-README-17 | CONFIRMED | `INSTALLATION.md:149-160` shows nested `{error:{code:"PROVIDER_UNCONFIGURED",…}}`. `ProviderUnconfiguredError.toJSON()` (`src/services/ai/config.ts:140-149`) returns a flat object with `code: "AURA_PROVIDER_UNCONFIGURED"` (:123), and `server/index.ts:225-231` serializes `error.toJSON()`. README.md:199-210 matches the server. |
| DOCS-README-18 | CONFIRMED | `package.json` `files` includes `README.md`. README.md:525-576 ("Tightened glass certification audit") is an internal runbook. :529 tells the reader to "record the 471-vs-439 discrepancy in the final summary rather than silently changing the inventory", an instruction aimed at an executing agent. :569 adds "Do not edit source, stories, or decorators merely to silence a finding". |
