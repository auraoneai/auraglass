# AuraGlass 5.0 PRD: App Shell, Navigation and Workspace Surfaces

| Field | Value |
|---|---|
| Key | **NAV** (`PRD-NAV`; shared contract registry `prd/_shared-contracts.md` SC-01). Other PRDs are cited as `PRD-<KEY>`, with the §16 id in parentheses where useful. |
| PRD id | **PRD-11** is this file's program self-id and is an alias only (SC-01). The architecture §16 boundary is **PRD-10** (`AURAGLASS_5_TARGET_ARCHITECTURE.md` §16; §16 uses PRD-11 for data/date = `PRD-DATA`). Task `depends_on` never uses either number (SC-40). The SC-01 crosswalk, maintained by PRD-REL, is the alias table. |
| Shared contracts | This PRD complies with `prd/_shared-contracts.md`. The registry wins on conflict. NAV is owner of: `data-ag-slot`, `data-ag-sidebar`, `data-ag-sidebar-side`, `data-ag-layout`, `data-ag-placement`, `data-ag-appearance`, `data-ag-inspector` (SC-21); the `app-frame` registry block content (SC-32); the `app-shell-slots` codemod transform content (SC-33); the shell blur budget (SC-38); the `src/registry/recipes.ts` removal (SC-38, NAV-136). It is a consumer of everything else (SC-02, SC-04, SC-15, SC-18..20, SC-22, SC-25, SC-27, SC-30, SC-31, SC-34, SC-36, SC-39). |
| Owner area | App frame and navigation (`aura-glass/app-shell`, root navigation flagships) |
| Status | Draft |
| Architecture anchors | §16 PRD-10 row; §11.2 flagships 22–31; §3.2 `./app-shell` row; §12 consolidation rows for AppShell, Sidebar, TopBar, ResizablePanels; §4.6 layer model; §4.7 tier budgets; §6 owned a11y rules; §8 motion; §9.1 RSC; §10 styling |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md`; `docs/auraglass-5/AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `docs/auraglass-5/AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`; `docs/auraglass-5/AURAGLASS_MISSING_CAPABILITY_MAP.md`; `docs/auraglass-5/autopsy/appshell-workspace-recipes-cli.md`; `docs/auraglass-5/autopsy/runtime-remote.md`; `docs/auraglass-5/autopsy/accessibility.md`; `docs/auraglass-5/autopsy/api-consistency.md`; `docs/auraglass-5/autopsy/performance.md`; `docs/auraglass-5/autopsy/storybook-showcase.md`; `docs/auraglass-5/component-inventory.json` |
| Related decisions | D-02 (React ^19 refs), D-04 (tier vocabulary), D-05 (enhanced opt-in), D-06 (variant union), D-07 (thickness), D-08 (content materials), D-09 (no production downgrade), D-10 (`AuraGlassScript` pre-paint), D-11 (OS floors), D-13 (Base UI foundation; ResizablePanels and AppShell layout are Owned), D-14 (drop `Glass` prefix, `compat`), D-15 (export budget), D-20 (attribute names), D-24 (CSS layers, zero `!important`), D-25 (CSS motion, no JS runtime in core), D-26 (per-import budgets), D-27 (change-class enforcement) |
| Requirement prefix | `REQ-NAV-NN` |
| Acceptance prefix | `AC-NAV-NN` |

Scope: flagships 22–31 (`AppShell`, `Sidebar`, `TopBar`, `Tabs`, `TabBar`, `Breadcrumbs`, `Pagination`, `CommandPalette`/`Command`, `ResizablePanels`, `SourceTransition`) plus the non-flagship `./app-shell` members named in §3.2 (`Inspector`, `StatusBar`, `MobileShell`) and the slot sub-components (`AppShell.Main`, `PageHeader`). Toolbar (flagship 3), IconButton (flagship 2), SegmentedControl (4), Menu/Menubar (20) and Sheet (17) are **consumed** from PRD-08/PRD-09 and are not re-implemented here. "Dock" and "nav bar" in the program brief map to `TabBar` (`placement="floating"`) and `TopBar` respectively; no separate `Dock` or `NavBar` export is added (D-15 export budget).

---

## 1. Problem

AuraGlass 4.1.0 has no working app frame. The `aura-glass/app-shell` subpath is the recommended shell in `docs/app-shell/readme.md`, yet it lays out nothing at desktop width:

1. **The layout is built on classes that do not exist.** About 32 of the ~104 `glass-*` utility tokens in `src/app-shell/components.tsx` have no selector in `src/styles/**` or `dist/styles/index.css`, including every grid template that places the sidebar beside the content (`glass-grid-rows-[auto_1fr_auto]`, `glass-grid-cols-[auto_minmax(0,1fr)]`), `glass-sticky`, `glass-w-72`, `glass-min-h-screen`, all `sky-*` accents and all `focus-visible:glass-ring-*` variants. In real Chromium at 1440px the `saas-admin-shell` recipe stacks the rail (x=65, y=131) above `GlassMain` (x=65, y=297, w=1326) instead of beside it (APPSHELL-WORKSPACE-RECIPES-CLI-01, CONFIRMED twice). There is no responsive system at all: 343 `sm:/md:/lg:/xl:glass-*` occurrences in 118 files against exactly one responsive `glass-*` rule (APPSHELL-WORKSPACE-RECIPES-CLI-02).
2. **Two incompatible shells and two split panes share names.** Root `GlassAppShell`/`GlassSplitPane` (`src/index.ts:72`, `:82`) are the older collapsible shell and draggable pane; `aura-glass/app-shell` exports different, static components with the same names (APPSHELL-WORKSPACE-RECIPES-CLI-06, API-CONSISTENCY-06). The newer shell has no collapse, no drawer, no breakpoint behaviour, no safe-area handling and no scroll owner, so it is a functional regression of the older one.
3. **Navigation primitives use the wrong semantics.** Page-level bottom navigation is built as `role="tablist"`/`role="tab"` with no tab panels (`GlassBottomNav.tsx:165`, `:260`; `LiquidGlassTabBar.tsx:116`). `GlassTabs` wraps every tab set in a `role="navigation"` landmark and builds ids from `value` alone, so two instances collide (ACCESSIBILITY-13). Workspace tabs are a façade that leaks `value`/`onValueChange` to the DOM and has no keyboard model (APPSHELL-WORKSPACE-RECIPES-CLI-09). Seven tab/segmented components use five selection contracts (API-CONSISTENCY-04). The sidebar rail renders navigation destinations as `<button>` with `aria-current="page"` rather than links (`src/app-shell/components.tsx:164-199`).
4. **Shell primitives fail basic a11y.** A collapsed `GlassSidebarPanel` is `aria-hidden` while its children stay focusable (`components.tsx:223-229`); `GlassStatusBar` makes the whole bar a live region (`:479`) (APPSHELL-WORKSPACE-RECIPES-CLI-10).
5. **Resizable panes are fake or wrong.** `GlassResizablePanel` cannot resize and feeds `maxWidth: "1fr"` (invalid) (APPSHELL-WORKSPACE-RECIPES-CLI-13). The legacy `GlassSplitPane` computes position as `e.clientX / window.innerWidth` and listens only to window `mousemove`/`mouseup`, so it breaks inside any non-full-width container and on touch (APPSHELL-WORKSPACE-RECIPES-CLI-12, PARTIAL: keyboard works in 5% steps).
6. **The shell is unreadable and slow at runtime.** Fresh remote Chromium evidence (`autopsy/runtime-remote.md` §2, §5): both "3.2 App Shell" stories fail contrast on their **own default stage** on 4–5 of 5 sampled text runs at 1440 and 390 (ink `rgba(0,0,0,.9)` on `rgb(13,31,43)`, 1.12–2.14:1). They render 21–29 backdrop-filtered elements (nesting depth 4, max blur 40px) plus 4 infinite animations and drop to 19–23 fps under scripted hover/scroll versus 60 fps on simple stories. Under forced colors the app shell still has 3 visible backdrop filters (21 → 3).
7. **Nothing certifies it.** The visual certification covers only the legacy `components-layout-glassappshell` and `zspaceapplayout` slugs; `src/app-shell` appears only in `AppChromeVisualBaseline`, which lays out the shell with inline styles and hides the missing grid (APPSHELL-WORKSPACE-RECIPES-CLI-17). The six "3.2/App Shell" stories are aliases of one story (STORYBOOK-SHOWCASE-10). Recipes paper over the broken grid with `!important` override sheets (75 `!important` in `src/registry/recipes.ts`, APPSHELL-WORKSPACE-RECIPES-CLI-04).

The consequence: the surface every product screen sits inside — the one place Liquid Glass belongs by HIG layer rules (gap analysis P5) — is the least trustworthy part of the library. 5.0 must ship one app frame and one navigation family that lay out correctly with no consumer CSS, read at ≥4.5:1 over any declared backdrop, stay inside the §4.7 blur budget, and pass APG keyboard scripts.

---

## 2. Evidence from the current codebase

All paths verified with `rg --files` at HEAD 15b6de6f7. Finding verdicts are taken from the autopsy verification tables; PARTIAL findings are cited with their corrected wording. No finding used here is REFUTED. Rows marked **(PRD-verified)** were read directly at source while writing this PRD and are not yet in an autopsy table.

### 2.1 Static code findings

| # | Finding | Evidence (path:line) | Finding ID / verdict |
|---|---|---|---|
| E-01 | App-shell grid, sizing, sticky, radius, accent and focus-ring utilities are undefined in shipped CSS; ~32 missing utilities | `src/app-shell/components.tsx:52-53` (rows template), `:63-68` (column templates), `:168`, `:225`, `:405-412`, `:503` | APPSHELL-WORKSPACE-RECIPES-CLI-01, CONFIRMED ×2 |
| E-02 | No responsive utilities: 343 `sm:/md:/lg:/xl:glass-*` occurrences in 118 files; one responsive `glass-*` rule (`.sm\:glass-inline`) | `src/registry/recipes.ts:1484`; `dist/styles/index.css` | APPSHELL-WORKSPACE-RECIPES-CLI-02, PARTIAL (5 responsive rules total, 4 from the Storybook shim) |
| E-03 | Two `GlassAppShell` and two `GlassSplitPane` with the same names on different entries | `src/index.ts:72`, `:82`; `src/components/layout/GlassAppShell.tsx:15-60`; `src/app-shell/components.tsx:24`, `:401` | APPSHELL-WORKSPACE-RECIPES-CLI-06, API-CONSISTENCY-06, CONFIRMED |
| E-04 | Legacy shell decides `isMobile` after mount from `window.innerWidth` (SSR renders desktop, then flips) | `src/components/layout/GlassAppShell.tsx:195-214` (`:204`) | APPSHELL-WORKSPACE-RECIPES-CLI-14, CONFIRMED |
| E-05 | Legacy shell enhances children by `displayName` sniffing and `cloneElement(... as any)` | `src/components/layout/GlassAppShell.tsx:251-295` | autopsy §Fake complexity |
| E-06 | Legacy shell mixes unprefixed Tailwind (`max-w-8xl`, not a Tailwind default) with `glass-` classes and pins dark-on-light ink via inline vars | `src/components/layout/GlassAppShell.tsx:228-243`, `:302-304`, `:311-318` | autopsy §Outdated |
| E-07 | New shell is static: `GlassSidebarPanel collapsed` = width 0; `GlassMobileShell` has no bottom-bar positioning or `env(safe-area-inset-*)` | `src/app-shell/components.tsx:223-228`, `:496-515` | autopsy §Mediocre |
| E-08 | Collapsed panel is `aria-hidden` with focusable children (no `inert`); whole status bar is `role="status"` | `src/app-shell/components.tsx:223-229` (`:228`), `:479` | APPSHELL-WORKSPACE-RECIPES-CLI-10, CONFIRMED |
| E-09 | Sidebar rail destinations are `<button type="button">` carrying `aria-current="page"`; no `href`, so no open-in-new-tab, no prefetch, no link semantics | `src/app-shell/components.tsx:164-199` | (PRD-verified) |
| E-10 | Accents hard-coded `sky-300`/`sky-100` (undefined classes) bypass `createGlassTheme` | `src/app-shell/components.tsx:185-187`, `:310`, `:462`, `:533`; `src/workspace/index.tsx:125-127`; `src/theme/createGlassTheme.ts:209-218` | autopsy §Mediocre |
| E-11 | `GlassResizablePanel` has no handle or drag; default `maxSize="1fr"` fed to `maxWidth` (invalid, dropped) | `src/app-shell/components.tsx:428-446` | APPSHELL-WORKSPACE-RECIPES-CLI-13, CONFIRMED |
| E-12 | App-shell `GlassSplitPane` is a fixed two-column grid; `direction="vertical"` ignores `ratio` | `src/app-shell/components.tsx:401-425` | autopsy §Mediocre |
| E-13 | Legacy `GlassSplitPane` uses `e.clientX / window.innerWidth`; window `mousemove`/`mouseup` only; keyboard in 5% steps works | `src/components/layout/GlassSplitPane.tsx:107-135` (`:116-119`, `:127-128`), `:137`, `:233` | APPSHELL-WORKSPACE-RECIPES-CLI-12, PARTIAL |
| E-14 | `GlassTabs` root is `role="navigation"`; ids `trigger-${value}`/`content-${value}` collide across instances | `src/components/navigation/GlassTabs.tsx:130`, `:440`, `:442`, `:534-535` | ACCESSIBILITY-13, CONFIRMED |
| E-15 | Workspace tabs: `value`/`onValueChange` spread onto `<div role="tablist">`; no roving tabindex, `aria-controls` or tabpanel | `src/workspace/index.tsx:86-134` (`:93`, `:95-103`, `:121`) | APPSHELL-WORKSPACE-RECIPES-CLI-09, CONFIRMED |
| E-16 | Seven tab/segmented components, five-plus selection contracts (`value/onValueChange`, `value/onChange(id)`, `activeTab/onChange(event,index)`, `onTabChange`, `onTabClick`) | `src/components/navigation/GlassTabs.tsx:35-37`; `GlassPageTabs.tsx:18-20` | API-CONSISTENCY-04, CONFIRMED |
| E-17 | Page navigation built as tabs: `GlassBottomNav` items are `role="tab"` with `aria-controls="nav-panel-…"` panels that do not exist, container `role="tablist"`; `LiquidGlassTabBar` items are `role="tab"` buttons with no tablist owner or panels | `src/components/navigation/GlassBottomNav.tsx:165-168`, `:260-261`; `src/components/navigation/LiquidGlassTabBar.tsx:113-126` | (PRD-verified) |
| E-18 | `LiquidGlassTabBar` hard-codes a near-transparent inline gradient (`rgba(255,255,255,0.105)` → `0.018`) over `LiquidGlassMaterial` | `src/components/navigation/LiquidGlassTabBar.tsx:98-107` | (PRD-verified); matches runtime-remote §1 "fill ≈2% white" |
| E-19 | `GlassSidebar`: `collapsed = false` default makes `collapsed ?? internalCollapsed` always use the prop, so uncontrolled toggling never changes `isCollapsed`; width via unprefixed Tailwind (`w-16`, `w-64`) | `src/components/navigation/GlassSidebar.tsx:152`, `:175-177`, `:180-185`, `:195-199` | (PRD-verified) |
| E-20 | `GlassSidebar` overlay mode paints a full-viewport `glass-backdrop-blur-sm` scrim and wraps the panel in `role="navigation"` | `src/components/navigation/GlassSidebar.tsx:320`, `:416-419` | (PRD-verified) |
| E-21 | `GlassMobileNav` drawer: full-viewport `glass-backdrop-blur-md` backdrop plus its own `role="dialog"` (fourth focus-trap path) | `src/components/navigation/GlassMobileNav.tsx:318`, `:347` | API-CONSISTENCY-08 (3 focus traps), CONFIRMED |
| E-22 | Command palette "fuzzy" search builds `new RegExp(query.split("").join(".*"))` from unescaped user input: typing `(` or `[` throws | `src/components/interactive/GlassCommandPalette.tsx:298-303` | MISSING-CAPABILITY-MAP row "Command palette"; throw path (PRD-verified) |
| E-23 | Two breadcrumb families (root `GlassBreadcrumb` with Item/Link/Separator; app-shell `GlassBreadcrumbs`); root one uses unprefixed `inline-flex … ring-white/10 bg-white/10` plus `glass-backdrop-blur-md` | `src/components/navigation/GlassBreadcrumb.tsx:180`, `:269`, `:334`; `src/app-shell/components.tsx:345-379` | inventory CONSOLIDATE |
| E-24 | `GlassWorkspace` inspector grid `repeat(auto-fit, minmax(min(100%, 28rem), 1fr))` is the only intrinsically responsive layout in the subsystem (keep the technique) | `src/workspace/index.tsx:43-49` | autopsy §Excellent |
| E-25 | Clean slot API worth keeping: slot props, semantic landmarks, `aria-current` on active rail item and last breadcrumb, required `label` on icon button | `src/app-shell/components.tsx:105-131`, `:164-199`, `:345-379`, `:518-541` | autopsy §Excellent |
| E-26 | `src/workflows/index.ts` is `export * from "../workspace"` (duplicate subpath) | `src/workflows/index.ts:1` | autopsy §Duplication |
| E-27 | 14 one-line re-export shims in `src/app-shell/` add nothing | e.g. `src/app-shell/GlassMain.tsx:1` | autopsy §Duplication |
| E-28 | `SourceTransition` measures with `getBoundingClientRect` via a provider registry, no View Transitions | `src/primitives/LiquidGlassSourceTransition.tsx:58-59` | inventory REDESIGN (flagship candidate) |
| E-29 | Three skip-link implementations | `src/primitives/focus/SkipLinks.tsx`; architecture §6 | inventory CONSOLIDATE |

### 2.2 Runtime findings (remote Chromium 141 headless shell, software raster; `autopsy/runtime-remote.md`)

| # | Measurement | Value | Source |
|---|---|---|---|
| R-01 | Default-stage contrast, `3-2-app-shell--saa-s-app-shell` and `--ai-command-center-shell`, 1440×900 and 390×844 | 4–5 of 5 sampled text runs fail; "Native app chrome" h1 1.23:1; "Search" 2.14:1; "Project" (mobile) 1.12:1. Brand label `rgb(248,250,252)` while content ink `rgba(0,0,0,.9)` on `rgb(13,31,43)` | runtime-remote §2 |
| R-02 | Root cause of ink | `.glass-on-light .glass` pins `--glass-text-primary` to black-90 (`src/styles/glass.css:78-100`); `src/styles/premium-typography.css:113-118` forces `[class*="glass-"] { color: … !important }` | runtime-remote §1 |
| R-03 | Visible backdrop filters, app shells | 21–29 per viewport (depth 4, max blur 40px); collaborative workspace 18 | runtime-remote §5 |
| R-04 | Frame rate under scripted hover + wheel | AI command center shell 19 fps; SaaS shell 21–23 fps; simple stories 60 fps | runtime-remote §5 |
| R-05 | Infinite animations | 4 on app-shell stories; 0 under `reducedMotion: reduce` | runtime-remote §5 |
| R-06 | Forced colors | 3.2 app shell visible backdrop filters 21 → 3 (not 0) | runtime-remote §4 |
| R-07 | `prefers-contrast: more` | 0.000 pixel diff; app-shell contrast failures unchanged (4/46) | runtime-remote §3 |
| R-08 | Hygiene | 0 console/page errors, 0 horizontal overflow at 390px | runtime-remote §6 |
| R-09 | Recipe geometry | `saas-admin-shell` desktop: rail x=65 y=131 w=82 h=154; main x=65 y=297 w=1326 (stacked) and the render gate recorded 0 layout issues for it | `reports/audit/visual-all/recipe-saas-admin-shell/desktop.computed-styles.json`; APPSHELL-WORKSPACE-RECIPES-CLI-03 |

