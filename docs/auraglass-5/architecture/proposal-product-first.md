# AuraGlass 5.0 Target Architecture: Product-First Proposal

Angle: design from the product surfaces developers actually ship (AI, data, workspace, navigation, overlays, media) inward. Each layer below the surfaces exists only because a named flagship component needs it. Anything no flagship needs is removed, extracted, or moved to `labs`.

Status: proposal. Written 2026-10-06 against `aura-glass` 4.1.0 (HEAD `15b6de6f7`). No source was modified.

---

## 0. Evidence base and limits

Inputs read in full:

- Autopsy: `material-engine.md`, `packaging-ssr-dx.md`, `accessibility.md`, `appshell-workspace-recipes-cli.md`, `motion.md`, `tokens-theme.md`, `hooks-utils-types.md`, `runtime-local.md`, `server-services-ai.md`, `storybook-showcase.md`.
- Research: `apple-liquid-glass.md`, `web-glass-techniques.md`, `translucent-a11y-perf.md`, `competitors.md`.
- Inventory: `autopsy/inventory/shard-*.json`, summarized with node instead of read raw. That gives 480 component records across 27 shards. **`shard-04.json` is missing**, so about 18 records listed in `_shards.json` have no disposition.

Not yet available when this was written: `qa-certification`, `history-hygiene`, `api-consistency`, `docs-readme`, `performance`, `visual-quality`. Decisions that depend on them are marked **[pending report]**.

Inventory summary (computed):

| Disposition | Count |
|---|---|
| REMOVE | 146 |
| CONSOLIDATE | 158 |
| REDESIGN | 70 |
| POLISH | 46 |
| DEPRECATE | 26 |
| REPLACE | 24 |
| KEEP | 10 |

Mean overall score is 3.0/10. Only 10 records are KEEP, and 23 are flagged `flagship_candidate`. The highest-scoring KEEP/POLISH records are low-level pieces:

- Portal 6.5
- Slot 6.0
- DismissableLayer 6.0
- FocusScope 5.5
- GlassPageTabs 6.0
- LiquidGlassConcentricFrame 6.0
- LiquidGlassScrollEdge 5.5
- GlassTimeField / GlassDateField 6.0 / 5.5
- AuroraBackground 6.5

The best assets are small primitives and a handful of media and Liquid surfaces. No flagship component exists today.

Key claims I checked myself against source:

- `package.json`:
  - `react >=18.0.0 <20.0.0` peer.
  - 47 export subpaths.
  - 24 `dependencies`, including express, socket.io, openai, pinecone, redis, @sentry/node and bcryptjs.
  - `sideEffects: ["*.css","src/styles/**/*"]`.
  - No `"type"` field.
- `src/primitives/Slot.tsx:76` reads `child.ref` (the React 19 removed path; PACKAGING-SSR-DX-11).
- `src` imports no Radix, React Aria, Base UI or Floating UI. All behavior is hand-rolled.
- `bin/aura-glass.cjs:911` prints "3.2 target: No MUI, Radix, or Lucide required for core UI." This proposal deliberately reverses that stance for headless behavior (see §4).

Visual evidence is pixel statistics only. Screenshots could not be viewed in this environment. The storybook autopsy found 345 of 356 certification captures at least 90% achromatic near-white (STORYBOOK-SHOWCASE-01).

---

## 1. Thesis

AuraGlass 4.1 is a 1,073-export catalog (PACKAGING-SSR-DX) with no working material engine (MATERIAL-ENGINE-01..05), no working contrast system (ACCESSIBILITY-01/02), no motion language (MOTION-06), and no product surfaces. Its AI components are simulations (SERVER-SERVICES-AI-10/11). Its app shell renders the sidebar stacked above the content at 1440px (APPSHELL-WORKSPACE-RECIPES-CLI-01). Measured adoption is 156 downloads/week (`competitors.md` §2).

That last number matters. The installed base is small, so a clean break is cheap, and 5.0 should be designed for the next adopter, not the current one.

The open market position (`competitors.md` §1.4, §5) is **the accessible, production-grade, liquid-glass application kit**. No serious library ships it. shadcn, Base UI and React Aria have no material. liquid-glass-react is one wrapper component with no a11y and no Safari or Firefox displacement.

To win that position, AuraGlass 5.0 has to:

1. Ship about 45 flagship components and 10 app surfaces that look premium **over real content**, and are keyboard, screen-reader and contrast correct by construction.
2. Get behavior from an adopted headless foundation instead of hand-rolled code. 4.1's own widgets fail APG in exactly the places a library would (ACCESSIBILITY-06, -07, -08, -12, -13, -15, -16).
3. Own only what nobody else has: **the material**, its tokens, its tiers, and its legibility guarantees.
4. Distribute like 2026 libraries do. That means a tree-shakeable, RSC-correct npm package for components, plus a shadcn-compatible registry for page-level surfaces.

---

## 2. Product surfaces drive everything

### 2.1 The six app surfaces

These are the screens developers actually build. Each one is a registry block (§6.3) and a certification scene (§13).

| Surface | What it is | Flagships it pulls in | Why (evidence) |
|---|---|---|---|
| **AI workspace** | Thread + composer + tool calls + sources + agent steps, in an app shell with an inspector | Thread, Message, StreamingText, Composer, ToolCall, SourceList, Reasoning, AgentSteps, AppShell, Inspector, CommandPalette | 4.1 has zero AI-product primitives (SERVER-SERVICES-AI-11). shadcn shipped chat in June 2026 and MUI has x-chat (`competitors.md` §1.3). This is now table stakes. |
| **Data workspace** | Filterable, sortable, virtualized table, detail sheet, bulk actions | Table, FilterBar, Select, Combobox, Sheet, Toolbar, Pagination, EmptyState, Menu | GlassDataGrid is "not a grid" (ACCESSIBILITY-15). 3 table implementations exist (APPSHELL dup table). Tremor is stagnant, so the dashboards niche is open (`competitors.md` §3 Tremor). |
| **Analytics dashboard** | KPI row, charts, activity, date range | StatCard, Sparkline, Chart (line/area/bar/donut), DatePicker, SegmentedControl, Timeline | 13 chart-internal records, 7 REMOVE (inventory). chart.js is shipped to every root import (PACKAGING-SSR-DX-02). |
| **App frame and navigation** | Top bar, collapsible sidebar, mobile drawer, tab bar, breadcrumbs, command palette, settings | AppShell, Sidebar, TopBar, TabBar, Tabs, Breadcrumbs, CommandPalette, Menu, Switch, RadioGroup | Two incompatible `GlassAppShell`s and missing grid CSS (APPSHELL-01, -06). "navigation" has 44 records, the largest category in the inventory. |
| **Overlays** | Dialog, sheet with detents, popover, menu, tooltip, toast, stacked correctly | Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, Toast | Escape closes every stacked dialog (accessibility §4, GlassDialog). Overlays are where Liquid Glass's "control layer" rule applies most (`apple-liquid-glass.md` §2.5). |
| **Media** | Player chrome over video, now-playing bar, photo inspector, carousel | MediaControls, NowPlayingBar, ImageViewer, CarouselRail | LiquidGlassMediaControls/NowPlayingBar/PhotoInspector (5.5 POLISH) are among the best-scored components. This is the one legitimate place for the `clear` variant (`apple-liquid-glass.md` §2.6). |

### 2.2 The rule that follows from the surfaces

Liquid Glass is a **control and navigation layer** material. Content uses content material (`apple-liquid-glass.md` §2.5, HIG Materials; NN/g critique in `translucent-a11y-perf.md` §4).

The runtime autopsy shows what happens without this rule. The 4.0 to 4.1 "harden neutral glass" change dropped GlassCard and GlassButton fill to `rgba(255,255,255,0.018)`, and legibility now depends entirely on the backdrop (`runtime-local.md` §4). So in 5.0:

- Bars, toolbars, tab bars, sidebars, popovers, menus, sheets and floating controls default to glass (`regular`).
- Cards, tables, threads and forms default to a **content plate**: `regular` material at `thickness="thick"` with a high opacity floor, or `solid`. They can opt into lighter glass, but they never go below the contrast floor (§8).
- Glass on glass is collapsed automatically (§7.5).

---

## 3. Component taxonomy and the flagship tier

### 3.1 Tiers

| Tier | Meaning | Certification | Count |
|---|---|---|---|
| **Flagship** | Named, designed, documented, shown in surfaces | Full model (§13), including manual screen-reader and touch passes | 46 |
| **Core** | Supporting public components | Automated gates only | ~40 |
| **Foundation** | Material, layout, a11y and behavior building blocks | Unit, SSR and visual-matrix gates | ~15 |
| **Labs** | Experimental, outside semver, separate package | None | Whatever survives REMOVE |

