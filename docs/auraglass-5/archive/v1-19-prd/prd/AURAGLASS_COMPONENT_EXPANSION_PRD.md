# AuraGlass 5.0 PRD: Component Expansion (umbrella for genuinely new capability)

| Field | Value |
|---|---|
| Key | **EXP** (SC-01 in `prd/_shared-contracts.md`; cite this file as `PRD-EXP`) |
| PRD id | **PRD-15** (program self-id, an alias only; it collides with architecture §16 PRD-15). Numbering note: `AURAGLASS_5_TARGET_ARCHITECTURE.md` §16 uses PRD-15 for the *enhanced tier* and has no expansion-umbrella row. The enhanced tier is held by MAT as interim owner (SC-37); this document does not touch it. See "Numbering crosswalk" below |
| Owner area | Component expansion governance: the ledger of every capability that does not exist in 4.1.0 (or exists only as a fake), its priority, its single owning PRD, its release, and its delivery form (export, part, prop, registry item, labs, rejected). Also owns the post-GA roadmap: 5.1 `./charts`, commerce blocks, enterprise blocks as registry items, and spatial/immersive work (labs only). **Interim owner of architecture §16 PRD-21** (`@auraglass/labs` package at `packages/labs/` and its admission gate, tests in `tests/labs/`) until a labs PRD is filed (SC-37); MAT keeps the cinematic engine contract |
| Shared contracts | `prd/_shared-contracts.md` (SC-01..SC-40) governs paths, names and owners. This PRD applies SC-01, SC-12, SC-15, SC-16, SC-24, SC-29, SC-30, SC-31, SC-32, SC-33, SC-37, SC-38, SC-39 and SC-40; where it consumes an owner's artifact it cites the owner PRD and anchor task instead of re-specifying it |
| Status | Draft |
| Baseline | `aura-glass` 4.1.0, HEAD `15b6de6f7`, 2026-10-06 |
| Target releases | 5.0.0 (ledger gate live; P0/P1 rows delivered by owning PRDs), 5.1 (`./charts`, commerce blocks, `DateTimePicker`, `OtpField`, `Table` inline edit), 5.2 (enterprise blocks wave 2, labs promotions) |
| Architecture anchors | §3.1, §3.2, §3.6, §11 (taxonomy, flagship tier, per-flagship DoD), §12, §13.4, §13.5, §14.1, §15, §16 |
| Source docs | `docs/auraglass-5/AURAGLASS_MISSING_CAPABILITY_MAP.md` (primary input); `AURAGLASS_5_TARGET_ARCHITECTURE.md`; `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`; `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `autopsy/runtime-remote.md`; `autopsy/api-consistency.md`; `autopsy/accessibility.md`; `autopsy/appshell-workspace-recipes-cli.md`; `autopsy/server-services-ai.md`; `component-inventory.json` (500 records); `research/competitors.md`; sibling PRDs in `docs/auraglass-5/prd/` |
| Related decisions | D-13 (Base UI foundation, RA optional peer), D-14 (no `Glass` prefix), **D-15** (root ≤160 value exports, about 250 total, 44 flagships), **D-16** (labs), **D-17** (registry items, no legacy package), D-21 (charts), D-22 (CLI and registry separate), D-25 (no JS motion runtime in core), D-27 (change-class enforcement), D-29 (dependency allowlist), D-30 (presentational AI, no provider calls) |

**Numbering crosswalk (SC-01).** Sibling PRDs were filed under program ids that differ from §16. This PRD cites owners by **architecture §16 id** (as the generated appendix `prd/appendix/component-dispositions.md` and the ledger `owner` field do) and gives the SC-01 key and file below. Task dependencies never use these ids; they use the owner's anchor task (SC-40, §19). "Owning PRD 09–14" in the program brief therefore resolves to the §16 rows PRD-08 to PRD-14 below.

| §16 id | Boundary | Key | File |
|---|---|---|---|
| PRD-00 | 4.1.1 trust patch | TRUST | `prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` |
| PRD-01 (+ interim PRD-17) | Release governance, migration, 4.2/4.3 bridge | REL | `prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` |
| PRD-02 | Packaging, build, exports manifest, size budgets | PKG | `prd/AURAGLASS_PACKAGING_BUILD_PRD.md` |
| PRD-03 | Design tokens | DS | `prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` |
| PRD-04 (+ interim PRD-15 enhanced tier) | Material engine | MAT | `prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` |
| PRD-05 | A11y and preferences | A11Y | `prd/AURAGLASS_ACCESSIBILITY_PRD.md` |
| PRD-06 | Motion | MOT | `prd/AURAGLASS_MOTION_PRD.md` |
| PRD-07 / PRD-14 / PRD-16 | Foundation integration, T2 core, removal | FND | `prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` |
| PRD-08 | Flagship controls 1–14 | CTL | `prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` |
| PRD-09 | Flagship overlays 15–21 | OVL | `prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` |
| PRD-10 | App shell and navigation 22–31 | NAV | `prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` |
| PRD-11 | Data and date 32–37, 14 | DATA | `prd/AURAGLASS_DATA_PRD.md` |
| PRD-12 | AI primitives 38–42 | AI | `prd/AURAGLASS_AI_PRD.md` |
| PRD-13 | Media and backdrops 43–44 | MED | `prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md` (requirement prefix `REQ-MED-NN`) |
| PRD-18 / PRD-20 | CLI, codemods, compat, registry; docs | DX | `prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` |
| PRD-19 | Certification infra; Storybook/Lab half | QA; SB | `prd/AURAGLASS_QA_CERTIFICATION_PRD.md`; `prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` |
| PRD-21 | Labs (`@auraglass/labs`, admission gate) | **EXP (interim, SC-37)** | this file, §5.7 |
| n/a | Numeric perf policy | PERF | `prd/AURAGLASS_PERFORMANCE_PRD.md` |

**Explicit deviations from the architecture and the capability map, with evidence.**

1. **Id collision.** This file's self-id is PRD-15; §16 PRD-15 (enhanced tier) keeps its boundary and is held by MAT as interim owner (SC-37: lens maps use static scale, `tests/material/kill-switches.spec.ts` is MAT-079). Nothing here edits lens maps, engine detection or kill switches.
2. **No direct `@floating-ui` dependency.** The capability map's 5.0 targets say "on `@floating-ui`" for Combobox, HoverCard and Popover. D-13 and D-29 make Base UI the foundation and the allowlist has no `@floating-ui/*` entry (`AURAGLASS_5_TARGET_ARCHITECTURE.md` §3.4). Positioning comes from Base UI's own positioner. The architecture wins.
3. **No `elevation` token group.** The map's spatial row targets "`DepthLayer`/`Parallax` primitive plus `elevation` tokens in core". D-07 explicitly rejects an elevation axis ("Shadow derives from layer × thickness, and z-order from the layer stack"), and §13.4 puts `ParallaxLayers` in labs. The architecture wins; depth is delivered by the existing layer model (§4.6), and `Parallax` is a labs resident.
4. **Several map targets are delivered as parts, props or registry items, not exports** (for example `TagInput` = `Combobox multiple creatable`; `Lightbox` = `ImageViewer`; `NotificationCenter` = `Toast.History`; `ModelPicker` = registry item). Reason: D-15's export ceiling, and the sibling PRDs already took these decisions (`AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md:19`, `:135`; `AURAGLASS_AI_PRD.md:215`; `AURAGLASS_DATA_PRD.md:184`). This PRD records them so no capability is lost between documents.
5. **Commerce and pricing justification is weaker than the map implies.** `research/competitors.md` has no commerce, checkout or pricing evidence (rg `commerce|pricing|checkout` over it returns only a "pricing amounts not captured" line, :220). Commerce therefore ships only as post-GA registry blocks, never as exports, and at P2/P3.
6. **No §16 boundary of its own, so ownership is encoded explicitly.** §16 has no expansion row. In the ledger, this PRD's own rows use `owner: "PRD-EXP"` (not a §16 number, so it cannot collide with §16 PRD-15). Every row has exactly **one** `owner`; where §4.2 shows two PRDs ("A + B" or "A / B"), the first is `owner` and the second goes to `collaborators[]`. For registry rows (X-30, X-46–X-50, X-55) the split with DX (§16 PRD-18) is: this PRD writes the component contract, the block/item content and its tests (§5.4); DX owns the schema, `registry/registry.json` (DX-067), build (`scripts/registry/build.mjs`), lint (`scripts/registry/lint.mjs`, DX-070), the render harness (`tests/dx/registry-render.spec.ts`, DX-094) and publishing. The source layout is fixed by SC-32: sources in `registry/{base,blocks,items}/<id>/`, built output `apps/docs/public/r/<id>.json` (git-ignored), published as `@auraglass/registry`. The earlier `registry-src/` proposal is withdrawn. Content of the 3 `kanban`/`gantt`/`transfer-list` items (X-30) is DX's (DX-082..084); this PRD keeps only the ledger row.
7. **Owner PRDs win on API detail.** Where an owner PRD already specifies a row's API (for example `REQ-MED-*` for media, `REQ-CTL-128/129` for Combobox, `REQ-DATA-10/13/14/15` for Table), this PRD cites the owner REQ and does not restate a competing signature. The contracts in REQ-EXP-22–30 apply only to rows with no owner REQ.

---

## 1. Problem

The 4.1.0 package is broad but hollow. The capability map (`AURAGLASS_MISSING_CAPABILITY_MAP.md`) lists 27 checklist rows and 11 area sections. In most of them the capability is either **absent** (rg = 0: `TimePicker`, `ToolCall`, `Citation`, `Artifact`, `columnResize`, `AgentTrace`, `@floating-ui`, `DirectionProvider`) or **present but fake**: a "virtual" table that is not virtual (`src/components/data-display/GlassVirtualTable.tsx:19-26`), a voice input that records `new Blob(["mock audio data"])` (`src/components/interactive/GlassChatInput.tsx:303`), a waveform made of `Math.random` jitter (`src/components/social/GlassVoiceWaveform.tsx:120-147`), a split pane that measures the viewport instead of its container (`src/components/layout/GlassSplitPane.tsx:116`), week numbers that are a comment (`src/components/input/GlassDatePicker.tsx:594`).

At the same time 4.x shipped large amounts of **novelty** that no product team asked for and that is now being deleted: quantum, consciousness, biometric, eye-tracking, GAN/DeepDream/StyleTransfer, AR/hologram/vortex, CMS canvases with a `new Function(onClickScript)()` sink (`src/components/cms/GlassCanvas.tsx:315`). §13.3 deletes all 145 REMOVE records, which cover these families.

Three problems follow, and the flagship PRDs do not solve them on their own:

1. **No single ledger.** New capability is spread across eight sibling PRDs, each of which scopes conservatively against D-15. Rows of the capability map fall between documents. For example `DateTimePicker` (map: P1, "Time picker" row) appears in no sibling PRD (rg `DateTimePicker` over `prd/` other than this file = 0), nor do `FileDropzone`, `ColorArea`, `OTP`/`PinInput`, `PresenceStack`, `CommentThread`, `PricingTable`, `CartSummary`, `CheckoutSteps` or a direction/locale layer (rg over `prd/*.md`, 2026-10-06). `MediaScrubber` and the lightbox were in this list before `AURAGLASS_MEDIA_BACKDROPS_PRD.md` was filed; they are now owned there (REQ-MED-23, REQ-MED-40–43).
2. **No admission rule.** Without an explicit "reusable product surface" test, the 5.x minors will repeat the 4.x pattern: breadth over depth, demos promoted to exports, and claims without artifacts (QA-CERTIFICATION-01; the "498 certified" retraction in §14.1).
3. **No post-GA plan.** D-21 defers the chart engine to 5.1 and D-17 sends Kanban, Gantt and TransferList to the registry, but no document sequences 5.1/5.2 work (charts, commerce blocks, enterprise blocks, labs promotions) or states which spatial work is justified at all.

This PRD fixes all three: a machine-checked capability ledger with one owner per row, an admission rubric with an explicit rejected-novelty list, and a dated post-GA roadmap. It implements no flagship itself; it owns only the ledger, the rubric, the export-budget accounting for additions, and the post-GA registry items that no other PRD owns (commerce and enterprise blocks).

---

## 2. Evidence from the current codebase

All paths were checked with `rg --files src` at HEAD `15b6de6f7` on 2026-10-06. Line numbers marked "(re-read)" were re-opened for this PRD; others are taken from the capability map, whose rg checks were re-run on the same date. Finding IDs use the numbering of the detail autopsy files. No REFUTED verdict is relied on; PARTIAL verdicts are used in their corrected form.

### 2.1 Absent capabilities (rg = 0 in `src/`, stories and tests excluded)

| ID | Capability | Evidence | Map priority |
|---|---|---|---|
| E-01 | Time picker popover / date-time | rg `TimePicker` = 0; only `src/components/input/GlassTimeField.tsx` (KEEP) | P1 |
| E-02 | Column resize / pin / reorder | rg `columnResize`/`ColumnResize` = 0 | P0 |
| E-03 | Tool invocation, citations, artifacts | rg `ToolCall`/`ToolInvocation` = 0, `Citation` = 0, `Artifact` = 0 component hits | P1/P1/P2 |
| E-04 | Agent trace | rg `AgentTrace`/`TraceView` = 0 | P2 |
| E-05 | Model picker | rg `ModelPicker`/`ModelSelect` hits only `src/components/ai/GlassGANGenerator.tsx` (REMOVE) | P1 |
| E-06 | Autocomplete mode | rg `Autocomplete` (case-sensitive) = 0; `aria-autocomplete="list"` only, `src/components/input/GlassCombobox.tsx:108` (re-read) | P0 |
| E-07 | OTP / pin input | rg `OTP`/`PinInput` = 0 | not ranked in map; P2 here |
| E-08 | Direction / locale layer | rg `@floating-ui|DirectionProvider|useLocale` over `src` = 0 files (re-read). `Intl` is used ad hoc. No autopsy audited i18n/RTL, so depth is unverified | P1 |
| E-09 | Banner, DescriptionList | no inventory record for either (map, Enterprise) | P1 |
| E-10 | Commerce presentational parts | `ProductCard`, `LineItem`, `CartSummary`, `CheckoutSteps`, `PricingTable`, `PlanComparison` absent | P2/P3 |

### 2.2 Present but fake or unsound (the "exists" column is not quality)

| ID | Surface | Evidence (path:line) | Finding / verdict |
|---|---|---|---|
| E-11 | Virtual table | `src/components/data-display/GlassVirtualTable.tsx:19-26` returns `<GlassDataTable>` with a "future iteration" comment | API-CONSISTENCY-09 (VirtualTable half CONFIRMED both passes) |
| E-12 | Date picker week numbers | `src/components/input/GlassDatePicker.tsx:594` `{/* Week number calculation would go here */}` (re-read) | inventory record; ACCESSIBILITY-09 (autopsy numbering) |
| E-13 | Voice input | `src/components/interactive/GlassChatInput.tsx:303` `new Blob(["mock audio data"], ...)` (re-read); `src/components/interactive/GlassVoiceInput.tsx` (REMOVE) | map "Multimodal input: Fake" |
| E-14 | Waveform | `src/components/social/GlassVoiceWaveform.tsx:120-147` sin + random jitter (re-read :120-122); `src/components/media/GlassAdvancedAudioPlayer.tsx:774` "Generate mock waveform data" (re-read) | map "Waveform: Fake" |
| E-15 | Split pane | `src/components/layout/GlassSplitPane.tsx:116` `newPct = (e.clientX / window.innerWidth) * 100` (re-read); `src/app-shell/GlassResizablePanel.tsx` resizes nothing | APPSHELL-WORKSPACE-RECIPES-CLI-12 (PARTIAL: keyboard steps exist), -13 (CONFIRMED) |
| E-16 | Query builder | `src/components/interactive/GlassQueryBuilder.tsx:152`, `:210` `parent.rules.splice` in render (re-read) | map "Query builder: unsound" |
| E-17 | Command palette "fuzzy" | `src/components/interactive/GlassCommandPalette.tsx:300-307` `new RegExp(normalizedSearch.split("").join(".*"), "i")`: unescaped, unranked (re-read) | map "Command palette" |
| E-18 | Segmented control semantics | `src/components/navigation/GlassSegmentedControl.tsx:91` `role="group"`, `:112` `aria-pressed` (re-read) | map P0 |
| E-19 | Notification center motion | `src/components/data-display/GlassNotificationCenter.tsx:259` `getMotionPreset` defined, never called (re-read) | API-CONSISTENCY-12 (CONFIRMED) |
| E-20 | File upload | `src/components/interactive/GlassFileUpload.tsx:341` `setInterval` simulates progress (re-read); `src/components/input/GlassFileUpload.tsx` marks files "completed" without `onUpload` | map Inputs |
| E-21 | Inspector | `src/components/navigation/LiquidGlassInspectorPanel.tsx`; `src/workspace/index.tsx` (`GlassInspectorPanel`); `src/components/cms/GlassPropertyPanel.tsx` feeds `new Function(onClickScript)()` at `src/components/cms/GlassCanvas.tsx:315` (re-read) | map "Inspector": `resizable`/`placement` not implemented |
| E-22 | Scrubber | `src/components/media/LiquidGlassMediaControls.tsx:110-117` native `type="range"` `aria-label="Seek"` (re-read); no buffered range, chapters or hover time | map P2 |
| E-23 | Lightbox | only inside `src/components/interactive/GlassGallery.tsx:65` (`enableLightbox`), `:122` (re-read) | map Media |
| E-24 | Checkout | `src/components/ecommerce/GlassSmartShoppingCart.tsx:56` 300 ms fake "API delay", `:345` 1,000 ms (re-read); `src/registry/recipes.ts:810` a "Secure checkout" button only (re-read) | REMOVE (inventory) |
| E-25 | Pricing | `src/components/card/patterns.tsx:385-405` `PricingCardProps`/`PricingCard` (re-read): one card, no tiers, period toggle or comparison | map P3 |
| E-26 | Eval dashboard | `src/registry/recipes.ts:937-940` static cards with inline `style={{...}}` (re-read) and hard-coded numbers | `AURAGLASS_AI_PRD.md` E-16 |
| E-27 | Context menu | `src/components/navigation/GlassContextMenu.tsx:295` its own `role="menu"` logic (re-read), duplicating `GlassDropdownMenu` | inventory REPLACE |
| E-28 | Kanban / Gantt / TransferList / MindMap / SignaturePad | honest but heavy and off-material: `src/components/data-display/GlassKanbanBoard.tsx` (947 lines, ships demo data), `src/components/data-display/GlassGanttChart.tsx` (893), `src/components/input/GlassTransferList.tsx` (467), `src/components/interactive/GlassMindMap.tsx` (656), `src/components/interactive/GlassSignaturePad.tsx` (487) (`rg -c ""`, re-read) | §13.4, §13.5, D-17 |

### 2.3 Runtime evidence that constrains every addition

| ID | Evidence | Source |
|---|---|---|
| E-29 | Computed glass tint changed with backdrop in **0 of 84** story×viewport pairs; with the Storybook stage removed **266/342** sampled text runs fail AA on black (median 1.92:1) | `autopsy/runtime-remote.md` §1; map row 1 (MATERIAL-ENGINE-01, -08 CONFIRMED) |
| E-30 | Overlays are the slowest cluster: `glass-modal` 12 fps, `glass-dialog` 13–14 fps under scripted hover and scroll, 12 visible backdrop-filters, 49 long tasks / 4,056 ms on load | `autopsy/runtime-remote.md` §5 |
| E-31 | App-shell stories run 19–23 fps with 21–29 visible backdrop-filters, nesting depth 4 | `autopsy/runtime-remote.md` §5; PERFORMANCE-09 (CONFIRMED) |
| E-32 | `prefers-contrast: more` is a no-op on 12/12 stories (all 16 queries use `high`) | ACCESSIBILITY-06 (CONFIRMED); `autopsy/runtime-remote.md` §3 |

Consequence for expansion: **any new surface inherits E-29 to E-32 unless it is built on the 5.0 `Surface` contract (PRD-04/PRD-05) and the content-material default (D-08).** No addition in this PRD may ship before its owner's material and a11y lanes are live.

### 2.4 Competitor evidence (justification inputs)

| ID | Evidence | Source |
|---|---|---|
| E-33 | AI surfaces are table stakes: shadcn chat (June 2026), Questionnaire and HITL helpers, AI Elements, prompt-kit, `@mui/x-chat` alpha | `research/competitors.md:22-26` |
| E-34 | No mainstream library ships a refractive Liquid Glass material | `research/competitors.md:27` |
| E-35 | shadcn ships Toast, charts, data table, MCP server | `research/competitors.md:89` |
| E-36 | The dashboard/charts niche is under-served by an active, design-forward library (`@tremor/react` 670k downloads/week, repos quiet) | `research/competitors.md:140` |
| E-37 | Recommendation: compete on AI and data surfaces; move chart libraries to optional sub-entries or registry items | `research/competitors.md:206-207` |
| E-38 | No commerce, checkout, pricing, WebXR or spatial evidence in the competitor research | rg over `research/competitors.md` (only :220 "pricing amounts not captured") |

---

## 3. Desired end state

At 5.0.0 GA:

1. **One ledger, no orphans.** `docs/auraglass-5/capability-ledger.json` (NEW) has one row per new capability in §4.2. Every row has exactly one owning PRD, a priority, a delivery form (`export`, `part`, `prop`, `registry-item`, `registry-block`, `labs`, `rejected`), a target release, and a justification that cites competitor evidence or an explicit exception. CI fails if a row has no owner, if two PRDs claim one row, or if a P0/P1 row targeted at 5.0 is not delivered (export present in the manifest, part present in the typed metadata, or registry JSON present).
2. **Every P0 capability ships in 5.0** inside its owner's flagship or T2 component: material legibility, Combobox (async/creatable/autocomplete), DatePicker grid, Command, SegmentedControl, Table virtualization and sizing, ResizablePanels + AppShell, Thread/Message/Composer (attachments, paste/drop, stop; voice capture is the `ai-voice-input` registry item per `AURAGLASS_AI_PRD.md:215`, not core). All are certified in the owner's lanes (§15.2).
3. **Every P1 capability ships in 5.0 or has a dated 5.1 slot.** None is silently dropped.
4. **The export budget holds.** Additions are delivered as parts or props first. Root value exports ≤160 and total value exports ≤250 (D-15), counted from the generated exports manifest (PRD-02).
5. **New capability is real.** Zero simulated behaviour in any new surface: no `Math.random` in render, no `setTimeout`/`setInterval` faking network or progress, no mock blobs, no demo data defaults (static lane, §15.2).
6. **Post-GA is planned.** 5.1 ships `aura-glass/charts` (D-21), the commerce registry blocks, `DateTimePicker` and `OtpField`. 5.2 ships the enterprise blocks wave 2 and the first labs promotion if one passes certification. Spatial/immersive work stays in `@auraglass/labs` unless it meets §4.5.
7. **Novelty is rejected in writing.** §4.4 lists every rejected family with its reason, and the ledger stores them as `rejected` rows so that a later PR re-adding one fails review by citation.

Out of scope: implementing any flagship or T2 component (owned by PRD-07 to PRD-14), the registry pipeline, CLI and codemod engine (DX, §16 PRD-18), deletions (FND, §16 PRD-16). In scope as interim owner (SC-37): the `@auraglass/labs` package shell and its admission gate (§5.7); the residents' engines stay with MAT.

---

## 4. Architecture

### 4.1 Admission rubric (the "reusable product surface" test)

A capability enters the ledger as anything other than `rejected` only if it passes **all** of R1–R6. The rubric is stored in the ledger as booleans per row and is checked by `scripts/ci/verify-capability-ledger.mjs` (NEW).

| Rule | Test | Evidence required in the row |
|---|---|---|
| R1 Product need | Appears in at least one of the six product surfaces (§15.4) or in a named registry block | `surface` field: block or surface id |
| R2 Market bar | Shipped by at least one of shadcn, Base UI, React Aria, MUI X, AI Elements, Mantine (competitors.md), **or** marked `exception` with a written reason | `evidence` field: `research/competitors.md:<line>` or `exception:<reason>` |
| R3 Composition first | Cannot be expressed as a part or prop of an existing flagship/T2 component; if it can, the delivery form is `part`/`prop` | `form` field; reviewer checks |
| R4 Real behaviour | No simulation, no provider calls (D-30), no network in the library | static-lane result |
| R5 Material and a11y | Uses `Surface`/content materials and passes the owner's a11y floors (§6, §7) | owner's lane id |
| R6 Budget | Has a per-import gzip line (§3.6 style) and does not raise the root export count above 160 | `budgetKb`, `exportDelta` fields |

Delivery-form ladder (cheapest first): `prop` → `part` → `registry-item`/`registry-block` → subpath `export` → root `export`. A row may only take a more expensive form with a written reason.

### 4.2 Capability ledger (all genuinely new capability from the missing-capability map)

"Owner" uses §16 ids (crosswalk in the header); "this PRD" is `PRD-EXP` in the ledger. Where two PRDs are shown, the first is the single `owner` and the second a collaborator (deviation 6). "Form": E = export, P = part/prop of an existing component, RI = registry item, RB = registry block, L = labs. "Rel" = target release.

**Foundation and material**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-01 | Background-adaptive legibility contract (tint floor, ink auto-flip, valid `contrast: more`, complete forced-colors) | P0 | PRD-04 + PRD-05 | P: `Surface` behaviour, `[data-ag-surface]` rungs | 5.0 | exception: no competitor ships glass (E-34); platform bar (Apple, Mica); E-29, E-32 |
| X-02 | Positioning layer | P0 | PRD-07 | P: Base UI positioner inside `Popover`/`Menu`/`Select` (no `@floating-ui` dep, deviation 2) | 5.0 | Base UI (competitors.md, Base UI section) |
| X-03 | Shared Listbox/Menu/Field shells | P0 | PRD-07 | internal parts | 5.0 | composition for ~13 consumers (map P0 build order step 1) |
| X-04 | `NumberField` | P0 | PRD-08 (#13) | E (root) | 5.0 | Base UI NumberField |
| X-05 | `Meter` | P1 | PRD-14 (T2) | E (root) | 5.0 | Base UI Meter; consumed by `UsageMeter` (`AURAGLASS_AI_PRD.md:101`) |
| X-06 | `Kbd` | P2 | PRD-14 (T2) | E (root) | 5.0 | exception: no competitor evidence; reused by `SearchField` `shortcut` (REQ-CTL-101) and `CommandPalette` hints |
| X-07 | Direction/locale layer | P1 | PRD-05 + PRD-07 | P: `AuraGlassProvider` (PRD-05 owns the provider, §16) `dir` and `locale` props; PRD-07 wires Base UI's direction provider; `useLocale()` internal | 5.0 | React Aria i18n bar; E-08. Base UI API name verified at alpha |

**Navigation and commands**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-08 | Ranked fuzzy matching, cmdk-style compound | P0 | PRD-10 (#29) | E: `Command`, `CommandPalette` | 5.0 | shadcn Command; E-17 |
| X-09 | Radiogroup segmented control with thumb | P0 | PRD-08 (#4) | E: `SegmentedControl` on Base UI `RadioGroup` (radio semantics; deviation recorded by CTL, SC-38, errata E-08) | 5.0 | Base UI RadioGroup/ToggleGroup; E-18 |
| X-10 | Pointer-anchored context menu, real menubar | P1 | PRD-09 (#20) | E: `ContextMenu`, `Menubar` parts of `Menu` | 5.0 | Base UI ContextMenu/Menubar; E-27 |
| X-11 | Roving-focus toolbar | P1 | PRD-08 (#3) | E: `Toolbar` | 5.0 | Base UI Toolbar |

**Inputs**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-12 | Async, creatable and free-text autocomplete combobox | P0 | PRD-08 (#12) | P: `Combobox` `mode="autocomplete"`, `loadOptions`, `creatable` (REQ-CTL-128, REQ-CTL-129) | 5.0 | Base UI Combobox/Autocomplete; E-06 |
| X-13 | Tag input | P1 | PRD-08 (#12) | P: `Combobox multiple creatable` with `Combobox.Chips` (REQ-CTL-129; no `TagInput` export) | 5.0 | shadcn/Mantine TagsInput pattern; R3 |
| X-14 | Calendar grid + draft-commit range | P0 | PRD-11 (#14) | E: `Calendar`, `DatePicker`, `DateRangePicker` (`./date`) | 5.0 | RA Calendar; E-12 |
| X-15 | `TimePicker` | P1 | PRD-11 | E (`./date`) per REQ-DATA-68 | 5.0 | MUI X, RA TimeField; E-01 |
| X-16 | `DateTimePicker` | P1 | PRD-11 | E (`./date`) composed of `DateField` + `TimeField` + `Calendar` | **5.1** (C-E) | MUI X DateTimePicker; gap: no sibling PRD lists it |
| X-17 | Real dropzone with upload adapter | P0 | PRD-14 (T2 `FileUpload`) | P: `FileUpload` `onUpload(file, { signal, onProgress })` (REQ-FND-32) | 5.0 | shadcn/Mantine Dropzone; E-20 |
| X-18 | 2-D colour area | P1 | PRD-14 (T2 `ColorPicker`) | P: `ColorPicker.Area` part (REQ-FND-33) | 5.0 | RA ColorArea |
| X-19 | One-time-code input | P2 | PRD-14 | E: `OtpField` | **5.1** | shadcn InputOTP; E-07 |

**Overlays**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-20 | `AlertDialog` | P0 | PRD-09 (#16) | E | 5.0 | Base UI AlertDialog |
| X-21 | Hover card with hover intent | P1 | PRD-09 (#18) | P: `Popover openOnHover` (REQ-OVL-40) | 5.0 | Base UI PreviewCard; R3 |
| X-22 | Notification inbox on the toast store | P1 | PRD-09 (#21) | P: `Toast.History` | 5.0 | E-19; `AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md:135` |
| X-23 | Product `Tour` | P1 | PRD-14 (T2) | E: `Tour` on `Popover` | 5.0 | §11.1 T2 list |

**Data**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-24 | Row and column virtualization | P0 | PRD-11 (#32) | P: `Table` `virtualize` via `@tanstack/react-virtual` (REQ-DATA-10, REQ-DATA-14) | 5.0 | MUI X, shadcn data table (E-35); E-11 |
| X-25 | Column sizing, pinning, reorder | P0 | PRD-11 (#32) | P: `Table` `columnSizing`/`enableColumnResizing`, `columnPinning` (REQ-DATA-10, REQ-DATA-15); `columnOrder` reorder has **no owner REQ** (gap, REQ-EXP-27) | 5.0 | MUI X; E-02 |
| X-26 | Range row selection, inline cell edit, server pagination/sort adapters | P1 | PRD-11 (#32) | P: Shift-range selection in `selectionMode="multiple"` (REQ-DATA-13), `manualPagination`/`manualSorting`/`rowCount` (REQ-DATA-10); inline edit has no owner REQ (gap, REQ-EXP-28) | 5.0 (selection, server adapters); inline edit **5.1** (C-E) | MUI X Data Grid |
| X-27 | `ChartFrame` (axes, legend, table fallback, adapter) | P1 | PRD-11 (#36) | E (`./data`) | 5.0 | D-21; E-36 |
| X-28 | SVG `Chart` (line, area, bar, donut) | P1 | PRD-11 | E (`./charts`, optional peers `d3-scale`, `d3-shape`) | **5.1** (REQ-DATA-72–75) | D-21; E-36, E-37 |
| X-29 | Sound query builder | P2 | PRD-11 | headless `useFilterModel` (P) + RI `query-builder` (`AURAGLASS_DATA_PRD.md:184`) | 5.0 | MUI X filter model; E-16 |
| X-30 | Kanban, Gantt, TransferList | P2 | PRD-18 (pipeline) / this PRD (ledger) | RI `kanban` (dnd-kit), `gantt`, `transfer-list` | 5.1 | D-17, §13.5; E-28 |

**AI (presentational, D-30)**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-31 | Log thread, message parts, streaming text | P0 | PRD-12 (#38, #39) | E: `Thread`, `Message`, `StreamingText` | 5.0 | E-33 |
| X-32 | Multimodal composer (attachments, paste/drop, stop) plus real `MediaRecorder` voice capture | P0 | PRD-12 (#40) | E: `Composer`; voice as RI `ai-voice-input` via the `Composer.Action` slot (`AURAGLASS_AI_PRD.md:109`, `:215`) | 5.0 | AI Elements PromptInput; E-13 |
| X-33 | `Reasoning`, `ToolCall` (+ approval), `AgentSteps` | P1 | PRD-12 (#41) | E | 5.0 | shadcn HITL helpers (E-33) |
| X-34 | `Citation`, `SourceList` | P1 | PRD-12 (#42) | E | 5.0 | AI Elements |
| X-35 | `ModelPicker` | P1 | PRD-12 | RI `ai-model-picker` on `Combobox` | 5.0 | AI Elements; `AURAGLASS_AI_PRD.md:215` |
| X-36 | `Artifact` panel, `TraceTree`, `EvalDashboard` | P2 | PRD-12 | RI `ai-artifact-panel`, `ai-trace-tree` (on `TreeView` + `Timeline`), RI `ai-eval-dashboard` (a `registry:item` per SC-32; on `Table` + `ChartFrame`) | 5.0 | E-33; E-26 |

**Media**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-37 | Headless media element | P1 | PRD-13 | E: `useMediaElement` (`./media`, REQ-MED-10–16) | 5.0 | §3.2 `./media` row |
| X-38 | Scrubber with buffered ranges, chapter markers, hover time, frame step | P2 | PRD-13 (#43) | E: `MediaScrubber` (`./media`), also `MediaControls.Scrubber` (REQ-MED-20, REQ-MED-23–25) | 5.0 | E-22; Media PRD scope deviation (its line 15) |
| X-39 | Standalone lightbox | P1 | PRD-13 (#43) | P: `ImageViewer` (Dialog-based, `items` keyed by `id`) replaces `GlassGallery enableLightbox` (REQ-MED-40–43) | 5.0 | E-23; R3 |
| X-40 | APG carousel | P1 | PRD-13 (#44) | E: `CarouselRail` (REQ-MED-50–55) | 5.0 | APG carousel pattern |
| X-41 | Captions/track toggle | P1 | PRD-13 (#43) | P: `MediaControls.Captions` (native `TextTrack` modes, REQ-MED-29) | 5.0 | WCAG 1.2.2 |
| X-42 | `Waveform` (consumer-supplied decoded `peaks`, or a live single-bar `level` 0–1) | P2 | PRD-13 | E: `Waveform` (`./media`, REQ-MED-35–39). The library performs no audio analysis and creates no `AudioContext` (REQ-MED-16); there is no separate `AudioLevel` export | **5.1** (C-E; SC-12, SC-38: `./media` exports 7 values at 5.0.0) | exception: no competitor evidence; E-14 |
| X-43 | Transcript panel | P3 | PRD-13 | RI `media-transcript` (REQ-MED-95, adopting the REQ-EXP-30 contract) | 5.1 | exception; accessibility value |

**Workspaces**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-44 | N-panel `ResizablePanels` (pointer, container-relative, collapse, persisted layout) | P0 | PRD-10 (#30) | E (`./app-shell`) | 5.0 | shadcn Resizable; E-15 |
| X-45 | Dockable `Inspector` with typed property rows | P1 | PRD-10 | E (`./app-shell`) | 5.0 | E-21 |
| X-46 | `PresenceStack` | P2 | this PRD (spec) / PRD-18 (pipeline) | RI `presence-stack` on T2 `AvatarGroup`; adapter is a typed prop `users: PresenceUser[]`, **no transport** | 5.1 | Liveblocks-style UIs; exception (no competitors.md evidence) |
| X-47 | `CommentThread` anchored to content | P2 | this PRD / PRD-18 | RI `comment-thread` on `Card` + `TextField` + `Popover` | 5.1 | replaces `GlassCommentThread` (3.5); exception |

**Commerce (post-GA registry only; deviation 5)**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-48 | `ProductCard`, `LineItem`, `CartSummary` | P2 | this PRD / PRD-18 | RB `commerce-cart` | 5.1 | E-24 (recipe demand at `recipes.ts:810`); exception (E-38) |
| X-49 | `CheckoutSteps` | P2 | this PRD / PRD-18 | RB `commerce-checkout`: an ordered list with `aria-current="step"` (REQ-EXP-14) + `Form` fields | 5.1 | as X-48 |
| X-50 | `PricingTable`, `PlanComparison` | P3 | this PRD / PRD-18 | RB `pricing` on `SegmentedControl` + `Table` | 5.1 | E-25; exception |

**Enterprise**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-51 | Typed registry (`$schema`, `registryDependencies`) | P1 | PRD-18 | registry schema | 5.0 | shadcn registry schema; APPSHELL-WORKSPACE-RECIPES-CLI-08 (PARTIAL) |
| X-52 | `DescriptionList` | P1 | PRD-14 (T2) | E | 5.0 | §11.1 T2 list; E-09 |
| X-53 | Banner | P1 | PRD-14 (T2 `Alert`) | P: `Alert layout="banner"` (no `Banner` export) | 5.0 | E-09; R3 |
| X-54 | `EmptyState` | P1 | PRD-14 | E (polish of `GlassEmptyState`) | 5.0 | map Enterprise |
| X-55 | Settings page, audit log, permissions matrix | P1 | this PRD / PRD-18 | RB `settings` (5.0, §3.1), `audit-log`, `permissions-matrix` (5.2) | 5.0 / 5.2 | MUI X / shadcn blocks pattern; map Enterprise |

**Spatial / immersive**

| Row | Capability | Pri | Owner | Form / name | Rel | Justification |
|---|---|---|---|---|---|---|
| X-56 | Honest depth layering | P3 | PRD-04 | P: existing layer model (§4.6) and `SurfaceGroup`; **no `elevation` tokens** (deviation 3) | 5.0 | D-07 |
| X-57 | `Parallax`, `ParticleField`, `MagneticCursor` | P3 | PRD-21 (interim: this PRD, SC-37) | L (rebuilt to §13.4 criteria) | labs 0.x | exception: §4.5 |
| X-58 | Cinematic WebGL lens | P3 | PRD-21 (interim: this PRD for the gate; MAT for the engine contract) → `./three` | L, promoted per §13.4 | labs → 5.x | D-05, D-16 |

Totals: 58 rows. By priority: P0 15, P1 27, P2 11, P3 5. By primary release: 5.0 45 (X-26 and X-55 partly later), 5.1 11 (X-16, X-19, X-28, X-30, X-42, X-43, X-46–X-50), labs 2 (X-57, X-58); X-26 inline edit is 5.1 and X-55 wave 2 is 5.2. The ledger file is the source of truth; these totals are recomputed by the CI script and this paragraph is regenerated (REQ-EXP-04).

### 4.3 Export-budget accounting for additions (D-15)

- The ledger does **not** hand-count exports. Each row's `exportDelta` is filled from the owner PRD's exact export list: `AURAGLASS_AI_PRD.md` REQ-AI-02 (15 values in `./ai`), `AURAGLASS_DATA_PRD.md:108-109` (`./data` and `./date`, the latter including `TimePicker` and `RangeCalendar`), `AURAGLASS_MEDIA_BACKDROPS_PRD.md` REQ-MED-01 (7 values in `./media` at 5.0.0, including `MediaScrubber` and `formatMediaTime`; `Waveform` is the 8th, in 5.1, SC-12), `AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md:129` (root overlays including `ContextMenu` and `Menubar`), and the T2 list in `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.5. Rows of §4.2 that add a value export not present in architecture §3.2 or §11 are: `TimePicker` and `RangeCalendar` (`./date`), `MediaScrubber`, `formatMediaTime` (`./media`), and `Waveform` (`./media`, 5.1), each recorded as an explicit deviation in its owner PRD and accepted by SC-12 (errata E-04). Root additions in this ledger are only names already in §11.2 or the §11.1 T2 list (`NumberField`, `AlertDialog`, `ContextMenu`, `Menubar`, `Meter`, `Kbd`, `Tour`, `DescriptionList`), so this PRD adds **no** root export of its own at 5.0. All other P0/P1 additions are parts or props.
- The ledger records `exportDelta` per row. The CI script sums deltas and cross-checks against the generated manifest count (PRD-02). If root > 160 or total > 250, the newest-priority rows (P3, then P2) must move down the delivery-form ladder (§4.1) before the PR merges.
- 5.1 additions are C-E and consume headroom left at 5.0 GA: root `OtpField` (1); subpath `DateTimePicker` (`./date`), `Chart` (`./charts`), `Waveform` (`./media`, SC-12) and `CompareSlider` (`./media`, deferred to 5.1 by `AURAGLASS_MEDIA_BACKDROPS_PRD.md:15`) (4). They are blocked if the 5.0 GA manifest leaves fewer than 1 root slot or fewer than 4 subpath slots.

