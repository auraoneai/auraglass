/* scripts/removal/gen-component-dispositions.mjs — PLAT-219/220 (REQ-PLAT-80).
   Generates docs/inventory/component-dispositions.md from the inventory.
     node scripts/removal/gen-component-dispositions.mjs \
       --inventory docs/auraglass-5/component-inventory.json \
       [--out docs/inventory/component-dispositions.md] [--check]
   Every inventory record must resolve to exactly one 5.0 destination
   (flagship | core | compat | labs | registry | removed). Unmapped records
   fail the run with 'UNMAPPED records' (exit 1).
   Mapping authority: the archived FND §4.6 family map + §4.7 reconciliation
   R-01..R-18 (carried verbatim below), then the inventory disposition.
   Revived verbatim from docs/auraglass-5/archive/v1-19-prd/prd/appendix/.
   Every row also carries its 5.0 owner stream (PLAT | MAT | CMP | SURF |
   QUAL, from the architecture §16 PRD id) and its SC-33 codemod id (checked
   against packages/cli/src/migrate/4to5/catalogue.json). The §4.7 R-01..R-18
   decisions are encoded in RECONCILIATION and checked by name before emit;
   tests/deprecations/dispositions.test.mjs imports the same table. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const argOf = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
export const DEFAULT_INVENTORY = join(root, 'docs/auraglass-5/component-inventory.json');
export const DEFAULT_OUT = join(root, 'docs/inventory/component-dispositions.md');
const CATALOGUE = join(root, 'packages/cli/src/migrate/4to5/catalogue.json');

// Entry constructors. dest is resolved later for A (absorbed) entries.
const F = (target, prd, note = '') => ({ kind: 'flagship', target, prd, note }); // seed of a T1 flagship
const C = (target, prd, note = '') => ({ kind: 'core', target, prd, note }); // seed of a T0/T2 core component
const A = (target, prd, note = '') => ({ kind: 'absorbed', target, prd, note }); // consolidation loser
const R = (target, prd, note = '') => ({ kind: 'removed', target, prd, note }); // removed, named successor capability
const X = (note = '') => ({ kind: 'removed', target: '-', prd: 'PRD-16', note }); // removed, no successor
const L = (target, note = '') => ({ kind: 'labs', target, prd: 'PRD-21', note });
const G = (target, note = '') => ({ kind: 'registry', target, prd: 'PRD-18', note });
const N = () => ({ kind: 'note', target: '-', prd: '-', note: 'inventory note record, not a component' });

// Keys: `${token}@${primaryFile}` first, then `${token}`. token = name up to the first space, "(" or "/".
const MAP = {
  // ---- meta / note records
  _shard_notes: N(), _screenshot_review_note: N(), _internals_note: N(), 'NOTE:': N(),
  // ---- app-shell subpath (src/app-shell/components.tsx) and workspace
  'GlassAppShell@src/app-shell/components.tsx': F('AppShell', 'PRD-10', 'seed: app-shell slot API kept (APPSHELL-06 merge)'),
  'GlassAppShell@src/components/layout/GlassAppShell.tsx': A('AppShell', 'PRD-10', 'legacy root shell; collapse/drawer behaviour ported'),
  GlassIconButton: A('IconButton', 'PRD-08'),
  GlassActionBar: A('Toolbar', 'PRD-08'),
  GlassBreadcrumbs: A('Breadcrumbs', 'PRD-10'),
  GlassCommandDock: A('CommandPalette', 'PRD-10'),
  GlassMain: A('AppShell.Main', 'PRD-10'),
  GlassMobileShell: A('MobileShell', 'PRD-10'),
  GlassPage: A('AppShell', 'PRD-10'),
  GlassPageHeader: A('TopBar', 'PRD-10'),
  GlassResizablePanel: A('ResizablePanels', 'PRD-10', '§12 names it; inventory REMOVE overridden to a compat name (APPSHELL-13: fake)'),
  'GlassSplitPane@src/app-shell/components.tsx': A('ResizablePanels', 'PRD-10', '§12 names it; inventory REMOVE overridden'),
  'GlassSplitPane@src/components/layout/GlassSplitPane.tsx': F('ResizablePanels', 'PRD-10', 'seed; container-relative math fixes APPSHELL-12'),
  GlassSidebarPanel: A('Sidebar', 'PRD-10'),
  GlassSidebarRail: A('Sidebar', 'PRD-10'),
  GlassStatusBar: A('AppShell.StatusBar', 'PRD-10'),
  GlassTopBar: F('TopBar', 'PRD-10'),
  GlassCanvasArea: A('AppShell.Main', 'PRD-10'),
  GlassInspectorPanel: A('AppShell.Inspector', 'PRD-10'),
  GlassTimelineRail: R('Timeline', 'PRD-11', 'SC-34: removed — capability lives in Timeline'),
  GlassWorkflowShell: A('AppShell', 'PRD-10'),
  GlassWorkspace: A('AppShell', 'PRD-10'),
  GlassWorkspaceHeader: A('TopBar', 'PRD-10'),
  GlassWorkspacePanel: A('Card', 'PRD-14'),
  GlassWorkspaceTabs: A('Tabs', 'PRD-10', 'APPSHELL-09'),
  // ---- accessibility / theme
  AccessibilityProvider: A('AuraGlassProvider', 'PRD-05'),
  ContrastGuard: R('build-time contrast matrix (§7.3)', 'PRD-03', 'ACCESSIBILITY-01/-02'),
  GlassA11y: R('GlassPreferencesPanel', 'PRD-05'),
  GlassHighContrast: R('GlassPreferencesPanel', 'PRD-05'),
  GlassFocusIndicators: R('owned focus ring (§6)', 'PRD-05'),
  GlassFocusRing: R('owned focus ring (§6)', 'PRD-05', 'inventory REPLACE'),
  GlassThemeSwitcher: A('GlassPreferencesPanel', 'PRD-05'),
  PersonaPicker: A('GlassPreferencesPanel', 'PRD-05', 'personas become theme presets'),
  // ---- material (T0)
  LiquidGlassMaterial: C('Surface', 'PRD-04', 'seed concept; JS style merge removed (MATERIAL-ENGINE-01)'),
  GlassCore: A('Surface', 'PRD-04'),
  OptimizedGlassCore: A('Surface', 'PRD-04', '167 files / 251 call sites (API-CONSISTENCY-01)'),
  GlassAdvanced: A('Surface', 'PRD-04'),
  OptimizedGlassAdvanced: A('Surface', 'PRD-04', 'inventory DEPRECATE; §12 names it'),
  AdaptiveGlass: A('Surface', 'PRD-04'),
  GlassEngine: A('Surface', 'PRD-04'),
  GlassOpacityEngine: A('Surface', 'PRD-04'),
  GlassProgressiveEnhancement: A('Surface (tiers via AuraGlassScript)', 'PRD-04'),
  GlassBox: A('Surface', 'PRD-04'),
  GlassPanel: A('Surface', 'PRD-04'),
  DimensionalGlass: A('Surface', 'PRD-04'),
  FrostedGlass: A('Surface', 'PRD-04'),
  PageGlassContainer: A('Surface', 'PRD-04'),
  OptimizedGlassContainer: A('Surface', 'PRD-04'),
  LiquidGlassEffectGroup: C('SurfaceGroup', 'PRD-04'),
  LiquidGlassLayerProvider: A('SurfaceGroup', 'PRD-04', 'becomes the provider dev counter'),
  LiquidGlassConcentricFrame: C('ConcentricFrame', 'PRD-04'),
  LiquidGlassScrollEdge: C('ScrollEdge', 'PRD-04'),
  LiquidGlassBackdropSampler: R('library-owned luminance sampling (media only)', 'PRD-13'),
  GlassPerformanceOptimization: R('tiers resolved pre-paint (D-09, D-10)', 'PRD-04'),
  // ---- backdrops
  AuroraBackground: C('Backdrop preset="aurora"', 'PRD-13', 'highest-scoring record (7)'),
  AuroraOrb: A('Backdrop', 'PRD-13'),
  AtmosphericBackground: A('Backdrop', 'PRD-13'),
  DynamicAtmosphere: A('Backdrop', 'PRD-13'),
  GlassMeshGradient: A('Backdrop preset="mesh"', 'PRD-13'),
  // ---- primitives (KEEP set, ./primitives)
  Slot: C('Slot', 'PRD-07', 'reads props.ref (React 19)'),
  Portal: C('Portal', 'PRD-07'),
  FocusScope: C('FocusScope', 'PRD-07'),
  Label: C('Label', 'PRD-07'),
  DismissableLayer: C('DismissableLayer', 'PRD-07'),
  ScreenReader: A('VisuallyHidden + provider announcer', 'PRD-07'),
  SkipLinks: A('AppShell.SkipLink', 'PRD-10'),
  GlassLabel: A('Label', 'PRD-07'),
  RovingFocusGroup: R('Base UI Toolbar/Tabs/Menu roving focus', 'PRD-07', 'not in the §6 KEEP list'),
  Positioner: R('Base UI positioning (Popover/Menu)', 'PRD-09', 'inventory REPLACE'),
  FocusTrap: R('FocusScope / Base UI focus management', 'PRD-07'),
  // ---- motion
  MotionFramer: R('./motion helpers + CSS motion tokens', 'PRD-06'),
  GlassMotionController: R('./motion helpers + CSS motion tokens', 'PRD-06'),
  AdvancedAnimations: R('CSS motion tokens', 'PRD-06'),
  GlassDraggable: R('./motion drag helper', 'PRD-06'),
  CursorGlow: R('pointerLight option (§8)', 'PRD-06'),
  GlassTransitions: A('SourceTransition', 'PRD-10', 'cycle with GlassLiquidTransition resolved to SourceTransition'),
  GlassLiquidTransition: A('SourceTransition', 'PRD-10', 'cycle with GlassTransitions resolved'),
  LiquidGlassTransitionProvider: F('SourceTransition', 'PRD-10'),
  // ---- buttons
  GlassButton: F('Button', 'PRD-08', 'conditional hooks :287-290 removed'),
  EnhancedGlassButton: A('Button', 'PRD-08', '§12 names it; inventory REMOVE overridden'),
  'Non-exported': R('IconButton exported from root', 'PRD-08'),
  GlassFab: A('Button', 'PRD-08', 'shape="capsule" prominent'),
  MagneticButton: A('Button', 'PRD-08', 'magnetic → ./motion option'),
  LiquidGlassButtonStyle: A('Button', 'PRD-08'),
  RippleButton: A('Button', 'PRD-08', 'ripple dropped (§8)'),
  GlassLinkButton: A('Button', 'PRD-08', 'render={<a/>}'),
  ToggleButton: A('Button pressed', 'PRD-08'),
  ToggleButtonGroup: A('Toolbar', 'PRD-08'),
  GlassToggle: A('Button pressed / ToggleGroup', 'PRD-08'),
  LiquidGlassControlGroup: F('Toolbar / ButtonGroup', 'PRD-08'),
  GlassToolbar: A('Toolbar', 'PRD-08'),
  LiquidGlassToolbar: A('Toolbar', 'PRD-08'),
  GlassCommandBar: A('Toolbar', 'PRD-08'),
  LiquidGlassMapControls: A('Toolbar', 'PRD-08', 'chrome-over-media example'),
  SpeedDial: A('Menu (Button trigger)', 'PRD-09'),
  SpeedDialAction: A('Menu.Item', 'PRD-09'),
  SpeedDialIcon: A('Icon', 'PRD-14'),
  // ---- form controls
  GlassCheckbox: F('Checkbox', 'PRD-08'),
  GlassCheckboxGroup: A('CheckboxGroup', 'PRD-08'),
  GlassRadioGroup: F('RadioGroup', 'PRD-08'),
  GlassInput: F('TextField', 'PRD-08', 'conditional useA11yId :148-150 (API-CONSISTENCY-02)'),
  GlassTextarea: A('TextField multiline', 'PRD-08'),
  GlassFieldGroup: A('Field', 'PRD-14'),
  GlassFormField: A('Field', 'PRD-14'),
  GlassValidationMessage: A('Field.Error', 'PRD-14'),
  GlassForm: C('Form', 'PRD-14'),
  GlassSwitch: F('Switch', 'PRD-08', 'shimmer loop removed (MOTION-12)'),
  GlassSlider: F('Slider', 'PRD-08', 'ACCESSIBILITY-08 (no keyboard)'),
  'GlassStepper@src/components/input/GlassStepper.tsx': F('NumberField', 'PRD-08', 'inventory REPLACE'),
  'GlassStepper@src/components/interactive/GlassStepper.tsx': C('Steps', 'PRD-14', 'one Steps component'),
  GlassStep: A('Steps', 'PRD-14'),
  GlassFormStepper: A('Steps', 'PRD-14'),
  GlassFormWizardSteps: A('Steps', 'PRD-14'),
  LiquidGlassSearchField: F('SearchField', 'PRD-08'),
  GlassSearchField: A('SearchField', 'PRD-08'),
  GlassSearchInterface: A('SearchField', 'PRD-08'),
  GlassIntelligentSearch: A('SearchField', 'PRD-08'),
  GlassSelectCompound: F('Select', 'PRD-08'),
  GlassSelect: A('Select', 'PRD-08', 'legacy options-array API'),
  GlassCombobox: F('Combobox', 'PRD-08', 'best 4.1 APG model'),
  GlassMultiSelect: A('Combobox multiple', 'PRD-08'),
  GlassTagInput: A('Combobox multiple (chips)', 'PRD-08'),
  GlassMentionList: A('Combobox', 'PRD-08'),
  GlassDateField: F('DateField', 'PRD-11'),
  GlassTimeField: F('TimeField', 'PRD-11'),
  GlassDatePicker: F('DatePicker', 'PRD-11', 'ACCESSIBILITY-09'),
  GlassDateRangePicker: A('DateRangePicker', 'PRD-11'),
  GlassCalendar: A('Calendar', 'PRD-11'),
  GlassColorPicker: C('ColorPicker', 'PRD-14'),
  GlassColorWheel: A('ColorPicker', 'PRD-14'),
  GlassGradientPicker: A('ColorPicker', 'PRD-14'),
  'GlassFileUpload@src/components/interactive/GlassFileUpload.tsx': C('FileUpload', 'PRD-14'),
  'GlassFileUpload@src/components/input/GlassFileUpload.tsx': X('duplicate of interactive/GlassFileUpload'),
  GlassInlineEdit: C('InlineEdit', 'PRD-14'),
  GlassKeyValueEditor: C('KeyValueEditor', 'PRD-14', 'ships from ./data'),
  GlassRating: C('Rating', 'PRD-14'),
  GlassTreeSelect: R('Combobox + TreeView composition', 'PRD-11'),
  // ---- overlays
  GlassModal: F('Dialog / AlertDialog', 'PRD-09'),
  GlassDialog: A('Dialog', 'PRD-09'),
  GlassDrawer: F('Sheet', 'PRD-09'),
  GlassBottomSheet: A('Sheet', 'PRD-09'),
  GlassActionSheet: A('Sheet', 'PRD-09'),
  LiquidGlassAdaptiveSheet: A('Sheet', 'PRD-09'),
  MobileGlassBottomSheet: A('Sheet', 'PRD-09', '§12 names it; inventory REMOVE overridden'),
  GlassMobileNav: A('Sheet', 'PRD-09', '§11.2 #17'),
  GlassPopover: F('Popover', 'PRD-09'),
  GlassTooltip: F('Tooltip', 'PRD-09', 'ACCESSIBILITY-10'),
  GlassHoverCard: A('Popover openOnHover', 'PRD-14', 'SC-34: compat adapter over Popover openOnHover (was core HoverCard / Base UI PreviewCard)'),
  GlassDropdownMenu: F('Menu', 'PRD-09', 'canonical part naming'),
  GlassContextMenu: A('ContextMenu', 'PRD-09'),
  GlassMenubar: A('Menubar', 'PRD-09', 'ACCESSIBILITY-12'),
  GlassMenuPrimitive: A('Menu', 'PRD-09'),
  HeaderUserMenu: A('Menu', 'PRD-09'),
  LiquidGlassPopoverMenu: A('Menu', 'PRD-09'),
  'GlassToast@src/components/data-display/GlassToast.tsx': F('Toast', 'PRD-09'),
  'GlassToast@src/components/feedback/GlassToast.tsx': X('second toast system (API-CONSISTENCY-12)'),
  GlassToastProvider: A('Toast (provider region)', 'PRD-09'),
  GlassNotificationCenter: A('Toast', 'PRD-09'),
  GlassCoachmarks: A('Tour', 'PRD-14'),
  GlassSpotlight: A('Tour', 'PRD-14'),
  // ---- navigation
  GlassTabs: F('Tabs', 'PRD-10', 'value contract seed'),
  GlassPageTabs: A('Tabs', 'PRD-10', 'KEEP: visual reference for Tabs'),
  EnhancedGlassTabs: A('Tabs', 'PRD-10'),
  GlassTabItem: A('Tabs.Tab', 'PRD-10'),
  TabItem: A('Tabs.Tab', 'PRD-10'),
  LiquidGlassTabBar: F('TabBar', 'PRD-10'),
  GlassTabBar: A('TabBar', 'PRD-10'),
  GlassBottomNav: A('TabBar', 'PRD-10'),
  LiquidGlassBottomAccessory: A('TabBar.Accessory', 'PRD-10'),
  CollapsedMenu: A('TabBar (overflow)', 'PRD-10'),
  ScrollButtons: A('TabBar (overflow)', 'PRD-10'),
  GlassSegmentedControl: F('SegmentedControl', 'PRD-08'),
  LiquidGlassSegmentedControl: A('SegmentedControl', 'PRD-08'),
  GlassSidebar: F('Sidebar', 'PRD-10'),
  SidebarBrand: A('Sidebar slots', 'PRD-10'),
  LiquidGlassInsetSidebar: A('Sidebar', 'PRD-10'),
  LiquidGlassInspectorPanel: F('AppShell.Inspector', 'PRD-10', 'seed for the Inspector slot'),
  GlassHeader: A('TopBar', 'PRD-10'),
  GlassNavigation: A('TopBar', 'PRD-10', '§12 names it; inventory REMOVE overridden'),
  GlassNavigationMenu: A('TopBar', 'PRD-10'),
  GlassResponsiveNav: A('AppShell', 'PRD-10'),
  ZSpaceAppLayout: A('AppShell', 'PRD-10'),
  ContentSection: A('Card', 'PRD-14'),
  GlassBreadcrumb: F('Breadcrumbs', 'PRD-10'),
  GlassPagination: F('Pagination', 'PRD-10'),
  GlassCommand: F('Command', 'PRD-10'),
  GlassCommandPalette: F('CommandPalette', 'PRD-10', 'ACCESSIBILITY-18'),
  LiquidGlassCommandSurface: A('CommandPalette', 'PRD-10'),
  GlassSpotlightSearch: A('CommandPalette', 'PRD-10'),
  // ---- data
  'GlassDataTable@src/components/data-display/GlassDataTable.tsx': F('Table', 'PRD-11', 'conscious/predictive/gaze variants removed'),
  'GlassDataTable@src/components/templates/interactive/GlassDataTable.tsx': X('dead template (APPSHELL-15)'),
  GlassDataGrid: A('Table', 'PRD-11'),
  GlassVirtualTable: A('Table', 'PRD-11', 'API-CONSISTENCY-09: not virtualized'),
  GlassVirtualList: A('Table (internal VirtualList)', 'PRD-11'),
  GlassInfiniteScroll: R('TanStack Virtual inside Table/Thread', 'PRD-11', 'POLISH but no §11 slot'),
  TreeView: F('TreeView', 'PRD-11', 'RA Tree'),
  TreeItem: A('TreeView.Item', 'PRD-11'),
  GlassTreeView: A('TreeView', 'PRD-11'),
  GlassFileTree: A('TreeView', 'PRD-11'),
  GlassFileExplorer: A('TreeView', 'PRD-11'),
  GlassFilterBar: F('FilterBar', 'PRD-11'),
  GlassFilterPanel: A('FilterBar', 'PRD-11'),
  GlassFacetSearch: A('FilterBar', 'PRD-11'),
  GlassAdvancedSearch: A('FilterBar', 'PRD-11'),
  GlassStatCard: F('StatCard', 'PRD-11'),
  GlassKPICard: A('StatCard', 'PRD-11'),
  GlassMetricCard: A('StatCard', 'PRD-11'),
  GlassMetricChip: A('StatCard', 'PRD-11'),
  GlassMetricsGrid: A('StatCard', 'PRD-11'),
  GlassAnimatedNumber: A('StatCard', 'PRD-11'),
  KpiChart: A('StatCard', 'PRD-11'),
  GlassSparkline: F('Sparkline', 'PRD-11'),
  GlassChart: F('ChartFrame', 'PRD-11', 'Chart in ./charts 5.1'),
  GlassAreaChart: A('ChartFrame', 'PRD-11'), GlassBarChart: A('ChartFrame', 'PRD-11'),
  GlassLineChart: A('ChartFrame', 'PRD-11'), GlassPieChart: A('ChartFrame', 'PRD-11'),
  GlassDataChart: A('ChartFrame', 'PRD-11', 'chart.js removed'),
  GlassChartWidget: A('ChartFrame', 'PRD-11'),
  GlassAdvancedDataViz: R('ChartFrame', 'PRD-11', 'SC-34: removed — capability lives in ChartFrame'),
  ChartGrid: A('ChartFrame', 'PRD-11'), ChartLegend: A('ChartFrame', 'PRD-11'),
  ChartTooltip: A('ChartFrame', 'PRD-11'), ChartElementStyles: A('ChartFrame', 'PRD-11'),
  GlassHeatmap: R('Chart (./charts, 5.1)', 'PRD-11'),
  GlassTimeline: F('Timeline', 'PRD-11'),
  GlassActivityFeed: A('ActivityFeed', 'PRD-11'),
  // ---- AI
  GlassMessageList: F('Thread', 'PRD-12', 'role="log" seed'),
  GlassChat: A('Thread + Message', 'PRD-12', 'manual migration (data model)'),
  GlassChatInput: F('Composer', 'PRD-12'),
  GlassTypingIndicator: F('ToolCall status atom', 'PRD-12'),
  // ---- media
  LiquidGlassMediaControls: F('MediaControls', 'PRD-13'),
  LiquidGlassNowPlayingBar: F('NowPlayingBar', 'PRD-13'),
  GlassImageViewer: F('ImageViewer', 'PRD-13'),
  LiquidGlassPhotoInspector: A('ImageViewer', 'PRD-13'),
  GlassAdvancedAudioPlayer: A('MediaControls', 'PRD-13'),
  GlassAdvancedVideoPlayer: A('MediaControls', 'PRD-13'),
  GlassVideoPlayer: A('MediaControls', 'PRD-13'),
  GlassMediaProvider: R('useMediaElement', 'PRD-13'),
  LiquidGlassCarouselRail: F('CarouselRail', 'PRD-13'),
  GlassCarousel: A('CarouselRail', 'PRD-13'),
  // ---- T2 core and T0 layout/type
  GlassCard: C('Card', 'PRD-14', 'content-raised by default (D-08)'),
  GlowingCard: A('Card', 'PRD-14'),
  WidgetGlass: A('Card', 'PRD-14'),
  GlassAccordion: C('Accordion', 'PRD-14', 'heading+button (ACCESSIBILITY-13)'),
  GlassAlert: C('Alert', 'PRD-14'),
  GlassAvatar: C('Avatar', 'PRD-14'),
  GlassAvatarGroup: A('AvatarGroup', 'PRD-14'),
  GlassBadge: C('Badge', 'PRD-14'),
  LiquidGlassBadgeCluster: A('Badge', 'PRD-14'),
  GlassStatusDot: A('Badge dot', 'PRD-14'),
  GlassConnectionStatus: A('Badge', 'PRD-14'),
  GlassChip: C('Chip', 'PRD-14'),
  GlassDivider: A('Separator', 'PRD-14'),
  GlassSeparator: C('Separator', 'PRD-14'),
  GlassEmptyState: C('EmptyState', 'PRD-14'),
  GlassErrorState: C('ErrorState', 'PRD-14'),
  GlassLoadingState: C('LoadingState', 'PRD-14'),
  GlassSkeleton: C('Skeleton', 'PRD-14'),
  GlassLoadingSkeleton: A('Skeleton', 'PRD-14'),
  GlassProgress: C('Progress', 'PRD-14'),
  CircularProgress: C('ProgressRing', 'PRD-14', 'exported for the first time'),
  ImageList: C('ImageList', 'PRD-14'),
  ImageListItem: C('ImageList.Item', 'PRD-14'),
  ImageListItemBar: C('ImageList.ItemBar', 'PRD-14'),
  GlassGallery: A('ImageList', 'PRD-14'),
  GlassLazyImage: R('native loading="lazy" in ImageList/Avatar', 'PRD-14'),
  GlassScrollArea: C('ScrollArea', 'PRD-14'),
  GlassStack: C('Stack', 'PRD-14', 'T0'),
  GlassFlex: A('Stack', 'PRD-14'),
  Box: A('Stack', 'PRD-14'),
  GlassGrid: C('Grid', 'PRD-14', 'T0; masonry option'),
  GlassMasonry: A('Grid masonry', 'PRD-14'),
  GlassMasonryGrid: A('Grid masonry', 'PRD-14'),
  GlassContainer: C('Container', 'PRD-14', 'T0'),
  Typography: C('Text / Heading', 'PRD-14', 'T0'),
  DisplayText: A('Heading size="display"', 'PRD-14'),
  Icon: C('Icon + per-glyph modules', 'PRD-14', 'T0'),
  createGlassIcon: C('createIcon', 'PRD-14'),
  ClearIcon: A('Icon', 'PRD-14'),
  // ---- registry (D-17, §13.5) and labs (§13.4)
  GlassKanbanBoard: G('Kanban (dnd-kit)'), GlassKanban: G('Kanban (dnd-kit)', 'inventory REMOVE; §13.5 re-author'),
  GlassGanttChart: G('Gantt'), GlassTransferList: G('TransferList'), GlassSchemaViewer: G('SchemaViewer'),
  GlassCodeEditor: G('CodeSurface'), GlassJSONViewer: G('CodeSurface'), GlassRichTextEditor: G('RichText'),
  GlassDiffViewer: G('DiffViewer'),
  GlassDashboard: G('data-workspace block'), GlassDetailView: G('data-workspace block'),
  GlassListView: G('data-workspace block'), GlassFormTemplate: G('settings block'),
  GlassMagneticCursor: L('MagneticCursor'), GlassParallaxLayers: L('ParallaxLayers'),
  GlassParticles: L('ParticleField'), GlassParticleField: L('ParticleField'), ParticleBackground: L('ParticleField'),
  GlassMindMap: L('MindMap'), GlassSignaturePad: L('SignaturePad'),
  GlassWebGLShader: L('cinematic lens (rebuilt)'), GlassSpatialAudio: L('useGlassSound (opt-in, if demanded)'),
};

// CONSOLIDATE/REPLACE/REDESIGN/POLISH/KEEP records not in MAP must be listed here as deliberate removals.
const DELIBERATE_REMOVALS = {
  GlassLiveCursorPresence: 'collaboration family has no 5.0 owner', GlassCollaborationDashboard: 'collaboration',
  GlassCollaborationProvider: 'collaboration', GlassCollaborativeComments: 'collaboration',
  GlassCollaborativeCursor: 'collaboration', GlassCommentThread: 'collaboration', GlassUserPresence: 'collaboration',
  GlassWhiteboard: 'collaboration', GlassSharedWhiteboard: 'collaboration', GlassPresenceIndicator: 'social',
  GlassReactions: 'social', GlassReactionBar: 'social', GlassTrophyCase: 'gamification',
  GlassMusicVisualizer: 'simulated / novelty', GlassIntelligentFormBuilder: 'simulated AI (SERVER-SERVICES-AI-10)',
  NeuralWeightVisualization: 'simulated AI (§13.3)', CompactCookieNotice: 'consumer-owned consent UI',
  CookieConsent: 'consumer-owned consent UI', GlobalCookieConsent: 'consumer-owned consent UI',
  DimensionalDashboardContainer: 'novelty layout', GlassMultiStepForm: 'compose Steps + Form',
  GlassWizard: 'compose Steps + Form', GlassWizardTemplate: 'compose Steps + Form', GlassFormBuilder: 'out of scope',
  GlassQueryBuilder: 'out of scope', GlassOrbitalMenu: 'novelty layout (§13.3)', GlassVoiceWaveform: 'voice demo family',
  GlassPullToRefresh: 'no §11 slot; D-15 export cap', TouchRippleEffects: 'ripple motion removed (§8)',
  AuraGlassClientBoundary: 'ssr shims removed (§3.2); hydration mismatch', GlassWipeSlider: 'docs-site only (PRD-20)',
  FeatureTile: 'docs-site only (PRD-20)', InstallCommand: 'docs-site only (PRD-20)', LogoMark: 'docs-site only (PRD-20)',
  ShowcaseCard: 'docs-site only (PRD-20)', ChartWidget: 'dead template (APPSHELL-15)', MetricWidget: 'dead template (APPSHELL-15)',
  TableWidget: 'dead template (APPSHELL-15)', GlassCanvas: '§13.1 new Function sink',
  ARGlassEffects: '§13.3 AR/XR',
};

export const tokenOf = (name) => name.split(/[\s(/]/)[0];
const fileOf = (file) => (file || '').split(/[\s;]/)[0];
const isPublic = (r) => r.exported_from_root || (r.sub_exports && r.sub_exports.length > 0) || /^src\/(app-shell|workspace)\//.test(fileOf(r.file));

/* 5.0 owner stream per architecture §16 PRD id, via the archived PRD keys
   (archive MASTER §5.2) and their 5.0 streams (MASTER PRD §5): TRUST/REL/PKG/
   DX + FND removal -> PLAT; DS/MAT/A11Y/MOT -> MAT; FND/CTL/OVL -> CMP;
   NAV/DATA/AI/MED/EXP (labs) -> SURF; QA/SB -> QUAL. Rows leaving the package
   (`removed`) are PLAT's removal train (contract §7.1 R-01) whatever their PRD;
   `registry` is PRD-18 (DX -> PLAT); `labs` is PRD-21 (`packages/labs`, SURF). */
