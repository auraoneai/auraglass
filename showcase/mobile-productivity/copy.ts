/* mobile-productivity copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59). */

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

export const COPY = {
  product: 'Daybook',
  skip: 'Skip to tasks',
  title: 'Today',
  searchLabel: 'Search tasks',
  searchPlaceholder: 'Search 42 tasks',
  quickAdd: 'New task',
  sheetTitle: 'New task',
  taskName: 'Task name',
  taskNameValue: 'Send revised SOW to Halcyon',
  estimate: 'Estimate (hours)',
  priority: 'Priority',
  remind: 'Remind me 30 minutes before',
  shareWithTeam: 'Visible to Studio team',
  save: 'Save task',
  saved: 'Task saved',
  savedBody: 'Added to Today at 14:00.',
  preferences: 'Display preferences',
  detailBack: 'Back to Today',
  tabs: { today: 'Today', upcoming: 'Upcoming', projects: 'Projects', settings: 'Settings' },
  nowPlaying: 'Focus timer · 18:40 left',
} as const;

export const TASKS = [
  { id: 't1', title: 'Review Halcyon design QA notes', project: 'Halcyon', due: '09:45', done: true },
  { id: 't2', title: 'Approve March payroll run', project: 'Operations', due: '10:30', done: false },
  { id: 't3', title: 'Prep agenda for client steering call', project: 'Northwind', due: '11:00', done: false },
  { id: 't4', title: 'Send revised SOW to Halcyon', project: 'Halcyon', due: '14:00', done: false },
  { id: 't5', title: 'Book flights for Lisbon offsite', project: 'Studio', due: '15:30', done: false },
  { id: 't6', title: 'Draft Q2 hiring plan', project: 'Studio', due: '17:00', done: false },
  { id: 't7', title: 'Reply to Northwind invoice query', project: 'Northwind', due: '17:30', done: false },
  { id: 't8', title: 'Renew studio insurance policy', project: 'Operations', due: '18:00', done: false },
  { id: 't9', title: 'Share sprint demo recording', project: 'Halcyon', due: '18:30', done: false },
] as const;

export const PRIORITIES = [
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
] as const;
