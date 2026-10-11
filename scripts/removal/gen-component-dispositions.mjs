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
   Revived verbatim from docs/auraglass-5/archive/v1-19-prd/prd/appendix/. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const argOf = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const inventoryPath = argOf('--inventory', join(root, 'docs/auraglass-5/component-inventory.json'));
export const records = JSON.parse(readFileSync(inventoryPath, 'utf8'));

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
  GlassHoverCard: A('Popover', 'PRD-14', 'compat target Popover openOnHover (was PreviewCard)'),
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

const tokenOf = (name) => name.split(/[\s(/]/)[0];
const fileOf = (file) => (file || '').split(/[\s;]/)[0];
const isPublic = (r) => r.exported_from_root || (r.sub_exports && r.sub_exports.length > 0) || /^src\/(app-shell|workspace)\//.test(fileOf(r.file));

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
  const owner = dest === 'registry' ? 'plat' : dest === 'labs' ? 'labs' : dest === 'removed' ? 'plat' : dest === 'note' ? '-' : 'cmp';
  const codemod = dest === 'registry' ? 'removed->registry'
    : dest === 'labs' ? 'removed->labs'
    : dest === 'compat' ? 'compat-adapter'
    : dest === 'removed' ? 'removed'
    : dest === 'note' ? '-'
    : `rename:${e.target}`;
  rows.push({ i, name: r.name, file: fileOf(r.file), disp: r.disposition, pub: isPublic(r), dest, target: e.target, prd: e.prd, owner, codemod, note: [e.note, ...flags].filter(Boolean).join('; ') });
});
if (unmapped.length) { console.error('UNMAPPED records:\n' + unmapped.join('\n')); process.exit(1); }

const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const count = (key) => rows.reduce((m, r) => ((m[r[key]] = (m[r[key]] || 0) + 1), m), {});
const table = (m) => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n');
const out = [
  '# Appendix: component dispositions (GENERATED, do not edit)',
  '',
  'Generated by `node scripts/removal/gen-component-dispositions.mjs` from `docs/auraglass-5/component-inventory.json` (' + records.length + ' records). Parent: `AURAGLASS_COMPONENT_REMEDIATION_PRD.md`. Authority order: architecture §11–§13, then the inventory disposition. Owning PRD ids use architecture §16 numbering.',
  '',
  'Destinations: **flagship** (T1 lineage seed), **core** (T0/T2 seed), **compat** (public 4.x name re-exported from `aura-glass/compat` with a prop adapter, removed in 6.0), **labs** (`@auraglass/labs`, rebuilt), **registry** (re-authored registry item/block), **removed** (deleted from the package; a target means the capability lives on elsewhere), **note** (inventory note record).',
  '',
  '## Totals by destination', '', '| Destination | Records |', '|---|---|', table(count('dest')), '',
  '## Totals by owning PRD', '', '| PRD | Records |', '|---|---|', table(count('prd')), '',
  '## Totals by 4.x disposition', '', '| Disposition | Records |', '|---|---|', table(count('disp')), '',
  '## Every record', '',
  '| # | Name | File | 4.x disposition | Public | 5.0 destination | 5.0 target | Owner | Codemod | Owning PRD | Reconciliation note |',
  '|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.i} | ${esc(r.name)} | \`${esc(r.file || '-')}\` | ${r.disp} | ${r.pub ? 'yes' : 'no'} | ${r.dest} | ${esc(r.target)} | ${r.owner} | ${r.codemod} | ${r.prd} | ${esc(r.note)} |`),
  '',
];
/* §4.7 R-01..R-18 reconciliation decisions encoded as named assertions — a
   MAP edit that disagrees with the archive fails the run. */
const R_ASSERTIONS = [
  ['R-01', ['AdaptiveGlass', 'GlassOpacityEngine', 'GlassEngine', 'OptimizedGlassCore'], (r) => r.target === 'Surface'],
  ['R-02', ['GlassTransitions', 'GlassLiquidTransition'], (r) => r.target === 'SourceTransition'],
  ['R-03', ['GlassMetricCard', 'GlassKPICard', 'GlassKPI'], (r) => ['StatCard', 'GlassStatCard'].includes(r.target)],
  ['R-04', ['GlassCommandPalette'], (r) => r.target === 'CommandPalette' || (r.name === 'GlassCommand' && r.target === 'Command')],
  ['R-05', ['GlassTreeView'], (r) => r.target === 'TreeView'],
  ['R-06', ['GlassToastProvider'], (r) => r.target.startsWith('Toast')],
  ['R-07', ['GlassFileUpload'], (r) => r.target === 'FileUpload' || r.dest === 'removed'],
  ['R-08', ['GlassStepper'], (r) => ['Steps', 'NumberField'].includes(r.target)],
  ['R-09', ['GlassAppShell', 'GlassSplitPane'], (r) => ['AppShell', 'ResizablePanels'].includes(r.target)],
  ['R-10', ['LiquidGlassInspectorPanel', 'GlassInspectorPanel'], (r) => r.target.includes('AppShell') || r.target.includes('Inspector')],
  ['R-11', ['GlassPageTabs', 'GlassTabs'], (r) => r.target === 'Tabs'],
  ['R-12', ['GlassParticles', 'GlassParticleField', 'ParticleBackground'], (r) => r.dest === 'labs' || r.target.includes('Particle')],
  ['R-13', ['DynamicAtmosphere', 'AtmosphericBackground', 'AuroraBackground'], (r) => r.target.startsWith('Backdrop') || r.dest === 'labs'],
  ['R-14', ['GlassCombobox', 'GlassSelect'], (r) => ['Select', 'Combobox'].includes(r.target)],
  ['R-15', ['ToggleButtonGroup'], (r) => ['Toolbar', 'ButtonGroup', 'ToggleGroup'].includes(r.target)],
  ['R-16', ['GlassDataChart', 'ModularGlassDataChart'], (r) => ['ChartFrame', 'Chart'].includes(r.target) || r.dest === 'removed'],
  ['R-17', ['EnhancedGlassButton', 'GlassResizablePanel', 'GlassSplitPane', 'MobileGlassBottomSheet', 'GlassNavigation', 'GlassIconButton'], (r) => r.dest !== 'removed' || r.name === 'GlassSplitPane'],
  ['R-18', ['GlassPullToRefresh', 'GlassInfiniteScroll', 'MotionFramer', 'RovingFocusGroup'], (r) => r.dest === 'removed'],
];
const rFail = [];
for (const [rid, names, ok] of R_ASSERTIONS) {
  for (const n of names) {
    const recs = rows.filter((r) => r.name.split(/[\s(/]/)[0] === n);
    if (recs.length && !recs.every(ok)) rFail.push(`${rid}: ${n} -> ${recs.map((r) => `${r.dest}/${r.target}`).join(',')}`);
  }
}
if (rFail.length) { console.error('R-01..R-18 reconciliation violations:\n' + rFail.join('\n')); process.exit(1); }

const outPath = argOf('--out', join(root, 'docs/inventory/component-dispositions.md'));
const path = outPath;
const text = out.join('\n');
if (process.argv.includes('--check')) {
  const cur = readFileSync(path, 'utf8');
  if (cur !== text) { console.error('component-dispositions.md is stale; re-run the generator'); process.exit(1); }
} else writeFileSync(path, text);
console.log(JSON.stringify({ records: rows.length, byDest: count('dest'), byPrd: count('prd') }));