Remote FPS values are software-raster rAF cadence and therefore pessimistic in absolute terms; the 3× gap to simple stories is the signal. Screenshots under `docs/auraglass-5/autopsy/remote-evidence/screenshots/` were not viewed for this PRD; visual claims rest on the metrics JSON and require human review in the §15.2 Manual lane.

### 2.3 Certification and showcase gaps

- The visual certification has no `app-shell` or `workspace` slug (APPSHELL-WORKSPACE-RECIPES-CLI-17); `src/stories/AppChromeVisualBaseline.stories.tsx:33-56` lays out the shell inline.
- `src/stories/AppShell.stories.tsx:8-33`: six exports are aliases of `FullSurface` (STORYBOOK-SHOWCASE-10, CONFIRMED).
- Tabs, Sidebar, Header, Breadcrumb, Toolbar have 2 stories each and no state stories (STORYBOOK-SHOWCASE-14, PARTIAL — counts confirmed, percentage corrected).
- `scripts/ci/verify-recipes-render.js:354-355`, `:398-399` reset error buffers per viewport; `passed` at `:1342` ignores `layoutIssues` (APPSHELL-WORKSPACE-RECIPES-CLI-03, CONFIRMED).

---

## 3. Desired end state

At 5.0 GA:

1. **One frame.** `import { AppShell } from "aura-glass/app-shell"` is the only app shell. A server-rendered `AppShell.Root` with `TopBar`, `Sidebar`, `Main`, `Inspector` and `StatusBar` slots lays out correctly at 390, 768, 1024, 1440 and 1920px **with zero consumer CSS**, in Vite without Tailwind, Next 15/16 and Tailwind v4 apps. Layout comes from shipped `app-shell.css` (named grid areas plus container queries), never from utility classes.
2. **Real product behaviour.** Sidebar has expanded, rail and collapsed states, persists them, becomes a modal drawer (Base UI Dialog through PRD-09 `Sheet`) in compact containers, and never leaves hidden content focusable. The inspector docks, floats or becomes a sheet by container width. `Main` is the single scroll owner; floating bars sit over it with `ScrollEdge` and write `--ag-scroll-padding-*`. Safe-area insets are honoured on every edge.
3. **Correct navigation semantics.** Page navigation (`Sidebar.Nav`, `TabBar`, `Breadcrumbs`, `Pagination`) is links in a labelled `<nav>` with `aria-current="page"`, composable with any router through `render`. In-page view switching (`Tabs`, `TabBar semantics="tabs"`) is Base UI Tabs with unique ids and APG keyboard. One selection contract: `value` / `defaultValue` / `onValueChange(value)`.
4. **Real split views.** `ResizablePanels` supports N panels in either orientation, pointer + touch + keyboard resizing measured against the container rect, min/max/collapsible panels, and persisted layouts, with no React render per pointer move.
5. **Readable and cheap.** Every text run in every shell scene reads ≥4.5:1 (≥3:1 for large text and UI glyphs) over all eight certification scenes in light and dark. The shell frame spends at most 3 blurred surfaces at fine pointer and 2 at coarse pointer, never nests backdrop filters, runs 0 animations at idle, and holds the §16 frame-time budget in the remote perf lane.
6. **Migrated, not abandoned.** Every 4.x shell and navigation name listed in §9 is absorbed by a 5.0 component, a `compat` adapter or a codemod transform, or is removed with a §13 justification. `aura-glass/workspace` and `aura-glass/workflows` disappear into `./app-shell`.
7. **Certified.** Each of flagships 22–31 meets §11.3 deliverables: typed variant metadata, `data-ag-part`/`data-state` contract, 4.x role/selector change table, a registry block, an APG keyboard script, a per-import budget line, perf grade ≥C, environment-matrix baselines and codemod fixtures.

---

## 4. Architecture

### 4.1 Module layout and RSC split (§9.1)

```
src/app-shell/                       # 5.0 rewrite of the existing directory (4.x files replaced)
  index.ts                           # plain re-export barrel, no directive
  app-shell.css                      # @layer ag.components; compiled into dist/css/app-shell.css (PRD-02 layout)
  AppShell.tsx                       # server: Root, Main, PageHeader, SkipLink (frame only)
  AppShellSidebarToggle.tsx          # "use client": toggle + persistence writer
  AppShellInspectorToggle.tsx        # "use client"
  AppShellController.tsx             # "use client": controlled-mode wrapper (REQ-NAV-11)
  parseAppShellCookie.ts             # server-safe pure helper (REQ-NAV-09)
  appShellStore.ts                   # "use client": per-root useSyncExternalStore store
  Sidebar.tsx                        # server frame: Root, Header, Footer, Group, GroupLabel
  SidebarNav.tsx                     # server: Nav, Item (link), ItemIcon, ItemBadge
  SidebarCollapsible.tsx             # "use client": Base UI Collapsible for nested groups
  SidebarDrawer.tsx                  # "use client": compact-container drawer (PRD-09 Sheet)
  TopBar.tsx                         # server: Root, Leading, Title, Center, Trailing
  Inspector.tsx                      # server frame: Root, Header, Section(static), Field
  InspectorSection.tsx               # "use client": collapsible section
  StatusBar.tsx                      # server: Root, Item; StatusBarLive.tsx is "use client"
  MobileShell.tsx                    # server: preset of AppShell.Root layout="mobile"
  ResizablePanels.tsx                # "use client": Root, Panel, Handle (Owned)
src/components/navigation/           # root-entry nav flagships (5.0 rewrites in place)
  Tabs.tsx, TabBar.tsx, Breadcrumbs.tsx, BreadcrumbsOverflow.tsx ("use client"),
  Pagination.tsx, Command.tsx, CommandPalette.tsx
src/primitives/SourceTransition.tsx  # replaces LiquidGlassSourceTransition.tsx
```

Root entry (`.`) exports `Tabs`, `TabBar`, `Breadcrumbs`, `Pagination`, `CommandPalette`, `Command`, `SourceTransition`. `./app-shell` exports `AppShell`, `Sidebar`, `TopBar`, `Inspector`, `StatusBar`, `MobileShell`, `ResizablePanels`. `ResizablePanels` is also root-exported (it is generic layout). All are new names; 4.x names route through `aura-glass/compat` (D-14).

### 4.2 AppShell grid

`AppShell.Root` renders one element:

```html
<div class="ag-app-shell" data-ag-part="root"
     data-ag-sidebar="expanded|rail|collapsed" data-ag-inspector="open|closed"
     data-ag-layout="auto|desktop|mobile" data-ag-sidebar-side="start|end"
     data-ag-density="compact|comfortable|spacious" data-ag-backdrop="…">
```

```css
@layer ag.components {
  .ag-app-shell {
    container: ag-app-shell / inline-size;
    display: grid; block-size: 100dvh; min-block-size: 0;
    grid-template-areas: "skip skip skip" "side top insp" "side main insp" "side status insp";
    grid-template-columns: var(--_ag-shell-side, var(--ag-app-shell-sidebar-width)) minmax(0,1fr) var(--_ag-shell-insp, 0px);
    grid-template-rows: auto auto minmax(0,1fr) auto;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
  .ag-app-shell[data-ag-sidebar=rail]      { --_ag-shell-side: var(--ag-app-shell-rail-width); }
  .ag-app-shell[data-ag-sidebar=collapsed] { --_ag-shell-side: 0px; }
  .ag-app-shell[data-ag-inspector=open]    { --_ag-shell-insp: var(--ag-app-shell-inspector-width); }
  @container ag-app-shell (width < 600px)  { /* compact: one column; sidebar → drawer; inspector → sheet; TabBar shown */ }
  @container ag-app-shell (600px <= width < 1024px) { /* medium: sidebar forced to rail unless drawer open; inspector floats */ }
  @container ag-app-shell (width >= 1440px) { /* wide: inspector docks */ }
}
```

- Breakpoints 600/1024/1440 are compiled constants (container-query conditions cannot read custom properties). They are published as `--ag-app-shell-bp-*` read-only tokens for documentation and `@auraglass/cli doctor` only.
- New public tokens (PRD-DS emits them from its token tree; this PRD owns their values only and submits them as a row request, task NAV-009; it creates no file under `tokens/`, SC-18): `--ag-app-shell-sidebar-width: 16rem`, `--ag-app-shell-rail-width: 4rem`, `--ag-app-shell-inspector-width: 20rem`, `--ag-app-shell-topbar-height: 3.25rem` (2.75rem compact), `--ag-app-shell-tabbar-height: 3.5rem`, `--ag-app-shell-gap` (density-keyed from `--ag-space-*`).
- `Main` is `overflow: auto; overscroll-behavior: contain; scroll-padding-block: var(--ag-scroll-padding-top) var(--ag-scroll-padding-bottom)`. No other shell element scrolls except `Sidebar.Content` and `Inspector.Content` (each its own scroll area).
- `TopBar placement="overlay"` (default in `MobileShell`) spans the `main` area, and `Main` content scrolls beneath it; `placement="inline"` (default in `AppShell`) occupies the `top` row. With `overlay` only (an inline bar never overlaps `Main`, so it sets `--ag-scroll-padding-top: 0`), `TopBar` sets `--ag-scroll-padding-top: calc(var(--ag-app-shell-topbar-height) + var(--ag-space-2))` on the root via CSS `:has()` (`.ag-app-shell:has(> .ag-top-bar[data-ag-placement=overlay])`). No JS measurement.
- No `transform`, `will-change`, `contain: paint` or `transition: all` on shell elements (§4.6). Sidebar width changes animate `grid-template-columns` **only** under `[data-ag-animating]` with `--ag-duration-*` tokens, and not at all at `motion` ≠ `full`. The sidebar surface itself animates `translate`/`opacity` only.

### 4.3 State model (server frame, client islands)

- `AppShell.Root` is a server component. It renders `data-ag-sidebar={defaultSidebar}` and `data-ag-inspector={defaultInspector}` from props. A server layout may read the persistence cookie and pass it in (documented `cookies()` recipe), so the first paint matches the persisted state with no flash.
- Client islands (`AppShell.SidebarToggle`, `AppShell.InspectorToggle`, `SidebarDrawer`, `StatusBar.Live`) find their root with `ref.current.closest('[data-ag-part=root].ag-app-shell')` and read/write state through `appShellStore` (one store per root element, `useSyncExternalStore`, server snapshot = the rendered attribute). The store writes the root's `data-ag-*` attributes directly; CSS does the rest. No React context crosses the server/client boundary.
- Controlled mode: `<AppShell.Controller sidebar onSidebarChange inspector onInspectorChange>` (client) wraps the root for apps that keep shell state in their own store.
- Persistence: `persistKey="main"` writes cookie `ag-shell-main=sidebar:rail;inspector:open` (`Path=/; Max-Age=31536000; SameSite=Lax`). No `localStorage` read during render (HOOKS-UTILS-TYPES-09/-10 hydration rule).

### 4.4 Material roles and the blur budget (§4.6, §4.7, D-08, D-09)

| Element | Surface | Backdrop filter | Notes |
|---|---|---|---|
| `AppShell.Root` | none | no | sets `data-ag-backdrop` passthrough only |
| `AppShell.Main` | `layer="content"` | no | content materials are never blurred (D-08) |
| `TopBar.Root` | `layer="chrome" thickness="regular"` + `ScrollEdge edge="top"` | **1** | one ScrollEdge per edge per scroll container (REQ-NAV-26) |
| `Sidebar.Root` (inline) | `layer="chrome" thickness="thick"`, `appearance="inset"` uses `ConcentricFrame` | **1** | nested `Sidebar` items use tint/rim only (nesting rule) |
| `Sidebar` drawer | PRD-09 `Sheet side="start"` (overlay thick + scrim) | 1 + scrim ≤12px | replaces the inline sidebar while open |
| `Inspector.Root` docked | `layer="content" content="content-sunken"` | no | docked panels are content |
| `Inspector.Root` floating | `layer="chrome" thickness="regular"` | **1** | medium containers only |
| `StatusBar.Root` | `content="content-sunken"`, `thickness="thin"` | no | |
| `TabBar.Root` | `layer="chrome"` capsule in `SurfaceGroup`; `refraction` opt-in (enhanced, D-05) | **1** (group) | items carry tint/rim only |
| `Tabs.Indicator` | chrome thin, transient | no | indicator is tint + rim |
| `Breadcrumbs`, `Pagination` | none / content | no | |
| `CommandPalette` | PRD-09 `Dialog` overlay thick + scrim | 1 + scrim | |

Frame budget (shell with no overlay open): **≤3 blurred surfaces at `(pointer:fine)`** (TopBar, Sidebar, floating Inspector) and **≤2 at `(pointer:coarse)`** (TopBar, TabBar). That leaves ≥3 (fine) and ≥1 (coarse) of the §4.7 per-viewport budget (6/3) for overlays and in-content surfaces. Backdrop-filter nesting depth is 1. The dev counter in `AuraGlassProvider` (PRD-05) reports the shell's contribution under the label `app-shell`.

### 4.5 Contrast and preferences

- Shell components set no colour, ink or opacity literals. Ink is `--ag-on-surface` / `--ag-on-surface-muted`, solved per backdrop by the PRD-03 compiler and PRD-04 tint floors. This removes R-01/R-02 (no `glass-on-light` pinning, no `!important` colour).
- `data-ag-backdrop` on `AppShell.Root` (default inherited; `auto` permitted) is the declared backdrop for every chrome surface in the frame; `Main` sections may override it for hero/media regions.
- Under `data-ag-transparency=solid` or `forced-colors: active`, every shell surface is `lightweight` (no backdrop filter, `Canvas`/`CanvasText`, `outline` edges). This fixes R-06 (21 → 3) by construction because all shell surfaces go through `Surface`/`materialProps` and the PRD-05 `ag.a11y` rungs.

### 4.6 Foundation map

| Component | Foundation | Owned code |
|---|---|---|
| AppShell, MobileShell, TopBar, StatusBar, Breadcrumbs, Pagination | Own (server) | grid/CSS, landmarks |
| Sidebar | Own + Base UI Collapsible (nested groups) + PRD-09 Sheet (drawer) | rail tooltips use PRD-09 `Tooltip` |
| Inspector | Own + Base UI Collapsible | section persistence |
| Tabs | Base UI Tabs (`Tabs.Root/List/Tab/Panel/Indicator`) | indicator material, overflow scroll mask |
| TabBar | `semantics="navigation"`: Own links + roving focus (Base UI Toolbar is **not** used, links are Tab stops); `semantics="tabs"`: Base UI Tabs | capsule, accessory, minimize |
| CommandPalette / Command | Base UI Combobox (inline list) inside PRD-09 Dialog; `@tanstack/react-virtual` above 100 items | filter/score function |
| ResizablePanels | Own (pointer events, ARIA separator) | entire behaviour |
| SourceTransition | PRD-06 `startMorph` (View Transitions; React 19.3 `<ViewTransition>` when detected; WAAPI FLIP fallback — all engine code owned by PRD-06) | name allocation, focus handoff |

---

## 5. Exact implementation requirements

Each requirement names the test that proves it (§12). "Container" means the `ag-app-shell` query container unless stated.

### 5.1 AppShell frame (flagship 22)

- **REQ-NAV-01** `AppShell` is a compound namespace: `AppShell.Root`, `AppShell.Main`, `AppShell.PageHeader`, `AppShell.SkipLink`, `AppShell.SidebarToggle`, `AppShell.InspectorToggle`, `AppShell.Controller`. Slots are placed by **element type and `data-ag-slot`**, never by `displayName` sniffing or `cloneElement` (fixes E-05). Test: `app-shell.test.tsx › renders slots wrapped in memo/HOC in the right grid areas`.
- **REQ-NAV-02** Layout is produced only by `app-shell.css` selectors on `.ag-app-shell*` classes and `data-ag-*` attributes. `src/app-shell/**` contains zero `glass-*` utility classes and zero unprefixed Tailwind classes; the §10 undefined-class CI check reports 0 for `src/app-shell/**` and `src/components/navigation/{Tabs,TabBar,Breadcrumbs,BreadcrumbsOverflow,Pagination,Command,CommandPalette}.tsx`. Test: `tests/css/class-coverage.test.ts` (NEW, PRD-02 REQ-PKG-95; run in the PRD-19 static lane) with these paths in scope; `src/app-shell/app-shell.css.test.ts`.
- **REQ-NAV-03** At container width ≥1024px with `Sidebar` and `Main`, the sidebar's bounding box is horizontally adjacent to `Main` (`sidebar.right <= main.left + 1`, `|sidebar.top - main.top| <= topbar height`), in a Vite app **without Tailwind** importing only `aura-glass/styles.css` and `aura-glass/app-shell.css`. Test: `tests/e2e/app-shell/layout.spec.ts › desktop sidebar beside main` (inverse of R-09).
- **REQ-NAV-04** Container breakpoints are exactly: compact `< 600px`, medium `600–1023px`, expanded `1024–1439px`, wide `≥ 1440px`, implemented with `@container ag-app-shell`. No `window.innerWidth`, `matchMedia` width query, or resize listener decides layout (fixes E-04). Test: `layout.spec.ts › layout follows container not viewport` (a 900px-wide shell inside a 1920px viewport renders medium).
- **REQ-NAV-05** Exactly one `<main>` per shell, carrying `id` (default from `useId`, overridable) and `tabIndex={-1}`. `AppShell.SkipLink` renders as the first focusable element, is visually hidden until `:focus-visible`, and moves focus to `<main>`. Test: `app-shell.test.tsx › single main landmark`, `tests/e2e/app-shell/a11y.spec.ts › skip link focuses main`.
- **REQ-NAV-06** `AppShell.Main` is the only scroll container of the frame (`overflow: auto`, `overscroll-behavior: contain`); `document.scrollingElement.scrollHeight <= innerHeight` in every shell story. Test: `layout.spec.ts › main owns scroll`.
- **REQ-NAV-07** Safe areas: `Root` pads with `env(safe-area-inset-*)` on all four edges; `TabBar` and `MobileShell` bottom bars add `env(safe-area-inset-bottom)` to their own block-end padding instead of the root when `placement="overlay"`. Test: `layout.spec.ts › safe-area insets` (emulated via CSS `env()` override fixture).
- **REQ-NAV-08** Props: `defaultSidebar: "expanded"|"rail"|"collapsed"` (default `"expanded"`), `defaultInspector: "open"|"closed"` (default `"closed"`), `sidebarSide: "start"|"end"` (default `"start"`, logical, flips under `dir="rtl"`), `layout: "auto"|"desktop"|"mobile"` (default `"auto"`), `density: "compact"|"comfortable"|"spacious"`, `persistKey?: string`. All serializable (server component). Test: `app-shell.test.tsx › props render as data attributes`, `ssr.test.tsx › renderToString has no client hooks`.
- **REQ-NAV-09** Persistence: when `persistKey` is set, `SidebarToggle`/`InspectorToggle` write cookie `ag-shell-<key>` with `Path=/; Max-Age=31536000; SameSite=Lax` and value `sidebar:<state>;inspector:<state>`. Exported pure helper `parseAppShellCookie(value): { sidebar?, inspector? }` (server-safe) lets layouts pass defaults. No storage is read during render. Test: `appShellStore.test.ts › writes cookie`, `parseAppShellCookie.test.ts`.
- **REQ-NAV-10** Hydration: `renderToString` → `hydrateRoot` of the shell stories (all six product surfaces) produces 0 hydration warnings and 0 attribute mismatches, including with a persisted cookie of `rail`. Test: `tests/e2e/app-shell/ssr-hydration.spec.ts`.
- **REQ-NAV-11** `AppShell.Controller` (client) accepts `sidebar`, `onSidebarChange(state)`, `inspector`, `onInspectorChange(state)`; when controlled, toggles call the handler and do not write attributes until the prop changes. Test: `appShellStore.test.ts › controlled mode`.
- **REQ-NAV-12** `AppShell.PageHeader` renders `title` in a heading whose level is `headingLevel` (default `1`), plus `eyebrow`, `description`, `actions` and `tabs` slots; actions wrap below the title at container width `< 600px`. Test: `app-shell.test.tsx › page header heading level`, `layout.spec.ts › page header actions wrap`.
- **REQ-NAV-13** No shell element sets `transform`, `will-change`, `contain: paint`, `transition: all` or `!important` (computed-style probe). Test: `layout.spec.ts › no promoted layers at rest`; static lane `no-important`, `no-transition-all`.
- **REQ-NAV-14** Theming: the frame reads only `--ag-*` tokens; recolouring via `createBrandTheme({ brand })` changes the active rail/nav item indicator, focus ring and tab indicator colours with no component prop. Test: `tests/e2e/app-shell/theme.spec.ts › brand theme recolours chrome` (fixes E-10).

