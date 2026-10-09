import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Combobox } from '../../src/components/combobox';
import { AuraGlassProvider } from '../../src/theme';

const ITEMS = ['Alpha', 'Beta', 'Gamma'];

function Demo(props: Record<string, unknown>) {
  return (
    <Combobox.Root items={ITEMS} {...props}>
      <Combobox.Input placeholder="q" />
      <Combobox.Content>
        <Combobox.Empty />
        {ITEMS.map((v) => (
          <Combobox.Item key={v} value={v}>
            {v}
          </Combobox.Item>
        ))}
      </Combobox.Content>
    </Combobox.Root>
  );
}

async function openList() {
  const input = screen.getByRole('combobox') as HTMLInputElement;
  input.focus();
  await userEvent.keyboard('{ArrowDown}');
  await act(async () => {});
  return input;
}

describe('Combobox async (CMP-181/186)', () => {
  it('loading sets aria-busy on the list and announces once', async () => {
    render(
      <AuraGlassProvider>
        <Demo loading />
      </AuraGlassProvider>,
    );
    await openList();
    const list = document.querySelector('[data-ag-part="list"]');
    expect(list).toHaveAttribute('aria-busy', 'true');
    const polite = document.querySelector('[data-ag-announcer] [aria-live="polite"]');
    expect(polite?.textContent ?? '').toContain('Loading');
  });

  it('loadOptions is debounced and aborts the previous in-flight call', async () => {
    const signals: AbortSignal[] = [];
    const loadOptions = jest.fn((q: string, ctx: { signal: AbortSignal }) => {
      signals.push(ctx.signal);
      return Promise.resolve(['A1']);
    });
    render(<Demo loadOptions={loadOptions} loadDebounceMs={50} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: 'x' } });
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1), { timeout: 500 });
    fireEvent.change(input, { target: { value: 'xy' } });
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(2), { timeout: 500 });
    expect(signals[0]!.aborted).toBe(true);
    expect(signals[1]!.aborted).toBe(false);
  });

  it('rejected loadOptions shows the load-error Empty and keeps the query', async () => {
    const loadOptions = jest.fn(() => Promise.reject(new Error('boom')));
    render(<Demo loadOptions={loadOptions} loadDebounceMs={30} />);
    const input = await openList();
    fireEvent.change(input, { target: { value: 'zzz' } });
    await waitFor(() => expect(loadOptions).toHaveBeenCalled(), { timeout: 500 });
    await waitFor(() => {
      const empty = document.querySelector('[data-ag-part="empty"]');
      expect(empty).toBeTruthy();
      expect(empty?.textContent ?? '').toContain("Couldn't load results");
    });
    expect(input.value).toBe('zzz');
  });

  it('aborted results never render: stale slower response loses to the newer query', async () => {
    let resolveFirst: ((v: string[]) => void) | undefined;
    const loadOptions = jest.fn((_q: string, ctx: { signal: AbortSignal }) => {
      if (loadOptions.mock.calls.length === 1) {
        return new Promise<string[]>((res) => {
          resolveFirst = res;
        });
      }
      return Promise.resolve(['NEW']);
    });
    render(<Demo loadOptions={loadOptions} loadDebounceMs={20} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: 'a' } });
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1), { timeout: 500 });
    fireEvent.change(input, { target: { value: 'ab' } });
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(2), { timeout: 500 });
    await act(async () => {
      resolveFirst?.(['STALE']);
    });
    await act(async () => {});
    await openList();
    const texts = [...document.querySelectorAll('[data-ag-part="item"]')].map((e) => e.textContent);
    expect(texts.join('|')).not.toContain('STALE');
  });

  it('REQ-CMP-73 (a): autocomplete mode calls onValueChange with the typed string', async () => {
    const onValueChange = jest.fn();
    render(<Demo mode="autocomplete" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: 'foo' } });
    await act(async () => {});
    const last = onValueChange.mock.calls.at(-1)?.[0];
    expect(last).toBe('foo');
  });

  it('REQ-CMP-73 (b): default loadDebounceMs is 250 ms — nothing fires before it', async () => {
    jest.useFakeTimers();
    try {
      const loadOptions = jest.fn(() => Promise.resolve(['A1']));
      render(<Demo loadOptions={loadOptions} />);
      const input = screen.getByRole('combobox') as HTMLInputElement;
      input.focus();
      fireEvent.change(input, { target: { value: 'x' } });
      act(() => jest.advanceTimersByTime(249));
      expect(loadOptions).not.toHaveBeenCalled();
      act(() => jest.advanceTimersByTime(2));
      expect(loadOptions).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it('REQ-CMP-73 (c): loading is true while the loadOptions promise is pending', async () => {
    let resolve: ((v: string[]) => void) | undefined;
    const loadOptions = jest.fn(
      () =>
        new Promise<string[]>((r) => {
          resolve = r;
        }),
    );
    render(
      <AuraGlassProvider>
        <Demo loadOptions={loadOptions} loadDebounceMs={10} />
      </AuraGlassProvider>,
    );
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: 'x' } });
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1), { timeout: 500 });
    await act(async () => {});
    /* loading is true while the promise is pending: the inline loading part
       mounts inside the input shell (jsdom can't mount the portal popup here) */
    expect(document.querySelector('[data-ag-part="loading"]')).toBeTruthy();
    await act(async () => {
      resolve?.(['Done']);
    });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="loading"]')).toBeNull();
  });

  it('more than 200 items mounts the virtual list with bounded DOM rows', async () => {
    const big = Array.from({ length: 500 }, (_, i) => `Row ${i}`);
    const origH = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get(this: Element) {
        return this.classList?.contains('ag-combobox-vscroll') ? 288 : 0;
      },
    });
    render(
      <AuraGlassProvider>
        <Combobox.Root items={big} defaultOpen>
          <Combobox.Input placeholder="big" />
          <Combobox.Content>
            {(item: string) => (
              <Combobox.Item value={item}>{item}</Combobox.Item>
            )}
          </Combobox.Content>
        </Combobox.Root>
      </AuraGlassProvider>,
    );
    await waitFor(() => expect(document.querySelectorAll('[data-ag-part="item"]').length).toBeGreaterThan(0));
    const rows = document.querySelectorAll('[data-ag-part="item"]');
    expect(rows.length).toBeLessThanOrEqual(60);
    const sized = document.querySelector('[aria-setsize]');
    expect(sized?.getAttribute('aria-setsize')).toBe('500');
    expect(document.querySelector('[aria-posinset]')?.getAttribute('aria-posinset')).toBe('1');
    if (origH) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', origH);
  });
});
