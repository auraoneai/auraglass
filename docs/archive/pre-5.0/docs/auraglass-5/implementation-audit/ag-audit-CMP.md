# AuraGlass 5.0 CMP (Core Components, PRD-3) audit

Refs audited: origin/next `84a3b94f1`, origin/release/4.x `645735fce`. All 11 `next-cmp/*` branches, `contract/cmp-require-data-ag-part` and `4x-cmp/consumer-4x-cases` are fully merged (0 commits ahead). PRs #26-#65 MERGED. Static inspection only: jest was not executed because the main checkout's node_modules has no `@base-ui/react`, and a full `npm ci` is a heavy install that policy keeps off this Mac. GitLab project 87152036 returns `[]` for pipelines, so no lane (L1-L14) has ever produced evidence. Per PRD §17, that means no AC can count as met.

## Verdict

The code is real Base UI wrapping, not seeds: 0 `@ag-contract-seed` markers in CMP paths, 60 component dirs, 74 metas, 60 story files, 31 APG specs, 59 compat adapters. It is still partial against the PRD:

- 42 `React.forwardRef` calls remain in five overlay files. The CMP lint rule bans them at `error`, so lint has never passed.
- Literal colours, durations and `!important` sit in overlay CSS. The literals baseline claims 0 but leaves those files out.
- The UseToast contract is not met, and Toast.History is missing.
- The SegmentedControl indicator is an inert placeholder.
- `./forms` does not exist.
- Root exports 64 names; the contract requires exactly 60.
- The 4.x deprecation fragment on `release/4.x` is empty, and nothing shipped in 4.x.
- The lanes fragment is empty. The playwright fragment matches no files.
- There are no T0/T2/primitive compat adapters, deprecations or codemods.
- There is no React Compiler test and no Next 16 canary page.
- `tests/contract/components.test.tsx` is still the seed version: it expects `data-ag-seed` on flat components, so it would fail on the real components.

REQ tally: **71 done / 63 partial / 8 missing of 142**.

## REQ table (D = done, P = partial, M = missing)

