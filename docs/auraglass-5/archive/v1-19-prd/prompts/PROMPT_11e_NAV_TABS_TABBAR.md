# PROMPT-11e (NAV): Tabs (Base UI) with indicator morph, TabBar (navigation/tabs, dock, minimize, accessory)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key NAV; alias PRD-11; contracts `prd/_shared-contracts.md`; key crosswalk `PROMPT_11_NAV.md`), §4.4, §4.6, §5.5, §5.6, §12, §14, §20 step 7.
Requirement IDs: REQ-NAV-38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -07 (TabBar bottom inset).
Acceptance: AC-NAV-11, AC-NAV-12 (TabBar half); inputs to AC-NAV-06 (TabBar = 1 filter), AC-NAV-10 (tabs/tabbar APG). Tasks: NAV-063..NAV-077.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main` (5.0). Architecture wins; deviations reported with evidence.
- No fake completion: no stubs, no hand-rolled tabs keyboard model (Base UI Tabs provides it), no own View Transition engine (call PRD-MOT `startMorph`, MOT-045), no `test.skip`/`fixme`/`it.todo`, no lowered thresholds, no snapshot updates, no jsdom stand-in for motion frame strips. Missing prerequisite ⇒ BLOCKED with output.
- Remote-first for Playwright/APG/motion specs (CI or `auraone-remote-run`). Local: `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`.
- No Base UI type in the public `.d.ts` (§6 swap-safety): define own prop interfaces. One selection contract: `value`/`defaultValue`/`onValueChange(value: string)`. Layout prop is `appearance`, never `variant` (D-06). React 19 ref-as-prop. No `role="navigation"` on Tabs. No inline `background`/colour literal in TabBar (E-18). No JS scroll listener for minimize.

## Prerequisites (verify)

1. PROMPT-11b merged (shell slots, `ScrollEdge` usage pattern): `test -f src/app-shell/AppShell.tsx`.
2. PRD-FND Base UI wrapping (FND-001 pin, FND-005 parts): `rg -n '"@base-ui/react"' package.json` and the wrapper pattern proven by CTL-055 Button / OVL-040 Dialog. Open item PRD §21 O-01: verify that Base UI exposes active-tab CSS variables for the indicator fallback. If it does not, report the fallback as a deviation.
3. PRD-MOT `startMorph` and `useMorphName` (MOT-045, MOT-048): `test -f src/motion/viewTransition.ts && rg -n "export (async )?function startMorph|export const startMorph" src/motion/viewTransition.ts`. Missing ⇒ NAV-065/069 BLOCKED; fallback CSS path may still land.
4. PRD-MAT `SurfaceGroup` (MAT-048) and `ScrollEdge` (MAT-050): `test -f src/material/SurfaceGroup.tsx && test -f src/material/ScrollEdge.tsx`.
5. PRD-A11Y APG harness `tests/a11y/apg/harness.ts` (A11Y-073); PRD-A11Y `data-ag-motion` resolution (A11Y-027). PRD-CTL `SearchField` (CTL-075) for `TabBar.Search`.

## May touch

NEW `src/components/navigation/{Tabs,TabBar}.tsx`; NEW `src/components/navigation/navigation.css` (starts with the six-name `@layer` order statement, SC-20; Tabs + TabBar sections; Breadcrumbs/Pagination sections are added by 11f); `src/app-shell/app-shell.css` (tabBar slot rules); `src/index.ts` (add `Tabs`, `TabBar` root exports only); NEW `src/components/navigation/{Tabs,TabBar}.test.tsx`; NEW `tests/a11y/apg/{tabs,tabbar}.apg.spec.ts`; NEW `tests/motion/{tabs-indicator,tabbar-minimize}.spec.ts`; `tests/e2e/app-shell/{layout,a11y,blur-budget}.spec.ts` (tab cases).

## Must not touch

`GlassTabs.tsx`, `GlassPageTabs.tsx` (visual reference only; read it for the `pill` look), `EnhancedGlassTabs.tsx`, `GlassTabItem.tsx`, `GlassTabBar.tsx` + `.module.css`, `styled.tsx`, `components/TabItem.tsx`, `LiquidGlassTabBar.tsx`, `GlassBottomNav.tsx`, `LiquidGlassBottomAccessory.tsx`, `src/components/search/LiquidGlassSearchTab.tsx` (all removed in 11i); `src/motion/**` (PRD-MOT); `tokens/**` (PRD-DS).

## Steps

1. **Tabs parts (REQ-NAV-38, -39, -43).** `Tabs = { Root, List, Tab, Panel, Indicator }` over Base UI Tabs. Props: `value`, `defaultValue`, `onValueChange(value)`, `orientation`, `activateOnFocus=false`, `appearance="pill"|"underline"` (`data-ag-appearance`), `size="sm"|"md"`. Ids: `${useId()}-tab-${value}` / `-panel-${value}` passed to Base UI (or Base UI's own useId-based ids, verified unique). Root renders a plain `<div>` (no landmark). Every part emits `data-ag-part="list|tab|panel|indicator"` and `data-state="active|inactive"`. `Panel` unmounts when inactive; `keepMounted` keeps it with `hidden`.
2. **Indicator (REQ-NAV-41).** `Tabs.Indicator` carries `data-ag-vt-participant` and `style={{ viewTransitionName: \`ag-tabs-indicator-${id}\` }}`. On activation, `onValueChange` wraps the state update in PRD-MOT `startMorph(update, { surfaces: [indicatorEl] })`; the name comes from `useMorphName` (MOT-048). When `document.startViewTransition` is absent (feature check), CSS positions the indicator with `translate` + `scale` from Base UI active-tab CSS variables and transitions only those with the PRD-MOT scale `--ag-duration-{instant,micro,small,medium,large}` / `--ag-ease-{standard,emphasized,…}` (SC-19). Under `[data-ag-motion=calm]` opacity cross-fade only; `none` jumps. Never transition `left|width|top|height`; no `will-change`.
3. **Overflow (REQ-NAV-42).** `Tabs.List` `overflow-x: auto`, `mask-image` edge fade via `--ag-*` sizes, `scrollbar-width: none`; on activation `tabEl.scrollIntoView({ block: "nearest", inline: "nearest" })`. No scroll buttons.
4. **TabBar parts (REQ-NAV-44, -45, -46).** `TabBar = { Root, Item, ItemIcon, ItemLabel, ItemBadge, Accessory, Search }`, `semantics="navigation"` default, `placement="bottom"|"floating"`. Navigation: `<nav aria-label>` (required) > `<ul>` > `<li>` > `TabBar.Item` link with the same `href`/`render`/button-warning contract as `Sidebar.Item`; `aria-current="page"` on `current`; 0 `role=tab|tablist`, 0 `aria-controls`. Tabs semantics: renders `Tabs.List` semantics and requires `Tabs.Panel`s (dev error if no panel registers within one commit; check in `useEffect`). `floating`: centred capsule `max-inline-size: min(100% - 2 * var(--ag-space-4), 36rem)`. 2–5 items; > 5 dev warning. Items ≥ 44×44 at `(pointer: coarse)`.
5. **Material (REQ-NAV-47).** One PRD-MAT `SurfaceGroup` (layer chrome) owns the only `backdrop-filter`; items use tint/rim. `refraction` prop sets the enhanced-tier request per D-05 (inert unless the enhanced tier enables it; §16 PRD-15 is interim-owned by PRD-MAT, SC-37). Renders the single `ScrollEdge edge="bottom"` (`edgeStyle`, SC-22) for its scroll container (REQ-NAV-26 rule).
6. **Minimize + accessory (REQ-NAV-48, -49).** Open item PRD §21 O-01: verify in WebKit and Gecko that the `@supports` guard is sufficient. `minimizeOnScroll`: CSS-only `@supports (animation-timeline: scroll())` animation on `animation-timeline: scroll(nearest block)` collapsing labels; disabled at `[data-ag-motion=calm|none]`. `TabBar.Accessory` inside the same `SurfaceGroup`, hidden when minimized unless `accessoryPlacement="persist"`. `TabBar.Search` = search item (absorbs `LiquidGlassSearchTab`) rendering PRD-CTL `SearchField` trigger (CTL-075).
7. **Shell integration (REQ-NAV-50, -07).** `app-shell.css`: in `@container ag-app-shell (width >= 600px)` hide `[data-ag-slot=tabbar] .ag-tab-bar[data-ag-placement=bottom]`; `floating` stays. Overlay TabBar adds `env(safe-area-inset-bottom)` to its own block-end padding.

## Tests

- `src/components/navigation/Tabs.test.tsx` › `two instances have unique ids`, `no landmark role`, `active tab scrolled into view`, `part contract`, `keepMounted keeps hidden panel`, `onValueChange receives value string`.
- `src/components/navigation/TabBar.test.tsx` › `navigation semantics` (0 `role=tab`, one `aria-current`), `tabs semantics requires panels`, `warns over 5 items`, `accessory placement`, `no inline background` (no `style.background` on any node).
- Remote APG `tests/a11y/apg/tabs.apg.spec.ts` (arrows with wrap, Home/End, manual Enter/Space, disabled skipped, Tab into panel, RTL) and `tabbar.apg.spec.ts`, 3 engines.
- Remote motion `tests/motion/tabs-indicator.spec.ts` (VT group observed; deleted-`startViewTransition` fixture frame strip changes only `translate`/`scale`; no layout-property transition; reduced motion no WAAPI after settle) and `tabbar-minimize.spec.ts` (Chromium collapses; engines without support register 0 scroll listeners — instrument `addEventListener`).
- Remote `layout.spec.ts › tabs no page overflow at 320`, `› bottom tab bar only in compact`; `a11y.spec.ts › tab bar target size`; `blur-budget.spec.ts › tab bar = 1 backdrop filter`.
Run local: `npm test -- src/components/navigation/Tabs.test.tsx src/components/navigation/TabBar.test.tsx`.

## Visual evidence

Remote screenshots/frame strips: Tabs underline/pill × horizontal/vertical × default/focus-visible/active/disabled/overflowing; TabBar bottom/floating × navigation/tabs × expanded/minimized × accessory, light/dark, 390/1440. CI artifact, human review.

## Exit criteria

- AC-NAV-11: two `Tabs` with identical values ⇒ 0 duplicate ids (axe `duplicate-id-aria` = 0); no landmark from `Tabs`.
- AC-NAV-12 (TabBar half): navigation semantics renders 0 `role=tab|tablist`; every destination `<a href>`/`render`; one `aria-current` per nav.
- Tabs/TabBar APG green 3 engines LTR/RTL; `rg -n "role=\"navigation\"" src/components/navigation/Tabs.tsx` = 0.

## Final report format

```
PROMPT-11e REPORT
Commit: <sha>   Remote runs: <URLs>
Prerequisites 1-5: <ok | missing + output>
Tasks NAV-063..077: DONE | BLOCKED(<reason>)
REQ-NAV-38..50, 07: <test> -> pass/fail
AC-NAV-11, AC-NAV-12 (tabbar): PASS/FAIL + artifact
{ Tabs } <KB> (≤8), { TabBar } <KB> (≤6) min+gz
Files changed / Deviations
```
