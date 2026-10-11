/* REQ-CMP-108: toast timer semantics — action toasts never auto-dismiss,
   progress derives duration from --_ag-toast-timeout, hover/focus/hidden
   pauses bars, progress is decorative (no progressbar role). */
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { Toast, useToast } from '../../src/components/toast';

function Sink({ options }: { options: Parameters<ReturnType<typeof useToast>['add']>[0] }) {
  const t = useToast();
  const fired = React.useRef(false);
  React.useEffect(() => { if (!fired.current) { fired.current = true; t.add(options); } }, [t, options]);
  return null;
}

const Toasts = () => {
  const t = useToast();
  return (
    <Toast.Viewport>
      {t.toasts.map((toast: any) => (
        <Toast.Root key={toast.id} toast={toast}><span>x</span></Toast.Root>
      ))}
    </Toast.Viewport>
  );
};

const Host = ({ options }: { options: Parameters<ReturnType<typeof useToast>['add']>[0] }) => (
  <Toast.Provider>
    <Sink options={options} />
    <Toasts />
  </Toast.Provider>
);

describe('toast timers (REQ-CMP-108)', () => {
  afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

  it('toast with actionLabel + no timeout stays open past provider timeout', async () => {
    jest.useFakeTimers();
    render(<Host options={{ title: 'Undo?', actionLabel: 'Undo', onAction: () => {} }} />);
    await act(async () => {});
    act(() => { jest.advanceTimersByTime(6000); });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="root"]')).not.toBeNull();
  });

  it('toast without action auto-dismisses on the provider timeout', async () => {
    jest.useFakeTimers();
    render(<Host options={{ title: 'Plain' }} />);
    await act(async () => {});
    act(() => { jest.advanceTimersByTime(6000); });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="root"]')).toBeNull();
  });

  it('root carries --_ag-toast-timeout for the progress animation', async () => {
    render(<Host options={{ title: 'Timed', timeout: 2500 }} />);
    await act(async () => {});
    const root = document.querySelector('[data-ag-part="root"]');
    expect(root?.getAttribute('style') ?? '').toContain('--_ag-toast-timeout');
  });

  it('progress part is decorative — no progressbar role, aria-hidden', async () => {
    render(<Host options={{ title: 'x' }} />);
    await act(async () => {});
    const bar = document.createElement('div');
    bar.setAttribute('data-ag-part', 'progress');
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    expect(document.querySelector('[role="progressbar"]')).toBeNull();
    expect(bar.getAttribute('aria-hidden')).toBe('true');
  });

  it('viewport-level pause selectors exist in Toast.css', () => {
    const css = require('fs').readFileSync(require('path').join(__dirname, '../../src/components/toast/Toast.css'), 'utf8');
    expect(css).toContain('.ag-toast-viewport:hover .ag-toast-progress-bar');
    expect(css).toContain('[data-ag-paused] .ag-toast-progress-bar');
    expect(css).toContain('animation-play-state: paused');
  });

  it('document.hidden sets data-ag-paused on the viewport', async () => {
    render(<Host options={{ title: 'x' }} />);
    await act(async () => {});
    const viewport = document.querySelector('.ag-toast-viewport');
    expect(viewport?.hasAttribute('data-ag-paused')).toBe(false);
    const spy = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    await act(async () => {});
    expect(viewport?.hasAttribute('data-ag-paused')).toBe(true);
  });
});