| REQ | Status | Evidence (origin/next unless stated) |
|---|---|---|
| REQ-CMP-01 | P | Pin exact 1.8.0 in package.json deps; tests/foundation/base-ui-pin.test.ts exists. .d.ts hygiene on packed tarball unverified (no CI). package.json also lists @tanstack/react-virtual as dep used by Combobox. |
| REQ-CMP-02 | D | src/foundation/index.ts exports only defineMeta/toChangeDetails/renderElement (+types); toChangeDetails normalises reason via foundation/types.ts. |
| REQ-CMP-03 | P | 42 React.forwardRef calls remain in Menu.client.tsx(15), ContextMenu.client.tsx(9), Toast.client.tsx(7), Popover.client.tsx(7), Tooltip.client.tsx(4) despite lint/rules/cmp/_strict.cjs putting no-forward-ref at error on overlays - lint has never run green. |
| REQ-CMP-04 | P | Controls use ValueProps/CheckedProps; control-shared/value.ts warns on controlled<->uncontrolled. useToast does not satisfy UseToast (see 107). No foundation/controllable.ts. |
| REQ-CMP-05 | P | Card.tsx exports `material?: MaterialRole` (banned). ~50 prop types extend React.HTMLAttributes/ComponentProps, only 5 Omit 'onChange' -> onChange leaks. lint/rules/cmp/prop-grammar.cjs does not exist. |
| REQ-CMP-06 | P | SegmentedControl exports only {Root, Item} (Indicator missing); Menubar is a flat forwardRef, not {Root, Menu}; Dialog/Popover/Tooltip/Menu export extra Portal/Positioner/Popup parts; Menu.Content is an alias of Popup. parts-contract.test covers only 49 'registered' metas (no overlays, Select, Combobox). |
| REQ-CMP-07 | P | toDataState/data-state used only in overlays, Progress, Collapsible, Rating, InlineEdit, FileUpload; Switch/Checkbox/RadioGroup/ToggleGroup/Accordion/Slider emit none. |
| REQ-CMP-08 | P | CMP CSS contains literal colours (30 lines in 9 files: Toast.css, Popover.css, Tooltip.css, Sheet.css, ColorPicker.css...), fallback durations (150ms/200ms/1.6s/1.4s/800ms), 9 !important (Sheet.css x6, Popover, Tooltip), and backdrop-filter in overlays/_shared/overlays.css. fragments/literals-baseline/cmp.json reports 0 but omits these overlay files entirely. |
| REQ-CMP-09 | P | None of 54 CMP .css files starts with LAYER_ORDER_STATEMENT; overlays/_shared/overlays.css not declared in fragments/css/cmp.ts. |
| REQ-CMP-10 | P | scripts/cmp/verify-selector-coverage.mjs + test exist; no cmp:test:selectors GitLab job; never run. |
| REQ-CMP-11 | D | Every BU Portal gets usePortalContainer(root) (overlay/transient/toast); no-provider fallback warns once (foundation/portal.ts). |
| REQ-CMP-12 | P | Overlays register via useOverlayLayer -> useLayer, but lockScroll is never passed (BU does scroll lock itself); primitives/DismissableLayer.tsx adds document pointerdown/focusin listeners and writes document.body.style.pointerEvents; FocusScope.tsx adds document keydown. |
| REQ-CMP-13 | P | data-disabled via BU; disabled-no-opacity.spec.ts exists, never run. |
| REQ-CMP-14 | D | No Math.random/Date.now in render paths (Date.now only in Toast add handler and Combobox announce throttle). |
| REQ-CMP-15 | D | Hooks unconditional by inspection; tests/controls/controls-hooks.test.tsx exists (not executed in this audit). |
| REQ-CMP-16 | P | S-13 subscribeFrame is used nowhere in CMP; SheetHandle uses raw requestAnimationFrame; side-effects tests exist. |
| REQ-CMP-17 | P | .client.tsx split followed; tests/ssr/cmp/{t0,t2}-server-safe + portal-hydration exist; canaries/next16/app/cmp/server/page.tsx missing. |
| REQ-CMP-18 | P | Infinite animations in Button spinner, Skeleton (ungated), Combobox, SearchField, Progress ring, StateView; motion specs exist, unrun. |
| REQ-CMP-19 | P | Focus CSS present; controls-focus.spec.ts unrun. |
| REQ-CMP-20 | P | hit-area spans present on Button/Switch etc.; sizing spec unrun. |
| REQ-CMP-21 | P | Sizes emitted; reflow/sizing specs unrun. |
| REQ-CMP-22 | P | 74 meta.ts files with owner/tier/budgetKb/migration; T0/T2/primitive metas carry migration rows but no matching codemod/compat rows; Dialog meta sizes sm..full deviate from PRD. |
| REQ-CMP-23 | P | root/cmp.ts value exports = 64 (60 required + extra SheetHandle, useSheetDetents, resolveDetent, ProgressRing). ./forms entry missing (src/forms absent; etc/api/forms.exports.json empty). package.json exports lack '.', './primitives', './forms', './icons/*'. etc/api/root.cmp.api.md missing; compat.cmp.api.md empty. |
| REQ-CMP-24 | M | No tests/compiler/react-compiler.fixture.test.ts; no canaries/vite/src/cmp/compiler.page.tsx. |
| REQ-CMP-25 | D | primitives/Slot.tsx reads child.props.ref, composes cleanup refs; Slot.react19.test.tsx. |
| REQ-CMP-26 | D | primitives/Portal.tsx null on server; tests/ssr/cmp/portal-hydration.test.tsx. |
| REQ-CMP-27 | P | Escape through useLayer, but document pointerdown/focusin listeners and body.style write remain. |
| REQ-CMP-28 | P | FocusScope registers a document keydown listener; Label exists. |
| REQ-CMP-29 | D | VisuallyHidden clip pattern + focusable; exported root and ./primitives. |
| REQ-CMP-30 | P | Per-glyph modules + createIcon a11y OK; no './icons/<name>' export pattern; AI glyphs live in src/icons/ai not src/ai/icons. |
| REQ-CMP-31 | M | aura-glass/forms (FormField, useFormField, react-hook-form binding) not implemented; only field/Form.client.tsx exists. |
| REQ-CMP-32 | P | Button over BU Button/Toggle, loading/startIcon/endIcon/type ok; no remount dev warning when pressed props toggle. |
| REQ-CMP-33 | D | Parts root/icon/label/spinner/hit-area, aria-busy, click guard, visibility:hidden label. |
| REQ-CMP-34 | P | layer chrome, intent attr ok; thickness 'thin' and interactive not set; prominent guard is document-wide only. |
| REQ-CMP-35 | P | BU keys; MagneticButton compat present but motion-peer behaviour not verified. |
| REQ-CMP-36 | D | IconButton label/icon/shape, empty-label dev error. |
| REQ-CMP-37 | D | Toolbar on BU Toolbar inside SurfaceGroup. |
| REQ-CMP-38 | D | ToggleGroup on BU ToggleGroup with multiple. |
| REQ-CMP-39 | D | ButtonGroup role=group, required aria-label/labelledby union, attached. |
| REQ-CMP-40 | P | No priority="low" overflow-to-Menu; concentric radius unverified. |
| REQ-CMP-41 | P | Built on BU RadioGroup+Radio, but SegmentedControl.Indicator not exported. |
| REQ-CMP-42 | M | Indicator is a static span with opacity:0, never positioned or animated; no startMorph, no transitionend handling. Placeholder. |
| REQ-CMP-43 | P | BU radio keys; required SegmentedControl.keys.ts missing. |
| REQ-CMP-44 | D | >5 segments warning, title prop, item min-size CSS. |
| REQ-CMP-45 | D | BU Switch Root+Thumb, hit-area. |
| REQ-CMP-46 | P | Thumb gets no materialProps/transient layer; no data-state. |
| REQ-CMP-47 | D | Switch.keys.ts records enter/space. |
| REQ-CMP-48 | D | BU Slider with range/marks/format/getAriaValueText. |
| REQ-CMP-49 | D | Track/thumb CSS (not visually verified). |
| REQ-CMP-50 | D | BU Slider keyboard. |
| REQ-CMP-51 | P | No per-frame coalescing via subscribeFrame (Slider.css comment says pending MAT). |
| REQ-CMP-52 | P | Checkbox lacks `parent` prop; CheckboxGroup present. |
| REQ-CMP-53 | D | BU checkbox keys, indeterminate. |
| REQ-CMP-54 | D | No backdrop-filter in checkbox/radio. |
| REQ-CMP-55 | D | RadioGroup Root/Item on BU. |
| REQ-CMP-56 | D | BU radio keyboard. |
| REQ-CMP-57 | D | Field on BU Field. |
| REQ-CMP-58 | D | field-shell.test.tsx. |
| REQ-CMP-59 | D | Fieldset with legend. |
| REQ-CMP-60 | D | TextField multiline/autoResize/showCount etc. |
| REQ-CMP-61 | D | Parts present. |
| REQ-CMP-62 | D | text-field-ime.test.tsx. |
| REQ-CMP-63 | P | SearchField has no chrome thin capsule material (no materialProps). |
| REQ-CMP-64 | D | Escape clears with stopPropagation only when acting; onClear. |
| REQ-CMP-65 | P | Select parts ok; extra Label part; `items`/alignItemWithTrigger coarse switch not evident. |
| REQ-CMP-66 | D | BU select keyboard; Select.test.tsx. |
| REQ-CMP-67 | D | overlay regular popup. |
| REQ-CMP-68 | D | select-form.test.tsx. |
| REQ-CMP-69 | D | Combobox parts incl. Chips/Clear/Empty/Loading. |
| REQ-CMP-70 | D | BU combobox keyboard. |
| REQ-CMP-71 | D | aria-busy + announcer throttle. |
| REQ-CMP-72 | P | Virtualisation uses @tanstack/react-virtual (PRD says owned code unless CC-CMP-06 accepted). |
| REQ-CMP-73 | D | mode, loadOptions with AbortController, loadDebounceMs 250. |
| REQ-CMP-74 | D | creatable/onCreate. |
| REQ-CMP-75 | D | NumberField on BU incl. ScrubArea. |
| REQ-CMP-76 | D | parse.ts Intl.NumberFormat; number-field-format.test.tsx. |
| REQ-CMP-77 | D | NumberField.keys.ts; BU steppers. |
| REQ-CMP-78 | D | overlays/_shared/overlaySurface.ts overlayMaterial(kind). |
| REQ-CMP-79 | P | overlays.css sets backdrop-filter blur on the scrim itself (PRD: optics only from MAT). |
| REQ-CMP-80 | P | overlay-stack.spec.ts written; Escape owned by BU, LayerStack onEscape no-op; unrun. |
| REQ-CMP-81 | P | overlay-budget spec unrun (remote-only skip). |
| REQ-CMP-82 | D | No infinite animations in overlay files; overlay-idle.test.tsx. |
| REQ-CMP-83 | D | useOverlayAnimating.ts. |
| REQ-CMP-84 | P | overlay-a11y-modes.spec.ts unrun; CSS rungs partial. |
| REQ-CMP-85 | D | positioning.ts defaults; popup-contract.test.tsx. |
| REQ-CMP-86 | P | Dialog size sm\|md\|lg\|xl\|full instead of sm\|md\|lg + appearance default\|wide\|fullscreen. |
| REQ-CMP-87 | D | role on popup; missing-title dev error. |
| REQ-CMP-88 | P | Modal registers useLayer but not lockScroll; BU does locking. |
| REQ-CMP-89 | P | Nested/form story exist; 640px container behaviour unverified. |
| REQ-CMP-90 | P | dialog-perf spec remote-only; CommandPalette case test.skip PENDING. |
| REQ-CMP-91 | D | AlertDialog Cancel/Action. |
| REQ-CMP-92 | D | Sheet logical side, modal. |
| REQ-CMP-93 | D | preset action. |
| REQ-CMP-94 | P | Detent snapping real (useSheetDetents.ts) but uses raw rAF, not subscribeFrame/MotionCapability. |
| REQ-CMP-95 | D | Handle button 'Resize sheet', announcements, full-height flag. |
| REQ-CMP-96 | P | sheet-perf spec remote-only, unrun. |
| REQ-CMP-97 | D | Popover on BU with openOnHover/delay/closeDelay. |
| REQ-CMP-98 | D | BU aria wiring. |
| REQ-CMP-99 | D | Tooltip on BU, Provider present. |
| REQ-CMP-100 | D | Interactive-content dev error. |
| REQ-CMP-101 | P | tooltip.touch.spec unrun. |
| REQ-CMP-102 | P | Menu on BU; Content is a Popup alias. |
| REQ-CMP-103 | D | BU menu keyboard. |
| REQ-CMP-104 | D | Roles via BU. |
| REQ-CMP-105 | P | ContextMenu ok; Menubar not a {Root, Menu} compound. |
| REQ-CMP-106 | P | Provider/Viewport real; second-provider and no-provider dev errors not evident. |
| REQ-CMP-107 | M | useToast returns {add, close, info, success, warning, error, ...}, not UseToast {toast, dismiss}; intent 'error' not 'danger'; priority derived from intent (warning->alert) instead of ToastOptions.priority. |
| REQ-CMP-108 | P | BU timeouts; action-toast Infinity default not evident; toast-timers test absent (tests/overlays has none). |
| REQ-CMP-109 | P | Stack CSS; toast.touch.spec unrun. |
| REQ-CMP-110 | M | History is a module-global array (not provider-scoped), no unread/markRead/clear, never null; no Toast.History part (planned ToastHistory.client.tsx absent). |
| REQ-CMP-111 | D | Text/Heading server components. |
| REQ-CMP-112 | P | Grid masonry is CSS columns only, no @supports grid masonry. |
| REQ-CMP-113 | P | Card exposes banned `material` prop. |
| REQ-CMP-114 | D | Badge intent/dot/count/max. |
| REQ-CMP-115 | D | Avatar on BU; AvatarGroup server. |
| REQ-CMP-116 | D | Alert role status/alert by urgent. |
| REQ-CMP-117 | P | Ring shipped as separate ProgressRing export (PRD: Progress appearance="ring"; ProgressRing must not be an export). |
| REQ-CMP-118 | P | Skeleton shimmer runs under prefers-reduced-motion:no-preference with literal 1.6s, not gated on allowContinuous/[data-ag-continuous]. |
| REQ-CMP-119 | D | Separator/Kbd/Link (rel + VisuallyHidden)/DescriptionList. |
| REQ-CMP-120 | D | Collapsible on BU. |
| REQ-CMP-121 | D | Accordion h3 default + headingLevel. |
| REQ-CMP-122 | D | ScrollArea tabIndex only when overflowing, ResizeObserver cleanup. |
| REQ-CMP-123 | P | Rating is owned radiogroup, not over BU Radio. |
| REQ-CMP-124 | D | InlineEdit. |
| REQ-CMP-125 | D | ColorPicker composes Popover, area. |
| REQ-CMP-126 | P | No simulated progress (fixed), but API deviates: maxCount not maxFiles, onUpload(file, signal) without onProgress, statuses idle/uploading not 'selected'. |
| REQ-CMP-127 | D | ImageList. |
| REQ-CMP-128 | D | Tour composes Popover with targets. |
| REQ-CMP-129 | D | state-view shared file. |
| REQ-CMP-130 | M | No canaries/next16/app/cmp/**; no t2-page.spec.ts. |
| REQ-CMP-131 | P | 59 adapters in src/compat/cmp/{controls,overlays}; no core/ or primitives/ adapters (GlassCard, GlassBadge, Typography, GlassStack, GlassAccordion, GlassSlot ... absent). |
| REQ-CMP-132 | M | fragments/deprecations/cmp.ts on origin/release/4.x is `export default []`; 87 entries exist only on next; nothing shipped in a 4.x minor (release/4.x is 4.1.1, npm latest 4.1.0); compat names use removeIn 5.0.0 not 6.0.0. |
| REQ-CMP-133 | P | fragments/codemods/cmp.ts covers controls/overlays only; no T0/T2/primitive rows; ToggleButton mapped to ToggleGroup (PRD: Button pressed). |
| REQ-CMP-134 | P | 78 fixture dirs (canonical-names 64, prop-grammar 8...) incl. GlassStepper ambiguous; none for core names. |
| REQ-CMP-135 | D | release/4.x tests/fixtures/consumer-4x/cases/cmp/{settings-form,nav-actions,detail-panel}.tsx cover the required 13 names; migrate-4to5 compile not verifiable. |
| REQ-CMP-136 | D | 87 size rows. |
| REQ-CMP-137 | D | perf rows provisional. |
| REQ-CMP-138 | M | fragments/lanes/cmp.ts is `[]`; fragments/playwright/cmp.json has non-'cmp:'-prefixed projects whose testMatch tests/overlays/**/*.spec.ts matches no file. |
| REQ-CMP-139 | P | css/side-effects/a11y-baseline ok; fragments/review/cmp.ts is `[]`; literals baseline incomplete. |
| REQ-CMP-140 | P | registry items account-menu/confirm-dialog lack fixtures.ts and stories; overlay-flows has fixtures. |
| REQ-CMP-141 | P | ci/cmp.gitlab-ci.yml has cmp:test:foundation-pattern and cmp:build:dts, no cmp:test:selectors, no allow_failure; never executed (GitLab project 87152036: 0 pipelines). |
| REQ-CMP-142 | P | 10 .changeset/cmp-*.md exist; API reports incomplete (root.cmp missing, compat.cmp empty, forms empty). |

