# PROMPT-10c (OVL): Dialog + AlertDialog, palette shell, modal performance proof

You are implementing part of PRD-OVL (Flagship Overlays) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (5.0 work on `main`). This prompt is self-contained. Dialog is also the foundation pattern-proof flagship (`AURAGLASS_COMPONENT_REMEDIATION_PRD.md` AC-FND-05), so it is built jointly with that PRD's owner. That PRD owns the pattern; this prompt owns every REQ-OVL below.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` §2.1–2.2 (E-01..E-16), §4.3–4.6, §5.1 (REQ-OVL-03/-04/-05/-07/-08), §5.2 (REQ-OVL-16..29), §5.7 (REQ-OVL-60), §10.1–10.3 (Dialog rows), §12.1–12.3 (Dialog rows), §13 items 1, 2 (Dialog/AlertDialog), 4, 8, §14 (Dialog/AlertDialog rows + keyboard rule), §15 (Dialog/AlertDialog rows + global floors), §16.1, §17 AC-OVL-01..05, -20.
- Layout and conflicts: `docs/auraglass-5/prompts/PROMPT_10_OVL.md` (binding).
- Perf harness: `docs/auraglass-5/prd/AURAGLASS_PERFORMANCE_PRD.md` §(profiles), REQ-PERF-18, `tests/perf/harness/**`. The hover+scroll script is in `docs/auraglass-5/autopsy/runtime-remote.md` §5.
- Contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-15 (budgets), SC-20, SC-21, SC-25, SC-29, SC-30 (APG specs in `tests/a11y/apg/`, owned here; A11Y-077 is only a harness self-test), SC-40 (OVL-040 is the overlays anchor task).
- Tasks: `docs/auraglass-5/tasks/OVL.json` OVL-040..OVL-062. OVL-040 is the only CREATE of `Dialog.client.tsx`; OVL-041..044 and OVL-047 are MODIFY. Anchor prerequisites: FND-001/005/007, CTL-055, A11Y-073, PERF-039, QA-085, PKG-048/049, MAT-015, NAV-087 (OVL-061).

## 2. Scope
May create or modify:
- NEW `src/components/dialog/`:
  - `Dialog.client.tsx` (Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close)
  - `DialogLayout.tsx` (Header, Body, Footer; no directive)
  - `Dialog.css`, `Dialog.meta.ts`, `index.ts`
  - `Dialog.test.tsx`, `Dialog.stories.tsx`, `DialogPerf.stories.tsx`
- NEW `src/components/alert-dialog/`: `AlertDialog.client.tsx`, `AlertDialogLayout.tsx`, `AlertDialog.css`, `AlertDialog.meta.ts`, `index.ts`, `AlertDialog.test.tsx`, `AlertDialog.stories.tsx`
- NEW `tests/a11y/apg/dialog.apg.spec.ts` and `tests/a11y/apg/alert-dialog.apg.spec.ts` (on the A11Y-073 harness `tests/a11y/apg/harness.ts`), NEW `tests/e2e/overlays/overlay-stack.spec.ts` (T-OVL-STACK-04 only here)
- NEW `tests/perf/browser/overlays-dialog-perf.spec.ts`, `tests/perf/browser/overlays-overlay-budget.spec.ts`
- `src/components/overlays/_shared/__tests__/subjects.ts` (append Dialog, AlertDialog), `src/material/css/material.css` (the `[data-ag-obscured]` rule in `@layer ag.material`, OVL-058 only, with MAT review; layer owner MAT, SC-20)
- `src/index.ts`: add the `Dialog`, `AlertDialog` value exports and `DialogRootProps`, `OverlayOpenChangeDetails` types, via the PKG exports manifest `build/exports.manifest.json` (PKG-005)
- The PKG per-import budget file `docs/size-budgets.json` (PKG-048, MODIFY; checked by `scripts/ci/verify-size-budgets.mjs`, PKG-049; log changes in `docs/size-budgets.changelog.md`): add the `Dialog`/`AlertDialog` rows only. There is no size-limit (SC-15)