### 4.4 Rejected novelty (ledger `form: "rejected"`)

Each family below fails at least one of R1–R4 and is **not** re-admitted in any 5.x minor. Deletion is executed by PRD-16; this PRD only records the rejection so additions cannot reintroduce them.

| Family (4.x evidence) | Fails | Reason |
|---|---|---|
| Quantum, consciousness, biometric, eye-tracking, gaze, "predictive" props (`ConsciousnessFeatures` mixin, `src/components/charts/GlassChart.tsx:43`; conditional hooks, API-CONSISTENCY-02) | R1, R4 | no product surface; conditional hooks crash; simulated input |
| "AI creative" simulations: GAN, DeepDream, StyleTransfer, GenerativeArt, NeuralWeight, Neuromorphic, `AIGlassThemeProvider`, `GlassPredictiveEngine`, `GlassAutoComposer` (SERVER-SERVICES-AI-06, -10) | R4 | simulation; provider calls conflict with D-30 |
| Ecommerce engines: `GlassSmartShoppingCart`, `GlassEcommerceProvider`, `GlassProductRecommendations` (fabricated reasons; E-24) | R4 | stateful fake engine. Presentational blocks X-48–X-50 replace them |
| AR/XR/3-D demos: `SpatialComputingEngine`, `GlassARPreview`, `ARGlassEffects`, `Glass360Viewer`, `GlassHologram`, `GlassVortexPortal`, `GlassFluidSimulation`, `Glass3DEngine`, `AuroraPro`, `GlassShatterEffects` (all REMOVE) | R1, R2 | no competitor evidence (E-38), self-declared demos, `AuroraPro` renders an empty div |
| Novelty layouts: Fractal, Orbital, Tessellation, Island (`GlassIslandLayout` fake resize) | R1, R3 | masonry folds into T2 `Grid` (§13.3) |
| CMS canvas/property panel with `new Function` (`src/components/cms/GlassCanvas.tsx:315`) | R4 | code-execution sink; `Inspector` (X-45) is the product surface |
| Fake collaboration cursors (`GlassTeamCursors`, defined in `src/components/collaboration/CollaborativeGlassWorkspace.tsx`; REMOVE) | R4 | random positions; `PresenceStack` (X-46) is the honest successor |
| Gamification, achievements, emotional intelligence, default-on sound design | R1 | no product demand; sound only as opt-in labs `useGlassSound` (§13.3) |
| Houdini paint worklets, `LiquidGlassGPU`, GPU self-displacement | R2, R5 | engine-specific, unbudgeted; cinematic lens (X-58) is the labs path |
| A runtime presence/transport adapter inside the library | R4 | network in library; presence data is a prop |
| Separate `Dock`, `NavBar`, `Autocomplete`, `TagInput`, `Banner`, `Lightbox`, `HoverCard`, `NotificationCenter` exports | R3 | expressible as parts/props (X-12, X-13, X-21, X-22, X-39, X-53; `AURAGLASS_APP_SHELL_NAVIGATION_PRD.md:14`) |
| `elevation` token axis | D-07 | rejected by architecture (deviation 3) |
| `MindMap`, `SignaturePad` as core exports | R1 | labs only, and only on recorded demand (§13.4) |

