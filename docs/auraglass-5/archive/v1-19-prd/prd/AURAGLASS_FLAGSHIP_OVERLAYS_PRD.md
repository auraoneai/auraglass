# AuraGlass 5.0 — Flagship Overlays PRD

| Field | Value |
|---|---|
| Key | **OVL** (cite as `PRD-OVL`; program self-id PRD-10 and architecture §16 PRD-09 are aliases, `_shared-contracts.md` SC-01) |
| PRD id | **PRD-10** (as assigned by the program). Architecture anchor: §16 row **PRD-09** (`PRD-09-flagship-overlays.md`, flagships 15–21). See "ID note" below |
| Owner area | Overlays: Dialog, AlertDialog, Sheet, Popover (+ hover mode), Tooltip, Menu / ContextMenu / Menubar, Toast (+ notification history) |
| Status | Draft |
| Target releases | 4.1.1 (privacy cut REQ-OVL-70, only if TRUST accepts it per SC-36; else 4.2), 4.2 (perf/forced-colors fixes, C-I), 4.2 (C-D warnings), 4.3 (C-D on every renamed name), 5.0.0-alpha (Dialog pattern proof with PRD-07), 5.0.0-beta (all seven flagships), 5.0.0-rc.1 (API freeze) |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§2, §4.4–4.7, §6, §7, §8, §9, §10, §11.2 #15–21, §11.3, §12, §14, §15, §16); `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`; `AURAGLASS_MISSING_CAPABILITY_MAP.md`; `autopsy/runtime-remote.md` §§4–5; `autopsy/accessibility.md`; `autopsy/api-consistency.md` §6.9, API-CONSISTENCY-06/-08/-12/-13; `autopsy/performance.md`; `autopsy/motion.md`; `autopsy/material-engine.md`; `component-inventory.json` |
| Related decisions | D-02, D-06, D-07, D-09, D-11, D-13, D-14, D-15, D-18, D-24, D-25, D-26, D-27, D-29, D-30, D-32 |
| Requirement prefix | `REQ-OVL-NN`; acceptance criteria `AC-OVL-NN` |

**ID note (explicit deviation).** The orchestrator assigned this document id PRD-10 and the file name `AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md`. Architecture §16 calls the overlays PRD "PRD-09" with the file `PRD-09-flagship-overlays.md`, and uses "PRD-10" for app-shell/navigation (flagships 22–31). The content of this PRD is exactly the §16 PRD-09 boundary. To avoid ambiguity, this document calls the app-shell/navigation PRD **PRD-NAV** (architecture §16 row "PRD-10", flagships 22–31) and every other PRD by its §16 number. The two numbering schemes are reconciled by the SC-01 key crosswalk in `prd/_shared-contracts.md` (owner REL): this PRD's key is **OVL**, and every `PRD-NN` in this document means the architecture §16 boundary. Key equivalents: PRD-00 = TRUST, PRD-01/PRD-17 = REL (PRD-17 interim, SC-37), PRD-02 = PKG, PRD-03 = DS, PRD-04 = MAT, PRD-05 = A11Y, PRD-06 = MOT, PRD-07/14/16 = FND, PRD-08 = CTL, PRD-NAV = NAV (§16 PRD-10), PRD-11 = DATA, PRD-12 = AI, PRD-13 = MED, PRD-18/20 = DX, PRD-19 = QA (certification) + SB (Storybook/Lab). Runtime perf budgets cite PERF. Task `depends_on` uses anchor task ids only (SC-40), never `PRD-NN` strings.