export const PRD_STREAM = {
  'PRD-00': 'PLAT', 'PRD-01': 'PLAT', 'PRD-02': 'PLAT', 'PRD-03': 'MAT', 'PRD-04': 'MAT', 'PRD-05': 'MAT',
  'PRD-06': 'MAT', 'PRD-07': 'CMP', 'PRD-08': 'CMP', 'PRD-09': 'CMP', 'PRD-10': 'SURF', 'PRD-11': 'SURF',
  'PRD-12': 'SURF', 'PRD-13': 'SURF', 'PRD-14': 'CMP', 'PRD-15': 'MAT', 'PRD-16': 'PLAT', 'PRD-17': 'PLAT',
  'PRD-18': 'PLAT', 'PRD-19': 'QUAL', 'PRD-20': 'PLAT', 'PRD-21': 'SURF',
};
export function ownerOf(dest, prd) {
  if (dest === 'note') return '-';
  if (dest === 'removed') return 'PLAT';
  const s = PRD_STREAM[prd];
  if (!s) throw new Error(`no owner stream for ${prd}`);
  return s;
}

/* SC-33 codemod id: rows leaving the package -> `removed` (prints the TODO
   with the registry/labs pointer from deprecations); a public name that moves
   to a different 5.0 name or to aura-glass/compat -> `canonical-names`
   (merged renames map, incl. moves to 'aura-glass/compat'); a seed whose name
   is unchanged needs no codemod (`-`). */
