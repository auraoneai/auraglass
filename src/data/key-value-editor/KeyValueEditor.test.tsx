/** @jest-environment jsdom */
// SURF-264 / REQ-SURF-89: add/remove rows, duplicate-key validation through
// CMP TextField (Field invalid + Field.Error via aria-describedby), Enter adds
// a row and focuses its key field, stable row identity on remove.
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { KeyValueEditor } from './KeyValueEditor';

const keyInputs = (c: HTMLElement) =>
  [...c.querySelectorAll<HTMLInputElement>('[data-ag-part="key-input"] input')];
const valueInputs = (c: HTMLElement) =>
  [...c.querySelectorAll<HTMLInputElement>('[data-ag-part="value-input"] input')];

describe('KeyValueEditor (SURF-261, REQ-SURF-89)', () => {
  it('uncontrolled: edit, add, remove rows', () => {
    const on = jest.fn();
    const { container } = render(<KeyValueEditor defaultValue={[{ key: 'a', value: '1' }]} onValueChange={on} />);
    fireEvent.change(keyInputs(container)[0]!, { target: { value: 'b' } });
    expect(on).toHaveBeenLastCalledWith([{ key: 'b', value: '1' }]);
    fireEvent.click(container.querySelector('[data-ag-part="key-value-add"]')!);
    expect(on).toHaveBeenLastCalledWith([{ key: 'b', value: '1' }, { key: '', value: '' }]);
    const rm = container.querySelectorAll('[data-ag-part="key-value-remove"]')[1]!;
    fireEvent.click(rm);
    expect(on).toHaveBeenLastCalledWith([{ key: 'b', value: '1' }]);
  });

  it('key and value fields are CMP TextField controls', () => {
    const { container } = render(<KeyValueEditor defaultValue={[{ key: 'a', value: '1' }]} />);
    for (const input of [...keyInputs(container), ...valueInputs(container)]) {
      expect(input.closest('.ag-text-field')).not.toBeNull();
      expect(input.getAttribute('data-ag-part')).toBe('control');
    }
  });

  it('duplicate keys: Field invalid, aria-invalid and the error is aria-describedby-linked', () => {
    const { container } = render(
      <KeyValueEditor defaultValue={[{ key: 'k', value: '1' }, { key: 'k', value: '2' }, { key: 'z', value: '3' }]} />,
    );
    const keys = keyInputs(container);
    for (const input of keys.slice(0, 2)) {
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.closest('.ag-text-field')!.hasAttribute('data-invalid')).toBe(true);
      const describedBy = input.getAttribute('aria-describedby') ?? '';
      const errors = describedBy
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el?.getAttribute('data-ag-part') === 'error');
      expect(errors).toHaveLength(1);
      expect(errors[0]!.textContent).toBe('Duplicate key: k');
    }
    expect(keys[2]!.hasAttribute('aria-invalid')).toBe(false);
    expect(keys[2]!.closest('[data-ag-part="key-value-row"]')!.querySelector('[data-ag-part="error"]')).toBeNull();
  });

  it('Enter in the last value input appends a row and focuses its key field', () => {
    const on = jest.fn();
    const { container } = render(<KeyValueEditor defaultValue={[{ key: 'a', value: '1' }]} onValueChange={on} />);
    const lastValue = valueInputs(container)[0]!;
    act(() => lastValue.focus());
    fireEvent.keyDown(lastValue, { key: 'Enter' });
    expect(on).toHaveBeenLastCalledWith([{ key: 'a', value: '1' }, { key: '', value: '' }]);
    const keys = keyInputs(container);
    expect(keys).toHaveLength(2);
    expect(document.activeElement).toBe(keys[1]);
  });

  it('Enter in a non-last value input does not add a row', () => {
    const on = jest.fn();
    const { container } = render(
      <KeyValueEditor defaultValue={[{ key: 'a', value: '1' }, { key: 'b', value: '2' }]} onValueChange={on} />,
    );
    fireEvent.keyDown(valueInputs(container)[0]!, { key: 'Enter' });
    expect(on).not.toHaveBeenCalled();
    expect(keyInputs(container)).toHaveLength(2);
  });

  it('removing a middle row keeps the other rows’ DOM nodes, values and focus target', () => {
    const { container } = render(
      <KeyValueEditor defaultValue={[{ key: 'a', value: '1' }, { key: 'b', value: '2' }, { key: 'c', value: '3' }]} />,
    );
    const [firstKey, , thirdKey] = keyInputs(container);
    const thirdRemove = container.querySelectorAll<HTMLButtonElement>('[data-ag-part="key-value-remove"]')[2]!;
    const middleRemove = container.querySelectorAll<HTMLButtonElement>('[data-ag-part="key-value-remove"]')[1]!;
    act(() => middleRemove.focus());
    act(() => {
      middleRemove.click();
    });
    const keys = keyInputs(container);
    expect(keys).toHaveLength(2);
    // Same DOM nodes (stable row ids, not index keys) with their own values.
    expect(keys[0]).toBe(firstKey);
    expect(keys[1]).toBe(thirdKey);
    expect(keys.map((k) => k.value)).toEqual(['a', 'c']);
    expect(valueInputs(container).map((v) => v.value)).toEqual(['1', '3']);
    // Focus moves to the remove button of the row that took the removed row's place.
    expect(document.activeElement).toBe(thirdRemove);
    expect(thirdRemove.getAttribute('aria-label')).toBe('Remove c');
  });

  it('removing the last remaining row moves focus to the add button', () => {
    const { container } = render(<KeyValueEditor defaultValue={[{ key: 'a', value: '1' }]} />);
    act(() => {
      container.querySelector<HTMLButtonElement>('[data-ag-part="key-value-remove"]')!.click();
    });
    expect(keyInputs(container)).toHaveLength(0);
    expect(document.activeElement).toBe(container.querySelector('[data-ag-part="key-value-add"]'));
  });

  it('controlled: value prop is source of truth', () => {
    const { container } = render(<KeyValueEditor value={[{ key: 'x', value: '9' }]} />);
    expect(keyInputs(container)[0]!.value).toBe('x');
  });
});
