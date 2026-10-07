# PROMPT-11c (NAV): Sidebar family, rail tooltips, collapsible groups, compact/medium drawer

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key NAV; alias PRD-11; contracts `prd/_shared-contracts.md`; key crosswalk `PROMPT_11_NAV.md`), §4.4, §4.6, §5.2, §12, §14, §15, §20 step 5.
Requirement IDs: REQ-NAV-15, -16, -17, -18, -19, -20 (compact/medium half), -21, -22, -23, -24.
Acceptance: AC-NAV-12 (Sidebar half), AC-NAV-13 (collapsed-sidebar half); browser inputs to AC-NAV-09/10. Tasks: NAV-036..NAV-047.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main` (5.0). Architecture wins; deviations reported with evidence.
- No fake completion: no stub drawer, no hand-rolled focus trap or scrim (the drawer **is** PRD-OVL `Sheet`, OVL-097; Escape goes only through the PRD-A11Y `LayerStack`, SC-25), no `test.skip`/`fixme`/`it.todo`, no lowered thresholds, no snapshot updates, no jsdom stand-ins for focus-trap/target-size/layout. Missing prerequisite ⇒ BLOCKED with output.
- Remote-first for every Playwright/APG spec (CI or `auraone-remote-run`). Local: `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`.
- React 19 ref-as-prop. `Sidebar.tsx`/`SidebarNav.tsx` are server files; `SidebarCollapsible.tsx`/`SidebarDrawer.tsx` are `"use client"`. No `aria-hidden` on the collapsed sidebar. No `variant` prop for layout (D-06): the prop is `appearance`.
- Material through PRD-MAT only: inline sidebar `layer="chrome" thickness="thick"`; `appearance="inset"` uses `ConcentricFrame`; items carry tint/rim only (no nested backdrop filter).

## Prerequisites (verify)

1. PROMPT-11b merged: `test -f src/app-shell/AppShellSidebarToggle.tsx && test -f src/app-shell/appShellStore.ts`.
2. PRD-OVL certified `Sheet` (OVL-097) and `Tooltip` (OVL-066): `rg -n "export (const|function) (Sheet|Tooltip)\b" src` and their certification rows green in the latest PRD-QA artifact index. Portal through `usePortalContainer()` (FND-007): `test -f src/foundation/portal.ts`. Without `Sheet`, implement steps 1–4 and mark NAV-041/042/044 BLOCKED.
3. PRD-MAT `ConcentricFrame` (MAT-051): `test -f src/material/ConcentricFrame.tsx`.
4. PRD-FND Base UI wrapping pattern (FND-001, FND-005): `rg -n "@base-ui/react/collapsible" src | head -1` or the PRD-FND pattern doc.
5. PRD-A11Y APG harness (A11Y-073): `test -f tests/a11y/apg/harness.ts` (REQ-A11Y-40).

## May touch

NEW `src/app-shell/{Sidebar,SidebarNav,SidebarCollapsible,SidebarDrawer}.tsx`; `src/app-shell/AppShellSidebarToggle.tsx` (drawer wiring); `src/app-shell/app-shell.css` (sidebar rules); `src/app-shell/index.ts` (add `Sidebar`); NEW `src/app-shell/Sidebar.test.tsx`; NEW `tests/e2e/app-shell/sidebar-drawer.spec.ts`; NEW `tests/a11y/apg/sidebar.apg.spec.ts`; `tests/e2e/app-shell/{layout,a11y}.spec.ts` (sidebar cases); NEW `tests/perf/browser/sidebar-toggle.spec.ts`.

## Must not touch

`src/components/navigation/GlassSidebar.tsx`, `LiquidGlassInsetSidebar.tsx`, `GlassNavigationMenu.tsx`, `GlassMobileNav.tsx` (removed in 11i), PRD-OVL `Sheet`/`Tooltip` source, `package.json`.

## Steps

1. **Parts (REQ-NAV-15).** `Sidebar = { Root, Header, Content, Footer, Nav, Group, GroupLabel, Item, ItemIcon, ItemBadge, Collapsible, Separator }`. `Root`: `<div data-ag-slot="sidebar" id class="ag-sidebar" data-ag-appearance="sidebar|inset|floating">`; emits `data-ag-variant` only when a material `variant` (`regular|clear|identity`) is passed. `Content` is the only scroll area (`overflow: auto; overscroll-behavior: contain`). `Nav` = `<nav aria-label>`; dev warning when `aria-label` and `aria-labelledby` are absent.
2. **Items (REQ-NAV-16).** `Sidebar.Item` renders `<a href>` by default; `href` required unless `render`; `render={<NextLink href="…" />}` merges props onto the element (PRD-FND render-prop helper, no `cloneElement` on arbitrary children); `current` ⇒ `aria-current="page"` (never `aria-selected`). `render={<button />}` allowed with a dev warning "destinations should be links". Items render inside `<ul>/<li>`.
3. **Rail (REQ-NAV-17).** Under `.ag-app-shell[data-ag-sidebar=rail]` labels get the PRD-A11Y visually-hidden rule (not `display:none`); each item wraps its label in PRD-OVL `Tooltip`, using its `delay` default (an OVL prop constant, not a token; SC-19), only in rail state. Hit area: `min-block-size/min-inline-size: 40px`, and 44px under `@media (pointer: coarse)`.
4. **Collapsed (REQ-NAV-18).** CSS `.ag-app-shell[data-ag-sidebar=collapsed] .ag-sidebar { display: none }`; the store sets the `inert` attribute on the sidebar element in the same write. No `aria-hidden`.
5. **Collapsible groups (REQ-NAV-23, -24).** `Sidebar.Collapsible` wraps Base UI Collapsible (`trigger` → `aria-expanded`, panel `hidden`); `defaultOpen` is computed server-side when any descendant `Sidebar.Item` has `current` (walk only `Sidebar.Item` elements passed as direct JSX children of the group; document that dynamic children pass `defaultOpen`).
6. **Drawer (REQ-NAV-19, -22).** Compact: `.ag-sidebar` `display: none` via `@container ag-app-shell (width < 600px)` (no SSR flash). Medium: grid column forced to rail. `SidebarDrawer` = `React.lazy`-loaded PRD-OVL `Sheet side="start"` (width `min(85%, 20rem)`), modal. `Sidebar.Root` (server) renders `<SidebarDrawer>{children}</SidebarDrawer>` as a sibling of the inline element, passing the same server-rendered `children` as RSC props; the drawer mounts them only while open, and while it is open the inline sidebar is `display: none` + `inert`, so the content is never focusable twice. Any id inside the content must come from `useId` (no literal ids) so the two copies never collide. Closes on Escape (PRD-A11Y `LayerStack`, A11Y-049; the drawer adds no Escape handler of its own), scrim click, and any `Sidebar.Item` activation (event delegation on `click` of `a, [data-ag-part=item]`); focus returns to the toggle.
7. **Toggle wiring (REQ-NAV-20, -21, -22).** Open item PRD §21 O-02: the medium (600–1023px) behaviour awaits a design-review decision, recorded as the `gate` on NAV-042. Until it is signed, implement compact as specified and keep medium behind the proposed default, reporting it as a deviation. In compact/medium the toggle opens the drawer and carries `aria-expanded` + `aria-haspopup="dialog"` + `aria-controls`=drawer popup id; in expanded/wide it toggles inline. Uncontrolled toggling changes `data-ag-sidebar` without any prop (regression for E-19). The stored `expanded` preference is kept in the store while medium forces rail and restored at ≥1024px.
8. **Perf spec.** Author `sidebar-toggle.spec.ts`: INP ≤ 100 ms and no long task > 50 ms on mid-tier mobile profile; width transition only under `[data-ag-animating]`, ≤ `--ag-duration-medium`, 0 layout-property animations at `motion=calm|none`. Executed in 11h.

## Tests

- `src/app-shell/Sidebar.test.tsx` › `appearance is not variant`, `item is a link with aria-current`, `render prop composes router link`, `button render warns`, `rail keeps accessible names`, `collapsed sidebar is inert` (0 tabbable descendants), `uncontrolled toggle changes state`, `group containing current opens`, `missing aria-label on Sidebar.Nav warns`.
- Remote `tests/e2e/app-shell/sidebar-drawer.spec.ts` › `compact drawer opens, traps focus, closes on Escape/scrim/navigation, restores focus`, `stacked Escape with open Menu closes Menu first`, `medium toggle opens drawer`.
- Remote `tests/a11y/apg/sidebar.apg.spec.ts` (PRD-A11Y `runApgScript`, A11Y-073; one file per widget, SC-30), LTR + RTL, 3 engines: Tab between items, Enter activates, Space/Enter toggles collapsible.
- Remote `layout.spec.ts › medium forces rail and restores`; `a11y.spec.ts › rail target size` (≥40 fine, ≥44 coarse), axe `aria-hidden-focus` = 0.
Run local: `npm test -- src/app-shell/Sidebar.test.tsx src/app-shell/AppShellSidebarToggle.test.tsx`.

## Visual evidence

Remote screenshots (CI artifact): sidebar expanded/rail/collapsed/drawer-open at 390, 768, 1440; `appearance` sidebar/inset/floating; light/dark; forced-colors. Human review only.

## Exit criteria

- AC-NAV-12 (Sidebar half): 0 `role=tab|tablist` inside `Sidebar`; every destination `<a href>` or `render` element; exactly one `aria-current="page"` per `Sidebar.Nav`.
- AC-NAV-13 (collapsed half): 0 tabbable descendants; axe `aria-hidden-focus` = 0.
- Sidebar APG script green in 3 engines LTR/RTL (input to AC-NAV-10).

## Final report format

```
PROMPT-11c REPORT
Commit: <sha>   Remote runs: <URLs>
Prerequisites 1-5: <ok | missing + output>
Tasks NAV-036..047: DONE | BLOCKED(<reason>)
REQ-NAV-15..24: <test> -> pass/fail
AC-NAV-12 (sidebar), AC-NAV-13 (collapsed): PASS/FAIL + artifact
Drawer chunk size (lazy): <KB gz>
Files changed / Deviations
```
