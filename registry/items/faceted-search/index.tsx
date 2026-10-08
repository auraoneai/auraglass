/* faceted-search (REQ-SURF-174): FilterBar as the facet panel + search +
   result list with the announced count. */
'use client';
import * as React from 'react';
import { FilterBar, type FilterField, type FilterGroup } from 'aura-glass/data';

export interface FacetedResult { id: string; title: string; [k: string]: unknown }

export interface FacetedSearchProps {
  facets: readonly FilterField[];
  results: readonly FacetedResult[];
  renderResult?: ((r: FacetedResult) => React.ReactNode) | undefined;
}

export function FacetedSearch({ facets, results, renderResult }: FacetedSearchProps) {
  const [model, setModel] = React.useState<FilterGroup>({ kind: 'group', id: 'root', combinator: 'and', children: [] });
  const [q, setQ] = React.useState('');
  return (
    <div data-ag-part="faceted-search" className="ag-faceted-search" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1rem' }}>
      <aside>
        <FilterBar schema={facets} value={model} onValueChange={setModel} resultCount={results.length}
          search={{ value: q, onValueChange: setQ, placeholder: 'Search results' }} />
      </aside>
      <ol aria-label="Results">
        {results.map((r) => (
          <li key={r.id}>{renderResult ? renderResult(r) : r.title}</li>
        ))}
      </ol>
    </div>
  );
}
