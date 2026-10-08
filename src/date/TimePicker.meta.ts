import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'TimeField',
  owner: 'SURF',
  entry: './date',
  tier: 'T2',
  flagship: false,
  rsc: 'client',
  parts: ['time-field', 'field-label', 'field-input', 'field-segment'],
  states: ['invalid', 'disabled', 'required', 'readonly'],
  variants: { size: ['sm', 'md', 'lg'] },
  budgetKb: 4,
  migration: [
    { from: 'GlassTimeField', props: { onChange: 'onValueChange' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-time-field', to: '[data-ag-part="time-field"]' }],
});

export const TIME_PICKER_META = {
  name: 'TimePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T2',
  flagship: true,
  rsc: 'client',
  parts: ['time-picker', 'field-label', 'field-input', 'field-segment', 'popover', 'listbox', 'option'],
  states: ['open', 'invalid', 'disabled'],
  budgetKb: 6,
  migration: [{ from: 'GlassTimePicker', props: {}, automation: 'manual', compat: false }],
} as const;
