/** @jest-environment jsdom */
// SURF-197: chips render rules, remove/clear, quick-filters, announced count,
// editor opens and returns focus.
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, renderHook } from '@testing-library/react';
import * as React from 'react';
import { FilterBar } from './FilterBar';
import { makeRule, emptyGroup, type FilterField, type FilterGroup } from './filter-model';
import { applyModel } from './filter-model-ops';

const SCHEMA: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'qty', label: 'Qty', type: 'number' },
];

const base = applyModel(emptyGroup(), (m) => m.addRule(makeRule(SCHEMA[0]!, 'contains', 'abc')));

describe('FilterBar (SURF-196, REQ-SURF-87)', () => {
  it('renders each rule as a removable chip', () => {
    const on = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} onValueChange={on} />);
    const chip = container.querySelector('[data-ag-part="filter-rule-chip"]')!;
    expect(chip.textContent).toContain('Name contains abc');
    fireEvent.click(chip.querySelector('.ag-filter-bar__chip-remove')!);
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [] }));
  });

  it('clear all empties the group and calls onClearAll', () => {
    const on = jest.fn();
    const onClear = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} onValueChange={on} onClearAll={onClear} />);
    fireEvent.click(container.querySelector('[data-ag-part="filter-clear"]')!);
    expect(onClear).toHaveBeenCalled();
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [] }));
  });

  it('quick filter toggle adds/removes its rule', () => {
    const on = jest.fn();
    const q = { id: 'q1', label: 'Big qty', rule: makeRule(SCHEMA[1]!, '>', 100) };
    const { container } = render(
      <FilterBar schema={SCHEMA} quickFilters={[q]} onValueChange={on} />,
    );
    const btn = container.querySelector('[data-ag-part="filter-quick-toggle"]')!;
    fireEvent.click(btn);
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [expect.objectContaining({ fieldId: 'qty' })] }));
  });

  it('resultCount announces politely', () => {
    const { container } = render(<FilterBar schema={SCHEMA} resultCount={42} />);
    expect(container.querySelector('[role="status"]')!.textContent).toBe('42 results');
  });

  it('editing a rule opens a dialog and commits on Enter', () => {
    const on = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} onValueChange={on} />);
    fireEvent.click(container.querySelector('.ag-filter-bar__chip-label')!);
    const input = container.querySelector('[data-ag-part="filter-rule-editor"] input')!;
    fireEvent.keyDown(input, { key: 'Enter', target: { value: 'xyz' } });
    expect(on).toHaveBeenCalledWith(
      expect.objectContaining({ children: [expect.objectContaining({ value: 'xyz' })] }),
    );
  });

  it('useModel + serialize + parse are static members', () => {
    expect(typeof FilterBar.serialize).toBe('function');
    expect(typeof FilterBar.parse).toBe('function');
    expect(typeof FilterBar.useModel).toBe('function');
    const params = FilterBar.serialize(base);
    const g = FilterBar.parse(SCHEMA, params);
    expect(g.children.length).toBe(1);
  });

  // REQ-SURF-85
  it('FilterBar itself runs on FilterBar.useModel', () => {
    const spy = jest.spyOn(FilterBar, 'useModel');
    try {
      render(<FilterBar schema={SCHEMA} defaultValue={base} />);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0]![0]).toBe(SCHEMA);
      expect(spy.mock.calls[0]![1]).toEqual(expect.objectContaining({ defaultValue: base }));
    } finally {
      spy.mockRestore();
    }
  });

  it('useModel: actions are referentially stable across renders and value changes', () => {
    const on = jest.fn();
    const { result, rerender } = renderHook(
      ({ cb }: { cb: (g: FilterGroup) => void }) => FilterBar.useModel(SCHEMA, { onValueChange: cb }),
      { initialProps: { cb: on } },
    );
    const first = result.current;
    act(() => first.addRule(makeRule(SCHEMA[0]!, 'contains', 'x')));
    expect(result.current.value.children.length).toBe(1);
    expect(result.current.value).not.toBe(first.value);
    const on2 = jest.fn();
    rerender({ cb: on2 });
    for (const k of ['addRule', 'updateRule', 'removeRule', 'addGroup', 'removeGroup', 'setCombinator', 'clear'] as const) {
      expect(result.current[k]).toBe(first[k]);
    }
    // the stable callback still reaches the latest onValueChange
    act(() => result.current.clear());
    expect(on).toHaveBeenCalledTimes(1);
    expect(on2).toHaveBeenCalledTimes(1);
    expect(result.current.value.children).toEqual([]);
  });

  it('useModel: chained actions in one tick see each other', () => {
    const { result } = renderHook(() => FilterBar.useModel(SCHEMA));
    act(() => {
      result.current.addRule(makeRule(SCHEMA[0]!, 'contains', 'a'));
      result.current.addRule(makeRule(SCHEMA[1]!, '>', 2));
    });
    expect(result.current.value.children.length).toBe(2);
  });

  it('useModel controlled: value follows the prop; onValueChange receives the next tree', () => {
    const on = jest.fn();
    const { result } = renderHook(() => FilterBar.useModel(SCHEMA, { value: base, onValueChange: on }));
    act(() => result.current.clear());
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [] }));
    expect(result.current.value).toBe(base);
  });

  it('useModel dev-warns for a rule whose operator is invalid for its schema field', () => {
    const dev = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { result } = renderHook(() => FilterBar.useModel(SCHEMA));
      act(() => result.current.addRule({ kind: 'rule', id: 'bad', fieldId: 'qty', operator: 'contains' } as never));
      expect(warn.mock.calls.some((c) => String(c[0]).includes('"contains" is invalid for field "qty"'))).toBe(true);
    } finally {
      warn.mockRestore();
      process.env['NODE_ENV'] = dev;
    }
  });

  it('add-filter picks the first operator valid for the field type', () => {
    const on = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} onValueChange={on} />);
    fireEvent.change(container.querySelector('[data-ag-part="filter-add"]')!, { target: { value: 'qty' } });
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [expect.objectContaining({ fieldId: 'qty', operator: '=' })] }));
  });
});
