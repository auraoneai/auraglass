import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'TimeField',
  owner: 'SURF',
  entry: './date',
  tier: 'T2',
  flagship: 14,
  rsc: 'client',
  parts: ['calendar', 'date-field', 'date-input', 'date-input-end', 'date-input-start', 'date-picker', 'date-picker-popover', 'date-picker-trigger', 'date-range-picker', 'date-range-picker-popover', 'date-range-picker-trigger', 'date-range-presets', 'range-calendar', 'time-field', 'time-input', 'time-picker', 'time-picker-hours', 'time-picker-minutes', 'time-picker-popover', 'time-picker-trigger'],
  states: ['invalid', 'disabled', 'required', 'readonly'],
  apg: 'spinbutton',
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
  parts: ['calendar', 'date-field', 'date-input', 'date-input-end', 'date-input-start', 'date-picker', 'date-picker-popover', 'date-picker-trigger', 'date-range-picker', 'date-range-picker-popover', 'date-range-picker-trigger', 'date-range-presets', 'range-calendar', 'time-field', 'time-input', 'time-picker', 'time-picker-hours', 'time-picker-minutes', 'time-picker-popover', 'time-picker-trigger'],
  states: ['open', 'invalid', 'disabled'],
  variants: {},
  budgetKb: 6,
  migration: [{ from: 'GlassTimePicker', props: {}, automation: 'manual', compat: false }],
} as const;
