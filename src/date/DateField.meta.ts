import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DateField',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['calendar', 'date-field', 'date-input', 'date-input-end', 'date-input-start', 'date-picker', 'date-picker-popover', 'date-picker-trigger', 'date-range-picker', 'date-range-picker-popover', 'date-range-picker-trigger', 'date-range-presets', 'range-calendar', 'time-field', 'time-input', 'time-picker', 'time-picker-hours', 'time-picker-minutes', 'time-picker-popover', 'time-picker-trigger'],
  states: ['invalid', 'disabled', 'required', 'readonly'],
  variants: { size: ['sm', 'md', 'lg'] },
  apg: 'spinbutton',
  budgetKb: 4,
  migration: [
    { from: 'GlassDateField', props: { onChange: 'onValueChange', minDate: 'minValue', maxDate: 'maxValue' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-date-field', to: '[data-ag-part="date-field"]' }],
});
