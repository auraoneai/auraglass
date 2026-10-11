// SURF-195: model immutability + serialize/parse round-trip (frozen inputs).
import { describe, expect, it, jest } from '@jest/globals';
import { DEFAULT_OPERATORS, deepFreeze, emptyGroup, makeRule, type FilterField, type FilterGroup, type FilterNode, type FilterRule, type FilterValue } from './filter-model';
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
    params.set('g.2.v', JSON.stringify('kept'));
    const g = parse(SCHEMA, params);
    expect(g.children.length).toBe(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    process.env['NODE_ENV'] = dev;
  });

  // REQ-SURF-86: 40 fixed cases — every field type x every default operator
  // (incl. between, is-empty and rules with no value yet), separator and
  // unicode values, nested and empty groups. Each case must survive a real
  // URL string round-trip: deep-equal modulo ids, and serialize(parse(s)) === s.
  describe('round-trip', () => {
    const RT_SCHEMA: FilterField[] = [
      { id: 't', label: 'Text', type: 'text' },
      { id: 'n', label: 'Num', type: 'number' },
      { id: 'd', label: 'Date', type: 'date' },
      { id: 'dr', label: 'Range', type: 'date-range' },
      { id: 'e', label: 'Enum', type: 'enum', options: [{ value: 'open', label: 'Open' }] },
      { id: 'm', label: 'Multi', type: 'multi-enum' },
      { id: 'b', label: 'Bool', type: 'boolean' },
    ];
    let seq = 0;
    const R = (fieldId: string, operator: string, value?: FilterValue): FilterRule =>
      ({ kind: 'rule', id: `x${++seq}`, fieldId, operator, ...(value !== undefined ? { value } : {}) }) as FilterRule;
    const G = (combinator: 'and' | 'or', ...children: FilterNode[]): FilterGroup =>
      ({ kind: 'group', id: `y${++seq}`, combinator, children });
    const one = (r: FilterRule) => G('and', r);

    const CASES: [string, FilterGroup][] = [
      // text (10)
      ['text contains', one(R('t', 'contains', 'abc'))],
      ['text contains comma', one(R('t', 'contains', 'a,b,c'))],
      ['text contains range separator', one(R('t', 'contains', 'x..y'))],
      ['text contains & and =', one(R('t', 'contains', 'a&b=c?d#e'))],
      ['text contains unicode', one(R('t', 'contains', 'naïve 日本語 🚀'))],
      ['text equals empty string', one(R('t', 'equals', ''))],
      ['text equals quotes and backslash', one(R('t', 'equals', '"q" \\ \'s\' {"a":1}'))],
      ['text starts-with', one(R('t', 'starts-with', 'pre'))],
      ['text is-empty (no value)', one(R('t', 'is-empty'))],
      ['text contains, value not set yet', one(R('t', 'contains'))],
      // number (9)
      ['number = 0', one(R('n', '=', 0))],
      ['number != negative decimal', one(R('n', '!=', -3.5))],
      ['number <', one(R('n', '<', 10))],
      ['number <= large', one(R('n', '<=', 1e21))],
      ['number >', one(R('n', '>', 100))],
      ['number >=', one(R('n', '>=', 2))],
      ['number between [1,2]', one(R('n', 'between', { start: 1, end: 2 }))],
      ['number between negative/zero', one(R('n', 'between', { start: -1.5, end: 0 }))],
      ['number =, value not set yet', one(R('n', '='))],
      // date (4)
      ['date on', one(R('d', 'on', '2026-01-01'))],
      ['date before', one(R('d', 'before', '2026-02-01'))],
      ['date after', one(R('d', 'after', '2026-03-01T10:00:00Z'))],
      ['date between', one(R('d', 'between', { start: '2026-01-01', end: '2026-12-31' }))],
      // date-range (3)
      ['date-range between', one(R('dr', 'between', { start: '2026-01-01', end: '2026-02-01' }))],
      ['date-range before', one(R('dr', 'before', '2026-01-01'))],
      ['date-range after', one(R('dr', 'after', '2026-06-30'))],
      // enum (2)
      ['enum is', one(R('e', 'is', 'open'))],
      ['enum is-not with comma', one(R('e', 'is-not', 'closed,won'))],
      // multi-enum (4)
      ['multi-enum any-of', one(R('m', 'any-of', ['x', 'y']))],
      ['multi-enum any-of with separators', one(R('m', 'any-of', ['a,b', 'c..d', '&', '']))],
      ['multi-enum none-of empty list', one(R('m', 'none-of', []))],
      ['multi-enum none-of unicode', one(R('m', 'none-of', ['日本', 'ü']))],
      // boolean (3)
      ['boolean is true', one(R('b', 'is', true))],
      ['boolean is false', one(R('b', 'is', false))],
      ['boolean is, value not set yet', one(R('b', 'is'))],
      // structure (5)
      ['empty root', G('and')],
      ['or root, mixed types', G('or', R('t', 'contains', 'a'), R('n', 'between', { start: 3, end: 9 }), R('b', 'is', false))],
      ['nested group', G('and', R('e', 'is', 'open'), G('or', R('m', 'any-of', ['p']), R('d', 'before', '2026-01-01')))],
      ['3 levels with an empty group', G('or', G('and', G('or'), R('t', 'equals', 'deep')), R('n', '>', 1))],
      ['sibling groups', G('and', G('or', R('t', 'is-empty')), G('and', R('dr', 'between', { start: '2026-01-01', end: '2026-01-02' })))],
    ];

    const stripIds = (n: FilterNode): unknown =>
      n.kind === 'group'
        ? { kind: 'group', combinator: n.combinator, children: n.children.map(stripIds) }
        : { kind: 'rule', fieldId: n.fieldId, operator: n.operator, ...(n.value !== undefined ? { value: n.value } : {}) };

    it('has exactly 40 cases covering every field type x every default operator', () => {
      expect(CASES).toHaveLength(40);
      const seen = new Set<string>();
      const walk = (n: FilterNode) => (n.kind === 'group' ? n.children.forEach(walk) : seen.add(`${n.fieldId}:${n.operator}`));
      CASES.forEach(([, g]) => walk(g));
      for (const f of RT_SCHEMA) {
        for (const op of DEFAULT_OPERATORS[f.type]) expect(seen).toContain(`${f.id}:${op}`);
      }
    });

    it.each(CASES)('round-trip: %s', (_name, tree) => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const s = serialize(tree).toString();
        const parsed = parse(RT_SCHEMA, new URLSearchParams(s));
        expect(stripIds(parsed)).toEqual(stripIds(tree));
        expect(serialize(parsed).toString()).toBe(s);
        expect(warn).not.toHaveBeenCalled();
      } finally {
        warn.mockRestore();
      }
    });

    it('number between [1,2] round-trips to {start:1,end:2} (numbers, not strings)', () => {
      const s = serialize(one(R('n', 'between', { start: 1, end: 2 }))).toString();
      const rule = parse(RT_SCHEMA, new URLSearchParams(s)).children[0] as FilterRule;
      expect(rule.value).toStrictEqual({ start: 1, end: 2 });
    });

    it('boolean values stay booleans', () => {
      const s = serialize(one(R('b', 'is', false))).toString();
      expect((parse(RT_SCHEMA, new URLSearchParams(s)).children[0] as FilterRule).value).toBe(false);
    });

    it('drops values that do not fit the field type, with a dev warning each', () => {
      const dev = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const p = new URLSearchParams();
        p.set('g.c', 'and');
        const bad: [string, string, string][] = [
          ['n', '=', '"5"'], // string for a number
          ['n', 'between', '"1..2"'], // legacy string range
          ['b', 'is', '"true"'], // string for a boolean
          ['m', 'any-of', '"x,y"'], // string for a list
          ['d', 'between', '{"start":1,"end":2}'], // numbers for a date range
          ['t', 'contains', 'not-json'],
          ['t', 'is-empty', '"x"'], // valueless operator with a value
        ];
        bad.forEach(([f, o, v], i) => {
          p.set(`g.${i}.f`, f);
          p.set(`g.${i}.o`, o);
          p.set(`g.${i}.v`, v);
        });
        p.set(`g.${bad.length}.f`, 'n');
        p.set(`g.${bad.length}.o`, '>');
        p.set(`g.${bad.length}.v`, '7');
        const g = parse(RT_SCHEMA, p);
        expect(g.children.map(stripIds)).toEqual([{ kind: 'rule', fieldId: 'n', operator: '>', value: 7 }]);
        expect(warn).toHaveBeenCalledTimes(bad.length);
      } finally {
        warn.mockRestore();
        process.env['NODE_ENV'] = dev;
      }
    });
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
