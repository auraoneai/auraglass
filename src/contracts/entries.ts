/* AuraGlass 5.0 contract-v1.0. CONTRACT-owned. build/exports.manifest.json is generated from this list by C0 and
   regenerated only by contract PRs. Value exports listed; type exports are free within the entry owner's barrel. */
export interface EntrySpec { subpath: string; source: string; owner: 'PLAT' | 'MAT' | 'CMP' | 'SURF'; ga: '5.0' | '5.1'; exports: readonly string[]; css?: string }
export const ENTRIES: readonly EntrySpec[] = [
  { subpath: '.', source: 'src/index.ts', owner: 'PLAT', ga: '5.0', exports: ['@see ROOT_EXPORTS'], css: 'dist/styles.css' },
  { subpath: './material', source: 'src/material/index.ts', owner: 'MAT', ga: '5.0', css: 'dist/material.css',
    exports: ['Surface', 'SurfaceGroup', 'Environment', 'ScrollEdge', 'ConcentricFrame', 'materialProps', 'useMaterialTier'] },
  { subpath: './theme', source: 'src/theme/public.ts', owner: 'MAT', ga: '5.0',
    exports: ['AuraGlassProvider', 'AuraGlassScript', 'auraGlassPrepaintScript', 'createGlassTheme', 'createBrandTheme', 'presets',
      'usePreference', 'useResolvedPreferences', 'usePreferenceActions', 'GlassPreferencesPanel'] },
  { subpath: './tokens', source: 'src/tokens/index.ts', owner: 'MAT', ga: '5.0', exports: ['tokens'], css: 'dist/tokens.css' },
  { subpath: './motion', source: 'src/motion/public.ts', owner: 'MAT', ga: '5.0',
    exports: ['MotionProvider', 'toMotionTransition', 'useDragDetents', 'useMomentum', 'SharedLayout', 'Shared', 'magnetic'] },
  { subpath: './primitives', source: 'src/primitives/index.ts', owner: 'CMP', ga: '5.0',
    exports: ['Slot', 'Portal', 'VisuallyHidden', 'FocusScope', 'Label', 'DismissableLayer'] },
  { subpath: './icons', source: 'src/icons/index.ts', owner: 'CMP', ga: '5.0', exports: ['@glyphs'] },   // + './icons/<name>' pattern
  { subpath: './forms', source: 'src/forms/index.ts', owner: 'CMP', ga: '5.0', exports: ['FormField', 'useFormField'] },
  { subpath: './app-shell', source: 'src/app-shell/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/app-shell.css',
    exports: ['AppShell', 'Sidebar', 'TopBar', 'StatusBar', 'Inspector', 'ResizablePanels', 'MobileShell'] },
  { subpath: './data', source: 'src/data/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/data.css',
    exports: ['Table', 'TreeView', 'FilterBar', 'Chip', 'KeyValueEditor', 'StatCard', 'Sparkline', 'ChartFrame'] },
  { subpath: './date', source: 'src/date/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/date.css',
    exports: ['DateField', 'TimeField', 'DatePicker', 'DateRangePicker', 'Calendar', 'TimePicker', 'RangeCalendar'] },
  { subpath: './ai', source: 'src/ai/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/ai.css',
    exports: ['Thread', 'Message', 'StreamingText', 'Composer', 'ToolCall', 'SourceList', 'Citation', 'Reasoning', 'AgentSteps', 'UsageMeter', 'ProviderErrorState'] },
  { subpath: './media', source: 'src/media/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/media.css',
    exports: ['MediaControls', 'NowPlayingBar', 'ImageViewer', 'CarouselRail', 'useMediaElement', 'MediaScrubber', 'formatMediaTime'] },
  { subpath: './backdrops', source: 'src/backdrops/index.ts', owner: 'SURF', ga: '5.0', css: 'dist/backdrops.css', exports: ['Backdrop'] },
  { subpath: './three', source: 'src/three/index.ts', owner: 'SURF', ga: '5.0', exports: [] }, // OI-01: no 4.x three component ported; exports: [] at 5.0, ga kept
  { subpath: './charts', source: 'src/charts/index.ts', owner: 'SURF', ga: '5.1', exports: ['Chart'] },
  { subpath: './compat', source: 'src/compat/index.ts', owner: 'PLAT', ga: '5.0', exports: ['@union of src/compat/<stream>/index.ts'] },
  // CSS-only and data entries (PLAT assembles from fragments/css/*):
  { subpath: './styles.css', source: 'build:css', owner: 'PLAT', ga: '5.0', exports: [] },
  { subpath: './tokens.css', source: 'build:css', owner: 'MAT', ga: '5.0', exports: [] },
  { subpath: './material.css', source: 'build:css', owner: 'MAT', ga: '5.0', exports: [] },
  { subpath: './tailwind.css', source: 'build:css', owner: 'PLAT', ga: '5.0', exports: [] },
  { subpath: './compat/tokens.css', source: 'build:css', owner: 'MAT', ga: '5.0', exports: [] },
  { subpath: './compat/globals.css', source: 'build:css', owner: 'PLAT', ga: '5.0', exports: [] },
  { subpath: './deprecations.json', source: 'build:deprecations', owner: 'PLAT', ga: '5.0', exports: [] },
  { subpath: './package.json', source: 'package.json', owner: 'PLAT', ga: '5.0', exports: [] },
];
/** './fonts.css' exists only if the D-31 licence clears (PLAT decision record); it is then added by a contract PR. */
export const ROOT_EXPORTS = {
  cmp: ['Button', 'IconButton', 'ButtonGroup', 'Toolbar', 'ToggleGroup', 'SegmentedControl', 'Switch', 'Slider', 'Checkbox',
    'CheckboxGroup', 'RadioGroup', 'TextField', 'SearchField', 'Select', 'Combobox', 'NumberField', 'Field', 'Fieldset', 'Form',
    'Dialog', 'AlertDialog', 'Sheet', 'Popover', 'Tooltip', 'Menu', 'ContextMenu', 'Menubar', 'Toast', 'useToast',
    'Text', 'Heading', 'Stack', 'Grid', 'Container', 'Icon',
    'Card', 'Badge', 'Avatar', 'AvatarGroup', 'Alert', 'Progress', 'Meter', 'Skeleton', 'Separator', 'Kbd', 'Accordion',
    'Collapsible', 'Link', 'ScrollArea', 'Rating', 'InlineEdit', 'FileUpload', 'ColorPicker', 'DescriptionList', 'ImageList',
    'Tour', 'EmptyState', 'ErrorState', 'LoadingState', 'VisuallyHidden'],
  surf: ['Tabs', 'TabBar', 'Breadcrumbs', 'Pagination', 'CommandPalette', 'Command', 'SourceTransition', 'Timeline', 'ActivityFeed'],
  mat: ['Surface', 'SurfaceGroup', 'Environment', 'ScrollEdge', 'ConcentricFrame', 'AuraGlassProvider', 'AuraGlassScript', 'usePreference'],
} as const;
