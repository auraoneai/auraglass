import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'TimePicker',
  owner: 'SURF',
  entry: './date',
  tier: 'T2',
  flagship: 14,
  rsc: 'client',
  parts: ['time-input', 'time-picker', 'time-picker-hours', 'time-picker-minutes', 'time-picker-popover', 'time-picker-trigger'],
  states: ['open', 'invalid', 'disabled'],
  variants: { size: ['sm', 'md', 'lg'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  budgetKb: 6,
  migration: [{ from: 'GlassTimePicker', props: {}, automation: 'manual', compat: false }],
});
