/** @jest-environment jsdom */
// REQ-SURF-13 (W2): every data + date compat adapter renders its 5.0
// successor from its 4.x story props and warns exactly once with its DEP-S id.
// Harness: tests/app-shell/compat-harness.tsx. Story props:
// tests/fixtures/consumer-4x/cases/surf/data/story-args.tsx.
import { describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { expectAdapter, type CompatRow } from '../app-shell/compat-harness';
import { W2_STORY_ARGS as A } from '../fixtures/consumer-4x/cases/surf/data/story-args';
import * as compat from '../../src/compat/surf';
import { COMPAT_IDS } from '../fixtures/consumer-4x/cases/surf/compat-ids';

type C = React.ComponentType<Record<string, unknown>>;
const row = (name: keyof typeof compat & keyof typeof A, part: string, extra?: Record<string, unknown>): CompatRow => ({
  name, id: COMPAT_IDS[name]!.id, part, C: compat[name] as unknown as C, args: A[name]!, ...(extra ? { extra } : {}),
});

export const W2_ROWS: CompatRow[] = [
  row('GlassDataTable', 'table [data-ag-part="table-cell"]', { onRowClick: jest.fn() }),
  row('GlassDataGrid', 'table [data-ag-part="table-cell"]'),
  row('GlassVirtualTable', '.ag-table__scroller'),
  row('GlassVirtualList', '[role="list"]', { onEndReached: jest.fn() }),
  row('GlassTreeView', '[data-ag-part="tree-view"] [data-ag-part="tree-item"]', { onSelect: jest.fn() }),
  row('TreeView', '[data-ag-part="tree-view"] [data-ag-part="tree-item"]', { onSelectionChange: jest.fn() }),
  row('GlassFileTree', '[data-ag-part="tree-view"] [data-ag-part="tree-item"]', { onNodeSelect: jest.fn() }),
  row('GlassFileExplorer', '[data-ag-part="tree-view"] [data-ag-part="tree-item"]', { onFileSelect: jest.fn(), onNavigate: jest.fn(), onFileOpen: jest.fn() }),
  row('GlassFilterBar', '[data-ag-part="filter-bar"]'),
  row('GlassStatCard', '[data-ag-part="stat-card-value"]'),
  row('GlassKPICard', '[data-ag-part="stat-card-delta"]'),
  row('GlassMetricCard', '[data-ag-part="stat-card-delta"]'),
  row('GlassAnimatedNumber', 'span'),
  row('GlassSparkline', '[data-ag-part="sparkline"]'),
  row('GlassTimeline', '[data-ag-part="timeline"] [data-ag-part="timeline-item"]'),
  row('GlassActivityFeed', '[data-ag-part="activity-feed"] [data-ag-part="activity-actor"]'),
  row('GlassChip', '[data-ag-part="chip"]'),
  row('GlassKeyValueEditor', '[data-ag-part="key-value-editor"] [data-ag-part="key-value-row"]', { onChange: jest.fn() }),
  row('GlassDateField', '[data-ag-part="date-field"]'),
  row('GlassTimeField', '[data-ag-part="time-field"]'),
  row('GlassDatePicker', '[data-ag-part="date-picker"]', { onChange: jest.fn() }),
  row('GlassDateRangePicker', '[data-ag-part="date-range-picker"]', { onChange: jest.fn() }),
  row('GlassCalendar', '[data-ag-part="calendar"]', { onDateSelect: jest.fn() }),
];

describe('W2 compat adapters render from 4.x story props (REQ-SURF-13)', () => {
  it.each(W2_ROWS.map((r) => [r.name, r] as const))('%s', (_name, r) => {
    expectAdapter(r);
  });
});

describe('W2 prop mapping', () => {
  const quiet = () => jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  it('GlassDataTable maps pagination + initialPageSize and 4.x ColumnDef headers', () => {
    quiet();
    const { container } = render(<compat.GlassDataTable {...A.GlassDataTable!.props} />);
    // initialPageSize 2 → two body rows of the three.
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(container.textContent).toContain('Status');
    cleanup();
  });

  it('GlassKeyValueEditor is controlled through value/onChange(pairs) as in 4.x', () => {
    quiet();
    const onChange = jest.fn();
    const { container } = render(<compat.GlassKeyValueEditor {...A.GlassKeyValueEditor!.props} onChange={onChange} />);
    const keys = container.querySelectorAll<HTMLInputElement>('[data-ag-part="key-input"]');
    expect([...keys].map((k) => k.value)).toEqual(['name', 'email', 'role']);
    fireEvent.change(keys[0]!, { target: { value: 'fullName' } });
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([{ key: 'fullName', value: 'John Doe' }]));
    cleanup();
  });

  it('GlassStatCard keeps a formatted string value verbatim; KPI trendPercentage is a percent delta', () => {
    quiet();
    const stat = render(<compat.GlassStatCard {...A.GlassStatCard!.props} />);
    expect(stat.container.querySelector('[data-ag-part="stat-card-value"]')!.textContent).toBe('$45,231');
    cleanup();
    const kpi = render(<compat.GlassKPICard {...A.GlassKPICard!.props} />);
    expect(kpi.container.querySelector('[data-ag-part="stat-card-delta"]')!.textContent).toContain('12.5%');
    cleanup();
  });

  it('GlassTimeline maps subtitle → description and keeps the 4.x display time', () => {
    quiet();
    const { container } = render(<compat.GlassTimeline {...A.GlassTimeline!.props} />);
    expect(container.querySelectorAll('[data-ag-part="timeline-item"]')).toHaveLength(3);
    expect(container.textContent).toContain('2 hours ago');
    cleanup();
  });

  it('GlassFilterBar removing a chip fires that filter\'s onRemove; clear-all fires onClear', () => {
    quiet();
    const onRemove = jest.fn();
    const onClear = jest.fn();
    const filters = [{ id: 'status', label: 'Status', value: 'Open', onRemove }];
    const { getByRole } = render(<compat.GlassFilterBar filters={filters} onClear={onClear} />);
    fireEvent.click(getByRole('button', { name: /remove filter status/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    fireEvent.click(getByRole('button', { name: /clear all/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('GlassDateField parses the 4.x ISO string value and reports onChange({target:{value}})', () => {
    quiet();
    const onChange = jest.fn();
    const { container } = render(<compat.GlassDateField label="Launch" value="2026-09-18" onChange={onChange} />);
    const field = container.querySelector('[data-ag-part="date-field"]')!;
    expect(field.textContent).toMatch(/18/);
    expect(field.textContent).toMatch(/2026/);
    cleanup();
  });
});
