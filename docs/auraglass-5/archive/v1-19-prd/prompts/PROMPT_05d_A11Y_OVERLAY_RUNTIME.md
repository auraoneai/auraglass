# PROMPT-05d (A11Y): Portal root, layer stack, `inert`, announcer (+ verification of FND KEEP primitives)

You are implementing part of PRD-05 for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`. Tasks: A11Y-049..A11Y-060 in `docs/auraglass-5/tasks/A11Y.json`.

## 1. Sources (read in full)
- PRD: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md`. Read §2.5 and §2.6 (dialog row), §4.5, §5.6 REQ-A11Y-32..36, REQ-A11Y-50, §8, §12.1/§12.2 (`layer-stack.spec.ts`, `announcer.test.tsx`), §13 (A11y/LayerStack, A11y/Announcer), §16 (layer stack and announcer budgets), §17 AC-A11Y-13 and AC-A11Y-20.
- Architecture: §5.3 (`layer.z.{overlay,transient,toast}` tokens), §9.1, D-13.
- `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` (Base UI wrapper pattern; FND-007 `usePortalContainer()` in `src/foundation/portal.ts`; KEEP primitives FND-031 `Portal`, FND-035 `DismissableLayer`, FND-038 `VisuallyHidden`; FND-048/049 `Icon` and its test).
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-21 (A11Y attributes `data-ag-portal-root`, `data-ag-root`, `data-ag-announcer`, `data-ag-obscured`), SC-25 (this PRD owns the portal-root context and `LayerStack`, the only Escape/`inert`/scroll-lock dispatcher; A11Y-049 is an SC-40 anchor), SC-26 (FND owns the KEEP primitives).
- 4.x to supersede (don't edit, other than the primitives listed below):
  - announcers: `src/utils/focus.ts:286`, `src/utils/a11y.ts:834`, `src/utils/a11yHooks.ts:299`, `src/primitives/focus/ScreenReader.tsx:160,194`, `src/utils/a11yEnhancers.tsx:573`
  - document Escape: `src/components/modal/GlassDialog.tsx:582-594`, `src/components/modal/GlassModal.tsx:340-375`

Requirements: REQ-A11Y-32, 33, 34, 35, 36, 50. Acceptance: AC-A11Y-13, and AC-A11Y-20 (announcer and focus-trap counts are finalised in 05g after PRD-16).

## 2. Files
May touch:
- NEW: `src/theme/layers/{LayerStack.ts,useLayer.ts}`, `src/theme/layers/__tests__/LayerStack.test.ts`
- NEW: `src/theme/announcer/{Announcer.tsx,useAnnouncer.ts}`, `src/theme/__tests__/announcer.test.tsx`
- `src/theme/AuraGlassProvider.tsx`: fill the 05b portal-root slot
- `src/theme/__tests__/AuraGlassProvider.test.tsx`: add cases
- `src/theme/index.ts`: add the `useAnnouncer` export
- `src/a11y/css/scroll-padding.css` (05e creates it; if 05e hasn't landed, add the `[data-ag-scroll-locked]` rule there and 05e extends it)
- NEW: `tests/a11y/browser/layer-stack.spec.ts`
- NEW: `src/a11y/stories/{LayerStack,Announcer}.stories.tsx`
- `src/icons/__tests__/icon-a11y.test.tsx` (FND-049's file): add the `label` case only

Must not touch:
- the 4.x `GlassDialog`/`GlassModal`/`ScreenReader`/`a11y*` utils (PRD-16 removes them; 4.x keeps its behaviour, D-19)
- Base UI wrappers in flagship components (PRD-07..09 wire `container` and `useLayer` into their own files)
- the `Icon` implementation (FND-048)
- `src/primitives/Portal.tsx`, `src/primitives/DismissableLayer.tsx`, `src/primitives/VisuallyHidden.tsx`, `src/primitives/index.ts`, `src/foundation/portal.ts` (FND-031/035/038/039/007, SC-26). Verify them; a gap is a FND blocker.

## 3. Prerequisites
- 05b merged: `rg -n "export function AuraGlassProvider" src/theme` matches.
- FND-007, FND-031, FND-035 and FND-038 merged (or in the same train): `rg -n "export function usePortalContainer" src/foundation`, `test -f src/primitives/VisuallyHidden.tsx`. FND-007 and FND-035 are themselves blocked on this prompt's context/`useLayer`, so land A11Y-049/050/051 first and hand the API to FND.
- PROMPT-03 (DS-029 z-scale) emits `--ag-layer-z-overlay`, `--ag-layer-z-transient` and `--ag-layer-z-toast`. Check: `rg -n "layer-z-(overlay|transient|toast)" src/material/css/generated dist 2>/dev/null`. If they're missing, report a blocker. Don't hard-code z-indexes.
- For `layer-stack.spec.ts`: Dialog, Popover, Tooltip and Toast flagship stories that use `useLayer` (PRD-09). Before those exist, the spec runs against `A11y/LayerStack`, which is built on the KEEP primitives (`Portal`, `DismissableLayer`, `FocusScope`). After PRD-09 lands, it runs against the flagship stories as well.
- For the icon case: FND-048/049 merged (`test -f src/icons/__tests__/icon-a11y.test.tsx`). If not, report A11Y-060 blocked on FND-049.

## 4. Steps
1. **A11Y-049 `LayerStack.ts`**: `createLayerStack(doc)` exports `push({ id, kind: 'overlay'|'transient'|'toast', modal, onEscape, restoreFocusTo? }) → pop`, plus `top()`.
   - It registers one `keydown` listener per document, the only allowed one (lint `auraglass/no-document-escape` exempts `src/theme/layers/**`). On `Escape` it calls `top().onEscape()` only, then `stopPropagation`. This is O(1).
   - It doesn't react to the `Escape` key while an IME composition is active (`event.isComposing`).
2. **A11Y-050 `useLayer.ts`**: `useLayer({ kind, modal, onEscape, open })`.
   - While a modal layer is open: set `inert` on every child of `document.body` except the portal root, and on lower `[data-ag-layer-root] > *` entries. Remove them on close, keeping a reference count for nested modals.
   - Scroll lock is reference-counted, once per document: `overflow: hidden` on `<html>` plus `scrollbar-gutter: stable`. Write it through `data-ag-scroll-locked`, which a rule in `src/a11y/css/scroll-padding.css` styles; there is no inline style. `LayerStack` is the only scroll-lock and `inert` writer in the library (SC-25).
   - On close, restore focus to `restoreFocusTo`, or else to the element that was focused at open.
3. **A11Y-051 provider portal root**: render the PRD §4.5 markup exactly, via `createPortal` to `document.body`.
   - A nested provider detects an ancestor root through context and reuses it, rendering 0 extra roots.
   - `portalContainer` overrides the mount node; the layer stack still governs.
   - Mark the provider root with `data-ag-root`; honour the `toasts`/`tooltips` opt-outs by not rendering those layer roots (SC-21).
   - Expose the portal-root context (per-kind container) from `src/theme/layers/`; FND-007 `usePortalContainer()` is the only public accessor and reads it (SC-25).
4. **A11Y-052 `Portal` (verify FND-031/FND-007)**: assert FND's `Portal` defaults to `usePortalContainer()` → the provider's layer root; with no provider it falls back to `document.body` with one dev warning; an explicit `container` prop still wins. Assertions go in `AuraGlassProvider.test.tsx` "single portal root" and `layer-stack.spec.ts`. Don't edit `Portal.tsx`.
5. **A11Y-053 `DismissableLayer` (verify FND-035)**: FND-035 removes its `document` Escape listener and registers via `useLayer`. Assert in `LayerStack.test.ts` "DismissableLayer registers" that Escape reaches it only through the stack and outside-pointer dismissal still works; `auraglass/no-document-escape` reports 0 under `src/primitives`. Don't edit `DismissableLayer.tsx`.
6. **A11Y-054 announcer**:
   - `Announcer.tsx` renders `<div data-ag-announcer>` with a polite and an assertive `aria-atomic="true"` region inside the portal root.
   - `useAnnouncer()` returns `{ announce(message, { politeness='polite', id }), clear() }`.
   - An identical message within 500 ms is coalesced. A region is cleared 7,000 ms after its last write. A pending message with the same `id` is replaced.
   - Outside a provider it no-ops and logs one dev warning.
   - Streaming helper `createStreamingAnnouncer(announce, { intervalMs: 1000 })`, consumed by PRD-12: at most one polite write per 1,000 ms, plus a final full announcement.
7. **A11Y-055 `announcer.test.tsx`** (Jest fake timers): routing, `"coalesces within 500ms"`, `"clears after 7000ms"`, `"id replacement"`, `"streaming budget"` (a 10 s stream with a token every 50 ms gives ≤11 writes), and `"no-op without provider"` (exactly 1 warning).
8. **A11Y-056 `VisuallyHidden` (verify FND-038)**: FND-038 creates `src/primitives/VisuallyHidden.tsx` and `VisuallyHidden.css` (`.ag-visually-hidden` in `@layer ag.components`), exported by FND-039. Assert in `announcer.test.tsx` that text inside it is in the accessibility tree and that it renders with `renderToString` (server-safe). No `src/a11y/css/visually-hidden.css`.
9. **A11Y-057 unit**:
   - `LayerStack.test.ts`: Escape goes to the top layer only; pop order; the composition guard; `inert` refcount; the scroll-lock refcount.
   - `AuraGlassProvider.test.tsx` `"single portal root"`: two nested providers → `querySelectorAll('[data-ag-portal-root]').length === 1`.
10. **A11Y-058 `layer-stack.spec.ts`** (remote, three engines):
    - `"single portal root"`: Dialog + Popover + Tooltip + Toast open → 1 root.
    - `"stacked escape"`: open Dialog → Popover → Tooltip. Three Escapes close them in order, and after each one `document.activeElement` is that layer's trigger.
    - `"inert background"`: 30 Tab presses never leave the panel. `role="dialog"`/`alertdialog` + `aria-modal="true"` sit on the panel element, and no element with `[data-ag-layer="scrim"]` has `role`.
    - `"inert timing"` (Chromium): toggling with 1,000 background nodes takes ≤2 ms, measured by `performance.now()` around the open commit.
11. **A11Y-059 stories**:
    - `A11y/LayerStack`: Dialog → Popover → Tooltip → Toast, with instructions.
    - `A11y/Announcer`: polite and assertive buttons, plus a streaming demo.
12. **A11Y-060 (extend FND-049)**: in `src/icons/__tests__/icon-a11y.test.tsx`, add the `label` prop case if missing: an unnamed icon → `aria-hidden="true"` with no `role`; `aria-label`/`title`/`label` → `role="img"` with an accessible name, checked by `getByRole('img', { name })`.

## 5. Running
Unit tests run locally (`npm run test:a11y:unit`). `layer-stack.spec.ts` runs remotely only: `certify-pr.yml` L5 Behaviour (`gh workflow run certify-pr.yml --ref <branch>`) or the `auraone-remote-run` skill. No local browser or Docker.

Visual evidence: remote screenshots of `A11y/LayerStack` with all four layers open, in light/dark on the `photo` scene and under forced colors, uploaded as artifacts for human review.

## 6. Prohibited
- mock live regions that bypass the DOM
- `test.skip`/`.only`
- retries to absorb timing flake
- loosening 500/7,000/1,000 ms, ≤11 writes, or ≤2 ms
- leaving any component-level `document` Escape listener under `src/theme`, `src/primitives` or `src/a11y`. `auraglass/no-document-escape` must be clean there.
- `-u` snapshot updates

## 7. Exit criteria
| AC / REQ | Gate |
|---|---|
| AC-A11Y-13 | `layer-stack.spec.ts`: 1 root; 3/3 Escapes in order with focus restored, × 3 engines |
| REQ-A11Y-34 | `"inert background"` green |
| REQ-A11Y-35/36 | `announcer.test.tsx` green |
| REQ-A11Y-50 | FND-049 `src/icons/__tests__/icon-a11y.test.tsx` green with the `label` case (or blocked on FND-049) |
| AC-A11Y-20 (partial) | 1 announcer implementation under `src/theme`; the 4.x count is reported for PRD-16 |

## 8. Final report
1. Task table A11Y-049..060 → status, commit, CI URL.
2. The Escape-order transcript from the spec output.
3. The `inert` timing number.
4. Screenshot artifact links and the reviewer sign-off.
5. The remaining 4.x announcer, trap and Escape sites, with paths, handed to PRD-16.
6. Blockers and deviations.
