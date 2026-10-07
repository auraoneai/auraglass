# PROMPT-4a (SURF lane W1): App shell and root navigation

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.1–§4.4, §5.2, §5.3, §13 (AppShell product shells), §14, §15, §16, §20 row W1. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` contract-v1.1.
Requirement IDs: REQ-SURF-16..65 (owned); W1 rows of REQ-SURF-01, -03, -07..-14, -170, -171, -188..-196.
Acceptance: AC-SURF-04, -06, -07, -08, -09, -29 (owned); W1 rows of AC-SURF-01, -05, -11, -12, -13, -23, -24, -25, -26.
Tasks: `docs/auraglass-5/tasks/SURF.json` lane `W1`, SURF-001..SURF-133. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_11a..11i_NAV_*.md` (tasks NAV-001..145 re-keyed; `source` field).
Flagships: 22 AppShell, 23 Sidebar, 24 TopBar, 25 Tabs, 26 TabBar, 27 Breadcrumbs, 28 Pagination, 29 CommandPalette/Command, 30 ResizablePanels, 31 SourceTransition.

## Prerequisites

**None** except the frozen contract at C0. Verify once (all exist from C0; if one is missing the contract bootstrap is incomplete — report it, do not create it):

```bash
test -f src/contracts/material.ts && test -f src/contracts/tokens.ts && test -f src/contracts/motion.ts \
 && test -f src/contracts/preferences.ts && test -f src/contracts/components.ts && test -f src/contracts/entries.ts \
 && test -f src/contracts/fragments.ts && test -f src/contracts/testing.ts && test -f contracts/stubs/reference.css \
 && ls tests/contract-doubles/cmp/{dialog,menu,tooltip,collapsible,combobox}.tsx && test -f tests/helpers/index.ts \
 && test -f ci/surf.gitlab-ci.yml && test -f fragments/lanes/surf.ts
```

Seams consumed and what you test against before the real code lands:
S-01/S-02/S-05/S-06 (`materialProps`, `Surface`, `SurfaceGroup`, `ScrollEdge edge/edgeStyle`, `ConcentricFrame` seeds; computed styles via `contracts/stubs/reference.css`), S-03/S-04 (public vars, layer statement), S-12/S-13 (`startMorph` seed calls `update()` synchronously — Tabs indicator and SourceTransition must still be correct on that path), S-21..S-26 (`useLayer({ kind: 'drawer' | 'command-palette' })`, `usePortalContainer('overlay')`, `useAnnouncer`, `GlassPreferencesPanel` for `mobile-settings`), S-30..S-34 (CMP `IconButton`, `Tooltip`, `Menu`, `Sheet`, `Card`, `Toolbar` seeds for structure; Dialog/Menu/Tooltip/Collapsible/Combobox doubles through `tests/app-shell/jest.doubles.cjs` for behaviour), S-35 (`ENTRIES['./app-shell']`, `ROOT_EXPORTS.surf`), S-37 (`warnDeprecated`), S-38/S-39/S-43/S-44/S-45 (fragment schemas), S-40/S-41 (helpers, `parameters.ag`), S-46 (block ids `app-frame`, `mobile-settings`, item `app-shell-workspace`), S-53 (CI fragment). Intra-stream: I-1 `VirtualList` (W2) for `Command` >100 items; I-2 aggregate skeleton.

## May touch (lane W1 exclusive)

`src/app-shell/**`; `src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition}/**`; `src/compat/surf/{app-shell,navigation}/**`; `tests/app-shell/**` (incl. `jest.doubles.cjs`, `compat.test.tsx`, `migration-rows.test.ts`); `tests/e2e/surf/app-shell/**`; `tests/e2e/surf/motion/{tabs-indicator,tabbar-minimize,source-transition}.spec.ts`; `tests/a11y/apg/surf/{sidebar,splitter,tabs,tabbar,breadcrumbs-overflow,command}.apg.spec.ts`; `tests/perf/browser/surf/{app-shell-scroll,sidebar-toggle,resizable-drag,command-5000}.spec.ts`; `tests/rsc/surf/breadcrumbs-server.spec.ts`; `tests/ssr/surf/hydration.spec.ts`; `tests/a11y/manual/{records,scripts}/surf/{app-shell,sidebar,top-bar,tabs,tab-bar,breadcrumbs,pagination,command,resizable-panels,source-transition}*`; `canaries/next16/app/surf/{app-shell,breadcrumbs-server}/**`; `canaries/vite/src/surf/AppShell.page.tsx`; `registry/blocks/{app-frame,mobile-settings}/**`; `registry/items/app-shell-workspace/**`; `tests/capability/registry/{app-frame,mobile-settings,app-shell-workspace}.test.tsx`; `fragments/codemods/surf/fixtures/app-shell-slots/**`; `tests/fixtures/consumer-4x/cases/surf/app-shell/**`; `etc/api/app-shell.*`; `apps/docs/content/surf/{app-shell.md,migration/app-shell.md}`.
Shared (own `lane W1` block only, I-2): `src/root/surf.ts` (Tabs, TabBar, Breadcrumbs, Pagination, CommandPalette, Command, SourceTransition), `src/compat/surf/index.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,review}/surf.ts`, `ci/surf.gitlab-ci.yml`.

