# PROMPT-11d (NAV): ResizablePanels (Owned window splitter), Inspector, `app-shell-workspace` registry item

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key NAV; alias PRD-11; contracts `prd/_shared-contracts.md`; key crosswalk `PROMPT_11_NAV.md`), §4.4, §4.6, §5.4 (Inspector, workspace), §5.10, §12, §16.2, §20 step 6.
Requirement IDs: REQ-NAV-30, -31, -32, -35, -64, -65, -66, -67, -68, -69 (integration), -70, -71, -72, -83 (observer cleanup).
Acceptance: AC-NAV-14; inputs to AC-NAV-08 (resizable budget) and AC-NAV-10 (splitter APG). Tasks: NAV-048..NAV-062.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main` (5.0). Architecture wins (D-13: ResizablePanels and AppShell layout are **Owned**, no third-party splitter); deviations reported with evidence.
- No fake completion: no stubs, no `test.skip`/`fixme`/`it.todo`, no lowered thresholds, no snapshot updates; jsdom tests may stub `getBoundingClientRect`/`setPointerCapture`, but drag geometry, touch and React-commit counts are proven only by the remote spec. Missing prerequisite ⇒ BLOCKED with output.
- Remote-first for Playwright/APG/perf (CI or `auraone-remote-run`). Local: `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`.
- `ResizablePanels.tsx` and `InspectorSection.tsx` are `"use client"`; `Inspector.tsx` is server. React 19 ref-as-prop; ref callbacks that attach observers return cleanup. No `window.innerWidth/innerHeight`. **No React state update during drag.**
- Inspector material: docked = `layer="content" content="content-sunken"` (no blur); floating = `layer="chrome" thickness="regular"` (1 blur). No colour literals.

## Prerequisites (verify)

1. PROMPT-11a: `test -f src/app-shell/resizePanels.ts` and its tests green (`npm test -- src/app-shell/resizePanels.test.ts`).
2. PROMPT-11b: `test -f src/app-shell/AppShellInspectorToggle.tsx && test -f src/app-shell/appShellStore.ts`.
3. PRD-OVL `Sheet` (OVL-097) with `side="bottom"` and detents (OVL-099): `rg -n "detents" src | rg -i sheet | head -1`. Missing ⇒ NAV-059 sheet mode BLOCKED; docked/floating proceed.
4. PRD-CTL `IconButton` (CTL-061, Inspector close). PRD-FND Base UI wrapping pattern (FND-001, FND-005).
5. PRD-DX registry (SC-32): `test -f registry/registry.json` (DX-067), `test -f scripts/registry/lint.mjs` (DX-070), `test -f tests/dx/registry-render.spec.ts` (DX-094). Missing ⇒ NAV-062 BLOCKED.
6. PRD-FND `Card` exported (FND-050; workspace item only).

## May touch

NEW `src/app-shell/{ResizablePanels,Inspector,InspectorSection}.tsx`; `src/app-shell/app-shell.css` (panels + inspector rules, `@container ag-inspector`, `@container ag-panels`); `src/app-shell/AppShellInspectorToggle.tsx` (sheet wiring); `src/app-shell/index.ts` (add `ResizablePanels`, `Inspector`); `src/index.ts` (add root `ResizablePanels` re-export only); NEW `src/app-shell/{ResizablePanels,Inspector}.test.tsx`; NEW `tests/e2e/app-shell/{resizable,inspector}.spec.ts`; NEW `tests/a11y/apg/splitter.apg.spec.ts`; NEW `tests/perf/browser/resizable-drag.spec.ts`; NEW `registry/items/app-shell-workspace/` (`registry:item` content + `layout.assert.json`; SC-32: the `workspace` block becomes an item); `registry/registry.json` (MODIFY: add the item entry only; DX-067 owns the file); the `app-shell-workspace` case in `tests/dx/registry-render.spec.ts` (MODIFY; DX-094 owns the harness).

## Must not touch

`src/components/layout/GlassSplitPane.tsx`, `src/app-shell/components.tsx`, `src/workspace/**`, `src/components/navigation/LiquidGlassInspectorPanel.tsx`, `src/components/media/LiquidGlassPhotoInspector.tsx` (PRD-MED), PRD-OVL internals, `package.json`, `scripts/registry/**` (PRD-DX).

## Steps

1. **API (REQ-NAV-64).** `ResizablePanels = { Root, Panel, Handle }`. `Root` props: `orientation`, `onLayout(sizes)`, `autoSaveId?`, `defaultLayout?`, `keyboardStep=2`, `keyboardStepLarge=10`, `stackBelow?`. `Panel`: `id` (required), `defaultSize`, `minSize`, `maxSize`, `collapsible`, `collapsedSize=0`, `onCollapse`, `onExpand`, `label`; px strings converted via `toPercent` at measure time. `Handle`: `disabled`, `withGrip`, `aria-label`. Panels register in a ref-held registry (order = DOM order). N ≥ 2, nestable; layout via `display: flex` + `flex-basis: <n>%` inline style.
2. **Pointer (REQ-NAV-65, -66).** `pointerdown` on Handle: `setPointerCapture`, read `root.getBoundingClientRect()` once, store `startX/Y` and start layout. `pointermove`: compute `delta = (clientX - startX) / rect.width * 100` (height for vertical), run `resizePanels`, store pending layout, schedule ≤1 rAF write of `flex-basis` per panel. `pointerup`/`pointercancel`: release capture, commit layout to a ref, fire `onLayout` once, update `aria-valuenow` (DOM write), persist. `touch-action: none` on the Handle only.
3. **ARIA + keyboard (REQ-NAV-67, -68).** Handle: `role="separator"`, `aria-orientation` perpendicular to the panel axis (horizontal group ⇒ `vertical`), `aria-valuenow` (rounded preceding size), `aria-valuemin`/`aria-valuemax` (preceding panel limits), `aria-controls`=preceding panel id, `aria-label` prop or `labels.resize(panelLabel)`, `tabIndex=0`. Keys: arrows along axis ± `keyboardStep`, Shift+arrow ± `keyboardStepLarge`, Home/End → min/max, Enter toggles collapse on a collapsible preceding panel (restore previous size), RTL flips horizontal arrows (`getComputedStyle(root).direction`).
4. **Hit area (REQ-NAV-70).** Visual line 1px; `::before` extends hit area to 24px (fine) / 44px (`@media (pointer: coarse)`) across the axis, `position: absolute`, no layout impact; PRD-A11Y focus ring on `:focus-visible`.
5. **Persistence (REQ-NAV-71).** `autoSaveId` ⇒ `localStorage["ag-panels:<id>"]` read in `useLayoutEffect` after hydration, written on commit; `defaultLayout` seeds SSR inline `flex-basis`.
6. **Stacking (REQ-NAV-72).** `stackBelow="<n>px"` emits `data-ag-stack-below` and a container query on `container: ag-panels / inline-size`. Because container conditions cannot read attributes, ship fixed steps `480px|640px|768px` (`data-ag-stack-below=480|640|768`) and reject other values with a dev warning. Report this as an explicit deviation: REQ-NAV-72 implies an arbitrary width, but container-query conditions cannot read custom properties or attributes (the same constraint PRD §4.2 records for the shell breakpoints); the alternative (a `ResizeObserver`) would violate REQ-NAV-04's CSS-only layout rule.
7. **Inspector (REQ-NAV-30, -31, -32).** `Inspector = { Root, Header, Content, Section, Field }`. `Root` `<aside aria-label>` (label required, dev warning), `data-ag-slot="inspector"`, `mode="auto|docked|floating|sheet"`. `Header` title + PRD-CTL `IconButton` close (calls store `setInspector("closed")`). `Section` = Base UI Collapsible (`title`, `defaultOpen`) in `InspectorSection.tsx`. `Field` grid `minmax(6rem, 40%) minmax(0, 1fr)`, stacks below 280px via `@container ag-inspector`. CSS: wide ⇒ docked column, expanded/medium ⇒ floating chrome panel at inline-end (`min(20rem, 45%)`), compact ⇒ hidden inline; `InspectorToggle` in compact portals content into PRD-OVL `Sheet side="bottom"` (portal via `usePortalContainer()`, SC-25) detents `[0.5, 1]` and restores focus. No `resizable` prop: resizing only via `ResizablePanels.Handle`.
8. **Workspace item (REQ-NAV-35).** `registry/items/app-shell-workspace/` (a `registry:item`, not one of the 10 GA blocks) composes `AppShell` + `PageHeader tabs` + `ResizablePanels` + `Inspector` + `Tabs` (from 11e when available; otherwise the item is BLOCKED, not stubbed) + `Card`, using `.ag-app-shell__auto-grid`. `layout.assert.json` asserts sidebar-beside-main and inspector docked at 1440. Passes `scripts/registry/lint.mjs` (0 `!important`, 0 colour literals).

## Tests

- `src/app-shell/ResizablePanels.test.tsx` › `drag inside offset 600px container`, `single onLayout per drag`, `separator ARIA`, `restores saved layout after hydration without mismatch`, `observer cleanup`, `keyboard steps and Enter collapse`.
- `src/app-shell/Inspector.test.tsx` › parts, `required label warns`, `section collapse`, `Field label association (htmlFor)`.
- Remote `tests/e2e/app-shell/resizable.spec.ts` › `drag in nested container` (handle within 1px of pointer), `touch drag via page.touchscreen` (WebKit included), `React commits during drag = 0` (Profiler fixture). Remote `inspector.spec.ts` › `mode by container width`, `compact sheet opens from toggle and restores focus`, `resizable via panels`. Remote `layout.spec.ts › resizable stacks below threshold`; `a11y.spec.ts › splitter target size`.
- Remote `tests/a11y/apg/splitter.apg.spec.ts` LTR/RTL × 3 engines. Remote perf `resizable-drag.spec.ts`: ≤1 DOM write/frame, 0 React commits until `pointerup`, p95 frame ≤ 16.7 ms mid-tier mobile, 3 panels (executed in 11h for AC-NAV-08).
- `tests/dx/registry-render.spec.ts` case `app-shell-workspace` (PRD-DX harness DX-094, remote).

## Visual evidence

Remote screenshots: 2- and 3-panel horizontal/vertical, nested, collapsed panel, handle focus; inspector docked/floating/sheet at 1440/1024/390. CI artifact, human review.

## Exit criteria

- AC-NAV-14: offset-600px drag within 1px; WebKit touch drag works; 0 React commits during drag; one `onLayout` per drag.
- Splitter APG green 3 engines LTR/RTL; `rg -n "innerWidth|innerHeight" src/app-shell/ResizablePanels.tsx` = 0.

## Final report format

```
PROMPT-11d REPORT
Commit: <sha>   Remote runs: <URLs>
Prerequisites 1-6: <ok | missing + output>
Tasks NAV-048..062: DONE | BLOCKED(<reason>)
REQ-NAV-30..32, 35, 64..72, 83: <test> -> pass/fail
AC-NAV-14: PASS/FAIL + artifact
{ ResizablePanels } size: <KB min+gz> (budget 6 KB)
Files changed / Deviations (incl. stackBelow step values)
```
