import 'aura-glass/styles';
import { CollaborativeGlassWorkspace, GlassBadge, GlassButton, GlassCard, GlassMetricChip, GlassUserPresence } from 'aura-glass';
const lightRecipeCss = "\n.ag-light-recipe {\n  --glass-theme-text: #172033;\n  --glass-text-primary: #172033;\n  --typography-text-primary: #172033;\n  --aura-color-global-text-primary: #172033;\n  --aura-color-global-text-secondary: #4b5a70;\n  color: #172033;\n  display: grid;\n  gap: 16px;\n  min-width: 0;\n}\n.ag-light-recipe :where(h1, h2, h3, h4, p, span, label) { color: inherit; }\n.ag-light-recipe :where(.optimized-glass-surface, .glass-workspace-panel, .glass-action-bar, .glass-canvas-area, .glass-timeline-rail, .glass-command-dock, .glass-music-visualizer) {\n  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.18)) !important;\n  border-color: rgba(255,255,255,.92) !important;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 12px rgba(255,255,255,.12), 0 14px 36px rgba(86,107,135,.14) !important;\n  color: #172033 !important;\n}\n.ag-light-recipe :where(.optimized-glass-surface, .glass-music-visualizer) { max-width: 100%; min-width: 0; }\n.ag-light-recipe :where(.glass-music-visualizer) { overflow: hidden !important; }\n.ag-light-recipe :where(.glass-music-visualizer canvas) {\n  background: linear-gradient(145deg, rgba(255,255,255,.32), rgba(255,255,255,.16)) !important;\n  border-color: rgba(109,132,160,.22) !important;\n  max-width: 100%;\n}\n.ag-light-recipe :where(.liquid-glass-media-controls) {\n  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.18)) !important;\n  border: 1px solid rgba(255,255,255,.94) !important;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 12px rgba(255,255,255,.12), 0 12px 30px rgba(86,107,135,.14) !important;\n  color: #172033 !important;\n  max-width: 100%;\n}\n.ag-light-recipe :where(.liquid-glass-media-controls span) { color: #334155 !important; text-shadow: none !important; }\n.ag-light-recipe :where(input[type=\"range\"]) { height: 12px !important; min-height: 12px; }\n.ag-light-recipe :where(canvas, svg) { max-width: 100%; }\n.ag-light-recipe :where([class*=\"emptyState\"], [class*=\"empty-state\"]) {\n  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.2)) !important;\n  color: #172033 !important;\n}\n.ag-light-recipe :where([class*=\"emptyState\"], [class*=\"empty-state\"]) * { color: #4b5a70 !important; }\n.ag-light-recipe :where([class*=\"emptyState\"], [class*=\"empty-state\"]) :where(h1,h2,h3,strong) { color: #172033 !important; }\n.ag-recipe-chart, .ag-recipe-chart * { box-sizing: border-box; min-width: 0; }\n.ag-recipe-chart :where(.optimized-glass-surface) { width: 100%; max-width: 100%; overflow: hidden !important; }\n.ag-recipe-chart :where(.optimized-glass-surface > *) { max-width: 100%; }\n.ag-recipe-chart :where(canvas) { width: 100% !important; }\n.ag-recipe-calendar :where(header) { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }\n.ag-recipe-calendar :where([aria-label^=\"Select date\"]) {\n  box-sizing: border-box;\n  min-width: 0 !important;\n  min-height: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  border: 1px solid rgba(93,112,136,.2) !important;\n  border-radius: 12px !important;\n  color: #243149 !important;\n  transform: none !important;\n}\n.ag-recipe-calendar :where([aria-label^=\"Select date\"]:hover, [aria-label^=\"Select date\"]:focus-visible) {\n  transform: none !important;\n  background: rgba(255,255,255,.35) !important;\n}\n.ag-recipe-calendar :where(.glass-calendar-shell [aria-hidden=\"true\"]) {\n  color: #243149 !important;\n  text-shadow: none !important;\n}\n.ag-recipe-calendar :where(.glass-calendar-shell .glass-grid) { row-gap: 8px !important; }\n.ag-recipe-calendar :where(.glass-touch-target) { min-width: 0; }\n.ag-recipe-calendar :where(.overflow-hidden) { overflow: hidden !important; }\n.ag-media-review .glass-canvas-area { min-height: clamp(210px, 36vw, 360px); }\n.ag-media-player .ag-media-visualizer,\n.ag-media-review .ag-media-visualizer {\n  max-height: none !important;\n  overflow: visible !important;\n}\n.ag-collab-recipe .truncate,\n.ag-collab-recipe .glass-truncate {\n  white-space: normal !important;\n  overflow: visible !important;\n  text-overflow: clip !important;\n  overflow-wrap: anywhere;\n}\n.ag-creator-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }\n.ag-creator-grid > * { min-width: 0; }\n.ag-creator-studio .ag-media-visualizer { max-height: none !important; }\n.ag-creator-studio .glass-truncate { white-space: normal !important; overflow: visible !important; text-overflow: clip !important; overflow-wrap: anywhere; }\n@media (max-width: 640px) {\n  .ag-light-recipe { gap: 12px; }\n  .ag-creator-grid { grid-template-columns: minmax(0, 1fr); }\n  .ag-recipe-calendar :where(.glass-p-4) { padding: 10px; }\n  .ag-recipe-calendar :where(.glass-gap-2) { gap: 8px; }\n  .ag-recipe-calendar :where(.glass-aspect-square) { min-width: 0; }\n  .ag-recipe-calendar :where([aria-label^=\"Select date\"]) { min-width: 0 !important; min-height: 0 !important; }\n  .ag-recipe-calendar :where([aria-label^=\"Select date\"] .glass-touch-target) { min-width: 0 !important; min-height: 0 !important; }\n}\n";

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