### 5.2 Sidebar (flagship 23)

- **REQ-NAV-15** Parts: `Sidebar.Root`, `Sidebar.Header`, `Sidebar.Content` (scroll area), `Sidebar.Footer`, `Sidebar.Nav` (`<nav aria-label>`; `aria-label` required, dev warning if absent), `Sidebar.Group`, `Sidebar.GroupLabel`, `Sidebar.Item`, `Sidebar.ItemIcon`, `Sidebar.ItemBadge`, `Sidebar.Collapsible` (nested group via Base UI Collapsible), `Sidebar.Separator`. `appearance: "sidebar"|"inset"|"floating"` (default `"sidebar"`; absorbs `LiquidGlassInsetSidebar` as `inset`). The prop is deliberately **not** named `variant`: D-06/§4.2 reserve `variant` for the material union `regular|clear|identity` (`data-ag-variant`, D-20), and every flagship in this PRD that exposes material accepts only that union under `variant`. `appearance` is emitted as `data-ag-appearance`. Test: `Sidebar.test.tsx › appearance is not variant` (asserts `data-ag-variant` is absent unless a material variant is passed).
- **REQ-NAV-16** `Sidebar.Item` renders an `<a>` by default (`href` required unless `render` is provided) and supports `render={<NextLink href="…" />}`; `current` (boolean) sets `aria-current="page"`. Rendering a `<button>` requires `render={<button />}` and a dev warning explains that destinations should be links (fixes E-09). Test: `Sidebar.test.tsx › item is a link with aria-current`, `› render prop composes router link`.
- **REQ-NAV-17** Rail state: labels are visually hidden (not removed) so the accessible name is unchanged; each item shows a PRD-09 `Tooltip` with the label on hover/focus after the PRD-OVL `Tooltip` `delay` default (an OVL prop constant, not a token; SC-19). This PRD does not override it. Item hit area ≥ 40×40px at fine pointer and ≥ 44×44px at coarse pointer. Test: `Sidebar.test.tsx › rail keeps accessible names`, `tests/e2e/app-shell/a11y.spec.ts › rail target size`.
- **REQ-NAV-18** Collapsed state (`data-ag-sidebar=collapsed`): the inline sidebar has `inert` and `display: none` in compiled CSS; no descendant is focusable or in the accessibility tree; no `aria-hidden` is used on it (fixes E-08). Test: `Sidebar.test.tsx › collapsed sidebar is inert`, axe rule `aria-hidden-focus` = 0.
- **REQ-NAV-19** Compact containers: the inline sidebar is not rendered visible (`display: none` via container query, so no SSR flash); `AppShell.SidebarToggle` opens `SidebarDrawer`, a PRD-09 `Sheet side="start"` modal that renders `Sidebar.Content` children, traps focus, closes on Escape, scrim click and on navigation (any `Sidebar.Item` activation), and returns focus to the toggle. Test: `tests/e2e/app-shell/sidebar-drawer.spec.ts`.
- **REQ-NAV-20** `AppShell.SidebarToggle` is a PRD-08 `IconButton`. In compact and medium containers (where it opens the drawer, REQ-NAV-19/22) it carries `aria-expanded` (drawer open state) and `aria-haspopup="dialog"`; in expanded and wide containers it toggles the inline sidebar between `expanded` and `collapseTo` (prop `"rail"|"collapsed"`, default `"rail"`), carries no `aria-pressed`/`aria-expanded`, and its `aria-label` names the next action ("Collapse sidebar"/"Expand sidebar"). `aria-controls` = the inline sidebar id in expanded/wide and the drawer popup id in compact/medium. The container mode is read client-side by one `ResizeObserver` on the shell root (ARIA only; layout itself stays CSS-only per REQ-NAV-04); the server render uses the expanded/wide attributes, and the compact/medium attributes are applied in a layout effect, which is an attribute update after hydration, not a hydration mismatch (covered by REQ-NAV-10). Keyboard shortcut `mod+B` toggles when `shortcut` prop is true (default `false`). Test: `AppShellSidebarToggle.test.tsx › ARIA by container mode`, `› collapseTo rail|collapsed`.
- **REQ-NAV-21** Uncontrolled toggling works: with no `collapsed` prop the sidebar state changes on toggle (regression test for E-19). Test: `Sidebar.test.tsx › uncontrolled toggle changes state`.
- **REQ-NAV-22** Medium containers force `rail` inline; there `AppShell.SidebarToggle` opens `SidebarDrawer` (same behaviour and ARIA as compact, REQ-NAV-19/20) instead of expanding inline, so the "unless the drawer is open" clause in §4.2 means the expanded labels are shown in the drawer, never in the grid column. The stored `expanded` preference is restored on return to ≥1024px. Test: `layout.spec.ts › medium forces rail and restores`, `sidebar-drawer.spec.ts › medium toggle opens drawer`.
- **REQ-NAV-23** `Sidebar.Collapsible` groups expose `aria-expanded` on the trigger and `hidden` (Base UI) on the panel; a group containing the current item defaults open. Test: `Sidebar.test.tsx › group containing current opens`.
- **REQ-NAV-24** Keyboard: Tab moves between items (links are Tab stops; no roving tabindex in a `nav` list, consistent with the APG navigation pattern); Enter activates; Space/Enter on a collapsible trigger toggles. Test: `tests/a11y/apg/sidebar.apg.spec.ts`.

### 5.3 TopBar (flagship 24)

- **REQ-NAV-25** Parts: `TopBar.Root` (`<header>`; a banner landmark only when it is a direct child of `AppShell.Root`), `TopBar.Leading`, `TopBar.Title`, `TopBar.Center`, `TopBar.Trailing`. `placement: "inline"|"overlay"` (defaults: `inline` in `AppShell`, `overlay` in `MobileShell`). Absorbs `GlassTopBar`, `GlassHeader` (REPLACE) and `GlassNavigation` (REMOVE) per §12.
- **REQ-NAV-26** `TopBar` renders exactly one `ScrollEdge edge="top"` (PRD-04 REQ-MAT-10: `TopBar`, `Toolbar` and `TabBar` render it automatically; prop `scrollEdge: "soft"|"hard"|"none"`, default `"soft"`, maps to the `ScrollEdge` `edgeStyle` prop, emitted as `data-ag-edge-style`; SC-22) bound to `AppShell.Main`. "One per view" (architecture §4.6) is enforced **per edge per scroll container**: `TabBar` placed over the same `Main` renders the single `edge="bottom"` instance, so `MobileShell` has exactly one top and one bottom edge. A second `ScrollEdge` for the same edge and scroll container logs a dev warning (e.g. a `Toolbar` with its own top edge inside `Main` under an inline `TopBar`). Test: `TopBar.test.tsx › one scroll edge per edge`, `MobileShell.test.tsx › top and bottom edge, no warning`.
- **REQ-NAV-27** With `placement="overlay"`, focused elements in `Main` are never obscured by the bar: after `element.focus()` on any focusable in `Main`, `element.top >= topbar.bottom` (WCAG 2.4.11). Mechanism: `--ag-scroll-padding-top` set by CSS `:has()`. Test: `tests/e2e/app-shell/a11y.spec.ts › focus not obscured by top bar`.
- **REQ-NAV-28** `TopBar.Center` truncates with ellipsis and hides at container width `< 600px` unless `keepCenter`; `TopBar.Title` truncates to one line; no horizontal overflow at 320px. Test: `layout.spec.ts › top bar no overflow at 320`.
- **REQ-NAV-29** Height is `--ag-app-shell-topbar-height`; the bar renders no shadow under `data-ag-transparency=solid` and an `outline`-based bottom edge under forced colors. Test: env-matrix baseline `topbar__*`.

### 5.4 Inspector, StatusBar and MobileShell (`./app-shell` members)

- **REQ-NAV-30** `Inspector.Root` (`<aside aria-label>`; label required), `Inspector.Header` (title + close `IconButton`), `Inspector.Content` (scroll area), `Inspector.Section` (Base UI Collapsible, `title`, `defaultOpen`), `Inspector.Field` (`label`, `htmlFor`, value slot; a CSS grid `minmax(6rem, 40%) minmax(0, 1fr)` that stacks below 280px inline size via `@container ag-inspector`). Absorbs `LiquidGlassInspectorPanel` and workspace `GlassInspectorPanel`. `LiquidGlassPhotoInspector` is **not** absorbed here: architecture §11.2 #43 and §12 assign it to the media flagship, and PRD-13 REQ-MED-48 makes `ImageViewer.Inspector` its successor; PRD-13 may compose `Inspector.Section`/`Inspector.Field` but owns that part. Test: `Inspector.test.tsx`.
- **REQ-NAV-31** Inspector modes by container: wide → docked grid column (content material, no blur); expanded/medium → floating chrome panel overlaying `Main` at the inline-end edge; compact → PRD-09 `Sheet side="bottom"` with detents `[0.5, 1]`. `mode` prop (`"auto"|"docked"|"floating"|"sheet"`, default `"auto"`) overrides. Docked and floating are pure CSS (container query on the shell); the server renders the inspector inline. Sheet mode needs the client: `auto` resolves compact through the same root `ResizeObserver` as REQ-NAV-20, and the content is portalled into the PRD-09 `Sheet` only when `AppShell.InspectorToggle` opens it (closed by default in compact, so no SSR flash). Test: `tests/e2e/app-shell/inspector.spec.ts › mode by container width`, `› compact sheet opens from toggle and restores focus`.
- **REQ-NAV-32** Inspector inside `ResizablePanels` is resizable via a `ResizablePanels.Handle`; `Inspector` itself never implements resize (removes the claimed-but-absent `resizable` prop). Test: `inspector.spec.ts › resizable via panels`.
- **REQ-NAV-33** `StatusBar.Root` has **no** live-region role. `StatusBar.Item` is static. `StatusBar.Live` (client) announces its text through the single `AuraGlassProvider` announcer, `politeness="polite"` default, debounced 1000ms, and never announces on first mount (fixes E-08 second half). Test: `StatusBar.test.tsx › bar has no role=status`, `› live item announces once per change after debounce`.
- **REQ-NAV-34** `MobileShell` is a server component rendering `AppShell.Root layout="mobile"` with `topBar`, `children` (Main) and `tabBar` slots; `block-size: 100dvh`; `TabBar` overlays `Main` and sets `--ag-scroll-padding-bottom: calc(var(--ag-app-shell-tabbar-height) + env(safe-area-inset-bottom) + var(--ag-space-2))`. Test: `MobileShell.test.tsx`, `layout.spec.ts › mobile last item not hidden under tab bar`.
- **REQ-NAV-35** The six `src/workspace/index.tsx` components are re-expressed as compositions (registry item `registry/items/app-shell-workspace/`, a `registry:item`, not one of the 10 GA blocks; SC-32) of `AppShell`, `PageHeader` (with `tabs` slot), `ResizablePanels`, `Inspector`, `Tabs` and `Card`; `GlassWorkspace`'s intrinsic `repeat(auto-fit, minmax(min(100%, 28rem), 1fr))` grid is preserved as `.ag-app-shell__auto-grid` (keeps E-24). PRD-DX owns the registry schema, `registry/registry.json` (DX-067), lint and render harness; this PRD owns the item content only. Test: the PRD-DX render harness `tests/dx/registry-render.spec.ts` (DX-094) case `app-shell-workspace`.
- **REQ-NAV-36** No `AppShell` frame part uses `role="region"`, `role="main"` on a non-`main` element, or `role="contentinfo"` (removes `GlassAppShell.tsx:331`, `:373`, `:575`, `:595` patterns). Test: `app-shell.test.tsx › landmark inventory` (banner ≤1, main =1, navigation = number of `Sidebar.Nav`/`TabBar` with distinct labels, complementary = number of `Inspector`).
- **REQ-NAV-37** Every landmark of the same role within one page has a unique accessible name; duplicates log a dev warning. Test: axe `landmark-unique` = 0 on all shell stories.

### 5.5 Tabs (flagship 25)

