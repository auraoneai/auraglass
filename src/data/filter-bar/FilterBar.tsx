'use client';
/* FilterBar (SURF-196, REQ-SURF-87): schema-driven rule chips, quick-filters,
   search field, clear-all, announced result count. Editing a rule opens a
   popover that returns focus to its chip on close. */
import * as React from 'react';
import { applyModel } from './filter-model-ops';
import { DEFAULT_OPERATORS, emptyGroup, makeRule, type FilterField, type FilterGroup, type FilterModel, type FilterRule } from './filter-model';
import { parse, serialize } from './filter-serialize';

export interface FilterBarProps {
  schema: readonly FilterField[];
  value?: FilterGroup | undefined;
  defaultValue?: FilterGroup | undefined;
  onValueChange?: ((g: FilterGroup) => void) | undefined;
  search?: { value: string; onValueChange: (v: string) => void; placeholder?: string | undefined } | undefined;
  quickFilters?: readonly { id: string; label: string; rule: FilterRule }[] | undefined;
  onClearAll?: (() => void) | undefined;
  resultCount?: number | undefined;
  labels?: { filters?: string | undefined; clearAll?: string | undefined; addFilter?: string | undefined; results?: string | undefined; removeFilter?: string | undefined } | undefined;
  className?: string | undefined;
}

