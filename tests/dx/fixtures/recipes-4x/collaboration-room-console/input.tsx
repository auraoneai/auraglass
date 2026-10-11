import 'aura-glass/styles';
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
      <style>{`
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
      `}</style>
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
