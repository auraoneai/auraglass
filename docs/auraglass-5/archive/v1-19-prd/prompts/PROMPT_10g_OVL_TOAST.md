# PROMPT-10g (OVL): Toast, useToast, notification history

You are implementing part of PRD-OVL (Flagship Overlays) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (5.0 work on `main`). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md`:
  - §1 items 6–7, §2.3 E-28..E-31, §2.4 (toast rows)
  - §4.3 (toast viewport not inert)
  - §5.8 REQ-OVL-61..69
  - §10.1 (Toast, `useToast`), §10.2 (toast rows), §10.4
  - §11 item 7, §12.1–12.2 (toast rows), §13 item 2 (Toast)
  - §14 (Toast row), §15 (Toast row), §16.2, §17 AC-OVL-19
- Consumed: PRD-A11Y toast region and provider mounting (§4.5, REQ-A11Y-32), PRD-MAT `SurfaceGroup` (MAT-048), PRD-PKG side-effect gate.
- Layout and conflicts: `docs/auraglass-5/prompts/PROMPT_10_OVL.md`. Conflict 2 (toast blur vs. PRD-PERF) and conflict 4 (provider props) are binding. The parts `progress`, `history` and `history-item` need `AG_PARTS` values.
- Contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-15, SC-20 (`<Name>.css` starts with the six-name `@layer` statement, rules in `ag.components`), SC-25 (`usePortalContainer()`, `LayerStack` is the only Escape dispatcher), SC-29 (lanes L5/L8/L10), SC-30 (APG specs `tests/a11y/apg/` on the A11Y-073 harness; other behaviour specs `tests/e2e/overlays/`), SC-40 (`depends_on` holds anchor task ids).
- Tasks: `docs/auraglass-5/tasks/OVL.json` OVL-113..OVL-130. Anchor prerequisites: OVL-020/021 (10b), A11Y-029/049 (provider, toast layer), A11Y-073, MAT-048 `SurfaceGroup`, PKG-042 side-effect gate, PKG-048/049, FND-005, SB-048.

## 2. Scope
May create or modify:
- NEW `src/components/toast/`:
  - `Toast.client.tsx` (Provider, Viewport, Root, Title, Description, Action, Close, Progress)
  - `ToastHistory.client.tsx` (History, HistoryItem)
  - `useToast.ts` (`"use client"`), `historyStore.ts`
  - `Toast.css`, `Toast.meta.ts`, `index.ts`
  - `Toast.test.tsx`, `toast-timers.test.tsx`, `Toast.stories.tsx`
- NEW `tests/a11y/apg/toast.apg.spec.ts`, NEW `tests/e2e/overlays/toast.touch.spec.ts`
- `tests/e2e/overlays/overlay-stack.spec.ts` (T-OVL-STACK-03), `tests/perf/browser/overlays-overlay-budget.spec.ts` (toast row)
- `src/components/overlays/_shared/__tests__/subjects.ts`
- NEW `src/components/overlays/_shared/provider-mount.test.tsx`
- `src/index.ts`: add `Toast`, `useToast`, `ToastOptions`, `ToastIntent`, `ToastHistoryEntry`
- PKG budget file `docs/size-budgets.json` (PKG-048, MODIFY; checked by `scripts/ci/verify-size-budgets.mjs`, PKG-049; integer bytes, peers external; changes logged in `docs/size-budgets.changelog.md`; no size-limit, SC-15) (Toast row), and the PKG-042 side-effect gate entry list in `scripts/ci/verify-side-effects.mjs` (MODIFY, overlay entries only)

Must NOT touch: the 4.x `src/components/data-display/{GlassToast,GlassToastProvider,GlassNotificationCenter}.tsx`, `src/theme/AuraGlassProvider.tsx` (PRD-A11Y mounts the provider), `src/material/**`.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 10b merged (`_shared` modules and harnesses green).
- `test -f src/material/SurfaceGroup.tsx`
- PRD-A11Y provider: `rg -n "Toast" src/theme/AuraGlassProvider.tsx` mounts `Toast.Provider` + `Toast.Viewport` inside the portal container, with a `toasts={false}` opt-out (SC-21: A11Y adds the opt-outs; PRD §21 O-1). If not, OVL-130 is blocked. Build and test Toast with explicitly mounted providers, and report that the provider mount is pending.
- PKG-042 side-effect gate exists (`test -f scripts/ci/verify-side-effects.mjs`). If not, OVL-127 is blocked.
- `AG_PARTS` contains `progress`, `history` and `history-item`. If not, those parts are blocked and a request is filed.

## 4. Steps
1. **OVL-113 Provider + store (REQ-OVL-61).** `Toast.Provider` props:
   - `limit = 3`, `timeout = 5000`
   - `position: "top-start"|"top-center"|"top-end"|"bottom-start"|"bottom-center"|"bottom-end"` (default `"bottom-end"`)
   - `history: { limit: number } | false` (default `false`)

   It wraps Base UI's `Toast.Provider` + `useToastManager`. A nested second provider logs a dev `console.error`. `useToast()` without a provider throws `useToast() must be used inside <AuraGlassProvider> (or <Toast.Provider>)`.
2. **OVL-114 Call signature (REQ-OVL-62).**
   - `toast({ title, description?, intent?: "neutral"|"info"|"success"|"warning"|"danger", action?: { label, onClick, altText }, duration?: number|Infinity, priority?: "polite"|"assertive", id? }) → id`.
   - `update(id, opts)`, `dismiss(id?)`, and `promise(p, { loading, success, error })`, which updates one toast in place.
   - `toasts` is the visible list. No `type` key is accepted: TypeScript rejects it, and at runtime it gets a dev error.
3. **OVL-115 Announcements (REQ-OVL-63).**
   - The viewport has `aria-label={labels.region ?? "Notifications"}` and is reachable by F6 (Base UI).
   - `polite` toasts render `role="status"` and `assertive` toasts render `role="alert"`. `assertive` is allowed only with `intent="danger"`; any other intent gets a dev warning and falls back to polite.
   - Never call the provider announcer. Base UI's live semantics are the only path.
4. **OVL-116 Timers (REQ-OVL-64).**
   - One Base UI timeout per toast. It pauses on viewport hover, on focus-within and while `document.visibilityState === "hidden"`, and resumes with the remaining time.
   - When `action` is set and `duration` isn't, the default is `Infinity`.
5. **OVL-117 Progress (REQ-OVL-64).** `Toast.Progress` is a CSS `@keyframes` animation of `scale` on `--_ag-toast-progress`. `animation-duration` is the toast duration and `animation-play-state` follows the paused state attribute. There are 0 React commits while counting down and no `setInterval` (this replaces `data-display/GlassToast.tsx:153-169`).
6. **OVL-118 Stack + swipe (REQ-OVL-65).**
   - Up to `limit` toasts are visible. Older ones collapse with Base UI `--toast-index` → `translate` + `scale(1 - 0.04*index)`, and the stack expands on hover/focus.
   - Swipe-to-dismiss works toward the `position` edge. The threshold is 40% of width or 0.5 px/ms velocity, and only `transform` is animated.
7. **OVL-119 `Toast.css` (REQ-OVL-66).**
   - Each toast uses `overlayMaterial("toast")` (thin) with radius `--ag-radius-lg`.
   - The visible stack is wrapped in one `SurfaceGroup`, so 3 visible toasts share **1** `backdrop-filter`.
   - `intent` tints only the leading icon and a 3px inline-start rim (`--ag-color-<intent>`).
   - Below 640px, toasts are full width minus 16px at the `position` edge.
   - Record the conflict with PRD-PERF (≤3 blurred toasts) in the report: this PRD's single-layer rule applies.
8. **OVL-120 History (REQ-OVL-67).**
   - With `history: { limit: 50 }`, dismissed and expired toasts move into `useToast().history`: `{ entries: ToastHistoryEntry[] /* id,title,description,intent,createdAt,read */, unread, markRead(id), markAllRead(), clear() }`.
   - `Toast.History` renders `role="list"` with `Toast.HistoryItem` (`role="listitem"`). It has no overlay of its own.
   - No storage writes and no `<style>` injection.
   - `createdAt` is stamped in the event path (`toast()` call), never during render.
9. **OVL-121 `Toast.meta.ts`.**
   - Thickness `thin`, `budgetKb: 14`, blurred layers 1 (stack).
   - Live-region notes (no APG pattern).
   - Lineage: `GlassToast`, `GlassToastProvider`, `GlassToastViewport`, `useToast` (4.x), `feedback/GlassToast`, `GlassNotificationCenter`, `GlassNotificationItem`, `GlassNotificationProvider`, `useNotifications`.
   - `migration`: `type`→`intent` (`error`→`danger`), `onClose`→`onOpenChange`/`dismiss(id)`, the position value table, and `addToast`→`toast`.
10. **OVL-122** Root exports (2 values: `Toast`, `useToast`; C-B vs. the 4.x `useToast`).
11. **OVL-123 `Toast.test.tsx`.** Named cases: "single provider" (nested → dev error), "intent", "type rejected", "promise updates in place", "stack shares one backdrop" (exactly one element with `data-ag-group` wrapping the visible toasts; the toasts themselves carry no group blur), "history entries", "markRead", "markAllRead", "clear", "unread count", "no style injection" (`document.head.querySelectorAll('style').length` unchanged).
12. **OVL-124 `toast-timers.test.tsx`.** With fake timers: "pause on hover", "pause on focus", "pause when hidden" (stub `document.visibilityState` + dispatch `visibilitychange`), "resume remaining time ±50 ms", "action toasts infinite", "one timeout per toast" (`jest.getTimerCount()`).
13. **OVL-125 (remote, 3 engines).**
    - `toast.apg.spec.ts`: F6 reaches the region. The accessibility-tree snapshot has exactly one live-region entry per toast. Focus never moves to a new toast.
    - `toast.touch.spec.ts`: "swipe dismiss" at 390×844 with `hasTouch`.
14. **OVL-126** T-OVL-STACK-03: with a modal Dialog open, the toast viewport has no `inert` ancestor and an action button inside it is reachable via F6.
15. **OVL-127 (REQ-OVL-68).** Add `aura-glass` root entries for Toast and every other overlay flagship to the PRD-PKG side-effect gate list. Importing them performs 0 DOM mutations, 0 listener registrations and 0 `<style>` injections.
16. **OVL-128 stories.** EachIntent, WithAction, Promise, StackOf5 (limit 3), NotificationCenterInSheet (`Toast.History` inside `Sheet`), Swipe (mobile viewport). Stable ids.
17. **OVL-129 budgets and harness.**
    - `overlays-overlay-budget.spec.ts`: a 3-toast stack adds 1 blurred layer.
    - Append Toast to `OVERLAY_SUBJECTS`. In `overlay-idle`, the allowed timer count is 1 per toast.
    - Add the `Toast ≤14 KB` line.
18. **OVL-130 `provider-mount.test.tsx`.**
    - With `AuraGlassProvider` mounted, `useToast()` works with no extra wrapper, and a tooltip opens with no `Tooltip.Provider`.
    - `toasts={false}`/`tooltips={false}` remove the respective provider.
    - The viewport lives inside `[data-ag-portal-root]`.

## 5. Tests to run
Local: `./node_modules/.bin/jest src/components/toast src/components/overlays/_shared`, ESLint and `tsc --noEmit`. Remote: the `overlays-*` engine projects, `overlays-perf`, the side-effect gate job, the Storybook build and the size measurement.

## 6. Visual evidence
- Remote captures of every Toast story at 1440×900 and 390×844 over the 8 scenes, light and dark, plus RTL at 390 and forced colors.
- A swipe frame strip.
- An accessibility-tree snapshot artifact.
- Human review on the CI artifacts.

## 7. Integrity rules (binding)
- Never use local Docker or a local browser.
- No `jest.mock` of `@base-ui/react`, Toast or `AuraGlassProvider`.
- No skipped tests and no snapshot updates.
- Never satisfy "one announcement" by removing roles.
- Don't edit PRD-A11Y's provider to unblock yourself.

## 8. Exit criteria
- AC-OVL-19: single store, dev error on two providers, 0 `<style>` injected. The `GlassNotificationCenter` compat half is done in 10h.
- AC-OVL-06: Toast APG in 3 engines.
- AC-OVL-07: STACK-03.
- AC-OVL-02: a 3-toast stack has 0 commits idle.
- AC-OVL-13: Toast line.
- REQ-OVL-68: side-effect gate green.

## 9. Final report format
```
PROMPT-10g REPORT
Branch/SHA:
Tasks: OVL-113..130 -> done|blocked (reason) each
Blurred layers for 3-toast stack: n (PRD-PERF conflict note)
Size: Toast …KB (14)
Prereq blockers (provider mount, side-effect gate, AG_PARTS):
Tests: name -> pass/fail (local|remote URL)
Artifacts: URLs
Deviations (with evidence) or none
Files changed:
```