## Must not touch

Other lanes' paths (`src/{data,date,charts,ai,media,backdrops,three}/**`, `src/components/timeline/**`, their tests, blocks and items); other lanes' blocks in shared files; every read-only path of the index (`src/index.ts`, `package.json`, `.gitlab-ci.yml`, `.storybook/**`, `certification/**`, `showcase/**`, `registry/registry.json`, `legacy/**`, `src/contracts/**`, `tests/contract-doubles/**`). Never delete 4.x files (PLAT, contract §3.1a) and never edit `release/4.x` code (PLAT); W1's only 4.x write is its block of `fragments/deprecations/surf.ts` on a `4x-surf/*` branch.

## Steps (inside the lane; nothing waits on another lane)

1. **Pure modules** (SURF-001..008): `resizePanels.ts` reducer, `Pagination.getRange` (`src/components/pagination/getRange.ts`), `Command.score` (`src/components/command-palette/score.ts`: case-insensitive, NFD diacritic folding, prefix > word-start > subsequence, never builds a RegExp from input), `AppShell.parseCookie` (pure, server-safe, never throws, >4 KB input). Tests first.
2. **`app-shell.css`** (REQ-SURF-17, -19, -24, -36): `container: ag-app-shell / inline-size`; named areas `"skip skip skip" "side top insp" "side main insp" "side status insp"`; columns `var(--_ag-app-shell-side) minmax(0,1fr) var(--_ag-app-shell-insp)`; `block-size: 100dvh`; `env(safe-area-inset-*)`; exactly three `@container ag-app-shell` conditions (compact <600, medium 600–1023, wide ≥1440; expanded is the base); private defaults only (`--_ag-app-shell-*`, no public `--ag-app-shell-*`, contract §4.2 adaptation); grid columns never transition; `:has(> .ag-top-bar[data-ag-placement=overlay])` writes `--ag-scroll-padding-top`. Geometry spec against a static fixture first, remote.
3. **Server frame** (REQ-SURF-16, -18, -20, -23, -26, -34, -35, -39, -40): `AppShell = { Root, Main, PageHeader, SkipLink, SidebarToggle, InspectorToggle, Controller }`, slots by element type + `data-ag-slot` (memo/HOC safe), one `<main tabIndex={-1}>`, SkipLink first focusable; `TopBar` (`<header>`, banner only as a direct shell child, exactly one MAT `ScrollEdge edge="top"` with `edgeStyle`, dev warning on a second); `StatusBar` (no live role; `Live` through `useAnnouncer`, 1,000 ms debounce, silent on mount); `MobileShell` (`layout="mobile"`, overlay bars write scroll padding). Density is the provider's `data-ag-density` — no `density` prop.
4. **State islands** (REQ-SURF-21, -22, -32): per-root `useSyncExternalStore` store (no context across the RSC boundary), toggles as CMP `IconButton`, ARIA by container mode from one `ResizeObserver` (layout effect, no hydration mismatch), `collapseTo`, `mod+B` only with `shortcut`, cookie `ag-shell-<key>=sidebar:<s>;inspector:<s>; Path=/; Max-Age=31536000; SameSite=Lax`, controlled `Controller`.
5. **Sidebar + SidebarDrawer** (REQ-SURF-27..33): `appearance: 'sidebar' | 'inset' | 'floating'`; `Sidebar.Item` is `<a>` (`render` for router links; `<button>` warns); rail keeps accessible names with CMP `Tooltip`; collapsed = `inert` + `display: none` (never `aria-hidden`); compact/medium → `SidebarDrawer` on Base UI Dialog with `useLayer({ kind: 'drawer', modal: true })`, `usePortalContainer('overlay')`, scrim `--ag-scrim-clear`, closes on Escape (top layer only), scrim click and item activation, restores focus; expanded state restored at ≥1024 px.
6. **ResizablePanels → Inspector** (REQ-SURF-37, -38, -42..-46): container-relative pointer math (rect read once on `pointerdown`), pointer capture, rAF-coalesced `flex-basis` writes, React state only on `pointerup`, one `onLayout` per drag; APG window splitter ARIA and keys; sizes sum 100 ± 0.01; `autoSaveId` read in a layout effect; `stackBelow`. Inspector: docked (wide, `content-sunken`), floating (`chrome regular`), compact CMP `Sheet side="bottom" detents={[0.5, 1]}`.
7. **Tabs → TabBar** (REQ-SURF-47..54): Tabs on Base UI Tabs, no landmark, ids from `useId()` + value, APG keys incl. RTL, indicator through MAT `startMorph` with feature-detected CSS fallback (translate/scale only); overflow mask fade + `scrollIntoView({ block: 'nearest', inline: 'nearest' })` on activation (this is the only allowed `scrollIntoView` outside `src/ai`). TabBar `semantics: 'navigation'` = `<nav>` of links with `aria-current="page"` (no tab roles), `'tabs'` requires panels; `appearance: 'bar' | 'floating'` + `placement: 'inline' | 'overlay'`; one `SurfaceGroup` owns the only backdrop filter; `minimizeOnScroll` via CSS scroll-driven animation only.
8. **Breadcrumbs, Pagination** (REQ-SURF-55..59): server Breadcrumbs `nav > ol > li`, `Current` with `aria-current="page"`, client `Overflow` (CMP `IconButton` + `Menu`) only when `maxItems` collapses; Pagination link mode (`getHref`) server, button mode client, stable item count, compact form below 400 px.
9. **Command, CommandPalette** (REQ-SURF-60..63): Base UI Combobox inline list; palette on Base UI Dialog with `useLayer({ kind: 'command-palette', modal: true })`, initial focus on input, Escape clears then closes, IME never selects, one `document` keydown per mounted palette for `hotkey` (the only allowed global key listener). Above 100 items use I-1 `VirtualList`; until W2's PR lands, render non-virtualized and record the 5,000-item test `pending`.
10. **SourceTransition** (REQ-SURF-64, -65): API, `view-transition-name: ag-src-<id>` allocation and focus only; engines are MAT's `startMorph`.
11. **Metas, stories, blocks, migration** (REQ-SURF-09, -10, -12..-15, -41, -170, -171): one `<Name>.meta.ts` per flagship (`defineMeta`, parts = rendered `data-ag-part` set, `budgetKb` = size row, `migration` = codemod props rows); stories per PRD §13.3 (`Saas`, `AiCommandCenter`, `Mail`, `Settings`, `MobileApp`, `CommandCenter`, `ContainerPlayground`, RTL variants; `parameters.ag`; no inline layout/`<style>`); `app-frame`, `mobile-settings` blocks and `app-shell-workspace` item; compat adapters under `src/compat/surf/{app-shell,navigation}/`; W1 block of `fragments/deprecations/surf.ts` on `release/4.x` (ids DEP-S0001..0199; `since` 4.2.0 for `./workspace`/`./workflows` and DEPRECATE/REMOVE names, 4.3.0 for renames/consolidations); `fragments/codemods/surf.ts` W1 rows + `app-shell-slots` spec and fixtures; `cases/surf/app-shell/`; W1 rows of size/perf/lanes/css/review fragments; `etc/api/app-shell.*` via `npm run api:update -- --entry app-shell`.

