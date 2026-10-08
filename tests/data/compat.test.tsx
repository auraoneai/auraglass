/** @jest-environment jsdom */
// SURF-321..342 — REQ-SURF-13: every W2 compat adapter renders its 5.0
// successor from 4.x-style props and warns exactly once per adapter.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { GlassDataTable } from '../../src/compat/surf/data/GlassDataTable';
import { GlassDataGrid } from '../../src/compat/surf/data/GlassDataGrid';
import { GlassVirtualTable } from '../../src/compat/surf/data/GlassVirtualTable';
import { GlassVirtualList } from '../../src/compat/surf/data/GlassVirtualList';
import { GlassTreeView } from '../../src/compat/surf/data/GlassTreeView';
import { TreeView as TreeView4x } from '../../src/compat/surf/data/TreeView4x';
import { GlassFileTree } from '../../src/compat/surf/data/GlassFileTree';
import { GlassFileExplorer } from '../../src/compat/surf/data/GlassFileExplorer';
import { GlassFilterBar } from '../../src/compat/surf/data/GlassFilterBar';
import { GlassStatCard } from '../../src/compat/surf/data/GlassStatCard';
import { GlassKPICard } from '../../src/compat/surf/data/GlassKPICard';
import { GlassMetricCard } from '../../src/compat/surf/data/GlassMetricCard';
import { GlassAnimatedNumber } from '../../src/compat/surf/data/GlassAnimatedNumber';
import { GlassSparkline } from '../../src/compat/surf/data/GlassSparkline';
import { GlassTimeline } from '../../src/compat/surf/data/GlassTimeline';
import { GlassActivityFeed } from '../../src/compat/surf/data/GlassActivityFeed';
import { GlassChip } from '../../src/compat/surf/data/GlassChip';
import { GlassKeyValueEditor } from '../../src/compat/surf/data/GlassKeyValueEditor';
import { GlassDateField } from '../../src/compat/surf/date/GlassDateField';
import { GlassTimeField } from '../../src/compat/surf/date/GlassTimeField';
import { GlassDatePicker } from '../../src/compat/surf/date/GlassDatePicker';
import { GlassDateRangePicker } from '../../src/compat/surf/date/GlassDateRangePicker';
import { GlassCalendar } from '../../src/compat/surf/date/GlassCalendar';

const warn = jest.spyOn(console, 'warn').mockImplementation((): void => {});
beforeEach(() => { warn.mockClear(); });

const ROWS = [{ id: '1', name: 'Ada', role: 'eng' }];
const COLS = [{ key: 'name', label: 'Name' }];
const NODES = [{ id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }] }];
const DATE = new Date(2026, 9, 7, 12, 0, 0);

type Row = { name: string; C: React.FC<any>; props: Record<string, unknown>; html?: string };
const ADAPTERS: Row[] = [
  { name: 'GlassDataTable', C: GlassDataTable, props: { rows: ROWS, columns: COLS }, html: '<table' },
  { name: 'GlassDataGrid', C: GlassDataGrid, props: { rows: ROWS, columns: COLS }, html: '<table' },
  { name: 'GlassVirtualTable', C: GlassVirtualTable, props: { rows: ROWS, columns: COLS }, html: '<table' },
  { name: 'GlassVirtualList', C: GlassVirtualList, props: { items: [1, 2], renderItem: (i: number) => <span key={i}>{i}</span> } },
  { name: 'GlassTreeView', C: GlassTreeView, props: { nodes: NODES } },
  { name: 'TreeView(4.x)', C: TreeView4x, props: { items: NODES } },
  { name: 'GlassFileTree', C: GlassFileTree, props: { files: [{ name: 'src', children: [{ name: 'a.ts' }] }] } },
  { name: 'GlassFileExplorer', C: GlassFileExplorer, props: { files: [{ name: 'src' }] } },
  { name: 'GlassFilterBar', C: GlassFilterBar, props: { fields: [{ id: 'name', label: 'Name', type: 'text' }] } },
  { name: 'GlassStatCard', C: GlassStatCard, props: { title: 'Revenue', value: 4200 }, html: 'Revenue' },
  { name: 'GlassKPICard', C: GlassKPICard, props: { title: 'KPI', value: 9 } },
  { name: 'GlassMetricCard', C: GlassMetricCard, props: { label: 'Metric', value: 3 } },
  { name: 'GlassAnimatedNumber', C: GlassAnimatedNumber, props: { value: 42 } },
  { name: 'GlassSparkline', C: GlassSparkline, props: { values: [1, 3, 2] } },
  { name: 'GlassTimeline', C: GlassTimeline, props: { items: [{ id: 't', timestamp: DATE, title: 'T' }] } },
  { name: 'GlassActivityFeed', C: GlassActivityFeed, props: { items: [{ id: 'a', timestamp: DATE, title: 'A', actor: 'Ada' }] } },
  { name: 'GlassChip', C: GlassChip, props: { label: 'Tag' } },
  { name: 'GlassKeyValueEditor', C: GlassKeyValueEditor, props: { entries: { a: '1' } } },
  { name: 'GlassDateField', C: GlassDateField, props: { value: DATE } },
  { name: 'GlassTimeField', C: GlassTimeField, props: { value: DATE } },
  { name: 'GlassDatePicker', C: GlassDatePicker, props: { value: DATE } },
  { name: 'GlassDateRangePicker', C: GlassDateRangePicker, props: { startDate: DATE, endDate: new Date(2026, 9, 12) } },
  { name: 'GlassCalendar', C: GlassCalendar, props: { value: DATE } },
];

describe('W2 compat adapters (SURF-321..342)', () => {
  it.each(ADAPTERS.map((a) => [a.name, a] as const))('%s renders its successor and warns once', (_n, a) => {
    const { container } = render(React.createElement(a.C as React.FC<Record<string, unknown>>, a.props));
    if (a.html) expect(container.innerHTML).toContain(a.html);
    else expect(container.firstChild).not.toBeNull();
    const adapterWarns = warn.mock.calls.filter((c) => String(c[0]).includes(a.name.split('(')[0]!));
    expect(adapterWarns.length).toBe(1);
  });
});
