import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Calendar',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: true,
  rsc: 'client',
  parts: ['calendar', 'calendar-header', 'calendar-grid', 'calendar-weekday', 'calendar-cell', 'calendar-weekno', 'calendar-nav'],
  states: ['selected', 'today', 'outside-month', 'unavailable', 'disabled'],
  variants: {},
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/',
  budgetKb: 4,
  migration: [
    { from: 'GlassCalendar', props: { onChange: 'onValueChange', weekNumbers: 'showWeekNumbers' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-calendar', to: '[data-ag-part="calendar"]' }],
});

export const RANGE_CALENDAR_META = {
  name: 'RangeCalendar',
  owner: 'SURF',
  entry: './date',
  tier: 'T2',
  flagship: false,
  rsc: 'client',
  parts: ['range-calendar', 'calendar-header', 'calendar-grid', 'calendar-cell'],
  states: ['selected', 'range-start', 'range-end', 'in-range'],
  budgetKb: 4,
  migration: [],
} as const;