export function codemodOf(dest, name, target) {
  if (dest === 'note') return '-';
  if (['removed', 'registry', 'labs'].includes(dest)) return 'removed';
  if (dest === 'compat') return 'canonical-names';
  const lead = /^[A-Za-z_$][\w$]*/.exec(target)?.[0];
  return lead === tokenOf(name) ? '-' : 'canonical-names';
}

export function buildRows(records) {
  const rows = [];
  const unmapped = [];
  records.forEach((r, i) => {
    const tok = tokenOf(r.name);
    let e = MAP[`${tok}@${fileOf(r.file)}`] ?? MAP[tok];
    if (!e) {
      if (['REMOVE', 'DEPRECATE'].includes(r.disposition)) e = X('§13.3 / inventory ' + r.disposition);
      else if (tok in DELIBERATE_REMOVALS) e = X(DELIBERATE_REMOVALS[tok]);
      else { unmapped.push(`${i} ${r.name} (${r.disposition})`); return; }
    }
    let dest = e.kind;
    if (e.kind === 'absorbed') dest = isPublic(r) ? 'compat' : 'removed';
    const flags = [];
    if (['REMOVE', 'DEPRECATE'].includes(r.disposition) && !['removed', 'note'].includes(dest)) flags.push('overrides inventory ' + r.disposition);
    if (['KEEP', 'POLISH', 'REDESIGN'].includes(r.disposition) && dest === 'removed' && e.kind !== 'absorbed') flags.push('overrides inventory ' + r.disposition);
    if (e.kind === 'absorbed' && dest === 'removed') flags.push('internal; merged into target');
    rows.push({
      i, name: r.name, file: fileOf(r.file), disp: r.disposition, pub: isPublic(r), dest, target: e.target,
      owner: ownerOf(dest, e.prd), codemod: codemodOf(dest, r.name, e.target), prd: e.prd, absorbed: e.kind === 'absorbed',
      note: [e.note, ...flags].filter(Boolean).join('; '),
    });
  });
  return { rows, unmapped };
}

