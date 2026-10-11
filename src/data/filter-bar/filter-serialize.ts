// filter-serialize.ts (SURF-194, REQ-SURF-86): URL round-trip.
// Encoding: g.<n>.c = combinator; r.<n>.{f,o,v} = rule fields; nested groups
// flatten via path indices — ids are regenerated on parse (ids are opaque).
import type { FilterField, FilterGroup, FilterNode, FilterRule } from './filter-model';
import { DEFAULT_OPERATORS } from './filter-model';

export function serialize(group: FilterGroup): URLSearchParams {
  const params = new URLSearchParams();
  const walk = (g: FilterGroup, path: string) => {
    params.set(`${path}.c`, g.combinator);
    g.children.forEach((child, i) => {
      const cp = `${path}.${i}`;
      if (child.kind === 'group') walk(child, cp);
      else {
        params.set(`${cp}.f`, child.fieldId);
        params.set(`${cp}.o`, child.operator as string);
        if (child.value !== undefined) {
          params.set(`${cp}.v`, typeof child.value === 'object' && !Array.isArray(child.value)
            ? `${(child.value as { start: string }).start}..${(child.value as { end: string }).end}`
            : Array.isArray(child.value)
              ? child.value.join(',')
              : String(child.value));
        }
      }
    });
  };
  walk(group, 'g');
  return params;
}

export function parse(schema: readonly FilterField[], params: URLSearchParams): FilterGroup {
  let counter = 0;
  const nextId = (p: string) => `${p}-${++counter}`;
  const fieldById = new Map(schema.map((f) => [f.id, f]));

  const readGroup = (path: string): FilterGroup => {
    const combinator = (params.get(`${path}.c`) ?? 'and') as 'and' | 'or';
    const children: FilterNode[] = [];
    let i = 0;
    while (params.has(`${path}.${i}.c`) || params.has(`${path}.${i}.f`)) {
      const cp = `${path}.${i}`;
      if (params.has(`${cp}.c`)) {
        children.push(readGroup(cp));
      } else {
        const fieldId = params.get(`${cp}.f`)!;
        const field = fieldById.get(fieldId);
        const operator = params.get(`${cp}.o`) ?? '';
        if (field === undefined) {
          // unknown ids ignored
        } else if (!((field.operators ?? DEFAULT_OPERATORS[field.type]) as readonly string[]).includes(operator)) {
          if (process.env['NODE_ENV'] === 'development') {
            console.warn(`[auraglass] FilterBar.parse: dropping rule with invalid operator "${operator}" for "${fieldId}".`);
          }
        } else {
          const raw = params.get(`${cp}.v`);
          const rule: FilterRule = { kind: 'rule', id: nextId('r'), fieldId, operator: operator as FilterRule['operator'] };
          if (raw !== null) {
            if (field.type === 'multi-enum') rule.value = raw.split(',');
            else if (field.type === 'number') rule.value = Number(raw);
            else if (field.type === 'date-range') {
              const [start = '', end = ''] = raw.split('..');
              rule.value = { start, end };
            } else rule.value = raw;
          }
          children.push(rule);
        }
      }
      i++;
    }
    return { kind: 'group', id: nextId('g'), combinator: combinator === 'or' ? 'or' : 'and', children };
  };
  return readGroup('g');
}
