// fixtures.ts — deterministic gantt rows (contract §3.3).
import type { GanttChartProps } from './index';

export const ganttTasks: GanttChartProps['tasks'] = [
  { id: 'g-1', title: 'Registry schema', start: '2026-10-01', end: '2026-10-03', progress: 1, owner: 'PLAT' },
  { id: 'g-2', title: 'Blocks wave', start: '2026-10-03', end: '2026-10-08', progress: 0.6, owner: 'PLAT' },
  { id: 'g-3', title: 'Docs site shell', start: '2026-10-05', end: '2026-10-12', progress: 0.3, owner: 'PLAT' },
  { id: 'g-4', title: 'Render gate', start: '2026-10-10', end: '2026-10-15', progress: 0, owner: 'QUAL' },
];

export const ganttProps: GanttChartProps = {
  tasks: ganttTasks,
  rangeStart: '2026-10-01',
  rangeEnd: '2026-10-15',
};
