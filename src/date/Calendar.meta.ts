import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Calendar',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['calendar', 'date-field', 'date-input', 'date-input-end', 'date-input-start', 'date-picker', 'date-picker-popover', 'date-picker-trigger', 'date-range-picker', 'date-range-picker-popover', 'date-range-picker-trigger', 'date-range-presets', 'range-calendar', 'time-field', 'time-input', 'time-picker', 'time-picker-hours', 'time-picker-minutes', 'time-picker-popover', 'time-picker-trigger'],
  states: ['selected', 'today', 'outside-month', 'unavailable', 'disabled'],
  variants: {},
  apg: 'date',
  budgetKb: 4,
  migration: [
    { from: 'GlassCalendar', props: { onChange: 'onValueChange', weekNumbers: 'showWeekNumbers' }, selectors: { '.glass-calendar': '[data-ag-part="calendar"]' }, automation: 'mostly', compat: true },
  ],
});
