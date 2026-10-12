import { describe, expect, it, jest, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../theme';
import { Toast, useToast } from './index';

function Host() {
  const t = useToast();
  return (
    <>
      <button onClick={() => t.info({ title: 'Saved', description: 'All good' })}>add-info</button>
      <button onClick={() => t.error({ title: 'Failed' })}>add-error</button>
      <button onClick={() => t.toast({ title: 'Payment failed', intent: 'danger', priority: 'high' })}>add-urgent</button>
      <button onClick={() => t.toast({ title: 'Saved', intent: 'success', priority: 'high' })}>add-bad-high</button>
      <button onClick={() => t.toast({ title: 'Undo?', action: { label: 'Undo', onClick: () => undefined } })}>add-action</button>
      <button onClick={() => t.add({ title: 'sticky', timeout: 0 })}>add-sticky</button>
      <button onClick={() => t.toasts[0] && t.close(t.toasts[0].id)}>close-first</button>
      <span data-testid="count">{t.toasts.length}</span>
      <span data-testid="hist">{t.history?.items.length ?? -1}</span>
      <span data-testid="unread">{t.history?.unread ?? -1}</span>
      <Toast.Viewport>
        {t.toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
            {toast.actionLabel ? <Toast.Action>{toast.actionLabel}</Toast.Action> : null}
            <Toast.Close>×</Toast.Close>
            <Toast.Progress />
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </>
  );
}

const renderHost = () => render(
  <AuraGlassProvider>
    <Toast.Provider>
      <Host />
    </Toast.Provider>
  </AuraGlassProvider>,
);

describe('Toast + useToast', () => {
  afterEach(() => { jest.useRealTimers(); });

  it('add renders the toast with role=status and parts', async () => {
    renderHost();
    fireEvent.click(screen.getByText('add-info'));
    await act(async () => {});
    const toast = document.querySelector('[data-ag-part="toast"]') as HTMLElement;
    expect(toast).not.toBeNull();
    expect(toast).toHaveAttribute('role', 'status');
    expect(toast).toHaveAttribute('data-ag-intent', 'info');
    expect(toast.querySelector('[data-ag-part="title"]')?.textContent).toBe('Saved');
    expect(toast.querySelector('[data-ag-part="progress"]')).not.toBeNull();
  });

  /* REQ-CMP-107: 'low' is the default priority for every intent. */
  it('danger intent without a priority → role=status (low is the default)', async () => {
    renderHost();
    fireEvent.click(screen.getByText('add-error'));
    await act(async () => {});
    const toast = document.querySelector('[data-ag-part="toast"]') as HTMLElement;
    expect(toast).toHaveAttribute('role', 'status');
    // contract Intent has no 'error': toast.error() emits the danger intent
    expect(toast).toHaveAttribute('data-ag-intent', 'danger');
  });

  it("priority 'high' + intent 'danger' → role=alert, no warning (REQ-CMP-107)", async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    renderHost();
    fireEvent.click(screen.getByText('add-urgent'));
    await act(async () => {});
    const toast = document.querySelector('[data-ag-part="toast"]') as HTMLElement;
    expect(toast).toHaveAttribute('role', 'alert');
    expect(warn.mock.calls.filter((c) => String(c[0]).includes("priority 'high'"))).toHaveLength(0);
    warn.mockRestore();
  });

  it("priority 'high' on a non-danger intent dev-warns and stays role=status (REQ-CMP-107)", async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    renderHost();
    fireEvent.click(screen.getByText('add-bad-high'));
    await act(async () => {});
    const toast = document.querySelector('[data-ag-part="toast"]') as HTMLElement;
    expect(toast).toHaveAttribute('role', 'status');
    const msgs = warn.mock.calls.filter((c) => String(c[0]).includes("priority 'high'"));
    expect(msgs).toHaveLength(1);
    expect(String(msgs[0]![0])).toContain("intent 'success'");
    warn.mockRestore();
  });

  it('exactly one live role per toast; the viewport is a labelled region (REQ-CMP-107)', async () => {
    renderHost();
    fireEvent.click(screen.getByText('add-info'));
    await act(async () => {});
    fireEvent.click(screen.getByText('add-urgent'));
    await act(async () => {});
    const toasts = [...document.querySelectorAll('[data-ag-part="toast"]')];
    expect(toasts).toHaveLength(2);
    for (const t of toasts) {
      const live = [t, ...t.querySelectorAll('*')].filter((n) => n.matches('[role="status"],[role="alert"],[aria-live]'));
      expect(live).toEqual([t]);
    }
    const viewport = document.querySelector('[data-ag-part="viewport"]') as HTMLElement;
    expect(viewport).toHaveAttribute('aria-label', 'Notifications');
    expect(viewport.closest('[data-ag-layer-root="toast"]')).not.toBeNull();
  });

  /* REQ-CMP-109: one SurfaceGroup hosts the stack; each root gets --toast-index. */
  it('3 toasts share one SurfaceGroup (one blurred layer) and carry --toast-index 0..2 (REQ-CMP-109)', async () => {
    renderHost();
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByText('add-info'));
      await act(async () => {});
    }
    const viewport = document.querySelector('[data-ag-part="viewport"]') as HTMLElement;
    const groups = viewport.querySelectorAll('[data-ag-group]');
    expect(groups).toHaveLength(1);
    const group = groups[0] as HTMLElement;
    // the group host is the one surface that keeps its backdrop: a chrome surface
    expect(group).toHaveAttribute('data-ag-surface');
    expect(group).toHaveAttribute('data-ag-layer', 'chrome');
    const toasts = [...viewport.querySelectorAll<HTMLElement>('[data-ag-part="toast"]')];
    expect(toasts).toHaveLength(3);
    // MAT drops the backdrop of every DIRECT child surface of [data-ag-group]
    for (const t of toasts) {
      expect(t.parentElement).toBe(group);
      expect(t).toHaveAttribute('data-ag-layer', 'overlay');
      expect(t).toHaveAttribute('data-ag-thickness', 'thin');
    }
    expect(toasts.map((t) => t.style.getPropertyValue('--toast-index')).sort()).toEqual(['0', '1', '2']);
  });

  it('empty viewport renders no SurfaceGroup (REQ-CMP-109)', () => {
    renderHost();
    const viewport = document.querySelector('[data-ag-part="viewport"]') as HTMLElement;
    expect(viewport.querySelector('[data-ag-group]')).toBeNull();
  });

  /* REQ-CMP-20: Toast.Action and Toast.Close render a hit-area. */
  it('Action and Close each render one aria-hidden hit-area (REQ-CMP-20)', async () => {
    renderHost();
    fireEvent.click(screen.getByText('add-action'));
    await act(async () => {});
    for (const part of ['action', 'close']) {
      const el = document.querySelector(`[data-ag-part="${part}"]`) as HTMLElement;
      expect(el).not.toBeNull();
      const hits = el.querySelectorAll(':scope > [data-ag-part="hit-area"]');
      expect(hits).toHaveLength(1);
      expect(hits[0]).toHaveAttribute('aria-hidden', 'true');
    }
    expect(document.querySelector('[data-ag-part="action"]')!.textContent).toBe('Undo');
  });

  it('viewport mounts in the toast layer with a position attr', async () => {
    renderHost();
    const viewport = document.querySelector('[data-ag-part="viewport"]') as HTMLElement;
    expect(viewport).not.toBeNull();
    expect(viewport).toHaveAttribute('data-position', 'bottom-right');
    expect(viewport.closest('[data-ag-layer-root="toast"]')).not.toBeNull();
  });

  it('auto-dismiss after timeout (5000ms default)', async () => {
    jest.useFakeTimers();
    renderHost();
    fireEvent.click(screen.getByText('add-info'));
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="toast"]')).not.toBeNull();
    act(() => { jest.advanceTimersByTime(5100); });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="toast"]')).toBeNull();
  });

  it('timeout=0 keeps the toast until closed; close clears + marks history', async () => {
    jest.useFakeTimers();
    renderHost();
    fireEvent.click(screen.getByText('add-sticky'));
    await act(async () => {});
    act(() => { jest.advanceTimersByTime(30000); });
    expect(document.querySelector('[data-ag-part="toast"]')).not.toBeNull();
    fireEvent.click(document.querySelector('[data-ag-part="close"]') as HTMLElement);
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="toast"]')).toBeNull();
  });

  it('limit=3 marks the oldest limited', async () => {
    renderHost();
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText('add-info'));
      await act(async () => {});
    }
    const limited = document.querySelectorAll('[data-limited]');
    expect(limited.length).toBeGreaterThanOrEqual(1);
  });

  it('F6 focuses the viewport', async () => {
    renderHost();
    fireEvent.click(screen.getByText('add-info'));
    await act(async () => {});
    fireEvent.keyDown(document.body, { key: 'F6' });
    await act(async () => {});
    const viewport = document.querySelector('[data-ag-part="viewport"]');
    expect(document.activeElement === viewport || viewport?.contains(document.activeElement)).toBe(true);
  });


  /* REQ-CMP-106 — per-provider managers + nested/no-provider guards. */
  it('sibling providers keep separate toasts (REQ-CMP-106)', () => {
    const Sink = ({ tag }: { tag: string }) => {
      const t = useToast();
      return <button data-testid={`add-${tag}`} onClick={() => t.info({ title: tag })}>go</button>;
    };
    const A = () => {
      const t = useToast();
      return <span data-testid="count-a">{t.toasts.length}</span>;
    };
    const B = () => {
      const t = useToast();
      return <span data-testid="count-b">{t.toasts.length}</span>;
    };
    render(
      <>
        <Toast.Provider><Sink tag="a" /><A /></Toast.Provider>
        <Toast.Provider><Sink tag="b" /><B /></Toast.Provider>
      </>,
    );
    fireEvent.click(screen.getByTestId('add-a'));
    expect(screen.getByTestId('count-a').textContent).toBe('1');
    expect(screen.getByTestId('count-b').textContent).toBe('0');
  });

  it('nested Toast.Provider logs one console.error (REQ-CMP-106)', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <Toast.Provider>
        <Toast.Provider><div /></Toast.Provider>
      </Toast.Provider>,
    );
    const msgs = spy.mock.calls.filter((c) => String(c[0]).includes('must not be nested'));
    expect(msgs).toHaveLength(1);
    spy.mockRestore();
  });

  it('useToast outside provider: one error, add() returns "" and does not throw (REQ-CMP-106)', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    let id = 'unset';
    const Orphan = () => {
      const t = useToast();
      id = t.add({ title: 'x' });
      return null;
    };
    expect(() => render(<Orphan />)).not.toThrow();
    expect(id).toBe('');
    const msgs = spy.mock.calls.filter((c) => String(c[0]).includes('outside Toast.Provider'));
    expect(msgs).toHaveLength(1);
    spy.mockRestore();
  });
});

