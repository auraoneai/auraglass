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

  it('more than 200 items mounts the virtual list with bounded DOM rows', async () => {
    const big = Array.from({ length: 500 }, (_, i) => `Row ${i}`);
    const origH = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get(this: Element) {
        return this.classList?.contains('ag-combobox-vscroll') ? 288 : 0;
      },
    });
    /* no provider: jsdom cannot mount the provider's portal container, which
       kept the popup (and this test) permanently empty — REQ-CMP-72 */
    render(
      <Combobox.Root items={big} defaultOpen>
        <Combobox.Input placeholder="big" />
        <Combobox.Content>
          {(item: string) => (
            <Combobox.Item value={item}>{item}</Combobox.Item>
          )}
        </Combobox.Content>
      </Combobox.Root>,
    );
    await waitFor(() => expect(document.querySelectorAll('[data-ag-part="item"]').length).toBeGreaterThan(0));
    const rows = document.querySelectorAll('[data-ag-part="item"]');
    expect(rows.length).toBeLessThanOrEqual(60);
    const sized = document.querySelector('[aria-setsize]');
    expect(sized?.getAttribute('aria-setsize')).toBe('500');
    expect(document.querySelector('[aria-posinset]')?.getAttribute('aria-posinset')).toBe('1');
    /* End + ArrowDown keep aria-activedescendant pointing at a mounted node */
    Element.prototype.scrollIntoView ??= function () {};
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await act(async () => {});
    const ad = input.getAttribute('aria-activedescendant');
    expect(ad).toBeTruthy();
    expect(document.getElementById(ad!)).toBeTruthy();
    await userEvent.keyboard('{End}');
    await act(async () => {});
    const adEnd = input.getAttribute('aria-activedescendant');
    expect(adEnd).toBeTruthy();
    /* BU doesn't move the highlight on End without layout (jsdom), but the
       pointed-at node must always be mounted — the virtual window covers it */
    expect(document.getElementById(adEnd!)).toBeTruthy();
    if (origH) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', origH);
  });

  // REQ-CMP-73: autocomplete mode — the free text is the value.
  it('autocomplete mode: typing calls onValueChange with the typed string and selects no item', async () => {
    const onValueChange = jest.fn();
    render(<Demo mode="autocomplete" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    input.focus();
    await userEvent.type(input, 'foo');
    await act(async () => {});
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls.map((c) => c[0])).toEqual(['f', 'fo', 'foo']);
    expect(input.value).toBe('foo');
    // no option is selected by free text
    expect(document.querySelectorAll('[data-ag-part="item"][aria-selected="true"]').length).toBe(0);
  });

  it('loadOptions waits the default 250 ms of quiet: not called at 249 ms, called at 250 ms', async () => {
    jest.useFakeTimers();
    try {
      const loadOptions = jest.fn((_q: string, _ctx: { signal: AbortSignal }) => Promise.resolve(['A1']));
      render(<Demo loadOptions={loadOptions} />);
      const input = screen.getByRole('combobox') as HTMLInputElement;
      input.focus();
      fireEvent.change(input, { target: { value: 'q' } });
      act(() => { jest.advanceTimersByTime(249); });
      expect(loadOptions).not.toHaveBeenCalled();
      act(() => { jest.advanceTimersByTime(1); });
      expect(loadOptions).toHaveBeenCalledTimes(1);
      expect(loadOptions.mock.calls[0]![0]).toBe('q');
      // more typing restarts the quiet window
      fireEvent.change(input, { target: { value: 'qr' } });
      act(() => { jest.advanceTimersByTime(200); });
      fireEvent.change(input, { target: { value: 'qrs' } });
      act(() => { jest.advanceTimersByTime(249); });
      expect(loadOptions).toHaveBeenCalledTimes(1);
      act(() => { jest.advanceTimersByTime(1); });
      expect(loadOptions).toHaveBeenCalledTimes(2);
      expect(loadOptions.mock.calls[1]![0]).toBe('qrs');
      await act(async () => {});
    } finally {
      jest.useRealTimers();
    }
  });

  it('messages.loadError overrides the rejection text (legacy loadFailed still honoured)', async () => {
    const loadOptions = jest.fn(() => Promise.reject(new Error('boom')));
    const { unmount } = render(<Demo loadOptions={loadOptions} loadDebounceMs={10} messages={{ loadError: 'Fetch failed' }} />);
    let input = await openList();
    fireEvent.change(input, { target: { value: 'a' } });
    await waitFor(() => expect(document.querySelector('[data-ag-part="empty"]')?.textContent ?? '').toContain('Fetch failed'));
    unmount();
    render(<Demo loadOptions={loadOptions} loadDebounceMs={10} messages={{ loadFailed: 'Old key' }} />);
    input = await openList();
    fireEvent.change(input, { target: { value: 'b' } });
    await waitFor(() => expect(document.querySelector('[data-ag-part="empty"]')?.textContent ?? '').toContain('Old key'));
  });
});

