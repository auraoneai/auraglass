# AuraGlass 5.0 Autopsy: App Shell, Workspace, Layouts, Templates, Registry, CLI, Recipes

Scope: `src/app-shell`, `src/workspace` (+ `src/workflows` alias), `src/components/layout`, `src/components/layouts`, `src/components/templates`, `src/registry`, `bin/aura-glass.cjs`, `docs/app-shell`, `docs/cli`, `docs/recipes`, `scripts/ci/verify-recipes-{render,cli}.js`, and the recipe evidence in `reports/3.3-release` and `reports/audit/visual-all/recipe-*`.

Method: I read the code. I checked every `glass-*` utility class these components use against the CSS the package actually ships (all of `src/styles/**/*.css` plus component CSS, and `dist/styles/index.css`). I ran static analysis over all 28 recipe strings (imports, peer dependencies, tokens, inline styles, `!important`) and read the geometry the real browser captured in `reports/audit/visual-all/recipe-*/{desktop,tablet,mobile}.computed-styles.json`. The Read tool returned empty for the PNG files, so I did not look at screenshots. Every geometry claim below comes from the computed-styles JSON. I ran no builds or browsers.

## Summary and score: 4 / 10

The idea is right. A first-party app frame, workspace chrome, copy-in page recipes, a scaffolding CLI, and a migration and audit CLI are the infrastructure a design system needs to become a product surface. The CLI's safety and audit work and the recipe render harness are the best engineering here.

What actually ships does not deliver that idea:

- The new `aura-glass/app-shell` frame depends on utility classes that do not exist in the shipped CSS. That includes every grid template that puts the sidebar beside the content, plus `glass-rounded-*`, `glass-sticky`, `glass-min-h-screen`, `glass-w-72`, `glass-max-w-7xl`, and all `sky-*` accents. The flagship `saas-admin-shell` recipe, in real Chromium at 1440px, renders the sidebar rail stacked above `GlassMain`, not beside it.
- There is no responsive system. The source uses 343 `sm:/md:/lg:/xl:glass-*` class occurrences across 118 files (227 in 74 non-story files), and the shipped CSS defines exactly one `sm\:glass-` rule.
- Recipes hide this by injecting large `<style>` blocks full of `!important` overrides and hard-coded hex values. They advertise tokens they never use (0 of 28 recipes reference a declared token) and peer dependencies they never import.
- The recipe render gate cannot fail on layout. It records 48 layout issues and still writes `passed: true`, and it resets its console and page error buffers before every viewport, so only errors from the last capture can fail it.
- There are two incompatible `GlassAppShell` APIs, two `GlassSplitPane`s, two `GlassDataTable`s, and two masonry layouts. The `layouts/` folder is mostly demo-ware: a fractal layout with a debug HUD, an orbital menu, a tessellation.

These are not yet the strongest assets. With a 5.0 rebuild they could be.

## What exists (counts)

| Area | Files / size | Notes |
| --- | --- | --- |
| `src/app-shell` | 15 components in one 541-line `components.tsx`, plus 14 one-line re-export files and 1 test (114 lines) | `GlassAppShell`, `GlassTopBar`, `GlassSidebarRail`, `GlassSidebarPanel`, `GlassMain`, `GlassPage`, `GlassPageHeader`, `GlassBreadcrumbs`, `GlassActionBar`, `GlassSplitPane`, `GlassResizablePanel`, `GlassCommandDock`, `GlassStatusBar`, `GlassMobileShell`, `GlassIconButton` |
| `src/workspace` | 9 components, 292 lines, plus a test (78 lines) | `GlassWorkspace`, `GlassWorkspaceHeader`, `GlassWorkspaceTabs`, `GlassWorkspaceTab`, `GlassWorkspacePanel`, `GlassInspectorPanel`, `GlassCanvasArea`, `GlassTimelineRail`, `GlassWorkflowShell`. `src/workflows/index.ts` is `export * from "../workspace"`. |
| `src/components/layout` | 16 components, about 6,100 lines | Includes the legacy root `GlassAppShell` (612 lines), `GlassSplitPane` (271), `ZSpaceAppLayout` (334), Box/Flex/Grid/Stack/HStack/VStack/Container/OptimizedGlassContainer/ScrollArea/Separator/Masonry |
| `src/components/layouts` | 6 components, 3,929 lines | Fractal, GoldenRatioGrid, Island, MasonryGrid, OrbitalMenu, Tessellation |
| `src/components/templates` | 11 components, about 5,500 lines | Dashboard (+3 widgets), DetailView, FormTemplate, FormWizardSteps, WizardTemplate, ListView, interactive `GlassDataTable`, `FormValidationUtils` |
| `src/registry` | `recipes.ts` (2,089 lines), `index.ts`, deprecated no-op `StyledComponentsRegistry` | 28 recipes, 1 file each (verified, matching the "28 claimed"). Built `dist/registry/index.js` is 113 KB of string templates. |
| CLI | `bin/aura-glass.cjs` (1,024 lines) | `list`, `info`, `add`, `audit deps`, `audit imports`, `migrate icons --from lucide`, `migrate radix`, `migrate mui`, `doctor` |
| Gates | `test:recipes:render` (1,386 lines), `test:recipes:cli` (375 lines) | Render gate packs the tarball, scaffolds through the CLI, builds a Vite app, and captures desktop, tablet, and mobile in Chromium |
| Docs | `docs/app-shell/readme.md` (136), `docs/recipes/readme.md` (92), `docs/cli/migration.md` (63) | |

The 28 recipes break down as 10 originals, 10 "3.2" variants, and 8 "3.3" recipes. At least 8 overlap heavily:

