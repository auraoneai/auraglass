// TODO(aura-glass 5): removed in 5.0 (registry item 'kanban'), see docs/auraglass-5/migration/kanban.md
// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassKanbanBoard } from 'aura-glass';

export const Board = ({ columns }) => <GlassKanbanBoard columns={columns} />;
