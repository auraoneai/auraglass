import 'aura-glass/styles';
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
      <style>{`
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
      `}</style>
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