### 4.5 Spatial/immersive admission (labs only where justified)

A spatial or immersive resident is admitted to `@auraglass/labs` only if it satisfies the §13.4 criteria **and** all of:

1. It renders library-owned pixels or decorates content; it never carries primary text or controls (text stays on `Surface` with the legibility contract).
2. It pauses when offscreen or the tab is hidden (`IntersectionObserver` + `visibilitychange`) and renders a static frame under `prefers-reduced-motion: reduce` and under reduced transparency.
3. It costs ≤1 extra composited layer and ≤4 ms main-thread per frame at p95 on the remote mid-tier mobile profile (§15.2 Performance lane).
4. It names a concrete product use (hero backdrop, media chrome demonstration, onboarding scene), recorded in the ledger `surface` field.

Under these rules the only spatial rows are X-57 (parallax, particles, magnetic cursor) and X-58 (cinematic lens). WebXR, AR preview and 360 viewers are rejected for 5.x (§4.4).

### 4.6 Post-GA roadmap

| Release | Content | Owner | Class | Entry gate |
|---|---|---|---|---|
| 5.0.x | Ledger gate stays live; bug fixes only on new surfaces | all | C-I | — |
| **5.1** | `aura-glass/charts` `Chart` (line/area/bar/donut) in `ChartFrame`, `d3-scale`/`d3-shape` optional peers (X-28) | PRD-11 | C-E | REQ-DATA-72–75 green; `{ Chart }` ≤15 KB gz (owner line, `AURAGLASS_DATA_PRD.md:658`) |
| 5.1 | `DateTimePicker` (X-16), `Table` inline edit (X-26) | PRD-11 | C-E | APG scripts green |
| 5.1 | `OtpField` (X-19) | PRD-14 | C-E | reduced matrix green |
| 5.1 | `Waveform` in `./media` (X-42, SC-12) | PRD-13 | C-E | REQ-MED-35–39 green; MED §16 size line |
| 5.1 | RI `media-transcript` (X-43, REQ-MED-95) | PRD-13 | registry | static lane: no `Math.random`, no network |
| 5.1 | RB `commerce-cart`, `commerce-checkout`, `pricing` (X-48–X-50) | this PRD (content), DX (pipeline) | registry (per release) | every block renders in the Vite and Next canaries |
| 5.1 | RI `kanban`, `gantt`, `transfer-list` (X-30, DX content DX-082..084), `presence-stack`, `comment-thread` (X-46, X-47) | DX / this PRD | registry | same |
| **5.2** | RB `audit-log`, `permissions-matrix` (X-55 wave 2) | this PRD / DX | registry | `Table` server adapters stable |
| 5.2+ | First labs promotion (cinematic lens → `./three`, or `Parallax` → core) if flagship certification passes | this PRD as interim PRD-21 owner (gate); MAT (engine) | C-E | §13.4 promotion rule; REQ-EXP-40 |
| 6.0 | Re-evaluate registry items with sustained demand (from `doctor` opt-in reports and issues) for promotion to exports; `compat` removed | DX | C-B | — |

