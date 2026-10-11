import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DateRangePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['date-range-picker', 'date-input-start', 'date-input-end', 'date-range-picker-trigger', 'date-range-picker-popover', 'date-range-presets', 'range-calendar'],
  states: ['open', 'invalid', 'disabled'],
  variants: { visibleMonths: ['1', '2'] },
  apg: 'date',
  budgetKb: 8,
  migration: [
    { from: 'GlassDateRangePicker', props: {}, selectors: { '.glass-date-range-picker': '[data-ag-part="date-range-picker"]' }, automation: 'mostly', compat: true },
  ],
});
