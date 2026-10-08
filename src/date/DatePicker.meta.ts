import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DatePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['date-picker', 'field-label', 'field-input', 'field-segment', 'picker-trigger', 'popover', 'calendar'],
  states: ['open', 'invalid', 'disabled', 'required', 'readonly'],
  variants: { size: ['sm', 'md', 'lg'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/',
  budgetKb: 8,
  migration: [
    { from: 'GlassDatePicker', props: { onChange: 'onValueChange', minDate: 'minValue', maxDate: 'maxValue', disabledDates: 'isDateUnavailable', disabled: 'isDisabled', required: 'isRequired', error: 'isInvalid', helperText: 'description', format: null, mode: null }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-date-picker', to: '[data-ag-part="date-picker"]' }],
});