## Acceptance criteria

| AC | Result | Basis |
|---|---|---|
| AC-CMP-01 | NOT MET | root/cmp.ts has 64 value exports (extra SheetHandle, useSheetDetents, resolveDetent, ProgressRing); `./forms` source absent; package.json `exports` lacks `.`, `./primitives`, `./forms` |
| AC-CMP-02 | not verifiable (markers part OK) | 0 `@ag-contract-seed` in CMP paths; `dist/` data-ag-seed needs a build |
| AC-CMP-03 | NOT MET | tests/contract/components.test.tsx still asserts `data-ag-seed` on flat components; SegmentedControl.Indicator and Menubar.Root/Menu missing; no meta.test.ts / doubles.test.tsx under tests/contract |
| AC-CMP-04 | not verifiable | needs packed tarball |
| AC-CMP-05 | NOT MET | 42 forwardRef; literals and !important in overlay CSS; document listeners and body.style write in primitives/DismissableLayer.tsx and FocusScope.tsx |
| AC-CMP-06 | not verifiable | controls-hooks.test.tsx exists, never run in CI |
| AC-CMP-07 | not verifiable | 31 APG files, but the set differs: steps/chip included, toggle-group/field missing; never run |
| AC-CMP-08..15 | not verifiable | remote browser/perf lanes never ran; perf specs `test.skip` unless AG_REMOTE_RUNNER |
| AC-CMP-16 | NOT MET | no core/primitives adapters |
| AC-CMP-17 | NOT MET | release/4.x fragments/deprecations/cmp.ts = `[]`; 4.x line is 4.1.1, npm latest 4.1.0 |
| AC-CMP-18 | not verifiable / partial | fixtures for controls/overlays only; PLAT engine run absent |
| AC-CMP-19 | NOT MET | flagship deliverables incomplete (L7 baselines, grades, L13) |
| AC-CMP-20..22 | not verifiable | perf lane never ran |
| AC-CMP-23 | NOT MET | tests/a11y/manual/records/cmp has only README.md |
| AC-CMP-24 | NOT MET | fragments/review/cmp.ts = `[]`; no signatures |
| AC-CMP-25 | not verifiable | no lane |
| AC-CMP-26 | not verifiable / partial | account-menu and confirm-dialog lack fixtures.ts and stories |
| AC-CMP-27 | NOT MET | no cmp:test:selectors job; no allow_failure flip; 0 GitLab pipelines |