/* REQ-CMP-72: owned virtualisation over Base UI's FILTERED items. */
describe('Combobox virtual list (REQ-CMP-72)', () => {
  const HUGE = Array.from({ length: 10_000 }, (_, i) => `Row ${i}`);
  function Huge(props: Record<string, unknown>) {
    return (
      <Combobox.Root items={HUGE} defaultOpen {...props}>
        <Combobox.Input placeholder="huge" />
        <Combobox.Content>
          {(item: string) => <Combobox.Item value={item}>{item}</Combobox.Item>}
        </Combobox.Content>
      </Combobox.Root>
    );
  }
  const options = () => [...document.querySelectorAll<HTMLElement>('[data-ag-part="item"]')];
  const activeNode = (input: HTMLInputElement) => {
    const id = input.getAttribute('aria-activedescendant');
    return id ? document.getElementById(id) : null;
  };
  Element.prototype.scrollIntoView ??= function () {};

  it('10,000 items mount at most 60 option nodes with total setsize', async () => {
    render(<Huge />);
    await waitFor(() => expect(options().length).toBeGreaterThan(0));
    expect(options().length).toBeLessThanOrEqual(60);
    expect(options()[0]).toHaveAttribute('aria-setsize', '10000');
    expect(options()[0]).toHaveAttribute('aria-posinset', '1');
  });

  it('typing filters the windowed rows and aria-setsize is the filtered count', async () => {
    render(<Huge />);
    await waitFor(() => expect(options().length).toBeGreaterThan(0));
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    await userEvent.type(input, 'Row 99');
    await act(async () => {});
    /* 'Row 99', 'Row 990'…'Row 999', 'Row 9900'…'Row 9999' = 1 + 10 + 100 */
    const expected = HUGE.filter((r) => r.includes('Row 99')).length;
    expect(expected).toBe(111);
    await waitFor(() => expect(options()[0]).toHaveTextContent(/^Row 99$/));
    const rows = options();
    expect(rows.length).toBeLessThanOrEqual(60);
    for (const r of rows) {
      expect(r.textContent).toContain('Row 99');
      expect(r).toHaveAttribute('aria-setsize', String(expected));
    }
    expect(rows.map((r) => r.getAttribute('aria-posinset')).slice(0, 3)).toEqual(['1', '2', '3']);
  });

  it('keyboard highlight past the window scrolls it in: activedescendant stays mounted', async () => {
    render(<Huge />);
    await waitFor(() => expect(options().length).toBeGreaterThan(0));
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    /* 40 ArrowDowns walk far past the initial window (~19 rows) */
    for (let i = 0; i < 40; i++) await userEvent.keyboard('{ArrowDown}');
    await act(async () => {});
    const node = activeNode(input);
    expect(node).not.toBeNull();
    expect(node).toHaveAttribute('data-ag-part', 'item');
    expect(Number(node!.getAttribute('aria-posinset'))).toBeGreaterThan(30);
    expect(options().length).toBeLessThanOrEqual(60);
    /* ArrowUp from the first row wraps to the last of 10,000 */
    await userEvent.keyboard('{Home}');
    for (let i = 0; i < 60; i++) {
      if (activeNode(input)?.getAttribute('aria-posinset') === '1') break;
      await userEvent.keyboard('{ArrowUp}');
    }
    expect(activeNode(input)).toHaveAttribute('aria-posinset', '1');
    await userEvent.keyboard('{ArrowUp}');
    await act(async () => {});
    const last = activeNode(input);
    expect(last).not.toBeNull();
    expect(last).toHaveTextContent('Row 9999');
    expect(last).toHaveAttribute('aria-posinset', '10000');
    expect(options().length).toBeLessThanOrEqual(60);
  });

  it('a scroll re-windows the rows on the next frame', async () => {
    render(<Huge />);
    await waitFor(() => expect(options().length).toBeGreaterThan(0));
    const scroller = document.querySelector<HTMLElement>('.ag-combobox-vscroll')!;
    Object.defineProperty(scroller, 'scrollTop', { configurable: true, value: 32 * 5000 });
    fireEvent.scroll(scroller);
    await waitFor(() => expect(Number(options()[0]!.getAttribute('aria-posinset'))).toBeGreaterThan(4990));
    expect(options().length).toBeLessThanOrEqual(60);
    expect(options().some((o) => o.textContent === 'Row 5000')).toBe(true);
  });
});
