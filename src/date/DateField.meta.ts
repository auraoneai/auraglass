import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'DateField',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  flagship: 14,
  rsc: 'client',
  parts: ['date-field', 'field-label', 'field-input', 'field-segment', 'field-description', 'field-error'],
  states: ['invalid', 'disabled', 'required', 'readonly'],
  variants: { size: ['sm', 'md', 'lg'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  budgetKb: 4,
  migration: [
    { from: 'GlassDateField', props: { onChange: 'onValueChange', minDate: 'minValue', maxDate: 'maxValue' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-date-field', to: '[data-ag-part="date-field"]' }],
});