### 4.7 Ledger schema

`docs/auraglass-5/capability-ledger.schema.json` (NEW, JSON Schema 2020-12). Each row:

```ts
interface CapabilityRow {
  id: `X-${string}`;                 // stable, never reused
  capability: string;
  area: 'foundation' | 'navigation' | 'inputs' | 'overlays' | 'data' | 'ai' | 'media' | 'workspaces' | 'commerce' | 'enterprise' | 'spatial';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  owner: `PRD-${number}` | 'PRD-EXP'; // §16 numbering, or this PRD; exactly one
  collaborators?: `PRD-${number}`[]; // secondary PRDs (deviation 6); never counted as owners
  form: ('export' | 'part' | 'prop' | 'registry-item' | 'registry-block' | 'labs' | 'rejected')[];
  names: string[];                   // exported symbol, part name or registry id
  subpath?: string;                  // e.g. "./date"
  release: '5.0' | '5.1' | '5.2' | 'labs' | 'never';
  evidence: string[];                // "research/competitors.md:22" or "exception:<reason>"
  findings: string[];                // E-xx in this PRD and autopsy IDs
  rubric: { R1: boolean; R2: boolean; R3: boolean; R4: boolean; R5: boolean; R6: boolean };
  exportDelta: { root: number; subpath: number };
  budgetKb?: number;                 // min+gz per-import ceiling
  reqRefs: string[];                 // owner REQ ids, e.g. "REQ-DATA-68"
  status: 'planned' | 'in-progress' | 'delivered' | 'deferred' | 'rejected';
  artifacts?: { release: string; url: string }[]; // CI run URLs per release (REQ-EXP-35, D-32)
  demand?: string[];                 // GitHub issue or opt-in `doctor` report URLs (REQ-EXP-36)
  stories?: string[];                // Storybook ids of the owner's named stories (§13.3)
}
```

`owner` uses §16 numbering; `PRD-21` rows (X-57, X-58) are held by this PRD as interim owner (SC-37) and the gate maps `PRD-21` to this file when grepping `reqRefs`. The three optional fields are additive; every other field is required.

---

## 5. Exact implementation requirements

### 5.1 Ledger and gate

