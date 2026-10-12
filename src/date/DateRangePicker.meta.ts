import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DateRangePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['date-range-picker', 'date-input-start', 'date-input-end', 'date-range-picker-trigger', 'date-range-picker-popover', 'positioner', 'date-range-presets', 'date-range-actions', 'date-range-apply', 'date-range-cancel', 'range-calendar', 'calendar-grid'],
  states: ['open', 'invalid', 'disabled'],
  variants: { visibleMonths: ['1', '2'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/',
  budgetKb: 8,
  migration: [
    { from: 'GlassDateRangePicker', props: {}, selectors: { '.glass-date-range-picker': '[data-ag-part="date-range-picker"]' }, automation: 'mostly', compat: true },
  ],
});
