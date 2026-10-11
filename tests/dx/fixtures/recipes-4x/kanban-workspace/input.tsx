import 'aura-glass/styles';
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