AC met: 0 of 27. Statically decidable now: AC-01, 02, 03, 05, 16, 17, 23, 24, 27. All of those fail except AC-02's marker half.

## Task sample (40 of 428, proportional across the 9 lanes)

Every task in docs/auraglass-5/tasks/CMP.json (main and next) still has status `todo`; the ledger was never updated.

| Task | Lane | Result | Note |
|---|---|---|---|
| CMP-006 | 3a-F | done | tests/foundation/base-ui-pin.test.ts |
| CMP-017 | 3a-F | partial | parts-contract.test.tsx limited to 49 "registered" metas; overlays/Select/Combobox excluded |
| CMP-028 | 3a-F | done | tests/ssr/cmp/portal-hydration.test.tsx |
| CMP-040 | 3a-F | done | src/components/steps/Steps.tsx (scope note: Steps is not a CMP export per PRD) |
| CMP-051 | 3a-F | partial | added ProgressRing to root (contradicts PRD); Chip/KeyValueEditor not in cmp root |
| CMP-062 | 3a-F | not done | size-budget verification sweep never ran |
| CMP-071 | 3b-A | done | relocated to stories/cmp/components/Button.stories.tsx |
| CMP-081 | 3b-A | done | stories/cmp/components/Toolbar.stories.tsx |
| CMP-091 | 3b-A | done | legacy button sources gone on next |
| CMP-100 | 3c-I | done | field/Field.client.tsx |
| CMP-112 | 3c-I | done | tests/controls/controls-side-effects.test.tsx |
| CMP-125 | 3c-I | done | Checkbox stories |
| CMP-137 | 3c-I | done | TextField.css token-only |
| CMP-149 | 3c-I | done | slider/Slider.client.tsx |
| CMP-162 | 3c-I | done | root exports |
| CMP-174 | 3c-I | not done | RC certification sweep |
| CMP-178 | 3d-P | done | select/Select.test.tsx |
| CMP-186 | 3d-P | done | Combobox mode + aria-autocomplete |
| CMP-195 | 3e-O1 | done | useOverlayAnimating.ts |
| CMP-207 | 3e-O1 | partial | playwright projects exist; testMatch `tests/overlays/**/*.spec.ts` matches nothing |
| CMP-219 | 3e-O1 | done | Dialog/AlertDialog root |
| CMP-231 | 3e-O1 | done | Sheet preset action |
| CMP-243 | 3e-O1 | partial | exported, but return shape violates UseToast |
| CMP-255 | 3e-O1 | not done | perf calibration needs remote lane |
| CMP-266 | 3f-O2 | done | Tooltip interactive-content dev error |
| CMP-274 | 3f-O2 | done | BU menu keyboard |
| CMP-282 | 3f-O2 | partial | Menu stories lack Shortcuts/DisabledItems/LongList/CheckboxRadio |
| CMP-290 | 3f-O2 | not done | ToastHistory.client.tsx absent |
| CMP-299 | 3g-T | done | Container |
| CMP-307 | 3g-T | partial | shimmer not gated on allowContinuous; literal 1.6s |
| CMP-315 | 3g-T | done | ScrollArea |
| CMP-421 | 3g-T | done | Badge |
| CMP-326 | 3h-M | done | segmented-control compat adapters |
| CMP-335 | 3h-M | partial | entries on next only; release/4.x copy empty |
| CMP-343 | 3h-M | done | overlays-* codemod fixtures |
| CMP-353 | 3i-Q | done | scroll-area APG spec |
| CMP-366 | 3i-Q | done | toolbar APG spec |
| CMP-379 | 3i-Q | partial | conditional `test.skip` when part absent |
| CMP-391 | 3i-Q | done | dialog APG spec |
| CMP-404 | 3i-Q | done | overlay-stack spec (unrun) |

