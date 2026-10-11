/** @jest-environment jsdom */
// SURF-197 / REQ-SURF-87: chips (CMP IconButton remove, CMP Popover editor
// with focus in/out), add-filter, quick filters (CMP ToggleGroup,
// aria-pressed), CMP SearchField, "{n} results" via the MAT announcer seam,
// "Filters (n)" CMP Sheet (side=bottom), and the FilterBar.useModel statics.
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import * as React from 'react';
import { FilterBar } from './FilterBar';
import { DEFAULT_OPERATORS, makeRule, emptyGroup, type FilterField, type FilterGroup, type FilterRule } from './filter-model';
import { applyModel } from './filter-model-ops';

// jsdom lacks PointerEvent; Base UI dispatches it on activation.
if (typeof window.PointerEvent !== 'function') {
  (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
}

// "{n} results" flows through the MAT useAnnouncer seam — mock it once per
// file and assert the calls.
const announceCalls: string[] = [];
jest.mock('../../theme', () => {
  const actual = jest.requireActual<typeof import('../../theme')>('../../theme');
  return {
    ...actual,
    useAnnouncer: () => ({ announce: (m: string) => announceCalls.push(m) }),
  };
});

const SCHEMA: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'qty', label: 'Qty', type: 'number' },
];

const base = applyModel(emptyGroup(), (m) => m.addRule(makeRule(SCHEMA[0]!, 'contains', 'abc')));

/** Let Base UI open/close and run its focus management (rAF/timeouts). */
const settle = async () => {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 50));
  });
};
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');
const chipTrigger = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-ag-part="filter-rules"] .ag-filter-bar__chip-label')!;
const lastRoot = (on: jest.Mock): FilterGroup => on.mock.calls.at(-1)![0] as FilterGroup;

