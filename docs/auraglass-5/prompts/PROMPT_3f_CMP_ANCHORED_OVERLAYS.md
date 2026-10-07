# PROMPT-3f (CMP lane O2): Anchored and transient overlays

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **O2**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3f-O2"` (33 tasks: CMP-262..294).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

## Scope

**Owned paths (exclusive inside CMP):** `src/components/{popover,tooltip,menu,toast}/**`

**Order inside the lane:** Popover, Tooltip, Menu/ContextMenu/Menubar, Toast + history. It imports `overlays/_shared` only through its `index.ts` (O1-owned), whose final export names (`overlayMaterial`, positioning defaults) O1 commits in its first day-0 PR; O2 codes against those names from day 0 and never against O1's progress

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-06, REQ-CMP-22, REQ-CMP-85, REQ-CMP-97, REQ-CMP-98, REQ-CMP-99, REQ-CMP-100, REQ-CMP-101, REQ-CMP-102, REQ-CMP-103, REQ-CMP-104, REQ-CMP-105, REQ-CMP-106, REQ-CMP-107, REQ-CMP-108, REQ-CMP-109, REQ-CMP-110.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-o2 -b next-cmp/o2-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3f-O2") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-262 | CREATE | `NEW:src/components/popover/Popover.client.tsx` | Popover.Root/Trigger/Portal/Positioner/Popup/Arrow/Title/Description/Close over Base UI Popover. Trigger openOnHover=false, delay=300, closeDelay=150 (hover mode also … |  | REQ-CMP-97, REQ-CMP-85 |
| CMP-263 | CREATE | `NEW:src/components/popover/Popover.css` | overlayMaterial('popover') regular; Arrow = clipped child of popup backdrop layer or solid triangle in --ag-surface-fill + rim (no second backdrop-filter); … | CMP-262 | REQ-CMP-98 |
| CMP-264 | CREATE | `NEW:src/components/popover/Popover.meta.ts` | Parts, states, thickness regular, budgetKb 14, blurredLayers 1, apg dialog (non-modal) + disclosure URLs, lineage … | CMP-262 | REQ-CMP-22 |
| CMP-265 | CREATE | `NEW:src/components/tooltip/Tooltip.client.tsx` | Tooltip.Provider (delay 600, closeDelay 0, skip-delay window 400ms), Root, Trigger, Portal, Positioner, Popup, Arrow over Base UI Tooltip. Opens on pointer hover and … |  | REQ-CMP-99 |
| CMP-266 | MODIFY | `src/components/tooltip/Tooltip.client.tsx` | Dev-only console.error when Tooltip.Popup contains a, button, input, select, textarea or [tabindex] descendants, message pointing to Popover openOnHover; popup max … | CMP-265 | REQ-CMP-100 |
| CMP-267 | MODIFY | `src/components/tooltip/Tooltip.client.tsx` | Touch: under (pointer: coarse) tap does not open; long-press >=500ms on trigger (pointer events on the trigger, no global listener) opens; next outside tap closes via … | CMP-265 | REQ-CMP-101 |
| CMP-268 | CREATE | `NEW:src/components/tooltip/Tooltip.css` | overlayMaterial('tooltip') thin (12px); no contain:layout paint on popup; enter --ag-duration-small 200ms opacity + 2px translate from data-side, exit … | CMP-265 | REQ-CMP-101 |
| CMP-269 | CREATE | `NEW:src/components/tooltip/Tooltip.meta.ts` | Parts, thickness thin, budgetKb 10, blurredLayers 1, apg tooltip URL, lineage GlassTooltip (GlassTooltip.tsx and duplicate at GlassPopover.tsx:678), ChartTooltip … | CMP-265 | REQ-CMP-22 |
| CMP-270 | TEST | `NEW:src/components/popover/Popover.test.tsx` | Cases: 'openOnHover delays' (fake timers 300/150), 'focus opens hover popover', 'aria wiring' (haspopup dialog, expanded, controls, role dialog labelled), 'hover-mode … | CMP-262 | REQ-CMP-97, REQ-CMP-85 |
| CMP-271 | TEST | `NEW:src/components/tooltip/Tooltip.test.tsx` | Cases: 'describedby on trigger' (the focused element carries aria-describedby), 'dev error on interactive content', 'provider skip-delay' (second trigger opens without … | CMP-266 | REQ-CMP-99 |
| CMP-272 | CREATE | `NEW:src/components/popover/Popover.stories.tsx` | Popover: Click, Hover (openOnHover, replaces HoverCard), WithForm, Collision (each edge), Arrow; NEW src/components/tooltip/Tooltip.stories.tsx: Default, OnIconButton, … | CMP-270, CMP-271 | REQ-CMP-01 |
| CMP-273 | CREATE | `NEW:src/components/menu/Menu.client.tsx` | Menu.Root, Trigger, Portal, Positioner, Popup, Item, LinkItem, CheckboxItem, CheckboxItemIndicator, RadioGroup, RadioItem, RadioItemIndicator, Group, GroupLabel, … |  | REQ-CMP-102 |
| CMP-274 | MODIFY | `src/components/menu/Menu.client.tsx` | Keyboard per APG menu button (configure pinned Base UI): Enter/Space/ArrowDown open + focus first; ArrowUp opens + focus last; arrows wrap (loop=true); Home/End; … | CMP-273 | REQ-CMP-103 |
| CMP-275 | MODIFY | `src/components/menu/Menu.client.tsx` | Item semantics: role menuitem\|menuitemcheckbox\|menuitemradio; CheckboxItem checked='indeterminate' → aria-checked='mixed'; disabled items focusable with … | CMP-273 | REQ-CMP-104 |
| CMP-276 | MODIFY | `src/components/menu/Menu.client.tsx` | Submenus open on hover after 100ms with Base UI safe triangle and on ArrowRight; Menu.Trigger openOnHover allowed only inside Menubar (dev warning elsewhere). | CMP-273 | REQ-CMP-103 |
| CMP-277 | CREATE | `NEW:src/components/menu/ContextMenu.client.tsx` | ContextMenu.Root, ContextMenu.Trigger (region) + Menu popup parts re-exposed; opens on contextmenu event, Shift+F10 and ContextMenu key at pointer/focused element; … | CMP-273 | REQ-CMP-105 |
| CMP-278 | CREATE | `NEW:src/components/menu/Menubar.client.tsx` | Menubar root role=menubar aria-orientation=horizontal; children Menu.Root with triggers role=menuitem; one roving tab stop; ArrowLeft/Right move between triggers and … | CMP-273, CMP-276 | REQ-CMP-105 |
| CMP-279 | CREATE | `NEW:src/components/menu/Menu.css` | overlayMaterial('menu') regular; items block-size 32px (pointer:fine) / 44px (pointer:coarse), inline padding --ag-space-3; [data-highlighted] raises --ag-surface-fill … | CMP-273 | REQ-CMP-104 |
| CMP-280 | CREATE | `NEW:src/components/menu/Menu.meta.ts` | Meta for Menu, ContextMenu, Menubar: parts, states, thickness regular, budgetKb 22, blurredLayers 1 (+1 per open submenu, max 3), apg menu-button + menubar URLs, … | CMP-278 | REQ-CMP-22 |
| CMP-281 | TEST | `NEW:src/components/menu/Menu.test.tsx` | Cases: 'roles', 'aria-checked mixed', 'aria-disabled focusable', 'aria-keyshortcuts', 'closeOnClick defaults', 'coarse target size' (computed block-size 44px with … | CMP-275, CMP-276, CMP-279 | REQ-CMP-104 |
| CMP-282 | CREATE | `NEW:src/components/menu/Menu.stories.tsx` | Stories: Default, CheckboxRadio (incl indeterminate), Submenus, Shortcuts, DisabledItems, LongList, ContextMenuRegion, Menubar (File/Edit/View); open by default where … | CMP-281 | REQ-CMP-06 |
| CMP-283 | CREATE | `NEW:src/components/toast/Toast.client.tsx` | Toast.Provider over Base UI Toast.Provider + useToastManager: limit=3, timeout=5000, position top-start\|top-center\|top-end\|bottom-start\|bottom-center\|bottom-end … |  | REQ-CMP-106 |
| CMP-284 | CREATE | `NEW:src/components/toast/useToast.ts` | useToast() → {toast, update, dismiss, promise, toasts, history}; toast({title, description?, intent?: neutral\|info\|success\|warning\|danger, action?: … | CMP-283 | REQ-CMP-107 |
| CMP-285 | MODIFY | `src/components/toast/Toast.client.tsx` | Viewport aria-label={labels.region ?? 'Notifications'}, F6-reachable (Base UI); polite → role=status, assertive → role=alert only for intent=danger (else dev warning + … | CMP-283 | REQ-CMP-107 |
| CMP-286 | MODIFY | `src/components/toast/Toast.client.tsx` | One Base UI timeout per toast; paused on viewport hover, focus-within, and document.visibilityState==='hidden'; resumed with remaining time; toasts with action and no … | CMP-283 | REQ-CMP-108 |
| CMP-287 | CREATE | `NEW:src/components/toast/Toast.css` | Toast.Progress part: CSS @keyframes scale on --_ag-toast-progress, animation-duration = toast duration, animation-play-state bound to paused state attribute; 0 React … | CMP-286 | REQ-CMP-108 |
| CMP-288 | MODIFY | `src/components/toast/Toast.css` | Stacking: up to limit visible, older collapsed via Base UI --toast-index → translate + scale(1 - 0.04*index), expand on hover/focus; swipe-to-dismiss toward position … | CMP-283 | REQ-CMP-109 |
| CMP-289 | MODIFY | `src/components/toast/Toast.css` | Material: each toast overlayMaterial('toast') thin, radius --ag-radius-lg; visible stack wrapped in one SurfaceGroup (MAT-048) so 3 toasts share 1 backdrop-filter; … | CMP-288 | REQ-CMP-109 |
| CMP-290 | CREATE | `NEW:src/components/toast/ToastHistory.client.tsx` | With history {limit:50}: dismissed/expired toasts move to useToast().history {entries: ToastHistoryEntry[] (id,title,description,intent,createdAt,read), unread, … | CMP-284 | REQ-CMP-110 |
| CMP-291 | CREATE | `NEW:src/components/toast/Toast.meta.ts` | Parts, thickness thin, budgetKb 14, blurredLayers 1 (stack), live-region notes, lineage GlassToast/GlassToastProvider/GlassToastViewport/useToast(4.x)/feedback … | CMP-290 | REQ-CMP-22 |
| CMP-292 | TEST | `NEW:src/components/toast/Toast.test.tsx` | Cases: 'single provider' (nested → dev error), 'intent', 'type rejected', 'promise updates in place', 'stack shares one backdrop' (one data-ag-group wrapper around … | CMP-289, CMP-290 | REQ-CMP-106 |
| CMP-293 | TEST | `NEW:src/components/toast/toast-timers.test.tsx` | Fake timers: 'pause on hover', 'pause on focus', 'pause when hidden' (visibilityState stub + visibilitychange), 'resume remaining time ±50 ms', 'action toasts … | CMP-286 | REQ-CMP-108 |
| CMP-294 | CREATE | `NEW:src/components/toast/Toast.stories.tsx` | Stories: EachIntent, WithAction, Promise, StackOf5 (limit 3), NotificationCenterInSheet (Toast.History inside Sheet), Swipe (mobile viewport); stable ids … | CMP-292 | REQ-CMP-01 |

## Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-41, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE O2 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