/* §4.7 R-01..R-18 (archive FND, canonical survivor decisions). Each decision
   names its records by `token@file` (or token when unique) and the exact
   destination/target the decision requires. A named record that is missing
   from the rows is itself a violation. */
const at = (token, file) => ({ token, file });
const is = (dest, target) => (r) => r.dest === dest && (target === undefined || r.target === target);
export const RECONCILIATION = [
  ['R-01', 'all -> Surface', [
    [at('AdaptiveGlass'), is('compat', 'Surface')], [at('GlassOpacityEngine'), is('compat', 'Surface')],
    [at('GlassEngine'), is('compat', 'Surface')], [at('OptimizedGlassCore'), is('compat', 'Surface')]]],
  ['R-02', 'both -> SourceTransition', [
    [at('GlassTransitions'), is('compat', 'SourceTransition')], [at('GlassLiquidTransition'), is('compat', 'SourceTransition')]]],
  ['R-03', 'StatCard, seed GlassStatCard', [
    [at('GlassStatCard'), is('flagship', 'StatCard')], [at('GlassMetricCard'), is('compat', 'StatCard')],
    [at('GlassKPICard'), is('compat', 'StatCard')]]],
  ['R-04', 'two survivors: Command and CommandPalette', [
    [at('GlassCommand'), is('flagship', 'Command')], [at('GlassCommandPalette'), is('flagship', 'CommandPalette')]]],
  ['R-05', 'TreeView, seed src/components/tree-view/TreeView.tsx', [
    [at('TreeView', 'src/components/tree-view/TreeView.tsx'), is('flagship', 'TreeView')], [at('GlassTreeView'), is('compat', 'TreeView')]]],
  ['R-06', 'Toast, seed data-display; feedback copy removed', [
    [at('GlassToast', 'src/components/data-display/GlassToast.tsx'), is('flagship', 'Toast')],
    [at('GlassToast', 'src/components/feedback/GlassToast.tsx'), is('removed')],
    [at('GlassToastProvider'), (r) => r.dest === 'compat' && r.target.startsWith('Toast')]]],
  ['R-07', 'FileUpload, seed interactive/', [
    [at('GlassFileUpload', 'src/components/interactive/GlassFileUpload.tsx'), is('core', 'FileUpload')],
    [at('GlassFileUpload', 'src/components/input/GlassFileUpload.tsx'), is('removed')]]],
  ['R-08', 'input/ -> NumberField; interactive/ -> Steps', [
    [at('GlassStepper', 'src/components/input/GlassStepper.tsx'), is('flagship', 'NumberField')],
    [at('GlassStepper', 'src/components/interactive/GlassStepper.tsx'), is('core', 'Steps')]]],
  ['R-09', 'AppShell from the app-shell slot API; ResizablePanels from layout/GlassSplitPane', [
    [at('GlassAppShell', 'src/app-shell/components.tsx'), is('flagship', 'AppShell')],
    [at('GlassAppShell', 'src/components/layout/GlassAppShell.tsx'), is('compat', 'AppShell')],
    [at('GlassSplitPane', 'src/components/layout/GlassSplitPane.tsx'), is('flagship', 'ResizablePanels')],
    [at('GlassSplitPane', 'src/app-shell/components.tsx'), is('compat', 'ResizablePanels')]]],
  ['R-10', 'AppShell.Inspector slot, seed LiquidGlassInspectorPanel', [
    [at('LiquidGlassInspectorPanel'), is('flagship', 'AppShell.Inspector')], [at('GlassInspectorPanel'), is('compat', 'AppShell.Inspector')]]],
  ['R-11', 'Tabs: GlassTabs value contract, GlassPageTabs visual reference', [
    [at('GlassTabs'), is('flagship', 'Tabs')], [at('GlassPageTabs'), is('compat', 'Tabs')]]],
  ['R-12', 'labs ParticleField; no core survivor', [
    [at('GlassParticles'), is('labs', 'ParticleField')], [at('GlassParticleField'), is('labs', 'ParticleField')],
    [at('ParticleBackground'), is('labs', 'ParticleField')]]],
  ['R-13', 'Backdrop presets, seed AuroraBackground', [
    [at('AuroraBackground'), (r) => r.dest === 'core' && r.target.startsWith('Backdrop')],
    [at('DynamicAtmosphere'), is('compat', 'Backdrop')], [at('AtmosphericBackground'), is('compat', 'Backdrop')]]],
  ['R-14', 'two survivors: Select and Combobox', [
    [at('GlassCombobox'), is('flagship', 'Combobox')], [at('GlassSelect', 'src/components/input/GlassSelect.tsx'), is('compat', 'Select')]]],
  ['R-15', 'Toolbar / ButtonGroup', [[at('ToggleButtonGroup'), is('compat', 'Toolbar')]]],
  ['R-16', 'D-21: ChartFrame in 5.0', [
    [at('GlassDataChart'), is('compat', 'ChartFrame')], [at('GlassAdvancedDataViz'), is('removed', 'ChartFrame')]]],
  ['R-17', 'the six §12 consolidation losers become compat names', [
    [at('EnhancedGlassButton'), is('compat')], [at('GlassResizablePanel'), is('compat')],
    [at('GlassSplitPane', 'src/app-shell/components.tsx'), is('compat')], [at('MobileGlassBottomSheet'), is('compat')],
    [at('GlassNavigation'), is('compat')], [at('GlassIconButton'), is('compat')]]],
  ['R-18', 'POLISH/REDESIGN records without a §11 slot are removed', [
    [at('GlassPullToRefresh'), is('removed')], [at('GlassInfiniteScroll'), is('removed')], [at('FeatureTile'), is('removed')],
    [at('InstallCommand'), is('removed')], [at('LogoMark'), is('removed')], [at('MotionFramer'), is('removed')],
    [at('RovingFocusGroup'), is('removed')]]],
];
/* SC-34 corrections the ledger names explicitly (REQ-PLAT-80). */
export const SC34 = [
  [at('GlassHoverCard'), is('compat', 'Popover openOnHover')],
  [at('GlassTimelineRail'), is('removed', 'Timeline')],
  [at('GlassAdvancedDataViz'), is('removed', 'ChartFrame')],
];

