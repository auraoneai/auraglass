import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'RangeCalendar',
  owner: 'SURF',
  entry: './date',
  tier: 'T1',
  rsc: 'client',
  parts: ['range-calendar'],
  states: ['selected', 'range-start', 'range-end', 'in-range', 'today', 'outside-month', 'unavailable', 'disabled'],
  apg: 'date',
  variants: {},
  migration: [
    { from: 'GlassDateRangeCalendar', props: {}, automation: 'mostly', compat: true },
  ],
});
