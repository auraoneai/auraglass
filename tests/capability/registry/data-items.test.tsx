/** @jest-environment jsdom */
// SURF-265 / REQ-SURF-174 (REQ-FIN-88, AC-FIN-88) — data items: query-builder,
// tree-select, faceted-search, schema-viewer, rendered against the REAL
// library sources. Behaviour: selecting a facet reduces the rendered result
// count; selecting a tree node updates the CMP Select trigger label.
//
// Resolution: items import the public specifiers ('aura-glass',
// 'aura-glass/<entry>'). The root jest.config.js maps none of them yet
// (REQ-FIN-09 / contract C-4, FIN-A); until it does, each specifier is
// aliased here to its src/contracts/entries.ts source via jest.requireActual
// — the real module, the same mapping the root mapper will make.
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/data', () => jest.requireActual('../../../src/data/index'), { virtual: true });

import { QueryBuilder } from '../../../registry/items/query-builder/index';
import { TreeSelect } from '../../../registry/items/tree-select/index';
import { FacetedSearch, filterResults, matchesRule } from '../../../registry/items/faceted-search/index';
import { SchemaViewer } from '../../../registry/items/schema-viewer/index';
import { FIELDS } from '../../../registry/items/query-builder/fixtures';
import { FILES } from '../../../registry/items/tree-select/fixtures';
import { FACETS, RESULTS } from '../../../registry/items/faceted-search/fixtures';
import { SCHEMA } from '../../../registry/items/schema-viewer/fixtures';
import type { FilterGroup } from '../../../src/data/index';
import { AuraGlassProvider } from '../../../src/theme/public';

const wrap = (ui: React.ReactElement) => render(ui, { wrapper: ({ children }) => <AuraGlassProvider storage={null}>{children}</AuraGlassProvider> });
/* Item fragments are not pages: the landmark rule does not apply in isolation. */
const a11y = async (el: Element) =>
  ((await axe(el, { rules: { region: { enabled: false } } })) as AxeResult).violations
    .flatMap((v) => v.nodes.map((n) => `${v.id}: ${JSON.stringify(n.target)}`));

afterEach(cleanup);

/** jest-axe result shape (the package ships no types for it here). */
type AxeResult = { violations: Array<{ id: string; nodes: Array<{ target: unknown }> }> };

const resultsList = () => screen.getByRole('list', { name: 'Results' });
const countText = () => screen.getByRole('status').textContent;

describe('data items', () => {
  it('query-builder renders the root group and actions', () => {
    const { container } = wrap(<QueryBuilder schema={FIELDS} />);
    expect(container.querySelector('[data-ag-part="query-builder"]')).not.toBeNull();
    expect(screen.getAllByText('Add rule').length).toBeGreaterThan(0);
    expect(screen.getByText('Clear all')).toBeTruthy();
  });

  it('schema-viewer renders the schema tree', () => {
    const { container } = wrap(<SchemaViewer schema={SCHEMA as unknown as Record<string, unknown>} />);
    expect(container.querySelector('[data-ag-part="schema-viewer"]')).not.toBeNull();
    expect(container.textContent).toContain('Deployment');
  });
});

