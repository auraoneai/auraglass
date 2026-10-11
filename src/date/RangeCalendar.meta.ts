import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'RangeCalendar',
  owner: 'SURF',
  entry: './date',
  tier: 'T2',
  flagship: 14,
  rsc: 'client',
  parts: ['range-calendar'],
  states: ['selected', 'range-start', 'range-end', 'in-range'],
  variants: {},
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/',
  migration: [],
});
