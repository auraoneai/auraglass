import 'aura-glass/styles';
const lightRecipeCss = "\n.ag-light-recipe {\n  --glass-theme-text: #172033;\n  --glass-text-primary: #172033;\n  --typography-text-primary: #172033;\n  --aura-color-global-text-primary: #172033;\n  --aura-color-global-text-secondary: #4b5a70;\n  color: #172033;\n  display: grid;\n  gap: 16px;\n  min-width: 0;\n}\n.ag-light-recipe :where(h1, h2, h3, h4, p, span, label) { color: inherit; }\n.ag-light-recipe :where(.optimized-glass-surface, .glass-workspace-panel, .glass-action-bar, .glass-canvas-area, .glass-timeline-rail, .glass-command-dock, .glass-music-visualizer) {\n  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.18)) !important;\n  border-color: rgba(255,255,255,.92) !important;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 12px rgba(255,255,255,.12), 0 14px 36px rgba(86,107,135,.14) !important;\n  color: #172033 !important;\n}\n.ag-light-recipe :where(.optimized-glass-surface, .glass-music-visualizer) { max-width: 100%; min-width: 0; }\n.ag-light-recipe :where(.glass-music-visualizer) { overflow: hidden !important; }\n.ag-light-recipe :where(.glass-music-visualizer canvas) {\n  background: linear-gradient(145deg, rgba(255,255,255,.32), rgba(255,255,255,.16)) !important;\n  border-color: rgba(109,132,160,.22) !important;\n  max-width: 100%;\n}\n.ag-light-recipe :where(.liquid-glass-media-controls) {\n  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.18)) !important;\n  border: 1px solid rgba(255,255,255,.94) !important;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 12px rgba(255,255,255,.12), 0 12px 30px rgba(86,107,135,.14) !important;\n  color: #172033 !important;\n  max-width: 100%;\n}\n.ag-light-recipe :where(.liquid-glass-media-controls span) { color: #334155 !important; text-shadow: none !important; }\n.ag-light-recipe :where(input[type=\"range\"]) { height: 12px !important; min-height: 12px; }\n.ag-light-recipe :where(canvas, svg) { max-width: 100%; }\n.ag-light-recipe :where([class*=\"emptyState\"], [class*=\"empty-state\"]) {\n  background: linear-gradient(145deg, rgba(255,255,255,.35), rgba(255,255,255,.2)) !important;\n  color: #172033 !important;\n}\n.ag-light-recipe :where([class*=\"emptyState\"], [class*=\"empty-state\"]) * { color: #4b5a70 !important; }\n.ag-light-recipe :where([class*=\"emptyState\"], [class*=\"empty-state\"]) :where(h1,h2,h3,strong) { color: #172033 !important; }\n.ag-recipe-chart, .ag-recipe-chart * { box-sizing: border-box; min-width: 0; }\n.ag-recipe-chart :where(.optimized-glass-surface) { width: 100%; max-width: 100%; overflow: hidden !important; }\n.ag-recipe-chart :where(.optimized-glass-surface > *) { max-width: 100%; }\n.ag-recipe-chart :where(canvas) { width: 100% !important; }\n.ag-recipe-calendar :where(header) { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }\n.ag-recipe-calendar :where([aria-label^=\"Select date\"]) {\n  box-sizing: border-box;\n  min-width: 0 !important;\n  min-height: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  border: 1px solid rgba(93,112,136,.2) !important;\n  border-radius: 12px !important;\n  color: #243149 !important;\n  transform: none !important;\n}\n.ag-recipe-calendar :where([aria-label^=\"Select date\"]:hover, [aria-label^=\"Select date\"]:focus-visible) {\n  transform: none !important;\n  background: rgba(255,255,255,.35) !important;\n}\n.ag-recipe-calendar :where(.glass-calendar-shell [aria-hidden=\"true\"]) {\n  color: #243149 !important;\n  text-shadow: none !important;\n}\n.ag-recipe-calendar :where(.glass-calendar-shell .glass-grid) { row-gap: 8px !important; }\n.ag-recipe-calendar :where(.glass-touch-target) { min-width: 0; }\n.ag-recipe-calendar :where(.overflow-hidden) { overflow: hidden !important; }\n.ag-media-review .glass-canvas-area { min-height: clamp(210px, 36vw, 360px); }\n.ag-media-player .ag-media-visualizer,\n.ag-media-review .ag-media-visualizer {\n  max-height: none !important;\n  overflow: visible !important;\n}\n.ag-collab-recipe .truncate,\n.ag-collab-recipe .glass-truncate {\n  white-space: normal !important;\n  overflow: visible !important;\n  text-overflow: clip !important;\n  overflow-wrap: anywhere;\n}\n.ag-creator-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }\n.ag-creator-grid > * { min-width: 0; }\n.ag-creator-studio .ag-media-visualizer { max-height: none !important; }\n.ag-creator-studio .glass-truncate { white-space: normal !important; overflow: visible !important; text-overflow: clip !important; overflow-wrap: anywhere; }\n@media (max-width: 640px) {\n  .ag-light-recipe { gap: 12px; }\n  .ag-creator-grid { grid-template-columns: minmax(0, 1fr); }\n  .ag-recipe-calendar :where(.glass-p-4) { padding: 10px; }\n  .ag-recipe-calendar :where(.glass-gap-2) { gap: 8px; }\n  .ag-recipe-calendar :where(.glass-aspect-square) { min-width: 0; }\n  .ag-recipe-calendar :where([aria-label^=\"Select date\"]) { min-width: 0 !important; min-height: 0 !important; }\n  .ag-recipe-calendar :where([aria-label^=\"Select date\"] .glass-touch-target) { min-width: 0 !important; min-height: 0 !important; }\n}\n";
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