- **REQ-EXP-01** Create `docs/auraglass-5/capability-ledger.json` with the 58 rows of §4.2 plus one `rejected` row per family in §4.4 (13 rows, ids `X-R01`…`X-R13`). It validates against `docs/auraglass-5/capability-ledger.schema.json` (§4.7). Test: `tests/capability/ledger-schema.test.ts` "every row validates". `ajv` is not in `package.json` today (checked 2026-10-06), so `verify-capability-ledger.mjs` embeds a dependency-free checker for the subset of JSON Schema the schema uses (`type`, `enum`, `pattern`, `required`, `items`); no runtime or new devDependency is added.
- **REQ-EXP-02** `scripts/ci/verify-capability-ledger.mjs` (NEW) exits non-zero if: any row's `owner` is missing, is an array, or does not match `PRD-<n>`/`PRD-EXP`; any row lists its `owner` again in `collaborators`; any `id` repeats; any non-rejected row has `rubric` with a `false`; any `evidence` entry is neither `research/competitors.md:<n>` (line exists) nor `exception:<non-empty>`; any `findings` E-id is not defined in this PRD. Test: `tests/capability/verify-ledger.test.ts` with fixtures `tests/capability/fixtures/{dup-owner,missing-evidence,bad-line,rubric-false,unknown-finding}.json`, each asserting exit code 1 and the row id in stderr.
- **REQ-EXP-03** Delivery check, run in the L2 Artifact lane on the packed tarball: for every row with `release` ≤ the package version and `status: "delivered"`, each `names[]` entry resolves as (a) a value export of `subpath` in the packed tarball, enumerated for every entry of the generated `build/exports.manifest.json` (PKG-005, SC-12) by installing the tarball into a scratch project and listing `Object.keys(await import(...))`, or (b) a `data-ag-part` value listed in the owner component's `<Component>.meta.ts` (SC-27, FND-005), or (c) an entry of `registry/registry.json` (DX-067) with the matching `type` (`registry:block` / `registry:item`) whose built `apps/docs/public/r/<name>.json` exists in the lane (SC-32). At the `5.0.0-rc.1` tag every 5.0 P0 and P1 row must be `delivered`. Test: `tests/capability/delivery.test.ts` "all 5.0 P0/P1 delivered at rc".
- **REQ-EXP-04** The ledger totals paragraph in §4.2 and the roadmap table in `docs/` (DX, §16 PRD-20) are generated by `node scripts/ci/verify-capability-ledger.mjs --report md`. Docs lint fails if the committed text differs. Test: `tests/capability/report.test.ts` snapshot of the markdown for a fixture ledger.
- **REQ-EXP-05** Any PR that adds a value export, a `registry/{base,blocks,items}/**` entry or a `packages/labs/**` resident must add or update a ledger row in the same PR. Enforced by `verify-capability-ledger.mjs --diff origin/main`, which compares the manifest export set, the `registry/registry.json` item set and the labs export set against ledger `names`. Test: fixture "export added without row" exits 1.
- **REQ-EXP-06** A PR whose new or changed ledger row matches a `rejected` row (same `names` entry, or case-insensitive name match against the §4.4 family keywords list stored in the row's `names`) fails with message `X-Rnn rejected: <reason>`. Test: fixture adding `GlassHologram` exits 1 citing `X-R04`.

### 5.2 Export budget

- **REQ-EXP-07** The ledger script sums `exportDelta` and asserts root value exports ≤160 and total ≤250 against the PKG manifest count (enumerated as in REQ-EXP-03(a)); if the manifest count and the ledger-derived count differ by more than 0, it fails with both numbers. Test: `tests/capability/export-budget.test.ts`.
- **REQ-EXP-08** No new root export for any capability with `form` containing `part` or `prop`. Specifically, none of `Autocomplete`, `TagInput`, `HoverCard`, `NotificationCenter`, `Banner`, `Lightbox`, `Dock`, `NavBar`, `ModelPicker`, `QueryBuilder`, `TraceTree`, `Artifact` is a value export of any 5.0 subpath. Test: `tests/exports/expansion-no-alias.test.ts` reads the manifest and asserts each name is absent.
- **REQ-EXP-09** At 5.0 GA the manifest leaves ≥1 root and ≥4 subpath value-export slots free for the 5.1 additions (§4.3: `OtpField`; `DateTimePicker`, `Chart`, `Waveform`, `CompareSlider`). Test: `tests/capability/export-budget.test.ts` "5.1 headroom".

### 5.3 Reality rules for every new surface

- **REQ-EXP-10** For files under the directories of rows with `release` 5.0 or 5.1 (`src/date/**` NEW, `src/data/**` (exists, `index.ts` only), `src/charts/**` NEW, `src/ai/**` NEW, `src/media/**` NEW, `src/app-shell/**` (exists with 4.x files; the rule is enabled per file as each 5.0 rewrite lands, never on the 4.x files being replaced), and new T2 files listed in §8), ESLint forbids: `Math.random` anywhere except inside a JSX event-handler prop or a function only referenced from one (render bodies, effects, initialisers, module scope and timers are all flagged; ids must use `useId`, colours a deterministic hash), `setTimeout`/`setInterval` whose callback calls a state setter with a literal progress value, `new Blob([` with a string literal, and default props containing arrays of ≥3 object literals (demo data). Rule: `auraglass/no-simulation`, registered (MODIFY) in the existing `eslint-plugin-auraglass.js`, whose file, namespace and `eslint.config.js` wiring belong to PKG (SC-16, PKG-015); this PRD owns only the rule. Test: `tests/lint/no-simulation.test.ts` with valid and invalid snippets for each pattern.
- **REQ-EXP-11** No new surface imports a 4.x module: files matching `src/components/**/{Glass,LiquidGlass,Enhanced}*.{ts,tsx}`, `src/hooks/**` or `src/utils/**` (5.0 components themselves live in `src/components/<kebab-name>/` per `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.1, so the directory alone is not the boundary). Enforced by `no-restricted-imports` patterns per subpath (PKG owns `eslint.config.js`; this PRD adds the `registry/{base,blocks,items}/**` and `packages/labs/**` entries by MODIFY). Test: lint fixture importing `src/components/input/GlassCombobox.tsx` from a `registry/blocks/` file fails.
- **REQ-EXP-12** No new surface performs network I/O: rg for `fetch(`, `XMLHttpRequest`, `WebSocket(`, `EventSource(` returns 0 over (a) the built `dist/` entry of `./ai` (rows X-31–X-34) in the packed tarball and (b) the registry sources of X-35, X-36 except `ai-sdk-adapter` (`AURAGLASS_AI_PRD.md` REQ-AI-41 lets that item declare `@ai-sdk/react`), X-43 and X-46–X-50. Test: `tests/capability/no-network.test.ts` (L2 Artifact lane).

### 5.4 Ledger rows owned by this PRD (registry content)

Pipeline (schema, `registry/registry.json`, build, lint, render harness, publish URL, `npx @auraglass/cli add`) is DX (§16 PRD-18, SC-32). This PRD owns the component contracts and content below. Sources live in `registry/blocks/<id>/` (blocks) and `registry/items/<id>/` (items); DX builds them to `apps/docs/public/r/<id>.json`. These five ids are the SC-32 "later blocks" added through this ledger and are not GA blocks. Unit tests live in `tests/registry/<id>.test.tsx` (SC-30; never inside the copied source). Block and item components follow SC-24: no `material` prop, `variant`/`intent` only where the underlying component has them.

- **REQ-EXP-13** `commerce-cart` block (`registry/blocks/commerce-cart/`) exports `ProductCard`, `LineItem`, `CartSummary`. All are controlled and presentational: `ProductCard({ title, price: { amount: number; currency: string }, image?: { src; alt }, badge?, href?, onAddToCart?(): void })` rendered on `Card` (content-raised content material; no `material` prop, SC-24); `LineItem({ id, title, quantity, onQuantityChange(id, q): void, unitPrice, lineTotal?, onRemove?(id): void, maxQuantity? })` using `NumberField`; `CartSummary({ lines: { label; amount }[], total, currency, cta: ReactNode, footnote? })`. Prices render with `Intl.NumberFormat(locale, { style: 'currency', currency })` from the provider locale (X-07). No pricing arithmetic beyond formatting. Test: `tests/registry/commerce-cart.test.tsx` "formats JPY with 0 fraction digits", "quantity uses NumberField min 1".
- **REQ-EXP-14** `commerce-checkout` block (`registry/blocks/commerce-checkout/`) exports `CheckoutSteps({ steps: { id; label; status: 'complete' | 'current' | 'upcoming' }[], value, onValueChange })` rendered as an ordered list with `aria-current="step"` on the current item, plus a page composition of `Form` fields (contact, shipping, payment placeholder slot). It has no payment SDK. Test: `tests/registry/commerce-checkout.test.tsx` "aria-current on exactly one step".
- **REQ-EXP-15** `pricing` block (`registry/blocks/pricing/`) exports `PricingTable({ plans: Plan[], period: 'monthly' | 'yearly', onPeriodChange, highlightPlanId? })` with the period toggle as `SegmentedControl`, and `PlanComparison({ plans, features: { id; label; values: Record<planId, boolean | string> }[] })` rendered as a `<table>` with `<th scope="col">` plan headers and `<th scope="row">` feature labels; boolean cells render an icon plus visually hidden "Included"/"Not included". Test: `tests/registry/pricing.test.tsx` "comparison has scoped headers", "period toggle is a radiogroup".
- **REQ-EXP-16** `presence-stack` item (`registry/items/presence-stack/`) exports `PresenceStack({ users: { id; name; avatarUrl?; color?: string; status?: 'active' | 'idle' }[], max = 4, onOverflowClick? })` on T2 `AvatarGroup`, with an overflow `+N` button whose accessible name is "`N` more collaborators". No transport, timers or random colours; colour falls back to a deterministic hash of `id` over the categorical palette tokens. Test: `tests/registry/presence-stack.test.tsx` "same id → same colour across renders", "overflow label".
- **REQ-EXP-17** `comment-thread` item (`registry/items/comment-thread/`) exports `CommentThread({ comments: Comment[], onSubmit(body): void | Promise<void>, onResolve?(): void, anchorLabel?: string })` using `Card` (content-raised), `TextField multiline` and `Button`; the list is a `<ol>` with `<article>` per comment and `<time dateTime>`. Submit is IME-safe (no submit while `isComposing`). Test: `tests/registry/comment-thread.test.tsx` "Enter during composition does not submit".
- **REQ-EXP-18** `audit-log` (5.2, `registry/blocks/audit-log/`) is a block on `Table` with server pagination (`manualPagination`, `pageCount`, `onPaginationChange`), `FilterBar`, and a `DateRangePicker`; `permissions-matrix` (5.2, `registry/blocks/permissions-matrix/`) is a `Table` of roles × permissions with `Checkbox` cells, row and column headers, and `aria-describedby` linking each checkbox to its permission description. Tests: `tests/registry/audit-log.test.tsx` "calls onPaginationChange with pageIndex", `tests/registry/permissions-matrix.test.tsx` "each checkbox name = role + permission".
- **REQ-EXP-19** Every block in REQ-EXP-13–18 uses only public `aura-glass` imports (no `aura-glass/compat`, no deep paths), zero inline `style` colour/blur literals, zero `!important`, and declares `registryDependencies` for every AuraGlass component it uses. Enforced by DX's `scripts/registry/lint.mjs` (DX-070) plus `tests/registry/blocks-lint.test.ts` (this PRD: a thin wrapper that runs the DX linter over `registry/blocks/{commerce-cart,commerce-checkout,pricing,audit-log,permissions-matrix}` and `registry/items/{presence-stack,comment-thread}` and adds the public-import and `registryDependencies`-completeness assertions).

### 5.5 Rows delivered by owner PRDs (this PRD sets the acceptance hook only)

- **REQ-EXP-20** Each ledger row owned by another PRD lists at least one `reqRefs` id that exists in that PRD's file (for example X-15 → `REQ-DATA-68`, X-28 → `REQ-DATA-72`, X-21 → `REQ-OVL-40`). The script greps the owner file for each id. Test: `tests/capability/req-refs.test.ts`.
- **REQ-EXP-21** Rows with no requirement yet in their owner PRD are filed as `status: "planned"` with `reqRefs` pointing at the matching contract in REQ-EXP-22 to REQ-EXP-30 until the owner adds its own REQ; the owner PRD must add it before its Wave-4 start (5.1 rows: before 5.0 GA). The contracts below are binding inputs for those owners. Status re-checked by rg over `prd/*.md` on 2026-10-06: of the original 8 gaps, **3 are closed** (X-17 → REQ-FND-32, X-18 → REQ-FND-33, X-43 → REQ-MED-95) and **5 remain open** (§21 O-01): X-07 direction/locale [PRD-05, A11Y], X-16 `DateTimePicker` [PRD-11, DATA], X-19 `OtpField` [PRD-14, FND], X-25 column reorder [PRD-11; REQ-DATA-10 has sizing and pinning but no `columnOrder`], X-26 inline cell edit [PRD-11; listed only as post-GA A-14 in `AURAGLASS_DATA_PRD.md:456`]. Media rows X-37–X-43 are **not** gaps: they cite REQ-MED ids (REQ-EXP-29).
- **REQ-EXP-22** X-07: `AuraGlassProvider` accepts `dir?: 'ltr' | 'rtl'` and `locale?: string` (BCP 47, default `navigator.language` on the client and `'en-US'` on the server). Every component that formats dates, numbers or currency reads the provider locale. Logical CSS properties only (`margin-inline-start`, `inset-inline-end`) in `ag.components`; static lint bans `left:`/`right:`/`margin-left`/`margin-right`/`padding-left`/`padding-right` in new component CSS. Test: `tests/a11y/rtl.spec.ts` (Playwright, remote) renders `Sheet side="start"`, `Slider`, `Breadcrumbs` and `Table` with `dir="rtl"` and asserts mirrored geometry (bounding box x-order reversed) and ArrowRight decreasing a slider.
- **REQ-EXP-23** X-16: `DateTimePicker({ value?: ZonedDateTime | CalendarDateTime | null, defaultValue?, onValueChange, granularity?: 'minute' | 'second', hourCycle?: 12 | 24, minValue?, maxValue? })` in `./date`, composed of `DateField` (granularity ≥ minute) + `Popover` containing `Calendar` and `TimeField`, with draft-commit like `DateRangePicker`. Test: `src/date/DateTimePicker.test.tsx`, `tests/a11y/apg/date-time-picker.apg.spec.ts` (SC-30; uses the A11Y harness `tests/a11y/apg/harness.ts`, A11Y-073).
- **REQ-EXP-24** X-17 (**closed**: owner REQ-FND-32 adopts this contract verbatim; FND-081 implements it). `FileUpload` gains `onUpload?(file: File, ctx: { signal: AbortSignal; onProgress(fraction: number): void }): Promise<void>`. Item `status` is `'selected' | 'uploading' | 'complete' | 'error' | 'cancelled'`. Without `onUpload`, items stay `'selected'` (never `'complete'`). `accept`, `maxSize`, `maxFiles` reject with typed reasons `'type' | 'size' | 'count'` announced through the provider announcer. The existing `onValueChange(files)` of REQ-FND-32 is unchanged. Test: `src/components/file-upload/FileUpload.test.tsx` "no onUpload → never complete", "abort sets status cancelled", "rejected promise sets status error".
- **REQ-EXP-25** X-18 (**closed**: owner REQ-FND-33; FND-082 implements). The owner REQ wins on API detail (deviation 7): REQ-FND-33 specifies the area as **one focusable element** with `aria-valuetext` "saturation S%, brightness B%", replacing this PRD's earlier two-hidden-range proposal. The remaining binding inputs are: ArrowLeft/Right change saturation and ArrowUp/Down brightness by 1%, Shift+Arrow by 10%; the thumb is a ≥24×24 CSS px target (≥44×44 under `pointer: coarse`). Test: `src/components/color-picker/ColorPicker.test.tsx` "area keyboard steps"; `tests/a11y/apg/color-picker.apg.spec.ts` (owner).
- **REQ-EXP-26** X-19 (5.1): `OtpField({ length: 4 | 6 | 8, value, onValueChange, onComplete?(code), pattern?: 'digits' | 'alphanumeric', mask?: boolean })` is one `<input autocomplete="one-time-code">` (`inputmode="numeric"` for `digits`, `"text"` for `alphanumeric`) visually segmented, so paste, SMS autofill and screen readers see one field. Test: `src/components/otp-field/OtpField.test.tsx` (path NEW, layout per `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.1) "paste 6 digits fires onComplete once".
- **REQ-EXP-27** X-25 reorder: `Table` accepts `columnOrder?: string[]` / `onColumnOrderChange?(order)` (TanStack `ColumnOrderState`) and `enableColumnReordering?: boolean`. Each header cell then has a "Column actions" menu button (Base UI `Menu`) with "Move left"/"Move right" items, so reordering never requires drag (WCAG 2.5.7); pointer drag is optional on top. A move announces "Moved <label> to position n of m" through the provider announcer. Columns cannot move across a `columnPinning` boundary. Test: `src/data/table/Table.reorder.test.tsx` (NEW) "move right updates columnOrder and announces", "pinned column cannot move into the unpinned group".
- **REQ-EXP-28** X-26 inline edit (5.1, C-E): column def `meta.editor?: 'text' | 'number' | 'select'` with `meta.options` for `select`, and `Table` `onCellEditCommit?(rowId, columnId, value)`. Enter or F2 on a focused cell (grid mode) opens the editor (`TextField`, `NumberField` or `Select`), Enter/Tab commits, Escape cancels and returns focus to the cell. The Table never mutates `data`. Test: `src/data/table/Table.edit.test.tsx` (NEW) "Escape cancels without callback", "Enter commits once".
- **REQ-EXP-29** Media rows defer to the owner (`AURAGLASS_MEDIA_BACKDROPS_PRD.md`): X-37 → REQ-MED-10; X-38 → REQ-MED-23, REQ-MED-24; X-39 → REQ-MED-40, REQ-MED-43; X-40 → REQ-MED-50; X-41 → REQ-MED-29; X-42 (5.1, SC-12) → REQ-MED-35, REQ-MED-36; X-43 (5.1) → REQ-MED-95. This PRD adds no competing signature. Its only acceptance hook is REQ-EXP-20 (ids exist) plus REQ-EXP-10 (no simulation) over `src/media/**`.
- **REQ-EXP-30** X-43 (5.1; **closed**: owner REQ-MED-95 adopts this contract, MED implements the item at `registry/items/media-transcript/`): RI `media-transcript` renders consumer-supplied cues `{ start: number; end: number; text: string; speaker?: string }[]` (or the cues of a `TextTrack`) as an `<ol>`; the cue containing `media.currentTime` gets `aria-current="true"`; activating a cue calls `media.seek(start)`. Auto-scroll follows the active cue only while the list is not hovered or focused, and never under reduced motion. No transcription, no network. Test (owner, as named in REQ-MED-95): `registry/items/media-transcript/media-transcript.test.tsx` "click cue seeks", "aria-current follows currentTime" (path differs from SC-30's `tests/<area>/` rule; §21 O-06).

### 5.6 Spatial, labs and roadmap gates

- **REQ-EXP-31** A labs resident with `area: "spatial"` is admitted only when the labs admission check (REQ-EXP-38) and the §4.5 rules pass: `tests/labs/spatial-admission.spec.ts` (remote, mid-tier mobile profile, driven by PERF's `tests/perf/harness/run-perf.mjs`, PERF-039) asserts p95 main-thread ≤4 ms per frame, ≤1 extra composited layer (CDP `LayerTree`), 0 rAF callbacks 500 ms after `visibilitychange` to hidden and after scroll-out, and a byte-identical static frame across two reduced-motion captures.
- **REQ-EXP-32** No file under `src/` (core) imports `three`, `@react-three/*` or any WebXR API (`navigator.xr`) except `src/three/**`. Test: lint `no-restricted-imports` fixture plus rg in `tests/capability/no-spatial-core.test.ts`.
- **REQ-EXP-33** `aura-glass/charts` is absent from the 5.0.0 `latest` exports map and present in 5.1.0 (mirrors REQ-DATA-75). The ledger row X-28 moves to `delivered` only when the 5.1 tag's L2 Artifact lane shows `{ Chart }` from `aura-glass/charts` ≤15 KB min+gz (the DATA owner row in `docs/size-budgets.json`, SC-15, SC-38) with `d3-scale` and `d3-shape` external.
- **REQ-EXP-34** Commerce and enterprise blocks are published only as registry JSON (`registry:block`), never as `aura-glass` exports; `rg "ProductCard|CartSummary|CheckoutSteps|PricingTable|PlanComparison|PresenceStack|CommentThread" dist/` on the packed tarball returns 0. Test: `tests/capability/registry-only.test.ts`.
- **REQ-EXP-35** Each 5.x minor's release notes include a "New capability" section generated from ledger rows whose `release` equals that minor (`--report release-notes`). Rows without an artifact link (CI run URL) fail docs lint (D-32). Test: `tests/capability/report.test.ts` "release notes section".
- **REQ-EXP-36** Promotion of a registry item to an export (C-E in a 5.x minor, or in 6.0) requires a ledger edit that sets `form` to include `export`, `exportDelta` > 0, the target subpath, and links to at least 10 distinct GitHub issues or opt-in `doctor` reports showing use. Test: fixture "promotion without demand evidence" exits 1; fixture with 9 links exits 1, with 10 exits 0.

### 5.7 Labs package and admission gate (interim §16 PRD-21 owner, SC-37)

This PRD holds the PRD-21 boundary until a labs PRD is filed. It owns the package shell and the admission gate; MAT owns the cinematic engine contract and each resident's engine code is delivered by the PRD that owns the underlying capability. Package name and the D-23 fallback follow SC-13 (PKG owns the package map).

- **REQ-EXP-37** `packages/labs/` (`@auraglass/labs`, version `0.x`, D-16; fallback name `aura-glass-labs` per SC-13 if the `@auraglass` scope does not verify) is an npm workspace next to `packages/qa` (QA-001 sets up the root `workspaces` entry). `package.json` has `"sideEffects": false`, `peerDependencies` `aura-glass` `^5.0.0`, `react`/`react-dom` matching the core peer range, `"exports"` with one entry per resident plus `./package.json`, and no `bin`. Source is `packages/labs/src/<kebab-resident>/`; tests are `tests/labs/**` (SC-30). Test: `tests/labs/package.test.ts` "peer aura-glass ^5", "sideEffects false", "no bin", "every exports entry resolves in the packed tarball".
- **REQ-EXP-38** Admission check (architecture §13.4, all required) `scripts/ci/verify-labs-admission.mjs`: for every resident listed in `packages/labs/package.json` `exports`, (a) a ledger row with `form` containing `labs` and `area` set exists (REQ-EXP-05); (b) `auraglass/no-simulation` reports 0 (REQ-EXP-10 extended to `packages/labs/src/**`); (c) imports resolve only to the public `aura-glass` entries in the PKG manifest (no `aura-glass/src/**`, no `aura-glass/compat`; ESLint `no-restricted-imports` plus a resolution check over the built output); (d) importing the resident's entry in Node has no side effects (no global listener, no `document`/`window` access at module scope; PKG's `scripts/ci/verify-side-effects.mjs`, PKG-042, run over the labs entries); (e) every rAF/timer loop routes through a pause on `visibilitychange` and `IntersectionObserver` and renders a static frame under reduced motion and reduced transparency (REQ-EXP-31 harness for `spatial` residents; a jsdom unit test asserting `cancelAnimationFrame` on hide for others). Test: `tests/labs/admission.test.ts` with fixtures `tests/labs/fixtures/{math-random,deep-import,side-effect,no-pause}/`, each exiting 1 naming the rule.
- **REQ-EXP-39** CI: the admission check runs in L1 Static on every PR touching `packages/labs/**`; `tests/labs/spatial-admission.spec.ts` runs in L10 Performance (remote). Labs publishes from the existing `publish-npm.yml` contract owned by REL (SC-05) only after the check is green; this PRD adds no publish workflow.
- **REQ-EXP-40** Promotion (architecture §13.4): a resident moves into core or `aura-glass/three` in a 5.x minor (C-E) only after its owner PRD passes flagship certification; the ledger row changes `form` to include `export` (REQ-EXP-36 rules apply), and the labs entry re-exports the core symbol with a one-time dev warning for exactly one labs minor, then is removed. Test: `tests/labs/promotion.test.ts` fixture "promoted resident without core export" exits 1; "re-export warns once".

---

## 6. Files/directories affected (existing paths)

All exist at HEAD `15b6de6f7` (`rg --files`). This PRD changes only the ledger tooling paths; the component directories are listed so owners know which 4.x sources their new capability replaces.

| Path | Change | Owner of change |
|---|---|---|
| `eslint-plugin-auraglass.js` | MODIFY: add rule `auraglass/no-simulation` (REQ-EXP-10); never CREATE (SC-16, OV-10) | this PRD (rule), PKG (file, namespace, PKG-015 wiring) |
| `eslint.config.js` | MODIFY: enable `auraglass/no-simulation` for 5.0 subpath dirs and `packages/labs/src/**`; `no-restricted-imports` for `registry/**`, `packages/labs/**`, and `three`/`navigator.xr` outside `src/three/**` | this PRD (rule entries), PKG (file, PKG-015) |
| `package.json` | add `scripts`: `"verify:capability": "node scripts/ci/verify-capability-ledger.mjs"` | this PRD |
| `.github/workflows/artifact.yml` | MODIFY: add the L2 Artifact steps for REQ-EXP-03/-07/-08/-12/-34 (SC-39) | this PRD (steps), PKG (file, PKG-073) |
| `.github/workflows/certify-pr.yml` | MODIFY: add the L1 Static ledger gate and labs admission steps (REQ-EXP-02, -39); no separate capability workflow (SC-29) | this PRD (steps), QA (file, QA-031) |
| `scripts/ci/` | add `verify-capability-ledger.mjs`, `verify-labs-admission.mjs` (directory exists: `run-next-integration.js`, `run-vite-integration.js`, `verify-pack.js`) | this PRD |
| `tests/` | add `capability/`, `registry/`, `labs/` subdirs and files under the existing `lint/`, `exports/`, `a11y/` areas (SC-30) | this PRD and owners |
| `docs/auraglass-5/` | add `capability-ledger.json`, `capability-ledger.schema.json` | this PRD |
| `src/registry/recipes.ts` | checkout button (`:810`), eval console (`:937-940`) recipes retired in favour of RB `commerce-checkout` and RI `ai-eval-dashboard` | NAV executes the removal (NAV-136, SC-38, OV-30); this PRD specifies the successors |
| `src/components/card/patterns.tsx` | `PricingCard` (`:385-405`) removed with no compat; successor RB `pricing` | FND (removal) / this PRD (successor) |
| `src/components/ecommerce/` (`GlassSmartShoppingCart.tsx`, `GlassEcommerceProvider.tsx`, `GlassProductRecommendations.tsx`) | deleted (REMOVE); successors X-48–X-50 | FND (§16 PRD-16) |
| `src/components/interactive/GlassCommentThread.tsx` | successor RI `comment-thread` | FND (removal) / this PRD |
| `src/components/collaboration/` | `GlassTeamCursors` and fake presence deleted; successor RI `presence-stack` | FND (removal) / this PRD |
| `src/components/social/GlassVoiceWaveform.tsx`, `src/components/media/GlassAdvancedAudioPlayer.tsx` | successors `Waveform` (5.1, REQ-MED-35, SC-12), `MediaControls` | MED |
| `src/components/interactive/GlassGallery.tsx`, `GlassImageViewer.tsx`, `GlassLazyImage.tsx` | successor `ImageViewer` | PRD-13 |
| `src/components/media/LiquidGlassMediaControls.tsx` | successor `MediaControls` with `Scrubber` (= `MediaScrubber`) and `Captions` parts (REQ-MED-20) | PRD-13 |
| `src/components/input/GlassFileUpload.tsx`, `src/components/interactive/GlassFileUpload.tsx` | successor T2 `FileUpload` with `onUpload` | PRD-14 |
| `src/components/input/GlassColorPicker.tsx` | successor T2 `ColorPicker` with `Area` | PRD-14 |
| `src/components/input/GlassTimeField.tsx`, `GlassDateField.tsx`, `GlassDatePicker.tsx`, `src/components/calendar/GlassCalendar.tsx` | successors in `./date`, plus `DateTimePicker` 5.1 | PRD-11 |
| `src/components/interactive/GlassQueryBuilder.tsx`, `src/components/data-display/GlassKanbanBoard.tsx`, `GlassGanttChart.tsx`, `src/components/input/GlassTransferList.tsx` | successors `useFilterModel` + RI | PRD-11 / PRD-18 |
| `src/components/interactive/GlassMindMap.tsx`, `GlassSignaturePad.tsx`, `src/components/advanced/GlassParallaxLayers.tsx` | labs candidates (rebuilt) or deleted | PRD-21 / PRD-16 |
| `src/components/navigation/LiquidGlassInspectorPanel.tsx`, `src/workspace/index.tsx`, `src/components/cms/GlassPropertyPanel.tsx` | successor `Inspector` | PRD-10 |
| `src/components/layout/GlassSplitPane.tsx`, `src/app-shell/GlassSplitPane.tsx`, `src/app-shell/GlassResizablePanel.tsx` | successor `ResizablePanels` | PRD-10 |
| `src/components/interactive/GlassChatInput.tsx`, `GlassVoiceInput.tsx` | successors `Composer`, RI `ai-voice-input` | PRD-12 |
| `src/components/data-display/GlassAlert.tsx`, `GlassEmptyState.tsx` | `Alert layout="banner"`, `EmptyState` | PRD-14 |
| `src/index.ts` | no edits by this PRD; manifest generation replaces it (PRD-02) | PRD-02 |

---

## 7. Components affected

This PRD changes no component implementation. It sets ledger contracts that change the following 5.0 components' scope (owner in brackets):

- `Surface` [PRD-04/05]: legibility contract (X-01).
- `AuraGlassProvider` [PRD-05/07]: `dir`, `locale` (X-07, REQ-EXP-22).
- `Combobox` [PRD-08]: `mode="autocomplete"`, `loadOptions`, `creatable`, chips (X-12, X-13).
- `Popover` [PRD-09]: `openOnHover` (X-21). `Toast` [PRD-09]: `History` part (X-22). `Menu` [PRD-09]: `ContextMenu`, `Menubar` (X-10).
- `Table` [PRD-11]: virtualization, sizing, pinning, reorder, range selection, server adapters, 5.1 inline edit (X-24–X-26).
- `FileUpload`, `ColorPicker`, `Alert`, `EmptyState`, `DescriptionList`, `Tour`, `Kbd`, `Meter`, `AvatarGroup` [PRD-14] (X-05, X-06, X-17, X-18, X-23, X-52–X-54; `AvatarGroup` consumed by X-46).
- `MediaControls`, `ImageViewer`, `CarouselRail` [PRD-13]: `Scrubber`, `Captions`, lightbox mode (X-38–X-41).
- `Composer`, `ToolCall`, `Reasoning`, `AgentSteps`, `Citation`, `SourceList` [PRD-12] (X-31–X-34).
- `ResizablePanels`, `Inspector` [PRD-10] (X-44, X-45).
- `SegmentedControl`, `NumberField`, `Toolbar` [PRD-08] (X-04, X-09, X-11), consumed by RB `pricing` and `commerce-cart`.

---

## 8. New components/files

All paths below are NEW (verified absent with `rg --files` on 2026-10-06).

| Path | Purpose | Release |
|---|---|---|
| `docs/auraglass-5/capability-ledger.json` | the ledger (REQ-EXP-01) | 5.0-alpha |
| `docs/auraglass-5/capability-ledger.schema.json` | schema (§4.7) | 5.0-alpha |
| `scripts/ci/verify-capability-ledger.mjs` | gate + `--report md|release-notes` + `--diff` | 5.0-alpha |
| `tests/capability/{ledger-schema,verify-ledger,delivery,report,export-budget,req-refs,no-network,no-spatial-core,registry-only}.test.ts` | §12 | 5.0-alpha |
| `tests/capability/fixtures/*.json` | negative fixtures | 5.0-alpha |
| `tests/exports/expansion-no-alias.test.ts` (dir `tests/exports/` exists) | REQ-EXP-08 | 5.0-alpha |
| `tests/lint/no-simulation.test.ts` | REQ-EXP-10 | 5.0-alpha |
| `tests/a11y/rtl.spec.ts` | REQ-EXP-22 | 5.0-beta |
| `tests/labs/spatial-admission.spec.ts` | REQ-EXP-31 | labs |
| `packages/labs/{package.json,src/index.ts,README.md}` | `@auraglass/labs` shell (REQ-EXP-37) | labs 0.1 |
| `scripts/ci/verify-labs-admission.mjs`, `tests/labs/{package,admission,promotion}.test.ts`, `tests/labs/fixtures/*` | REQ-EXP-38–40 | labs 0.1 |
| `registry/blocks/commerce-cart/{ProductCard,LineItem,CartSummary}.tsx`, `tests/registry/commerce-cart.test.tsx` | X-48 | 5.1 |
| `registry/blocks/commerce-checkout/{CheckoutSteps,CheckoutPage}.tsx`, `tests/registry/commerce-checkout.test.tsx` | X-49 | 5.1 |
| `registry/blocks/pricing/{PricingTable,PlanComparison}.tsx`, `tests/registry/pricing.test.tsx` | X-50 | 5.1 |
| `registry/items/presence-stack/PresenceStack.tsx`, `tests/registry/presence-stack.test.tsx` | X-46 | 5.1 |
| `registry/items/comment-thread/CommentThread.tsx`, `tests/registry/comment-thread.test.tsx` | X-47 | 5.1 |
| `registry/blocks/audit-log/AuditLogPage.tsx`, `registry/blocks/permissions-matrix/PermissionsMatrix.tsx`, `tests/registry/{audit-log,permissions-matrix}.test.tsx` | X-55 wave 2 | 5.2 |
| `src/stories/blocks/{CommerceCart,CommerceCheckout,Pricing,PresenceStack,CommentThread,AuditLog,PermissionsMatrix}.stories.tsx` | block stories inside DX's `src/stories/blocks/` directory (DX-097, OV-29), importing from `registry/` (no copies) | 5.1 / 5.2 |
| `tests/registry/blocks-lint.test.ts` | REQ-EXP-19 wrapper over DX's `scripts/registry/lint.mjs` | 5.1 |
| `registry/registry.json` entries (MODIFY of DX-067) and built `apps/docs/public/r/<id>.json` (DX build, git-ignored) | registration of the 7 ids | 5.1 / 5.2 |
| `src/date/DateTimePicker.tsx` (directory `src/date/` NEW) | X-16 (DATA implements) | 5.1 |
| `src/components/otp-field/OtpField.tsx` (final directory per FND's T2 layout) | X-19 (FND implements) | 5.1 |
| `src/data/table/Table.reorder.test.tsx`, `src/data/table/Table.edit.test.tsx` (`src/data/table/` created by DATA-038) | X-25, X-26 (DATA implements) | 5.0 / 5.1 |
| `registry/items/media-transcript/MediaTranscript.tsx` and its test | X-43 (MED implements, REQ-MED-95) | 5.1 |
| `src/stories/capability/CapabilityRoadmap.stories.tsx` (matches the existing `../src/stories/**/*.stories.*` glob in `.storybook/main.ts:6`) | §13 | 5.0-beta |

---

## 9. Components/files to remove or deprecate

This PRD removes nothing itself. It records, as `rejected` ledger rows, the families PRD-16 deletes (§4.4), so their capability cannot be re-added:

| Rejected row | 4.x names (examples, inventory disposition) | Deleted by | C-D in | C-B in |
|---|---|---|---|---|
| X-R01 | consciousness/quantum/biometric/eye-tracking components and `ConsciousnessFeatures` props | PRD-16 | 4.2 | 5.0 |
| X-R02 | `GlassGANGenerator`, `GlassDeepDreamGlass`, `GlassStyleTransfer`, `GlassGenerativeArt`, `AIGlassThemeProvider`, `GlassPredictiveEngine`, `GlassAutoComposer` | PRD-16 | 4.2 | 5.0 |
| X-R03 | `GlassSmartShoppingCart`, `GlassEcommerceProvider`, `GlassProductRecommendations` | PRD-16 | 4.2 | 5.0 |
| X-R04 | `SpatialComputingEngine`, `GlassARPreview`, `ARGlassEffects`, `Glass360Viewer`, `GlassHologram`, `GlassVortexPortal`, `GlassFluidSimulation`, `Glass3DEngine`, `AuroraPro`, `GlassShatterEffects` | PRD-16 | 4.2 | 5.0 |
| X-R05 | Fractal, Orbital, Tessellation layouts, `GlassIslandLayout` | PRD-16 | 4.2 | 5.0 |
| X-R06 | CMS family incl. `GlassCanvas`, `GlassPropertyPanel` (sink no-op in 4.1.1, §13.1) | PRD-00 / PRD-16 | 4.1.1 (sink) / 4.2 | 5.0 |
| X-R07 | `GlassTeamCursors` | PRD-16 | 4.2 | 5.0 |
| X-R08 | gamification, achievements, `emotionalIntelligence`, default-on `soundDesign` | PRD-16 | 4.2 | 5.0 |
| X-R09 | `HoudiniGlassProvider`/`Card`, `LiquidGlassGPU` | PRD-16 | 4.2 | 5.0 |
| X-R10 | library-side presence/transport adapter | never added | — | — |
| X-R11 | alias exports `Autocomplete`, `TagInput`, `HoverCard`, `NotificationCenter`, `Banner`, `Lightbox`, `Dock`, `NavBar` | never added | — | — |
| X-R12 | `elevation` token axis | never added | — | — |
| X-R13 | `MindMap`, `SignaturePad` as core exports (`GlassMindMap`, `GlassSignaturePad`) | PRD-16 (core), PRD-21 (labs on demand) | 4.2 | 5.0 |

Surviving 4.x names that a new capability replaces (`GlassHoverCard`, `GlassNotificationCenter`, `PricingCard`, `GlassCommentThread`, `GlassFileUpload` ×2, `GlassVoiceWaveform`) follow the §12 rule: C-D entry in the repo-root `deprecations.json` (schema and gate REL, REL-010; instance seeded by TRUST-075; SC-02/SC-03), re-export from `aura-glass/compat` through 5.x where a prop adapter is possible (adapters at `src/compat/<area>/<OldName>.tsx`, index DX-065, SC-34; `GlassHoverCard` is an adapter over `Popover openOnHover`), removed in 6.0. `PricingCard` and `GlassCommentThread` have no in-package successor (registry only). They get a C-D entry in 4.2 and are removed in 5.0 with **no** `compat` entry (a compat shim would keep a second 4.x DOM alive, against D-17/D-18); `deprecations.json` points at the registry item and `npx @auraglass/cli add pricing|comment-thread`.

---

## 10. API changes

Classes per D-27: **C-I** internal, **C-E** additive, **C-D** deprecation, **C-B** breaking.

| # | Change | Where | Release | Class |
|---|---|---|---|---|
| A-01 | `capability-ledger.json` + gate (tooling, not package API) | repo | 5.0-alpha | C-I |
| A-02 | `AuraGlassProvider` `dir?: 'ltr' \| 'rtl'`, `locale?: string` | `./theme` | 5.0 | C-E (new in a major; additive relative to the 5.0 provider) |
| A-03 | `Combobox` `mode?: 'select' \| 'autocomplete'`, `loadOptions?(query, { signal }): Promise<T[]>`, `creatable?: boolean \| { label?: (query) => ReactNode }`, `onCreate?(query)` (REQ-CTL-128, REQ-CTL-129) | `.` | 5.0 | C-B vs `GlassCombobox` (rename via §12), C-E for the new props |
| A-04 | `Popover.Trigger` `openOnHover?: boolean`, `delay?`, `closeDelay?` (REQ-OVL-40) | `.` | 5.0 | C-E |
| A-05 | `Toast.History` part | `.` | 5.0 | C-E; `GlassNotificationCenter` C-D in 4.3 → C-B in 5.0 (compat adapter) |
| A-06 | `Table` `virtualize`, `columnSizing`/`enableColumnResizing`, `columnPinning`, `selectionMode: 'none' \| 'single' \| 'multiple'` (Shift-range in `multiple`), `manualPagination`/`manualSorting`/`rowCount` (REQ-DATA-10, -13, -14, -15); `columnOrder`/`enableColumnReordering` (REQ-EXP-27) | `./data` | 5.0 | C-E on the new `Table`; C-B vs 4.x tables (columns API, §12) |
| A-07 | `Table` column `meta.editor`, `onCellEditCommit` (REQ-EXP-28) | `./data` | 5.1 | C-E |
| A-08 | `FileUpload` `onUpload(file, { signal, onProgress })`; files without `onUpload` stay `selected` | `.` | 5.0 | C-B (4.x reported "completed"; behaviour fix) |
| A-09 | `ColorPicker.Area` part | `.` | 5.0 | C-E |
| A-10 | `Alert` `layout?: 'inline' \| 'banner'` | `.` | 5.0 | C-E |
| A-11 | `MediaScrubber` export (also `MediaControls.Scrubber`), `MediaControls.Captions` part; `ImageViewer` dialog (REQ-MED-20, -23, -29, -40) | `./media` | 5.0 | C-E; `GlassGallery enableLightbox` C-D 4.3 |
| A-12 | `DateTimePicker` | `./date` | 5.1 | C-E |
| A-13 | `OtpField` | `.` | 5.1 | C-E |
| A-14 | `Waveform` (`peaks` or `level`, REQ-MED-35) | `./media` | 5.1 (SC-12) | C-E; `GlassVoiceWaveform` C-D 4.3 → C-B 5.0 |
| A-15 | `aura-glass/charts` `Chart` | `./charts` | 5.1 | C-E (D-21) |
| A-16 | Registry blocks/items: `commerce-cart`, `commerce-checkout`, `pricing`, `presence-stack`, `comment-thread`, `kanban`, `gantt`, `transfer-list` | registry | 5.1 | registry (per-release versioning, §3.1); not semver API |
| A-17 | Registry blocks `audit-log`, `permissions-matrix` | registry | 5.2 | registry |
| A-18 | `PricingCard`, `GlassCommentThread` removed with no compat | `.` | C-D 4.2 → 5.0 | C-B |
| A-19 | Rejected families (X-R01–X-R09, X-R13) removed | `.` | C-D 4.2 → 5.0 | C-B (executed by PRD-16) |

Prop grammar for all additions follows §11.1 and SC-24: selection controls use `value / defaultValue / onValueChange`; overlays use `open / defaultOpen / onOpenChange`; material-bearing components use `variant: 'regular' | 'clear' | 'identity'`, `thickness`, `prominent` and `refraction`; semantic status is `intent`. There is no `material` prop, no `elevation` and no `as` (use `render`).

---

## 11. Migration concerns

1. **Fake-to-real behaviour changes are visible.** `FileUpload` without `onUpload` no longer shows "completed" (A-08); voice input no longer produces a mock blob; `Waveform` renders only consumer-supplied peaks or levels, or nothing. Consumers who relied on the fakes in demos see empty states. Release notes list these under "Behaviour fixes" first. The `migrate 4to5` codemod (engine DX-041, ids REL, SC-33) emits `// TODO(aura-glass 5): provide onUpload, see docs/migration/file-upload.md` at each `GlassFileUpload` call site without `onUpload`, from the core `canonical-names` transform; the mapping comes from the `migration` field of `FileUpload.meta.ts` (FND), not a hand-written table.
2. **Capabilities moving to the registry.** Commerce, pricing, presence, comments, Kanban, Gantt, TransferList, QueryBuilder UI, ModelPicker, Artifact, TraceTree and EvalDashboard are copy-in source, not npm exports. Consumers take ownership of that code. `doctor --v5` (DX) reports each 4.x import of these names with the exact `npx @auraglass/cli add <id>` command.
3. **Gap between 5.0 GA and 5.1.** No `Chart`, `DateTimePicker`, `OtpField` or `Table` inline edit in 5.0. Paths: stay on 4.x LTS (12 months), use `ChartFrame` with a third-party chart (REQ-DATA-54 adapters), compose `DatePicker` + `TimePicker`, or use `aura-glass/charts` from the `next` dist-tag (`@tier preview`).
4. **Rejected families have no successor.** Consumers of quantum/consciousness/AR/GAN components must remove them; `doctor` lists them with "no successor (rejected: X-Rnn)". The frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (REL-115, SC-08) must not use any of them, or the migration lane cannot reach zero TODOs.
5. **RTL.** Adding `dir="rtl"` support flips `Sheet side="start"` and logical paddings; 4.x apps that hard-coded `left`/`right` in overrides will see mirrored layouts when they opt in. Default `dir` is `'ltr'`, so nothing changes without opt-in.
6. **Ledger drift.** If a sibling PRD renames a symbol, its ledger row must change in the same PR (REQ-EXP-05) or CI fails; owners must budget for that edit.

---

## 12. Tests required

Lanes are cited by SC-29 id and name (QA owns the lanes and `certify-pr.yml`, QA-031).

| Test file (NEW unless noted) | Asserts | Lane |
|---|---|---|
| `tests/capability/ledger-schema.test.ts` | every ledger row validates against the schema; 58 + 13 rows present; ids unique | L1 Static |
| `tests/capability/verify-ledger.test.ts` | each negative fixture (`dup-owner`, `missing-evidence`, `bad-line`, `rubric-false`, `unknown-finding`) exits 1 naming the row; the real ledger exits 0 | L1 Static |
| `tests/capability/delivery.test.ts` | at `5.0.0-rc.1` every 5.0 P0/P1 row is `delivered` and each name resolves to an export, a `.meta.ts` part or a `registry/registry.json` entry with built JSON (REQ-EXP-03) | L2 Artifact |
| `tests/capability/report.test.ts` | `--report md` output equals the committed §4.2 totals paragraph; `--report release-notes` lists only rows whose `release` equals the given version, each with a CI artifact URL | L1 Static |
| `tests/capability/export-budget.test.ts` | root ≤160, total ≤250; ledger count = manifest count; "5.1 headroom" ≥1 root / ≥4 subpath | L2 Artifact |
| `tests/capability/req-refs.test.ts` | each `reqRefs` id exists in its owner PRD file (SC-01 key → file) | L1 Static |
| `tests/capability/no-network.test.ts` | no `fetch(`, `XMLHttpRequest`, `WebSocket(`, `EventSource(` in the built entries of AI/commerce/workspace rows | L2 Artifact |
| `tests/capability/no-spatial-core.test.ts` | no `three`, `@react-three/*`, `navigator.xr` outside `src/three/**` | L1 Static |
| `tests/capability/registry-only.test.ts` | commerce/workspace block names absent from `dist/` of the tarball | L2 Artifact |
| `tests/exports/expansion-no-alias.test.ts` (dir exists) | the 12 alias names of REQ-EXP-08 are not value exports of any subpath | L2 Artifact |
| `tests/lint/no-simulation.test.ts` | `auraglass/no-simulation` flags each banned pattern (including `Math.random` in a render body, an effect and a `useState` initialiser) and passes the valid snippets (`Math.random` inside an `onClick` handler; ids from `useId`) | L1 Static |
| `tests/a11y/rtl.spec.ts` | `dir="rtl"` mirrors `Sheet`, `Slider`, `Breadcrumbs`, `Table` geometry and arrow-key direction; axe 0 violations | L5 Behaviour (remote) |
| `tests/labs/spatial-admission.spec.ts` | REQ-EXP-31 numbers on the remote mid-tier mobile profile via `tests/perf/harness/run-perf.mjs` (PERF-039) | L10 Performance (remote) |
| `tests/labs/{package,admission,promotion}.test.ts` | REQ-EXP-37, -38, -40 (package shape, 4 negative admission fixtures, promotion rule) | L1 Static |
| `tests/registry/commerce-cart.test.tsx` | currency formatting per locale (`ja-JP` JPY 0 decimals, `de-DE` EUR comma); `LineItem` quantity uses `NumberField` with `min=1`; `onRemove` called with id | L12 Unit |
| `tests/registry/commerce-checkout.test.tsx` | exactly one `aria-current="step"`; list is `<ol>` | L12 Unit |
| `tests/registry/pricing.test.tsx` | `PlanComparison` uses `scope="col"`/`scope="row"`; boolean cells have hidden text; period toggle has `role="radiogroup"` | L12 Unit |
| `tests/registry/presence-stack.test.tsx` | deterministic colour per id; overflow button name "`N` more collaborators"; no timers (`jest.getTimerCount() === 0`) | L12 Unit |
| `tests/registry/comment-thread.test.tsx` | IME composition Enter does not submit; `<time dateTime>` present; resolve button calls `onResolve` | L12 Unit |
| `tests/registry/audit-log.test.tsx`, `tests/registry/permissions-matrix.test.tsx` (5.2) | pagination callback payload; checkbox accessible name = role + permission | L12 Unit |
| `tests/registry/blocks-lint.test.ts` | runs DX's `scripts/registry/lint.mjs` (DX-070) over the 7 ids: public imports only, no inline colour/blur literals, no `!important`, complete `registryDependencies` | L1 Static |
| `tests/dx/registry-render.spec.ts` (DX-094, MODIFY: add the 7 ids) | each new block renders in the Vite and Next 16 packed-tarball canaries with 0 console errors and axe 0 violations (colour contrast on) over the 8 SC-28 scenes | L11 Consumer canaries (remote) |
| Owner tests named in REQ-EXP-22–28 and -30 (`src/date/DateTimePicker.test.tsx`, `tests/a11y/apg/date-time-picker.apg.spec.ts`, `src/components/file-upload/FileUpload.test.tsx`, `src/components/color-picker/ColorPicker.test.tsx`, `src/components/otp-field/OtpField.test.tsx`, `src/data/table/Table.reorder.test.tsx`, `src/data/table/Table.edit.test.tsx`, `registry/items/media-transcript/media-transcript.test.tsx`); media rows use the owner's tests (`MediaScrubber.test.tsx`, `Waveform.test.tsx`, `ImageViewer.test.tsx` per REQ-MED-23/-35/-40) | the contract in each REQ | owner lanes |
| `tests/perf/browser/registry-blocks.spec.ts` | §16 block rows: per-block bytes, ≤3 backdrop-filters, ≥50 fps, 0 long tasks >200 ms (SC-30 perf path, driven by PERF-039) | L10 Performance (remote) |
| Manual matrix rows (§15.9) | recorded against A11Y's `tests/a11y/manual/sr-record.schema.json` (A11Y-084) | L13 Manual SR |
| Remote capture of every new block story (DoD 8) | human review of 8 scenes × viewports | L14 Human visual review |

All Playwright and performance specs run remotely (CI or remote runner), never on a developer Mac.

---

## 13. Storybook requirements

1. `src/stories/capability/CapabilityRoadmap.stories.tsx` renders the ledger as a filterable table (area, priority, owner, release, form, status) read at build time from `docs/auraglass-5/capability-ledger.json`, with a link per row to the owner component's story or registry block story. It shows the rejected rows in a separate "Rejected novelty" tab with reasons. It contains no hard-coded counts (counts computed from the JSON).
2. Each registry block or item in §8 has a story file in DX's `src/stories/blocks/<Name>.stories.tsx` directory (DX-097 owns the directory, OV-29; already matched by the `../src/stories/**` glob in `.storybook/main.ts`, so no Storybook config edit), importing from `registry/blocks/<id>/` or `registry/items/<id>/` with no copies, with at least: `Default`, `Empty` (no lines / no comments / no users), `Loading` (where async), `RTL` (`dir="rtl"`, locale `ar-EG` or `he-IL`), `ReducedTransparency`, `ForcedColors`. Stories use product-realistic copy (no "Lorem", no "Demo") and run under SB's single `StoryEnvironment` decorator and `environment` global (SB-048; the 8 SC-28 scenes), never an opaque stage.
3. Every row whose form is `part` or `prop` adds a named story to the **owner's** story file (for example `Combobox/Autocomplete`, `Popover/HoverIntent`, `Toast/History`, `Alert/Banner`, `MediaControls/Scrubber`), so the capability is visible and baselined. The ledger `names` field references the story id; `delivery.test.ts` checks that the story id exists in `storybook-static/index.json` of the CI build.
4. No story for a rejected family exists after 5.0-beta (rg over `src/**/*.stories.*` for the X-R names returns 0).

---

## 14. Responsive requirements

Viewports: 390, 768, 1024, 1440, 1920 CSS px (the §15.1 matrix uses 390 and 1440; blocks add 768 and 1024 because they are page compositions).

1. `PricingTable`: ≥1024 px, plans in one row; 768 px, two columns; 390 px, a single column with the period `SegmentedControl` sticky at the top. `PlanComparison` at 390 px keeps `<table>` semantics and scrolls horizontally inside a `ScrollArea` with the first column sticky (`position: sticky; inset-inline-start: 0`), never converting to cards (preserves header association).
2. `commerce-cart`: ≥1024 px, lines and `CartSummary` side by side (summary 360 px); <1024 px, summary below lines and the CTA in a sticky bottom bar with `padding-bottom: env(safe-area-inset-bottom)`.
3. `CheckoutSteps`: ≥768 px horizontal; 390 px compressed to "Step `n` of `m`: `label`" with the full list available in a `Sheet`.
4. `PresenceStack`: `max` reduces to 3 below 390 px container width (container query on the block root, not viewport).
5. `CommentThread`: avatar column collapses below 360 px container width; composer stays visible above the virtual keyboard (`interactive-widget=resizes-content` documented for Next apps).
6. `audit-log` / `permissions-matrix` (5.2): `Table` virtualization stays on at all widths; at 390 px the filter controls move into a `Sheet` trigger.
7. All blocks: no horizontal page overflow at 390 px (the §15.2 mobile containment pixel gate), hit targets ≥44×44 CSS px on touch (`pointer: coarse`), ≥24×24 otherwise.
8. RTL (REQ-EXP-22): every responsive rule above uses logical properties so it mirrors without extra CSS.

---

## 15. Accessibility requirements

Floors are the architecture's (§6, §7) and PRD-05's; every addition meets them before its ledger row can become `delivered`.

1. **Contrast on every scene.** Text in new blocks and parts meets 4.5:1 (body), 3:1 (large text and non-text UI), measured by the §15.2 OCR pixel gate over all 8 environment scenes, worst case. No row may be delivered while it inherits E-29 (it must render on `Surface` with the legibility contract or on a content material).
2. **Preferences.** Under `prefers-contrast: more`, `prefers-reduced-transparency: reduce` and `forced-colors: active`, new surfaces drop to tinted/solid per the D-11 ladder; in forced colors, 0 visible backdrop-filters (CDP computed style) on every new block (today forced colors leaves 3 on the 3.2 app shell, 10 on `glass-modal` and 12 on the liquid-glass showcase, `autopsy/runtime-remote.md` §3).
3. **Keyboard.** Each new interactive part has an APG script in the owner lane: Combobox autocomplete (APG combobox with list autocomplete), `ColorPicker.Area` (2-D slider, REQ-EXP-25), `Scrubber` (slider + frame step), `ImageViewer` (dialog: focus trap, Escape, focus return), `DateTimePicker` (date grid + spinbuttons), `OtpField` (single input), `CheckoutSteps` (no roving; ordinary links/buttons), `PlanComparison` (table navigation by screen reader table commands).
4. **Semantics.** `PlanComparison` and `permissions-matrix` are real `<table>`s with scoped headers. `PresenceStack` is a `<ul>` with each avatar's name as text (not only `title`). `CommentThread` uses `<ol>`/`<article>`/`<time>`. `Waveform` is `role="img"` with a required `label` (REQ-MED-35). `Toast.History` is a `region` with a heading, not a live region (only new toasts announce).
5. **Announcements.** Upload progress announces at most at 25 % steps through the provider announcer (polite); completion and failure announce once. Cart quantity changes announce the new line total politely. Nothing in a new block uses `aria-live="assertive"` except `AlertDialog`-driven errors.
6. **Motion.** No new loop runs under reduced motion; `Waveform` `level` mode drops its transition to 0 s (REQ-MED-37); parallax/particles (labs) stop entirely.
7. **Targets.** ≥24×24 CSS px everywhere (WCAG 2.5.8), ≥44×44 under `pointer: coarse`.
8. **RTL and locale.** Number, currency and date strings come from `Intl` with the provider `locale`; screen-reader text in blocks is passed in through props with English defaults so apps can localise it.
9. **Manual.** Each 5.0 P0/P1 row that is a new interaction (X-12, X-14, X-16 at 5.1, X-24/25, X-32, X-33, X-38, X-44) appears in the §15.2 manual matrix (VoiceOver macOS/iOS, NVDA/Chrome, TalkBack/Chrome) before GA (or before its minor).

---

## 16. Performance requirements (numeric budgets)

Budgets are min+gz, peers external, measured in the L2 Artifact lane on the packed tarball, and calibrated at 5.0.0-alpha.1 alongside §3.6 (ratchet down only, D-26). Byte rows are submitted to PKG's single file `docs/size-budgets.json` (PKG-048, gate `scripts/ci/verify-size-budgets.mjs`, PKG-049; SC-15) by MODIFY; there is no `size-limit`. Runtime rows (fps, long tasks, layers) are submitted to PERF's `tests/perf/harness/budgets.json` (PERF-039). A row may be stricter than PERF's default ceiling, never looser.

| Import / surface | Budget |
|---|---|
| Ledger gate (`verify-capability-ledger.mjs`) run time on CI | ≤3 s |
| `{ Combobox }` with `mode="autocomplete"` | ≤ the PRD-08 `Combobox` line + 2 KB |
| `Popover` `openOnHover` | +0.5 KB over `{ Popover }` |
| `Toast.History` | +3 KB over `{ Toast }` |
| `Table` with `virtualize` | inside the §3.6 `{ Table }` ≤45 KB line |
| `{ FileUpload }` incl. `onUpload` | ≤ the PRD-14 owner line (`AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §16: ≤15 KB); the adapter adds ≤1 KB |
| `{ ColorPicker }` incl. `Area` | ≤ the PRD-14 owner line (≤20 KB); `Area` adds ≤2 KB |
| `{ OtpField }` (5.1) | ≤4 KB |
| `{ DateTimePicker }` (5.1) | ≤ `{ DatePicker }` line + 4 KB |
| `{ Waveform }`, `{ MediaScrubber }` | the PRD-13 owner lines (`AURAGLASS_MEDIA_BACKDROPS_PRD.md` §16); this PRD sets none |
| `{ Chart }` from `aura-glass/charts` (5.1) | ≤15 KB with d3 external (owner line `AURAGLASS_DATA_PRD.md:658` is binding); d3-scale + d3-shape together ≤20 KB counted separately |
| `Table` column reorder (REQ-EXP-27) | +1.5 KB over `{ Table }`, inside the §3.6 ≤45 KB line |
| Each registry block (copied source, compiled with its AuraGlass deps external) | `commerce-cart` ≤6 KB, `commerce-checkout` ≤6 KB, `pricing` ≤5 KB, `presence-stack` ≤2 KB, `comment-thread` ≤4 KB, `audit-log` ≤6 KB, `permissions-matrix` ≤4 KB |
| Visible backdrop-filter layers per viewport in any new block story | ≤3 (map Workspaces target; vs 21–29 today, E-31) |
| Frame rate of new blocks under scripted hover + scroll, remote mid-tier mobile | ≥50 fps median, grade ≥C (§15.2); vs 12–23 fps for current overlays/shells (E-30, E-31) |
| Long tasks on load of any new block story | 0 tasks >200 ms; total blocking ≤150 ms (vs 49 long tasks totalling 4,056 ms for `glass-modal` desktop, E-30) |
| `Table` with 10,000 rows, virtualized | owner thresholds REQ-DATA-14 / AC-DATA-06 (≤31 `<tr>` at a 600 px container) are binding; this PRD adds none |
| Spatial labs residents | §4.5: ≤4 ms main thread p95, ≤1 extra layer, 0 rAF when hidden |

Root export count: ≤160; total ≤250 (REQ-EXP-07).

---

## 17. Acceptance criteria

- **AC-EXP-01** `docs/auraglass-5/capability-ledger.json` exists with 58 capability rows and 13 rejected rows; `npm run verify:capability` exits 0 on `main`.
- **AC-EXP-02** Each of the 5 negative fixtures makes the gate exit 1 and name the offending row id (5/5).
- **AC-EXP-03** At `5.0.0-rc.1`, 100 % of 5.0 P0 rows (15) and P1 rows targeted at 5.0 are `delivered` and resolve in the packed tarball (`delivery.test.ts` green).
- **AC-EXP-04** At GA: root value exports ≤160, total ≤250, ledger count = manifest count, ≥1 root and ≥3 subpath slots free.
- **AC-EXP-05** 0 of the 12 alias names in REQ-EXP-08 are value exports in any subpath.
- **AC-EXP-06** `auraglass/no-simulation` reports 0 violations in `src/date`, `src/data`, `src/ai`, `src/media`, `src/app-shell`, `src/charts` and the §8 T2 files; `no-network.test.ts` finds 0 network calls in AI/commerce/workspace entries.
- **AC-EXP-07** Every row owned by another PRD has ≥1 `reqRefs` id present in that PRD's file; the 5 still-open gap rows (REQ-EXP-21: X-07, X-16, X-19, X-25, X-26) each have an owner REQ before the owner's Wave-4 start.
- **AC-EXP-08** `tests/a11y/rtl.spec.ts` passes on Chromium, WebKit and Gecko with 0 axe violations.
- **AC-EXP-09** At 5.1.0: `aura-glass/charts`, `DateTimePicker`, `OtpField`, `Waveform`, `Table` inline edit, RI `media-transcript` and the commerce/presence/comment/Kanban/Gantt/TransferList registry items are `delivered`; every block renders in the Vite and Next 16 canaries with 0 console errors and 0 axe violations over all 8 scenes.
- **AC-EXP-10** Every new block meets §16: per-block size line, ≤3 visible backdrop-filters, ≥50 fps median and grade ≥C on the remote mid-tier profile, 0 long tasks >200 ms.
- **AC-EXP-11** OCR contrast gate: worst-case text contrast ≥4.5:1 for body text in every new block story over all 8 scenes (vs 266/342 failures on black today, E-29).
- **AC-EXP-12** Forced colors: 0 visible backdrop-filters in every new block story.
- **AC-EXP-13** 0 stories and 0 exports for X-R01–X-R13 names after 5.0-beta (rg over `src/**/*.stories.*` and the manifest).
- **AC-EXP-14** No spatial labs resident is admitted without passing all four §4.5 numbers; no core file imports `three` or `navigator.xr` outside `src/three/**`.
- **AC-EXP-15** The 5.0 and 5.1 release notes' "New capability" sections are generated from the ledger, and every listed row links to a CI artifact for the release SHA.
- **AC-EXP-16** Labs (interim PRD-21): `packages/labs/` exists with the REQ-EXP-37 shape; `verify-labs-admission.mjs` exits 1 on each of the 4 negative fixtures and 0 on the real package; no resident is published without a green admission run (REQ-EXP-38, -39).

---

## 18. Definition of done

1. Ledger, schema, gate script, negative fixtures and `verify:capability` script merged; gate runs in L1 Static and L2 Artifact on `main` and fails closed.
2. `auraglass/no-simulation` merged and enabled for every 5.0 subpath directory.
3. All owner PRDs (MAT, A11Y, FND, CTL, OVL, NAV, DATA, AI, MED, DX) reference their ledger rows by id, and all 5 open gap rows have owner REQs.
4. AC-EXP-01 to AC-EXP-08 and AC-EXP-11 to AC-EXP-15 met at 5.0 GA; AC-EXP-09 and AC-EXP-10 met at 5.1.0 (and at 5.2.0 for wave 2 blocks); AC-EXP-16 met before the first labs publish.
5. Registry blocks of §8 have source, tests, stories (6 states each), `registryDependencies`, size rows and canary renders.
6. `CapabilityRoadmap` story published in Storybook; docs roadmap page (DX, §16 PRD-20) generated from the ledger.
7. Rejected-novelty list published in docs with reasons; `doctor --v5` reports rejected 4.x imports with their X-R id.
8. Human review (§15.2 Manual) of every new block over the 8 scenes recorded as a CI artifact. Screenshots are reviewed by a person from the remote capture; nothing in this PRD is accepted on code review alone.

---

## 19. Dependencies

Cross-PRD task dependencies point at the owner's **anchor task** (SC-40); `PRD-xx` strings never appear in `depends_on` of `tasks/EXP.json`.

| Owner (key, §16 id) | What this PRD needs from it | Anchor tasks cited |
|---|---|---|
| REL (PRD-01) | change-class gate; `deprecations.json` schema (A-05, A-08, A-14, A-18, A-19); release notes; codemod id catalogue (SC-33); `publish-npm.yml` contract (labs publish) | REL-010, REL-033, REL-043 |
| TRUST (PRD-00) | root `deprecations.json` instance (SC-02) | TRUST-075 |
| PKG (PRD-02) | exports manifest (REQ-EXP-03/-07), `eslint-plugin-auraglass.js` + `eslint.config.js` wiring, `artifact.yml`, `docs/size-budgets.json` + gate, side-effect gate (labs), package map | PKG-005, PKG-015, PKG-042, PKG-048, PKG-049, PKG-073 |
| DS (PRD-03) | categorical palette tokens (presence colours) | DS-022 |
| MAT (PRD-04) | `Surface` legibility contract (X-01), content materials, layer model (X-56); cinematic engine contract (X-58) | MAT-047 |
| A11Y (PRD-05) | `AuraGlassProvider` (A-02 home; owner of X-07 `dir`/`locale`), announcer, APG harness, manual SR schema | A11Y-029, A11Y-054, A11Y-073, A11Y-084 |
| FND (PRD-07/14/16) | Base UI pin and parts registry (X-02, X-03, X-07 wiring); T2 `FileUpload`, `ColorPicker`, `AvatarGroup`, `Card`, `Form`, `ScrollArea`, `OtpField` 5.1; removal (X-R deletions) | FND-001, FND-005, FND-050, FND-060, FND-077, FND-081, FND-082, FND-083, FND-103 |
| CTL (PRD-08) | `Combobox`, `SegmentedControl`, `NumberField`, `TextField`, `Checkbox`, `Slider` (X-04, X-09, X-11–X-13); consumed by blocks | CTL-029, CTL-047, CTL-081, CTL-089, CTL-095, CTL-109 |
| OVL (PRD-09) | `Popover openOnHover`, `Toast.History`, `Menu`, `AlertDialog`, `Sheet` (X-10, X-20–X-22) | OVL-063, OVL-097 |
| NAV (PRD-10) | `ResizablePanels`, `Inspector`, `CommandPalette`, `Breadcrumbs` (X-08, X-44, X-45); `recipes.ts` removal | NAV-078, NAV-101, NAV-136 |
| DATA (PRD-11) | `Table`, `FilterBar`, `DateRangePicker`, `ChartFrame`, `Chart` 5.1, `TimePicker`, `DateTimePicker` 5.1, `useFilterModel` (X-14–X-16, X-24–X-29) | DATA-038, DATA-080, DATA-097 |
| AI (PRD-12) | X-31–X-36 | (rows only; no task dependency) |
| MED (PRD-13) | X-37–X-43 including `media-transcript` (REQ-MED-95) | MED-041 |
| DX (PRD-18/20) | registry schema (X-51), `registry/registry.json`, build, lint, render harness, block story directory, `doctor`, codemod engine, compat index, docs roadmap page | DX-041, DX-065, DX-067, DX-070, DX-094, DX-097 |
| QA (PRD-19) | lanes and `certify-pr.yml`, jest/Playwright configs, 8 scenes, OCR, canaries, remote runners | QA-001, QA-003, QA-018, QA-031, QA-038, QA-049 |
| SB (PRD-19) | `StoryEnvironment` decorator and `environment` global | SB-048 |
| PERF | `run-perf.mjs` and runtime budgets | PERF-039 |
| PKG canaries | Next 16 / Vite packed-tarball apps | PKG-120 |

Consumed by: DX (block registration, roadmap docs), every owner PRD (ledger row ids), MAT (labs residents' engines run under the REQ-EXP-38 gate).

---

## 20. Execution order

1. **Wave 1 (with PKG/QA start):** write `capability-ledger.schema.json` and `capability-ledger.json` from §4.2 and §4.4; land `verify-capability-ledger.mjs` with negative fixtures and `ledger-schema`/`verify-ledger` tests (REQ-EXP-01, -02, -06).
2. **Wave 1:** send each owner PRD its row ids and the 5 still-open gap contracts (REQ-EXP-22, -23, -26, -27, -28) plus the REQ-MED mapping of REQ-EXP-29; owners add `reqRefs` targets. Turn on `req-refs.test.ts` (REQ-EXP-20).
3. **Wave 2 (once PKG's manifest emits, PKG-005):** land `export-budget.test.ts` and `expansion-no-alias.test.ts` (REQ-EXP-07–09); land `auraglass/no-simulation` (after PKG-015) and `no-spatial-core` (REQ-EXP-10, -11, -32).
4. **Wave 3 (alpha, FND pattern proven):** calibrate §16 budgets with the remote perf lane alongside §3.6; submit rows to `docs/size-budgets.json`; freeze them.
5. **Wave 4 (flagships in parallel):** owners deliver P0 rows first in the map's P0 build order (X-01 → X-02/03 → X-20–22 → X-12/14 → X-08 → X-09 → X-24/25 → X-44 → X-31/32), then P1 rows; ledger statuses move to `delivered` per PR (REQ-EXP-05). Land `tests/a11y/rtl.spec.ts` (REQ-EXP-22).
6. **Wave 5 (beta):** `delivery.test.ts`, `no-network.test.ts`, `registry-only.test.ts` in L2 Artifact; `CapabilityRoadmap` story; remove stories of rejected families (AC-EXP-13). Registry `settings` block (X-55, 5.0 part) via DX (DX-078). Labs shell and admission gate (REQ-EXP-37–39) land before the first labs publish.
7. **RC-1:** AC-EXP-03 enforced at the tag; rows not delivered are moved to `deferred` with a 5.1 slot by owner decision (T1 may shrink to the P0 set rather than slip GA, §17 risk table), never silently dropped.
8. **GA:** AC-EXP-04 headroom check; generated "New capability" release-note section (REQ-EXP-35).
9. **5.1:** `Chart`, `DateTimePicker`, `OtpField`, `Waveform`, `Table` inline edit, RI `media-transcript`; commerce, pricing, presence, comment, Kanban, Gantt, TransferList registry items (AC-EXP-09, -10).
10. **5.2:** `audit-log`, `permissions-matrix`; first labs promotion review (REQ-EXP-40).
11. **Each later minor:** re-run the ledger report; promote registry items only with REQ-EXP-36 demand evidence.

---

## 21. Open items

Reconciliation against `prd/_shared-contracts.md` and `prd/_verification-remaining-concerns.md` (§EXP and the EXP-related MAT/AI/MED lines), 2026-10-06. Resolved here: registry layout (SC-32, `registry-src/` withdrawn); stale FND `HoverCard ≤15 KB` line (closed by FND O-10, SC-15); `{ Chart }` budget (≤15 KB, SC-38); Waveform release (5.1, SC-12; X-42, §4.3, A-14); REQ-EXP-27/28 vs MED (X-38/X-39 cite REQ-MED ids and this PRD has no competing signature, REQ-EXP-29); kill-switch and lens-map ownership (MAT interim, SC-37); PRD-18/PRD-21 not filed (DX holds PRD-18; this PRD holds PRD-21 interim, §5.7); SegmentedControl semantics (RadioGroup, SC-38); `no-simulation` plugin ownership (SC-16); block stories and harness names (SC-31, SC-32); APG path (SC-30); 3 of 8 gap rows closed (REQ-EXP-21).

| # | Item | Owner | How to close |
|---|---|---|---|
| O-01 | 5 gap rows still have no owner REQ: X-07 `dir`/`locale` (A11Y), X-16 `DateTimePicker`, X-25 `columnOrder`, X-26 inline edit (DATA), X-19 `OtpField` (FND) | A11Y, DATA, FND | Each owner adds a REQ adopting REQ-EXP-22/-23/-26/-27/-28 (tasks EXP-072..074 file the text); then EXP-076 flips `reqRefs` and `req-refs.test.ts` passes |
| O-02 | Architecture §3.2 omits `TimePicker`, `RangeCalendar`, `MediaScrubber`, `formatMediaTime`, and 5.1 `Waveform` | architecture owner | Apply errata E-04 (SC-12) |
| O-03 | Base UI direction-provider API (X-07) and Autocomplete part names unverified at the pinned version | FND | Alpha coverage check (D-13) after FND-001 pins `@base-ui/react`; record names in REQ-EXP-22's owner REQ |
| O-04 | MED §16 owner budget rows for `MediaScrubber` and `Waveform` not re-verified | MED | MED submits both rows to `docs/size-budgets.json` (PKG-048); §16 here cites them only |
| O-05 | `@auraglass` npm scope (D-23) unverified; labs package name depends on it | PKG / REL | Decision record in `docs/release/decisions/` before 4.2 (SC-13); REQ-EXP-37 uses the fallback otherwise |
| O-06 | MED REQ-MED-95 puts the `media-transcript` test inside `registry/items/media-transcript/`, while SC-30 and this PRD put registry unit tests in `tests/registry/` | MED (path), QA (SC-30) | MED moves the test to `tests/registry/media-transcript.test.tsx`, or QA amends SC-30 to allow tests next to registry sources; EXP-087 follows the outcome |
| O-07 | REQ-DX-45 asserts exactly 10 `registry:block` entries; the 5.1/5.2 blocks here make 13/15 | DX | Make `tests/dx/registry-blocks.test.ts` version-aware (10 at 5.0 GA, counts per minor) before EXP-060 lands |
| O-08 | The labs package had no PRD and no task in any fragment before this reconciliation | REL (program index) | Accept §5.7 as the interim PRD-21 contract, or file a labs PRD that supersedes §5.7 and takes over EXP-094..EXP-100 |
| O-09 | The SC-40 validator `scripts/release/verify-task-graph.mjs` does not exist yet; `tasks/EXP.json` was checked with an ad-hoc script | REL | Land the validator and run it over all fragments |