beforeEach(() => {
  announceCalls.length = 0;
});
afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('FilterBar (SURF-196, REQ-SURF-87)', () => {
  it('renders each rule as a chip whose CMP IconButton remove is named "Remove filter {field} {operator} {value}"', () => {
    const on = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} onValueChange={on} />);
    const chip = container.querySelector('[data-ag-part="filter-rules"] [data-ag-part="filter-rule-chip"]')!;
    expect(chip.textContent).toContain('Name contains abc');
    const remove = screen.getByRole('button', { name: 'Remove filter Name contains abc' });
    expect(remove.classList.contains('ag-icon-button')).toBe(true);
    fireEvent.click(remove);
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [] }));
  });

  it('removing a chip moves focus to the next chip, then the previous, then add-filter', () => {
    const three = applyModel(base, (m) => {
      m.addRule(makeRule(SCHEMA[1]!, '>', 1));
      m.addRule(makeRule(SCHEMA[1]!, '<', 9));
    });
    render(<FilterBar schema={SCHEMA} defaultValue={three} />);
    const remove = (name: string) => {
      const b = screen.getByRole('button', { name });
      b.focus();
      fireEvent.click(b);
    };
    remove('Remove filter Qty > 1');
    expect(document.activeElement!.textContent).toBe('Qty < 9');
    remove('Remove filter Qty < 9');
    expect(document.activeElement!.textContent).toBe('Name contains abc');
    remove('Remove filter Name contains abc');
    expect(document.activeElement).toBe(screen.getByRole('combobox', { name: 'Add filter' }));
  });

  it('clear all empties the group and calls onClearAll', () => {
    const on = jest.fn();
    const onClear = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} onValueChange={on} onClearAll={onClear} />);
    fireEvent.click(container.querySelector('[data-ag-part="filter-clear"]')!);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(on).toHaveBeenCalledWith(expect.objectContaining({ children: [] }));
  });

  it('quick filters are a CMP ToggleGroup: aria-pressed follows the rule, clicking toggles it', () => {
    const on = jest.fn();
    const q = { id: 'q1', label: 'Big qty', rule: makeRule(SCHEMA[1]!, '>', 100) };
    render(<FilterBar schema={SCHEMA} quickFilters={[q]} onValueChange={on} />);
    const btn = screen.getByRole('button', { name: 'Big qty' });
    expect(btn.closest('.ag-toggle-group')).not.toBeNull();
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(btn);
    expect(lastRoot(on).children).toEqual([expect.objectContaining({ fieldId: 'qty', operator: '>', value: 100 })]);
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(btn);
    expect(lastRoot(on).children).toEqual([]);
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('search uses CMP SearchField and forwards the typed value', () => {
    const onSearch = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} search={{ value: '', onValueChange: onSearch, placeholder: 'Search orders' }} />);
    const input = screen.getByRole('searchbox', { name: 'Search orders' });
    expect(container.querySelector('[data-ag-part="filter-search"] .ag-search-field')).not.toBeNull();
    fireEvent.change(input, { target: { value: 'acme' } });
    expect(onSearch).toHaveBeenCalledWith('acme');
  });

  it('"{n} results": announced politely through the announcer once per change, not on mount', () => {
    const { container, rerender } = render(<FilterBar schema={SCHEMA} resultCount={42} />);
    expect(container.querySelector('[data-ag-part="filter-count"]')!.textContent).toBe('42 results');
    expect(announceCalls).toEqual([]);
    rerender(<FilterBar schema={SCHEMA} resultCount={7} />);
    expect(announceCalls).toEqual(['7 results']);
    rerender(<FilterBar schema={SCHEMA} resultCount={7} />);
    expect(announceCalls).toEqual(['7 results']);
    rerender(<FilterBar schema={SCHEMA} resultCount={0} labels={{ results: '{n} rows' }} />);
    expect(announceCalls).toEqual(['7 results', '0 rows']);
  });

  it('editing opens a CMP Popover dialog focused on its first field; Escape closes it and focus returns to the chip', async () => {
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} />);
    const trigger = chipTrigger(container);
    fireEvent.click(trigger);
    await settle();
    const dlg = dialog();
    expect(dlg).not.toBeNull();
    expect(dlg!.classList.contains('ag-popover-popup')).toBe(true);
    const first = dlg!.querySelector('select')!;
    expect(screen.getByLabelText('Operator')).toBe(first);
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: 'Escape' });
    await settle();
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('Apply commits the typed value once, closes the editor and returns focus to the chip', async () => {
    const on = jest.fn();
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} onValueChange={on} />);
    const trigger = chipTrigger(container);
    fireEvent.click(trigger);
    await settle();
    fireEvent.change(screen.getByLabelText('Value'), { target: { value: 'xyz' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await settle();
    expect(on).toHaveBeenCalledTimes(1);
    expect(lastRoot(on).children).toEqual([expect.objectContaining({ fieldId: 'name', operator: 'contains', value: 'xyz' })]);
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('number "between" edits to a numeric {start,end} range; is-empty drops the value', async () => {
    const on = jest.fn();
    const qty = applyModel(emptyGroup(), (m) => m.addRule(makeRule(SCHEMA[1]!, '=', 3)));
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={qty} onValueChange={on} />);
    fireEvent.click(chipTrigger(container));
    await settle();
    fireEvent.change(screen.getByLabelText('Operator'), { target: { value: 'between' } });
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await settle();
    expect((lastRoot(on).children[0] as FilterRule).value).toStrictEqual({ start: 1, end: 2 });
    expect(container.querySelector('[data-ag-part="filter-rules"]')!.textContent).toContain('Qty between 1–2');

    const name = applyModel(emptyGroup(), (m) => m.addRule(makeRule(SCHEMA[0]!, 'contains', 'x')));
    cleanup();
    const on2 = jest.fn();
    const r2 = render(<FilterBar schema={SCHEMA} defaultValue={name} onValueChange={on2} />);
    fireEvent.click(chipTrigger(r2.container));
    await settle();
    fireEvent.change(screen.getByLabelText('Operator'), { target: { value: 'is-empty' } });
    expect(screen.queryByLabelText('Value')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await settle();
    const rule = lastRoot(on2).children[0] as FilterRule;
    expect(rule.operator).toBe('is-empty');
    expect(rule.value).toBeUndefined();
  });

  describe('add-filter', () => {
    const ALL: FilterField[] = [
      { id: 't', label: 'Text', type: 'text' },
      { id: 'n', label: 'Num', type: 'number' },
      { id: 'd', label: 'Date', type: 'date' },
      { id: 'dr', label: 'Range', type: 'date-range' },
      { id: 'e', label: 'Enum', type: 'enum', options: [{ value: 'open', label: 'Open' }] },
      { id: 'm', label: 'Multi', type: 'multi-enum', options: [{ value: 'a', label: 'A' }] },
      { id: 'b', label: 'Bool', type: 'boolean' },
    ];

    it('has a placeholder option, so the first field can be chosen', () => {
      const on = jest.fn();
      render(<FilterBar schema={ALL} onValueChange={on} />);
      const add = screen.getByRole('combobox', { name: 'Add filter' }) as HTMLSelectElement;
      expect(add.value).toBe('');
      expect(add.options[0]!.value).toBe('');
      expect(add.options[0]!.disabled).toBe(true);
      fireEvent.change(add, { target: { value: 't' } });
      expect(lastRoot(on).children).toEqual([expect.objectContaining({ fieldId: 't', operator: 'contains' })]);
      expect(add.value).toBe('');
    });

    it.each(ALL.map((f) => [f.type, f] as const))('%s: creates a rule with the first valid operator and opens its editor', async (_t, field) => {
      const on = jest.fn();
      render(<FilterBar schema={ALL} onValueChange={on} />);
      fireEvent.change(screen.getByRole('combobox', { name: 'Add filter' }), { target: { value: field.id } });
      const rule = lastRoot(on).children[0] as FilterRule;
      expect(rule.fieldId).toBe(field.id);
      expect(rule.operator).toBe(DEFAULT_OPERATORS[field.type][0]);
      expect(DEFAULT_OPERATORS[field.type]).toContain(rule.operator);
      await settle();
      expect(dialog()).not.toBeNull();
      expect(document.activeElement).toBe(screen.getByLabelText('Operator'));
    });

    it('honours a field-level operators override', () => {
      const on = jest.fn();
      render(<FilterBar schema={[{ id: 'n', label: 'Num', type: 'number', operators: ['>='] }]} onValueChange={on} />);
      fireEvent.change(screen.getByRole('combobox', { name: 'Add filter' }), { target: { value: 'n' } });
      expect((lastRoot(on).children[0] as FilterRule).operator).toBe('>=');
    });
  });

  it('"Filters (n)" is a CMP Sheet trigger opening a bottom sheet with the chips', async () => {
    const two = applyModel(base, (m) => m.addRule(makeRule(SCHEMA[1]!, '>', 5)));
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={two} />);
    const trigger = container.querySelector<HTMLElement>('[data-ag-part="filter-collapsed"]')!;
    expect(trigger.textContent).toBe('Filters (2)');
    fireEvent.click(trigger);
    await settle();
    const sheet = document.querySelector<HTMLElement>('.ag-filter-bar__sheet')!;
    expect(sheet).not.toBeNull();
    expect(sheet.getAttribute('data-ag-side')).toBe('bottom');
    expect(sheet.querySelectorAll('[data-ag-part="filter-rule-chip"]')).toHaveLength(2);
    fireEvent.keyDown(sheet, { key: 'Escape' });
    await settle();
    expect(document.querySelector('.ag-filter-bar__sheet')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('"+n more" stays hidden while nothing is clamped', () => {
    const { container } = render(<FilterBar schema={SCHEMA} defaultValue={base} />);
    const more = container.querySelector<HTMLButtonElement>('[data-ag-part="filter-more"]')!;
    expect(more.hidden).toBe(true);
    expect(container.querySelector('[data-ag-clamped]')).toBeNull();
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
});