Root public API target: **about 250 named exports**, down from 1,073. There are no aliases. The `Glass` prefix is dropped (`Button`, not `GlassButton`), because every AuraGlass component carries the material by definition. 4.x names live only in `aura-glass/compat` (§12).

### 3.2 Flagship components (46)

Lineage cites the inventory record (disposition and overall score) that the 5.0 component absorbs. "Base UI" and "RA" give the behavior source (§4).

**Controls (14)**

| 5.0 component | Behavior | Absorbs (inventory) |
|---|---|---|
| `Button` (+ `IconButton`, `pressed` toggle) | Base UI Button / Toggle | GlassButton, EnhancedGlassButton, RippleButton, GlassLinkButton, ToggleButton (REPLACE 2.5) |
| `ButtonGroup` / `Toolbar` | Base UI Toolbar | LiquidGlassControlGroup (REDESIGN 4.4), LiquidGlassToolbar (CONSOLIDATE 3.5) |
| `SegmentedControl` | Base UI ToggleGroup (single) | GlassSegmentedControl (REDESIGN 4.3), LiquidGlassSegmentedControl, ToggleButtonGroup (REPLACE 3) |
| `Switch` | Base UI Switch | GlassSwitch (POLISH 5.3; drop the shimmer loop, MOTION-12) |
| `Checkbox`, `CheckboxGroup` | Base UI Checkbox / CheckboxGroup | GlassCheckbox (REDESIGN 3), GlassCheckboxGroup (3.5) |
| `RadioGroup` | Base UI Radio | GlassRadioGroup (REDESIGN 3.5) |
| `Slider` | Base UI Slider | GlassSlider (REDESIGN 3.3; no keyboard, ACCESSIBILITY-06) |
| `TextField` (input + textarea, one field shell) | Base UI Field / Input | GlassInput (POLISH 4.5), GlassTextarea (REDESIGN 4.3), GlassFieldGroup (POLISH 6), GlassValidationMessage (POLISH 5.5) |
| `SearchField` | Base UI Input + clear affordance | LiquidGlassSearchField (REDESIGN 4.8) |
| `Select` | Base UI Select | GlassSelectCompound (REDESIGN 5.2, flagship candidate) |
| `Combobox` (single and multi, with chips) | Base UI Combobox | GlassCombobox (best APG implementation in 4.1, accessibility §3), GlassMultiSelect (CONSOLIDATE 6.0) |
| `NumberField` | Base UI NumberField | GlassStepper (REPLACE 3) |
| `DateField` / `TimeField` | RA `useDateField` / `useTimeField` | GlassDateField (KEEP 5.5), GlassTimeField (KEEP 6.0). Keep their visuals and move their segments onto RA. |
| `DatePicker` / `DateRangePicker` | RA Calendar + Base UI Popover | GlassDatePicker (fails APG, ACCESSIBILITY-08) |

**Overlays (7)**

| 5.0 component | Behavior | Absorbs |
|---|---|---|
| `Dialog` | Base UI Dialog | GlassModal (REDESIGN 5.0), GlassDialog |
| `AlertDialog` | Base UI AlertDialog | modal confirm variants |
| `Sheet` (side or bottom, detents, opacity rises at full height) | Base UI Dialog + own detent logic | GlassDrawer, LiquidGlassAdaptiveSheet (CONSOLIDATE 3.5), GlassMobileNav |
| `Popover` | Base UI Popover (Floating UI inside) | GlassPopover (REDESIGN 4), Positioner (REPLACE target: Floating UI) |
| `Tooltip` | Base UI Tooltip | GlassTooltip (REDESIGN 3) |
| `Menu` (+ `ContextMenu`, `Menubar`) | Base UI Menu / ContextMenu / Menubar | GlassDropdownMenu (POLISH 5.0, flagship candidate), GlassContextMenu (REPLACE 2), GlassMenubar (REPLACE 2), HeaderUserMenu, LiquidGlassPopoverMenu |
| `Toast` | Base UI Toast | 3 toast systems (GlassToast REDESIGN 3) |

**Navigation and app frame (9)**

| 5.0 component | Behavior | Absorbs |
|---|---|---|
| `AppShell` (TopBar, Sidebar, Main, Inspector, StatusBar slots) | Own layout (CSS grid + container queries), Base UI Dialog for the mobile drawer | Both GlassAppShells (REDESIGN 4.5 / 3), ZSpaceAppLayout, GlassResponsiveNav (REPLACE 3) |
| `Sidebar` (collapsible rail and panel, controlled or uncontrolled) | Own + Base UI Collapsible | GlassSidebar (REPLACE 3.2), GlassSidebarRail/Panel, LiquidGlassInsetSidebar |
| `TopBar` | Own (server-safe frame, client slots) | GlassTopBar (REDESIGN 4), GlassHeader (REDESIGN 2), GlassNavigation (REPLACE 2) |
| `Tabs` | Base UI Tabs | GlassPageTabs (KEEP 6.0, visual reference), GlassTabs (REDESIGN 5.0), GlassWorkspaceTabs (REPLACE 2) |
| `TabBar` (mobile bottom, with accessory) | Base UI Tabs or nav links | LiquidGlassTabBar (REDESIGN 3.8), GlassBottomNav, LiquidGlassBottomAccessory |
| `Breadcrumbs` | Own (server-safe nav + list) | GlassBreadcrumb, app-shell GlassBreadcrumbs |
| `Pagination` | Own | GlassPagination (REDESIGN 2) |
| `CommandPalette` (+ headless `Command`) | Base UI Combobox inside Dialog | GlassCommandPalette (CONSOLIDATE 4.0), GlassCommand (3.5), LiquidGlassCommandSurface |
| `ResizablePanels` | Own (pointer events, container-relative math, ARIA separator, keyboard) | GlassSplitPane (REDESIGN 3.5; viewport math bug, APPSHELL-12), GlassResizablePanel (fake, APPSHELL-13) |

**Data (8)**

| 5.0 component | Behavior | Absorbs |
|---|---|---|
| `Table` (sort, select, column visibility, virtualization, sticky header) | `@tanstack/react-table` + `@tanstack/react-virtual`. Native `table` semantics; `grid` mode only when cell navigation is enabled. | GlassDataTable (REDESIGN 3.3, 6 conscious/predictive variants REMOVE), GlassDataGrid (CONSOLIDATE 5.0), GlassVirtualTable (DEPRECATE), GlassVirtualList (REPLACE 3) |
| `FilterBar` (+ chip filters) | Own over Base UI ToggleGroup / Popover | GlassFilterBar (POLISH 5.2), GlassFilterPanel (REDESIGN 4.1), GlassChip (REDESIGN 4.1) |
| `StatCard` | Server-safe | GlassStatCard / KPICard / MetricCard / MetricChip (all CONSOLIDATE ~4–4.5) |
| `Sparkline` | Server-safe SVG | GlassSparkline (POLISH 5.0) |
| `Chart` (line, area, bar, donut; one scale engine) | Own SVG on `d3-scale` / `d3-shape` | GlassChart (REDESIGN 2.2), Line/Area/Bar/Pie (CONSOLIDATE ~3). Drop chart.js (GlassDataChart DEPRECATE). |
| `TreeView` | RA `Tree` | GlassTreeView + TreeView (no keyboard, ACCESSIBILITY-07), GlassFileTree |
| `Timeline` / `ActivityFeed` | Server-safe list | GlassTimeline (POLISH 4.0), GlassActivityFeed (REDESIGN 4.0) |
| `EmptyState` / `LoadingState` / `ErrorState` (+ `ProviderUnavailable`) | Server-safe | GlassEmptyState (POLISH 5.3), GlassLoadingState (POLISH 5.0). Turns the `ProviderUnconfiguredError` pattern into UI (server-services-ai §Keep). |

**AI (8)**, in `aura-glass/ai`, presentational only

| 5.0 component | Notes |
|---|---|
| `Thread` (`role="log"`, scroll anchoring, jump-to-latest) | Seeds: GlassMessageList `role="log"` (server-services-ai §Keep, REDESIGN 4.0) |
| `Message` (roles user, assistant, system, tool; parts model) | Replaces human-chat GlassChat (REDESIGN 2.5) |
| `StreamingText` (incremental render, batched polite announcements, reduced-motion caret) | New |
| `Composer` (attachments, stop/regenerate, submit shortcuts, IME-safe) | GlassChatInput (REDESIGN 3) |
| `ToolCall` (queued, running, succeeded, failed, needs-approval; args/result disclosure; approve/deny) | New |
| `SourceList` / `Citation` (hover card on Base UI PreviewCard) | New |
| `Reasoning` (collapsible disclosure, duration) | New |
| `AgentSteps` (step timeline + status) | GlassTypingIndicator (POLISH 4.3) becomes its status atom |

