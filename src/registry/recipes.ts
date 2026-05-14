export type AuraGlassRecipeId =
  | "saas-dashboard"
  | "ai-command-center"
  | "media-player-surface"
  | "analytics-overview"
  | "settings-billing"
  | "kanban-workspace"
  | "calendar-schedule"
  | "collaborative-workspace"
  | "admin-data-table"
  | "ecommerce-product-panel"
  | "saas-admin-shell"
  | "ai-product-console"
  | "media-review-workspace"
  | "commerce-operations-panel"
  | "team-collaboration-hub"
  | "settings-and-billing-suite"
  | "analytics-command-center"
  | "calendar-operations-board"
  | "customer-support-console"
  | "creator-studio-dashboard";

export interface AuraGlassRecipeFile {
  path: string;
  content: string;
}

export interface AuraGlassRecipe {
  id: AuraGlassRecipeId;
  title: string;
  category:
    | "dashboard"
    | "ai"
    | "media"
    | "settings"
    | "collaboration"
    | "data"
    | "ecommerce";
  description: string;
  imports: string[];
  peerDependencies: string[];
  tokens: string[];
  accessibility: string[];
  performance: string[];
  files: AuraGlassRecipeFile[];
}

const cssImport = "import 'aura-glass/styles';";

export const auraGlassRecipes: AuraGlassRecipe[] = [
  {
    id: "saas-dashboard",
    title: "SaaS Dashboard Shell",
    category: "dashboard",
    description:
      "A compact premium dashboard shell with sidebar navigation, KPI cards, and a chart-ready analytics panel.",
    imports: [
      "GlassDashboard",
      "GlassSidebar",
      "GlassCard",
      "GlassDataChart",
      "GlassButton",
    ],
    peerDependencies: ["react", "react-dom", "chart.js", "react-chartjs-2"],
    tokens: [
      "--glass-bg-default",
      "--glass-border-default",
      "--glass-text-primary",
    ],
    accessibility: [
      "Use semantic page headings before dashboard metrics.",
      "Keep sidebar labels visible unless an icon-only mode has accessible labels.",
      "Verify chart text contrast against dark glass surfaces.",
    ],
    performance: [
      "Lazy-load chart-heavy panels when they are below the fold.",
      "Use compact dashboard widgets in constrained cards.",
    ],
    files: [
      {
        path: "SaasDashboardShell.tsx",
        content: `${cssImport}
import { GlassButton, GlassCard, GlassDashboard, GlassDataChart, GlassSidebar } from 'aura-glass';

export function SaasDashboardShell() {
  return (
    <GlassDashboard title="Revenue command" compact contained showToolbar>
      <GlassSidebar contained compact showToggle={false} />
      <GlassCard depth="medium" tint="neutral">
        <h2>Pipeline</h2>
        <p>$2.1M forecasted this quarter</p>
        <GlassButton size="sm">Open report</GlassButton>
      </GlassCard>
      <GlassCard depth="medium" tint="neutral">
        <GlassDataChart />
      </GlassCard>
    </GlassDashboard>
  );
}
`,
      },
    ],
  },
  {
    id: "ai-command-center",
    title: "AI Command Center",
    category: "ai",
    description:
      "A focused AI operations surface with command search, telemetry cards, and model activity lanes.",
    imports: [
      "GlassCommandPalette",
      "GlassCard",
      "GlassDataGrid",
      "GlassBadge",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-accent-info-fg", "--glass-bg-strong"],
    accessibility: [
      "Keep command labels descriptive.",
      "Preserve keyboard focus inside command-palette interactions.",
      "Do not stream status updates into assertive live regions unless user action requires it.",
    ],
    performance: [
      "Render model telemetry as static cards unless real-time updates are required.",
      "Keep canvas/WebGL effects out of the command surface.",
    ],
    files: [
      {
        path: "AiCommandCenter.tsx",
        content: `${cssImport}
import { GlassBadge, GlassCard, GlassCommandPalette, GlassDataGrid } from 'aura-glass';

export function AiCommandCenter() {
  return (
    <GlassCard depth="strong" tint="neutral">
      <GlassBadge variant="primary">AI operations</GlassBadge>
      <GlassCommandPalette contained compact open showFooter={false} />
      <GlassDataGrid />
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "media-player-surface",
    title: "Media Player Surface",
    category: "media",
    description:
      "A cinematic media surface with Liquid Glass controls, image viewing, and reduced-motion-safe visualizer usage.",
    imports: [
      "LiquidGlassMediaControls",
      "GlassImageViewer",
      "GlassMusicVisualizer",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-backdrop-blur", "--glass-overlay-bg"],
    accessibility: [
      "Expose play, pause, volume, and scrub controls with labels.",
      "Provide static media context for reduced-motion users.",
    ],
    performance: [
      "Disable analyzer loops when the player is paused.",
      "Use compact visualizer mode in cards and route previews.",
    ],
    files: [
      {
        path: "MediaPlayerSurface.tsx",
        content: `${cssImport}
import { GlassImageViewer, GlassMusicVisualizer, LiquidGlassMediaControls } from 'aura-glass';

export function MediaPlayerSurface() {
  return (
    <section aria-label="Media player">
      <GlassImageViewer contained compact height={280} />
      <LiquidGlassMediaControls playing currentTime={42} duration={180} />
      <GlassMusicVisualizer compact contained realTimeAnalysis={false} />
    </section>
  );
}
`,
      },
    ],
  },
  {
    id: "analytics-overview",
    title: "Analytics Overview",
    category: "dashboard",
    description:
      "A polished analytics landing surface with KPI cards, chart panels, and compact executive summary layout.",
    imports: ["GlassCard", "GlassDataChart", "GlassHeatmap", "GlassButton"],
    peerDependencies: ["react", "react-dom", "chart.js", "react-chartjs-2"],
    tokens: [
      "--glass-bg-default",
      "--glass-accent-info-fg",
      "--glass-border-default",
    ],
    accessibility: [
      "Provide text summaries for chart panels.",
      "Keep metric deltas readable without relying only on color.",
    ],
    performance: [
      "Render static chart snapshots for non-interactive summaries.",
      "Lazy-load dense heatmap panels below the fold.",
    ],
    files: [
      {
        path: "AnalyticsOverview.tsx",
        content: `${cssImport}
import { GlassButton, GlassCard, GlassDataChart, GlassHeatmap } from 'aura-glass';

export function AnalyticsOverview() {
  return (
    <section aria-label="Analytics overview">
      <GlassCard depth="medium" tint="neutral">
        <h2>Growth overview</h2>
        <p>MRR is up 18.6% across expansion accounts.</p>
        <GlassButton size="sm">Export report</GlassButton>
      </GlassCard>
      <GlassCard depth="medium" tint="neutral">
        <GlassDataChart />
      </GlassCard>
      <GlassCard depth="medium" tint="neutral">
        <GlassHeatmap />
      </GlassCard>
    </section>
  );
}
`,
      },
    ],
  },
  {
    id: "settings-billing",
    title: "Settings and Billing Page",
    category: "settings",
    description:
      "A billing/settings recipe with tabs, form surfaces, visible validation space, and low-motion defaults.",
    imports: ["GlassButton", "GlassCard", "GlassForm", "GlassTabs"],
    peerDependencies: ["react", "react-dom", "react-hook-form"],
    tokens: ["--glass-radius-lg", "--glass-border-focus"],
    accessibility: [
      "Use visible labels for billing fields.",
      "Keep validation text adjacent to each input.",
      "Preserve focus-visible rings on tab and form controls.",
    ],
    performance: [
      "Keep settings pages mostly static.",
      "Avoid continuous animation in form-heavy flows.",
    ],
    files: [
      {
        path: "SettingsBillingPage.tsx",
        content: `${cssImport}
import { GlassButton, GlassCard, GlassForm, GlassTabs } from 'aura-glass';

export function SettingsBillingPage() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <GlassTabs value="billing" />
      <GlassForm />
      <GlassButton>Save changes</GlassButton>
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "kanban-workspace",
    title: "Kanban Workspace",
    category: "data",
    description:
      "A contained workflow board with seeded columns, compact cards, and action controls suitable for app panels.",
    imports: ["GlassCard", "GlassKanbanBoard"],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-bg-default", "--glass-border-default"],
    accessibility: [
      "Keep column names visible.",
      "Use card click handlers with keyboard-accessible details.",
    ],
    performance: [
      "Use compact cards in constrained panels.",
      "Disable drag interactions in read-only preview contexts.",
    ],
    files: [
      {
        path: "KanbanWorkspace.tsx",
        content: `${cssImport}
import { GlassCard, GlassKanbanBoard } from 'aura-glass';

const columns = [
  {
    id: 'planned',
    title: 'Planned',
    color: '#38bdf8',
    cards: [{ id: 'brief', title: 'Brief launch page', priority: 'medium' as const, tags: ['docs'] }],
  },
  {
    id: 'active',
    title: 'Active',
    color: '#a3e635',
    cards: [{ id: 'qa', title: 'Run visual QA', priority: 'high' as const, tags: ['qa'] }],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#f59e0b',
    cards: [{ id: 'tokens', title: 'Token audit', priority: 'low' as const, tags: ['tokens'] }],
  },
];

export function KanbanWorkspace() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <GlassKanbanBoard
        columns={columns}
        compact
        contained
        enableDrag={false}
        showActions={false}
        maxHeight={360}
      />
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "calendar-schedule",
    title: "Calendar Schedule Page",
    category: "dashboard",
    description:
      "A schedule surface for bookings, launches, and operations reviews with a glass calendar centerpiece.",
    imports: ["GlassCalendar", "GlassCard", "GlassButton"],
    peerDependencies: ["react", "react-dom", "date-fns"],
    tokens: ["--glass-bg-default", "--glass-radius-lg", "--glass-border-focus"],
    accessibility: [
      "Expose selected dates and events as text.",
      "Keep keyboard focus visible when navigating dates.",
    ],
    performance: [
      "Keep calendar event counts bounded in month views.",
      "Avoid animating every date cell during route transitions.",
    ],
    files: [
      {
        path: "CalendarSchedulePage.tsx",
        content: `${cssImport}
import { GlassButton, GlassCalendar, GlassCard } from 'aura-glass';

export function CalendarSchedulePage() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <header>
        <h2>Launch schedule</h2>
        <GlassButton size="sm">Create event</GlassButton>
      </header>
      <GlassCalendar />
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "collaborative-workspace",
    title: "Collaborative Workspace",
    category: "collaboration",
    description:
      "A realtime-ready workspace recipe with contained collaboration UI and inert static-preview defaults.",
    imports: ["CollaborativeGlassWorkspace", "GlassCard"],
    peerDependencies: ["react", "react-dom", "socket.io-client"],
    tokens: ["--glass-accent-success-fg", "--glass-surface"],
    accessibility: [
      "Announce collaboration activity without interrupting editing.",
      "Keep presence labels available to assistive tech.",
    ],
    performance: [
      "Throttle cursor and presence updates.",
      "Keep previews inert when disconnected from realtime services.",
    ],
    files: [
      {
        path: "CollaborativeWorkspace.tsx",
        content: `${cssImport}
import { CollaborativeGlassWorkspace, GlassCard } from 'aura-glass';

export function CollaborativeWorkspace() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <CollaborativeGlassWorkspace compact contained />
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "admin-data-table",
    title: "Admin Data Table",
    category: "data",
    description:
      "A data-heavy admin surface with table/grid primitives, action cards, and compact responsive layout guidance.",
    imports: ["GlassCard", "GlassDataGrid", "GlassDataTable", "GlassButton"],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-bg-default", "--glass-border-default"],
    accessibility: [
      "Preserve column headers and row labels.",
      "Use buttons with clear accessible names for row actions.",
    ],
    performance: [
      "Use virtualization for large data sets.",
      "Keep filters and summaries outside continuously animated containers.",
    ],
    files: [
      {
        path: "AdminDataTable.tsx",
        content: `${cssImport}
import { GlassButton, GlassCard, GlassDataGrid, GlassDataTable } from 'aura-glass';

export function AdminDataTable() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <GlassButton size="sm">Invite user</GlassButton>
      <GlassDataGrid />
      <GlassDataTable />
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "ecommerce-product-panel",
    title: "Ecommerce Product Panel",
    category: "ecommerce",
    description:
      "A polished product recommendation and cart surface for premium commerce experiences.",
    imports: [
      "GlassProductRecommendations",
      "GlassSmartShoppingCart",
      "GlassCard",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-accent-success-fg", "--glass-radius-lg"],
    accessibility: [
      "Expose product names, prices, quantities, and cart actions as text.",
      "Keep recommendation cards keyboard reachable.",
    ],
    performance: [
      "Defer recommendation refreshes while users interact with the cart.",
      "Use stable image dimensions for product media.",
    ],
    files: [
      {
        path: "EcommerceProductPanel.tsx",
        content: `${cssImport}
import { GlassCard, GlassProductRecommendations, GlassSmartShoppingCart } from 'aura-glass';

export function EcommerceProductPanel() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <GlassProductRecommendations />
      <GlassSmartShoppingCart />
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "saas-admin-shell",
    title: "SaaS Admin Shell",
    category: "dashboard",
    description:
      "A 3.2 app-shell recipe with native top bar, sidebar rail, page header, status bar, cards, and first-party icons.",
    imports: [
      "GlassAppShell",
      "GlassTopBar",
      "GlassSidebarRail",
      "GlassMain",
      "GlassPage",
      "GlassPageHeader",
      "GlassStatusBar",
      "GlassCard",
      "GlassButton",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: [
      "--glass-theme-brand",
      "--glass-theme-surface",
      "--glass-theme-focus",
    ],
    accessibility: [
      "Keep app navigation inside labelled landmarks.",
      "Use accessible labels for icon-only rail controls.",
    ],
    performance: [
      "Keep app shell navigation static across route transitions.",
      "Lazy-load analytics panels below the first viewport.",
    ],
    files: [
      {
        path: "SaasAdminShell.tsx",
        content: `${cssImport}
import { GlassButton, GlassCard } from 'aura-glass';
import { GlassAppShell, GlassMain, GlassPage, GlassPageHeader, GlassSidebarRail, GlassStatusBar, GlassTopBar } from 'aura-glass/app-shell';
import { DashboardIcon, SettingsIcon, UsersIcon } from 'aura-glass/icons/navigation';

export function SaasAdminShell() {
  const nav = [
    { id: 'dash', label: 'Dashboard', icon: <DashboardIcon />, active: true },
    { id: 'users', label: 'Users', icon: <UsersIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <GlassAppShell
      topBar={<GlassTopBar brand="AuraGlass Admin" actions={<GlassButton size="sm">Invite</GlassButton>} />}
      sidebar={<GlassSidebarRail items={nav} />}
      statusBar={<GlassStatusBar>Production workspace ready</GlassStatusBar>}
    >
      <GlassMain>
        <GlassPage>
          <GlassPageHeader title="Revenue operations" description="Monitor account health, expansion, and activation without external app chrome." />
          <GlassCard depth="medium" tint="neutral">
            <h2>Pipeline health</h2>
            <p>$2.4M weighted pipeline across 128 accounts.</p>
          </GlassCard>
        </GlassPage>
      </GlassMain>
    </GlassAppShell>
  );
}
`,
      },
    ],
  },
  {
    id: "ai-product-console",
    title: "AI Product Console",
    category: "ai",
    description:
      "A command-centered AI console using AuraGlass app shell, command dock, telemetry cards, and first-party AI icons.",
    imports: [
      "GlassAppShell",
      "GlassCommandDock",
      "GlassMain",
      "GlassPage",
      "GlassPageHeader",
      "GlassCard",
      "GlassBadge",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-theme-brand", "--glass-accent-info-fg"],
    accessibility: [
      "Use a visible label or aria-label for the command input.",
      "Keep live model updates polite unless user-triggered.",
    ],
    performance: [
      "Render model telemetry as static cards until realtime updates are needed.",
      "Avoid continuous canvas effects in the command path.",
    ],
    files: [
      {
        path: "AiProductConsole.tsx",
        content: `${cssImport}
import { GlassBadge, GlassCard } from 'aura-glass';
import { GlassAppShell, GlassCommandDock, GlassMain, GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { SearchIcon, SparkIcon } from 'aura-glass/icons/ai';

export function AiProductConsole() {
  return (
    <GlassAppShell>
      <GlassMain>
        <GlassPage>
          <GlassPageHeader title="AI command center" description="A dependency-free AI product console with model telemetry and command search." actions={<GlassBadge variant="primary">Live</GlassBadge>} />
          <GlassCommandDock input={<label><span className="sr-only">Ask AuraGlass</span><SearchIcon /> <input placeholder="Summarize workspace telemetry" /></label>} actions={<SparkIcon />} />
          <GlassCard depth="medium" tint="neutral">
            <h2>Model quality</h2>
            <p>98% grounded responses across the last 42 docs.</p>
          </GlassCard>
        </GlassPage>
      </GlassMain>
    </GlassAppShell>
  );
}
`,
      },
    ],
  },
  {
    id: "media-review-workspace",
    title: "Media Review Workspace",
    category: "media",
    description:
      "A creator/media review surface with workspace panels, timeline rail, media controls, and first-party media icons.",
    imports: [
      "GlassWorkspace",
      "GlassWorkspaceHeader",
      "GlassCanvasArea",
      "GlassTimelineRail",
      "LiquidGlassMediaControls",
      "GlassMusicVisualizer",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-theme-surface", "--glass-backdrop-blur"],
    accessibility: [
      "Expose play state, clip names, and timeline positions as text.",
      "Keep review actions reachable by keyboard.",
    ],
    performance: [
      "Pause analyzers when preview playback is stopped.",
      "Use stable media frame dimensions to avoid layout shift.",
    ],
    files: [
      {
        path: "MediaReviewWorkspace.tsx",
        content: `${cssImport}
import { LiquidGlassMediaControls, GlassMusicVisualizer } from 'aura-glass';
import { GlassCanvasArea, GlassTimelineRail, GlassWorkspace, GlassWorkspaceHeader } from 'aura-glass/workspace';
import { PlayIcon, VideoIcon } from 'aura-glass/icons/media';

export function MediaReviewWorkspace() {
  return (
    <GlassWorkspace header={<GlassWorkspaceHeader title="Media review" description="Review clips, notes, and audio intensity from one glass workspace." />}>
      <GlassCanvasArea><VideoIcon size={48} /><p>Hero cut preview</p></GlassCanvasArea>
      <LiquidGlassMediaControls playing currentTime={42} duration={180} />
      <GlassTimelineRail label="Timeline"><span><PlayIcon /> Intro sequence</span><GlassMusicVisualizer compact contained realTimeAnalysis={false} /></GlassTimelineRail>
    </GlassWorkspace>
  );
}
`,
      },
    ],
  },
  {
    id: "commerce-operations-panel",
    title: "Commerce Operations Panel",
    category: "ecommerce",
    description:
      "An ecommerce operations shell with native cards, product recommendations, cart state, and first-party status icons.",
    imports: [
      "GlassCard",
      "GlassSmartShoppingCart",
      "GlassProductRecommendations",
      "GlassButton",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-theme-brand", "--glass-accent-success-fg"],
    accessibility: [
      "Expose prices, inventory state, and cart quantity as text.",
      "Do not rely on color alone for fulfillment status.",
    ],
    performance: [
      "Debounce cart recalculation during quantity changes.",
      "Lazy-load recommendation imagery below the operation summary.",
    ],
    files: [
      {
        path: "CommerceOperationsPanel.tsx",
        content: `${cssImport}
import { GlassButton, GlassCard, GlassProductRecommendations, GlassSmartShoppingCart } from 'aura-glass';
import { SuccessIcon, WarningIcon } from 'aura-glass/icons/status';

export function CommerceOperationsPanel() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <header><h2>Commerce operations</h2><GlassButton size="sm">Review orders</GlassButton></header>
      <p><SuccessIcon /> 94 orders cleared fulfillment.</p>
      <p><WarningIcon /> 6 carts need payment follow-up.</p>
      <GlassProductRecommendations />
      <GlassSmartShoppingCart />
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "team-collaboration-hub",
    title: "Team Collaboration Hub",
    category: "collaboration",
    description:
      "A collaboration hub with workspace shell, inspector panel, realtime-ready collaboration surface, and first-party collaboration icons.",
    imports: [
      "GlassWorkspace",
      "GlassInspectorPanel",
      "CollaborativeGlassWorkspace",
      "GlassCard",
    ],
    peerDependencies: ["react", "react-dom", "socket.io-client"],
    tokens: ["--glass-theme-surface", "--glass-accent-success-fg"],
    accessibility: [
      "Announce presence changes politely.",
      "Keep participant names visible and not only represented by avatars.",
    ],
    performance: [
      "Throttle presence updates in dense workspaces.",
      "Disconnect realtime transport when the route is hidden.",
    ],
    files: [
      {
        path: "TeamCollaborationHub.tsx",
        content: `${cssImport}
import { CollaborativeGlassWorkspace, GlassCard } from 'aura-glass';
import { GlassInspectorPanel, GlassWorkspace } from 'aura-glass/workspace';
import { UsersIcon } from 'aura-glass/icons/collaboration';

export function TeamCollaborationHub() {
  return (
    <GlassWorkspace inspector={<GlassInspectorPanel title="Presence"><UsersIcon /> 8 teammates online</GlassInspectorPanel>}>
      <GlassCard depth="medium" tint="neutral">
        <CollaborativeGlassWorkspace compact contained />
      </GlassCard>
    </GlassWorkspace>
  );
}
`,
      },
    ],
  },
  {
    id: "settings-and-billing-suite",
    title: "Settings and Billing Suite",
    category: "settings",
    description:
      "A complete settings suite with app-shell layout, form surfaces, billing actions, validation space, and native icons.",
    imports: [
      "GlassCard",
      "GlassButton",
      "GlassForm",
      "GlassTabs",
      "GlassWorkflowShell",
    ],
    peerDependencies: ["react", "react-dom", "react-hook-form"],
    tokens: ["--glass-theme-focus", "--glass-border-focus"],
    accessibility: [
      "Use labels and validation messages for every billing field.",
      "Keep destructive billing actions explicitly labelled.",
    ],
    performance: [
      "Keep settings views mostly static while users type.",
      "Debounce validation and avoid continuous animation in forms.",
    ],
    files: [
      {
        path: "SettingsAndBillingSuite.tsx",
        content: `${cssImport}
import { GlassButton, GlassCard, GlassForm, GlassTabs } from 'aura-glass';
import { GlassWorkflowShell } from 'aura-glass/workspace';
import { SettingsIcon } from 'aura-glass/icons/navigation';

export function SettingsAndBillingSuite() {
  return (
    <GlassWorkflowShell title="Settings and billing" description="Account controls, plan state, and billing workflow without external form chrome." actions={<SettingsIcon />}>
      <GlassCard depth="medium" tint="neutral">
        <GlassTabs value="billing" />
        <GlassForm />
        <GlassButton>Save billing settings</GlassButton>
      </GlassCard>
    </GlassWorkflowShell>
  );
}
`,
      },
    ],
  },
  {
    id: "analytics-command-center",
    title: "Analytics Command Center",
    category: "dashboard",
    description:
      "An executive analytics command center with dashboard shell, KPI card, chart panel, command dock, and first-party data icons.",
    imports: [
      "GlassCard",
      "GlassDataChart",
      "GlassHeatmap",
      "GlassCommandDock",
    ],
    peerDependencies: ["react", "react-dom", "chart.js", "react-chartjs-2"],
    tokens: ["--glass-theme-brand", "--glass-accent-info-fg"],
    accessibility: [
      "Provide text summaries for chart-heavy panels.",
      "Use readable metric deltas that do not rely only on color.",
    ],
    performance: [
      "Lazy-load heatmaps and dense analytics panels below the fold.",
      "Cache chart data while filters are idle.",
    ],
    files: [
      {
        path: "AnalyticsCommandCenter.tsx",
        content: `${cssImport}
import { GlassCard, GlassDataChart, GlassHeatmap } from 'aura-glass';
import { GlassCommandDock, GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { DatabaseIcon, SearchIcon } from 'aura-glass/icons/data';

export function AnalyticsCommandCenter() {
  return (
    <GlassPage>
      <GlassPageHeader title="Analytics command center" description="Filter revenue, retention, and usage from one command surface." actions={<DatabaseIcon />} />
      <GlassCommandDock input={<span><SearchIcon /> Ask for cohort performance</span>} />
      <GlassCard depth="medium" tint="neutral"><GlassDataChart /><GlassHeatmap /></GlassCard>
    </GlassPage>
  );
}
`,
      },
    ],
  },
  {
    id: "calendar-operations-board",
    title: "Calendar Operations Board",
    category: "dashboard",
    description:
      "A schedule operations board with native workspace layout, calendar component, event summary, and navigation icons.",
    imports: [
      "GlassCalendar",
      "GlassCard",
      "GlassButton",
      "GlassWorkspacePanel",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-theme-surface", "--glass-theme-focus"],
    accessibility: [
      "Expose selected dates and event times as text.",
      "Keep date navigation keyboard reachable.",
    ],
    performance: [
      "Load one visible date range at a time.",
      "Avoid re-rendering all event chips during filter updates.",
    ],
    files: [
      {
        path: "CalendarOperationsBoard.tsx",
        content: `${cssImport}
import { GlassButton, GlassCalendar, GlassCard } from 'aura-glass';
import { GlassWorkspacePanel } from 'aura-glass/workspace';
import { CalendarIcon } from 'aura-glass/icons/navigation';

export function CalendarOperationsBoard() {
  return (
    <GlassWorkspacePanel title="Launch calendar" actions={<GlassButton size="sm">New event</GlassButton>}>
      <p><CalendarIcon /> May launch sequence</p>
      <GlassCard depth="medium" tint="neutral"><GlassCalendar /></GlassCard>
    </GlassWorkspacePanel>
  );
}
`,
      },
    ],
  },
  {
    id: "customer-support-console",
    title: "Customer Support Console",
    category: "data",
    description:
      "A support operations console with app shell, table/grid surfaces, notifications, and first-party status icons.",
    imports: [
      "GlassDataGrid",
      "GlassDataTable",
      "GlassNotificationCenter",
      "GlassCard",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-theme-focus", "--glass-accent-warning-fg"],
    accessibility: [
      "Preserve ticket IDs, status, priority, and assigned agent as text.",
      "Use polite live-region semantics for notifications.",
    ],
    performance: [
      "Virtualize large ticket queues.",
      "Batch notification updates during import bursts.",
    ],
    files: [
      {
        path: "CustomerSupportConsole.tsx",
        content: `${cssImport}
import { GlassCard, GlassDataGrid, GlassDataTable, GlassNotificationCenter } from 'aura-glass';
import { AlertCircleIcon, SuccessIcon } from 'aura-glass/icons/status';

export function CustomerSupportConsole() {
  return (
    <GlassCard depth="medium" tint="neutral">
      <h2>Support queue</h2>
      <p><AlertCircleIcon /> 12 escalations</p>
      <p><SuccessIcon /> 48 tickets resolved today</p>
      <GlassDataGrid />
      <GlassDataTable />
      <GlassNotificationCenter />
    </GlassCard>
  );
}
`,
      },
    ],
  },
  {
    id: "creator-studio-dashboard",
    title: "Creator Studio Dashboard",
    category: "media",
    description:
      "A creator studio dashboard with workspace shell, media widgets, upload surface, and first-party media/data icons.",
    imports: [
      "GlassFileUpload",
      "GlassImageViewer",
      "GlassMusicVisualizer",
      "GlassCard",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: ["--glass-theme-brand", "--glass-backdrop-blur"],
    accessibility: [
      "Expose upload status and media metadata as text.",
      "Keep media actions reachable by keyboard.",
    ],
    performance: [
      "Use stable preview dimensions for uploaded media.",
      "Disable analyzer loops under reduced motion.",
    ],
    files: [
      {
        path: "CreatorStudioDashboard.tsx",
        content: `${cssImport}
import { GlassCard, GlassFileUpload, GlassImageViewer, GlassMusicVisualizer } from 'aura-glass';
import { GlassWorkflowShell } from 'aura-glass/workspace';
import { ImageIcon, VideoIcon } from 'aura-glass/icons/media';

export function CreatorStudioDashboard() {
  return (
    <GlassWorkflowShell title="Creator studio" description="Plan, upload, preview, and review media in one glass-native studio.">
      <GlassCard depth="medium" tint="neutral">
        <p><ImageIcon /> Asset library</p>
        <p><VideoIcon /> Review queue</p>
        <GlassFileUpload compact contained showActions={false} />
        <GlassImageViewer contained compact height={260} />
        <GlassMusicVisualizer compact contained realTimeAnalysis={false} />
      </GlassCard>
    </GlassWorkflowShell>
  );
}
`,
      },
    ],
  },
];

export const getAuraGlassRecipe = (id: string): AuraGlassRecipe | undefined =>
  auraGlassRecipes.find((recipe) => recipe.id === id);
