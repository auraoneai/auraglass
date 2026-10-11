import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DatePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['calendar', 'date-field', 'date-input', 'date-input-end', 'date-input-start', 'date-picker', 'date-picker-popover', 'date-picker-trigger', 'date-range-picker', 'date-range-picker-popover', 'date-range-picker-trigger', 'date-range-presets', 'range-calendar', 'time-field', 'time-input', 'time-picker', 'time-picker-hours', 'time-picker-minutes', 'time-picker-popover', 'time-picker-trigger'],
  states: ['open', 'invalid', 'disabled', 'required', 'readonly'],
  variants: { size: ['sm', 'md', 'lg'] },
  apg: 'date',
  budgetKb: 8,
  migration: [
    { from: 'GlassDatePicker', props: { onChange: 'onValueChange', minDate: 'minValue', maxDate: 'maxValue', disabledDates: 'isDateUnavailable', disabled: 'isDisabled', required: 'isRequired', error: 'isInvalid', helperText: 'description', format: null, mode: null }, selectors: { '.glass-date-picker': '[data-ag-part="date-picker"]' }, automation: 'mostly', compat: true },
  ],
});