**Media (4)**: `MediaControls`, `NowPlayingBar`, `ImageViewer` (lightbox on Dialog), `CarouselRail` (APG carousel on scroll-snap). Sources: LiquidGlassMediaControls / NowPlayingBar / PhotoInspector (POLISH 5.5), LiquidGlassCarouselRail (POLISH 5.0), GlassImageViewer (POLISH 4.2), GlassCarousel (REPLACE 2.5).

Total: 14 + 7 + 9 + 8 + 8 + 4 = **50 entries, 46 distinct flagship families** after merging DateField/TimeField and the paired rows.

### 3.3 Core (not flagship, ~40)

Card, Badge, Avatar (+Group), Progress (linear, ring), Meter, Skeleton, Separator, Kbd, Accordion (heading + button pattern, fixes ACCESSIBILITY-16), Collapsible, Alert (GlassAlert POLISH 5.8), Rating, InlineEdit, KeyValueEditor, FileUpload, ColorPicker, Avatar, DescriptionList, Link, ScrollArea (native overflow + ScrollEdge), Form helpers (Field, Fieldset, Form, with an optional `react-hook-form` adapter in registry, not a dependency), Tour/Coachmarks (on Popover), Kanban (on dnd-kit, registry only), CodeSurface (registry item that lazy-loads CodeMirror or Shiki; GlassCodeEditor REPLACE), DiffViewer (registry).

### 3.4 Foundation (~15)

`Surface`, `SurfaceGroup`, `ScrollEdge`, `Backdrop` (+ presets), `Text`, `Heading`, `Icon` set, `Stack`, `Grid`, `Container`, `VisuallyHidden`, `Portal`, `FocusRing` contract (CSS only), `AuraGlassProvider`, `AuraGlassScript`, `usePreference`.

---

## 4. Headless and a11y foundation: adopt Base UI, add React Aria where it is better, build only the material

### 4.1 Decision

- **Primary: Base UI (`@base-ui/react`)** for every overlay, menu, select, combobox, tabs, slider, switch, checkbox, radio, toggle-group, toolbar, number field, toast, collapsible, preview card, scroll area and field.
- **Secondary: React Aria hooks** (individual `@react-aria/*` / `react-aria` packages plus `@internationalized/date`), only for:
  - date and time fields, calendar and date-range picker;
  - tree;
  - drag and drop (Kanban, sortable lists, in registry items);
  - table keyboard-grid mode, if Base UI has no equivalent.
- **Build our own** only for the things neither library does: material and surface rendering, AppShell layout, ResizablePanels, Sheet detents, AI primitives (composition of Base UI parts plus our own semantics), and charts.
- **Radix: not adopted.** Compatibility only, through the CLI `migrate radix` codemod, which already exists in report mode (`bin/aura-glass.cjs:587-613`). Its target becomes AuraGlass 5 components.

### 4.2 Justification

1. **Hand-rolled behavior has failed in 4.1.** These widgets break APG today:
   - Slider: no keyboard (ACCESSIBILITY-06).
   - Both tree views: no keyboard (-07).
   - Date picker: no dialog or grid pattern (-08).
   - Menubar and context menu: wrong Escape and tab stops (-12).
   - Tabs: duplicate IDs and a navigation landmark (-13).
   - Data grid: not a grid (-15).
   - Accordion: tab roles (-16).

   Four focus traps, three announcers and three skip-link implementations exist (accessibility §6). Even after five releases, the "No Radix" stance (`bin/aura-glass.cjs:911`) did not produce an accessible widget set. The inventory's own REPLACE targets already point outward: Positioner to Floating UI, Slider to "Radix Slider / react-aria useSlider", NumberField to "react-aria useNumberField", VirtualList to TanStack Virtual, RichText to Tiptap/Lexical.
2. **Consensus and momentum** (`competitors.md` §1.1, §3):
   - Base UI v1 has been stable since February 2026, at 19.27M downloads/week, ahead of the `radix-ui` umbrella package.
   - It is shadcn's default base since July 2026, and it is MUI's stated focus.
   - Its parts are styled with data attributes, which suits a CSS-variable material engine.
   - Its `render`-prop composition lets our `Surface` own the element.
3. **Why not React Aria as the primary foundation:**
   - It has the deepest interaction model and is the base for HeroUI v3.
   - But its API is verbose, and RAC brings its own render-prop and context conventions.
   - The best-in-class pieces we need (date, calendar, tree, DnD, i18n) are exactly the areas where it clearly beats Base UI, so we take those pieces surgically.
4. **Why not Radix as the primary foundation:** Radix Themes stalled in April 2026 (`competitors.md` §3), and the ecosystem is moving to Base UI. Using it as the primary foundation would lock in the legacy base.
5. **Why not "build everything":**
   - The differentiator is the material (`competitors.md` §5.3), not focus management.
   - Every hour spent re-deriving APG is an hour not spent on the thing no competitor has.

### 4.3 Rules that keep the foundation swappable

- **No Base UI or React Aria types in the public API.** AuraGlass exports its own prop types. Behavior libraries are implementation details behind our compound parts (`Select.Root`, `Select.Trigger`, …). That keeps a future swap, or an RA-based build, a minor change.
- One `Portal` container and one layer stack. Base UI's portals are pointed at `<AuraGlassProvider>`'s portal root so z-order, scroll lock and Escape stacking are coherent. This fixes the GlassDialog document-level Escape bug (accessibility §4).
- IDs always come from `useId` (from React or the foundation), never from `Math.random()` (PACKAGING-SSR-DX-08: 540 `Math.random` call sites).
- Base UI is an exact-pinned dependency of `aura-glass`, so we own and test one copy, and Renovate bumps it. React Aria packages are dependencies of the subpaths that need them (`/date` code lives in root but is tree-shaken; see §6). Tradeoff: an app that also uses Base UI directly may get two copies. The doctor command (`bin/aura-glass.cjs` `doctor`) gets a duplicate-Base-UI check next to its duplicate-React check.
- **[verify at alpha]** I believe Base UI 1.8 has no Calendar, Tree or DnD; that is why RA is used there. If Base UI ships them first, prefer Base UI and drop the RA dependency.

---

## 5. What the flagships minimally need from the material layer

Working backward from §3:

| Need | Who needs it | Infra |
|---|---|---|
| A glass surface that reads over any content | All bars, overlays, controls | `Surface` with `regular` material and a contrast floor (§7, §8) |
| A clear surface over media | MediaControls, NowPlayingBar, ImageViewer chrome | `clear` material with mandatory dim scrim |
| A content plate | Card, Table, Thread, forms | `regular` + `thick` (high floor) or `solid` |
| Nested collapse | Input inside Dialog, Button inside Toolbar, Card in AppShell | Automatic inner material (§7.5) |
| Grouped controls share one backdrop | Toolbar, SegmentedControl, TabBar | `SurfaceGroup` |
| Scroll edge under floating bars | TopBar, TabBar, Sheet header | `ScrollEdge` (from LiquidGlassScrollEdge POLISH 5.5) |
| Concentric radii | Buttons in toolbars, items in menus, inputs in cards | Shape tokens (from LiquidGlassConcentricFrame POLISH 6.0) |
| A light response to interaction | Button, Tabs, Switch, menu items | Specular and rim modulation (§9) |
| Something worth seeing behind glass | Quickstart, docs, every certification scene | `Backdrop` presets (§6.1 `/backdrops`) |

What no flagship needs, and is therefore not built: IOR numbers, 30 intent × elevation specs, caustics, chromatic props, Houdini, a GPU "refraction" that refracts a fake gradient, device-orientation tilt, and runtime DOM color sniffing (MATERIAL-ENGINE-02, -04, -05, -09; TOKENS-THEME §7).

---

## 6. Package and entry-point structure

### 6.1 One package, honest subpaths, ESM-only

Product-first DX means **one install** (`npm i aura-glass`) with subpaths that each produce their own real modules. Separate npm packages are used only where the peer dependencies are heavy or the code is outside semver.

