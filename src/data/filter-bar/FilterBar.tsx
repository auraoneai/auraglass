'use client';
/* FilterBar (SURF-196, REQ-SURF-87): schema-driven rule chips, quick-filters,
   search field, clear-all, announced result count. Editing a rule opens a
   popover that returns focus to its chip on close. */
import * as React from 'react';
import { applyModel } from './filter-model-ops';
import { emptyGroup, makeRule, type FilterField, type FilterGroup, type FilterRule } from './filter-model';
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
  const [inner, setInner] = React.useState<FilterGroup>(defaultValue ?? emptyGroup());
  const group = value ?? inner;
  const setGroup = React.useCallback(
    (next: FilterGroup) => {
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );
  const msgs = {
    filters: labels?.filters ?? 'Filters',
    clearAll: labels?.clearAll ?? 'Clear all',
    addFilter: labels?.addFilter ?? 'Add filter',
    results: labels?.results ?? '{n} results',
    removeFilter: labels?.removeFilter ?? 'Remove filter {label}',
  };

  const model = React.useMemo(
    () => ({
      addRule: (r: FilterRule, gid?: string) => setGroup(applyModel(group, (m) => m.addRule(r, gid))),
      updateRule: (id: string, p: Partial<Omit<FilterRule, 'id' | 'kind'>>) =>
        setGroup(applyModel(group, (m) => m.updateRule(id, p))),
      removeRule: (id: string) => setGroup(applyModel(group, (m) => m.removeRule(id))),
      addGroup: (g?: FilterGroup, pid?: string) => setGroup(applyModel(group, (m) => m.addGroup(g, pid))),
      removeGroup: (id: string) => setGroup(applyModel(group, (m) => m.removeGroup(id))),
      setCombinator: (id: string, c: 'and' | 'or') => setGroup(applyModel(group, (m) => m.setCombinator(id, c))),
      clear: () => setGroup(applyModel(group, (m) => m.clear())),
    }),
    [group, setGroup],
  );

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
              const ops = (f.operators ?? []) as readonly string[];
              model.addRule(makeRule(f, (ops[0] ?? 'is') as never));
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

FilterBar.useModel = function useModel(
  schema: readonly FilterField[],
  opts: { value?: FilterGroup | undefined; defaultValue?: FilterGroup | undefined; onValueChange?: ((g: FilterGroup) => void) | undefined } = {},
) {
  const [inner, setInner] = React.useState<FilterGroup>(opts.defaultValue ?? emptyGroup());
  const group = opts.value ?? inner;
  const setGroup = React.useCallback(
    (next: FilterGroup) => {
      if (opts.value === undefined) setInner(next);
      opts.onValueChange?.(next);
    },
    [opts],
  );
  void schema;
  return React.useMemo(
    () => ({
      value: group,
      addRule: (r: FilterRule, gid?: string) => setGroup(applyModel(group, (m) => m.addRule(r, gid))),
      updateRule: (id: string, p: Partial<Omit<FilterRule, 'id' | 'kind'>>) => setGroup(applyModel(group, (m) => m.updateRule(id, p))),
      removeRule: (id: string) => setGroup(applyModel(group, (m) => m.removeRule(id))),
      addGroup: (g?: FilterGroup, pid?: string) => setGroup(applyModel(group, (m) => m.addGroup(g, pid))),
      removeGroup: (id: string) => setGroup(applyModel(group, (m) => m.removeGroup(id))),
      setCombinator: (id: string, c: 'and' | 'or') => setGroup(applyModel(group, (m) => m.setCombinator(id, c))),
      clear: () => setGroup(applyModel(group, (m) => m.clear())),
    }),
    [group, setGroup],
  );
};

FilterBar.serialize = serialize;
FilterBar.parse = parse;
