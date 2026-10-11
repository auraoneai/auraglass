// filter-serialize.ts (SURF-194, REQ-SURF-86): lossless URL round-trip.
// Encoding: g.c = root combinator; nested nodes use path indices
// (g.<i>.c for a group, g.<i>.{f,o,v} for a rule). `v` is the JSON encoding
// of the value, so its type is explicit (string vs number vs boolean vs
// string[] vs {start,end}) and separators inside values (',', '..', '&', '=')
// and unicode survive; URLSearchParams percent-encodes the JSON. Ids are
// opaque and regenerated on parse. Unknown field ids are ignored; invalid
// operators and values that do not fit the field type are dropped with a
// development warning.
import type { FilterField, FilterGroup, FilterNode, FilterRule, FilterValue } from './filter-model';
import { DEFAULT_OPERATORS, isValidRuleValue } from './filter-model';

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
        if (child.value !== undefined) params.set(`${cp}.v`, JSON.stringify(child.value));
      }
    });
  };
  walk(group, 'g');
  return params;
}

const devWarn = (msg: string) => {
  if (process.env['NODE_ENV'] === 'development') console.warn(`[auraglass] FilterBar.parse: ${msg}`);
};

/** Decodes `v`; returns a symbol when it is not JSON. */
const INVALID = Symbol('invalid');
function decodeValue(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return INVALID;
  }
}

export function parse(schema: readonly FilterField[], params: URLSearchParams): FilterGroup {
  let counter = 0;
  const nextId = (p: string) => `${p}-${++counter}`;
  const fieldById = new Map(schema.map((f) => [f.id, f]));

  const readGroup = (path: string): FilterGroup => {
    const combinator = params.get(`${path}.c`) === 'or' ? 'or' : 'and';
    const children: FilterNode[] = [];
    let i = 0;
    while (params.has(`${path}.${i}.c`) || params.has(`${path}.${i}.f`)) {
      const cp = `${path}.${i}`;
      i++;
      if (params.has(`${cp}.c`)) {
        children.push(readGroup(cp));
        continue;
      }
      const fieldId = params.get(`${cp}.f`)!;
      const field = fieldById.get(fieldId);
      if (field === undefined) continue; // unknown ids ignored
      const operator = params.get(`${cp}.o`) ?? '';
      if (!((field.operators ?? DEFAULT_OPERATORS[field.type]) as readonly string[]).includes(operator)) {
        devWarn(`dropping rule with invalid operator "${operator}" for "${fieldId}".`);
        continue;
      }
      const raw = params.get(`${cp}.v`);
      const value = raw === null ? undefined : decodeValue(raw);
      if (value === INVALID || !isValidRuleValue(field, operator, value)) {
        devWarn(`dropping rule with an invalid value for "${fieldId}" (${field.type} ${operator}).`);
        continue;
      }
      const rule: FilterRule = { kind: 'rule', id: nextId('r'), fieldId, operator: operator as FilterRule['operator'] };
      if (value !== undefined) rule.value = value as FilterValue;
      children.push(rule);
    }
    return { kind: 'group', id: nextId('g'), combinator, children };
  };
  return readGroup('g');
}