- settings-billing / settings-and-billing-suite
- analytics-overview / analytics-command-center
- ai-command-center / ai-product-console / ai-ops-control-room
- collaborative-workspace / team-collaboration-hub / collaboration-room-console
- media-player-surface / media-review-workspace
- ecommerce-product-panel / commerce-operations-panel
- calendar-schedule / calendar-operations-board
- customer-support-console / support-triage-workspace

Only 11 of 28 recipes use the app-shell or workspace components at all.

## What is excellent (keep)

- **CLI write safety.** `ensureInsideCwd` checks both the output directory and each file target (`bin/aura-glass.cjs:295-300`, `:774`, `:781`). `add` skips existing files unless `--force` is passed (`:788-791`), and `--dry-run` and `--json` work on every command. This is a sound base for a shadcn-style `add`.
- **The migration and audit story is a real differentiator.** It covers forbidden-package auditing (`:32-72`, `:316`), import scanning with line numbers (`:436`), an actual Lucide-to-first-party icon codemod with alias preservation and unresolved reporting (`:489-571`), and honest report-only Radix and MUI modes (`:587-613`). `doctor` checks for duplicate React versions in the lockfile (`:615-631`, `:731-741`). Keep all of it and extend it.
- **The render harness is real end to end.** It runs `npm pack`, then `aura-glass add all` into a clean Vite app, then three viewports in Chromium, then per-recipe computed-style evidence (`scripts/ci/verify-recipes-render.js:90-140`, `:348-410`). It exercises the published artifact, not source. The gating logic is the problem (see below).
- **The app-shell API shape is clean.** It uses slot props (`topBar`, `sidebar`, `actionBar`, `statusBar`), `forwardRef` everywhere, semantic landmarks (`header`, `nav aria-label`, `main`, `aside`), `aria-current="page"` on the active rail item and the last breadcrumb, and a required `label` on `GlassIconButton` (`src/app-shell/components.tsx:105-131`, `:164-199`, `:345-379`, `:518-541`). This is the right API layer to build 5.0 on.
- **`GlassWorkspace`'s inspector grid** uses `repeat(auto-fit, minmax(min(100%, 28rem), 1fr))` as an inline style (`src/workspace/index.tsx:43-49`). It is the only intrinsically responsive layout in the subsystem, and because it is an inline style it actually works.
- **The docs are honest about the shell split.** `docs/app-shell/readme.md:5` and `:126-128` explicitly warn that the root `GlassAppShell` is a different, older API.
- **The 3.3 recipes' provider-unconfigured stance.** They fail closed and disable provider actions (`src/registry/recipes.ts:1497-1506`). Keep the principle, not the presentation (see Mediocre).

## What is mediocre

- **App shell is static only.**
  - No collapsible sidebar, no mobile drawer or overlay, no breakpoint behavior, no safe-area insets, no scroll ownership.
  - `GlassSidebarPanel collapsed` just sets width 0 (`components.tsx:223-228`).
  - `GlassMobileShell` is a three-row grid with no bottom-bar positioning or `env(safe-area-inset-*)` (`:496-515`).
  - The legacy root shell does have mobile overlay logic (`src/components/layout/GlassAppShell.tsx:202-214`), so the newer, recommended shell is functionally a regression.
- **Accents are hard-coded.** `sky-300` and `sky-100` appear in rail, tabs, focus rings, and page eyebrows (`components.tsx:185-187`, `:310`, `:462`, `:533`; `workspace/index.tsx:125-127`). They bypass `createGlassTheme` (`--glass-theme-brand` and `--glass-theme-focus`, `src/theme/createGlassTheme.ts:209-218`), so theming cannot recolor the chrome. These classes are also not defined at all (see Critical).
- **Workspace tabs are a façade.**
  - `GlassWorkspaceTabs` declares `value` and `onValueChange` but never uses them. They spread onto a `<div>`, so `onValueChange` reaches the DOM and React warns about an unknown prop (`workspace/index.tsx:86-105`).
  - There is no roving tabindex, arrow-key handling, `aria-controls`, or tabpanel. The real `GlassTabs` in `components/navigation` exists and should be used instead.
