/** @jest-environment jsdom */
// SURF-250 / REQ-SURF-178 (REQ-FIN-88, AC-FIN-88) — audit-log block, rendered
// against the REAL library sources: server-side paging (filter, then slice by
// pageIndex — the Table never receives more than one page), Pagination next
// → onPaginationChange({pageIndex: 1}), and the 'Filters' CMP Sheet at
// ≤390 px (jsdom matchMedia) or with the `compact` container-width prop.
//
// Resolution: the public specifiers are aliased to their
// src/contracts/entries.ts sources via jest.requireActual until the root
// mapper lands (REQ-FIN-09 / contract C-4, FIN-A).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/data', () => jest.requireActual('../../../src/data/index'), { virtual: true });
jest.mock('aura-glass/date', () => jest.requireActual('../../../src/date/index'), { virtual: true });

import { AuditLog, queryAuditPage } from '../../../registry/blocks/audit-log/index';
import { EVENTS, PAGE_SIZE, TOTAL_EVENTS } from '../../../registry/blocks/audit-log/fixtures';
import type { FilterGroup } from '../../../src/data/index';
import { AuraGlassProvider } from '../../../src/theme/public';

const wrap = (ui: React.ReactElement) => render(ui, { wrapper: ({ children }) => <AuraGlassProvider storage={null}>{children}</AuraGlassProvider> });

const setViewport = (width: number) => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true, writable: true,
    value: (q: string) => {
      const m = /max-width:\s*([\d.]+)px/.exec(q);
      return {
        matches: m !== null && width <= Number(m[1]), media: q, onchange: null,
        addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
      };
    },
  });
};
const originalMatchMedia = window.matchMedia;
afterEach(() => {
  cleanup();
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: originalMatchMedia });
});

const bodyRowIds = () => [...document.querySelectorAll('tbody tr td[data-ag-cell="at"]')].map((td) => td.closest('tr')!.querySelector('td[data-ag-cell="ip"]')!.textContent);

describe('audit-log block', () => {
  it('pages server-side: the Table receives only the first PAGE_SIZE events', () => {
    setViewport(1280);
    wrap(<AuditLog />);
    expect(EVENTS).toHaveLength(TOTAL_EVENTS);
    expect(bodyRowIds()).toEqual(EVENTS.slice(0, PAGE_SIZE).map((e) => e.ip));
    expect(screen.getByRole('status').textContent).toBe(`${TOTAL_EVENTS} results`);
  });

  it('next page calls onPaginationChange with pageIndex 1 and renders that slice', async () => {
    setViewport(1280);
    const onPaginationChange = jest.fn();
    wrap(<AuditLog onPaginationChange={onPaginationChange} />);
    const nav = screen.getByRole('navigation', { name: 'Audit log pages' });
    await act(async () => { fireEvent.click(within(nav).getByRole('button', { name: 'Next page' })); });
    expect(onPaginationChange).toHaveBeenCalledTimes(1);
    expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: PAGE_SIZE });
    expect(bodyRowIds()).toEqual(EVENTS.slice(PAGE_SIZE, 2 * PAGE_SIZE).map((e) => e.ip));
  });

  it('queryAuditPage filters, then slices by pageIndex, and reports the filtered total', () => {
    const jon: FilterGroup = { kind: 'group', id: 'root', combinator: 'and', children: [{ kind: 'rule', id: 'r', fieldId: 'actor', operator: 'is', value: 'jon' }] };
    const all = EVENTS.filter((e) => e.actor === 'jon');
    const p1 = queryAuditPage(EVENTS, jon, 1, PAGE_SIZE);
    expect(p1.total).toBe(all.length);
    expect(p1.pageCount).toBe(Math.ceil(all.length / PAGE_SIZE));
    expect(p1.rows).toEqual(all.slice(PAGE_SIZE, 2 * PAGE_SIZE));
    expect(p1.rows.every((e) => e.actor === 'jon')).toBe(true);
    const last = queryAuditPage(EVENTS, { ...jon, children: [] }, Math.ceil(TOTAL_EVENTS / PAGE_SIZE) - 1, PAGE_SIZE);
    expect(last.rows).toHaveLength(TOTAL_EVENTS % PAGE_SIZE);
  });

  it('wide layout renders FilterBar and the DateRangePicker inline (no Filters trigger)', () => {
    setViewport(1280);
    const { container } = wrap(<AuditLog />);
    expect(container.querySelector('[data-ag-part="audit-log"]')!.getAttribute('data-layout')).toBe('wide');
    expect(screen.queryByRole('button', { name: 'Filters' })).toBeNull();
    expect(container.querySelector('[data-ag-part="audit-filters"] [data-ag-part="filter-bar"]')).not.toBeNull();
  });

  it('at 390 px the filters move into a CMP Sheet opened by a Filters trigger', async () => {
    setViewport(390);
    const { container } = wrap(<AuditLog />);
    expect(container.querySelector('[data-ag-part="audit-log"]')!.getAttribute('data-layout')).toBe('compact');
    expect(container.querySelector('[data-ag-part="filter-bar"]')).toBeNull();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Filters' })); });
    const sheet = document.querySelector('[data-ag-overlay="sheet"]') as HTMLElement;
    expect(sheet).not.toBeNull();
    expect(sheet.querySelector('[data-ag-part="filter-bar"]')).not.toBeNull();
    expect(within(sheet).getByText('Window')).toBeTruthy();
  });

  it('the compact container-width prop forces the Sheet layout at any viewport', () => {
    setViewport(1280);
    wrap(<AuditLog compact />);
    expect(screen.getByRole('button', { name: 'Filters' })).toBeTruthy();
  });
});