export function findRows(rows, { token, file }) {
  return rows.filter((r) => tokenOf(r.name) === token && (file === undefined || r.file === file));
}

export function checkReconciliation(rows) {
  const fail = [];
  const check = (rid, sel, ok) => {
    const recs = findRows(rows, sel);
    const label = sel.file ? `${sel.token}@${sel.file}` : sel.token;
    if (recs.length !== 1) fail.push(`${rid}: ${label} matches ${recs.length} rows (expected exactly 1)`);
    else if (!ok(recs[0])) fail.push(`${rid}: ${label} -> ${recs[0].dest}/${recs[0].target}`);
  };
  for (const [rid, , cases] of RECONCILIATION) for (const [sel, ok] of cases) check(rid, sel, ok);
  for (const [sel, ok] of SC34) check('SC-34', sel, ok);
  /* R-18 covers exactly 18 POLISH/REDESIGN records with no §11 slot; each
     row must carry its successor capability or the reason it has none. */
  const r18 = rows.filter((r) => ['POLISH', 'REDESIGN'].includes(r.disp) && r.dest === 'removed' && !r.absorbed);
  if (r18.length !== 18) fail.push(`R-18: ${r18.length} POLISH/REDESIGN -> removed rows (archive §4.7 counts 18)`);
  for (const r of r18) if (r.target === '-' && !r.note) fail.push(`R-18: ${r.name} names neither a successor nor a reason`);
  /* R-17: every REMOVE record that §12 overrides to a compat name is flagged. */
  for (const [sel] of RECONCILIATION.find(([id]) => id === 'R-17')[2]) {
    const [r] = findRows(rows, sel);
    if (r && r.disp === 'REMOVE' && !r.note.includes('overrides inventory REMOVE')) fail.push(`R-17: ${r.name} lacks the "overrides inventory REMOVE" flag`);
  }
  return fail;
}

