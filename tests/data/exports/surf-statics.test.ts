/** @jest-environment jsdom */
// SURF-141 — REQ-SURF-02: FilterBar statics (useModel/serialize/parse) exist
// and work without rendering.
import { describe, expect, it } from '@jest/globals';
import { FilterBar } from '../../../src/data/filter-bar/FilterBar';
import type { FilterField } from '../../../src/data/filter-bar/filter-model';

const FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'age', label: 'Age', type: 'number' },
];

describe('FilterBar statics (SURF-141, REQ-SURF-02/86)', () => {
  it('exposes useModel, serialize, parse', () => {
    expect(typeof FilterBar.useModel).toBe('function');
    expect(typeof FilterBar.serialize).toBe('function');
    expect(typeof FilterBar.parse).toBe('function');
  });
  it('serialize/parse round-trip a populated group', () => {
    const group = {
      kind: 'group' as const,
      id: 'g1',
      combinator: 'and' as const,
      children: [
        { kind: 'rule' as const, id: 'r1', fieldId: 'name', operator: 'contains' as const, value: 'ada' },
        { kind: 'rule' as const, id: 'r2', fieldId: 'age', operator: '>=' as const, value: 30 },
      ],
    };
    const params = FilterBar.serialize(group);
    const back = FilterBar.parse(FIELDS, params);
    expect(back.children.length).toBe(2);
  });
});
