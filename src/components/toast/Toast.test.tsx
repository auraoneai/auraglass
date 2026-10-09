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
      <button onClick={() => t.add({ title: 'sticky', timeout: 0 })}>add-sticky</button>
      <button onClick={() => t.toasts[0] && t.close(t.toasts[0].id)}>close-first</button>
      <span data-testid="count">{t.toasts.length}</span>
      <span data-testid="hist">{t.history.length}</span>
      <Toast.Viewport>
        {t.toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
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
    const toast = document.querySelector('[data-ag-part="root"]') as HTMLElement;
    expect(toast).not.toBeNull();
    expect(toast).toHaveAttribute('role', 'status');
    expect(toast).toHaveAttribute('data-ag-intent', 'info');
    expect(toast.querySelector('[data-ag-part="title"]')?.textContent).toBe('Saved');
    expect(toast.querySelector('[data-ag-part="progress"]')).not.toBeNull();
    // history records it
    expect(screen.getByTestId('hist').textContent).toBe('1');
  });

  it('error intent → role=alert', async () => {
    renderHost();
    fireEvent.click(screen.getByText('add-error'));
    await act(async () => {});
    const toast = document.querySelector('[data-ag-part="root"]') as HTMLElement;
    expect(toast).toHaveAttribute('role', 'alert');
    expect(toast).toHaveAttribute('data-ag-intent', 'error');
  });

  it('viewport mounts in the toast layer with a position attr', async () => {
    renderHost();
    const viewport = document.querySelector('[data-ag-part="viewport"]') as HTMLElement;
    expect(viewport).not.toBeNull();
    expect(viewport).toHaveAttribute('data-ag-position', 'bottom-right');
    expect(viewport.closest('[data-ag-layer-root="toast"]')).not.toBeNull();
  });

  it('auto-dismiss after timeout (5000ms default)', async () => {
    jest.useFakeTimers();
    renderHost();
    fireEvent.click(screen.getByText('add-info'));
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="root"]')).not.toBeNull();
    act(() => { jest.advanceTimersByTime(5100); });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="root"]')).toBeNull();
  });

  it('timeout=0 keeps the toast until closed; close clears + marks history', async () => {
    jest.useFakeTimers();
    renderHost();
    fireEvent.click(screen.getByText('add-sticky'));
    await act(async () => {});
    act(() => { jest.advanceTimersByTime(30000); });
    expect(document.querySelector('[data-ag-part="root"]')).not.toBeNull();
    fireEvent.click(document.querySelector('[data-ag-part="close"]') as HTMLElement);
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="root"]')).toBeNull();
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
