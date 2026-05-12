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
  | "ecommerce-product-panel";

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
    imports: ["GlassDashboard", "GlassSidebar", "GlassCard", "GlassDataChart", "GlassButton"],
    peerDependencies: ["react", "react-dom", "chart.js", "react-chartjs-2"],
    tokens: ["--glass-bg-default", "--glass-border-default", "--glass-text-primary"],
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
    imports: ["GlassCommandPalette", "GlassCard", "GlassDataGrid", "GlassBadge"],
    peerDependencies: ["react", "react-dom", "lucide-react"],
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
    imports: ["LiquidGlassMediaControls", "GlassImageViewer", "GlassMusicVisualizer"],
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
      <GlassMusicVisualizer compact contained isPlaying={false} />
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
    tokens: ["--glass-bg-default", "--glass-accent-info-fg", "--glass-border-default"],
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
    imports: ["GlassProductRecommendations", "GlassSmartShoppingCart", "GlassCard"],
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
];

export const getAuraGlassRecipe = (
  id: string
): AuraGlassRecipe | undefined =>
  auraGlassRecipes.find((recipe) => recipe.id === id);
