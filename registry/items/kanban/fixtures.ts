// fixtures.ts — deterministic kanban data (contract §3.3).
import type { KanbanBoardProps } from './index';

export const kanbanColumns: KanbanBoardProps['columns'] = [
  {
    id: 'todo', title: 'To do',
    cards: [
      { id: 't-1', title: 'Draft onboarding copy', labels: ['docs'], points: 2 },
      { id: 't-2', title: 'Token audit for charts', labels: ['design'], points: 3 },
    ],
  },
  {
    id: 'doing', title: 'Doing',
    cards: [
      { id: 't-3', title: 'Settings block certification', labels: ['registry'], points: 5 },
    ],
  },
  {
    id: 'done', title: 'Done',
    cards: [
      { id: 't-4', title: 'Auth block flows', labels: ['registry'], points: 3 },
      { id: 't-5', title: 'Schema validation', labels: ['build'], points: 1 },
    ],
  },
];

export const kanbanProps: KanbanBoardProps = { columns: kanbanColumns };
