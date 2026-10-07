# PROMPT-10e (OVL): Menu, ContextMenu, Menubar

You are implementing part of PRD-OVL (Flagship Overlays) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (5.0 work on `main`). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md`:
  - §1 item 3, §2.2 E-20..E-22, §2.4 (menu rows)
  - §5.6 REQ-OVL-52..59
  - §10.1 (Menu, ContextMenu, Menubar), §10.2 (DropdownMenu, ContextMenu, Menubar rows), §10.3 (DropdownMenu data-state row)
  - §12.1–12.2 (menu rows), §13 item 2 (Menu)
  - §14 (Menu row), §15 (Menu/ContextMenu/Menubar rows + targets), §16.2
- Lineage template: `src/components/navigation/GlassDropdownMenu.tsx`. Read it for part naming and behaviour only, at `:229-231`, `:351-375`, `:510-511` and `:791-797`. Don't copy its `FocusScope loop` Tab trap.
- Evidence: `docs/auraglass-5/autopsy/accessibility.md` ACCESSIBILITY-12, -14.
- Layout and conflicts: `docs/auraglass-5/prompts/PROMPT_10_OVL.md` (binding; `Menu.Shortcut` needs the `shortcut` part value).
- Contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-15, SC-20 (`<Name>.css` starts with the six-name `@layer` statement, rules in `ag.components`), SC-25 (`usePortalContainer()`, `LayerStack` is the only Escape dispatcher), SC-29 (lanes L5/L8/L10), SC-30 (APG specs `tests/a11y/apg/` on the A11Y-073 harness; other behaviour specs `tests/e2e/overlays/`), SC-40 (`depends_on` holds anchor task ids).
- Tasks: `docs/auraglass-5/tasks/OVL.json` OVL-081..OVL-096. Anchor prerequisites: OVL-040, OVL-063 (10c/10d), FND-005/007, A11Y-049/073, PKG-048/049.

## 2. Scope
May create or modify:
- NEW `src/components/menu/`:
  - `Menu.client.tsx`: Root, Trigger, Portal, Positioner, Popup, Item, LinkItem, CheckboxItem, CheckboxItemIndicator, RadioGroup, RadioItem, RadioItemIndicator, Group, GroupLabel, Separator, Shortcut, SubmenuRoot, SubmenuTrigger, Arrow
  - `ContextMenu.client.tsx` (Root, Trigger, plus the Menu popup parts re-exposed)
  - `Menubar.client.tsx`
  - `Menu.css`, `Menu.meta.ts`, `index.ts`, `Menu.test.tsx`, `Menu.stories.tsx`
- NEW `tests/a11y/apg/menu.apg.spec.ts`, `context-menu.apg.spec.ts`, `menubar.apg.spec.ts`
- `tests/e2e/overlays/overlay-stack.spec.ts`: add T-OVL-STACK-01
- `tests/perf/browser/overlays-overlay-budget.spec.ts`: add Menu rows
- `src/components/overlays/_shared/__tests__/subjects.ts` and `popup-contract.test.tsx`: add Menu
- `src/index.ts`: add `Menu`, `ContextMenu`, `Menubar` (3 values)
- PRD-PKG budget file `docs/size-budgets.json` (PKG-048, MODIFY; checked by `scripts/ci/verify-size-budgets.mjs`, PKG-049; integer bytes, peers external; changes logged in `docs/size-budgets.changelog.md`; no size-limit, SC-15): add the Menu row

Must NOT touch: the 4.x `src/components/navigation/**` (deleted in 10i), `src/components/modal/LiquidGlassPopoverMenu.tsx`, `src/foundation/**`, `src/theme/**`.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 10d merged: `test -f src/components/popover/Popover.client.tsx`. T-OVL-STACK-01 needs Dialog, Popover and Menu.
- `shortcut` is in `AG_PARTS`: `rg -n "'shortcut'|\"shortcut\"" src/foundation/parts.ts`. If it's missing, OVL-083's Shortcut part is blocked. Request it, and don't use an unlisted value.

## 4. Steps
1. **OVL-081 Parts (REQ-OVL-52).**
   - Use the full part list over Base UI Menu, with `data-ag-part` values from `AG_PARTS`: `root`, `trigger`, `positioner`, `popup`, `item`, `item-indicator`, `group`, `group-label`, `separator`, `arrow`, `shortcut`. `SubmenuTrigger` uses `trigger`.
   - Register `useOverlayLayer({ kind: "menu", modal: false })`, once per root. Submenus use Base UI nested dismissal.
2. **OVL-082 Keyboard (REQ-OVL-53).** Configure Base UI (the defaults need checking against the pinned version), with `loop = true`:
   - On the trigger, Enter, Space and ArrowDown open the menu and focus the first item. ArrowUp opens it and focuses the last item.
   - Home and End work. Typeahead uses a 500 ms buffer.
   - ArrowRight and ArrowLeft open and close submenus.
   - Escape closes the current level and restores focus to its trigger.
   - **Tab closes the whole menu** and focus moves to the next tabbable after the trigger.
   - Exactly one item has `tabIndex=0` at any time.
3. **OVL-083 Item semantics (REQ-OVL-54).**
   - Items take `role` `menuitem`, `menuitemcheckbox` or `menuitemradio`.
   - `CheckboxItem checked="indeterminate"` sets `aria-checked="mixed"`.
   - Disabled items stay focusable with `aria-disabled="true"` and a visible focus ring.
   - `closeOnClick` defaults to `true` on `Item` and `false` on `CheckboxItem`/`RadioItem`.
   - `Shortcut` renders `aria-hidden` text and writes `aria-keyshortcuts` on its parent item.
4. **OVL-084 Submenus (REQ-OVL-55).** Submenus open on hover after 100 ms with the Base UI safe triangle, and on ArrowRight. `Menu.Trigger openOnHover` is allowed only inside `Menubar`. Anywhere else, log a dev warning.
5. **OVL-085 ContextMenu (REQ-OVL-56).**
   - It opens on the `contextmenu` event, on Shift+F10 and on the ContextMenu key, positioned at the pointer or the focused element.
   - Opening focuses the first item. Closing restores focus to the previously focused element.
   - An outside press closes it only after hit-testing the popup. A touch long-press of 500 ms opens it.
   - Every handler lives on the Trigger region element. No document listeners.
6. **OVL-086 Menubar (REQ-OVL-57).**
   - Root: `role="menubar"`, `aria-orientation="horizontal"`. Children are `Menu.Root` elements whose triggers have `role="menuitem"`.
   - The bar has one roving tab stop. ArrowLeft and ArrowRight move between triggers, and move the open menu when one is open. ArrowDown opens the menu.
   - Escape closes the menu and focuses its top-level trigger. Never call `blur()`.
   - `loop = true`.
7. **OVL-087 `Menu.css` (REQ-OVL-58).**
   - Popup material is `overlayMaterial("menu")` (regular).
   - Items are 32px tall under `(pointer: fine)` and 44px under `(pointer: coarse)`, with inline padding `--ag-space-3`.
   - Highlight (`[data-highlighted]`) raises `--ag-surface-fill` one step and adds the rim. Items get no `backdrop-filter`.
   - Popup: `max-height: var(--available-height)` with internal scroll, min inline size equal to the trigger width, max 320px.
8. **OVL-088 `Menu.meta.ts`.**
   - Covers Menu, ContextMenu and Menubar: parts, states, thickness `regular`, `budgetKb: 22`, blurred layers 1 (+1 per open submenu, max 3).
   - APG URLs: menu-button, menubar.
   - Lineage: `GlassDropdownMenu` plus 12 parts, `GlassContextMenu`, `GlassMenubar`, `GlassMenuPrimitive`, `HeaderUserMenu`, `LiquidGlassPopoverMenu`, `CollapsedMenu`.
   - `migration`: the full §10.2 DropdownMenu part table, `Content side/align/sideOffset` → `Positioner`, `useContextMenu` → TODO, and `createFileMenu`/`createEditMenu` → TODO.
   - `selectorChanges`.
9. **OVL-089** Root exports.
10. **OVL-090 `Menu.test.tsx`.** Named cases: "roles", "aria-checked mixed", "aria-disabled focusable", "aria-keyshortcuts", "closeOnClick defaults", "coarse target size" (computed `block-size` 44px under a coarse-pointer `matchMedia` stub; the jsdom media stub is allowed, the component isn't mocked), "openOnHover outside menubar warns".
11. **OVL-091 `menu.apg.spec.ts` (remote, 3 engines).** The full APG menu-button script: open keys, arrows with wrap, Home/End, typeahead ("b" → first item starting with b; "ba" within 500 ms), submenu ArrowRight/Left, Escape per level, "Tab closes" (focus lands on the next tabbable after the trigger), "one tabIndex=0".
12. **OVL-092 `context-menu.apg.spec.ts`.** Right-click, Shift+F10, ContextMenu key, focus on the first item, restore, outside press, and long-press (`hasTouch`).
13. **OVL-093 `menubar.apg.spec.ts`.** One tab stop, horizontal arrows, ArrowDown opens, Escape returns to the bar (`document.activeElement` is the trigger, not `body`), loop.
14. **OVL-094 stories.** Default, CheckboxRadio (incl. indeterminate), Submenus, Shortcuts, DisabledItems, LongList, ContextMenuRegion, Menubar (File/Edit/View). Open by default where applicable, with stable ids.
15. **OVL-095** T-OVL-STACK-01: with Dialog → Popover → Menu open, 3 Escapes close Menu, then Popover, then Dialog, each returning focus to that layer's trigger. Exactly one layer closes per press.
16. **OVL-096 budgets and harness.**
    - `overlays-overlay-budget.spec.ts`: Menu = 1, each open submenu +1, max 3.
    - Append Menu, ContextMenu and Menubar to `OVERLAY_SUBJECTS`. All 10b harnesses must be green.
    - Add the `Menu ≤22 KB` line (incl. ContextMenu and Menubar parts).

## 5. Tests to run
Local: `./node_modules/.bin/jest src/components/menu src/components/overlays/_shared`, ESLint and `tsc --noEmit`. Remote: the `overlays-*` engine projects, the `overlays-perf` budget spec, the Storybook build and the size measurement.

## 6. Visual evidence
- Remote captures of every Menu story at 1440×900 and 390×844 (coarse pointer) over the 8 scenes, light and dark, RTL at 390, plus forced colors.
- A capture of the highlighted-item state.
- Human review of all of these on the CI artifacts.

## 7. Integrity rules (binding)
- Never use local Docker or a local browser.
- No `jest.mock` of `@base-ui/react` or Menu.
- Don't skip tests or update snapshots.
- No Tab trap. If Base UI's default keeps focus on Tab, configure it. Don't relax the test.

## 8. Exit criteria
- AC-OVL-06 (Menu, ContextMenu, Menubar in 3 engines)
- AC-OVL-07 (STACK-01)
- AC-OVL-02 (Menu idle)
- AC-OVL-13 (Menu line)
- AC-OVL-14 (Menu stories at 390)
- REQ-OVL-58 coarse target size is green

## 9. Final report format
```
PROMPT-10e REPORT
Branch/SHA:
Tasks: OVL-081..096 -> done|blocked (reason) each
Base UI defaults changed (loop, Tab, typeahead) with pinned version:
Size: Menu …KB (22); blurred layers Menu n (+submenu n)
Prereq blockers (AG_PARTS shortcut):
Tests: name -> pass/fail (local|remote URL)
Artifacts: URLs
Deviations (with evidence) or none
Files changed:
```