export function FilterBar({
  schema,
  value,
  defaultValue,
  onValueChange,
  search,
  quickFilters,
  onClearAll,
  resultCount,
  labels,
  className,
}: FilterBarProps) {
  // SURF-085: the bar runs on its own public model hook (looked up on the
  // component so the static stays the single implementation).
  const model = FilterBar.useModel(schema, { value, defaultValue, onValueChange });
  const group = model.value;
  const msgs = {
    filters: labels?.filters ?? 'Filters',
    clearAll: labels?.clearAll ?? 'Clear all',
    addFilter: labels?.addFilter ?? 'Add filter',
    results: labels?.results ?? '{n} results',
    removeFilter: labels?.removeFilter ?? 'Remove filter {label}',
  };

  const allRules = React.useMemo(() => {
    const out: FilterRule[] = [];
    const walk = (g: FilterGroup) => g.children.forEach((c) => (c.kind === 'group' ? walk(c) : out.push(c)));
    walk(group);
    return out;
  }, [group]);

  const fieldById = React.useMemo(() => new Map(schema.map((f) => [f.id, f])), [schema]);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [addField, setAddField] = React.useState<string>(schema[0]?.id ?? '');

  const ruleLabel = (r: FilterRule) => {
    const f = fieldById.get(r.fieldId);
    const v =
      r.value === undefined
        ? ''
        : Array.isArray(r.value)
          ? (r.value as readonly string[]).join(', ')
          : typeof r.value === 'object'
            ? `${(r.value as { start: string; end: string }).start}..${(r.value as { start: string; end: string }).end}`
            : String(r.value);
    return `${f?.label ?? r.fieldId} ${r.operator}${v !== '' ? ` ${v}` : ''}`;
  };

  const commitEdit = (ruleId: string, patch: Partial<FilterRule>) => {
    model.updateRule(ruleId, patch);
    setEditing(null);
  };

  return (
    <div
      data-ag-part="filter-bar"
      className={`ag-filter-bar${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={msgs.filters}
    >
      {search !== undefined ? (
        <input
          type="search"
          data-ag-part="filter-search"
          className="ag-filter-bar__search"
          value={search.value}
          placeholder={search.placeholder}
          aria-label={search.placeholder ?? msgs.filters}
          onChange={(e) => search.onValueChange(e.target.value)}
        />
      ) : null}
      {quickFilters !== undefined && quickFilters.length > 0 ? (
        <div data-ag-part="filter-quick" role="group" className="ag-filter-bar__quick">
          {quickFilters.map((q) => {
            const active = allRules.some((r) => r.fieldId === q.rule.fieldId && r.operator === q.rule.operator && JSON.stringify(r.value ?? null) === JSON.stringify(q.rule.value ?? null));
            return (
              <button
                key={q.id}
                type="button"
                aria-pressed={active}
                data-ag-part="filter-quick-toggle"
                className="ag-filter-bar__quick-toggle"
                onClick={() => {
                  const existing = allRules.find((r) => r.fieldId === q.rule.fieldId && r.operator === q.rule.operator && JSON.stringify(r.value ?? null) === JSON.stringify(q.rule.value ?? null));
                  if (existing !== undefined) model.removeRule(existing.id);
                  else model.addRule({ ...q.rule, id: `r-${q.id}-${group.children.length}-${allRules.length}` });
                }}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      ) : null}
      <div data-ag-part="filter-rules" className="ag-filter-bar__rules">
        {allRules.map((r) => (
          <span key={r.id} data-ag-part="filter-rule-chip" className="ag-filter-bar__chip" data-editing={editing === r.id || undefined}>
            <button
              type="button"
              className="ag-filter-bar__chip-label"
              onClick={() => setEditing(editing === r.id ? null : r.id)}
              aria-expanded={editing === r.id}
            >
              {ruleLabel(r)}
            </button>
            <button
              type="button"
              className="ag-filter-bar__chip-remove"
              aria-label={msgs.removeFilter.replace('{label}', ruleLabel(r))}
              onClick={() => model.removeRule(r.id)}
            >
              ×
            </button>
            {editing === r.id ? (
              <div role="dialog" data-ag-part="filter-rule-editor" className="ag-filter-bar__editor">
                <label>
                  Value
                  <input
                    autoFocus
                    defaultValue={typeof r.value === 'object' || r.value === undefined ? '' : String(r.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit(r.id, { value: (e.target as HTMLInputElement).value });
                      if (e.key === 'Escape') setEditing(null);
                    }}
                  />
                </label>
                <button type="button" onClick={(e) => commitEdit(r.id, { value: (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement)?.value })}>
                  Apply
                </button>
              </div>
            ) : null}
          </span>
        ))}
        <select
          data-ag-part="filter-add"
          className="ag-filter-bar__add"
          aria-label={msgs.addFilter}
          value={addField}
          onChange={(e) => {
            const f = fieldById.get(e.target.value);
            if (f !== undefined) {
              // first operator valid for the field type (not a blanket 'is')
              const ops = (f.operators ?? DEFAULT_OPERATORS[f.type]) as readonly string[];
              model.addRule(makeRule(f, ops[0] as never));
            }
          }}
        >
          {schema.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      {allRules.length > 0 ? (
        <button type="button" data-ag-part="filter-clear" className="ag-filter-bar__clear" onClick={() => { model.clear(); onClearAll?.(); }}>
          {msgs.clearAll}
        </button>
      ) : null}
      {resultCount !== undefined ? (
        <span aria-live="polite" role="status" className="ag-filter-bar__count">
          {msgs.results.replace('{n}', String(resultCount))}
        </span>
      ) : null}
    </div>
  );
}

export interface FilterModelOptions {
  value?: FilterGroup | undefined;
  defaultValue?: FilterGroup | undefined;
  onValueChange?: ((g: FilterGroup) => void) | undefined;
}

/** REQ-SURF-85: FilterBar.useModel(schema, { value?, defaultValue?,
    onValueChange? }). Actions are referentially stable for the component's
    lifetime (they read the latest value/handlers through a ref), never
    mutate, and share structure — only the edited path is new. Calls in the
    same tick chain (each sees the previous result). */
FilterBar.useModel = function useModel(schema: readonly FilterField[], opts: FilterModelOptions = {}): FilterModel {
  const [inner, setInner] = React.useState<FilterGroup>(() => opts.defaultValue ?? emptyGroup());
  const controlled = opts.value !== undefined;
  const group = controlled ? opts.value! : inner;
  const latest = React.useRef({ group, controlled, onValueChange: opts.onValueChange, schema });
  latest.current = { group, controlled, onValueChange: opts.onValueChange, schema };
  const actions = React.useMemo(() => {
    const run = (fn: Parameters<typeof applyModel>[1]) => {
      const l = latest.current;
      const next = applyModel(l.group, fn);
      if (next === l.group) return;
      l.group = next;
      if (!l.controlled) setInner(next);
      l.onValueChange?.(next);
    };
    const checkRule = (r: FilterRule) => {
      if (process.env['NODE_ENV'] !== 'development') return;
      const field = latest.current.schema.find((f) => f.id === r.fieldId);
      if (field === undefined) {
        console.warn(`[auraglass] FilterBar: rule field "${r.fieldId}" is not in the schema.`);
        return;
      }
      const allowed = (field.operators ?? DEFAULT_OPERATORS[field.type]) as readonly string[];
      if (!allowed.includes(r.operator as string)) {
        console.warn(`[auraglass] FilterBar: operator "${String(r.operator)}" is invalid for field "${field.id}" (${field.type}).`);
      }
    };
    return {
      addRule: (r: FilterRule, gid?: string) => { checkRule(r); run((m) => m.addRule(r, gid)); },
      updateRule: (id: string, p: Partial<Omit<FilterRule, 'id' | 'kind'>>) => run((m) => m.updateRule(id, p)),
      removeRule: (id: string) => run((m) => m.removeRule(id)),
      addGroup: (g?: FilterGroup, pid?: string) => run((m) => m.addGroup(g, pid)),
      removeGroup: (id: string) => run((m) => m.removeGroup(id)),
      setCombinator: (id: string, c: 'and' | 'or') => run((m) => m.setCombinator(id, c)),
      clear: () => run((m) => m.clear()),
    };
  }, []);
  return React.useMemo(() => ({ value: group, ...actions }), [group, actions]);
};

FilterBar.serialize = serialize;
FilterBar.parse = parse;
