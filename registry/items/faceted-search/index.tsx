/* faceted-search (REQ-SURF-174): FilterBar as the facet panel + search +
   result list. The visible results are DERIVED from the FilterBar model (each
   rule evaluated against the result's field) and the search query; the
   filtered length is what FilterBar announces as the result count. Every enum
   facet option is offered as a quick-filter toggle, so one click on a facet
   narrows the list. */
'use client';
import * as React from 'react';
import { FilterBar, type FilterField, type FilterGroup, type FilterRule } from 'aura-glass/data';

export interface FacetedResult { id: string; title: string; [k: string]: unknown }

export interface FacetedSearchProps {
  facets: readonly FilterField[];
  results: readonly FacetedResult[];
  renderResult?: ((r: FacetedResult) => React.ReactNode) | undefined;
}

const EMPTY: FilterGroup = { kind: 'group', id: 'root', combinator: 'and', children: [] };

const isBlank = (v: FilterRule['value']): boolean =>
  v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

const asList = (v: FilterRule['value']): string[] =>
  Array.isArray(v) ? v.map(String) : v === undefined || typeof v === 'object' ? [] : [String(v)];

const asRange = (v: FilterRule['value']): [string, string] | null => {
  if (Array.isArray(v) && v.length === 2) return [String(v[0]), String(v[1])];
  if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
    const r = v as { start: string; end: string };
    return [r.start, r.end];
  }
  return null;
};

/** One rule against one result field. A rule still waiting for a value (just
 *  added, not edited yet) does not filter — except `is-empty`, which needs none. */
export function matchesRule(result: FacetedResult, rule: FilterRule): boolean {
  const raw = result[rule.fieldId];
  const op = rule.operator as string;
  if (op === 'is-empty') return raw === undefined || raw === null || String(raw) === '';
  if (isBlank(rule.value)) return true;
  const v = rule.value;
  switch (op) {
    case 'contains': return String(raw ?? '').toLowerCase().includes(String(v).toLowerCase());
    case 'equals': return String(raw ?? '').toLowerCase() === String(v).toLowerCase();
    case 'starts-with': return String(raw ?? '').toLowerCase().startsWith(String(v).toLowerCase());
    case 'is': return asList(v).includes(String(raw));
    case 'is-not': return !asList(v).includes(String(raw));
    case 'any-of': {
      const have = Array.isArray(raw) ? raw.map(String) : [String(raw)];
      return asList(v).some((x) => have.includes(x));
    }
    case 'none-of': {
      const have = Array.isArray(raw) ? raw.map(String) : [String(raw)];
      return !asList(v).some((x) => have.includes(x));
    }
    case '=': return Number(raw) === Number(v);
    case '!=': return Number(raw) !== Number(v);
    case '<': return Number(raw) < Number(v);
    case '<=': return Number(raw) <= Number(v);
    case '>': return Number(raw) > Number(v);
    case '>=': return Number(raw) >= Number(v);
    case 'on': return String(raw).slice(0, 10) === String(v).slice(0, 10);
    case 'before': return String(raw) < String(v);
    case 'after': return String(raw) > String(v);
    case 'between': {
      const r = asRange(v);
      if (r === null) return true;
      if (typeof raw === 'number') return raw >= Number(r[0]) && raw <= Number(r[1]);
      return String(raw) >= r[0] && String(raw) <= r[1];
    }
    default: return true;
  }
}

function matchesGroup(result: FacetedResult, g: FilterGroup): boolean {
  if (g.children.length === 0) return true;
  const hits = g.children.map((c) => (c.kind === 'group' ? matchesGroup(result, c) : matchesRule(result, c)));
  return g.combinator === 'or' ? hits.some(Boolean) : hits.every(Boolean);
}

/** Results visible under a FilterBar model and a free-text query (matched
 *  case-insensitively against every string field). */
export function filterResults(results: readonly FacetedResult[], model: FilterGroup, query: string): FacetedResult[] {
  const q = query.trim().toLowerCase();
  return results.filter((r) =>
    matchesGroup(r, model) &&
    (q === '' || Object.values(r).some((v) => typeof v === 'string' && v.toLowerCase().includes(q))));
}

export function FacetedSearch({ facets, results, renderResult }: FacetedSearchProps) {
  const [model, setModel] = React.useState<FilterGroup>(EMPTY);
  const [q, setQ] = React.useState('');
  const visible = React.useMemo(() => filterResults(results, model, q), [results, model, q]);
  const quickFilters = React.useMemo(
    () => facets.flatMap((f) =>
      f.type === 'enum' && f.options !== undefined
        ? f.options.map((o) => ({
          id: `${f.id}-${o.value}`,
          label: `${f.label}: ${o.label}`,
          rule: { kind: 'rule' as const, id: `q-${f.id}-${o.value}`, fieldId: f.id, operator: 'is' as const, value: o.value },
        }))
        : []),
    [facets],
  );
  return (
    <div data-ag-part="faceted-search" className="ag-faceted-search" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1rem' }}>
      <aside aria-label="Facets">
        <FilterBar schema={facets} value={model} onValueChange={setModel} resultCount={visible.length}
          quickFilters={quickFilters}
          search={{ value: q, onValueChange: setQ, placeholder: 'Search results' }} />
      </aside>
      <ol aria-label="Results">
        {visible.map((r) => (
          <li key={r.id}>{renderResult ? renderResult(r) : r.title}</li>
        ))}
      </ol>
    </div>
  );
}
