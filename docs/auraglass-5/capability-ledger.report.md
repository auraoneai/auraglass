<!-- capability-ledger:totals:start -->
Totals: 58 rows. By priority: P0 15, P1 27, P2 11, P3 5. By primary release: 5.0 45, 5.1 11, 5.2 0, 5.x/labs 2. 13 rejected rows (X-R01..X-R13). Open rows: 58.
<!-- capability-ledger:totals:end -->

<!-- capability-ledger:roadmap:start -->

## 5.0

### ai

- X-31 P0 SURF (export `./ai`; planned): Log thread, message parts, streaming text: `Thread`, `Message`, `StreamingText`
- X-32 P0 SURF (export+registry-item `./ai`; planned): Multimodal composer (attachments, paste/drop, stop) plus real `MediaRecorder` voice capture: `Composer`, `ai-voice-input`
- X-33 P1 SURF (export `./ai`; planned): `Reasoning`, `ToolCall` (+ approval), `AgentSteps`: `Reasoning`, `ToolCall`, `AgentSteps`
- X-34 P1 SURF (export `./ai`; planned): `Citation`, `SourceList`: `Citation`, `SourceList`
- X-35 P1 SURF (registry-item; planned): `ModelPicker`: `ai-model-picker`
- X-36 P2 SURF (registry-item; planned): `Artifact` panel, `TraceTree`, `EvalDashboard`: `ai-artifact-panel`, `ai-trace-tree`, `ai-eval-dashboard`

### data

- X-24 P0 SURF (prop; planned): Row and column virtualization: `virtualize`
- X-25 P0 SURF (prop; planned): Column sizing, pinning, reorder: `columnSizing`, `enableColumnResizing`, `columnPinning`, `columnOrder`, `enableColumnReordering`
- X-26 P1 SURF (prop; planned): Range row selection, inline cell edit, server pagination/sort adapters: `selectionMode`, `manualPagination`, `manualSorting`, `rowCount`, `editor`, `onCellEditCommit`
- X-27 P1 SURF (export `./data`; planned): `ChartFrame` (axes, legend, table fallback, adapter): `ChartFrame`
- X-29 P2 SURF (part+registry-item; planned): Sound query builder: `useFilterModel`, `query-builder`

### enterprise

- X-51 P1 PLAT (registry-item; planned): Typed registry (`$schema`, `registryDependencies`): `registry.json`
- X-52 P1 CMP (export `.`; planned): `DescriptionList`: `DescriptionList`
- X-53 P1 CMP (prop; planned): Banner: `layout`
- X-54 P1 CMP (export `.`; planned): `EmptyState`: `EmptyState`
- X-55 P1 SURF (registry-block; planned): Settings page, audit log, permissions matrix: `settings`, `audit-log`, `permissions-matrix`

### foundation

- X-01 P0 MAT (part; planned): Background-adaptive legibility contract (tint floor, ink auto-flip, valid `contrast: more`, complete forced-colors): `data-ag-surface`
- X-02 P0 CMP (part; planned): Positioning layer: `positioner`
- X-03 P0 CMP (part; planned): Shared Listbox/Menu/Field shells: `control-shell`
- X-04 P0 CMP (export `.`; planned): `NumberField`: `NumberField`
- X-05 P1 CMP (export `.`; planned): `Meter`: `Meter`
- X-06 P2 CMP (export `.`; planned): `Kbd`: `Kbd`
- X-07 P1 MAT (prop; planned): Direction/locale layer: `dir`, `locale`

### inputs

- X-12 P0 CMP (prop; planned): Async, creatable and free-text autocomplete combobox: `mode`, `loadOptions`, `creatable`
- X-13 P1 CMP (prop+part; planned): Tag input: `multiple`, `creatable`, `Chips`
- X-14 P0 SURF (export `./date`; planned): Calendar grid + draft-commit range: `Calendar`, `DatePicker`, `DateRangePicker`
- X-15 P1 SURF (export `./date`; planned): `TimePicker`: `TimePicker`
- X-17 P0 CMP (prop; planned): Real dropzone with upload adapter: `onUpload`
- X-18 P1 CMP (part; planned): 2-D colour area: `Area`

### media

- X-37 P1 SURF (export `./media`; planned): Headless media element: `useMediaElement`
- X-38 P2 SURF (export+part `./media`; planned): Scrubber with buffered ranges, chapter markers, hover time, frame step: `MediaScrubber`
- X-39 P1 SURF (part `./media`; planned): Standalone lightbox: `ImageViewer`
- X-40 P1 SURF (export `./media`; planned): APG carousel: `CarouselRail`
- X-41 P1 SURF (part; planned): Captions/track toggle: `Captions`

### navigation

- X-08 P0 SURF (export `.`; planned): Ranked fuzzy matching, cmdk-style compound: `Command`, `CommandPalette`
- X-09 P0 CMP (export `.`; planned): Radiogroup segmented control with thumb: `SegmentedControl`
- X-10 P1 CMP (export `.`; planned): Pointer-anchored context menu, real menubar: `ContextMenu`, `Menubar`
- X-11 P1 CMP (export `.`; planned): Roving-focus toolbar: `Toolbar`

### overlays

- X-20 P0 CMP (export `.`; planned): `AlertDialog`: `AlertDialog`
- X-21 P1 CMP (prop; planned): Hover card with hover intent: `openOnHover`
- X-22 P1 CMP (part; planned): Notification inbox on the toast store: `History`
- X-23 P1 CMP (export `.`; planned): Product `Tour`: `Tour`

### spatial

- X-56 P3 MAT (part; planned): Honest depth layering: `SurfaceGroup`

### workspaces

- X-44 P0 SURF (export `./app-shell`; planned): N-panel `ResizablePanels` (pointer, container-relative, collapse, persisted layout): `ResizablePanels`
- X-45 P1 SURF (export `./app-shell`; planned): Dockable `Inspector` with typed property rows: `Inspector`

## 5.1

### commerce

- X-48 P2 SURF (registry-block; planned): `ProductCard`, `LineItem`, `CartSummary`: `commerce-cart`
- X-49 P2 SURF (registry-block; planned): `CheckoutSteps`: `commerce-checkout`
- X-50 P3 SURF (registry-block; planned): `PricingTable`, `PlanComparison`: `pricing`

### data

- X-28 P1 SURF (export `./charts`; planned): SVG `Chart` (line, area, bar, donut): `Chart`
- X-30 P2 PLAT (registry-item; planned): Kanban, Gantt, TransferList: `kanban`, `gantt`, `transfer-list`

### inputs

- X-16 P1 SURF (export `./date`; planned): `DateTimePicker`: `DateTimePicker`
- X-19 P2 CMP (export `.`; planned): One-time-code input: `OtpField`

### media

- X-42 P2 SURF (export `./media`; planned): `Waveform` (consumer-supplied decoded `peaks`, or a live single-bar `level` 0–1): `Waveform`
- X-43 P3 SURF (registry-item; planned): Transcript panel: `media-transcript`

### workspaces

- X-46 P2 SURF (registry-item; planned): `PresenceStack`: `presence-stack`
- X-47 P2 SURF (registry-item; planned): `CommentThread` anchored to content: `comment-thread`

## 5.x (labs)

### spatial

- X-57 P3 SURF (labs; planned): `Parallax`, `ParticleField`, `MagneticCursor`: `Parallax`, `ParticleField`, `MagneticCursor`
- X-58 P3 SURF (labs; planned): Cinematic WebGL lens: `cinematic-lens`

<!-- capability-ledger:roadmap:end -->