- **`GlassResizablePanel` is not resizable.** It has no handle and no pointer logic, and its default `maxSize = "1fr"` is assigned to `maxWidth`, which is invalid CSS and silently dropped (`components.tsx:428-446`).
- **`GlassSplitPane` (app-shell)** is a fixed two-column grid with no stacking breakpoint (`:401-425`). `direction="vertical"` ignores `ratio`.
- **`GlassStatusBar` sets `role="status"` on the whole bar** (`:479`). Every text change becomes a polite live-region announcement. The docs use it for a mobile "3 unread" bottom bar (`docs/app-shell/readme.md:101`).
- **`GlassSidebarPanel collapsed`** sets `aria-hidden` while its children stay focusable inside a 0-width box (`components.tsx:223-229`). That is an aria-hidden-focus violation.
- **The canonical docs example composes incorrectly.** `docs/app-shell/readme.md:62-67` passes a fragment of `GlassSidebarRail` + `GlassSidebarPanel` as `sidebar`. The body grid template is `auto minmax(0,1fr)` (`components.tsx:64-68`), so even if that class existed, the content column would wrap to a second row.
- **Templates are plausible but generic.** They are prop-heavy (`GlassDashboard`'s props run to about 100 lines, `templates/dashboard/GlassDashboard.tsx:60-160`) and have 13-26% undefined utility classes each. `GlassListView` has 15 of 57 undefined.
- **Recipes are not product starters.**
  - Many are single-file inline-style compositions with hand-drawn bar charts (`recipes.ts:270`, `:898`).
  - The 3.3 recipes ship permanently disabled states naming a specific vendor key (`OPENAI_API_KEY`, `:1501`). That contradicts the Prism-first LLM policy and gives the user nothing to grow from.
  - Two search recipes pass `value="" onChange={() => undefined}` to `GlassSearchField`, a frozen controlled input users cannot type into (`:1563`, `:1980`).

## What is outdated

- `bin/aura-glass.cjs:911` prints "3.2 target: No MUI, Radix, or Lucide required for core UI." on every `info` call in a 4.1.0 package.
- Recipe descriptions are tagged "A 3.2 app-shell recipe" and "A 3.3 search console" (`recipes.ts:826`, `:1520`). `docs/recipes/readme.md` is organized by 3.2 and 3.3 batches.
- Recipe render evidence is from `4.0.0`, generated 2026-09-05 (`reports/3.3-release/recipe-render-evidence.json:2-4`). The package is 4.1.0. The evidence is written to `reports/3.3-release` no matter which version runs (`verify-recipes-render.js:1373`).
- `src/registry/StyledComponentsRegistry.tsx` and `src/registry/index.ts:2-7` still export a deprecated no-op component plus `server/registryGuard` helpers from the recipe registry entrypoint.
- The legacy root `GlassAppShell` mixes unprefixed Tailwind (`flex h-screen overflow-hidden bg-gradient-to-br from-background ...`, `p-8`, `max-w-8xl`, which is not even a Tailwind default) with `glass-` classes (`layout/GlassAppShell.tsx:228-243`, `:302-304`). It also forces dark-on-light text through inline CSS variables (`:311-318`), which locks the theme.
- `bin/aura-glass.cjs:6` imports `spawnSync` and never uses it.

## Duplication

| Concept | Implementations | Evidence |
| --- | --- | --- |
| App shell | `aura-glass` root `GlassAppShell` (header/sidebar/footer, collapsible, mobile overlay) vs `aura-glass/app-shell` `GlassAppShell` (topBar/sidebar/actionBar/statusBar, static) | `src/index.ts:72`; `src/components/layout/GlassAppShell.tsx:15-60`; `src/app-shell/components.tsx:15-83` |
| Split pane | Root `GlassSplitPane` (draggable, ARIA separator) vs app-shell `GlassSplitPane` (static grid) | `src/index.ts:82`; `layout/GlassSplitPane.tsx:223-233`; `app-shell/components.tsx:401-425` |
| Data table | `components/data-display/GlassDataTable` (exported) vs `templates/interactive/GlassDataTable` (300 lines, not exported, has stories, tests, and snapshots) | `src/index.ts:294`; `templates/interactive/GlassDataTable.tsx:32` |
| Chart widget | `components/dashboard/GlassChartWidget` (exported) vs `templates/dashboard/widgets/ChartWidget` (579 lines, not exported). `MetricWidget` and `TableWidget` are not exported either. | `src/index.ts:457`; no `src/index.ts` export for `templates/dashboard/widgets/*` |
| Masonry | `layout/GlassMasonry` vs `layouts/GlassMasonryGrid` | `src/index.ts:79`, `:490` |
| Breadcrumbs | `navigation/GlassBreadcrumb` (root) vs app-shell `GlassBreadcrumbs` | `src/index.ts:91`; `app-shell/components.tsx:345` |
| Sidebar | `navigation/GlassSidebar` vs `GlassSidebarRail` + `GlassSidebarPanel` | |
| Workspace vs workflows | `aura-glass/workspace` and `aura-glass/workflows` are the same module | `src/workflows/index.ts:1` |
| Recipe polish CSS | `recipePolishStyle` and `lightRecipeCss` are two overlapping override sheets, plus per-recipe `<style>` blocks | `recipes.ts:61-115`, `:117-213`, `:874-890` |
| Recipes | About 8 near-duplicate recipe pairs and triples (listed above) | `recipes.ts:1-29` |
| App-shell files | 14 one-line re-export files that add nothing (for example `src/app-shell/GlassMain.tsx:1`) | |

## Fake complexity

- **Recipe metadata is decorative.**
  - `tokens` are declared for every recipe, but 0 of 28 reference a declared token in their code. They use hex values like `#526071` and `#172033` instead (for example `recipes.ts:226-230` vs `:263`).
  - `--glass-border-focus` is advertised in 4 recipes (`:460`, `:564`, `:1192`, `:1533`) and is defined nowhere. It only appears as a `var()` fallback.
  - `peerDependencies` list `chart.js`/`react-chartjs-2` (3 recipes), `react-hook-form` (2), `date-fns` (1), and `socket.io-client` (3). No recipe imports any of them.
  - `imports` metadata misses 10 recipes' actual imports.
  - Descriptions claim components the code does not use. `ai-product-console` says "using AuraGlass app shell, command dock ... first-party AI icons" (`:915`), but imports only `GlassBadge`, `GlassButton`, and `GlassCard` (`:931`). `customer-support-console` claims an "app shell" (`:1343`) and has 22 inline styles and no shell.
- **The render gate's 1,000+ lines of computed-style forensics** (`verify-recipes-render.js:411-1312`) record backdrop filters, text alpha, canvas chroma, and layout issues, but nothing reads them to decide pass or fail. `passed` is simply `screenshots.length === renderedRecipes.length` (`:1341`).
- **`layouts/` is demo code, not layout primitives.**
  - `GlassFractalLayout` renders a debug HUD ("Type:", "Depth:", "Nodes:", "Zoom:") into the product surface (`layouts/GlassFractalLayout.tsx:513-525`).
  - `GlassMasonryGrid` calls `Math.random()` in render for skeleton heights, so heights jitter on every render and server and client output differ (`layouts/GlassMasonryGrid.tsx:722`).
  - Fractal, Orbital, and Tessellation each run `requestAnimationFrame` loops (`GlassFractalLayout.tsx:148-152`, `GlassOrbitalMenu.tsx:100-102`, `GlassTessellation.tsx:192-195`).
  - These are novelty effects, not app layout.
- **The legacy shell enhances children by `displayName` sniffing** and `cloneElement(... as any)` (`layout/GlassAppShell.tsx:251-295`). It breaks silently with `memo`, HOCs, or renamed wrappers.
- **`GlassWorkspaceTabs.value` and `onValueChange`** are an API with no behavior (`workspace/index.tsx:86-105`).

## Critical findings

| ID | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| APPSHELL-WORKSPACE-RECIPES-CLI-01 | critical | **App-shell layout classes do not exist in the shipped CSS. The sidebar renders stacked above content on desktop.** None of these are defined in `src/styles/**`, component CSS, or `dist/styles/index.css`: `glass-grid-rows-[auto_1fr_auto]`, `glass-grid-cols-[auto_minmax(0,1fr)]`, `glass-grid-cols-[minmax(0,1fr)_auto]`, both split-pane ratio templates, `glass-grid-rows-2`, `glass-min-h-screen`, `glass-sticky`, `glass-top-3`, `glass-w-72`, `glass-max-w-7xl`, `glass-min-h-14`, `glass-min-h-9`, `glass-rounded-{lg,xl,2xl}` (the system uses `glass-radius-*`), `glass-place-items-center`, `glass-ml-auto`, `glass-transition-colors`, all `sky-*` colors, and all `focus-visible:glass-ring-*`. About 33 of the roughly 94 utility tokens in `src/app-shell/components.tsx` are undefined, not counting semantic hook classes. In real Chromium at 1440px, `saas-admin-shell` puts the rail at (65,131) and `GlassMain` at (65,297), full width, below the rail. The status bar is 24px tall despite `min-h-9`. | `src/app-shell/components.tsx:52-53`, `:63-68`, `:108-110`, `:168`, `:225`, `:276`, `:405-412`, `:503`; `reports/audit/visual-all/recipe-saas-admin-shell/desktop.computed-styles.json` (surfaces `glass-sidebar-rail` x=65,y=131 and `glass-main` x=65,y=297,w=1326) |
| APPSHELL-WORKSPACE-RECIPES-CLI-02 | critical | **No responsive utilities exist.** The source uses 343 `sm:/md:/lg:/xl:glass-*` occurrences across 118 files (227 in 74 non-story files; 70 unique classes). The shipped CSS has one `sm\:glass-` rule and zero `md\:`, `lg\:`, or `xl\:` rules. Recipe grids like `md:glass-grid-cols-3` never apply. The package has no Tailwind config to generate them. | `src/registry/recipes.ts:1484` (`md:glass-grid-cols-3`), and in total 4× `md:glass-grid-cols-3`, 2× `md:glass-grid-cols-2`, 1× `lg:glass-grid-cols-[...]` in recipes; no `tailwind.config.*` in the repo |
| APPSHELL-WORKSPACE-RECIPES-CLI-03 | high | **The recipe render gate cannot fail on layout, and it misses almost all runtime errors.** `pageErrors` and `consoleErrors` are reset at the start of each recipe (`:354-355`) and again before each viewport (`:398-399`). The only failing check (`:1325`) runs after the loop, so it sees errors from the last recipe's mobile capture only. `layoutIssues` are written to JSON and never asserted. The current evidence holds 48 recorded layout issues across 14 recipes, and `passed: true`. | `scripts/ci/verify-recipes-render.js:353-355`, `:397-399`, `:1305`, `:1313-1319`, `:1325-1342`; `reports/3.3-release/recipe-render-evidence.json` (`"passed": true`) |
| APPSHELL-WORKSPACE-RECIPES-CLI-04 | high | **Recipes depend on `!important` override sheets to look acceptable.** Each recipe copied into a user's project carries a large `<style>` block that force-overrides backgrounds, borders, colors, `backdrop-filter`, and the shell's own grid. Layout fixes for the shell's broken grid live in recipe CSS, not in components. This is evidence that the default components do not reach the "premium first-party" bar. | `src/registry/recipes.ts:61-115` (`recipePolishStyle`), `:117-213` (`lightRecipeCss`), `:874-890` (saas-admin-shell overriding `.glass-app-shell__body` and `.glass-sidebar-rail` with `!important`) |
| APPSHELL-WORKSPACE-RECIPES-CLI-05 | high | **The shipped global stylesheet includes a Storybook Tailwind shim** that defines unprefixed `.flex`, `.inline-flex`, `.block`, `.max-w-7xl`, and others. Any consumer using Tailwind or their own utility names gets conflicting global rules from `aura-glass/styles`. | `src/styles/index.css:24-25`; `src/styles/storybook-utility-shim.css:1-12`, `:332` |
| APPSHELL-WORKSPACE-RECIPES-CLI-06 | high | **Two incompatible `GlassAppShell` and `GlassSplitPane` exports share names across entrypoints.** The root export is the older collapsible/mobile shell; `aura-glass/app-shell` is the static one. Users who import from the wrong path get a different prop contract. The newer one lacks mobile behavior the older one has. | `src/index.ts:72`, `:82`; `src/components/layout/GlassAppShell.tsx:15-60`, `:202-214`; `src/app-shell/components.tsx:15-83`, `:396-425`; `docs/app-shell/readme.md:5` |
| APPSHELL-WORKSPACE-RECIPES-CLI-07 | medium | **Recipe registry metadata is false.** 0 of 28 recipes use their declared tokens. `--glass-border-focus` is advertised but undefined. Unused peer dependencies are declared (`chart.js`, `react-chartjs-2`, `react-hook-form`, `date-fns`, `socket.io-client`). Descriptions claim an app shell and command dock that the code lacks. | `src/registry/recipes.ts:225-230`, `:460`, `:915` vs `:931`, `:1343`, `:1533` |
| APPSHELL-WORKSPACE-RECIPES-CLI-08 | medium | **The registry is not a schema.** It is a TypeScript array of template strings with no `$schema`, version, `registryDependencies`, per-file type, CSS-variable payload, or remote fetch. Files do have a flat `path` written under `--out` (default `src/components/auraglass/recipes`), but there is no typed target. Recipes are page compositions that import the package, not copy-in component sources, so "shadcn-style" ownership does not exist. Nothing is validated except the presence of fields. | `src/registry/recipes.ts:31-57`; `bin/aura-glass.cjs:250-263`, `:771-799`; `scripts/ci/verify-recipes-cli.js:249-277` |
| APPSHELL-WORKSPACE-RECIPES-CLI-09 | medium | **Workspace tabs leak props and lack tab semantics.** `value` and `onValueChange` are spread to the DOM. There is no keyboard model and no tabpanel linkage. | `src/workspace/index.tsx:86-134` |
| APPSHELL-WORKSPACE-RECIPES-CLI-10 | medium | **Accessibility defects in shell primitives.** A collapsed `GlassSidebarPanel` is `aria-hidden` but its content stays focusable. `GlassStatusBar` makes the whole bar a live region. | `src/app-shell/components.tsx:223-229`, `:479` |
| APPSHELL-WORKSPACE-RECIPES-CLI-11 | medium | **Frozen controlled inputs in shipped recipes.** `value=""` with a no-op `onChange` means users cannot type in the copied search consoles. | `src/registry/recipes.ts:1563`, `:1980` |
| APPSHELL-WORKSPACE-RECIPES-CLI-12 | medium | **The legacy split pane computes size from the viewport, not the container.** Dragging inside any non-full-width container jumps to the wrong ratio. Dragging uses window `mousemove`/`mouseup` only, with no pointer or touch support. The separator does have keyboard support (5% steps, `:137`, `:233`). | `src/components/layout/GlassSplitPane.tsx:107-135` (`e.clientX / window.innerWidth`, `:116`) |
| APPSHELL-WORKSPACE-RECIPES-CLI-13 | medium | **Fake or misnamed primitives.** `GlassResizablePanel` cannot resize and uses an invalid `maxWidth: "1fr"` default. | `src/app-shell/components.tsx:428-446` |
| APPSHELL-WORKSPACE-RECIPES-CLI-14 | low | **Hydration and runtime hazards in layouts.** `Math.random()` runs in render. A debug HUD ships in `GlassFractalLayout`. The legacy shell decides `isMobile` only after mount, so the SSR markup is desktop and then flips. | `src/components/layouts/GlassMasonryGrid.tsx:722`; `src/components/layouts/GlassFractalLayout.tsx:513-525`; `src/components/layout/GlassAppShell.tsx:195-214` |
| APPSHELL-WORKSPACE-RECIPES-CLI-15 | low | **Dead template code with live stories.** `templates/interactive/GlassDataTable` and `templates/dashboard/widgets/{Chart,Metric,Table}Widget` are not exported from the package but carry stories, tests, and snapshots, and they inflate component counts. | `src/components/templates/interactive/GlassDataTable.tsx:32`; `src/index.ts:294`, `:457`, `:467-472` |
| APPSHELL-WORKSPACE-RECIPES-CLI-16 | low | **CLI staleness and rough edges.** `info` prints a "3.2 target" string. `spawnSync` is unused. `migrate radix\|mui --write` silently reports `report-only-write-requested`. `add` does not detect or install peer dependencies, Next.js App Router `"use client"` needs, or path aliases. The render gate only tests Vite, never Next.js. | `bin/aura-glass.cjs:6`, `:605`, `:911`, `:771-799`; `scripts/ci/verify-recipes-render.js:115-135` |
| APPSHELL-WORKSPACE-RECIPES-CLI-17 | low | **The new app shell has no certification target.** The certification screenshots cover only the legacy `components-layout-glassappshell` and `zspaceapplayout`. `src/app-shell` and `src/workspace` appear only in `AppChromeVisualBaseline`, which lays out the shell with inline styles and so hides the missing grid classes. | `reports/glassmorphism-storybook-visual-certification/screenshots/` (no app-shell or workspace slug); `src/stories/AppChromeVisualBaseline.stories.tsx:33-56` |

## Recommendations for AuraGlass 5.0

1. **Choose one styling engine and enforce it.** Either ship a real utility generator (a Tailwind preset or a build step that emits every `glass-*` class used in source, including responsive and state variants), or move shell and workspace styling to authored component CSS keyed on the existing semantic hooks (`.glass-top-bar`, `.glass-app-shell__body`, ...). The second is the better fit for a design system. Add a CI check that fails when any `className` token has no matching selector in the built CSS. The script used for this audit is about 20 lines.
2. **Have one app shell with real product behavior.** Merge the two `GlassAppShell`s into a single `aura-glass/app-shell` frame with:
   - collapsible rail and panel
   - a mobile drawer with focus trap and scrim
   - container-query breakpoints, not `window.innerWidth`
   - safe-area insets
   - a defined scroll owner (`main` scrolls; the top bar is sticky inside it)
   - a pointer-based resizable split pane with ARIA separator and keyboard support, built from the legacy one but measured against the container rect

   Deprecate the root export with a codemod in the CLI.
3. **Tokenize the chrome.** Replace `sky-*` and `white/NN` with `--glass-theme-brand`, `--glass-theme-focus`, and `--glass-theme-surface*` so `createGlassTheme` re-skins the shell. Remove every `!important` from recipes. If a recipe needs an override, the component is wrong.
4. **Replace the registry with a schema.** Publish a JSON registry (`registry.json` plus per-item JSON) that has:
   - `$schema`, `version`, and `type` (`block`/`page`/`component`)
   - `files[].target`
   - `dependencies` and `registryDependencies`
   - `cssVars`
   - `meta.viewports`

   Validate it in CI. Derive `imports`, `peerDependencies`, and `tokens` from the source by AST, not by hand. Optionally offer true copy-in of component source (`aura-glass add button --source`) for teams that want ownership.
5. **Cut recipes from 28 to about 10 flagship surfaces**, each built only from shell, workspace, and first-party components:
   - zero inline layout styles and zero hex values
   - real interaction (typeable search, switchable tabs, sortable table)
   - empty, loading, and error variants as props, not as the default screen
   - provider-agnostic placeholders that do not name OpenAI

   Delete the near-duplicate pairs.
6. **Make the render gate honest.**
   - Accumulate console and page errors across the whole run.
   - Fail on any undefined-class hit, horizontal overflow, or element overlap (rail versus main bounding-box overlap or stacking where side-by-side is expected).
   - Keep the screenshot evidence, but compare it against approved baselines.
   - Add a Next.js App Router harness (RSC boundary and `"use client"`) next to Vite.
   - Write evidence into a version-named directory.
7. **Retire the novelty `layouts/` from the core package.** Move Fractal, Orbital, Tessellation, and Island to an `aura-glass/labs` entrypoint. Delete `Math.random` from render and the debug HUDs. Merge the two masonry implementations.
8. **Delete or export the dead templates.** Fold `templates/interactive/GlassDataTable` and `templates/dashboard/widgets/*` into the exported data-display and dashboard families, or remove them and their stories.
9. **Remove `storybook-utility-shim.css` from `aura-glass/styles`.** Load it only inside `.storybook/preview`.
10. **Finish the CLI as the product's front door.** Add `aura-glass init` (writes the styles import, theme provider, and optional `components.json`-style config), peer-dependency detection and installation prompts in `add`, Next.js `"use client"` insertion, path-alias awareness, a `diff` and `update` flow for previously added recipes, and versioned output. Remove stale "3.2" strings.

## Verification (adversarial)

Each finding was checked independently against the source code, `dist/styles/index.css` (the `./styles` export in package.json:38) and the stored evidence JSON. Nothing was rebuilt or re-rendered. The `dist` and `reports/audit/visual-all` artifacts date from 2026-09-05.

| id | verdict | note |
|---|---|---|
| APPSHELL-WORKSPACE-RECIPES-CLI-01 | CONFIRMED | The shipped CSS has no selector for `glass-grid-rows-[auto_1fr_auto]`, `glass-grid-cols-[...]`, `glass-grid-cols-2`, `glass-rounded-xl/2xl/lg`, `glass-sticky`, `glass-top-3`, `glass-w-72`, `glass-min-h-14/9`, `glass-min-h-screen`, any `sky-*` utility, `hover:`/`focus-visible:` variants, or `glass-max-w-7xl/3xl` (rg against src/styles and dist/styles/index.css: 0 hits). I extracted 104 unique `glass-*` tokens from src/app-shell/components.tsx. About 44 have no rule. Roughly 12 of those are BEM hooks such as `glass-top-bar`, which leaves about 32 missing utilities, so the ~33 figure holds. In reports/audit/visual-all/recipe-saas-admin-shell/desktop.computed-styles.json the nav rail is at x=65, y=131, w=82, h=154 and main is at x=65, y=297, w=1326. That means the rail is stacked above main. |
| APPSHELL-WORKSPACE-RECIPES-CLI-02 | CONFIRMED (the count is understated) | My count is 343 `sm:/md:/lg:/xl:glass-*` occurrences across 118 files under src (70 unique classes). Excluding stories it is still 227 occurrences in 74 files. The claimed 168/55 is low, so the real problem is larger. The shipped CSS has exactly one responsive rule, `.sm\:glass-inline`, and no `md:`, `lg:` or `xl:` rules. There is no `tailwind.config.*` in the repo. recipes.ts:1484 uses `md:glass-grid-cols-3`. |
| APPSHELL-WORKSPACE-RECIPES-CLI-03 | CONFIRMED | scripts/ci/verify-recipes-render.js:354-355 resets `pageErrors`/`consoleErrors` for each recipe, and :397-398 resets them again for each viewport. The only error check is after the loop (:1325), so only the last capture's errors can fail the gate. `layoutIssues` is filled (:638-1305) and written to JSON but never asserted on. `passed` is `screenshots.length === renderedRecipes.length` (:1342). The 84 computed-style files contain 48 layoutIssues, which matches the claim. The saas-admin-shell desktop file records 0 layoutIssues even though the rail is stacked, so the layout heuristics miss this defect too. |
| APPSHELL-WORKSPACE-RECIPES-CLI-04 | CONFIRMED | recipes.ts has 75 `!important` and 114 hex literals. The shared `recipePolishStyle` (:61-115) overrides background, border, box-shadow and backdrop-filter on every shell surface with `!important`. The only patch to the shell grid is recipes.ts:888, which applies only at `max-width: 600px` and sets `.glass-app-shell__body { grid-template-columns: minmax(0,1fr) !important }`. There is no desktop fix, which explains finding 01. |
| APPSHELL-WORKSPACE-RECIPES-CLI-05 | CONFIRMED | src/styles/index.css:24-25 imports storybook-utility-shim.css. The built dist/styles/index.css contains the unprefixed rules `}.flex{`, `}.block{` and `}.max-w-7xl{`, so they ship to consumers via `aura-glass/styles`. |
| APPSHELL-WORKSPACE-RECIPES-CLI-06 | CONFIRMED | src/index.ts:72 and :82 export the legacy `GlassAppShell`/`GlassSplitPane` from components/layout. package.json:119 `./app-shell` re-exports src/app-shell/components.tsx, which declares new components with the same names (:24, :401). The legacy shell has viewport/mobile logic (GlassAppShell.tsx:202-214). The new shell has no breakpoint logic. Mobile behaviour exists only as the separate `GlassMobileShell` (components.tsx:503), so it is not missing entirely but it is not built into the shell. |
| APPSHELL-WORKSPACE-RECIPES-CLI-07 | CONFIRMED | I parsed all 28 recipe blocks and included the shared CSS constants they interpolate. 0 of 28 reference any of their declared `tokens`. Nine recipes declare peer dependencies that they never import (chart.js/react-chartjs-2, react-hook-form, date-fns, socket.io-client). AI Product Console (:915) claims an "app shell, command dock" but its file imports only `GlassBadge, GlassButton, GlassCard` (:931). |
| APPSHELL-WORKSPACE-RECIPES-CLI-08 | PARTIAL | Correct: the registry is a TS array (recipes.ts:31-57) with no `$schema`, version or `registryDependencies` (rg: 0 hits). The CLI loads it from dist/registry (bin/aura-glass.cjs:250-263). Recipes `import ... from 'aura-glass'` rather than vendoring source. Overstated: there are file targets. Each `files[].path` is written under `--out` (default `src/components/auraglass/recipes`) with path containment and `--force`/`--dry-run` (bin/aura-glass.cjs:771-799). They are flat and untyped, though. |
| APPSHELL-WORKSPACE-RECIPES-CLI-09 | CONFIRMED | src/workspace/index.tsx:86-127: `value`/`onValueChange` are not destructured, so `{...props}` spreads them onto the `<div role="tablist">`. React will warn about the unknown `onValueChange` prop and set a `value` attribute on the div. There is no `onKeyDown`, roving tabindex, `aria-controls` or `tabpanel` anywhere in the file (rg: 0 hits). |
| APPSHELL-WORKSPACE-RECIPES-CLI-10 | CONFIRMED | components.tsx:223-229: when collapsed, the panel gets `glass-w-0 glass-overflow-hidden` and `aria-hidden`. There is no `inert`, `hidden` or `tabIndex` handling (rg: 0 hits), so focusable children inside the aria-hidden region stay in the tab order. `GlassStatusBar` puts `role="status"` on the whole bar (:479). |
| APPSHELL-WORKSPACE-RECIPES-CLI-11 | CONFIRMED | recipes.ts:1563 and :1980 have `value="" onChange={() => undefined}`. GlassSearchField forwards `value` to GlassInput (GlassSearchField.tsx:25,40). GlassInput has no internal value state (its only state is `isFocused`, GlassInput.tsx:142), so the input is controlled and stays frozen at an empty string. |
| APPSHELL-WORKSPACE-RECIPES-CLI-12 | PARTIAL | Correct: the position is `e.clientX / window.innerWidth` (GlassSplitPane.tsx:117-119), not the container rect, and dragging uses only window `mousemove`/`mouseup` with no pointer or touch events. Wrong: it is not "mouse only". The separator has keyboard support (`handleKeyDown` in 5% steps, :137 and :233). |
| APPSHELL-WORKSPACE-RECIPES-CLI-13 | CONFIRMED | components.tsx:428-446: `GlassResizablePanel` is a plain div with `minWidth`/`maxWidth` inline styles and no handle, `resize` property or drag logic. The default `maxSize = "1fr"` is passed to `maxWidth`. `fr` is not a valid length for `max-width`, so the browser drops the declaration. |

Summary: 11 CONFIRMED, 2 PARTIAL, 0 REFUTED. The critical-findings table above has been corrected for 02 (count), 08 (flat file targets exist), and 12 (keyboard support exists). A re-check on 2026-10-06 reconfirmed 01 (0 matches for `glass-sticky`, `glass-w-72`, `glass-grid-rows-[auto…`, or `md\:glass` in `dist/styles/index.css` and `src/styles`), 03 (buffer resets at `verify-recipes-render.js:354-355` and `:397-398`; `passed` at `:1342`), 05 (`src/styles/index.css:24-25`), 09 (`src/workspace/index.tsx:86-105`), and 17 (the certification screenshot directory has only legacy `components-layout-*` shell slugs). It also confirmed 28 recipe entries in `recipes.ts`. The PNG screenshots could not be viewed in this environment because the Read tool returned empty, so visual claims rest on the computed-styles JSON.

## Verification (adversarial, second pass)

This pass was independent and read-only, run on 2026-10-06. I checked against source, `dist/styles/index.css` (built Sep 5, same day as HEAD 15b6de6f7, which is the last commit touching `src/app-shell` and `src/styles`) and the stored evidence JSON. Nothing was rebuilt or rendered.

| id | verdict | note |
|---|---|---|
| APPSHELL-WORKSPACE-RECIPES-CLI-01 | CONFIRMED | `rg` for `glass-rounded`, `glass-sticky`, `glass-w-72`, `glass-min-h-screen` over `src/styles` and `dist/styles/index.css` returns 0. These tokens appear only in JS bundles (`dist/app-shell/index.mjs` and others), never in CSS. No runtime injector generates `glass-*` utilities: the only `createElement("style")` sites are unrelated (`utils/dynamicTheme.ts:40`, `GlassTypingIndicator.tsx:278` and others). The class strings are at `components.tsx:52-53` (rows template) and `:63-68` (column templates). `desktop.computed-styles.json` gives `nav.glass-sidebar-rail` x=65, y=131.19, h=154 and `main.glass-main` x=65, y=297.19, w=1326. That is stacked, not side by side. |
| APPSHELL-WORKSPACE-RECIPES-CLI-02 | PARTIAL | The substance holds: 343 `(sm\|md\|lg\|xl):glass-*` occurrences in 118 src files, no `tailwind.config*`, and `md:glass-grid-cols-3` never applies. The detail "exactly one responsive rule" is wrong. `dist/styles/index.css` has 5 breakpoint-prefixed rules: `.sm\:glass-inline` (from `glass.css`) plus `.md\:col-span-{3,4,6,12}` from the Storybook shim. Correct wording: exactly one responsive `glass-*` rule. |
| APPSHELL-WORKSPACE-RECIPES-CLI-03 | CONFIRMED | The resets are at `verify-recipes-render.js:354-355` and `:398-399`, one line off from the cited `:397-398`. The only error throw is at `:1325`, after the loop. `layoutIssues` is never read after `:1305`. `passed` is defined at `:1342`. One nuance: `recipe-render-evidence.json` has no `layoutIssues` key at all, and its keys are only generatedAt…passed. The 48 issues (14 recipes, 84 files) live in `reports/audit/visual-all/recipe-*/*.computed-styles.json`, which I recounted. The defective `saas-admin-shell` desktop file records 0 issues. |
| APPSHELL-WORKSPACE-RECIPES-CLI-04 | CONFIRMED | `recipes.ts` has 75 `!important`. My hex regex finds 117 hex literals against the claimed 114, so the count is consistent. The `saas-admin-shell` CSS (`:874-890`) patches the shell grid only inside `@media (max-width: 600px)` (`.glass-app-shell__body { grid-template-columns: minmax(0,1fr) !important }`). Calling it a shell-grid "patch" is accurate but understates the problem, because there is no desktop fix. |
| APPSHELL-WORKSPACE-RECIPES-CLI-05 | CONFIRMED | `src/styles/index.css:24-25` imports `storybook-enhancements.css` and `storybook-utility-shim.css` under a "STORYBOOK SPECIFIC" comment. The shim defines `.flex` (:6), `.block` (:12) and `.max-w-7xl` (:332). The dist CSS contains `}.flex{`, `}.block{` and `}.max-w-7xl{` once each. |
| APPSHELL-WORKSPACE-RECIPES-CLI-06 | CONFIRMED | `src/index.ts:72` and `:82` export the legacy shell and split pane. `package.json:119-123` maps `./app-shell` to `dist/app-shell`. The legacy shell has `isMobile` and a resize listener (`GlassAppShell.tsx:195-214`). The new shell (`components.tsx:15-83`) has no breakpoint logic. As already noted, a separate `GlassMobileShell` exists, so "none of the mobile behaviour" applies to `GlassAppShell` itself only. |
| APPSHELL-WORKSPACE-RECIPES-CLI-07 | CONFIRMED | `rg 'var\(--glass-'` over `recipes.ts` returns 0, so none of the 28 recipes (`id:` count 28) consume any CSS variable, declared or not. `--glass-border-focus` has 0 hits in `src/styles` and `dist/tokens`. One example: `:915` claims "app shell, command dock", but `:917` and `:931` import only `GlassBadge, GlassButton, GlassCard`. `:225` declares chart.js and react-chartjs-2. |
| APPSHELL-WORKSPACE-RECIPES-CLI-08 | PARTIAL | `$schema`, `registryDependencies` and `cssVars` each return 0 in `recipes.ts` and `bin/aura-glass.cjs`, and recipes import from `'aura-glass'`. As the first pass noted, flat `files[].path` output targets do exist (`bin/aura-glass.cjs:771-799`), so "no typed targets" is true only in the narrow sense. |
| APPSHELL-WORKSPACE-RECIPES-CLI-09 | CONFIRMED | `workspace/index.tsx:93` destructures only `className` and `children`, so `value` and `onValueChange` go through `{...props}` onto `<div role="tablist">` (:95-103). `GlassWorkspaceTab` has no `onKeyDown`, `tabIndex` roving or `aria-controls`, and the file has no `tabpanel`. |
| APPSHELL-WORKSPACE-RECIPES-CLI-10 | CONFIRMED | `components.tsx:228` sets `aria-hidden={collapsed \|\| undefined}`. The collapsed classes are `glass-w-0 glass-overflow-hidden` (:225), with no `inert`, `hidden` or `tabIndex` (rg finds only decorative `aria-hidden` spans at :192 and :372). `GlassStatusBar` sets `role="status"` on the whole bar (:479). |
| APPSHELL-WORKSPACE-RECIPES-CLI-11 | CONFIRMED | `recipes.ts:1563` and `:1980` contain `value="" onChange={() => undefined}`. `GlassSearchField.tsx:25` and `:40` pass `value` straight through. `GlassInput` keeps only `isFocused` state (:142), so the field is controlled and frozen. |
| APPSHELL-WORKSPACE-RECIPES-CLI-12 | PARTIAL | `GlassSplitPane.tsx:116` and `:118` use `e.clientX / window.innerWidth` (and the Y/innerHeight equivalent). `:127-128` registers only window `mousemove` and `mouseup`. `rg pointer\|touch` finds nothing in the file. The finding title already says "keyboard works", so it is accurate. It stays PARTIAL only because the title's "mouse events only" could be misread as covering keyboard. |
| APPSHELL-WORKSPACE-RECIPES-CLI-13 | CONFIRMED | `components.tsx:432-446`: the panel is a plain div, `maxSize = "1fr"` is fed to `style.maxWidth`, and there is no handle or drag logic. `max-width` accepts only `<length-percentage>` and keywords, so `1fr` is invalid and React's inline style is dropped by the browser. |

Second-pass summary: 10 CONFIRMED, 3 PARTIAL, 0 REFUTED. The only material correction is to 02: dist has 5 responsive rules (4 unprefixed `md:col-span-*` from the Storybook shim), not 1. That correction strengthens 05. For 03, the 48 layout issues live in `reports/audit/visual-all`, not in `recipe-render-evidence.json`.
