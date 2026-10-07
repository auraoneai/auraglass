# PROMPT-10d (OVL): Popover (+ hover mode) and Tooltip, anchored-popup contract

You are implementing part of PRD-OVL (Flagship Overlays) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (5.0 work on `main`). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md`:
  - Scope boundary ("Hover card")
  - §2.2 E-17..E-19, §2.4 (Popover/Tooltip rows)
  - §4.2 (`positioning.ts`), §4.5
  - §5.1 REQ-OVL-14, §5.4 REQ-OVL-40..45, §5.5 REQ-OVL-46..51
  - §10.1/10.2 (Popover, Tooltip rows)
  - §12.1–12.2 (Popover/Tooltip rows), §13 item 2 (Popover, Tooltip)
  - §14 (Popover/Tooltip rows), §15 (Popover/Tooltip rows)
  - §16.2
- Layout and conflicts: `docs/auraglass-5/prompts/PROMPT_10_OVL.md` (binding).
- Evidence: `docs/auraglass-5/autopsy/accessibility.md` ACCESSIBILITY-10 (tooltip hover-only, describedby on wrapper).
- Contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-15, SC-20 (`<Name>.css` starts with the six-name `@layer` statement, rules in `ag.components`), SC-25 (`usePortalContainer()`, `LayerStack` is the only Escape dispatcher), SC-29 (lanes L5/L8/L10), SC-30 (APG specs `tests/a11y/apg/` on the A11Y-073 harness; other behaviour specs `tests/e2e/overlays/`), SC-40 (`depends_on` holds anchor task ids).
- Tasks: `docs/auraglass-5/tasks/OVL.json` OVL-063..OVL-080. Anchor prerequisites: OVL-040 (10c), FND-001/007, A11Y-029/049/073, CTL-055, SB-048, PKG-048/049, DS-026.

## 2. Scope
May create or modify:
- NEW `src/components/popover/`: `Popover.client.tsx` (Root, Trigger, Portal, Positioner, Popup, Arrow, Title, Description, Close), `Popover.css`, `Popover.meta.ts`, `index.ts`, `Popover.test.tsx`, `Popover.stories.tsx`
- NEW `src/components/tooltip/`: `Tooltip.client.tsx` (Provider, Root, Trigger, Portal, Positioner, Popup, Arrow), `Tooltip.css`, `Tooltip.meta.ts`, `index.ts`, `Tooltip.test.tsx`, `Tooltip.stories.tsx`
- NEW `tests/a11y/apg/popover.apg.spec.ts`, `tests/a11y/apg/tooltip.apg.spec.ts`, `tests/e2e/overlays/popover.spec.ts`, `tests/e2e/overlays/tooltip.touch.spec.ts`
- `tests/e2e/overlays/overlay-stack.spec.ts`: add T-OVL-STACK-02
- `tests/perf/browser/overlays-overlay-budget.spec.ts`: add Popover and Tooltip rows
- `src/components/overlays/_shared/__tests__/subjects.ts`: replace `FixturePopover` with `Popover` and add `Tooltip`. Delete `_shared/__tests__/FixturePopover.tsx`.
- `src/components/overlays/_shared/popup-contract.test.tsx`: parametrise over popover and tooltip
- `src/index.ts`: add `Popover`, `Tooltip`, `PopoverSide`, `PopoverAlign`
- PRD-PKG budget file `docs/size-budgets.json` (PKG-048, MODIFY; checked by `scripts/ci/verify-size-budgets.mjs`, PKG-049; integer bytes, peers external; changes logged in `docs/size-budgets.changelog.md`; no size-limit, SC-15): add the Popover and Tooltip rows

Must NOT touch: `src/components/modal/GlassPopover.tsx`, `GlassHoverCard.tsx` and `GlassTooltip.tsx` (deleted in 10i), `src/primitives/Positioner.tsx`, `src/theme/**`, `src/material/**`.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 10c merged: `test -f src/components/dialog/Dialog.client.tsx`, and `./node_modules/.bin/jest src/components/dialog` is green.
- PRD-A11Y provider mounts `Tooltip.Provider` (PRD §10.4): `rg -n "Tooltip" src/theme/AuraGlassProvider.tsx`. If it doesn't, build `Tooltip.Provider` anyway, record "provider mount pending PRD-A11Y", and have tests mount `Tooltip.Provider` explicitly. Don't modify the provider yourself.
- CTL `IconButton` (PRD-CTL; CTL-055 Button pattern) exists for the "On IconButton" story: `rg -n "IconButton" src/components/button`. If it's missing, the story is blocked and reported as such. Don't substitute a fake component.

## 4. Steps
1. **OVL-063 Popover parts (REQ-OVL-40..43).**
   - `Popover.Trigger` takes `openOnHover = false`, `delay = 300`, `closeDelay = 150`.
   - A hover-opened popover also opens on trigger focus and stays open while the pointer is over the popup (1.4.13).
   - `Popover.Positioner` takes `side` (`top|right|bottom|left|inline-start|inline-end`, default `bottom`), `align` (`start|center|end`, default `center`), `sideOffset = 8` and `collisionPadding = 8`, built from `defaultPositionerProps`.
   - Root takes `modal: false | "trap-focus"` (default `false`, never a scroll lock).
   - Focus: a click-open moves focus to the first tabbable, else to the popup with `tabIndex=-1`. Focus is restored on close.
   - ARIA: the trigger has `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. The popup has `role="dialog"`, labelled by Title.
   - Hover mode with non-interactive content wires `aria-describedby` on the trigger.
   - Register with `useOverlayLayer({ kind: "popover", modal: false })`.
2. **OVL-064 `Popover.css` (REQ-OVL-44).**
   - Use `overlayMaterial("popover")` (regular, 20px).
   - `Arrow` is either a clipped child of the popup's backdrop layer or a solid triangle in `--ag-surface-fill` with the rim. It never gets a second `backdrop-filter`.
   - When the available inline space is under 280px, set `max-inline-size: calc(100vw - 16px)`.
3. **OVL-065 `Popover.meta.ts`.** Thickness `regular`, `budgetKb: 14`, blurred layers 1, APG `https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/` (non-modal) plus the disclosure pattern. Lineage: `GlassPopover`, `GlassHoverCard`, `Positioner`, `GlassPositioner`. Include the `migration` rows from §10.2: `placement` string split, `trigger="hover"` → `openOnHover`. Include `selectorChanges`.
4. **OVL-066 Tooltip parts (REQ-OVL-46..48).**
   - `Tooltip.Provider` takes `delay = 600`, `closeDelay = 0` and a skip-delay window of `400`.
   - Opening: pointer hover and keyboard `:focus-visible` only (not mouse-click focus).
   - Closing: blur, pointer leave after `closeDelay`, Escape (focus doesn't move) and trigger press.
   - `aria-describedby` goes on the `render`ed focusable trigger element itself. No wrapper element is added.
   - `hoverable = true`.
5. **OVL-067 (REQ-OVL-49).** In dev, log `console.error` when `Tooltip.Popup` contains `a, button, input, select, textarea, [tabindex]`. The message points to `Popover openOnHover`. Max inline size is 280px and the text wraps.
6. **OVL-068 Touch (REQ-OVL-50).** Under `(pointer: coarse)`, a tap doesn't open the tooltip. A long-press of ≥500 ms opens it, and the next outside tap closes it. Use pointer events on the trigger with no global listeners. Base UI's dismissal handles the outside tap.
7. **OVL-069 `Tooltip.css` (REQ-OVL-51).**
   - Use `overlayMaterial("tooltip")` (thin, 12px). Don't apply `contain: layout paint` to the popup.
   - Enter: `--ag-duration-small` (200 ms), opacity plus a 2px translate from `data-side`.
   - Exit: `--ag-duration-small-exit` (140 ms).
   - Calm mode: opacity only.
8. **OVL-070 `Tooltip.meta.ts`.** Thickness `thin`, `budgetKb: 10`, blurred layers 1, APG `https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/`. Lineage: `GlassTooltip` (both definitions, incl. `GlassPopover.tsx:678`) and `ChartTooltip` (positioning only). Migration: `content` → `Tooltip.Popup` children, `position` → `Positioner side`.
9. **OVL-071** Root exports (adds 2 values).
10. **OVL-072 `Popover.test.tsx`.** Named cases: "openOnHover delays" (fake timers at 300/150), "focus opens hover popover", "aria wiring", "hover-mode describedby", "trap-focus mode no scroll lock".
11. **OVL-073 `Tooltip.test.tsx`.** Named cases: "describedby on trigger" (the element with focus is the one carrying the attribute), "dev error on interactive content", "provider skip-delay" (the second trigger opens within 400 ms with no delay), "no open on mouse-click focus".
12. **OVL-074 (remote, 3 engines).**
    - `popover.apg.spec.ts`: focus in/out, Escape restores, outside press closes.
    - `popover.spec.ts` "collision at 390": anchored at each viewport edge at 390×844, `document.documentElement.scrollWidth === 390`, and the popup rect is inside the viewport.
13. **OVL-075 (remote).**
    - `tooltip.apg.spec.ts`: "focus opens", "Escape closes", "describedby on trigger", "hoverable" (the pointer path from trigger to popup keeps it open).
    - `tooltip.touch.spec.ts` (`hasTouch`, coarse): "tap does not open", "long-press opens", "outside tap closes".
14. **OVL-076** `popup-contract.test.tsx`: Popover and Tooltip rows have `data-ag-part` positioner/popup/arrow, Base UI `data-side`/`data-align`, `data-ag-overlay`, and `transform-origin` set in CSS (verified in the remote motion spec).
15. **OVL-077 stories.**
    - Popover: Click, Hover, WithForm, Collision (each edge), Arrow.
    - Tooltip: Default, OnIconButton, Grouped (provider skip-delay across a Toolbar), LongTextWrap, EachSide.
    - Stories open by default, with stable ids (`overlays-popover--click`, …) and no opaque stage.
16. **OVL-078** T-OVL-STACK-02 in `overlay-stack.spec.ts`: with Dialog → Popover open, an outside press inside the Dialog popup closes only the Popover, and a press on the Dialog's scrim closes the Popover first. Record the actual Base UI behaviour and assert that only layers above the pressed point close.
17. **OVL-079** `overlays-overlay-budget.spec.ts`: an open Popover adds exactly 1 blurred layer, and so does an open Tooltip. Append both to `OVERLAY_SUBJECTS`. The `overlay-idle`, `overlay-dom-contract`, `overlay-ssr`, `overlay-dev-counter`, `overlay-motion` and `overlay-a11y-modes` harnesses must be green for both.
18. **OVL-080 budgets.** Add the `Popover ≤14 KB` and `Tooltip ≤10 KB` lines (C-I additions, PRD REQ-OVL-77). Calibrate at alpha, then only ratchet down.

## 5. Tests to run
- Local: `./node_modules/.bin/jest src/components/popover src/components/tooltip src/components/overlays/_shared`, ESLint and `tsc --noEmit`.
- Remote: `overlays-chromium|webkit|firefox` for the specs in steps 12–13 and 16, `overlays-perf` for the budget spec, the Storybook build and the size measurement.

## 6. Visual evidence
- Remote captures of every Popover/Tooltip story at 1440×900 and 390×844 over the 8 scenes, light and dark, RTL at 390, plus forced-colors captures.
- A frame strip of the tooltip enter in default and calm modes.
- Human review happens on the CI artifacts.

## 7. Integrity rules (binding)
- Never use local Docker or a local browser.
- No `jest.mock` of `@base-ui/react` or the flagships. No skipped tests. No `--update-snapshots`.
- Don't add any `document`/`window` listener. ESLint `no-overlay-global-listeners` must be clean.
- Don't loosen the 390px overflow assertion.

## 8. Exit criteria
- AC-OVL-06: Popover and Tooltip APG pass in 3 engines.
- AC-OVL-07: STACK-02 passes.
- AC-OVL-02: the idle harness is green for Popover and Tooltip.
- AC-OVL-14: Popover and Tooltip stories have 0 horizontal overflow at 390.
- AC-OVL-13: the Popover and Tooltip lines pass.
- REQ-OVL-14: popup-contract is green.
- REQ-OVL-45: `rg -n "primitives/(Positioner|positioning)" src/components/{popover,tooltip}` returns 0.

## 9. Final report format
```
PROMPT-10d REPORT
Branch/SHA:
Tasks: OVL-063..080 -> done|blocked (reason) each
Sizes: Popover …KB (14), Tooltip …KB (10)
Blurred layers: Popover n, Tooltip n
STACK-02 observed Base UI outside-press semantics:
Prereq blockers (provider mount, IconButton):
Tests: name -> pass/fail (local|remote URL)
Artifacts: URLs
Deviations (with evidence) or none
Files changed:
```