export function checkColumns(rows, catalogueIds) {
  const fail = [];
  const streams = new Set(['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL']);
  for (const r of rows) {
    if (r.dest === 'note') { if (r.owner !== '-' || r.codemod !== '-') fail.push(`${r.i} ${r.name}: note row with owner/codemod`); continue; }
    if (!streams.has(r.owner)) fail.push(`${r.i} ${r.name}: owner '${r.owner}' is not a 5.0 stream`);
    if (r.codemod !== '-' && !catalogueIds.has(r.codemod)) fail.push(`${r.i} ${r.name}: codemod '${r.codemod}' not in catalogue.json`);
    if (!r.target) fail.push(`${r.i} ${r.name}: empty 5.0 target`);
  }
  return fail;
}

export function catalogueIds(path = CATALOGUE) {
  return new Set(JSON.parse(readFileSync(path, 'utf8')).transforms.map((t) => t.id));
}

const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const countBy = (rows, key) => rows.reduce((m, r) => ((m[r[key]] = (m[r[key]] || 0) + 1), m), {});
const table = (m) => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n');

export function render(rows, recordCount) {
  const count = (key) => countBy(rows, key);
  return [
    '# Appendix: component dispositions (GENERATED, do not edit)',
    '',
    'Generated by `node scripts/removal/gen-component-dispositions.mjs` from `docs/auraglass-5/component-inventory.json` (' + recordCount + ' records). Parent: `AURAGLASS_COMPONENT_REMEDIATION_PRD.md`. Authority order: architecture §11–§13, then the inventory disposition. Owning PRD ids use architecture §16 numbering. Owner is the 5.0 stream (PLAT, MAT, CMP, SURF, QUAL); Codemod is the SC-33 `migrate 4to5` transform id (`-` = no codemod needed).',
    '',
    'Destinations: **flagship** (T1 lineage seed), **core** (T0/T2 seed), **compat** (public 4.x name re-exported from `aura-glass/compat` with a prop adapter, removed in 6.0), **labs** (`@auraglass/labs`, rebuilt), **registry** (re-authored registry item/block), **removed** (deleted from the package; a target means the capability lives on elsewhere), **note** (inventory note record).',
    '',
    '## Totals by destination', '', '| Destination | Records |', '|---|---|', table(count('dest')), '',
    '## Totals by owner stream', '', '| Owner | Records |', '|---|---|', table(count('owner')), '',
    '## Totals by owning PRD', '', '| PRD | Records |', '|---|---|', table(count('prd')), '',
    '## Totals by 4.x disposition', '', '| Disposition | Records |', '|---|---|', table(count('disp')), '',
    '## Every record', '',
    '| # | Name | File | 4.x disposition | Public | 5.0 destination | 5.0 target | Owner | Codemod | Owning PRD | Reconciliation note |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    ...rows.map((r) => `| ${r.i} | ${esc(r.name)} | \`${esc(r.file || '-')}\` | ${r.disp} | ${r.pub ? 'yes' : 'no'} | ${r.dest} | ${esc(r.target)} | ${r.owner} | ${r.codemod} | ${r.prd} | ${esc(r.note)} |`),
    '',
  ].join('\n');
}

function main() {
  const records = JSON.parse(readFileSync(argOf('--inventory', DEFAULT_INVENTORY), 'utf8'));
  const { rows, unmapped } = buildRows(records);
  if (unmapped.length) { console.error('UNMAPPED records:\n' + unmapped.join('\n')); process.exit(1); }
  const rFail = checkReconciliation(rows);
  if (rFail.length) { console.error('R-01..R-18 reconciliation violations:\n' + rFail.join('\n')); process.exit(1); }
  const cFail = checkColumns(rows, catalogueIds());
  if (cFail.length) { console.error('owner/codemod column violations:\n' + cFail.join('\n')); process.exit(1); }
  const path = argOf('--out', DEFAULT_OUT);
  const text = render(rows, records.length);
  if (process.argv.includes('--check')) {
    const cur = readFileSync(path, 'utf8');
    if (cur !== text) { console.error('component-dispositions.md is stale; re-run the generator'); process.exit(1); }
  } else writeFileSync(path, text);
  console.log(JSON.stringify({ records: rows.length, byDest: countBy(rows, 'dest'), byOwner: countBy(rows, 'owner'), byPrd: countBy(rows, 'prd') }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
