// SURF-195: model immutability + serialize/parse round-trip (frozen inputs).
import { describe, expect, it, jest } from '@jest/globals';
import { deepFreeze, emptyGroup, makeRule, type FilterField, type FilterGroup, type FilterRule } from './filter-model';
import { parse, serialize } from './filter-serialize';
import { applyModel } from './filter-model-ops';

const SCHEMA: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'qty', label: 'Qty', type: 'number' },
  { id: 'status', label: 'Status', type: 'enum', options: [{ value: 'open', label: 'Open' }] },
  { id: 'tags', label: 'Tags', type: 'multi-enum' },
  { id: 'when', label: 'When', type: 'date-range' },
];

function frozenGroup(): FilterGroup {
  return deepFreeze(
    emptyGroup('and'),
  ) as FilterGroup;
}

describe('filter model (SURF-193/194, REQ-SURF-84..86)', () => {
  it('actions never mutate; only the touched path is new', () => {
    const g0 = frozenGroup();
    const r1 = makeRule(SCHEMA[0]!, 'contains', 'a');
    const g1 = applyModel(g0, (m) => m.addRule(r1));
    expect(Object.isFrozen(g0.children)).toBe(true);
    expect(g1.children.length).toBe(1);
    const g2 = applyModel(g1, (m) => m.addRule(makeRule(SCHEMA[1]!, '=', 3)));
    expect(g2.children[0]).toBe(g1.children[0]); // structural sharing
    expect(g2.children.length).toBe(2);
  });

  it('removeRule + setCombinator + clear', () => {
    const r = makeRule(SCHEMA[0]!, 'contains', 'x');
    const g = applyModel(emptyGroup(), (m) => m.addRule(r));
    const g2 = applyModel(g, (m) => m.removeRule(r.id));
    expect(g2.children.length).toBe(0);
    const g3 = applyModel(g, (m) => m.setCombinator(g.id, 'or'));
    expect(g3.combinator).toBe('or');
    const g4 = applyModel(g, (m) => m.clear());
    expect(g4.children.length).toBe(0);
  });

  it('serialize/parse round-trips all field types', () => {
    const g = emptyGroup('or');
    const rules: FilterRule[] = [
      makeRule(SCHEMA[0]!, 'contains', 'abc'),
      makeRule(SCHEMA[1]!, 'between'),
      makeRule(SCHEMA[2]!, 'is', 'open'),
      makeRule(SCHEMA[3]!, 'any-of', ['x', 'y']),
      { ...makeRule(SCHEMA[4]!, 'between'), value: { start: '2026-01-01', end: '2026-02-01' } },
    ];
    let cur = g;
    rules.forEach((r) => {
      cur = applyModel(cur, (m) => m.addRule(r));
    });
    const parsed = parse(SCHEMA, serialize(cur));
    expect(parsed.combinator).toBe('or');
    expect(parsed.children.length).toBe(5);
    const multi = parsed.children[3] as FilterRule;
    expect(multi.value).toEqual(['x', 'y']);
    const range = parsed.children[4] as FilterRule;
    expect(range.value).toEqual({ start: '2026-01-01', end: '2026-02-01' });
    // serialize(parse(serialize(x))) === serialize(x)
    expect(serialize(parsed).toString()).toBe(serialize(cur).toString());
  });

  it('parse drops unknown fields and invalid operators with a dev warning', () => {
    const dev = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const params = new URLSearchParams();
    params.set('g.c', 'and');
    params.set('g.0.f', 'unknown');
    params.set('g.0.o', 'is');
    params.set('g.1.f', 'name');
    params.set('g.1.o', 'between'); // invalid for text
    params.set('g.2.f', 'name');
    params.set('g.2.o', 'contains');
    params.set('g.2.v', 'kept');
    const g = parse(SCHEMA, params);
    expect(g.children.length).toBe(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    process.env['NODE_ENV'] = dev;
  });
});
