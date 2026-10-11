import { describe, expect, it, beforeAll } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { AuraGlassProvider } from '../../theme';
import { Select } from './index';

function Demo({ provider, ...root }: { provider?: boolean } & Record<string, unknown>) {
  const sel = (
    <Select.Root {...root}>
      <Select.Trigger placeholder="Pick a fruit" />
      <Select.Content>
        <Select.Item value="apple" label="Apple" />
        <Select.Item value="banana" label="Banana" />
        <Select.Item value="cherry" label="Cherry" />
      </Select.Content>
    </Select.Root>
  );
  return provider ? <AuraGlassProvider>{sel}</AuraGlassProvider> : sel;
}

describe('Select (CMP-175/178)', () => {
  beforeAll(() => {
    if (typeof window !== 'undefined' && window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });

  it('trigger has role combobox; closed by default', () => {
    render(<Demo />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it.each(['{Enter}', '{ }', '{ArrowDown}', '{ArrowUp}'])('%s on the trigger opens the listbox', async (key) => {
    render(<Demo />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await userEvent.keyboard(key);
    expect(document.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it('typeahead focuses item by label; Escape closes and refocuses trigger', async () => {
    render(<Demo />);
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    await act(async () => {});
    const listbox = document.querySelector('[role="listbox"]')!;
    await userEvent.keyboard('b');
    const banana = Array.from(document.querySelectorAll('[data-ag-part="item"]')).find(
      (el) => el.textContent === 'Banana',
    )!;
    await act(async () => {});
    expect(banana).toHaveAttribute('data-highlighted');
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    await waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeNull());
    expect(document.activeElement).toBe(trigger);
    void listbox;
  });

  it('Tab closes the popup and moves focus out', async () => {
    render(
      <>
        <Demo />
        <button>after</button>
      </>,
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    await act(async () => {});
    expect(document.querySelector('[role="listbox"]')).toBeTruthy();
    await userEvent.tab();
    await act(async () => {});
    await waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeNull());
  });

  it('popup sits inside the provider [data-ag-portal-root]', async () => {
    render(<Demo provider />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await act(async () => {});
    const root = document.querySelector('[data-ag-portal-root]');
    expect(root).not.toBeNull();
    for (const part of ['positioner', 'popup', 'list', 'item'] as const) {
      const el = document.querySelector(`[data-ag-part="${part}"]`);
      expect(el).toBeTruthy();
      expect(el!.closest('[data-ag-portal-root]')).toBe(root);
    }
  });

  it('items map provides Value labels before popup mount', () => {
    render(
      <Select.Root defaultValue="banana" items={{ apple: 'Apple', banana: 'Banana' }}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="apple" label="Apple" />
          <Select.Item value="banana" label="Banana" />
        </Select.Content>
      </Select.Root>,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('emits trigger/value/icon parts; hidden input carries name', () => {
    const { container } = render(<Demo name="fruit" />);
    for (const p of ['trigger', 'value', 'icon']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
    expect(container.querySelector('input[name="fruit"]')).toBeTruthy();
  });
});