Sample: 28 done, 8 partial, 4 not done. "Done" means the artifact exists with real content, not that it has passed.

## Stubs, fakes, skips, self-certification

- `src/components/segmented-control/SegmentedControl.client.tsx`: the indicator is `<span data-ag-part="indicator">` with `opacity:0`. It is never positioned or animated (placeholder for REQ-CMP-42).
- `tests/foundation/contract-coverage.json` records harnesses as `"status":"green"` / `"green-trivial"` (portal-root asserts nothing until popups are registered). These are committed self-reports with no CI artifact. It still says Button and Dialog "do not exist".
- Browser specs use runtime skips: `test.skip(!process.env.AG_REMOTE_RUNNER)` in all 6 perf specs; `test.skip(cp.length===0, '... PENDING')` in overlays-dialog-perf.spec.ts; conditional skips in controls-motion, toast.touch, overlay-stack (`test.skip(true, ...)`) and overlay-motion. PRD §18 bans `.skip` and `pending`.
- `fragments/literals-baseline/cmp.json` is all zeros but omits the overlay CSS files that contain literals.
- Empty fragments: `fragments/lanes/cmp.ts`, `fragments/review/cmp.ts`, release/4.x `fragments/deprecations/cmp.ts`. `etc/api/compat.cmp.api.md` and `etc/api/forms.exports.json` have no entries.
- `tests/contract/components.test.tsx` is still the seed version; it would fail against real components.
- `ci/cmp.gitlab-ci.yml` deliberately exits 1 if `scripts/docs/gen-component-docs.mjs` is missing. That file is now present, but the job has never run.