**Scope boundary.**
- Owned: flagships 15 `Dialog`, 16 `AlertDialog`, 17 `Sheet`, 18 `Popover`, 19 `Tooltip`, 20 `Menu` (+ `ContextMenu`, `Menubar`), 21 `Toast` (+ the notification history that replaces `GlassNotificationCenter`), and the shared overlay layer contract they all sit on (portal root usage, layer stack, scrim, popup material, Escape stack).
- Consumed, not owned: `AuraGlassProvider` portal root, layer stack, announcer and preference store (PRD-05); `Surface`/material CSS and the overlay floors (PRD-04); motion tokens and the View Transition optics drop (PRD-06); the Base UI wrapping pattern, `data-ag-part` contract and ref pattern (PRD-07).
- Adjacent, not owned: `CommandPalette` (#29) and the headless `Command` are owned by PRD-NAV. This PRD supplies the `Dialog` shell they are built on (REQ-OVL-60). `SourceList`/`Citation` (#42, PRD-12) use Base UI PreviewCard; this PRD supplies the shared overlay popup material they render through (REQ-OVL-14). `Select`/`Combobox` popups (#11, #12, PRD-08) and the `DatePicker` popover (#14, PRD-11) consume the same popup contract.
- "Hover card": there is no `HoverCard` flagship in §11.2, and §12 does not map 4.x `GlassHoverCard` (`src/components/modal/GlassHoverCard.tsx`, 484 lines, inventory disposition CONSOLIDATE → "GlassPopover rebuilt on primitives/positioning (hover-intent mode)"). This PRD follows the inventory: `GlassHoverCard` → `Popover` with `openOnHover` (REQ-OVL-40). This fills a §12 gap and adds no root export, so D-15 is unaffected.

---

## 1. Problem

AuraGlass 4.1.0 has 22 overlay-family root names spread across `src/components/modal/`, `src/components/navigation/`, `src/components/mobile/`, `src/components/data-display/` and `src/components/feedback/`. They do not share behaviour, material, naming or performance discipline:

1. **The modal is the slowest thing in the library.** In the remote Chromium run, the `glass-modal` story renders at **12 fps** (desktop and mobile) and `glass-dialog` at 13–14 fps under scripted hover and scroll, against a 60 fps median for simple stories. The modal story has 12 visible `backdrop-filter` elements and 4 infinite animations, and on desktop it produced **49 long tasks totalling 4,056 ms (max 151 ms)** (`autopsy/runtime-remote.md` §5). The causes are stacked full-viewport `glass-backdrop-blur-md` scrims, nested glass inside the panel, infinite animations that run while nothing is interacting, and per-modal surveillance effects (`setInterval`, gaze, biometric and predictive effects) that re-render the tree while it is open.
2. **Overlays hand-roll behaviour.** Modal, Dialog, Drawer, Popover, BottomSheet and AdaptiveSheet each implement their own Escape and `document.body.style.overflow = "hidden"`. There are 2–3 focus-trap implementations, and `DismissableLayer`/`FocusScope`/`Positioner` are used by about 6 of 348 components (API-CONSISTENCY-08, CONFIRMED). `GlassDialog` uses a document-level Escape listener, so stacked dialogs all close at once; `role="dialog"` sits on the full-screen backdrop wrapper; the background is not `inert` (`autopsy/accessibility.md`, Dialog/Modal).
3. **Several overlays fail APG.** `GlassTooltip` opens on mouse hover only and puts `aria-describedby` on a wrapper `div` (ACCESSIBILITY-10, CONFIRMED). `GlassContextMenu` makes every item a tab stop, never focuses the first item, never restores focus; `GlassMenubar` has no roving tabindex and its Escape drops focus to `<body>`; `GlassDropdownMenu` traps Tab and has no typeahead (ACCESSIBILITY-12, CONFIRMED).
4. **Forced colors does not reach overlays.** Visible backdrop filters on the modal go only 12 → 10 under `forced-colors: active` (`runtime-remote.md` §4), because the modal layers are not in the fallback selector lists (MATERIAL-ENGINE-07, PARTIAL).
5. **Legibility is not guaranteed.** With the story stage removed, the modal, dialog and drawer stories are among the failures over the busy background, and every story fails over black (`runtime-remote.md` §2).
6. **API chaos.** `backdropBlur` is an enum on Modal and a boolean on Dialog and Drawer; close is `onClose`, `onOpenChange` or both (API-CONSISTENCY-08). There are two toast systems plus a separate notification context with different severity props (`type` vs `variant`) and dismissal signatures (API-CONSISTENCY-12, CONFIRMED). `aura-glass/overlays` types expose only 2 of the overlay components while its runtime is the full root bundle (API-CONSISTENCY-06, PACKAGING-SSR-DX-10). Two more `GlassModal`/`GlassTooltip` definitions exist in `animations/GlassTransitions.tsx` and `GlassPopover.tsx` (API-CONSISTENCY §6, MOTION-10).
7. **Toasts and notifications cost per-frame work and import-time side effects.** `data-display/GlassToast.tsx:157` drives its progress bar with a `setInterval` that calls `setState` every 100 ms per toast. `GlassNotificationCenter.tsx:471-474` injects a `<style id="glass-notification-styles">` into `document.head`, which ships as a top-level side effect in the bundle (PERFORMANCE-11 / PERFORMANCE-14 verification row, CONFIRMED).
8. **Privacy-hostile DOM.** `GlassModal`, `GlassDrawer` and `GlassDialog` write analytics-style attributes onto the overlay DOM: `data-user-stress` and `data-interaction-count` (`GlassModal.tsx:796-797`, `GlassDrawer.tsx:795-796`, `GlassDialog.tsx:591-592`), `data-dialog-urgency` (`GlassDialog.tsx:590`), and `data-time-spent={… Date.now() …}` computed during render (`GlassModal.tsx:838`, `GlassDrawer.tsx:839`; `GlassDialog` has no `data-time-spent`).

The result: the overlay family, which architecture §11.2 makes 7 of the 44 flagships and which every product surface uses, is neither fast, accessible, legible nor consistent. 5.0 must replace it with seven Base UI–backed flagships that share one layer contract and meet numeric performance budgets, starting with fixing the modal.

---

## 2. Evidence from the current codebase

All paths verified with `rg --files` at HEAD 15b6de6f7. Verdicts come from the autopsy verification passes; no finding cited here is REFUTED (the autopsy files report 0 REFUTED for these areas).

### 2.1 Modal performance (the headline finding)

| # | Evidence | Path:line / source | Finding ID |
|---|---|---|---|
| E-01 | `glass-modal` 12 fps desktop + mobile, 12 visible backdrop-filters, 4 infinite animations; `glass-dialog` 13–14 fps; simple stories 60 fps | `autopsy/runtime-remote.md` §5 table | runtime-remote §5; autopsy "Performance" row (score 3) |
| E-02 | `glass-modal` desktop: 49 long tasks, 4,056 ms total, max 151 ms (median page 222 ms) | `autopsy/runtime-remote.md` §5 | runtime-remote §5 |
| E-03 | Scrim is a full-viewport `Motion` layer with `glass-backdrop-blur-md` for `sm`, `md` **and** `lg` (all three map to the same class), plus two stacked gradients | `src/components/modal/GlassModal.tsx:738-743`, `:800-815` | API-CONSISTENCY-08 (`backdropBlur` enum) |
| E-04 | Panel defaults to `LiquidGlassMaterial` with `quality="high"`, `environmentAdaptation`, `motionResponsive` — a per-instance backdrop sampler with subtree MutationObserver, scroll/resize/ResizeObserver listeners | `GlassModal.tsx:846-856`; sampler cost in `src/primitives/LiquidGlassMaterial.tsx` | PERFORMANCE-04 (PARTIAL: defaults confirmed) |
| E-05 | Nested glass inside the panel is never suppressed, so header/footer/inputs stack more backdrop-filters | `src/primitives/LiquidGlassLayerProvider.tsx:16-27,97-102` (`allowNestedGlass` never read) | PERFORMANCE-09; MATERIAL-ENGINE-06 (CONFIRMED) |
| E-06 | Per-open surveillance effects: open/interaction recording (`:418-430`), gaze tracking (`:515-530`), biometric adaptation (`:550-560`), predictive insights (`:599-612`), a `setInterval` at `:581` | `src/components/modal/GlassModal.tsx` | SERVER-SERVICES-AI-10 family; §13.3 (consciousness/biometric/eye-tracking deleted) |
| E-07 | Same pattern in Dialog and Drawer: `setInterval` at `GlassDialog.tsx:339` and `:451` (3,000 ms adaptive loop), `GlassDrawer.tsx:487` | as cited | — |
| E-08 | Infinite CSS animations available to any overlay: `glass-float` / `glass-shimmer` / `glass-ambient` | `src/styles/glass.css:622,643,648` | MOTION-08 (CONFIRMED, 43 `repeat: Infinity`) |
| E-09 | The exact source of the modal story's 4 infinite animations is **not attributed** in the remote evidence (it counts animations, not origins). REQ-OVL-05 requires attribution before deletion | `runtime-remote.md` §5 | unverified |
| E-10 | Reduced motion does stop them (4 → 0), so the cost is entirely in the default mode | `runtime-remote.md` §5 | — |
| E-11 | Overlay DOM leaks analytics attributes and `Date.now()` in render: `data-time-spent={modalFocusTime ? Date.now() - modalFocusTime : 0}` | `GlassModal.tsx:796-797,835-838`; `GlassDrawer.tsx:795-796,839`; `GlassDialog.tsx:589-592` (no `data-time-spent` in Dialog) | accessibility.md Dialog/Modal; line refs re-verified at HEAD |

### 2.2 Behaviour and accessibility

| # | Evidence | Path:line | Finding ID |
|---|---|---|---|
| E-12 | Document-level Escape per component; stacked dialogs all close at once | `GlassDialog.tsx:238-256`; `GlassDrawer.tsx:239,271-272`; `LiquidGlassAdaptiveSheet.tsx:43-46`; `mobile/GlassActionSheet.tsx:174-184` | API-CONSISTENCY-08 (CONFIRMED); accessibility.md Dialog/Modal |
| E-13 | Body scroll lock by `document.body.style.overflow = "hidden"` (no scrollbar-gutter compensation, not stack-aware) | `GlassModal.tsx:379-402`; `GlassDrawer.tsx:288-291`; `GlassActionSheet.tsx:180,184`; `GlassDialog.tsx:239-256` | API-CONSISTENCY-08 |
| E-14 | `role="dialog"` + `aria-modal` on the full-screen backdrop wrapper, not the panel | `GlassDialog.tsx:582-586` | accessibility.md Dialog/Modal |
| E-15 | `GlassModal` runs `FocusTrap` and its own initial/restore focus logic (double management) | `GlassModal.tsx:337-375`, `:841-845` | accessibility.md Dialog/Modal |
| E-16 | Three focus-trap implementations | `src/primitives/focus/FocusTrap.tsx:58,336`; `src/utils/a11yEnhancers.tsx:179`; `src/primitives/FocusScope.tsx` | API-CONSISTENCY-08 (CONFIRMED, "2 components and a hook") |
| E-17 | Tooltip hover-only, `aria-describedby` on wrapper div, no Escape | `src/components/modal/GlassTooltip.tsx:244-250` | ACCESSIBILITY-10 (CONFIRMED) |
| E-18 | A second `GlassTooltip` inside the popover module | `src/components/modal/GlassPopover.tsx:678` | API-CONSISTENCY §6 |
| E-19 | Popover repositions on global `resize` and capture-phase `scroll`, outside-click via document `mousedown` | `GlassPopover.tsx:351-352,376` | API-CONSISTENCY-08 |
| E-20 | ContextMenu: every item `tabIndex=0`, no focus on open, no restore, document Escape | `src/components/navigation/GlassContextMenu.tsx:172-197,437` | ACCESSIBILITY-12 (CONFIRMED) |
| E-21 | Menubar: no roving tabindex, Escape calls `current.blur()` | `src/components/navigation/GlassMenubar.tsx:389-415` (Escape `:402-405`) | ACCESSIBILITY-12 (CONFIRMED) |
| E-22 | DropdownMenu: `FocusScope loop` traps Tab, no typeahead — but it is the **best** 4.x overlay (portal, `DismissableLayer`, `aria-haspopup/expanded/controls`, checkbox/radio items with `aria-checked="mixed"`, Arrow/Home/End, Escape returns focus, submenus) and the 5.0 naming template | `src/components/navigation/GlassDropdownMenu.tsx:229-231,351-375,510-511,791-797` | ACCESSIBILITY-12; autopsy "Keep" list; arch §11.1 |
| E-23 | `GlassCommandPalette` input is not a combobox; no option ids or `aria-activedescendant` (owned by PRD-NAV; listed because it must sit on this PRD's Dialog) | `src/components/interactive/GlassCommandPalette.tsx:614-620,677-678` | accessibility.md |
| E-24 | Forced colors leaves 10 of 12 modal backdrop-filters on | `runtime-remote.md` §4; fallback list `src/styles/glass.css:4022-4123` | MATERIAL-ENGINE-07 (PARTIAL); ACCESSIBILITY-07 (CONFIRMED) |
| E-25 | `prefers-contrast: high` (never matches) — `contrast: more` changes 0.000% of pixels on 12/12 stories, modal included | `runtime-remote.md` §3 | ACCESSIBILITY-04 (CONFIRMED) |
| E-26 | Modal/dialog/drawer fail text contrast over the busy background; every story fails over black (266/342 text runs, median 1.92:1) | `runtime-remote.md` Bottom line, §2 | runtime-remote §2 |

### 2.3 API, toast and packaging

| # | Evidence | Path:line | Finding ID |
|---|---|---|---|
| E-27 | `backdropBlur` enum on Modal vs boolean on Dialog/Drawer; close is `onClose`/`onOpenChange`/both | `GlassModal.tsx:63,101,181`; `GlassDialog.tsx:102`; `GlassDrawer.tsx:111` | API-CONSISTENCY-08 (CONFIRMED) |
| E-28 | Two toast systems + notification context; `type` vs `variant`; `onClose` vs `onDismiss(id)` vs `onDismiss()` | `src/components/data-display/GlassToast.tsx:39,45,105`; `src/components/feedback/GlassToast.tsx:35,369`; `src/components/data-display/GlassNotificationCenter.tsx:36,73`; `src/components/data-display/GlassToastProvider.tsx` | API-CONSISTENCY-12 (CONFIRMED) |
| E-29 | Toast progress `setInterval` → `setState` every 100 ms per toast | `data-display/GlassToast.tsx:153-169` | PERFORMANCE (per-frame setState, arch §8 lint) |
| E-30 | Import/mount-time `<style id="glass-notification-styles">` injection | `GlassNotificationCenter.tsx:471-474` (binding source evidence, re-verified 2026-10-06); bundle `dist/index.mjs:41996-42004` is a 4.1.0 build-artifact location that drifts on rebuild (informative only) | PERFORMANCE-11; PERFORMANCE-14 verification row (CONFIRMED) |
| E-31 | `GlassToast` (feedback) is `React.FC`, cannot take a ref | `src/components/feedback/GlassToast.tsx:369` (`export const GlassToast: React.FC<GlassToastProps>`, re-verified 2026-10-06; this source line is the per-file evidence) | API-CONSISTENCY-13 (aggregate FC/forwardRef counts; CONFIRMED) |
| E-32 | `aura-glass/overlays` is `export * from "../components/modal"` but its types expose only 2 components; runtime resolves to the root bundle | `src/overlays/index.ts:1`; `src/index.ts:178-192` | API-CONSISTENCY-06; PACKAGING-SSR-DX-10 |
| E-33 | Duplicate overlay definitions: `GlassTransitions.GlassModal` | `src/components/animations/GlassTransitions.tsx` (inventory REMOVE) | MOTION-10 (CONFIRMED) |
| E-34 | `Positioner` is hand-rolled; inventory says REPLACE | `src/primitives/Positioner.tsx` (166 lines); shim `src/primitives/positioning/GlassPositioner.tsx` (REMOVE) | inventory |

### 2.4 Inventory records in scope (`component-inventory.json`)

| 4.x record | File | Lines (inventory component span, not file length) | Disposition | Flagship candidate | 5.0 target (this PRD) |
|---|---|---|---|---|---|
| GlassModal | `src/components/modal/GlassModal.tsx` | 1191 | REDESIGN | yes | `Dialog` (#15), `AlertDialog` (#16) |
| GlassDialog | `src/components/modal/GlassDialog.tsx` | 1059 | CONSOLIDATE | no | `Dialog` |
| GlassDrawer | `src/components/modal/GlassDrawer.tsx` | 1273 | CONSOLIDATE | no | `Sheet` side (#17) |
| GlassBottomSheet | `src/components/modal/GlassBottomSheet.tsx` | 233 | CONSOLIDATE | no | `Sheet side="bottom"` |
| LiquidGlassAdaptiveSheet | `src/components/modal/LiquidGlassAdaptiveSheet.tsx` | 121 | CONSOLIDATE | no | `Sheet` (+ `SourceTransition` from PRD-NAV) |
| GlassActionSheet | `src/components/mobile/GlassActionSheet.tsx` | 346 | CONSOLIDATE | no | `Sheet preset="action"` |
| MobileGlassBottomSheet | `src/components/mobile/TouchGlassOptimization.tsx` | 105 | REMOVE | no | `Sheet` (codemod pointer) |
| GlassPopover | `src/components/modal/GlassPopover.tsx` | 707 | REDESIGN | no | `Popover` (#18) |
| GlassHoverCard | `src/components/modal/GlassHoverCard.tsx` | 484 | CONSOLIDATE | no | `Popover openOnHover` |
| Positioner / GlassPositioner | `src/primitives/Positioner.tsx` | 166 | REPLACE | no | Base UI `Positioner` parts (internal) |
| GlassTooltip | `src/components/modal/GlassTooltip.tsx` | 317 | REDESIGN | no | `Tooltip` (#19) |
| GlassDropdownMenu (+12 parts) | `src/components/navigation/GlassDropdownMenu.tsx` | 933 | POLISH | yes | `Menu` (#20) |
| GlassContextMenu | `src/components/navigation/GlassContextMenu.tsx` | 508 | REPLACE | no | `ContextMenu` |
| GlassMenubar | `src/components/navigation/GlassMenubar.tsx` | 659 | REDESIGN | no | `Menubar` |
| GlassMenuPrimitive | `src/components/navigation/GlassMenuPrimitive.tsx` | 160 | CONSOLIDATE | no | `Menu` internals |
| HeaderUserMenu | `src/components/navigation/HeaderUserMenu.tsx` | 256 | CONSOLIDATE | no | `Menu` registry recipe (AccountMenu) |
| LiquidGlassPopoverMenu | `src/components/modal/LiquidGlassPopoverMenu.tsx` | 104 | CONSOLIDATE | no | `Menu` |
| CollapsedMenu | `src/components/navigation/components/CollapsedMenu.tsx` | 73 | CONSOLIDATE | no | `Menu` (TabBar overflow, consumed by PRD-NAV) |
| GlassToast (+Provider, Viewport, useToast) | `src/components/data-display/GlassToast.tsx` | 483 | REDESIGN | yes | `Toast` (#21) |
| GlassToastProvider | `src/components/data-display/GlassToastProvider.tsx` | 9 | CONSOLIDATE | no | `Toast.Provider` |
| GlassToast (feedback) | `src/components/feedback/GlassToast.tsx` | 387 | REMOVE | no | — |
| GlassNotificationCenter | `src/components/data-display/GlassNotificationCenter.tsx` | 522 | CONSOLIDATE | no | `Toast.History` |
| GlassAchievementNotifications | `src/components/advanced/GlassAchievementSystem.tsx` | 1432 | REMOVE | no | — (PRD-16) |
| GlassTransitions.GlassModal | `src/components/animations/GlassTransitions.tsx` | 440 | REMOVE | no | — (PRD-16) |
| ChartTooltip | `src/components/charts/components/ChartTooltip.tsx` | 103 | CONSOLIDATE | no | `Tooltip` / `ChartFrame` (PRD-11) |

---

## 3. Desired end state

At 5.0.0-rc.1:

1. **Seven certified overlay flagships** are exported from the root (`.`) with no `Glass` prefix (D-14): `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `Menu` (+ `ContextMenu`, `Menubar`), `Toast`. Each is a compound component over Base UI (D-13), exposes only AuraGlass-owned types (§6 swap-safety), and passes every lane of §15.2 including manual screen reader and touch (T1).
2. **One overlay layer.** Every overlay portals into the `AuraGlassProvider` portal container (PRD-05). There is one z-order stack, one stack-aware Escape (topmost layer only, dispatched by PRD-05's `LayerStack`), one reference-counted scroll lock with scrollbar-gutter compensation (PRD-05 REQ-A11Y-34; Base UI's lock is used only if PRD-07 shows it composes with `LayerStack`), and `inert` on everything outside a modal layer. No overlay file contains `document.addEventListener("keydown"`, `document.body.style.overflow`, or its own focus trap.
3. **One overlay material.** Popups render through `Surface` with `layer="overlay"`. Thickness follows §11.2: Dialog/AlertDialog/Sheet `thick`, Popover/Menu `regular`, Tooltip/Toast `thin`. A modal adds exactly one `scrim`. Full-height Sheets switch to `tinted` (§4.6 P10). Content inside a popup is inner material (no `backdrop-filter`).
4. **The modal is fast.** With one `Dialog` open over a 6-surface page, the viewport has **≤2 live `backdrop-filter` layers attributable to the overlay** (scrim ≤12px + panel ≤32px), **0 infinite animations**, **0 intervals or timers** owned by the overlay while idle, and the remote L10 Performance lane grades it **≥B** (target; T1 floor is C). The 12-fps / 4,056-ms finding (E-01/E-02) is closed by AC-OVL-01..05.
5. **Legible on any backdrop.** Every overlay passes the three-composite contrast gate (§7.3) and the OCR pixel gate over all 8 scenes (§15.1), and drops to solid under forced colors (0 visible backdrop-filters, against 10 today).
6. **APG-correct keyboard models** for dialog, alertdialog, menu, menubar, context menu, tooltip and toast, scripted in Playwright and verified manually with VoiceOver, NVDA and TalkBack.
7. **One toast system.** `Toast.Provider` + `useToast()` with `toast({ title, description, intent, action, duration, priority })`. Notification history is a part of the same store (`Toast.History`), replacing `GlassNotificationCenter`. Timers are Base UI's (pause on hover/focus/hidden tab), with no per-toast `setState` loop.
8. **Migration is mechanical.** Every 4.x overlay name in §2.4 has a `deprecations.json` entry (4.2/4.3), an `aura-glass/compat` adapter (5.x), a `canonical-names`/`prop-grammar` codemod mapping with fixtures, and a selector change table.

---

## 4. Architecture

### 4.1 Layering

```
consumer JSX ──> aura-glass Dialog.Root / Dialog.Popup / ...   (AuraGlass compound, own types, data-ag-part)
                  │
                  ├─ behaviour: @base-ui/react Dialog / AlertDialog / Popover / Tooltip / Menu / ContextMenu / Menubar / Toast
                  │              (pinned exact, wrapped per PRD-07 pattern; never re-exported)
                  ├─ material:   Surface layer="overlay" via materialProps() (PRD-04)  +  scrim (PRD-04 `variant="scrim"`)
                  ├─ portal:     AuraGlassProvider portal container (PRD-05)  — Base UI `container` prop
                  ├─ motion:     CSS on data-starting-style / data-ending-style / data-open (PRD-06), no JS runtime
                  └─ a11y:       ag.a11y rungs keyed on [data-ag-surface] (PRD-05), focus ring tokens
```

### 4.2 Shared overlay contract (`src/components/overlays/_shared/`, NEW)

Internal, not exported. Every flagship in this PRD uses it; PRD-08 (`Select`, `Combobox` popups), PRD-11 (`DatePicker` popover), PRD-12 (`Citation` preview card) and PRD-NAV (`CommandPalette`) consume it through the public flagship parts or this internal module (PRD-07 decides import boundaries).

| Module (NEW) | Responsibility |
|---|---|
| `overlayPortal.tsx` | `OverlayPortal`: wraps each Base UI `*.Portal` and passes `container` = the provider's `[data-ag-portal-root]` element (PRD-05 §4.5, REQ-A11Y-32; honours the provider `portalContainer` prop). The portal root and its context are owned by PRD-05 (A11Y-049, `src/theme/layers/`); the single accessor is FND's **`usePortalContainer()`** exported from `src/foundation/portal.ts` (FND-007, SC-25), which every Base UI `*.Portal` wrapper uses. This PRD consumes it and defines no accessor of its own. Falls back to `document.body` only when no provider is mounted, with a one-time dev warning |
| `overlaySurface.ts` | `overlayMaterial(kind)` → `materialProps({ layer: "overlay", thickness, variant: "regular" })` table: `dialog`/`alert`/`sheet` → `thick`; `popover`/`menu` → `regular`; `tooltip`/`toast` → `thin`. Adds `data-ag-overlay=<kind>` |
| `scrim.css` (in `ag.components`) | The **only** full-viewport blur in the overlay family: `.ag-scrim` with `backdrop-filter: blur(var(--_ag-scrim-blur))` where `--_ag-scrim-blur` ≤ 12px (§4.7), `background` = solved scrim tint, no `::before`/`::after` optics, no grain |
| `positioning.ts` | Default `Positioner` props for every anchored popup: `sideOffset` = `--ag-space-2` (8px), `collisionPadding` = 8, `collisionAvoidance` flip→shift, `--ag-overlay-available-height` from Base UI `--available-height` |
| `overlayTokens.css` | Duration/ease tokens per overlay kind (from PRD-06), `transform-origin: var(--transform-origin)` (Base UI positioner var) for anchored popups |
| (no counter module) | The dev budget counter is PRD-04's `src/material/dev/surfaceCounter.ts` (REQ-MAT-52), which already counts every visible surface with a non-`none` `::before` `backdrop-filter`, including overlay popups and scrims. This PRD adds no second counter; REQ-OVL-11 only verifies that overlays are counted correctly |

### 4.3 Layer stack, Escape and z-order

- Escape and `inert` across layers are owned by PRD-05's `LayerStack` (PRD-05 §4.5, REQ-A11Y-34): one `keydown` listener in provider code dispatches Escape to the **topmost** registered layer only, and modal layers set `inert` on siblings of the portal root and on lower layers. Within one Base UI popup tree (e.g. Menu → submenu), Base UI's own nested dismissal applies. Every overlay root in this PRD registers with `LayerStack` (`{ id, kind, modal, onEscape }`) through the PRD-07 wrapper and passes `onEscape` → Base UI `onOpenChange(false, { reason: "escape-key" })`; overlay files themselves add nothing on `document`/`window` (REQ-OVL-02). Base UI's per-root Escape handling must not double-fire with `LayerStack`. Decided (SC-25): `LayerStack` (A11Y-049) is the **only** Escape, `inert` and scroll-lock dispatcher, and FND's Base UI wrapping pattern (FND-007) routes Base UI per-root dismissal through `LayerStack`, so no overlay root also handles Escape itself. T-OVL-STACK-01 proves exactly one layer closes per press. The provider portal container is one DOM node; mount order = stacking order. A z-index ladder is **not** used inside the portal; stacking is DOM order within `isolation: isolate` on the container.
- Toast viewport is a sibling region inside the same container and stays above modal layers but is **not** made `inert` by an open modal (Base UI toast viewport is an F6-reachable landmark). Verified by T-OVL-STACK-03.
- Modal layers (`Dialog`, `AlertDialog`, `Sheet` with `modal`) set Base UI `modal` → focus trap + scroll lock + outside `inert`. Non-modal `Popover`/`Menu` never lock scroll.

### 4.4 Modal performance architecture (fix for E-01..E-11)

The 4.x modal is slow because it composites many blurred layers per frame and re-renders while open. 5.0 fixes this by construction:

| Cost source (4.x) | 5.0 mechanism | Owner |
|---|---|---|
| Full-viewport scrim blur + stacked gradient layers (E-03) | One `.ag-scrim` element, blur ≤12px, single background, never animated (opacity-only fade) | this PRD (`scrim.css`) + PRD-04 floor |
| `LiquidGlassMaterial` sampler on the panel (E-04) | Panel is a CSS-only `Surface` (no JS sampling, no observers); `Surface` is server-safe | PRD-04 |
| Nested glass in header/footer/fields (E-05) | §4.6 nesting rule: `.ag-surface .ag-surface:not([data-ag-allow-nested])::before { backdrop-filter: none }`. Dialog parts (`Header`, `Body`, `Footer`) are **not** surfaces; inputs inside render `content-sunken` | PRD-04 rule, verified here |
| Page surfaces still blurring behind the scrim | Under an open modal, the provider sets `data-ag-obscured` on the app root (the element Base UI marks `inert`); the attribute is ratified in the SC-21 registry and set by PRD-05 (A11Y owner); `[data-ag-obscured] .ag-surface::before { backdrop-filter: none }` in `ag.material`. Admitted only if L7 Pixel regression shows ΔE2000 ≤ 2.0 at p95 between with/without over all 8 scenes (the 12px scrim hides the difference); otherwise this row is dropped and recorded | this PRD (attribute), PRD-04 (selector) |
| Infinite animations (E-08/E-09) | No overlay part has an infinite animation. `allowContinuous` (§8) is not consumed by any overlay | this PRD + PRD-06 lint |
| Surveillance effects, `setInterval`, `Date.now()` in render (E-06/E-07/E-11) | Deleted. 4.1.1 (if TRUST accepts, SC-36; else 4.2) removes them from `GlassModal`/`GlassDialog`/`GlassDrawer` as a C-I privacy/perf cut (§13.1 spirit, §13.3) | this PRD (4.1.1 patch, coordinated with PRD-00) |
| `will-change`/`translateZ(0)` always on | `will-change: transform, opacity` only under `[data-ag-animating]` during enter/exit (§4.6) | PRD-04/PRD-06 |
| Body overflow toggling + layout thrash | One reference-counted, `scrollbar-gutter`-aware scroll lock (PRD-05 `LayerStack`, REQ-A11Y-34, the only scroll-lock dispatcher per SC-25); no style writes to `<body>` from overlay files | PRD-05 (A11Y-049) / FND-007 wrapper |

### 4.5 Motion

Enter: popup "materializes" from the anchor — opacity 0→1 and `scale(0.96)`→1 from `var(--transform-origin)` on `[data-starting-style]`, with `--_ag-optics` 0→1 per REQ-MOT-16; exit mirrors on `[data-ending-style]`. Scrim: opacity only. Sheet: `translate` along its side. Durations are PRD-06 tokens, not new overlay tokens: Tooltip/Popover/Menu `--ag-duration-small` (200 ms enter / 140 ms exit), Dialog/AlertDialog/Sheet/Toast `--ag-duration-medium` (320 / 220), full-screen Sheet (`"full"` detent) `--ag-duration-large` (450 / 320); easing `--ag-ease-standard` (exit `--ag-ease-accelerate`). Under `motion: calm` (incl. `prefers-reduced-motion: reduce`): opacity cross-fade only, no transform, durations kept (REQ-MOT-20). Under `motion: none`: no transition; final state visible. `backdrop-filter` and `filter` are never transitioned (§8). Menu→Sheet adaptive morph (`LiquidGlassAdaptiveSheet` lineage) uses PRD-NAV `SourceTransition` and drops optics during `:active-view-transition` (PRD-06).

### 4.6 RSC

Every overlay root, trigger, popup, title and description part is a client module (`"use client"` per leaf file, §9.1), because they wrap Base UI parts that use context. `Dialog.Header`, `Dialog.Body` and `Dialog.Footer` (and the Sheet equivalents) are plain layout `div`s with no hooks and carry no directive; their children may be Server Component output passed through a client part. No overlay is in the server-safe list.

---

## 5. Exact implementation requirements

Each requirement names the test that proves it (§12). "Overlay file" means any file under `src/components/{overlays/_shared,dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/**` (NEW; layout per FND §4.1: one `src/components/<kebab-name>/` directory per flagship with `<Name>.client.tsx`, `<Name>.css`, `<Name>.meta.ts`, `index.ts`; the internal shared module stays in `src/components/overlays/_shared/`).

### 5.1 Shared overlay layer and modal performance (all seven flagships)

- **REQ-OVL-01 — One portal root.** Every overlay `*.Portal` part renders into the `AuraGlassProvider` portal container via `OverlayPortal`. With a provider mounted, `document.body` has zero direct overlay children. Test: `overlay-layer.test.tsx` "portals into provider root".
- **REQ-OVL-02 — No hand-rolled dismissal or scroll lock.** No overlay file contains `document.addEventListener(` / `window.addEventListener(` for `keydown`, `mousedown`, `pointerdown`, `scroll` or `resize`, nor any write to `document.body.style`. Enforced by an ESLint rule `auraglass/no-overlay-global-listeners` (NEW, in `eslint-plugin-auraglass.js`) scoped to `src/components/{overlays/_shared,dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/**`. Test: `lint-overlays.test.ts`.
- **REQ-OVL-03 — Stack-aware Escape.** With Dialog → Popover → Menu open (3 layers), each Escape closes exactly the topmost layer and returns focus to that layer's trigger; 3 presses close all three in reverse order. Outside press closes only layers above the pressed point. Test: `overlay-stack.spec.ts` T-OVL-STACK-01/02.
- **REQ-OVL-04 — Single scrim blur.** A modal overlay renders exactly one `[data-ag-part="backdrop"]` element with class `.ag-scrim`. Its computed `backdrop-filter` blur radius is ≤12px (or `none` in tinted/solid/forced-colors). No other overlay part spans the full viewport with a `backdrop-filter`. Stacked modals: only the **topmost** modal's scrim blurs; lower scrims get `backdrop-filter: none` and keep their tint (`[data-ag-overlay-depth]:not(:last-child)`). Test: `overlays-dialog-perf.spec.ts` "scrim count and radius".
- **REQ-OVL-05 — Zero infinite animations.** Before deleting, attribute each of the 4 infinite animations measured on `glass-modal` (E-09) to a selector or component by running `document.getAnimations()` with `effect.target` + `animationName` in the remote lane, and record the list in the PR. In 5.0, `document.getAnimations().filter(a => a.effect.getTiming().iterations === Infinity)` returns 0 for every overlay story at rest and while open. Test: `overlays-dialog-perf.spec.ts` "no infinite animations".
- **REQ-OVL-06 — No timers or per-frame state while idle.** An open overlay with no user input for 2 s performs 0 React commits (React Profiler `onRender` count = 0 after the enter transition ends) and owns 0 `setInterval`s. Toast timers are Base UI's single timeout per toast (REQ-OVL-64). Test: `overlay-idle.test.tsx`.
- **REQ-OVL-07 — Nested glass inside overlays is inert.** Inside any overlay popup, every descendant `.ag-surface` without `data-ag-allow-nested` has computed `backdrop-filter: none` on `::before`. `Dialog.Header/Body/Footer` do not render `data-ag-surface`. Test: `overlays-dialog-perf.spec.ts` "nested surfaces flat".
- **REQ-OVL-08 — Obscured page (conditional).** While any modal layer is open, the provider sets `data-ag-obscured` on the inert app root and removes it on close. CSS disables `::before` backdrop-filter of `.ag-surface` under `[data-ag-obscured]`. Ships only if AC-OVL-04's pixel check (ΔE2000 p95 ≤2.0 with vs without, 8 scenes) passes; otherwise the attribute is still set (useful for consumers) but the CSS rule is not shipped, and the decision is recorded in the PR. Test: `overlays-dialog-perf.spec.ts` "obscured page".
- **REQ-OVL-09 — `will-change` only while animating.** Overlay popups and scrims carry `data-ag-animating` only between `data-starting-style`/`data-ending-style` start and `transitionend`; computed `will-change` is `auto` at rest. Test: `overlay-motion.spec.ts`.
- **REQ-OVL-10 — No analytics or time in the DOM.** No overlay renders `data-user-stress`, `data-interaction-count`, `data-time-spent`, `data-consciousness-*`, `data-modal-complexity` or `data-dialog-urgency`, and no overlay calls `Date.now()` or `Math.random()` during render (lint: existing `Math.random` ban §6 + PKG's `auraglass/no-random-in-render`, which also covers `Date.now()`/`new Date()` in render, SC-16; this PRD adds no `no-date-now-in-render` rule). Test: `overlay-dom-contract.test.tsx`.
- **REQ-OVL-11 — Dev budget counter coverage.** No overlay-specific counter is built. PRD-04's dev counter (REQ-MAT-52, `src/material/dev/surfaceCounter.ts`) must count an open overlay's scrim as 1 and its popup as 1 (Toast stack as 1 via `SurfaceGroup`) and warn once when the viewport total exceeds 6 at `(hover:hover) and (pointer:fine)` or 3 at `(pointer:coarse)` (§4.7), or when any full-viewport blur exceeds 12px. Test: `overlay-dev-counter.test.tsx` opens each flagship over a fixture with 5 (fine) / 2 (coarse) page surfaces and asserts exactly one warning naming the overlay; production bundle grep for `surfaceCounter` returns 0 (PRD-04 gate).
- **REQ-OVL-12 — Forced colors and solid.** Under `forced-colors: active` and `data-ag-transparency="solid"`, every overlay popup and scrim has computed `backdrop-filter: none`, popup `background-color: Canvas`, `color: CanvasText`, a 1px `CanvasText` border, and the scrim uses `background: color-mix(in srgb, Canvas 60%, transparent)` (fallback `rgb(0 0 0 / .5)` outside forced colors). Visible backdrop-filter count on the modal story = 0 (today 10). Test: `overlay-a11y-modes.spec.ts`.
- **REQ-OVL-13 — Contrast.** Every overlay text pair passes the PRD-03 three-composite gate (on-surface ≥4.5:1, muted large ≥3:1, `contrast=more` ≥7:1) for its kind × thickness, and the OCR pixel gate over all 8 scenes in light and dark. Under `prefers-contrast: more`, popups get the 1px contrasting border and specular off (§7.2). Test: certification L4 Token contrast + L7 Pixel regression lanes, subjects `overlays/*` (PRD-19).
- **REQ-OVL-14 — Anchored popup contract.** Every anchored popup (Popover, Tooltip, Menu, Select/Combobox/DatePicker popups from other PRDs, Citation preview) renders `Positioner` → `Popup` with: `data-ag-part="positioner"|"popup"|"arrow"`, Base UI `data-side`/`data-align`, `transform-origin: var(--transform-origin)`, `max-height: var(--available-height)` with internal scroll, `collisionPadding: 8`, and `overlayMaterial(kind)`. The contract is documented in the selector table and frozen at rc.1. Test: `popup-contract.test.tsx` (parametrised over the 4 kinds owned here).
- **REQ-OVL-15 — Styling/testing contract.** Every part listed in §10 sets `data-ag-part`; open state exposes `data-state="open"|"closed"` in addition to Base UI's `data-open`/`data-closed`. No consumer-facing class names other than `.ag-<component>` and `.ag-<component>__<part>`. Test: `overlay-dom-contract.test.tsx` snapshot of attribute sets (not markup).

### 5.2 Dialog (#15) and AlertDialog (#16)

- **REQ-OVL-16 — Parts.** `Dialog.Root`, `Dialog.Trigger`, `Dialog.Portal`, `Dialog.Backdrop`, `Dialog.Popup`, `Dialog.Header`, `Dialog.Title`, `Dialog.Description`, `Dialog.Body`, `Dialog.Footer`, `Dialog.Close`. `AlertDialog.*` exposes the identical part list over Base UI AlertDialog.
- **REQ-OVL-17 — State API.** `open`, `defaultOpen`, `onOpenChange(open, details)` where `details.reason` is one of `"trigger-press" | "outside-press" | "escape-key" | "close-press" | "imperative"`, and `modal` (default `true`; `false` = non-modal, no scrim, no scroll lock, no inert). `Dialog` closes on outside press by default (`dismissible` default `true`); `AlertDialog` never does (REQ-OVL-27). No `onClose` prop in 5.0 (the compat adapter maps it).
- **REQ-OVL-18 — Roles and names.** `role="dialog"` (or `alertdialog`) and `aria-modal="true"` are on the **popup** element only, never the backdrop (fixes E-14). `aria-labelledby` points to `Dialog.Title`, `aria-describedby` to `Dialog.Description` when present. A Dialog without a `Title` and without `aria-label` logs a dev error. Test: `Dialog.test.tsx` "role on popup", "dev error without name".
- **REQ-OVL-19 — Focus.** On open, focus moves to `initialFocus` (ref or function) or else the first tabbable in `Body`, else the popup. On close, focus returns to the trigger or `finalFocus`. One focus manager only (Base UI); `FocusTrap` from `src/primitives/focus/FocusTrap.tsx` is not imported. Tab and Shift+Tab cycle inside the popup. Test: `dialog.apg.spec.ts`.
- **REQ-OVL-20 — Background inert.** While a modal Dialog is open, every element outside the portal layer is `inert` (or `aria-hidden` + no focus where `inert` is unsupported, Base UI behaviour), and page scroll is locked without layout shift (`scrollbar-gutter` compensation, measured: `document.documentElement.clientWidth` unchanged ±0px). Test: `dialog.apg.spec.ts` "inert background", "no layout shift on lock".
- **REQ-OVL-21 — Sizes.** `size: "sm" | "md" | "lg" | "xl" | "full"` → max inline size 400 / 560 / 720 / 960px / `100dvw` with `--ag-space-4` viewport inset; block size ≤ `calc(100dvh - 2 * var(--ag-space-4))`, `Body` scrolls internally, `Header`/`Footer` stay visible. `full` removes the inset and radius below 640px container width. Test: `Dialog.test.tsx` + visual baselines.
- **REQ-OVL-22 — Material.** Popup: `Surface layer="overlay" thickness="thick"`, radius `--ag-radius-xl` (concentric for inner controls via `ConcentricFrame`, §4.6). Backdrop: `.ag-scrim`. No `material` / `backdropBlur` / `blur` props (the material is not configurable per instance beyond `variant: "regular" | "identity"` and `prominent`). Test: `Dialog.test.tsx` "material attributes".
- **REQ-OVL-23 — Nested dialogs.** A Dialog opened from inside a Dialog stacks above it; the parent popup gets `data-ag-nested-open` and scales to 0.98 / dims via `--_ag-surface-alpha` (no host opacity, §4.6). Only the top scrim blurs (REQ-OVL-04). Test: `overlay-stack.spec.ts` T-OVL-STACK-04.
- **REQ-OVL-24 — Contained mode removed from Dialog.** 4.x `isContained` (non-portal, in-flow modal) is not a Dialog mode in 5.0; in-flow panels use `Card`/`Surface`. The compat adapter renders `Surface` for `isContained` with a dev warning. Test: `compat/Dialog.compat.test.tsx`.
- **REQ-OVL-25 — Form submit.** `Dialog.Popup` accepts `render={<form />}` (Base UI `render` composition); submitting does not close unless the consumer calls `onOpenChange(false)`. Test: `Dialog.test.tsx` "form render".
- **REQ-OVL-26 — AlertDialog actions.** `AlertDialog.Footer` lays out `AlertDialog.Close` (cancel) and an action `Button`; the default initial focus is the **least destructive** action (`AlertDialog.Close`) per APG. `intent="danger"` sets the action button's `intent` only, never the surface tint. Test: `alert-dialog.apg.spec.ts`.
- **REQ-OVL-27 — AlertDialog dismissal.** Outside press never closes an AlertDialog. Escape closes it (APG) and fires `onOpenChange(false, { reason: "escape-key" })`. Test: `alert-dialog.apg.spec.ts`.
- **REQ-OVL-28 — Confirm helper (registry, not export).** The 4.x "modal confirm variants" become a registry item `confirm-dialog` (D-17 pattern) built on `AlertDialog`, not a new root export (D-15). Test: registry render check (PRD-18 `verify-recipes-render.js` successor).
- **REQ-OVL-29 — Open performance.** Opening a Dialog from a click to the first frame with the popup painted at `opacity > 0` takes ≤100 ms at 4× CPU throttle in the remote L10 Performance lane, and the enter transition produces no long task >50 ms. Window split (binding for the perf spec): window A = trigger click → `transitionend` of the popup enter transition (no long task >50 ms); window B = the 5 s starting at the end of window A (§16.1 long-task budget: ≤2 tasks, ≤150 ms total, none >80 ms). The windows do not overlap. Test: `overlays-dialog-perf.spec.ts` "open latency".

### 5.3 Sheet (#17)

- **REQ-OVL-30 — Parts and API.** `Sheet.Root`, `Trigger`, `Portal`, `Backdrop`, `Popup`, `Handle`, `Header`, `Title`, `Description`, `Body`, `Footer`, `Close`, built on Base UI Dialog (D-13 table: "BU Dialog + Own detents"). Props: `side: "start" | "end" | "top" | "bottom" | "left" | "right"` (default `"end"`; `start`/`end` are logical and flip under `dir="rtl"`, `left`/`right` are physical and never flip; PRD-NAV's drawer uses `side="start"`), `modal` (default `true`), `open`/`defaultOpen`/`onOpenChange` as REQ-OVL-17.
- **REQ-OVL-31 — Presets.** `preset: "panel" | "action"`. `action` = `side="bottom"`, content is a list of `Sheet.Action` items (`<button>` with `role` default) plus a separated cancel `Sheet.Close`, replacing `GlassActionSheet`. It is a preset of `Sheet`, not a new export.
- **REQ-OVL-32 — Detents (bottom only).** `detents?: Array<number | "content" | "full">` (fractions of `100dvh`, e.g. `[0.5, "full"]`), `detent`/`defaultDetent`/`onDetentChange(index)`. Default: `["content"]`. Drag on `Sheet.Handle` (pointer events, `touch-action: none` on the handle only) moves the popup with `transform: translateY()` only; release snaps to the nearest detent by position + velocity (velocity threshold 0.5 px/ms), and a downward fling past the lowest detent closes the sheet. Without the optional `motion` peer, snapping uses a CSS `linear()` spring transition (D-25); with `aura-glass/motion` installed, drag-release uses its spring adapter. No layout properties are animated.
- **REQ-OVL-33 — Detent keyboard and a11y.** `Sheet.Handle` is a `<button>` with `aria-label="Resize sheet"` (localisable via `labels.handle`), and `aria-valuetext`-style announcement of the current detent through the provider announcer ("Half height", "Full height"). Enter/Space cycles detents upward; Escape closes. Detents never trap content: at every detent, `Body` is scrollable and focusable content is reachable. Test: `sheet.apg.spec.ts`.
- **REQ-OVL-34 — Full-height floor.** When the active detent is `"full"` or the sheet is a side sheet (`start`/`end`/`left`/`right`) with block size ≥ 90% of the viewport, the popup sets `data-ag-full-height` (the PRD-04 attribute, REQ-MAT-28) and the resolved transparency rises to at least `tinted` for that popup (§4.6 P10). Test: `Sheet.test.tsx` "full height raises floor" asserts the attribute and the computed `tinted` fill from PRD-04's CSS.
- **REQ-OVL-35 — Safe areas.** Bottom sheets pad `env(safe-area-inset-bottom)`; side sheets pad `env(safe-area-inset-left|right)` on their outer edge; top sheets pad `env(safe-area-inset-top)`. Test: visual baseline at 390×844 with emulated insets.
- **REQ-OVL-36 — Sizes.** Side sheets: `size: "sm" | "md" | "lg"` → inline size 320 / 400 / 560px, capped at `calc(100vw - 48px)`; at container width <640px side sheets become full width. Bottom/top: block size from detents, max `calc(100dvh - env(safe-area-inset-top) - 8px)`.
- **REQ-OVL-37 — Non-modal sheets.** `modal={false}` renders no scrim, no inert, no scroll lock, and is used by PRD-NAV for the inspector drawer on mobile. Focus moves into the sheet on open and returns on close; Tab can leave the sheet. Test: `Sheet.test.tsx` "non-modal".
- **REQ-OVL-38 — Single blur.** A modal Sheet obeys REQ-OVL-04 (one scrim ≤12px) and REQ-OVL-07. The popup blur is the PRD-04 `thick` value (32px at `(pointer:fine)`, 20px at `(pointer:coarse)`, REQ-MAT-29 / `responsive.spec.ts`); no sheet-specific radius is introduced here. Full-height sheets keep that radius but resolve `tinted` (REQ-OVL-34), so legibility does not depend on blur.
- **REQ-OVL-39 — Drag performance.** During a handle drag, 0 React commits per pointermove (position written to a CSS custom property or `style.transform` on the popup ref inside rAF), and frame time p95 ≤16.7 ms on the remote 120 Hz desktop profile and ≤33 ms on emulated mid-tier mobile. Test: `overlays-sheet-perf.spec.ts`.

### 5.4 Popover (#18), including hover mode

- **REQ-OVL-40 — Parts and hover mode.** `Popover.Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Arrow`, `Title`, `Description`, `Close`. `Popover.Trigger` accepts `openOnHover` (default `false`), `delay` (default 300 ms) and `closeDelay` (default 150 ms); this replaces `GlassHoverCard`. Hover-opened popovers also open on focus of the trigger and stay open while the pointer is over the popup (WCAG 1.4.13 hoverable/persistent/dismissible).
- **REQ-OVL-41 — Positioning.** `side` (`top|right|bottom|left|inline-start|inline-end`, default `bottom`), `align` (`start|center|end`, default `center`), `sideOffset` (default 8), `collisionPadding` (default 8) on `Popover.Positioner`. Flips and shifts within the viewport; never overflows horizontally at 390px. Repositioning on scroll/resize is Base UI's (`autoUpdate` equivalent) — no AuraGlass listeners (REQ-OVL-02). Test: `popover.spec.ts` "collision at 390".
- **REQ-OVL-42 — Focus and dismissal.** Click-opened popover moves focus into the popup (first tabbable, else popup with `tabIndex=-1`) and restores it on close; Escape and outside press close. Non-modal by default (`modal={false}`, no scroll lock); `modal="trap-focus"` traps focus without scroll lock or scrim. Test: `popover.apg.spec.ts`.
- **REQ-OVL-43 — Roles.** Click popover: trigger has `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`; popup `role="dialog"` labelled by `Popover.Title` when present. Hover-mode popover with non-interactive content is announced via `aria-describedby` on the trigger. Test: `Popover.test.tsx`.
- **REQ-OVL-44 — Material.** `overlayMaterial("popover")` (regular); `Arrow` uses the popup's fill + rim (no second `backdrop-filter`: the arrow is a clipped child of the popup's backdrop layer or a solid-fill triangle matching `--ag-surface-fill`). Test: `overlays-dialog-perf.spec.ts`-style count: an open Popover adds exactly 1 blurred layer.
- **REQ-OVL-45 — Replaces Positioner.** `src/primitives/Positioner.tsx` and `src/primitives/positioning/GlassPositioner.tsx` are not imported by any 5.0 overlay; on the 5.0 branch they are deleted (PRD-16 coordinates) and `Positioner`/`GlassPositioner` resolve through `aura-glass/compat` to an adapter that renders `Popover.Positioner` semantics with a dev warning.

### 5.5 Tooltip (#19)

- **REQ-OVL-46 — Parts and provider.** `Tooltip.Provider` (shared `delay` default 600 ms, `closeDelay` 0, and skip-delay window 400 ms so moving between adjacent triggers opens instantly), `Tooltip.Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Arrow`. `AuraGlassProvider` mounts one `Tooltip.Provider` by default, so standalone tooltips need no wrapper.
- **REQ-OVL-47 — Triggers (fixes ACCESSIBILITY-10).** Opens on pointer hover **and** on keyboard focus (`:focus-visible` only, not on mouse-click focus); closes on blur, pointer leave (after `closeDelay`), Escape, and trigger press. `aria-describedby` is set on the **focusable trigger element** itself (the `render`ed child), never on a wrapper. Test: `tooltip.apg.spec.ts` "focus opens", "Escape closes", "describedby on trigger".
- **REQ-OVL-48 — WCAG 1.4.13.** Pointer can move from trigger onto the tooltip without it closing (`hoverable` default `true`); Escape dismisses without moving focus. Test: `tooltip.apg.spec.ts` "hoverable".
- **REQ-OVL-49 — Content rules.** Tooltip popup content is plain text or inline formatting; interactive descendants (`a`, `button`, `input`, `[tabindex]`) in `Tooltip.Popup` log a dev error pointing to `Popover openOnHover`. Max inline size 280px; text wraps. Test: `Tooltip.test.tsx` "dev error on interactive content".
- **REQ-OVL-50 — Touch.** On `(pointer: coarse)`, tooltips do not open on tap of an actionable trigger (no hover on touch); a long-press (≥500 ms) on the trigger opens it and it closes on the next tap outside. `IconButton` (PRD-08) requires `aria-label` regardless, so no information is tooltip-only. Test: `tooltip.touch.spec.ts` (emulated `hasTouch`).
- **REQ-OVL-51 — Material and cost.** `overlayMaterial("tooltip")` (thin), blur 12px (PRD-04 `thin`), `contain: layout paint` is **not** applied to the popup (it would create a backdrop root, §4.6). Enter `--ag-duration-small` (200 ms) opacity + 2px translate from `data-side`, exit `--ag-duration-small-exit` (140 ms); calm = opacity only. An open tooltip adds exactly 1 blurred layer. Delete the duplicate `GlassTooltip` in `GlassPopover.tsx:678`.

### 5.6 Menu (#20), ContextMenu, Menubar

- **REQ-OVL-52 — Menu parts (canonical naming from `GlassDropdownMenu`).** `Menu.Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Item`, `LinkItem`, `CheckboxItem`, `CheckboxItemIndicator`, `RadioGroup`, `RadioItem`, `RadioItemIndicator`, `Group`, `GroupLabel`, `Separator`, `Shortcut`, `SubmenuRoot`, `SubmenuTrigger`, `Arrow`. The 4.x part names map 1:1 in the codemod (§10.3).
- **REQ-OVL-53 — Menu keyboard (APG menu button).** Enter/Space/ArrowDown on trigger open and focus the first item; ArrowUp opens and focuses the last; Arrow keys move with wrap (`loop` default `true`); Home/End; printable-character **typeahead** (500 ms buffer); ArrowRight opens a submenu and focuses its first item, ArrowLeft closes it; Escape closes the current level and restores focus to its trigger; **Tab closes the whole menu and moves focus to the next tabbable after the trigger** (fixes the 4.x `FocusScope loop` trap, ACCESSIBILITY-12). Roving focus: exactly one item has `tabIndex=0` at any time (Base UI virtual/roving focus). Test: `menu.apg.spec.ts`.
- **REQ-OVL-54 — Item semantics.** `role="menuitem" | "menuitemcheckbox" | "menuitemradio"`; `aria-checked` true/false/`"mixed"` (`CheckboxItem checked="indeterminate"`); disabled items stay focusable with `aria-disabled="true"` and keep a visible focus ring (fixes ACCESSIBILITY-14 for menus); `closeOnClick` default `true` for `Item`, `false` for `CheckboxItem`/`RadioItem`. `Shortcut` renders `aria-hidden` text and sets `aria-keyshortcuts` on its item. Test: `Menu.test.tsx`.
- **REQ-OVL-55 — Hover-open submenus.** Submenus open on hover after 100 ms with pointer-safe triangle (Base UI) and on ArrowRight; `openOnHover` on `Menu.Trigger` is supported for menubar-style navigation only.
- **REQ-OVL-56 — ContextMenu.** `ContextMenu.Root`, `ContextMenu.Trigger` (the region), then the same `Menu` popup parts. Opens on `contextmenu` event, Shift+F10, and the ContextMenu key at the pointer / focused element position; focuses the first item; restores focus to the previously focused element on close; outside press closes only after hit-testing the popup (fixes E-20). On touch, long-press 500 ms opens it. Test: `context-menu.apg.spec.ts`.
- **REQ-OVL-57 — Menubar.** `Menubar` root (`role="menubar"`, `aria-orientation="horizontal"`) containing `Menu.Root` children whose triggers are `role="menuitem"`. One tab stop for the whole bar (roving); ArrowLeft/Right move between top-level triggers and, when a menu is open, move the open menu; ArrowDown opens; Escape closes and returns focus to the top-level trigger (never `blur()`, fixes E-21); `loop` default `true`. Test: `menubar.apg.spec.ts`.
- **REQ-OVL-58 — Menu material and density.** `overlayMaterial("menu")` (regular). Items: block size 32px at `(pointer: fine)`, 44px at `(pointer: coarse)` (§6 targets); inline padding `--ag-space-3`; highlighted item uses `--ag-surface-fill` raised one step + rim, no per-item backdrop-filter. Popup `max-height: var(--available-height)`, scrolls internally with `ScrollArea`-equivalent overflow. Test: `Menu.test.tsx` "coarse target size" (computed style) and visual baselines.
- **REQ-OVL-59 — 4.x menu consolidation.** `LiquidGlassPopoverMenu`, `HeaderUserMenu`, `GlassMenuPrimitive` and `CollapsedMenu` have no 5.0 implementation of their own: `HeaderUserMenu` becomes registry item `account-menu`; `CollapsedMenu` is replaced by `Menu` in PRD-NAV's TabBar overflow; the others map to `Menu` in `canonical-names`.

### 5.7 Dialog shell for CommandPalette (owned by PRD-NAV)

- **REQ-OVL-60 — Shell contract.** `Dialog` supports the palette use case without palette-specific props: `Dialog.Popup` accepts `initialFocus` targeting the Command input; `size="lg"` with `placement="top"` (NEW prop, Dialog only: `"center" | "top"`, `top` = block-start offset `min(20dvh, 160px)`); `Dialog.Body` has a `padding="none"` option. PRD-NAV's `CommandPalette` must render through these public parts and add no scrim or blur of its own; this PRD's REQ-OVL-04/-06 tests run against `CommandPalette` stories too (shared subject list).

### 5.8 Toast (#21) and notification history

- **REQ-OVL-61 — One store.** `Toast.Provider` (mounted by `AuraGlassProvider`; props `limit` default 3 visible, `timeout` default 5,000 ms, `position: "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end"` default `"bottom-end"`, `history: { limit: number } | false` default `false`), `Toast.Viewport`, `Toast.Root`, `Title`, `Description`, `Action`, `Close`, and `useToast()` returning `{ toast, update, dismiss, promise, toasts, history }` (thin wrapper over Base UI `useToastManager`). A second provider inside the tree logs a dev error. The three 4.x stores (E-28) are deleted.
- **REQ-OVL-62 — Call signature.** `toast({ title, description?, intent?: "neutral" | "info" | "success" | "warning" | "danger", action?: { label, onClick, altText }, duration?: number | Infinity, priority?: "polite" | "assertive", id? }) → id`. `type` is not accepted (compat maps `type` → `intent`). `promise(p, { loading, success, error })` updates one toast in place.
- **REQ-OVL-63 — Announcements.** The viewport is a labelled region (`aria-label="Notifications"`, localisable) reachable with F6 (Base UI). `priority="polite"` toasts announce through `role="status"`; `assertive` through `role="alert"` and is allowed only for `intent="danger"` (dev warning otherwise). Base UI's toast live semantics inside the provider's toast region (PRD-05) are the **only** announcement path for toasts: toasts do not also call the provider announcer, so each toast is announced exactly once. Test: `toast.apg.spec.ts` with an accessibility-tree snapshot, asserting one live-region entry per toast.
- **REQ-OVL-64 — Timers.** One timeout per toast (Base UI), paused on viewport hover, on focus within the viewport, and while `document.visibilityState === "hidden"`; resumed with the remaining time. Toasts with an `action` default to `duration: Infinity` unless set (WCAG 2.2.1 — an action must not time out before it can be used). The progress indicator (optional `Toast.Progress` part) is a CSS animation of `scale` on `--_ag-toast-progress` driven by `animation-duration` and `animation-play-state`, with **0 React commits** while counting down (replaces `GlassToast.tsx:153-169`). Test: `toast-timers.test.tsx`, `overlay-idle.test.tsx`.
- **REQ-OVL-65 — Stacking and swipe.** Up to `limit` toasts visible, older ones collapsed behind with `--toast-index` (Base UI var) driving a translate + scale of 0.04 per index; expanded on hover/focus. Swipe-to-dismiss in the direction of `position` edge (threshold 40% of width or velocity 0.5 px/ms), `transform` only. Test: `toast.touch.spec.ts`.
- **REQ-OVL-66 — Material.** Each toast is `overlayMaterial("toast")` (thin), radius `--ag-radius-lg`. Collapsed stacks are wrapped in one `SurfaceGroup` so the stack shares **one** `backdrop-filter` (P11); 3 visible toasts add 1 blurred layer, not 3. `intent` tints only the leading icon and a 3px inline-start rim (`--ag-color-<intent>`), never the glass fill. Test: `Toast.test.tsx` "stack shares one backdrop".
- **REQ-OVL-67 — Notification history (replaces `GlassNotificationCenter`).** With `history: { limit: 50 }`, dismissed and expired toasts move to `useToast().history` (`{ id, title, description, intent, createdAt, read }`), and `Toast.History` renders them as `role="list"` with `Toast.HistoryItem` (`role="listitem"`) and `markRead(id)`, `markAllRead()`, `clear()` callbacks. `Toast.History` has no overlay of its own: products place it inside a `Popover` or `Sheet` (story: "Notification center in Sheet"). Unread count is exposed as `history.unread` for a `Badge`. No `<style>` injection (fixes E-30); persistence is the consumer's (no storage writes).
- **REQ-OVL-68 — No import side effects.** Importing `Toast` (or any overlay) performs no DOM mutation, no listener registration and no `<style>` injection (§3.3 jsdom gate). Test: L2 Artifact lane side-effect gate (PRD-02) with overlay entries listed.
- **REQ-OVL-69 — `GlassAchievementNotifications` is not migrated.** It is removed with the `advanced` family (inventory REMOVE, PRD-16); the `removed` codemod emits a TODO pointing to `toast()`.

### 5.9 4.x line deliverables (coordinated with PRD-00 / PRD-17)

- **REQ-OVL-70 — Privacy cut on 4.x (C-I, privacy class; 4.1.1 only through TRUST intake, else 4.2).** Per SC-36, TRUST is the only owner of 4.1.1 contents and this item is not in the accepted list; it is filed with TRUST as a §13.1 privacy-class candidate (open item §21). Until TRUST accepts it, it ships on the 4.2 train (REL). In `GlassModal.tsx`, `GlassDialog.tsx` and `GlassDrawer.tsx`: remove the analytics `data-*` attributes and `Date.now()`-in-render (E-11), and make the consciousness/predictive/eye-tracking/biometric effects (E-06/E-07, incl. the `setInterval`s at `GlassModal.tsx:581`, `GlassDialog.tsx:339,451`, `GlassDrawer.tsx:487`) no-ops that log a one-time dev deprecation. Public props stay in the types (no C-B on 4.x). Default rendering must be pixel-identical (visual-class gate, D-27). Test: existing `GlassModal.test.tsx`, `GlassDialog.test.tsx`, `GlassDrawer.test.tsx` updated to assert absence of the attributes; remote pixel diff = 0 on `glass-modal`, `glass-dialog`, `glass-drawer` default stories.
- **REQ-OVL-71 — 4.2 modal frame-rate fix on 4.x (C-I, visual-neutral).** Perf fixes are not §13.1-class, so this ships on 4.2 (SC-36 deferral rule, same as the MOT FPS-loop fix), never 4.1.1. On 4.x, stop infinite animations on overlay layers while open and idle (after attribution, REQ-OVL-05) **only if** the pixel diff of the default story's settled frame is 0. The `sm`/`md`/`lg` → same-class bug in `backdropBlurClasses` (`GlassModal.tsx:738-743`) is **not** fixed on 4.x, because changing it is a visible pixel change (D-27); 5.0 removes the prop. Target on 4.x: `glass-modal` ≥30 fps in the same remote harness (from 12). If 30 is unreachable without a visible change, record the measurement and defer to 5.0.
- **REQ-OVL-72 — 4.2 forced-colors coverage (C-I visual bug fix, D-28 class).** Add the modal scrim and panel classes and `.liquid-glass-modal-surface` to the forced-colors and reduced-transparency fallback blocks in `src/styles/glass.css:4022-4123`, so `glass-modal` visible backdrop-filters go 12 → 0 under `forced-colors: active`. Labelled as a visual bug fix with before/after composites.
- **REQ-OVL-73 — 4.2 deprecations (C-D).** Entries in the repo-root `deprecations.json` (envelope `{"$schema": "./docs/schemas/deprecations.schema.json", "version": 1, "entries": [...]}`, SC-02; schema and gate owned by REL, REL-010; file seeded by TRUST-075; this PRD only adds entries by MODIFY, `codemod` field is an SC-33 id or null) + one-time dev warnings through REL-072 `warnDeprecated(id)` for: `GlassModal` props `consciousness`, `predictive`, `adaptive`, `eyeTracking`, `trackAchievements`, `isContained`, `material`, `materialProps`, `backdropBlur`; `GlassDialog`/`GlassDrawer` equivalents; `feedback/GlassToast` (unexported, file removal only); `GlassNotificationCenter`, `GlassNotificationProvider`, `useNotifications`; `Positioner`/`GlassPositioner`; `aura-glass/overlays` subpath. Warnings say "removed in 5.0".
- **REQ-OVL-74 — 4.3 rename deprecations (C-D).** Every overlay name in §2.4 that has a 5.0 successor gets a C-D entry naming it (`GlassModal` → `Dialog`, `GlassDrawer` → `Sheet`, …), consumed by the PRD-18 codemods and the PRD-20 migration guide.

### 5.10 Cross-cutting deliverables per flagship (§11.3)

- **REQ-OVL-75 — Typed variant metadata.** `src/components/<kebab-name>/<Name>.meta.ts` (NEW) per flagship: parts, `data-ag-part` values, states, variants, thickness, budgets, APG pattern URL, 4.x lineage. It drives the docs, the Material Lab matrices (§13) and the codemod tables.
- **REQ-OVL-76 — Selector change tables.** `docs/auraglass-5/migration/overlays-selectors.md` (NEW, generated from `.meta.ts`): 4.x selector/role/attribute → 5.0 `data-ag-part`/`data-state`, per component.
- **REQ-OVL-77 — Size budgets.** Each flagship has a per-import row in `docs/size-budgets.json` (integer bytes min+gz, peers external; file, schema and gate `scripts/ci/verify-size-budgets.mjs` owned by PKG, PKG-048/049; changes logged in `docs/size-budgets.changelog.md`; SC-15). There is no `size-limit`, `.size-limit.json` or `build/budgets.lock.json`. `Dialog` ≤20 KB min+gz is fixed by §3.6; the following rows are submitted by this PRD and accepted by SC-15 (errata E-06 makes the budget file the §3.6 source of truth): `AlertDialog` ≤20, `Sheet` ≤24, `Popover` ≤14, `Tooltip` ≤10, `Menu` (incl. ContextMenu, Menubar parts) ≤22, `Toast` ≤14 KB. Overlay CSS rows use PERF REQ-PERF-01 default ceiling (8 KB gz per subpath CSS) unless calibration supports a stricter row (a row may be stricter, never looser). All are calibrated at 5.0.0-alpha.1 by QA L10 Performance and then only ratchet down (D-26).
- **REQ-OVL-78 — Compat adapters.** `aura-glass/compat` exports `GlassModal`, `GlassDialog`, `GlassDrawer`, `GlassBottomSheet`, `GlassActionSheet`, `LiquidGlassAdaptiveSheet`, `GlassPopover`, `GlassHoverCard`, `GlassTooltip`, `GlassDropdownMenu*` parts, `GlassContextMenu`, `GlassMenubar`, `LiquidGlassPopoverMenu`, `GlassToast`, `GlassToastProvider`, `GlassToastViewport`, `useToast`, `GlassNotificationCenter` (→ `Toast.History` inside `Popover`), each mapping props per §10.2 and warning once per symbol per page load (dev only). Adapters for removed props (`consciousness`, …) drop them silently after the one warning. PRD-18 owns the compat package; this PRD supplies the mapping tables and fixtures.
- **REQ-OVL-79 — Registry usage.** Registry layout, schema, `registry.json`, build, lint and render harness are owned by DX (SC-32, DX-067). This PRD owns the content of the GA block `overlay-flows` (`registry/blocks/overlay-flows/`, scaffolded and registered by DX-076, content by OVL-164: Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, Toast in one flow) and contributes overlay usage to the DX-owned blocks through DX tasks. Each flagship appears in at least one registry block: `overlay-flows` (all seven), `settings` (Dialog, AlertDialog, Toast), `support-inbox` (Sheet, Menu, ContextMenu, Popover), `mobile-settings` (bottom Sheet with detents, action Sheet), `auth` (Tooltip on IconButtons).

---

## 6. Files/directories affected (existing paths)

All verified to exist at HEAD 15b6de6f7.

| Path | Change | Release |
|---|---|---|
| `src/components/modal/GlassModal.tsx` | 4.1.1 cuts (REQ-OVL-70); 4.2 C-D warnings; deleted on 5.0 branch (successor `Dialog`) | 4.1.1, 4.2, 5.0 |
| `src/components/modal/GlassDialog.tsx` | same as above | 4.1.1, 4.2, 5.0 |
| `src/components/modal/GlassDrawer.tsx` | same as above (successor `Sheet`) | 4.1.1, 4.2, 5.0 |
| `src/components/modal/GlassBottomSheet.tsx`, `LiquidGlassAdaptiveSheet.tsx` | C-D 4.3; deleted 5.0 | 4.3, 5.0 |
| `src/components/modal/GlassPopover.tsx` (incl. duplicate `GlassTooltip` at `:678`), `GlassHoverCard.tsx`, `GlassTooltip.tsx`, `LiquidGlassPopoverMenu.tsx` | C-D 4.3; deleted 5.0 | 4.3, 5.0 |
| `src/components/modal/index.ts`, `src/components/modal/types.ts` | deleted 5.0 | 5.0 |
| `src/components/modal/*.stories.tsx`, `*.test.tsx`, `__snapshots__/` | 4.x tests updated for REQ-OVL-70/-72; deleted 5.0 (replaced by §12/§13 files) | 4.1.1, 5.0 |
| `src/components/mobile/GlassActionSheet.tsx`, `src/components/mobile/TouchGlassOptimization.tsx` (`MobileGlassBottomSheet`) | C-D; deleted 5.0 | 4.3, 5.0 |
| `src/components/navigation/GlassDropdownMenu.tsx` | Lineage template for `Menu` parts; C-D 4.3; deleted 5.0 | 4.3, 5.0 |
| `src/components/navigation/GlassContextMenu.tsx`, `GlassMenubar.tsx`, `GlassMenuPrimitive.tsx`, `HeaderUserMenu.tsx`, `components/CollapsedMenu.tsx` | C-D; deleted 5.0 | 4.3, 5.0 |
| `src/components/data-display/GlassToast.tsx`, `GlassToastProvider.tsx`, `GlassNotificationCenter.tsx` | C-D; deleted 5.0. `GlassNotificationCenter.tsx:471-474` style injection moved into CSS on 4.2 (C-I) so the side-effect gate passes | 4.2, 4.3, 5.0 |
| `src/components/feedback/GlassToast.tsx` | unexported duplicate; deleted 4.2 (no public API) | 4.2 |
| `src/components/interactive/GlassCommandPalette.tsx`, `LiquidGlassCommandSurface.tsx` | owned by PRD-NAV; listed because they must consume REQ-OVL-60 | 5.0 |
| `src/primitives/Positioner.tsx`, `src/primitives/positioning/GlassPositioner.tsx` | C-D 4.2; deleted 5.0 | 4.2, 5.0 |
| `src/primitives/focus/FocusTrap.tsx`, `src/utils/a11yEnhancers.tsx` (`FocusTrap` at `:179`) | not used by any 5.0 overlay; deletion owned by PRD-07/PRD-16 | 5.0 |
| `src/primitives/FocusScope.tsx`, `src/primitives/DismissableLayer.tsx`, `src/primitives/portal/GlassPortal.tsx` | KEEP primitives (§6); this PRD's overlays do **not** use them internally (Base UI does the work); PRD-07 keeps them as public escape hatches | — |
| `src/overlays/index.ts` | `aura-glass/overlays` subpath: C-D 4.2, removed 5.0 (§3.2) | 4.2, 5.0 |
| `src/index.ts:93-110, 178-192, 317-340` | root overlay exports: replaced by 5.0 names | 5.0 |
| `src/styles/glass.css:4022-4123` | 4.2 forced-colors/reduced-transparency selector additions (REQ-OVL-72), on `release/4.x` only; removal of `glass.css` on the 5.0 branch is MOT-084 (SC-20) | 4.2 |
| `src/styles/glass.css:622,643,648` | infinite keyframes: attribution (REQ-OVL-05); not imported by 5.0 overlays | 4.x, 5.0 |
| `eslint-plugin-auraglass.js` | MODIFY (plugin owned by PKG, wired by PKG-015; SC-16): add `auraglass/no-overlay-global-listeners` (OVL-owned rule). `Date.now()`/`new Date()` in render is covered by PKG `auraglass/no-random-in-render`, consumed here | 5.0-alpha |
| `.storybook/preview.tsx` | overlay stories use the Material Lab `environment` global (PRD-19) | 5.0 |
| `playwright.config.ts`, `certification/playwright.cert.config.ts` | MODIFY (files owned by QA, SC-29): add overlay behaviour and perf projects after QA-003/QA-018 (run remotely only) | 5.0-alpha |
| `tests/visual/components/` | 4.x overlay baselines kept for the 4.x visual-class gate | 4.x |
| `scripts/ci/verify-pack.js`, `scripts/ci/verify-side-effects.mjs` | no change from this PRD; overlay entries covered by PKG-042 side-effect gate (SC-11 layout) | — |

---

## 7. Components affected

| 5.0 flagship | 4.x components absorbed (root-exported unless noted) | Disposition | Codemod class (§12) |
|---|---|---|---|
| `Dialog` (#15) | `GlassModal` (REDESIGN, candidate), `GlassDialog` (CONSOLIDATE) | replaced | mostly (`onClose`→`onOpenChange`, `title`/`description` props → parts) |
| `AlertDialog` (#16) | `GlassModal role="alertdialog"` / confirm variants | replaced | mostly |
| `Sheet` (#17) | `GlassDrawer`, `GlassBottomSheet`, `GlassActionSheet`, `LiquidGlassAdaptiveSheet`, `MobileGlassBottomSheet` (REMOVE, pointer only); `GlassMobileNav` per §11.2 (its drawer behaviour; nav content is PRD-NAV) | replaced | mostly (`position`/`placement` → `side`, `snapPoints` → `detents` where present) |
| `Popover` (#18) | `GlassPopover` (REDESIGN), `GlassHoverCard` (CONSOLIDATE, → `openOnHover`), `Positioner`/`GlassPositioner` (REPLACE) | replaced | mostly |
| `Tooltip` (#19) | `GlassTooltip` (REDESIGN), duplicate `GlassTooltip` in `GlassPopover.tsx`, `ChartTooltip` (shared positioning only; chart content stays PRD-11) | replaced | mostly (`content` prop → `Tooltip.Popup` children via adapter) |
| `Menu` / `ContextMenu` / `Menubar` (#20) | `GlassDropdownMenu` + 12 parts (POLISH, candidate), `GlassContextMenu` (REPLACE), `GlassMenubar` (REDESIGN), `GlassMenuPrimitive`, `HeaderUserMenu` (not root-exported), `LiquidGlassPopoverMenu`, `CollapsedMenu` (not root-exported) | replaced | full for DropdownMenu parts; mostly for others |
| `Toast` (#21) | `GlassToast` + `GlassToastProvider` + `GlassToastViewport` + `useToast` (REDESIGN, candidate), `feedback/GlassToast` (REMOVE), `GlassNotificationCenter` + `GlassNotificationItem` + `GlassNotificationProvider` + `useNotifications` (CONSOLIDATE) | replaced | mostly (`type`→`intent`, `onClose`→`onOpenChange`/`dismiss(id)`) |

Consumers of the overlay contract in other PRDs (must be re-verified when this PRD changes the contract): `Select`, `Combobox` (PRD-08); `DatePicker`, `DateRangePicker`, `FilterBar` popovers (PRD-11); `Citation`/`SourceList` (PRD-12); `CommandPalette`, `AppShell` mobile drawer, `Sidebar` overlay mode, `TabBar` overflow (PRD-NAV); `ImageViewer` (PRD-13); `Tour` (PRD-14, "Tour (on Popover)").

---

## 8. New components/files

All NEW. Directory layout follows FND §4.1 (`src/components/<kebab-name>/`, `<Name>.client.tsx` for interactive parts with `"use client"`, `<Name>.css` in `@layer ag.components`, `<Name>.meta.ts` per SC-27, `index.ts` named re-exports). The internal shared module is `src/components/overlays/_shared/`.

| Path (NEW) | Purpose |
|---|---|
| `src/components/overlays/_shared/overlayPortal.tsx` | `OverlayPortal` (REQ-OVL-01) |
| `src/components/overlays/_shared/overlaySurface.ts` | `overlayMaterial(kind)` table (REQ-OVL-14) |
| `src/components/overlays/_shared/positioning.ts` | default positioner props (REQ-OVL-14, -41) |
| `src/components/overlays/_shared/overlays.css` | `.ag-scrim`, overlay motion (REQ-OVL-04, -09). Starts with exactly `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` and puts all rules in `ag.components` (SC-20: zero `!important`, no global element selectors). The `[data-ag-obscured]` selector (REQ-OVL-08) is `ag.material` content. It is added by OVL-058 as a MODIFY to MAT's `src/material/css/material.css` (MAT-015; layer owner MAT reviews), not by this file |
| `src/components/dialog/Dialog.client.tsx` (Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close; `"use client"`), `DialogLayout.tsx` (Header/Body/Footer, no directive), `Dialog.meta.ts`, `Dialog.css`, `index.ts` | flagship #15 (OVL-040 is the single CREATE of `Dialog.client.tsx`; later tasks MODIFY, SC §H OV-32) |
| `src/components/alert-dialog/AlertDialog.client.tsx`, `AlertDialog.meta.ts`, `AlertDialog.css`, `index.ts` | flagship #16 |
| `src/components/sheet/Sheet.client.tsx`, `SheetHandle.client.tsx`, `useSheetDetents.ts`, `Sheet.meta.ts`, `Sheet.css`, `index.ts` | flagship #17, detents (REQ-OVL-32..-39) |
| `src/components/popover/Popover.client.tsx`, `Popover.meta.ts`, `Popover.css`, `index.ts` | flagship #18 |
| `src/components/tooltip/Tooltip.client.tsx`, `Tooltip.meta.ts`, `Tooltip.css`, `index.ts` | flagship #19 |
| `src/components/menu/Menu.client.tsx`, `ContextMenu.client.tsx`, `Menubar.client.tsx`, `Menu.meta.ts`, `Menu.css`, `index.ts` | flagship #20 |
| `src/components/toast/Toast.client.tsx`, `ToastHistory.client.tsx`, `useToast.ts`, `Toast.meta.ts`, `Toast.css`, `index.ts` | flagship #21 |
| `src/components/<kebab-name>/*.test.tsx`, `src/components/overlays/_shared/*.test.tsx`, `tests/a11y/apg/<kebab>.apg.spec.ts` (APG, harness A11Y-073), `tests/e2e/overlays/*.spec.ts` (non-APG behaviour), `tests/perf/browser/overlays-*.spec.ts` | §12 |
| `src/components/<kebab-name>/*.stories.tsx`, `src/components/overlays/_shared/OverlayMatrix.stories.tsx` | §13 |
| `src/compat/overlays/*.tsx` | compat adapters (REQ-OVL-78; package owned by PRD-18) |
| `packages/cli/src/migrate/4to5/__fixtures__/<id>/overlays-<case>/{input,output}.*` (engine DX-041, ids per SC-33: `canonical-names`, `prop-grammar`, `providers`, `removed`, `imports-subpaths`) | codemod fixtures for every §2.4 name; mapping data comes only from generated `mappings/*.json` and the `.meta.ts` `migration` fields (REQ-OVL-75) |
| `registry/items/confirm-dialog/`, `registry/items/account-menu/`, `registry/blocks/overlay-flows/` (layout SC-32; `registry/registry.json` entries by DX-067) | REQ-OVL-28, -59, -79 |
| `docs/auraglass-5/migration/overlays-selectors.md` | selector change table, generated (REQ-OVL-76) |

No new runtime dependency: everything is covered by `@base-ui/react` (D-29 allowlist). `motion` stays an optional peer used only via `aura-glass/motion` for Sheet drag springs.

---

## 9. Components/files to remove or deprecate

| Item | Class | C-D since | Removed | Replacement |
|---|---|---|---|---|
| `GlassModal` consciousness/predictive/adaptive/eyeTracking/trackAchievements effects and analytics `data-*` | C-I (behaviour off, props kept) | 4.1.1 no-op; 4.2 C-D warning | 5.0 | none |
| `GlassModal`, `GlassDialog` | C-D | 4.3 | 5.0 root; 6.0 compat | `Dialog`, `AlertDialog` |
| `GlassDrawer`, `GlassBottomSheet`, `GlassActionSheet`, `LiquidGlassAdaptiveSheet` | C-D | 4.3 | 5.0 root; 6.0 compat | `Sheet` |
| `MobileGlassBottomSheet` | C-D (inventory REMOVE) | 4.2 | 5.0 (not in compat) | `Sheet side="bottom"` (TODO codemod) |
| `GlassPopover`, `GlassHoverCard` | C-D | 4.3 | 5.0 / 6.0 | `Popover` (`openOnHover`) |
| `Positioner`, `GlassPositioner` | C-D | 4.2 | 5.0 | `*.Positioner` parts |
| `GlassTooltip` (both definitions) | C-D | 4.3 | 5.0 / 6.0 | `Tooltip` |
| `GlassDropdownMenu*`, `GlassContextMenu`, `GlassMenubar`, `LiquidGlassPopoverMenu`, `HeaderUserMenu` | C-D | 4.3 | 5.0 / 6.0 | `Menu`, `ContextMenu`, `Menubar`, registry `account-menu` |
| `GlassMenuPrimitive`, `CollapsedMenu` | C-D (internal) | 4.3 | 5.0 | `Menu` |
| `GlassToast`, `GlassToastProvider`, `GlassToastViewport`, `useToast` (4.x) | C-D | 4.3 | 5.0 / 6.0 | `Toast`, `useToast` (5.0 signature) |
| `GlassNotificationCenter`, `GlassNotificationItem`, `GlassNotificationProvider`, `useNotifications` | C-D | 4.2 | 5.0 / 6.0 | `Toast.History` + `useToast().history` |
| `feedback/GlassToast` (unexported) | C-I | — | 4.2 | — |
| `GlassAchievementNotifications`, `GlassTransitions.GlassModal` | C-D (REMOVE) | 4.2 | 5.0, no compat | none (PRD-16) |
| `aura-glass/overlays` subpath | C-D | 4.2 | 5.0 | root imports (`imports-subpaths` codemod) |
| Props `backdropBlur`, `material`, `materialProps`, `isContained`, `animation`, `compact` on overlays | C-D | 4.2 | 5.0 | material is fixed per kind; `size`; motion tokens |

---

## 10. API changes

Compatibility classes per D-27: **C-I** internal, **C-E** additive, **C-D** deprecation, **C-B** breaking (5.0 only, after a 4.x C-D).

### 10.1 New 5.0 exports (root `.`)

| Export | Parts | Class |
|---|---|---|
| `Dialog` | `Root, Trigger, Portal, Backdrop, Popup, Header, Title, Description, Body, Footer, Close` | C-E (new) |
| `AlertDialog` | same as Dialog | C-E |
| `Sheet` | `Root, Trigger, Portal, Backdrop, Popup, Handle, Header, Title, Description, Body, Footer, Close, Action` | C-E |
| `Popover` | `Root, Trigger, Portal, Positioner, Popup, Arrow, Title, Description, Close` | C-E |
| `Tooltip` | `Provider, Root, Trigger, Portal, Positioner, Popup, Arrow` | C-E |
| `Menu` | `Root, Trigger, Portal, Positioner, Popup, Item, LinkItem, CheckboxItem, CheckboxItemIndicator, RadioGroup, RadioItem, RadioItemIndicator, Group, GroupLabel, Separator, Shortcut, SubmenuRoot, SubmenuTrigger, Arrow` | C-E |
| `ContextMenu` | `Root, Trigger` + Menu popup parts re-exposed as `ContextMenu.*` | C-E |
| `Menubar` | single component; children are `Menu.Root` | C-E |
| `Toast` | `Provider, Viewport, Root, Title, Description, Action, Close, Progress, History, HistoryItem` | C-E |
| `useToast` | hook (5.0 signature, REQ-OVL-61/-62) | C-B vs 4.x `useToast` (same name, new return shape) |
| Types | `DialogRootProps`, `SheetSide`, `SheetDetent`, `PopoverSide`, `PopoverAlign`, `ToastOptions`, `ToastIntent`, `ToastHistoryEntry`, `OverlayOpenChangeDetails` (AuraGlass-owned; no Base UI types, §6) | C-E |

Value-export count added to the root: 9 (`Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `Menu`, `ContextMenu`, `Menubar`, `Toast`) + 1 hook = **10**, against the D-15 root cap of ≤160 (compound parts are properties, not separate exports).

### 10.2 Prop mapping 4.x → 5.0 (drives `prop-grammar` and the compat adapters)

| 4.x | 5.0 | Class | Automation |
|---|---|---|---|
| `GlassModal open` + `onClose()` | `Dialog.Root open` + `onOpenChange(open)` | C-B | full: `onClose={f}` → `onOpenChange={(o) => { if (!o) f(); }}` |
| `GlassModal title`, `description` (string props, `GlassModal.tsx:43,47`) | `<Dialog.Title>`, `<Dialog.Description>` children | C-B | full |
| `GlassModal footer` | `<Dialog.Footer>` | C-B | full |
| `GlassModal role="alertdialog"` | `AlertDialog` | C-B | full |
| `GlassModal size` (`sm…full`) | `Dialog.Popup size` | C-B (rename only) | full |
| `GlassModal variant="drawer"` / `"fullscreen"` | `Sheet side="bottom"` / `Dialog size="full"` | C-B | full |
| `closeOnEscape={false}` | `onOpenChange` reason filter (`details.reason === "escape-key"`) | C-B | TODO (behaviour judgement) |
| `closeOnBackdropClick` / `closeOnOverlayClick` | `dismissible` (Dialog) | C-B | full |
| `backdropBlur` (enum on Modal, boolean on Dialog/Drawer) | removed (material fixed per kind) | C-B (C-D 4.2) | full (delete) |
| `material`, `materialProps` (`ior`, `thickness`, `tint`, `quality`) | removed | C-B (C-D 4.2) | full (`dead-optical-props`) |
| `consciousness`, `predictive`, `adaptive`, `eyeTracking`, `trackAchievements` | removed | C-B (C-D 4.2, no-op 4.1.1) | full (delete) |
| `isContained` | `Surface`/`Card` in flow | C-B | TODO |
| `animation="fade" | "scale" | "slide" | "flip"` | removed; motion tokens per kind | C-B | full (delete) |
| `GlassDrawer position` (`GlassDrawer.tsx:40`) | `Sheet side` | C-B | full |
| `GlassBottomSheet` snap props (where present) | `Sheet detents` | C-B | mostly |
| `GlassActionSheet actions[]` | `Sheet preset="action"` + `Sheet.Action` children | C-B | mostly |
| `GlassPopover placement` (`GlassPopover.tsx:56`, e.g. `"bottom-start"`) | `Popover.Positioner side="bottom" align="start"` | C-B | full (string split) |
| `GlassPopover trigger="hover"` / `GlassHoverCard` | `Popover.Trigger openOnHover` | C-B | full |
| `GlassTooltip content` (`GlassTooltip.tsx:16`) + `position` (`:20`) | `<Tooltip.Popup>` children + `Positioner side` | C-B | full |
| `GlassDropdownMenu`, `…Trigger`, `…Content`, `…Item`, `…CheckboxItem`, `…RadioGroup`, `…RadioItem`, `…Label`, `…Separator`, `…Shortcut`, `…Sub`, `…SubTrigger`, `…SubContent` | `Menu.Root`, `Trigger`, `Popup` (inside `Portal`+`Positioner`), `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `GroupLabel`, `Separator`, `Shortcut`, `SubmenuRoot`, `SubmenuTrigger`, nested `Popup` | C-B | full |
| `GlassDropdownMenuContent side/align/sideOffset` | `Menu.Positioner` same names | C-B (move to part) | full |
| `GlassContextMenu` + `useContextMenu` | `ContextMenu.Root/Trigger` | C-B | mostly; `useContextMenu` → TODO |
| `GlassMenubar` + `createFileMenu`/`createEditMenu` | `Menubar` + `Menu.Root` children | C-B | partial (helpers → TODO) |
| `GlassToast type` (`GlassToast.tsx:39`) | `intent` (`error` → `danger`) | C-B | full |
| `GlassToast onClose` (`:45`), provider `onDismiss(id)` | `Toast.Root onOpenChange` / `useToast().dismiss(id)` | C-B | full |
| `GlassToastProvider position` | `Toast.Provider position` (values normalised to logical `-start/-end`) | C-B | full (value table) |
| `useToast()` (4.x return) | `useToast()` 5.0 `{ toast, update, dismiss, promise, toasts, history }` | C-B | mostly (`addToast` → `toast`) |
| `GlassNotificationCenter` + `useNotifications().addNotification` | `Toast.Provider history` + `Toast.History` + `toast()` | C-B | partial |
| `Positioner` / `GlassPositioner` | `*.Positioner` parts | C-B | TODO |

### 10.3 Styling and testing contract changes

| 4.x hook | 5.0 hook | Class |
|---|---|---|
| `.liquid-glass-modal-surface`, `glass-backdrop-blur-md` on scrim, `data-consciousness-*`, `data-modal-complexity`, `data-time-spent` | `[data-ag-part="popup"][data-ag-overlay="dialog"]`, `[data-ag-part="backdrop"]`, none | C-B (B10) |
| `role="dialog"` on backdrop wrapper (`GlassDialog.tsx:582-586`) | on popup | C-B (a11y fix) |
| `data-state`/`data-side` on GlassDropdownMenu | `data-state` + Base UI `data-open`/`data-side`/`data-align`/`data-highlighted` | C-B (superset) |
| `--glass-*` overlay vars | `--ag-*` (`compat/tokens.css` aliases during 5.x) | C-B (B9) |
| none | `[data-ag-obscured]` on app root while a modal is open | C-E |
| none | `[data-ag-full-height]` on full-height sheets (PRD-04 REQ-MAT-28 attribute) | C-E |

### 10.4 Provider changes consumed (PRD-05 = A11Y owns)

`AuraGlassProvider` (A11Y-029) mounts `Tooltip.Provider` and `Toast.Provider` + `Toast.Viewport` by default (opt-out: `toasts={false}`, `tooltips={false}`), renders the single `[data-ag-portal-root]` (A11Y-049), and owns `data-ag-obscured`. The portal accessor is FND `usePortalContainer()` (`src/foundation/portal.ts`, FND-007; SC-25). All C-E. SC-21 records that A11Y adds `data-ag-obscured` and the provider `toasts`/`tooltips` opt-out props at this PRD's request; this PRD consumes them and does not re-specify them. Until the A11Y PRD text and tasks land them, REQ-OVL-08 and REQ-OVL-46/-61 provider mounting are blocked (open item §21).

---

## 11. Migration concerns

1. **Portal location changes.** 4.x overlays portal to `document.body` (or render in place for `isContained`). 5.0 portals into the provider container. Consumer CSS like `body > .glass-modal` and tests querying `document.body.lastChild` break. Mitigation: selector table (REQ-OVL-76); `doctor --v5` flags `body >` selectors that mention 4.x overlay classes.
2. **Apps without `AuraGlassProvider`.** Overlays still work (fallback `document.body`, REQ-OVL-01) but lose the layer stack's single toast/tooltip provider; `useToast()` without a provider throws a descriptive error naming `AuraGlassProvider`. The `providers` codemod inserts the provider.
3. **Test suites relying on 4.x DOM.** Testing Library queries like `getByRole("dialog")` keep working (role moves from backdrop to popup, which is what tests usually mean). Tests that click the element with `role="dialog"` to close via backdrop break. Fixture in `packages/cli/src/migrate/4to5/__fixtures__/prop-grammar/overlays-backdrop-click/` (SC-33).
4. **Close callbacks fire differently.** `onOpenChange(false)` fires for every reason; 4.x `onClose` fired only for user dismissal in some components. The `prop-grammar` transform wraps the callback to keep 4.x semantics (`if (!open) onClose()`), which also fires on programmatic close. Documented in the migration guide as a behaviour change.
5. **Escape behaviour change.** 4.x stacked dialogs all closed on one Escape (E-12); 5.0 closes one layer per press. Apps that relied on "Escape closes everything" need N presses. Documented as an a11y fix (B13-class, no opt-out).
6. **Tab inside menus.** 4.x DropdownMenu trapped Tab; 5.0 closes the menu on Tab (APG). Documented.
7. **Toast API.** `type` → `intent`, `error` → `danger`; action toasts no longer auto-dismiss by default (REQ-OVL-64). `GlassNotificationCenter` users must place `Toast.History` in their own `Popover`/`Sheet`; the codemod emits a TODO with a snippet.
8. **Visual change.** Every overlay's pixels change (B11). Teams re-baseline using the 4.3 `data-ag-preview="v5"` path — but per D-19, **no Base UI flagships ship on 4.x**, so 4.3 previews only the material of the 6 primitives, not the new overlay DOM. Overlay re-baselining happens on `5.0.0-beta`.
9. **Transitive dependency use.** Overlays used `framer-motion` in 4.x: `GlassModal`, `GlassDrawer`, `GlassToast` and `GlassDropdownMenu` import `Motion` from `src/primitives`, whose barrel exports `MotionFramer as Motion` (`src/primitives/index.ts:91`, MOTION-06 CONFIRMED). 5.0 overlays use CSS only. Consumers who imported `framer-motion` transitively are covered by the `deps` codemod (§3.4).
10. **CommandPalette coupling.** PRD-NAV's palette depends on REQ-OVL-60. If REQ-OVL-60 slips, PRD-NAV is blocked; this PRD ships `Dialog` (incl. `placement="top"`) before any other overlay for that reason (§20).
11. **4.x LTS.** REQ-OVL-70..-72 land on `release/4.x`; nothing else in this PRD is backported.

---

## 12. Tests required

Unit/integration tests run in jsdom (Jest, `jest.config.js`). Behaviour, perf, visual and a11y-mode tests are Playwright specs that run **only** in the remote lanes (PRD-19); none run on a developer Mac. All files NEW unless stated.

### 12.1 Unit and integration (jsdom)

| File | Asserts |
|---|---|
| `src/components/overlays/_shared/overlay-layer.test.tsx` | REQ-OVL-01 portal target; fallback to `document.body` + one dev warning without provider |
| `src/components/overlays/_shared/overlay-dom-contract.test.tsx` | REQ-OVL-10/-15: every part's `data-ag-part`, `data-state`; absence of the 6 analytics attributes; no `Date.now`/`Math.random` calls during render (spied) |
| `src/components/overlays/_shared/overlay-idle.test.tsx` | REQ-OVL-06/-64: Profiler commit count = 0 over 2 s idle (fake timers) for each flagship; 0 active intervals (`jest.getTimerCount()` minus Base UI toast timeout) |
| `src/components/overlays/_shared/overlay-dev-counter.test.tsx` | REQ-OVL-11 warning thresholds 6/3; no warning in `NODE_ENV=production` |
| `src/components/overlays/_shared/popup-contract.test.tsx` | REQ-OVL-14 parametrised over popover/tooltip/menu/toast: parts, `data-side`, material attributes |
| `src/components/overlays/_shared/lint-overlays.test.ts` | REQ-OVL-02/-10 rules fire on fixtures (`document.addEventListener("keydown")`, `document.body.style.overflow`, `Date.now()` in render) and pass on the real sources |
| `src/components/dialog/Dialog.client.tsx` (Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close; `"use client"`), `DialogLayout.tsx` (Header/Body/Footer, no directive), `Dialog.meta.ts`, `Dialog.css`, `index.ts` | flagship #15 (OVL-040 is the single CREATE of `Dialog.client.tsx`; later tasks MODIFY, SC §H OV-32) |
| `src/components/alert-dialog/AlertDialog.client.tsx`, `AlertDialog.meta.ts`, `AlertDialog.css`, `index.ts` | flagship #16 |
| `src/components/sheet/Sheet.client.tsx`, `SheetHandle.client.tsx`, `useSheetDetents.ts`, `Sheet.meta.ts`, `Sheet.css`, `index.ts` | flagship #17, detents (REQ-OVL-32..-39) |
| `src/components/popover/Popover.client.tsx`, `Popover.meta.ts`, `Popover.css`, `index.ts` | flagship #18 |
| `src/components/tooltip/Tooltip.client.tsx`, `Tooltip.meta.ts`, `Tooltip.css`, `index.ts` | flagship #19 |
| `src/components/menu/Menu.client.tsx`, `ContextMenu.client.tsx`, `Menubar.client.tsx`, `Menu.meta.ts`, `Menu.css`, `index.ts` | flagship #20 |
| `src/components/toast/Toast.client.tsx`, `ToastHistory.client.tsx`, `useToast.ts`, `Toast.meta.ts`, `Toast.css`, `index.ts` | flagship #21 |
| `src/components/toast/Toast.client.tsx`, `ToastHistory.client.tsx`, `useToast.ts`, `Toast.meta.ts`, `Toast.css`, `index.ts` | flagship #21 |
| `src/compat/overlays/*.compat.test.tsx` | REQ-OVL-78: each 4.x name renders the 5.0 component, maps props per §10.2, warns once per page load |
| `src/components/modal/GlassModal.test.tsx`, `GlassDialog.test.tsx`, `GlassDrawer.test.tsx` (EXISTING, 4.x) | REQ-OVL-70: analytics attributes absent; no intervals with `consciousness`/`adaptive` props set |
| SSR: `src/components/overlays/_shared/overlay-ssr.test.tsx` | `renderToString` of every flagship closed and `defaultOpen` → `hydrateRoot` with 0 warnings |

### 12.2 Behaviour (Playwright, remote, Chromium + WebKit + Gecko; L5 Behaviour, L8 Engine-specific)

Paths follow SC-30: APG keyboard specs are `tests/a11y/apg/<kebab>.apg.spec.ts`, one per widget, built on the A11Y-073 harness and owned by this PRD (OVL-053 owns the dialog spec; A11Y-077 is only a harness self-test fixture). Non-APG behaviour specs live in `tests/e2e/overlays/`. Playwright projects are added by MODIFY to QA-owned `playwright.config.ts` / `certification/playwright.cert.config.ts` (QA-003/QA-018).

| File | Asserts |
|---|---|
| `tests/a11y/apg/dialog.apg.spec.ts` | REQ-OVL-19/-20: APG dialog script (open, Tab cycle, Shift+Tab, Escape, focus return); `inert` outside; `clientWidth` unchanged on lock |
| `tests/a11y/apg/alert-dialog.apg.spec.ts` | REQ-OVL-26/-27 |
| `tests/a11y/apg/sheet.apg.spec.ts` | REQ-OVL-33: handle keyboard, announcement text, body reachable at every detent |
| `tests/a11y/apg/popover.apg.spec.ts`, `tests/e2e/overlays/popover.spec.ts` | REQ-OVL-41/-42: focus in/out; collisions at 390×844 (no horizontal overflow) |
| `tests/a11y/apg/tooltip.apg.spec.ts`, `tests/e2e/overlays/tooltip.touch.spec.ts` | REQ-OVL-47/-48/-50 |
| `tests/a11y/apg/menu.apg.spec.ts` | REQ-OVL-53: full APG menu-button script incl. typeahead, Tab closes, submenu arrows, one `tabIndex=0` |
| `tests/a11y/apg/context-menu.apg.spec.ts` | REQ-OVL-56: right-click, Shift+F10, focus first, restore, long-press |
| `tests/a11y/apg/menubar.apg.spec.ts` | REQ-OVL-57 |
| `tests/a11y/apg/toast.apg.spec.ts`, `tests/e2e/overlays/toast.touch.spec.ts` | REQ-OVL-63/-65: F6 to region, a11y tree roles, swipe dismiss |
| `tests/e2e/overlays/overlay-stack.spec.ts` | REQ-OVL-03/-23: T-OVL-STACK-01 (3 layers, 3 Escapes), -02 (outside press), -03 (toast not inert under modal), -04 (nested dialog) |
| `tests/e2e/overlays/overlay-a11y-modes.spec.ts` | REQ-OVL-12/-13: forced colors (0 visible backdrop-filters), `contrast: more` border, reduced transparency, `@axe-core/playwright` with colour-contrast on, per flagship open state |
| `tests/e2e/overlays/overlay-motion.spec.ts` | REQ-OVL-09 + L9 Motion lane: entrance animates (frame strip), reduced motion = opacity only and final state visible (opacity 1, scale 1), no WAAPI/rAF after settle |

### 12.3 Performance (Playwright, remote L10 Performance lane, PRD-19 harness)

Paths follow SC-30: `tests/perf/browser/overlays-<name>.spec.ts`, driven by `tests/perf/harness/run-perf.mjs` (PERF-039). Runtime fps/long-task/surface budgets are rows in PERF-owned `tests/perf/harness/budgets.json` (SC-15); byte budgets are rows in PKG-owned `docs/size-budgets.json`.

| File | Asserts |
|---|---|
| `tests/perf/browser/overlays-dialog-perf.spec.ts` | REQ-OVL-04/-05/-07/-08/-29 and AC-OVL-01..05: scrim count/radius; 0 infinite animations; nested flat; obscured-page ΔE; open latency; fps and long tasks under the scripted hover+scroll of `runtime-remote.md` §5 (same script, so before/after is comparable) |
| `tests/perf/browser/overlays-sheet-perf.spec.ts` | REQ-OVL-39: 0 commits per pointermove, frame-time p95 |
| `tests/perf/browser/overlays-overlay-budget.spec.ts` | blurred-layer counts per open flagship (Dialog 2, Sheet 2, Popover 1, Tooltip 1, Menu 1, Toast stack 1) |
| `tests/perf/browser/overlays-glass-modal-4x.spec.ts` (runs on `release/4.x` storybook) | REQ-OVL-71: `glass-modal` fps ≥30 and pixel diff 0 |

### 12.4 Visual

Environment-matrix baselines (§15.1) per flagship state, captured by the PRD-19 harness from the §13 stories; pixel gates (§15.2) on every cell. Codemod fixtures for each §2.4 name in PRD-18's fixture suite.

---

## 13. Storybook requirements

Stories live next to each flagship (`src/components/<kebab-name>/<Name>.stories.tsx`, NEW) and follow §15.4 (Material Lab): the `environment` toolbar global selects one of the 8 scenes; there is no opaque story stage; motion follows the OS except in the CI snapshot run.

1. **Open by default for capture.** Every flagship has a `defaultOpen` story so the pixel harness captures the open state without scripted clicks; plus one closed story with a `play` function that opens it (L5 Behaviour).
2. **Per-flagship stories (minimum set):**
   - `Dialog`: Default (title, description, body, footer with 2 Buttons), LongContent (body scroll, sticky header/footer), Sizes (sm–full, one story per size via args), Form (`render={<form/>}` with `TextField`s — proves nested `content-sunken`, not glass), Nested (dialog in dialog), NonModal, Palette shell (`placement="top"`, used by PRD-NAV).
   - `AlertDialog`: Destructive confirm, Neutral confirm.
   - `Sheet`: Right panel, Left panel (RTL variant), Bottom with detents `[0.5, "full"]`, Action preset, Non-modal inspector, Full-height (shows `data-ag-full-height` floor).
   - `Popover`: Click, Hover (`openOnHover`, replaces HoverCard), With form, Collision (anchored at each viewport edge), Arrow.
   - `Tooltip`: Default, On IconButton, Grouped (provider skip-delay across a Toolbar), Long text wrap, Each side.
   - `Menu`: Default, Checkbox + radio items (incl. `indeterminate`), Submenus, Shortcuts, Disabled items, Long list (scroll), ContextMenu region, Menubar (File/Edit/View).
   - `Toast`: Each intent, With action, Promise, Stack of 5 (limit 3), Notification center (`Toast.History` inside `Sheet`), Swipe (mobile viewport).
3. **Matrices generated from `.meta.ts`** (REQ-OVL-75): state × thickness × transparency (`glass`/`tinted`/`solid`) × scheme, rendered over the 8 scenes. No hand-written matrix stories.
4. **Perf story.** `Overlays/Perf/Dialog over dashboard`: a Dialog `defaultOpen` over a page with 6 standard surfaces (TopBar, Sidebar, 4 Cards in `content-raised`) — the subject of `overlays-dialog-perf.spec.ts` and the direct successor of the 4.x `glass-modal` story used in E-01, with the same hover+scroll script.
5. **Preference stories** via globals, not separate components: forced colors, `contrast: more`, reduced transparency, reduced motion.
6. **Docs pages** generated from `.meta.ts`: parts table, `data-ag-part`/`data-state` table, keyboard table (from the APG script), 4.x lineage, budget line, perf grade. No hand-written prop tables.
7. **No Storybook-only props** on any flagship (`forceVisible`, `previewUsers` etc. are banned, §13.3). No `!important` in stories (pixel gate counts it).
8. **Story ids are stable** (`overlays-dialog--default`, …) because the certification lanes key baselines on them.

---

## 14. Responsive requirements

Breakpoints are **container** widths of the overlay's containing block (provider portal = viewport), using container queries (§10), at the two certification viewports 1440×900 and 390×844 plus 768×1024 for Sheet.

| Flagship | ≥640px container | <640px container |
|---|---|---|
| `Dialog` | centred, `size` max inline size, inset `--ag-space-4` (16px) | `sm`/`md` keep 16px inset and become full width minus inset; `lg`/`xl` become `full`-like (100% width, radius kept at top only, anchored bottom) |
| `AlertDialog` | centred, max 400px | full width minus 16px inset, centred vertically; buttons stack vertically, primary action last (closest to thumb) |
| `Sheet side=start/end/left/right` | `size` inline size | full width; `Handle` hidden (no detents on side sheets) |
| `Sheet side=bottom` | max inline size 640px, centred | full width; safe-area padding (REQ-OVL-35) |
| `Popover` | anchored | anchored; if available inline space <280px, `max-inline-size: calc(100vw - 16px)`; never horizontal overflow |
| `Tooltip` | max 280px | max `calc(100vw - 16px)`; long-press on touch (REQ-OVL-50) |
| `Menu` | anchored, min inline size = trigger width, max 320px | same; item block size 44px under `(pointer: coarse)` regardless of width |
| `Toast` | `position` as set, inline size 360px | full width minus 16px at the top or bottom edge from `position` (start/center/end collapse to center); swipe enabled |

Additional rules:
- `dvh` units for every block-size cap (`100dvh`), so mobile browser chrome does not hide footers.
- On-screen keyboard: when a focused field inside a Dialog/Sheet is covered (VisualViewport height < layout viewport), the popup's block size uses `var(--ag-visual-viewport-height)` written by the provider from `visualViewport.resize` (rAF-coalesced, one writer for the document; PRD-05 owns the listener). Verified in `dialog.apg.spec.ts` with emulated viewport resize.
- `prefers-reduced-motion` and `(pointer: coarse)` are independent of width; no responsive rule changes keyboard behaviour.
- RTL: `side`/`align` logical values flip; Sheet drag direction for `side="left"` mirrors under `dir="rtl"`. Visual baseline per flagship in RTL at 390.
- 0 horizontal overflow at 390px for every story (pixel gate "mobile containment", §15.2).

---

## 15. Accessibility requirements

Floors from §6/§7 apply to every overlay. Per-widget APG patterns:

| Flagship | APG pattern | Must hold (beyond REQs above) |
|---|---|---|
| `Dialog` | Dialog (Modal) | Focus moves in on open and returns on close; Tab cycles; background `inert`; one Escape = one layer; title required (2.4.6, 4.1.2) |
| `AlertDialog` | Alert and Message Dialogs | `role="alertdialog"`; initial focus on least destructive action; description announced |
| `Sheet` | Dialog (Modal) or non-modal region | Same as Dialog when modal; detent handle operable by keyboard (2.1.1) and has an accessible name; no drag-only functionality (2.5.7: every drag result has a single-pointer/keyboard alternative) |
| `Popover` | Dialog (non-modal) / disclosure | Trigger `aria-expanded`; Escape closes and restores focus; hover mode meets 1.4.13 |
| `Tooltip` | Tooltip | Focus + hover, Escape, describedby on trigger, hoverable, no interactive content (1.4.13, 2.1.1) |
| `Menu`, `ContextMenu` | Menu Button, Menu | Roving focus, typeahead, Tab closes, Escape restores, `aria-checked`, `aria-disabled` focusable |
| `Menubar` | Menubar | One tab stop, horizontal arrows, Escape returns to bar |
| `Toast` | (no APG pattern) Status/Alert live regions | F6 landmark, polite by default, timing adjustable via pause (2.2.1), action toasts don't expire, no focus stealing (focus never moves to a toast unless the user navigates there) |

Global floors (all verified per flagship in `overlay-a11y-modes.spec.ts` and the L13 Manual SR lane):
- **Focus ring:** the §6 two-tone 2px outline + offset (2.4.13) on every focusable part (triggers, items, close buttons, handle); `outline: 2px solid Highlight` under forced colors; never box-shadow-only. 0 occurrences of `focus:outline-none` / `outline: none` without a replacement in overlay CSS (L1 Static).
- **Targets:** ≥24×24 CSS px for every interactive part (2.5.8); ≥44×44 hit area under `(pointer: coarse)` via pseudo-element (Close buttons, Sheet handle, menu items).
- **Focus not obscured (2.4.11):** a focused element inside a Dialog/Sheet body is never hidden by the sticky `Header`/`Footer`; `Body` sets `scroll-padding-block` from their measured sizes.
- **Contrast:** three-composite gate + OCR pixel gate (REQ-OVL-13). The scrim must make text **behind** it non-competing but needs no ratio; the popup text must pass over every scene.
- **Forced colors / reduced transparency / contrast more:** REQ-OVL-12/-13; 0 visible backdrop-filters under forced colors for every flagship (today modal 10).
- **Reduced motion:** at most `calm`; final state visible; no API can raise it (§8).
- **Screen-reader names:** every popup has an accessible name (title, `aria-label`, or trigger label for menus). Close buttons default to `aria-label="Close"` (localisable via a `labels` prop on Root).
- **Localisation:** all built-in strings (`Close`, `Notifications`, `Resize sheet`, detent names) come from a `labels` prop with English defaults; none are hard-coded in JSX.
- **Automated:** `@axe-core/playwright` with colour-contrast **on** in real browsers, 0 violations (serious/critical) per open state; jsdom `jest-axe` is not accepted as evidence (ACCESSIBILITY-10..-16 note on jsdom-only axe).
- **Manual (GA blocker, §15.2 Manual lane = L13 Manual SR):** VoiceOver + Safari (macOS and iOS), NVDA + Chrome, TalkBack + Chrome, physical touch, for each of the 7 flagships, recorded in the living matrix with the build SHA.

---

## 16. Performance requirements

Runtime budgets below are rows in PERF-owned `tests/perf/harness/budgets.json` read by `tests/perf/harness/run-perf.mjs` (PERF-039, SC-15); byte budgets are PKG rows (REQ-OVL-77). Budgets are design targets set **before** measuring (D-26), calibrated once at 5.0.0-alpha in the remote L10 Performance lane, then ratchet down only. Absolute fps numbers from software-raster CI are pessimistic (`runtime-remote.md` §5), so the gating metrics are relative to a same-run baseline plus counts that are raster-independent.

### 16.1 Modal fix (closes E-01..E-11)

| Metric (remote harness, `Overlays/Perf/Dialog over dashboard`, 1440×900 and 390×844, scripted hover+scroll from `runtime-remote.md` §5) | 4.x today | 5.0 budget |
|---|---|---|
| Visible `backdrop-filter` elements attributable to the open Dialog | 12 (whole story) | **≤2** (scrim + popup) |
| Total visible `backdrop-filter` elements in the viewport with Dialog open | 12 | **≤2** if REQ-OVL-08 ships; else ≤2 + page surfaces (page ≤6 by §4.7) |
| Scrim blur radius | `glass-backdrop-blur-md` full viewport | **≤12px**, one element |
| Popup blur radius | not attributed for `glass-modal` (`runtime-remote.md` §5 reports "—"; the 40 px library max was measured on the 3.2 AI command center shell) | **≤32px** (Dialog, PRD-04 `thick`); Sheet same (`thick`; full-height resolves `tinted`) |
| Infinite animations while open | 4 | **0** |
| React commits while open and idle (2 s) | continuous (intervals, gaze/biometric effects) | **0** |
| fps under scripted hover+scroll (software raster) | 12 | **≥0.85 × the same run's `Surface` baseline story fps**, and ≥45 absolute |
| fps on GPU-backed perf profile (120 Hz desktop) | not measured | **≥110 fps p50, frame time p95 ≤10 ms** |
| fps on emulated mid-tier mobile (4× CPU throttle) | not measured | **≥55 fps p50 at 60 Hz** |
| Long tasks after open (5 s window) | 49 tasks, 4,056 ms, max 151 ms | **≤2 tasks, ≤150 ms total, none >80 ms** (window B of REQ-OVL-29: 5 s starting at the end of the enter transition, so Storybook boot and the enter transition are excluded; the enter transition itself is window A, no long task >50 ms) |
| Click → first painted popup frame (4× CPU throttle) | not measured | **≤100 ms** |
| Perf grade (§15.2) | — | **≥B** target; **C** is the T1 floor |

### 16.2 All overlays

| Metric | Budget |
|---|---|
| Blurred layers added when open | Dialog 2, AlertDialog 2, Sheet 2, Popover 1, Tooltip 1, Menu 1 (+1 per open submenu, max 3 levels), Toast stack 1 |
| Blur radius (PRD-04 REQ-MAT-29 values at `(pointer:fine)`) | scrim ≤12px; Dialog/AlertDialog/Sheet 32px (`thick`); Popover/Menu 20px (`regular`); Tooltip/Toast 12px (`thin`); nothing >32px |
| Animated properties | `opacity`, `transform`, registered `--ag-*` scalars only; `backdrop-filter`/`filter`/layout never animated (static lint + L9 Motion lane) |
| Enter/exit duration | exactly the PRD-06 tokens in §4.5 (small 200/140 ms, medium 320/220 ms, large 450/320 ms); calm keeps duration, opacity only; asserted from computed `transition-duration` in `overlay-motion.spec.ts` |
| Sheet drag | 0 commits per pointermove; frame time p95 ≤16.7 ms (120 Hz desktop), ≤33 ms (mid-tier mobile) |
| Toast countdown | 0 commits; 1 timeout per toast |
| Global listeners added by AuraGlass overlay code | 0 (Base UI's own only) |
| Import side effects | 0 (jsdom gate) |
| Size (min+gz, peers external, §3.6 + REQ-OVL-77) | Dialog ≤20 KB, AlertDialog ≤20, Sheet ≤24, Popover ≤14, Tooltip ≤10, Menu ≤22, Toast ≤14 |
| CSS | overlay CSS (all 7 + shared) ≤6 KB gz inside `styles.css` (≤32 KB gz total, §3.6), submitted as a stricter row in PKG `docs/size-budgets.json` under PERF REQ-PERF-01 8 KB default ceiling (SC-15) — provisional, calibrated at 5.0.0-alpha.1 (open item §21) |

---

## 17. Acceptance criteria

| ID | Criterion (measurable) | Evidence |
|---|---|---|
| AC-OVL-01 | `Overlays/Perf/Dialog over dashboard` open: ≤2 overlay `backdrop-filter` elements, scrim radius ≤12px, popup ≤32px, at both viewports | `overlays-dialog-perf.spec.ts` artifact |
| AC-OVL-02 | 0 infinite animations and 0 React commits during 2 s idle with Dialog, Sheet, Popover, Tooltip, Menu and a 3-toast stack open | `overlays-dialog-perf.spec.ts`, `overlay-idle.test.tsx` |
| AC-OVL-03 | Software-raster fps ≥0.85× same-run `Surface` baseline and ≥45; GPU profile ≥110 fps p50; mid-tier mobile ≥55 fps p50 | L10 Performance report |
| AC-OVL-04 | Long tasks after open ≤2, ≤150 ms total, none >80 ms; open latency ≤100 ms at 4× throttle; REQ-OVL-08 decision recorded with ΔE2000 p95 value | L10 Performance report, PR |
| AC-OVL-05 | Perf grade ≥C for all 7 flagships (target ≥B for Dialog); the 4.x `glass-modal` story on `release/4.x` reaches ≥30 fps with pixel diff 0, or the measured shortfall is recorded (REQ-OVL-71) | L10 Performance, `overlays-glass-modal-4x.spec.ts` |
| AC-OVL-06 | APG scripts pass in Chromium, WebKit and Gecko for all 9 widgets (Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, ContextMenu, Menubar, Toast) | §12.2 specs |
| AC-OVL-07 | Stacked Escape: 3 open layers close in 3 presses, topmost first, focus returned each time; toast region not inert under a modal | `overlay-stack.spec.ts` |
| AC-OVL-08 | Forced colors: 0 visible backdrop-filters and `CanvasText` borders on every open flagship (4.x modal: 10); on 4.2, `glass-modal` 12 → 0 (REQ-OVL-72) | `overlay-a11y-modes.spec.ts` |
| AC-OVL-09 | Three-composite contrast gate passes (≥4.5 / 3 / 7:1) and OCR worst-case text contrast ≥4.5:1 over all 8 scenes, light and dark, for every open flagship | L4 Token contrast + L7 Pixel regression lanes |
| AC-OVL-10 | axe (colour contrast on) reports 0 serious/critical violations per open state in 3 engines | `overlay-a11y-modes.spec.ts` |
| AC-OVL-11 | Manual matrix complete: 7 flagships × (VoiceOver macOS, VoiceOver iOS, NVDA, TalkBack, physical touch) = 35 cells, 0 open P0/P1 | living matrix, SHA-linked |
| AC-OVL-12 | L1 Static: 0 hits for `document.addEventListener`, `window.addEventListener`, `document.body.style`, `Date.now()` in render, `transition: all`, `!important`, `focus:outline-none` under `src/components/{overlays/_shared,dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/**` | lint artifact |
| AC-OVL-13 | Size: every overlay per-import budget line (REQ-OVL-77) passes in the L2 Artifact lane | budget report |
| AC-OVL-14 | 0 horizontal overflow at 390px and RTL baselines present for every overlay story | L7 Pixel regression |
| AC-OVL-15 | SSR: every flagship `renderToString` → `hydrateRoot` with 0 warnings in Next 16 + React 19.3 and Next 15 + React 19.0 canaries | L11 Consumer canaries |
| AC-OVL-16 | Every §2.4 4.x name: `deprecations.json` entry shipped in ≥1 4.x minor, compat adapter test green, codemod fixture green, selector table row present | L3 Change class lane, PRD-18 fixtures |
| AC-OVL-17 | Frozen 4.x consumer fixture passes after `migrate 4to5` with 0 TODOs on the overlay subset (`GlassModal`, `GlassDrawer`, `GlassPopover`, `GlassTooltip`, `GlassDropdownMenu`, `GlassToast`) | L11 Consumer canaries |
| AC-OVL-18 | 0 analytics `data-*` attributes and 0 overlay-owned intervals on 4.1.1 (or 4.2, SC-36) `GlassModal`/`GlassDialog`/`GlassDrawer` with pixel diff 0 | 4.1.1 CI, REQ-OVL-70 |
| AC-OVL-19 | One toast store: rendering two `Toast.Provider`s logs a dev error; `GlassNotificationCenter` compat renders `Toast.History`; 0 `<style>` elements injected by any overlay | `Toast.test.tsx`, side-effect gate |
| AC-OVL-20 | `CommandPalette` (PRD-NAV) stories pass AC-OVL-01/-02 using only REQ-OVL-60 public parts | `overlays-dialog-perf.spec.ts` subject list |

---

## 18. Definition of done

Per flagship (all seven), matching §11.3:

- [ ] Implementation meets every REQ-OVL in its subsection plus §5.1 and §5.10.
- [ ] Typed `.meta.ts` metadata merged and driving docs, Lab matrices and codemod tables.
- [ ] `data-ag-part`/`data-state` contract published; selector change table row(s) generated.
- [ ] APG keyboard script green in 3 engines; manual SR/touch matrix cells green.
- [ ] Per-import budget line green; perf grade ≥C published.
- [ ] Environment-matrix baselines green (8 scenes × light/dark × glass/tinted/solid × default/contrast-more/forced-colors/reduced-motion × tiers × 1440/390).
- [ ] Registry block usage (REQ-OVL-79) renders in the packed-tarball recipe harness.
- [ ] Codemod fixture for every absorbed 4.x name green; compat adapter test green.
- [ ] `deprecations.json` entries shipped on 4.x (4.2 or 4.3) before the 5.0 removal.
- [ ] API Extractor report reviewed; frozen at rc.1 (later changes C-E only).
- [ ] No evidence committed to git; all artifacts are CI artifacts keyed to the SHA (D-32).
- [ ] No mock or fake completion: every REQ-OVL test runs against the real Base UI-backed component (no `jest.mock` of `@base-ui/react`, of the flagship, or of `AuraGlassProvider`); no `test.skip`/`it.todo`/`fixme` in overlay specs at the RC SHA; behaviour, perf and a11y-mode evidence comes from real remote Chromium/WebKit/Firefox runs, never jsdom stand-ins; a budget, threshold or baseline may not be loosened to make a lane pass (ratchet-down only, D-26).

For the PRD as a whole:

- [ ] AC-OVL-01..20 green on the RC SHA.
- [ ] 4.1.1 or 4.2 (REQ-OVL-70, per TRUST intake) and 4.2 (REQ-OVL-72/-73) shipped from CI; 4.3 (REQ-OVL-74) shipped.
- [ ] All §9 files deleted on the 5.0 branch, each family in one revertable PR (§14.6).
- [ ] Consumer PRDs (PRD-08 Select/Combobox, PRD-11 DatePicker, PRD-12 Citation, PRD-NAV CommandPalette/AppShell drawer, PRD-14 Tour) have re-run their tests against the final overlay contract.

---

## 19. Dependencies (other PRDs)

| PRD (key, SC-01) | What this PRD needs | Anchor tasks (SC-40) | Blocking for |
|---|---|---|---|
| PRD-00 (TRUST, trust patch 4.1.1) | 4.1.1 release vehicle and the intake decision for REQ-OVL-70 (SC-36); root `deprecations.json` seed | TRUST-075, TRUST-077 | REQ-OVL-70, -73 |
| PRD-01 / PRD-17 (REL, release governance and the 4.2/4.3 bridge, SC-37) | `deprecations.json` schema and gate, `warnDeprecated`, change-class and visual-class gates, frozen 4.x fixture, codemod id catalogue (SC-33), 4.2/4.3 vehicles | REL-010, REL-070, REL-072, REL-115 | REQ-OVL-70..-74, AC-OVL-16/-17 |
| PRD-02 (PKG, build/packaging) | per-file directives, exports manifest, side-effect gate, `docs/size-budgets.json` + `verify-size-budgets.mjs`, lint plugin wiring and `no-random-in-render`, `@layer` order statement | PKG-005, PKG-015, PKG-042, PKG-048/049 | REQ-OVL-02, -10, -68, -77 |
| PRD-03 (DS, token compiler) | overlay/scrim tint floors solved by the three-composite gate; motion duration tokens (`tokens/sys/motion.tokens.json`) | DS-016, DS-026 | REQ-OVL-04, -13 |
| PRD-04 (MAT, material engine) | `Surface layer="overlay"`, thickness ladder, scrim variant, nesting rule, `SurfaceGroup`, `[data-ag-obscured]` selector in `ag.material`, `data-ag-full-height` P10 floor, dev budget counter (REQ-MAT-52) | MAT-015, MAT-047 | REQ-OVL-04, -07, -08, -11, -22, -34, -66 |
| PRD-05 (A11Y, a11y and preferences) | single `[data-ag-portal-root]`, `LayerStack` (the only Escape, `inert` and scroll-lock dispatcher, SC-25), provider with Tooltip/Toast mounting and `toasts`/`tooltips` opt-outs, `data-ag-obscured` (SC-21), announcer, `usePreference`, APG harness | A11Y-027, A11Y-029, A11Y-049, A11Y-073 | REQ-OVL-01, -03, -08, -20, -46, -61, -63; §12.2 |
| PRD-06 (MOT, motion) | `data-starting-style`/`data-ending-style` transitions, `linear()` springs, View Transition optics drop, ticker, L9 Motion | MOT-040 | REQ-OVL-09, -32; §4.5 |
| PRD-07 / PRD-14 / PRD-16 (FND, foundation integration and removal) | Base UI pin and wrapping pattern (routes Base UI dismissal through `LayerStack`), `usePortalContainer()`, parts registry, KEEP primitives, React 19 ref pattern, deletion of REMOVE records. FND's exit criterion is "Button + Dialog certified": OVL-040 Dialog is the overlays anchor and the pattern proof with CTL-055 | FND-001, FND-005, FND-007, FND-031/035/038 | everything; REQ-OVL-69, §9 |
| PERF (perf policy) | `tests/perf/harness/budgets.json`, `run-perf.mjs`, REQ-PERF-01 default byte ceilings | PERF-039 | §12.3, §16 |
| PRD-18 / PRD-20 (DX, CLI, codemods, registry, compat, docs) | 4to5 codemod engine and catalogue, compat index, `registry.json` and render harness, generated docs and migration guide | DX-041, DX-042, DX-065, DX-067 | REQ-OVL-28, -59, -76, -78, -79 |
| PRD-19 (QA, certification infra) | lanes L1–L14, `jest.config.js` / `playwright.config.ts` / cert config, 8 scenes, pixel gates, OCR, behaviour lane, manual matrix | QA-003, QA-018, QA-031, QA-038/039, QA-082 | §12, §16, AC-OVL-01..-15 |
| PRD-19 (SB, Storybook/Lab) | Storybook preview, Material Lab frame | SB-048, SB-060 | §13 |

Downstream (depend on this PRD): PRD-08 (Select/Combobox popups), PRD-11 (DatePicker popover, FilterBar), PRD-12 (Citation preview), **PRD-NAV** (CommandPalette, AppShell mobile drawer, TabBar overflow; §16 lists PRD-NAV as depending on the overlays PRD), PRD-13 (ImageViewer dialog), PRD-14 (Tour on Popover).

---

## 20. Execution order

1. **4.1.1 intake / 4.2 fallback (week of 2026-10-12, with PRD-00 = TRUST).** REQ-OVL-70, only if TRUST accepts it into 4.1.1 (SC-36); otherwise it moves to step 2: remove analytics attributes and surveillance effects from `GlassModal`/`GlassDialog`/`GlassDrawer`; pixel diff 0; update existing tests. Run REQ-OVL-05 attribution of the 4 infinite animations in the remote lane and record the list.
2. **4.2 bridge (2026-11-16, with PRD-17).** REQ-OVL-72 forced-colors coverage (visual bug fix); REQ-OVL-71 4.x frame-rate fix if pixel-neutral; move the `glass-notification-styles` injection into shipped CSS; delete unexported `feedback/GlassToast`; REQ-OVL-73 C-D warnings; `aura-glass/overlays` C-D.
3. **Shared layer (5.0 alpha, after PRD-04/-05 emit).** `_shared/` modules (§4.2), `.ag-scrim`, `OverlayPortal`, lint rules REQ-OVL-02/-10, dev counter, `overlay-dom-contract` and `overlay-idle` tests.
4. **Dialog + AlertDialog (alpha gate, with PRD-07).** REQ-OVL-16..-29 and REQ-OVL-60 (palette shell, unblocks PRD-NAV). Build the `Overlays/Perf/Dialog over dashboard` story and `overlays-dialog-perf.spec.ts`; calibrate §16 budgets and the Dialog ≤20 KB line in the remote L10 Performance lane. Decide REQ-OVL-08 from the ΔE measurement.
5. **Popover + Tooltip.** REQ-OVL-40..-51 and the anchored-popup contract REQ-OVL-14 (unblocks PRD-08 Select/Combobox, PRD-11 DatePicker, PRD-12 Citation).
6. **Menu + ContextMenu + Menubar.** REQ-OVL-52..-59.
7. **Sheet.** REQ-OVL-30..-39 (detents last; needs PRD-06 springs). Unblocks PRD-NAV's mobile drawer and inspector.
8. **Toast + history.** REQ-OVL-61..-69; provider mounting with PRD-05.
9. **4.3 preview (2027-01-18).** REQ-OVL-74 rename deprecations; mapping tables and fixtures handed to PRD-18; compat adapters (REQ-OVL-78).
10. **Beta (from 2027-02-15).** Delete §9 files on the 5.0 branch, one PR per family; full §15 matrix; manual SR/touch matrix; registry blocks (REQ-OVL-79); consumer PRDs re-verify against the final contract.
11. **RC-1 (from 2027-03-22).** Freeze overlay APIs (API Extractor); AC-OVL-01..20 green on the RC SHA; perf grades published; frozen 4.x fixture migrates with 0 overlay TODOs.


---

## 21 Open items

Reconciled on 2026-10-06 against `prd/_shared-contracts.md` (SC-02, SC-15, SC-16, SC-20, SC-25, SC-29, SC-30, SC-33, SC-40, plus SC-01/21/32/36) and the OVL section of `prd/_verification-remaining-concerns.md`.

Resolved in this revision:
- **ID numbering.** Resolved by the SC-01 crosswalk: key OVL; self-id PRD-10 and §16 PRD-09 are aliases (header and ID note).
- **Escape double-handling.** Resolved by SC-25: `LayerStack` (A11Y-049) is the only Escape/`inert`/scroll-lock dispatcher; FND-007's wrapping pattern routes Base UI per-root dismissal through it (§4.3). REQ-OVL-03 and T-OVL-STACK-01 test that mechanism.
- **Portal accessor name.** `usePortalContainer()` from `src/foundation/portal.ts` (FND-007), replacing the `useAuraGlassPortalRoot()` placeholder (§4.2, §10.4).
- **Per-import size lines.** Accepted as rows in `docs/size-budgets.json` (SC-15, errata E-06), REQ-OVL-77.
- **REQ-OVL-29 vs §16.1 long-task windows.** Split into window A (click → enter `transitionend`, no task >50 ms) and window B (the next 5 s, ≤2 tasks, ≤150 ms, none >80 ms), REQ-OVL-29 and §16.1.
- **Inventory line counts.** The §2.4 column is now labelled as inventory component span, not file length.
- **E-30 / E-31 citations.** The source lines were re-checked on 2026-10-06 and are the binding evidence. The `dist/` line range is marked informative.
- **Lint rule.** `no-date-now-in-render` is dropped; PKG `auraglass/no-random-in-render` covers it (SC-16).

Still open:

| # | Item | Owner | How to close |
|---|---|---|---|
| O-1 | `data-ag-obscured` and the provider `toasts`/`tooltips` opt-out props are assigned to A11Y by SC-21, but the A11Y PRD text and tasks do not specify them yet. They block REQ-OVL-08, -46 and -61 provider mounting | A11Y | A11Y adds REQ text and a task (depending on A11Y-029/A11Y-049). OVL-058 and OVL-130 then add that task id to `depends_on` (today they depend on A11Y-029) |
| O-2 | REQ-OVL-70 (privacy cut on `GlassModal`/`GlassDialog`/`GlassDrawer`) is not in the SC-36 4.1.1 accepted list | TRUST | TRUST accepts it as a §13.1 privacy-class item and lists it in TRUST §scope, or confirms deferral to 4.2 (REL train). Until then the default is 4.2 |
| O-3 | The overlay CSS budget (≤6 KB gz, all 7 + shared) has no source. It is provisional | OVL (row), PKG (file) | Calibrate at 5.0.0-alpha.1 (QA L10), then submit the row to `docs/size-budgets.json` with a changelog entry. It must be ≤ the PERF REQ-PERF-01 8 KB ceiling |
| O-4 | The §16.1 absolute fps targets (≥45 software, ≥110 p50 GPU 120 Hz, ≥55 mobile) and the long-task budget are unmeasured design targets. The 120 Hz GPU profile needs a provisioned GPU pool | PERF (budgets file), QA (GPU pool, SC-29) | QA provisions the GPU pool for REQ-PERF-36. PERF records calibrated rows in `tests/perf/harness/budgets.json` at alpha.1. OVL updates §16.1 if calibration moves a target (ratchet down only) |
| O-5 | REQ-OVL-05 attribution of the 4 infinite animations on `glass-modal` (E-09) has not been run, so REQ-OVL-71's ≥30 fps target on 4.x is unverified | OVL | Run `document.getAnimations()` attribution in the remote L10 lane (OVL-007) and record the list in the PR. Then apply OVL-008 and run `overlays-glass-modal-4x.spec.ts` (OVL-009) |
| O-6 | The decisions needing human confirmation in `_shared-contracts.md` (SC-24 Button API break, SC-36 scope split, SC-38) do not change this PRD's contract. Toast `intent` is already SC-24 compliant | Program (REL) | Confirm. No OVL change is expected |
| O-7 | `tests/a11y/apg/dialog.apg.spec.ts` is CREATEd by both OVL-053 and A11Y-077. SC-30/OV-15 give the widget spec to OVL-053 | A11Y | A11Y-077 becomes a harness self-test fixture with a different path, which leaves one CREATE (SC-40 rule 5) |
| O-8 | The obscured-page rule (OVL-058) edits MAT's `material.css` in `ag.material` | MAT | MAT reviews or takes over OVL-058, or adds a MAT task that OVL-058 depends on. The rule ships only if REQ-OVL-08's ΔE check passes |
| O-9 | Task-graph validation: `scripts/release/verify-task-graph.mjs` (SC-40) does not exist yet. `tasks/OVL.json` was checked by a one-off script only | REL | Land the validator and run it over `tasks/*.json` |
