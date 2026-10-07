# PROMPT-3e (CMP lane O1): Modal overlays

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **O1**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3e-O1"` (73 tasks: CMP-189..261).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside CMP):** `src/components/{overlays/_shared,dialog,alert-dialog,sheet}/**`, `tests/overlays/**`

**Order inside the lane:** shared layer, then Dialog (pattern proof, perf story), AlertDialog, Sheet (detents last)

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-02, REQ-CMP-04, REQ-CMP-05, REQ-CMP-06, REQ-CMP-07, REQ-CMP-11, REQ-CMP-12, REQ-CMP-14, REQ-CMP-17, REQ-CMP-22, REQ-CMP-23, REQ-CMP-36, REQ-CMP-78, REQ-CMP-79, REQ-CMP-80, REQ-CMP-81, REQ-CMP-82, REQ-CMP-83, REQ-CMP-85, REQ-CMP-86, REQ-CMP-87, REQ-CMP-89, REQ-CMP-91, REQ-CMP-92, REQ-CMP-93, REQ-CMP-94, REQ-CMP-95, REQ-CMP-96, REQ-CMP-97, REQ-CMP-99, REQ-CMP-109, REQ-CMP-110, REQ-CMP-132, REQ-CMP-133, REQ-CMP-136, REQ-CMP-138, REQ-CMP-140, REQ-CMP-141.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-o1 -b next-cmp/o1-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3e-O1") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-189 | MODIFY | `src/components/dialog/Dialog.css` | REQ-MOT-14/-16/-114/-115 on Dialog/AlertDialog: modal emergence (opacity, scale 0.96->1, --_ag-optics 0->1 over 60% of medium, spring-smooth; scrim opacity only, static … | CMP-209, CMP-215 | REQ-CMP-01 |
| CMP-190 | TEST | `NEW:src/components/modal/__tests__/overlay-deprecations-4x.test.tsx` | For each wired deprecation id (4.2 + 4.3): rendering twice warns exactly once per page load with the PRD-01 format '[aura-glass] DEP-…'; NODE_ENV=production emits … |  | REQ-CMP-132 |
| CMP-191 | CREATE | `NEW:src/components/overlays/_shared/overlayPortal.tsx` | OverlayPortal({component, children, keepMounted}): renders the given Base UI *.Portal with container=usePortalContainer() (src/foundation/portal.ts → provider … |  | REQ-CMP-11 |
| CMP-192 | CREATE | `NEW:src/components/overlays/_shared/overlaySurface.ts` | overlayMaterial(kind: 'dialog'\|'alert'\|'sheet'\|'popover'\|'menu'\|'tooltip'\|'toast') → {...materialProps({layer:'overlay', thickness, variant:'regular'}), … |  | REQ-CMP-85 |
| CMP-193 | CREATE | `NEW:src/components/overlays/_shared/positioning.ts` | export const defaultPositionerProps = {sideOffset: 8, collisionPadding: 8, collisionAvoidance: {side:'flip', align:'shift'}} used by every anchored popup Positioner. |  | REQ-CMP-85, REQ-CMP-97 |
| CMP-194 | CREATE | `NEW:src/components/overlays/_shared/overlays.css` | @layer ag.components: .ag-scrim {position:fixed;inset:0;backdrop-filter:blur(var(--_ag-scrim-blur))} with --_ag-scrim-blur from PRD-04 scrim token (<=12px), solved … |  | REQ-CMP-79 |
| CMP-195 | CREATE | `NEW:src/components/overlays/_shared/useOverlayAnimating.ts` | Ref-callback hook (with cleanup) that sets data-ag-animating on popup and scrim from the first data-starting-style/data-ending-style frame until … | CMP-194 | REQ-CMP-83 |
| CMP-196 | CREATE | `NEW:src/components/overlays/_shared/useOverlayLayer.ts` | useOverlayLayer({kind, modal, open, onOpenChange}) registers {id, kind, modal, onEscape} with PRD-05 useLayer() (src/theme/layers/useLayer.ts) while open; onEscape → … |  | REQ-CMP-80 |
| CMP-197 | MODIFY | `lint/rules/cmp/` | Add rule auraglass/no-overlay-global-listeners: reports document\|window.addEventListener('keydown'\|'mousedown'\|'pointerdown'\|'scroll'\|'resize', …) and any assignment to … |  | REQ-CMP-12 |
| CMP-198 | TEST | `lint/rules/cmp/` | No OVL render-purity rule (SC-16 drops no-date-now-in-render). Verify that PKG's auraglass/no-random-in-render (PKG-086, registered at error by PKG-089) applies to the … |  | REQ-CMP-14 |
| CMP-199 | MODIFY | `lint/rules/cmp/` | Scope to src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast,overlays}/**: auraglass/no-overlay-global-listeners, auraglass/no-date-now-in-render and … | CMP-197, CMP-198 | REQ-CMP-12 |
| CMP-200 | TEST | `NEW:src/components/overlays/_shared/lint-overlays.test.ts` | RuleTester for both rules with fixtures in _shared/__fixtures__/lint/*.tsx (keydown, mousedown, pointerdown, scroll, resize listeners; … | CMP-199 | REQ-CMP-12 |
| CMP-201 | TEST | `NEW:src/components/overlays/_shared/overlay-layer.test.tsx` | describe.each(OVERLAY_SUBJECTS from NEW _shared/__tests__/subjects.ts): portal target is [data-ag-portal-root]; document.body has 0 direct overlay children with … | CMP-191 | REQ-CMP-11 |
| CMP-202 | TEST | `NEW:src/components/overlays/_shared/overlay-dom-contract.test.tsx` | Per subject and part: snapshot of attribute-NAME set (not markup) incl. data-ag-part and data-state open\|closed alongside data-open/data-closed; absence of … | CMP-201 | REQ-CMP-14, REQ-CMP-06, REQ-CMP-07 |
| CMP-203 | TEST | `NEW:src/components/overlays/_shared/overlay-idle.test.tsx` | Per subject open: wrap in React Profiler; after enter transition ends, advance fake timers 2000ms with no input → onRender count 0; jest.getTimerCount() 0 (1 per toast … | CMP-201 | REQ-CMP-82 |
| CMP-204 | TEST | `NEW:src/components/overlays/_shared/overlay-dev-counter.test.tsx` | Using PRD-04 surfaceCounter (no second counter): fixture with 5 page Surfaces (fine pointer) / 2 (coarse, matchMedia stub) + one open subject → exactly one warning … | CMP-201 | REQ-CMP-04 |
| CMP-205 | TEST | `NEW:src/components/overlays/_shared/popup-contract.test.tsx` | Parametrised over anchored kinds (popover, tooltip, menu; toast for material only): Positioner→Popup structure, data-ag-part positioner\|popup\|arrow, Base UI … | CMP-192, CMP-193, CMP-201 | REQ-CMP-85 |
| CMP-206 | TEST | `NEW:src/components/overlays/_shared/overlay-ssr.test.tsx` | Per subject: renderToString closed and defaultOpen, then hydrateRoot in jsdom; console.error spy 0 calls; no hydration warnings. | CMP-201 | REQ-CMP-04 |
| CMP-207 | INFRA | `fragments/playwright/cmp.json` | Add projects overlays-chromium, overlays-webkit, overlays-firefox (testMatch … |  | REQ-CMP-138, REQ-CMP-141 |
| CMP-208 | INFRA | `fragments/playwright/cmp.json` | No overlay-specific workflow (SC-29; workflows are the PR-scope qual:certify:l* jobs/main/release.yml owned by QA). Register the overlay specs in the QA lanes: … | CMP-207 | REQ-CMP-138 |
| CMP-209 | CREATE | `NEW:src/components/dialog/Dialog.client.tsx` | Dialog.Root over Base UI Dialog: open, defaultOpen, onOpenChange(open, details: OverlayOpenChangeDetails reason … | CMP-191, CMP-196 | REQ-CMP-86 |
| CMP-210 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Dialog.Trigger, Dialog.Close (aria-label from labels.close default 'Close'; >=24px target, 44px hit area under (pointer:coarse) via pseudo-element), Dialog.Portal via … | CMP-209 | REQ-CMP-86 |
| CMP-211 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Dialog.Backdrop: the single [data-ag-part=backdrop].ag-scrim with data-ag-overlay-depth; not rendered when modal={false}; only opacity animates. | CMP-194, CMP-209 | REQ-CMP-79 |
| CMP-212 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Dialog.Popup: role=dialog + aria-modal=true on popup only; initialFocus (ref\|fn; default first tabbable in Body else popup), finalFocus; size sm\|md\|lg\|xl\|full → … | CMP-192, CMP-209 | REQ-CMP-87 |
| CMP-213 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Dialog.Title and Dialog.Description (data-ag-part title\|description, wired to aria-labelledby/-describedby by Base UI); dev-only console.error when a Dialog opens with … | CMP-212 | REQ-CMP-87 |
| CMP-214 | CREATE | `NEW:src/components/dialog/DialogLayout.tsx` | Dialog.Header/Body/Footer: plain divs, no directive, no hooks, no data-ag-surface; data-ag-part header\|body\|footer; Body padding 'default'\|'none', scrolls internally, … | CMP-212 | REQ-CMP-81 |
| CMP-215 | CREATE | `NEW:src/components/dialog/Dialog.css` | @layer ag.components: sizes, --ag-space-4 inset, block size <= calc(100dvh - 2*var(--ag-space-4)), var(--ag-visual-viewport-height) when set; container query <640px: … | CMP-212 | REQ-CMP-86, REQ-CMP-89, REQ-CMP-78 |
| CMP-216 | MODIFY | `src/components/dialog/Dialog.client.tsx` | Nested dialogs: parent Popup gets data-ag-nested-open while a child Dialog is open (Base UI nested state); only the topmost scrim blurs via data-ag-overlay-depth. | CMP-211, CMP-215 | REQ-CMP-86, REQ-CMP-89, REQ-CMP-78, REQ-CMP-79 |
| CMP-217 | CREATE | `NEW:src/components/alert-dialog/AlertDialog.client.tsx` | AlertDialog with the identical part list over Base UI AlertDialog (+ AlertDialogLayout.tsx, AlertDialog.css, index.ts): role=alertdialog; outside press never closes; … | CMP-209, CMP-212 | REQ-CMP-86 |
| CMP-218 | CREATE | `NEW:src/components/dialog/Dialog.meta.ts` | Dialog.meta.ts and NEW:src/components/alert-dialog/AlertDialog.meta.ts per PRD-16 meta schema: parts, data-ag-part values, states, variants, thickness thick, budgetKb … | CMP-217 | REQ-CMP-22 |
| CMP-219 | MODIFY | `src/root/cmp.ts` | Add root value exports Dialog, AlertDialog and types DialogRootProps, OverlayOpenChangeDetails (C-E) through the PRD-02 exports manifest if present; no Base UI types … | CMP-217 | REQ-CMP-23, REQ-CMP-02 |
| CMP-220 | TEST | `NEW:src/components/dialog/Dialog.test.tsx` | Cases: 'role on popup', 'dev error without name', 'labelled and described', 'sizes' (computed max-inline-size per size), 'material attributes' (data-ag-layer overlay, … | CMP-213, CMP-214, CMP-215 | REQ-CMP-86 |
| CMP-221 | TEST | `NEW:src/components/alert-dialog/AlertDialog.test.tsx` | Cases: 'initial focus on cancel', 'outside press ignored', 'escape reason', 'danger intent only on action button'. | CMP-217 | REQ-CMP-91 |
| CMP-222 | CREATE | `NEW:src/components/dialog/Dialog.stories.tsx` | Dialog: Default, LongContent, Sizes (args), Form (TextFields → content-sunken), Nested, NonModal, PaletteShell; NEW src/components/alert-dialog/AlertDialog.stories.tsx: … | CMP-220, CMP-217 | REQ-CMP-01 |
| CMP-223 | CREATE | `NEW:src/components/dialog/DialogPerf.stories.tsx` | Story 'Overlays/Perf/Dialog over dashboard': defaultOpen Dialog over a page with 6 standard surfaces (TopBar, Sidebar, 4 Cards content-raised); successor of the 4.x … | CMP-222 | REQ-CMP-01 |
| CMP-224 | CREATE | `NEW:src/components/overlays/_shared/__tests__/subjects.ts` | Append Dialog and AlertDialog to OVERLAY_SUBJECTS so overlay-layer, dom-contract, idle, dev-counter, ssr, motion and a11y-modes harnesses cover them; all green. | CMP-220, CMP-221 | REQ-CMP-04 |
| CMP-225 | MODIFY | `src/root/cmp.ts` | Add root value exports Popover, Tooltip and types PopoverSide, PopoverAlign via the PRD-02 manifest. (Cross-lane input 3f-O2 is consumed through its frozen interface, … |  | REQ-CMP-23, REQ-CMP-02 |
| CMP-226 | MODIFY | `src/components/overlays/_shared/popup-contract.test.tsx` | Parametrise rows for real Popover and Tooltip (replacing the fixture): data-ag-part positioner\|popup\|arrow, data-side/data-align, data-ag-overlay, material attributes. … |  | REQ-CMP-85 |
| CMP-227 | MODIFY | `fragments/size-budgets/cmp.ts` | Add per-import budget lines Popover <=14 KB and Tooltip <=10 KB min+gz to the PRD-02 budget file docs/size-budgets.json (checked by scripts/ci/verify-size-budgets.mjs; … | CMP-225 | REQ-CMP-136 |
| CMP-228 | MODIFY | `src/root/cmp.ts` | Add root value exports Menu, ContextMenu, Menubar via the PRD-02 manifest. (Cross-lane input 3f-O2 is consumed through its frozen interface, never waited for.) |  | REQ-CMP-23, REQ-CMP-02 |
| CMP-229 | MODIFY | `fragments/size-budgets/cmp.ts` | Add Menu <=22 KB line (incl ContextMenu, Menubar parts); overlays-overlay-budget.spec.ts rows Menu 1 layer, +1 per open submenu, max 3; append Menu, ContextMenu, … | CMP-228 | REQ-CMP-136 |
| CMP-230 | CREATE | `NEW:src/components/sheet/Sheet.client.tsx` | Sheet.Root/Trigger/Portal/Backdrop/Popup/Title/Description/Close over Base UI Dialog; side start\|end\|top\|bottom\|left\|right (default end; start/end flip under dir=rtl, … | CMP-209, CMP-224 | REQ-CMP-92 |
| CMP-231 | MODIFY | `src/components/sheet/Sheet.client.tsx` | preset 'panel'\|'action': action forces side=bottom and renders Sheet.Action <button> items plus a separated cancel Sheet.Close (replaces GlassActionSheet); Sheet.Action … | CMP-230 | REQ-CMP-93 |
| CMP-232 | CREATE | `NEW:src/components/sheet/useSheetDetents.ts` | Pure resolveDetent({positionPx, velocityPxMs, detentsPx, viewportPx}) → {index}\|{close:true} (velocity threshold 0.5px/ms; downward fling past lowest detent closes) + … | CMP-230 | REQ-CMP-94, REQ-CMP-96 |
| CMP-233 | CREATE | `NEW:src/components/sheet/SheetHandle.client.tsx` | Drag on handle only: pointer events + pointer capture, touch-action:none on handle; transform translateY written to popup ref inside rAF, 0 React commits per … | CMP-232 | REQ-CMP-94, REQ-CMP-96 |
| CMP-234 | MODIFY | `src/components/sheet/SheetHandle.client.tsx` | Handle is <button aria-label={labels.handle ?? 'Resize sheet'}>; Enter/Space cycles detents upward; Escape closes; detent change announced via PRD-05 announcer … | CMP-233 | REQ-CMP-95 |
| CMP-235 | MODIFY | `src/components/sheet/Sheet.client.tsx` | Set data-ag-full-height on popup when active detent is 'full' or a side sheet's block size >= 90% of viewport (ResizeObserver ref callback with cleanup); fill resolves … | CMP-230 | REQ-CMP-95 |
| CMP-236 | CREATE | `NEW:src/components/sheet/Sheet.css` | Safe areas (bottom env(safe-area-inset-bottom), side outer-edge inset-left/right, top inset-top); side size sm\|md\|lg 320/400/560px capped calc(100vw - 48px), <640px … | CMP-230 | REQ-CMP-95 |
| CMP-237 | MODIFY | `src/components/sheet/Sheet.client.tsx` | modal={false}: no Backdrop, no inert, no scroll lock; focus moves in on open, returns on close; Tab can leave the sheet (used by PRD-11 inspector drawer). | CMP-230 | REQ-CMP-92 |
| CMP-238 | CREATE | `NEW:src/components/sheet/Sheet.meta.ts` | Parts, thickness thick, budgetKb 24, blurredLayers 2 modal / 1 non-modal, apg dialog-modal, lineage GlassDrawer, GlassBottomSheet, GlassActionSheet, … | CMP-231 | REQ-CMP-22 |
| CMP-239 | MODIFY | `src/root/cmp.ts` | Add root value export Sheet and types SheetSide, SheetDetent via the PRD-02 manifest. | CMP-230 | REQ-CMP-23, REQ-CMP-02 |
| CMP-240 | TEST | `NEW:src/components/sheet/Sheet.test.tsx` | Cases: 'sides incl RTL flip', 'preset action', 'detent state machine' (table: slow drag near each detent, fast fling up/down, fling below lowest → close), 'full height … | CMP-232, CMP-234, CMP-235, CMP-237 | REQ-CMP-92 |
| CMP-241 | CREATE | `NEW:src/components/sheet/Sheet.stories.tsx` | Stories: RightPanel, LeftPanelRTL, BottomDetents ([0.5,'full']), ActionPreset, NonModalInspector, FullHeight; open by default; stable ids overlays-sheet--*; captures at … | CMP-240 | REQ-CMP-95 |
| CMP-242 | MODIFY | `fragments/size-budgets/cmp.ts` | Add Sheet <=24 KB min+gz per-import line; calibrate remotely at alpha; ratchet down only. | CMP-239 | REQ-CMP-136 |
| CMP-243 | MODIFY | `src/root/cmp.ts` | Add root value exports Toast, useToast (C-B vs 4.x useToast; same name, new return shape) and types ToastOptions, ToastIntent, ToastHistoryEntry via the PRD-02 … |  | REQ-CMP-23, REQ-CMP-02 |
| CMP-244 | MODIFY | `scripts/cmp/verify-side-effects.mjs` | Add the overlay flagship entries (Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, ContextMenu, Menubar, Toast) to the PRD-02 side-effect gate list (and … | CMP-243 | REQ-CMP-110 |
| CMP-245 | MODIFY | `fragments/size-budgets/cmp.ts` | Add Toast <=14 KB line; overlays-overlay-budget.spec.ts row: 3-toast stack adds 1 blurred layer; append Toast to OVERLAY_SUBJECTS (idle harness allows 1 timer per … | CMP-243 | REQ-CMP-109 |
| CMP-246 | TEST | `NEW:src/components/overlays/_shared/provider-mount.test.tsx` | With real AuraGlassProvider: useToast() works without extra wrapper; Tooltip opens without explicit Tooltip.Provider; toasts={false}/tooltips={false} remove the … |  | REQ-CMP-99 |
| CMP-247 | MODIFY | `src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/*.meta.ts` | Fill the `migration` table in every overlay .meta.ts (SC-27): each §2.4 name maps to its successor (LiquidGlassPopoverMenu/GlassMenuPrimitive/CollapsedMenu → Menu; … | CMP-218, CMP-238 | REQ-CMP-133, REQ-CMP-140 |
| CMP-248 | CREATE | `NEW:scripts/cmp/gen-overlay-selector-table.mjs` | Generator reading every overlay .meta.ts selectorChanges → NEW docs/auraglass-5/migration/overlays-selectors.md (per component: 4.x selector/role/attribute → 5.0 … | CMP-218, CMP-238 | REQ-CMP-22 |
| CMP-249 | DOC | `NEW:apps/docs/content/cmp/migration/overlays-requests.md` | Request list to PRD-01 (bridge doctor --v5) and PRD-16: rule flagging `body >` selectors mentioning 4.x overlay classes; providers codemod inserting AuraGlassProvider; … | CMP-248 | REQ-CMP-22 |
| CMP-250 | MODIFY | `src/components/overlays/_shared/__tests__/subjects.ts` | Register subjects overlays/* (kind x thickness) in the PRD-03 three-composite token gate (>=4.5 on-surface, >=3 muted large, >=7 contrast-more) and the PRD-18 OCR pixel … |  | REQ-CMP-36 |
| CMP-251 | CREATE | `NEW:src/components/overlays/_shared/OverlayMatrix.stories.tsx` | Matrix stories generated from the 7 .meta.ts files: state x thickness x transparency (glass/tinted/solid) x scheme over the 8 scenes; no hand-written cells; stable ids. … |  | REQ-CMP-141 |
| CMP-252 | TEST | `src/components/overlays/_shared/__tests__/subjects.ts` | Pixel lane 'mobile containment': every overlay story at 390x844 has scrollWidth===390; RTL baseline per flagship at 390 approved through PRD-18 human review flow. | CMP-251 | REQ-CMP-96 |
| CMP-253 | TEST | `src/components/overlays/_shared/overlay-ssr.test.tsx` | Canary lane: each flagship closed and defaultOpen renderToString → hydrateRoot with 0 warnings in Next 16 + React 19.3 and Next 15 + React 19.0 canaries (remote). | CMP-206 |  |
| CMP-254 | DOC | `NEW:apps/docs/content/cmp/migration/overlays-manual-scripts.md` | Per-cell manual test scripts generated from .meta.ts keyboard tables for 7 flagships x (VoiceOver macOS+Safari, VoiceOver iOS, NVDA+Chrome, TalkBack+Chrome, physical … |  | REQ-CMP-138 |
| CMP-255 | MODIFY | `fragments/size-budgets/cmp.ts` | Remote perf lane grades for all 7 flagships (>=C each, Dialog target >=B); calibrate REQ-OVL-77 lines to measured + PRD-07 headroom, never above ceilings … | CMP-227, CMP-229, CMP-242, CMP-245 | REQ-CMP-136 |
| CMP-256 | TEST | `lint/rules/cmp/` | Static lane over src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast,overlays}/**: 0 hits for document.addEventListener, window.addEventListener, … | CMP-200 | REQ-CMP-05 |
| CMP-257 | MODIFY | `src/root/cmp.ts` | Final root: exactly Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu, ContextMenu, Menubar, Toast + useToast and the §10.1 types; no 4.x overlay names (former … |  | REQ-CMP-23, REQ-CMP-02 |
| CMP-258 | DOC | `src/root/cmp.ts` | rc.1: review API Extractor root report overlay section (no @base-ui specifier in .d.ts; types match §10.1); freeze; later changes C-E only (PRD-01 change-class gate). | CMP-257 | REQ-CMP-17 |
| CMP-259 | DOC | `NEW:apps/docs/content/cmp/migration/overlays-consumers.md` | Ledger with green CI run links on the final contract SHA for PRD-09 Select/Combobox, PRD-12 DatePicker/DateRangePicker/FilterBar, PRD-13 Citation/SourceList, PRD-11 … | CMP-258 |  |
| CMP-260 | DOC | `src/components/dialog/Dialog.meta.ts` | Verify the PRD-16 docs generator renders per flagship (from .meta.ts): parts table, data-ag-part/data-state table, keyboard table, 4.x lineage, budget line, perf grade; … | CMP-255 | REQ-CMP-22 |
| CMP-261 | TEST | `src/components/dialog/Dialog.stories.tsx` | Contract check only (SC-31: OVL-055 authors Dialog.stories.tsx): run story-contract.test.ts against it; assert Playground opens via defaultOpen (REQ-SB-07 entrance … | CMP-222 | REQ-CMP-01 |

## Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE O1 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
