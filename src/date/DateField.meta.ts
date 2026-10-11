import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DateField',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['date-field', 'date-input'],
  states: ['invalid', 'disabled', 'required', 'readonly'],
  variants: { size: ['sm', 'md', 'lg'] },
  apg: 'spinbutton',
  budgetKb: 4,
  migration: [
    { from: 'GlassDateField', props: { onChange: 'onValueChange', minDate: 'minValue', maxDate: 'maxValue' }, selectors: { '.glass-date-field': '[data-ag-part="date-field"]' }, automation: 'mostly', compat: true },
  ],
});