- **REQ-NAV-38** `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`, `Tabs.Indicator` wrap Base UI Tabs; no Base UI type appears in the public `.d.ts` (§6 swap-safety). Props: `value`, `defaultValue`, `onValueChange(value: string)`, `orientation: "horizontal"|"vertical"`, `activateOnFocus` (default `false`, manual activation), `appearance: "underline"|"pill"` (default `"pill"`, emitted as `data-ag-appearance`; not `variant`, which D-06 reserves for the material union, see REQ-NAV-15), `size: "sm"|"md"`. Absorbs `GlassTabs`, `GlassPageTabs` (visual reference for `pill`), `EnhancedGlassTabs`, `GlassTabItem`, `TabItem`, `GlassTabBar` (REPLACE), workspace `GlassWorkspaceTabs`.
- **REQ-NAV-39** The root renders no landmark role (removes `role="navigation"`, E-14). Tab and panel ids derive from `useId()` + value, so two `Tabs` with identical values on one page produce 0 duplicate ids. Test: `Tabs.test.tsx › two instances have unique ids`, axe `duplicate-id-aria` = 0.
- **REQ-NAV-40** APG tabs keyboard: Left/Right (Up/Down when vertical) move focus with wrap, Home/End jump, Enter/Space activate in manual mode, disabled tabs are skipped, Tab moves from the active tab into the active panel. RTL reverses Left/Right. Test: `tests/a11y/apg/tabs.apg.spec.ts`.
- **REQ-NAV-41** `Tabs.Indicator` morphs between tabs through the PRD-06 same-document View Transition path (architecture §8 "Morphs" and §11.2 #25 "chrome indicator (View Transition)"; PRD-06 REQ-MOT-38): `view-transition-name: ag-tabs-indicator-<useId>`, `data-ag-vt-participant` on the indicator, optics dropped during `:active-view-transition`. Where `document.startViewTransition` is absent (feature-detected, never UA-sniffed), the indicator falls back to a CSS transition of `translate` and `scale` only, derived from Base UI's active-tab CSS variables, with `--ag-duration-*`/`--ag-ease-*` tokens. In neither path does it transition `left`, `width`, `top` or `height` (today `src/components/navigation/GlassTabBar.module.css:92-104` transitions `width`/`height`/`left`/`top` and sets `will-change: transform, width, height, left, top, opacity`, PRD-verified; PERFORMANCE-15 is a first-pass finding with no row in the performance verification table). Under `motion=calm` it cross-fades (opacity only); under `none` it jumps. This PRD does not implement a View Transition engine; it calls PRD-06 `startMorph`. Test: `tests/motion/tabs-indicator.spec.ts` (engines with `startViewTransition`: a `::view-transition-group(ag-tabs-indicator-*)` is observed on activation; a fixture with `startViewTransition` deleted: frame strip shows only `translate`/`scale` changing; all engines: no layout-property transition; reduced motion: no WAAPI after settle).
- **REQ-NAV-42** Overflowing `Tabs.List` scrolls horizontally with a `mask-image` edge fade, keeps the active tab scrolled into view on activation (`scrollIntoView({ block: "nearest", inline: "nearest" })`), and renders no scroll buttons. Test: `Tabs.test.tsx › active tab scrolled into view`, `layout.spec.ts › tabs no page overflow at 320`.
- **REQ-NAV-43** Inactive panels unmount by default (Base UI default); `keepMounted` on `Tabs.Panel` keeps them mounted and `hidden`. `data-state="active|inactive"` and `data-ag-part="list|tab|panel|indicator"` are emitted on every part. Test: `Tabs.test.tsx › part contract`.

### 5.6 TabBar (flagship 26)

- **REQ-NAV-44** `TabBar.Root`, `TabBar.Item`, `TabBar.ItemIcon`, `TabBar.ItemLabel`, `TabBar.ItemBadge`, `TabBar.Accessory`, `TabBar.Search`. Prop `semantics: "navigation"|"tabs"` (default `"navigation"`). Absorbs `LiquidGlassTabBar`, `GlassBottomNav`, `LiquidGlassBottomAccessory` (as `TabBar.Accessory`), `LiquidGlassSearchTab` (as `TabBar.Search`), `GlassMobileNav` bottom variant.
- **REQ-NAV-45** `semantics="navigation"`: renders `<nav aria-label>` (label required) containing `<ul>` of `TabBar.Item` links with `aria-current="page"` on the current item; `TabBar.Item` follows the same `href`/`render` contract and button dev warning as `Sidebar.Item` (REQ-NAV-16); no `role="tab"`, `role="tablist"` or `aria-controls` (fixes E-17). `semantics="tabs"`: renders Base UI Tabs list semantics and requires matching `Tabs.Panel`s; a dev error fires if no panel is registered within one commit. Test: `TabBar.test.tsx › navigation semantics`, `› tabs semantics requires panels`.
- **REQ-NAV-46** `placement: "bottom"|"floating"` (default `"bottom"`). `floating` is the dock pattern: a centred capsule with `max-inline-size: min(100% - 2 * var(--ag-space-4), 36rem)`. Items: 2–5; more than 5 logs a dev warning. Each item hit area ≥44×44px at `(pointer:coarse)`. Test: `TabBar.test.tsx › warns over 5 items`, `a11y.spec.ts › tab bar target size`.
- **REQ-NAV-47** Material: one `SurfaceGroup` owns the only backdrop filter of the bar (items carry tint/rim only, nesting rule); `refraction` prop opts into the enhanced tier on Chromium per D-05/PRD-15 and is inert elsewhere. The bar contains no inline `background` or colour literal (fixes E-18). Test: `tests/e2e/app-shell/blur-budget.spec.ts › tab bar = 1 backdrop filter`; static lane `no-literals`.
- **REQ-NAV-48** `minimizeOnScroll` (default `false`): uses CSS scroll-driven animation (`animation-timeline: scroll(nearest block)`) to collapse labels when scrolling down, guarded by `@supports (animation-timeline: scroll())`; where unsupported the bar stays expanded (no JS scroll listener). Disabled at `motion=calm|none`. Test: `tests/motion/tabbar-minimize.spec.ts` (Chromium: label collapses; WebKit/Gecko without support: no scroll listener registered).
- **REQ-NAV-49** `TabBar.Accessory` renders above the bar inside the same `SurfaceGroup` and is hidden when `minimizeOnScroll` collapses the bar, unless `accessoryPlacement="persist"`. Test: `TabBar.test.tsx › accessory placement`.
- **REQ-NAV-50** At container width ≥600px, `AppShell` hides a `TabBar` placed in its `tabBar` slot with `placement="bottom"` (the sidebar takes over navigation); `placement="floating"` remains. Test: `layout.spec.ts › bottom tab bar only in compact`.

### 5.7 Breadcrumbs (flagship 27)

- **REQ-NAV-51** Server component: `Breadcrumbs.Root` (`<nav aria-label="Breadcrumb">`, label overridable), `Breadcrumbs.List` (`<ol>`), `Breadcrumbs.Item` (`<li>`), `Breadcrumbs.Link` (`<a>`, `render` for router links), `Breadcrumbs.Current` (`<span aria-current="page">`), `Breadcrumbs.Separator` (`aria-hidden="true"`, default glyph from `./icons`, logical direction flips under RTL), `Breadcrumbs.Ellipsis`. Absorbs `GlassBreadcrumb` family and app-shell `GlassBreadcrumbs` (E-23).
- **REQ-NAV-52** `maxItems` (default `undefined` = no collapse); when set and exceeded, items between the first and the last `itemsAfterCollapse` (default 2) are replaced by `Breadcrumbs.Overflow` (client island): a PRD-08 `IconButton` labelled "Show N more" opening a PRD-09 `Menu` of link items. Test: `Breadcrumbs.test.tsx › collapses middle items`, `tests/a11y/apg/breadcrumbs-overflow.apg.spec.ts`.
- **REQ-NAV-53** Breadcrumbs render no surface and no backdrop filter (role "none", §11.2), and no client JS when `maxItems` is not exceeded (measured: 0 client modules in the Next canary RSC payload). Test: `tests/canary/next16/breadcrumbs-server.spec.ts`, run by the PRD-QA canaries lane against the PRD-PKG `canaries/next16` fixture (QA-086; no second fixture tree) (PRD-19 canary).
- **REQ-NAV-54** Each segment truncates with ellipsis at `max-inline-size: 16ch` except `Current`, which may use the remaining space; the full text is the accessible name. Test: `layout.spec.ts › breadcrumbs truncate at 390`.

### 5.8 Pagination (flagship 28)

- **REQ-NAV-55** `Pagination.Root` (`<nav aria-label="Pagination">`), `Pagination.Previous`, `Pagination.Next`, `Pagination.Item`, `Pagination.Ellipsis`; props `page`, `defaultPage` (default 1), `pageCount`, `onPageChange(page)`, `siblingCount` (default 1), `boundaryCount` (default 1), `getHref?(page): string` (link mode; without it items are buttons). Exported pure `getPaginationRange({page, pageCount, siblingCount, boundaryCount})`. Absorbs `GlassPagination` family and `GlassPaginationWithInfo` (as a documented composition).
- **REQ-NAV-56** Current item has `aria-current="page"`; Previous/Next are `aria-disabled` (still focusable) at the bounds; each item's accessible name is "Page N" (localizable via `labels` prop). The range never exceeds `2 * boundaryCount + 2 * siblingCount + 3` items so width is stable. Test: `Pagination.test.tsx › stable item count`, `getPaginationRange.test.ts` (table-driven, 40 cases).
- **REQ-NAV-57** At container width `< 400px` (`@container ag-pagination`) items collapse to `Previous`, "Page N of M" text and `Next`. Material: `content`, no backdrop filter. Test: `layout.spec.ts › pagination compact`.

### 5.9 CommandPalette and Command (flagship 29)

- **REQ-NAV-58** Headless-styled `Command.Root`, `Command.Input`, `Command.List`, `Command.Group` (`heading`), `Command.Item` (`value`, `keywords`, `onSelect`, `disabled`, `shortcut`), `Command.Empty`, `Command.Loading`, `Command.Separator`, built on Base UI Combobox in inline-list mode (`role="combobox"` input + `role="listbox"`, `aria-activedescendant`). `CommandPalette` = PRD-09 `Dialog` around `Command`, rendered only through the public parts defined by PRD-09 REQ-OVL-60 (`Dialog.Popup initialFocus` → `Command.Input`, `size="lg"`, `placement="top"`, `Dialog.Body padding="none"`); it adds no scrim, blur or material of its own. Absorbs `GlassCommandPalette`, `GlassCommand`, `LiquidGlassCommandSurface`, `GlassCommandDock` (DEPRECATE, inline `Command` replaces it), `GlassCommandBar` (to PRD-08 `Toolbar`).
- **REQ-NAV-59** Default filter is a pure exported `commandScore(query, value, keywords): number` doing case-insensitive, diacritic-folded subsequence matching **without constructing a RegExp from user input**; input containing `( [ * + ? \ ^ $ |` never throws (fixes E-22). `shouldFilter={false}` hands filtering to the consumer for async sources. Test: `commandScore.test.ts › regex metacharacters`, `› ranking: prefix > word-start > subsequence`.
- **REQ-NAV-60** Keyboard: Up/Down move the active item with wrap (`loop` default true), Home/End, Enter selects, Escape clears the query, then closes the palette (stacked-Escape via the PRD-05 layer stack), IME composition never triggers selection (`isComposing` guard). Test: `tests/a11y/apg/command.apg.spec.ts`.
- **REQ-NAV-61** `CommandPalette hotkey` (default `"mod+k"`, `false` disables) registers one `keydown` listener on `document` per mounted palette; opening focuses the input and closing restores focus to the previously focused element. Test: `CommandPalette.test.tsx › hotkey opens and restores focus`.
- **REQ-NAV-62** Lists above 100 rendered items virtualize with `@tanstack/react-virtual` (allowlisted, D-29); keyboard navigation and `aria-activedescendant` remain correct for off-screen items (the active item is scrolled into the virtual window). Test: `Command.test.tsx › 5,000 items virtualized`, `tests/perf/browser/command-5000.spec.ts` (input-to-filtered-render ≤ 50 ms p95 in the remote perf lane).
- **REQ-NAV-63** The result count is announced through the provider announcer ("N results"), debounced 500ms, polite. Test: `Command.test.tsx › announces result count`.

### 5.10 ResizablePanels (flagship 30)

- **REQ-NAV-64** `ResizablePanels.Root` (`orientation: "horizontal"|"vertical"`, `onLayout(sizes: number[])`, `autoSaveId?`, `defaultLayout?: number[]`, `keyboardStep` default 2, `keyboardStepLarge` default 10), `ResizablePanels.Panel` (`id` required, `defaultSize`, `minSize`, `maxSize`, `collapsible`, `collapsedSize` default 0, `onCollapse`, `onExpand`; sizes in percent of the root, with `"240px"`-style strings accepted and converted against the container at measure time), `ResizablePanels.Handle` (`disabled`, `withGrip`). N ≥ 2 panels, any orientation, nestable. Absorbs root `GlassSplitPane` (REDESIGN), app-shell `GlassSplitPane` (REMOVE), `GlassResizablePanel` (REMOVE).
- **REQ-NAV-65** Pointer math is container-relative: on `pointerdown` the root's `getBoundingClientRect()` is read once; deltas are `(clientX - startX) / rootRect.width * 100` (height for vertical). No `window.innerWidth`/`innerHeight` use (fixes E-13). Test: `ResizablePanels.test.tsx › drag inside offset 600px container`, `tests/e2e/app-shell/resizable.spec.ts › drag in nested container`.
- **REQ-NAV-66** Input: Pointer Events with `setPointerCapture`, covering mouse, pen and touch; `touch-action: none` on the handle only. During drag, sizes are written as `flex-basis` inline styles via rAF-coalesced DOM writes (≤1 write per frame) and **no React state update until `pointerup`**, when `onLayout` fires once. Test: `ResizablePanels.test.tsx › single onLayout per drag`, `resizable.spec.ts › React commits during drag = 0` (React Profiler fixture).
- **REQ-NAV-67** Handle ARIA: `role="separator"`, `aria-orientation` (perpendicular to the panel axis per APG window splitter), `aria-valuenow` (preceding panel size, rounded integer percent), `aria-valuemin`/`aria-valuemax` (its min/max), `aria-controls` = preceding panel id, `aria-label` from prop or "Resize {panel label}", `tabIndex=0`. Test: `ResizablePanels.test.tsx › separator ARIA`.
- **REQ-NAV-68** Keyboard (APG window splitter): Arrow keys along the axis move by `keyboardStep`%; Shift+Arrow by `keyboardStepLarge`%; Home/End go to min/max; Enter toggles collapse on a `collapsible` preceding panel (restoring its previous size); RTL flips horizontal arrows. Test: `tests/a11y/apg/splitter.apg.spec.ts`.
- **REQ-NAV-69** Constraints: total always sums to 100 ± 0.01; a drag beyond a panel's `minSize` pushes the next panel only if it can shrink, otherwise clamps; collapsing snaps when dragged below `minSize / 2`. Test: `resizePanels.test.ts` (pure reducer, property test with 1,000 random drags).
- **REQ-NAV-70** Handle hit area: visual line 1px, hit area ≥ 24px across the axis at fine pointer and ≥ 44px at coarse pointer through a `::before` pseudo-element, with no layout impact. Focus ring per PRD-05 on the handle. Test: `a11y.spec.ts › splitter target size`.
- **REQ-NAV-71** Persistence: `autoSaveId` stores the layout in `localStorage["ag-panels:<id>"]`, read in a layout effect after hydration (never in render); `defaultLayout` (e.g. read from a cookie on the server) seeds SSR to avoid the post-hydration jump. Test: `ResizablePanels.test.tsx › restores saved layout after hydration without mismatch`.
- **REQ-NAV-72** Below the container width given by `stackBelow` (default `undefined`), a horizontal group stacks vertically with handles hidden and panels at intrinsic height (container query on the root). Test: `layout.spec.ts › resizable stacks below threshold`.

### 5.11 SourceTransition (flagship 31)

- **REQ-NAV-73** `SourceTransition.Root`, `SourceTransition.Source` (`id`), `SourceTransition.Destination` (`id`), and imperative `startSourceTransition(id, update: () => void)`. It assigns `view-transition-name: ag-src-<id>` to the source only for the duration of the transition, then to the destination (unique names, no collisions). Replaces `LiquidGlassTransitionProvider`/`LiquidGlassSource`/`LiquidGlassDestination` (E-28).
- **REQ-NAV-74** Engine path: `SourceTransition` is built on PRD-06 `startMorph` (`src/motion/viewTransition.ts`, NEW, owned by PRD-06; PRD-06 REQ-MOT-38 and its §7 row for `LiquidGlassSourceTransition.tsx`). This PRD owns the component API, name allocation and focus handling only; engine selection (React ≥19.3 `<ViewTransition>` when detected, else `document.startViewTransition`, else WAAPI FLIP on `transform`/`opacity` only) and the optics drop during `:active-view-transition` are PRD-06's and are not re-implemented here. Source and destination render `data-ag-vt-participant`. Test: `tests/motion/source-transition.spec.ts` per engine path (forced by fixture: `<ViewTransition>` present, `startViewTransition` only, neither).
- **REQ-NAV-75** Under `motion=calm`, the morph becomes an opacity cross-fade ≤ `--ag-duration-small` (PRD-MOT §4.2 scale; SC-19); under `none`, the update applies synchronously with no transition. The destination's final state is `opacity: 1` and identity transform (certification check). Test: `source-transition.spec.ts › reduced motion final state visible`.
- **REQ-NAV-76** Focus moves to the destination's first focusable (or the destination with `tabIndex=-1`) after the transition when the source had focus. Test: `SourceTransition.test.tsx › focus follows morph`.

### 5.12 Cross-cutting

- **REQ-NAV-77** Contrast: in every shell story and every registry block using the shell, every OCR-sampled text run is ≥4.5:1 (≥3:1 for text ≥24px or ≥18.66px bold, and for icons/indicators/focus rings against adjacent colours) across the 8 scenes × light/dark × transparency {glass, tinted, solid}. This directly retires R-01. Test: PRD-19 pixel-gate lane, subject set `app-shell/*`.
- **REQ-NAV-78** `prefers-contrast: more` measurably changes shell chrome (rim and fill floors rise per PRD-05): pixel diff inside `TopBar` and `Sidebar` > 0.5% of their pixels versus default (same threshold as AC-NAV-04), and shell contrast failures = 0 (retires R-07). Test: env-matrix `contrast=more` cell assertions.
- **REQ-NAV-79** Forced colors: 0 visible backdrop filters in any shell story (retires R-06), all surfaces use system colours, current nav item is indicated by a non-colour cue (`outline` or `text-decoration` per part) in addition to `Highlight`. Test: `tests/e2e/app-shell/forced-colors.spec.ts`.
- **REQ-NAV-80** Idle animations: 0 running animations and 0 rAF callbacks 1,000ms after load with no input, at every motion setting (retires R-05). Test: `tests/motion/shell-idle.spec.ts`.
- **REQ-NAV-81** Blur budget (§4.4): visible elements with a computed non-`none` `backdrop-filter` in the shell frame ≤3 at fine pointer and ≤2 at coarse pointer with no overlay open; nesting depth = 1; maximum blur radius ≤ 32px for chrome and ≤ 12px for scrims (retires R-03). This PRD is the owner of this value (SC-38): `StatusBar` is `content-sunken` and never blurred, and PRD-PERF REQ-PERF-19 must change from 4 to 3 with no StatusBar blur. Test: `tests/e2e/app-shell/blur-budget.spec.ts`.
- **REQ-NAV-82** Every part emits `data-ag-part` and, where stateful, `data-state`; these and the slot names are listed in typed metadata, one `<Component>.meta.ts` per exported component (`src/app-shell/{AppShell,Sidebar,TopBar,Inspector,StatusBar,MobileShell,ResizablePanels}.meta.ts`, `src/components/navigation/{Tabs,TabBar,Breadcrumbs,Pagination,Command,CommandPalette}.meta.ts`, `src/primitives/SourceTransition.meta.ts`), with part names from the PRD-FND parts registry `src/foundation/parts.ts` (FND-005). The aggregates `src/app-shell/meta.ts` and `src/components/navigation/meta.ts` only re-export the per-component metas (SC-27). The metadata drives docs, the Lab matrix and codemod tables (§11.3). Test: `meta.test.ts › every rendered part is declared`.
- **REQ-NAV-83** React 19 ref pattern (`ref` as a prop, no `forwardRef`) on every component; ref callbacks that attach observers return cleanup (§9.2). Test: static lane `no-forwardRef` scoped to these files; `ResizablePanels.test.tsx › observer cleanup`.
- **REQ-NAV-84** Every user-visible string (`"Skip to main content"`, `"Collapse sidebar"`, `"Show N more"`, `"Page N"`, `"N results"`, `"Breadcrumb"`, `"Pagination"`) is overridable through a `labels` prop on the owning root; no string is hard-coded in English without an override path. Test: `labels.test.tsx` (renders all components with a pseudo-locale and asserts 0 English defaults remain).

---

## 6. Files/directories affected (existing paths)

All verified with `rg --files` at 15b6de6f7. Edits land on the 5.0 branch only unless marked 4.x.

| Path | Change |
|---|---|
| `src/app-shell/components.tsx` | Replaced by the §4.1 module layout; file deleted at 5.0 |
| `src/app-shell/index.ts` | Rewritten as plain re-export barrel of 5.0 parts |
| `src/app-shell/GlassAppShell.tsx`, `GlassTopBar.tsx`, `GlassSidebarRail.tsx`, `GlassSidebarPanel.tsx`, `GlassMain.tsx`, `GlassPage.tsx`, `GlassPageHeader.tsx`, `GlassBreadcrumbs.tsx`, `GlassActionBar.tsx`, `GlassSplitPane.tsx`, `GlassResizablePanel.tsx`, `GlassCommandDock.tsx`, `GlassStatusBar.tsx`, `GlassMobileShell.tsx` | 14 one-line shims deleted (E-27) |
| `src/app-shell/app-shell.test.tsx` | Rewritten for 5.0 API (REQ-NAV-01..14, 36) |
| `src/workspace/index.tsx`, `src/workspace/workspace.test.tsx` | Deleted at 5.0; behaviour re-expressed as the registry item `app-shell-workspace` (REQ-NAV-35; SC-32) |
| `src/workflows/index.ts` | Deleted (E-26) |
| `src/components/layout/GlassAppShell.tsx`, `.test.tsx`, `.stories.tsx`, `__snapshots__/GlassAppShell.test.tsx.snap` | Deleted at 5.0 (absorbed by `AppShell`) |
| `src/components/layout/ZSpaceAppLayout.tsx`, `.test.tsx`, `.stories.tsx` | Deleted at 5.0 (absorbed; "depth" treatment not carried — see §9) |
| `src/components/layout/GlassSplitPane.tsx`, `.test.tsx`, `.stories.tsx`, `__snapshots__/GlassSplitPane.test.tsx.snap` | Deleted at 5.0 after `ResizablePanels` ports its keyboard model |
| `src/components/layout/index.ts` | Drops `GlassAppShell`, `GlassSplitPane`, `ZSpaceAppLayout` exports |
| `src/components/navigation/GlassTabs.tsx`, `GlassPageTabs.tsx`, `GlassPageTabs.module.css`, `EnhancedGlassTabs.tsx`, `GlassTabItem.tsx`, `GlassTabBar.tsx`, `GlassTabBar.module.css`, `styled.tsx`, `components/TabItem.tsx` (+ their tests, stories, snapshots) | Replaced by `Tabs.tsx` |
| `src/components/navigation/LiquidGlassTabBar.tsx`, `GlassBottomNav.tsx`, `LiquidGlassBottomAccessory.tsx`, `GlassMobileNav.tsx` (+ tests/stories) | Replaced by `TabBar.tsx` / `Sheet` drawer |
| `src/components/navigation/GlassSidebar.tsx`, `LiquidGlassInsetSidebar.tsx`, `GlassNavigationMenu.tsx` (+ tests/stories) | Replaced by `src/app-shell/Sidebar*.tsx` (`appearance="inset"`) |
| `src/components/navigation/GlassHeader.tsx`, `GlassNavigation.tsx`, `GlassResponsiveNav.tsx` (+ tests/stories/snapshots) | Replaced by `TopBar`, `AppShell` |
| `src/components/navigation/LiquidGlassInspectorPanel.tsx` (+ test/story) | Replaced by `src/app-shell/Inspector.tsx` |
| `src/components/navigation/GlassBreadcrumb.tsx` (+ test/story/snapshot) | Replaced by `Breadcrumbs.tsx` |
| `src/components/navigation/GlassPagination.tsx` (+ test/story/snapshot) | Replaced by `Pagination.tsx` |
| `src/components/navigation/GlassCommandBar.tsx` | Absorbed by PRD-08 `Toolbar` (this PRD supplies the codemod mapping only) |
| `src/components/navigation/index.ts`, `types.ts`, `utils/tabUtils.ts` (+ `utils/tabUtils.test.ts`) | Rewritten / deleted as parts move |
| `src/components/interactive/GlassCommandPalette.tsx`, `GlassCommand.tsx`, `LiquidGlassCommandSurface.tsx` | Replaced by `Command.tsx`, `CommandPalette.tsx` |
| `src/components/search/LiquidGlassSearchTab.tsx` (+ test/story) | Replaced by `TabBar.Search` |
| `src/components/media/LiquidGlassPhotoInspector.tsx` | **Not owned here.** PRD-13 replaces it with `ImageViewer.Inspector` (REQ-MED-48); listed only because it wraps `LiquidGlassInspectorPanel` (`LiquidGlassPhotoInspector.tsx:4`), which this PRD deletes, so its deletion PR must land with or after PRD-13's |
| `src/primitives/LiquidGlassSourceTransition.tsx`, `.test.tsx` | Replaced by `src/primitives/SourceTransition.tsx` |
| `src/primitives/focus/SkipLinks.tsx`, `.stories.tsx` | Successor is `AppShell.SkipLink` (this PRD); the consolidation and deletion of the three skip-link implementations is owned by PRD-05 (its §7 rows for `SkipLinks` and `GlassFocusIndicators`), not by this PRD |
| `src/stories/AppShell.stories.tsx` | **Not owned here.** Deleted by PRD-SB (SB-092; SC-31). Its successor is this PRD's component story file `src/app-shell/AppShell.stories.tsx` (§13 S-01, six distinct product-surface stories; fixes STORYBOOK-SHOWCASE-10) |
| `src/stories/AppChromeVisualBaseline.stories.tsx` | **Not owned here.** Deleted by PRD-SB (SB-106; SC-31) because the inline-styled layout hides defects (APPSHELL-WORKSPACE-RECIPES-CLI-17). NAV-105 only verifies the absence |
| `src/stories/NavigationGallery.stories.tsx` | **Not owned here.** Deleted by PRD-SB (SB-092). Navigation stories move to the per-component files in §8 |
| `src/index.ts` (lines 72, 82, 91 and nav exports) | Root exports switch to 5.0 names |
| `src/registry/recipes.ts` | **Removal owned here** (NAV-136; SC-38). App-shell recipes are retired in favour of the `app-frame` block and the `app-shell-workspace` item (SC-32); no `!important` survives. PRD-AI (AI-112) depends on NAV-136 and does not remove the file |
| `package.json` `exports` (`./app-shell` :119, `./workspace` :124, `./workflows` :154) | `./workspace`, `./workflows` removed (C-D in 4.2); `./app-shell.css` added through the PRD-PKG manifest `build/exports.manifest.json` (PKG-005; SC-12) |
| `docs/app-shell/readme.md` | Rewritten for 5.0; the fragment-as-sidebar example (`:62-67`) removed |
| `scripts/ci/verify-recipes-render.js` | **Not modified.** Removed by PRD-DX (DX-100; SC-39). The shell layout assertions (rail-beside-main, overflow, error accumulation across viewports) are added to its replacement, the PRD-DX registry render harness `tests/dx/registry-render.spec.ts` (DX-094), through NAV-114 |
| `scripts/audit/storybook-visual-certification.mjs` | **Not modified.** Removed by PRD-QA (QA-115; SC-39). The `Flagships/App Shell/*` subjects and cell assertions move to the PRD-QA L6 environment-visual lane (`certification/lanes/environment-visual.spec.ts`, QA-056) through NAV-112/113 |

---

## 7. Components affected

Inventory dispositions from `docs/auraglass-5/component-inventory.json` (lines = inventory `lines`).

| 4.x component | File | Lines | Disposition | 5.0 destination |
|---|---|---|---|---|
| GlassAppShell (app-shell subpath) | `src/app-shell/components.tsx` | 60 | REDESIGN, candidate | `AppShell` |
| GlassAppShell (root) | `src/components/layout/GlassAppShell.tsx` | 612 | REDESIGN, candidate | `AppShell` |
| ZSpaceAppLayout | `src/components/layout/ZSpaceAppLayout.tsx` | 334 | CONSOLIDATE | `AppShell` |
| GlassResponsiveNav | `src/components/navigation/GlassResponsiveNav.tsx` | 303 | DEPRECATE | `AppShell` (container queries) |
| GlassMain | `src/app-shell/components.tsx` | 16 | CONSOLIDATE | `AppShell.Main` |
| GlassPage | same | 14 | CONSOLIDATE | `Container` (PRD-14) inside `AppShell.Main` |
| GlassPageHeader | same | 43 | CONSOLIDATE | `AppShell.PageHeader` |
| GlassSidebar | `src/components/navigation/GlassSidebar.tsx` | 791 | REDESIGN, candidate | `Sidebar` |
| SidebarBrand / SidebarUserInfo | same | 205 | CONSOLIDATE | `Sidebar.Header` / `Sidebar.Footer` + `Avatar` |
| GlassSidebarRail | `src/app-shell/components.tsx` | 67 | CONSOLIDATE | `Sidebar` rail state |
| GlassSidebarPanel | same | 44 | CONSOLIDATE | `Sidebar` expanded state |
| LiquidGlassInsetSidebar | `src/components/navigation/LiquidGlassInsetSidebar.tsx` | 119 | CONSOLIDATE | `Sidebar appearance="inset"` |
| GlassNavigationMenu | `src/components/navigation/GlassNavigationMenu.tsx` | 595 | CONSOLIDATE | `Sidebar.Nav` + `Sidebar.Collapsible` |
| GlassTopBar | `src/app-shell/components.tsx` | 50 | REDESIGN | `TopBar` |
| GlassHeader (+ consciousness variants) | `src/components/navigation/GlassHeader.tsx` | 1512 | REPLACE | `TopBar` + `Menu` + `Breadcrumbs` + `SearchField` |
| GlassNavigation (GlassNavbar) | `src/components/navigation/GlassNavigation.tsx` | 659 | REMOVE | `TopBar` + `Sidebar` (codemod TODO) |
| GlassTabs | `src/components/navigation/GlassTabs.tsx` | 554 | POLISH, candidate | `Tabs` |
| GlassPageTabs | `src/components/navigation/GlassPageTabs.tsx` | 178 | KEEP, candidate (visual reference) | `Tabs appearance="pill"` |
| EnhancedGlassTabs | `src/components/navigation/EnhancedGlassTabs.tsx` | 561 | DEPRECATE | `Tabs` |
| GlassTabBar | `src/components/navigation/GlassTabBar.tsx` | 1202 | REPLACE | `Tabs` |
| GlassTabItem / TabItem | `GlassTabItem.tsx` / `components/TabItem.tsx` | 206 / 161 | DEPRECATE / CONSOLIDATE | `Tabs.Tab` |
| TabBarContainer / TabSelector | `src/components/navigation/styled.tsx` | 191 | REMOVE | — |
| GlassWorkspaceTabs / Tab | `src/workspace/index.tsx` | 48 | REPLACE | `Tabs` |
| LiquidGlassTabBar | `src/components/navigation/LiquidGlassTabBar.tsx` | 148 | REDESIGN, candidate | `TabBar` |
| GlassBottomNav | `src/components/navigation/GlassBottomNav.tsx` | 277 | REDESIGN | `TabBar` |
| LiquidGlassBottomAccessory | `src/components/navigation/LiquidGlassBottomAccessory.tsx` | 29 | CONSOLIDATE | `TabBar.Accessory` |
| LiquidGlassSearchTab | `src/components/search/LiquidGlassSearchTab.tsx` | 25 | REMOVE | `TabBar.Search` |
| GlassMobileNav | `src/components/navigation/GlassMobileNav.tsx` | 410 | POLISH | `Sheet side="start"` drawer + `Sidebar` (deviation from POLISH, §9) |
| MobileGlassNavigation | `src/components/mobile/TouchGlassOptimization.tsx` | 107 | REMOVE | — |
| GlassMobileShell | `src/app-shell/components.tsx` | 26 | CONSOLIDATE | `MobileShell` |
| GlassBreadcrumb (+ Item/Separator/Link/Compound) | `src/components/navigation/GlassBreadcrumb.tsx` | 400 | CONSOLIDATE | `Breadcrumbs` |
| GlassBreadcrumbs (app-shell) | `src/app-shell/components.tsx` | 35 | CONSOLIDATE | `Breadcrumbs` |
| GlassPagination (+ parts, usePagination, WithInfo) | `src/components/navigation/GlassPagination.tsx` | 561 | REDESIGN | `Pagination` |
| GlassCommandPalette | `src/components/interactive/GlassCommandPalette.tsx` | 758 | CONSOLIDATE, candidate | `CommandPalette` |
| GlassCommand | `src/components/interactive/GlassCommand.tsx` | 558 | CONSOLIDATE, candidate | `Command` |
| LiquidGlassCommandSurface | `src/components/interactive/LiquidGlassCommandSurface.tsx` | 163 | CONSOLIDATE | `CommandPalette` |
| GlassCommandDock | `src/app-shell/components.tsx` | 20 | DEPRECATE | inline `Command` / `TabBar placement="floating"` |
| GlassSplitPane (root) | `src/components/layout/GlassSplitPane.tsx` | 271 | REDESIGN | `ResizablePanels` |
| GlassSplitPane (app-shell) | `src/app-shell/components.tsx` | 31 | REMOVE | `ResizablePanels` |
| GlassResizablePanel | same | 15 | REMOVE | `ResizablePanels.Panel` |
| LiquidGlassTransitionProvider / Source / Destination | `src/primitives/LiquidGlassSourceTransition.tsx` | 183 | REDESIGN, candidate | `SourceTransition` |
| GlassInspectorPanel (workspace) | `src/workspace/index.tsx` | 23 | CONSOLIDATE | `Inspector` |
| LiquidGlassInspectorPanel | `src/components/navigation/LiquidGlassInspectorPanel.tsx` | 84 | CONSOLIDATE | `Inspector` |
| LiquidGlassPhotoInspector | `src/components/media/LiquidGlassPhotoInspector.tsx` | 48 | CONSOLIDATE | PRD-13 `ImageViewer.Inspector` (out of scope here; listed for the `LiquidGlassInspectorPanel` dependency) |
| GlassStatusBar | `src/app-shell/components.tsx` | 15 | CONSOLIDATE | `StatusBar` |
| GlassActionBar | same | 14 | CONSOLIDATE | PRD-08 `Toolbar` |
| GlassCommandBar | `src/components/navigation/GlassCommandBar.tsx` | 111 | CONSOLIDATE | PRD-08 `Toolbar` |
| GlassToolbar / LiquidGlassToolbar | `src/components/navigation/GlassToolbar.tsx` / `LiquidGlassToolbar.tsx` | 106 / 144 | CONSOLIDATE | PRD-08 `Toolbar` (consumed here in `TopBar.Trailing`, `Inspector.Header`) |
| GlassIconButton (app-shell) | `src/app-shell/components.tsx` | 20 | REMOVE | PRD-08 `IconButton` |
| GlassWorkspace, WorkspaceHeader, WorkspacePanel, WorkflowShell, CanvasArea, TimelineRail | `src/workspace/index.tsx` | 292 total | CONSOLIDATE | registry item `app-shell-workspace` (SC-32) |
| HeaderUserMenu | `src/components/navigation/HeaderUserMenu.tsx` | 256 | CONSOLIDATE | PRD-09 `Menu` (account-menu block) |
| GlassMenubar | `src/components/navigation/GlassMenubar.tsx` | 659 | REDESIGN | PRD-09 `Menubar` (consumed in `TopBar.Leading`) |

---

## 8. New components/files

All paths below are **NEW** (none exist at 15b6de6f7).

| Path | Contents |
|---|---|
| `src/app-shell/AppShell.tsx` | server: `AppShell.Root`, `Main`, `PageHeader`, `SkipLink` |
| `src/app-shell/AppShellSidebarToggle.tsx`, `AppShellInspectorToggle.tsx`, `AppShellController.tsx` | `"use client"` islands |
| `src/app-shell/appShellStore.ts` | per-root external store, cookie writer |
| `src/app-shell/parseAppShellCookie.ts` | server-safe pure helper |
| `src/app-shell/Sidebar.tsx`, `SidebarNav.tsx`, `SidebarCollapsible.tsx`, `SidebarDrawer.tsx` | Sidebar family |
| `src/app-shell/TopBar.tsx` | TopBar family |
| `src/app-shell/Inspector.tsx`, `InspectorSection.tsx` | Inspector family |
| `src/app-shell/StatusBar.tsx`, `StatusBarLive.tsx` | StatusBar family |
| `src/app-shell/MobileShell.tsx` | server preset |
| `src/app-shell/ResizablePanels.tsx`, `resizePanels.ts` | component + pure layout reducer |
| `src/app-shell/app-shell.css` | `@layer ag.components` frame CSS. The file starts with exactly the six-name order statement `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` and uses 0 `!important` (SC-20). Built to `dist/css/app-shell.css` through the PRD-PKG manifest (PKG-005) |
| `src/app-shell/{AppShell,Sidebar,TopBar,Inspector,StatusBar,MobileShell,ResizablePanels}.meta.ts` | one typed variant/part/state/`migration` metadata file per exported component (§11.3; SC-27, FND-005 parts registry) |
| `src/app-shell/meta.ts` | aggregate that only re-exports the per-component metas (SC-27) |
| `src/components/navigation/Tabs.tsx` | Tabs family |
| `src/components/navigation/TabBar.tsx` | TabBar family |
| `src/components/navigation/Breadcrumbs.tsx`, `BreadcrumbsOverflow.tsx` | Breadcrumbs (server) + client overflow |
| `src/components/navigation/Pagination.tsx`, `getPaginationRange.ts` | Pagination + pure range |
| `src/components/navigation/Command.tsx`, `CommandPalette.tsx`, `commandScore.ts` | Command system |
| `src/components/navigation/navigation.css` | nav flagship CSS (`Tabs`, `TabBar`, `Breadcrumbs`, `Pagination` go to `styles.css`; `Command` styles ship with Dialog in core) |
| `src/components/navigation/{Tabs,TabBar,Breadcrumbs,Pagination,Command,CommandPalette}.meta.ts`, `src/primitives/SourceTransition.meta.ts` | per-component metadata (SC-27) |
| `src/components/navigation/meta.ts` | aggregate re-export only (SC-27) |
| `src/primitives/SourceTransition.tsx` | SourceTransition |
| `src/compat/app-shell/<OldName>.tsx` | 4.x name adapters, one file per old name, re-exported from `src/compat/index.ts` (DX-065) and calling `warnDeprecated(id)` (REL-072). PRD-DX owns the compat entry; this PRD supplies the prop tables (SC-34) |
| `src/app-shell/{AppShell,Sidebar,TopBar,Inspector,StatusBar,MobileShell,ResizablePanels}.stories.tsx`, `src/components/navigation/{Tabs,TabBar,Breadcrumbs,Pagination,Command,CommandPalette}.stories.tsx`, `src/primitives/SourceTransition.stories.tsx` | §13 component stories, owned by this PRD and authored with the PRD-SB contract `defineComponentStories` (SB-071) under `Flagships/App Shell/<Name>` (SC-31; REQ-SB-08/10). `AppShell.stories.tsx` holds the six S-01 product shells |
| `tests/e2e/app-shell/{layout,a11y,sidebar-drawer,inspector,resizable,blur-budget,forced-colors,theme,ssr-hydration}.spec.ts` | Playwright (remote lanes) |
| `tests/a11y/apg/{sidebar,tabs,tabbar,breadcrumbs-overflow,command,splitter}.apg.spec.ts` | APG keyboard scripts on the PRD-05 harness `tests/a11y/apg/harness.ts` (PRD-A11Y REQ-A11Y-40, A11Y-073; SC-30); one file per widget, owned by this PRD; run by the PRD-QA behaviour lane (QA-082) |
| `tests/motion/{tabs-indicator,tabbar-minimize,source-transition,shell-idle}.spec.ts` | motion lane (PRD-06 `tests/motion/` convention) |
| `tests/perf/browser/{app-shell-scroll,sidebar-toggle,resizable-drag,command-5000}.spec.ts` | remote perf lane, driven by `tests/perf/harness/run-perf.mjs` (PERF-039; SC-30); runtime budgets as rows in `tests/perf/harness/budgets.json` (PERF-044; SC-15) |
| `registry/blocks/app-frame/` | content of the GA `app-frame` block (SC-32; owned here). PRD-DX scaffolds and registers it in `registry/registry.json` (DX-067, DX-071) and runs lint (`scripts/registry/lint.mjs`) and render (DX-094). `mobile-settings` and `support-inbox` are PRD-DX blocks that consume this PRD's components |
| `registry/items/app-shell-workspace/` | `registry:item` content replacing `aura-glass/workspace` (REQ-NAV-35; SC-32 "`workspace` becomes an item"); registered in `registry/registry.json` by MODIFY, depending on DX-067 |
| `packages/cli/src/migrate/4to5/transforms/app-shell-slots.ts`, `packages/cli/src/migrate/4to5/__fixtures__/app-shell-slots/<case>/{input,output}.tsx` | the NAV area transform `app-shell-slots` and its fixtures, on the PRD-DX engine (DX-041, DX-042). The id is registered in the PRD-REL catalogue (§11.2, SC-33). Mapping data comes only from the `migration` fields in the §8 `*.meta.ts` files and the generated `mappings/*.json`. Rows for the core ids `prop-grammar` and `imports-subpaths` are supplied as `migration` fields, not as transforms |

---

## 9. Components/files to remove or deprecate

Removal follows D-27: every 5.0 removal has a prior 4.x deprecation in the repo-root `deprecations.json` (SC-02: `version: 1`, schema `docs/schemas/deprecations.schema.json` by PRD-REL REL-010, instance seeded by PRD-TRUST TRUST-075; this PRD adds entries by MODIFY only, NAV-122) with a codemod or a stated no-successor reason.

Column semantics (architecture §12, §14.3, §14.4):
- **4.x C-D release:** subpaths and DEPRECATE/REMOVE-disposition components are deprecated in **4.2**; renamed names and CONSOLIDATE/REDESIGN/REPLACE/POLISH/KEEP losers (the `Glass*` prefix drop) are deprecated in **4.3**. "deprecated" in the table below means the release given by this rule.
- **5.0 "removed"** means removed from `.` and `./app-shell`. Every losing name with a successor (inventory KEEP, POLISH, REDESIGN, REPLACE or CONSOLIDATE) is re-exported from `aura-glass/compat` with a prop adapter through 5.x and removed in 6.0 (§14.3). Names with inventory DEPRECATE or REMOVE (`EnhancedGlassTabs`, `GlassTabItem`, `GlassResponsiveNav`, `GlassCommandDock`, `GlassNavigation`/`GlassNavbar`, `TabBarContainer`/`TabSelector`, `LiquidGlassSearchTab`, `MobileGlassNavigation`, app-shell `GlassSplitPane`, `GlassResizablePanel`, app-shell `GlassIconButton`) and the `GlassHeader` consciousness exports (§13.3 no-successor family) get **no** compat adapter; the `removed` codemod emits a TODO with the successor named.

| Item | 4.x C-D (4.2 or 4.3, per rule above) | 5.0 (C-B) | Successor / reason |
|---|---|---|---|
| `aura-glass/workspace`, `aura-glass/workflows` subpaths | dev warning on import | removed | `aura-glass/app-shell`; `imports-subpaths` codemod |
| Root `GlassAppShell`, `ZSpaceAppLayout`, `GlassResponsiveNav` | deprecated | removed | `AppShell`; manual slot mapping (codemod emits TODO with slot table) |
| app-shell `GlassAppShell`, `GlassMain`, `GlassPage`, `GlassPageHeader`, `GlassMobileShell`, `GlassStatusBar`, `GlassTopBar`, `GlassBreadcrumbs` | deprecated (names) | removed; `compat` adapters through 5.x | §10 |
| `GlassSidebar`, `GlassSidebarRail`, `GlassSidebarPanel`, `LiquidGlassInsetSidebar`, `GlassNavigationMenu`, `SidebarBrand`, `SidebarUserInfo` | deprecated | removed | `Sidebar` |
| `GlassHeader` + `ConsciousGlassHeader`, `PredictiveHeader`, `GazeResponsiveHeader`, `AccessibleHeader`, `HeaderConsciousnessPresets`, `HeaderBreadcrumbs`, `HeaderNavigation` | deprecated | removed | `TopBar`; consciousness variants have **no successor** (API-CONSISTENCY-02 conditional hooks) |
| `GlassNavigation` / `GlassNavbar` | deprecated | removed | `TopBar` + `Sidebar` |
| `GlassTabs`, `GlassPageTabs`, `EnhancedGlassTabs`, `GlassTabBar`, `GlassTabItem`, `TabItem`, `GlassWorkspaceTabs`/`Tab`, `TabBarContainer`, `TabSelector` | deprecated | removed | `Tabs` |
| `LiquidGlassTabBar`, `GlassBottomNav`, `LiquidGlassBottomAccessory`, `LiquidGlassSearchTab` | deprecated | removed | `TabBar` |
| `GlassMobileNav` | deprecated | removed | `Sidebar` drawer / `Sheet`. **Deviation:** inventory says POLISH; it is a fourth hand-rolled modal drawer with a full-viewport blurred backdrop (E-21), which §6 "one portal root and one layer stack" forbids. Its behaviour is fully covered by REQ-NAV-19 |
| `MobileGlassNavigation` | — (REMOVE; not root-exported) | removed | `useSwipe` stays with PRD-14 |
| `GlassBreadcrumb` family | deprecated | removed | `Breadcrumbs` |
| `GlassPagination` family, `usePagination` | deprecated | removed | `Pagination`, `getPaginationRange` |
| `GlassCommandPalette`, `GlassCommand`, `LiquidGlassCommandSurface`, `GlassCommandDock` | deprecated | removed | `CommandPalette`, `Command` |
| root `GlassSplitPane`, app-shell `GlassSplitPane`, `GlassResizablePanel` | deprecated | removed | `ResizablePanels` |
| `LiquidGlassTransitionProvider`, `LiquidGlassSource`, `LiquidGlassDestination`, `LiquidGlassSourceTransition` | deprecated | removed | `SourceTransition` |
| `LiquidGlassInspectorPanel`, workspace `GlassInspectorPanel` | deprecated | removed | `Inspector` |
| `GlassWorkspace`, `GlassWorkspaceHeader`, `GlassWorkspacePanel`, `GlassWorkflowShell`, `GlassCanvasArea`, `GlassTimelineRail` | deprecated | removed | registry item `app-shell-workspace` (D-17 pattern; SC-32); `GlassTimelineRail` → `Timeline` (flagship 37, owned by the §16 data-and-date PRD) |
| app-shell `GlassIconButton`, `GlassActionBar` | deprecated | removed | PRD-08 `IconButton`, `Toolbar` |
| `src/stories/AppChromeVisualBaseline.stories.tsx` | — | deleted | hides layout defects |
| 14 shim files in `src/app-shell/` | — | deleted | no behaviour |
| `ZSpaceAppLayout` "depth" treatment | — | not carried | stacked depth layers violate the §4.7 budget (R-03); no successor |

4.1.1 scope is decided by SC-36 (PRD-TRUST owns 4.1.1 contents). **Accepted into 4.1.1:** escaping user input in the 4.x `GlassCommandPalette` fuzzy search (E-22, crash class, C-I). PRD-TRUST implements it on `release/4.x`; NAV-015 hands over the file:line, the failing-test sketch and the escape rule. **Deferred to 4.2:** stopping the `value`/`onValueChange` DOM prop leak in `GlassWorkspaceTabs` (E-15). It ships on the PRD-REL 4.2 train (SC-36, SC-37 bridge); this PRD keeps the content task (NAV-143) because content stays with the owner. E-15 is not a D-28 visual fix, so it needs no D-28 label.

---

## 10. API changes

Compatibility classes per D-27: **C-I** internal, **C-E** additive, **C-D** deprecation, **C-B** breaking.

| # | Change | Class | Release | Migration |
|---|---|---|---|---|
| API-01 | New `AppShell` compound (`Root`, `Main`, `PageHeader`, `SkipLink`, `SidebarToggle`, `InspectorToggle`, `Controller`) | C-E | 5.0 (experimental preview under `aura-glass/material` is **not** offered; D-19 forbids Base UI flagships on 4.x) | — |
| API-02 | Slot props (`topBar`, `sidebar`, `actionBar`, `statusBar`) → compound children with `data-ag-slot` | C-B | 5.0 | `compat` `GlassAppShell` adapter maps props to children; codemod `app-shell-slots` (NAV area id on the PRD-DX engine; SC-33) rewrites JSX where props are inline JSX |
| API-03 | `sidebarPlacement: "left"|"right"` → `sidebarSide: "start"|"end"` | C-B | 5.0 | codemod `prop-grammar` value map left→start, right→end |
| API-04 | Root `GlassAppShell` `header`/`footer`/`collapsible`/`mobileBreakpoint` props | C-B | 5.0 | `header`→`TopBar`; `footer`→`StatusBar` children moved verbatim (links stay links inside `StatusBar.Item`); `collapsible`→always available; `mobileBreakpoint` deleted and recorded in the codemod change report (container queries, fixed 600px, §11 item 5). None of these emit a TODO, so the §15.2 zero-TODO canary holds |
| API-05 | `GlassSidebarRail items[{id,label,icon,active,onSelect}]` → `Sidebar.Item href current` children | C-B | 5.0 | codemod generates `Sidebar.Item` per literal item; `onSelect` without `href` becomes `render={<button type="button" onClick={onSelect} />}` (behaviour-preserving, no TODO; dev warning recommends links) |
| API-06 | `GlassSidebar collapsed/onCollapsedChange` → `AppShell` `defaultSidebar`/`Controller sidebar onSidebarChange` | C-B | 5.0 | codemod maps `collapsed={x}` → `sidebar={x ? "rail" : "expanded"}` |
| API-07 | Tabs selection contracts unified: `activeTab`/`onChange(id)`, `activeTab:number`/`onChange(e,i)`, `onTabChange`, `onTabClick`, `value/onChange` → `value`/`defaultValue`/`onValueChange(value)` | C-B | 5.0 | codemod `prop-grammar`; index-based `onChange(e,i)` emits TODO; `compat` adapters convert at runtime with one dev warning |
| API-08 | Tabs DOM: root loses `role="navigation"`; ids change from `trigger-${value}` to `useId`-based; parts gain `data-ag-part` | C-B (B10) | 5.0 | consumer CSS/tests use the `data-ag-part`/`data-state` contract; selector table published (§11) |
| API-09 | `LiquidGlassTabBar tabs/activeTab/onChange` and `GlassBottomNav items` → `TabBar.Item href current`; ARIA moves from tabs to navigation | C-B | 5.0 | codemod produces items; `onChange` without `href` becomes `semantics="navigation"` items with `render={<button type="button" onClick={() => onChange(id)} />}` and `current` from `activeTab` (behaviour-preserving, no TODO). `semantics="tabs"` is chosen only when the 4.x call site already renders matching panels |
| API-10 | `GlassBreadcrumb items[]` and compound parts → `Breadcrumbs.*` | C-B | 5.0 | codemod for `items` arrays; parts are rename-only |
| API-11 | `GlassPagination currentPage/totalPages/onPageChange` → `page/pageCount/onPageChange` | C-B | 5.0 | `prop-grammar` rename |
| API-12 | `GlassCommandPalette items/groups/fuzzySearch` → `CommandPalette` + `Command.Group/Item`; `fuzzySearch` removed (default scoring) | C-B | 5.0 | codemod for literal arrays; custom `filter` maps to `filter(value, query, keywords)` |
| API-13 | `GlassSplitPane direction/defaultSize/minSize/maxSize` (two children) → `ResizablePanels orientation` + two `Panel`s + `Handle` | C-B | 5.0 | codemod wraps children; percent semantics preserved (4.x `defaultSize` is a percent) |
| API-14 | `GlassStatusBar` loses `role="status"` | C-B (a11y fix) | 5.0 | use `StatusBar.Live` for announced text |
| API-15 | `./workspace`, `./workflows` subpaths removed | C-D 4.2 → C-B 5.0 | 4.2 / 5.0 | `imports-subpaths` |
| API-16 | New `--ag-app-shell-*` tokens and `app-shell.css` | C-E | 5.0 | — |
| API-17 | `parseAppShellCookie`, `getPaginationRange`, `commandScore`, `startSourceTransition` utilities | C-E | 5.0 | — |
| API-18 | Escape regex input in 4.x `GlassCommandPalette` (E-22); stop DOM prop leak in `GlassWorkspaceTabs` (E-15) | C-I | E-22: 4.1.1 (accepted, PRD-TRUST implements; SC-36). E-15: 4.2 (deferred, PRD-REL train; NAV-143) | none |

---

## 11. Migration concerns

1. **Pixels change everywhere.** Every shell surface moves to the 5.0 material (B11) and content stops being glass (B12). Apps that relied on `glass-on-light` ink pinning will see light ink on dark chrome; this is the intended contrast fix (R-01). The 4.3 `data-ag-preview="v5"` subtree preview does **not** cover app shell (D-19: no Base UI flagships on 4.x); teams re-baseline at 5.0 beta.
2. **Layout moves from consumer CSS to the library.** Apps that patched `.glass-app-shell__body` or `.glass-sidebar-rail` (as `saas-admin-shell` does with `!important`, `src/registry/recipes.ts:874-890`) must delete those overrides; `@auraglass/cli doctor --v5` flags selectors targeting `.glass-app-shell*`, `.glass-sidebar*`, `.glass-top-bar`, `.glass-status-bar`.
3. **Router integration.** 4.x rail and tab bar items were buttons with `onSelect`/`onChange`; 5.0 destinations should be links (`href` or `render={<RouterLink/>}`). The codemod cannot infer routes, so it does **not** emit a TODO: it rewrites each handler-only item to `render={<button type="button" onClick={originalHandler} />}` (supported by REQ-NAV-16 and REQ-NAV-45), which preserves 4.x behaviour exactly and triggers the dev-only "destinations should be links" warning at runtime. The migration guide (PRD-20) documents the follow-up of replacing these with router links. This keeps the frozen-fixture canary at zero TODOs, as architecture §15.2 requires.
4. **Landmarks and ids change** (B10). Tests using `getByRole('navigation')` on tabs, `#trigger-<value>` ids or `role="status"` on the status bar must switch to `getByRole('tablist')`, `data-ag-part` selectors and `StatusBar.Live`. A per-component selector table ships in the migration guide (PRD-20).
5. **Breakpoint semantics.** 4.x `mobileBreakpoint` (viewport) becomes a fixed 600px container breakpoint. A shell embedded in a narrower pane (e.g. Storybook canvas, iframe, split view) now renders compact; documented with a `layout="desktop"` override.
6. **SSR.** The legacy shell rendered desktop then flipped (E-04). 5.0 renders the right layout on the server. Apps that used `useEffect` workarounds to hide the flash can remove them.
7. **Persistence keys.** 4.x had no persisted shell state; 5.0 adds an opt-in cookie. Apps with strict cookie policies leave `persistKey` unset (default).
8. **compat coverage.** `aura-glass/compat` adapters exist for every §9 name whose inventory disposition has a successor (KEEP, POLISH, REDESIGN, REPLACE, CONSOLIDATE), per architecture §14.3. That includes `ZSpaceAppLayout` (CONSOLIDATE → `AppShell`; the adapter maps its slots to `AppShell` children and drops the "depth" layers with a one-time dev warning, §9 last row). Adapters are intentionally absent only for DEPRECATE/REMOVE names listed in the §9 column-semantics note and for the `GlassHeader` consciousness exports (§13.3); for those the codemod emits TODOs. Test: `src/compat/app-shell.test.tsx` (NEW, PRD-18 harness) renders every adapter with its 4.x props and asserts one dev warning per symbol.
9. **Frozen 4.x fixture.** The PRD-REL frozen consumer fixture `tests/fixtures/consumer-4x/` (REL-115; SC-08) must include a root `GlassAppShell` page and an `aura-glass/app-shell` page; after `migrate 4to5` the flagship subset compiles and renders with **0 TODOs** (architecture §15.2 canary gate; no exception for router items, see item 3).

---

## 12. Tests required

Unit tests run in Jest (`npm test`, jsdom). Playwright suites run **remotely only** (CI or the gated remote runner; §15 and machine policy), across Chromium, WebKit and Gecko unless a row says otherwise. All new.

### 12.1 Unit and SSR (Jest)

| File | Asserts |
|---|---|
| `src/app-shell/app-shell.test.tsx` (rewritten) | REQ-NAV-01 slot placement with `memo`/HOC wrappers; REQ-NAV-05 one `main` with `tabIndex=-1`; REQ-NAV-08 props → `data-ag-*`; REQ-NAV-12 heading level; REQ-NAV-36 landmark inventory |
| `src/app-shell/ssr.test.tsx` | `renderToString` of `AppShell.Root`, `Sidebar`, `TopBar`, `Inspector`, `StatusBar`, `MobileShell`, `Breadcrumbs`, `Pagination` succeeds in a server-only module graph (no client hooks imported) |
| `src/app-shell/appShellStore.test.ts` | toggle updates root attribute; cookie string format and attributes (REQ-NAV-09); controlled mode does not write (REQ-NAV-11); server snapshot equals rendered attribute |
| `src/app-shell/parseAppShellCookie.test.ts` | valid, partial, malformed, and oversized (>4 KB) inputs; never throws |
| `src/app-shell/Sidebar.test.tsx` | item is `<a>` with `aria-current` (REQ-NAV-16); `render` composes a router link; rail keeps accessible names (REQ-NAV-17); collapsed is `inert` with 0 tabbable descendants (REQ-NAV-18); uncontrolled toggle (REQ-NAV-21); group containing current opens (REQ-NAV-23); missing `aria-label` on `Sidebar.Nav` warns |
| `src/app-shell/AppShellSidebarToggle.test.tsx` | ARIA by mode (REQ-NAV-20); `mod+B` only when `shortcut` |
| `src/app-shell/TopBar.test.tsx` | one top ScrollEdge, warning on a second for the same edge and container (REQ-NAV-26); `<header>` banner only as a direct shell child |
| `src/app-shell/Inspector.test.tsx` | parts, required label, section collapse, Field label association (`htmlFor`) |
| `src/app-shell/StatusBar.test.tsx` | no `role=status` on bar; `StatusBar.Live` debounced single announcement, none on mount (REQ-NAV-33) |
| `src/app-shell/MobileShell.test.tsx` | renders `layout="mobile"`; slot order; `--ag-scroll-padding-bottom` rule present in compiled CSS |
| `src/app-shell/ResizablePanels.test.tsx` | container-relative drag math with an offset container (REQ-NAV-65); single `onLayout` per drag (REQ-NAV-66); separator ARIA (REQ-NAV-67); saved layout restored after hydration with no mismatch (REQ-NAV-71); observer cleanup (REQ-NAV-83) |
| `src/app-shell/resizePanels.test.ts` | pure reducer: sum = 100 ± 0.01, clamp/push, collapse snap; 1,000-iteration seeded property test (REQ-NAV-69) |
| `src/app-shell/app-shell.css.test.ts` | compiled CSS contains exactly the three `@container ag-app-shell` conditions of §4.2 (compact `< 600px`, medium `600px <= width < 1024px`, wide `>= 1440px`; expanded is the unconditioned base), 0 `!important`, 0 `transition: all`, 0 `will-change` outside `[data-ag-animating]` |
| `src/app-shell/meta.test.ts`, `src/components/navigation/meta.test.ts` | every rendered `data-ag-part` is declared in metadata (REQ-NAV-82) |
| `src/components/navigation/Tabs.test.tsx` | unique ids across two instances (REQ-NAV-39); no landmark role; active tab scrolled into view (REQ-NAV-42); part contract (REQ-NAV-43) |
| `src/components/navigation/TabBar.test.tsx` | navigation semantics has 0 `role=tab` (REQ-NAV-45); tabs semantics dev error without panels; >5 items warning (REQ-NAV-46); accessory placement (REQ-NAV-49) |
| `src/components/navigation/Breadcrumbs.test.tsx` | `nav > ol > li` structure; separators `aria-hidden`; `aria-current` on Current; collapse with `maxItems` (REQ-NAV-52) |
| `src/components/navigation/Pagination.test.tsx`, `getPaginationRange.test.ts` | stable item count; `aria-disabled` bounds; 40 table-driven range cases (REQ-NAV-55/56) |
| `src/components/navigation/commandScore.test.ts` | all regex metacharacters never throw; ranking order; diacritic folding (REQ-NAV-59) |
| `src/components/navigation/Command.test.tsx`, `CommandPalette.test.tsx` | 5,000-item virtualization keeps `aria-activedescendant` valid; result-count announcement; hotkey open and focus restore (REQ-NAV-61..63) |
| `src/primitives/SourceTransition.test.tsx` | unique `view-transition-name` allocation and cleanup; focus follows morph (REQ-NAV-76); FLIP fallback path when `startViewTransition` is absent |
| `src/app-shell/labels.test.tsx` | pseudo-locale renders with 0 English defaults (REQ-NAV-84) |

### 12.2 Browser (Playwright, remote)

| File | Asserts |
|---|---|
| `tests/e2e/app-shell/layout.spec.ts` | desktop sidebar beside main at 1440 and 1024 (REQ-NAV-03); layout follows container not viewport (REQ-NAV-04); `Main` owns scroll (REQ-NAV-06); safe-area insets (REQ-NAV-07); medium forces rail and restores (REQ-NAV-22); no horizontal overflow at 320/390 (REQ-NAV-28, 42, 54, 57); mobile last list item fully visible above TabBar (REQ-NAV-34); bottom TabBar only in compact (REQ-NAV-50); ResizablePanels stacking (REQ-NAV-72); no promoted layers at rest (REQ-NAV-13) |
| `tests/e2e/app-shell/a11y.spec.ts` | `@axe-core/playwright` with color-contrast **on**, 0 violations on every shell story; skip link focuses main; focus not obscured by overlay TopBar/TabBar (REQ-NAV-27); target sizes for rail items, TabBar items, splitter (REQ-NAV-17, 46, 70); `landmark-unique` (REQ-NAV-37) |
| `tests/e2e/app-shell/sidebar-drawer.spec.ts` | compact drawer opens from toggle, traps focus, closes on Escape/scrim/navigation, restores focus; stacked Escape with an open Menu inside closes Menu first (REQ-NAV-19) |
| `tests/e2e/app-shell/inspector.spec.ts` | docked/floating/sheet by container width; resizable via panels (REQ-NAV-31/32) |
| `tests/e2e/app-shell/resizable.spec.ts` | drag inside nested container; touch drag via `page.touchscreen`; 0 React commits during drag (REQ-NAV-65/66) |
| `tests/e2e/app-shell/blur-budget.spec.ts` | count of visible elements with computed `backdrop-filter` ≠ `none`: frame ≤3 (fine) / ≤2 (coarse); TabBar = 1; nesting depth 1; max blur ≤32px chrome, ≤12px scrim (REQ-NAV-47, 81) |
| `tests/e2e/app-shell/forced-colors.spec.ts` | `forcedColors: 'active'`: 0 visible backdrop filters; current item has non-colour cue (REQ-NAV-79) |
| `tests/e2e/app-shell/theme.spec.ts` | `createBrandTheme` changes indicator/focus colour (REQ-NAV-14) |
| `tests/e2e/app-shell/ssr-hydration.spec.ts` | Next 16 canary: 0 hydration warnings with and without persisted cookie (REQ-NAV-10) |
| `tests/a11y/apg/{sidebar,tabs,tabbar,breadcrumbs-overflow,command,splitter}.apg.spec.ts` | APG keyboard scripts for REQ-NAV-24, 40, 45, 52, 60, 68, including RTL variants |
| `tests/motion/{tabs-indicator,tabbar-minimize,source-transition,shell-idle}.spec.ts` | frame-strip motion checks; reduced-motion final state visible; 0 animations/rAF at idle (REQ-NAV-41, 48, 74, 75, 80) |
| `tests/perf/browser/{app-shell-scroll,sidebar-toggle,resizable-drag,command-5000}.spec.ts` | §16 budgets |
| `tests/dx/registry-render.spec.ts` (PRD-DX harness DX-094, which replaces `scripts/ci/verify-recipes-render.js`; NAV-114 adds the shell cases) | accumulates console/page errors across all recipes and viewports; fails on any `layoutIssues`; adds the rail-beside-main geometric assertion that would have caught R-09 |

### 12.3 Visual and pixel gates (PRD-19 lanes)

Environment-matrix baselines for every flagship 22–31 state listed in §13, at 1440 and 390, light/dark, transparency glass/tinted/solid, preference default/contrast-more/forced-colors/reduced-motion, tier lightweight/standard (enhanced for `TabBar refraction` on Chromium). Pixel gates: OCR text contrast (REQ-NAV-77), glass density ≤0.3 on visible glass nodes, material presence (backdrop luminance variance under TopBar/Sidebar/TabBar), layout overlap/overflow, and 0 story `!important`.

---

## 13. Storybook requirements

Storybook is the Material Lab (§15.4): every story renders over the toolbar `environment` scene (8 scenes); no opaque story stage; motion follows the OS except in the CI snapshot run.

- **S-01 Product shells (`src/app-shell/AppShell.stories.tsx`, the NAV-owned AppShell component story file; SC-31)** — six distinct, non-aliased stories built only from unmodified 5.0 components with product-realistic copy: `SaaSAdmin` (Sidebar expanded + TopBar + Breadcrumbs + Tabs + Table), `AIWorkspace` (Sidebar rail + ResizablePanels + Inspector + StatusBar.Live), `Mail` (three-pane ResizablePanels), `Settings` (Sidebar + PageHeader + Tabs vertical), `MobileApp` (MobileShell + TabBar + Sheet), `CommandCenter` (CommandPalette open). Meta `title: "Flagships/App Shell/AppShell"` (PRD-SB REQ-SB-08/10 title contract; authored with `defineComponentStories`, SB-071); the six shells are the AppShell `InContext` product variants, as PRD-SB SB-085 states. The `SaaSAdmin` and `AIWorkspace` exports are named `Saas` and `AiCommandCenter`, so their Storybook ids are `flagships-app-shell-appshell--saas` and `flagships-app-shell-appshell--ai-command-center`. The performance PRD (REQ-PERF-35) and PRD-QA must cite these ids instead of `app-shell--saas` / `app-shell--ai-command-center` (§21 item O-04). Supersedes the `src/stories/AppShell.stories.tsx` aliases (STORYBOOK-SHOWCASE-10), which PRD-SB deletes (SB-092). Full-page showcases (`showcase/ops-console`, `collaborative-workspace`, `mobile-productivity`, …) are PRD-SB files. This PRD supplies only their shell-part compositions, through NAV-144 (SC-31). No `<style>` blocks, no inline layout, 0 `!important`, 0 hex literals.
- **S-02 State matrices** generated from `meta.ts`, one per flagship: AppShell {sidebar expanded/rail/collapsed/drawer-open} × {inspector closed/floating/docked/sheet} × {container compact/medium/expanded/wide}; Sidebar item {default, hover, focus-visible, current, disabled, with badge, nested open/closed}; TopBar {inline, overlay, scrolled (ScrollEdge active)}; Tabs {underline, pill} × {horizontal, vertical} × {default, focus-visible, active, disabled, overflowing}; TabBar {bottom, floating} × {navigation, tabs} × {expanded, minimized} × {with accessory}; Breadcrumbs {2, 4, 8 items, collapsed}; Pagination {first, middle, last, compact}; Command {empty query, results, empty, loading, 5,000 items}; ResizablePanels {2 and 3 panels, horizontal, vertical, nested, collapsed panel, handle focus}; SourceTransition {before, mid (paused), after}.
- **S-03 Container playground** — a `container width` arg (320–1920px) resizing the shell inside a fixed viewport, demonstrating REQ-NAV-04.
- **S-04 RTL** — every S-01 story with `dir="rtl"`.
- **S-05 Preference toggles** — toolbar globals for scheme, transparency, contrast, motion and tier set `data-ag-*` on the story root; S-01 stories must pass, in every toolbar combination, the measurable checks already defined for them: OCR contrast (REQ-NAV-77), blur budget (REQ-NAV-81), forced-colors (REQ-NAV-79), `contrast=more` diff (REQ-NAV-78) and the PRD-19 pixel gates (§12.3); "looks correct" is not an acceptance criterion.
- **S-06 Perf readout** — the provider dev counter overlay shows live blurred-surface count against budget (fine/coarse), visible in S-01 stories.
- **S-07 Docs** — each flagship's MDX page lists parts, `data-ag-part`/`data-state` values, keyboard table, and the 4.x → 5.0 role/selector change table (§11.3), all generated from `meta.ts`.
- **S-08 Interaction tests** — `play` functions for drawer open/close, tab keyboard, splitter keyboard and command search, mirroring the APG specs (run in the remote Storybook test-runner lane).
- Story titles live under `Flagships/App Shell/<Name>` for all flagships 22–31 and the `./app-shell` members, which is the PRD-SB `storySort` group `Flagships › App Shell` (REQ-SB-08; fixes the missing-group defect, STORYBOOK-SHOWCASE-15). S-02 state matrices are generated by the PRD-SB contract (`defineComponentStories` `Matrix`, SB-071) from this PRD's `*.meta.ts`; this PRD writes no matrix generator. Globals and decorators (S-05, S-06) are registered through `.storybook/preview.tsx`, which PRD-SB owns (SB-048).

---

## 14. Responsive requirements

| Container width | Sidebar | Inspector | TopBar | TabBar (`placement="bottom"`) | Notes |
|---|---|---|---|---|---|
| < 600px (compact) | hidden; drawer via toggle (`Sheet side="start"`, width `min(85%, 20rem)`) | `Sheet side="bottom"`, detents 0.5/1 | height 2.75rem; `Center` hidden | shown; overlays Main | `PageHeader` actions wrap; Pagination compact below 400px |
| 600–1023px (medium) | forced `rail` (4rem) | floating panel, inline-end, `min(20rem, 45%)` | 3.25rem | hidden | stored `expanded` restored at ≥1024 |
| 1024–1439px (expanded) | user state (16rem / 4rem / 0) | floating | 3.25rem | hidden | |
| ≥ 1440px (wide) | user state | docked column 20rem | 3.25rem | hidden | `ResizablePanels` may own widths |

- All widths are container-relative; no viewport media queries for layout. Viewport media queries are used **only** for `(pointer: coarse)` target sizing, `(hover: hover)` affordances, `prefers-*` preferences and `display-mode: standalone` (adds `env(titlebar-area-*)` handling to TopBar when present).
- Height: `100dvh` on Root and MobileShell; landscape phones (height < 500px) reduce TopBar to 2.75rem and TabBar to icon-only.
- Text zoom: at 200% browser zoom and at 320 CSS px width (WCAG 1.4.10 reflow), no two-dimensional scrolling outside `ResizablePanels` and `Command.List`.
- Touch: TabBar items, rail items, drawer close and splitter handles meet 44×44px at coarse pointer; splitter has `touch-action: none` only on the handle.
- Safe areas: REQ-NAV-07, REQ-NAV-34.
- Keyboard-only and switch users can reach every region at every width (skip link + landmarks).

---

## 15. Accessibility requirements

- **WCAG 2.2 AA** for every flagship 22–31 and `./app-shell` member; APG patterns: Tabs (Tabs, TabBar `semantics="tabs"`), Disclosure (Sidebar.Collapsible, Inspector.Section), Dialog modal (drawer, sheet inspector, CommandPalette), Combobox with listbox (Command), Window Splitter (ResizablePanels), Breadcrumb, landmark regions (AppShell).
- **Landmarks:** one `banner` (TopBar as direct shell child), one `main`, one `navigation` per labelled nav (Sidebar.Nav, TabBar navigation, Breadcrumbs, Pagination) with unique names, `complementary` per Inspector. No `region` landmarks from the frame (REQ-NAV-36/37).
- **Current location:** `aria-current="page"` on exactly one item per navigation (Sidebar, TabBar, Breadcrumbs, Pagination); `aria-current` is never combined with `aria-selected`.
- **Hidden content:** collapsed sidebar and closed panels are `inert`/`hidden`, never `aria-hidden` with focusable descendants (REQ-NAV-18).
- **Focus:** PRD-05 two-tone 2px `outline` ring with `outline-offset` (WCAG 2.4.13) on every interactive part; `Highlight` under forced colors; no `focus:outline-none`. Focus not obscured by sticky/overlay chrome (2.4.11, REQ-NAV-27). Focus restoration after drawer, sheet and palette close.
- **Targets:** ≥24×24px everywhere (2.5.8); ≥44×44px at coarse pointer for nav items and splitter.
- **Contrast:** REQ-NAV-77 (≥4.5:1 text, ≥3:1 large text and non-text UI) on rendered pixels over all scenes; `contrast: more` and forced colors per REQ-NAV-78/79; `data-ag-transparency` rungs honoured as floors (D-11).
- **Live regions:** only through the single provider announcer: `StatusBar.Live` and Command result counts, polite and debounced (REQ-NAV-33, 63). No `role=status` on containers.
- **Motion:** no essential information conveyed by motion; `motion=calm|none` per §8; reduced motion cannot be raised by any prop (B13).
- **Internationalisation:** logical properties throughout; RTL flips sidebar side, breadcrumb separators, splitter arrows and tab arrow keys; all strings overridable (REQ-NAV-84).
- **Manual lane (GA blocker, §15.2):** VoiceOver/Safari macOS and iOS, NVDA/Chrome, TalkBack/Chrome, physical touch on the six S-01 shells, with the scripts in `tests/a11y/apg/*` as the manual checklist.

---

## 16. Performance requirements (numeric budgets)

Budgets are provisional per D-26: set before measuring, calibrated once by the remote perf lane at 5.0.0-alpha.1 against real Base UI part sizes, then frozen as ceilings that only ratchet down. Measured remotely only (PRD-19 harness: emulated mid-tier mobile with 4× CPU throttle at 390×844, and a 120 Hz GPU desktop at 1440×900; the existing software-raster lane is kept for trend comparison with R-04).

### 16.1 Bundle (min+gz, peers external)

Each row below is submitted as a row in the single byte-budget file `docs/size-budgets.json` (owner PRD-PKG, PKG-048; gate `scripts/ci/verify-size-budgets.mjs`, PKG-049; SC-15) by MODIFY in NAV-116. There is no `size-limit`, `.size-limit.json` or `build/budgets.lock.json`. A row may be stricter than the PRD-PERF REQ-PERF-01 default ceilings, never looser. The client-islands row is named `app-shell client islands` (≤12 KB, owned here) and is distinct from the PRD-PERF row `{ AppShell }` all slots (≤15 KB); both rows exist (SC-15). Runtime budgets in §16.2 are rows in `tests/perf/harness/budgets.json` (PRD-PERF, PERF-044).

| Import | Budget |
|---|---|
| `aura-glass/app-shell.css` | ≤ 8 KB gz |
| `app-shell client islands`: `{ AppShell, Sidebar, TopBar }` from `aura-glass/app-shell`, client JS reaching the browser in a Next RSC page (toggles + drawer) | ≤ 12 KB (drawer's Dialog/Sheet code loaded only when `SidebarDrawer` mounts in a compact container, via `React.lazy`) |
| Server-only `AppShell.Root` + `Main` + `TopBar` + `Breadcrumbs` (no islands) | 0 KB client JS |
| `{ ResizablePanels }` | ≤ 6 KB |
| `{ Tabs }` | ≤ 8 KB |
| `{ TabBar }` | ≤ 6 KB (`semantics="tabs"` adds Tabs, counted under Tabs) |
| `{ Breadcrumbs }` with overflow | ≤ 2 KB server; overflow island ≤ 3 KB + Menu (PRD-09) |
| `{ Pagination }` | ≤ 3 KB |
| `{ Command }` | ≤ 12 KB (excl. `@tanstack/react-virtual`, which is ≤ 5 KB and loaded only above 100 items) |
| `{ CommandPalette }` | ≤ 32 KB (= `Command` ≤ 12 KB + `Dialog` ≤ 20 KB per architecture §3.6; shared Base UI chunks counted once, so calibration is expected to ratchet this down) |
| `{ SourceTransition }` | ≤ 3 KB |

### 16.2 Runtime

| Metric | Budget | Measured in |
|---|---|---|
| Blurred surfaces, shell frame, no overlay | ≤ 3 fine / ≤ 2 coarse (R-03 today: 21–29) | `blur-budget.spec.ts` |
| Backdrop-filter nesting depth | 1 (R-03 today: 4) | same |
| Max blur radius | ≤ 32px chrome, ≤ 12px scrim (today: 40px) | same |
| Idle animations / rAF callbacks 1 s after load | 0 / 0 (R-05 today: 4 infinite) | `shell-idle.spec.ts` |
| Scroll `Main` (2 s scripted wheel), 120 Hz desktop | p95 frame time ≤ 8.3 ms; dropped frames ≤ 2% | `app-shell-scroll.spec.ts` |
| Scroll `Main`, mid-tier mobile | p95 frame time ≤ 16.7 ms; dropped frames ≤ 5% | same |
| Software-raster lane (trend vs R-04) | `SaaSAdmin` and `AIWorkspace` median rAF fps ≥ 50 absolute **and** ≥ 0.85 × `perf-harness-blank--default` in the same run (performance PRD REQ-PERF-35/AC-PERF-09, which names these subjects `app-shell--saas` and `app-shell--ai-command-center`; today: 19–23 fps vs 60 = 0.32–0.38) | `tests/perf/browser/regression-4x.spec.ts` (performance PRD) |
| Sidebar toggle INP, mid-tier mobile | ≤ 100 ms; no long task > 50 ms | `sidebar-toggle.spec.ts` |
| Sidebar width transition | animates only under `[data-ag-animating]`; ≤ `--ag-duration-medium`; 0 layout-property animations at `motion=calm|none` | same |
| ResizablePanels drag | ≤ 1 DOM write per frame; 0 React commits until `pointerup`; p95 frame ≤ 16.7 ms on mid-tier mobile with 3 panels | `resizable-drag.spec.ts` |
| CLS on load, all S-01 shells | ≤ 0.01 (persisted state rendered server-side) | `ssr-hydration.spec.ts` |
| LCP delta vs same page without shell | ≤ +50 ms (mid-tier mobile) | `app-shell-scroll.spec.ts` |
| Command filter, 5,000 items | input → filtered render ≤ 50 ms p95; ≤ 30 DOM item nodes mounted | `command-5000.spec.ts` |
| Long tasks during S-01 interaction scripts after hydration | 0 > 50 ms attributable to library code | perf lane |
| Perf grade (§15.2) | ≥ B for AppShell, Sidebar, TopBar, Tabs, Breadcrumbs, Pagination, ResizablePanels; ≥ C for TabBar (refraction off), CommandPalette, SourceTransition | perf lane |

---

## 17. Acceptance criteria

Each criterion is measured in CI artifacts keyed to the release SHA (D-32); none relies on committed reports.

- **AC-NAV-01** In a packed-tarball Vite app without Tailwind (only `styles.css` + `app-shell.css`), at 1440×900 the `app-frame` block's (SC-32) sidebar right edge ≤ main left edge + 1px and their top edges differ by ≤ TopBar height (inverse of R-09).
- **AC-NAV-02** The undefined-class check reports 0 undefined classes in all files under `src/app-shell/` and the seven nav flagship files; static lane reports 0 `!important`, 0 `transition: all`, 0 colour/blur/duration literals in them.
- **AC-NAV-03** OCR contrast: 0 text runs below 4.5:1 (3:1 large) across S-01 × 8 scenes × light/dark × glass/tinted/solid × 1440/390 (today: 4–5 of 5 runs fail on the default stage alone, R-01).
- **AC-NAV-04** `contrast: more`: pixel diff inside TopBar and Sidebar > 0.5% of their pixels vs default, and 0 contrast failures (today: 0.000 diff, R-07).
- **AC-NAV-05** Forced colors: 0 visible backdrop filters in every shell story (today: 3, R-06); current-item cue present.
- **AC-NAV-06** Blur budget: ≤ 3 (fine) / ≤ 2 (coarse) blurred surfaces, nesting depth 1, max blur ≤ 32px, in every S-01 story with no overlay open.
- **AC-NAV-07** 0 running animations and 0 rAF callbacks 1 s after load at idle in every shell story, all motion settings.
- **AC-NAV-08** All §16.1 bundle budgets green in the artifact lane; all §16.2 runtime budgets green in the remote perf lane; perf grades meet §16.2.
- **AC-NAV-09** `@axe-core/playwright` (color-contrast on) reports 0 violations on every story under `Flagships/App Shell/*` in Chromium, WebKit and Gecko.
- **AC-NAV-10** All six APG specs in `tests/a11y/apg/` pass in three engines, LTR and RTL.
- **AC-NAV-11** Two `Tabs` instances with identical values on one page: 0 duplicate ids; no `Tabs` renders a landmark.
- **AC-NAV-12** `TabBar semantics="navigation"` and `Sidebar` render 0 elements with `role="tab"`/`role="tablist"`; every destination is an `<a href>` (or a `render` element) with exactly one `aria-current="page"` per nav.
- **AC-NAV-13** Collapsed sidebar: 0 tabbable descendants and axe `aria-hidden-focus` = 0; `StatusBar.Root` has no live-region role.
- **AC-NAV-14** ResizablePanels: drag inside a container offset by 600px moves the handle to within 1px of the pointer; touch drag works in WebKit; 0 React commits during drag; one `onLayout` per drag.
- **AC-NAV-15** `commandScore` and `Command` accept every printable ASCII character as query input with 0 exceptions (fuzz: 10,000 random strings).
- **AC-NAV-16** SSR → hydrate of every S-01 shell in the Next 16 + React 19.3 and Next 15 + React 19.0 canaries: 0 hydration warnings, CLS ≤ 0.01, with and without a persisted `rail` cookie.
- **AC-NAV-17** Breadcrumbs without overflow and the server shell frame contribute 0 client modules to the RSC client manifest.
- **AC-NAV-18** `migrate 4to5` on the frozen 4.x fixture's shell pages: compiles, renders, and leaves **0 TODOs** on the flagship subset (§15.2); handler-only rail/tab-bar items become `render={<button onClick>}` items (§11 item 3); every absorbed 4.x name in §7 has a passing codemod fixture.
- **AC-NAV-19** The PRD-REL API report `etc/api/app-shell.api.md` and export snapshot `etc/api/app-shell.exports.json` (and the root `etc/api/index.*` nav rows; SC-04, REL-003) match §10; every removed name appears in the repo-root `deprecations.json` (SC-02) with a 4.x deprecation version and a `codemod` that is an SC-33 id or null.
- **AC-NAV-20** Six S-01 stories exist, are pairwise non-identical (DOM hash differs), contain 0 `<style>` elements and 0 `!important`, and pass the §15.2 Manual-lane human review (specular quality, optical hierarchy, radius rhythm, "reads as one hand"), recorded as pass/fail per story per item from remotely captured screenshots and signed off by the design reviewer in the release checklist; any fail blocks GA.
- **AC-NAV-21** Manual lane: VoiceOver (macOS, iOS), NVDA, TalkBack and physical touch scripts complete on the six shells with 0 blocker defects.
- **AC-NAV-22** Every flagship 22–31 has all §11.3 deliverables present in the release artifact index.

---

## 18. Definition of done

1. All REQ-NAV-01 … REQ-NAV-84 implemented, each linked to its passing test in the PR description.
2. AC-NAV-01 … AC-NAV-22 green on the release SHA in CI artifacts; no lane skipped; Playwright and perf lanes ran remotely (no local browser or Docker runs).
3. §11.3 per-flagship deliverables complete for flagships 22–31: typed metadata (`meta.ts`), `data-ag-part`/`data-state` contract, role/selector change table vs 4.x, a registry block usage, APG script, per-import budget line, perf grade, environment-matrix baselines, codemod fixtures from every absorbed 4.x name.
4. 4.x removals have `deprecations.json` entries shipped in 4.2 (subpaths, DEPRECATE/REMOVE names) or 4.3 (renamed and CONSOLIDATE-loser names), per the §9 column-semantics rule, before the 5.0 removal PR merges; each removal family lands as one revertable PR (§14.6).
5. `docs/app-shell/readme.md` rewritten from metadata; migration guide sections generated (PRD-20) including router and selector tables.
6. `src/registry/recipes.ts` app-shell recipes retired; replacement blocks render in the PRD-18 harness with 0 `!important` and 0 hex literals.
7. No file in §6 marked "deleted" remains in `main`; inventory records in §7 show 0 REMOVE for this boundary.
8. Bundle and runtime budgets frozen in the budget table after alpha calibration, with any calibrated change recorded in the PR and ratchet-down only.
9. No mock completion: no REQ or AC is closed by a stub component, a `test.skip`/`test.fixme`/`it.todo`, a jsdom assertion standing in for a layout, contrast, blur-count, motion or frame-time measurement (those are satisfiable only by the remote real-browser lanes), a story with inline layout or a `<style>` block, or a committed report file (D-32). A requirement whose blocking dependency (§19) is not yet certified stays open; it is not marked done against a placeholder.

---

## 19. Dependencies (other PRDs)

PRDs are cited by key (SC-01), with the §16 id in parentheses. The anchor tasks are the ones that `tasks/NAV.json` `depends_on` uses (SC-40). An external gate (product sign-off, a published release) goes in a task's `gate` field, never in `depends_on`.

| PRD (key, §16 id) | What this PRD consumes | Anchor tasks | Blocking? |
|---|---|---|---|
| PRD-TRUST (PRD-00) | 4.1.1 contents incl. the accepted E-22 fix (SC-36); `deprecations.json` seed | TRUST-075 | E-22 handover only (NAV-015) |
| PRD-REL (PRD-01, + interim §16 PRD-17 bridge, SC-37) | change-class gate, `deprecations.json` schema and generator, API report and export snapshot (`etc/api/<slug>.*`), `warnDeprecated`, frozen 4.x fixture `tests/fixtures/consumer-4x/`, codemod id catalogue, 4.2/4.3 deprecation entries and gates | REL-010, REL-003, REL-070, REL-072, REL-082, REL-115 | yes (before any removal) |
| PRD-PKG (PRD-02) | `./app-shell` and `./app-shell.css` manifest entries, `@layer` order statement, per-file directives, `docs/size-budgets.json` + gate, dependency allowlist, class-coverage test | PKG-005, PKG-048, PKG-049, PKG-056, PKG-105 | yes |
| PRD-DS (PRD-03) | token compiler and tree (the `--ag-app-shell-*` rows land through a DS task; SC-18), density modes, motion durations (`--ag-duration-small` …, SC-19), `createGlassTheme`/`createBrandTheme` | DS-016, DS-024, DS-026, DS-083 | yes |
| PRD-MAT (PRD-04, + interim §16 PRD-15 enhanced tier) | `Surface`, `SurfaceGroup`, `ScrollEdge` (`edgeStyle`, SC-22), `ConcentricFrame`, nesting rule, content materials, `data-ag-*` registry (SC-21), TabBar `refraction` | MAT-047, MAT-048, MAT-050, MAT-051 | yes (refraction: no; TabBar ships standard, D-05) |
| PRD-A11Y (PRD-05) | provider, announcer, portal root and `LayerStack` (the only Escape dispatcher, SC-25), focus ring, OS floors, dev blur counter, APG harness `tests/a11y/apg/harness.ts`, deletion of the three 4.x skip-link implementations | A11Y-027, A11Y-029, A11Y-049, A11Y-054, A11Y-073 | yes |
| PRD-MOT (PRD-06) | `startMorph` / View Transition engine (`src/motion/viewTransition.ts`), `useMorphName`, optics drop, `linear()` springs | MOT-045, MOT-048 | yes for Tabs indicator, SourceTransition, TabBar minimize |
| PRD-PERF (numeric policy) | default size ceilings, `tests/perf/harness/run-perf.mjs`, `tests/perf/harness/budgets.json` | PERF-039, PERF-044 | yes for perf ACs |
| PRD-FND (PRD-07 + PRD-14 + PRD-16) | Base UI pin and wrapping pattern, React 19 ref pattern, parts registry `src/foundation/parts.ts`, `usePortalContainer()`, `Container`, `Card`, `Avatar`, `Stack`/`Grid`; §16 PRD-16 removal coordination | FND-001, FND-005, FND-007, FND-047, FND-050, FND-072 | yes (core components: S-01 stories and registry content only) |
| PRD-CTL (PRD-08) | `IconButton`, `Toolbar`, `SearchField`, `SegmentedControl` | CTL-061, CTL-066, CTL-075 | yes for toggles, TopBar trailing, Inspector header |
| PRD-OVL (PRD-09) | `Sheet` (drawer, inspector sheet, detents), `Dialog` (CommandPalette), `Menu`/`Menubar` (breadcrumb overflow, TopBar), `Tooltip` (rail labels; its `delay` default) | OVL-040, OVL-066, OVL-081, OVL-097, OVL-099 | yes |
| PRD-DATA (PRD-11) | `Table` in the S-01 `Saas` story, `Timeline` (`app-shell-workspace` item) | DATA-038, DATA-069 | yes for AC-NAV-20 only: `Saas` must use the real `Table`; no placeholder or mock table may count toward S-01 or ship in a GA story. All other work proceeds without it |
| PRD-MED (PRD-13) | `ImageViewer.Inspector` replaces `LiquidGlassPhotoInspector`, which wraps `LiquidGlassInspectorPanel` | MED-119 | coordinates: the inspector-family removal PR (§20 step 14) lands with or after PRD-MED's PhotoInspector removal |
| PRD-DX (PRD-18 + PRD-20) | codemod engine and catalogue, `compat` entry, registry schema/`registry.json`/build/lint/render harness, `doctor --v5`, migration guide | DX-037, DX-041, DX-042, DX-065, DX-067, DX-070, DX-094 | this PRD supplies `migration` metadata, the `app-shell-slots` transform, block/item content and compat prop tables |
| PRD-SB (Storybook/Lab half of PRD-19) | `.storybook/preview.tsx`, `defineComponentStories` contract, generated matrices, showcases, deletion of `src/stories/AppShell.stories.tsx`, `AppChromeVisualBaseline.stories.tsx`, `NavigationGallery.stories.tsx` | SB-048, SB-071, SB-092, SB-106, SB-105, SB-111, SB-112 | yes for §13 |
| PRD-QA (PRD-19 certification infra) | scenes (SC-28), Playwright configs, L6 environment-visual lane, OCR, preference-delta, behaviour lane, motion lane, perf lane, canaries, undefined-class check, remote runners | QA-003, QA-018, QA-038, QA-049, QA-051, QA-056, QA-076, QA-082, QA-085, QA-086 | yes for AC verification |
| PRD-EXP (expansion ledger, + interim §16 PRD-21) | nothing. Ledger rows X-16, X-25 (reorder) and X-26 (edit) cite "PRD-11", which is §16 PRD-11 = PRD-DATA, not this file's self-id (SC-01) | none | no; see §21 O-07 |

---

## 20. Execution order

1. **Wave 3 prep (parallel with PRD-FND):** land `resizePanels.ts`, `getPaginationRange.ts`, `commandScore.ts`, `parseAppShellCookie.ts` as pure modules with their unit tests (no foundation dependency). Hand the accepted E-22 4.1.1 fix to PRD-TRUST (NAV-015); land the deferred E-15 fix on the 4.2 train (NAV-143; SC-36).
2. **Tokens and CSS skeleton:** submit the `--ag-app-shell-*` rows to PRD-DS (NAV-009; SC-18); author `app-shell.css` grid + container queries; build the `layout.spec.ts` geometry assertions against a static HTML fixture first (proves REQ-NAV-02..07 before React).
3. **AppShell frame (server):** `AppShell.Root/Main/PageHeader/SkipLink`, `TopBar`, `StatusBar`, `MobileShell`; `ssr.test.tsx`; landmark inventory tests.
4. **State islands:** `appShellStore`, toggles, `Controller`, cookie persistence; hydration spec on the Next canary.
5. **Sidebar:** inline states, rail tooltips, collapsible groups, then `SidebarDrawer` once PRD-09 `Sheet` is certified; APG sidebar script.
6. **ResizablePanels:** component over the reducer; pointer/touch/keyboard; persistence; splitter APG script; drag perf spec. Then `Inspector` (docked/floating/sheet) on top of it.
7. **Tabs** (Base UI) with indicator motion; then **TabBar** (navigation semantics first, tabs semantics second, minimize-on-scroll last).
8. **Breadcrumbs** (server) and overflow island; **Pagination**.
9. **Command** and **CommandPalette** (after PRD-09 Dialog); virtualization; 5,000-item perf spec.
10. **SourceTransition** (after PRD-06 optics-drop contract).
11. **Metadata, stories and registry content:** per-component `*.meta.ts` plus the re-exporting aggregates, the component story files (S-01..S-08) on the PRD-SB contract, the `app-frame` block and `app-shell-workspace` item content, and the shell parts of the PRD-SB showcases. PRD-SB deletes `AppChromeVisualBaseline.stories.tsx` and the alias stories (SB-092, SB-106).
12. **Certification run (remote):** full environment matrix, pixel gates, a11y, motion and perf lanes; calibrate and freeze §16 budgets at alpha.
13. **Migration:** `migration` fields in every `*.meta.ts`; the `app-shell-slots` transform and fixtures on the PRD-DX engine; compat prop tables; codemod fixtures for every §7 name; frozen 4.x fixture pass; `doctor --v5` selectors.
14. **Removal:** one revertable PR per family in §9 (shell, sidebar, header/nav, tabs, tab bar, breadcrumbs, pagination, command, split/resizable, source transition, inspector, workspace), each after its `deprecations.json` entry has shipped in 4.2/4.3.
15. **Manual lane and sign-off:** screen-reader and touch scripts, human visual review of the six shells; close AC-NAV-20/21.

---

## 21. Open items

Reconciled against `prd/_shared-contracts.md` and `prd/_verification-remaining-concerns.md` (§NAV) on 2026-10-06. Resolved in this revision: PRD numbering (Key field, SC-01); the 4.1.1 scope of E-22/E-15 (SC-36); the blur-budget source of truth (SC-38: NAV owns ≤3, PERF changes); the two size rows (SC-15: both rows kept, distinct names); the S-01 story file and titles (SC-31, PRD-SB title contract); registry ids (SC-32); token, motion-name, `ScrollEdge` and metadata contracts (SC-18, SC-19, SC-22, SC-27); and removed 4.x scripts (SC-39). The items below cannot be closed from this file.

| # | Item | Owner | How to close |
|---|---|---|---|
| O-01 | Base UI capability checks are not verified: active-tab CSS variables for the `Tabs.Indicator` fallback, Combobox inline-list mode for `Command` (REQ-NAV-58), and whether `@supports (animation-timeline: scroll())` is a sufficient guard for `minimizeOnScroll` in WebKit and Gecko (REQ-NAV-48). | NAV | At 5.0.0-alpha.1, against the Base UI version pinned by FND-001, add a spike test for each capability to NAV-067, NAV-088 and NAV-077. If a capability is missing, record the fallback in REQ-NAV-41/58/48 before the beta. |
| O-02 | Medium containers (600–1023px): REQ-NAV-10, REQ-NAV-20 and AC-NAV-16 do not decide whether the toggle opens the modal `SidebarDrawer` or expands the sidebar inline over `Main`, or how the post-hydration ARIA update reads. Proposed default: inline expansion over `Main` (non-modal, `aria-expanded` on the toggle, Escape collapses back to rail through `LayerStack`), keeping the modal drawer for compact containers only. | NAV (design review) | A design-review decision recorded in `docs/release/decisions/` (SC-35). Then update REQ-NAV-20/22 and the NAV-042/044 acceptance. Record it as a `gate` on NAV-042 until signed. |
| O-03 | E-22 is accepted into 4.1.1, but PRD-TRUST has no task for it yet. | TRUST | PRD-TRUST adds the task to its §scope and `tasks/TRUST.json` (SC-36 "Must change"), using the NAV-015 handover. NAV-015 is done when that task id exists. |
| O-04 | The S-01 Storybook ids become `flagships-app-shell-appshell--saas` and `flagships-app-shell-appshell--ai-command-center` under the PRD-SB title contract. PRD-PERF (REQ-PERF-35, AC-PERF-09, `:327`) and PRD-QA still cite `app-shell--saas` / `app-shell--ai-command-center`. | PERF, QA (SB confirms the id form) | PRD-PERF and PRD-QA update their subject ids, or PRD-SB records an id alias in `storySort`/index. The `storybook-index.test.mjs` check (PRD-SB) asserts the ids exist. |
| O-05 | PRD-SB SB-085 creates contract stories for flagships 22–31, which duplicates this PRD's component story files (NAV-101). SC-31 says SB creates no component story files. | SB | SB-085 becomes a contract check over the NAV story files (the same change SC-31 applies to SB-076). |
| O-06 | PRD-DS has no task that lands the `--ag-app-shell-*` rows (NAV-009 is a row request; SC-18). DS-034 also says `comp.*` tokens are "added by flagship PRDs", which conflicts with SC-18. | DS | PRD-DS adds a values-only token task (in `tokens/sys/` or `tokens/comp/`, which DS chooses) that depends on NAV-009 for the values. NAV-010 then adds that DS task id to its `depends_on`. |
| O-07 | REQ-EXP-21 assigns the ledger gaps X-16 (DateTimePicker), X-25 reorder and X-26 inline edit to "PRD-11". That is §16 PRD-11 = PRD-DATA, not this file. The verification note listed them under PRD-11 ambiguously. | EXP, DATA | PRD-EXP rewrites the owner column to `PRD-DATA` (SC-01). This PRD takes no action. |
| O-08 | PRD-REL must register the NAV area codemod id `app-shell-slots` in its §11.2 catalogue and schema enum (SC-33). PRD-DX DX-041 `DEFAULT_ORDER` must include it. | REL, DX | REL §11.2 and `catalogue.json` (DX-042) list `app-shell-slots`. NAV-145 is blocked until that happens. |
| O-09 | PRD-DX DX-071 still has action CREATE on `registry/blocks/app-frame/`, while SC-32 makes NAV the content owner (NAV-106) and DX registration-only. It also cites `PRD-11` in `depends_on`. | DX | DX-071 becomes a registration-only task (scaffold, `registry.json` entry, lint) with `depends_on` NAV-106. |
| O-10 | The visual claims in §2.2 rest on the metrics JSON. The screenshots in `autopsy/remote-evidence` were not viewed. | NAV | The Manual lane (AC-NAV-20, NAV-139) is the gate. A reviewer views the screenshots at the first remote certification run and records the result in the NAV review sheet. |