```
aura-glass
├─ .                      core components (controls, overlays, navigation, app frame, data-light, foundation)
├─ ./material             Surface, SurfaceGroup, ScrollEdge, material types, surfaceProps()
├─ ./primitives           Portal, VisuallyHidden, Slot (internal-grade, documented), usePreference
├─ ./data                 Table, TreeView, Chart family (pulls @tanstack/*, d3-scale, d3-shape)
├─ ./ai                   Thread, Message, StreamingText, Composer, ToolCall, SourceList, Reasoning, AgentSteps
├─ ./media                MediaControls, NowPlayingBar, ImageViewer, CarouselRail, useMediaElement
├─ ./date                 DateField, TimeField, DatePicker, DateRangePicker (pulls @react-aria/*, @internationalized/date)
├─ ./backdrops            Backdrop + presets: aurora, mesh, photo, video, grain (AuroraBackground POLISH 6.5 lineage)
├─ ./motion               optional helpers needing `motion` (layout morphs, drag-release springs)  [optional peer]
├─ ./icons, ./icons/*     one module per glyph; category barrels re-export
├─ ./tokens               generated TS consts + types (server-safe, no React)
├─ ./compat               4.x names → 5.0 components with prop adapters (deprecated on arrival, removed in 6.0)
├─ ./styles.css           core layered CSS
├─ ./data.css ./ai.css ./media.css ./date.css ./backdrops.css
├─ ./tokens.css           tokens only (for non-React or custom stacks)
├─ ./tailwind.css         Tailwind v4 @theme + @utility + @custom-variant bridge
└─ ./package.json

@auraglass/three          R3F scenes (peers: three, @react-three/fiber, @react-three/drei)
@auraglass/labs           unversioned experiments (effects, novelty layouts, generative art); not semver
```

Removed subpaths and why:

| Subpath | Reason |
|---|---|
| `forms`, `data` (old), `navigation`, `overlays`, `marketing` | Root aliases (PACKAGING-SSR-DX-06, HOOKS-UTILS-TYPES-05). `data` is reborn as a real subpath. |
| `workflows` | Alias of `workspace` |
| `client` | Generated stub |
| `ssr`, `server`, `registry`, `StyledComponentsRegistry` | No-op styled-components shims |
| `services/*` | Backend (SERVER-SERVICES-AI-01) |
| `app-shell`, `workspace` | Folded into root; there is now only one AppShell |
| 3 deep utility entries | Not needed |

Rules:

- `"type": "module"`, ESM-only, `.d.ts` per module, `exports` with `types` first and a `default` condition. Node `>=20.19` so `require(esm)` covers CJS consumers. **Risk:** Jest-CJS consumers. If beta feedback shows real breakage, add a CJS build without changing the module graph.
- **No dist file is a bundle.** Output is one file per source module (tsdown/rolldown, or Rollup `preserveModules` + `rollup-plugin-preserve-directives`), with `/*#__PURE__*/` on factory calls (icons, HOOKS-UTILS-TYPES-02).
- `sideEffects: ["**/*.css"]`, and it is *true*: an import smoke test asserts no listeners, intervals, `<html>` mutation, workers or audio (HOOKS-UTILS-TYPES-01, -15).
- **Dependency allowlist (CI-enforced):**
  - `@base-ui/react`, `clsx`
  - subpath-scoped: `@tanstack/react-table`, `@tanstack/react-virtual`, `d3-scale`, `d3-shape`, `@react-aria/*` (date, tree), `@internationalized/date`
  - optional peers: `motion` (only `./motion`)
  - peers: `react`, `react-dom` `^19.0.0`

  Everything else is rejected. That removes express, socket.io, openai, pinecone, redis, ioredis, @sentry/node, bcryptjs, jsonwebtoken, helmet, cors, compression, dotenv, express-rate-limit, zod, chart.js, react-chartjs-2, react-hook-form, date-fns, tailwind-merge and framer-motion (PACKAGING-SSR-DX-01; `runtime-local.md` §3).
- Tarball target: under 2 MB packed, no sourcemaps for non-minified output (PACKAGING-SSR-DX-12, `runtime-local.md` §3: 53% of 49 MB is sourcemaps).

### 6.2 Size budgets (CI-enforced, gzip, peers external)

These targets are to be confirmed in alpha against real Base UI part sizes. **[pending `performance` report]**

| Import | Budget |
|---|---|
| `{ Button }` | ≤ 6 KB |
| `{ Dialog }` | ≤ 18 KB |
| `{ Select }` | ≤ 22 KB |
| `{ Table }` from `/data` | ≤ 40 KB |
| `{ Thread, Message, Composer }` from `/ai` | ≤ 25 KB (markdown renderer not included) |
| single icon | ≤ 1 KB |
| `styles.css` | ≤ 30 KB (4.1: 49.9 KB, budget 35 KB never enforced, PACKAGING-SSR-DX-14) |

Budgets are set **before** measuring and only ever ratchet down. This avoids the 4.1 failure where the tree-shaking budget was set to the observed 1.7 MB (PACKAGING-SSR-DX-02).

### 6.3 Distribution: package for components, registry for surfaces

- **Components ship as a package**, not as copy-in source. The material and a11y guarantees must stay centrally upgradeable. A copied Dialog would fork the material contract and its fixes. This is HeroUI's "living library" position (`competitors.md` §3), and it is correct for a material system.
- **Surfaces ship as a registry**: a shadcn-compatible `registry.json` (CLI v4 schema) with:
  - `registry:base`: the AuraGlass theme (cssVars, fonts if licensed, Tailwind bridge);
  - `registry:block`: the 10 surfaces (§2.1, plus auth, settings & billing, support inbox, mobile settings);
  - `registry:item`: integrations that need third-party dependencies (CodeSurface/CodeMirror, Kanban/dnd-kit, RichText/Tiptap, `react-hook-form` adapter, AI SDK adapter).

  Blocks import from `aura-glass` and contain zero `!important`, zero hex values and zero inline layout styles (APPSHELL-04, -07).
- **Two CLIs, one registry.** `npx shadcn add https://auraglass.dev/r/ai-workspace.json` works. `npx aura-glass init|add|diff|update|doctor|migrate` stays as the opinionated front door. It keeps the existing write safety (`ensureInsideCwd`, `--dry-run`, `--json`; APPSHELL §Keep), and adds peer detection, Next `"use client"` insertion, path-alias awareness and versioned output (APPSHELL-16).
- **Eject.** `aura-glass add button --source` copies one leaf component's source for teams that need ownership. Ejected files are tagged with the version and are checked by `diff`.
- **Agent DX** is expected in 2026 (`competitors.md` §5.7): `llms.txt`, markdown docs per component, and a small MCP server exposing registry search and component docs. **[pending `docs-readme` report]**

---

## 7. Material engine

### 7.1 Concrete types

```ts
// aura-glass/material
export type MaterialVariant = 'regular' | 'clear' | 'solid';      // Apple regular | clear | identity (apple §2.6)
export type Thickness = 'thin' | 'regular' | 'thick';              // derived from size class unless set (apple §2.3)
export type Elevation = 0 | 1 | 2 | 3;                             // shadow + z only; never fill
export type BackdropHint = 'auto' | 'light' | 'dark' | 'media';    // declared, inherited via data attribute (§8)
export type Prominence = 'none' | 'prominent';                     // single accent tint for primary actions (apple §2.7)
export type RenderTier = 'lightweight' | 'standard' | 'enhanced' | 'cinematic';
export type TransparencyMode = 'glass' | 'tinted' | 'solid';       // user/OS axis (§8)

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'aside' | 'header' | 'nav' | 'footer' | 'article';
  render?: React.ReactElement;        // Base UI-style element ownership
  material?: MaterialVariant;         // default 'regular'
  thickness?: Thickness;              // default: size class of the consuming component
  elevation?: Elevation;              // default 1
  prominence?: Prominence;            // default 'none'
  shape?: 'fixed' | 'capsule' | 'concentric'; // apple §2.8
  radius?: RadiusToken;               // fallback radius for concentric
  refraction?: boolean;               // request cinematic tier; ignored where unsupported
  allowNested?: boolean;              // opt out of automatic inner collapse
}

/** For headless parts that render their own element (Base UI `render` prop). Pure, server-safe. */
export function surfaceProps(opts: Omit<SurfaceProps, 'as' | 'render'>): {
  className: string; 'data-ag-material': MaterialVariant; /* …data-ag-* */
};
```

`Surface` is a **server component**: no hooks, no context, no effects. It only emits a class and data attributes. Everything adaptive happens in CSS, keyed off attributes and media queries. This is the fix for MATERIAL-ENGINE-01: in 4.1, JS computes adaptation and a final style merge throws it away. In 5.0 no JS computes it.

Deleted on the way in (MATERIAL-ENGINE §9.7): `OptimizedGlass`, `LiquidGlassMaterial` internals, both `createGlassStyle` functions, `glassFoundation`, `theme/materials.ts`, `glassTokens`, `HoudiniGlassProvider`, `LiquidGlassGPU`, `OptimizedGlassAdvanced`, and every no-op prop. A codemod maps the 166 `OptimizedGlass` and 23 `LiquidGlassMaterial` call sites to `Surface` (counts from material-engine §2).

### 7.2 CSS variable and attribute contract

One class, `.ag-surface`, on every glass-bearing element. This makes fallback and a11y coverage 100% by construction (MATERIAL-ENGINE-07, ACCESSIBILITY-05). A lint rule bans `backdrop-filter`, `backdropFilter` and `rgba(255,255,255,…)` outside `src/material/**`.

