// filter-model.ts (SURF-193, REQ-SURF-84/85): immutable filter tree.
// FilterRule<F> is generic so an invalid operator for the field type is a
// compile error; useModel actions return new trees with structural sharing.

export type FilterFieldType = 'text' | 'number' | 'date' | 'date-range' | 'enum' | 'multi-enum' | 'boolean';

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
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

type Ops<T extends FilterFieldType> = T extends 'text'
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

export interface FilterRule<F extends FilterField = FilterField> {
  kind: 'rule';
  id: string;
  fieldId: string;
  operator: Ops<F['type']>;
  value?: string | number | readonly string[] | { start: string; end: string } | undefined;
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
