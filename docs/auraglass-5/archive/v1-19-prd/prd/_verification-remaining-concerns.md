# Remaining concerns from PRD verification passes

## MOT
- Press compression scale 0.985 and the Card hover translate -1px still go beyond architecture §8/§5.3 ('the light response, not scale'). They are declared deviations, but someone has to decide them: architecture owner or PRD-08 human review.
- REQ-MOT-130 (≥55 fps median for Dialog in the software-raster harness, vs 12 fps for glass-modal today) depends on PRD-04 cutting live backdrop-filters to 3 or fewer. Unverified: simple stories reach a 60 fps median in that harness, but no Dialog with the new material has been measured.
- React <ViewTransition> availability (the architecture says '19.3') was not verified against current React releases; the detection-based design tolerates it either way.
- Four new codemod IDs (reduced-motion-initial, motion-imports, motion-props, motion part of tokens) and the experimental 4.2 aura-glass/motion are not in architecture §14.1/§14.2; PRD-18 and PRD-17 must accept them.
- The 4.1.1 cookie-consent and FPS-loop fixes are not in PRD-00's scope (AURAGLASS_TRUST_PATCH_4_1_1_PRD.md has no mention); this needs PRD-00's acceptance, otherwise they move to 4.2.
- Literal counts carried over from the autopsy (53 duration literals, 25 stiffness values, 78/44/63/54 Tailwind pulse/spin, 120 @keyframes) were not recounted; the REQ-MOT-61 ratchet baseline must be measured at 4.2.
- Base UI attributes assumed in §4.6 (data-pressed on Button, data-swipe-* on Toast, var(--transform-origin)) were not checked against the pinned @base-ui/react version; PRD-07 should confirm.
- Firefox 112 as the linear() Baseline floor and :active-view-transition support per engine were not re-verified; T12 checks this per engine at runtime.
- Line numbers not marked ✓ (for example GlassButton.tsx :833-840 in §2.4 vs :823-882 in §6) were taken from the autopsy and not each re-verified.

## MAT
- Arch §4.7 says 'only scale animates' for lens maps, which CSS cannot do. PRD-15 and the architecture owner must either accept static scale or specify a JS attribute-write path that is consistent with D-09 and REQ-MAT-53.
- The architecture itself omits the pseudo-element inherit rule for inherits:false properties (§4.4/§4.6). It should be corrected upstream so PRD-03 ladders and PRD-05 rungs set the properties on the host and rely on REQ-MAT-13a.
- The private attributes data-ag-sizeclass/-radius/-spacing/-inset are a deviation from arch §4.5. The architecture owner should ratify them, or choose inline style for non-Surface helpers.
- Extending D-28 to the [class*=glass-] fallback scoping in 4.2 needs owner and reviewer approval. Otherwise it slips to 5.0.
- Treating data-ag-backdrop=auto as not satisfying clear is an interpretation of D-12. It needs architecture confirmation, because compat maps 4.x `adaptive` to auto.
- The Fresnel threshold (≥12 levels) and the perf fps thresholds (55/50 fps) are design targets I chose or inherited. Neither is measured. They must be calibrated in the PRD-19 remote lane at alpha.
- Deviation note 1 (file name PRD-04-material-engine.md vs the assigned path) still depends on PRD-20 docs lint accepting both names.
- REQ-MAT-10 ScrollEdge has a prop named `style` with values soft|hard, inherited from arch §4.2. It collides with React's style attribute and should be renamed (e.g. `variant`/`edgeStyle`) at the architecture level.
- There is a residual overlap with PRD-15 on kill switches (arch §16 assigns them to PRD-15; kill-switches.spec.ts lives here). Acceptable as CSS-consumption testing, but ownership should be confirmed.
- I could not verify the visual claims or confirm the WebKit var()-in-prefixed-property issue. Both remain certification-lane items.

## PKG
- Architecture section 3.5 browser floors (Chrome 76/Firefox 103/Safari 9 prefixed) conflict with D-24 @layer: browsers older than Chrome 99/Safari 15.4/Firefox 97 get no styling at all. The architecture doc needs a correction, and PRD-04/PRD-19 need to acknowledge the REQ-PKG-96 baseline
- Architecture section 16 names the file PRD-02-build-packaging.md, and section 3.2 omits 18 of the 47 4.1.0 subpaths. The architecture should be updated to match the B17-B19 classification
- The ./tokens/json and ./tokens/manifest removal overrules PRD-01's B19 proposal ('kept unless PRD-03 says otherwise'). PRD-01 and PRD-03 must confirm, or PRD-03 must request a new ./tokens.json row
- The Performance PRD's REQ-PERF-04 names jest-environment-jsdom for entries only, while this PRD extends the gate to every dist file with stack attribution. PERF should reference the extended scope so the two specs don't drift
- REQ-PKG-24 hydration lint rules (no-random-in-render, no-dom-lazy-init) may overlap with PRD-00 hydration fixes and PRD-05 preference hooks. Ownership was not reconciled
- Next 16 dropping 'First Load JS' from build output and the React Compiler logger event names (CompileError/CompileSkip) come from memory and were not checked against current docs. Verify both before implementing
- The canary and transitive-count jobs depend on the remote runner egress CA, which expired 2026-09-27 (runtime-remote.md:166). They default to GitHub-hosted runners until PRD-19 renews it
- AC-PKG-09 (tarball ≤2 MB) is gating at alpha.1. That could fail if the real source tree is merged (step 9) before PRD-16 removals. It assumes unreachable files are not emitted (REQ-PKG-02)

