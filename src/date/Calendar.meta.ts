import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Calendar',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['calendar'],
  states: ['selected', 'today', 'outside-month', 'unavailable', 'disabled'],
  variants: {},
  apg: 'date',
  budgetKb: 4,
  migration: [
    { from: 'GlassCalendar', props: { onChange: 'onValueChange', weekNumbers: 'showWeekNumbers' }, selectors: { '.glass-calendar': '[data-ag-part="calendar"]' }, automation: 'mostly', compat: true },
  ],
});
