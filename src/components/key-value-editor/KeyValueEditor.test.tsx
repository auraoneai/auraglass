/* CMP-048: KeyValueEditor — add/remove rows of Field key/value inputs,
   'Remove row {key}' names, duplicate keys → invalid + Field.Error. */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/jest-globals';
import { KeyValueEditor } from './KeyValueEditor.client';

describe('KeyValueEditor', () => {
  it('renders rows of key/value inputs with the contracted parts', () => {
    const { container } = render(
      <KeyValueEditor value={[{ key: 'host', value: 'a' }]} onValueChange={() => {}} />,
    );
    expect(container.querySelector('[data-ag-part="root"]')).toBeTruthy();
    expect(container.querySelector('[data-ag-part="list"]')).toBeTruthy();
    expect(container.querySelector('[data-ag-part="item"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-ag-part="input"]')).toHaveLength(2);
    expect(container.querySelector('[data-ag-part="actions"]')).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Key-value editor' })).toBeInTheDocument();
  });

  it('add appends an empty row and emits the next pairs array', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <KeyValueEditor value={[{ key: 'host', value: 'a' }]} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Add row' }));
    expect(onValueChange).toHaveBeenCalledWith([
      { key: 'host', value: 'a' },
      { key: '', value: '' },
    ]);
  });

  it('remove buttons are named Remove row {key} and emit without the row', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <KeyValueEditor
        value={[
          { key: 'host', value: 'a' },
          { key: 'port', value: '443' },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Remove row port' }));
    expect(onValueChange).toHaveBeenCalledWith([{ key: 'host', value: 'a' }]);
    // Empty keys fall back to the row number.
    render(
      <KeyValueEditor
        value={[
          { key: 'host', value: 'a' },
          { key: '', value: '' },
        ]}
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Remove row 2' })).toBeInTheDocument();
  });

  it('editing an input emits the updated pair', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <KeyValueEditor value={[{ key: 'host', value: 'a' }]} onValueChange={onValueChange} />,
    );
    const keyInput = screen.getByLabelText('Key for row 1');
    await user.type(keyInput, 'x');
    expect(onValueChange).toHaveBeenLastCalledWith([{ key: 'hostx', value: 'a' }]);
  });

  it('duplicate keys mark the row invalid and render a Field.Error', () => {
    render(
      <KeyValueEditor
        value={[
          { key: 'host', value: 'a' },
          { key: 'host', value: 'b' },
          { key: 'port', value: '443' },
        ]}
        onValueChange={() => {}}
      />,
    );
    expect(screen.getAllByText('Duplicate key')).toHaveLength(2);
    // Both duplicated rows' inputs are aria-invalid.
    expect(screen.getByLabelText('Key for row 1')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Key for row 2')).toHaveAttribute('aria-invalid', 'true');
    // A non-duplicated row is untouched.
    expect(screen.getByLabelText('Key for row 3')).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('uncontrolled defaultValue grows and shrinks locally', async () => {
    const user = userEvent.setup();
    render(<KeyValueEditor defaultValue={[{ key: 'a', value: '1' }]} />);
    await user.click(screen.getByRole('button', { name: 'Add row' }));
    expect(screen.getByLabelText('Key for row 2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove row 2' }));
    expect(screen.queryByLabelText('Key for row 2')).not.toBeInTheDocument();
  });
});
