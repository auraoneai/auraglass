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

const recipePolishStyle = `<style>{\`
  .recipe-polish {
    --glass-text-primary: rgba(17, 24, 39, .96);
    --glass-text-secondary: rgba(51, 65, 85, .92);
    --glass-theme-text: rgba(17, 24, 39, .96);
    --glass-theme-text-secondary: rgba(51, 65, 85, .92);
    color: rgba(17, 24, 39, .96);
  }
  .recipe-polish .optimized-glass-surface,
  .recipe-polish .glass-top-bar,
  .recipe-polish .glass-sidebar-rail,
  .recipe-polish .glass-main,
  .recipe-polish .glass-status-bar,
  .recipe-polish .glass-command-dock {
    background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.22)) !important;
    border-color: rgba(255,255,255,.86) !important;
    color: rgba(17,24,39,.96) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 12px rgba(255,255,255,.12), 0 10px 28px rgba(71,85,105,.13) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.05) contrast(1.05) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.05) contrast(1.05) !important;
  }
  .recipe-polish [class*="glass-text-secondary"],
  .recipe-polish [class*="glass-text-primary-opacity"],
  .recipe-polish [class*="glass-text-primary-glass-opacity"] { color: rgba(51,65,85,.92) !important; }
  .recipe-polish [class*="text-amber"],
  .recipe-polish [class*="text-emerald"],
  .recipe-polish [class*="glass-text-success"] { color: rgba(30,41,59,.96) !important; }
  .recipe-polish :where(h1, h2, h3, h4, strong) { color: rgba(17,24,39,.96) !important; }
  .recipe-polish :where(p, li, label, small) { color: rgba(51,65,85,.94) !important; }
  .recipe-polish .recipe-section-title { margin: 0; color: rgba(17,24,39,.96) !important; font-size: 1rem; font-weight: 650; letter-spacing: -.01em; }
  .recipe-polish .recipe-copy { margin: 0; color: rgba(51,65,85,.9); font-size: .875rem; line-height: 1.5; }
  .recipe-polish .recipe-list { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
  .recipe-polish .recipe-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; min-width: 0; padding: 12px 14px; border: 1px solid rgba(148,163,184,.25); border-radius: 14px; background: rgba(255,255,255,.30); }
  .recipe-polish .recipe-row > span:first-child { min-width: 0; font-weight: 600; }
  .recipe-polish .recipe-row small { color: rgba(51,65,85,.82); text-align: right; }
  .recipe-polish .recipe-code { display: block; max-width: 100%; overflow-wrap: anywhere; padding: 10px 12px; border: 1px solid rgba(148,163,184,.28); border-radius: 12px; background: rgba(255,255,255,.30); color: rgba(30,41,59,.94); font-size: .78rem; line-height: 1.45; }
  .recipe-polish .recipe-docs-nav { margin-top: 12px !important; }
  .recipe-polish .recipe-note { color: rgba(30,41,59,.94) !important; }
  .recipe-polish .recipe-metrics > * { min-width: 0; }
  @media (max-width: 600px) {
    .recipe-polish { width: calc(100% + 32px) !important; margin-left: -16px !important; gap: 14px !important; }
    .recipe-polish .glass-page-header { display: grid !important; grid-template-columns: minmax(0,1fr) !important; gap: 10px !important; }
    .recipe-polish .glass-page-header > div:last-child { justify-self: start; max-width: 100%; }
    .recipe-polish .glass-page-header h1 { font-size: 1.65rem !important; line-height: 1.08 !important; }
    .recipe-polish .glass-page-header p { font-size: .875rem !important; line-height: 1.45 !important; }
    .recipe-polish .recipe-metrics { grid-template-columns: repeat(2, minmax(0,1fr)) !important; gap: 10px !important; }
    .recipe-polish .recipe-metrics > :last-child:nth-child(odd) { grid-column: 1 / -1; }
    .recipe-polish .recipe-row { align-items: flex-start; padding: 11px 12px; }
    .recipe-polish .recipe-row small { max-width: 48%; }
  }
  @media (max-width: 350px) {
    .recipe-polish .recipe-metrics { grid-template-columns: minmax(0,1fr) !important; }
    .recipe-polish .recipe-metrics > * { grid-column: 1 / -1 !important; width: 100%; }
  }
\`}</style>`;

const lightRecipeCss = `
.ag-light-recipe {
  --glass-theme-text: #172033;
  --glass-text-primary: #172033;
  --typography-text-primary: #172033;
  --aura-color-global-text-primary: #172033;
  --aura-color-global-text-secondary: #4b5a70;
  color: #172033;
  display: grid;
  gap: 16px;
  min-width: 0;
}
.ag-light-recipe :where(h1, h2, h3, h4, p, span, label) { color: inherit; }
.ag-light-recipe :where(.optimized-glass-surface, .glass-workspace-panel, .glass-action-bar, .glass-canvas-area, .glass-timeline-rail, .glass-command-dock, .glass-music-visualizer) {
  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.18)) !important;
  border-color: rgba(255,255,255,.92) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 12px rgba(255,255,255,.12), 0 14px 36px rgba(86,107,135,.14) !important;
  color: #172033 !important;
}
.ag-light-recipe :where(.optimized-glass-surface, .glass-music-visualizer) { max-width: 100%; min-width: 0; }
.ag-light-recipe :where(.glass-music-visualizer) { overflow: hidden !important; }
.ag-light-recipe :where(.glass-music-visualizer canvas) {
  background: linear-gradient(145deg, rgba(255,255,255,.32), rgba(255,255,255,.16)) !important;
  border-color: rgba(109,132,160,.22) !important;
  max-width: 100%;
}
.ag-light-recipe :where(.liquid-glass-media-controls) {
  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.18)) !important;
  border: 1px solid rgba(255,255,255,.94) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 12px rgba(255,255,255,.12), 0 12px 30px rgba(86,107,135,.14) !important;
  color: #172033 !important;
  max-width: 100%;
}
.ag-light-recipe :where(.liquid-glass-media-controls span) { color: #334155 !important; text-shadow: none !important; }
.ag-light-recipe :where(input[type="range"]) { height: 12px !important; min-height: 12px; }
.ag-light-recipe :where(canvas, svg) { max-width: 100%; }
.ag-light-recipe :where([class*="emptyState"], [class*="empty-state"]) {
  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.2)) !important;
  color: #172033 !important;
}
.ag-light-recipe :where([class*="emptyState"], [class*="empty-state"]) * { color: #4b5a70 !important; }
.ag-light-recipe :where([class*="emptyState"], [class*="empty-state"]) :where(h1,h2,h3,strong) { color: #172033 !important; }
.ag-recipe-chart, .ag-recipe-chart * { box-sizing: border-box; min-width: 0; }
.ag-recipe-chart :where(.optimized-glass-surface) { width: 100%; max-width: 100%; overflow: hidden !important; }
.ag-recipe-chart :where(.optimized-glass-surface > *) { max-width: 100%; }
.ag-recipe-chart :where(canvas) { width: 100% !important; }
.ag-recipe-calendar :where(header) { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.ag-recipe-calendar :where([aria-label^="Select date"]) {
  box-sizing: border-box;
  min-width: 0 !important;
  min-height: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border: 1px solid rgba(93,112,136,.2) !important;
  border-radius: 12px !important;
  color: #243149 !important;
  transform: none !important;
}
.ag-recipe-calendar :where([aria-label^="Select date"]:hover, [aria-label^="Select date"]:focus-visible) {
  transform: none !important;
  background: rgba(255,255,255,.35) !important;
}
.ag-recipe-calendar :where(.glass-calendar-shell [aria-hidden="true"]) {
  color: #243149 !important;
  text-shadow: none !important;
}
.ag-recipe-calendar :where(.glass-calendar-shell .glass-grid) { row-gap: 8px !important; }
.ag-recipe-calendar :where(.glass-touch-target) { min-width: 0; }
.ag-recipe-calendar :where(.overflow-hidden) { overflow: hidden !important; }
.ag-media-review .glass-canvas-area { min-height: clamp(210px, 36vw, 360px); }
.ag-media-player .ag-media-visualizer,
.ag-media-review .ag-media-visualizer {
  max-height: none !important;
  overflow: visible !important;
}
.ag-collab-recipe .truncate,
.ag-collab-recipe .glass-truncate {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
  overflow-wrap: anywhere;
}
.ag-creator-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }
.ag-creator-grid > * { min-width: 0; }
.ag-creator-studio .ag-media-visualizer { max-height: none !important; }
.ag-creator-studio .glass-truncate { white-space: normal !important; overflow: visible !important; text-overflow: clip !important; overflow-wrap: anywhere; }
@media (max-width: 640px) {
  .ag-light-recipe { gap: 12px; }
  .ag-creator-grid { grid-template-columns: minmax(0, 1fr); }
  .ag-recipe-calendar :where(.glass-p-4) { padding: 10px; }
  .ag-recipe-calendar :where(.glass-gap-2) { gap: 8px; }
  .ag-recipe-calendar :where(.glass-aspect-square) { min-width: 0; }
  .ag-recipe-calendar :where([aria-label^="Select date"]) { min-width: 0 !important; min-height: 0 !important; }
  .ag-recipe-calendar :where([aria-label^="Select date"] .glass-touch-target) { min-width: 0 !important; min-height: 0 !important; }
}
`;