## TRUST
- Ownership overlap with PRD-01. PRD-01 (AURAGLASS_RELEASE_MIGRATION_PRD.md §19/§20 step 1) says it builds release.yml, the api/ baseline and the 4.1.1 deprecations.json 'jointly'. Architecture §16 assigns those 4.1.1 instances to PRD-00. PRD-00 now states this; PRD-01 needs a matching edit, and I could not make it because only PRD-00 was in scope.
- PRD-01 contradicts itself. Its REQ-REL-25/§4.3 describe an 'empty-but-valid' docs/deprecations.json, but the same requirement says 'every §13.1 cut has an exception entry'. PRD-00 seeds entries; PRD-01 should drop the word 'empty'.
- PRD-01's exception enum (security|privacy|crash|legal) has no value for honesty cuts. PRD-00 maps the ContrastGuard and validateTextContrast entries to `security` for now. PRD-01 should add `honesty` or approve that mapping.
- PRD-02 (AURAGLASS_PACKAGING_BUILD_PRD.md) still names a second pack helper, scripts/ci/lib/pack.mjs (REQ-PKG-66), and the publish workflow publish-npm.yml (REQ-PKG-65). It should use scripts/ci/lib/npm-pack.js and release.yml instead.
- Still not verified, because nothing heavy may run on this Mac: the 2 stale-snapshot suite failures and the c07fd7111 fill 0.12→0.018 claim (only the 0.018 fill is in the autopsy), the 165 lint-error count, and the number of extra rules-of-hooks violations beyond the 109 regex hits. REQ-TRUST-09/-22 say these must be measured in CI first.
- The §16 performance budgets for depth-1 clone size (~2 GB now, ≤200 MB target) and for the tarball under REQ-TRUST-46 are estimates, not measurements. They need a CI measurement on the release SHA.
- The `exception` values in docs/deprecations.json and the REQ-TRUST-15 side-effect baseline (which covers soundDesign's capture-phase listeners, flagged in PRD-02 E-06) cannot be checked until PRD-01's schema and PRD-02's import gate exist.

## REL
- Cross-PRD numbering: the program assigns IDs that differ from architecture §16 (e.g. DATA=PRD-12 vs §16 PRD-11, DX=PRD-16 implements §16 PRD-18/20, STORYBOOK=PRD-17 vs §16 bridge PRD-17). This PRD cites §16 numbering throughout, and the program index must alias the IDs. §16 also still lists the file name PRD-01-release-governance.md (deviation 1).
- There is no bridge PRD file for §16 PRD-17 (4.2/4.3) in prd/. REQ-REL-26/27 and much of the C-D install-level rule are 'implemented by PRD-17', and nothing owns that work yet.
- PRD-00 (AURAGLASS_TRUST_PATCH_4_1_1_PRD.md) was not edited. Its seed schema (fields reason/class/status, kinds attribute/asset) is only reconciled through this PRD's migration script. PRD-00 REQ-TRUST-08's guard checks only GITHUB_ACTIONS, and this PRD tightens it later.
- The claim that npm OIDC trusted publishing cannot run `npm dist-tag add` comes from my knowledge of npm and was not tested here. If npm now supports OIDC dist-tag operations, the manual runbook steps (v4-lts at GA, rollbacks) could move back into the workflow.
- The C-D (install-level) rule is a deliberate stretch of the 'no behaviour change' definition of C-D so that architecture §14.1's 4.2 dependency diet passes. Consumers with undeclared transitive imports still break at 4.2 (the named install error only makes the break explicit). The release owner should explicitly accept this, or defer the move to 5.0.
- Proposals B17–B19 (styles/tokens css renames, granular primitives collapse, icons per-glyph, utils/env removal) are unconfirmed. They depend on PRD-02/PRD-03, and architecture §3.2 has not been updated.
- Inventory drift: the inventory gives 131 root-exported REMOVE+DEPRECATE (153 REMOVE overall), while architecture §13/§14.4 says 119/145 from the 477-record pass. The gate counts from the snapshot, but architecture §14.4/§14.5 B3 still hard-codes 119.
- REQ-REL-17 required-check names (Glass Quality Gates, Next.js npm Integration, Vite npm Integration) match glass-pipeline.yml job names at HEAD. If PRD-00/PRD-02 rename those jobs, they will drift.
- The visual tolerance (pixelmatch threshold 0.1, >0.1% of pixels changed) is this PRD's own number. Architecture §15.2 only says 'past threshold', so PRD-19's pixel-regression lane must adopt the same value or reference this one.
- The §2.4 downstream grep was re-verified for /Users/gurbakshchahal/AuraOne only: 0 imports, two 3.1.1 pins. Other platforms/* checkouts are still unscanned until REQ-REL-40 runs.

## DS
- PRD-00 (trust patch) does not list the getPersona type removal or the --glass-opacity-24/32/52/72 fix. This PRD now says it executes them on PRD-00's 4.1.1 train, but the trust-patch PRD has to add them to its scope or they slip to 4.2.
- PRD-06 REQ-MOT-01 names tokens/motion.tokens.json and this PRD names tokens/sys/motion.tokens.json. PRD-06 needs a matching edit; I was only allowed to edit this file.
- The accessibility PRD (REQ-A11Y-15) uses 'backdrop' to mean the white/black/busy composites, while this PRD and the architecture use it for the declared data-ag-backdrop axis (light/dark/media) plus the composites. The terms need reconciling in the accessibility PRD. Cell counts may differ between the two documents.
- Aggregating floors as the max across presets, schemes and variants per (transparency, thickness, backdrop) satisfies PRD-04's keying. It may produce higher-than-needed floors for light presets. This is a design tradeoff to confirm with the PRD-04 owner, and it is not stated in the architecture.
- The preset blocks inside tokens.css replace a separate presets.css. This is a new deviation needed to match PRD-02's CSS list, and it is not recorded in the §10 D-A..D-E deviation list.
- The DTCG '2025.10' format version, the shadcn CLI v4 cssVars schema and the browser version floors come from research docs and public data. I did not re-check them live.
- The 4.2 dark-text (navy) fix through tokens/legacy is only loosely specified: it doesn't say which legacy --glass-* values change, or how the frozen-fixture diff confirms exactly that one labelled change.
- REQ-DS-41 deletes src/styles/premium-typography.css and keyframes.css. Ownership of non-token content in those files (typography rules, keyframes) is unclear across PRD-04, PRD-06 and PRD-02.
- The literal baseline count of about 1,890 is from architecture §15.2 and was not re-measured. The first gate run will set the real baseline.

## PERF
- Tightening requests need sign-off from the owner PRDs before Wave 3, or this PRD's numbers silently lose. PRD-02: 64 B bare import, 6 KB subpath CSS, requestIdleCallback/Storage traps, the x1.10 ceiling assertion, extra .size-limit.json rows, and allowedImporters globs. PRD-04: nesting-depth and allowNested thresholds in surfaceCounter. Those PRDs have not been edited, since only this file was in scope.
- PRD-02 REQ-PKG-01 deletes the direct esbuild devDependency. tests/perf/tree-shake-zero.test.ts and REQ-PERF-08 must therefore bundle through size-limit's @size-limit/esbuild or PRD-02's build tooling. That is stated for REQ-PERF-08 but not verified against PRD-02's final toolchain.
- PRD-02 REQ-PKG-33 measures Node import as a median of 10 runs on GitHub ubuntu-latest (Node 22), while REQ-PERF-09 uses 11 cold-cache runs on Node 20.19 and 22 on a remote runner. Both gates are kept, but they can disagree. One canonical method should be chosen.
- The program PRD numbering is inconsistent: this file is 'PRD-07', but architecture §16 uses PRD-07 for foundation, and sibling files renumber PRD-08..19. §19 dependencies use architecture numbering, which is correct but confusing. AURAGLASS_QA_CERTIFICATION_PRD.md (the PRD-19 boundary) is a 71-line stub with no perf-lane content, so the harness/lane split cannot yet be checked against it.
- REQ-PERF-36 runs all 44 flagships on a GPU runner for every PR that touches src/**. Its cost and runtime are unquantified and PRD-19 must size the runner pool. GPU-runner availability (g5/g4dn quota) and Device Farm / mac1.metal access have not been verified on the AWS account.
- The BCI budgets (2.0 / 1.2) and the 'the 4.1 modal is >=2.4' estimate are design targets, not measurements: the remote evidence has no per-element area data. REQ-PERF-38 calibrates them at alpha.
- REQ-PERF-35 targets >=50 fps on software raster for Dialog and AppShell successors. It is plausible from the 1-surface/24 px stories at 57-60 fps, but nothing measured yet backs it, and the 40 px single-surface case reached only 40-42 fps.
- §7 per-component budgets (Popover/Tooltip/Menu/Toast grade >=A, Switch grade A, Table 10,000-row p95 <=16.7 ms) are not cross-checked against the overlay, controls and data PRDs' own numbers. Those PRDs should reference or match them.
- AC-PERF-15 targets 0 backdrop filters under forced colors. The 4.1 evidence is glass-modal 12->10, app shell 21->3, liquid-glass showcase 12->12, and that work is owned by PRD-05's a11y rungs, so this AC depends on PRD-05.

## AI
- Every existing path named in §2/§6/§9 checks out with rg/test -e at HEAD, and the cited line ranges were spot-checked: src/index.ts exports, GlassChat/GlassChatInput/GlassMessageList/GlassTypingIndicator lines, and package.json `openai`/`@google-cloud/vision` lines. The evidence numbers also match autopsy/runtime-remote.md: 266/342 on black, median 1.92:1, 20/342 on busy, chat named among the busy failures, 0 console errors. Inventory scores and dispositions match component-inventory.json, except that §7 omits GlassCombobox's CONSOLIDATE disposition (it lists only the score 4.5).
- PRD id numbering: this file calls itself PRD-13 while architecture §16 PRD-13 is media/backdrops. Other PRDs use the same orchestrator-renumbering pattern and the header explains it, but cross-PRD references in the program stay error-prone until the numbering is reconciled.
- The AI SDK `UIMessage` shape, the approval states (`approval-requested`/`approval-responded`/`output-denied`) and the `approval` field are flagged unverified in §4.2. They must be confirmed against a pinned `ai` devDependency before REQ-AI-03/-32 can be considered final.
- The `aria-busy` inside `role=log` screen-reader behaviour (§4.5) is unresolved until the manual VoiceOver/NVDA/TalkBack matrix runs. The fallback is specified, but the decision is still pending.
- Perf budget 'p95 frame time ≤16.7 ms on the 120 Hz desktop lane' accepts 60 fps-level frames on a 120 Hz display. That is consistent with ≥55 fps elsewhere but looser than the lane's refresh rate, and should be confirmed when PRD-19 calibrates the perf lane at alpha.
- Kiro Prism is exercised only with a mocked Prism (route.test.ts). No live end-to-end smoke of the ai-workspace block against https://prism.auraone.ai/v1 is required, because that needs a CI-held PRISM_API_KEY and runs into the credential-handling policy. A gated, optional remote smoke would need an explicit decision from the owner.
- REQ-AI-15 and the purity script ban `scrollIntoView` globally. REQ-AI-14 `scrollToMessage(id, {block})` must therefore be implemented through `VirtualList.scrollToKey` or manual `scrollTop`; this is implied but not spelled out.
- AC-AI-19 (human visual review of specular quality and 'reads as one hand') stays subjective by design. That follows the architecture §15.2 manual lane, and it is the only non-numeric acceptance criterion.
- Reviewed file: /Users/gurbakshchahal/platforms/AuraGlass/docs/auraglass-5/prd/AURAGLASS_AI_PRD.md. Cross-checked against AURAGLASS_5_TARGET_ARCHITECTURE.md, AURAGLASS_DATA_PRD.md, AURAGLASS_PACKAGING_BUILD_PRD.md, AURAGLASS_COMPONENT_REMEDIATION_PRD.md and AURAGLASS_COMPONENT_EXPANSION_PRD.md.

## A11Y
- The Storybook PRD globals table has no glassOpacity global, and it uses value names (default, os, reduce) that differ from the provider API. This PRD now defines the mapping, but AURAGLASS_STORYBOOK_SHOWCASE_PRD.md has to add glassOpacity and should cite the mapping. I didn't edit that file because it's out of scope.
- Two contrast-matrix tests exist and both must stay. tests/tokens/contrast-matrix.test.ts (PRD-03) re-solves and compares the committed table. tests/a11y/contrast-matrix.test.ts (this PRD) recomputes independently from the built CSS. They are consistent with each other, but QA REQ-QA-29 only wires the PRD-03 test into the Token lane. The QA PRD should add the a11y test to that lane too.
- REQ-QA-18 runs axe per PR only on photo and flat-white. The nightly and RC 8-scene axe run that REQ-A11Y-42 now requires has to be added as a lane in AURAGLASS_QA_CERTIFICATION_PRD.md.
- Architecture §6 calls the coarse hit area 'a pseudo-element' and gives 105 focus:outline-none strings. The PRD documents its deviation (a span hit-area, because ::before and ::after are already used) and the verified count (109 via rg). The architecture text itself is still stale.
- Two items are still marked [verify] or [verify at alpha]: a Chromium switch to disable backdrop-filter for a browser-level REQ-A11Y-06 check (the static test is the binding gate), and Gecko forced-colors emulation in Playwright. Both need confirming on the remote runner's Playwright version.
- Finding-ID numbering differs between architecture/summary and autopsy/accessibility.md (crosswalk in §2.1). Other PRDs cite the summary IDs, for example ACCESSIBILITY-04 for prefers-contrast high and ACCESSIBILITY-16 for Accordion. Reviewers should use the crosswalk.
- The 4.2 and later dates (2026-11-16, 2027-01-18, 2027-02-15, 2027-03-22) are planning estimates taken from architecture §14. If the train slips, §20 has to be updated.

## OVL
- ID numbering: this file calls itself PRD-10, but architecture §16 calls the overlays PRD PRD-09. The App Shell PRD calls itself PRD-11, not §16's PRD-10. The program index still needs an alias table. The PRD itself is internally consistent (it uses PRD-NAV and §16 numbers elsewhere).
- Escape double-handling between Base UI's per-root dismissal and PRD-05 LayerStack is a real integration risk. PRD-07 has to choose the mechanism. Until it does, REQ-OVL-03 and T-OVL-STACK-01 depend on that choice.
- REQ-OVL-08 / data-ag-obscured and the provider toasts/tooltips opt-out props need PRD-05 to adopt them. Nothing in PRD-05 does yet.
- REQ-OVL-77 adds per-import size lines (AlertDialog 20, Sheet 24, Popover 14, Tooltip 10, Menu 22, Toast 14 KB) that architecture §3.6 does not list. The PRD declares this deviation, but PRD-02 must accept the lines. The 6 KB gz overlay CSS budget is also unsourced and provisional.
- The §16.1 absolute fps targets (≥45 fps software raster, ≥110 fps p50 on a 120 Hz GPU profile, ≥55 fps mid-tier mobile) and the long-task budget (≤2 tasks, ≤150 ms, none >80 ms) are design targets with no prior measurement. The GPU-backed 120 Hz perf profile depends on PRD-19 provisioning it.
- Inventory line counts for MobileGlassBottomSheet (105) and GlassTransitions.GlassModal (440) are component-span counts. The files are 649 and 895 lines. The figures match the inventory, but readers may take them as file lengths.
- E-31 cites API-CONSISTENCY-13 for feedback/GlassToast being React.FC. The autopsy supports this only through the aggregate FC/forwardRef counts, not a per-file finding. E-30 cites PERFORMANCE-11/-14, which point at dist/index.mjs:41996-42004. That is a build artifact and will drift on rebuild.
- REQ-OVL-29 says the enter transition has no long task over 50 ms. §16.1 allows up to 2 long tasks of ≤80 ms in the 5 s window after open. The two are compatible only if the window excludes the enter transition. The perf spec should state how the windows are split.
- REQ-OVL-05 (attributing the 4 infinite animations on glass-modal) has not been done yet (E-09). REQ-OVL-71's ≥30 fps target on 4.x stays unverified until that remote run.

## DATA
- Cross-PRD conflict to resolve outside this file: AURAGLASS_MOTION_PRD.md REQ-MOT-34 assumes a tweening AnimatedNumber inside StatCard, but this PRD makes StatCard a static Server Component
- Cross-PRD conflict to resolve outside this file: AURAGLASS_COMPONENT_EXPANSION_PRD.md gives { Chart } ≤22 KB vs ≤15 KB here
- prd/appendix/component-dispositions.md marks GlassTimelineRail (row 494) and GlassAdvancedDataViz (row 452) as 'compat'. This PRD's §9 gives TimelineRail no compat and puts no chart names in compat. The two documents need to be aligned
- Program numbering is still inconsistent: this file calls itself PRD-12, the AI PRD calls itself PRD-13, and the other PRDs refer to the data PRD as PRD-11. The header note defers reconciliation to the §16 table
- Architecture errata are still needed: §3.2 and §12 place Timeline/ActivityFeed differently from §11.2, §3.2 omits RangeCalendar/TimePicker, and the §11.2 #36/#37 roles differ from this PRD. The architecture maintainer owns these
- The §4.3 own-useGridKeyboard deviation from '§11.2 #32 RA grid mode' still depends on the pre-alpha spike (§20 step 2b); it is not yet evidenced
- The REQ-DATA-05 RAC peer range and the TanStack exact pins are deferred to the alpha allowlist PR, so their footprints are unmeasured (node_modules/@tanstack is absent at HEAD)
- Not checked: whether the 8-scene, OCR-gate and perf-harness capabilities used by REQ-DATA-48/57 and §16 exist yet. They depend on PRD-19 and PRD-03 lanes that are not built

## CTL
- Cross-PRD conflict, unresolved: architecture §11.1, AURAGLASS_COMPONENT_REMEDIATION_PRD.md rows 24–25 and appendix rows 227/230/252 assign Field, Fieldset, GlassFieldGroup, GlassFormField and GlassValidationMessage to PRD-14. This PRD claims them (§4.5) because architecture §11.2 row 9 and PRD-11 depend on 'the PRD-08 field shell'. The program owner must update the remediation PRD and the appendix (I could not edit those files).
- Cross-PRD conflict, unresolved: the remediation PRD lists ToggleGroup as 'multi, T2, PRD-14', while this PRD ships ToggleGroup in flagship 3, following architecture §11.2 row 3 and §6.
- REQ-CTL-40 keeps SegmentedControl on Base UI RadioGroup, which deviates from architecture §11.2 ('BU ToggleGroup (radiogroup semantics)'). The expansion PRD's X-09 also says ToggleGroup. The deviation is stated with evidence, but the architecture and expansion PRD were not updated.
- Several specific Base UI behaviours depend on the pinned Base UI version and are unverified: Combobox Chips/ChipRemove, Autocomplete, NumberField ScrubArea, Alt-key smallStep, the 400ms/60ms auto-repeat constants, Toggle and Switch element types, CheckboxGroup parent cycling, and Toolbar.Input. They must be confirmed in the §20 step 1 entry gate.
- REQ-CTL-66 (`onValueChange` at most once per frame during drag) needs an AuraGlass coalescing wrapper on top of Base UI Slider. This fits awkwardly with REQ-CTL-65's 'no per-frame React state beyond Base UI's'.
- Most §16 size and runtime budgets (everything except Button and Select) are proposed numbers, not measured. They stay unvalidated until the alpha remote perf calibration.
- The GlassSwitch shimmer removal in 4.2 needs PRD-17 to add it to the D-28 visual-fix list. No sibling PRD currently claims it.
- Mappings for GlassSearchInterface, GlassIntelligentSearch, GlassMentionList, GlassCommandBar, GlassActionBar and LiquidGlassMapControls are mostly TODOs because their 4.x feature surface (results, facets, AI, placement) has no 1:1 control equivalent. I did not read their source props in depth, so the PRD-18 tables still need those per-prop rows.
- The PRD-number crosswalk remains confusing: this document's header calls itself program PRD-09 / architecture PRD-08, and the remediation PRD is program PRD-08. Sibling PRDs use mixed numbering.

## NAV
- PRD numbering is unresolved. This file calls itself PRD-11 while architecture §16 names this boundary PRD-10, and sibling PRD files use inconsistent self-ids (DATA says PRD-12, CONTROLS says PRD-09, and so on). The program index needs one alias table. The PRD notes the alias but cannot fix it alone.
- The two 4.1.1 fixes (escaping the GlassCommandPalette regex input, E-22; the GlassWorkspaceTabs DOM prop leak, E-15) appear nowhere in AURAGLASS_TRUST_PATCH_4_1_1_PRD.md. PRD-00 has to accept them or they slip to 5.0.
- The performance PRD's REQ-PERF-19 allows 4 blurred shell surfaces and counts StatusBar as blurred. This PRD allows at most 3 (fine pointer) with StatusBar as content-sunken. That is stricter and compatible, but the performance PRD should be changed to 3 with no StatusBar blur so there is one source of truth.
- Performance PRD line 536 budgets `{ AppShell }` all slots at ≤15 KB, while §16.1 here budgets client JS (toggles plus drawer) at ≤12 KB. The two measure different things, but PRD-07/perf should decide which row sits in `docs/size-budgets.json`.
- Not verified: that Base UI exposes active-tab CSS variables for the indicator fallback, that Base UI Combobox supports inline-list mode (REQ-NAV-58), and that `animation-timeline: scroll()` is a sufficient guard for minimizeOnScroll in WebKit and Gecko. These need checking at alpha.
- REQ-NAV-10, AC-NAV-16 and REQ-NAV-20: the toggle's post-hydration ARIA update and the medium-container drawer behaviour need a design-review decision on whether a toggle at 600–1023px should open a modal drawer or expand inline over Main.
- S-01 story display names vs export names (`Saas`, `AiCommandCenter`) must be matched against the PRD-19 subject list and the storybook-showcase PRD. I did not open those files' subject tables.
- Screenshots in autopsy/remote-evidence were not viewed. The visual claims rest on the metrics JSON, and the Manual lane is still the gate.

## FND
- The appendix generator still holds the old mappings, and I could not edit it under the write-only-this-file rule. In docs/auraglass-5/prd/appendix/gen-component-dispositions.mjs, line 184 still maps GlassHoverCard to C('HoverCard','PRD-14'), and lines 138-140 still give the Field-family owner as PRD-14. Until someone edits and regenerates it, component-dispositions.md shows core 41 / compat 152 instead of the post-fix 40 / 153. `--check` passes today against the old mapping.
- AURAGLASS_ACCESSIBILITY_PRD.md (PRD-05) lines 465-467 and 512 claim `this PRD` for DismissableLayer and VisuallyHidden, but architecture §16 gives the KEEP primitives to PRD-07, which is this document. One of the two files needs a matching edit; this PRD now says it consumes PRD-05's LayerStack.
- Spec paths are split across the program: some PRDs use tests/e2e/apg/<name>.spec.ts, PRD-05 uses tests/a11y/apg/<component>.apg.spec.ts. The program needs one convention.
- AC-FND-02 asks for a React 19 unit run on 4.1.1. The 4.x repo develops on React 18.2, so this needs PRD-00 to add a React 19 test matrix to the 4.1.1 branch. That is not confirmed.
- REQ-FND-07's 0-hit check (`rg asChild` over src/) also catches comments and docs. It may need an AST-based check instead.
- The Base UI parts Accordion, Avatar, Meter, Progress, Separator and Form are still marked [verify at pin]. Their existence in the pinned @base-ui/react version was not checked (no network lookup was done).
- The 4.3 deprecation entries that RM PRs depend on (PRD-17, and the PRD-01 schema) were not cross-checked for every name in the 234 removed and 22 registry/labs rows.
- The consumer grep of other platforms/* repos and of GitHub is still pending, as the PRD itself states.

## SB
- The sibling PRDs need matching edits; I could only change this file. PRD-04 (Material Engine PRD §13) must use the .storybook/lab/** harness and the REQ-SB-18 order, and drop its 'no provider dependency' note. The Media PRD's REQ-MED-77 uses .storybook/assets/scenes/**, which conflicts with REQ-QA-10's certification/scenes/. The AI, Data and Media PRDs must put the S1-1, S1-2 and S2-1 compositions at showcase/<name>/. The App Shell PRD says it rewrites src/stories/AppShell.stories.tsx, while this PRD deletes it.
- Deviation 1 still departs from architecture §16, which puts the Material Lab under PRD-19. The new split (PRD-04 writes the stories, this PRD writes the harness) needs the architecture owner to sign off, or §16 needs updating.
- The PRD ids don't match §16 numbering: this file says PRD-17 (§16's 4.2/4.3 bridge), and the QA PRD calls itself PRD-18 where §16 says PRD-19. Every PRD needs a crosswalk index.
- REQ-SB-47 (resolving `aura-glass` through the exports map plus a workspace self-reference) and REQ-SB-23 (building against the packed tarball) depend on PRD-02 decisions not checked here. Whether Storybook Vite can resolve the package by self-reference at HEAD is unverified.
- REQ-SB-52 assumes GitHub Release assets as the store for old Storybook versions and that Pages can be pointed at the cname with deploy-pages. Neither is checked against the repo's current Pages settings.
- The Cloudflare Pages project `auraglass-storybook` and its repo secret do not exist yet. Until they are provisioned, previews are skipped by design.
- The flagship-count acceptance items (44/44 Keyboard stories, 44 MDX docs pages, the S1 union) depend on PRD-08..14 delivering typed variant metadata, data-ag-part roots and APG specs for every flagship. If any flagship slips past RC, these items fail. That is intended, but it puts this PRD's GA on the critical path.
- The ESLint rules no-ink-override and no-stage-background need type or JSX ancestry analysis to know what is 'a library component or its ancestor'. The PRD does not say how the rule identifies library components, for example by import source `aura-glass*`. Implementers will need to pin that down.
- The ≥110 fps desktop and ≥55 fps mobile showcase budgets are uncalibrated targets. §4.7 and the Performance PRD calibrate budgets at alpha, so these may change.

## DX
- Cross-PRD conflict this PRD cannot resolve: PRD-01 §11.2's prop-grammar example rewrites `<Button variant="primary">` to `variant="regular" ... prominent`, while Controls PRD REQ-CTL-21 keeps Button `variant: primary|secondary|ghost|danger` and adds a `material` prop. PRD-01 or the Controls PRD must change before the prop-grammar fixtures can be written
- deprecations.json location is unresolved between PRD-00 REQ-TRUST-51 (`docs/deprecations.json`) and PRD-01 note 4(b) (repo root). PRD-00 and PRD-01 must settle it before 4.1.1
- API report manifest location: PRD-00 REQ-TRUST-50 uses `api/manifest.json`; PRD-01 REQ-REL-04 uses `etc/api/manifest.json`
- Frozen 4.x fixture path: PRD-19 REQ-QA-39 `certification/canaries/frozen-4x/` vs PRD-01 `tests/fixtures/consumer-4x/`
- The AI PRD still says ai-eval-dashboard is registry:block, spells the TODO `TODO(auraglass-5)` and uses non-canonical codemod/compat paths. Those edits belong in the AI PRD; this PRD only records the deviations
- PRD numbering: the header calls this doc PRD-16, which collides with architecture PRD-16 (removal). The note explains it, but the orchestrator should rename it to the PRD-18 + PRD-20 split or a non-colliding id
- Header boundary is wider than architecture §16: it claims both PRD-18 and PRD-20. REQ-DX-72 deletes 4.x docs while §19 also assigns 4.x docs deletion to PRD-16, so one owner must be chosen
- Some gates depend on unverified externals: the npm scope `@auraglass` (D-23), the auraglass.dev domain and hosting, the shadcn v4 `registry:base` schema details (the vendored schema hash is not yet recorded), and the PRD-19 remote capture endpoint contract for `audit backdrop`
- Numeric budgets (CLI ≤15 MB, cold start ≤300 ms, codemod ≤60 s / 2,000 files, block JS ≤60 KB, Lighthouse) are design targets that have not been measured. Only the block JS budget is explicitly marked for alpha calibration
- The Storybook PRD says showcases are lifted into registry blocks, while REQ-DX-53 says blocks are authored new. These are compatible if showcases are public-API-only, but the source of truth for block files should be stated in one PRD

## EXP
- Cross-PRD (cannot fix from this file): AURAGLASS_COMPONENT_REMEDIATION_PRD.md §16 still has a HoverCard ≤15 KB budget line and a HoverCard item in its execution order, although its own REQ-FND-36 and the Overlays PRD say there is no HoverCard export. REQ-EXP-08 here will enforce 'no HoverCard'. The Remediation owner should remove the stale lines.
- Cross-PRD: there are three registry source layouts (registry-src/<id>/ here, registry/ai/ in AI PRD REQ-AI-41, registry/blocks/*.json as built output in the App Shell PRD line 485). PRD-18 is not filed yet and must choose one. The registry-src/ paths here are provisional.
- PRD-18 (CLI/registry) and PRD-21 (labs) are not filed. The REQ-EXP-13 to -19 registry contracts, the blocks-lint/blocks-render harness and the labs admission check depend on documents that do not exist yet.
- Owner PRDs still have to add REQs for the 8 gap rows (X-07 to PRD-05; X-16, X-25 reorder and X-26 edit to PRD-11; X-17, X-18 and X-19 to PRD-14; X-43 to PRD-13). Until they do, REQ-EXP-20 req-refs only resolves to the REQ-EXP contracts here.
- §16 owner budget lines for MediaScrubber and Waveform were not checked in AURAGLASS_MEDIA_BACKDROPS_PRD.md §16. I only confirmed the section exists.
- §3.2 of the architecture does not list TimePicker, RangeCalendar, MediaScrubber, Waveform or formatMediaTime. Their owner PRDs record these as deviations. The architecture errata belong to the architecture owner, not to this PRD.
- Not verified: that the Base UI direction-provider API name (X-07) and the Base UI Autocomplete part exist at the pinned version. Both are deferred to the alpha coverage check (D-13).

## MED
- Waveform release (5.0 here vs 5.1 in Component Expansion X-42) is unresolved, and it changes the ./media export count (8 vs 7). The program index has to decide.
- Component Expansion REQ-EXP-27/28 (scrubber markers, ImageViewer images/index API, GlassGallery compat, test paths) contradict this PRD. That file has to be amended; it was not edited, per the rules.
- Five contract requests need to be accepted by other PRDs, plus PRD-04 confirming data-ag-media-tone: the --ag-scrim-media and --ag-duration-ambient tokens (PRD-03), the media scrim with blur 0 (PRD-09), REQ-MOT-T08 admitting ag-backdrop-drift (PRD-06), the data-ag-offscreen observer (PRD-05) and sample-media (PRD-18, which is absent from the DX PRD's CLI list).
- CarouselRail autoplay is gated only by the consumer prop plus motion=full, not by allowContinuous. Architecture section 8 says allowContinuous 'gates every loop'; whether timer-driven slide rotation counts as a loop needs a PRD-06 ruling.
- The PRD-05 announcer, the REQ-MOT-111 GlassPreferencesPanel allowContinuous switch and the Base UI Toolbar's ability to host Slider items with their own arrow semantics are assumed rather than verified. Base UI is not installed at HEAD, so the Toggle/Toolbar/Slider part names could not be checked locally.
- Section 16 budgets (14/2.5/6/2/24/5 KB, FPS and INP) are provisional design targets, not measurements, to be calibrated at alpha per D-26. The per-subpath CSS ceiling is 8 KB in REQ-PERF-10 vs this PRD's stricter 6 KB and 3 KB.
- Numbering mismatch: the file is assigned PRD-14 but sits in the architecture's PRD-13 slot. The program index still has to reconcile it.

## QA
- Conflict between sibling PRDs that I could not fix from this file: PRD-02 REQ-PKG-85 puts the frozen 4.x fixture at canaries/v4-frozen/, while PRD-01 §11.4 uses tests/fixtures/consumer-4x/. This PRD now follows PRD-01 (the contract owner); PRD-02 needs a matching edit.
- PRD-01 (§6 row) repurposes .github/workflows/visual-regression.yml as the base/head capture job, but this PRD deletes it and moves capture to certify-pr / regression. PRD-01's file needs a matching edit.
- REQ-QA-35 requires editing PRD-01's release.yml to add the certify-release.yml needs: and remove the glass-pipeline workflow_call. PRD-01 must accept this as a PRD-01-reviewed change.
- Not verified: that the repo is PUBLIC (§3 item 9, which decides whether GitHub-hosted runners can be used for PR code). I did not run gh, because shared-credential access would first require reading the reference file.
- Not measured: the capture rate on GitHub-hosted 4-vCPU runners. The shard count, and whether the 90-minute release budget is reachable under Option A, depend on the alpha calibration run. More than 100 shards may be needed, close to GitHub's 256-job matrix limit.
- L10 profile (a) needs a GPU instance type that the existing gated launch template (r7i) does not provide. Provisioning one may hit IAM denies, which would need an operator grant.
- Not confirmed: which engines support Playwright forced-colors and contrast emulation for the pinned Playwright version. The cell counts assume Chromium-only forced-colors; REQ-QA-17 read-back will catch any engine where emulation silently does nothing.
- REQ-QA-27's literal ratchet (about 1,890, in certification/ratchets.json) overlaps PRD-03's raw-literal gate, which ratchets to 0 by beta.1. One of the two should be the single owner.
- §11 item 1's estimate of '≈160–250 distinct visual components on 5.0' has no cited source in the autopsy.
- The ≤3 SR waiver allowance (REQ-QA-70) may be looser than PRD-05's issue-#16 closure rule, which requires all 44 flagships recorded. I added a 'stricter rule governs' clause, but the two PRDs should state a single rule.
