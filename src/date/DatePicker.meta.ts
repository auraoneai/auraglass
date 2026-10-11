import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DatePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['date-picker', 'date-input', 'date-picker-trigger', 'date-picker-popover', 'calendar'],
  states: ['open', 'invalid', 'disabled', 'required', 'readonly'],
  variants: { size: ['sm', 'md', 'lg'] },
  apg: 'date',
  budgetKb: 8,
  migration: [
    { from: 'GlassDatePicker', props: { onChange: 'onValueChange', minDate: 'minValue', maxDate: 'maxValue', disabledDates: 'isDateUnavailable', disabled: 'isDisabled', required: 'isRequired', error: 'isInvalid', helperText: 'description', format: null, mode: null }, selectors: { '.glass-date-picker': '[data-ag-part="date-picker"]' }, automation: 'mostly', compat: true },
  ],
});