describe('tree-select (REQ-SURF-174)', () => {
  it('composes the CMP Select: trigger part + a combobox labelled by the item label', () => {
    const { container } = wrap(<TreeSelect items={FILES} label="Folder" />);
    const trigger = container.querySelector('[data-ag-part="tree-select"] .ag-select[data-ag-part="trigger"]');
    expect(trigger).not.toBeNull();
    expect(screen.getByRole('combobox', { name: 'Folder' })).toBe(trigger);
    expect(trigger!.textContent).toBe('Choose…');
  });

  it('opens the Select popup with the TreeView inside it', async () => {
    wrap(<TreeSelect items={FILES} label="Folder" />);
    await act(async () => { fireEvent.click(screen.getByRole('combobox', { name: 'Folder' })); });
    const popup = document.querySelector('.ag-select-popup[data-ag-part="popup"]') as HTMLElement;
    expect(popup).not.toBeNull();
    const tree = within(popup).getByRole('treegrid');
    expect(tree.getAttribute('data-ag-part')).toBe('tree-view');
    expect(within(tree).getByText('docs')).toBeTruthy();
  });

  it('selecting a tree node updates the trigger label, reports the key and closes', async () => {
    const onValueChange = jest.fn();
    wrap(<TreeSelect items={FILES} label="Folder" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Folder' });
    await act(async () => { fireEvent.click(trigger); });
    const row = screen.getAllByRole('row').find((r) => r.textContent?.includes('docs')) as HTMLElement;
    await act(async () => { fireEvent.click(row); });
    expect(onValueChange).toHaveBeenCalledWith('docs');
    expect(trigger.textContent).toBe('docs');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('has 0 axe violations closed', async () => {
    const { container } = wrap(<TreeSelect items={FILES} label="Folder" />);
    expect(await a11y(container)).toEqual([]);
  });
});

describe('faceted-search (REQ-SURF-174)', () => {
  it('renders every result and announces the full count with no facet selected', () => {
    wrap(<FacetedSearch facets={FACETS} results={RESULTS} />);
    expect(within(resultsList()).getAllByRole('listitem')).toHaveLength(RESULTS.length);
    expect(countText()).toBe(`${RESULTS.length} results`);
  });

  it('a facet click reduces the rendered result count (and the announced count follows)', async () => {
    wrap(<FacetedSearch facets={FACETS} results={RESULTS} />);
    const facet = screen.getByRole('button', { name: 'Repo: Core' });
    await act(async () => { fireEvent.click(facet); });
    expect(facet.getAttribute('aria-pressed')).toBe('true');
    const items = within(resultsList()).getAllByRole('listitem').map((li) => li.textContent);
    const expected = RESULTS.filter((r) => r.repo === 'core').map((r) => r.title);
    expect(items).toEqual(expected);
    expect(items.length).toBeLessThan(RESULTS.length);
    expect(countText()).toBe(`${expected.length} results`);
    // Toggling the facet off restores the full list.
    await act(async () => { fireEvent.click(facet); });
    expect(within(resultsList()).getAllByRole('listitem')).toHaveLength(RESULTS.length);
  });

  it('the search query narrows the results together with the facets', async () => {
    wrap(<FacetedSearch facets={FACETS} results={RESULTS} />);
    await act(async () => { fireEvent.change(screen.getByRole('searchbox', { name: 'Search results' }), { target: { value: 'paginator' } }); });
    expect(within(resultsList()).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Fix paginator off-by-one']);
    expect(countText()).toBe('1 results');
  });

  it('evaluates rules against result fields (enum, number, text; and/or)', () => {
    const rule = (fieldId: string, operator: string, value?: unknown) =>
      ({ kind: 'rule', id: `${fieldId}-${operator}`, fieldId, operator, value }) as never;
    expect(matchesRule(RESULTS[0]!, rule('stars', '>', 10))).toBe(true);
    expect(matchesRule(RESULTS[1]!, rule('stars', '>', 10))).toBe(false);
    expect(matchesRule(RESULTS[1]!, rule('type', 'is-not', 'issue'))).toBe(false);
    expect(matchesRule(RESULTS[2]!, rule('title', 'contains', 'ARIA'))).toBe(true);
    // A rule just added (no value yet) does not filter.
    expect(matchesRule(RESULTS[1]!, rule('stars', '>'))).toBe(true);
    const or: FilterGroup = { kind: 'group', id: 'root', combinator: 'or', children: [rule('type', 'is', 'doc'), rule('type', 'is', 'pr')] };
    expect(filterResults(RESULTS, or, '').map((r) => r.id)).toEqual(['r1', 'r3']);
    const and: FilterGroup = { ...or, combinator: 'and', children: [rule('repo', 'is', 'core'), rule('stars', '<', 20)] };
    expect(filterResults(RESULTS, and, '').map((r) => r.id)).toEqual(['r3']);
  });

  it('has 0 axe violations', async () => {
    const { container } = wrap(<FacetedSearch facets={FACETS} results={RESULTS} />);
    expect(await a11y(container)).toEqual([]);
  });
});
