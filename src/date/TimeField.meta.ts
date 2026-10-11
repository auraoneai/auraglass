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
  variants: { size: ['sm', 'md', 'lg'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  migration: [
    { from: 'GlassTimeField', props: { onChange: 'onValueChange' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-time-field', to: '[data-ag-part="time-field"]' }],
});
