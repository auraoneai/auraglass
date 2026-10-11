/** @jest-environment jsdom */
// SURF-264: add/remove rows, duplicate-key validation, Enter adds a row.
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { KeyValueEditor } from './KeyValueEditor';

describe('KeyValueEditor (SURF-261, REQ-SURF-89)', () => {
  it('uncontrolled: edit, add, remove rows', () => {
    const on = jest.fn();
    const { container } = render(<KeyValueEditor defaultValue={[{ key: 'a', value: '1' }]} onValueChange={on} />);
    fireEvent.change(container.querySelector('[data-ag-part="key-input"]')!, { target: { value: 'b' } });
    expect(on).toHaveBeenLastCalledWith([{ key: 'b', value: '1' }], expect.objectContaining({ reason: 'edit', event: expect.any(Event) }));
    fireEvent.click(container.querySelector('[data-ag-part="key-value-add"]')!);
    expect(on).toHaveBeenLastCalledWith([{ key: 'b', value: '1' }, { key: '', value: '' }], expect.objectContaining({ reason: 'add', event: expect.any(Event) }));
    const rm = container.querySelectorAll('[data-ag-part="key-value-remove"]')[1]!;
    fireEvent.click(rm);
    expect(on).toHaveBeenLastCalledWith([{ key: 'b', value: '1' }], expect.objectContaining({ reason: 'remove', event: expect.any(Event) }));
  });

  it('duplicate keys mark aria-invalid + error text', () => {
    const { container } = render(
      <KeyValueEditor defaultValue={[{ key: 'k', value: '1' }, { key: 'k', value: '2' }]} />,
    );
    expect(container.querySelectorAll('[aria-invalid="true"]').length).toBe(2);
    expect(container.querySelector('[role="alert"]')!.textContent).toContain('Duplicate key');
  });

  it('Enter in the last value input appends a row', () => {
    const on = jest.fn();
    const { container } = render(<KeyValueEditor defaultValue={[{ key: 'a', value: '1' }]} onValueChange={on} />);
    const lastValue = container.querySelector('[data-ag-part="value-input"]')!;
    fireEvent.keyDown(lastValue, { key: 'Enter' });
    expect(on).toHaveBeenLastCalledWith([{ key: 'a', value: '1' }, { key: '', value: '' }], expect.objectContaining({ reason: 'add', event: expect.any(KeyboardEvent) }));
  });

  it('controlled: value prop is source of truth', () => {
    const { container } = render(<KeyValueEditor value={[{ key: 'x', value: '9' }]} />);
    expect((container.querySelector('[data-ag-part="key-input"]') as HTMLInputElement).value).toBe('x');
  });
});
