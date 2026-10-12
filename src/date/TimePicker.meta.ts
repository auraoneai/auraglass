import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'TimeField',
  owner: 'SURF',
  entry: './date',
  tier: 'T2',
  flagship: 14,
  rsc: 'client',
  parts: ['time-field', 'time-input'],
  states: ['invalid', 'disabled', 'required', 'readonly'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  variants: { size: ['sm', 'md', 'lg'] },
  budgetKb: 6,
  migration: [
    { from: 'GlassTimeField', props: { onChange: 'onValueChange' }, selectors: { '.glass-time-field': '[data-ag-part="time-field"]' }, automation: 'mostly', compat: true },
  ],
});

export const TIME_PICKER_META = {
  name: 'TimePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T2',
  flagship: 14,
  rsc: 'client',
  parts: ['time-picker', 'time-input', 'time-picker-trigger', 'time-picker-popover', 'positioner', 'time-picker-hours', 'time-picker-minutes'],
  states: ['open', 'invalid', 'disabled'],
  variants: {},
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  budgetKb: 10,
  migration: [{ from: 'GlassTimePicker', props: {}, automation: 'manual', compat: false }],
} as const;
