/* Frozen 4.x story props for the W1 (shell + navigation) compat adapters —
   REQ-SURF-13 "every adapter renders from 4.x story props". Each entry copies
   the `args` (meta + Default story) and the props the Default story passes
   explicitly, from the named release/4.x story file (645735fce). Class names,
   inline styles and story-frame wrappers are omitted; children built from
   4.x sub-part exports that have no compat adapter (GlassTabsList/Trigger,
   GlassBreadcrumbItem, TreeItem, ...) are replaced by plain text, noted per
   entry. Callback args (`fn()`) are left to the test, which injects spies. */
import * as React from 'react';

export interface StoryArgs {
  /** release/4.x story file the props come from (or the source when no story exists). */
  story: string;
  props: Record<string, unknown>;
  /** Text from the props that the 5.0 rendering must contain (mapping check). */
  expectText?: string[];
}

const shellHeader = (
  <div>
    <div>Aura Ops</div>
    <div>North America workspace</div>
  </div>
);
const shellSidebar = (
  <nav aria-label="Workspace">
    {['Overview', 'Pipelines', 'Customers', 'Settings'].map((item) => (
      <a key={item} href="#">{item}</a>
    ))}
  </nav>
);

export const W1_STORY_ARGS: Record<string, StoryArgs> = {
  GlassAppShell: {
    story: 'src/components/layout/GlassAppShell.stories.tsx (Default)',
    props: { className: '', header: shellHeader, sidebar: shellSidebar, padding: 'lg', maxWidth: 'full', children: 'Service dashboard' },
    expectText: ['Aura Ops', 'Pipelines', 'Service dashboard'],
  },
  GlassHeader: {
    story: 'src/components/navigation/GlassHeader.stories.tsx (Default)',
    props: {
      className: '',
      logo: <div>Aura Control</div>,
      navigation: (
        <nav aria-label="Primary">
          {['Overview', 'Reports', 'Automation', 'Settings'].map((item) => <a key={item} href="#">{item}</a>)}
        </nav>
      ),
      search: { placeholder: 'Search reports' },
      actions: [{ id: 'alerts', label: 'Alerts', badge: 3 }, { id: 'invite', label: 'Invite' }],
      userMenu: {
        user: { name: 'Maya Chen', email: 'maya@example.com', status: 'online' },
        items: [{ id: 'profile', label: 'Profile' }, { id: 'settings', label: 'Settings' }, { id: 'sign-out', label: 'Sign out' }],
      },
    },
    expectText: ['Aura Control', 'Reports', 'Alerts', 'Invite', 'Maya Chen'],
  },
  GlassTopBar: {
    story: 'src/app-shell/components.tsx GlassTopBarProps (no 4.x story; props from the saas-admin-shell recipe shape)',
    props: { brand: 'Aura Ops', navigation: <a href="#">Overview</a>, actions: <button type="button">New report</button>, sticky: true },
    expectText: ['Aura Ops', 'Overview', 'New report'],
  },
  GlassSidebar: {
    story: 'src/components/navigation/GlassSidebar.stories.tsx (meta args + Default frame)',
    props: {
      items: [
        { id: 'home', label: 'Home', icon: <span>H</span> },
        { id: 'projects', label: 'Projects', icon: <span>P</span>, badge: 5 },
        { id: 'analytics', label: 'Analytics', icon: <span>A</span> },
        { id: 'settings', label: 'Settings', icon: <span>S</span> },
      ],
      activeId: 'projects',
      variant: 'floating',
      width: 'md',
      collapsible: true,
      collapsed: false,
      header: <div>Aura Ops</div>,
      footer: <div>Workspace online</div>,
    },
    expectText: ['Home', 'Projects', 'Aura Ops', 'Workspace online'],
  },
  GlassMain: {
    story: 'src/app-shell/components.tsx GlassMain (no 4.x story)',
    props: { children: 'Project operations' },
    expectText: ['Project operations'],
  },
  GlassPageHeader: {
    story: 'src/app-shell/components.tsx GlassPageHeaderProps (no 4.x story)',
    props: { eyebrow: 'Today', title: 'Service dashboard', description: 'North America workspace', actions: <button type="button">Export</button> },
    expectText: ['Today', 'Service dashboard', 'North America workspace', 'Export'],
  },
  GlassStatusBar: {
    story: 'src/app-shell/components.tsx GlassStatusBar (no 4.x story)',
    props: { children: 'Synced' },
    expectText: ['Synced'],
  },
  GlassInspector: {
    story: 'src/workspace/index.tsx GlassInspectorPanelProps (no 4.x story)',
    props: { title: 'Details', children: 'Hero image' },
    expectText: ['Details', 'Hero image'],
  },
  GlassMobileShell: {
    story: 'src/app-shell/components.tsx GlassMobileShellProps (no 4.x story)',
    props: { topBar: 'Inbox', bottomBar: <nav aria-label="Tabs"><a href="#">Home</a></nav>, children: 'Messages' },
    expectText: ['Inbox', 'Home', 'Messages'],
  },
  ZSpaceAppLayout: {
    story: 'src/components/layout/ZSpaceAppLayout.stories.tsx (Default)',
    props: {
      header: <div>Aura Workspace</div>,
      sidebar: <nav aria-label="Workspace sections"><a href="#">Overview</a><a href="#">Projects</a></nav>,
      children: 'Product operations',
      headerDepth: 40,
      sidebarDepth: 20,
      sidebarWidth: 240,
      sidebarPosition: 'left',
    },
    expectText: ['Aura Workspace', 'Projects', 'Product operations'],
  },
  GlassTabs: {
    story: 'src/components/navigation/GlassTabs.stories.tsx (meta args; GlassTabsList/Trigger children → text)',
    props: { defaultValue: 'overview', variant: 'default', 'aria-label': 'Workspace views', children: 'Overview' },
    expectText: ['Overview'],
  },
  GlassPageTabs: {
    story: 'src/components/navigation/GlassPageTabs.stories.tsx (meta args)',
    props: {
      tabs: [
        { value: 'overview', label: 'Overview', badge: '12', panel: <p>Twelve liquid-glass surfaces are ready for review.</p> },
        { value: 'activity', label: 'Activity', panel: <p>Token, layout, and interaction checks completed successfully.</p> },
        { value: 'settings', label: 'Settings', panel: <p>Configure density and motion preferences for this workspace.</p> },
      ],
      defaultValue: 'overview',
      orientation: 'horizontal',
      activationMode: 'automatic',
      renderPanel: true,
    },
    expectText: ['Overview', 'Activity', 'Settings', 'Twelve liquid-glass surfaces'],
  },
  GlassTabBar: {
    story: 'src/components/navigation/GlassTabBar.stories.tsx (meta args)',
    props: {
      tabs: [
        { id: 'home', label: 'Home', icon: <span>H</span> },
        { id: 'audience', label: 'Audience', icon: <span>U</span>, badge: 8 },
        { id: 'metrics', label: 'Metrics', icon: <span>M</span> },
        { id: 'settings', label: 'Settings', icon: <span>S</span> },
      ],
      activeTab: 1,
      scrollable: false,
      fullWidth: true,
      showLabels: true,
    },
    expectText: ['Home', 'Audience', 'Metrics', 'Settings'],
  },
  GlassWorkspaceTabs: {
    story: 'src/workspace/index.tsx GlassWorkspaceTabsProps (no 4.x story)',
    props: { value: 'files', children: 'Files' },
    expectText: ['Files'],
  },
  LiquidGlassTabBar: {
    story: 'src/components/navigation/LiquidGlassTabBar.stories.tsx (WithSearchTab)',
    props: {
      tabs: [{ id: 'home', label: 'Home' }, { id: 'search', label: 'Search' }, { id: 'library', label: 'Library' }],
      activeTab: 'home',
      searchTabId: 'search',
      minimizeBehavior: 'never',
    },
    expectText: ['Home', 'Library'],
  },
  GlassBottomNav: {
    story: 'src/components/navigation/GlassBottomNav.stories.tsx (Default)',
    props: {
      items: [
        { id: 'home', label: 'Home', icon: <span>H</span>, activeIcon: <span>H</span> },
        { id: 'search', label: 'Search', icon: <span>S</span>, activeIcon: <span>S</span> },
        { id: 'favorites', label: 'Saved', icon: <span>V</span>, activeIcon: <span>V</span>, badge: '3', badgeVariant: 'error' },
        { id: 'profile', label: 'Profile', icon: <span>P</span>, activeIcon: <span>P</span> },
      ],
      activeId: 'home',
      variant: 'default',
      size: 'md',
      showLabels: true,
      labelPosition: 'below',
    },
    expectText: ['Home', 'Search', 'Saved', 'Profile'],
  },
  LiquidGlassBottomAccessory: {
    story: 'src/components/navigation/LiquidGlassBottomAccessory.stories.tsx (Default)',
    props: { children: <><strong>Now playing</strong><span>Liquid Study - Aura System</span><span>2:14</span></> },
    expectText: ['Now playing', 'Liquid Study - Aura System'],
  },
  GlassMobileNav: {
    story: 'src/components/navigation/GlassMobileNav.stories.tsx (meta args + MobileNavFrame open)',
    props: {
      title: 'Aura Workspace',
      activePath: '/audience',
      navigation: [
        {
          id: 'primary',
          label: 'Workspace',
          items: [
            { id: 'home', label: 'Home', icon: <span>H</span>, href: '/home' },
            { id: 'audience', label: 'Audience', icon: <span>U</span>, href: '/audience', badge: '12', badgeVariant: 'secondary' },
            { id: 'metrics', label: 'Metrics', icon: <span>M</span>, href: '/metrics' },
            { id: 'settings', label: 'Settings', icon: <span>S</span>, href: '/settings' },
          ],
        },
      ],
      position: 'left',
      variant: 'overlay',
      id: 'mobile-navigation-sheet',
      open: true,
    },
    expectText: ['Aura Workspace', 'Workspace', 'Audience'],
  },
  GlassBreadcrumb: {
    story: 'src/components/navigation/GlassBreadcrumb.stories.tsx (Default; GlassBreadcrumbItem/Link children → the compound `items` form)',
    props: {
      size: 'md',
      elevation: 'level2',
      items: [
        { label: 'Workspaces', href: '#' },
        { label: 'Enterprise', href: '#' },
        { label: 'Reports', href: '#' },
        { label: 'Q2 Forecast', isCurrentPage: true },
      ],
    },
    expectText: ['Workspaces', 'Enterprise', 'Reports', 'Q2 Forecast'],
  },
  GlassBreadcrumbs: {
    story: 'src/app-shell/components.tsx GlassBreadcrumbsProps (no 4.x story)',
    props: { items: [{ label: 'Workspaces', href: '/workspaces' }, { label: 'Reports', href: '/reports' }, { label: 'Q2 Forecast' }] },
    expectText: ['Workspaces', 'Reports', 'Q2 Forecast'],
  },
  GlassPagination: {
    story: 'src/components/navigation/GlassPagination.stories.tsx (meta args)',
    props: { className: '', currentPage: 2, totalPages: 4, maxPageButtons: 4, size: 'sm', disabled: false, showFirstLast: false },
  },
  GlassCommandPalette: {
    story: 'src/components/interactive/GlassCommandPalette.stories.tsx (meta args + Default)',
    props: {
      open: true,
      placeholder: 'Search commands...',
      items: [
        { id: '1', label: 'New File', category: 'File', shortcut: 'Ctrl+N' },
        { id: '2', label: 'Open File', category: 'File', shortcut: 'Ctrl+O' },
        { id: '3', label: 'Save', category: 'File', shortcut: 'Ctrl+S' },
        { id: '4', label: 'Search', category: 'Navigation', shortcut: 'Ctrl+F' },
        { id: '5', label: 'Settings', category: 'Application', shortcut: 'Ctrl+,' },
      ],
    },
    expectText: ['New File', 'Open File', 'Settings', 'Ctrl+N'],
  },
  GlassCommand: {
    story: 'src/components/interactive/GlassCommand.stories.tsx (meta args + Default)',
    props: {
      placeholder: 'Type a command or search...',
      emptyMessage: 'No results found',
      loading: false,
      maxHeight: '300px',
      items: [
        { id: '1', label: 'Create new file', group: 'File' },
        { id: '2', label: 'Open file', group: 'File' },
        { id: '3', label: 'Search', group: 'Navigation' },
        { id: '4', label: 'Settings', group: 'Application' },
      ],
    },
    expectText: ['Create new file', 'Open file', 'Navigation'],
  },
  LiquidGlassCommandSurface: {
    story: 'src/components/interactive/LiquidGlassCommandSurface.stories.tsx (Default)',
    props: {
      open: true,
      placeholder: 'Search commands',
      items: [
        { id: 'open-dashboard', label: 'Open dashboard', description: 'Jump to the workspace overview', shortcut: 'Cmd 1' },
        { id: 'review-media', label: 'Review media queue', description: 'Inspect exports waiting for approval', shortcut: 'Cmd 2' },
        { id: 'toggle-liquid', label: 'Toggle Liquid preview', description: 'Switch the canvas into clear glass mode', shortcut: 'Cmd L' },
        { id: 'share-room', label: 'Share review room', description: 'Copy the current review room link', shortcut: 'Cmd Shift S' },
        { id: 'open-settings', label: 'Open material settings', description: 'Tune IOR, thickness, and performance policy', shortcut: 'Cmd ,' },
      ],
    },
    expectText: ['Open dashboard', 'Review media queue', 'Cmd 1'],
  },
  LiquidGlassTransitionProvider: {
    story: 'src/primitives/LiquidGlassSourceTransition.tsx (no 4.x story)',
    props: { children: 'Gallery', duration: 220 },
    expectText: ['Gallery'],
  },
  LiquidGlassSource: {
    story: 'src/primitives/LiquidGlassSourceTransition.tsx (no 4.x story)',
    props: { id: 'hero', children: 'Thumbnail' },
    expectText: ['Thumbnail'],
  },
  LiquidGlassDestination: {
    story: 'src/primitives/LiquidGlassSourceTransition.tsx (no 4.x story)',
    props: { id: 'hero', open: true, children: 'Detail' },
    expectText: ['Detail'],
  },
  GlassSplitPane: {
    story: 'src/components/layout/GlassSplitPane.stories.tsx (Default)',
    props: {
      className: '',
      left: <div><h3>Left Pane</h3><p>This is the left side content.</p></div>,
      right: <div><h3>Right Pane</h3><p>This is the right side content.</p></div>,
    },
    expectText: ['Left Pane', 'Right Pane'],
  },
  GlassSidebarRail: {
    story: 'src/app-shell/components.tsx GlassSidebarRailProps (no 4.x story)',
    props: {
      items: [
        { id: 'home', label: 'Home', active: true },
        { id: 'inbox', label: 'Inbox' },
        { id: 'archive', label: 'Archive', disabled: true },
      ],
    },
    expectText: ['Home', 'Inbox', 'Archive'],
  },
  GlassSidebarPanel: {
    story: 'src/app-shell/components.tsx GlassSidebarPanelProps (no 4.x story)',
    props: { title: 'Filters', footer: 'Reset', children: 'Status: Open' },
    expectText: ['Filters', 'Reset', 'Status: Open'],
  },
  GlassPage: {
    story: 'src/app-shell/components.tsx GlassPageProps (no 4.x story)',
    props: { constrained: true, children: 'Page body' },
    expectText: ['Page body'],
  },
  LiquidGlassInsetSidebar: {
    story: 'src/components/navigation/LiquidGlassInsetSidebar.stories.tsx (Default)',
    props: {
      items: [
        { id: 'home', label: 'Home', badge: 'Live' },
        { id: 'media', label: 'Media' },
        { id: 'library', label: 'Library' },
        { id: 'settings', label: 'Settings' },
      ],
      selectedId: 'home',
    },
    expectText: ['Home', 'Live', 'Media', 'Library'],
  },
  LiquidGlassInspectorPanel: {
    story: 'src/components/navigation/LiquidGlassInspectorPanel.stories.tsx (Default)',
    props: {
      open: true,
      selectionLabel: 'Hero image - final crop',
      sections: [
        { id: 'properties', title: 'Properties', content: <div>1200 x 900, sRGB, approved</div> },
        { id: 'access', title: 'Access', content: <div>Shared with design review</div> },
      ],
    },
    expectText: ['Hero image - final crop', 'Properties', 'Access'],
  },
  GlassNavigationMenu: {
    story: 'src/components/navigation/GlassNavigationMenu.stories.tsx (meta args + productItems)',
    props: {
      items: [
        { id: 'overview', label: 'Overview', icon: 'O', description: 'Health and adoption' },
        {
          id: 'workflows',
          label: 'Workflows',
          icon: 'W',
          badge: 4,
          children: [
            { id: 'workflows-live', label: 'Live runs', badge: 2 },
            { id: 'workflows-drafts', label: 'Drafts', badge: 2 },
          ],
        },
        { id: 'insights', label: 'Insights', icon: 'I', featured: true },
      ],
      defaultOpenItemIds: ['workflows'],
    },
    expectText: ['Overview', 'Workflows', 'Live runs', 'Insights'],
  },
};