## Tests (names are the PRD's; browser specs run remotely only)

Jest (local OK): `resizePanels.test.ts` (seeded 1,000-drag property test), `getRange.test.ts` (40 cases), `score.test.ts` ("regex metacharacters", "ranking", 10,000-string fuzz), `parseCookie.test.ts`, `AppShell.test.tsx` ("slots wrapped in memo/HOC", "single main", "props render as data attributes", "heading level", "landmark inventory"), `appShellStore.test.ts` ("writes cookie", "controlled mode"), `SidebarToggle.test.tsx` ("ARIA by container mode", "collapseTo"), `Sidebar.test.tsx` ("appearance is not variant", "item is a link with aria-current", "render composes router link", "rail keeps names", "collapsed is inert", "uncontrolled toggle", "group containing current opens"), `TopBar.test.tsx` ("one scroll edge per edge"), `MobileShell.test.tsx`, `StatusBar.test.tsx`, `Inspector.test.tsx`, `ResizablePanels.test.tsx` ("drag in a 600 px-offset container", "single onLayout", "separator ARIA", "restores saved layout with no mismatch"), `Tabs.test.tsx` ("unique ids", "active tab scrolled into view", "part contract"), `TabBar.test.tsx` ("navigation semantics", "tabs requires panels", "warns over 5 items", "accessory placement"), `Breadcrumbs.test.tsx`, `Pagination.test.tsx` ("stable item count"), `Command.test.tsx` ("5,000 items", "announces count"), `CommandPalette.test.tsx` ("hotkey opens and restores focus"), `SourceTransition.test.tsx`, `app-shell.css.test.ts`, `tests/app-shell/{labels,meta-coverage,compat,migration-rows}.test.ts(x)`, `tests/capability/registry/{app-frame,mobile-settings}.test.tsx`; behaviour suites also under `jest -c tests/app-shell/jest.doubles.cjs`.
Remote (GitLab `.ag-playwright`, 3 engines, LTR+RTL): `tests/e2e/surf/app-shell/{layout,a11y,sidebar-drawer,inspector,resizable,theme,forced-colors,blur-budget}.spec.ts`, `tests/a11y/apg/surf/{sidebar,splitter,tabs,tabbar,breadcrumbs-overflow,command}.apg.spec.ts`, `tests/e2e/surf/motion/{tabs-indicator,tabbar-minimize,source-transition}.spec.ts`, `tests/perf/browser/surf/{app-shell-scroll,sidebar-toggle,resizable-drag,command-5000}.spec.ts`, `tests/ssr/surf/hydration.spec.ts` (Next 16 + React 19.3 and Next 15 + React 19.0, with/without `rail` cookie, server `TZ=Pacific/Kiritimati`), `tests/rsc/surf/breadcrumbs-server.spec.ts`, Vite canary `canaries/vite/src/surf/AppShell.page.tsx` (L11). All registered in the W1 block of `fragments/lanes/surf.ts`.

