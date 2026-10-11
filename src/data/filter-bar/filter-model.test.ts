// SURF-195: model immutability + serialize/parse round-trip (frozen inputs).
import { describe, expect, it, jest } from '@jest/globals';
import { deepFreeze, emptyGroup, makeRule, type FilterField, type FilterGroup, type FilterNode, type FilterRule } from './filter-model';
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

  // REQ-SURF-85: deep-frozen 3-level tree; every action must not throw, must
  // keep untouched sibling subtrees (toBe) and renew only the changed path.
  describe('structural sharing on a deep-frozen 3-level tree', () => {
    const rule = (id: string, fieldId = 'name'): FilterRule =>
      ({ kind: 'rule', id, fieldId, operator: 'contains', value: id }) as FilterRule;
    const tree = (): FilterGroup =>
      deepFreeze<FilterGroup>({
        kind: 'group', id: 'root', combinator: 'and',
        children: [
          rule('r1'),
          {
            kind: 'group', id: 'gA', combinator: 'or',
            children: [
              rule('a1'),
              { kind: 'group', id: 'gA1', combinator: 'and', children: [rule('a1x'), rule('a1y')] },
            ],
          },
          {
            kind: 'group', id: 'gB', combinator: 'and',
            children: [rule('b1'), { kind: 'group', id: 'gB1', combinator: 'or', children: [rule('b1x')] }],
          },
        ],
      });
    const at = (g: FilterGroup, ...path: number[]) =>
      path.reduce<FilterNode>((n, i) => (n as FilterGroup).children[i]!, g);

    it.each([
      ['addRule into gA1', (m: Parameters<Parameters<typeof applyModel>[1]>[0]) => m.addRule(rule('new'), 'gA1')],
      ['updateRule a1x', (m: Parameters<Parameters<typeof applyModel>[1]>[0]) => m.updateRule('a1x', { value: 'changed' })],
      ['removeRule a1y', (m: Parameters<Parameters<typeof applyModel>[1]>[0]) => m.removeRule('a1y')],
      ['addGroup into gA1', (m: Parameters<Parameters<typeof applyModel>[1]>[0]) => m.addGroup(undefined, 'gA1')],
      ['setCombinator gA1', (m: Parameters<Parameters<typeof applyModel>[1]>[0]) => m.setCombinator('gA1', 'or')],
    ] as const)('%s: only root -> gA -> gA1 is new', (_name, action) => {
      const g0 = tree();
      let g1!: FilterGroup;
      expect(() => { g1 = applyModel(g0, action); }).not.toThrow();
      // changed path
      expect(g1).not.toBe(g0);
      expect(at(g1, 1)).not.toBe(at(g0, 1));
      expect(at(g1, 1, 1)).not.toBe(at(g0, 1, 1));
      // untouched siblings at every level
      expect(at(g1, 0)).toBe(at(g0, 0));
      expect(at(g1, 2)).toBe(at(g0, 2));
      expect(at(g1, 2, 1)).toBe(at(g0, 2, 1));
      expect(at(g1, 1, 0)).toBe(at(g0, 1, 0));
      // input unchanged
      expect(g0).toEqual(tree());
    });

    it('updateRule keeps the untouched sibling rule of the same group', () => {
      const g0 = tree();
      const g1 = applyModel(g0, (m) => m.updateRule('a1x', { value: 'changed' }));
      expect((at(g1, 1, 1, 0) as FilterRule).value).toBe('changed');
      expect(at(g1, 1, 1, 1)).toBe(at(g0, 1, 1, 1));
    });

    it('removeGroup gB1: only root -> gB is new', () => {
      const g0 = tree();
      const g1 = applyModel(g0, (m) => m.removeGroup('gB1'));
      expect(g1).not.toBe(g0);
      expect(at(g1, 2)).not.toBe(at(g0, 2));
      expect((at(g1, 2) as FilterGroup).children.map((c) => c.id)).toEqual(['b1']);
      expect(at(g1, 2, 0)).toBe(at(g0, 2, 0));
      expect(at(g1, 0)).toBe(at(g0, 0));
      expect(at(g1, 1)).toBe(at(g0, 1));
    });

    it('clear: new root with no children; the input subtree objects are untouched', () => {
      const g0 = tree();
      const g1 = applyModel(g0, (m) => m.clear());
      expect(g1).not.toBe(g0);
      expect(g1.children).toEqual([]);
      expect(g1.id).toBe('root');
      expect(g0.children.length).toBe(3);
    });

    it('addGroup() with no argument inserts an empty group', () => {
      const g1 = applyModel(tree(), (m) => m.addGroup());
      const added = g1.children[3] as FilterGroup;
      expect(added.kind).toBe('group');
      expect(added.children).toEqual([]);
    });

    it('an action that changes nothing returns the input tree itself', () => {
      const g0 = tree();
      expect(applyModel(g0, (m) => m.removeRule('missing'))).toBe(g0);
      expect(applyModel(g0, (m) => m.updateRule('missing', { value: 1 }))).toBe(g0);
    });
  });

  // REQ-SURF-84
  describe('operator matrix', () => {
    const bool = { id: 'on', label: 'On', type: 'boolean' } as const;
    const date = { id: 'd', label: 'D', type: 'date' } as const;

    it('boolean and date fields build rules with their operators', () => {
      expect(makeRule(bool, 'is', 'true')).toEqual(expect.objectContaining({ kind: 'rule', fieldId: 'on', operator: 'is', value: 'true' }));
      expect(makeRule(date, 'before', '2026-01-01')).toEqual(expect.objectContaining({ fieldId: 'd', operator: 'before' }));
      expect(makeRule(date, 'between', { start: '2026-01-01', end: '2026-02-01' }).value).toEqual({ start: '2026-01-01', end: '2026-02-01' });
    });

    it('makeRule dev-warns on an operator invalid for the field type, silent when valid', () => {
      const dev = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        makeRule(bool, 'is');
        makeRule(date, 'on');
        expect(warn).not.toHaveBeenCalled();
        makeRule(bool as FilterField, 'is-not' as never);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(String(warn.mock.calls[0]![0])).toContain('"is-not" is invalid for field "on" (boolean)');
        makeRule({ ...date, operators: ['on'] } as FilterField, 'before' as never);
        expect(warn).toHaveBeenCalledTimes(2);
      } finally {
        warn.mockRestore();
        process.env['NODE_ENV'] = dev;
      }
    });
  });
});
