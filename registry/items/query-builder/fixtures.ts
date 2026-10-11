/* query-builder fixtures — deterministic values only. */
import type { FilterField } from 'aura-glass/data';

export const FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'age', label: 'Age', type: 'number' },
  { id: 'country', label: 'Country', type: 'enum', options: [{ value: 'US', label: 'US' }, { value: 'DE', label: 'DE' }, { value: 'JP', label: 'JP' }] },
  { id: 'verified', label: 'Verified', type: 'boolean' },
];