const lightRecipeCssSource = `const lightRecipeCss = ${JSON.stringify(lightRecipeCss)};`;

export const auraGlassRecipes: AuraGlassRecipe[] = [
  {
    id: "saas-dashboard",
    title: "SaaS Dashboard Shell",
    category: "dashboard",
    description:
      "A compact premium dashboard shell with sidebar navigation, KPI cards, and a chart-ready analytics panel.",
    imports: ["GlassBadge", "GlassButton", "GlassCard"],
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
${lightRecipeCssSource}

const metrics = [
  ['Monthly revenue', '$184,240', '+12.8%'],
  ['Active accounts', '2,846', '+8.2%'],
  ['Net retention', '118.4%', '+3.1%'],
];

const activity = [
  ['Northstar Labs', 'Expansion', '$18,400'],
  ['Lumen Systems', 'Renewal', '$12,800'],
  ['Fieldwork AI', 'New business', '$9,600'],
];

export function SaasDashboardShell() {
  return (
    <section className="ag-light-recipe" aria-labelledby="revenue-command" style={{ gap: 18 }}><style>{lightRecipeCss}</style>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div><GlassBadge variant="primary">Revenue workspace</GlassBadge><h1 id="revenue-command" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.04em' }}>Revenue command</h1><p style={{ margin: 0, color: '#526071' }}>A clear view of growth, retention, and the deals moving this week.</p></div>
        <GlassButton size="sm">Open forecast</GlassButton>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: 12 }}>
        {metrics.map(([label, value, delta]) => <GlassCard key={label} depth="medium" tint="neutral"><p style={{ margin: 0, color: '#526071', fontSize: 13 }}>{label}</p><strong style={{ display: 'block', marginTop: 8, fontSize: 28, letterSpacing: '-0.03em' }}>{value}</strong><span style={{ color: '#176b4d', fontSize: 13 }}>{delta} this month</span></GlassCard>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 12 }}>
        <GlassCard depth="medium" tint="neutral"><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><h2 style={{ margin: 0, fontSize: 18 }}>Revenue momentum</h2><p style={{ margin: '4px 0 0', color: '#526071', fontSize: 13 }}>Trailing six months</p></div><strong>$1.02M</strong></div><div aria-label="Revenue grew steadily from March to August" style={{ display: 'flex', alignItems: 'end', gap: 8, height: 128, marginTop: 18 }}>{[38, 52, 47, 68, 76, 92].map((height, index) => <div key={index} style={{ flex: 1, height: height + '%', minWidth: 12, borderRadius: '8px 8px 4px 4px', background: 'linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.16))', border: '1px solid rgba(62,101,190,.5)' }} />)}</div></GlassCard>
        <GlassCard depth="medium" tint="neutral"><h2 style={{ margin: '0 0 12px', fontSize: 18 }}>Pipeline activity</h2>{activity.map(([name, stage, value]) => <div key={name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 8, padding: '10px 0', borderTop: '1px solid rgba(86,104,126,.16)' }}><span><strong style={{ display: 'block' }}>{name}</strong><small style={{ color: '#526071' }}>{stage}</small></span><strong>{value}</strong></div>)}</GlassCard>
      </div>
    </section>
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
    imports: ["GlassBadge", "GlassButton", "GlassCard"],
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
${lightRecipeCssSource}

const models = [
  ['Atlas Reasoning', 'Healthy', '842 ms'],
  ['Prism Search', 'Healthy', '216 ms'],
  ['Canvas Vision', 'Review', '1.4 s'],
];

export function AiCommandCenter() {
  return (
    <section className="ag-light-recipe" aria-labelledby="ai-operations"><style>{lightRecipeCss}</style>
      <header><GlassBadge variant="primary">AI operations</GlassBadge><h1 id="ai-operations" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.04em' }}>Model command center</h1><p style={{ margin: 0, color: '#526071' }}>Monitor quality, latency, and every production workflow from one surface.</p></header>
      <GlassCard depth="strong" tint="neutral"><label htmlFor="ai-command" style={{ display: 'block', marginBottom: 8, fontWeight: 650 }}>Run a workspace command</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}><input id="ai-command" placeholder="Ask about latency, quality, or spend" style={{ flex: '1 1 230px', minWidth: 0, boxSizing: 'border-box', padding: '12px 14px', color: '#172033', background: 'rgba(255,255,255,.3)', border: '1px solid rgba(80,102,130,.28)', borderRadius: 12, font: 'inherit', outlineColor: '#3269d8' }} /><GlassButton size="sm">Run command</GlassButton></div></GlassCard>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: 12 }}>
        <GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Grounded answers</small><strong style={{ display: 'block', fontSize: 28, marginTop: 8 }}>98.4%</strong><span style={{ color: '#176b4d' }}>+1.8% this week</span></GlassCard>
        <GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Requests today</small><strong style={{ display: 'block', fontSize: 28, marginTop: 8 }}>24,892</strong><span style={{ color: '#526071' }}>71% of daily budget</span></GlassCard>
        <GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Median latency</small><strong style={{ display: 'block', fontSize: 28, marginTop: 8 }}>684 ms</strong><span style={{ color: '#176b4d' }}>Within target</span></GlassCard>
      </div>
      <GlassCard depth="medium" tint="neutral"><h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Model fleet</h2>{models.map(([name, state, latency]) => <div key={name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto auto', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid rgba(86,104,126,.16)' }}><strong>{name}</strong><span style={{ color: state === 'Healthy' ? '#176b4d' : '#8a5611' }}>{state}</span><span style={{ color: '#526071' }}>{latency}</span></div>)}</GlassCard>
    </section>
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
${lightRecipeCssSource}
import { GlassImageViewer, GlassMusicVisualizer, LiquidGlassMediaControls } from 'aura-glass';

