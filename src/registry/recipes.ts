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
  | "creator-studio-dashboard"
  | "ai-ops-control-room"
  | "semantic-search-console"
  | "vision-review-workbench"
  | "collaboration-room-console"
  | "support-triage-workspace"
  | "release-command-center"
  | "developer-docs-portal"
  | "marketing-launch-kit";

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
    | "ecommerce"
    | "support"
    | "release"
    | "docs"
    | "marketing";
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
  {
    id: "ai-ops-control-room",
    title: "AI Ops Control Room",
    category: "ai",
    description:
      "A 3.3 AI operations room for provider readiness, usage budgets, rate limits, and prompt-safety review that defaults to provider-unconfigured status.",
    imports: [
      "GlassBadge",
      "GlassButton",
      "GlassCard",
      "GlassErrorState",
      "GlassLoadingState",
      "GlassMetricChip",
      "GlassProgress",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: [
      "--glass-theme-brand",
      "--glass-accent-warning-fg",
      "--glass-accent-info-fg",
    ],
    accessibility: [
      "Use warning severity for provider-unconfigured states without interrupting page navigation.",
      "Expose budget, rate-limit, and review states as text in addition to color.",
      "Keep prompt-safety review actions keyboard reachable.",
    ],
    performance: [
      "Poll provider readiness on an interval only after credentials are configured.",
      "Render usage and cost panels as static summaries until realtime telemetry is enabled.",
    ],
    files: [
      {
        path: "AiOpsControlRoom.tsx",
        content: `${cssImport}
import { GlassBadge, GlassButton, GlassCard, GlassErrorState, GlassLoadingState, GlassMetricChip, GlassProgress } from 'aura-glass';
import { GlassCommandDock, GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { CommandIcon, SparkIcon, ZapIcon } from 'aura-glass/icons/ai';
import { AlertTriangleIcon, InfoIcon } from 'aura-glass/icons/status';

const safetyReviews = ['PII redaction', 'Prompt injection scan', 'Grounding evidence'];

export function AiOpsControlRoom() {
  return (
    <GlassPage>
      <GlassPageHeader
        title="AI ops control room"
        description="Track provider readiness, spend, rate limits, and prompt-safety review without assuming hosted credentials are present."
        actions={<GlassBadge variant="warning"><AlertTriangleIcon /> Provider unconfigured</GlassBadge>}
      />
      <GlassCommandDock input={<span><CommandIcon /> Review usage policy</span>} actions={<SparkIcon />} />
      <section className="glass-grid glass-gap-4 md:glass-grid-cols-3" aria-label="AI operations metrics">
        <GlassMetricChip label="Daily spend" value="$0.00" delta="No provider key" intent="warning" icon={<InfoIcon />} />
        <GlassMetricChip label="Rate limit" value="Paused" delta="Fail-closed" intent="warning" icon={<ZapIcon />} />
        <GlassMetricChip label="Prompt reviews" value={safetyReviews.length} delta="Manual queue" intent="success" icon={<SparkIcon />} />
      </section>
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
        <h2>Cost budget</h2>
        <GlassProgress value={18} variant="warning" label="Monthly AI budget reserved" showValue animated={false} />
        <GlassLoadingState label="Waiting for provider telemetry" description="Usage polling starts only after credentials and API auth are configured." variant="skeleton" rows={3} />
      </GlassCard>
      <GlassErrorState
        severity="warning"
        title="AI provider is not configured"
        description="Set provider credentials and hosted-runtime auth before enabling generation, semantic search, or vision actions."
        details={<code>OPENAI_API_KEY and provider feature flags are unset.</code>}
      />
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-3 glass-p-4">
        <h2>Prompt safety review</h2>
        {safetyReviews.map((item) => <p key={item}><SparkIcon /> {item}</p>)}
        <GlassButton size="sm" disabled>Run review after provider setup</GlassButton>
      </GlassCard>
    </GlassPage>
  );
}
`,
      },
    ],
  },
  {
    id: "semantic-search-console",
    title: "Semantic Search Console",
    category: "ai",
    description:
      "A 3.3 search console with indexed-document status, query testing, relevance tuning, loading/empty panels, and provider-unconfigured messaging.",
    imports: [
      "GlassBadge",
      "GlassButton",
      "GlassCard",
      "GlassDataGrid",
      "GlassEmptyState",
      "GlassErrorState",
      "GlassLoadingState",
      "GlassSearchField",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: [
      "--glass-theme-surface",
      "--glass-border-focus",
      "--glass-accent-info-fg",
    ],
    accessibility: [
      "Label search input and relevance controls clearly.",
      "Keep empty search results announced as polite status text.",
      "Do not expose semantic scores through color alone.",
    ],
    performance: [
      "Debounce query previews and cancel stale provider requests.",
      "Load document chunks in pages instead of rendering the full index.",
    ],
    files: [
      {
        path: "SemanticSearchConsole.tsx",
        content: `${cssImport}
import { GlassBadge, GlassButton, GlassCard, GlassDataGrid, GlassEmptyState, GlassErrorState, GlassLoadingState, GlassSearchField } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { DatabaseIcon, FileIcon, SearchIcon } from 'aura-glass/icons/data';

export function SemanticSearchConsole() {
  return (
    <GlassPage>
      <GlassPageHeader
        title="Semantic search console"
        description="Inspect indexed documents, run safe query tests, and tune relevance once provider-backed search is configured."
        actions={<GlassBadge variant="secondary"><DatabaseIcon /> 0 indexed docs</GlassBadge>}
      />
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
        <GlassSearchField label="Test query" placeholder="Search indexed documentation" value="" onChange={() => undefined} />
        <GlassErrorState
          severity="warning"
          title="Search provider unconfigured"
          description="Connect embeddings and vector index credentials before query execution. The UI stays fail-closed until then."
          details={<code>Embeddings and vector index are disabled.</code>}
        />
      </GlassCard>
      <section className="glass-grid glass-gap-4 md:glass-grid-cols-2" aria-label="Search readiness">
        <GlassLoadingState label="Index readiness" description="Waiting for a configured indexing provider." variant="progress" progress={0} />
        <GlassEmptyState
          variant="search"
          title="No indexed documents"
          description="Upload or index documents after the provider route returns ready."
          icon={<FileIcon />}
        />
      </section>
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-3 glass-p-4">
        <h2><SearchIcon /> Relevance tuning</h2>
        <p>Score threshold, chunk size, and source weighting controls should connect only to authenticated hosted routes.</p>
        <GlassButton size="sm" disabled>Run query after setup</GlassButton>
        <GlassDataGrid />
      </GlassCard>
    </GlassPage>
  );
}
`,
      },
    ],
  },
  {
    id: "vision-review-workbench",
    title: "Vision Review Workbench",
    category: "ai",
    description:
      "A 3.3 image-analysis workbench for upload review, OCR/object/safe-search panels, and explicit missing-provider state.",
    imports: [
      "GlassBadge",
      "GlassCard",
      "GlassEmptyState",
      "GlassErrorState",
      "GlassFileUpload",
      "GlassImageViewer",
      "GlassLoadingState",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: [
      "--glass-theme-brand",
      "--glass-backdrop-blur",
      "--glass-accent-warning-fg",
    ],
    accessibility: [
      "Provide text alternatives for uploaded images before automated analysis.",
      "Keep OCR and object-detection results available as plain text.",
      "Use polite status updates for analysis progress.",
    ],
    performance: [
      "Use stable preview dimensions for image review panels.",
      "Defer OCR/object detection until the user explicitly starts analysis.",
    ],
    files: [
      {
        path: "VisionReviewWorkbench.tsx",
        content: `${cssImport}
import { GlassBadge, GlassCard, GlassEmptyState, GlassErrorState, GlassFileUpload, GlassImageViewer, GlassLoadingState } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { ImageIcon } from 'aura-glass/icons/media';
import { AlertCircleIcon, InfoIcon } from 'aura-glass/icons/status';

export function VisionReviewWorkbench() {
  return (
    <GlassPage>
      <GlassPageHeader
        title="Vision review workbench"
        description="Review images, OCR, object labels, and safe-search output after provider-backed vision routes are configured."
        actions={<GlassBadge variant="warning"><AlertCircleIcon /> Vision offline</GlassBadge>}
      />
      <section className="glass-grid glass-gap-4 lg:glass-grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
          <GlassFileUpload
            accept="image/*"
            compact
            contained
            disabled
            instruction="Image upload is disabled until the hosted vision provider is configured."
            showActions={false}
          />
          <GlassImageViewer contained compact height={260} />
        </GlassCard>
        <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
          <GlassErrorState
            severity="warning"
            title="Vision provider not configured"
            description="OCR, object detection, and safe-search analysis remain unavailable until credentials are connected."
            details={<code>VISION_PROVIDER_READY=false</code>}
          />
          <GlassLoadingState label="Analysis queue" description="No analysis jobs are running." variant="skeleton" rows={3} />
          <GlassEmptyState variant="compact" title="No OCR results" description="Run analysis after provider setup." icon={<ImageIcon />} />
          <p><InfoIcon /> Keep manual review available for images that cannot be sent to provider APIs.</p>
        </GlassCard>
      </section>
    </GlassPage>
  );
}
`,
      },
    ],
  },
  {
    id: "collaboration-room-console",
    title: "Collaboration Room Console",
    category: "collaboration",
    description:
      "A 3.3 collaboration console with room presence, cursor/activity state, selection summary, and unsupported editing fallback.",
    imports: [
      "GlassBadge",
      "GlassButton",
      "GlassCard",
      "GlassEmptyState",
      "GlassErrorState",
      "GlassMetricChip",
      "GlassUserPresence",
    ],
    peerDependencies: ["react", "react-dom", "socket.io-client"],
    tokens: [
      "--glass-theme-surface",
      "--glass-accent-success-fg",
      "--glass-accent-warning-fg",
    ],
    accessibility: [
      "Expose participant names and room status as text, not avatar-only UI.",
      "Announce presence changes politely.",
      "Clearly label unsupported editing states before users enter content.",
    ],
    performance: [
      "Throttle cursor, selection, and presence updates.",
      "Disconnect room transport when the route is hidden or unsupported.",
    ],
    files: [
      {
        path: "CollaborationRoomConsole.tsx",
        content: `${cssImport}
import { GlassBadge, GlassButton, GlassCard, GlassEmptyState, GlassErrorState, GlassMetricChip, GlassUserPresence } from 'aura-glass';
import { GlassInspectorPanel, GlassWorkspace } from 'aura-glass/workspace';
import { BellIcon, UsersIcon } from 'aura-glass/icons/collaboration';

const participants = [
  { id: 'design', name: 'Design lead', status: 'online' as const },
  { id: 'frontend', name: 'Frontend engineer', status: 'away' as const },
  { id: 'release', name: 'Release owner', status: 'busy' as const },
];

export function CollaborationRoomConsole() {
  return (
    <GlassWorkspace inspector={<GlassInspectorPanel title="Room presence"><UsersIcon /> {participants.length} observers</GlassInspectorPanel>}>
      <section className="glass-grid glass-gap-4">
        <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
          <header className="glass-flex glass-items-center glass-justify-between glass-gap-3">
            <h2>Collaboration room</h2>
            <GlassBadge variant="warning"><BellIcon /> Editing unsupported</GlassBadge>
          </header>
          <div className="glass-flex glass-flex-wrap glass-gap-2">
            <GlassMetricChip label="Presence" value="Static" delta="No WebSocket" intent="warning" icon={<UsersIcon />} />
            <GlassMetricChip label="Selections" value="Read-only" delta="3 watchers" intent="default" />
          </div>
          <GlassUserPresence users={participants} compact showRoles={false} />
          <GlassErrorState
            severity="warning"
            title="Realtime editing is not enabled"
            description="This recipe displays room and selection state, but document editing must stay read-only until the hosted collaboration runtime ships CRDT/OT support."
            details={<code>Collaboration transport is disconnected by default.</code>}
          />
          <GlassButton size="sm" disabled>Start editing after runtime setup</GlassButton>
        </GlassCard>
        <GlassEmptyState
          variant="compact"
          title="No live cursor stream"
          description="Cursor and selection events appear here after authenticated WebSocket support is enabled."
          icon={<UsersIcon />}
        />
      </section>
    </GlassWorkspace>
  );
}
`,
      },
    ],
  },
  {
    id: "support-triage-workspace",
    title: "Support Triage Workspace",
    category: "support",
    description:
      "A 3.3 support queue with SLA status, ticket grids, notifications, and a fail-closed AI summary action.",
    imports: [
      "GlassBadge",
      "GlassButton",
      "GlassCard",
      "GlassDataGrid",
      "GlassDataTable",
      "GlassErrorState",
      "GlassMetricChip",
      "GlassNotificationCenter",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: [
      "--glass-theme-focus",
      "--glass-accent-warning-fg",
      "--glass-accent-success-fg",
    ],
    accessibility: [
      "Preserve ticket IDs, priority, owner, and SLA state as readable text.",
      "Use polite notification semantics for queue changes.",
      "Disable AI summary actions with an explanation when providers are missing.",
    ],
    performance: [
      "Virtualize large ticket queues.",
      "Batch SLA and notification updates during imports.",
    ],
    files: [
      {
        path: "SupportTriageWorkspace.tsx",
        content: `${cssImport}
import { GlassBadge, GlassButton, GlassCard, GlassDataGrid, GlassDataTable, GlassErrorState, GlassMetricChip, GlassNotificationCenter } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { SearchIcon } from 'aura-glass/icons/data';
import { AlertCircleIcon, SuccessIcon } from 'aura-glass/icons/status';

export function SupportTriageWorkspace() {
  return (
    <GlassPage>
      <GlassPageHeader
        title="Support triage workspace"
        description="Prioritize escalations, SLA risk, and account context with AI summaries disabled until providers are configured."
        actions={<GlassBadge variant="warning"><AlertCircleIcon /> 4 SLA risks</GlassBadge>}
      />
      <section className="glass-grid glass-gap-4 md:glass-grid-cols-3" aria-label="Support queue summary">
        <GlassMetricChip label="Open tickets" value="128" delta="+9 today" intent="warning" icon={<AlertCircleIcon />} />
        <GlassMetricChip label="Resolved" value="47" delta="24h" intent="success" icon={<SuccessIcon />} />
        <GlassMetricChip label="AI summaries" value="Off" delta="Provider missing" intent="warning" icon={<SearchIcon />} />
      </section>
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
        <GlassErrorState
          severity="warning"
          title="AI summary action is fail-closed"
          description="Agents can triage manually. Summaries become available only after authenticated provider-backed routes are ready."
          details={<code>POST /api/ai/summarize returns provider-unconfigured.</code>}
        />
        <GlassButton size="sm" disabled>Generate summary after setup</GlassButton>
        <GlassDataGrid />
        <GlassDataTable />
      </GlassCard>
      <GlassNotificationCenter />
    </GlassPage>
  );
}
`,
      },
    ],
  },
  {
    id: "release-command-center",
    title: "Release Command Center",
    category: "release",
    description:
      "A 3.3 release operations surface with launch checklist, rollout status, changelog preview, evidence links, and rollback actions.",
    imports: [
      "GlassBadge",
      "GlassButton",
      "GlassCard",
      "GlassEmptyState",
      "GlassMetricChip",
      "GlassProgress",
      "GlassTimeline",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: [
      "--glass-theme-brand",
      "--glass-accent-success-fg",
      "--glass-accent-warning-fg",
    ],
    accessibility: [
      "Keep checklist state textual and visible without color dependency.",
      "Expose rollout progress with a labelled progressbar.",
      "Label rollback and publish actions with explicit risk language.",
    ],
    performance: [
      "Load evidence reports as links instead of embedding large artifacts.",
      "Avoid continuous animation in release monitoring panels.",
    ],
    files: [
      {
        path: "ReleaseCommandCenter.tsx",
        content: `${cssImport}
import { GlassBadge, GlassButton, GlassCard, GlassEmptyState, GlassMetricChip, GlassProgress, GlassTimeline } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { CheckIcon, DownloadIcon, RefreshIcon } from 'aura-glass/icons/action';
import { AlertTriangleIcon, SuccessIcon } from 'aura-glass/icons/status';

const checklist = ['Package dry run', 'Recipe render evidence', 'A11y signoff', 'Rollback note'];
const releaseEvents = [
  { id: 'pack', title: 'Package dry run', subtitle: 'npm pack evidence attached', time: '09:00' },
  { id: 'recipes', title: 'Recipe render gate', subtitle: 'Screenshots captured for 3.3 recipes', time: '10:30' },
  { id: 'rollout', title: 'Canary rollout', subtitle: '25% staged publish window', time: '12:00' },
];

export function ReleaseCommandCenter() {
  return (
    <GlassPage>
      <GlassPageHeader
        title="Release command center"
        description="Coordinate launch readiness, staged rollout, changelog review, evidence links, and rollback controls."
        actions={<GlassBadge variant="success"><SuccessIcon /> 3.3 candidate</GlassBadge>}
      />
      <section className="glass-grid glass-gap-4 md:glass-grid-cols-3" aria-label="Release metrics">
        <GlassMetricChip label="Checklist" value="3/4" delta="Manual QA left" intent="warning" icon={<CheckIcon />} />
        <GlassMetricChip label="Rollout" value="25%" delta="Canary" intent="success" icon={<RefreshIcon />} />
        <GlassMetricChip label="Evidence" value="Linked" delta="3.3 reports" intent="default" icon={<DownloadIcon />} />
      </section>
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
        <h2>Rollout status</h2>
        <GlassProgress value={25} variant="success" label="Canary rollout" showValue animated={false} />
        {checklist.map((item) => <p key={item}><CheckIcon /> {item}</p>)}
        <GlassTimeline items={releaseEvents} />
      </GlassCard>
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-3 glass-p-4">
        <h2>Changelog preview</h2>
        <p>3.3 adds provider-safe recipes, theme preset guidance, and marketing launch surfaces.</p>
        <GlassButton size="sm">Open evidence</GlassButton>
        <GlassButton size="sm" variant="secondary"><AlertTriangleIcon /> Prepare rollback</GlassButton>
      </GlassCard>
      <GlassEmptyState variant="compact" title="No rollout incidents" description="Incident links appear here if release monitoring reports failures." />
    </GlassPage>
  );
}
`,
      },
    ],
  },
  {
    id: "developer-docs-portal",
    title: "Developer Docs Portal",
    category: "docs",
    description:
      "A 3.3 documentation portal starter with docs navigation, code examples, package entrypoint selector, and release evidence links.",
    imports: [
      "GlassBadge",
      "GlassButton",
      "GlassCard",
      "GlassEmptyState",
      "GlassSearchField",
      "GlassTabs",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: [
      "--glass-theme-surface",
      "--glass-theme-focus",
      "--glass-border-default",
    ],
    accessibility: [
      "Keep docs navigation in labelled landmarks.",
      "Use copyable code blocks with visible text labels.",
      "Expose package entrypoints as text, not icon-only controls.",
    ],
    performance: [
      "Static-render high-traffic docs pages where possible.",
      "Lazy-load playgrounds and heavy examples below the fold.",
    ],
    files: [
      {
        path: "DeveloperDocsPortal.tsx",
        content: `${cssImport}
import { GlassBadge, GlassButton, GlassCard, GlassEmptyState, GlassSearchField, GlassTabs } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { FileIcon, SearchIcon } from 'aura-glass/icons/data';

const entrypoints = ['aura-glass', 'aura-glass/theme', 'aura-glass/app-shell', 'aura-glass/registry'];

export function DeveloperDocsPortal() {
  return (
    <GlassPage>
      <GlassPageHeader
        title="Developer docs portal"
        description="Document stable package entrypoints, recipes, examples, and release evidence from one glass-native docs shell."
        actions={<GlassBadge variant="primary"><FileIcon /> 3.3 docs</GlassBadge>}
      />
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
        <GlassSearchField label="Search docs" placeholder="Find components, recipes, or entrypoints" value="" onChange={() => undefined} />
        <GlassTabs value="install" />
        <div className="glass-grid glass-gap-3 md:glass-grid-cols-2">
          {entrypoints.map((entrypoint) => (
            <GlassCard key={entrypoint} depth="subtle" tint="neutral" className="glass-p-3">
              <h3>{entrypoint}</h3>
              <code>import &#123; GlassButton &#125; from '{entrypoint}';</code>
            </GlassCard>
          ))}
        </div>
        <GlassButton size="sm"><SearchIcon /> Browse examples</GlassButton>
      </GlassCard>
      <GlassEmptyState
        variant="compact"
        title="No private imports required"
        description="3.3 docs should show public root and subpath imports only."
        icon={<FileIcon />}
      />
    </GlassPage>
  );
}
`,
      },
    ],
  },
  {
    id: "marketing-launch-kit",
    title: "Marketing Launch Kit",
    category: "marketing",
    description:
      "A 3.3 marketing launch page with production-ready hero, install command, feature grid, changelog, social proof, and visual evidence section.",
    imports: [
      "AuroraBackground",
      "DisplayText",
      "FeatureTile",
      "GlassButton",
      "InstallCommand",
      "LogoMark",
      "ShowcaseCard",
    ],
    peerDependencies: ["react", "react-dom"],
    tokens: [
      "--aura-marketing-button-aurora-background",
      "--aura-marketing-display-text-gradient-aurora",
      "--aura-marketing-surface-showcase-background",
    ],
    accessibility: [
      "Keep hero copy semantic and avoid placing primary page content inside decorative backgrounds.",
      "Use reduced-motion-safe aurora settings for default launch surfaces.",
      "Ensure install commands and proof points remain readable without animation.",
    ],
    performance: [
      "Use deterministic particles and reduced-motion defaults for marketing previews.",
      "Keep visual proof media dimensions stable to avoid layout shift.",
    ],
    files: [
      {
        path: "MarketingLaunchKit.tsx",
        content: `${cssImport}
import { AuroraBackground, DisplayText, FeatureTile, GlassButton, InstallCommand, LogoMark, ShowcaseCard } from 'aura-glass';

const features = [
  ['App UI', 'Production shell, workflow, and data surfaces for real product screens.'],
  ['Theme presets', 'Documented density, motion, and contrast policy starters.'],
  ['Safe AI recipes', 'Provider-unconfigured UI states before hosted credentials are wired.'],
];

export function MarketingLaunchKit() {
  return (
    <main className="glass-min-h-screen glass-bg-slate-950 glass-text-primary">
      <section className="glass-relative glass-overflow-hidden glass-p-8 md:glass-p-12">
        <AuroraBackground particles={12} grain vignette reducedMotion seed="auraglass-33-launch" />
        <div className="glass-relative glass-mx-auto glass-grid glass-max-w-6xl glass-gap-8">
          <LogoMark label="AuraGlass" animated={false} />
          <DisplayText as="h1" size="hero" gradient="aurora" balance>
            AuraGlass 3.3 launch kit
          </DisplayText>
          <p className="glass-max-w-2xl glass-text-lg glass-text-secondary">
            Build launch pages that pair premium Liquid Glass marketing surfaces with production package evidence.
          </p>
          <div className="glass-flex glass-flex-wrap glass-gap-3">
            <GlassButton variant="aurora">Start building</GlassButton>
            <InstallCommand packageManager="npm" />
          </div>
          <div className="glass-grid glass-gap-4 md:glass-grid-cols-3">
            {features.map(([title, description], index) => (
              <FeatureTile key={title} index={index + 1} title={title} description={description} tone="aurora" />
            ))}
          </div>
          <ShowcaseCard intensity="strong" glow="aurora" floating={false}>
            <h2>Launch proof</h2>
            <p>Link visual baselines, recipe render evidence, changelog notes, and accessibility signoff before publishing.</p>
          </ShowcaseCard>
        </div>
      </section>
    </main>
  );
}
`,
      },
    ],
  },
];

export const getAuraGlassRecipe = (id: string): AuraGlassRecipe | undefined =>
  auraGlassRecipes.find((recipe) => recipe.id === id);
