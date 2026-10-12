import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'RangeCalendar',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  rsc: 'client',
  parts: ['range-calendar', 'calendar-grid'],
  states: ['selected', 'range-start', 'range-end', 'in-range', 'today', 'outside-month', 'unavailable', 'disabled'],
  material: { layer: 'content', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/',
  variants: {},
  budgetKb: 4,
  migration: [
    { from: 'GlassDateRangeCalendar', props: {}, automation: 'mostly', compat: true },
  ],
});
