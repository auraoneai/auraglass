/* REQ-SURF-84: FilterBar typed operator matrix — @ts-expect-error rows must
   NOT compile; positive rows must. Run with `tsc --noEmit` over this file. */
import { makeRule } from '../../../src/data/filter-bar/filter-model';
import type { FilterField } from '../../../src/data/filter-bar/filter-model';

const text = { id: 'name', label: 'Name', type: 'text' } as const;
const num = { id: 'qty', label: 'Qty', type: 'number' } as const;
const bool = { id: 'on', label: 'On', type: 'boolean' } as const;
const multi = { id: 'tag', label: 'Tag', type: 'enum', multi: true } as const;
const date = { id: 'd', label: 'D', type: 'date' } as const;

// @ts-expect-error 'between' is not a text operator
makeRule(text, 'between');

// @ts-expect-error 'contains' is not a number operator
makeRule(num, 'contains');

// @ts-expect-error 'is-not' is not a boolean operator (only 'is')
makeRule(bool, 'is-not');

// @ts-expect-error multi-enum keeps 'is'/'is-not' only — 'between' invalid
makeRule(multi, 'between');

// @ts-expect-error 'starts-with' is text-only, not date
makeRule(date, 'starts-with');

// positive rows — valid operator per field type
makeRule(text, 'contains');
makeRule(text, 'is-empty');
makeRule(num, 'between');
makeRule(num, '>=');
makeRule(bool, 'is');
makeRule(multi, 'is');
makeRule(multi, 'is-not');
makeRule(date, 'between');
makeRule(date, 'on');
