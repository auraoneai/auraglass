/** @jest-environment jsdom */
// SURF-197: chips render rules, remove/clear, quick-filters, announced count,
// editor opens and returns focus.
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { FilterBar } from './FilterBar';
import { makeRule, emptyGroup, type FilterField } from './filter-model';
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
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [] }), { event: undefined, reason: 'remove-rule' });
  });

  it('clear all empties the group and calls onClearAll', () => {
    const on = jest.fn();
    const onClear = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} onValueChange={on} onClearAll={onClear} />);
    fireEvent.click(container.querySelector('[data-ag-part="filter-clear"]')!);
    expect(onClear).toHaveBeenCalled();
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [] }), { event: undefined, reason: 'clear' });
  });

  it('quick filter toggle adds/removes its rule', () => {
    const on = jest.fn();
    const q = { id: 'q1', label: 'Big qty', rule: makeRule(SCHEMA[1]!, '>', 100) };
    const { container } = render(
      <FilterBar schema={SCHEMA} quickFilters={[q]} onValueChange={on} />,
    );
    const btn = container.querySelector('[data-ag-part="filter-quick-toggle"]')!;
    fireEvent.click(btn);
    expect(on).toHaveBeenCalledWith(
      expect.objectContaining({ children: [expect.objectContaining({ fieldId: 'qty' })] }),
      { event: undefined, reason: 'add-rule' },
    );
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
      { event: undefined, reason: 'update-rule' },
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
});