Must NOT touch: `src/components/modal/**` (4.x), `src/material/**` (except the OVL-058 rule above), `src/theme/**`, `src/foundation/**`, `src/components/interactive/GlassCommandPalette.tsx` (PRD-NAV owns it).

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 10b merged: `test -f src/components/overlays/_shared/useOverlayLayer.ts && ./node_modules/.bin/jest src/components/overlays/_shared` is green.
- PERF-039: `test -f tests/perf/harness/run-perf.mjs && test -f tests/perf/harness/budgets.json`. If it's absent, OVL-057 is blocked. Don't write a parallel harness. Runtime budgets are rows in PERF's `budgets.json`.
- A11Y-073: `test -f tests/a11y/apg/harness.ts`. If it's absent, OVL-053/054 are blocked. If A11Y-077 already created `tests/a11y/apg/dialog.apg.spec.ts`, ask A11Y to convert it into a harness self-test fixture (PRD §21 O-7) and take ownership of the file. Don't keep two dialog specs.
- PRD-A11Y `data-ag-obscured` (SC-21, A11Y sets it): `rg -n "data-ag-obscured" src/theme`. If it's absent, OVL-058 is blocked (PRD §21 O-1).
- CTL-055 `Button` (pattern proof together with OVL-040): `rg -n "export .*Button" src/components/button/index.ts`. Footers use it. If it's missing, stories use native `<button>` with the class from the foundation reference and the report says so.

## 4. Steps
1. **OVL-040 Root (REQ-OVL-17).** Props: `open`, `defaultOpen`, `onOpenChange(open, details: OverlayOpenChangeDetails)` with `reason ∈ "trigger-press"|"outside-press"|"escape-key"|"close-press"|"imperative"`, `modal = true`, `dismissible = true`, `labels?: { close?: string }`. Register via `useOverlayLayer({ kind: "dialog" })`. No `onClose`.
2. **OVL-041** Trigger, Close (`aria-label` from `labels.close`, default "Close"; ≥24px target, 44px under `(pointer:coarse)`), Portal via `OverlayPortal`.
3. **OVL-042 Backdrop (REQ-OVL-04).** It is the single `[data-ag-part="backdrop"].ag-scrim` and sets `data-ag-overlay-depth`. With `modal={false}`, there's no Backdrop render. It is never animated except for opacity.
4. **OVL-043 Popup (REQ-OVL-18/-19/-21/-22/-25/-60).**
   - `role="dialog"` and `aria-modal="true"` go on the popup only. `aria-labelledby`/`aria-describedby` come from Base UI.
   - Focus: `initialFocus` (ref | fn) defaults to the first tabbable in Body, else the popup. `finalFocus` restores focus.
   - `size: "sm"|"md"|"lg"|"xl"|"full"` sets max inline size to 400/560/720/960px/`100dvw`, with a `--ag-space-4` inset and block size ≤ `calc(100dvh - 2*var(--ag-space-4))`.
   - `placement: "center"|"top"`, where `top` puts the block-start at `min(20dvh,160px)`.
   - The `render` prop accepts `<form/>`.
   - Material: `overlayMaterial("dialog")` (`thick`), radius `--ag-radius-xl`. `variant: "regular"|"identity"` and `prominent` are the only material knobs. There are no `material`/`backdropBlur`/`blur` props.
5. **OVL-044 Title/Description.** A dev-only `console.error` fires when it is open without a Title and without `aria-label`.
6. **OVL-045 `DialogLayout.tsx`.** Header, Body and Footer are plain `div`s with `data-ag-part` header/body/footer and no `data-ag-surface`. Body has `padding?: "default"|"none"`, scrolls internally and sets `scroll-padding-block` from the measured Header/Footer sizes (2.4.11).
7. **OVL-046 `Dialog.css`.**
   - Container queries at 640px: below it, `sm`/`md` go full width minus a 16px inset, and `lg`/`xl` are bottom-anchored with radius at the top only.
   - `dvh` caps everywhere. Block size uses `var(--ag-visual-viewport-height)` when the provider sets it.
   - Focus rings use the §6 two-tone tokens. There is no `outline: none` without a replacement.