```css
@property --ag-blur        { syntax: '<length>';     inherits: false; initial-value: 0px; }
@property --ag-saturation  { syntax: '<number>';     inherits: false; initial-value: 1; }
@property --ag-brightness  { syntax: '<number>';     inherits: false; initial-value: 1; }
@property --ag-tint        { syntax: '<color>';      inherits: false; initial-value: transparent; }
@property --ag-tint-floor  { syntax: '<number>';     inherits: true;  initial-value: 0.6; }   /* min opacity for text-bearing */
@property --ag-rim         { syntax: '<color>';      inherits: false; initial-value: transparent; }
@property --ag-specular    { syntax: '<number>';     inherits: false; initial-value: 0.5; }   /* 0..1 intensity */
@property --ag-light-angle { syntax: '<angle>';      inherits: true;  initial-value: 300deg; }
@property --ag-dim         { syntax: '<number>';     inherits: false; initial-value: 0; }     /* clear-variant scrim */
@property --ag-glass-opacity { syntax: '<number>';   inherits: true;  initial-value: 1; }     /* user dial 0..1 */
```

Attribute contract, read by CSS and by QA tooling:

| Attribute | Values | Set by |
|---|---|---|
| `data-ag-material` | regular, clear, solid | `Surface` / `surfaceProps` |
| `data-ag-thickness` | thin, regular, thick | same |
| `data-ag-elevation` | 0–3 | same |
| `data-ag-prominence` | prominent | same |
| `data-ag-backdrop` | light, dark, media | app sections, `Backdrop`, media components |
| `data-ag-tier` | lightweight, standard, enhanced, cinematic | provider root (auto) or per surface |
| `data-ag-transparency` | glass, tinted, solid | provider root (user/OS) |
| `data-ag-scheme` / `data-ag-contrast` / `data-ag-motion` / `data-ag-density` | see §10 | provider root |

The tint is derived, not painted (`apple-liquid-glass.md` §2.7; tokens-theme §9.2):

```css
/* simplified; the generator emits the full ladder */
.ag-surface[data-ag-material='regular'] {
  --ag-tint: oklch(from var(--ag-sys-canvas) l c h / calc(var(--ag-tint-floor) * var(--ag-glass-opacity)
             + (1 - var(--ag-glass-opacity))));
}
```

### 7.3 Fixed layer stack (no extra DOM)

1. **Backdrop**: `::before` with `backdrop-filter: blur(var(--ag-blur)) saturate(var(--ag-saturation)) brightness(var(--ag-brightness))`. It sits on a pseudo-element, not the host, so the host does not become a backdrop root for descendants (`web-glass-techniques.md` §2, MATERIAL-ENGINE-06).
2. **Tint/fill**: the host background, `var(--ag-tint)`.
3. **Grain**: one shared static 96px AVIF/PNG on `::before` via `background-image`, 2–4%. It is never on the host, because `mix-blend-mode` creates a backdrop root (`web-glass-techniques.md` §5).
4. **Rim and specular**: `::after`, using a `mask-composite` gradient border ring plus a top highlight angled by `--ag-light-angle`.
5. **Inner shadow/depth**: inset shadows on `::after`.
6. **Outer shadow**: on the host, scaled by elevation token. Shadow opacity rises over `data-ag-backdrop="light"` text-heavy regions (apple §2.2).

Removed from defaults: `transform: translateZ(0)`, `will-change`, `contain: paint` (MATERIAL-ENGINE-06), and `transition: all` (MOTION-09; 350 sites).

**Safari custom-property caveat.** Secondary reports say `-webkit-backdrop-filter` does not resolve custom properties (`web-glass-techniques.md` §2, unverified on Safari 26). The generator therefore emits **literal** `-webkit-backdrop-filter` values per (material × thickness × tier) class in addition to the var-driven unprefixed property. Certification includes a Safari pixel check that proves blur is applied. This is the one place literal ladders are justified, and they are generated, not hand-written (contrast MATERIAL-ENGINE-11).

### 7.4 Rendering tiers and budgets

| Tier | What renders | Where it is used | Budget |
|---|---|---|---|
| **lightweight** | No `backdrop-filter`. Tint at fallback opacity (≥ 0.88), rim, shadow. | Reduced transparency, `solid` transparency mode, `@supports not (backdrop-filter: blur(1px))`, nested inner surfaces (§7.5), surfaces over budget, forced colors (system colors) | Paint only |
| **standard** (default) | Layers 1–6, static specular | Every glass surface by default, all engines | ≤ **6** concurrent backdrop surfaces per viewport at `(hover:hover)`, ≤ **3** at `(hover:none)`. Blur by size class: chip 8px, control 12px, bar 20px, panel 28px, sheet 32px. Blur radius is never animated. |
| **enhanced** | Standard + pointer/scroll-driven `--ag-light-angle`, press glow ("illuminates from within", apple §2.4) | Auto when `(hover:hover)` and motion is not reduced | One delegated pointer listener per document, ≤ 1 CSS var write per frame on the hovered surface only, via rAF. **No React state.** (MOTION §Mediocre: per-frame setState) |
| **cinematic** | Enhanced + SVG `feDisplacementMap` edge refraction via `backdrop-filter: url(#ag-lens-…)`, clamped to the outer ~12px bezel band, never under text | **Opt-in only** (`refraction` prop or provider `tier="cinematic"`). Chromium only. | ≤ **2** refracting surfaces per viewport, area ≤ 1/4 viewport each. Displacement maps cached per (size-class × radius × shape) and rebuilt only when the size class changes (`web-glass-techniques.md` §1.1). |

Budget enforcement: a dev-only `SurfaceBudget` observer (an `IntersectionObserver` per surface, rAF-batched) warns in the console when a page goes over budget. In production, surfaces beyond budget drop to lightweight by order of mount (lowest elevation first). The numbers are heuristics (`translucent-a11y-perf.md` §6, `web-glass-techniques.md` §2: no rigorous published benchmark exists). They will be replaced by measured values from the certification perf lane (§13). **[pending `performance` report]**

Tier selection is CSS-first, so server HTML is correct before hydration:

```css
@layer ag.material {
  :root { --ag-tier: standard; }
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    :root:not([data-ag-tier]) { /* enhanced eligible */ }
  }
}
```

JS adds only the cinematic opt-in, the user overrides and the optional device heuristics (`navigator.deviceMemory`, Save-Data). These run after hydration as an attribute flip on `<html>`, so there is no hydration mismatch (fixes the HOOKS-UTILS-TYPES-09/-10 class of bug).

### 7.5 Nesting and groups, without context

- **Automatic inner material (CSS-only):**
  `.ag-surface .ag-surface:not([data-ag-allow-nested])` drops layer 1 (no backdrop filter) and uses a fill-and-rim "inner" material, as Apple does ("avoid glass on glass", apple §2.5).
  - It needs no React context, so `Surface` stays a server component.
  - Portaled overlays are top-level in the DOM, so they correctly stay full glass.
  - This replaces the tracked-but-ignored depth system (material-engine §4: `maxRecommendedDepth` has 0 readers).
- **Dev warning:** a dev-only `MutationObserver` in the provider logs nested surfaces that set `allowNested` at depth ≥ 2.
- **`SurfaceGroup`:**
  - The group owns layer 1 on its own `::before`.
  - Children carry tint, rim and specular only. Adjacent controls therefore share one backdrop and do not double-blur at the seams (`apple-liquid-glass.md` §2.10).
  - Used by Toolbar, SegmentedControl, TabBar and ButtonGroup.
  - Morphing between group members uses View Transitions with the blur removed during the transition (`web-glass-techniques.md` §6).

### 7.6 Refraction per browser

| Engine | Highest tier | Refraction approach |
|---|---|---|
| Chromium | cinematic (opt-in) | SVG displacement backdrop filter, kube.io convex-squircle bezel profile, cached maps, specular rim composited with `feBlend` |
| WebKit (Safari 26/27) | enhanced | No displacement: WebKit bug 245510 is open with unmerged PRs. The lens is suggested with a stronger rim, a highlight band and a 1–2% inner scale of the grain layer. Literal `-webkit-backdrop-filter`. |
| Gecko (Firefox) | enhanced | No displacement: parses `url()` and renders nothing, and `@supports` lies (`web-glass-techniques.md` §1.4). Detection is by engine plus a one-time pixel probe, never `@supports`. |
| Any + forced colors | lightweight | `Canvas` / `CanvasText`, `backdrop-filter: none`, `outline` for edges. Shadows are removed by the UA. |