## Visual evidence

Remote screenshots (CI artifacts, `expire_in`) of the six AppShell product shells at 390/768/1024/1440/1920 × light/dark × the 8 QUAL scenes, with/without `rail` cookie, plus `ContainerPlayground` at 320–1920. L14 human review items come from `fragments/review/surf.ts` (specular quality, optical hierarchy, radius rhythm, "reads as one hand"). Nothing is committed.

## Prohibited

Everything in the index "No fake completion" list, plus: handler-only nav items without `render`; `aria-hidden` on focusable content; `window.innerWidth`, `matchMedia` width queries or resize listeners deciding layout; `transition: all`, `will-change`, `transform` at rest, `!important` on shell elements; a second `role="log"`/live region; building a RegExp from user input; shipping the non-virtualized Command path as "done" for REQ-SURF-63.

## Exit criteria

- AC-SURF-04: Vite canary without Tailwind at 1440×900 — `app-frame` sidebar right ≤ main left + 1 px, tops differ ≤ top-bar height; 900 px shell in a 1920 px viewport renders medium.
- AC-SURF-05 (shell rows): ≤3 fine / ≤2 coarse blurred surfaces, depth 1, chrome blur ≤32 px; 0 animations/rAF 1 s after load; forced colors 0 backdrop filters with a current-item cue; `contrast: more` diff >0.5 % in TopBar and Sidebar.
- AC-SURF-06: duplicate-value Tabs 0 duplicate ids, no landmark; TabBar navigation and Sidebar 0 `tab`/`tablist`, one `aria-current="page"` per nav; collapsed sidebar 0 tabbables; `StatusBar.Root` no live role.
- AC-SURF-07: ResizablePanels in a 600 px-offset container within 1 px of the pointer; WebKit touch drag; 0 commits during drag; one `onLayout`.
- AC-SURF-08: `Command.score` and `Command` take 10,000 random printable-ASCII queries with 0 exceptions.
- AC-SURF-09: six shells SSR → hydrate in Next 16/19.3 and Next 15/19.0 with 0 warnings, CLS ≤0.01, with/without cookie; Breadcrumbs (no overflow) and the server frame contribute 0 client modules.
- AC-SURF-29: six product shells pairwise non-identical (DOM hash), 0 `<style>`, 0 `!important`, L14 review recorded.
- W1 rows of AC-SURF-01 (root SURF names and `./app-shell` exactly per contract), -11 (W1 APG specs pass 3 engines LTR/RTL), -12 (axe 0), -13 (OCR contrast), -23 (W1 size/perf rows green, grades ≥B/≥C), -24 (W1 deprecations shipped in 4.2/4.3, adapters warn once, fixtures pass), -25 (deliverables for flagships 22–31), -26 (`app-frame`, `mobile-settings`, `app-shell-workspace` render in Vite and Next 16 canaries).
- Every SURF-001..133 task `DONE` or `BLOCKED` with evidence; `npm test`, `npm run typecheck` green; pipeline for the merge SHA `success`.

## Final report format

```
PROMPT-4a SURF/W1 REPORT
Branches/PRs: <next-surf/w1-*> <4x-surf/*>   Merge SHAs: <sha…>   GitLab pipelines: <URLs>
Contract check: ok | missing <paths>
Tasks SURF-001..133: DONE n / BLOCKED n (<id: reason + command output>)
REQ-SURF-NN: <test> -> pass | fail | pending | double-pass   (one line per REQ 16..65 and W1 shares)
AC-SURF-04/-06/-07/-08/-09/-29 (+ W1 rows of -01/-05/-11/-12/-13/-23/-24/-25/-26): PASS | FAIL | PENDING + artifact path
I-1 status (Command virtualization): pending | switched in <PR>
Budgets measured (KB / ms) vs rows; files changed; deviations from PRD with evidence
```