describe('Toast history (REQ-CMP-110)', () => {
  function HistHost() {
    const t = useToast();
    return (
      <>
        <button onClick={() => t.add({ title: 'One', description: 'd1' })}>add</button>
        <button onClick={() => t.add({ title: 'Brief', timeout: 1000 })}>add-brief</button>
        <button onClick={() => t.toasts[0] && t.close(t.toasts[0].id)}>dismiss</button>
        <button onClick={() => t.history?.markAllRead()}>mark-all</button>
        <button onClick={() => t.history?.clear()}>clear</button>
        <span data-testid="items">{t.history === null ? 'null' : t.history.items.length}</span>
        <span data-testid="unread">{t.history?.unread ?? -1}</span>
        <Toast.Viewport>
          {t.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}><Toast.Title>{toast.title}</Toast.Title></Toast.Root>
          ))}
        </Toast.Viewport>
        <Toast.History />
      </>
    );
  }
  const renderHist = (history?: boolean | { limit: number }) => render(
    <Toast.Provider {...(history !== undefined ? { history } : {})}><HistHost /></Toast.Provider>,
  );

  it('history is null when Provider mounts with history={false}', async () => {
    renderHist(false);
    await act(async () => {});
    expect(screen.getByTestId('items').textContent).toBe('null');
    expect(document.querySelectorAll('.ag-toast-history li')).toHaveLength(0);
  });

  it('history is null when the history prop is omitted (default false, REQ-CMP-106)', async () => {
    renderHist();
    await act(async () => {});
    expect(screen.getByTestId('items').textContent).toBe('null');
    fireEvent.click(screen.getByText('add'));
    await act(async () => {});
    fireEvent.click(screen.getByText('dismiss'));
    await act(async () => {});
    expect(screen.getByTestId('items').textContent).toBe('null');
    expect(document.querySelectorAll('.ag-toast-history li')).toHaveLength(0);
  });

  it('an open toast is not in history; it lands there once dismissed (REQ-CMP-110)', async () => {
    renderHist(true);
    await act(async () => {});
    fireEvent.click(screen.getByText('add'));
    await act(async () => {});
    expect(screen.getByTestId('items').textContent).toBe('0');
    fireEvent.click(screen.getByText('dismiss'));
    await act(async () => {});
    expect(screen.getByTestId('items').textContent).toBe('1');
    const li = document.querySelector('.ag-toast-history li') as HTMLElement;
    expect(li.textContent).toContain('One');
    expect(li.textContent).toContain('d1');
  });

  it('a toast that expires via its timeout lands in history (REQ-CMP-110)', async () => {
    jest.useFakeTimers();
    renderHist(true);
    await act(async () => {});
    fireEvent.click(screen.getByText('add-brief'));
    await act(async () => {});
    expect(screen.getByTestId('items').textContent).toBe('0');
    act(() => { jest.advanceTimersByTime(1100); });
    await act(async () => {});
    act(() => { jest.advanceTimersByTime(1000); });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="toast"]')).toBeNull();
    expect(screen.getByTestId('items').textContent).toBe('1');
    expect(screen.getByTestId('unread').textContent).toBe('1');
    expect(document.querySelector('.ag-toast-history li')?.textContent).toContain('Brief');
    jest.useRealTimers();
  });

  it('after add+dismiss: items.length===1 and unread===1', async () => {
    renderHist(true);
    await act(async () => {});
    fireEvent.click(screen.getByText('add'));
    await act(async () => {});
    fireEvent.click(screen.getByText('dismiss'));
    await act(async () => {});
    expect(screen.getByTestId('items').textContent).toBe('1');
    expect(screen.getByTestId('unread').textContent).toBe('1');
  });

  it('markAllRead drops unread to 0; Toast.History renders an li per item', async () => {
    renderHist(true);
    await act(async () => {});
    fireEvent.click(screen.getByText('add'));
    await act(async () => {});
    fireEvent.click(screen.getByText('dismiss'));
    await act(async () => {});
    expect(document.querySelectorAll('.ag-toast-history li')).toHaveLength(1);
    expect(screen.getByTestId('unread').textContent).toBe('1');
    fireEvent.click(screen.getByText('mark-all'));
    await act(async () => {});
    expect(screen.getByTestId('unread').textContent).toBe('0');
  });

  it('clear empties items; history={limit:1} caps stored items', async () => {
    renderHist({ limit: 1 });
    await act(async () => {});
    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByText('add'));
      await act(async () => {});
      fireEvent.click(screen.getByText('dismiss'));
      await act(async () => {});
    }
    expect(screen.getByTestId('items').textContent).toBe('1');
    fireEvent.click(screen.getByText('clear'));
    await act(async () => {});
    expect(screen.getByTestId('items').textContent).toBe('0');
  });
  it('persistent toast (timeout 0) hides the progress track instead of a 0ms run', async () => {
    renderHost();
    fireEvent.click(screen.getByText('add-sticky'));
    await act(async () => {});
    const root = document.querySelector<HTMLElement>('[data-ag-part="toast"]')!;
    expect(root.style.getPropertyValue('--_ag-toast-progress-display')).toBe('none');
    expect(root.style.getPropertyValue('--_ag-toast-timeout')).toBe('');
  });
});
