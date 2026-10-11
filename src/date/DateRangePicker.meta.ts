import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DateRangePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['calendar', 'date-field', 'date-input', 'date-input-end', 'date-input-start', 'date-picker', 'date-picker-popover', 'date-picker-trigger', 'date-range-picker', 'date-range-picker-popover', 'date-range-picker-trigger', 'date-range-presets', 'range-calendar', 'time-field', 'time-input', 'time-picker', 'time-picker-hours', 'time-picker-minutes', 'time-picker-popover', 'time-picker-trigger'],
  states: ['open', 'invalid', 'disabled'],
  variants: { visibleMonths: ['1', '2'] },
  apg: 'date',
  budgetKb: 8,
  migration: [
    { from: 'GlassDateRangePicker', props: {}, selectors: { '.glass-date-range-picker': '[data-ag-part="date-range-picker"]' }, automation: 'mostly', compat: true },
  ],
});