export function MediaPlayerSurface() {
  return (
    <section className="ag-light-recipe ag-media-player" aria-label="Media player">
      <style>{lightRecipeCss}</style>
      <GlassImageViewer className="ag-media-preview" contained compact height={280} />
      <LiquidGlassMediaControls compact playing currentTime={42} duration={180} />
      <GlassMusicVisualizer className="ag-media-visualizer" compact contained realTimeAnalysis={false} />
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
${lightRecipeCssSource}
import { GlassButton, GlassCard, GlassDataChart, GlassHeatmap } from 'aura-glass';

const growthSeries = [
  {
    id: 'monthly-recurring-revenue',
    label: 'Monthly recurring revenue',
    formatType: 'currency',
    data: [
      { x: 'Mar', y: 184000 },
      { x: 'Apr', y: 196000 },
      { x: 'May', y: 211000 },
      { x: 'Jun', y: 228000 },
      { x: 'Jul', y: 247000 },
      { x: 'Aug', y: 263000 },
    ],
  },
];

const cohortHealth = [
  [68, 72, 76, 79, 82, 84],
  [64, 69, 73, 77, 80, 83],
  [61, 66, 71, 75, 79, 81],
  [58, 63, 68, 72, 76, 79],
];

export function AnalyticsOverview() {
  return (
    <section className="ag-light-recipe ag-recipe-chart" aria-label="Analytics overview">
      <style>{lightRecipeCss}</style>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div><p style={{ margin: '0 0 5px', color: '#526071', fontSize: 13, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Executive pulse · August</p><h1 style={{ margin: 0, padding: '2px 0 3px', fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-.045em', lineHeight: 1.08, overflow: 'visible' }}>Growth overview</h1><p style={{ margin: '5px 0 0', color: '#526071' }}>Revenue, retention, and product adoption across 1,284 active accounts.</p></div>
        <GlassButton size="sm">Export report</GlassButton>
      </header>
      <div className="recipe-analytics-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 12 }}>
        {[
          ['Monthly revenue', '$263k', '+18.6% YoY'],
          ['Net retention', '112.4%', '+3.8 pts'],
          ['Active accounts', '1,284', '+74 this month'],
          ['Expansion pipeline', '$481k', '63% qualified'],
        ].map(([label, value, note]) => <GlassCard key={label} depth="medium" tint="neutral"><small style={{ color: '#526071', fontWeight: 650 }}>{label}</small><strong style={{ display: 'block', margin: '8px 0 5px', fontSize: 'clamp(24px, 3vw, 32px)', letterSpacing: '-.035em' }}>{value}</strong><span style={{ color: '#526071', fontSize: 13 }}>{note}</span></GlassCard>)}
      </div>
      <GlassCard depth="medium" tint="neutral">
        <GlassDataChart title="Revenue trajectory" subtitle="Recognized monthly recurring revenue · Mar–Aug" datasets={growthSeries} variant="area" width="100%" height={300} glassVariant="clear" palette={['#53657d']} showToolbar={false} allowDownload={false} legend={{ show: false, position: 'top', align: 'start', style: 'compact', glassEffect: false }} />
      </GlassCard>
      <GlassCard depth="medium" tint="neutral">
        <div style={{ marginBottom: 14 }}><h2 style={{ margin: 0, fontSize: 19, letterSpacing: '-.02em' }}>Cohort activation</h2><p style={{ margin: '5px 0 0', color: '#526071', fontSize: 14 }}>Weekly activation rate by signup cohort and lifecycle week.</p></div>
        <GlassHeatmap data={cohortHealth} xAxis={{ title: 'Lifecycle week', labels: ['1', '2', '3', '4', '5', '6'] }} yAxis={{ title: 'Signup cohort', labels: ['May 6', 'May 13', 'May 20', 'May 27'] }} colorScale={{ min: '#f1f5f9', mid: '#cbd5e1', max: '#94a3b8', steps: 6 }} cellSize={20} cellGap={8} contained maxHeight={290} showValues showLegend legendPosition="bottom" animated={false} />
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
    imports: ["GlassBadge", "GlassButton", "GlassCard"],
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
${lightRecipeCssSource}

export function SettingsBillingPage() {
  return (
    <section className="ag-light-recipe" aria-labelledby="billing-settings"><style>{lightRecipeCss}</style>
      <header><GlassBadge variant="primary">Account settings</GlassBadge><h1 id="billing-settings" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.04em' }}>Billing &amp; plan</h1><p style={{ margin: 0, color: '#526071' }}>Manage your workspace plan, payment details, and invoices.</p></header>
      <nav aria-label="Settings sections" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{['Profile', 'Team', 'Billing', 'Security'].map(label => <button key={label} type="button" aria-current={label === 'Billing' ? 'page' : undefined} style={{ padding: '9px 14px', color: '#172033', background: label === 'Billing' ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.16)', border: '1px solid rgba(80,102,130,.22)', borderRadius: 999, font: 'inherit', fontWeight: 650 }}>{label}</button>)}</nav>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: 12 }}>
        <GlassCard depth="medium" tint="neutral"><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><small style={{ color: '#526071' }}>Current plan</small><h2 style={{ margin: '6px 0 2px', fontSize: 22 }}>Studio</h2><p style={{ margin: 0, color: '#526071' }}>$48 / member / month</p></div><GlassBadge variant="primary">Active</GlassBadge></div><p style={{ margin: '18px 0 8px' }}>18 of 25 seats in use</p><div style={{ height: 8, overflow: 'hidden', borderRadius: 99, background: 'rgba(70,91,117,.16)' }}><div style={{ width: '72%', height: '100%', background: '#4677d8', borderRadius: 99 }} /></div></GlassCard>
        <GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Next invoice</small><strong style={{ display: 'block', marginTop: 6, fontSize: 26 }}>$864.00</strong><p style={{ color: '#526071' }}>Due September 12 · Visa ending 4242</p><GlassButton size="sm">View invoices</GlassButton></GlassCard>
      </div>
      <GlassCard depth="medium" tint="neutral"><h2 style={{ margin: '0 0 14px', fontSize: 20 }}>Payment method</h2><form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: 12 }}><label style={{ fontWeight: 650 }}>Name on card<input defaultValue="Morgan Chen" style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 14px', color: '#172033', background: 'rgba(255,255,255,.3)', border: '1px solid rgba(80,102,130,.28)', borderRadius: 12, font: 'inherit' }} /></label><label style={{ fontWeight: 650 }}>Billing email<input type="email" defaultValue="billing@northstar.co" style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 14px', color: '#172033', background: 'rgba(255,255,255,.3)', border: '1px solid rgba(80,102,130,.28)', borderRadius: 12, font: 'inherit' }} /></label></form><div style={{ marginTop: 16 }}><GlassButton>Save billing details</GlassButton></div></GlassCard>
    </section>
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
    <GlassCard depth="medium" tint="neutral" className="ag-recipe-surface ag-recipe-kanban">
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
${lightRecipeCssSource}
import { GlassButton, GlassCalendar, GlassCard } from 'aura-glass';

export function CalendarSchedulePage() {
  return (
    <section className="ag-light-recipe ag-recipe-calendar" aria-label="Calendar schedule">
      <style>{lightRecipeCss}</style>
      <GlassCard depth="medium" tint="neutral">
      <header>
        <h2>Launch schedule</h2>
        <GlassButton size="sm">Create event</GlassButton>
      </header>
        <GlassCalendar compact contained maxRows={4} maxHeight={420} />
      </GlassCard>
    </section>
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
    imports: [
      "CollaborativeGlassWorkspace",
      "GlassBadge",
      "GlassButton",
      "GlassCard",
      "GlassMetricChip",
      "GlassUserPresence",
    ],
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
import { CollaborativeGlassWorkspace, GlassBadge, GlassButton, GlassCard, GlassMetricChip, GlassUserPresence } from 'aura-glass';
${lightRecipeCssSource}

const collaborators = [
  { id: 'maya', name: 'Maya Chen', status: 'online' as const, role: 'admin' as const, activity: 'Refining launch narrative' },
  { id: 'jon', name: 'Jon Bell', status: 'online' as const, role: 'member' as const, activity: 'Reviewing prototype notes' },
  { id: 'priya', name: 'Priya Shah', status: 'away' as const, role: 'member' as const, activity: 'Back at 2:30 PM' },
];

const activity = [
  ['Launch brief', 'Maya edited 4 min ago'],
  ['Prototype review', '12 comments resolved'],
  ['Research synthesis', 'Jon added 3 insights'],
];

export function CollaborativeWorkspace() {
  return (
    <section className="ag-light-recipe ag-collab-recipe" aria-labelledby="collaborative-workspace-title">
      <style>{lightRecipeCss}</style>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <GlassBadge variant="secondary">Product studio</GlassBadge>
          <h1 id="collaborative-workspace-title" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.04em', lineHeight: 1.08 }}>Launch workspace</h1>
          <p style={{ margin: 0, color: '#526071' }}>A shared room for the brief, prototype decisions, and today’s review.</p>
        </div>
        <GlassButton size="sm">Share workspace</GlassButton>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 12 }}>
        <GlassMetricChip label="Teammates" value="3 online" delta="1 away" intent="default" />
        <GlassMetricChip label="Decisions" value="8" delta="2 need review" intent="default" />
        <GlassMetricChip label="Comments" value="12 resolved" delta="4 open" intent="default" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16, alignItems: 'start' }}>
        <GlassCard depth="medium" tint="neutral" className="ag-recipe-surface" style={{ padding: 16 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Today’s activity</h2>
          <p style={{ margin: '0 0 14px', color: '#526071', fontSize: 14 }}>The latest changes, collected in one calm view.</p>
          <div style={{ display: 'grid', gap: 10 }}>
            {activity.map(([title, detail]) => (
              <div key={title} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '4px 12px', padding: '11px 12px', border: '1px solid rgba(255,255,255,.32)', borderRadius: 14, background: 'rgba(255,255,255,.18)' }}>
                <strong>{title}</strong><small style={{ color: '#526071' }}>{detail}</small>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassUserPresence users={collaborators} compact showRoles showActivities maxUsers={3} />
      </div>

      <GlassCard depth="medium" tint="neutral" className="ag-recipe-surface ag-recipe-collaboration" style={{ padding: 12, overflow: 'hidden' }}>
        <CollaborativeGlassWorkspace
          workspaceId="launch-workspace"
          userId="maya"
          userName="Maya Chen"
          userEmail="maya@example.com"
          userRole="admin"
          aria-label="Collaborative launch canvas"
          compact
          contained
          maxHeight={300}
          theme="light"
          enableRealTimeSync={false}
          enableVoiceChat={false}
          enableVersionControl={false}
          showMiniMap={false}
          showOnlineUsers={false}
          showCursors={false}
        />
      </GlassCard>
    </section>
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
    imports: ["GlassBadge", "GlassButton", "GlassCard"],
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
${lightRecipeCssSource}

const users = [
  ['Avery Stone', 'avery@northstar.co', 'Admin', 'Active'],
  ['Nina Patel', 'nina@northstar.co', 'Analyst', 'Active'],
  ['Theo Grant', 'theo@northstar.co', 'Viewer', 'Invited'],
  ['Maya Lin', 'maya@northstar.co', 'Manager', 'Active'],
];

export function AdminDataTable() {
  return (
    <section className="ag-light-recipe" aria-labelledby="team-directory"><style>{lightRecipeCss}</style>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 12 }}><div><GlassBadge variant="primary">Workspace admin</GlassBadge><h1 id="team-directory" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.04em' }}>Team directory</h1><p style={{ margin: 0, color: '#526071' }}>Review access, roles, and pending invitations.</p></div><GlassButton size="sm">Invite user</GlassButton></header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 12 }}><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Active members</small><strong style={{ display: 'block', fontSize: 26, marginTop: 6 }}>128</strong></GlassCard><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Pending invites</small><strong style={{ display: 'block', fontSize: 26, marginTop: 6 }}>6</strong></GlassCard><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Admin seats</small><strong style={{ display: 'block', fontSize: 26, marginTop: 6 }}>8</strong></GlassCard></div>
      <GlassCard depth="medium" tint="neutral"><label htmlFor="user-search" style={{ fontWeight: 650 }}>Search directory</label><input id="user-search" type="search" placeholder="Name, email, or role" style={{ display: 'block', width: '100%', boxSizing: 'border-box', margin: '8px 0 14px', padding: '12px 14px', color: '#172033', background: 'rgba(255,255,255,.3)', border: '1px solid rgba(80,102,130,.28)', borderRadius: 12, font: 'inherit' }} /><div role="table" aria-label="Workspace members" style={{ minWidth: 0 }}>{users.map(([name, email, role, state]) => <div role="row" key={email} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,.65fr) minmax(0,.55fr)', gap: 8, alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(86,104,126,.16)', fontSize: 14 }}><span role="cell" style={{ minWidth: 0 }}><strong style={{ display: 'block' }}>{name}</strong><small style={{ display: 'block', overflowWrap: 'anywhere', color: '#526071' }}>{email}</small></span><span role="cell" style={{ overflowWrap: 'anywhere' }}>{role}</span><span role="cell" style={{ overflowWrap: 'anywhere', color: state === 'Active' ? '#176b4d' : '#8a5611' }}>{state}</span></div>)}</div></GlassCard>
    </section>
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
    imports: ["GlassBadge", "GlassButton", "GlassCard"],
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
${lightRecipeCssSource}

const products = [
  { id: 'studio-headphones', name: 'Studio headphones', detail: 'Spatial audio · 32-hour battery', price: '$249', mark: 'SH' },
  { id: 'travel-case', name: 'Travel case', detail: 'Recycled shell · Magnetic close', price: '$49', mark: 'TC' },
  { id: 'charging-stand', name: 'Charging stand', detail: 'Fast wireless charging', price: '$89', mark: 'CS' },
];

const commerceCss = \`
  .ag-commerce-layout { display: grid; grid-template-columns: minmax(0,1.55fr) minmax(270px,.75fr); gap: 16px; align-items: start; }
  .ag-commerce-products { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
  .ag-commerce-product { display: grid; gap: 10px; min-width: 0; padding: 12px; }
  .ag-commerce-visual { display: grid; place-items: center; aspect-ratio: 4 / 3; min-height: 112px; border: 1px solid rgba(255,255,255,.9); border-radius: 18px; background: linear-gradient(145deg,rgba(255,255,255,.35),rgba(255,255,255,.18)); box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 12px rgba(255,255,255,.12); color: rgba(30,41,59,.92); font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; }
  .ag-commerce-product h3 { margin: 0; font-size: .94rem; line-height: 1.3; }
  .ag-commerce-product p { margin: 0; min-height: 2.7em; color: #4b5a70; font-size: .78rem; line-height: 1.35; overflow-wrap: anywhere; }
  .ag-commerce-price { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-width: 0; }
  .ag-commerce-price > * { min-width: 0; }
  .ag-commerce-cart { display: grid; gap: 14px; position: sticky; top: 12px; }
  .ag-commerce-cart-line { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 10px; align-items: start; padding: 11px 0; border-bottom: 1px solid rgba(100,116,139,.18); }
  .ag-commerce-cart-line strong, .ag-commerce-cart-line small { display: block; overflow-wrap: anywhere; }
  .ag-commerce-cart-line small { margin-top: 3px; color: #4b5a70; }
  .ag-commerce-total { display: flex; justify-content: space-between; gap: 12px; font-size: 1.05rem; }
  @media (max-width: 820px) { .ag-commerce-layout { grid-template-columns: minmax(0,1fr); } .ag-commerce-cart { position: static; } }
  @media (max-width: 560px) { .ag-commerce-products { grid-template-columns: minmax(0,1fr); } .ag-commerce-visual { aspect-ratio: 16 / 7; min-height: 94px; } .ag-commerce-product p { min-height: 0; } .ag-commerce-price { flex-wrap: wrap; } .ag-commerce-price button { flex: 0 0 auto; max-width: 100%; } }
  @media (max-width: 350px) { .ag-commerce-price { display: grid; align-items: stretch; } .ag-commerce-price > [data-glass-component="true"] { display: block; width: 100%; } .ag-commerce-price button { width: 100%; } }
\`;

export function EcommerceProductPanel() {
  return (
    <section className="ag-light-recipe ag-recipe-commerce" aria-labelledby="featured-essentials"><style>{lightRecipeCss + commerceCss}</style>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}><GlassBadge variant="primary">Studio collection</GlassBadge><h1 id="featured-essentials" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px,4vw,40px)', lineHeight: 1.08, letterSpacing: '-.045em' }}>Featured essentials</h1><p style={{ margin: 0, color: '#4b5a70', lineHeight: 1.5 }}>Purposeful accessories for a focused, beautifully organized workspace.</p></div>
        <GlassButton size="sm">View collection</GlassButton>
      </header>
      <div className="ag-commerce-layout">
        <div className="ag-commerce-products" aria-label="Featured products">
          {products.map((product) => <GlassCard key={product.id} depth="medium" tint="neutral" className="ag-commerce-product"><div className="ag-commerce-visual" aria-hidden="true">{product.mark}</div><div><h3>{product.name}</h3><p>{product.detail}</p></div><div className="ag-commerce-price"><strong>{product.price}</strong><GlassButton size="sm" aria-label={'Add ' + product.name + ' to cart'}>Add</GlassButton></div></GlassCard>)}
        </div>
        <GlassCard depth="medium" tint="neutral" className="ag-commerce-cart" aria-labelledby="cart-summary">
          <div><GlassBadge variant="secondary">2 items</GlassBadge><h2 id="cart-summary" style={{ margin: '9px 0 3px', fontSize: '1.25rem', letterSpacing: '-.025em' }}>Cart summary</h2><p style={{ margin: 0, color: '#4b5a70', fontSize: '.86rem', lineHeight: 1.45 }}>Complimentary delivery and returns.</p></div>
          <div><div className="ag-commerce-cart-line"><span><strong>Studio headphones</strong><small>Graphite · Qty 1</small></span><strong>$249</strong></div><div className="ag-commerce-cart-line"><span><strong>Travel case</strong><small>Stone · Qty 1</small></span><strong>$49</strong></div></div>
          <div className="ag-commerce-total"><strong>Total</strong><strong>$298</strong></div>
          <GlassButton style={{ width: '100%' }}>Secure checkout</GlassButton>
          <small style={{ color: '#4b5a70', textAlign: 'center', lineHeight: 1.4 }}>Taxes calculated at checkout.</small>
        </GlassCard>
      </div>
    </section>
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
import { GlassAppShell, GlassMain, GlassPage, GlassPageHeader, GlassSidebarRail, GlassStatusBar, GlassTopBar } from 'aura-glass/app-shell';
import { DashboardIcon, SettingsIcon, UsersIcon } from 'aura-glass/icons/navigation';

export function SaasAdminShell() {
  const nav = [
    { id: 'dash', label: 'Dashboard', icon: <DashboardIcon />, active: true },
    { id: 'users', label: 'Users', icon: <UsersIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <GlassAppShell className="recipe-polish saas-admin-shell" density="compact"
      topBar={<GlassTopBar brand={<span><strong style={{ display: 'block', lineHeight: 1.2 }}>Northstar</strong><small style={{ display: 'block', color: 'rgba(51,65,85,.92)', lineHeight: 1.3 }}>Growth workspace</small></span>} actions={<GlassButton size="sm">Invite member</GlassButton>} />}
      sidebar={<GlassSidebarRail items={nav} />}
      statusBar={<div style={{ padding: 4, minWidth: 0 }}><GlassStatusBar className="glass-flex-wrap glass-py-1 glass-leading-5"><span>Production workspace ready</span><span>Synced moments ago</span></GlassStatusBar></div>}
    >
      ${recipePolishStyle}
      <style>{\`
        .saas-admin-shell { min-height: 0 !important; width: 100%; max-width: 100%; overflow: hidden; }
        .saas-admin-shell .glass-top-bar__brand { min-width: 0; }
        .saas-admin-shell .glass-sidebar-rail button { background: rgba(255,255,255,.18) !important; border-color: rgba(255,255,255,.72) !important; color: rgba(30,41,59,.94) !important; }
        .saas-admin-shell .admin-metrics { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
        .saas-admin-shell .admin-metric { min-width: 0; }
        .saas-admin-shell .admin-metric small, .saas-admin-shell .admin-account small { display: block; color: rgba(51,65,85,.92); line-height: 1.4; }
        .saas-admin-shell .admin-metric strong { display: block; margin-top: 6px; font-size: clamp(1.35rem,3vw,1.8rem); letter-spacing: -.04em; overflow-wrap: anywhere; }
        .saas-admin-shell .admin-grid { display: grid; grid-template-columns: minmax(0,1.3fr) minmax(250px,.7fr); gap: 12px; align-items: start; }
        .saas-admin-shell .admin-chart { display: flex; align-items: end; gap: 8px; height: 148px; margin-top: 16px; padding: 12px; border: 1px solid rgba(255,255,255,.82); border-radius: 16px; background: rgba(255,255,255,.18); }
        .saas-admin-shell .admin-chart span { flex: 1; min-width: 8px; border-radius: 8px 8px 4px 4px; background: linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.18)); border: 1px solid rgba(255,255,255,.88); box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 5px 14px rgba(71,85,105,.11); }
        .saas-admin-shell .admin-account { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 10px; align-items: center; padding: 11px 0; border-top: 1px solid rgba(100,116,139,.18); }
        .saas-admin-shell .admin-account strong { display: block; overflow-wrap: anywhere; }
        @media (max-width: 760px) { .saas-admin-shell .admin-metrics { grid-template-columns: repeat(2,minmax(0,1fr)); } .saas-admin-shell .admin-grid { grid-template-columns: minmax(0,1fr); } }
        @media (max-width: 600px) { .saas-admin-shell { width: 100% !important; margin-left: 0 !important; } .saas-admin-shell .glass-app-shell__body { grid-template-columns: minmax(0,1fr) !important; } .saas-admin-shell .glass-sidebar-rail { width: 100% !important; flex-direction: row !important; justify-content: center; } .saas-admin-shell .glass-status-bar { align-items: flex-start; flex-direction: column; gap: 2px; padding-top: 8px; padding-bottom: 8px; } .saas-admin-shell .glass-top-bar { align-items: center; } .saas-admin-shell .glass-top-bar__actions { flex-shrink: 0; } }
        @media (max-width: 360px) { .saas-admin-shell .admin-metrics { grid-template-columns: minmax(0,1fr); } .saas-admin-shell .glass-top-bar { flex-wrap: wrap; } .saas-admin-shell .glass-top-bar__actions { width: 100%; margin-left: 0; } }
      \`}</style>
      <GlassMain>
        <GlassPage>
          <GlassPageHeader eyebrow="Revenue operations" title="Good morning, Maya" description="Monitor account health, expansion, and activation from one calm operating view." actions={<GlassButton size="sm">Export report</GlassButton>} />
          <div className="admin-metrics">
            {[['Monthly revenue','$428K','+12.4% this quarter'],['Active accounts','1,284','38 added this month'],['Net retention','118%','4 points above plan'],['Open pipeline','$2.4M','128 qualified accounts']].map(([label,value,note]) => <GlassCard key={label} depth="medium" tint="neutral" className="admin-metric"><small>{label}</small><strong>{value}</strong><small>{note}</small></GlassCard>)}
          </div>
          <div className="admin-grid">
            <GlassCard depth="medium" tint="neutral"><div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', justifyContent: 'space-between', gap: 10 }}><div><h2 className="recipe-section-title">Pipeline health</h2><p className="recipe-copy" style={{ marginTop: 5 }}>$2.4M weighted pipeline across 128 accounts.</p></div><GlassBadge variant="secondary">Last 8 weeks</GlassBadge></div><div className="admin-chart" role="img" aria-label="Pipeline increased steadily over the last eight weeks">{[38,49,44,62,58,76,72,88].map((height,index) => <span key={index} style={{ height: height + '%' }} />)}</div></GlassCard>
            <GlassCard depth="medium" tint="neutral"><div><h2 className="recipe-section-title">Accounts to watch</h2><p className="recipe-copy" style={{ marginTop: 5 }}>Signals requiring a focused follow-up.</p></div><div style={{ marginTop: 10 }}>{[['Acme Studio','Renewal in 12 days','At plan'],['Orbital Labs','Usage up 24%','Expansion'],['River & Co.','2 seats inactive','Review']].map(([name,note,state]) => <div key={name} className="admin-account"><span><strong>{name}</strong><small>{note}</small></span><GlassBadge variant="secondary">{state}</GlassBadge></div>)}</div></GlassCard>
          </div>
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
    imports: ["GlassBadge", "GlassButton", "GlassCard"],
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
${lightRecipeCssSource}

export function AiProductConsole() {
  return (
    <section className="ag-light-recipe" aria-labelledby="ai-product"><style>{lightRecipeCss}</style>
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}><div><GlassBadge variant="primary">Production · Live</GlassBadge><h1 id="ai-product" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.04em' }}>AI product console</h1><p style={{ margin: 0, color: '#526071' }}>Inspect response quality, knowledge coverage, and recent evaluations.</p></div><GlassButton size="sm">New evaluation</GlassButton></header>
      <GlassCard depth="strong" tint="neutral"><label htmlFor="product-prompt" style={{ fontWeight: 650 }}>Test a production prompt</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}><input id="product-prompt" placeholder="Summarize workspace telemetry" style={{ flex: '1 1 220px', minWidth: 0, boxSizing: 'border-box', padding: '12px 14px', color: '#172033', background: 'rgba(255,255,255,.3)', border: '1px solid rgba(80,102,130,.28)', borderRadius: 12, font: 'inherit' }} /><GlassButton size="sm">Generate</GlassButton></div></GlassCard>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: 12 }}><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Grounded responses</small><strong style={{ display: 'block', fontSize: 28, marginTop: 7 }}>98.0%</strong><span style={{ color: '#176b4d' }}>42 sources indexed</span></GlassCard><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Evaluation pass rate</small><strong style={{ display: 'block', fontSize: 28, marginTop: 7 }}>94.6%</strong><span style={{ color: '#176b4d' }}>+2.4% this release</span></GlassCard><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Cost per answer</small><strong style={{ display: 'block', fontSize: 28, marginTop: 7 }}>$0.018</strong><span style={{ color: '#526071' }}>Within budget</span></GlassCard></div>
      <GlassCard depth="medium" tint="neutral"><div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}><div><h2 style={{ margin: 0, fontSize: 18 }}>Latest evaluation</h2><p style={{ margin: '4px 0 0', color: '#526071' }}>Workspace assistant · 120 test cases</p></div><strong style={{ color: '#176b4d' }}>Passed</strong></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>{[['Accuracy','96%'],['Safety','100%'],['Tone','92%']].map(([label,value]) => <div key={label} style={{ padding: 12, textAlign: 'center', borderRadius: 14, background: 'rgba(255,255,255,.24)', border: '1px solid rgba(80,102,130,.16)' }}><strong style={{ display: 'block', fontSize: 20 }}>{value}</strong><small style={{ color: '#526071' }}>{label}</small></div>)}</div></GlassCard>
    </section>
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
${lightRecipeCssSource}
import { LiquidGlassMediaControls, GlassMusicVisualizer } from 'aura-glass';
import { GlassCanvasArea, GlassTimelineRail, GlassWorkspace, GlassWorkspaceHeader } from 'aura-glass/workspace';
import { PlayIcon, VideoIcon } from 'aura-glass/icons/media';

export function MediaReviewWorkspace() {
  return (
    <section className="ag-light-recipe ag-media-review" aria-label="Media review workspace">
      <style>{lightRecipeCss}</style>
      <GlassWorkspace header={<GlassWorkspaceHeader title="Media review" description="Review clips, notes, and audio intensity from one glass workspace." />}>
        <GlassCanvasArea><VideoIcon size={48} /><p>Hero cut preview</p></GlassCanvasArea>
        <LiquidGlassMediaControls compact playing currentTime={42} duration={180} />
        <GlassTimelineRail label="Timeline"><span><PlayIcon /> Intro sequence</span><GlassMusicVisualizer className="ag-media-visualizer" compact contained realTimeAnalysis={false} /></GlassTimelineRail>
      </GlassWorkspace>
    </section>
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
${lightRecipeCssSource}

const commerceOperationsCss = \`
  .ag-recipe-commerce-ops { box-sizing: border-box; min-width: 0; width: 100%; overflow: hidden; }
  .ag-recipe-commerce-ops > header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .ag-recipe-commerce-ops > p { display: flex; align-items: flex-start; gap: 6px; margin: 6px 0; }
  .ag-recipe-commerce-ops :where(.optimized-glass-surface, [class*="product"], [class*="recommend"], [class*="cart"]) { min-width: 0 !important; max-width: 100% !important; }
  .ag-recipe-commerce-ops :where(h1,h2,h3,p,span,strong,small) { overflow-wrap: anywhere; }
  @media (max-width: 350px) {
    .ag-recipe-commerce-ops { padding: 12px !important; }
    .ag-recipe-commerce-ops > header { display: grid; justify-items: start; }
    .ag-recipe-commerce-ops :where([class*="grid"], [class*="products"], [class*="recommend"]) { grid-template-columns: minmax(0,1fr) !important; }
    .ag-recipe-commerce-ops :where(.glass-flex, [class*="flex"]) { flex-wrap: wrap !important; }
    .ag-recipe-commerce-ops .glass-foundation-basic { padding: 12px !important; }
    .ag-recipe-commerce-ops .glass-foundation-basic img { display: none !important; }
    .ag-recipe-commerce-ops .glass-foundation-basic :where(.glass-flex-1, .glass-min-glass-w-0) { width: 100% !important; min-width: 0 !important; }
    .ag-recipe-commerce-ops .glass-foundation-basic :where(.glass-truncate, h3, p) { white-space: normal !important; overflow: visible !important; text-overflow: clip !important; overflow-wrap: anywhere !important; }
    .ag-recipe-commerce-ops .glass-mt-6 > .glass-flex { display: grid !important; grid-template-columns: minmax(0,1fr) !important; }
  }
\`;

export function CommerceOperationsPanel() {
  return (
    <GlassCard depth="medium" tint="neutral" className="ag-light-recipe ag-recipe-surface ag-recipe-commerce ag-recipe-commerce-ops">
      <style>{lightRecipeCss + commerceOperationsCss}</style>
      <header><h2>Commerce operations</h2><GlassButton size="sm">Review orders</GlassButton></header>
      <p><SuccessIcon /> 94 orders cleared fulfillment.</p>
      <p><WarningIcon /> 6 carts need payment follow-up.</p>
      <GlassProductRecommendations title="Inventory watch" variant="compact" showQuickActions={false} products={[
        { id: 'studio-headphones', name: 'Studio headphones', price: 249, rating: 4.8, reviewCount: 128, stock: 12, availability: 'in-stock', images: [] },
        { id: 'travel-case', name: 'Travel case', price: 49, rating: 4.7, reviewCount: 64, stock: 24, availability: 'in-stock', images: [] },
      ]} />
      <GlassSmartShoppingCart compact contained />
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
      "GlassBadge",
      "GlassButton",
      "GlassCard",
      "GlassMetricChip",
      "GlassUserPresence",
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
import { CollaborativeGlassWorkspace, GlassBadge, GlassButton, GlassCard, GlassMetricChip, GlassUserPresence } from 'aura-glass';
import { GlassInspectorPanel, GlassWorkspace } from 'aura-glass/workspace';
import { UsersIcon } from 'aura-glass/icons/collaboration';
${lightRecipeCssSource}

const teammates = [
  { id: 'elena', name: 'Elena Park', status: 'online' as const, role: 'admin' as const, activity: 'Facilitating weekly review' },
  { id: 'marcus', name: 'Marcus Reed', status: 'online' as const, role: 'member' as const, activity: 'Updating mobile handoff' },
  { id: 'noor', name: 'Noor Ali', status: 'busy' as const, role: 'member' as const, activity: 'Finalizing research summary' },
  { id: 'sam', name: 'Sam Rivera', status: 'away' as const, role: 'guest' as const, activity: 'Back at 3:00 PM' },
];

const priorities = [
  ['Mobile handoff', 'Owner · Marcus', 'Due today'],
  ['Research synthesis', 'Owner · Noor', 'Review tomorrow'],
  ['Launch readiness', 'Owner · Elena', '8 of 10 complete'],
];

export function TeamCollaborationHub() {
  return (
    <section className="ag-light-recipe ag-collab-recipe" aria-labelledby="team-hub-title">
      <style>{lightRecipeCss}</style>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <GlassBadge variant="secondary">Weekly team room</GlassBadge>
          <h1 id="team-hub-title" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.04em', lineHeight: 1.08 }}>Collaboration hub</h1>
          <p style={{ margin: 0, color: '#526071' }}>Presence, priorities, and shared work for the launch team.</p>
        </div>
        <GlassButton size="sm">Invite teammate</GlassButton>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 12 }}>
        <GlassMetricChip label="Online now" value="3" delta="1 away" intent="default" icon={<UsersIcon />} />
        <GlassMetricChip label="Open tasks" value="7" delta="3 due today" intent="default" />
        <GlassMetricChip label="Review queue" value="4" delta="2 assigned" intent="default" />
      </div>

      <GlassWorkspace
        className="ag-recipe-workspace"
        inspector={
          <GlassInspectorPanel title="Team presence">
            <p style={{ margin: '0 0 12px', color: '#526071', fontSize: 14 }}><UsersIcon /> Four teammates are in this room.</p>
            <GlassUserPresence users={teammates} compact showRoles showActivities maxUsers={4} />
          </GlassInspectorPanel>
        }
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <GlassCard depth="medium" tint="neutral" className="ag-recipe-surface" style={{ padding: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
              <div><h2 style={{ margin: 0, fontSize: 18 }}>Priority board</h2><p style={{ margin: '4px 0 0', color: '#526071', fontSize: 14 }}>The work that needs a decision next.</p></div>
              <GlassButton size="sm" variant="secondary">View all tasks</GlassButton>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {priorities.map(([title, owner, state]) => (
                <div key={title} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 10, padding: '11px 12px', border: '1px solid rgba(255,255,255,.32)', borderRadius: 14, background: 'rgba(255,255,255,.18)' }}>
                  <strong>{title}</strong><small style={{ color: '#526071', textAlign: 'right' }}>{owner}<br />{state}</small>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard depth="medium" tint="neutral" className="ag-recipe-surface ag-recipe-collaboration" style={{ padding: 12, overflow: 'hidden' }}>
            <CollaborativeGlassWorkspace
              workspaceId="team-collaboration-hub"
              userId="elena"
              userName="Elena Park"
              userEmail="elena@example.com"
              userRole="admin"
              aria-label="Team collaboration canvas"
              compact
              contained
              maxHeight={300}
              theme="light"
              enableRealTimeSync={false}
              enableVoiceChat={false}
              enableVersionControl={false}
              showMiniMap={false}
              showOnlineUsers={false}
              showCursors={false}
            />
          </GlassCard>
        </div>
      </GlassWorkspace>
    </section>
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
    imports: ["GlassBadge", "GlassButton", "GlassCard"],
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
${lightRecipeCssSource}

export function SettingsAndBillingSuite() {
  return (
    <section className="ag-light-recipe" aria-labelledby="settings-suite"><style>{lightRecipeCss}</style>
      <header><GlassBadge variant="primary">Workspace controls</GlassBadge><h1 id="settings-suite" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.04em' }}>Settings and billing</h1><p style={{ margin: 0, color: '#526071' }}>Account controls, plan state, and billing workflow in one calm workspace.</p></header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 12 }}>
        <GlassCard depth="medium" tint="neutral"><h2 style={{ margin: '0 0 4px', fontSize: 20 }}>Workspace identity</h2><p style={{ margin: '0 0 14px', color: '#526071' }}>Shown to everyone in Northstar.</p><label style={{ display: 'block', fontWeight: 650 }}>Workspace name<input defaultValue="Northstar Studio" style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 14px', color: '#172033', background: 'rgba(255,255,255,.3)', border: '1px solid rgba(80,102,130,.28)', borderRadius: 12, font: 'inherit' }} /></label><label style={{ display: 'block', marginTop: 12, fontWeight: 650 }}>Billing email<input type="email" defaultValue="finance@northstar.co" style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 14px', color: '#172033', background: 'rgba(255,255,255,.3)', border: '1px solid rgba(80,102,130,.28)', borderRadius: 12, font: 'inherit' }} /></label></GlassCard>
        <GlassCard depth="strong" tint="neutral"><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><div><small style={{ color: '#526071' }}>Studio annual</small><h2 style={{ margin: '6px 0 2px', fontSize: 24 }}>$10,368 / year</h2></div><GlassBadge variant="primary">Active</GlassBadge></div><p style={{ color: '#526071' }}>Renews September 12, 2027 · 18 seats</p><div style={{ display: 'grid', gap: 10, margin: '18px 0' }}>{[['Payment method','Visa ···· 4242'],['Next invoice','$864.00'],['Usage','18 of 25 seats']].map(([label,value]) => <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 10, borderTop: '1px solid rgba(86,104,126,.16)' }}><span style={{ color: '#526071' }}>{label}</span><strong>{value}</strong></div>)}</div><GlassButton size="sm">Manage plan</GlassButton></GlassCard>
      </div>
      <GlassCard depth="medium" tint="neutral"><h2 style={{ margin: '0 0 12px', fontSize: 20 }}>Invoice delivery</h2><div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}><p style={{ margin: 0, color: '#526071' }}>Monthly invoices and renewal reminders go to finance@northstar.co.</p><GlassButton>Save settings</GlassButton></div></GlassCard>
    </section>
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
${lightRecipeCssSource}
import { GlassCard, GlassDataChart, GlassHeatmap } from 'aura-glass';
import { GlassCommandDock, GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { DatabaseIcon, SearchIcon } from 'aura-glass/icons/data';

const revenueAndRetention = [
  { id: 'revenue', label: 'Revenue index', formatType: 'number', data: [{ x: 'Mar', y: 71 }, { x: 'Apr', y: 76 }, { x: 'May', y: 82 }, { x: 'Jun', y: 88 }, { x: 'Jul', y: 94 }, { x: 'Aug', y: 100 }] },
  { id: 'retention', label: 'Retention index', formatType: 'number', data: [{ x: 'Mar', y: 78 }, { x: 'Apr', y: 80 }, { x: 'May', y: 83 }, { x: 'Jun', y: 86 }, { x: 'Jul', y: 89 }, { x: 'Aug', y: 92 }] },
];

const usageByDay = [
  [42, 56, 63, 69, 73, 58, 46],
  [49, 61, 68, 74, 78, 64, 51],
  [53, 66, 72, 79, 84, 70, 57],
  [57, 70, 77, 83, 88, 74, 61],
];

export function AnalyticsCommandCenter() {
  return (
    <section className="ag-light-recipe ag-recipe-chart" aria-label="Analytics command center">
      <style>{lightRecipeCss}</style>
      <GlassPage>
      <GlassPageHeader title="Analytics command center" description="Filter revenue, retention, and usage from one command surface." actions={<DatabaseIcon />} />
      <GlassCommandDock input={<span><SearchIcon /> Ask for cohort performance</span>} />
        <div className="recipe-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 12 }}>
          {[
            ['Revenue', '$263k', '+18.6%'],
            ['Net retention', '112.4%', '+3.8 pts'],
            ['Weekly active', '18,420', '+9.2%'],
            ['Risked revenue', '$38k', '14 accounts'],
          ].map(([label, value, note]) => <GlassCard key={label} depth="medium" tint="neutral"><small style={{ color: '#526071', fontWeight: 650 }}>{label}</small><strong style={{ display: 'block', margin: '7px 0 4px', fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-.035em' }}>{value}</strong><span style={{ color: '#526071', fontSize: 13 }}>{note}</span></GlassCard>)}
        </div>
        <GlassCard depth="medium" tint="neutral"><GlassDataChart title="Momentum index" subtitle="Normalized revenue and retention · Mar–Aug" datasets={revenueAndRetention} variant="line" width="100%" height={300} glassVariant="clear" palette={['#42546d', '#91a0b2']} showToolbar={false} allowDownload={false} legend={{ show: true, position: 'top', align: 'start', style: 'compact', glassEffect: false }} /></GlassCard>
        <GlassCard depth="medium" tint="neutral"><div style={{ marginBottom: 14 }}><h2 style={{ margin: 0, fontSize: 19, letterSpacing: '-.02em' }}>Workspace engagement</h2><p style={{ margin: '5px 0 0', color: '#526071', fontSize: 14 }}>Active-session intensity for the last four operating weeks.</p></div><GlassHeatmap data={usageByDay} xAxis={{ title: 'Day', labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] }} yAxis={{ title: 'Week', labels: ['Jul 15', 'Jul 22', 'Jul 29', 'Aug 5'] }} colorScale={{ min: '#f1f5f9', mid: '#cbd5e1', max: '#94a3b8', steps: 7 }} cellSize={18} cellGap={8} contained maxHeight={290} showValues showLegend legendPosition="bottom" animated={false} /></GlassCard>
      </GlassPage>
    </section>
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
${lightRecipeCssSource}
import { GlassButton, GlassCalendar, GlassCard } from 'aura-glass';
import { GlassWorkspacePanel } from 'aura-glass/workspace';
import { CalendarIcon } from 'aura-glass/icons/navigation';

export function CalendarOperationsBoard() {
  return (
    <section className="ag-light-recipe ag-recipe-calendar" aria-label="Calendar operations board">
      <style>{lightRecipeCss}</style>
      <GlassWorkspacePanel title="Launch calendar" actions={<GlassButton size="sm">New event</GlassButton>}>
        <p><CalendarIcon /> May launch sequence</p>
        <GlassCard depth="medium" tint="neutral"><GlassCalendar compact contained maxRows={4} maxHeight={420} /></GlassCard>
      </GlassWorkspacePanel>
    </section>
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
    imports: ["GlassBadge", "GlassButton", "GlassCard"],
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
import { GlassBadge, GlassButton, GlassCard } from 'aura-glass';
${lightRecipeCssSource}

const tickets = [
  ['#8421', 'Onboarding import failed', 'Urgent', 'Maya Lin'],
  ['#8418', 'Invoice total looks incorrect', 'High', 'Noah Kim'],
  ['#8412', 'Add SSO domain', 'Normal', 'Avery Stone'],
];

export function CustomerSupportConsole() {
  return (
    <section className="ag-light-recipe" aria-labelledby="support-queue"><style>{lightRecipeCss}</style>
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'end', gap: 12 }}><div><GlassBadge variant="primary">Support operations</GlassBadge><h1 id="support-queue" style={{ margin: '10px 0 4px', fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.04em' }}>Customer support queue</h1><p style={{ margin: 0, color: '#526071' }}>Prioritize escalations and keep response times on target.</p></div><GlassButton size="sm">Create ticket</GlassButton></header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 175px), 1fr))', gap: 12 }}><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Open tickets</small><strong style={{ display: 'block', marginTop: 6, fontSize: 28 }}>64</strong><span style={{ color: '#8a5611' }}>12 escalated</span></GlassCard><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>Resolved today</small><strong style={{ display: 'block', marginTop: 6, fontSize: 28 }}>48</strong><span style={{ color: '#176b4d' }}>+14% vs average</span></GlassCard><GlassCard depth="medium" tint="neutral"><small style={{ color: '#526071' }}>First response</small><strong style={{ display: 'block', marginTop: 6, fontSize: 28 }}>7m 42s</strong><span style={{ color: '#176b4d' }}>Within SLA</span></GlassCard></div>
      <GlassCard depth="medium" tint="neutral"><div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}><div><h2 style={{ margin: 0, fontSize: 20 }}>Priority tickets</h2><p style={{ margin: '4px 0 0', color: '#526071' }}>Sorted by urgency and customer impact.</p></div><input type="search" aria-label="Search tickets" placeholder="Search tickets" style={{ flex: '0 1 230px', minWidth: 0, boxSizing: 'border-box', padding: '10px 12px', color: '#172033', background: 'rgba(255,255,255,.3)', border: '1px solid rgba(80,102,130,.28)', borderRadius: 12, font: 'inherit' }} /></div>{tickets.map(([id, subject, priority, owner]) => <div key={id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 10, padding: '12px 0', borderTop: '1px solid rgba(86,104,126,.16)' }}><span style={{ minWidth: 0 }}><strong style={{ display: 'block', overflowWrap: 'anywhere' }}>{id} · {subject}</strong><small style={{ color: '#526071' }}>Assigned to {owner}</small></span><strong style={{ color: priority === 'Urgent' ? '#9b3137' : priority === 'High' ? '#8a5611' : '#526071' }}>{priority}</strong></div>)}</GlassCard>
    </section>
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
${lightRecipeCssSource}
import { GlassCard, GlassFileUpload, GlassImageViewer, GlassMusicVisualizer } from 'aura-glass';
import { GlassWorkflowShell } from 'aura-glass/workspace';
import { ImageIcon, VideoIcon } from 'aura-glass/icons/media';

export function CreatorStudioDashboard() {
  return (
    <section className="ag-light-recipe ag-creator-studio" aria-label="Creator studio dashboard">
      <style>{lightRecipeCss}</style>
      <GlassWorkflowShell title="Creator studio" description="Plan, upload, preview, and review media in one glass-native studio.">
        <GlassCard depth="medium" tint="neutral">
          <p><ImageIcon /> Asset library</p>
          <p><VideoIcon /> Review queue</p>
          <GlassFileUpload compact contained showActions={false} />
          <div className="ag-creator-grid">
            <GlassImageViewer className="ag-media-preview" contained compact height={260} />
            <GlassMusicVisualizer className="ag-media-visualizer" compact contained maxHeight={280} realTimeAnalysis={false} />
          </div>
        </GlassCard>
      </GlassWorkflowShell>
    </section>
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
import { GlassBadge, GlassButton, GlassCard, GlassErrorState, GlassMetricChip, GlassProgress } from 'aura-glass';
import { GlassCommandDock, GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { CommandIcon, SparkIcon, ZapIcon } from 'aura-glass/icons/ai';
import { AlertTriangleIcon, InfoIcon } from 'aura-glass/icons/status';

const safetyReviews = ['PII redaction', 'Prompt injection scan', 'Grounding evidence'];

export function AiOpsControlRoom() {
  return (
    <GlassPage className="recipe-polish">
      ${recipePolishStyle}
      <GlassPageHeader
        title="AI ops control room"
        description="Track provider readiness, spend, rate limits, and prompt-safety review without assuming hosted credentials are present."
        actions={<GlassBadge variant="warning"><AlertTriangleIcon /> Provider unconfigured</GlassBadge>}
      />
      <GlassCommandDock input={<span><CommandIcon /> Review usage policy</span>} actions={<SparkIcon />} />
      <section className="recipe-metrics glass-grid glass-gap-4 md:glass-grid-cols-3" aria-label="AI operations metrics">
        <GlassMetricChip label="Daily spend" value="$0.00" delta="No provider key" intent="warning" icon={<InfoIcon />} />
        <GlassMetricChip label="Rate limit" value="Paused" delta="Fail-closed" intent="warning" icon={<ZapIcon />} />
        <GlassMetricChip label="Prompt reviews" value={safetyReviews.length} delta="Manual queue" intent="success" icon={<SparkIcon />} />
      </section>
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
        <h2>Cost budget</h2>
        <GlassProgress value={18} variant="warning" label="Monthly AI budget reserved" showValue animated={false} />
        <ul className="recipe-list" aria-label="Provider telemetry readiness">
          <li className="recipe-row"><span>Credentials</span><small>Not connected</small></li>
          <li className="recipe-row"><span>Usage polling</span><small>Paused safely</small></li>
        </ul>
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
import { GlassBadge, GlassButton, GlassCard, GlassEmptyState, GlassErrorState, GlassLoadingState, GlassSearchField } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { DatabaseIcon, FileIcon, SearchIcon } from 'aura-glass/icons/data';

export function SemanticSearchConsole() {
  return (
    <GlassPage className="recipe-polish">
      ${recipePolishStyle}
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
        <ul className="recipe-list" aria-label="Relevance defaults">
          <li className="recipe-row"><span>Score threshold</span><small>0.78 recommended</small></li>
          <li className="recipe-row"><span>Chunk window</span><small>800 tokens</small></li>
          <li className="recipe-row"><span>Source weighting</span><small>Balanced</small></li>
        </ul>
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
import { GlassBadge, GlassCard, GlassEmptyState, GlassErrorState, GlassFileUpload } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { ImageIcon } from 'aura-glass/icons/media';
import { AlertCircleIcon, InfoIcon } from 'aura-glass/icons/status';

export function VisionReviewWorkbench() {
  return (
    <GlassPage className="recipe-polish">
      ${recipePolishStyle}
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
          <div className="recipe-row" role="status"><span>No image selected</span><small>PNG, JPG, or WebP</small></div>
        </GlassCard>
        <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
          <GlassErrorState
            severity="warning"
            title="Vision provider not configured"
            description="OCR, object detection, and safe-search analysis remain unavailable until credentials are connected."
            details={<code>VISION_PROVIDER_READY=false</code>}
          />
          <ul className="recipe-list" aria-label="Analysis queue">
            <li className="recipe-row"><span>OCR extraction</span><small>Waiting</small></li>
            <li className="recipe-row"><span>Object labels</span><small>Waiting</small></li>
            <li className="recipe-row"><span>Safety review</span><small>Waiting</small></li>
          </ul>
          <GlassEmptyState variant="compact" title="No OCR results" description="Run analysis after provider setup." icon={<ImageIcon />} />
          <p className="recipe-note"><InfoIcon /> Keep manual review available for images that cannot be sent to provider APIs.</p>
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
    <GlassWorkspace className="ag-recipe-workspace ag-recipe-room" inspector={<GlassInspectorPanel title="Room presence"><UsersIcon /> {participants.length} observers</GlassInspectorPanel>}>
      <style>{\`
        .ag-recipe-room { min-width: 0; }
        .ag-recipe-room .ag-room-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .ag-recipe-room .ag-room-metrics { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
        .ag-recipe-room .ag-room-metrics > * { min-width: 0; width: 100%; }
        .ag-recipe-room .ag-room-status { padding: 10px 12px; }
        .ag-recipe-room .ag-room-status-content { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 4px 12px; align-items: baseline; min-width: 0; }
        .ag-recipe-room .ag-room-status-content > span { grid-column: 1 / -1; display: flex; align-items: center; gap: 6px; }
        .ag-recipe-room .ag-room-status-content > strong { grid-column: 1; }
        .ag-recipe-room .ag-room-status-content > small { grid-column: 2; text-align: right; }
        .ag-recipe-room .ag-room-status small { overflow-wrap: anywhere; }
        .ag-recipe-room :where(.truncate, .glass-truncate) { white-space: normal !important; overflow: visible !important; text-overflow: clip !important; overflow-wrap: anywhere; }
        @media (max-width: 350px) {
          .ag-recipe-room .ag-room-header { display: grid; justify-items: start; }
          .ag-recipe-room .ag-room-metrics { grid-template-columns: minmax(0,1fr); }
          .ag-recipe-room .ag-room-metrics > * { grid-column: 1 / -1; }
        }
      \`}</style>
      <section className="glass-grid glass-gap-4">
        <GlassCard depth="medium" tint="neutral" className="ag-recipe-surface glass-space-y-4 glass-p-4">
          <header className="ag-room-header">
            <h2>Collaboration room</h2>
            <GlassBadge variant="warning"><BellIcon /> Editing unsupported</GlassBadge>
          </header>
          <div className="ag-room-metrics">
            <GlassCard depth="low" tint="neutral" className="ag-room-status"><div className="ag-room-status-content"><span><UsersIcon /> Presence</span><strong>Static</strong><small>No WebSocket</small></div></GlassCard>
            <GlassCard depth="low" tint="neutral" className="ag-room-status"><div className="ag-room-status-content"><span>Selections</span><strong>Read-only</strong><small>3 watchers</small></div></GlassCard>
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
import { GlassBadge, GlassButton, GlassCard, GlassErrorState, GlassMetricChip, GlassNotificationCenter } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { SearchIcon } from 'aura-glass/icons/data';
import { AlertCircleIcon, SuccessIcon } from 'aura-glass/icons/status';

export function SupportTriageWorkspace() {
  return (
    <GlassPage className="recipe-polish">
      ${recipePolishStyle}
      <GlassPageHeader
        title="Support triage workspace"
        description="Prioritize escalations, SLA risk, and account context with AI summaries disabled until providers are configured."
        actions={<GlassBadge variant="warning"><AlertCircleIcon /> 4 SLA risks</GlassBadge>}
      />
      <section className="recipe-metrics glass-grid glass-gap-4 md:glass-grid-cols-3" aria-label="Support queue summary">
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
        <ul className="recipe-list" aria-label="Priority support queue">
          <li className="recipe-row"><span>AG-1842 · Login recovery</span><small>12 min to SLA</small></li>
          <li className="recipe-row"><span>AG-1839 · Billing mismatch</span><small>Enterprise · High</small></li>
          <li className="recipe-row"><span>AG-1835 · Export delayed</span><small>Assigned · Maya</small></li>
        </ul>
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
    <GlassPage className="recipe-polish">
      ${recipePolishStyle}
      <GlassPageHeader
        title="Release command center"
        description="Coordinate launch readiness, staged rollout, changelog review, evidence links, and rollback controls."
        actions={<GlassBadge variant="success"><SuccessIcon /> 3.3 candidate</GlassBadge>}
      />
      <section className="recipe-metrics glass-grid glass-gap-4 md:glass-grid-cols-3" aria-label="Release metrics">
        <GlassMetricChip label="Checklist" value="3/4" delta="Manual QA left" intent="warning" icon={<CheckIcon />} />
        <GlassMetricChip label="Rollout" value="25%" delta="Canary" intent="success" icon={<RefreshIcon />} />
        <GlassMetricChip label="Evidence" value="Linked" delta="3.3 reports" intent="default" icon={<DownloadIcon />} />
      </section>
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
        <h2>Rollout status</h2>
        <GlassProgress value={25} variant="success" label="Canary rollout" showValue animated={false} />
        <ul className="recipe-list" aria-label="Release checklist">
          {checklist.map((item, index) => <li className="recipe-row" key={item}><span><CheckIcon /> {item}</span><small>{index === 2 ? 'In review' : 'Complete'}</small></li>)}
        </ul>
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
import { GlassBadge, GlassButton, GlassCard, GlassEmptyState, GlassSearchField } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { FileIcon, SearchIcon } from 'aura-glass/icons/data';

const entrypoints = ['aura-glass', 'aura-glass/theme', 'aura-glass/app-shell', 'aura-glass/registry'];

export function DeveloperDocsPortal() {
  return (
    <GlassPage className="recipe-polish">
      ${recipePolishStyle}
      <GlassPageHeader
        title="Developer docs portal"
        description="Document stable package entrypoints, recipes, examples, and release evidence from one glass-native docs shell."
        actions={<GlassBadge variant="primary"><FileIcon /> 3.3 docs</GlassBadge>}
      />
      <GlassCard depth="medium" tint="neutral" className="glass-space-y-4 glass-p-4">
        <GlassSearchField label="Search docs" placeholder="Find components, recipes, or entrypoints" value="" onChange={() => undefined} />
        <nav className="recipe-docs-nav glass-flex glass-flex-wrap glass-gap-2" aria-label="Documentation sections">
          <GlassButton size="sm">Install</GlassButton>
          <GlassButton size="sm" variant="secondary">Components</GlassButton>
          <GlassButton size="sm" variant="secondary">Recipes</GlassButton>
        </nav>
        <div className="glass-grid glass-gap-3 md:glass-grid-cols-2">
          {entrypoints.map((entrypoint) => (
            <GlassCard key={entrypoint} depth="subtle" tint="neutral" className="glass-p-3">
              <h3>{entrypoint}</h3>
              <code className="recipe-code">import &#123; GlassButton &#125; from '{entrypoint}';</code>
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
    <main className="ag-marketing-launch-kit glass-min-h-screen glass-text-primary">
      <section className="glass-relative glass-overflow-hidden glass-p-8 md:glass-p-12">
        <AuroraBackground className="ag-aurora-background--light" particles={12} grain vignette reducedMotion seed="auraglass-33-launch" />
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