WebGL, WebGPU and DOM-rasterization are **not** part of the material engine. They are not cross-element, they hit the ~16-context cap and they are fragile (`web-glass-techniques.md` §3). Shader-based glass over *owned* media (hero, video) can live in `@auraglass/three` or `labs`. `LiquidGlassGPU` is deleted (MATERIAL-ENGINE-02).

---

## 8. Adaptive contrast and reduced transparency

### 8.1 The guarantee

Every text-bearing material × scheme × contrast × transparency combination guarantees **WCAG 2.2 AA (4.5:1 body, 3:1 large and non-text) against a worst-case backdrop**. "Worst case" means a two-extreme composite test: the tint at its floor, composited over pure white and over pure black (`translucent-a11y-perf.md` §2.3). Blur never counts toward contrast. APCA is reported as advisory only, because WCAG 3 has no contrast algorithm yet (`translucent-a11y-perf.md` §2.2).

This is computed **at build time** by the token compiler, using the existing correct math in `src/theme/color.ts` (tokens-theme §3 Keep). It fails the build if any pair falls short. It replaces `validateTextContrast() { return true }`, ContrastGuard and `useAutoTextContrast` (TOKENS-THEME-07, ACCESSIBILITY-01..03). The 74 dead ContrastGuard imports and the 13 luminance implementations collapse into one `color` module.

### 8.2 Transparency axis

`data-ag-transparency` is `glass` (default), `tinted` or `solid`. It is resolved from, in order:

1. An explicit user choice (`AuraGlassProvider settings`, persisted), including a **`glassOpacity` 0–1 dial**, mirroring the iOS 27 user slider (`apple-liquid-glass.md` §3).
2. `forced-colors: active` → solid with system colors.
3. `prefers-contrast: more` → tinted, plus a 1px contrasting border and predominantly black/white glyphs (Apple Increase Contrast).
4. `prefers-reduced-transparency: reduce` → tinted ("frostier", higher floor). **Chromium only.** Safari and Firefox never fire it (`translucent-a11y-perf.md` §3), which is why (1) is a first-class product control that apps are encouraged to put in their settings screen. The Settings surface block ships a `GlassAppearanceSetting` pattern.

All four are expressed as CSS (media queries plus attribute selectors in `@layer ag.a11y`). Every surface carries `.ag-surface`, so coverage is total. `prefers-contrast: high` (ACCESSIBILITY-04) is not used; `more` is the standard value.

### 8.3 Backdrop hints instead of sniffing

- Sections declare `data-ag-backdrop="light|dark|media"`. `Backdrop` presets and media components set it automatically.
- Small chrome (TabBar, Toolbar, IconButton) flips glyphs light or dark from the hint. Large surfaces (Sidebar, Menu, Sheet) do not flip; they raise their floor instead (`apple-liquid-glass.md` §2.2).
- `clear` **requires** a dim scrim. It defaults to `--ag-dim: 0.35` when the hint is `light` or `media` and the backdrop is bright (`apple-liquid-glass.md` §2.6). Without a hint, `clear` is rendered as `regular` and a dev warning is logged.
- Runtime sampling is kept only for **library-owned media** (`ImageViewer`, `MediaControls` over a same-origin video poster), computing an average luma once per source. The DOM sampler `useLiquidGlassBackdrop` becomes a dev-time linter. In 4.1 it reads transparent wrappers as black (MATERIAL-ENGINE-08, ACCESSIBILITY-09). In 5.0 the linter skips alpha 0, walks to the first opaque ancestor, and treats any image, video or canvas as `media`.

### 8.4 Focus

- One focus contract in `@layer ag.base`: a 2px two-tone `outline` plus `outline-offset` ring, meeting 2.4.13 AAA by default. `Highlight` under forced colors. Never box-shadow-only (`translucent-a11y-perf.md` §5).
- The Tailwind `focus:outline-none` strings (105) and the two conflicting `.glass-focus` rules are deleted (ACCESSIBILITY-11).
- AppShell exposes `--ag-scroll-padding-top/bottom` from the sticky bar heights so focus is not obscured (2.4.11).
- Touch targets: a 24×24 minimum for every control, and a 44px hit area under `(pointer: coarse)` using pseudo-element hit areas (ACCESSIBILITY-14).

---

## 9. Motion system

### 9.1 Tokens (one source, CSS and TS)

- **Durations:** `instant 90ms`, `micro 120ms`, `small 200ms`, `medium 320ms`, `large 450ms`. Exits are about 30% shorter than entrances.
- **Curves:**
  - `standard` `cubic-bezier(0.2,0,0,1)` and `emphasized-decelerate`, kept from `tokens.css:115-123` (motion §Keep);
  - `exit` (accelerate).
- **Springs:** `snappy` (ζ=1), `smooth` (ζ≈0.9), `fluid` (sheets/drag). They are **compiled to CSS `linear()` easing** by the token compiler, so springs need no JS runtime in core.

The token compiler deletes the 5 duration scales, 16 curves, 25×22 spring values and 106 keyframe names (MOTION-06).

### 9.2 Policy

- `data-ag-motion` is `system` (default, follows the OS), `reduced`, `calm` (keep opacity fades, drop transforms; same vocabulary as Motion UI, `competitors.md` §3), `expressive` or `none`.
- One `usePreference('motion')` hook, built on `useSyncExternalStore` with a shared `MediaQueryList` and a server snapshot of `false`. It replaces at least 10 detectors (MOTION-02, HOOKS-UTILS-TYPES-04).
- There is no provider-level "ignore user preference" mode. `"always-safe"` and 87 `respect*` opt-out props are deleted (MOTION-07).
- Continuous or idle animation is **off** unless `allowContinuous` is set, and it never runs on controls (MOTION-12: the shimmer on Switch).

### 9.3 Material motion vocabulary

- **Hover and press** modulate light, not scale: specular intensity, rim brightness, a press glow that spreads within a `SurfaceGroup`, and a small shadow-depth change. These are opacity changes of pre-composited pseudo-layers. The `scale 1.05 / 0.95` formula and bounce/elastic presets are gone (motion §Mediocre/Outdated).
- **Enter and exit** use Base UI's `data-starting-style` / `data-ending-style` (CSS transitions), so core needs no motion library. Overlays grow from their source control (`transform-origin` from Floating UI's anchor; apple §2.10). Blur is **never animated**: the backdrop layer cross-fades its opacity instead (MOTION-09, HIG "avoid animating into and out of blurs").
- **Morphs** (menu→sheet, tab indicator, segmented thumb) use same-document View Transitions (Baseline since Oct 2025, `web-glass-techniques.md` §6), with the backdrop dropped via `:active-view-transition` during the morph. `aura-glass/motion` (optional `motion` peer) offers FLIP/`layoutId` helpers and drag-release springs for Sheet detents where View Transitions are insufficient.
- **Lint:** no `transition: all`, only `transform` and `opacity` in keyframes on surfaces, delta-time in every rAF loop, no setState per frame.

---

## 10. Token architecture

- **Format and compiler.** One DTCG tree (`tokens/*.tokens.json`, `$value` / `$type`), compiled once into CSS vars, TS consts and types, the Tailwind v4 bridge and the registry `cssVars`. It replaces 9 token sources and 4 "canonical" claims (TOKENS-THEME-01). The types-vs-runtime export test catches the `getPersona` mismatch class of bug (TOKENS-THEME-10).
- **Tiers:**
  - `ref.*`: private OKLCH ramps, blur, radius, duration;
  - `sys.*`: public semantic roles resolved per mode;
  - `comp.*`: narrow, optional component tokens.
