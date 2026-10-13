# size-budgets.changelog.md

Raise ledger for `fragments/size-budgets/*` rows and `transitiveCeiling`.
Every raise requires a row below plus commit trailer `Perf-Budget-Raise: <row id>`
linking the remote-measured delta that justifies it. After the D-26 calibration,
rows only decrease.

## Rows

| Date | Row | From → To | Remote-measured delta | Commit |
| ---- | --- | --------- | --------------------- | ------ |
| 2026-10-13 | Perf-Budget-Raise: mat:styles-css | 33792 → 35840 | measured 32775 B → 34695 B (gzip 9 over dist, verify-size-budgets.mjs method, local 5.0.0 build; confirm against the remote measurement). The css-a11y-pairing baseline (67 RC-1 rows) was burned down to empty for GA: 47 files gained genuine ag.a11y sibling sheets (forced-colors/reduced-motion rules, some relocated verbatim from the components layer) that ship in styles.css/data.css; stylesCssBytes ceiling follows 33792 → 35840. Inherent | main |
| 2026-10-13 | Perf-Budget-Raise: mat:styles-css | 32768 → 33792 | measured 29634 B → 32775 B (gzip 9 over dist, verify-size-budgets.mjs method, local build of consolidated main; confirm against the remote measurement). dist/styles.css now inlines the hand-authored MAT engine (properties.css, material.css, lens.css) alongside the generated ladders/floors it already carried: styles.css is documented as "the component and material CSS" and is the only sheet consumers load, but the engine shipped only in dist/material.css, leaving styles.css consumers with ladder variables and no host paint, ::before optics, or @property registry. stylesCssBytes ceiling follows 32768 → 33792. Inherent | main |
| 2026-10-12 | Perf-Budget-Raise: SidebarDrawer | 6144 → 16384 | measured 20 B → 14928 B. The row imported `{ SidebarDrawer }` from aura-glass/app-shell, which exports it only as Sidebar.Drawer, so it measured an empty re-export. The row now measures `Sidebar.Drawer` (Sidebar + CMP Sheet composition) with the verifier's method (esbuild bundle+minify, peers external, gzip 9 over dist). Meta `budgetKb` 6 → 16 follows (REQ-SURF-09). Inherent; confirm against the remote measurement | impl2/22 |
| 2026-10-12 | Perf-Budget-Raise: Chip | 3000 → 3072 | measured 854 B (no size change). S-44 re-keyed the SURF row to the Chip meta (`budgetKb: 3` → 3 × 1024); the duplicate CMP row (3000) is removed, SURF owns the id | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: KeyValueEditor | 15000 → 15360 | measured 3043 B (no size change). S-44 SURF row = meta `budgetKb: 15` × 1024; duplicate CMP row (15000) removed | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: mat:theme-fns-js | 3072 → 4224 | CI pass-1 7476 B → 4016 B after themeManifestInputs (full tokens manifest no longer bundled). Remainder is the OKLCH colour engine + contrast solver (color.ts, createGlassTheme, createBrandTheme): inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: mat:provider-usepreference-js | 4096 → 37440 | CI pass-1 39251 B → 35606 B (tokens manifest dropped). REQ-FIN-04 makes the provider register all five production mounts at render: LensDefs + lens-map data (~28 KB min of PNG data URIs, budgeted on its own by mat:lensdefs-markup), brand/preset css (createBrandTheme + presets, sync for SSR), pointer light, dev surface counter. Provider core alone (store, layer stack, portal root, announcer) measures 6474 B, already over the 4 KB MAT-371 target | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: LoadingState | 1500 → 1856 | CI pass-1 1719 B, now 1723 B: StateView's spinner is Progress + Skeleton + VisuallyHidden; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: aura-glass/primitives | 4000 → 4352 | CI pass-1 4087 B, now 4095 B: whole-entry row incl. the shared LayerStack (DismissableLayer/FocusScope); inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: DismissableLayer | 2000 → 2688 | CI pass-1 2507 B, now 2519 B: the layer stack (LayerStack + useLayer + layerInput, 4.6 KB min) is the dismiss/escape ordering model itself; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: Icon | 1500 → 1728 | CI pass-1 1593 B, now 1591 B: `Icon` resolves names through the 18-glyph registry; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: Breadcrumbs | 5120 → 9216 | CI pass-1 8618 B, now 8643 B: overflow collapses into Menu (+ layer stack, overlay animation); inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: TabBar | 5120 → 6144 | CI pass-1 5227 B, now 5258 B: TabBar.Search part embeds SearchField; inherent (Tabs dropped 8776 → 3790 B via panelRegistry, no raise) | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: FilterBar | 8192 → 18432 | CI pass-1 17364 B, now 17373 B: responsive editor = Popover (desktop) + Sheet/SheetHandle (mobile) + SearchField + ToggleGroup + announcer; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: ChartFrame | 5120 → 6144 | CI pass-1 5403 B, now 5387 B: reduced-motion read via the preference store; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: DatePicker | 8192 → 11264 | CI pass-1 10264 B, now 10285 B: Popover + Calendar + layer stack (react-aria peers external); inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: TimePicker | 6144 → 10240 | CI pass-1 9487 B, now 9501 B: Popover + hour/minute lists + layer stack; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: ActivityFeed | 4096 → 5120 | CI pass-1 4137 B, now 4163 B: Timeline + Avatar + Button actions; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: Thread | 18432 → 21504 | CI pass-1 20028 B, now 19924 B: VirtualList + MessageParts + ToolCall + SourceList + store; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: Message | 10240 → 17408 | CI pass-1 16635 B, now 16566 B: Message renders every part kind (text, tool call with approval TextField, sources, error); inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: StreamingText | 2048 → 6144 | CI pass-1 5686 B, now 5680 B: motion floor via useResolvedPreferences (provider-less default store) + announcer live region; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: ToolCall | 8192 → 10240 | CI pass-1 9641 B, now 9564 B: approval form (TextField) + state icons + store; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: SB-SURF-W4-MEDIA-CORE | 14336 → 18432 | CI pass-1 17154 B, now 16976 B: MediaControls (Menu, Slider, Toolbar) + useMediaElement tone sampling; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: MediaControls | 14336 → 18432 | measured 14092 B (no size change). REQ-SURF-09 meta coverage requires the MediaControls meta `budgetKb` to equal every row naming it, so it follows SB-SURF-W4-MEDIA-CORE ({ useMediaElement, MediaControls }) to 18 KiB | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: SB-SURF-W4-USEMEDIAELEMENT | 2560 → 4096 | CI pass-1 3746 B, now 3754 B: media store + frame ticker + backdrop tone sampling; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: ImageViewer | 10240 → 13312 | CI pass-1 12583 B, now 12599 B: Dialog + zoom/pan + tone sampling; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: Backdrop | 3072 → 7168 | CI pass-1 6267 B, now 6262 B: allowContinuous via the preference store + tone sampling; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: DateRangePicker | 8192 → 12288 | CI pass-1 10935 B, now 10940 B: Popover + RangeCalendar + presets; inherent | fix/r2-4 |
| 2026-10-12 | Perf-Budget-Raise: Table | 14336 → 19456 | measured 13286 B → 17792 B (local esbuild over src with the verifier's settings: bundle+minify, browser, same externals, gzip 9; the dist CI number replaces it on the first pipeline). REQ-SURF-79 inline edit: TableCellEditor (CMP TextField + NumberField + Select) behind React.lazy — a split consumer fetches it only for editable grids, the unsplit measurement inlines it; inherent | impl/10 |
| 2026-10-12 | Perf-Budget-Raise: ChartFrame | 6144 → 11264 | measured 5408 B → 10124 B (esbuild bundle+minify, peers external, gzip 9: the verify-size-budgets.mjs options, run over src; the same method gives 5408 B for the CI-measured 5387 B). REQ-SURF-94 / REQ-FIN-83 require CMP Tooltip for the last-series guard instead of a native `title`; CMP Tooltip alone measures 5066 B (overlay layer, portal container, material). Meta `budgetKb` 6 → 11 to match (REQ-SURF-09). Inherent; confirm against the remote measurement | impl/15 |
| 2026-10-12 | Perf-Budget-Raise: DatePicker | 11264 → 15360 | measured 10316 B → 14691 B. REQ-SURF-98 requires CMP Sheet side="bottom" below a 640 px container (DatePopup) instead of the Popover presented as a sheet; CMP Sheet alone measures 9946 B (detents, handle, layer stack). Method: esbuild bundle+minify, peers external, gzip 9 (the verify-size-budgets.mjs options) over src; it reads 10316 B for the CI-measured 10285 B DatePicker. Meta `budgetKb` follows (REQ-SURF-09). Inherent; confirm against the remote measurement | impl/15 |
| 2026-10-12 | Perf-Budget-Raise: DateRangePicker | 12288 → 16384 | measured ~10940 B → 15344 B. REQ-SURF-98 requires CMP Sheet side="bottom" below a 640 px container (DatePopup) instead of the Popover presented as a sheet; CMP Sheet alone measures 9946 B (detents, handle, layer stack). Method: esbuild bundle+minify, peers external, gzip 9 (the verify-size-budgets.mjs options) over src; it reads 10316 B for the CI-measured 10285 B DatePicker. Meta `budgetKb` follows (REQ-SURF-09). Inherent; confirm against the remote measurement | impl/15 |
| 2026-10-12 | Perf-Budget-Raise: TimePicker | 10240 → 14336 | measured ~9501 B → 13841 B. REQ-SURF-98 requires CMP Sheet side="bottom" below a 640 px container (DatePopup) instead of the Popover presented as a sheet; CMP Sheet alone measures 9946 B (detents, handle, layer stack). Method: esbuild bundle+minify, peers external, gzip 9 (the verify-size-budgets.mjs options) over src; it reads 10316 B for the CI-measured 10285 B DatePicker. Meta `budgetKb` follows (REQ-SURF-09). Inherent; confirm against the remote measurement | impl/15 |

| 2026-10-12 | Perf-Budget-Raise: plat:warnDeprecated | 150 → 5632 | first real measurement 5333 B gz (esbuild bundle+minify, peers external, gzip 9, NODE_ENV=production define; the verify-size-budgets.mjs options over src/internal). The row previously sat 'pending' forever ('aura-glass/internal' is not a manifest entry); with the REQ-PLAT-76 internal-row allowance it measures for the first time. esbuild eliminates the dev-only warnDeprecated body under the production define but retains the generated deprecations lookup table, so the PRD's 150 B is unattainable without restructuring warnDeprecated to register its table; that restructure is the remaining REQ-PLAT-76 work and this limit only ratchets down. cn measures 82 B gz against its unchanged 512 B row. Confirm against the remote measurement | impl2/24 |

| 2026-10-13 | Perf-Budget-Raise: Sidebar | 6144 → 16384 | measured 14985 B (local verify-size-budgets over dist; CI pass-8 read 14995 B). The Sidebar compound statically composes Nav (item tooltips), Collapsible and Drawer (CMP Sheet + handle + detents ≈ 8.4 KB min), the app-shell store and the layer stack; the 6 KiB provisional row predates that composition (SidebarDrawer alone was already raised to 16 KiB). Meta `budgetKb` 6 → 16 follows (REQ-SURF-09). Inherent; confirm against the remote measurement | fix5/c46-size-raises |
| 2026-10-13 | Perf-Budget-Raise: AppShell | 12288 → 18432 | measured 16637 B (CI pass-8: 16646 B). AppShell composes Sidebar + TopBar + the store/cookie state and layer integration; inherent. Meta `budgetKb` 12 → 18 follows (REQ-SURF-09). Confirm against the remote measurement | fix5/c46-size-raises |
| 2026-10-13 | Perf-Budget-Raise: Inspector | 8192 → 14336 | measured 13294 B (CI pass-8: 13286 B). Inspector carries the resizable-panel + surface stack; inherent. Meta `budgetKb` 8 → 14 follows (REQ-SURF-09). Confirm against the remote measurement | fix5/c46-size-raises |
| 2026-10-13 | Perf-Budget-Raise: MobileShell | 4096 → 18432 | measured 17179 B (CI pass-8: 17190 B). MobileShell composes AppShell + Sidebar + Sheet navigation; the 4 KiB provisional row never matched the shipped composition. Meta `budgetKb` 4 → 18 follows (REQ-SURF-09). Confirm against the remote measurement | fix5/c46-size-raises |
| 2026-10-13 | Perf-Budget-Raise: Message | 17408 → 19456 | measured 17865 B (CI pass-8: 17951 B). Message renders every part kind; growth since the 17408 calibration is part-kind coverage, inherent. Meta `budgetKb` 17 → 19 follows (REQ-SURF-09). Confirm against the remote measurement | fix5/c46-size-raises |
| 2026-10-13 | Perf-Budget-Raise: SourceTransition | 3072 → 4096 | measured 3137 B (CI pass-8: 3130 B): view-transition runtime + ticker + preference media reads; inherent. Meta `budgetKb` 3 → 4 follows (REQ-SURF-09). Confirm against the remote measurement | fix5/c46-size-raises |

Raises above: limit = measured × 1.05 rounded up to 64 B (KiB for SURF
rows, whose limit is the meta `budgetKb` × 1024 per S-44). "now" = the
verifier's own esbuild measurement (min+gz-9, peers external) against an
unbundled JS build of fix/r2-4; CI pass-1 = gitlab-ci-local run of 4b4c48f2e.

## D-26 calibration record

Pending — fires on the first pre-release where Button and Dialog carry no
`@ag-contract-seed` in their source closures. At that event: PLAT rows :=
`min(provisional, measured × 1.10)` and `transitiveCeiling` := measured
`npm install --omit=dev --omit=optional --omit=peer` count of the packed
tarball. The transitive leg is recorded only by
`node scripts/build/calibrate-transitive.mjs --write` in GitLab CI (it reports
`pending` while either trigger entry is seeded and refuses to raise the
ceiling); never edit the lines below by hand.

Machine-readable record (read by `tests/deps/transitive-count.test.mjs`, which
fails when the record is absent or the count exceeds it). Until calibration the
ceiling is the provisional beta floor the test enforced before REQ-PLAT-71:

transitiveCeiling: 64
transitiveCeilingStatus: provisional

