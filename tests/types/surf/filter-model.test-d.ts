/* REQ-SURF-84: FilterBar typed operator matrix — @ts-expect-error rows must
   NOT compile; positive rows must. Checked by
   `tsc -p tests/types/surf/tsconfig.json` (surf:test:types). */
import { makeRule } from '../../../src/data/filter-bar/filter-model';
import type { FilterField, FilterRule } from '../../../src/data/filter-bar/filter-model';

const text = { id: 'name', label: 'Name', type: 'text' } as const;
const num = { id: 'qty', label: 'Qty', type: 'number' } as const;
const date = { id: 'd', label: 'D', type: 'date' } as const;
const range = { id: 'r', label: 'R', type: 'date-range' } as const;
const single = { id: 'status', label: 'Status', type: 'enum' } as const;
const multi = { id: 'tags', label: 'Tags', type: 'multi-enum' } as const;
const bool = { id: 'on', label: 'On', type: 'boolean' } as const;

// @ts-expect-error 'between' is not a text operator
makeRule(text, 'between');
// @ts-expect-error 'contains' is not a number operator
makeRule(num, 'contains');
// @ts-expect-error 'is-not' is not a boolean operator (only 'is')
makeRule(bool, 'is-not');
// @ts-expect-error multi-enum takes any-of / none-of — 'is' is single-enum only
makeRule(multi, 'is');
// @ts-expect-error 'starts-with' is text-only, not date
makeRule(date, 'starts-with');
// @ts-expect-error enum has no 'any-of'
makeRule(single, 'any-of');
// @ts-expect-error date-range has no 'on'
makeRule(range, 'on');
// @ts-expect-error not an operator of any type
makeRule(text, 'like');

// positive rows — every default operator of every type compiles
makeRule(text, 'contains');
makeRule(text, 'equals');
makeRule(text, 'starts-with');
makeRule(text, 'is-empty');
makeRule(num, '=');
makeRule(num, '!=');
makeRule(num, '<');
makeRule(num, '<=');
makeRule(num, '>');
makeRule(num, '>=');
makeRule(num, 'between');
makeRule(date, 'on');
makeRule(date, 'before');
makeRule(date, 'after');
makeRule(date, 'between');
makeRule(range, 'between');
makeRule(single, 'is');
makeRule(single, 'is-not');
makeRule(multi, 'any-of');
makeRule(multi, 'none-of');
makeRule(bool, 'is');

// FilterField keeps the literal type parameter
const typed: FilterField<'number'> = num;
// @ts-expect-error a number field is not a text field
const wrong: FilterField<'text'> = num;
// FilterRule<F> narrows operator to F's set
const r: FilterRule<typeof bool> = makeRule(bool, 'is');
// @ts-expect-error a boolean rule cannot carry 'contains'
const bad: FilterRule<typeof bool> = { kind: 'rule', id: 'x', fieldId: 'on', operator: 'contains' };
void [typed, wrong, r, bad];
