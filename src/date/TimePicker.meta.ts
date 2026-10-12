import { defineMeta } from '../foundation';

/* TimePicker only; TimeField has its own TimeField.meta.ts (S-31: one <Name>.meta.ts per component). */
export default defineMeta({
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
});