8. **OVL-047 Nested (REQ-OVL-23).** The parent popup gets `data-ag-nested-open` while a child is open. In CSS: `scale: 0.98` and dimming via `--_ag-surface-alpha`, never host `opacity`.
9. **OVL-048 AlertDialog (REQ-OVL-16/-26/-27).** It has the same part list over Base UI AlertDialog, with `role="alertdialog"`. Outside press never closes it. Escape closes it with `reason: "escape-key"`. Initial focus defaults to `AlertDialog.Close` (least destructive). `intent="danger"` only changes the action Button's `intent`. Below 640px the buttons stack, with the primary action last.
10. **OVL-049 `.meta.ts`.** Both files list `parts`, `data-ag-part` values, states, variants, thickness `thick`, budgets (`budgetKb: 20`; blurred layers 2), the APG URL (`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`, `.../alertdialog/`), the 4.x lineage (`GlassModal`, `GlassDialog`), the `migration` prop table (PRD §10.2 rows) and `selectorChanges` (§10.3 rows). The fields follow the PRD-DX meta schema.
11. **OVL-050** Root exports (C-E). The value count added here is 2.
12. **OVL-051 `Dialog.test.tsx`.** Named cases:
    - "role on popup"
    - "dev error without name"
    - "sizes" (computed max-inline-size per size)
    - "material attributes" (`data-ag-layer=overlay`, thickness `thick`)
    - "form render" (submit doesn't close)
    - "reason values"
    - "non-modal has no backdrop"
    - "palette shell" (`placement="top"`, `Body padding="none"`, `initialFocus` reaches an input)

    **OVL-052 `AlertDialog.test.tsx`:** "initial focus on cancel", "outside press ignored", "escape reason".
13. **OVL-053/054 APG specs (remote, 3 engines).**
    - `dialog.apg.spec.ts`:
      - "focus moves in", "Tab cycles", "Shift+Tab cycles", "Escape closes and restores focus"
      - "inert background": the background has the `inert` attribute, and 30 Tab presses stay inside.
      - "no layout shift on lock": `document.documentElement.clientWidth` doesn't change.
      - "visual viewport resize": the focused field stays visible.
    - `alert-dialog.apg.spec.ts` mirrors REQ-OVL-26/-27.
14. **OVL-055 stories.** Dialog stories: Default, LongContent, Sizes (args), Form, Nested, NonModal, PaletteShell. AlertDialog stories: DestructiveConfirm, NeutralConfirm.
    - Every story has `defaultOpen`, plus one closed story with a `play` that opens it.
    - Story ids are stable (`overlays-dialog--default`, …).
    - Use the Material Lab `environment` global, with no opaque stage, no Storybook-only props and no `!important`.
15. **OVL-056 perf story.** `Overlays/Perf/Dialog over dashboard` (`DialogPerf.stories.tsx`) is a `defaultOpen` Dialog over TopBar, Sidebar and 4 `content-raised` Cards (6 surfaces).
16. **OVL-057 `overlays-dialog-perf.spec.ts` (remote L10 Performance lane).** It uses `tests/perf/harness/**` profiles (desktop GPU 1440×900 at 120 Hz, mobile 390×844 with 4× CPU, software raster) and the `runtime-remote.md` §5 hover+scroll script. Named cases:
    - "scrim count and radius": overlay `backdrop-filter` elements ≤2, scrim ≤12px, popup ≤32px.
    - "no infinite animations": 0.
    - "nested surfaces flat": every descendant `.ag-surface::before` has `backdrop-filter: none`.
    - "obscured page": ΔE2000 p95 with vs. without, over 8 scenes.
    - "open latency": ≤100 ms click to first painted frame at 4× throttle, and no long task >50 ms in window A (click → popup enter `transitionend`; REQ-OVL-29).
    - "fps": software raster ≥0.85× the same-run `Surface` baseline story and ≥45; GPU ≥110 p50 with frame time p95 ≤10 ms; mobile ≥55 p50.
    - "long tasks": ≤2, ≤150 ms total, none >80 ms in window B. Window B is the 5 s starting at the end of window A, so it doesn't overlap window A (REQ-OVL-29, §16.1).
    - Subject list: `overlays-dialog--*`, `overlays-alert-dialog--*`, plus PRD-NAV `CommandPalette` story ids once they exist (AC-OVL-20). An empty list fails the case; it doesn't skip it.
17. **OVL-058 obscured decision (REQ-OVL-08).** The rule goes in MAT's `src/material/css/material.css` in `ag.material`, with MAT review (PRD §21 O-8). Ship `[data-ag-obscured] .ag-surface::before { backdrop-filter: none; -webkit-backdrop-filter: none }` only if "obscured page" ΔE2000 p95 is ≤2.0. Otherwise leave the rule out. In both cases, record the measured value in the PR.
18. **OVL-059** `overlay-stack.spec.ts` T-OVL-STACK-04: in a nested dialog, the parent has `data-ag-nested-open`, only the top scrim blurs, and Escape closes the child only.
19. **OVL-060 budgets.** Add the `Dialog ≤20 KB` and `AlertDialog ≤20 KB` min+gz rows (integer bytes, peers external) to PKG's `docs/size-budgets.json` by MODIFY (PKG-048; SC-15). OVL-153 calibrates them later. `overlays-overlay-budget.spec.ts` asserts blurred layers Dialog = 2 and AlertDialog = 2. Calibrate in the remote L10 Performance lane at alpha, then ratchet down only.
20. **OVL-061** Palette shell evidence: the PaletteShell story is in the `overlays-dialog-perf.spec.ts` subjects, and the hand-off note to PRD-NAV lists the public parts used.
21. **OVL-062** Append Dialog and AlertDialog to `OVERLAY_SUBJECTS` so every 10b harness covers them. They must all be green.

## 5. Tests to run
- Local: `./node_modules/.bin/jest src/components/dialog src/components/alert-dialog src/components/overlays/_shared`, ESLint on the new directories, and `tsc --noEmit`.
- Remote: the `overlays-chromium|webkit|firefox` projects for the APG and stack specs, `overlays-perf` for perf, the Storybook static build, and the size measurement.

## 6. Visual evidence
- Remote capture of every Dialog/AlertDialog story at 1440×900 and 390×844 over the 8 Material Lab scenes, light and dark, plus RTL at 390.
- A perf report artifact with the before/after table (4.x `glass-modal` values from E-01/E-02 vs 5.0).
- A frame strip of the enter transition.
- Human review is done on the CI artifacts. The agent can't view the screenshots.

## 7. Integrity rules (binding)
- Never use local Docker or a local browser.
- No `jest.mock` of `@base-ui/react`, Dialog or `AuraGlassProvider`.
- No `test.skip`/`.only`/`fixme`/`it.todo`.
- Don't raise any budget in §16.1. Don't use a software-raster fps number in place of a GPU one.
- No `--update-snapshots`. Baselines are created only through PRD-QA's approval flow.
- Don't ship the obscured rule without the measured ΔE.

## 8. Exit criteria
- AC-OVL-01 (OVL-057 "scrim count and radius" at both viewports)
- AC-OVL-02 (Dialog: "no infinite animations" + `overlay-idle`)
- AC-OVL-03 (fps)
- AC-OVL-04 (long tasks, open latency, REQ-OVL-08 decision with ΔE value)
- AC-OVL-05 (Dialog perf grade ≥C, target ≥B)
- AC-OVL-06 (Dialog, AlertDialog: 3 engines)
- AC-OVL-07 (STACK-04 part)
- AC-OVL-20 (palette shell subject; the CommandPalette part is pending PRD-NAV and reported)
- AC-OVL-13 (Dialog/AlertDialog lines)

## 9. Final report format
```
PROMPT-10c REPORT
Branch/SHA:
Tasks: OVL-040..062 -> done|blocked (reason) each
Perf table (desktop/mobile/software): bf-elements, scrim px, popup px, infinite anims, fps p50, frame p95, long tasks (n/total/max), open latency, grade
REQ-OVL-08 decision: shipped|not shipped, ΔE2000 p95 = …
Size: Dialog …KB, AlertDialog …KB (budget 20)
Prereq blockers:
Tests: name -> pass/fail (local|remote URL)
Artifacts: URLs (captures, perf report, frame strip)
Deviations (with evidence) or none
Files changed:
```
