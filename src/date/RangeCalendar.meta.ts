import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'RangeCalendar',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  rsc: 'client',
  parts: ['calendar', 'calendar-cell', 'calendar-grid', 'calendar-header', 'calendar-nav', 'calendar-weekday', 'date-field', 'date-input', 'date-input-end', 'date-input-start', 'date-picker', 'date-picker-popover', 'date-picker-trigger', 'date-range-picker', 'date-range-picker-popover', 'date-range-picker-trigger', 'date-range-presets', 'range-calendar', 'time-field', 'time-input', 'time-picker', 'time-picker-hours', 'time-picker-minutes', 'time-picker-popover', 'time-picker-trigger'],
  states: ['selected', 'range-start', 'range-end', 'in-range', 'today', 'outside-month', 'unavailable', 'disabled'],
  apg: 'date',
  variants: {},
  migration: [
    { from: 'GlassDateRangeCalendar', props: {}, automation: 'mostly', compat: true },
  ],
});
