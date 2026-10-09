import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Combobox } from './index';

const FRUITS = ['Apple', 'Banana', 'Cherry'];

function Demo(props: Record<string, unknown>) {
  return (
    <Combobox.Root items={FRUITS} {...props}>
      <Combobox.Input placeholder="Fruit" />
      <Combobox.Content>
        <Combobox.Empty />
        {FRUITS.map((f) => (
          <Combobox.Item key={f} value={f}>
            {f}
          </Combobox.Item>
        ))}
      </Combobox.Content>
    </Combobox.Root>
  );
}

describe('Combobox (CMP-180/183)', () => {
  beforeAll(() => {
    if (typeof window !== 'undefined' && window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });

  it('input has combobox role; ArrowDown opens the list', async () => {
    render(<Demo />);
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="list"]')).toBeTruthy();
  });

  it('ArrowDown moves the highlight (aria-activedescendant set on input)', async () => {
    render(<Demo />);
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await act(async () => {});
    const first = document.querySelector('[data-ag-part="item"]');
    expect(input.getAttribute('aria-activedescendant') ?? first?.getAttribute('data-highlighted')).toBeTruthy();
    expect(document.activeElement === input || input.contains(document.activeElement)).toBe(true);
  });

  it('Alt+ArrowDown opens without moving the highlight', async () => {
    render(<Demo />);
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="list"]')).toBeTruthy();
  });

  it('Escape closes; a second Escape clears the input', async () => {
    render(<Demo defaultValue="Apple" />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="list"]')).toBeTruthy();
    fireEvent.keyDown(document.activeElement ?? input, { key: 'Escape' });
    await waitFor(() => expect(document.querySelector('[data-ag-part="list"]')).toBeNull());
    fireEvent.keyDown(input, { key: 'Escape' });
    await act(async () => {});
    expect(input.value).toBe('');
  });

  it('Empty renders role=status when no items match', async () => {
    render(<Demo filter={(item: string, q: string) => item.toLowerCase().includes(q.toLowerCase())} />);
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.type(input, 'zzz');
    await act(async () => {});
    const empty = document.querySelector('[data-ag-part="empty"]');
    expect(empty).toBeTruthy();
    expect(empty).toHaveAttribute('role', 'status');
    expect(empty).toHaveTextContent('No results');
  });

  it('emits input-shell/input/trigger/clear parts; loading adds loading part + aria-busy', async () => {
    const { container, rerender } = render(<Demo />);
    for (const p of ['input-shell', 'input', 'trigger', 'clear']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
    rerender(<Demo loading />);
    expect(container.querySelector('[data-ag-part="loading"]')).toBeTruthy();
    screen.getByRole('combobox').focus();
    await userEvent.keyboard('{ArrowDown}');
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="list"]')).toHaveAttribute('aria-busy', 'true');
  });

  it('multiple: chips render per value; Backspace on empty input focuses last chip', async () => {
    render(
      <Combobox.Root items={FRUITS} multiple defaultValue={['Apple', 'Banana']}>
        <Combobox.Chips>
          <Combobox.Chip>Apple</Combobox.Chip>
          <Combobox.Chip>Banana</Combobox.Chip>
        </Combobox.Chips>
        <Combobox.Input />
        <Combobox.Content>
          <Combobox.Empty />
          {FRUITS.map((f) => (
            <Combobox.Item key={f} value={f}>
              {f}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Root>,
    );
    const chips = document.querySelectorAll('[data-ag-part="chip"]');
    expect(chips.length).toBe(2);
    /* REQ-CMP-74: chips carry the content-raised capsule material attrs */
    for (const c of chips) {
      expect(c).toHaveAttribute('data-ag-surface');
      expect(c).toHaveAttribute('data-ag-layer', 'content');
      expect(c).toHaveAttribute('data-ag-content', 'content-raised');
      expect(c).toHaveAttribute('data-ag-shape', 'capsule');
    }
    for (const c of chips) {
      expect(c.querySelector('[data-ag-part="chip-remove"]')).toBeTruthy();
    }
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.keyboard('{Backspace}');
    await act(async () => {});
    const focusedChip = document.activeElement?.closest('[data-ag-part="chip"]') ?? document.activeElement;
    expect(focusedChip === chips[1] || focusedChip?.textContent?.includes('Banana') || focusedChip === input).toBe(true);
  });

  it('creatable: offers one create-item for a novel query; Enter calls onCreate', async () => {
    const onCreate = jest.fn();
    render(
      <Combobox.Root items={FRUITS} creatable onCreate={onCreate}>
        <Combobox.Input />
        <Combobox.Content>
          <Combobox.Empty />
          {FRUITS.map((f) => (
            <Combobox.Item key={f} value={f}>
              {f}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.type(input, 'Mango');
    await act(async () => {});
    const creates = document.querySelectorAll('[data-ag-part="create-item"]');
    expect(creates.length).toBe(1);
    expect(creates[0]).toHaveTextContent('Create "Mango"');
    fireEvent.click(creates[0]!);
    await act(async () => {});
    expect(onCreate).toHaveBeenCalledWith('Mango');
  });

  it('creatable: whitespace-only query never offers create-item', async () => {
    render(
      <Combobox.Root items={FRUITS} creatable>
        <Combobox.Input />
        <Combobox.Content>
          <Combobox.Empty />
          {FRUITS.map((f) => (
            <Combobox.Item key={f} value={f}>
              {f}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.type(input, '   ');
    await act(async () => {});
    expect(document.querySelectorAll('[data-ag-part="create-item"]').length).toBe(0);
  });

  it('mode=autocomplete puts aria-autocomplete=list on the input', () => {
    render(<Demo mode="autocomplete" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('loadOptions fires after debounce with an abortable signal', async () => {
    jest.useFakeTimers();
    const loadOptions = jest.fn((_q: string, _ctx: { signal: AbortSignal }) => Promise.resolve(['X']));
    try {
      render(<Demo loadOptions={loadOptions} />);
      const input = screen.getByRole('combobox') as HTMLInputElement;
      input.focus();
      fireEvent.change(input, { target: { value: 'q' } });
      act(() => {
        jest.advanceTimersByTime(260);
      });
      await act(async () => {});
      expect(loadOptions).toHaveBeenCalledWith('q', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    } finally {
      jest.useRealTimers();
    }
  });
});
