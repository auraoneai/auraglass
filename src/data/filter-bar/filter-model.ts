// filter-model.ts (SURF-193, REQ-SURF-84/85): immutable filter tree.
// FilterRule<F> is generic so an invalid operator for the field type is a
// compile error; useModel actions return new trees with structural sharing.

export type FilterFieldType = 'text' | 'number' | 'date' | 'date-range' | 'enum' | 'multi-enum' | 'boolean';

/** REQ-SURF-84: the type parameter keeps the literal field type, so a
    schema declared `as const` narrows each field's operator set. */
export interface FilterField<T extends FilterFieldType = FilterFieldType> {
  id: string;
  label: string;
  type: T;
  options?: readonly { value: string; label: string }[] | undefined;
  operators?: readonly string[] | undefined;
}

export const DEFAULT_OPERATORS: Record<FilterFieldType, readonly string[]> = {
  text: ['contains', 'equals', 'starts-with', 'is-empty'],
  number: ['=', '!=', '<', '<=', '>', '>=', 'between'],
  date: ['on', 'before', 'after', 'between'],
  'date-range': ['between', 'before', 'after'],
  enum: ['is', 'is-not'],
  'multi-enum': ['any-of', 'none-of'],
  boolean: ['is'],
};

/** Operators valid for a field type (REQ-SURF-84 matrix). */
export type Ops<T extends FilterFieldType> = T extends 'text'
  ? 'contains' | 'equals' | 'starts-with' | 'is-empty'
  : T extends 'number'
    ? '=' | '!=' | '<' | '<=' | '>' | '>=' | 'between'
    : T extends 'date'
      ? 'on' | 'before' | 'after' | 'between'
      : T extends 'date-range'
        ? 'between' | 'before' | 'after'
        : T extends 'enum'
          ? 'is' | 'is-not'
          : T extends 'multi-enum'
            ? 'any-of' | 'none-of'
            : 'is';

/** An inclusive range: number fields use numbers, date fields ISO strings. */
export interface FilterRange<T extends string | number = string | number> {
  start: T;
  end: T;
}

/** REQ-SURF-86: every value shape a rule can carry. 'between' on number is
    a numeric range, on date/date-range a string range; boolean is a real
    boolean (never the string 'true'). */
export type FilterValue = string | number | boolean | readonly string[] | FilterRange<string> | FilterRange<number>;

export interface FilterRule<F extends FilterField = FilterField> {
  kind: 'rule';
  id: string;
  fieldId: string;
  operator: Ops<F['type']>;
  value?: FilterValue | undefined;
}

/** Operators that take no value. */
export const VALUELESS_OPERATORS: readonly string[] = ['is-empty'];

const isRange = (v: unknown, t: 'string' | 'number'): boolean =>
  v !== null &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  Object.keys(v).length === 2 &&
  typeof (v as FilterRange).start === t &&
  typeof (v as FilterRange).end === t &&
  (t === 'string' || (Number.isFinite((v as FilterRange).start) && Number.isFinite((v as FilterRange).end)));

/** REQ-SURF-86: is `value` a legal value for `field` under `operator`?
    `undefined` (no value yet) is always legal; valueless operators accept
    nothing else. Used by parse to reject tampered or mistyped URLs. */
export function isValidRuleValue(field: FilterField, operator: string, value: unknown): boolean {
  if (value === undefined) return true;
  if (VALUELESS_OPERATORS.includes(operator)) return false;
  switch (field.type) {
    case 'text':
    case 'enum':
      return typeof value === 'string';
    case 'number':
      return operator === 'between' ? isRange(value, 'number') : typeof value === 'number' && Number.isFinite(value);
    case 'date':
    case 'date-range':
      return operator === 'between' ? isRange(value, 'string') : typeof value === 'string';
    case 'multi-enum':
      return Array.isArray(value) && value.every((x) => typeof x === 'string');
    case 'boolean':
      return typeof value === 'boolean';
    default:
      return false;
  }
}

export interface FilterGroup {
  kind: 'group';
  id: string;
  combinator: 'and' | 'or';
  children: readonly (FilterRule | FilterGroup)[];
}

export type FilterNode = FilterRule | FilterGroup;

let counter = 0;
const nextId = (p: string) => `${p}-${++counter}`;

export function isGroup(n: FilterNode): n is FilterGroup {
  return n.kind === 'group';
}

export function emptyGroup(combinator: 'and' | 'or' = 'and'): FilterGroup {
  return { kind: 'group', id: nextId('g'), combinator, children: [] };
}

export function makeRule<F extends FilterField>(field: F, operator: Ops<F['type']>, value?: FilterRule['value']): FilterRule<F> {
  if (process.env['NODE_ENV'] === 'development') {
    const allowed = field.operators ?? DEFAULT_OPERATORS[field.type];
    if (!(allowed as readonly string[]).includes(operator as string)) {
      console.warn(`[auraglass] FilterBar: operator "${String(operator)}" is invalid for field "${field.id}" (${field.type}).`);
    }
  }
  return { kind: 'rule', id: nextId('r'), fieldId: field.id, operator, ...(value !== undefined ? { value } : {}) };
}

// Structural-sharing updates: only the path to the edited node is new.
function mapGroup(group: FilterGroup, path: string[], fn: (g: FilterGroup) => FilterGroup): FilterGroup {
  if (path.length === 0) return fn(group);
  const [head, ...rest] = path;
  return {
    ...group,
    children: group.children.map((c) =>
      c.id === head && isGroup(c) ? mapGroup(c, rest, fn) : c,
    ),
  };
}

export interface FilterModel {
  value: FilterGroup;
  addRule: (rule: FilterRule, groupId?: string) => void;
  updateRule: (ruleId: string, patch: Partial<Omit<FilterRule, 'id' | 'kind'>>) => void;
  removeRule: (ruleId: string) => void;
  addGroup: (group?: FilterGroup, parentId?: string) => void;
  removeGroup: (groupId: string) => void;
  setCombinator: (groupId: string, combinator: 'and' | 'or') => void;
  clear: () => void;
}

/** Test/dev helper: recursively freeze a tree. */
export function deepFreeze<T>(o: T): T {
  if (o !== null && typeof o === 'object') {
    Object.values(o).forEach((v) => deepFreeze(v));
    Object.freeze(o);
  }
  return o;
}