- **Material is a composite token type** (`$type: "glass-material"`: blur, saturation, brightness, tint formula, tint floor, specular, rim, grain, fallback fill). There are 3 variants × 3 thicknesses, not 30 intent × elevation specs (TOKENS-THEME §9.2, MATERIAL-ENGINE-09). Intent touches accent, rim and specular color only, never fill.
- **Mode matrix:** `scheme` (light/dark), `contrast` (standard/more), `transparency` (glass/tinted/solid), `motion`, `density` (compact/regular/spacious). Each axis is emitted as an attribute block **and** mirrored in its media query, so it works with no JS. `light-dark()` is used for leaf colors. `.glass-on-light`, `data-bg` and the 21 specificity-war blocks are deleted (TOKENS-THEME §5). Dark mode gets dark glass, tinted from the canvas, not white-alpha over black.
- **Prefix and interop.** `--ag-*` for everything AuraGlass owns. A **shadcn-compatible alias layer** (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius`) is generated both ways:
  - AuraGlass reads them if present, so it drops into an existing shadcn app;
  - AuraGlass emits them, so shadcn and registry blocks (Motion UI and others) inherit the theme (`competitors.md` §5.2).
- **Brand themes:**
  - Personas (10 dark-only palettes, 61/74 variables unused; TOKENS-THEME-13) become 4–6 `ThemePreset`s, each with light **and** dark.
  - `createGlassTheme` keeps its typed API shape (tokens-theme §3 Keep), with real consumers this time.
  - `createBrandTheme(brand: string)` derives accent ramps with relative color syntax.
- **Typography, spacing and shape:**
  - one fluid type scale with "on glass" adjustments (+1 weight step, minimum alpha on muted text over thin);
  - a 4pt spacing base with density multipliers;
  - one radius ladder plus the concentric token `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))`.
- **Font.** The default is the system stack. Aeonik's 12 woff2 files are removed from the MIT package pending license review (PACKAGING-SSR-DX-05, TOKENS-THEME-12). If licensed, they ship as opt-in `aura-glass/fonts` with a NOTICE.

---

## 11. RSC, "use client", and React refs

### 11.1 RSC strategy

- Per-module output preserves per-file `"use client"`. **No barrel carries the directive.** The root `index` is a plain re-export module, so server-safe exports stay server-safe. Fixes PACKAGING-SSR-DX-03, where `dist/index.mjs` line 1 is the only directive and every component is a client reference.
- **Server-safe by design (no hooks, serializable props):**
  - `Surface`, `SurfaceGroup`, `ScrollEdge`, `Backdrop` (static presets);
  - `Text`, `Heading`, `Stack`, `Grid`, `Container`, `Card`, `Badge`, `Kbd`, `Separator`, `Icon`;
  - `StatCard`, `Sparkline`, `Timeline`, `EmptyState`/`ErrorState`, `DescriptionList`, `Breadcrumbs`;
  - the static frame of `AppShell` and `TopBar`;
  - static `Message` content parts;
  - all of `tokens`.
- **Client:** everything with interaction. Compound components put client parts in their own files. For example, `AppShell.Root` is server-safe while `AppShell.SidebarToggle` is client. A page can therefore render a server shell with client islands.
- **Build lint.** It fails when a module uses hooks, context or DOM without the directive, and when a directive appears on a module with no client signal. The inventory found 61 unnecessary directives and 370 in tests (packaging §What exists).
- **Provider.** `<AuraGlassProvider>` (client) holds settings, portal root, toast region and the dev budget and nesting observers. `<AuraGlassScript nonce>` (server) emits a tiny inline script that applies persisted `data-ag-*` preferences before paint, so there is no flash and no hydration mismatch. It is CSP-nonce aware; there is no `new Function` (HOOKS-UTILS-TYPES-17).
- **Fixture.** A Next 16 / React 19.2 fixture imports flagships **from Server Components**, runs `next build` (not only `next dev`) and asserts zero hydration warnings. This fixes PACKAGING-SSR-DX-07: the 4.1 fixture marks every page `'use client'`.

### 11.2 React version and refs

- **Decision:** peer `react` and `react-dom` `^19.0.0`. React 18 users stay on 4.x LTS (§12).
- **Why:**
  - React 19 has been stable since December 2024, and Next 15/16 require it (`translucent-a11y-perf.md` §7.1).
  - The installed base is small (156 downloads/week).
  - Ref-as-prop removes all 450 `forwardRef` calls (packaging §What exists) and fixes `Slot`'s `element.ref` read (`Slot.tsx:76`, PACKAGING-SSR-DX-11).
  - It enables ref-callback cleanup for the ResizeObserver/IntersectionObserver users (AppShell, Table, Thread).
  - Supporting both would mean a version-sniffing shim on every component, for a population that barely exists.
- **Feature floor: 19.0.** 19.2-only APIs (`<Activity>`, `useEffectEvent`) are used only behind capability checks, or not at all.
- **Test matrix:** 19.0.x and latest 19.x. The `scheduler` override and the React 18 devDependency pins are removed (packaging §Outdated). All global `JSX.Element` uses are replaced with `React.JSX.Element`.
- **Compiler readiness:** library code follows the Rules of React and is tested under `babel-plugin-react-compiler`. No precompiled output for now (`translucent-a11y-perf.md` §7.2, unverified guidance).

---

## 12. Styling distribution, removals and versioning

### 12.1 CSS distribution

- Component styling is **authored CSS**, one file per component family, keyed on `ag-*` classes and the foundation's `data-*` state attributes. There are no utility classes in component markup.
  - Evidence: 33 of 94 app-shell utility tokens do not exist in shipped CSS, there is one responsive rule for 168 responsive classes (APPSHELL-01/02), and 105 inert Tailwind focus strings (ACCESSIBILITY-11).
  - CI fails when a `className` token in source has no selector in the built CSS.
- **Cascade layers.** Everything ships inside one top-level layer, so apps can position it:

  ```css
  @layer ag.tokens, ag.base, ag.material, ag.components, ag.a11y;
  ```

  - `ag.a11y` (reduced transparency, contrast, forced colors, reduced motion) is last in our stack. It beats our components, but app layers placed after `ag` can still override it intentionally.
  - Recommended app order with Tailwind v4: `@layer theme, base, ag, components, utilities;`.
  - **No `!important`** anywhere (4.1 has 257; PACKAGING-SSR-DX-04). Lint enforced.
  - No global element selectors (`h1`–`h6`), no Storybook CSS, no utility shim (TOKENS-THEME-06, APPSHELL-05).
- **Tailwind v4 interop.** `aura-glass/tailwind.css` provides:
  - `@theme inline` mapping `sys.*` tokens, so `bg-ag-canvas`, `text-ag-on-glass` and `rounded-ag-control` work;
  - `@utility glass-regular | glass-clear | glass-thin…`, which apply the `.ag-surface` contract to app markup;
  - `@custom-variant ag-dark` and `ag-tinted`.

  Components ship precompiled CSS, so consumers need **no** `@source "../node_modules/aura-glass"` line for components to look right. That avoids the Tailwind v4 node_modules scanning trap (`translucent-a11y-perf.md` §7.3). The zero-Tailwind path (plain CSS import) is first-class.
- `cn` becomes `clsx` only. `tailwind-merge` is removed from core (hooks-utils §Mediocre).

### 12.2 Removed and extracted

| Category | Fate | Evidence |
|---|---|---|
| `server/`, `src/services/**`, `src/lib/ai-client.ts`, `tsconfig.server.json`, hosted scripts, Docker/compose for the API | **Removed** from the package. If still used, moved to a private `@auraone/auraglass-hosted` repo. Grep AuraOne consumers for `aura-glass/services/*` first. | SERVER-SERVICES-AI-01, -03..-09 |
| Simulated AI (GAN, DeepDream, StyleTransfer, GenerativeArt, NeuralWeight, Neuromorphic, AIGlassThemeProvider, ProductionAIIntegration, AIDemo, VoiceGlassDemo) | **Removed** (10 of 11 `ai` records are REMOVE). GenerativeArt/MusicVisualizer go to `labs` at most. | SERVER-SERVICES-AI-10 |
| adaptiveAI, consciousness*, emotionalIntelligence, aiPersonalization, soundDesign, workers/, EyeTracking/Biometric/NeuroSync/SelfHealing/Quantum | **Removed** (import-time side effects, behavior tracking) | HOOKS-UTILS-TYPES-01, -14, -15; "adaptive" 12/12 REMOVE |
| Houdini, LiquidGlassGPU, both `createGlassStyle`, glassFoundation, theme/materials, legacy glassTokens, OptimizedGlassAdvanced | **Removed**; codemod to `Surface` | MATERIAL-ENGINE §9.7 |
| ContrastGuard, useAutoTextContrast, GlassA11yAuditor, GlassA11y simulator | **Removed**; build-time contrast gate replaces them | ACCESSIBILITY-01..03 |
| 5 theme providers, 3 `useGlassTheme`, 10 motion detectors, 4 motion providers | **Collapsed** into `AuraGlassProvider` + `usePreference` | TOKENS-THEME-02/03, MOTION-02, HOOKS-UTILS-TYPES-04 |
| Novelty layouts (Fractal, Orbital, Tessellation, GoldenRatio, Island), effects, atmospheric, HeatGlass, Glass3DEngine, GlassMorphingEngine | **Extracted** to `@auraglass/labs` (effects 10/13, novelty 7/7 REMOVE) | APPSHELL §Fake; material-engine §9.7 |
| AuroraBackground, MeshGradient | **Promoted** to `aura-glass/backdrops` (a product need: glass needs something behind it) | AuroraBackground POLISH 6.5; STORYBOOK-SHOWCASE-01 |
| R3F scenes | **Extracted** to `@auraglass/three` | packaging §Rec 1 |
| `src/client` demo pages, `src/data`, `src/constants`, `glass-api-stable.ts`, report constants exported as API, 90 aliases | **Removed** | PACKAGING-SSR-DX §Fake; HOOKS-UTILS-TYPES-12 |
| chart.js, react-chartjs-2, react-hook-form, date-fns | **Removed** from dependencies (SVG charts, a registry adapter for RHF, `Intl` + `@internationalized/date`) | `runtime-local.md` §2 (date-fns costs 3.9s ESM import) |
| 28 recipes | **Cut to 10** registry surfaces | APPSHELL §Rec 5 |
| Storybook galleries, State Matrix, `LiquidGlassShowcase` (24 `!important`), story-only props (`previewUsers`, `forceVisible`, `isStorybookDataMedia`) | **Removed**; rebuilt as Material Lab, Component Lab and surface showcases | STORYBOOK-SHOWCASE-03, -04, -07 |

### 12.3 Versioning: yes, 5.0 is a hard major

It breaks:

- the export surface (1,073 → ~250 names, prefix dropped);
- the React floor (19);
- module format (ESM-only);
- CSS (layered, `--ag-` prefix, no global element styles);
- dependencies (backend and chart stacks gone);
- behavior (Base UI keyboard models, Card defaults to a content plate).

Calling it a minor or a "compatible major" would repeat the 4.x pattern of claims the code does not support (`runtime-local.md` §4: a "certified green" release with red snapshots).

Migration plan:

- **`aura-glass/compat`** re-exports 5.0 components under 4.x names, with prop adapters for the top ~40 call-site components (`GlassButton`, `GlassCard`, `GlassModal` (`onClose` → `onOpenChange`), `GlassInput`, `GlassTabs`, `OptimizedGlass` → `Surface` …). It is deprecated on arrival, warns once in dev, and is removed in 6.0.
- **`npx aura-glass migrate v5`** is a codemod for renames, `OptimizedGlass`/`LiquidGlassMaterial` → `Surface`, removed-prop deletion, CSS import changes and `forwardRef` removal in user wrappers. Report-first, then `--write`.
- **4.x LTS:** security and critical fixes for 12 months on a `v4` branch. Commit the npm-12 pack-parsing fix first (`runtime-local.md` §6; packaging §Uncommitted).
- **Cadence:**
  - `5.0.0-alpha`: material, tokens, foundation, Button, Dialog, Menu;
  - `beta`: all 46 flagships, 4 surfaces;
  - `rc`: certification green on every flagship;
  - `5.0.0`: 10 surfaces, compat and codemod.
- **API stability labels:** every export is `stable` or `preview`. Preview exports live under `aura-glass/preview/*` and may break in minors. The public API manifest is generated, reviewed and diffed in CI. Duplicate names fail (HOOKS-UTILS-TYPES-12).

---

## 13. Certification model

The 4.1 certification passes when "something with a glass class rendered" (STORYBOOK-SHOWCASE-02). It runs with animations disabled and reduced motion forced (MOTION-08), and never sees anything but white-gray stages (STORYBOOK-SHOWCASE-01). The render gate cannot fail on layout (APPSHELL-03). 5.0 certifies **components over content, on the published tarball, in real browsers, remotely in CI** (per the remote-first execution policy; no local browser or Docker runs).

### 13.1 Environment matrix

There are 8 bundled, licensed backdrops: photo landscape, saturated abstract, dense text document (scrolling), dark media frame, pure white, pure black, high-frequency pattern, and video loop (storybook §Rec 1). Each is crossed with:

- scheme (light/dark)
- transparency (glass/tinted/solid)
- tier (standard, enhanced, and cinematic on Chromium)
- engine (Chromium, WebKit, Gecko)
- viewport (mobile/desktop)

Flagships run the full matrix. Core components run a reduced matrix (3 backdrops × 2 schemes × glass/solid × 3 engines).

### 13.2 Gates (all must pass; evidence is written to a version-named, CI-generated directory and never committed as proof)

| Gate | Checks | Replaces |
|---|---|---|
| **Behavior** | Per-widget keyboard scripts derived from the APG examples, run in a real browser (Playwright), plus stacked-overlay Escape and focus-return tests | jsdom axe smoke tests (190 render with no props, ACCESSIBILITY-10) |
| **Accessibility** | `@axe-core/playwright` with `color-contrast` **on** across the environment matrix, plus emulated `forcedColors`, `contrast: more` and `reducedMotion` | 357 jest-axe files that cannot check contrast |
| **Rendered contrast** | Text contrast measured on rendered pixels over the busiest backdrops, against the build-time guarantee (§8.1). Fails if any sample is below 4.5:1 / 3:1. | ContrastGuard "AA" badge |
| **Material presence** | Backdrop luminance variance under each surface must be above a threshold (catches glass over nothing). Measured blur on Safari proves `-webkit-backdrop-filter` applied. "Independent glass recipes" metric = 1. | DOM-presence check |
| **Visual regression** | Pixel baselines per story × environment × scheme × transparency, approved by review | 498 "certified" targets with no baseline |
| **Layout** | Fail on undefined classes, horizontal overflow, or overlap where side-by-side is expected (rail vs main) | Recipe gate with 48 recorded, ignored issues |
| **Motion** | Under `reducedMotion: reduce`, no rAF or WAAPI activity after settle. Frame-strip capture with motion **enabled** for entrance and morph review. Entrance actually animates (catches MOTION-03). | forced `reducedMotion: true` everywhere |
| **Performance** | Per-component grade (compositor / paint / filter cost), frame-time trace at 4× CPU throttle with N surfaces over video, concurrent-backdrop budget assertion. Grades published per component (MotionScore-style, `competitors.md` §5.4). | none |
| **Bundle** | Per-import gzip budgets (§6.2), dependency allowlist, tarball ≤ 2 MB, publint + `@arethetypeswrong/cli` | 1.7 MB "tree-shaking pass" |
| **SSR/RSC** | `renderToString` + `hydrateRoot` with zero warnings for every export. Next 16 `next build` with Server Component imports. Vite app that renders in a browser. Import-side-effect smoke test. | `next dev` + all-`'use client'` fixture |
| **Manual** (flagship only) | VoiceOver/Safari macOS and iOS, NVDA/Chrome, TalkBack/Chrome, physical iOS and Android touch. Recorded in one living matrix per release. | open issue #16 (ACCESSIBILITY-18) |

### 13.3 Levels

- **Certified (flagship):** every gate passes, including manual.
- **Verified (core):** every automated gate passes.
- **Preview:** behavior and bundle gates pass; shipped under `preview/*`.

The docs site shows each component's level, perf grade and last-certified version, all generated from evidence. No hand-written counts (STORYBOOK-SHOWCASE §Fake: "412", "29", "65").

### 13.4 Storybook becomes the lab

- **Environment toolbar:** the 8 backdrops are the default stage, and the "no decorative backgrounds" rule is deleted (STORYBOOK-SHOWCASE-01).
- **Material Lab:** live material parameters over a scrolling backdrop, tiers side by side, contrast readout.
- **Component Lab:** variant × state × environment matrices generated from typed variant metadata, instead of templated `Variants` stories.
- **Surface stories:** the 10 registry surfaces built from unmodified public components. Lint bans `!important` and `.ag-*` overrides in stories.
- Motion follows the OS by default. It is forced reduced only in the CI snapshot lane.

---

## 14. Open risks and decisions to confirm

1. **Base UI coverage gaps** (calendar, tree, DnD) are assumed, not verified. They decide how much React Aria enters core. Verify at alpha.
2. **Safari `-webkit-backdrop-filter` with custom properties** is unverified on Safari 26/27. The literal-value generator is the mitigation. Certification proves it either way.
3. **Budgets** (concurrent surfaces, blur radii, gzip) are heuristics until the perf lane produces measurements. **[pending `performance` report]**
4. **ESM-only** may hurt Jest-CJS consumers. A CJS fallback is cheap with per-module output.
5. **Card as a content plate by default** will read as "less glassy" in screenshots. It is the correct call per Apple layering and NN/g, and the regression in `runtime-local.md` §4 shows what the alternative does to legibility. The Material Lab and surfaces must make the plate look premium (rim, specular, grain). **[pending `visual-quality` report]**
6. **Downstream AuraOne consumers** of `aura-glass/services/*`, root `GlassAppShell` and 4.x names were not checked. Grep them before deleting, and size `compat` from what they actually use. **[pending `api-consistency` report]**
7. **History and release hygiene** (stale reports, committed evidence JSON, uncommitted pack fix) affects the 4.x LTS branch plan. **[pending `history-hygiene` and `qa-certification` reports]**
8. **AI adapters.** `aura-glass/ai` stays SDK-free. Registry adapters map common streaming message shapes to `Message.parts`. Any AuraOne-hosted generation behind the surfaces routes through Kiro Prism in the consuming app, never in the package (server-services-ai §Rec 8).
