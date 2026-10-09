import 'aura-glass/styles';
import { GlassBadge, GlassButton, GlassCard, GlassErrorState, GlassMetricChip, GlassNotificationCenter } from 'aura-glass';
import { GlassPage, GlassPageHeader } from 'aura-glass/app-shell';
import { SearchIcon } from 'aura-glass/icons/data';
import { AlertCircleIcon, SuccessIcon } from 'aura-glass/icons/status';

export function SupportTriageWorkspace() {
  return (
    <GlassPage className="recipe-polish">
      <style>{`
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
`}</style>
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
