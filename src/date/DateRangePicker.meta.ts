import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DateRangePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['date-range-picker', 'field-label', 'field-input', 'field-segment', 'picker-trigger', 'popover', 'calendar', 'preset'],
  states: ['open', 'invalid', 'disabled'],
  variants: { visibleMonths: ['1', '2'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/',
  budgetKb: 8,
  migration: [
    { from: 'GlassDateRangePicker', props: {}, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-date-range-picker', to: '[data-ag-part="date-range-picker"]' }],
});
